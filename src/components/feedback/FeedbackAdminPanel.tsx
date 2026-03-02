'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateFeedbackStatus } from '@/lib/queries/feedback';
import type { FeatureRequestStatus } from '@/types/feedback';

interface FeedbackAdminPanelProps {
  id: string;
  currentStatus: FeatureRequestStatus;
  currentAdminNote: string | null;
}

const STATUS_OPTIONS: { value: FeatureRequestStatus; label: string }[] = [
  { value: 'pending', label: '검토 대기' },
  { value: 'in_review', label: '검토 중' },
  { value: 'planned', label: '계획됨' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'completed', label: '완료' },
  { value: 'rejected', label: '거절됨' },
];

export function FeedbackAdminPanel({ id, currentStatus, currentAdminNote }: FeedbackAdminPanelProps) {
  const [status, setStatus] = useState<FeatureRequestStatus>(currentStatus);
  const [adminNote, setAdminNote] = useState(currentAdminNote ?? '');

  const { mutate: updateStatus, isPending } = useUpdateFeedbackStatus();

  const handleSave = () => {
    updateStatus(
      { id, status, admin_note: adminNote || null },
      {
        onSuccess: () => toast.success('상태가 업데이트되었습니다'),
        onError: (err) => toast.error(err instanceof Error ? err.message : '업데이트 실패'),
      }
    );
  };

  return (
    <Card className="border-amber-400/40 bg-amber-50/50 dark:bg-amber-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <ShieldCheck className="h-4 w-4" />
          관리자 패널
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>상태 변경</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as FeatureRequestStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>관리자 노트 (공개)</Label>
          <Textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="사용자에게 공개되는 노트를 입력하세요"
            rows={3}
            maxLength={2000}
          />
        </div>

        <Button size="sm" onClick={handleSave} disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </Button>
      </CardContent>
    </Card>
  );
}
