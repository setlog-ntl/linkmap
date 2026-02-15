# 뉴스레터 랜딩 (Newsletter Landing) 기획서

## 1. 개요

| 항목 | 내용 |
|------|------|
| 슬러그 | `newsletter-landing` |
| UUID | `b2c3d4e5-0019-4000-9000-000000000019` |
| 카테고리 | Creator |
| 타겟 페르소나 | 뉴스레터 작가, 콘텐츠 크리에이터 |
| 우선순위 | 11위 (총점 80/100) |
| Phase | Phase 3: 확장·니치 |
| 구현 일정 | 3일 |
| 비고 | 뉴스레터 아카이브+구독CTA+작가소개. Substack/Beehiiv 대안 랜딩 |

### 핵심 가치
- **구독자 전환**: 강력한 CTA와 사회적 증거(구독자 수, 추천사)로 구독 전환 극대화
- **콘텐츠 아카이브**: 과거 뉴스레터를 아카이브하여 SEO 유입 + 신뢰 구축
- **플랫폼 독립**: Substack에 종속되지 않는 나만의 뉴스레터 랜딩 페이지
- **작가 브랜딩**: 작가 소개, 출연 이력, 추천사로 전문성 어필

### 선정 근거
- 크리에이터 이코노미 $250억(2025), 95% D2F(Direct-to-Fan) 전환
- 뉴스레터 구독 모델 급성장 (Substack, Beehiiv, Ghost)
- "무료 뉴스레터 → 유료 전환" 비즈니스 모델 확산

---

## 2. AI 구현 프롬프트

> 이 섹션을 통째로 AI(Claude Code, Cursor 등)에 전달하면 템플릿을 구현할 수 있다.

```
## 컨텍스트
Linkmap(https://linkmap.vercel.app)의 원클릭 배포용 홈페이지 템플릿을 구현한다.
사용자가 GitHub 연결 → 템플릿 선택 → 환경변수 입력 → GitHub Pages 배포 3단계로 뉴스레터 랜딩 페이지를 생성한다.

## 템플릿: 뉴스레터 랜딩 (newsletter-landing)
- 타겟: 뉴스레터 작가, 콘텐츠 크리에이터
- 카테고리: Creator
- 핵심 목적: 뉴스레터 구독 CTA + 아카이브 + 작가 소개. Substack/Beehiiv 대안 랜딩 페이지

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 폰트: Pretendard(한글) + Inter(영문) via next/font
- 아이콘: Lucide React
- 다크모드: next-themes
- SEO: next/metadata + JSON-LD
- OG 이미지: @vercel/og (/api/og)
- 배포: GitHub Pages (static export)

## 핵심 섹션
1. 히어로: 뉴스레터 제목 + 한줄 소개 + 구독자 수 뱃지 + 이메일 구독 폼(CTA)
2. 인기 글: 최근/인기 뉴스레터 카드 3~6개 (제목+요약+날짜+읽기시간)
3. 작가 소개: 프로필 사진 + 이름 + 바이오 + 출연/집필 이력
4. 추천사: 독자/업계 추천 인용문 카드 (캐러셀 or 그리드)
5. 아카이브: 전체 뉴스레터 목록 (날짜순, 검색 가능)
6. 구독 CTA (반복): 페이지 중간/하단에 구독 폼 반복 배치
7. 푸터: SNS 링크(트위터/LinkedIn) + "Powered by Linkmap"

## 디자인 스펙
- 클린+미니멀 디자인 (뉴스레터 콘텐츠 중심)
- 서체 중심 레이아웃: 큰 제목, 넉넉한 행간, 최적 가독폭
- 컬러: 모노톤 베이스 + 포인트 컬러 1색 (CTA에 집중)
  - Primary: indigo-600 (#4f46e5) / Dark: indigo-400 (#818cf8)
  - Background: white / Dark: slate-950
  - Surface: slate-50 / Dark: slate-900
  - CTA: indigo-600 hover:indigo-700 / Dark: indigo-500 hover:indigo-400
- 폰트: 뉴스레터 제목 4xl~5xl bold, 글 제목 xl semibold, 본문 base, 읽기시간 xs
- 레이아웃: max-w-2xl (좁은 리딩 폭, 뉴스레터 느낌), py-16 섹션 간격
- 구독 폼: 큰 이메일 입력 필드 + CTA 버튼, 구독자 수 소셜 프루프

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 뉴스레터 제목
- NEXT_PUBLIC_TAGLINE: 한줄 소개
- NEXT_PUBLIC_SUBSCRIBER_COUNT: 구독자 수 텍스트 (예: "3,200명")
- NEXT_PUBLIC_SUBSCRIBE_URL: 구독 폼 액션 URL (Substack/Beehiiv/Mailchimp 구독 URL)
- NEXT_PUBLIC_AUTHOR_NAME: 작가 이름
- NEXT_PUBLIC_AUTHOR_BIO: 작가 소개
- NEXT_PUBLIC_AUTHOR_AVATAR_URL: 작가 프로필 사진 URL
- NEXT_PUBLIC_AUTHOR_CREDENTIALS: 출연/집필 이력 JSON
- NEXT_PUBLIC_FEATURED_POSTS: 인기/최근 글 JSON ([{"title":"..","summary":"..","url":"..","date":"..","read_time":"5분"}])
- NEXT_PUBLIC_ARCHIVE_POSTS: 전체 아카이브 JSON
- NEXT_PUBLIC_TESTIMONIALS: 추천사 JSON ([{"quote":"..","author":"..","role":".."}])
- NEXT_PUBLIC_TWITTER_URL: 트위터/X 프로필
- NEXT_PUBLIC_LINKEDIN_URL: LinkedIn 프로필
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. `linkmap-templates/newsletter-landing` GitHub 레포에 Next.js 프로젝트 생성
2. 모든 개인화 데이터는 NEXT_PUBLIC_* 환경변수로 주입
3. 환경변수 미설정 시 가상의 테크 뉴스레터 데모 데이터 표시
4. Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
5. 한국어 기본, lang="ko"
6. 반응형: 360px ~ 1440px
7. 다크모드 토글 포함
8. /api/og 엔드포인트로 뉴스레터 제목+구독자 수가 포함된 OG 이미지 생성
9. JSON-LD 구조화 데이터 (WebSite + NewsArticle 타입)
10. 접근성: WCAG 2.1 AA, 키보드 내비게이션
11. 구독 폼은 외부 URL로 리다이렉트 (Substack/Beehiiv 호환)
12. 아카이브 검색은 클라이언트 사이드 필터링
```

