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
    bg: 'bg-emerald-500/[0.03] dark:bg-emerald-400/[0.025]',
    border: 'border-emerald-500/[0.12] dark:border-emerald-400/[0.08]',
    text: 'text-emerald-600/50 dark:text-emerald-400/35',
  },
  purple: {
    bg: 'bg-violet-500/[0.03] dark:bg-violet-400/[0.025]',
    border: 'border-violet-500/[0.12] dark:border-violet-400/[0.08]',
    text: 'text-violet-600/50 dark:text-violet-400/35',
  },
  blue: {
    bg: 'bg-blue-500/[0.03] dark:bg-blue-400/[0.025]',
    border: 'border-blue-500/[0.12] dark:border-blue-400/[0.08]',
    text: 'text-blue-600/50 dark:text-blue-400/35',
  },
};

function HeroGroupNode({ data }: NodeProps) {
  const d = data as unknown as HeroGroupNodeData;
  const colors = colorMap[d.colorHint || 'green'];

  return (
    <div
      className={`w-full h-full rounded-2xl ${colors.bg} border ${colors.border} pointer-events-none select-none`}
    >
      <div className="px-3 pt-2">
        <span className={`text-[10px] font-semibold ${colors.text} tracking-[0.14em]`}>
          {d.label}
        </span>
      </div>
    </div>
  );
}

export default memo(HeroGroupNode);
