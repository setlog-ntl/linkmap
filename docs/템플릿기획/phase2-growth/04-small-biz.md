# 소상공인 비즈니스 (Small Business) 기획서

## 1. 개요

| 항목 | 값 |
|------|-----|
| 슬러그 | `small-biz` |
| UUID | `b2c3d4e5-0006-4000-9000-000000000006` |
| 카테고리 | 비즈니스 & 커머스 |
| 타겟 | 카페, 음식점, 미용실, 소매점 사장님 (페르소나: 소상공인 "영희" 45세) |
| 우선순위 | 4위 (총점 85/100) |
| Phase | Phase 2 - 성장 |
| 일정 | 3일 |
| 비고 | 모바일 완전 최적화, 카카오맵 연동, 초간단 UI |

### 핵심 가치

**"내 가게를 디지털에서 가장 쉽게 알리는 방법"**

- **메뉴판 + 카카오맵 + 영업시간 + 전화 연결**: 소상공인이 실제로 필요한 기능만 집약
- **초간단 모바일 최적화**: 고객의 80%가 모바일로 접속하는 소상공인 특성 반영
- **디지털 소외감 해소**: 기술에 익숙하지 않은 사장님도 환경변수만 채우면 완성
- **고객 유입 극대화**: 네이버/카카오 검색 SEO 최적화로 실제 매출 연결

### 심리적 동기

| 동기 | 설명 |
|------|------|
| 통제감 | 디지털 소외감 해소 - "나도 홈페이지가 있다" |
| 효율성 | 고객 유입 - 검색 → 전화/방문 전환 |

### 바이럴 전략

- 네이버 플레이스 / 카카오맵 검색 결과에서 홈페이지 링크 노출
- 카카오톡 공유 시 OG 이미지로 가게 정보 자동 표시
- 소상공인 지원센터/상권 분석 플랫폼과 연계 가능

---

## 2. AI 구현 프롬프트

