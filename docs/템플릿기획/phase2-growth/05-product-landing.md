# 제품 랜딩페이지 (Product Landing) 기획서

## 1. 개요

| 항목 | 값 |
|------|-----|
| 슬러그 | `product-landing` |
| UUID | `b2c3d4e5-0008-4000-9000-000000000008` |
| 카테고리 | 비즈니스 & 커머스 |
| 타겟 | 사이드 프로젝트 런처 (페르소나: "준호" 30세, 프론트엔드 개발자) |
| 우선순위 | 5위 (총점 90/100) |
| Phase | Phase 2 - 성장 |
| 일정 | 3일 |
| 비고 | 전환율 최적화 랜딩페이지, SaaS/앱/서비스 출시용 |

### 핵심 가치

**"사이드 프로젝트를 세상에 알리는 가장 빠른 방법"**

- **히어로 + 기능 소개 + 스크린샷 + CTA + 가격표**: 전환율 최적화된 섹션 구성
- **Product Hunt / Hacker News 출시**: 사이드 프로젝트 런치에 최적화된 구조
- **3단 가격 비교 테이블**: Free/Pro/Team 플랜 비교로 수익화 지원
- **Social Proof**: 사용자 수 통계 + 후기로 신뢰도 구축

### 심리적 동기

| 동기 | 설명 |
|------|------|
| 성취감 | 내가 만든 제품을 전문적으로 소개하는 페이지 보유 |
| 효율성 | 환경변수만 설정하면 즉시 전문적인 랜딩페이지 완성 |

### 바이럴 전략

- Product Hunt, Hacker News, Reddit 출시 시 랜딩페이지 공유
- 개발자 커뮤니티(디스코드, 슬랙)에서 사이드 프로젝트 공유
- "Built with Linkmap" 푸터 배지로 자연 노출

---

## 2. AI 구현 프롬프트

