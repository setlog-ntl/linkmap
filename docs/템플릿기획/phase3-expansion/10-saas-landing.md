# SaaS 랜딩 (SaaS Landing) 기획서

## 1. 개요

| 항목 | 내용 |
|------|------|
| 슬러그 | `saas-landing` |
| UUID | `b2c3d4e5-0013-4000-9000-000000000013` |
| 카테고리 | 비즈니스 & 커머스 |
| 타겟 페르소나 | 스타트업, SaaS 제품 개발자 (페르소나: 사이드 프로젝트 런처 "준호", 30세) |
| 우선순위 | 10위 (총점 90/100) |
| Phase | Phase 3: 확장 |
| 구현 일정 | 4일 |
| 비고 | 전환율 최적화. 기능 비교표, FAQ, 고객 후기, 뉴스레터. product-landing보다 SaaS 특화 |

### 핵심 가치
- **전환율 극대화**: 가치 제안 → 기능 → 사회적 증거 → 가격 → CTA 전환 퍼널 설계
- **SaaS 특화**: 가격 비교표, 통계 카운터, FAQ 아코디언 등 SaaS 랜딩에 필수적인 패턴
- **신뢰 엔진**: 로고 배너, 고객 후기, 통계 수치로 사회적 증거 극대화
- **심리 패턴**: 앵커링(가격표) + 사회적 증거(로고/후기) + 희소성(인기 플랜) + 행동 유도(CTA)

---

## 2. AI 구현 프롬프트

> 이 섹션을 통째로 AI(Claude Code, Cursor 등)에 전달하면 템플릿을 구현할 수 있다.

