# 개발자 쇼케이스 (Developer Showcase) 기획서

## 1. 개요

| 항목 | 내용 |
|------|------|
| 슬러그 | `dev-showcase` |
| UUID | `b2c3d4e5-0005-4000-9000-000000000005` |
| 카테고리 | 전문가 & 포트폴리오 |
| 타겟 페르소나 | 신입/주니어 개발자, 취준생 (페르소나: 신입 개발자 "지훈" 25세, 취준생 "하은" 23세) |
| 우선순위 | 3위 (총점 86/100) |
| Phase | Phase 1: MVP+ |
| 구현 일정 | 4일 |
| 비고 | GitHub 프로젝트 자동 연동, 기술 스택 시각화, 블로그 |

### 핵심 가치
- **자기증명**: GitHub 프로젝트와 기술 스택을 체계적으로 보여주는 포트폴리오
- **소속감**: 개발자 커뮤니티 정체성 표현 (터미널 스타일, 코드 에디터 UI)
- **바이럴 엔진**: GitHub README 링크 → 채용담당자 유입

---

## 2. AI 구현 프롬프트

> 이 섹션을 통째로 AI(Claude Code, Cursor 등)에 전달하면 템플릿을 구현할 수 있다.

```
## 컨텍스트
Linkmap(https://linkmap.vercel.app)의 원클릭 배포용 홈페이지 템플릿을 구현한다.
사용자가 GitHub 연결 → 템플릿 선택 → 환경변수 입력 → GitHub Pages 배포 3단계로 개인 개발자 포트폴리오 페이지를 생성한다.

## 템플릿: 개발자 쇼케이스 (dev-showcase)
- 타겟: 신입/주니어 개발자, 취준생
- 카테고리: 전문가 & 포트폴리오
- 핵심 목적: GitHub 프로젝트 자동 연동, 기술 스택 시각화, 블로그. 채용담당자에게 어필하는 개발자 포트폴리오

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 폰트: Pretendard(한글) + Inter(영문) via next/font
- 아이콘: Lucide React
- 애니메이션: framer-motion (스크롤 트리거)
- 다크모드: next-themes (다크 테마 기본)
- SEO: next/metadata + JSON-LD
- OG 이미지: @vercel/og (/api/og)
- 배포: GitHub Pages (static export)

## 핵심 섹션
1. 히어로: 이름 + 한줄 소개 + 타이핑 애니메이션 (터미널 스타일 `$ whoami`)
2. About: 자기소개 텍스트 + 기술 스택 아이콘 그리드
3. Projects: GitHub 핀 프로젝트 카드 (stars, forks, language 표시)
4. Experience: 타임라인 형태 경력/교육 이력
5. Blog: 최근 글 목록 (마크다운 or JSON)
6. Contact: 이메일 + GitHub + LinkedIn
7. 푸터: Powered by Linkmap + 다크모드 토글

## 디자인 스펙
- 다크 테마 기본 (개발자 친화적, gray-950 배경)
- 터미널/코드 에디터 느낌의 UI 요소 (font-mono, green-400 텍스트)
- GitHub 잔디밭(Contribution Graph) 임베드 옵션
- 스크롤 트리거 애니메이션 (framer-motion)
- 그라데이션 텍스트 (from-blue-400 to-purple-500)
- 네비게이션: 스크롤 스파이 상단 고정 헤더

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 이름
- NEXT_PUBLIC_GITHUB_USERNAME: GitHub 사용자명
- NEXT_PUBLIC_TAGLINE: 한줄 소개 (타이핑 애니메이션 텍스트)
- NEXT_PUBLIC_ABOUT: 자기소개 텍스트
- NEXT_PUBLIC_SKILLS: 기술 스택 JSON ([{"name":"React","icon":"react","level":"advanced"}])
- NEXT_PUBLIC_EXPERIENCE: 경력 JSON ([{"title":"..","company":"..","period":"..","desc":".."}])
- NEXT_PUBLIC_BLOG_POSTS: 블로그 글 JSON ([{"title":"..","url":"..","date":".."}])
- NEXT_PUBLIC_RESUME_URL: 이력서 PDF URL
- NEXT_PUBLIC_EMAIL: 이메일
- NEXT_PUBLIC_LINKEDIN_URL: LinkedIn URL
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. `linkmap-templates/dev-showcase` GitHub 레포에 Next.js 프로젝트 생성
2. 모든 개인화 데이터는 NEXT_PUBLIC_* 환경변수로 주입
3. 환경변수 미설정 시 매력적인 데모 데이터 표시
4. Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
5. 한국어 기본, lang="ko"
6. 반응형: 360px ~ 1440px
7. 다크모드 토글 포함 (기본값: dark)
8. /api/og 엔드포인트로 동적 OG 이미지 생성
9. JSON-LD 구조화 데이터 (Person 타입)
10. 접근성: WCAG 2.1 AA, 키보드 내비게이션
11. GitHub API 연동으로 핀 프로젝트 자동 fetch (또는 정적 JSON 폴백)
12. 스크롤 트리거 애니메이션 (framer-motion, prefers-reduced-motion 존중)
13. 스크롤 스파이 네비게이션 (현재 섹션 하이라이트)
```

