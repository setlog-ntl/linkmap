'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, ChevronDown, BookOpen } from 'lucide-react';
import {
  GUIDE_CATEGORIES,
  GUIDE_LIST,
  LEARNING_PATHS,
  LEARNING_STAGES,
  getSubGuides,
  type GuideCategory,
} from '@/data/ui/guide-meta';
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
  const [collapsedStages, setCollapsedStages] = useState<Set<string>>(new Set());

  function toggleCard(slug: string) {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleStage(stageId: string) {
    setCollapsedStages(prev => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
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
      {/* 모바일: 가로 스크롤 가능 표시를 위해 우측 페이드 마스크 적용 */}
      <div className="flex gap-1 overflow-x-auto scrollbar-none border-b pb-px [mask-image:linear-gradient(to_right,black_85%,transparent)] md:[mask-image:none]">
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
                          prefetch={false}
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
        <>
          {/* 기본 개념 — 학습 단계별 그룹 */}
          <ConceptStageSection
            collapsedStages={collapsedStages}
            onToggleStage={toggleStage}
            expandedCards={expandedCards}
            onToggleCard={toggleCard}
          />

          {/* 서비스 가이드 */}
          {(() => {
            const cat = GUIDE_CATEGORIES.service;
            const CatIcon = cat.icon;
            const guides = GUIDE_LIST.filter(g => g.category === 'service');
            return (
              <section className="space-y-4">
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
          })()}
        </>
      ) : activeTab === 'concept' ? (
        <ConceptStageSection
          collapsedStages={collapsedStages}
          onToggleStage={toggleStage}
          expandedCards={expandedCards}
          onToggleCard={toggleCard}
        />
      ) : (
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

// ── 기본 개념: 학습 단계별 그룹 ──

const STAGE_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  start: { dot: 'bg-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  develop: { dot: 'bg-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
  polish: { dot: 'bg-violet-500', bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400' },
  deploy: { dot: 'bg-green-500', bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400' },
  scale: { dot: 'bg-rose-500', bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400' },
};

function ConceptStageSection({
  collapsedStages,
  onToggleStage,
  expandedCards,
  onToggleCard,
}: {
  collapsedStages: Set<string>;
  onToggleStage: (id: string) => void;
  expandedCards: Set<string>;
  onToggleCard: (slug: string) => void;
}) {
  const cat = GUIDE_CATEGORIES.concept;
  const CatIcon = cat.icon;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <CatIcon className="h-5 w-5 text-brand-blue" />
        <h2 className="text-xl font-semibold">{cat.label}</h2>
        <span className="text-xs text-muted-foreground">
          ({GUIDE_LIST.filter(g => g.category === 'concept').length})
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{cat.description}</p>

      {/* 단계별 진행 타임라인 */}
      <div className="space-y-3">
        {LEARNING_STAGES.map((stage, stageIdx) => {
          const StageIcon = stage.icon;
          const colors = STAGE_COLORS[stage.id] ?? STAGE_COLORS.start;
          const isCollapsed = collapsedStages.has(stage.id);
          const stageGuides = stage.slugs
            .map(slug => GUIDE_LIST.find(g => g.slug === slug))
            .filter(Boolean);

          return (
            <div key={stage.id} className="rounded-lg border bg-card shadow-sm overflow-hidden">
              {/* 단계 헤더 */}
              <button
                onClick={() => onToggleStage(stage.id)}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                {/* 단계 번호 */}
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shrink-0', colors.dot)}>
                  {stageIdx + 1}
                </div>
                <StageIcon className={cn('h-4 w-4 shrink-0', colors.text)} />
                <div className="flex-1 text-left min-w-0">
                  <span className="font-semibold text-sm">{stage.label}</span>
                  <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">{stage.description}</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{stageGuides.length}개</span>
                <ChevronDown className={cn(
                  'h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200',
                  !isCollapsed && 'rotate-180'
                )} />
              </button>

              {/* 단계 내 가이드 리스트 */}
              <div className={cn(
                'overflow-hidden transition-all duration-300',
                isCollapsed ? 'max-h-0' : 'max-h-[1000px]'
              )}>
                <div className="border-t divide-y">
                  {stageGuides.map((guide) => {
                    if (!guide) return null;
                    const Icon = guide.icon;
                    const subGuides = getSubGuides(guide.slug);
                    const hasChildren = subGuides.length > 0;
                    const isExpanded = expandedCards.has(guide.slug);

                    return (
                      <div key={guide.slug}>
                        <div className="flex items-center group">
                          <Link
                            href={guide.href}
                            prefetch={false}
                            className="flex-1 flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors min-w-0"
                          >
                            <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', colors.bg)}>
                              <Icon className={cn('h-4 w-4', colors.text)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm group-hover:text-brand-blue transition-colors truncate">
                                  {guide.title}
                                </span>
                                {guide.badge && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                                    {guide.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {guide.description}
                              </p>
                            </div>
                            {guide.readingTime && (
                              <span className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 hidden sm:flex">
                                <Clock className="h-3 w-3" />
                                {guide.readingTime}
                              </span>
                            )}
                            {!hasChildren && (
                              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-brand-blue shrink-0 ml-2" />
                            )}
                          </Link>
                          {hasChildren && (
                            <button
                              onClick={() => onToggleCard(guide.slug)}
                              className="flex items-center gap-1 px-3 py-3 text-[11px] font-medium text-brand-blue hover:bg-muted/50 transition-colors cursor-pointer shrink-0 border-l"
                            >
                              <span className="hidden sm:inline">하위</span> {subGuides.length}개
                              <ChevronDown className={cn(
                                'h-3 w-3 transition-transform duration-200',
                                isExpanded && 'rotate-180'
                              )} />
                            </button>
                          )}
                        </div>

                        {/* 서브가이드 확장 */}
                        {hasChildren && (
                          <div className={cn(
                            'overflow-hidden transition-all duration-300',
                            isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                          )}>
                            <div className="bg-muted/20 px-4 py-1.5 ml-4 mr-4 mb-2 rounded-lg">
                              {subGuides.map((sub) => {
                                const SubIcon = sub.icon;
                                return (
                                  <Link
                                    key={sub.slug}
                                    href={sub.href}
                                    prefetch={false}
                                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex h-5 w-5 items-center justify-center rounded bg-muted/70 shrink-0">
                                      <SubIcon className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <span className="text-xs font-medium truncate flex-1">{sub.title}</span>
                                    <ArrowRight className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── 카드 그리드 컴포넌트 (서비스 가이드용) ──

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
              prefetch={false}
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
                          prefetch={false}
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
