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
  /** ISO timestamp of when the deploy was created (for timeout calculation) */
  createdAt?: string;
  /** Current retry count from DB (0 = no retries yet) */
  retryCount?: number;
}

/** Deploy timeout: 10 minutes from creation */
const DEPLOY_TIMEOUT_MS = 10 * 60 * 1000;

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

  // Timeout check: if deploy has been building for > 10 minutes, mark as error
  if (options?.createdAt) {
    const elapsed = Date.now() - new Date(options.createdAt).getTime();
    if (elapsed > DEPLOY_TIMEOUT_MS && currentDeployStatus !== 'ready') {
      return {
        deployStatus: 'error',
        pagesStatus: 'errored',
        pagesUrl: currentPagesUrl,
        deploymentUrl: null,
        errorMessage: '배포 시간이 초과되었습니다 (10분). 재배포를 시도해주세요.',
        changed: currentDeployStatus !== 'error',
      };
    }
  }

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
        const run = await getLatestWorkflowRun(githubToken, owner, repo);
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
          // Auto-retry once on workflow failure
          if (retryCount < 1) {
            try {
              await triggerWorkflowDispatch(githubToken, owner, repo);
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
      // Pages not yet enabled — keep current status
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
