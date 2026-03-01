import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { ProjectCostSummary } from '@/types';
import type { UpdateServiceCostInput } from '@/lib/validations/cost';

export function useProjectCostSummary(projectId: string) {
  return useQuery({
    queryKey: queryKeys.costs.byProject(projectId),
    queryFn: async (): Promise<ProjectCostSummary> => {
      const res = await fetch(`/api/projects/${projectId}/cost-summary`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '비용 정보 조회 실패');
      }
      return res.json();
    },
    enabled: !!projectId,
  });
}

export function useUpdateServiceCost(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectServiceId,
      ...costData
    }: { projectServiceId: string } & UpdateServiceCostInput) => {
      const res = await fetch(
        `/api/projects/${projectId}/services/${projectServiceId}/cost`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(costData),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '비용 설정 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.costs.byProject(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.all(projectId),
      });
    },
  });
}
