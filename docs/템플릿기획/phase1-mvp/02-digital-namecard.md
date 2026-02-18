# 디지털 명함 (Digital Namecard) 기획서

## 1. 개요

| 항목 | 내용 |
|------|------|
| 슬러그 | `digital-namecard` |
| UUID | `b2c3d4e5-0004-4000-9000-000000000004` |
| 카테고리 | 링크인바이오 & 브랜딩 |
| 타겟 페르소나 | 프리랜서, 직장인, 자영업자 (페르소나: 프리랜서 "동건", 32세) |
| 우선순위 | 2위 (총점 90/100) |
| Phase | Phase 1: MVP+ |
| 구현 일정 | 3일 |
| 비고 | vCard QR 코드 + NFC 지원 온라인 명함 |

### 핵심 가치
- **통제감**: 종이 명함에서 디지털 전환, 실시간 정보 업데이트
- **효율성**: QR 스캔 한 번으로 연락처 저장, 명함 인쇄 비용 제거
- **바이럴 엔진**: 오프라인 미팅 → QR 스캔 → 웹 방문

---

## 2. AI 구현 프롬프트

> 이 섹션을 통째로 AI(Claude Code, Cursor 등)에 전달하면 템플릿을 구현할 수 있다.

```
## 컨텍스트
Linkmap(https://www.linkmap.biz)의 원클릭 배포용 홈페이지 템플릿을 구현한다.
사용자가 GitHub 연결 → 템플릿 선택 → 환경변수 입력 → GitHub Pages 배포 3단계로 개인 디지털 명함 페이지를 생성한다.

## 템플릿: 디지털 명함 (digital-namecard)
- 타겟: 프리랜서, 직장인, 자영업자
- 카테고리: 링크인바이오 & 브랜딩
- 핵심 목적: vCard QR 코드 + NFC 지원 온라인 명함. 연락처·SNS 통합

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 폰트: Pretendard(한글) + Inter(영문) via next/font
- 아이콘: Lucide React
- QR 코드: qrcode.react 라이브러리
- 다크모드: next-themes
- SEO: next/metadata + JSON-LD
- OG 이미지: @vercel/og (/api/og)
- 배포: GitHub Pages (static export)

## 핵심 섹션
1. 프로필 카드: 이름 + 직함 + 회사 (실물 명함 느낌의 카드 레이아웃)
2. 연락처 정보: 전화, 이메일, 주소 (아이콘 + 텍스트, 클릭 시 바로 연결)
3. 소셜 미디어: SNS 링크 아이콘 그리드
4. QR 코드: vCard 형식 자동 생성 (qrcode.react)
5. "연락처에 저장" 버튼: vCard 파일(.vcf) 다운로드
6. 푸터: Powered by Linkmap + 다크모드 토글

## 디자인 스펙
- 실물 명함 느낌의 카드 레이아웃 (aspect-ratio 카드형)
- 미니멀 타이포그래피 중심 (깔끔한 비즈니스 톤)
- 상단 컬러 바 (그라데이션, 환경변수로 커스텀 가능)
- 인쇄 가능한 CSS (@media print, 명함 크기 맞춤)
- 다크/라이트 모드 모두 세련된 디자인
- 모바일 최적화 360px 기준
- 컬러: CSS 변수 `--accent`, `--background`, `--foreground` 기반

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 이름
- NEXT_PUBLIC_TITLE: 직함
- NEXT_PUBLIC_COMPANY: 회사명
- NEXT_PUBLIC_EMAIL: 이메일
- NEXT_PUBLIC_PHONE: 전화번호
- NEXT_PUBLIC_ADDRESS: 주소
- NEXT_PUBLIC_WEBSITE: 웹사이트 URL
- NEXT_PUBLIC_SOCIALS: SNS 링크 JSON ([{"platform":"linkedin","url":"..."}])
- NEXT_PUBLIC_AVATAR_URL: 프로필 이미지 URL
- NEXT_PUBLIC_ACCENT_COLOR: 상단 바 색상 (기본: #3b82f6)
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. `linkmap-templates/digital-namecard` GitHub 레포에 Next.js 프로젝트 생성
2. 모든 개인화 데이터는 NEXT_PUBLIC_* 환경변수로 주입
3. 환경변수 미설정 시 매력적인 데모 데이터 표시
4. Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
5. 한국어 기본, lang="ko"
6. 반응형: 360px ~ 1440px
7. 다크모드 토글 포함
8. /api/og 엔드포인트로 동적 OG 이미지 생성
9. JSON-LD 구조화 데이터 (Person 타입)
10. 접근성: WCAG 2.1 AA, 키보드 내비게이션
11. vCard 3.0 형식 QR 코드 자동 생성
12. .vcf 파일 다운로드 기능
13. @media print CSS로 명함 크기 인쇄 지원
```

