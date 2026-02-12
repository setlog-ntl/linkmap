-- service_accounts: 프로젝트별 외부 서비스 자격증명 저장
CREATE TABLE public.service_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_type TEXT NOT NULL CHECK (connection_type IN ('oauth', 'api_key', 'manual')),
  -- OAuth 필드 (암호화)
  encrypted_access_token TEXT,
  encrypted_refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  oauth_scopes TEXT[],
  oauth_provider_user_id TEXT,
  oauth_metadata JSONB DEFAULT '{}',
  -- API Key 필드 (암호화)
  encrypted_api_key TEXT,
  api_key_label TEXT,
  -- 상태
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'error')),
  last_verified_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, service_id)
);

-- oauth_states: CSRF 보호용 임시 상태 토큰
CREATE TABLE public.oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  service_slug TEXT NOT NULL,
  state_token TEXT UNIQUE NOT NULL,
  redirect_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '10 minutes')
);

-- Indexes
CREATE INDEX idx_service_accounts_project ON service_accounts(project_id);
CREATE INDEX idx_service_accounts_user ON service_accounts(user_id);
CREATE INDEX idx_oauth_states_token ON oauth_states(state_token);
CREATE INDEX idx_oauth_states_expires ON oauth_states(expires_at);

-- RLS 정책
ALTER TABLE service_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;

-- service_accounts: 프로젝트 소유자만 접근
CREATE POLICY "service_accounts_owner_all"
  ON service_accounts FOR ALL
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM projects p WHERE p.id = project_id AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM projects p WHERE p.id = project_id AND p.user_id = auth.uid()
    )
  );

-- 팀 멤버 읽기 전용 (teams 테이블이 있는 경우)
CREATE POLICY "service_accounts_team_read"
  ON service_accounts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = project_id AND tm.user_id = auth.uid()
    )
  );

-- oauth_states: 본인만 접근
CREATE POLICY "oauth_states_owner"
  ON oauth_states FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 만료된 oauth_states 자동 정리 (cron job 또는 앱에서 처리)
