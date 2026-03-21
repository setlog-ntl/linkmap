'use client';

import { useState, useMemo } from 'react';
import { useShowcaseList } from '@/lib/queries/showcase';
import { ShowcaseCard } from '@/components/showcase/showcase-card';
import { ShowcaseLeaderboard } from '@/components/showcase/showcase-leaderboard';
import { MonthlyPicksSection } from '@/components/showcase/monthly-picks-section';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Sparkles, LayoutGrid, Crown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SHOWCASE_CATEGORIES, type ShowcaseCategory } from '@/types/core';
import { cn } from '@/lib/utils';

export default function ShowcasePage() {
  const { data: showcases, isLoading } = useShowcaseList();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShowcaseCategory | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'gallery' | 'leaderboard'>('gallery');

  // 모든 태그를 수집하여 빈도순 정렬
  const allTags = useMemo(() => {
    if (!showcases) return [];
    const tagCount = new Map<string, number>();
    for (const item of showcases) {
      for (const tag of item.showcase_tags || []) {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      }
    }
    return [...tagCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [showcases]);

  const filtered = useMemo(() => {
    if (!showcases) return [];
    return showcases.filter((item) => {
      // 카테고리 필터
      if (selectedCategory && item.showcase_category !== selectedCategory) return false;

      // 태그 필터
      if (selectedTag && !(item.showcase_tags || []).includes(selectedTag)) return false;

      // 텍스트 검색
      if (search) {
        const q = search.toLowerCase();
        return (
          item.site_name?.toLowerCase().includes(q) ||
          item.homepage_templates?.name_ko?.toLowerCase().includes(q) ||
          item.homepage_templates?.framework?.toLowerCase().includes(q) ||
          item.profiles?.name?.toLowerCase().includes(q) ||
          item.showcase_description?.toLowerCase().includes(q) ||
          (item.showcase_tags || []).some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [showcases, search, selectedCategory, selectedTag]);

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-medium mb-4">
          <Trophy className="h-4 w-4" />
          커뮤니티 쇼케이스
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          사용자들이 만든 사이트
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Linkmap으로 배포된 멋진 사이트들을 구경하세요.
          내 사이트도 쇼케이스에 등록할 수 있습니다!
        </p>
      </div>

      {/* 이달의 페이지 섹션 */}
      <MonthlyPicksSection />

      {/* View Mode Tabs */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setViewMode('gallery')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            viewMode === 'gallery'
              ? 'bg-brand-blue text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          갤러리
        </button>
        <button
          type="button"
          onClick={() => setViewMode('leaderboard')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            viewMode === 'leaderboard'
              ? 'bg-brand-blue text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          <Crown className="h-4 w-4" />
          리더보드
        </button>
      </div>

      {viewMode === 'leaderboard' ? (
        <div className="max-w-2xl mx-auto">
          <ShowcaseLeaderboard />
        </div>
      ) : (
      <>
      {/* Search */}
      <div className="max-w-md mx-auto mb-6">
        <Input
          placeholder="사이트 이름, 템플릿, 제작자, 태그 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10"
        />
      </div>

      {/* Category Filter */}
      <div className="flex justify-center flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
            !selectedCategory
              ? 'bg-brand-blue text-white border-brand-blue'
              : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
          )}
        >
          전체
        </button>
        {SHOWCASE_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setSelectedCategory(selectedCategory === cat.value ? null : cat.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              selectedCategory === cat.value
                ? 'bg-brand-blue text-white border-brand-blue'
                : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex justify-center flex-wrap gap-1.5 mb-8">
          {allTags.slice(0, 15).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={cn(
                'px-2 py-1 rounded text-[11px] transition-colors',
                selectedTag === tag
                  ? 'bg-brand-green/20 text-brand-green font-medium'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border overflow-hidden">
              <Skeleton className="h-48" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Sparkles className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">
            {search || selectedCategory || selectedTag
              ? '검색 결과가 없습니다'
              : '아직 쇼케이스가 없습니다'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {search || selectedCategory || selectedTag
              ? '다른 조건으로 검색해보세요'
              : '내 사이트 관리에서 쇼케이스에 등록해보세요!'}
          </p>
        </div>
      )}
      </>
      )}
    </div>
  );
}
