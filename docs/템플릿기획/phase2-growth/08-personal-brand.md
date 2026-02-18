# 퍼스널 브랜드 (Personal Brand) 기획서

## 1. 개요

| 항목 | 값 |
|------|-----|
| 슬러그 | `personal-brand` |
| UUID | `b2c3d4e5-0010-4000-9000-000000000010` |
| 카테고리 | 링크인바이오 & 브랜딩 |
| 타겟 | MZ세대 전반 (퍼스널 브랜딩에 관심 있는 20~30대) |
| 우선순위 | 8위 (총점 80/100) |
| Phase | Phase 2 - 성장 |
| 일정 | 3일 |
| 비고 | 스토리텔링 중심, 풀스크린 이미지, 감성적 디자인, framer-motion |

### 핵심 가치

**"나다움을 세상에 보여주는 단 하나의 페이지"**

- **자기소개 + 가치관 + 경력 스토리텔링**: 단순 이력이 아닌 "나의 이야기"를 전달
- **풀스크린 이미지 + 패럴렉스 스크롤**: 감성적이고 몰입감 있는 경험
- **가치관/철학 카드**: 자신의 핵심 가치를 시각적으로 표현
- **"나다움" 표현**: 포트폴리오나 이력서와 다른, 개인 브랜딩 특화 페이지

### 심리적 동기

| 동기 | 설명 |
|------|------|
| 자기표현 | "나는 누구인가"를 체계적으로 정리하고 세상에 공유 |
| 사회적 인정 | 나만의 브랜드 페이지를 통해 전문성과 정체성 확인 |

### 바이럴 전략

- SNS 프로필(인스타그램, 링크드인, 브런치) 링크로 자연 노출
- "내 브랜드 페이지 만들기" 콘텐츠로 MZ세대 바이럴
- 퍼스널 브랜딩 강연/워크숍에서 사례로 소개
- 감성적 디자인으로 스크린샷 공유 유도

---

## 2. AI 구현 프롬프트

