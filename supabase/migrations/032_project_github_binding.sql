-- 032: Project-level GitHub binding
-- 프로젝트별 GitHub 계정 명시적 선택 + 추가 repo 메타데이터

-- 1. project_github_repos에 추가 컬럼
ALTER TABLE project_github_repos
  ADD COLUMN IF NOT EXISTS sync_branch TEXT DEFAULT 'main',
  ADD COLUMN IF NOT EXISTS sync_directory TEXT,
  ADD COLUMN IF NOT EXISTS webhook_secret_encrypted TEXT;

-- 2. projects에 default GitHub 계정 바인딩
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS default_github_account_id UUID
    REFERENCES service_accounts(id) ON DELETE SET NULL;
