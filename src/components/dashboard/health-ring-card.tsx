'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLatestHealthChecks, useRunHealthCheck } from '@/lib/queries/health-checks';
import { computeHealthDistribution } from './utils/dashboard-transforms';
import type { ServiceCardData } from '@/types';

interface HealthRingCardProps {
  projectId: string;
  allCards: ServiceCardData[];
}

const RING_COLORS = {
  healthy: '#22c55e',
  degraded: '#eab308',
  unhealthy: '#ef4444',
  unknown: '#71717a',
};

function DonutChart({ dist }: { dist: ReturnType<typeof computeHealthDistribution> }) {
  const { healthy, degraded, unhealthy, unknown, total } = dist;
  if (total === 0) return null;

  const radius = 48;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { count: healthy, color: RING_COLORS.healthy },
    { count: degraded, color: RING_COLORS.degraded },
    { count: unhealthy, color: RING_COLORS.unhealthy },
    { count: unknown, color: RING_COLORS.unknown },
  ].filter((s) => s.count > 0);

  let offset = 0;
  const healthyCount = healthy;

  return (
    <div className="relative">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* Background ring */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none" stroke="currentColor" strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Segments */}
        {segments.map((seg, i) => {
          const segLength = (seg.count / total) * circumference;
          const el = (
            <circle
              key={i}
              cx="60" cy="60" r={radius}
              fill="none" stroke={seg.color} strokeWidth={strokeWidth}
              strokeDasharray={`${segLength} ${circumference - segLength}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              className="transition-all duration-500"
            />
          );
          offset += segLength;
          return el;
        })}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-mono">{healthyCount}</span>
        <span className="text-[10px] text-muted-foreground">/{total} 정상</span>
      </div>
    </div>
  );
}

export function HealthRingCard({ projectId, allCards }: HealthRingCardProps) {
  const { data: healthChecks = {} } = useLatestHealthChecks(projectId);
  const runHealthCheck = useRunHealthCheck();
  const [isRunningAll, setIsRunningAll] = useState(false);

  const dist = computeHealthDistribution(allCards, healthChecks);

  const handleRunAll = async () => {
    setIsRunningAll(true);
    let successCount = 0;
    let failCount = 0;

    for (const card of allCards) {
      try {
        await runHealthCheck.mutateAsync({ project_service_id: card.projectServiceId });
        successCount++;
      } catch {
        failCount++;
      }
    }

    setIsRunningAll(false);
    if (failCount === 0) {
      toast.success(`${successCount}개 서비스 검증 완료`);
    } else {
      toast.warning(`${successCount}개 성공, ${failCount}개 실패`);
    }
  };

  return (
    <div className="rounded-2xl border bg-card/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm p-5 h-full flex flex-col items-center justify-center gap-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider self-start">헬스체크</h3>

      {allCards.length > 0 ? (
        <DonutChart dist={dist} />
      ) : (
        <p className="text-xs text-muted-foreground text-center py-4">서비스를 추가하세요</p>
      )}

      {/* Legend */}
      {allCards.length > 0 && (
        <div className="flex flex-wrap gap-3 text-[10px]">
          {dist.healthy > 0 && <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" />정상 {dist.healthy}</span>}
          {dist.degraded > 0 && <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-500" />경고 {dist.degraded}</span>}
          {dist.unhealthy > 0 && <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" />오류 {dist.unhealthy}</span>}
          {dist.unknown > 0 && <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-zinc-500" />미검증 {dist.unknown}</span>}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full h-8 text-xs gap-1.5"
        onClick={handleRunAll}
        disabled={isRunningAll || allCards.length === 0}
      >
        <RefreshCw className={`h-3 w-3 ${isRunningAll ? 'animate-spin' : ''}`} />
        {isRunningAll ? '검증 중...' : '전체 검증'}
      </Button>
    </div>
  );
}
