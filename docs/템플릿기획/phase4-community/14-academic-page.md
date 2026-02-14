# 학술 포트폴리오 (Academic Page) 기획서

## 1. 개요

| 항목 | 내용 |
|------|------|
| 슬러그 | `academic-page` |
| UUID | `b2c3d4e5-0016-4000-9000-000000000016` |
| 카테고리 | 전문가 & 포트폴리오 |
| 타겟 페르소나 | 대학교수, 연구원, 온라인 강사 (페르소나: 연구자/강사 "교수님" 40세) |
| 우선순위 | 14위 (총점 70/100) |
| Phase | Phase 4: Community |
| 구현 일정 | 3일 |
| 비고 | 논문 목록, 강의 일정, 연구 실적, CV 다운로드를 통합하는 학술 포트폴리오 |

### 핵심 가치
- **학술적 권위**: 논문, 강의, 수상 실적을 체계적으로 전시하여 전문성 증명
- **효율성**: 논문/강의/이력 정보를 하나의 페이지로 통합, Google Scholar 연동 옵션
- **접근성**: 학생, 공동연구자, 저널 에디터가 쉽게 연구 이력 확인 가능

---

## 2. AI 구현 프롬프트

> 이 섹션을 통째로 AI(Claude Code, Cursor 등)에 전달하면 템플릿을 구현할 수 있다.

```
## 컨텍스트
Linkmap(https://linkmap.vercel.app)의 원클릭 배포용 홈페이지 템플릿을 구현한다.
사용자가 GitHub 연결 → 템플릿 선택 → 환경변수 입력 → GitHub Pages 배포 3단계로 학술 포트폴리오 페이지를 생성한다.

## 템플릿: 학술 포트폴리오 (academic-page)
- 타겟: 대학교수, 연구원, 온라인 강사
- 카테고리: 전문가 & 포트폴리오
- 핵심 목적: 논문 목록, 강의 일정, 연구 실적, CV 다운로드. Google Scholar 연동 옵션
- 심리적 동기: 학술적 권위 + 효율성 (논문/강의 정리)

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 폰트: Pretendard(한글) + Inter(영문) via next/font, 추가로 Noto Serif KR(선택, serif 느낌)
- 아이콘: Lucide React
- 다크모드: next-themes
- SEO: next/metadata + JSON-LD
- OG 이미지: @vercel/og (/api/og)
- 배포: GitHub Pages (static export)

## 핵심 섹션
1. 헤더 프로필: 이름 + 직함 + 소속 대학/기관 + 프로필 사진 (학술적 톤)
2. Research Interests: 연구 관심사 태그 클라우드 or 카드 (키워드 나열)
3. Publications: 논문 목록 (년도별 그룹핑, 제목 + 저널/학회 + DOI 링크 + 인용수)
4. Teaching: 강의 목록 (학기별, 강의명 + 대학 + 설명)
5. Lab/Team: 연구실/팀 소개 + 멤버 (학생, 연구원)
6. CV/이력: 학력, 경력, 수상 타임라인 + PDF CV 다운로드 버튼
7. Contact: 이메일 + 연구실 위치 + Google Scholar 프로필 링크
8. 푸터: 소속 기관명 + Powered by Linkmap

## 디자인 스펙
- 학술적이고 격식 있는 레이아웃
- Noto Serif KR 옵션 (헤더/논문 제목에 serif), 본문은 Pretendard
- 화이트 + 네이비(slate-800)/다크그린(emerald-800) 악센트
- 논문 목록 가독성 중시 (여백 충분, 년도별 구분선)
- 클린 타이포그래피, 장식 최소화
- 컬러:
  - Primary: slate-800 (#1e293b) / Dark: slate-200 (#e2e8f0)
  - Background: white (#ffffff) / Dark: slate-950 (#020617)
  - Accent: emerald-700 (#047857) / Dark: emerald-400 (#34d399)
  - Border: slate-200 (#e2e8f0) / Dark: slate-700 (#334155)
- 폰트 크기: 이름 3xl bold, 직함 lg, 논문 제목 base font-medium, 본문 sm~base
- 레이아웃: max-w-4xl (좁은 리딩 폭), 논문 리스트 좌측 정렬

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 이름 (예: "김영수")
- NEXT_PUBLIC_TITLE: 직함 (예: "교수, 컴퓨터공학과")
- NEXT_PUBLIC_AFFILIATION: 소속 기관 (예: "서울대학교")
- NEXT_PUBLIC_AVATAR_URL: 프로필 사진 URL
- NEXT_PUBLIC_RESEARCH_INTERESTS: 연구 관심사 JSON (["Machine Learning", "NLP", "Computer Vision"])
- NEXT_PUBLIC_PUBLICATIONS: 논문 목록 JSON ([{"title":"...","authors":"Kim Y., Lee J.","journal":"NeurIPS 2025","year":2025,"doi":"10.1234/...","citations":42}])
- NEXT_PUBLIC_COURSES: 강의 목록 JSON ([{"name":"딥러닝 개론","semester":"2026 봄","university":"서울대학교","description":"..."}])
- NEXT_PUBLIC_LAB_MEMBERS: 연구실 멤버 JSON ([{"name":"박지민","role":"박사과정","avatar_url":"..."}])
- NEXT_PUBLIC_CV_URL: CV PDF 다운로드 URL
- NEXT_PUBLIC_EDUCATION: 학력 JSON ([{"degree":"Ph.D.","field":"Computer Science","university":"MIT","year":"2015"}])
- NEXT_PUBLIC_AWARDS: 수상 이력 JSON ([{"title":"Best Paper Award","organization":"ACL","year":"2024"}])
- NEXT_PUBLIC_EMAIL: 연락용 이메일
- NEXT_PUBLIC_OFFICE_LOCATION: 연구실 위치
- NEXT_PUBLIC_GOOGLE_SCHOLAR_URL: Google Scholar 프로필 URL
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. `linkmap-templates/academic-page` GitHub 레포에 Next.js 프로젝트 생성
2. 모든 개인화 데이터는 NEXT_PUBLIC_* 환경변수로 주입
3. 환경변수 미설정 시 매력적인 데모 데이터 표시 (가상의 AI 연구 교수)
4. Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
5. 한국어 기본, lang="ko"
6. 반응형: 360px ~ 1440px
7. 다크모드 토글 포함
8. /api/og 엔드포인트로 동적 OG 이미지 생성
9. JSON-LD 구조화 데이터 (Person + ScholarlyArticle 타입)
10. 접근성: WCAG 2.1 AA, 키보드 내비게이션
11. 논문 DOI 링크 클릭 시 새 탭 열기
12. 논문 목록 년도별 그룹핑 + 인용수 내림차순 정렬 옵션
13. CV PDF 다운로드 버튼 명확히 제공
14. Google Scholar 프로필 외부 링크 아이콘 표시
```

