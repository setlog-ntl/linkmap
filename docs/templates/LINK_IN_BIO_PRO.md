# Link-in-Bio Pro 템플릿 리빌딩 가이드

> 이 문서는 `templates/link-in-bio-pro/` 템플릿을 처음부터 다시 구축하기 위한 완전한 스펙 문서입니다.

## 1. 개요

| 항목 | 값 |
|------|-----|
| 이름 | Link-in-Bio Pro |
| 용도 | SNS 프로필 링크 허브 (Linktree 대안) |
| 프레임워크 | Next.js 15 (App Router) + Static Export |
| 스타일링 | Tailwind CSS 4.0 |
| 아이콘 | lucide-react |
| 다크모드 | next-themes |
| i18n | React Context (ko/en) |
| 배포 대상 | GitHub Pages (정적 HTML) |

## 2. 디렉토리 구조

```
link-in-bio-pro/
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 루트 레이아웃 (ThemeProvider, LocaleProvider, SEO)
│   │   ├── page.tsx            # 메인 페이지 (모든 컴포넌트 조합)
│   │   ├── globals.css         # Tailwind + 커스텀 애니메이션
│   │   └── api/og/route.tsx    # OG 이미지 생성 (1200×630)
│   ├── components/
│   │   ├── profile-section.tsx # 아바타 + 이름 + 바이오
│   │   ├── link-list.tsx       # 링크 카드 목록
│   │   ├── social-bar.tsx      # 소셜 미디어 아이콘 바
│   │   ├── content-embed.tsx   # YouTube 임베드
│   │   ├── footer.tsx          # 푸터 (Linkmap 귀속 + 토글)
│   │   ├── theme-toggle.tsx    # 다크/라이트 모드 전환
│   │   └── language-toggle.tsx # 한국어/영어 전환
│   └── lib/
│       ├── config.ts           # 환경변수 → siteConfig 객체
│       ├── i18n.tsx            # i18n Context + 번역 사전
│       └── themes.ts           # 10개 테마 프리셋
```

## 3. 의존성

```json
{
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-themes": "^0.4.4",
    "lucide-react": "^0.468.0"
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

## 4. 빌드 설정

### next.config.ts
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',         // 정적 HTML 출력
  images: { unoptimized: true },  // 정적 배포용 이미지 최적화 비활성화
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
```

### postcss.config.mjs
```javascript
const config = {
  plugins: { '@tailwindcss/postcss': {} },
};
export default config;
```

### tsconfig.json 핵심
- `target`: ES2017
- `moduleResolution`: bundler
- `paths`: `@/*` → `./src/*`

## 5. 환경변수 (전체)

| 변수명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `NEXT_PUBLIC_SITE_NAME` | string | `내 링크 페이지` | 사이트 이름 (한국어) |
| `NEXT_PUBLIC_SITE_NAME_EN` | string | `My Link Page` | 사이트 이름 (영어) |
| `NEXT_PUBLIC_BIO` | string | `안녕하세요! 여기서...` | 자기소개 (한국어) |
| `NEXT_PUBLIC_BIO_EN` | string | `Hello! Check out...` | 자기소개 (영어) |
| `NEXT_PUBLIC_AVATAR_URL` | string\|null | `null` | 프로필 이미지 URL |
| `NEXT_PUBLIC_THEME` | string | `gradient` | 테마 이름 (10개 중 택1) |
| `NEXT_PUBLIC_LINKS` | JSON | 데모 4개 | 링크 배열 `LinkItem[]` |
| `NEXT_PUBLIC_SOCIALS` | JSON | `[]` | 소셜 배열 `SocialItem[]` |
| `NEXT_PUBLIC_YOUTUBE_URL` | string\|null | `null` | YouTube 영상 URL |
| `NEXT_PUBLIC_GA_ID` | string\|null | `null` | Google Analytics ID |

## 6. 데이터 모델

### LinkItem
```typescript
interface LinkItem {
  title: string;       // 링크 제목 (한국어)
  titleEn?: string;    // 링크 제목 (영어, 선택)
  url: string;         // 링크 URL
  icon?: string;       // 아이콘 키 ('youtube' | 'pen-line' | 'briefcase' | 'shopping-bag')
}
```

### SocialItem
```typescript
interface SocialItem {
  platform: string;    // 'instagram' | 'youtube' | 'twitter' | 'github' | 'linkedin' | 'facebook'
  url: string;         // 프로필 URL
}
```

