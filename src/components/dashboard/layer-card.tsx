'use client';

import { Monitor, Server, Wrench } from 'lucide-react';
import { ServiceItem } from './service-item';
import { AddServiceCard } from './add-service-card';
import type { LayerData } from '@/types';

interface LayerCardProps {
  data: LayerData;
  projectId: string;
}

const LAYER_STYLES: Record<string, {
  color: string;
  border: string;
  accentBg: string;
  accentBorder: string;
  icon: typeof Monitor;
}> = {
  frontend: {
    color: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
    accentBg: 'bg-emerald-500/5',
    accentBorder: 'border-emerald-500/30',
    icon: Monitor,
  },
  backend: {
    color: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/20',
    accentBg: 'bg-blue-500/5',
    accentBorder: 'border-blue-500/30',
    icon: Server,
  },
  devtools: {
    color: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/20',
    accentBg: 'bg-orange-500/5',
    accentBorder: 'border-orange-500/30',
    icon: Wrench,
  },
};

export function LayerCard({ data, projectId }: LayerCardProps) {
  const { layer, label, services } = data;
  const style = LAYER_STYLES[layer] ?? {
    color: 'text-muted-foreground',
    border: 'border-border',
    accentBg: '',
    accentBorder: 'border-border',
    icon: Server,
  };
  const Icon = style.icon;

  return (
    <div
      className={`
        relative rounded-2xl border overflow-hidden h-full
        bg-card/80 dark:bg-zinc-900/60 backdrop-blur-md shadow-sm
        ${style.border}
      `}
    >
      {/* Top accent bar */}
      <div className={`h-0.5 w-full ${style.accentBg} ${style.accentBorder} border-b`} />

      <div className="p-4">
        {/* Layer header */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-1 rounded-md ${style.accentBg}`}>
            <Icon className={`h-3.5 w-3.5 ${style.color}`} />
          </div>
          <h3 className={`text-[11px] font-bold uppercase tracking-[0.12em] ${style.color}`}>
            {label}
          </h3>
          <span className={`
            ml-auto text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md
            ${style.accentBg} ${style.color}
          `}>
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
    </div>
  );
}
