'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProjects, useCreateProject, useDeleteProject, useToggleFavoriteProject } from '@/lib/queries/projects';
import { useMyDeployments, type HomepageDeploy } from '@/lib/queries/oneclick';
import { ProjectCard } from '@/components/project/project-card';
import { ProjectTreeList } from '@/components/dashboard/project-tree-list';
import { CreateProjectDialog } from '@/components/project/create-project-dialog';
import { TemplateDialog } from '@/components/project/template-dialog';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { createClient } from '@/lib/supabase/client';
import { FolderOpen, Layers, Puzzle, GitBranch, LayoutGrid, List } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

type ViewMode = 'card' | 'list';
const VIEW_STORAGE_KEY = 'linkmap-dashboard-view';

export default function DashboardPage() {
  const router = useRouter();
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

  const handleToggleFavorite = (id: string, isFavorited: boolean) => {
    toggleFavorite.mutate({ id, isFavorited });
  };

  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === 'card' || saved === 'list') {
      setViewMode(saved);
    }
  }, []);

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
    await deleteProject.mutateAsync(id);
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
      {!isLoading && sortedProjects.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
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
        </div>
      )}

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
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="rounded-2xl bg-muted/50 p-6 mb-6">
            <FolderOpen className="h-12 w-12 text-muted-foreground/40" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t(locale, 'dashboard.noProjects')}</h2>
          <p className="text-muted-foreground mb-8 max-w-md text-sm">
            {t(locale, 'dashboard.noProjectsDesc')}
          </p>
          <div className="flex gap-3">
            <TemplateDialog onSubmit={handleCreateFromTemplate} />
            <CreateProjectDialog onSubmit={handleCreateProject} />
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
            <ProjectTreeList
              projects={sortedProjects}
              onDelete={handleDeleteProject}
              onToggleFavorite={handleToggleFavorite}
              deployByProjectId={deployByProjectId}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDeleteProject}
                  onToggleFavorite={handleToggleFavorite}
                  deploy={deployByProjectId.get(project.id)}
                />
              ))}
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