```
## 컨텍스트
Linkmap(https://www.linkmap.biz)의 원클릭 배포용 홈페이지 템플릿을 구현한다.
사용자가 GitHub 연결 → 템플릿 선택 → 환경변수 입력 → GitHub Pages 배포 3단계로 SaaS 제품 랜딩 페이지를 생성한다.

## 템플릿: SaaS 랜딩 (saas-landing)
- 타겟: 스타트업, SaaS 제품 개발자, 사이드 프로젝트 런처
- 카테고리: 비즈니스 & 커머스
- 핵심 목적: 전환율 최적화된 SaaS 제품 랜딩 페이지. 기능 소개, 가격 비교표, 고객 후기, FAQ, 뉴스레터를 통한 가입/결제 전환

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 폰트: Pretendard(한글) + Inter(영문) via next/font
- 아이콘: Lucide React
- 다크모드: next-themes
- 애니메이션: CSS 기반 (카운트업, 슬라이드), framer-motion 선택
- SEO: next/metadata + JSON-LD
- OG 이미지: @vercel/og (/api/og)
- 배포: GitHub Pages (static export)

## 핵심 섹션
1. 히어로: 제품명 + 가치 제안(큰 헤딩) + CTA 2개 (시작하기 + 데모 보기) + 제품 스크린샷/목업
2. 로고 배너: "신뢰하는 기업들" 로고 가로 무한 스크롤 (marquee)
3. Features: 기능 섹션 (좌우 교차 이미지+텍스트 3~4개 또는 3열 아이콘 그리드)
4. 통계: 핵심 지표 카운터 4개 (사용자 수, 처리 건수 등) - 스크롤 진입 시 카운트업 애니메이션
5. 가격표: Free/Pro/Enterprise 3단 비교 테이블 (체크/X 마크, 인기 플랜 하이라이트 보더)
6. 고객 후기: 후기 카드 (사진 + 이름 + 회사 + 후기) 3열 그리드 또는 슬라이드
7. FAQ: 아코디언 UI (질문 클릭 → 답변 펼침)
8. CTA + 뉴스레터: 최종 전환 섹션 + 이메일 구독 폼
9. 푸터: 4열 링크 그리드 (제품, 회사, 지원, 법률) + SNS + 카피라이트

## 디자인 스펙
- SaaS 전형 레이아웃 (Vercel, Linear, Stripe 참고)
- 화이트 배경 + 인디고/바이올렛 악센트
- 큰 여백, 깔끔한 타이포그래피
- 통계 카운터: 스크롤 진입 시 0 → 목표값 카운트업 (duration 2s, easing ease-out)
- 가격표: 인기 플랜에 ring-2 ring-indigo-500 + "인기" 뱃지
- 로고 배너: grayscale → hover 시 컬러, 무한 marquee 스크롤
- 컬러: 배경 #ffffff(라이트) / #0f0b1e(다크), 악센트 #4f46e5(indigo-600), 보조 #7c3aed(violet-600)
- 폰트: 헤딩 4xl~6xl font-bold, 부제 xl, 본문 base~lg

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 제품/사이트 이름
- NEXT_PUBLIC_TAGLINE: 가치 제안 헤드라인
- NEXT_PUBLIC_HERO_IMAGE_URL: 히어로 제품 스크린샷/목업 URL
- NEXT_PUBLIC_CTA_URL: 주요 CTA(시작하기) 링크
- NEXT_PUBLIC_DEMO_URL: 데모 보기 링크
- NEXT_PUBLIC_LOGOS: 신뢰 기업 로고 JSON ([{"name":"...", "image_url":"..."}])
- NEXT_PUBLIC_FEATURES: 기능 목록 JSON ([{"title":"...", "description":"...", "image_url":"...", "icon":"zap"}])
- NEXT_PUBLIC_STATS: 통계 JSON ([{"label":"활성 사용자", "value":10000, "suffix":"+"}])
- NEXT_PUBLIC_PRICING: 가격 플랜 JSON ([{"name":"Free", "price":"0", "period":"월", "features":["기능1","기능2"], "cta_text":"시작하기", "cta_url":"...", "is_popular":false}])
- NEXT_PUBLIC_TESTIMONIALS: 고객 후기 JSON ([{"name":"...", "company":"...", "avatar_url":"...", "text":"..."}])
- NEXT_PUBLIC_FAQ: FAQ JSON ([{"question":"...", "answer":"..."}])
- NEXT_PUBLIC_NEWSLETTER_ACTION: 뉴스레터 폼 액션 URL (Mailchimp, ConvertKit 등)
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. `linkmap-templates/saas-landing` GitHub 레포에 Next.js 프로젝트 생성
2. 모든 개인화 데이터는 NEXT_PUBLIC_* 환경변수로 주입
3. 환경변수 미설정 시 매력적인 데모 데이터 표시 (가상의 SaaS 제품)
4. Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
5. 한국어 기본, lang="ko"
6. 반응형: 360px ~ 1440px
7. 다크모드 토글 포함
8. /api/og 엔드포인트로 동적 OG 이미지 생성
9. JSON-LD 구조화 데이터 (SoftwareApplication + Organization 타입)
10. 접근성: WCAG 2.1 AA, 키보드 내비게이션
11. 카운트업 애니메이션: IntersectionObserver로 뷰포트 진입 시 시작, requestAnimationFrame 사용
12. 가격표: 모바일에서 카드 세로 배치, 인기 플랜 상단 고정
13. FAQ 아코디언: 한 번에 하나만 열림 (accordion 패턴)
14. 로고 배너: CSS animation marquee (JS 불필요), hover 시 일시정지
15. 뉴스레터 폼: action URL 미설정 시 mailto: 폴백
```

---

## 3. 핵심 섹션 정의

### 섹션 1: 히어로
- **위치**: 페이지 최상단 (py-20 md:py-32)
- **구성**:
  - 중앙 정렬: 뱃지("새로운 기능 출시" pill) + 헤드라인(4xl~6xl, font-bold) + 부제(xl, text-neutral-600) + CTA 2개(좌: 시작하기 bg-indigo-600, 우: 데모 보기 outline)
  - 하단: 제품 스크린샷/목업 (rounded-xl, shadow-2xl, border)
  - 배경: 미세한 그라데이션 그리드 패턴 (radial-gradient + dot pattern)
