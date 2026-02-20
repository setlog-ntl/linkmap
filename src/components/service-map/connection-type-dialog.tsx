'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { UserConnectionType } from '@/types';

const connectionTypes: { value: UserConnectionType; label: string; desc: string }[] = [
  { value: 'uses',          label: '사용',       desc: '이 서비스를 사용합니다' },
  { value: 'api_call',      label: 'API 호출',   desc: 'API를 호출합니다' },
  { value: 'data_transfer', label: '데이터 전달', desc: '데이터를 전송합니다' },
  { value: 'integrates',    label: '연동',       desc: '양방향으로 통합됩니다' },
];

interface ConnectionTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (type: UserConnectionType) => void;
  sourceLabel?: string;
  targetLabel?: string;
}

export function ConnectionTypeDialog({
  open,
  onOpenChange,
  onConfirm,
  sourceLabel,
  targetLabel,
}: ConnectionTypeDialogProps) {
  const [selected, setSelected] = useState<UserConnectionType>('uses');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle className="text-base">연결 타입 선택</DialogTitle>
          {sourceLabel && targetLabel && (
            <p className="text-sm text-muted-foreground">
              {sourceLabel} &rarr; {targetLabel}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-1.5">
          {connectionTypes.map((ct) => (
            <button
              key={ct.value}
              type="button"
              onClick={() => setSelected(ct.value)}
              className={cn(
                'w-full flex flex-col items-start rounded-md border p-2.5 text-left transition-colors hover:bg-accent/50',
                selected === ct.value && 'border-primary bg-primary/5'
              )}
            >
              <div className="text-sm font-medium">{ct.label}</div>
              <div className="text-xs text-muted-foreground">{ct.desc}</div>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onConfirm(selected);
              onOpenChange(false);
            }}
          >
            연결
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
