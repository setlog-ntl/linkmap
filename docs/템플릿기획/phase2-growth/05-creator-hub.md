# 크리에이터 허브 (Creator Hub) 기획서

## 1. 개요

| 항목 | 값 |
|------|-----|
| 슬러그 | `creator-hub` |
| UUID | `b2c3d4e5-0007-4000-9000-000000000007` |
| 카테고리 | 링크인바이오 & 브랜딩 |
| 타겟 | 유튜브/인스타/틱톡 크리에이터 (페르소나: 콘텐츠 창작자 "민서" 24세, 팔로워 5만) |
| 우선순위 | 5위 (총점 83/100) |
| Phase | Phase 2 - 성장 |
| 일정 | 3일 |
| 비고 | SNS 콘텐츠 통합 페이지, link-in-bio-pro보다 콘텐츠 중심 |

### 핵심 가치

**"모든 플랫폼의 내 콘텐츠를 한 곳에"**

- **SNS 콘텐츠 통합**: 유튜브, 인스타그램, 틱톡 콘텐츠를 하나의 페이지에서 보여줌
- **최신 콘텐츠 자동 표시**: 임베드 기반으로 항상 최신 콘텐츠 노출
- **플랫폼 독립**: 특정 SNS에 종속되지 않는 나만의 허브 페이지
- **비즈니스 문의 연결**: 브랜드 협업/광고 문의 경로 제공

### 심리적 동기

| 동기 | 설명 |
|------|------|
| 자기표현 | 크리에이터 아이덴티티를 하나의 페이지로 표현 |
| 통제감 | 플랫폼 독립 - 알고리즘에 의존하지 않는 나만의 공간 |

### 바이럴 전략

- SNS 프로필 링크(link-in-bio)로 자연 노출
- 팬 커뮤니티에서 공유 → 팬이 다른 크리에이터에게 추천
- 크리에이터 간 콜라보 페이지로 상호 링크

---

## 2. AI 구현 프롬프트

```
당신은 시니어 풀스택 개발자입니다. 아래 명세에 따라 크리에이터 허브 홈페이지 템플릿을 구현하세요.

## 컨텍스트
- 프로젝트: Linkmap 원클릭 배포용 홈페이지 템플릿
- 템플릿명: 크리에이터 허브 (Creator Hub)
- 슬러그: creator-hub
- 레포: linkmap-templates/creator-hub/
- 타겟: 유튜브/인스타/틱톡 크리에이터 (24세 콘텐츠 창작자 "민서", 팔로워 5만)
- 핵심 가치: SNS 콘텐츠 통합 페이지. 최신 콘텐츠 자동 표시. 비즈니스 문의 연결

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

## 핵심 섹션 (7개)
1. 히어로: 큰 아바타(160px) + 크리에이터명 + 채널 통계(구독자/팔로워 수 뱃지 3개). 비비드 그라데이션 배경
2. 최신 콘텐츠: 유튜브 영상 임베드 그리드 (모바일 1열, 데스크톱 2x2). iframe 기반. 썸네일+제목 표시
3. SNS 피드: 인스타그램 갤러리(이미지 그리드) + 틱톡 임베드(선택). 각 플랫폼 섹션에 해당 플랫폼 로고 표시
4. 콜라보/문의: "비즈니스 문의" CTA 버튼(mailto:) + 이메일 표시. 배경 그라데이션으로 시각적 강조
5. 굿즈/링크: 팬 굿즈, 멤버십, 기타 링크 카드 목록. 각 카드에 아이콘+이름+설명+외부 링크
6. 팬 커뮤니티: 디스코드/오픈카톡방 링크 버튼. 커뮤니티 인원 수 표시(선택)
7. 푸터: SNS 아이콘 바(유튜브, 인스타, 틱톡, 트위터) + "Powered by Linkmap" 링크

## 디자인 스펙
- 컬러: 비비드 컬러, 유튜브 레드(#FF0000)/인스타 그라데이션(#E1306C→#F77737→#FCAF45) 악센트
- 다크모드: 딥 퍼플/다크 기반 (#0F0A1A → #1A1025)
- 타이포: 크리에이터명 40~48px bold, 통계 숫자 24px bold (Inter), 본문 16px
- 레이아웃: max-w-3xl, 미디어 중심 (큰 썸네일, 넉넉한 여백)
- 아바타: 160px 원형, ring-4 그라데이션 보더 (인스타 스토리 링 스타일)
- 반응형: 360px → 768px → 1024px → 1440px
- 유튜브 임베드: 16:9 비율 유지, lazy loading

## 환경변수
- NEXT_PUBLIC_SITE_NAME (필수): 크리에이터 활동명
- NEXT_PUBLIC_BIO: 한줄 소개
- NEXT_PUBLIC_AVATAR_URL: 프로필 이미지 URL
- NEXT_PUBLIC_YOUTUBE_CHANNEL_URL: 유튜브 채널 URL
- NEXT_PUBLIC_YOUTUBE_VIDEOS (JSON): 유튜브 영상 목록 [{"id":"videoId","title":"제목"}]
- NEXT_PUBLIC_INSTAGRAM_URL: 인스타그램 프로필 URL
- NEXT_PUBLIC_TIKTOK_URL: 틱톡 프로필 URL
- NEXT_PUBLIC_SUBSCRIBER_COUNT: 구독자/팔로워 수 텍스트 (예: "5.2만")
- NEXT_PUBLIC_COLLAB_EMAIL: 비즈니스 문의 이메일
- NEXT_PUBLIC_MERCH_LINKS (JSON): 굿즈/링크 목록
- NEXT_PUBLIC_COMMUNITY_LINKS (JSON): 커뮤니티 링크 목록
- NEXT_PUBLIC_GA_ID: Google Analytics 4 ID

## 요구사항
1. 환경변수 미설정 시 가상의 크리에이터 데모 데이터 표시
2. src/lib/config.ts에서 환경변수를 타입 안전하게 파싱
3. JSON 환경변수는 try-catch로 안전하게 파싱, 실패 시 기본값 사용
4. Lighthouse 4개 카테고리 모두 90+ 달성
5. JSON-LD에 Person 스키마 포함
6. /api/og 엔드포인트로 크리에이터명 + 아바타가 포함된 OG 이미지 생성
7. 유튜브 iframe은 lazy loading + 16:9 비율 유지
8. 인스타그램 갤러리는 정적 이미지 그리드 (API 호출 없음, 이미지 URL 직접 제공)
9. 다크모드에서도 유튜브/인스타 임베드가 자연스럽게 보이도록 배경 처리
10. 모바일에서 SNS 통계 뱃지가 가로 스크롤 없이 줄바꿈됨
```

