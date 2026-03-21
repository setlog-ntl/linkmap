'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Plus, Map as MapIcon, Boxes, Key, TrendingUp, DollarSign, ExternalLink, Link as LinkIcon, Check, X, Trophy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ServiceIcon } from '@/components/ui/service-icon';
import { SystemStatusBadge } from './system-status-badge';
import { MetricPill } from './metric-pill';
import { ProjectIconPicker } from '@/components/project/project-icon-picker';
import { ShowcaseRegisterDialog } from '@/components/showcase/showcase-register-dialog';
import { useUpdateProject } from '@/lib/queries/projects';
import { useProjectShowcaseDeploy, useRegisterShowcase, useUnregisterShowcase, useProjectShowcase } from '@/lib/queries/showcase';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/keys';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { Project, DashboardMetrics, ServiceCardData } from '@/types';

interface ProjectHeroCardProps {
  project: Project;
  metrics: DashboardMetrics;
  allCards: ServiceCardData[];
  onServiceClick?: (projectServiceId: string, serviceId: string) => void;
}

const STATUS_BG: Record<string, string> = {
  connected: 'bg-emerald-500/10 dark:bg-emerald-500/15',
  error: 'bg-red-500/10 dark:bg-red-500/15',
  in_progress: 'bg-amber-500/10 dark:bg-amber-500/15',
  not_started: 'bg-muted/50',
};

