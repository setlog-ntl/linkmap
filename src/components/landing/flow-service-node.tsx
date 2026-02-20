'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ServiceIcon } from './service-icon';

const statusDots: Record<string, string> = {
  connected: 'bg-[#2bee79]',
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

function FlowServiceNode({ data }: NodeProps) {
  const d = data as unknown as FlowServiceNodeData;
  const dotClass = statusDots[d.status] || statusDots.not_started;

  return (
    <div
      className={`px-3 py-2 rounded-lg border shadow-sm transition-all duration-300 bg-white ${
        d.highlighted
          ? 'scale-110 shadow-md ring-2 ring-[hsl(220,60%,35%)]/30 border-[hsl(220,60%,35%)]/50'
          : 'border-[#dde0e7] hover:border-[#c8cdd6]'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#c8cdd6] !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-[#c8cdd6] !w-2 !h-2 !border-0" />

      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
        {d.iconSlug ? (
          <ServiceIcon serviceId={d.iconSlug} size={18} />
        ) : (
          <span className="text-base">{d.emoji}</span>
        )}
        <span className="font-bold text-xs whitespace-nowrap text-[#1a2740]">{d.label}</span>
      </div>
      {d.envTotal != null && d.envTotal > 0 && (
        <div className="text-[10px] text-[#63738a] mt-0.5 ml-[22px]">
          {d.envConfigured}/{d.envTotal} vars
        </div>
      )}
    </div>
  );
}

export default memo(FlowServiceNode);
