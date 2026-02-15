# 앱 로그인 설정 (Supabase Auth)

Linkmap 앱 로그인(이메일·Google·GitHub)은 **Supabase Auth**로 동작합니다.  
이 문서는 관리자/개발자가 Supabase와 외부 Provider를 어떻게 설정하는지 정리한 것입니다.

---

## 1. 전체 흐름 요약

1. 사용자가 로그인/회원가입 페이지에서 **이메일·비밀번호** 또는 **Google / GitHub** 선택.
2. **이메일:** Supabase가 이메일·비밀번호 검증 후 세션 발급.
3. **Google / GitHub:** `signInWithOAuth` 호출 → Supabase가 해당 Provider로 리다이렉트 → 사용자 로그인 후 Supabase 콜백 URL로 code 전달 → Supabase가 토큰 교환 후 **앱 Redirect URL**로 사용자 전달 (`/auth/callback?next=...`) → 앱의 `/auth/callback`에서 `exchangeCodeForSession(code)` 호출 → 세션 생성 후 `next` 경로로 이동.

---

## 2. 필요한 환경 변수

| 변수 | 용도 | 비고 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 클라이언트·서버 모두 사용 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 익명(공개) 키 | 클라이언트에서 Auth/DB 호출 |

Provider(Google, GitHub)용 **Client ID / Client Secret**은 Supabase 대시보드에 입력하며, 앱 코드의 환경 변수에는 넣지 않습니다.

---

## 3. Supabase 대시보드 설정

### 3.1 Authentication → Providers

- **Google:** Enable Sign in with Google → Google Cloud Console에서 OAuth 클라이언트 생성 후 Client ID / Client Secret 입력.  
  - 콜백 URL: Supabase에 표시된 Callback URL을 Google OAuth에 등록.
- **GitHub:** Enable Sign in with GitHub → GitHub OAuth App에서 Client ID / Client Secret 입력.  
  - Authorization callback URL: Supabase에 표시된 Callback URL(`https://<project-ref>.supabase.co/auth/v1/callback`)을 GitHub OAuth App에 동일하게 등록.

Provider를 켜지 않으면 `Unsupported provider: provider is not enabled`(400) 오류가 발생합니다.

### 3.2 Authentication → URL Configuration → Redirect URLs

로그인 성공 후 사용자를 돌려보낼 **앱 측 URL**을 등록합니다.

- 로컬: `http://localhost:3000/auth/callback`
- 운영: `https://linkmap.vercel.app/auth/callback` (실제 도메인으로 변경)

와일드카드 지원 시: `http://localhost:3000/*`, `https://linkmap.vercel.app/*` 등.

앱에서 `redirectTo: `${origin}/auth/callback?next=...`` 를 쓰므로, 위 경로가 허용되어 있지 않으면 로그인 후 리다이렉트가 실패합니다.

---

## 4. 앱 측 동작 (참고)

- **로그인/회원가입:** `src/app/(auth)/login/page.tsx`, `signup/page.tsx`  
  - OAuth: `signInWithOAuth({ provider: 'google' | 'github', options: { redirectTo: `${origin}/auth/callback?next=${redirect}` } })`
- **콜백:** `src/app/auth/callback/route.ts`  
  - `exchangeCodeForSession(code)` 후 `next` 또는 기본 `/dashboard`로 리다이렉트.

---

## 5. 자주 나오는 오류

| 오류 | 원인 | 조치 |
|------|------|------|
| `Unsupported provider: provider is not enabled` | 해당 Provider가 Supabase에서 꺼져 있음 | Authentication → Providers에서 해당 Provider ON + Client ID/Secret 저장 |
| 로그인 후 다시 로그인 페이지로 돌아옴 | Redirect URL 미등록 또는 불일치 | URL Configuration → Redirect URLs에 `/auth/callback` 포함된 앱 URL 추가 |
| GitHub callback 오류 | GitHub OAuth App의 Authorization callback URL이 Supabase와 다름 | Supabase에 표시된 Callback URL을 GitHub에 그대로 등록 |

자세한 GitHub 로그인 설정은 [../question/github-login-connection-setup.md](../question/github-login-connection-setup.md)를 참고하세요.