---

## 3. 핵심 섹션 정의

### 3.1 히어로 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 페이지 최상단 |
| 구성 | 큰 아바타(160px 원형, 그라데이션 링) + 크리에이터명(h1) + 한줄 소개(p) + 채널 통계 뱃지 3개(구독자/팔로워/영상 수) + 다크모드 토글 |
| 인터랙션 | 아바타 호버 시 ring 애니메이션(pulse). 통계 뱃지는 플랫폼 로고 + 숫자 |
| 데이터 | `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_BIO`, `NEXT_PUBLIC_AVATAR_URL`, `NEXT_PUBLIC_SUBSCRIBER_COUNT` |
| 기본값 | "크리에이터 민서", "일상과 리뷰를 공유합니다", 기본 아바타, "5.2만 구독자" |

### 3.2 최신 콘텐츠 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 히어로 아래 |
| 구성 | 섹션 제목("최신 영상") + 유튜브 영상 그리드(모바일 1열, 데스크톱 2x2). 각 카드: iframe 임베드 + 제목 |
| 인터랙션 | iframe 내 유튜브 플레이어 컨트롤. 제목 클릭 시 유튜브로 이동 |
| 데이터 | `NEXT_PUBLIC_YOUTUBE_VIDEOS`(JSON), `NEXT_PUBLIC_YOUTUBE_CHANNEL_URL` |
| 기본값 | 유튜브 인기 영상 ID 4개 (데모용) |
| 성능 | iframe `loading="lazy"` + `srcdoc` 패턴으로 초기 로드 최적화 |

### 3.3 SNS 피드 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 최신 콘텐츠 아래 |
| 구성 | 인스타그램 서브섹션(이미지 그리드 3x2) + 틱톡 서브섹션(임베드 or 링크). 각 플랫폼 로고 + "더보기" 링크 |
| 인터랙션 | 이미지 클릭 시 인스타 포스트로 이동 (새 탭) |
| 데이터 | `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_TIKTOK_URL` |
| 기본값 | 플레이스홀더 이미지 6장 |
| 참고 | 인스타 API 없이 정적 이미지 URL 사용 (사용자가 직접 설정) |

