'use client';

import { useMemo } from 'react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { getHealthGrade } from '@/lib/utils/health-score';
import type { HealthScore } from '@/types';

interface HealthScoreRingProps {
  score: HealthScore;
}

const GRADE_COLORS = {
  good: { stroke: '#22c55e', text: 'text-green-600 dark:text-green-400' },
  warning: { stroke: '#f59e0b', text: 'text-amber-600 dark:text-amber-400' },
  critical: { stroke: '#ef4444', text: 'text-red-600 dark:text-red-400' },
};

export function HealthScoreRing({ score }: HealthScoreRingProps) {
  const { locale } = useLocaleStore();
  const grade = getHealthGrade(score.overall);
  const colors = GRADE_COLORS[grade];
  const gradeLabel = t(locale, `serviceMap.healthScore.${grade}`);

  const circumference = 2 * Math.PI * 45;
  const offset = useMemo(
    () => circumference - (score.overall / 100) * circumference,
    [score.overall, circumference]
  );

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-28 h-28 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
          <circle
            cx="50" cy="50" r="45" fill="none" stroke={colors.stroke} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${colors.text}`}>{score.overall}</span>
          <span className="text-[10px] text-muted-foreground">{gradeLabel}</span>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">{t(locale, 'serviceMap.healthScore.connected')}</span>
          <span className="font-medium ml-auto">{score.breakdown.connected}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground">{t(locale, 'serviceMap.healthScore.healthy')}</span>
          <span className="font-medium ml-auto">{score.breakdown.healthy}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-muted-foreground">{t(locale, 'serviceMap.healthScore.envComplete')}</span>
          <span className="font-medium ml-auto">{score.breakdown.envComplete}%</span>
        </div>
      </div>
    </div>
  );
}
