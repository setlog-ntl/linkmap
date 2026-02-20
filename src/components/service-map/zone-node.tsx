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
    frontend: 'border-blue-300/40 dark:border-blue-500/30',
    backend: 'border-violet-300/40 dark:border-violet-500/30',
    devtools: 'border-yellow-300/40 dark:border-yellow-500/30',
  };
  const headerColors: Record<string, string> = {
    frontend: 'text-blue-700 dark:text-blue-300',
    backend: 'text-violet-700 dark:text-violet-300',
    devtools: 'text-yellow-700 dark:text-yellow-300',
  };
  const borderClass = borderColors[d.domain] || 'border-border/40';
  const headerClass = headerColors[d.domain] || 'text-foreground/80';

  return (
    <div className={`w-full h-full rounded-2xl border transition-colors ${
      editMode ? 'border-dashed border-primary/40' : borderClass
    }`}>
      {/* Zone header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
        <Icon className={`h-4 w-4 ${headerClass}`} />
        <div className="flex flex-col">
          <span className={`text-sm font-semibold ${headerClass}`}>{d.label}</span>
          {subtitle && <span className="text-[10px] text-muted-foreground leading-tight">{subtitle}</span>}
        </div>
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
