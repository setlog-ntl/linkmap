-- 103: Secure Notes (보안 메모 — 자유 텍스트 민감값 저장)
-- 백업 코드 / 비밀번호 메모 / 복구 문구 / 라이선스 키 등 KEY=VALUE 가 아닌
-- 자유 텍스트 민감값을 AES-256-GCM 암호화하여 관리.
-- 환경변수(environment_variables, 설정값)와 명확히 구분되는 2번째 타입.

CREATE TABLE IF NOT EXISTS secure_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other'
    CHECK (category IN (
      'backup_code', 'password', 'recovery_phrase', 'license_key',
      'connection_string', 'pin', 'api_note', 'other'
    )),
  encrypted_content TEXT NOT NULL,
  environment TEXT NOT NULL DEFAULT 'all'
    CHECK (environment IN ('development', 'staging', 'production', 'all')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_secure_notes_project ON secure_notes(project_id);
CREATE INDEX IF NOT EXISTS idx_secure_notes_project_service ON secure_notes(project_id, service_id);

-- RLS
ALTER TABLE secure_notes ENABLE ROW LEVEL SECURITY;

-- Policy: project owner can do everything
CREATE POLICY "secure_notes_owner_all"
  ON secure_notes
  FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Policy: team members can read
CREATE POLICY "secure_notes_team_read"
  ON secure_notes
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

COMMENT ON TABLE secure_notes IS '보안 메모 — 자유 텍스트 민감값(백업코드/복구문구 등) 암호화 저장';
COMMENT ON COLUMN secure_notes.encrypted_content IS 'AES-256-GCM 암호화된 자유 텍스트 본문';
COMMENT ON COLUMN secure_notes.category IS '분류: backup_code, password, recovery_phrase, license_key, connection_string, pin, api_note, other';
COMMENT ON COLUMN secure_notes.title IS '제목(평문) — 목록 표시·검색용, 민감값 금지';
COMMENT ON COLUMN secure_notes.notes IS '비민감 설명 메모(평문, 선택)';
