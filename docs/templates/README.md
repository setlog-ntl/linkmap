# 템플릿 리빌딩 가이드 (총괄)

> 3종 템플릿의 공통 아키텍처와 개별 스펙 문서 인덱스입니다.

## 개별 문서

| 템플릿 | 문서 | 용도 |
|--------|------|------|
| Link-in-Bio Pro | [LINK_IN_BIO_PRO.md](./LINK_IN_BIO_PRO.md) | SNS 링크 허브 |
| Digital Namecard | [DIGITAL_NAMECARD.md](./DIGITAL_NAMECARD.md) | 디지털 명함 + QR/vCard |
| Dev Showcase | [DEV_SHOWCASE.md](./DEV_SHOWCASE.md) | 개발자 포트폴리오 |

## 공통 아키텍처

### 기술 스택 (3종 공통)
```
Next.js 15.1 (App Router) + Static Export
React 19
TypeScript 5.7
Tailwind CSS 4.0 (@tailwindcss/postcss)
lucide-react 0.468
next-themes 0.4.4
```

### 추가 의존성 (템플릿별)
| 템플릿 | 추가 패키지 |
|--------|-----------|
| link-in-bio-pro | (없음) |
| digital-namecard | `qrcode.react ^4.2.0` |
| dev-showcase | `framer-motion ^12.0.0` |

### 공통 설정 파일

#### next.config.ts
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
};
```

#### postcss.config.mjs
```javascript
const config = { plugins: { '@tailwindcss/postcss': {} } };
```

#### tsconfig.json (핵심)
- `target`: ES2017
- `moduleResolution`: bundler
- `paths`: `@/*` → `./src/*`
- `strict`: true

### 공통 패턴

#### 1. 환경변수 기반 설정
- 모든 사용자 데이터는 `NEXT_PUBLIC_*` 환경변수
- `lib/config.ts`에서 `siteConfig` 객체로 통합
- `parseJSON()` 헬퍼로 JSON 환경변수 안전 파싱 (실패 시 fallback)
- 데모 데이터 내장 (환경변수 없을 때 표시)

#### 2. i18n (국제화)
- React Context API 기반 (`LocaleProvider` + `useLocale` 훅)
- 지원 로케일: `ko` (기본), `en`
- localStorage에 `locale` 키로 저장
- `document.documentElement.lang` 동기화
- 컨텐츠 필드: `field` (ko) + `fieldEn` (en, 선택) 패턴
- 번역 함수: `t(key)` → 없으면 key 반환

#### 3. 다크모드
- `next-themes` ThemeProvider (`attribute="class"`)
- `ThemeToggle` 컴포넌트 (Sun/Moon 아이콘)
- `useSyncExternalStore` hydration mismatch 방지
- 미마운트 시 `<div className="w-8 h-8" />` placeholder

#### 4. SEO
- Next.js Metadata API (title, description, openGraph, twitter)
- JSON-LD structured data (`@type: Person`)
- OG 이미지 생성 (`/api/og`, 1200×630px, `force-static`)
- `robots: { index: true, follow: true }`

#### 5. 웹 폰트
- Pretendard Variable (jsDelivr CDN)
- `@theme { --font-sans: 'Pretendard Variable', 'Inter', ... }`

#### 6. 아바타 폴백
- 이미지 URL 있으면: `<img>` + `rounded-full object-cover`
- 없으면: 이름 이니셜 2자 (대문자) + 강조색 배경 원형

#### 7. 접근성
- `aria-label` 모든 아이콘 전용 버튼
- `prefers-reduced-motion` 미디어 쿼리
- Semantic HTML (`<header>`, `<main>`, `<footer>`, `<section>`, `<nav>`)
- `suppressHydrationWarning` (ThemeProvider)

## 리빌딩 순서 (권장)

### Phase 1: 프로젝트 초기화
```bash
npx create-next-app@latest {template-name} --typescript --tailwind --app --src-dir
```
1. `next.config.ts` — `output: 'export'`, `images.unoptimized`
2. `postcss.config.mjs` — `@tailwindcss/postcss`
3. `globals.css` — `@import "tailwindcss"` + `@theme` (font-sans)
4. 의존성 설치: `npm i next-themes lucide-react` (+ 템플릿별 추가)

### Phase 2: 라이브러리 레이어
1. `lib/config.ts` — 환경변수 파싱 + 데모 데이터
2. `lib/i18n.tsx` — LocaleProvider + 번역 사전
3. 템플릿별: `lib/themes.ts` (link-in-bio) / `lib/vcard.ts` (namecard) / `lib/github.ts` (showcase)

### Phase 3: 공통 컴포넌트
1. `theme-toggle.tsx` — useSyncExternalStore + Sun/Moon
2. `language-toggle.tsx` — Globe + 로케일 전환
3. `footer.tsx` — Linkmap 귀속 + 토글

### Phase 4: 템플릿별 컴포넌트
- 각 템플릿 문서의 "컴포넌트 상세 스펙" 참조

### Phase 5: 레이아웃 & 페이지
1. `layout.tsx` — ThemeProvider, LocaleProvider, SEO, JSON-LD, 웹폰트
2. `page.tsx` — 컴포넌트 조합

### Phase 6: API & 마무리
1. `api/og/route.tsx` — OG 이미지 생성
2. 빌드 테스트: `npm run build`
3. 접근성 검증

## 환경변수 비교표

| 변수 | Link-in-Bio | Namecard | Showcase |
|------|:-----------:|:--------:|:--------:|
| SITE_NAME / SITE_NAME_EN | O | O | O |
| BIO / BIO_EN | O | - | - |
| TITLE / TITLE_EN | - | O | - |
| TAGLINE / TAGLINE_EN | - | - | O |
| ABOUT / ABOUT_EN | - | - | O |
| COMPANY / COMPANY_EN | - | O | - |
| EMAIL | - | O | O |
| PHONE | - | O | - |
| ADDRESS / ADDRESS_EN | - | O | - |
| WEBSITE | - | O | - |
| AVATAR_URL | O | O | - |
| THEME | O | - | - |
| ACCENT_COLOR | - | O | - |
| LINKS (JSON) | O | - | - |
| SOCIALS (JSON) | O | O | - |
| YOUTUBE_URL | O | - | - |
| SKILLS (JSON) | - | - | O |
| EXPERIENCE (JSON) | - | - | O |
| BLOG_POSTS (JSON) | - | - | O |
| GITHUB_USERNAME | - | - | O |
| RESUME_URL | - | - | O |
| LINKEDIN_URL | - | - | O |
| GA_ID | O | O | O |

## DB 연동 (homepage_templates 테이블)

Linkmap 플랫폼에서 원클릭 배포 시 이 템플릿들은 `homepage_templates` 테이블에 등록되어 관리됩니다:

```sql
-- 템플릿 슬러그 → 디렉토리 매핑
'link-in-bio-pro'  → templates/link-in-bio-pro/
'digital-namecard' → templates/digital-namecard/
'dev-showcase'     → templates/dev-showcase/
```

각 템플릿의 `required_env_vars` 필드에 위 환경변수 목록이 JSON으로 저장되어 있으며, 원클릭 배포 시 사용자 입력값이 이 환경변수로 주입됩니다.
