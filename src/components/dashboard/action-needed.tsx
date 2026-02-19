'use client';

import Link from 'next/link';
import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLatestHealthChecks } from '@/lib/queries/health-checks';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
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

const severityOrder: Record<Severity, number> = { error: 0, warning: 1, info: 2 };

const severityConfig: Record<Severity, { icon: typeof AlertCircle; color: string; bg: string }> = {
  error: {
    icon: AlertCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  info: {
    icon: Info,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
};

export function ActionNeeded({ projectId, allCards, metrics }: ActionNeededProps) {
  const { locale } = useLocaleStore();
  const { data: healthChecks } = useLatestHealthChecks(projectId);

  const items: ActionItem[] = [];

  // Missing env vars
  const missingEnvCount = allCards.filter((c) => c.envTotal > 0 && c.envFilled < c.envTotal).length;
  if (missingEnvCount > 0) {
    items.push({
      severity: 'warning',
      message: t(locale, 'project.actionNeeded.missingEnv'),
      count: missingEnvCount,
      href: `/project/${projectId}/env`,
    });
  }

  // Unhealthy services
  if (healthChecks) {
    const unhealthyCount = Object.values(healthChecks).filter((c) => c.status === 'unhealthy').length;
    if (unhealthyCount > 0) {
      items.push({
        severity: 'error',
        message: t(locale, 'project.actionNeeded.unhealthyService'),
        count: unhealthyCount,
        href: `/project/${projectId}/monitoring?tab=health`,
      });
    }
  }

  // No services
  if (metrics.totalServices === 0) {
    items.push({
      severity: 'info',
      message: t(locale, 'project.actionNeeded.noServices'),
      href: `/project/${projectId}/integrations`,
    });
  }

  if (items.length === 0) return null;

  items.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          {t(locale, 'project.actionNeeded.title')} ({items.length}{t(locale, 'project.actionNeeded.count')})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-1.5">
        {items.map((item, i) => {
          const config = severityConfig[item.severity];
          const Icon = config.icon;
          return (
            <Link
              key={i}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:opacity-80 ${config.bg}`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${config.color}`} />
              <span className="flex-1 text-sm">
                {item.message}
                {item.count != null && (
                  <span className="ml-1 font-medium">{item.count}{t(locale, 'project.actionNeeded.count')}</span>
                )}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
