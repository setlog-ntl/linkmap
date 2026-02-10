'use client';

import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';

interface GroupNodeData {
  label: string;
  emoji: string;
  [key: string]: unknown;
}

function GroupNode({ data }: NodeProps) {
  const d = data as unknown as GroupNodeData;

  return (
    <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 dark:bg-muted/5 px-4 pt-2 pb-4 min-w-[200px] min-h-[120px]">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
        <span>{d.emoji}</span>
        <span>{d.label}</span>
      </div>
    </div>
  );
}

export default memo(GroupNode);
