'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Clock, Tag, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BLOG_CATEGORIES, type BlogPost } from '@/data/blog/posts';
import { GUIDE_LIST } from '@/data/ui/guide-meta';

interface BlogPostViewProps {
  post: BlogPost;
}

export function BlogPostView({ post }: BlogPostViewProps) {
  const cat = BLOG_CATEGORIES[post.category];
  const CatIcon = cat.icon;

  const relatedGuides = (post.relatedGuides ?? [])
    .map((slug) => GUIDE_LIST.find((g) => g.slug === slug))
    .filter(Boolean);

  return (
    <article className="py-12 md:py-16 max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand-blue transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        블로그 목록
      </Link>

      {/* Header */}
      <header className="mb-10 space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <CatIcon className="h-4 w-4 text-brand-blue" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">{cat.label}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-lg text-muted-foreground">{post.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.publishedAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readingTime}
          </span>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-p:leading-relaxed prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-950 prose-pre:border prose-img:rounded-lg prose-blockquote:border-brand-blue prose-blockquote:bg-muted/30 prose-blockquote:py-1">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <div className="mt-12 rounded-lg border bg-muted/30 p-6">
          <h3 className="font-semibold mb-3">관련 가이드</h3>
          <div className="space-y-2">
            {relatedGuides.map((guide) => {
              if (!guide) return null;
              const GIcon = guide.icon;
              return (
                <Link
                  key={guide.slug}
                  href={guide.href}
                  className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors"
                >
                  <GIcon className="h-4 w-4 text-brand-blue" />
                  <span className="text-sm font-medium">{guide.title}</span>
                  {guide.readingTime && (
                    <span className="text-xs text-muted-foreground ml-auto">{guide.readingTime}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Cross-post notice */}
      {post.crossPostUrl && (
        <div className="mt-6 text-sm text-muted-foreground flex items-center gap-1">
          <ExternalLink className="h-3 w-3" />
          <span>이 글은</span>
          <a
            href={post.crossPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue hover:underline"
          >
            외부 플랫폼
          </a>
          <span>에도 게시되었습니다.</span>
        </div>
      )}

      {/* Back to list */}
      <div className="mt-12 pt-8 border-t">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          전체 글 보기
        </Link>
      </div>
    </article>
  );
}
