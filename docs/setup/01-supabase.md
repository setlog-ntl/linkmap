# Supabase 설정

Linkmap의 핵심 백엔드입니다. DB, 인증, RLS 정책 모두 Supabase에 의존합니다.

## 1. 프로젝트 생성

1. [supabase.com](https://supabase.com) 로그인
2. **New project** 클릭
3. 프로젝트 이름, DB 비밀번호 설정, 리전 선택 (한국 사용자 권장: `ap-northeast-2`)
4. 프로젝트 생성 완료 대기 (~2분)

## 2. API 키 확인

**Settings > API** 메뉴에서:

| 키 | 환경변수 | 용도 |
|----|----------|------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | API 엔드포인트 |
| anon (public) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 클라이언트 측 요청 (RLS 적용) |
| service_role (secret) | `SUPABASE_SERVICE_ROLE_KEY` | 서버 측 관리 작업 (RLS 바이패스) |

> **주의**: `service_role` 키는 절대 `NEXT_PUBLIC_` 접두사를 붙이지 마세요. 클라이언트에 노출되면 RLS를 우회할 수 있습니다.

## 3. URL Configuration (중요)

OAuth 로그인이 작동하려면 반드시 설정해야 합니다.

**Authentication > URL Configuration** 메뉴에서:

### Site URL

```
# 로컬 개발
http://localhost:3000

# 프로덕션
https://www.linkmap.biz
```

### Redirect URLs

아래 URL을 모두 추가하세요:

```
http://localhost:3000/**
https://www.linkmap.biz/**
```

> **이 설정을 빠뜨리면** OAuth 콜백에서 404 에러가 발생합니다. 자세한 내용은 [COMMON_MISTAKES.md](./COMMON_MISTAKES.md#1-supabase-url-configuration-미설정)를 참고하세요.

## 4. OAuth Provider 설정

### Google

**Authentication > Providers > Google** 에서 활성화하고 Client ID / Secret 입력. 상세 절차는 [../GOOGLE_OAUTH_SETUP.md](../GOOGLE_OAUTH_SETUP.md) 참고.

### GitHub (앱 로그인용)

**Authentication > Providers > GitHub** 에서 활성화하고 GitHub OAuth App의 Client ID / Secret 입력.

> **참고**: 여기서 설정하는 것은 **앱 로그인용** GitHub OAuth입니다. 서비스 연동(Secrets 동기화)을 위한 별도의 OAuth App은 [05-github-oauth.md](./05-github-oauth.md)를 참고하세요.

## 5. DB 마이그레이션

마이그레이션 파일은 `supabase/migrations/` 디렉토리에 있습니다 (001~081).

### Supabase CLI 사용 시

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref <your-project-ref>

# 마이그레이션 실행
supabase db push
```

### SQL Editor 사용 시

Supabase 대시보드 > **SQL Editor**에서 마이그레이션 파일을 순서대로 실행합니다:

1. `001_initial_schema.sql` — 기본 테이블 + RLS 정책
2. `002_service_taxonomy_expansion.sql` — 서비스 분류 확장
3. `003_audit_log.sql` — 감사 로그
4. `004_subscriptions.sql` — Stripe 구독
5. `005_teams.sql` — 팀 RBAC
6. `006_api_tokens.sql` — API 토큰
7. `007_user_connections.sql` — 사용자 연결선
8. `008_health_checks.sql` — 서비스 헬스체크
9. `009_rls_security_fixes.sql` — RLS 보안 패치
10. 이후 파일 순서대로 081번까지...

> 순서를 지켜 실행해야 합니다. 나중 마이그레이션이 이전 테이블에 의존합니다.

### 마이그레이션 번호 주의사항

- 042, 043 번호 중복 파일 존재 (기존 파일 수정 불가 — 신규 파일로 ALTER)
- 072 번호 중복 파일 존재 (`072_showcase_column.sql`, `072_deploy_error_logs.sql`)
- 현재 최신: `081_showcase_social.sql`

## 6. Supabase 클라이언트 3종

```
src/lib/supabase/
  client.ts   — 브라우저 클라이언트 (createBrowserClient, 'use client' 컴포넌트용)
  server.ts   — 서버 클라이언트 (createServerClient, 쿠키 기반 세션, App Router용)
  admin.ts    — 관리자 클라이언트 (createClient + service_role, 감사 로그 전용)
  session.ts  — 미들웨어용 세션 갱신 (updateSession)
```

| 클라이언트 | 파일 | 사용 위치 | 키 |
|-----------|------|-----------|-----|
| Browser | `client.ts` | `'use client'` 컴포넌트 | anon key |
| Server | `server.ts` | Server Components, API Routes | anon key + 쿠키 |
| Admin | `admin.ts` | 감사 로그 전용 | service_role key |

> **규칙**: `createAdminClient()`는 `logAudit()` 함수(`src/lib/audit.ts`) 내부에서만 사용합니다. 일반 CRUD에 Admin 클라이언트 사용 금지.

### 서버에서 사용자 확인 시 주의사항

```typescript
// 위험 — 클라이언트 JWT를 서버에서 검증 안 함
const { data: { session } } = await supabase.auth.getSession()

// 올바른 방법 — 서버에서 JWT 검증 수행
const { data: { user } } = await supabase.auth.getUser()
if (!user) return new Response('Unauthorized', { status: 401 })
```

## 7. 환경변수 요약

`.env.local`에 추가:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

## 8. RLS 필수 규칙

- 모든 새 테이블 생성 시 즉시 `ENABLE ROW LEVEL SECURITY` 적용
- 정책 없는 테이블은 아무도 접근 불가 (deny-all 기본)
- `auth.uid()` 기반 정책이 기본 패턴

```sql
-- 신규 테이블 생성 시 패턴
CREATE TABLE my_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 데이터만" ON my_table
  FOR ALL USING (auth.uid() = user_id);
```

## 9. 코드 참조

| 파일 | 역할 |
|------|------|
| `src/lib/supabase/client.ts` | 브라우저 클라이언트 (`createBrowserClient`) |
| `src/lib/supabase/server.ts` | 서버 클라이언트 (`createServerClient`, 쿠키 기반) |
| `src/lib/supabase/admin.ts` | 서비스 롤 클라이언트 (RLS 바이패스, 감사 로그 전용) |
| `src/lib/supabase/session.ts` | 미들웨어 세션 갱신 (`updateSession`) |
| `src/app/auth/callback/route.ts` | Supabase Auth OAuth 콜백 핸들러 |
| `src/lib/audit.ts` | 감사 로그 (`logAudit`) — Admin 클라이언트 사용처 |

## 10. 검증

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 http://localhost:3000 접근
# 로그인 페이지가 표시되면 Supabase 연결 성공
```

환경변수가 누락된 경우 서버 시작 시 아래 에러가 출력됩니다:

```
Error: Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set
```

## 11. 패키지 버전 (2026-03-15 기준)

| 패키지 | 버전 |
|--------|------|
| `@supabase/supabase-js` | `^2.95.3` |
| `@supabase/ssr` | `^0.8.0` |