```
당신은 시니어 풀스택 개발자입니다. 아래 명세에 따라 소상공인 비즈니스 홈페이지 템플릿을 구현하세요.

## 컨텍스트
- 프로젝트: Linkmap 원클릭 배포용 홈페이지 템플릿
- 템플릿명: 소상공인 비즈니스 (Small Business)
- 슬러그: small-biz
- 레포: linkmap-templates/small-biz/
- 타겟: 카페, 음식점, 미용실, 소매점 사장님 (45세 소상공인 "영희")
- 핵심 가치: 메뉴판 + 카카오맵 + 영업시간 + 전화 연결. 초간단 모바일 최적화

## 기술 스택
- Framework: Next.js 16 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS v4
- Fonts: Pretendard (한글) + Inter (영문) via next/font
- Icons: Lucide React
- Dark Mode: next-themes (ThemeProvider + ThemeToggle)
- SEO: next/metadata + JSON-LD (LocalBusiness schema)
- OG Image: @vercel/og (/api/og)
- Analytics: Google Analytics 4 (선택)
- Deploy: GitHub Pages (Fork 기반)

## 핵심 섹션 (8개)
1. 히어로: 가게 이름 + 대표 이미지 + 한줄 소개. 따뜻한 amber 배경 그라데이션
2. 빠른 액션: 전화하기(tel: 링크, Phone 아이콘) + 길찾기(카카오맵 링크, MapPin 아이콘) 큰 버튼 2개. 모바일에서 화면 하단 고정(sticky)
3. 영업 정보: 영업시간(Clock), 주소(MapPin), 전화(Phone) 아이콘 + 텍스트. JSON 환경변수로 요일별 영업시간 지원
4. 메뉴/서비스: 카드 리스트 (이름 + 가격 + 설명). JSON 배열 환경변수. 카테고리 분류 지원
5. 갤러리: 사진 그리드 (2열 모바일, 3열 데스크톱). 클릭 시 라이트박스(모달)
6. SNS/리뷰: 인스타그램, 네이버 블로그 링크 버튼 + 별점 표시 (선택)
7. 카카오맵: iframe 임베드. NEXT_PUBLIC_KAKAO_MAP_ID 환경변수로 가게 위치 표시
8. 푸터: 카카오 채널 버튼 + 사업자 정보 + "Powered by Linkmap" 링크

## 디자인 스펙
- 컬러: 따뜻한 amber/warm 톤 (primary: amber-600, accent: orange-500)
- 다크모드: amber-900/orange-900 기반 따뜻한 다크 톤
- 타이포: 본문 18px (소상공인 고객 = 중장년층 포함), 제목 28~36px
- 버튼: 최소 48px 높이 (모바일 터치 영역), border-radius 12px
- 레이아웃: 싱글 컬럼, max-w-lg (모바일 최적화 우선)
- 반응형: 360px → 768px → 1024px → 1440px

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 가게 이름
- NEXT_PUBLIC_DESCRIPTION: 한줄 소개
- NEXT_PUBLIC_PHONE: 전화번호
- NEXT_PUBLIC_ADDRESS: 주소
- NEXT_PUBLIC_KAKAO_MAP_ID: 카카오맵 장소 ID
- NEXT_PUBLIC_BUSINESS_HOURS (JSON): 요일별 영업시간 [{"day":"월~금","hours":"09:00~21:00"},...]
- NEXT_PUBLIC_MENU_ITEMS (JSON): 메뉴 목록 [{"name":"아메리카노","price":"4,500원","desc":"...","category":"커피"}]
- NEXT_PUBLIC_GALLERY_IMAGES (JSON): 갤러리 이미지 URL 배열
- NEXT_PUBLIC_INSTAGRAM_URL: 인스타그램 URL
- NEXT_PUBLIC_NAVER_BLOG_URL: 네이버 블로그 URL
- NEXT_PUBLIC_KAKAO_CHANNEL: 카카오 채널 URL
- NEXT_PUBLIC_GA_ID: Google Analytics ID

## 요구사항
1. 환경변수 미설정 시 의미 있는 데모 데이터를 기본값으로 표시 (카페 예시)
2. src/lib/config.ts에서 환경변수를 타입 안전하게 파싱
3. JSON 환경변수는 try-catch로 안전하게 파싱하고, 실패 시 기본값 사용
4. Lighthouse 4개 카테고리 모두 90+ 달성
5. JSON-LD에 LocalBusiness 스키마 포함 (가게명, 주소, 전화, 영업시간)
6. /api/og 엔드포인트로 가게 이름 + 소개가 포함된 OG 이미지 자동 생성
7. 모바일에서 빠른 액션 버튼이 하단에 고정되어 항상 접근 가능
8. 카카오맵 iframe은 lazy loading으로 성능 최적화
9. 갤러리 이미지는 next/image로 최적화, placeholder="blur" 지원
10. print CSS로 인쇄 시 깔끔한 메뉴판 출력 지원
```

---

## 3. 핵심 섹션 정의

### 3.1 히어로 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 페이지 최상단 |
| 구성 | 가게 이름(h1) + 대표 이미지(배경) + 한줄 소개(p) + 다크모드 토글 |
| 인터랙션 | 스크롤 시 패럴렉스 효과 (선택), 다크모드 토글 우측 상단 |
| 데이터 | `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_DESCRIPTION` |
| 기본값 | "맛있는 카페", "정성을 담은 한 잔, 따뜻한 공간" |

### 3.2 빠른 액션 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 히어로 바로 아래 + 모바일에서 하단 고정(sticky bottom) |
| 구성 | 전화하기 버튼(Phone 아이콘, `tel:` 링크) + 길찾기 버튼(MapPin 아이콘, 카카오맵 링크) |
| 인터랙션 | 탭 시 즉시 전화 앱/지도 앱 실행. 호버 시 scale 효과 |
| 데이터 | `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_KAKAO_MAP_ID` |
| 기본값 | "02-1234-5678", 카카오맵 기본 ID |
| 모바일 | 하단 고정 바(64px 높이), 두 버튼 50:50 분할 |

### 3.3 영업 정보 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 빠른 액션 아래 |
| 구성 | 3개 정보 카드: 영업시간(Clock), 주소(MapPin), 전화번호(Phone) |
| 인터랙션 | 전화번호 클릭 시 `tel:` 링크, 주소 클릭 시 카카오맵 링크 |
| 데이터 | `NEXT_PUBLIC_BUSINESS_HOURS`(JSON), `NEXT_PUBLIC_ADDRESS`, `NEXT_PUBLIC_PHONE` |
| 기본값 | 월~금 09:00~21:00, 토 10:00~18:00, 일 휴무 / "서울시 강남구 테헤란로 123" |

