'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Calendar, Tag, Link2, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  BLOG_CATEGORIES,
  getBlogCategoryOrder,
  type BlogCategory,
} from '@/data/blog/blog-categories';
import type { BlogPostMeta } from '@/data/blog/posts';

/** ISO date → "2026년 3월 18일" (환경 무관 결정적 포맷) */
function formatDateKR(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `https://www.linkmap.biz/blog/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [slug]);

  return (
    <button
      onClick={handleCopy}
      className={`flex h-7 w-7 items-center justify-center rounded-md border transition-all ${
        copied
          ? 'border-brand-green bg-green-50 text-green-600 dark:bg-green-950/30'
          : 'border-transparent opacity-0 group-hover:opacity-100 hover:border-brand-blue/50 hover:text-brand-blue'
      }`}
      title="링크 복사"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
    </button>
  );
}

function PostCard({ post }: { post: BlogPostMeta }) {
  const cat = BLOG_CATEGORIES[post.category];
  const CatIcon = cat.icon;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col gap-3 rounded-lg border bg-card p-5 shadow-sm transition-all hover:border-brand-blue/50 hover:shadow-md"
    >
      {/* Category + Tags + Copy */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <CatIcon className="h-4 w-4 text-brand-blue" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {cat.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {post.tags.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {post.tags[0]}
            </Badge>
          )}
          <CopyLinkButton slug={post.slug} />
        </div>
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
            {formatDateKR(post.publishedAt)}
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

export function BlogHub({ posts }: { posts: BlogPostMeta[] }) {
  const categories = getBlogCategoryOrder();
  const categoriesWithPosts = categories.filter(
    (cat) => posts.some((p) => p.category === cat)
  );
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'all'>('all');

  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  // 카테고리별로 그룹핑
  const groupedPosts = categoriesWithPosts
    .filter((cat) => activeCategory === 'all' || cat === activeCategory)
    .map((cat) => ({
      key: cat,
      ...BLOG_CATEGORIES[cat],
      posts: filteredPosts.filter((p) => p.category === cat),
    }))
    .filter((g) => g.posts.length > 0);

  return (
    <div className="py-12 md:py-16 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">블로그</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          바이브 코딩, 환경변수 관리, 서비스 비교 — 개발자를 위한 인사이트
        </p>
      </div>

      {/* Category Filter Tabs */}
      {categoriesWithPosts.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              activeCategory === 'all'
                ? 'border-brand-blue bg-brand-blue/10 text-brand-blue font-medium'
                : 'text-muted-foreground hover:border-brand-blue/30 hover:text-foreground'
            }`}
          >
            전체
            <span className="text-xs opacity-60">({posts.length})</span>
          </button>
          {categoriesWithPosts.map((catKey) => {
            const cat = BLOG_CATEGORIES[catKey];
            const CatIcon = cat.icon;
            const count = posts.filter((p) => p.category === catKey).length;
            const isActive = activeCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'border-brand-blue bg-brand-blue/10 text-brand-blue font-medium'
                    : 'text-muted-foreground hover:border-brand-blue/30 hover:text-foreground'
                }`}
              >
                <CatIcon className="h-3 w-3" />
                {cat.label}
                <span className="text-xs opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Posts by Category Sections */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">아직 발행된 글이 없습니다.</p>
          <p className="text-sm text-muted-foreground mt-2">
            곧 바이브 코딩과 환경변수 관리에 대한 글을 발행합니다.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedPosts.map((group) => {
            const GroupIcon = group.icon;
            return (
              <section key={group.key}>
                {/* Category Section Header */}
                {activeCategory === 'all' && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-blue/10">
                      <GroupIcon className="h-3.5 w-3.5 text-brand-blue" />
                    </div>
                    <h2 className="text-lg font-semibold">{group.label}</h2>
                    <span className="text-xs text-muted-foreground">
                      {group.description}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.posts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            );
          })}
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