---

## 3. 핵심 섹션 정의

### 섹션 1: 프로필 카드
- **위치**: 페이지 최상단 (센터 정렬)
- **구성**: 상단 컬러 바(h-2, 그라데이션) + 원형 아바타(80px) + 이름(2xl bold) + 직함(lg) + 회사명(base, text-muted)
- **레이아웃**: 카드형 `rounded-2xl shadow-lg bg-white dark:bg-gray-900`
- **상단 바**: `NEXT_PUBLIC_ACCENT_COLOR` 기반 그라데이션

### 섹션 2: 연락처 정보
- **위치**: 프로필 카드 아래 (카드 내부)
- **구성**: 각 항목 = Lucide 아이콘 + 텍스트 (Phone, Mail, MapPin, Globe)
- **인터랙션**: 전화번호 → `tel:` 링크, 이메일 → `mailto:` 링크, 주소 → Google Maps 링크
- **스타일**: `flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800`

### 섹션 3: 소셜 미디어
- **위치**: 연락처 아래 (카드 내부)
- **구성**: Lucide 아이콘 그리드 (LinkedIn, Twitter, Instagram, Github, Facebook 등)
- **인터랙션**: hover → `text-accent`, `scale-110`, transition 200ms
- **데이터**: `NEXT_PUBLIC_SOCIALS` JSON 파싱

### 섹션 4: QR 코드
- **위치**: 소셜 아래 (카드 내부 또는 별도 섹션)
- **구성**: vCard 형식 QR 코드 (qrcode.react, 160x160px)
- **설명**: "QR 코드를 스캔하면 연락처가 저장됩니다" 안내 텍스트
- **vCard**: 이름, 직함, 회사, 전화, 이메일, 주소, 웹사이트 포함

### 섹션 5: "연락처에 저장" 버튼
- **위치**: QR 코드 아래
- **구성**: CTA 버튼 (Download 아이콘 + "연락처에 저장")
- **동작**: vCard 3.0 형식 `.vcf` 파일 생성 및 다운로드
- **스타일**: `w-full py-3 rounded-xl bg-accent text-white font-medium`

### 섹션 6: 푸터
- **위치**: 페이지 최하단
- **구성**: "Powered by Linkmap" + 다크모드 토글
- **스타일**: `text-gray-400 text-xs mt-8`

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:---:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 이름 | O | `'홍길동'` |
| `NEXT_PUBLIC_TITLE` | 직함 | | `'프리랜서 개발자'` |
| `NEXT_PUBLIC_COMPANY` | 회사명 | | `null` (미표시) |
| `NEXT_PUBLIC_EMAIL` | 이메일 | | `null` (미표시) |
| `NEXT_PUBLIC_PHONE` | 전화번호 | | `null` (미표시) |
| `NEXT_PUBLIC_ADDRESS` | 주소 | | `null` (미표시) |
| `NEXT_PUBLIC_WEBSITE` | 웹사이트 URL | | `null` (미표시) |
| `NEXT_PUBLIC_SOCIALS` | SNS 링크 (JSON) | | `[]` |
| `NEXT_PUBLIC_AVATAR_URL` | 프로필 이미지 URL | | `null` (이니셜 아바타 표시) |
| `NEXT_PUBLIC_ACCENT_COLOR` | 상단 바 색상 | | `'#3b82f6'` (blue-500) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | `null` (미추적) |

---

## 5. 디자인 스펙

### 컬러

