# 스터디 모집 페이지 (Study Recruit) 기획서

## 1. 개요

| 항목 | 내용 |
|------|------|
| 슬러그 | `study-recruit` |
| UUID | `b2c3d4e5-0020-4000-9000-000000000020` |
| 카테고리 | Community |
| 타겟 페르소나 | 스터디장, 사이드프로젝트 리더, 커뮤니티 운영자 |
| 우선순위 | 14위 (총점 77/100) |
| Phase | Phase 4: 커뮤니티·롱테일 |
| 구현 일정 | 3일 |
| 비고 | 스터디/사이드프로젝트 모집 원페이지. 일정, 커리큘럼, 신청폼, 참여자 현황 |

### 핵심 가치
- **모집 효율**: 스터디/프로젝트 정보를 한 페이지에 정리하여 신청 전환율 극대화
- **신뢰 구축**: 커리큘럼, 운영진 소개, 참여자 현황으로 스터디 품질 증명
- **커뮤니티 바이럴**: 개발자 오픈채팅방, OKKY, Disquiet 등에서 링크 공유로 자연 바이럴
- **시즌 수요**: 분기별 스터디 시즌 + 사이드프로젝트 팀빌딩 시즌에 수요 폭발

### 선정 근거
- 한국 개발자 커뮤니티에서 스터디 모집이 가장 활발한 바이럴 콘텐츠
- 카카오톡 오픈채팅방·디스코드 공유 시 링크 하나로 모든 정보 전달
- 기존 구글폼+노션 조합의 산만함을 일관된 브랜딩으로 해결

---

## 2. AI 구현 프롬프트

> 이 섹션을 통째로 AI(Claude Code, Cursor 등)에 전달하면 템플릿을 구현할 수 있다.

