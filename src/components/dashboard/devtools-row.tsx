'use client';

import { CompactCard } from './compact-card';
import { AddServiceCard } from './add-service-card';
import { allCategoryLabels } from '@/lib/constants/service-filters';
import type { LayerData, ServiceCardData, ServiceCategory } from '@/types';

interface DevtoolsRowProps {
  data: LayerData;
  projectId: string;
}

export function DevtoolsRow({ data, projectId }: DevtoolsRowProps) {
  const { services } = data;

  // Group by subcategory
  const groups = new Map<string, ServiceCardData[]>();
  for (const svc of services) {
    const key = svc.dashboardSubcategory;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(svc);
  }

  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-4">
        DevTools
        <span className="ml-1.5 text-xs font-mono font-normal text-muted-foreground">
          ({services.length})
        </span>
      </h3>

      <div className="grid grid-cols-12 gap-6">
        {[...groups.entries()].map(([sub, cards]) => (
          <div key={sub} className="col-span-4 space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {allCategoryLabels[sub as ServiceCategory] ?? sub}
            </p>
            {cards.map((card) => (
              <CompactCard key={card.projectServiceId} card={card} projectId={projectId} />
            ))}
          </div>
        ))}

        {services.length === 0 && (
          <p className="col-span-12 text-xs text-muted-foreground py-2">
            개발 도구 서비스가 없습니다
          </p>
        )}

        <div className="col-span-4">
          <AddServiceCard projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
