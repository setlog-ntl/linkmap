'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import type { ZoneKey } from '@/lib/layout/zone-layout';

interface LayerOverride {
  id: string;
  project_id: string;
  service_id: string;
  dashboard_layer: ZoneKey | null;
  dashboard_subcategory: string | null;
  updated_at: string;
}

export function useLayerOverrides(projectId: string) {
  return useQuery({
    queryKey: queryKeys.layerOverrides.byProject(projectId),
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/layer-override`);
      if (!res.ok) throw new Error('Failed to fetch layer overrides');
      return res.json() as Promise<LayerOverride[]>;
    },
    enabled: !!projectId,
  });
}

export function useUpsertLayerOverride(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { service_id: string; dashboard_layer: ZoneKey }) => {
      const res = await fetch(`/api/projects/${projectId}/layer-override`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to save layer override');
      return res.json() as Promise<LayerOverride>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.layerOverrides.byProject(projectId) });
    },
  });
}
