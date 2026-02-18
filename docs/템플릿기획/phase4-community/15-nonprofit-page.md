# 비영리 소개 페이지 (Nonprofit Page) 기획서

## 1. 개요

| 항목 | 내용 |
|------|------|
| 슬러그 | `nonprofit-page` |
| UUID | `b2c3d4e5-0017-4000-9000-000000000017` |
| 카테고리 | 커뮤니티 & 비영리 |
| 타겟 페르소나 | NGO 활동가, 비영리 단체 (페르소나: 비영리/사회단체 "미래" 35세, NGO 활동가) |
| 우선순위 | 15위 (총점 66/100) |
| Phase | Phase 4: Community |
| 구현 일정 | 3일 |
| 비고 | 미션 스토리, 활동 사진, 후원 링크, 뉴스레터 구독을 통합하는 비영리 단체 소개 페이지 |

### 핵심 가치
- **소속감**: 가치 소비를 원하는 후원자와 단체를 연결, 커뮤니티 형성
- **진정성**: 투명한 활동 공유와 성과 통계로 신뢰 구축
- **참여 유도**: 후원, 뉴스레터 구독 등 다양한 참여 채널 제공

---

## 2. AI 구현 프롬프트

> 이 섹션을 통째로 AI(Claude Code, Cursor 등)에 전달하면 템플릿을 구현할 수 있다.

```
## 컨텍스트
Linkmap(https://www.linkmap.biz)의 원클릭 배포용 홈페이지 템플릿을 구현한다.
사용자가 GitHub 연결 → 템플릿 선택 → 환경변수 입력 → GitHub Pages 배포 3단계로 비영리 단체 소개 페이지를 생성한다.

## 템플릿: 비영리 소개 페이지 (nonprofit-page)
- 타겟: NGO 활동가, 비영리 단체
- 카테고리: 커뮤니티 & 비영리
- 핵심 목적: 미션 스토리, 활동 사진, 후원 링크, 뉴스레터 구독. 투명성 + 신뢰
- 심리적 동기: 소속감 + 진정성 (가치 소비, 투명한 활동 공유)

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 폰트: Pretendard(한글) + Inter(영문) via next/font
- 아이콘: Lucide React
- 다크모드: next-themes
- SEO: next/metadata + JSON-LD
- OG 이미지: @vercel/og (/api/og)
- 배포: GitHub Pages (static export)

## 핵심 섹션
1. 히어로: 단체명 + 미션 한 문장 + 감성적 배경 이미지 + "후원하기" CTA 버튼 (풀 뷰포트)
2. Mission: 단체 미션/비전 상세 설명 (스토리텔링 형식, 큰 텍스트)
3. Impact: 활동 성과 통계 (수치 카운터 애니메이션 - 수혜자 수, 프로젝트 수, 기부금액 등)
4. Activities: 주요 활동/프로젝트 카드 (이미지 + 제목 + 설명 + 날짜)
5. 갤러리: 활동 사진 그리드 (감성적 이미지, 마우스 오버 효과)
6. Team: 팀 소개 카드 (이름 + 역할 + 사진)
7. 후원: 후원 방법 안내 + 후원 링크/계좌 + 후원 CTA 버튼 (큰, 눈에 띄는 색)
8. 뉴스레터: 이메일 구독 폼 (최신 소식 받기)
9. 푸터: SNS + 연락처 + Powered by Linkmap

## 디자인 스펙
- 감성적 이미지 중심 디자인
- 따뜻한 amber/rose 계열 컬러
- 투명성 강조 (성과 통계 섹션 강조 배경)
- 큰 이미지 + 스토리텔링 텍스트
- 후원 CTA 강조: 버튼 크고, rose-500 눈에 띄는 색, 여러 위치에 반복 배치
- 다크/라이트 모드 자동 전환
- 컬러:
  - Primary: amber-700 (#b45309) / Dark: amber-400 (#fbbf24)
  - Background: white (#ffffff) / Dark: slate-950 (#020617)
  - Accent (CTA): rose-500 (#f43f5e) / Dark: rose-400 (#fb7185)
  - Text: slate-800 (#1e293b) / Dark: slate-100 (#f1f5f9)
- 폰트 크기: 단체명 4xl~5xl bold, 미션 텍스트 xl~2xl, 본문 base
- 레이아웃: max-w-6xl, 히어로 풀 뷰포트, 큰 이미지 + 텍스트 오버레이

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 단체명
- NEXT_PUBLIC_MISSION: 미션/비전 설명 텍스트
- NEXT_PUBLIC_HERO_IMAGE_URL: 히어로 배경 이미지 URL
- NEXT_PUBLIC_IMPACT_STATS: 성과 통계 JSON ([{"label":"수혜 아동","value":"1,200","icon":"heart"},{"label":"진행 프로젝트","value":"45","icon":"folder"},{"label":"누적 기부금","value":"2.3억","icon":"banknote"}])
- NEXT_PUBLIC_ACTIVITIES: 활동 목록 JSON ([{"title":"2025 겨울 캠프","description":"...","image_url":"...","date":"2025-12-20"}])
- NEXT_PUBLIC_GALLERY_IMAGES: 갤러리 이미지 JSON (["https://...jpg"])
- NEXT_PUBLIC_TEAM: 팀 멤버 JSON ([{"name":"김미래","role":"대표","avatar_url":"..."}])
- NEXT_PUBLIC_DONATE_URL: 후원 링크 URL
- NEXT_PUBLIC_DONATE_DESCRIPTION: 후원 방법 안내 텍스트
- NEXT_PUBLIC_BANK_ACCOUNT: 후원 계좌 정보
- NEXT_PUBLIC_NEWSLETTER_ACTION: 뉴스레터 폼 액션 URL (Mailchimp, Stibee 등)
- NEXT_PUBLIC_EMAIL: 연락 이메일
- NEXT_PUBLIC_SOCIALS: SNS 링크 JSON ([{"platform":"instagram","url":"..."},{"platform":"facebook","url":"..."}])
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. `linkmap-templates/nonprofit-page` GitHub 레포에 Next.js 프로젝트 생성
2. 모든 개인화 데이터는 NEXT_PUBLIC_* 환경변수로 주입
3. 환경변수 미설정 시 매력적인 데모 데이터 표시 (가상의 아동 교육 NGO)
4. Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
5. 한국어 기본, lang="ko"
6. 반응형: 360px ~ 1440px
7. 다크모드 토글 포함
8. /api/og 엔드포인트로 동적 OG 이미지 생성
9. JSON-LD 구조화 데이터 (NGO / NonprofitOrganization 타입)
10. 접근성: WCAG 2.1 AA, 키보드 내비게이션
11. Impact 통계 섹션에 카운트업 애니메이션 (Intersection Observer로 뷰포트 진입 시 트리거)
12. 후원 CTA 버튼을 히어로 + 후원 섹션에 최소 2회 배치
13. 뉴스레터 폼은 외부 서비스(Stibee, Mailchimp) form action 방식
14. 갤러리 이미지에 라이트박스 모달 (클릭 시 확대)
15. 히어로 배경 이미지 위에 어두운 오버레이 + 텍스트 가독성 보장
```