```
당신은 시니어 풀스택 개발자입니다. 아래 명세에 따라 퍼스널 브랜드 홈페이지 템플릿을 구현하세요.

## 컨텍스트
- 프로젝트: Linkmap 원클릭 배포용 홈페이지 템플릿
- 템플릿명: 퍼스널 브랜드 (Personal Brand)
- 슬러그: personal-brand
- 레포: linkmap-templates/personal-brand/
- 타겟: MZ세대 전반 (퍼스널 브랜딩에 관심 있는 20~30대)
- 핵심 가치: 자기소개 + 가치관 + 경력 스토리텔링. "나다움"을 표현하는 페이지

## 기술 스택
- Framework: Next.js 16 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS v4
- Fonts: Pretendard (한글) + Inter (영문) via next/font
- Icons: Lucide React
- Animation: framer-motion (스크롤 기반 애니메이션)
- Dark Mode: next-themes (ThemeProvider + ThemeToggle)
- SEO: next/metadata + JSON-LD (Person schema)
- OG Image: @vercel/og (/api/og)
- Analytics: Google Analytics 4 (선택)
- Deploy: GitHub Pages (Fork 기반)

## 핵심 섹션 (8개)
1. 히어로: 풀스크린 배경 이미지 + 이름(큰 타이포, 72px) + 한줄 태그라인 + scroll indicator(아래 화살표 bounce 애니메이션). 이미지 위에 그라데이션 오버레이(어두운)로 텍스트 가독성 확보
2. My Story: 스토리텔링 형식 자기소개. 패럴렉스 스크롤 효과(배경 이미지 느리게, 텍스트 빠르게). 2~3개 문단, 큰 타이포그래피(24px), 여유로운 행간(1.8)
3. Values: 가치관/철학 3~4개 카드. 각 카드: 이모지/아이콘 + 키워드(bold, 24px) + 설명(16px). framer-motion stagger 페이드인 애니메이션. 그리드(모바일 1열, 데스크톱 2x2)
4. 경력/활동: 주요 경력 하이라이트 카드(3~5개). 각 카드: 연도 뱃지 + 제목 + 설명 + 이미지(선택). 세로 타임라인 or 가로 카드 스크롤
5. 갤러리: 활동 사진/이미지 그리드(모바일 2열, 데스크톱 3열). 이미지 호버 시 scale(1.05) + 캡션 오버레이
6. Blog/Writing: 최근 글/미디어 출연 목록. 각 항목: 날짜 + 제목 + 출처(브런치, 미디엄 등) + 외부 링크. 리스트 형태
7. Contact: 이메일 + SNS 링크(인스타, 링크드인, 브런치, 트위터). 큰 아이콘 + 텍스트. CTA("함께 이야기 나눠요" 같은 감성적 문구)
8. 푸터: "Powered by Linkmap" + 저작권 텍스트

## 디자인 스펙
- 컬러: 스토리텔링 중심 감성적 컬러. 기본: 뉴트럴(stone/zinc) + 워밍 악센트(rose-500 or amber-500)
- 다크모드: 딥 블랙(#0A0A0A) + 소프트 화이트 텍스트 + 워밍 악센트 유지
- 타이포: 히어로 이름 72px(모바일 48px), 스토리 본문 24px(모바일 18px), 키워드 24px. 큰 타이포 + 여유로운 행간(leading-relaxed ~ leading-loose)
- 풀스크린 이미지: min-h-screen, object-cover, 그라데이션 오버레이(from-black/60)
- 패럴렉스: framer-motion useScroll + useTransform으로 배경/전경 속도차
- 레이아웃: max-w-4xl, 넉넉한 여백(py-24~py-32)
- 반응형: 360px → 768px → 1024px → 1440px
- 스크롤 애니메이션: framer-motion의 whileInView로 섹션별 페이드인

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 이름
- NEXT_PUBLIC_TAGLINE: 한줄 태그라인
- NEXT_PUBLIC_HERO_IMAGE_URL: 풀스크린 히어로 배경 이미지 URL
- NEXT_PUBLIC_STORY: 자기소개 스토리 (텍스트 또는 마크다운, 여러 문단)
- NEXT_PUBLIC_VALUES (JSON): 가치관 목록 [{"icon":"Heart","keyword":"공감","desc":"..."}]
- NEXT_PUBLIC_HIGHLIGHTS (JSON): 경력 하이라이트 [{"year":"2024","title":"...","desc":"...","image":"url"}]
- NEXT_PUBLIC_GALLERY_IMAGES (JSON): 갤러리 이미지 URL 배열
- NEXT_PUBLIC_WRITINGS (JSON): 글/미디어 목록 [{"date":"2024.12","title":"...","source":"브런치","url":"..."}]
- NEXT_PUBLIC_EMAIL: 이메일 주소
- NEXT_PUBLIC_SOCIALS (JSON): SNS 링크 [{"platform":"instagram","url":"..."}]
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. 환경변수 미설정 시 가상의 퍼스널 브랜드 데모 데이터 표시
2. src/lib/config.ts에서 환경변수를 타입 안전하게 파싱
3. JSON 환경변수는 try-catch로 안전하게 파싱, 실패 시 기본값 사용
4. Lighthouse 4개 카테고리 모두 90+ 달성
5. JSON-LD에 Person 스키마 포함 (이름, 설명, SNS 프로필)
6. /api/og 엔드포인트로 이름 + 태그라인이 포함된 OG 이미지 생성
7. framer-motion은 next/dynamic으로 클라이언트 전용 로드 (SSR 안전)
8. prefers-reduced-motion 미디어 쿼리로 모션 감소 사용자 대응
9. 풀스크린 히어로 이미지는 next/image로 최적화 + priority로 LCP 개선
10. My Story 섹션은 마크다운 텍스트를 줄바꿈(\n)으로 문단 분리
11. 갤러리 이미지 호버 시 smooth scale 트랜지션
12. 모든 섹션에 whileInView 페이드인 애니메이션 적용 (stagger)
```

---

## 3. 핵심 섹션 정의

### 3.1 히어로 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 페이지 최상단, 풀스크린(min-h-screen) |
| 구성 | 풀스크린 배경 이미지(object-cover) + 그라데이션 오버레이(from-black/60 via-black/30 to-transparent) + 이름(h1, 72px, 중앙) + 태그라인(24px, 중앙) + scroll indicator(ChevronDown 아이콘, bounce 애니메이션) + 다크모드 토글(우측 상단, 절대 위치) |
| 인터랙션 | scroll indicator 클릭 시 다음 섹션으로 smooth scroll. 패럴렉스: 스크롤 시 배경 이미지가 0.5x 속도로 이동 |
| 데이터 | `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_TAGLINE`, `NEXT_PUBLIC_HERO_IMAGE_URL` |
| 기본값 | "김서진", "사람과 기술의 교차점에서", Unsplash 감성 이미지 |

