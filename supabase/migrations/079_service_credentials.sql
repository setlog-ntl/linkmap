-- 079: Service Credentials (계정 정보 관리)
-- 서비스별 로그인 계정(ID/PW)을 AES-256-GCM 암호화하여 관리

CREATE TABLE IF NOT EXISTS service_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  label TEXT NOT NULL,
  encrypted_username TEXT NOT NULL,
  encrypted_password TEXT,
  purpose TEXT NOT NULL DEFAULT 'other'
    CHECK (purpose IN ('admin', 'demo', 'deploy', 'monitoring', 'api', 'other')),
  environment TEXT NOT NULL DEFAULT 'all'
    CHECK (environment IN ('development', 'staging', 'production', 'all')),
  website_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_credentials_project ON service_credentials(project_id);
CREATE INDEX idx_credentials_project_service ON service_credentials(project_id, service_id);

-- RLS
ALTER TABLE service_credentials ENABLE ROW LEVEL SECURITY;

-- Policy: project owner can do everything
CREATE POLICY "credentials_owner_all"
  ON service_credentials
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
CREATE POLICY "credentials_team_read"
  ON service_credentials
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

COMMENT ON TABLE service_credentials IS '서비스 로그인 계정 정보 (ID/PW) 암호화 저장';
COMMENT ON COLUMN service_credentials.encrypted_username IS 'AES-256-GCM 암호화된 아이디';
COMMENT ON COLUMN service_credentials.encrypted_password IS 'AES-256-GCM 암호화된 비밀번호 (선택)';
COMMENT ON COLUMN service_credentials.purpose IS '계정 용도: admin, demo, deploy, monitoring, api, other';
