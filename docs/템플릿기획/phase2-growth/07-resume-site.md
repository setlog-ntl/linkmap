# 이력서 사이트 (Resume Site) 기획서

## 1. 개요

| 항목 | 값 |
|------|-----|
| 슬러그 | `resume-site` |
| UUID | `b2c3d4e5-0009-4000-9000-000000000009` |
| 카테고리 | 전문가 & 포트폴리오 |
| 타겟 | 취준생 (페르소나: 취준생 "하은" 23세, 컴공 4학년) |
| 우선순위 | 7위 (총점 81/100) |
| Phase | Phase 2 - 성장 |
| 일정 | 3일 |
| 비고 | 인터랙티브 타임라인, 스킬 차트, PDF 이력서 다운로드 |

### 핵심 가치

**"종이 이력서를 넘어, 살아 있는 나의 이력서"**

- **인터랙티브 타임라인**: 경력/교육 이력을 시각적으로 표현하는 좌우 교차 타임라인
- **스킬 차트**: 프로그레스 바로 기술 스택 숙련도를 시각화
- **PDF 이력서 다운로드**: 면접관이 바로 인쇄할 수 있는 PDF 파일 제공
- **프린트 최적화**: `@media print` CSS로 인쇄 시 깔끔한 레이아웃

### 심리적 동기

| 동기 | 설명 |
|------|------|
| 성취감 | 자신의 경력과 기술을 체계적으로 정리하고 시각화 |
| 자기표현 | 종이 이력서로는 표현할 수 없는 인터랙티브 경험 |
| 효율성 | 면접관에게 URL 하나로 모든 정보 전달 |

### 바이럴 전략

- 대학교 취업지원센터와 연계 (취준생 대상 홍보)
- LinkedIn/원티드 프로필에 이력서 사이트 URL 링크
- 취업 커뮤니티(블라인드, 잡코리아)에서 "이력서 사이트 만들기" 가이드 공유
- "Built with Linkmap" 푸터로 자연 노출

---

## 2. AI 구현 프롬프트

