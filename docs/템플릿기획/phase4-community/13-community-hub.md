# 커뮤니티 허브 (Community Hub) 기획서

## 1. 개요

| 항목 | 내용 |
|------|------|
| 슬러그 | `community-hub` |
| UUID | `b2c3d4e5-0015-4000-9000-000000000015` |
| 카테고리 | 커뮤니티 & 비영리 |
| 타겟 페르소나 | 개발 스터디, 동호회, 동아리 운영자 (페르소나: 스터디 운영자 "재원" 28세, 개발 스터디 그룹장) |
| 우선순위 | 13위 (총점 74/100) |
| Phase | Phase 4: Community |
| 구현 일정 | 3일 |
| 비고 | 멤버 소개, 일정, 자료 링크, 가입 안내를 한곳에 통합하는 커뮤니티 포탈 |

### 핵심 가치
- **소속감**: 멤버 프로필과 활동 기록으로 커뮤니티 정체성 강화
- **효율성**: 노션/카톡/구글폼에 분산된 정보를 단일 페이지로 통합
- **참여 유도**: 일정 확인, 자료 접근, 가입 신청을 원스톱으로 제공

---

## 2. AI 구현 프롬프트

> 이 섹션을 통째로 AI(Claude Code, Cursor 등)에 전달하면 템플릿을 구현할 수 있다.

