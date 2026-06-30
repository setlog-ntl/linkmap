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
import { ChevronDown, ChevronRight, Eye, EyeOff, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAddEnvVar } from '@/lib/queries/env-vars';
import { useAddCredential } from '@/lib/queries/credentials';
import { useAddSecureNote } from '@/lib/queries/secure-notes';
import { secureNoteCategoryOptions } from '@/lib/constants/secure-note';
import { normalizeEnvKey } from '@/lib/utils/env-key';
import { parseEnvLine } from '@/lib/utils/parse-env';
import {
  kindMeta,
  purposeOptions,
  getPasswordStrength,
} from './vault-shared';
import type { CredentialPurpose, Environment, SecureNoteCategory, Service, VaultKind } from '@/types';

interface QuickAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  catalogServices: Service[];
  /** 탭에 따른 기본 선택 타입 */
  defaultKind?: VaultKind;
  /** 서비스 그룹에서 추가 시 기본 서비스 */
  defaultServiceId?: string | null;
}

const KIND_ORDER: VaultKind[] = ['env', 'credential', 'note'];

export function QuickAddDialog({
  open,
  onOpenChange,
  projectId,
  catalogServices,
  defaultKind = 'env',
  defaultServiceId = null,
}: QuickAddDialogProps) {
  const addEnvVar = useAddEnvVar(projectId);
  const addCredential = useAddCredential(projectId);
  const addNote = useAddSecureNote(projectId);

  const [kind, setKind] = useState<VaultKind>(defaultKind);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serviceId, setServiceId] = useState<string | null>(defaultServiceId);

  // env
  const [envKey, setEnvKey] = useState('');
  const [envValue, setEnvValue] = useState('');
  const [envEnvironment, setEnvEnvironment] = useState<Environment>('development');
  const [envIsSecret, setEnvIsSecret] = useState(true);
  const [envDesc, setEnvDesc] = useState('');

  // credential
  const [credLabel, setCredLabel] = useState('');
  const [credUsername, setCredUsername] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [credPurpose, setCredPurpose] = useState<CredentialPurpose>('other');
  const [credEnv, setCredEnv] = useState('all');
  const [credUrl, setCredUrl] = useState('');
  const [credNotes, setCredNotes] = useState('');

  // note
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState<SecureNoteCategory>('backup_code');
  const [noteContent, setNoteContent] = useState('');
  const [noteEnv, setNoteEnv] = useState('all');
  const [noteNotes, setNoteNotes] = useState('');

  // 다이얼로그 열릴 때 기본값으로 초기화
  useEffect(() => {
    if (open) {
      setKind(defaultKind);
      setServiceId(defaultServiceId);
      setShowAdvanced(false);
      setShowPassword(false);
      setEnvKey('');
      setEnvValue('');
      setEnvEnvironment('development');
      setEnvIsSecret(true);
      setEnvDesc('');
      setCredLabel('');
      setCredUsername('');
      setCredPassword('');
      setCredPurpose('other');
      setCredEnv('all');
      setCredUrl('');
      setCredNotes('');
      setNoteTitle('');
      setNoteCategory('backup_code');
      setNoteContent('');
      setNoteEnv('all');
      setNoteNotes('');
    }
  }, [open, defaultKind, defaultServiceId]);

  const isPending = addEnvVar.isPending || addCredential.isPending || addNote.isPending;

  const handleEnvKeyChange = (raw: string) => {
    // KEY=VALUE 붙여넣기 자동 분리
    if (raw.includes('=')) {
      const isMultiline = raw.trim().split('\n').filter((l) => l.trim() && !l.trim().startsWith('#')).length > 1;
      const parsed = parseEnvLine(raw);
      if (parsed) {
        setEnvKey(parsed.key);
        setEnvValue(parsed.value);
        setEnvIsSecret(!parsed.key.startsWith('NEXT_PUBLIC_'));
        if (isMultiline) {
          toast.info('여러 줄은 환경변수 탭의 “고급 도구 → 일괄 가져오기”를 사용하세요. 첫 줄만 입력했습니다.');
        }
        return;
      }
    }
    const key = normalizeEnvKey(raw);
    setEnvKey(key);
    setEnvIsSecret(!key.startsWith('NEXT_PUBLIC_'));
  };

  const canSave =
    kind === 'env'
      ? !!envKey.trim() && !!envValue
      : kind === 'credential'
        ? !!credLabel.trim() && !!credUsername.trim()
        : !!noteTitle.trim() && !!noteContent.trim();

  const handleSave = async () => {
    try {
      if (kind === 'env') {
        await addEnvVar.mutateAsync({
          key_name: envKey.trim(),
          value: envValue,
          environment: envEnvironment,
          is_secret: envIsSecret,
          description: envDesc.trim() || null,
          service_id: serviceId,
        });
        toast.success('환경변수가 추가되었습니다');
      } else if (kind === 'credential') {
        await addCredential.mutateAsync({
          label: credLabel.trim(),
          username: credUsername.trim(),
          password: credPassword || null,
          purpose: credPurpose,
          environment: credEnv,
          service_id: serviceId,
          website_url: credUrl.trim() || null,
          notes: credNotes.trim() || null,
        });
        toast.success('비밀키가 추가되었습니다');
      } else {
        await addNote.mutateAsync({
          title: noteTitle.trim(),
          category: noteCategory,
          content: noteContent,
          environment: noteEnv,
          service_id: serviceId,
          notes: noteNotes.trim() || null,
        });
        toast.success('보안 메모가 추가되었습니다');
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '추가에 실패했습니다');
    }
  };

  const pwStrength = getPasswordStrength(credPassword);

  const serviceSelect = (
    <div className="space-y-1.5">
      <Label className="text-xs">서비스 (선택)</Label>
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[88dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            빠른 추가
          </DialogTitle>
          <DialogDescription>어떤 걸 저장할지 고르고 핵심 항목만 입력하면 됩니다. 값은 AES-256-GCM으로 암호화됩니다.</DialogDescription>
        </DialogHeader>

        {/* 타입 선택 */}
        <div className="grid grid-cols-3 gap-1 rounded-md border p-1">
          {KIND_ORDER.map((k) => {
            const meta = kindMeta[k];
            const Icon = meta.icon;
            const active = kind === k;
            return (
              <Button
                key={k}
                type="button"
                variant={active ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => setKind(k)}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? meta.tone : ''}`} />
                {meta.label}
              </Button>
            );
          })}
        </div>

        <div className="space-y-4">
          {/* 환경변수 */}
          {kind === 'env' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="qa-env-key" className="text-xs">키 이름 *</Label>
                <Input
                  id="qa-env-key"
                  placeholder="예: SUPABASE_URL (KEY=VALUE 붙여넣기 가능)"
                  value={envKey}
                  onChange={(e) => handleEnvKeyChange(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qa-env-value" className="text-xs">값 *</Label>
                <Textarea
                  id="qa-env-value"
                  placeholder="값을 입력하세요"
                  value={envValue}
                  onChange={(e) => setEnvValue(e.target.value)}
                  rows={2}
                  className="font-mono text-sm resize-y"
                />
              </div>
            </>
          )}

          {/* 비밀키 */}
          {kind === 'credential' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="qa-cred-label" className="text-xs">라벨 *</Label>
                <Input
                  id="qa-cred-label"
                  placeholder="예: AWS 관리자 계정"
                  value={credLabel}
                  onChange={(e) => setCredLabel(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qa-cred-user" className="text-xs">아이디 *</Label>
                <Input
                  id="qa-cred-user"
                  placeholder="admin@example.com"
                  value={credUsername}
                  onChange={(e) => setCredUsername(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qa-cred-pw" className="text-xs">비밀번호 (선택)</Label>
                <div className="relative">
                  <Input
                    id="qa-cred-pw"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호"
                    value={credPassword}
                    onChange={(e) => setCredPassword(e.target.value)}
                    className="font-mono pr-10"
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
            </>
          )}

          {/* 보안메모 */}
          {kind === 'note' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="qa-note-title" className="text-xs">제목 *</Label>
                <Input
                  id="qa-note-title"
                  placeholder="예: GitHub 2FA 백업코드"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  maxLength={200}
                />
              </div>
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
              <div className="space-y-1.5">
                <Label htmlFor="qa-note-content" className="text-xs">내용 * (암호화 저장)</Label>
                <Textarea
                  id="qa-note-content"
                  placeholder={'여러 줄 그대로 붙여넣으세요'}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={5}
                  className="font-mono text-sm resize-y"
                />
              </div>
            </>
          )}

          {/* 상세 설정 (접기) */}
          <div>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setShowAdvanced((s) => !s)}
            >
              {showAdvanced ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              상세 설정 (서비스{kind === 'env' ? ' · 민감도' : ' · 메모'})
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-4 rounded-md border bg-muted/30 p-3">
                {serviceSelect}

                {/* env: 용도(purpose) / 민감도 */}
                {kind === 'env' && (
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={envIsSecret}
                      onChange={(e) => setEnvIsSecret(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-border"
                    />
                    민감한 값으로 표시 (목록에서 마스킹)
                  </label>
                )}

                {kind === 'credential' && (
                  <>
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
                    <div className="space-y-1.5">
                      <Label htmlFor="qa-cred-url" className="text-xs">로그인 URL (선택)</Label>
                      <Input
                        id="qa-cred-url"
                        type="url"
                        placeholder="https://console.aws.amazon.com"
                        value={credUrl}
                        onChange={(e) => setCredUrl(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* 메모/설명 */}
                {kind === 'env' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="qa-env-desc" className="text-xs">설명 (선택)</Label>
                    <Input
                      id="qa-env-desc"
                      placeholder="어디에 쓰는 값인지 메모"
                      value={envDesc}
                      onChange={(e) => setEnvDesc(e.target.value)}
                      maxLength={500}
                    />
                  </div>
                )}
                {kind === 'credential' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="qa-cred-notes" className="text-xs">메모 (선택)</Label>
                    <Textarea
                      id="qa-cred-notes"
                      placeholder="추가 정보"
                      value={credNotes}
                      onChange={(e) => setCredNotes(e.target.value)}
                      rows={2}
                    />
                  </div>
                )}
                {kind === 'note' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="qa-note-notes" className="text-xs">설명 (선택 · 평문)</Label>
                    <Input
                      id="qa-note-notes"
                      placeholder="어디에 쓰는 값인지 메모"
                      value={noteNotes}
                      onChange={(e) => setNoteNotes(e.target.value)}
                      maxLength={1000}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button type="button" onClick={handleSave} disabled={isPending || !canSave}>
            {isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
