'use client';

import { memo } from 'react';

interface GradientMeshDefsProps {
  isDark: boolean;
}

/** Shared SVG glow filters for service map nodes/edges */
function GradientMeshDefsComponent({ isDark }: GradientMeshDefsProps) {
  const glowOpacity = isDark ? 1 : 0.5;

  return (
    <svg className="absolute" width="0" height="0" aria-hidden>
      <defs>
        {/* Glow filters — 3 sizes */}
        <filter id="gm-glow-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feFlood floodOpacity={0.3 * glowOpacity} result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="gm-glow-md" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feFlood floodOpacity={0.4 * glowOpacity} result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="gm-glow-lg" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feFlood floodOpacity={0.5 * glowOpacity} result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

export const GradientMeshDefs = memo(GradientMeshDefsComponent);
