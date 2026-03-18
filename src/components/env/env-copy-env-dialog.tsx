'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2, AlertTriangle, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useProjects } from '@/lib/queries/projects';
import { useEnvVars } from '@/lib/queries/env-vars';
import type { Environment, EnvironmentVariable } from '@/types';

type CopyTarget = 'same-project' | 'other-project';

interface EnvCopyEnvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName?: string;
  sourceEnv: Environment;
  envVars: EnvironmentVariable[];
  onCopied: () => void;
}

const envLabels: Record<Environment, string> = {
  development: '개발',
  staging: '스테이징',
  production: '프로덕션',
};

const envOptions: Environment[] = ['development', 'staging', 'production'];

export function EnvCopyEnvDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
  sourceEnv,
  envVars,
  onCopied,
}: EnvCopyEnvDialogProps) {
  const [copyTarget, setCopyTarget] = useState<CopyTarget>('same-project');
  const [targetProjectId, setTargetProjectId] = useState<string>('');
  const [targetEnv, setTargetEnv] = useState<Environment | ''>('');
  const [overwrite, setOverwrite] = useState(false);
  const [copying, setCopying] = useState(false);

  // 다른 프로젝트 목록 로드
  const { data: projects = [] } = useProjects();

  // 다른 프로젝트의 변수 로드 (타겟 프로젝트 선택 시)
  const { data: targetProjectEnvVars = [] } = useEnvVars(
    copyTarget === 'other-project' ? targetProjectId : ''
  );

  // 다이얼로그 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setCopyTarget('same-project');
      setTargetProjectId('');
      setTargetEnv('');
      setOverwrite(false);
    }
  }, [open]);

  // 같은 프로젝트에서 선택 가능한 환경
  const availableEnvs = useMemo(() => {
    if (copyTarget === 'same-project') {
      return envOptions.filter((e) => e !== sourceEnv);
    }
    return envOptions;
  }, [copyTarget, sourceEnv]);

  // 현재 프로젝트 제외 목록
  const otherProjects = useMemo(
    () => projects.filter((p) => p.id !== projectId),
    [projects, projectId]
  );

  // 소스 변수
  const sourceVars = useMemo(
    () => envVars.filter((v) => v.environment === sourceEnv),
    [envVars, sourceEnv]
  );

  // 타겟 변수 (같은 프로젝트 vs 다른 프로젝트)
  const targetVars = useMemo(() => {
    if (!targetEnv) return [];
    if (copyTarget === 'same-project') {
      return envVars.filter((v) => v.environment === targetEnv);
    }
    return targetProjectEnvVars.filter((v) => v.environment === targetEnv);
  }, [copyTarget, envVars, targetProjectEnvVars, targetEnv]);

  const targetKeySet = useMemo(
    () => new Set(targetVars.map((v) => v.key_name)),
    [targetVars]
  );

  const conflictCount = useMemo(
    () => sourceVars.filter((v) => targetKeySet.has(v.key_name)).length,
    [sourceVars, targetKeySet]
  );

  const newCount = useMemo(
    () => sourceVars.filter((v) => !targetKeySet.has(v.key_name)).length,
    [sourceVars, targetKeySet]
  );

  const effectiveTargetProjectId = copyTarget === 'same-project' ? projectId : targetProjectId;
  const targetProjectName = copyTarget === 'same-project'
    ? (projectName || '현재 프로젝트')
    : (otherProjects.find((p) => p.id === targetProjectId)?.name || '');

  const canCopy = targetEnv
    && sourceVars.length > 0
    && (copyTarget === 'same-project' || targetProjectId);

  const handleCopy = async () => {
    if (!targetEnv || !effectiveTargetProjectId) return;
    setCopying(true);
    try {
      // 소스 변수 복호화
      const rawRes = await fetch(`/api/env/raw?project_id=${projectId}&environment=${sourceEnv}`);
      if (!rawRes.ok) throw new Error('소스 변수를 불러올 수 없습니다');
      const rawData = await rawRes.json() as { vars: { key: string; value: string }[] };
      const sourceDecrypted = rawData.vars;

      if (sourceDecrypted.length === 0) {
        toast.info('복사할 변수가 없습니다');
        return;
      }

      if (overwrite) {
        const putRes = await fetch('/api/env/raw', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_id: effectiveTargetProjectId,
            environment: targetEnv,
            vars: sourceDecrypted,
          }),
        });
        if (!putRes.ok) throw new Error('변수 복사에 실패했습니다');
        const result = await putRes.json() as { added: number; updated: number; deleted: number };
        const parts: string[] = [];
        if (result.added > 0) parts.push(`${result.added}개 추가`);
        if (result.updated > 0) parts.push(`${result.updated}개 수정`);
        toast.success(`${targetProjectName} · ${envLabels[targetEnv]}로 복사 완료: ${parts.join(', ')}`);
      } else {
        const newVars = sourceDecrypted.filter((v) => !targetKeySet.has(v.key));
        if (newVars.length === 0) {
          toast.info('모든 변수가 이미 대상에 존재합니다');
          return;
        }
        const bulkRes = await fetch('/api/env/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_id: effectiveTargetProjectId,
            variables: newVars.map((v) => ({
              key_name: v.key,
              value: v.value,
              environment: targetEnv,
              is_secret: !v.key.startsWith('NEXT_PUBLIC_'),
              service_id: null,
            })),
          }),
        });
        if (!bulkRes.ok) throw new Error('변수 복사에 실패했습니다');
        toast.success(`${newVars.length}개 변수를 ${targetProjectName} · ${envLabels[targetEnv]}에 추가했습니다`);
      }

      onCopied();
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message || '복사에 실패했습니다');
    } finally {
      setCopying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>환경변수 복사</DialogTitle>
          <DialogDescription>
            현재 환경의 변수를 같은 프로젝트의 다른 환경 또는 다른 프로젝트로 복사합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 복사 대상 선택: 같은 프로젝트 / 다른 프로젝트 */}
          <div className="flex rounded-md border bg-muted/50 p-0.5">
            <button
              type="button"
              onClick={() => { setCopyTarget('same-project'); setTargetProjectId(''); setTargetEnv(''); setOverwrite(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                copyTarget === 'same-project'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              같은 프로젝트
            </button>
            <button
              type="button"
              onClick={() => { setCopyTarget('other-project'); setTargetEnv(''); setOverwrite(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                copyTarget === 'other-project'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              다른 프로젝트
            </button>
          </div>

          {/* 소스 표시 */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">소스:</span>
            <Badge variant="outline" className="font-medium">
              {projectName || '현재 프로젝트'} · {envLabels[sourceEnv]}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {sourceVars.length}개
            </Badge>
          </div>

          {/* 다른 프로젝트 선택 */}
          {copyTarget === 'other-project' && (
            <div className="space-y-2">
              <Label className="text-sm">대상 프로젝트</Label>
              <Select value={targetProjectId} onValueChange={(v) => { setTargetProjectId(v); setTargetEnv(''); setOverwrite(false); }}>
                <SelectTrigger>
                  <SelectValue placeholder="프로젝트를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {otherProjects.length === 0 ? (
                    <SelectItem value="__empty__" disabled>
                      다른 프로젝트가 없습니다
                    </SelectItem>
                  ) : (
                    otherProjects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 대상 환경 선택 */}
          <div className="space-y-2">
            <Label className="text-sm flex items-center gap-2">
              대상 환경
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
            </Label>
            <Select
              value={targetEnv}
              onValueChange={(v) => { setTargetEnv(v as Environment); setOverwrite(false); }}
              disabled={copyTarget === 'other-project' && !targetProjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="환경을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {availableEnvs.map((env) => (
                  <SelectItem key={env} value={env}>
                    {envLabels[env]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 통계 */}
          {targetEnv && canCopy && (
            <div className="rounded-lg border p-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">소스 변수</span>
                <span className="font-medium">{sourceVars.length}개</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">대상에 이미 존재</span>
                <span className="font-medium">{conflictCount}개</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600 dark:text-emerald-400">새로 추가될 변수</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{newCount}개</span>
              </div>
            </div>
          )}

          {/* 덮어쓰기 옵션 */}
          {targetEnv && conflictCount > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overwrite"
                  checked={overwrite}
                  onCheckedChange={(checked) => setOverwrite(checked as boolean)}
                />
                <Label htmlFor="overwrite" className="text-sm">
                  기존 변수 덮어쓰기 ({conflictCount}개 충돌)
                </Label>
              </div>
              {overwrite && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/5 p-3">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive">
                    대상의 기존 값이 소스 값으로 교체됩니다.
                    {targetEnv === 'production' && ' 프로덕션 환경이므로 주의하세요.'}
                    {copyTarget === 'other-project' && ' 다른 프로젝트의 변수가 변경됩니다.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handleCopy}
            disabled={copying || !canCopy}
          >
            {copying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {overwrite
              ? '복사 및 덮어쓰기'
              : newCount > 0
                ? `${newCount}개 변수 복사`
                : '변수 복사'
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
