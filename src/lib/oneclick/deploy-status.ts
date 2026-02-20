import { getGitHubPagesStatus, getLatestWorkflowRun, GitHubApiError } from '@/lib/github/api';

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
  currentPagesUrl: string | null
): Promise<DeployStatusResult> {
  const [owner, repo] = repoFullName.split('/');

  try {
    const pagesInfo = await getGitHubPagesStatus(githubToken, owner, repo);
    const pagesStatus = pagesInfo.status;

    let newDeployStatus = currentDeployStatus;
    let newPagesStatus = currentPagesStatus;
    let errorMessage: string | null = null;

    if (pagesStatus === 'built') {
      newDeployStatus = 'ready';
      newPagesStatus = 'built';
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
          newDeployStatus = 'ready';
          newPagesStatus = 'built';
        } else if (run?.status === 'completed' && run.conclusion === 'failure') {
          newDeployStatus = 'error';
          newPagesStatus = 'errored';
          errorMessage = 'GitHub Actions 워크플로우 빌드에 실패했습니다. GitHub 레포지토리의 Actions 탭에서 로그를 확인해주세요.';
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
      { name: 'repo', status: repoStep, label: '레포지토리 생성' },
      { name: 'pages', status: pagesStep, label: 'GitHub Pages 활성화' },
      { name: 'live', status: liveStep, label: '사이트 게시 완료' },
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
