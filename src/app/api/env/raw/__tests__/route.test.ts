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

import { GET, PUT } from '../route';
import { createClient } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const projectUuid = 'c2aabb77-7e2d-4ef8-bb6d-6bb9bd380a33';

function createGetRequest(params: Record<string, string>) {
  const url = new URL('/api/env/raw', 'http://localhost:3000');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return new NextRequest(url, { method: 'GET' });
}

function createPutRequest(body: unknown) {
  return new NextRequest(new URL('/api/env/raw', 'http://localhost:3000'), {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function createMockSupabase(overrides: {
  user?: { id: string; email: string } | null;
  /** MFA 등록 + 미검증 상태 시뮬레이션 */
  mfaPending?: boolean;
  fromResults?: Record<string, { data: unknown; error: unknown }>;
} = {}) {
  const mockUser =
    overrides.user !== undefined
      ? overrides.user
      : { id: 'user-1', email: 'test@example.com' };

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      mfa: {
        getAuthenticatorAssuranceLevel: vi.fn().mockResolvedValue({
          data: overrides.mfaPending
            ? { currentLevel: 'aal1', nextLevel: 'aal2' }
            : { currentLevel: 'aal1', nextLevel: 'aal1' },
          error: null,
        }),
      },
    },
    from: vi.fn((table: string) => {
      const result = overrides.fromResults?.[table] ?? { data: null, error: null };

      const chain: Record<string, unknown> = {
        select: vi.fn(),
        eq: vi.fn(),
        in: vi.fn(),
        is: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        limit: vi.fn(),
        single: vi.fn().mockResolvedValue(result),
        order: vi.fn().mockResolvedValue(result),
        then: (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve),
      };
      for (const key of ['select', 'eq', 'in', 'is', 'insert', 'update', 'delete', 'limit']) {
        (chain[key] as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      }
      return chain;
    }),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
// 이 라우트는 환경변수를 평문으로 반환/수정하므로 env/decrypt·env/download와
// 동일한 MFA 게이트가 필수다. 과거 MFA 가드만 누락되어 aal1 세션 탈취만으로
// production 시크릿 전량을 획득할 수 있었다 (2026-07-16 레드팀 F-2).
describe('GET /api/env/raw', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    vi.mocked(createClient).mockResolvedValue(createMockSupabase({ user: null }) as never);

    const res = await GET(createGetRequest({ project_id: projectUuid, environment: 'production' }));

    expect(res.status).toBe(401);
  });

  it('returns 403 MFA_REQUIRED when MFA is enrolled but not verified', async () => {
    vi.mocked(createClient).mockResolvedValue(createMockSupabase({ mfaPending: true }) as never);

    const res = await GET(createGetRequest({ project_id: projectUuid, environment: 'production' }));

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe('MFA_REQUIRED');
  });

  it('blocks MFA-pending sessions before touching the database', async () => {
    const mock = createMockSupabase({ mfaPending: true });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    await GET(createGetRequest({ project_id: projectUuid, environment: 'production' }));

    // 게이트가 조회보다 먼저 걸려야 평문 복호화 경로에 도달하지 않는다
    expect(mock.from).not.toHaveBeenCalled();
    expect(logAudit).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid environment parameter', async () => {
    vi.mocked(createClient).mockResolvedValue(createMockSupabase() as never);

    const res = await GET(createGetRequest({ project_id: projectUuid, environment: 'prod' }));

    expect(res.status).toBe(400);
  });

  it('returns 404 when the project is not owned by the caller', async () => {
    vi.mocked(createClient).mockResolvedValue(
      createMockSupabase({ fromResults: { projects: { data: null, error: null } } }) as never,
    );

    const res = await GET(createGetRequest({ project_id: projectUuid, environment: 'production' }));

    expect(res.status).toBe(404);
  });

  it('returns decrypted vars for a valid request', async () => {
    vi.mocked(createClient).mockResolvedValue(
      createMockSupabase({
        fromResults: {
          projects: { data: { id: projectUuid }, error: null },
          environment_variables: {
            data: [
              {
                id: 'env-1',
                key_name: 'DATABASE_URL',
                encrypted_value: 'encrypted:postgres://localhost/db',
                is_secret: true,
                service_id: null,
                description: null,
              },
            ],
            error: null,
          },
        },
      }) as never,
    );

    const res = await GET(createGetRequest({ project_id: projectUuid, environment: 'production' }));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.vars).toEqual([
      expect.objectContaining({ key: 'DATABASE_URL', value: 'postgres://localhost/db' }),
    ]);
  });

  it('calls logAudit with env_var.raw_read action', async () => {
    vi.mocked(createClient).mockResolvedValue(
      createMockSupabase({
        fromResults: {
          projects: { data: { id: projectUuid }, error: null },
          environment_variables: { data: [], error: null },
        },
      }) as never,
    );

    await GET(createGetRequest({ project_id: projectUuid, environment: 'production' }));

    expect(logAudit).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        action: 'env_var.raw_read',
        resourceId: projectUuid,
      }),
    );
  });
});

describe('PUT /api/env/raw', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validBody = {
    project_id: projectUuid,
    environment: 'production',
    vars: [{ key: 'API_KEY', value: 'secret-value' }],
  };

  it('returns 401 for unauthenticated users', async () => {
    vi.mocked(createClient).mockResolvedValue(createMockSupabase({ user: null }) as never);

    const res = await PUT(createPutRequest(validBody));

    expect(res.status).toBe(401);
  });

  it('returns 403 MFA_REQUIRED when MFA is enrolled but not verified', async () => {
    const mock = createMockSupabase({ mfaPending: true });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await PUT(createPutRequest(validBody));

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe('MFA_REQUIRED');
    // 쓰기 경로도 게이트 이후에만 도달해야 한다
    expect(mock.from).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid payload', async () => {
    vi.mocked(createClient).mockResolvedValue(createMockSupabase() as never);

    const res = await PUT(createPutRequest({ project_id: projectUuid, environment: 'production' }));

    expect(res.status).toBe(400);
  });

  it('returns 404 when the project is not owned by the caller', async () => {
    vi.mocked(createClient).mockResolvedValue(
      createMockSupabase({ fromResults: { projects: { data: null, error: null } } }) as never,
    );

    const res = await PUT(createPutRequest(validBody));

    expect(res.status).toBe(404);
  });

  it('applies the diff and calls logAudit with env_var.raw_update action', async () => {
    vi.mocked(createClient).mockResolvedValue(
      createMockSupabase({
        fromResults: {
          projects: { data: { id: projectUuid }, error: null },
          environment_variables: { data: [], error: null },
        },
      }) as never,
    );

    const res = await PUT(createPutRequest(validBody));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ added: 1, updated: 0, deleted: 0 });
    expect(logAudit).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ action: 'env_var.raw_update' }),
    );
  });
});
