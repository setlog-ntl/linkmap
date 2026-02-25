-- 프로젝트 즐겨찾기 컬럼 추가
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS is_favorited BOOLEAN NOT NULL DEFAULT false;

-- 즐겨찾기 조회 최적화 인덱스
CREATE INDEX IF NOT EXISTS idx_projects_user_favorited
  ON public.projects(user_id, is_favorited)
  WHERE is_favorited = true;
