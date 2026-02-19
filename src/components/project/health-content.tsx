'use client';

import { useState, useMemo, useEffect } from 'react';
import { useProjectServices } from '@/lib/queries/services';
import { useHealthChecks, useLatestHealthChecks, useRunHealthCheck } from '@/lib/queries/health-checks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HealthSummaryCard } from '@/components/project/health-summary-card';
import { HealthTimeline } from '@/components/project/health-timeline';
import { HealthSparkline } from '@/components/project/health-sparkline';
import { Activity, Loader2, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { HealthCheckStatus, HealthCheck } from '@/types';

interface HealthContentProps {
  projectId: string;
}

export function HealthContent({ projectId }: HealthContentProps) {
  const { locale } = useLocaleStore();
  const { data: services = [], isLoading } = useProjectServices(projectId);
  const { data: serverLatestChecks } = useLatestHealthChecks(projectId);
  const runHealthCheck = useRunHealthCheck();
  const [selectedPsId, setSelectedPsId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [runAllProgress, setRunAllProgress] = useState<{ running: boolean; current: number; total: number }>({
    running: false, current: 0, total: 0,
  });

  const [localChecks, setLocalChecks] = useState<Record<string, HealthCheck>>({});

  useEffect(() => {
    if (serverLatestChecks) {
      setLocalChecks((prev) => ({ ...serverLatestChecks, ...prev }));
    }
  }, [serverLatestChecks]);

  const latestChecks = useMemo(() => {
    return { ...serverLatestChecks, ...localChecks };
  }, [serverLatestChecks, localChecks]);

  const { data: selectedChecks = [] } = useHealthChecks(selectedPsId || '');

  const sparklineData = useMemo(() => {
    return selectedChecks
      .filter((c) => c.response_time_ms != null)
      .slice(0, 10)
      .reverse()
      .map((c) => c.response_time_ms!);
  }, [selectedChecks]);

  const handleRunCheck = async (psId: string) => {
    try {
      const result = await runHealthCheck.mutateAsync({ project_service_id: psId });
      setLocalChecks((prev) => ({ ...prev, [psId]: result }));
    } catch {
      // error handled by mutation
    }
  };

  const handleRunAll = async () => {
    setRunAllProgress({ running: true, current: 0, total: services.length });
    for (let i = 0; i < services.length; i++) {
      setRunAllProgress({ running: true, current: i + 1, total: services.length });
      try {
        const result = await runHealthCheck.mutateAsync({ project_service_id: services[i].id });
        setLocalChecks((prev) => ({ ...prev, [services[i].id]: result }));
      } catch {
        // continue with next service
      }
    }
    setRunAllProgress({ running: false, current: 0, total: 0 });
  };

  const healthySvcCount = services.filter((s) => {
    const check = latestChecks[s.id];
    return check?.status === 'healthy' || (!check && s.status === 'connected');
  }).length;

  const errorSvcCount = services.filter((s) => {
    const check = latestChecks[s.id];
    return check?.status === 'unhealthy' || (!check && s.status === 'error');
  }).length;

  const unknownSvcCount = services.length - healthySvcCount - errorSvcCount;

  const filteredServices = useMemo(() => {
    if (statusFilter === 'all') return services;
    return services.filter((s) => {
      const check = latestChecks[s.id];
      if (statusFilter === 'healthy') return check?.status === 'healthy' || (!check && s.status === 'connected');
      if (statusFilter === 'degraded') return check?.status === 'degraded';
      if (statusFilter === 'unhealthy') return check?.status === 'unhealthy' || (!check && s.status === 'error');
      return true;
    });
  }, [services, statusFilter, latestChecks]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">상태 모니터링</h2>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="healthy">정상</SelectItem>
              <SelectItem value="degraded">저하</SelectItem>
              <SelectItem value="unhealthy">오류</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRunAll} disabled={runAllProgress.running || services.length === 0}>
            {runAllProgress.running ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {runAllProgress.current}/{runAllProgress.total}
              </>
            ) : (
              <>
                <Activity className="mr-2 h-4 w-4" />
                전체 검증
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{healthySvcCount}</div>
              <p className="text-xs text-muted-foreground">정상</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <div className="text-2xl font-bold">{errorSvcCount}</div>
              <p className="text-xs text-muted-foreground">오류</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-gray-500" />
            <div>
              <div className="text-2xl font-bold">{unknownSvcCount}</div>
              <p className="text-xs text-muted-foreground">미확인</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredServices.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Activity}
              title={t(locale, 'project.emptyHealth')}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredServices.map((ps) => {
            const check = latestChecks[ps.id];
            const isSelected = selectedPsId === ps.id;
            return (
              <div key={ps.id}>
                <div
                  className={`cursor-pointer transition-colors rounded-lg ${isSelected ? 'ring-2 ring-primary/30' : ''}`}
                  onClick={() => setSelectedPsId(isSelected ? null : ps.id)}
                >
                  <HealthSummaryCard
                    serviceName={ps.service?.name || 'Unknown'}
                    serviceCategory={ps.service?.category}
                    status={(check?.status as HealthCheckStatus) || null}
                    lastCheckedAt={check?.checked_at}
                    responseTimeMs={check?.response_time_ms}
                    message={check?.message}
                    onRunCheck={() => handleRunCheck(ps.id)}
                    isRunning={runHealthCheck.variables?.project_service_id === ps.id && runHealthCheck.isPending}
                  />
                </div>

                {isSelected && (
                  <Card className="mt-2 sm:ml-4">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">검증 이력</CardTitle>
                        {sparklineData.length >= 2 && (
                          <HealthSparkline data={sparklineData} />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <HealthTimeline checks={selectedChecks.slice(0, 10)} />
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
