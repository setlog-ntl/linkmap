import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { McpServer, ProjectMcpConfig } from '@/types';

// ---------------------------------------------------------------------------
// MCP Server Catalog
// ---------------------------------------------------------------------------

export function useMcpServers(search?: string, serviceId?: string) {
  return useQuery({
    queryKey: [...queryKeys.mcp.servers, search ?? '', serviceId ?? ''] as const,
    queryFn: async (): Promise<McpServer[]> => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (serviceId) params.set('service_id', serviceId);
      const res = await fetch(`/api/mcp/servers?${params}`);
      if (!res.ok) throw new Error('MCP 서버 목록을 불러올 수 없습니다');
      return res.json();
    },
    staleTime: 5 * 60_000, // catalog data is fairly static
  });
}

// ---------------------------------------------------------------------------
// Project MCP Configs
// ---------------------------------------------------------------------------

export function useProjectMcpConfigs(projectId: string) {
  return useQuery({
    queryKey: queryKeys.mcp.byProject(projectId),
    queryFn: async (): Promise<ProjectMcpConfig[]> => {
      const res = await fetch(`/api/mcp/configs?project_id=${projectId}`);
      if (!res.ok) throw new Error('MCP 설정 목록을 불러올 수 없습니다');
      return res.json();
    },
    enabled: !!projectId,
    staleTime: 30_000,
  });
}

interface CreateMcpConfigParams {
  project_id: string;
  mcp_server_id?: string | null;
  custom_name?: string | null;
  transport?: string;
  command?: string | null;
  args?: string[];
  url?: string | null;
  enabled?: boolean;
  environment?: string;
  notes?: string | null;
  env_vars?: Array<{
    key_name: string;
    value: string;
    description?: string | null;
    is_secret?: boolean;
  }>;
  service_links?: Array<{
    service_id: string;
    project_service_id?: string | null;
    link_type?: string;
  }>;
}

export function useCreateMcpConfig(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateMcpConfigParams): Promise<ProjectMcpConfig> => {
      const res = await fetch('/api/mcp/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'MCP 설정 생성에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mcp.byProject(projectId) });
    },
  });
}

export function useUpdateMcpConfig(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Record<string, unknown>): Promise<ProjectMcpConfig> => {
      const res = await fetch(`/api/mcp/configs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'MCP 설정 수정에 실패했습니다');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mcp.byProject(projectId) });
    },
  });
}

export function useDeleteMcpConfig(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const res = await fetch(`/api/mcp/configs/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'MCP 설정 삭제에 실패했습니다');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mcp.byProject(projectId) });
    },
  });
}

// ---------------------------------------------------------------------------
// MCP Recommendations
// ---------------------------------------------------------------------------

interface McpRecommendation {
  mcp_server: McpServer;
  matched_service_ids: string[];
  score: number;
  reason_ko: string;
}

export function useMcpRecommendations(projectId: string) {
  return useQuery({
    queryKey: queryKeys.mcp.recommend(projectId),
    queryFn: async (): Promise<McpRecommendation[]> => {
      const res = await fetch(`/api/mcp/recommend?project_id=${projectId}`);
      if (!res.ok) throw new Error('MCP 추천을 불러올 수 없습니다');
      return res.json();
    },
    enabled: !!projectId,
    staleTime: 60_000,
  });
}

// ---------------------------------------------------------------------------
// MCP Import
// ---------------------------------------------------------------------------

interface ImportResult {
  format: string;
  servers: Array<{
    slug: string;
    name: string;
    transport: string;
    command: string | null;
    args: string[];
    url: string | null;
    env_vars: Array<{ key_name: string; value: string }>;
    mcp_server_id: string | null;
    catalog_name: string | null;
    matched: boolean;
  }>;
  total: number;
  matched: number;
}

export function useImportMcpConfig() {
  return useMutation({
    mutationFn: async (params: { project_id: string; content: string; environment?: string }): Promise<ImportResult> => {
      const res = await fetch('/api/mcp/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'MCP 설정 파싱에 실패했습니다');
      }
      return res.json();
    },
  });
}
