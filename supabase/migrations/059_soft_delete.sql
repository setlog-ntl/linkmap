-- Migration 059: Soft Delete
-- projects, environment_variables, user_connections에 deleted_at 추가

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.environment_variables
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.user_connections
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 휴지통 조회 성능을 위한 Partial Index
CREATE INDEX IF NOT EXISTS idx_projects_deleted
  ON public.projects (user_id, deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_env_vars_deleted
  ON public.environment_variables (project_id, deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_connections_deleted
  ON public.user_connections (project_id, deleted_at) WHERE deleted_at IS NOT NULL;
