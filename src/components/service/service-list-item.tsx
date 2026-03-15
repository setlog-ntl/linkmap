'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ExternalLink, ArrowRight, KeyRound, Plus, FolderKanban, Check, Loader2 } from 'lucide-react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { DifficultyBadge, GithubStarsBadge, FreeTierBadge } from './service-badges';
import { allCategoryLabels } from '@/lib/constants/service-filters';
import { useAddProjectService } from '@/lib/queries/services';
import { useProjects } from '@/lib/queries/projects';
import { toast } from 'sonner';
import type { Service, ServiceCategory } from '@/types';

interface ServiceListItemProps {
  service: Service;
  isUsed?: boolean;
  hasGuide?: boolean;
  apiKeyInfo?: { url: string; label: string | null } | null;
}

export function ServiceListItem({ service, isUsed = false, hasGuide = false, apiKeyInfo }: ServiceListItemProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Card className="hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center gap-4 p-4">
        {/* Icon */}
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <ServiceIcon serviceId={service.slug} size={24} />
        </div>

        {/* Name + Description */}
        <Link href={`/services/${service.slug}`} className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm group-hover:text-primary transition-colors truncate">
              {service.name}
            </span>
            {isUsed && (
              <Badge className="text-xs bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 shrink-0">
                사용 중
              </Badge>
            )}
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {service.description_ko || service.description}
          </p>
        </Link>

        {/* Category */}
        <Badge variant="secondary" className="text-xs hidden md:inline-flex shrink-0">
          {allCategoryLabels[service.category as ServiceCategory] || service.category}
        </Badge>

        {/* Badges */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <DifficultyBadge level={service.difficulty_level} />
          <FreeTierBadge quality={service.free_tier_quality} />
          <GithubStarsBadge stars={service.github_stars} />
        </div>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {/* 프로젝트에 추가 */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-xs text-muted-foreground hover:text-brand-blue"
                onClick={(e) => e.stopPropagation()}
                title="내 프로젝트에 추가"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">추가</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-2" onClick={(e) => e.stopPropagation()}>
              <AddToProjectList serviceId={service.id} serviceName={service.name} onDone={() => setPopoverOpen(false)} />
            </PopoverContent>
          </Popover>

          {hasGuide && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="빠른 설정">
              <Link href={`/services/${service.slug}?tab=quickstart`} onClick={(e) => e.stopPropagation()}>
                <KeyRound className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
          {apiKeyInfo && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title={apiKeyInfo.label || '키 설정'}>
              <a href={apiKeyInfo.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
          {service.website_url && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={service.website_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ── 프로젝트에 추가 버튼 (외부에서도 사용 가능) ── */
export function AddToProjectButton({
  serviceId,
  serviceName,
  variant = 'ghost',
  size = 'sm',
  className = '',
}: {
  serviceId: string;
  serviceName: string;
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'sm' | 'icon';
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`gap-1 text-xs text-muted-foreground hover:text-brand-blue ${className}`}
          onClick={(e) => e.stopPropagation()}
          title="내 프로젝트에 추가"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>추가</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-2" onClick={(e) => e.stopPropagation()}>
        <AddToProjectList serviceId={serviceId} serviceName={serviceName} onDone={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

/* ── 프로젝트 선택 리스트 (Popover 내부) ── */
function AddToProjectList({
  serviceId,
  serviceName,
  onDone,
}: {
  serviceId: string;
  serviceName: string;
  onDone: () => void;
}) {
  const { data: projects, isLoading } = useProjects();
  const [addingTo, setAddingTo] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="py-3 px-2 text-center">
        <p className="text-xs text-muted-foreground mb-2">프로젝트가 없습니다</p>
        <Button variant="outline" size="sm" className="text-xs" asChild>
          <Link href="/dashboard">프로젝트 만들기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium text-muted-foreground px-2 py-1">프로젝트에 추가</p>
      {projects.map((project) => {
        const alreadyAdded = project.project_services?.some((ps) => ps.service_id === serviceId) ?? false;
        return (
          <AddToProjectItem
            key={project.id}
            projectId={project.id}
            projectName={project.name}
            serviceId={serviceId}
            serviceName={serviceName}
            alreadyAdded={alreadyAdded}
            isAdding={addingTo === project.id}
            onAddStart={() => setAddingTo(project.id)}
            onAddEnd={() => { setAddingTo(null); onDone(); }}
          />
        );
      })}
    </div>
  );
}

function AddToProjectItem({
  projectId,
  projectName,
  serviceId,
  serviceName,
  alreadyAdded,
  isAdding,
  onAddStart,
  onAddEnd,
}: {
  projectId: string;
  projectName: string;
  serviceId: string;
  serviceName: string;
  alreadyAdded: boolean;
  isAdding: boolean;
  onAddStart: () => void;
  onAddEnd: () => void;
}) {
  const addService = useAddProjectService(projectId);

  const handleAdd = () => {
    if (alreadyAdded || isAdding) return;
    onAddStart();
    addService.mutate(serviceId, {
      onSuccess: () => {
        toast.success(`${serviceName}을(를) "${projectName}"에 추가했습니다`);
        onAddEnd();
      },
      onError: () => {
        toast.error('서비스 추가에 실패했습니다');
        onAddEnd();
      },
    });
  };

  return (
    <button
      onClick={handleAdd}
      disabled={alreadyAdded || isAdding}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-accent disabled:opacity-50 disabled:cursor-default transition-colors"
    >
      <FolderKanban className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="flex-1 text-left truncate">{projectName}</span>
      {alreadyAdded && <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />}
      {isAdding && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />}
    </button>
  );
}
