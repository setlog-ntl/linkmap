-- ============================================
-- 045: Add 'domain' to services category CHECK
-- ============================================
-- TS ServiceCategory 타입에 'domain'이 존재하나
-- DB CHECK 제약조건에 누락되어 도메인 서비스(가비아, 후이즈, 카페24 등) INSERT 실패 문제 수정

ALTER TABLE public.services DROP CONSTRAINT IF EXISTS services_category_check;

ALTER TABLE public.services ADD CONSTRAINT services_category_check
  CHECK (category IN (
    'auth', 'social_login', 'database', 'deploy', 'email', 'payment', 'storage', 'monitoring', 'ai', 'other',
    'cdn', 'cicd', 'testing', 'sms', 'push', 'chat', 'search', 'cms', 'analytics',
    'media', 'queue', 'cache', 'logging', 'feature_flags', 'scheduling', 'ecommerce',
    'serverless', 'code_quality', 'automation', 'domain'
  ));
