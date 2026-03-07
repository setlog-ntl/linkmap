'use client';

import { useState } from 'react';
import { useShowcaseList } from '@/lib/queries/showcase';
import { ShowcaseCard } from '@/components/showcase/showcase-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ShowcasePage() {
  const { data: showcases, isLoading } = useShowcaseList();
  const [search, setSearch] = useState('');

  const filtered = showcases?.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.site_name?.toLowerCase().includes(q) ||
      item.homepage_templates?.name_ko?.toLowerCase().includes(q) ||
      item.homepage_templates?.framework?.toLowerCase().includes(q) ||
      item.profiles?.name?.toLowerCase().includes(q)
    );
  });

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

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <Input
          placeholder="사이트 이름, 템플릿, 제작자 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10"
        />
      </div>

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
            {search ? '검색 결과가 없습니다' : '아직 쇼케이스가 없습니다'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {search
              ? '다른 검색어를 시도해보세요'
              : '내 사이트 관리에서 쇼케이스에 등록해보세요!'}
          </p>
        </div>
      )}
    </div>
  );
}
