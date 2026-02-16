'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './status-badge';
import { ServiceIcon } from './service-icon';
import { MOCK_CONNECTIONS } from '@/data/mock-connections';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {value}/{max}
      </span>
    </div>
  );
}

export function ConnectionDashboard() {
  const [visibleCount, setVisibleCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { locale } = useLocaleStore();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (prefersReducedMotion) {
            setVisibleCount(MOCK_CONNECTIONS.length);
          } else {
            MOCK_CONNECTIONS.forEach((_, i) => {
              setTimeout(() => setVisibleCount(i + 1), (i + 1) * 150);
            });
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const statusCounts = {
    connected: MOCK_CONNECTIONS.filter((c) => c.status === 'connected').length,
    in_progress: MOCK_CONNECTIONS.filter((c) => c.status === 'in_progress').length,
    not_started: MOCK_CONNECTIONS.filter((c) => c.status === 'not_started').length,
  };

  return (
    <div ref={ref} className="rounded-xl border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          🔗 {t(locale, 'landing.dashboardTitle')}
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t(locale, 'landing.dashboardDesc')}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-3 sm:px-4 py-2 font-medium text-xs text-muted-foreground">{t(locale, 'landing.colService')}</th>
              <th className="text-left px-3 sm:px-4 py-2 font-medium text-xs text-muted-foreground">{t(locale, 'landing.colStatus')}</th>
              <th className="text-left px-3 sm:px-4 py-2 font-medium text-xs text-muted-foreground hidden sm:table-cell">{t(locale, 'landing.colEnvVars')}</th>
              <th className="text-left px-3 sm:px-4 py-2 font-medium text-xs text-muted-foreground hidden sm:table-cell">{t(locale, 'landing.colChecklist')}</th>
              <th className="text-left px-3 sm:px-4 py-2 font-medium text-xs text-muted-foreground hidden md:table-cell">{t(locale, 'landing.colLastChecked')}</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CONNECTIONS.map((conn, i) => (
              <motion.tr
                key={conn.id}
                className="border-b last:border-b-0 hover:bg-muted/20 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={i < visibleCount ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-3 sm:px-4 py-2.5">
                  <span className="flex items-center gap-2 font-medium text-xs">
                    {conn.iconSlug ? (
                      <ServiceIcon serviceId={conn.iconSlug} size={18} />
                    ) : (
                      <span>{conn.emoji}</span>
                    )}
                    <span className="truncate max-w-[80px] sm:max-w-none">{conn.name}</span>
                  </span>
                </td>
                <td className="px-3 sm:px-4 py-2.5">
                  <StatusBadge status={conn.status} />
                </td>
                <td className="px-3 sm:px-4 py-2.5 hidden sm:table-cell">
                  <ProgressBar
                    value={conn.envVars.configured}
                    max={conn.envVars.total}
                    color={conn.envVars.configured === conn.envVars.total ? 'bg-green-500' : 'bg-blue-500'}
                  />
                </td>
                <td className="px-3 sm:px-4 py-2.5 hidden sm:table-cell">
                  <ProgressBar
                    value={conn.checklist.completed}
                    max={conn.checklist.total}
                    color={conn.checklist.completed === conn.checklist.total ? 'bg-green-500' : 'bg-blue-500'}
                  />
                </td>
                <td className="px-3 sm:px-4 py-2.5 text-xs text-muted-foreground hidden md:table-cell">
                  {conn.lastChecked}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t bg-muted/30">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {statusCounts.connected} {t(locale, 'landing.statusConnected')}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            {statusCounts.in_progress} {t(locale, 'landing.statusInProgress')}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            {statusCounts.not_started} {t(locale, 'landing.statusNotStarted')}
          </span>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href="/signup">{t(locale, 'landing.viewAllConnections')}</Link>
        </Button>
      </div>
    </div>
  );
}
