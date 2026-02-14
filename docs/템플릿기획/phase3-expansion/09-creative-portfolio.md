# 크리에이티브 포트폴리오 (Creative Portfolio) 기획서

## 1. 개요

| 항목 | 내용 |
|------|------|
| 슬러그 | `creative-portfolio` |
| UUID | `b2c3d4e5-0011-4000-9000-000000000011` |
| 카테고리 | 전문가 & 포트폴리오 |
| 타겟 페르소나 | UI/UX 디자이너, 그래픽 디자이너, 포토그래퍼 (페르소나: 디자이너 "수빈", 27세) |
| 우선순위 | 9위 (총점 78/100) |
| Phase | Phase 3: 확장 |
| 구현 일정 | 4일 |
| 비고 | 풀스크린 이미지 갤러리, 케이스 스터디, 마우스 인터랙션. 비주얼 임팩트 극대화 |

### 핵심 가치
- **완벽주의**: 디자이너의 작업물을 최고의 품질로 보여주는 무대
- **표현욕**: 독창적인 마우스 커서 효과, 패럴렉스, Masonry 레이아웃으로 개성 표현
- **비주얼 임팩트**: 이미지 중심 풀스크린 갤러리로 방문자의 시선을 사로잡음
- **심리 패턴**: 완벽주의 + 표현욕 (디자이너의 작업물을 아름답게 보여줌)

---

## 2. AI 구현 프롬프트

> 이 섹션을 통째로 AI(Claude Code, Cursor 등)에 전달하면 템플릿을 구현할 수 있다.

```
## 컨텍스트
Linkmap(https://linkmap.vercel.app)의 원클릭 배포용 홈페이지 템플릿을 구현한다.
사용자가 GitHub 연결 → 템플릿 선택 → 환경변수 입력 → GitHub Pages 배포 3단계로 크리에이티브 포트폴리오 페이지를 생성한다.

## 템플릿: 크리에이티브 포트폴리오 (creative-portfolio)
- 타겟: UI/UX 디자이너, 그래픽 디자이너, 포토그래퍼
- 카테고리: 전문가 & 포트폴리오
- 핵심 목적: 비주얼 임팩트 극대화. 풀스크린 이미지 갤러리, 케이스 스터디, 마우스 인터랙션으로 디자이너의 작업물을 아름답게 보여줌

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 폰트: Pretendard(한글) + Inter(영문) via next/font
- 아이콘: Lucide React
- 다크모드: next-themes
- 애니메이션: framer-motion (패럴렉스, 스크롤 애니메이션, 커서 효과)
- SEO: next/metadata + JSON-LD
- OG 이미지: @vercel/og (/api/og)
- 배포: GitHub Pages (static export)

## 핵심 섹션
1. 히어로: 풀스크린 배경 이미지 또는 영상 + 이름 + 직함 (마우스 추적 패럴렉스 효과)
2. 프로젝트 갤러리: Masonry 그리드 이미지 갤러리 (hover 시 프로젝트명 오버레이 + 부드러운 확대)
3. 케이스 스터디: 개별 프로젝트 상세 (배경/과정/결과 스토리, 좌우 교차 레이아웃)
4. About: 자기소개 + 사용 도구 아이콘 그리드 (Figma, Photoshop, Illustrator, Sketch, After Effects 등)
5. Awards/Press: 수상 이력, 미디어 언급 (타임라인 형식)
6. Contact: 이메일 + Behance/Dribbble 링크 + 큰 CTA 텍스트

## 디자인 스펙
- 이미지 중심 디자인, 큰 여백(섹션 간 py-24 이상)
- 마우스 커서 커스텀 효과 (dot + circle follower, hover 시 확대)
- Masonry 레이아웃 (CSS columns 또는 grid 기반)
- 모노톤 베이스 + 포인트 컬러 1색
- framer-motion 스크롤 애니메이션 (fade-up, slide-in, scale)
- 컬러: 배경 #fafafa(라이트) / #0a0a0a(다크), 텍스트 #1a1a1a / #e5e5e5, 포인트 #ef4444
- 폰트: 이름 5xl~7xl font-light, 직함 xl font-light, 본문 base
- 이미지: 갤러리 아이템 aspect-auto, hover 시 scale-[1.03], object-cover

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 사이트 이름 (포트폴리오 제목)
- NEXT_PUBLIC_TITLE: 이름 또는 닉네임
- NEXT_PUBLIC_HERO_IMAGE_URL: 히어로 배경 이미지 URL
- NEXT_PUBLIC_HERO_VIDEO_URL: 히어로 배경 영상 URL (이미지 대신 사용)
- NEXT_PUBLIC_ABOUT: 자기소개 텍스트
- NEXT_PUBLIC_PROJECTS: 프로젝트 목록 JSON ([{"title":"...", "category":"...", "image_url":"...", "description":"...", "case_study_url":""}])
- NEXT_PUBLIC_TOOLS: 사용 도구 JSON ([{"name":"Figma", "icon":"figma"}])
- NEXT_PUBLIC_AWARDS: 수상/언론 목록 JSON ([{"title":"...", "org":"...", "year":"2024"}])
- NEXT_PUBLIC_BEHANCE_URL: Behance 프로필 URL
- NEXT_PUBLIC_DRIBBBLE_URL: Dribbble 프로필 URL
- NEXT_PUBLIC_EMAIL: 연락 이메일
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. `linkmap-templates/creative-portfolio` GitHub 레포에 Next.js 프로젝트 생성
2. 모든 개인화 데이터는 NEXT_PUBLIC_* 환경변수로 주입
3. 환경변수 미설정 시 매력적인 데모 데이터 표시 (가상의 디자이너 포트폴리오)
4. Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
5. 한국어 기본, lang="ko"
6. 반응형: 360px ~ 1440px
7. 다크모드 토글 포함
8. /api/og 엔드포인트로 동적 OG 이미지 생성
9. JSON-LD 구조화 데이터 (Person 타입 + portfolio 관련 속성)
10. 접근성: WCAG 2.1 AA, 키보드 내비게이션
11. 마우스 커서 커스텀 효과는 모바일에서 자동 비활성화
12. Masonry 레이아웃은 모바일에서 단일 열로 전환
13. 히어로 배경 영상은 autoplay, muted, loop, playsInline
14. 이미지 lazy loading + Next.js Image 컴포넌트 최적화
15. framer-motion은 prefers-reduced-motion 미디어 쿼리 대응
```

