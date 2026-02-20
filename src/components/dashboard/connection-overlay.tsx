'use client';

import { memo, useCallback, useMemo } from 'react';
import { getServiceEmoji } from '@/lib/constants/service-brands';
import type { CardRect } from './hooks/use-card-positions';
import type { UserConnection, ConnectionStatus, ServiceCardData } from '@/types';

interface ConnectionOverlayProps {
  connections: UserConnection[];
  positions: Map<string, CardRect>;
  selectedConnectionId: string | null;
  onSelectConnection: (id: string | null) => void;
  allCards?: ServiceCardData[];
}

const STATUS_COLORS: Record<ConnectionStatus, string> = {
  active: '#22c55e',    // green-500
  inactive: '#94a3b8',  // slate-400
  error: '#ef4444',     // red-500
  pending: '#eab308',   // yellow-500
};

const TYPE_DASH: Record<string, string> = {
  uses: '',
  integrates: '8 4',
  data_transfer: '4 4',
  api_call: '',
  auth_provider: '12 4',
  webhook: '6 2',
  sdk: '',
};

const TYPE_LABELS: Record<string, string> = {
  uses: 'Uses',
  integrates: 'Integrates',
  data_transfer: 'Data',
  api_call: 'API',
  auth_provider: 'Auth',
  webhook: 'Webhook',
  sdk: 'SDK',
};

function getBezierPath(
  source: CardRect,
  target: CardRect
): string {
  const sx = source.x + source.width;
  const sy = source.centerY;
  const tx = target.x;
  const ty = target.centerY;

  // If target is to the left of source, use alternative anchor points
  if (tx < sx) {
    const s2x = source.centerX;
    const s2y = source.y + source.height;
    const t2x = target.centerX;
    const t2y = target.y;
    const midY = (s2y + t2y) / 2;
    return `M${s2x},${s2y} C${s2x},${midY} ${t2x},${midY} ${t2x},${t2y}`;
  }

  const midX = (sx + tx) / 2;
  return `M${sx},${sy} C${midX},${sy} ${midX},${ty} ${tx},${ty}`;
}

function getBezierMidpoint(source: CardRect, target: CardRect): { x: number; y: number } {
  const sx = source.x + source.width;
  const sy = source.centerY;
  const tx = target.x;
  const ty = target.centerY;

  if (tx < sx) {
    const s2x = source.centerX;
    const s2y = source.y + source.height;
    const t2x = target.centerX;
    const t2y = target.y;
    return { x: (s2x + t2x) / 2, y: (s2y + t2y) / 2 };
  }

  return { x: (sx + tx) / 2, y: (sy + ty) / 2 };
}

export const ConnectionOverlay = memo(function ConnectionOverlay({
  connections,
  positions,
  selectedConnectionId,
  onSelectConnection,
  allCards = [],
}: ConnectionOverlayProps) {
  const serviceMap = useMemo(() => {
    const map = new Map<string, ServiceCardData>();
    for (const card of allCards) {
      map.set(card.serviceId, card);
    }
    return map;
  }, [allCards]);

  const lines = useMemo(() => {
    return connections
      .map((conn) => {
        const source = positions.get(conn.source_service_id);
        const target = positions.get(conn.target_service_id);
        if (!source || !target) return null;
        return { conn, source, target };
      })
      .filter(Boolean) as Array<{
        conn: UserConnection;
        source: CardRect;
        target: CardRect;
      }>;
  }, [connections, positions]);

  const handleClick = useCallback(
    (e: React.MouseEvent, connId: string) => {
      e.stopPropagation();
      onSelectConnection(selectedConnectionId === connId ? null : connId);
    },
    [onSelectConnection, selectedConnectionId]
  );

  if (lines.length === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
        </marker>
        {/* Status-colored arrowheads */}
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <marker
            key={status}
            id={`arrow-${status}`}
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={color} />
          </marker>
        ))}
        {/* Glow filter for selected connections */}
        <filter id="conn-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {lines.map(({ conn, source, target }) => {
        const path = getBezierPath(source, target);
        const color = STATUS_COLORS[conn.connection_status] ?? STATUS_COLORS.active;
        const dash = TYPE_DASH[conn.connection_type] ?? '';
        const isSelected = selectedConnectionId === conn.id;
        const mid = getBezierMidpoint(source, target);
        const sourceCard = serviceMap.get(conn.source_service_id);
        const targetCard = serviceMap.get(conn.target_service_id);
        const typeLabel = TYPE_LABELS[conn.connection_type] ?? conn.connection_type;

        return (
          <g key={conn.id}>
            {/* Invisible wider path for click target */}
            <path
              d={path}
              fill="none"
              stroke="transparent"
              strokeWidth={14}
              className="pointer-events-auto cursor-pointer"
              onClick={(e) => handleClick(e, conn.id)}
            />
            {/* Visible path */}
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={isSelected ? 2.5 : 1.5}
              strokeDasharray={dash}
              strokeOpacity={isSelected ? 1 : 0.6}
              markerEnd={`url(#arrow-${conn.connection_status})`}
              className="transition-all duration-200"
              filter={isSelected ? 'url(#conn-glow)' : undefined}
            />

            {/* Midpoint badge with connection type + service emojis */}
            {isSelected && (
              <g>
                {/* Badge background */}
                <rect
                  x={mid.x - 40}
                  y={mid.y - 12}
                  width={80}
                  height={24}
                  rx={6}
                  fill="hsl(var(--card))"
                  stroke={color}
                  strokeWidth={1}
                  opacity={0.95}
                />
                {/* Source emoji */}
                {sourceCard && (
                  <text x={mid.x - 32} y={mid.y + 4} className="text-[10px]" textAnchor="middle">
                    {getServiceEmoji(sourceCard.slug)}
                  </text>
                )}
                {/* Type label */}
                <text
                  x={mid.x}
                  y={mid.y + 3}
                  textAnchor="middle"
                  className="text-[9px] font-medium fill-foreground"
                >
                  {conn.label || typeLabel}
                </text>
                {/* Target emoji */}
                {targetCard && (
                  <text x={mid.x + 32} y={mid.y + 4} className="text-[10px]" textAnchor="middle">
                    {getServiceEmoji(targetCard.slug)}
                  </text>
                )}
              </g>
            )}

            {/* Source/Target endpoint indicators (always visible, subtle) */}
            {!isSelected && (
              <>
                <circle
                  cx={source.x + source.width}
                  cy={source.centerY}
                  r={3}
                  fill={color}
                  opacity={0.4}
                />
                <circle
                  cx={target.x}
                  cy={target.centerY}
                  r={3}
                  fill={color}
                  opacity={0.4}
                />
              </>
            )}

            {/* Hidden path with ID for textPath fallback */}
            {conn.label && isSelected && (
              <path id={`path-${conn.id}`} d={path} fill="none" stroke="none" />
            )}
          </g>
        );
      })}
    </svg>
  );
});