```
당신은 시니어 풀스택 개발자입니다. 아래 명세에 따라 제품 랜딩페이지 홈페이지 템플릿을 구현하세요.

## 컨텍스트
- 프로젝트: Linkmap 원클릭 배포용 홈페이지 템플릿
- 템플릿명: 제품 랜딩페이지 (Product Landing)
- 슬러그: product-landing
- 레포: linkmap-templates/product-landing/
- 타겟: 사이드 프로젝트 런처 (30세 프론트엔드 개발자 "준호")
- 핵심 가치: 히어로 + 기능 소개 + 스크린샷 + CTA + 가격표. 전환율 최적화

## 기술 스택
- Framework: Next.js 16 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS v4
- Fonts: Pretendard (한글) + Inter (영문) via next/font
- Icons: Lucide React
- Dark Mode: next-themes (ThemeProvider + ThemeToggle)
- SEO: next/metadata + JSON-LD (SoftwareApplication schema)
- OG Image: @vercel/og (/api/og)
- Analytics: Google Analytics 4 (선택)
- Deploy: GitHub Pages (Fork 기반)

## 핵심 섹션 (8개)
1. 히어로: 제품명(h1) + 한줄 피치(서브 타이틀) + CTA 버튼(primary) + 보조 링크(secondary) + 스크린샷/목업 이미지. 큰 여백, 중앙 정렬
2. Features: 기능 3~6개 카드 그리드(모바일 1열, 데스크톱 3열). 각 카드: Lucide 아이콘 + 제목 + 설명
3. 스크린샷: 제품 스크린샷 갤러리. 모바일 가로 스크롤 카루셀, 데스크톱 그리드. 클릭 시 확대
4. Social Proof: 통계 섹션("10,000+ 사용자" 같은 큰 숫자 3개) + 사용자 후기 카드(아바타+이름+직함+코멘트) 3개
5. 가격표: Free/Pro/Team 3단 가격 비교 테이블. 각 플랜: 가격, 기능 목록(체크마크), CTA 버튼. 추천 플랜 하이라이트
6. FAQ: 아코디언 형태 FAQ (클릭 시 펼침/접힘). 5~8개 질문/답변
7. CTA: 최종 전환 섹션. 큰 제목 + 설명 + 큰 CTA 버튼. 그라데이션 배경으로 시각적 강조
8. 푸터: 제품 로고 + 링크(GitHub, Docs, Twitter) + "Powered by Linkmap"

## 디자인 스펙
- 컬러: 모던/클린, 화이트 배경 + 파란(blue-600)/보라(violet-600) 악센트
- 다크모드: slate-950 배경 + blue-400/violet-400 악센트
- 타이포: 히어로 제목 56~64px (모바일 36px), 피치 20~24px, 본문 16~18px
- 레이아웃: max-w-6xl, 넓은 여백, 섹션별 배경색 교차 (흰/회)
- CTA 버튼: 그라데이션(blue→violet), 호버 시 shadow-lg + scale(1.02)
- 반응형: 360px → 768px → 1024px → 1440px
- 가격표: 모바일 세로 스택, 데스크톱 가로 3열

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 제품명
- NEXT_PUBLIC_TAGLINE: 한줄 피치
- NEXT_PUBLIC_HERO_IMAGE_URL: 히어로 스크린샷/목업 이미지 URL
- NEXT_PUBLIC_CTA_URL: 주요 CTA 링크 (가입 페이지, 앱 다운로드 등)
- NEXT_PUBLIC_CTA_TEXT: CTA 버튼 텍스트 (기본: "시작하기")
- NEXT_PUBLIC_FEATURES (JSON): 기능 목록 [{"icon":"Zap","title":"빠른 속도","desc":"..."}]
- NEXT_PUBLIC_SCREENSHOTS (JSON): 스크린샷 URL 배열
- NEXT_PUBLIC_TESTIMONIALS (JSON): 사용자 후기 [{"name":"홍길동","title":"개발자","comment":"...","avatar":"url"}]
- NEXT_PUBLIC_PRICING (JSON): 가격표 데이터
- NEXT_PUBLIC_FAQ (JSON): FAQ 목록 [{"q":"질문","a":"답변"}]
- NEXT_PUBLIC_STATS (JSON): 통계 [{"value":"10,000+","label":"사용자"}]
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. 환경변수 미설정 시 가상의 SaaS 제품 데모 데이터 표시 (TodoApp 예시)
2. src/lib/config.ts에서 환경변수를 타입 안전하게 파싱
3. JSON 환경변수는 try-catch로 안전하게 파싱, 실패 시 기본값 사용
4. Lighthouse 4개 카테고리 모두 90+ 달성
5. JSON-LD에 SoftwareApplication 스키마 포함
6. /api/og 엔드포인트로 제품명 + 피치가 포함된 OG 이미지 생성
7. Features 아이콘은 Lucide React 아이콘 이름(문자열)으로 동적 렌더링
8. 가격표의 추천 플랜은 ring-2 + "추천" 배지로 시각적 강조
9. FAQ 아코디언은 접근성 준수 (aria-expanded, role 등)
10. CTA 버튼에 hover/focus 애니메이션 적용
11. 섹션별 배경색 교차로 시각적 리듬감 부여 (흰→회→흰→회)
12. 스크린샷 섹션은 모바일에서 가로 스크롤 가능한 카루셀
```

---

## 3. 핵심 섹션 정의

### 3.1 히어로 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 페이지 최상단 |
| 구성 | 제품명(h1, 56~64px) + 한줄 피치(서브타이틀) + CTA 버튼(primary, 그라데이션) + 보조 링크(secondary, 텍스트) + 스크린샷 이미지 + 다크모드 토글(우측 상단) |
| 인터랙션 | CTA 버튼 호버 시 shadow-lg + scale(1.02). 스크린샷에 subtle shadow + rotate(1deg) |
| 데이터 | `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_TAGLINE`, `NEXT_PUBLIC_HERO_IMAGE_URL`, `NEXT_PUBLIC_CTA_URL`, `NEXT_PUBLIC_CTA_TEXT` |
| 기본값 | "TodoFlow", "할 일 관리의 새로운 경험", 데모 스크린샷, "#", "시작하기" |

