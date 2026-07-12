import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { AuthApiError, AuthRetryableFetchError } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

import { updateSession } from '../session';
import { createServerClient } from '@supabase/ssr';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function mockAuth(user: unknown, error: unknown) {
  vi.mocked(createServerClient).mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error }),
    },
  } as never);
}

function makeRequest(path: string, cookie?: string) {
  return new NextRequest(new URL(path, 'http://localhost:3000'), {
    headers: cookie ? { cookie } : undefined,
  } as never);
}

const DEAD_SESSION_ERROR = new AuthApiError('invalid JWT', 401, 'bad_jwt');

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'sb_publishable_test');
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('updateSession — 죽은 세션 자가치유', () => {
  it('공개 경로(/login)에서 무효 세션 쿠키를 만료시킨다 (청크 포함)', async () => {
    mockAuth(null, DEAD_SESSION_ERROR);
    const request = makeRequest(
      '/login',
      'sb-abc-auth-token.0=dead0; sb-abc-auth-token.1=dead1; theme=dark'
    );

    const response = await updateSession(request);

    expect(response.status).toBe(200);
    expect(response.cookies.get('sb-abc-auth-token.0')?.value).toBe('');
    expect(response.cookies.get('sb-abc-auth-token.0')?.maxAge).toBe(0);
    expect(response.cookies.get('sb-abc-auth-token.1')?.value).toBe('');
    // 무관한 쿠키는 건드리지 않음
    expect(response.cookies.get('theme')).toBeUndefined();
  });

  it('보호 경로(/dashboard)에서 무효 세션이면 로그인 리다이렉트 + 쿠키 만료', async () => {
    mockAuth(null, DEAD_SESSION_ERROR);
    const request = makeRequest('/dashboard', 'sb-abc-auth-token=dead');

    const response = await updateSession(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
    expect(response.cookies.get('sb-abc-auth-token')?.value).toBe('');
    expect(response.cookies.get('sb-abc-auth-token')?.maxAge).toBe(0);
  });

  it('PKCE code-verifier 쿠키는 정리 대상에서 제외한다', async () => {
    mockAuth(null, DEAD_SESSION_ERROR);
    const request = makeRequest(
      '/login',
      'sb-abc-auth-token=dead; sb-abc-auth-token-code-verifier=pkce'
    );

    const response = await updateSession(request);

    expect(response.cookies.get('sb-abc-auth-token')?.value).toBe('');
    expect(response.cookies.get('sb-abc-auth-token-code-verifier')).toBeUndefined();
  });

  it('네트워크 일시 오류면 쿠키를 보존한다 (유효 세션일 수 있음)', async () => {
    mockAuth(null, new AuthRetryableFetchError('fetch failed', 0));
    const request = makeRequest('/login', 'sb-abc-auth-token=maybe-alive');

    const response = await updateSession(request);

    expect(response.cookies.get('sb-abc-auth-token')).toBeUndefined();
  });

  it('인증 쿠키가 없으면 아무 쿠키 조작도 하지 않는다', async () => {
    mockAuth(null, null);
    const request = makeRequest('/');

    const response = await updateSession(request);

    expect(response.status).toBe(200);
    expect(response.cookies.getAll()).toHaveLength(0);
  });
});

describe('updateSession — 리다이렉트', () => {
  it('비로그인 사용자가 보호 경로 접근 시 /login으로 리다이렉트', async () => {
    mockAuth(null, null);
    const request = makeRequest('/dashboard');

    const response = await updateSession(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
  });

  it('로그인 사용자가 /login 접근 시 /dashboard로 리다이렉트', async () => {
    mockAuth({ id: 'user-1' }, null);
    const request = makeRequest('/login', 'sb-abc-auth-token=valid');

    const response = await updateSession(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/dashboard');
  });

  it('로그인 사용자의 일반 경로는 그대로 통과', async () => {
    mockAuth({ id: 'user-1' }, null);
    const request = makeRequest('/', 'sb-abc-auth-token=valid');

    const response = await updateSession(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });
});

describe('updateSession — 토큰 회전 쿠키 전달', () => {
  it('세션 갱신으로 설정된 쿠키를 리다이렉트 응답에도 전달한다', async () => {
    // getUser 중 토큰 회전이 일어나 setAll이 호출되는 상황 재현
    vi.mocked(createServerClient).mockImplementation((_url, _key, opts) => {
      const options = opts as {
        cookies: {
          setAll: (
            cookies: Array<{ name: string; value: string; options?: Record<string, unknown> }>
          ) => void;
        };
      };
      return {
        auth: {
          getUser: vi.fn().mockImplementation(async () => {
            options.cookies.setAll([
              { name: 'sb-abc-auth-token', value: 'rotated-token', options: { path: '/' } },
            ]);
            return { data: { user: { id: 'user-1' } }, error: null };
          }),
        },
      } as never;
    });
    const request = makeRequest('/login', 'sb-abc-auth-token=old-token');

    const response = await updateSession(request);

    // /login → /dashboard 리다이렉트에 회전된 토큰 쿠키가 실려야 함
    // (유실 시 브라우저가 이미 소비된 refresh token을 재사용해 세션 강제 종료)
    expect(response.status).toBe(307);
    expect(response.cookies.get('sb-abc-auth-token')?.value).toBe('rotated-token');
  });
});
