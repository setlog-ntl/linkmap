-- Migration 063: cost_attachments 링크 저장 지원
-- 파일 컬럼 nullable화 + link_url/link_title 컬럼 추가

-- 1. 파일 전용 컬럼 nullable로 변경
ALTER TABLE cost_attachments
  ALTER COLUMN storage_path DROP NOT NULL,
  ALTER COLUMN file_size    DROP NOT NULL,
  ALTER COLUMN file_type    DROP NOT NULL;

-- 2. 링크 전용 컬럼 추가
ALTER TABLE cost_attachments
  ADD COLUMN IF NOT EXISTS link_url   TEXT,
  ADD COLUMN IF NOT EXISTS link_title TEXT;

-- 3. 파일 OR 링크 중 하나는 반드시 있어야 함 (중복 방지)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'cost_attachments_file_or_link'
      AND conrelid = 'cost_attachments'::regclass
  ) THEN
    ALTER TABLE cost_attachments
      ADD CONSTRAINT cost_attachments_file_or_link CHECK (
        (link_url IS NOT NULL)
        OR (storage_path IS NOT NULL AND file_size IS NOT NULL AND file_type IS NOT NULL)
      );
  END IF;
END $$;
