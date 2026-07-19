/**
 * 로그인/회원가입/콜백 후 이동할 내부 경로를 안전하게 정규화한다.
 *
 * Open Redirect 방어: 반드시 단일 슬래시(`/`)로 시작하는 내부 경로만 허용한다.
 * - `//evil.com` (프로토콜 상대 URL): 브라우저가 외부 절대 URL로 해석 → 차단
 * - `https://evil.com`, `javascript:...` 등 스킴 포함: 차단
 * - 백슬래시(`\`)를 슬래시로 오인하는 브라우저 대응: `\\` 시작도 차단
 *
 * 검증 로직이 login/signup/callback에 중복 구현되어 드리프트했던 이력이 있어
 * (2026-07-16 레드팀 F-3/F-14) 단일 진실 소스로 통합한다.
 */
export function safeInternalPath(
  raw: string | null | undefined,
  fallback = '/dashboard',
): string {
  if (!raw) return fallback;
  const value = raw.trim();
  if (
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.startsWith('/\\') &&
    !value.startsWith('/%2F') && // 인코딩된 이중 슬래시
    !value.startsWith('/%5C') && // 인코딩된 백슬래시
    !value.includes('://')
  ) {
    return value;
  }
  return fallback;
}
