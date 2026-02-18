-- 023: Template rebuild cleanup
-- 레거시 5개 static 템플릿 비활성화 및 Phase 1 display_order 재할당

-- 1. 5개 static 템플릿 비활성화
UPDATE homepage_templates
SET is_active = false
WHERE slug IN ('portfolio-static', 'landing-static', 'resume-static', 'blog-static', 'docs-static');

-- 2. Phase 1 display_order 재할당 (1, 2, 3)
UPDATE homepage_templates SET display_order = 1 WHERE slug = 'link-in-bio-pro';
UPDATE homepage_templates SET display_order = 2 WHERE slug = 'digital-namecard';
UPDATE homepage_templates SET display_order = 3 WHERE slug = 'dev-showcase';
