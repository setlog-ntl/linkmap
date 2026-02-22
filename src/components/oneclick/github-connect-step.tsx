'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Github, ExternalLink } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

interface GitHubAccount {
  id: string;
  provider_account_id: string;
  status: string;
}

interface GitHubConnectStepProps {
  githubAccount: GitHubAccount | null;
  isLoading: boolean;
  onNext: () => void;
  onConnected?: () => void;
}

export function GitHubConnectStep({ githubAccount, isLoading, onNext, onConnected }: GitHubConnectStepProps) {
  const { locale } = useLocaleStore();
  const isConnected = githubAccount?.status === 'active';

  const handleConnect = () => {
    // Redirect to oneclick-specific GitHub OAuth flow (no project_id needed)
    window.location.href = '/api/oneclick/oauth/authorize';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-12 rounded-full bg-muted mx-auto" />
            <div className="h-4 w-48 bg-muted mx-auto rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-8">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Github className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              {t(locale, 'githubConnect.title')}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {t(locale, 'githubConnect.desc')}
            </p>
          </div>

          {isConnected ? (
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
              <Button onClick={onConnected || onNext} size="lg">
                {onConnected
                  ? t(locale, 'githubConnect.proceedDeploy')
                  : t(locale, 'common.next')}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button onClick={handleConnect} size="lg" className="gap-2">
                <Github className="h-4 w-4" />
                {t(locale, 'githubConnect.connectButton')}
              </Button>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <ExternalLink className="h-3 w-3" />
                {t(locale, 'githubConnect.redirectNotice')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
