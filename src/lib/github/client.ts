/**
 * GitHub API client — shared fetch wrapper and error class.
 */

export const GITHUB_API_BASE = 'https://api.github.com';
export const USER_AGENT = 'Linkmap/1.0';

export interface GitHubRequestOptions {
  token: string;
  method?: string;
  body?: unknown;
}

export async function githubFetch<T>(path: string, opts: GitHubRequestOptions): Promise<T> {
  const res = await fetch(`${GITHUB_API_BASE}${path}`, {
    method: opts.method || 'GET',
    headers: {
      Authorization: `Bearer ${opts.token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': USER_AGENT,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new GitHubApiError(
      `GitHub API error: ${res.status} ${res.statusText}`,
      res.status,
      errorBody
    );
  }

  // DELETE returns 204 No Content
  if (res.status === 204) return {} as T;

  return res.json() as Promise<T>;
}

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: string
  ) {
    super(message);
    this.name = 'GitHubApiError';
  }
}
