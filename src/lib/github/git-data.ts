import { githubFetch, GitHubApiError } from './client';

interface GitBlob {
  sha: string;
  url: string;
}

interface GitTreeItem {
  path: string;
  mode: '100644' | '100755' | '040000' | '160000' | '120000';
  type: 'blob' | 'tree' | 'commit';
  sha: string;
}

interface GitTree {
  sha: string;
  url: string;
  tree: GitTreeItem[];
}

interface GitCommit {
  sha: string;
  url: string;
  message: string;
}

interface GitRef {
  ref: string;
  url: string;
  object: { sha: string; type: string };
}

export async function createBlob(
  token: string,
  owner: string,
  repo: string,
  content: string,
  encoding: 'utf-8' | 'base64' = 'utf-8'
): Promise<GitBlob> {
  return githubFetch<GitBlob>(`/repos/${owner}/${repo}/git/blobs`, {
    token,
    method: 'POST',
    body: { content, encoding },
  });
}

export async function createTree(
  token: string,
  owner: string,
  repo: string,
  treeItems: { path: string; mode: string; type: string; sha: string }[]
): Promise<GitTree> {
  return githubFetch<GitTree>(`/repos/${owner}/${repo}/git/trees`, {
    token,
    method: 'POST',
    body: { tree: treeItems },
  });
}

export async function createCommit(
  token: string,
  owner: string,
  repo: string,
  message: string,
  treeSha: string,
  parents: string[] = []
): Promise<GitCommit> {
  return githubFetch<GitCommit>(`/repos/${owner}/${repo}/git/commits`, {
    token,
    method: 'POST',
    body: { message, tree: treeSha, parents },
  });
}

export async function createRef(
  token: string,
  owner: string,
  repo: string,
  ref: string,
  sha: string
): Promise<GitRef> {
  return githubFetch<GitRef>(`/repos/${owner}/${repo}/git/refs`, {
    token,
    method: 'POST',
    body: { ref, sha },
  });
}

export async function getRef(
  token: string,
  owner: string,
  repo: string,
  ref: string
): Promise<GitRef | null> {
  try {
    return await githubFetch<GitRef>(`/repos/${owner}/${repo}/git/ref/${ref}`, { token });
  } catch (err) {
    if (err instanceof GitHubApiError && err.status === 404) return null;
    throw err;
  }
}

export async function updateRef(
  token: string,
  owner: string,
  repo: string,
  ref: string,
  sha: string,
  force: boolean = true
): Promise<GitRef> {
  return githubFetch<GitRef>(`/repos/${owner}/${repo}/git/refs/${ref}`, {
    token,
    method: 'PATCH',
    body: { sha, force },
  });
}

/**
 * Fetch the full recursive file tree for a repo branch (single API call).
 * Returns only blob (file) entries, not tree (directory) entries.
 */
export async function getGitTreeRecursive(
  token: string,
  owner: string,
  repo: string,
  branch: string = 'main'
): Promise<{ path: string; sha: string; size: number }[]> {
  const ref = await getRef(token, owner, repo, `heads/${branch}`);
  if (!ref) return [];

  const tree = await githubFetch<{ sha: string; tree: { path: string; mode: string; type: string; sha: string; size?: number }[]; truncated: boolean }>(
    `/repos/${owner}/${repo}/git/trees/${ref.object.sha}?recursive=1`,
    { token }
  );

  return tree.tree
    .filter((item) => item.type === 'blob')
    .map((item) => ({
      path: item.path,
      sha: item.sha,
      size: item.size ?? 0,
    }));
}

/**
 * Push multiple files to a repo as a single atomic commit.
 * Handles both empty repos (no prior commits) and non-empty repos (auto_init: true).
 */
export async function pushFilesAtomically(
  token: string,
  owner: string,
  repo: string,
  files: { path: string; content: string }[],
  message: string
): Promise<{ commitSha: string }> {
  // 0. Check if repo already has a main branch (non-empty repo)
  const existingRef = await getRef(token, owner, repo, 'heads/main');
  const parentSha = existingRef?.object?.sha ?? null;

  // 1. Create blobs for all files in parallel
  const blobResults = await Promise.all(
    files.map((file) => createBlob(token, owner, repo, file.content, 'utf-8'))
  );

  // 2. Build tree items
  const treeItems = files.map((file, i) => ({
    path: file.path,
    mode: '100644' as const,
    type: 'blob' as const,
    sha: blobResults[i].sha,
  }));

  // 3. Create tree
  const tree = await createTree(token, owner, repo, treeItems);

  // 4. Create commit (with parent if non-empty repo)
  const parents = parentSha ? [parentSha] : [];
  const commit = await createCommit(token, owner, repo, message, tree.sha, parents);

  // 5. Create or update ref (main branch)
  if (parentSha) {
    await updateRef(token, owner, repo, 'heads/main', commit.sha);
  } else {
    await createRef(token, owner, repo, 'refs/heads/main', commit.sha);
  }

  return { commitSha: commit.sha };
}
