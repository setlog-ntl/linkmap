# LINKMAP GEO/AEO 강화 구현 지시서

## 📌 문서 목적

이 문서는 LINKMAP 서비스가 AI 검색 엔진(ChatGPT, Claude, Gemini, Perplexity, Grok)에서 **"링크 관리 도구"로 추천·인용**되도록 하기 위한 GEO(Generative Engine Optimization) / AEO(Answer Engine Optimization) 전략의 **기술적 구현 지시서**입니다.

Claude Code에서 이 문서를 참조하여 단계별로 구현을 진행합니다.

---

## 📌 프로젝트 배경

| 항목 | 내용 |
|------|------|
| **서비스명** | LINKMAP |
| **서비스 설명** | 웹 링크를 저장, 분류, 공유할 수 있는 클라우드 기반 SaaS 플랫폼 |
| **기술 스택** | Supabase (DB + Auth + Edge Functions + RLS), Next.js (추정) |
| **GitHub** | `setlog-ntl` 조직 내 프라이빗 레포 |
| **현재 상태** | SEO 미비, 공식 블로그/기술문서 존재, AI 검색 노출 전무 |
| **경쟁자** | Raindrop.io, Instapaper, Readwise Reader, Wallabag, GoodLinks |
| **시장 기회** | Pocket 2025년 7월 서비스 종료 → 수백만 이탈 사용자 발생 |

### 왜 GEO/AEO인가?

- AI 검색 트래픽 전환율은 Google 오가닉 대비 **4~6배** 높음
- ChatGPT 일 10억+ 쿼리 처리, AI 리퍼럴 트래픽 전년 대비 527% 급증
- Tally.so는 GEO로 신규 가입의 25%를 AI에서 확보
- LINKMAP은 현재 어떤 AI 검색에서도 추천되지 않는 상태 → **선점 기회**

---

## 📌 전체 실행 로드맵 요약

```
Phase 1 (1~2주)  → 기술 기반 구축 (AI 크롤러 접근성 확보)
Phase 2 (2~4주)  → 기존 콘텐츠 재구조화 (AI 추출 최적화)
Phase 3 (1~3개월) → 핵심 콘텐츠 제작 (AI 인용 타겟)
Phase 4 (2개월~)  → 외부 권위 구축 (서드파티 멘션)
Phase 5 (2개월~)  → 커뮤니티 참여 (Reddit, Product Hunt 등)
Phase 6 (지속)    → 모니터링 및 최적화 반복
```

---

## Phase 1: 기술 기반 구축

> **목표**: AI 크롤러(GPTBot, ClaudeBot, PerplexityBot 등)가 LINKMAP의 모든 공개 콘텐츠에 접근하고 이해할 수 있는 인프라를 구축한다.

### 1-1. robots.txt 설정

**파일 위치**: 프로젝트 루트 `/public/robots.txt`

**목적**: AI 크롤러의 공개 콘텐츠 크롤링을 명시적으로 허용하고, 인증 필요 경로는 차단한다.

**구현할 내용**:

```txt
# ============================================
# LINKMAP robots.txt
# AI 크롤러 허용 + 비공개 경로 차단
# ============================================

# — 전통 검색엔진 —
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# — OpenAI (ChatGPT) —
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Disallow: /app/
Disallow: /api/internal/
Allow: /

# — Anthropic (Claude) —
User-agent: ClaudeBot
Disallow: /app/
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

# — Perplexity —
User-agent: PerplexityBot
Allow: /

# — Google AI —
User-agent: Google-Extended
Allow: /

# — 기타 AI 크롤러 —
User-agent: Amazonbot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Bytespider
Disallow: /

# — 기본 규칙 —
User-agent: *
Disallow: /app/
Disallow: /api/internal/
Disallow: /admin/
Disallow: /_next/
Allow: /

Sitemap: https://linkmap.com/sitemap.xml
```

