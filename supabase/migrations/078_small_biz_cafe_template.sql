-- small-biz-cafe 템플릿 등록 + small-biz 설명 업데이트
-- 2026-03-09

-- 1. small-biz-cafe 신규 등록
INSERT INTO homepage_templates (
  id, slug, name, name_ko, description, description_ko,
  github_owner, github_repo, framework,
  required_env_vars, tags, is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0008-4000-9000-000000000008',
  'small-biz-cafe',
  'Small Biz - Cafe',
  '카페/음료 전문점',
  'Cafe & coffee shop promotion page',
  '카페 및 커피 전문점 홍보 페이지',
  'linkmap-templates', 'small-biz-cafe', 'nextjs',
  '["NEXT_PUBLIC_SITE_NAME"]'::jsonb,
  ARRAY['cafe', 'coffee', 'small-business'],
  false, true, 7
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description,
  description_ko = EXCLUDED.description_ko,
  is_active = true;

-- 2. 기존 small-biz 설명을 요리주점으로 업데이트
UPDATE homepage_templates
SET
  name_ko = '요리주점/레스토랑',
  description_ko = '요리주점 및 레스토랑 홍보 페이지',
  description = 'Izakaya & restaurant promotion page'
WHERE slug = 'small-biz';
