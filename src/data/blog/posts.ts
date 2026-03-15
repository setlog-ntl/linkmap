import type { LucideIcon } from 'lucide-react';
import { Sparkles, Shield, GitBranch, LayoutDashboard, Scale } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BlogCategory = 'vibe-coding' | 'env-management' | 'comparison' | 'tutorial' | 'insight';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: string;        // ISO date (YYYY-MM-DD)
  updatedAt?: string;
  readingTime: string;
  /** react-markdown으로 렌더링할 본문 (Markdown) */
  content: string;
  /** Velog 등 외부 교차 게시 URL (canonical 용도) */
  crossPostUrl?: string;
  /** 관련 가이드 slug (교차 링크용) */
  relatedGuides?: string[];
  /** OG 이미지 경로 (없으면 기본 사용) */
  ogImage?: string;
}

export const BLOG_CATEGORIES: Record<BlogCategory, { label: string; icon: LucideIcon; description: string }> = {
  'vibe-coding': {
    label: '바이브 코딩',
    icon: Sparkles,
    description: 'AI 시대의 새로운 개발 방식',
  },
  'env-management': {
    label: '환경변수 관리',
    icon: Shield,
    description: 'API 키와 시크릿을 안전하게',
  },
  comparison: {
    label: '비교 분석',
    icon: Scale,
    description: '도구와 서비스 객관적 비교',
  },
  tutorial: {
    label: '튜토리얼',
    icon: GitBranch,
    description: '단계별 실전 가이드',
  },
  insight: {
    label: '인사이트',
    icon: LayoutDashboard,
    description: '개발 생태계 관찰과 의견',
  },
};

const categoryOrder: BlogCategory[] = ['vibe-coding', 'env-management', 'comparison', 'tutorial', 'insight'];

// ---------------------------------------------------------------------------
// Posts (newest first)
// ---------------------------------------------------------------------------