---

## 3. 핵심 섹션 정의

### 섹션 1: 히어로
- **위치**: 페이지 최상단 (py-20, 센터 정렬)
- **구성**: 뉴스레터 제목(4xl~5xl bold) + 한줄 소개(xl text-muted) + 구독자 수 뱃지(sm, "3,200명이 읽고 있어요") + 이메일 입력 폼 + "구독하기" CTA 버튼
- **구독 폼**: `<form>` → `NEXT_PUBLIC_SUBSCRIBE_URL`로 이메일 파라미터 전송
- **소셜 프루프**: 구독자 수 뱃지 + 아바타 스택(선택)
- **스타일**: 큰 여백, 센터 정렬, CTA 버튼 `bg-indigo-600 text-white rounded-lg px-8 py-3 text-lg`

### 섹션 2: 인기 글
- **위치**: 히어로 아래 (py-16)
- **구성**: 섹션 제목 "인기 글"(2xl bold) + 글 카드 3~6개
- **카드**: 날짜(xs text-muted) + 제목(xl font-semibold hover:text-indigo-600) + 요약(base, 2줄 truncate) + 읽기시간(xs)
- **인터랙션**: 카드 클릭 → 외부 뉴스레터 URL로 이동 (새 탭)
- **데이터**: `NEXT_PUBLIC_FEATURED_POSTS` JSON

### 섹션 3: 작가 소개
- **위치**: 인기 글 아래 (py-16, bg-slate-50/dark:bg-slate-900)
- **구성**: 프로필 사진(96px rounded-full) + 이름(2xl bold) + 바이오(base leading-relaxed) + 출연/집필 이력(xs, 태그 형태)
- **데이터**: `NEXT_PUBLIC_AUTHOR_*` 변수들

