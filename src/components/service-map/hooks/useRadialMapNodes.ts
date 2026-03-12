import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { computeRadialLayout, PROJECT_NODE_ID, getHandleFromAngle } from '@/lib/layout/radial-layout';
import { categoryToViewGroup } from '@/lib/layout/view-group';
import type { ProjectService, Service, UserConnection, ServiceCategory, ViewGroup } from '@/types';

interface UseRadialMapNodesInput {
  services: (ProjectService & { service: Service })[];
  userConnections: UserConnection[];
  projectName: string;
  projectIconUrl?: string | null;
  searchQuery?: string;
  focusedNodeId?: string | null;
  filterGroups?: ViewGroup[];
  filterStatuses?: string[];
}

export function useRadialMapNodes(input: UseRadialMapNodesInput) {
  const { services, userConnections, projectName, projectIconUrl, searchQuery, focusedNodeId, filterGroups, filterStatuses } = input;

  return useMemo(() => {
    if (services.length === 0) return { nodes: [] as Node[], edges: [] as Edge[] };

    // Filter by search query
    let filteredServices = searchQuery
      ? services.filter((s) =>
          s.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.service.slug.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : services;

    // Filter by ViewGroup
    if (filterGroups && filterGroups.length > 0) {
      filteredServices = filteredServices.filter((s) =>
        filterGroups.includes(categoryToViewGroup(s.service.category))
      );
    }

    // Filter by connection status
    if (filterStatuses && filterStatuses.length > 0) {
      filteredServices = filteredServices.filter((s) =>
        filterStatuses.includes(s.status)
      );
    }

    // Build connected set for focus highlight (2-hop)
    const filteredIds = new Set(filteredServices.map((s) => s.id));
    const focus1hopIds = new Set<string>();
    const focus2hopIds = new Set<string>();

    if (focusedNodeId && focusedNodeId !== PROJECT_NODE_ID) {
      // Hub is always connected to focused node
      focus1hopIds.add(PROJECT_NODE_ID);
      // Find direct s2s connections (1-hop)
      userConnections.forEach((c) => {
        if (c.source_service_id === focusedNodeId && filteredIds.has(c.target_service_id)) {
          focus1hopIds.add(c.target_service_id);
        }
        if (c.target_service_id === focusedNodeId && filteredIds.has(c.source_service_id)) {
          focus1hopIds.add(c.source_service_id);
        }
      });

      // Find 2-hop connections
      for (const hop1Id of focus1hopIds) {
        if (hop1Id === PROJECT_NODE_ID) continue;
        userConnections.forEach((c) => {
          if (c.source_service_id === hop1Id && filteredIds.has(c.target_service_id) && c.target_service_id !== focusedNodeId && !focus1hopIds.has(c.target_service_id)) {
            focus2hopIds.add(c.target_service_id);
          }
          if (c.target_service_id === hop1Id && filteredIds.has(c.source_service_id) && c.source_service_id !== focusedNodeId && !focus1hopIds.has(c.source_service_id)) {
            focus2hopIds.add(c.source_service_id);
          }
        });
      }
    }

    const isFocusMode = !!focusedNodeId && focusedNodeId !== PROJECT_NODE_ID;

    // Build service nodes
    const connectedCount = filteredServices.filter((s) => s.status === 'connected').length;
    const totalCount = filteredServices.length;

    const serviceNodes: Node[] = filteredServices.map((s, idx) => {
      const isFocusTarget = isFocusMode && s.id === focusedNodeId;
      const is1hop = isFocusMode && focus1hopIds.has(s.id);
      const is2hop = isFocusMode && focus2hopIds.has(s.id);
      const focusOpacity = isFocusMode
        ? (isFocusTarget || is1hop ? 1 : is2hop ? 0.6 : 0.1)
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
          highlighted: !isFocusMode || isFocusTarget || is1hop || is2hop,
          focusOpacity,
          isFocusTarget,
          enterDelay: idx * 50,
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

    // Build viewGroup map for edge gradient
    const nodeViewGroupMap = new Map<string, ViewGroup>();
    for (const s of filteredServices) {
      nodeViewGroupMap.set(s.id, categoryToViewGroup(s.service.category));
    }

    // Hub edges: project → each service (with angle-based handle selection)
    const hubEdges: Edge[] = filteredServices.map((s) => {
      const isFocusRelated = !isFocusMode || s.id === focusedNodeId || focus1hopIds.has(s.id);
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
          targetViewGroup: nodeViewGroupMap.get(s.id),
        },
      };
    });

    // Service-to-service edges (compute optimal handles from relative positions)
    const S2S_NODE_W = 160;
    const S2S_NODE_H = 72;
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
            targetViewGroup: nodeViewGroupMap.get(c.target_service_id),
          },
          style: { strokeDasharray: '4 4' },
        };
      });

    return { nodes: positionedNodes, edges: [...hubEdges, ...s2sEdges] };
  }, [services, userConnections, projectName, projectIconUrl, searchQuery, focusedNodeId, filterGroups, filterStatuses]);
}
