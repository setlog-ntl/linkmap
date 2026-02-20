import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { computeRadialLayout, PROJECT_NODE_ID } from '@/lib/layout/radial-layout';
import { categoryToViewGroup } from '@/lib/layout/view-group';
import type { ProjectService, Service, UserConnection, ServiceCategory } from '@/types';

interface UseRadialMapNodesInput {
  services: (ProjectService & { service: Service })[];
  userConnections: UserConnection[];
  projectName: string;
  projectIconUrl?: string | null;
  searchQuery?: string;
}

export function useRadialMapNodes(input: UseRadialMapNodesInput) {
  const { services, userConnections, projectName, projectIconUrl, searchQuery } = input;

  return useMemo(() => {
    if (services.length === 0) return { nodes: [] as Node[], edges: [] as Edge[] };

    // Filter by search query
    const filteredServices = searchQuery
      ? services.filter((s) =>
          s.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.service.slug.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : services;

    // Build service nodes (pre-positioned at 0,0 — radial layout will place them)
    const serviceNodes: Node[] = filteredServices.map((s) => ({
      id: s.id,
      type: 'service',
      position: { x: 0, y: 0 },
      data: {
        label: s.service.name,
        slug: s.service.slug,
        category: s.service.category,
        status: s.status,
        iconUrl: s.service.icon_url ?? null,
        viewGroup: categoryToViewGroup(s.service.category),
      },
    }));

    const getCategory = (nodeId: string): ServiceCategory => {
      const svc = filteredServices.find((s) => s.id === nodeId);
      return svc?.service.category ?? 'other';
    };

    // Compute radial layout
    const { nodes: positionedNodes } = computeRadialLayout({
      serviceNodes,
      getCategory,
      projectName,
      projectIconUrl,
    });

    // Hub edges: project → each service
    const filteredIds = new Set(filteredServices.map((s) => s.id));
    const hubEdges: Edge[] = filteredServices.map((s) => ({
      id: `hub-${s.id}`,
      source: PROJECT_NODE_ID,
      target: s.id,
      type: 'radial',
      data: { status: s.status },
    }));

    // Service-to-service edges from user_connections (dashed)
    const s2sEdges: Edge[] = userConnections
      .filter((c) => filteredIds.has(c.source_service_id) && filteredIds.has(c.target_service_id))
      .map((c) => ({
        id: `conn-${c.id}`,
        source: c.source_service_id,
        target: c.target_service_id,
        type: 'radial',
        data: { connectionType: c.connection_type, status: 'connected' },
        style: { strokeDasharray: '4 4' },
      }));

    return { nodes: positionedNodes, edges: [...hubEdges, ...s2sEdges] };
  }, [services, userConnections, projectName, projectIconUrl, searchQuery]);
}
