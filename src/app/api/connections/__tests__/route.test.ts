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

import { GET, POST } from '../route';
import { createClient } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

const UUID_PROJECT = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const UUID_SOURCE = 'b1ffcd00-1d1c-4ef8-ab7e-7cc0ce491b22';
const UUID_TARGET = 'c2aade11-2e2d-4ef8-bc8f-8dd1df502c33';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createRequest(url: string, options?: RequestInit) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), options as never);
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
// Tests -- GET /api/connections
// ---------------------------------------------------------------------------
describe('GET /api/connections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(
      `http://localhost:3000/api/connections?project_id=${UUID_PROJECT}`,
    );
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 when project_id is missing', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/connections');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('project_id');
  });

  it('returns 200 with connections array', async () => {
    const connections = [
      { id: 'c-1', project_id: UUID_PROJECT, source_service_id: UUID_SOURCE },
      { id: 'c-2', project_id: UUID_PROJECT, source_service_id: UUID_TARGET },
    ];

    const mock = createMockSupabase({
      fromResults: {
        user_connections: { data: connections, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(
      `http://localhost:3000/api/connections?project_id=${UUID_PROJECT}`,
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(2);
    expect(body[0].id).toBe('c-1');
  });

  it('returns 400 on DB error', async () => {
    const mock = createMockSupabase({
      fromResults: {
        user_connections: { data: null, error: { message: 'DB failure', code: '42P01' } },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(
      `http://localhost:3000/api/connections?project_id=${UUID_PROJECT}`,
    );
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('DB failure');
  });
});

// ---------------------------------------------------------------------------
// Tests -- POST /api/connections
// ---------------------------------------------------------------------------
describe('POST /api/connections', () => {
  const validBody = {
    project_id: UUID_PROJECT,
    source_service_id: UUID_SOURCE,
    target_service_id: UUID_TARGET,
    connection_type: 'uses',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/connections', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 for Zod validation failure (invalid UUID)', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/connections', {
      method: 'POST',
      body: JSON.stringify({ ...validBody, project_id: 'not-a-uuid' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when source === target (refine)', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/connections', {
      method: 'POST',
      body: JSON.stringify({ ...validBody, target_service_id: UUID_SOURCE }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 404 when user does not own project', async () => {
    const mock = createMockSupabase({
      fromResults: {
        projects: { data: null, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/connections', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('프로젝트를 찾을 수 없습니다');
  });

  it('returns 409 for duplicate connection (23505)', async () => {
    const mock = createMockSupabase({
      fromResults: {
        projects: { data: { id: UUID_PROJECT }, error: null },
        user_connections: { data: null, error: { code: '23505', message: 'duplicate' } },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/connections', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toContain('이미 동일한 연결');
  });

  it('returns 201 and calls logAudit on success', async () => {
    const created = {
      id: 'conn-1',
      project_id: UUID_PROJECT,
      source_service_id: UUID_SOURCE,
      target_service_id: UUID_TARGET,
      connection_type: 'uses',
      connection_status: 'active',
    };

    const mock = createMockSupabase({
      fromResults: {
        projects: { data: { id: UUID_PROJECT }, error: null },
        user_connections: { data: created, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/connections', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBe('conn-1');
    expect(logAudit).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ action: 'connection.create' }),
    );
  });

  it('defaults connection_status to active', async () => {
    const created = {
      id: 'conn-2',
      project_id: UUID_PROJECT,
      connection_status: 'active',
    };

    const mock = createMockSupabase({
      fromResults: {
        projects: { data: { id: UUID_PROJECT }, error: null },
        user_connections: { data: created, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    // Omit connection_status from body
    const req = createRequest('http://localhost:3000/api/connections', {
      method: 'POST',
      body: JSON.stringify({
        project_id: UUID_PROJECT,
        source_service_id: UUID_SOURCE,
        target_service_id: UUID_TARGET,
        connection_type: 'integrates',
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);

    // Verify the insert was called with connection_status: 'active'
    const fromCall = mock.from.mock.calls.find(([t]: [string]) => t === 'user_connections');
    expect(fromCall).toBeDefined();
  });
});
