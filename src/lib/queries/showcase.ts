import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type {
  ShowcaseCategory,
  ShowcaseComment,
  ShowcaseItemWithScore,
  MonthlyPick,
  ShowcaseBadge,
  AdminAction,
  LeaderboardPeriod,
} from '@/types/core';

export interface ShowcaseItem {
  id: string;
  site_name: string;
  pages_url: string | null;
  deployment_url: string | null;
  deploy_method: string | null;
  deployed_at: string | null;
  created_at: string;
  user_id: string;
  showcase_description: string | null;
  showcase_tags: string[];
  showcase_category: ShowcaseCategory | null;
  showcase_image_url: string | null;
  like_count: number;
  comment_count: number;
  view_count?: number;
  source?: 'deploy' | 'project';
  project_icon_type?: string | null;
  project_icon_value?: string | null;
  homepage_templates: {
    id: string;
    slug: string;
    name: string;
    name_ko: string;
    framework: string;
    preview_image_url: string | null;
  } | null;
  profiles: {
    name: string | null;
    avatar_url: string | null;
  } | null;
}

export function useShowcaseList() {
  return useQuery({
    queryKey: queryKeys.showcase.list,
    queryFn: async (): Promise<ShowcaseItem[]> => {
      const res = await fetch('/api/showcase');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 조회 실패');
      }
      const data = await res.json();
      return data.showcases;
    },
    staleTime: 30_000,
  });
}

export function useShowcaseDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.showcase.detail(id),
    queryFn: async (): Promise<ShowcaseItem> => {
      const res = await fetch(`/api/showcase/${id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 조회 실패');
      }
      const data = await res.json();
      return data.showcase;
    },
    enabled: !!id,
  });
}

export function useMyShowcases() {
  return useQuery({
    queryKey: queryKeys.showcase.mine,
    queryFn: async (): Promise<ShowcaseItem[]> => {
      const res = await fetch('/api/showcase/mine');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '내 쇼케이스 조회 실패');
      }
      const data = await res.json();
      return data.showcases;
    },
  });
}

export interface ProjectDeployShowcase {
  id: string;
  site_name: string;
  deploy_status: string;
  is_showcase: boolean;
  showcase_description: string | null;
  showcase_tags: string[];
  showcase_category: ShowcaseCategory | null;
  pages_url: string | null;
  deployment_url: string | null;
}

export function useProjectShowcaseDeploy(projectId: string) {
  return useQuery({
    queryKey: queryKeys.showcase.byProject(projectId),
    queryFn: async (): Promise<ProjectDeployShowcase | null> => {
      const res = await fetch(`/api/showcase/project/${projectId}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.deploy;
    },
    enabled: !!projectId,
  });
}

// ---------- Project Showcase ----------

export interface ProjectShowcasePayload {
  projectId: string;
  action: 'register' | 'unregister' | 'update';
  description?: string;
  tags?: string[];
  category?: ShowcaseCategory;
  image_url?: string | null;
}

export function useProjectShowcase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProjectShowcasePayload): Promise<{ is_showcase?: boolean; success?: boolean }> => {
      const res = await fetch(`/api/projects/${payload.projectId}/showcase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: payload.action,
          description: payload.description,
          tags: payload.tags,
          category: payload.category,
          image_url: payload.image_url,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 처리 실패');
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.byProject(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all(variables.projectId) });
    },
  });
}

// ---------- Deploy Showcase ----------

export interface ShowcaseRegisterPayload {
  deployId: string;
  description?: string;
  tags?: string[];
  category?: ShowcaseCategory;
  image_url?: string | null;
}

export function useRegisterShowcase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ShowcaseRegisterPayload): Promise<{ is_showcase: boolean }> => {
      const res = await fetch(`/api/oneclick/deployments/${payload.deployId}/showcase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          description: payload.description,
          tags: payload.tags,
          category: payload.category,
          image_url: payload.image_url,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 등록 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
    },
  });
}

export function useUpdateShowcase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ShowcaseRegisterPayload): Promise<{ success: boolean }> => {
      const res = await fetch(`/api/oneclick/deployments/${payload.deployId}/showcase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          description: payload.description,
          tags: payload.tags,
          category: payload.category,
          image_url: payload.image_url,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 수정 실패');
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.detail(variables.deployId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
    },
  });
}

export function useUnregisterShowcase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deployId: string): Promise<{ is_showcase: boolean }> => {
      const res = await fetch(`/api/oneclick/deployments/${deployId}/showcase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unregister' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 해제 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
    },
  });
}

// ---------- Likes ----------

export interface LikeStatus {
  liked: boolean;
  like_count: number;
}

