# 서비스 연동 인증 설정 (OAuth / API Key)

프로젝트에서 **외부 서비스(GitHub, Vercel, Stripe 등)**를 연결할 때 쓰는 인증 방식과 설정을 정리합니다.  
(앱 로그인과는 별개입니다.)

---

## 1. 연동 방식 종류

| 방식 | 설명 | 설정 담당 | 예시 |
|------|------|------------|------|
| **OAuth** | "연결하기" 클릭 → 외부 로그인 → 앱이 토큰 저장 | 서버 환경 변수 + 외부 OAuth 앱 | GitHub (레포·시크릿) |
| **API Key** | 사용자가 키/토큰을 입력해 저장 | 사용자가 해당 서비스에서 발급한 키 입력 | Vercel, Stripe, OpenAI, Supabase 등 |
| **Manual** | OAuth/API Key 없이 수동 설정 안내만 | 없음 | 특정 서비스 |

---

## 2. OAuth 연동 (현재: GitHub)

프로젝트 내 "GitHub 계정 연결"은 **우리 서버**가 OAuth 흐름을 처리합니다.  
Supabase 앱 로그인용 GitHub와 **다른 OAuth 앱**을 쓸 수 있습니다.

### 2.1 흐름

1. 사용자(이미 Linkmap 로그인)가 프로젝트 → 서비스 맵 또는 설정에서 "GitHub 로그인으로 연결" 클릭.
2. `GET /api/oauth/github/authorize?project_id=...&service_slug=...` 호출 → `oauth_states`에 state 저장 후 GitHub 권한 URL로 리다이렉트.
3. 사용자가 GitHub에서 허용 → GitHub가 `GET /api/oauth/github/callback?code=...&state=...` 호출.
4. 서버가 state 검증, code로 access_token 교환, 사용자 정보 조회 후 `service_accounts`에 암호화해 저장.

### 2.2 필요한 환경 변수

| 변수 | 용도 |
|------|------|
| `GITHUB_OAUTH_CLIENT_ID` | GitHub OAuth App의 Client ID |
| `GITHUB_OAUTH_CLIENT_SECRET` | GitHub OAuth App의 Client Secret |

### 2.3 GitHub OAuth App 설정 (서비스 연동용)

- **Authorization callback URL:** `https://도메인/api/oauth/github/callback` (로컬: `http://localhost:3000/api/oauth/github/callback`).
- 앱 로그인용 GitHub OAuth App과 구분하려면 별도 OAuth App을 만드는 것이 좋습니다.

### 2.4 관련 코드

- `src/app/api/oauth/[provider]/authorize/route.ts` — 권한 URL 생성, state 저장, 리다이렉트.
- `src/app/api/oauth/[provider]/callback/route.ts` — code 교환, 토큰·메타데이터 저장.
- `src/data/service-connections.ts` — `github-actions`의 `oauth_config`, scopes 등.

---

## 3. API Key 연동

대부분의 서비스(Vercel, Stripe, OpenAI, Anthropic, Supabase 등)는 **API Key(또는 Token)** 방식입니다.

- 사용자가 해당 서비스 대시보드에서 키를 발급받고, Linkmap의 "API Key 입력" 폼에 붙여넣음.
- 앱이 키를 암호화해 `service_accounts` 등에 저장하고, 필요 시 복호화해 해당 서비스 API 호출.
- **환경 변수로 미리 넣는 값이 아니라**, 사용자별·프로젝트별로 입력받는 값입니다. (관리자용 시크릿이 필요한 경우는 서비스마다 다름.)

각 서비스별 필드명·도움말 URL은 `src/data/service-connections.ts`의 `api_key_fields`에 정의되어 있습니다.

---

## 4. 서비스별 설정 요약 (코드 기준)

| 서비스(slug) | 연동 방식 | 비고 |
|--------------|-----------|------|
| github-actions | OAuth, API Key | OAuth: GITHUB_OAUTH_CLIENT_ID/SECRET 필요. API Key: Personal Access Token |
| vercel | API Key | Vercel Token |
| supabase, stripe, openai, anthropic, resend 등 | API Key | 각각 대시보드에서 발급한 키 |
| (기타) | manual | 연결 설정 없음, 수동 안내만 |

---

## 5. 한눈에 보기 문서

서비스 내에 "인증이 어떻게 구성되어 있는지" 한눈에 보여주려면 [00-one-page-summary.md](00-one-page-summary.md)를 사용하세요.
