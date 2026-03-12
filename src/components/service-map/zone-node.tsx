'use client';

import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import { Monitor, Server, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useServiceMapStore } from '@/stores/service-map-store';

const ZONE_ICONS: Record<string, typeof Monitor> = {
  frontend: Monitor,
  backend: Server,
  devtools: Wrench,
};

const ZONE_SUBTITLES: Record<string, string> = {
  frontend: 'UI & Client',
  backend: 'Server & API',
  devtools: 'Build & Test',
};

interface ZoneNodeData {
  domain: string;
  label: string;
  emoji: string;
  count: number;
  [key: string]: unknown;
}

function ZoneNode({ data }: NodeProps) {
  const d = data as unknown as ZoneNodeData;
  const editMode = useServiceMapStore((s) => s.editMode);
  const Icon = ZONE_ICONS[d.domain] || Server;
  const subtitle = ZONE_SUBTITLES[d.domain] || '';

  const borderColors: Record<string, string> = {
    frontend: 'border-blue-200/60 dark:border-blue-500/20',
    backend: 'border-violet-200/60 dark:border-violet-500/20',
    devtools: 'border-yellow-200/60 dark:border-yellow-500/20',
  };
  const chipColors: Record<string, string> = {
    frontend: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    backend: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800',
    devtools: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-800',
  };
  const bgColors: Record<string, string> = {
    frontend: 'dark:bg-blue-950/5',
    backend: 'dark:bg-violet-950/5',
    devtools: 'dark:bg-yellow-950/5',
  };

  const borderClass = borderColors[d.domain] || 'border-border/40';
  const chipClass = chipColors[d.domain] || 'bg-muted text-foreground/80 border-border';
  const bgClass = bgColors[d.domain] || '';

  return (
    <div className={`w-full h-full rounded-[18px] border transition-colors ${bgClass} ${
      editMode ? 'border-primary/40' : borderClass
    }`}>
      {/* Zone label chip — absolute positioned at top */}
      <div className="absolute -top-3 left-4 z-10">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] border text-[10px] font-semibold tracking-wide shadow-sm backdrop-blur-sm ${chipClass}`}>
          <Icon className="h-3.5 w-3.5 opacity-75" />
          <span>{d.label}</span>
          {subtitle && <span className="text-[8.5px] font-medium opacity-55 tracking-normal">{subtitle}</span>}
          <Badge variant="secondary" className="text-[9px] h-4 px-1.5 ml-0.5 rounded-[5px]">
            {d.count}
          </Badge>
        </div>
      </div>
      {d.count === 0 && (
        <div className="px-4 pt-8 text-xs text-muted-foreground/60">
          + 서비스 추가
        </div>
      )}
    </div>
  );
}

export default memo(ZoneNode);
