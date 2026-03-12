'use client';

import { memo, useState, useId } from 'react';
import { BaseEdge, getBezierPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import type { ViewGroup } from '@/types';
import { VIEW_GROUP_META } from '@/lib/layout/view-group';

// Hub edge status colors — softer tones
const STATUS_COLORS: Record<string, string> = {
  connected: 'oklch(0.70 0.12 255)',
  in_progress: 'oklch(0.75 0.15 80)',
  error: 'oklch(0.65 0.18 25)',
  not_started: 'oklch(0.45 0.02 250)',
};

// User connection status colors
const CONNECTION_STATUS_COLORS: Record<string, string> = {
  active: 'oklch(0.70 0.12 255)',
  inactive: 'oklch(0.40 0.02 250)',
  error: 'oklch(0.65 0.18 25)',
  pending: 'oklch(0.75 0.15 80)',
};

// Map to marker key matching map-view.tsx SVG defs
const CONNECTION_STATUS_TO_MARKER: Record<string, string> = {
  active: 'connected',
  inactive: 'not_started',
  error: 'error',
  pending: 'in_progress',
};

// Connection type → particle config
const PARTICLE_CONFIG: Record<string, { dur: string; r: number; burst?: boolean }> = {
  api_call: { dur: '1.8s', r: 2 },
  data_transfer: { dur: '2.5s', r: 3 },
  webhook: { dur: '2s', r: 2, burst: true },
  auth_provider: { dur: '4s', r: 2 },
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
  const targetViewGroup = edgeData?.targetViewGroup as ViewGroup | undefined;

  const isFocusFaded = focusHighlighted === false;
  const isInactive = connectionStatus === 'inactive';
  const isHubEdge = !connectionStatus;

  // Use ViewGroup gradient for hub edges, fallback to status colors
  const vgMeta = targetViewGroup ? VIEW_GROUP_META[targetViewGroup] : undefined;
  const strokeColor = connectionStatus
    ? (CONNECTION_STATUS_COLORS[connectionStatus] ?? 'oklch(0.45 0.02 250)')
    : (STATUS_COLORS[status ?? ''] ?? STATUS_COLORS.not_started);

  const markerKey = connectionStatus
    ? (CONNECTION_STATUS_TO_MARKER[connectionStatus] ?? 'not_started')
    : (VALID_HUB_STATUSES.has(status ?? '') ? (status as string) : 'not_started');

  const showParticle = !isInactive && isHubEdge && status === 'connected' && !isFocusFaded;
  const showS2sParticle = !isInactive && !isHubEdge && connectionStatus === 'active' && !isFocusFaded;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    curvature: 0.2,
  });

  const baseOpacity = isInactive ? 0.25 : (hovered ? 0.9 : 0.5);
  const edgeOpacity = isFocusFaded ? 0.04 : baseOpacity;
  const baseWidth = isHubEdge ? 1.5 : 1;
  const edgeWidth = hovered ? baseWidth + 1 : (isFocusFaded ? 0.8 : baseWidth);

  // Particle config for connection types
  const pConfig = connectionType ? (PARTICLE_CONFIG[connectionType] ?? { dur: '3.5s', r: 2 }) : { dur: '3.5s', r: 2.5 };

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient definition */}
      <defs>
        {vgMeta && isHubEdge ? (
          <linearGradient id={gradId} x1={sourceX} y1={sourceY} x2={targetX} y2={targetY} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={vgMeta.gradientFrom} stopOpacity={0.6} />
            <stop offset="100%" stopColor={vgMeta.gradientTo} stopOpacity={0.25} />
          </linearGradient>
        ) : (
          <linearGradient id={gradId} x1={sourceX} y1={sourceY} x2={targetX} y2={targetY} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.7} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.2} />
          </linearGradient>
        )}
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: `url(#${gradId})`,
          strokeWidth: edgeWidth,
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
          stroke={vgMeta?.gradientFrom ?? strokeColor}
          strokeWidth="3"
          opacity="0.1"
          style={{ filter: 'blur(4px)' }}
        />
      )}
      {/* Trail particles for connected hub edges (3 staggered) */}
      {showParticle && (
        <>
          <circle r={pConfig.r} fill={vgMeta?.gradientFrom ?? strokeColor} className="flow-particle" style={{ filter: `drop-shadow(0 0 3px ${vgMeta?.gradientFrom ?? strokeColor})` }}>
            <animateMotion dur={pConfig.dur} repeatCount="indefinite" path={edgePath} />
          </circle>
          <circle r={pConfig.r * 0.8} fill={vgMeta?.gradientTo ?? strokeColor} className="flow-particle" opacity="0.5" style={{ filter: `drop-shadow(0 0 2px ${vgMeta?.gradientTo ?? strokeColor})` }}>
            <animateMotion dur={pConfig.dur} repeatCount="indefinite" path={edgePath} begin="0.5s" />
          </circle>
          <circle r={pConfig.r * 0.6} fill={vgMeta?.gradientFrom ?? strokeColor} className="flow-particle" opacity="0.2">
            <animateMotion dur={pConfig.dur} repeatCount="indefinite" path={edgePath} begin="1s" />
          </circle>
        </>
      )}
      {/* S2S active connection particle */}
      {showS2sParticle && (
        <circle r={pConfig.r} fill={strokeColor} className="flow-particle" style={{ filter: `drop-shadow(0 0 3px ${strokeColor})` }}>
          <animateMotion dur={pConfig.dur} repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
      {hovered && connectionType && (
        <foreignObject x={labelX - 40} y={labelY - 12} width={80} height={24} className="pointer-events-none">
          <div className="flex items-center justify-center rounded bg-popover px-2 py-0.5 text-[10px] text-popover-foreground shadow-sm border">
            {connectionType}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

export default memo(RadialEdgeComponent);
