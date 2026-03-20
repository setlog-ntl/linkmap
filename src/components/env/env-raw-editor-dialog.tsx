'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Loader2, AlertTriangle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { parseEnvContent } from '@/lib/utils/parse-env';
import type { Environment } from '@/types';

interface RawEnvVar {
  key: string;
  value: string;
  id?: string;
  is_secret?: boolean;
  service_id?: string | null;
}

interface EnvRawEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  environment: Environment;
  onUpdated: () => void;
}

type EditorFormat = 'env' | 'json';

function varsToEnvFormat(vars: RawEnvVar[]): string {
  return vars.map((v) => `${v.key}="${v.value.replace(/"/g, '\\"')}"`).join('\n');
}

function varsToJsonFormat(vars: RawEnvVar[]): string {
  const obj: Record<string, string> = {};
  for (const v of vars) {
    obj[v.key] = v.value;
  }
  return JSON.stringify(obj, null, 2);
}

function parseJsonToVars(text: string): RawEnvVar[] {
  try {
    const data: unknown = JSON.parse(text);
    if (!data || typeof data !== 'object' || Array.isArray(data)) return [];
    return Object.entries(data as Record<string, unknown>)
      .filter(([k]) => /^[A-Z][A-Z0-9_]*$/.test(k))
      .map(([k, v]) => ({ key: k, value: String(v) }));
  } catch {
    return [];
  }
}

function parseEnvToVars(text: string): RawEnvVar[] {
  return parseEnvContent(text).map((v) => ({ key: v.key, value: v.value }));
}

export function EnvRawEditorDialog({
  open,
  onOpenChange,
  projectId,
  environment,
  onUpdated,
}: EnvRawEditorDialogProps) {
  const [format, setFormat] = useState<EditorFormat>('env');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [originalVars, setOriginalVars] = useState<RawEnvVar[]>([]);

  const envLabel: Record<Environment, string> = {
    development: '개발',
    staging: '스테이징',
    production: '프로덕션',
  };

  // 다이얼로그 열릴 때 현재 변수 로드
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/env/raw?project_id=${projectId}&environment=${environment}`)
      .then((r) => r.json())
      .then((data: { vars?: RawEnvVar[] }) => {
        const vars = data.vars ?? [];
        setOriginalVars(vars);
        setContent(format === 'env' ? varsToEnvFormat(vars) : varsToJsonFormat(vars));
      })
      .catch(() => {
        toast.error('환경변수를 불러오는데 실패했습니다');
      })
      .finally(() => setLoading(false));
    // format은 초기 로드 시에만 사용
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, projectId, environment]);

  // 탭 전환 시 현재 편집 내용을 파싱하고 다른 형식으로 변환
  const handleFormatChange = useCallback((newFormat: string) => {
    const f = newFormat as EditorFormat;
    const currentVars = format === 'env' ? parseEnvToVars(content) : parseJsonToVars(content);
    setFormat(f);
    setContent(f === 'env' ? varsToEnvFormat(currentVars) : varsToJsonFormat(currentVars));
  }, [format, content]);

  // 현재 편집 내용에서 파싱된 변수 수
  const parsedVars = useMemo(() => {
    return format === 'env' ? parseEnvToVars(content) : parseJsonToVars(content);
  }, [format, content]);

  // diff 계산
  const diff = useMemo(() => {
    const originalMap = new Map(originalVars.map((v) => [v.key, v.value]));
    const newMap = new Map(parsedVars.map((v) => [v.key, v.value]));

    let added = 0;
    let changed = 0;
    let removed = 0;

    for (const [key, value] of newMap) {
      if (!originalMap.has(key)) added++;
      else if (originalMap.get(key) !== value) changed++;
    }
    for (const key of originalMap.keys()) {
      if (!newMap.has(key)) removed++;
    }
    return { added, changed, removed, total: added + changed + removed };
  }, [originalVars, parsedVars]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success(`${format === 'env' ? 'ENV' : 'JSON'} 형식으로 복사되었습니다`);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    if (parsedVars.length === 0) return;
    const ext = format === 'env' ? '.env' : '.json';
    const mimeType = format === 'env' ? 'text/plain' : 'application/json';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${environment}${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${environment}${ext} 파일이 다운로드되었습니다`);
  };

  const handleSave = async () => {
    if (diff.total === 0) {
      toast.info('변경사항이 없습니다');
      return;
    }

    setSaving(true);
    try {
      const vars = parsedVars.map((v) => ({ key: v.key, value: v.value }));
      const res = await fetch('/api/env/raw', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, environment, vars }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || '저장에 실패했습니다');
      }

      const result = await res.json() as { added: number; updated: number; deleted: number };
      const parts: string[] = [];
      if (result.added > 0) parts.push(`${result.added}개 추가`);
      if (result.updated > 0) parts.push(`${result.updated}개 수정`);
      if (result.deleted > 0) parts.push(`${result.deleted}개 삭제`);
      toast.success(parts.length > 0 ? `변수 업데이트: ${parts.join(', ')}` : '완료');
      onUpdated();
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message || '변수 업데이트에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85dvh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>일괄 편집</DialogTitle>
          <DialogDescription>
            환경변수를 텍스트로 직접 편집하세요. 추가, 수정, 삭제가 한 번에 반영됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline">{envLabel[environment]}</Badge>
          <Badge variant="secondary" className="text-xs">
            {parsedVars.length}개 변수
          </Badge>
          {diff.total > 0 && (
            <div className="flex items-center gap-1.5 ml-auto text-xs">
              {diff.added > 0 && (
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 text-[10px]">
                  +{diff.added} 추가
                </Badge>
              )}
              {diff.changed > 0 && (
                <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 text-[10px]">
                  ~{diff.changed} 수정
                </Badge>
              )}
              {diff.removed > 0 && (
                <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-300 text-[10px]">
                  -{diff.removed} 삭제
                </Badge>
              )}
            </div>
          )}
        </div>

        <Tabs value={format} onValueChange={handleFormatChange} className="min-h-0">
          <TabsList className="shrink-0">
            <TabsTrigger value="env">ENV</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="env" className="mt-2">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`# 한 줄에 하나의 변수를 입력하세요\nAPI_KEY="sk_live_..."\nDATABASE_URL="postgresql://..."\nNEXT_PUBLIC_APP_URL="https://..."`}
                className="font-mono text-sm min-h-[200px] max-h-[calc(85dvh-320px)] resize-none overflow-y-auto"
                spellCheck={false}
              />
            )}
          </TabsContent>

          <TabsContent value="json" className="mt-2">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`{\n  "API_KEY": "sk_live_...",\n  "DATABASE_URL": "postgresql://..."\n}`}
                className="font-mono text-sm min-h-[200px] max-h-[calc(85dvh-320px)] resize-none overflow-y-auto"
                spellCheck={false}
              />
            )}
          </TabsContent>
        </Tabs>

        {diff.removed > 0 && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/5 p-3 shrink-0">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-destructive">
              {diff.removed}개의 변수가 삭제됩니다. 삭제된 변수는 복구할 수 있습니다.
            </p>
          </div>
        )}

        <DialogFooter className="shrink-0 flex-row justify-between sm:justify-between">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={loading || parsedVars.length === 0}
              className="gap-1.5"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {format === 'env' ? 'ENV' : 'JSON'} 복사
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              disabled={loading || parsedVars.length === 0}
              className="gap-1.5"
            >
              <Download className="h-4 w-4" />
              다운로드
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || loading || diff.total === 0}
              className="min-w-[120px]"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              변수 업데이트
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
