import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';

// ---------- Types ----------

export interface HomepageTemplate {
  id: string;
  slug: string;
  name: string;
  name_ko: string;
  description: string;
  description_ko: string;
  preview_image_url: string | null;
  github_owner: string;
  github_repo: string;
  framework: string;
  required_env_vars: Array<{ key: string; description: string; required: boolean }>;
  tags: string[];
  is_premium: boolean;
  display_order: number;
  deploy_target?: 'vercel' | 'github_pages' | 'both';
}

export interface DeployStatus {
  deploy_id: string;
  fork_status: 'pending' | 'forking' | 'forked' | 'failed';
  deploy_status: 'pending' | 'creating' | 'building' | 'ready' | 'error' | 'canceled';
  deployment_url: string | null;
  deploy_error: string | null;
  vercel_project_url: string | null;
  forked_repo_url: string | null;
  deploy_method: 'vercel' | 'github_pages';
  pages_url: string | null;
  pages_status: 'pending' | 'enabling' | 'building' | 'built' | 'errored' | null;
  steps: Array<{
    name: string;
    status: 'completed' | 'in_progress' | 'pending' | 'error';
    label: string;
  }>;
}

export interface ForkResult {
  deploy_id: string;
  project_id: string;
  forked_repo: string;
  forked_repo_url: string;
}

export interface DeployResult {
  deployment_url: string | null;
  vercel_project_url: string;
  vercel_project_id: string;
  deployment_id: string | null;
}

export interface DeployPagesResult {
  deploy_id: string;
  project_id: string;
  repo_url: string;
  pages_url: string;
  pages_status: string;
}

// ---------- Templates ----------

export function useHomepageTemplates(deployTarget: string = 'github_pages') {
  return useQuery({
    queryKey: [...queryKeys.oneclick.templates, deployTarget],
    queryFn: async (): Promise<HomepageTemplate[]> => {
      const res = await fetch(`/api/oneclick/templates?deploy_target=${deployTarget}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '템플릿 목록 조회 실패');
      }
      const data = await res.json();
      return data.templates;
    },
    staleTime: 5 * 60_000, // 5 min cache
  });
}

// ---------- Fork (legacy Vercel flow) ----------

export function useForkTemplate() {
  return useMutation({
    mutationFn: async (input: {
      template_id: string;
      site_name: string;
    }): Promise<ForkResult> => {
      const res = await fetch('/api/oneclick/fork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Fork 실패');
      }
      return res.json();
    },
  });
}

// ---------- Deploy to Vercel (legacy) ----------

export function useDeployToVercel() {
  return useMutation({
    mutationFn: async (input: {
      deploy_id: string;
      vercel_token: string;
      env_vars?: Record<string, string>;
    }): Promise<DeployResult> => {
      const res = await fetch('/api/oneclick/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '배포 실패');
      }
      return res.json();
    },
  });
}

// ---------- Deploy to GitHub Pages ----------

export function useDeployToGitHubPages() {
  return useMutation({
    mutationFn: async (input: {
      template_id: string;
      site_name: string;
    }): Promise<DeployPagesResult> => {
      const res = await fetch('/api/oneclick/deploy-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '배포 실패');
      }
      return res.json();
    },
  });
}

// ---------- Status Polling ----------

export function useDeployStatus(deployId: string | null, enabled: boolean = true) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.oneclick.status(deployId || ''),
    queryFn: async (): Promise<DeployStatus> => {
      const res = await fetch(`/api/oneclick/status?deploy_id=${deployId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '상태 조회 실패');
      }
      return res.json();
    },
    enabled: !!deployId && enabled,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 3000;
      // Stop polling when deployment is in a terminal state
      if (['ready', 'error', 'canceled'].includes(data.deploy_status)) {
        // Invalidate projects list on success
        if (data.deploy_status === 'ready') {
          queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
        }
        return false;
      }
      return 3000; // Poll every 3 seconds
    },
  });
}
