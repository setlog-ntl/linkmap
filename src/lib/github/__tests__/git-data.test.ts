import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../client', () => {
  class GitHubApiError extends Error {
    status: number;
    body: unknown;
    constructor(message: string, status: number, body?: unknown) {
      super(message);
      this.status = status;
      this.body = body;
    }
  }
  return { githubFetch: vi.fn(), GitHubApiError };
});

import { pushFilesAtomically } from '../git-data';
import { githubFetch, GitHubApiError } from '../client';

type FetchCall = { path: string; opts?: { method?: string; body?: Record<string, unknown> } };

function recordedCalls(): FetchCall[] {
  return vi.mocked(githubFetch).mock.calls.map(([path, opts]) => ({
    path: String(path),
    opts: opts as FetchCall['opts'],
  }));
}

// emptyRepo=true면 ref 조회가 404 → 빈 레포 경로(createRef), false면 기존 레포 경로(updateRef)
function stubGitHubApi({ emptyRepo = true, blobDelayMs = 0 } = {}) {
  let blobCount = 0;
  let inFlightBlobs = 0;
  let maxInFlightBlobs = 0;

  vi.mocked(githubFetch).mockImplementation(async (path: string, opts?: unknown) => {
    const options = (opts ?? {}) as { method?: string; body?: Record<string, unknown> };

    if (path.includes('/git/ref/heads/')) {
      if (emptyRepo) throw new GitHubApiError('Not Found', 404, '');
      return { ref: 'refs/heads/main', url: '', object: { sha: 'parent-sha', type: 'commit' } } as never;
    }
    if (path.includes('/git/commits/parent-sha')) {
      return { tree: { sha: 'base-tree-sha' } } as never;
    }
    if (path.includes('/git/blobs')) {
      blobCount += 1;
      inFlightBlobs += 1;
      maxInFlightBlobs = Math.max(maxInFlightBlobs, inFlightBlobs);
      if (blobDelayMs > 0) await new Promise((r) => setTimeout(r, blobDelayMs));
      inFlightBlobs -= 1;
      return { sha: `blob-of-${options.body?.content}`, url: '' } as never;
    }
    if (path.includes('/git/trees')) {
      return { sha: 'tree-1', url: '', tree: [] } as never;
    }
    if (path.endsWith('/git/commits')) {
      return { sha: 'commit-1', url: '', message: '' } as never;
    }
    if (path.includes('/git/refs')) {
      return { ref: 'refs/heads/main', url: '', object: { sha: 'commit-1', type: 'commit' } } as never;
    }
    throw new Error(`unexpected githubFetch: ${path}`);
  });

  return {
    getBlobStats: () => ({ blobCount, maxInFlightBlobs }),
  };
}

describe('pushFilesAtomically', () => {
  beforeEach(() => vi.clearAllMocks());

  it('passes per-file encoding to blob creation and defaults to utf-8', async () => {
    stubGitHubApi();

    await pushFilesAtomically(
      'tok',
      'owner',
      'repo',
      [
        { path: 'index.html', content: 'HTML' },
        { path: 'img.png', content: 'QUFBQQ==', encoding: 'base64' },
      ],
      'msg'
    );

    const blobCalls = recordedCalls().filter((c) => c.path.includes('/git/blobs'));
    expect(blobCalls).toHaveLength(2);
    expect(blobCalls[0].opts?.body).toMatchObject({ content: 'HTML', encoding: 'utf-8' });
    expect(blobCalls[1].opts?.body).toMatchObject({ content: 'QUFBQQ==', encoding: 'base64' });
  });

  it('creates blobs with at most 8 concurrent requests', async () => {
    const api = stubGitHubApi({ blobDelayMs: 2 });
    const files = Array.from({ length: 20 }, (_, i) => ({ path: `f${i}.txt`, content: `c${i}` }));

    await pushFilesAtomically('tok', 'owner', 'repo', files, 'msg');

    const { blobCount, maxInFlightBlobs } = api.getBlobStats();
    expect(blobCount).toBe(20);
    expect(maxInFlightBlobs).toBeLessThanOrEqual(8);
    expect(maxInFlightBlobs).toBeGreaterThan(1);
  });

  it('preserves file order in tree items and pins mode to 100644', async () => {
    stubGitHubApi();
    const files = Array.from({ length: 10 }, (_, i) => ({ path: `f${i}.txt`, content: `c${i}` }));

    await pushFilesAtomically('tok', 'owner', 'repo', files, 'msg');

    const treeCall = recordedCalls().find((c) => c.path.includes('/git/trees'));
    const treeItems = treeCall?.opts?.body?.tree as { path: string; mode: string; type: string; sha: string }[];
    expect(treeItems).toHaveLength(10);
    treeItems.forEach((item, i) => {
      expect(item.path).toBe(`f${i}.txt`);
      expect(item.sha).toBe(`blob-of-c${i}`);
      expect(item.mode).toBe('100644');
      expect(item.type).toBe('blob');
    });
  });

  it('creates a new ref without parents for an empty repo', async () => {
    stubGitHubApi({ emptyRepo: true });

    const result = await pushFilesAtomically(
      'tok',
      'owner',
      'repo',
      [{ path: 'index.html', content: 'HTML' }],
      'msg'
    );

    expect(result.commitSha).toBe('commit-1');
    const calls = recordedCalls();
    const commitCall = calls.find((c) => c.path.endsWith('/git/commits') && c.opts?.method === 'POST');
    expect(commitCall?.opts?.body?.parents).toEqual([]);
    const treeCall = calls.find((c) => c.path.includes('/git/trees'));
    expect(treeCall?.opts?.body?.base_tree).toBeUndefined();
    const refCreate = calls.find((c) => c.path.endsWith('/git/refs') && c.opts?.method === 'POST');
    expect(refCreate?.opts?.body).toMatchObject({ ref: 'refs/heads/main', sha: 'commit-1' });
  });

  it('uses base_tree and parent commit for a non-empty repo', async () => {
    stubGitHubApi({ emptyRepo: false });

    await pushFilesAtomically('tok', 'owner', 'repo', [{ path: 'a.txt', content: 'A' }], 'msg');

    const calls = recordedCalls();
    const treeCall = calls.find((c) => c.path.includes('/git/trees'));
    expect(treeCall?.opts?.body?.base_tree).toBe('base-tree-sha');
    const commitCall = calls.find((c) => c.path.endsWith('/git/commits') && c.opts?.method === 'POST');
    expect(commitCall?.opts?.body?.parents).toEqual(['parent-sha']);
    const refUpdate = calls.find((c) => c.path.includes('/git/refs/heads/main') && c.opts?.method === 'PATCH');
    expect(refUpdate?.opts?.body).toMatchObject({ sha: 'commit-1' });
  });
});