### 3.2 Features 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 히어로 아래 |
| 구성 | 섹션 제목("주요 기능") + 기능 카드 그리드(모바일 1열, 데스크톱 3열). 각 카드: Lucide 아이콘(48px) + 제목 + 설명 |
| 인터랙션 | 카드 호버 시 translateY(-4px) + shadow 증가 |
| 데이터 | `NEXT_PUBLIC_FEATURES`(JSON) |
| 기본값 | Zap("빠른 속도"), Shield("보안"), Users("협업") 등 6개 |
| 참고 | 아이콘 이름은 문자열로 전달 → Lucide에서 동적 import |

### 3.3 스크린샷 섹션

| 항목 | 설명 |
|------|------|
| 위치 | Features 아래 |
| 구성 | 섹션 제목("제품 미리보기") + 스크린샷 갤러리 (모바일: 가로 스크롤 카루셀, 데스크톱: 2x2 그리드) |
| 인터랙션 | 이미지 클릭 시 라이트박스 확대. 모바일 스와이프 스크롤 |
| 데이터 | `NEXT_PUBLIC_SCREENSHOTS`(JSON 배열) |
| 기본값 | 플레이스홀더 스크린샷 4장 |
| 성능 | next/image + lazy loading |

### 3.4 Social Proof 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 스크린샷 아래 (회색 배경 섹션) |
| 구성 | 통계 3개(큰 숫자 + 라벨, 가로 배치) + 후기 카드 3개(아바타+이름+직함+코멘트) |
| 인터랙션 | 통계 숫자 카운트업 애니메이션(선택). 후기 카드 호버 시 border 하이라이트 |
| 데이터 | `NEXT_PUBLIC_STATS`(JSON), `NEXT_PUBLIC_TESTIMONIALS`(JSON) |
| 기본값 | "10,000+ 사용자", "99.9% 가동률", "4.9/5 평점" + 후기 3개 |

### 3.5 가격표 섹션

| 항목 | 설명 |
|------|------|
| 위치 | Social Proof 아래 |
| 구성 | 섹션 제목("요금제") + 3단 가격 카드(Free/Pro/Team). 각 카드: 플랜명, 가격(/월), 기능 목록(체크/X 아이콘), CTA 버튼. 추천 플랜(Pro): ring-2 + "추천" 배지 + 약간 확대 |
| 인터랙션 | CTA 버튼 클릭 시 NEXT_PUBLIC_CTA_URL로 이동. 추천 플랜 카드 scale(1.05) |
| 데이터 | `NEXT_PUBLIC_PRICING`(JSON) |
| 기본값 | Free(0원), Pro(9,900원/월), Team(29,900원/월) 데모 |

### 3.6 FAQ 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 가격표 아래 (회색 배경 섹션) |
| 구성 | 섹션 제목("자주 묻는 질문") + 아코디언 리스트(질문 클릭 시 답변 펼침/접힘) |
| 인터랙션 | 클릭 시 chevron 회전 + 답변 슬라이드 다운. 하나만 열림(선택) or 다중 열림 |
| 데이터 | `NEXT_PUBLIC_FAQ`(JSON) |
| 기본값 | 5개 질문/답변 데모 데이터 |
| 접근성 | `role="region"`, `aria-expanded`, `aria-controls`, 키보드 Enter/Space |

### 3.7 CTA 섹션

| 항목 | 설명 |
|------|------|
| 위치 | FAQ 아래 |
| 구성 | 그라데이션 배경(blue→violet) + 큰 제목("지금 시작하세요") + 설명 텍스트 + 큰 CTA 버튼(화이트) |
| 인터랙션 | CTA 버튼 호버 시 scale(1.05) + shadow. 배경에 subtle 패턴/노이즈 |
| 데이터 | `NEXT_PUBLIC_CTA_URL`, `NEXT_PUBLIC_CTA_TEXT` |
| 기본값 | "#", "무료로 시작하기" |

### 3.8 푸터

