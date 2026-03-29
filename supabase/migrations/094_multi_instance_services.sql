-- 094: Multi-instance services
-- 동일 서비스를 프로젝트 내에서 여러 인스턴스 등록 가능하도록 확장
-- 예: Supabase DB 2개, Vercel 프로젝트 2개 등

-- ============================================
-- 1. project_services: instance_label 추가 + UNIQUE 제약 제거
-- ============================================
ALTER TABLE project_services
  ADD COLUMN IF NOT EXISTS instance_label TEXT DEFAULT NULL;

-- 기존 UNIQUE(project_id, service_id) 제거 → 동일 service_id 다중 등록 허용
ALTER TABLE project_services
  DROP CONSTRAINT IF EXISTS project_services_project_id_service_id_key;

-- 조회 성능용 일반 인덱스 (unique 아님)
CREATE INDEX IF NOT EXISTS idx_ps_project_service_multi
  ON project_services(project_id, service_id);

-- ============================================
-- 2. user_connections: 인스턴스 레벨 FK 추가
-- ============================================
ALTER TABLE user_connections
  ADD COLUMN IF NOT EXISTS source_ps_id UUID REFERENCES project_services(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS target_ps_id UUID REFERENCES project_services(id) ON DELETE CASCADE;

-- 기존 데이터 백필: service_id → project_services.id 매핑
UPDATE user_connections uc
SET source_ps_id = (
  SELECT ps.id FROM project_services ps
  WHERE ps.project_id = uc.project_id AND ps.service_id = uc.source_service_id
  LIMIT 1
)
WHERE uc.source_ps_id IS NULL;

UPDATE user_connections uc
SET target_ps_id = (
  SELECT ps.id FROM project_services ps
  WHERE ps.project_id = uc.project_id AND ps.service_id = uc.target_service_id
  LIMIT 1
)
WHERE uc.target_ps_id IS NULL;

-- 인스턴스 기반 unique 제약 (ps_id가 있는 행에만 적용)
CREATE UNIQUE INDEX IF NOT EXISTS idx_uc_ps_pair
  ON user_connections(project_id, source_ps_id, target_ps_id)
  WHERE source_ps_id IS NOT NULL AND target_ps_id IS NOT NULL AND deleted_at IS NULL;

-- ============================================
-- 3. environment_variables: 인스턴스 바인딩
-- ============================================
ALTER TABLE environment_variables
  ADD COLUMN IF NOT EXISTS project_service_id UUID REFERENCES project_services(id) ON DELETE SET NULL;

-- 백필: service_id가 있는 환경변수를 해당 project_services.id에 매핑
UPDATE environment_variables ev
SET project_service_id = (
  SELECT ps.id FROM project_services ps
  WHERE ps.project_id = ev.project_id AND ps.service_id = ev.service_id
  LIMIT 1
)
WHERE ev.service_id IS NOT NULL AND ev.project_service_id IS NULL;

-- ============================================
-- 4. service_credentials: 인스턴스 바인딩
-- ============================================
ALTER TABLE service_credentials
  ADD COLUMN IF NOT EXISTS project_service_id UUID REFERENCES project_services(id) ON DELETE SET NULL;

-- 백필
UPDATE service_credentials sc
SET project_service_id = (
  SELECT ps.id FROM project_services ps
  WHERE ps.project_id = sc.project_id AND ps.service_id = sc.service_id
  LIMIT 1
)
WHERE sc.service_id IS NOT NULL AND sc.project_service_id IS NULL;

-- ============================================
-- 5. service_accounts: 인스턴스 바인딩
-- ============================================
ALTER TABLE service_accounts
  ADD COLUMN IF NOT EXISTS project_service_id UUID REFERENCES project_services(id) ON DELETE SET NULL;

-- 비-GitHub 서비스의 기존 단일 제약 제거 + 인스턴스 기반 제약으로 교체
DROP INDEX IF EXISTS idx_sa_project_service_single;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sa_ps_instance_single
  ON service_accounts(project_service_id, service_id)
  WHERE project_service_id IS NOT NULL AND multi_account_provider = false;

-- GitHub(다중계정) 서비스의 인스턴스 기반 제약
CREATE UNIQUE INDEX IF NOT EXISTS idx_sa_ps_instance_multi
  ON service_accounts(project_service_id, oauth_provider_user_id)
  WHERE project_service_id IS NOT NULL AND multi_account_provider = true AND oauth_provider_user_id IS NOT NULL;

-- ============================================
-- 6. project_service_overrides: 인스턴스별 레이어/위치
-- ============================================
ALTER TABLE project_service_overrides
  ADD COLUMN IF NOT EXISTS project_service_id UUID REFERENCES project_services(id) ON DELETE CASCADE;

-- 백필
UPDATE project_service_overrides pso
SET project_service_id = (
  SELECT ps.id FROM project_services ps
  WHERE ps.project_id = pso.project_id AND ps.service_id = pso.service_id
  LIMIT 1
)
WHERE pso.project_service_id IS NULL;

-- 인스턴스 기반 unique (기존 UNIQUE(project_id, service_id)는 유지 — 레거시 호환)
CREATE UNIQUE INDEX IF NOT EXISTS idx_pso_ps_instance
  ON project_service_overrides(project_service_id)
  WHERE project_service_id IS NOT NULL;
