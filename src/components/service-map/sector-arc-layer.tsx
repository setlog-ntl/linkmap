'use client';

import { memo } from 'react';
import { VIEW_GROUP_META, VIEW_GROUP_ORDER } from '@/lib/layout/view-group';

const CENTER_X = 600;
const CENTER_Y = 400;
const ARC_R = 360;
const SECTOR_SPAN = 72;

/** Creates an SVG arc path for a sector */
function sectorPath(startDeg: number, endDeg: number, r: number): string {
  const s = ((startDeg - 90) * Math.PI) / 180;
  const e = ((endDeg - 90) * Math.PI) / 180;
  const x1 = CENTER_X + r * Math.cos(s);
  const y1 = CENTER_Y + r * Math.sin(s);
  const x2 = CENTER_X + r * Math.cos(e);
  const y2 = CENTER_Y + r * Math.sin(e);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${CENTER_X} ${CENTER_Y} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

interface SectorArcLayerProps {
  isDark: boolean;
}

function SectorArcLayerComponent({ isDark }: SectorArcLayerProps) {
  if (!isDark) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
      {VIEW_GROUP_ORDER.map((group, i) => {
        const meta = VIEW_GROUP_META[group];
        const startAngle = i * SECTOR_SPAN;
        const endAngle = startAngle + SECTOR_SPAN;

        // Label position at mid-angle, outer edge
        const midDeg = ((startAngle + endAngle) / 2 - 90) * Math.PI / 180;
        const labelX = CENTER_X + (ARC_R + 24) * Math.cos(midDeg);
        const labelY = CENTER_Y + (ARC_R + 24) * Math.sin(midDeg);

        return (
          <g key={group}>
            <path
              d={sectorPath(startAngle, endAngle, ARC_R)}
              fill={`url(#${meta.gradientId})`}
              opacity="0.04"
            />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              fontSize="10"
              opacity="0.4"
            >
              {meta.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export const SectorArcLayer = memo(SectorArcLayerComponent);
