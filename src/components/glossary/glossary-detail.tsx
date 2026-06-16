import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Code2,
  Link2,
  ExternalLink,
} from 'lucide-react';
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_DIFFICULTY,
  getGlossaryEmoji,
  getRelatedGlossaryEntries,
  type GlossaryEntry,
} from '@/data/seo/glossary-terms';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function GlossaryDetail({ entry }: { entry: GlossaryEntry }) {
  const cat = GLOSSARY_CATEGORIES[entry.category];
  const diff = GLOSSARY_DIFFICULTY[entry.difficulty];
  const related = getRelatedGlossaryEntries(entry);
  const showDefinition = entry.definition && entry.definition !== entry.oneLiner;

  return (
    <article className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link href="/" prefetch={false} className="hover:text-foreground transition-colors">
          홈
        </Link>
        <span>/</span>
        <Link href="/glossary" prefetch={false} className="hover:text-foreground transition-colors">
          용어사전
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{entry.term}</span>
      </nav>

      {/* Header */}
      <header className="flex items-start gap-4 mb-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-muted text-4xl">
          {getGlossaryEmoji(entry)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Badge variant="secondary" className="text-xs">
              {cat.emoji} {cat.label}
            </Badge>
            <Badge variant="outline" className={cn('text-xs', diff.className)}>
              {diff.label}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{entry.term}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{entry.termEn}</p>
        </div>
      </header>

      {/* 한 줄 정의 (lead) */}
      <p className="text-lg leading-relaxed text-foreground border-l-4 border-brand-blue pl-4 py-1 mb-8">
        {entry.oneLiner}
      </p>

      {/* 🎯 비유 — 초보자용 콜아웃 */}
      {entry.analogy && (
        <section className="mb-8 rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-5">
          <div className="flex items-center gap-2 mb-2 text-brand-blue">
            <Lightbulb className="h-4 w-4" />
            <h2 className="font-semibold text-sm">쉽게 말하면</h2>
          </div>
          <p className="font-semibold text-foreground mb-1.5">{entry.analogy.title}</p>
          <p className="text-sm text-foreground/90 leading-relaxed">{entry.analogy.body}</p>
        </section>
      )}

      {/* 📖 자세히 */}
      {showDefinition && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">자세히</h2>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{entry.definition}</p>
        </section>
      )}

      {/* 영문 정의 */}
      <p className="text-sm text-muted-foreground italic mb-8">{entry.definitionEn}</p>

      {/* 💡 실제 예시 */}
      {entry.example && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">실제 예시</h2>
          </div>
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-sm text-foreground/90 leading-relaxed font-mono">{entry.example}</p>
          </div>
        </section>
      )}

      {/* 🔗 관련 용어 */}
      {related.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">관련 용어</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/glossary/${rel.slug}`}
                prefetch={false}
                className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm hover:border-brand-blue/50 hover:text-brand-blue transition-colors"
              >
                <span>{getGlossaryEmoji(rel)}</span>
                {rel.term}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 📚 더 알아보기 */}
      {entry.sources && entry.sources.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">더 알아보기</h2>
          </div>
          <div className="grid gap-2">
            {entry.sources.map((src) => {
              const isExternal = src.href.startsWith('http');
              const inner = (
                <>
                  <span className="text-sm font-medium">{src.label}</span>
                  {isExternal ? (
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </>
              );
              return isExternal ? (
                <a
                  key={src.href}
                  href={src.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-lg border bg-card px-4 py-3 hover:border-brand-blue/50 transition-colors"
                >
                  {inner}
                </a>
              ) : (
                <Link
                  key={src.href}
                  href={src.href}
                  prefetch={false}
                  className="group flex items-center gap-2 rounded-lg border bg-card px-4 py-3 hover:border-brand-blue/50 transition-colors"
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 돌아가기 */}
      <div className="border-t pt-6 mt-10">
        <Link
          href="/glossary"
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand-blue transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          용어사전으로 돌아가기
        </Link>
      </div>
    </article>
  );
}
