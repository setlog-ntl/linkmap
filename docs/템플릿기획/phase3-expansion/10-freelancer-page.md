# 프리랜서 페이지 (Freelancer Page) 기획서

## 1. 개요

| 항목 | 내용 |
|------|------|
| 슬러그 | `freelancer-page` |
| UUID | `b2c3d4e5-0012-4000-9000-000000000012` |
| 카테고리 | 비즈니스 & 커머스 |
| 타겟 페르소나 | 프리랜서 개발자, 디자이너, 마케터 (페르소나: 프리랜서 "동건", 32세) |
| 우선순위 | 10위 (총점 78/100) |
| Phase | Phase 3: 확장 |
| 구현 일정 | 3일 |
| 비고 | 서비스 목록 + 포트폴리오 + 후기 + 문의 폼. 신뢰 구축 중심 |

### 핵심 가치
- **신뢰 구축**: 클라이언트 후기, 경력/자격 정보로 전문성 입증
- **전환 최적화**: 서비스 목록 → 포트폴리오 → 후기 → 문의 폼의 자연스러운 전환 퍼널
- **프로세스 투명성**: "함께 일하는 방법" 섹션으로 협업 과정을 명확히 제시
- **심리 패턴**: 사회적 증거(후기) + 권위(경력) + 행동 유도(CTA)

---

## 2. AI 구현 프롬프트

> 이 섹션을 통째로 AI(Claude Code, Cursor 등)에 전달하면 템플릿을 구현할 수 있다.

```
## 컨텍스트
Linkmap(https://linkmap.vercel.app)의 원클릭 배포용 홈페이지 템플릿을 구현한다.
사용자가 GitHub 연결 → 템플릿 선택 → 환경변수 입력 → GitHub Pages 배포 3단계로 프리랜서 홍보 페이지를 생성한다.

## 템플릿: 프리랜서 페이지 (freelancer-page)
- 타겟: 프리랜서 개발자, 디자이너, 마케터
- 카테고리: 비즈니스 & 커머스
- 핵심 목적: 신뢰 구축 + 전환 최적화. 서비스 목록, 포트폴리오, 클라이언트 후기, 문의 폼을 통한 프리랜서 영업 페이지

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 폰트: Pretendard(한글) + Inter(영문) via next/font
- 아이콘: Lucide React
- 다크모드: next-themes
- SEO: next/metadata + JSON-LD
- OG 이미지: @vercel/og (/api/og)
- 배포: GitHub Pages (static export)

## 핵심 섹션
1. 히어로: 이름 + 전문 분야 + CTA 버튼 "프로젝트 문의하기" (프로필 사진 포함)
2. 서비스 목록: 제공 서비스 카드 3~6개 (아이콘 + 제목 + 설명 + 가격대)
3. 포트폴리오: 프로젝트 카드 그리드 (이미지 + 제목 + 카테고리 필터)
4. 클라이언트 후기: 후기 카드 (사진 + 이름 + 후기 텍스트 + 별점)
5. 경력/자격: 주요 경력, 자격증, 수상 이력 (타임라인 형식)
6. 프로세스: "함께 일하는 방법" 4단계 프로세스 (아이콘 + 제목 + 설명)
7. 문의 폼: 이름 + 이메일 + 메시지 (mailto: 기반 or Formspree 연동)
8. 푸터: SNS 링크 + Powered by Linkmap

## 디자인 스펙
- 전문적이고 신뢰감 있는 톤
- 화이트 배경 + 네이비/다크블루 악센트
- 후기 섹션 강조 (카드 그림자 + 별점 시각화)
- 서비스 카드: hover 시 border-color 전환 + 미세 lift
- 프로세스: 가로 스텝 인디케이터 (1→2→3→4 연결선)
- 컬러: 배경 #ffffff(라이트) / #0f172a(다크), 악센트 #1e40af(blue-800), 별점 #f59e0b(amber-500)
- 폰트: 이름 4xl font-bold, 직함 xl, 본문 base, 서비스 제목 lg

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 사이트 이름
- NEXT_PUBLIC_TITLE: 이름
- NEXT_PUBLIC_TAGLINE: 전문 분야 한 줄 소개
- NEXT_PUBLIC_AVATAR_URL: 프로필 사진 URL
- NEXT_PUBLIC_SERVICES: 서비스 목록 JSON ([{"title":"...", "description":"...", "icon":"code", "price":"월 200만원~"}])
- NEXT_PUBLIC_PORTFOLIO: 포트폴리오 JSON ([{"title":"...", "category":"웹개발", "image_url":"...", "url":"..."}])
- NEXT_PUBLIC_TESTIMONIALS: 클라이언트 후기 JSON ([{"name":"...", "company":"...", "avatar_url":"...", "text":"...", "rating":5}])
- NEXT_PUBLIC_EXPERIENCE: 경력/자격 JSON ([{"title":"...", "org":"...", "period":"2020-2023", "type":"career|cert|award"}])
- NEXT_PUBLIC_PROCESS: 프로세스 JSON ([{"step":1, "title":"상담", "description":"...", "icon":"message-circle"}])
- NEXT_PUBLIC_EMAIL: 문의 이메일
- NEXT_PUBLIC_SOCIALS: SNS 링크 JSON ([{"platform":"github", "url":"..."}])
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. `linkmap-templates/freelancer-page` GitHub 레포에 Next.js 프로젝트 생성
2. 모든 개인화 데이터는 NEXT_PUBLIC_* 환경변수로 주입
3. 환경변수 미설정 시 매력적인 데모 데이터 표시 (가상의 프리랜서 프로필)
4. Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
5. 한국어 기본, lang="ko"
6. 반응형: 360px ~ 1440px
7. 다크모드 토글 포함
8. /api/og 엔드포인트로 동적 OG 이미지 생성
9. JSON-LD 구조화 데이터 (Person + ProfessionalService 타입)
10. 접근성: WCAG 2.1 AA, 키보드 내비게이션
11. 문의 폼은 mailto: 링크 기반 (서버 불필요), Formspree 환경변수 설정 시 fetch 전송
12. 별점은 Lucide Star 아이콘으로 시각화 (filled/empty)
13. 포트폴리오 카테고리 필터는 클라이언트 사이드 (카테고리 탭 클릭)
14. 프로세스 섹션은 가로 스텝 인디케이터 (모바일에서 세로 전환)
```