```
## 컨텍스트
Linkmap(https://www.linkmap.biz)의 원클릭 배포용 홈페이지 템플릿을 구현한다.
사용자가 GitHub 연결 → 템플릿 선택 → 환경변수 입력 → GitHub Pages 배포 3단계로 스터디 모집 페이지를 생성한다.

## 템플릿: 스터디 모집 페이지 (study-recruit)
- 타겟: 스터디장, 사이드프로젝트 리더
- 카테고리: Community
- 핵심 목적: 스터디/사이드프로젝트 모집 원페이지. 일정, 커리큘럼, 신청폼 링크, 참여자 현황

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 폰트: Pretendard(한글) + Inter(영문) via next/font
- 아이콘: Lucide React
- 다크모드: next-themes
- SEO: next/metadata + JSON-LD
- OG 이미지: @vercel/og (/api/og)
- 배포: GitHub Pages (static export)

## 핵심 섹션
1. 히어로: 스터디/프로젝트명 + 한줄 소개 + 모집 상태 뱃지(모집중/마감) + 모집 기간 카운트다운
2. 소개: 스터디 목표, 진행 방식, 기대 효과 설명
3. 커리큘럼: 주차별 일정 표 (주차, 주제, 내용, 과제)
4. 운영진 소개: 운영자/멘토 프로필 카드 (사진+이름+소개+링크)
5. 모집 요건: 대상, 인원, 비용, 준비물, 시간대
6. 참여자 현황: 현재 신청 인원/정원 프로그레스 바 + 참여자 아바타 스택
7. 신청 CTA: "신청하기" 버튼 → 외부 폼(구글폼/타입폼) 링크
8. FAQ: 자주 묻는 질문 아코디언
9. 푸터: 문의 연락처 + "Powered by Linkmap"

## 디자인 스펙
- 깔끔하고 신뢰감 있는 레이아웃 (과도한 장식 없음)
- 모집 상태에 따른 컬러 시그널 (모집중: green, 마감임박: amber, 마감: red)
- 커리큘럼 표는 모바일에서 카드 형태로 전환
- 컬러:
  - Primary: violet-600 (#7c3aed) / Dark: violet-400 (#a78bfa)
  - Background: white / Dark: gray-950
  - Surface: gray-50 / Dark: gray-900
  - 모집중 뱃지: green-500 / 마감임박: amber-500 / 마감: red-500
- 폰트: 스터디명 3xl~4xl bold, 섹션 제목 2xl bold, 본문 base
- 레이아웃: max-w-3xl, 충분한 여백 (py-16 섹션 간격)

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 스터디/프로젝트명
- NEXT_PUBLIC_TAGLINE: 한줄 소개
- NEXT_PUBLIC_STATUS: 모집 상태 ("open"/"closing"/"closed")
- NEXT_PUBLIC_DEADLINE: 모집 마감일 (ISO 8601, 카운트다운 표시)
- NEXT_PUBLIC_DESCRIPTION: 스터디 소개 텍스트 (마크다운 지원)
- NEXT_PUBLIC_CURRICULUM: 커리큘럼 JSON ([{"week":1,"topic":"..","content":"..","assignment":".."}])
- NEXT_PUBLIC_ORGANIZERS: 운영진 JSON ([{"name":"..","role":"..","avatar_url":"..","bio":"..","link":".."}])
- NEXT_PUBLIC_REQUIREMENTS: 모집 요건 JSON ({"target":"..","capacity":20,"cost":"무료","schedule":"매주 토 14:00","prerequisites":[".."]})
- NEXT_PUBLIC_CURRENT_APPLICANTS: 현재 신청 인원 (숫자)
- NEXT_PUBLIC_MAX_CAPACITY: 최대 정원 (숫자)
- NEXT_PUBLIC_APPLY_URL: 신청 폼 URL (구글폼/타입폼)
- NEXT_PUBLIC_FAQ: FAQ JSON ([{"question":"..","answer":".."}])
- NEXT_PUBLIC_CONTACT_EMAIL: 문의 이메일
- NEXT_PUBLIC_CONTACT_KAKAO: 카카오톡 오픈채팅 URL
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. `linkmap-templates/study-recruit` GitHub 레포에 Next.js 프로젝트 생성
2. 모든 개인화 데이터는 NEXT_PUBLIC_* 환경변수로 주입
3. 환경변수 미설정 시 가상의 "React 스터디" 데모 데이터 표시
4. Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
5. 한국어 기본, lang="ko"
6. 반응형: 360px ~ 1440px
7. 다크모드 토글 포함
8. /api/og 엔드포인트로 스터디명+모집상태가 포함된 OG 이미지 생성
9. JSON-LD 구조화 데이터 (Event 타입)
10. 접근성: WCAG 2.1 AA, 키보드 내비게이션
11. 카운트다운 타이머: 모집 마감일까지 D-day 표시
12. 참여자 프로그레스 바: 현재 인원/정원 시각화
13. 신청 버튼: 마감(closed) 시 비활성화 + "모집 마감" 텍스트
14. FAQ 아코디언: 클릭으로 열기/닫기, 키보드 접근 가능
```

---

## 3. 핵심 섹션 정의

### 섹션 1: 히어로
- **위치**: 페이지 최상단 (py-16, 센터 정렬)
- **구성**: 모집 상태 뱃지(open/closing/closed) + 스터디명(3xl~4xl bold) + 한줄 소개(xl text-muted) + 모집 마감 카운트다운(D-day) + "신청하기" CTA 버튼
- **상태 뱃지**: `모집중`(bg-green-100 text-green-800) / `마감임박`(bg-amber-100 text-amber-800) / `마감`(bg-red-100 text-red-800)
- **카운트다운**: D-14, D-7 등 남은 일수 표시 (실시간 타이머 옵션)
- **CTA**: `bg-violet-600 text-white rounded-lg px-8 py-3`, 마감 시 `bg-gray-400 cursor-not-allowed`

### 섹션 2: 소개
- **위치**: 히어로 아래 (py-12)
- **구성**: 스터디 목표, 진행 방식, 기대 효과를 마크다운 or HTML로 렌더링
- **스타일**: `prose dark:prose-invert max-w-none`, 리스트/볼드/이미지 지원
- **데이터**: `NEXT_PUBLIC_DESCRIPTION`

