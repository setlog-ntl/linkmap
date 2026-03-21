'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { UserConnectionType } from '@/types';

/** Connection type config with smart inference metadata */
const connectionTypes: {
  value: UserConnectionType;
  label: string;
  desc: string;
  color: string;
  icon: string;
}[] = [
  { value: 'uses',          label: '사용',       desc: '이 서비스를 사용합니다', color: '#3b82f6', icon: '→' },
  { value: 'api_call',      label: 'API 호출',   desc: 'API를 호출합니다', color: '#8b5cf6', icon: '⚡' },
  { value: 'data_transfer', label: '데이터 전달', desc: '데이터를 전송합니다', color: '#f97316', icon: '↔' },
  { value: 'integrates',    label: '연동',       desc: '양방향으로 통합됩니다', color: '#22c55e', icon: '⇄' },
];

/** Smart type inference based on service category combinations */
const CATEGORY_INFERENCE: Record<string, Record<string, UserConnectionType>> = {
  database:   { _default: 'uses' },
  auth:       { _default: 'integrates' },
  payment:    { _default: 'api_call' },
  storage:    { _default: 'data_transfer' },
  email:      { _default: 'api_call' },
  sms:        { _default: 'api_call' },
  push:       { _default: 'api_call' },
  analytics:  { _default: 'data_transfer' },
  monitoring: { _default: 'integrates' },
  cdn:        { _default: 'uses' },
  deploy:     { _default: 'integrates' },
  cicd:       { _default: 'integrates' },
  queue:      { _default: 'data_transfer' },
  cache:      { _default: 'uses' },
};

function inferConnectionType(
  sourceCategory?: string,
  targetCategory?: string,
): { type: UserConnectionType; confidence: number } {
  // Target category-based inference
  if (targetCategory && CATEGORY_INFERENCE[targetCategory]) {
    return {
      type: CATEGORY_INFERENCE[targetCategory]._default,
      confidence: 0.8,
    };
  }
  // Source category-based inference
  if (sourceCategory && CATEGORY_INFERENCE[sourceCategory]) {
    return {
      type: CATEGORY_INFERENCE[sourceCategory]._default,
      confidence: 0.6,
    };
  }
  return { type: 'uses', confidence: 0.5 };
}

interface ConnectionTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (type: UserConnectionType) => void;
  sourceLabel?: string;
  targetLabel?: string;
  sourceCategory?: string;
  targetCategory?: string;
}

export function ConnectionTypeDialog({
  open,
  onOpenChange,
  onConfirm,
  sourceLabel,
  targetLabel,
  sourceCategory,
  targetCategory,
}: ConnectionTypeDialogProps) {
  const inferred = useMemo(
    () => inferConnectionType(sourceCategory, targetCategory),
    [sourceCategory, targetCategory],
  );
  const [selected, setSelected] = useState<UserConnectionType>(inferred.type);

  // Reset selection when dialog opens with new inference
  const [lastInferred, setLastInferred] = useState(inferred.type);
  if (inferred.type !== lastInferred) {
    setSelected(inferred.type);
    setLastInferred(inferred.type);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden">
        {/* Header with PCB trace visual */}
        <div className="px-5 pt-5 pb-3">
          <DialogHeader>
            <DialogTitle className="text-base">연결 타입 선택</DialogTitle>
            <DialogDescription className="sr-only">두 서비스 간 연결 유형을 선택합니다</DialogDescription>
            {sourceLabel && targetLabel && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span className="font-medium text-foreground truncate max-w-[120px]">{sourceLabel}</span>
                <svg width="24" height="12" viewBox="0 0 24 12" className="flex-shrink-0">
                  <line x1="0" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <polygon points="18,3 24,6 18,9" fill="currentColor" opacity="0.7" />
                </svg>
                <span className="font-medium text-foreground truncate max-w-[120px]">{targetLabel}</span>
              </div>
            )}
          </DialogHeader>
        </div>

        {/* Connection type options */}
        <div className="px-5 space-y-1.5">
          {connectionTypes.map((ct) => {
            const isInferred = ct.value === inferred.type;
            return (
              <button
                key={ct.value}
                type="button"
                onClick={() => setSelected(ct.value)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg border p-2.5 text-left transition-all hover:bg-accent/50',
                  selected === ct.value && 'border-primary bg-primary/5 shadow-sm',
                )}
              >
                {/* Type color indicator */}
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-sm flex-shrink-0"
                  style={{
                    backgroundColor: `${ct.color}15`,
                    color: ct.color,
                  }}
                >
                  {ct.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{ct.label}</span>
                    {isInferred && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        추천
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{ct.desc}</div>
                </div>
                {/* Selection indicator */}
                {selected === ct.value && (
                  <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <DialogFooter className="px-5 py-4">
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
