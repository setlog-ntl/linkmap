# Dev Showcase 템플릿 리빌딩 가이드

> 이 문서는 `templates/dev-showcase/` 템플릿을 처음부터 다시 구축하기 위한 완전한 스펙 문서입니다.

## 1. 개요

| 항목 | 값 |
|------|-----|
| 이름 | Dev Showcase |
| 용도 | 개발자 포트폴리오 (GitHub 연동, 기술 시각화, 터미널 스타일) |
| 프레임워크 | Next.js 15 (App Router) + Static Export |
| 스타일링 | Tailwind CSS 4.0 |
| 아이콘 | lucide-react |
| 애니메이션 | framer-motion v12 |
| 다크모드 | next-themes (기본: dark) |
| i18n | React Context (ko/en) |
| 배포 대상 | GitHub Pages (정적 HTML) |

## 2. 디렉토리 구조

```
dev-showcase/
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 루트 레이아웃 (다크 기본, SEO)
│   │   ├── page.tsx                # 메인 페이지 (8개 섹션)
│   │   ├── globals.css             # Tailwind + smooth scroll
│   │   └── api/og/route.tsx        # OG 이미지 (터미널 스타일)
│   ├── components/
│   │   ├── nav-header.tsx          # 고정 네비게이션 (IntersectionObserver)
│   │   ├── hero-section.tsx        # 히어로 (타이핑 애니메이션)
│   │   ├── about-section.tsx       # 소개 + 스킬 바
│   │   ├── projects-section.tsx    # 프로젝트 카드 그리드
│   │   ├── experience-timeline.tsx # 경력 타임라인
│   │   ├── blog-section.tsx        # 블로그 포스트 목록
│   │   ├── contact-section.tsx     # 연락처 CTA
│   │   ├── github-graph.tsx        # GitHub 기여 그래프
│   │   ├── footer.tsx              # 푸터 (Linkmap + ThemeToggle)
│   │   ├── theme-toggle.tsx        # 다크/라이트 전환
│   │   └── language-toggle.tsx     # 한국어/영어 전환
│   └── lib/
│       ├── config.ts               # 환경변수 + 데모 데이터
│       ├── i18n.tsx                # i18n Context + 26개 번역 키
│       └── github.ts              # GitHub API 레포 조회
```

## 3. 의존성

```json
{
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-themes": "^0.4.4",
    "lucide-react": "^0.468.0",
    "framer-motion": "^12.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.5.0"
  }
}
```

**다른 템플릿과 차이점**: `framer-motion` v12 추가 (스크롤 애니메이션 + 타이핑 효과)

## 4. 빌드 설정

다른 템플릿과 동일:
- `output: 'export'` (정적 HTML)
- `images: { unoptimized: true }`
- path alias: `@/*` → `./src/*`

