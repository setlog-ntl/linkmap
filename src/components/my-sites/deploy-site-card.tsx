'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { ExternalLink, Github, Pencil, Trash2, Loader2, Globe, LayoutDashboard } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { useDeleteDeployment, type HomepageDeploy } from '@/lib/queries/oneclick';
import { toast } from 'sonner';
import Link from 'next/link';

interface DeploySiteCardProps {
  deploy: HomepageDeploy;
}

export function DeploySiteCard({ deploy }: DeploySiteCardProps) {
  const { locale } = useLocaleStore();
  const deleteMutation = useDeleteDeployment();
  const [open, setOpen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const liveUrl = deploy.pages_url || deploy.deployment_url;
  const cacheBuster = deploy.deployed_at
    ? new Date(deploy.deployed_at).getTime()
    : Date.now();
  const templateName = deploy.homepage_templates
    ? (locale === 'ko' ? deploy.homepage_templates.name_ko : deploy.homepage_templates.name)
    : null;

  const statusVariant = (() => {
    switch (deploy.deploy_status) {
      case 'ready': return 'default' as const;
      case 'building': case 'creating': return 'secondary' as const;
      case 'error': return 'destructive' as const;
      default: return 'outline' as const;
    }
  })();

  const statusLabel = (() => {
    switch (deploy.deploy_status) {
      case 'ready': return locale === 'ko' ? '활성' : 'Active';
      case 'building': return locale === 'ko' ? '빌드 중' : 'Building';
      case 'creating': return locale === 'ko' ? '생성 중' : 'Creating';
      case 'error': return locale === 'ko' ? '오류' : 'Error';
      case 'canceled': return locale === 'ko' ? '취소됨' : 'Canceled';
      default: return locale === 'ko' ? '대기 중' : 'Pending';
    }
  })();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deploy.id);
      toast.success(locale === 'ko' ? '사이트가 삭제되었습니다.' : 'Site deleted.');
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '삭제 실패');
    }
  };

  const deployDate = new Date(deploy.created_at).toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  return (
    <Card className="overflow-hidden">
      {/* 미리보기 영역 */}
      {liveUrl && deploy.deploy_status === 'ready' ? (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative w-full bg-muted border-b group cursor-pointer"
          style={{ height: '200px' }}
        >
          {/* 축소 iframe */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ height: '200px' }}
          >
            <iframe
              src={`${liveUrl}?_t=${cacheBuster}`}
              title={`${deploy.site_name} 미리보기`}
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

          {/* 로딩 표시 */}
          {!iframeLoaded && !iframeError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* iframe 로드 실패 시 대체 UI */}
          {iframeError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted gap-2">
              <Globe className="h-8 w-8 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {locale === 'ko' ? '미리보기를 불러올 수 없습니다' : 'Preview unavailable'}
              </span>
            </div>
          )}

          {/* 호버 오버레이 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/60 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              {t(locale, 'mySites.visitSite')}
            </span>
          </div>

          {/* 상태 뱃지 */}
          <Badge
            variant={statusVariant}
            className="absolute top-2 right-2 z-10"
          >
            {statusLabel}
          </Badge>
        </a>
      ) : (
        <div className="relative w-full bg-muted border-b flex flex-col items-center justify-center gap-2" style={{ height: '200px' }}>
          <Globe className="h-10 w-10 text-muted-foreground/40" />
          <span className="text-xs text-muted-foreground">
            {deploy.deploy_status === 'error'
              ? (locale === 'ko' ? '배포 오류' : 'Deploy error')
              : (locale === 'ko' ? '배포 준비 중...' : 'Preparing...')}
          </span>
          <Badge
            variant={statusVariant}
            className="absolute top-2 right-2"
          >
            {statusLabel}
          </Badge>
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
                {locale === 'ko' ? '관리' : 'Manage'}
              </Link>
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
    </Card>
  );
}
