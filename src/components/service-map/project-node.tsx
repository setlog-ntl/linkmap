'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

interface ProjectNodeData {
  label: string;
  iconUrl: string | null;
  [key: string]: unknown;
}

function ProjectNodeComponent({ data }: NodeProps) {
  const { label, iconUrl } = data as ProjectNodeData;

  return (
    <div className="relative flex items-center gap-3 rounded-xl border-2 border-primary/30 bg-background px-5 py-3 shadow-lg">
      {/* Handles for radial connections */}
      <Handle type="source" position={Position.Top} id="top" className="!bg-primary !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-primary !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-primary !w-2 !h-2" />
      <Handle type="source" position={Position.Left} id="left" className="!bg-primary !w-2 !h-2" />

      {/* Icon */}
      {iconUrl ? (
        <img src={iconUrl} alt="" className="w-8 h-8 rounded-md object-contain" />
      ) : (
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
          {label?.charAt(0)?.toUpperCase() ?? 'P'}
        </div>
      )}

      {/* Label */}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold truncate max-w-[120px]">{label}</span>
        <span className="text-[10px] text-muted-foreground">Project</span>
      </div>
    </div>
  );
}

export default memo(ProjectNodeComponent);