---

## 3. 핵심 섹션 정의

### 섹션 1: 헤더 프로필
- **위치**: 페이지 최상단, py-16, 센터 또는 좌측 정렬
- **구성**: 프로필 사진(rounded-full, 120px, border-4 border-white shadow-lg) + 이름(3xl bold) + 직함(lg text-muted-foreground) + 소속 기관(base, emerald-700 text)
- **배경**: 클린 화이트/slate-950, 상단에 얇은 emerald 라인(4px) 악센트
- **인터랙션**: 정적 콘텐츠, 프로필 사진 hover 시 미묘한 scale(1.02)
- **데이터**: `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_TITLE`, `NEXT_PUBLIC_AFFILIATION`, `NEXT_PUBLIC_AVATAR_URL`

### 섹션 2: Research Interests
- **위치**: 헤더 아래, py-12
- **구성**: 섹션 제목 "Research Interests"(xl semibold) + 태그 리스트(flex flex-wrap gap-2)
- **태그 스타일**: `bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full px-3 py-1 text-sm font-medium`
- **인터랙션**: 정적 태그, hover 시 bg 색상 약간 진해짐
- **데이터**: `NEXT_PUBLIC_RESEARCH_INTERESTS` JSON 파싱, 미설정 시 데모 키워드 6개

### 섹션 3: Publications
- **위치**: Research Interests 아래, py-16, 핵심 섹션
- **구성**: 섹션 제목 "Publications"(xl semibold) + 논문 총 수 배지 + 년도별 그룹 헤더(2xl bold, border-b) + 논문 카드 리스트
- **논문 카드**: 제목(base font-medium, hover 시 emerald-700 색상) + 저자(sm text-muted-foreground, 본인 이름 bold) + 저널/학회명(sm italic) + DOI 링크(ExternalLink 아이콘, 새 탭) + 인용수 배지(text-xs bg-slate-100)
- **인터랙션**: DOI 링크 클릭 시 새 탭 열기, 논문 제목 hover 시 underline + 색상 변경
- **데이터**: `NEXT_PUBLIC_PUBLICATIONS` JSON 파싱, 년도별 그룹핑 후 최신순 정렬, 미설정 시 데모 논문 8개

