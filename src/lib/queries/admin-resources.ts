import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { FreeResourceRow } from '@/types';
import type { CreateResourceInput, UpdateResourceInput } from '@/lib/validations/resource';

/** 관리자 자료 목록 — 미발행 포함 (RLS admin_full_access) */
const STALE_TIME = 60 * 1000;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || `요청 실패 (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function useAdminResources() {
  return useQuery({
    queryKey: queryKeys.admin.resources,
    queryFn: () => request<{ resources: FreeResourceRow[] }>('/api/admin/resources'),
    select: (data) => data.resources,
    staleTime: STALE_TIME,
  });
}

export function useAdminResource(id: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.resource(id ?? ''),
    queryFn: () => request<{ resource: FreeResourceRow }>(`/api/admin/resources/${id}`),
    select: (data) => data.resource,
    enabled: !!id,
    staleTime: STALE_TIME,
  });
}

export function useCreateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateResourceInput) =>
      request<{ resource: FreeResourceRow }>('/api/admin/resources', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.admin.resources }),
  });
}

export function useUpdateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateResourceInput & { id: string }) =>
      request<{ resource: FreeResourceRow }>(`/api/admin/resources/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      }),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.resources });
      qc.invalidateQueries({ queryKey: queryKeys.admin.resource(id) });
    },
  });
}

export function useDeleteResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      request<{ success: boolean }>(`/api/admin/resources/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.admin.resources }),
  });
}
