# Linkmap 배포 체크리스트

GitHub + Cloudflare Workers + Supabase 연동부터 프로덕션 배포까지의 전체 설정 흐름입니다.

> 이 문서는 사용자 도움말 페이지의 원본 소스로 사용됩니다.

---

## 전체 아키텍처

```
┌─────────────┐     push      ┌─────────────┐    auto deploy    ┌─────────────┐
│   GitHub    │ ───────────── │  Cloudflare  │ ──────────────── │  Production │
│  Repository │               │   Workers    │                  │   App       │
└─────────────┘               └──────┬──────┘                  └──────┬──────┘
                                     │                                │
                              env vars from                    API calls to
                              wrangler secret                  Supabase
                                     │                                │
                              ┌──────┴──────┐                  ┌──────┴──────┐
                              │  Cloudflare │                  │  Supabase   │
                              │  Secrets    │                  │   (DB/Auth) │
                              └─────────────┘                  └─────────────┘
```

**배포 흐름**: GitHub push → GitHub Actions → Cloudflare Workers 자동 배포
**인증 흐름**: 사용자 → Supabase Auth (Google/GitHub OAuth) → 세션 쿠키
**데이터 흐름**: 클라이언트 → Supabase API (RLS 적용) → PostgreSQL

---

## Phase 1: GitHub 저장소 설정 (~5분)

### 1-1. 저장소 Fork 또는 Clone

```bash
# 저장소 클론
git clone https://github.com/setlog-ntl/linkmap.git
cd linkmap

# 의존성 설치
npm ci
```

### 1-2. 브랜치 구조

| 브랜치 | 용도 |
|--------|------|
| `main` | 프로덕션 (Cloudflare Workers 자동 배포) |

### 1-3. GitHub Actions 확인

`.github/workflows/ci.yml`이 자동으로 아래를 실행합니다:

- [x] Secret 스캔 (gitleaks)
- [x] 의존성 보안 감사 (npm audit)
- [x] 코드 린트 (ESLint)
- [x] 타입 체크 (TypeScript)
- [x] 단위 테스트 (Vitest)
- [x] 프로덕션 빌드

`.github/workflows/deploy-cloudflare.yml`이 main push 시 자동 배포합니다.

---

## Phase 2: Supabase 프로젝트 생성 (~15분)

### 2-1. 프로젝트 생성

