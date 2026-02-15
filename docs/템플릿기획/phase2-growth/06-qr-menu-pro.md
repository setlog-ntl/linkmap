# QR 메뉴판 프로 (QR Menu Pro) 기획서

## 1. 개요

| 항목 | 내용 |
|------|------|
| 슬러그 | `qr-menu-pro` |
| UUID | `b2c3d4e5-0018-4000-9000-000000000018` |
| 카테고리 | 비즈니스 |
| 타겟 페르소나 | 식당/카페 사장님 (페르소나: QR메뉴 사장님 "성호", 42세) |
| 우선순위 | 6위 (총점 82/100) |
| Phase | Phase 2: 수익화·성장 |
| 구현 일정 | 3일 |
| 비고 | QR코드 스캔 → 디지털 메뉴판. 사진갤러리, 알레르기 정보, 다국어 지원 |

### 핵심 가치
- **비대면 위생**: 종이 메뉴 없이 QR 스캔으로 메뉴 확인 (코로나 이후 표준)
- **실시간 업데이트**: 메뉴 추가/가격 변경을 환경변수만 수정하면 즉시 반영 (인쇄 비용 제거)
- **다국어 지원**: 외국인 관광객 대응 (한/영/중/일)
- **시각적 어필**: 대형 사진 갤러리로 음식 매력 극대화

### 선정 근거
- QR코드 스캔 4년간 433% 증가 (qrcodechimp.com)
- 소상공인 모바일 이용률 75%+, 3초 로딩 필수
- 소상공인 디지털 전환 진입점으로 B2B 채널 확장 가능

---

## 2. AI 구현 프롬프트

> 이 섹션을 통째로 AI(Claude Code, Cursor 등)에 전달하면 템플릿을 구현할 수 있다.

```
## 컨텍스트
Linkmap(https://linkmap.vercel.app)의 원클릭 배포용 홈페이지 템플릿을 구현한다.
사용자가 GitHub 연결 → 템플릿 선택 → 환경변수 입력 → GitHub Pages 배포 3단계로 디지털 QR 메뉴판을 생성한다.

## 템플릿: QR 메뉴판 프로 (qr-menu-pro)
- 타겟: 식당/카페/음식점 사장님
- 카테고리: 비즈니스
- 핵심 목적: QR코드 스캔 → 디지털 메뉴판. 사진 갤러리, 알레르기 정보, 카테고리 필터, 다국어 지원

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 폰트: Pretendard(한글) + Inter(영문) via next/font
- 아이콘: Lucide React
- QR코드 생성: qrcode.react 라이브러리
- 다크모드: next-themes
- SEO: next/metadata + JSON-LD
- OG 이미지: @vercel/og (/api/og)
- 배포: GitHub Pages (static export)

## 핵심 섹션
1. 헤더: 가게 로고/이름 + 영업시간 + 전화번호 + 위치(카카오맵 링크)
2. 카테고리 탭: 가로 스크롤 탭 바 (추천, 메인, 사이드, 음료, 디저트 등)
3. 메뉴 리스트: 사진(aspect-square) + 메뉴명 + 가격 + 설명 + 알레르기 태그
4. 메뉴 상세 모달: 큰 사진 + 상세 설명 + 알레르기 정보 + 영양 정보(선택)
5. 다국어 토글: 한/영/중/일 언어 전환 버튼
6. QR코드 표시: 현재 페이지 URL의 QR코드 표시 (인쇄용)
7. 푸터: 가게 주소 + 카카오맵 링크 + "Powered by Linkmap"

## 디자인 스펙
- 모바일 최적화 (360px 기본, 메뉴판은 98% 모바일에서 조회)
- 음식 사진 중심: 큰 썸네일(aspect-square, rounded-xl), 선명한 이미지
- 깔끔한 카드 레이아웃, 충분한 여백
- 가격 강조: text-lg font-bold, 통화 단위 표시 (₩)
- 알레르기 태그: 아이콘 + 텍스트 (bg-amber-100 text-amber-800 rounded-full)
- 카테고리 탭: sticky top, 가로 스크롤, 선택된 탭 밑줄 애니메이션
- 컬러: warm tone — amber/orange 악센트, 깨끗한 white 배경
  - Primary: amber-700 (#b45309) / Dark: amber-400 (#fbbf24)
  - Background: white / Dark: stone-950 (#0c0a09)
  - Card: stone-50 (#fafaf9) / Dark: stone-900 (#1c1917)
- 폰트: 메뉴명 lg font-semibold, 가격 lg font-bold, 설명 sm text-muted

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 가게 이름
- NEXT_PUBLIC_LOGO_URL: 가게 로고 이미지 URL
- NEXT_PUBLIC_PHONE: 전화번호
- NEXT_PUBLIC_ADDRESS: 가게 주소
- NEXT_PUBLIC_KAKAOMAP_URL: 카카오맵 링크
- NEXT_PUBLIC_HOURS: 영업시간 텍스트
- NEXT_PUBLIC_CATEGORIES: 카테고리 목록 JSON (["추천","메인","사이드","음료"])
- NEXT_PUBLIC_MENU_ITEMS: 메뉴 목록 JSON ([{"name":"비빔밥","price":12000,"category":"메인","image_url":"...","description":"...","allergens":["콩","참깨"],"name_en":"Bibimbap","name_zh":"拌饭","name_ja":"ビビンバ"}])
- NEXT_PUBLIC_CURRENCY: 통화 기호 (기본: "₩")
- NEXT_PUBLIC_DEFAULT_LANG: 기본 언어 (기본: "ko")
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. `linkmap-templates/qr-menu-pro` GitHub 레포에 Next.js 프로젝트 생성
2. 모든 개인화 데이터는 NEXT_PUBLIC_* 환경변수로 주입
3. 환경변수 미설정 시 가상의 한식당 데모 데이터 표시 (메뉴 12개+)
4. Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
5. 한국어 기본, lang="ko"
6. 반응형: 360px ~ 1440px (모바일 최적화 최우선)
7. 다크모드 토글 포함
8. /api/og 엔드포인트로 가게명+대표메뉴 사진이 포함된 OG 이미지 생성
9. JSON-LD 구조화 데이터 (Restaurant + Menu 타입)
10. 접근성: WCAG 2.1 AA, 키보드 내비게이션
11. 카테고리 탭은 sticky position으로 스크롤 시 상단 고정
12. 메뉴 상세는 모달(Sheet) 형태, 모바일에서 바텀시트
13. QR코드는 qrcode.react로 생성, 인쇄 버튼 제공
14. 다국어: MENU_ITEMS JSON에 name_en, name_zh, name_ja 필드 사용
15. 알레르기 정보: 한국 식품알레르기 22종 아이콘 매핑
```