export function ProjectHeroCard({ project, metrics, allCards, onServiceClick }: ProjectHeroCardProps) {
  const updateProject = useUpdateProject();
  const queryClient = useQueryClient();
  const { locale } = useLocaleStore();

  // 쇼케이스: 배포 기반 또는 프로젝트 기반
  const { data: showcaseDeploy } = useProjectShowcaseDeploy(project.id);
  const registerShowcase = useRegisterShowcase();
  const unregisterShowcase = useUnregisterShowcase();
  const projectShowcase = useProjectShowcase();
  const [showcaseDialogOpen, setShowcaseDialogOpen] = useState(false);

  // 배포가 있으면 배포 기반, 없으면 프로젝트 기반
  const hasDeploy = !!showcaseDeploy;
  const isShowcased = hasDeploy ? showcaseDeploy.is_showcase : project.is_showcase;
  const showcaseLoading = registerShowcase.isPending || unregisterShowcase.isPending || projectShowcase.isPending;

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(project.name);
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(project.description || '');
  const [editingLink, setEditingLink] = useState(false);
  const [linkValue, setLinkValue] = useState(project.link_url || '');
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all(project.id) });
  };

  const handleIconSelect = (iconType: 'brand' | 'emoji' | 'custom' | null, iconValue: string | null) => {
    if (iconType === 'custom') {
      invalidateAll();
      return;
    }
    updateProject.mutate(
      { id: project.id, icon_type: iconType, icon_value: iconValue },
      {
        onSuccess: () => invalidateAll(),
        onError: () => { toast.error('아이콘 변경에 실패했습니다'); },
      },
    );
  };

  const cancelName = () => {
    setNameValue(project.name);
    setEditingName(false);
  };

  const saveName = () => {
    const trimmed = nameValue.trim();
    if (!trimmed) { setNameValue(project.name); setEditingName(false); return; }
    if (trimmed === project.name) { setEditingName(false); return; }
    setEditingName(false);
    updateProject.mutate(
      { id: project.id, name: trimmed },
      {
        onSuccess: () => { toast.success('프로젝트명이 변경되었습니다'); invalidateAll(); },
        onError: () => { setNameValue(project.name); toast.error('저장에 실패했습니다'); },
      },
    );
  };

  const cancelDesc = () => {
    setDescValue(project.description || '');
    setEditingDesc(false);
  };

  const saveDescription = () => {
    const trimmed = descValue.trim() || null;
    if (trimmed === project.description) {
      setEditingDesc(false);
      return;
    }
    setEditingDesc(false);
    updateProject.mutate(
      { id: project.id, description: trimmed },
      {
        onSuccess: () => invalidateAll(),
        onError: () => toast.error('저장에 실패했습니다'),
      },
    );
  };

  const cancelLink = () => {
    setLinkValue(project.link_url || '');
    setEditingLink(false);
  };

  const saveLink = () => {
    const trimmed = linkValue.trim() || null;
    if (trimmed === project.link_url) {
      setEditingLink(false);
      return;
    }
    if (trimmed && !/^https?:\/\/.+/.test(trimmed)) {
      toast.error('올바른 URL을 입력하세요 (https://...)');
      return;
    }
    setEditingLink(false);
    updateProject.mutate(
      { id: project.id, link_url: trimmed },
      {
        onSuccess: () => invalidateAll(),
        onError: () => toast.error('저장에 실패했습니다'),
      },
    );
  };

  return (
    <div className="rounded-2xl border bg-card shadow-sm p-5 sm:p-6 h-full">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        {/* Project avatar with icon picker */}
        <ProjectIconPicker
          projectId={project.id}
          projectName={nameValue || project.name}
          currentIconType={project.icon_type}
          currentIconValue={project.icon_value}
          onSelect={handleIconSelect}
          disabled={updateProject.isPending}
        />

        <div className="flex-1 min-w-0 space-y-3">
          {/* Name + status */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {editingName ? (
                <div className="flex items-center gap-1">
                  <Input
                    ref={nameRef}
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') cancelName(); }}
                    className="h-8 text-base font-bold flex-1"
                    placeholder="프로젝트 이름"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="h-8 w-8 flex items-center justify-center rounded text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 shrink-0 transition-colors"
                    title="저장 (Enter)"
                    onClick={saveName}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="h-8 w-8 flex items-center justify-center rounded text-muted-foreground hover:bg-muted shrink-0 transition-colors"
                    title="취소 (Esc)"
                    onClick={cancelName}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <h2
                  className="text-xl font-bold tracking-tight cursor-pointer hover:text-muted-foreground transition-colors"
                  title="클릭하여 이름 변경"
                  onClick={() => { setNameValue(project.name); setEditingName(true); }}
                >
                  {project.name}
                </h2>
              )}

              {/* Inline description */}
              {editingDesc ? (
                <div className="mt-1 flex items-center gap-1">
                  <Input
                    ref={descRef}
                    value={descValue}
                    onChange={(e) => setDescValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveDescription(); if (e.key === 'Escape') cancelDesc(); }}
                    className="h-7 text-xs flex-1"
                    placeholder={t(locale, 'project.addDescription')}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="h-7 w-7 flex items-center justify-center rounded text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 shrink-0 transition-colors"
                    title="저장 (Enter)"
                    onClick={saveDescription}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:bg-muted shrink-0 transition-colors"
                    title="취소 (Esc)"
                    onClick={cancelDesc}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
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
                <div className="mt-1 flex items-center gap-1">
                  <Input
                    ref={linkRef}
                    value={linkValue}
                    onChange={(e) => setLinkValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveLink(); if (e.key === 'Escape') cancelLink(); }}
                    className="h-7 text-xs flex-1"
                    placeholder="https://..."
                    autoFocus
                  />
                  <button
                    type="button"
                    className="h-7 w-7 flex items-center justify-center rounded text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 shrink-0 transition-colors"
                    title="저장 (Enter)"
                    onClick={saveLink}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:bg-muted shrink-0 transition-colors"
                    title="취소 (Esc)"
                    onClick={cancelLink}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
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
            <MetricPill
              icon={DollarSign}
              value={`$${(metrics.totalMonthlyCost ?? 0).toFixed(0)}`}
              label="월 비용"
              href={`/project/${project.id}/costs`}
            />
          </div>

          {/* Service icon grid */}
          {allCards.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {allCards.slice(0, 10).map((c) => (
                <div
                  key={c.projectServiceId}
                  className={`rounded-md p-1.5 transition-colors ${STATUS_BG[c.status] ?? 'bg-muted/30'} ${onServiceClick ? 'cursor-pointer hover:ring-1 hover:ring-primary/30' : ''}`}
                  title={`${c.name}: ${c.status}`}
                  onClick={onServiceClick ? () => onServiceClick(c.projectServiceId, c.serviceId) : undefined}
                >
                  <ServiceIcon serviceId={c.slug} size={16} />
                </div>
              ))}
              {allCards.length > 10 && (
                <span className="text-[10px] text-muted-foreground self-center ml-1">
                  +{allCards.length - 10}
                </span>
              )}
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" className="h-8 text-xs" asChild>
              <Link prefetch={false} href={`/project/${project.id}/integrations`}>
                <Plus className="mr-1 h-3.5 w-3.5" />
                서비스 추가
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
              <Link prefetch={false} href={`/project/${project.id}/service-map`}>
                <MapIcon className="mr-1 h-3.5 w-3.5" />
                맵 보기
              </Link>
            </Button>

            {/* 쇼케이스 버튼 — 모든 프로젝트에서 표시 */}
            <Button
              variant={isShowcased ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'h-8 text-xs',
                isShowcased && 'bg-brand-blue hover:bg-brand-blue/90'
              )}
              disabled={showcaseLoading}
              onClick={() => {
                if (isShowcased) {
                  // 해제
                  if (hasDeploy) {
                    unregisterShowcase.mutate(showcaseDeploy.id, {
                      onSuccess: () => {
                        toast.success('쇼케이스에서 해제되었습니다');
                        queryClient.invalidateQueries({ queryKey: queryKeys.showcase.byProject(project.id) });
                      },
                      onError: (err) => toast.error(err instanceof Error ? err.message : '해제 실패'),
                    });
                  } else {
                    projectShowcase.mutate(
                      { projectId: project.id, action: 'unregister' },
                      { onSuccess: () => toast.success('쇼케이스에서 해제되었습니다') }
                    );
                  }
                } else {
                  setShowcaseDialogOpen(true);
                }
              }}
            >
              {showcaseLoading ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trophy className="mr-1 h-3.5 w-3.5" />
              )}
              {isShowcased ? '쇼케이스 등록됨' : '쇼케이스'}
            </Button>
          </div>
        </div>
      </div>

      {/* 쇼케이스 등록 다이얼로그 */}
      <ShowcaseRegisterDialog
        open={showcaseDialogOpen}
        onOpenChange={setShowcaseDialogOpen}
        onSubmit={(data) => {
          if (hasDeploy) {
            // 배포 기반 등록
            registerShowcase.mutate(
              {
                deployId: showcaseDeploy.id,
                description: data.description || undefined,
                tags: data.tags.length > 0 ? data.tags : undefined,
                category: data.category,
                image_url: data.image_url,
              },
              {
                onSuccess: () => {
                  toast.success('쇼케이스에 등록되었습니다');
                  setShowcaseDialogOpen(false);
                  queryClient.invalidateQueries({ queryKey: queryKeys.showcase.byProject(project.id) });
                },
                onError: (err) => toast.error(err instanceof Error ? err.message : '등록 실패'),
              }
            );
          } else {
            // 프로젝트 기반 등록
            projectShowcase.mutate(
              {
                projectId: project.id,
                action: 'register',
                description: data.description || undefined,
                tags: data.tags.length > 0 ? data.tags : undefined,
                category: data.category,
                image_url: data.image_url,
              },
              {
                onSuccess: () => {
                  toast.success('쇼케이스에 등록되었습니다');
                  setShowcaseDialogOpen(false);
                },
                onError: (err) => toast.error(err instanceof Error ? err.message : '등록 실패'),
              }
            );
          }
        }}
        isLoading={registerShowcase.isPending || projectShowcase.isPending}
        mode="register"
      />
    </div>
  );
}
