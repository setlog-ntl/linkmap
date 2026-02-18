'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import type { Environment } from '@/types';

const envLabels: Record<Environment, string> = {
  development: '개발',
  staging: '스테이징',
  production: '프로덕션',
};

interface ConflictResolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyName: string;
  sourceEnv: Environment;
  targetEnvs: Environment[];
  action: 'copy' | 'delete';
  onConfirm: () => void;
  isPending: boolean;
}

export function ConflictResolutionDialog({
  open,
  onOpenChange,
  keyName,
  sourceEnv,
  targetEnvs,
  action,
  onConfirm,
  isPending,
}: ConflictResolutionDialogProps) {
  const hasProduction = targetEnvs.includes('production');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>충돌 해결 확인</DialogTitle>
          <DialogDescription>
            다음 작업을 수행합니다. 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-sm">
              <code className="font-mono font-medium">{keyName}</code>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {action === 'copy'
                ? `${envLabels[sourceEnv]} 환경의 값을 ${targetEnvs.map((e) => envLabels[e]).join(', ')} 환경에 복사합니다`
                : `${targetEnvs.map((e) => envLabels[e]).join(', ')} 환경에서 삭제합니다`}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {targetEnvs.map((env) => (
              <Badge key={env} variant="outline">
                {envLabels[env]}
              </Badge>
            ))}
          </div>

          {hasProduction && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">
                프로덕션 환경이 영향을 받습니다. 신중하게 진행하세요.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            취소
          </Button>
          <Button
            variant={hasProduction ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? '처리 중...' : '확인'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