### 섹션 3: 커리큘럼
- **위치**: 소개 아래 (py-12)
- **구성**: 섹션 제목 "커리큘럼"(2xl bold) + 주차별 표/카드
- **데스크톱**: 테이블 레이아웃 (주차 | 주제 | 내용 | 과제)
- **모바일**: 카드 레이아웃 (각 주차 = 카드, 주제/내용/과제 세로 배치)
- **스타일**: 표 `border-collapse`, 카드 `rounded-xl border shadow-sm`
- **데이터**: `NEXT_PUBLIC_CURRICULUM` JSON

### 섹션 4: 운영진 소개
- **위치**: 커리큘럼 아래 (py-12)
- **구성**: 섹션 제목 "운영진"(2xl bold) + 프로필 카드 그리드(sm:grid-cols-2)
- **카드**: 아바타(64px rounded-full) + 이름(font-semibold) + 역할 뱃지 + 소개(text-sm) + 외부 링크
- **데이터**: `NEXT_PUBLIC_ORGANIZERS` JSON

### 섹션 5: 모집 요건
- **위치**: 운영진 아래 (py-12, bg-gray-50/dark:bg-gray-900)
- **구성**: 섹션 제목 "모집 요건"(2xl bold) + 요건 리스트
- **항목**: 대상(Users 아이콘) + 인원(Users 아이콘) + 비용(CreditCard 아이콘) + 일정(Calendar 아이콘) + 준비물(CheckCircle 아이콘)
- **스타일**: 아이콘 + 라벨 + 값, flex 레이아웃
- **데이터**: `NEXT_PUBLIC_REQUIREMENTS` JSON

### 섹션 6: 참여자 현황
- **위치**: 모집 요건 아래 (py-12)
- **구성**: 프로그레스 바(현재/정원) + "12/20명 신청" 텍스트 + 아바타 스택(선택)
- **프로그레스 바**: `bg-violet-600` 채움, `bg-gray-200 dark:bg-gray-700` 빈 영역
- **긴급성**: 80% 이상 시 `bg-amber-500`, 100% 시 `bg-red-500 "마감"`
- **데이터**: `NEXT_PUBLIC_CURRENT_APPLICANTS`, `NEXT_PUBLIC_MAX_CAPACITY`

### 섹션 7: 신청 CTA
- **위치**: 참여자 현황 아래 (py-16, 센터)
- **구성**: "지금 신청하세요!" 텍스트(2xl bold) + 큰 CTA 버튼 + 마감일 리마인더
- **동작**: 버튼 클릭 → `NEXT_PUBLIC_APPLY_URL` (구글폼/타입폼) 새 탭 열기
- **마감 시**: 버튼 비활성화 + "모집이 마감되었습니다" 텍스트
- **데이터**: `NEXT_PUBLIC_APPLY_URL`, `NEXT_PUBLIC_STATUS`

### 섹션 8: FAQ
- **위치**: 신청 CTA 아래 (py-12)
- **구성**: 섹션 제목 "자주 묻는 질문"(2xl bold) + 아코디언 리스트
- **아코디언**: 질문(font-medium) 클릭 → 답변 슬라이드 열기/닫기
- **접근성**: `<details>/<summary>` 또는 aria-expanded 패턴, 키보드 Enter/Space
- **데이터**: `NEXT_PUBLIC_FAQ` JSON

### 섹션 9: 푸터
- **위치**: 페이지 최하단
- **구성**: 문의(이메일 + 카카오톡 오픈채팅) + 다크모드 토글 + "Powered by Linkmap"
- **스타일**: `text-gray-500 text-sm border-t py-8`

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:---:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 스터디/프로젝트명 | O | `'React 심화 스터디'` |
| `NEXT_PUBLIC_TAGLINE` | 한줄 소개 | | `'함께 성장하는 8주 React 마스터 코스'` |
| `NEXT_PUBLIC_STATUS` | 모집 상태 | | `'open'` |
| `NEXT_PUBLIC_DEADLINE` | 모집 마감일 (ISO 8601) | | 2주 후 날짜 |
| `NEXT_PUBLIC_DESCRIPTION` | 스터디 소개 (마크다운) | | 데모 소개 텍스트 |
| `NEXT_PUBLIC_CURRICULUM` | 커리큘럼 (JSON) | | 데모 8주 커리큘럼 |
| `NEXT_PUBLIC_ORGANIZERS` | 운영진 (JSON) | | 데모 운영자 2명 |
| `NEXT_PUBLIC_REQUIREMENTS` | 모집 요건 (JSON) | | 데모 요건 |
| `NEXT_PUBLIC_CURRENT_APPLICANTS` | 현재 신청 인원 | | `12` |
| `NEXT_PUBLIC_MAX_CAPACITY` | 최대 정원 | | `20` |
| `NEXT_PUBLIC_APPLY_URL` | 신청 폼 URL | | `null` (데모 알림) |
| `NEXT_PUBLIC_FAQ` | FAQ (JSON) | | 데모 FAQ 5개 |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 문의 이메일 | | `null` (미표시) |
| `NEXT_PUBLIC_CONTACT_KAKAO` | 카카오 오픈채팅 URL | | `null` (미표시) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | `null` (미추적) |