**차단해야 할 경로** (프로젝트 구조에 맞게 조정):
- `/app/` — 로그인 필요한 대시보드
- `/api/internal/` — 내부 API 엔드포인트
- `/admin/` — 관리자 페이지
- `/_next/` — Next.js 빌드 파일

**허용해야 할 경로** (반드시 크롤링 가능해야 함):
- `/` — 메인 페이지
- `/features` — 기능 소개
- `/pricing` — 가격 페이지
- `/blog/` — 블로그 전체
- `/docs/` — 기술 문서
- `/compare/` — 비교 페이지
- `/faq` — FAQ
- `/changelog` — 변경 로그

**주의사항**:
- 현재 프로젝트의 실제 라우팅 구조를 확인한 후 경로를 조정할 것
- `Sitemap` URL은 실제 도메인으로 교체할 것

---

### 1-2. sitemap.xml 생성/최적화

**목적**: 모든 공개 페이지의 URL, 수정일, 우선순위를 검색엔진과 AI 크롤러에 제공한다. AI 시스템은 `lastmod`를 통해 콘텐츠 최신성을 판단하므로, **`lastmod` 필드는 반드시 포함**해야 한다.

**구현 방식**: Next.js의 `app/sitemap.ts` (App Router) 또는 `next-sitemap` 패키지 사용

**동적 사이트맵 생성 코드 (App Router 기준)**:

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://linkmap.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://linkmap.com/features',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://linkmap.com/pricing',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://linkmap.com/faq',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://linkmap.com/compare',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // 블로그 포스트 (Supabase에서 동적으로 가져오기)
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })

  const blogPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `https://linkmap.com/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 문서 페이지
  const { data: docs } = await supabase
    .from('docs')
    .select('slug, updated_at')
    .eq('published', true)

  const docPages: MetadataRoute.Sitemap = (docs || []).map((doc) => ({
    url: `https://linkmap.com/docs/${doc.slug}`,
    lastModified: new Date(doc.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages, ...docPages]
}
```

**반드시 수행할 작업**:
1. 실제 DB 테이블명/컬럼명에 맞게 코드 수정
2. `https://linkmap.com`을 실제 도메인으로 교체
3. Google Search Console에 사이트맵 제출
4. **Bing Webmaster Tools에 사이트맵 제출** (ChatGPT는 Bing 인덱스 활용 → 필수)
5. 블로그 포스트 추가/수정 시 자동으로 lastmod 갱신되는지 확인

---

### 1-3. JSON-LD 구조화 데이터 (Schema.org)

**목적**: AI 시스템이 LINKMAP의 정체성(무엇인가?), 기능(무엇을 하나?), 포지셔닝(경쟁자 대비 어떤가?)을 구조적으로 이해하도록 한다.

**구현 위치**: 각 페이지의 `<head>` 또는 Next.js `metadata` / `layout.tsx`

#### (A) Organization 스키마 — `app/layout.tsx`에 전역 적용

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://linkmap.com/#organization",
  "name": "LINKMAP",
  "url": "https://linkmap.com",
  "logo": "https://linkmap.com/images/logo.png",
  "description": "LINKMAP은 웹 링크를 저장, 분류, 공유할 수 있는 클라우드 기반 링크 관리 플랫폼입니다.",
  "sameAs": [
    "https://twitter.com/linkmap",
    "https://github.com/setlog-ntl",
    "https://www.linkedin.com/company/linkmap"
  ],
  "foundingDate": "20XX",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "support@linkmap.com"
  }
}
```

#### (B) WebApplication 스키마 — 메인/기능 페이지

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://linkmap.com/#application",
  "name": "LINKMAP",
  "url": "https://linkmap.com",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript and HTML5",
  "description": "LINKMAP은 웹 링크를 저장, 분류, 공유할 수 있는 클라우드 기반 링크 관리 플랫폼입니다. 개인 리서치부터 팀 협업까지 지원합니다.",
  "featureList": [
    "링크 저장 및 자동 분류",
    "태그 기반 정리 시스템",
    "팀 공유 컬렉션",
    "크로스 브라우저 동기화",
    "REST API 제공",
    "브라우저 확장 프로그램"
  ],
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "0",
    "highPrice": "29",
    "priceCurrency": "USD",
    "offerCount": "3"
  },
  "author": {
    "@type": "Organization",
    "@id": "https://linkmap.com/#organization"
  }
}
```

