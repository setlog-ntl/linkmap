'use client';

import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';
import type { DependencyType } from '@/types';

const depStyles: Record<DependencyType, { color: string; dash: string; label: string }> = {
  required:    { color: 'var(--destructive)', dash: '0', label: '필수' },
  recommended: { color: 'var(--primary)', dash: '0', label: '권장' },
  optional:    { color: 'var(--muted-foreground)', dash: '6 3', label: '선택' },
  alternative: { color: 'var(--chart-4)', dash: '6 3', label: '대체' },
};

interface DependencyEdgeData {
  dependencyType: DependencyType;
  [key: string]: unknown;
}

function DependencyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const edgeData = data as unknown as DependencyEdgeData;
  const depType = edgeData?.dependencyType || 'optional';
  const style = depStyles[depType] || depStyles.optional;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 12,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: style.color,
          strokeWidth: 2,
          strokeDasharray: style.dash !== '0' ? style.dash : undefined,
        }}
        markerEnd={`url(#dep-arrow-${depType})`}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <span className="rounded-full border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm">
            {style.label}
          </span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(DependencyEdge);
