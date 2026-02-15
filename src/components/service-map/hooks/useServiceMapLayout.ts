'use client';

import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { getLayoutedElements } from '@/lib/layout/dagre-layout';
import { getNeighborhood, isNodeHighlighted, isEdgeHighlighted } from '@/lib/layout/graph-utils';
import { shouldShowEdgeInViewMode } from '@/lib/layout/view-mode-styles';
import type { ViewMode } from '@/stores/service-map-store';
import type { LayoutDirection } from '@/components/service-map/map-toolbar';

export interface UseServiceMapLayoutParams {
  rawNodes: Node[];
  rawEdges: Edge[];
  focusedNodeId: string | null;
  viewMode: ViewMode;
  layoutDirection: LayoutDirection;
  expandedNodeId: string | null;
}

export interface UseServiceMapLayoutReturn {
  layoutedNodes: Node[];
  layoutedEdges: Edge[];
  neighborSet: Set<string> | null;
}

export function useServiceMapLayout(params: UseServiceMapLayoutParams): UseServiceMapLayoutReturn {
  const {
    rawNodes,
    rawEdges,
    focusedNodeId,
    viewMode,
    layoutDirection,
    expandedNodeId,
  } = params;

  // Compute neighbor set for focus mode
  const neighborSet = useMemo(() => {
    if (!focusedNodeId) return null;
    return getNeighborhood(focusedNodeId, rawEdges);
  }, [focusedNodeId, rawEdges]);

  // Apply focus mode opacity to nodes
  const focusedNodes = useMemo<Node[]>(() => {
    if (!focusedNodeId) return rawNodes;
    return rawNodes.map((node) => {
      if (node.type === 'group' || node.type === 'app') return node;
      const highlighted = isNodeHighlighted(node.id, focusedNodeId, neighborSet);
      return {
        ...node,
        data: {
          ...node.data,
          focusOpacity: highlighted ? 1 : 0.2,
        },
      };
    });
  }, [rawNodes, focusedNodeId, neighborSet]);

  // Apply view mode edge filtering
  const viewFilteredEdges = useMemo<Edge[]>(() => {
    let edges = rawEdges.filter((e) => shouldShowEdgeInViewMode(viewMode, e.type));

    // Focus mode edge dimming
    if (focusedNodeId) {
      edges = edges.map((edge) => {
        const highlighted = isEdgeHighlighted(edge, focusedNodeId, neighborSet);
        return {
          ...edge,
          style: {
            ...edge.style,
            opacity: highlighted ? 1 : 0.1,
          },
        };
      });
    }

    return edges;
  }, [rawEdges, viewMode, focusedNodeId, neighborSet]);

  // Compute node heights for expanded nodes
  const nodeHeights = useMemo<Record<string, number>>(() => {
    const heights: Record<string, number> = {};
    if (expandedNodeId) {
      heights[expandedNodeId] = 140; // expanded node is taller
    }
    return heights;
  }, [expandedNodeId]);

  // Apply dagre layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    const nonGroupNodes = focusedNodes.filter((n) => n.type !== 'group');
    const layoutResult = getLayoutedElements(nonGroupNodes, viewFilteredEdges, {
      direction: layoutDirection,
      rankSep: 120,
      nodeSep: 50,
      nodeHeights,
    });

    return {
      nodes: [...layoutResult.nodes],
      edges: layoutResult.edges,
    };
  }, [focusedNodes, viewFilteredEdges, layoutDirection, nodeHeights]);

  return {
    layoutedNodes,
    layoutedEdges,
    neighborSet,
  };
}
