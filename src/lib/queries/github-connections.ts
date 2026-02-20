import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { GitHubConnection } from '@/types';

export function useGitHubConnections() {
  return useQuery({
    queryKey: queryKeys.github.connections,
    queryFn: async (): Promise<GitHubConnection[]> => {
      const res = await fetch('/api/account/github-connections');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'GitHub 연결 목록 조회 실패');
      }
      const data = await res.json();
      return data.connections;
    },
  });
}

export function useDeleteGitHubConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/account/github-connections?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'GitHub 연결 삭제 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.github.connections });
      queryClient.invalidateQueries({ queryKey: queryKeys.account.connectedAccounts });
    },
  });
}

export function useDisconnectGitHubConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch('/api/account/github-connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect', id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'GitHub 연결 해제 실패');
      }
      return res.json() as Promise<{ success: boolean; unlinked_count: number }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.github.connections });
      queryClient.invalidateQueries({ queryKey: queryKeys.account.connectedAccounts });
      // Invalidate all linked-repos queries (any project)
      queryClient.invalidateQueries({ queryKey: ['github', 'linked-repos'] });
    },
  });
}

export function useRenameGitHubConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, display_name }: { id: string; display_name: string }) => {
      const res = await fetch('/api/account/github-connections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, display_name }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'GitHub 연결 이름 변경 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.github.connections });
      queryClient.invalidateQueries({ queryKey: queryKeys.account.connectedAccounts });
    },
  });
}