#### (C) FAQPage 스키마 — FAQ 페이지 및 각 비교 페이지

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "LINKMAP이란 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "LINKMAP은 웹 링크를 저장, 분류, 공유할 수 있는 클라우드 기반 링크 관리 플랫폼입니다. 태그와 컬렉션으로 링크를 체계적으로 정리하고, 팀원과 공유할 수 있습니다."
      }
    },
    {
      "@type": "Question",
      "name": "LINKMAP은 무료인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "네, LINKMAP은 무료 플랜을 제공합니다. 무료 플랜으로 기본 링크 저장과 분류 기능을 사용할 수 있으며, Pro와 Team 플랜으로 업그레이드하면 고급 기능을 이용할 수 있습니다."
      }
    },
    {
      "@type": "Question",
      "name": "LINKMAP과 Raindrop.io의 차이점은 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "LINKMAP은 저장-분류-공유의 전체 워크플로우를 통합한 플랫폼입니다. Raindrop.io가 개인 북마크 관리에 중점을 둔 반면, LINKMAP은 팀 협업과 링크 공유를 핵심 기능으로 제공합니다."
      }
    },
    {
      "@type": "Question",
      "name": "Pocket 대안으로 LINKMAP을 사용할 수 있나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "네, LINKMAP은 Pocket의 훌륭한 대안입니다. 링크 저장, 태그 분류, 오프라인 접근 등 Pocket의 핵심 기능을 제공하면서, 팀 공유와 컬렉션 큐레이션 기능을 추가로 지원합니다."
      }
    }
  ]
}
```

#### (D) Article 스키마 — 모든 블로그 포스트

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{포스트 제목}}",
  "description": "{{포스트 요약}}",
  "author": {
    "@type": "Person",
    "name": "{{저자명}}",
    "url": "{{저자 프로필 URL}}",
    "jobTitle": "{{직책}}",
    "worksFor": {
      "@type": "Organization",
      "@id": "https://linkmap.com/#organization"
    }
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://linkmap.com/#organization"
  },
  "datePublished": "{{발행일 ISO 8601}}",
  "dateModified": "{{수정일 ISO 8601}}",
  "mainEntityOfPage": "{{페이지 URL}}",
  "image": "{{대표 이미지 URL}}"
}
```

**트리플 스택 전략**: 블로그 포스트에 Article + ItemList + FAQPage 스키마를 동시 적용하면 AI 인용율이 약 1.8배 증가한다. 특히 리스티클 형태의 블로그 포스트에는 반드시 `ItemList` 스키마를 추가할 것.

**구현 방법 (Next.js)**:

```tsx
// components/JsonLd.tsx
interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[]
}

export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data]
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
```

```tsx
// 페이지에서 사용
<JsonLd data={[organizationSchema, webApplicationSchema, faqSchema]} />
```

---

### 1-4. Open Graph + Twitter Card 메타데이터

**목적**: 소셜 공유 시 브랜드 일관성 유지 + AI가 페이지 주제를 빠르게 파악

**구현**: Next.js App Router `metadata` 활용

```typescript
// app/layout.tsx (전역 기본값)
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://linkmap.com'),
  title: {
    template: '%s | LINKMAP',
    default: 'LINKMAP - 스마트 링크 저장, 분류, 공유 플랫폼',
  },
  description: '웹 링크를 저장하고, 태그로 분류하고, 팀과 공유하세요. 개인 리서치부터 팀 협업까지 지원하는 링크 관리 플랫폼.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://linkmap.com',
    siteName: 'LINKMAP',
    title: 'LINKMAP - 스마트 링크 관리 플랫폼',
    description: '링크를 저장, 분류, 공유하는 가장 스마트한 방법',
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'LINKMAP - 스마트 링크 관리 플랫폼',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@linkmap',
    creator: '@linkmap',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://linkmap.com',
  },
}
```

