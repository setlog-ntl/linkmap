'use client';

import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';

import type { GroupColorHint } from '@/data/hero-flow-config';

interface HeroGroupNodeData {
  label: string;
  colorHint?: GroupColorHint;
  [key: string]: unknown;
}

type InnerColorHint = Exclude<GroupColorHint, 'outer'>;

const colorMap: Record<InnerColorHint, { border: string; text: string }> = {
  green: {
    border: 'border-emerald-500/20 dark:border-emerald-400/15',
    text: 'text-emerald-600/40 dark:text-emerald-400/30',
  },
  purple: {
    border: 'border-violet-500/20 dark:border-violet-400/15',
    text: 'text-violet-600/40 dark:text-violet-400/30',
  },
  blue: {
    border: 'border-blue-500/20 dark:border-blue-400/15',
    text: 'text-blue-600/40 dark:text-blue-400/30',
  },
  amber: {
    border: 'border-amber-500/20 dark:border-amber-400/15',
    text: 'text-amber-600/40 dark:text-amber-400/30',
  },
  red: {
    border: 'border-red-500/20 dark:border-red-400/15',
    text: 'text-red-600/40 dark:text-red-400/30',
  },
  cyan: {
    border: 'border-cyan-500/20 dark:border-cyan-400/15',
    text: 'text-cyan-600/40 dark:text-cyan-400/30',
  },
  orange: {
    border: 'border-orange-500/20 dark:border-orange-400/15',
    text: 'text-orange-600/40 dark:text-orange-400/30',
  },
  pink: {
    border: 'border-pink-500/20 dark:border-pink-400/15',
    text: 'text-pink-600/40 dark:text-pink-400/30',
  },
};

// outer: 전체를 감싸는 단일 외부 박스 스타일
const outerStyle = {
  border: 'border-border/30 dark:border-border/20',
  text: '',
};

function HeroGroupNode({ data }: NodeProps) {
  const d = data as unknown as HeroGroupNodeData;
  const hint = d.colorHint ?? 'green';

  if (hint === 'outer') {
    return (
      <div
        className="w-full h-full relative pointer-events-none select-none"
        style={{ overflow: 'visible' }}
      >
        {/* 단일 외부 바운딩 박스 — 매우 subtle한 테두리 */}
        <div className={`absolute inset-0 rounded-3xl border ${outerStyle.border}`} />
      </div>
    );
  }

  const colors = colorMap[hint as InnerColorHint];

  return (
    <div
      className="w-full h-full relative pointer-events-none select-none"
      style={{ overflow: 'visible' }}
    >
      {/* 단순 라운드 테두리 선만 — 배경 없음 */}
      <div className={`absolute inset-0 rounded-2xl border ${colors.border}`} />
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
