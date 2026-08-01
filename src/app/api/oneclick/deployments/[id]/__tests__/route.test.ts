import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('@/lib/audit', () => ({ logAudit: vi.fn() }));
vi.mock('@/lib/github/api', () => ({ deleteRepo: vi.fn() }));
vi.mock('@/lib/github/token', () => ({ safeDecryptToken: vi.fn() }));

import { DELETE } from '../route';
import { createClient } from '@/lib/supabase/server';
import { deleteRepo } from '@/lib/github/api';
import { safeDecryptToken } from '@/lib/github/token';

const DEPLOY_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const PROJECT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

function makeChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {};
  for (const m of ['select', 'eq', 'is', 'insert', 'update', 'delete', 'limit']) {
    chain[m] = vi.fn().mockReturnValue(chain);
  }
  chain.single = vi.fn().mockResolvedValue(result);
  chain.then = (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
    Promise.resolve(result).then(resolve, reject);
  return chain;
}

function mockSupabase(tables: Record<string, { data: unknown; error: unknown }>) {
  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
    from: vi.fn((table: string) => makeChain(tables[table] ?? { data: null, error: null })),
  };
}

function deployRow(sourceType: 'template' | 'upload' | 'import') {
  return {
    id: DEPLOY_ID,
    site_name: 'my-site',
    forked_repo_full_name: 'octocat/my-site',
    project_id: PROJECT_ID,
    source_type: sourceType,
  };
}

function setup(sourceType: 'template' | 'upload' | 'import') {
  vi.mocked(createClient).mockResolvedValue(
    mockSupabase({
      homepage_deploys: { data: deployRow(sourceType), error: null },
      project_github_repos: { data: { service_account_id: 'sa-1' }, error: null },
      service_accounts: { data: { encrypted_access_token: 'enc' }, error: null },
      projects: { data: null, error: null },
    }) as never,
  );
  vi.mocked(safeDecryptToken).mockResolvedValue({ token: 'gh_token' } as never);
}

const params = { params: Promise.resolve({ id: DEPLOY_ID }) };
const request = new NextRequest(new URL('http://localhost:3000/api/oneclick/deployments/x'), {
  method: 'DELETE',
});

describe('DELETE /api/oneclick/deployments/[id] — repo 삭제 정책', () => {
  beforeEach(() => vi.clearAllMocks());

  // 트랙 B(import)는 사용자가 이미 갖고 있던 저장소다.
  // 여기서 deleteRepo가 호출되면 사용자 원본 자산이 사라진다 — 이 기능 최대의 위험.
  it('never deletes the GitHub repository for an imported site', async () => {
    setup('import');

    const res = await DELETE(request, params);

    expect(res.status).toBe(200);
    expect(deleteRepo).not.toHaveBeenCalled();
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it('deletes the repository Linkmap created for a template site', async () => {
    setup('template');

    const res = await DELETE(request, params);

    expect(res.status).toBe(200);
    expect(deleteRepo).toHaveBeenCalledWith('gh_token', 'octocat', 'my-site');
  });

  it('deletes the repository Linkmap created for an uploaded site', async () => {
    setup('upload');

    await DELETE(request, params);

    expect(deleteRepo).toHaveBeenCalledWith('gh_token', 'octocat', 'my-site');
  });
});
