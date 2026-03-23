'use client';

import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  useCredentials,
  useAddCredential,
  useUpdateCredential,
  useDeleteCredential,
  useDecryptCredential,
  useBulkUpdateCredentials,
  useBulkDeleteCredentials,
  useExportCredentials,
} from '@/lib/queries/credentials';
import { useProjectServices, useCatalogServices } from '@/lib/queries/services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
import {
  Plus, UserCheck, Loader2, ShieldCheck, Eye, EyeOff,
  CheckSquare, X, Pencil, Trash2, List, LayoutGrid,
  Clock, ShieldAlert, Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { CredentialsTable } from '@/components/credentials/credentials-table';
import type { ServiceCredential, CredentialPurpose } from '@/types';

const purposeOptions: { value: CredentialPurpose; label: string }[] = [
  { value: 'admin', label: '관리자 계정' },
  { value: 'demo', label: '데모 계정' },
  { value: 'deploy', label: '배포 계정' },
  { value: 'monitoring', label: '모니터링 계정' },
  { value: 'api', label: 'API 계정' },
  { value: 'other', label: '기타' },
];

const envOptions = [
  { value: 'all', label: '전체 환경' },
  { value: 'development', label: 'Development' },
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' },
];

// Password strength checker
function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score += 20;
  if (pw.length >= 12) score += 10;
  if (pw.length >= 16) score += 10;
  if (/[a-z]/.test(pw)) score += 10;
  if (/[A-Z]/.test(pw)) score += 15;
  if (/\d/.test(pw)) score += 15;
  if (/[^a-zA-Z0-9]/.test(pw)) score += 20;
  score = Math.min(score, 100);
  if (score < 30) return { score, label: '매우 약함', color: 'bg-red-500' };
  if (score < 50) return { score, label: '약함', color: 'bg-orange-500' };
  if (score < 70) return { score, label: '보통', color: 'bg-yellow-500' };
  if (score < 90) return { score, label: '강함', color: 'bg-green-500' };
  return { score, label: '매우 강함', color: 'bg-emerald-500' };
}

function getDaysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9가-힣_-]/g, '_').toLowerCase();
}

