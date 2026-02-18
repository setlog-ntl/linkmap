'use client';

import { Card, CardContent } from '@/components/ui/card';
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
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-3">
          DevTools
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">
            ({services.length})
          </span>
        </h3>

        <div className="flex flex-wrap gap-4">
          {[...groups.entries()].map(([sub, cards]) => (
            <div key={sub} className="min-w-[180px] flex-1 space-y-1.5">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                {allCategoryLabels[sub as ServiceCategory] ?? sub}
              </p>
              {cards.map((card) => (
                <CompactCard key={card.projectServiceId} card={card} />
              ))}
            </div>
          ))}

          {services.length === 0 && (
            <p className="text-xs text-muted-foreground py-2">
              개발 도구 서비스가 없습니다
            </p>
          )}

          <div className="min-w-[180px] flex-1">
            <AddServiceCard projectId={projectId} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
