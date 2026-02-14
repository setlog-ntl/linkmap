'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ServiceIcon } from './service-icon';
import { getCategoryStyle } from '@/lib/constants/category-styles';

const statusDots: Record<string, string> = {
  connected: 'bg-green-500',
  in_progress: 'bg-yellow-500',
  not_started: 'bg-gray-400',
};

interface FlowServiceNodeData {
  label: string;
  category: string;
  emoji: string;
  iconSlug?: string;
  status: string;
  envConfigured?: number;
  envTotal?: number;
  highlighted?: boolean;
  [key: string]: unknown;
}

function FlowServiceNode({ data }: NodeProps) {
  const d = data as unknown as FlowServiceNodeData;
  const colorClass = getCategoryStyle(d.category).nodeClasses;
  const dotClass = statusDots[d.status] || statusDots.not_started;

  return (
    <div
      className={`px-3 py-2 rounded-xl border-2 shadow-sm transition-all duration-300 ${colorClass} ${
        d.highlighted
          ? 'scale-110 shadow-md ring-2 ring-primary/30'
          : 'hover:scale-105'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-300 !w-2 !h-2 !border-0 dark:!bg-gray-600" />
      <Handle type="source" position={Position.Right} className="!bg-gray-300 !w-2 !h-2 !border-0 dark:!bg-gray-600" />

      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
        {d.iconSlug ? (
          <ServiceIcon serviceId={d.iconSlug} size={18} />
        ) : (
          <span className="text-base">{d.emoji}</span>
        )}
        <span className="font-medium text-xs whitespace-nowrap">{d.label}</span>
      </div>
      {d.envTotal != null && d.envTotal > 0 && (
        <div className="text-[10px] text-muted-foreground mt-0.5 ml-[26px]">
          {d.envConfigured}/{d.envTotal} vars
        </div>
      )}
    </div>
  );
}

export default memo(FlowServiceNode);
