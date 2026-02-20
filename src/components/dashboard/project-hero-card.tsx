'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Plus, Map, Boxes, Key, TrendingUp, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SystemStatusBadge } from './system-status-badge';
import { MetricPill } from './metric-pill';
import { ProjectIconPicker } from '@/components/project/project-icon-picker';
import { useUpdateProject } from '@/lib/queries/projects';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/keys';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { Project, DashboardMetrics, ServiceCardData } from '@/types';

interface ProjectHeroCardProps {
  project: Project;
  metrics: DashboardMetrics;
  allCards: ServiceCardData[];
}

export function ProjectHeroCard({ project, metrics, allCards }: ProjectHeroCardProps) {
  const updateProject = useUpdateProject();
  const queryClient = useQueryClient();
  const { locale } = useLocaleStore();

  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(project.description || '');
  const [editingLink, setEditingLink] = useState(false);
  const [linkValue, setLinkValue] = useState(project.link_url || '');
  const descRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all(project.id) });
  };

  const handleIconSelect = (iconType: 'brand' | 'emoji' | 'custom' | null, iconValue: string | null) => {
    // Custom uploads are handled by the icon API and already saved
    if (iconType === 'custom') {
      invalidateAll();
      return;
    }

    updateProject.mutate(
      { id: project.id, icon_type: iconType, icon_value: iconValue },
      {
        onSuccess: () => invalidateAll(),
        onError: () => {
          toast.error('아이콘 변경에 실패했습니다');
        },
      },
    );
  };

  const saveDescription = () => {
    setEditingDesc(false);
    const trimmed = descValue.trim() || null;
    if (trimmed === project.description) return;
    updateProject.mutate(
      { id: project.id, description: trimmed },
      { onError: () => toast.error('저장에 실패했습니다') },
    );
  };

  const saveLink = () => {
    setEditingLink(false);
    const trimmed = linkValue.trim() || null;
    if (trimmed === project.link_url) return;
    if (trimmed && !/^https?:\/\/.+/.test(trimmed)) {
      toast.error('올바른 URL을 입력하세요 (https://...)');
      setLinkValue(project.link_url || '');
      return;
    }
    updateProject.mutate(
      { id: project.id, link_url: trimmed },
      { onError: () => toast.error('저장에 실패했습니다') },
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
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold tracking-tight">{project.name}</h2>

              {/* Inline description */}
              {editingDesc ? (
                <Input
                  ref={descRef}
                  value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  onBlur={saveDescription}
                  onKeyDown={(e) => { if (e.key === 'Enter') descRef.current?.blur(); if (e.key === 'Escape') { setDescValue(project.description || ''); setEditingDesc(false); } }}
                  className="mt-1 h-7 text-xs"
                  placeholder={t(locale, 'project.addDescription')}
                  autoFocus
                />
              ) : (
                <p
                  className="mt-0.5 text-xs text-muted-foreground line-clamp-1 cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => { setDescValue(project.description || ''); setEditingDesc(true); }}
                >
                  {project.description || t(locale, 'project.addDescription')}
                </p>
              )}

              {/* Inline link */}
              {editingLink ? (
                <Input
                  ref={linkRef}
                  value={linkValue}
                  onChange={(e) => setLinkValue(e.target.value)}
                  onBlur={saveLink}
                  onKeyDown={(e) => { if (e.key === 'Enter') linkRef.current?.blur(); if (e.key === 'Escape') { setLinkValue(project.link_url || ''); setEditingLink(false); } }}
                  className="mt-1 h-7 text-xs"
                  placeholder="https://..."
                  autoFocus
                />
              ) : project.link_url ? (
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <LinkIcon className="h-3 w-3 shrink-0" />
                  <span
                    className="truncate cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => { setLinkValue(project.link_url || ''); setEditingLink(true); }}
                  >
                    {project.link_url}
                  </span>
                  <a href={project.link_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <ExternalLink className="h-3 w-3 shrink-0 hover:text-foreground transition-colors" />
                  </a>
                </div>
              ) : (
                <p
                  className="mt-0.5 text-xs text-muted-foreground/50 cursor-pointer hover:text-muted-foreground transition-colors"
                  onClick={() => { setLinkValue(''); setEditingLink(true); }}
                >
                  {t(locale, 'project.addLink')}
                </p>
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
