-- ============================================
-- 048: Add 'advertising' to services category CHECK
-- ============================================
-- 광고 네트워크 서비스(Google AdSense, Kakao AdFit, Criteo, Taboola,
-- Amazon Publisher Services, Google Ad Manager) 추가를 위해
-- TS ServiceCategory 타입과 DB CHECK 제약을 동기화합니다.

ALTER TABLE public.services DROP CONSTRAINT IF EXISTS services_category_check;

ALTER TABLE public.services ADD CONSTRAINT services_category_check
  CHECK (category IN (
    'auth', 'social_login', 'database', 'deploy', 'email', 'payment', 'storage', 'monitoring', 'ai', 'other',
    'cdn', 'cicd', 'testing', 'sms', 'push', 'chat', 'search', 'cms', 'analytics',
    'media', 'queue', 'cache', 'logging', 'feature_flags', 'scheduling', 'ecommerce',
    'serverless', 'code_quality', 'automation', 'domain', 'advertising'
  ));

-- advertising 서브카테고리 추가
INSERT INTO public.service_subcategories (id, category, name, name_ko, description, description_ko)
VALUES
  ('display_ads',    'advertising', 'Display Ads',    '디스플레이 광고', 'Banner and display advertising networks',           '배너 및 디스플레이 광고 네트워크'),
  ('native_ads',     'advertising', 'Native Ads',     '네이티브 광고',   'Native and content recommendation ads',             '네이티브 및 콘텐츠 추천 광고'),
  ('header_bidding', 'advertising', 'Header Bidding', '헤더 비딩',       'Programmatic header bidding and ad serving',        '프로그래매틱 헤더 비딩 및 광고 서버'),
  ('retargeting',    'advertising', 'Retargeting',    '리타겟팅',        'Retargeting and performance advertising',           '리타겟팅 및 퍼포먼스 광고')
ON CONFLICT (id) DO NOTHING;
