-- ============================================
-- 083: Add 'sns' to services category CHECK
-- ============================================
-- SNS 플랫폼 서비스(Instagram, YouTube, X, TikTok, LinkedIn, Threads) 추가를 위해
-- TS ServiceCategory 타입과 DB CHECK 제약을 동기화합니다.

ALTER TABLE public.services DROP CONSTRAINT IF EXISTS services_category_check;

ALTER TABLE public.services ADD CONSTRAINT services_category_check
  CHECK (category IN (
    'auth', 'social_login', 'database', 'deploy', 'email', 'payment', 'storage', 'monitoring', 'ai', 'other',
    'cdn', 'cicd', 'testing', 'sms', 'push', 'chat', 'search', 'cms', 'analytics',
    'media', 'queue', 'cache', 'logging', 'feature_flags', 'scheduling', 'ecommerce',
    'serverless', 'code_quality', 'automation', 'domain', 'advertising', 'sns'
  ));

-- sns 서브카테고리 추가
INSERT INTO public.service_subcategories (id, category, name, name_ko, description, description_ko)
VALUES
  ('social-media',      'sns', 'Social Media',      '소셜 미디어',   'Social media platform APIs',              '소셜 미디어 플랫폼 API'),
  ('video-platform',    'sns', 'Video Platform',     '영상 플랫폼',   'Video sharing platform APIs',             '영상 공유 플랫폼 API'),
  ('professional-sns',  'sns', 'Professional SNS',   '비즈니스 SNS',  'Professional networking platform APIs',   '비즈니스 네트워킹 플랫폼 API')
ON CONFLICT (id) DO NOTHING;
