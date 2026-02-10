'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ServiceIcon } from '@/components/landing/service-icon';
import type { ServiceCategory, FreeTierQuality } from '@/types';
import { allCategoryLabels } from '@/lib/constants/service-filters';

const categoryColors: Record<ServiceCategory, string> = {
  auth: 'bg-purple-50 border-purple-200 dark:bg-purple-950/50 dark:border-purple-800',
  database: 'bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800',
  deploy: 'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800',
  email: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/50 dark:border-yellow-800',
  payment: 'bg-orange-50 border-orange-200 dark:bg-orange-950/50 dark:border-orange-800',
  storage: 'bg-cyan-50 border-cyan-200 dark:bg-cyan-950/50 dark:border-cyan-800',
  monitoring: 'bg-pink-50 border-pink-200 dark:bg-pink-950/50 dark:border-pink-800',
  ai: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-800',
  other: 'bg-gray-50 border-gray-200 dark:bg-gray-950/50 dark:border-gray-800',
  cdn: 'bg-teal-50 border-teal-200 dark:bg-teal-950/50 dark:border-teal-800',
  cicd: 'bg-slate-50 border-slate-200 dark:bg-slate-950/50 dark:border-slate-700',
  testing: 'bg-lime-50 border-lime-200 dark:bg-lime-950/50 dark:border-lime-800',
  sms: 'bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800',
  push: 'bg-rose-50 border-rose-200 dark:bg-rose-950/50 dark:border-rose-800',
  chat: 'bg-violet-50 border-violet-200 dark:bg-violet-950/50 dark:border-violet-800',
  search: 'bg-sky-50 border-sky-200 dark:bg-sky-950/50 dark:border-sky-800',
  cms: 'bg-fuchsia-50 border-fuchsia-200 dark:bg-fuchsia-950/50 dark:border-fuchsia-800',
  analytics: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800',
  media: 'bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800',
  queue: 'bg-orange-50 border-orange-200 dark:bg-orange-950/50 dark:border-orange-800',
  cache: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/50 dark:border-yellow-800',
  logging: 'bg-stone-50 border-stone-200 dark:bg-stone-950/50 dark:border-stone-700',
  feature_flags: 'bg-zinc-50 border-zinc-200 dark:bg-zinc-950/50 dark:border-zinc-700',
  scheduling: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-800',
  ecommerce: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800',
  serverless: 'bg-sky-50 border-sky-200 dark:bg-sky-950/50 dark:border-sky-800',
  code_quality: 'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800',
  automation: 'bg-violet-50 border-violet-200 dark:bg-violet-950/50 dark:border-violet-800',
};

const statusDots: Record<string, string> = {
  connected: 'bg-green-500',
  in_progress: 'bg-yellow-500',
  not_started: 'bg-gray-400 dark:bg-gray-500',
  error: 'bg-red-500',
};

interface ServiceNodeData {
  label: string;
  category: ServiceCategory;
  status: string;
  costEstimate?: string;
  freeTierQuality?: FreeTierQuality;
  iconSlug?: string;
  highlighted?: boolean;
  selected?: boolean;
  [key: string]: unknown;
}

function ServiceNode({ data }: NodeProps) {
  const d = data as unknown as ServiceNodeData;
  const category = d.category as ServiceCategory;
  const colorClass = categoryColors[category] || categoryColors.other;
  const dotClass = statusDots[d.status] || statusDots.not_started;

  const isHighlighted = d.highlighted !== false; // default true when no search
  const isSelected = d.selected === true;

  return (
    <div
      className={`
        px-3.5 py-2.5 rounded-xl border-2 shadow-sm min-w-[160px]
        transition-all duration-200
        ${colorClass}
        ${isSelected ? 'ring-2 ring-primary/40 shadow-md' : 'hover:shadow-md hover:scale-[1.02]'}
        ${isHighlighted ? 'opacity-100' : 'opacity-20'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400 dark:!bg-gray-500 !w-2.5 !h-2.5 !border-0"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-400 dark:!bg-gray-500 !w-2.5 !h-2.5 !border-0"
      />

      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotClass}`} />
        {d.iconSlug ? (
          <ServiceIcon serviceId={d.iconSlug} size={18} />
        ) : (
          <span className="text-base">⚙️</span>
        )}
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{d.label}</div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span>{allCategoryLabels[category] || category}</span>
            {d.costEstimate && (
              <>
                <span className="opacity-40">·</span>
                <span>{d.costEstimate}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400 dark:!bg-gray-500 !w-2.5 !h-2.5 !border-0"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400 dark:!bg-gray-500 !w-2.5 !h-2.5 !border-0"
      />
    </div>
  );
}

export default memo(ServiceNode);
