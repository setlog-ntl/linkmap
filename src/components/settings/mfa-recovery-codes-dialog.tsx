'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

interface MfaRecoveryCodesDialogProps {
  open: boolean;
  codes: string[];
  onClose: () => void;
}

export function MfaRecoveryCodesDialog({ open, codes, onClose }: MfaRecoveryCodesDialogProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(codes.join('\n'));
    toast.success('복구 코드가 클립보드에 복사되었습니다');
  };

  const handleDownload = () => {
    const content = `Linkmap 2FA 복구 코드\n생성일: ${new Date().toLocaleDateString('ko-KR')}\n\n${codes.join('\n')}\n\n각 코드는 한 번만 사용할 수 있습니다.\n안전한 곳에 보관하세요.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linkmap-recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>복구 코드를 안전하게 보관하세요</DialogTitle>
          <DialogDescription>
            인증 앱에 접근할 수 없을 때 이 코드로 로그인할 수 있습니다. 각 코드는 한 번만 사용 가능하며, 이 화면을 닫으면 다시 볼 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 bg-muted rounded-lg p-4">
          {codes.map((code) => (
            <code key={code} className="text-sm font-mono text-center py-1">
              {code}
            </code>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            복사
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            다운로드
          </Button>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>코드를 저장했습니다</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
