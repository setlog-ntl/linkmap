import { describe, it, expect } from 'vitest';
import {
  AuthApiError,
  AuthRetryableFetchError,
  AuthSessionMissingError,
} from '@supabase/supabase-js';
import { isAuthSessionCookie, isDefinitiveAuthFailure } from '../auth-recovery';

describe('isAuthSessionCookie', () => {
  it('세션 쿠키(단일·청크)를 인식한다', () => {
    expect(isAuthSessionCookie('sb-abc-auth-token')).toBe(true);
    expect(isAuthSessionCookie('sb-abc-auth-token.0')).toBe(true);
    expect(isAuthSessionCookie('sb-abc-auth-token.1')).toBe(true);
  });

  it('PKCE code-verifier 쿠키는 제외한다 (삭제 시 OAuth 콜백 실패)', () => {
    expect(isAuthSessionCookie('sb-abc-auth-token-code-verifier')).toBe(false);
  });

  it('무관한 쿠키는 제외한다', () => {
    expect(isAuthSessionCookie('theme')).toBe(false);
    expect(isAuthSessionCookie('sb-other-cookie')).toBe(false);
    expect(isAuthSessionCookie('my-auth-token')).toBe(false);
  });
});

describe('isDefinitiveAuthFailure', () => {
  it('에러가 없으면 false', () => {
    expect(isDefinitiveAuthFailure(null)).toBe(false);
    expect(isDefinitiveAuthFailure(undefined)).toBe(false);
  });

  it('네트워크 일시 오류는 false — 세션을 지우면 안 됨', () => {
    expect(isDefinitiveAuthFailure(new AuthRetryableFetchError('fetch failed', 0))).toBe(false);
  });

  it('세션 파싱 불가(쿠키 손상 등)는 true', () => {
    expect(isDefinitiveAuthFailure(new AuthSessionMissingError())).toBe(true);
  });

  it('GoTrue 4xx 거부(bad_jwt·refresh_token_not_found 등)는 true', () => {
    expect(isDefinitiveAuthFailure(new AuthApiError('invalid JWT', 401, 'bad_jwt'))).toBe(true);
    expect(
      isDefinitiveAuthFailure(new AuthApiError('refresh token not found', 400, 'refresh_token_not_found'))
    ).toBe(true);
    expect(isDefinitiveAuthFailure(new AuthApiError('forbidden', 403, 'session_not_found'))).toBe(true);
  });

  it('GoTrue 4xx 외 상태(5xx 등)는 false', () => {
    expect(isDefinitiveAuthFailure(new AuthApiError('server error', 500, 'unexpected_failure'))).toBe(false);
  });

  it('PostgREST JWT 오류(PGRST30x)는 true', () => {
    expect(
      isDefinitiveAuthFailure({ message: 'JWT expired', details: '', hint: '', code: 'PGRST301' })
    ).toBe(true);
    expect(
      isDefinitiveAuthFailure({ message: 'JWT expired', details: '', hint: '', code: 'PGRST303' })
    ).toBe(true);
  });

  it('PostgREST 비인증 오류(PGRST116 등)는 false', () => {
    expect(
      isDefinitiveAuthFailure({ message: 'no rows', details: '', hint: '', code: 'PGRST116' })
    ).toBe(false);
  });

  it('JWT 관련 메시지를 가진 일반 Error는 true, 그 외는 false', () => {
    expect(isDefinitiveAuthFailure(new Error('JWT expired'))).toBe(true);
    expect(isDefinitiveAuthFailure(new Error('invalid jwt signature'))).toBe(true);
    expect(isDefinitiveAuthFailure(new Error('일반 오류'))).toBe(false);
  });
});
