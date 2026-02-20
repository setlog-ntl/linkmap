import { githubFetch } from './client';

export interface GitHubContentItem {
  name: string;
  path: string;
  type: 'file' | 'dir' | 'symlink' | 'submodule';
  size: number;
  sha: string;
  html_url: string;
  download_url: string | null;
}

export interface GitHubFileContentResponse {
  name: string;
  path: string;
  sha: string;
  size: number;
  content: string; // base64 encoded
  encoding: string;
  html_url: string;
}

export interface GitHubFileContentResult {
  content: { name: string; path: string; sha: string; html_url: string };
  commit: { sha: string; message: string };
}

export async function listRepoContents(
  token: string,
  owner: string,
  repo: string,
  path: string = ''
): Promise<GitHubContentItem[]> {
  const apiPath = path ? `/repos/${owner}/${repo}/contents/${path}` : `/repos/${owner}/${repo}/contents`;
  return githubFetch<GitHubContentItem[]>(apiPath, { token });
}

export async function getFileContent(
  token: string,
  owner: string,
  repo: string,
  path: string
): Promise<GitHubFileContentResponse> {
  return githubFetch<GitHubFileContentResponse>(
    `/repos/${owner}/${repo}/contents/${path}`,
    { token }
  );
}

export async function createOrUpdateFileContent(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<GitHubFileContentResult> {
  const base64Content = Buffer.from(content).toString('base64');
  return githubFetch<GitHubFileContentResult>(
    `/repos/${owner}/${repo}/contents/${path}`,
    {
      token,
      method: 'PUT',
      body: {
        message,
        content: base64Content,
        ...(sha ? { sha } : {}),
      },
    }
  );
}