### 3.4 콜라보/문의 섹션

| 항목 | 설명 |
|------|------|
| 위치 | SNS 피드 아래 |
| 구성 | 그라데이션 배경 카드 + "비즈니스 문의" 제목 + 설명 텍스트 + CTA 버튼(mailto:) + 이메일 표시 |
| 인터랙션 | CTA 버튼 클릭 시 이메일 클라이언트 실행 |
| 데이터 | `NEXT_PUBLIC_COLLAB_EMAIL` |
| 기본값 | "collab@creator.com" |

### 3.5 굿즈/링크 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 콜라보/문의 아래 |
| 구성 | 링크 카드 리스트 (아이콘 + 이름 + 설명 + 화살표). 각 카드는 외부 링크 |
| 인터랙션 | 카드 클릭 시 외부 URL로 이동 (새 탭). 호버 시 배경 하이라이트 |
| 데이터 | `NEXT_PUBLIC_MERCH_LINKS`(JSON) |
| 기본값 | 굿즈샵, 멤버십, 후원 링크 3개 데모 |

### 3.6 팬 커뮤니티 섹션

| 항목 | 설명 |
|------|------|
| 위치 | 굿즈/링크 아래 |
| 구성 | 커뮤니티 링크 버튼 (디스코드 로고 + "디스코드 참여", 카카오톡 로고 + "오픈채팅 참여") |
| 인터랙션 | 버튼 클릭 시 해당 커뮤니티 초대 링크로 이동 |
| 데이터 | `NEXT_PUBLIC_COMMUNITY_LINKS`(JSON) |
| 기본값 | 디스코드 + 카카오 오픈채팅 데모 링크 2개 |

### 3.7 푸터

| 항목 | 설명 |
|------|------|
| 위치 | 페이지 최하단 |
| 구성 | SNS 아이콘 바(유튜브, 인스타그램, 틱톡, 트위터/X) + "Powered by Linkmap" |
| 인터랙션 | 각 아이콘 클릭 시 해당 SNS 프로필로 이동 |
| 데이터 | `NEXT_PUBLIC_YOUTUBE_CHANNEL_URL`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_TIKTOK_URL` |
| 기본값 | 아이콘만 표시, 링크 미설정 시 해당 아이콘 숨김 |

---

## 4. 환경변수 명세

| Key | 설명 | 필수 | 기본값 |
|-----|------|:----:|--------|
| `NEXT_PUBLIC_SITE_NAME` | 크리에이터 활동명 | O | `"크리에이터 민서"` |
| `NEXT_PUBLIC_BIO` | 한줄 소개 | | `"일상과 리뷰를 공유합니다"` |
| `NEXT_PUBLIC_AVATAR_URL` | 프로필 이미지 URL | | 기본 아바타 플레이스홀더 |
| `NEXT_PUBLIC_YOUTUBE_CHANNEL_URL` | 유튜브 채널 URL | | (미설정 시 유튜브 섹션 숨김) |
| `NEXT_PUBLIC_YOUTUBE_VIDEOS` | 유튜브 영상 목록 (JSON) | | 데모 영상 4개 |
| `NEXT_PUBLIC_INSTAGRAM_URL` | 인스타그램 프로필 URL | | (미설정 시 인스타 섹션 숨김) |
| `NEXT_PUBLIC_TIKTOK_URL` | 틱톡 프로필 URL | | (미설정 시 틱톡 섹션 숨김) |
| `NEXT_PUBLIC_SUBSCRIBER_COUNT` | 구독자/팔로워 수 텍스트 | | `"5.2만"` |
| `NEXT_PUBLIC_COLLAB_EMAIL` | 비즈니스 문의 이메일 | | `"collab@creator.com"` |
| `NEXT_PUBLIC_MERCH_LINKS` | 굿즈/링크 목록 (JSON) | | 데모 링크 3개 |
| `NEXT_PUBLIC_COMMUNITY_LINKS` | 커뮤니티 링크 목록 (JSON) | | 디스코드+카카오 데모 2개 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | | (미설정 시 비활성) |

---

## 5. 디자인 스펙

### 컬러 팔레트

| 용도 | 라이트 모드 | 다크 모드 |
|------|------------|----------|
| 배경 (primary) | `#FFFFFF` | `#0F0A1A` (딥 퍼플 블랙) |
| 배경 (card) | `#F8FAFC` (slate-50) | `#1A1025` (다크 퍼플) |
| 텍스트 (primary) | `#0F172A` (slate-900) | `#F8FAFC` (slate-50) |
| 텍스트 (secondary) | `#64748B` (slate-500) | `#94A3B8` (slate-400) |
| 악센트 (YouTube) | `#FF0000` | `#FF4444` |
| 악센트 (Instagram) | `#E1306C` → `#F77737` 그라데이션 | `#E1306C` → `#F77737` 그라데이션 |
| 악센트 (TikTok) | `#000000` / `#69C9D0` | `#FFFFFF` / `#69C9D0` |
| CTA 버튼 | `#7C3AED` (violet-600) | `#8B5CF6` (violet-500) |
| 보더 | `#E2E8F0` (slate-200) | `#2D2640` |

