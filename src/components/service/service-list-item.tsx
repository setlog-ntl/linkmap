'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ExternalLink, ArrowRight, KeyRound, Plus, FolderKanban, Check, Loader2, Search, Star } from 'lucide-react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { ServiceTooltip } from '@/components/ui/service-tooltip';
import { getServiceDescription } from '@/lib/constants/service-descriptions';
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
  return (
    <Card className="hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center gap-4 p-4">
        {/* Icon */}
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <ServiceTooltip
            serviceName={service.name}
            category={allCategoryLabels[service.category as ServiceCategory]}
            description={getServiceDescription(service.slug)}
          >
            <ServiceIcon serviceId={service.slug} size={24} />
          </ServiceTooltip>
        </div>

        {/* Name + Description */}
        <Link prefetch={false} href={`/services/${service.slug}`} className="flex-1 min-w-0">
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
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <AddToProjectButton serviceId={service.id} serviceName={service.name} />

          {hasGuide && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="빠른 설정">
              <Link prefetch={false} href={`/services/${service.slug}?tab=quickstart`} onClick={(e) => e.stopPropagation()}>
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

/* ── 내 프로젝트에 추가 버튼 (외부에서도 사용 가능) ── */
export function AddToProjectButton({
  serviceId,
  serviceName,
  variant = 'outline',
  className = '',
}: {
  serviceId: string;
  serviceName: string;
  variant?: 'ghost' | 'outline' | 'default';
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={`h-8 gap-1.5 text-xs font-medium border-brand-blue/30 text-brand-blue hover:bg-brand-blue/10 hover:text-brand-blue ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Plus className="h-3.5 w-3.5" />
          내 프로젝트에 추가
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0" onClick={(e) => e.stopPropagation()}>
        <AddToProjectList serviceId={serviceId} serviceName={serviceName} onDone={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

/* ── 프로젝트 선택 리스트 (Popover 내부) ── */
const MAX_VISIBLE = 5;

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
  const [search, setSearch] = useState('');

  // 즐겨찾기 상단, 나머지 이름순 정렬
  const sortedProjects = useMemo(() => {
    if (!projects) return [];
    return [...projects].sort((a, b) => {
      if (a.is_favorited && !b.is_favorited) return -1;
      if (!a.is_favorited && b.is_favorited) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [projects]);

  // 검색 필터
  const filtered = useMemo(() => {
    if (!search.trim()) return sortedProjects;
    const q = search.toLowerCase();
    return sortedProjects.filter((p) => p.name.toLowerCase().includes(q));
  }, [sortedProjects, search]);

  // 검색 안 했을 때 일부만 표시
  const showSearch = sortedProjects.length > MAX_VISIBLE;
  const displayed = search.trim() ? filtered : filtered.slice(0, MAX_VISIBLE);
  const hasMore = !search.trim() && filtered.length > MAX_VISIBLE;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="py-6 px-4 text-center">
        <FolderKanban className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-3">프로젝트가 없습니다</p>
        <Button variant="outline" size="sm" className="text-xs" asChild>
          <Link prefetch={false} href="/dashboard">프로젝트 만들기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="px-3 pt-3 pb-2">
        <p className="text-sm font-semibold">내 프로젝트에 추가</p>
        <p className="text-xs text-muted-foreground mt-0.5">추가할 프로젝트를 선택하세요</p>
      </div>

      {/* 검색 */}
      {showSearch && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="프로젝트 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
      )}

      {/* 프로젝트 목록 */}
      <div className="px-1.5 pb-1.5 max-h-[240px] overflow-y-auto">
        {displayed.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-3">검색 결과가 없습니다</p>
        )}
        {displayed.map((project) => {
          const alreadyAdded = project.project_services?.some((ps) => ps.service_id === serviceId) ?? false;
          return (
            <AddToProjectItem
              key={project.id}
              projectId={project.id}
              projectName={project.name}
              isFavorited={project.is_favorited}
              serviceId={serviceId}
              serviceName={serviceName}
              alreadyAdded={alreadyAdded}
              isAdding={addingTo === project.id}
              onAddStart={() => setAddingTo(project.id)}
              onAddEnd={() => { setAddingTo(null); onDone(); }}
            />
          );
        })}
        {hasMore && (
          <p className="text-[11px] text-muted-foreground text-center py-1.5">
            외 {filtered.length - MAX_VISIBLE}개 — 검색으로 찾기
          </p>
        )}
      </div>
    </div>
  );
}

function AddToProjectItem({
  projectId,
  projectName,
  isFavorited,
  serviceId,
  serviceName,
  alreadyAdded,
  isAdding,
  onAddStart,
  onAddEnd,
}: {
  projectId: string;
  projectName: string;
  isFavorited: boolean;
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
      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm hover:bg-accent disabled:cursor-default transition-colors group/item"
    >
      {isFavorited ? (
        <Star className="h-3.5 w-3.5 shrink-0 text-yellow-500 fill-yellow-500" />
      ) : (
        <FolderKanban className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      )}
      <span className="flex-1 text-left truncate">{projectName}</span>
      {alreadyAdded ? (
        <span className="flex items-center gap-1 text-[11px] text-green-600 shrink-0">
          <Check className="h-3.5 w-3.5" />
          추가됨
        </span>
      ) : isAdding ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0 text-muted-foreground" />
      ) : (
        <Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity" />
      )}
    </button>
  );
}
