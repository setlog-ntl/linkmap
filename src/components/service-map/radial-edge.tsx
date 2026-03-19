'use client';

import { memo, useState, useId } from 'react';
import { BaseEdge, getBezierPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

/** Status-based edge colors (high contrast against dark bg) */
const STATUS_COLORS: Record<string, { base: string; bright: string }> = {
  connected:   { base: '#4ade80', bright: '#86efac' },
  in_progress: { base: '#facc15', bright: '#fde68a' },
  error:       { base: '#fb923c', bright: '#fdba74' },
  not_started: { base: '#475569', bright: '#64748b' },
};

/** User connection status → hub status mapping */
const CONNECTION_STATUS_MAP: Record<string, string> = {
  active: 'connected',
  inactive: 'not_started',
  error: 'error',
  pending: 'in_progress',
};

/** Connection type → particle config */
const PARTICLE_CONFIG: Record<string, { dur: string; r: number }> = {
  api_call: { dur: '1.8s', r: 2 },
  data_transfer: { dur: '2.5s', r: 3 },
  webhook: { dur: '2s', r: 2 },
  auth_provider: { dur: '4s', r: 2 },
};

const VALID_STATUSES = new Set(['connected', 'in_progress', 'error', 'not_started']);

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

  const isFocusFaded = focusHighlighted === false;
  const isInactive = connectionStatus === 'inactive';
  const isHubEdge = !connectionStatus;

  // Resolve status key for color lookup
  const resolvedStatus = connectionStatus
    ? (CONNECTION_STATUS_MAP[connectionStatus] ?? 'not_started')
    : (VALID_STATUSES.has(status ?? '') ? (status as string) : 'not_started');

  const colors = STATUS_COLORS[resolvedStatus] ?? STATUS_COLORS.not_started;

  const showParticle = !isInactive && isHubEdge && status === 'connected' && !isFocusFaded;
  const showInProgressParticle = !isInactive && isHubEdge && status === 'in_progress' && !isFocusFaded;
  const showErrorParticle = !isInactive && isHubEdge && status === 'error' && !isFocusFaded;
  const showS2sParticle = !isInactive && !isHubEdge && connectionStatus === 'active' && !isFocusFaded;
  const showS2sInProgress = !isInactive && !isHubEdge && connectionStatus === 'pending' && !isFocusFaded;
  const showS2sError = !isInactive && !isHubEdge && connectionStatus === 'error' && !isFocusFaded;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    curvature: 0.2,
  });

  const baseOpacity = isInactive ? 0.25 : (hovered ? 0.9 : 0.5);
  const edgeOpacity = isFocusFaded ? 0.04 : baseOpacity;
  const baseWidth = isHubEdge ? 1.5 : 1;
  const edgeWidth = hovered ? baseWidth + 1 : (isFocusFaded ? 0.8 : baseWidth);

  const pConfig = connectionType ? (PARTICLE_CONFIG[connectionType] ?? { dur: '3.5s', r: 2 }) : { dur: '3.5s', r: 2.5 };

  // Via hole position at midpoint of edge
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  const edgeLength = Math.sqrt((targetX - sourceX) ** 2 + (targetY - sourceY) ** 2);
  const showVia = edgeLength > 120 && !isFocusFaded;

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Status-based gradient definition */}
      <defs>
        <linearGradient id={gradId} x1={sourceX} y1={sourceY} x2={targetX} y2={targetY} gradientUnits="userSpaceOnUse">
          {isHubEdge ? (
            <>
              <stop offset="0%" stopColor={colors.bright} stopOpacity={0.55} />
              <stop offset="50%" stopColor={colors.base} stopOpacity={0.2} />
              <stop offset="100%" stopColor={colors.base} stopOpacity={0.08} />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor={colors.bright} stopOpacity={0.6} />
              <stop offset="80%" stopColor={colors.base} stopOpacity={0.25} />
              <stop offset="100%" stopColor={colors.base} stopOpacity={0.4} />
            </>
          )}
        </linearGradient>
      </defs>

      {/* PCB trace glow underlay (hover) */}
      {hovered && !isFocusFaded && (
        <path
          d={edgePath}
          fill="none"
          stroke={colors.bright}
          strokeWidth={edgeWidth + 4}
          opacity={0.08}
          style={{ filter: 'blur(4px)' }}
        />
      )}

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: `url(#${gradId})`,
          strokeWidth: edgeWidth,
          strokeDasharray: resolvedStatus === 'in_progress' ? '6 4' : resolvedStatus === 'not_started' ? '3 6' : undefined,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          opacity: edgeOpacity,
          transition: 'opacity 0.3s ease, stroke-width 0.2s ease',
          ...style,
        }}
        markerEnd={isHubEdge ? undefined : `url(#radial-arrow-${resolvedStatus})`}
      />

      {/* Via hole marker (PCB style) */}
      {showVia && (
        <g className="animate-pcb-via">
          <circle cx={midX} cy={midY} r={3.5} fill="var(--background)" stroke={colors.base} strokeWidth={1} opacity={0.4} />
          <circle cx={midX} cy={midY} r={1.2} fill={colors.base} opacity={0.35} />
        </g>
      )}

      {/* In-progress: animated dashed overlay */}
      {resolvedStatus === 'in_progress' && !isFocusFaded && (
        <path
          d={edgePath}
          fill="none"
          stroke={colors.base}
          strokeWidth={edgeWidth}
          strokeDasharray="6 4"
          opacity={edgeOpacity * 0.6}
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;-20"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
      )}
      {/* Error: pulsing glow overlay */}
      {resolvedStatus === 'error' && !isFocusFaded && (
        <path
          d={edgePath}
          fill="none"
          stroke={colors.bright}
          strokeWidth="3"
          opacity="0.15"
          style={{ filter: 'blur(3px)' }}
        >
          <animate
            attributeName="opacity"
            values="0.05;0.2;0.05"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      )}
      {/* Not-started: faint dashed line (dormant) */}
      {resolvedStatus === 'not_started' && !isFocusFaded && (
        <path
          d={edgePath}
          fill="none"
          stroke={colors.base}
          strokeWidth={edgeWidth}
          strokeDasharray="3 6"
          opacity={edgeOpacity * 0.4}
        />
      )}
      {/* Glow overlay for highlighted edges */}
      {focusHighlighted && !isFocusFaded && isHubEdge && (
        <path
          d={edgePath}
          fill="none"
          stroke={colors.bright}
          strokeWidth="3"
          opacity="0.1"
          style={{ filter: 'blur(4px)' }}
        />
      )}

      {/* ===== PCB-style rectangular data packets (replacing circular) ===== */}

      {/* Trail packets for connected hub edges (3 staggered, rectangular) */}
      {showParticle && (
        <>
          <rect width={pConfig.r * 3} height={pConfig.r * 1.5} rx={1} fill={colors.bright} className="flow-particle" style={{ filter: `drop-shadow(0 0 3px ${colors.bright})` }}>
            <animateMotion dur={pConfig.dur} repeatCount="indefinite" path={edgePath} rotate="auto" />
          </rect>
          <rect width={pConfig.r * 2.5} height={pConfig.r * 1.2} rx={1} fill={colors.base} className="flow-particle" opacity="0.5" style={{ filter: `drop-shadow(0 0 2px ${colors.base})` }}>
            <animateMotion dur={pConfig.dur} repeatCount="indefinite" path={edgePath} rotate="auto" begin="0.5s" />
          </rect>
          <rect width={pConfig.r * 2} height={pConfig.r} rx={1} fill={colors.bright} className="flow-particle" opacity="0.2">
            <animateMotion dur={pConfig.dur} repeatCount="indefinite" path={edgePath} rotate="auto" begin="1s" />
          </rect>
        </>
      )}
      {/* In-progress hub: slow single rectangular packet */}
      {showInProgressParticle && (
        <rect width={5} height={3} rx={1} fill={colors.bright} opacity="0.6" style={{ filter: `drop-shadow(0 0 3px ${colors.base})` }}>
          <animateMotion dur="5s" repeatCount="indefinite" path={edgePath} rotate="auto" />
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2s" repeatCount="indefinite" />
        </rect>
      )}
      {/* Error hub: flickering warning packet */}
      {showErrorParticle && (
        <rect width={6} height={3} rx={1} fill={colors.bright} style={{ filter: `drop-shadow(0 0 5px ${colors.base})` }}>
          <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} rotate="auto" />
          <animate attributeName="opacity" values="0.1;0.8;0.1;0.6;0.1" dur="1.2s" repeatCount="indefinite" />
        </rect>
      )}
      {/* S2S active connection packet */}
      {showS2sParticle && (
        <rect width={pConfig.r * 3} height={pConfig.r * 1.5} rx={1} fill={colors.bright} className="flow-particle" style={{ filter: `drop-shadow(0 0 3px ${colors.bright})` }}>
          <animateMotion dur={pConfig.dur} repeatCount="indefinite" path={edgePath} rotate="auto" />
        </rect>
      )}
      {/* S2S pending (in-progress) packet */}
      {showS2sInProgress && (
        <rect width={pConfig.r * 2.5} height={pConfig.r * 1.2} rx={1} fill={colors.bright} opacity="0.5" style={{ filter: `drop-shadow(0 0 2px ${colors.base})` }}>
          <animateMotion dur="5s" repeatCount="indefinite" path={edgePath} rotate="auto" />
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
        </rect>
      )}
      {/* S2S error packet */}
      {showS2sError && (
        <rect width={pConfig.r * 3} height={pConfig.r * 1.5} rx={1} fill={colors.bright} style={{ filter: `drop-shadow(0 0 4px ${colors.base})` }}>
          <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} rotate="auto" />
          <animate attributeName="opacity" values="0.1;0.7;0.1" dur="1s" repeatCount="indefinite" />
        </rect>
      )}

      {/* Connection type label on hover */}
      {hovered && connectionType && (
        <foreignObject x={labelX - 40} y={labelY - 12} width={80} height={24} className="pointer-events-none">
          <div className="flex items-center justify-center rounded bg-popover px-2 py-0.5 text-[10px] text-popover-foreground shadow-sm border font-mono">
            {connectionType}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

export default memo(RadialEdgeComponent);