- **인터랙션**:
  - CTA hover → bg-indigo-700 / outline hover → bg-indigo-50
  - 스크린샷 미세 float 애니메이션 (optional)
  - 스크롤 시 스크린샷 패럴렉스 (optional)
- **데이터**: `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_TAGLINE`, `NEXT_PUBLIC_HERO_IMAGE_URL`, `NEXT_PUBLIC_CTA_URL`, `NEXT_PUBLIC_DEMO_URL`
- **폴백**: "FlowSync" + "팀 협업을 10배 빠르게" + 데모 스크린샷 placeholder

### 섹션 2: 로고 배너
- **위치**: 히어로 아래 (py-12, border-y)
- **구성**:
  - "1,000+개 팀이 신뢰합니다" 텍스트 (sm, text-neutral-500, 센터)
  - 로고 가로 무한 스크롤 (CSS marquee animation)
  - 로고: grayscale, opacity-50 → hover 시 grayscale-0, opacity-100
- **인터랙션**:
  - 무한 스크롤 (CSS `@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`)
  - hover 시 스크롤 일시 정지 (`animation-play-state: paused`)
- **데이터**: `NEXT_PUBLIC_LOGOS` JSON 배열
- **폴백**: 5~8개 가상 기업 로고 (텍스트 기반 placeholder)

### 섹션 3: Features
- **위치**: 로고 배너 아래 (py-20)
- **구성**:
  - 섹션 타이틀: "주요 기능" + 부제
  - 좌우 교차 레이아웃 (홀수: 이미지 좌 + 텍스트 우, 짝수: 반대)
  - 또는 3열 아이콘 그리드 (Lucide 아이콘 + 제목 + 설명)
  - 각 기능: 아이콘 뱃지(bg-indigo-100 text-indigo-600) + 제목(xl, font-semibold) + 설명(base) + 이미지(optional)
- **인터랙션**:
  - 스크롤 진입 시 fade-up 또는 slide-in
  - 아이콘 뱃지 hover → scale(1.1)
- **데이터**: `NEXT_PUBLIC_FEATURES` JSON 배열
- **폴백**: 데모 기능 4개 (실시간 협업, AI 자동화, 분석 대시보드, 통합 API)

### 섹션 4: 통계
- **위치**: Features 아래 (py-16, bg-indigo-600 text-white 또는 bg-neutral-50)
- **구성**:
  - 4열 그리드 (md:grid-cols-2 lg:grid-cols-4)
  - 각 카운터: 숫자(4xl~5xl, font-bold) + 접미사("+", "%", "K") + 라벨(sm)
  - 구분선: `border-r border-white/20` (마지막 제외)
- **인터랙션**:
  - IntersectionObserver: 뷰포트 진입 시 카운트업 시작
  - 카운트업: 0 → 목표값, duration 2s, easing ease-out (requestAnimationFrame)
  - 한 번만 실행 (재진입 시 최종값 유지)
- **데이터**: `NEXT_PUBLIC_STATS` JSON 배열
- **폴백**: 4개 (활성 사용자 10,000+, 처리 건수 500만+, 가동률 99.9%, 고객 만족도 4.9)

### 섹션 5: 가격표
- **위치**: 통계 아래 (py-20)
- **구성**:
  - 섹션 타이틀: "심플한 요금제" + 부제
  - 3열 그리드 (lg:grid-cols-3)
  - 각 플랜 카드: 플랜명 + 가격(4xl)/기간 + 설명 + 기능 체크리스트(Check/X 아이콘) + CTA 버튼
  - 인기 플랜: `ring-2 ring-indigo-500` + "인기" 뱃지 상단 + CTA 버튼 bg-indigo-600
  - 비인기 플랜: `border border-neutral-200` + CTA 버튼 outline
- **인터랙션**:
  - 인기 플랜 카드 미세 scale(1.02) 기본 적용
  - CTA hover → 색상 전환
  - 카드 hover → shadow-lg