### ThemePreset
```typescript
interface ThemePreset {
  name: string;
  label: string;
  backgroundFrom: string;   // 그라디언트 시작색
  backgroundTo: string;     // 그라디언트 끝색
  primary: string;          // 강조색
  text: string;             // 텍스트 색
  textMuted: string;        // 보조 텍스트 색
  cardBg: string;           // 카드 배경 (rgba)
  cardBorder: string;       // 카드 테두리 (rgba)
}
```

## 7. 테마 프리셋 (10개)

| 이름 | backgroundFrom | primary | backgroundTo | 특징 |
|------|---------------|---------|-------------|------|
| `gradient` | `#8b5cf6` | `#ec4899` | `#f97316` | 보라→핑크→주황 그라디언트 |
| `neon` | `#0f172a` | `#22d3ee` | `#1e293b` | 다크 배경 + 시안 네온 |
| `minimal` | `#ffffff` | `#1f2937` | `#f3f4f6` | 흰 배경 + 그레이 카드 |
| `pastel` | `#fce7f3` | `#f472b6` | `#dbeafe` | 핑크→블루 파스텔 |
| `dark` | `#0f172a` | `#a78bfa` | `#1e1b4b` | 다크 네이비 + 바이올렛 |
| `ocean` | `#164e63` | `#06b6d4` | `#0c4a6e` | 딥 블루 + 시안 |
| `sunset` | `#7c2d12` | `#f59e0b` | `#78350f` | 오렌지-브라운 석양 |
| `forest` | `#14532d` | `#22c55e` | `#1a2e05` | 딥 그린 + 라임 |
| `candy` | `#fdf2f8` | `#f472b6` | `#fce7f3` | 라이트 핑크 캔디 |
| `monochrome` | `#111827` | `#6b7280` | `#1f2937` | 무채색 다크 |

각 테마의 `cardBg`는 rgba 투명도 8~15%, `cardBorder`는 rgba 투명도 20~25% (글래스모피즘 효과).

## 8. 컴포넌트 상세 스펙

### 8.1 page.tsx (메인 페이지)
- 레이아웃: `min-h-screen flex flex-col items-center justify-center p-4`
- 배경: `linear-gradient(135deg, backgroundFrom, primary, backgroundTo)` + `background-size: 200% 200%`
- 애니메이션: `animate-gradient` (15초 주기 그라디언트 이동)
- 컨텐츠 래퍼: `w-full max-w-md mx-auto flex flex-col items-center gap-6 py-12`
- 렌더링 순서: ProfileSection → LinkList → SocialBar(조건부) → ContentEmbed(조건부) → Footer

### 8.2 ProfileSection
- **아바타**: 96×96px (`w-24 h-24`) 원형
  - 이미지 있으면: `<img>` + `rounded-full object-cover ring-2 ring-white/30`
  - 이미지 없으면: 이니셜 2자 (이름 단어 첫 글자) + `backgroundColor: theme.primary` + 흰 텍스트
- **이름**: `text-2xl font-bold` + `color: theme.text`
- **바이오**: `text-base max-w-xs` + `color: theme.textMuted`
- i18n: locale에 따라 `siteName` / `siteNameEn`, `bio` / `bioEn` 전환

### 8.3 LinkList
- 각 링크는 `<a>` 태그 (새 탭)
- 스타일: `px-5 py-3.5 rounded-xl backdrop-blur-sm`
- 배경: `theme.cardBg`, 테두리: `1px solid ${theme.cardBorder}`
- 아이콘 매핑: `youtube` → Youtube, `pen-line` → PenLine, `briefcase` → Briefcase, `shopping-bag` → ShoppingBag, 기본값 → ExternalLink
- 인터랙션: `hover:scale-[1.02] active:scale-[0.98]` (200ms transition)
- 레이아웃: 왼쪽 아이콘(5×5) + 가운데 제목(flex-1) + 오른쪽 ExternalLink(4×4, opacity-40)

### 8.4 SocialBar
- 수평 정렬: `flex items-center gap-4`
- 아이콘: 5×5px, `opacity-70 hover:opacity-100`
- 플랫폼 매핑: instagram, youtube, twitter, github, linkedin, facebook → 해당 Lucide 아이콘, 기본값 → Globe

### 8.5 ContentEmbed (YouTube)
- YouTube URL에서 videoId 추출 (정규식: youtu.be, embed, v, watch 형식 모두 지원)
- `youtube-nocookie.com` 도메인 사용 (프라이버시)
- 16:9 비율 (`aspectRatio: '16/9'`), `rounded-xl`
- videoId 추출 실패 시 `null` 반환

### 8.6 Footer
- 구성: "Powered by Linkmap" + LanguageToggle + ThemeToggle
- 스타일: `text-xs` + `color: theme.textMuted`

