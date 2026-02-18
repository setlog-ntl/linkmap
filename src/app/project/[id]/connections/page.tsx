'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Cable, Wand2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useProjectConnections,
  useCreateConnection,
  useUpdateConnection,
  useDeleteConnection,
  useAutoConnectSuggestions,
  useAutoConnect,
} from '@/lib/queries/connections';
import { useProjectServices } from '@/lib/queries/services';
import type { UserConnectionType, ConnectionStatus } from '@/types';

const TYPE_LABELS: Record<UserConnectionType, string> = {
  uses: '사용',
  integrates: '통합',
  data_transfer: '데이터 전송',
  api_call: 'API 호출',
  auth_provider: '인증 제공',
  webhook: '웹훅',
  sdk: 'SDK',
};

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  active: '활성',
  inactive: '비활성',
  error: '오류',
  pending: '대기',
};

const STATUS_BADGE: Record<ConnectionStatus, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

export default function ConnectionsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const { data: connections, isLoading } = useProjectConnections(projectId);
  const { data: services } = useProjectServices(projectId);
  const { data: suggestions } = useAutoConnectSuggestions(projectId);
  const createMutation = useCreateConnection(projectId);
  const updateMutation = useUpdateConnection(projectId);
  const deleteMutation = useDeleteConnection(projectId);
  const autoConnectMutation = useAutoConnect(projectId);

  const [showCreate, setShowCreate] = useState(false);
  const [newSource, setNewSource] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newType, setNewType] = useState<UserConnectionType>('uses');

  // Build a serviceId → name map from project services
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
      },
      { onSuccess: () => setShowCreate(false) }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Cable className="h-5 w-5" />
            연결 관리
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            서비스 간 연결을 생성하고 관리합니다
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
              자동 연결 ({suggestions.length}개 제안)
            </Button>
          )}
          <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
            <Plus className="mr-1.5 h-4 w-4" />
            연결 추가
          </Button>
        </div>
      </div>

      {/* Create new connection form */}
      {showCreate && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[160px]">
                <label className="text-xs text-muted-foreground mb-1 block">소스 서비스</label>
                <Select value={newSource} onValueChange={setNewSource}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="선택..." />
                  </SelectTrigger>
                  <SelectContent>
                    {[...serviceMap.entries()].map(([id, name]) => (
                      <SelectItem key={id} value={id} className="text-sm">{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="text-xs text-muted-foreground mb-1 block">타겟 서비스</label>
                <Select value={newTarget} onValueChange={setNewTarget}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="선택..." />
                  </SelectTrigger>
                  <SelectContent>
                    {[...serviceMap.entries()].map(([id, name]) => (
                      <SelectItem key={id} value={id} className="text-sm">{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-[140px]">
                <label className="text-xs text-muted-foreground mb-1 block">유형</label>
                <Select value={newType} onValueChange={(v) => setNewType(v as UserConnectionType)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(TYPE_LABELS) as [UserConnectionType, string][]).map(([k, v]) => (
                      <SelectItem key={k} value={k} className="text-sm">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} disabled={createMutation.isPending || !newSource || !newTarget}>
                생성
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Auto-connect suggestions */}
      {suggestions && suggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-purple-500" />
              자동 연결 제안
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
                    <span className="text-xs text-muted-foreground">({TYPE_LABELS[s.connection_type] ?? s.connection_type})</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{s.reason}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connections table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            연결 목록 ({connections?.length ?? 0}개)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">로딩 중...</div>
          ) : !connections || connections.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              연결이 없습니다. 서비스 간 연결을 추가하거나 자동 연결을 사용해보세요.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">소스</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">타겟</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">유형</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">상태</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">설명</th>
                    <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {connections.map((conn) => (
                    <tr key={conn.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
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
                            {(Object.entries(TYPE_LABELS) as [UserConnectionType, string][]).map(([k, v]) => (
                              <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE[conn.connection_status] ?? STATUS_BADGE.active}`}>
                          {STATUS_LABELS[conn.connection_status] ?? conn.connection_status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs max-w-[200px] truncate">
                        {conn.description ?? conn.label ?? '-'}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteMutation.mutate(conn.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