- **데이터**: `NEXT_PUBLIC_PRICING` JSON 배열
- **폴백**: 3플랜 (Free/Pro 월29,000원/Enterprise 커스텀)

### 섹션 6: 고객 후기
- **위치**: 가격표 아래 (py-20, bg-neutral-50 dark:bg-neutral-900)
- **구성**:
  - 섹션 타이틀: "고객이 말하는 FlowSync"
  - 3열 그리드 (md:grid-cols-2 lg:grid-cols-3)
  - 각 카드: 큰따옴표 아이콘 + 후기 텍스트(base, leading-relaxed) + 아바타(40px) + 이름 + 회사/직함
  - 카드: `bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm`
- **인터랙션**:
  - 스크롤 진입 시 staggered fade-up
  - 카드 hover → shadow-md
- **데이터**: `NEXT_PUBLIC_TESTIMONIALS` JSON 배열
- **폴백**: 데모 후기 3개

### 섹션 7: FAQ
- **위치**: 후기 아래 (py-20)
- **구성**:
  - 섹션 타이틀: "자주 묻는 질문"
  - 아코디언 리스트 (max-w-3xl mx-auto)
  - 각 항목: 질문(font-medium) + ChevronDown 아이콘 + 답변(collapse/expand)
  - 구분선: `border-b border-neutral-200`
- **인터랙션**:
  - 클릭 → 답변 slide-down 애니메이션 (max-height transition)
  - 다른 항목 클릭 시 이전 항목 자동 닫힘 (accordion)
  - ChevronDown → ChevronUp 회전 애니메이션
- **데이터**: `NEXT_PUBLIC_FAQ` JSON 배열
- **폴백**: 데모 FAQ 5개 (무료 체험, 해지, 보안, 팀 관리, 기술 지원)

### 섹션 8: CTA + 뉴스레터
- **위치**: FAQ 아래 (py-20, bg-gradient-to-r from-indigo-600 to-violet-600 text-white)
- **구성**:
  - 헤드라인: "지금 시작하세요" (3xl~4xl, font-bold)
  - 부제: "14일 무료 체험, 카드 불필요"
  - CTA 버튼: "무료로 시작하기" (bg-white text-indigo-600)
  - 또는 뉴스레터 폼: 이메일 input + 구독 버튼 (inline)
- **인터랙션**:
  - CTA hover → bg-neutral-100
  - 이메일 input focus → ring
  - 폼 제출 → action URL POST 또는 mailto: 폴백
- **데이터**: `NEXT_PUBLIC_CTA_URL`, `NEXT_PUBLIC_NEWSLETTER_ACTION`
- **폴백**: "#" 링크 + mailto: 폴백

### 섹션 9: 푸터
- **위치**: 페이지 최하단 (py-12, border-t)
- **구성**:
  - 4열 링크 그리드: 제품(기능, 가격, 변경 로그) / 회사(소개, 블로그, 채용) / 지원(문서, 도움말, 연락) / 법률(이용약관, 개인정보, 쿠키)
  - 하단: 로고 + 카피라이트 + SNS 아이콘
  - "Powered by Linkmap" 텍스트
