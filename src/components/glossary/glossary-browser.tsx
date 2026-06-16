'use client';

// ─────────────────────────────────────────────────────────────────────────
// 모바일 대응 규칙 (수정 시 유지할 것 — 상세: docs/glossary-system.md)
//  · 카드 그리드: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 (모바일 1열)
//  · 필터 칩 행: 숨기지 말고 scrollbar-none + 페이드 마스크로 가로 스크롤 어포던스 노출
//  · 터치 타깃: 칩·검색 X버튼 모바일 ≥44px(min-h-[44px] sm:min-h-0 / h-11 w-11)
//  · 전역 body{overflow-x:clip}이 페이지 가로 오버플로우를 가드 (memory: mobile-foundation)
// ─────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Sparkles, X } from 'lucide-react';
import {
  GLOSSARY_ENTRIES,
  GLOSSARY_CATEGORIES,
  GLOSSARY_DIFFICULTY,
  getGlossaryEmoji,
  isEnrichedEntry,
  type GlossaryCategory,
  type GlossaryEntry,
} from '@/data/seo/glossary-terms';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type CategoryFilter = 'all' | GlossaryCategory;

const CATEGORY_ORDER: GlossaryCategory[] = [
  'core',
  'auth',
  'security',
  'infra',
  'ai',
  'frontend',
  'backend',
  'devops',
];

function matchesQuery(entry: GlossaryEntry, q: string): boolean {
  const haystack = [
    entry.term,
    entry.termEn,
    entry.oneLiner,
    entry.slug,
    ...(entry.aliases ?? []),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export function GlossaryBrowser() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return GLOSSARY_ENTRIES.filter((entry) => {
      if (category !== 'all' && entry.category !== category) return false;
      if (normalizedQuery && !matchesQuery(entry, normalizedQuery)) return false;
      return true;
    });
  }, [category, normalizedQuery]);

  // 검색·카테고리 필터가 없으면 카테고리별 섹션, 있으면 단일 그리드
  const showGrouped = category === 'all' && !normalizedQuery;

  return (
    <div className="space-y-8">
      {/* 검색창 */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="용어 검색 — 예: 환경변수, API, OAuth, env..."
          className="w-full h-14 rounded-xl border bg-card shadow-sm pl-12 pr-14 text-base outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          aria-label="용어 검색"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            aria-label="검색어 지우기"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 카테고리 필터 칩 */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 [mask-image:linear-gradient(to_right,black_92%,transparent)] md:[mask-image:none]">
        <FilterChip active={category === 'all'} onClick={() => setCategory('all')}>
          전체
          <span className="ml-1.5 text-xs opacity-70">{GLOSSARY_ENTRIES.length}</span>
        </FilterChip>
        {CATEGORY_ORDER.map((key) => {
          const meta = GLOSSARY_CATEGORIES[key];
          const count = GLOSSARY_ENTRIES.filter((e) => e.category === key).length;
          return (
            <FilterChip key={key} active={category === key} onClick={() => setCategory(key)}>
              <span className="mr-1">{meta.emoji}</span>
              {meta.label}
              <span className="ml-1.5 text-xs opacity-70">{count}</span>
            </FilterChip>
          );
        })}
      </div>

      {/* 결과 */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-muted-foreground">
            &lsquo;<span className="font-medium text-foreground">{query}</span>&rsquo; 에 해당하는 용어를 찾지 못했어요.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="mt-4 text-sm text-brand-blue hover:underline"
          >
            전체 용어 보기
          </button>
        </div>
      ) : showGrouped ? (
        <div className="space-y-10">
          {CATEGORY_ORDER.map((key) => {
            const meta = GLOSSARY_CATEGORIES[key];
            const entries = filtered.filter((e) => e.category === key);
            if (entries.length === 0) return null;
            return (
              <section key={key}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{meta.emoji}</span>
                  <h2 className="text-lg font-semibold">{meta.label}</h2>
                  <span className="text-xs text-muted-foreground">{entries.length}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{meta.description}</p>
                <TermGrid entries={entries} />
              </section>
            );
          })}
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length}개 용어
          </p>
          <TermGrid entries={filtered} />
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        // 모바일 터치 타깃 44px(min-h), 데스크톱은 컴팩트(sm:min-h-0)
        'inline-flex items-center justify-center shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 min-h-[44px] sm:min-h-0 text-sm font-medium transition-colors cursor-pointer',
        active
          ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
          : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-brand-blue/40'
      )}
    >
      {children}
    </button>
  );
}

function TermGrid({ entries }: { entries: GlossaryEntry[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map((entry) => {
        const diff = GLOSSARY_DIFFICULTY[entry.difficulty];
        const enriched = isEnrichedEntry(entry);
        return (
          <Link
            key={entry.slug}
            href={`/glossary/${entry.slug}`}
            prefetch={false}
            className="group flex flex-col rounded-lg border bg-card shadow-sm p-5 transition-all hover:border-brand-blue/50 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-2xl leading-none">{getGlossaryEmoji(entry)}</span>
              <div className="flex items-center gap-1">
                {enriched && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 border-brand-blue/30 text-brand-blue gap-0.5"
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    비유
                  </Badge>
                )}
                <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', diff.className)}>
                  {diff.label}
                </Badge>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mb-1.5">
              <h3 className="font-semibold group-hover:text-brand-blue transition-colors">
                {entry.term}
              </h3>
              <span className="text-xs text-muted-foreground truncate">{entry.termEn}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{entry.oneLiner}</p>
            <div className="flex items-center justify-end pt-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-brand-blue transition-colors">
                자세히
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
