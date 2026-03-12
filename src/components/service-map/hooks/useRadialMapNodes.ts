import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { computeRadialLayout, PROJECT_NODE_ID, getHandleFromAngle } from '@/lib/layout/radial-layout';
import { categoryToViewGroup } from '@/lib/layout/view-group';
import type { ProjectService, Service, UserConnection, ServiceCategory } from '@/types';

interface UseRadialMapNodesInput {
  services: (ProjectService & { service: Service })[];
  userConnections: UserConnection[];
  projectName: string;
  projectIconUrl?: string | null;
  searchQuery?: string;
  focusedNodeId?: string | null;
}

export function useRadialMapNodes(input: UseRadialMapNodesInput) {
  const { services, userConnections, projectName, projectIconUrl, searchQuery, focusedNodeId } = input;

  return useMemo(() => {
    if (services.length === 0) return { nodes: [] as Node[], edges: [] as Edge[] };

    // Filter by search query
    const filteredServices = searchQuery
      ? services.filter((s) =>
          s.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.service.slug.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : services;

    // Build connected set for focus highlight
    const filteredIds = new Set(filteredServices.map((s) => s.id));
    const focusConnectedIds = new Set<string>();
    if (focusedNodeId && focusedNodeId !== PROJECT_NODE_ID) {
      // Hub is always connected to focused node
      focusConnectedIds.add(PROJECT_NODE_ID);
      // Find s2s connections
      userConnections.forEach((c) => {
        if (c.source_service_id === focusedNodeId && filteredIds.has(c.target_service_id)) {
          focusConnectedIds.add(c.target_service_id);
        }
        if (c.target_service_id === focusedNodeId && filteredIds.has(c.source_service_id)) {
          focusConnectedIds.add(c.source_service_id);
        }
      });
    }

    const isFocusMode = !!focusedNodeId && focusedNodeId !== PROJECT_NODE_ID;

    // Build service nodes
    const connectedCount = filteredServices.filter((s) => s.status === 'connected').length;
    const totalCount = filteredServices.length;

    const serviceNodes: Node[] = filteredServices.map((s) => {
      const isFocusTarget = isFocusMode && s.id === focusedNodeId;
      const isConnectedToFocus = isFocusMode && focusConnectedIds.has(s.id);
      const focusOpacity = isFocusMode
        ? (isFocusTarget || isConnectedToFocus ? 1 : 0.12)
        : 1;

      return {
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
          highlighted: !isFocusMode || isFocusTarget || isConnectedToFocus,
          focusOpacity,
          isFocusTarget,
        },
      };
    });

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

    // Inject hub node stats
    const hubNode = positionedNodes.find((n) => n.id === PROJECT_NODE_ID);
    if (hubNode) {
      hubNode.data = {
        ...hubNode.data as Record<string, unknown>,
        connectedCount,
        totalCount,
      };
    }

    // Build angle map from positioned nodes for handle selection
    const nodeAngleMap = new Map<string, number>();
    for (const n of positionedNodes) {
      const angleDeg = (n.data as Record<string, unknown>)._angleDeg as number | undefined;
      if (angleDeg != null) nodeAngleMap.set(n.id, angleDeg);
    }

    // Hub edges: project → each service (with angle-based handle selection)
    const hubEdges: Edge[] = filteredServices.map((s) => {
      const isFocusRelated = !isFocusMode || s.id === focusedNodeId || focusConnectedIds.has(s.id);
      const angleDeg = nodeAngleMap.get(s.id);
      const handles = angleDeg != null ? getHandleFromAngle(angleDeg) : { sourceHandle: undefined, targetHandle: undefined };
      return {
        id: `hub-${s.id}`,
        source: PROJECT_NODE_ID,
        target: s.id,
        type: 'radial',
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
        data: {
          status: s.status,
          focusHighlighted: isFocusRelated,
        },
      };
    });

    // Service-to-service edges (compute optimal handles from relative positions)
    const S2S_NODE_W = 150;
    const S2S_NODE_H = 120;
    const nodePositionMap = new Map<string, { x: number; y: number }>();
    for (const n of positionedNodes) {
      nodePositionMap.set(n.id, { x: n.position.x + S2S_NODE_W / 2, y: n.position.y + S2S_NODE_H / 2 });
    }

    const s2sEdges: Edge[] = userConnections
      .filter((c) => filteredIds.has(c.source_service_id) && filteredIds.has(c.target_service_id))
      .map((c) => {
        const isFocusRelated = !isFocusMode ||
          c.source_service_id === focusedNodeId ||
          c.target_service_id === focusedNodeId;

        // Compute handle based on relative angle between source and target
        const srcPos = nodePositionMap.get(c.source_service_id);
        const tgtPos = nodePositionMap.get(c.target_service_id);
        let s2sSourceHandle: string | undefined;
        let s2sTargetHandle: string | undefined;
        if (srcPos && tgtPos) {
          const dx = tgtPos.x - srcPos.x;
          const dy = tgtPos.y - srcPos.y;
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          const srcHandles = getHandleFromAngle(angle);
          s2sSourceHandle = `source-${srcHandles.sourceHandle}`;
          s2sTargetHandle = srcHandles.targetHandle;
        }

        return {
          id: `conn-${c.id}`,
          source: c.source_service_id,
          target: c.target_service_id,
          type: 'radial',
          sourceHandle: s2sSourceHandle,
          targetHandle: s2sTargetHandle,
          data: {
            connectionType: c.connection_type,
            connectionStatus: c.connection_status,
            focusHighlighted: isFocusRelated,
          },
          style: { strokeDasharray: '4 4' },
        };
      });

    return { nodes: positionedNodes, edges: [...hubEdges, ...s2sEdges] };
  }, [services, userConnections, projectName, projectIconUrl, searchQuery, focusedNodeId]);
}