export function useShowcaseLikeStatus(showcaseId: string) {
  return useQuery({
    queryKey: queryKeys.showcase.likes(showcaseId),
    queryFn: async (): Promise<LikeStatus> => {
      const res = await fetch(`/api/showcase/${showcaseId}/likes`);
      if (!res.ok) return { liked: false, like_count: 0 };
      return res.json();
    },
    enabled: !!showcaseId,
  });
}

export function useToggleShowcaseLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ showcaseId, source }: { showcaseId: string; source: 'deploy' | 'project' }): Promise<LikeStatus> => {
      const res = await fetch(`/api/showcase/${showcaseId}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '추천 처리 실패');
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.likes(variables.showcaseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.detail(variables.showcaseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
      queryClient.invalidateQueries({ queryKey: ['showcase', 'leaderboard'] });
    },
  });
}

// ---------- Comments ----------

export function useShowcaseComments(showcaseId: string) {
  return useQuery({
    queryKey: queryKeys.showcase.comments(showcaseId),
    queryFn: async (): Promise<ShowcaseComment[]> => {
      const res = await fetch(`/api/showcase/${showcaseId}/comments`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.comments;
    },
    enabled: !!showcaseId,
  });
}

export function useCreateShowcaseComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ showcaseId, source, content }: { showcaseId: string; source: 'deploy' | 'project'; content: string }): Promise<ShowcaseComment> => {
      const res = await fetch(`/api/showcase/${showcaseId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '댓글 작성 실패');
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.comments(variables.showcaseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.detail(variables.showcaseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
    },
  });
}

export function useDeleteShowcaseComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ showcaseId, commentId }: { showcaseId: string; commentId: string }): Promise<void> => {
      const res = await fetch(`/api/showcase/${showcaseId}/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '댓글 삭제 실패');
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.comments(variables.showcaseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.detail(variables.showcaseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
    },
  });
}

// ---------- Leaderboard ----------

export function useShowcaseLeaderboard(period: LeaderboardPeriod = 'month') {
  return useQuery({
    queryKey: queryKeys.showcase.leaderboard(period),
    queryFn: async (): Promise<ShowcaseItemWithScore[]> => {
      const res = await fetch(`/api/showcase/leaderboard?period=${period}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '리더보드 조회 실패');
      }
      const data = await res.json();
      return data.showcases;
    },
    staleTime: 30_000,
  });
}

// ---------- View Count ----------

export function useRecordShowcaseView() {
  return useMutation({
    mutationFn: async (showcaseId: string): Promise<{ recorded: boolean }> => {
      const res = await fetch(`/api/showcase/${showcaseId}/view`, {
        method: 'POST',
      });
      if (!res.ok) return { recorded: false };
      return res.json();
    },
  });
}

// ---------- Monthly Picks ----------

export function useMonthlyPicks(month?: string) {
  return useQuery({
    queryKey: queryKeys.showcase.monthlyPicks(month),
    queryFn: async (): Promise<MonthlyPick[]> => {
      const params = month ? `?month=${month}` : '';
      const res = await fetch(`/api/showcase/monthly-picks${params}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.picks;
    },
    staleTime: 60_000,
  });
}

export function useMonthlyArchive() {
  return useQuery({
    queryKey: queryKeys.showcase.monthlyArchive,
    queryFn: async (): Promise<{ year_month: string; count: number }[]> => {
      const res = await fetch('/api/showcase/monthly-picks/archive');
      if (!res.ok) return [];
      const data = await res.json();
      return data.months;
    },
    staleTime: 300_000,
  });
}

// ---------- Badges ----------

export function useUserBadges(userId: string) {
  return useQuery({
    queryKey: queryKeys.showcase.badges(userId),
    queryFn: async (): Promise<ShowcaseBadge[]> => {
      const res = await fetch(`/api/showcase/badges?userId=${userId}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.badges;
    },
    enabled: !!userId,
  });
}

// ---------- Admin Actions ----------

export function useAdminShowcaseAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      showcaseId: string;
      source: 'deploy' | 'project';
      actionType: string;
      boostScore?: number;
      reason?: string;
      expiresAt?: string;
    }): Promise<AdminAction> => {
      const res = await fetch('/api/admin/showcase/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '관리자 액션 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showcase'] });
    },
  });
}

export function useAdminMonthlyPick() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      showcaseId: string;
      source: 'deploy' | 'project';
      yearMonth: string;
      rank: number;
      pickType?: 'algorithm' | 'curated';
      adminNote?: string;
    }): Promise<MonthlyPick> => {
      const res = await fetch('/api/admin/showcase/monthly-pick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '이달의 페이지 선정 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showcase'] });
    },
  });
}

// Legacy: keep for backward compat with deploy-site-card toggle
export function useToggleShowcase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deployId: string): Promise<{ is_showcase: boolean }> => {
      const res = await fetch(`/api/oneclick/deployments/${deployId}/showcase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 토글 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
    },
  });
}
