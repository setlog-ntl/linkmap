'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CheckCircle2, Github, ExternalLink, Loader2 } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

interface GitHubAccount {
  id: string;
  provider_account_id: string;
  status: string;
}

interface GitHubConnectModalProps {
  open: boolean;
  onClose: () => void;
  githubAccount: GitHubAccount | null;
  isLoading: boolean;
  onConnected: () => void;
}

export function GitHubConnectModal({
  open,
  onClose,
  githubAccount,
  isLoading,
  onConnected,
}: GitHubConnectModalProps) {
  const { locale } = useLocaleStore();
  const isConnected = githubAccount?.status === 'active';

  const handleConnect = () => {
    window.location.href = '/api/oneclick/oauth/authorize';
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
            <Github className="h-6 w-6" />
          </div>
          <DialogTitle>
            {t(locale, 'githubConnect.title')}
          </DialogTitle>
          <DialogDescription>
            {t(locale, 'githubConnect.modalDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">
                  {githubAccount.provider_account_id}
                </span>
                <Badge variant="secondary">
                  {t(locale, 'githubConnect.connected')}
                </Badge>
              </div>
              <Button onClick={onConnected} size="lg" className="w-full">
                {t(locale, 'githubConnect.proceedDeploy')}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button onClick={handleConnect} size="lg" className="w-full gap-2">
                <Github className="h-4 w-4" />
                {t(locale, 'githubConnect.connectButton')}
              </Button>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <ExternalLink className="h-3 w-3" />
                {t(locale, 'githubConnect.redirectNotice')}
              </p>
              {/* GitHub 미보유 초급 사용자 안내 — 게이트에서 막히지 않도록 가입 경로 제공 (2026-06-12 E2E A-4/A-5) */}
              <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground space-y-1.5">
                <p>
                  GitHub 계정이 없으신가요?{' '}
                  <a
                    href="/guides/github"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline"
                  >
                    가입 가이드 보기
                  </a>{' '}
                  — 무료이며 2~3분이면 만들 수 있어요.
                </p>
                <p className="text-muted-foreground/80">
                  새 기기에서 로그인하면 GitHub이 이메일로 보안 코드를 요청할 수 있어요.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
