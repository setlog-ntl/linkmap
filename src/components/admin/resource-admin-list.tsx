'use client';

import Link from 'next/link';
import {
  Calendar,
  Clapperboard,
  Copy,
  ExternalLink,
  Gift,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Youtube,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { RESOURCE_CATEGORIES } from '@/data/resources/free-resources';
import {
  useAdminResources,
  useDeleteResource,
  useUpdateResource,
} from '@/lib/queries/admin-resources';
import type { FreeResourceRow } from '@/types';

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ResourceRowCard({ resource }: { resource: FreeResourceRow }) {
  const update = useUpdateResource();
  const remove = useDeleteResource();
  const category = RESOURCE_CATEGORIES[resource.category];

  const handleTogglePublish = async (next: boolean) => {
    try {
      await update.mutateAsync({ id: resource.id, is_published: next });
      toast.success(
        next ? '발행했습니다 — 1분 내 공개 페이지에 반영됩니다' : '비공개로 전환했습니다'
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '발행 상태 변경에 실패했습니다');
    }
  };

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(resource.id);
      toast.success('자료를 삭제했습니다');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '삭제에 실패했습니다');
      throw err; // ConfirmDialog가 열린 상태를 유지하도록
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-brand-green/15 text-brand-green">자료 {resource.sort_order}번</Badge>
            <Badge variant="outline" className="border-brand-blue/30 text-brand-blue">
              {category.label}
            </Badge>
            {resource.is_published ? (
              <Badge>발행됨</Badge>
            ) : (
              <Badge variant="secondary">비공개</Badge>
            )}
            {resource.youtube_video_id ? (
              <span className="inline-flex items-center gap-1 text-xs text-red-600">
                <Youtube className="h-3.5 w-3.5" />
                영상 연결됨
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clapperboard className="h-3.5 w-3.5" />
                영상 준비 중
              </span>
            )}
          </div>

          <h3 className="text-base font-bold tracking-tight break-keep">{resource.title}</h3>
          <p className="text-sm text-muted-foreground break-keep">{resource.description}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="font-mono">/resources/{resource.slug}</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              공개일 {resource.published_at}
            </span>
            <span>지시문 {resource.prompts.length}개 · 바로가기 {resource.links.length}개</span>
            <span>마지막 저장 {formatDateTime(resource.updated_at)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">공개</span>
            <Switch
              checked={resource.is_published}
              onCheckedChange={handleTogglePublish}
              disabled={update.isPending}
              aria-label={`${resource.title} 발행 여부`}
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/resources/${resource.id}`} prefetch={false}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                편집
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" title="이 자료의 구성을 그대로 복사해 새 자료를 만듭니다">
              <Link href={`/admin/resources/new?from=${resource.id}`} prefetch={false}>
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                템플릿으로 복제
              </Link>
            </Button>
            {resource.is_published && (
              <Button asChild size="sm" variant="ghost">
                <a href={`/resources/${resource.slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  보기
                </a>
              </Button>
            )}
            <ConfirmDialog
              trigger={
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  삭제
                </Button>
              }
              title={`「${resource.title}」을 삭제할까요?`}
              description="공개 페이지·sitemap에서 즉시 사라지며 되돌릴 수 없습니다. 잠시 숨기려면 삭제 대신 공개 스위치를 끄세요."
              onConfirm={handleDelete}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResourceAdminList() {
  const { data: resources, isLoading, isError, refetch, isFetching } = useAdminResources();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-sm font-medium text-brand-green">
            <Gift className="h-4 w-4" />
            무료배포 자료 관리
          </div>
          <h1 className="text-2xl font-bold tracking-tight">자료 목록</h1>
          <p className="mt-1 text-sm text-muted-foreground break-keep">
            기존 자료와 같은 템플릿(히어로 · 복사용 지시문 · 바로가기 · 배포본)으로 새 자료를 만들고
            발행 여부를 설정합니다. 저장한 내용은 1분 내 공개 페이지에 반영됩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="/resources" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              공개 페이지
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/resources/new" prefetch={false}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              새 자료 추가
            </Link>
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            자료 목록을 불러오지 못했습니다. 새로고침을 눌러 다시 시도하세요.
          </CardContent>
        </Card>
      )}

      {resources && resources.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            아직 자료가 없습니다. 「새 자료 추가」로 첫 자료를 만들어 보세요.
          </CardContent>
        </Card>
      )}

      {resources && resources.length > 0 && (
        <div className="space-y-3">
          {resources.map((resource) => (
            <ResourceRowCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
