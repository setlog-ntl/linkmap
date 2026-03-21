'use client';

import { memo } from 'react';

interface AlignmentGuidesProps {
  /** Horizontal guide Y positions (row alignment) */
  horizontalGuides: number[];
  /** Vertical guide X positions (column alignment) */
  verticalGuides: number[];
}

/**
 * SVG overlay showing alignment guide lines when a node aligns
 * with other nodes during drag. Similar to Figma/Sketch smart guides.
 */
function AlignmentGuidesInner({ horizontalGuides, verticalGuides }: AlignmentGuidesProps) {
  if (horizontalGuides.length === 0 && verticalGuides.length === 0) return null;

  return (
    <svg
      className="react-flow__alignment-guides"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
        overflow: 'visible',
      }}
    >
      {horizontalGuides.map((y, i) => (
        <line
          key={`h-${i}`}
          x1="-10000"
          x2="10000"
          y1={y}
          y2={y}
          stroke="var(--primary)"
          strokeWidth={0.5}
          strokeDasharray="4 4"
          opacity={0.6}
        />
      ))}
      {verticalGuides.map((x, i) => (
        <line
          key={`v-${i}`}
          x1={x}
          x2={x}
          y1="-10000"
          y2="10000"
          stroke="var(--primary)"
          strokeWidth={0.5}
          strokeDasharray="4 4"
          opacity={0.6}
        />
      ))}
    </svg>
  );
}

export const AlignmentGuides = memo(AlignmentGuidesInner);