### 3.4 메뉴/서비스 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 영업 정보 아래 |
| 구성 | 카테고리 탭(선택) + 메뉴 카드 리스트(이름, 가격, 설명) |
| 인터랙션 | 카테고리 탭 클릭 시 필터링. 가격은 우측 정렬, 볼드체 |
| 데이터 | `NEXT_PUBLIC_MENU_ITEMS`(JSON 배열) |
| 기본값 | 커피 3종 + 디저트 2종 예시 데이터 |

### 3.5 갤러리 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 메뉴 아래 |
| 구성 | 사진 그리드 (모바일 2열, 데스크톱 3열) |
| 인터랙션 | 클릭 시 라이트박스 모달(확대 보기), 좌우 네비게이션 |
| 데이터 | `NEXT_PUBLIC_GALLERY_IMAGES`(JSON 배열) |
| 기본값 | 플레이스홀더 이미지 6장 (Unsplash 카페 이미지 URL) |

### 3.6 SNS/리뷰 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 갤러리 아래 |
| 구성 | 인스타그램 버튼 + 네이버 블로그 버튼 + 별점 표시(선택) |
| 인터랙션 | 외부 링크로 새 탭 열기 |
| 데이터 | `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_NAVER_BLOG_URL` |
| 기본값 | 링크 미설정 시 섹션 자체를 숨김 |

### 3.7 카카오맵 섹션

| 항목 | 설명 |
|------|------|
| 위치 | SNS/리뷰 아래 |
| 구성 | 카카오맵 iframe 임베드 (가로 100%, 세로 300px) |
| 인터랙션 | 지도 내 핀치줌/드래그. "카카오맵에서 보기" 외부 링크 버튼 |
| 데이터 | `NEXT_PUBLIC_KAKAO_MAP_ID` |
| 기본값 | 미설정 시 주소 텍스트만 표시 |
| 성능 | `loading="lazy"` + IntersectionObserver로 뷰포트 진입 시 로드 |

### 3.8 푸터

| 항목 | 설명 |
|------|------|
| 위치 | 페이지 최하단 |
| 구성 | 카카오 채널 버튼 + 사업자 정보 텍스트 + "Powered by Linkmap" |
| 인터랙션 | 카카오 채널 클릭 시 카카오톡 채널 페이지로 이동 |
| 데이터 | `NEXT_PUBLIC_KAKAO_CHANNEL` |
| 기본값 | "Powered by Linkmap" 링크만 표시 |

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:----:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 가게 이름 | O | `"맛있는 카페"` |
| `NEXT_PUBLIC_DESCRIPTION` | 한줄 소개 | | `"정성을 담은 한 잔, 따뜻한 공간"` |
| `NEXT_PUBLIC_PHONE` | 전화번호 | | `"02-1234-5678"` |
| `NEXT_PUBLIC_ADDRESS` | 주소 | | `"서울시 강남구 테헤란로 123"` |
| `NEXT_PUBLIC_KAKAO_MAP_ID` | 카카오맵 장소 ID | | (미설정 시 지도 숨김) |
| `NEXT_PUBLIC_BUSINESS_HOURS` | 영업시간 (JSON) | | `[{"day":"월~금","hours":"09:00~21:00"},{"day":"토","hours":"10:00~18:00"},{"day":"일","hours":"휴무"}]` |
| `NEXT_PUBLIC_MENU_ITEMS` | 메뉴 목록 (JSON) | | 커피 3종 + 디저트 2종 데모 데이터 |
| `NEXT_PUBLIC_GALLERY_IMAGES` | 갤러리 이미지 URL (JSON) | | Unsplash 카페 이미지 6장 |
| `NEXT_PUBLIC_INSTAGRAM_URL` | 인스타그램 URL | | (미설정 시 숨김) |
| `NEXT_PUBLIC_NAVER_BLOG_URL` | 네이버 블로그 URL | | (미설정 시 숨김) |
| `NEXT_PUBLIC_KAKAO_CHANNEL` | 카카오 채널 URL | | (미설정 시 숨김) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | (미설정 시 비활성) |

---

