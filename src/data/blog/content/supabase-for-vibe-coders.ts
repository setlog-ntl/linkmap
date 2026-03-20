export const content = `> **KEY:** Supabase는 PostgreSQL 기반의 서버리스 백엔드 플랫폼입니다. 데이터베이스, 인증, 파일 저장을 한 곳에서 제공하며, AI에게 "Supabase 연동해줘"라고 지시하면 대부분의 설정 코드를 자동 생성할 수 있습니다.

## 백엔드가 뭔지, 왜 필요한지

포트폴리오 같은 정적 사이트는 HTML/CSS만으로 충분합니다. 하지만 사용자가 데이터를 입력하고, 로그인하고, 저장된 내용을 불러오려면 **백엔드**가 필요합니다. 백엔드는 데이터를 저장하는 데이터베이스와, 누가 접근할 수 있는지 관리하는 인증 시스템으로 구성됩니다.

예전에는 서버를 직접 구축해야 했지만, [Supabase](https://supabase.com)는 이 모든 것을 클라우드에서 제공합니다. Firebase의 대안으로 등장했으며, 오픈소스라는 점이 차별점입니다.

> **INFO:** Supabase 무료 플랜: 프로젝트 2개, DB 500MB, 스토리지 1GB, MAU 50,000. 사이드 프로젝트에 충분합니다.

## 프로젝트 생성부터 CRUD까지

[supabase.com](https://supabase.com)에서 계정을 만들고 "New Project"를 클릭하면 약 1분 만에 PostgreSQL 데이터베이스가 생성됩니다. 테이블은 대시보드의 Table Editor에서 클릭으로 만들 수 있습니다.

AI에게 Supabase CRUD를 요청하는 프롬프트 예시:

\`\`\`
Supabase 클라이언트로 todos 테이블의 CRUD 코드를 만들어줘.
- 조회: 현재 사용자의 할일 목록만 가져오기
- 추가: title과 is_completed 필드
- 수정: is_completed 토글
- 삭제: id 기반 삭제
- Supabase 클라이언트는 @supabase/ssr 사용
\`\`\`

> **TIP:** [Supabase 시작하기 가이드](/guides/supabase)에서 프로젝트 생성부터 키 설정까지 스크린샷과 함께 안내합니다.

## 인증(로그인) 10분 만에 추가

Supabase Auth는 Google, GitHub, 카카오 등 소셜 로그인을 지원합니다. 대시보드에서 Provider를 활성화하고 OAuth 키를 등록하면 코드 몇 줄로 로그인이 완성됩니다.

AI에게 요청하는 방법:

\`\`\`
Supabase Auth로 Google OAuth 로그인을 추가해줘.
- 로그인 버튼 클릭 시 Google 인증 페이지로 이동
- 인증 후 /dashboard로 리다이렉트
- 미인증 사용자는 /login으로 리다이렉트
\`\`\`

[인증 가이드](/guides/auth)에서 Google, 카카오 로그인 설정을 스크린샷과 함께 확인할 수 있습니다.

---

## RLS — 다른 사용자 데이터를 보호하는 방법

RLS(Row Level Security)는 Supabase의 핵심 보안 기능입니다. RLS 없이는 한 사용자가 다른 사용자의 데이터를 볼 수 있습니다.

| RLS 상태 | 결과 |
|---------|------|
| 비활성화 | 모든 사용자가 모든 데이터에 접근 가능 (위험!) |
| 활성화 + 정책 | 자신의 데이터만 접근 가능 (안전) |

> **WARNING:** [Supabase RLS와 바이브코딩의 보안 위험](/blog/supabase-rls-vibe-coding-risk)에서 실제 사고 사례를 다뤘습니다. AI가 RLS 정책을 누락하거나 \`true\`로만 설정하는 경우가 많으니 반드시 확인하세요.

## 환경변수 관리

Supabase 연결 시 \`SUPABASE_URL\`과 \`SUPABASE_ANON_KEY\` 두 개의 키가 필요합니다. 이 키들은 반드시 \`.env\` 파일에 저장하고, GitHub에 올리면 안 됩니다.

[환경변수 완전 정복 가이드](/guides/env)에서 \`.env\` 파일 관리법을 배울 수 있고, 키가 여러 개로 늘어나면 [Linkmap](https://www.linkmap.biz)으로 암호화 관리를 추천합니다. [서비스 카탈로그](https://www.linkmap.biz/services)에서 Supabase 포함 128개 서비스의 연결 방법을 확인하세요.

> **TRY:** Supabase로 첫 백엔드를 시작했다면 [Linkmap 무료 가입](https://www.linkmap.biz/signup)으로 서비스 연결을 시각화하고 API 키를 안전하게 관리해보세요.

---

*Supabase 심화 설정은 [Supabase 시작하기 가이드](/guides/supabase)를, 바이브코딩 입문은 [바이브코딩 시작 가이드](/blog/vibe-coding-getting-started-guide)를 참고하세요.*`;
