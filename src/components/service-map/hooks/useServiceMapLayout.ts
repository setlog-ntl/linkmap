'use client';

import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { computeZoneLayout } from '@/lib/layout/zone-layout';
import { getNeighborhood, isNodeHighlighted, isEdgeHighlighted } from '@/lib/layout/graph-utils';
import type { ServiceDomain } from '@/types';

export interface UseServiceMapLayoutParams {
  serviceNodes: Node[];
  rawEdges: Edge[];
  focusedNodeId: string | null;
  getDomain: (nodeId: string) => ServiceDomain | null;
  mainServiceId?: string | null;
}

export interface UseServiceMapLayoutReturn {
  layoutedNodes: Node[];
  layoutedEdges: Edge[];
  neighborSet: Set<string> | null;
}

export function useServiceMapLayout(params: UseServiceMapLayoutParams): UseServiceMapLayoutReturn {
  const { serviceNodes, rawEdges, focusedNodeId, getDomain, mainServiceId } = params;

  const neighborSet = useMemo(() => {
    if (!focusedNodeId) return null;
    return getNeighborhood(focusedNodeId, rawEdges);
  }, [focusedNodeId, rawEdges]);

  // Sort: main service first in its zone
  const sortedServiceNodes = useMemo(() => {
    if (!mainServiceId) return serviceNodes;
    return [...serviceNodes].sort((a, b) => {
      if (a.id === mainServiceId) return -1;
      if (b.id === mainServiceId) return 1;
      return 0;
    });
  }, [serviceNodes, mainServiceId]);

  // Zone-based layout
  const zoneResult = useMemo(() => {
    return computeZoneLayout(sortedServiceNodes, getDomain);
  }, [sortedServiceNodes, getDomain]);

  // Apply focus mode opacity
  const layoutedNodes = useMemo<Node[]>(() => {
    if (!focusedNodeId) return zoneResult.nodes;
    return zoneResult.nodes.map((node) => {
      if (node.type === 'zone') return node;
      const highlighted = isNodeHighlighted(node.id, focusedNodeId, neighborSet);
      return {
        ...node,
        data: {
          ...node.data,
          focusOpacity: highlighted ? 1 : 0.2,
        },
      };
    });
  }, [zoneResult.nodes, focusedNodeId, neighborSet]);

  // Apply focus mode edge dimming
  const layoutedEdges = useMemo<Edge[]>(() => {
    if (!focusedNodeId) return rawEdges;
    return rawEdges.map((edge) => {
      const highlighted = isEdgeHighlighted(edge, focusedNodeId, neighborSet);
      return {
        ...edge,
        style: {
          ...edge.style,
          opacity: highlighted ? 1 : 0.1,
        },
      };
    });
  }, [rawEdges, focusedNodeId, neighborSet]);

  return {
    layoutedNodes,
    layoutedEdges,
    neighborSet,
  };
}