---

## 3. 핵심 섹션 정의

### 섹션 1: 히어로
- **위치**: 페이지 최상단 (py-20 md:py-32)
- **구성**:
  - 좌: 이름(4xl, font-bold) + 직함/태그라인(xl, text-blue-800) + 소개 텍스트(lg) + CTA 버튼 "프로젝트 문의하기"
  - 우: 프로필 사진 (rounded-2xl, aspect-square, max-w-sm, 그림자)
  - 모바일: 사진 상단 → 텍스트 하단 (세로 정렬)
- **인터랙션**:
  - CTA 버튼 hover → bg-blue-700, 부드러운 transition
  - CTA 클릭 → 문의 폼 섹션으로 smooth scroll
- **데이터**: `NEXT_PUBLIC_TITLE`, `NEXT_PUBLIC_TAGLINE`, `NEXT_PUBLIC_AVATAR_URL`
- **폴백**: "박동건" + "풀스택 개발자 | 5년 경력" + 이니셜 아바타

### 섹션 2: 서비스 목록
- **위치**: 히어로 아래 (py-20, bg-neutral-50 dark:bg-neutral-900)
- **구성**:
  - 섹션 타이틀: "제공 서비스" + 부제
  - 3열 그리드 (md:grid-cols-2 lg:grid-cols-3)
  - 각 카드: Lucide 아이콘(48px) + 제목(lg, font-semibold) + 설명(base) + 가격대(sm, text-blue-600)
  - 카드: `bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700`
- **인터랙션**:
  - hover → `border-blue-500`, `shadow-lg`, 미세 lift (`-translate-y-1`)
  - 아이콘 hover → 컬러 전환 (neutral → blue)
- **데이터**: `NEXT_PUBLIC_SERVICES` JSON 배열
- **폴백**: 데모 서비스 3개 (웹 개발, 모바일 앱, 기술 컨설팅)

