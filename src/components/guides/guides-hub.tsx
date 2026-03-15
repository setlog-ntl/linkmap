'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, ChevronDown } from 'lucide-react';
import { GUIDE_CATEGORIES, GUIDE_LIST, getSubGuides, type GuideCategory } from '@/data/ui/guide-meta';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const categoryOrder: GuideCategory[] = ['concept', 'service'];

export function GuidesHub() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  function toggleCard(slug: string) {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

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

      {/* Category Sections */}
      {categoryOrder.map((catKey) => {
        const cat = GUIDE_CATEGORIES[catKey];
        const CatIcon = cat.icon;
        const guides = GUIDE_LIST.filter(g => g.category === catKey);

        return (
          <section key={catKey} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center gap-2">
              <CatIcon className="h-5 w-5 text-brand-blue" />
              <h2 className="text-xl font-semibold">{cat.label}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{cat.description}</p>

            {/* Cards Grid */}
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
                    {/* Card Main — 클릭 시 개요 페이지 이동 */}
                    <Link
                      href={guide.href}
                      className="flex flex-col gap-3 p-5"
                    >
                      {/* Icon + Badge row */}
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

                      {/* Title + Description */}
                      <div className="space-y-1.5">
                        <h3 className="font-semibold group-hover:text-brand-blue transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {guide.description}
                        </p>
                      </div>

                      {/* Footer — readingTime */}
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
                          onClick={() => toggleCard(guide.slug)}
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
          </section>
        );
      })}
    </div>
  );
}
