'use client';

import { useMonthlyPicks } from '@/lib/queries/showcase';
import { MonthlyPickCard } from './monthly-pick-card';
import { Trophy, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function MonthlyPicksSection() {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const { data: picks, isLoading } = useMonthlyPicks(currentMonth);

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // 이번 달 아직 선정 안 됨
  if (!picks || picks.length === 0) {
    return (
      <div className="mb-8 rounded-xl border border-dashed p-6 text-center">
        <Sparkles className="h-8 w-8 text-brand-blue/40 mx-auto mb-2" />
        <p className="text-sm font-medium text-muted-foreground">
          이번 달 리더보드 경쟁이 진행 중입니다!
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          월말에 상위 3개 쇼케이스가 &ldquo;이달의 페이지&rdquo;로 선정됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-bold">이달의 페이지</h2>
        <span className="text-xs text-muted-foreground ml-1">{currentMonth}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {picks
          .sort((a, b) => a.rank - b.rank)
          .slice(0, 3)
          .map((pick) => (
            <MonthlyPickCard key={pick.id} pick={pick} />
          ))}
      </div>
    </div>
  );
}
