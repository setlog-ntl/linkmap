import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
vi.mock('@/lib/crypto', () => ({
  encrypt: vi.fn((v: string) => `enc:${v}`),
}));

import { GET } from '../callback/route';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logAudit } from '@/lib/audit';

const STATE_OWNER = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01';
const OTHER_USER = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02';

const FUTURE = new Date(Date.now() + 10 * 60 * 1000).toISOString();
const PAST = new Date(Date.now() - 60 * 1000).toISOString();

function makeStateRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'state-row-1',
    state_token: 'state-token-1',
    user_id: STATE_OWNER,
    project_id: null,
    service_slug: 'github',
    flow_context: 'oneclick',
    redirect_url: '/sites/new',
    expires_at: FUTURE,
    ...overrides,
  };
}

// 테이블별 결과 큐 — 같은 테이블을 여러 번 조회하는 흐름(service_accounts select→insert)을 순서대로 응답
function makeChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'eq', 'is', 'insert', 'update', 'upsert', 'delete', 'limit'];
  for (const m of methods) {
    chain[m] = vi.fn().mockReturnValue(chain);
  }
  chain.single = vi.fn().mockResolvedValue(result);
  chain.then = (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
    Promise.resolve(result).then(resolve, reject);
  return chain;
}

function createAdminMock(resultQueues: Record<string, { data: unknown; error: unknown }[]>) {
  const fromCalls: string[] = [];
  const admin = {
    from: vi.fn((table: string) => {
      fromCalls.push(table);
      const queue = resultQueues[table] ?? [];
      const result = queue.length > 1 ? queue.shift()! : queue[0] ?? { data: null, error: null };
      return makeChain(result);
    }),
  };
  return { admin, fromCalls };
}

// projectRow: state.project_id 소유권 재검증(RLS 클라이언트) 결과
function mockSession(
  user: { id: string } | null,
  opts: { authError?: { message: string }; projectRow?: unknown } = {}
) {
  vi.mocked(createClient).mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error: opts.authError ?? null,
      }),
    },
    from: vi.fn(() => makeChain({ data: opts.projectRow ?? null, error: null })),
  } as never);
}

function createRequest(url: string) {
  return new NextRequest(new URL(url, 'http://localhost:3000'));
}

const params = (provider = 'github') => ({ params: Promise.resolve({ provider }) });

