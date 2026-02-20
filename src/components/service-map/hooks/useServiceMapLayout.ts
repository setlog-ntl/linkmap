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
}

export interface UseServiceMapLayoutReturn {
  layoutedNodes: Node[];
  layoutedEdges: Edge[];
  neighborSet: Set<string> | null;
}

export function useServiceMapLayout(params: UseServiceMapLayoutParams): UseServiceMapLayoutReturn {
  const { serviceNodes, rawEdges, focusedNodeId, getDomain } = params;

  const neighborSet = useMemo(() => {
    if (!focusedNodeId) return null;
    return getNeighborhood(focusedNodeId, rawEdges);
  }, [focusedNodeId, rawEdges]);

  // Zone-based layout
  const zoneResult = useMemo(() => {
    return computeZoneLayout(serviceNodes, getDomain);
  }, [serviceNodes, getDomain]);

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
