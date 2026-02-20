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

export async function getLatestWorkflowRun(
  token: string,
  owner: string,
  repo: string
): Promise<WorkflowRun | null> {
  const result = await githubFetch<{ workflow_runs: WorkflowRun[] }>(
    `/repos/${owner}/${repo}/actions/runs?per_page=1&branch=main`,
    { token }
  );
  return result.workflow_runs[0] ?? null;
}