- **데이터**: 환경변수 불필요 (정적 링크 + `NEXT_PUBLIC_SITE_NAME`)
- **폴백**: 데모 링크("#")

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:---:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 제품/사이트 이름 | O | `'FlowSync'` |
| `NEXT_PUBLIC_TAGLINE` | 가치 제안 헤드라인 | | `'팀 협업을 10배 빠르게'` |
| `NEXT_PUBLIC_HERO_IMAGE_URL` | 히어로 제품 스크린샷 URL | | `null` (placeholder 목업) |
| `NEXT_PUBLIC_CTA_URL` | 주요 CTA 링크 | | `'#'` |
| `NEXT_PUBLIC_DEMO_URL` | 데모 보기 링크 | | `null` (미표시) |
| `NEXT_PUBLIC_LOGOS` | 신뢰 기업 로고 (JSON) | | 데모 로고 6개 |
| `NEXT_PUBLIC_FEATURES` | 기능 목록 (JSON) | | 데모 기능 4개 |
| `NEXT_PUBLIC_STATS` | 핵심 지표 (JSON) | | 데모 통계 4개 |
| `NEXT_PUBLIC_PRICING` | 가격 플랜 (JSON) | | Free/Pro/Enterprise 3플랜 |
| `NEXT_PUBLIC_TESTIMONIALS` | 고객 후기 (JSON) | | 데모 후기 3개 |
| `NEXT_PUBLIC_FAQ` | FAQ (JSON) | | 데모 FAQ 5개 |
| `NEXT_PUBLIC_NEWSLETTER_ACTION` | 뉴스레터 폼 액션 URL | | `null` (mailto: 폴백) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | `null` (미추적) |

---

## 5. 디자인 스펙

### 컬러

| 용도 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경 (주) | `#ffffff` | `#0f0b1e` (커스텀 다크 바이올렛) |
| 배경 (보조) | `#f9fafb` (gray-50) | `#1a1533` |
| 텍스트 (주) | `#111827` (gray-900) | `#f3f4f6` (gray-100) |
| 텍스트 (보조) | `#6b7280` (gray-500) | `#9ca3af` (gray-400) |
| 악센트 (주) | `#4f46e5` (indigo-600) | `#818cf8` (indigo-400) |
| 악센트 (보조) | `#7c3aed` (violet-600) | `#a78bfa` (violet-400) |
| 악센트 hover | `#4338ca` (indigo-700) | `#6366f1` (indigo-500) |
| 인기 플랜 보더 | `#4f46e5` (indigo-600) | `#818cf8` (indigo-400) |
| 체크 아이콘 | `#10b981` (emerald-500) | `#34d399` (emerald-400) |
| X 아이콘 | `#d1d5db` (gray-300) | `#4b5563` (gray-600) |
| 통계 배경 | `#4f46e5` → `#7c3aed` 그라데이션 | 동일 |
| CTA 배경 | `#4f46e5` → `#7c3aed` 그라데이션 | 동일 |

### 타이포그래피

| 요소 | 크기 | 굵기 | 기타 |
|------|------|------|------|
| 히어로 헤드라인 | `text-4xl md:text-5xl lg:text-6xl` | `font-bold` | `tracking-tight`, Pretendard |
| 히어로 부제 | `text-lg md:text-xl` | `font-normal` | `text-gray-600`, Pretendard |
| 섹션 타이틀 | `text-3xl md:text-4xl` | `font-bold` | `tracking-tight`, Pretendard |
| 섹션 부제 | `text-lg` | `font-normal` | `text-gray-500` |
| 기능 제목 | `text-xl` | `font-semibold` | Pretendard |
| 통계 숫자 | `text-4xl md:text-5xl` | `font-bold` | Inter (tabular-nums) |
| 가격 | `text-4xl` | `font-bold` | Inter |
| 플랜명 | `text-lg` | `font-semibold` | Pretendard |
| FAQ 질문 | `text-base md:text-lg` | `font-medium` | Pretendard |
| FAQ 답변 | `text-base` | `font-normal` | `leading-relaxed text-gray-600` |
| 푸터 링크 | `text-sm` | `font-normal` | `text-gray-500 hover:text-gray-900` |

### 레이아웃

- 전체: `min-h-screen bg-white dark:bg-[#0f0b1e]`
- 콘텐츠 영역: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- 히어로: `text-center py-20 md:py-32`
- 로고 배너: `overflow-hidden py-12` (marquee 컨테이너)
- Features: `grid grid-cols-1 md:grid-cols-2 gap-16 items-center` (교차) 또는 `grid-cols-3` (그리드)
- 통계: `grid grid-cols-2 md:grid-cols-4 gap-8 py-16`
- 가격표: `grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto`
- 후기: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- FAQ: `max-w-3xl mx-auto divide-y`
- CTA: `text-center py-20`
- 푸터: `grid grid-cols-2 md:grid-cols-4 gap-8` + 하단 flex
- 섹션 간격: `py-16 md:py-20 lg:py-24`

