'use client';

import { memo, useState } from 'react';
import { BaseEdge, getBezierPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

// Hub edge status colors (project → service)
const STATUS_COLORS: Record<string, string> = {
  connected: '#22c55e',
  in_progress: '#f59e0b',
  error: '#ef4444',
  not_started: '#94a3b8',
};

// User connection status colors (service → service)
const CONNECTION_STATUS_COLORS: Record<string, string> = {
  active: '#22c55e',
  inactive: '#94a3b8',
  error: '#ef4444',
  pending: '#f59e0b',
};

// Map to marker key matching map-view.tsx SVG defs (radial-arrow-{key})
const CONNECTION_STATUS_TO_MARKER: Record<string, string> = {
  active: 'connected',
  inactive: 'not_started',
  error: 'error',
  pending: 'in_progress',
};

const VALID_HUB_STATUSES = new Set(['connected', 'in_progress', 'error', 'not_started']);

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
  const edgeData = data as Record<string, unknown>;
  const status = edgeData?.status as string | undefined;
  const connectionStatus = edgeData?.connectionStatus as string | undefined;
  const connectionType = edgeData?.connectionType as string | undefined;

  // Determine stroke color: connectionStatus (s2s) takes priority over hub status
  const strokeColor = connectionStatus
    ? (CONNECTION_STATUS_COLORS[connectionStatus] ?? '#94a3b8')
    : (STATUS_COLORS[status ?? ''] ?? STATUS_COLORS.not_started);

  // Compute marker key for SVG defs (defined in map-view.tsx)
  const markerKey = connectionStatus
    ? (CONNECTION_STATUS_TO_MARKER[connectionStatus] ?? 'not_started')
    : (VALID_HUB_STATUSES.has(status ?? '') ? (status as string) : 'not_started');

  const isInactive = connectionStatus === 'inactive';

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
          opacity: isInactive ? 0.3 : (hovered ? 1 : 0.7),
          transition: 'opacity 0.2s ease, stroke-width 0.2s ease',
          ...style,
        }}
        markerEnd={`url(#radial-arrow-${markerKey})`}
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
