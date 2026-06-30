'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, Loader2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateEnvVar } from '@/lib/queries/env-vars';
import { useUpdateCredential } from '@/lib/queries/credentials';
import { useUpdateSecureNote } from '@/lib/queries/secure-notes';
import { secureNoteCategoryOptions } from '@/lib/constants/secure-note';
import {
  kindMeta,
  purposeOptions,
  allEnvOptions,
  envOnlyOptions,
  getPasswordStrength,
} from './vault-shared';
import type {
  CredentialPurpose,
  Environment,
  EnvironmentVariable,
  RevealedValue,
  SecureNote,
  SecureNoteCategory,
  Service,
  ServiceCredential,
  VaultItem,
} from '@/types';

interface VaultEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  catalogServices: Service[];
  item: VaultItem | null;
  /** 상위(허브)에서 복호화한 초기값 — MFA 처리는 허브에서 끝낸 뒤 전달 */
  initialValue: RevealedValue | null;
  /** 복호화 진행 중 여부 (필드 placeholder 표시용) */
  decrypting?: boolean;
  /** 저장 성공 후 호출 (reveal 캐시 무효화 등) */
  onSaved?: (item: VaultItem) => void;
}

export function VaultEditDialog({
  open,
  onOpenChange,
  projectId,
  catalogServices,
  item,
  initialValue,
  decrypting = false,
  onSaved,
}: VaultEditDialogProps) {
  const updateEnvVar = useUpdateEnvVar(projectId);
  const updateCredential = useUpdateCredential(projectId);
  const updateNote = useUpdateSecureNote(projectId);

  const [showPassword, setShowPassword] = useState(false);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [environment, setEnvironment] = useState('all');

  // env
  const [envKey, setEnvKey] = useState('');
  const [envValue, setEnvValue] = useState('');
  const [envIsSecret, setEnvIsSecret] = useState(true);
  const [envDesc, setEnvDesc] = useState('');

  // credential
  const [credLabel, setCredLabel] = useState('');
  const [credUsername, setCredUsername] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [credPurpose, setCredPurpose] = useState<CredentialPurpose>('other');
  const [credUrl, setCredUrl] = useState('');
  const [credNotes, setCredNotes] = useState('');

  // note
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState<SecureNoteCategory>('backup_code');
  const [noteContent, setNoteContent] = useState('');
  const [noteNotes, setNoteNotes] = useState('');

  // item 변경 시 메타데이터 채우기
  useEffect(() => {
    if (!item || !open) return;
    setShowPassword(false);
    setServiceId(item.serviceId);
    setEnvironment(item.environment);
    // 이전 항목의 복호화 값 잔존 방지 — 초기값 도착 전까지 비움
    setEnvValue('');
    setCredUsername('');
    setCredPassword('');
    setNoteContent('');
    if (item.kind === 'env') {
      const e = item.raw as EnvironmentVariable;
      setEnvKey(e.key_name);
      setEnvIsSecret(e.is_secret);
      setEnvDesc(e.description ?? '');
    } else if (item.kind === 'credential') {
      const c = item.raw as ServiceCredential;
      setCredLabel(c.label);
      setCredPurpose(c.purpose);
      setCredUrl(c.website_url ?? '');
      setCredNotes(c.notes ?? '');
    } else {
      const n = item.raw as SecureNote;
      setNoteTitle(n.title);
      setNoteCategory(n.category);
      setNoteNotes(n.notes ?? '');
    }
  }, [item, open]);

  // 복호화 초기값 채우기
  useEffect(() => {
    if (!initialValue) return;
    if (initialValue.kind === 'credential') {
      setCredUsername(initialValue.username ?? '');
      setCredPassword(initialValue.password ?? '');
    } else if (initialValue.kind === 'env') {
      setEnvValue(initialValue.value);
    } else {
      setNoteContent(initialValue.value);
    }
  }, [initialValue]);

  if (!item) return null;

  const meta = kindMeta[item.kind];
  const isPending = updateEnvVar.isPending || updateCredential.isPending || updateNote.isPending;
  const pwStrength = getPasswordStrength(credPassword);

  const handleSave = async () => {
    try {
      if (item.kind === 'env') {
        if (!envKey.trim() || !envValue) {
          toast.error('키와 값을 입력하세요');
          return;
        }
        await updateEnvVar.mutateAsync({
          id: item.id,
          key_name: envKey.trim(),
          value: envValue,
          environment: environment as Environment,
          is_secret: envIsSecret,
          description: envDesc.trim() || null,
          service_id: serviceId,
        });
        toast.success('환경변수가 수정되었습니다');
      } else if (item.kind === 'credential') {
        if (!credLabel.trim() || !credUsername.trim()) {
          toast.error('라벨과 아이디를 입력하세요');
          return;
        }
        await updateCredential.mutateAsync({
          id: item.id,
          label: credLabel.trim(),
          username: credUsername.trim() || undefined,
          password: credPassword || undefined,
          purpose: credPurpose,
          environment,
          service_id: serviceId,
          website_url: credUrl.trim() || null,
          notes: credNotes.trim() || null,
        });
        toast.success('비밀키가 수정되었습니다');
      } else {
        if (!noteTitle.trim() || !noteContent.trim()) {
          toast.error('제목과 내용을 입력하세요');
          return;
        }
        await updateNote.mutateAsync({
          id: item.id,
          title: noteTitle.trim(),
          category: noteCategory,
          content: noteContent || undefined,
          environment,
          service_id: serviceId,
          notes: noteNotes.trim() || null,
        });
        toast.success('보안 메모가 수정되었습니다');
      }
      onSaved?.(item);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '수정에 실패했습니다');
    }
  };

  const envOptions = item.kind === 'env' ? envOnlyOptions : allEnvOptions;

  const serviceSelect = (
    <div className="space-y-1.5">
      <Label className="text-xs">서비스</Label>
      <Select
        value={serviceId ?? '__none__'}
        onValueChange={(v) => setServiceId(v === '__none__' ? null : v)}
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
  );

  const envSelect = (
    <div className="space-y-1.5">
      <Label className="text-xs">환경</Label>
      <Select value={environment} onValueChange={setEnvironment}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {envOptions.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[88dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            {meta.label} 수정
          </DialogTitle>
          <DialogDescription>값은 자동으로 복호화되어 표시됩니다. 저장 시 다시 암호화됩니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {item.kind === 'env' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="ve-env-key" className="text-xs">키 이름 *</Label>
                <Input id="ve-env-key" value={envKey} onChange={(e) => setEnvKey(e.target.value)} className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ve-env-value" className="text-xs">값 *</Label>
                <Textarea
                  id="ve-env-value"
                  value={envValue}
                  onChange={(e) => setEnvValue(e.target.value)}
                  rows={2}
                  className="font-mono text-sm resize-y"
                  placeholder={decrypting ? '복호화 중...' : ''}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {envSelect}
                <label className="flex items-end gap-2 text-xs pb-2">
                  <input
                    type="checkbox"
                    checked={envIsSecret}
                    onChange={(e) => setEnvIsSecret(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border"
                  />
                  민감한 값
                </label>
              </div>
              {serviceSelect}
              <div className="space-y-1.5">
                <Label htmlFor="ve-env-desc" className="text-xs">설명</Label>
                <Input id="ve-env-desc" value={envDesc} onChange={(e) => setEnvDesc(e.target.value)} maxLength={500} />
              </div>
            </>
          )}

          {item.kind === 'credential' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="ve-cred-label" className="text-xs">라벨 *</Label>
                <Input id="ve-cred-label" value={credLabel} onChange={(e) => setCredLabel(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">용도</Label>
                  <Select value={credPurpose} onValueChange={(v) => setCredPurpose(v as CredentialPurpose)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {purposeOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {envSelect}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ve-cred-user" className="text-xs">아이디 *</Label>
                <Input
                  id="ve-cred-user"
                  value={credUsername}
                  onChange={(e) => setCredUsername(e.target.value)}
                  className="font-mono"
                  placeholder={decrypting ? '복호화 중...' : ''}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ve-cred-pw" className="text-xs">비밀번호 (선택)</Label>
                <div className="relative">
                  <Input
                    id="ve-cred-pw"
                    type={showPassword ? 'text' : 'password'}
                    value={credPassword}
                    onChange={(e) => setCredPassword(e.target.value)}
                    className="font-mono pr-10"
                    placeholder={decrypting ? '복호화 중...' : '비어있으면 변경 안 함'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                </div>
                {credPassword && (
                  <div className="flex items-center gap-2">
                    <Progress value={pwStrength.score} className={`h-1.5 flex-1 [&>div]:${pwStrength.color}`} />
                    <span className={`text-[10px] font-medium ${pwStrength.score < 50 ? 'text-red-500' : pwStrength.score < 70 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {pwStrength.label}
                    </span>
                  </div>
                )}
              </div>
              {serviceSelect}
              <div className="space-y-1.5">
                <Label htmlFor="ve-cred-url" className="text-xs">로그인 URL</Label>
                <Input id="ve-cred-url" type="url" value={credUrl} onChange={(e) => setCredUrl(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ve-cred-notes" className="text-xs">메모</Label>
                <Textarea id="ve-cred-notes" value={credNotes} onChange={(e) => setCredNotes(e.target.value)} rows={2} />
              </div>
            </>
          )}

          {item.kind === 'note' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="ve-note-title" className="text-xs">제목 *</Label>
                <Input id="ve-note-title" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} maxLength={200} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">분류</Label>
                  <Select value={noteCategory} onValueChange={(v) => setNoteCategory(v as SecureNoteCategory)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {secureNoteCategoryOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {envSelect}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ve-note-content" className="text-xs">내용 * (암호화 저장)</Label>
                <Textarea
                  id="ve-note-content"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={6}
                  className="font-mono text-sm resize-y"
                  placeholder={decrypting ? '복호화 중...' : ''}
                />
              </div>
              {serviceSelect}
              <div className="space-y-1.5">
                <Label htmlFor="ve-note-notes" className="text-xs">설명 (평문)</Label>
                <Input id="ve-note-notes" value={noteNotes} onChange={(e) => setNoteNotes(e.target.value)} maxLength={1000} />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button type="button" onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
