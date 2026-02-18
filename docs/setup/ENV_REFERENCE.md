# 환경변수 전체 참조표

Linkmap에서 사용하는 모든 환경변수 목록입니다.

## `NEXT_PUBLIC_` 접두사란?

Next.js에서 `NEXT_PUBLIC_` 접두사가 붙은 환경변수는 **클라이언트 번들에 포함**됩니다. 브라우저에서 접근 가능하므로 민감한 값(Secret Key, Service Role Key 등)에는 절대 사용하지 마세요.

## Tier 1 -- 필수

로컬 개발에 최소한으로 필요한 변수입니다.

| 변수명 | 값 형식 | 출처 | 코드 위치 |
|--------|---------|------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` | Supabase > Settings > API | `src/lib/supabase/client.ts`, `server.ts`, `admin.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (JWT) | Supabase > Settings > API | `src/lib/supabase/client.ts`, `server.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` (JWT) | Supabase > Settings > API | `src/lib/supabase/admin.ts` |
| `ENCRYPTION_KEY` | 64자 hex (`[0-9a-fA-F]{64}`) | `openssl rand -hex 32` | `src/lib/crypto/index.ts:15` |

## Tier 2 -- 배포

프로덕션 배포 및 서비스 연동에 필요한 변수입니다.

| 변수명 | 값 형식 | 출처 | 코드 위치 |
|--------|---------|------|-----------|
| `GITHUB_OAUTH_CLIENT_ID` | `Ov23li...` | GitHub > Developer Settings > OAuth Apps | `src/app/api/oauth/[provider]/authorize/route.ts` |
| `GITHUB_OAUTH_CLIENT_SECRET` | 문자열 | GitHub > Developer Settings > OAuth Apps | `src/app/api/oauth/[provider]/callback/route.ts` |

## Tier 3 -- 풀기능

결제, 에러 추적 등 부가 기능을 위한 변수입니다. 모두 선택 사항이며, 없으면 해당 기능만 비활성화됩니다.

| 변수명 | 값 형식 | 출처 | 코드 위치 |
|--------|---------|------|-----------|
| `STRIPE_SECRET_KEY` | `sk_test_...` / `sk_live_...` | Stripe > Developers > API Keys | `src/app/api/stripe/checkout/route.ts` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` / `pk_live_...` | Stripe > Developers > API Keys | 클라이언트 결제 UI |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe > Developers > Webhooks | `src/app/api/stripe/webhook/route.ts` |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://xxx@o123.ingest.sentry.io/456` | Sentry > Project Settings > Client Keys | `sentry.server.config.ts` |
| `SENTRY_AUTH_TOKEN` | `sntrys_...` | Sentry > Settings > Auth Tokens | `next.config.ts` (빌드 시 소스맵 업로드) |
| `SENTRY_ORG` | 조직 slug | Sentry URL에서 확인 | `next.config.ts` |
| `SENTRY_PROJECT` | 프로젝트 slug | Sentry 대시보드에서 확인 | `next.config.ts` |

## 환경별 설정 위치

| 환경 | 설정 파일/위치 | 비고 |
|------|---------------|------|
| 로컬 개발 | `.env.local` | Git에 커밋하지 않음 (`.gitignore` 포함) |
| Vercel (프로덕션) | Vercel 대시보드 > Settings > Environment Variables | Preview/Production 환경 분리 가능 |
| GitHub Actions (CI) | GitHub > Settings > Secrets and variables > Actions | CI 테스트용 |

## 변수 개수 요약

| 티어 | 변수 수 | 필수 여부 |
|------|---------|-----------|
| Tier 1 (필수) | 4개 | 필수 |
| Tier 2 (배포) | 2개 | 배포 시 필수 |
| Tier 3 (풀기능) | 7개 | 선택 |
| **합계** | **13개** | |
