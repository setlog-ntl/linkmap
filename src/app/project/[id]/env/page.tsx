'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/keys';
import { useParams } from 'next/navigation';
import { useEnvVars, useAddEnvVar, useDeleteEnvVar, useDecryptEnvVar, useUpdateEnvVar } from '@/lib/queries/env-vars';
import { useProjectServices } from '@/lib/queries/services';
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
import { GitBranch, Loader2 } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { EnvImportDialog } from '@/components/service/env-import-dialog';
import { SecretsSyncPanel } from '@/components/github/secrets-sync-panel';
import { useLinkedRepos } from '@/lib/queries/github';
import { EnvStatsHeader } from '@/components/env/env-stats-header';
import { EnvFilterBar } from '@/components/env/env-filter-bar';
import { EnvDataTable } from '@/components/env/env-data-table';
import { EnvDoctorPanel } from '@/components/ai/env-doctor-panel';
import type { Environment, EnvironmentVariable } from '@/types';

export default function ProjectEnvPage() {
  const params = useParams();
  const projectId = params.id as string;
  const queryClient = useQueryClient();
  const { data: envVars = [], isLoading } = useEnvVars(projectId);
  const { data: projectServices = [] } = useProjectServices(projectId);
  const addEnvVar = useAddEnvVar(projectId);
  const deleteEnvVar = useDeleteEnvVar(projectId);
  const decryptEnvVar = useDecryptEnvVar();
  const updateEnvVar = useUpdateEnvVar(projectId);

  const { locale } = useLocaleStore();
  const { data: linkedRepos = [] } = useLinkedRepos(projectId);
  const [showGitHubSync, setShowGitHubSync] = useState(false);
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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    await addEnvVar.mutateAsync({
      key_name: newKey.trim(),
      value: newValue,
      environment: activeEnv,
      is_secret: newIsSecret,
      description: newDesc.trim() || null,
    });
    setAddOpen(false);
    setNewKey('');
    setNewValue('');
    setNewDesc('');
    setNewIsSecret(true);
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
      is_secret: editIsSecret,
      description: editDesc.trim() || null,
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
  };

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
      <EnvStatsHeader projectId={projectId} envVars={envVars} />

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
        envCounts={envCounts}
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
      />

      {/* Import Dialog (self-managed trigger) */}
      <EnvImportDialog
        onImport={async (vars) => {
          const res = await fetch('/api/env/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId, variables: vars }),
          });
          if (!res.ok) throw new Error('일괄 가져오기 실패');
          await queryClient.invalidateQueries({ queryKey: queryKeys.envVars.byProject(projectId) });
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
                onChange={(e) => setNewKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
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
