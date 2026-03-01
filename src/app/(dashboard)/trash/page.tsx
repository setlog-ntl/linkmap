'use client';

import { useState } from 'react';
import { Trash2, RotateCcw, X, FolderKanban, Key, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useTrashedItems, useEmptyTrash } from '@/lib/queries/trash';
import { useRestoreProject, usePermanentDeleteProject } from '@/lib/queries/projects';
import { useRestoreEnvVar, usePermanentDeleteEnvVar } from '@/lib/queries/env-vars';
import { useRestoreConnection, usePermanentDeleteConnection } from '@/lib/queries/connections';
import type { TrashItem, TrashItemType } from '@/app/api/trash/route';

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

function typeLabel(type: TrashItemType) {
  if (type === 'project') return '프로젝트';
  if (type === 'env_var') return '환경변수';
  return '연결';
}

function TypeIcon({ type }: { type: TrashItemType }) {
  if (type === 'project') return <FolderKanban className="h-4 w-4 text-muted-foreground" />;
  if (type === 'env_var') return <Key className="h-4 w-4 text-muted-foreground" />;
  return <Link2 className="h-4 w-4 text-muted-foreground" />;
}

interface TrashRowProps {
  item: TrashItem;
}

function TrashRow({ item }: TrashRowProps) {
  const restoreProject = useRestoreProject();
  const permanentProject = usePermanentDeleteProject();
  const restoreEnv = useRestoreEnvVar();
  const permanentEnv = usePermanentDeleteEnvVar();
  const restoreConn = useRestoreConnection();
  const permanentConn = usePermanentDeleteConnection();

  const handleRestore = async () => {
    try {
      if (item.type === 'project') await restoreProject.mutateAsync(item.id);
      else if (item.type === 'env_var') await restoreEnv.mutateAsync(item.id);
      else await restoreConn.mutateAsync(item.id);
      toast.success(`${item.name} 복구 완료`);
    } catch {
      toast.error('복구에 실패했습니다');
    }
  };

  const handlePermanentDelete = async () => {
    try {
      if (item.type === 'project') await permanentProject.mutateAsync(item.id);
      else if (item.type === 'env_var') await permanentEnv.mutateAsync(item.id);
      else await permanentConn.mutateAsync(item.id);
      toast.success(`${item.name} 영구 삭제 완료`);
    } catch {
      toast.error('영구 삭제에 실패했습니다');
    }
  };

  const isRestoring =
    restoreProject.isPending || restoreEnv.isPending || restoreConn.isPending;

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
      <TypeIcon type={item.type} />
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-sm">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          {item.project_name && <span className="mr-2">{item.project_name}</span>}
          {relativeTime(item.deleted_at)} 삭제됨
        </p>
      </div>
      <Badge variant="outline" className="shrink-0 text-xs">
        {typeLabel(item.type)}
      </Badge>
      <Button
        size="sm"
        variant="ghost"
        className="shrink-0"
        disabled={isRestoring}
        onClick={handleRestore}
      >
        <RotateCcw className="h-3.5 w-3.5 mr-1" />
        복구
      </Button>
      <ConfirmDialog
        trigger={
          <Button size="sm" variant="ghost" className="shrink-0 text-destructive hover:text-destructive">
            <X className="h-3.5 w-3.5 mr-1" />
            영구 삭제
          </Button>
        }
        title="영구 삭제"
        description={`"${item.name}"을(를) 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="영구 삭제"
        onConfirm={handlePermanentDelete}
      />
    </div>
  );
}

function TrashList({ items }: { items: TrashItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Trash2 className="h-10 w-10 mb-3 opacity-30" />
        <p className="text-sm">휴지통이 비어있습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      {items.map((item) => (
        <TrashRow key={`${item.type}-${item.id}`} item={item} />
      ))}
    </div>
  );
}

export default function TrashPage() {
  const { data: items = [], isLoading } = useTrashedItems();
  const emptyTrash = useEmptyTrash();
  const [tab, setTab] = useState<'all' | TrashItemType>('all');

  const projects = items.filter((i) => i.type === 'project');
  const envVars = items.filter((i) => i.type === 'env_var');
  const connections = items.filter((i) => i.type === 'connection');

  const filtered =
    tab === 'all' ? items :
    tab === 'project' ? projects :
    tab === 'env_var' ? envVars :
    connections;

  const handleEmptyTrash = async () => {
    try {
      await emptyTrash.mutateAsync();
      toast.success('휴지통을 비웠습니다');
    } catch {
      toast.error('휴지통 비우기에 실패했습니다');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold">휴지통</h1>
          {items.length > 0 && (
            <Badge variant="secondary">{items.length}</Badge>
          )}
        </div>
        {items.length > 0 && (
          <ConfirmDialog
            trigger={
              <Button variant="destructive" size="sm" disabled={emptyTrash.isPending}>
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                휴지통 비우기
              </Button>
            }
            title="휴지통 비우기"
            description="휴지통의 모든 항목을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다."
            confirmLabel="모두 삭제"
            onConfirm={handleEmptyTrash}
          />
        )}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">전체 {items.length > 0 && `(${items.length})`}</TabsTrigger>
          <TabsTrigger value="project">프로젝트 {projects.length > 0 && `(${projects.length})`}</TabsTrigger>
          <TabsTrigger value="env_var">환경변수 {envVars.length > 0 && `(${envVars.length})`}</TabsTrigger>
          <TabsTrigger value="connection">연결 {connections.length > 0 && `(${connections.length})`}</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex justify-center py-16 text-muted-foreground text-sm">
            불러오는 중...
          </div>
        ) : (
          <>
            <TabsContent value="all"><TrashList items={filtered} /></TabsContent>
            <TabsContent value="project"><TrashList items={filtered} /></TabsContent>
            <TabsContent value="env_var"><TrashList items={filtered} /></TabsContent>
            <TabsContent value="connection"><TrashList items={filtered} /></TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
