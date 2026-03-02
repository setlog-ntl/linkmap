import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { GET } from '../history/route';
import { createClient } from '@/lib/supabase/server';

const CONN_ID = 'aaaabbbb-0000-4000-8000-111122223333';

function makeReq() {
  return new NextRequest(
    new URL(`http://localhost:3000/api/connections/${CONN_ID}/history`),
    { method: 'GET' },
  );
}

type MockResult = { data: unknown; error: unknown };

function makeChain(result: MockResult) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'eq', 'is', 'in', 'order', 'limit'];
  for (const m of methods) {
    chain[m] = vi.fn().mockReturnValue(chain);
  }
  chain.single = vi.fn().mockResolvedValue(result);
  chain.then = (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
    Promise.resolve(result).then(resolve, reject);
  return chain;
}

function createMockSupabase(overrides: {
  user?: { id: string } | null;
  fromResults?: Record<string, MockResult | MockResult[]>;
} = {}) {
  const mockUser = overrides.user !== undefined ? overrides.user : { id: 'user-1' };
  const callCounts: Record<string, number> = {};

  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }) },
    from: vi.fn((table: string) => {
      callCounts[table] = (callCounts[table] ?? 0) + 1;
      const callIndex = callCounts[table] - 1;
      const raw = overrides.fromResults?.[table];
      let result: MockResult;
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

const baseConnection = {
  id: CONN_ID,
  project: { user_id: 'user-1' },
};

const sampleLogs = [
  {
    id: 'log-1',
    action: 'connection.verify',
    details: { new_status: 'active' },
    created_at: '2025-03-01T10:00:00Z',
  },
  {
    id: 'log-2',
    action: 'connection.create',
    details: {},
    created_at: '2025-03-01T09:00:00Z',
  },
];

describe('GET /api/connections/[id]/history', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await GET(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(401);
  });

  it('returns 404 when connection not found', async () => {
    const mock = createMockSupabase({
      fromResults: { user_connections: { data: null, error: null } },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await GET(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(404);
  });

  it('returns 404 when connection belongs to another user', async () => {
    const mock = createMockSupabase({
      fromResults: {
        user_connections: {
          data: { ...baseConnection, project: { user_id: 'other-user' } },
          error: null,
        },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await GET(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(404);
  });

  it('returns 200 with audit log entries', async () => {
    const mock = createMockSupabase({
      fromResults: {
        user_connections: { data: baseConnection, error: null },
        audit_logs: { data: sampleLogs, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await GET(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(2);
    expect(body[0].action).toBe('connection.verify');
    expect(body[1].action).toBe('connection.create');
  });

  it('returns empty array when no history exists', async () => {
    const mock = createMockSupabase({
      fromResults: {
        user_connections: { data: baseConnection, error: null },
        audit_logs: { data: [], error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await GET(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(0);
  });

  it('returns empty array when audit_logs data is null', async () => {
    const mock = createMockSupabase({
      fromResults: {
        user_connections: { data: baseConnection, error: null },
        audit_logs: { data: null, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await GET(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(0);
  });

  it('returns 400 when audit_logs query fails', async () => {
    const mock = createMockSupabase({
      fromResults: {
        user_connections: { data: baseConnection, error: null },
        audit_logs: { data: null, error: { message: 'DB error' } },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await GET(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(400);
  });

  it('returns entries with correct shape (id, action, details, created_at)', async () => {
    const mock = createMockSupabase({
      fromResults: {
        user_connections: { data: baseConnection, error: null },
        audit_logs: { data: sampleLogs, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await GET(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    const [first] = await res.json();
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('action');
    expect(first).toHaveProperty('details');
    expect(first).toHaveProperty('created_at');
  });
});
