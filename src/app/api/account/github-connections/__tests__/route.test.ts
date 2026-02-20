import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Module mocks
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));
vi.mock('@/lib/audit', () => ({
  logAudit: vi.fn(),
}));

import { GET, PATCH, DELETE } from '../route';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logAudit } from '@/lib/audit';

const UUID_1 = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

function createRequest(url: string, options?: RequestInit) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), options as never);
}

function makeChain(result: { data: unknown; error: unknown; count?: number | null }) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'eq', 'is', 'in', 'insert', 'update', 'delete', 'limit', 'filter'];
  for (const m of methods) {
    chain[m] = vi.fn().mockReturnValue(chain);
  }
  chain.single = vi.fn().mockResolvedValue(result);
  chain.order = vi.fn().mockResolvedValue(result);
  chain.then = (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
    Promise.resolve(result).then(resolve, reject);
  // For count queries
  if (result.count !== undefined) {
    chain.then = (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
      Promise.resolve({ data: null, error: null, count: result.count }).then(resolve, reject);
  }
  return chain;
}

function createMockSupabase(user: { id: string } | null, fromResults: Record<string, { data: unknown; error: unknown; count?: number | null }> = {}) {
  const callCounts: Record<string, number> = {};
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
    },
    from: vi.fn((table: string) => {
      callCounts[table] = (callCounts[table] ?? 0) + 1;
      const result = fromResults[table] || { data: null, error: null };
      return makeChain(result);
    }),
  };
}

describe('GET /api/account/github-connections', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase(null);
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns GitHub connections for authenticated user', async () => {
    const connections = [
      {
        id: UUID_1,
        user_id: 'user-1',
        display_name: 'myaccount',
        auth_method: 'oauth',
        oauth_provider_user_id: '12345',
        oauth_metadata: { login: 'myaccount', avatar_url: 'https://example.com/avatar.png' },
        oauth_scopes: ['repo'],
        status: 'active',
        last_verified_at: null,
        error_message: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
        service: { slug: 'github' },
      },
    ];

    const mock = createMockSupabase({ id: 'user-1' }, {
      service_accounts: { data: connections, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    // Admin client for linked repos/projects enrichment
    const adminMock = {
      from: vi.fn(() => makeChain({ data: [], error: null })),
    };
    vi.mocked(createAdminClient).mockReturnValue(adminMock as never);

    const res = await GET();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.connections).toHaveLength(1);
    expect(body.connections[0].id).toBe(UUID_1);
    expect(body.connections[0].linked_projects).toEqual([]);
    expect(body.connections[0].linked_repos_count).toBe(0);
    // Encrypted fields should not be present
    expect(body.connections[0].encrypted_access_token).toBeUndefined();
    // service nested object should be stripped
    expect(body.connections[0].service).toBeUndefined();
  });
});

describe('PATCH /api/account/github-connections', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase(null);
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/account/github-connections', {
      method: 'PATCH',
      body: JSON.stringify({ id: UUID_1, display_name: 'New Name' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await PATCH(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid body', async () => {
    const mock = createMockSupabase({ id: 'user-1' });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/account/github-connections', {
      method: 'PATCH',
      body: JSON.stringify({ id: 'not-uuid', display_name: '' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });

  it('returns 404 when connection not found', async () => {
    const mock = createMockSupabase({ id: 'user-1' }, {
      service_accounts: { data: null, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/account/github-connections', {
      method: 'PATCH',
      body: JSON.stringify({ id: UUID_1, display_name: 'New Name' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await PATCH(req);
    expect(res.status).toBe(404);
  });

  it('renames successfully and calls logAudit', async () => {
    const mock = createMockSupabase({ id: 'user-1' }, {
      service_accounts: { data: { id: UUID_1 }, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/account/github-connections', {
      method: 'PATCH',
      body: JSON.stringify({ id: UUID_1, display_name: 'My Work Account' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(logAudit).toHaveBeenCalledWith('user-1', expect.objectContaining({
      action: 'github_connection.rename',
    }));
  });
});

describe('DELETE /api/account/github-connections', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase(null);
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(`http://localhost:3000/api/account/github-connections?id=${UUID_1}`, {
      method: 'DELETE',
    });
    const res = await DELETE(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 when id is missing', async () => {
    const mock = createMockSupabase({ id: 'user-1' });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/account/github-connections', {
      method: 'DELETE',
    });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });

  it('returns 404 when connection not found', async () => {
    const mock = createMockSupabase({ id: 'user-1' }, {
      service_accounts: { data: null, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(`http://localhost:3000/api/account/github-connections?id=${UUID_1}`, {
      method: 'DELETE',
    });
    const res = await DELETE(req);
    expect(res.status).toBe(404);
  });

  it('returns 409 when repos are linked', async () => {
    const mock = createMockSupabase({ id: 'user-1' }, {
      service_accounts: { data: { id: UUID_1, oauth_metadata: { login: 'test' } }, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const adminMock = {
      from: vi.fn(() => makeChain({ data: null, error: null, count: 3 })),
    };
    vi.mocked(createAdminClient).mockReturnValue(adminMock as never);

    const req = createRequest(`http://localhost:3000/api/account/github-connections?id=${UUID_1}`, {
      method: 'DELETE',
    });
    const res = await DELETE(req);
    expect(res.status).toBe(409);
  });

  it('deletes successfully and calls logAudit', async () => {
    const mock = createMockSupabase({ id: 'user-1' }, {
      service_accounts: { data: { id: UUID_1, oauth_metadata: { login: 'testuser' } }, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const adminMock = {
      from: vi.fn(() => makeChain({ data: null, error: null, count: 0 })),
    };
    vi.mocked(createAdminClient).mockReturnValue(adminMock as never);

    const req = createRequest(`http://localhost:3000/api/account/github-connections?id=${UUID_1}`, {
      method: 'DELETE',
    });
    const res = await DELETE(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(logAudit).toHaveBeenCalledWith('user-1', expect.objectContaining({
      action: 'github_connection.delete',
    }));
  });
});
