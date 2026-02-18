'use client';

import { CompactCard } from './compact-card';
import { AuthGroup } from './auth-group';
import { AddServiceCard } from './add-service-card';
import { allCategoryLabels } from '@/lib/constants/service-filters';
import type { LayerData, ServiceCardData, ServiceCategory } from '@/types';

interface LayerColumnProps {
  data: LayerData;
  projectId: string;
}

const LAYER_COLORS: Record<string, string> = {
  frontend: 'text-green-600 dark:text-green-400',
  backend: 'text-blue-600 dark:text-blue-400',
  devtools: 'text-orange-600 dark:text-orange-400',
};

export function LayerColumn({ data, projectId }: LayerColumnProps) {
  const { layer, label, services } = data;

  // Group by subcategory
  const groups = new Map<string, ServiceCardData[]>();
  for (const svc of services) {
    const key = svc.dashboardSubcategory;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(svc);
  }

  // For frontend, separate auth group
  const isAuthGroup = (sub: string) => sub === 'auth' || sub === 'social_login';
  const authCards = layer === 'frontend'
    ? services.filter((s) => isAuthGroup(s.dashboardSubcategory))
    : [];
  const regularGroups = [...groups.entries()].filter(
    ([sub]) => !(layer === 'frontend' && isAuthGroup(sub))
  );

  return (
    <div className="space-y-6">
      {/* Layer header */}
      <h3 className={`text-sm font-bold uppercase tracking-widest ${LAYER_COLORS[layer] ?? ''}`}>
        {label}
        <span className="ml-1.5 text-xs font-mono font-normal text-muted-foreground">
          ({services.length})
        </span>
      </h3>

      {/* Auth group (frontend only) */}
      {layer === 'frontend' && authCards.length > 0 && (
        <AuthGroup cards={authCards} projectId={projectId} />
      )}

      {/* Regular subcategory groups */}
      {regularGroups.map(([sub, cards]) => (
        <div key={sub} className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-0.5">
            {allCategoryLabels[sub as ServiceCategory] ?? sub}
          </p>
          {cards.map((card) => (
            <CompactCard key={card.projectServiceId} card={card} projectId={projectId} />
          ))}
        </div>
      ))}

      {/* Empty state */}
      {services.length === 0 && (
        <p className="text-xs text-muted-foreground py-4 text-center">
          아직 서비스가 없습니다
        </p>
      )}

      {/* Add service */}
      <AddServiceCard projectId={projectId} />
    </div>
  );
}
