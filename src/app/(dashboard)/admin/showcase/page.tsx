'use client';

import { useState } from 'react';
import {
  useShowcaseLeaderboard,
  useAdminShowcaseAction,
  useAdminMonthlyPick,
} from '@/lib/queries/showcase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  Eye,
  EyeOff,
  Heart,
  MessageSquare,
  Star,
  TrendingUp,
  Trophy,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { LeaderboardPeriod } from '@/types/core';
import { PeriodFilter } from '@/components/showcase/period-filter';

export default function AdminShowcasePage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('month');
  const { data: showcases, isLoading } = useShowcaseLeaderboard(period);
  const adminAction = useAdminShowcaseAction();
  const monthlyPick = useAdminMonthlyPick();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const [boostScoreInput, setBoostScoreInput] = useState<Record<string, string>>({});

  const handleAction = (
    showcaseId: string,
    source: 'deploy' | 'project',
    actionType: string,
    boostScore?: number
  ) => {
    adminAction.mutate(
      { showcaseId, source, actionType, boostScore },
      {
        onSuccess: () => toast.success(`${actionType} 액션 완료`),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleMonthlyPick = (
    showcaseId: string,
    source: 'deploy' | 'project',
    rank: number
  ) => {
    monthlyPick.mutate(
      {
        showcaseId,
        source,
        yearMonth: currentMonth,
        rank,
        pickType: 'curated',
      },
      {
        onSuccess: () => toast.success(`이달의 페이지 ${rank}위 선정 완료`),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">쇼케이스 관리</h1>
        <p className="text-sm text-muted-foreground mt-1">
          리더보드 관리, 이달의 페이지 선정, 부스트/숨기기
        </p>
      </div>

      {/* 이달의 페이지 선정 도구 */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h2 className="text-base font-semibold">이달의 페이지 선정</h2>
          <Badge variant="outline" className="text-xs">{currentMonth}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          아래 리더보드에서 각 항목의 &ldquo;대상/최우수/우수&rdquo; 버튼을 클릭하여 수동 선정할 수 있습니다.
        </p>
      </div>

      {/* 리더보드 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">현재 리더보드</h2>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !showcases || showcases.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            쇼케이스가 없습니다
          </p>
        ) : (
          <div className="space-y-2">
            {showcases.map((item, index) => {
              const rank = index + 1;
              const source = item.source || 'deploy';
              return (
                <div
                  key={item.id}
                  className={cn(
                    'rounded-lg border p-3',
                    rank <= 3 && 'bg-muted/30'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* 순위 */}
                    <span className="text-sm font-bold text-muted-foreground w-6 text-center">
                      {rank}
                    </span>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.site_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.profiles?.name ?? '익명'} · {source}
                      </p>
                    </div>

                    {/* 통계 */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-brand-blue" />
                        {item.score}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-400" />
                        {item.like_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {item.comment_count}
                      </span>
                    </div>
                  </div>

                  {/* 관리 버튼 */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* 이달의 페이지 선정 */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => handleMonthlyPick(item.id, source, 1)}
                      disabled={monthlyPick.isPending}
                    >
                      <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                      대상
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => handleMonthlyPick(item.id, source, 2)}
                      disabled={monthlyPick.isPending}
                    >
                      최우수
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => handleMonthlyPick(item.id, source, 3)}
                      disabled={monthlyPick.isPending}
                    >
                      우수
                    </Button>

                    <div className="w-px h-5 bg-border" />

                    {/* 부스트 */}
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        placeholder="점수"
                        className="h-7 w-16 text-xs"
                        value={boostScoreInput[item.id] || ''}
                        onChange={(e) =>
                          setBoostScoreInput((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() =>
                          handleAction(
                            item.id,
                            source,
                            'boost',
                            Number(boostScoreInput[item.id] || 10)
                          )
                        }
                        disabled={adminAction.isPending}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        부스트
                      </Button>
                    </div>

                    {/* 숨기기 / 추천 */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs text-red-500"
                      onClick={() => handleAction(item.id, source, 'hide')}
                      disabled={adminAction.isPending}
                    >
                      <EyeOff className="h-3 w-3 mr-1" />
                      숨기기
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs text-blue-500"
                      onClick={() => handleAction(item.id, source, 'feature')}
                      disabled={adminAction.isPending}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      추천
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
