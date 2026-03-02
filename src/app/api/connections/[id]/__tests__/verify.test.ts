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

import { POST } from '../verify/route';
import { createClient } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CONN_ID = 'aaaabbbb-0000-4000-8000-111122223333';
const PROJECT_ID = 'project0-0000-4000-8000-111122223333';
const SOURCE_SVC = 'source00-0000-4000-8000-111122223333';
const TARGET_SVC = 'target00-0000-4000-8000-111122223333';
const PS_ID_1 = 'ps000001-0000-4000-8000-111122223333';
const PS_ID_2 = 'ps000002-0000-4000-8000-111122223333';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeReq() {
  return new NextRequest(
    new URL(`http://localhost:3000/api/connections/${CONN_ID}/verify`),
    { method: 'POST' },
  );
}

function makeChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'eq', 'is', 'in', 'update', 'order', 'limit'];
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
  fromResults?: Record<string, { data: unknown; error: unknown } | Array<{ data: unknown; error: unknown }>>;
} = {}) {
  const mockUser = overrides.user !== undefined ? overrides.user : { id: 'user-1' };
  const callCounts: Record<string, number> = {};

  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }) },
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

const baseConnection = {
  id: CONN_ID,
  project_id: PROJECT_ID,
  source_service_id: SOURCE_SVC,
  target_service_id: TARGET_SVC,
  connection_status: 'active',
  project: { user_id: 'user-1' },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('POST /api/connections/[id]/verify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await POST(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(401);
  });

  it('returns 404 when connection not found', async () => {
    const mock = createMockSupabase({
      fromResults: { user_connections: { data: null, error: null } },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await POST(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
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
    const res = await POST(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(404);
  });

  it('updates last_verified_at only when no project_services found', async () => {
    const updated = { ...baseConnection, last_verified_at: new Date().toISOString() };
    const mock = createMockSupabase({
      fromResults: {
        user_connections: [
          { data: baseConnection, error: null }, // ownership check
          { data: updated, error: null },         // update
        ],
        project_services: { data: [], error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await POST(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.last_verified_at).toBeTruthy();
  });

  it('sets connection_status to "active" when all services are healthy', async () => {
    const updated = { ...baseConnection, connection_status: 'active', last_verified_at: new Date().toISOString() };
    const mock = createMockSupabase({
      fromResults: {
        user_connections: [
          { data: baseConnection, error: null },
          { data: updated, error: null },
        ],
        project_services: {
          data: [
            { id: PS_ID_1, service_id: SOURCE_SVC },
            { id: PS_ID_2, service_id: TARGET_SVC },
          ],
          error: null,
        },
        health_checks: {
          data: [
            { project_service_id: PS_ID_1, status: 'healthy' },
            { project_service_id: PS_ID_2, status: 'healthy' },
          ],
          error: null,
        },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await POST(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.connection_status).toBe('active');
    expect(logAudit).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ action: 'connection.verify' }),
    );
  });

  it('sets connection_status to "error" when any service is unhealthy', async () => {
    const updated = { ...baseConnection, connection_status: 'error', last_verified_at: new Date().toISOString() };
    const mock = createMockSupabase({
      fromResults: {
        user_connections: [
          { data: baseConnection, error: null },
          { data: updated, error: null },
        ],
        project_services: {
          data: [
            { id: PS_ID_1, service_id: SOURCE_SVC },
            { id: PS_ID_2, service_id: TARGET_SVC },
          ],
          error: null,
        },
        health_checks: {
          data: [
            { project_service_id: PS_ID_1, status: 'healthy' },
            { project_service_id: PS_ID_2, status: 'unhealthy' },
          ],
          error: null,
        },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await POST(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.connection_status).toBe('error');
  });

  it('sets connection_status to "error" when any service is degraded', async () => {
    const updated = { ...baseConnection, connection_status: 'error', last_verified_at: new Date().toISOString() };
    const mock = createMockSupabase({
      fromResults: {
        user_connections: [
          { data: baseConnection, error: null },
          { data: updated, error: null },
        ],
        project_services: {
          data: [{ id: PS_ID_1, service_id: SOURCE_SVC }],
          error: null,
        },
        health_checks: {
          data: [{ project_service_id: PS_ID_1, status: 'degraded' }],
          error: null,
        },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await POST(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.connection_status).toBe('error');
  });

  it('sets connection_status to "pending" when no health_checks recorded yet', async () => {
    const updated = { ...baseConnection, connection_status: 'pending', last_verified_at: new Date().toISOString() };
    const mock = createMockSupabase({
      fromResults: {
        user_connections: [
          { data: baseConnection, error: null },
          { data: updated, error: null },
        ],
        project_services: {
          data: [{ id: PS_ID_1, service_id: SOURCE_SVC }],
          error: null,
        },
        health_checks: { data: [], error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await POST(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.connection_status).toBe('pending');
  });

  it('only uses the latest health_check per project_service (dedup)', async () => {
    // PS_ID_1 has two records: most recent is healthy, older is unhealthy
    // Result should be 'active' (latest = healthy)
    const updated = { ...baseConnection, connection_status: 'active', last_verified_at: new Date().toISOString() };
    const mock = createMockSupabase({
      fromResults: {
        user_connections: [
          { data: baseConnection, error: null },
          { data: updated, error: null },
        ],
        project_services: {
          data: [{ id: PS_ID_1, service_id: SOURCE_SVC }],
          error: null,
        },
        // Ordered desc by checked_at — first = latest
        health_checks: {
          data: [
            { project_service_id: PS_ID_1, status: 'healthy' },   // latest
            { project_service_id: PS_ID_1, status: 'unhealthy' }, // older, should be ignored
          ],
          error: null,
        },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await POST(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.connection_status).toBe('active');
  });

  it('returns 400 when DB update fails', async () => {
    const mock = createMockSupabase({
      fromResults: {
        user_connections: [
          { data: baseConnection, error: null },
          { data: null, error: { message: 'DB error' } },
        ],
        project_services: {
          data: [{ id: PS_ID_1, service_id: SOURCE_SVC }],
          error: null,
        },
        health_checks: {
          data: [{ project_service_id: PS_ID_1, status: 'healthy' }],
          error: null,
        },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const res = await POST(makeReq(), { params: Promise.resolve({ id: CONN_ID }) });
    expect(res.status).toBe(400);
  });
});