### 섹션 4: Teaching
- **위치**: Publications 아래, py-16, bg-slate-50/dark:bg-slate-900
- **구성**: 섹션 제목 "Teaching"(xl semibold) + 학기별 그룹 헤더 + 강의 카드 리스트
- **강의 카드**: 강의명(base font-medium) + 대학(sm) + 학기(text-xs badge) + 설명(sm text-muted-foreground, 2줄 제한)
- **인터랙션**: 정적 콘텐츠, 카드 hover 시 border-l-2 border-emerald-500 악센트
- **데이터**: `NEXT_PUBLIC_COURSES` JSON 파싱, 미설정 시 데모 강의 4개

### 섹션 5: Lab/Team
- **위치**: Teaching 아래, py-16
- **구성**: 섹션 제목 "Lab Members"(xl semibold) + 멤버 카드 그리드(sm:grid-cols-2, lg:grid-cols-3)
- **멤버 카드**: 아바타(48px rounded-full) + 이름(font-medium) + 역할 배지(text-xs, 박사과정/석사과정/연구원 색상 구분)
- **인터랙션**: 정적 카드, hover 시 shadow-sm → shadow-md
- **데이터**: `NEXT_PUBLIC_LAB_MEMBERS` JSON 파싱, 미설정 시 데모 멤버 5명

### 섹션 6: CV/이력
- **위치**: Lab/Team 아래, py-16, bg-slate-50/dark:bg-slate-900
- **구성**: 섹션 제목 "Curriculum Vitae"(xl semibold) + CV PDF 다운로드 버튼(emerald-700, Download 아이콘) + 타임라인 형태 이력
- **타임라인**: 좌측 세로선(border-l-2 border-slate-200) + 원형 마커(w-3 h-3 bg-emerald-500 rounded-full) + 우측 콘텐츠(학위/경력/수상)
- **이력 구분**: "학력"(GraduationCap 아이콘), "수상"(Award 아이콘) 서브섹션
- **인터랙션**: CV 다운로드 버튼 클릭 시 PDF 파일 다운로드, hover 시 bg-emerald-800
- **데이터**: `NEXT_PUBLIC_CV_URL`, `NEXT_PUBLIC_EDUCATION`, `NEXT_PUBLIC_AWARDS`

### 섹션 7: Contact
- **위치**: CV/이력 아래, py-16
- **구성**: 섹션 제목 "Contact"(xl semibold) + 이메일(Mail 아이콘 + mailto 링크) + 연구실 위치(MapPin 아이콘) + Google Scholar 링크(ExternalLink 아이콘)
- **인터랙션**: 이메일 클릭 시 메일 앱 열기, Google Scholar 클릭 시 새 탭 열기
- **데이터**: `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_OFFICE_LOCATION`, `NEXT_PUBLIC_GOOGLE_SCHOLAR_URL`

### 섹션 8: 푸터
- **위치**: 페이지 최하단, py-8, border-t
- **구성**: 소속 기관명(text-sm) + "Powered by Linkmap" 텍스트(text-xs text-muted-foreground)
- **인터랙션**: 정적 콘텐츠
- **데이터**: `NEXT_PUBLIC_AFFILIATION`

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:----:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 이름 (교수/연구원 성명) | O | `'김영수'` |
| `NEXT_PUBLIC_TITLE` | 직함 | | `'교수, 컴퓨터공학과'` |
| `NEXT_PUBLIC_AFFILIATION` | 소속 기관 | | `'서울대학교'` |
| `NEXT_PUBLIC_AVATAR_URL` | 프로필 사진 URL | | `null` (이니셜 아바타) |
| `NEXT_PUBLIC_RESEARCH_INTERESTS` | 연구 관심사 (JSON 배열) | | 데모 키워드 6개 |
| `NEXT_PUBLIC_PUBLICATIONS` | 논문 목록 (JSON 배열) | | 데모 논문 8개 |
| `NEXT_PUBLIC_COURSES` | 강의 목록 (JSON 배열) | | 데모 강의 4개 |
| `NEXT_PUBLIC_LAB_MEMBERS` | 연구실 멤버 (JSON 배열) | | 데모 멤버 5명 |
| `NEXT_PUBLIC_CV_URL` | CV PDF 다운로드 URL | | `null` (버튼 미표시) |
| `NEXT_PUBLIC_EDUCATION` | 학력 (JSON 배열) | | 데모 학력 3개 |
| `NEXT_PUBLIC_AWARDS` | 수상 이력 (JSON 배열) | | 데모 수상 3개 |
| `NEXT_PUBLIC_EMAIL` | 연락용 이메일 | | `null` (미표시) |
| `NEXT_PUBLIC_OFFICE_LOCATION` | 연구실 위치 | | `null` (미표시) |
| `NEXT_PUBLIC_GOOGLE_SCHOLAR_URL` | Google Scholar 프로필 URL | | `null` (미표시) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | `null` (미추적) |

