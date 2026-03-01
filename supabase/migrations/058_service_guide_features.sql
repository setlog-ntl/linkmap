-- Migration 058: service_guides 테이블에 가입 안내 + 기능별 가이드 컬럼 추가
-- 하위 호환 유지 (기존 rows는 NULL / 빈 배열)

ALTER TABLE service_guides
  ADD COLUMN IF NOT EXISTS signup  JSONB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]';

COMMENT ON COLUMN service_guides.signup   IS '가입 안내: { url: string, steps: string[], free_tier?: string }';
COMMENT ON COLUMN service_guides.features IS '기능별 가이드 목록: ServiceFeatureGuide[]';
