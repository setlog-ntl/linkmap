'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ExternalLink, Github, Globe, LayoutDashboard, Loader2, Pencil, RefreshCw, Trash2, Trophy } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { useDeleteDeployment, useRedeployDeployment, type HomepageDeploy } from '@/lib/queries/oneclick';
import { useRegisterShowcase, useUnregisterShowcase } from '@/lib/queries/showcase';
import { ShowcaseRegisterDialog } from '@/components/showcase/showcase-register-dialog';
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ShowcaseCategory } from '@/types/core';

interface DeploySiteCardProps {
  deploy: HomepageDeploy;
}

type GithubBadgeState = 'deploying' | 'loading' | 'refreshing' | 'success' | 'unavailable' | 'error';

const BADGE_CONFIG: Record<GithubBadgeState, { label: string; dotClass: string; pillClass: string }> = {
  deploying: {
    label: '배포 중',
    dotClass: 'bg-amber-500 animate-pulse',
    pillClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  loading: {
    label: '로드 중',
    dotClass: 'bg-blue-500 animate-pulse',
    pillClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  refreshing: {
    label: '최신 버전 확인 중',
    dotClass: 'bg-amber-500 animate-pulse',
    pillClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  success: {
    label: '게시됨',
    dotClass: 'bg-green-500',
    pillClass: 'bg-green-500/10 text-green-600 dark:text-green-400',
  },
  unavailable: {
    label: '준비 중',
    dotClass: 'bg-muted-foreground/40',
    pillClass: 'bg-muted text-muted-foreground',
  },
  error: {
    label: '오류',
    dotClass: 'bg-red-500',
    pillClass: 'bg-red-500/10 text-red-600 dark:text-red-400',
  },
};

export function DeploySiteCard({ deploy }: DeploySiteCardProps) {
  const { locale } = useLocaleStore();
  const deleteMutation = useDeleteDeployment();
  const redeployMutation = useRedeployDeployment();
  const registerShowcase = useRegisterShowcase();
  const unregisterShowcase = useUnregisterShowcase();
  const [open, setOpen] = useState(false);
  const [showcaseDialogOpen, setShowcaseDialogOpen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const liveUrl = deploy.pages_url || deploy.deployment_url;
  const [cacheBuster] = useState(() =>
    deploy.deployed_at ? new Date(deploy.deployed_at).getTime() : Date.now()
  );

  // src 변경 방식: key 변경(재마운트)과 달리 기존 iframe 콘텐츠를 유지하면서
  // 새 URL로 로드 → 재시도 중에도 이전 화면이 그대로 보임.
  const [iframeSrc, setIframeSrc] = useState(liveUrl ? `${liveUrl}?_t=${cacheBuster}` : '');
  const [refreshCount, setRefreshCount] = useState(0);

  // CDN 전파 지연 대응: 미로드 시 30초마다 src 변경으로 재시도 (최대 3회)
  useEffect(() => {
    if (!liveUrl || iframeLoaded || refreshCount >= 3) return;
    if (deploy.deploy_status !== 'ready') return;
    const timer = setTimeout(() => {
      const next = refreshCount + 1;
      setIframeSrc(`${liveUrl}?_r=${next}`);
      setIframeLoaded(false);
      setIframeError(false);
      setRefreshCount(next);
    }, 30_000);
    return () => clearTimeout(timer);
  }, [liveUrl, iframeLoaded, iframeError, refreshCount, deploy.deploy_status]);

  const isDeploying = ['building', 'creating', 'pending'].includes(deploy.deploy_status);

  const badgeState: GithubBadgeState = (() => {
    if (deploy.deploy_status === 'error') return 'error';
    if (isDeploying) return 'deploying';
    if (iframeLoaded) return 'success';
    if (iframeError && refreshCount >= 3) return 'unavailable';
    if (refreshCount > 0) return 'refreshing';
    return 'loading';
  })();

  const badge = BADGE_CONFIG[badgeState];
  // 첫 로드 전에만 스피너 overlay — 재시도 중엔 이전 iframe 화면이 그대로 유지됨
  const showOverlay = refreshCount === 0 && !iframeLoaded && !iframeError && !isDeploying;

  const templateName = deploy.homepage_templates
    ? (locale === 'ko' ? deploy.homepage_templates.name_ko : deploy.homepage_templates.name)
    : null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deploy.id);
      toast.success(t(locale, 'deploySiteCard.siteDeleted'));
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '삭제 실패');
    }
  };

  const handleRedeploy = async () => {
    try {
      await redeployMutation.mutateAsync(deploy.id);
      toast.success('재배포가 시작되었습니다');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '재배포 실패');
    }
  };

  const handleShowcaseClick = () => {
    if (deploy.is_showcase) {
      // 이미 등록됨 → 해제
      unregisterShowcase.mutate(deploy.id, {
        onSuccess: () => toast.success('쇼케이스에서 해제되었습니다'),
        onError: (err) => toast.error(err instanceof Error ? err.message : '쇼케이스 해제 실패'),
      });
    } else {
      // 미등록 → 다이얼로그 열기
      setShowcaseDialogOpen(true);
    }
  };

  const handleShowcaseRegister = (data: {
    description: string;
    tags: string[];
    category: ShowcaseCategory | undefined;
  }) => {
    registerShowcase.mutate(
      {
        deployId: deploy.id,
        description: data.description || undefined,
        tags: data.tags.length > 0 ? data.tags : undefined,
        category: data.category,
      },
      {
        onSuccess: () => {
          toast.success('쇼케이스에 등록되었습니다');
          setShowcaseDialogOpen(false);
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : '쇼케이스 등록 실패'),
      }
    );
  };

  const deployDate = new Date(deploy.created_at).toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  return (
    <Card className="overflow-hidden">
      {/* 미리보기 영역 */}
      {liveUrl ? (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative w-full bg-muted border-b group cursor-pointer"
          style={{ height: '228px' }}
        >
          {/* 미니 브라우저 크롬 바 — URL + GitHub 배포 상태 배지 */}
          <div className="absolute top-0 left-0 right-0 h-7 bg-muted/90 border-b z-20 flex items-center px-2 gap-1.5 rounded-t-[inherit]">
            <div className="flex-1 h-4 bg-background/70 rounded flex items-center gap-1 px-1.5 text-muted-foreground truncate min-w-0">
              <Globe className="h-2 w-2 shrink-0" />
              <span className="text-[8px] font-mono truncate">
                {liveUrl.replace('https://', '')}
              </span>
            </div>
            {/* GitHub 배포 상태 배지 */}
            <div
              className={cn(
                'flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded-full text-[8px] font-medium transition-all duration-500',
                badge.pillClass
              )}
            >
              <Github className={cn('h-2 w-2', isDeploying && 'animate-github-wiggle')} />
              <span className={cn('h-1.5 w-1.5 rounded-full transition-colors duration-500', badge.dotClass)} />
              <span className="whitespace-nowrap">{badge.label}</span>
            </div>
          </div>

          {/* 축소 iframe — 크롬 바 아래 영역 */}
          <div
            className="absolute left-0 right-0 bottom-0 top-7 overflow-hidden pointer-events-none"
            style={{ height: '201px' }}
          >
            <iframe
              src={iframeSrc}
              title={`${deploy.site_name} 미리보기`}
              className={cn(
                'absolute top-0 left-0 border-0 transition-opacity duration-700',
                iframeLoaded ? 'opacity-100' : 'opacity-80'
              )}
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

          {/* 배포 중 플레이스홀더 (iframe 없을 때) — deploying이면서 URL은 있는 케이스 */}
          {isDeploying && !iframeLoaded && (
            <div className="absolute left-0 right-0 bottom-0 top-7 flex flex-col items-center justify-center bg-muted gap-2">
              <span className="relative">
                <Github className="h-6 w-6 text-muted-foreground/60 animate-github-wiggle" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              </span>
              <span className="text-[11px] text-muted-foreground">
                {t(locale, 'deploySiteCard.preparing')}
              </span>
            </div>
          )}

          {/* 첫 로드 시에만 스피너 overlay */}
          {showOverlay && (
            <div className="absolute left-0 right-0 bottom-0 top-7 flex items-center justify-center bg-muted">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* 호버 오버레이 */}
          <div className="absolute inset-0 top-7 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/60 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              {t(locale, 'mySites.visitSite')}
            </span>
          </div>
        </a>
      ) : (
        /* URL 없음: 배포 중 또는 오류 플레이스홀더 */
        <div className="relative w-full bg-muted border-b flex flex-col items-center justify-center gap-2" style={{ height: '228px' }}>
          {/* 미니 크롬 바 */}
          <div className="absolute top-0 left-0 right-0 h-7 bg-muted/90 border-b z-20 flex items-center px-2 gap-1.5">
            <div className="flex-1 h-4 bg-background/70 rounded flex items-center gap-1 px-1.5 text-muted-foreground/50">
              <Globe className="h-2 w-2 shrink-0" />
              <span className="text-[8px] font-mono">준비 중...</span>
            </div>
            <div className={cn('flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded-full text-[8px] font-medium', badge.pillClass)}>
              <Github className={cn('h-2 w-2', isDeploying && 'animate-github-wiggle')} />
              <span className={cn('h-1.5 w-1.5 rounded-full', badge.dotClass)} />
              <span className="whitespace-nowrap">{badge.label}</span>
            </div>
          </div>
          <Globe className="h-10 w-10 text-muted-foreground/40" />
          <span className="text-xs text-muted-foreground">
            {deploy.deploy_status === 'error'
              ? t(locale, 'deploySiteCard.deployError')
              : t(locale, 'deploySiteCard.preparing')}
          </span>
        </div>
      )}

      {/* 카드 정보 */}
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{deploy.site_name}</h3>
            {templateName && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {t(locale, 'mySites.template')}: {templateName}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">
            {deployDate}
          </p>
        </div>

        {/* URL */}
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline truncate block font-mono"
          >
            {liveUrl.replace('https://', '')}
          </a>
        )}

        {/* 액션 버튼 */}
        <div className="flex flex-wrap gap-2 pt-1">
          {liveUrl && (
            <Button size="sm" variant="outline" asChild>
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" />
                {t(locale, 'mySites.visitSite')}
              </a>
            </Button>
          )}
          {deploy.forked_repo_url && (
            <Button size="sm" variant="outline" asChild>
              <a href={deploy.forked_repo_url} target="_blank" rel="noopener noreferrer">
                <Github className="mr-1 h-3 w-3" />
                {t(locale, 'mySites.githubRepo')}
              </a>
            </Button>
          )}
          {deploy.deploy_status === 'ready' && (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/my-sites/${deploy.id}/edit`}>
                <Pencil className="mr-1 h-3 w-3" />
                {t(locale, 'mySites.editSite')}
              </Link>
            </Button>
          )}
          {deploy.project_id && (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/project/${deploy.project_id}`}>
                <LayoutDashboard className="mr-1 h-3 w-3" />
                {t(locale, 'deploySiteCard.manage')}
              </Link>
            </Button>
          )}

          {/* 쇼케이스 등록/해제 */}
          {deploy.deploy_status === 'ready' && (
            <Button
              size="sm"
              variant={deploy.is_showcase ? 'default' : 'outline'}
              onClick={handleShowcaseClick}
              disabled={registerShowcase.isPending || unregisterShowcase.isPending}
              className={cn(
                deploy.is_showcase && 'bg-brand-blue hover:bg-brand-blue/90'
              )}
            >
              {(registerShowcase.isPending || unregisterShowcase.isPending) ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Trophy className="mr-1 h-3 w-3" />
              )}
              {deploy.is_showcase ? '쇼케이스 등록됨' : '쇼케이스'}
            </Button>
          )}

          {/* 재배포 (오류 상태에서만) */}
          {deploy.deploy_status === 'error' && deploy.forked_repo_full_name && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleRedeploy}
              disabled={redeployMutation.isPending}
            >
              {redeployMutation.isPending ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="mr-1 h-3 w-3" />
              )}
              재배포
            </Button>
          )}

          {/* 삭제 */}
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive ml-auto">
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t(locale, 'mySites.deleteConfirm')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t(locale, 'mySites.deleteDesc')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t(locale, 'common.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t(locale, 'mySites.deleting')}
                    </>
                  ) : (
                    t(locale, 'common.delete')
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>

      {/* 쇼케이스 등록 다이얼로그 */}
      <ShowcaseRegisterDialog
        open={showcaseDialogOpen}
        onOpenChange={setShowcaseDialogOpen}
        onSubmit={handleShowcaseRegister}
        isLoading={registerShowcase.isPending}
        mode="register"
      />
    </Card>
  );
}
