import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { UserConnection, UserConnectionType, ConnectionStatus } from '@/types';

interface AutoConnectSuggestion {
  source_service_id: string;
  target_service_id: string;
  connection_type: UserConnectionType;
  reason: string;
  dependency_type: string;
}

export function useProjectConnections(projectId: string) {
  return useQuery({
    queryKey: queryKeys.connections.byProject(projectId),
    queryFn: async (): Promise<UserConnection[]> => {
      const res = await fetch(`/api/connections?project_id=${projectId}`);
      if (!res.ok) throw new Error('연결 목록을 불러올 수 없습니다');
      return res.json();
    },
    enabled: !!projectId,
    staleTime: 30_000, // 30초 캐시 — 불필요한 refetch 방지
  });
}

interface CreateConnectionParams {
  project_id: string;
  source_service_id: string;
  target_service_id: string;
  connection_type: UserConnectionType;
  connection_status?: ConnectionStatus;
  label?: string | null;
  description?: string | null;
}

export function useCreateConnection(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateConnectionParams): Promise<UserConnection> => {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '연결 생성에 실패했습니다');
      }
      return res.json();
    },
    // 낙관적 업데이트: 서버 응답 전에 즉시 엣지 표시
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.connections.byProject(projectId) });
      const previous = queryClient.getQueryData<UserConnection[]>(queryKeys.connections.byProject(projectId));

      const now = new Date().toISOString();
      const optimistic: UserConnection = {
        id: `temp-${Date.now()}`,
        project_id: params.project_id,
        source_service_id: params.source_service_id,
        target_service_id: params.target_service_id,
        connection_type: params.connection_type,
        connection_status: params.connection_status ?? 'active',
        label: params.label || null,
        description: params.description || null,
        last_verified_at: null,
        metadata: {},
        created_by: '',
        created_at: now,
        updated_at: now,
      };

      queryClient.setQueryData<UserConnection[]>(
        queryKeys.connections.byProject(projectId),
        (old) => [...(old || []), optimistic],
      );

      return { previous };
    },
    onError: (_err, _params, context) => {
      // 에러 시 이전 데이터로 롤백
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.connections.byProject(projectId), context.previous);
      }
    },
    onSettled: () => {
      // 성공/실패 후 서버 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.byProject(projectId) });
    },
  });
}

interface UpdateConnectionParams {
  id: string;
  connection_type?: UserConnectionType;
  connection_status?: ConnectionStatus;
  label?: string | null;
  description?: string | null;
}

export function useUpdateConnection(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...body }: UpdateConnectionParams): Promise<UserConnection> => {
      const res = await fetch(`/api/connections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '연결 수정에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.byProject(projectId) });
    },
  });
}

export function useDeleteConnection(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectionId: string): Promise<void> => {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '연결 삭제에 실패했습니다');
      }
    },
    // 낙관적 삭제
    onMutate: async (connectionId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.connections.byProject(projectId) });
      const previous = queryClient.getQueryData<UserConnection[]>(queryKeys.connections.byProject(projectId));

      queryClient.setQueryData<UserConnection[]>(
        queryKeys.connections.byProject(projectId),
        (old) => (old || []).filter((c) => c.id !== connectionId),
      );

      return { previous };
    },
    onError: (_err, _connectionId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.connections.byProject(projectId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.byProject(projectId) });
    },
  });
}

export function useAutoConnectSuggestions(projectId: string) {
  return useQuery({
    queryKey: [...queryKeys.connections.byProject(projectId), 'auto-suggestions'] as const,
    queryFn: async (): Promise<AutoConnectSuggestion[]> => {
      const res = await fetch(`/api/connections/auto?project_id=${projectId}`);
      if (!res.ok) throw new Error('자동 연결 제안을 불러올 수 없습니다');
      const json = await res.json();
      return json.suggestions;
    },
    enabled: !!projectId,
    staleTime: 60_000,
  });
}

export function useAutoConnect(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      suggestions: Array<{ source_service_id: string; target_service_id: string; connection_type: string }>
    ): Promise<{ created: UserConnection[] }> => {
      const res = await fetch('/api/connections/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, suggestions }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '자동 연결 생성에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.byProject(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all(projectId) });
    },
  });
}
