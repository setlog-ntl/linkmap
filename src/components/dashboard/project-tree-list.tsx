'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  List,
  Key,
  Map as MapIcon,
  Settings,
  ChevronRight,
  MoreHorizontal,
  FolderOpen,
  Trash2,
  Loader2,
  Rocket,
  Star,
  GripVertical,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes,
} from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { ProjectWithServices } from '@/types';
import type { HomepageDeploy } from '@/lib/queries/oneclick';

interface ProjectTreeListProps {
  projects: ProjectWithServices[];
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorited: boolean) => void;
  onReorder?: (orderedIds: string[]) => void;
  deployByProjectId?: Map<string, HomepageDeploy>;
}

export function ProjectTreeList({ projects, onDelete, onToggleFavorite, onReorder, deployByProjectId }: ProjectTreeListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    onReorder(reordered.map((p) => p.id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {projects.map((project) => (
            <SortableProjectTreeItem
              key={project.id}
              project={project}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              deploy={deployByProjectId?.get(project.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableProjectTreeItem({
  project,
  onDelete,
  onToggleFavorite,
  deploy,
}: {
  project: ProjectWithServices;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorited: boolean) => void;
  deploy?: HomepageDeploy;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ProjectTreeItem
        project={project}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
        deploy={deploy}
        dragAttributes={attributes}
        dragListeners={listeners}
        isDragging={isDragging}
      />
    </div>
  );
}

function ProjectTreeItem({
  project,
  onDelete,
  onToggleFavorite,
  deploy,
  dragAttributes,
  dragListeners,
  isDragging,
}: {
  project: ProjectWithServices;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorited: boolean) => void;
  deploy?: HomepageDeploy;
  dragAttributes?: DraggableAttributes;
  dragListeners?: SyntheticListenerMap;
  isDragging?: boolean;
}) {
  const router = useRouter();
  const { locale } = useLocaleStore();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const services = project.project_services || [];
  const serviceCount = services.length;

  const formatRelativeTime = (dateStr: string) => {
    const now = Date.now();
    const diff = now - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return locale === 'ko' ? '방금 전' : 'just now';
    if (minutes < 60) return `${minutes}${locale === 'ko' ? '분 전' : 'm ago'}`;
    if (hours < 24) return `${hours}${locale === 'ko' ? '시간 전' : 'h ago'}`;
    return `${days}${locale === 'ko' ? '일 전' : 'd ago'}`;
  };

  const subItems = [
    {
      labelKey: 'project.overview',
      icon: LayoutDashboard,
      path: '',
      badge: null,
    },
    {
      labelKey: 'project.integrations',
      icon: List,
      path: '/services',
      badge: serviceCount > 0 ? `${serviceCount} ${t(locale, 'dashboard.servicesConnected')}` : null,
    },
    {
      labelKey: 'project.envVars',
      icon: Key,
      path: '/env',
      badge: null,
    },
    {
      labelKey: 'project.serviceMap',
      icon: MapIcon,
      path: '/service-map',
      badge: null,
    },
    {
      labelKey: 'project.settings',
      icon: Settings,
      path: '/settings',
      badge: null,
    },
  ];

  return (
    <Collapsible className="group/tree">
      <div className={`rounded-lg border bg-card transition-colors hover:bg-accent/50 ${isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''}`}>
        {/* Project row */}
        <div className="flex items-center gap-2 px-3 py-2.5 md:px-4 md:py-3">
          {/* Drag handle */}
          <button
            className="shrink-0 cursor-grab active:cursor-grabbing touch-none text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            {...dragAttributes}
            {...dragListeners}
            aria-label="드래그하여 순서 변경"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <CollapsibleTrigger asChild>
            <button className="flex flex-1 items-center gap-2 min-w-0 min-h-[40px] text-left">
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/tree:rotate-90" />
              <div className="flex flex-1 items-center gap-3 min-w-0">
                <span className="font-medium truncate text-sm">
                  {project.name}
                </span>
                {deploy && <DeployStatusIcon status={deploy.deploy_status} />}
                <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground shrink-0 ml-auto">
                  {serviceCount > 0 && (
                    <span>{serviceCount}{locale === 'ko' ? '서비스' : ' services'}</span>
                  )}
                  <span className="text-muted-foreground/50">{formatRelativeTime(project.updated_at)}</span>
                </div>
              </div>
            </button>
          </CollapsibleTrigger>

          {/* Mobile meta (below project name) is handled by flexbox wrapping */}
          <div className="flex md:hidden items-center gap-2 text-xs text-muted-foreground shrink-0">
            {serviceCount > 0 && <span>{serviceCount}</span>}
            <span className="text-muted-foreground/50">{formatRelativeTime(project.updated_at)}</span>
          </div>

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(project.id, !project.is_favorited);
            }}
            aria-label={project.is_favorited ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            <Star
              className={`h-4 w-4 transition-colors ${
                project.is_favorited
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground/40 hover:text-yellow-400'
              }`}
            />
          </Button>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmOpen(true);
            }}
            aria-label="프로젝트 삭제"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>

          {/* More menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link prefetch={false} href={`/project/${project.id}`}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {t(locale, 'dashboard.openProject')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t(locale, 'common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t(locale, 'common.deleteConfirmTitle')}</AlertDialogTitle>
                <AlertDialogDescription>{t(locale, 'common.deleteConfirmDesc')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t(locale, 'common.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsDeleting(true);
                    try {
                      await onDelete(project.id);
                    } finally {
                      setIsDeleting(false);
                      setConfirmOpen(false);
                    }
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t(locale, 'common.delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Collapsible sub-items */}
        <CollapsibleContent>
          <div className="border-t px-3 py-1.5 md:px-4 md:py-2 space-y-0.5">
            {subItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors min-h-[40px]"
                  onClick={() => router.push(`/project/${project.id}${item.path}`)}
                >
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{t(locale, item.labelKey)}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function DeployStatusIcon({ status }: { status: HomepageDeploy['deploy_status'] }) {
  const dotConfig = {
    ready: { dotClass: 'bg-green-500', label: '원클릭 배포 · 배포됨' },
    building: { dotClass: 'bg-yellow-500 animate-pulse', label: '원클릭 배포 · 배포 중' },
    creating: { dotClass: 'bg-yellow-500 animate-pulse', label: '원클릭 배포 · 생성 중' },
    pending: { dotClass: 'bg-yellow-500 animate-pulse', label: '원클릭 배포 · 대기 중' },
    error: { dotClass: 'bg-red-500', label: '원클릭 배포 · 점검 필요' },
    canceled: { dotClass: 'bg-muted-foreground/40', label: '원클릭 배포' },
  } as const;

  const { dotClass, label } = dotConfig[status] ?? dotConfig.canceled;

  return (
    <span
      className="inline-flex items-center gap-0.5 rounded border border-primary/20 bg-primary/5 px-1 py-0.5 shrink-0"
      title={label}
    >
      <Rocket className="h-2.5 w-2.5 text-primary" />
      <span className="text-[10px] font-medium text-primary leading-none">원클릭</span>
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
    </span>
  );
}
