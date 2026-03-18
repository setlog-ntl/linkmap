# 블로그 시스템 아키텍처

> Linkmap 블로그의 데이터 흐름, 핵심 파일, 인터페이스 명세, SEO 처리를 정리합니다.

---

## 1. 데이터 흐름

```
posts.ts (데이터 소스)
  ↓ BLOG_POSTS[] 배열
  ↓
[slug]/page.tsx (서버 컴포넌트)
  ├── generateStaticParams() → 정적 경로 생성
  ├── generateMetadata() → OG/SEO 메타데이터
  ├── generateBlogJsonLd() → BlogPosting JSON-LD
  └── <BlogPostView post={post} />
        ├── <ReadingProgress /> — 스크롤 진행바
        ├── <TableOfContents /> — H2 기반 목차 (3개 이상일 때)
        ├── <ReactMarkdown /> — 마크다운 렌더링
        │     ├── CustomBlockquote → 콜아웃 5종 (KEY/TIP/WARNING/INFO/TRY)
        │     ├── CustomLink → 내부(/guides, /services, /blog) vs 외부 링크
        │     ├── CustomH2 → 앵커 ID 자동 생성
        │     ├── CustomTable → 반응형 테이블
        │     ├── CustomCode/Pre → 코드 블록 스타일링
        │     ├── CustomHr → 구분선 (CTA 삽입 기준)
        │     └── CustomLi → 체크리스트 ([x], [ ])
        ├── <CtaCard /> — 중간 CTA (--- 기준 삽입)
        ├── 관련 가이드 섹션 (relatedGuides → GUIDE_LIST 매핑)
        ├── <ShareButton /> — 링크 복사 + 네이티브 공유
        └── <PostNavigation /> — 이전/다음 포스트
```

---

## 2. 핵심 파일 맵

| 파일 | 역할 | 수정 범위 |
|------|------|----------|
| `src/data/blog/posts.ts` | BlogPost 인터페이스 + BLOG_POSTS 배열 + 헬퍼 함수 | **포스트 추가 시 유일하게 수정** |
| `src/app/blog/[slug]/page.tsx` | SSG 페이지 — 메타데이터, JSON-LD, 렌더링 | 수정 금지 |
| `src/components/blog/blog-post.tsx` | 마크다운 렌더링 + 콜아웃 + TOC + CTA + 네비게이션 | 수정 금지 |
| `src/app/blog/page.tsx` | 블로그 목록 페이지 | 수정 금지 |
| `src/app/blog/layout.tsx` | 블로그 레이아웃 | 수정 금지 |
| `src/data/ui/guide-meta.ts` | 10개 가이드 slug/title/href (relatedGuides 매핑 소스) | 수정 금지 |

---

## 3. BlogPost 인터페이스 전 필드 명세

```typescript
interface BlogPost {
  slug: string;           // URL 경로 (영문 kebab-case, 고유)
  title: string;          // 페이지 제목 (한국어, 50~80자 권장)
  description: string;    // SEO 설명 (한국어, 100~160자)
  category: BlogCategory; // 'vibe-coding' | 'env-management' | 'comparison' | 'tutorial' | 'insight'
  tags: string[];         // 검색 키워드 (한국어 3~6개)
  publishedAt: string;    // ISO date (YYYY-MM-DD)
  updatedAt?: string;     // 수정일 (선택)
  readingTime: string;    // "N분" 형식 (본문 글자수 ÷ 500 ≈ N)
  content: string;        // Markdown 본문 (template literal)
  crossPostUrl?: string;  // Velog 등 외부 교차 게시 URL (canonical)
  relatedGuides?: string[]; // 가이드 slug 배열 (3~4개, guide-meta.ts 실존 slug만)
  ogImage?: string;       // OG 이미지 경로 (선택, 없으면 기본 사용)
}
```

### 필드별 작성 규칙

