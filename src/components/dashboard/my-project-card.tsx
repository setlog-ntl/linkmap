'use client';

import Link from 'next/link';
import { Plus, Map } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Project, DashboardMetrics, ServiceCardData } from '@/types';

interface MyProjectCardProps {
  project: Project;
  metrics: DashboardMetrics;
  allCards: ServiceCardData[];
}

export function MyProjectCard({ project, metrics, allCards }: MyProjectCardProps) {
  const initial = project.name.charAt(0).toUpperCase();

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col items-center gap-4 p-5">
        {/* Project avatar */}
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
          {initial}
        </div>

        {/* Project name + description */}
        <div className="text-center">
          <h2 className="text-lg font-semibold">{project.name}</h2>
          {project.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        {/* Metrics */}
        <div className="grid w-full grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xl font-bold">{metrics.totalServices}</p>
            <p className="text-[11px] text-muted-foreground">서비스</p>
          </div>
          <div>
            <p className="text-xl font-bold">{metrics.totalEnvVars}</p>
            <p className="text-[11px] text-muted-foreground">ENV</p>
          </div>
          <div>
            <p className="text-xl font-bold">{metrics.progressPercent}%</p>
            <p className="text-[11px] text-muted-foreground">진행률</p>
          </div>
        </div>

        {/* Connection status dots */}
        {allCards.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1">
            {allCards.map((c) => (
              <span
                key={c.projectServiceId}
                className={`h-2 w-2 rounded-full ${
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
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/project/${project.id}/services`}>
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
      </CardContent>
    </Card>
  );
}
