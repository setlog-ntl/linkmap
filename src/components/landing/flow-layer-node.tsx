'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ServiceIcon } from './service-icon';

interface FlowLayerNodeData {
  label: string;
  emoji: string;
  iconSlug?: string;
  layer: string;
  connectedCount?: number;
  totalCount?: number;
  checklistDone?: number;
  checklistTotal?: number;
  highlighted?: boolean;
  [key: string]: unknown;
}

function FlowLayerNode({ data }: NodeProps) {
  const d = data as unknown as FlowLayerNodeData;
  const isHighlighted = d.highlighted;

  return (
    <div
      className={`px-5 py-3.5 rounded-xl border-2 transition-all duration-300 min-w-[140px] bg-card
        ${isHighlighted
          ? 'border-brand-blue/50 shadow-[0_0_24px_rgba(59,130,246,0.18),0_2px_8px_rgba(0,0,0,0.12)] scale-105'
          : 'border-border shadow-md hover:scale-[1.02]'
        }
      `}
    >
      <Handle type="target" position={Position.Top} id="top" className="!bg-muted-foreground/30 !w-2 !h-2 !border-0" />
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground/30 !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-muted-foreground/30 !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-muted-foreground/30 !w-2 !h-2 !border-0" />

      <div className="text-center">
        <div className="flex justify-center mb-1">
          {d.iconSlug ? (
            <ServiceIcon serviceId={d.iconSlug} size={24} />
          ) : (
            <span className="text-xl">{d.emoji}</span>
          )}
        </div>
        <div className={`font-bold text-sm ${isHighlighted ? 'text-brand-blue' : 'text-foreground'}`}>{d.label}</div>
      </div>
    </div>
  );
}

export default memo(FlowLayerNode);
