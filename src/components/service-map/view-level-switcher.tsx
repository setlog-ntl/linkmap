'use client';

import { Map, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useServiceMapStore } from '@/stores/service-map-store';
import type { ViewLevel } from '@/types';

const LEVELS: { key: ViewLevel; icon: typeof Map; label: string }[] = [
  { key: 'map', icon: Map, label: '맵 보기' },
  { key: 'dependency', icon: GitBranch, label: '의존성 보기' },
];

export function ViewLevelSwitcher() {
  const { viewLevel, setViewLevel } = useServiceMapStore();

  return (
    <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
      {LEVELS.map(({ key, icon: Icon, label }) => (
        <Button
          key={key}
          variant={viewLevel === key ? 'secondary' : 'ghost'}
          size="sm"
          className="h-7 gap-1.5 px-2.5 text-xs"
          onClick={() => setViewLevel(key)}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}
