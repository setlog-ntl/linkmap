'use client';

import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';

interface HeroGroupNodeData {
  label: string;
  colorHint?: 'green' | 'purple' | 'blue';
  [key: string]: unknown;
}

const colorMap = {
  green: {
    bg: 'bg-emerald-500/[0.03] dark:bg-emerald-400/[0.02]',
    border: 'border-emerald-500/[0.10] dark:border-emerald-400/[0.07]',
    text: 'text-emerald-600/40 dark:text-emerald-400/30',
  },
  purple: {
    bg: 'bg-violet-500/[0.03] dark:bg-violet-400/[0.02]',
    border: 'border-violet-500/[0.10] dark:border-violet-400/[0.07]',
    text: 'text-violet-600/40 dark:text-violet-400/30',
  },
  blue: {
    bg: 'bg-blue-500/[0.03] dark:bg-blue-400/[0.02]',
    border: 'border-blue-500/[0.10] dark:border-blue-400/[0.07]',
    text: 'text-blue-600/40 dark:text-blue-400/30',
  },
};

function HeroGroupNode({ data }: NodeProps) {
  const d = data as unknown as HeroGroupNodeData;
  const colors = colorMap[d.colorHint || 'green'];

  return (
    <div
      className="w-full h-full relative pointer-events-none select-none"
      style={{ overflow: 'visible' }}
    >
      {/* Region background */}
      <div className={`absolute inset-0 rounded-2xl ${colors.bg} border ${colors.border}`} />
      {/* Label outside at bottom center */}
      <span
        className={`absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold ${colors.text} tracking-[0.16em]`}
      >
        {d.label}
      </span>
    </div>
  );
}

export default memo(HeroGroupNode);
