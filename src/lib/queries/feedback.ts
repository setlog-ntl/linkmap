'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { queryKeys } from './keys';
import type {
  FeedbackListParams,
  FeedbackListResponse,
  FeatureRequestWithMeta,
  FeatureRequestCommentWithAuthor,
} from '@/types/feedback';

// ─── 목록 조회 ────────────────────────────────────────────────────────────────

async function fetchFeedbackList(params: FeedbackListParams): Promise<FeedbackListResponse> {
  const searchParams = new URLSearchParams();
  if (params.category) searchParams.set('category', params.category);
  if (params.status) searchParams.set('status', params.status);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const res = await fetch(`/api/feedback?${searchParams.toString()}`);
  if (!res.ok) throw new Error('목록 조회 실패');
  return res.json() as Promise<FeedbackListResponse>;
}

export function useFeedbackList(
  params: FeedbackListParams = {},
  options?: Omit<UseQueryOptions<FeedbackListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.feedback.list(params as Record<string, unknown>),
    queryFn: () => fetchFeedbackList(params),
    staleTime: 60_000,
    ...options,
  });
}

// ─── 상세 조회 ────────────────────────────────────────────────────────────────

async function fetchFeedbackDetail(id: string): Promise<FeatureRequestWithMeta> {
  const res = await fetch(`/api/feedback/${id}`);
  if (!res.ok) throw new Error('상세 조회 실패');
  const json = await res.json() as { item: FeatureRequestWithMeta };
  return json.item;
}

export function useFeedbackDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.feedback.detail(id),
    queryFn: () => fetchFeedbackDetail(id),
    enabled: !!id,
  });
}

// ─── 댓글 목록 ────────────────────────────────────────────────────────────────

async function fetchFeedbackComments(id: string): Promise<FeatureRequestCommentWithAuthor[]> {
  const res = await fetch(`/api/feedback/${id}/comments`);
  if (!res.ok) throw new Error('댓글 조회 실패');
  const json = await res.json() as { comments: FeatureRequestCommentWithAuthor[] };
  return json.comments;
}

export function useFeedbackComments(id: string) {
  return useQuery({
    queryKey: queryKeys.feedback.comments(id),
    queryFn: () => fetchFeedbackComments(id),
    enabled: !!id,
  });
}

// ─── 새 요청 작성 ─────────────────────────────────────────────────────────────

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { title: string; description: string; category: string; is_anonymous?: boolean; page_context?: string | null }) => {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error ?? '작성 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.feedback.list() });
    },
  });
}

// ─── 투표 토글 (낙관적 업데이트) ─────────────────────────────────────────────

export function useToggleFeedbackVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hasVoted }: { id: string; hasVoted: boolean }) => {
      const method = hasVoted ? 'DELETE' : 'POST';
      const res = await fetch(`/api/feedback/${id}/vote`, { method });
      if (!res.ok && res.status !== 204) {
        const err = await res.json() as { error: string };
        throw new Error(err.error ?? '투표 처리 실패');
      }
    },
    onMutate: async ({ id, hasVoted }) => {
      // 목록 캐시 낙관적 업데이트
      await queryClient.cancelQueries({ queryKey: queryKeys.feedback.list() });
      await queryClient.cancelQueries({ queryKey: queryKeys.feedback.detail(id) });

      const prevDetail = queryClient.getQueryData<FeatureRequestWithMeta>(
        queryKeys.feedback.detail(id)
      );

      // 상세 낙관적 업데이트
      if (prevDetail) {
        queryClient.setQueryData<FeatureRequestWithMeta>(queryKeys.feedback.detail(id), {
          ...prevDetail,
          has_voted: !hasVoted,
          vote_count: hasVoted ? prevDetail.vote_count - 1 : prevDetail.vote_count + 1,
        });
      }

      // 목록 낙관적 업데이트
      const prevList = queryClient.getQueriesData<FeedbackListResponse>({
        queryKey: ['feedback', 'list'],
      });
      prevList.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<FeedbackListResponse>(key, {
          ...data,
          items: data.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  has_voted: !hasVoted,
                  vote_count: hasVoted ? item.vote_count - 1 : item.vote_count + 1,
                }
              : item
          ),
        });
      });

      return { prevDetail, prevList };
    },
    onError: (_err, { id }, context) => {
      if (context?.prevDetail) {
        queryClient.setQueryData(queryKeys.feedback.detail(id), context.prevDetail);
      }
      context?.prevList?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: (_data, _error, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.feedback.detail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.feedback.list() });
    },
  });
}

// ─── 관리자 상태 변경 ─────────────────────────────────────────────────────────

export function useUpdateFeedbackStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      admin_note,
    }: {
      id: string;
      status?: string;
      admin_note?: string | null;
    }) => {
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_note }),
      });
      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error ?? '상태 변경 실패');
      }
      return res.json();
    },
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.feedback.detail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.feedback.list() });
    },
  });
}

// ─── 댓글 작성 ────────────────────────────────────────────────────────────────

export function useCreateFeedbackComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const res = await fetch(`/api/feedback/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error ?? '댓글 작성 실패');
      }
      return res.json();
    },
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.feedback.comments(id) });
    },
  });
}

// ─── 요청 삭제 ────────────────────────────────────────────────────────────────

export function useDeleteFeedback() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        try {
          const err = await res.json() as { error?: string };
          throw new Error(err.error ?? '삭제에 실패했습니다');
        } catch {
          throw new Error('삭제에 실패했습니다');
        }
      }
    },
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.feedback.detail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.feedback.list() });
      toast.success('요청이 삭제되었습니다');
      router.push('/feedback');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
