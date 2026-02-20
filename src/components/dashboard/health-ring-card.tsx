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
  unknown: '#52525b',
};

const GLOW_COLORS: Record<string, string> = {
  healthy: 'rgba(34,197,94,0.15)',
  degraded: 'rgba(234,179,8,0.15)',
  unhealthy: 'rgba(239,68,68,0.15)',
};

function DonutChart({ dist }: { dist: ReturnType<typeof computeHealthDistribution> }) {
  const { healthy, degraded, unhealthy, unknown, total } = dist;
  if (total === 0) return null;

  const radius = 48;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { count: healthy, color: RING_COLORS.healthy, key: 'healthy' },
    { count: degraded, color: RING_COLORS.degraded, key: 'degraded' },
    { count: unhealthy, color: RING_COLORS.unhealthy, key: 'unhealthy' },
    { count: unknown, color: RING_COLORS.unknown, key: 'unknown' },
  ].filter((s) => s.count > 0);

  let offset = 0;
  const dominantKey = segments.length > 0 ? segments.reduce((a, b) => a.count >= b.count ? a : b).key : 'unknown';
  const glowColor = GLOW_COLORS[dominantKey] ?? 'transparent';

  return (
    <div className="relative">
      <svg width="130" height="130" viewBox="0 0 130 130">
        {/* Glow filter */}
        <defs>
          <filter id="ring-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background ring */}
        <circle
          cx="65" cy="65" r={radius}
          fill="none" stroke="currentColor" strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        {/* Segments with glow */}
        {segments.map((seg) => {
          const segLength = (seg.count / total) * circumference;
          const el = (
            <circle
              key={seg.key}
              cx="65" cy="65" r={radius}
              fill="none" stroke={seg.color} strokeWidth={strokeWidth}
              strokeDasharray={`${segLength} ${circumference - segLength}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              transform="rotate(-90 65 65)"
              className="transition-all duration-700"
              filter="url(#ring-glow)"
            />
          );
          offset += segLength;
          return el;
        })}
        {/* Inner subtle glow */}
        <circle cx="65" cy="65" r={32} fill={glowColor} />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-mono">{healthy}</span>
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
    <div className="rounded-2xl border bg-card/80 dark:bg-zinc-900/60 backdrop-blur-md shadow-sm p-5 h-full flex flex-col items-center justify-center gap-4">
      <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.12em] self-start">
        Health Check
      </h3>

      {allCards.length > 0 ? (
        <DonutChart dist={dist} />
      ) : (
        <p className="text-xs text-muted-foreground text-center py-4">서비스를 추가하세요</p>
      )}

      {/* Legend */}
      {allCards.length > 0 && (
        <div className="flex flex-wrap gap-3 text-[10px]">
          {dist.healthy > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              정상 <span className="font-mono font-semibold">{dist.healthy}</span>
            </span>
          )}
          {dist.degraded > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              경고 <span className="font-mono font-semibold">{dist.degraded}</span>
            </span>
          )}
          {dist.unhealthy > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              오류 <span className="font-mono font-semibold">{dist.unhealthy}</span>
            </span>
          )}
          {dist.unknown > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
              미검증 <span className="font-mono font-semibold">{dist.unknown}</span>
            </span>
          )}
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