1. [supabase.com](https://supabase.com) 로그인
2. **New project** 클릭
3. 설정:
   - 프로젝트 이름: `linkmap` (자유)
   - DB 비밀번호: 안전한 비밀번호 설정
   - 리전: `ap-northeast-1` (도쿄) 또는 `ap-northeast-2` (서울)
4. 생성 완료 대기 (~2분)

### 2-2. API 키 복사

**Settings > API** 메뉴에서 3개의 값을 복사합니다:

| 항목 | 환경변수 | 주의사항 |
|------|----------|----------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | 공개 가능 |
| anon (public) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 공개 가능 (RLS 적용) |
| service_role (secret) | `SUPABASE_SERVICE_ROLE_KEY` | **서버 전용, 절대 클라이언트 노출 금지** |

### 2-3. URL Configuration (필수)

**Authentication > URL Configuration**에서:

```
Site URL:
  https://www.linkmap.biz     (프로덕션)

Redirect URLs:
  http://localhost:3000/**       (로컬 개발)
  https://www.linkmap.biz/**  (프로덕션)
```

> 이 설정을 빠뜨리면 OAuth 로그인 시 404 에러가 발생합니다.

### 2-4. OAuth Provider 활성화

#### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com) > APIs & Services > Credentials
2. OAuth 2.0 Client ID 생성
3. 승인된 리디렉션 URI: `https://<project-ref>.supabase.co/auth/v1/callback`
4. Supabase > **Authentication > Providers > Google** 활성화 후 Client ID/Secret 입력

> 상세: [04-google-oauth.md](./04-google-oauth.md)

#### GitHub OAuth (앱 로그인용)

1. [GitHub Developer Settings](https://github.com/settings/developers) > OAuth Apps
2. **New OAuth App** 생성:
   - Homepage URL: `https://www.linkmap.biz`
   - Callback URL: `https://<project-ref>.supabase.co/auth/v1/callback`
3. Supabase > **Authentication > Providers > GitHub** 활성화 후 Client ID/Secret 입력

### 2-5. DB 마이그레이션 실행

```bash
# Supabase CLI 설치 (미설치 시)
npm install -g supabase

# 로그인 및 프로젝트 연결
supabase login
supabase link --project-ref <your-project-ref>

# 마이그레이션 실행 (001~027 순차 적용)
supabase db push
```

또는 Supabase 대시보드 > **SQL Editor**에서 `supabase/migrations/` 파일을 순서대로 실행합니다.

---

## Phase 3: 암호화 키 생성 (~2분)

환경변수 값을 AES-256-GCM으로 암호화하기 위한 키입니다.

```bash
# 방법 1: OpenSSL (권장)
openssl rand -hex 32

# 방법 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 방법 3: PowerShell (Windows)
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) })
```

- **형식**: 정확히 64자 hex (`[0-9a-fA-F]{64}`)
- **환경변수**: `ENCRYPTION_KEY`
- **주의**: 키를 분실하면 기존 암호화된 데이터 복구 불가

---

## Phase 4: Cloudflare Workers 배포 설정 (~10분)

### 4-1. Cloudflare 계정 준비

1. [dash.cloudflare.com](https://dash.cloudflare.com) 로그인
2. **Workers & Pages** 이동
3. Workers.dev 서브도메인 설정 (최초 1회)

### 4-2. 환경변수 등록

`wrangler secret put` 명령으로 환경변수를 등록합니다:

#### Tier 1 (필수 — 4개)

```bash
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put ENCRYPTION_KEY
```

#### Tier 2 (서비스 연동 — 2개)

```bash
npx wrangler secret put GITHUB_OAUTH_CLIENT_ID
npx wrangler secret put GITHUB_OAUTH_CLIENT_SECRET
```

#### Tier 3 (풀기능 — 3개, 선택)

```bash
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

#### Tier 4 (AI 기능 — 최대 3개, 선택)

```bash
npx wrangler secret put OPENAI_API_KEY
# 필요 시 추가:
# npx wrangler secret put ANTHROPIC_API_KEY
# npx wrangler secret put GOOGLE_AI_API_KEY
```

### 4-3. 첫 배포

```bash
# Cloudflare 로그인
npx wrangler login

# Cloudflare Workers 빌드 (Linux/WSL/CI 필요)
npm run build:cf

# 배포
npx wrangler deploy
```

> Windows에서 `build:cf`는 불가합니다 (NTFS 콜론 파일명). WSL 또는 GitHub Actions에서 빌드하세요.

### 4-4. GitHub Actions 자동 배포

GitHub repo Settings > Secrets에 아래 값을 추가하면 main push 시 자동 배포됩니다:

| Secret | 출처 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare > My Profile > API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare > Workers > Account ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase |

---

## Phase 5: GitHub OAuth (서비스 연동용) (~10분)

앱 로그인용과는 **별개의** OAuth App으로, GitHub Secrets 동기화 기능에 사용됩니다.

### 5-1. OAuth App 생성

1. [GitHub Developer Settings](https://github.com/settings/developers) > OAuth Apps
2. **New OAuth App**:

| 필드 | 값 |
|------|-----|
| Application name | `Linkmap Service` |
| Homepage URL | `https://www.linkmap.biz` |
| Callback URL | `https://www.linkmap.biz/api/oauth/github/callback` |

3. Client ID → `npx wrangler secret put GITHUB_OAUTH_CLIENT_ID`
4. Client Secret 생성 → `npx wrangler secret put GITHUB_OAUTH_CLIENT_SECRET`

### 5-2. 스코프

| 스코프 | 용도 |
|--------|------|
| `repo` | 저장소 Secrets 읽기/쓰기 |
| `read:org` | 조직 저장소 목록 조회 |
| `read:user` | GitHub 프로필 정보 조회 |
| `workflow` | GitHub Actions 워크플로우 |

> 로컬 개발 시 별도 OAuth App을 만들어 Callback URL을 `http://localhost:3000/api/oauth/github/callback`로 설정하는 것을 권장합니다.

---

## Phase 6: 선택 서비스 설정

### Stripe (결제)

미설정 시 결제 기능만 비활성화됩니다. 상세: [06-stripe.md](./06-stripe.md)

---

## Phase 7: AI 기능 설정 (~5분, 선택)

AI 분석 기능(스택 추천, 환경변수 진단, 서비스맵 내레이션 등)을 활성화합니다. 미설정 시 AI 기능만 비활성화되며 나머지는 정상 동작합니다.

> 상세 가이드: [08-ai-features.md](./08-ai-features.md)

### 7-1. API 키 발급

최소 1개의 AI 프로바이더 키가 필요합니다.

| 프로바이더 | 환경변수 | 발급처 |
|-----------|----------|--------|
| OpenAI (권장) | `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| Anthropic | `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/) |
| Google AI | `GOOGLE_AI_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

### 7-2. 환경변수 등록

```bash
# 로컬 — .env.local에 추가
OPENAI_API_KEY=sk-...

# Cloudflare Workers
npx wrangler secret put OPENAI_API_KEY
```

### 7-3. 검증

```bash
# 프로덕션 로그 확인
npx wrangler tail
# 다른 터미널에서 AI 기능 사용 → 로그에서 200 응답 확인
```

> **키 우선순위**: 환경변수 → DB fallback (AI 관리 콘솔). 환경변수가 있으면 DB 설정은 무시됩니다.

---

## 최종 검증 체크리스트

### 로컬 환경

```bash
# .env.local 생성
cp .env.local.example .env.local
# 값 입력 후:

npm run dev
# → http://localhost:3000 접근 가능?
```

- [ ] 로컬 서버 정상 실행 (`npm run dev`)
- [ ] `/login` 페이지 접근 가능
- [ ] Google OAuth 로그인 성공
- [ ] GitHub OAuth 로그인 성공
- [ ] 프로젝트 생성 가능
- [ ] 환경변수 저장/조회 정상 (암호화/복호화)
- [ ] 서비스 맵 시각화 렌더링
- [ ] AI 스택 추천 응답 정상 (Tier 4 설정 시)

### 프로덕션 환경

- [ ] Cloudflare Workers 빌드 성공 (`npm run build:cf`)
- [ ] `https://www.linkmap.biz` 접근 가능
- [ ] 프로덕션 URL에서 OAuth 로그인 성공
- [ ] 환경변수 CRUD 정상 동작
- [ ] GitHub Secrets 동기화 정상 (Tier 2 설정 시)
- [ ] Stripe 결제 플로우 정상 (Tier 3 설정 시)
- [ ] AI 기능 호출 시 200 응답 (Tier 4 설정 시)

---

## 트러블슈팅 빠른 참조

| 증상 | 원인 | 해결 |
|------|------|------|
| OAuth 로그인 시 404 | Supabase URL Configuration 미설정 | [Phase 2-3](#2-3-url-configuration-필수) 확인 |
| 환경변수 저장 시 500 | `ENCRYPTION_KEY` 미설정/형식 오류 | [Phase 3](#phase-3-암호화-키-생성-2분) 확인 |
| 로컬 OK, 프로덕션 에러 | Cloudflare 환경변수 누락 | [Phase 4-2](#4-2-환경변수-등록) 확인 |
| 새 라우트 404 | 빌드 캐시 | `.open-next` 삭제 후 재빌드 |
| GitHub 연동 에러 | OAuth Callback URL 불일치 | [Phase 5-1](#5-1-oauth-app-생성) 확인 |
| 빌드 시 타입 에러 | 로컬에서 `npm run typecheck` 먼저 확인 | `npx tsc --noEmit` 실행 |
| AI 기능 500 에러 | `OPENAI_API_KEY` 미설정 | [Phase 7](#phase-7-ai-기능-설정-5분-선택) 확인 |

> 상세 트러블슈팅: [COMMON_MISTAKES.md](./COMMON_MISTAKES.md)

---

## 설정 파일 참조 맵

```
linkmap/
├── wrangler.jsonc             ← Cloudflare Workers 배포 설정
├── open-next.config.ts        ← OpenNext Cloudflare 어댑터 설정
├── next.config.ts             ← Next.js 설정 (보안 헤더)
├── proxy.ts                   ← Next.js 16 proxy (세션 관리 + 라우트 보호)
├── .env.local.example         ← 환경변수 템플릿
├── .github/workflows/
│   ├── ci.yml                 ← CI 파이프라인
│   └── deploy-cloudflare.yml  ← Cloudflare Workers 자동 배포
├── supabase/migrations/       ← DB 스키마 (001~027)
└── src/lib/supabase/
    ├── client.ts              ← 브라우저 Supabase 클라이언트
    ├── server.ts              ← 서버 Supabase 클라이언트
    ├── admin.ts               ← Service Role 클라이언트 (RLS 바이패스)
    └── session.ts             ← 세션 갱신 로직 (proxy.ts에서 호출)
```

---

## 환경변수 총 요약

| 티어 | 변수 수 | 필수 여부 | 예상 시간 |
|------|---------|-----------|-----------|
| Tier 1 (필수) | 4개 | 필수 | ~15분 |
| Tier 2 (배포) | 2개 | 서비스 연동 시 필수 | ~10분 |
| Tier 3 (풀기능) | 3개 | 선택 | ~10분 |
| Tier 4 (AI 기능) | 3개 | 선택 | ~5분 |
| **합계** | **12개** | | **~40분** |