---

## 5. 디자인 스펙

### 컬러

| 용도 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경 | `#ffffff` (white) | `#030712` (gray-950) |
| Surface | `#f9fafb` (gray-50) | `#111827` (gray-900) |
| 텍스트 (주) | `#111827` (gray-900) | `#f9fafb` (gray-50) |
| 텍스트 (보조) | `#6b7280` (gray-500) | `#9ca3af` (gray-400) |
| CTA 버튼 | `#7c3aed` (violet-600) | `#a78bfa` (violet-400) |
| CTA hover | `#6d28d9` (violet-700) | `#8b5cf6` (violet-500) |
| 프로그레스 바 | `#7c3aed` (violet-600) | `#a78bfa` (violet-400) |
| 모집중 뱃지 | `#dcfce7/#166534` (green-100/green-800) | `#166534/#86efac` |
| 마감임박 뱃지 | `#fef3c7/#92400e` (amber-100/amber-800) | `#78350f/#fbbf24` |
| 마감 뱃지 | `#fee2e2/#991b1b` (red-100/red-800) | `#7f1d1d/#fca5a5` |
| 보더 | `#e5e7eb` (gray-200) | `#374151` (gray-700) |

### 타이포그래피
- 스터디명: `text-3xl sm:text-4xl font-bold` (Pretendard)
- 한줄 소개: `text-xl text-gray-500` (Pretendard)
- 섹션 제목: `text-2xl font-bold` (Pretendard)
- 커리큘럼 주제: `text-base font-semibold` (Pretendard)
- 본문: `text-base leading-relaxed` (Pretendard)
- FAQ 질문: `text-base font-medium` (Pretendard)
- 상태 뱃지: `text-sm font-semibold` (Pretendard)
- 카운트다운: `text-lg font-bold tabular-nums` (Inter)

### 레이아웃
- 전체: `max-w-3xl mx-auto px-4 sm:px-6`
- 섹션 간격: `py-12 sm:py-16`
- 운영진 그리드: `grid grid-cols-1 sm:grid-cols-2 gap-4`
- 커리큘럼 표: `w-full` (데스크톱), 카드 리스트 (모바일)
- FAQ 아코디언: `divide-y divide-gray-200`

### 반응형
- 360px: 단일 열, 카드형 커리큘럼, 세로 CTA
- 640px: 운영진 2열, 가로 CTA
- 768px: 커리큘럼 테이블 레이아웃 전환
- 1024px+: max-w-3xl 고정

---

## 6. 컴포넌트 구조

