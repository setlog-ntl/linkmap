import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Module mocks -- hoisted before any imports from the route under test
// ---------------------------------------------------------------------------
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(() => ({ success: true, remaining: 29, resetAt: Date.now() + 60000 })),
}));
vi.mock('@/lib/audit', () => ({
  logAudit: vi.fn(),
}));
vi.mock('@/lib/crypto', () => ({
  encrypt: vi.fn((v: string) => `encrypted:${v}`),
  decrypt: vi.fn((v: string) => v.replace('encrypted:', '')),
}));

// Import route handlers *after* mocks are registered
import { GET, POST } from '../route';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { logAudit } from '@/lib/audit';

// Valid v4-format UUIDs for Zod v4 compatibility
const UUID_PROJECT = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const UUID_SERVICE = 'b1ffcd00-1d1c-4ef8-ab7e-7cc0ce491b22';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createRequest(url: string, options?: RequestInit) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), options as never);
}

/**
 * Build a chainable mock query builder.
 *
 * The chain is "thenable" -- when awaited directly (e.g. `await chain.eq(...)`)
 * it resolves to the configured result. Calling `.single()` or `.order()`
 * also resolves to the result.
 */
function makeChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'eq', 'insert', 'upsert', 'delete', 'limit'];
  for (const m of methods) {
    chain[m] = vi.fn().mockReturnValue(chain);
  }
  // Terminal methods resolve to the result
  chain.single = vi.fn().mockResolvedValue(result);
  chain.order = vi.fn().mockResolvedValue(result);
  // Make the chain itself thenable so `await supabase.from(...).select().eq()` works
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
// Tests -- GET /api/service-accounts
// ---------------------------------------------------------------------------
describe('GET /api/service-accounts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(
      `http://localhost:3000/api/service-accounts?project_id=${UUID_PROJECT}`,
    );
    const res = await GET(req);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toContain('인증');
  });

  it('returns 400 when project_id is missing', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/service-accounts');
    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('project_id');
  });

  it('returns 404 when user does not own the project', async () => {
    const mock = createMockSupabase({
      fromResults: {
        projects: { data: null, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(
      `http://localhost:3000/api/service-accounts?project_id=${UUID_PROJECT}`,
    );
    const res = await GET(req);

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('프로젝트를 찾을 수 없습니다');
  });

  it('returns service accounts for an owned project', async () => {
    const serviceAccounts = [
      { id: 'sa-1', project_id: UUID_PROJECT, service_id: 's1', status: 'active' },
      { id: 'sa-2', project_id: UUID_PROJECT, service_id: 's2', status: 'active' },
    ];

    const mock = createMockSupabase({
      fromResults: {
        projects: { data: { id: UUID_PROJECT }, error: null },
        service_accounts: { data: serviceAccounts, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(
      `http://localhost:3000/api/service-accounts?project_id=${UUID_PROJECT}`,
    );
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(2);
    expect(body[0].id).toBe('sa-1');
  });

  it('returns empty array when service_accounts table does not exist', async () => {
    const mock = createMockSupabase({
      fromResults: {
        projects: { data: { id: UUID_PROJECT }, error: null },
        service_accounts: {
          data: null,
          error: { code: '42P01', message: 'relation "service_accounts" does not exist' },
        },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(
      `http://localhost:3000/api/service-accounts?project_id=${UUID_PROJECT}`,
    );
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Tests -- POST /api/service-accounts
// ---------------------------------------------------------------------------
describe('POST /api/service-accounts', () => {
  const validBody = {
    project_id: UUID_PROJECT,
    service_id: UUID_SERVICE,
    api_keys: { OPENAI_API_KEY: 'sk-test-123' },
    api_key_label: 'My Key',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/service-accounts', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it('returns 429 when rate limited', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);
    vi.mocked(rateLimit).mockReturnValueOnce({
      success: false,
      remaining: 0,
      resetAt: Date.now() + 60000,
    });

    const req = createRequest('http://localhost:3000/api/service-accounts', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);

    expect(res.status).toBe(429);
  });

  it('returns 404 when user does not own the project', async () => {
    const mock = createMockSupabase({
      fromResults: {
        projects: { data: null, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/service-accounts', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('프로젝트를 찾을 수 없습니다');
  });

  it('returns 201 and calls logAudit on success', async () => {
    const createdAccount = {
      id: 'sa-new',
      project_id: validBody.project_id,
      service_id: validBody.service_id,
      user_id: 'user-1',
      connection_type: 'api_key',
      api_key_label: 'My Key',
      status: 'active',
    };

    const mock = createMockSupabase({
      fromResults: {
        projects: { data: { id: UUID_PROJECT }, error: null },
        service_accounts: { data: createdAccount, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/service-accounts', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBe('sa-new');
    expect(logAudit).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ action: 'service_account.connect_api_key' }),
    );
  });

  it('returns 400 for invalid request body (missing api_keys)', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/service-accounts', {
      method: 'POST',
      body: JSON.stringify({
        project_id: UUID_PROJECT,
        service_id: UUID_SERVICE,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });
});