---

## 5. 디자인 스펙

### 컬러

| 용도 | Light Mode | Dark Mode |
|------|-----------|-----------|
| Primary | slate-800 `#1e293b` | slate-200 `#e2e8f0` |
| Background | white `#ffffff` | slate-950 `#020617` |
| Surface | slate-50 `#f8fafc` | slate-900 `#0f172a` |
| Accent | emerald-700 `#047857` | emerald-400 `#34d399` |
| Accent Hover | emerald-800 `#065f46` | emerald-300 `#6ee7b7` |
| Text Primary | slate-800 `#1e293b` | slate-100 `#f1f5f9` |
| Text Secondary | slate-500 `#64748b` | slate-400 `#94a3b8` |
| Border | slate-200 `#e2e8f0` | slate-700 `#334155` |
| Top Accent Line | emerald-700 `#047857` | emerald-500 `#10b981` |
| Tag BG | emerald-50 `#ecfdf5` | emerald-900/30 |
| Tag Text | emerald-800 `#065f46` | emerald-300 `#6ee7b7` |
| Timeline Line | slate-200 `#e2e8f0` | slate-700 `#334155` |
| Timeline Dot | emerald-500 `#10b981` | emerald-400 `#34d399` |

### 타이포그래피
- 이름: `text-3xl sm:text-4xl font-bold tracking-tight` (Pretendard)
- 직함: `text-lg text-muted-foreground` (Pretendard)
- 소속: `text-base text-emerald-700 dark:text-emerald-400 font-medium` (Pretendard)
- 섹션 제목: `text-xl sm:text-2xl font-semibold` (Pretendard)
- 논문 제목: `text-base font-medium leading-snug` (Pretendard)
- 저자/저널: `text-sm text-muted-foreground` (Pretendard), 저널명은 `italic`
- 년도 헤더: `text-2xl font-bold tabular-nums` (Inter)
- 강의명: `text-base font-medium` (Pretendard)
- 본문: `text-sm sm:text-base leading-relaxed` (Pretendard)
- 푸터: `text-xs text-muted-foreground` (Pretendard)
- serif 옵션: `Noto Serif KR` (헤더/논문 제목에 적용 가능, 환경변수로 토글)

### 레이아웃
- 전체 컨테이너: `max-w-4xl mx-auto px-4 sm:px-6 lg:px-8` (좁은 리딩 폭, 학술 문서 느낌)
- 섹션 패딩: `py-12 sm:py-16`
- 논문 리스트: `flex flex-col gap-4`, 년도 그룹 간 `mt-8`
- 태그 리스트: `flex flex-wrap gap-2`
- 멤버 그리드: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- 타임라인: `relative pl-8`, 세로선 `absolute left-3 top-0 bottom-0 w-px bg-slate-200`
- Contact: `flex flex-col gap-3`

### 반응형 브레이크포인트
- **360px** (모바일): 단일 열, 패딩 px-4, 이름 text-2xl, 논문 리스트 풀폭
- **640px** (sm): 멤버 2열, 이름 text-3xl, 본문 text-base
- **768px** (md): 네비게이션 인라인 표시
- **1024px** (lg): 멤버 3열, max-w-4xl 고정
- **1440px+**: 센터 정렬 유지, 좌우 여백 증가

---

## 6. 컴포넌트 구조

