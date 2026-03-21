'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import { staleTime } from './stale-time';
import type { ZoneConfig, LayoutPreset } from '@/lib/layout/zone-layout';
import type { ZoneConnection } from '@/stores/service-map-store';

export interface ZoneLayoutData {
  zoneConfigs?: ZoneConfig[];
  zoneConnections?: ZoneConnection[];
  zonePositionOverrides?: Record<string, { x: number; y: number }>;
  zoneSizeOverrides?: Record<string, { width: number; height: number }>;
  layoutPreset?: LayoutPreset;
}

export function useZoneLayout(projectId: string) {
  return useQuery({
    queryKey: queryKeys.zoneLayout.byProject(projectId),
    staleTime: staleTime.layerOverride,
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/zone-layout`);
      if (!res.ok) throw new Error('Failed to fetch zone layout');
      return res.json() as Promise<ZoneLayoutData | null>;
    },
    enabled: !!projectId,
  });
}

export function useSaveZoneLayout(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ZoneLayoutData) => {
      const res = await fetch(`/api/projects/${projectId}/zone-layout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to save zone layout');
      return res.json() as Promise<ZoneLayoutData>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.zoneLayout.byProject(projectId) });
    },
  });
}