### 반응형 브레이크포인트

| 브레이크포인트 | 히어로 | 가격표 | 통계 | Features |
|--------------|--------|-------|------|---------|
| 360px (모바일) | text-3xl, 단일 CTA | 1열 (인기 플랜 최상단) | 2열 | 1열 |
| 640px (sm) | text-4xl | 1열 | 2열 | 1열 |
| 768px (md) | text-5xl, CTA 2개 나란히 | 3열 | 4열 | 2열 교차 |
| 1024px (lg) | text-6xl | 3열 | 4열 | 2열 교차 |
| 1440px (xl) | max-w-7xl 고정 | max-w-5xl | max-w-7xl | max-w-7xl |

---

## 6. 컴포넌트 구조

```
linkmap-templates/saas-landing/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트(Pretendard+Inter), ThemeProvider
│   │   ├── page.tsx                # 메인 페이지 (섹션 조합)
│   │   └── api/og/route.tsx        # OG 이미지 동적 생성
│   ├── components/
│   │   ├── hero-section.tsx        # 헤드라인 + CTA + 제품 스크린샷
│   │   ├── logo-banner.tsx         # 신뢰 기업 로고 무한 marquee
│   │   ├── features-section.tsx    # 기능 소개 (교차/그리드)
│   │   ├── stats-section.tsx       # 통계 카운터 (카운트업 애니메이션)
│   │   ├── pricing-section.tsx     # 가격 비교표 (3플랜)
│   │   ├── pricing-card.tsx        # 개별 가격 카드 (인기/일반 분기)
│   │   ├── testimonials-section.tsx # 고객 후기 카드 그리드
│   │   ├── faq-section.tsx         # FAQ 아코디언
│   │   ├── cta-section.tsx         # 최종 CTA + 뉴스레터 폼
│   │   ├── footer.tsx              # 4열 링크 그리드 + 카피라이트
│   │   └── nav-header.tsx          # 고정 네비게이션 + 다크모드 토글
│   ├── hooks/
│   │   └── use-count-up.ts         # 카운트업 커스텀 훅 (IntersectionObserver + rAF)
│   └── lib/
│       └── config.ts               # 환경변수 파싱 + 타입 안전 config + 데모 데이터
├── tailwind.config.ts
├── next.config.ts                  # static export 설정
├── package.json
├── tsconfig.json
└── README.md
```

### 컴포넌트 역할

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `layout.tsx` | Server | 메타데이터, Pretendard+Inter 폰트 로드, ThemeProvider, JSON-LD (SoftwareApplication+Organization) |
| `page.tsx` | Server | config 읽기, 섹션 컴포넌트 조합 (Hero → Logo → Features → Stats → Pricing → Testimonials → FAQ → CTA → Footer) |
| `hero-section.tsx` | Client | 헤드라인, 부제, CTA 2개 버튼, 제품 스크린샷 (배경 그라데이션 패턴) |
| `logo-banner.tsx` | Client | 로고 무한 marquee 스크롤 (CSS animation), hover 일시정지, grayscale 효과 |
| `features-section.tsx` | Client | FEATURES JSON 파싱, 좌우 교차 또는 3열 그리드 렌더링 (Lucide 아이콘 매핑) |
| `stats-section.tsx` | Client | STATS JSON 파싱, useCountUp 훅으로 카운트업 애니메이션 |
| `pricing-section.tsx` | Client | PRICING JSON 파싱, PricingCard 3개 렌더링 |
| `pricing-card.tsx` | Client | 개별 가격 카드 (인기 플랜: ring + 뱃지, 일반: border), 기능 체크리스트 |
| `testimonials-section.tsx` | Client | TESTIMONIALS JSON 파싱, 후기 카드 그리드 |
| `faq-section.tsx` | Client | FAQ JSON 파싱, 아코디언 상태 관리 (하나만 열림), slide-down 애니메이션 |
| `cta-section.tsx` | Client | 최종 전환 CTA + 뉴스레터 이메일 폼 (action URL 또는 mailto 폴백) |
| `footer.tsx` | Server | 4열 링크 그리드, SNS 아이콘, 카피라이트, Powered by Linkmap |
| `nav-header.tsx` | Client | 고정 상단 바 (로고 + 섹션 링크 + CTA 버튼 + 다크모드 토글), 스크롤 시 배경 blur |
| `use-count-up.ts` | Hook | IntersectionObserver + requestAnimationFrame 기반 카운트업 (한 번 실행, ease-out) |
| `config.ts` | Util | `process.env.NEXT_PUBLIC_*` → 타입 안전 객체, JSON 파싱, 데모 데이터 폴백 |

