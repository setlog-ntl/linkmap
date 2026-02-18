'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, XCircle, HelpCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLatestHealthChecks, useRunHealthCheck } from '@/lib/queries/health-checks';
import type { ServiceCardData, HealthCheckStatus } from '@/types';

const STATUS_ICON: Record<HealthCheckStatus | 'none', { icon: typeof CheckCircle; className: string }> = {
  healthy: { icon: CheckCircle, className: 'text-green-500' },
  degraded: { icon: AlertTriangle, className: 'text-yellow-500' },
  unhealthy: { icon: XCircle, className: 'text-red-500' },
  unknown: { icon: HelpCircle, className: 'text-muted-foreground' },
  none: { icon: HelpCircle, className: 'text-muted-foreground' },
};

interface HealthSummaryStripProps {
  projectId: string;
  allCards: ServiceCardData[];
}

export function HealthSummaryStrip({ projectId, allCards }: HealthSummaryStripProps) {
  const { data: healthChecks = {} } = useLatestHealthChecks(projectId);
  const runHealthCheck = useRunHealthCheck();
  const [isRunningAll, setIsRunningAll] = useState(false);

  if (allCards.length === 0) return null;

  const handleRunAll = async () => {
    setIsRunningAll(true);
    let successCount = 0;
    let failCount = 0;

    for (const card of allCards) {
      try {
        await runHealthCheck.mutateAsync({
          project_service_id: card.projectServiceId,
        });
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

  const hasAnyChecks = Object.keys(healthChecks).length > 0;

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          헬스체크
        </h3>
        <div className="flex items-center gap-2">
          <Link
            href={`/project/${projectId}/health`}
            className="text-xs text-primary hover:underline"
          >
            상세 보기
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs gap-1"
            onClick={handleRunAll}
            disabled={isRunningAll}
          >
            <RefreshCw className={`h-3 w-3 ${isRunningAll ? 'animate-spin' : ''}`} />
            {isRunningAll ? '검증 중...' : '전체 검증'}
          </Button>
        </div>
      </div>

      {!hasAnyChecks ? (
        <p className="text-xs text-muted-foreground">
          아직 검증 기록이 없습니다. &quot;전체 검증&quot; 버튼을 눌러 서비스 상태를 확인하세요.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {allCards.map((card) => {
            const check = healthChecks[card.projectServiceId];
            const status = check?.status ?? 'none';
            const config = STATUS_ICON[status];
            const Icon = config.icon;

            return (
              <div
                key={card.projectServiceId}
                className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1"
                title={check ? `${card.name}: ${status} (${check.response_time_ms ?? '-'}ms)` : `${card.name}: 미검증`}
              >
                <Icon className={`h-3 w-3 ${config.className}`} />
                <span className="text-xs truncate max-w-[80px]">{card.name}</span>
                {check?.response_time_ms != null && (
                  <span className="text-[10px] text-muted-foreground">
                    {check.response_time_ms}ms
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
