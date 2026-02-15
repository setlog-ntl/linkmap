-- 022_oneclick_cleanup.sql
-- OneLink 리팩토링: Vercel 레거시 기본값 정리 및 쿼터 합리화

-- deploy_method 기본값 vercel → github_pages
ALTER TABLE homepage_deploys ALTER COLUMN deploy_method SET DEFAULT 'github_pages';

-- deploy_target 기본값 vercel → github_pages
ALTER TABLE homepage_templates ALTER COLUMN deploy_target SET DEFAULT 'github_pages';

-- 쿼터 합리화: free 플랜 999999 → 3
UPDATE plan_quotas SET max_homepage_deploys = 3 WHERE plan = 'free';

-- 레거시 컬럼 DEPRECATED 주석
COMMENT ON COLUMN homepage_deploys.vercel_project_id IS 'DEPRECATED: Legacy Vercel field';
COMMENT ON COLUMN homepage_deploys.vercel_project_url IS 'DEPRECATED: Legacy Vercel field';
COMMENT ON COLUMN homepage_deploys.deployment_id IS 'DEPRECATED: Legacy Vercel deployment ID';
