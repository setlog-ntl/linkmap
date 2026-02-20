'use client';

import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';

interface ZoneNodeData {
  domain: string;
  label: string;
  emoji: string;
  count: number;
  [key: string]: unknown;
}

function ZoneNode({ data }: NodeProps) {
  const d = data as unknown as ZoneNodeData;

  return (
    <div className="w-full h-full rounded-2xl border border-border/40">
      {/* Zone header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
        <span className="text-base">{d.emoji}</span>
        <span className="text-sm font-medium text-foreground/80">{d.label}</span>
        <Badge variant="secondary" className="text-[10px] h-4 px-1.5 ml-auto">
          {d.count}
        </Badge>
      </div>
      {d.count === 0 && (
        <div className="px-4 pt-2 text-xs text-muted-foreground/60">
          + 서비스 추가
        </div>
      )}
    </div>
  );
}

export default memo(ZoneNode);