---

## 3. 핵심 섹션 정의

### 섹션 1: 히어로 (Hero)
- **위치**: 페이지 최상단 (풀스크린 100vh)
- **구성**:
  - 배경: 풀스크린 이미지(`NEXT_PUBLIC_HERO_IMAGE_URL`) 또는 영상(`NEXT_PUBLIC_HERO_VIDEO_URL`)
  - 오버레이: 반투명 그라데이션 (`bg-gradient-to-b from-black/40 via-transparent to-black/60`)
  - 중앙: 이름(5xl~7xl, font-light) + 직함(xl, font-light, tracking-widest uppercase)
  - 하단: 스크롤 유도 화살표 (bounce 애니메이션)
- **인터랙션**:
  - 마우스 추적 패럴렉스: 텍스트가 마우스 반대 방향으로 미세하게 이동 (translateX/Y 최대 20px)
  - framer-motion `useMotionValue` + `useTransform` 활용
- **데이터**: `NEXT_PUBLIC_TITLE` (이름), `NEXT_PUBLIC_HERO_IMAGE_URL` 또는 `NEXT_PUBLIC_HERO_VIDEO_URL`
- **폴백**: 데모용 그라데이션 배경 + "김수빈" + "UI/UX Designer"

### 섹션 2: 프로젝트 갤러리 (Project Gallery)
- **위치**: 히어로 아래 (py-24)
- **구성**:
  - 섹션 타이틀: "Selected Works" (text-sm uppercase tracking-widest)
  - Masonry 그리드: 2~3열 (md:columns-2 lg:columns-3, gap-4)
  - 각 아이템: 이미지 + hover 오버레이(프로젝트명 + 카테고리)
