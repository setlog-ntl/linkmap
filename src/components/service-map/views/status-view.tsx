'use client';

import { useMemo } from 'react';
import { Plus, Settings, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HealthScoreRing } from '@/components/service-map/views/health-score-ring';
import { GroupSummaryCard } from '@/components/service-map/views/group-summary-card';
import { AlertsList } from '@/components/service-map/views/alerts-list';
import { computeHealthScore } from '@/lib/utils/health-score';
import { categoryToViewGroup, VIEW_GROUP_META, VIEW_GROUP_ORDER } from '@/lib/layout/view-group';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { ServiceMapData } from '@/components/service-map/hooks/useServiceMapData';
import type { ViewGroup, ServiceCategory, ServiceStatus } from '@/types';

interface StatusViewProps {
  data: ServiceMapData;
  projectId: string;
}

export function StatusView({ data, projectId }: StatusViewProps) {
  const { locale } = useLocaleStore();
  const { setViewLevel } = useServiceMapStore();

  const healthScore = useMemo(
    () => computeHealthScore(data.services, data.healthChecks, data.envVars),
    [data.services, data.healthChecks, data.envVars]
  );

  const groupedServices = useMemo(() => {
    const groups = new Map<ViewGroup, { id: string; name: string; slug: string; category: ServiceCategory; status: ServiceStatus }[]>();
    for (const g of VIEW_GROUP_ORDER) {
      groups.set(g, []);
    }
    for (const ps of data.services) {
      const cat = (ps.service?.category as ServiceCategory) || 'other';
      const group = categoryToViewGroup(cat);
      groups.get(group)!.push({
        id: ps.id,
        name: ps.service?.name || 'Unknown',
        slug: ps.service?.slug || '',
        category: cat,
        status: ps.status,
      });
    }
    return groups;
  }, [data.services]);

  return (
    <div className="space-y-5">
      {/* Health score + Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border bg-card/80 dark:bg-zinc-900/60 backdrop-blur-sm p-6">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            {t(locale, 'serviceMap.healthScore.title')}
          </h3>
          <HealthScoreRing score={healthScore} />
        </div>
        <div className="rounded-2xl border bg-card/80 dark:bg-zinc-900/60 backdrop-blur-sm p-6">
          <AlertsList services={data.services} healthChecks={data.healthChecks} envVars={data.envVars} />
          {Object.values(data.healthChecks).filter((hc) => hc.status === 'unhealthy').length === 0 &&
           data.envVars.filter((e) => !e.encrypted_value).length === 0 &&
           data.services.filter((s) => s.status === 'not_started').length === 0 && (
            <p className="text-sm text-muted-foreground">{t(locale, 'serviceMap.status.allGood')}</p>
          )}
        </div>
      </div>

      {/* Group summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {VIEW_GROUP_ORDER.map((group) => (
          <GroupSummaryCard
            key={group}
            meta={VIEW_GROUP_META[group]}
            services={groupedServices.get(group) || []}
            onClick={() => setViewLevel('map')}
          />
        ))}
      </div>

      {/* Quick actions bar */}
      <div className="flex items-center gap-3 rounded-2xl border bg-card/60 dark:bg-zinc-900/40 backdrop-blur-sm p-4">
        <span className="text-sm text-muted-foreground flex-1">
          {data.services.filter((s) => s.status === 'not_started').length > 0
            ? `${data.services.filter((s) => s.status === 'not_started').length}${t(locale, 'serviceMap.actions.notConnectedCount')}`
            : t(locale, 'serviceMap.status.allConnected')}
        </span>
        <Button variant="ghost" size="sm" className="text-xs" onClick={() => setViewLevel('map')}>
          <MapIcon className="mr-1.5 h-3.5 w-3.5" />
          {t(locale, 'serviceMap.actions.viewMap')}
        </Button>
        <Button variant="ghost" size="sm" className="text-xs" asChild>
          <a href={`/project/${projectId}/env`}>
            <Settings className="mr-1.5 h-3.5 w-3.5" />
            {t(locale, 'serviceMap.actions.setEnvVars')}
          </a>
        </Button>
        <Button variant="ghost" size="sm" className="text-xs" asChild>
          <a href={`/project/${projectId}/integrations`}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            {t(locale, 'serviceMap.actions.addService')}
          </a>
        </Button>
      </div>
    </div>
  );
}
