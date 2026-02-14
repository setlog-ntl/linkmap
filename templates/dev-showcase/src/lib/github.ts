import type { ProjectItem } from './config';

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

export async function fetchGitHubRepos(
  username: string
): Promise<ProjectItem[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&per_page=6`,
      { cache: 'force-cache' }
    );
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();
    return repos.map((repo) => ({
      name: repo.name,
      description: repo.description || '',
      url: repo.html_url,
      language: repo.language || 'Unknown',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }));
  } catch {
    return [];
  }
}