```
## 컨텍스트
Linkmap(https://www.linkmap.biz)의 원클릭 배포용 홈페이지 템플릿을 구현한다.
사용자가 GitHub 연결 → 템플릿 선택 → 환경변수 입력 → GitHub Pages 배포 3단계로 커뮤니티/스터디 그룹 소개 페이지를 생성한다.

## 템플릿: 커뮤니티 허브 (community-hub)
- 타겟: 개발 스터디, 동호회, 동아리 운영자
- 카테고리: 커뮤니티 & 비영리
- 핵심 목적: 멤버 소개, 일정, 자료 링크, 가입 안내를 한곳에. 노션/카톡/구글폼 분산 해결
- 심리적 동기: 소속감 + 효율성 (정보 분산 해소)

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 폰트: Pretendard(한글) + Inter(영문) via next/font
- 아이콘: Lucide React
- 다크모드: next-themes
- SEO: next/metadata + JSON-LD
- OG 이미지: @vercel/og (/api/og)
- 배포: GitHub Pages (static export)

## 핵심 섹션
1. 히어로: 커뮤니티명 + 한줄 소개 + "가입하기" CTA 버튼 + 멤버 수 배지
2. About: 커뮤니티 소개, 활동 목적, 규칙 요약
3. 멤버 소개: 멤버 카드 그리드 (아바타 + 이름 + 역할 + 한줄 소개), hover 시 확대 효과
4. 일정/캘린더: 다가오는 일정 목록 (날짜 + 제목 + 장소 + 설명), 타임라인 UI
5. 자료실: 카테고리별 링크 목록 (노션, 구글 드라이브, GitHub 등 외부 링크), 아이콘 구분
6. 갤러리: 활동 사진 그리드, 라이트박스 모달 뷰
7. 가입 안내: 가입 방법 안내 텍스트 + 외부 폼 링크 (Google Form, 오픈카톡 등) CTA 버튼
8. 푸터: SNS (디스코드, 카카오톡 오픈채팅) + Powered by Linkmap

## 디자인 스펙
- 따뜻하고 친근한 teal/emerald 계열 컬러
- 참여 유도 CTA 강조 (emerald-500 → emerald-600 호버)
- 멤버 카드 hover 시 translateY(-4px) + shadow-lg 효과
- 활동 사진 갤러리: masonry 스타일 또는 균일 그리드
- 다크/라이트 모드 자동 전환
- 컬러:
  - Primary: teal-600 (#0d9488) / Dark: teal-400 (#2dd4bf)
  - Background: white (#ffffff) / Dark: slate-950 (#020617)
  - Accent: emerald-500 (#10b981)
  - Text: slate-800 (#1e293b) / Dark: slate-100 (#f1f5f9)
- 폰트 크기: 커뮤니티명 4xl bold, 섹션 제목 2xl semibold, 본문 base
- 레이아웃: max-w-6xl 센터, 섹션 간 py-16~24

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 커뮤니티/스터디 이름
- NEXT_PUBLIC_DESCRIPTION: 한줄 소개 문구
- NEXT_PUBLIC_MEMBER_COUNT: 현재 멤버 수 (숫자)
- NEXT_PUBLIC_MEMBERS: 멤버 목록 JSON ([{"name":"홍길동","role":"운영자","avatar_url":"...","bio":"백엔드 개발자"}])
- NEXT_PUBLIC_SCHEDULES: 일정 목록 JSON ([{"date":"2026-03-15","title":"3월 정기모임","location":"강남 스터디카페","description":"React 19 스터디"}])
- NEXT_PUBLIC_RESOURCES: 자료 목록 JSON ([{"category":"노션","title":"스터디 노트","url":"https://notion.so/...","icon":"notebook"}])
- NEXT_PUBLIC_GALLERY_IMAGES: 갤러리 이미지 JSON (["https://...jpg", "https://...jpg"])
- NEXT_PUBLIC_JOIN_URL: 가입 신청 폼 URL (Google Form 등)
- NEXT_PUBLIC_JOIN_DESCRIPTION: 가입 방법 안내 텍스트
- NEXT_PUBLIC_DISCORD_URL: 디스코드 서버 초대 링크
- NEXT_PUBLIC_KAKAO_OPEN_CHAT_URL: 카카오톡 오픈채팅 링크
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. `linkmap-templates/community-hub` GitHub 레포에 Next.js 프로젝트 생성
2. 모든 개인화 데이터는 NEXT_PUBLIC_* 환경변수로 주입
3. 환경변수 미설정 시 매력적인 데모 데이터 표시 (가상의 "프론트엔드 스터디" 커뮤니티)
4. Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
5. 한국어 기본, lang="ko"
6. 반응형: 360px ~ 1440px
7. 다크모드 토글 포함
8. /api/og 엔드포인트로 동적 OG 이미지 생성
9. JSON-LD 구조화 데이터 (Organization 타입)
10. 접근성: WCAG 2.1 AA, 키보드 내비게이션
11. 섹션 간 부드러운 스크롤 (scroll-behavior: smooth)
12. 네비게이션 헤더에 섹션 앵커 링크 포함
13. 멤버 카드 hover 애니메이션 (translateY + shadow 변경)
14. 갤러리 이미지 클릭 시 라이트박스 모달
```

---

## 3. 핵심 섹션 정의

### 섹션 1: 히어로
- **위치**: 페이지 최상단, 뷰포트 높이 60~70vh
- **구성**: 커뮤니티명(4xl bold) + 한줄 소개(lg, text-muted-foreground) + "가입하기" CTA 버튼(emerald-500, rounded-full, px-8 py-3) + 멤버 수 배지(`Users` 아이콘 + "N명 활동 중")
- **배경**: teal-50/teal-950 그라데이션, 미묘한 도트 패턴 오버레이
- **인터랙션**: CTA 클릭 시 가입 안내 섹션으로 스크롤, 멤버 수 배지에 `animate-pulse` 효과
- **데이터**: `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_DESCRIPTION`, `NEXT_PUBLIC_MEMBER_COUNT`

### 섹션 2: About
- **위치**: 히어로 바로 아래, py-16
- **구성**: 섹션 제목 "소개"(2xl semibold) + 커뮤니티 소개 텍스트(base, max-w-3xl) + 활동 목적 카드 3개(아이콘 + 제목 + 설명, 그리드 3열)
- **인터랙션**: 정적 콘텐츠, 스크롤 진입 시 fade-in
- **데이터**: `NEXT_PUBLIC_DESCRIPTION` 확장 또는 config 내 about 텍스트