function stubTokenExchangeFetch() {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes('login/oauth/access_token')) {
      return {
        ok: true,
        json: async () => ({ access_token: 'gh_tok_123', scope: 'repo,workflow' }),
      } as Response;
    }
    if (url.includes('api.github.com/user')) {
      return {
        ok: true,
        json: async () => ({ id: 999, login: 'gh-login', name: 'GH', avatar_url: 'a', email: 'e' }),
      } as Response;
    }
    throw new Error(`unexpected fetch: ${url}`);
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('GET /api/oauth/[provider]/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GITHUB_OAUTH_CLIENT_ID', 'test-client-id');
    vi.stubEnv('GITHUB_OAUTH_CLIENT_SECRET', 'test-client-secret');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('returns 400 when code or state is missing', async () => {
    mockSession(null);
    const { admin } = createAdminMock({});
    vi.mocked(createAdminClient).mockReturnValue(admin as never);

    const res = await GET(createRequest('/api/oauth/github/callback?code=abc'), params());
    expect(res.status).toBe(400);
  });

  it('redirects with error when state is not found', async () => {
    mockSession({ id: STATE_OWNER });
    const { admin } = createAdminMock({
      oauth_states: [{ data: null, error: { message: 'not found' } }],
    });
    vi.mocked(createAdminClient).mockReturnValue(admin as never);

    const res = await GET(
      createRequest('/api/oauth/github/callback?code=abc&state=missing'),
      params()
    );
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('error=oauth_state_invalid');
  });

  it('redirects with error when state is expired', async () => {
    mockSession({ id: STATE_OWNER });
    const { admin } = createAdminMock({
      oauth_states: [{ data: makeStateRow({ expires_at: PAST }), error: null }],
    });
    vi.mocked(createAdminClient).mockReturnValue(admin as never);

    const res = await GET(
      createRequest('/api/oauth/github/callback?code=abc&state=state-token-1'),
      params()
    );
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('error=state_expired');
  });

  // P0 재현 (2026-07-12 감사): 세션 없이 state만으로 토큰이 바인딩되면 안 된다
  it('rejects the callback when there is no session (no token exchange, nothing saved)', async () => {
    mockSession(null);
    const fetchMock = stubTokenExchangeFetch();
    const { admin, fromCalls } = createAdminMock({
      oauth_states: [{ data: makeStateRow(), error: null }],
      services: [{ data: { id: 'svc-github' }, error: null }],
      service_accounts: [
        { data: null, error: { code: 'PGRST116' } },
        { data: { id: 'sa-1' }, error: null },
      ],
    });
    vi.mocked(createAdminClient).mockReturnValue(admin as never);

    const res = await GET(
      createRequest('/api/oauth/github/callback?code=abc&state=state-token-1'),
      params()
    );

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('error=oauth_session_mismatch');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(fromCalls).not.toContain('service_accounts');
  });

  // P0 재현: 타 사용자 세션(피해자)이 공격자의 state로 콜백을 완료하면 안 된다
  it('rejects the callback when the session user differs from the state owner', async () => {
    mockSession({ id: OTHER_USER });
    const fetchMock = stubTokenExchangeFetch();
    const { admin, fromCalls } = createAdminMock({
      oauth_states: [{ data: makeStateRow({ user_id: STATE_OWNER }), error: null }],
      services: [{ data: { id: 'svc-github' }, error: null }],
      service_accounts: [
        { data: null, error: { code: 'PGRST116' } },
        { data: { id: 'sa-1' }, error: null },
      ],
    });
    vi.mocked(createAdminClient).mockReturnValue(admin as never);

    const res = await GET(
      createRequest('/api/oauth/github/callback?code=abc&state=state-token-1'),
      params()
    );

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('error=oauth_session_mismatch');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(fromCalls).not.toContain('service_accounts');
  });

  // state 행은 사용자가 PostgREST로 직접 INSERT할 수 있다(oauth_states RLS는 user_id만 강제)
  it('rejects a state whose project_id is not owned by the session user', async () => {
    mockSession({ id: STATE_OWNER }, { projectRow: null });
    const fetchMock = stubTokenExchangeFetch();
    const { admin, fromCalls } = createAdminMock({
      oauth_states: [
        { data: makeStateRow({ project_id: 'victim-project-uuid', flow_context: 'project' }), error: null },
      ],
      services: [{ data: { id: 'svc-github' }, error: null }],
      service_accounts: [{ data: { id: 'sa-1' }, error: null }],
    });
    vi.mocked(createAdminClient).mockReturnValue(admin as never);

    const res = await GET(
      createRequest('/api/oauth/github/callback?code=abc&state=state-token-1'),
      params()
    );

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('error=oauth_project_forbidden');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(fromCalls).not.toContain('service_accounts');
  });

  it('does not burn the state when the auth service is unavailable', async () => {
    mockSession(null, { authError: { message: 'network down' } });
    const fetchMock = stubTokenExchangeFetch();
    const { admin, fromCalls } = createAdminMock({
      oauth_states: [{ data: makeStateRow(), error: null }],
    });
    vi.mocked(createAdminClient).mockReturnValue(admin as never);

    const res = await GET(
      createRequest('/api/oauth/github/callback?code=abc&state=state-token-1'),
      params()
    );

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('error=oauth_auth_unavailable');
    expect(fetchMock).not.toHaveBeenCalled();
    // 재시도를 허용해야 하므로 state는 살아있어야 한다 (조회 1회 외 추가 접근 없음)
    expect(fromCalls.filter((t) => t === 'oauth_states')).toHaveLength(1);
  });

  it('rejects when the state was already consumed (atomic single-use claim)', async () => {
    mockSession({ id: STATE_OWNER });
    const fetchMock = stubTokenExchangeFetch();
    const { admin } = createAdminMock({
      // 1회차: 조회 성공 / 2회차: 삭제 클레임이 빈 결과 → 이미 소비됨
      oauth_states: [
        { data: makeStateRow(), error: null },
        { data: null, error: null },
      ],
    });
    vi.mocked(createAdminClient).mockReturnValue(admin as never);

    const res = await GET(
      createRequest('/api/oauth/github/callback?code=abc&state=state-token-1'),
      params()
    );

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('error=oauth_state_invalid');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('normalizes an attacker-supplied external redirect_url to an internal path', async () => {
    mockSession({ id: STATE_OWNER });
    stubTokenExchangeFetch();
    const { admin } = createAdminMock({
      oauth_states: [
        {
          data: makeStateRow({ flow_context: 'project', redirect_url: 'https://evil.example.com' }),
          error: null,
        },
        { data: { id: 'state-row-1' }, error: null },
      ],
      services: [{ data: { id: 'svc-github' }, error: null }],
      service_accounts: [{ data: { id: 'sa-1' }, error: null }],
    });
    vi.mocked(createAdminClient).mockReturnValue(admin as never);

    const res = await GET(
      createRequest('/api/oauth/github/callback?code=abc&state=state-token-1'),
      params()
    );

    const location = res.headers.get('location') ?? '';
    expect(location).not.toContain('evil.example.com');
    expect(location.startsWith('http://localhost:3000/')).toBe(true);
  });

  it('binds the token when the session user matches the state owner', async () => {
    mockSession({ id: STATE_OWNER });
    const fetchMock = stubTokenExchangeFetch();
    const { admin } = createAdminMock({
      oauth_states: [{ data: makeStateRow(), error: null }],
      services: [{ data: { id: 'svc-github' }, error: null }],
      service_accounts: [
        { data: null, error: { code: 'PGRST116' } },
        { data: { id: 'sa-1' }, error: null },
      ],
    });
    vi.mocked(createAdminClient).mockReturnValue(admin as never);

    const res = await GET(
      createRequest('/api/oauth/github/callback?code=abc&state=state-token-1'),
      params()
    );

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/sites/new?oauth_success=github');
    expect(fetchMock).toHaveBeenCalled();
    expect(logAudit).toHaveBeenCalledWith(
      STATE_OWNER,
      expect.objectContaining({ action: 'service_account.connect_oauth' })
    );
  });
});
