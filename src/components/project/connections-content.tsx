'use client';

import { useState, Fragment, useMemo, useCallback } from 'react';
import {
  Cable, Wand2, Trash2, Plus, RefreshCw, Clock, ArrowRight,
  ChevronUp, Filter, Zap, Shield, Database,
  Globe, AlertTriangle, CheckCircle2, XCircle, Pause,
} from 'lucide-react';
import { ImpactAnalysisPanel } from '@/components/project/impact-analysis-panel';
import { ConnectionHistoryRow } from '@/components/project/connection-history-row';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import { ServiceIcon } from '@/components/ui/service-icon';
import { cn } from '@/lib/utils';
import {
  useProjectConnections,
  useCreateConnection,
  useUpdateConnection,
  useDeleteConnection,
  useAutoConnectSuggestions,
  useAutoConnect,
  useVerifyConnection,
} from '@/lib/queries/connections';
import { useProjectServices, useCatalogServices } from '@/lib/queries/services';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { UserConnectionType, ConnectionStatus, ConnectionEnvironment } from '@/types';

/* ─── 연결 타입 설정 ─── */
const CONNECTION_TYPE_CONFIG: Record<UserConnectionType, {
  label: string;
  color: string;
  icon: typeof Database;
  desc: string;
}> = {
  uses:          { label: '사용',       color: '#3b82f6', icon: Database,   desc: '서비스 사용' },
  api_call:      { label: 'API 호출',   color: '#8b5cf6', icon: Zap,        desc: 'API 호출' },
  data_transfer: { label: '데이터 전달', color: '#f97316', icon: ArrowRight, desc: '데이터 전송' },
  integrates:    { label: '연동',       color: '#22c55e', icon: Cable,      desc: '양방향 통합' },
  auth_provider: { label: '인증 제공',   color: '#ec4899', icon: Shield,     desc: '인증 제공' },
  webhook:       { label: '웹훅',       color: '#14b8a6', icon: Globe,      desc: '웹훅 이벤트' },
  sdk:           { label: 'SDK',        color: '#6366f1', icon: Database,   desc: 'SDK 연동' },
};

