'use client';

import { useState, Fragment } from 'react';
import { Cable, Wand2, Trash2, Plus, RefreshCw, Clock } from 'lucide-react';
import { ImpactAnalysisPanel } from '@/components/project/impact-analysis-panel';
import { ConnectionHistoryRow } from '@/components/project/connection-history-row';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useProjectConnections,
  useCreateConnection,
  useUpdateConnection,
  useDeleteConnection,
  useAutoConnectSuggestions,
  useAutoConnect,
  useVerifyConnection,
} from '@/lib/queries/connections';
import { useProjectServices } from '@/lib/queries/services';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { UserConnectionType, ConnectionStatus, ConnectionEnvironment } from '@/types';

const TYPE_KEYS: Record<UserConnectionType, string> = {
  uses: 'connections.typeUses',
  integrates: 'connections.typeIntegrates',
  data_transfer: 'connections.typeDataTransfer',
  api_call: 'connections.typeApiCall',
  auth_provider: 'connections.typeAuthProvider',
  webhook: 'connections.typeWebhook',
  sdk: 'connections.typeSdk',
};

const STATUS_KEYS: Record<ConnectionStatus, string> = {
  active: 'connections.statusActive',
  inactive: 'connections.statusInactive',
  error: 'connections.statusError',
  pending: 'connections.statusPending',
};

