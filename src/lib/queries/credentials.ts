import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import { staleTime } from './stale-time';
import type { ServiceCredential, CredentialPurpose } from '@/types';

export function useCredentials(projectId: string) {
  return useQuery({
    queryKey: queryKeys.credentials.byProject(projectId),
    staleTime: staleTime.credential,
    queryFn: async (): Promise<ServiceCredential[]> => {
      const res = await fetch(`/api/credentials?project_id=${projectId}`);
      if (!res.ok) throw new Error('계정 정보 조회 실패');
      return res.json();
    },
    enabled: !!projectId,
  });
}

export function useAddCredential(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      label: string;
      username: string;
      password: string | null;
      purpose: CredentialPurpose;
      environment: string;
      service_id?: string | null;
      website_url?: string | null;
      notes?: string | null;
    }) => {
      const res = await fetch('/api/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, ...vars }),
      });
      if (!res.ok) throw new Error('계정 정보 추가 실패');
      return res.json();
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.credentials.byProject(projectId) });
      const previous = queryClient.getQueryData<ServiceCredential[]>(queryKeys.credentials.byProject(projectId));
      const optimistic: ServiceCredential = {
        id: `temp-${Date.now()}`,
        project_id: projectId,
        label: vars.label,
        encrypted_username: '',
        encrypted_password: '',
        purpose: vars.purpose,
        environment: vars.environment as ServiceCredential['environment'],
        service_id: vars.service_id || null,
        website_url: vars.website_url || null,
        notes: vars.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      queryClient.setQueryData<ServiceCredential[]>(
        queryKeys.credentials.byProject(projectId),
        (old) => [...(old || []), optimistic],
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.credentials.byProject(projectId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.credentials.byProject(projectId) });
    },
  });
}

export function useUpdateCredential(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      id: string;
      label?: string;
      username?: string;
      password?: string;
      purpose?: CredentialPurpose;
      environment?: string;
      service_id?: string | null;
      website_url?: string | null;
      notes?: string | null;
    }) => {
      const res = await fetch('/api/credentials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vars),
      });
      if (!res.ok) throw new Error('계정 정보 수정 실패');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.credentials.byProject(projectId) });
    },
  });
}

export function useDeleteCredential(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/credentials?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('계정 정보 삭제 실패');
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.credentials.byProject(projectId) });
      const previous = queryClient.getQueryData<ServiceCredential[]>(queryKeys.credentials.byProject(projectId));
      queryClient.setQueryData<ServiceCredential[]>(
        queryKeys.credentials.byProject(projectId),
        (old) => (old || []).filter((v) => v.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.credentials.byProject(projectId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.credentials.byProject(projectId) });
    },
  });
}

export function useBulkUpdateCredentials(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      ids: string[];
      purpose?: string;
      environment?: string;
      service_id?: string | null;
    }) => {
      const res = await fetch('/api/credentials/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vars),
      });
      if (!res.ok) throw new Error('일괄 수정 실패');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.credentials.byProject(projectId) });
    },
  });
}

export function useBulkDeleteCredentials(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch('/api/credentials/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error('일괄 삭제 실패');
      return res.json();
    },
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.credentials.byProject(projectId) });
      const previous = queryClient.getQueryData<ServiceCredential[]>(queryKeys.credentials.byProject(projectId));
      queryClient.setQueryData<ServiceCredential[]>(
        queryKeys.credentials.byProject(projectId),
        (old) => (old || []).filter((v) => !ids.includes(v.id)),
      );
      return { previous };
    },
    onError: (_err, _ids, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.credentials.byProject(projectId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.credentials.byProject(projectId) });
    },
  });
}

export function useExportCredentials() {
  return useMutation({
    mutationFn: async (params: {
      project_id: string;
      ids: string[];
    }): Promise<{
      entries: Array<{
        label: string;
        username: string;
        password: string | null;
        environment: string;
        service_id: string | null;
        purpose: string;
      }>;
    }> => {
      const res = await fetch('/api/credentials/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('내보내기 실패');
      return res.json();
    },
  });
}

export function useDecryptCredential() {
  return useMutation({
    mutationFn: async (params: { id: string; field?: 'username' | 'password' | 'both' }): Promise<{ username?: string; password?: string }> => {
      const res = await fetch('/api/credentials/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id, field: params.field || 'both' }),
      });
      if (!res.ok) throw new Error('복호화 실패');
      return res.json();
    },
  });
}