function generateEnvContent(
  entries: Array<{ label: string; username: string; password: string | null; environment: string; purpose: string }>,
  serviceName: string,
): string {
  const lines: string[] = [
    `# ${serviceName} credentials (exported from Linkmap)`,
    `# Generated: ${new Date().toISOString().split('T')[0]}`,
    '',
  ];

  for (const entry of entries) {
    const key = entry.label
      .toUpperCase()
      .replace(/[^A-Z0-9가-힣]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    lines.push(`# ${entry.label} (${entry.purpose}, ${entry.environment})`);
    lines.push(`${key}_USERNAME=${entry.username}`);
    if (entry.password) {
      lines.push(`${key}_PASSWORD=${entry.password}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function downloadEnvFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ProjectCredentialsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { data: credentials = [], isLoading } = useCredentials(projectId);
  const { data: projectServices = [] } = useProjectServices(projectId);
  const { data: catalogServices = [] } = useCatalogServices();
  const addCredential = useAddCredential(projectId);
  const updateCredential = useUpdateCredential(projectId);
  const deleteCredential = useDeleteCredential(projectId);
  const decryptCredential = useDecryptCredential();
  const bulkUpdateCredentials = useBulkUpdateCredentials(projectId);
  const bulkDeleteCredentials = useBulkDeleteCredentials(projectId);
  const exportCredentials = useExportCredentials();

  // State
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ServiceCredential | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [decryptedData, setDecryptedData] = useState<Record<string, { username?: string; password?: string }>>({});
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [filterPurpose, setFilterPurpose] = useState<string>('__all__');
  const [filterService, setFilterService] = useState<string>('__all__');
  const [showPassword, setShowPassword] = useState(false);
  const [groupByService, setGroupByService] = useState(true);

  // Bulk edit state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkPurpose, setBulkPurpose] = useState<string>('__unchanged__');
  const [bulkEnv, setBulkEnv] = useState<string>('__unchanged__');
  const [bulkServiceId, setBulkServiceId] = useState<string>('__unchanged__');

  // Add form
  const [newLabel, setNewLabel] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPurpose, setNewPurpose] = useState<CredentialPurpose>('other');
  const [newEnv, setNewEnv] = useState('all');
  const [newServiceId, setNewServiceId] = useState<string | null>(null);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Edit form
  const [editLabel, setEditLabel] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editPurpose, setEditPurpose] = useState<CredentialPurpose>('other');
  const [editEnv, setEditEnv] = useState('all');
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [editWebsiteUrl, setEditWebsiteUrl] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const serviceNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const ps of projectServices) {
      if (ps.service) {
        map.set(ps.service_id, ps.service.name);
      }
    }
    for (const svc of catalogServices) {
      if (!map.has(svc.id)) {
        map.set(svc.id, svc.name);
      }
    }
    return map;
  }, [projectServices, catalogServices]);

  const usedServices = useMemo(() => {
    const serviceIds = new Set(credentials.filter((c) => c.service_id).map((c) => c.service_id!));
    return Array.from(serviceIds)
      .map((id) => ({ id, name: serviceNameMap.get(id) || id }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [credentials, serviceNameMap]);

  // Security stats
  const securityStats = useMemo(() => {
    const noPassword = credentials.filter((c) => !c.encrypted_password).length;
    const oldCreds = credentials.filter((c) => getDaysSince(c.updated_at) >= 90).length;
    const totalServices = new Set(credentials.filter((c) => c.service_id).map((c) => c.service_id)).size;
    const unlinked = credentials.filter((c) => !c.service_id).length;

    let score = 100;
    if (credentials.length > 0) {
      const noPasswordPenalty = (noPassword / credentials.length) * 30;
      const oldCredsPenalty = (oldCreds / credentials.length) * 30;
      const unlinkedPenalty = (unlinked / credentials.length) * 10;
      score = Math.max(0, Math.round(100 - noPasswordPenalty - oldCredsPenalty - unlinkedPenalty));
    }

    return { noPassword, oldCreds, totalServices, unlinked, score };
  }, [credentials]);

  const filteredCredentials = useMemo(() => {
    let list = credentials;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.label.toLowerCase().includes(q) ||
          c.notes?.toLowerCase().includes(q) ||
          (c.service_id && serviceNameMap.get(c.service_id)?.toLowerCase().includes(q))
      );
    }
    if (filterPurpose !== '__all__') {
      list = list.filter((c) => c.purpose === filterPurpose);
    }
    if (filterService !== '__all__') {
      if (filterService === '__none__') {
        list = list.filter((c) => !c.service_id);
      } else {
        list = list.filter((c) => c.service_id === filterService);
      }
    }
    return list;
  }, [credentials, search, filterPurpose, filterService, serviceNameMap]);

  const revealedCount = useMemo(
    () => Object.values(showValues).filter(Boolean).length,
    [showValues]
  );

  const toggleShowValue = useCallback(
    async (id: string) => {
      if (showValues[id]) {
        setShowValues((prev) => ({ ...prev, [id]: false }));
        setDecryptedData((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        return;
      }
      try {
        const data = await decryptCredential.mutateAsync({ id, field: 'both' });
        setDecryptedData((prev) => ({ ...prev, [id]: data }));
        setShowValues((prev) => ({ ...prev, [id]: true }));
      } catch {
        toast.error('복호화에 실패했습니다');
      }
    },
    [showValues, decryptCredential]
  );

  const hideAll = useCallback(() => {
    setShowValues({});
    setDecryptedData({});
    toast.success('모든 값을 숨겼습니다');
  }, []);

  const handleAutoHide = useCallback((id: string) => {
    setShowValues((prev) => ({ ...prev, [id]: false }));
    setDecryptedData((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  // Selection handlers
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const allFilteredIds = filteredCredentials.map((c) => c.id);
      const allSelected = allFilteredIds.every((id) => prev.has(id));
      if (allSelected) {
        const next = new Set(prev);
        allFilteredIds.forEach((id) => next.delete(id));
        return next;
      } else {
        const next = new Set(prev);
        allFilteredIds.forEach((id) => next.add(id));
        return next;
      }
    });
  }, [filteredCredentials]);

  const selectServiceGroup = useCallback((serviceId: string | null) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const groupIds = filteredCredentials
        .filter((c) => (serviceId === null ? !c.service_id : c.service_id === serviceId))
        .map((c) => c.id);
      const allSelected = groupIds.every((id) => next.has(id));
      if (allSelected) {
        groupIds.forEach((id) => next.delete(id));
      } else {
        groupIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [filteredCredentials]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const setFilterPurposeAndClear = useCallback((v: string) => {
    setFilterPurpose(v);
    setSelectedIds(new Set());
  }, []);

  const setFilterServiceAndClear = useCallback((v: string) => {
    setFilterService(v);
    setSelectedIds(new Set());
  }, []);

  const setSearchAndClear = useCallback((v: string) => {
    setSearch(v);
    setSelectedIds(new Set());
  }, []);

  const resetAddForm = () => {
    setNewLabel('');
    setNewUsername('');
    setNewPassword('');
    setNewPurpose('other');
    setNewEnv('all');
    setNewServiceId(null);
    setNewWebsiteUrl('');
    setNewNotes('');
    setShowPassword(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newUsername.trim()) return;
    try {
      await addCredential.mutateAsync({
        label: newLabel.trim(),
        username: newUsername.trim(),
        password: newPassword || null,
        purpose: newPurpose,
        environment: newEnv,
        service_id: newServiceId,
        website_url: newWebsiteUrl.trim() || null,
        notes: newNotes.trim() || null,
      });
      setAddOpen(false);
      resetAddForm();
      toast.success('계정 정보가 추가되었습니다');
    } catch {
      toast.error('추가에 실패했습니다');
    }
  };

  const openEditDialog = async (cred: ServiceCredential) => {
    setEditTarget(cred);
    setEditLabel(cred.label);
    setEditPurpose(cred.purpose);
    setEditEnv(cred.environment);
    setEditServiceId(cred.service_id);
    setEditWebsiteUrl(cred.website_url || '');
    setEditNotes(cred.notes || '');
    setEditUsername('');
    setEditPassword('');
    setShowPassword(false);
    try {
      const data = await decryptCredential.mutateAsync({ id: cred.id, field: 'both' });
      setEditUsername(data.username || '');
      setEditPassword(data.password || '');
    } catch {
      setEditUsername('');
      setEditPassword('');
    }
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    try {
      await updateCredential.mutateAsync({
        id: editTarget.id,
        label: editLabel.trim() || undefined,
        username: editUsername.trim() || undefined,
        password: editPassword || undefined,
        purpose: editPurpose,
        environment: editEnv,
        service_id: editServiceId,
        website_url: editWebsiteUrl.trim() || null,
        notes: editNotes.trim() || null,
      });
      setDecryptedData((prev) => {
        const next = { ...prev };
        delete next[editTarget.id];
        return next;
      });
      setShowValues((prev) => ({ ...prev, [editTarget.id]: false }));
      setEditOpen(false);
      setEditTarget(null);
      toast.success('계정 정보가 수정되었습니다');
    } catch {
      toast.error('수정에 실패했습니다');
    }
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteCredential.mutateAsync(pendingDeleteId);
      setPendingDeleteId(null);
      toast.success('계정 정보가 삭제되었습니다');
    } catch {
      toast.error('삭제에 실패했습니다');
    }
  };

  // Bulk handlers
  const openBulkEdit = () => {
    setBulkPurpose('__unchanged__');
    setBulkEnv('__unchanged__');
    setBulkServiceId('__unchanged__');
    setBulkEditOpen(true);
  };

  const handleBulkEdit = async () => {
    const ids = Array.from(selectedIds);
    const updates: Record<string, unknown> = {};
    if (bulkPurpose !== '__unchanged__') updates.purpose = bulkPurpose;
    if (bulkEnv !== '__unchanged__') updates.environment = bulkEnv;
    if (bulkServiceId !== '__unchanged__') {
      updates.service_id = bulkServiceId === '__none__' ? null : bulkServiceId;
    }

    if (Object.keys(updates).length === 0) {
      toast.error('변경할 항목을 선택하세요');
      return;
    }

    try {
      const result = await bulkUpdateCredentials.mutateAsync({ ids, ...updates } as {
        ids: string[];
        purpose?: string;
        environment?: string;
        service_id?: string | null;
      });
      setBulkEditOpen(false);
      clearSelection();
      toast.success(`${result.count}개 계정 정보가 수정되었습니다`);
    } catch {
      toast.error('일괄 수정에 실패했습니다');
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    try {
      const result = await bulkDeleteCredentials.mutateAsync(ids);
      setBulkDeleteOpen(false);
      clearSelection();
      toast.success(`${result.count}개 계정 정보가 삭제되었습니다`);
    } catch {
      toast.error('일괄 삭제에 실패했습니다');
    }
  };

  // Service-specific handlers
  const handleAddForService = useCallback((serviceId: string | null) => {
    resetAddForm();
    setNewServiceId(serviceId);
    setAddOpen(true);
  }, []);

  const handleBulkEditGroup = useCallback((serviceId: string | null) => {
    const groupCreds = filteredCredentials.filter((c) =>
      serviceId === null ? !c.service_id : c.service_id === serviceId
    );
    if (groupCreds.length === 0) return;
    const newSelected = new Set(groupCreds.map((c) => c.id));
    setSelectedIds(newSelected);
    setBulkPurpose('__unchanged__');
    setBulkEnv('__unchanged__');
    setBulkServiceId('__unchanged__');
    setBulkEditOpen(true);
  }, [filteredCredentials]);

  const handleExportGroup = useCallback(async (serviceId: string | null) => {
    const groupCreds = filteredCredentials.filter((c) =>
      serviceId === null ? !c.service_id : c.service_id === serviceId
    );
    if (groupCreds.length === 0) return;
    const ids = groupCreds.map((c) => c.id);
    const serviceName = serviceId ? (serviceNameMap.get(serviceId) || 'unknown') : 'unlinked';

    try {
      const result = await exportCredentials.mutateAsync({ project_id: projectId, ids });
      const envContent = generateEnvContent(result.entries, serviceName);
      downloadEnvFile(envContent, `${sanitizeFilename(serviceName)}.env`);
      toast.success(`${groupCreds.length}개 자격증명이 내보내기되었습니다`);
    } catch {
      toast.error('내보내기에 실패했습니다');
    }
  }, [filteredCredentials, serviceNameMap, exportCredentials, projectId]);

  const handleExportAll = useCallback(async () => {
    if (filteredCredentials.length === 0) return;
    const ids = filteredCredentials.map((c) => c.id);

    try {
      const result = await exportCredentials.mutateAsync({ project_id: projectId, ids });
      const envContent = generateEnvContent(result.entries, 'all');
      downloadEnvFile(envContent, 'credentials.env');
      toast.success(`${filteredCredentials.length}개 자격증명이 내보내기되었습니다`);
    } catch {
      toast.error('내보내기에 실패했습니다');
    }
  }, [filteredCredentials, exportCredentials, projectId]);

  const newPasswordStrength = getPasswordStrength(newPassword);
  const editPasswordStrength = getPasswordStrength(editPassword);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
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
      {/* Security Summary — 한 줄 인라인 */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-lg border bg-card">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 cursor-help">
                <ShieldCheck className={`h-4 w-4 ${securityStats.score >= 80 ? 'text-green-500' : securityStats.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`} />
                <span className="text-sm font-bold">{securityStats.score}점</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>보안 점수 (AES-256-GCM 암호화)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-border">|</span>
        <span className="text-sm text-muted-foreground">
          계정 <span className="font-semibold text-foreground">{credentials.length}</span>
        </span>
        <span className="text-sm text-muted-foreground">
          서비스 <span className="font-semibold text-foreground">{securityStats.totalServices}</span>
        </span>
        {securityStats.noPassword > 0 && (
          <>
            <span className="text-border">|</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              비밀번호 없음 {securityStats.noPassword}
            </span>
          </>
        )}
        {securityStats.oldCreds > 0 && (
          <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            90일+ {securityStats.oldCreds}
          </span>
        )}
      </div>

      {/* Toolbar: 뷰 토글 + 필터 + 액션 */}
      <div className="flex flex-col gap-2">
        {/* 1줄: 뷰 토글 + 검색 + 필터 + 액션 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 뷰 토글 (서비스별 먼저) */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={groupByService ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-r-none h-8 gap-1 px-2.5 text-xs"
              onClick={() => setGroupByService(true)}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              서비스별
            </Button>
            <Button
              variant={groupByService ? 'ghost' : 'secondary'}
              size="sm"
              className="rounded-l-none h-8 gap-1 px-2.5 text-xs"
              onClick={() => setGroupByService(false)}
            >
              <List className="h-3.5 w-3.5" />
              전체
            </Button>
          </div>

          <Input
            placeholder="검색..."
            value={search}
            onChange={(e) => setSearchAndClear(e.target.value)}
            className="h-8 w-40 sm:w-48 text-sm"
          />
          <Select value={filterPurpose} onValueChange={setFilterPurposeAndClear}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="용도" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">전체 용도</SelectItem>
              {purposeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterService} onValueChange={setFilterServiceAndClear}>
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <SelectValue placeholder="서비스" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">전체 서비스</SelectItem>
              <SelectItem value="__none__">미연결</SelectItem>
              {usedServices.map((svc) => (
                <SelectItem key={svc.id} value={svc.id}>{svc.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1" />

          {revealedCount > 0 && (
            <Button variant="ghost" size="sm" onClick={hideAll} className="h-8 gap-1 text-xs px-2">
              <EyeOff className="h-3.5 w-3.5" />
              숨기기
              <Badge variant="secondary" className="text-[9px] px-1">{revealedCount}</Badge>
            </Button>
          )}
          {filteredCredentials.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleExportAll}
                    disabled={exportCredentials.isPending}
                  >
                    {exportCredentials.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>전체 .env 내보내기</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button size="sm" className="h-8 gap-1" onClick={() => setAddOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            추가
          </Button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-lg border border-brand-blue/20">
          <CheckSquare className="h-4 w-4 text-brand-blue" />
          <span className="text-sm font-medium">{selectedIds.size}개 선택됨</span>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={openBulkEdit}>
            <Pencil className="mr-2 h-3.5 w-3.5" />
            일괄 수정
          </Button>
          <Button variant="outline" size="sm" onClick={() => setBulkDeleteOpen(true)} className="text-destructive border-destructive/30 hover:bg-destructive/10">
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            일괄 삭제
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Data Table */}
      <CredentialsTable
        credentials={filteredCredentials}
        serviceNameMap={serviceNameMap}
        decryptedData={decryptedData}
        showValues={showValues}
        isDecrypting={decryptCredential.isPending}
        onToggleShow={toggleShowValue}
        onEdit={openEditDialog}
        onDelete={(id) => setPendingDeleteId(id)}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        groupByService={groupByService}
        onSelectServiceGroup={selectServiceGroup}
        onAutoHide={handleAutoHide}
        onAddForService={handleAddForService}
        onBulkEditGroup={handleBulkEditGroup}
        onExportGroup={handleExportGroup}
      />

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={(open) => { if (!open) resetAddForm(); setAddOpen(open); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              계정 정보 추가
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cred-label">라벨 *</Label>
              <Input
                id="cred-label"
                placeholder="예: AWS 관리자 계정"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cred-purpose">용도</Label>
                <Select value={newPurpose} onValueChange={(v) => setNewPurpose(v as CredentialPurpose)}>
                  <SelectTrigger id="cred-purpose">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {purposeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cred-env">환경</Label>
                <Select value={newEnv} onValueChange={setNewEnv}>
                  <SelectTrigger id="cred-env">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {envOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cred-username">아이디 *</Label>
              <Input
                id="cred-username"
                placeholder="admin@example.com"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cred-password">비밀번호 (선택)</Label>
              <div className="relative">
                <Input
                  id="cred-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="font-mono pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </Button>
              </div>
              {newPassword && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Progress value={newPasswordStrength.score} className={`h-1.5 flex-1 [&>div]:${newPasswordStrength.color}`} />
                    <span className={`text-[10px] font-medium ${newPasswordStrength.score < 50 ? 'text-red-500' : newPasswordStrength.score < 70 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {newPasswordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>서비스 (선택)</Label>
              <Select
                value={newServiceId ?? '__none__'}
                onValueChange={(val) => setNewServiceId(val === '__none__' ? null : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="서비스 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">서비스 미연결</SelectItem>
                  {catalogServices.map((svc) => (
                    <SelectItem key={svc.id} value={svc.id}>{svc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cred-url">로그인 URL (선택)</Label>
              <Input
                id="cred-url"
                type="url"
                placeholder="https://console.aws.amazon.com"
                value={newWebsiteUrl}
                onChange={(e) => setNewWebsiteUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cred-notes">메모 (선택)</Label>
              <Textarea
                id="cred-notes"
                placeholder="추가 정보를 입력하세요"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={2}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { resetAddForm(); setAddOpen(false); }}>
                취소
              </Button>
              <Button type="submit" disabled={addCredential.isPending || !newLabel.trim() || !newUsername.trim()}>
                {addCredential.isPending ? '추가 중...' : '추가'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              계정 정보 수정
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-label">라벨</Label>
              <Input
                id="edit-label"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>용도</Label>
                <Select value={editPurpose} onValueChange={(v) => setEditPurpose(v as CredentialPurpose)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {purposeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>환경</Label>
                <Select value={editEnv} onValueChange={setEditEnv}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {envOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-username">아이디</Label>
              <Input
                id="edit-username"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="font-mono"
                placeholder={decryptCredential.isPending ? '복호화 중...' : ''}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">비밀번호 (선택)</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={showPassword ? 'text' : 'password'}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="font-mono pr-10"
                  placeholder={decryptCredential.isPending ? '복호화 중...' : '비어있으면 비밀번호 없음'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </Button>
              </div>
              {editPassword && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Progress value={editPasswordStrength.score} className={`h-1.5 flex-1 [&>div]:${editPasswordStrength.color}`} />
                    <span className={`text-[10px] font-medium ${editPasswordStrength.score < 50 ? 'text-red-500' : editPasswordStrength.score < 70 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {editPasswordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>서비스</Label>
              <Select
                value={editServiceId ?? '__none__'}
                onValueChange={(val) => setEditServiceId(val === '__none__' ? null : val)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">서비스 미연결</SelectItem>
                  {catalogServices.map((svc) => (
                    <SelectItem key={svc.id} value={svc.id}>{svc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-url">로그인 URL</Label>
              <Input
                id="edit-url"
                type="url"
                value={editWebsiteUrl}
                onChange={(e) => setEditWebsiteUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">메모</Label>
              <Textarea
                id="edit-notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={2}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                취소
              </Button>
              <Button type="submit" disabled={updateCredential.isPending}>
                {updateCredential.isPending ? '저장 중...' : '저장'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Edit Dialog */}
      <Dialog open={bulkEditOpen} onOpenChange={setBulkEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              {selectedIds.size}개 계정 일괄 수정
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              변경하지 않을 항목은 &quot;변경 없음&quot;으로 유지하세요.
            </p>
            <div className="space-y-2">
              <Label>용도</Label>
              <Select value={bulkPurpose} onValueChange={setBulkPurpose}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__unchanged__">변경 없음</SelectItem>
                  {purposeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>환경</Label>
              <Select value={bulkEnv} onValueChange={setBulkEnv}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__unchanged__">변경 없음</SelectItem>
                  {envOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>서비스</Label>
              <Select value={bulkServiceId} onValueChange={setBulkServiceId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__unchanged__">변경 없음</SelectItem>
                  <SelectItem value="__none__">서비스 미연결</SelectItem>
                  {catalogServices.map((svc) => (
                    <SelectItem key={svc.id} value={svc.id}>{svc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkEditOpen(false)}>
              취소
            </Button>
            <Button
              onClick={handleBulkEdit}
              disabled={bulkUpdateCredentials.isPending || (bulkPurpose === '__unchanged__' && bulkEnv === '__unchanged__' && bulkServiceId === '__unchanged__')}
            >
              {bulkUpdateCredentials.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  수정 중...
                </>
              ) : '일괄 수정'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!pendingDeleteId} onOpenChange={(open) => { if (!open) setPendingDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              이 계정 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
              disabled={deleteCredential.isPending}
            >
              {deleteCredential.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirm Dialog */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>일괄 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              선택한 {selectedIds.size}개의 계정 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                handleBulkDelete();
              }}
              disabled={bulkDeleteCredentials.isPending}
            >
              {bulkDeleteCredentials.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedIds.size}개 삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
