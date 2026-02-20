'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  ExternalLink,
  Github,
  Globe,
  LayoutDashboard,
  Loader2,
  Pencil,
} from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import Link from 'next/link';
import type { DeployStatus, HomepageTemplate } from '@/lib/queries/oneclick';

interface DeploySuccessProps {
  status: DeployStatus;
  projectId: string | null;
  template?: HomepageTemplate | null;
}

export function DeploySuccess({ status, projectId, template }: DeploySuccessProps) {
  const { locale } = useLocaleStore();
  const liveUrl = status.pages_url || status.deployment_url;

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  return (
    <>
      <Card className="border-green-300 dark:border-green-700 bg-gradient-to-b from-green-50/80 to-white dark:from-green-950/30 dark:to-background shadow-lg">
        <CardContent className="py-8 space-y-6">
          {/* Live preview area */}
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-full max-w-sm">
              {liveUrl ? (
                <div
                  className="relative w-full overflow-hidden rounded-xl border bg-muted/30 shadow-md"
                  style={{ height: '200px' }}
                >
                  {/* Scaled iframe */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <iframe
                      src={liveUrl}
                      title="Site preview"
                      className="absolute top-0 left-0 border-0"
                      style={{
                        width: '1280px',
                        height: '800px',
                        transform: 'scale(0.25)',
                        transformOrigin: 'top left',
                      }}
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      onLoad={() => setIframeLoaded(true)}
                      onError={() => setIframeError(true)}
                    />
                  </div>

                  {/* Loading spinner */}
                  {!iframeLoaded && !iframeError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  )}

                  {/* Iframe error fallback */}
                  {iframeError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted gap-2">
                      <Globe className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {locale === 'ko' ? '미리보기를 불러올 수 없습니다' : 'Preview unavailable'}
                      </span>
                    </div>
                  )}

                  {/* Completion check overlay */}
                  <div className="absolute -bottom-3 -right-3 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg z-10">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                </div>
              ) : (
                /* Fallback: no URL */
                <div className="relative h-48 rounded-xl bg-muted/50 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
              )}
            </div>

            <div className="space-y-1 pt-1">
              {template && (
                <p className="text-sm text-muted-foreground">
                  {locale === 'ko' ? template.name_ko : template.name}
                </p>
              )}
              <h3 className="text-xl font-semibold">
                {t(locale, 'deployProgress.siteReady')}
              </h3>
            </div>

            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline font-mono text-sm"
              >
                {liveUrl.replace('https://', '')}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          {/* 2x2 Action grid */}
          <div className="grid grid-cols-2 gap-3">
            {liveUrl && (
              <ActionCard
                href={liveUrl}
                icon={<ExternalLink className="h-5 w-5" />}
                label={t(locale, 'deployProgress.visitSite')}
                desc={t(locale, 'deployProgress.visitSiteDesc')}
                external
              />
            )}
            <ActionCard
              href={`/my-sites/${status.deploy_id}/edit`}
              icon={<Pencil className="h-5 w-5" />}
              label={t(locale, 'deployProgress.editSite')}
              desc={t(locale, 'deployProgress.editSiteDesc')}
            />
            {status.forked_repo_url && (
              <ActionCard
                href={status.forked_repo_url}
                icon={<Github className="h-5 w-5" />}
                label={t(locale, 'deployProgress.githubRepo')}
                desc={t(locale, 'deployProgress.githubRepoDesc')}
                external
              />
            )}
            {projectId && (
              <ActionCard
                href={`/project/${projectId}`}
                icon={<LayoutDashboard className="h-5 w-5" />}
                label={t(locale, 'deployProgress.dashboard')}
                desc={t(locale, 'deployProgress.dashboardDesc')}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="link" asChild className="text-muted-foreground">
          <Link href="/my-sites">
            {t(locale, 'deployProgress.manageSites')}
          </Link>
        </Button>
      </div>
    </>
  );
}

function ActionCard({
  href,
  icon,
  label,
  desc,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc?: string;
  external?: boolean;
}) {
  const inner = (
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
      <CardContent className="py-4 px-3 flex flex-col items-center gap-1.5 text-center">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
        {desc && (
          <span className="text-xs text-muted-foreground leading-tight">{desc}</span>
        )}
      </CardContent>
    </Card>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return <Link href={href}>{inner}</Link>;
}