### 8.7 ThemeToggle
- `useSyncExternalStore`로 hydration mismatch 방지 (서버: `false`, 클라이언트: `true`)
- 미마운트 시 `<div className="w-8 h-8" />` placeholder
- Sun(다크모드시) / Moon(라이트모드시) 아이콘 4×4
- `p-1.5 rounded-full hover:bg-white/10`

### 8.8 LanguageToggle
- Globe 아이콘(3.5×3.5) + "EN"(한국어 모드시) / "한국어"(영어 모드시)
- `px-2 py-1 rounded-full text-xs font-medium`

## 9. i18n 시스템

### 구현 방식
- React Context API (`LocaleContext`)
- localStorage에 `locale` 키로 저장
- `document.documentElement.lang` 속성 동기화
- 기본 로케일: `ko`

### 번역 키
```typescript
{
  ko: {
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
    'footer.powered': 'Powered by',
  },
  en: {
    'theme.light': 'Switch to light mode',
    'theme.dark': 'Switch to dark mode',
    'footer.powered': 'Powered by',
  }
}
```

## 10. OG 이미지 생성

- 엔드포인트: `GET /api/og`
- `export const dynamic = 'force-static'` (빌드 시 1회 생성)
- 사이즈: 1200×630px
- 내용:
  - 배경: theme 그라디언트
  - 중앙 원형(120×120): 이름 첫 2자 + `theme.primary` 배경
  - 이름: 48px bold + `theme.text`
  - 바이오: 24px + `theme.textMuted`, max-width 600px

## 11. SEO

### Meta Tags (layout.tsx)
- `title`: siteConfig.siteName
- `description`: siteConfig.bio
- `openGraph.type`: website
- `openGraph.images`: `/api/og`
- `twitter.card`: summary_large_image
- `robots`: `{ index: true, follow: true }`

### JSON-LD (layout.tsx)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "사이트명",
  "description": "바이오",
  "image": "아바타 URL (조건부)"
}
```

### 웹 폰트
- Pretendard Variable (jsDelivr CDN)
- `@theme { --font-sans: 'Pretendard Variable', 'Inter', ui-sans-serif, system-ui, sans-serif; }`

## 12. CSS 애니메이션

```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 15s ease infinite;
}

/* 접근성: 애니메이션 비활성화 */
@media (prefers-reduced-motion: reduce) {
  .animate-gradient { animation: none; }
}
```

## 13. 데모 데이터

```typescript
const DEMO_LINKS: LinkItem[] = [
  { title: '내 유튜브 채널', titleEn: 'My YouTube Channel', url: 'https://youtube.com', icon: 'youtube' },
  { title: '블로그 구경하기', titleEn: 'Visit My Blog', url: 'https://blog.example.com', icon: 'pen-line' },
  { title: '포트폴리오', titleEn: 'Portfolio', url: 'https://portfolio.example.com', icon: 'briefcase' },
  { title: '할인 이벤트 바로가기', titleEn: 'Special Offers', url: 'https://shop.example.com', icon: 'shopping-bag' },
];
```

## 14. 리빌딩 체크리스트

- [ ] Next.js 15 프로젝트 초기화 (`output: 'export'`)
- [ ] Tailwind CSS 4.0 + postcss 설정
- [ ] Pretendard 웹폰트 CDN 링크 추가
- [ ] `lib/config.ts` — 환경변수 파싱 + siteConfig 객체
- [ ] `lib/themes.ts` — 10개 테마 프리셋 정의
- [ ] `lib/i18n.tsx` — LocaleProvider + useLocale 훅
- [ ] `globals.css` — gradient-shift 애니메이션 + prefers-reduced-motion
- [ ] `layout.tsx` — ThemeProvider, LocaleProvider, SEO 메타, JSON-LD
- [ ] `page.tsx` — 테마 적용 + 컴포넌트 조합
- [ ] `ProfileSection` — 아바타/이니셜 + 이름 + 바이오
- [ ] `LinkList` — 아이콘 매핑 + 글래스모피즘 카드
- [ ] `SocialBar` — 소셜 아이콘 수평 바
- [ ] `ContentEmbed` — YouTube nocookie 임베드
- [ ] `ThemeToggle` — useSyncExternalStore + Sun/Moon
- [ ] `LanguageToggle` — Globe + 로케일 전환
- [ ] `Footer` — Linkmap 귀속 + 토글들
- [ ] `api/og/route.tsx` — OG 이미지 생성
- [ ] 접근성: aria-label, semantic HTML, reduced-motion
- [ ] 빌드 테스트: `npm run build` → 정적 출력 확인
