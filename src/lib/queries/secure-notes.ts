import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import { staleTime } from './stale-time';
import type { SecureNote, SecureNoteCategory } from '@/types';

export function useSecureNotes(projectId: string) {
  return useQuery({
    queryKey: queryKeys.secureNotes.byProject(projectId),
    staleTime: staleTime.secureNote,
    queryFn: async (): Promise<SecureNote[]> => {
      const res = await fetch(`/api/secure-notes?project_id=${projectId}`);
      if (!res.ok) throw new Error('보안 메모 조회 실패');
      return res.json();
    },
    enabled: !!projectId,
  });
}

export function useAddSecureNote(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      title: string;
      category: SecureNoteCategory;
      content: string;
      environment: string;
      service_id?: string | null;
      notes?: string | null;
    }): Promise<SecureNote> => {
      const res = await fetch('/api/secure-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, ...vars }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({} as { error?: string }));
        throw new Error(data.error || '보안 메모 추가 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.secureNotes.byProject(projectId) });
    },
  });
}

export function useUpdateSecureNote(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      id: string;
      title?: string;
      category?: SecureNoteCategory;
      content?: string;
      environment?: string;
      service_id?: string | null;
      notes?: string | null;
    }) => {
      const res = await fetch('/api/secure-notes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vars),
      });
      if (!res.ok) throw new Error('보안 메모 수정 실패');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.secureNotes.byProject(projectId) });
    },
  });
}

export function useDeleteSecureNote(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/secure-notes?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('보안 메모 삭제 실패');
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.secureNotes.byProject(projectId) });
      const previous = queryClient.getQueryData<SecureNote[]>(queryKeys.secureNotes.byProject(projectId));
      queryClient.setQueryData<SecureNote[]>(
        queryKeys.secureNotes.byProject(projectId),
        (old) => (old || []).filter((n) => n.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.secureNotes.byProject(projectId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.secureNotes.byProject(projectId) });
    },
  });
}

export function useDecryptSecureNote() {
  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const res = await fetch('/api/secure-notes/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({} as { error?: string; code?: string }));
        throw new Error(
          data.code === 'MFA_REQUIRED'
            ? '값을 보려면 2단계 인증이 필요합니다. 설정에서 인증 후 다시 시도해주세요.'
            : data.error || '복호화에 실패했습니다',
        );
      }
      const data = await res.json();
      return data.content;
    },
  });
}
