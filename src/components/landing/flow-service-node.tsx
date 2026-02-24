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
  envKey?: string;
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
      className={`group px-3 py-2 rounded-[10px] border transition-all duration-200 bg-card cursor-default
        ${d.highlighted
          ? 'scale-[1.06] border-brand-blue/40 shadow-[0_0_16px_rgba(59,130,246,0.18)]'
          : isDisconnected
            ? 'border-dashed border-muted-foreground/20 opacity-45 hover:opacity-85 hover:border-muted-foreground/35'
            : 'border-border/50 shadow-sm hover:border-brand-green/30 hover:shadow-[0_0_12px_rgba(16,185,129,0.12)] hover:scale-[1.03]'
        }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground/30 !w-1.5 !h-1.5 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-muted-foreground/30 !w-1.5 !h-1.5 !border-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-muted-foreground/30 !w-1.5 !h-1.5 !border-0" />

      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
        {d.iconSlug ? (
          <ServiceIcon serviceId={d.iconSlug} size={16} />
        ) : (
          <span className="text-sm">{d.emoji}</span>
        )}
        <span className="font-bold text-xs whitespace-nowrap text-foreground">{d.label}</span>
      </div>

      {/* Env key + status */}
      <div className="mt-1 ml-[22px] flex items-center gap-1">
        {d.envKey && (
          <>
            <code className="text-[8.5px] font-mono text-muted-foreground/40 leading-none">
              {d.envKey}
            </code>
            <span className="text-[8px] text-muted-foreground/20">·</span>
          </>
        )}
        <span className={`text-[8.5px] font-medium leading-none ${isDisconnected ? 'text-muted-foreground/40' : 'text-brand-green/70'}`}>
          {statusLabels[d.status] || statusLabels.not_started}
        </span>
      </div>
    </div>
  );
}

export default memo(FlowServiceNode);
