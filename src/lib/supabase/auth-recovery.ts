import {
  isAuthApiError,
  isAuthRetryableFetchError,
  isAuthSessionMissingError,
} from '@supabase/supabase-js';

/**
 * Supabase 세션 쿠키 여부.
 * PKCE `-code-verifier` 쿠키는 진행 중인 OAuth 로그인에 필요하므로 제외한다
 * (지우면 콜백에서 exchangeCodeForSession이 실패해 로그인 자체가 막힘).
 */
export function isAuthSessionCookie(name: string): boolean {
  return (
    name.startsWith('sb-') &&
    name.includes('-auth-token') &&
    !name.includes('-code-verifier')
  );
}

/**
 * 복구 불가능한(확정적) 인증 실패인지 판별.
 *
 * 전제: 호출 측에서 "세션(또는 인증 쿠키)이 존재하는데 검증에 실패했다"는
 * 맥락에서만 사용해야 한다. 비로그인 사용자의 단순 세션 부재와 구분하는
 * 책임은 호출 측에 있다.
 *
 * - true  → 세션이 서버에서 무효(키 로테이션, 세션 폐기, JWT 서명 불일치,
 *           쿠키 손상 등). 로컬 세션을 정리해야 다음 로그인이 가능하다.
 * - false → 네트워크 일시 오류 등 재시도 가능한 실패. 세션을 지우면 안 된다.
 */
export function isDefinitiveAuthFailure(error: unknown): boolean {
  if (!error) return false;

  // 네트워크·일시 장애 — 유효한 세션일 수 있으므로 절대 정리 금지
  if (isAuthRetryableFetchError(error)) return false;

  // 쿠키는 있으나 세션을 읽을 수 없음(청크 손상 등)
  if (isAuthSessionMissingError(error)) return true;

  // GoTrue가 세션을 거부: bad_jwt, refresh_token_not_found, session_not_found 등
  if (isAuthApiError(error)) {
    return error.status === 400 || error.status === 401 || error.status === 403;
  }

  // PostgREST JWT 오류 (PGRST300~303: JWT 파싱/서명/만료/역할 오류 → 401)
  if (typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string' && /^PGRST30[0-3]$/.test(code)) return true;
  }

  // 그 외 JWT 관련 메시지 (예: "JWT expired", "invalid JWT")
  if (error instanceof Error && /\bjwt\b/i.test(error.message)) return true;

  return false;
}
