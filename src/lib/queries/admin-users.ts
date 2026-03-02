import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { AdminUserStats } from '@/app/api/admin/users/route';

export function useAdminUserStats() {
  return useQuery({
    queryKey: queryKeys.admin.users,
    queryFn: async (): Promise<AdminUserStats> => {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('사용자 통계 조회 실패');
      return res.json() as Promise<AdminUserStats>;
    },
    staleTime: 1000 * 60 * 5, // 5분
  });
}
