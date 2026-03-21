'use client';

import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { computeZoneLayout, type ZoneConfig, type LayoutPreset, NODE_WIDTH, NODE_HEIGHT } from '@/lib/layout/zone-layout';
import { getNeighborhood, isNodeHighlighted, isEdgeHighlighted } from '@/lib/layout/graph-utils';
import type { ServiceDomain } from '@/types';

export interface UseServiceMapLayoutParams {
  serviceNodes: Node[];
  rawEdges: Edge[];
  focusedNodeId: string | null;
  getDomain: (nodeId: string) => ServiceDomain | null;
  mainServiceId?: string | null;
  zoneConfigs?: ZoneConfig[];
  layoutPreset?: LayoutPreset;
  editMode?: boolean;
  zonePositionOverrides?: Record<string, { x: number; y: number }>;
  zoneSizeOverrides?: Record<string, { width: number; height: number }>;
}

export interface UseServiceMapLayoutReturn {
  layoutedNodes: Node[];
  layoutedEdges: Edge[];
  neighborSet: Set<string> | null;
}

/**
 * Compute optimal sourceHandle/targetHandle based on relative node positions.
 * Source exits toward target, target receives from the source direction.
 * Example: target is RIGHT of source → source exits RIGHT, target receives from LEFT.
 */
function computeEdgeHandles(
  srcNode: Node,
  tgtNode: Node,
): { sourceHandle: string; targetHandle: string } {
  const sw = (srcNode.style?.width as number) || NODE_WIDTH;
  const sh = (srcNode.style?.height as number) || NODE_HEIGHT;
  const tw = (tgtNode.style?.width as number) || NODE_WIDTH;
  const th = (tgtNode.style?.height as number) || NODE_HEIGHT;

  const srcCx = srcNode.position.x + sw / 2;
  const srcCy = srcNode.position.y + sh / 2;
  const tgtCx = tgtNode.position.x + tw / 2;
  const tgtCy = tgtNode.position.y + th / 2;

  const dx = tgtCx - srcCx;
  const dy = tgtCy - srcCy;

  // Dominant axis determines direction. Target handle is OPPOSITE to source handle.
  if (Math.abs(dx) >= Math.abs(dy)) {
    // Horizontal dominant
    return dx > 0
      ? { sourceHandle: 'source-right', targetHandle: 'left' }   // → target is RIGHT, enter from LEFT
      : { sourceHandle: 'source-left', targetHandle: 'right' };  // ← target is LEFT, enter from RIGHT
  }
  // Vertical dominant
  return dy > 0
    ? { sourceHandle: 'source-bottom', targetHandle: 'top' }     // ↓ target is BELOW, enter from TOP
    : { sourceHandle: 'source-top', targetHandle: 'bottom' };    // ↑ target is ABOVE, enter from BOTTOM
}

export function useServiceMapLayout(params: UseServiceMapLayoutParams): UseServiceMapLayoutReturn {
  const {
    serviceNodes, rawEdges, focusedNodeId, getDomain, mainServiceId,
    zoneConfigs, layoutPreset, editMode, zonePositionOverrides, zoneSizeOverrides,
  } = params;

  const neighborSet = useMemo(() => {
    if (!focusedNodeId) return null;
    return getNeighborhood(focusedNodeId, rawEdges);
  }, [focusedNodeId, rawEdges]);

  const sortedServiceNodes = useMemo(() => {
    if (!mainServiceId) return serviceNodes;
    return [...serviceNodes].sort((a, b) => {
      if (a.id === mainServiceId) return -1;
      if (b.id === mainServiceId) return 1;
      return 0;
    });
  }, [serviceNodes, mainServiceId]);

  const zoneResult = useMemo(() => {
    return computeZoneLayout(sortedServiceNodes, getDomain, {
      zones: zoneConfigs,
      preset: layoutPreset,
      editMode,
      positionOverrides: zonePositionOverrides,
      sizeOverrides: zoneSizeOverrides,
    });
  }, [sortedServiceNodes, getDomain, zoneConfigs, layoutPreset, editMode, zonePositionOverrides, zoneSizeOverrides]);

  // Build node lookup from layout result (includes positions)
  const nodeMap = useMemo(() => {
    const map = new Map<string, Node>();
    for (const n of zoneResult.nodes) map.set(n.id, n);
    return map;
  }, [zoneResult.nodes]);

  const layoutedNodes = useMemo<Node[]>(() => {
    if (!focusedNodeId) return zoneResult.nodes;
    return zoneResult.nodes.map((node) => {
      if (node.type === 'zone') return node;
      const highlighted = isNodeHighlighted(node.id, focusedNodeId, neighborSet);
      return {
        ...node,
        data: { ...node.data, focusOpacity: highlighted ? 1 : 0.35 },
      };
    });
  }, [zoneResult.nodes, focusedNodeId, neighborSet]);

  // Apply handles + focus dimming to edges
  const layoutedEdges = useMemo<Edge[]>(() => {
    return rawEdges.map((edge) => {
      const srcNode = nodeMap.get(edge.source);
      const tgtNode = nodeMap.get(edge.target);

      // Compute optimal handles based on node positions
      let handles: { sourceHandle?: string; targetHandle?: string } = {};
      if (srcNode && tgtNode) {
        handles = computeEdgeHandles(srcNode, tgtNode);
      }

      const focusDim = focusedNodeId
        ? { opacity: isEdgeHighlighted(edge, focusedNodeId, neighborSet) ? 1 : 0.1 }
        : {};

      return {
        ...edge,
        sourceHandle: edge.sourceHandle || handles.sourceHandle,
        targetHandle: edge.targetHandle || handles.targetHandle,
        style: { ...edge.style, ...focusDim },
      };
    });
  }, [rawEdges, nodeMap, focusedNodeId, neighborSet]);

  return { layoutedNodes, layoutedEdges, neighborSet };
}