---

## 3. 핵심 섹션 정의

### 섹션 1: 히어로
- **위치**: 페이지 최상단, 풀 뷰포트 높이 (min-h-screen 또는 h-[80vh])
- **구성**: 배경 이미지(object-cover, 풀 화면) + 어두운 오버레이(bg-black/50) + 단체명(4xl~5xl bold text-white) + 미션 한 문장(xl text-white/90) + "후원하기" CTA 버튼(rose-500, rounded-full, px-8 py-4, text-lg font-semibold)
- **배경**: `NEXT_PUBLIC_HERO_IMAGE_URL` 또는 따뜻한 amber 그라데이션 기본값
- **인터랙션**: CTA 클릭 시 후원 섹션으로 스크롤, 스크롤 다운 화살표 애니메이션(animate-bounce)
- **데이터**: `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_MISSION`(첫 문장), `NEXT_PUBLIC_HERO_IMAGE_URL`

### 섹션 2: Mission
- **위치**: 히어로 아래, py-20, 텍스트 중심 섹션
- **구성**: 섹션 제목 "우리의 미션"(2xl semibold) + 미션 본문(xl leading-relaxed, max-w-3xl mx-auto text-center)
- **스타일**: 큰 텍스트 + 충분한 여백으로 스토리텔링 효과, 인용 부호 장식(") 옵션
- **인터랙션**: 정적 콘텐츠, 스크롤 진입 시 fade-in-up 애니메이션
- **데이터**: `NEXT_PUBLIC_MISSION`

### 섹션 3: Impact
- **위치**: Mission 아래, py-20, bg-amber-50/dark:bg-amber-950/20 강조 배경
- **구성**: 섹션 제목 "우리의 영향"(2xl semibold) + 통계 카드 그리드(grid-cols-2 sm:grid-cols-3, gap-8)
- **통계 카드**: Lucide 아이콘(48px, amber-600) + 수치(3xl~4xl font-bold, 카운트업 애니메이션) + 라벨(sm text-muted-foreground)
- **인터랙션**: Intersection Observer로 뷰포트 진입 시 0부터 목표값까지 카운트업 애니메이션 (duration 2s, easeOut)
- **데이터**: `NEXT_PUBLIC_IMPACT_STATS` JSON 파싱, 미설정 시 데모 통계 3개

### 섹션 4: Activities
- **위치**: Impact 아래, py-16
- **구성**: 섹션 제목 "주요 활동"(2xl semibold) + 활동 카드 그리드(sm:grid-cols-2, lg:grid-cols-3, gap-6)
- **카드 구조**: 이미지(aspect-video, object-cover, rounded-t-lg) + 날짜 배지(absolute top-3 left-3, bg-white/90 rounded-full px-3 py-1 text-xs) + 제목(lg font-semibold) + 설명(sm text-muted-foreground, 3줄 line-clamp)
- **인터랙션**: 카드 hover 시 shadow-sm → shadow-lg 전환, 이미지 scale(1.05) transition 300ms
- **데이터**: `NEXT_PUBLIC_ACTIVITIES` JSON 파싱, 최신순 정렬, 미설정 시 데모 활동 3개

### 섹션 5: 갤러리
- **위치**: Activities 아래, py-16, bg-slate-50/dark:bg-slate-900
- **구성**: 섹션 제목 "활동 갤러리"(2xl semibold) + 이미지 그리드(grid-cols-2 sm:grid-cols-3 gap-3)
- **이미지**: aspect-square, object-cover, rounded-lg, hover 시 brightness 조절
- **인터랙션**: 이미지 클릭 시 라이트박스 모달(배경 블러 + 원본 이미지 + 좌우 네비게이션 + ESC 닫기)
- **데이터**: `NEXT_PUBLIC_GALLERY_IMAGES` JSON 파싱, 미설정 시 placeholder 이미지 6개

### 섹션 6: Team
- **위치**: 갤러리 아래, py-16
- **구성**: 섹션 제목 "함께하는 사람들"(2xl semibold) + 팀 멤버 카드 그리드(sm:grid-cols-2, lg:grid-cols-3, gap-6)
- **카드 구조**: 원형 아바타(80px, border-2 border-amber-200) + 이름(font-semibold) + 역할(text-sm text-amber-700 dark:text-amber-400)
- **인터랙션**: 카드 hover 시 translateY(-2px) + shadow, 아바타 미설정 시 이니셜 표시
- **데이터**: `NEXT_PUBLIC_TEAM` JSON 파싱, 미설정 시 데모 팀원 4명

### 섹션 7: 후원
- **위치**: Team 아래, py-20, bg-rose-50/dark:bg-rose-950/20 강조 배경
- **구성**: 섹션 제목 "후원하기"(2xl semibold) + 후원 방법 안내 텍스트(base) + 계좌 정보(font-mono bg-white/50 rounded p-3) + "후원하기" CTA 버튼(rose-500, 큰 사이즈 px-10 py-4 text-lg, 풀 라운드)
- **인터랙션**: CTA 버튼 클릭 시 `NEXT_PUBLIC_DONATE_URL`로 새 탭 이동, 버튼 hover 시 rose-600 + scale(1.02)
- **데이터**: `NEXT_PUBLIC_DONATE_URL`, `NEXT_PUBLIC_DONATE_DESCRIPTION`, `NEXT_PUBLIC_BANK_ACCOUNT`

### 섹션 8: 뉴스레터
- **위치**: 후원 아래, py-16
- **구성**: 섹션 제목 "소식 받기"(2xl semibold) + 설명 텍스트(sm text-muted-foreground) + 이메일 입력 폼(input + submit 버튼, 인라인 레이아웃)
- **폼 구조**: `<form action={NEXT_PUBLIC_NEWSLETTER_ACTION} method="POST">` + 이메일 input(rounded-l-full px-4 py-3) + 구독 버튼(amber-600 rounded-r-full px-6 py-3)
- **인터랙션**: 폼 submit 시 외부 뉴스레터 서비스로 POST, 버튼 hover 시 amber-700
- **데이터**: `NEXT_PUBLIC_NEWSLETTER_ACTION`, 미설정 시 폼 숨김 또는 "준비 중" 표시

### 섹션 9: 푸터
- **위치**: 페이지 최하단, py-8, border-t
- **구성**: SNS 아이콘 링크(Instagram, Facebook, YouTube 등) + 연락 이메일 + "Powered by Linkmap" 텍스트(text-xs text-muted-foreground)
- **인터랙션**: SNS 아이콘 hover 시 amber-500 색상 전환
- **데이터**: `NEXT_PUBLIC_SOCIALS`, `NEXT_PUBLIC_EMAIL`

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:----:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 단체명 | O | `'희망의 다리'` |
| `NEXT_PUBLIC_MISSION` | 미션/비전 설명 텍스트 | | `'모든 아이에게 배움의 기회를. 교육을 통해 세상을 변화시키는 비영리 단체입니다.'` |
| `NEXT_PUBLIC_HERO_IMAGE_URL` | 히어로 배경 이미지 URL | | `null` (amber 그라데이션 기본) |
| `NEXT_PUBLIC_IMPACT_STATS` | 성과 통계 (JSON 배열) | | 데모 통계 3개 |
| `NEXT_PUBLIC_ACTIVITIES` | 활동 목록 (JSON 배열) | | 데모 활동 3개 |
| `NEXT_PUBLIC_GALLERY_IMAGES` | 갤러리 이미지 URL (JSON 배열) | | placeholder 6개 |
| `NEXT_PUBLIC_TEAM` | 팀 멤버 (JSON 배열) | | 데모 팀원 4명 |
| `NEXT_PUBLIC_DONATE_URL` | 후원 링크 URL | | `null` (버튼 비활성) |
| `NEXT_PUBLIC_DONATE_DESCRIPTION` | 후원 방법 안내 텍스트 | | `'소중한 후원이 아이들의 내일을 바꿉니다.'` |
| `NEXT_PUBLIC_BANK_ACCOUNT` | 후원 계좌 정보 | | `null` (미표시) |
| `NEXT_PUBLIC_NEWSLETTER_ACTION` | 뉴스레터 폼 액션 URL | | `null` (폼 미표시) |
| `NEXT_PUBLIC_EMAIL` | 연락 이메일 | | `null` (미표시) |
| `NEXT_PUBLIC_SOCIALS` | SNS 링크 (JSON 배열) | | `[]` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | `null` (미추적) |

---

## 5. 디자인 스펙

### 컬러

| 용도 | Light Mode | Dark Mode |
|------|-----------|-----------|
| Primary | amber-700 `#b45309` | amber-400 `#fbbf24` |
| Background | white `#ffffff` | slate-950 `#020617` |
| Surface | slate-50 `#f8fafc` | slate-900 `#0f172a` |
| CTA (후원) | rose-500 `#f43f5e` | rose-400 `#fb7185` |
| CTA Hover | rose-600 `#e11d48` | rose-300 `#fda4af` |
| Newsletter CTA | amber-600 `#d97706` | amber-500 `#f59e0b` |
| Text Primary | slate-800 `#1e293b` | slate-100 `#f1f5f9` |
| Text Secondary | slate-500 `#64748b` | slate-400 `#94a3b8` |
| Border | slate-200 `#e2e8f0` | slate-800 `#1e293b` |
| Impact BG | amber-50 `#fffbeb` | amber-950/20 |
| Donate BG | rose-50 `#fff1f2` | rose-950/20 |
| Card Background | white `#ffffff` | slate-800 `#1e293b` |
| Hero Overlay | black/50 | black/60 |
| Team Avatar Border | amber-200 `#fde68a` | amber-700 `#b45309` |
| Stats Icon | amber-600 `#d97706` | amber-400 `#fbbf24` |

### 타이포그래피
- 단체명: `text-4xl sm:text-5xl font-bold text-white tracking-tight` (Pretendard)
- 미션 한줄 (히어로): `text-xl sm:text-2xl text-white/90` (Pretendard)
- 미션 본문: `text-xl sm:text-2xl leading-relaxed` (Pretendard)
- 섹션 제목: `text-2xl sm:text-3xl font-semibold` (Pretendard)
- 통계 수치: `text-3xl sm:text-4xl font-bold tabular-nums` (Inter)
- 통계 라벨: `text-sm text-muted-foreground` (Pretendard)
- 활동 제목: `text-lg font-semibold` (Pretendard)
- 본문 텍스트: `text-base leading-relaxed` (Pretendard)
- 팀원 이름: `text-base font-semibold` (Pretendard)
- 팀원 역할: `text-sm text-amber-700 dark:text-amber-400` (Pretendard)
- 계좌 정보: `font-mono text-sm` (monospace)
- 푸터: `text-xs text-muted-foreground` (Pretendard)

### 레이아웃
- 전체 컨테이너: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`
- 히어로: `relative min-h-[80vh] flex items-center justify-center text-center` (풀폭 배경 이미지)
- 섹션 패딩: `py-16 sm:py-20`, 강조 섹션 `py-20 sm:py-24`
- Impact 그리드: `grid grid-cols-2 sm:grid-cols-3 gap-8 text-center`
- Activities 그리드: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- 갤러리 그리드: `grid grid-cols-2 sm:grid-cols-3 gap-3`
- Team 그리드: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-center`
- 뉴스레터 폼: `flex max-w-md mx-auto` (인라인 input + 버튼)
- 후원 섹션: `text-center max-w-2xl mx-auto`

### 반응형 브레이크포인트
- **360px** (모바일): 단일/2열, 패딩 px-4, 히어로 텍스트 text-3xl, 통계 2열, 갤러리 2열
- **640px** (sm): 통계 3열, 활동 카드 2열, 갤러리 3열, 히어로 텍스트 text-4xl
- **768px** (md): 네비게이션 인라인 표시, 뉴스레터 폼 인라인 레이아웃
- **1024px** (lg): 활동 카드 3열, 팀원 4열, 섹션 패딩 증가
- **1280px** (xl): max-w-6xl 고정
- **1440px+**: 센터 정렬 유지, 좌우 여백 증가

---

## 6. 컴포넌트 구조

```
linkmap-templates/nonprofit-page/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx                # 메타데이터, 폰트(Pretendard+Inter), ThemeProvider
│   │   ├── page.tsx                  # 메인 페이지 (섹션 조합)
│   │   └── api/og/route.tsx          # OG 이미지 동적 생성
│   ├── components/
│   │   ├── nav-header.tsx            # 네비게이션 헤더 (섹션 앵커 링크 + 다크모드 토글)
│   │   ├── hero-section.tsx          # 히어로 (배경 이미지 + 오버레이 + CTA)
│   │   ├── mission-section.tsx       # 미션/비전 스토리텔링 텍스트
│   │   ├── impact-stats.tsx          # 성과 통계 (카운트업 애니메이션)
│   │   ├── activities-section.tsx    # 활동/프로젝트 카드 그리드
│   │   ├── photo-gallery.tsx         # 활동 사진 그리드 + 라이트박스 모달
│   │   ├── team-section.tsx          # 팀 소개 카드 그리드
│   │   ├── donate-section.tsx        # 후원 안내 + CTA 버튼 + 계좌 정보
│   │   ├── newsletter-form.tsx       # 이메일 구독 폼
│   │   └── footer.tsx                # SNS 링크 + 연락처 + Powered by Linkmap
│   ├── hooks/
│   │   └── use-count-up.ts           # 카운트업 애니메이션 커스텀 훅 (Intersection Observer)
│   └── lib/
│       └── config.ts                 # 환경변수 파싱 + 타입 안전 config + 데모 데이터
├── tailwind.config.ts
├── next.config.ts                    # static export 설정
├── package.json
├── tsconfig.json
└── README.md
```

### 컴포넌트 역할

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `layout.tsx` | Server | 메타데이터, 폰트 로드, ThemeProvider 래핑, JSON-LD 삽입 |
| `page.tsx` | Server | config 읽기, 섹션 컴포넌트 순서 배치 |
| `nav-header.tsx` | Client | 스티키 헤더, 섹션 앵커 링크, 모바일 햄버거 메뉴, 다크모드 토글 |
| `hero-section.tsx` | Client | 배경 이미지 + 어두운 오버레이 + 단체명 + 미션 + 후원 CTA, 스크롤 화살표 |
| `mission-section.tsx` | Server | 미션/비전 스토리텔링 텍스트, 인용부호 장식 |
| `impact-stats.tsx` | Client | 성과 통계 카드, 카운트업 애니메이션 (useCountUp 훅 사용) |
| `activities-section.tsx` | Client | 활동 카드 그리드, 이미지 hover 줌, 날짜 배지 |
| `photo-gallery.tsx` | Client | 이미지 그리드, 클릭 시 라이트박스 모달 (useState) |
| `team-section.tsx` | Server | 팀 멤버 카드, 아바타 fallback, 역할 텍스트 |
| `donate-section.tsx` | Client | 후원 안내, 계좌 복사 버튼, CTA 외부 링크 |
| `newsletter-form.tsx` | Client | 이메일 input + submit, 외부 폼 액션 |
| `footer.tsx` | Server | SNS 아이콘 링크, 이메일, 저작권 텍스트 |
| `use-count-up.ts` | Hook | Intersection Observer + requestAnimationFrame 기반 카운트업 |
| `config.ts` | Util | `process.env.NEXT_PUBLIC_*` 파싱 → 타입 안전 config 객체, 데모 데이터 정의 |

---

## 7. 시드 데이터

### 7.1 SQL INSERT (homepage_templates)

```sql
INSERT INTO homepage_templates (
  id, slug, name, name_ko, description, description_ko,
  preview_image_url, github_owner, github_repo, default_branch,
  framework, required_env_vars, tags, is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0017-4000-9000-000000000017',
  'nonprofit-page',
  'Nonprofit Page',
  '비영리 소개 페이지',
  'Emotive nonprofit landing page with mission storytelling, impact statistics with count-up animation, activity gallery, donation CTA, and newsletter subscription.',
  '비영리 단체를 위한 감성적 소개 페이지. 미션 스토리텔링, 성과 통계 카운트업, 활동 갤러리, 후원 CTA, 뉴스레터 구독 기능.',
  NULL,
  'linkmap-templates',
  'nonprofit-page',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "단체명", "required": true},
    {"key": "NEXT_PUBLIC_MISSION", "description": "미션/비전 설명 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_HERO_IMAGE_URL", "description": "히어로 배경 이미지 URL", "required": false},
    {"key": "NEXT_PUBLIC_IMPACT_STATS", "description": "성과 통계 JSON", "required": false},
    {"key": "NEXT_PUBLIC_ACTIVITIES", "description": "활동 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GALLERY_IMAGES", "description": "갤러리 이미지 URL JSON", "required": false},
    {"key": "NEXT_PUBLIC_TEAM", "description": "팀 멤버 JSON", "required": false},
    {"key": "NEXT_PUBLIC_DONATE_URL", "description": "후원 링크 URL", "required": false},
    {"key": "NEXT_PUBLIC_DONATE_DESCRIPTION", "description": "후원 방법 안내 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_BANK_ACCOUNT", "description": "후원 계좌 정보", "required": false},
    {"key": "NEXT_PUBLIC_NEWSLETTER_ACTION", "description": "뉴스레터 폼 액션 URL", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "연락 이메일", "required": false},
    {"key": "NEXT_PUBLIC_SOCIALS", "description": "SNS 링크 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['nonprofit', 'ngo', 'charity', 'donation', 'mission', 'social-impact', 'nextjs'],
  false,
  true,
  17
) ON CONFLICT (slug) DO NOTHING;
```

### 7.2 TypeScript 시드 (`homepage-templates.ts` 추가분)

```typescript
{
  id: 'b2c3d4e5-0017-4000-9000-000000000017',
  slug: 'nonprofit-page',
  name: 'Nonprofit Page',
  name_ko: '비영리 소개 페이지',
  description:
    'Emotive nonprofit landing page with mission storytelling, impact statistics with count-up animation, activity gallery, donation CTA, and newsletter subscription.',
  description_ko:
    '비영리 단체를 위한 감성적 소개 페이지. 미션 스토리텔링, 성과 통계 카운트업, 활동 갤러리, 후원 CTA, 뉴스레터 구독 기능.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'nonprofit-page',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '단체명', required: true },
    { key: 'NEXT_PUBLIC_MISSION', description: '미션/비전 설명 텍스트', required: false },
    { key: 'NEXT_PUBLIC_HERO_IMAGE_URL', description: '히어로 배경 이미지 URL', required: false },
    { key: 'NEXT_PUBLIC_IMPACT_STATS', description: '성과 통계 JSON', required: false },
    { key: 'NEXT_PUBLIC_ACTIVITIES', description: '활동 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_GALLERY_IMAGES', description: '갤러리 이미지 URL JSON', required: false },
    { key: 'NEXT_PUBLIC_TEAM', description: '팀 멤버 JSON', required: false },
    { key: 'NEXT_PUBLIC_DONATE_URL', description: '후원 링크 URL', required: false },
    { key: 'NEXT_PUBLIC_DONATE_DESCRIPTION', description: '후원 방법 안내 텍스트', required: false },
    { key: 'NEXT_PUBLIC_BANK_ACCOUNT', description: '후원 계좌 정보', required: false },
    { key: 'NEXT_PUBLIC_NEWSLETTER_ACTION', description: '뉴스레터 폼 액션 URL', required: false },
    { key: 'NEXT_PUBLIC_EMAIL', description: '연락 이메일', required: false },
    { key: 'NEXT_PUBLIC_SOCIALS', description: 'SNS 링크 JSON', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['nonprofit', 'ngo', 'charity', 'donation', 'mission', 'social-impact', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 17,
}
```

---

## 8. 검증 체크리스트

### 기능
- [ ] 히어로 배경 이미지 + 오버레이 + 텍스트 정상 표시
- [ ] 히어로 "후원하기" CTA 클릭 시 후원 섹션으로 스크롤
- [ ] 미션 섹션 스토리텔링 텍스트 정상 렌더링
- [ ] Impact 통계 카운트업 애니메이션 뷰포트 진입 시 트리거
- [ ] Impact 통계 카운트업 재진입 시 재실행 안 됨 (1회만)
- [ ] 활동 카드 이미지, 제목, 날짜 정상 표시
- [ ] 갤러리 이미지 클릭 시 라이트박스 모달 동작
- [ ] 라이트박스 좌우 네비게이션 + ESC 키 닫기
- [ ] 팀 멤버 카드 아바타, 이름, 역할 표시
- [ ] 팀 멤버 아바타 미설정 시 이니셜 fallback
- [ ] 후원 섹션 CTA 버튼 클릭 시 외부 URL 새 탭 열기
- [ ] 후원 계좌 정보 표시 + 복사 버튼 동작
- [ ] 뉴스레터 폼 이메일 입력 + 외부 서비스 제출
- [ ] 뉴스레터 폼 액션 URL 미설정 시 폼 미표시
- [ ] SNS 아이콘 링크 새 탭에서 열림
- [ ] 환경변수 미설정 시 매력적인 데모 데이터 표시
- [ ] 다크모드 토글 동작
- [ ] 네비게이션 헤더 섹션 앵커 링크 스크롤 동작
- [ ] 모바일 햄버거 메뉴 토글 동작

### 성능
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 90+
- [ ] Lighthouse Best Practices 90+
- [ ] Lighthouse SEO 90+
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] 히어로 배경 이미지 최적화 (next/image 또는 적절한 크기)
- [ ] 갤러리 이미지 lazy loading 적용 (`loading="lazy"`)
- [ ] 카운트업 애니메이션 requestAnimationFrame 사용 (메인 스레드 부하 최소)

### 접근성
- [ ] 키보드 내비게이션 (Tab 순서, Enter 활성화)
- [ ] 스크린리더 호환 (aria-label, role 적절 사용)
- [ ] 컬러 대비 WCAG 2.1 AA (4.5:1 이상)
- [ ] 히어로 텍스트와 배경 이미지 간 충분한 대비 (오버레이)
- [ ] 갤러리 이미지 alt 텍스트 제공
- [ ] 외부 링크에 `aria-label="새 탭에서 열기"` 표시
- [ ] 모달 열림 시 포커스 트랩, 닫힘 시 포커스 복원
- [ ] 폼 입력 필드 label 연결 (뉴스레터)
- [ ] skip-to-content 링크 제공
- [ ] prefers-reduced-motion 시 카운트업 애니메이션 비활성화

### SEO
- [ ] OG 메타태그 정상 생성 (title, description, image)
- [ ] JSON-LD NonprofitOrganization 구조화 데이터
- [ ] /api/og 이미지 생성 확인
- [ ] robots.txt 존재
- [ ] sitemap.xml 생성
- [ ] canonical URL 설정
- [ ] 페이지 title에 단체명 포함
- [ ] 후원 관련 메타 정보 포함 (description에 미션 키워드)