### 3.2 My Story 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 히어로 아래 |
| 구성 | 섹션 제목("My Story", 작은 캡션 스타일) + 스토리 텍스트(2~3문단, 24px, leading-loose). 패럴렉스 배경 이미지(선택) |
| 인터랙션 | 패럴렉스 스크롤 효과 (framer-motion useScroll). 텍스트가 뷰포트 진입 시 페이드인 |
| 데이터 | `NEXT_PUBLIC_STORY` |
| 기본값 | 3문단 데모 스토리 ("저는 사람들의 이야기에 귀 기울이는 것을 좋아합니다...") |

### 3.3 Values 섹션

| 항목 | 설명 |
|------|------|
| 위치 | My Story 아래 |
| 구성 | 섹션 제목("What I Believe") + 가치관 카드 그리드(모바일 1열, 데스크톱 2x2). 각 카드: Lucide 아이콘(또는 이모지) + 키워드(24px, bold) + 설명(16px) |
| 인터랙션 | 카드 뷰포트 진입 시 stagger 페이드인 애니메이션 (framer-motion). 카드 호버 시 subtle scale(1.02) |
| 데이터 | `NEXT_PUBLIC_VALUES`(JSON) |
| 기본값 | 공감(Heart), 성장(TrendingUp), 진정성(Sparkles), 연결(Link) 4개 |

### 3.4 경력/활동 섹션

| 항목 | 설명 |
|------|------|
| 위치 | Values 아래 |
| 구성 | 섹션 제목("Highlights") + 경력 하이라이트 카드(3~5개). 각 카드: 연도 뱃지 + 제목 + 설명 + 이미지(선택). 세로 타임라인(왼쪽 라인 + 카드) |
| 인터랙션 | 각 카드 뷰포트 진입 시 좌측에서 슬라이드인 + 페이드인 |
| 데이터 | `NEXT_PUBLIC_HIGHLIGHTS`(JSON) |
| 기본값 | 3개 하이라이트 데모 (2024 프로젝트 리더, 2023 브런치 작가, 2022 대학 졸업) |

### 3.5 갤러리 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 경력/활동 아래 |
| 구성 | 섹션 제목("Moments") + 이미지 그리드(모바일 2열, 데스크톱 3열). aspect-square |
| 인터랙션 | 이미지 호버 시 scale(1.05) + 캡션 오버레이(하단에서 슬라이드업). 클릭 시 라이트박스(선택) |
| 데이터 | `NEXT_PUBLIC_GALLERY_IMAGES`(JSON) |
| 기본값 | Unsplash 감성 이미지 6장 |

### 3.6 Blog/Writing 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 갤러리 아래 |
| 구성 | 섹션 제목("Writing") + 글 목록. 각 항목: 날짜(작은 텍스트) + 제목(링크) + 출처 뱃지(브런치, 미디엄 등) |
| 인터랙션 | 제목 클릭 시 외부 URL 새 탭. 호버 시 밑줄 + 색상 변경 |
| 데이터 | `NEXT_PUBLIC_WRITINGS`(JSON) |
| 기본값 | 3개 글 데모 데이터 |
| 참고 | 목록이 비어있으면 섹션 자체를 숨김 |

### 3.7 Contact 섹션

| 항목 | 설명 |
|------|------|
| 위치 | Blog/Writing 아래 |
| 구성 | 감성적 CTA 문구("함께 이야기 나눠요") + 이메일 링크(큰 텍스트) + SNS 아이콘 바(인스타, 링크드인, 브런치, 트위터/X). 각 아이콘 48px |
| 인터랙션 | 이메일 클릭 시 mailto:, SNS 아이콘 클릭 시 외부 URL. 아이콘 호버 시 scale(1.1) + 색상 변경 |
| 데이터 | `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_SOCIALS`(JSON) |
| 기본값 | "hello@example.com" + 인스타/링크드인 데모 |

### 3.8 푸터