```
당신은 시니어 풀스택 개발자입니다. 아래 명세에 따라 이력서 사이트 홈페이지 템플릿을 구현하세요.

## 컨텍스트
- 프로젝트: Linkmap 원클릭 배포용 홈페이지 템플릿
- 템플릿명: 이력서 사이트 (Resume Site)
- 슬러그: resume-site
- 레포: linkmap-templates/resume-site/
- 타겟: 취준생 (23세 컴공 4학년 "하은")
- 핵심 가치: 인터랙티브 타임라인, 스킬 차트, PDF 이력서 다운로드

## 기술 스택
- Framework: Next.js 16 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS v4
- Fonts: Pretendard (한글) + Inter (영문) via next/font
- Icons: Lucide React
- Dark Mode: next-themes (ThemeProvider + ThemeToggle)
- SEO: next/metadata + JSON-LD (Person schema)
- OG Image: @vercel/og (/api/og)
- Analytics: Google Analytics 4 (선택)
- Deploy: GitHub Pages (Fork 기반)

## 핵심 섹션 (8개)
1. 헤더: 이름(h1) + 직함/목표 직무 + 연락처(이메일, 전화, GitHub, LinkedIn) 아이콘 바. 컴팩트한 상단 바 스타일
2. About: 자기소개 텍스트(2~3문장) + 프로필 사진(120px 원형). 좌: 사진, 우: 텍스트 레이아웃
3. Experience: 경력/인턴 타임라인. 좌우 교차 레이아웃(데스크톱), 세로 리스트(모바일). 각 항목: 기간 뱃지 + 회사명 + 직책 + 설명 + 기술 태그
4. Skills: 프로그레스 바 형태 스킬 차트. 카테고리별 그룹핑(Frontend, Backend, Tools 등). 각 스킬: 이름 + 레벨(%) + 바 애니메이션
5. Projects: 프로젝트 카드 그리드(모바일 1열, 데스크톱 2열). 각 카드: 썸네일 + 제목 + 설명 + 기술 태그 + 링크(GitHub, 데모)
6. 자격증/수상: 목록 형태. 각 항목: 아이콘(Award) + 이름 + 발급기관 + 취득일
7. PDF 다운로드: CTA 섹션. "이력서 다운로드" 버튼(Download 아이콘) → PDF 파일 다운로드. 배경 그라데이션 강조
8. Contact: 이메일 + 전화 + GitHub + LinkedIn 링크. 간결한 가로 아이콘 바 + "Powered by Linkmap"

## 디자인 스펙
- 컬러: 깔끔한 인포그래픽 스타일. 화이트 배경 + 블루(blue-600) 악센트
- 다크모드: slate-900 배경 + blue-400 악센트
- 타이포: 이름 36~40px, 섹션 제목 24~28px, 본문 16px (깔끔하고 읽기 쉬운)
- 타임라인: 중앙 세로선(2px, blue-200) + 좌우 카드 + 날짜 뱃지(blue-100 배경)
- 프로그레스 바: 높이 8px, rounded-full, 배경 gray-200, 채움 blue-500 → blue-600 그라데이션
- 레이아웃: max-w-4xl, 클린한 여백
- 프린트: @media print로 불필요한 요소(토글, 애니메이션) 숨김, A4 최적화
- 반응형: 360px → 768px → 1024px → 1440px

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 이름 (이력서 주인공)
- NEXT_PUBLIC_TITLE: 직함/목표 직무
- NEXT_PUBLIC_EMAIL: 이메일 주소
- NEXT_PUBLIC_PHONE: 전화번호
- NEXT_PUBLIC_ABOUT: 자기소개 텍스트
- NEXT_PUBLIC_AVATAR_URL: 프로필 사진 URL
- NEXT_PUBLIC_EXPERIENCE (JSON): 경력 목록 [{"company":"회사명","role":"직책","period":"2024.01~현재","desc":"...","tags":["React","TS"]}]
- NEXT_PUBLIC_EDUCATION (JSON): 학력 목록 [{"school":"대학교","major":"전공","period":"2021~2025","desc":"..."}]
- NEXT_PUBLIC_SKILLS (JSON): 스킬 목록 [{"category":"Frontend","items":[{"name":"React","level":90}]}]
- NEXT_PUBLIC_PROJECTS (JSON): 프로젝트 목록
- NEXT_PUBLIC_CERTIFICATIONS (JSON): 자격증/수상 목록
- NEXT_PUBLIC_RESUME_URL: PDF 이력서 파일 URL (public 폴더 또는 외부 URL)
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. 환경변수 미설정 시 가상의 주니어 개발자 데모 이력서 표시
2. src/lib/config.ts에서 환경변수를 타입 안전하게 파싱
3. JSON 환경변수는 try-catch로 안전하게 파싱, 실패 시 기본값 사용
4. Lighthouse 4개 카테고리 모두 90+ 달성
5. JSON-LD에 Person 스키마 포함 (이름, 직함, 이메일)
6. /api/og 엔드포인트로 이름 + 직함이 포함된 OG 이미지 생성
7. 타임라인 카드가 뷰포트 진입 시 페이드인 애니메이션 (IntersectionObserver)
8. 스킬 프로그레스 바가 뷰포트 진입 시 0%→목표% 채움 애니메이션
9. @media print CSS로 A4 용지에 최적화된 인쇄 레이아웃
10. PDF 다운로드 버튼 클릭 시 <a download> 또는 window.open() 동작
11. 프로젝트 카드에 GitHub/데모 링크 아이콘 버튼
12. 교육(Education)과 경력(Experience)을 하나의 타임라인에 통합 표시 (색상으로 구분)
```

---

## 3. 핵심 섹션 정의

### 3.1 헤더 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 페이지 최상단 |
| 구성 | 이름(h1, 좌측) + 직함(서브텍스트) + 연락처 아이콘 바(우측: Mail, Phone, Github, Linkedin) + 다크모드 토글 |
| 인터랙션 | 각 아이콘 클릭 시 해당 링크로 이동 (mailto:, tel:, 외부 URL) |
| 데이터 | `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_TITLE`, `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_PHONE` |
| 기본값 | "김하은", "프론트엔드 개발자", "haeun@example.com" |

