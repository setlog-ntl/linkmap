# 인증·로그인 기본 개념

## 1. 두 가지 인증 레이어

Linkmap에서 "인증"은 목적에 따라 두 가지로 나뉩니다.

### 1.1 앱 로그인 (Who uses Linkmap)

- **목적:** "이 사용자가 Linkmap에 들어올 수 있는지" 확인.
- **담당:** Supabase Auth.
- **방식:** 이메일·비밀번호, Google OAuth, GitHub OAuth.
- **결과:** 세션(쿠키/토큰)이 발급되고, 보호된 페이지(대시보드, 프로젝트 등)에 접근 가능해짐.
- **설정:** Supabase 대시보드에서 Provider(Google, GitHub) 활성화 및 Redirect URL 등록.

### 1.2 서비스 연동 (Which external services are linked to a project)

- **목적:** "이 프로젝트에서 GitHub/Vercel 등 외부 서비스를 어떤 계정으로 쓸지" 연결.
- **담당:** 앱 자체 API (`/api/oauth/*`, `/api/service-accounts` 등) + DB(`service_accounts`, `oauth_states`).
- **방식:** OAuth(버튼 클릭 후 외부 로그인) 또는 API Key(사용자가 키 직접 입력).
- **결과:** 프로젝트별로 연결된 계정이 저장되고, 레포 목록·시크릿 동기화·배포 등에 사용됨.
- **설정:** 서비스마다 다름. GitHub는 OAuth용 Client ID/Secret 환경 변수, 나머지는 대부분 API Key 입력만.

**중요:** 앱 로그인용 "GitHub"와, 프로젝트 연동용 "GitHub 계정 연결"은 서로 다른 OAuth 앱·설정을 쓸 수 있습니다. (앱 로그인은 Supabase가 콜백을 받고, 연동은 우리 서버가 `/api/oauth/github/callback`을 받음.)

---

## 2. OAuth란 (간단 개념)

- 사용자가 "GitHub로 로그인" 또는 "GitHub 계정 연결"을 누르면, 우리가 **권한 요청 URL**로 사용자를 GitHub로 보냄.
- 사용자가 GitHub에서 "허용"하면 GitHub가 **code**를 우리 **콜백 URL**로 돌려줌.
- 우리 서버가 그 code와 **client_secret**으로 **access_token**을 교환해 저장.
- 이후 API 호출 시 이 access_token을 사용.

앱 로그인의 경우 "우리 서버" 역할을 Supabase가 하므로, 콜백 URL은 Supabase 주소(`https://<ref>.supabase.co/auth/v1/callback`)입니다.  
서비스 연동의 경우 우리 앱이 서버이므로, 콜백 URL은 `https://도메인/api/oauth/github/callback` 형태입니다.

---

## 3. API Key 방식 (간단 개념)

- 사용자가 외부 서비스(Vercel, OpenAI 등)에서 발급한 **API Key**(또는 Token)를 앱에 입력.
- 앱은 이를 암호화해 DB에 저장하고, 해당 서비스 API 호출 시 복호화해 사용.
- OAuth처럼 "로그인 페이지로 리다이렉트"가 없고, 입력 폼 한 번으로 끝남.

---

## 4. 용어 정리

| 용어 | 의미 (Linkmap 기준) |
|------|----------------------|
| **앱 로그인** | Linkmap 서비스 접속을 위한 인증 (Supabase Auth) |
| **서비스 연동** | 프로젝트에 외부 서비스(GitHub, Vercel 등) 계정/키 연결 |
| **Provider** | 인증 제공자 (Google, GitHub, 이메일 등) |
| **OAuth** | 버튼 클릭 → 외부 사이트 로그인 → 토큰 발급·저장 흐름 |
| **콜백 URL** | OAuth 후 사용자가 돌아오는 URL (반드시 사전 등록 필요) |
| **Redirect URL** | Supabase에서 "로그인 성공 후 갈 수 있는 앱 주소" 화이트리스트 |
| **API Key / Token** | 사용자가 직접 입력하는 비밀 문자열 (서비스별로 이름 다름) |

---

## 5. 다음 문서

- **앱 로그인 설정:** [02-app-login-setup.md](02-app-login-setup.md)  
- **서비스 연동 설정:** [03-service-auth-setup.md](03-service-auth-setup.md)  
- **한눈에 요약(UI용):** [00-one-page-summary.md](00-one-page-summary.md)