### 타이포그래피

| 요소 | 크기 | 굵기 | 비고 |
|------|------|------|------|
| 크리에이터명 (h1) | 48px (모바일 36px) | 800 | Pretendard |
| 구독자 수 | 24px (모바일 18px) | 700 | Inter (숫자) |
| 섹션 제목 (h2) | 28px (모바일 22px) | 700 | Pretendard |
| 영상 제목 | 16px | 600 | Pretendard |
| 본문 | 16px | 400 | Pretendard |
| 링크 카드 제목 | 16px | 600 | Pretendard |
| 캡션 | 14px | 400 | Pretendard |

### 레이아웃

- **컨테이너**: `max-w-3xl` (768px) - 미디어 콘텐츠 중심
- **섹션 간격**: `py-16` (64px)
- **아바타**: 160px, `rounded-full`, `ring-4` 그라데이션 보더
- **유튜브 그리드**: 모바일 1열, `md:grid-cols-2` (2x2)
- **인스타 그리드**: `grid-cols-3`, aspect-square
- **카드 라운드**: `rounded-2xl` (16px)
- **그림자**: `shadow-lg` (카드), 없음 (다크)

### 반응형 브레이크포인트

| 브레이크포인트 | 너비 | 레이아웃 변화 |
|------------|------|------------|
| 모바일 | 360px+ | 싱글 컬럼, 유튜브 1열, 인스타 3열 |
| 태블릿 | 768px+ | 유튜브 2x2 그리드, 통계 뱃지 가로 배치 |
| 데스크톱 | 1024px+ | max-w-3xl 중앙 정렬, 넉넉한 여백 |
| 와이드 | 1440px+ | 동일 (과도한 확장 방지) |

---

## 6. 컴포넌트 구조

### 파일 트리

