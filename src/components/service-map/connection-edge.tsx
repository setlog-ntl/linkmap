'use client';

import { memo, useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import { X } from 'lucide-react';
import { useServiceMapStore } from '@/stores/service-map-store';
import type { DependencyType, UserConnectionType } from '@/types';

/** All connection styles - dependencies + user connections
 *  weight: 1=lightweight, 2=normal, 3=critical
 *  bidirectional: true for types that represent two-way relationships */
const styles: Record<string, { color: string; dash: string; label: string; weight: number; bidirectional?: boolean; icon: string }> = {
  // Dependency types (always unidirectional)
  required:    { color: 'var(--destructive)', dash: '0',   label: '필수',   weight: 3.5, icon: '→' },
  recommended: { color: 'var(--primary)',     dash: '0',   label: '권장',   weight: 2, icon: '→' },
  optional:    { color: 'var(--muted-foreground)', dash: '6 3', label: '선택', weight: 1.5, icon: '→' },
  alternative: { color: 'var(--chart-4)',     dash: '6 3', label: '대체',   weight: 1.5, icon: '↔' },
  // User connection types
  uses:          { color: '#3b82f6', dash: '0',   label: '사용',       weight: 2, icon: '→' },
  integrates:    { color: '#22c55e', dash: '0',   label: '연동',       weight: 3, bidirectional: true, icon: '⇄' },
  data_transfer: { color: '#f97316', dash: '6 3', label: '데이터 전달', weight: 2, bidirectional: true, icon: '↔' },
  api_call:      { color: '#8b5cf6', dash: '0',   label: 'API 호출',   weight: 3, icon: '→' },
  auth_provider: { color: '#ec4899', dash: '4 2', label: '인증 제공',   weight: 2, icon: '←' },
  webhook:       { color: '#14b8a6', dash: '6 2', label: '웹훅',       weight: 1, icon: '→' },
  sdk:           { color: '#6366f1', dash: '0',   label: 'SDK',        weight: 1, icon: '→' },
};

interface ConnectionEdgeData {
  connectionType: DependencyType | UserConnectionType;
  onDelete?: (edgeId: string) => void;
  sourceName?: string;
  targetName?: string;
  parallelOffset?: number;
  [key: string]: unknown;
}

function ConnectionEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [hovered, setHovered] = useState(false);
  const editMode = useServiceMapStore((s) => s.editMode);
  const setHoveredEdge = useServiceMapStore((s) => s.setHoveredEdge);
  const hoveredNodeId = useServiceMapStore((s) => s.hoveredNodeId);
  const edgeData = data as unknown as ConnectionEdgeData;
  const connType = edgeData?.connectionType || 'uses';
  const s = styles[connType] || styles.uses;
  const isBidirectional = s.bidirectional === true;
  const parallelOffset = (edgeData?.parallelOffset as number) || 0;

  // Apply parallel offset perpendicular to the edge direction
  let adjustedSourceX = sourceX;
  let adjustedSourceY = sourceY;
  let adjustedTargetX = targetX;
  let adjustedTargetY = targetY;

  if (parallelOffset !== 0) {
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    // Perpendicular unit vector
    const px = -dy / len;
    const py = dx / len;
    adjustedSourceX += px * parallelOffset;
    adjustedSourceY += py * parallelOffset;
    adjustedTargetX += px * parallelOffset;
    adjustedTargetY += py * parallelOffset;
  }

  // Adaptive curvature: lower for long edges (avoids wide sweeping arcs),
  // higher for short edges or perpendicular handle pairs.
  const edgeLength = Math.sqrt(
    (adjustedTargetX - adjustedSourceX) ** 2 + (adjustedTargetY - adjustedSourceY) ** 2,
  );
  const isPerpendicularHandles =
    (sourcePosition === 'left' || sourcePosition === 'right') !==
    (targetPosition === 'left' || targetPosition === 'right');
  const baseCurvature = isPerpendicularHandles ? 0.35 : 0.25;
  // Scale down for long edges (>400px), scale up for short (<120px)
  const curvature = edgeLength > 400
    ? baseCurvature * 0.6
    : edgeLength < 120
      ? baseCurvature * 1.3
      : baseCurvature;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: adjustedSourceX,
    sourceY: adjustedSourceY,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    sourcePosition,
    targetPosition,
    curvature,
  });

  // Dim edges not connected to hovered node
  const isRelatedToHoveredNode = hoveredNodeId
    ? source === hoveredNodeId || target === hoveredNodeId
    : true;

  const showLabel = true;
  const labelOpacity = hovered ? 1.0 : 0.75;
  const showPacket = s.weight >= 2 && s.dash === '0';

  // Marching ants on hover: override dash to animated pattern
  const isStaticDashed = s.dash !== '0';
  const strokeDasharray = hovered && !isStaticDashed ? '5 5' : (isStaticDashed ? s.dash : undefined);

  // Via hole for long edges only (200px+)
  const midX = (adjustedSourceX + adjustedTargetX) / 2;
  const midY = (adjustedSourceY + adjustedTargetY) / 2;
  const showViaHole = edgeLength > 200;

  const handleMouseEnter = () => {
    setHovered(true);
    setHoveredEdge(id, { source: source ?? '', target: target ?? '' });
  };
  const handleMouseLeave = () => {
    setHovered(false);
    setHoveredEdge(null);
  };

  // Unique marker ID per connection type for colored arrows
  const markerId = `arrow-${connType}-${id}`;

  // Build direction label: icon + type
  const sourceName = edgeData?.sourceName as string | undefined;
  const targetName = edgeData?.targetName as string | undefined;
  const dirLabel = hovered && sourceName && targetName
    ? `${sourceName} ${s.icon} ${targetName}`
    : `${s.icon} ${s.label}`;

  return (
    <>
      {/* Custom colored arrow markers — end and start */}
      <defs>
        {/* Target arrow — larger, filled triangle */}
        <marker
          id={markerId}
          markerWidth="20"
          markerHeight="20"
          refX="17"
          refY="10"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M4 4 L17 10 L4 16 L7 10 Z" fill={s.color} opacity="0.95" />
        </marker>
        {/* Source arrow — for bidirectional edges, reversed filled triangle */}
        {isBidirectional ? (
          <marker
            id={`${markerId}-start`}
            markerWidth="20"
            markerHeight="20"
            refX="3"
            refY="10"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M16 4 L3 10 L16 16 L13 10 Z" fill={s.color} opacity="0.95" />
          </marker>
        ) : (
          <marker
            id={`${markerId}-start`}
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <circle cx="5" cy="5" r="3" fill={s.color} opacity="0.6" />
          </marker>
        )}
      </defs>

      {/* Invisible wider path for hover detection */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={20}
        stroke="transparent"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="react-flow__edge-interaction"
      />

      {/* Subtle glow underlay — always visible, stronger on hover */}
      <path
        d={edgePath}
        fill="none"
        stroke={s.color}
        strokeWidth={s.weight + (hovered ? 4 : 2)}
        opacity={hovered ? 0.1 : 0.04}
        style={{ filter: `blur(${hovered ? 4 : 2}px)`, transition: 'opacity 0.2s ease' }}
      />

      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={`url(#${markerId})`}
        markerStart={`url(#${markerId}-start)`}
        style={{
          stroke: s.color,
          strokeWidth: hovered ? s.weight + 1 : s.weight,
          strokeDasharray,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          opacity: isRelatedToHoveredNode ? 1 : 0.3,
          transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
        }}
        className={hovered && !isStaticDashed ? 'animate-edge-march' : ''}
      />

      {/* Via hole marker for long edges (PCB style) */}
      {showViaHole && (
        <g className="animate-pcb-via">
          <circle cx={midX} cy={midY} r={4} fill="var(--background)" stroke={s.color} strokeWidth={1.2} opacity={0.6} />
          <circle cx={midX} cy={midY} r={1.5} fill={s.color} opacity={0.5} />
        </g>
      )}

      {/* Data packet — rectangular PCB packet instead of circular */}
      {showPacket && (
        <rect
          width={8}
          height={4}
          rx={1}
          fill={s.color}
          className="flow-particle"
          style={{ filter: `drop-shadow(0 0 3px ${s.color})`, opacity: 0.85 }}
        >
          <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} rotate="auto" />
        </rect>
      )}

      {/* Second staggered packet for heavy connections */}
      {showPacket && s.weight >= 3 && (
        <rect
          width={6}
          height={3}
          rx={1}
          fill={s.color}
          className="flow-particle"
          style={{ opacity: 0.5 }}
        >
          <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} rotate="auto" begin="1.2s" />
        </rect>
      )}

      {/* Reverse packet for bidirectional edges */}
      {showPacket && isBidirectional && (
        <rect
          width={7}
          height={3.5}
          rx={1}
          fill={s.color}
          className="flow-particle"
          style={{ filter: `drop-shadow(0 0 3px ${s.color})`, opacity: 0.7 }}
        >
          <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} rotate="auto" keyPoints="1;0" keyTimes="0;1" begin="0.8s" />
        </rect>
      )}

      {showLabel && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-auto"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              opacity: labelOpacity,
              transition: 'opacity 0.2s ease, max-width 0.3s ease',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center gap-1">
              <span
                className="rounded-full border px-1.5 py-0.5 text-[11px] font-medium shadow-sm font-mono whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--background)',
                  color: s.color,
                  borderColor: s.color,
                  maxWidth: hovered ? '240px' : '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  transition: 'max-width 0.3s ease',
                }}
              >
                {dirLabel}
              </span>
              {edgeData?.onDelete && (hovered || editMode) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    edgeData.onDelete?.(id);
                  }}
                  className="rounded-full bg-destructive text-destructive-foreground p-0.5 shadow-sm hover:bg-destructive/90 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(ConnectionEdge);
