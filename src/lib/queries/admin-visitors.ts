import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { AdminVisitorStats } from '@/app/api/admin/visitors/route';

export function useAdminVisitorStats() {
  return useQuery({
    queryKey: queryKeys.admin.visitors,
    queryFn: async (): Promise<AdminVisitorStats> => {
      const res = await fetch('/api/admin/visitors');
      if (!res.ok) throw new Error('방문자 통계 조회 실패');
      return res.json() as Promise<AdminVisitorStats>;
    },
    staleTime: 1000 * 60 * 5, // 5분
  });
}
