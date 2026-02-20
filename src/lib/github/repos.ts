import { githubFetch } from './client';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string; avatar_url: string };
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
  updated_at: string;
  language: string | null;
}

export async function listUserRepos(token: string): Promise<GitHubRepo[]> {
  return githubFetch<GitHubRepo[]>(
    '/user/repos?sort=updated&per_page=50&affiliation=owner,collaborator',
    { token }
  );
}

export async function getRepo(token: string, owner: string, repo: string): Promise<GitHubRepo> {
  return githubFetch<GitHubRepo>(`/repos/${owner}/${repo}`, { token });
}

export async function createRepo(
  token: string,
  name: string,
  description: string,
  options?: { is_template?: boolean; auto_init?: boolean; has_issues?: boolean; private?: boolean }
): Promise<GitHubRepo> {
  return githubFetch<GitHubRepo>('/user/repos', {
    token,
    method: 'POST',
    body: {
      name,
      description,
      private: options?.private ?? false,
      auto_init: options?.auto_init ?? false,
      is_template: options?.is_template ?? false,
      has_issues: options?.has_issues ?? false,
    },
  });
}

export async function deleteRepo(
  token: string,
  owner: string,
  repo: string
): Promise<void> {
  await githubFetch(`/repos/${owner}/${repo}`, {
    token,
    method: 'DELETE',
  });
}

export async function updateRepoSettings(
  token: string,
  owner: string,
  repo: string,
  settings: { is_template?: boolean; description?: string; homepage?: string; has_pages?: boolean }
): Promise<GitHubRepo> {
  return githubFetch<GitHubRepo>(`/repos/${owner}/${repo}`, {
    token,
    method: 'PATCH',
    body: settings,
  });
}
