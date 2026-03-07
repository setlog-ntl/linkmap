-- Deploy Error Logs: 배포 오류 개별 기록
-- Deploy Error Patterns: 유사 오류 자동 그룹화 (fingerprint 기반 중복 정리)

-- ============================================================
-- 1. deploy_error_patterns — 오류 패턴 (중복 그룹)
-- ============================================================
CREATE TABLE IF NOT EXISTS deploy_error_patterns (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint   TEXT NOT NULL UNIQUE,           -- error_category + failed_step 조합 해시
  error_category TEXT NOT NULL,                  -- 'repo_conflict','template_not_found','file_upload','permission','token','rate_limit','timeout','retry_exhausted','workflow_build','pages_error','network','quota','unknown'
  failed_step   TEXT,                            -- 실패한 배포 단계
  sample_message TEXT NOT NULL,                  -- 대표 에러 메시지
  cause         TEXT,                            -- 원인 설명
  solution      TEXT,                            -- 해결 방안
  occurrence_count INT NOT NULL DEFAULT 1,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_resolved   BOOLEAN NOT NULL DEFAULT false,
  resolution_note TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. deploy_error_logs — 개별 오류 기록
-- ============================================================
CREATE TABLE IF NOT EXISTS deploy_error_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deploy_id     UUID REFERENCES homepage_deploys(id) ON DELETE SET NULL,
  pattern_id    UUID REFERENCES deploy_error_patterns(id) ON DELETE SET NULL,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id   UUID REFERENCES homepage_templates(id) ON DELETE SET NULL,
  template_slug TEXT,
  site_name     TEXT,
  error_message TEXT NOT NULL,
  error_category TEXT NOT NULL,
  failed_step   TEXT,
  http_status   INT,
  error_context JSONB DEFAULT '{}'::jsonb,       -- 추가 컨텍스트 (repo_name, retry_count 등)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. Indexes
-- ============================================================
CREATE INDEX idx_deploy_error_logs_user_id ON deploy_error_logs(user_id);
CREATE INDEX idx_deploy_error_logs_pattern_id ON deploy_error_logs(pattern_id);
CREATE INDEX idx_deploy_error_logs_created_at ON deploy_error_logs(created_at DESC);
CREATE INDEX idx_deploy_error_logs_category ON deploy_error_logs(error_category);
CREATE INDEX idx_deploy_error_patterns_category ON deploy_error_patterns(error_category);
CREATE INDEX idx_deploy_error_patterns_last_seen ON deploy_error_patterns(last_seen_at DESC);

-- ============================================================
-- 4. RLS
-- ============================================================
ALTER TABLE deploy_error_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE deploy_error_logs ENABLE ROW LEVEL SECURITY;

-- 패턴: 관리자만 접근 (service_role)
CREATE POLICY "deploy_error_patterns_admin_all"
  ON deploy_error_patterns FOR ALL
  USING (false)
  WITH CHECK (false);

-- 로그: 관리자만 접근 (service_role)
CREATE POLICY "deploy_error_logs_admin_all"
  ON deploy_error_logs FOR ALL
  USING (false)
  WITH CHECK (false);

-- ============================================================
-- 5. updated_at 트리거 (patterns만)
-- ============================================================
CREATE OR REPLACE TRIGGER set_deploy_error_patterns_updated_at
  BEFORE UPDATE ON deploy_error_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 6. 패턴 upsert RPC (레이스 컨디션 방지)
-- ============================================================
CREATE OR REPLACE FUNCTION upsert_deploy_error_pattern(
  p_fingerprint TEXT,
  p_error_category TEXT,
  p_failed_step TEXT,
  p_sample_message TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO deploy_error_patterns (fingerprint, error_category, failed_step, sample_message)
  VALUES (p_fingerprint, p_error_category, p_failed_step, p_sample_message)
  ON CONFLICT (fingerprint) DO UPDATE SET
    occurrence_count = deploy_error_patterns.occurrence_count + 1,
    last_seen_at = now(),
    sample_message = EXCLUDED.sample_message
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
