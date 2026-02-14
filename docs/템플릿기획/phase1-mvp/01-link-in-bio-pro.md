# 링크인바이오 프로 (Link-in-Bio Pro) 기획서

## 1. 개요

| 항목 | 내용 |
|------|------|
| 슬러그 | `link-in-bio-pro` |
| UUID | `b2c3d4e5-0003-4000-9000-000000000003` |
| 카테고리 | 링크인바이오 & 브랜딩 |
| 타겟 페르소나 | 인스타그램/유튜브/틱톡 크리에이터, 인플루언서 (페르소나: 콘텐츠 창작자 "민서", 24세) |
| 우선순위 | 1위 (총점 91/100) |
| Phase | Phase 1: MVP+ |
| 구현 일정 | 3일 |
| 비고 | 기존 `homepage-links` 의 상위 확장 버전 |

### 핵심 가치
- **자기표현**: SNS 프로필에 나만의 브랜딩된 링크 허브
- **사회적 승인**: 방문자 통계, SNS 공유 최적화
- **바이럴 엔진**: 인스타그램 바이오 링크 → 높은 자연 유입

---

## 2. AI 구현 프롬프트

> 이 섹션을 통째로 AI(Claude Code, Cursor 등)에 전달하면 템플릿을 구현할 수 있다.

```
## 컨텍스트
Linkmap(https://linkmap.vercel.app)의 원클릭 배포용 홈페이지 템플릿을 구현한다.
사용자가 GitHub 연결 → 템플릿 선택 → 환경변수 입력 → GitHub Pages 배포 3단계로 개인 링크인바이오 페이지를 생성한다.

## 템플릿: 링크인바이오 프로 (link-in-bio-pro)
- 타겟: 인스타그램/유튜브/틱톡 크리에이터, 인플루언서
- 카테고리: 링크인바이오 & 브랜딩
- 핵심 목적: SNS 프로필 링크 허브. 모든 SNS/콘텐츠 링크를 하나의 세련된 페이지에 모음

## 기술 스택
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- 폰트: Pretendard(한글) + Inter(영문) via next/font
- 아이콘: Lucide React
- 다크모드: next-themes
- SEO: next/metadata + JSON-LD
- OG 이미지: @vercel/og (/api/og)
- 배포: GitHub Pages (static export)

## 핵심 섹션
1. 프로필 영역: 프로필 사진 + 이름 + 바이오 (애니메이션 배경 그라데이션)
2. 링크 버튼 리스트: 아이콘 + 제목 + URL, hover 시 부드러운 스케일 애니메이션
3. 소셜 미디어 아이콘 바: 하단 고정, 주요 SNS 아이콘 그리드
4. 최신 콘텐츠 임베드 영역: 유튜브/인스타 임베드 (환경변수로 URL 주입)
5. 테마 선택: CSS 변수 기반 10+ 프리셋 테마 (neon, minimal, gradient, pastel, dark, ocean, sunset, forest, candy, monochrome)

## 디자인 스펙
- 모바일 중심 360px 최적화 (풀스크린 단일 페이지)
- 그라데이션/글래스모피즘 배경 옵션
- 부드러운 hover 애니메이션 (scale 1.02, duration 200ms)
- 다크/라이트 모드 자동 전환
- 컬러: CSS 변수 `--primary`, `--background`, `--foreground` 기반 테마
- 폰트 크기: 이름 2xl, 바이오 base, 링크 sm~base

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 사이트 이름/닉네임
- NEXT_PUBLIC_BIO: 소개 문구 (1~2줄)
- NEXT_PUBLIC_AVATAR_URL: 프로필 이미지 URL
- NEXT_PUBLIC_THEME: 테마 프리셋 이름 (기본: gradient)
- NEXT_PUBLIC_LINKS: 링크 목록 JSON ([{"title":"유튜브","url":"...","icon":"youtube"}])
- NEXT_PUBLIC_SOCIALS: SNS 링크 JSON ([{"platform":"instagram","url":"..."}])
- NEXT_PUBLIC_YOUTUBE_URL: 유튜브 영상 임베드 URL
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. `linkmap-templates/link-in-bio-pro` GitHub 레포에 Next.js 프로젝트 생성
2. 모든 개인화 데이터는 NEXT_PUBLIC_* 환경변수로 주입
3. 환경변수 미설정 시 매력적인 데모 데이터 표시
4. Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
5. 한국어 기본, lang="ko"
6. 반응형: 360px ~ 1440px
7. 다크모드 토글 포함
8. /api/og 엔드포인트로 동적 OG 이미지 생성
9. JSON-LD 구조화 데이터 (Person 타입)
10. 접근성: WCAG 2.1 AA, 키보드 내비게이션
```

---

## 3. 핵심 섹션 정의

