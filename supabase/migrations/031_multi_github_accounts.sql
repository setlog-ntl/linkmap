-- 031: Multi GitHub accounts support
-- 다중 GitHub 계정 지원을 위한 마이그레이션
-- 기존 1-account-per-user 제약 제거 → oauth_provider_user_id 기반 identity 매칭

-- 1. 기존 unique index 삭제 (1-account-per-user 제약)
DROP INDEX IF EXISTS idx_sa_user_service_no_project;
DROP INDEX IF EXISTS idx_sa_project_service;

-- 2. display_name 컬럼 추가 (사용자가 지정: "개인", "회사" 등)
ALTER TABLE service_accounts ADD COLUMN IF NOT EXISTS display_name TEXT;

-- 3. auth_method 컬럼 추가 (향후 GitHub App/PAT/Deploy Key 확장)
ALTER TABLE service_accounts ADD COLUMN IF NOT EXISTS auth_method TEXT DEFAULT 'oauth'
  CHECK (auth_method IN ('oauth', 'pat', 'github_app', 'deploy_key'));

-- 4. multi_account_provider 플래그 추가
ALTER TABLE service_accounts ADD COLUMN IF NOT EXISTS multi_account_provider BOOLEAN DEFAULT false;

-- 5. services 테이블에 supports_multi_account 추가
ALTER TABLE services ADD COLUMN IF NOT EXISTS supports_multi_account BOOLEAN DEFAULT false;
UPDATE services SET supports_multi_account = true WHERE slug = 'github';

-- 6. 기존 service_accounts에 multi_account_provider 백필
UPDATE service_accounts sa SET multi_account_provider = true
FROM services svc WHERE sa.service_id = svc.id AND svc.slug = 'github';

-- 7. GitHub 계정 유니크: user-level (project_id IS NULL)에서만 identity 중복 방지
CREATE UNIQUE INDEX idx_sa_github_identity
  ON service_accounts(user_id, service_id, oauth_provider_user_id)
  WHERE oauth_provider_user_id IS NOT NULL AND multi_account_provider = true AND project_id IS NULL;

-- 8. 비GitHub 서비스는 기존 1-per-project 유지
CREATE UNIQUE INDEX idx_sa_project_service_single
  ON service_accounts(project_id, service_id)
  WHERE project_id IS NOT NULL AND multi_account_provider = false;
CREATE UNIQUE INDEX idx_sa_user_service_single_no_project
  ON service_accounts(user_id, service_id)
  WHERE project_id IS NULL AND multi_account_provider = false;

-- 9. 자동 설정 트리거: 새 service_account 삽입 시 multi_account_provider 자동 설정
CREATE OR REPLACE FUNCTION set_multi_account_provider() RETURNS TRIGGER AS $$
BEGIN
  SELECT supports_multi_account INTO NEW.multi_account_provider
  FROM services WHERE id = NEW.service_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_multi_account_provider ON service_accounts;
CREATE TRIGGER trg_set_multi_account_provider
  BEFORE INSERT ON service_accounts
  FOR EACH ROW EXECUTE FUNCTION set_multi_account_provider();

-- 10. 빠른 조회 인덱스
CREATE INDEX IF NOT EXISTS idx_sa_provider_user_id
  ON service_accounts(oauth_provider_user_id)
  WHERE oauth_provider_user_id IS NOT NULL;

-- 11. display_name 백필 (기존 GitHub 계정)
UPDATE service_accounts SET display_name = oauth_metadata->>'login'
WHERE display_name IS NULL AND oauth_metadata->>'login' IS NOT NULL;

-- 12. oauth_states에 settings flow 추가
ALTER TABLE oauth_states DROP CONSTRAINT IF EXISTS oauth_states_flow_context_check;
ALTER TABLE oauth_states ADD CONSTRAINT oauth_states_flow_context_check
  CHECK (flow_context IN ('oneclick', 'project', 'settings'));

-- 13. RLS: user-level GitHub 계정 접근 정책 (project_id IS NULL)
-- 기존 정책 service_accounts_owner_all이 이미 user_id = auth.uid() 커버
-- 추가 변경 불필요
