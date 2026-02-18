# Vercel 배포

Linkmap은 Vercel에 배포됩니다. Next.js 16 App Router 프로젝트이므로 별도 빌드 설정 없이 연결할 수 있습니다.

## 1. 프로젝트 연결

1. [vercel.com](https://vercel.com) 로그인
2. **Add New > Project**
3. GitHub 저장소 Import
4. Framework Preset: **Next.js** (자동 감지)
5. **Deploy** 클릭

## 2. 환경변수 설정

**Settings > Environment Variables**에서 아래 변수를 모두 추가합니다.

### 필수 (Tier 1)

| 변수명 | 값 출처 |
|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 대시보드 > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 대시보드 > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 대시보드 > Settings > API |
| `ENCRYPTION_KEY` | `openssl rand -hex 32`로 생성 |

### 배포 (Tier 2)

| 변수명 | 값 출처 |
|--------|---------|
| `GITHUB_OAUTH_CLIENT_ID` | GitHub OAuth App 설정 |
| `GITHUB_OAUTH_CLIENT_SECRET` | GitHub OAuth App 설정 |

### 풀기능 (Tier 3)

| 변수명 | 값 출처 |
|--------|---------|
| `STRIPE_SECRET_KEY` | Stripe 대시보드 > API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 대시보드 > API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe 대시보드 > Webhooks |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry 대시보드 > Project Settings > DSN |
| `SENTRY_AUTH_TOKEN` | Sentry 대시보드 > Auth Tokens |
| `SENTRY_ORG` | Sentry 조직 slug |
| `SENTRY_PROJECT` | Sentry 프로젝트 slug |

> 전체 목록은 [ENV_REFERENCE.md](./ENV_REFERENCE.md)를 참고하세요.

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

## 4. 캐시 없이 재배포

새 라우트가 반영되지 않거나 빌드 문제가 있을 때:

1. Vercel 대시보드 > **Deployments** 탭
2. 최신 배포 선택 > **...** 메뉴 > **Redeploy**
3. **"Use existing Build Cache"** 체크 해제
4. **Redeploy** 클릭

또는 CLI:

```bash
vercel --force
```

## 5. 도메인 설정

커스텀 도메인 사용 시 Supabase의 URL Configuration도 함께 업데이트해야 합니다:

1. Vercel에서 커스텀 도메인 추가
2. Supabase > Authentication > URL Configuration:
   - Site URL: `https://your-domain.com`
   - Redirect URLs에 `https://your-domain.com/**` 추가
3. Google/GitHub OAuth App의 콜백 URL도 업데이트

## 코드 참조

| 파일 | 역할 |
|------|------|
| `vercel.json` | Vercel 빌드/배포 설정 |
| `next.config.ts` | Next.js 설정 (보안 헤더, Sentry 조건부 통합) |
| `.github/workflows/ci.yml` | CI 파이프라인 (lint, typecheck, test, build) |
