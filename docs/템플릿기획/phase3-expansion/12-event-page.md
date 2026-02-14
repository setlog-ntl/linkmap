# 이벤트 페이지 (Event Page) 기획서

## 1. 개요

| 항목 | 내용 |
|------|------|
| 슬러그 | `event-page` |
| UUID | `b2c3d4e5-0014-4000-9000-000000000014` |
| 카테고리 | 커뮤니티 & 비영리 |
| 타겟 페르소나 | 이벤트/컨퍼런스 기획자 (페르소나: 이벤트 기획자 "혜진", 31세) |
| 우선순위 | 12위 (총점 76/100) |
| Phase | Phase 3: 확장 |
| 구현 일정 | 3일 |
| 비고 | 카운트다운 타이머 + 스피커 소개 + 일정표 + 신청 폼/링크 |

### 핵심 가치
- **긴급성 유발**: 실시간 카운트다운 타이머로 신청 전환 촉진
- **정보 전달**: 스피커, 타임테이블, 장소 정보를 한눈에 파악
- **신청 전환**: 눈에 띄는 CTA와 참가비 정보로 즉각적인 행동 유도
- **심리 패턴**: 긴급성(카운트다운) + 권위(스피커) + 사회적 증거(스폰서) + 행동 유도(신청 CTA)

---

## 2. AI 구현 프롬프트

> 이 섹션을 통째로 AI(Claude Code, Cursor 등)에 전달하면 템플릿을 구현할 수 있다.

```
## 컨텍스트
Linkmap(https://linkmap.vercel.app)의 원클릭 배포용 홈페이지 템플릿을 구현한다.
사용자가 GitHub 연결 → 템플릿 선택 → 환경변수 입력 → GitHub Pages 배포 3단계로 이벤트/컨퍼런스 홍보 페이지를 생성한다.

## 템플릿: 이벤트 페이지 (event-page)
- 타겟: 이벤트/컨퍼런스 기획자, 밋업 운영자
- 카테고리: 커뮤니티 & 비영리
- 핵심 목적: 이벤트 정보 전달 + 신청 전환. 카운트다운 타이머, 스피커 소개, 타임테이블, 장소 안내, 신청 링크를 통한 이벤트 홍보

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 폰트: Pretendard(한글) + Inter(영문) via next/font
- 아이콘: Lucide React
- 다크모드: next-themes
- SEO: next/metadata + JSON-LD
- OG 이미지: @vercel/og (/api/og)
- 배포: GitHub Pages (static export)

## 핵심 섹션
1. 히어로: 이벤트명(대형) + 날짜/장소 + 실시간 카운트다운 타이머(일/시/분/초) + CTA "지금 신청하기"
2. 소개: 이벤트 설명 텍스트 + 핵심 키워드 태그 뱃지
3. 스피커: 스피커 카드 그리드 (원형 사진 + 이름 + 소속 + 발표 주제)
4. 타임테이블: 시간대별 일정표 (시간 + 세션명 + 스피커명 + 장소/트랙)
5. 장소/접근: 지도 임베드(iframe) + 주소 + 교통 안내 텍스트
6. 신청: 큰 CTA 버튼(외부 링크 or Google Form) + 참가비 정보 + 정원
7. 스폰서: 스폰서 로고 그리드 (등급별: 골드/실버/브론즈)
8. 푸터: SNS 링크 + 문의 이메일 + Powered by Linkmap

## 디자인 스펙
- 이벤트 느낌의 다이내믹 디자인
- 카운트다운 타이머: 큰 숫자 + 라벨(일/시/분/초), 배경 카드 또는 flip 효과
- 타임테이블: 시간축 좌측 + 세션 정보 우측, 가독성 최우선
- 스피커 카드: 원형 사진 + 호버 시 소속/주제 강조
- 밝은 배경 + 포인트 컬러 (오렌지/코랄 또는 환경변수로 커스텀)
- 컬러: 배경 #ffffff(라이트) / #1a1a2e(다크), 악센트 #f97316(orange-500), 보조 #06b6d4(cyan-500)
- 폰트: 이벤트명 4xl~6xl font-bold, 카운트다운 숫자 5xl~7xl font-bold mono, 본문 base

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 이벤트 이름
- NEXT_PUBLIC_EVENT_DATE: 이벤트 날짜/시간 (ISO 8601 형식, 예: "2026-06-15T09:00:00+09:00")
- NEXT_PUBLIC_EVENT_LOCATION: 장소 이름 + 주소
- NEXT_PUBLIC_DESCRIPTION: 이벤트 설명 텍스트
- NEXT_PUBLIC_SPEAKERS: 스피커 목록 JSON ([{"name":"...", "title":"...", "org":"...", "topic":"...", "image_url":"..."}])
- NEXT_PUBLIC_TIMETABLE: 일정표 JSON ([{"time":"09:00", "end_time":"09:30", "title":"오프닝", "speaker":"...", "track":"메인홀"}])
- NEXT_PUBLIC_MAP_URL: Google Maps 또는 Naver Map 임베드 URL
- NEXT_PUBLIC_REGISTER_URL: 신청 링크 (Google Form, Eventbrite 등)
- NEXT_PUBLIC_TICKET_PRICE: 참가비 정보 (예: "무료", "50,000원", "얼리버드 30,000원")
- NEXT_PUBLIC_SPONSORS: 스폰서 목록 JSON ([{"name":"...", "logo_url":"...", "tier":"gold|silver|bronze", "url":"..."}])
- NEXT_PUBLIC_EMAIL: 문의 이메일
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. `linkmap-templates/event-page` GitHub 레포에 Next.js 프로젝트 생성
2. 모든 개인화 데이터는 NEXT_PUBLIC_* 환경변수로 주입
3. 환경변수 미설정 시 매력적인 데모 데이터 표시 (가상의 테크 컨퍼런스)
4. Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
5. 한국어 기본, lang="ko"
6. 반응형: 360px ~ 1440px
7. 다크모드 토글 포함
8. /api/og 엔드포인트로 동적 OG 이미지 생성
9. JSON-LD 구조화 데이터 (Event 타입 + startDate, location, organizer)
10. 접근성: WCAG 2.1 AA, 키보드 내비게이션
11. 카운트다운 타이머: 클라이언트 사이드 setInterval(1초), 이벤트 종료 시 "이벤트가 진행 중입니다" 표시
12. 타임테이블: 모바일에서 카드 형식 세로 배치
13. 지도 임베드: iframe lazy loading, 미설정 시 주소 텍스트만 표시
14. 스폰서 로고: 등급(tier)별 크기 차등 (골드 > 실버 > 브론즈)
15. 이벤트 날짜 미설정 시 카운트다운 숨김
```

