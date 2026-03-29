import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from './keys';
import type { ProjectService, Service } from '@/types';

export function useCatalogServices() {
  return useQuery({
    queryKey: queryKeys.catalog.all,
    queryFn: async (): Promise<Service[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('is_custom', { ascending: true })
        .order('name');
      if (error) throw error;
      return (data as Service[]) || [];
    },
    staleTime: 5 * 60 * 1000, // 5분 캐시
  });
}

// ─── Custom Service Hooks ───────────────────────────────

export function useMyCustomServices() {
  return useQuery({
    queryKey: queryKeys.catalog.custom,
    queryFn: async (): Promise<Service[]> => {
      const res = await fetch('/api/services/custom');
      if (!res.ok) throw new Error('커스텀 서비스 조회 실패');
      const json = await res.json();
      return json.services as Service[];
    },
  });
}

export function useCreateCustomService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      category?: string;
      description?: string;
      icon_emoji?: string;
      website_url?: string;
      docs_url?: string;
    }) => {
      const res = await fetch('/api/services/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || '커스텀 서비스 생성 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.custom });
    },
  });
}

export function useUpdateCustomService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: {
      id: string;
      name?: string;
      category?: string;
      description?: string;
      icon_emoji?: string;
      website_url?: string;
      docs_url?: string;
    }) => {
      const res = await fetch(`/api/services/custom/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || '커스텀 서비스 수정 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.custom });
    },
  });
}

export function useDeleteCustomService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/services/custom/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || '커스텀 서비스 삭제 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.custom });
    },
  });
}

// ─── Custom Service Match / Migrate Hooks ────────────────

interface CustomServiceMatch {
  customService: Service;
  globalService: Service;
}

export function useCustomServiceMatches(enabled = true) {
  return useQuery({
    queryKey: queryKeys.catalog.matches,
    queryFn: async (): Promise<CustomServiceMatch[]> => {
      const res = await fetch('/api/services/custom/matches');
      if (!res.ok) throw new Error('매칭 서비스 조회 실패');
      const json = await res.json();
      return json.matches as CustomServiceMatch[];
    },
    enabled,
  });
}

export function useMigrateCustomService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customServiceId, globalServiceId }: {
      customServiceId: string;
      globalServiceId: string;
    }) => {
      const res = await fetch(`/api/services/custom/${customServiceId}/migrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ globalServiceId }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || '서비스 전환에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.custom });
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.matches });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

export function useProjectServices(projectId: string) {
  return useQuery({
    queryKey: queryKeys.services.byProject(projectId),
    queryFn: async (): Promise<(ProjectService & { service: Service })[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('project_services')
        .select('*, service:services(*)')
        .eq('project_id', projectId)
        .order('created_at');

      if (error) throw error;
      return (data as (ProjectService & { service: Service })[]) || [];
    },
    enabled: !!projectId,
  });
}

export function useAddProjectService(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: string | { serviceId: string; instanceLabel?: string }) => {
      const serviceId = typeof params === 'string' ? params : params.serviceId;
      const instanceLabel = typeof params === 'string' ? null : (params.instanceLabel ?? null);
      const supabase = createClient();
      const { error } = await supabase.from('project_services').insert({
        project_id: projectId,
        service_id: serviceId,
        status: 'not_started',
        instance_label: instanceLabel,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.byProject(projectId) });
    },
  });
}

export function useRemoveProjectService(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectServiceId: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from('project_services')
        .delete()
        .eq('id', projectServiceId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.byProject(projectId) });
    },
  });
}

export function useUpdateProjectServiceAccount(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectServiceId, accountIdentifier }: {
      projectServiceId: string;
      accountIdentifier: string | null;
    }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('project_services')
        .update({ account_identifier: accountIdentifier })
        .eq('id', projectServiceId)
        .select('id')
        .single();
      if (error) throw error;
      if (!data) throw new Error('업데이트 권한이 없거나 대상을 찾을 수 없습니다');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.byProject(projectId) });
    },
  });
}