### globals.css 추가 설정
```css
@theme {
  --font-sans: 'Pretendard Variable', 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
}

html { scroll-behavior: smooth; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

**차이점**: `--font-mono` 추가 (터미널 스타일 텍스트용), `scroll-behavior: smooth` (네비게이션 앵커 이동)

## 5. 환경변수 (전체)

| 변수명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `NEXT_PUBLIC_SITE_NAME` | string | `김개발` | 이름 (한국어) |
| `NEXT_PUBLIC_SITE_NAME_EN` | string | `Gaebal Kim` | 이름 (영어) |
| `NEXT_PUBLIC_GITHUB_USERNAME` | string\|null | `null` | GitHub 사용자명 |
| `NEXT_PUBLIC_TAGLINE` | string | `풀스택 개발자 \| 오픈소스 기여자` | 태그라인 (한국어, `\|`로 구분 시 타이핑 순환) |
| `NEXT_PUBLIC_TAGLINE_EN` | string | `Full-Stack Developer \| Open Source Contributor` | 태그라인 (영어) |
| `NEXT_PUBLIC_ABOUT` | string | (데모 텍스트) | 자기소개 (한국어) |
| `NEXT_PUBLIC_ABOUT_EN` | string | (데모 텍스트) | 자기소개 (영어) |
| `NEXT_PUBLIC_SKILLS` | JSON | 데모 8개 | 기술 스택 `SkillItem[]` |
| `NEXT_PUBLIC_EXPERIENCE` | JSON | 데모 3개 | 경력 `ExperienceItem[]` |
| `NEXT_PUBLIC_BLOG_POSTS` | JSON\|null | `null` | 블로그 포스트 `BlogPost[]` |
| `NEXT_PUBLIC_RESUME_URL` | string\|null | `null` | 이력서 다운로드 URL |
| `NEXT_PUBLIC_EMAIL` | string\|null | `null` | 이메일 |
| `NEXT_PUBLIC_LINKEDIN_URL` | string\|null | `null` | LinkedIn URL |
| `NEXT_PUBLIC_GA_ID` | string\|null | `null` | Google Analytics ID |

## 6. 데이터 모델

### SkillItem
```typescript
interface SkillItem {
  name: string;                                    // 기술 이름
  icon?: string;                                   // (미사용, 확장용)
  level: 'beginner' | 'intermediate' | 'advanced'; // 숙련도
}
```

### ExperienceItem
```typescript
interface ExperienceItem {
  title: string;          // 직함 (ko)
  titleEn?: string;       // 직함 (en)
  company: string;        // 회사명 (ko)
  companyEn?: string;     // 회사명 (en)
  period: string;         // 기간 (ko, 예: "2024 - 현재")
  periodEn?: string;      // 기간 (en, 예: "2024 - Present")
  description: string;    // 설명 (ko)
  descriptionEn?: string; // 설명 (en)
}
```

### ProjectItem
```typescript
interface ProjectItem {
  name: string;            // 프로젝트/레포 이름
  description: string;     // 설명 (ko)
  descriptionEn?: string;  // 설명 (en)
  url: string;             // GitHub URL
  language: string;        // 주 언어
  stars: number;           // 스타 수
  forks: number;           // 포크 수
}
```

### BlogPost
```typescript
interface BlogPost {
  title: string;       // 제목 (ko)
  titleEn?: string;    // 제목 (en)
  url: string;         // 블로그 URL
  date: string;        // 날짜 (YYYY-MM-DD)
}
```

## 7. 데모 데이터

### Skills (8개)
```typescript
[
  { name: 'TypeScript', level: 'advanced' },
  { name: 'React', level: 'advanced' },
  { name: 'Next.js', level: 'advanced' },
  { name: 'Node.js', level: 'intermediate' },
  { name: 'Python', level: 'intermediate' },
  { name: 'Docker', level: 'intermediate' },
  { name: 'PostgreSQL', level: 'intermediate' },
  { name: 'AWS', level: 'beginner' },
]
```

### Experience (3개)
```typescript
[
  { title: '프론트엔드 개발자', company: 'ABC 테크', period: '2024 - 현재', ... },
  { title: '웹 개발 인턴', company: 'XYZ 스타트업', period: '2023 - 2024', ... },
  { title: '컴퓨터공학 전공', company: '한국대학교', period: '2019 - 2023', ... },
]
```

### Projects (6개)
```typescript
[
  { name: 'awesome-react-hooks', language: 'TypeScript', stars: 142, forks: 23 },
  { name: 'nextjs-blog-starter', language: 'TypeScript', stars: 89, forks: 15 },
  { name: 'python-ml-toolkit', language: 'Python', stars: 56, forks: 8 },
  { name: 'docker-dev-env', language: 'Dockerfile', stars: 34, forks: 12 },
  { name: 'cli-todo-app', language: 'Rust', stars: 28, forks: 5 },
  { name: 'api-rate-limiter', language: 'JavaScript', stars: 21, forks: 3 },
]
```

## 8. 컴포넌트 상세 스펙

### 8.1 page.tsx (메인 페이지)
- 구조: `<>` fragment (NavHeader + main + Footer)
- 렌더링 순서: NavHeader → HeroSection → AboutSection → GithubGraph(조건부) → ProjectsSection → ExperienceTimeline → BlogSection(조건부) → ContactSection → Footer
- 각 섹션은 `id` 속성으로 앵커 네비게이션 지원

### 8.2 NavHeader (고정 네비게이션)
- **위치**: `fixed top-0 w-full z-50`
- **배경**: `backdrop-blur-md bg-gray-950/80 border-b border-gray-800/50`
- **높이**: `h-14`
- **최대 너비**: `max-w-4xl mx-auto`
- **섹션 ID**: `['hero', 'about', 'projects', 'experience', 'contact']`
- **활성 추적**: IntersectionObserver (`rootMargin: '-50% 0px -50% 0px'`)
  - 각 섹션을 observe → `isIntersecting` 시 active 상태 업데이트
- **링크 스타일**:
  - 활성: `text-white bg-gray-800 px-3 py-1.5 rounded-full text-sm`
  - 비활성: `text-gray-400 hover:text-gray-200`
- **구성**: 5개 네비 링크 + LanguageToggle

### 8.3 HeroSection (타이핑 애니메이션)

#### useTypingAnimation 커스텀 훅
- `useSyncExternalStore` 기반 외부 상태 관리
- 파라미터: `texts: string[]`, `speed = 80ms`, `pause = 2000ms`
- 동작:
  1. 한 글자씩 타이핑 (speed 간격)
  2. 완료 후 pause만큼 대기
  3. 한 글자씩 삭제 (speed/2 간격)
  4. 다음 텍스트로 순환
- `prefers-reduced-motion` 감지 시 첫 텍스트만 표시 (애니메이션 없음)
- 서버 스냅샷: 빈 문자열 (hydration 안전)

#### 태그라인 분리
```typescript
const taglines = taglineRaw.includes('|')
  ? taglineRaw.split('|').map((s) => s.trim())
  : [taglineRaw];
