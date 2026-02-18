# Supabase 설정

Linkmap의 핵심 백엔드입니다. DB, 인증, RLS 정책 모두 Supabase에 의존합니다.

## 1. 프로젝트 생성

1. [supabase.com](https://supabase.com) 로그인
2. **New project** 클릭
3. 프로젝트 이름, DB 비밀번호 설정, 리전 선택 (한국 사용자: `ap-northeast-1` 또는 `ap-northeast-2`)
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
https://linkmap.vercel.app
```

### Redirect URLs

아래 URL을 모두 추가하세요:

```
http://localhost:3000/**
https://linkmap.vercel.app/**
```

> **이 설정을 빠뜨리면** OAuth 콜백에서 404 에러가 발생합니다. 자세한 내용은 [COMMON_MISTAKES.md](./COMMON_MISTAKES.md#1-supabase-url-configuration-미설정)를 참고하세요.

## 4. OAuth Provider 설정

### Google

**Authentication > Providers > Google** 에서 활성화하고 Client ID / Secret 입력. 상세 절차는 [../GOOGLE_OAUTH_SETUP.md](../GOOGLE_OAUTH_SETUP.md) 참고.

### GitHub (앱 로그인용)

**Authentication > Providers > GitHub** 에서 활성화하고 GitHub OAuth App의 Client ID / Secret 입력.

> **참고**: 여기서 설정하는 것은 **앱 로그인용** GitHub OAuth입니다. 서비스 연동(Secrets 동기화)을 위한 별도의 OAuth App은 [05-github-oauth.md](./05-github-oauth.md)를 참고하세요.

## 5. DB 마이그레이션

마이그레이션 파일은 `supabase/migrations/` 디렉토리에 있습니다 (001~026).

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

1. `001_initial_schema.sql` -- 기본 테이블 + RLS 정책
2. `002_service_taxonomy_expansion.sql` -- 서비스 분류 확장
3. `003_audit_log.sql` -- 감사 로그
4. `004_subscriptions.sql` -- Stripe 구독
5. `005_teams.sql` -- 팀 RBAC
6. `006_api_tokens.sql` -- API 토큰
7. 이후 파일 순서대로...

> 순서를 지켜 실행해야 합니다. 나중 마이그레이션이 이전 테이블에 의존합니다.

## 6. 환경변수 요약

`.env.local`에 추가:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

## 코드 참조

| 파일 | 역할 |
|------|------|
| `src/lib/supabase/client.ts` | 브라우저 클라이언트 (`createBrowserClient`) |
| `src/lib/supabase/server.ts` | 서버 클라이언트 (env 검증 포함) |
| `src/lib/supabase/admin.ts` | 서비스 롤 클라이언트 (RLS 바이패스) |
| `src/app/auth/callback/route.ts` | Supabase Auth 콜백 핸들러 |

## 검증

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
