# Linkmap — Google OAuth 로그인 설정 가이드 (상세)

> Supabase Auth 기반 Google 소셜 로그인을 **처음부터 끝까지** 단계별로 설정하는 가이드입니다.

---

## 목차

1. [사전 준비 — 필요한 값 정리](#1-사전-준비--필요한-값-정리)
2. [Google Cloud Console 설정 (단계별)](#2-google-cloud-console-설정-단계별)
3. [Supabase Dashboard 설정 (단계별)](#3-supabase-dashboard-설정-단계별)
4. [로컬에서 테스트](#4-로컬에서-테스트)
5. [인증 흐름 이해하기](#5-인증-흐름-이해하기)
6. [트러블슈팅](#6-트러블슈팅)
7. [프로덕션 배포 체크리스트](#7-프로덕션-배포-체크리스트)

---

## 1. 사전 준비 — 필요한 값 정리

설정 전에 아래 값들을 메모해 두면 편합니다.

### 1-1. Supabase 프로젝트 정보

1. [Supabase Dashboard](https://supabase.com/dashboard) 로그인 후 사용 중인 프로젝트 클릭
2. 좌측 **Project Settings**(톱니바퀴) 클릭
3. **General** 탭에서 확인:
   - **Reference ID**: 예) `apqydhwahkccxlltacas`  
     → 이 값을 `<project-ref>` 로 사용합니다.
   - **API URL**: `https://<project-ref>.supabase.co`  
     → Google에 등록할 **리디렉션 URI**는 여기에 `/auth/v1/callback` 을 붙인 값입니다.

**정리:**

| 항목 | 예시 (본인 값으로 교체) |
|------|-------------------------|
| Supabase Reference ID | `apqydhwahkccxlltacas` |
| Supabase Auth Callback URL | `https://apqydhwahkccxlltacas.supabase.co/auth/v1/callback` |

> ⚠️ **이 Callback URL을 Google Console에 반드시 그대로 입력해야 합니다.**  
> 끝에 슬래시(`/`)를 붙이지 마세요.

### 1-2. 앱 URL

| 환경 | URL |
|------|-----|
| 로컬 개발 | `http://localhost:3000` |
| 프로덕션 (Vercel 등) | `https://본인도메인.vercel.app` (예: `https://linkmap.vercel.app`) |

### 1-3. 코드에서 사용하는 경로 (수정 불필요)

| 경로 | 설명 |
|------|------|
| `/login`, `/signup` | Google 로그인 버튼이 있는 페이지 |
| `/auth/callback` | Google 로그인 후 Supabase가 사용자를 돌려보내는 **앱 내** 주소 |

### 1-4. 이미 구현된 코드 (참고)

아래 파일들은 이미 준비되어 있으므로 **코드 수정 없이** Google·Supabase 설정만 하면 됩니다.

| 파일 | 역할 |
|------|------|
| `src/app/(auth)/login/page.tsx` | Google 로그인 버튼 + `signInWithOAuth({ provider: 'google' })` |
| `src/app/(auth)/signup/page.tsx` | Google 회원가입 버튼 + 동일 OAuth 호출 |
| `src/app/auth/callback/route.ts` | `code` 수신 → `exchangeCodeForSession(code)` → 세션 쿠키 후 리다이렉트 |
| `src/lib/supabase/session.ts` | Proxy에서 세션 갱신 + 보호 라우트 리다이렉트 |
| `supabase/migrations/001_initial_schema.sql` | `handle_new_user()` 트리거로 `profiles` 자동 생성 |

---

## 2. Google Cloud Console 설정 (단계별)

### 2-1. 프로젝트 생성

1. 브라우저에서 [Google Cloud Console](https://console.cloud.google.com/) 접속 후 Google 계정 로그인
2. 상단 **프로젝트 선택** 드롭다운(현재 프로젝트명 옆) 클릭
3. **새 프로젝트** 클릭
4. **프로젝트 이름**에 `Linkmap` (또는 원하는 이름) 입력
5. **만들기** 클릭
6. 생성이 끝나면 상단에서 방금 만든 프로젝트가 선택돼 있는지 확인

---

### 2-2. OAuth 동의 화면 구성

1. 왼쪽 햄버거 메뉴(≡) → **API 및 서비스** → **OAuth 동의 화면**  
   (영어: **APIs & Services** → **OAuth consent screen**)
2. **User Type**에서 **외부(External)** 선택 → **만들기**
3. **OAuth 동의 화면** 1단계 — 앱 정보:
   - **앱 이름**: `Linkmap`
   - **사용자 지원 이메일**: 드롭다운에서 본인 Gmail 선택
   - **앱 로고**: (선택) 업로드 가능, 없어도 동작함
   - **앱 도메인**:
     - **애플리케이션 홈페이지**: `https://본인프로덕션도메인.vercel.app`  
       (로컬만 쓸 경우 `http://localhost:3000` 도 가능)
     - **애플리케이션 개인정보처리방침**, **서비스 약관**: (선택) URL 있으면 입력
   - **개발자 연락처 이메일**: 본인 이메일
4. **저장 후 계속** 클릭
5. **범위(Scopes)** 2단계:
   - **범위 추가 또는 삭제** 클릭
   - 필터/검색에서 아래 scope 선택 후 **업데이트**:
     - `.../auth/userinfo.email` — 이메일
     - `.../auth/userinfo.profile` — 기본 프로필(이름, 사진)
     - `openid` — OpenID Connect
   - **저장 후 계속**
6. **테스트 사용자** 3단계 (앱이 «테스트» 상태일 때만 표시):
   - **+ ADD USERS** 클릭
   - 로그인에 사용할 Gmail 주소 입력 후 **추가**
   - ⚠️ **테스트 모드에서는 여기에 추가된 계정만 로그인 가능합니다.**
7. **저장 후 계속** → **대시보드로 돌아가기**

---

### 2-3. OAuth 클라이언트 ID 만들기

1. 왼쪽 메뉴 **API 및 서비스** → **사용자 인증 정보**  
   (Credentials)
2. 상단 **+ 사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**
3. **애플리케이션 유형**: **웹 애플리케이션**
4. **이름**: `Linkmap Web Client` (원하면 다른 이름도 가능)
5. **승인된 JavaScript 원본**:
   - **+ URI 추가** 로 아래를 **한 줄씩** 추가 (끝에 슬래시 없이)
   - `http://localhost:3000`
   - `https://본인프로덕션도메인.vercel.app`
     예: `https://linkmap.vercel.app`
6. **승인된 리디렉션 URI**:
   - **+ URI 추가** 클릭
   - **반드시 아래 형식으로 입력** (Supabase에서 복사한 값 사용):
     ```
     https://<project-ref>.supabase.co/auth/v1/callback
     ```
     예: `https://apqydhwahkccxlltacas.supabase.co/auth/v1/callback`
   - ⚠️ `https` 유지, 경로 `/auth/v1/callback` 정확히, 끝에 `/` 없음
7. **만들기** 클릭
8. **OAuth 클라이언트가 생성되었습니다** 팝업에서:
   - **클라이언트 ID**: `xxxxx.apps.googleusercontent.com` 형태 → 복사해 메모장 등에 붙여넣기
   - **클라이언트 보안 비밀**: **비밀번호 표시** 후 `GOCSPX-...` 형태 → 복사해 안전한 곳에 보관  
   → 이 비밀번호는 **Supabase Dashboard**에만 입력하고, 코드나 공개 저장소에 넣지 마세요.

**여기까지 완료 후 확인:**

- [ ] OAuth 동의 화면이 «테스트» 또는 «프로덕션»으로 저장됨
- [ ] 사용자 인증 정보에 «웹 애플리케이션» 타입 클라이언트가 보임
- [ ] 리디렉션 URI가 Supabase callback URL과 **완전히 동일**함

---

## 3. Supabase Dashboard 설정 (단계별)

### 3-1. Google Provider 켜기

1. [Supabase Dashboard](https://supabase.com/dashboard) → 사용 중인 **프로젝트** 선택
2. 왼쪽 **Authentication** → **Providers**
3. 목록에서 **Google** 찾기 → 오른쪽 토글을 **ON(Enabled)** 으로
4. 입력란에 붙여넣기:
   - **Client ID (for OAuth)**: Google에서 복사한 **클라이언트 ID**
   - **Client Secret (for OAuth)**: Google에서 복사한 **클라이언트 보안 비밀**
   - 복사 시 앞뒤 공백/줄바꿈이 들어가지 않았는지 확인
5. **Save** 클릭
6. **Callback URL (for OAuth)** 이 읽기 전용으로 표시됨:
   - `https://<project-ref>.supabase.co/auth/v1/callback`
   - 이 URL이 Google Console의 «승인된 리디렉션 URI»와 **완전히 같아야** 합니다.

---

### 3-2. URL Configuration (Site URL / Redirect URLs)

1. 같은 **Authentication** 메뉴에서 **URL Configuration** 클릭
2. **Site URL**:
   - 로컬만 쓸 때: `http://localhost:3000`
   - 프로덕션 사용 시: `https://본인도메인.vercel.app`  
   (한 번에 하나만 저장 가능하므로, 배포 후에는 프로덕션 URL로 바꾸는 것이 좋습니다.)
3. **Redirect URLs**:
   - **Add URL** 로 아래를 **각각** 추가 (끝에 슬래시 없이):
     - `http://localhost:3000/auth/callback`
     - `https://본인도메인.vercel.app/auth/callback`  
   → 로그인 성공 후 Supabase가 사용자를 돌려보낼 **우리 앱** 주소입니다.
4. **Save** 클릭

**정리:**

| Supabase 설정 | 의미 |
|---------------|------|
| Site URL | 앱의 “기본” 주소 (로그인 후 돌아갈 때 사용) |
| Redirect URLs | 허용할 **앱 내** callback 주소 목록 (`/auth/callback` 포함 전체 URL) |
| Google Provider Callback | Supabase가 Google과 통신할 주소 (Supabase가 제공, Google에 등록한 그 URL과 일치해야 함) |

---

## 4. 로컬에서 테스트

### 4-1. 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000/login` 접속.

### 4-2. 로그인 플로우 확인

1. **Google로 로그인** (또는 **Google로 시작하기**) 버튼 클릭
2. Google 로그인/계정 선택 화면으로 이동하는지 확인
3. 계정 선택 후 **동의** (필요 시)
4. 다시 우리 앱으로 돌아와 **대시보드**(`/dashboard`)로 이동하는지 확인
5. 헤더에 Google 이름·프로필 사진이 보이는지 확인
6. Supabase Dashboard → **Authentication** → **Users** 에 해당 사용자가 생겼는지 확인
7. **Table Editor** → `profiles` 테이블에 같은 `id`로 행이 생겼는지 확인 (트리거로 자동 생성)

### 4-3. 실패 시 점검

- **redirect_uri_mismatch**  
  → Google Console «승인된 리디렉션 URI»와 Supabase Google Provider의 Callback URL이 **완전히 동일**한지 확인 (프로토콜, 호스트, 경로, 슬래시 유무).
- **access_denied** / 테스트 사용자만 로그인 가능  
  → OAuth 동의 화면에서 **테스트 사용자**에 사용 중인 Gmail을 추가했는지 확인.
- 로그인 후 다시 `/login`으로 돌아옴  
  → Supabase **URL Configuration** → **Redirect URLs**에  
  `http://localhost:3000/auth/callback` 이 **정확히** 들어가 있는지 확인.
- 프로필 이름/사진이 안 보임  
  → Supabase **SQL Editor**에서 `handle_new_user()` 트리거가 있는지,  
  `001_initial_schema.sql` 마이그레이션이 적용됐는지 확인.

---

## 5. 인증 흐름 이해하기

```
┌──────────┐      ┌──────────────┐      ┌──────────┐      ┌──────────┐
│  사용자   │      │  Linkmap App  │      │ Supabase │      │  Google  │
└────┬─────┘      └──────┬───────┘      └────┬─────┘      └────┬─────┘
     │ 1. Google 버튼 클릭                    │                  │
     │───────────────────→│                    │                  │
     │                    │ 2. signInWithOAuth(provider:'google') │
     │                    │───────────────────→│                  │
     │                    │                    │ 3. Google 로그인 요청
     │                    │                    │─────────────────→│
     │ 4. Google 로그인/동의 화면으로 리다이렉트                    │
     │←──────────────────────────────────────────────────────────│
     │ 5. 계정 선택 + 동의 후 Supabase callback으로 code 전달      │
     │                    │                    │←─────────────────│
     │                    │ 6. 앱 /auth/callback?code=xxx          │
     │                    │←───────────────────│                  │
     │                    │ 7. exchangeCodeForSession(code)       │
     │                    │───────────────────→│                  │
     │                    │ 8. 세션 쿠키 설정 후 /dashboard 리다이렉트
     │ 9. 로그인 완료      │                    │                  │
     │←───────────────────│                    │                  │
```

**프로필 자동 생성:** Google 로그인 시 Supabase `handle_new_user()` 트리거가  
`profiles` 테이블에 `id`, `email`, `name`, `avatar_url` 을 자동으로 넣습니다.

- 사용자가 **Google 버튼**을 누르면 앱이 `signInWithOAuth({ provider: 'google' })` 호출.
- Supabase가 사용자를 **Google**로 보냈다가, Google이 **Supabase**의  
  `https://<project-ref>.supabase.co/auth/v1/callback` 로 **code**를 전달.
- Supabase가 세션을 만들고, 사용자를 **앱의** `Redirect URLs` 중 하나(예: `https://도메인/auth/callback`)로 보냄.
- 앱의 `/auth/callback` 라우트가 `exchangeCodeForSession(code)` 로 세션을 받아 쿠키에 저장한 뒤 `/dashboard` 등으로 리다이렉트.

---

## 6. 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| `redirect_uri_mismatch` | Google 리디렉션 URI ≠ Supabase callback | Google Console «승인된 리디렉션 URI»에 `https://<project-ref>.supabase.co/auth/v1/callback` **그대로** 입력 (복사 시 공백 없이) |
| `access_denied` | OAuth 동의 화면 테스트 모드 + 해당 계정 미등록 | OAuth 동의 화면 → 테스트 사용자에 해당 Gmail 추가 |
| 로그인 후 다시 `/login` | Supabase Redirect URLs에 앱 callback 없음 | URL Configuration → Redirect URLs에 `http://localhost:3000/auth/callback` 및 프로덕션 URL 추가 |
| 프로필 이름/사진 없음 | `profiles` 자동 생성 트리거 없음 | `001_initial_schema.sql` 의 `handle_new_user()` 및 트리거 적용 여부 확인 |
| `auth_failed` (URL 파라미터) | code 교환 실패 | Supabase에서 Google Provider ON, Client ID/Secret 정확한지 확인 |
| CORS 관련 오류 | JavaScript 원본 미등록 | Google Console «승인된 JavaScript 원본»에 `http://localhost:3000` 및 프로덕션 도메인 추가 |

---

## 7. 프로덕션 배포 체크리스트

### Google Cloud Console

- [ ] OAuth 동의 화면: 필요 시 **앱 게시**(테스트 → 프로덕션)  
  → 게시 전에는 테스트 사용자만 로그인 가능
- [ ] 승인된 JavaScript 원본에 **프로덕션 도메인** 포함
- [ ] 승인된 리디렉션 URI에 **Supabase callback** (`https://<project-ref>.supabase.co/auth/v1/callback`) 포함

### Supabase

- [ ] Google Provider **Enabled**, Client ID/Secret 입력
- [ ] **Site URL** = 프로덕션 도메인 (예: `https://linkmap.vercel.app`)
- [ ] **Redirect URLs** 에 `https://본인도메인.vercel.app/auth/callback` 포함

### Vercel (또는 사용 중인 호스팅)

- [ ] 환경 변수 설정:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - (필요 시) `SUPABASE_SERVICE_ROLE_KEY`, `ENCRYPTION_KEY`

### 보안

- [ ] Google **Client Secret**은 Supabase Dashboard에만 저장 (코드/공개 env에 없음)
- [ ] `next.config.ts` 에 Google 아바타 이미지 도메인 허용:
  - `hostname: 'lh3.googleusercontent.com'`

---

## 참고 링크

- [Supabase — Login with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google — OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Supabase Dashboard](https://supabase.com/dashboard)
