'use client';

import { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserConnectionType } from '@/types';

const connectionTypes: {
  value: UserConnectionType;
  label: string;
  color: string;
  icon: string;
}[] = [
  { value: 'uses',          label: '사용',       color: '#3b82f6', icon: '→' },
  { value: 'api_call',      label: 'API 호출',   color: '#8b5cf6', icon: '⚡' },
  { value: 'data_transfer', label: '데이터 전달', color: '#f97316', icon: '↔' },
  { value: 'integrates',    label: '연동',       color: '#22c55e', icon: '⇄' },
  { value: 'auth_provider', label: '인증 제공',   color: '#ec4899', icon: '🔑' },
  { value: 'webhook',       label: '웹훅',       color: '#14b8a6', icon: '🔔' },
  { value: 'sdk',           label: 'SDK',        color: '#6366f1', icon: '📦' },
];

interface EdgeEditPopoverProps {
  edgeId: string;
  connectionId: string;
  currentType: UserConnectionType;
  position: { x: number; y: number };
  onChangeType: (type: UserConnectionType) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function EdgeEditPopover({
  currentType,
  position,
  onChangeType,
  onDelete,
  onClose,
}: EdgeEditPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
        onClose();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-50 bg-card border rounded-lg shadow-lg p-1.5 min-w-[140px]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-8px)',
      }}
    >
      <div className="text-[10px] text-muted-foreground px-2 py-1 font-medium">
        연결 타입 변경
      </div>
      {connectionTypes.map((ct) => (
        <button
          key={ct.value}
          type="button"
          onClick={() => onChangeType(ct.value)}
          className={cn(
            'w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent',
            currentType === ct.value && 'bg-accent font-medium',
          )}
        >
          <span
            className="w-5 h-5 rounded flex items-center justify-center text-[10px] flex-shrink-0"
            style={{ backgroundColor: `${ct.color}18`, color: ct.color }}
          >
            {ct.icon}
          </span>
          <span>{ct.label}</span>
          {currentType === ct.value && (
            <span className="ml-auto text-[9px] text-primary">현재</span>
          )}
        </button>
      ))}
      <div className="border-t my-1" />
      <button
        type="button"
        onClick={onDelete}
        className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-destructive hover:bg-destructive/10 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>연결 삭제</span>
      </button>
    </div>
  );
}