---

## 3. 핵심 섹션 정의

### 섹션 1: 히어로
- **위치**: 페이지 최상단 (풀스크린, min-h-screen)
- **구성**: 터미널 프롬프트 `$ whoami` + 이름(4xl bold, 그라데이션) + 타이핑 애니메이션 한줄 소개 + 소셜 아이콘(GitHub, LinkedIn, Email)
- **배경**: `bg-gray-950` + 미세한 그리드 패턴 (CSS background-image)
- **애니메이션**: 타이핑 효과 (커서 깜빡임 `|`, 텍스트 한 글자씩), framer-motion fadeInUp
- **CTA**: "이력서 다운로드" 버튼 (NEXT_PUBLIC_RESUME_URL 설정 시)

### 섹션 2: About
- **위치**: 히어로 아래 (max-w-4xl, 센터)
- **구성**: 좌측 자기소개 텍스트 + 우측 기술 스택 그리드
- **기술 스택**: 아이콘 + 이름 + 레벨 바 (beginner/intermediate/advanced)
- **스타일**: 아이콘 hover → `scale-110`, tooltip으로 레벨 표시
- **데이터**: `NEXT_PUBLIC_SKILLS` JSON 파싱, 미설정 시 데모 스킬 8개 표시

### 섹션 3: Projects
- **위치**: About 아래
- **구성**: 3열 그리드 (md:grid-cols-2 lg:grid-cols-3), 각 카드 = 프로젝트명 + 설명 + 언어 뱃지 + stars/forks
- **데이터 소스**: `NEXT_PUBLIC_GITHUB_USERNAME` 설정 시 GitHub API fetch, 미설정 시 정적 JSON 폴백
- **인터랙션**: hover → `border-blue-500/50`, 카드 전체 클릭 → GitHub 레포 이동
- **GitHub 잔디밭**: `NEXT_PUBLIC_GITHUB_USERNAME` 설정 시 contribution graph 이미지 임베드

### 섹션 4: Experience
- **위치**: Projects 아래
- **구성**: 세로 타임라인 (좌측 연도 + 우측 카드: 직함, 회사명, 기간, 설명)
- **스타일**: 타임라인 라인 `border-l-2 border-blue-500`, 각 노드 `w-3 h-3 rounded-full bg-blue-500`
- **애니메이션**: 스크롤 트리거 → 각 카드 순차 fadeInLeft (framer-motion)
- **데이터**: `NEXT_PUBLIC_EXPERIENCE` JSON 파싱, 미설정 시 데모 경력 3개 표시

### 섹션 5: Blog
- **위치**: Experience 아래
- **구성**: 최근 글 카드 목록 (제목 + 날짜 + 외부 링크)
- **스타일**: `hover:bg-gray-800/50`, 카드 클릭 → 블로그 글 이동
- **데이터**: `NEXT_PUBLIC_BLOG_POSTS` JSON 파싱, 미설정 시 섹션 숨김

### 섹션 6: Contact
- **위치**: Blog 아래
- **구성**: "함께 일하고 싶다면" 텍스트 + 이메일 CTA 버튼 + 소셜 아이콘
- **스타일**: 센터 정렬, CTA `bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl`

