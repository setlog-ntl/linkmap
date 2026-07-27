/**
 * 방문자 IP를 SHA-256으로 단방향 해시한다 (Web Crypto API — Workers 호환).
 *
 * 중복 방문 판별 등 통계 목적은 유지하면서 식별자 원본은 저장하지 않기 위한 유틸.
 * 평문 IP 저장은 보존기간·파기 절차 없이 개인정보가 누적되는 문제가 있어 금지한다
 * (2026-07-16 레드팀 F-7).
 *
 * 주의: 고정 솔트 방식이므로 IPv4 전수 대입에는 이론상 취약하다. 저장소가 유출돼도
 * 즉시 식별되지는 않는 수준의 완화책이며, 비밀 솔트 도입은 별도 과제로 남긴다.
 * 솔트를 용도별로 분리해 서로 다른 테이블 간 해시 대조(교차 추적)를 막는다.
 */

/** /api/track — visitor_logs.ip_address */
export const VISITOR_LOG_IP_SALT = '_visitor_log_salt';

/** /api/showcase/[id]/view — showcase_views.viewer_ip_hash */
export const SHOWCASE_VIEW_IP_SALT = '_showcase_view_salt';

export async function hashIp(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(ip + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
