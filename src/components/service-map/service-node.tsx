'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Crown } from 'lucide-react';
import { ServiceIcon } from '@/components/landing/service-icon';
import { NodeTooltip } from '@/components/service-map/node-tooltip';
import type { ServiceCategory } from '@/types';
import { getCategoryStyle } from '@/lib/constants/category-styles';

const statusDots: Record<string, { bg: string; pulse: boolean }> = {
  connected:   { bg: 'bg-green-500 text-green-500',   pulse: false },
  in_progress: { bg: 'bg-yellow-500 text-yellow-500', pulse: true },
  not_started: { bg: 'bg-gray-400 dark:bg-gray-500 text-gray-400', pulse: false },
  error:       { bg: 'bg-red-500 text-red-500',       pulse: true },
};

interface ServiceNodeData {
  label: string;
  category: ServiceCategory;
  status: string;
  iconSlug?: string;
  highlighted?: boolean;
  focusOpacity?: number;
  domain?: string;
  isMainService?: boolean;
  [key: string]: unknown;
}

function ServiceNode({ data }: NodeProps) {
  const d = data as unknown as ServiceNodeData;
  const category = d.category as ServiceCategory;
  const colorClass = getCategoryStyle(category).nodeClasses;
  const dotStyle = statusDots[d.status] || statusDots.not_started;

  const isHighlighted = d.highlighted !== false;
  const focusOpacity = d.focusOpacity ?? 1;
  const isMain = d.isMainService === true;

  const nodeContent = (
    <div
      className={`
        relative px-3 py-2.5 rounded-xl border-2 shadow-sm
        transition-all duration-200
        ${colorClass}
        ${isHighlighted ? '' : 'opacity-20'}
        hover:shadow-md hover:scale-[1.02]
        ${isMain ? 'w-[176px] h-[52px] ring-2 ring-amber-400 ring-offset-1 ring-offset-background' : 'w-[160px] h-[48px]'}
      `}
      style={{ opacity: isHighlighted ? focusOpacity : 0.2 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-blue-400/60 hover:!bg-blue-500 !w-2.5 !h-2.5 !border-0 !transition-all hover:!w-3 hover:!h-3"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-blue-400/60 hover:!bg-blue-500 !w-2.5 !h-2.5 !border-0 !transition-all hover:!w-3 hover:!h-3"
      />

      {isMain && (
        <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 rounded-full p-0.5 shadow-sm z-10">
          <Crown className="h-3 w-3" />
        </div>
      )}

      <div className="flex items-center gap-2">
        {d.iconSlug ? (
          <ServiceIcon serviceId={d.iconSlug} size={16} />
        ) : (
          <span className="text-sm">&#9881;&#65039;</span>
        )}
        <span className="font-medium text-sm truncate flex-1 min-w-0">{d.label}</span>
        <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-400/60 hover:!bg-blue-500 !w-2.5 !h-2.5 !border-0 !transition-all hover:!w-3 hover:!h-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-blue-400/60 hover:!bg-blue-500 !w-2.5 !h-2.5 !border-0 !transition-all hover:!w-3 hover:!h-3"
      />
    </div>
  );

  return (
    <NodeTooltip label={d.label} status={d.status} domain={d.domain} isMainService={isMain}>
      {nodeContent}
    </NodeTooltip>
  );
}

export default memo(ServiceNode);