```
linkmap-templates/study-recruit/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트, ThemeProvider
│   │   ├── page.tsx                # 메인 페이지
│   │   └── api/og/route.tsx        # OG 이미지 (스터디명+모집상태)
│   ├── components/
│   │   ├── hero-section.tsx        # 스터디명+소개+상태뱃지+카운트다운+CTA
│   │   ├── status-badge.tsx        # 모집 상태 뱃지 (open/closing/closed)
│   │   ├── countdown-timer.tsx     # 마감일 카운트다운 (D-day)
│   │   ├── description-section.tsx # 스터디 소개 (마크다운 렌더링)
│   │   ├── curriculum-table.tsx    # 커리큘럼 (데스크톱 테이블/모바일 카드)
│   │   ├── organizer-cards.tsx     # 운영진 프로필 카드 그리드
│   │   ├── requirements-list.tsx   # 모집 요건 아이콘 리스트
│   │   ├── applicant-progress.tsx  # 참여자 현황 프로그레스 바
│   │   ├── apply-cta.tsx           # 신청 CTA 버튼 (마감 시 비활성화)
│   │   ├── faq-accordion.tsx       # FAQ 아코디언
│   │   ├── theme-toggle.tsx        # 다크모드 토글
│   │   └── footer.tsx              # 문의+Linkmap
│   └── lib/
│       └── config.ts               # 환경변수 파싱 + 타입 + 기본값
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### 컴포넌트 역할

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `layout.tsx` | Server | 메타데이터, 폰트, ThemeProvider, JSON-LD (Event) |
| `page.tsx` | Server | config 읽기, 섹션 조합 |
| `hero-section.tsx` | Client | 스터디명, 소개, 상태 뱃지, 카운트다운, CTA |
| `status-badge.tsx` | Server | open/closing/closed 상태별 뱃지 |
| `countdown-timer.tsx` | Client | 마감일까지 D-day 계산, 실시간 업데이트 |
| `description-section.tsx` | Server | 마크다운/HTML 소개 렌더링 |
| `curriculum-table.tsx` | Client | 반응형: 테이블(md+) / 카드(모바일) |
| `organizer-cards.tsx` | Server | 운영자 프로필 카드 그리드 |
| `requirements-list.tsx` | Server | 아이콘 + 라벨 + 값 리스트 |
| `applicant-progress.tsx` | Server | 프로그레스 바, 현재/정원 표시 |
| `apply-cta.tsx` | Client | CTA 버튼, 마감 시 비활성화 로직 |
| `faq-accordion.tsx` | Client | 아코디언 열기/닫기, 키보드 접근 |
| `footer.tsx` | Server | 이메일+카카오 문의, Powered by Linkmap |
| `config.ts` | Util | 환경변수 파싱, JSON 파싱, 기본값 |

---

## 7. 시드 데이터

### 7.1 SQL INSERT (homepage_templates)

```sql
INSERT INTO homepage_templates (
  id, slug, name, name_ko, description, description_ko,
  preview_image_url, github_owner, github_repo, default_branch,
  framework, required_env_vars, tags, is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0020-4000-9000-000000000020',
  'study-recruit',
  'Study Recruit',
  '스터디 모집 페이지',
  'Study group and side project recruitment page. Curriculum, organizer profiles, application progress, FAQ, and countdown timer.',
  '스터디/사이드프로젝트 모집 페이지. 커리큘럼, 운영진 소개, 신청 현황, FAQ, 마감 카운트다운.',
  NULL,
  'linkmap-templates',
  'study-recruit',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "스터디/프로젝트명", "required": true},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "한줄 소개", "required": false},
    {"key": "NEXT_PUBLIC_STATUS", "description": "모집 상태 (open/closing/closed)", "required": false},
    {"key": "NEXT_PUBLIC_DEADLINE", "description": "모집 마감일 (ISO 8601)", "required": false},
    {"key": "NEXT_PUBLIC_DESCRIPTION", "description": "스터디 소개 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_CURRICULUM", "description": "커리큘럼 JSON", "required": false},
    {"key": "NEXT_PUBLIC_ORGANIZERS", "description": "운영진 JSON", "required": false},
    {"key": "NEXT_PUBLIC_REQUIREMENTS", "description": "모집 요건 JSON", "required": false},
    {"key": "NEXT_PUBLIC_CURRENT_APPLICANTS", "description": "현재 신청 인원", "required": false},
    {"key": "NEXT_PUBLIC_MAX_CAPACITY", "description": "최대 정원", "required": false},
    {"key": "NEXT_PUBLIC_APPLY_URL", "description": "신청 폼 URL", "required": false},
    {"key": "NEXT_PUBLIC_FAQ", "description": "FAQ JSON", "required": false},
    {"key": "NEXT_PUBLIC_CONTACT_EMAIL", "description": "문의 이메일", "required": false},
    {"key": "NEXT_PUBLIC_CONTACT_KAKAO", "description": "카카오 오픈채팅 URL", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['study', 'recruit', 'community', 'side-project', 'developer', 'nextjs'],
  false,
  true,
  16
) ON CONFLICT (slug) DO NOTHING;
```

### 7.2 TypeScript 시드 (`homepage-templates.ts` 추가분)

```typescript
{
  id: 'b2c3d4e5-0020-4000-9000-000000000020',
  slug: 'study-recruit',
  name: 'Study Recruit',
  name_ko: '스터디 모집 페이지',
  description: 'Study group and side project recruitment page. Curriculum, organizer profiles, application progress, FAQ, and countdown timer.',
  description_ko: '스터디/사이드프로젝트 모집 페이지. 커리큘럼, 운영진 소개, 신청 현황, FAQ, 마감 카운트다운.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'study-recruit',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '스터디/프로젝트명', required: true },
    { key: 'NEXT_PUBLIC_TAGLINE', description: '한줄 소개', required: false },
    { key: 'NEXT_PUBLIC_STATUS', description: '모집 상태 (open/closing/closed)', required: false },
    { key: 'NEXT_PUBLIC_DEADLINE', description: '모집 마감일 (ISO 8601)', required: false },
    { key: 'NEXT_PUBLIC_DESCRIPTION', description: '스터디 소개 텍스트', required: false },
    { key: 'NEXT_PUBLIC_CURRICULUM', description: '커리큘럼 JSON', required: false },
    { key: 'NEXT_PUBLIC_ORGANIZERS', description: '운영진 JSON', required: false },
    { key: 'NEXT_PUBLIC_REQUIREMENTS', description: '모집 요건 JSON', required: false },
    { key: 'NEXT_PUBLIC_CURRENT_APPLICANTS', description: '현재 신청 인원', required: false },
    { key: 'NEXT_PUBLIC_MAX_CAPACITY', description: '최대 정원', required: false },
    { key: 'NEXT_PUBLIC_APPLY_URL', description: '신청 폼 URL', required: false },
    { key: 'NEXT_PUBLIC_FAQ', description: 'FAQ JSON', required: false },
    { key: 'NEXT_PUBLIC_CONTACT_EMAIL', description: '문의 이메일', required: false },
    { key: 'NEXT_PUBLIC_CONTACT_KAKAO', description: '카카오 오픈채팅 URL', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['study', 'recruit', 'community', 'side-project', 'developer', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 16,
}
```

---

## 8. 검증 체크리스트

### 기능
- [ ] 스터디명, 소개, 모집 상태 뱃지 정상 표시
- [ ] 모집 상태별 뱃지 컬러 변경 (open/closing/closed)
- [ ] 마감 카운트다운 D-day 정상 동작
- [ ] 커리큘럼 테이블 → 모바일 카드 반응형 전환
- [ ] 운영진 프로필 카드 정상 렌더링
- [ ] 모집 요건 아이콘+텍스트 리스트 표시
- [ ] 참여자 현황 프로그레스 바 정상 동작
- [ ] 프로그레스 바 80%+ 시 경고 컬러 전환
- [ ] 신청 CTA → 외부 폼 URL 새 탭 열기
- [ ] 마감(closed) 시 CTA 비활성화 + 안내 텍스트
- [ ] FAQ 아코디언 열기/닫기 동작
- [ ] FAQ 키보드(Enter/Space) 접근 가능
- [ ] 환경변수 미설정 시 React 스터디 데모 데이터 표시
- [ ] 다크모드 토글 동작

### 성능
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 90+
- [ ] Lighthouse Best Practices 90+
- [ ] Lighthouse SEO 90+
- [ ] FCP < 1.5s, LCP < 2.5s, CLS < 0.1

### 접근성
- [ ] 키보드 내비게이션 (Tab, Enter, Space)
- [ ] 스크린리더 호환 (aria-label, aria-expanded)
- [ ] 컬러 대비 WCAG 2.1 AA
- [ ] 프로그레스 바 aria-valuenow/aria-valuemax

### SEO
- [ ] OG 메타태그 (스터디명 + 모집상태)
- [ ] JSON-LD Event 구조화 데이터
- [ ] /api/og 이미지 생성 확인
- [ ] robots.txt + sitemap.xml 존재