const STATUS_CONFIG: Record<ConnectionStatus, {
  label: string;
  color: string;
  icon: typeof CheckCircle2;
  badge: string;
}> = {
  active:   { label: '활성',   color: '#22c55e', icon: CheckCircle2, badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  inactive: { label: '비활성', color: '#64748b', icon: Pause,        badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  error:    { label: '오류',   color: '#ef4444', icon: XCircle,      badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  pending:  { label: '대기',   color: '#f59e0b', icon: AlertTriangle, badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
};

const ENVIRONMENTS: { value: ConnectionEnvironment | 'all'; label: string }[] = [
  { value: 'all',         label: '전체' },
  { value: 'development', label: '개발' },
  { value: 'staging',     label: '스테이징' },
  { value: 'production',  label: '프로덕션' },
];

const STATUS_KEYS: Record<ConnectionStatus, string> = {
  active: 'connections.statusActive',
  inactive: 'connections.statusInactive',
  error: 'connections.statusError',
  pending: 'connections.statusPending',
};

function formatVerifiedAt(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - d.getTime()) / 60_000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;
  return `${Math.floor(diffHr / 24)}일 전`;
}

interface ConnectionsContentProps {
  projectId: string;
}

export function ConnectionsContent({ projectId }: ConnectionsContentProps) {
  const { locale } = useLocaleStore();

  const [envFilter, setEnvFilter] = useState<ConnectionEnvironment | 'all'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [newSource, setNewSource] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newType, setNewType] = useState<UserConnectionType>('uses');
  const [newEnv, setNewEnv] = useState<ConnectionEnvironment>('all');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const { data: connections, isLoading } = useProjectConnections(projectId, envFilter === 'all' ? undefined : envFilter);
  const { data: services } = useProjectServices(projectId);
  const { data: catalogServices } = useCatalogServices();
  const { data: suggestions } = useAutoConnectSuggestions(projectId);
  const createMutation = useCreateConnection(projectId);
  const updateMutation = useUpdateConnection(projectId);
  const deleteMutation = useDeleteConnection(projectId);
  const autoConnectMutation = useAutoConnect(projectId);
  const verifyMutation = useVerifyConnection(projectId);

  // 서비스 이름 맵: projectServices 우선, catalogServices fallback
  const serviceMap = useMemo(() => {
    const map = new Map<string, string>();
    // catalogServices를 먼저 넣고
    if (catalogServices) {
      for (const svc of catalogServices) {
        map.set(svc.id, svc.name);
      }
    }
    // projectServices로 덮어쓰기 (더 정확한 정보)
    if (services) {
      for (const ps of services) {
        if (ps.service) map.set(ps.service.id, ps.service.name);
      }
    }
    return map;
  }, [services, catalogServices]);

  // 서비스 slug 맵 (아이콘 표시용)
  const serviceSlugMap = useMemo(() => {
    const map = new Map<string, string>();
    if (catalogServices) {
      for (const svc of catalogServices) {
        map.set(svc.id, svc.slug);
      }
    }
    if (services) {
      for (const ps of services) {
        if (ps.service) map.set(ps.service.id, ps.service.slug);
      }
    }
    return map;
  }, [services, catalogServices]);

  // 인스턴스 기반 서비스 옵션 (연결 생성 셀렉트용)
  // ps.id → { service_id, displayName, slug }
  const instanceOptions = useMemo(() => {
    if (!services) return [];
    // service_id별 인스턴스 수 계산
    const countMap = new Map<string, number>();
    services.forEach((ps) => countMap.set(ps.service_id, (countMap.get(ps.service_id) || 0) + 1));

    return services.map((ps) => {
      const baseName = ps.service?.name || '알 수 없는 서비스';
      const hasMultiple = (countMap.get(ps.service_id) || 0) > 1;
      const displayName = hasMultiple && ps.instance_label
        ? `${baseName} (${ps.instance_label})`
        : hasMultiple
          ? `${baseName} #${services.filter(s => s.service_id === ps.service_id).indexOf(ps) + 1}`
          : baseName;
      return {
        psId: ps.id,
        serviceId: ps.service_id,
        displayName,
        slug: ps.service?.slug || '',
      };
    });
  }, [services]);

  const getServiceName = useCallback((id: string) => serviceMap.get(id) ?? '알 수 없는 서비스', [serviceMap]);

  // Status summary counts
  const statusCounts = useMemo(() => {
    const counts = { active: 0, inactive: 0, error: 0, pending: 0, total: 0 };
    if (connections) {
      counts.total = connections.length;
      for (const c of connections) {
        const s = c.connection_status as ConnectionStatus;
        if (s in counts) counts[s]++;
      }
    }
    return counts;
  }, [connections]);

  const handleAutoConnect = () => {
    if (!suggestions || suggestions.length === 0) return;
    autoConnectMutation.mutate(
      suggestions.map((s) => ({
        source_service_id: s.source_service_id,
        target_service_id: s.target_service_id,
        connection_type: s.connection_type,
      }))
    );
  };

  const handleCreate = () => {
    if (!newSource || !newTarget || newSource === newTarget) return;
    // newSource/newTarget은 ps.id (인스턴스 ID)
    const srcOpt = instanceOptions.find((o) => o.psId === newSource);
    const tgtOpt = instanceOptions.find((o) => o.psId === newTarget);
    createMutation.mutate(
      {
        project_id: projectId,
        source_service_id: srcOpt?.serviceId || newSource,
        target_service_id: tgtOpt?.serviceId || newTarget,
        source_ps_id: newSource,
        target_ps_id: newTarget,
        connection_type: newType,
        environment: newEnv,
      },
      {
        onSuccess: () => {
          setShowCreate(false);
          setNewSource('');
          setNewTarget('');
          setNewType('uses');
          setNewEnv('all');
          toast.success('연결이 생성되었습니다');
        },
      }
    );
  };

  const handleVerify = (connectionId: string) => {
    verifyMutation.mutate(connectionId, {
      onSuccess: (data) => {
        toast.success(`연결 상태 검증 완료: ${t(locale, STATUS_KEYS[data.connection_status] ?? 'connections.statusActive')}`);
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : '검증에 실패했습니다');
      },
    });
  };

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteMutation.mutate(pendingDeleteId, {
      onSuccess: () => {
        setPendingDeleteId(null);
        toast.success('연결이 삭제되었습니다');
      },
      onError: () => {
        toast.error('삭제에 실패했습니다');
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* ─── 헤더 ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Cable className="h-5 w-5 text-brand-blue" />
            연결 관리
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            서비스 간 연결 상태를 관리하고 모니터링합니다
          </p>
        </div>
        <div className="flex gap-2">
          {suggestions && suggestions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoConnect}
              disabled={autoConnectMutation.isPending}
              className="gap-1.5"
            >
              <Wand2 className="h-4 w-4 text-violet-500" />
              자동 연결
              <Badge variant="secondary" className="text-[10px] ml-0.5">{suggestions.length}</Badge>
            </Button>
          )}
          <Button size="sm" onClick={() => setShowCreate(!showCreate)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            연결 추가
          </Button>
        </div>
      </div>

      {/* ─── 상태 요약 카드 ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(STATUS_CONFIG) as [ConnectionStatus, typeof STATUS_CONFIG[ConnectionStatus]][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const count = statusCounts[key];
          return (
            <div
              key={key}
              className="rounded-xl border bg-card p-3.5 flex items-center gap-3 transition-colors hover:bg-accent/30"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${cfg.color}15` }}
              >
                <Icon className="h-4.5 w-4.5" style={{ color: cfg.color }} />
              </div>
              <div>
                <div className="text-xl font-bold leading-tight">{count}</div>
                <div className="text-[11px] text-muted-foreground">{cfg.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── 환경 필터 ─── */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-1.5">
          {ENVIRONMENTS.map((env) => (
            <button
              key={env.value}
              type="button"
              onClick={() => setEnvFilter(env.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                envFilter === env.value
                  ? 'border-brand-blue bg-brand-blue/5 text-brand-blue shadow-sm'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              {env.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 연결 추가 폼 ─── */}
      {showCreate && (
        <Card className="border-brand-blue/30 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-4 w-4 text-brand-blue" />
              <span className="text-sm font-semibold">새 연결 추가</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">소스 서비스</label>
                <Select value={newSource} onValueChange={setNewSource}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="선택..." />
                  </SelectTrigger>
                  <SelectContent>
                    {instanceOptions.map((opt) => (
                      <SelectItem key={opt.psId} value={opt.psId} className="text-sm">
                        <span className="flex items-center gap-2">
                          {opt.slug && <ServiceIcon serviceId={opt.slug} size={14} />}
                          {opt.displayName}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">타겟 서비스</label>
                <Select value={newTarget} onValueChange={setNewTarget}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="선택..." />
                  </SelectTrigger>
                  <SelectContent>
                    {instanceOptions.map((opt) => (
                      <SelectItem key={opt.psId} value={opt.psId} className="text-sm">
                        <span className="flex items-center gap-2">
                          {opt.slug && <ServiceIcon serviceId={opt.slug} size={14} />}
                          {opt.displayName}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">연결 타입</label>
                <Select value={newType} onValueChange={(v) => setNewType(v as UserConnectionType)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(CONNECTION_TYPE_CONFIG) as [UserConnectionType, typeof CONNECTION_TYPE_CONFIG[UserConnectionType]][]).map(([k, cfg]) => (
                      <SelectItem key={k} value={k} className="text-sm">
                        <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: cfg.color }} />
                        {cfg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">환경</label>
                <Select value={newEnv} onValueChange={(v) => setNewEnv(v as ConnectionEnvironment)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENVIRONMENTS.map((env) => (
                      <SelectItem key={env.value} value={env.value} className="text-sm">{env.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleCreate} disabled={createMutation.isPending || !newSource || !newTarget || newSource === newTarget} className="flex-1 h-9">
                  연결 생성
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => setShowCreate(false)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {newSource && newTarget && newSource === newTarget && (
              <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                소스와 타겟이 같은 서비스일 수 없습니다
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ─── 자동 연결 제안 ─── */}
      {suggestions && suggestions.length > 0 && (
        <Card className="border-violet-200 dark:border-violet-800/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-violet-500" />
              자동 연결 제안
              <Badge variant="secondary" className="text-[10px]">{suggestions.length}건</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-1.5">
              {suggestions.map((s, i) => {
                const typeConfig = CONNECTION_TYPE_CONFIG[s.connection_type] || CONNECTION_TYPE_CONFIG.uses;
                return (
                  <div key={i} className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                    <div className="flex items-center gap-2">
                      {serviceSlugMap.has(s.source_service_id) && <ServiceIcon serviceId={serviceSlugMap.get(s.source_service_id)!} size={16} />}
                      <span className="font-medium">{getServiceName(s.source_service_id)}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      {serviceSlugMap.has(s.target_service_id) && <ServiceIcon serviceId={serviceSlugMap.get(s.target_service_id)!} size={16} />}
                      <span className="font-medium">{getServiceName(s.target_service_id)}</span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: `${typeConfig.color}15`, color: typeConfig.color }}
                      >
                        {typeConfig.label}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground max-w-[200px] truncate hidden sm:inline">{s.reason}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── 연결 목록 ─── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            연결 목록 ({statusCounts.total}건)
          </h3>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : !connections || connections.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Cable className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                연결된 서비스가 없습니다
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                &quot;연결 추가&quot; 버튼으로 서비스 간 연결을 만들어보세요
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {connections.map((conn) => {
              const typeConfig = CONNECTION_TYPE_CONFIG[conn.connection_type] || CONNECTION_TYPE_CONFIG.uses;
              const statusConfig = STATUS_CONFIG[conn.connection_status] || STATUS_CONFIG.active;
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedHistoryId === conn.id;
              const sourceName = getServiceName(conn.source_service_id);
              const targetName = getServiceName(conn.target_service_id);
              const sourceSlug = serviceSlugMap.get(conn.source_service_id);
              const targetSlug = serviceSlugMap.get(conn.target_service_id);

              return (
                <Fragment key={conn.id}>
                  <Card className={cn(
                    'transition-all hover:shadow-sm',
                    conn.connection_status === 'error' && 'border-red-200 dark:border-red-900/40',
                  )}>
                    <CardContent className="p-4">
                      {/* 모바일: 세로 스택 / 데스크탑: 가로 배치 */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        {/* 소스 → 타겟 */}
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${typeConfig.color}12` }}
                          >
                            <typeConfig.icon className="h-4 w-4" style={{ color: typeConfig.color }} />
                          </div>
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {sourceSlug && <ServiceIcon serviceId={sourceSlug} size={16} />}
                              <span className="font-semibold text-sm truncate">{sourceName}</span>
                            </div>
                            <svg width="20" height="10" viewBox="0 0 20 10" className="flex-shrink-0" style={{ color: typeConfig.color }}>
                              <line x1="0" y1="5" x2="15" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <polygon points="14,2 20,5 14,8" fill="currentColor" />
                            </svg>
                            <div className="flex items-center gap-1.5 min-w-0">
                              {targetSlug && <ServiceIcon serviceId={targetSlug} size={16} />}
                              <span className="font-semibold text-sm truncate">{targetName}</span>
                            </div>
                          </div>
                        </div>

                        {/* 뱃지 영역 */}
                        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
                          {/* 타입 뱃지 */}
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap"
                            style={{ backgroundColor: `${typeConfig.color}10`, color: typeConfig.color }}
                          >
                            {typeConfig.label}
                          </span>
                          {conn.description && (
                            <span className="text-xs text-muted-foreground truncate max-w-[160px] hidden lg:inline">
                              {conn.description}
                            </span>
                          )}
                        </div>

                        {/* 상태 뱃지 */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap',
                            statusConfig.badge,
                          )}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </span>
                          {conn.last_verified_at && (
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {formatVerifiedAt(conn.last_verified_at)}
                            </span>
                          )}
                        </div>

                        {/* 타입 변경 셀렉트 */}
                        <Select
                          value={conn.connection_type}
                          onValueChange={(v) => updateMutation.mutate({ id: conn.id, connection_type: v as UserConnectionType })}
                        >
                          <SelectTrigger className="h-8 w-[110px] text-xs border-dashed flex-shrink-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.entries(CONNECTION_TYPE_CONFIG) as [UserConnectionType, typeof CONNECTION_TYPE_CONFIG[UserConnectionType]][]).map(([k, cfg]) => (
                              <SelectItem key={k} value={k} className="text-xs">
                                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: cfg.color }} />
                                {cfg.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* 액션 버튼 */}
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    'h-8 w-8 p-0',
                                    isExpanded ? 'text-brand-blue' : 'text-muted-foreground hover:text-brand-blue',
                                  )}
                                  onClick={() => setExpandedHistoryId(isExpanded ? null : conn.id)}
                                >
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>변경 이력</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-brand-blue"
                                  disabled={verifyMutation.isPending && verifyMutation.variables === conn.id}
                                  onClick={() => handleVerify(conn.id)}
                                >
                                  <RefreshCw className={cn('h-4 w-4', verifyMutation.isPending && verifyMutation.variables === conn.id && 'animate-spin')} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>상태 검증</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                  onClick={() => setPendingDeleteId(conn.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>삭제</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardContent>

                    {/* 이력 확장 영역 */}
                    {isExpanded && (
                      <div className="border-t bg-muted/20">
                        <table className="w-full"><tbody>
                          <ConnectionHistoryRow connectionId={conn.id} colSpan={1} />
                        </tbody></table>
                      </div>
                    )}
                  </Card>
                </Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 영향 분석 패널 ─── */}
      {services && services.length > 0 && (
        <ImpactAnalysisPanel
          projectId={projectId}
          serviceOptions={[...serviceMap.entries()].map(([id, name]) => ({ id, name }))}
        />
      )}

      {/* ─── 삭제 확인 다이얼로그 ─── */}
      <AlertDialog open={!!pendingDeleteId} onOpenChange={(open) => { if (!open) setPendingDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>연결 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeleteId && connections ? (() => {
                const conn = connections.find((c) => c.id === pendingDeleteId);
                if (!conn) return '이 연결을 삭제하시겠습니까?';
                return `${getServiceName(conn.source_service_id)} → ${getServiceName(conn.target_service_id)} 연결을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`;
              })() : '이 연결을 삭제하시겠습니까?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleteMutation.isPending}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
