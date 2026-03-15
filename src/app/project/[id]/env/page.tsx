'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/keys';
import { useParams, useRouter } from 'next/navigation';
import { useEnvVars, useAddEnvVar, useDeleteEnvVar, useDecryptEnvVar, useUpdateEnvVar, useSyncEnvServices } from '@/lib/queries/env-vars';
import { useProjectServices, useCatalogServices } from '@/lib/queries/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GitBranch, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  buildEnvKeyServiceMap,
  buildEnvPrefixServiceMap,
  matchEnvKeyToServiceFuzzy,
} from '@/lib/utils/env-service-matcher';
import type { EnvServiceMatch } from '@/lib/utils/env-service-matcher';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { EnvImportDialog } from '@/components/service/env-import-dialog';
import type { ImportVariable } from '@/components/service/env-import-dialog';
import { SecretsSyncPanel } from '@/components/github/secrets-sync-panel';
import { parseEnvLine } from '@/lib/utils/parse-env';
import { useLinkedRepos } from '@/lib/queries/github';
import { EnvStatsHeader } from '@/components/env/env-stats-header';
import { EnvFilterBar } from '@/components/env/env-filter-bar';
import type { EnvViewMode } from '@/components/env/env-filter-bar';
import { EnvDataTable } from '@/components/env/env-data-table';
import type { EnvServiceGroup } from '@/components/env/env-data-table';
import { EnvDoctorPanel } from '@/components/ai/env-doctor-panel';
import { SmartKeyAnalyzerDialog } from '@/components/env/smart-key-analyzer';
import type { Environment, EnvironmentVariable } from '@/types';

