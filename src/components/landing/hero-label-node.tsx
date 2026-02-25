'use client';

import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import type { GroupColorHint } from '@/data/hero-flow-config';

interface HeroLabelNodeData {
  text: string;
  colorHint?: Exclude<GroupColorHint, 'outer'>;
  [key: string]: unknown;
}

const colorMap: Record<Exclude<GroupColorHint, 'outer'>, string> = {
  green:  'text-emerald-500/50 dark:text-emerald-400/40',
  purple: 'text-violet-500/50 dark:text-violet-400/40',
  blue:   'text-blue-500/50 dark:text-blue-400/40',
  amber:  'text-amber-500/50 dark:text-amber-400/40',
  red:    'text-red-500/50 dark:text-red-400/40',
  cyan:   'text-cyan-500/50 dark:text-cyan-400/40',
  orange: 'text-orange-500/50 dark:text-orange-400/40',
  pink:   'text-pink-500/50 dark:text-pink-400/40',
};

function HeroLabelNode({ data }: NodeProps) {
  const d = data as unknown as HeroLabelNodeData;
  const colorClass = colorMap[d.colorHint ?? 'blue'];

  return (
    <div className="pointer-events-none select-none">
      <span
        className={`text-[9px] font-semibold tracking-[0.18em] whitespace-nowrap ${colorClass}`}
      >
        {d.text}
      </span>
    </div>
  );
}

export default memo(HeroLabelNode);