| 항목 | 설명 |
|------|------|
| 위치 | 페이지 최하단 |
| 구성 | 제품 로고/이름 + 링크 그룹(제품, 리소스, 소셜) + "Powered by Linkmap" |
| 인터랙션 | 링크 호버 시 색상 변화 |
| 데이터 | `NEXT_PUBLIC_SITE_NAME` |
| 기본값 | 제품명 + 기본 링크 세트 |

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:----:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 제품명 | O | `"TodoFlow"` |
| `NEXT_PUBLIC_TAGLINE` | 한줄 피치 | | `"할 일 관리의 새로운 경험"` |
| `NEXT_PUBLIC_HERO_IMAGE_URL` | 히어로 스크린샷/목업 URL | | 기본 데모 스크린샷 |
| `NEXT_PUBLIC_CTA_URL` | 주요 CTA 링크 URL | | `"#"` |
| `NEXT_PUBLIC_CTA_TEXT` | CTA 버튼 텍스트 | | `"시작하기"` |
| `NEXT_PUBLIC_FEATURES` | 기능 목록 (JSON) | | 6개 기능 데모 데이터 |
| `NEXT_PUBLIC_SCREENSHOTS` | 스크린샷 URL (JSON) | | 플레이스홀더 4장 |
| `NEXT_PUBLIC_TESTIMONIALS` | 사용자 후기 (JSON) | | 데모 후기 3개 |
| `NEXT_PUBLIC_PRICING` | 가격표 데이터 (JSON) | | Free/Pro/Team 데모 |
| `NEXT_PUBLIC_FAQ` | FAQ 목록 (JSON) | | 5개 Q&A 데모 |
| `NEXT_PUBLIC_STATS` | 통계 데이터 (JSON) | | 3개 통계 데모 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | (미설정 시 비활성) |

---

## 5. 디자인 스펙

### 컬러 팔레트

| 용도 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경 (primary) | `#FFFFFF` | `#020617` (slate-950) |
| 배경 (alt section) | `#F8FAFC` (slate-50) | `#0F172A` (slate-900) |
| 배경 (card) | `#FFFFFF` | `#1E293B` (slate-800) |
| 텍스트 (primary) | `#0F172A` (slate-900) | `#F8FAFC` (slate-50) |
| 텍스트 (secondary) | `#64748B` (slate-500) | `#94A3B8` (slate-400) |
| 악센트 (primary) | `#2563EB` (blue-600) | `#60A5FA` (blue-400) |
| 악센트 (secondary) | `#7C3AED` (violet-600) | `#A78BFA` (violet-400) |
| CTA 그라데이션 | `blue-600` → `violet-600` | `blue-500` → `violet-500` |
| 추천 플랜 ring | `violet-500` | `violet-400` |
| 보더 | `#E2E8F0` (slate-200) | `#334155` (slate-700) |

### 타이포그래피

| 요소 | 크기 | 굵기 | 비고 |
|------|------|------|------|
| 히어로 제목 (h1) | 64px (모바일 36px) | 800 | Pretendard |
| 히어로 피치 | 24px (모바일 18px) | 400 | Pretendard |
| 섹션 제목 (h2) | 36px (모바일 28px) | 700 | Pretendard |
| 기능 카드 제목 | 20px | 600 | Pretendard |
| 가격 숫자 | 48px (모바일 36px) | 800 | Inter |
| 통계 숫자 | 48px (모바일 32px) | 800 | Inter |
| 본문 | 18px (모바일 16px) | 400 | Pretendard |
| CTA 버튼 텍스트 | 18px | 600 | Pretendard |

### 레이아웃

- **컨테이너**: `max-w-6xl` (1152px) - 넓은 레이아웃
- **섹션 간격**: `py-20` ~ `py-24` (80~96px)
- **기능 그리드**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **가격표**: `grid-cols-1 md:grid-cols-3`, 추천 플랜 `scale-105`
- **후기 카드**: `grid-cols-1 md:grid-cols-3`
- **카드 라운드**: `rounded-2xl` (16px)
- **그림자**: `shadow-lg` (카드 호버), `shadow-xl` (CTA 호버)
- **섹션 배경 교차**: 흰 → 회(slate-50) → 흰 → 회 (시각적 리듬)

