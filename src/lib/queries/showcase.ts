import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { ShowcaseCategory } from '@/types/core';

export interface ShowcaseItem {
  id: string;
  site_name: string;
  pages_url: string | null;
  deployment_url: string | null;
  deploy_method: string | null;
  deployed_at: string | null;
  created_at: string;
  user_id: string;
  showcase_description: string | null;
  showcase_tags: string[];
  showcase_category: ShowcaseCategory | null;
  showcase_image_url: string | null;
  source?: 'deploy' | 'project';
  project_icon_type?: string | null;
  project_icon_value?: string | null;
  homepage_templates: {
    id: string;
    slug: string;
    name: string;
    name_ko: string;
    framework: string;
    preview_image_url: string | null;
  } | null;
  profiles: {
    name: string | null;
    avatar_url: string | null;
  } | null;
}

export function useShowcaseList() {
  return useQuery({
    queryKey: queryKeys.showcase.list,
    queryFn: async (): Promise<ShowcaseItem[]> => {
      const res = await fetch('/api/showcase');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 조회 실패');
      }
      const data = await res.json();
      return data.showcases;
    },
    staleTime: 30_000,
  });
}

export function useShowcaseDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.showcase.detail(id),
    queryFn: async (): Promise<ShowcaseItem> => {
      const res = await fetch(`/api/showcase/${id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 조회 실패');
      }
      const data = await res.json();
      return data.showcase;
    },
    enabled: !!id,
  });
}

export function useMyShowcases() {
  return useQuery({
    queryKey: queryKeys.showcase.mine,
    queryFn: async (): Promise<ShowcaseItem[]> => {
      const res = await fetch('/api/showcase/mine');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '내 쇼케이스 조회 실패');
      }
      const data = await res.json();
      return data.showcases;
    },
  });
}

export interface ProjectDeployShowcase {
  id: string;
  site_name: string;
  deploy_status: string;
  is_showcase: boolean;
  showcase_description: string | null;
  showcase_tags: string[];
  showcase_category: ShowcaseCategory | null;
  pages_url: string | null;
  deployment_url: string | null;
}

export function useProjectShowcaseDeploy(projectId: string) {
  return useQuery({
    queryKey: queryKeys.showcase.byProject(projectId),
    queryFn: async (): Promise<ProjectDeployShowcase | null> => {
      const res = await fetch(`/api/showcase/project/${projectId}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.deploy;
    },
    enabled: !!projectId,
  });
}

// ---------- Project Showcase ----------

export interface ProjectShowcasePayload {
  projectId: string;
  action: 'register' | 'unregister' | 'update';
  description?: string;
  tags?: string[];
  category?: ShowcaseCategory;
  image_url?: string | null;
}

export function useProjectShowcase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProjectShowcasePayload): Promise<{ is_showcase?: boolean; success?: boolean }> => {
      const res = await fetch(`/api/projects/${payload.projectId}/showcase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: payload.action,
          description: payload.description,
          tags: payload.tags,
          category: payload.category,
          image_url: payload.image_url,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 처리 실패');
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.byProject(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all(variables.projectId) });
    },
  });
}

// ---------- Deploy Showcase ----------

export interface ShowcaseRegisterPayload {
  deployId: string;
  description?: string;
  tags?: string[];
  category?: ShowcaseCategory;
  image_url?: string | null;
}

export function useRegisterShowcase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ShowcaseRegisterPayload): Promise<{ is_showcase: boolean }> => {
      const res = await fetch(`/api/oneclick/deployments/${payload.deployId}/showcase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          description: payload.description,
          tags: payload.tags,
          category: payload.category,
          image_url: payload.image_url,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 등록 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
    },
  });
}

export function useUpdateShowcase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ShowcaseRegisterPayload): Promise<{ success: boolean }> => {
      const res = await fetch(`/api/oneclick/deployments/${payload.deployId}/showcase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          description: payload.description,
          tags: payload.tags,
          category: payload.category,
          image_url: payload.image_url,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 수정 실패');
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.detail(variables.deployId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
    },
  });
}

export function useUnregisterShowcase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deployId: string): Promise<{ is_showcase: boolean }> => {
      const res = await fetch(`/api/oneclick/deployments/${deployId}/showcase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unregister' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 해제 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
    },
  });
}

// Legacy: keep for backward compat with deploy-site-card toggle
export function useToggleShowcase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deployId: string): Promise<{ is_showcase: boolean }> => {
      const res = await fetch(`/api/oneclick/deployments/${deployId}/showcase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 토글 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
    },
  });
}
