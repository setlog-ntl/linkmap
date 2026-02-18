'use client';

import { useMemo } from 'react';
import { useMyDeployments } from '@/lib/queries/oneclick';
import { DeploySiteCard } from './deploy-site-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Rocket, Monitor, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import Link from 'next/link';

export function MySitesClient() {
  const { locale } = useLocaleStore();
  const { data: deployments, isLoading, error } = useMyDeployments();

  // 배포 현황 통계
  const stats = useMemo(() => {
    if (!deployments || deployments.length === 0) return null;
    const total = deployments.length;
    const active = deployments.filter((d) => d.deploy_status === 'ready').length;
    const errors = deployments.filter((d) => d.deploy_status === 'error').length;
    const latest = deployments.reduce((a, b) =>
      new Date(a.created_at) > new Date(b.created_at) ? a : b
    );
    const latestDate = new Date(latest.created_at);
    const now = new Date();
    const diffMs = now.getTime() - latestDate.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    let lastDeployText: string;
    if (diffMin < 1) lastDeployText = locale === 'ko' ? '방금 전' : 'Just now';
    else if (diffMin < 60) lastDeployText = locale === 'ko' ? `${diffMin}분 전` : `${diffMin}m ago`;
    else if (diffHour < 24) lastDeployText = locale === 'ko' ? `${diffHour}시간 전` : `${diffHour}h ago`;
    else lastDeployText = locale === 'ko' ? `${diffDay}일 전` : `${diffDay}d ago`;

    return { total, active, errors, lastDeployText };
  }, [deployments, locale]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Monitor className="h-6 w-6" />
            {t(locale, 'mySites.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t(locale, 'mySites.subtitle')}
          </p>
        </div>
        <Button asChild>
          <Link href="/oneclick">
            <Rocket className="mr-2 h-4 w-4" />
            {t(locale, 'nav.oneclick')}
          </Link>
        </Button>
      </div>

      {/* 배포 현황 요약 */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Monitor className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">
                {locale === 'ko' ? '전체 사이트' : 'Total Sites'}
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">
                {locale === 'ko' ? '활성' : 'Active'}
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.errors}</p>
              <p className="text-xs text-muted-foreground">
                {locale === 'ko' ? '오류' : 'Errors'}
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-500/10">
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold">{stats.lastDeployText}</p>
              <p className="text-xs text-muted-foreground">
                {locale === 'ko' ? '마지막 배포' : 'Last Deploy'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error.message}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && deployments?.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <Monitor className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-semibold">
            {t(locale, 'mySites.empty')}
          </h3>
          <p className="text-muted-foreground text-sm">
            {t(locale, 'mySites.emptyDesc')}
          </p>
          <Button asChild>
            <Link href="/oneclick">
              <Rocket className="mr-2 h-4 w-4" />
              {t(locale, 'mySites.createFirst')}
            </Link>
          </Button>
        </div>
      )}

      {/* Sites grid */}
      {!isLoading && deployments && deployments.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deployments.map((deploy) => (
            <DeploySiteCard key={deploy.id} deploy={deploy} />
          ))}
        </div>
      )}
    </div>
  );
}
