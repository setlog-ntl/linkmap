-- 프로젝트 아이콘 슬러그 컬럼 추가
-- SERVICE_BRANDS 키를 저장하여 프로젝트 프로필 아이콘으로 사용
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS icon_slug TEXT;

COMMENT ON COLUMN public.projects.icon_slug IS 'SERVICE_BRANDS 키 (e.g. supabase, github). NULL이면 이니셜 표시';