- **인터랙션**:
  - hover → 이미지 `scale-[1.03]`, 오버레이 fade-in (bg-black/60)
  - 스크롤 진입 시 staggered fade-up 애니메이션 (stagger 0.1s)
  - 클릭 시 케이스 스터디 섹션으로 스크롤 또는 외부 링크
- **데이터**: `NEXT_PUBLIC_PROJECTS` JSON 배열
- **폴백**: 데모 프로젝트 6개 (placeholder 이미지 + 가상 프로젝트명)

### 섹션 3: 케이스 스터디 (Case Study)
- **위치**: 갤러리 아래 (py-24, 각 케이스 스터디 간 py-16)
- **구성**:
  - 좌우 교차 레이아웃 (홀수: 이미지 좌 + 텍스트 우, 짝수: 반대)
  - 각 항목: 프로젝트명(3xl) + 카테고리 태그 + 설명 텍스트(lg, leading-relaxed) + 이미지
  - 하단에 "자세히 보기" 링크 (case_study_url이 있을 경우)
- **인터랙션**:
  - 스크롤 진입 시 이미지 slide-in-left/right, 텍스트 fade-up
  - 이미지 hover 시 미세한 확대(scale-[1.02])
- **데이터**: `NEXT_PUBLIC_PROJECTS`에서 description이 있는 항목만 필터링
- **폴백**: 데모 데이터 3개 (배경/과정/결과 스토리 포함)

### 섹션 4: About
- **위치**: 케이스 스터디 아래 (py-24)
- **구성**:
  - 좌: 프로필 사진 (rounded, aspect-square, max-w-sm)
  - 우: 자기소개 텍스트(lg, leading-relaxed) + 사용 도구 아이콘 그리드(4~6열)
  - 도구 아이콘: 각 도구명 + 아이콘 (hover 시 tooltip 표시)
- **인터랙션**:
  - 스크롤 진입 시 fade-up 애니메이션
  - 도구 아이콘 hover → scale(1.1) + 도구명 tooltip
- **데이터**: `NEXT_PUBLIC_ABOUT`, `NEXT_PUBLIC_TOOLS` JSON
- **폴백**: 가상의 디자이너 자기소개 + Figma/Photoshop/Illustrator/Sketch/After Effects

### 섹션 5: Awards / Press
- **위치**: About 아래 (py-24)
- **구성**:
  - 섹션 타이틀: "Awards & Recognition"
  - 타임라인 형식: 연도(좌) + 수상명/미디어명 + 수여 기관(우)
  - 각 항목: `border-b border-neutral-200 dark:border-neutral-800` 구분선
- **인터랙션**:
  - 스크롤 진입 시 staggered fade-up
  - hover → 수평 슬라이드 인디케이터 애니메이션
- **데이터**: `NEXT_PUBLIC_AWARDS` JSON 배열
- **폴백**: 데모 수상 이력 4개 (iF Design Award, Red Dot, Behance Featured 등)

### 섹션 6: Contact
- **위치**: 페이지 최하단 (py-32, 풀폭 배경)
- **구성**:
  - 큰 텍스트: "Let's work together" (5xl~7xl, font-light)
  - 이메일 링크 (2xl, underline hover 효과)
  - Behance + Dribbble 아이콘 링크
  - "Powered by Linkmap" 푸터 텍스트
- **인터랙션**:
  - 이메일 hover → 밑줄이 좌에서 우로 슬라이드
  - SNS 아이콘 hover → scale(1.1) + 컬러 전환