## 5. 디자인 스펙

### 컬러 팔레트

| 용도 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경 (primary) | `#FFFBEB` (amber-50) | `#1C1917` (stone-900) |
| 배경 (card) | `#FFFFFF` | `#292524` (stone-800) |
| 텍스트 (primary) | `#292524` (stone-800) | `#FAFAF9` (stone-50) |
| 텍스트 (secondary) | `#78716C` (stone-500) | `#A8A29E` (stone-400) |
| 악센트 (primary) | `#D97706` (amber-600) | `#F59E0B` (amber-500) |
| 악센트 (secondary) | `#EA580C` (orange-600) | `#F97316` (orange-500) |
| 버튼 전화 | `#16A34A` (green-600) | `#22C55E` (green-500) |
| 버튼 길찾기 | `#2563EB` (blue-600) | `#3B82F6` (blue-500) |
| 보더 | `#F5F5F4` (stone-100) | `#44403C` (stone-700) |

### 타이포그래피

| 요소 | 크기 | 굵기 | 비고 |
|------|------|------|------|
| 가게 이름 (h1) | 36px (모바일 28px) | 800 | Pretendard |
| 섹션 제목 (h2) | 24px (모바일 20px) | 700 | Pretendard |
| 메뉴 이름 | 18px | 600 | Pretendard |
| 가격 | 18px | 700 | Inter (숫자) |
| 본문 | 18px (모바일 16px) | 400 | Pretendard |
| 캡션/라벨 | 14px | 500 | Pretendard |

### 레이아웃

- **컨테이너**: `max-w-lg` (512px) - 모바일 최적화 우선
- **섹션 간격**: `py-12` (48px)
- **카드 패딩**: `p-4` (16px)
- **카드 라운드**: `rounded-xl` (12px)
- **그림자**: `shadow-sm` (라이트), 없음 (다크)
- **빠른 액션 바**: 모바일 하단 고정, `h-16` (64px), `z-50`

### 반응형 브레이크포인트

| 브레이크포인트 | 너비 | 레이아웃 변화 |
|------------|------|------------|
| 모바일 | 360px+ | 싱글 컬럼, 갤러리 2열, 하단 고정 액션 바 |
| 태블릿 | 768px+ | 갤러리 3열, 영업정보 가로 배치 |
| 데스크톱 | 1024px+ | max-w-lg 중앙 정렬, 하단 고정 바 해제 |
| 와이드 | 1440px+ | 동일 (과도한 확장 방지) |

---

## 6. 컴포넌트 구조

### 파일 트리

