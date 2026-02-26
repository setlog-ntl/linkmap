-- Migration 057: 소셜 로그인 서비스에 service_guides + api_key_url 추가
-- Kakao Login, Google OAuth, Naver Login, Sentry, Neon, Resend에 api_key_url 추가

-- Kakao Login: 가이드가 없었으므로 새 행 삽입
INSERT INTO service_guides (service_id, quick_start, api_key_url, api_key_url_label)
VALUES ('10000000-0000-4000-a000-000000000054',
  '카카오 개발자 콘솔에서 앱을 생성하고 REST API 키를 발급받아 Next.js 앱에 카카오 로그인을 추가할 수 있습니다.',
  'https://developers.kakao.com/console/app',
  'Kakao Developers')
ON CONFLICT (service_id) DO UPDATE SET
  api_key_url = EXCLUDED.api_key_url,
  api_key_url_label = EXCLUDED.api_key_url_label;

-- Google OAuth
INSERT INTO service_guides (service_id, quick_start, api_key_url, api_key_url_label)
VALUES ('10000000-0000-4000-a000-000000000055',
  'Google Cloud Console에서 OAuth 2.0 클라이언트를 생성하고 Client ID/Secret을 발급받아 소셜 로그인을 추가할 수 있습니다.',
  'https://console.cloud.google.com/apis/credentials',
  'Google Cloud Console')
ON CONFLICT (service_id) DO UPDATE SET
  api_key_url = EXCLUDED.api_key_url,
  api_key_url_label = EXCLUDED.api_key_url_label;

-- Naver Login
INSERT INTO service_guides (service_id, quick_start, api_key_url, api_key_url_label)
VALUES ('10000000-0000-4000-a000-000000000056',
  '네이버 개발자 센터에서 애플리케이션을 등록하고 Client ID/Secret을 발급받아 네이버 로그인을 추가할 수 있습니다.',
  'https://developers.naver.com/apps/#/myapps',
  'Naver Developers')
ON CONFLICT (service_id) DO UPDATE SET
  api_key_url = EXCLUDED.api_key_url,
  api_key_url_label = EXCLUDED.api_key_url_label;

-- Apple Login
INSERT INTO service_guides (service_id, quick_start, api_key_url, api_key_url_label)
VALUES ('10000000-0000-4000-a000-000000000057',
  'Apple Developer Console에서 Sign in with Apple을 활성화하고 Service ID를 생성하여 앱에 연결할 수 있습니다.',
  'https://developer.apple.com/account/resources/identifiers/list/serviceId',
  'Apple Developer')
ON CONFLICT (service_id) DO UPDATE SET
  api_key_url = EXCLUDED.api_key_url,
  api_key_url_label = EXCLUDED.api_key_url_label;

-- 기존 가이드가 있지만 api_key_url이 없는 서비스들에도 추가
-- Sentry
UPDATE service_guides SET
  api_key_url = 'https://sentry.io/settings/account/api/auth-tokens/',
  api_key_url_label = 'Sentry Auth Tokens'
WHERE service_id = '10000000-0000-4000-a000-000000000013' AND api_key_url IS NULL;

-- Neon
UPDATE service_guides SET
  api_key_url = 'https://console.neon.tech/app/settings/api-keys',
  api_key_url_label = 'Neon API Keys'
WHERE service_id = '10000000-0000-4000-a000-000000000015' AND api_key_url IS NULL;

-- Resend
UPDATE service_guides SET
  api_key_url = 'https://resend.com/api-keys',
  api_key_url_label = 'Resend API Keys'
WHERE service_id = '10000000-0000-4000-a000-000000000008' AND api_key_url IS NULL;
