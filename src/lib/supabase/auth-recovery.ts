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

/**
 * 만료된 액세스 토큰(JWT expired)으로 인한 실패인지 판별 — 세션이 죽은 게
 * 아니라 갱신 시점을 놓쳤을 뿐인 **회복 가능한** 실패다.
 *
 * 탭이 절전/백그라운드로 잠들면 supabase-js 자동 갱신 타이머가 멈추고,
 * 깨어날 때 데이터 리페치가 토큰 갱신보다 먼저 발사되어 PGRST301
 * "JWT expired" 401이 표면화된다. 이를 확정 실패로 취급해 세션을 정리하면
 * 멀쩡한 refresh token까지 버려져 강제 로그아웃이 된다(2026-07-13 재보고
 * 사고) — 반드시 세션 갱신을 먼저 시도하고, 갱신이 거부될 때만 정리할 것.
 */
export function isExpiredJwtFailure(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const message = (error as { message?: unknown }).message;
  if (typeof message !== 'string') return false;
  // "JWT expired"(PostgREST) / "invalid JWT: ... token is expired by 2h"(GoTrue)
  return /(jwt|token)[\s\S]{0,60}expired/i.test(message);
}

/**
 * 폐기된 API 키로 인한 실패인지 판별 — 브라우저가 구 번들(스테일 HTML/JS)을
 * 실행 중이라는 신호다. publishable 키는 JS에 인라인되므로 세션 정리로는
 * 복구할 수 없고, 문서를 다시 받아 새 번들을 로드해야 한다
 * (`reloadForFreshBundle` — src/lib/stale-bundle.ts).
 *
 * - "Invalid API key": 키 로테이션으로 폐기된 publishable 키
 * - "Legacy API keys are disabled": legacy anon JWT 비활성화 이후 구 키 사용
 *
 * 반드시 isDefinitiveAuthFailure보다 먼저 검사할 것 — GoTrue의
 * "Invalid API key"는 401이라 확정 실패로도 분류되는데, 그 경로(세션 정리)로
 * 빠지면 복구가 안 된 채 로그인 불가가 지속된다.
 */
export function isStaleClientKeyFailure(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const message = (error as { message?: unknown }).message;
  if (typeof message !== 'string') return false;
  return /invalid api key|legacy api keys/i.test(message);
}