```
linkmap-templates/small-biz/
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   └── images/
│       └── hero-default.jpg
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트, 테마, GA
│   │   ├── page.tsx                # 메인 페이지 (섹션 조합)
│   │   └── api/
│   │       └── og/
│   │           └── route.tsx       # OG 이미지 생성 (가게명+소개)
│   ├── components/
│   │   ├── hero-section.tsx        # 히어로 (가게명+이미지+소개)
│   │   ├── quick-actions.tsx       # 전화+길찾기 버튼 (모바일 sticky)
│   │   ├── business-info.tsx       # 영업시간+주소+전화
│   │   ├── menu-section.tsx        # 메뉴/서비스 카드 리스트
│   │   ├── menu-card.tsx           # 개별 메뉴 카드
│   │   ├── gallery-section.tsx     # 사진 그리드
│   │   ├── gallery-lightbox.tsx    # 라이트박스 모달
│   │   ├── sns-review-section.tsx  # SNS 링크+리뷰
│   │   ├── kakao-map-section.tsx   # 카카오맵 iframe
│   │   ├── footer.tsx              # 푸터 (카카오채널+Linkmap)
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
| HeroSection | `hero-section.tsx` | 가게 이름, 대표 이미지, 한줄 소개 표시 | `name`, `description`, `imageUrl` |
| QuickActions | `quick-actions.tsx` | 전화/길찾기 큰 버튼 2개, 모바일 하단 고정 | `phone`, `mapId` |
| BusinessInfo | `business-info.tsx` | 영업시간, 주소, 전화 정보 카드 3개 | `hours`, `address`, `phone` |
| MenuSection | `menu-section.tsx` | 메뉴 카드 리스트 + 카테고리 필터 | `items` |
| MenuCard | `menu-card.tsx` | 개별 메뉴 아이템 (이름+가격+설명) | `name`, `price`, `desc`, `category` |
| GallerySection | `gallery-section.tsx` | 사진 그리드 (2/3열) | `images` |
| GalleryLightbox | `gallery-lightbox.tsx` | 사진 확대 모달 + 좌우 네비게이션 | `images`, `currentIndex`, `onClose` |
| SnsReviewSection | `sns-review-section.tsx` | 인스타/블로그 링크 버튼 | `instagramUrl`, `naverBlogUrl` |
| KakaoMapSection | `kakao-map-section.tsx` | 카카오맵 iframe lazy 임베드 | `mapId`, `address` |
| Footer | `footer.tsx` | 카카오 채널 + Powered by Linkmap | `kakaoChannel` |
| ThemeToggle | `theme-toggle.tsx` | 다크모드 토글 버튼 | - |
| ThemeProvider | `theme-provider.tsx` | next-themes Provider 래퍼 | `children` |

---

## 7. 시드 데이터

### 7.1 SQL INSERT

```sql
-- Phase 2: 소상공인 비즈니스 템플릿
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0006-4000-9000-000000000006',
  'small-biz',
  'Small Business',
  '소상공인 비즈니스',
  'Simple mobile-optimized business page with menu, hours, Kakao Map, and one-tap call/directions. Perfect for cafes, restaurants, salons, and shops.',
  '메뉴판, 영업시간, 카카오맵, 전화 연결을 갖춘 초간단 모바일 최적화 비즈니스 페이지. 카페, 음식점, 미용실, 소매점에 최적화.',
  NULL,
  'linkmap-templates', 'small-biz', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "가게 이름", "required": true},
    {"key": "NEXT_PUBLIC_DESCRIPTION", "description": "한줄 소개", "required": false},
    {"key": "NEXT_PUBLIC_PHONE", "description": "전화번호", "required": false},
    {"key": "NEXT_PUBLIC_ADDRESS", "description": "주소", "required": false},
    {"key": "NEXT_PUBLIC_KAKAO_MAP_ID", "description": "카카오맵 장소 ID", "required": false},
    {"key": "NEXT_PUBLIC_BUSINESS_HOURS", "description": "영업시간 JSON 배열", "required": false},
    {"key": "NEXT_PUBLIC_MENU_ITEMS", "description": "메뉴 목록 JSON 배열", "required": false},
    {"key": "NEXT_PUBLIC_GALLERY_IMAGES", "description": "갤러리 이미지 URL JSON 배열", "required": false},
    {"key": "NEXT_PUBLIC_INSTAGRAM_URL", "description": "인스타그램 URL", "required": false},
    {"key": "NEXT_PUBLIC_NAVER_BLOG_URL", "description": "네이버 블로그 URL", "required": false},
    {"key": "NEXT_PUBLIC_KAKAO_CHANNEL", "description": "카카오 채널 URL", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['small-business', 'restaurant', 'cafe', 'shop', 'kakao-map', 'mobile', 'nextjs'],
  false, true, 6
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
  SMALL_BIZ: 'b2c3d4e5-0006-4000-9000-000000000006',
};