---

## 3. 핵심 섹션 정의

### 섹션 1: 헤더
- **위치**: 페이지 최상단 (py-6, 센터 정렬)
- **구성**: 가게 로고(64px) + 가게 이름(2xl bold) + 영업시간 + 전화/위치 아이콘 링크
- **스타일**: 깔끔한 화이트 배경, 로고 rounded-xl, 하단 subtle border
- **데이터**: `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_LOGO_URL`, `NEXT_PUBLIC_HOURS`, `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_KAKAOMAP_URL`

### 섹션 2: 카테고리 탭 바
- **위치**: 헤더 아래 (sticky top-0 z-40)
- **구성**: 가로 스크롤 탭 버튼 리스트 (overflow-x-auto, scrollbar-hide)
- **인터랙션**: 탭 클릭 → 해당 카테고리로 스크롤, 선택된 탭에 밑줄 애니메이션
- **스타일**: `bg-white/90 dark:bg-stone-950/90 backdrop-blur-md`, 선택 탭 `border-b-2 border-amber-600`
- **데이터**: `NEXT_PUBLIC_CATEGORIES` JSON

### 섹션 3: 메뉴 리스트
- **위치**: 카테고리 탭 아래
- **구성**: 카테고리별 그룹 헤더(xl font-bold) + 메뉴 카드 그리드(모바일 1열, md 2열)
- **메뉴 카드**: 사진(aspect-square, rounded-xl, 120px) + 메뉴명(lg font-semibold) + 가격(lg font-bold text-amber-700) + 설명 1줄(sm truncate) + 알레르기 태그(아이콘)
- **인터랙션**: 카드 클릭 → 상세 모달 오픈, hover 시 `shadow-md`
- **데이터**: `NEXT_PUBLIC_MENU_ITEMS` JSON

