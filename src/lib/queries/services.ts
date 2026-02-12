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
        .order('name');
      if (error) throw error;
      return (data as Service[]) || [];
    },
    staleTime: 5 * 60 * 1000, // 5분 캐시
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
    mutationFn: async (serviceId: string) => {
      const supabase = createClient();
      const { error } = await supabase.from('project_services').insert({
        project_id: projectId,
        service_id: serviceId,
        status: 'not_started',
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
