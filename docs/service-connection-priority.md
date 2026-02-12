# 서비스 연결 가능성 & 우선순위

## 개요

Linkmap에서 지원하는 서비스별 계정 연결 방법과 구현 우선순위를 정리합니다.

## 연결 방법 분류

| 방법 | 설명 | 장점 | 단점 |
|------|------|------|------|
| **OAuth** | 사용자가 서비스에 로그인하여 권한 부여 | 안전, UX 좋음, 토큰 갱신 가능 | 별도 OAuth App 등록 필요 |
| **API Key** | 사용자가 서비스에서 발급받은 키를 직접 입력 | 간편, 대부분 서비스 지원 | 키 관리 책임이 사용자에게 |
| **Manual** | IAM/OIDC 등 수동 설정 | 보안 수준 높음 | 설정 복잡 |

## 서비스별 우선순위

| 우선순위 | 서비스 | 연결 방법 | 난이도 | 비고 |
|----------|--------|-----------|--------|------|
| **1** | **GitHub** | OAuth + API Key | Easy | repo, org, read:user 스코프 |
| 2 | Vercel | API Key | Easy | 배포 토큰 |
| 3 | Supabase | API Key | Easy | URL + Anon Key |
| 4 | Stripe | API Key | Medium | Secret + Publishable Key |
| 5 | OpenAI | API Key | Easy | 단일 API Key |
| 6 | Anthropic | API Key | Easy | 단일 API Key |
| 7 | Sentry | API Key | Medium | DSN + Auth Token |
| 8 | Slack | OAuth | Easy | Bot/User Token Scopes |
| 9 | GitLab | OAuth + API Key | Easy | read_api, write_repository |
| 10 | Clerk | API Key | Easy | 2개 키 (Secret + Publishable) |
| 11 | SendGrid | API Key | Easy | Bearer 토큰 |
| 12 | Firebase | API Key | Medium | API Key + Project ID |
| 13 | Cloudflare | API Key | Medium | API Token |
| 14 | Netlify | API Key | Easy | Personal Access Token |
| 15 | Railway | API Key | Easy | 계정 토큰 |
| — | AWS/GCP/Azure | Manual (OIDC) | Hard | IAM/Workload Identity |

## OAuth 자동 연결 가능 서비스

아래 서비스는 OAuth App 등록 후 자동 연결이 가능합니다:

- **GitHub** (구현 완료)
- GitLab
- Slack
- Bitbucket
- Stripe (OAuth 필수화 예정)
- Sentry
- Datadog

## API Key 연결 서비스

대부분의 서비스가 API Key 방식을 지원합니다:

- Vercel, Supabase, OpenAI, Anthropic, Clerk, SendGrid, Resend
- Mailgun, Twilio, PostHog, Cloudinary, Algolia
- Upstash Redis, Datadog, Cloudflare, Netlify, Railway

## 수동 설정만 가능

클라우드 인프라 서비스는 OIDC/IAM 기반 설정이 필요합니다:

- AWS (IAM Role + OIDC Provider)
- GCP (Workload Identity Federation)
- Azure (Service Principal + Federated Credential)

## 환경변수 요구사항

각 서비스의 `src/data/service-connections.ts`에 정의된 `api_key_fields`를 참조하세요.

## GitHub OAuth 설정 가이드

1. [GitHub Developer Settings](https://github.com/settings/developers)에서 새 OAuth App 생성
2. Authorization callback URL: `https://your-domain.com/api/oauth/github/callback`
3. `.env.local`에 다음 환경변수 추가:
   ```
   GITHUB_OAUTH_CLIENT_ID=your_client_id
   GITHUB_OAUTH_CLIENT_SECRET=your_client_secret
   ```
4. 필요한 스코프: `repo`, `read:org`, `read:user`
