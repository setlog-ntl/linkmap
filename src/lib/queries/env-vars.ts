import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from './keys';
import { staleTime } from './stale-time';
import type { EnvironmentVariable, Environment } from '@/types';

const supabase = createClient();

export function useEnvVars(projectId: string) {
  return useQuery({
    queryKey: queryKeys.envVars.byProject(projectId),
    staleTime: staleTime.envVar,
    queryFn: async (): Promise<EnvironmentVariable[]> => {
      const { data, error } = await supabase
        .from('environment_variables')
        .select('*')
        .eq('project_id', projectId)
        .is('deleted_at', null)
        .order('key_name');

      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });
}

export function useAddEnvVar(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      key_name: string;
      value: string;
      environment: Environment;
      is_secret: boolean;
      description?: string | null;
      service_id?: string | null;
    }) => {
      const res = await fetch('/api/env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, ...vars }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const err = new Error(data.error || '환경변수 추가 실패');
        (err as unknown as Record<string, unknown>).code = data.code;
        (err as unknown as Record<string, unknown>).current = data.current;
        (err as unknown as Record<string, unknown>).max = data.max;
        throw err;
      }
      return res.json() as Promise<EnvironmentVariable & { decrypted_value?: string }>;
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.envVars.byProject(projectId) });
      const previous = queryClient.getQueryData<EnvironmentVariable[]>(queryKeys.envVars.byProject(projectId));
      const optimistic: EnvironmentVariable = {
        id: `temp-${Date.now()}`,
        project_id: projectId,
        key_name: vars.key_name,
        encrypted_value: '',
        environment: vars.environment,
        is_secret: vars.is_secret,
        description: vars.description || null,
        service_id: vars.service_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      queryClient.setQueryData<EnvironmentVariable[]>(
        queryKeys.envVars.byProject(projectId),
        (old) => [...(old || []), optimistic],
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.envVars.byProject(projectId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.envVars.byProject(projectId) });
    },
  });
}

async function throwDecryptError(res: Response): Promise<never> {
  const data = await res.json().catch(() => ({} as { error?: string; code?: string }));
  throw new Error(
    data.code === 'MFA_REQUIRED'
      ? '값을 보려면 2단계 인증이 필요합니다. 설정에서 인증 후 다시 시도해주세요.'
      : data.error || '값 복호화에 실패했습니다',
  );
}

export function useDecryptEnvVar() {
  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const res = await fetch('/api/env/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) await throwDecryptError(res);
      const data = await res.json();
      return data.value;
    },
  });
}

const DECRYPT_BATCH_SIZE = 200;

/** 여러 환경변수를 한 번에 복호화 (전체 보기 / .env 전체 복사용) */
export function useDecryptManyEnvVars() {
  return useMutation({
    mutationFn: async (ids: string[]): Promise<Record<string, string>> => {
      const merged: Record<string, string> = {};
      for (let i = 0; i < ids.length; i += DECRYPT_BATCH_SIZE) {
        const chunk = ids.slice(i, i + DECRYPT_BATCH_SIZE);
        const res = await fetch('/api/env/decrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: chunk }),
        });
        if (!res.ok) await throwDecryptError(res);
        const data = await res.json();
        Object.assign(merged, data.values as Record<string, string>);
      }
      return merged;
    },
  });
}

export function useUpdateEnvVar(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      id: string;
      key_name?: string;
      value?: string;
      environment?: Environment;
      is_secret?: boolean;
      description?: string | null;
      service_id?: string | null;
    }) => {
      const res = await fetch('/api/env', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vars),
      });
      if (!res.ok) throw new Error('환경변수 수정 실패');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.envVars.byProject(projectId) });
    },
  });
}

export function useEnvConflicts(projectId: string) {
  return useQuery({
    queryKey: queryKeys.envVars.conflicts(projectId),
    staleTime: staleTime.envVar,
    queryFn: async () => {
      const res = await fetch(`/api/env/conflicts?project_id=${projectId}`);
      if (!res.ok) throw new Error('충돌 검사 실패');
      return res.json() as Promise<{
        conflicts: import('@/lib/env/conflict-detector').EnvConflict[];
        scanned_at: string;
      }>;
    },
    enabled: !!projectId,
  });
}

export function useResolveConflict(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      key_name: string;
      source_env: string;
      target_envs: string[];
      action: 'copy' | 'delete';
    }) => {
      const res = await fetch('/api/env/conflicts/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, ...params }),
      });
      if (!res.ok) throw new Error('충돌 해결 실패');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.envVars.conflicts(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.envVars.byProject(projectId) });
    },
  });
}

export function useDeleteEnvVar(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/env?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('환경변수 삭제 실패');
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.envVars.byProject(projectId) });
      const previous = queryClient.getQueryData<EnvironmentVariable[]>(queryKeys.envVars.byProject(projectId));
      queryClient.setQueryData<EnvironmentVariable[]>(
        queryKeys.envVars.byProject(projectId),
        (old) => (old || []).filter((v) => v.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.envVars.byProject(projectId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.envVars.byProject(projectId) });
    },
  });
}

export function useRestoreEnvVar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/env/restore?id=${id}`, { method: 'POST' });
      if (!res.ok) throw new Error('환경변수 복구 실패');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trash.all });
    },
  });
}

export function usePermanentDeleteEnvVar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/env/permanent?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('환경변수 영구 삭제 실패');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trash.all });
    },
  });
}

export function useSyncEnvServices(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<{
      updated_vars: number;
      added_services: number;
      updated_statuses: number;
      auto_connections: number;
      matched_details: { key_name: string; service_name: string; confidence: 'exact' | 'prefix' }[];
      added_service_names: string[];
    }> => {
      const res = await fetch('/api/env/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId }),
      });
      if (!res.ok) throw new Error('동기화 실패');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.byProject(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.envVars.byProject(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.byProject(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all(projectId) });
    },
  });
}