```
linkmap-templates/creator-hub/
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   └── images/
│       └── avatar-default.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 메타데이터, 폰트, 테마, GA
│   │   ├── page.tsx                # 메인 페이지 (섹션 조합)
│   │   └── api/
│   │       └── og/
│   │           └── route.tsx       # OG 이미지 (크리에이터명+아바타)
│   ├── components/
│   │   ├── hero-section.tsx        # 아바타+이름+통계 뱃지
│   │   ├── stats-badge.tsx         # 개별 통계 뱃지 (로고+숫자)
│   │   ├── youtube-section.tsx     # 유튜브 영상 그리드
│   │   ├── youtube-embed.tsx       # 개별 유튜브 iframe (lazy)
│   │   ├── sns-feed-section.tsx    # 인스타+틱톡 피드
│   │   ├── instagram-grid.tsx      # 인스타 이미지 3x2 그리드
│   │   ├── collab-section.tsx      # 비즈니스 문의 CTA
│   │   ├── merch-links-section.tsx # 굿즈/링크 카드 리스트
│   │   ├── link-card.tsx           # 개별 링크 카드
│   │   ├── community-section.tsx   # 팬 커뮤니티 링크
│   │   ├── footer.tsx              # SNS 아이콘 바 + Linkmap
│   │   ├── theme-toggle.tsx        # 다크모드 토글
│   │   └── theme-provider.tsx      # next-themes Provider
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
| HeroSection | `hero-section.tsx` | 아바타, 크리에이터명, 소개, 통계 뱃지 | `name`, `bio`, `avatarUrl`, `subscriberCount` |
| StatsBadge | `stats-badge.tsx` | 플랫폼 로고 + 숫자 뱃지 | `platform`, `count`, `label` |
| YoutubeSection | `youtube-section.tsx` | 유튜브 영상 그리드 컨테이너 | `videos`, `channelUrl` |
| YoutubeEmbed | `youtube-embed.tsx` | 개별 유튜브 iframe (srcdoc lazy) | `videoId`, `title` |
| SnsFeedSection | `sns-feed-section.tsx` | 인스타+틱톡 피드 컨테이너 | `instagramUrl`, `tiktokUrl` |
| InstagramGrid | `instagram-grid.tsx` | 인스타 이미지 3x2 그리드 | `images`, `profileUrl` |
| CollabSection | `collab-section.tsx` | 비즈니스 문의 CTA 카드 | `email` |
| MerchLinksSection | `merch-links-section.tsx` | 굿즈/링크 카드 리스트 | `links` |
| LinkCard | `link-card.tsx` | 개별 링크 카드 (아이콘+이름+화살표) | `name`, `description`, `url`, `icon` |
| CommunitySection | `community-section.tsx` | 커뮤니티 링크 버튼들 | `links` |
| Footer | `footer.tsx` | SNS 아이콘 바 + Powered by Linkmap | `socialLinks` |
| ThemeToggle | `theme-toggle.tsx` | 다크모드 토글 버튼 | - |
| ThemeProvider | `theme-provider.tsx` | next-themes Provider 래퍼 | `children` |

---

## 7. 시드 데이터

### 7.1 SQL INSERT

```sql
-- Phase 2: 크리에이터 허브 템플릿
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0007-4000-9000-000000000007',
  'creator-hub',
  'Creator Hub',
  '크리에이터 허브',
  'All-in-one content hub for YouTubers, Instagrammers, and TikTokers. Embed latest videos, showcase your social feeds, and connect with fans.',
  '유튜브, 인스타그램, 틱톡 크리에이터를 위한 올인원 콘텐츠 허브. 최신 영상 임베드, SNS 피드 쇼케이스, 팬 커뮤니티 연결.',
  NULL,
  'linkmap-templates', 'creator-hub', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "크리에이터 활동명", "required": true},
    {"key": "NEXT_PUBLIC_BIO", "description": "한줄 소개", "required": false},
    {"key": "NEXT_PUBLIC_AVATAR_URL", "description": "프로필 이미지 URL", "required": false},
    {"key": "NEXT_PUBLIC_YOUTUBE_CHANNEL_URL", "description": "유튜브 채널 URL", "required": false},
    {"key": "NEXT_PUBLIC_YOUTUBE_VIDEOS", "description": "유튜브 영상 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_INSTAGRAM_URL", "description": "인스타그램 프로필 URL", "required": false},
    {"key": "NEXT_PUBLIC_TIKTOK_URL", "description": "틱톡 프로필 URL", "required": false},
    {"key": "NEXT_PUBLIC_SUBSCRIBER_COUNT", "description": "구독자/팔로워 수 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_COLLAB_EMAIL", "description": "비즈니스 문의 이메일", "required": false},
    {"key": "NEXT_PUBLIC_MERCH_LINKS", "description": "굿즈/링크 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_COMMUNITY_LINKS", "description": "커뮤니티 링크 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['creator', 'youtube', 'instagram', 'tiktok', 'content', 'social', 'nextjs'],
  false, true, 7
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
  CREATOR_HUB: 'b2c3d4e5-0007-4000-9000-000000000007',
};

