'use client';

import { ServiceItem } from './service-item';
import { AddServiceCard } from './add-service-card';
import type { LayerData } from '@/types';

interface LayerCardProps {
  data: LayerData;
  projectId: string;
}

const LAYER_STYLES: Record<string, { color: string; border: string }> = {
  frontend: { color: 'text-green-600 dark:text-green-400', border: 'border-green-500/20' },
  backend: { color: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' },
  devtools: { color: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/20' },
};

export function LayerCard({ data, projectId }: LayerCardProps) {
  const { layer, label, services } = data;
  const style = LAYER_STYLES[layer] ?? { color: 'text-muted-foreground', border: 'border-border' };

  return (
    <div className={`rounded-2xl border bg-card/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm p-4 h-full ${style.border}`}>
      {/* Layer header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-xs font-bold uppercase tracking-widest ${style.color}`}>
          {label}
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground">
          {services.length}
        </span>
      </div>

      {/* Service items */}
      <div className="space-y-0.5">
        {services.map((card) => (
          <ServiceItem key={card.projectServiceId} card={card} projectId={projectId} />
        ))}
      </div>

      {/* Empty state */}
      {services.length === 0 && (
        <p className="text-xs text-muted-foreground py-6 text-center">
          아직 서비스가 없습니다
        </p>
      )}

      {/* Add service */}
      <div className="mt-2">
        <AddServiceCard projectId={projectId} />
      </div>
    </div>
  );
}
