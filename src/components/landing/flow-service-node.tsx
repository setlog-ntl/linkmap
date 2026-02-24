'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ServiceIcon } from './service-icon';

const statusDots: Record<string, string> = {
  connected: 'bg-brand-green',
  in_progress: 'bg-yellow-500',
  not_started: 'bg-gray-500',
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

const statusLabels: Record<string, string> = {
  connected: '연결됨',
  in_progress: '설정 중',
  not_started: '미연결',
};

function FlowServiceNode({ data }: NodeProps) {
  const d = data as unknown as FlowServiceNodeData;
  const dotClass = statusDots[d.status] || statusDots.not_started;
  const isDisconnected = d.status === 'not_started';

  return (
    <div
      className={`group px-3 py-2 rounded-lg border shadow-sm transition-all duration-300 bg-card cursor-default
        ${d.highlighted
          ? 'scale-110 shadow-md ring-2 ring-brand-blue/30 border-brand-blue/50'
          : isDisconnected
            ? 'border-dashed border-muted-foreground/30 opacity-60 hover:opacity-100 hover:border-muted-foreground/50'
            : 'border-border hover:border-brand-green/40 hover:shadow-md hover:scale-105'
        }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground/40 !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-muted-foreground/40 !w-2 !h-2 !border-0" />

      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
        {d.iconSlug ? (
          <ServiceIcon serviceId={d.iconSlug} size={18} />
        ) : (
          <span className="text-base">{d.emoji}</span>
        )}
        <span className="font-bold text-xs whitespace-nowrap text-foreground">{d.label}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-0.5 ml-[22px]">
        {d.envTotal != null && d.envTotal > 0 && (
          <span className="text-[10px] text-muted-foreground">
            {d.envConfigured}/{d.envTotal} vars
          </span>
        )}
        <span className={`text-[10px] font-medium ${isDisconnected ? 'text-muted-foreground/60' : 'text-brand-green'}`}>
          {statusLabels[d.status] || statusLabels.not_started}
        </span>
      </div>
    </div>
  );
}

export default memo(FlowServiceNode);
