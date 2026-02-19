'use client';

import Link from 'next/link';
import { Plus, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemStatusBadge } from './system-status-badge';
import type { Project, DashboardMetrics, ServiceCardData } from '@/types';

interface MyProjectCardProps {
  project: Project;
  metrics: DashboardMetrics;
  allCards: ServiceCardData[];
}

export function MyProjectCard({ project, metrics, allCards }: MyProjectCardProps) {
  const initial = project.name.charAt(0).toUpperCase();

  return (
    <div className="h-full rounded-lg border bg-muted/50 shadow-xl dark:bg-zinc-900/80">
      <div className="flex flex-col items-center gap-4 p-6">
        {/* Project avatar */}
        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted text-3xl font-bold text-foreground dark:bg-zinc-800">
          {initial}
        </div>

        {/* Project name + description */}
        <div className="text-center">
          <h2 className="text-2xl font-mono font-bold">{project.name}</h2>
          {project.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        {/* System status */}
        <SystemStatusBadge projectId={project.id} allCards={allCards} />

        {/* Metrics */}
        <div className="grid w-full grid-cols-3 text-center">
          <div className="border-r">
            <p className="text-xl font-mono font-bold">{metrics.totalServices}</p>
            <p className="text-[11px] text-muted-foreground">서비스</p>
          </div>
          <div className="border-r">
            <p className="text-xl font-mono font-bold">{metrics.totalEnvVars}</p>
            <p className="text-[11px] text-muted-foreground">ENV</p>
          </div>
          <div>
            <p className="text-xl font-mono font-bold">{metrics.progressPercent}%</p>
            <p className="text-[11px] text-muted-foreground">진행률</p>
          </div>
        </div>

        {/* Connection status dots */}
        {allCards.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1">
            {allCards.map((c) => (
              <span
                key={c.projectServiceId}
                className={`h-2.5 w-2.5 rounded-full ${
                  c.status === 'connected'
                    ? 'bg-green-500'
                    : c.status === 'error'
                      ? 'bg-red-500'
                      : 'bg-muted-foreground/30'
                }`}
                title={`${c.name}: ${c.status}`}
              />
            ))}
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex w-full gap-2 mt-auto">
          <Button variant="default" size="sm" className="flex-1" asChild>
            <Link href={`/project/${project.id}/integrations`}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              서비스 추가
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/project/${project.id}/service-map`}>
              <Map className="mr-1 h-3.5 w-3.5" />
              맵 보기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