```
`|` 문자로 구분된 태그라인은 여러 개로 순환 타이핑됨.

#### 레이아웃
- `min-h-screen flex flex-col items-center justify-center`
- 배경: 점 패턴 (`radial-gradient(circle at 1px 1px, rgba(75,85,99,0.15) 1px, transparent 0)`, 40px 간격)
- 터미널 스타일: `$ whoami` (font-mono, text-green-400)
- 이름: `text-4xl sm:text-5xl lg:text-6xl font-bold` + 그라디언트 (`from-blue-400 to-purple-500 bg-clip-text text-transparent`)
- 타이핑: `text-xl text-gray-400` + 깜빡이는 커서 (`animate-pulse ml-0.5`)
- framer-motion: `initial={{ opacity: 0, y: 30 }}` → `animate={{ opacity: 1, y: 0 }}` (0.6s)

#### 소셜 링크
- GitHub, LinkedIn, Email: `p-2 rounded-full text-gray-400 hover:text-white`
- 이력서 버튼: `px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white`
- framer-motion: delay 0.4s

### 8.4 AboutSection (소개 + 스킬 바)
- 2열 그리드: `grid md:grid-cols-2 gap-12`
- **왼쪽**: 자기소개 텍스트 (`text-gray-400 leading-relaxed whitespace-pre-line`)
- **오른쪽**: 스킬 바 목록
  - 각 스킬: 이름(font-mono text-sm) + 레벨(text-xs text-gray-500) + 프로그레스 바
  - 프로그레스 바: `h-1.5 bg-gray-800 rounded-full` 컨테이너
  - 내부 바: `bg-gradient-to-r from-blue-500 to-purple-500 rounded-full`
  - 레벨별 너비 매핑:
    - `beginner` → `w-1/3`
    - `intermediate` → `w-2/3`
    - `advanced` → `w-full`
- framer-motion: `whileInView` 스크롤 트리거 (`viewport: { once: true, amount: 0.2 }`)

### 8.5 ProjectsSection (프로젝트 그리드)
- 그리드: `grid sm:grid-cols-2 lg:grid-cols-3 gap-4`
- 각 카드: `p-4 rounded-xl border border-gray-800 bg-gray-900`
  - 호버: `hover:border-blue-500/50`
  - 이름: `font-mono text-sm font-semibold text-blue-400`
  - 설명: `text-xs text-gray-400 line-clamp-2`
  - 하단: 언어 색상 도트(2.5×2.5 rounded-full) + Star 아이콘 + Fork 아이콘
- **언어 색상 매핑**:
  ```typescript
  {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Rust: '#dea584',
    Go: '#00ADD8',
    Java: '#b07219',
    Dockerfile: '#384d54',
    HTML: '#e34c26',
    CSS: '#563d7c',
  }
  ```
- framer-motion: 캐스케이드 (`delay: i * 0.05`)

### 8.6 ExperienceTimeline (경력 타임라인)
- 왼쪽 타임라인 라인: `absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500/30`
- 들여쓰기: `ml-4 sm:ml-8`
- 각 항목: `relative pl-8`
  - 노드 점: `absolute left-0 top-1.5 w-3 h-3 rounded-full bg-blue-500 -translate-x-[5px] ring-4 ring-gray-950`
  - 카드: `p-4 rounded-xl border border-gray-800 bg-gray-900/50`
  - 직함: `font-semibold text-gray-100`
  - 기간: `font-mono text-xs text-gray-500` (오른쪽 정렬, sm 이상)
  - 회사: `text-sm text-blue-400/80`
  - 설명: `text-sm text-gray-400`
- framer-motion: `initial={{ opacity: 0, x: -20 }}` (왼쪽에서 슬라이드), 캐스케이드 (`delay: i * 0.1`)

### 8.7 BlogSection (블로그 목록)
- 조건부 렌더링: `blogPosts && blogPosts.length > 0`일 때만
- 목록 스타일: `space-y-3`
- 각 항목: `flex items-center justify-between p-4 rounded-xl border border-gray-800`
  - 제목: `font-medium text-gray-200 group-hover:text-white truncate`
  - 날짜: `text-xs text-gray-500 mt-1`
  - 외부 링크 아이콘: `ExternalLink w-4 h-4 text-gray-600`
  - 호버: `hover:bg-gray-800/50`

### 8.8 ContactSection (CTA)
- 중앙 정렬 텍스트: `text-center max-w-4xl`
- 제목: `text-3xl font-bold`
- 설명: `text-gray-400 mb-8 max-w-md mx-auto`
- CTA 버튼들:
  - 이메일 (주요): `px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium`
  - GitHub/LinkedIn (보조): `p-3 rounded-xl border border-gray-800 text-gray-400 hover:text-white`
- framer-motion: 3단계 stagger (0s, 0.1s, 0.2s)

### 8.9 GithubGraph (기여 그래프)
- 조건부: `githubUsername`이 있을 때만
- 외부 서비스: `https://ghchart.rshah.org/3b82f6/{username}` (blue-500 색상)
- `<img>` 태그, `loading="lazy"`
- 래퍼: `rounded-xl border border-gray-800 p-4 bg-gray-900/50 overflow-x-auto`
- framer-motion: `whileInView`

