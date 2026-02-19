'use client';

import Link from 'next/link';
import { Plus, Map, Boxes, Key, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemStatusBadge } from './system-status-badge';
import { MetricPill } from './metric-pill';
import type { Project, DashboardMetrics, ServiceCardData } from '@/types';

interface ProjectHeroCardProps {
  project: Project;
  metrics: DashboardMetrics;
  allCards: ServiceCardData[];
}

export function ProjectHeroCard({ project, metrics, allCards }: ProjectHeroCardProps) {
  const initial = project.name.charAt(0).toUpperCase();

  return (
    <div className="rounded-2xl border bg-card/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm p-6 h-full">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Project avatar */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 text-2xl font-bold text-primary">
          {initial}
        </div>

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
