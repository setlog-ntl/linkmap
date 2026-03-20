export const content = `> **KEY:** 바이브 코딩으로 SaaS를 만들 수 있습니다. [Linkmap](https://www.linkmap.biz) 자체가 그 증거입니다 — 70+ DB 마이그레이션, 45+ API 라우트, 128개 서비스 페이지. 다만 **"AI한테 시켜서 뚝딱"은 아닙니다.**

## 결론부터: 가능합니다, 조건부로

[Linkmap](https://www.linkmap.biz) 자체가 바이브 코딩으로 시작된 프로젝트입니다.

![Linkmap 현재 규모 — 바이브 코딩으로 구축](/blog/diagrams/linkmap-saas-scale.png)

> **INFO:** [서비스 카탈로그](https://www.linkmap.biz/services)에서 128개 서비스의 환경변수 가이드를 확인하고, [원클릭 배포](https://www.linkmap.biz/my-sites)로 템플릿을 즉시 시작할 수 있습니다.

## AI가 잘하는 것 vs 못하는 것

![바이브 코딩 AI 능력 매트릭스](/blog/diagrams/ai-capability-matrix.png)

> **WARNING:** AI가 Supabase 코드를 생성해줘도, 실제 프로젝트 생성, API 키 발급, GitHub 설정은 직접 해야 합니다. **이것이 바이브 코딩의 가장 큰 병목입니다.** [Linkmap](https://www.linkmap.biz)이 이 병목을 해결합니다.

---

## 바이브 코딩 실전 팁 5가지

### 1. 작은 단위로 지시하기

\`\`\`
나쁜 예:  "전체 앱을 만들어줘"
좋은 예:  "로그인 페이지를 만들어줘, Supabase Auth 사용"
더 좋은 예: "이 파일(auth-form.tsx)처럼 회원가입 폼을 만들어줘"
\`\`\`

### 2. 서비스맵부터 그리기

> **TIP:** 코드 생성 **전에** 먼저 [Linkmap 서비스맵](https://www.linkmap.biz)으로 필요한 서비스를 정리하세요. 어떤 서비스가 필요한지, 각 서비스의 환경변수가 무엇인지 미리 파악하면 AI에게 정확한 지시를 내릴 수 있습니다.

### 3. 기존 코드를 컨텍스트로 제공

AI에게 기존 코드 패턴을 보여주면 일관된 코드를 생성합니다.

### 4. 테스트 코드 함께 요청

"이 함수의 테스트도 함께 만들어줘" — AI가 만든 코드가 의도대로 동작하는지 자동으로 확인.

### 5. Git 커밋 자주 + GitHub Secrets 자동화

AI 결과물이 마음에 들면 바로 커밋. [Linkmap의 GitHub Secrets 자동 동기화](/blog/github-secrets-automation)로 환경변수도 자동 배포.

## 바이브 코딩 추천 스택

![바이브 코딩 추천 기술 스택](/blog/diagrams/vibe-coding-tech-stack.png)

---

> **TRY:** 바이브 코딩을 시작한다면: (1) Cursor로 코드 생성 → (2) GitHub 저장소 연결 → (3) [Linkmap에서 서비스 연결](https://www.linkmap.biz/signup) → (4) Vercel에 배포. 코드는 AI가, 연결은 [Linkmap](https://www.linkmap.biz)이.

---

*환경변수 관리가 처음이라면 [환경변수 가이드](/guides/env)를, 바이브 코딩의 기본 개념은 [바이브 코딩이란 무엇인가](/blog/what-is-vibe-coding)를 참고하세요.*
`;