### 섹션 4: 추천사
- **위치**: 작가 소개 아래 (py-16)
- **구성**: 섹션 제목 "독자 추천"(2xl bold) + 인용문 카드 그리드(md:grid-cols-2)
- **카드**: 큰따옴표 아이콘 + 인용문(italic, lg) + 이름(font-medium) + 역할(text-muted)
- **데이터**: `NEXT_PUBLIC_TESTIMONIALS` JSON

### 섹션 5: 아카이브
- **위치**: 추천사 아래 (py-16)
- **구성**: 섹션 제목 "아카이브"(2xl bold) + 검색 입력 필드 + 글 리스트(날짜순)
- **리스트 항목**: 날짜(font-mono text-sm) + 제목(hover:text-indigo-600) + 읽기시간
- **검색**: 클라이언트 사이드, 제목 키워드 필터링
- **데이터**: `NEXT_PUBLIC_ARCHIVE_POSTS` JSON

### 섹션 6: 하단 구독 CTA
- **위치**: 아카이브 아래 (py-20, 배경 강조)
- **구성**: "아직 구독 안 하셨나요?" 텍스트 + 이메일 폼 (히어로와 동일)
- **스타일**: `bg-indigo-50 dark:bg-indigo-950/30`, CTA 반복으로 전환율 극대화

### 섹션 7: 푸터
- **위치**: 페이지 최하단
- **구성**: SNS 아이콘(트위터, LinkedIn) + 다크모드 토글 + "Powered by Linkmap"
- **스타일**: `text-slate-500 text-sm border-t py-8`

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:---:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 뉴스레터 제목 | O | `'테크 인사이트'` |
| `NEXT_PUBLIC_TAGLINE` | 한줄 소개 | | `'매주 월요일, 놓치면 안 되는 테크 트렌드'` |
| `NEXT_PUBLIC_SUBSCRIBER_COUNT` | 구독자 수 텍스트 | | `'3,200명'` |
| `NEXT_PUBLIC_SUBSCRIBE_URL` | 구독 폼 URL | | `null` (폼 비활성화, 데모 알림) |
| `NEXT_PUBLIC_AUTHOR_NAME` | 작가 이름 | | `'김작가'` |
| `NEXT_PUBLIC_AUTHOR_BIO` | 작가 소개 | | 데모 바이오 텍스트 |
| `NEXT_PUBLIC_AUTHOR_AVATAR_URL` | 프로필 사진 URL | | `null` (이니셜 아바타) |
| `NEXT_PUBLIC_AUTHOR_CREDENTIALS` | 출연/집필 이력 (JSON) | | 데모 이력 3개 |
| `NEXT_PUBLIC_FEATURED_POSTS` | 인기/최근 글 (JSON) | | 데모 글 4개 |
| `NEXT_PUBLIC_ARCHIVE_POSTS` | 전체 아카이브 (JSON) | | 데모 글 12개 |
| `NEXT_PUBLIC_TESTIMONIALS` | 추천사 (JSON) | | 데모 추천 3개 |
| `NEXT_PUBLIC_TWITTER_URL` | 트위터/X URL | | `null` (미표시) |
| `NEXT_PUBLIC_LINKEDIN_URL` | LinkedIn URL | | `null` (미표시) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | `null` (미추적) |

---

## 5. 디자인 스펙

### 컬러

| 용도 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경 | `#ffffff` (white) | `#020617` (slate-950) |
| Surface | `#f8fafc` (slate-50) | `#0f172a` (slate-900) |
| 텍스트 (주) | `#0f172a` (slate-900) | `#f1f5f9` (slate-100) |
| 텍스트 (보조) | `#64748b` (slate-500) | `#94a3b8` (slate-400) |
| CTA 버튼 | `#4f46e5` (indigo-600) | `#818cf8` (indigo-400) |
| CTA hover | `#4338ca` (indigo-700) | `#6366f1` (indigo-500) |
| 링크 hover | `#4f46e5` (indigo-600) | `#818cf8` (indigo-400) |
| 보더 | `#e2e8f0` (slate-200) | `#334155` (slate-700) |
| 구독 배경 | `#eef2ff` (indigo-50) | `#1e1b4b/30` (indigo-950/30) |

