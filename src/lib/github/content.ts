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
  sha?: string,
  branch?: string
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
        ...(branch ? { branch } : {}),
      },
    }
  );
}

/**
 * 파일 1개를 삭제 커밋한다.
 * 트랙 B 롤백에 쓴다 — revert 커밋이 아니라 우리가 넣은 파일만 지우는 최소 연산이라
 * 사용자의 다른 커밋과 간섭할 수 없다.
 */
export async function deleteFileContent(
  token: string,
  owner: string,
  repo: string,
  path: string,
  sha: string,
  message: string,
  branch?: string
): Promise<void> {
  await githubFetch(`/repos/${owner}/${repo}/contents/${path}`, {
    token,
    method: 'DELETE',
    body: { message, sha, ...(branch ? { branch } : {}) },
  });
}