### 3.2 About 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 헤더 아래 |
| 구성 | 좌: 프로필 사진(120px, 원형), 우: 자기소개 텍스트(2~3문장). 모바일에서는 세로 배치(사진 위, 텍스트 아래) |
| 인터랙션 | 없음 (정적 콘텐츠) |
| 데이터 | `NEXT_PUBLIC_AVATAR_URL`, `NEXT_PUBLIC_ABOUT` |
| 기본값 | 기본 아바타, "사용자 경험을 중시하는 프론트엔드 개발자입니다..." |

### 3.3 Experience 섹션 (경력/교육 타임라인)

| 항목 | 설명 |
|------|------|
| 위치 | About 아래 |
| 구성 | 섹션 제목("경력 & 교육") + 좌우 교차 타임라인. 중앙 세로선(2px) + 좌/우 카드(교차). 각 카드: 기간 뱃지(blue 배경) + 기관명 + 역할 + 설명 + 기술 태그. 경력=blue, 교육=green으로 색상 구분 |
| 인터랙션 | 각 카드가 뷰포트 진입 시 페이드인 + 좌/우에서 슬라이드인 애니메이션 (IntersectionObserver) |
| 데이터 | `NEXT_PUBLIC_EXPERIENCE`(JSON), `NEXT_PUBLIC_EDUCATION`(JSON) |
| 기본값 | 인턴 1개 + 프로젝트 경험 1개 + 대학교 1개 데모 |
| 모바일 | 좌우 교차 → 세로 리스트(왼쪽 세로선 + 카드) |

### 3.4 Skills 섹션

| 항목 | 설명 |
|------|------|
| 위치 | Experience 아래 |
| 구성 | 섹션 제목("기술 스택") + 카테고리별 그룹(Frontend, Backend, Tools 등). 각 스킬: 이름(좌) + 레벨 %(우) + 프로그레스 바(아래) |
| 인터랙션 | 프로그레스 바가 뷰포트 진입 시 0%→목표% 채움 애니메이션 (CSS transition, 1초) |
| 데이터 | `NEXT_PUBLIC_SKILLS`(JSON) |
| 기본값 | Frontend(React 90%, TypeScript 85%, CSS 80%), Backend(Node.js 70%, Python 60%), Tools(Git 85%, Docker 50%) |

### 3.5 Projects 섹션

| 항목 | 설명 |
|------|------|
| 위치 | Skills 아래 |
| 구성 | 섹션 제목("프로젝트") + 프로젝트 카드 그리드(모바일 1열, 데스크톱 2열). 각 카드: 썸네일(상단) + 제목 + 설명 + 기술 태그(하단) + GitHub/데모 링크 아이콘 |
| 인터랙션 | 카드 호버 시 translateY(-4px) + shadow 증가. 링크 아이콘 호버 시 색상 변경 |
| 데이터 | `NEXT_PUBLIC_PROJECTS`(JSON) |
| 기본값 | 프로젝트 3개 데모 데이터 |

### 3.6 자격증/수상 섹션

| 항목 | 설명 |
|------|------|
| 위치 | Projects 아래 |
| 구성 | 섹션 제목("자격증 & 수상") + 목록. 각 항목: Award 아이콘 + 이름 + 발급기관 + 취득일 |
| 인터랙션 | 없음 (정적 목록) |
| 데이터 | `NEXT_PUBLIC_CERTIFICATIONS`(JSON) |
| 기본값 | 정보처리기사, SQLD, 해커톤 수상 데모 3개 |

### 3.7 PDF 다운로드 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 자격증/수상 아래 |
| 구성 | 그라데이션 배경(blue→indigo) + "이력서 전체 보기" 텍스트 + "PDF 다운로드" 버튼(Download 아이콘, 화이트) |
| 인터랙션 | 버튼 클릭 시 PDF 파일 다운로드 (`<a download>`). 호버 시 scale(1.05) |
| 데이터 | `NEXT_PUBLIC_RESUME_URL` |
| 기본값 | 미설정 시 "PDF 준비 중" 텍스트 표시, 버튼 비활성 |

### 3.8 Contact 섹션 (푸터)

