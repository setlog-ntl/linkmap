'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key, RefreshCw, CloudCog, Clock, AlertTriangle } from 'lucide-react';
import type { EnvironmentVariable } from '@/types';

interface EnvStatsHeaderProps {
  projectId: string;
  envVars: EnvironmentVariable[];
  onSync?: () => void;
  isSyncing?: boolean;
}

export function EnvStatsHeader({ projectId, envVars, onSync, isSyncing }: EnvStatsHeaderProps) {
  const stats = useMemo(() => {
    const uniqueServices = new Set(
      envVars.filter((v) => v.service_id).map((v) => v.service_id)
    );
    const lastUpdated = envVars.length > 0
      ? new Date(Math.max(...envVars.map((v) => new Date(v.updated_at).getTime())))
      : null;

    return {
      total: envVars.length,
      syncedServices: uniqueServices.size,
      lastSync: lastUpdated,
    };
  }, [envVars]);

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}시간 전`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}일 전`;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">전체 변수</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <CloudCog className="h-5 w-5 text-blue-500" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold">{stats.syncedServices}</p>
            <p className="text-xs text-muted-foreground">연결된 서비스</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5 text-green-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">
              {stats.lastSync ? formatRelativeTime(stats.lastSync) : '-'}
            </p>
            <p className="text-xs text-muted-foreground">마지막 업데이트</p>
          </div>
          {onSync && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-auto shrink-0"
              onClick={onSync}
              disabled={isSyncing}
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="hover:border-primary/50 transition-colors">
        <Link href={`/project/${projectId}/env/conflicts`}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">충돌 검사</p>
              <p className="text-xs text-muted-foreground">환경 간 비교</p>
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
}