### 섹션 4: 메뉴 상세 모달
- **타입**: 바텀시트(모바일) / 센터 모달(데스크톱)
- **구성**: 큰 사진(aspect-video, rounded-t-xl) + 메뉴명 + 가격 + 상세 설명 + 알레르기 정보(아이콘+텍스트) + 영양정보(선택)
- **인터랙션**: 스와이프 다운으로 닫기(모바일), X 버튼, 외부 클릭으로 닫기
- **스타일**: `bg-white dark:bg-stone-900 rounded-t-2xl`, 오버레이 `bg-black/50`

### 섹션 5: 다국어 토글
- **위치**: 헤더 우측 (또는 고정 플로팅 버튼)
- **구성**: 언어 아이콘 + 드롭다운 (🇰🇷 한국어 / 🇺🇸 English / 🇨🇳 中文 / 🇯🇵 日本語)
- **동작**: 선택한 언어로 메뉴명 전환 (name → name_en/name_zh/name_ja)
- **폴백**: 해당 언어 필드가 없으면 한국어(name) 기본 표시

### 섹션 6: QR코드 페이지
- **위치**: 설정/관리 영역 (별도 라우트 또는 하단 섹션)
- **구성**: 현재 사이트 URL QR코드(256px) + "QR코드 다운로드" 버튼 + "인쇄하기" 버튼
- **기술**: `qrcode.react` 라이브러리로 SVG QR코드 생성
- **용도**: 테이블 스티커, 카운터 전시용 QR 인쇄

### 섹션 7: 푸터
- **위치**: 페이지 최하단
- **구성**: 가게 주소 + 카카오맵 링크 버튼 + 전화 링크 + "Powered by Linkmap"
- **스타일**: `text-stone-500 text-sm border-t py-8`

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:---:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 가게 이름 | O | `'맛있는 한식당'` |
| `NEXT_PUBLIC_LOGO_URL` | 가게 로고 이미지 URL | | `null` (이니셜 아바타) |
| `NEXT_PUBLIC_PHONE` | 전화번호 | | `'02-1234-5678'` |
| `NEXT_PUBLIC_ADDRESS` | 가게 주소 | | `'서울시 강남구 테헤란로 123'` |
| `NEXT_PUBLIC_KAKAOMAP_URL` | 카카오맵 링크 | | `null` (미표시) |
| `NEXT_PUBLIC_HOURS` | 영업시간 | | `'매일 11:00 - 22:00'` |
| `NEXT_PUBLIC_CATEGORIES` | 카테고리 목록 (JSON) | | `["추천","메인","사이드","음료","디저트"]` |
| `NEXT_PUBLIC_MENU_ITEMS` | 메뉴 목록 (JSON) | | 데모 메뉴 12개 |
| `NEXT_PUBLIC_CURRENCY` | 통화 기호 | | `'₩'` |
| `NEXT_PUBLIC_DEFAULT_LANG` | 기본 언어 | | `'ko'` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | `null` (미추적) |

---

## 5. 디자인 스펙

### 컬러

| 용도 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경 | `#ffffff` (white) | `#0c0a09` (stone-950) |
| 카드 배경 | `#fafaf9` (stone-50) | `#1c1917` (stone-900) |
| 텍스트 (주) | `#1c1917` (stone-900) | `#fafaf9` (stone-50) |
| 텍스트 (보조) | `#78716c` (stone-500) | `#a8a29e` (stone-400) |
| 악센트 (가격) | `#b45309` (amber-700) | `#fbbf24` (amber-400) |
| 카테고리 활성 | `#d97706` (amber-600) | `#f59e0b` (amber-500) |
| 알레르기 태그 BG | `#fef3c7` (amber-100) | `#78350f/30` (amber-900/30) |
| 알레르기 태그 텍스트 | `#92400e` (amber-800) | `#fbbf24` (amber-400) |
| 보더 | `#e7e5e4` (stone-200) | `#44403c` (stone-700) |

### 타이포그래피
- 가게 이름: `text-2xl font-bold` (Pretendard)
- 카테고리 탭: `text-sm font-medium` (Pretendard)
- 메뉴명: `text-lg font-semibold` (Pretendard)
- 가격: `text-lg font-bold text-amber-700` (Inter, tabular-nums)
- 설명: `text-sm text-stone-500` (Pretendard)
- 알레르기: `text-xs font-medium` (Pretendard)

### 레이아웃
- 전체: `min-h-screen bg-white dark:bg-stone-950`
- 콘텐츠: `max-w-lg mx-auto px-4` (모바일 최적화, 좁은 폭)
- 메뉴 카드: `flex gap-3` (사진 좌측 + 텍스트 우측)
- 카테고리 탭: `flex gap-2 overflow-x-auto scrollbar-hide`

