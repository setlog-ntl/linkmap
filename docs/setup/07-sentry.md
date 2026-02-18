# Sentry 에러 추적 설정

> **선택 사항입니다.** 환경변수가 설정되지 않으면 Sentry는 자동으로 비활성화됩니다. 앱 기능에는 영향이 없습니다.

## 동작 방식

`next.config.ts`에서 Sentry 관련 환경변수 존재 여부를 확인합니다:

```typescript
const hasSentry = !!(
  process.env.SENTRY_AUTH_TOKEN &&
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT
);

export default hasSentry
  ? withSentryConfig(nextConfig, { ... })
  : nextConfig;
```

환경변수가 없으면 `withSentryConfig` 래핑을 건너뛰므로 빌드와 런타임 모두 Sentry 없이 정상 동작합니다.

## 1. Sentry 프로젝트 생성

1. [sentry.io](https://sentry.io) 로그인
2. **Projects > Create Project**
3. Platform: **Next.js**
4. 프로젝트 이름 지정

## 2. 환경변수

| 변수명 | 값 출처 | 용도 |
|--------|---------|------|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry > Project Settings > Client Keys (DSN) | 에러 전송 엔드포인트 |
| `SENTRY_AUTH_TOKEN` | Sentry > Settings > Auth Tokens | 소스맵 업로드 |
| `SENTRY_ORG` | Sentry 조직 slug (URL에서 확인) | 조직 식별 |
| `SENTRY_PROJECT` | Sentry 프로젝트 slug | 프로젝트 식별 |

`.env.local`에 추가 (선택):

```bash
# -- Tier 3: Sentry (선택 — 없으면 자동 비활성화)
# NEXT_PUBLIC_SENTRY_DSN=https://xxx@o123.ingest.sentry.io/456
# SENTRY_AUTH_TOKEN=sntrys_...
# SENTRY_ORG=your-org
# SENTRY_PROJECT=linkmap
```

## 3. 설정 상세

### 서버 사이드

`sentry.server.config.ts`:

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  environment: process.env.NODE_ENV,
});
```

- `enabled`: DSN이 있을 때만 활성화
- `tracesSampleRate`: 프로덕션에서는 10% 샘플링 (비용 절감)

### 빌드 타임

`next.config.ts`에서 `withSentryConfig`로 래핑 시 빌드 과정에서 소스맵이 Sentry에 업로드됩니다. 이를 위해 `SENTRY_AUTH_TOKEN`이 필요합니다.

## 코드 참조

| 파일 | 역할 |
|------|------|
| `next.config.ts` | Sentry 조건부 통합 (`hasSentry` 플래그) |
| `sentry.server.config.ts` | Sentry 서버 초기화 |
| `src/instrumentation.ts` | Next.js instrumentation (에러 추적 연동) |
