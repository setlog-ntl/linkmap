// ---------------------------------------------------------------------------
// Categories & types — blog-categories.ts에서 re-export (역호환)
// ---------------------------------------------------------------------------
export { BLOG_CATEGORIES, getBlogCategoryOrder } from './blog-categories';
export type { BlogCategory } from './blog-categories';

// ---------------------------------------------------------------------------
// Metadata re-exports
// ---------------------------------------------------------------------------
export { BLOG_POSTS_META } from './posts-meta';
export type { BlogPostMeta } from './posts-meta';

import type { BlogCategory } from './blog-categories';
import { BLOG_POSTS_META, type BlogPostMeta } from './posts-meta';
import { CONTENT_MAP } from './content-map';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BlogPost extends BlogPostMeta {
  /** react-markdown으로 렌더링할 본문 (Markdown) */
  content: string;
}

// ---------------------------------------------------------------------------
// Internal: 전체 BlogPost[] 캐시
// ---------------------------------------------------------------------------

let _postsCache: BlogPost[] | null = null;

function getFullPosts(): BlogPost[] {
  if (_postsCache) return _postsCache;
  _postsCache = BLOG_POSTS_META.map((meta) => ({
    ...meta,
    content: CONTENT_MAP[meta.slug] ?? '',
  }));
  return _postsCache;
}

// ---------------------------------------------------------------------------
// Helpers (기존 API 유지 — 역호환)
// ---------------------------------------------------------------------------

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const meta = BLOG_POSTS_META.find((p) => p.slug === slug);
  if (!meta) return undefined;
  return { ...meta, content: CONTENT_MAP[slug] ?? '' };
}

export function getBlogPostsByCategory(category: BlogCategory): BlogPost[] {
  return getFullPosts().filter((p) => p.category === category);
}

export function getPublishedPosts(): BlogPost[] {
  return getFullPosts()
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** content를 제외한 경량 목록 (클라이언트 번들 최소화) */
export function getPublishedPostsMeta(): BlogPostMeta[] {
  return [...BLOG_POSTS_META]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** sitemap용 경량 엔트리 (slug + 날짜만) */
export function getBlogSitemapEntries(): { slug: string; updatedAt?: string; publishedAt: string }[] {
  return BLOG_POSTS_META.map(({ slug, updatedAt, publishedAt }) => ({ slug, updatedAt, publishedAt }));
}

/** generateStaticParams용 slug 목록 */
export function getPublishedPostSlugs(): { slug: string }[] {
  return BLOG_POSTS_META.map(({ slug }) => ({ slug }));
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const post of BLOG_POSTS_META) {
    for (const tag of post.tags) tagSet.add(tag);
  }
  return Array.from(tagSet).sort();
}
