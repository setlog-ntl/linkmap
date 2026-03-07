import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';

export interface ShowcaseItem {
  id: string;
  site_name: string;
  pages_url: string | null;
  deployment_url: string | null;
  deploy_method: string;
  deployed_at: string | null;
  created_at: string;
  user_id: string;
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

export function useToggleShowcase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deployId: string): Promise<{ is_showcase: boolean }> => {
      const res = await fetch(`/api/oneclick/deployments/${deployId}/showcase`, {
        method: 'PATCH',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '쇼케이스 토글 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.showcase.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
    },
  });
}
