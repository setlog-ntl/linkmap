# Linkmap 설정 가이드

Linkmap을 로컬 또는 프로덕션 환경에서 실행하기 위한 서비스 연결 설정 가이드입니다.

## 사전 준비물

| 항목 | 용도 |
|------|------|
| Node.js 18+ | 런타임 |
| npm 9+ | 패키지 관리 |
| Git | 소스 관리 |
| Supabase 계정 | DB, 인증 |
| Cloudflare 계정 (배포 시) | 호스팅 (Workers) |

## 티어별 분류

### Tier 1 -- 필수 (~15분)

로컬에서 앱을 실행하기 위한 최소 설정입니다.

| 서비스 | 가이드 | 환경변수 |
|--------|--------|----------|
| Supabase | [01-supabase.md](./01-supabase.md) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| 암호화 키 | [02-encryption.md](./02-encryption.md) | `ENCRYPTION_KEY` |

### Tier 2 -- 배포 (~25분)

프로덕션 배포 및 사용자 인증을 위한 설정입니다.

| 서비스 | 가이드 | 환경변수 |
|--------|--------|----------|
| Cloudflare Workers | [../cloudflare-migration.md](../cloudflare-migration.md) | (wrangler secret put 또는 CF 대시보드) |
| Google OAuth | [04-google-oauth.md](./04-google-oauth.md) | (Supabase 대시보드에서 설정) |
| GitHub OAuth | [05-github-oauth.md](./05-github-oauth.md) | `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET` |

### Tier 3 -- 풀기능 (~45분)

결제 등 부가 기능을 위한 설정입니다.

| 서비스 | 가이드 | 환경변수 |
|--------|--------|----------|
| Stripe | [06-stripe.md](./06-stripe.md) | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |

## 빠른 시작 (5분)

이미 Supabase 프로젝트가 있다면:

```bash
# 1. 저장소 클론
git clone https://github.com/your-org/linkmap.git
cd linkmap

# 2. 의존성 설치
npm ci

# 3. 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어 Supabase URL, Key, ENCRYPTION_KEY 입력

# 4. DB 마이그레이션 (Supabase CLI 사용 시)
npx supabase db push

# 5. 개발 서버 시작
npm run dev
```

## 참조 문서

| 문서 | 설명 |
|------|------|
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | 전체 배포 체크리스트 (GitHub + Cloudflare + Supabase) |
| [ENV_REFERENCE.md](./ENV_REFERENCE.md) | 환경변수 전체 참조표 |
| [COMMON_MISTAKES.md](./COMMON_MISTAKES.md) | 자주 하는 실수 모음 |
| [../GOOGLE_OAUTH_SETUP.md](../GOOGLE_OAUTH_SETUP.md) | Google OAuth 상세 설정 |
| [../GITHUB_OAUTH_TROUBLESHOOTING.md](../GITHUB_OAUTH_TROUBLESHOOTING.md) | GitHub OAuth 트러블슈팅 |
| [../oauth/](../oauth/) | OAuth 개념 문서 |

## 체크리스트

설정 완료 후 아래 항목을 확인하세요:

- [ ] `npm run dev`로 로컬 서버 정상 실행
- [ ] `/login` 페이지 접근 가능
- [ ] Google/GitHub OAuth 로그인 성공
- [ ] 프로젝트 생성 후 환경변수 저장/조회 정상
- [ ] 서비스 맵 시각화 렌더링 정상
- [ ] (배포 시) Cloudflare Workers 빌드 성공 (`npm run build:cf`)
- [ ] (배포 시) 프로덕션 URL에서 OAuth 콜백 정상
