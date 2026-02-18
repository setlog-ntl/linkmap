import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { DashboardResponse } from '@/types';

export function useDashboard(projectId: string) {
  return useQuery({
    queryKey: queryKeys.dashboard.all(projectId),
    queryFn: async (): Promise<DashboardResponse> => {
      const res = await fetch(`/api/projects/${projectId}/dashboard`);
      if (!res.ok) {
        throw new Error(`Dashboard fetch failed: ${res.status}`);
      }
      return res.json();
    },
    enabled: !!projectId,
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}
