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
} from '@/lib/queries/credentials';
import { useProjectServices, useCatalogServices } from '@/lib/queries/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, UserCheck, Loader2, ShieldCheck, Eye, EyeOff, CheckSquare, X, Pencil, Trash2 } from 'lucide-react';
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

  // Unique services used in credentials (for filter dropdown)
  const usedServices = useMemo(() => {
    const serviceIds = new Set(credentials.filter((c) => c.service_id).map((c) => c.service_id!));
    return Array.from(serviceIds)
      .map((id) => ({ id, name: serviceNameMap.get(id) || id }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [credentials, serviceNameMap]);

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

  // Selection handlers
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
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

  const clearSelection = useCallback(() => {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">전체 계정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credentials.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">연결된 서비스</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(credentials.filter((c) => c.service_id).map((c) => c.service_id)).size}
            </div>
          </CardContent>
        </Card>
        <Card className="hidden lg:block">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">보안</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <ShieldCheck className="h-4 w-4" />
              AES-256 암호화
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="라벨, 서비스명으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={filterPurpose} onValueChange={setFilterPurpose}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="용도 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">전체 용도</SelectItem>
            {purposeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterService} onValueChange={setFilterService}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="서비스 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">전체 서비스</SelectItem>
            <SelectItem value="__none__">미연결</SelectItem>
            {usedServices.map((svc) => (
              <SelectItem key={svc.id} value={svc.id}>
                {svc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          계정 추가
        </Button>
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