### 섹션 3: 포트폴리오
- **위치**: 서비스 아래 (py-20)
- **구성**:
  - 섹션 타이틀: "포트폴리오"
  - 카테고리 필터 탭: "전체" + 각 카테고리 (pill 버튼, 활성 시 bg-blue-800 text-white)
  - 프로젝트 카드 그리드 (md:grid-cols-2 lg:grid-cols-3)
  - 각 카드: 이미지(aspect-video, rounded-t-xl) + 제목 + 카테고리 태그 + 외부 링크 아이콘
- **인터랙션**:
  - 카테고리 탭 클릭 → 필터링 (fade 애니메이션)
  - 카드 hover → 이미지 scale(1.05), 그림자 강화
  - 카드 클릭 → 외부 URL 새 탭
- **데이터**: `NEXT_PUBLIC_PORTFOLIO` JSON 배열
- **폴백**: 데모 프로젝트 6개 (다양한 카테고리)

### 섹션 4: 클라이언트 후기
- **위치**: 포트폴리오 아래 (py-20, bg-neutral-50 dark:bg-neutral-900)
- **구성**:
  - 섹션 타이틀: "클라이언트 후기"
  - 후기 카드 그리드 (md:grid-cols-2 lg:grid-cols-3)
  - 각 카드: 인용부호("") + 후기 텍스트(base, italic) + 별점(Star 아이콘 5개) + 아바타(40px rounded-full) + 이름 + 소속
  - 카드: `bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm`
- **인터랙션**:
  - 스크롤 진입 시 staggered fade-up
  - 별점: filled(amber-500) / empty(neutral-300) Star 아이콘
- **데이터**: `NEXT_PUBLIC_TESTIMONIALS` JSON 배열
- **폴백**: 데모 후기 3개 (5점, 4점, 5점)

### 섹션 5: 경력/자격
- **위치**: 후기 아래 (py-20)
- **구성**:
  - 섹션 타이틀: "경력 & 자격"
  - 세로 타임라인: 좌측 연결선 + 각 항목(타이틀 + 기관/회사 + 기간)
  - 타입별 아이콘: career(Briefcase), cert(Award), award(Trophy)
  - 기간: `text-sm text-neutral-500`
- **인터랙션**:
  - 스크롤 진입 시 순차 fade-in (stagger 0.15s)
  - 타임라인 연결선은 CSS `border-l-2` + `before:` 도트
- **데이터**: `NEXT_PUBLIC_EXPERIENCE` JSON 배열
- **폴백**: 데모 경력 5개

### 섹션 6: 프로세스
- **위치**: 경력 아래 (py-20, bg-neutral-50 dark:bg-neutral-900)
- **구성**:
  - 섹션 타이틀: "함께 일하는 방법"
  - 가로 4단계: 번호 원형 뱃지(bg-blue-800 text-white) + 아이콘 + 제목(font-semibold) + 설명(sm)
  - 단계 간 연결선(점선, `border-dashed border-t-2`)
  - 모바일: 세로 타임라인으로 전환
- **인터랙션**:
  - 스크롤 진입 시 순차 scale-in (0.8→1)
  - hover → 번호 뱃지 scale(1.1)
- **데이터**: `NEXT_PUBLIC_PROCESS` JSON 배열
- **폴백**: 4단계 (상담 → 견적/제안 → 작업 진행 → 납품/피드백)

### 섹션 7: 문의 폼
- **위치**: 프로세스 아래 (py-20)
- **구성**:
  - 섹션 타이틀: "프로젝트를 함께 시작해요"
  - 폼: 이름(input) + 이메일(input) + 프로젝트 유형(select) + 메시지(textarea) + 제출 버튼
  - 제출: `mailto:` 기반 (기본) 또는 Formspree 연동
- **인터랙션**:
  - input focus → border-blue-500, ring-2 ring-blue-500/20
  - 제출 버튼 hover → bg-blue-700
  - 유효성 검사: required 필드 빈 값 시 경고
- **데이터**: `NEXT_PUBLIC_EMAIL`
- **폴백**: "hello@example.com"

### 섹션 8: 푸터
- **위치**: 페이지 최하단 (py-8, border-t)
- **구성**:
  - SNS 아이콘 링크 (GitHub, LinkedIn, Twitter 등)
  - "Powered by Linkmap" 텍스트
  - 다크모드 토글