### 반응형 브레이크포인트
- 360px (모바일): 단일 열 메뉴 리스트, 카테고리 가로 스크롤
- 640px (sm): 동일 (모바일 최적화 유지)
- 768px (md): 메뉴 2열 그리드 옵션
- 1024px+: max-w-lg 고정, 센터 정렬

---

## 6. 컴포넌트 구조

```
linkmap-templates/qr-menu-pro/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트, ThemeProvider
│   │   ├── page.tsx                # 메인 페이지 (섹션 조합)
│   │   └── api/og/route.tsx        # OG 이미지 (가게명+대표메뉴)
│   ├── components/
│   │   ├── store-header.tsx        # 가게 로고+이름+영업시간+연락처
│   │   ├── category-tabs.tsx       # 가로 스크롤 카테고리 탭 (sticky)
│   │   ├── menu-list.tsx           # 카테고리별 메뉴 카드 리스트
│   │   ├── menu-card.tsx           # 개별 메뉴 카드 (사진+이름+가격)
│   │   ├── menu-detail-modal.tsx   # 메뉴 상세 바텀시트/모달
│   │   ├── allergen-tags.tsx       # 알레르기 정보 태그
│   │   ├── language-toggle.tsx     # 다국어 전환 드롭다운
│   │   ├── qr-code-section.tsx     # QR코드 생성+인쇄 (qrcode.react)
│   │   ├── theme-toggle.tsx        # 다크모드 토글
│   │   └── footer.tsx              # 가게주소+카카오맵+Linkmap
│   └── lib/
│       ├── config.ts               # 환경변수 파싱 + 타입 안전 config
│       ├── allergens.ts            # 한국 식품알레르기 22종 매핑
│       └── i18n.ts                 # 다국어 메뉴명 전환 유틸
├── tailwind.config.ts
├── next.config.ts                  # static export
├── package.json
├── tsconfig.json
└── README.md
```

### 컴포넌트 역할

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `layout.tsx` | Server | 메타데이터, 폰트, ThemeProvider, JSON-LD (Restaurant) |
| `page.tsx` | Server | config 읽기, 섹션 조합 |
| `store-header.tsx` | Server | 가게 정보 표시, 전화/위치 링크 |
| `category-tabs.tsx` | Client | Sticky 카테고리 탭, 스크롤 연동 |
| `menu-list.tsx` | Client | 카테고리별 그룹핑, 메뉴 카드 렌더링 |
| `menu-card.tsx` | Client | 개별 메뉴 카드, 클릭 시 상세 오픈 |
| `menu-detail-modal.tsx` | Client | 바텀시트(모바일)/모달(데스크톱), 상세 정보 |
| `allergen-tags.tsx` | Server | 알레르기 아이콘+텍스트 태그 |
| `language-toggle.tsx` | Client | 언어 전환 드롭다운, 상태 관리 |
| `qr-code-section.tsx` | Client | qrcode.react SVG, 다운로드/인쇄 버튼 |
| `footer.tsx` | Server | 가게 주소, 카카오맵, Powered by Linkmap |
| `config.ts` | Util | 환경변수 파싱, 메뉴 JSON 파싱, 기본값 |
| `allergens.ts` | Util | 식품알레르기 22종 아이콘/이름 매핑 |
| `i18n.ts` | Util | 언어별 메뉴명 필드 선택 유틸 |

---

## 7. 시드 데이터

### 7.1 SQL INSERT (homepage_templates)

```sql
INSERT INTO homepage_templates (
  id, slug, name, name_ko, description, description_ko,
  preview_image_url, github_owner, github_repo, default_branch,
  framework, required_env_vars, tags, is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0018-4000-9000-000000000018',
  'qr-menu-pro',
  'QR Menu Pro',
  'QR 메뉴판 프로',
  'Digital QR menu for restaurants and cafes. Photo gallery, allergen info, multi-language support, category tabs, and printable QR code.',
  '식당/카페 디지털 QR 메뉴판. 사진 갤러리, 알레르기 정보, 다국어 지원, 카테고리 필터, QR코드 인쇄.',
  NULL,
  'linkmap-templates',
  'qr-menu-pro',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "가게 이름", "required": true},
    {"key": "NEXT_PUBLIC_LOGO_URL", "description": "가게 로고 URL", "required": false},
    {"key": "NEXT_PUBLIC_PHONE", "description": "전화번호", "required": false},
    {"key": "NEXT_PUBLIC_ADDRESS", "description": "가게 주소", "required": false},
    {"key": "NEXT_PUBLIC_KAKAOMAP_URL", "description": "카카오맵 링크", "required": false},
    {"key": "NEXT_PUBLIC_HOURS", "description": "영업시간", "required": false},
    {"key": "NEXT_PUBLIC_CATEGORIES", "description": "카테고리 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_MENU_ITEMS", "description": "메뉴 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_CURRENCY", "description": "통화 기호", "required": false},
    {"key": "NEXT_PUBLIC_DEFAULT_LANG", "description": "기본 언어", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['restaurant', 'cafe', 'qr-menu', 'food', 'multilingual', 'business', 'nextjs'],
  false,
  true,
  8
) ON CONFLICT (slug) DO NOTHING;
```

