'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEnvVars, useDeleteEnvVar } from '@/lib/queries/env-vars';
import { useCredentials, useDeleteCredential } from '@/lib/queries/credentials';
import { useSecureNotes, useDeleteSecureNote } from '@/lib/queries/secure-notes';
import { useProjectServices, useCatalogServices } from '@/lib/queries/services';
import { useMfaChallenge } from '@/lib/hooks/use-mfa-challenge';
import { toVaultItems, groupByService } from '@/lib/mappers/vault';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
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
import { MfaChallengeDialog } from '@/components/mfa/mfa-challenge-dialog';
import { VaultGroup } from '@/components/credentials/vault-group';
import { QuickAddDialog } from '@/components/credentials/quick-add-dialog';
import { VaultEditDialog } from '@/components/credentials/vault-edit-dialog';
import { Key, Plus, Search, Loader2, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { RevealedValue, VaultItem, VaultKind } from '@/types';

type TypeTab = 'all' | VaultKind;

const TYPE_TABS: { value: TypeTab; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'env', label: '환경변수' },
  { value: 'credential', label: '비밀키' },
  { value: 'note', label: '보안메모' },
];

async function decryptErrorMessage(res: Response): Promise<string> {
  const data = await res.json().catch(() => ({} as { error?: string; code?: string }));
  if (data.code === 'MFA_REQUIRED') return '2단계 인증이 필요합니다';
  return data.error || '복호화에 실패했습니다';
}