- **데이터**: `NEXT_PUBLIC_SOCIALS` JSON
- **폴백**: 빈 SNS + Powered by Linkmap

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:---:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 사이트 이름 | O | `'동건의 프리랜서 페이지'` |
| `NEXT_PUBLIC_TITLE` | 이름 | | `'박동건'` |
| `NEXT_PUBLIC_TAGLINE` | 전문 분야 한 줄 소개 | | `'풀스택 개발자 | 5년 경력 | 스타트업 전문'` |
| `NEXT_PUBLIC_AVATAR_URL` | 프로필 사진 URL | | `null` (이니셜 아바타) |
| `NEXT_PUBLIC_SERVICES` | 서비스 목록 (JSON) | | 데모 서비스 3개 |
| `NEXT_PUBLIC_PORTFOLIO` | 포트폴리오 (JSON) | | 데모 프로젝트 6개 |
| `NEXT_PUBLIC_TESTIMONIALS` | 클라이언트 후기 (JSON) | | 데모 후기 3개 |
| `NEXT_PUBLIC_EXPERIENCE` | 경력/자격 (JSON) | | 데모 경력 5개 |
| `NEXT_PUBLIC_PROCESS` | 프로세스 단계 (JSON) | | 4단계 기본 프로세스 |
| `NEXT_PUBLIC_EMAIL` | 문의 이메일 | | `'hello@example.com'` |
| `NEXT_PUBLIC_SOCIALS` | SNS 링크 (JSON) | | `[]` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | `null` (미추적) |

---

## 5. 디자인 스펙

### 컬러

| 용도 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경 (주) | `#ffffff` | `#0f172a` (slate-900) |
| 배경 (보조) | `#f8fafc` (slate-50) | `#1e293b` (slate-800) |
| 텍스트 (주) | `#0f172a` (slate-900) | `#f1f5f9` (slate-100) |
| 텍스트 (보조) | `#64748b` (slate-500) | `#94a3b8` (slate-400) |
| 악센트 | `#1e40af` (blue-800) | `#3b82f6` (blue-500) |
| 악센트 hover | `#1e3a8a` (blue-900) | `#60a5fa` (blue-400) |
| 별점 | `#f59e0b` (amber-500) | `#f59e0b` |
| 카드 보더 | `#e2e8f0` (slate-200) | `#334155` (slate-700) |
| 카드 보더 hover | `#3b82f6` (blue-500) | `#3b82f6` |

### 타이포그래피

| 요소 | 크기 | 굵기 | 기타 |
|------|------|------|------|
| 히어로 이름 | `text-3xl md:text-4xl` | `font-bold` | Pretendard |
| 태그라인 | `text-lg md:text-xl` | `font-medium` | `text-blue-800 dark:text-blue-400`, Inter |
| 섹션 타이틀 | `text-2xl md:text-3xl` | `font-bold` | Pretendard |
| 섹션 부제 | `text-base md:text-lg` | `font-normal` | `text-slate-500` |
| 서비스 제목 | `text-lg` | `font-semibold` | Pretendard |
| 본문 텍스트 | `text-base` | `font-normal` | `leading-relaxed` |
| 가격대 | `text-sm` | `font-medium` | `text-blue-600 dark:text-blue-400` |
| 후기 텍스트 | `text-base` | `font-normal` | `italic leading-relaxed` |
| 푸터 | `text-sm` | `font-normal` | `text-slate-500` |

### 레이아웃