```
linkmap-templates/academic-page/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx                # 메타데이터, 폰트(Pretendard+Inter+NotoSerifKR), ThemeProvider
│   │   ├── page.tsx                  # 메인 페이지 (섹션 조합)
│   │   └── api/og/route.tsx          # OG 이미지 동적 생성
│   ├── components/
│   │   ├── nav-header.tsx            # 네비게이션 헤더 (섹션 앵커 링크 + 다크모드 토글)
│   │   ├── header-profile.tsx        # 프로필 사진 + 이름 + 직함 + 소속
│   │   ├── research-interests.tsx    # 연구 관심사 태그 클라우드
│   │   ├── publications-list.tsx     # 논문 목록 (년도별 그룹핑 + DOI 링크)
│   │   ├── teaching-section.tsx      # 강의 목록 (학기별)
│   │   ├── lab-team.tsx              # 연구실 멤버 카드 그리드
│   │   ├── cv-timeline.tsx           # 학력/수상 타임라인 + CV 다운로드 버튼
│   │   ├── contact-section.tsx       # 이메일 + 위치 + Google Scholar
│   │   └── footer.tsx                # 소속 기관 + Powered by Linkmap
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
| `layout.tsx` | Server | 메타데이터, 폰트 로드(Pretendard+Inter+NotoSerifKR), ThemeProvider, JSON-LD |
| `page.tsx` | Server | config 읽기, 섹션 컴포넌트 순서 배치 |
| `nav-header.tsx` | Client | 스티키 헤더, 섹션 앵커 링크, 모바일 메뉴, 다크모드 토글 |
| `header-profile.tsx` | Server | 프로필 사진, 이름, 직함, 소속 기관 표시, 상단 악센트 라인 |
| `research-interests.tsx` | Server | 연구 관심사 태그 리스트 렌더링 |
| `publications-list.tsx` | Client | 논문 JSON 파싱, 년도별 그룹핑, DOI 링크, 인용수 표시, 정렬 토글 |
| `teaching-section.tsx` | Server | 강의 JSON 파싱, 학기별 그룹핑, 강의 카드 리스트 |
| `lab-team.tsx` | Server | 연구실 멤버 카드 그리드, 역할별 배지 색상 |
| `cv-timeline.tsx` | Client | 학력/수상 타임라인 렌더링, CV PDF 다운로드 버튼 |
| `contact-section.tsx` | Server | 이메일 mailto 링크, 연구실 위치, Google Scholar 외부 링크 |
| `footer.tsx` | Server | 소속 기관명, 저작권, Powered by Linkmap |
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
  'b2c3d4e5-0016-4000-9000-000000000016',
  'academic-page',
  'Academic Page',
  '학술 포트폴리오',
  'Professional academic portfolio for professors and researchers. Showcase publications, courses, lab members, and CV with Google Scholar integration.',
  '교수·연구원을 위한 학술 포트폴리오. 논문 목록, 강의 일정, 연구실 소개, CV 다운로드를 한 페이지에 통합. Google Scholar 연동.',
  NULL,
  'linkmap-templates',
  'academic-page',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "이름 (교수/연구원 성명)", "required": true},
    {"key": "NEXT_PUBLIC_TITLE", "description": "직함", "required": false},
    {"key": "NEXT_PUBLIC_AFFILIATION", "description": "소속 기관", "required": false},
    {"key": "NEXT_PUBLIC_AVATAR_URL", "description": "프로필 사진 URL", "required": false},
    {"key": "NEXT_PUBLIC_RESEARCH_INTERESTS", "description": "연구 관심사 JSON", "required": false},
    {"key": "NEXT_PUBLIC_PUBLICATIONS", "description": "논문 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_COURSES", "description": "강의 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_LAB_MEMBERS", "description": "연구실 멤버 JSON", "required": false},
    {"key": "NEXT_PUBLIC_CV_URL", "description": "CV PDF 다운로드 URL", "required": false},
    {"key": "NEXT_PUBLIC_EDUCATION", "description": "학력 JSON", "required": false},
    {"key": "NEXT_PUBLIC_AWARDS", "description": "수상 이력 JSON", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "연락용 이메일", "required": false},
    {"key": "NEXT_PUBLIC_OFFICE_LOCATION", "description": "연구실 위치", "required": false},
    {"key": "NEXT_PUBLIC_GOOGLE_SCHOLAR_URL", "description": "Google Scholar 프로필 URL", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['academic', 'professor', 'research', 'publications', 'university', 'scholar', 'nextjs'],
  false,
  true,
  16
) ON CONFLICT (slug) DO NOTHING;
```

