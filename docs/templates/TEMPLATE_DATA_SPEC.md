# Linkmap 템플릿 데이터 필드 명세

> 이 문서는 6개 활성 템플릿의 **모든 커스터마이즈 가능한 데이터 필드**를 정리합니다.
> 사용자가 환경변수 설정 시 참고하는 **커스터마이즈 가이드** 역할을 합니다.
>
> 디자인 스펙은 → `RESPONSIVE_TEMPLATE_SPECS.md`
> TypeScript 인터페이스 + 샘플 데이터 → `src/data/template-sample-content.ts`
>
> **구현 상태** (2026-02-19): 6개 전체 코드 구현 완료
>
> | 템플릿 | 코드 파일 | 파일 수 |
> |--------|-----------|---------|
> | link-in-bio-pro | `homepage-template-content.ts` (인라인) | 19 |
> | digital-namecard | `homepage-template-content.ts` (인라인) | 20 |
> | dev-showcase | `dev-showcase-template.ts` | 23 |
> | personal-brand | `personal-brand-template.ts` | 21 |
> | freelancer-page | `freelancer-page-template.ts` | 21 |
> | small-biz | `small-biz-template.ts` | 22 |

## 목차

1. [나만의 홈페이지 (personal-brand)](#1-나만의-홈페이지-personal-brand)
2. [디지털 명함 (digital-namecard)](#2-디지털-명함-digital-namecard)
3. [개발자 쇼케이스 (dev-showcase)](#3-개발자-쇼케이스-dev-showcase)
4. [포트폴리오 (freelancer-page)](#4-포트폴리오-freelancer-page)
5. [우리가게 홍보 (small-biz)](#5-우리가게-홍보-small-biz)
6. [SNS 링크허브 (link-in-bio-pro)](#6-sns-링크허브-link-in-bio-pro)
7. [공통 이미지 스펙](#7-공통-이미지-스펙)

---

## 1. 나만의 홈페이지 (personal-brand)

**slug**: `personal-brand` | **display_order**: 1 | **타겟**: 누구나 (MZ세대 퍼스널 브랜딩)

### 데이터 필드

| 필드명 | 환경변수 | 타입 | 필수 | 설명 | 예시(ko) | 예시(en) |
|--------|----------|------|------|------|----------|----------|
| 이름 | `NEXT_PUBLIC_SITE_NAME` | string | ✅ | 메인 이름 | 이지원 | Alex Chen |
| 태그라인 | `NEXT_PUBLIC_TAGLINE` | string | - | 한줄 소개 | 콘텐츠로 세상을 연결하는 크리에이터 | Journalist who turns data into stories |
| 히어로 배경 | `NEXT_PUBLIC_HERO_IMAGE_URL` | string (URL) | - | 풀스크린 히어로 배경 이미지 | (이미지 URL) | (이미지 URL) |
| 스토리 | `NEXT_PUBLIC_STORY` | string | - | 자기소개 (3-5문장) | 안녕하세요, 저는 이지원입니다... | Hi, I'm Alex Chen... |
| 가치관 | `NEXT_PUBLIC_VALUES` | JSON array | - | 가치관 카드 목록 (3개 권장) | [아래 스키마 참조] | [아래 스키마 참조] |
| 하이라이트 | `NEXT_PUBLIC_HIGHLIGHTS` | JSON array | - | 숫자 통계 (3개 권장) | [아래 스키마 참조] | [아래 스키마 참조] |
| 갤러리 | `NEXT_PUBLIC_GALLERY_IMAGES` | JSON array | - | 갤러리 이미지 URL 배열 | ["url1","url2","url3"] | ["url1","url2","url3"] |
| 글/미디어 | `NEXT_PUBLIC_WRITINGS` | JSON array | - | 외부 글/미디어 링크 목록 | [아래 스키마 참조] | [아래 스키마 참조] |
| 이메일 | `NEXT_PUBLIC_EMAIL` | string | - | 연락 이메일 | hello@jiwonlee.kr | alex@alexchendata.com |
| SNS | `NEXT_PUBLIC_SOCIALS` | JSON array | - | 소셜 미디어 링크 | [아래 스키마 참조] | [아래 스키마 참조] |
| GA ID | `NEXT_PUBLIC_GA_ID` | string | - | Google Analytics 4 ID | G-XXXXXXXXXX | G-XXXXXXXXXX |

### JSON 스키마

#### VALUES (가치관)
```json
[
  {
    "emoji": "✦",
    "titleKo": "진정성",
    "titleEn": "Authenticity",
    "descKo": "광고처럼 느껴지지 않는 콘텐츠. 내가 직접 써봤거나 믿는 것만 이야기합니다.",
    "descEn": "Content that never feels like an ad — I only talk about things I've personally used or believe in."
  }
]
```

#### HIGHLIGHTS (하이라이트)
```json
[
  {
    "labelKo": "구독자 합산",
    "labelEn": "Total Subscribers",
    "valueKo": "84,000+",
    "valueEn": "84,000+"
  }
]
```

#### WRITINGS (글/미디어)
```json
[
  {
    "titleKo": "글 제목",
    "titleEn": "Article Title",
    "url": "https://example.com/article",
    "platform": "youtube"
  }
]
```

#### SOCIALS (SNS)
```json
[
  { "platform": "youtube", "url": "https://youtube.com/@jiwonlee" },
  { "platform": "instagram", "url": "https://instagram.com/jiwon.creates" },
  { "platform": "twitter", "url": "https://twitter.com/jiwonlee_kr" }
]
```
> 지원 플랫폼: `youtube`, `instagram`, `twitter`, `linkedin`, `github`, `facebook`, `tiktok`

### 컴포넌트 구조 (8개)

| # | 컴포넌트 | 섹션 | 주요 환경변수 |
|---|----------|------|-------------|
| 1 | hero-section | 풀스크린 히어로 | SITE_NAME, TAGLINE, HERO_IMAGE_URL |
| 2 | about-section | 프로필 + 스토리 | STORY, AVATAR (향후) |
| 3 | values-section | 가치관 3카드 | VALUES |
| 4 | highlights-section | 숫자 통계 | HIGHLIGHTS |
| 5 | gallery-section | 이미지 갤러리 | GALLERY_IMAGES |
| 6 | contact-section | 연락처 + SNS | EMAIL, SOCIALS |
| 7 | footer | 저작권 | SITE_NAME |
| 8 | theme-toggle | 다크/라이트 전환 | (내장) |

---

## 2. 디지털 명함 (digital-namecard)

**slug**: `digital-namecard` | **display_order**: 2 | **타겟**: 직장인/프리랜서

### 데이터 필드

| 필드명 | 환경변수 | 타입 | 필수 | 설명 | 예시(ko) | 예시(en) |
|--------|----------|------|------|------|----------|----------|
| 이름 | `NEXT_PUBLIC_SITE_NAME` | string | ✅ | 이름 | 박소연 | James Whitfield |
| 직함 | `NEXT_PUBLIC_TITLE` | string | - | 직책/직함 | 브랜드 디자인 리드 | Senior Product Manager |
| 회사명 | `NEXT_PUBLIC_COMPANY` | string | - | 회사/조직명 | 스튜디오 모놀로그 | Neonloop Inc. |
| 이메일 | `NEXT_PUBLIC_EMAIL` | string | - | 이메일 주소 | soyeon@monologue.studio | james@neonloop.io |
| 전화번호 | `NEXT_PUBLIC_PHONE` | string | - | 전화번호 | 010-4512-8820 | +1 (415) 820-3377 |
| 주소 | `NEXT_PUBLIC_ADDRESS` | string | - | 사무실/회사 주소 | 서울특별시 마포구 와우산로 94, 3층 | 340 Pine St, Suite 800, SF |
| 웹사이트 | `NEXT_PUBLIC_WEBSITE` | string (URL) | - | 웹사이트 URL | https://monologue.studio | https://jameswhitfield.pm |
| SNS | `NEXT_PUBLIC_SOCIALS` | JSON array | - | 소셜 미디어 링크 | [아래 스키마 참조] | [아래 스키마 참조] |
| 프로필 이미지 | `NEXT_PUBLIC_AVATAR_URL` | string (URL) | - | 프로필 사진 URL | (이미지 URL) | (이미지 URL) |
| 액센트 컬러 | `NEXT_PUBLIC_ACCENT_COLOR` | string (hex) | - | 상단 바 / 강조 색상 | #e8553e | #0ea5e9 |
| GA ID | `NEXT_PUBLIC_GA_ID` | string | - | Google Analytics 4 ID | G-XXXXXXXXXX | G-XXXXXXXXXX |

### JSON 스키마

#### SOCIALS (SNS)
```json
[
  { "platform": "instagram", "url": "https://instagram.com/soyeon.design" },
  { "platform": "linkedin", "url": "https://linkedin.com/in/soyeonpark-design" }
]
```

### 컴포넌트 구조 (6개)

| # | 컴포넌트 | 섹션 | 주요 환경변수 |
|---|----------|------|-------------|
| 1 | accent-bar | 상단 액센트 바 | ACCENT_COLOR |
| 2 | profile-section | 아바타 + 이름 + 직함 | SITE_NAME, TITLE, COMPANY, AVATAR_URL |
| 3 | contact-list | 연락처 목록 | EMAIL, PHONE, ADDRESS, WEBSITE |
| 4 | social-icons | SNS 아이콘 행 | SOCIALS |
| 5 | qr-section | QR 코드 + vCard 다운로드 | (모든 연락처 데이터로 자동 생성) |
| 6 | save-contact-cta | "연락처 저장" 버튼 | (vCard 다운로드 트리거) |

---

## 3. 개발자 쇼케이스 (dev-showcase)

**slug**: `dev-showcase` | **display_order**: 3 | **타겟**: 개발자

### 데이터 필드

| 필드명 | 환경변수 | 타입 | 필수 | 설명 | 예시(ko) | 예시(en) |
|--------|----------|------|------|------|----------|----------|
| 이름 | `NEXT_PUBLIC_SITE_NAME` | string | ✅ | 이름 | 김태양 | Sofia Marchetti |
| GitHub 사용자명 | `NEXT_PUBLIC_GITHUB_USERNAME` | string | - | GitHub ID | taeyang-dev | sofiamdev |
| 태그라인 | `NEXT_PUBLIC_TAGLINE` | string | - | 한줄 소개 | 백엔드 엔지니어 · 오픈소스 기여자 | Full-Stack Developer · UI/UX Enthusiast |
| 자기소개 | `NEXT_PUBLIC_ABOUT` | string | - | 상세 소개 텍스트 | 분산 시스템과 고성능 API에 빠진... | I love crafting beautiful UX... |
| 기술 스택 | `NEXT_PUBLIC_SKILLS` | JSON array | - | 스킬 목록 + 레벨 | [아래 스키마 참조] | [아래 스키마 참조] |
| 경력 | `NEXT_PUBLIC_EXPERIENCE` | JSON array | - | 경력 타임라인 | [아래 스키마 참조] | [아래 스키마 참조] |
| 블로그 글 | `NEXT_PUBLIC_BLOG_POSTS` | JSON array | - | 블로그 게시글 목록 | [아래 스키마 참조] | [아래 스키마 참조] |
| 이력서 URL | `NEXT_PUBLIC_RESUME_URL` | string (URL) | - | PDF 이력서 링크 | (PDF URL) | (PDF URL) |
| 이메일 | `NEXT_PUBLIC_EMAIL` | string | - | 연락 이메일 | taeyang@dev.kr | sofia@marchetti.dev |
| LinkedIn URL | `NEXT_PUBLIC_LINKEDIN_URL` | string (URL) | - | LinkedIn 프로필 | (URL) | (URL) |
| GA ID | `NEXT_PUBLIC_GA_ID` | string | - | Google Analytics 4 ID | G-XXXXXXXXXX | G-XXXXXXXXXX |

### JSON 스키마

#### SKILLS (기술 스택)
```json
[
  { "name": "Go", "level": "advanced" },
  { "name": "Rust", "level": "advanced" },
  { "name": "TypeScript", "level": "advanced" },
  { "name": "PostgreSQL", "level": "advanced" },
  { "name": "Redis", "level": "intermediate" },
  { "name": "Kubernetes", "level": "intermediate" },
  { "name": "Terraform", "level": "beginner" }
]
```
> level 값: `"beginner"` | `"intermediate"` | `"advanced"`

#### EXPERIENCE (경력)
```json
[
  {
    "title": "백엔드 엔지니어 (시니어)",
    "titleEn": "Senior Backend Engineer",
    "company": "크래프톤",
    "companyEn": "Krafton",
    "period": "2022 - 현재",
    "periodEn": "2022 - Present",
    "description": "Go 기반 게임 서버 API 플랫폼 설계 및 개발.",
    "descriptionEn": "Designed and developed Go-based game server API platform."
  }
]
```

#### BLOG_POSTS (블로그 글)
```json
[
  {
    "title": "Go 동시성 패턴 완벽 가이드",
    "titleEn": "Complete Guide to Go Concurrency Patterns",
    "url": "https://blog.example.com/go-concurrency",
    "date": "2026-01-15",
    "excerpt": "goroutine과 channel을 활용한..."
  }
]
```

### 컴포넌트 구조 (9개)

| # | 컴포넌트 | 섹션 | 주요 환경변수 |
|---|----------|------|-------------|
| 1 | terminal-header | 터미널 스타일 히어로 | SITE_NAME, TAGLINE |
| 2 | nav-bar | 네비게이션 (데스크톱 인라인 / 모바일 햄버거) | (내장) |
| 3 | github-section | GitHub 기여 그래프 | GITHUB_USERNAME |
| 4 | projects-section | 프로젝트 카드 그리드 | GITHUB_USERNAME (API 연동) |
| 5 | skills-section | 기술 스택 진행바/태그 | SKILLS |
| 6 | experience-timeline | 경력 타임라인 | EXPERIENCE |
| 7 | blog-section | 블로그 글 목록 | BLOG_POSTS |
| 8 | contact-section | 연락처 + 소셜 | EMAIL, LINKEDIN_URL |
| 9 | footer | 저작권 | SITE_NAME |

---

## 4. 포트폴리오 (freelancer-page)

**slug**: `freelancer-page` | **display_order**: 4 | **타겟**: 디자이너/작가/프리랜서

### 데이터 필드

| 필드명 | 환경변수 | 타입 | 필수 | 설명 | 예시(ko) | 예시(en) |
|--------|----------|------|------|------|----------|----------|
| 사이트 이름 | `NEXT_PUBLIC_SITE_NAME` | string | ✅ | 사이트/브랜드명 | 정하은 디자인 | Marcus Webb Design |
| 이름 | `NEXT_PUBLIC_TITLE` | string | - | 이름 | 정하은 | Marcus Webb |
| 태그라인 | `NEXT_PUBLIC_TAGLINE` | string | - | 전문 분야 한 줄 | 브랜드의 이야기를 시각으로 풀어내는 그래픽 디자이너 | UX/UI Designer & Brand Strategist |
| 프로필 사진 | `NEXT_PUBLIC_AVATAR_URL` | string (URL) | - | 프로필 사진 | (이미지 URL) | (이미지 URL) |
| 서비스 | `NEXT_PUBLIC_SERVICES` | JSON array | - | 서비스 목록 (3개 권장) | [아래 스키마 참조] | [아래 스키마 참조] |
| 포트폴리오 | `NEXT_PUBLIC_PORTFOLIO` | JSON array | - | 작품 목록 | [아래 스키마 참조] | [아래 스키마 참조] |
| 후기 | `NEXT_PUBLIC_TESTIMONIALS` | JSON array | - | 클라이언트 후기 | [아래 스키마 참조] | [아래 스키마 참조] |
| 경력 | `NEXT_PUBLIC_EXPERIENCE` | JSON array | - | 경력/자격 | [아래 스키마 참조] | [아래 스키마 참조] |
| 프로세스 | `NEXT_PUBLIC_PROCESS` | JSON array | - | 업무 프로세스 (4단계) | [아래 스키마 참조] | [아래 스키마 참조] |
| 이메일 | `NEXT_PUBLIC_EMAIL` | string | - | 문의 이메일 | haeun@jung-design.kr | hello@marcuswebb.design |
| SNS | `NEXT_PUBLIC_SOCIALS` | JSON array | - | 소셜 미디어 링크 | [아래 스키마 참조] | [아래 스키마 참조] |
| GA ID | `NEXT_PUBLIC_GA_ID` | string | - | Google Analytics 4 ID | G-XXXXXXXXXX | G-XXXXXXXXXX |

### JSON 스키마

#### SERVICES (서비스)
```json
[
  {
    "titleKo": "브랜드 아이덴티티",
    "titleEn": "Brand Identity",
    "descKo": "로고부터 컬러 팔레트, 타이포그래피까지 — 브랜드의 첫인상을 완성합니다.",
    "descEn": "From logo to color palette and typography — creating your brand's first impression.",
    "priceKo": "₩350만 ~",
    "priceEn": "From $2,600",
    "icon": "palette"
  }
]
```
> icon 값: Lucide React 아이콘명 (`palette`, `package`, `image`, `layout`, `zap`, `component` 등)

#### PORTFOLIO (포트폴리오)
```json
[
  {
    "titleKo": "하루마 커피 리브랜딩",
    "titleEn": "Haruma Coffee Rebranding",
    "categoryKo": "브랜드 아이덴티티",
    "categoryEn": "Brand Identity",
    "descKo": "성수 스페셜티 카페의 브랜드 전면 개편.",
    "descEn": "Complete brand overhaul for a Seongsu specialty cafe.",
    "imageUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600",
    "tags": ["로고", "패키지", "브랜딩"]
  }
]
```

#### TESTIMONIALS (후기)
```json
[
  {
    "authorKo": "강민준",
    "authorEn": "Minjun Kang",
    "roleKo": "대표",
    "roleEn": "CEO",
    "companyKo": "하루마 커피",
    "companyEn": "Haruma Coffee",
    "contentKo": "브랜드 방향을 제대로 잡아주셨어요...",
    "contentEn": "She nailed our brand direction exactly...",
    "rating": 5
  }
]
```
> rating: 1-5 (정수, 별점 표시)

#### EXPERIENCE (경력/자격)
```json
[
  {
    "titleKo": "수석 디자이너",
    "titleEn": "Lead Designer",
    "companyKo": "스튜디오 모놀로그",
    "companyEn": "Studio Monologue",
    "periodKo": "2020 - 현재",
    "periodEn": "2020 - Present"
  }
]
```

#### PROCESS (업무 프로세스)
```json
[
  {
    "number": "01",
    "titleKo": "킥오프 미팅",
    "titleEn": "Kickoff Meeting",
    "descKo": "브리프 공유, 레퍼런스 수집, 방향성 합의.",
    "descEn": "Share brief, gather references, align on direction."
  }
]
```

#### SOCIALS (SNS)
```json
[
  { "platform": "instagram", "url": "https://instagram.com/haeun.design" },
  { "platform": "linkedin", "url": "https://linkedin.com/in/haeunju" }
]
```

### 컴포넌트 구조 (9개)

| # | 컴포넌트 | 섹션 | 주요 환경변수 |
|---|----------|------|-------------|
| 1 | hero-section | 프로필 + 이름 + 태그라인 | TITLE, TAGLINE, AVATAR_URL |
| 2 | services-section | 서비스 3열 카드 | SERVICES |
| 3 | portfolio-section | 포트폴리오 그리드 | PORTFOLIO |
| 4 | portfolio-filter | 카테고리 필터 탭 | (PORTFOLIO 카테고리에서 자동 추출) |
| 5 | testimonials-section | 클라이언트 후기 카드 | TESTIMONIALS |
| 6 | experience-section | 경력/자격 | EXPERIENCE |
| 7 | process-section | 업무 프로세스 4단계 | PROCESS |
| 8 | contact-section | 문의 폼 + 이메일 | EMAIL |
| 9 | footer | 소셜 + 저작권 | SOCIALS, SITE_NAME |

---

## 5. 우리가게 홍보 (small-biz)

**slug**: `small-biz` | **display_order**: 5 | **타겟**: 소상공인 (카페/음식점/미용실)

### 데이터 필드

| 필드명 | 환경변수 | 타입 | 필수 | 설명 | 예시(ko) | 예시(en) |
|--------|----------|------|------|------|----------|----------|
| 가게 이름 | `NEXT_PUBLIC_SITE_NAME` | string | ✅ | 가게/비즈니스 이름 | 온기 베이커리 | Fortuna Pizza & Pasta |
| 소개 | `NEXT_PUBLIC_DESCRIPTION` | string | - | 한줄 소개 문구 | 매일 아침 직접 구운 빵... | Experience authentic Neapolitan... |
| 전화번호 | `NEXT_PUBLIC_PHONE` | string | - | 전화번호 (클릭 투 콜) | 02-334-5870 | +1 (212) 555-0192 |
| 주소 | `NEXT_PUBLIC_ADDRESS` | string | - | 가게 주소 | 서울 마포구 연남동 239-10 | 47 Mulberry St, New York |
| 카카오맵 ID | `NEXT_PUBLIC_KAKAO_MAP_ID` | string | - | 카카오맵 장소 ID | 1234567890 | (한국 시장 전용) |
| 영업시간 | `NEXT_PUBLIC_BUSINESS_HOURS` | JSON array | - | 요일별 영업시간 | [아래 스키마 참조] | [아래 스키마 참조] |
| 메뉴 | `NEXT_PUBLIC_MENU_ITEMS` | JSON array | - | 메뉴 목록 | [아래 스키마 참조] | [아래 스키마 참조] |
| 갤러리 | `NEXT_PUBLIC_GALLERY_IMAGES` | JSON array | - | 가게/음식 사진 URL 배열 | ["url1","url2",...] | ["url1","url2",...] |
| 인스타그램 | `NEXT_PUBLIC_INSTAGRAM_URL` | string (URL) | - | 인스타그램 URL | https://instagram.com/ongi_bakery | https://instagram.com/fortuna_nyc |
| 네이버 블로그 | `NEXT_PUBLIC_NAVER_BLOG_URL` | string (URL) | - | 네이버 블로그 URL | https://blog.naver.com/ongibakery | (한국 시장 전용) |
| 카카오 채널 | `NEXT_PUBLIC_KAKAO_CHANNEL` | string (URL) | - | 카카오 채널 URL | https://pf.kakao.com/_ongibakery | (한국 시장 전용) |
| GA ID | `NEXT_PUBLIC_GA_ID` | string | - | Google Analytics 4 ID | G-XXXXXXXXXX | G-XXXXXXXXXX |

### JSON 스키마

#### MENU_ITEMS (메뉴)
```json
[
  {
    "nameKo": "르방 깜빠뉴",
    "nameEn": "Levain Campagne",
    "descKo": "72시간 발효 천연 르방 식빵. 촉촉하고 쫀쫀한 식감.",
    "descEn": "72-hour fermented sourdough. Moist, chewy texture.",
    "price": "₩7,500",
    "category": "빵",
    "emoji": "🍞"
  }
]
```
> category: 자유 문자열 (예: "빵", "음료", "케이크", "Pizza", "Pasta", "Dessert", "Drinks")

#### BUSINESS_HOURS (영업시간)
```json
[
  {
    "dayKo": "월요일",
    "dayEn": "Monday",
    "hoursKo": "08:00 - 19:00",
    "hoursEn": "08:00 - 19:00",
    "isHoliday": false
  },
  {
    "dayKo": "일요일",
    "dayEn": "Sunday",
    "hoursKo": "정기 휴무",
    "hoursEn": "Closed",
    "isHoliday": true
  }
]
```
> isHoliday: `true`이면 휴무일 표시 (빨간색)

### 컴포넌트 구조 (10개)

| # | 컴포넌트 | 섹션 | 주요 환경변수 |
|---|----------|------|-------------|
| 1 | hero-section | 가게 사진 배너 | SITE_NAME, DESCRIPTION |
| 2 | quick-actions | 전화/길찾기/인스타 버튼 | PHONE, KAKAO_MAP_ID, INSTAGRAM_URL |
| 3 | menu-section | 메뉴 그리드 | MENU_ITEMS |
| 4 | hours-section | 영업시간 테이블 | BUSINESS_HOURS |
| 5 | location-section | 카카오맵 + 주소 | ADDRESS, KAKAO_MAP_ID, PHONE |
| 6 | gallery-section | 가로 스크롤 갤러리 | GALLERY_IMAGES |
| 7 | sns-section | 인스타/네이버/카카오 버튼 | INSTAGRAM_URL, NAVER_BLOG_URL, KAKAO_CHANNEL |
| 8 | footer | 전화/주소/© | PHONE, ADDRESS, SITE_NAME |
| 9 | theme-toggle | 다크/라이트 전환 | (내장) |
| 10 | language-toggle | 한/영 전환 | (내장) |

---

## 6. SNS 링크허브 (link-in-bio-pro)

**slug**: `link-in-bio-pro` | **display_order**: 6 | **타겟**: 크리에이터/인플루언서

### 데이터 필드

| 필드명 | 환경변수 | 타입 | 필수 | 설명 | 예시(ko) | 예시(en) |
|--------|----------|------|------|------|----------|----------|
| 닉네임 | `NEXT_PUBLIC_SITE_NAME` | string | ✅ | 이름/닉네임 | 최유진의 링크 모음 | Taylor Ryan |
| 소개 | `NEXT_PUBLIC_BIO` | string | - | 소개 문구 | 라이프스타일 유튜버 · 여행 & 먹방 | Indie Game Dev & Streamer |
| 프로필 이미지 | `NEXT_PUBLIC_AVATAR_URL` | string (URL) | - | 아바타 이미지 | (이미지 URL) | (이미지 URL) |
| 테마 | `NEXT_PUBLIC_THEME` | string | - | 테마 프리셋 | gradient | neon |
| 링크 목록 | `NEXT_PUBLIC_LINKS` | JSON array | - | 메인 링크 버튼 목록 | [아래 스키마 참조] | [아래 스키마 참조] |
| SNS | `NEXT_PUBLIC_SOCIALS` | JSON array | - | 하단 소셜 아이콘 | [아래 스키마 참조] | [아래 스키마 참조] |
| 유튜브 임베드 | `NEXT_PUBLIC_YOUTUBE_URL` | string (URL) | - | 유튜브 영상 임베드 URL | https://youtube.com/watch?v=... | (URL 또는 null) |
| GA ID | `NEXT_PUBLIC_GA_ID` | string | - | Google Analytics 4 ID | G-XXXXXXXXXX | G-XXXXXXXXXX |

### JSON 스키마

#### LINKS (링크 목록)
```json
[
  {
    "titleKo": "✨ 최신 유튜브 영상 보러가기",
    "titleEn": "✨ Watch Latest YouTube Video",
    "url": "https://youtube.com/@yujinchoilife",
    "icon": "youtube",
    "highlight": true
  },
  {
    "titleKo": "📸 인스타그램 팔로우",
    "titleEn": "📸 Follow on Instagram",
    "url": "https://instagram.com/yujin.travels",
    "icon": "instagram",
    "highlight": false
  }
]
```
> icon 값: `youtube`, `instagram`, `pen-line`, `briefcase`, `shopping-bag` 등 (Lucide React 또는 이모지)
> highlight: `true`이면 강조 표시 (더 밝은 배경, 상단 배치)

#### SOCIALS (하단 아이콘)
```json
[
  { "platform": "youtube", "url": "https://youtube.com/@yujinchoilife" },
  { "platform": "instagram", "url": "https://instagram.com/yujin.travels" },
  { "platform": "twitter", "url": "https://twitter.com/yujin_kr" }
]
```

#### THEME 프리셋 옵션

| 테마명 | 설명 | 배경 | 텍스트 |
|--------|------|------|--------|
| `gradient` | 퍼플→핑크→블루 그라디언트 (기본) | #6366f1 → #ec4899 → #3b82f6 | #ffffff |
| `neon` | 다크 + 네온 사이안 글로우 | #0a0a0a | #00ffff |
| `minimal` | 화이트 배경, 솔리드 버튼 | #ffffff | #0a0a0a |
| `sunset` | 오렌지→핑크→퍼플 | #f97316 → #ec4899 → #8b5cf6 | #ffffff |
| `forest` | 딥 그린→틸 | #065f46 → #0d9488 | #ffffff |

### 컴포넌트 구조 (7개)

| # | 컴포넌트 | 섹션 | 주요 환경변수 |
|---|----------|------|-------------|
| 1 | gradient-background | 애니메이션 배경 | THEME |
| 2 | avatar-section | 프로필 사진 + 이름 + 바이오 | SITE_NAME, BIO, AVATAR_URL |
| 3 | link-button-list | 글래스모피즘 링크 버튼 | LINKS |
| 4 | youtube-embed | 유튜브 영상 임베드 | YOUTUBE_URL |
| 5 | social-icons | 하단 소셜 아이콘 행 | SOCIALS |
| 6 | view-counter | 조회수 표시 | (내장, GA 연동) |
| 7 | footer | Powered by Linkmap | (내장) |

---

## 7. 공통 이미지 스펙

### 프로필/아바타 이미지

| 용도 | 환경변수 | 권장 크기 | 포맷 | 비고 |
|------|----------|-----------|------|------|
| 프로필 사진 (원형) | `AVATAR_URL` | 400×400px | JPG, PNG, WebP | 1:1 비율, 원형 크롭됨 |
| 히어로 배경 | `HERO_IMAGE_URL` | 1920×1080px | JPG, WebP | 16:9 비율, 다크 오버레이 적용 |
| 갤러리 사진 | `GALLERY_IMAGES[n]` | 800×800px | JPG, WebP | 1:1 권장, 자동 크롭 |
| 포트폴리오 작품 | `PORTFOLIO[n].imageUrl` | 1200×800px | JPG, PNG, WebP | 3:2 비율 권장 |
| 메뉴 사진 | `MENU_ITEMS[n].imageUrl` | 600×600px | JPG, WebP | 1:1 비율, 음식 사진 |
| 가게 배너 | (hero 영역) | 1400×600px | JPG, WebP | 약 7:3 비율 |

### 이미지 최적화 권장사항

- **포맷**: WebP 우선, JPG 폴백
- **최대 파일 크기**: 500KB 이하 권장 (GitHub Pages 정적 호스팅)
- **CDN**: 외부 CDN URL 사용 시 HTTPS 필수
- **Placeholder**: 이미지 미설정 시 각 템플릿별 기본 placeholder 표시
- **Lazy Loading**: 갤러리/포트폴리오 이미지는 `loading="lazy"` 적용

---

## 부록: 환경변수 빠른 참조

### 모든 템플릿 공통

| 환경변수 | 사용 템플릿 |
|----------|------------|
| `NEXT_PUBLIC_SITE_NAME` | 전체 6개 (필수) |
| `NEXT_PUBLIC_EMAIL` | personal-brand, dev-showcase, freelancer-page |
| `NEXT_PUBLIC_SOCIALS` | personal-brand, digital-namecard, freelancer-page, link-in-bio-pro |
| `NEXT_PUBLIC_GA_ID` | 전체 6개 (선택) |
| `NEXT_PUBLIC_AVATAR_URL` | digital-namecard, freelancer-page, link-in-bio-pro |

### 템플릿별 고유 환경변수

| 환경변수 | 전용 템플릿 |
|----------|------------|
| `NEXT_PUBLIC_HERO_IMAGE_URL` | personal-brand |
| `NEXT_PUBLIC_STORY` | personal-brand |
| `NEXT_PUBLIC_VALUES` | personal-brand |
| `NEXT_PUBLIC_HIGHLIGHTS` | personal-brand |
| `NEXT_PUBLIC_WRITINGS` | personal-brand |
| `NEXT_PUBLIC_TITLE` | digital-namecard, freelancer-page |
| `NEXT_PUBLIC_COMPANY` | digital-namecard |
| `NEXT_PUBLIC_PHONE` | digital-namecard, small-biz |
| `NEXT_PUBLIC_ADDRESS` | digital-namecard, small-biz |
| `NEXT_PUBLIC_WEBSITE` | digital-namecard |
| `NEXT_PUBLIC_ACCENT_COLOR` | digital-namecard |
| `NEXT_PUBLIC_GITHUB_USERNAME` | dev-showcase |
| `NEXT_PUBLIC_TAGLINE` | personal-brand, dev-showcase, freelancer-page |
| `NEXT_PUBLIC_ABOUT` | dev-showcase |
| `NEXT_PUBLIC_SKILLS` | dev-showcase |
| `NEXT_PUBLIC_EXPERIENCE` | dev-showcase, freelancer-page |
| `NEXT_PUBLIC_BLOG_POSTS` | dev-showcase |
| `NEXT_PUBLIC_RESUME_URL` | dev-showcase |
| `NEXT_PUBLIC_LINKEDIN_URL` | dev-showcase |
| `NEXT_PUBLIC_SERVICES` | freelancer-page |
| `NEXT_PUBLIC_PORTFOLIO` | freelancer-page |
| `NEXT_PUBLIC_TESTIMONIALS` | freelancer-page |
| `NEXT_PUBLIC_PROCESS` | freelancer-page |
| `NEXT_PUBLIC_DESCRIPTION` | small-biz |
| `NEXT_PUBLIC_KAKAO_MAP_ID` | small-biz |
| `NEXT_PUBLIC_BUSINESS_HOURS` | small-biz |
| `NEXT_PUBLIC_MENU_ITEMS` | small-biz |
| `NEXT_PUBLIC_GALLERY_IMAGES` | personal-brand, small-biz |
| `NEXT_PUBLIC_INSTAGRAM_URL` | small-biz |
| `NEXT_PUBLIC_NAVER_BLOG_URL` | small-biz |
| `NEXT_PUBLIC_KAKAO_CHANNEL` | small-biz |
| `NEXT_PUBLIC_BIO` | link-in-bio-pro |
| `NEXT_PUBLIC_THEME` | link-in-bio-pro |
| `NEXT_PUBLIC_LINKS` | link-in-bio-pro |
| `NEXT_PUBLIC_YOUTUBE_URL` | link-in-bio-pro |

---

## 8. Stitch 엘리먼트 → 환경변수 매핑

> Stitch 프로젝트: `projects/6936199156933295119` ("Linkmap Templates 2026 - Responsive")
> 총 14개 스크린 (6 Desktop + 6 Mobile + 2 Bonus Glassmorphism)

### 스크린 인벤토리

| # | 템플릿 | 디바이스 | Screen ID | 제목 |
|---|--------|----------|-----------|------|
| 1 | personal-brand | Desktop | `b9c07c65052a4b1aa9c97acf4f04dd29` | Jiwon Lee Personal Homepage |
| 2 | personal-brand | Mobile | `2c8e4a0b5947467eaf6fb5e1be9e5a8d` | Jiwon Lee Mobile Homepage |
| 3 | digital-namecard | Desktop | `b009eb2518144e55afe9e5400496eafe` | Soyeon Park Digital Business Card |
| 3b | digital-namecard | Desktop (Glass) | `73a78f47b064493d9585d948dd50f679` | Soyeon Park Digital Card - Glass Edition |
| 4 | digital-namecard | Mobile | `fcbfafc6866e47ec8aad09f677f63f2f` | Soyeon Park Mobile Digital Card |
| 5 | dev-showcase | Desktop | `a7139c6a9b66493d9ba300bd96c66eaf` | Taeyang Kim Dev Portfolio |
| 6 | dev-showcase | Mobile | `154a3b7e9cfe4dc08a0a5d044167b78a` | Taeyang Kim Mobile Dev Portfolio |
| 7 | freelancer-page | Desktop | `d25f32adbe884dc8826748ddc088268f` | Haeun Jung Freelancer Portfolio |
| 8 | freelancer-page | Mobile | `3f7555478ebd4d59a5909261145dab52` | Haeun Jung Mobile Portfolio |
| 9 | small-biz | Desktop | `3fe63fa4acc84232b3d16a7b0f8aa5d1` | On-gi Bakery Landing Page |
| 10 | small-biz | Mobile | `d7270989689744d3868a62bfa8eec41e` | On-gi Bakery Mobile Page |
| 11 | link-in-bio-pro | Desktop | `c72e02ba12b8434eb03a303a651784bf` | Yujin Choi SNS Link Hub |
| 12 | link-in-bio-pro | Mobile | `7dfce1324d6d498aabe9f509b41c4e88` | Yujin Choi Mobile Link Hub |

### 8.1 personal-brand 엘리먼트 매핑

| Stitch 컴포넌트 | HTML 엘리먼트 | 환경변수 | 데이터 타입 | 섹션 |
|-----------------|--------------|----------|------------|------|
| 히어로 배경 | `<div style="background-image">` | `NEXT_PUBLIC_HERO_IMAGE_URL` | string URL | hero-section |
| 이름 제목 | `<h1>이지원</h1>` | `NEXT_PUBLIC_SITE_NAME` | string | hero-section |
| 태그라인 | `<p>콘텐츠로 세상을 연결하는...</p>` | `NEXT_PUBLIC_TAGLINE` | string | hero-section |
| 프로필 사진 | `<img class="rounded-full">` | (향후 AVATAR_URL) | string URL | about-section |
| 스토리 텍스트 | `<p>안녕하세요, 저는...</p>` | `NEXT_PUBLIC_STORY` | string | about-section |
| 가치관 카드 제목 | `<h3>진정성</h3>` | `NEXT_PUBLIC_VALUES[n].titleKo` | JSON | values-section |
| 가치관 카드 설명 | `<p>광고처럼 느껴지지...</p>` | `NEXT_PUBLIC_VALUES[n].descKo` | JSON | values-section |
| 가치관 아이콘 | `<span>✦</span>` | `NEXT_PUBLIC_VALUES[n].emoji` | JSON | values-section |
| 통계 숫자 | `<span class="text-4xl">84,000+</span>` | `NEXT_PUBLIC_HIGHLIGHTS[n].valueKo` | JSON | highlights-section |
| 통계 라벨 | `<span>구독자 합산</span>` | `NEXT_PUBLIC_HIGHLIGHTS[n].labelKo` | JSON | highlights-section |
| 갤러리 이미지 | `<img class="rounded-lg">` | `NEXT_PUBLIC_GALLERY_IMAGES[n]` | JSON array | gallery-section |
| 이메일 | `<a href="mailto:">` | `NEXT_PUBLIC_EMAIL` | string | contact-section |
| SNS 아이콘 | `<a><svg></svg></a>` | `NEXT_PUBLIC_SOCIALS[n]` | JSON array | contact-section |
| 저작권 | `<p>© 2026 이지원</p>` | `NEXT_PUBLIC_SITE_NAME` | string | footer |

### 8.2 digital-namecard 엘리먼트 매핑

| Stitch 컴포넌트 | HTML 엘리먼트 | 환경변수 | 데이터 타입 | 섹션 |
|-----------------|--------------|----------|------------|------|
| 액센트 바 | `<div class="h-2 bg-[#136dec]">` | `NEXT_PUBLIC_ACCENT_COLOR` | string hex | accent-bar |
| 프로필 사진 | `<img class="rounded-full w-20">` | `NEXT_PUBLIC_AVATAR_URL` | string URL | profile-section |
| 이름 | `<h1>박소연</h1>` | `NEXT_PUBLIC_SITE_NAME` | string | profile-section |
| 직함 | `<p>브랜드 디자인 리드</p>` | `NEXT_PUBLIC_TITLE` | string | profile-section |
| 회사명 | `<p>스튜디오 모놀로그</p>` | `NEXT_PUBLIC_COMPANY` | string | profile-section |
| 이메일 행 | `<a href="mailto:">📧 soyeon@...</a>` | `NEXT_PUBLIC_EMAIL` | string | contact-list |
| 전화 행 | `<a href="tel:">📱 010-4512-8820</a>` | `NEXT_PUBLIC_PHONE` | string | contact-list |
| 주소 행 | `<p>📍 서울특별시 마포구...</p>` | `NEXT_PUBLIC_ADDRESS` | string | contact-list |
| 웹사이트 행 | `<a href="...">🌐 monologue.studio</a>` | `NEXT_PUBLIC_WEBSITE` | string URL | contact-list |
| SNS 아이콘 | `<a><svg></svg></a>` | `NEXT_PUBLIC_SOCIALS[n]` | JSON array | social-icons |
| QR 코드 | `<div class="qr-code">` | (모든 연락처로 자동 생성) | auto | qr-section |
| 연락처 저장 버튼 | `<button>연락처 저장</button>` | (vCard 다운로드 트리거) | auto | save-contact-cta |

### 8.3 dev-showcase 엘리먼트 매핑

| Stitch 컴포넌트 | HTML 엘리먼트 | 환경변수 | 데이터 타입 | 섹션 |
|-----------------|--------------|----------|------------|------|
| 터미널 텍스트 | `<span class="font-mono">Hello, I'm 김태양</span>` | `NEXT_PUBLIC_SITE_NAME` | string | terminal-header |
| 태그라인 | `<p>백엔드 엔지니어 \| Go · Rust</p>` | `NEXT_PUBLIC_TAGLINE` | string | terminal-header |
| GitHub 그래프 | `<div class="contribution-grid">` | `NEXT_PUBLIC_GITHUB_USERNAME` | string | github-section |
| 프로젝트 카드 이름 | `<h3 class="font-mono">turbo-cache</h3>` | `NEXT_PUBLIC_GITHUB_USERNAME` (API) | auto | projects-section |
| 프로젝트 설명 | `<p>초경량 Go 기반 분산 캐시...</p>` | (GitHub API 연동) | auto | projects-section |
| 기술 뱃지 | `<span class="badge">Go</span>` | (GitHub API 연동) | auto | projects-section |
| 스킬 진행바 | `<div class="progress-bar" style="width:90%">` | `NEXT_PUBLIC_SKILLS[n]` | JSON array | skills-section |
| 스킬 이름 | `<span>Go</span>` | `NEXT_PUBLIC_SKILLS[n].name` | JSON | skills-section |
| 경력 회사명 | `<h4>크래프톤</h4>` | `NEXT_PUBLIC_EXPERIENCE[n].company` | JSON | experience-timeline |
| 경력 직함 | `<p>백엔드 엔지니어 (시니어)</p>` | `NEXT_PUBLIC_EXPERIENCE[n].title` | JSON | experience-timeline |
| 경력 기간 | `<span>2022 - 현재</span>` | `NEXT_PUBLIC_EXPERIENCE[n].period` | JSON | experience-timeline |
| 블로그 글 | `<a>글 제목</a>` | `NEXT_PUBLIC_BLOG_POSTS[n]` | JSON array | blog-section |
| 이메일 | `<a href="mailto:">taeyang@dev.kr</a>` | `NEXT_PUBLIC_EMAIL` | string | contact-section |
| LinkedIn | `<a href="..."><svg></svg></a>` | `NEXT_PUBLIC_LINKEDIN_URL` | string URL | contact-section |

### 8.4 freelancer-page 엘리먼트 매핑

| Stitch 컴포넌트 | HTML 엘리먼트 | 환경변수 | 데이터 타입 | 섹션 |
|-----------------|--------------|----------|------------|------|
| 프로필 사진 | `<img class="rounded-full w-32">` | `NEXT_PUBLIC_AVATAR_URL` | string URL | hero-section |
| 이름 | `<h1>정하은</h1>` | `NEXT_PUBLIC_TITLE` | string | hero-section |
| 태그라인 | `<p>브랜드의 이야기를...</p>` | `NEXT_PUBLIC_TAGLINE` | string | hero-section |
| 서비스 아이콘 | `<svg>` (Lucide) | `NEXT_PUBLIC_SERVICES[n].icon` | JSON | services-section |
| 서비스 제목 | `<h3>브랜드 아이덴티티</h3>` | `NEXT_PUBLIC_SERVICES[n].titleKo` | JSON | services-section |
| 서비스 설명 | `<p>로고부터 컬러 팔레트...</p>` | `NEXT_PUBLIC_SERVICES[n].descKo` | JSON | services-section |
| 서비스 가격 | `<span class="text-primary">₩350만~</span>` | `NEXT_PUBLIC_SERVICES[n].priceKo` | JSON | services-section |
| 필터 탭 | `<button>전체</button>` | (PORTFOLIO 카테고리 자동 추출) | auto | portfolio-filter |
| 작품 이미지 | `<img>` | `NEXT_PUBLIC_PORTFOLIO[n].imageUrl` | JSON | portfolio-section |
| 작품 제목 | `<h4>하루마 커피 리브랜딩</h4>` | `NEXT_PUBLIC_PORTFOLIO[n].titleKo` | JSON | portfolio-section |
| 별점 | `<span>★★★★★</span>` | `NEXT_PUBLIC_TESTIMONIALS[n].rating` | JSON | testimonials-section |
| 후기 텍스트 | `<p>"브랜드 방향을 제대로..."</p>` | `NEXT_PUBLIC_TESTIMONIALS[n].contentKo` | JSON | testimonials-section |
| 후기 저자 | `<span>강민준, 하루마 커피 대표</span>` | `NEXT_PUBLIC_TESTIMONIALS[n].authorKo` | JSON | testimonials-section |
| 프로세스 번호 | `<span>01</span>` | `NEXT_PUBLIC_PROCESS[n].number` | JSON | process-section |
| 프로세스 제목 | `<h4>킥오프 미팅</h4>` | `NEXT_PUBLIC_PROCESS[n].titleKo` | JSON | process-section |
| 문의 폼 | `<form>` | `NEXT_PUBLIC_EMAIL` (action) | string | contact-section |
| SNS 아이콘 | `<a><svg></svg></a>` | `NEXT_PUBLIC_SOCIALS[n]` | JSON array | footer |

### 8.5 small-biz 엘리먼트 매핑

| Stitch 컴포넌트 | HTML 엘리먼트 | 환경변수 | 데이터 타입 | 섹션 |
|-----------------|--------------|----------|------------|------|
| 가게 이름 | `<h1>온기 베이커리</h1>` | `NEXT_PUBLIC_SITE_NAME` | string | hero-section |
| 가게 소개 | `<p>매일 아침 직접 구운...</p>` | `NEXT_PUBLIC_DESCRIPTION` | string | hero-section |
| 전화 버튼 | `<a href="tel:">📞 전화하기</a>` | `NEXT_PUBLIC_PHONE` | string | quick-actions |
| 길찾기 버튼 | `<a>📍 길찾기</a>` | `NEXT_PUBLIC_KAKAO_MAP_ID` | string | quick-actions |
| 인스타 버튼 | `<a>📷 인스타그램</a>` | `NEXT_PUBLIC_INSTAGRAM_URL` | string URL | quick-actions |
| 메뉴 이모지 | `<span>🍞</span>` | `NEXT_PUBLIC_MENU_ITEMS[n].emoji` | JSON | menu-section |
| 메뉴 이름 | `<h4>르방 깜빠뉴</h4>` | `NEXT_PUBLIC_MENU_ITEMS[n].nameKo` | JSON | menu-section |
| 메뉴 설명 | `<p>72시간 발효 천연...</p>` | `NEXT_PUBLIC_MENU_ITEMS[n].descKo` | JSON | menu-section |
| 메뉴 가격 | `<span class="text-primary">₩7,500</span>` | `NEXT_PUBLIC_MENU_ITEMS[n].price` | JSON | menu-section |
| 영업시간 요일 | `<td>월요일</td>` | `NEXT_PUBLIC_BUSINESS_HOURS[n].dayKo` | JSON | hours-section |
| 영업시간 시간 | `<td>08:00 - 19:00</td>` | `NEXT_PUBLIC_BUSINESS_HOURS[n].hoursKo` | JSON | hours-section |
| 오늘 뱃지 | `<span class="badge">오늘</span>` | (자동 계산) | auto | hours-section |
| 지도 영역 | `<div class="kakao-map">` | `NEXT_PUBLIC_KAKAO_MAP_ID` | string | location-section |
| 주소 텍스트 | `<p>📍 서울 마포구 연남동...</p>` | `NEXT_PUBLIC_ADDRESS` | string | location-section |
| 갤러리 사진 | `<img>` | `NEXT_PUBLIC_GALLERY_IMAGES[n]` | JSON array | gallery-section |
| 네이버 블로그 버튼 | `<a class="bg-green">네이버 블로그</a>` | `NEXT_PUBLIC_NAVER_BLOG_URL` | string URL | sns-section |
| 카카오채널 버튼 | `<a class="bg-yellow">카카오채널 추가</a>` | `NEXT_PUBLIC_KAKAO_CHANNEL` | string URL | sns-section |

### 8.6 link-in-bio-pro 엘리먼트 매핑

| Stitch 컴포넌트 | HTML 엘리먼트 | 환경변수 | 데이터 타입 | 섹션 |
|-----------------|--------------|----------|------------|------|
| 그라디언트 배경 | `<div class="gradient-bg">` | `NEXT_PUBLIC_THEME` | string | gradient-background |
| 아바타 | `<img class="rounded-full w-24">` | `NEXT_PUBLIC_AVATAR_URL` | string URL | avatar-section |
| 닉네임 | `<h1>최유진의 링크 모음</h1>` | `NEXT_PUBLIC_SITE_NAME` | string | avatar-section |
| 바이오 | `<p>라이프스타일 유튜버...</p>` | `NEXT_PUBLIC_BIO` | string | avatar-section |
| 링크 버튼 | `<a class="glassmorphism">✨ 최신 유튜브...</a>` | `NEXT_PUBLIC_LINKS[n].titleKo` | JSON | link-button-list |
| 링크 아이콘 | `<span>✨</span>` 또는 `<svg>` | `NEXT_PUBLIC_LINKS[n].icon` | JSON | link-button-list |
| 링크 URL | `<a href="...">` | `NEXT_PUBLIC_LINKS[n].url` | JSON | link-button-list |
| 하이라이트 표시 | `<a class="highlight pulse">` | `NEXT_PUBLIC_LINKS[n].highlight` | JSON boolean | link-button-list |
| 유튜브 임베드 | `<iframe>` 또는 `<div class="aspect-video">` | `NEXT_PUBLIC_YOUTUBE_URL` | string URL | youtube-embed |
| 소셜 아이콘 | `<a><svg></svg></a>` | `NEXT_PUBLIC_SOCIALS[n]` | JSON array | social-icons |
| 조회수 | `<span>👀 1,240,000</span>` | (GA 연동, 내장) | auto | view-counter |
| 푸터 | `<p>Powered by Linkmap</p>` | (내장) | auto | footer |

---

## 9. Stitch 프로젝트 참조 정보

### 프로젝트

- **프로젝트 ID**: `6936199156933295119`
- **프로젝트명**: Linkmap Templates 2026 - Responsive
- **총 스크린 수**: 14 (12 계획 + 2 보너스)
- **생성일**: 2026-02-19

### 스크린별 코드 접근

각 스크린의 HTML 코드는 Stitch API로 접근 가능:
```
mcp__stitch__get_screen({
  name: "projects/6936199156933295119/screens/{screenId}",
  projectId: "6936199156933295119",
  screenId: "{screenId}"
})
```

### 디자인 토큰 요약

| 템플릿 | 메인 컬러 | 배경 | 테마 | 폰트 |
|--------|----------|------|------|------|
| personal-brand | #ee5b2b | #0a0a0a → #fafaf9 | Light+Dark Hero | Pretendard + Plus Jakarta Sans |
| digital-namecard | #136dec | #f4f4f5 | Light | Pretendard + Inter |
| dev-showcase | #13c8ec | #0d1117 | Dark | JetBrains Mono + Space Grotesk + Pretendard |
| freelancer-page | #5b13ec | #fafafa | Light | Pretendard + Inter |
| small-biz | #d47311 | #fffbf5 | Light (Warm) | Pretendard + Plus Jakarta Sans |
| link-in-bio-pro | #6366f1→#ec4899→#3b82f6 | Gradient | Dark | Plus Jakarta Sans + Pretendard |
