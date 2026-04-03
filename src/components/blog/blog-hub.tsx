'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Calendar, Link2, Check, BookOpen } from 'lucide-react';
import { IconTooltip } from '@/components/ui/icon-tooltip';
import { Badge } from '@/components/ui/badge';
import {
  BLOG_CATEGORIES,
  getBlogCategoryOrder,
  type BlogCategory,
} from '@/data/blog/blog-categories';
import { BLOG_SERIES, getSeriesPostSlugs } from '@/data/blog/blog-series';
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
    <IconTooltip label="링크 복사">
      <button
        onClick={handleCopy}
        className={`flex h-7 w-7 items-center justify-center rounded-md border transition-all ${
          copied
            ? 'border-brand-green bg-green-50 text-green-600 dark:bg-green-950/30'
            : 'border-transparent opacity-0 group-hover:opacity-100 hover:border-brand-blue/50 hover:text-brand-blue'
        }`}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
      </button>
    </IconTooltip>
  );
}

function PostCard({ post }: { post: BlogPostMeta }) {
  const cat = BLOG_CATEGORIES[post.category];
  const CatIcon = cat.icon;
  const isNarrative = post.contentType === 'narrative';

  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={false}
      className={`group relative flex flex-col gap-3 rounded-lg border bg-card p-5 shadow-sm transition-all hover:border-brand-blue/50 hover:shadow-md ${
        isNarrative ? 'border-l-4 border-l-transparent bg-gradient-to-r from-blue-50/30 to-green-50/30 dark:from-blue-950/10 dark:to-green-950/10' : ''
      }`}
      style={isNarrative ? { borderLeftColor: 'transparent', borderImage: 'linear-gradient(to bottom, var(--color-brand-blue), var(--color-brand-green)) 1' } : undefined}
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
          {isNarrative && post.series && (
            <Badge variant="outline" className="text-xs border-brand-blue/30 text-brand-blue">
              {post.series.order}/{post.series.totalParts ?? '?'}편
            </Badge>
          )}
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

      {/* Narrative Hook */}
      {isNarrative && post.narrativeHook && (
        <p className="text-xs italic text-brand-blue/70 dark:text-brand-blue/50 -mb-1">
          &ldquo;{post.narrativeHook}&rdquo;
        </p>
      )}

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
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'all' | 'narrative'>('all');

  const narrativeCount = useMemo(() => posts.filter((p) => p.contentType === 'narrative').length, [posts]);

  const filteredPosts = activeCategory === 'all'
    ? posts
    : activeCategory === 'narrative'
      ? posts.filter((p) => p.contentType === 'narrative')
      : posts.filter((p) => p.category === activeCategory);

  // 시리즈 배너 데이터 (글이 있는 시리즈만)
  const seriesWithPosts = useMemo(() =>
    BLOG_SERIES
      .map((s) => {
        const slugs = getSeriesPostSlugs(s.id, posts);
        return { ...s, postCount: slugs.length, firstSlug: slugs[0] };
      })
      .filter((s) => s.postCount > 0),
    [posts],
  );

  // 카테고리별로 그룹핑 (서사 필터일 때는 단일 그룹)
  const groupedPosts = activeCategory === 'narrative'
    ? [{ key: 'narrative' as const, label: '서사', description: '시대 전환의 이야기', icon: BookOpen, posts: filteredPosts }]
    : categoriesWithPosts
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
          {narrativeCount > 0 && (
            <button
              onClick={() => setActiveCategory('narrative')}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                activeCategory === 'narrative'
                  ? 'border-brand-blue bg-brand-blue/10 text-brand-blue font-medium'
                  : 'text-muted-foreground hover:border-brand-blue/30 hover:text-foreground'
              }`}
            >
              <BookOpen className="h-3 w-3" />
              서사
              <span className="text-xs opacity-60">({narrativeCount})</span>
            </button>
          )}
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

      {/* Series Banners — 전체 또는 서사 필터에서만 표시 */}
      {(activeCategory === 'all' || activeCategory === 'narrative') && seriesWithPosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {seriesWithPosts.map((s) => {
            const SIcon = s.icon;
            return (
              <Link
                key={s.id}
                href={`/blog/${s.firstSlug}`}
                prefetch={false}
                className="group rounded-lg border bg-gradient-to-br from-blue-50/50 to-green-50/50 dark:from-blue-950/20 dark:to-green-950/20 p-5 transition-all hover:border-brand-blue/50 hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <SIcon className="h-4 w-4 text-brand-blue" />
                  <span className="text-sm font-semibold group-hover:text-brand-blue transition-colors">{s.title}</span>
                  <Badge variant="outline" className="ml-auto text-xs">{s.postCount}편</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{s.description}</p>
                <p className="text-xs italic text-brand-blue/60">&ldquo;{s.tagline}&rdquo;</p>
              </Link>
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
          prefetch={false}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:underline"
        >
          서비스 가이드 보기 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