| 요소 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경 | `#f9fafb` (gray-50) | `#111827` (gray-900) |
| 카드 배경 | `#ffffff` (white) | `#1f2937` (gray-800) |
| 텍스트 (이름) | `#111827` (gray-900) | `#f9fafb` (gray-50) |
| 텍스트 (직함) | `#4b5563` (gray-600) | `#9ca3af` (gray-400) |
| 텍스트 (연락처) | `#374151` (gray-700) | `#d1d5db` (gray-300) |
| 상단 바 | `NEXT_PUBLIC_ACCENT_COLOR` | `NEXT_PUBLIC_ACCENT_COLOR` |
| 아이콘 | `#6b7280` (gray-500) | `#9ca3af` (gray-400) |
| 구분선 | `#f3f4f6` (gray-100) | `#374151` (gray-700) |
| CTA 버튼 | `NEXT_PUBLIC_ACCENT_COLOR` | `NEXT_PUBLIC_ACCENT_COLOR` |

### 타이포그래피
- 이름: `text-2xl font-bold` (Pretendard)
- 직함: `text-lg text-gray-600 dark:text-gray-400` (Pretendard)
- 회사명: `text-base text-gray-500` (Pretendard)
- 연락처: `text-sm` (Inter/Pretendard)
- CTA 버튼: `text-base font-medium` (Pretendard)

### 레이아웃
- 전체: `min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900`
- 카드: `w-full max-w-sm mx-auto rounded-2xl shadow-lg overflow-hidden`
- 카드 내부: `p-6 space-y-4`

### 반응형 브레이크포인트
- 360px (모바일): 기본 레이아웃, 카드 풀 너비(패딩 p-4)
- 640px (sm): max-w-sm 카드 고정
- 768px (md): 불필요 (단일 카드 유지)
- 1024px+: max-w-sm 고정, 센터 정렬

### 인쇄 스타일 (@media print)
- 카드 그림자 제거
- 배경색 흰색 고정
- QR 코드 표시 유지
- 불필요 요소 숨김 (다크모드 토글, Powered by)
- 명함 크기 맞춤: `width: 90mm; height: 55mm;`

---

## 6. 컴포넌트 구조

```
linkmap-templates/digital-namecard/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트(Pretendard+Inter), ThemeProvider
│   │   ├── page.tsx                # 메인 페이지 (서버 컴포넌트 → 클라이언트 래핑)
│   │   └── api/og/route.tsx        # OG 이미지 동적 생성
│   ├── components/
│   │   ├── profile-card.tsx        # 이름 + 직함 + 회사 + 아바타
│   │   ├── contact-info.tsx        # 전화, 이메일, 주소 (Lucide: Mail, Phone, MapPin)
│   │   ├── social-links.tsx        # SNS 아이콘 그리드
│   │   ├── qr-code.tsx             # qrcode.react로 vCard QR 생성
│   │   ├── save-contact-button.tsx # vCard 파일 생성/다운로드 CTA
│   │   ├── theme-toggle.tsx        # 다크모드 토글 버튼
│   │   └── footer.tsx              # Powered by Linkmap
│   └── lib/
│       ├── config.ts               # 환경변수 파싱 + 타입 안전 config
│       └── vcard.ts                # vCard 3.0 문자열 생성 유틸
├── tailwind.config.ts
├── next.config.ts                  # static export 설정
├── package.json
├── tsconfig.json
└── README.md
```

### 컴포넌트 역할

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `layout.tsx` | Server | 메타데이터, 폰트 로드, ThemeProvider 래핑 |
| `page.tsx` | Server | config 읽기 → 클라이언트 컴포넌트에 전달 |
| `profile-card.tsx` | Client | 아바타, 이름, 직함, 회사 렌더링 + 상단 컬러 바 |
| `contact-info.tsx` | Client | 연락처 목록 렌더링 (tel:, mailto: 링크) |
| `social-links.tsx` | Client | SOCIALS JSON 파싱, 아이콘 렌더링 |
| `qr-code.tsx` | Client | vCard 데이터로 QR 코드 생성 |
| `save-contact-button.tsx` | Client | vCard 파일 생성 + Blob 다운로드 |
| `theme-toggle.tsx` | Client | next-themes 토글 버튼 |
| `footer.tsx` | Server | 정적 푸터 텍스트 |
| `config.ts` | Util | `process.env.NEXT_PUBLIC_*` → 타입 안전 객체 |
| `vcard.ts` | Util | vCard 3.0 형식 문자열 생성 함수 |

---

## 7. 시드 데이터

### 7.1 SQL INSERT (homepage_templates)