### 섹션 3: 멤버 소개
- **위치**: About 아래, py-16, bg-slate-50/dark:bg-slate-900
- **구성**: 섹션 제목 "멤버"(2xl semibold) + 멤버 카드 그리드(sm:grid-cols-2, lg:grid-cols-3, xl:grid-cols-4)
- **카드 구조**: 원형 아바타(64px) + 이름(font-semibold) + 역할 배지(teal-100 text-teal-800, rounded-full, text-xs px-2 py-1) + 한줄 소개(text-sm text-muted-foreground)
- **인터랙션**: hover 시 `translateY(-4px)` + `shadow-lg` + `border-teal-200` 전환 (transition 300ms)
- **데이터**: `NEXT_PUBLIC_MEMBERS` JSON 파싱, 미설정 시 데모 멤버 6명

### 섹션 4: 일정/캘린더
- **위치**: 멤버 소개 아래, py-16
- **구성**: 섹션 제목 "다가오는 일정"(2xl semibold) + 일정 카드 세로 타임라인 형태
- **카드 구조**: 좌측 날짜 칼럼(월/일 표시, teal-600 강조) + 우측 콘텐츠(제목 font-semibold + 장소(MapPin 아이콘 + text-sm) + 설명(text-sm text-muted-foreground))
- **인터랙션**: 날짜순 정렬(가까운 일정 상단), 지난 일정은 opacity-50 처리
- **데이터**: `NEXT_PUBLIC_SCHEDULES` JSON 파싱, 미설정 시 데모 일정 3개

### 섹션 5: 자료실
- **위치**: 일정 아래, py-16, bg-slate-50/dark:bg-slate-900
- **구성**: 섹션 제목 "자료실"(2xl semibold) + 카테고리별 그룹핑 + 링크 카드 리스트
- **카드 구조**: 카테고리 아이콘(Lucide 동적 매핑) + 자료 제목(font-medium) + URL(ExternalLink 아이콘, 새 탭 열기)
- **인터랙션**: 카드 hover 시 bg-teal-50/dark:bg-teal-900/20 전환, 외부 링크 클릭 시 `target="_blank" rel="noopener noreferrer"`
- **데이터**: `NEXT_PUBLIC_RESOURCES` JSON 파싱, 미설정 시 데모 자료 4개 (노션, GitHub, 구글드라이브, 유튜브)

### 섹션 6: 갤러리
- **위치**: 자료실 아래, py-16
- **구성**: 섹션 제목 "활동 갤러리"(2xl semibold) + 이미지 그리드(sm:grid-cols-2, lg:grid-cols-3, gap-4)
- **이미지**: aspect-square, object-cover, rounded-lg
- **인터랙션**: 클릭 시 라이트박스 모달(배경 블러 + 원본 크기 이미지 + 좌우 네비게이션), ESC 키로 닫기
- **데이터**: `NEXT_PUBLIC_GALLERY_IMAGES` JSON 파싱, 미설정 시 placeholder 이미지 6개

### 섹션 7: 가입 안내
- **위치**: 갤러리 아래, py-16, bg-teal-50/dark:bg-teal-900/20
- **구성**: 섹션 제목 "함께하기"(2xl semibold) + 가입 방법 안내 텍스트(base) + CTA 버튼("가입 신청하기", emerald-500, 큰 사이즈 px-10 py-4)
- **인터랙션**: CTA 버튼 클릭 시 `NEXT_PUBLIC_JOIN_URL`로 새 탭 이동
- **데이터**: `NEXT_PUBLIC_JOIN_URL`, `NEXT_PUBLIC_JOIN_DESCRIPTION`