| 항목 | 설명 |
|------|------|
| 위치 | 페이지 최하단 |
| 구성 | 이메일 + 전화 + GitHub + LinkedIn 아이콘 링크(가로 배치) + "Powered by Linkmap" |
| 인터랙션 | 각 아이콘 클릭 시 해당 링크로 이동 |
| 데이터 | `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_PHONE` |
| 기본값 | 이메일 링크 + "Powered by Linkmap" |

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:----:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 이름 | O | `"김하은"` |
| `NEXT_PUBLIC_TITLE` | 직함/목표 직무 | | `"프론트엔드 개발자"` |
| `NEXT_PUBLIC_EMAIL` | 이메일 주소 | | `"haeun@example.com"` |
| `NEXT_PUBLIC_PHONE` | 전화번호 | | (미설정 시 숨김) |
| `NEXT_PUBLIC_ABOUT` | 자기소개 텍스트 | | 데모 자기소개 2~3문장 |
| `NEXT_PUBLIC_AVATAR_URL` | 프로필 사진 URL | | 기본 아바타 플레이스홀더 |
| `NEXT_PUBLIC_EXPERIENCE` | 경력 목록 (JSON) | | 인턴 1개 + 프로젝트 1개 데모 |
| `NEXT_PUBLIC_EDUCATION` | 학력 목록 (JSON) | | 대학교 1개 데모 |
| `NEXT_PUBLIC_SKILLS` | 스킬 목록 (JSON) | | Frontend/Backend/Tools 데모 |
| `NEXT_PUBLIC_PROJECTS` | 프로젝트 목록 (JSON) | | 프로젝트 3개 데모 |
| `NEXT_PUBLIC_CERTIFICATIONS` | 자격증/수상 (JSON) | | 3개 데모 |
| `NEXT_PUBLIC_RESUME_URL` | PDF 이력서 파일 URL | | (미설정 시 버튼 비활성) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | (미설정 시 비활성) |

---

## 5. 디자인 스펙

### 컬러 팔레트

| 용도 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경 (primary) | `#FFFFFF` | `#0F172A` (slate-900) |
| 배경 (card) | `#FFFFFF` | `#1E293B` (slate-800) |
| 배경 (alt) | `#F8FAFC` (slate-50) | `#1E293B` (slate-800) |
| 텍스트 (primary) | `#0F172A` (slate-900) | `#F1F5F9` (slate-100) |
| 텍스트 (secondary) | `#64748B` (slate-500) | `#94A3B8` (slate-400) |
| 악센트 (경력) | `#2563EB` (blue-600) | `#60A5FA` (blue-400) |
| 악센트 (교육) | `#16A34A` (green-600) | `#4ADE80` (green-400) |
| 타임라인 선 | `#BFDBFE` (blue-200) | `#1E3A5F` (blue-900) |
| 기간 뱃지 배경 | `#DBEAFE` (blue-100) | `#1E3A5F` (blue-900) |
| 프로그레스 바 배경 | `#E2E8F0` (slate-200) | `#334155` (slate-700) |
| 프로그레스 바 채움 | `blue-500` → `blue-600` 그라데이션 | `blue-400` → `blue-500` 그라데이션 |
| 기술 태그 | `#EFF6FF` (blue-50), 텍스트 `blue-700` | `#1E3A5F`, 텍스트 `blue-300` |
| 보더 | `#E2E8F0` (slate-200) | `#334155` (slate-700) |

### 타이포그래피

| 요소 | 크기 | 굵기 | 비고 |
|------|------|------|------|
| 이름 (h1) | 40px (모바일 32px) | 800 | Pretendard |
| 직함 | 20px (모바일 16px) | 400 | Pretendard |
| 섹션 제목 (h2) | 28px (모바일 22px) | 700 | Pretendard |
| 기관명/회사명 | 20px | 700 | Pretendard |
| 역할/직책 | 16px | 600 | Pretendard |
| 본문 | 16px | 400 | Pretendard |
| 기술 태그 | 13px | 500 | Inter |
| 기간 뱃지 | 14px | 600 | Inter |
| 스킬 레벨 % | 14px | 600 | Inter |

### 레이아웃

