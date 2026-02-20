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

## Tier 4 -- AI 기능

AI 분석 기능을 위한 변수입니다. 모두 선택 사항이며, 최소 1개의 API 키가 있으면 해당 AI 기능이 활성화됩니다.

| 변수명 | 값 형식 | 출처 | 코드 위치 |
|--------|---------|------|-----------|
| `OPENAI_API_KEY` | `sk-...` | [OpenAI Platform](https://platform.openai.com/api-keys) | `src/lib/ai/resolve-key.ts` |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | [Anthropic Console](https://console.anthropic.com/) | `src/lib/ai/resolve-key.ts` |
| `GOOGLE_AI_API_KEY` | `AIza...` | [Google AI Studio](https://aistudio.google.com/apikey) | `src/lib/ai/resolve-key.ts` |

> **키 해석 우선순위**: 환경변수 → DB fallback (AI 관리 콘솔에서 등록한 키). 환경변수가 설정되어 있으면 DB 값보다 우선합니다. 상세: [08-ai-features.md](./08-ai-features.md#키-해석-우선순위)

## 환경별 설정 위치

| 환경 | 설정 파일/위치 | 비고 |
|------|---------------|------|
| 로컬 개발 | `.env.local` | Git에 커밋하지 않음 (`.gitignore` 포함) |
| Cloudflare Workers (프로덕션) | `npx wrangler secret put` 또는 CF 대시보드 > Workers & Pages > Settings > Variables | |
| GitHub Actions (CI) | GitHub > Settings > Secrets and variables > Actions | CI 테스트용 |

## 변수 개수 요약

| 티어 | 변수 수 | 필수 여부 |
|------|---------|-----------|
| Tier 1 (필수) | 4개 | 필수 |
| Tier 2 (배포) | 2개 | 배포 시 필수 |
| Tier 3 (풀기능) | 3개 | 선택 |
| Tier 4 (AI 기능) | 3개 | 선택 |
| **합계** | **12개** | |