### 타이포그래피
- 뉴스레터 제목: `text-4xl sm:text-5xl font-bold tracking-tight` (Pretendard)
- 한줄 소개: `text-xl text-slate-500` (Pretendard)
- 글 제목: `text-xl font-semibold` (Pretendard)
- 글 요약: `text-base text-slate-600 leading-relaxed` (Pretendard)
- 인용문: `text-lg italic leading-relaxed` (Pretendard)
- 날짜/읽기시간: `text-xs font-mono text-slate-400` (시스템 모노)
- 작가 이름: `text-2xl font-bold` (Pretendard)
- CTA 버튼: `text-lg font-semibold` (Pretendard)

### 레이아웃
- 전체: `max-w-2xl mx-auto px-4 sm:px-6` (좁은 리딩 폭)
- 섹션 간격: `py-16`
- 구독 폼: `flex gap-2` (이메일 입력 + 버튼 가로 배치, 모바일에서 세로)

### 반응형
- 360px: 세로 구독 폼, 글 카드 1열
- 640px: 가로 구독 폼
- 768px: 추천사 2열 그리드
- 1024px+: max-w-2xl 고정

---

## 6. 컴포넌트 구조

```
linkmap-templates/newsletter-landing/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트, ThemeProvider
│   │   ├── page.tsx                # 메인 페이지
│   │   └── api/og/route.tsx        # OG 이미지 (제목+구독자 수)
│   ├── components/
│   │   ├── hero-section.tsx        # 제목+소개+구독폼+구독자 수
│   │   ├── subscribe-form.tsx      # 이메일 입력+CTA 버튼 (재사용)
│   │   ├── featured-posts.tsx      # 인기/최근 글 카드 리스트
│   │   ├── post-card.tsx           # 개별 글 카드
│   │   ├── author-section.tsx      # 작가 소개 (프로필+바이오+이력)
│   │   ├── testimonials.tsx        # 추천사 카드 그리드
│   │   ├── archive-section.tsx     # 아카이브 (검색+리스트)
│   │   ├── bottom-cta.tsx          # 하단 구독 CTA
│   │   ├── theme-toggle.tsx        # 다크모드 토글
│   │   └── footer.tsx              # SNS+Linkmap
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
| `layout.tsx` | Server | 메타데이터, 폰트, ThemeProvider, JSON-LD |
| `page.tsx` | Server | config 읽기, 섹션 조합 |
| `hero-section.tsx` | Server | 제목, 소개, 구독자 수, 구독 폼 영역 |
| `subscribe-form.tsx` | Client | 이메일 입력 + CTA, 외부 URL 리다이렉트 |
| `featured-posts.tsx` | Server | 인기 글 카드 리스트 |
| `post-card.tsx` | Server | 날짜+제목+요약+읽기시간, 외부 링크 |
| `author-section.tsx` | Server | 프로필 사진, 이름, 바이오, 이력 태그 |
| `testimonials.tsx` | Server | 추천사 인용문 카드 그리드 |
| `archive-section.tsx` | Client | 검색 입력 + 클라이언트 필터링 + 글 리스트 |
| `bottom-cta.tsx` | Server | 하단 반복 구독 CTA |
| `footer.tsx` | Server | SNS 아이콘, Powered by Linkmap |
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
  'b2c3d4e5-0019-4000-9000-000000000019',
  'newsletter-landing',
  'Newsletter Landing',
  '뉴스레터 랜딩',
  'Newsletter landing page with archive, subscribe CTA, author intro, and testimonials. Substack/Beehiiv alternative with full code ownership.',
  '뉴스레터 랜딩 페이지. 아카이브, 구독 CTA, 작가 소개, 추천사. 코드 완전 소유 Substack 대안.',
  NULL,
  'linkmap-templates',
  'newsletter-landing',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "뉴스레터 제목", "required": true},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "한줄 소개", "required": false},
    {"key": "NEXT_PUBLIC_SUBSCRIBER_COUNT", "description": "구독자 수 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_SUBSCRIBE_URL", "description": "구독 폼 액션 URL", "required": false},
    {"key": "NEXT_PUBLIC_AUTHOR_NAME", "description": "작가 이름", "required": false},
    {"key": "NEXT_PUBLIC_AUTHOR_BIO", "description": "작가 소개", "required": false},
    {"key": "NEXT_PUBLIC_AUTHOR_AVATAR_URL", "description": "작가 프로필 사진 URL", "required": false},
    {"key": "NEXT_PUBLIC_FEATURED_POSTS", "description": "인기/최근 글 JSON", "required": false},
    {"key": "NEXT_PUBLIC_ARCHIVE_POSTS", "description": "전체 아카이브 JSON", "required": false},
    {"key": "NEXT_PUBLIC_TESTIMONIALS", "description": "추천사 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['newsletter', 'creator', 'subscribe', 'archive', 'writing', 'nextjs'],
  false,
  true,
  13
) ON CONFLICT (slug) DO NOTHING;
```

