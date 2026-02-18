'use client';

import { useLatestHealthChecks } from '@/lib/queries/health-checks';
import type { ServiceCardData, HealthCheckStatus } from '@/types';

type SystemStatus = 'operational' | 'degraded' | 'major_outage' | 'unknown';

function computeSystemStatus(
  allCards: ServiceCardData[],
  healthChecks: Record<string, { status: HealthCheckStatus }>,
): SystemStatus {
  if (allCards.length === 0) return 'unknown';

  const statuses = allCards.map(
    (c) => healthChecks[c.projectServiceId]?.status,
  );

  // No health checks at all
  if (statuses.every((s) => !s)) return 'unknown';

  const unhealthyCount = statuses.filter((s) => s === 'unhealthy').length;
  const degradedCount = statuses.filter((s) => s === 'degraded').length;
  const checkedCount = statuses.filter((s) => !!s).length;

  if (unhealthyCount > 0 && unhealthyCount >= checkedCount / 2) return 'major_outage';
  if (unhealthyCount > 0 || degradedCount > 0) return 'degraded';
  return 'operational';
}

const STATUS_CONFIG: Record<SystemStatus, { label: string; dotClass: string; textClass: string }> = {
  operational: {
    label: '시스템 정상',
    dotClass: 'bg-green-500',
    textClass: 'text-green-700 dark:text-green-400',
  },
  degraded: {
    label: '일부 장애',
    dotClass: 'bg-yellow-500',
    textClass: 'text-yellow-700 dark:text-yellow-400',
  },
  major_outage: {
    label: '주요 장애',
    dotClass: 'bg-red-500',
    textClass: 'text-red-700 dark:text-red-400',
  },
  unknown: {
    label: '확인 필요',
    dotClass: 'bg-gray-400',
    textClass: 'text-muted-foreground',
  },
};

interface SystemStatusBadgeProps {
  projectId: string;
  allCards: ServiceCardData[];
}

export function SystemStatusBadge({ projectId, allCards }: SystemStatusBadgeProps) {
  const { data: healthChecks = {} } = useLatestHealthChecks(projectId);
  const status = computeSystemStatus(allCards, healthChecks);
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-1.5">
      <span className={`relative flex h-2 w-2`}>
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.dotClass}`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dotClass}`} />
      </span>
      <span className={`text-[11px] font-medium ${config.textClass}`}>
        {config.label}
      </span>
    </div>
  );
}
