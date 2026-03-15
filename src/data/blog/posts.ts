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
  // 9. Doppler vs Infisical vs Linkmap — 환경변수 관리 도구 비교 2026
  // ======================================================================
  {
    slug: 'doppler-vs-infisical-vs-linkmap-comparison',
    title: 'Doppler vs Infisical vs Linkmap — 환경변수 관리 도구 비교 2026',
    description: '2026년 기준 주요 환경변수·시크릿 관리 도구 3종(Doppler, Infisical, Linkmap)의 기능, 가격, 사용성을 객관적으로 비교합니다. 어떤 도구가 내 팀에 맞는지 확인하세요.',
    category: 'comparison',
    tags: ['환경변수 관리 도구 비교', 'Doppler', 'Infisical', '시크릿 관리', '환경변수', 'API 키 관리'],
    publishedAt: '2026-03-15',
    readingTime: '6분',
    relatedGuides: ['env', 'github', 'deploy', 'cloudflare'],
    content: `> **KEY:** 환경변수 관리 도구(Secret Management Tool)는 API 키·시크릿을 암호화 저장하고 팀 간 안전하게 공유하는 플랫폼입니다. 2026년 주요 3종은 Doppler(엔터프라이즈 SaaS), Infisical(오픈소스), Linkmap(시각화 + 한국어 특화)으로, 팀 규모와 요구사항에 따라 선택이 달라집니다.

## 왜 .env 파일로는 부족한가

[.env 파일이 위험한 이유](/blog/why-dotenv-is-dangerous)는 간단합니다. 암호화가 없고, 팀 공유가 불편하며, 환경별 동기화가 수동입니다. 프로젝트가 커질수록 이 한계는 명확해집니다.

전용 환경변수 관리 도구는 이 문제를 해결합니다:

- 시크릿을 **암호화해서 중앙 저장**
- GitHub, Vercel, AWS 등 배포 환경에 **자동 동기화**
- 팀원 별 **접근 권한 제어**
- 변경 이력 **감사 로그**

이 글에서는 2026년 현재 가장 많이 사용되는 3가지 도구를 공정하게 비교합니다.

> **INFO:** 시크릿 관리 도구 시장에서 [Infisical](https://infisical.com)은 GitHub Star 12,700개 이상을 보유한 오픈소스 프로젝트이며, [Doppler](https://www.doppler.com)은 2022년 2,000만 달러 투자를 유치한 엔터프라이즈 SaaS입니다. Linkmap은 서비스 연결 시각화를 더한 한국어 특화 플랫폼입니다.

## 3가지 도구 한눈에 보기

### Doppler — 엔터프라이즈 SaaS

[Doppler](https://www.doppler.com)는 완전 관리형 클라우드 서비스입니다. 셀프호스팅 옵션이 없는 대신, CLI 설정이 매우 간단하고 Docker·Kubernetes 등 다양한 인프라와 연동됩니다.

**강점:** 직관적인 UI, 풍부한 서드파티 통합, 엔터프라이즈 워크플로 지원
**약점:** 셀프호스팅 불가, 사용자 수 기반 과금으로 팀이 클수록 비용 급증

### Infisical — 오픈소스 + 셀프호스팅

[Infisical](https://infisical.com)은 오픈소스(MIT 라이선스)로 셀프호스팅이 가능합니다. 동적 시크릿 생성, PKI 인증서 관리 등 고급 기능을 제공하며, 클라우드 플랜도 운영합니다.

**강점:** 셀프호스팅으로 데이터 완전 통제, 오픈소스 투명성, 고급 시크릿 로테이션
**약점:** 셀프호스팅 시 인프라 운영 부담, 클라우드 유료 플랜은 API 요청 제한 존재

### Linkmap — 시각화 + 한국어 특화

[Linkmap](https://www.linkmap.biz)은 환경변수 암호화(AES-256-GCM) + GitHub Secrets 동기화에 **서비스 연결 시각화**를 더한 플랫폼입니다. 128개 서비스 카탈로그와 한국어 가이드가 국내 개발자에게 특화되어 있습니다.

**강점:** 서비스맵 시각화, 한국어 가이드, 원클릭 배포 템플릿, 인디 개발자 친화적 무료 플랜
**약점:** 엔터프라이즈 고급 기능(동적 시크릿, PKI)은 미지원

## 기능 상세 비교

| 기능 | Doppler | Infisical | **Linkmap** |
|------|---------|-----------|-------------|
| 시크릿 암호화 | AES-256 | AES-256 | **AES-256-GCM** |
| 셀프호스팅 | 불가 | 가능 | 불가 |
| GitHub Secrets 동기화 | 지원 | 지원 | **1클릭 자동화** |
| Vercel 연동 | 지원 | 지원 | 지원 |
| 서비스 연결 시각화 | 없음 | 없음 | **서비스맵** |
| 감사 로그 | 지원 | 지원 | 지원 |
| 시크릿 로테이션 | 지원 | 지원 (고급) | 미지원 |
| PKI 인증서 관리 | 미지원 | 지원 | 미지원 |
| 서비스 카탈로그 | 없음 | 없음 | **128개 (한국어)** |
| 원클릭 배포 템플릿 | 없음 | 없음 | **지원** |
| 한국어 가이드 | 없음 | 없음 | **완비** |
| 오픈소스 | 아니오 | **예 (MIT)** | 아니오 |

> **TIP:** Doppler와 Infisical은 시크릿 관리 자체에 집중합니다. Linkmap은 "이 서비스에 어떤 환경변수가 필요한지"부터 시작해 저장·동기화·시각화까지 한 흐름으로 처리합니다. [서비스 카탈로그](https://www.linkmap.biz/services)에서 128개 서비스의 환경변수 목록을 확인하세요.

## 가격 비교

| 구분 | Doppler | Infisical | **Linkmap** |
|------|---------|-----------|-------------|
| 무료 플랜 | 3인 이하 무료 | 클라우드 무료 플랜 | **프로젝트 3개, 환경변수 50개** |
| 유료 시작가 | $21/사용자/월 | $9/사용자/월 | 준비 중 |
| 셀프호스팅 비용 | 불가 | 무료 (인프라 비용 별도) | 해당 없음 |
| 과금 방식 | 사용자 수 기반 | 사용자 수 기반 | 미정 |

> **WARNING:** Doppler는 팀이 10명이면 월 $210, 50명이면 월 $1,050입니다. Infisical 셀프호스팅은 소프트웨어 비용이 없지만 서버 운영·보안 패치를 직접 관리해야 합니다. 팀 규모와 운영 여력을 함께 고려하세요.

---

## 어떤 도구를 선택해야 할까

### Doppler가 적합한 경우

- DevOps 팀이 있는 **중대형 기업**
- Docker, Kubernetes 기반 **복잡한 인프라** 운영
- 빠른 셋업과 편리한 UI가 우선이고 **비용이 문제가 아닌** 경우

### Infisical이 적합한 경우

- 데이터를 **자체 서버에 보관**해야 하는 규정 준수 요건이 있는 경우
- **오픈소스** 투명성과 커뮤니티를 선호하는 경우
- 동적 시크릿, PKI 등 **고급 보안 기능**이 필요한 경우

### Linkmap이 적합한 경우

- **인디 개발자, 바이브 코더**, 소규모 팀
- 외부 서비스가 많아 **연결 구조를 시각화**하고 싶은 경우
- **한국어 가이드**와 한국 서비스(Toss Payments, Naver 등) 지원이 필요한 경우
- GitHub Secrets 자동화를 **간단하게** 구성하고 싶은 경우

> **TIP:** [GitHub Secrets 자동화](/blog/github-secrets-automation)가 처음이라면 Linkmap의 1클릭 동기화부터 시작하는 것이 가장 빠릅니다. [환경변수 완전 정복 가이드](/guides/env)와 함께 보면 전체 흐름을 잡을 수 있습니다.

## 마무리 — 비교 정리

세 도구 모두 AES-256 암호화와 주요 플랫폼 연동을 지원합니다. 선택 기준은 기능이 아니라 **팀의 상황**입니다.

| 상황 | 추천 |
|------|------|
| 엔터프라이즈, DevOps 팀 있음 | Doppler |
| 셀프호스팅 필수, 규정 준수 | Infisical |
| 인디 개발자, 한국어, 시각화 필요 | **Linkmap** |

비교 글에서 특정 도구가 "최고"라고 말하는 건 의미가 없습니다. 지금 팀에 없는 것이 무엇인지 확인하고, 그 부분을 채워주는 도구를 고르세요.

> **TRY:** [Linkmap 무료 플랜](https://www.linkmap.biz/signup)으로 시작해보세요. 프로젝트 3개, 환경변수 50개까지 무료이며, 서비스맵 시각화와 GitHub Secrets 동기화를 즉시 사용할 수 있습니다.

---

*환경변수 기초 개념은 [환경변수 완전 정복 가이드](/guides/env), .env 파일의 위험성은 [.env 파일은 왜 위험한가](/blog/why-dotenv-is-dangerous)를 참고하세요.*
`,
  },
  // ======================================================================
  // 8. 마이크로서비스 환경에서 서비스 의존성 관리하기
  // ======================================================================
  {
    slug: 'microservice-dependency-service-map',
    title: '마이크로서비스 환경에서 서비스 의존성 관리하기 — 서비스맵이 필요한 이유',
    description: '마이크로서비스 아키텍처에서 서비스 간 의존성이 복잡해지는 원인, 장애 전파 사례, 의존성 시각화가 팀 생산성과 장애 대응 속도에 미치는 영향을 분석합니다.',
    category: 'insight',
    tags: ['마이크로서비스', '서비스 의존성', '서비스맵', '장애 전파', 'MSA', '시각화'],
    publishedAt: '2026-03-15',
    readingTime: '5분',
    relatedGuides: ['backend', 'deploy', 'github', 'frontend'],
    content: `> **KEY:** 마이크로서비스(MSA) 환경에서 서비스 의존성은 보이지 않는 순간 위험해집니다. 서비스가 10개를 넘으면 전체 연결 구조를 머릿속에 담아두는 것은 불가능합니다. 의존성 시각화는 선택이 아니라 생존 도구입니다.

## 의존성 문제는 서비스가 늘어날수록 기하급수적으로 커진다

모놀리식(Monolithic) 아키텍처에서 마이크로서비스(MSA, Microservice Architecture)로 전환하는 주된 이유는 독립적 배포, 장애 격리, 팀 자율성입니다. 그런데 아이러니하게도 MSA가 성숙할수록 반드시 마주치는 문제가 있습니다. 바로 **서비스 의존성(Service Dependency)의 폭발적 증가**입니다.

서비스가 3개일 때는 의존 관계가 단순합니다. 그런데 서비스가 10개가 되면 잠재적 의존 관계는 45개, 20개가 되면 190개입니다. 이 연결 중 일부는 문서화되어 있고, 나머지는 코드 안에, 또 일부는 개발자 머릿속에만 존재합니다.

> **INFO:** 마이크로서비스 환경에서 서비스 간 빈번한 네트워크 통신은 지연, 장애 전파, 부하 증가로 이어지며 이를 추적하지 못하면 장애 원인 파악에 수 시간이 걸릴 수 있습니다.

## 장애 전파: "어디서 터진 거야?"

MSA 환경에서 장애의 가장 나쁜 특성은 **조용히 퍼진다**는 것입니다. 결제 서비스 하나가 타임아웃을 일으키면 주문 서비스가 응답 대기 상태에 빠지고, 이어서 API 게이트웨이가 막히며, 결국 사용자에게는 전혀 무관해 보이는 메인 페이지에서 에러가 납니다.

\`\`\`
장애 전파 시나리오 (예시):

  외부 결제 API 타임아웃
       ↓
  payment-service 응답 지연 (30초 대기)
       ↓
  order-service 스레드 포화
       ↓
  api-gateway 503 반환
       ↓
  사용자: "왜 홈화면이 안 뜨지?"
\`\`\`

이런 상황에서 장애를 빠르게 진단하려면 **"어떤 서비스가 어떤 서비스에 의존하는지"** 를 즉시 확인할 수 있어야 합니다. 하지만 이 지식이 문서화되어 있지 않다면, 장애 대응은 코드를 읽고 추적하는 수작업 탐정 작업이 됩니다.

> **WARNING:** 서비스 의존성이 코드와 머릿속에만 존재하는 팀은 장애 대응 MTTR(Mean Time To Repair)이 2~5배 길어집니다. 의존성 문서가 오래됐다면, 없는 것보다 더 위험할 수 있습니다.

## 의존성이 복잡해지는 3가지 패턴

현장에서 의존성 문제가 심화되는 흔한 패턴은 세 가지입니다.

### 패턴 1: 공유 데이터베이스

여러 서비스가 같은 DB 테이블을 직접 읽고 씁니다. API를 통한 명시적 의존 대신 DB 스키마라는 암묵적 결합이 생깁니다. 스키마를 변경하면 예상치 못한 서비스가 깨집니다.

### 패턴 2: 동기 체인 호출

A → B → C → D 순서로 동기 HTTP 호출이 이어지면, D의 응답 시간이 A의 응답 시간에 직접 영향을 줍니다. 체인이 길수록 누적 지연과 실패 확률이 높아집니다.

### 패턴 3: 환경변수 의존성

서비스 B의 URL이나 API 키가 서비스 A의 환경변수에 하드코딩되어 있는 경우, B의 주소나 인증이 변경되면 A가 자동으로 실패합니다. 이 의존성은 코드에도 잘 드러나지 않습니다.

> **TIP:** 환경변수 레벨의 서비스 의존성(어떤 서비스가 어떤 서비스의 API 키를 참조하는지)은 코드 의존성보다 훨씬 파악하기 어렵습니다. [Linkmap 서비스맵](https://www.linkmap.biz)은 이 환경변수-서비스 연결 관계를 시각적으로 보여줍니다.

---

## 의존성 시각화가 팀에게 주는 것

서비스 의존성을 시각화하면 세 가지가 달라집니다.

**첫째, 온보딩 속도.** 새 팀원이 "우리 시스템이 어떻게 생겼지?"를 이해하는 데 드는 시간이 대폭 줄어듭니다. 코드를 탐색하는 대신 서비스맵 한 장을 보면 됩니다.

**둘째, 장애 대응 속도.** 장애 발생 시 영향 범위를 즉시 파악할 수 있습니다. "결제 서비스가 죽으면 어떤 서비스들이 영향을 받는가?" 를 지도에서 바로 읽어낼 수 있습니다.

**셋째, 변경 영향 분석.** 특정 서비스의 API를 변경하거나 DB 스키마를 수정하기 전에, 의존하는 서비스 목록을 확인하고 영향을 미리 평가할 수 있습니다.

## 소규모 팀을 위한 실용적 접근

대기업은 New Relic이나 Dynatrace 같은 엔터프라이즈 APM 도구로 서비스맵을 자동 생성합니다. 하지만 스타트업이나 소규모 팀에는 이런 도구의 비용과 설정 복잡도가 장벽입니다.

소규모 팀이 현실적으로 시작할 수 있는 방법은 두 가지입니다.

| 방법 | 장점 | 단점 |
|------|------|------|
| 수동 문서화 (Notion, Confluence) | 무료, 즉시 시작 | 유지 어려움, 실제 상태와 괴리 발생 |
| 서비스 연결 시각화 도구 | 실시간 반영, 환경변수 연동 | 도구 도입 필요 |

소규모 프로젝트라면 [Linkmap](https://www.linkmap.biz)처럼 프로젝트에 연결된 외부 서비스와 환경변수를 함께 시각화하는 도구가 실용적입니다. [서비스 카탈로그](https://www.linkmap.biz/services) 128개와 연동되어 각 서비스가 필요로 하는 환경변수를 자동 안내하고, 서비스 간 연결 관계를 지도 형태로 유지합니다.

> **TIP:** 서비스맵은 완벽할 필요가 없습니다. "지금 우리 프로젝트에서 외부 API를 몇 개 쓰고 있고, 각각 어떤 환경변수로 연결되어 있는가"를 파악하는 것만으로도 시작 가치가 있습니다. [서비스맵 만들기 3분 튜토리얼](/blog/service-map-tutorial)에서 실습해볼 수 있습니다.

---

## 의존성 관리, 지금 시작해야 하는 이유

"서비스가 몇 개 안 되는데 굳이?"라는 생각이 드는 팀일수록 지금이 적기입니다. 서비스가 30개가 된 뒤에 의존성을 역추적하는 것은 설계 단계부터 고려하는 것보다 10배 어렵습니다.

의존성 시각화를 팀 문화로 만드는 체크리스트:

- [ ] 신규 서비스 추가 시 의존 관계를 서비스맵에 반드시 등록
- [ ] 환경변수 변경 시 영향받는 서비스 목록 확인
- [ ] 장애 대응 후 의존성 맵 업데이트 (postmortem 포함)
- [ ] 신규 팀원 온보딩 시 서비스맵 워크스루 진행
- [ ] 분기별 의존성 맵 정합성 검토

> **TRY:** 지금 당장 프로젝트에서 외부 서비스를 몇 개 쓰고 있는지 세어보세요. 5개를 넘는다면 [Linkmap](https://www.linkmap.biz/signup)으로 의존성 시각화를 시작할 시점입니다.

---

*백엔드 구조 설계가 처음이라면 [백엔드 가이드](/guides/backend)를, 배포 환경에서의 서비스 연결은 [도메인·배포·서버 가이드](/guides/deploy)를 참고하세요.*
`,
  },
  // ======================================================================
  // 7. API 키 유출 사고 대응
  // ======================================================================
  {
    slug: 'api-key-leak-incident-response',
    title: 'API 키 유출 사고 대응 — 개발자가 알아야 할 즉시 조치와 예방법',
    description: 'AWS, GitHub, OpenAI API 키 유출 시 즉시 취해야 할 조치와 체크리스트, 그리고 재발을 막는 환경변수 보안 전략을 정리합니다.',
    category: 'env-management',
    tags: ['API 키 유출', '시크릿 유출', '환경변수 보안', '보안 사고 대응', '개발자 보안'],
    publishedAt: '2026-03-15',
    readingTime: '6분',
    relatedGuides: ['env', 'github', 'deploy', 'openai'],
    content: `> **KEY:** API 키 유출은 "혹시 내 저장소에?"가 아니라 "언제 내 저장소에서?"의 문제입니다. GitHub 리포지터리에는 매년 수백만 건의 시크릿이 노출되며, 유출 후 평균 수 분 안에 자동화된 봇이 키를 스캔합니다. 유출이 확인되면 **삭제보다 교체가 먼저**입니다.

## API 키 유출 사고, 생각보다 흔하다

개발하다 보면 실수는 반드시 생깁니다. \`git add .\` 한 번에 \`.env\` 파일이 통째로 올라가거나, 디버그 로그에 API 키가 찍히거나, 팀원에게 슬랙으로 키를 전송하는 일이 발생합니다.

GitHub의 시크릿 스캐닝 리포트에 따르면 공개 리포지터리에서만 연간 수백만 건의 시크릿이 탐지됩니다. AWS 액세스 키, OpenAI API 키, Stripe 시크릿 키 모두 주요 탐지 대상입니다.

> **WARNING:** 키를 GitHub에 커밋하고 즉시 삭제해도 안전하지 않습니다. 자동화된 봇은 새 커밋을 수 분 내에 스캔하며, fork된 저장소에는 히스토리가 영구 보존됩니다. **커밋된 키는 반드시 폐기하고 새 키를 발급해야 합니다.**

## 유출이 발생하는 주요 경로

어디서 새는지 알아야 막을 수 있습니다.

| 유출 경로 | 빈도 | 예시 |
|----------|------|------|
| \`.env\` 파일 Git 커밋 | 매우 높음 | \`.gitignore\` 설정 누락 |
| 코드 내 하드코딩 | 높음 | \`const key = "sk-..."\` |
| 로그·디버그 출력 | 중간 | \`console.log(process.env)\` |
| 채팅·이메일 전송 | 중간 | 슬랙, 카톡으로 키 공유 |
| 환경변수 미분리 | 낮음 | 개발·프로덕션 키 동일 사용 |
| CI/CD 로그 노출 | 낮음 | Actions 워크플로 로그 |

[환경변수 완전 정복 가이드](/guides/env)에서 각 경로별 방어 방법을 확인할 수 있습니다.

---

## 유출 즉시 조치 체크리스트 — 5단계

유출이 의심되는 순간 이 순서대로 움직이세요.

### 1단계: 즉시 키 폐기 (5분 이내)

**삭제보다 폐기가 먼저입니다.** git 히스토리를 정리하기 전에, 키 자체를 먼저 무효화합니다.

| 서비스 | 폐기 경로 |
|--------|---------|
| **AWS** | IAM → 사용자 → 보안 자격 증명 → 액세스 키 비활성화 |
| **OpenAI** | platform.openai.com → API keys → 해당 키 Revoke |
| **GitHub PAT** | Settings → Developer settings → Personal access tokens → Delete |
| **Stripe** | Dashboard → Developers → API keys → Roll key |
| **Supabase** | Project Settings → API → Service role key 재생성 |

> **TIP:** 폐기 후 새 키 발급까지 서비스가 잠시 중단될 수 있습니다. 프로덕션 환경이라면 새 키를 먼저 발급하고 배포 환경에 적용한 뒤 구 키를 폐기하는 순서로 다운타임을 최소화하세요.

### 2단계: 사용 로그 점검 (10분)

폐기와 동시에, 유출된 키가 악용되었는지 확인합니다.

\`\`\`
AWS CloudTrail → 최근 이벤트에서 낯선 IP·리전·서비스 확인
OpenAI Usage → 비정상적인 호출량·시각 확인
Stripe Dashboard → 비인가 결제 여부 확인
GitHub Security → Settings → Code security → Secret scanning alerts
\`\`\`

비정상 활동이 확인되면 해당 서비스의 보안팀에 즉시 신고하고, 영향 범위에 따라 고객 통지를 검토합니다.

### 3단계: Git 히스토리 정리

키가 이미 폐기되었으므로 히스토리 정리는 신중하게 진행합니다.

\`\`\`bash
# BFG Repo Cleaner 사용 (git filter-branch보다 빠름)
# 먼저 .env 또는 민감 파일을 히스토리에서 제거
bfg --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
\`\`\`

> **INFO:** force push는 협업 저장소에서 팀원 전원의 로컬 클론에 영향을 줍니다. 반드시 팀에 공지한 뒤 진행하세요. 이미 fork된 저장소의 히스토리는 제어할 수 없으므로, 키 폐기가 가장 중요한 조치입니다.

### 4단계: 새 키 배포

새 키는 \`.env\` 파일이 아닌 안전한 방법으로 배포합니다.

| 배포 방법 | 적합한 환경 |
|---------|-----------|
| Vercel 환경변수 UI | Vercel 배포 |
| Cloudflare Workers Secrets | Cloudflare 배포 |
| [GitHub Secrets 자동 동기화](/blog/github-secrets-automation) | GitHub Actions CI/CD |
| [Linkmap](https://www.linkmap.biz) AES-256-GCM 암호화 저장소 | 모든 환경 통합 관리 |

### 5단계: 원인 분석 및 팀 공유

같은 사고가 반복되지 않도록 포스트모템(Post-mortem)을 작성합니다. "왜 유출되었는가", "어떻게 탐지했는가", "어떻게 막을 수 있었는가"를 팀과 공유합니다.

---

## 서비스별 빠른 대응 가이드

### AWS IAM 액세스 키

AWS는 키 유출에 가장 빠르게 반응해야 하는 서비스입니다. 유출된 AWS 키로 수백만 원의 EC2 인스턴스나 S3 버킷이 생성될 수 있습니다.

\`\`\`bash
# AWS CLI로 즉시 비활성화
aws iam update-access-key \\
  --access-key-id AKIAIOSFODNN7EXAMPLE \\
  --status Inactive \\
  --user-name 사용자명
\`\`\`

비활성화 후 CloudTrail에서 해당 키의 최근 30일 활동을 반드시 검토합니다.

### OpenAI API 키

[OpenAI 연동 가이드](/guides/openai)에서 키 발급과 안전한 사용법을 참고하세요. Usage 대시보드에서 비정상 호출(특히 GPT-4 대량 호출)을 확인합니다.

### GitHub Personal Access Token

Settings → Developer settings → Personal access tokens에서 Delete합니다. GitHub은 공개 리포지터리에서 유출된 토큰을 자동 감지하여 이메일로 알려주기도 합니다. [GitHub 시작하기 가이드](/guides/github)에서 토큰 권한 최소화 방법을 확인할 수 있습니다.

## 재발 방지 — 구조적 예방

사고 대응보다 중요한 것은 구조적 예방입니다.

### 암호화 저장소 도입

[Linkmap](https://www.linkmap.biz)은 모든 API 키와 환경변수를 **AES-256-GCM**으로 암호화하여 저장합니다. 평문 \`.env\` 파일 대신 암호화된 저장소를 사용하면 키가 실수로 노출되더라도 암호화된 값만 노출됩니다.

### GitHub Secrets 자동 동기화

[Linkmap의 GitHub Secrets 동기화](https://www.linkmap.biz) 기능을 사용하면, Linkmap에서 키를 업데이트할 때 GitHub 저장소 시크릿에 자동 반영됩니다. 팀원이 \`.env\` 파일을 직접 다룰 필요가 없어집니다.

### 사전 탐지 도구

\`\`\`bash
# git-secrets: 커밋 전 시크릿 탐지
git secrets --install
git secrets --register-aws

# trufflehog: 히스토리 전체 스캔
trufflehog git https://github.com/your-org/your-repo
\`\`\`

> **TIP:** [Linkmap 서비스 카탈로그](https://www.linkmap.biz/services)에서 128개 서비스의 환경변수 정보와 발급 방법을 한눈에 확인할 수 있습니다. 어떤 키가 필요한지 미리 파악하면 하드코딩 유혹을 줄일 수 있습니다.

## 유출 예방 최종 체크리스트

사고 전에 이 항목을 점검하세요.

- [x] \`.gitignore\`에 \`.env*\` 전체 패턴 포함
- [x] \`.env.example\`로 변수 형식만 공유 (값 없이)
- [ ] git 히스토리에 시크릿 커밋 없음 확인
- [ ] CI/CD 로그에서 환경변수 마스킹 확인
- [ ] 개발·프로덕션 키 분리 (동일 키 사용 금지)
- [ ] 사용하지 않는 API 키 정기 폐기 (분기별 로테이션)
- [ ] [Linkmap](https://www.linkmap.biz/signup)으로 환경변수 암호화 저장소 도입

> **TRY:** API 키 유출 걱정 없이 개발하고 싶다면 [Linkmap 무료 플랜](https://www.linkmap.biz/signup)으로 시작하세요. 모든 시크릿을 AES-256-GCM으로 암호화하고, GitHub Secrets에 자동 동기화합니다. 프로젝트 3개, 환경변수 50개까지 무료입니다.

---

*\`.env\` 파일의 근본적인 위험성은 [.env 파일은 왜 위험한가](/blog/why-dotenv-is-dangerous)에서, 배포 환경 관리는 [도메인·배포·서버 가이드](/guides/deploy)에서 자세히 다룹니다.*
`,
  },
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
    relatedGuides: ['env', 'github', 'supabase', 'vercel'],
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

