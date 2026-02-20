'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ServiceIcon } from './service-icon';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

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
  const { locale } = useLocaleStore();

  const isHighlighted = d.highlighted;

  return (
    <div
      className={`px-5 py-3.5 rounded-xl border-2 shadow-md transition-all duration-300 min-w-[140px] bg-white
        ${isHighlighted ? 'border-[hsl(220,60%,35%)] shadow-lg scale-105' : 'border-[#dde0e7] hover:scale-[1.02]'}
      `}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#c8cdd6] !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-[#c8cdd6] !w-2 !h-2 !border-0" />

      <div className="text-center">
        <div className="flex justify-center mb-1">
          {d.iconSlug ? (
            <ServiceIcon serviceId={d.iconSlug} size={24} />
          ) : (
            <span className="text-xl">{d.emoji}</span>
          )}
        </div>
        <div className={`font-bold text-sm ${isHighlighted ? 'text-[hsl(220,60%,35%)]' : 'text-[#1a2740]'}`}>{d.label}</div>
        {d.totalCount != null && d.totalCount > 0 && (
          <div className="mt-1.5 space-y-0.5">
            <div className="text-[10px] text-[#63738a]">
              {d.connectedCount}/{d.totalCount} {t(locale, 'landing.nodeConnected')}
            </div>
            {d.checklistTotal != null && d.checklistTotal > 0 && (
              <div className="text-[10px] text-[#63738a]">
                {d.checklistDone}/{d.checklistTotal} {t(locale, 'landing.nodeCompleted')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(FlowLayerNode);
