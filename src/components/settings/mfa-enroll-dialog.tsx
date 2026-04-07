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
import { MfaRecoveryCodesDialog } from './mfa-recovery-codes-dialog';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface MfaEnrollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface EnrollData {
  factorId: string;
  qrCode: string;
  secret: string;
}

export function MfaEnrollDialog({ open, onOpenChange, onSuccess }: MfaEnrollDialogProps) {
  const [step, setStep] = useState<'qr' | 'verify'>('qr');
  const [enrollData, setEnrollData] = useState<EnrollData | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);

  const handleOpen = async (isOpen: boolean) => {
    if (isOpen && !enrollData) {
      setLoading(true);
      try {
        const res = await fetch('/api/account/mfa/enroll', { method: 'POST' });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error);
        }
        const data = await res.json();
        setEnrollData(data);
        setStep('qr');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'MFA 등록 시작 실패');
        onOpenChange(false);
        return;
      } finally {
        setLoading(false);
      }
    }
    if (!isOpen) {
      setEnrollData(null);
      setStep('qr');
      setCode('');
    }
    onOpenChange(isOpen);
  };

  const handleVerify = async () => {
    if (!enrollData || code.length !== 6) return;
    setLoading(true);
    try {
      const res = await fetch('/api/account/mfa/verify-enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factorId: enrollData.factorId, code }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      const data = await res.json();
      setRecoveryCodes(data.recoveryCodes);
      toast.success('2단계 인증이 활성화되었습니다');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '인증 코드 검증 실패');
    } finally {
      setLoading(false);
    }
  };

  if (recoveryCodes) {
    return (
      <MfaRecoveryCodesDialog
        open={true}
        codes={recoveryCodes}
        onClose={() => {
          setRecoveryCodes(null);
          onOpenChange(false);
          onSuccess();
        }}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>2단계 인증 설정</DialogTitle>
          <DialogDescription>
            {step === 'qr'
              ? '인증 앱(Google Authenticator, 1Password 등)으로 QR 코드를 스캔하세요.'
              : '인증 앱에 표시된 6자리 코드를 입력하세요.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'qr' && enrollData && (
          <div className="space-y-4">
            <div className="flex justify-center bg-white rounded-lg p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={enrollData.qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">QR 코드를 스캔할 수 없는 경우, 아래 키를 직접 입력하세요:</p>
              <code className="block text-xs bg-muted px-3 py-2 rounded-md break-all font-mono select-all">
                {enrollData.secret}
              </code>
            </div>
          </div>
        )}

        {step === 'verify' && (
          <div className="py-4">
            <MfaTotpInput value={code} onChange={setCode} disabled={loading} />
          </div>
        )}

        <DialogFooter>
          {step === 'qr' ? (
            <Button onClick={() => setStep('verify')} disabled={!enrollData}>
              다음
            </Button>
          ) : (
            <Button onClick={handleVerify} disabled={code.length !== 6 || loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              확인
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
