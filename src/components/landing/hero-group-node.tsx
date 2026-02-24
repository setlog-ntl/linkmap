'use client';

import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';

interface HeroGroupNodeData {
  label: string;
  [key: string]: unknown;
}

function HeroGroupNode({ data }: NodeProps) {
  const d = data as unknown as HeroGroupNodeData;

  return (
    <div className="px-2.5 py-1 rounded-md bg-card/50 border border-border/50 backdrop-blur-sm">
      <span className="text-[11px] font-semibold text-muted-foreground whitespace-nowrap">
        {d.label}
      </span>
    </div>
  );
}

export default memo(HeroGroupNode);