// homepageTemplates 배열에 추가:
{
  id: TEMPLATE_IDS.CREATOR_HUB,
  slug: 'creator-hub',
  name: 'Creator Hub',
  name_ko: '크리에이터 허브',
  description: 'All-in-one content hub for YouTubers, Instagrammers, and TikTokers. Embed latest videos, showcase your social feeds, and connect with fans.',
  description_ko: '유튜브, 인스타그램, 틱톡 크리에이터를 위한 올인원 콘텐츠 허브. 최신 영상 임베드, SNS 피드 쇼케이스, 팬 커뮤니티 연결.',
  preview_image_url: null,
  github_owner: 'linkmap-templates',
  github_repo: 'creator-hub',
  default_branch: 'main',
  framework: 'nextjs',
  required_env_vars: [
    { key: 'NEXT_PUBLIC_SITE_NAME', description: '크리에이터 활동명', required: true },
    { key: 'NEXT_PUBLIC_BIO', description: '한줄 소개', required: false },
    { key: 'NEXT_PUBLIC_AVATAR_URL', description: '프로필 이미지 URL', required: false },
    { key: 'NEXT_PUBLIC_YOUTUBE_CHANNEL_URL', description: '유튜브 채널 URL', required: false },
    { key: 'NEXT_PUBLIC_YOUTUBE_VIDEOS', description: '유튜브 영상 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_INSTAGRAM_URL', description: '인스타그램 프로필 URL', required: false },
    { key: 'NEXT_PUBLIC_TIKTOK_URL', description: '틱톡 프로필 URL', required: false },
    { key: 'NEXT_PUBLIC_SUBSCRIBER_COUNT', description: '구독자/팔로워 수 텍스트', required: false },
    { key: 'NEXT_PUBLIC_COLLAB_EMAIL', description: '비즈니스 문의 이메일', required: false },
    { key: 'NEXT_PUBLIC_MERCH_LINKS', description: '굿즈/링크 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_COMMUNITY_LINKS', description: '커뮤니티 링크 목록 JSON', required: false },
    { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
  ],
  tags: ['creator', 'youtube', 'instagram', 'tiktok', 'content', 'social', 'nextjs'],
  is_premium: false,
  is_active: true,
  display_order: 7,
}
```

---

## 8. 검증 체크리스트

### 기능 검증

- [ ] 환경변수 미설정 시 가상 크리에이터 데모 데이터가 올바르게 표시됨
- [ ] `NEXT_PUBLIC_SITE_NAME` 설정 시 크리에이터명이 모든 위치에 반영됨
- [ ] 아바타 이미지가 160px 원형으로 올바르게 표시됨 (그라데이션 링 포함)
- [ ] 채널 통계 뱃지가 플랫폼 로고와 함께 표시됨
- [ ] 유튜브 영상 그리드가 올바르게 렌더링됨 (모바일 1열, 데스크톱 2x2)
- [ ] 유튜브 iframe이 lazy loading으로 로드됨 (srcdoc 패턴)
- [ ] 인스타그램 이미지 그리드가 3x2로 표시됨
- [ ] SNS URL 미설정 시 해당 섹션이 숨겨짐
- [ ] 비즈니스 문의 CTA 클릭 시 mailto: 링크 동작
- [ ] 굿즈/링크 카드 클릭 시 새 탭으로 외부 URL 이동
- [ ] 커뮤니티 링크 버튼이 올바르게 동작
- [ ] 푸터 SNS 아이콘이 해당 프로필로 링크됨
- [ ] 다크모드 토글이 정상 동작하고 모든 섹션에 적용됨
- [ ] JSON 환경변수가 잘못된 형식일 때 기본값으로 폴백
- [ ] OG 이미지(`/api/og`)에 크리에이터명과 아바타가 포함됨

### 성능 검증

- [ ] Lighthouse Performance 점수 90+
- [ ] Lighthouse Best Practices 점수 90+
- [ ] First Contentful Paint < 1.5초
- [ ] Largest Contentful Paint < 2.5초
- [ ] Cumulative Layout Shift < 0.1
- [ ] 유튜브 iframe lazy loading 동작 확인 (srcdoc)
- [ ] 이미지 next/image 최적화 확인
- [ ] 번들 사이즈 200KB 미만 (gzip)

### 접근성 검증

- [ ] Lighthouse Accessibility 점수 90+
- [ ] 키보드만으로 모든 인터랙션 가능 (탭 순서, Enter/Space)
- [ ] 스크린리더로 모든 콘텐츠 접근 가능
- [ ] 유튜브 iframe에 적절한 title 속성
- [ ] 이미지에 적절한 alt 텍스트
- [ ] 색상 대비 WCAG 2.1 AA 준수
- [ ] `lang="ko"` 속성 설정됨

### SEO 검증

- [ ] Lighthouse SEO 점수 90+
- [ ] `<title>` 태그에 크리에이터명 포함
- [ ] meta description에 크리에이터 소개 포함
- [ ] JSON-LD Person 스키마 포함 (이름, 소개, SNS 링크)
- [ ] OG 메타태그 (og:title, og:description, og:image) 설정
- [ ] 카카오톡/트위터 공유 시 OG 이미지 정상 표시
- [ ] `robots.txt` 생성됨
- [ ] `sitemap.xml` 생성됨
