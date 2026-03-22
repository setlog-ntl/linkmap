'use client';

import Link from 'next/link';
import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { useLatestHealthChecks } from '@/lib/queries/health-checks';
import type { ServiceCardData, DashboardMetrics } from '@/types';

interface ActionNeededProps {
  projectId: string;
  allCards: ServiceCardData[];
  metrics: DashboardMetrics;
}

type Severity = 'error' | 'warning' | 'info';

interface ActionItem {
  severity: Severity;
  message: string;
  count?: number;
  href: string;
}

const severityConfig: Record<Severity, { icon: typeof AlertCircle; color: string; bg: string }> = {
  error: {
    icon: AlertCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  info: {
    icon: Info,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
};

const severityOrder: Record<Severity, number> = { error: 0, warning: 1, info: 2 };

export function ActionNeeded({ projectId, allCards, metrics }: ActionNeededProps) {
  const { data: healthChecks } = useLatestHealthChecks(projectId);

  const items: ActionItem[] = [];

  // Unhealthy services
  if (healthChecks) {
    const unhealthyCount = Object.values(healthChecks).filter((c) => c.status === 'unhealthy').length;
    if (unhealthyCount > 0) {
      items.push({
        severity: 'error',
        message: `점검 필요 서비스 ${unhealthyCount}개`,
        href: `/project/${projectId}/monitoring?tab=health`,
      });
    }
  }

  // Missing env vars
  const missingEnvCount = allCards.filter((c) => c.envTotal > 0 && c.envFilled < c.envTotal).length;
  if (missingEnvCount > 0) {
    items.push({
      severity: 'warning',
      message: `환경변수 설정 필요 ${missingEnvCount}개`,
      href: `/project/${projectId}/env`,
    });
  }

  // Budget exceeded
  if (metrics.isOverBudget) {
    items.push({
      severity: 'warning',
      message: '월간 예산 초과',
      href: `/project/${projectId}/costs`,
    });
  }

  if (items.length === 0) return null;

  items.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item, i) => {
        const config = severityConfig[item.severity];
        const Icon = config.icon;
        return (
          <Link
            key={i}
            prefetch={false}
            href={item.href}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-opacity hover:opacity-80 ${config.bg}`}
          >
            <Icon className={`h-3.5 w-3.5 shrink-0 ${config.color}`} />
            <span>{item.message}</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </Link>
        );
      })}
    </div>
  );
}
