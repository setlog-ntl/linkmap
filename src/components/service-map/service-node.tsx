'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Crown } from 'lucide-react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { NodeTooltip } from '@/components/service-map/node-tooltip';
import type { ServiceCategory } from '@/types';
import { getCategoryStyle } from '@/lib/constants/category-styles';

const statusDots: Record<string, { bg: string; pulse: boolean; label: string }> = {
  connected:   { bg: 'bg-green-500 text-green-500',   pulse: false, label: '연결됨' },
  in_progress: { bg: 'bg-yellow-500 text-yellow-500', pulse: true,  label: '진행 중' },
  not_started: { bg: 'bg-gray-400 dark:bg-gray-500 text-gray-400', pulse: false, label: '시작 전' },
  error:       { bg: 'bg-red-500 text-red-500',       pulse: true,  label: '오류' },
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
        relative px-3 py-2 rounded-xl border-2 shadow-sm
        transition-all duration-200
        ${colorClass}
        ${isHighlighted ? '' : 'opacity-20'}
        hover:shadow-lg hover:scale-[1.03] hover:-translate-y-0.5
        ${isMain ? 'w-[176px] h-[68px] ring-2 ring-amber-400 ring-offset-1 ring-offset-background' : 'w-[160px] h-[64px]'}
      `}
      style={{
        opacity: isHighlighted ? focusOpacity : 0.2,
        ...(isMain ? { boxShadow: '0 0 20px rgba(251, 191, 36, 0.25)' } : {}),
      }}
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

      {/* Row 1: Icon + Name */}
      <div className="flex items-center gap-2">
        {d.iconSlug ? (
          <ServiceIcon serviceId={d.iconSlug} size={18} />
        ) : (
          <span className="text-sm">&#9881;&#65039;</span>
        )}
        <span className="font-medium text-sm truncate flex-1 min-w-0">{d.label}</span>
      </div>

      {/* Row 2: Status dot + label */}
      <div className="flex items-center gap-1.5 mt-1">
        <span className={`w-2 h-2 rounded-full shrink-0 ${dotStyle.bg} ${dotStyle.pulse ? 'animate-status-pulse' : ''}`} />
        <span className="text-[10px] text-muted-foreground truncate">{dotStyle.label}</span>
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
    <NodeTooltip label={d.label} status={d.status} domain={d.domain} category={d.category} isMainService={isMain}>
      {nodeContent}
    </NodeTooltip>
  );
}

export default memo(ServiceNode);