---

## 7. 시드 데이터

### 7.1 SQL INSERT (homepage_templates)

```sql
INSERT INTO homepage_templates (
  id, slug, name, name_ko, description, description_ko,
  preview_image_url, github_owner, github_repo, default_branch,
  framework, required_env_vars, tags, is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0013-4000-9000-000000000013',
  'saas-landing',
  'SaaS Landing',
  'SaaS 랜딩',
  'Conversion-optimized SaaS landing page with hero section, logo marquee, feature showcase, animated stat counters, pricing comparison table, customer testimonials, FAQ accordion, and newsletter signup. Designed for startups and product launches.',
  '전환율 최적화 SaaS 랜딩 페이지. 히어로, 로고 배너, 기능 소개, 통계 카운터 애니메이션, 가격 비교표, 고객 후기, FAQ 아코디언, 뉴스레터 구독. 스타트업과 제품 런칭에 최적화.',
  NULL,
  'linkmap-templates',
  'saas-landing',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "제품/사이트 이름", "required": true},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "가치 제안 헤드라인", "required": false},
    {"key": "NEXT_PUBLIC_HERO_IMAGE_URL", "description": "히어로 제품 스크린샷 URL", "required": false},
    {"key": "NEXT_PUBLIC_CTA_URL", "description": "주요 CTA 링크", "required": false},
    {"key": "NEXT_PUBLIC_DEMO_URL", "description": "데모 보기 링크", "required": false},
    {"key": "NEXT_PUBLIC_LOGOS", "description": "신뢰 기업 로고 JSON", "required": false},
    {"key": "NEXT_PUBLIC_FEATURES", "description": "기능 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_STATS", "description": "핵심 지표 JSON", "required": false},
    {"key": "NEXT_PUBLIC_PRICING", "description": "가격 플랜 JSON", "required": false},
    {"key": "NEXT_PUBLIC_TESTIMONIALS", "description": "고객 후기 JSON", "required": false},
    {"key": "NEXT_PUBLIC_FAQ", "description": "FAQ JSON", "required": false},
    {"key": "NEXT_PUBLIC_NEWSLETTER_ACTION", "description": "뉴스레터 폼 액션 URL", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['saas', 'landing', 'startup', 'pricing', 'conversion', 'faq', 'nextjs'],
  false,
  true,
  13
) ON CONFLICT (slug) DO NOTHING;
```

### 7.2 TypeScript 시드 (`homepage-templates.ts` 추가분)