### 섹션 1: 프로필 영역
- **위치**: 페이지 최상단 (센터 정렬)
- **구성**: 원형 아바타(96px) + 이름(2xl bold) + 바이오(base, 최대 2줄)
- **배경**: 풀스크린 그라데이션 애니메이션 (CSS @keyframes, 15s infinite)
- **글래스모피즘**: `backdrop-blur-sm`, `bg-white/20`, `border border-white/30`

### 섹션 2: 링크 버튼 리스트
- **위치**: 프로필 아래 (max-w-md, 센터)
- **구성**: 각 링크 = 카드(rounded-xl) + 아이콘 + 제목
- **인터랙션**: hover → `scale-[1.02]`, `bg-white/30`, transition 200ms
- **데이터**: `NEXT_PUBLIC_LINKS` JSON 파싱, 미설정 시 데모 링크 4개 표시

### 섹션 3: 소셜 미디어 아이콘 바
- **위치**: 링크 리스트 아래 (센터, flex gap-4)
- **구성**: Lucide 아이콘 (Instagram, Youtube, Twitter, Github, Linkedin 등)
- **인터랙션**: hover → `text-white`, transition-colors
- **데이터**: `NEXT_PUBLIC_SOCIALS` JSON 파싱

### 섹션 4: 최신 콘텐츠 임베드
- **위치**: 소셜 아이콘 아래 (선택 표시)
- **구성**: 유튜브 iframe 임베드 (aspect-ratio 16/9)
- **조건**: `NEXT_PUBLIC_YOUTUBE_URL` 설정 시에만 표시

### 섹션 5: 푸터
- **위치**: 페이지 최하단
- **구성**: "Powered by Linkmap" + 다크모드 토글
- **스타일**: `text-white/40 text-xs`

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:---:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 사이트 이름/닉네임 | O | `'내 링크 페이지'` |
| `NEXT_PUBLIC_BIO` | 소개 문구 | | `'안녕하세요! 여기서 저의 모든 링크를 확인하세요.'` |
| `NEXT_PUBLIC_AVATAR_URL` | 프로필 이미지 URL | | `null` (이니셜 아바타 표시) |
| `NEXT_PUBLIC_THEME` | 테마 프리셋 | | `'gradient'` |
| `NEXT_PUBLIC_LINKS` | 링크 목록 (JSON) | | 데모 링크 4개 |
| `NEXT_PUBLIC_SOCIALS` | SNS 링크 (JSON) | | `[]` |
| `NEXT_PUBLIC_YOUTUBE_URL` | 유튜브 임베드 URL | | `null` (미표시) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | `null` (미추적) |

---

## 5. 디자인 스펙

### 컬러 (테마별 CSS 변수)

| 테마 | --primary | --background-from | --background-to |
|------|-----------|-------------------|-----------------|
| gradient | `#ec4899` | `#8b5cf6` → `#ec4899` → `#f97316` |  |
| neon | `#22d3ee` | `#0f172a` | `#1e293b` |
| minimal | `#1f2937` | `#ffffff` | `#f3f4f6` |
| pastel | `#f472b6` | `#fce7f3` | `#dbeafe` |
| dark | `#a78bfa` | `#0f172a` | `#1e1b4b` |
| ocean | `#06b6d4` | `#164e63` | `#0c4a6e` |
| sunset | `#f59e0b` | `#7c2d12` | `#78350f` |
| forest | `#22c55e` | `#14532d` | `#1a2e05` |
| candy | `#f472b6` | `#fdf2f8` | `#fce7f3` |
| monochrome | `#6b7280` | `#111827` | `#1f2937` |

### 타이포그래피
- 이름: `text-2xl font-bold` (Pretendard)
- 바이오: `text-base text-white/80` (Pretendard)
- 링크 텍스트: `text-sm sm:text-base` (Inter/Pretendard)

### 레이아웃
- 전체: `min-h-screen flex flex-col items-center justify-center p-4`
- 콘텐츠 영역: `w-full max-w-md mx-auto`

### 반응형 브레이크포인트
- 360px (모바일): 기본 레이아웃, 패딩 p-4
- 640px (sm): 링크 텍스트 크기 증가
- 768px (md): 불필요 (단일 열 유지)
- 1024px+: max-w-md 고정, 센터 정렬

---

## 6. 컴포넌트 구조

