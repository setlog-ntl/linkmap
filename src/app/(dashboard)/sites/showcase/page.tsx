'use client';

import { useState } from 'react';
import {
  useMyShowcases,
  useUpdateShowcase,
  useUnregisterShowcase,
  useProjectShowcase,
  type ShowcaseItem,
} from '@/lib/queries/showcase';
import { ShowcaseRegisterDialog } from '@/components/showcase/showcase-register-dialog';
import { useLocaleStore } from '@/stores/locale-store';
import { SHOWCASE_CATEGORIES, type ShowcaseCategory } from '@/types/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Trophy,
  ExternalLink,
  Pencil,
  Trash2,
  Globe,
  Loader2,
  Sparkles,
  FolderKanban,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MyShowcasePage() {
  const { data: showcases, isLoading } = useMyShowcases();
  const updateShowcase = useUpdateShowcase();
  const unregisterShowcase = useUnregisterShowcase();
  const projectShowcase = useProjectShowcase();
  const { locale } = useLocaleStore();

  const [editTarget, setEditTarget] = useState<ShowcaseItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ShowcaseItem | null>(null);

  const handleUpdate = (data: {
    description: string;
    tags: string[];
    category: ShowcaseCategory | undefined;
    image_url: string | null;
  }) => {
    if (!editTarget) return;

    if (editTarget.source === 'project') {
      projectShowcase.mutate(
        {
          projectId: editTarget.id,
          action: 'update',
          description: data.description || undefined,
          tags: data.tags.length > 0 ? data.tags : undefined,
          category: data.category,
          image_url: data.image_url,
        },
        {
          onSuccess: () => {
            toast.success('쇼케이스 정보가 수정되었습니다');
            setEditTarget(null);
          },
          onError: (err) => toast.error(err instanceof Error ? err.message : '수정 실패'),
        }
      );
    } else {
      updateShowcase.mutate(
        {
          deployId: editTarget.id,
          description: data.description || undefined,
          tags: data.tags.length > 0 ? data.tags : undefined,
          category: data.category,
          image_url: data.image_url,
        },
        {
          onSuccess: () => {
            toast.success('쇼케이스 정보가 수정되었습니다');
            setEditTarget(null);
          },
          onError: (err) => toast.error(err instanceof Error ? err.message : '수정 실패'),
        }
      );
    }
  };

  const handleUnregister = () => {
    if (!deleteTarget) return;

    if (deleteTarget.source === 'project') {
      projectShowcase.mutate(
        { projectId: deleteTarget.id, action: 'unregister' },
        {
          onSuccess: () => {
            toast.success('쇼케이스에서 해제되었습니다');
            setDeleteTarget(null);
          },
          onError: (err) => toast.error(err instanceof Error ? err.message : '해제 실패'),
        }
      );
    } else {
      unregisterShowcase.mutate(deleteTarget.id, {
        onSuccess: () => {
          toast.success('쇼케이스에서 해제되었습니다');
          setDeleteTarget(null);
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : '해제 실패'),
      });
    }
  };

  const isLoading2 = updateShowcase.isPending || projectShowcase.isPending;
  const isUnregistering = unregisterShowcase.isPending || projectShowcase.isPending;

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-brand-blue" />
            내 쇼케이스 관리
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            쇼케이스에 등록한 사이트의 정보를 수정하거나 해제할 수 있습니다.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link prefetch={false} href="/showcase">
            <Globe className="mr-2 h-4 w-4" />
            갤러리 보기
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : showcases && showcases.length > 0 ? (
        <div className="space-y-4">
          {showcases.map((item) => {
            const liveUrl = item.pages_url || item.deployment_url;
            const templateName = item.homepage_templates
              ? (locale === 'ko' ? item.homepage_templates.name_ko : item.homepage_templates.name)
              : null;
            const categoryLabel = item.showcase_category
              ? SHOWCASE_CATEGORIES.find((c) => c.value === item.showcase_category)?.label
              : null;
            const authorName = item.profiles?.name || '익명';
            const authorInitial = authorName.charAt(0).toUpperCase();
            const isProject = item.source === 'project';

            return (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={item.profiles?.avatar_url || undefined} alt={authorName} />
                      <AvatarFallback>{authorInitial}</AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/showcase/${item.id}`}
                          prefetch={false}
                          className="font-semibold hover:underline truncate"
                        >
                          {item.site_name}
                        </Link>
                        {/* source badge */}
                        <Badge variant="outline" className="text-[10px] shrink-0 gap-1">
                          {isProject ? (
                            <><FolderKanban className="h-2.5 w-2.5" /> 프로젝트</>
                          ) : (
                            <><Rocket className="h-2.5 w-2.5" /> 배포</>
                          )}
                        </Badge>
                        {categoryLabel && (
                          <Badge variant="secondary" className="text-[10px] shrink-0">
                            {categoryLabel}
                          </Badge>
                        )}
                      </div>

                      {templateName && (
                        <p className="text-xs text-muted-foreground">
                          {templateName}
                          {item.homepage_templates?.framework && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">
                              {item.homepage_templates.framework}
                            </span>
                          )}
                        </p>
                      )}

                      {item.showcase_description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {item.showcase_description}
                        </p>
                      )}

                      {item.showcase_tags && item.showcase_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.showcase_tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {liveUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditTarget(item)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(item)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg">
          <Sparkles className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">
            등록한 쇼케이스가 없습니다
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            프로젝트 대시보드 또는 내 사이트 관리에서 쇼케이스에 등록해보세요!
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" asChild>
              <Link prefetch={false} href="/sites/manage">내 사이트 관리</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link prefetch={false} href="/dashboard">프로젝트 목록</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editTarget && (
        <ShowcaseRegisterDialog
          open={!!editTarget}
          onOpenChange={(open) => !open && setEditTarget(null)}
          onSubmit={handleUpdate}
          isLoading={isLoading2}
          mode="edit"
          initialData={{
            description: editTarget.showcase_description,
            tags: editTarget.showcase_tags,
            category: editTarget.showcase_category,
            image_url: editTarget.showcase_image_url,
          }}
        />
      )}

      {/* Unregister Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>쇼케이스에서 해제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleteTarget?.site_name}&quot;을(를) 쇼케이스 갤러리에서 제거합니다.
              {deleteTarget?.source === 'project'
                ? ' 프로젝트 자체는 삭제되지 않으며, 나중에 다시 등록할 수 있습니다.'
                : ' 사이트 자체는 삭제되지 않으며, 나중에 다시 등록할 수 있습니다.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnregister}
              disabled={isUnregistering}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isUnregistering && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              해제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
