import { githubFetch } from './client';

export interface GitHubForkResult {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  owner: { login: string };
  default_branch: string;
}

export async function forkRepo(
  token: string,
  owner: string,
  repo: string,
  newName?: string
): Promise<GitHubForkResult> {
  return githubFetch<GitHubForkResult>(`/repos/${owner}/${repo}/forks`, {
    token,
    method: 'POST',
    body: {
      name: newName || repo,
      default_branch_only: true,
    },
  });
}

export interface GitHubGenerateResult {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  owner: { login: string };
  default_branch: string;
}

export async function generateFromTemplate(
  token: string,
  templateOwner: string,
  templateRepo: string,
  newName: string,
  description?: string
): Promise<GitHubGenerateResult> {
  return githubFetch<GitHubGenerateResult>(
    `/repos/${templateOwner}/${templateRepo}/generate`,
    {
      token,
      method: 'POST',
      body: {
        name: newName,
        description: description || `Generated from ${templateOwner}/${templateRepo}`,
        include_all_branches: false,
        private: false,
      },
    }
  );
}