- **데이터**: `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_BEHANCE_URL`, `NEXT_PUBLIC_DRIBBBLE_URL`
- **폴백**: "hello@example.com" + 빈 SNS 링크

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:---:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 사이트 이름 (포트폴리오 제목) | O | `'수빈의 포트폴리오'` |
| `NEXT_PUBLIC_TITLE` | 이름 또는 닉네임 | | `'김수빈'` |
| `NEXT_PUBLIC_HERO_IMAGE_URL` | 히어로 배경 이미지 URL | | `null` (그라데이션 폴백) |
| `NEXT_PUBLIC_HERO_VIDEO_URL` | 히어로 배경 영상 URL | | `null` (이미지 또는 그라데이션 폴백) |
| `NEXT_PUBLIC_ABOUT` | 자기소개 텍스트 | | `'사용자 경험을 디자인합니다...'` (데모 텍스트) |
| `NEXT_PUBLIC_PROJECTS` | 프로젝트 목록 (JSON) | | 데모 프로젝트 6개 |
| `NEXT_PUBLIC_TOOLS` | 사용 도구 목록 (JSON) | | `[{"name":"Figma"},{"name":"Photoshop"},...]` |
| `NEXT_PUBLIC_AWARDS` | 수상/언론 목록 (JSON) | | 데모 수상 이력 4개 |
| `NEXT_PUBLIC_BEHANCE_URL` | Behance 프로필 URL | | `null` (미표시) |
| `NEXT_PUBLIC_DRIBBBLE_URL` | Dribbble 프로필 URL | | `null` (미표시) |
| `NEXT_PUBLIC_EMAIL` | 연락 이메일 | | `'hello@example.com'` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | `null` (미추적) |

---

## 5. 디자인 스펙

### 컬러

| 용도 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경 | `#fafafa` | `#0a0a0a` |
| 텍스트 (주) | `#1a1a1a` | `#e5e5e5` |
| 텍스트 (보조) | `#737373` | `#a3a3a3` |
| 포인트 | `#ef4444` (red-500) | `#ef4444` |
| 구분선 | `#e5e5e5` | `#262626` |
| 오버레이 | `rgba(0,0,0,0.6)` | `rgba(0,0,0,0.7)` |
| 히어로 오버레이 | `from-black/40 via-transparent to-black/60` | 동일 |

### 타이포그래피

| 요소 | 크기 | 굵기 | 기타 |
|------|------|------|------|
| 히어로 이름 | `text-5xl md:text-7xl` | `font-light` | Pretendard |
| 히어로 직함 | `text-xl` | `font-light` | `tracking-widest uppercase`, Inter |
| 섹션 타이틀 | `text-sm` | `font-medium` | `tracking-widest uppercase`, Inter |
| 프로젝트명 | `text-3xl` | `font-light` | Pretendard |
| 본문 텍스트 | `text-base md:text-lg` | `font-normal` | `leading-relaxed`, Pretendard |
| Contact CTA | `text-5xl md:text-7xl` | `font-light` | Pretendard |
| 이메일 링크 | `text-xl md:text-2xl` | `font-normal` | Inter |
| 푸터 | `text-xs` | `font-normal` | `text-neutral-400` |

### 레이아웃

- 전체: `min-h-screen bg-neutral-50 dark:bg-neutral-950`
- 콘텐츠 영역: `max-w-7xl mx-auto px-6 md:px-12 lg:px-24`
- 히어로: `h-screen w-full relative overflow-hidden`
- 갤러리: `columns-1 md:columns-2 lg:columns-3 gap-4`
- 케이스 스터디: `grid grid-cols-1 md:grid-cols-2 gap-12 items-center`
- About: `grid grid-cols-1 md:grid-cols-2 gap-12`
- Awards: `max-w-4xl mx-auto` (좁은 폭)
- Contact: `text-center py-32`
- 섹션 간격: `py-24 md:py-32`

### 반응형 브레이크포인트

| 브레이크포인트 | 갤러리 열 | 히어로 텍스트 | 레이아웃 |
|--------------|----------|-------------|---------|
| 360px (모바일) | 1열 | text-4xl | 단일 열, 커서 효과 비활성화 |
| 640px (sm) | 1열 | text-5xl | 단일 열 |
| 768px (md) | 2열 | text-6xl | 2열 그리드 |
| 1024px (lg) | 3열 | text-7xl | 좌우 교차 레이아웃 활성화 |
| 1440px (xl) | 3열 (max-w-7xl) | text-7xl | 최대폭 고정 |

