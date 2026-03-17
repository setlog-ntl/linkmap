'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, ChevronDown, BookOpen, LayoutGrid } from 'lucide-react';
import { GUIDE_CATEGORIES, GUIDE_LIST, LEARNING_PATHS, getSubGuides, type GuideCategory } from '@/data/ui/guide-meta';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type TabKey = 'all' | GuideCategory;

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: '전체보기' },
  { key: 'concept', label: '기본 개념' },
  { key: 'service', label: '서비스 가이드' },
];

export function GuidesHub() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  function toggleCard(slug: string) {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  const filteredGuides = activeTab === 'all'
    ? GUIDE_LIST
    : GUIDE_LIST.filter(g => g.category === activeTab);

  return (
    <div className="py-12 md:py-16 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          가이드
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          바이브 코딩에 필요한 개념과 서비스 설정을 쉽게 따라할 수 있도록 정리했습니다
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-t-lg cursor-pointer',
              activeTab === tab.key
                ? 'text-brand-blue border-b-2 border-brand-blue bg-brand-blue/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            {tab.label}
            {tab.key === 'all' && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                {GUIDE_LIST.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Learning Paths — 전체보기/기본개념 탭에서만 표시 */}
      {(activeTab === 'all' || activeTab === 'concept') && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-blue" />
            <h2 className="text-xl font-semibold">러닝패스</h2>
          </div>
          <p className="text-sm text-muted-foreground">목표에 맞는 학습 순서를 따라가 보세요</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LEARNING_PATHS.map((path) => {
              const PathIcon = path.icon;
              const pathGuides = path.guideSlugs
                .map(slug => GUIDE_LIST.find(g => g.slug === slug))
                .filter(Boolean);

              return (
                <div
                  key={path.id}
                  className="rounded-lg border bg-card shadow-sm p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <PathIcon className="h-5 w-5 text-brand-blue" />
                    </div>
                    {path.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {path.badge}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{path.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{path.description}</p>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {pathGuides.map((guide, i) => {
                      if (!guide) return null;
                      const GuideIcon = guide.icon;
                      return (
                        <Link
                          key={guide.slug}
                          href={guide.href}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors text-sm"
                        >
                          <span className="w-5 h-5 rounded-full bg-brand-blue/10 text-brand-blue text-[10px] flex items-center justify-center shrink-0 font-bold">
                            {i + 1}
                          </span>
                          <GuideIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{guide.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Guide Cards */}
      {activeTab === 'all' ? (
        // 전체보기: 카테고리 섹션별로 표시
        (['concept', 'service'] as GuideCategory[]).map((catKey) => {
          const cat = GUIDE_CATEGORIES[catKey];
          const CatIcon = cat.icon;
          const guides = GUIDE_LIST.filter(g => g.category === catKey);

          return (
            <section key={catKey} className="space-y-4">
              <div className="flex items-center gap-2">
                <CatIcon className="h-5 w-5 text-brand-blue" />
                <h2 className="text-xl font-semibold">{cat.label}</h2>
                <span className="text-xs text-muted-foreground">({guides.length})</span>
              </div>
              <p className="text-sm text-muted-foreground">{cat.description}</p>

              <GuideCardGrid
                guides={guides}
                expandedCards={expandedCards}
                onToggle={toggleCard}
              />
            </section>
          );
        })
      ) : (
        // 개별 탭: 바로 카드 그리드
        <section className="space-y-4">
          <GuideCardGrid
            guides={filteredGuides}
            expandedCards={expandedCards}
            onToggle={toggleCard}
          />
        </section>
      )}
    </div>
  );
}

// ── 카드 그리드 컴포넌트 (중복 제거) ──

function GuideCardGrid({
  guides,
  expandedCards,
  onToggle,
}: {
  guides: typeof GUIDE_LIST;
  expandedCards: Set<string>;
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {guides.map((guide) => {
        const Icon = guide.icon;
        const subGuides = getSubGuides(guide.slug);
        const isExpanded = expandedCards.has(guide.slug);
        const hasChildren = subGuides.length > 0;

        return (
          <div
            key={guide.slug}
            className={cn(
              'group relative flex flex-col rounded-lg border bg-card shadow-sm transition-all',
              isExpanded ? 'border-brand-blue/50 shadow-md' : 'hover:border-brand-blue/50 hover:shadow-md'
            )}
          >
            {/* Card Main */}
            <Link
              href={guide.href}
              className="flex flex-col gap-3 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-5 w-5 text-brand-blue" />
                </div>
                {guide.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {guide.badge}
                  </Badge>
                )}
              </div>

              <div className="space-y-1.5">
                <h3 className="font-semibold group-hover:text-brand-blue transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {guide.description}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-2">
                {guide.readingTime && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {guide.readingTime}
                  </span>
                )}
                {!hasChildren && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all ml-auto" />
                )}
              </div>
            </Link>

            {/* Sub Guide Toggle + List */}
            {hasChildren && (
              <>
                <button
                  onClick={() => onToggle(guide.slug)}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium text-brand-blue hover:bg-muted/50 transition-colors border-t cursor-pointer"
                >
                  <span>하위 가이드 {subGuides.length}개</span>
                  <ChevronDown className={cn(
                    'h-3 w-3 transition-transform duration-200',
                    isExpanded && 'rotate-180'
                  )} />
                </button>
                <div className={cn(
                  'overflow-hidden transition-all duration-300',
                  isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                )}>
                  <div className="border-t px-2 py-1.5">
                    {subGuides.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.slug}
                          href={sub.href}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-muted/70 shrink-0">
                            <SubIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{sub.title}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{sub.description}</p>
                          </div>
                          <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
