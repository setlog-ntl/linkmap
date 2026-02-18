# Linkmap 배포 체크리스트

GitHub + Vercel + Supabase 연동부터 프로덕션 배포까지의 전체 설정 흐름입니다.

> 이 문서는 사용자 도움말 페이지의 원본 소스로 사용됩니다.

---

## 전체 아키텍처

```
┌─────────────┐     push      ┌─────────────┐    auto deploy    ┌─────────────┐
│   GitHub    │ ───────────── │   Vercel    │ ──────────────── │  Production │
│  Repository │               │   Build     │                  │   App       │
└─────────────┘               └──────┬──────┘                  └──────┬──────┘
                                     │                                │
                              env vars from                    API calls to
                              Vercel Dashboard                 Supabase
                                     │                                │
                              ┌──────┴──────┐                  ┌──────┴──────┐
                              │   Vercel    │                  │  Supabase   │
                              │  Env Vars   │                  │   (DB/Auth) │
                              └─────────────┘                  └─────────────┘
```

**배포 흐름**: GitHub push → Vercel 자동 빌드 → 프로덕션 배포
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
| `main` | 프로덕션 (Vercel 자동 배포) |

> PR을 통한 `main` 머지를 권장합니다. Vercel은 PR에 대해 Preview 배포를 자동 생성합니다.

### 1-3. GitHub Actions 확인

`.github/workflows/ci.yml`이 자동으로 아래를 실행합니다:

- [x] Secret 스캔 (gitleaks)
- [x] 의존성 보안 감사 (npm audit)
- [x] 코드 린트 (ESLint)
- [x] 타입 체크 (TypeScript)
- [x] 단위 테스트 (Vitest)
- [x] 프로덕션 빌드

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

## Phase 4: Vercel 배포 설정 (~10분)

### 4-1. 프로젝트 Import

1. [vercel.com](https://vercel.com) 로그인
2. **Add New > Project**
3. GitHub 저장소 Import (`setlog-ntl/linkmap`)
4. Framework: **Next.js** (자동 감지)
5. **Deploy** 클릭

### 4-2. 환경변수 등록

**Settings > Environment Variables**에서 아래 변수를 등록합니다:

#### Tier 1 (필수 — 4개)

```
NEXT_PUBLIC_SUPABASE_URL      = https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci... (Supabase anon key)
SUPABASE_SERVICE_ROLE_KEY     = eyJhbGci... (Supabase service role key)
ENCRYPTION_KEY                = <64자 hex> (Phase 3에서 생성)
```

#### Tier 2 (서비스 연동 — 2개)

```
GITHUB_OAUTH_CLIENT_ID        = Ov23li... (서비스 연동용 OAuth App)
GITHUB_OAUTH_CLIENT_SECRET    = <secret>
```

#### Tier 3 (풀기능 — 7개, 선택)

```
STRIPE_SECRET_KEY                   = sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  = pk_test_...
STRIPE_WEBHOOK_SECRET               = whsec_...
NEXT_PUBLIC_SENTRY_DSN              = https://xxx@o123.ingest.sentry.io/456
SENTRY_AUTH_TOKEN                   = sntrys_...
SENTRY_ORG                         = your-org
SENTRY_PROJECT                     = linkmap
```

### 4-3. 첫 배포 확인

환경변수 등록 후:

1. **Deployments** > 최신 배포 > **...** > **Redeploy**
2. **"Use existing Build Cache" 체크 해제**
3. **Redeploy** 클릭
4. 빌드 로그에서 모든 라우트가 생성되는지 확인

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

3. Client ID 복사 → Vercel `GITHUB_OAUTH_CLIENT_ID`
4. Client Secret 생성 및 복사 → Vercel `GITHUB_OAUTH_CLIENT_SECRET`

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

### Sentry (에러 추적)

미설정 시 에러 추적이 비활성화됩니다. 상세: [07-sentry.md](./07-sentry.md)

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

### 프로덕션 환경

- [ ] Vercel 빌드 성공 (Build Logs에 에러 없음)
- [ ] `https://www.linkmap.biz` 접근 가능
- [ ] 프로덕션 URL에서 OAuth 로그인 성공
- [ ] 환경변수 CRUD 정상 동작
- [ ] GitHub Secrets 동기화 정상 (Tier 2 설정 시)
- [ ] Stripe 결제 플로우 정상 (Tier 3 설정 시)

---

## 트러블슈팅 빠른 참조

| 증상 | 원인 | 해결 |
|------|------|------|
| OAuth 로그인 시 404 | Supabase URL Configuration 미설정 | [Phase 2-3](#2-3-url-configuration-필수) 확인 |
| 환경변수 저장 시 500 | `ENCRYPTION_KEY` 미설정/형식 오류 | [Phase 3](#phase-3-암호화-키-생성-2분) 확인 |
| 로컬 OK, 프로덕션 에러 | Vercel 환경변수 누락 | [Phase 4-2](#4-2-환경변수-등록) 확인 |
| 새 라우트 404 | Vercel 빌드 캐시 | 캐시 없이 재배포 |
| GitHub 연동 에러 | OAuth Callback URL 불일치 | [Phase 5-1](#5-1-oauth-app-생성) 확인 |
| 빌드 시 타입 에러 | 로컬에서 `npm run typecheck` 먼저 확인 | `npx tsc --noEmit` 실행 |

> 상세 트러블슈팅: [COMMON_MISTAKES.md](./COMMON_MISTAKES.md)

---

## 설정 파일 참조 맵

```
linkmap/
├── vercel.json              ← Vercel 빌드/배포 설정
├── next.config.ts           ← Next.js 설정 (보안 헤더, Sentry)
├── proxy.ts                 ← Next.js 16 proxy (세션 관리 + 라우트 보호)
├── .env.local.example       ← 환경변수 템플릿
├── .github/workflows/ci.yml ← CI 파이프라인
├── supabase/migrations/     ← DB 스키마 (001~027)
└── src/lib/supabase/
    ├── client.ts            ← 브라우저 Supabase 클라이언트
    ├── server.ts            ← 서버 Supabase 클라이언트
    ├── admin.ts             ← Service Role 클라이언트 (RLS 바이패스)
    └── session.ts           ← 세션 갱신 로직 (proxy.ts에서 호출)
```

---

## 환경변수 총 요약

| 티어 | 변수 수 | 필수 여부 | 예상 시간 |
|------|---------|-----------|-----------|
| Tier 1 (필수) | 4개 | 필수 | ~15분 |
| Tier 2 (배포) | 2개 | 서비스 연동 시 필수 | ~10분 |
| Tier 3 (풀기능) | 7개 | 선택 | ~20분 |
| **합계** | **13개** | | **~45분** |
