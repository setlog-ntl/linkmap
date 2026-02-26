-- Migration 056: service_guides에 API 키 콘솔 URL 필드 추가
-- api_key_url: 외부 API 키 발급/확인 콘솔 URL
-- api_key_url_label: 버튼에 표시될 라벨 (없으면 기본값 사용)

ALTER TABLE service_guides
  ADD COLUMN IF NOT EXISTS api_key_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS api_key_url_label TEXT DEFAULT NULL;

-- 13개 서비스 API 키 콘솔 URL 데이터 시드
UPDATE service_guides SET api_key_url = 'https://supabase.com/dashboard/project/_/settings/api', api_key_url_label = 'Supabase Dashboard' WHERE service_id = '10000000-0000-4000-a000-000000000001';
UPDATE service_guides SET api_key_url = 'https://console.firebase.google.com', api_key_url_label = 'Firebase Console' WHERE service_id = '10000000-0000-4000-a000-000000000002';
UPDATE service_guides SET api_key_url = 'https://vercel.com/account/tokens', api_key_url_label = 'Vercel Tokens' WHERE service_id = '10000000-0000-4000-a000-000000000003';
UPDATE service_guides SET api_key_url = 'https://dashboard.stripe.com/apikeys', api_key_url_label = 'Stripe API Keys' WHERE service_id = '10000000-0000-4000-a000-000000000005';
UPDATE service_guides SET api_key_url = 'https://dashboard.clerk.com', api_key_url_label = 'Clerk Dashboard' WHERE service_id = '10000000-0000-4000-a000-000000000006';
UPDATE service_guides SET api_key_url = 'https://platform.openai.com/api-keys', api_key_url_label = 'OpenAI API Keys' WHERE service_id = '10000000-0000-4000-a000-000000000010';
UPDATE service_guides SET api_key_url = 'https://app.posthog.com/settings/project-api-key', api_key_url_label = 'PostHog Project Key' WHERE service_id = '10000000-0000-4000-a000-000000000019';
UPDATE service_guides SET api_key_url = 'https://www.google.com/adsense', api_key_url_label = 'Google AdSense' WHERE service_id = '10000000-0000-4000-a000-000000000097';
UPDATE service_guides SET api_key_url = 'https://adfit.kakao.com', api_key_url_label = 'Kakao AdFit' WHERE service_id = '10000000-0000-4000-a000-000000000098';
UPDATE service_guides SET api_key_url = 'https://marketing.criteo.com', api_key_url_label = 'Criteo Console' WHERE service_id = '10000000-0000-4000-a000-000000000099';
UPDATE service_guides SET api_key_url = 'https://backstage.taboola.com', api_key_url_label = 'Taboola Backstage' WHERE service_id = '10000000-0000-4000-a000-000000000100';
UPDATE service_guides SET api_key_url = 'https://aps.amazon.com/aps/index.html', api_key_url_label = 'Amazon APS' WHERE service_id = '10000000-0000-4000-a000-000000000101';
UPDATE service_guides SET api_key_url = 'https://admanager.google.com', api_key_url_label = 'Google Ad Manager' WHERE service_id = '10000000-0000-4000-a000-000000000102';
