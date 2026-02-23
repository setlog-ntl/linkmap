'use client';

import Link from 'next/link';
import { Plus, Map as MapIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemStatusBadge } from './system-status-badge';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { Project, DashboardMetrics, ServiceCardData } from '@/types';

interface MyProjectCardProps {
  project: Project;
  metrics: DashboardMetrics;
  allCards: ServiceCardData[];
}

function formatRelativeTime(dateStr: string, locale: 'ko' | 'en'): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (locale === 'ko') {
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 30) return `${days}일 전`;
    return new Date(dateStr).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  }
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function MyProjectCard({ project, metrics, allCards }: MyProjectCardProps) {
  const { locale } = useLocaleStore();
  const initial = project.name.charAt(0).toUpperCase();

  return (
    <div className="h-full rounded-lg border bg-card shadow-xl">
      <div className="flex flex-col items-center gap-4 p-6">
        {/* Project avatar */}
        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted text-3xl font-bold text-foreground">
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

        {/* Last updated */}
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatRelativeTime(project.updated_at, locale)}</span>
        </div>

        {/* System status */}
        <SystemStatusBadge projectId={project.id} allCards={allCards} />

        {/* Metrics */}
        <div className="grid w-full grid-cols-3 text-center">
          <div className="border-r">
            <p className="text-xl font-mono font-bold">{metrics.totalServices}</p>
            <p className="text-[11px] text-muted-foreground">
              {t(locale, 'myProjectCard.services')}
            </p>
          </div>
          <div className="border-r">
            <p className="text-xl font-mono font-bold">{metrics.totalEnvVars}</p>
            <p className="text-[11px] text-muted-foreground">ENV</p>
          </div>
          <div>
            <p className="text-xl font-mono font-bold">{metrics.progressPercent}%</p>
            <p className="text-[11px] text-muted-foreground">
              {t(locale, 'myProjectCard.progress')}
            </p>
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
              {t(locale, 'myProjectCard.addService')}
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/project/${project.id}/service-map`}>
              <MapIcon className="mr-1 h-3.5 w-3.5" />
              {t(locale, 'myProjectCard.viewMap')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
