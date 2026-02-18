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
vi.mock('@/lib/crypto', () => ({
  encrypt: vi.fn((v: string) => `encrypted:${v}`),
  decrypt: vi.fn((v: string) => v.replace('encrypted:', '')),
}));

import { GET } from '../../download/route';
import { createClient } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createRequest(url: string) {
  return new NextRequest(new URL(url, 'http://localhost:3000'));
}

function makeChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'eq', 'insert', 'upsert', 'delete', 'limit'];
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
// Tests
// ---------------------------------------------------------------------------
describe('GET /api/env/download', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET(createRequest('/api/env/download?project_id=p1'));

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it('returns 400 when project_id is missing', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET(createRequest('/api/env/download'));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('project_id');
  });

  it('returns 404 for non-owned project', async () => {
    const mock = createMockSupabase({
      fromResults: {
        projects: { data: null, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET(createRequest('/api/env/download?project_id=not-mine'));

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('not found');
  });

  it('returns .env file content for a valid request', async () => {
    const envVars = [
      {
        id: 'ev-1',
        key_name: 'DATABASE_URL',
        encrypted_value: 'encrypted:postgres://localhost/db',
        environment: 'development',
        description: 'Main database',
      },
      {
        id: 'ev-2',
        key_name: 'API_SECRET',
        encrypted_value: 'encrypted:secret-value-123',
        environment: 'development',
        description: null,
      },
    ];

    const mock = createMockSupabase({
      fromResults: {
        projects: { data: { id: 'p1', name: 'My Project' }, error: null },
        environment_variables: { data: envVars, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET(createRequest('/api/env/download?project_id=p1'));

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/plain');
    expect(res.headers.get('Content-Disposition')).toContain('.env.local');

    const text = await res.text();
    expect(text).toContain('My Project');
    expect(text).toContain('DATABASE_URL=postgres://localhost/db');
    expect(text).toContain('API_SECRET=secret-value-123');
    expect(text).toContain('# Main database');
  });

  it('calls logAudit with env_var.bulk_decrypt action', async () => {
    const envVars = [
      {
        id: 'ev-1',
        key_name: 'KEY',
        encrypted_value: 'encrypted:val',
        environment: 'development',
        description: null,
      },
    ];

    const mock = createMockSupabase({
      fromResults: {
        projects: { data: { id: 'p1', name: 'Proj' }, error: null },
        environment_variables: { data: envVars, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    await GET(createRequest('/api/env/download?project_id=p1'));

    expect(logAudit).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        action: 'env_var.bulk_decrypt',
        resourceType: 'environment_variable',
        resourceId: 'p1',
        details: expect.objectContaining({ environment: 'development', count: 1 }),
      }),
    );
  });

  it('returns empty .env header when no env vars exist', async () => {
    const mock = createMockSupabase({
      fromResults: {
        projects: { data: { id: 'p1', name: 'Empty' }, error: null },
        environment_variables: { data: [], error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET(createRequest('/api/env/download?project_id=p1'));

    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('No environment variables found');
    // logAudit should NOT be called when there are no env vars
    expect(logAudit).not.toHaveBeenCalled();
  });

  it('uses environment query param to select correct env', async () => {
    const envVars = [
      {
        id: 'ev-1',
        key_name: 'PROD_KEY',
        encrypted_value: 'encrypted:prod-val',
        environment: 'production',
        description: null,
      },
    ];

    const mock = createMockSupabase({
      fromResults: {
        projects: { data: { id: 'p1', name: 'Proj' }, error: null },
        environment_variables: { data: envVars, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET(
      createRequest('/api/env/download?project_id=p1&environment=production'),
    );

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Disposition')).toContain('.env.production');
    const text = await res.text();
    expect(text).toContain('PROD_KEY=prod-val');
  });
});
