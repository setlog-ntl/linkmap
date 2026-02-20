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
  deploy_target?: 'github_pages';
}

export interface DeployStatus {
  deploy_id: string;
  deploy_status: 'pending' | 'creating' | 'building' | 'ready' | 'error' | 'canceled' | 'timeout';
  deployment_url: string | null;
  deploy_error: string | null;
  forked_repo_url: string | null;
  deploy_method: 'github_pages';
  pages_url: string | null;
  pages_status: 'pending' | 'enabling' | 'building' | 'built' | 'errored' | null;
  steps: Array<{
    name: string;
    status: 'completed' | 'in_progress' | 'pending' | 'error';
    label: string;
  }>;
}

export interface DeployPagesResult {
  deploy_id: string;
  project_id: string;
  repo_url: string;
  pages_url: string;
  pages_status: string;
}

// ---------- Templates (bundle-sourced, no API call) ----------

export function useHomepageTemplates(_deployTarget: string = 'github_pages') {
  return useQuery({
    queryKey: queryKeys.oneclick.templates,
    queryFn: async (): Promise<HomepageTemplate[]> => {
      // Dynamic import to keep templates out of the initial bundle
      const { TEMPLATES } = await import('@/data/templates/index');
      return TEMPLATES.map((t) => ({
        id: t.id,
        slug: t.slug,
        name: t.name,
        name_ko: t.nameKo,
        description: t.description,
        description_ko: t.descriptionKo,
        preview_image_url: t.previewImageUrl,
        github_owner: 'linkmap-templates',
        github_repo: t.slug,
        framework: t.framework,
        required_env_vars: t.requiredEnvVars,
        tags: t.tags,
        is_premium: t.isPremium,
        display_order: t.displayOrder,
        deploy_target: 'github_pages' as const,
      }));
    },
    staleTime: Infinity, // Bundle data never goes stale
  });
}

// ---------- Deploy to GitHub Pages ----------

export function useDeployToGitHubPages() {
  return useMutation({
    mutationFn: async (input: {
      template_id: string;
      site_name: string;
      github_service_account_id?: string;
    }): Promise<DeployPagesResult> => {
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

// ---------- Types: Deployment List ----------

export interface HomepageDeploy {
  id: string;
  site_name: string;
  deploy_status: 'pending' | 'creating' | 'building' | 'ready' | 'error' | 'canceled';
  deploy_method: 'github_pages';
  pages_url: string | null;
  pages_status: string | null;
  deployment_url: string | null;
  forked_repo_url: string | null;
  forked_repo_full_name: string | null;
  deploy_error_message: string | null;
  created_at: string;
  template_id: string;
  project_id: string | null;
  homepage_templates: {
    id: string;
    slug: string;
    name: string;
    name_ko: string;
    framework: string;
    preview_image_url: string | null;
  } | null;
}

// ---------- Types: File Editor ----------

export interface GitHubFileInfo {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
  sha: string;
}

export interface GitHubFileDetail {
  name: string;
  path: string;
  sha: string;
  content: string;
  size: number;
}

// ---------- My Deployments ----------

export function useMyDeployments() {
  return useQuery({
    queryKey: queryKeys.oneclick.deployments,
    queryFn: async (): Promise<HomepageDeploy[]> => {
      const res = await fetch('/api/oneclick/deployments');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '배포 목록 조회 실패');
      }
      const data = await res.json();
      return data.deployments;
    },
    // Auto-refetch every 5s while any deployment is still building
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      const hasBuilding = data.some((d) =>
        ['building', 'creating', 'pending'].includes(d.deploy_status)
      );
      return hasBuilding ? 5000 : false;
    },
  });
}

export function useDeleteDeployment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deployId: string): Promise<void> => {
      const res = await fetch(`/api/oneclick/deployments/${deployId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '삭제 실패');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.deployments });
    },
  });
}

// ---------- File Editor Hooks ----------

export function useDeployFiles(deployId: string | null) {
  return useQuery({
    queryKey: queryKeys.oneclick.files(deployId || ''),
    queryFn: async (): Promise<GitHubFileInfo[]> => {
      const res = await fetch(`/api/oneclick/deployments/${deployId}/files`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '파일 목록 조회 실패');
      }
      const data = await res.json();
      return data.files;
    },
    enabled: !!deployId,
  });
}

export function useFileContent(deployId: string | null, path: string | null) {
  return useQuery({
    queryKey: queryKeys.oneclick.fileContent(deployId || '', path || ''),
    queryFn: async (): Promise<GitHubFileDetail> => {
      const res = await fetch(
        `/api/oneclick/deployments/${deployId}/files?path=${encodeURIComponent(path!)}`
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '파일 내용 조회 실패');
      }
      return res.json();
    },
    enabled: !!deployId && !!path,
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      deployId: string;
      path: string;
      content: string;
      sha?: string;
      message?: string;
    }): Promise<{ sha: string }> => {
      const body: Record<string, string> = {
        path: input.path,
        content: input.content,
      };
      if (input.sha) body.sha = input.sha;
      if (input.message) body.message = input.message;

      const res = await fetch(`/api/oneclick/deployments/${input.deployId}/files`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '파일 저장 실패');
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.oneclick.fileContent(variables.deployId, variables.path),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.oneclick.files(variables.deployId),
      });
    },
  });
}

// ---------- Batch Apply Files (Atomic Commit) ----------

export interface BatchFileInput {
  path: string;
  content: string;
  sha?: string;
}

export function useBatchApplyFiles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      deployId: string;
      files: BatchFileInput[];
      message?: string;
    }): Promise<{ commit_sha: string; file_count: number }> => {
      const res = await fetch(`/api/oneclick/deployments/${input.deployId}/batch-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: input.files.map((f) => ({ path: f.path, content: f.content })),
          message: input.message,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '일괄 저장 실패');
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.oneclick.files(variables.deployId),
      });
      for (const file of variables.files) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.oneclick.fileContent(variables.deployId, file.path),
        });
      }
    },
  });
}

// ---------- Status Polling (exponential backoff) ----------

// 5-minute timeout (based on elapsed time, not poll count)
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

// Backoff: 1s → 2s → 3s → 5s → 8s → 10s (capped)
function getBackoffInterval(pollCount: number): number {
  const intervals = [1000, 2000, 3000, 5000, 8000, 10000];
  return intervals[Math.min(pollCount, intervals.length - 1)];
}

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
      if (!data) return 1000; // Fast initial poll

      // Stop polling when deployment is in a terminal state
      if (['ready', 'error', 'canceled', 'timeout'].includes(data.deploy_status)) {
        if (data.deploy_status === 'ready') {
          queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
        }
        return false;
      }

      // Timeout: stop polling after POLL_TIMEOUT_MS
      const dataUpdatedAt = query.state.dataUpdatedAt;
      const firstFetchAt = dataUpdatedAt - (query.state.dataUpdateCount * 3000); // approximate
      if (Date.now() - firstFetchAt > POLL_TIMEOUT_MS) {
        queryClient.setQueryData<DeployStatus>(
          queryKeys.oneclick.status(deployId || ''),
          (prev) => prev ? { ...prev, deploy_status: 'timeout' } : prev
        );
        return false;
      }

      return getBackoffInterval(query.state.dataUpdateCount);
    },
  });
}
