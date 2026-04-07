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
import { MfaTotpInput } from './mfa-totp-input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MfaChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
  onRecovery?: () => void;
}

export function MfaChallengeDialog({ open, onOpenChange, onVerified, onRecovery }: MfaChallengeDialogProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const factor = factors?.totp?.find((f) => f.status === 'verified');
      if (!factor) {
        toast.error('등록된 인증 수단을 찾을 수 없습니다');
        return;
      }

      const res = await fetch('/api/account/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factorId: factor.id, code }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setCode('');
      onOpenChange(false);
      onVerified();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '인증 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async () => {
    if (!recoveryCode.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/account/mfa/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: recoveryCode.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      toast.success('복구 코드로 인증되었습니다. 2단계 인증이 해제되었습니다.');
      setRecoveryCode('');
      setShowRecovery(false);
      onOpenChange(false);
      onRecovery?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '복구 코드 인증 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (o: boolean) => {
    if (!o) {
      setCode('');
      setRecoveryCode('');
      setShowRecovery(false);
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>2단계 인증</DialogTitle>
          <DialogDescription>
            {showRecovery
              ? '복구 코드를 입력하세요. 사용 후 2단계 인증이 해제됩니다.'
              : '보안을 위해 인증 앱의 6자리 코드를 입력해주세요.'}
          </DialogDescription>
        </DialogHeader>

        {showRecovery ? (
          <div className="py-4">
            <input
              type="text"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
              placeholder="xxxx-xxxx"
              className="w-full h-12 text-center text-lg font-mono bg-muted border border-border rounded-md px-3"
              disabled={loading}
            />
          </div>
        ) : (
          <div className="py-4">
            <MfaTotpInput value={code} onChange={setCode} disabled={loading} />
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <div className="flex gap-2 justify-end w-full">
            <Button variant="outline" onClick={() => handleClose(false)} disabled={loading}>
              취소
            </Button>
            {showRecovery ? (
              <Button onClick={handleRecovery} disabled={!recoveryCode.trim() || loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                복구 코드 확인
              </Button>
            ) : (
              <Button onClick={handleVerify} disabled={code.length !== 6 || loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                확인
              </Button>
            )}
          </div>
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground underline text-center"
            onClick={() => setShowRecovery(!showRecovery)}
            disabled={loading}
          >
            {showRecovery ? '인증 앱으로 돌아가기' : '인증 앱에 접근할 수 없나요?'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
