export const content = `> **KEY:** 바이브 코딩 프로젝트는 평균 7개의 외부 서비스를 연결합니다. [Linkmap 서비스맵](https://www.linkmap.biz)은 이 연결을 **지도처럼 시각화**해서 "어떤 서비스가, 어떤 환경변수로, 어떻게 연결되어 있는지" 한눈에 보여줍니다.

## 서비스맵이 왜 필요한가

![서비스맵으로 외부 서비스 연결 시각화](/blog/diagrams/service-map-example.png)

[바이브 코딩으로 프로젝트를 만들면](/blog/what-is-vibe-coding), 보통 5~10개의 외부 서비스를 연결합니다:

![내 프로젝트의 외부 서비스 연결](/blog/diagrams/service-connection-tree.png)

> **INFO:** 이 서비스들이 어떻게 연결되어 있는지, 어떤 환경변수가 필요한지, 비용은 얼마인지 — **한눈에 보이지 않습니다.** [Linkmap](https://www.linkmap.biz)은 이 문제를 해결합니다.

## 3분 만에 서비스맵 만들기

### Step 1. 프로젝트 생성 (30초)

1. [Linkmap](https://www.linkmap.biz)에 로그인 (Google/GitHub 소셜 로그인)
2. 대시보드에서 **"새 프로젝트"** 클릭
3. 프로젝트 이름 입력 (예: "my-saas")

### Step 2. 서비스 연결 (1분 30초)

1. 프로젝트 상세 페이지에서 **"서비스 추가"** 클릭
2. [서비스 카탈로그](https://www.linkmap.biz/services)에서 사용 중인 서비스 선택
3. 각 서비스의 환경변수 입력 (AES-256-GCM으로 자동 암호화)

> **TIP:** Linkmap이 각 서비스에 필요한 환경변수를 **자동으로 안내**합니다. 예를 들어 Supabase를 선택하면 \`SUPABASE_URL\`, \`SUPABASE_ANON_KEY\`, \`SUPABASE_SERVICE_ROLE_KEY\` 등 필요한 변수 목록이 바로 표시됩니다. 128개 서비스 모두 동일합니다.

### Step 3. 서비스맵 확인 (1분)

1. **"서비스맵"** 탭 클릭
2. 프로젝트에 연결된 모든 서비스가 시각적으로 표시됩니다
3. 각 노드를 클릭하면 환경변수, 연결 상태, 비용 정보를 확인할 수 있습니다

---

## 서비스맵에서 할 수 있는 것

| 기능 | 설명 |
|------|------|
| **연결 상태 확인** | 각 서비스의 API 키가 유효한지, 환경변수가 누락되지 않았는지 |
| **환경변수 암호화 저장** | AES-256-GCM으로 모든 시크릿을 안전하게 보호 |
| **GitHub Secrets 동기화** | 환경변수를 GitHub 저장소에 자동 배포 |
| **비용 추적** | 각 서비스의 예상 비용을 한눈에 파악 |
| **팀 공유** | 팀원 초대 후 서비스맵 공동 관리 |

## 서비스 카탈로그 주요 서비스

[서비스 카탈로그](https://www.linkmap.biz/services)에서는 128개 서비스의 상세 정보를 제공합니다:

| 카테고리 | 주요 서비스 |
|---------|-----------|
| DB + 인증 | Supabase, Firebase |
| 배포 | Vercel, Cloudflare, Netlify |
| AI | OpenAI, Anthropic |
| 결제 | Stripe, Toss Payments |
| 이메일 | Resend, SendGrid |
| 모니터링 | PostHog, Sentry |

## 이런 분에게 추천합니다

- [바이브 코딩](/blog/what-is-vibe-coding)으로 프로젝트를 시작한 분
- 외부 서비스가 5개 이상인 프로젝트를 관리하는 분
- [.env 파일 관리가 혼란스러운](/blog/why-dotenv-is-dangerous) 분
- 팀원에게 프로젝트 아키텍처를 설명해야 하는 분

> **TRY:** [Linkmap 무료 플랜](https://www.linkmap.biz/signup)으로 시작하세요. 프로젝트 3개, 환경변수 50개까지 무료입니다.

---

*환경변수 개념이 처음이라면 [환경변수 완전 정복 가이드](/guides/env)를, GitHub Secrets 자동화가 궁금하다면 [GitHub Secrets 자동화](/blog/github-secrets-automation)를 참고하세요.*
`;
