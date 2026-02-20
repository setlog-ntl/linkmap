'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ExternalLink, Github, LayoutDashboard } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import Link from 'next/link';
import type { DeployStatus } from '@/lib/queries/oneclick';

interface DeploySuccessProps {
  status: DeployStatus;
  projectId: string | null;
}

export function DeploySuccess({ status, projectId }: DeploySuccessProps) {
  const { locale } = useLocaleStore();
  const liveUrl = status.pages_url || status.deployment_url;

  return (
    <>
      <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="py-6 space-y-4">
          <div className="text-center space-y-2">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">
              {locale === 'ko' ? '홈페이지가 배포되었습니다!' : 'Your homepage is live!'}
            </h3>
          </div>

          {liveUrl && (
            <div className="text-center">
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline text-lg font-mono"
              >
                {liveUrl.replace('https://', '')}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {liveUrl && (
              <Button asChild>
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {locale === 'ko' ? '사이트 방문' : 'Visit Site'}
                </a>
              </Button>
            )}
            {status.forked_repo_url && (
              <Button variant="outline" asChild>
                <a href={status.forked_repo_url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  {locale === 'ko' ? 'GitHub 레포' : 'GitHub Repo'}
                </a>
              </Button>
            )}
            {projectId && (
              <Button variant="outline" asChild>
                <Link href={`/project/${projectId}`}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {locale === 'ko' ? '프로젝트 관리' : 'Manage Project'}
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/my-sites">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {locale === 'ko' ? '내 사이트에서 관리하기' : 'Manage in My Sites'}
          </Link>
        </Button>
      </div>
    </>
  );
}
