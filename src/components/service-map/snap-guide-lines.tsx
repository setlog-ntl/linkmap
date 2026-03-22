'use client';

import { memo } from 'react';
import type { GuideLine } from '@/lib/layout/snap-guides';

interface SnapGuideLinesProps {
  guides: GuideLine[];
}

/**
 * Renders alignment guide lines as SVG overlay inside ReactFlow.
 * Lines extend across the full viewport (-10000 to 10000).
 */
function SnapGuideLinesInner({ guides }: SnapGuideLinesProps) {
  if (guides.length === 0) return null;

  return (
    <svg className="react-flow__edges" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1000 }}>
      {guides.map((g, i) => (
        g.orientation === 'vertical' ? (
          <line
            key={`v-${i}`}
            x1={g.position}
            y1={-10000}
            x2={g.position}
            y2={10000}
            stroke="var(--primary)"
            strokeWidth={1}
            strokeDasharray="6 4"
            opacity={0.6}
          />
        ) : (
          <line
            key={`h-${i}`}
            x1={-10000}
            y1={g.position}
            x2={10000}
            y2={g.position}
            stroke="var(--primary)"
            strokeWidth={1}
            strokeDasharray="6 4"
            opacity={0.6}
          />
        )
      ))}
    </svg>
  );
}

export const SnapGuideLines = memo(SnapGuideLinesInner);