```sql
INSERT INTO homepage_templates (
  id, slug, name, name_ko, description, description_ko,
  preview_image_url, github_owner, github_repo, default_branch,
  framework, required_env_vars, tags, is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0004-4000-9000-000000000004',
  'digital-namecard',
  'Digital Namecard',
  '디지털 명함',
  'Online business card with vCard QR code, NFC support, and contact save. Replace paper cards with a living digital profile.',
  '온라인 명함. vCard QR 코드, NFC 지원, 연락처 저장 버튼. 종이 명함을 대체하는 디지털 프로필.',
  NULL,
  'linkmap-templates',
  'digital-namecard',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "이름", "required": true},
    {"key": "NEXT_PUBLIC_TITLE", "description": "직함", "required": false},
    {"key": "NEXT_PUBLIC_COMPANY", "description": "회사명", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "이메일", "required": false},
    {"key": "NEXT_PUBLIC_PHONE", "description": "전화번호", "required": false},
    {"key": "NEXT_PUBLIC_ADDRESS", "description": "주소", "required": false},
    {"key": "NEXT_PUBLIC_WEBSITE", "description": "웹사이트 URL", "required": false},
    {"key": "NEXT_PUBLIC_SOCIALS", "description": "SNS 링크 JSON", "required": false},
    {"key": "NEXT_PUBLIC_AVATAR_URL", "description": "프로필 이미지 URL", "required": false},
    {"key": "NEXT_PUBLIC_ACCENT_COLOR", "description": "상단 바 색상", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['namecard', 'vcard', 'qr-code', 'business', 'contact', 'nextjs'],
  false,
  true,
  4
) ON CONFLICT (slug) DO NOTHING;
```

### 7.2 TypeScript 시드 (`homepage-templates.ts` 추가분)

```typescript
{
  id: 'b2c3d4e5-0004-4000-9000-000000000004',
  slug: 'digital-namecard',
  name: 'Digital Namecard',
  name_ko: '디지털 명함',
  description: 'Online business card with vCard QR code, NFC support, and contact save. Replace paper cards with a living digital profile.',
  description_ko: '온라인 명함. vCard QR 코드, NFC 지원, 연락처 저장 버튼. 종이 명함을 대체하는 디지털 프로필.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'digital-namecard',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '이름', required: true },
    { key: 'NEXT_PUBLIC_TITLE', description: '직함', required: false },
    { key: 'NEXT_PUBLIC_COMPANY', description: '회사명', required: false },
    { key: 'NEXT_PUBLIC_EMAIL', description: '이메일', required: false },
    { key: 'NEXT_PUBLIC_PHONE', description: '전화번호', required: false },
    { key: 'NEXT_PUBLIC_ADDRESS', description: '주소', required: false },
    { key: 'NEXT_PUBLIC_WEBSITE', description: '웹사이트 URL', required: false },
    { key: 'NEXT_PUBLIC_SOCIALS', description: 'SNS 링크 JSON', required: false },
    { key: 'NEXT_PUBLIC_AVATAR_URL', description: '프로필 이미지 URL', required: false },
    { key: 'NEXT_PUBLIC_ACCENT_COLOR', description: '상단 바 색상', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['namecard', 'vcard', 'qr-code', 'business', 'contact', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 4,
}
```

---

## 8. 검증 체크리스트

### 기능
- [ ] 프로필 사진, 이름, 직함, 회사명 정상 표시
- [ ] 전화번호 클릭 시 전화 앱 연결 (tel: 링크)
- [ ] 이메일 클릭 시 메일 앱 연결 (mailto: 링크)
- [ ] 주소 클릭 시 지도 앱 연결
- [ ] 소셜 미디어 아이콘 클릭 동작
- [ ] QR 코드 정상 생성 (vCard 형식)
- [ ] "연락처에 저장" 버튼 → .vcf 파일 다운로드
- [ ] 다운로드된 .vcf 파일이 iOS/Android 연락처에 정상 추가
- [ ] 환경변수 미설정 시 데모 데이터 표시
- [ ] 다크모드 토글 동작

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
- [ ] 연락처 링크에 적절한 alt/title 속성

### SEO
- [ ] OG 메타태그 정상 생성
- [ ] JSON-LD Person 구조화 데이터
- [ ] /api/og 이미지 생성 확인
- [ ] robots.txt 존재
