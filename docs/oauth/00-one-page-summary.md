# 인증 한눈에 보기 (서비스 내 표현용)

> 이 문서는 서비스 UI에서 "인증이 어떻게 구성되어 있는지" 한눈에 보여주고 설명하기 위한 요약입니다.  
> 도움말 패널, 설정 가이드, 온보딩 등에 재사용할 수 있습니다.

---

## 1. 인증이 두 가지라는 것

Linkmap에는 **서로 다른 목적**의 인증이 둘 있습니다.

| 구분 | 목적 | 사용자 경험 |
|------|------|-------------|
| **앱 로그인** | Linkmap 서비스 자체에 들어오기 | 로그인/회원가입 화면에서 이메일·Google·GitHub 중 선택 |
| **서비스 연동** | 프로젝트에서 GitHub·Vercel 등 외부 서비스와 연결 | 서비스 맵·설정에서 "계정 연결" 또는 "API 키 입력" |

같은 "GitHub"라도 **로그인용 GitHub**(Supabase가 처리)와 **프로젝트 연동용 GitHub**(레포/시크릿용 OAuth)는 설정과 흐름이 다릅니다.

---

## 2. 한 줄 요약 문구 (UI용)

- **앱 로그인:** "이메일 비밀번호, Google, GitHub 중 하나로 Linkmap에 로그인합니다."
- **서비스 연동:** "프로젝트별로 GitHub·Vercel 등 외부 서비스를 OAuth 또는 API 키로 연결합니다."

---

## 3. 앱 로그인 — 한눈에 표

| 항목 | 내용 |
|------|------|
| **제공 방식** | 이메일·비밀번호, Google OAuth, GitHub OAuth |
| **담당** | Supabase Auth |
| **콜백 URL** | `https://도메인/auth/callback` |
| **설정 위치** | Supabase 대시보드 → Authentication → Providers (Google, GitHub) |
| **환경 변수** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

---

## 4. 서비스 연동 — 한눈에 표

| 연결 방식 | 설명 | 예시 서비스 |
|-----------|------|-------------|
| **OAuth** | "연결하기" 클릭 → 외부 로그인 → 토큰 저장 | GitHub (레포·시크릿) |
| **API Key** | 사용자가 키를 직접 입력해 저장 | Vercel, Stripe, OpenAI, Supabase 등 대부분 |
| **Manual** | 앱에서 인증 없이 수동 설정만 안내 | 설정이 복잡한 서비스 |

---

## 5. 서비스별 인증 방식 요약 (UI 표시용)

| 서비스 | 로그인(앱) | 연동 방식 | 비고 |
|--------|------------|-----------|------|
| Linkmap | 이메일 / Google / GitHub | — | Supabase Auth |
| GitHub (레포 연동) | — | OAuth 또는 API Key | 서비스 맵·설정에서 "GitHub 계정 연결" |
| Vercel | — | API Key | Vercel Token 입력 |
| Stripe | — | API Key | Secret Key 등 |
| OpenAI / Anthropic | — | API Key | API 키 입력 |
| Supabase (프로젝트) | — | API Key | Project URL + Anon Key |

---

## 6. 흐름 한눈에 (문장 요약)

- **앱 로그인:**  
  사용자 → 로그인/회원가입 페이지 → 이메일 로그인 또는 Google/GitHub 클릭 → (OAuth 시) 외부 로그인 → `/auth/callback` → 대시보드.

- **서비스 연동(OAuth):**  
  사용자(이미 로그인) → 프로젝트 → 서비스 맵 또는 설정 → "GitHub 로그인으로 연결" → GitHub 인증 → `/api/oauth/github/callback` → 계정이 프로젝트에 연결됨.

- **서비스 연동(API Key):**  
  사용자(이미 로그인) → 프로젝트 → 서비스 맵 또는 설정 → "API Key 입력" → 키 입력 후 저장 → 암호화되어 저장·검증.

---

## 7. 자주 쓰는 도움말 문구 (툴팁·설명용)

- "Linkmap 로그인은 Supabase가 담당합니다. Google/GitHub이 안 되면 Supabase 대시보드에서 해당 Provider를 켜고 Redirect URL을 등록하세요."
- "프로젝트의 GitHub 연동은 '앱 로그인용 GitHub'과 별도입니다. 서비스 맵에서 GitHub 노드를 선택한 뒤 'GitHub 로그인으로 연결'을 사용하세요."
- "OAuth는 버튼 한 번으로 권한 허용 후 토큰이 저장되고, API Key는 직접 복사해 붙여넣는 방식입니다."

이 요약을 바탕으로 서비스 내 "인증 개요" 화면이나 도움말 섹션을 구성할 수 있습니다. 상세 설정은 `01-concepts.md`, `02-app-login-setup.md`, `03-service-auth-setup.md`를 참고하세요.
