import { githubFetch, GitHubApiError, GITHUB_API_BASE, USER_AGENT } from './client';

export interface GitHubPagesResult {
  url: string;
  status: string | null;
  html_url: string;
}

export async function enableGitHubPages(
  token: string,
  owner: string,
  repo: string,
  branch: string = 'main',
  path: string = '/'
): Promise<GitHubPagesResult> {
  return githubFetch<GitHubPagesResult>(
    `/repos/${owner}/${repo}/pages`,
    {
      token,
      method: 'POST',
      body: {
        source: { branch, path },
      },
    }
  );
}

export async function enableGitHubPagesWithActions(
  token: string,
  owner: string,
  repo: string
): Promise<GitHubPagesResult> {
  return githubFetch<GitHubPagesResult>(
    `/repos/${owner}/${repo}/pages`,
    {
      token,
      method: 'POST',
      body: {
        build_type: 'workflow',
      },
    }
  );
}

/**
 * 이미 Pages가 켜진 저장소의 빌드 방식을 Actions 워크플로우로 전환한다.
 * 브랜치 빌드(legacy)로 켜져 있으면 워크플로우를 커밋해도 실행되지 않으므로 필요하다.
 */
export async function updatePagesBuildType(
  token: string,
  owner: string,
  repo: string
): Promise<void> {
  await githubFetch(`/repos/${owner}/${repo}/pages`, {
    token,
    method: 'PUT',
    body: { build_type: 'workflow' },
  });
}

export async function getGitHubPagesStatus(
  token: string,
  owner: string,
  repo: string
): Promise<GitHubPagesResult> {
  return githubFetch<GitHubPagesResult>(
    `/repos/${owner}/${repo}/pages`,
    { token }
  );
}

/**
 * Trigger a workflow_dispatch event for a specific workflow file.
 * Used to manually re-run a workflow after GitHub Pages is enabled.
 */
export async function triggerWorkflowDispatch(
  token: string,
  owner: string,
  repo: string,
  workflowFile: string = 'deploy.yml',
  ref: string = 'main'
): Promise<void> {
  const res = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/actions/workflows/${workflowFile}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': USER_AGENT,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ref }),
    }
  );

  // 204 = success, 404 = workflow not found (non-fatal)
  if (!res.ok && res.status !== 404) {
    const errorBody = await res.text().catch(() => '');
    throw new GitHubApiError(
      `GitHub API error: ${res.status} ${res.statusText}`,
      res.status,
      errorBody
    );
  }
}

/**
 * GitHub Pages Deployment status from the Pages Deployments API.
 * Reflects actual CDN propagation state — more accurate than Actions run status alone.
 */
export interface PagesDeployment {
  /** 'in_progress' | 'succeed' | 'failed' */
  status: string;
  environment_name: string;
  created_at: string;
  page_url: string | null;
}

/**
 * Get the latest GitHub Pages deployment.
 * Actions completion ≠ CDN propagation complete — this API tracks CDN state.
 * Returns null if the API is unavailable (non-fatal; caller should treat as 'ready').
 */
export async function getLatestPagesDeployment(
  token: string,
  owner: string,
  repo: string
): Promise<PagesDeployment | null> {
  try {
    const result = await githubFetch<PagesDeployment[]>(
      `/repos/${owner}/${repo}/pages/deployments?limit=1`,
      { token }
    );
    return Array.isArray(result) ? (result[0] ?? null) : null;
  } catch {
    // Beta API — may not be available for all repos/accounts. Non-fatal.
    return null;
  }
}

/**
 * Get the latest GitHub Actions workflow run for a repo.
 * Used to detect failed Pages deploy workflows.
 */
export interface WorkflowRun {
  id: number;
  status: 'queued' | 'in_progress' | 'completed' | 'waiting';
  conclusion: 'success' | 'failure' | 'cancelled' | 'timed_out' | 'action_required' | null;
  html_url: string;
  created_at: string;
}

/**
 * 배포 상태 판정에 쓸 최신 워크플로우 실행을 가져온다.
 *
 * workflowFile을 주면 해당 워크플로우의 실행만 조회한다. 가져온 사용자 저장소에는
 * 우리와 무관한 CI(lint/test 등)가 함께 돌기 때문에, 파일을 한정하지 않으면
 * 남의 실행 결과를 우리 배포 상태로 오독한다.
 */
export async function getLatestWorkflowRun(
  token: string,
  owner: string,
  repo: string,
  workflowFile?: string,
  branch: string = 'main'
): Promise<WorkflowRun | null> {
  const scope = workflowFile
    ? `/repos/${owner}/${repo}/actions/workflows/${workflowFile}/runs`
    : `/repos/${owner}/${repo}/actions/runs`;
  const result = await githubFetch<{ workflow_runs: WorkflowRun[] }>(
    `${scope}?per_page=1&branch=${encodeURIComponent(branch)}`,
    { token }
  );
  return result.workflow_runs[0] ?? null;
}