### 섹션 7: 푸터
- **위치**: 페이지 최하단
- **구성**: "Powered by Linkmap" + 다크모드 토글
- **스타일**: `text-gray-500 text-xs border-t border-gray-800 py-8`

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:---:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 이름 | O | `'김개발'` |
| `NEXT_PUBLIC_GITHUB_USERNAME` | GitHub 사용자명 | | `null` (정적 데모 데이터) |
| `NEXT_PUBLIC_TAGLINE` | 한줄 소개 | | `'풀스택 개발자 | 오픈소스 기여자'` |
| `NEXT_PUBLIC_ABOUT` | 자기소개 텍스트 | | 데모 자기소개 텍스트 |
| `NEXT_PUBLIC_SKILLS` | 기술 스택 (JSON) | | 데모 스킬 8개 |
| `NEXT_PUBLIC_EXPERIENCE` | 경력 이력 (JSON) | | 데모 경력 3개 |
| `NEXT_PUBLIC_BLOG_POSTS` | 블로그 글 (JSON) | | `null` (섹션 숨김) |
| `NEXT_PUBLIC_RESUME_URL` | 이력서 PDF URL | | `null` (버튼 숨김) |
| `NEXT_PUBLIC_EMAIL` | 이메일 | | `null` (미표시) |
| `NEXT_PUBLIC_LINKEDIN_URL` | LinkedIn URL | | `null` (미표시) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | `null` (미추적) |

---

## 5. 디자인 스펙

### 컬러

| 요소 | 다크 모드 (기본) | 라이트 모드 |
|------|-----------------|------------|
| 배경 | `#030712` (gray-950) | `#ffffff` (white) |
| 카드 배경 | `#111827` (gray-900) | `#f9fafb` (gray-50) |
| 텍스트 (제목) | `#f9fafb` (gray-50) | `#111827` (gray-900) |
| 텍스트 (본문) | `#9ca3af` (gray-400) | `#4b5563` (gray-600) |
| 그라데이션 텍스트 | `from-blue-400 to-purple-500` | `from-blue-600 to-purple-600` |
| 터미널 텍스트 | `#4ade80` (green-400) | `#16a34a` (green-600) |
| 타임라인 라인 | `#3b82f6` (blue-500) | `#3b82f6` (blue-500) |
| 카드 보더 | `#1f2937` (gray-800) | `#e5e7eb` (gray-200) |
| 카드 hover 보더 | `#3b82f6/50` (blue-500/50) | `#3b82f6/50` (blue-500/50) |
| CTA 버튼 | `from-blue-500 to-purple-500` | `from-blue-600 to-purple-600` |
| 네비게이션 배경 | `#030712/80` (gray-950/80) + backdrop-blur | `#ffffff/80` + backdrop-blur |

### 타이포그래피
- 이름 (히어로): `text-4xl sm:text-5xl lg:text-6xl font-bold` (Pretendard) + 그라데이션
- 터미널 프롬프트: `font-mono text-green-400 text-sm` (시스템 모노 폰트)
- 한줄 소개: `text-xl text-gray-400` (Pretendard)
- 섹션 제목: `text-3xl font-bold` (Pretendard)
- 본문: `text-base text-gray-400` (Inter/Pretendard)
- 코드/기술명: `font-mono text-sm` (시스템 모노 폰트)

### 레이아웃
- 전체: `min-h-screen bg-gray-950 text-gray-50`
- 콘텐츠 영역: `max-w-4xl mx-auto px-4 sm:px-6`
- 네비게이션: `fixed top-0 w-full z-50 backdrop-blur-md`
- 섹션 간격: `py-20 sm:py-24`

### 반응형 브레이크포인트
- 360px (모바일): 단일 열, 히어로 텍스트 4xl, 프로젝트 1열
- 640px (sm): 히어로 텍스트 5xl, 프로젝트 1열
- 768px (md): About 2열 (텍스트+스킬), 프로젝트 2열
- 1024px (lg): 히어로 텍스트 6xl, 프로젝트 3열
- 1280px+: max-w-4xl 고정

### 애니메이션 (framer-motion)
- 히어로 진입: `fadeInUp` (delay 0.2s 간격)
- 타이핑 효과: 커스텀 `useTypingAnimation` 훅
- 섹션 진입: `whileInView` → `fadeInUp` (threshold 0.2)
- 경력 타임라인: 순차 `fadeInLeft` (staggerChildren 0.1)
- 프로젝트 카드: `fadeInUp` (staggerChildren 0.05)
- `prefers-reduced-motion: reduce` 시 모든 애니메이션 비활성화

