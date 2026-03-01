'use client';

import Link from 'next/link';
import { Rocket, Globe, ExternalLink, ChevronRight, Pencil, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { HomepageDeploy } from '@/lib/queries/oneclick';
import { cn } from '@/lib/utils';

interface OneclickSidePanelProps {
  deployments: HomepageDeploy[];
}

const MAX_VISIBLE = 4;

function StatusDot({ status }: { status: HomepageDeploy['deploy_status'] }) {
  const isBuilding = status === 'building' || status === 'creating' || status === 'pending';
  const isError = status === 'error';
  const isReady = status === 'ready';

  return (
    <span
      className={cn(
        'inline-block h-1.5 w-1.5 rounded-full shrink-0',
        isReady && 'bg-green-500',
        isBuilding && 'bg-yellow-500 animate-pulse',
        isError && 'bg-red-500',
        !isReady && !isBuilding && !isError && 'bg-muted-foreground',
      )}
    />
  );
}

function StatusBadge({ status }: { status: HomepageDeploy['deploy_status'] }) {
  const isBuilding = status === 'building' || status === 'creating' || status === 'pending';
  const isError = status === 'error';
  const isReady = status === 'ready';

  if (isBuilding) {
    return (
      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 gap-1 border-yellow-500/30 text-yellow-600 dark:text-yellow-400">
        <Loader2 className="h-2.5 w-2.5 animate-spin" />
        배포 중
      </Badge>
    );
  }
  if (isError) {
    return (
      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 gap-1 border-red-500/30 text-red-600 dark:text-red-400">
        <AlertCircle className="h-2.5 w-2.5" />
        오류
      </Badge>
    );
  }
  if (isReady) {
    return (
      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 gap-1 border-green-500/30 text-green-600 dark:text-green-400">
        <StatusDot status={status} />
        게시됨
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground">
      준비 중
    </Badge>
  );
}

export function OneclickSidePanel({ deployments }: OneclickSidePanelProps) {
  const visible = deployments.slice(0, MAX_VISIBLE);
  const remaining = deployments.length - MAX_VISIBLE;

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-1.5">
            <Rocket className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold">원클릭 배포</span>
        </div>
        {deployments.length > 0 && (
          <Link
            href="/sites/manage"
            className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
          >
            전체보기
            <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 p-3 space-y-2">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <div className="rounded-xl bg-muted/50 p-3">
              <Globe className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">배포된 사이트 없음</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                원클릭으로 사이트를 배포해보세요
              </p>
            </div>
          </div>
        ) : (
          visible.map((deploy) => (
            <div
              key={deploy.id}
              className="group rounded-lg border border-border/40 bg-background/50 px-3 py-2.5 hover:border-primary/20 hover:bg-primary/5 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <StatusDot status={deploy.deploy_status} />
                    <p className="text-xs font-medium truncate">{deploy.site_name}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {deploy.homepage_templates?.name_ko ?? deploy.homepage_templates?.name ?? '템플릿'}
                  </p>
                </div>
                <StatusBadge status={deploy.deploy_status} />
              </div>

              {/* Actions */}
              {deploy.deploy_status === 'ready' && (
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/30">
                  {deploy.pages_url && (
                    <a
                      href={deploy.pages_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      방문
                    </a>
                  )}
                  <Link
                    href={`/sites/${deploy.id}/edit`}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors ml-auto"
                  >
                    <Pencil className="h-3 w-3" />
                    편집
                  </Link>
                </div>
              )}
            </div>
          ))
        )}

        {remaining > 0 && (
          <Link
            href="/sites/manage"
            className="flex items-center justify-center gap-1 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            +{remaining}개 더 보기
            <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-3 pb-3 pt-1 border-t border-border/40 mt-1">
        <Button asChild size="sm" className="w-full h-8 text-xs gap-1.5">
          <Link href="/sites/new">
            <Rocket className="h-3.5 w-3.5" />
            새 사이트 배포
          </Link>
        </Button>
      </div>
    </div>
  );
}