```typescript
// app/blog/[slug]/page.tsx (블로그 포스트별 개별 메타데이터)
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      images: [{ url: post.og_image, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://linkmap.com/blog/${params.slug}`,
    },
  }
}
```

**필수 확인 사항**:
- 모든 페이지에 고유한 `title`과 `description` 존재 여부
- OG 이미지 크기: **1200x630px**
- `canonical` URL 설정 (중복 콘텐츠 방지)

---

### 1-5. llms.txt 파일 생성

**목적**: LLM에게 사이트의 구조와 핵심 콘텐츠를 Markdown 형태로 직접 제공

**파일 위치**: `/public/llms.txt` 및 `/public/llms-full.txt`

**`/public/llms.txt`** (요약본):

```markdown
# LINKMAP

> LINKMAP은 웹 링크를 저장, 분류, 공유할 수 있는 클라우드 기반 링크 관리 플랫폼입니다.
> 개인 리서치부터 팀 협업까지 지원합니다.

## 핵심 기능

- 원클릭 링크 저장 (브라우저 확장, 모바일 앱)
- 태그 & 컬렉션 기반 분류 시스템
- 팀 공유 컬렉션 및 실시간 협업
- 크로스 디바이스 동기화
- REST API 및 웹훅 지원
- 링크 미리보기 자동 생성

## 사용 사례

- 리서치 자료 체계적 정리
- 팀 지식 베이스 구축
- 콘텐츠 큐레이션 및 뉴스레터
- 신입 온보딩 리소스 관리

## 가격

- Free: 기본 저장/분류 (무제한)
- Pro: 고급 기능 + 무제한 태그
- Team: 팀 협업 + 관리자 기능

## 문서