### 8.10 Footer
- 서버 컴포넌트 (no 'use client')
- `border-t border-gray-800 py-8`
- 구성: "Powered by Linkmap" + ThemeToggle
- LanguageToggle은 NavHeader에 위치 (Footer에는 없음)

### 8.11 ThemeToggle
- 다른 템플릿과 동일 구현
- 색상: `text-gray-500 hover:text-gray-300`

### 8.12 LanguageToggle
- 다른 템플릿과 동일 구현
- 색상: `text-gray-400 hover:text-white` (더 밝은 호버)
- NavHeader 안에 배치

## 9. GitHub API 연동

### github.ts
```typescript
export async function fetchGitHubRepos(username: string): Promise<ProjectItem[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=stars&per_page=6`,
    { next: { revalidate: 3600 } }  // 1시간 ISR 캐시
  );
  if (!res.ok) return [];
  const repos = await res.json();
  return repos.map((repo) => ({
    name: repo.name,
    description: repo.description || '',
    url: repo.html_url,
    language: repo.language || 'Unknown',
    stars: repo.stargazers_count,
    forks: repo.forks_count,
  }));
}
```

**참고**: 현재 코드에서 이 함수는 정의만 되어 있고 직접 호출되지 않음 (데모 데이터 사용). 향후 GitHub username이 있을 때 실제 레포 데이터를 가져오는 데 사용 가능.

## 10. i18n 시스템

### 번역 키 (26개)
```typescript
{
  ko: {
    'nav.home': '홈',
    'nav.about': '소개',
    'nav.projects': '프로젝트',
    'nav.experience': '경력',
    'nav.contact': '연락처',
    'hero.resume': '이력서 다운로드',
    'about.title': '소개',
    'about.skills': '기술 스택',
    'level.beginner': '입문',
    'level.intermediate': '중급',
    'level.advanced': '고급',
    'projects.title': '프로젝트',
    'experience.title': '경력',
    'blog.title': '블로그',
    'contact.title': '함께 일하고 싶다면',
    'contact.desc': '새로운 프로젝트나 협업 제안은 언제든 환영합니다.',
    'contact.email': '이메일 보내기',
    'github.alt': 'GitHub 기여 그래프',
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
    'footer.powered': 'Powered by',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.contact': 'Contact',
    'hero.resume': 'Download Resume',
    'about.title': 'About',
    'about.skills': 'Tech Stack',
    'level.beginner': 'Beginner',
    'level.intermediate': 'Intermediate',
    'level.advanced': 'Advanced',
    'projects.title': 'Projects',
    'experience.title': 'Experience',
    'blog.title': 'Blog',
    'contact.title': "Let's Work Together",
    'contact.desc': 'Open to new projects and collaboration opportunities.',
    'contact.email': 'Send Email',
    'github.alt': 'GitHub Contribution Graph',
    'theme.light': 'Switch to light mode',
    'theme.dark': 'Switch to dark mode',
    'footer.powered': 'Powered by',
  }
}
```

## 11. OG 이미지 생성

- 엔드포인트: `GET /api/og`
- `export const dynamic = 'force-static'`
- 사이즈: 1200×630px
- 디자인: **터미널 스타일**
  - 배경: `#030712` (near-black)
  - `$ whoami`: 20px, `#4ade80` (green-400)
  - 이름: 64px bold, `linear-gradient(90deg, #60a5fa, #a855f7)` 그라디언트 텍스트
  - 태그라인: 28px, `#9ca3af`
  - 폰트: `monospace, sans-serif`

