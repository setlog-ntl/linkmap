-- 068_feature_requests_anonymous.sql
-- 기능 요청 익명/공개 선택 기능
-- NOTE: is_anonymous 컬럼이 이미 존재하므로 IF NOT EXISTS로 안전하게 처리

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'feature_requests' AND column_name = 'is_anonymous'
  ) THEN
    ALTER TABLE feature_requests ADD COLUMN is_anonymous BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

COMMENT ON COLUMN feature_requests.is_anonymous IS '작성자 익명 표시 여부 (true: 익명, false: 공개)';