---

## 3. 핵심 섹션 정의

### 섹션 1: 히어로 + 카운트다운
- **위치**: 페이지 최상단 (py-20 md:py-32, 배경 그라데이션 또는 이미지)
- **구성**:
  - 이벤트명 (4xl~6xl, font-bold, 센터)
  - 날짜 + 장소 뱃지 (CalendarDays 아이콘 + MapPin 아이콘, text-lg)
  - 카운트다운 타이머: 4개 카드 (일/시/분/초), 각 카드 = 숫자(5xl~7xl, font-bold, monospace) + 라벨(xs, uppercase)
  - CTA 버튼: "지금 신청하기" (bg-orange-500 text-white, 큰 사이즈)
  - 배경: 그라데이션 (`from-orange-500/10 via-transparent to-cyan-500/10`) 또는 패턴
- **인터랙션**:
  - 카운트다운: setInterval(1000ms), 매초 업데이트
  - 이벤트 종료(날짜 경과) → "이벤트가 진행 중입니다!" 또는 "이벤트가 종료되었습니다"
  - CTA hover → bg-orange-600, scale(1.02)
  - CTA 클릭 → `NEXT_PUBLIC_REGISTER_URL`로 이동 (새 탭)
- **데이터**: `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_EVENT_DATE`, `NEXT_PUBLIC_EVENT_LOCATION`, `NEXT_PUBLIC_REGISTER_URL`
- **폴백**: "FutureTech 2026" + 30일 후 날짜 + "서울 코엑스 그랜드볼룸"

### 섹션 2: 소개
- **위치**: 히어로 아래 (py-16)
- **구성**:
  - 섹션 타이틀: "이벤트 소개"
  - 설명 텍스트 (lg, leading-relaxed, max-w-3xl mx-auto, 센터)
  - 핵심 키워드 태그 뱃지: pill 형태 (bg-orange-100 text-orange-700, 가로 나열)