---

## 6. 컴포넌트 구조

```
linkmap-templates/creative-portfolio/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트(Pretendard+Inter), ThemeProvider
│   │   ├── page.tsx                # 메인 페이지 (섹션 조합)
│   │   └── api/og/route.tsx        # OG 이미지 동적 생성
│   ├── components/
│   │   ├── hero-section.tsx        # 풀스크린 히어로 + 패럴렉스 효과
│   │   ├── project-gallery.tsx     # Masonry 그리드 이미지 갤러리
│   │   ├── case-study-card.tsx     # 개별 케이스 스터디 (좌우 교차)
│   │   ├── about-section.tsx       # 자기소개 + 도구 아이콘
│   │   ├── awards-section.tsx      # 수상/언론 타임라인
│   │   ├── contact-section.tsx     # Contact CTA + 이메일 + SNS
│   │   ├── custom-cursor.tsx       # 마우스 커서 커스텀 효과 (dot + circle)
│   │   └── nav-header.tsx          # 상단 네비게이션 (이름 + 다크모드 토글)
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
| `layout.tsx` | Server | 메타데이터, Pretendard+Inter 폰트 로드, ThemeProvider, JSON-LD |
| `page.tsx` | Server | config 읽기, 섹션 컴포넌트 조합 (Hero → Gallery → CaseStudy → About → Awards → Contact) |
| `hero-section.tsx` | Client | 풀스크린 배경 이미지/영상, 이름+직함, 마우스 추적 패럴렉스 (framer-motion useMotionValue) |
| `project-gallery.tsx` | Client | Masonry 그리드, hover 오버레이, staggered scroll 애니메이션 |
| `case-study-card.tsx` | Client | 좌우 교차 레이아웃, 이미지+텍스트, slide-in 애니메이션 |
| `about-section.tsx` | Client | 프로필 사진, 자기소개, 도구 아이콘 그리드 (hover tooltip) |
| `awards-section.tsx` | Client | 타임라인 형식 수상 이력, staggered fade-up |
| `contact-section.tsx` | Client | 큰 CTA 텍스트, 이메일 링크, Behance/Dribbble 아이콘 |
| `custom-cursor.tsx` | Client | dot(8px) + circle(40px) follower, hover 시 확대, 모바일 자동 비활성화 |
| `nav-header.tsx` | Client | 고정 상단 바 (이름 좌측 + 다크모드 토글 우측), 스크롤 시 배경 blur |
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
  'b2c3d4e5-0011-4000-9000-000000000011',
  'creative-portfolio',
  'Creative Portfolio',
  '크리에이티브 포트폴리오',
  'Full-screen image gallery portfolio with masonry layout, case studies, parallax effects, and custom cursor interactions. Designed for designers and visual creatives.',
  '풀스크린 이미지 갤러리 포트폴리오. Masonry 레이아웃, 케이스 스터디, 패럴렉스 효과, 커스텀 커서 인터랙션. 디자이너와 비주얼 크리에이터를 위한 템플릿.',
  NULL,
  'linkmap-templates',
  'creative-portfolio',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "사이트 이름 (포트폴리오 제목)", "required": true},
    {"key": "NEXT_PUBLIC_TITLE", "description": "이름 또는 닉네임", "required": false},
    {"key": "NEXT_PUBLIC_HERO_IMAGE_URL", "description": "히어로 배경 이미지 URL", "required": false},
    {"key": "NEXT_PUBLIC_HERO_VIDEO_URL", "description": "히어로 배경 영상 URL", "required": false},
    {"key": "NEXT_PUBLIC_ABOUT", "description": "자기소개 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_PROJECTS", "description": "프로젝트 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_TOOLS", "description": "사용 도구 JSON", "required": false},
    {"key": "NEXT_PUBLIC_AWARDS", "description": "수상/언론 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_BEHANCE_URL", "description": "Behance 프로필 URL", "required": false},
    {"key": "NEXT_PUBLIC_DRIBBBLE_URL", "description": "Dribbble 프로필 URL", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "연락 이메일", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['portfolio', 'creative', 'designer', 'gallery', 'masonry', 'visual', 'nextjs'],
  false,
  true,
  11
) ON CONFLICT (slug) DO NOTHING;
```

