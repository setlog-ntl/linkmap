'use client';

import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  useSecureNotes,
  useAddSecureNote,
  useUpdateSecureNote,
  useDeleteSecureNote,
  useDecryptSecureNote,
} from '@/lib/queries/secure-notes';
import { useProjectServices, useCatalogServices } from '@/lib/queries/services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { EmptyState } from '@/components/ui/empty-state';
import {
  Plus, ShieldCheck, Eye, EyeOff, Pencil, Trash2, Copy, Loader2, Search, Link2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  secureNoteCategoryOptions,
  secureNoteCategoryLabels,
  secureNoteEnvOptions,
} from '@/lib/constants/secure-note';
import type { SecureNote, SecureNoteCategory } from '@/types';

const envBadgeLabel: Record<string, string> = {
  all: '전체',
  development: 'Dev',
  staging: 'Staging',
  production: 'Prod',
};

export default function ProjectSecureNotesPage() {
  const params = useParams();
  const projectId = params.id as string;

  const { data: notes = [], isLoading } = useSecureNotes(projectId);
  const { data: projectServices = [] } = useProjectServices(projectId);
  const { data: catalogServices = [] } = useCatalogServices();
  const addNote = useAddSecureNote(projectId);
  const updateNote = useUpdateSecureNote(projectId);
  const deleteNote = useDeleteSecureNote(projectId);
  const decryptNote = useDecryptSecureNote();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('__all__');
  const [revealed, setRevealed] = useState<Record<string, string>>({});

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SecureNote | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // form state (add + edit 공용)
  const [fTitle, setFTitle] = useState('');
  const [fCategory, setFCategory] = useState<SecureNoteCategory>('backup_code');
  const [fContent, setFContent] = useState('');
  const [fEnv, setFEnv] = useState('all');
  const [fServiceId, setFServiceId] = useState<string | null>(null);
  const [fNotes, setFNotes] = useState('');

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

  const filtered = useMemo(() => {
    let list = notes;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.notes?.toLowerCase().includes(q) ||
          (n.service_id && serviceNameMap.get(n.service_id)?.toLowerCase().includes(q)),
      );
    }
    if (filterCategory !== '__all__') {
      list = list.filter((n) => n.category === filterCategory);
    }
    return list;
  }, [notes, search, filterCategory, serviceNameMap]);

  const resetForm = useCallback(() => {
    setFTitle('');
    setFCategory('backup_code');
    setFContent('');
    setFEnv('all');
    setFServiceId(null);
    setFNotes('');
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fTitle.trim() || !fContent.trim()) return;
    try {
      await addNote.mutateAsync({
        title: fTitle.trim(),
        category: fCategory,
        content: fContent,
        environment: fEnv,
        service_id: fServiceId,
        notes: fNotes.trim() || null,
      });
      setAddOpen(false);
      resetForm();
      toast.success('보안 메모가 저장되었습니다');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '저장에 실패했습니다');
    }
  };

  const openEdit = async (note: SecureNote) => {
    setEditTarget(note);
    setFTitle(note.title);
    setFCategory(note.category);
    setFEnv(note.environment);
    setFServiceId(note.service_id);
    setFNotes(note.notes || '');
    setFContent('');
    setEditOpen(true);
    try {
      const content = await decryptNote.mutateAsync(note.id);
      setFContent(content);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '복호화에 실패했습니다');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    try {
      await updateNote.mutateAsync({
        id: editTarget.id,
        title: fTitle.trim() || undefined,
        category: fCategory,
        content: fContent || undefined,
        environment: fEnv,
        service_id: fServiceId,
        notes: fNotes.trim() || null,
      });
      // 수정된 항목은 다시 마스킹
      setRevealed((prev) => {
        const next = { ...prev };
        delete next[editTarget.id];
        return next;
      });
      setEditOpen(false);
      setEditTarget(null);
      resetForm();
      toast.success('보안 메모가 수정되었습니다');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '수정에 실패했습니다');
    }
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteNote.mutateAsync(pendingDeleteId);
      setPendingDeleteId(null);
      toast.success('보안 메모가 삭제되었습니다');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '삭제에 실패했습니다');
    }
  };

  const toggleReveal = useCallback(async (note: SecureNote) => {
    if (revealed[note.id] !== undefined) {
      setRevealed((prev) => {
        const next = { ...prev };
        delete next[note.id];
        return next;
      });
      return;
    }
    try {
      const content = await decryptNote.mutateAsync(note.id);
      setRevealed((prev) => ({ ...prev, [note.id]: content }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '복호화에 실패했습니다');
    }
  }, [revealed, decryptNote]);

  const handleCopy = useCallback(async (note: SecureNote) => {
    try {
      const content = revealed[note.id] ?? (await decryptNote.mutateAsync(note.id));
      await navigator.clipboard.writeText(content);
      toast.success('내용이 복사되었습니다');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '복사에 실패했습니다');
    }
  }, [revealed, decryptNote]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full rounded-md" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  const noteFormFields = (
    <>
      <div className="space-y-2">
        <Label htmlFor="sn-title">제목 *</Label>
        <Input
          id="sn-title"
          placeholder="예: GitHub 2FA 백업코드"
          value={fTitle}
          onChange={(e) => setFTitle(e.target.value)}
          maxLength={200}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>분류</Label>
          <Select value={fCategory} onValueChange={(v) => setFCategory(v as SecureNoteCategory)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {secureNoteCategoryOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>환경</Label>
          <Select value={fEnv} onValueChange={setFEnv}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {secureNoteEnvOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sn-content">내용 * (암호화 저장)</Label>
        <Textarea
          id="sn-content"
          placeholder={'여러 줄 그대로 붙여넣으세요'}
          value={fContent}
          onChange={(e) => setFContent(e.target.value)}
          rows={6}
          className="font-mono text-sm resize-y"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>서비스 (선택)</Label>
        <Select
          value={fServiceId ?? '__none__'}
          onValueChange={(v) => setFServiceId(v === '__none__' ? null : v)}
        >
          <SelectTrigger><SelectValue placeholder="서비스 선택" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">서비스 미연결</SelectItem>
            {catalogServices.map((svc) => (
              <SelectItem key={svc.id} value={svc.id}>{svc.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sn-desc">설명 (선택 · 평문)</Label>
        <Input
          id="sn-desc"
          placeholder="어디에 쓰는 값인지 메모"
          value={fNotes}
          onChange={(e) => setFNotes(e.target.value)}
          maxLength={1000}
        />
      </div>
    </>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 mr-1">
          <ShieldCheck className="h-4 w-4 text-brand-blue" />
          <h2 className="text-base font-semibold">보안 메모</h2>
          {notes.length > 0 && <Badge variant="secondary" className="text-xs">{notes.length}</Badge>}
        </div>
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 w-36 sm:w-44 h-8 text-sm"
            aria-label="보안 메모 검색"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="분류" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">전체 분류</SelectItem>
            {secureNoteCategoryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" className="h-8 gap-1 text-xs" onClick={() => { resetForm(); setAddOpen(true); }}>
          <Plus className="h-3.5 w-3.5" />
          추가
        </Button>
      </div>

      {/* List */}
      {notes.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="저장된 보안 메모가 없습니다"
          description="백업 코드, 비밀번호, 복구 문구처럼 환경변수가 아닌 텍스트를 안전하게 저장하세요."
        >
          <Button size="sm" onClick={() => { resetForm(); setAddOpen(true); }}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            첫 보안 메모 추가
          </Button>
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="검색 결과 없음" description="조건에 맞는 보안 메모가 없습니다." />
      ) : (
        <div className="space-y-2">
          {filtered.map((note) => {
            const isRevealed = revealed[note.id] !== undefined;
            return (
              <div key={note.id} className="rounded-lg border bg-card p-3 shadow-sm">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-medium text-sm truncate">{note.title}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {secureNoteCategoryLabels[note.category]}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {envBadgeLabel[note.environment] || note.environment}
                      </Badge>
                      {note.service_id && serviceNameMap.get(note.service_id) && (
                        <Badge variant="outline" className="gap-1 text-[10px]">
                          <Link2 className="h-2.5 w-2.5" />
                          {serviceNameMap.get(note.service_id)}
                        </Badge>
                      )}
                    </div>
                    {note.notes && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">{note.notes}</p>
                    )}
                    <pre className={`mt-2 max-h-48 overflow-auto rounded-md bg-muted px-2.5 py-2 font-mono text-xs whitespace-pre-wrap break-all ${isRevealed ? '' : 'select-none text-muted-foreground'}`}>
                      {isRevealed ? revealed[note.id] : '••••••••••••'}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toggleReveal(note)}
                      disabled={decryptNote.isPending}
                      title={isRevealed ? '숨기기' : '보기'}
                    >
                      {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleCopy(note)}
                      title="복사"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEdit(note)}
                      title="수정"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => setPendingDeleteId(note.id)}
                      title="삭제"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={(open) => { if (!open) resetForm(); setAddOpen(open); }}>
        <DialogContent className="sm:max-w-md max-h-[88dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-blue" />
              보안 메모 추가
            </DialogTitle>
            <DialogDescription>내용은 AES-256-GCM으로 암호화되어 저장됩니다.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            {noteFormFields}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { resetForm(); setAddOpen(false); }}>
                취소
              </Button>
              <Button type="submit" disabled={addNote.isPending || !fTitle.trim() || !fContent.trim()}>
                {addNote.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                저장
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) { setEditTarget(null); resetForm(); } }}>
        <DialogContent className="sm:max-w-md max-h-[88dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              보안 메모 수정
            </DialogTitle>
            <DialogDescription>내용이 자동으로 복호화되어 표시됩니다.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            {noteFormFields}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setEditOpen(false); setEditTarget(null); resetForm(); }}>
                취소
              </Button>
              <Button type="submit" disabled={updateNote.isPending}>
                {updateNote.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                저장
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!pendingDeleteId} onOpenChange={(open) => { if (!open) setPendingDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              이 보안 메모를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(e) => { e.preventDefault(); confirmDelete(); }}
              disabled={deleteNote.isPending}
            >
              {deleteNote.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
