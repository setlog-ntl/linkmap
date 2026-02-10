'use client';

import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface GroupNodeData {
  label: string;
  emoji: string;
  collapsed?: boolean;
  childCount?: number;
  onToggleCollapse?: () => void;
  [key: string]: unknown;
}

function GroupNode({ data }: NodeProps) {
  const d = data as unknown as GroupNodeData;
  const isCollapsed = d.collapsed === true;
  const childCount = d.childCount || 0;

  if (isCollapsed) {
    return (
      <div
        className="rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 dark:bg-muted/10 px-4 py-3 w-[200px] cursor-pointer hover:border-muted-foreground/50 transition-colors"
        onClick={d.onToggleCollapse}
      >
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <ChevronRight className="h-3 w-3" />
          <span>{d.emoji}</span>
          <span>{d.label}</span>
          <span className="ml-auto bg-muted rounded-full px-1.5 py-0.5 text-[10px]">
            {childCount}개
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 dark:bg-muted/5 px-4 pt-2 pb-4 min-w-[200px] min-h-[120px]">
      <div
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2 cursor-pointer hover:text-foreground transition-colors"
        onClick={d.onToggleCollapse}
      >
        <ChevronDown className="h-3 w-3" />
        <span>{d.emoji}</span>
        <span>{d.label}</span>
        {childCount > 0 && (
          <span className="ml-1 text-[10px] opacity-60">({childCount})</span>
        )}
      </div>
    </div>
  );
}

export default memo(GroupNode);