```typescript
{
  id: 'b2c3d4e5-0013-4000-9000-000000000013',
  slug: 'saas-landing',
  name: 'SaaS Landing',
  name_ko: 'SaaS 랜딩',
  description: 'Conversion-optimized SaaS landing page with hero section, logo marquee, feature showcase, animated stat counters, pricing comparison table, customer testimonials, FAQ accordion, and newsletter signup. Designed for startups and product launches.',
  description_ko: '전환율 최적화 SaaS 랜딩 페이지. 히어로, 로고 배너, 기능 소개, 통계 카운터 애니메이션, 가격 비교표, 고객 후기, FAQ 아코디언, 뉴스레터 구독. 스타트업과 제품 런칭에 최적화.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'saas-landing',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '제품/사이트 이름', required: true },
    { key: 'NEXT_PUBLIC_TAGLINE', description: '가치 제안 헤드라인', required: false },
    { key: 'NEXT_PUBLIC_HERO_IMAGE_URL', description: '히어로 제품 스크린샷 URL', required: false },
    { key: 'NEXT_PUBLIC_CTA_URL', description: '주요 CTA 링크', required: false },
    { key: 'NEXT_PUBLIC_DEMO_URL', description: '데모 보기 링크', required: false },
    { key: 'NEXT_PUBLIC_LOGOS', description: '신뢰 기업 로고 JSON', required: false },
    { key: 'NEXT_PUBLIC_FEATURES', description: '기능 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_STATS', description: '핵심 지표 JSON', required: false },
    { key: 'NEXT_PUBLIC_PRICING', description: '가격 플랜 JSON', required: false },
    { key: 'NEXT_PUBLIC_TESTIMONIALS', description: '고객 후기 JSON', required: false },
    { key: 'NEXT_PUBLIC_FAQ', description: 'FAQ JSON', required: false },
    { key: 'NEXT_PUBLIC_NEWSLETTER_ACTION', description: '뉴스레터 폼 액션 URL', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['saas', 'landing', 'startup', 'pricing', 'conversion', 'faq', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 13,
}
```

---

## 8. 검증 체크리스트

### 기능
- [ ] 히어로 헤드라인, 부제, CTA 2개 정상 표시
- [ ] CTA "시작하기" 클릭 → 외부 URL 이동
- [ ] CTA "데모 보기" 클릭 → 데모 URL 이동
- [ ] 로고 배너 무한 marquee 스크롤 동작
- [ ] 로고 hover 시 grayscale 해제 + 스크롤 일시정지
- [ ] Features 좌우 교차 또는 그리드 정상 렌더링
- [ ] 통계 카운터 스크롤 진입 시 카운트업 애니메이션 동작
- [ ] 카운트업 한 번만 실행 (재진입 시 최종값 유지)
- [ ] 가격표 3플랜 정상 표시 (인기 플랜 하이라이트)
- [ ] 가격표 기능 체크리스트 Check/X 아이콘 정상
- [ ] 고객 후기 카드 정상 렌더링
- [ ] FAQ 아코디언 클릭 → 답변 펼침/접힘
- [ ] FAQ 한 번에 하나만 열림 (accordion 패턴)
- [ ] CTA 섹션 + 뉴스레터 폼 정상 동작
- [ ] 환경변수 미설정 시 데모 데이터 정상 표시
- [ ] 다크모드 토글 동작
- [ ] 네비게이션 섹션 링크 smooth scroll

### 성능
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 90+
- [ ] Lighthouse Best Practices 90+
- [ ] Lighthouse SEO 90+
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] 로고 marquee CSS-only (JS 불필요)
- [ ] 카운트업 requestAnimationFrame 사용 (setInterval 불가)

### 접근성
- [ ] 키보드 내비게이션 (Tab 순서, 아코디언 Enter/Space)
- [ ] 스크린리더 호환 (aria-label, aria-expanded for FAQ)
- [ ] 컬러 대비 WCAG 2.1 AA 준수
- [ ] 가격표에 aria-label (예: "Pro 플랜 월 29,000원")
- [ ] 로고 배너에 aria-hidden="true" (장식적 요소)
- [ ] prefers-reduced-motion 대응 (카운트업 즉시 표시, marquee 정지)

### SEO
- [ ] OG 메타태그 정상 생성
- [ ] JSON-LD SoftwareApplication + Organization 구조화 데이터
- [ ] /api/og 이미지 생성 확인
- [ ] robots.txt 존재
- [ ] sitemap.xml 생성
