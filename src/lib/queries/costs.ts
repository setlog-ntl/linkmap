import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { ProjectCostSummary, OpenAIUsageSummary, CostAttachment } from '@/types';
import type { UpdateServiceCostInput, ClientUsageData } from '@/lib/validations/cost';
import type { AttachmentType } from '@/types/dashboard';

/** USD → KRW 환율 조회 (하루 1회 업데이트, 24h 캐시) */
export function useExchangeRate() {
  return useQuery({
    queryKey: queryKeys.exchangeRate,
    queryFn: async (): Promise<{ rate: number; updatedAt: string | null; fallback: boolean }> => {
      const res = await fetch('/api/exchange-rate');
      if (!res.ok) return { rate: 1350, updatedAt: null, fallback: true };
      return res.json();
    },
    staleTime: 1000 * 60 * 60,       // 1시간 stale
    gcTime: 1000 * 60 * 60 * 24,     // 24시간 gc
  });
}

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

/** 첨부 파일 목록 조회 */
export function useCostAttachments(projectId: string, projectServiceId: string) {
  return useQuery({
    queryKey: queryKeys.costs.attachments(projectServiceId),
    queryFn: async (): Promise<CostAttachment[]> => {
      const res = await fetch(
        `/api/projects/${projectId}/services/${projectServiceId}/cost/attachments`
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? '첨부 파일 조회 실패');
      }
      return res.json();
    },
    enabled: !!projectId && !!projectServiceId,
    staleTime: 1000 * 60 * 5,
  });
}

/** 첨부 파일 업로드 */
export function useUploadCostAttachment(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectServiceId,
      file,
      attachmentType,
      notes,
    }: {
      projectServiceId: string;
      file: File;
      attachmentType?: AttachmentType;
      notes?: string;
    }): Promise<CostAttachment> => {
      const formData = new FormData();
      formData.append('file', file);
      if (attachmentType) formData.append('attachment_type', attachmentType);
      if (notes) formData.append('notes', notes);

      const res = await fetch(
        `/api/projects/${projectId}/services/${projectServiceId}/cost/attachments`,
        { method: 'POST', body: formData }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? '파일 업로드 실패');
      }
      return res.json();
    },
    onSuccess: (_, { projectServiceId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.costs.attachments(projectServiceId),
      });
    },
  });
}

/** 첨부 파일 삭제 */
export function useDeleteCostAttachment(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectServiceId,
      attachmentId,
    }: {
      projectServiceId: string;
      attachmentId: string;
    }) => {
      const res = await fetch(
        `/api/projects/${projectId}/services/${projectServiceId}/cost/attachments/${attachmentId}`,
        { method: 'DELETE' }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? '파일 삭제 실패');
      }
    },
    onSuccess: (_, { projectServiceId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.costs.attachments(projectServiceId),
      });
    },
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