### 7.2 TypeScript 시드 (`homepage-templates.ts` 추가분)

```typescript
{
  id: 'b2c3d4e5-0019-4000-9000-000000000019',
  slug: 'newsletter-landing',
  name: 'Newsletter Landing',
  name_ko: '뉴스레터 랜딩',
  description: 'Newsletter landing page with archive, subscribe CTA, author intro, and testimonials. Substack/Beehiiv alternative with full code ownership.',
  description_ko: '뉴스레터 랜딩 페이지. 아카이브, 구독 CTA, 작가 소개, 추천사. 코드 완전 소유 Substack 대안.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'newsletter-landing',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '뉴스레터 제목', required: true },
    { key: 'NEXT_PUBLIC_TAGLINE', description: '한줄 소개', required: false },
    { key: 'NEXT_PUBLIC_SUBSCRIBER_COUNT', description: '구독자 수 텍스트', required: false },
    { key: 'NEXT_PUBLIC_SUBSCRIBE_URL', description: '구독 폼 액션 URL', required: false },
    { key: 'NEXT_PUBLIC_AUTHOR_NAME', description: '작가 이름', required: false },
    { key: 'NEXT_PUBLIC_AUTHOR_BIO', description: '작가 소개', required: false },
    { key: 'NEXT_PUBLIC_AUTHOR_AVATAR_URL', description: '작가 프로필 사진 URL', required: false },
    { key: 'NEXT_PUBLIC_FEATURED_POSTS', description: '인기/최근 글 JSON', required: false },
    { key: 'NEXT_PUBLIC_ARCHIVE_POSTS', description: '전체 아카이브 JSON', required: false },
    { key: 'NEXT_PUBLIC_TESTIMONIALS', description: '추천사 JSON', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['newsletter', 'creator', 'subscribe', 'archive', 'writing', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 13,
}
```

---

## 8. 검증 체크리스트

### 기능
- [ ] 뉴스레터 제목, 소개, 구독자 수 정상 표시
- [ ] 구독 폼 이메일 입력 + CTA 버튼 동작
- [ ] 구독 폼 → 외부 URL로 이메일 파라미터 전송
- [ ] SUBSCRIBE_URL 미설정 시 데모 알림 표시
- [ ] 인기 글 카드 클릭 → 외부 URL 이동 (새 탭)
- [ ] 작가 소개 프로필+바이오+이력 정상 표시
- [ ] 추천사 인용문 카드 렌더링
- [ ] 아카이브 검색 (제목 키워드 필터링) 동작
- [ ] 하단 구독 CTA 폼 동작 (히어로와 동일)
- [ ] 환경변수 미설정 시 테크 뉴스레터 데모 데이터 표시
- [ ] 다크모드 토글 동작

### 성능
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 90+
- [ ] Lighthouse Best Practices 90+
- [ ] Lighthouse SEO 90+
- [ ] FCP < 1.5s, LCP < 2.5s, CLS < 0.1

### 접근성
- [ ] 키보드 내비게이션 (Tab, Enter)
- [ ] 스크린리더 호환 (aria-label, 폼 라벨)
- [ ] 컬러 대비 WCAG 2.1 AA
- [ ] 구독 폼 라벨 접근성

### SEO
- [ ] OG 메타태그 (뉴스레터 제목 + 구독자 수)
- [ ] JSON-LD WebSite + NewsArticle 구조화 데이터
- [ ] /api/og 이미지 생성 확인
- [ ] robots.txt + sitemap.xml 존재
