'use client';

import { cn } from '@/lib/utils';
import type { LeaderboardPeriod } from '@/types/core';

const PERIODS: { value: LeaderboardPeriod; label: string }[] = [
  { value: 'week', label: '이번 주' },
  { value: 'month', label: '이번 달' },
  { value: 'all', label: '전체' },
];

interface PeriodFilterProps {
  value: LeaderboardPeriod;
  onChange: (period: LeaderboardPeriod) => void;
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <div className="flex gap-1 p-1 rounded-lg bg-muted/50">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onChange(p.value)}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
            value === p.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
