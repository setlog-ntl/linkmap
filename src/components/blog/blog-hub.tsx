'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Calendar, Link2, Check, BookOpen } from 'lucide-react';
import { IconTooltip } from '@/components/ui/icon-tooltip';
import { Badge } from '@/components/ui/badge';
import {
  BLOG_TOPIC_TAGS,
  getTopicTagOrder,
  type BlogTopicTag,
} from '@/data/blog/blog-tags';
import { BLOG_SERIES, getSeriesPostSlugs } from '@/data/blog/blog-series';
import type { BlogPostMeta } from '@/data/blog/posts';

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

/* ── Primary Featured Card — 목록 상단 1개 대형 카드 ── */
function PrimaryFeaturedCard({ post }: { post: BlogPostMeta }) {
  const primaryTag = BLOG_TOPIC_TAGS[post.topicTags[0]];
  const PrimaryIcon = primaryTag.icon;
  const isNarrative = post.contentType === 'narrative';

  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={false}
      className="group relative flex flex-col gap-5 rounded-xl border-2 border-border bg-card p-7 md:p-10 shadow-sm transition-all duration-200 hover:border-brand-blue/40 hover:shadow-md"
    >
      {/* 상단 메타 행 */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue/10">
          <PrimaryIcon className="h-4.5 w-4.5 text-brand-blue" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">{primaryTag.label}</span>
        {isNarrative && (
          <Badge variant="outline" className="text-xs border-brand-green/40 text-brand-green">
            <BookOpen className="mr-1 h-3 w-3" />스토리
          </Badge>
        )}
        {isNarrative && post.series && (
          <Badge variant="outline" className="text-xs border-brand-blue/30 text-brand-blue">
            {post.series.order}/{post.series.totalParts ?? '?'}편
          </Badge>
        )}
        {/* 최신 포스트 신선도 표시 */}
        <span className="ml-auto text-xs font-medium text-brand-blue/60 tabular-nums">
          NEW
        </span>
      </div>

      {/* 내러티브 훅 */}
      {isNarrative && post.narrativeHook && (
        <p className="text-sm italic text-brand-blue/60 dark:text-brand-blue/40 border-l-2 border-brand-blue/20 pl-3">
          &ldquo;{post.narrativeHook}&rdquo;
        </p>
      )}

      {/* 제목 + 설명 */}
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-brand-blue transition-colors duration-200 line-clamp-2 leading-tight">
          {post.title}
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>

      {/* 하단 메타 */}
      <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDateKR(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime}
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-brand-blue font-medium translate-x-0 group-hover:translate-x-1 transition-transform duration-200">
          읽기 <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

/* ── Secondary Featured Card — Primary 옆 보조 카드 ── */
function SecondaryFeaturedCard({ post }: { post: BlogPostMeta }) {
  const primaryTag = BLOG_TOPIC_TAGS[post.topicTags[0]];
  const PrimaryIcon = primaryTag.icon;
  const isNarrative = post.contentType === 'narrative';

  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={false}
      className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-brand-blue/40 hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-blue/10">
          <PrimaryIcon className="h-3.5 w-3.5 text-brand-blue" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">{primaryTag.label}</span>
        {isNarrative && (
          <Badge variant="outline" className="text-xs border-brand-green/40 text-brand-green">
            스토리
          </Badge>
        )}
      </div>

      <div className="space-y-2 flex-1">
        <h3 className="text-lg font-bold group-hover:text-brand-blue transition-colors duration-200 line-clamp-3 leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {post.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>{formatDateKR(post.publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime}
          </span>
        </div>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all duration-200" />
      </div>
    </Link>
  );
}

/* ── 일반 PostCard ── */
function PostCard({ post }: { post: BlogPostMeta }) {
  const primaryTag = BLOG_TOPIC_TAGS[post.topicTags[0]];
  const PrimaryIcon = primaryTag.icon;
  const isNarrative = post.contentType === 'narrative';

  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={false}
      className="group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-brand-blue/40 hover:shadow-md hover:-translate-y-px"
    >
      {/* 태그 + 복사 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PrimaryIcon className="h-3.5 w-3.5 text-brand-blue/70" />
          <span className="text-xs font-medium text-muted-foreground">{primaryTag.label}</span>
          {isNarrative && (
            <span className="text-xs text-brand-green font-medium">스토리</span>
          )}
        </div>
        <CopyLinkButton slug={post.slug} />
      </div>

      {/* 제목 + 설명 */}
      <div className="space-y-1.5 flex-1">
        <h3 className="font-semibold group-hover:text-brand-blue transition-colors duration-200 line-clamp-2 leading-snug text-[0.9375rem]">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {post.description}
        </p>
      </div>

      {/* 날짜 + 읽기시간 */}
      <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>{formatDateKR(post.publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime}
          </span>
        </div>
        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 text-brand-blue" />
      </div>
    </Link>
  );
}

export function BlogHub({ posts }: { posts: BlogPostMeta[] }) {
  const allTags = getTopicTagOrder();
  const tagsWithPosts = allTags.filter(
    (tag) => posts.some((p) => p.topicTags.includes(tag))
  );

  const [activeTags, setActiveTags] = useState<Set<BlogTopicTag>>(new Set());
  const [showNarrativeOnly, setShowNarrativeOnly] = useState(false);

  const narrativeCount = useMemo(() => posts.filter((p) => p.contentType === 'narrative').length, [posts]);

  const toggleTag = useCallback((tag: BlogTopicTag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveTags(new Set());
    setShowNarrativeOnly(false);
  }, []);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeTags.size > 0) {
      result = result.filter((p) => p.topicTags.some((t) => activeTags.has(t)));
    }
    if (showNarrativeOnly) {
      result = result.filter((p) => p.contentType === 'narrative');
    }
    return result;
  }, [posts, activeTags, showNarrativeOnly]);

  const isAllActive = activeTags.size === 0 && !showNarrativeOnly;
  const hasFilter = !isAllActive;

  // Featured: 필터 없을 때 최신 2개를 비대칭 레이아웃으로 분리
  const featuredPosts = isAllActive ? filteredPosts.slice(0, 2) : [];
  const remainingPosts = isAllActive ? filteredPosts.slice(2) : filteredPosts;

  // 시리즈 배너 데이터
  const seriesWithPosts = useMemo(() =>
    BLOG_SERIES
      .map((s) => {
        const slugs = getSeriesPostSlugs(s.id, posts);
        return { ...s, postCount: slugs.length, firstSlug: slugs[0] };
      })
      .filter((s) => s.postCount > 0),
    [posts],
  );

  // 태그별 그룹핑 (전체일 때만)
  const groupedPosts = useMemo(() => {
    if (hasFilter) {
      return [{ key: 'filtered' as const, label: '', description: '', icon: BookOpen, posts: remainingPosts }];
    }
    return tagsWithPosts
      .map((tag) => ({
        key: tag,
        ...BLOG_TOPIC_TAGS[tag],
        posts: remainingPosts.filter((p) => p.topicTags.includes(tag)),
      }))
      .filter((g) => g.posts.length > 0);
  }, [remainingPosts, hasFilter, tagsWithPosts]);

  const activeFilterCount = activeTags.size + (showNarrativeOnly ? 1 : 0);

  return (
    <div className="py-12 md:py-16 space-y-10">

      {/* ── Hero ── */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">블로그</h1>
            <p className="text-muted-foreground max-w-lg">
              바이브 코딩, 환경변수 관리, 서비스 비교 — 실전 인사이트
            </p>
          </div>
          {/* 포스트 수 카운터 — 신뢰 신호 */}
          <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0 pb-0.5">
            <span className="text-2xl font-bold tabular-nums text-foreground">{posts.length}</span>
            <span className="text-xs text-muted-foreground">편의 글</span>
          </div>
        </div>

        {/* ── 필터 ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* 좌측: 전체/스토리 */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={clearFilters}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
                isAllActive
                  ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                  : 'border-border text-muted-foreground hover:border-brand-blue/30 hover:text-foreground'
              }`}
            >
              전체
              {isAllActive && (
                <span className="ml-1.5 text-xs tabular-nums opacity-60">{posts.length}</span>
              )}
            </button>

            {narrativeCount > 0 && (
              <button
                onClick={() => setShowNarrativeOnly((prev) => !prev)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
                  showNarrativeOnly
                    ? 'border-brand-green bg-brand-green/10 text-brand-green'
                    : 'border-border text-muted-foreground hover:border-brand-green/30 hover:text-foreground'
                }`}
              >
                <BookOpen className="h-3 w-3" />
                스토리
              </button>
            )}
          </div>

          {/* 구분선 */}
          <div className="shrink-0 w-px h-5 bg-border" />

          {/* 우측: 태그 필터 — 스크롤 가능 */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {tagsWithPosts.map((tagKey) => {
              const tag = BLOG_TOPIC_TAGS[tagKey];
              const TagIcon = tag.icon;
              const isActive = activeTags.has(tagKey);
              return (
                <button
                  key={tagKey}
                  onClick={() => toggleTag(tagKey)}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
                    isActive
                      ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                      : 'border-border text-muted-foreground hover:border-brand-blue/30 hover:text-foreground'
                  }`}
                >
                  <TagIcon className="h-3 w-3 shrink-0" />
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 활성 필터 요약 */}
        {hasFilter && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {filteredPosts.length}개 결과
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-brand-blue hover:underline text-xs"
              >
                필터 초기화
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Featured — 비대칭 editorial 레이아웃 ── */}
      {featuredPosts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Primary: 3/5 너비 */}
          <div className="lg:col-span-3">
            <PrimaryFeaturedCard post={featuredPosts[0]} />
          </div>
          {/* Secondary: 2/5 너비 */}
          {featuredPosts[1] && (
            <div className="lg:col-span-2">
              <SecondaryFeaturedCard post={featuredPosts[1]} />
            </div>
          )}
        </div>
      )}

      {/* ── 시리즈 배너 (전체 또는 스토리에서만) ── */}
      {(isAllActive || (showNarrativeOnly && activeTags.size === 0)) && seriesWithPosts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            <div className="h-px flex-1 bg-border" />
            <span>시리즈</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {seriesWithPosts.map((s) => {
              const SIcon = s.icon;
              return (
                <Link
                  key={s.id}
                  href={`/blog/${s.firstSlug}`}
                  prefetch={false}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-brand-blue/40 hover:shadow-sm"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue/10 shrink-0">
                    <SIcon className="h-4 w-4 text-brand-blue" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-semibold group-hover:text-brand-blue transition-colors duration-200">{s.title}</span>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.postCount}편 연재</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 포스트 목록 ── */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <p className="text-muted-foreground">선택한 필터에 해당하는 글이 없습니다.</p>
          <button onClick={clearFilters} className="text-sm text-brand-blue hover:underline">
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedPosts.map((group) => {
            const GroupIcon = group.icon;
            return (
              <section key={group.key}>
                {/* 그룹 섹션 헤더 */}
                {isAllActive && group.label && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-blue/10">
                      <GroupIcon className="h-3.5 w-3.5 text-brand-blue" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">{group.label}</h2>
                      {group.description && (
                        <span className="text-xs text-muted-foreground">{group.description}</span>
                      )}
                    </div>
                    <div className="ml-auto h-px flex-1 bg-border max-w-24" />
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

      {/* ── 하단 CTA ── */}
      <div className="rounded-xl border-2 border-brand-blue/15 bg-card p-7 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="space-y-1.5 flex-1">
            <p className="font-semibold text-foreground">실전 설정이 궁금하다면</p>
            <p className="text-sm text-muted-foreground">
              90+ 서비스 연결 방법을 단계별 가이드로 확인하세요.
            </p>
          </div>
          <Link
            href="/guides"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-blue/10 px-4 py-2.5 text-sm font-semibold text-brand-blue transition-colors hover:bg-brand-blue/15 shrink-0"
          >
            서비스 가이드 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
