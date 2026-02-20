'use client';

import Link from 'next/link';
import { Plus, Map, Boxes, Key, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SystemStatusBadge } from './system-status-badge';
import { MetricPill } from './metric-pill';
import { ProjectIconPicker } from '@/components/project/project-icon-picker';
import { useUpdateProject } from '@/lib/queries/projects';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/keys';
import type { Project, DashboardMetrics, ServiceCardData } from '@/types';

interface ProjectHeroCardProps {
  project: Project;
  metrics: DashboardMetrics;
  allCards: ServiceCardData[];
}

export function ProjectHeroCard({ project, metrics, allCards }: ProjectHeroCardProps) {
  const updateProject = useUpdateProject();
  const queryClient = useQueryClient();

  const handleIconSelect = (iconType: 'brand' | 'emoji' | 'custom' | null, iconValue: string | null) => {
    // Custom uploads are handled by the icon API and already saved
    if (iconType === 'custom') {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      return;
    }

    updateProject.mutate(
      { id: project.id, icon_type: iconType, icon_value: iconValue },
      {
        onError: () => {
          toast.error('아이콘 변경에 실패했습니다');
        },
      },
    );
  };

  return (
    <div className="rounded-2xl border bg-card/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm p-6 h-full">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Project avatar with icon picker */}
        <ProjectIconPicker
          projectId={project.id}
          projectName={project.name}
          currentIconType={project.icon_type}
          currentIconValue={project.icon_value}
          onSelect={handleIconSelect}
          disabled={updateProject.isPending}
        />

        <div className="flex-1 min-w-0 space-y-3">
          {/* Name + status */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight">{project.name}</h2>
              {project.description && (
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{project.description}</p>
              )}
            </div>
            <SystemStatusBadge projectId={project.id} allCards={allCards} />
          </div>

          {/* Metrics row */}
          <div className="flex flex-wrap gap-2">
            <MetricPill icon={Boxes} value={metrics.totalServices} label="서비스" />
            <MetricPill icon={Key} value={metrics.totalEnvVars} label="ENV" />
            <MetricPill icon={TrendingUp} value={`${metrics.progressPercent}%`} label="진행률" />
          </div>

          {/* Connection status dots */}
          {allCards.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {allCards.map((c) => (
                <span
                  key={c.projectServiceId}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    c.status === 'connected'
                      ? 'bg-green-500'
                      : c.status === 'error'
                        ? 'bg-red-500'
                        : c.status === 'in_progress'
                          ? 'bg-yellow-500'
                          : 'bg-muted-foreground/20'
                  }`}
                  title={`${c.name}: ${c.status}`}
                />
              ))}
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="h-8 text-xs" asChild>
              <Link href={`/project/${project.id}/integrations`}>
                <Plus className="mr-1 h-3.5 w-3.5" />
                서비스 추가
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
              <Link href={`/project/${project.id}/service-map`}>
                <Map className="mr-1 h-3.5 w-3.5" />
                맵 보기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
