/**
 * 환경변수 키 이름 정규화 유틸.
 *
 * 사용자가 어떤 형태로 입력하든 저장이 거부되지 않도록, 형식 검증으로 거부하는 대신
 * 유효한 키 이름으로 자동 변환한다. 클라이언트 입력 필드와 서버 Zod 스키마(transform)가
 * 동일한 규칙을 공유한다.
 */

/** 정규화된 키 형식: 대문자/숫자/밑줄, 숫자로 시작 불가 (밑줄 시작 허용) */
export const ENV_KEY_REGEX = /^[A-Z_][A-Z0-9_]*$/;

/**
 * 임의의 문자열을 유효한 환경변수 키로 변환.
 * - 앞뒤 공백 제거, 대문자화
 * - 허용되지 않는 문자 → `_`
 * - 숫자로 시작하면 `_` 접두사 (POSIX/GitHub Secrets 호환)
 * 빈 문자열(공백만 입력)일 때만 빈 결과를 반환한다.
 */
export function normalizeEnvKey(raw: string): string {
  let key = raw.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
  if (/^[0-9]/.test(key)) key = `_${key}`;
  return key;
}
