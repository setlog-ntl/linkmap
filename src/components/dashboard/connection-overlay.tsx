'use client';

import { memo, useCallback, useMemo } from 'react';
import type { CardRect } from './hooks/use-card-positions';
import type { UserConnection, ConnectionStatus } from '@/types';

interface ConnectionOverlayProps {
  connections: UserConnection[];
  positions: Map<string, CardRect>;
  selectedConnectionId: string | null;
  onSelectConnection: (id: string | null) => void;
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

export const ConnectionOverlay = memo(function ConnectionOverlay({
  connections,
  positions,
  selectedConnectionId,
  onSelectConnection,
}: ConnectionOverlayProps) {
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
      </defs>

      {lines.map(({ conn, source, target }) => {
        const path = getBezierPath(source, target);
        const color = STATUS_COLORS[conn.connection_status] ?? STATUS_COLORS.active;
        const dash = TYPE_DASH[conn.connection_type] ?? '';
        const isSelected = selectedConnectionId === conn.id;

        return (
          <g key={conn.id}>
            {/* Invisible wider path for click target */}
            <path
              d={path}
              fill="none"
              stroke="transparent"
              strokeWidth={12}
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
            />
            {/* Label on path */}
            {conn.label && isSelected && (
              <text
                className="pointer-events-none fill-foreground text-[10px]"
                dy={-6}
              >
                <textPath href={`#path-${conn.id}`} startOffset="50%" textAnchor="middle">
                  {conn.label}
                </textPath>
              </text>
            )}
            {/* Hidden path with ID for textPath */}
            {conn.label && isSelected && (
              <path id={`path-${conn.id}`} d={path} fill="none" stroke="none" />
            )}
          </g>
        );
      })}
    </svg>
  );
});
