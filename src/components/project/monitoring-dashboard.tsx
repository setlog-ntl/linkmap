'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useProjectServices } from '@/lib/queries/services';
import {
  useHealthChecks,
  useLatestHealthChecks,
  useRunHealthCheck,
} from '@/lib/queries/health-checks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Activity,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import type { HealthCheckStatus, HealthCheck } from '@/types';

interface MonitoringDashboardProps {
  projectId: string;
}

/* ──────────────────────── 응답시간 차트 (확장) ──────────────────────── */

function ResponseTimeChart({
  data,
  height = 120,
  width = 500,
}: {
  data: { time: string; value: number; status: HealthCheckStatus }[];
  height?: number;
  width?: number;
}) {
  if (data.length < 2) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        데이터가 부족합니다 (최소 2건 필요)
      </p>
    );
  }

  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const padTop = 16;
  const padBottom = 24;
  const chartH = height - padTop - padBottom;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = padTop + chartH - ((d.value - min) / range) * chartH;
    return { x, y, ...d };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');

  // gradient fill
  const fillPath = `M${points[0].x},${padTop + chartH} ${points.map((p) => `L${p.x},${p.y}`).join(' ')} L${points[points.length - 1].x},${padTop + chartH} Z`;

  const statusColor = (s: HealthCheckStatus) => {
    switch (s) {
      case 'healthy':
        return '#22c55e';
      case 'degraded':
        return '#eab308';
      case 'unhealthy':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label={`응답시간 추이: ${data.length}건, 평균 ${Math.round(avg)}ms`}
      >
        <defs>
          <linearGradient id="rtGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* avg line */}
        <line
          x1={0}
          y1={padTop + chartH - ((avg - min) / range) * chartH}
          x2={width}
          y2={padTop + chartH - ((avg - min) / range) * chartH}
          stroke="#64748b"
          strokeWidth="0.5"
          strokeDasharray="4 4"
          opacity={0.5}
        />
        <text
          x={width - 4}
          y={padTop + chartH - ((avg - min) / range) * chartH - 4}
          textAnchor="end"
          className="fill-muted-foreground"
          fontSize={9}
        >
          평균 {Math.round(avg)}ms
        </text>

        {/* fill area */}
        <path d={fillPath} fill="url(#rtGradient)" />

        {/* line */}
        <polyline
          points={polyline}
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill={statusColor(p.status)}
            stroke="var(--background)"
            strokeWidth="1.5"
          />
        ))}

        {/* x-axis labels (first, middle, last) */}
        {[0, Math.floor(data.length / 2), data.length - 1].map((idx) => (
          <text
            key={idx}
            x={points[idx].x}
            y={height - 4}
            textAnchor={idx === 0 ? 'start' : idx === data.length - 1 ? 'end' : 'middle'}
            className="fill-muted-foreground"
            fontSize={9}
          >
            {formatShortTime(data[idx].time)}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ──────────────────────── 유틸 ──────────────────────── */

function formatShortTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diffMs / 60000);
  const hr = Math.floor(diffMs / 3600000);
  if (min < 1) return '방금 전';
  if (min < 60) return `${min}분 전`;
  if (hr < 24) return `${hr}시간 전`;
  return new Date(dateStr).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

/* ──────────────────────── 메인 컴포넌트 ──────────────────────── */

export function MonitoringDashboard({ projectId }: MonitoringDashboardProps) {
  const { data: services = [], isLoading } = useProjectServices(projectId);
  const { data: serverLatestChecks } = useLatestHealthChecks(projectId);
  const runHealthCheck = useRunHealthCheck();

  const [selectedPsId, setSelectedPsId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [envFilter, setEnvFilter] = useState<string>('development');
  const [runAllProgress, setRunAllProgress] = useState<{
    running: boolean;
    current: number;
    total: number;
  }>({ running: false, current: 0, total: 0 });

  const [localChecks, setLocalChecks] = useState<Record<string, HealthCheck>>({});

  useEffect(() => {
    if (serverLatestChecks) {
      setLocalChecks((prev) => ({ ...serverLatestChecks, ...prev }));
    }
  }, [serverLatestChecks]);

  const latestChecks = useMemo(
    () => ({ ...serverLatestChecks, ...localChecks }),
    [serverLatestChecks, localChecks],
  );

  const { data: selectedChecks = [] } = useHealthChecks(selectedPsId || '');

  // auto-select first service
  useEffect(() => {
    if (!selectedPsId && services.length > 0) {
      setSelectedPsId(services[0].id);
    }
  }, [services, selectedPsId]);

  const handleRunCheck = useCallback(
    async (psId: string) => {
      try {
        const result = await runHealthCheck.mutateAsync({
          project_service_id: psId,
          environment: envFilter,
        });
        setLocalChecks((prev) => ({ ...prev, [psId]: result }));
      } catch {
        // handled by mutation
      }
    },
    [runHealthCheck, envFilter],
  );

  const handleRunAll = useCallback(async () => {
    setRunAllProgress({ running: true, current: 0, total: services.length });
    for (let i = 0; i < services.length; i++) {
      setRunAllProgress({ running: true, current: i + 1, total: services.length });
      try {
        const result = await runHealthCheck.mutateAsync({
          project_service_id: services[i].id,
          environment: envFilter,
        });
        setLocalChecks((prev) => ({ ...prev, [services[i].id]: result }));
      } catch {
        // continue
      }
    }
    setRunAllProgress({ running: false, current: 0, total: 0 });
  }, [services, runHealthCheck, envFilter]);

  /* ── 통계 ── */
  const stats = useMemo(() => {
    let healthy = 0;
    let degraded = 0;
    let unhealthy = 0;
    let unknown = 0;
    let totalRt = 0;
    let rtCount = 0;

    for (const s of services) {
      const check = latestChecks[s.id];
      const st = check?.status ?? (s.status === 'connected' ? 'healthy' : s.status === 'error' ? 'unhealthy' : 'unknown');
      if (st === 'healthy') healthy++;
      else if (st === 'degraded') degraded++;
      else if (st === 'unhealthy') unhealthy++;
      else unknown++;

      if (check?.response_time_ms != null) {
        totalRt += check.response_time_ms;
        rtCount++;
      }
    }

    return {
      total: services.length,
      healthy,
      degraded,
      unhealthy,
      unknown,
      avgResponseTime: rtCount > 0 ? Math.round(totalRt / rtCount) : null,
      lastCheckedAt: Object.values(latestChecks).reduce<string | null>((latest, c) => {
        if (!latest) return c?.checked_at ?? null;
        return c?.checked_at && c.checked_at > latest ? c.checked_at : latest;
      }, null),
    };
  }, [services, latestChecks]);

  const filteredServices = useMemo(() => {
    if (statusFilter === 'all') return services;
    return services.filter((s) => {
      const check = latestChecks[s.id];
      if (statusFilter === 'healthy')
        return check?.status === 'healthy' || (!check && s.status === 'connected');
      if (statusFilter === 'degraded') return check?.status === 'degraded';
      if (statusFilter === 'unhealthy')
        return check?.status === 'unhealthy' || (!check && s.status === 'error');
      return true;
    });
  }, [services, statusFilter, latestChecks]);

  const chartData = useMemo(() => {
    return selectedChecks
      .filter((c) => c.response_time_ms != null)
      .slice(0, 20)
      .reverse()
      .map((c) => ({
        time: c.checked_at,
        value: c.response_time_ms!,
        status: c.status,
      }));
  }, [selectedChecks]);

  const selectedService = services.find((s) => s.id === selectedPsId);
  const selectedLatest = selectedPsId ? latestChecks[selectedPsId] : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] rounded-xl lg:col-span-1" />
          <Skeleton className="h-[400px] rounded-xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── 상단: 요약 카드 4개 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryStatCard
          label="정상 작동"
          value={stats.healthy}
          total={stats.total}
          icon={CheckCircle2}
          color="green"
        />
        <SummaryStatCard
          label="성능 저하"
          value={stats.degraded}
          total={stats.total}
          icon={AlertTriangle}
          color="yellow"
        />
        <SummaryStatCard
          label="연결 오류"
          value={stats.unhealthy}
          total={stats.total}
          icon={XCircle}
          color="red"
        />
        <Card className="border-white/5 bg-card">
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">평균 응답시간</p>
              <div className="h-8 w-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                <Zap className="h-4 w-4 text-brand-blue" />
              </div>
            </div>
            <div className="text-2xl font-bold">
              {stats.avgResponseTime != null ? `${stats.avgResponseTime}ms` : '-'}
            </div>
            {stats.lastCheckedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                마지막 검증: {formatRelativeTime(stats.lastCheckedAt)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── 필터 바 ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Select value={envFilter} onValueChange={setEnvFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="production">Production</SelectItem>
            </SelectContent>
          </Select>
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
        </div>
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

      {/* ── 메인 영역: 서비스 목록 + 상세 ── */}
      {filteredServices.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState icon={Activity} title="연결된 서비스가 없습니다" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 서비스 목록 */}
          <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredServices.map((ps) => {
              const check = latestChecks[ps.id];
              const isSelected = selectedPsId === ps.id;
              return (
                <div
                  key={ps.id}
                  className={`cursor-pointer transition-all rounded-lg ${
                    isSelected ? 'ring-2 ring-primary/40 scale-[1.01]' : ''
                  }`}
                  onClick={() => setSelectedPsId(ps.id)}
                >
                  <HealthSummaryCard
                    serviceName={ps.service?.name || 'Unknown'}
                    serviceCategory={ps.service?.category}
                    status={(check?.status as HealthCheckStatus) || null}
                    lastCheckedAt={check?.checked_at}
                    responseTimeMs={check?.response_time_ms}
                    message={check?.message}
                    onRunCheck={() => handleRunCheck(ps.id)}
                    isRunning={
                      runHealthCheck.variables?.project_service_id === ps.id &&
                      runHealthCheck.isPending
                    }
                  />
                </div>
              );
            })}
          </div>

          {/* 우측: 선택된 서비스 상세 */}
          <div className="lg:col-span-2 space-y-4">
            {selectedPsId && selectedService ? (
              <>
                {/* 서비스 헤더 */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {selectedService.service?.name || 'Unknown'}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {selectedService.service?.category}
                          {selectedLatest?.checked_at && (
                            <> · 마지막 검증: {formatRelativeTime(selectedLatest.checked_at)}</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedLatest && (
                          <StatusBadge status={selectedLatest.status} />
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRunCheck(selectedPsId)}
                          disabled={runHealthCheck.isPending}
                        >
                          {runHealthCheck.isPending &&
                          runHealthCheck.variables?.project_service_id === selectedPsId ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Activity className="mr-2 h-4 w-4" />
                          )}
                          검증 실행
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* 응답 통계 요약 */}
                  {selectedChecks.length > 0 && (
                    <CardContent className="pt-0">
                      <ResponseStats checks={selectedChecks} />
                    </CardContent>
                  )}
                </Card>

                {/* 응답시간 차트 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      응답시간 추이
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponseTimeChart data={chartData} />
                  </CardContent>
                </Card>

                {/* 검증 이력 */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        검증 이력
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        최근 {Math.min(selectedChecks.length, 20)}건
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <HealthTimeline checks={selectedChecks.slice(0, 20)} />
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-16">
                  <EmptyState
                    icon={Activity}
                    title="서비스를 선택하세요"
                    description="좌측 목록에서 서비스를 클릭하면 상세 정보를 확인할 수 있습니다"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── 서브 컴포넌트 ──────────────────────── */

function SummaryStatCard({
  label,
  value,
  total,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  total: number;
  icon: typeof CheckCircle2;
  color: 'green' | 'yellow' | 'red';
}) {
  const colors = {
    green: {
      card: 'border-green-500/10',
      icon: 'bg-green-500/10 text-green-400',
      text: 'from-green-400 to-emerald-300',
    },
    yellow: {
      card: 'border-yellow-500/10',
      icon: 'bg-yellow-500/10 text-yellow-400',
      text: 'from-yellow-400 to-amber-300',
    },
    red: {
      card: 'border-red-500/10',
      icon: 'bg-red-500/10 text-red-400',
      text: 'from-red-400 to-rose-300',
    },
  };
  const c = colors[color];

  return (
    <Card className={`${c.card} bg-card`}>
      <CardContent className="py-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className={`h-8 w-8 rounded-lg ${c.icon} flex items-center justify-center`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${c.text}`}>
            {value}
          </span>
          <span className="text-sm text-muted-foreground">/ {total}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: HealthCheckStatus }) {
  const cfg: Record<HealthCheckStatus, { label: string; cls: string }> = {
    healthy: { label: '정상', cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
    degraded: { label: '저하', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    unhealthy: { label: '오류', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
    unknown: { label: '미확인', cls: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  };
  const c = cfg[status] || cfg.unknown;
  return (
    <Badge variant="outline" className={c.cls}>
      {c.label}
    </Badge>
  );
}

function ResponseStats({ checks }: { checks: HealthCheck[] }) {
  const withRt = checks.filter((c) => c.response_time_ms != null);
  if (withRt.length === 0) return null;

  const times = withRt.map((c) => c.response_time_ms!);
  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  const min = Math.min(...times);
  const max = Math.max(...times);
  const healthyCount = checks.filter((c) => c.status === 'healthy').length;
  const uptime = checks.length > 0 ? Math.round((healthyCount / checks.length) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <MiniStat label="평균 응답" value={`${avg}ms`} icon={<Zap className="h-3.5 w-3.5" />} />
      <MiniStat label="최소" value={`${min}ms`} icon={<TrendingDown className="h-3.5 w-3.5" />} />
      <MiniStat label="최대" value={`${max}ms`} icon={<TrendingUp className="h-3.5 w-3.5" />} />
      <MiniStat
        label="정상률"
        value={`${uptime}%`}
        icon={<CheckCircle2 className="h-3.5 w-3.5" />}
        highlight={uptime < 80}
      />
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-muted/30 px-3 py-2">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className={`text-sm font-semibold ${highlight ? 'text-red-400' : ''}`}>{value}</p>
      </div>
    </div>
  );
}
