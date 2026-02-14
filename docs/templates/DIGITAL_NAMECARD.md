# Digital Namecard 템플릿 리빌딩 가이드

> 이 문서는 `templates/digital-namecard/` 템플릿을 처음부터 다시 구축하기 위한 완전한 스펙 문서입니다.

## 1. 개요

| 항목 | 값 |
|------|-----|
| 이름 | Digital Namecard |
| 용도 | 디지털 명함 (QR 코드 + vCard 다운로드) |
| 프레임워크 | Next.js 15 (App Router) + Static Export |
| 스타일링 | Tailwind CSS 4.0 |
| 아이콘 | lucide-react |
| QR 코드 | qrcode.react |
| 다크모드 | next-themes |
| i18n | React Context (ko/en) |
| 배포 대상 | GitHub Pages (정적 HTML) |

## 2. 디렉토리 구조

```
digital-namecard/
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 루트 레이아웃 (ThemeProvider, LocaleProvider, SEO)
│   │   ├── page.tsx            # 메인 페이지 (카드 레이아웃)
│   │   ├── globals.css         # Tailwind + 인쇄 스타일
│   │   └── api/og/route.tsx    # OG 이미지 생성 (1200×630)
│   ├── components/
│   │   ├── profile-card.tsx    # 아바타 + 이름 + 직함 + 회사
│   │   ├── contact-info.tsx    # 전화/이메일/주소/웹사이트
│   │   ├── social-links.tsx    # 소셜 미디어 아이콘
│   │   ├── qr-code.tsx         # QR 코드 (vCard 데이터)
│   │   ├── save-contact-button.tsx # vCard 다운로드 버튼
│   │   ├── footer.tsx          # 푸터 (Linkmap + 토글)
│   │   ├── theme-toggle.tsx    # 다크/라이트 전환
│   │   └── language-toggle.tsx # 한국어/영어 전환
│   └── lib/
│       ├── config.ts           # 환경변수 → siteConfig 객체
│       ├── i18n.tsx            # i18n Context + 번역 사전
│       └── vcard.ts            # vCard 3.0 생성기
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
    "qrcode.react": "^4.2.0"
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

**link-in-bio-pro와 차이점**: `qrcode.react` 추가 (QR 코드 SVG 생성)

## 4. 빌드 설정

link-in-bio-pro와 동일:
- `output: 'export'` (정적 HTML)
- `images: { unoptimized: true }`
- path alias: `@/*` → `./src/*`

## 5. 환경변수 (전체)

| 변수명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `NEXT_PUBLIC_SITE_NAME` | string | `홍길동` | 이름 (한국어) |
| `NEXT_PUBLIC_SITE_NAME_EN` | string | `Gildong Hong` | 이름 (영어) |
| `NEXT_PUBLIC_TITLE` | string | `프리랜서 개발자` | 직함 (한국어) |
| `NEXT_PUBLIC_TITLE_EN` | string | `Freelance Developer` | 직함 (영어) |
| `NEXT_PUBLIC_COMPANY` | string\|null | `null` | 회사명 (한국어) |
| `NEXT_PUBLIC_COMPANY_EN` | string\|null | `null` | 회사명 (영어) |
| `NEXT_PUBLIC_EMAIL` | string | `hello@example.com` | 이메일 |
| `NEXT_PUBLIC_PHONE` | string | `010-1234-5678` | 전화번호 |
| `NEXT_PUBLIC_ADDRESS` | string\|null | `null` | 주소 (한국어) |
| `NEXT_PUBLIC_ADDRESS_EN` | string\|null | `null` | 주소 (영어) |
| `NEXT_PUBLIC_WEBSITE` | string\|null | `null` | 웹사이트 URL |
| `NEXT_PUBLIC_SOCIALS` | JSON | `[]` | 소셜 배열 `SocialItem[]` |
| `NEXT_PUBLIC_AVATAR_URL` | string\|null | `null` | 프로필 이미지 URL |
| `NEXT_PUBLIC_ACCENT_COLOR` | string | `#3b82f6` | 강조색 (hex) |
| `NEXT_PUBLIC_GA_ID` | string\|null | `null` | Google Analytics ID |

## 6. 데이터 모델

### SiteConfig
```typescript
const siteConfig = {
  name: string;          // 이름 (ko)
  nameEn: string;        // 이름 (en)
  title: string;         // 직함 (ko)
  titleEn: string;       // 직함 (en)
  company: string | null;
  companyEn: string | null;
  email: string;
  phone: string;
  address: string | null;
  addressEn: string | null;
  website: string | null;
  socials: SocialItem[];
  avatarUrl: string | null;
  accentColor: string;   // hex color (기본: #3b82f6)
  gaId: string | null;
};
```

### SocialItem
```typescript
interface SocialItem {
  platform: string;   // 'linkedin' | 'twitter' | 'instagram' | 'github' | 'facebook'
  url: string;
}
```

### VCardData
```typescript
interface VCardData {
  name: string;
  title?: string | null;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
}
```

## 7. 핵심 기능: vCard 생성

### vCard 3.0 포맷
```
BEGIN:VCARD
VERSION:3.0
FN:홍길동
N:홍길동;;;;
TITLE:프리랜서 개발자
ORG:ABC 회사
EMAIL;TYPE=INTERNET:hello@example.com
TEL;TYPE=CELL:010-1234-5678
ADR;TYPE=WORK:;;서울시 강남구;;;;
URL:https://example.com
END:VCARD
```

### 사용처
1. **QR 코드**: vCard 문자열을 QRCodeSVG의 `value`로 전달 → 스캔하면 연락처 저장
2. **다운로드 버튼**: vCard 문자열을 Blob으로 변환 → `.vcf` 파일 다운로드

### 구현
```typescript
export function generateVCard(data: VCardData): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${data.name}`, `N:${data.name};;;;`];
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.company) lines.push(`ORG:${data.company}`);
  if (data.email) lines.push(`EMAIL;TYPE=INTERNET:${data.email}`);
  if (data.phone) lines.push(`TEL;TYPE=CELL:${data.phone}`);
  if (data.address) lines.push(`ADR;TYPE=WORK:;;${data.address};;;;`);
  if (data.website) lines.push(`URL:${data.website}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}
```

## 8. 컴포넌트 상세 스펙

### 8.1 page.tsx (메인 페이지)
- 레이아웃: `min-h-screen flex flex-col items-center justify-center p-4`
- 카드 래퍼: `w-full max-w-sm mx-auto`
- 카드: `rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-800`
- 상단 액센트 바: `h-2` + `linear-gradient(90deg, accentColor, accentColor + dd)`
- 카드 내부: `p-6 space-y-5`
- 렌더링 순서: ProfileCard → ContactInfo → SocialLinks(조건부) → QrCode → SaveContactButton
- 카드 외부: Footer

### 8.2 ProfileCard
- **아바타**: 80×80px (`w-20 h-20`) 원형
  - 이미지 있으면: `<img>` + `rounded-full object-cover`
  - 이미지 없으면: 이니셜 2자 + `backgroundColor: accentColor` + 흰 텍스트
- **이름**: `text-2xl font-bold text-gray-900 dark:text-gray-50`
- **직함**: `text-lg text-gray-600 dark:text-gray-400`
- **회사**: `text-base text-gray-500` (조건부)
- i18n: locale에 따라 name/nameEn, title/titleEn, company/companyEn 전환

### 8.3 ContactInfo
- 4가지 연락처 항목 (모두 조건부):
  1. **전화**: Phone 아이콘 + `tel:` 링크 (비숫자 제거, + 유지)
  2. **이메일**: Mail 아이콘 + `mailto:` 링크
  3. **주소**: MapPin 아이콘 + Google Maps 링크 (`encodeURIComponent`)
  4. **웹사이트**: Globe 아이콘 + 외부 링크 (프로토콜 제거 표시)
- 각 항목: `flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-gray-700`
- 아이콘: `w-4 h-4 text-gray-500 shrink-0`
- 텍스트: `text-sm truncate`
- 외부 링크(Globe, MapPin)는 `target="_blank"`

### 8.4 SocialLinks
- `flex items-center justify-center gap-4`
- 플랫폼 매핑: linkedin, twitter, instagram, github, facebook → Lucide 아이콘, 기본값 → Globe
- 아이콘: `w-5 h-5`, `p-2 rounded-full`
- 인터랙션: `hover:scale-110` (200ms transition)
- `--tw-ring-color: accentColor` (CSS variable)

### 8.5 QrCode
- `QRCodeSVG` 컴포넌트 (qrcode.react)
- 값: `generateVCard()` 결과
- 크기: 160×160px
- 에러 수정 레벨: `M` (15%)
- 색상: 배경 `#ffffff`, 전경 `#111827`
- 래퍼: `p-3 bg-white rounded-xl` (항상 흰 배경)
- 힌트 텍스트: `text-xs text-gray-400` + `t('qr.hint')`

### 8.6 SaveContactButton
- 전체 너비 버튼: `w-full py-3 rounded-xl font-medium`
- 배경: `config.accentColor`
- 텍스트: 흰색 + Download 아이콘(4×4)
- 클릭 시:
  1. `generateVCard()` 호출
  2. `Blob` 생성 (`text/vcard;charset=utf-8`)
  3. `URL.createObjectURL()` → 임시 `<a>` → `.click()` → 정리
  4. 파일명: `{이름}.vcf`
- 인터랙션: `hover:opacity-90 active:opacity-80`

### 8.7 Footer
- `print-hide` 클래스 (인쇄 시 숨김)
- `flex items-center justify-center gap-2 text-gray-400 text-xs mt-8 pb-4`
- 구성: "Powered by Linkmap" + LanguageToggle + ThemeToggle

### 8.8 ThemeToggle
- link-in-bio-pro와 동일 구현
- `useSyncExternalStore` hydration 처리
- 색상: `text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`

### 8.9 LanguageToggle
- link-in-bio-pro와 동일 구현 (theme prop 없음)
- 색상: `text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`

## 9. i18n 시스템

### 번역 키
```typescript
{
  ko: {
    'contact.call': '전화하기',
    'contact.email': '이메일 보내기',
    'contact.map': '지도에서 보기',
    'contact.website': '웹사이트 방문',
    'qr.hint': 'QR 코드를 스캔하면 연락처가 저장됩니다',
    'save.contact': '연락처에 저장',
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
    'footer.powered': 'Powered by',
  },
  en: {
    'contact.call': 'Call',
    'contact.email': 'Send email',
    'contact.map': 'View on map',
    'contact.website': 'Visit website',
    'qr.hint': 'Scan QR code to save contact',
    'save.contact': 'Save Contact',
    'theme.light': 'Switch to light mode',
    'theme.dark': 'Switch to dark mode',
    'footer.powered': 'Powered by',
  }
}
```

## 10. 인쇄 최적화

```css
@media print {
  body {
    background: white !important;
    margin: 0;
    padding: 0;
  }
  .print-card {
    width: 90mm;      /* 표준 명함 가로 */
    height: 55mm;     /* 표준 명함 세로 */
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0 auto;
    overflow: hidden;
  }
  .print-hide {
    display: none !important;  /* Footer 숨김 */
  }
}
```

**인쇄 시 동작**:
- 카드가 90mm × 55mm 표준 명함 사이즈로 출력
- 그림자, 라운딩 제거
- Footer(토글 버튼 등) 숨김
- 흰 배경 강제

## 11. OG 이미지 생성

- 엔드포인트: `GET /api/og`
- `export const dynamic = 'force-static'`
- 사이즈: 1200×630px
- 내용:
  - 흰 배경 + 상단 8px 액센트 컬러 바
  - 원형(100×100) 이니셜 아바타
  - 이름: 48px bold `#111827`
  - 직함: 28px `#6b7280`
  - 회사: 22px `#9ca3af` (조건부)

