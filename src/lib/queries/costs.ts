import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { ProjectCostSummary, OpenAIUsageSummary } from '@/types';
import type { UpdateServiceCostInput, ClientUsageData } from '@/lib/validations/cost';

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

/** OpenAI 사용량 현황 조회 */
export function useOpenAIUsage(
  projectId: string,
  projectServiceId: string,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.costs.openaiUsage(projectServiceId),
    queryFn: async (): Promise<OpenAIUsageSummary> => {
      const res = await fetch(
        `/api/projects/${projectId}/services/${projectServiceId}/usage`
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? 'OpenAI 사용량 조회 실패'
        );
      }
      return res.json();
    },
    enabled: !!projectId && !!projectServiceId && enabled,
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });
}

/** OpenAI 사용량 동기화 */
export function useSyncOpenAIUsage(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectServiceId,
      apiKey,
      usageData,
    }: {
      projectServiceId: string;
      apiKey?: string;
      usageData?: ClientUsageData;
    }) => {
      const res = await fetch(
        `/api/projects/${projectId}/services/${projectServiceId}/usage/sync`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(apiKey ? { api_key: apiKey } : {}),
            ...(usageData ? { usage_data: usageData } : {}),
          }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? 'OpenAI 사용량 동기화 실패'
        );
      }
      return res.json() as Promise<OpenAIUsageSummary>;
    },
    onSuccess: (_, { projectServiceId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.costs.openaiUsage(projectServiceId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.costs.byProject(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.all(projectId),
      });
    },
  });
}
