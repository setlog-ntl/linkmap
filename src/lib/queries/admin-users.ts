import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { AdminUserStats } from '@/app/api/admin/users/route';
import type { AdminUserDetail } from '@/app/api/admin/users/[userId]/route';

export interface AdminUserStatsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

export function useAdminUserStats(params?: AdminUserStatsParams) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.search) searchParams.set('search', params.search);
  if (params?.sort) searchParams.set('sort', params.sort);
  const qs = searchParams.toString();

  return useQuery({
    queryKey: queryKeys.admin.users(params as Record<string, unknown>),
    queryFn: async (): Promise<AdminUserStats> => {
      const res = await fetch(`/api/admin/users${qs ? `?${qs}` : ''}`);
      if (!res.ok) throw new Error('사용자 통계 조회 실패');
      return res.json() as Promise<AdminUserStats>;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminUserDetail(userId: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.userDetail(userId ?? ''),
    queryFn: async (): Promise<AdminUserDetail> => {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) throw new Error('사용자 상세 조회 실패');
      return res.json() as Promise<AdminUserDetail>;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}