---

## 6. 컴포넌트 구조

```
linkmap-templates/dev-showcase/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트(Pretendard+Inter), ThemeProvider
│   │   ├── page.tsx                # 메인 페이지 (서버 컴포넌트 → 클라이언트 래핑)
│   │   └── api/og/route.tsx        # OG 이미지 동적 생성
│   ├── components/
│   │   ├── hero-section.tsx        # 타이핑 애니메이션 + 소셜 링크 + CTA
│   │   ├── about-section.tsx       # 자기소개 + 스킬 그리드
│   │   ├── projects-section.tsx    # GitHub API 연동 or 정적 JSON 프로젝트 카드
│   │   ├── experience-timeline.tsx # 타임라인 UI (경력/교육 이력)
│   │   ├── blog-section.tsx        # 최근 글 카드 목록
│   │   ├── contact-section.tsx     # 이메일 CTA + 소셜 아이콘
│   │   ├── github-graph.tsx        # GitHub contribution graph 임베드
│   │   ├── nav-header.tsx          # 스크롤 스파이 네비게이션 헤더
│   │   ├── theme-toggle.tsx        # 다크모드 토글 버튼
│   │   └── footer.tsx              # Powered by Linkmap
│   └── lib/
│       ├── config.ts               # 환경변수 파싱 + 타입 안전 config
│       └── github.ts               # GitHub API fetch 유틸 (핀 프로젝트)
├── tailwind.config.ts
├── next.config.ts                  # static export 설정
├── package.json
├── tsconfig.json
└── README.md
```

### 컴포넌트 역할

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `layout.tsx` | Server | 메타데이터, 폰트 로드, ThemeProvider 래핑 (기본 dark) |
| `page.tsx` | Server | config 읽기 → 클라이언트 컴포넌트에 전달 |
| `hero-section.tsx` | Client | 타이핑 애니메이션, 이름, 한줄 소개, 소셜 링크, 이력서 CTA |
| `about-section.tsx` | Client | 자기소개 텍스트 + 기술 스택 아이콘 그리드 + 레벨 바 |
| `projects-section.tsx` | Client | GitHub API 핀 프로젝트 fetch, 카드 그리드 렌더링 |
| `experience-timeline.tsx` | Client | 경력/교육 이력 타임라인, 스크롤 트리거 애니메이션 |
| `blog-section.tsx` | Client | 블로그 글 카드 목록, 조건부 렌더링 |
| `contact-section.tsx` | Client | 이메일 CTA 버튼 + 소셜 아이콘 |
| `github-graph.tsx` | Client | GitHub contribution graph 이미지 임베드 |
| `nav-header.tsx` | Client | 스크롤 스파이 네비게이션, 현재 섹션 하이라이트 |
| `theme-toggle.tsx` | Client | next-themes 토글 버튼 |
| `footer.tsx` | Server | 정적 푸터 텍스트 |
| `config.ts` | Util | `process.env.NEXT_PUBLIC_*` → 타입 안전 객체 |
| `github.ts` | Util | GitHub REST API fetch 유틸 (핀 프로젝트, 사용자 정보) |

---

## 7. 시드 데이터

### 7.1 SQL INSERT (homepage_templates)

