'use client';

import { AlertCircle, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { ProjectService, Service, HealthCheck, EnvironmentVariable } from '@/types';

type Severity = 'error' | 'warning' | 'info';

interface AlertItem {
  severity: Severity;
  message: string;
  count?: number;
}

interface AlertsListProps {
  services: (ProjectService & { service: Service })[];
  healthChecks: Record<string, HealthCheck>;
  envVars: EnvironmentVariable[];
  onAction?: (action: string) => void;
}

const severityConfig: Record<Severity, { icon: typeof AlertCircle; color: string; bg: string }> = {
  error: { icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30' },
  warning: { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  info: { icon: Info, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
};

const severityOrder: Record<Severity, number> = { error: 0, warning: 1, info: 2 };

export function AlertsList({ services, healthChecks, envVars, onAction }: AlertsListProps) {
  const { locale } = useLocaleStore();
  const items: AlertItem[] = [];

  const unhealthyCount = Object.values(healthChecks).filter((hc) => hc.status === 'unhealthy').length;
  if (unhealthyCount > 0) {
    items.push({ severity: 'error', message: t(locale, 'serviceMap.alerts.unhealthy'), count: unhealthyCount });
  }

  const missingEnvCount = envVars.filter((e) => !e.encrypted_value || e.encrypted_value === '').length;
  if (missingEnvCount > 0) {
    items.push({ severity: 'warning', message: t(locale, 'serviceMap.alerts.missingEnv'), count: missingEnvCount });
  }

  const notConnectedCount = services.filter((s) => s.status === 'not_started').length;
  if (notConnectedCount > 0) {
    items.push({ severity: 'info', message: t(locale, 'serviceMap.alerts.notConnected'), count: notConnectedCount });
  }

  if (items.length === 0) return null;

  items.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{t(locale, 'serviceMap.alerts.title')}</h3>
      {items.map((item, i) => {
        const config = severityConfig[item.severity];
        const Icon = config.icon;
        return (
          <button
            key={i}
            onClick={() => onAction?.(item.severity)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 w-full text-left transition-colors hover:opacity-80 ${config.bg}`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${config.color}`} />
            <span className="flex-1 text-sm">
              {item.message}
              {item.count != null && <span className="ml-1 font-medium">{item.count}</span>}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