### 섹션 8: 푸터
- **위치**: 페이지 최하단, py-8, border-t
- **구성**: SNS 링크 아이콘(디스코드, 카카오톡) + "Powered by Linkmap" 텍스트(text-sm text-muted-foreground)
- **인터랙션**: 아이콘 hover 시 teal-500 색상 전환
- **데이터**: `NEXT_PUBLIC_DISCORD_URL`, `NEXT_PUBLIC_KAKAO_OPEN_CHAT_URL`

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:----:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 커뮤니티/스터디 이름 | O | `'프론트엔드 스터디'` |
| `NEXT_PUBLIC_DESCRIPTION` | 한줄 소개 문구 | | `'함께 성장하는 프론트엔드 개발 스터디 그룹입니다.'` |
| `NEXT_PUBLIC_MEMBER_COUNT` | 현재 멤버 수 | | `'24'` |
| `NEXT_PUBLIC_MEMBERS` | 멤버 목록 (JSON 배열) | | 데모 멤버 6명 |
| `NEXT_PUBLIC_SCHEDULES` | 일정 목록 (JSON 배열) | | 데모 일정 3개 |
| `NEXT_PUBLIC_RESOURCES` | 자료 목록 (JSON 배열) | | 데모 자료 4개 |
| `NEXT_PUBLIC_GALLERY_IMAGES` | 갤러리 이미지 URL (JSON 배열) | | placeholder 6개 |
| `NEXT_PUBLIC_JOIN_URL` | 가입 신청 폼 URL | | `null` (버튼 비활성) |
| `NEXT_PUBLIC_JOIN_DESCRIPTION` | 가입 방법 안내 텍스트 | | `'아래 버튼을 눌러 가입 신청서를 작성해 주세요.'` |
| `NEXT_PUBLIC_DISCORD_URL` | 디스코드 서버 초대 링크 | | `null` (미표시) |
| `NEXT_PUBLIC_KAKAO_OPEN_CHAT_URL` | 카카오톡 오픈채팅 링크 | | `null` (미표시) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | `null` (미추적) |

---

## 5. 디자인 스펙

### 컬러

| 용도 | Light Mode | Dark Mode |
|------|-----------|-----------|
| Primary | teal-600 `#0d9488` | teal-400 `#2dd4bf` |
| Background | white `#ffffff` | slate-950 `#020617` |
| Surface | slate-50 `#f8fafc` | slate-900 `#0f172a` |
| Accent (CTA) | emerald-500 `#10b981` | emerald-400 `#34d399` |
| Accent Hover | emerald-600 `#059669` | emerald-300 `#6ee7b7` |
| Text Primary | slate-800 `#1e293b` | slate-100 `#f1f5f9` |
| Text Secondary | slate-500 `#64748b` | slate-400 `#94a3b8` |
| Border | slate-200 `#e2e8f0` | slate-800 `#1e293b` |
| Card Background | white `#ffffff` | slate-800 `#1e293b` |
| Role Badge BG | teal-100 `#ccfbf1` | teal-900 `#134e4a` |
| Role Badge Text | teal-800 `#115e59` | teal-200 `#99f6e4` |

### 타이포그래피
- 커뮤니티명: `text-4xl sm:text-5xl font-bold tracking-tight` (Pretendard)
- 섹션 제목: `text-2xl sm:text-3xl font-semibold` (Pretendard)
- 본문 텍스트: `text-base leading-relaxed` (Pretendard)
- 멤버 이름: `text-base font-semibold` (Pretendard)
- 역할 배지: `text-xs font-medium` (Inter)
- 한줄 소개: `text-sm text-muted-foreground` (Pretendard)
- 일정 날짜: `text-lg font-bold tabular-nums` (Inter)
- 푸터: `text-sm text-muted-foreground` (Pretendard)

### 레이아웃
- 전체 컨테이너: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`
- 섹션 패딩: `py-16 sm:py-20 lg:py-24`
- 멤버 그리드: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`
- 일정 타임라인: `flex flex-col gap-6`, 좌측 날짜 칼럼 `w-20 shrink-0`
- 자료실 리스트: `flex flex-col gap-3`
- 갤러리 그리드: `grid grid-cols-2 sm:grid-cols-3 gap-4`
- 가입 안내: `text-center max-w-2xl mx-auto`

