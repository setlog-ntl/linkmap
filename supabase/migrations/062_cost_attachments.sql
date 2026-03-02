-- Migration 062: cost_attachments 테이블 + cost-receipts Storage bucket
-- 비용 관련 인보이스/영수증 파일 첨부 기능

-- ============================================================
-- 1. cost_attachments 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS cost_attachments (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_service_id   UUID NOT NULL REFERENCES project_services(id) ON DELETE CASCADE,
  file_name            TEXT NOT NULL,          -- 원본 파일명 (표시용)
  storage_path         TEXT NOT NULL,          -- Storage 버킷 내 경로
  file_size            INTEGER NOT NULL CHECK (file_size > 0 AND file_size <= 10485760), -- 최대 10MB
  file_type            TEXT NOT NULL,          -- MIME type
  attachment_type      TEXT NOT NULL DEFAULT 'other'
                         CHECK (attachment_type IN ('invoice', 'receipt', 'contract', 'screenshot', 'other')),
  notes                TEXT,
  uploaded_by          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_cost_attachments_project_service_id
  ON cost_attachments(project_service_id);

CREATE INDEX IF NOT EXISTS idx_cost_attachments_uploaded_by
  ON cost_attachments(uploaded_by);

-- ============================================================
-- 2. RLS
-- ============================================================
ALTER TABLE cost_attachments ENABLE ROW LEVEL SECURITY;

-- SELECT/INSERT/UPDATE/DELETE: 프로젝트 소유자만
CREATE POLICY "cost_attachments_owner_all"
  ON cost_attachments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM project_services ps
      JOIN projects p ON p.id = ps.project_id
      WHERE ps.id = cost_attachments.project_service_id
        AND p.user_id = auth.uid()
        AND p.deleted_at IS NULL
    )
  )
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM project_services ps
      JOIN projects p ON p.id = ps.project_id
      WHERE ps.id = cost_attachments.project_service_id
        AND p.user_id = auth.uid()
        AND p.deleted_at IS NULL
    )
  );

-- ============================================================
-- 3. cost-receipts Storage bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cost-receipts',
  'cost-receipts',
  false,
  10485760,  -- 10MB
  ARRAY[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/heic',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. Storage bucket RLS
-- ============================================================

-- SELECT: 본인 폴더만 읽기 ({user_id}/*)
CREATE POLICY "cost_receipts_owner_read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'cost-receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- INSERT: 본인 폴더에만 업로드
CREATE POLICY "cost_receipts_owner_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'cost-receipts'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE: 본인 폴더만
CREATE POLICY "cost_receipts_owner_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'cost-receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'cost-receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE: 본인 폴더만
CREATE POLICY "cost_receipts_owner_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'cost-receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
