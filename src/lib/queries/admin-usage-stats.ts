import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { AdminUsageStats } from '@/app/api/admin/usage-stats/route';

export function useAdminUsageStats() {
  return useQuery({
    queryKey: queryKeys.admin.usageStats,
    queryFn: async (): Promise<AdminUsageStats> => {
      const res = await fetch('/api/admin/usage-stats');
      if (!res.ok) throw new Error('기능 사용 통계 조회 실패');
      return res.json() as Promise<AdminUsageStats>;
    },
    staleTime: 1000 * 60 * 5,
  });
}
