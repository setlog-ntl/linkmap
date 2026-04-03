// ---------------------------------------------------------------------------
// Categories & types — blog-categories.ts에서 re-export (역호환)
// ---------------------------------------------------------------------------
export { BLOG_CATEGORIES, getBlogCategoryOrder } from './blog-categories';
export type { BlogCategory } from './blog-categories';

// ---------------------------------------------------------------------------
// Metadata re-exports
// ---------------------------------------------------------------------------
export { BLOG_POSTS_META } from './posts-meta';
export type { BlogPostMeta, BlogContentType, BlogSeriesMeta } from './posts-meta';

// ---------------------------------------------------------------------------
// Series re-exports
// ---------------------------------------------------------------------------
export { BLOG_SERIES, getSeriesById, getSeriesPostSlugs } from './blog-series';
export type { BlogSeriesInfo } from './blog-series';

import { BLOG_POSTS_META, type BlogPostMeta } from './posts-meta';

// ---------------------------------------------------------------------------
// Content-dependent functions → posts-content.ts로 분리됨
// 콘텐츠(BlogPost, getBlogPostBySlug 등)가 필요하면 @/data/blog/posts-content에서 import
// ---------------------------------------------------------------------------

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

/** 스토리(narrative) 콘텐츠만 최신순 반환 */
export function getPublishedNarratives(): BlogPostMeta[] {
  return [...BLOG_POSTS_META]
    .filter((p) => p.contentType === 'narrative')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** 특정 시리즈의 포스트 메타를 순번(order) 순으로 반환 */
export function getSeriesPosts(seriesId: string): BlogPostMeta[] {
  return BLOG_POSTS_META
    .filter((p) => p.series?.id === seriesId)
    .sort((a, b) => a.series!.order - b.series!.order);
}
