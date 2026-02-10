import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from './keys';
import type { HealthCheck } from '@/types';

export function useHealthChecks(projectServiceId: string) {
  return useQuery({
    queryKey: queryKeys.healthChecks.byProjectService(projectServiceId),
    queryFn: async (): Promise<HealthCheck[]> => {
      const res = await fetch(`/api/health-check?project_service_id=${projectServiceId}`);
      if (!res.ok) throw new Error('Health check 이력 조회 실패');
      return res.json();
    },
    enabled: !!projectServiceId,
  });
}

export function useLatestHealthChecks(projectId: string) {
  return useQuery({
    queryKey: queryKeys.healthChecks.latestByProject(projectId),
    queryFn: async (): Promise<Record<string, HealthCheck>> => {
      const supabase = createClient();
      const { data: services } = await supabase
        .from('project_services')
        .select('id')
        .eq('project_id', projectId);

      if (!services?.length) return {};

      const serviceIds = services.map((s) => s.id);
      const { data: checks } = await supabase
        .from('health_checks')
        .select('*')
        .in('project_service_id', serviceIds)
        .order('checked_at', { ascending: false });

      if (!checks?.length) return {};

      const results: Record<string, HealthCheck> = {};
      for (const check of checks) {
        if (!results[check.project_service_id]) {
          results[check.project_service_id] = check as HealthCheck;
        }
      }
      return results;
    },
    enabled: !!projectId,
  });
}

export function useRunHealthCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      project_service_id: string;
      environment?: string;
    }): Promise<HealthCheck> => {
      const res = await fetch('/api/health-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Health check 실행 실패');
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.healthChecks.byProjectService(data.project_service_id),
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'health-checks' && query.queryKey[1] === 'latest',
      });
      // Also invalidate services since status may have changed
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}
