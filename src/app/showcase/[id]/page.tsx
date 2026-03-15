'use client';

import { use } from 'react';
import { useShowcaseDetail } from '@/lib/queries/showcase';
import { useLocaleStore } from '@/stores/locale-store';
import { SHOWCASE_CATEGORIES } from '@/types/core';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ShowcaseLikeButton } from '@/components/showcase/showcase-like-button';
import { ShowcaseShareButton } from '@/components/showcase/showcase-share-button';
import { ShowcaseComments } from '@/components/showcase/showcase-comments';
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Loader2,
  Calendar,
  Tag,
  AlertTriangle,
  FolderKanban,
  Rocket,
  Heart,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

export default function ShowcaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: item, isLoading } = useShowcaseDetail(id);
  const { locale } = useLocaleStore();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id);
    });
  }, []);

  // iframe 로드 실패 감지: 타임아웃 기반
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!iframeLoaded) setIframeFailed(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [iframeLoaded]);

  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true);
    setIframeFailed(false);
  }, []);

  if (isLoading) {
    return (
      <div className="container py-8 max-w-5xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-[400px] rounded-xl mb-6" />
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container py-8 max-w-5xl text-center">
        <h1 className="text-xl font-semibold mb-2">쇼케이스를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-4">
          삭제되었거나 비공개 처리된 쇼케이스입니다.
        </p>
        <Button variant="outline" asChild>
          <Link href="/showcase">
            <ArrowLeft className="mr-2 h-4 w-4" />
            갤러리로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  const liveUrl = item.pages_url || item.deployment_url;
  const previewImage = item.showcase_image_url || item.homepage_templates?.preview_image_url;
  const templateName = item.homepage_templates
    ? (locale === 'ko' ? item.homepage_templates.name_ko : item.homepage_templates.name)
    : null;
  const authorName = item.profiles?.name || '익명';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const categoryLabel = item.showcase_category
    ? SHOWCASE_CATEGORIES.find((c) => c.value === item.showcase_category)?.label
    : null;
  const deployDate = item.deployed_at
    ? new Date(item.deployed_at).toLocaleDateString(
        locale === 'ko' ? 'ko-KR' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : null;

  return (
    <div className="container py-8 max-w-5xl">
      {/* Back */}
      <Link
        href="/showcase"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        갤러리로 돌아가기
      </Link>

      {/* Preview: image or iframe */}
      {previewImage ? (
        <div className="relative rounded-xl border overflow-hidden bg-muted mb-8">
          {/* Chrome bar */}
          <div className="h-9 bg-muted/90 border-b flex items-center px-3 gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
            </div>
            {liveUrl && (
              <div className="flex-1 h-5 bg-background/70 rounded flex items-center gap-1.5 px-2 text-muted-foreground truncate min-w-0 ml-1">
                <Globe className="h-3 w-3 shrink-0" />
                <span className="text-xs font-mono truncate">
                  {liveUrl.replace('https://', '').replace('http://', '')}
                </span>
              </div>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <img
            src={previewImage}
            alt={`${item.site_name} 미리보기`}
            className="w-full max-h-[480px] object-cover"
          />
        </div>
      ) : liveUrl ? (
        <div className="relative rounded-xl border overflow-hidden bg-muted mb-8">
          {/* Chrome bar */}
          <div className="h-9 bg-muted/90 border-b flex items-center px-3 gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
            </div>
            <div className="flex-1 h-5 bg-background/70 rounded flex items-center gap-1.5 px-2 text-muted-foreground truncate min-w-0 ml-1">
              <Globe className="h-3 w-3 shrink-0" />
              <span className="text-xs font-mono truncate">
                {liveUrl.replace('https://', '').replace('http://', '')}
              </span>
            </div>
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* iframe or fallback */}
          <div className="relative" style={{ height: '480px' }}>
            {iframeFailed ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted gap-4 p-8">
                <div className="h-16 w-16 rounded-2xl bg-background/80 flex items-center justify-center shadow-sm">
                  {item.source === 'project' && item.project_icon_type === 'emoji' && item.project_icon_value ? (
                    <span className="text-3xl">{item.project_icon_value}</span>
                  ) : item.source === 'project' ? (
                    <FolderKanban className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <Rocket className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="text-center space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>이 사이트는 미리보기를 지원하지 않습니다</span>
                  </div>
                  <p className="text-xs text-muted-foreground/70">
                    보안 정책(X-Frame-Options)으로 인해 미리보기가 차단되었습니다
                  </p>
                </div>
                <Button asChild size="lg" className="mt-2">
                  <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    사이트 직접 방문하기
                  </a>
                </Button>
              </div>
            ) : (
              <>
                <iframe
                  src={liveUrl}
                  title={`${item.site_name} 미리보기`}
                  className={cn(
                    'w-full h-full border-0 transition-opacity duration-700',
                    iframeLoaded ? 'opacity-100' : 'opacity-50'
                  )}
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                  onLoad={handleIframeLoad}
                />
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{item.site_name}</h1>
            {templateName && (
              <p className="text-sm text-muted-foreground mt-1">
                {templateName}
                {item.homepage_templates?.framework && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-muted text-xs font-mono">
                    {item.homepage_templates.framework}
                  </span>
                )}
              </p>
            )}
          </div>

          {item.showcase_description && (
            <p className="text-muted-foreground leading-relaxed">
              {item.showcase_description}
            </p>
          )}

          {/* Tags */}
          {item.showcase_tags && item.showcase_tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {item.showcase_tags.map((tag) => (
                <Link key={tag} href={`/showcase?tag=${encodeURIComponent(tag)}`}>
                  <Badge variant="secondary" className="hover:bg-secondary/80">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-2">
            {liveUrl && (
              <Button asChild>
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  사이트 방문하기
                </a>
              </Button>
            )}
            <ShowcaseLikeButton
              showcaseId={id}
              source={item.source || 'deploy'}
              initialCount={item.like_count ?? 0}
            />
            <ShowcaseShareButton
              showcaseId={id}
              title={item.site_name}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-4">
            {/* Author */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.profiles?.avatar_url || undefined} alt={authorName} />
                <AvatarFallback>{authorInitial}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{authorName}</p>
                <p className="text-xs text-muted-foreground">제작자</p>
              </div>
            </div>

            {/* Category */}
            {categoryLabel && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">카테고리</span>
                <Badge variant="outline">{categoryLabel}</Badge>
              </div>
            )}

            {/* Deploy date */}
            {deployDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">배포일</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {deployDate}
                </span>
              </div>
            )}

            {/* 추천수 / 댓글수 */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">추천</span>
              <span className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-red-400" />
                {item.like_count ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">댓글</span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                {item.comment_count ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="mt-10 pt-8 border-t max-w-3xl">
        <ShowcaseComments
          showcaseId={id}
          source={item.source || 'deploy'}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