**이것이 바로 [Linkmap](https://www.linkmap.biz)이 해결하는 문제입니다.**

\`\`\`
바이브 코딩 워크플로:

  AI 에디터 (Cursor/Claude)     Linkmap (linkmap.biz)
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

- **[환경변수](/guides/env) 관리** — Supabase URL, OpenAI API 키, Stripe 시크릿 키 등 수십 개
- **서비스 연결** — 인증, DB, 결제, 이메일, 모니터링 등 평균 5~10개 외부 서비스
- **보안** — API 키 유출 방지, 환경별 분리, 팀 공유

> **INFO:** 평균적인 바이브 코딩 프로젝트는 **7개의 외부 서비스**를 연결합니다. 각 서비스마다 2~5개의 환경변수가 필요하므로, 총 15~35개의 환경변수를 관리해야 합니다. [Linkmap 서비스 카탈로그](https://www.linkmap.biz/services)에서 128개 서비스의 환경변수 정보를 확인하세요.

### Linkmap의 접근

[Linkmap](https://www.linkmap.biz)은 바이브 코더를 위한 인프라 두뇌입니다:

| 기능 | 설명 |
|------|------|
| **서비스맵 시각화** | 프로젝트에 연결된 모든 서비스를 지도처럼 봅니다 |
| **128개 서비스 카탈로그** | 각 서비스의 환경변수, 발급 방법, 가격을 한곳에서 확인 |
| **AES-256-GCM 암호화** | API 키를 군사 수준으로 안전하게 저장 |
| **GitHub Secrets 자동 배포** | 환경변수를 GitHub에 자동으로 동기화 |
| **원클릭 배포** | 템플릿으로 프로젝트를 즉시 시작 |

---

## 시작하기

바이브 코딩을 시작한다면, 이 순서를 추천합니다:

| 순서 | 할 일 | 도구 |
|------|------|------|
| 1 | AI로 코드 생성 | Cursor, Claude |
| 2 | GitHub 저장소 연결 | GitHub |
| 3 | 서비스 연결 + 환경변수 | [Linkmap](https://www.linkmap.biz) |
| 4 | DB + 인증 설정 | Supabase |
| 5 | 배포 | Vercel |

> **TRY:** 코드는 AI가, 연결은 [Linkmap](https://www.linkmap.biz)이. [무료로 시작하기](https://www.linkmap.biz/signup) — 프로젝트 3개, 환경변수 50개까지 무료입니다.

---

*환경변수가 처음이라면 [환경변수 완전 정복 가이드](/guides/env)를, 바이브 코딩 실전기는 [바이브 코딩으로 SaaS 만들기](/blog/vibe-coding-can-you-build-saas)에서 확인하세요.*
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
    relatedGuides: ['env', 'github', 'deploy'],
    content: `> **KEY:** \`.env\` 파일은 편리하지만 **암호화, 접근 제어, 감사 로그, 동기화가 전혀 없습니다.** GitHub에 따르면 매년 수백만 건의 시크릿이 공개 저장소에 노출됩니다.

## .env 파일, 왜 문제인가

거의 모든 개발자가 \`.env\` 파일을 사용합니다. 간편하고, 프레임워크가 기본 지원하니까요. 하지만 \`.env\` 파일에는 심각한 보안 위험이 숨어 있습니다. 환경변수가 처음이라면 [환경변수 완전 정복 가이드](/guides/env)를 먼저 읽어보세요.

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

> **TIP:** [Linkmap](https://www.linkmap.biz)을 사용하면 팀원을 프로젝트에 초대하여 **안전하게 환경변수를 공유**할 수 있습니다. 카톡이나 슬랙으로 API 키를 보낼 필요가 없습니다.

### 3. 환경별 관리 혼란

\`\`\`
프로젝트 루트/
  .env.local          ← 개발용 (내 PC)
  .env.staging        ← 스테이징용
  .env.production     ← 프로덕션용 (진짜 결제 키!)
  .env.backup         ← 이건 뭐지...?
  .env.old            ← 이것도 뭐지...?
\`\`\`

> **INFO:** 파일이 늘어날수록 "지금 어떤 키를 쓰고 있지?", "이 키는 아직 유효한가?"가 불분명해집니다. [Linkmap 서비스맵](https://www.linkmap.biz)에서 프로젝트별 연결 상태를 한눈에 파악하세요.

## .env 파일의 근본적 한계

| 기능 | .env 파일 | [Linkmap](https://www.linkmap.biz) |
|------|----------|-------------|
| 암호화 | 평문 텍스트 | **AES-256-GCM** |
| 접근 제어 | 파일 접근 = 전체 접근 | 역할 기반 제어 |
| 감사 로그 | 누가 봤는지 모름 | 모든 접근 기록 |
| 자동 동기화 | 수동 복사 | GitHub Secrets 자동 배포 |
| 유효성 검증 | 오타도 모름 | 자동 점검 |
| 팀 공유 | 카톡/슬랙 전송 | 초대 링크 |
| 서비스 시각화 | 없음 | 서비스맵 |

---

## 안전한 환경변수 관리 5가지 원칙

### 1. 암호화 저장
환경변수는 반드시 암호화해서 저장해야 합니다. [Linkmap](https://www.linkmap.biz)은 **AES-256-GCM**으로 모든 시크릿을 암호화합니다.

### 2. 접근 제어
누가 어떤 키에 접근할 수 있는지 제어합니다. 개발자에게는 개발 키만, 운영팀에게는 프로덕션 키만.

### 3. 감사 로그
모든 접근과 변경을 기록합니다. 문제 발생 시 "누가, 언제, 어떤 키를" 추적할 수 있어야 합니다.

### 4. 자동 동기화
로컬에서 키를 변경하면 배포 환경(GitHub Secrets, Vercel 등)에 자동으로 반영되어야 합니다.

### 5. 유효성 자동 점검
누락된 변수, 형식 오류, 만료된 키를 자동으로 감지합니다.

> **TIP:** 이 5가지를 모두 만족하는 도구를 쓰면 \`.env\` 파일 관련 사고를 **99% 예방**할 수 있습니다.

## .env 파일 대신 무엇을 쓸까

환경변수 관리 도구 중 **서비스 간 연결을 시각화하는 유일한 플랫폼이 [Linkmap](https://www.linkmap.biz)** 입니다. Doppler, Infisical, Vault가 키 하나하나를 관리한다면, Linkmap은 모든 서비스의 관계를 지도처럼 보여줍니다.

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
- [ ] 프로덕션 키는 배포 플랫폼(Vercel, Cloudflare)에서 관리
- [ ] [Linkmap](https://www.linkmap.biz/signup)으로 환경변수 관리 도구 도입

> **TRY:** 환경변수 관리가 고민이라면 [Linkmap 무료 플랜](https://www.linkmap.biz/signup)으로 시작하세요. 프로젝트 3개, 환경변수 50개까지 무료입니다.

---

*환경변수 기초는 [환경변수 완전 정복 가이드](/guides/env), 안전 관리 실천법은 [.env 안전 관리 5가지 방법](/blog/dotenv-safe-management-tips)에서 더 자세히 다룹니다.*
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
    relatedGuides: ['env', 'supabase', 'vercel', 'github'],
    content: `> **KEY:** 바이브 코딩으로 SaaS를 만들 수 있습니다. [Linkmap](https://www.linkmap.biz) 자체가 그 증거입니다 — 70+ DB 마이그레이션, 45+ API 라우트, 128개 서비스 페이지. 다만 **"AI한테 시켜서 뚝딱"은 아닙니다.**

## 결론부터: 가능합니다, 조건부로

[Linkmap](https://www.linkmap.biz) 자체가 바이브 코딩으로 시작된 프로젝트입니다.

\`\`\`
Linkmap (linkmap.biz)의 현재 규모 — 바이브 코딩으로 구축:

  코드베이스                        인프라
  ├── 70+ DB 마이그레이션            ├── Cloudflare Workers 배포
  ├── 45+ API 라우트                ├── Supabase (DB + Auth)
  ├── 128개 서비스 카탈로그 페이지     ├── GitHub 연동 (13 모듈)
  ├── 10개 인터랙티브 교육 가이드      ├── AES-256-GCM 암호화
  ├── 102+ 테스트 케이스             └── 원클릭 배포 시스템
  └── 6개 원클릭 배포 템플릿
\`\`\`

> **INFO:** [서비스 카탈로그](https://www.linkmap.biz/services)에서 128개 서비스의 환경변수 가이드를 확인하고, [원클릭 배포](https://www.linkmap.biz/my-sites)로 템플릿을 즉시 시작할 수 있습니다.

## AI가 잘하는 것 vs 못하는 것

| | 잘하는 것 | 못하는 것 (아직) |
|--|---------|---------------|
| **코드** | 보일러플레이트, CRUD, 패턴 재현 | 아키텍처 의사결정 |
| **디버깅** | 타입 에러, import 누락 | 비즈니스 로직 버그 |
| **보안** | 기본 패턴 적용 | 보안 검증 (API 키 노출, XSS) |
| **설정** | 코드 내 설정 | **서비스 연결** (API 키 발급, 환경변수) |

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

| 용도 | 추천 | 왜? |
|------|------|-----|
| AI 에디터 | Cursor | AI 코드 생성 통합 |
| LLM | Claude | 추론 품질, 긴 코드 생성 |
| 프레임워크 | Next.js | AI가 가장 잘 아는 프레임워크 |
| DB + 인증 | Supabase | AI 코드 호환성 최고 |
| 배포 | Vercel | 원클릭 배포, GitHub 연동 |
| AI 기능 | OpenAI | GPT API |
| 결제 | Stripe | 글로벌 결제 |
| **서비스 관리** | **[Linkmap](https://www.linkmap.biz)** | 연결 시각화 + 환경변수 암호화 |

---

> **TRY:** 바이브 코딩을 시작한다면: (1) Cursor로 코드 생성 → (2) GitHub 저장소 연결 → (3) [Linkmap에서 서비스 연결](https://www.linkmap.biz/signup) → (4) Vercel에 배포. 코드는 AI가, 연결은 [Linkmap](https://www.linkmap.biz)이.

---

*환경변수 관리가 처음이라면 [환경변수 가이드](/guides/env)를, 바이브 코딩의 기본 개념은 [바이브 코딩이란 무엇인가](/blog/what-is-vibe-coding)를 참고하세요.*
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
    relatedGuides: ['env', 'github', 'deploy'],
    content: `> **KEY:** 바이브 코딩 프로젝트는 평균 7개의 외부 서비스를 연결합니다. [Linkmap 서비스맵](https://www.linkmap.biz)은 이 연결을 **지도처럼 시각화**해서 "어떤 서비스가, 어떤 환경변수로, 어떻게 연결되어 있는지" 한눈에 보여줍니다.

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
    relatedGuides: ['env', 'github', 'deploy'],
    content: `> **KEY:** 5가지 실천법 요약 — (1) .gitignore 완벽 설정, (2) 커밋 히스토리 점검, (3) 환경별 분리, (4) NEXT_PUBLIC_ 접두사 주의, (5) [Linkmap](https://www.linkmap.biz) 같은 전용 관리 도구 사용. 지금 바로 적용하세요.

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

| 환경 | 키 관리 위치 | 추천 |
|------|-----------|------|
| 로컬 개발 | \`.env.local\` (로컬만) | — |
| 스테이징 | 배포 플랫폼 설정 | Vercel Preview |
| 프로덕션 | 배포 플랫폼 설정 | Vercel, Cloudflare |

> **INFO:** 프로덕션 키는 \`.env\` 파일이 아니라 배포 플랫폼의 환경변수 설정에서 관리하세요. [Linkmap의 GitHub Secrets 자동 동기화](/blog/github-secrets-automation)를 사용하면 환경변수가 CI/CD에 자동 반영됩니다.

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

> **WARNING:** **절대로** \`SUPABASE_SERVICE_ROLE_KEY\`, \`OPENAI_API_KEY\`, \`STRIPE_SECRET_KEY\`에 \`NEXT_PUBLIC_\` 접두사를 붙이면 안 됩니다. 브라우저 개발자 도구에서 **누구나** 볼 수 있게 됩니다. 환경변수의 공개/비공개 구분이 헷갈린다면 [환경변수 완전 정복 가이드](/guides/env)를 참고하세요.

## 5. 환경변수 관리 도구 사용

\`.env\` 파일의 근본적 한계를 해결하려면 [Linkmap](https://www.linkmap.biz) 같은 전용 도구가 필요합니다.

| 기능 | .env 파일 | [Linkmap](https://www.linkmap.biz) |
|------|----------|---------|
| 암호화 | 평문 | **AES-256-GCM** |
| 자동 동기화 | 수동 복사 | GitHub Secrets 자동 배포 |
| 감사 로그 | 없음 | 모든 접근 기록 |
| 누락 점검 | 없음 | 자동 감지 |
| 팀 공유 | 카톡/슬랙 | 초대 링크 + 역할 제어 |
| 시각화 | 없음 | 서비스맵 |

---

## 지금 바로 확인하세요

- [x] \`.gitignore\`에 \`.env*\` 패턴 포함
- [ ] git 히스토리에 \`.env\` 커밋 기록 없음
- [ ] 프로덕션 키는 배포 플랫폼(Vercel, Cloudflare)에서 관리
- [ ] \`NEXT_PUBLIC_\`에 시크릿 키 미포함
- [ ] [Linkmap](https://www.linkmap.biz/signup)으로 환경변수 관리 도구 도입

> **TRY:** [Linkmap 무료 플랜](https://www.linkmap.biz/signup)으로 시작하세요. 프로젝트 3개, 환경변수 50개까지 무료입니다.

---

*환경변수 기초는 [환경변수 완전 정복 가이드](/guides/env), .env 위험성은 [.env 파일은 왜 위험한가](/blog/why-dotenv-is-dangerous)를 참고하세요.*
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
    relatedGuides: ['github', 'env', 'deploy'],
    content: `> **KEY:** GitHub Secrets를 수동으로 관리하면 동기화 누락, 변경 추적 불가, 확인 불가 문제가 생깁니다. [Linkmap](https://www.linkmap.biz)은 환경변수를 GitHub 저장소 시크릿에 **1클릭으로 자동 동기화**합니다.

## GitHub Secrets, 수동 관리의 한계

GitHub Actions로 CI/CD를 구성하면, 환경변수를 GitHub Secrets에 등록해야 합니다.

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

[Linkmap](https://www.linkmap.biz)은 프로젝트의 환경변수를 GitHub 저장소 시크릿에 **자동으로 동기화**합니다.

\`\`\`
자동 동기화 흐름 (linkmap.biz):

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
| 1 | [Linkmap](https://www.linkmap.biz)에서 프로젝트 생성 |
| 2 | 프로젝트 설정에서 GitHub 저장소 연결 (OAuth) |
| 3 | 동기화할 환경변수 선택 |
| 4 | **끝!** 이후 자동 동기화 |

> **TIP:** 이후 Linkmap에서 환경변수를 변경할 때마다 GitHub Secrets에 **자동 반영**됩니다. 수동 업데이트가 필요 없습니다.

## 수동 vs 자동 비교

| 항목 | 수동 (GitHub UI) | 자동 ([Linkmap](https://www.linkmap.biz)) |
|------|-----------------|---------------|
| 등록 시간 | 변수당 30초 | **전체 1클릭** |
| 동기화 | 수동 확인 | 자동 |
| 변경 추적 | 없음 | 감사 로그 |
| 누락 방지 | 기억에 의존 | 자동 점검 |
| 다중 저장소 | 각각 설정 | 한곳에서 관리 |
| 값 확인 | 불가능 (마스킹) | Linkmap에서 확인 가능 |

---

## 실전 시나리오

### 시나리오 1: 새 서비스 추가

OpenAI API를 프로젝트에 추가할 때:

1. [서비스 카탈로그](https://www.linkmap.biz/services)에서 OpenAI 선택
2. API 키 입력 (자동 AES-256 암호화)
3. GitHub 동기화 클릭 → \`OPENAI_API_KEY\` 시크릿 자동 등록
4. GitHub Actions에서 바로 사용 가능

### 시나리오 2: 키 로테이션

Supabase 키를 변경할 때:

1. [Linkmap](https://www.linkmap.biz)에서 새 키로 업데이트
2. GitHub 동기화 → 기존 시크릿 **자동 갱신**
3. 다음 배포에서 새 키 적용

### 시나리오 3: 팀원 합류

새 팀원이 프로젝트에 참여할 때:

1. 팀원을 [Linkmap](https://www.linkmap.biz) 프로젝트에 초대
2. 팀원은 서비스맵에서 전체 아키텍처 파악
3. GitHub 권한 설정 후 동기화 → 별도의 시크릿 공유 불필요

> **INFO:** 더 이상 카톡이나 슬랙으로 API 키를 보낼 필요가 없습니다.

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

> **TIP:** Linkmap이 시크릿을 자동 등록하므로, 워크플로에서 \`secrets.XXX\`로 바로 참조할 수 있습니다.

---

> **TRY:** [Linkmap 무료 플랜](https://www.linkmap.biz/signup)으로 시작하세요. 환경변수 관리 기초는 [환경변수 완전 정복 가이드](/guides/env)를 참고하세요.

---

*GitHub 설정은 [GitHub 시작하기 가이드](/guides/github), 배포 파이프라인은 [배포 가이드](/guides/deploy)를 참고하세요.*
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