// homepageTemplates 배열에 추가:
{
  id: TEMPLATE_IDS.SMALL_BIZ,
  slug: 'small-biz',
  name: 'Small Business',
  name_ko: '소상공인 비즈니스',
  description: 'Simple mobile-optimized business page with menu, hours, Kakao Map, and one-tap call/directions. Perfect for cafes, restaurants, salons, and shops.',
  description_ko: '메뉴판, 영업시간, 카카오맵, 전화 연결을 갖춘 초간단 모바일 최적화 비즈니스 페이지. 카페, 음식점, 미용실, 소매점에 최적화.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'small-biz',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '가게 이름', required: true },
    { key: 'NEXT_PUBLIC_DESCRIPTION', description: '한줄 소개', required: false },
    { key: 'NEXT_PUBLIC_PHONE', description: '전화번호', required: false },
    { key: 'NEXT_PUBLIC_ADDRESS', description: '주소', required: false },
    { key: 'NEXT_PUBLIC_KAKAO_MAP_ID', description: '카카오맵 장소 ID', required: false },
    { key: 'NEXT_PUBLIC_BUSINESS_HOURS', description: '영업시간 JSON 배열', required: false },
    { key: 'NEXT_PUBLIC_MENU_ITEMS', description: '메뉴 목록 JSON 배열', required: false },
    { key: 'NEXT_PUBLIC_GALLERY_IMAGES', description: '갤러리 이미지 URL JSON 배열', required: false },
    { key: 'NEXT_PUBLIC_INSTAGRAM_URL', description: '인스타그램 URL', required: false },
    { key: 'NEXT_PUBLIC_NAVER_BLOG_URL', description: '네이버 블로그 URL', required: false },
    { key: 'NEXT_PUBLIC_KAKAO_CHANNEL', description: '카카오 채널 URL', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['small-business', 'restaurant', 'cafe', 'shop', 'kakao-map', 'mobile', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 6,
}
```

---

## 8. 검증 체크리스트

### 기능 검증

- [ ] 환경변수 미설정 시 카페 데모 데이터가 올바르게 표시됨
- [ ] `NEXT_PUBLIC_SITE_NAME` 설정 시 가게 이름이 모든 위치에 반영됨
- [ ] 전화하기 버튼 클릭 시 `tel:` 링크로 전화 앱 실행
- [ ] 길찾기 버튼 클릭 시 카카오맵 장소 페이지로 이동
- [ ] 영업시간 JSON이 올바르게 파싱되고 요일별로 표시됨
- [ ] 메뉴 카드가 이름, 가격, 설명과 함께 올바르게 렌더링됨
- [ ] 카테고리 필터가 동작함 (메뉴 아이템 필터링)
- [ ] 갤러리 이미지 그리드가 올바르게 표시됨 (모바일 2열, 데스크톱 3열)
- [ ] 갤러리 라이트박스 모달이 열리고 좌우 네비게이션 동작
- [ ] SNS 링크 미설정 시 SNS/리뷰 섹션이 숨겨짐
- [ ] 카카오맵 iframe이 lazy loading으로 로드됨
- [ ] 카카오맵 ID 미설정 시 주소 텍스트만 표시
- [ ] 푸터의 카카오 채널 버튼이 올바르게 링크됨
- [ ] 다크모드 토글이 정상 동작하고 모든 섹션에 적용됨
- [ ] JSON 환경변수가 잘못된 형식일 때 기본값으로 폴백
- [ ] OG 이미지(`/api/og`)에 가게 이름과 소개가 포함됨
- [ ] 모바일에서 빠른 액션 바가 하단에 고정됨

### 성능 검증

- [ ] Lighthouse Performance 점수 90+
- [ ] Lighthouse Best Practices 점수 90+
- [ ] First Contentful Paint < 1.5초
- [ ] Largest Contentful Paint < 2.5초
- [ ] Cumulative Layout Shift < 0.1
- [ ] 카카오맵 iframe lazy loading 확인
- [ ] 갤러리 이미지 next/image 최적화 확인
- [ ] 번들 사이즈 200KB 미만 (gzip)

### 접근성 검증

- [ ] Lighthouse Accessibility 점수 90+
- [ ] 키보드만으로 모든 인터랙션 가능 (탭 순서, Enter/Space)
- [ ] 스크린리더로 모든 콘텐츠 접근 가능
- [ ] 버튼 최소 터치 영역 48x48px
- [ ] 이미지에 적절한 alt 텍스트
- [ ] 색상 대비 WCAG 2.1 AA 준수 (4.5:1 이상)
- [ ] 라이트박스 모달에서 포커스 트랩 동작
- [ ] `lang="ko"` 속성 설정됨

### SEO 검증

- [ ] Lighthouse SEO 점수 90+
- [ ] `<title>` 태그에 가게 이름 포함
- [ ] meta description에 가게 소개 포함
- [ ] JSON-LD LocalBusiness 스키마 포함 (이름, 주소, 전화, 영업시간)
- [ ] OG 메타태그 (og:title, og:description, og:image) 설정
- [ ] 카카오톡 공유 시 OG 이미지 정상 표시
- [ ] `robots.txt` 생성됨
- [ ] `sitemap.xml` 생성됨
- [ ] 구조화 데이터 테스트 통과 (Google Rich Results Test)
