'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ExternalLink, Github, LayoutDashboard, Pencil } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import Link from 'next/link';
import type { DeployStatus, HomepageTemplate } from '@/lib/queries/oneclick';
import { WireframeSVG } from './template-card';

interface DeploySuccessProps {
  status: DeployStatus;
  projectId: string | null;
  template?: HomepageTemplate | null;
}

export function DeploySuccess({ status, projectId, template }: DeploySuccessProps) {
  const { locale } = useLocaleStore();
  const liveUrl = status.pages_url || status.deployment_url;

  return (
    <>
      <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="py-8 space-y-6">
          {/* Template preview + completion check */}
          <div className="text-center space-y-4">
            {template ? (
              <div className="relative mx-auto w-full max-w-xs">
                <div className="h-48 rounded-xl bg-muted/50 flex items-center justify-center overflow-hidden px-8">
                  <WireframeSVG slug={template.slug} />
                </div>
                <div className="absolute -bottom-3 -right-3 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>
            ) : (
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            )}

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
                external
              />
            )}
            {status.forked_repo_url && (
              <ActionCard
                href={status.forked_repo_url}
                icon={<Github className="h-5 w-5" />}
                label={t(locale, 'deployProgress.githubRepo')}
                external
              />
            )}
            <ActionCard
              href="/my-sites"
              icon={<Pencil className="h-5 w-5" />}
              label={t(locale, 'deployProgress.editSite')}
            />
            {projectId && (
              <ActionCard
                href={`/project/${projectId}`}
                icon={<LayoutDashboard className="h-5 w-5" />}
                label={t(locale, 'deployProgress.dashboard')}
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
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}) {
  const inner = (
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
      <CardContent className="py-4 px-3 flex flex-col items-center gap-2 text-center">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
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
