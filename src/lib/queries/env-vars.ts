import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from './keys';
import type { EnvironmentVariable, Environment } from '@/types';

const supabase = createClient();

export function useEnvVars(projectId: string) {
  return useQuery({
    queryKey: queryKeys.envVars.byProject(projectId),
    queryFn: async (): Promise<EnvironmentVariable[]> => {
      const { data, error } = await supabase
        .from('environment_variables')
        .select('*')
        .eq('project_id', projectId)
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
      if (!res.ok) throw new Error('환경변수 추가 실패');
      return res.json();
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

export function useDecryptEnvVar() {
  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const res = await fetch('/api/env/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('복호화 실패');
      const data = await res.json();
      return data.value;
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
      is_secret?: boolean;
      description?: string | null;
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
