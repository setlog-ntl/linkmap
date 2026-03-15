'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Calendar, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  BLOG_CATEGORIES,
  getPublishedPosts,
  getBlogCategoryOrder,
  type BlogCategory,
  type BlogPost,
} from '@/data/blog/posts';

function PostCard({ post }: { post: BlogPost }) {
  const cat = BLOG_CATEGORIES[post.category];
  const CatIcon = cat.icon;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col gap-3 rounded-lg border bg-card p-5 shadow-sm transition-all hover:border-brand-blue/50 hover:shadow-md"
    >
      {/* Category + Tags */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <CatIcon className="h-4 w-4 text-brand-blue" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {cat.label}
          </span>
        </div>
        {post.tags.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {post.tags[0]}
          </Badge>
        )}
      </div>

      {/* Title + Description */}
      <div className="space-y-1.5">
        <h3 className="font-semibold group-hover:text-brand-blue transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {post.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.publishedAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime}
          </span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}

export function BlogHub() {
  const posts = getPublishedPosts();
  const categories = getBlogCategoryOrder();
  const categoriesWithPosts = categories.filter(
    (cat) => posts.some((p) => p.category === cat)
  );

  return (
    <div className="py-12 md:py-16 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">블로그</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          바이브 코딩, 환경변수 관리, 서비스 비교 — 개발자를 위한 인사이트
        </p>
      </div>

      {/* Category Filter Tags */}
      {categoriesWithPosts.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {categoriesWithPosts.map((catKey) => {
            const cat = BLOG_CATEGORIES[catKey];
            return (
              <span
                key={catKey}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm text-muted-foreground"
              >
                <Tag className="h-3 w-3" />
                {cat.label}
                <span className="text-xs opacity-60">
                  ({posts.filter((p) => p.category === catKey).length})
                </span>
              </span>
            );
          })}
        </div>
      )}

      {/* Posts Grid or Empty State */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">아직 발행된 글이 없습니다.</p>
          <p className="text-sm text-muted-foreground mt-2">
            곧 바이브 코딩과 환경변수 관리에 대한 글을 발행합니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {/* Cross-link to Guides */}
      <div className="rounded-lg border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          실전 설정 방법이 궁금하다면
        </p>
        <Link
          href="/guides"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:underline"
        >
          서비스 가이드 보기 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