export default function ProjectCredentialsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const { data: envVars = [], isLoading: envLoading } = useEnvVars(projectId);
  const { data: credentials = [], isLoading: credLoading } = useCredentials(projectId);
  const { data: notes = [], isLoading: notesLoading } = useSecureNotes(projectId);
  const { data: projectServices = [] } = useProjectServices(projectId);
  const { data: catalogServices = [] } = useCatalogServices();

  const deleteEnvVar = useDeleteEnvVar(projectId);
  const deleteCredential = useDeleteCredential(projectId);
  const deleteNote = useDeleteSecureNote(projectId);

  const { isChallengeOpen, setChallengeOpen, onVerified, onRecovery, executeSensitive } = useMfaChallenge();

  const [type, setType] = useState<TypeTab>('all');
  const [search, setSearch] = useState('');
  const [revealedMap, setRevealedMap] = useState<Record<string, RevealedValue>>({});
  const [decryptingKey, setDecryptingKey] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addKind, setAddKind] = useState<VaultKind>('env');
  const [addServiceId, setAddServiceId] = useState<string | null>(null);

  const [editItem, setEditItem] = useState<VaultItem | null>(null);
  const [editInitial, setEditInitial] = useState<RevealedValue | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editDecrypting, setEditDecrypting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<VaultItem | null>(null);

  const isLoading = envLoading || credLoading || notesLoading;

  // URL ?type= 동기화 (useSearchParams Suspense 회피)
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('type');
    if (t === 'env' || t === 'credential' || t === 'note') setType(t);
  }, []);

  const onTypeChange = useCallback((t: TypeTab) => {
    setType(t);
    const url = new URL(window.location.href);
    if (t === 'all') url.searchParams.delete('type');
    else url.searchParams.set('type', t);
    window.history.replaceState(null, '', url.toString());
  }, []);

  const serviceNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const ps of projectServices) {
      if (ps.service) map.set(ps.service_id, ps.service.name);
    }
    for (const svc of catalogServices) {
      if (!map.has(svc.id)) map.set(svc.id, svc.name);
    }
    return map;
  }, [projectServices, catalogServices]);

  const allItems = useMemo(
    () => toVaultItems(envVars, credentials, notes),
    [envVars, credentials, notes],
  );

  const counts = useMemo(() => {
    const c = { all: allItems.length, env: 0, credential: 0, note: 0 };
    for (const it of allItems) c[it.kind] += 1;
    return c;
  }, [allItems]);

  const filtered = useMemo(() => {
    let list = allItems;
    if (type !== 'all') list = list.filter((i) => i.kind === type);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.subtitle?.toLowerCase().includes(q) ||
          (i.serviceId && serviceNameMap.get(i.serviceId)?.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [allItems, type, search, serviceNameMap]);

  const groups = useMemo(() => groupByService(filtered, serviceNameMap), [filtered, serviceNameMap]);

  const decryptVaultItem = useCallback(
    async (item: VaultItem): Promise<RevealedValue> => {
      if (item.kind === 'env') {
        const res = await executeSensitive(() =>
          fetch('/api/env/decrypt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.id }),
          }),
        );
        if (!res.ok) throw new Error(await decryptErrorMessage(res));
        const data = await res.json();
        return { kind: 'env', value: data.value };
      }
      if (item.kind === 'note') {
        const res = await executeSensitive(() =>
          fetch('/api/secure-notes/decrypt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.id }),
          }),
        );
        if (!res.ok) throw new Error(await decryptErrorMessage(res));
        const data = await res.json();
        return { kind: 'note', value: data.content };
      }
      const res = await executeSensitive(() =>
        fetch('/api/credentials/decrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, field: 'both' }),
        }),
      );
      if (!res.ok) throw new Error(await decryptErrorMessage(res));
      const data = await res.json();
      return { kind: 'credential', username: data.username, password: data.password };
    },
    [executeSensitive],
  );

  const handleToggleReveal = useCallback(
    async (item: VaultItem) => {
      if (revealedMap[item.key] !== undefined) {
        setRevealedMap((prev) => {
          const next = { ...prev };
          delete next[item.key];
          return next;
        });
        return;
      }
      setDecryptingKey(item.key);
      try {
        const value = await decryptVaultItem(item);
        setRevealedMap((prev) => ({ ...prev, [item.key]: value }));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : '복호화에 실패했습니다');
      } finally {
        setDecryptingKey(null);
      }
    },
    [revealedMap, decryptVaultItem],
  );

  const handleCopy = useCallback(
    async (item: VaultItem, which: 'value' | 'username' | 'password') => {
      try {
        const val = revealedMap[item.key] ?? (await decryptVaultItem(item));
        let text: string | undefined;
        if (val.kind === 'credential') {
          text = which === 'password' ? val.password : val.username;
        } else {
          text = val.value;
        }
        if (!text) {
          toast.error('복사할 값이 없습니다');
          return;
        }
        await navigator.clipboard.writeText(text);
        toast.success(
          which === 'password' ? '비밀번호가 복사되었습니다' : which === 'username' ? '아이디가 복사되었습니다' : '복사되었습니다',
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : '복사에 실패했습니다');
      }
    },
    [revealedMap, decryptVaultItem],
  );

  const handleEdit = useCallback(
    async (item: VaultItem) => {
      setEditItem(item);
      setEditInitial(null);
      setEditOpen(true);
      setEditDecrypting(true);
      try {
        const val = await decryptVaultItem(item);
        setEditInitial(val);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : '복호화에 실패했습니다');
      } finally {
        setEditDecrypting(false);
      }
    },
    [decryptVaultItem],
  );

  const handleSaved = useCallback((item: VaultItem) => {
    setRevealedMap((prev) => {
      const next = { ...prev };
      delete next[item.key];
      return next;
    });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.kind === 'env') await deleteEnvVar.mutateAsync(deleteTarget.id);
      else if (deleteTarget.kind === 'credential') await deleteCredential.mutateAsync(deleteTarget.id);
      else await deleteNote.mutateAsync(deleteTarget.id);
      toast.success('삭제되었습니다');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '삭제에 실패했습니다');
    }
  }, [deleteTarget, deleteEnvVar, deleteCredential, deleteNote]);

  const openQuickAdd = useCallback(
    (serviceId: string | null = null) => {
      setAddKind(type === 'all' ? 'env' : type);
      setAddServiceId(serviceId);
      setAddOpen(true);
    },
    [type],
  );

  const deletePending =
    deleteEnvVar.isPending || deleteCredential.isPending || deleteNote.isPending;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-1 flex items-center gap-1.5">
          <Key className="h-4 w-4 text-brand-blue" />
          <h2 className="text-base font-semibold">비밀키 관리</h2>
          {counts.all > 0 && <Badge variant="secondary" className="text-xs">{counts.all}</Badge>}
        </div>
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-36 pl-8 text-sm sm:w-44"
            aria-label="비밀키 검색"
          />
        </div>
        <Button size="sm" className="h-8 gap-1 text-xs" onClick={() => openQuickAdd(null)}>
          <Plus className="h-3.5 w-3.5" />
          추가
        </Button>
      </div>

      {/* Type tabs */}
      <nav className="flex gap-1 overflow-x-auto border-b scrollbar-none">
        {TYPE_TABS.map((t) => {
          const active = type === t.value;
          const count = counts[t.value];
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onTypeChange(t.value)}
              className={cn(
                '-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
              <Badge variant={active ? 'default' : 'secondary'} className="text-[10px]">{count}</Badge>
            </button>
          );
        })}
      </nav>

      {/* 고급 도구 링크 */}
      {(type === 'env' || type === 'credential') && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wrench className="h-3.5 w-3.5" />
          {type === 'env' ? (
            <Link href={`/project/${projectId}/env`} prefetch={false} className="underline hover:text-foreground">
              환경변수 고급 도구 (충돌 해결 · 일괄 가져오기 · 서비스 동기화)
            </Link>
          ) : (
            <Link href={`/project/${projectId}/credentials/advanced`} prefetch={false} className="underline hover:text-foreground">
              비밀키 고급 도구 (일괄 수정 · .env 내보내기)
            </Link>
          )}
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      ) : allItems.length === 0 ? (
        <EmptyState
          icon={Key}
          title="저장된 항목이 없습니다"
          description="환경변수·비밀키·보안메모를 한곳에서 안전하게 관리하세요. 값은 AES-256-GCM으로 암호화됩니다."
        >
          <Button size="sm" onClick={() => openQuickAdd(null)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            첫 항목 추가
          </Button>
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="검색 결과 없음" description="조건에 맞는 항목이 없습니다." />
      ) : (
        <div className="space-y-2">
          {groups.map((group) => (
            <VaultGroup
              key={group.serviceId ?? '__none__'}
              group={group}
              revealedMap={revealedMap}
              decryptingKey={decryptingKey}
              onToggleReveal={handleToggleReveal}
              onCopy={handleCopy}
              onEdit={handleEdit}
              onDelete={(item) => setDeleteTarget(item)}
              onAddForService={openQuickAdd}
            />
          ))}
        </div>
      )}

      {/* Quick Add */}
      <QuickAddDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        projectId={projectId}
        catalogServices={catalogServices}
        defaultKind={addKind}
        defaultServiceId={addServiceId}
      />

      {/* Edit */}
      <VaultEditDialog
        open={editOpen}
        onOpenChange={(o) => { setEditOpen(o); if (!o) { setEditItem(null); setEditInitial(null); } }}
        projectId={projectId}
        catalogServices={catalogServices}
        item={editItem}
        initialValue={editInitial}
        decrypting={editDecrypting}
        onSaved={handleSaved}
      />

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.title ? `"${deleteTarget.title}" 항목을 삭제하시겠습니까?` : '이 항목을 삭제하시겠습니까?'}
              {' '}이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(e) => { e.preventDefault(); confirmDelete(); }}
              disabled={deletePending}
            >
              {deletePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* MFA challenge — 1회 인증 후 세션 동안 추가 인증 없이 연속 조회 */}
      <MfaChallengeDialog
        open={isChallengeOpen}
        onOpenChange={(o) => {
          setChallengeOpen(o);
          // 인증 취소/완료로 닫힐 때 진행 중 스피너 정리 (검증 성공 경로는 await 재개 후 값이 채워짐)
          if (!o) {
            setDecryptingKey(null);
            setEditDecrypting(false);
          }
        }}
        onVerified={onVerified}
        onRecovery={onRecovery}
      />
    </div>
  );
}
