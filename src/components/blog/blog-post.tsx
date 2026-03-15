'use client';

import { useState, useEffect, useMemo, type ReactNode, type ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, ExternalLink, ChevronRight, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BLOG_CATEGORIES, getPublishedPosts, type BlogPost } from '@/data/blog/posts';
import { GUIDE_LIST } from '@/data/ui/guide-meta';

// ---------------------------------------------------------------------------
// Callout parser — blockquote 첫 줄 접두사로 유형 판별
// ---------------------------------------------------------------------------
type CalloutType = 'tip' | 'warning' | 'key' | 'info' | 'try';

const CALLOUT_MAP: Record<string, { type: CalloutType; label: string; border: string; bg: string; text: string }> = {
  'TIP:':     { type: 'tip',     label: 'TIP',     border: 'border-l-brand-green', bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-800 dark:text-green-300' },
  'WARNING:': { type: 'warning', label: 'WARNING',  border: 'border-l-amber-500',   bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-800 dark:text-amber-300' },
  'KEY:':     { type: 'key',     label: 'KEY',      border: 'border-l-brand-blue',  bg: 'bg-blue-50 dark:bg-blue-950/30',   text: 'text-blue-800 dark:text-blue-300' },
  'INFO:':    { type: 'info',    label: 'INFO',     border: 'border-l-purple-500',  bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-800 dark:text-purple-300' },
  'TRY:':     { type: 'try',     label: 'TRY IT',   border: 'border-l-brand-blue',  bg: 'bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30', text: 'text-blue-800 dark:text-blue-300' },
};

function parseCallout(children: ReactNode): { callout: (typeof CALLOUT_MAP)[string]; content: ReactNode } | null {
  const text = extractText(children);
  for (const [prefix, callout] of Object.entries(CALLOUT_MAP)) {
    if (text.trimStart().startsWith(prefix)) {
      return { callout, content: children };
    }
  }
  return null;
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

// ---------------------------------------------------------------------------
// Custom Markdown components
// ---------------------------------------------------------------------------
function CustomBlockquote({ children, ...props }: ComponentPropsWithoutRef<'blockquote'>) {
  const callout = parseCallout(children);
  if (callout) {
    const { callout: c } = callout;
    return (
      <div className={`not-prose my-6 rounded-lg border-l-4 ${c.border} ${c.bg} p-4`}>
        <div className={`text-xs font-bold tracking-wider mb-1 ${c.text}`}>{c.label}</div>
        <div className="text-sm leading-relaxed [&_p]:m-0 [&_strong]:font-semibold">{children}</div>
      </div>
    );
  }
  return <blockquote {...props}>{children}</blockquote>;
}

function CustomLink({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (!href) return <span {...props}>{children}</span>;

  // Internal link → Next.js Link
  if (href.startsWith('/')) {
    const isGuide = href.startsWith('/guides/');
    const isService = href.startsWith('/services/');
    const isBlog = href.startsWith('/blog/');
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-1 font-medium transition-colors ${
          isGuide ? 'text-green-600 dark:text-green-400 hover:text-green-700' :
          isService ? 'text-purple-600 dark:text-purple-400 hover:text-purple-700' :
          isBlog ? 'text-brand-blue hover:text-blue-700' :
          'text-brand-blue hover:text-blue-700'
        }`}
      >
        {children}
        <ChevronRight className="h-3 w-3" />
      </Link>
    );
  }

  // External link
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline inline-flex items-center gap-1" {...props}>
      {children}
      <ExternalLink className="h-3 w-3 inline" />
    </a>
  );
}

function CustomH2({ children, ...props }: ComponentPropsWithoutRef<'h2'>) {
  const id = extractText(children).toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, '');
  return (
    <h2 id={id} className="scroll-mt-20 group" {...props}>
      <a href={`#${id}`} className="no-underline hover:no-underline">
        {children}
      </a>
    </h2>
  );
}

function CustomTable({ children, ...props }: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm" {...props}>{children}</table>
    </div>
  );
}
function CustomThead({ children, ...props }: ComponentPropsWithoutRef<'thead'>) {
  return <thead className="bg-muted/50 text-left" {...props}>{children}</thead>;
}
function CustomTh({ children, ...props }: ComponentPropsWithoutRef<'th'>) {
  return <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground" {...props}>{children}</th>;
}
function CustomTd({ children, ...props }: ComponentPropsWithoutRef<'td'>) {
  return <td className="px-4 py-3 border-t" {...props}>{children}</td>;
}

function CustomCode({ children, className, ...props }: ComponentPropsWithoutRef<'code'>) {
  // Inline code
  if (!className) {
    return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono before:content-none after:content-none" {...props}>{children}</code>;
  }
  // Code block is handled by <pre> wrapper
  return <code className={className} {...props}>{children}</code>;
}

function CustomPre({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  return (
    <div className="not-prose my-6">
      <pre className="rounded-lg border bg-slate-950 dark:bg-slate-900 p-4 overflow-x-auto text-sm leading-relaxed" {...props}>
        {children}
      </pre>
    </div>
  );
}

function CustomHr() {
  return <div className="not-prose my-10 flex items-center justify-center gap-2 text-muted-foreground/30"><span className="h-px flex-1 bg-current" /><span className="text-xs">***</span><span className="h-px flex-1 bg-current" /></div>;
}

function CustomLi({ children, ...props }: ComponentPropsWithoutRef<'li'>) {
  const text = extractText(children);
  // Checkbox style lists
  if (text.startsWith('[ ] ') || text.startsWith('[x] ')) {
    const checked = text.startsWith('[x] ');
    return (
      <li className="flex items-start gap-2 list-none -ml-6" {...props}>
        <span className={`mt-1 h-4 w-4 rounded border flex-shrink-0 flex items-center justify-center text-xs ${checked ? 'bg-brand-blue border-brand-blue text-white' : 'border-muted-foreground/30'}`}>
          {checked ? '\u2713' : ''}
        </span>
        <span className={checked ? 'line-through text-muted-foreground' : ''}>{children}</span>
      </li>
    );
  }
  return <li {...props}>{children}</li>;
}

const MD_COMPONENTS = {
  blockquote: CustomBlockquote,
  a: CustomLink,
  h2: CustomH2,
  table: CustomTable,
  thead: CustomThead,
  th: CustomTh,
  td: CustomTd,
  code: CustomCode,
  pre: CustomPre,
  hr: CustomHr,
  li: CustomLi,
};

// ---------------------------------------------------------------------------
// TOC (Table of Contents)
// ---------------------------------------------------------------------------
function TableOfContents({ content }: { content: string }) {
  const headings = useMemo(() => {
    const regex = /^## (.+)$/gm;
    const items: { text: string; id: string }[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      const text = match[1];
      const id = text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, '');
      items.push({ text, id });
    }
    return items;
  }, [content]);

  if (headings.length < 3) return null;

  return (
    <nav className="not-prose my-8 rounded-lg border bg-muted/30 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold mb-3">
        <List className="h-4 w-4 text-brand-blue" />
        목차
      </div>
      <ol className="space-y-1.5">
        {headings.map((h, i) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="text-sm text-muted-foreground hover:text-brand-blue transition-colors flex items-center gap-2"
            >
              <span className="text-xs text-muted-foreground/50 w-4 text-right">{i + 1}.</span>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Reading Progress Bar
// ---------------------------------------------------------------------------
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) setProgress((window.scrollY / docHeight) * 100);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-14 left-0 right-0 z-40 h-0.5 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-brand-blue to-brand-green transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CTA Card
// ---------------------------------------------------------------------------
function CtaCard() {
  return (
    <div className="not-prose my-10 rounded-xl border-2 border-brand-blue/20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 p-6 md:p-8 text-center">
      <h3 className="text-lg font-bold mb-2">서비스 연결, 시각적으로 관리하세요</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
        90+ 서비스 카탈로그, AES-256 암호화, GitHub Secrets 자동 배포.
        <br />무료로 시작하세요.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button asChild size="sm">
          <Link href="/signup">무료로 시작하기</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/services">서비스 카탈로그</Link>
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Post Navigation (prev/next)
// ---------------------------------------------------------------------------
function PostNavigation({ currentSlug }: { currentSlug: string }) {
  const posts = getPublishedPosts();
  const idx = posts.findIndex((p) => p.slug === currentSlug);
  const prev = idx < posts.length - 1 ? posts[idx + 1] : null;
  const next = idx > 0 ? posts[idx - 1] : null;

  if (!prev && !next) return null;

  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prev ? (
        <Link href={`/blog/${prev.slug}`} className="group rounded-lg border p-4 hover:border-brand-blue/50 transition-colors">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> 이전 글</div>
          <div className="text-sm font-medium group-hover:text-brand-blue transition-colors line-clamp-2">{prev.title}</div>
        </Link>
      ) : <div />}
      {next ? (
        <Link href={`/blog/${next.slug}`} className="group rounded-lg border p-4 hover:border-brand-blue/50 transition-colors text-right">
          <div className="text-xs text-muted-foreground mb-1 flex items-center justify-end gap-1">다음 글 <ArrowRight className="h-3 w-3" /></div>
          <div className="text-sm font-medium group-hover:text-brand-blue transition-colors line-clamp-2">{next.title}</div>
        </Link>
      ) : <div />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
interface BlogPostViewProps {
  post: BlogPost;
}

export function BlogPostView({ post }: BlogPostViewProps) {
  const cat = BLOG_CATEGORIES[post.category];
  const CatIcon = cat.icon;

  const relatedGuides = (post.relatedGuides ?? [])
    .map((slug) => GUIDE_LIST.find((g) => g.slug === slug))
    .filter(Boolean);

  // Split content at "---" to insert CTA in middle
  const contentParts = post.content.split(/\n---\n/);
  const firstHalf = contentParts.slice(0, Math.ceil(contentParts.length / 2)).join('\n---\n');
  const secondHalf = contentParts.slice(Math.ceil(contentParts.length / 2)).join('\n---\n');

  return (
    <>
      <ReadingProgress />
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
        <header className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
              <CatIcon className="h-4 w-4 text-brand-blue" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{cat.label}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">{post.description}</p>

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

        {/* Table of Contents */}
        <TableOfContents content={post.content} />

        {/* Content — first half */}
        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-p:leading-relaxed prose-img:rounded-lg prose-strong:text-foreground">
          <ReactMarkdown components={MD_COMPONENTS}>{firstHalf}</ReactMarkdown>
        </div>

        {/* Mid-article CTA */}
        {secondHalf && <CtaCard />}

        {/* Content — second half */}
        {secondHalf && (
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-p:leading-relaxed prose-img:rounded-lg prose-strong:text-foreground">
            <ReactMarkdown components={MD_COMPONENTS}>{secondHalf}</ReactMarkdown>
          </div>
        )}

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
            <a href={post.crossPostUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">외부 플랫폼</a>
            <span>에도 게시되었습니다.</span>
          </div>
        )}

        {/* Post Navigation */}
        <PostNavigation currentSlug={post.slug} />

        {/* Back to list */}
        <div className="mt-10 pt-8 border-t">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            전체 글 보기
          </Link>
        </div>
      </article>
    </>
  );
}