```sql
INSERT INTO homepage_templates (
  id, slug, name, name_ko, description, description_ko,
  preview_image_url, github_owner, github_repo, default_branch,
  framework, required_env_vars, tags, is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0005-4000-9000-000000000005',
  'dev-showcase',
  'Developer Showcase',
  '개발자 쇼케이스',
  'Developer portfolio with GitHub project integration, skill visualization, experience timeline, and blog. Terminal-style dark theme with scroll animations.',
  '개발자 포트폴리오. GitHub 프로젝트 연동, 기술 스택 시각화, 경력 타임라인, 블로그. 터미널 스타일 다크 테마.',
  NULL,
  'linkmap-templates',
  'dev-showcase',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "이름", "required": true},
    {"key": "NEXT_PUBLIC_GITHUB_USERNAME", "description": "GitHub 사용자명", "required": false},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "한줄 소개", "required": false},
    {"key": "NEXT_PUBLIC_ABOUT", "description": "자기소개 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_SKILLS", "description": "기술 스택 JSON", "required": false},
    {"key": "NEXT_PUBLIC_EXPERIENCE", "description": "경력 JSON", "required": false},
    {"key": "NEXT_PUBLIC_BLOG_POSTS", "description": "블로그 글 JSON", "required": false},
    {"key": "NEXT_PUBLIC_RESUME_URL", "description": "이력서 PDF URL", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "이메일", "required": false},
    {"key": "NEXT_PUBLIC_LINKEDIN_URL", "description": "LinkedIn URL", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['developer', 'portfolio', 'github', 'showcase', 'dark-theme', 'nextjs'],
  false,
  true,
  5
) ON CONFLICT (slug) DO NOTHING;
```

### 7.2 TypeScript 시드 (`homepage-templates.ts` 추가분)

```typescript
{
  id: 'b2c3d4e5-0005-4000-9000-000000000005',
  slug: 'dev-showcase',
  name: 'Developer Showcase',
  name_ko: '개발자 쇼케이스',
  description: 'Developer portfolio with GitHub project integration, skill visualization, experience timeline, and blog. Terminal-style dark theme with scroll animations.',
  description_ko: '개발자 포트폴리오. GitHub 프로젝트 연동, 기술 스택 시각화, 경력 타임라인, 블로그. 터미널 스타일 다크 테마.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'dev-showcase',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '이름', required: true },
    { key: 'NEXT_PUBLIC_GITHUB_USERNAME', description: 'GitHub 사용자명', required: false },
    { key: 'NEXT_PUBLIC_TAGLINE', description: '한줄 소개', required: false },
    { key: 'NEXT_PUBLIC_ABOUT', description: '자기소개 텍스트', required: false },
    { key: 'NEXT_PUBLIC_SKILLS', description: '기술 스택 JSON', required: false },
    { key: 'NEXT_PUBLIC_EXPERIENCE', description: '경력 JSON', required: false },
    { key: 'NEXT_PUBLIC_BLOG_POSTS', description: '블로그 글 JSON', required: false },
    { key: 'NEXT_PUBLIC_RESUME_URL', description: '이력서 PDF URL', required: false },
    { key: 'NEXT_PUBLIC_EMAIL', description: '이메일', required: false },
    { key: 'NEXT_PUBLIC_LINKEDIN_URL', description: 'LinkedIn URL', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['developer', 'portfolio', 'github', 'showcase', 'dark-theme', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 5,
}
```

---

## 8. 검증 체크리스트

### 기능
- [ ] 히어로 타이핑 애니메이션 정상 동작
- [ ] 기술 스택 아이콘 그리드 + 레벨 표시
- [ ] GitHub 프로젝트 카드 (stars, forks, language) 표시
- [ ] GitHub API 연동 시 핀 프로젝트 자동 fetch
- [ ] GitHub username 미설정 시 정적 데모 데이터 표시
- [ ] 경력 타임라인 스크롤 트리거 애니메이션
- [ ] 블로그 섹션 조건부 표시 (BLOG_POSTS 설정 시)
- [ ] 이력서 다운로드 버튼 조건부 표시 (RESUME_URL 설정 시)
- [ ] GitHub 잔디밭 임베드 (username 설정 시)
- [ ] 스크롤 스파이 네비게이션 현재 섹션 하이라이트
- [ ] 환경변수 미설정 시 데모 데이터 표시
- [ ] 다크모드 토글 동작 (기본값: dark)

### 성능
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 90+
- [ ] Lighthouse Best Practices 90+
- [ ] Lighthouse SEO 90+
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s

### 접근성
- [ ] 키보드 내비게이션 (Tab 순서)
- [ ] 스크린리더 호환 (aria-label)
- [ ] 컬러 대비 WCAG 2.1 AA
- [ ] prefers-reduced-motion 시 애니메이션 비활성화
- [ ] 네비게이션 키보드 접근 가능

### SEO
- [ ] OG 메타태그 정상 생성
- [ ] JSON-LD Person 구조화 데이터
- [ ] /api/og 이미지 생성 확인
- [ ] robots.txt 존재
