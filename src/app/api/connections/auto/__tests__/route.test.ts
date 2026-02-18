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
vi.mock('@/lib/connections/auto-connect', () => ({
  suggestAutoConnections: vi.fn(),
}));

import { GET, POST } from '../route';
import { createClient } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';
import { suggestAutoConnections } from '@/lib/connections/auto-connect';

const UUID_PROJECT = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

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
// Tests -- GET /api/connections/auto
// ---------------------------------------------------------------------------
describe('GET /api/connections/auto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(
      `http://localhost:3000/api/connections/auto?project_id=${UUID_PROJECT}`,
    );
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 when project_id is missing', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/connections/auto');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('project_id');
  });

  it('returns 404 when user does not own project', async () => {
    const mock = createMockSupabase({
      fromResults: {
        projects: { data: null, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(
      `http://localhost:3000/api/connections/auto?project_id=${UUID_PROJECT}`,
    );
    const res = await GET(req);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('프로젝트를 찾을 수 없습니다');
  });

  it('returns 200 with suggestions', async () => {
    const mockSuggestions = [
      {
        source_service_id: 's1',
        target_service_id: 's2',
        connection_type: 'uses',
        reason: 'auth 필요',
        dependency_type: 'required',
      },
    ];
    vi.mocked(suggestAutoConnections).mockReturnValue(mockSuggestions);

    const mock = createMockSupabase({
      fromResults: {
        projects: { data: { id: UUID_PROJECT }, error: null },
        project_services: { data: [], error: null },
        service_dependencies: { data: [], error: null },
        user_connections: { data: [], error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest(
      `http://localhost:3000/api/connections/auto?project_id=${UUID_PROJECT}`,
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.suggestions).toHaveLength(1);
    expect(body.suggestions[0].connection_type).toBe('uses');
  });
});

// ---------------------------------------------------------------------------
// Tests -- POST /api/connections/auto
// ---------------------------------------------------------------------------
describe('POST /api/connections/auto', () => {
  const validBody = {
    project_id: UUID_PROJECT,
    suggestions: [
      { source_service_id: 's1', target_service_id: 's2', connection_type: 'uses' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/connections/auto', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 when project_id is missing', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/connections/auto', {
      method: 'POST',
      body: JSON.stringify({ suggestions: [{ source_service_id: 's1', target_service_id: 's2', connection_type: 'uses' }] }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('project_id');
  });

  it('returns 400 when suggestions is not an array', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/connections/auto', {
      method: 'POST',
      body: JSON.stringify({ project_id: UUID_PROJECT, suggestions: 'not-array' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when suggestions is empty', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/connections/auto', {
      method: 'POST',
      body: JSON.stringify({ project_id: UUID_PROJECT, suggestions: [] }),
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

    const req = createRequest('http://localhost:3000/api/connections/auto', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('프로젝트를 찾을 수 없습니다');
  });

  it('returns 201 and calls logAudit on upsert success', async () => {
    const upserted = [
      { id: 'uc-1', source_service_id: 's1', target_service_id: 's2' },
    ];

    const mock = createMockSupabase({
      fromResults: {
        projects: { data: { id: UUID_PROJECT }, error: null },
        user_connections: { data: upserted, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const req = createRequest('http://localhost:3000/api/connections/auto', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.created).toHaveLength(1);
    expect(logAudit).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ action: 'connection.auto_create' }),
    );
  });
});