### 7.2 TypeScript 시드 (`homepage-templates.ts` 추가분)

```typescript
{
  id: 'b2c3d4e5-0011-4000-9000-000000000011',
  slug: 'creative-portfolio',
  name: 'Creative Portfolio',
  name_ko: '크리에이티브 포트폴리오',
  description: 'Full-screen image gallery portfolio with masonry layout, case studies, parallax effects, and custom cursor interactions. Designed for designers and visual creatives.',
  description_ko: '풀스크린 이미지 갤러리 포트폴리오. Masonry 레이아웃, 케이스 스터디, 패럴렉스 효과, 커스텀 커서 인터랙션. 디자이너와 비주얼 크리에이터를 위한 템플릿.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'creative-portfolio',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '사이트 이름 (포트폴리오 제목)', required: true },
    { key: 'NEXT_PUBLIC_TITLE', description: '이름 또는 닉네임', required: false },
    { key: 'NEXT_PUBLIC_HERO_IMAGE_URL', description: '히어로 배경 이미지 URL', required: false },
    { key: 'NEXT_PUBLIC_HERO_VIDEO_URL', description: '히어로 배경 영상 URL', required: false },
    { key: 'NEXT_PUBLIC_ABOUT', description: '자기소개 텍스트', required: false },
    { key: 'NEXT_PUBLIC_PROJECTS', description: '프로젝트 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_TOOLS', description: '사용 도구 JSON', required: false },
    { key: 'NEXT_PUBLIC_AWARDS', description: '수상/언론 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_BEHANCE_URL', description: 'Behance 프로필 URL', required: false },
    { key: 'NEXT_PUBLIC_DRIBBBLE_URL', description: 'Dribbble 프로필 URL', required: false },
    { key: 'NEXT_PUBLIC_EMAIL', description: '연락 이메일', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['portfolio', 'creative', 'designer', 'gallery', 'masonry', 'visual', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 11,
}
```

---

## 8. 검증 체크리스트

### 기능
- [ ] 히어로 풀스크린 배경 이미지 정상 표시
- [ ] 히어로 배경 영상 autoplay/muted/loop 동작
- [ ] 마우스 추적 패럴렉스 효과 동작
- [ ] Masonry 그리드 갤러리 정상 렌더링 (2~3열)
- [ ] 갤러리 hover 시 프로젝트명 오버레이 표시
- [ ] 케이스 스터디 좌우 교차 레이아웃 표시
- [ ] About 섹션 도구 아이콘 + tooltip 동작
- [ ] Awards 타임라인 렌더링
- [ ] Contact 이메일 링크 + SNS 아이콘 동작
- [ ] 커스텀 커서 dot + circle 효과 동작
- [ ] 커스텀 커서 모바일에서 자동 비활성화
- [ ] 환경변수 미설정 시 데모 데이터 정상 표시
- [ ] 다크모드 토글 동작
- [ ] 스크롤 애니메이션 (fade-up, slide-in) 동작

### 성능
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 90+
- [ ] Lighthouse Best Practices 90+
- [ ] Lighthouse SEO 90+
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] 이미지 lazy loading 적용 확인
- [ ] framer-motion 번들 사이즈 최적화 (tree-shaking)

### 접근성
- [ ] 키보드 내비게이션 (Tab 순서, 갤러리 아이템 포커스)
- [ ] 스크린리더 호환 (aria-label, alt 텍스트)
- [ ] 컬러 대비 WCAG 2.1 AA 준수
- [ ] prefers-reduced-motion 대응 (애니메이션 비활성화)
- [ ] 커스텀 커서가 기본 커서 기능을 방해하지 않음

### SEO
- [ ] OG 메타태그 정상 생성
- [ ] JSON-LD Person 구조화 데이터
- [ ] /api/og 이미지 생성 확인
- [ ] robots.txt 존재
- [ ] sitemap.xml 생성
