// ---------------------------------------------------------------------------
// Content-dependent blog helpers
// 콘텐츠(CONTENT_MAP)가 필요한 함수만 모음 — 서버 번들 분리 목적
// 메타데이터만 필요한 소비자는 posts.ts에서 import할 것
// ---------------------------------------------------------------------------

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
// Helpers
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
