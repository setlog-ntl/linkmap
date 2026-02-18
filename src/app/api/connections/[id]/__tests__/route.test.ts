import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));
vi.mock('@/lib/audit', () => ({
  logAudit: vi.fn(),
}));

import { PATCH, DELETE } from '../route';
import { createClient } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

const UUID_CONN = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createRequest(url: string, options?: RequestInit) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), options as never);
}

function createParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function makeChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'eq', 'insert', 'upsert', 'delete', 'limit', 'update'];
  for (const m of methods) {
    chain[m] = vi.fn().mockReturnValue(chain);
  }
  chain.single = vi.fn().mockResolvedValue(result);
  chain.order = vi.fn().mockResolvedValue(result);
  chain.then = (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
    Promise.resolve(result).then(resolve, reject);
  return chain;
}

function createMockSupabase(overrides: {
  user?: { id: string; email: string } | null;
  fromResults?: Record<
    string,
    | { data: unknown; error: unknown }
    | Array<{ data: unknown; error: unknown }>
  >;
} = {}) {
  const mockUser =
    overrides.user !== undefined
      ? overrides.user
      : { id: 'user-1', email: 'test@example.com' };

  const callCounts: Record<string, number> = {};

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
    },
    from: vi.fn((table: string) => {
      callCounts[table] = (callCounts[table] ?? 0) + 1;
      const callIndex = callCounts[table] - 1;

      const raw = overrides.fromResults?.[table];
      let result: { data: unknown; error: unknown };
      if (Array.isArray(raw)) {
        result = raw[callIndex] ?? raw[raw.length - 1];
      } else if (raw) {
        result = raw;
      } else {
        result = { data: null, error: null };
      }

      return makeChain(result);
    }),
  };
}

// ---------------------------------------------------------------------------
// Tests -- PATCH /api/connections/[id]
// ---------------------------------------------------------------------------
describe('PATCH /api/connections/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(`http://localhost:3000/api/connections/${UUID_CONN}`, {
      method: 'PATCH',
      body: JSON.stringify({ connection_type: 'uses' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await PATCH(req, createParams(UUID_CONN));
    expect(res.status).toBe(401);
  });

  it('returns 400 for Zod validation failure', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(`http://localhost:3000/api/connections/${UUID_CONN}`, {
      method: 'PATCH',
      body: JSON.stringify({ connection_type: 'invalid_type' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await PATCH(req, createParams(UUID_CONN));
    expect(res.status).toBe(400);
  });

  it('returns 404 when connection not found or not owned', async () => {
    const mock = createMockSupabase({
      fromResults: {
        user_connections: { data: null, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(`http://localhost:3000/api/connections/${UUID_CONN}`, {
      method: 'PATCH',
      body: JSON.stringify({ connection_type: 'uses' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await PATCH(req, createParams(UUID_CONN));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('연결을 찾을 수 없습니다');
  });

  it('returns 404 when connection exists but user_id mismatch', async () => {
    const mock = createMockSupabase({
      fromResults: {
        user_connections: {
          data: { id: UUID_CONN, project: { user_id: 'other-user' } },
          error: null,
        },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(`http://localhost:3000/api/connections/${UUID_CONN}`, {
      method: 'PATCH',
      body: JSON.stringify({ connection_type: 'uses' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await PATCH(req, createParams(UUID_CONN));
    expect(res.status).toBe(404);
  });

  it('returns 200 and calls logAudit on partial update success', async () => {
    const updated = {
      id: UUID_CONN,
      connection_type: 'integrates',
      label: 'Updated label',
    };

    const mock = createMockSupabase({
      fromResults: {
        user_connections: [
          // First call: ownership check
          { data: { id: UUID_CONN, project: { user_id: 'user-1' }, project_id: 'p1' }, error: null },
          // Second call: update
          { data: updated, error: null },
        ],
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(`http://localhost:3000/api/connections/${UUID_CONN}`, {
      method: 'PATCH',
      body: JSON.stringify({ connection_type: 'integrates', label: 'Updated label' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await PATCH(req, createParams(UUID_CONN));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.connection_type).toBe('integrates');
    expect(logAudit).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ action: 'connection.update' }),
    );
  });
});

// ---------------------------------------------------------------------------
// Tests -- DELETE /api/connections/[id]
// ---------------------------------------------------------------------------
describe('DELETE /api/connections/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(`http://localhost:3000/api/connections/${UUID_CONN}`, {
      method: 'DELETE',
    });
    const res = await DELETE(req, createParams(UUID_CONN));
    expect(res.status).toBe(401);
  });

  it('returns 404 when connection not found or not owned', async () => {
    const mock = createMockSupabase({
      fromResults: {
        user_connections: { data: null, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(`http://localhost:3000/api/connections/${UUID_CONN}`, {
      method: 'DELETE',
    });
    const res = await DELETE(req, createParams(UUID_CONN));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('연결을 찾을 수 없습니다');
  });

  it('returns 200 and calls logAudit on success', async () => {
    const mock = createMockSupabase({
      fromResults: {
        user_connections: [
          // First call: ownership check
          { data: { id: UUID_CONN, project: { user_id: 'user-1' }, project_id: 'p1' }, error: null },
          // Second call: delete
          { data: null, error: null },
        ],
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(`http://localhost:3000/api/connections/${UUID_CONN}`, {
      method: 'DELETE',
    });
    const res = await DELETE(req, createParams(UUID_CONN));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(logAudit).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ action: 'connection.delete' }),
    );
  });
});