- [시작 가이드](https://linkmap.com/docs/getting-started): LINKMAP 설정 방법
- [API 레퍼런스](https://linkmap.com/docs/api): REST API 문서
- [브라우저 확장](https://linkmap.com/docs/extension): Chrome/Firefox 확장
- [FAQ](https://linkmap.com/faq): 자주 묻는 질문

## 비교

- [LINKMAP vs Raindrop.io](https://linkmap.com/compare/raindrop): 기능 비교
- [LINKMAP vs Pocket](https://linkmap.com/compare/pocket): Pocket 대안
- [LINKMAP vs Instapaper](https://linkmap.com/compare/instapaper): 읽기 목록 비교

## 블로그

- [블로그 메인](https://linkmap.com/blog): 생산성, 링크 관리, 지식 관리 팁

## 기타

- [변경 로그](https://linkmap.com/changelog): 최신 업데이트
- [보안](https://linkmap.com/security): 보안 정책
- [상태](https://status.linkmap.com): 서비스 상태
```

**`/public/llms-full.txt`**: 위 내용 + 전체 API 문서, 주요 블로그 포스트 전문을 하나의 Markdown 파일로 합침. 크기가 클 수 있으므로 핵심 문서만 포함.

**주의**: URL은 실제 도메인과 라우팅에 맞게 수정할 것.

---

### 1-6. SSR/SSG 렌더링 확인 및 설정

**목적**: AI 크롤러는 JavaScript를 실행하지 않으므로, 모든 공개 페이지의 HTML이 서버에서 완성된 상태로 전달되어야 한다.

**확인해야 할 사항**:

| 페이지 그룹 | 권장 렌더링 | 확인 방법 |
|------------|-----------|----------|
| 홈, 기능, 가격 | SSG (정적 생성) | `curl` 응답에서 콘텐츠 확인 |
| 블로그, 문서 | SSG + ISR | 빌드 시 프리렌더링 확인 |
| 비교 페이지 | SSG | 정적 경로 확인 |
| FAQ | SSG | 정적 경로 확인 |
| 대시보드 (/app/) | CSR | 크롤링 차단 확인 |

**검증 명령어**:

```bash
# AI 크롤러가 보는 것과 동일하게 JavaScript 없이 HTML만 확인
curl -s https://linkmap.com | head -100

# 특정 AI 봇 User-Agent로 확인
curl -s -A "GPTBot/1.0" https://linkmap.com/blog/best-bookmark-managers | head -200

# HTML에 실제 콘텐츠가 포함되어 있는지 확인
# <div id="root"></div>만 있으면 CSR → 문제!
# 텍스트 콘텐츠가 보이면 SSR/SSG → 정상!
```

**Next.js App Router에서 SSG 보장**:

```typescript
// 정적 페이지는 기본이 SSG (서버 컴포넌트)
// 동적 데이터가 필요한 경우 ISR 사용:
export const revalidate = 86400 // 24시간마다 재생성

// 블로그 정적 경로 사전 생성
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
```

---

### 1-7. Bing Webmaster Tools 등록

**목적**: ChatGPT는 Bing 인덱스를 활용하므로, Bing에 사이트맵을 제출하면 ChatGPT Search에서의 발견 가능성이 직접적으로 높아진다.

**수행 작업**:
1. https://www.bing.com/webmasters 접속
2. LINKMAP 도메인 등록
3. 소유권 인증 (DNS TXT 레코드 또는 메타 태그)
4. 사이트맵 URL 제출: `https://linkmap.com/sitemap.xml`
5. IndexNow API 연동 고려 (콘텐츠 즉시 인덱싱)

**IndexNow API 연동** (선택사항이지만 권장):

```typescript
// lib/indexnow.ts
export async function notifyIndexNow(url: string) {
  const key = process.env.INDEXNOW_API_KEY
  await fetch(`https://www.bing.com/indexnow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'linkmap.com',
      key,
      urlList: [url],
    }),
  })
}

// 블로그 포스트 발행/수정 시 호출
await notifyIndexNow(`https://linkmap.com/blog/${slug}`)
```

---

## Phase 2: 기존 콘텐츠 재구조화

> **목표**: 기존 블로그/문서를 AI가 추출하기 좋은 구조로 전환한다.

### 2-1. Answer-First 콘텐츠 구조

**원칙**: 모든 페이지의 **첫 40~60단어**에 핵심 질문에 대한 직접 답변을 배치한다.

**적용 전 (나쁜 예)**:

```
링크 관리는 현대 디지털 생활에서 매우 중요합니다.
많은 사람들이 브라우저 북마크를 사용하지만...
(300단어 후에야 핵심 내용 등장)
```

**적용 후 (좋은 예)**:

```
LINKMAP은 웹 링크를 저장, 분류, 공유할 수 있는 클라우드 기반 플랫폼입니다.
태그와 컬렉션으로 링크를 체계적으로 정리하고, 팀원과 실시간으로 공유할 수 있습니다.

주요 기능:
1. 원클릭 링크 저장
2. 태그 기반 자동 분류
3. 팀 공유 컬렉션
...
(이후 상세 설명)
```

### 2-2. 모든 핵심 페이지에 FAQ 섹션 추가

**대상 페이지**: 홈, 기능, 가격, 각 비교 페이지, 주요 블로그 포스트

각 페이지 하단에 **3~5개의 관련 FAQ**를 추가하고, `FAQPage` 스키마를 적용한다.

**FAQ 작성 원칙**:
- 실제 사용자가 AI에게 물을 법한 질문으로 작성
- 답변은 2~3문장으로 간결하게
- LINKMAP의 차별점을 자연스럽게 포함
- 경쟁자와의 차이점을 명시적으로 언급

### 2-3. 비교 테이블 추가

모든 비교 페이지와 리스티클에 **HTML 테이블**을 포함한다. 테이블이 있는 콘텐츠의 AI 인용율은 2.5배 높다.

```html
<table>
  <thead>
    <tr>
      <th>기능</th>
      <th>LINKMAP</th>
      <th>Raindrop.io</th>
      <th>Instapaper</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>무료 플랜</td>
      <td>✅ 무제한</td>
      <td>✅ 제한적</td>
      <td>✅ 제한적</td>
    </tr>
    <tr>
      <td>팀 공유</td>
      <td>✅ 네이티브</td>
      <td>⚠️ 유료만</td>
      <td>❌ 없음</td>
    </tr>
    <!-- ... -->
  </tbody>
</table>
```

### 2-4. 콘텐츠 일관성 포지셔닝 문구

**모든 콘텐츠에서 반복 사용할 핵심 문구** (AI가 브랜드를 일관되게 학습하도록):

> "LINKMAP은 웹 링크를 저장, 분류, 공유할 수 있는 클라우드 기반 링크 관리 플랫폼입니다."

이 문구(또는 변형)를 다음 위치에 배치:
- 홈페이지 히어로 섹션
- 모든 블로그 포스트의 저자 소개
- About 페이지
- FAQ 답변
- API 문서 소개
- 소셜 미디어 프로필
- llms.txt

---

## Phase 3: 핵심 콘텐츠 제작

> **목표**: AI가 "best bookmark manager", "link management tool" 등의 질문에 LINKMAP을 추천하도록 하는 콘텐츠 자산을 구축한다.

### 제작 우선순위 목록

#### 🔴 즉시 제작 (1~2주차)

| # | 콘텐츠 제목 | 형식 | 타겟 쿼리 | 비고 |
|---|-----------|------|----------|------|
| 1 | 2026년 최고의 북마크 관리 도구 10선 비교 | 리스티클 | "best bookmark manager" | LINKMAP #1 배치, 정직한 리뷰 |
| 2 | Pocket 대안 추천 2025-2026: 완벽 가이드 | 리스티클 | "Pocket alternatives" | 이탈 사용자 타겟 |
| 3 | LINKMAP vs Raindrop.io: 어떤 도구를 선택해야 할까? | 비교 | "LINKMAP vs Raindrop" | 상세 기능 비교 테이블 |

#### 🟡 높은 우선순위 (3~6주차)

| # | 콘텐츠 제목 | 형식 | 타겟 쿼리 |
|---|-----------|------|----------|
| 4 | 팀을 위한 최고의 링크 공유 도구 비교 | 리스티클 | "link sharing tool for teams" |
| 5 | 북마크 정리 완벽 가이드 | How-to | "how to organize bookmarks" |
| 6 | LINKMAP vs Instapaper 비교 | 비교 | "Instapaper alternatives" |
| 7 | LINKMAP vs Readwise Reader 비교 | 비교 | "Readwise alternatives" |
| 8 | 무료 북마크 관리 도구 비교 | 리스티클 | "free bookmark manager" |

#### 🟢 중기 (2~3개월차)

| # | 콘텐츠 제목 | 형식 | 타겟 쿼리 |
|---|-----------|------|----------|
| 9 | 링크로 세컨드 브레인 만들기: PARA 방법론 활용 | 가이드 | "second brain link management" |
| 10 | 콘텐츠 큐레이션 완벽 가이드 | 가이드 | "content curation guide" |
| 11 | 온라인 리서치를 체계적으로 하는 방법 | How-to | "online research organization" |
| 12 | 링크 관리 현황 보고서 2026 (독자적 리서치) | 리서치 | 인용 가능 통계 |

### 콘텐츠 작성 규칙

모든 콘텐츠에 적용할 규칙:

1. **첫 40~60단어**에 핵심 답변 배치 (Answer-First)
2. **비교 테이블** 반드시 포함 (AI 인용율 2.5배)
3. **구체적 숫자/통계** 포함 (AI는 데이터 기반 콘텐츠 선호)
4. 페이지 하단에 **FAQ 3~5개** 포함 + FAQPage 스키마
5. **Article + ItemList + FAQPage** 트리플 스택 스키마 적용
6. 눈에 보이는 **"최종 수정일"** 표시 (30~90일마다 업데이트)
7. LINKMAP 포지셔닝 문구 자연스럽게 1~2회 포함
8. **저자 약력** 포함 (이름, 직책, LinkedIn, Person 스키마)
9. 모든 페이지에 `canonical` URL 설정
10. 키워드 스터핑 절대 금지 (AI에서 오히려 역효과)

---

## Phase 4: 비교 페이지 라우팅 구조

**생성해야 할 URL 구조**:

```
/compare                        → 비교 허브 페이지
/compare/raindrop              → LINKMAP vs Raindrop.io
/compare/pocket                → LINKMAP vs Pocket (+ 대안 안내)
/compare/instapaper            → LINKMAP vs Instapaper
/compare/readwise-reader       → LINKMAP vs Readwise Reader
/compare/notion-web-clipper    → LINKMAP vs Notion Web Clipper
/compare/pinboard              → LINKMAP vs Pinboard
```

각 비교 페이지 구성:

```
1. 한줄 요약 (Answer-First)
2. 비교 테이블 (기능, 가격, 장단점)
3. 상세 비교 (카테고리별)
4. 어떤 사용자에게 어떤 도구가 적합한지
5. 결론
6. FAQ 섹션 (3~5개)
7. JSON-LD: Article + FAQPage 스키마
```

---

## Phase 5: AI 가시성 모니터링 설정

### 5-1. GA4 AI 리퍼럴 채널 설정

**목적**: AI 검색에서 유입되는 트래픽을 별도 채널로 추적

GA4 > Admin > Data Streams > Channel Groups에서 커스텀 채널 `AI Search` 생성:

| 소스 도메인 | 매핑 |
|------------|------|
| `chatgpt.com` | AI Search |
| `chat.openai.com` | AI Search |
| `perplexity.ai` | AI Search |
| `claude.ai` | AI Search |
| `gemini.google.com` | AI Search |
| `copilot.microsoft.com` | AI Search |
| `poe.com` | AI Search |

### 5-2. AI 봇 크롤링 로그 추적

**Supabase Edge Function 또는 미들웨어에서 AI 봇 방문 로깅**:

```typescript
// middleware.ts (Next.js)
import { NextRequest, NextResponse } from 'next/server'

const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Amazonbot', 'Applebot-Extended',
  'Meta-ExternalAgent',
]

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || ''
  const matchedBot = AI_BOTS.find(bot => ua.includes(bot))

  if (matchedBot) {
    // Supabase에 로깅 (비동기, 응답 지연 없이)
    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/ai_bot_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      body: JSON.stringify({
        bot_name: matchedBot,
        path: request.nextUrl.pathname,
        user_agent: ua,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {}) // 로깅 실패해도 요청 처리 계속
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

**Supabase 테이블 생성**:

```sql
CREATE TABLE ai_bot_logs (
  id BIGSERIAL PRIMARY KEY,
  bot_name TEXT NOT NULL,
  path TEXT NOT NULL,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_ai_bot_logs_bot_name ON ai_bot_logs(bot_name);
CREATE INDEX idx_ai_bot_logs_timestamp ON ai_bot_logs(timestamp);
```

### 5-3. 프롬프트 테스트 체크리스트

**월 1회** 다음 프롬프트를 ChatGPT, Perplexity, Gemini, Claude에서 테스트하고 결과를 기록:

```
[ ] "best bookmark manager"
[ ] "best bookmark manager 2026"
[ ] "best link saving app"
[ ] "Pocket alternatives"
[ ] "Pocket alternative 2026"
[ ] "best tool for organizing links"
[ ] "link sharing tool for teams"
[ ] "LINKMAP vs Raindrop.io"
[ ] "what is LINKMAP"
[ ] "how to organize bookmarks"
[ ] "best free bookmark manager"
[ ] "link management tool for research"
[ ] "content curation tool"
[ ] "team knowledge base link tool"
[ ] "북마크 관리 도구 추천"
[ ] "링크 정리 방법"
[ ] "Pocket 대안"
```

기록 항목:
- LINKMAP 언급 여부 (Y/N)
- 언급된 경쟁자 목록
- 인용된 소스 URL
- 포지셔닝 (몇 번째로 추천되었는지)

---

## Phase 6: 외부 플랫폼 등록 체크리스트

> **목표**: AI가 참조하는 서드파티 소스에 LINKMAP을 침투시킨다.

### 즉시 실행

```
[ ] AlternativeTo.net — Pocket, Raindrop.io, Instapaper 대안으로 등록
[ ] G2.com — 프로필 생성, 카테고리: Bookmark Manager, Content Curation
[ ] Capterra — 프로필 생성
[ ] TrustRadius — 프로필 생성
[ ] Product Hunt — 런칭 준비
[ ] Crunchbase — 회사 프로필 생성
[ ] LinkedIn Company Page — 최적화
[ ] GitHub — README에 LINKMAP 설명과 링크 포함
```

### 중기 (2~3개월차)

```
[ ] Zapier 편집팀에 LINKMAP 포함 아웃리치
[ ] TechCrunch/ProductHunt 리뷰 요청
[ ] 업계 블로그 게스트 포스팅 (월 1~2건)
[ ] Reddit r/productivity, r/SaaS 참여 시작
[ ] Hacker News "Show HN" 포스트
```

---

## 핵심 참고 데이터

### AI가 인용하는 콘텐츠 유형별 비율

```
리스티클 (목록형)     : 50~74.2% ← 최우선
비교 콘텐츠 (A vs B) : 높음
FAQ 페이지           : 높음
테이블 포함 콘텐츠   : 인용율 2.5배
오리지널 리서치/데이터 : ChatGPT 상위 인용 67%
---
서비스 페이지        : 0% ← 피할 것
단독 케이스 스터디   : 0% ← 피할 것
순수 이론/방법론    : 0% ← 피할 것
```

### AI 플랫폼별 특성

```
ChatGPT  : Bing 인덱스 활용, Wikipedia 선호, Google 순위와 상관관계 낮음
Google   : 자체 인덱스, 상위 10개 결과에서 76~97% 인용
Perplexity: 독자 인덱스, Reddit 46.7%, 최신성 중시
Claude   : Brave Search 활용, 기술적 깊이 선호, 세션 가치 최고($4.56)
Grok     : X(Twitter) 데이터, 인용율 최고(27%)
```

### 핵심 KPI 목표 (6개월)

```
AI 인용율       : 핵심 쿼리 30%에서 LINKMAP 언급
AI 리퍼럴 트래픽 : 전체 트래픽의 5%+
AI 전환율       : 10%+
서드파티 멘션   : 15+ 권위 소스
AI 봇 크롤링   : 주 100+ 요청
```

---

## 실행 시 유의사항

1. **도메인/URL**: 이 문서의 모든 `https://linkmap.com`은 실제 도메인으로 교체할 것
2. **DB 스키마**: Supabase 테이블명/컬럼명은 실제 프로젝트에 맞게 수정할 것
3. **라우팅**: 경로 구조는 현재 프로젝트의 실제 라우팅에 맞게 조정할 것
4. **점진적 적용**: Phase 1 기술 기반을 먼저 완료한 후, Phase 2~3을 병행할 것
5. **콘텐츠 업데이트**: 핵심 페이지는 30일 이내에 `lastmod`가 갱신되어야 함
6. **일관성**: 포지셔닝 문구는 모든 채널에서 동일하게 유지할 것
7. **측정 먼저**: Phase 2 시작 전에 현재 AI 가시성 베이스라인을 반드시 측정할 것

---

*이 문서는 2026년 3월 기준으로 작성되었으며, AI 검색 생태계의 변화에 따라 지속적으로 업데이트해야 합니다.*