| 필드 | 규칙 |
|------|------|
| `slug` | 영문 kebab-case, 기존 slug와 중복 금지, 3~6단어 |
| `title` | `—` (em dash)로 부제 구분, 50~80자, H1 역할 |
| `description` | 핵심 내용 요약, CTA 포함 금지, 100~160자 |
| `category` | 5개 중 택 1 (posts.ts의 BLOG_CATEGORIES 참조) |
| `tags` | 한국어 위주, GEO 타깃 키워드 포함, 3~6개 |
| `publishedAt` | 발행일 (미래 날짜 → 자동 비공개) |
| `readingTime` | 본문 한글 기준 500자/분 계산 |
| `content` | 아래 markdown-guide.md 참조 |
| `relatedGuides` | `guide-meta.ts`의 10개 slug 중 택 3~4: env, auth, frontend, backend, deploy, github, cloudflare, openai, supabase, vercel |

---

## 4. BLOG_POSTS 배열 규칙

- **최신순 정렬**: 새 포스트는 배열 **최상단** (인덱스 0)에 추가
- **주석 스타일**: 각 포스트 앞에 `// ======` 구분선 + 번호 + 제목
- **번호 규칙**: 기존 번호 유지, 새 포스트는 N+1 (현재 최신 = 6)
- **배열 외 수정 금지**: 헬퍼 함수, 타입, 카테고리 정의 변경 금지

```typescript
// 예시: 7번째 포스트 추가 위치
export const BLOG_POSTS: BlogPost[] = [
  // ======================================================================
  // 7. 새 포스트 제목
  // ======================================================================
  {
    slug: 'new-post-slug',
    // ... 필드
  },
  // ======================================================================
  // 6. GitHub Secrets 자동화
  // ======================================================================
  // ... 기존 포스트
];
```

---

## 5. SEO 처리 구분

### 자동 처리 (수정 불필요)
| 항목 | 처리 위치 |
|------|----------|
| `<title>` | `generateMetadata()` → `${title} \| Linkmap 블로그` |
| OG meta | `generateMetadata()` → title, description, publishedTime, tags |
| canonical URL | `generateMetadata()` → `https://www.linkmap.biz/blog/${slug}` |
| JSON-LD (BlogPosting) | `generateBlogJsonLd()` → author, datePublished, wordCount |
| sitemap | `src/app/sitemap.ts` (자동 수집) |
| TOC | `<TableOfContents />` → H2 3개 이상 시 자동 생성 |
| 앵커 링크 | `CustomH2` → 한글+영문 ID 자동 생성 |
| 읽기 진행바 | `<ReadingProgress />` → 스크롤 기반 |

### 수동 처리 (포스트 작성 시 직접)
| 항목 | 작성 위치 | 주의사항 |
|------|----------|---------|
| title 최적화 | `posts.ts` title 필드 | 50~80자, 키워드 포함 |
| description 최적화 | `posts.ts` description 필드 | 100~160자, 클릭 유도 |
| 키워드 태그 | `posts.ts` tags 필드 | GEO 타깃 키워드 포함 |
| 콜아웃 배치 | content 내 blockquote | 4~6개, markdown-guide.md 참조 |
| 내부 링크 | content 내 링크 | 밀도 제한, markdown-guide.md 참조 |
| CTA 위치 | content 내 `---` 구분선 | 2개 이상으로 중간 CTA 삽입 |
| Quotable Snippet | content 본문 | GEO 전략, geo-integration.md 참조 |
| relatedGuides | `posts.ts` relatedGuides 필드 | 실존 slug 3~4개 |

---

## 6. 카테고리 정보

| 카테고리 slug | 라벨 | 아이콘 | 설명 |
|--------------|------|--------|------|
| `vibe-coding` | 바이브 코딩 | Sparkles | AI 시대의 새로운 개발 방식 |
| `env-management` | 환경변수 관리 | Shield | API 키와 시크릿을 안전하게 |
| `comparison` | 비교 분석 | Scale | 도구와 서비스 객관적 비교 |
| `tutorial` | 튜토리얼 | GitBranch | 단계별 실전 가이드 |
| `insight` | 인사이트 | LayoutDashboard | 개발 생태계 관찰과 의견 |
