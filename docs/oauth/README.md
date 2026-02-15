# OAuth / 인증·로그인 문서

Linkmap의 **인증·로그인** 관련 개념과 설정을 정리한 문서 모음입니다.  
서비스 내에서 "인증을 한눈에 보여주고 설명"할 때도 이 폴더의 내용을 재사용할 수 있습니다.

---

## 문서 목록

| 문서 | 용도 |
|------|------|
| **[00-one-page-summary.md](00-one-page-summary.md)** | **서비스 내 표현용** — 인증 구성을 한눈에 보여주기 위한 요약(표, 한 줄 문구, 도움말 문구). UI·도움말 패널·온보딩에 활용. |
| **[01-concepts.md](01-concepts.md)** | 인증·로그인 **기본 개념** — 앱 로그인 vs 서비스 연동, OAuth/API Key 개념, 용어 정리. |
| **[02-app-login-setup.md](02-app-login-setup.md)** | **앱 로그인 설정** — Supabase Auth, Google/GitHub Provider, Redirect URL, 환경 변수, 자주 나오는 오류. |
| **[03-service-auth-setup.md](03-service-auth-setup.md)** | **서비스 연동 인증 설정** — 프로젝트별 OAuth(GitHub), API Key 방식, 환경 변수, 서비스별 요약. |

---

## 빠른 참조

- **앱 로그인** = Linkmap에 들어오기 (이메일 / Google / GitHub) → Supabase Auth.  
- **서비스 연동** = 프로젝트에서 GitHub·Vercel 등 외부 서비스 연결 → OAuth 또는 API Key.  
- **한눈에 보기**가 필요하면 → `00-one-page-summary.md`.

질문·트러블슈팅은 `docs/question/` 폴더의 Q&A 문서(예: [GitHub 로그인 연결 설정](../question/github-login-connection-setup.md))를 참고하세요.
