'use client';

import { useState, useCallback } from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAddSecureNote } from '@/lib/queries/secure-notes';
import { secureNoteCategoryOptions, secureNoteEnvOptions } from '@/lib/constants/secure-note';
import type { Service, SecureNoteCategory } from '@/types';

interface SecureNoteFormProps {
  service: Service;
  projectId: string;
  /** 저장 성공 또는 취소 시 호출 — 상위 다이얼로그를 닫는다 */
  onClose: () => void;
}

/**
 * 보안 메모(자유 텍스트 민감값) 등록 폼.
 * 다이얼로그 셸 없이 본문 + 푸터만 렌더 — ManualRegisterDialog 의 탭에서 사용.
 */
export function SecureNoteForm({ service, projectId, onClose }: SecureNoteFormProps) {
  const addNote = useAddSecureNote(projectId);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SecureNoteCategory>('backup_code');
  const [content, setContent] = useState('');
  const [environment, setEnvironment] = useState('all');
  const [notes, setNotes] = useState('');

  const activeHint = secureNoteCategoryOptions.find((o) => o.value === category)?.hint;

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      toast.error('제목을 입력하세요');
      return;
    }
    if (!content.trim()) {
      toast.error('내용을 입력하세요');
      return;
    }
    try {
      await addNote.mutateAsync({
        title: title.trim(),
        category,
        content,
        environment,
        service_id: service.id,
        notes: notes.trim() || null,
      });
      toast.success(`보안 메모를 ${service.name}에 저장했습니다`);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '보안 메모 저장에 실패했습니다');
    }
  }, [title, content, category, environment, notes, service.id, service.name, addNote, onClose]);

  return (
    <>
      <div className="space-y-4 overflow-y-auto flex-1 min-h-0 pr-1">
        <div className="flex items-start gap-2 rounded-md border border-brand-blue/30 bg-brand-blue/5 p-2.5">
          <ShieldCheck className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            백업 코드·비밀번호·복구 문구처럼 <strong>KEY=VALUE 형식이 아닌 텍스트</strong>를 그대로 저장합니다.
            내용은 AES-256-GCM으로 암호화되어 저장돼요.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="note-title" className="text-xs">제목 *</Label>
          <Input
            id="note-title"
            placeholder="예: GitHub 2FA 백업코드"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">분류</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as SecureNoteCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {secureNoteCategoryOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">환경</Label>
            <Select value={environment} onValueChange={setEnvironment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {secureNoteEnvOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {activeHint && <p className="text-[11px] text-muted-foreground -mt-2">{activeHint}</p>}

        <div className="space-y-1.5">
          <Label htmlFor="note-content" className="text-xs">내용 * (암호화 저장)</Label>
          <Textarea
            id="note-content"
            placeholder={'여러 줄 그대로 붙여넣으세요\n예) 백업코드 8자리 묶음, 복구 문구 12단어 등'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="font-mono text-sm resize-y"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="note-desc" className="text-xs">설명 (선택 · 평문)</Label>
          <Input
            id="note-desc"
            placeholder="어디에 쓰는 값인지 메모"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={1000}
          />
        </div>
      </div>

      <DialogFooter className="shrink-0 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button type="button" onClick={handleSave} disabled={addNote.isPending || !title.trim() || !content.trim()}>
          {addNote.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
          저장
        </Button>
      </DialogFooter>
    </>
  );
}