export default function ProjectEnvPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const queryClient = useQueryClient();
  const { data: envVars = [], isLoading } = useEnvVars(projectId);
  const { data: projectServices = [] } = useProjectServices(projectId);
  const { data: catalogServices = [] } = useCatalogServices();
  const addEnvVar = useAddEnvVar(projectId);
  const deleteEnvVar = useDeleteEnvVar(projectId);
  const decryptEnvVar = useDecryptEnvVar();
  const updateEnvVar = useUpdateEnvVar(projectId);
  const syncEnvServices = useSyncEnvServices(projectId);

  const { locale } = useLocaleStore();
  const { data: linkedRepos = [] } = useLinkedRepos(projectId);
  const [showGitHubSync, setShowGitHubSync] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importInitialContent, setImportInitialContent] = useState('');
  const [activeEnv, setActiveEnv] = useState<Environment>('development');
  const [search, setSearch] = useState('');
  const [decryptedValues, setDecryptedValues] = useState<Record<string, string>>({});
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EnvironmentVariable | null>(null);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIsSecret, setNewIsSecret] = useState(true);
  const [editKey, setEditKey] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editIsSecret, setEditIsSecret] = useState(true);
  const [newServiceId, setNewServiceId] = useState<string | null>(null);
  const [autoDetectedService, setAutoDetectedService] = useState<EnvServiceMatch | null>(null);
  const [manualServiceSelect, setManualServiceSelect] = useState(false);
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [editEnvironment, setEditEnvironment] = useState<Environment>('development');
  const [analyzerOpen, setAnalyzerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<EnvViewMode>('all');

  const envKeyServiceMap = useMemo(
    () => buildEnvKeyServiceMap(catalogServices),
    [catalogServices]
  );
  const envPrefixServiceMap = useMemo(
    () => buildEnvPrefixServiceMap(catalogServices),
    [catalogServices]
  );

  const serviceNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const ps of projectServices) {
      if (ps.service) {
        map.set(ps.service_id, ps.service.name);
      }
    }
    return map;
  }, [projectServices]);

  const envCounts = useMemo(() => ({
    development: envVars.filter((v) => v.environment === 'development').length,
    staging: envVars.filter((v) => v.environment === 'staging').length,
    production: envVars.filter((v) => v.environment === 'production').length,
  }), [envVars]);

  const filteredVars = useMemo(() => {
    let vars = envVars.filter((v) => v.environment === activeEnv);
    if (search) {
      const q = search.toLowerCase();
      vars = vars.filter((v) =>
        v.key_name.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q)
      );
    }
    return vars;
  }, [envVars, activeEnv, search]);

  // 서비스 slug 맵 (아이콘 표시용)
  const serviceSlugMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const ps of projectServices) {
      if (ps.service) {
        map.set(ps.service_id, ps.service.slug);
      }
    }
    return map;
  }, [projectServices]);

  const serviceGroups = useMemo((): EnvServiceGroup[] | undefined => {
    if (viewMode !== 'by-service') return undefined;

    const groupMap = new Map<string, EnvironmentVariable[]>();
    const unlinked: EnvironmentVariable[] = [];

    for (const v of filteredVars) {
      if (v.service_id) {
        const existing = groupMap.get(v.service_id);
        if (existing) existing.push(v);
        else groupMap.set(v.service_id, [v]);
      } else {
        unlinked.push(v);
      }
    }

    const groups: EnvServiceGroup[] = [];

    // 서비스별 그룹 (이름순 정렬)
    const entries = Array.from(groupMap.entries());
    entries.sort((a, b) => {
      const nameA = serviceNameMap.get(a[0]) || '';
      const nameB = serviceNameMap.get(b[0]) || '';
      return nameA.localeCompare(nameB);
    });

    for (const [serviceId, vars] of entries) {
      groups.push({
        serviceId,
        serviceName: serviceNameMap.get(serviceId) || '알 수 없는 서비스',
        serviceSlug: serviceSlugMap.get(serviceId),
        envVars: vars,
      });
    }

    // 미연결 그룹은 마지막
    if (unlinked.length > 0) {
      groups.push({
        serviceId: null,
        serviceName: '미연결 변수',
        envVars: unlinked,
      });
    }

    return groups;
  }, [viewMode, filteredVars, serviceNameMap, serviceSlugMap]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    try {
      await addEnvVar.mutateAsync({
        key_name: newKey.trim(),
        value: newValue,
        environment: activeEnv,
        is_secret: newIsSecret,
        description: newDesc.trim() || null,
        service_id: newServiceId,
      });
      setAddOpen(false);
      setNewKey('');
      setNewValue('');
      setNewDesc('');
      setNewIsSecret(true);
      setNewServiceId(null);
      setAutoDetectedService(null);
      setManualServiceSelect(false);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error.code === 'QUOTA_EXCEEDED') {
        toast.error(error.message || '환경변수 한도를 초과했습니다', {
          action: { label: 'Pro 플랜 보기', onClick: () => router.push('/pricing') },
        });
      } else {
        toast.error(error.message || '환경변수 추가에 실패했습니다');
      }
    }
  };

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    await deleteEnvVar.mutateAsync(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const handleDownload = () => {
    window.open(`/api/env/download?project_id=${projectId}&environment=${activeEnv}`, '_blank');
  };

  const toggleShowValue = useCallback(async (id: string) => {
    const isCurrentlyShowing = showValues[id];
    if (isCurrentlyShowing) {
      setShowValues((prev) => ({ ...prev, [id]: false }));
      setDecryptedValues((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    try {
      const value = await decryptEnvVar.mutateAsync(id);
      setDecryptedValues((prev) => ({ ...prev, [id]: value }));
      setShowValues((prev) => ({ ...prev, [id]: true }));
    } catch {
      // silently fail - user can retry
    }
  }, [showValues, decryptEnvVar]);

  const openEditDialog = async (envVar: EnvironmentVariable) => {
    setEditTarget(envVar);
    setEditKey(envVar.key_name);
    setEditDesc(envVar.description || '');
    setEditIsSecret(envVar.is_secret);
    setEditServiceId(envVar.service_id ?? null);
    setEditEnvironment(envVar.environment as Environment);
    setEditValue('');
    try {
      const value = await decryptEnvVar.mutateAsync(envVar.id);
      setEditValue(value);
    } catch {
      setEditValue('');
    }
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    await updateEnvVar.mutateAsync({
      id: editTarget.id,
      key_name: editKey.trim() || undefined,
      value: editValue || undefined,
      environment: editEnvironment !== editTarget.environment ? editEnvironment : undefined,
      is_secret: editIsSecret,
      description: editDesc.trim() || null,
      service_id: editServiceId,
    });
    setDecryptedValues((prev) => {
      const next = { ...prev };
      delete next[editTarget.id];
      return next;
    });
    setShowValues((prev) => ({ ...prev, [editTarget.id]: false }));
    setEditOpen(false);
    setEditTarget(null);
  };

  const handleCopy = (envVar: EnvironmentVariable) => {
    navigator.clipboard.writeText(envVar.key_name);
    toast.success('키 이름이 복사되었습니다');
  };

  const handleCopyValue = useCallback(async (envVar: EnvironmentVariable) => {
    // 이미 복호화된 값이 있으면 바로 복사
    if (decryptedValues[envVar.id]) {
      await navigator.clipboard.writeText(decryptedValues[envVar.id]);
      toast.success('값이 복사되었습니다');
      return;
    }
    // 없으면 복호화 후 복사
    try {
      const value = await decryptEnvVar.mutateAsync(envVar.id);
      await navigator.clipboard.writeText(value);
      toast.success('값이 복사되었습니다');
    } catch {
      toast.error('값 복호화에 실패했습니다');
    }
  }, [decryptedValues, decryptEnvVar]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <EnvStatsHeader
        projectId={projectId}
        envVars={envVars}
        onSync={async () => {
          try {
            const result = await syncEnvServices.mutateAsync();
            const parts: string[] = [];
            if (result.updated_vars > 0) parts.push(`변수 ${result.updated_vars}개 서비스 매칭`);
            if (result.added_services > 0) parts.push(`서비스 ${result.added_services}개 추가`);
            if (result.auto_connections > 0) parts.push(`연결 ${result.auto_connections}개 생성`);
            toast.success(parts.length > 0 ? parts.join(' · ') : '이미 최신 상태입니다');
          } catch {
            toast.error(t(locale, 'envVar.syncFailed'));
          }
        }}
        isSyncing={syncEnvServices.isPending}
      />

      {/* AI + GitHub Sync */}
      <div className="flex items-center gap-2">
        <EnvDoctorPanel projectId={projectId} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowGitHubSync(!showGitHubSync)}
          className={showGitHubSync ? 'border-primary' : ''}
        >
          <GitBranch className="mr-2 h-4 w-4" />
          GitHub 동기화
          {linkedRepos.length > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {linkedRepos.length}
            </Badge>
          )}
        </Button>
      </div>

      {showGitHubSync && <SecretsSyncPanel projectId={projectId} />}

      {/* Filter Bar */}
      <EnvFilterBar
        activeEnv={activeEnv}
        onEnvChange={setActiveEnv}
        search={search}
        onSearchChange={setSearch}
        onAddClick={() => setAddOpen(true)}
        onExportClick={handleDownload}
        onImportClick={() => setImportOpen(true)}
        onAnalyzeClick={() => setAnalyzerOpen(true)}
        envCounts={envCounts}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Data Table */}
      <EnvDataTable
        envVars={filteredVars}
        serviceNameMap={serviceNameMap}
        showValues={showValues}
        decryptedValues={decryptedValues}
        isDecrypting={decryptEnvVar.isPending}
        onToggleShow={toggleShowValue}
        onEdit={openEditDialog}
        onDelete={handleDelete}
        onCopy={handleCopy}
        onCopyValue={handleCopyValue}
        serviceGroups={serviceGroups}
      />

      {/* Smart Key Analyzer */}
      <SmartKeyAnalyzerDialog
        projectId={projectId}
        open={analyzerOpen}
        onOpenChange={setAnalyzerOpen}
      />

      {/* Import Dialog (externally controlled) */}
      <EnvImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        projectServices={projectServices}
        initialContent={importInitialContent}
        onImport={async (vars: ImportVariable[]) => {
          const res = await fetch('/api/env/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId, variables: vars }),
          });
          if (!res.ok) throw new Error(t(locale, 'envVar.importDialog.failed'));
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.envVars.byProject(projectId) }),
            queryClient.invalidateQueries({ queryKey: queryKeys.envVars.conflicts(projectId) }),
            queryClient.invalidateQueries({ queryKey: queryKeys.healthChecks.latestByProject(projectId) }),
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all(projectId) }),
          ]);
        }}
      />

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>환경변수 추가</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="env-key">변수 이름</Label>
              <Input
                id="env-key"
                placeholder="NEXT_PUBLIC_EXAMPLE_KEY"
                value={newKey}
                onChange={(e) => {
                  const key = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
                  setNewKey(key);
                  const match = matchEnvKeyToServiceFuzzy(key, envKeyServiceMap, envPrefixServiceMap);
                  setAutoDetectedService(match);
                  if (match) {
                    setNewServiceId(match.serviceId);
                    setManualServiceSelect(false);
                  } else {
                    setNewServiceId(null);
                  }
                }}
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text');
                  const validLines = text.split('\n').filter((l) => {
                    const s = l.trim();
                    return s && !s.startsWith('#') && s.includes('=');
                  });
                  if (validLines.length > 1) {
                    // 여러 변수 감지 → 가져오기 다이얼로그로 자동 전환
                    e.preventDefault();
                    setAddOpen(false);
                    setImportInitialContent(text);
                    setImportOpen(true);
                    return;
                  }
                  const parsed = parseEnvLine(text);
                  if (parsed) {
                    e.preventDefault();
                    setNewKey(parsed.key);
                    setNewValue(parsed.value);
                    const match = matchEnvKeyToServiceFuzzy(parsed.key, envKeyServiceMap, envPrefixServiceMap);
                    setAutoDetectedService(match);
                    if (match) {
                      setNewServiceId(match.serviceId);
                      setManualServiceSelect(false);
                    }
                  }
                }}
                className="font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="env-value">값</Label>
              <Input
                id="env-value"
                placeholder="sk_live_..."
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text').trim();
                  const unquoted = (text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))
                    ? text.slice(1, -1)
                    : text;
                  if (unquoted !== text) {
                    e.preventDefault();
                    setNewValue(unquoted);
                  }
                }}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="env-desc">설명 (선택)</Label>
              <Input
                id="env-desc"
                placeholder="Supabase Project URL"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
            {/* Service Selection */}
            <div className="space-y-2">
              <Label>{t(locale, 'envVar.service')}</Label>
              {autoDetectedService && !manualServiceSelect ? (
                <div className="flex items-center gap-2">
                  <Badge variant={autoDetectedService.confidence === 'exact' ? 'default' : 'secondary'}
                    className={autoDetectedService.confidence === 'exact'
                      ? 'bg-green-500/10 text-green-700 border-green-300 dark:text-green-400'
                      : 'bg-yellow-500/10 text-yellow-700 border-yellow-300 dark:text-yellow-400'
                    }
                  >
                    {autoDetectedService.serviceName}
                    {' · '}
                    {autoDetectedService.confidence === 'exact'
                      ? t(locale, 'envVar.autoDetected')
                      : t(locale, 'envVar.prefixDetected')}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setManualServiceSelect(true)}
                  >
                    {t(locale, 'envVar.changeService')}
                  </Button>
                </div>
              ) : (
                <Select
                  value={newServiceId ?? '__none__'}
                  onValueChange={(val) => setNewServiceId(val === '__none__' ? null : val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t(locale, 'envVar.selectService')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">{t(locale, 'envVar.noServiceLinked')}</SelectItem>
                    {catalogServices.map((svc) => (
                      <SelectItem key={svc.id} value={svc.id}>{svc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="env-secret"
                checked={newIsSecret}
                onCheckedChange={(checked) => setNewIsSecret(checked as boolean)}
              />
              <Label htmlFor="env-secret" className="text-sm">
                민감한 값 (Secret)
              </Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                취소
              </Button>
              <Button type="submit" disabled={addEnvVar.isPending || !newKey.trim()}>
                {addEnvVar.isPending ? '추가 중...' : '추가'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!pendingDeleteId} onOpenChange={(open) => { if (!open) setPendingDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t(locale, 'common.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t(locale, 'common.deleteConfirmDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t(locale, 'common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleteEnvVar.isPending}
            >
              {deleteEnvVar.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t(locale, 'common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>환경변수 수정</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-key">변수 이름</Label>
              <Input
                id="edit-key"
                value={editKey}
                onChange={(e) => setEditKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text');
                  const parsed = parseEnvLine(text);
                  if (parsed) {
                    e.preventDefault();
                    setEditKey(parsed.key);
                    setEditValue(parsed.value);
                  }
                }}
                className="font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-value">값</Label>
              <Input
                id="edit-value"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text').trim();
                  const unquoted = (text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))
                    ? text.slice(1, -1)
                    : text;
                  if (unquoted !== text) {
                    e.preventDefault();
                    setEditValue(unquoted);
                  }
                }}
                className="font-mono"
                placeholder={decryptEnvVar.isPending ? '복호화 중...' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">설명 (선택)</Label>
              <Input
                id="edit-desc"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
            </div>
            {/* Environment Selection */}
            <div className="space-y-2">
              <Label>환경</Label>
              <Select
                value={editEnvironment}
                onValueChange={(v) => setEditEnvironment(v as Environment)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">개발 (Development)</SelectItem>
                  <SelectItem value="staging">스테이징 (Staging)</SelectItem>
                  <SelectItem value="production">프로덕션 (Production)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Edit Service Selection */}
            <div className="space-y-2">
              <Label>{t(locale, 'envVar.service')}</Label>
              <Select
                value={editServiceId ?? '__none__'}
                onValueChange={(val) => setEditServiceId(val === '__none__' ? null : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t(locale, 'envVar.selectService')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t(locale, 'envVar.noServiceLinked')}</SelectItem>
                  {catalogServices.map((svc) => (
                    <SelectItem key={svc.id} value={svc.id}>{svc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-secret"
                checked={editIsSecret}
                onCheckedChange={(checked) => setEditIsSecret(checked as boolean)}
              />
              <Label htmlFor="edit-secret" className="text-sm">
                민감한 값 (Secret)
              </Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                취소
              </Button>
              <Button type="submit" disabled={updateEnvVar.isPending}>
                {updateEnvVar.isPending ? '저장 중...' : '저장'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
