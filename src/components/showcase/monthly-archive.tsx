'use client';

import { useState } from 'react';
import { useMonthlyPicks, useMonthlyArchive } from '@/lib/queries/showcase';
import { MonthlyPickCard } from './monthly-pick-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function MonthlyArchive() {
  const { data: months, isLoading: archiveLoading } = useMonthlyArchive();
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const activeMonth = selectedMonth || (months && months.length > 0 ? months[0].year_month : '');
  const { data: picks, isLoading: picksLoading } = useMonthlyPicks(activeMonth || undefined);

  if (archiveLoading) {
    return <Skeleton className="h-32 rounded-xl" />;
  }

  if (!months || months.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="text-base font-semibold">역대 수상작</h3>
        <Select value={activeMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue placeholder="월 선택" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.year_month} value={m.year_month}>
                {m.year_month} ({m.count}건)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {picksLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : picks && picks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {picks
            .sort((a, b) => a.rank - b.rank)
            .slice(0, 3)
            .map((pick) => (
              <MonthlyPickCard key={pick.id} pick={pick} />
            ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          해당 월의 수상작이 없습니다
        </p>
      )}
    </div>
  );
}