- **컨테이너**: `max-w-4xl` (896px) - 이력서 적합 너비
- **섹션 간격**: `py-12` ~ `py-16` (48~64px)
- **타임라인**: 중앙 세로선 2px, 좌우 카드 패딩 24px
- **프로그레스 바**: 높이 8px, `rounded-full`
- **프로젝트 그리드**: `grid-cols-1 md:grid-cols-2`
- **카드 라운드**: `rounded-xl` (12px)
- **카드 그림자**: `shadow-sm` (호버 시 `shadow-md`)
- **프린트**: `@media print` - 배경색 제거, 링크 URL 표시, A4 최적화

### 반응형 브레이크포인트

| 브레이크포인트 | 너비 | 레이아웃 변화 |
|------------|------|------------|
| 모바일 | 360px+ | 싱글 컬럼, 타임라인 세로, 프로젝트 1열 |
| 태블릿 | 768px+ | About 가로 배치, 프로젝트 2열 |
| 데스크톱 | 1024px+ | 타임라인 좌우 교차, max-w-4xl 중앙 |
| 와이드 | 1440px+ | 동일 (과도한 확장 방지) |

### 프린트 스타일

```css
@media print {
  /* 숨길 요소 */
  .theme-toggle, .print-hide { display: none !important; }

  /* 배경/그림자 제거 */
  * { background: white !important; box-shadow: none !important; }

  /* A4 최적화 */
  body { font-size: 12pt; line-height: 1.4; }

  /* 링크 URL 표시 */
  a[href]::after { content: " (" attr(href) ")"; font-size: 10pt; color: #666; }

  /* 페이지 브레이크 */
  .section { page-break-inside: avoid; }
}
```

---

## 6. 컴포넌트 구조

### 파일 트리

