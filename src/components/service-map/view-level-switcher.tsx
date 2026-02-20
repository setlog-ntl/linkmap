'use client';

import { Eye, Map, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { ViewLevel } from '@/types';

const LEVELS: { key: ViewLevel; icon: typeof Eye; labelKey: string }[] = [
  { key: 'status', icon: Eye, labelKey: 'serviceMap.viewLevel.status' },
  { key: 'map', icon: Map, labelKey: 'serviceMap.viewLevel.map' },
  { key: 'dependency', icon: GitBranch, labelKey: 'serviceMap.viewLevel.dependency' },
];

export function ViewLevelSwitcher() {
  const { viewLevel, setViewLevel } = useServiceMapStore();
  const { locale } = useLocaleStore();

  return (
    <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
      {LEVELS.map(({ key, icon: Icon, labelKey }) => (
        <Button
          key={key}
          variant={viewLevel === key ? 'secondary' : 'ghost'}
          size="sm"
          className="h-7 gap-1.5 px-2.5 text-xs"
          onClick={() => setViewLevel(key)}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t(locale, labelKey)}</span>
        </Button>
      ))}
    </div>
  );
}
