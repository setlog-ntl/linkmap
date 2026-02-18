# Vercel 배포

Linkmap은 Vercel에 배포됩니다. Next.js 16 App Router 프로젝트이므로 별도 빌드 설정 없이 연결할 수 있습니다.

## 1. 프로젝트 연결

1. [vercel.com](https://vercel.com) 로그인
2. **Add New > Project**
3. GitHub 저장소 Import (`setlog-ntl/linkmap`)
4. Framework Preset: **Next.js** (자동 감지)
5. **Deploy** 클릭

> Vercel은 GitHub 저장소와 연결되면 `main` 브랜치에 push할 때마다 자동 배포됩니다.

## 2. 환경변수 설정

**Settings > Environment Variables**에서 아래 변수를 모두 추가합니다.

### 필수 (Tier 1)

| 변수명 | 값 출처 | 비고 |
|--------|---------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 대시보드 > Settings > API | 클라이언트 공개 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 대시보드 > Settings > API | 클라이언트 공개 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 대시보드 > Settings > API | 서버 전용 |
| `ENCRYPTION_KEY` | `openssl rand -hex 32`로 생성 | 서버 전용, 64자 hex |

### 배포 (Tier 2)

| 변수명 | 값 출처 | 비고 |
|--------|---------|------|
| `GITHUB_OAUTH_CLIENT_ID` | GitHub OAuth App 설정 | 서비스 연동용 |
| `GITHUB_OAUTH_CLIENT_SECRET` | GitHub OAuth App 설정 | 서버 전용 |

### 풀기능 (Tier 3)

| 변수명 | 값 출처 | 비고 |
|--------|---------|------|
| `STRIPE_SECRET_KEY` | Stripe 대시보드 > API Keys | 서버 전용 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 대시보드 > API Keys | 클라이언트 공개 |
| `STRIPE_WEBHOOK_SECRET` | Stripe 대시보드 > Webhooks | 서버 전용 |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry 대시보드 > Project Settings > DSN | 클라이언트 공개 |
| `SENTRY_AUTH_TOKEN` | Sentry 대시보드 > Auth Tokens | 빌드 시 사용 |
| `SENTRY_ORG` | Sentry 조직 slug | 빌드 시 사용 |
| `SENTRY_PROJECT` | Sentry 프로젝트 slug | 빌드 시 사용 |

> 전체 목록은 [ENV_REFERENCE.md](./ENV_REFERENCE.md)를 참고하세요.

### 환경변수 환경 분리

Vercel은 **Production**, **Preview**, **Development** 세 가지 환경을 지원합니다:

| 환경 | 용도 | 추천 |
|------|------|------|
| Production | 프로덕션 배포 (`main` 브랜치) | 모든 Tier 1~3 변수 |
| Preview | PR 미리보기 배포 | Tier 1~2 변수 |
| Development | 로컬 개발 (`vercel env pull`) | Tier 1 변수 |

> 환경변수 추가/변경 후에는 **반드시 재배포**해야 적용됩니다. (자동 재배포되지 않음)

## 3. vercel.json 설명

```json
{
  "framework": "nextjs",
  "installCommand": "npm ci",
  "buildCommand": "npm run build",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD -- . ':!templates' ':!docs' ':!packages'"
}
```

| 필드 | 설명 |
|------|------|
| `framework` | Next.js 프레임워크 지정 |
| `installCommand` | `npm ci`로 clean install (lock 파일 기준) |
| `buildCommand` | `npm run build`로 프로덕션 빌드 |
| `ignoreCommand` | `templates/`, `docs/`, `packages/`만 변경된 커밋은 빌드 스킵 |

### ignoreCommand 동작 원리

- 종료 코드 `0` (변경 없음) → 빌드 **스킵**
- 종료 코드 `1` (변경 있음) → 빌드 **실행**
- `':!templates'` 등은 git pathspec 제외 패턴

> **강제 전체 빌드가 필요할 때**: `ignoreCommand`를 `""` (빈 문자열)로 변경하면 모든 커밋에서 빌드가 실행됩니다. 문제 해결 후 원래 값으로 복원하세요.

## 4. Next.js 16 proxy 규약

Linkmap은 Next.js 16의 `proxy.ts` 규약을 사용합니다 (기존 `middleware.ts` 대체):

```
proxy.ts          ← 루트 프록시 (세션 관리 + 라우트 보호)
src/lib/supabase/session.ts  ← Supabase 세션 갱신 로직
```

**proxy.ts 역할**:
- 모든 페이지 요청에서 Supabase 세션 토큰 자동 갱신
- `/dashboard`, `/project/*` 등 보호 라우트에서 미인증 사용자를 `/login`으로 리다이렉트
- `/login`, `/signup` 등 인증 페이지에서 로그인된 사용자를 `/dashboard`로 리다이렉트

> Next.js 16.1.x에서 `middleware.ts`는 deprecated 경고가 표시됩니다. `proxy.ts`가 권장 방식입니다.

## 5. 캐시 없이 재배포

새 라우트가 반영되지 않거나 빌드 문제가 있을 때:

1. Vercel 대시보드 > **Deployments** 탭
2. 최신 배포 선택 > **...** 메뉴 > **Redeploy**
3. **"Use existing Build Cache"** 체크 해제
4. **Redeploy** 클릭

또는 CLI:

```bash
vercel --force
```

## 6. 도메인 설정

커스텀 도메인 사용 시 Supabase의 URL Configuration도 함께 업데이트해야 합니다:

1. Vercel에서 커스텀 도메인 추가
2. Supabase > Authentication > URL Configuration:
   - Site URL: `https://your-domain.com`
   - Redirect URLs에 `https://your-domain.com/**` 추가
3. Google/GitHub OAuth App의 콜백 URL도 업데이트

## 7. GitHub Actions CI/CD

`main` 브랜치에 push 또는 PR 생성 시 자동으로 CI 파이프라인이 실행됩니다:

```
.github/workflows/ci.yml
├── quality (push + PR)
│   ├── Secret scan (gitleaks)
│   ├── npm ci
│   ├── npm audit --audit-level=high
│   ├── Lint (ESLint)
│   ├── Type check (tsc --noEmit)
│   ├── Unit tests (Vitest)
│   └── Build (next build)
└── e2e (PR only, quality 통과 후)
    ├── Playwright 브라우저 설치
    ├── Build + E2E 테스트
    └── Report 아티팩트 업로드
```

### CI에서 필요한 GitHub Secrets

| Secret | 용도 | 필수 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 빌드 시 필요 | 아니오 (fallback 있음) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 빌드 시 필요 | 아니오 (fallback 있음) |
| `ENCRYPTION_KEY` | 테스트 시 필요 | 아니오 (fallback 있음) |

> CI workflow는 fallback 값을 사용하므로 GitHub Secrets 미설정 시에도 빌드/테스트가 통과합니다. 단, 실제 Supabase 연동 테스트를 원하면 Secrets를 설정하세요.

## 코드 참조

| 파일 | 역할 |
|------|------|
| `vercel.json` | Vercel 빌드/배포 설정 |
| `next.config.ts` | Next.js 설정 (보안 헤더, Sentry 조건부 통합) |
| `proxy.ts` | Next.js 16 proxy (세션 관리 + 라우트 보호) |
| `src/lib/supabase/session.ts` | Supabase 세션 갱신 로직 |
| `.github/workflows/ci.yml` | CI 파이프라인 (lint, typecheck, test, build) |
