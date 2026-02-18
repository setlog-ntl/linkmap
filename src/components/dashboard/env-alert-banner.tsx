'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import type { ServiceCardData } from '@/types';

interface EnvAlertBannerProps {
  projectId: string;
  allCards: ServiceCardData[];
}

export function EnvAlertBanner({ projectId, allCards }: EnvAlertBannerProps) {
  const missingEnvServices = allCards.filter(
    (c) => c.envTotal > 0 && c.envFilled < c.envTotal,
  );

  if (missingEnvServices.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30 p-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            환경변수 미설정 서비스 {missingEnvServices.length}개
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingEnvServices.map((s) => (
              <Link
                key={s.projectServiceId}
                href={`/project/${projectId}/env`}
                className="inline-flex items-center gap-1 rounded-md bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
              >
                {s.name}
                <span className="text-amber-500">
                  ({s.envFilled}/{s.envTotal})
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
