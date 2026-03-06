import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import { staleTime } from './stale-time';
import type { TrashItem } from '@/app/api/trash/route';

export function useTrashedItems() {
  return useQuery({
    queryKey: queryKeys.trash.all,
    staleTime: staleTime.trash,
    queryFn: async (): Promise<TrashItem[]> => {
      const res = await fetch('/api/trash');
      if (!res.ok) throw new Error('휴지통 목록을 불러올 수 없습니다');
      const data = await res.json();
      return data.items as TrashItem[];
    },
  });
}

export function useEmptyTrash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/trash', { method: 'DELETE' });
      if (!res.ok) throw new Error('휴지통 비우기에 실패했습니다');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trash.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
    },
  });
}