| 항목 | 설명 |
|------|------|
| 위치 | 페이지 최하단 |
| 구성 | "Powered by Linkmap" 링크 + 저작권 텍스트 (연도 + 이름) |
| 인터랙션 | Linkmap 링크 클릭 시 www.linkmap.biz로 이동 |
| 데이터 | `NEXT_PUBLIC_SITE_NAME` |
| 기본값 | "2026 김서진. Powered by Linkmap" |

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:----:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 이름 | O | `"김서진"` |
| `NEXT_PUBLIC_TAGLINE` | 한줄 태그라인 | | `"사람과 기술의 교차점에서"` |
| `NEXT_PUBLIC_HERO_IMAGE_URL` | 풀스크린 히어로 배경 이미지 URL | | Unsplash 감성 이미지 |
| `NEXT_PUBLIC_STORY` | 자기소개 스토리 (텍스트/마크다운) | | 3문단 데모 스토리 |
| `NEXT_PUBLIC_VALUES` | 가치관 목록 (JSON) | | 4개 가치 데모 |
| `NEXT_PUBLIC_HIGHLIGHTS` | 경력 하이라이트 (JSON) | | 3개 하이라이트 데모 |
| `NEXT_PUBLIC_GALLERY_IMAGES` | 갤러리 이미지 URL (JSON) | | Unsplash 이미지 6장 |
| `NEXT_PUBLIC_WRITINGS` | 글/미디어 목록 (JSON) | | 3개 글 데모 |
| `NEXT_PUBLIC_EMAIL` | 이메일 주소 | | `"hello@example.com"` |
| `NEXT_PUBLIC_SOCIALS` | SNS 링크 (JSON) | | 인스타+링크드인 데모 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | (미설정 시 비활성) |

---

## 5. 디자인 스펙

### 컬러 팔레트

| 용도 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경 (primary) | `#FAFAF9` (stone-50) | `#0A0A0A` (딥 블랙) |
| 배경 (card) | `#FFFFFF` | `#171717` (neutral-900) |
| 배경 (alt section) | `#F5F5F4` (stone-100) | `#141414` |
| 텍스트 (primary) | `#1C1917` (stone-900) | `#FAFAF9` (stone-50) |
| 텍스트 (secondary) | `#78716C` (stone-500) | `#A8A29E` (stone-400) |
| 텍스트 (muted) | `#A8A29E` (stone-400) | `#78716C` (stone-500) |
| 악센트 (primary) | `#F43F5E` (rose-500) | `#FB7185` (rose-400) |
| 악센트 (secondary) | `#F59E0B` (amber-500) | `#FBBF24` (amber-400) |
| 히어로 오버레이 | `from-black/60 via-black/30 to-transparent` | 동일 |
| 보더 | `#E7E5E4` (stone-200) | `#292524` (stone-800) |
| 연도 뱃지 | `#FFF1F2` (rose-50), 텍스트 `rose-600` | `#3B1520`, 텍스트 `rose-400` |

### 타이포그래피

| 요소 | 크기 | 굵기 | 비고 |
|------|------|------|------|
| 히어로 이름 (h1) | 72px (모바일 48px) | 800 | Pretendard, tracking-tight |
| 태그라인 | 24px (모바일 18px) | 300 | Pretendard, tracking-wide |
| 섹션 캡션 | 14px | 500 | Inter, uppercase, tracking-widest |
| 섹션 제목 (h2) | 36px (모바일 28px) | 700 | Pretendard |
| 스토리 본문 | 24px (모바일 18px) | 300 | Pretendard, leading-loose (1.8) |
| 가치 키워드 | 24px | 700 | Pretendard |
| 가치 설명 | 16px | 400 | Pretendard, leading-relaxed |
| 하이라이트 제목 | 20px | 700 | Pretendard |
| 글 제목 | 18px | 500 | Pretendard |
| 날짜/캡션 | 14px | 400 | Inter |

### 레이아웃

- **컨테이너**: `max-w-4xl` (896px) - 스토리텔링 적합 너비
- **히어로**: `min-h-screen`, `relative`, 풀스크린
- **섹션 간격**: `py-24` ~ `py-32` (96~128px) - 넉넉한 여백
- **Values 그리드**: `grid-cols-1 md:grid-cols-2`, `gap-8`
- **갤러리 그리드**: `grid-cols-2 md:grid-cols-3`, `gap-2`, `aspect-square`
- **카드 라운드**: `rounded-2xl` (16px)
- **카드 그림자**: `shadow-sm` (호버 시 `shadow-md`)
- **스크롤 인디케이터**: 하단 중앙, `animate-bounce`