### 7.2 TypeScript 시드 (`homepage-templates.ts` 추가분)

```typescript
{
  id: 'b2c3d4e5-0018-4000-9000-000000000018',
  slug: 'qr-menu-pro',
  name: 'QR Menu Pro',
  name_ko: 'QR 메뉴판 프로',
  description: 'Digital QR menu for restaurants and cafes. Photo gallery, allergen info, multi-language support, category tabs, and printable QR code.',
  description_ko: '식당/카페 디지털 QR 메뉴판. 사진 갤러리, 알레르기 정보, 다국어 지원, 카테고리 필터, QR코드 인쇄.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'qr-menu-pro',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '가게 이름', required: true },
    { key: 'NEXT_PUBLIC_LOGO_URL', description: '가게 로고 URL', required: false },
    { key: 'NEXT_PUBLIC_PHONE', description: '전화번호', required: false },
    { key: 'NEXT_PUBLIC_ADDRESS', description: '가게 주소', required: false },
    { key: 'NEXT_PUBLIC_KAKAOMAP_URL', description: '카카오맵 링크', required: false },
    { key: 'NEXT_PUBLIC_HOURS', description: '영업시간', required: false },
    { key: 'NEXT_PUBLIC_CATEGORIES', description: '카테고리 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_MENU_ITEMS', description: '메뉴 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_CURRENCY', description: '통화 기호', required: false },
    { key: 'NEXT_PUBLIC_DEFAULT_LANG', description: '기본 언어', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['restaurant', 'cafe', 'qr-menu', 'food', 'multilingual', 'business', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 8,
}
```

---

## 8. 검증 체크리스트

### 기능
- [ ] 가게 헤더 정보 (로고, 이름, 영업시간, 전화, 위치) 정상 표시
- [ ] 카테고리 탭 가로 스크롤 동작
- [ ] 카테고리 탭 클릭 시 해당 섹션 스크롤
- [ ] 카테고리 탭 sticky position 동작
- [ ] 메뉴 카드 사진+이름+가격+설명 정상 표시
- [ ] 메뉴 카드 클릭 시 상세 모달/바텀시트 오픈
- [ ] 상세 모달 스와이프 닫기(모바일), X 버튼, 외부 클릭 닫기
- [ ] 알레르기 태그 아이콘+텍스트 정상 표시
- [ ] 다국어 토글 → 메뉴명 전환 동작 (ko/en/zh/ja)
- [ ] 해당 언어 필드 없을 시 한국어 폴백
- [ ] QR코드 생성 정상 동작 (qrcode.react)
- [ ] QR코드 다운로드/인쇄 버튼 동작
- [ ] 환경변수 미설정 시 데모 한식당 메뉴 표시
- [ ] 다크모드 토글 동작
- [ ] JSON 환경변수 파싱 실패 시 기본값 폴백

### 성능
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 90+
- [ ] Lighthouse Best Practices 90+
- [ ] Lighthouse SEO 90+
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] 이미지 lazy loading 적용

### 접근성
- [ ] 키보드 내비게이션 (Tab 순서, 모달 포커스 트랩)
- [ ] 스크린리더 호환 (aria-label, 이미지 alt)
- [ ] 컬러 대비 WCAG 2.1 AA
- [ ] 모달 ESC 키로 닫기

### SEO
- [ ] OG 메타태그 (가게명+대표메뉴 이미지)
- [ ] JSON-LD Restaurant + Menu 구조화 데이터
- [ ] /api/og 이미지 생성 확인
- [ ] robots.txt 존재
```