### 반응형 브레이크포인트

| 브레이크포인트 | 너비 | 레이아웃 변화 |
|------------|------|------------|
| 모바일 | 360px+ | 싱글 컬럼, 가격표 세로 스택, 스크린샷 카루셀 |
| 태블릿 | 768px+ | 기능 2열, 가격표 3열, 스크린샷 2열 |
| 데스크톱 | 1024px+ | 기능 3열, 넓은 여백 |
| 와이드 | 1440px+ | max-w-6xl 중앙 정렬 |

---

## 6. 컴포넌트 구조

### 파일 트리

```
linkmap-templates/product-landing/
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   └── images/
│       ├── hero-mockup.png
│       └── screenshots/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트, 테마, GA
│   │   ├── page.tsx                # 메인 페이지 (섹션 조합)
│   │   └── api/
│   │       └── og/
│   │           └── route.tsx       # OG 이미지 (제품명+피치)
│   ├── components/
│   │   ├── hero-section.tsx        # 히어로 (제품명+피치+CTA+이미지)
│   │   ├── features-section.tsx    # 기능 카드 그리드
│   │   ├── feature-card.tsx        # 개별 기능 카드 (아이콘+제목+설명)
│   │   ├── lucide-icon.tsx         # 문자열→Lucide 아이콘 동적 렌더링
│   │   ├── screenshots-section.tsx # 스크린샷 갤러리/카루셀
│   │   ├── screenshot-lightbox.tsx # 스크린샷 확대 모달
│   │   ├── social-proof-section.tsx# 통계 + 후기
│   │   ├── stats-bar.tsx           # 통계 숫자 3개 가로 배치
│   │   ├── testimonial-card.tsx    # 후기 카드 (아바타+이름+코멘트)
│   │   ├── pricing-section.tsx     # 가격표 3단 비교
│   │   ├── pricing-card.tsx        # 개별 가격 카드
│   │   ├── faq-section.tsx         # FAQ 아코디언
│   │   ├── faq-item.tsx            # 개별 FAQ 아이템 (펼침/접힘)
│   │   ├── cta-section.tsx         # 최종 CTA 섹션
│   │   ├── footer.tsx              # 푸터
│   │   ├── theme-toggle.tsx        # 다크모드 토글
│   │   └── theme-provider.tsx      # next-themes Provider
│   └── lib/
│       ├── config.ts               # 환경변수 파싱 + 타입 + 기본값
│       └── constants.ts            # 기본 데모 데이터 상수
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### 컴포넌트 역할

| 컴포넌트 | 파일 | 역할 | Props |
|---------|------|------|-------|
| HeroSection | `hero-section.tsx` | 제품명, 피치, CTA 버튼, 스크린샷 | `name`, `tagline`, `ctaUrl`, `ctaText`, `heroImage` |
| FeaturesSection | `features-section.tsx` | 기능 카드 그리드 컨테이너 | `features` |
| FeatureCard | `feature-card.tsx` | 개별 기능 카드 | `icon`, `title`, `description` |
| LucideIcon | `lucide-icon.tsx` | 문자열 이름으로 Lucide 아이콘 렌더링 | `name`, `size`, `className` |
| ScreenshotsSection | `screenshots-section.tsx` | 스크린샷 갤러리/카루셀 | `screenshots` |
| ScreenshotLightbox | `screenshot-lightbox.tsx` | 스크린샷 확대 모달 | `images`, `currentIndex`, `onClose` |
| SocialProofSection | `social-proof-section.tsx` | 통계 + 후기 컨테이너 | `stats`, `testimonials` |
| StatsBar | `stats-bar.tsx` | 통계 숫자 3개 가로 배치 | `stats` |
| TestimonialCard | `testimonial-card.tsx` | 후기 카드 | `name`, `title`, `comment`, `avatar` |
| PricingSection | `pricing-section.tsx` | 가격표 3단 비교 컨테이너 | `plans` |
| PricingCard | `pricing-card.tsx` | 개별 가격 카드 | `name`, `price`, `features`, `ctaUrl`, `isRecommended` |
| FaqSection | `faq-section.tsx` | FAQ 아코디언 컨테이너 | `items` |
| FaqItem | `faq-item.tsx` | 개별 FAQ 아이템 (접힘/펼침) | `question`, `answer` |
| CtaSection | `cta-section.tsx` | 최종 전환 CTA 섹션 | `ctaUrl`, `ctaText` |
| Footer | `footer.tsx` | 푸터 (링크+Linkmap) | `productName` |
| ThemeToggle | `theme-toggle.tsx` | 다크모드 토글 버튼 | - |
| ThemeProvider | `theme-provider.tsx` | next-themes Provider 래퍼 | `children` |

---

## 7. 시드 데이터

### 7.1 SQL INSERT

```sql
-- Phase 2: 제품 랜딩페이지 템플릿
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0008-4000-9000-000000000008',
  'product-landing',
  'Product Landing',
  '제품 랜딩페이지',
  'Conversion-optimized landing page for side projects and SaaS products. Includes hero, features grid, screenshots, pricing table, testimonials, and FAQ.',
  '사이드 프로젝트와 SaaS 제품을 위한 전환율 최적화 랜딩페이지. 히어로, 기능 그리드, 스크린샷, 가격표, 후기, FAQ 포함.',
  NULL,
  'linkmap-templates', 'product-landing', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "제품명", "required": true},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "한줄 피치", "required": false},
    {"key": "NEXT_PUBLIC_HERO_IMAGE_URL", "description": "히어로 스크린샷/목업 이미지 URL", "required": false},
    {"key": "NEXT_PUBLIC_CTA_URL", "description": "주요 CTA 링크 URL", "required": false},
    {"key": "NEXT_PUBLIC_CTA_TEXT", "description": "CTA 버튼 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_FEATURES", "description": "기능 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_SCREENSHOTS", "description": "스크린샷 URL JSON 배열", "required": false},
    {"key": "NEXT_PUBLIC_TESTIMONIALS", "description": "사용자 후기 JSON", "required": false},
    {"key": "NEXT_PUBLIC_PRICING", "description": "가격표 데이터 JSON", "required": false},
    {"key": "NEXT_PUBLIC_FAQ", "description": "FAQ 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_STATS", "description": "통계 데이터 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['product', 'landing', 'saas', 'startup', 'conversion', 'nextjs'],
  false, true, 8
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description,
  description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars,
  tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order,
  updated_at = now();
```

### 7.2 TypeScript 시드

```typescript
// src/data/homepage-templates.ts 에 추가

const TEMPLATE_IDS = {
  // ... 기존 IDs ...
  PRODUCT_LANDING: 'b2c3d4e5-0008-4000-9000-000000000008',
};

// homepageTemplates 배열에 추가:
{
  id: TEMPLATE_IDS.PRODUCT_LANDING,
  slug: 'product-landing',
  name: 'Product Landing',
  name_ko: '제품 랜딩페이지',
  description: 'Conversion-optimized landing page for side projects and SaaS products. Includes hero, features grid, screenshots, pricing table, testimonials, and FAQ.',
  description_ko: '사이드 프로젝트와 SaaS 제품을 위한 전환율 최적화 랜딩페이지. 히어로, 기능 그리드, 스크린샷, 가격표, 후기, FAQ 포함.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'product-landing',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '제품명', required: true },
    { key: 'NEXT_PUBLIC_TAGLINE', description: '한줄 피치', required: false },
    { key: 'NEXT_PUBLIC_HERO_IMAGE_URL', description: '히어로 스크린샷/목업 이미지 URL', required: false },
    { key: 'NEXT_PUBLIC_CTA_URL', description: '주요 CTA 링크 URL', required: false },
    { key: 'NEXT_PUBLIC_CTA_TEXT', description: 'CTA 버튼 텍스트', required: false },
    { key: 'NEXT_PUBLIC_FEATURES', description: '기능 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_SCREENSHOTS', description: '스크린샷 URL JSON 배열', required: false },
    { key: 'NEXT_PUBLIC_TESTIMONIALS', description: '사용자 후기 JSON', required: false },
    { key: 'NEXT_PUBLIC_PRICING', description: '가격표 데이터 JSON', required: false },
    { key: 'NEXT_PUBLIC_FAQ', description: 'FAQ 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_STATS', description: '통계 데이터 JSON', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['product', 'landing', 'saas', 'startup', 'conversion', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 8,
}
```

---

## 8. 검증 체크리스트

### 기능 검증

- [ ] 환경변수 미설정 시 TodoFlow 데모 데이터가 올바르게 표시됨
- [ ] `NEXT_PUBLIC_SITE_NAME` 설정 시 제품명이 모든 위치에 반영됨
- [ ] 히어로 CTA 버튼 클릭 시 `NEXT_PUBLIC_CTA_URL`로 이동
- [ ] Features 카드가 Lucide 아이콘과 함께 올바르게 렌더링됨
- [ ] Features 아이콘 이름이 잘못된 경우 기본 아이콘(Star)으로 폴백
- [ ] 스크린샷 갤러리가 모바일에서 가로 스크롤 카루셀로 동작
- [ ] 스크린샷 클릭 시 라이트박스 확대 모달 열림
- [ ] 통계 숫자가 올바르게 표시됨
- [ ] 후기 카드가 아바타+이름+직함+코멘트로 렌더링됨
- [ ] 가격표 3단이 올바르게 비교 표시됨 (추천 플랜 하이라이트)
- [ ] 가격표 체크마크/X 아이콘이 올바르게 표시됨
- [ ] FAQ 아코디언 클릭 시 펼침/접힘 동작
- [ ] 최종 CTA 섹션의 버튼이 올바르게 링크됨
- [ ] 다크모드 토글이 정상 동작하고 모든 섹션에 적용됨
- [ ] JSON 환경변수가 잘못된 형식일 때 기본값으로 폴백
- [ ] OG 이미지(`/api/og`)에 제품명과 피치가 포함됨
- [ ] 섹션별 배경색 교차가 올바르게 적용됨

### 성능 검증

- [ ] Lighthouse Performance 점수 90+
- [ ] Lighthouse Best Practices 점수 90+
- [ ] First Contentful Paint < 1.5초
- [ ] Largest Contentful Paint < 2.5초
- [ ] Cumulative Layout Shift < 0.1
- [ ] 이미지 next/image 최적화 확인
- [ ] Lucide 아이콘 트리셰이킹 확인 (번들 사이즈)
- [ ] 번들 사이즈 250KB 미만 (gzip)

### 접근성 검증

- [ ] Lighthouse Accessibility 점수 90+
- [ ] 키보드만으로 모든 인터랙션 가능 (탭 순서, Enter/Space)
- [ ] FAQ 아코디언 접근성 속성 (`aria-expanded`, `aria-controls`, `role`)
- [ ] 스크린리더로 모든 콘텐츠 접근 가능
- [ ] 이미지에 적절한 alt 텍스트
- [ ] 색상 대비 WCAG 2.1 AA 준수
- [ ] 라이트박스 모달 포커스 트랩 동작
- [ ] `lang="ko"` 속성 설정됨

### SEO 검증

- [ ] Lighthouse SEO 점수 90+
- [ ] `<title>` 태그에 제품명 포함
- [ ] meta description에 제품 피치 포함
- [ ] JSON-LD SoftwareApplication 스키마 포함 (제품명, 설명, 가격)
- [ ] OG 메타태그 (og:title, og:description, og:image) 설정
- [ ] 트위터 카드 메타태그 설정
- [ ] `robots.txt` 생성됨
- [ ] `sitemap.xml` 생성됨
- [ ] 구조화 데이터 테스트 통과
