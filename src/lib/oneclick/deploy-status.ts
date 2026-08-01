import { getGitHubPagesStatus, getLatestWorkflowRun, getLatestPagesDeployment, triggerWorkflowDispatch, GitHubApiError } from '@/lib/github/api';

export type StepStatus = 'completed' | 'in_progress' | 'pending' | 'error';

export interface DeployStep {
  name: string;
  status: StepStatus;
  label: string;
}

export interface DeployStatusResult {
  deployStatus: string;
  pagesStatus: string;
  pagesUrl: string | null;
  deploymentUrl: string | null;
  errorMessage: string | null;
  changed: boolean;
  /** true when an automatic retry was triggered (caller should increment retry_count) */
  retryTriggered?: boolean;
}

export interface ResolveDeployOptions {
  /** ISO timestamp of when the deploy was created */
  createdAt?: string;
  /** ISO timestamp of when the deploy record was last updated (deploy_status 변경 시점 — 타임아웃 기준) */
  updatedAt?: string;
  /** Current retry count from DB (0 = no retries yet) */
  retryCount?: number;
  /**
   * 이 배포가 실제로 사용하는 워크플로우 파일·브랜치 (config_data 기록값).
   * 트랙 B(가져온 저장소)는 `linkmap-pages.yml`·사용자 기본 브랜치를 쓰므로 기본값을 쓰면
   * 사용자 저장소의 `deploy.yml`(대개 프로덕션 배포 파이프라인)을 실행시키게 된다.
   */
  workflowFile?: string;
  workflowBranch?: string;
  /** 가져온 저장소는 우리 소유가 아니므로 자동 재시도를 하지 않는다 */
  allowAutoRetry?: boolean;
}

/** 타임아웃: 마지막 활동(updated_at: 배포 시작/재배포/편집) 기준 15분 무진전 시 에러 (GitHub Actions 평균 3-5분, 최악 8분 + CDN 2분 + 여유 5분) */
const DEPLOY_TIMEOUT_MS = 15 * 60 * 1000;

/**
 * Check if a GitHub Pages URL is actually accessible (returns 2xx).
 * Used to prevent false-positive "ready" status when CDN hasn't propagated.
 */