## 12. SEO

### Meta Tags
- `title`: `{이름} - 디지털 명함`
- `description`: `{이름} | {직함}`
- `openGraph.images`: `/api/og`
- `twitter.card`: `summary_large_image`

### JSON-LD
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "이름",
  "jobTitle": "직함",
  "worksFor": { "@type": "Organization", "name": "회사명" },
  "email": "이메일",
  "telephone": "전화번호",
  "url": "웹사이트"
}
```
※ 모든 필드 조건부 (값이 있을 때만 포함)

## 13. 디자인 시스템 비교 (vs link-in-bio-pro)

| 항목 | Link-in-Bio Pro | Digital Namecard |
|------|----------------|------------------|
| 배경 | 풀스크린 그라디언트 | `bg-gray-50 dark:bg-gray-900` |
| 카드 | 글래스모피즘 (투명) | 불투명 카드 (흰/다크) |
| 테마 | 10개 프리셋 | 단일 (accentColor만 변경) |
| 레이아웃 | 중앙 세로 | 카드형 (max-w-sm) |
| 특수 기능 | YouTube 임베드 | QR 코드 + vCard 다운로드 |
| 인쇄 | 없음 | 90mm×55mm 명함 출력 |
| 아바타 | 96×96px | 80×80px |
| body 색 | 테마에 의존 | gray-50/gray-900 |

## 14. 리빌딩 체크리스트

- [ ] Next.js 15 프로젝트 초기화 (`output: 'export'`)
- [ ] Tailwind CSS 4.0 + postcss 설정
- [ ] `qrcode.react` 의존성 추가
- [ ] Pretendard 웹폰트 CDN 링크
- [ ] `lib/config.ts` — 환경변수 파싱 (name, title, company, email, phone, address, website, socials, accentColor)
- [ ] `lib/vcard.ts` — vCard 3.0 생성기 (CRLF 줄바꿈)
- [ ] `lib/i18n.tsx` — LocaleProvider + 9개 번역 키
- [ ] `globals.css` — Tailwind import + print media query (90mm×55mm)
- [ ] `layout.tsx` — ThemeProvider, LocaleProvider, SEO, JSON-LD (Person)
- [ ] `page.tsx` — 카드 레이아웃 + 액센트 바 + 컴포넌트 조합
- [ ] `ProfileCard` — 아바타/이니셜 + 이름 + 직함 + 회사
- [ ] `ContactInfo` — 4가지 연락처 (tel, mailto, maps, website)
- [ ] `SocialLinks` — 5개 플랫폼 아이콘 (hover:scale-110)
- [ ] `QrCode` — QRCodeSVG (160px, level M, vCard 데이터)
- [ ] `SaveContactButton` — Blob 다운로드 (.vcf)
- [ ] `ThemeToggle` — useSyncExternalStore + Sun/Moon
- [ ] `LanguageToggle` — Globe + 로케일 전환
- [ ] `Footer` — print-hide + Linkmap 귀속
- [ ] `api/og/route.tsx` — OG 이미지 생성
- [ ] 인쇄 테스트: 브라우저 인쇄 → 90mm×55mm 확인
- [ ] 빌드 테스트: `npm run build` → 정적 출력 확인
