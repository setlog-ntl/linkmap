/** 도메인별 TanStack Query staleTime 정책 (ms) */
export const staleTime = {
  /** 프로젝트 목록/상세 — 30초 */
  project: 30 * 1000,
  /** 환경변수 — 15초 (빈번한 변경 가능) */
  envVar: 15 * 1000,
  /** 헬스체크 — 60초 (외부 API 호출 비용) */
  healthCheck: 60 * 1000,
  /** 감사 로그 — 5분 (읽기 전용) */
  auditLog: 5 * 60 * 1000,
  /** AI 설정 — 5분 (관리자만 변경) */
  aiConfig: 5 * 60 * 1000,
  /** 서비스 카탈로그 — 5분 */
  catalog: 5 * 60 * 1000,
  /** 레이어 오버라이드 — 30초 */
  layerOverride: 30 * 1000,
  /** GitHub 연결 — 60초 */
  github: 60 * 1000,
  /** 휴지통 — 30초 */
  trash: 30 * 1000,
} as const;
