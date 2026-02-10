'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProjectServices } from '@/lib/queries/services';
import { useEnvVars } from '@/lib/queries/env-vars';
import { useRunHealthCheck } from '@/lib/queries/health-checks';
import { useProjectStore } from '@/stores/project-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Map, List, Key, ArrowRight, Activity, Loader2, CheckCircle2, XCircle, HelpCircle, Lightbulb } from 'lucide-react';
import { services as catalogServices } from '@/data/services';
import type { HealthCheck, HealthCheckStatus } from '@/types';

export default function ProjectOverviewPage() {
  const params = useParams();
  const projectId = params.id as string;
  const setActiveProjectId = useProjectStore((s) => s.setActiveProjectId);

  useEffect(() => {
    setActiveProjectId(projectId);
    return () => setActiveProjectId(null);
  }, [projectId, setActiveProjectId]);

  const { data: services = [], isLoading: svcLoading } = useProjectServices(projectId);
  const { data: envVars = [], isLoading: envLoading } = useEnvVars(projectId);
  const runHealthCheck = useRunHealthCheck();

  const [healthResults, setHealthResults] = useState<Record<string, HealthCheck>>({});
  const [checkingServiceId, setCheckingServiceId] = useState<string | null>(null);
  const [runAllProgress, setRunAllProgress] = useState<{ running: boolean; current: number; total: number }>({
    running: false, current: 0, total: 0,
  });

  const loading = svcLoading || envLoading;

  const connectedCount = services.filter((s) => s.status === 'connected').length;
  const progressPercent = services.length > 0
    ? Math.round((connectedCount / services.length) * 100)
    : 0;

  // Health summary from latest checks
  const healthyCount = Object.values(healthResults).filter((r) => r.status === 'healthy').length;
  const errorCount = Object.values(healthResults).filter((r) => r.status === 'unhealthy').length;
  const uncheckedCount = services.length - Object.keys(healthResults).length;

  // Smart service suggestions: match env var keys to catalog services
  const smartSuggestions = useMemo(() => {
    const connectedServiceIds = new Set(services.map((s) => s.service_id));
    const envKeyNames = new Set(envVars.map((v) => v.key_name));
    const suggestions: { serviceName: string; matchedKey: string }[] = [];

    for (const catalogSvc of catalogServices) {
      if (connectedServiceIds.has(catalogSvc.id)) continue;
      for (const envTemplate of catalogSvc.required_env_vars || []) {
        if (envKeyNames.has(envTemplate.name)) {
          suggestions.push({
            serviceName: catalogSvc.name,
            matchedKey: envTemplate.name,
          });
          break; // one suggestion per service
        }
      }
    }
    return suggestions.slice(0, 3); // max 3 suggestions
  }, [services, envVars]);

  const handleRunAll = async () => {
    setRunAllProgress({ running: true, current: 0, total: services.length });
    for (let i = 0; i < services.length; i++) {
      setRunAllProgress({ running: true, current: i + 1, total: services.length });
      setCheckingServiceId(services[i].id);
      try {
        const result = await runHealthCheck.mutateAsync({ project_service_id: services[i].id });
        setHealthResults((prev) => ({ ...prev, [services[i].id]: result }));
      } catch {
        // continue
      }
    }
    setCheckingServiceId(null);
    setRunAllProgress({ running: false, current: 0, total: 0 });
  };

  const statusLabels: Record<string, string> = {
    not_started: '시작 전',
    in_progress: '진행 중',
    connected: '연결됨',
    error: '오류',
  };

  const statusColors: Record<string, string> = {
    not_started: 'secondary',
    in_progress: 'default',
    connected: 'default',
    error: 'destructive',
  };

  const healthStatusDot: Record<HealthCheckStatus, string> = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    unhealthy: 'bg-red-500',
    unknown: 'bg-gray-400',
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">연결된 서비스</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{connectedCount}/{services.length}</div>
            {services.length > 0 && (
              <Progress value={progressPercent} className="mt-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">환경변수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{envVars.length}</div>
            <p className="text-xs text-muted-foreground mt-1">개의 변수가 저장됨</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">진행률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{progressPercent}%</div>
            <p className="text-xs text-muted-foreground mt-1">서비스 연결 완료</p>
          </CardContent>
        </Card>
      </div>

      {/* Health Status Summary */}
      {services.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                서비스 건강 상태
              </CardTitle>
              <div className="flex items-center gap-2">
                {Object.keys(healthResults).length > 0 && (
                  <div className="flex items-center gap-3 text-xs mr-2">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> {healthyCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5 text-red-600" /> {errorCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5 text-gray-500" /> {uncheckedCount}
                    </span>
                  </div>
                )}
                <Button size="sm" onClick={handleRunAll} disabled={runAllProgress.running}>
                  {runAllProgress.running ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      {runAllProgress.current}/{runAllProgress.total}
                    </>
                  ) : (
                    <>
                      <Activity className="mr-1.5 h-3.5 w-3.5" />
                      전체 검증
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {services.map((ps) => {
                const check = healthResults[ps.id];
                const isChecking = checkingServiceId === ps.id && runHealthCheck.isPending;
                const dotClass = check
                  ? healthStatusDot[check.status as HealthCheckStatus]
                  : 'bg-gray-300';

                return (
                  <div key={ps.id} className="flex items-center gap-3 p-2.5 rounded-lg border">
                    {isChecking ? (
                      <Loader2 className="h-3 w-3 animate-spin shrink-0 text-muted-foreground" />
                    ) : (
                      <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass} ${check?.status === 'healthy' ? 'animate-pulse' : ''}`} />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{ps.service?.name}</p>
                      {check && (
                        <p className="text-xs text-muted-foreground">
                          {check.response_time_ms != null && `${check.response_time_ms}ms`}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto py-4 flex-col items-start" asChild>
          <Link href={`/project/${projectId}/service-map`}>
            <Map className="h-5 w-5 mb-2" />
            <span className="font-medium">서비스 맵 보기</span>
            <span className="text-xs text-muted-foreground">아키텍처 시각화</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col items-start" asChild>
          <Link href={`/project/${projectId}/services`}>
            <List className="h-5 w-5 mb-2" />
            <span className="font-medium">서비스 관리</span>
            <span className="text-xs text-muted-foreground">서비스 추가/연결</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col items-start" asChild>
          <Link href={`/project/${projectId}/env`}>
            <Key className="h-5 w-5 mb-2" />
            <span className="font-medium">환경변수 관리</span>
            <span className="text-xs text-muted-foreground">.env 다운로드</span>
          </Link>
        </Button>
      </div>

      {/* Smart Service Suggestions */}
      {smartSuggestions.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              서비스 연결 제안
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {smartSuggestions.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-background">
                  <div>
                    <span className="font-medium">{s.serviceName}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <code className="bg-muted px-1 rounded">{s.matchedKey}</code> 키가 있지만 서비스가 연결되지 않았습니다
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/project/${projectId}/services`}>
                      연결
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {services.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>연결된 서비스</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/project/${projectId}/services`}>
                  모두 보기
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((ps) => (
                <div key={ps.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-medium">
                      {ps.service?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{ps.service?.name}</p>
                      <p className="text-xs text-muted-foreground">{ps.service?.category}</p>
                    </div>
                  </div>
                  <Badge variant={statusColors[ps.status] as 'default' | 'secondary' | 'destructive'}>
                    {statusLabels[ps.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