- 전체: `min-h-screen bg-white dark:bg-slate-900`
- 콘텐츠 영역: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`
- 히어로: `grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20 md:py-32`
- 서비스: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- 포트폴리오: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- 후기: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- 경력: `max-w-2xl mx-auto` (좁은 폭 타임라인)
- 프로세스: `grid grid-cols-1 md:grid-cols-4 gap-8` (모바일: 세로)
- 문의: `max-w-xl mx-auto`
- 섹션 간격: `py-16 md:py-20`

### 반응형 브레이크포인트

| 브레이크포인트 | 히어로 | 서비스/포트폴리오 | 프로세스 |
|--------------|--------|-----------------|---------|
| 360px (모바일) | 단일 열 (사진 상단) | 1열 | 세로 타임라인 |
| 640px (sm) | 단일 열 | 1열 | 세로 타임라인 |
| 768px (md) | 2열 (좌우 배치) | 2열 | 4열 가로 |
| 1024px (lg) | 2열 | 3열 | 4열 가로 |
| 1440px (xl) | max-w-6xl 고정 | 3열 | 4열 가로 |

---

## 6. 컴포넌트 구조

```
linkmap-templates/freelancer-page/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트(Pretendard+Inter), ThemeProvider
│   │   ├── page.tsx                # 메인 페이지 (섹션 조합)
│   │   └── api/og/route.tsx        # OG 이미지 동적 생성
│   ├── components/
│   │   ├── hero-section.tsx        # 이름 + 태그라인 + CTA + 프로필 사진
│   │   ├── services-section.tsx    # 서비스 카드 그리드
│   │   ├── portfolio-section.tsx   # 카테고리 필터 + 프로젝트 카드 그리드
│   │   ├── testimonials-section.tsx # 클라이언트 후기 카드 + 별점
│   │   ├── experience-section.tsx  # 경력/자격 타임라인
│   │   ├── process-section.tsx     # 4단계 프로세스 (가로/세로)
│   │   ├── contact-section.tsx     # 문의 폼 (mailto/Formspree)
│   │   ├── footer.tsx              # SNS + Powered by Linkmap
│   │   ├── star-rating.tsx         # 별점 컴포넌트 (재사용)
│   │   └── nav-header.tsx          # 고정 네비게이션 + 다크모드 토글
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
| `layout.tsx` | Server | 메타데이터, Pretendard+Inter 폰트 로드, ThemeProvider, JSON-LD (Person+ProfessionalService) |
| `page.tsx` | Server | config 읽기, 섹션 컴포넌트 조합 (Hero → Services → Portfolio → Testimonials → Experience → Process → Contact → Footer) |
| `hero-section.tsx` | Client | 이름, 태그라인, CTA 버튼 (smooth scroll to contact), 프로필 사진 |
| `services-section.tsx` | Client | SERVICES JSON 파싱, 서비스 카드 그리드 렌더링 (Lucide 아이콘 매핑) |
| `portfolio-section.tsx` | Client | PORTFOLIO JSON 파싱, 카테고리 필터 탭, 프로젝트 카드 그리드 (필터 상태 관리) |
| `testimonials-section.tsx` | Client | TESTIMONIALS JSON 파싱, 후기 카드 렌더링, StarRating 컴포넌트 사용 |
| `experience-section.tsx` | Client | EXPERIENCE JSON 파싱, 타임라인 렌더링 (타입별 아이콘 매핑) |
| `process-section.tsx` | Client | PROCESS JSON 파싱, 가로 4단계 스텝 인디케이터 (모바일: 세로 전환) |
| `contact-section.tsx` | Client | 문의 폼 (이름/이메일/유형/메시지), mailto: 링크 생성 또는 Formspree fetch |
| `footer.tsx` | Client | SOCIALS JSON 파싱, SNS 아이콘, Powered by Linkmap |
| `star-rating.tsx` | Client | rating 숫자 → Star 아이콘 시각화 (filled amber/empty neutral) |
| `nav-header.tsx` | Client | 고정 상단 바 (이름 + 섹션 링크 + 다크모드 토글), 스크롤 시 배경 blur |
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
  'b2c3d4e5-0012-4000-9000-000000000012',
  'freelancer-page',
  'Freelancer Page',
  '프리랜서 페이지',
  'Professional freelancer page with service listings, portfolio grid with category filter, client testimonials with star ratings, work process steps, and contact form. Built for trust and conversion.',
  '프리랜서 전문 홍보 페이지. 서비스 목록, 카테고리 필터 포트폴리오, 별점 후기, 업무 프로세스, 문의 폼. 신뢰 구축과 전환 최적화에 최적화.',
  NULL,
  'linkmap-templates',
  'freelancer-page',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "사이트 이름", "required": true},
    {"key": "NEXT_PUBLIC_TITLE", "description": "이름", "required": false},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "전문 분야 한 줄 소개", "required": false},
    {"key": "NEXT_PUBLIC_AVATAR_URL", "description": "프로필 사진 URL", "required": false},
    {"key": "NEXT_PUBLIC_SERVICES", "description": "서비스 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_PORTFOLIO", "description": "포트폴리오 JSON", "required": false},
    {"key": "NEXT_PUBLIC_TESTIMONIALS", "description": "클라이언트 후기 JSON", "required": false},
    {"key": "NEXT_PUBLIC_EXPERIENCE", "description": "경력/자격 JSON", "required": false},
    {"key": "NEXT_PUBLIC_PROCESS", "description": "업무 프로세스 JSON", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "문의 이메일", "required": false},
    {"key": "NEXT_PUBLIC_SOCIALS", "description": "SNS 링크 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['freelancer', 'services', 'portfolio', 'testimonials', 'business', 'nextjs'],
  false,
  true,
  12
) ON CONFLICT (slug) DO NOTHING;
```

### 7.2 TypeScript 시드 (`homepage-templates.ts` 추가분)

```typescript
{
  id: 'b2c3d4e5-0012-4000-9000-000000000012',
  slug: 'freelancer-page',
  name: 'Freelancer Page',
  name_ko: '프리랜서 페이지',
  description: 'Professional freelancer page with service listings, portfolio grid with category filter, client testimonials with star ratings, work process steps, and contact form. Built for trust and conversion.',
  description_ko: '프리랜서 전문 홍보 페이지. 서비스 목록, 카테고리 필터 포트폴리오, 별점 후기, 업무 프로세스, 문의 폼. 신뢰 구축과 전환 최적화에 최적화.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'freelancer-page',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '사이트 이름', required: true },
    { key: 'NEXT_PUBLIC_TITLE', description: '이름', required: false },
    { key: 'NEXT_PUBLIC_TAGLINE', description: '전문 분야 한 줄 소개', required: false },
    { key: 'NEXT_PUBLIC_AVATAR_URL', description: '프로필 사진 URL', required: false },
    { key: 'NEXT_PUBLIC_SERVICES', description: '서비스 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_PORTFOLIO', description: '포트폴리오 JSON', required: false },
    { key: 'NEXT_PUBLIC_TESTIMONIALS', description: '클라이언트 후기 JSON', required: false },
    { key: 'NEXT_PUBLIC_EXPERIENCE', description: '경력/자격 JSON', required: false },
    { key: 'NEXT_PUBLIC_PROCESS', description: '업무 프로세스 JSON', required: false },
    { key: 'NEXT_PUBLIC_EMAIL', description: '문의 이메일', required: false },
    { key: 'NEXT_PUBLIC_SOCIALS', description: 'SNS 링크 JSON', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['freelancer', 'services', 'portfolio', 'testimonials', 'business', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 12,
}
```

---

## 8. 검증 체크리스트

### 기능
- [ ] 히어로 이름, 태그라인, 프로필 사진 정상 표시
- [ ] CTA 버튼 클릭 시 문의 폼으로 smooth scroll
- [ ] 서비스 카드 3~6개 정상 렌더링 (아이콘 + 가격대)
- [ ] 포트폴리오 카테고리 필터 동작 (탭 클릭 → 필터링)
- [ ] 포트폴리오 카드 클릭 시 외부 URL 새 탭
- [ ] 클라이언트 후기 별점 시각화 정상 (filled/empty Star)
- [ ] 경력/자격 타임라인 렌더링 (타입별 아이콘)
- [ ] 프로세스 4단계 가로 표시 (모바일: 세로)
- [ ] 문의 폼 유효성 검사 동작
- [ ] 문의 폼 제출 (mailto: 링크 또는 Formspree)
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

### 접근성
- [ ] 키보드 내비게이션 (Tab 순서, 폼 필드 포커스)
- [ ] 스크린리더 호환 (aria-label, 폼 label, 이미지 alt)
- [ ] 컬러 대비 WCAG 2.1 AA 준수
- [ ] 별점에 aria-label (예: "5점 만점에 4점")
- [ ] 문의 폼 필드에 적절한 label 연결

### SEO
- [ ] OG 메타태그 정상 생성
- [ ] JSON-LD Person + ProfessionalService 구조화 데이터
- [ ] /api/og 이미지 생성 확인
- [ ] robots.txt 존재
- [ ] sitemap.xml 생성