const STATUS_BADGE: Record<ConnectionStatus, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const ENVIRONMENTS: { value: ConnectionEnvironment | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'development', label: '개발' },
  { value: 'staging', label: '스테이징' },
  { value: 'production', label: '프로덕션' },
];

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

  const { data: connections, isLoading } = useProjectConnections(projectId, envFilter === 'all' ? undefined : envFilter);
  const { data: services } = useProjectServices(projectId);
  const { data: suggestions } = useAutoConnectSuggestions(projectId);
  const createMutation = useCreateConnection(projectId);
  const updateMutation = useUpdateConnection(projectId);
  const deleteMutation = useDeleteConnection(projectId);
  const autoConnectMutation = useAutoConnect(projectId);
  const verifyMutation = useVerifyConnection(projectId);

  const serviceMap = new Map<string, string>();
  if (services) {
    for (const ps of services) {
      if (ps.service) {
        serviceMap.set(ps.service.id, ps.service.name);
      }
    }
  }

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
    createMutation.mutate(
      {
        project_id: projectId,
        source_service_id: newSource,
        target_service_id: newTarget,
        connection_type: newType,
        environment: newEnv,
      },
      { onSuccess: () => setShowCreate(false) }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Cable className="h-5 w-5" />
            {t(locale, 'connections.title')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t(locale, 'connections.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          {suggestions && suggestions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoConnect}
              disabled={autoConnectMutation.isPending}
            >
              <Wand2 className="mr-1.5 h-4 w-4" />
              {t(locale, 'connections.autoConnect')} ({suggestions.length}{t(locale, 'connections.suggestions')})
            </Button>
          )}
          <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
            <Plus className="mr-1.5 h-4 w-4" />
            {t(locale, 'connections.addConnection')}
          </Button>
        </div>
      </div>

      {/* 환경 필터 탭 */}
      <div className="flex gap-1 border-b">
        {ENVIRONMENTS.map((env) => (
          <button
            key={env.value}
            onClick={() => setEnvFilter(env.value)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              envFilter === env.value
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {env.label}
          </button>
        ))}
      </div>

      {showCreate && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[160px]">
                <label className="text-xs text-muted-foreground mb-1 block">{t(locale, 'connections.sourceService')}</label>
                <Select value={newSource} onValueChange={setNewSource}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder={t(locale, 'connections.select')} />
                  </SelectTrigger>
                  <SelectContent>
                    {[...serviceMap.entries()].map(([id, name]) => (
                      <SelectItem key={id} value={id} className="text-sm">{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="text-xs text-muted-foreground mb-1 block">{t(locale, 'connections.targetService')}</label>
                <Select value={newTarget} onValueChange={setNewTarget}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder={t(locale, 'connections.select')} />
                  </SelectTrigger>
                  <SelectContent>
                    {[...serviceMap.entries()].map(([id, name]) => (
                      <SelectItem key={id} value={id} className="text-sm">{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-[140px]">
                <label className="text-xs text-muted-foreground mb-1 block">{t(locale, 'connections.type')}</label>
                <Select value={newType} onValueChange={(v) => setNewType(v as UserConnectionType)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(TYPE_KEYS) as [UserConnectionType, string][]).map(([k, key]) => (
                      <SelectItem key={k} value={k} className="text-sm">{t(locale, key)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-[120px]">
                <label className="text-xs text-muted-foreground mb-1 block">환경</label>
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
              <Button onClick={handleCreate} disabled={createMutation.isPending || !newSource || !newTarget}>
                {t(locale, 'connections.create')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {suggestions && suggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-purple-500" />
              {t(locale, 'connections.autoConnectSuggestions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1.5 px-2 rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{serviceMap.get(s.source_service_id) ?? '?'}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">{serviceMap.get(s.target_service_id) ?? '?'}</span>
                    <span className="text-xs text-muted-foreground">({t(locale, TYPE_KEYS[s.connection_type] ?? '')})</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{s.reason}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            {t(locale, 'connections.connectionList')} ({connections?.length ?? 0}{t(locale, 'connections.count')})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-2.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-4 w-32 flex-1" />
                  <Skeleton className="h-7 w-14 rounded" />
                </div>
              ))}
            </div>
          ) : !connections || connections.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {t(locale, 'connections.empty')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t(locale, 'connections.source')}</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t(locale, 'connections.target')}</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t(locale, 'connections.type')}</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t(locale, 'connections.status')}</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t(locale, 'connections.description')}</th>
                    <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">{t(locale, 'connections.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {connections.map((conn) => (
                    <Fragment key={conn.id}>
                      <tr className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5 font-medium">
                          {serviceMap.get(conn.source_service_id) ?? conn.source_service_id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-2.5 font-medium">
                          {serviceMap.get(conn.target_service_id) ?? conn.target_service_id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-2.5">
                          <Select
                            value={conn.connection_type}
                            onValueChange={(v) => updateMutation.mutate({ id: conn.id, connection_type: v as UserConnectionType })}
                          >
                            <SelectTrigger className="h-7 w-[120px] text-xs border-none bg-transparent p-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(Object.entries(TYPE_KEYS) as [UserConnectionType, string][]).map(([k, key]) => (
                                <SelectItem key={k} value={k} className="text-xs">{t(locale, key)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-col gap-0.5">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE[conn.connection_status] ?? STATUS_BADGE.active}`}>
                              {t(locale, STATUS_KEYS[conn.connection_status] ?? 'connections.statusActive')}
                            </span>
                            {conn.last_verified_at && (
                              <span className="text-[10px] text-muted-foreground pl-0.5">
                                {formatVerifiedAt(conn.last_verified_at)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs max-w-[200px] truncate">
                          {conn.description ?? conn.label ?? '-'}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-7 w-7 p-0 hover:text-brand-blue ${expandedHistoryId === conn.id ? 'text-brand-blue' : 'text-muted-foreground'}`}
                              title="변경 이력 보기"
                              onClick={() => setExpandedHistoryId(expandedHistoryId === conn.id ? null : conn.id)}
                            >
                              <Clock className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-brand-blue"
                              title="헬스체크 기반 상태 검증"
                              disabled={verifyMutation.isPending && verifyMutation.variables === conn.id}
                              onClick={() => handleVerify(conn.id)}
                            >
                              <RefreshCw className={`h-3.5 w-3.5 ${verifyMutation.isPending && verifyMutation.variables === conn.id ? 'animate-spin' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => deleteMutation.mutate(conn.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {expandedHistoryId === conn.id && (
                        <ConnectionHistoryRow connectionId={conn.id} colSpan={6} />
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 영향 분석 패널 */}
      {services && services.length > 0 && (
        <ImpactAnalysisPanel
          projectId={projectId}
          serviceOptions={[...serviceMap.entries()].map(([id, name]) => ({ id, name }))}
        />
      )}
    </div>
  );
}
