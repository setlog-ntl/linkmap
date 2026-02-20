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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { UserConnectionType } from '@/types';

const connectionTypes: { value: UserConnectionType; label: string; desc: string }[] = [
  { value: 'uses',          label: '사용',       desc: '이 서비스를 사용합니다' },
  { value: 'integrates',    label: '연동',       desc: '양방향으로 통합됩니다' },
  { value: 'data_transfer', label: '데이터 전달', desc: '데이터를 전송합니다' },
  { value: 'api_call',      label: 'API 호출',   desc: 'API를 호출합니다' },
  { value: 'auth_provider', label: '인증 제공',   desc: '인증을 위임합니다' },
  { value: 'webhook',       label: '웹훅',       desc: '이벤트를 전달합니다' },
  { value: 'sdk',           label: 'SDK',        desc: 'SDK를 통해 연결합니다' },
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
              {sourceLabel} → {targetLabel}
            </p>
          )}
        </DialogHeader>

        <RadioGroup value={selected} onValueChange={(v) => setSelected(v as UserConnectionType)} className="space-y-2">
          {connectionTypes.map((ct) => (
            <div key={ct.value} className="flex items-center space-x-3 rounded-md border p-2.5 hover:bg-accent/50 transition-colors">
              <RadioGroupItem value={ct.value} id={ct.value} />
              <Label htmlFor={ct.value} className="flex-1 cursor-pointer">
                <div className="text-sm font-medium">{ct.label}</div>
                <div className="text-xs text-muted-foreground">{ct.desc}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>

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
