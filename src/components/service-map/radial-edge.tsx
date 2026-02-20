'use client';

import { memo, useState } from 'react';
import { BaseEdge, getBezierPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

const STATUS_COLORS: Record<string, string> = {
  connected: '#22c55e',
  in_progress: '#f59e0b',
  error: '#ef4444',
  not_started: '#94a3b8',
};

function RadialEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
}: EdgeProps) {
  const [hovered, setHovered] = useState(false);
  const status = (data as Record<string, unknown>)?.status as string | undefined;
  const connectionType = (data as Record<string, unknown>)?.connectionType as string | undefined;
  const strokeColor = STATUS_COLORS[status ?? ''] ?? STATUS_COLORS.not_started;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curvature: 0.3,
  });

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: hovered ? 2.5 : 1.5,
          opacity: hovered ? 1 : 0.6,
          ...style,
        }}
        markerEnd="url(#radial-arrow)"
      />
      {hovered && connectionType && (
        <foreignObject
          x={labelX - 40}
          y={labelY - 12}
          width={80}
          height={24}
          className="pointer-events-none"
        >
          <div className="flex items-center justify-center rounded bg-popover px-2 py-0.5 text-[10px] text-popover-foreground shadow-sm border">
            {connectionType}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

export default memo(RadialEdgeComponent);
