import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';

interface AnalyzeRequest {
  project_id: string;
  value?: string;
  content?: string;
  key_name?: string;
}

interface AnalysisResultItem {
  key_name: string;
  value_preview: string;
  analysis: {
    serviceId: string;
    serviceName: string;
    confidence: string;
    matchedPattern: string;
    suggestedKeyName?: string;
  }[];
  best_match: {
    serviceId: string;
    serviceName: string;
    confidence: string;
  } | null;
  already_exists: boolean;
  service_already_registered: boolean;
}

interface AnalyzeResponse {
  results: AnalysisResultItem[];
  summary: {
    total: number;
    matched: number;
    already_exists: number;
    new_services: number;
  };
}

interface ApplyEntry {
  key_name: string;
  value: string;
  service_id: string | null;
  environment: string;
  is_secret: boolean;
}

interface ApplyResponse {
  created: number;
  updated: number;
  services_added: number;
  auto_connections: number;
  details: string[];
}

export function useAnalyzeKeys(projectId: string) {
  return useMutation({
    mutationFn: async (input: Omit<AnalyzeRequest, 'project_id'>): Promise<AnalyzeResponse> => {
      const res = await fetch('/api/env/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, ...input }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '분석 실패');
      }
      return res.json();
    },
  });
}

export function useApplyAnalysis(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entries: ApplyEntry[]): Promise<ApplyResponse> => {
      const res = await fetch('/api/env/analyze/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, entries }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '적용 실패');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.envVars.byProject(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.byProject(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.byProject(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.envVars.conflicts(projectId) });
    },
  });
}

export type { AnalyzeResponse, AnalysisResultItem, ApplyEntry, ApplyResponse };
