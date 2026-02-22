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
} from 'lucide-react';
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

interface ProjectTreeListProps {
  projects: ProjectWithServices[];
  onDelete: (id: string) => void;
}

export function ProjectTreeList({ projects, onDelete }: ProjectTreeListProps) {
  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <ProjectTreeItem
          key={project.id}
          project={project}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function ProjectTreeItem({
  project,
  onDelete,
}: {
  project: ProjectWithServices;
  onDelete: (id: string) => void;
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
      <div className="rounded-lg border bg-card transition-colors hover:bg-accent/50">
        {/* Project row */}
        <div className="flex items-center gap-2 px-3 py-2.5 md:px-4 md:py-3">
          <CollapsibleTrigger asChild>
            <button className="flex flex-1 items-center gap-2 min-w-0 min-h-[40px] text-left">
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/tree:rotate-90" />
              <div className="flex flex-1 items-center gap-3 min-w-0">
                <span className="font-medium truncate text-sm">
                  {project.name}
                </span>
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
                <Link href={`/project/${project.id}`}>
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
