'use client';

import { Clock, CheckCircle2, Pencil, Plus, Trash2, RotateCcw, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useConnectionHistory } from '@/lib/queries/connections';
import type { ConnectionStatus } from '@/types';

interface ActionConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
}

const ACTION_CONFIG: Record<string, ActionConfig> = {
  'connection.create':             { label: '연결 생성',  icon: <Plus className="h-3 w-3" />,          color: 'text-green-500' },
  'connection.auto_create':        { label: '자동 연결',  icon: <Zap className="h-3 w-3" />,           color: 'text-purple-500' },
  'connection.update':             { label: '연결 수정',  icon: <Pencil className="h-3 w-3" />,        color: 'text-blue-500' },
  'connection.verify':             { label: '상태 검증',  icon: <CheckCircle2 className="h-3 w-3" />,  color: 'text-brand-blue' },
  'connection.restore':            { label: '복원',       icon: <RotateCcw className="h-3 w-3" />,     color: 'text-green-500' },
  'connection.delete':             { label: '삭제',       icon: <Trash2 className="h-3 w-3" />,        color: 'text-red-500' },
  'connection.permanently_delete': { label: '영구 삭제',  icon: <Trash2 className="h-3 w-3" />,        color: 'text-red-700' },
};

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  active: '활성', inactive: '비활성', error: '오류', pending: '대기중',
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - d.getTime()) / 60_000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}일 전`;
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function getActionSuffix(action: string, details: Record<string, unknown>): string {
  if (action === 'connection.verify' && details.new_status) {
    const st = details.new_status as string;
    return `→ ${STATUS_LABEL[st as ConnectionStatus] ?? st}`;
  }
  if (action === 'connection.update' && details.connection_type) {
    return `유형: ${details.connection_type}`;
  }
  return '';
}

interface ConnectionHistoryRowProps {
  connectionId: string;
  colSpan: number;
}

export function ConnectionHistoryRow({ connectionId, colSpan }: ConnectionHistoryRowProps) {
  const { data: history, isLoading } = useConnectionHistory(connectionId);

  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-2.5 bg-muted/20 border-b">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground shrink-0 mr-1">이력</span>

          {isLoading ? (
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-24 rounded-md" />
              ))}
            </div>
          ) : !history || history.length === 0 ? (
            <span className="text-xs text-muted-foreground/60">아직 기록된 이력이 없습니다</span>
          ) : (
            <div className="flex items-center gap-1 overflow-x-auto">
              {history.map((entry, idx) => {
                const cfg = ACTION_CONFIG[entry.action] ?? {
                  label: entry.action,
                  icon: <Clock className="h-3 w-3" />,
                  color: 'text-muted-foreground',
                };
                const suffix = getActionSuffix(entry.action, entry.details ?? {});
                return (
                  <div key={entry.id} className="flex items-center gap-1 shrink-0">
                    <div className="flex items-center gap-1 text-xs bg-background border rounded-md px-2 py-1">
                      <span className={cfg.color}>{cfg.icon}</span>
                      <span className="font-medium">{cfg.label}</span>
                      {suffix && <span className="text-muted-foreground">{suffix}</span>}
                      <span className="text-muted-foreground/60 ml-0.5">{formatTime(entry.created_at)}</span>
                    </div>
                    {idx < history.length - 1 && (
                      <span className="text-muted-foreground/30 text-xs">·</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