### 7.2 TypeScript 시드 (`homepage-templates.ts` 추가분)

```typescript
{
  id: 'b2c3d4e5-0016-4000-9000-000000000016',
  slug: 'academic-page',
  name: 'Academic Page',
  name_ko: '학술 포트폴리오',
  description:
    'Professional academic portfolio for professors and researchers. Showcase publications, courses, lab members, and CV with Google Scholar integration.',
  description_ko:
    '교수·연구원을 위한 학술 포트폴리오. 논문 목록, 강의 일정, 연구실 소개, CV 다운로드를 한 페이지에 통합. Google Scholar 연동.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'academic-page',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '이름 (교수/연구원 성명)', required: true },
    { key: 'NEXT_PUBLIC_TITLE', description: '직함', required: false },
    { key: 'NEXT_PUBLIC_AFFILIATION', description: '소속 기관', required: false },
    { key: 'NEXT_PUBLIC_AVATAR_URL', description: '프로필 사진 URL', required: false },
    { key: 'NEXT_PUBLIC_RESEARCH_INTERESTS', description: '연구 관심사 JSON', required: false },
    { key: 'NEXT_PUBLIC_PUBLICATIONS', description: '논문 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_COURSES', description: '강의 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_LAB_MEMBERS', description: '연구실 멤버 JSON', required: false },
    { key: 'NEXT_PUBLIC_CV_URL', description: 'CV PDF 다운로드 URL', required: false },
    { key: 'NEXT_PUBLIC_EDUCATION', description: '학력 JSON', required: false },
    { key: 'NEXT_PUBLIC_AWARDS', description: '수상 이력 JSON', required: false },
    { key: 'NEXT_PUBLIC_EMAIL', description: '연락용 이메일', required: false },
    { key: 'NEXT_PUBLIC_OFFICE_LOCATION', description: '연구실 위치', required: false },
    { key: 'NEXT_PUBLIC_GOOGLE_SCHOLAR_URL', description: 'Google Scholar 프로필 URL', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['academic', 'professor', 'research', 'publications', 'university', 'scholar', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 16,
}
```

---

## 8. 검증 체크리스트

### 기능
- [ ] 프로필 사진, 이름, 직함, 소속 정상 표시
- [ ] 연구 관심사 태그 정상 렌더링
- [ ] 논문 목록 년도별 그룹핑 정상 동작
- [ ] 논문 DOI 링크 클릭 시 새 탭에서 열림
- [ ] 논문 인용수 배지 표시
- [ ] 강의 목록 학기별 그룹핑 정상 동작
- [ ] 연구실 멤버 카드 역할별 배지 색상 구분
- [ ] CV/이력 타임라인 정상 렌더링 (학력 + 수상)
- [ ] CV PDF 다운로드 버튼 동작 확인
- [ ] Contact 이메일 mailto 링크 동작
- [ ] Google Scholar 프로필 링크 새 탭 열기
- [ ] 환경변수 미설정 시 매력적인 데모 데이터 표시
- [ ] 다크모드 토글 동작
- [ ] 네비게이션 헤더 섹션 앵커 스크롤

### 성능
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 90+
- [ ] Lighthouse Best Practices 90+
- [ ] Lighthouse SEO 90+
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] 폰트 로딩 최적화 (display: swap)

### 접근성
- [ ] 키보드 내비게이션 (Tab 순서, Enter 활성화)
- [ ] 스크린리더 호환 (aria-label, 적절한 heading 계층)
- [ ] 컬러 대비 WCAG 2.1 AA (4.5:1 이상)
- [ ] 외부 링크에 `aria-label` 및 새 탭 알림
- [ ] 프로필 이미지 alt 텍스트 제공
- [ ] 논문 리스트 적절한 리스트 시멘틱 (`<ul>`, `<li>`)
- [ ] skip-to-content 링크 제공

### SEO
- [ ] OG 메타태그 정상 생성 (title, description, image)
- [ ] JSON-LD Person 구조화 데이터 (이름, 소속, 직함)
- [ ] JSON-LD ScholarlyArticle 구조화 데이터 (논문별)
- [ ] /api/og 이미지 생성 확인
- [ ] robots.txt 존재
- [ ] sitemap.xml 생성
- [ ] canonical URL 설정
- [ ] 페이지 title에 교수명 + 소속 포함
