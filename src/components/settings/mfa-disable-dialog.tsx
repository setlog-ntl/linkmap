'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MfaTotpInput } from '@/components/mfa/mfa-totp-input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface MfaDisableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factorId: string;
  onSuccess: () => void;
}

export function MfaDisableDialog({ open, onOpenChange, factorId, onSuccess }: MfaDisableDialogProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDisable = async () => {
    if (code.length !== 6) return;
    setLoading(true);
    try {
      const res = await fetch('/api/account/mfa/unenroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factorId, code }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast.success('2단계 인증이 비활성화되었습니다');
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '해제 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setCode(''); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>2단계 인증 비활성화</DialogTitle>
          <DialogDescription>
            현재 인증 앱에 표시된 6자리 코드를 입력하여 2단계 인증을 해제합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <MfaTotpInput value={code} onChange={setCode} disabled={loading} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleDisable}
            disabled={code.length !== 6 || loading}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            비활성화
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