```
linkmap-templates/link-in-bio-pro/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트(Pretendard+Inter), ThemeProvider
│   │   ├── page.tsx                # 메인 페이지 (서버 컴포넌트 → 클라이언트 래핑)
│   │   └── api/og/route.tsx        # OG 이미지 동적 생성
│   ├── components/
│   │   ├── profile-section.tsx     # 아바타 + 이름 + 바이오
│   │   ├── link-list.tsx           # 링크 버튼 목록
│   │   ├── social-bar.tsx          # 소셜 미디어 아이콘
│   │   ├── content-embed.tsx       # 유튜브/인스타 임베드
│   │   ├── theme-toggle.tsx        # 다크모드 토글 버튼
│   │   └── footer.tsx              # Powered by Linkmap
│   └── lib/
│       ├── config.ts               # 환경변수 파싱 + 타입 안전 config
│       └── themes.ts               # 10개 테마 프리셋 정의
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
| `profile-section.tsx` | Client | 아바타, 이름, 바이오 렌더링 + 배경 애니메이션 |
| `link-list.tsx` | Client | LINKS JSON 파싱, 링크 카드 렌더링 |
| `social-bar.tsx` | Client | SOCIALS JSON 파싱, 아이콘 렌더링 |
| `content-embed.tsx` | Client | 유튜브 iframe 조건부 렌더링 |
| `theme-toggle.tsx` | Client | next-themes 토글 버튼 |
| `footer.tsx` | Server | 정적 푸터 텍스트 |
| `config.ts` | Util | `process.env.NEXT_PUBLIC_*` → 타입 안전 객체 |
| `themes.ts` | Util | 테마별 CSS 변수 매핑 객체 |

---

## 7. 시드 데이터

### 7.1 SQL INSERT (homepage_templates)

```sql
INSERT INTO homepage_templates (
  id, slug, name, name_ko, description, description_ko,
  preview_image_url, github_owner, github_repo, default_branch,
  framework, required_env_vars, tags, is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0003-4000-9000-000000000003',
  'link-in-bio-pro',
  'Link-in-Bio Pro',
  '링크인바이오 프로',
  'SNS profile link hub with animated backgrounds, custom themes, and visitor stats. Linktree alternative with full code ownership.',
  'SNS 프로필 링크 허브. 애니메이션 배경, 커스텀 테마, 방문자 통계. 코드 완전 소유 Linktree 대안.',
  NULL,
  'linkmap-templates',
  'link-in-bio-pro',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "사이트 이름/닉네임", "required": true},
    {"key": "NEXT_PUBLIC_BIO", "description": "소개 문구", "required": false},
    {"key": "NEXT_PUBLIC_AVATAR_URL", "description": "프로필 이미지 URL", "required": false},
    {"key": "NEXT_PUBLIC_THEME", "description": "테마 프리셋 (gradient/neon/minimal/...)", "required": false},
    {"key": "NEXT_PUBLIC_LINKS", "description": "링크 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_SOCIALS", "description": "SNS 링크 JSON", "required": false},
    {"key": "NEXT_PUBLIC_YOUTUBE_URL", "description": "유튜브 임베드 URL", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['link-in-bio', 'social', 'creator', 'animated', 'themes', 'nextjs'],
  false,
  true,
  3
) ON CONFLICT (slug) DO NOTHING;
```

### 7.2 TypeScript 시드 (`homepage-templates.ts` 추가분)

```typescript
{
  id: 'b2c3d4e5-0003-4000-9000-000000000003',
  slug: 'link-in-bio-pro',
  name: 'Link-in-Bio Pro',
  name_ko: '링크인바이오 프로',
  description: 'SNS profile link hub with animated backgrounds, custom themes, and visitor stats. Linktree alternative with full code ownership.',
  description_ko: 'SNS 프로필 링크 허브. 애니메이션 배경, 커스텀 테마, 방문자 통계. 코드 완전 소유 Linktree 대안.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'link-in-bio-pro',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '사이트 이름/닉네임', required: true },
    { key: 'NEXT_PUBLIC_BIO', description: '소개 문구', required: false },
    { key: 'NEXT_PUBLIC_AVATAR_URL', description: '프로필 이미지 URL', required: false },
    { key: 'NEXT_PUBLIC_THEME', description: '테마 프리셋 (gradient/neon/minimal/...)', required: false },
    { key: 'NEXT_PUBLIC_LINKS', description: '링크 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_SOCIALS', description: 'SNS 링크 JSON', required: false },
    { key: 'NEXT_PUBLIC_YOUTUBE_URL', description: '유튜브 임베드 URL', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['link-in-bio', 'social', 'creator', 'animated', 'themes', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 3,
}
```

---

## 8. 검증 체크리스트

### 기능
- [ ] 프로필 사진, 이름, 바이오 정상 표시
- [ ] 링크 버튼 클릭 시 새 탭에서 열림
- [ ] 소셜 미디어 아이콘 클릭 동작
- [ ] 유튜브 임베드 조건부 표시
- [ ] 10개 테마 프리셋 전환 동작
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
- [ ] 링크에 적절한 alt/title 속성

### SEO
- [ ] OG 메타태그 정상 생성
- [ ] JSON-LD Person 구조화 데이터
- [ ] /api/og 이미지 생성 확인
- [ ] robots.txt 존재
