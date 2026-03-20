import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';

interface ShareStatus {
  enabled: boolean;
  shareToken: string | null;
  sharedAt: string | null;
}

export function useShareStatus(projectId: string) {
  return useQuery<ShareStatus>({
    queryKey: queryKeys.share.status(projectId),
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/share`);
      if (!res.ok) throw new Error('Failed to fetch share status');
      return res.json();
    },
    enabled: !!projectId,
  });
}

export function useToggleShare(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      const res = await fetch(`/api/projects/${projectId}/share`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error('Failed to toggle share');
      return res.json() as Promise<ShareStatus>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.share.status(projectId), data);
    },
  });
}
