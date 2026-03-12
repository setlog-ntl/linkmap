'use client';

import { memo, useState, useId } from 'react';
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
  const gradId = useId();
  const edgeData = data as Record<string, unknown>;
  const status = edgeData?.status as string | undefined;
  const connectionStatus = edgeData?.connectionStatus as string | undefined;
  const connectionType = edgeData?.connectionType as string | undefined;
  const focusHighlighted = edgeData?.focusHighlighted as boolean | undefined;

  // Focus mode: if focusHighlighted is explicitly false, dim the edge
  const isFocusFaded = focusHighlighted === false;

  // Determine stroke color
  const strokeColor = connectionStatus
    ? (CONNECTION_STATUS_COLORS[connectionStatus] ?? '#94a3b8')
    : (STATUS_COLORS[status ?? ''] ?? STATUS_COLORS.not_started);

  // Compute marker key
  const markerKey = connectionStatus
    ? (CONNECTION_STATUS_TO_MARKER[connectionStatus] ?? 'not_started')
    : (VALID_HUB_STATUSES.has(status ?? '') ? (status as string) : 'not_started');

  const isInactive = connectionStatus === 'inactive';
  const isHubEdge = !connectionStatus;
  const showParticle = !isInactive && isHubEdge && status === 'connected' && !isFocusFaded;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curvature: 0.3,
  });

  // Opacity: focus-aware
  const baseOpacity = isInactive ? 0.3 : (hovered ? 1 : 0.6);
  const edgeOpacity = isFocusFaded ? 0.04 : baseOpacity;

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient definition */}
      <defs>
        <linearGradient id={gradId} x1={sourceX} y1={sourceY} x2={targetX} y2={targetY} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.9} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0.25} />
        </linearGradient>
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: `url(#${gradId})`,
          strokeWidth: hovered ? 2.5 : (isFocusFaded ? 1 : 1.8),
          opacity: edgeOpacity,
          transition: 'opacity 0.3s ease, stroke-width 0.2s ease',
          ...style,
        }}
        markerEnd={`url(#radial-arrow-${markerKey})`}
      />
      {/* Glow overlay for highlighted edges */}
      {focusHighlighted && !isFocusFaded && isHubEdge && (
        <path
          d={edgePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          opacity="0.08"
          style={{ filter: `blur(4px)` }}
        />
      )}
      {/* Flow particle for connected hub edges */}
      {showParticle && (
        <circle
          r={2.5}
          fill={strokeColor}
          className="flow-particle"
          style={{ filter: `drop-shadow(0 0 4px ${strokeColor})` }}
        >
          <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
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