### 반응형 브레이크포인트
- **360px** (모바일): 단일 열, 패딩 px-4, 히어로 텍스트 text-3xl, 멤버 카드 1열
- **640px** (sm): 멤버 카드 2열, 갤러리 3열, 히어로 텍스트 text-4xl
- **768px** (md): 네비게이션 풀 표시 (모바일 햄버거 → 인라인 링크)
- **1024px** (lg): 멤버 카드 3열, 섹션 패딩 증가
- **1280px** (xl): 멤버 카드 4열, max-w-6xl 고정
- **1440px+**: 센터 정렬 유지, 여백 증가

---

## 6. 컴포넌트 구조

```
linkmap-templates/community-hub/
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
│   │   ├── hero-section.tsx          # 히어로 (커뮤니티명 + CTA + 멤버 수)
│   │   ├── about-section.tsx         # 커뮤니티 소개 + 활동 목적 카드
│   │   ├── members-grid.tsx          # 멤버 카드 그리드
│   │   ├── schedule-list.tsx         # 다가오는 일정 타임라인
│   │   ├── resource-links.tsx        # 카테고리별 자료 링크 목록
│   │   ├── photo-gallery.tsx         # 활동 사진 그리드 + 라이트박스 모달
│   │   ├── join-section.tsx          # 가입 안내 + CTA 버튼
│   │   └── footer.tsx                # SNS 링크 + Powered by Linkmap
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
| `hero-section.tsx` | Client | 커뮤니티명, 한줄 소개, CTA 버튼, 멤버 수 배지, 배경 그라데이션 |
| `about-section.tsx` | Server | 커뮤니티 소개 텍스트, 활동 목적 3열 카드 |
| `members-grid.tsx` | Client | 멤버 카드 렌더링, hover 애니메이션, 아바타 fallback(이니셜) |
| `schedule-list.tsx` | Client | 일정 JSON 파싱, 날짜순 정렬, 타임라인 UI, 지난 일정 흐림 처리 |
| `resource-links.tsx` | Client | 자료 JSON 파싱, 카테고리 그룹핑, 외부 링크 카드 |
| `photo-gallery.tsx` | Client | 이미지 그리드 렌더링, 클릭 시 라이트박스 모달 (useState) |
| `join-section.tsx` | Server | 가입 안내 텍스트 + CTA 버튼 (외부 폼 링크) |
| `footer.tsx` | Server | 디스코드/카카오톡 아이콘 링크, 저작권 텍스트 |
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
  'b2c3d4e5-0015-4000-9000-000000000015',
  'community-hub',
  'Community Hub',
  '커뮤니티 허브',
  'All-in-one community portal for study groups, clubs, and hobby groups. Centralize members, schedules, resources, and join forms in one page.',
  '스터디·동호회·동아리를 위한 올인원 커뮤니티 포탈. 멤버 소개, 일정, 자료 링크, 가입 안내를 한 페이지에 통합.',
  NULL,
  'linkmap-templates',
  'community-hub',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "커뮤니티/스터디 이름", "required": true},
    {"key": "NEXT_PUBLIC_DESCRIPTION", "description": "한줄 소개 문구", "required": false},
    {"key": "NEXT_PUBLIC_MEMBER_COUNT", "description": "현재 멤버 수", "required": false},
    {"key": "NEXT_PUBLIC_MEMBERS", "description": "멤버 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_SCHEDULES", "description": "일정 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_RESOURCES", "description": "자료 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GALLERY_IMAGES", "description": "갤러리 이미지 URL JSON", "required": false},
    {"key": "NEXT_PUBLIC_JOIN_URL", "description": "가입 신청 폼 URL", "required": false},
    {"key": "NEXT_PUBLIC_JOIN_DESCRIPTION", "description": "가입 방법 안내 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_DISCORD_URL", "description": "디스코드 서버 초대 링크", "required": false},
    {"key": "NEXT_PUBLIC_KAKAO_OPEN_CHAT_URL", "description": "카카오톡 오픈채팅 링크", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['community', 'study-group', 'club', 'members', 'schedule', 'resources', 'nextjs'],
  false,
  true,
  15
) ON CONFLICT (slug) DO NOTHING;
```

