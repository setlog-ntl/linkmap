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

import { POST } from '../../decrypt/route';
import { createClient } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createJsonRequest(body: unknown) {
  return new NextRequest(new URL('/api/env/decrypt', 'http://localhost:3000'), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function createRawRequest(rawBody: string) {
  return new NextRequest(new URL('/api/env/decrypt', 'http://localhost:3000'), {
    method: 'POST',
    body: rawBody,
    headers: { 'Content-Type': 'application/json' },
  });
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

      const chain: Record<string, ReturnType<typeof vi.fn>> = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue(result),
        order: vi.fn().mockResolvedValue(result),
        insert: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
      };
      return chain;
    }),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('POST /api/env/decrypt', () => {
  const validUuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await POST(createJsonRequest({ id: validUuid }));

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toContain('인증');
  });

  it('returns 400 for invalid JSON body', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await POST(createRawRequest('not valid json {{{'));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('JSON');
  });

  it('returns 400 for invalid id format (not UUID)', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await POST(createJsonRequest({ id: 'not-a-uuid' }));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it('returns 404 when env var does not exist', async () => {
    const mock = createMockSupabase({
      fromResults: {
        environment_variables: { data: null, error: null },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await POST(createJsonRequest({ id: validUuid }));

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('환경변수');
  });

  it('returns 404 when env var is owned by another user', async () => {
    const mock = createMockSupabase({
      fromResults: {
        environment_variables: {
          data: {
            id: validUuid,
            key_name: 'SECRET',
            encrypted_value: 'encrypted:value',
            project: { user_id: 'other-user' },
          },
          error: null,
        },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await POST(createJsonRequest({ id: validUuid }));

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('환경변수');
  });

  it('returns decrypted value for a valid request', async () => {
    const mock = createMockSupabase({
      fromResults: {
        environment_variables: {
          data: {
            id: validUuid,
            key_name: 'DATABASE_URL',
            encrypted_value: 'encrypted:postgres://localhost/db',
            project: { user_id: 'user-1' },
          },
          error: null,
        },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await POST(createJsonRequest({ id: validUuid }));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.value).toBe('postgres://localhost/db');
  });

  it('calls logAudit with env_var.decrypt action', async () => {
    const mock = createMockSupabase({
      fromResults: {
        environment_variables: {
          data: {
            id: validUuid,
            key_name: 'MY_KEY',
            encrypted_value: 'encrypted:secret',
            project: { user_id: 'user-1' },
          },
          error: null,
        },
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    await POST(createJsonRequest({ id: validUuid }));

    expect(logAudit).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        action: 'env_var.decrypt',
        resourceType: 'environment_variable',
        resourceId: validUuid,
        details: expect.objectContaining({ key_name: 'MY_KEY' }),
      }),
    );
  });
});
