# Linkmap 템플릿 반응형 디자인 스펙 (6종)

> 이 문서는 6개 활성 템플릿의 반응형 디자인 사양, Stitch 재생성 프롬프트, 샘플 콘텐츠를 포함합니다.
> 각 템플릿은 GitHub Pages 정적 사이트(Next.js static export)로 배포되며, CSS media queries + Tailwind CSS로 반응형을 구현합니다.
>
> **구현 상태** (2026-02-19): 6개 전체 Next.js 코드 구현 완료 (`src/data/` 하위 파일 참조)

## 목차

1. [공통 디자인 시스템](#1-공통-디자인-시스템)
2. [나만의 홈페이지 (personal-brand)](#2-나만의-홈페이지)
3. [디지털 명함 (digital-namecard)](#3-디지털-명함)
4. [개발자 쇼케이스 (dev-showcase)](#4-개발자-쇼케이스)
5. [포트폴리오 (freelancer-page)](#5-포트폴리오)
6. [우리가게 홍보 (small-biz)](#6-우리가게-홍보)
7. [SNS 링크허브 (link-in-bio-pro)](#7-sns-링크허브)

---

## 1. 공통 디자인 시스템

### 반응형 브레이크포인트 (Tailwind CSS)

| Prefix | Min-width | 대상 디바이스 |
|--------|-----------|--------------|
| (none) | 0px | 모바일 세로 (기본, mobile-first) |
| `sm` | 640px | 모바일 가로 / 소형 태블릿 |
| `md` | 768px | 태블릿 세로 |
| `lg` | 1024px | 태블릿 가로 / 소형 노트북 |
| `xl` | 1280px | 데스크톱 |
| `2xl` | 1536px | 와이드 데스크톱 |

### 공통 기술 스택

- **프레임워크**: Next.js (static export → GitHub Pages)
- **스타일링**: Tailwind CSS v4
- **폰트**: Pretendard (한국어 + 라틴 가변 폰트, 2026 한국 웹 표준)
- **애니메이션**: Framer Motion (entrance/scroll), CSS Scroll-Driven Animations
- **아이콘**: Lucide React
- **접근성**: WCAG 2.2 AA 준수 (최소 터치타겟 44x44px, 색상대비 4.5:1, `prefers-reduced-motion` 지원)

### 2026 디자인 트렌드 적용

| 트렌드 | 적용 방식 |
|--------|----------|
| Bento Grid | 나만의 홈페이지 하이라이트, 개발자 쇼케이스 스킬 섹션 |
| Glassmorphism | SNS 링크허브 링크 버튼, 디지털 명함 카드 |
| Scroll Storytelling | 나만의 홈페이지, 포트폴리오 케이스 스터디 |
| Variable Font | Pretendard — 모든 템플릿 공통 (weight 100-900 가변) |
| Dark Mode Default | 개발자 쇼케이스, SNS 링크허브 |
| Micro-interactions | 모든 템플릿 — 버튼 hover scale, 폼 focus glow, 스크롤 reveal |

### i18n 구조

모든 템플릿은 `NEXT_PUBLIC_LANG` 환경변수로 한/영 전환 지원:
```
ko → 한국어 UI (기본값)
en → English UI
```

---

## 2. 나만의 홈페이지

**slug**: `personal-brand` | **타겟**: 누구나 | **추천 뱃지**: O

### 컨셉

스토리텔링 중심 퍼스널 브랜딩 페이지. 풀스크린 히어로, 패럴렉스 스크롤, 가치관 쇼케이스로 "나다움"을 표현.

### 디자인 토큰

| 항목 | 값 |
|------|-----|
| 메인 컬러 | `#ee5b2b` (Warm Coral) |
| 배경 | Hero: dark gradient `#0a0a0a` → Body: `#fafaf9` |
| 폰트 | Pretendard (본문), Plus Jakarta Sans (영문 헤딩) |
| 라운드니스 | 8px |
| 테마 | Light (body) + Dark (hero) |

### 반응형 레이아웃

#### Desktop (lg+)
```
┌─────────────────────────────────────┐
│        HERO (100vh, 풀스크린)        │
│   배경이미지 + 이름 + 태그라인       │
│          ↓ 스크롤 화살표             │
├─────────────────────────────────────┤
│  [프로필사진]  │  스토리 텍스트       │
│   (40%)       │  (60%)              │
├─────────────────────────────────────┤
│  [가치관1]    [가치관2]    [가치관3]  │
│      3열 카드 (gap-6)               │
├─────────────────────────────────────┤
│ [하이라이트 숫자 3열: 구독자/협업/강연] │
├─────────────────────────────────────┤
│  [사진1] [사진2] [사진3]             │
│      갤러리 3열 (gap-4)             │
├─────────────────────────────────────┤
│  연락처 + 소셜 아이콘               │
│  © 2026 나만의 홈페이지             │
└─────────────────────────────────────┘
```

#### Mobile (기본, < sm)
```
┌──────────────────┐
│ HERO (100dvh)    │
│ 이름 (text-3xl)  │
│ 태그라인         │
│ ↓                │
├──────────────────┤
│ [프로필사진]     │
│ (센터, w-32)     │
│ 스토리 텍스트    │
│ (1열 풀폭)      │
├──────────────────┤
│ [가치관1]        │
│ [가치관2]        │
│ [가치관3]        │
│ (1열 스택)       │
├──────────────────┤
│ [하이라이트 숫자] │
│ (1열 스택)       │
├──────────────────┤
│ [사진] [사진]    │
│ (2열 grid)       │
├──────────────────┤
│ 연락처 + 소셜    │
│ (대형 아이콘)    │
└──────────────────┘
```

### 샘플 콘텐츠

#### 한국어
| 필드 | 값 |
|------|-----|
| 이름 | 이지원 |
| 태그라인 | 콘텐츠로 세상을 연결하는 크리에이터 |
| 스토리 | 안녕하세요, 저는 이지원입니다. 5년째 디지털 콘텐츠를 만들며 브랜드와 사람 사이의 다리를 놓고 있어요. 처음엔 작은 블로그 하나로 시작했지만, 지금은 유튜브·인스타·뉴스레터를 아우르는 멀티 채널 크리에이터로 활동 중입니다. |
| 가치관 | 진정성 / 일관성 / 호기심 |
| 하이라이트 | 구독자 84,000+ / 협업 브랜드 120+ / 강연 40회+ |
| 이메일 | hello@jiwonlee.kr |

#### English
| Field | Value |
|-------|-------|
| Name | Alex Chen |
| Tagline | Data journalist turning numbers into narratives |
| Story | Hi, I'm Alex — a data journalist based in Seoul who turns spreadsheets into stories that move people. After five years at major outlets, I now focus on independent investigative data work. |
| Values | Transparency / Precision / Curiosity |
| Highlights | Subscribers 22,000+ / Investigations 58+ / Media Awards 7 |
| Email | alex@datanarrative.co |

### Stitch 재생성 프롬프트

<details>
<summary>Desktop 프롬프트 (클릭하여 펼치기)</summary>

```
Design a responsive Korean personal homepage called "나만의 홈페이지".
This is a storytelling-driven personal branding page targeting anyone who wants their own website.

DESIGN SYSTEM:
- Primary color: #ee5b2b (warm coral)
- Background: Dark gradient hero (#0a0a0a) → Light body (#fafaf9)
- Font: Pretendard (Korean body), Plus Jakarta Sans (English headings)
- Border radius: 8px
- Theme: Light body with dark hero section

LAYOUT (Desktop 1280px+):
1. HERO (100vh fullscreen):
   - Full-bleed dark gradient background with large placeholder image area
   - Name "이지원" in bold center-aligned (text-5xl, font-bold)
   - Tagline "콘텐츠로 세상을 연결하는 크리에이터" below (text-xl, text-white/70)
   - Subtle scroll-down arrow animation at bottom
   - Parallax scroll effect on background image

2. ABOUT SECTION:
   - 2-column layout: Profile photo (circle, w-48) on left (40%), story text on right (60%)
   - Story text: 3-4 sentences in natural Korean
   - Generous whitespace (py-24)
   - Fade-in on scroll entrance animation

3. VALUES SECTION (가치관):
   - Section title: "내가 소중히 여기는 것들"
   - 3 cards in a row (grid-cols-3, gap-6)
   - Each card: Emoji icon top, title (font-semibold), description (text-muted)
   - Cards have subtle border and hover:shadow-lg transition

4. HIGHLIGHTS SECTION:
   - 3 stat counters in a row: "84,000+" / "120+" / "40회+"
   - Labels below each: 구독자 합산 / 협업 브랜드 / 강연 횟수
   - Count-up animation on scroll into view
   - Background: subtle warm gradient strip

5. GALLERY SECTION (갤러리):
   - 3-column grid (gap-4)
   - 6 placeholder image areas with rounded-lg
   - Hover: scale(1.02) with shadow transition

6. CONTACT SECTION:
   - Email address centered
   - Social media icons row (Instagram, YouTube, LinkedIn) — 44px touch targets
   - "연락주세요" heading

7. FOOTER:
   - "© 2026 이지원. All rights reserved." centered
   - Minimal, py-8

RESPONSIVE BEHAVIOR:
- md (768px): About section becomes single column (photo on top, text below)
- sm (640px): Values cards stack to 1 column, gallery becomes 2 columns
- Mobile: Hero uses 100dvh, all sections single column, larger touch targets

ANIMATIONS:
- Hero: Parallax background on scroll
- Sections: Fade-in + slide-up (Framer Motion) with stagger delay
- Stats: Count-up animation triggered by IntersectionObserver
- Gallery: Hover scale with transition-transform duration-300
- Respect prefers-reduced-motion: disable all motion

ACCESSIBILITY:
- Color contrast 4.5:1 minimum
- Alt text on all images
- Focus-visible outlines on interactive elements
- lang="ko" on html root

KOREAN TEXT ONLY for all UI labels and content.
```

</details>

<details>
<summary>Mobile 프롬프트 (클릭하여 펼치기)</summary>

```
Design the MOBILE responsive version (375px width) of "나만의 홈페이지" personal branding page.

DESIGN SYSTEM: Same as desktop — Primary #ee5b2b, Pretendard font, 8px radius.

LAYOUT (Mobile 375px):
1. HERO (100dvh — use dvh not vh for mobile browser chrome):
   - Full-width background image
   - Name "이지원" (text-3xl, font-bold, center)
   - Tagline below (text-base, text-white/70)
   - Scroll arrow at bottom

2. ABOUT:
   - Profile photo centered (w-32, h-32, rounded-full)
   - Story text below, full width, px-6
   - Single column layout

3. VALUES:
   - 1 column stacked (gap-4)
   - Each card full width with px-6 padding
   - Touch-friendly spacing

4. HIGHLIGHTS:
   - 1 column stacked, each stat centered
   - Large numbers (text-4xl)

5. GALLERY:
   - 2-column grid (gap-3)
   - Rounded thumbnails

6. CONTACT:
   - Full-width section
   - Social icons: 48px touch targets, centered row with gap-6
   - Email as tap-to-mail link

7. FOOTER:
   - Centered, compact, py-6

IMPORTANT:
- No horizontal scrolling
- Minimum tap target 44x44px
- Bottom padding for mobile safe area (pb-safe)
- Korean text throughout
- Touch-friendly spacing (py-4 between sections minimum)
```

</details>

---

## 3. 디지털 명함

**slug**: `digital-namecard` | **타겟**: 직장인/프리랜서 | **추천 뱃지**: O

### 컨셉

종이 명함을 대체하는 디지털 프로필. vCard QR 코드, NFC 지원, 원탭 연락처 저장. 주로 모바일에서 공유되므로 mobile-first 설계.

### 디자인 토큰

| 항목 | 값 |
|------|-----|
| 메인 컬러 | `#136dec` (Professional Blue) |
| 배경 | `#f4f4f5` (Light Gray) |
| 카드 배경 | `#ffffff` |
| 폰트 | Pretendard (본문), Inter (영문) |
| 라운드니스 | 8px (카드), full (아바타) |
| 테마 | Light |

### 반응형 레이아웃

#### Desktop (lg+)
```
┌─────────────────────────────────────┐
│          (회색 배경 센터정렬)         │
│  ┌───────────────────────────┐      │
│  │ ████ 블루 액센트 바 ████   │      │
│  │                           │      │
│  │  [아바타]  이름            │      │
│  │           직함 · 회사명    │      │
│  │                           │      │
│  │  📧 이메일                │      │
│  │  📱 전화번호              │      │
│  │  📍 주소                  │      │
│  │  🌐 웹사이트              │      │
│  │                           │      │
│  │  [LI] [GH] [IG] [TW]     │      │
│  │                           │      │
│  │      ┌──────────┐        │      │
│  │      │ QR CODE  │        │      │
│  │      └──────────┘        │      │
│  │                           │      │
│  │  [====연락처 저장====]    │      │
│  └───────────────────────────┘      │
└─────────────────────────────────────┘
```

#### Mobile (기본)
```
┌──────────────────┐
│████ 액센트 바 ████│
│                  │
│    [아바타]      │
│    이름          │
│    직함 · 회사명  │
│                  │
│  📧 이메일      │
│  📱 전화번호    │
│  📍 주소        │
│  🌐 웹사이트    │
│                  │
│ [LI][GH][IG][TW]│
│                  │
│   ┌──────────┐  │
│   │ QR CODE  │  │
│   └──────────┘  │
│                  │
│[===연락처 저장===]│ ← sticky bottom or full-width CTA
└──────────────────┘
```

### 샘플 콘텐츠

#### 한국어
| 필드 | 값 |
|------|-----|
| 이름 | 박소연 |
| 직함 | 브랜드 디자인 리드 |
| 회사 | 스튜디오 모놀로그 |
| 이메일 | soyeon@studiomonologue.kr |
| 전화 | 010-1234-5678 |
| 주소 | 서울특별시 마포구 연남로 42, 3층 |
| 웹사이트 | studiomonologue.kr |
| 소셜 | Behance, Instagram, LinkedIn |

#### English
| Field | Value |
|-------|-------|
| Name | James Whitfield |
| Title | Senior Product Manager |
| Company | Neonloop Inc. |
| Email | james@neonloop.io |
| Phone | +1 (415) 555-0192 |
| Address | 548 Market St, Suite 420, San Francisco, CA |
| Website | neonloop.io |
| Socials | LinkedIn, GitHub, Twitter |

### Stitch 재생성 프롬프트

<details>
<summary>Desktop + Mobile 반응형 프롬프트 (클릭하여 펼치기)</summary>

```
Design a responsive Korean digital business card template "디지털 명함".
This replaces paper business cards with a digital profile featuring QR code and contact save.

DESIGN SYSTEM:
- Primary: #136dec (professional blue)
- Background: #f4f4f5 (light gray)
- Card: #ffffff with shadow-xl, rounded-lg
- Font: Pretendard (Korean), Inter (English)
- Border radius: 8px card, full avatar

DESKTOP LAYOUT (1280px):
- Card centered on gray background, max-w-md (448px)
- Blue accent bar at top of card (h-2, rounded-t-lg)
- Profile section: Circle avatar (w-20, h-20) left, name + title + company right
- Contact rows with icons (Mail, Phone, MapPin, Globe from Lucide), full width
- Social media icon row centered (LinkedIn, GitHub, Instagram, Twitter)
- QR code (w-40, h-40) centered
- "연락처 저장" CTA button full width, bg-primary, text-white, h-12

MOBILE LAYOUT (375px):
- Card takes full width with mx-4 margin
- Avatar centered on top (w-24, h-24)
- Name, title, company all centered below avatar
- Contact rows full width with larger tap targets (h-12 each)
- Social icons: 48px touch targets, centered with gap-4
- QR code: w-32, centered
- "연락처 저장" button: fixed bottom or full-width sticky (pb-safe)
- Single viewport design: all content visible without scroll (or minimal scroll)
- Use 100dvh for proper mobile viewport handling

GLASSMORPHISM VARIANT:
- Card: backdrop-filter blur(16px), bg-white/80, border border-white/20
- Subtle shadow-2xl
- On dark gradient background (#0f172a → #1e293b)

ANIMATIONS:
- Card entrance: slide-up + fade-in (duration 500ms)
- QR code: subtle pulse animation on hover
- Contact rows: hover background highlight
- "연락처 저장": hover scale(1.02)
- Respect prefers-reduced-motion

ACCESSIBILITY:
- All contact info as accessible links (tel:, mailto:, href)
- Touch targets minimum 44x44px
- Focus-visible outlines on all interactive elements
- Screen reader labels on icon-only buttons

Korean labels:
- 이메일, 전화번호, 주소, 웹사이트, 연락처 저장, 소셜 미디어
```

</details>

---

## 4. 개발자 쇼케이스

**slug**: `dev-showcase` | **타겟**: 개발자 | **추천 뱃지**: X

### 컨셉

개발자 포트폴리오. 터미널/IDE 미학, GitHub 프로젝트 연동, 기술 스택 시각화, 경력 타임라인. 다크 테마 기본.

### 디자인 토큰

| 항목 | 값 |
|------|-----|
| 메인 컬러 | `#13c8ec` (Cyan) |
| 서브 컬러 | `#00ff41` (Terminal Green) |
| 배경 | `#0d1117` (GitHub Dark) |
| 텍스트 | `#c9d1d9` |
| 링크 | `#58a6ff` |
| 폰트 | JetBrains Mono (코드), Space Grotesk (헤딩), Pretendard (본문) |
| 라운드니스 | 8px |
| 테마 | Dark (기본) |

### 반응형 레이아웃

#### Desktop (lg+)
```
┌─────────────────────────────────────┐
│ 🔴🟡🟢 ~/portfolio $ hello         │
│ > Hello, I'm 김태양_               │
│ > 백엔드 엔지니어 | Go · Rust       │
│                                     │
│ Nav: 소개 | 프로젝트 | 기술스택 |    │
│      경력 | 블로그 | 연락처          │
├─────────────────────────────────────┤
│  GitHub Contribution Graph          │
│  ████████████ (년간 기여 그래프)     │
├─────────────────────────────────────┤
│  [프로젝트1 카드]  [프로젝트2 카드]  │
│  [프로젝트3 카드]  (2열 grid)       │
├─────────────────────────────────────┤
│  기술스택 (카테고리별 진행바/태그)    │
│  Backend ████████░░ 90%             │
│  Frontend █████░░░░ 60%             │
│  DevOps ███████░░░ 75%              │
├─────────────────────────────────────┤
│  경력 타임라인 (수직)               │
│  ● 크래프톤 — 서버 엔지니어          │
│  │ 2022.03 — 현재                   │
│  ● 토스 — 백엔드 개발자             │
│  │ 2019.07 — 2022.02               │
├─────────────────────────────────────┤
│  블로그 글 목록                     │
├─────────────────────────────────────┤
│  연락처 + 소셜 (cyan 아이콘)        │
└─────────────────────────────────────┘
```

#### Mobile (기본)
```
┌──────────────────┐
│ 🔴🟡🟢           │
│ > Hello, I'm     │
│   김태양_         │
│ > 백엔드 엔지니어 │
│ [☰] 햄버거 메뉴  │
├──────────────────┤
│ GitHub Graph     │
│ (가로 스크롤)     │
├──────────────────┤
│ [프로젝트1 카드]  │
│ [프로젝트2 카드]  │
│ [프로젝트3 카드]  │
│ (1열 스택)       │
├──────────────────┤
│ 기술스택         │
│ (풀폭 진행바)    │
├──────────────────┤
│ 경력 타임라인    │
│ (컴팩트)         │
├──────────────────┤
│ 블로그           │
├──────────────────┤
│ 연락처           │
└──────────────────┘
```

### 샘플 콘텐츠

#### 한국어
| 필드 | 값 |
|------|-----|
| 이름 | 김태양 |
| GitHub | @taeyang-dev |
| 태그라인 | 가독성 좋은 코드가 결국 빠른 코드입니다 |
| 프로젝트1 | go-cache-storm (분산 캐시 라이브러리) ★1,240 |
| 프로젝트2 | rustql (SQL 파서) ★338 |
| 프로젝트3 | kube-scaler (K8s 오토스케일러) ★192 |
| 스킬 | Go, Rust, PostgreSQL, Redis, gRPC, K8s, Docker, Terraform, GitHub Actions, Prometheus |
| 경력 | 크래프톤 서버 엔지니어 (2022~현재), 토스 백엔드 개발자 (2019~2022) |

#### English
| Field | Value |
|-------|-------|
| Name | Sofia Marchetti |
| GitHub | @sofiadev |
| Tagline | I build interfaces that get out of the way |
| Project1 | motion-kit (animation library) ★2,870 |
| Project2 | a11y-audit (accessibility checker) ★543 |
| Project3 | design-tokens-cli ★291 |
| Skills | TypeScript, React, Next.js, Figma API, Storybook, Vitest, GraphQL, Tailwind, Playwright, Vercel |
| Experience | Figma — Design Engineer (2022–present), Intercom — Frontend (2019–2022) |

### Stitch 재생성 프롬프트

<details>
<summary>Desktop + Mobile 반응형 프롬프트 (클릭하여 펼치기)</summary>

```
Design a responsive Korean developer showcase portfolio "개발자 쇼케이스".
Dark terminal/hacker aesthetic with GitHub integration. For developers to display projects and skills.

DESIGN SYSTEM:
- Primary: #13c8ec (cyan)
- Secondary: #00ff41 (terminal green)
- Background: #0d1117 (GitHub Dark)
- Text: #c9d1d9
- Link: #58a6ff
- Code font: JetBrains Mono
- Heading font: Space Grotesk
- Body font: Pretendard
- Border radius: 8px

DESKTOP LAYOUT (1280px):
1. TERMINAL HEADER:
   - Dark box with macOS window dots (🔴🟡🟢)
   - Typing animation: "> Hello, I'm 김태양" in green monospace
   - Subtitle: "백엔드 엔지니어 | Go · Rust"
   - Navigation links inline: 소개 | 프로젝트 | 기술스택 | 경력 | 블로그 | 연락처

2. GITHUB SECTION:
   - Contribution graph placeholder (green squares grid)
   - Total stars + total commits + streak counter

3. PROJECTS (grid-cols-2, gap-6):
   - Dark cards with project name (font-mono), description, tech badges (small rounded pills)
   - Star count + fork count + link icon

4. SKILLS (기술스택):
   - Categories: Backend / Frontend / DevOps
   - Horizontal progress bars with percentage
   - Cyan colored fill, dark track
   - OR tag cloud with hover highlight

5. EXPERIENCE TIMELINE:
   - Vertical line with circle markers
   - Company name (font-bold), role, period, description

6. BLOG:
   - List of posts: title, date, excerpt

7. CONTACT:
   - Email + social icons in cyan

MOBILE LAYOUT (375px):
- Terminal header: compact, dots smaller, text wraps
- Navigation: Hamburger menu (☰) icon, slide-out drawer
- GitHub graph: horizontally scrollable (overflow-x-auto)
- Projects: single column stacked cards
- Skills: full-width bars, stacked categories
- Timeline: compact vertical, text wraps naturally
- Blog: single column
- Contact: stacked, large 48px touch icons
- No horizontal scrolling on main content

ANIMATIONS:
- Typewriter cursor blink on terminal prompt
- Simulated boot sequence on first load: "Initializing... Loading modules... ✓ Ready"
- Skill bars animate width on scroll into view
- Project cards fade-in with stagger
- Scanline/CRT flicker overlay (optional, subtle)
- Respect prefers-reduced-motion

Korean section headers: 소개, 프로젝트, 기술스택, 경력, 블로그, 연락처
```

</details>

---

## 5. 포트폴리오

**slug**: `freelancer-page` | **타겟**: 디자이너/작가/프리랜서 | **추천 뱃지**: X

### 컨셉

프리랜서 전문 홍보 페이지. 서비스 목록, 카테고리 필터 포트폴리오, 별점 후기, 업무 프로세스, 문의 폼. 신뢰 구축과 전환 최적화.

### 디자인 토큰

| 항목 | 값 |
|------|-----|
| 메인 컬러 | `#5b13ec` (Creative Purple) |
| 배경 | `#fafafa` |
| 폰트 | Pretendard (본문), Inter (영문 헤딩) |
| 라운드니스 | 8px |
| 테마 | Light |

### 반응형 레이아웃

#### Desktop (lg+)
```
┌─────────────────────────────────────┐
│           [프로필 사진]              │
│            정하은                    │
│   UI/UX 디자이너 | 브랜드 전문가     │
├─────────────────────────────────────┤
│  서비스                             │
│  [서비스1]  [서비스2]  [서비스3]      │
│   3열 카드 (아이콘+제목+설명+가격)   │
├─────────────────────────────────────┤
│  포트폴리오                         │
│  [전체] [웹디자인] [브랜딩] [일러스트] │
│  [작품1]  [작품2]  [작품3]           │
│   3열 매서너리 그리드               │
├─────────────────────────────────────┤
│  클라이언트 후기                     │
│  [★★★★★ 후기1]  [★★★★★ 후기2]      │
│   2열 카드                          │
├─────────────────────────────────────┤
│  업무 프로세스                       │
│  ①상담 → ②기획 → ③제작 → ④납품    │
│   4열 수평 스텝                     │
├─────────────────────────────────────┤
│  문의하기                           │
│  [이름] [이메일] [메시지] [보내기]   │
├─────────────────────────────────────┤
│  Footer + 소셜                     │
└─────────────────────────────────────┘
```

#### Mobile (기본)
```
┌──────────────────┐
│   [프로필사진]    │
│    정하은         │
│  디자이너/브랜딩  │
├──────────────────┤
│  서비스           │
│  [서비스1 카드]   │
│  [서비스2 카드]   │
│  [서비스3 카드]   │
│  (1열 스택)      │
├──────────────────┤
│  포트폴리오       │
│  [가로스크롤 탭]  │
│  [작품1] [작품2]  │
│  (2열 grid)      │
├──────────────────┤
│  후기             │
│  [후기1 카드]     │
│  [후기2 카드]     │
│  (1열 스택)      │
├──────────────────┤
│  프로세스         │
│  ①→②→③→④       │
│  (2x2 grid)      │
├──────────────────┤
│  문의하기         │
│  [이름]           │
│  [이메일]         │
│  [메시지]         │
│  [보내기] 풀폭    │
└──────────────────┘
```

### 샘플 콘텐츠

#### 한국어
| 필드 | 값 |
|------|-----|
| 이름 | 정하은 |
| 분야 | 그래픽 디자이너 · 브랜드 컨설턴트 |
| 서비스1 | 브랜드 아이덴티티 패키지 — ₩350만~ |
| 서비스2 | 웹 UI/UX 디자인 — ₩180만~ |
| 서비스3 | 인쇄물·편집 디자인 — ₩80만~ |
| 후기 | "덕분에 리브랜딩 후 매출이 30% 올랐어요" ★★★★★ — 김도현, 올리브스튜디오 대표 |
| 프로세스 | 1.상담 → 2.기획 → 3.제작 → 4.납품 |

#### English
| Field | Value |
|-------|-------|
| Name | Marcus Webb |
| Specialty | UX/UI Designer · Brand Strategist |
| Service1 | Brand Identity Package — $4,500+ |
| Service2 | Web App UI/UX Design — $2,800+ |
| Service3 | Design System Build — $6,000+ |
| Testimonial | "Marcus redesigned our entire product in 6 weeks" ★★★★★ — Amy Torres, CPO at Flockr |
| Process | 1.Discovery → 2.Strategy → 3.Design → 4.Delivery |

### Stitch 재생성 프롬프트

<details>
<summary>Desktop + Mobile 반응형 프롬프트 (클릭하여 펼치기)</summary>

```
Design a responsive Korean freelancer portfolio page "포트폴리오".
For designers, writers, and freelancers to showcase work and attract clients.

DESIGN SYSTEM:
- Primary: #5b13ec (creative purple)
- Background: #fafafa
- Font: Pretendard (Korean body), Inter (English headings)
- Border radius: 8px
- Theme: Light

DESKTOP LAYOUT (1280px):
1. HERO:
   - Centered circular profile photo (w-32, h-32)
   - Name "정하은" (text-4xl, font-bold)
   - Tagline "그래픽 디자이너 · 브랜드 컨설턴트" (text-lg, text-muted)

2. SERVICES (서비스):
   - 3 cards in a row (grid-cols-3, gap-6)
   - Each: Lucide icon, title, 2-line description, price (text-primary, font-semibold)
   - Card: border, rounded-lg, hover:shadow-lg, p-6

3. PORTFOLIO (포트폴리오):
   - Filter tabs: 전체 | 웹디자인 | 브랜딩 | 일러스트
   - 3-column masonry/grid layout
   - Each item: thumbnail image, hover overlay with project name + category
   - Smooth filter transition with AnimatePresence

4. TESTIMONIALS (클라이언트 후기):
   - 2-column cards (grid-cols-2, gap-6)
   - Each: 5 filled stars (★★★★★), quote text (italic), client name, company
   - Subtle quote mark decoration

5. PROCESS (업무 프로세스):
   - 4 horizontal steps (grid-cols-4)
   - Numbered circles (①②③④) connected by lines/arrows
   - Labels: 상담 → 기획 → 제작 → 납품
   - Each step has brief description below

6. CONTACT (문의하기):
   - Form: 이름 input, 이메일 input, 메시지 textarea, 보내기 button
   - 2-column layout (info left, form right) or centered max-w-lg

7. FOOTER: Social links + copyright

MOBILE LAYOUT (375px):
- Profile photo centered (w-24), name + tagline centered
- Services: 1-column stacked cards
- Portfolio: 2-column grid, filter tabs horizontal scroll
- Testimonials: 1-column stacked
- Process: 2x2 grid (instead of 4 horizontal)
- Contact form: full-width inputs stacked, button full-width
- Touch targets: 44px minimum
- No horizontal scroll

ANIMATIONS:
- Portfolio filter: AnimatePresence with fade + scale
- Cards: hover:-translate-y-1 + shadow transition
- Sections: scroll-triggered fade-in with stagger
- Process steps: sequential entrance animation
- Respect prefers-reduced-motion

Korean section headers: 서비스, 포트폴리오, 클라이언트 후기, 업무 프로세스, 문의하기
```

</details>

---

## 6. 우리가게 홍보

**slug**: `small-biz` | **타겟**: 소상공인 (카페/음식점/미용실) | **추천 뱃지**: X

### 컨셉

소상공인을 위한 모바일 최적화 비즈니스 페이지. 메뉴판, 영업시간, 카카오맵, 전화 연결. 한국 시장 특화 (카카오/네이버 연동).

### 디자인 토큰

| 항목 | 값 |
|------|-----|
| 메인 컬러 | `#d47311` (Warm Amber) |
| 배경 | `#fffbf5` (Warm Cream) |
| 폰트 | Pretendard (본문), Plus Jakarta Sans (영문) |
| 라운드니스 | 12px |
| 테마 | Light (따뜻한 톤) |

### 반응형 레이아웃

#### Desktop (lg+)
```
┌─────────────────────────────────────┐
│  HERO (가게 사진 배너)              │
│  "온기 베이커리"                     │
│  "연남동 천연재료 베이커리"           │
├─────────────────────────────────────┤
│  [📞전화] [📍길찾기] [📷인스타]     │
│   퀵 액션 버튼 3열                  │
├─────────────────────────────────────┤
│  메뉴                               │
│  [메뉴1] [메뉴2] [메뉴3]            │
│  [메뉴4] [메뉴5] [메뉴6]            │
│   2x3 grid (사진+이름+가격)         │
├─────────────────────────────────────┤
│  영업시간                           │
│  월 09:00-21:00                     │
│  화 09:00-21:00  ← 오늘 (하이라이트) │
│  ...                                │
├─────────────────────────────────────┤
│  오시는 길                          │
│  [카카오맵 임베드]                   │
│  주소 · 전화번호                    │
├─────────────────────────────────────┤
│  갤러리 (가로 스크롤)               │
├─────────────────────────────────────┤
│  SNS                                │
│  [인스타피드] [네이버블로그] [카카오]  │
├─────────────────────────────────────┤
│  Footer (전화·주소·©)               │
└─────────────────────────────────────┘
```

#### Mobile (기본)
```
┌──────────────────┐
│ HERO (가게 사진)  │
│ "온기 베이커리"   │
├──────────────────┤
│ [전화][길찾기]   │
│ [인스타]         │
│ (대형 터치 버튼) │
├──────────────────┤
│ 메뉴             │
│ [메뉴1][메뉴2]   │
│ [메뉴3][메뉴4]   │
│ (2열 grid)       │
├──────────────────┤
│ 영업시간         │
│ (오늘 하이라이트)│
├──────────────────┤
│ 오시는 길        │
│ [지도]           │
│ [전화하기 CTA]   │
├──────────────────┤
│ 갤러리 (스크롤→)│
├──────────────────┤
│ [카카오채널 추가]│
│ [네이버 블로그]  │
├──────────────────┤
│ Footer           │
└──────────────────┘
```

### 샘플 콘텐츠

#### 한국어
| 필드 | 값 |
|------|-----|
| 가게 이름 | 온기 베이커리 |
| 소개 | 연남동 골목에서 만나는 천연발효 빵과 디저트 |
| 메뉴1 | 🥐 크루아상 — ₩4,500 |
| 메뉴2 | 🍞 사워도우 — ₩8,000 |
| 메뉴3 | 🧁 당근 케이크 — ₩6,500 |
| 메뉴4 | ☕ 드립 커피 — ₩4,000 |
| 메뉴5 | 🍵 말차 라떼 — ₩5,500 |
| 메뉴6 | 🥤 레몬에이드 — ₩5,000 |
| 영업시간 | 월~금 09:00-21:00, 토 10:00-22:00, 일 10:00-18:00 |
| 주소 | 서울특별시 마포구 연남로 27길 14, 1층 |
| 전화 | 02-1234-5678 |
| SNS | Instagram @ongi.bakery, 네이버 블로그, 카카오채널 |

#### English
| Field | Value |
|-------|-------|
| Shop Name | Fortuna Pizza & Pasta |
| Description | Authentic Neapolitan pizza in the heart of NYC |
| Menu1 | 🍕 Margherita — $16 |
| Menu2 | 🍝 Cacio e Pepe — $19 |
| Menu3 | 🥗 Burrata Salad — $14 |
| Menu4 | 🍷 House Red Wine (glass) — $12 |
| Menu5 | 🍰 Tiramisu — $10 |
| Menu6 | ☕ Espresso — $4 |
| Hours | Mon: Closed, Tue-Thu 11:00-22:00, Fri-Sat 11:00-23:00, Sun 12:00-21:00 |
| Address | 234 Bleecker St, New York, NY 10014 |
| Phone | (212) 555-0147 |

### Stitch 재생성 프롬프트

<details>
<summary>Desktop + Mobile 반응형 프롬프트 (클릭하여 펼치기)</summary>

```
Design a responsive Korean small business page "우리가게 홍보".
For cafes, restaurants, salons to have a warm, inviting mobile-optimized business presence.
Korean market focus with Kakao/Naver integration.

DESIGN SYSTEM:
- Primary: #d47311 (warm amber)
- Background: #fffbf5 (warm cream)
- Font: Pretendard (Korean body), Plus Jakarta Sans (English)
- Border radius: 12px (warmer, friendlier feel)
- Theme: Light, warm tones

DESKTOP LAYOUT (1280px):
1. HERO BANNER:
   - Full-width lifestyle photo (h-80) with dark overlay
   - Shop name "온기 베이커리" (text-5xl, font-bold, text-white)
   - Description "연남동 천연재료 베이커리" (text-lg, text-white/80)

2. QUICK ACTIONS:
   - 3 large rounded buttons in a row (grid-cols-3, gap-4)
   - Icons: Phone, MapPin, Instagram (from Lucide)
   - Labels: 전화하기, 길찾기, 인스타그램
   - Each: h-14, rounded-xl, border, hover:bg-primary/10

3. MENU (메뉴):
   - 2x3 grid (grid-cols-3 lg, grid-cols-2 sm)
   - Each item: rounded photo thumbnail (h-32), menu name, price (font-semibold, text-primary)
   - Optional: brief description (text-sm, text-muted)
   - Emoji before each item name

4. BUSINESS HOURS (영업시간):
   - Clean table: day column + hours column
   - Days: 월, 화, 수, 목, 금, 토, 일
   - Today row highlighted with bg-primary/10 and "오늘" badge
   - Current open/closed status indicator (green dot / red dot)

5. LOCATION (오시는 길):
   - Map placeholder (Kakao Map embed area, h-64, rounded-xl)
   - Address text below with MapPin icon
   - Phone number with Phone icon
   - "길찾기" button linking to Kakao/Naver Map

6. GALLERY (갤러리):
   - Horizontal scrollable row (overflow-x-auto, snap-x)
   - Square photos (w-48, h-48, rounded-lg)
   - 6-8 placeholder images

7. SNS SECTION:
   - Instagram feed grid placeholder (3x2)
   - "네이버 블로그" link button (green, Naver branded)
   - "카카오채널 추가" large yellow button (Kakao branded)

8. FOOTER:
   - Phone, address, copyright
   - Warm cream background

MOBILE LAYOUT (375px):
- Hero: h-56, smaller text
- Quick actions: grid-cols-3 but smaller, or 2+1 layout
- Menu: 2-column grid, smaller thumbnails
- Hours: full width table, today highlighted
- Location: map full width, click-to-call button (h-14, full-width)
- Gallery: horizontal scroll maintained
- SNS: stacked (Instagram grid, Naver button, Kakao button full width)
- Bottom navigation option: 홈 | 메뉴 | 위치 | 전화
- Click-to-call button prominently placed

KOREAN MARKET SPECIFICS:
- KakaoTalk channel integration (카카오채널 추가 yellow button)
- Naver Blog link (네이버 블로그 green button)
- Kakao Map or Naver Map embed (not Google Maps)
- Korean phone format: 02-XXXX-XXXX or 010-XXXX-XXXX
- Korean address format: 시/도 → 구 → 로/길 → 번지

ANIMATIONS:
- Menu items: fade-in with stagger on scroll
- Quick action buttons: subtle scale on tap
- Gallery: smooth scroll snap
- Hours table: today row gentle pulse once
- Respect prefers-reduced-motion

Korean labels: 메뉴, 영업시간, 오시는 길, 갤러리, 전화하기, 길찾기
```

</details>

---

## 7. SNS 링크허브

**slug**: `link-in-bio-pro` | **타겟**: 크리에이터/인플루언서 | **추천 뱃지**: X

### 컨셉

Linktree 대안. SNS 프로필 링크 허브. 글래스모피즘, 그라디언트 배경, 커스텀 테마. 모바일에서 주로 공유되므로 mobile-first 설계.

### 디자인 토큰

| 항목 | 값 |
|------|-----|
| 그라디언트 | `#6366f1` → `#ec4899` → `#3b82f6` (Purple→Pink→Blue) |
| 버튼 배경 | `rgba(255,255,255,0.15)` + `backdrop-filter: blur(16px)` |
| 버튼 보더 | `rgba(255,255,255,0.2)` |
| 텍스트 | `#ffffff` |
| 폰트 | Plus Jakarta Sans (헤딩), Pretendard (본문) |
| 라운드니스 | full (pills) |
| 테마 | Dark (gradient) |

### 반응형 레이아웃

#### Desktop (센터 컨테이너, max-w-md)
```
┌─────────────────────────────────────┐
│        (gradient background)         │
│                                     │
│           ┌─────────┐              │
│           │ [avatar] │              │
│           └─────────┘              │
│            @최유진                   │
│    나만의 이야기를 기록하는 공간      │
│                                     │
│   ┌──────────────────────────┐     │
│   │ ▶  유튜브 채널            │     │
│   └──────────────────────────┘     │
│   ┌──────────────────────────┐     │
│   │ 📷  인스타그램            │     │
│   └──────────────────────────┘     │
│   ┌──────────────────────────┐     │
│   │ 📝  네이버 블로그         │     │
│   └──────────────────────────┘     │
│   ┌──────────────────────────┐     │
│   │ 🐦  트위터/X             │     │
│   └──────────────────────────┘     │
│   ┌──────────────────────────┐     │
│   │ 🎵  틱톡                 │     │
│   └──────────────────────────┘     │
│   ┌──────────────────────────┐     │
│   │ 💼  포트폴리오            │     │
│   └──────────────────────────┘     │
│   ┌──────────────────────────┐     │
│   │ ✉️  문의하기              │     │
│   └──────────────────────────┘     │
│                                     │
│   ┌──────────────────────────┐     │
│   │     YouTube Embed        │     │
│   └──────────────────────────┘     │
│                                     │
│    [IG] [YT] [TW] [TT] [GH]       │
│                                     │
│         👀 1,240,000 views          │
│        Powered by Linkmap           │
└─────────────────────────────────────┘
```

#### Mobile (기본, 375px — 메인 뷰포트)
```
┌──────────────────┐
│   (gradient bg)  │
│    [avatar]      │
│    @최유진       │
│  나만의 이야기를 │
│  기록하는 공간   │
│                  │
│ [▶ 유튜브 채널] │
│ [📷 인스타그램] │
│ [📝 블로그]     │
│ [🐦 트위터/X]   │
│ [🎵 틱톡]       │
│ [💼 포트폴리오] │
│ [✉️ 문의하기]   │
│                  │
│ [YouTube 임베드] │
│                  │
│ [IG][YT][TW][TT]│
│                  │
│ 👀 1,240,000    │
│ Powered by       │
│ Linkmap          │
└──────────────────┘
```

### 샘플 콘텐츠

#### 한국어
| 필드 | 값 |
|------|-----|
| 닉네임 | @최유진 |
| 바이오 | 라이프스타일 유튜버 · 일상을 예쁘게 기록하는 사람 |
| 링크1 | ▶ 유튜브 채널 (147K 구독) |
| 링크2 | 📷 인스타그램 (@yujin.daily) |
| 링크3 | 📬 주간 뉴스레터 구독 |
| 링크4 | 🎨 디자인 템플릿 스토어 |
| 링크5 | 🛒 유진's 쿠팡 추천 픽 |
| 링크6 | 🎤 강연/협업 문의 |
| 링크7 | 💙 토스로 응원하기 |
| 유튜브 임베드 | 최신 영상 썸네일 |
| 조회수 | 누적 1,240,000 |
| 테마 | gradient (보라→핑크→파랑) |

#### English
| Field | Value |
|-------|-------|
| Username | @taylor.ryan |
| Bio | Indie game dev & streamer · Building worlds one pixel at a time |
| Link1 | 🎮 Twitch (LIVE!) |
| Link2 | ▶ YouTube Devlog |
| Link3 | 🐦 Twitter / X |
| Link4 | 🕹️ Games on itch.io |
| Link5 | 💬 Discord Community |
| Link6 | 📧 Newsletter |
| Link7 | ☕ Support on Ko-fi |
| Views | 780,000 total |
| Theme | neon (dark + cyan accents) |

### Stitch 재생성 프롬프트

<details>
<summary>Desktop + Mobile 반응형 프롬프트 (클릭하여 펼치기)</summary>

```
Design a responsive Korean SNS link hub "SNS 링크허브".
A Linktree alternative for creators and influencers. Mobile-first, single column centered layout.

DESIGN SYSTEM:
- Background gradient: #6366f1 (purple) → #ec4899 (pink) → #3b82f6 (blue)
- Link buttons: glassmorphism (bg-white/15, backdrop-blur-xl, border border-white/20)
- Text: #ffffff
- Font: Plus Jakarta Sans (headings), Pretendard (body)
- Border radius: 9999px (full pill shape for buttons)
- Theme: Dark (gradient background)

DESKTOP LAYOUT (centered, max-w-md / 448px):
1. BACKGROUND: Full-screen animated mesh gradient (purple→pink→blue), subtle slow animation
2. AVATAR: Circle (w-24, h-24) centered, border-2 border-white/30
3. USERNAME: "@최유진" (text-xl, font-bold, text-white)
4. BIO: "라이프스타일 유튜버 · 일상을 예쁘게 기록하는 사람" (text-sm, text-white/70)
5. LINK BUTTONS: Vertical stack (gap-3), each button:
   - Full width, h-14, rounded-full
   - Glassmorphism: bg-white/15 backdrop-blur-xl border border-white/20
   - Icon on left (emoji or Lucide icon), label centered
   - 7 buttons: 유튜브 채널, 인스타그램, 네이버 블로그, 트위터/X, 틱톡, 포트폴리오, 문의하기
   - Hover: bg-white/25 scale(1.02) transition
6. YOUTUBE EMBED: Rounded video placeholder (rounded-2xl, aspect-video)
7. SOCIAL ICONS: Small icon row (gap-4), 32px each, text-white/60 hover:text-white
8. STATS: "👀 1,240,000 views" (text-xs, text-white/40)
9. FOOTER: "Powered by Linkmap" (text-xs, text-white/30)

MOBILE LAYOUT (375px — PRIMARY viewport):
- Same layout, naturally responsive (max-w-md already fits)
- Padding: px-6
- Avatar: w-20, h-20
- Link buttons: h-12, text-sm
- Tap targets: minimum 44px height
- YouTube embed: full width with px-6
- Social icons: 44px touch targets
- Use 100dvh for gradient background (not vh)
- Safe area padding: pb-[env(safe-area-inset-bottom)]

THEME VARIANTS (controlled by NEXT_PUBLIC_THEME env var):
1. "gradient" — Purple→Pink→Blue (default, described above)
2. "neon" — Dark #0a0a0a + neon cyan #00ffff borders and text glow
3. "minimal" — White background, dark text, no gradient, solid border buttons
4. "sunset" — Warm orange→pink→purple gradient
5. "forest" — Deep green→teal gradient with emerald accents

ANIMATIONS:
- Background gradient: slow 15s infinite animation (background-position shift)
- Link buttons: staggered entrance (each delays 80ms, fade-in + slide-up)
- Button tap: pulse ripple effect
- Avatar: subtle float animation (translateY 3px, 3s infinite)
- YouTube embed: fade-in on scroll
- Respect prefers-reduced-motion: disable all motion, show static gradient

ACCESSIBILITY:
- All link buttons are <a> tags with proper href
- Focus-visible ring (ring-2 ring-white/50)
- Color contrast: white text on gradient must meet 4.5:1
- Screen reader: aria-label on icon-only elements
- Touch targets: 44px minimum

Korean labels: 유튜브 채널, 인스타그램, 네이버 블로그, 트위터/X, 틱톡, 포트폴리오, 문의하기
English labels: YouTube Channel, Instagram, Blog, Twitter/X, TikTok, Portfolio, Contact
```

</details>

---

## 부록: 체크리스트

### 반응형 QA 체크리스트

- [ ] 375px (iPhone SE) — 가로 스크롤 없음
- [ ] 390px (iPhone 14) — 기본 모바일 뷰
- [ ] 768px (iPad) — 태블릿 레이아웃 전환
- [ ] 1024px (iPad 가로) — 중간 레이아웃
- [ ] 1280px (노트북) — 데스크톱 레이아웃
- [ ] 1536px (와이드 모니터) — 최대 컨테이너 확인

### 접근성 체크리스트

- [ ] `lang="ko"` 설정 (한국어) / `lang="en"` (영어)
- [ ] 색상 대비 4.5:1 이상 (axe DevTools로 검증)
- [ ] 모든 이미지에 alt 텍스트
- [ ] 키보드 네비게이션 (Tab + Enter) 완전 동작
- [ ] `prefers-reduced-motion` 미디어쿼리 적용
- [ ] 터치타겟 최소 44x44px
- [ ] Focus-visible 아웃라인 (2px, 3:1 대비)

### i18n 체크리스트

- [ ] `NEXT_PUBLIC_LANG=ko` 시 모든 UI 한국어
- [ ] `NEXT_PUBLIC_LANG=en` 시 모든 UI 영어
- [ ] 날짜 포맷: ko → "2026년 2월 19일", en → "Feb 19, 2026"
- [ ] 통화: ko → ₩, en → $
- [ ] 전화번호 포맷: ko → 010-XXXX-XXXX, en → +1 (XXX) XXX-XXXX
