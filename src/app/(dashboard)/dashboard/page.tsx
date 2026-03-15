'use client';

import { useState, useEffect, useMemo, startTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProjects, useCreateProject, useDeleteProject, useToggleFavoriteProject } from '@/lib/queries/projects';
import { useMyDeployments, type HomepageDeploy } from '@/lib/queries/oneclick';
import { ProjectCard } from '@/components/project/project-card';
import { ProjectTreeList } from '@/components/dashboard/project-tree-list';
import { CreateProjectDialog } from '@/components/project/create-project-dialog';
import { TemplateDialog } from '@/components/project/template-dialog';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { createClient } from '@/lib/supabase/client';
import { FolderOpen, Layers, Puzzle, GitBranch, LayoutGrid, List, Rocket, BookOpen, Link2, CheckCircle2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

type ViewMode = 'card' | 'list';
const VIEW_STORAGE_KEY = 'linkmap-dashboard-view';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { locale } = useLocaleStore();
  const { data: projects = [], isLoading } = useProjects();
  const { data: deployments } = useMyDeployments();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const toggleFavorite = useToggleFavoriteProject();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  const deployByProjectId = useMemo(() => {
    const map = new Map<string, HomepageDeploy>();
    deployments?.forEach((d) => {
      if (d.project_id && !map.has(d.project_id)) {
        map.set(d.project_id, d);
      }
    });
    return map;
  }, [deployments]);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (a.is_favorited && !b.is_favorited) return -1;
      if (!a.is_favorited && b.is_favorited) return 1;
      return 0;
    });
  }, [projects]);

  const { deployedProjects, manualProjects } = useMemo(() => {
    const deployed: typeof sortedProjects = [];
    const manual: typeof sortedProjects = [];
    for (const p of sortedProjects) {
      if (deployByProjectId.has(p.id)) {
        deployed.push(p);
      } else {
        manual.push(p);
      }
    }
    return { deployedProjects: deployed, manualProjects: manual };
  }, [sortedProjects, deployByProjectId]);

  const handleToggleFavorite = (id: string, isFavorited: boolean) => {
    toggleFavorite.mutate({ id, isFavorited });
  };

  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === 'card' || saved === 'list') {
      startTransition(() => setViewMode(saved));
    }
  }, []);

  useEffect(() => {
    if (searchParams.get('upgraded') === 'true') {
      toast.success('Pro 플랜으로 업그레이드되었습니다! 모든 프리미엄 기능을 이용할 수 있습니다.');
      router.replace('/dashboard', { scroll: false });
    }
  }, [searchParams, router]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  };

  const handleCreateProject = async (name: string, description?: string) => {
    const project = await createProject.mutateAsync({ name, description });
    if (project) {
      router.push(`/project/${project.id}`);
    }
  };

  const handleCreateFromTemplate = async (name: string, templateId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: template } = await supabase
      .from('project_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (!template) return;

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name,
        description: template.description_ko || template.description,
        tech_stack: template.tech_stack || {},
      })
      .select()
      .single();

    if (error || !project) return;

    const serviceSlugs = template.services as string[];
    if (serviceSlugs.length > 0) {
      const { data: services } = await supabase
        .from('services')
        .select('id')
        .in('slug', serviceSlugs);

      if (services && services.length > 0) {
        await supabase.from('project_services').insert(
          services.map((s) => ({
            project_id: project.id,
            service_id: s.id,
            status: 'not_started',
          }))
        );
      }
    }

    await supabase.rpc('increment_template_downloads', { template_id: templateId });
    router.push(`/project/${project.id}`);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
    } catch {
      toast.error(t(locale, 'project.settingsDeleteFailed'));
    }
  };

  return (
    <div className="container py-8 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t(locale, 'dashboard.title')}</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            {t(locale, 'dashboard.subtitle')}
          </p>
        </div>
        <div className="flex gap-3">
          <TemplateDialog onSubmit={handleCreateFromTemplate} />
          <CreateProjectDialog
            onSubmit={handleCreateProject}
            externalOpen={createOpen}
            onExternalOpenChange={setCreateOpen}
          />
        </div>
      </div>

      {/* Cross-Project Stats */}
      {!isLoading && sortedProjects.length > 0 && (() => {
        const totalCost = sortedProjects.reduce((sum, p) => {
          return sum + (p.project_services ?? []).reduce((s, ps) => {
            return s + (ps.custom_cost_monthly ?? 0);
          }, 0);
        }, 0);

        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Layers}
              value={sortedProjects.length}
              label={t(locale, 'dashboard.statProjects')}
            />
            <StatCard
              icon={Puzzle}
              value={sortedProjects.reduce((sum, p) => sum + (p.project_services?.length || 0), 0)}
              label={t(locale, 'dashboard.statServices')}
            />
            <StatCard
              icon={GitBranch}
              value={sortedProjects.reduce((sum, p) => sum + (p.project_github_repos?.length || 0), 0)}
              label={t(locale, 'dashboard.statGithubRepos')}
            />
            <CostStatCard totalCost={totalCost} />
          </div>
        );
      })()}

      {/* Quick Actions */}
      <QuickActions onNewProject={() => setCreateOpen(true)} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border/40 overflow-hidden">
              <Skeleton className="h-32" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedProjects.length === 0 ? (
        <div className="space-y-8">
          {/* Welcome Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-2xl bg-primary/10 p-4 mb-4">
                  <Rocket className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Linkmap에 오신 걸 환영합니다!</h2>
                <p className="text-muted-foreground max-w-lg text-sm mb-6">
                  프로젝트를 만들고, 서비스를 연결하고, 환경변수를 안전하게 관리하세요.
                  <br />아래 체크리스트를 따라 시작해보세요.
                </p>
                <div className="flex gap-3">
                  <TemplateDialog onSubmit={handleCreateFromTemplate} />
                  <CreateProjectDialog onSubmit={handleCreateProject} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started Checklist */}
          <div>
            <h3 className="text-lg font-semibold mb-4">시작 가이드</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2 shrink-0">
                      <FolderOpen className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">1. 프로젝트 생성</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        새 프로젝트를 만들거나 템플릿으로 빠르게 시작하세요
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-green-500/10 p-2 shrink-0">
                      <Link2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">2. 서비스 연결</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supabase, Stripe 등 필요한 서비스를 프로젝트에 추가하세요
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-purple-500/10 p-2 shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">3. 환경변수 설정</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        API 키와 시크릿을 암호화하여 안전하게 관리하세요
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/services" className="gap-1.5">
                <Puzzle className="h-4 w-4" />
                서비스 카탈로그
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/guides" className="gap-1.5">
                <BookOpen className="h-4 w-4" />
                가이드 보기
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* View mode toggle */}
          <div className="flex items-center gap-1 mb-4">
            <Button
              variant={viewMode === 'card' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-3 gap-1.5"
              onClick={() => handleViewModeChange('card')}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="text-xs">{t(locale, 'dashboard.viewCard')}</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-3 gap-1.5"
              onClick={() => handleViewModeChange('list')}
            >
              <List className="h-4 w-4" />
              <span className="text-xs">{t(locale, 'dashboard.viewList')}</span>
            </Button>
          </div>

          {viewMode === 'list' ? (
            <div className="space-y-8">
              {manualProjects.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FolderOpen className="h-4 w-4 text-brand-green" />
                    <h2 className="text-sm font-semibold">직접 구성한 프로젝트</h2>
                    <span className="text-xs text-muted-foreground">서비스와 환경변수를 직접 설계한 프로젝트</span>
                  </div>
                  <ProjectTreeList
                    projects={manualProjects}
                    onDelete={handleDeleteProject}
                    onToggleFavorite={handleToggleFavorite}
                    deployByProjectId={deployByProjectId}
                  />
                </div>
              )}
              {deployedProjects.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Rocket className="h-4 w-4 text-brand-blue" />
                    <h2 className="text-sm font-semibold">원클릭 배포 사이트</h2>
                    <span className="text-xs text-muted-foreground">템플릿으로 빠르게 만든 사이트</span>
                  </div>
                  <ProjectTreeList
                    projects={deployedProjects}
                    onDelete={handleDeleteProject}
                    onToggleFavorite={handleToggleFavorite}
                    deployByProjectId={deployByProjectId}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {manualProjects.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FolderOpen className="h-4 w-4 text-brand-green" />
                    <h2 className="text-sm font-semibold">직접 구성한 프로젝트</h2>
                    <span className="text-xs text-muted-foreground">서비스와 환경변수를 직접 설계한 프로젝트</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {manualProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onDelete={handleDeleteProject}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )}
              {deployedProjects.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Rocket className="h-4 w-4 text-brand-blue" />
                    <h2 className="text-sm font-semibold">원클릭 배포 사이트</h2>
                    <span className="text-xs text-muted-foreground">템플릿으로 빠르게 만든 사이트</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deployedProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onDelete={handleDeleteProject}
                        onToggleFavorite={handleToggleFavorite}
                        deploy={deployByProjectId.get(project.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: typeof Layers; value: number; label: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
      <div className="rounded-lg bg-primary/10 p-2">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function CostStatCard({ totalCost }: { totalCost: number }) {
  const costDisplay = totalCost === 0
    ? '$0'
    : `$${totalCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
      <div className={`rounded-lg p-2 ${totalCost === 0 ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-primary/10'}`}>
        <DollarSign className={`h-4 w-4 ${totalCost === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'}`} />
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight font-mono">{costDisplay}</p>
        <p className="text-xs text-muted-foreground">전체 월 비용</p>
      </div>
    </div>
  );
}