- **인터랙션**:
  - 스크롤 진입 시 fade-up
  - 태그 뱃지: 정적 (클릭 불가)
- **데이터**: `NEXT_PUBLIC_DESCRIPTION`
- **폴백**: 가상의 테크 컨퍼런스 설명 + 키워드 태그 5개 (AI, Web3, Cloud, DevOps, Startup)

### 섹션 3: 스피커
- **위치**: 소개 아래 (py-20, bg-neutral-50 dark:bg-neutral-900)
- **구성**:
  - 섹션 타이틀: "스피커"
  - 카드 그리드 (md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
  - 각 카드: 원형 사진(120px, rounded-full, border-4 border-orange-500/20) + 이름(lg, font-semibold) + 소속(sm, text-neutral-500) + 발표 주제 뱃지(xs, bg-orange-100)
  - 카드: `bg-white dark:bg-neutral-800 rounded-xl p-6 text-center`
- **인터랙션**:
  - 카드 hover → shadow-lg, 사진 border-color → border-orange-500
  - 스크롤 진입 시 staggered fade-up (stagger 0.1s)
- **데이터**: `NEXT_PUBLIC_SPEAKERS` JSON 배열
- **폴백**: 데모 스피커 6명 (가상 이름/소속/주제)

### 섹션 4: 타임테이블
- **위치**: 스피커 아래 (py-20)
- **구성**:
  - 섹션 타이틀: "일정표"
  - 데스크톱: 테이블 형식 (시간 | 세션명 | 스피커 | 장소/트랙)
    - 좌측 시간 칼럼: `text-sm font-mono text-neutral-500`, 고정 폭
    - 세션 행: `border-b border-neutral-200`, hover → `bg-neutral-50`
    - 브레이크/점심: `bg-orange-50 dark:bg-orange-950/20 italic`
  - 모바일: 카드 형식 세로 배치 (시간 뱃지 + 세션명 + 스피커 + 장소)
- **인터랙션**:
  - 행 hover → 배경색 변경
  - 스크롤 진입 시 fade-up
- **데이터**: `NEXT_PUBLIC_TIMETABLE` JSON 배열
- **폴백**: 데모 일정 10개 (오프닝, 키노트, 세션 5개, 점심, 네트워킹, 클로징)

### 섹션 5: 장소/접근
- **위치**: 타임테이블 아래 (py-20, bg-neutral-50 dark:bg-neutral-900)
- **구성**:
  - 섹션 타이틀: "장소 안내"
  - 좌: 지도 임베드 (iframe, rounded-xl, aspect-video, loading="lazy")
  - 우: 장소명(xl, font-semibold) + 주소(base) + 교통 안내 리스트(지하철/버스/주차)
  - 모바일: 지도 상단 → 정보 하단 (세로)
- **인터랙션**:
  - 지도 iframe: lazy loading
  - `NEXT_PUBLIC_MAP_URL` 미설정 → 지도 숨기고 주소만 표시
- **데이터**: `NEXT_PUBLIC_MAP_URL`, `NEXT_PUBLIC_EVENT_LOCATION`
- **폴백**: "서울 코엑스 그랜드볼룸" + 주소 + 교통 안내 텍스트

### 섹션 6: 신청
- **위치**: 장소 아래 (py-20, bg-gradient-to-r from-orange-500 to-cyan-500 text-white)
- **구성**:
  - 헤드라인: "지금 참가 신청하세요" (3xl~4xl, font-bold, 센터)
  - 참가비 정보: 가격(2xl, font-bold) + 설명(sm)
  - 정원 정보: "선착순 200명" (optional)
  - CTA 버튼: "신청하기" (bg-white text-orange-600, 큰 사이즈, rounded-full)
- **인터랙션**:
  - CTA hover → bg-neutral-100, scale(1.02)
  - CTA 클릭 → `NEXT_PUBLIC_REGISTER_URL`로 이동 (새 탭)
- **데이터**: `NEXT_PUBLIC_REGISTER_URL`, `NEXT_PUBLIC_TICKET_PRICE`
- **폴백**: "무료" + "#" 링크

### 섹션 7: 스폰서
- **위치**: 신청 아래 (py-16)
- **구성**:
  - 섹션 타이틀: "후원사"
  - 등급별 로고 그리드:
    - 골드: 큰 로고 (h-16), 1~2열
    - 실버: 중간 로고 (h-12), 3~4열
    - 브론즈: 작은 로고 (h-8), 4~6열
  - 각 로고: grayscale → hover 시 컬러, 클릭 시 스폰서 URL 이동
- **인터랙션**:
  - 로고 hover → grayscale-0, opacity-100
  - 클릭 → 스폰서 URL (새 탭)
- **데이터**: `NEXT_PUBLIC_SPONSORS` JSON 배열
- **폴백**: 데모 스폰서 8개 (골드 2 + 실버 3 + 브론즈 3)

### 섹션 8: 푸터
- **위치**: 페이지 최하단 (py-8, border-t)
- **구성**:
  - 이벤트명 + 날짜
  - 문의 이메일 (Mail 아이콘 + 링크)
  - SNS 아이콘 (Twitter, Instagram, YouTube 등)
  - "Powered by Linkmap" 텍스트
  - 다크모드 토글
- **데이터**: `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_SITE_NAME`
- **폴백**: "contact@example.com"

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:---:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 이벤트 이름 | O | `'FutureTech 2026'` |
| `NEXT_PUBLIC_EVENT_DATE` | 이벤트 날짜/시간 (ISO 8601) | | 현재 시점 + 30일 후 |
| `NEXT_PUBLIC_EVENT_LOCATION` | 장소 이름 + 주소 | | `'서울 코엑스 그랜드볼룸'` |
| `NEXT_PUBLIC_DESCRIPTION` | 이벤트 설명 텍스트 | | 데모 설명 텍스트 |
| `NEXT_PUBLIC_SPEAKERS` | 스피커 목록 (JSON) | | 데모 스피커 6명 |
| `NEXT_PUBLIC_TIMETABLE` | 일정표 (JSON) | | 데모 일정 10개 |
| `NEXT_PUBLIC_MAP_URL` | 지도 임베드 URL | | `null` (지도 미표시, 주소만) |
| `NEXT_PUBLIC_REGISTER_URL` | 신청 링크 | | `'#'` |
| `NEXT_PUBLIC_TICKET_PRICE` | 참가비 정보 | | `'무료'` |
| `NEXT_PUBLIC_SPONSORS` | 스폰서 목록 (JSON) | | 데모 스폰서 8개 |
| `NEXT_PUBLIC_EMAIL` | 문의 이메일 | | `'contact@example.com'` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | `null` (미추적) |

---

## 5. 디자인 스펙

### 컬러

| 용도 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경 (주) | `#ffffff` | `#1a1a2e` (커스텀 다크 네이비) |
| 배경 (보조) | `#f9fafb` (gray-50) | `#16213e` |
| 텍스트 (주) | `#111827` (gray-900) | `#f3f4f6` (gray-100) |
| 텍스트 (보조) | `#6b7280` (gray-500) | `#9ca3af` (gray-400) |
| 악센트 (주) | `#f97316` (orange-500) | `#fb923c` (orange-400) |
| 악센트 hover | `#ea580c` (orange-600) | `#f97316` (orange-500) |
| 악센트 (보조) | `#06b6d4` (cyan-500) | `#22d3ee` (cyan-400) |
| 카운트다운 배경 | `#1f2937` (gray-800) | `#111827` (gray-900) |
| 카운트다운 숫자 | `#f97316` (orange-500) | `#fb923c` (orange-400) |
| 신청 섹션 | `#f97316` → `#06b6d4` 그라데이션 | 동일 |
| 태그 뱃지 bg | `#fff7ed` (orange-50) | `#431407` (orange-950) |
| 태그 뱃지 text | `#c2410c` (orange-700) | `#fb923c` (orange-400) |
| 타임테이블 브레이크 | `#fff7ed` (orange-50) | `rgba(249,115,22,0.1)` |

### 타이포그래피

| 요소 | 크기 | 굵기 | 기타 |
|------|------|------|------|
| 이벤트명 | `text-4xl md:text-5xl lg:text-6xl` | `font-bold` | `tracking-tight`, Pretendard |
| 날짜/장소 | `text-lg md:text-xl` | `font-medium` | 아이콘 + 텍스트 |
| 카운트다운 숫자 | `text-5xl md:text-6xl lg:text-7xl` | `font-bold` | `font-mono` (tabular-nums), Inter |
| 카운트다운 라벨 | `text-xs` | `font-medium` | `uppercase tracking-widest` |
| 섹션 타이틀 | `text-2xl md:text-3xl` | `font-bold` | Pretendard |
| 스피커 이름 | `text-lg` | `font-semibold` | Pretendard |
| 스피커 소속 | `text-sm` | `font-normal` | `text-gray-500` |
| 타임테이블 시간 | `text-sm` | `font-mono` | `text-gray-500`, Inter |
| 타임테이블 세션명 | `text-base` | `font-semibold` | Pretendard |
| 본문 텍스트 | `text-base md:text-lg` | `font-normal` | `leading-relaxed` |
| 참가비 | `text-2xl md:text-3xl` | `font-bold` | Inter |
| 푸터 | `text-sm` | `font-normal` | `text-gray-500` |

### 레이아웃

- 전체: `min-h-screen bg-white dark:bg-[#1a1a2e]`
- 콘텐츠 영역: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`
- 히어로: `text-center py-20 md:py-32`
- 카운트다운: `flex justify-center gap-4 md:gap-6` (4개 카드)
- 카운트다운 카드: `bg-gray-800 dark:bg-gray-900 rounded-xl p-4 md:p-6 min-w-[80px] md:min-w-[100px]`
- 스피커: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`
- 타임테이블 (데스크톱): `table w-full` 또는 `grid grid-cols-[auto_1fr_auto_auto]`
- 타임테이블 (모바일): `flex flex-col gap-4` (카드 형식)
- 장소: `grid grid-cols-1 md:grid-cols-2 gap-8`
- 신청: `text-center py-20`
- 스폰서: `flex flex-wrap justify-center items-center gap-8`
- 섹션 간격: `py-16 md:py-20`

### 반응형 브레이크포인트

| 브레이크포인트 | 이벤트명 | 카운트다운 | 스피커 | 타임테이블 |
|--------------|---------|----------|-------|----------|
| 360px (모바일) | text-3xl | text-4xl, gap-3 | 1열 | 카드 형식 세로 |
| 640px (sm) | text-4xl | text-5xl | 2열 | 카드 형식 세로 |
| 768px (md) | text-5xl | text-6xl | 2열 | 테이블 형식 가로 |
| 1024px (lg) | text-6xl | text-7xl | 3열 | 테이블 형식 가로 |
| 1280px (xl) | text-6xl | text-7xl | 4열 | 테이블 형식 가로 |
| 1440px | max-w-6xl 고정 | max-w-6xl | 4열 | max-w-6xl |

---

## 6. 컴포넌트 구조

```
linkmap-templates/event-page/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트(Pretendard+Inter), ThemeProvider
│   │   ├── page.tsx                # 메인 페이지 (섹션 조합)
│   │   └── api/og/route.tsx        # OG 이미지 동적 생성
│   ├── components/
│   │   ├── hero-section.tsx        # 이벤트명 + 날짜/장소 + CTA
│   │   ├── countdown-timer.tsx     # 실시간 카운트다운 (일/시/분/초)
│   │   ├── intro-section.tsx       # 이벤트 설명 + 키워드 태그
│   │   ├── speakers-section.tsx    # 스피커 카드 그리드
│   │   ├── speaker-card.tsx        # 개별 스피커 카드 (사진+이름+소속+주제)
│   │   ├── timetable-section.tsx   # 타임테이블 (테이블/카드 반응형)
│   │   ├── venue-section.tsx       # 장소 + 지도 임베드 + 교통 안내
│   │   ├── register-section.tsx    # 신청 CTA + 참가비 정보
│   │   ├── sponsors-section.tsx    # 스폰서 로고 그리드 (등급별 크기)
│   │   ├── footer.tsx              # 이벤트 정보 + SNS + Powered by Linkmap
│   │   └── nav-header.tsx          # 고정 네비게이션 + 다크모드 토글
│   ├── hooks/
│   │   └── use-countdown.ts        # 카운트다운 커스텀 훅 (setInterval + 남은 시간 계산)
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
| `layout.tsx` | Server | 메타데이터, Pretendard+Inter 폰트 로드, ThemeProvider, JSON-LD (Event 타입) |
| `page.tsx` | Server | config 읽기, 섹션 컴포넌트 조합 (Hero → Intro → Speakers → Timetable → Venue → Register → Sponsors → Footer) |
| `hero-section.tsx` | Client | 이벤트명, 날짜/장소, CountdownTimer 포함, CTA 버튼 |
| `countdown-timer.tsx` | Client | useCountdown 훅 사용, 4개 카드(일/시/분/초) 렌더링, 이벤트 종료 상태 처리 |
| `intro-section.tsx` | Client | DESCRIPTION 텍스트 렌더링, 키워드 태그 뱃지 |
| `speakers-section.tsx` | Client | SPEAKERS JSON 파싱, SpeakerCard 그리드 렌더링 |
| `speaker-card.tsx` | Client | 원형 사진, 이름, 소속, 발표 주제 뱃지 (hover 효과) |
| `timetable-section.tsx` | Client | TIMETABLE JSON 파싱, 데스크톱 테이블/모바일 카드 반응형 렌더링, 브레이크 행 스타일 분기 |
| `venue-section.tsx` | Client | 지도 iframe 임베드(lazy), 주소, 교통 안내, MAP_URL 미설정 시 주소만 표시 |
| `register-section.tsx` | Client | 신청 CTA 버튼, 참가비 표시, REGISTER_URL로 이동 |
| `sponsors-section.tsx` | Client | SPONSORS JSON 파싱, 등급(tier)별 로고 크기 차등 렌더링, grayscale 효과 |
| `footer.tsx` | Client | 이벤트명/날짜, 문의 이메일, SNS 아이콘, Powered by Linkmap, 다크모드 토글 |
| `nav-header.tsx` | Client | 고정 상단 바 (이벤트명 + 섹션 링크 + 신청 CTA + 다크모드 토글), 스크롤 시 배경 blur |
| `use-countdown.ts` | Hook | 목표 날짜까지 남은 일/시/분/초 계산 (setInterval 1s), 종료 상태 반환 |
| `config.ts` | Util | `process.env.NEXT_PUBLIC_*` → 타입 안전 객체, JSON 파싱, 데모 데이터 폴백, ISO 8601 날짜 파싱 |

---

## 7. 시드 데이터

### 7.1 SQL INSERT (homepage_templates)

```sql
INSERT INTO homepage_templates (
  id, slug, name, name_ko, description, description_ko,
  preview_image_url, github_owner, github_repo, default_branch,
  framework, required_env_vars, tags, is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0014-4000-9000-000000000014',
  'event-page',
  'Event Page',
  '이벤트 페이지',
  'Event and conference landing page with real-time countdown timer, speaker profiles, interactive timetable, venue map, registration CTA, and tiered sponsor logos. Perfect for meetups, conferences, and workshops.',
  '이벤트/컨퍼런스 랜딩 페이지. 실시간 카운트다운 타이머, 스피커 프로필, 인터랙티브 타임테이블, 장소 지도, 신청 CTA, 등급별 스폰서 로고. 밋업, 컨퍼런스, 워크숍에 최적화.',
  NULL,
  'linkmap-templates',
  'event-page',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "이벤트 이름", "required": true},
    {"key": "NEXT_PUBLIC_EVENT_DATE", "description": "이벤트 날짜/시간 (ISO 8601)", "required": false},
    {"key": "NEXT_PUBLIC_EVENT_LOCATION", "description": "장소 이름 + 주소", "required": false},
    {"key": "NEXT_PUBLIC_DESCRIPTION", "description": "이벤트 설명 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_SPEAKERS", "description": "스피커 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_TIMETABLE", "description": "일정표 JSON", "required": false},
    {"key": "NEXT_PUBLIC_MAP_URL", "description": "지도 임베드 URL", "required": false},
    {"key": "NEXT_PUBLIC_REGISTER_URL", "description": "신청 링크", "required": false},
    {"key": "NEXT_PUBLIC_TICKET_PRICE", "description": "참가비 정보", "required": false},
    {"key": "NEXT_PUBLIC_SPONSORS", "description": "스폰서 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "문의 이메일", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['event', 'conference', 'meetup', 'countdown', 'timetable', 'speakers', 'nextjs'],
  false,
  true,
  14
) ON CONFLICT (slug) DO NOTHING;
```

### 7.2 TypeScript 시드 (`homepage-templates.ts` 추가분)

```typescript
{
  id: 'b2c3d4e5-0014-4000-9000-000000000014',
  slug: 'event-page',
  name: 'Event Page',
  name_ko: '이벤트 페이지',
  description: 'Event and conference landing page with real-time countdown timer, speaker profiles, interactive timetable, venue map, registration CTA, and tiered sponsor logos. Perfect for meetups, conferences, and workshops.',
  description_ko: '이벤트/컨퍼런스 랜딩 페이지. 실시간 카운트다운 타이머, 스피커 프로필, 인터랙티브 타임테이블, 장소 지도, 신청 CTA, 등급별 스폰서 로고. 밋업, 컨퍼런스, 워크숍에 최적화.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'event-page',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '이벤트 이름', required: true },
    { key: 'NEXT_PUBLIC_EVENT_DATE', description: '이벤트 날짜/시간 (ISO 8601)', required: false },
    { key: 'NEXT_PUBLIC_EVENT_LOCATION', description: '장소 이름 + 주소', required: false },
    { key: 'NEXT_PUBLIC_DESCRIPTION', description: '이벤트 설명 텍스트', required: false },
    { key: 'NEXT_PUBLIC_SPEAKERS', description: '스피커 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_TIMETABLE', description: '일정표 JSON', required: false },
    { key: 'NEXT_PUBLIC_MAP_URL', description: '지도 임베드 URL', required: false },
    { key: 'NEXT_PUBLIC_REGISTER_URL', description: '신청 링크', required: false },
    { key: 'NEXT_PUBLIC_TICKET_PRICE', description: '참가비 정보', required: false },
    { key: 'NEXT_PUBLIC_SPONSORS', description: '스폰서 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_EMAIL', description: '문의 이메일', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['event', 'conference', 'meetup', 'countdown', 'timetable', 'speakers', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 14,
}
```

---

## 8. 검증 체크리스트

### 기능
- [ ] 이벤트명, 날짜, 장소 정상 표시
- [ ] 카운트다운 타이머 실시간 동작 (매초 업데이트)
- [ ] 카운트다운 이벤트 종료 시 상태 메시지 표시
- [ ] 카운트다운 날짜 미설정 시 타이머 숨김
- [ ] CTA "지금 신청하기" 클릭 → 신청 URL 이동
- [ ] 소개 텍스트 + 키워드 태그 정상 표시
- [ ] 스피커 카드 그리드 렌더링 (사진/이름/소속/주제)
- [ ] 타임테이블 데스크톱 테이블 형식 정상 표시
- [ ] 타임테이블 모바일 카드 형식 전환
- [ ] 타임테이블 브레이크/점심 행 스타일 분기
- [ ] 장소 지도 임베드 정상 표시 (iframe lazy loading)
- [ ] 지도 URL 미설정 시 주소만 표시
- [ ] 신청 섹션 참가비 + CTA 정상 표시
- [ ] 스폰서 로고 등급별 크기 차등 표시
- [ ] 스폰서 로고 grayscale → hover 시 컬러
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
- [ ] 지도 iframe lazy loading 적용
- [ ] 카운트다운 setInterval 메모리 누수 방지 (cleanup)

### 접근성
- [ ] 키보드 내비게이션 (Tab 순서, CTA 버튼 포커스)
- [ ] 스크린리더 호환 (aria-label, 카운트다운 aria-live="polite")
- [ ] 컬러 대비 WCAG 2.1 AA 준수
- [ ] 카운트다운에 시간 정보 접근성 (aria-label="이벤트까지 X일 X시간 X분 X초")
- [ ] 타임테이블 테이블에 적절한 th/scope 속성
- [ ] 지도 iframe에 title 속성 부여
- [ ] 스피커 사진에 alt 텍스트 (이름)

### SEO
- [ ] OG 메타태그 정상 생성 (이벤트명, 날짜, 장소 포함)
- [ ] JSON-LD Event 구조화 데이터 (startDate, location, organizer, offers)
- [ ] /api/og 이미지 생성 확인
- [ ] robots.txt 존재
- [ ] sitemap.xml 생성