async function isPagesUrlAccessible(pagesUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(pagesUrl, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(tid);
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Resolve the current deploy status by checking GitHub Pages API and Actions workflow.
 * Used by both status/route.ts (single deploy polling) and deployments/route.ts (batch refresh).
 */
/**
 * 배포 행에서 워크플로우 관련 옵션을 뽑는다.
 *
 * 트랙 B(import)는 워크플로우 파일명·브랜치가 템플릿과 다르고 저장소가 사용자 자산이므로,
 * 이 값을 넘기지 않으면 상태 판정이 남의 워크플로우 실행을 읽고 자동 재시도가
 * 사용자의 `deploy.yml`을 실행시킨다.
 */
export function workflowOptionsFromDeploy(deploy: {
  source_type?: string | null;
  config_data?: unknown;
}): Pick<ResolveDeployOptions, 'workflowFile' | 'workflowBranch' | 'allowAutoRetry'> {
  const isImported = deploy.source_type === 'import';
  const config = (deploy.config_data ?? {}) as { workflow_file?: unknown; source_branch?: unknown };
  return {
    workflowFile: typeof config.workflow_file === 'string' ? config.workflow_file : undefined,
    workflowBranch: typeof config.source_branch === 'string' ? config.source_branch : 'main',
    allowAutoRetry: !isImported,
  };
}

export async function resolveDeployStatus(
  githubToken: string,
  repoFullName: string,
  currentDeployStatus: string,
  currentPagesStatus: string,
  currentPagesUrl: string | null,
  options?: ResolveDeployOptions
): Promise<DeployStatusResult> {
  const [owner, repo] = repoFullName.split('/');
  const retryCount = options?.retryCount ?? 0;
  const workflowFile = options?.workflowFile;
  const workflowBranch = options?.workflowBranch ?? 'main';
  const allowAutoRetry = options?.allowAutoRetry ?? true;

  // Timeout: 마지막 활동(updated_at) 기준 15분 무진전 시 에러.
  // updated_at은 redeploy/batch-update가 갱신하므로 오래된 배포의 재배포도 그 시점부터 새 윈도우를 받는다.
  // ⚠️ created_at 기준 절대 상한은 두지 않는다 — 60분 이상 된 배포를 재배포할 때 즉시 타임아웃되는 버그가 되기 때문.
  // 타임아웃 판정은 GitHub 실제 상태를 확인한 "뒤"에 한다(아래) — 느려도 성공한 빌드를 잘못 실패시키지 않기 위함.
  const now = Date.now();
  const timeoutBase = options?.updatedAt ?? options?.createdAt;
  const timedOut = timeoutBase != null && now - new Date(timeoutBase).getTime() > DEPLOY_TIMEOUT_MS;
  const timeoutResult = (): DeployStatusResult => ({
    deployStatus: 'error',
    pagesStatus: 'errored',
    pagesUrl: currentPagesUrl,
    deploymentUrl: null,
    errorMessage: '배포 시간이 초과되었습니다. 재배포를 시도해주세요.',
    changed: currentDeployStatus !== 'error',
  });

  try {
    const pagesInfo = await getGitHubPagesStatus(githubToken, owner, repo);
    const pagesStatus = pagesInfo.status;

    let newDeployStatus = currentDeployStatus;
    let newPagesStatus = currentPagesStatus;
    let errorMessage: string | null = null;
    let retryTriggered = false;

    if (pagesStatus === 'built') {
      // Pages API reports built — verify actual accessibility before marking ready
      const resolvedUrl = pagesInfo.html_url || currentPagesUrl;
      if (resolvedUrl && !(await isPagesUrlAccessible(resolvedUrl))) {
        // Site not yet accessible (CDN propagation delay) — stay building
        newDeployStatus = 'building';
        newPagesStatus = 'building';
      } else {
        newDeployStatus = 'ready';
        newPagesStatus = 'built';
      }
    } else if (pagesStatus === 'building') {
      newDeployStatus = 'building';
      newPagesStatus = 'building';
    } else if (pagesStatus === 'errored') {
      newDeployStatus = 'error';
      newPagesStatus = 'errored';
    } else if (pagesStatus === null) {
      // build_type: 'workflow' — Pages API always returns status: null.
      // Must check Actions workflow run to determine actual deploy state.
      try {
        const run = await getLatestWorkflowRun(githubToken, owner, repo, workflowFile, workflowBranch);
        if (run?.status === 'completed' && run.conclusion === 'success') {
          // Actions 완료 후 Pages CDN 전파 완료 여부 추가 확인.
          const pagesDeploy = await getLatestPagesDeployment(githubToken, owner, repo);
          if (pagesDeploy?.status === 'in_progress') {
            // CDN 전파 진행 중 — 아직 ready 아님
            newDeployStatus = 'building';
            newPagesStatus = 'building';
          } else {
            // CDN 완료 또는 API 미지원 — 실제 URL 접근 가능한지 최종 확인
            const resolvedUrl = pagesInfo.html_url || currentPagesUrl;
            if (resolvedUrl && !(await isPagesUrlAccessible(resolvedUrl))) {
              newDeployStatus = 'building';
              newPagesStatus = 'building';
            } else {
              newDeployStatus = 'ready';
              newPagesStatus = 'built';
            }
          }
        } else if (run?.status === 'completed' && run.conclusion === 'failure') {
          // Auto-retry once on workflow failure (가져온 저장소는 자동 재시도 금지 — 수동 재배포만)
          if (allowAutoRetry && retryCount < 1) {
            try {
              await triggerWorkflowDispatch(githubToken, owner, repo, workflowFile, workflowBranch);
              retryTriggered = true;
              newDeployStatus = 'building';
              newPagesStatus = 'building';
              errorMessage = null;
            } catch {
              // Retry trigger failed — mark as error
              newDeployStatus = 'error';
              newPagesStatus = 'errored';
              errorMessage = 'GitHub Actions 워크플로우 빌드에 실패했습니다. GitHub 레포지토리의 Actions 탭에서 로그를 확인해주세요.';
            }
          } else {
            newDeployStatus = 'error';
            newPagesStatus = 'errored';
            errorMessage = '자동 재시도 후에도 빌드에 실패했습니다. GitHub 레포지토리의 Actions 탭에서 로그를 확인해주세요.';
          }
        } else if (run?.status === 'completed' && run.conclusion === 'cancelled') {
          newDeployStatus = 'error';
          newPagesStatus = 'errored';
          errorMessage = 'GitHub Actions 워크플로우가 취소되었습니다.';
        } else {
          // Workflow still running or no runs yet — keep as building
          newDeployStatus = 'building';
          newPagesStatus = 'enabling';
        }
      } catch {
        // Couldn't check workflow — keep as building
        newDeployStatus = 'building';
        newPagesStatus = 'enabling';
      }
    }

    // GitHub 실제 상태를 확정한 뒤, 여전히 building인 경우에만 타임아웃 적용.
    // → 느리게라도 ready가 됐거나 명확히 error로 판정된 빌드는 시계와 무관하게 그대로 보고
    //   (혼잡한 GitHub 러너로 15분을 넘겨 성공한 빌드를 잘못 실패시키지 않기 위함 — 범용성).
    if (timedOut && newDeployStatus !== 'ready' && newDeployStatus !== 'error') {
      return timeoutResult();
    }

    const changed = newDeployStatus !== currentDeployStatus || newPagesStatus !== currentPagesStatus;
    const resolvedPagesUrl = pagesInfo.html_url || currentPagesUrl;

    return {
      deployStatus: newDeployStatus,
      pagesStatus: newPagesStatus,
      pagesUrl: resolvedPagesUrl,
      deploymentUrl: newDeployStatus === 'ready' ? resolvedPagesUrl : null,
      errorMessage,
      changed,
      retryTriggered: retryTriggered || undefined,
    };
  } catch (err) {
    if (err instanceof GitHubApiError && err.status === 404) {
      // Pages not yet enabled — 아직 활성화 전. 단 마지막 활동 후 15분 초과면 실패로 판정.
      if (timedOut) return timeoutResult();
      return {
        deployStatus: currentDeployStatus,
        pagesStatus: currentPagesStatus,
        pagesUrl: currentPagesUrl,
        deploymentUrl: null,
        errorMessage: null,
        changed: false,
      };
    }
    throw err;
  }
}

/**
 * Build the deploy step indicators for the status UI.
 */
export function buildDeploySteps(
  deploy: Record<string, unknown>,
  deployMethod: string
): DeployStep[] {
  const forkStatus = deploy.fork_status as string;
  const deployStatus = deploy.deploy_status as string;

  if (deployMethod === 'github_pages') {
    const pagesStatus = deploy.pages_status as string;

    const repoStep: StepStatus =
      forkStatus === 'forked' ? 'completed' :
      forkStatus === 'forking' ? 'in_progress' :
      forkStatus === 'failed' ? 'error' : 'pending';

    const pagesStep: StepStatus =
      repoStep !== 'completed' ? 'pending' :
      pagesStatus === 'built' ? 'completed' :
      pagesStatus === 'errored' ? 'error' :
      pagesStatus === 'enabling' || pagesStatus === 'building' ? 'in_progress' :
      'pending';

    const liveStep: StepStatus =
      deployStatus === 'ready' ? 'completed' :
      deployStatus === 'error' ? 'error' :
      pagesStep === 'completed' ? 'in_progress' :
      'pending';

    return [
      { name: 'repo', status: repoStep, label: '준비 중' },
      { name: 'pages', status: pagesStep, label: '설정 중' },
      { name: 'live', status: liveStep, label: '게시 완료' },
    ];
  }

  // LEGACY: Vercel deploy steps — kept for backward compatibility with
  // existing homepage_deploys rows where deploy_method = 'vercel'.
  // Do NOT add new features here. New deploys always use github_pages.
  const forkStep: StepStatus =
    forkStatus === 'forked' ? 'completed' :
    forkStatus === 'forking' ? 'in_progress' :
    forkStatus === 'failed' ? 'error' : 'pending';

  const projectStep: StepStatus =
    deployStatus === 'pending' ? 'pending' :
    deployStatus === 'creating' ? 'in_progress' :
    ['building', 'ready', 'error', 'canceled'].includes(deployStatus) ? 'completed' : 'pending';

  const buildStep: StepStatus =
    deployStatus === 'building' ? 'in_progress' :
    deployStatus === 'ready' ? 'completed' :
    deployStatus === 'error' ? 'error' :
    'pending';

  const deployStep: StepStatus =
    deployStatus === 'ready' ? 'completed' :
    deployStatus === 'error' ? 'error' :
    'pending';

  return [
    { name: 'fork', status: forkStep, label: '레포지토리 복사' },
    { name: 'project', status: projectStep, label: 'Vercel 프로젝트 생성' },
    { name: 'build', status: buildStep, label: '빌드 중...' },
    { name: 'deploy', status: deployStep, label: '배포 완료' },
  ];
}