## 12. 디자인 시스템

### 컬러 팔레트
| 용도 | 색상 |
|------|------|
| 배경 | `gray-950` (#030712) |
| 카드 배경 | `gray-900` / `gray-900/50` |
| 카드 테두리 | `gray-800` |
| 주요 텍스트 | `gray-50` / `gray-100` |
| 보조 텍스트 | `gray-400` |
| 약한 텍스트 | `gray-500` / `gray-600` |
| 강조 (주) | `blue-400` → `blue-500` |
| 강조 (보) | `purple-500` |
| 터미널 | `green-400` |
| 타임라인 | `blue-500/30` (라인), `blue-500` (노드) |

### 타이포그래피
- `--font-sans`: Pretendard Variable
- `--font-mono`: SF Mono, Menlo, Consolas (코드/터미널용)
- 섹션 제목: `text-3xl font-bold`
- 히어로 이름: `text-4xl sm:text-5xl lg:text-6xl font-bold`
- 본문: `text-sm` / `text-base`
- 코드/기술명: `font-mono text-sm`

### framer-motion 패턴
```typescript
// 기본 페이드인 (아래→위)
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.2 }}
transition={{ duration: 0.5 }}

// 타임라인 슬라이드인 (왼쪽→오른쪽)
initial={{ opacity: 0, x: -20 }}
whileInView={{ opacity: 1, x: 0 }}
transition={{ duration: 0.4, delay: i * 0.1 }}

// 히어로 입장
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

## 13. 다른 템플릿과 비교

| 항목 | Link-in-Bio Pro | Digital Namecard | Dev Showcase |
|------|----------------|------------------|-------------|
| 기본 테마 | system | system | dark |
| 배경 | 그라디언트 | gray-50/gray-900 | gray-950 |
| 레이아웃 | 단일 카드 | 단일 카드 | 멀티섹션 풀페이지 |
| 네비게이션 | 없음 | 없음 | 고정 상단 바 |
| 애니메이션 | CSS gradient-shift | 없음 | framer-motion |
| 특수 기능 | YouTube 임베드 | QR+vCard | GitHub 그래프, 타이핑 |
| 섹션 수 | 1 | 1 | 8 |
| 컴포넌트 수 | 7 | 8 | 11 |
| 번역 키 수 | 3 | 9 | 26 |
| body 색 | 테마 의존 | gray-50/900 | gray-950 고정 |
| 폰트 | sans만 | sans만 | sans + mono |

## 14. 리빌딩 체크리스트

- [ ] Next.js 15 프로젝트 초기화 (`output: 'export'`)
- [ ] Tailwind CSS 4.0 + postcss 설정
- [ ] `framer-motion` v12 의존성 추가
- [ ] Pretendard 웹폰트 CDN 링크
- [ ] `globals.css` — font-sans + font-mono + scroll-behavior + reduced-motion
- [ ] `lib/config.ts` — 환경변수 + 4개 인터페이스 + 데모 데이터 (skills 8, experience 3, projects 6)
- [ ] `lib/i18n.tsx` — LocaleProvider + 26개 번역 키
- [ ] `lib/github.ts` — fetchGitHubRepos (GitHub API 연동)
- [ ] `layout.tsx` — ThemeProvider(defaultTheme: dark), LocaleProvider, SEO, JSON-LD
- [ ] `page.tsx` — 8개 섹션 조합 (조건부 렌더링 포함)
- [ ] `NavHeader` — fixed 네비 + IntersectionObserver + LanguageToggle
- [ ] `HeroSection` — useTypingAnimation 커스텀 훅 + `$ whoami` + 그라디언트 이름 + 소셜 링크
- [ ] `AboutSection` — 2열 그리드 (소개 + 스킬 바) + 레벨별 너비 매핑
- [ ] `GithubGraph` — ghchart.rshah.org 외부 이미지
- [ ] `ProjectsSection` — 3열 그리드 + 언어 색상 도트 + Star/Fork 카운트
- [ ] `ExperienceTimeline` — 좌측 라인 + 노드 점 + ring-4 + 카드
- [ ] `BlogSection` — 조건부 목록 + 날짜 + ExternalLink
- [ ] `ContactSection` — 그라디언트 CTA 버튼 + 보조 아이콘 버튼
- [ ] `Footer` — Linkmap 귀속 + ThemeToggle (서버 컴포넌트)
- [ ] `ThemeToggle` — useSyncExternalStore
- [ ] `LanguageToggle` — Globe + 로케일 전환
- [ ] `api/og/route.tsx` — 터미널 스타일 OG 이미지
- [ ] 접근성: aria-label, reduced-motion, semantic HTML, smooth scroll
- [ ] 빌드 테스트: `npm run build` → 정적 출력 확인