export const BLOG_POSTS: BlogPost[] = [
  // ======================================================================
  // 1. 바이브 코딩이란 무엇인가
  // ======================================================================
  {
    slug: 'what-is-vibe-coding',
    title: '바이브 코딩이란 무엇인가 — AI 시대의 새로운 개발 방식',
    description: '코딩 경험 없이 AI에게 자연어로 지시하여 소프트웨어를 만드는 바이브 코딩의 개념, 가능성, 그리고 실전 워크플로를 정리합니다.',
    category: 'vibe-coding',
    tags: ['바이브 코딩', 'AI 코딩', 'Cursor', 'Claude', '노코드'],
    publishedAt: '2025-04-07',
    readingTime: '8분',
    relatedGuides: ['env', 'github'],
    content: `> **KEY:** 바이브 코딩(Vibe Coding)은 AI에게 자연어로 코드를 생성시키는 새로운 개발 방식입니다. 코딩 경험 없이도 실제 서비스를 만들 수 있지만, **서비스 연결과 환경변수 설정**이라는 새로운 과제가 생깁니다.

## 바이브 코딩이란?

**바이브 코딩(Vibe Coding)** 은 AI에게 자연어로 코드를 생성시키는 새로운 개발 방식입니다. 2025년 Andrej Karpathy가 처음 사용한 이 용어는, 개발자가 코드를 한 줄씩 작성하는 대신 AI와 대화하며 소프트웨어를 만드는 패러다임을 의미합니다.

> "코딩의 새로운 방식이 있다. 나는 이것을 '바이브 코딩'이라 부른다. 완전히 분위기에 몸을 맡기고, 지수적 성장을 받아들이고, 코드가 작동하는지도 잊어버리는 것." — Andrej Karpathy

## 바이브 코딩 vs 노코드 — 핵심 차이

흔히 혼동하지만, 바이브 코딩과 노코드는 **근본적으로** 다릅니다.

| 구분 | 노코드 (Bubble, Webflow) | 바이브 코딩 (Cursor, Claude) |
|------|------------------------|---------------------------|
| 출력물 | 플랫폼 종속 앱 | **실제 코드 (GitHub 저장소)** |
| 소유권 | 플랫폼 의존 | **코드 완전 소유** |
| 확장성 | 플랫폼 한계 | 코드로 가능한 모든 것 |
| 배포 | 플랫폼 내 | Vercel, Cloudflare 등 자유 선택 |
| 비용 구조 | 월 구독료 | 인프라 비용만 (대부분 무료 티어) |

> **TIP:** 바이브 코딩의 결과물은 **진짜 코드**입니다. Next.js, React, Python 등 실제 프레임워크로 작성되어 GitHub에 저장되고, 원하는 곳에 배포됩니다.

## 바이브 코딩의 실전 워크플로

바이브 코딩은 3단계로 진행됩니다. 하지만 마지막 단계에서 대부분 막힙니다.

### 1단계: AI에게 설명

\`\`\`
"회원가입, 로그인, 대시보드가 있는 SaaS를 만들어줘.
Supabase로 인증하고, Vercel에 배포할 거야."
\`\`\`

### 2단계: AI가 코드 생성

[Cursor](https://cursor.com)나 Claude가 프로젝트 구조, 컴포넌트, API 라우트를 한번에 생성합니다.

### 3단계: 서비스 연결 — 여기서 막힌다

> **WARNING:** AI가 코드를 만들어줬지만, 이런 질문이 남습니다: Supabase 프로젝트는 어떻게 만들지? API 키는 어디서 발급받지? \`.env\` 파일에 뭘 넣어야 하지? GitHub Secrets는 어떻게 설정하지?

**이것이 바로 Linkmap이 해결하는 문제입니다.**

\`\`\`
바이브 코딩 워크플로:

  AI 에디터 (Cursor/Claude)     Linkmap
  ┌─────────────────────┐     ┌──────────────────────┐
  │  코드 생성           │     │  서비스 연결 관리      │
  │  컴포넌트 작성        │ ──→ │  환경변수 암호화 저장   │
  │  API 라우트          │     │  GitHub Secrets 동기화  │
  │  테스트 코드          │     │  서비스맵 시각화       │
  └─────────────────────┘     └──────────────────────┘
        코드 영역                  인프라 영역
\`\`\`

## 바이브 코딩의 진짜 과제: 서비스 연결

AI가 코드를 잘 만들어줄수록, 남는 과제는 **코드 밖의 설정**입니다:

- **환경변수 관리** — Supabase URL, OpenAI API 키, Stripe 시크릿 키 등 수십 개
- **서비스 연결** — 인증, DB, 결제, 이메일, 모니터링 등 평균 5~10개 외부 서비스
- **보안** — API 키 유출 방지, 환경별 분리, 팀 공유

> **INFO:** 평균적인 바이브 코딩 프로젝트는 **7개의 외부 서비스**를 연결합니다. 각 서비스마다 2~5개의 환경변수가 필요하므로, 총 15~35개의 환경변수를 관리해야 합니다.

### Linkmap의 접근

[Linkmap](/services)은 바이브 코더를 위한 인프라 두뇌입니다:

| 기능 | 설명 |
|------|------|
| **서비스맵 시각화** | 프로젝트에 연결된 모든 서비스를 지도처럼 봅니다 |
| **90+ 서비스 카탈로그** | 각 서비스의 환경변수, 발급 방법, 가격을 [한곳에서 확인](/services) |
| **AES-256-GCM 암호화** | API 키를 군사 수준으로 안전하게 저장 |
| **GitHub Secrets 자동 배포** | 환경변수를 GitHub에 자동으로 동기화 |

---

## 시작하기

바이브 코딩을 시작한다면, 이 순서를 추천합니다:

| 순서 | 할 일 | 도구 |
|------|------|------|
| 1 | AI로 코드 생성 | Cursor, Claude |
| 2 | GitHub 저장소 연결 | [GitHub 시작하기 가이드](/guides/github) |
| 3 | 서비스 연결 + 환경변수 설정 | [Linkmap](https://www.linkmap.biz) |
| 4 | 배포 | [Vercel 가이드](/guides/vercel) |

> **TRY:** 코드는 AI가, 연결은 Linkmap이. [무료로 시작하기](/signup) — 프로젝트 3개, 환경변수 50개까지 무료입니다.

---

*환경변수가 처음이라면 [환경변수 완전 정복 가이드](/guides/env)를, GitHub 설정이 필요하면 [GitHub 시작하기 가이드](/guides/github)를 참고하세요. 바이브 코딩으로 실제 SaaS를 만든 이야기가 궁금하다면 [바이브 코딩으로 SaaS 만들기](/blog/vibe-coding-can-you-build-saas)도 읽어보세요.*
`,
  },
  // ======================================================================
  // 2. .env 파일은 왜 위험한가
  // ======================================================================
  {
    slug: 'why-dotenv-is-dangerous',
    title: '환경변수 관리, .env 파일은 왜 위험한가',
    description: '.env 파일의 보안 위험성과 API 키 유출 사례를 분석하고, 안전한 환경변수 관리 방법을 소개합니다.',
    category: 'env-management',
    tags: ['환경변수', '.env', 'API 키', '보안', '시크릿 관리'],
    publishedAt: '2025-04-14',
    readingTime: '7분',
    relatedGuides: ['env', 'github'],
    content: `> **KEY:** \`.env\` 파일은 편리하지만 **암호화, 접근 제어, 감사 로그, 동기화가 전혀 없습니다.** GitHub에 따르면 매년 수백만 건의 시크릿이 공개 저장소에 노출됩니다.

## .env 파일, 왜 문제인가

거의 모든 개발자가 \`.env\` 파일을 사용합니다. 간편하고, 프레임워크가 기본 지원하니까요. 하지만 \`.env\` 파일에는 심각한 보안 위험이 숨어 있습니다.

## 실제 발생하는 3가지 위험

### 1. Git에 실수로 커밋

\`.gitignore\`에 \`.env\`를 추가하는 것을 잊으면, API 키가 GitHub에 공개됩니다.

\`\`\`bash
# 이런 실수가 매일 일어납니다
git add .
git commit -m "initial commit"
# .env 파일이 포함되어 있다면? → API 키 전세계 공개
\`\`\`

> **WARNING:** 한 번 커밋하면 git 히스토리에서 완전히 제거하기가 매우 어렵습니다. **force push**로 히스토리를 다시 쓰더라도, 이미 fork된 저장소에는 남아 있습니다.

### 2. 팀원 간 공유 문제

\`.env\` 파일은 로컬에만 존재합니다. 새 팀원이 합류하면?

\`\`\`
[흔한 시나리오]

팀장: "내 .env 파일 카톡으로 보낼게"
     ↓
카카오톡 채팅방에 API 키가 평문으로 남음
     ↓
퇴사자가 여전히 채팅방에 있음
     ↓
API 키 유출
\`\`\`

### 3. 환경별 관리 혼란

\`\`\`
프로젝트 루트/
  .env.local          ← 개발용 (내 PC)
  .env.staging        ← 스테이징용
  .env.production     ← 프로덕션용 (진짜 결제 키!)
  .env.backup         ← 이건 뭐지...?
  .env.old            ← 이것도 뭐지...?
\`\`\`

> **INFO:** 파일이 늘어날수록 "지금 어떤 키를 쓰고 있지?", "이 키는 아직 유효한가?"가 불분명해집니다.

## .env 파일의 근본적 한계

| 기능 | .env 파일 | 전문 관리 도구 |
|------|----------|-------------|
| 암호화 | 평문 텍스트 | AES-256-GCM |
| 접근 제어 | 파일 접근 = 전체 접근 | 역할 기반 제어 |
| 감사 로그 | 누가 봤는지 모름 | 모든 접근 기록 |
| 자동 동기화 | 수동 복사 | GitHub Secrets 자동 배포 |
| 유효성 검증 | 오타도 모름 | 자동 점검 |
| 팀 공유 | 카톡/슬랙 전송 | 초대 링크 |

---

## 안전한 환경변수 관리 5가지 원칙

### 1. 암호화 저장
환경변수는 반드시 암호화해서 저장해야 합니다. Linkmap은 **AES-256-GCM**으로 모든 시크릿을 암호화합니다.

### 2. 접근 제어
누가 어떤 키에 접근할 수 있는지 제어합니다. 개발자에게는 개발 키만, 운영팀에게는 프로덕션 키만.

### 3. 감사 로그
모든 접근과 변경을 기록합니다. 문제 발생 시 "누가, 언제, 어떤 키를" 추적할 수 있어야 합니다.

### 4. 자동 동기화
로컬에서 키를 변경하면 배포 환경(GitHub Secrets, Vercel 등)에 자동으로 반영되어야 합니다.

### 5. 유효성 자동 점검
누락된 변수, 형식 오류, 만료된 키를 자동으로 감지합니다.

> **TIP:** 이 5가지를 모두 만족하는 도구를 쓰면 \`.env\` 파일 관련 사고를 **99% 예방**할 수 있습니다. [Linkmap의 환경변수 관리 기능](/services)을 확인해보세요.

## .env 파일 대신 무엇을 쓸까

환경변수 관리 도구 중 **서비스 간 연결을 시각화하는 유일한 플랫폼이 Linkmap**입니다. Doppler, Infisical, Vault가 키 하나하나를 관리한다면, Linkmap은 모든 서비스의 관계를 지도처럼 보여줍니다.

| 도구 | 핵심 강점 | 적합한 경우 |
|------|---------|-----------|
| **[Linkmap](https://www.linkmap.biz)** | 시각화 + 암호화 + 한글 가이드 | 바이브 코더, 인디 개발자 |
| Doppler | 엔터프라이즈 워크플로 | 대기업 DevOps 팀 |
| Infisical | 오픈소스 + 셀프호스팅 | 셀프호스팅 필요 시 |
| Vault | 동적 시크릿 + PKI | 대규모 인프라 운영 |

---

## 지금 바로 할 수 있는 체크리스트

- [x] \`.gitignore\`에 \`.env*\` 패턴 포함 확인
- [ ] git 히스토리에 \`.env\` 커밋 기록 확인: \`git log --all -p -- .env\`
- [ ] 팀 채팅방에서 API 키 평문 공유 중단
- [ ] 프로덕션 키는 배포 플랫폼에서 관리
- [ ] 환경변수 관리 도구 도입 검토

> **TRY:** 환경변수 관리가 고민이라면 [Linkmap 무료 플랜](/signup)으로 시작하세요. 프로젝트 3개, 환경변수 50개까지 무료입니다.

---

*환경변수 기초가 필요하다면 [환경변수 완전 정복 가이드](/guides/env)를 참고하세요. 안전 관리 실천법은 [.env 안전 관리 5가지 방법](/blog/dotenv-safe-management-tips)에서 더 자세히 다룹니다.*
`,
  },
  // ======================================================================
  // 3. 바이브 코딩으로 SaaS 만들기
  // ======================================================================
  {
    slug: 'vibe-coding-can-you-build-saas',
    title: '바이브 코딩으로 SaaS 만들기 — 진짜 가능할까?',
    description: 'AI로 실제 서비스를 만든 경험을 공유합니다. 가능한 것과 아직 어려운 것, 그리고 실전 팁.',
    category: 'vibe-coding',
    tags: ['바이브 코딩', 'SaaS', '사이드 프로젝트', 'AI 코딩', '경험담'],
    publishedAt: '2025-04-21',
    readingTime: '10분',
    relatedGuides: ['env', 'supabase', 'vercel'],
    content: `> **KEY:** 바이브 코딩으로 SaaS를 만들 수 있습니다. Linkmap 자체가 그 증거입니다 — 70+ DB 마이그레이션, 45+ API 라우트, 128개 서비스 페이지. 다만 **"AI한테 시켜서 뚝딱"은 아닙니다.**

## 결론부터: 가능합니다, 조건부로

Linkmap 자체가 바이브 코딩으로 시작된 프로젝트입니다.

\`\`\`
Linkmap의 현재 규모 (바이브 코딩으로 구축):

  코드베이스          인프라
  ├── 70+ DB 마이그레이션   ├── Cloudflare Workers 배포
  ├── 45+ API 라우트       ├── Supabase (DB + Auth)
  ├── 128개 서비스 페이지    ├── GitHub 연동 (13 모듈)
  ├── 10개 교육 가이드      └── AES-256-GCM 암호화
  └── 102+ 테스트 케이스
\`\`\`

## AI가 잘하는 것 vs 못하는 것

| | 잘하는 것 | 못하는 것 (아직) |
|--|---------|---------------|
| **코드** | 보일러플레이트, CRUD, 패턴 재현 | 아키텍처 의사결정 |
| **디버깅** | 타입 에러, import 누락 | 비즈니스 로직 버그 |
| **보안** | 기본 패턴 적용 | **보안 검증** (API 키 노출, XSS) |
| **설정** | 코드 내 설정 | **서비스 연결** (API 키 발급, 환경변수) |

> **WARNING:** AI가 [Supabase](/services/supabase) 코드를 생성해줘도, 실제 프로젝트 생성, API 키 발급, 환경변수 설정은 직접 해야 합니다. **이것이 바이브 코딩의 가장 큰 병목입니다.**

---

## 바이브 코딩 실전 팁 5가지

### 1. 작은 단위로 지시하기

\`\`\`
나쁜 예:  "전체 앱을 만들어줘"
좋은 예:  "로그인 페이지를 만들어줘, Supabase Auth 사용"
더 좋은 예: "이 파일(auth-form.tsx)처럼 회원가입 폼을 만들어줘"
\`\`\`

### 2. 환경변수부터 세팅

> **TIP:** 코드 생성 **전에** 먼저 필요한 서비스를 정하고, API 키를 발급받고, 환경변수를 세팅하세요. [Linkmap에서 서비스맵을 먼저 그리면](/blog/service-map-tutorial), AI에게 정확한 환경변수 이름을 알려줄 수 있습니다.

### 3. 기존 코드를 컨텍스트로 제공

AI에게 기존 코드 패턴을 보여주면 일관된 코드를 생성합니다.

### 4. 테스트 코드 함께 요청

"이 함수의 테스트도 함께 만들어줘" — AI가 만든 코드가 의도대로 동작하는지 자동으로 확인.

### 5. Git 커밋 자주

AI 결과물이 마음에 들면 바로 커밋. 마음에 안 들면 바로 되돌리기.

## 바이브 코딩 추천 스택

| 용도 | 추천 | 왜? | 시작하기 |
|------|------|-----|---------|
| AI 에디터 | Cursor | AI 코드 생성 통합 | [cursor.com](https://cursor.com) |
| LLM | Claude | 추론 품질, 긴 코드 생성 | [claude.ai](https://claude.ai) |
| 프레임워크 | Next.js | AI가 가장 잘 아는 프레임워크 | [nextjs.org](https://nextjs.org) |
| DB + 인증 | Supabase | AI 코드 호환성 최고 | [Supabase 가이드](/guides/supabase) |
| 배포 | Vercel | 원클릭 배포, GitHub 연동 | [Vercel 가이드](/guides/vercel) |
| **서비스 관리** | **Linkmap** | 연결 시각화 + 환경변수 암호화 | [무료 시작](/signup) |

---

> **TRY:** 바이브 코딩을 시작한다면 이 순서를 추천합니다: (1) Cursor로 코드 생성 → (2) [GitHub 저장소 연결](/guides/github) → (3) [Linkmap에서 서비스 연결](/signup) → (4) [Vercel에 배포](/guides/vercel). 코드는 AI가, 연결은 Linkmap이.

---

*[Supabase 설정이 필요하면](/guides/supabase), [Vercel 배포가 필요하면](/guides/vercel) 가이드를 참고하세요. 바이브 코딩의 기본 개념은 [바이브 코딩이란 무엇인가](/blog/what-is-vibe-coding)에서 확인하세요.*
`,
  },
  // ======================================================================
  // 4. 서비스맵 만들기 튜토리얼
  // ======================================================================
  {
    slug: 'service-map-tutorial',
    title: 'Linkmap으로 서비스맵 만들기 — 3분 튜토리얼',
    description: '프로젝트에 연결된 모든 외부 서비스를 시각화하는 서비스맵을 3분 만에 만드는 방법을 단계별로 안내합니다.',
    category: 'tutorial',
    tags: ['서비스맵', 'Linkmap', '튜토리얼', '시각화', '프로젝트 관리'],
    publishedAt: '2025-05-05',
    readingTime: '5분',
    relatedGuides: ['env', 'supabase', 'vercel', 'github'],
    content: `> **KEY:** 바이브 코딩 프로젝트는 평균 7개의 외부 서비스를 연결합니다. 서비스맵은 이 연결을 **지도처럼 시각화**해서 "어떤 서비스가, 어떤 환경변수로, 어떻게 연결되어 있는지" 한눈에 보여줍니다.

## 서비스맵이 왜 필요한가

[바이브 코딩으로 프로젝트를 만들면](/blog/what-is-vibe-coding), 보통 5~10개의 외부 서비스를 연결합니다:

\`\`\`
내 프로젝트의 서비스 연결 (예시):

            ┌── Supabase (DB + Auth)
            ├── Vercel (배포)
  내 앱 ────├── OpenAI (AI 기능)
            ├── Stripe (결제)
            ├── Resend (이메일)
            └── PostHog (분석)

  → 환경변수 총 18개 필요
  → 각각 다른 대시보드에서 관리
  → 전체 구조가 머릿속에만 있음
\`\`\`

> **INFO:** 이 서비스들이 어떻게 연결되어 있는지, 어떤 환경변수가 필요한지, 비용은 얼마인지 — **한눈에 보이지 않습니다.** 서비스맵은 이 문제를 해결합니다.

## 3분 만에 서비스맵 만들기

### Step 1. 프로젝트 생성 (30초)

1. [Linkmap](https://www.linkmap.biz)에 로그인
2. 대시보드에서 **"새 프로젝트"** 클릭
3. 프로젝트 이름 입력 (예: "my-saas")

### Step 2. 서비스 연결 (1분 30초)

1. 프로젝트 상세 페이지에서 **"서비스 추가"** 클릭
2. [서비스 카탈로그](/services)에서 사용 중인 서비스 선택
3. 각 서비스의 환경변수 입력

> **TIP:** Linkmap이 각 서비스에 필요한 환경변수를 **자동으로 안내**합니다. 예를 들어 [Supabase](/services/supabase)를 선택하면 \`SUPABASE_URL\`, \`SUPABASE_ANON_KEY\`, \`SUPABASE_SERVICE_ROLE_KEY\` 등 필요한 변수 목록이 바로 표시됩니다.

### Step 3. 서비스맵 확인 (1분)

1. **"서비스맵"** 탭 클릭
2. 프로젝트에 연결된 모든 서비스가 시각적으로 표시됩니다
3. 각 노드를 클릭하면 환경변수, 연결 상태, 비용 정보를 확인할 수 있습니다

---

## 서비스맵에서 할 수 있는 것

| 기능 | 설명 |
|------|------|
| **연결 상태 확인** | 각 서비스의 API 키가 유효한지, 환경변수가 누락되지 않았는지 |
| **환경변수 자동 점검** | 누락, 형식 오류, 만료를 자동으로 감지 |
| **GitHub Secrets 동기화** | 환경변수를 [GitHub 저장소에 자동 배포](/blog/github-secrets-automation) |
| **비용 추적** | 각 서비스의 예상 비용을 한눈에 파악 |

## 이런 분에게 추천합니다

- [바이브 코딩](/blog/what-is-vibe-coding)으로 프로젝트를 시작한 분
- 외부 서비스가 5개 이상인 프로젝트를 관리하는 분
- [.env 파일 관리가 혼란스러운](/blog/why-dotenv-is-dangerous) 분
- 팀원에게 프로젝트 아키텍처를 설명해야 하는 분

> **TRY:** Pro 플랜에서는 팀원을 초대하여 서비스맵을 **공유**할 수 있습니다. 새 팀원이 합류하면 서비스맵을 보고 전체 아키텍처를 즉시 파악. [무료로 시작하기](/signup)

---

*환경변수 개념이 처음이라면 [환경변수 완전 정복 가이드](/guides/env)를 먼저 읽어보세요. GitHub Secrets 자동화가 궁금하다면 [GitHub Secrets 자동화](/blog/github-secrets-automation)를 참고하세요.*
`,
  },
  // ======================================================================
  // 5. .env 안전 관리 5가지 방법
  // ======================================================================
  {
    slug: 'dotenv-safe-management-tips',
    title: '.env 파일 안전하게 관리하는 5가지 방법',
    description: '개발자가 반드시 알아야 할 .env 파일 보안 실천법. .gitignore 설정부터 환경변수 암호화 도구까지.',
    category: 'env-management',
    tags: ['환경변수', '.env', '보안', 'gitignore', 'GitHub Secrets'],
    publishedAt: '2025-05-12',
    readingTime: '6분',
    relatedGuides: ['env', 'github'],
    content: `> **KEY:** 5가지 실천법 요약 — (1) .gitignore 완벽 설정, (2) 커밋 히스토리 점검, (3) 환경별 분리, (4) NEXT_PUBLIC_ 접두사 주의, (5) 전용 관리 도구 사용. 지금 바로 적용하세요.

## .env 파일, 제대로 관리하고 있나요?

\`.env\` 파일은 편리하지만, [잘못 관리하면 API 키 유출로 이어집니다](/blog/why-dotenv-is-dangerous). 이 글에서는 **지금 바로 적용할 수 있는** 5가지 실천법을 공유합니다.

## 1. .gitignore 완벽하게 설정

프로젝트 루트의 \`.gitignore\`에 아래를 반드시 포함하세요:

\`\`\`
# 환경변수 파일 전체 차단
.env
.env.*
.env.local
.env.development
.env.staging
.env.production
!.env.example
\`\`\`

> **TIP:** \`.env.example\`은 커밋해도 됩니다 — 실제 값 대신 **형식만** 기록합니다:

\`\`\`
# .env.example (커밋 OK — 값 없이 형식만)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=sk-...
\`\`\`

## 2. 이미 커밋된 시크릿 확인

과거에 실수로 \`.env\`를 커밋했을 수 있습니다:

\`\`\`bash
# git 히스토리에서 .env 파일 검색
git log --all --full-history -- .env
git log --all --full-history -- ".env*"
\`\`\`

> **WARNING:** 결과가 나온다면 해당 키는 **이미 노출된 것**입니다. 즉시 새 키로 교체하세요. git 히스토리 정리보다 **키 교체가 우선**입니다.

## 3. 환경별 분리

개발, 스테이징, 프로덕션 환경에 같은 키를 쓰면 안 됩니다:

| 환경 | 키 관리 위치 | 왜? |
|------|-----------|-----|
| 로컬 개발 | \`.env.local\` (로컬만) | 개인 개발용, 실 과금 없음 |
| 스테이징 | 배포 플랫폼 설정 | 테스트용 키, 제한된 접근 |
| 프로덕션 | 배포 플랫폼 설정 | **실제 과금**, 최소 접근 |

> **INFO:** 프로덕션 키는 \`.env\` 파일이 아니라 **배포 플랫폼([Vercel](/guides/vercel), [Cloudflare](/guides/cloudflare))의 환경변수 설정**에서 관리하세요.

---

## 4. NEXT_PUBLIC_ 접두사 주의

Next.js에서 \`NEXT_PUBLIC_\`으로 시작하는 환경변수는 **브라우저에 노출**됩니다:

\`\`\`
공개 가능 (브라우저에 노출됨):
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

절대 공개 금지 (서버에서만 사용):
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
  OPENAI_API_KEY=sk-...
  STRIPE_SECRET_KEY=sk_live_...
\`\`\`

> **WARNING:** **절대로** \`SUPABASE_SERVICE_ROLE_KEY\`, \`OPENAI_API_KEY\`, \`STRIPE_SECRET_KEY\`에 \`NEXT_PUBLIC_\` 접두사를 붙이면 안 됩니다. 브라우저 개발자 도구에서 **누구나** 볼 수 있게 됩니다.

## 5. 환경변수 관리 도구 사용

\`.env\` 파일의 근본적 한계를 해결하려면 전용 도구가 필요합니다.

| 기능 | .env 파일 | [Linkmap](https://www.linkmap.biz) |
|------|----------|---------|
| 암호화 | 평문 | AES-256-GCM |
| 자동 동기화 | 수동 복사 | [GitHub Secrets 자동 배포](/blog/github-secrets-automation) |
| 감사 로그 | 없음 | 모든 접근 기록 |
| 누락 점검 | 없음 | 자동 감지 |
| 팀 공유 | 카톡/슬랙 | 초대 링크 + 역할 제어 |
| 시각화 | 없음 | [서비스맵](/blog/service-map-tutorial) |

---

## 지금 바로 확인하세요

- [x] \`.gitignore\`에 \`.env*\` 패턴 포함
- [ ] git 히스토리에 \`.env\` 커밋 기록 없음
- [ ] 프로덕션 키는 배포 플랫폼에서 관리
- [ ] \`NEXT_PUBLIC_\`에 시크릿 키 미포함
- [ ] 환경변수 관리 도구 도입 검토

> **TRY:** 환경변수 관리를 시작하고 싶다면 [Linkmap 무료 플랜](/signup)으로 시작하세요. 프로젝트 3개, 환경변수 50개까지 무료입니다.

---

*환경변수 기초가 필요하다면 [환경변수 완전 정복 가이드](/guides/env)를 참고하세요. .env 파일의 위험성에 대해 더 알고 싶다면 [.env 파일은 왜 위험한가](/blog/why-dotenv-is-dangerous)를 읽어보세요.*
`,
  },
  // ======================================================================
  // 6. GitHub Secrets 자동화
  // ======================================================================
  {
    slug: 'github-secrets-automation',
    title: 'GitHub Secrets 자동화 — 수동 설정은 이제 그만',
    description: 'GitHub Secrets를 하나하나 수동 설정하는 대신, Linkmap으로 환경변수를 자동 배포하는 방법을 소개합니다.',
    category: 'tutorial',
    tags: ['GitHub Secrets', '환경변수', '자동화', 'CI/CD', 'GitHub Actions'],
    publishedAt: '2025-05-19',
    readingTime: '6분',
    relatedGuides: ['github', 'env'],
    content: `> **KEY:** GitHub Secrets를 수동으로 관리하면 동기화 누락, 변경 추적 불가, 확인 불가 문제가 생깁니다. Linkmap은 환경변수를 GitHub 저장소 시크릿에 **1클릭으로 자동 동기화**합니다.

## GitHub Secrets, 수동 관리의 한계

[GitHub Actions](https://github.com/features/actions)로 CI/CD를 구성하면, 환경변수를 GitHub Secrets에 등록해야 합니다.

\`\`\`
수동 관리 흐름:

  Settings → Secrets → New Secret
     ↓
  이름: SUPABASE_URL    값: https://xxx.supabase.co   [저장]
  이름: SUPABASE_KEY    값: eyJhbGci...               [저장]
  이름: OPENAI_API_KEY  값: sk-...                    [저장]
  ... (×10개 이상 반복)
     ↓
  .env 변경할 때마다 다시 수동 업데이트
     ↓
  "어? 배포가 실패했는데... 시크릿 업데이트를 깜빡했다"
\`\`\`

> **WARNING:** 프로젝트에 환경변수가 10개만 되어도, 수동 관리는 실수의 온상이 됩니다. 등록된 시크릿의 값은 **다시 확인할 수도 없습니다** (마스킹).

---

## Linkmap의 GitHub Secrets 자동 배포

Linkmap은 프로젝트의 환경변수를 GitHub 저장소 시크릿에 **자동으로 동기화**합니다.

\`\`\`
자동 동기화 흐름:

  Linkmap에서 환경변수 저장
       ↓
  AES-256-GCM으로 암호화 저장 (Linkmap DB)
       ↓
  "GitHub 동기화" 클릭
       ↓
  NaCl 암호화 → GitHub API 호출
       ↓
  Repository Secrets 자동 업데이트
       ↓
  다음 GitHub Actions 실행 시 최신 값 사용
\`\`\`

### 설정 방법 (1회, 2분)

| 단계 | 할 일 |
|------|------|
| 1 | 프로젝트 설정에서 [GitHub 저장소 연결](/guides/github) |
| 2 | GitHub OAuth로 권한 부여 |
| 3 | 동기화할 환경변수 선택 |
| 4 | **끝!** 이후 자동 동기화 |

> **TIP:** 이후 Linkmap에서 환경변수를 변경할 때마다 GitHub Secrets에 **자동 반영**됩니다. 수동 업데이트가 필요 없습니다.

## 수동 vs 자동 비교

| 항목 | 수동 (GitHub UI) | 자동 (Linkmap) |
|------|-----------------|---------------|
| 등록 시간 | 변수당 30초 | **전체 1클릭** |
| 동기화 | 수동 확인 | 자동 |
| 변경 추적 | 없음 | 감사 로그 |
| 누락 방지 | 기억에 의존 | [자동 점검](/blog/dotenv-safe-management-tips) |
| 다중 저장소 | 각각 설정 | 한곳에서 관리 |
| 값 확인 | 불가능 (마스킹) | Linkmap에서 확인 가능 |

---

## 실전 시나리오

### 시나리오 1: 새 서비스 추가

[OpenAI](/services/openai) API를 프로젝트에 추가할 때:

1. [Linkmap 서비스 카탈로그](/services)에서 OpenAI 선택
2. API 키 입력 (자동 AES-256 암호화)
3. GitHub 동기화 클릭 → \`OPENAI_API_KEY\` 시크릿 자동 등록
4. GitHub Actions에서 바로 사용 가능

### 시나리오 2: 키 로테이션

[Supabase](/services/supabase) 키를 변경할 때:

1. Linkmap에서 새 키로 업데이트
2. GitHub 동기화 → 기존 시크릿 **자동 갱신**
3. 다음 배포에서 새 키 적용

### 시나리오 3: 팀원 합류

새 팀원이 프로젝트에 참여할 때:

1. 팀원을 Linkmap 프로젝트에 초대
2. 팀원은 [서비스맵](/blog/service-map-tutorial)에서 전체 아키텍처 파악
3. GitHub 권한 설정 후 동기화 → 별도의 시크릿 공유 불필요

> **INFO:** 더 이상 카톡이나 슬랙으로 API 키를 보낼 필요가 없습니다. [왜 이런 방식이 위험한지](/blog/why-dotenv-is-dangerous) 확인해보세요.

## GitHub Actions에서 사용

\`\`\`yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
        env:
          SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: \${{ secrets.SUPABASE_ANON_KEY }}
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
\`\`\`

> **TIP:** Linkmap이 시크릿을 자동 등록하므로, 워크플로에서 \`secrets.XXX\`로 바로 참조할 수 있습니다. 새 환경변수를 추가할 때 워크플로 파일만 업데이트하면 됩니다.

---

> **TRY:** GitHub Secrets 자동화를 시작하고 싶다면 [Linkmap 무료 플랜](/signup)으로 시작하세요. [GitHub 시작하기 가이드](/guides/github)에서 초기 설정 방법을 확인할 수 있습니다.

---

*GitHub 설정이 처음이라면 [GitHub 시작하기 가이드](/guides/github)를 참고하세요. 환경변수 관리의 기본은 [환경변수 완전 정복 가이드](/guides/env)에서 배울 수 있습니다.*
`,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: BlogCategory): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category);
}

export function getPublishedPosts(): BlogPost[] {
  const today = new Date().toISOString().slice(0, 10);
  return BLOG_POSTS
    .filter((p) => p.publishedAt <= today)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogCategoryOrder(): BlogCategory[] {
  return categoryOrder;
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const post of BLOG_POSTS) {
    for (const tag of post.tags) tagSet.add(tag);
  }
  return Array.from(tagSet).sort();
}
