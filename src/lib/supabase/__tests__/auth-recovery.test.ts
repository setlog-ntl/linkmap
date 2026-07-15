import { describe, it, expect } from 'vitest';
import {
  AuthApiError,
  AuthRetryableFetchError,
  AuthSessionMissingError,
} from '@supabase/supabase-js';
import {
  isAuthSessionCookie,
  isDefinitiveAuthFailure,
  isExpiredJwtFailure,
  isPkceVerifierCookie,
  isStaleClientKeyFailure,
} from '../auth-recovery';

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

describe('isPkceVerifierCookie', () => {
  it('PKCE code-verifier 쿠키를 인식한다', () => {
    expect(isPkceVerifierCookie('sb-abc-auth-token-code-verifier')).toBe(true);
  });

  it('세션 쿠키·무관한 쿠키는 제외한다', () => {
    expect(isPkceVerifierCookie('sb-abc-auth-token')).toBe(false);
    expect(isPkceVerifierCookie('sb-abc-auth-token.0')).toBe(false);
    expect(isPkceVerifierCookie('theme')).toBe(false);
  });

  it('세션 쿠키 판정과 상호 배타적이다 — 한 쿠키가 양쪽에 잡히면 안 된다', () => {
    for (const name of [
      'sb-abc-auth-token',
      'sb-abc-auth-token.0',
      'sb-abc-auth-token-code-verifier',
      'theme',
    ]) {
      expect(isAuthSessionCookie(name) && isPkceVerifierCookie(name)).toBe(false);
    }
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

describe('isExpiredJwtFailure', () => {
  it('만료 토큰 응답을 인식한다 (PostgREST·GoTrue 공통)', () => {
    // PostgREST: PGRST301
    expect(
      isExpiredJwtFailure({ message: 'JWT expired', details: '', hint: '', code: 'PGRST301' })
    ).toBe(true);
    // GoTrue: bad_jwt에 만료 상세가 실림
    expect(
      isExpiredJwtFailure(
        new AuthApiError('invalid JWT: unable to parse or verify signature, token is expired by 2h30m', 401, 'bad_jwt')
      )
    ).toBe(true);
    expect(isExpiredJwtFailure(new Error('token is expired'))).toBe(true);
  });

  it('만료 외 인증 실패는 회복 가능으로 오인하지 않는다', () => {
    expect(isExpiredJwtFailure(new AuthApiError('invalid JWT', 401, 'bad_jwt'))).toBe(false);
    expect(
      isExpiredJwtFailure(new AuthApiError('refresh token not found', 400, 'refresh_token_not_found'))
    ).toBe(false);
    expect(isExpiredJwtFailure({ message: 'Invalid API key', code: '' })).toBe(false);
    expect(isExpiredJwtFailure(null)).toBe(false);
    expect(isExpiredJwtFailure('JWT expired')).toBe(false);
  });
});

describe('isStaleClientKeyFailure', () => {
  it('폐기된 publishable 키 응답을 인식한다 (REST·GoTrue 공통)', () => {
    // PostgREST 게이트웨이 응답 (PostgrestError 형태, code 없음)
    expect(
      isStaleClientKeyFailure({ message: 'Invalid API key', details: '', hint: '', code: '' })
    ).toBe(true);
    // GoTrue 응답 (AuthApiError)
    expect(isStaleClientKeyFailure(new AuthApiError('Invalid API key', 401, undefined))).toBe(true);
  });

  it('legacy 키 비활성화 응답을 인식한다', () => {
    expect(isStaleClientKeyFailure(new Error('Legacy API keys are disabled'))).toBe(true);
  });

  it('세션 계열 인증 실패는 stale key로 오인하지 않는다', () => {
    expect(isStaleClientKeyFailure(new AuthApiError('invalid JWT', 401, 'bad_jwt'))).toBe(false);
    expect(
      isStaleClientKeyFailure({ message: 'JWT expired', details: '', hint: '', code: 'PGRST301' })
    ).toBe(false);
    expect(isStaleClientKeyFailure(new Error('일반 오류'))).toBe(false);
    expect(isStaleClientKeyFailure(null)).toBe(false);
    expect(isStaleClientKeyFailure('Invalid API key')).toBe(false);
  });
});
