'use client';

import { memo, useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  MarkerType,
  type EdgeProps,
} from '@xyflow/react';
import { X } from 'lucide-react';
import { useServiceMapStore } from '@/stores/service-map-store';
import type { DependencyType, UserConnectionType } from '@/types';

/** All connection styles - dependencies + user connections */
const styles: Record<string, { color: string; dash: string; label: string }> = {
  // Dependency types
  required:    { color: 'var(--destructive)', dash: '0',   label: '필수' },
  recommended: { color: 'var(--primary)',     dash: '0',   label: '권장' },
  optional:    { color: 'var(--muted-foreground)', dash: '6 3', label: '선택' },
  alternative: { color: 'var(--chart-4)',     dash: '6 3', label: '대체' },
  // User connection types
  uses:          { color: '#3b82f6', dash: '0',   label: '사용' },
  integrates:    { color: '#22c55e', dash: '0',   label: '연동' },
  data_transfer: { color: '#f97316', dash: '6 3', label: '데이터 전달' },
  api_call:      { color: '#8b5cf6', dash: '0',   label: 'API 호출' },
  auth_provider: { color: '#ec4899', dash: '4 2', label: '인증 제공' },
  webhook:       { color: '#14b8a6', dash: '6 2', label: '웹훅' },
  sdk:           { color: '#6366f1', dash: '0',   label: 'SDK' },
};

interface ConnectionEdgeData {
  connectionType: DependencyType | UserConnectionType;
  onDelete?: (edgeId: string) => void;
  [key: string]: unknown;
}

function ConnectionEdge({
  id,
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
  const edgeData = data as unknown as ConnectionEdgeData;
  const connType = edgeData?.connectionType || 'uses';
  const s = styles[connType] || styles.uses;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const showLabel = hovered || editMode;

  return (
    <>
      {/* Invisible wider path for hover detection */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={20}
        stroke="transparent"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="react-flow__edge-interaction"
      />
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={MarkerType.ArrowClosed}
        style={{
          stroke: s.color,
          strokeWidth: 2,
          strokeDasharray: s.dash !== '0' ? s.dash : undefined,
        }}
      />
      {showLabel && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-auto"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="flex items-center gap-1">
              <span
                className="rounded-full border px-1.5 py-0.5 text-[10px] font-medium shadow-sm"
                style={{
                  backgroundColor: 'var(--background)',
                  color: s.color,
                  borderColor: s.color,
                }}
              >
                {s.label}
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