### 반응형 브레이크포인트

| 브레이크포인트 | 너비 | 레이아웃 변화 |
|------------|------|------------|
| 모바일 | 360px+ | 싱글 컬럼, Values 1열, 갤러리 2열, 스토리 18px |
| 태블릿 | 768px+ | Values 2x2, 갤러리 3열, 스토리 24px |
| 데스크톱 | 1024px+ | max-w-4xl 중앙, 히어로 72px |
| 와이드 | 1440px+ | 동일 (과도한 확장 방지) |

### 애니메이션 스펙

| 애니메이션 | 트리거 | 속성 | 지속시간 |
|----------|--------|------|---------|
| 히어로 페이드인 | 페이지 로드 | opacity: 0→1, y: 20→0 | 0.8s |
| 스크롤 인디케이터 | 항상 | bounce (translateY 반복) | 1.5s infinite |
| 패럴렉스 (My Story) | 스크롤 | 배경 이미지 y축 0.5x 속도 | 연속 |
| Values 카드 stagger | whileInView | opacity: 0→1, y: 30→0, stagger 0.1s | 0.5s each |
| 하이라이트 슬라이드인 | whileInView | opacity: 0→1, x: -30→0 | 0.6s |
| 갤러리 이미지 호버 | hover | scale: 1→1.05 | 0.3s |
| Contact 아이콘 호버 | hover | scale: 1→1.1 | 0.2s |
| reduced-motion | prefers-reduced-motion | 모든 애니메이션 비활성화 | - |

---

## 6. 컴포넌트 구조

### 파일 트리

