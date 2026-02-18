'use client';

import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserConnection, UserConnectionType, ConnectionStatus } from '@/types';

interface ConnectionPopoverProps {
  connection: UserConnection;
  onUpdate: (params: { id: string; connection_type?: UserConnectionType; connection_status?: ConnectionStatus; label?: string | null; description?: string | null }) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const TYPE_LABELS: Record<UserConnectionType, string> = {
  uses: '사용',
  integrates: '통합',
  data_transfer: '데이터 전송',
  api_call: 'API 호출',
  auth_provider: '인증 제공',
  webhook: '웹훅',
  sdk: 'SDK',
};

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  active: '활성',
  inactive: '비활성',
  error: '오류',
  pending: '대기',
};

export function ConnectionPopover({ connection, onUpdate, onDelete, onClose }: ConnectionPopoverProps) {
  const [type, setType] = useState<UserConnectionType>(connection.connection_type);
  const [status, setStatus] = useState<ConnectionStatus>(connection.connection_status);
  const [description, setDescription] = useState(connection.description ?? '');
  const [confirming, setConfirming] = useState(false);

  const hasChanges =
    type !== connection.connection_type ||
    status !== connection.connection_status ||
    description !== (connection.description ?? '');

  return (
    <div className="absolute z-50 w-72 rounded-lg border bg-popover p-3 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold">연결 편집</h4>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Connection type */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">연결 유형</label>
          <Select value={type} onValueChange={(v) => setType(v as UserConnectionType)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(TYPE_LABELS) as [UserConnectionType, string][]).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Connection status */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">상태</label>
          <Select value={status} onValueChange={(v) => setStatus(v as ConnectionStatus)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(STATUS_LABELS) as [ConnectionStatus, string][]).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="연결에 대한 메모..."
            rows={2}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            maxLength={500}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          {confirming ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-destructive">삭제할까요?</span>
              <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => onDelete(connection.id)}>
                확인
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setConfirming(false)}>
                취소
              </Button>
            </div>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-destructive hover:text-destructive"
                onClick={() => setConfirming(true)}
              >
                <Trash2 className="mr-1 h-3 w-3" />
                삭제
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs"
                disabled={!hasChanges}
                onClick={() => {
                  onUpdate({
                    id: connection.id,
                    connection_type: type,
                    connection_status: status,
                    description: description || null,
                  });
                  onClose();
                }}
              >
                저장
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
