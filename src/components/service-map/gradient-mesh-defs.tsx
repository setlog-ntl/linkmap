'use client';

import { memo } from 'react';
import { VIEW_GROUP_META } from '@/lib/layout/view-group';
import type { ViewGroup } from '@/types';

interface GradientMeshDefsProps {
  isDark: boolean;
}

const VIEW_GROUPS: ViewGroup[] = ['core', 'runtime', 'growth', 'intelligence', 'infra'];

function GradientMeshDefsComponent({ isDark }: GradientMeshDefsProps) {
  const glowOpacity = isDark ? 1 : 0.5;

  return (
    <svg className="absolute" width="0" height="0" aria-hidden>
      <defs>
        {/* ViewGroup linear gradients */}
        {VIEW_GROUPS.map((group) => {
          const meta = VIEW_GROUP_META[group];
          return (
            <linearGradient key={meta.gradientId} id={meta.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={meta.gradientFrom} />
              <stop offset="100%" stopColor={meta.gradientTo} />
            </linearGradient>
          );
        })}

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
