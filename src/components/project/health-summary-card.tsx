'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Loader2 } from 'lucide-react';
import type { HealthCheckStatus } from '@/types';

interface HealthSummaryCardProps {
  serviceName: string;
  serviceCategory?: string;
  status: HealthCheckStatus | null;
  lastCheckedAt?: string | null;
  responseTimeMs?: number | null;
  message?: string | null;
  onRunCheck?: () => void;
  isRunning?: boolean;
}

const statusConfig: Record<HealthCheckStatus, { label: string; dotClass: string; badgeClass: string; containerClass: string }> = {
  healthy: {
    label: '정상',
    dotClass: 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]',
    badgeClass: 'bg-green-500/10 text-green-400 border-green-500/20',
    containerClass: 'border-green-500/10 bg-gradient-to-r from-green-500/5 to-transparent',
  },
  degraded: {
    label: '저하',
    dotClass: 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]',
    badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    containerClass: 'border-yellow-500/10 bg-gradient-to-r from-yellow-500/5 to-transparent',
  },
  unhealthy: {
    label: '오류',
    dotClass: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite]',
    badgeClass: 'bg-red-500/10 text-red-400 border-red-500/20',
    containerClass: 'border-red-500/20 bg-gradient-to-r from-red-500/10 to-transparent',
  },
  unknown: {
    label: '미확인',
    dotClass: 'bg-slate-500',
    badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    containerClass: 'border-white/5 bg-white/[0.02]',
  },
};

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export function HealthSummaryCard({
  serviceName,
  serviceCategory,
  status,
  lastCheckedAt,
  responseTimeMs,
  message,
  onRunCheck,
  isRunning,
}: HealthSummaryCardProps) {
  const config = status ? statusConfig[status] : statusConfig.unknown;

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] ${config.containerClass}`}>
      <div className="flex items-center gap-4 min-w-0">
        <span className={`w-3 h-3 rounded-full shrink-0 ${config.dotClass}`} />
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold truncate tracking-tight">{serviceName}</span>
            <Badge variant="outline" className={`px-2 py-0 h-5 text-[10px] font-medium ${config.badgeClass}`}>{config.label}</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            {serviceCategory && <span>{serviceCategory}</span>}
            {lastCheckedAt && (
              <>
                <span className="opacity-40">·</span>
                <span>{formatRelativeTime(lastCheckedAt)}</span>
              </>
            )}
            {responseTimeMs != null && (
              <>
                <span className="opacity-40">·</span>
                <span>{responseTimeMs}ms</span>
              </>
            )}
          </div>
          {message && status !== 'healthy' && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{message}</p>
          )}
        </div>
      </div>
      {onRunCheck && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRunCheck}
          disabled={isRunning}
          className="shrink-0"
          aria-label="상태 검증 실행"
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Activity className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}
