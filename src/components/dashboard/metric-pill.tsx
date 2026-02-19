'use client';

import type { LucideIcon } from 'lucide-react';

interface MetricPillProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
}

export function MetricPill({ icon: Icon, value, label }: MetricPillProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 dark:bg-zinc-800/50 px-3.5 py-2.5 border border-border/50">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-bold font-mono leading-none">{value}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}
