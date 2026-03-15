import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from './keys';
import { staleTime } from './stale-time';
import type { Project, ProjectWithServices } from '@/types';


const supabase = createClient();

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.all,
    staleTime: staleTime.project,
    queryFn: async (): Promise<ProjectWithServices[]> => {
      const { data, error } = await supabase
        .from('projects')
        .select(`*, project_services!project_services_project_id_fkey (*, service:services (*)), project_github_repos (id)`)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    staleTime: staleTime.project,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Project;
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      techStack,
    }: {
      name: string;
      description?: string;
      techStack?: Record<string, string>;
    }) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: description || null, tech_stack: techStack || {} }),
      });
      const data = await res.json();
      if (!res.ok) {
        const err = new Error(data.error || '프로젝트 생성 실패');
        (err as unknown as Record<string, unknown>).code = data.code;
        (err as unknown as Record<string, unknown>).upgradeUrl = data.upgradeUrl;
        (err as unknown as Record<string, unknown>).current = data.current;
        (err as unknown as Record<string, unknown>).max = data.max;
        throw err;
      }
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
    queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
    queryClient.invalidateQueries({ queryKey: queryKeys.showcase.mine });
  };

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      // 404 = 이미 삭제된 프로젝트 → 성공으로 처리
      if (res.status === 404) return { success: true, alreadyDeleted: true };
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '프로젝트 삭제 실패');
      }
      return res.json();
    },
    onSuccess: invalidateAll,
    onError: invalidateAll,
  });
}

export function useRestoreProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}/restore`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '프로젝트 복구 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.trash.all });
    },
  });
}

export function usePermanentDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}/permanent`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '프로젝트 영구 삭제 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trash.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.mine });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
    } & Partial<Pick<Project, 'name' | 'description' | 'tech_stack' | 'main_service_id' | 'icon_type' | 'icon_value' | 'link_url' | 'monthly_budget' | 'budget_currency'>>) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update project');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

export function useToggleFavoriteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isFavorited }: { id: string; isFavorited: boolean }) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorited: isFavorited }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '즐겨찾기 변경 실패');
      }
      return res.json();
    },
    onMutate: async ({ id, isFavorited }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.projects.all });
      const previous = queryClient.getQueryData<ProjectWithServices[]>(queryKeys.projects.all);
      queryClient.setQueryData<ProjectWithServices[]>(queryKeys.projects.all, (old) =>
        old?.map((p) => (p.id === id ? { ...p, is_favorited: isFavorited } : p)) ?? []
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKeys.projects.all, ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}
