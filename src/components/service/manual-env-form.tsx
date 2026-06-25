'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, Trash2, ClipboardPaste, Loader2, ChevronRight, ExternalLink, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { normalizeEnvKey } from '@/lib/utils/env-key';
import { parseEnvContent } from '@/lib/utils/parse-env';
import { queryKeys } from '@/lib/queries/keys';
import type { Service, Environment } from '@/types';

interface ManualEnvRow {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
}

interface ManualEnvFormProps {
  service: Service;
  projectId: string;
  /** 저장 성공 또는 취소 시 호출 — 상위 다이얼로그를 닫는다 */
  onClose: () => void;
}

/** 입력 중 키를 환경변수 형식(대문자·언더스코어)으로 정리 */
function sanitizeKeyInput(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
}

/**
 * 환경변수(KEY=VALUE) 수동 등록 폼.
 * 다이얼로그 셸 없이 본문 + 푸터만 렌더 — ManualRegisterDialog 의 탭에서 사용.
 */
export function ManualEnvForm({ service, projectId, onClose }: ManualEnvFormProps) {
  const queryClient = useQueryClient();
  const idCounter = useRef(0);
  const nextId = useCallback(() => `row-${idCounter.current++}`, []);

  const [environment, setEnvironment] = useState<Environment>('development');
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [saving, setSaving] = useState(false);

  // 필수 변수만 미리 채워 빈 placeholder를 최소화 — 선택 항목은 직접 추가/붙여넣기
  const [rows, setRows] = useState<ManualEnvRow[]>(() => {
    const templates = (service.required_env_vars || []).filter((t) => !t.optional);
    const seeded: ManualEnvRow[] = templates.map((t) => ({
      id: `row-${idCounter.current++}`,
      key: t.name,
      value: '',
      isSecret: !t.public,
    }));
    seeded.push({ id: `row-${idCounter.current++}`, key: '', value: '', isSecret: true });
    return seeded;
  });

  const updateRow = useCallback((id: string, patch: Partial<ManualEnvRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, { id: nextId(), key: '', value: '', isSecret: true }]);
  }, [nextId]);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((r) => r.id !== id)));
  }, []);

  const handleKeyChange = useCallback((id: string, raw: string) => {
    const key = sanitizeKeyInput(raw);
    const patch: Partial<ManualEnvRow> = { key };
    if (key.startsWith('NEXT_PUBLIC_')) patch.isSecret = false;
    updateRow(id, patch);
  }, [updateRow]);

  const applyPaste = useCallback(() => {
    const parsed = parseEnvContent(pasteText);
    if (parsed.length === 0) {
      toast.error('인식할 수 있는 변수가 없습니다');
      return;
    }
    setRows((prev) => {
      const kept = prev.filter((r) => r.key.trim());
      const map = new Map(kept.map((r) => [r.key, r] as const));
      for (const item of parsed) {
        const key = normalizeEnvKey(item.key);
        if (!key) continue;
        const existing = map.get(key);
        if (existing) {
          map.set(key, { ...existing, value: item.value });
        } else {
          map.set(key, {
            id: nextId(),
            key,
            value: item.value,
            isSecret: !key.startsWith('NEXT_PUBLIC_'),
          });
        }
      }
      const next = Array.from(map.values());
      next.push({ id: nextId(), key: '', value: '', isSecret: true });
      return next;
    });
    toast.success(`${parsed.length}개 항목을 반영했습니다`);
    setPasteText('');
    setShowPaste(false);
  }, [pasteText, nextId]);

  const validRows = useMemo(
    () => rows.map((r) => ({ ...r, key: normalizeEnvKey(r.key) })).filter((r) => r.key),
    [rows],
  );

  const handleSave = useCallback(async () => {
    if (validRows.length === 0) {
      toast.error('등록할 변수를 한 개 이상 입력하세요');
      return;
    }
    const seen = new Set<string>();
    for (const r of validRows) {
      if (seen.has(r.key)) {
        toast.error(`중복된 변수 이름이 있습니다: ${r.key}`);
        return;
      }
      seen.add(r.key);
    }

    setSaving(true);
    try {
      const res = await fetch('/api/env/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          variables: validRows.map((r) => ({
            key_name: r.key,
            value: r.value,
            environment,
            is_secret: r.isSecret,
            service_id: service.id,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({} as { error?: string }));
        throw new Error(data.error || '변수 저장에 실패했습니다');
      }
      const result = (await res.json()) as { created?: number };
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.envVars.byProject(projectId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.envVars.conflicts(projectId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.services.byProject(projectId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all(projectId) }),
      ]);
      toast.success(`${result.created ?? validRows.length}개 변수를 ${service.name}에 등록했습니다`);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '변수 저장에 실패했습니다');
    } finally {
      setSaving(false);
    }
  }, [validRows, environment, projectId, service.id, service.name, queryClient, onClose]);

  return (
    <>
      <div className="space-y-4 overflow-y-auto flex-1 min-h-0 pr-1">
        {service.docs_url && (
          <a
            href={service.docs_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            공식 문서에서 값 확인
          </a>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs">환경</Label>
          <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
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

        <Collapsible open={showPaste} onOpenChange={setShowPaste}>
          <CollapsibleTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="w-full text-xs">
              <ClipboardPaste className="mr-1.5 h-3.5 w-3.5" />
              .env 붙여넣기로 한 번에 채우기
              <ChevronRight className={`ml-auto h-3.5 w-3.5 transition-transform ${showPaste ? 'rotate-90' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            <Textarea
              placeholder={'.env 내용을 붙여넣으세요\nSUPABASE_URL=https://...\nSUPABASE_ANON_KEY=eyJ...'}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              rows={4}
              className="font-mono text-xs"
            />
            <Button type="button" size="sm" disabled={!pasteText.trim()} onClick={applyPaste}>
              반영
            </Button>
          </CollapsibleContent>
        </Collapsible>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">변수 목록</Label>
            <span className="text-[11px] text-muted-foreground">{validRows.length}개 입력됨</span>
          </div>

          {rows.map((row) => {
            const publicLeak = row.key.startsWith('NEXT_PUBLIC_') && row.isSecret;
            return (
              <div key={row.id} className="rounded-md border bg-card p-2.5 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={row.key}
                    onChange={(e) => handleKeyChange(row.id, e.target.value)}
                    placeholder="KEY_NAME"
                    className="font-mono text-sm h-8 flex-1"
                    aria-label="변수 이름"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length === 1}
                    title="이 행 삭제"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input
                  type={row.isSecret ? 'password' : 'text'}
                  value={row.value}
                  onChange={(e) => updateRow(row.id, { value: e.target.value })}
                  placeholder="값 (선택 — 나중에 입력 가능)"
                  className="font-mono text-sm h-8"
                  aria-label="변수 값"
                />
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id={`secret-${row.id}`}
                    checked={row.isSecret}
                    onCheckedChange={(checked) => updateRow(row.id, { isSecret: checked as boolean })}
                    className="h-3.5 w-3.5"
                  />
                  <Label htmlFor={`secret-${row.id}`} className="text-[11px] text-muted-foreground">
                    민감한 값 (Secret)
                  </Label>
                  {publicLeak && (
                    <Badge variant="destructive" className="ml-auto gap-1 text-[9px]">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      NEXT_PUBLIC_는 노출됨
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addRow}
            className="w-full border border-dashed text-xs text-muted-foreground"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            변수 추가
          </Button>
        </div>
      </div>

      <DialogFooter className="shrink-0 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button type="button" onClick={handleSave} disabled={saving || validRows.length === 0}>
          {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
          {validRows.length > 0 ? `${validRows.length}개 저장` : '저장'}
        </Button>
      </DialogFooter>
    </>
  );
}