```
linkmap-templates/resume-site/
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   ├── resume.pdf              # 기본 PDF (데모용, 사용자가 교체)
│   └── images/
│       └── avatar-default.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트, 테마, GA, 프린트 CSS
│   │   ├── page.tsx                # 메인 페이지 (섹션 조합)
│   │   └── api/
│   │       └── og/
│   │           └── route.tsx       # OG 이미지 (이름+직함)
│   ├── components/
│   │   ├── header-section.tsx      # 이름+직함+연락처 아이콘
│   │   ├── about-section.tsx       # 자기소개+프로필 사진
│   │   ├── timeline-section.tsx    # 경력+교육 타임라인 컨테이너
│   │   ├── timeline-item.tsx       # 개별 타임라인 카드 (좌/우)
│   │   ├── skills-section.tsx      # 스킬 차트 컨테이너
│   │   ├── skill-category.tsx      # 카테고리별 스킬 그룹
│   │   ├── skill-bar.tsx           # 개별 프로그레스 바 (애니메이션)
│   │   ├── projects-section.tsx    # 프로젝트 카드 그리드
│   │   ├── project-card.tsx        # 개별 프로젝트 카드
│   │   ├── certifications-section.tsx # 자격증/수상 목록
│   │   ├── pdf-download-section.tsx   # PDF 다운로드 CTA
│   │   ├── contact-footer.tsx      # 연락처+Powered by Linkmap
│   │   ├── theme-toggle.tsx        # 다크모드 토글
│   │   └── theme-provider.tsx      # next-themes Provider
│   ├── hooks/
│   │   └── use-in-view.ts         # IntersectionObserver 커스텀 훅
│   └── lib/
│       ├── config.ts               # 환경변수 파싱 + 타입 + 기본값
│       └── constants.ts            # 기본 데모 데이터 상수
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### 컴포넌트 역할

| 컴포넌트 | 파일 | 역할 | Props |
|---------|------|------|-------|
| HeaderSection | `header-section.tsx` | 이름, 직함, 연락처 아이콘 바 | `name`, `title`, `email`, `phone` |
| AboutSection | `about-section.tsx` | 프로필 사진 + 자기소개 텍스트 | `avatarUrl`, `about` |
| TimelineSection | `timeline-section.tsx` | 경력+교육 타임라인 컨테이너 | `experience`, `education` |
| TimelineItem | `timeline-item.tsx` | 개별 타임라인 카드 (좌/우 교차) | `type`, `name`, `role`, `period`, `desc`, `tags`, `side` |
| SkillsSection | `skills-section.tsx` | 스킬 카테고리 그룹 컨테이너 | `skills` |
| SkillCategory | `skill-category.tsx` | 카테고리명 + 스킬 바 리스트 | `category`, `items` |
| SkillBar | `skill-bar.tsx` | 스킬명 + 레벨 % + 프로그레스 바 | `name`, `level` |
| ProjectsSection | `projects-section.tsx` | 프로젝트 카드 그리드 컨테이너 | `projects` |
| ProjectCard | `project-card.tsx` | 프로젝트 카드 (썸네일+설명+링크) | `title`, `desc`, `image`, `tags`, `githubUrl`, `demoUrl` |
| CertificationsSection | `certifications-section.tsx` | 자격증/수상 목록 | `certifications` |
| PdfDownloadSection | `pdf-download-section.tsx` | PDF 다운로드 CTA 버튼 | `resumeUrl` |
| ContactFooter | `contact-footer.tsx` | 연락처 아이콘 + Powered by Linkmap | `email`, `phone` |
| ThemeToggle | `theme-toggle.tsx` | 다크모드 토글 버튼 | - |
| ThemeProvider | `theme-provider.tsx` | next-themes Provider 래퍼 | `children` |
| useInView | `use-in-view.ts` | IntersectionObserver 커스텀 훅 | `options` |

---

## 7. 시드 데이터

### 7.1 SQL INSERT

```sql
-- Phase 2: 이력서 사이트 템플릿
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0009-4000-9000-000000000009',
  'resume-site',
  'Resume Site',
  '이력서 사이트',
  'Interactive resume with timeline, skill charts, project cards, and PDF download. Perfect for job seekers and career changers.',
  '인터랙티브 타임라인, 스킬 차트, 프로젝트 카드, PDF 다운로드를 갖춘 이력서 사이트. 취준생과 이직자에게 최적화.',
  NULL,
  'linkmap-templates', 'resume-site', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "이름", "required": true},
    {"key": "NEXT_PUBLIC_TITLE", "description": "직함/목표 직무", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "이메일 주소", "required": false},
    {"key": "NEXT_PUBLIC_PHONE", "description": "전화번호", "required": false},
    {"key": "NEXT_PUBLIC_ABOUT", "description": "자기소개 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_AVATAR_URL", "description": "프로필 사진 URL", "required": false},
    {"key": "NEXT_PUBLIC_EXPERIENCE", "description": "경력 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_EDUCATION", "description": "학력 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_SKILLS", "description": "스킬 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_PROJECTS", "description": "프로젝트 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_CERTIFICATIONS", "description": "자격증/수상 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_RESUME_URL", "description": "PDF 이력서 파일 URL", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['resume', 'cv', 'career', 'job-seeker', 'timeline', 'nextjs'],
  false, true, 9
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description,
  description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars,
  tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order,
  updated_at = now();
```

### 7.2 TypeScript 시드

```typescript
// src/data/homepage-templates.ts 에 추가

const TEMPLATE_IDS = {
  // ... 기존 IDs ...
  RESUME_SITE: 'b2c3d4e5-0009-4000-9000-000000000009',
};

// homepageTemplates 배열에 추가:
{
  id: TEMPLATE_IDS.RESUME_SITE,
  slug: 'resume-site',
  name: 'Resume Site',
  name_ko: '이력서 사이트',
  description: 'Interactive resume with timeline, skill charts, project cards, and PDF download. Perfect for job seekers and career changers.',
  description_ko: '인터랙티브 타임라인, 스킬 차트, 프로젝트 카드, PDF 다운로드를 갖춘 이력서 사이트. 취준생과 이직자에게 최적화.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'resume-site',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '이름', required: true },
    { key: 'NEXT_PUBLIC_TITLE', description: '직함/목표 직무', required: false },
    { key: 'NEXT_PUBLIC_EMAIL', description: '이메일 주소', required: false },
    { key: 'NEXT_PUBLIC_PHONE', description: '전화번호', required: false },
    { key: 'NEXT_PUBLIC_ABOUT', description: '자기소개 텍스트', required: false },
    { key: 'NEXT_PUBLIC_AVATAR_URL', description: '프로필 사진 URL', required: false },
    { key: 'NEXT_PUBLIC_EXPERIENCE', description: '경력 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_EDUCATION', description: '학력 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_SKILLS', description: '스킬 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_PROJECTS', description: '프로젝트 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_CERTIFICATIONS', description: '자격증/수상 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_RESUME_URL', description: 'PDF 이력서 파일 URL', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['resume', 'cv', 'career', 'job-seeker', 'timeline', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 9,
}
```

---

## 8. 검증 체크리스트

### 기능 검증

- [ ] 환경변수 미설정 시 주니어 개발자 데모 이력서가 올바르게 표시됨
- [ ] `NEXT_PUBLIC_SITE_NAME` 설정 시 이름이 모든 위치에 반영됨
- [ ] 헤더 연락처 아이콘이 올바른 링크로 연결됨 (mailto:, tel:, 외부 URL)
- [ ] About 섹션에 프로필 사진과 자기소개가 올바르게 표시됨
- [ ] 타임라인이 데스크톱에서 좌우 교차로 표시됨
- [ ] 타임라인이 모바일에서 세로 리스트로 표시됨
- [ ] 경력(blue)과 교육(green)이 색상으로 올바르게 구분됨
- [ ] 타임라인 카드가 뷰포트 진입 시 페이드인 애니메이션 동작
- [ ] 스킬 프로그레스 바가 뷰포트 진입 시 0%→목표% 채움 애니메이션 동작
- [ ] 스킬이 카테고리별로 올바르게 그룹핑됨
- [ ] 프로젝트 카드가 모바일 1열, 데스크톱 2열로 표시됨
- [ ] 프로젝트 카드의 GitHub/데모 링크가 새 탭으로 열림
- [ ] 자격증/수상이 목록 형태로 올바르게 표시됨
- [ ] PDF 다운로드 버튼 클릭 시 파일 다운로드 동작
- [ ] PDF URL 미설정 시 다운로드 버튼이 비활성 상태
- [ ] 다크모드 토글이 정상 동작하고 모든 섹션에 적용됨
- [ ] JSON 환경변수가 잘못된 형식일 때 기본값으로 폴백
- [ ] OG 이미지(`/api/og`)에 이름과 직함이 포함됨

### 성능 검증

- [ ] Lighthouse Performance 점수 90+
- [ ] Lighthouse Best Practices 점수 90+
- [ ] First Contentful Paint < 1.5초
- [ ] Largest Contentful Paint < 2.5초
- [ ] Cumulative Layout Shift < 0.1
- [ ] IntersectionObserver 기반 애니메이션이 부드럽게 동작 (60fps)
- [ ] 이미지 next/image 최적화 확인
- [ ] 번들 사이즈 200KB 미만 (gzip)

### 접근성 검증

- [ ] Lighthouse Accessibility 점수 90+
- [ ] 키보드만으로 모든 인터랙션 가능 (탭 순서, Enter/Space)
- [ ] 스크린리더로 타임라인 콘텐츠 순서대로 접근 가능
- [ ] 프로그레스 바에 `aria-valuenow`, `aria-valuemin`, `aria-valuemax` 설정
- [ ] 이미지에 적절한 alt 텍스트
- [ ] 색상 대비 WCAG 2.1 AA 준수
- [ ] `prefers-reduced-motion` 미디어 쿼리로 애니메이션 비활성화 지원
- [ ] `lang="ko"` 속성 설정됨

### SEO 검증

- [ ] Lighthouse SEO 점수 90+
- [ ] `<title>` 태그에 이름 + 직함 포함
- [ ] meta description에 자기소개 포함
- [ ] JSON-LD Person 스키마 포함 (이름, 직함, 이메일, 학력, 경력)
- [ ] OG 메타태그 (og:title, og:description, og:image) 설정
- [ ] LinkedIn 공유 시 OG 이미지 정상 표시
- [ ] `robots.txt` 생성됨
- [ ] `sitemap.xml` 생성됨

### 프린트 검증

- [ ] `Ctrl+P`로 인쇄 시 A4 용지에 깔끔하게 출력됨
- [ ] 다크모드 토글/애니메이션이 인쇄 시 숨겨짐
- [ ] 배경색/그림자가 인쇄 시 제거됨
- [ ] 링크 URL이 인쇄 시 텍스트로 표시됨
- [ ] 섹션이 페이지 중간에서 잘리지 않음 (`page-break-inside: avoid`)