```
linkmap-templates/personal-brand/
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   └── images/
│       ├── hero-default.jpg
│       └── gallery/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트, 테마, GA
│   │   ├── page.tsx                # 메인 페이지 (섹션 조합)
│   │   └── api/
│   │       └── og/
│   │           └── route.tsx       # OG 이미지 (이름+태그라인)
│   ├── components/
│   │   ├── hero-section.tsx        # 풀스크린 히어로 (이미지+이름+태그)
│   │   ├── scroll-indicator.tsx    # 스크롤 다운 화살표 (bounce)
│   │   ├── story-section.tsx       # My Story (패럴렉스+큰 텍스트)
│   │   ├── values-section.tsx      # 가치관 카드 그리드
│   │   ├── value-card.tsx          # 개별 가치관 카드
│   │   ├── highlights-section.tsx  # 경력 하이라이트 타임라인
│   │   ├── highlight-card.tsx      # 개별 하이라이트 카드
│   │   ├── gallery-section.tsx     # 이미지 갤러리 그리드
│   │   ├── writings-section.tsx    # 글/미디어 목록
│   │   ├── writing-item.tsx        # 개별 글 아이템
│   │   ├── contact-section.tsx     # 이메일+SNS 링크
│   │   ├── social-icon.tsx         # 플랫폼별 SNS 아이콘
│   │   ├── footer.tsx              # 푸터 (Powered by Linkmap)
│   │   ├── section-wrapper.tsx     # whileInView 애니메이션 래퍼
│   │   ├── theme-toggle.tsx        # 다크모드 토글
│   │   └── theme-provider.tsx      # next-themes Provider
│   └── lib/
│       ├── config.ts               # 환경변수 파싱 + 타입 + 기본값
│       ├── constants.ts            # 기본 데모 데이터 상수
│       └── motion.ts               # framer-motion 유틸 (reduced-motion 감지)
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### 컴포넌트 역할

| 컴포넌트 | 파일 | 역할 | Props |
|---------|------|------|-------|
| HeroSection | `hero-section.tsx` | 풀스크린 배경+이름+태그라인+스크롤 인디케이터 | `name`, `tagline`, `heroImageUrl` |
| ScrollIndicator | `scroll-indicator.tsx` | 하단 스크롤 유도 화살표 (bounce) | `targetId` |
| StorySection | `story-section.tsx` | 패럴렉스 스토리텔링 텍스트 | `story` |
| ValuesSection | `values-section.tsx` | 가치관 카드 그리드 컨테이너 | `values` |
| ValueCard | `value-card.tsx` | 개별 가치관 카드 (아이콘+키워드+설명) | `icon`, `keyword`, `description` |
| HighlightsSection | `highlights-section.tsx` | 경력 하이라이트 타임라인 | `highlights` |
| HighlightCard | `highlight-card.tsx` | 개별 하이라이트 카드 (연도+제목+설명) | `year`, `title`, `desc`, `image` |
| GallerySection | `gallery-section.tsx` | 이미지 그리드 + 호버 효과 | `images` |
| WritingsSection | `writings-section.tsx` | 글/미디어 목록 컨테이너 | `writings` |
| WritingItem | `writing-item.tsx` | 개별 글 아이템 (날짜+제목+출처) | `date`, `title`, `source`, `url` |
| ContactSection | `contact-section.tsx` | 이메일+SNS 링크 CTA | `email`, `socials` |
| SocialIcon | `social-icon.tsx` | 플랫폼별 SNS 아이콘 렌더링 | `platform`, `url` |
| Footer | `footer.tsx` | Powered by Linkmap + 저작권 | `name` |
| SectionWrapper | `section-wrapper.tsx` | whileInView 페이드인 래퍼 | `children`, `delay` |
| ThemeToggle | `theme-toggle.tsx` | 다크모드 토글 버튼 | - |
| ThemeProvider | `theme-provider.tsx` | next-themes Provider 래퍼 | `children` |

---

## 7. 시드 데이터

### 7.1 SQL INSERT

```sql
-- Phase 2: 퍼스널 브랜드 템플릿
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0010-4000-9000-000000000010',
  'personal-brand',
  'Personal Brand',
  '퍼스널 브랜드',
  'Storytelling-driven personal branding page with fullscreen hero, parallax scroll, values showcase, and framer-motion animations. Express your identity.',
  '풀스크린 히어로, 패럴렉스 스크롤, 가치관 쇼케이스, framer-motion 애니메이션을 갖춘 스토리텔링 중심 퍼스널 브랜딩 페이지. 나다움을 표현하세요.',
  NULL,
  'linkmap-templates', 'personal-brand', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "이름", "required": true},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "한줄 태그라인", "required": false},
    {"key": "NEXT_PUBLIC_HERO_IMAGE_URL", "description": "풀스크린 히어로 배경 이미지 URL", "required": false},
    {"key": "NEXT_PUBLIC_STORY", "description": "자기소개 스토리 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_VALUES", "description": "가치관 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_HIGHLIGHTS", "description": "경력 하이라이트 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GALLERY_IMAGES", "description": "갤러리 이미지 URL JSON 배열", "required": false},
    {"key": "NEXT_PUBLIC_WRITINGS", "description": "글/미디어 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "이메일 주소", "required": false},
    {"key": "NEXT_PUBLIC_SOCIALS", "description": "SNS 링크 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['personal-brand', 'storytelling', 'mz-generation', 'identity', 'fullscreen', 'nextjs'],
  false, true, 10
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
  PERSONAL_BRAND: 'b2c3d4e5-0010-4000-9000-000000000010',
};

// homepageTemplates 배열에 추가:
{
  id: TEMPLATE_IDS.PERSONAL_BRAND,
  slug: 'personal-brand',
  name: 'Personal Brand',
  name_ko: '퍼스널 브랜드',
  description: 'Storytelling-driven personal branding page with fullscreen hero, parallax scroll, values showcase, and framer-motion animations. Express your identity.',
  description_ko: '풀스크린 히어로, 패럴렉스 스크롤, 가치관 쇼케이스, framer-motion 애니메이션을 갖춘 스토리텔링 중심 퍼스널 브랜딩 페이지. 나다움을 표현하세요.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'personal-brand',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '이름', required: true },
    { key: 'NEXT_PUBLIC_TAGLINE', description: '한줄 태그라인', required: false },
    { key: 'NEXT_PUBLIC_HERO_IMAGE_URL', description: '풀스크린 히어로 배경 이미지 URL', required: false },
    { key: 'NEXT_PUBLIC_STORY', description: '자기소개 스토리 텍스트', required: false },
    { key: 'NEXT_PUBLIC_VALUES', description: '가치관 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_HIGHLIGHTS', description: '경력 하이라이트 JSON', required: false },
    { key: 'NEXT_PUBLIC_GALLERY_IMAGES', description: '갤러리 이미지 URL JSON 배열', required: false },
    { key: 'NEXT_PUBLIC_WRITINGS', description: '글/미디어 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_EMAIL', description: '이메일 주소', required: false },
    { key: 'NEXT_PUBLIC_SOCIALS', description: 'SNS 링크 JSON', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['personal-brand', 'storytelling', 'mz-generation', 'identity', 'fullscreen', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 10,
}
```

---

## 8. 검증 체크리스트

### 기능 검증

- [ ] 환경변수 미설정 시 가상의 퍼스널 브랜드 데모 데이터가 올바르게 표시됨
- [ ] `NEXT_PUBLIC_SITE_NAME` 설정 시 이름이 모든 위치에 반영됨
- [ ] 히어로 풀스크린 이미지가 object-cover로 올바르게 표시됨
- [ ] 히어로 그라데이션 오버레이로 텍스트 가독성 확보됨
- [ ] scroll indicator 클릭 시 다음 섹션으로 smooth scroll
- [ ] My Story 텍스트가 줄바꿈(\n)으로 올바르게 문단 분리됨
- [ ] 패럴렉스 스크롤 효과가 동작함 (배경 이미지 0.5x 속도)
- [ ] Values 카드가 모바일 1열, 데스크톱 2x2로 표시됨
- [ ] Values 카드 stagger 페이드인 애니메이션 동작
- [ ] 경력 하이라이트가 연도 뱃지와 함께 타임라인으로 표시됨
- [ ] 갤러리 이미지 호버 시 scale(1.05) + 캡션 오버레이 동작
- [ ] Blog/Writing 목록이 올바르게 표시됨 (날짜+제목+출처)
- [ ] 글 목록 비어있을 때 Writing 섹션이 숨겨짐
- [ ] Contact SNS 아이콘이 올바른 플랫폼 링크로 연결됨
- [ ] 이메일 링크 클릭 시 mailto: 동작
- [ ] 다크모드 토글이 정상 동작하고 모든 섹션에 적용됨
- [ ] 다크모드에서 히어로 오버레이가 자연스럽게 보임
- [ ] JSON 환경변수가 잘못된 형식일 때 기본값으로 폴백
- [ ] OG 이미지(`/api/og`)에 이름과 태그라인이 포함됨
- [ ] 푸터에 연도 + 이름 + "Powered by Linkmap" 표시

### 성능 검증

- [ ] Lighthouse Performance 점수 90+
- [ ] Lighthouse Best Practices 점수 90+
- [ ] First Contentful Paint < 1.5초
- [ ] Largest Contentful Paint < 2.5초 (풀스크린 히어로 이미지 priority 적용)
- [ ] Cumulative Layout Shift < 0.1
- [ ] framer-motion 번들이 클라이언트 전용으로 로드됨 (SSR 안전)
- [ ] 히어로 이미지 next/image + priority로 LCP 최적화
- [ ] 갤러리 이미지 lazy loading 확인
- [ ] 번들 사이즈 300KB 미만 (gzip, framer-motion 포함)

### 접근성 검증

- [ ] Lighthouse Accessibility 점수 90+
- [ ] 키보드만으로 모든 인터랙션 가능 (탭 순서, Enter/Space)
- [ ] 스크린리더로 모든 콘텐츠 접근 가능
- [ ] 이미지에 적절한 alt 텍스트
- [ ] 히어로 배경 이미지 위 텍스트 대비 4.5:1 이상
- [ ] 색상 대비 WCAG 2.1 AA 준수
- [ ] `prefers-reduced-motion` 시 모든 애니메이션 비활성화됨
- [ ] scroll indicator에 적절한 aria-label
- [ ] `lang="ko"` 속성 설정됨

### SEO 검증

- [ ] Lighthouse SEO 점수 90+
- [ ] `<title>` 태그에 이름 + 태그라인 포함
- [ ] meta description에 스토리 요약 포함
- [ ] JSON-LD Person 스키마 포함 (이름, 설명, SNS 프로필)
- [ ] OG 메타태그 (og:title, og:description, og:image) 설정
- [ ] 인스타그램/링크드인 공유 시 OG 이미지 정상 표시
- [ ] `robots.txt` 생성됨
- [ ] `sitemap.xml` 생성됨