### 7.2 TypeScript 시드 (`homepage-templates.ts` 추가분)

```typescript
{
  id: 'b2c3d4e5-0015-4000-9000-000000000015',
  slug: 'community-hub',
  name: 'Community Hub',
  name_ko: '커뮤니티 허브',
  description:
    'All-in-one community portal for study groups, clubs, and hobby groups. Centralize members, schedules, resources, and join forms in one page.',
  description_ko:
    '스터디·동호회·동아리를 위한 올인원 커뮤니티 포탈. 멤버 소개, 일정, 자료 링크, 가입 안내를 한 페이지에 통합.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'community-hub',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '커뮤니티/스터디 이름', required: true },
    { key: 'NEXT_PUBLIC_DESCRIPTION', description: '한줄 소개 문구', required: false },
    { key: 'NEXT_PUBLIC_MEMBER_COUNT', description: '현재 멤버 수', required: false },
    { key: 'NEXT_PUBLIC_MEMBERS', description: '멤버 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_SCHEDULES', description: '일정 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_RESOURCES', description: '자료 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_GALLERY_IMAGES', description: '갤러리 이미지 URL JSON', required: false },
    { key: 'NEXT_PUBLIC_JOIN_URL', description: '가입 신청 폼 URL', required: false },
    { key: 'NEXT_PUBLIC_JOIN_DESCRIPTION', description: '가입 방법 안내 텍스트', required: false },
    { key: 'NEXT_PUBLIC_DISCORD_URL', description: '디스코드 서버 초대 링크', required: false },
    { key: 'NEXT_PUBLIC_KAKAO_OPEN_CHAT_URL', description: '카카오톡 오픈채팅 링크', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['community', 'study-group', 'club', 'members', 'schedule', 'resources', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 15,
}
```

---

## 8. 검증 체크리스트

### 기능
- [ ] 커뮤니티명, 한줄 소개, 멤버 수 정상 표시
- [ ] "가입하기" CTA 버튼 클릭 시 가입 안내 섹션으로 스크롤
- [ ] 멤버 카드 그리드 정상 렌더링 (아바타, 이름, 역할, 소개)
- [ ] 멤버 아바타 미설정 시 이니셜 fallback 표시
- [ ] 일정 목록 날짜순 정렬, 지난 일정 흐림 처리
- [ ] 자료실 외부 링크 새 탭에서 열림
- [ ] 갤러리 이미지 클릭 시 라이트박스 모달 동작
- [ ] 라이트박스 좌우 네비게이션 + ESC 키 닫기
- [ ] 가입 안내 CTA 버튼 클릭 시 외부 폼 URL 새 탭 열기
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
- [ ] 이미지 lazy loading 적용 (`loading="lazy"`)

### 접근성
- [ ] 키보드 내비게이션 (Tab 순서, Enter 활성화)
- [ ] 스크린리더 호환 (aria-label, role 적절 사용)
- [ ] 컬러 대비 WCAG 2.1 AA (4.5:1 이상)
- [ ] 갤러리 이미지 alt 텍스트 제공
- [ ] 외부 링크에 `aria-label="새 탭에서 열기"` 표시
- [ ] 모달 열림 시 포커스 트랩, 닫힘 시 포커스 복원
- [ ] skip-to-content 링크 제공

### SEO
- [ ] OG 메타태그 정상 생성 (title, description, image)
- [ ] JSON-LD Organization 구조화 데이터
- [ ] /api/og 이미지 생성 확인
- [ ] robots.txt 존재
- [ ] sitemap.xml 생성
- [ ] canonical URL 설정
- [ ] 페이지 title에 커뮤니티명 포함
