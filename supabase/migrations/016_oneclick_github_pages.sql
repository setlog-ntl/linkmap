-- 016: GitHub Pages one-click deploy support

-- homepage_deploys에 GitHub Pages 필드 추가
ALTER TABLE homepage_deploys
  ADD COLUMN IF NOT EXISTS deploy_method TEXT DEFAULT 'vercel' CHECK (deploy_method IN ('vercel','github_pages')),
  ADD COLUMN IF NOT EXISTS pages_url TEXT,
  ADD COLUMN IF NOT EXISTS pages_status TEXT DEFAULT 'pending' CHECK (pages_status IN ('pending','enabling','building','built','errored'));

-- homepage_templates에 deploy_target 추가
ALTER TABLE homepage_templates
  ADD COLUMN IF NOT EXISTS deploy_target TEXT DEFAULT 'vercel' CHECK (deploy_target IN ('vercel','github_pages','both'));

-- 비로그인 템플릿 조회를 위한 RLS 변경
DROP POLICY IF EXISTS "authenticated_read_templates" ON homepage_templates;
CREATE POLICY "public_read_templates" ON homepage_templates FOR SELECT USING (is_active = true);

-- GitHub Pages용 정적 템플릿 시드 (5개)
INSERT INTO homepage_templates (slug, name, name_ko, description, description_ko, github_owner, github_repo, framework, tags, is_premium, is_active, display_order, deploy_target) VALUES
  ('portfolio-static', 'Portfolio', '포트폴리오', 'Clean personal portfolio', '깔끔한 개인 포트폴리오', 'linkmap-templates', 'portfolio-static', 'static', ARRAY['portfolio','html'], false, true, 1, 'github_pages'),
  ('landing-static', 'Landing Page', '랜딩 페이지', 'Business landing page', '비즈니스 랜딩 페이지', 'linkmap-templates', 'landing-static', 'static', ARRAY['landing','business'], false, true, 2, 'github_pages'),
  ('resume-static', 'Resume', '온라인 이력서', 'Professional resume page', '온라인 이력서 페이지', 'linkmap-templates', 'resume-static', 'static', ARRAY['resume','cv'], false, true, 3, 'github_pages'),
  ('blog-static', 'Blog', '블로그', 'Simple blog', '심플 블로그', 'linkmap-templates', 'blog-static', 'static', ARRAY['blog','minimal'], false, true, 4, 'github_pages'),
  ('docs-static', 'Documentation', '문서 사이트', 'Documentation site', '기술 문서 사이트', 'linkmap-templates', 'docs-static', 'static', ARRAY['docs','technical'], true, true, 5, 'github_pages')
ON CONFLICT (slug) DO NOTHING;
