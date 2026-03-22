'use client';

import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { computeZoneLayout, domainToZone, type ZoneConfig, type LayoutPreset, NODE_WIDTH, NODE_HEIGHT } from '@/lib/layout/zone-layout';
import { getNeighborhood, isNodeHighlighted, isEdgeHighlighted } from '@/lib/layout/graph-utils';
import type { ServiceDomain } from '@/types';

/** Zone center info for zone-aware edge routing */
interface ZoneCenter {
  cx: number;
  cy: number;
}

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
  nodePositionOverrides?: Record<string, { x: number; y: number }>;
}

export interface UseServiceMapLayoutReturn {
  layoutedNodes: Node[];
  layoutedEdges: Edge[];
  neighborSet: Set<string> | null;
}

/**
 * Pick the best handle pair for an edge between two nodes.
 *
 * For **intra-zone** edges we use pure node-center deltas.
 * For **inter-zone** edges we blend node-direction with zone-direction.
 *   – If the zone direction clearly dominates one axis (ratio > 1.8),
 *     we follow the zone axis with a very high weight (90 %).
 *   – Otherwise we use 70/30 zone/node blend.
 * A small horizontal bias (×1.15) is applied so layouts read left-to-right
 * naturally and edges only go vertical when the vertical gap is clearly larger.
 */
function computeEdgeHandles(
  srcNode: Node,
  tgtNode: Node,
  zoneCenters?: Map<string, ZoneCenter>,
  srcZoneKey?: string,
  tgtZoneKey?: string,
): { sourceHandle: string; targetHandle: string } {
  const sw = (srcNode.style?.width as number) || NODE_WIDTH;
  const sh = (srcNode.style?.height as number) || NODE_HEIGHT;
  const tw = (tgtNode.style?.width as number) || NODE_WIDTH;
  const th = (tgtNode.style?.height as number) || NODE_HEIGHT;

  const srcCx = srcNode.position.x + sw / 2;
  const srcCy = srcNode.position.y + sh / 2;
  const tgtCx = tgtNode.position.x + tw / 2;
  const tgtCy = tgtNode.position.y + th / 2;

  let dx = tgtCx - srcCx;
  let dy = tgtCy - srcCy;

  // Zone-aware blending for inter-zone edges
  if (zoneCenters && srcZoneKey && tgtZoneKey && srcZoneKey !== tgtZoneKey) {
    const srcZC = zoneCenters.get(srcZoneKey);
    const tgtZC = zoneCenters.get(tgtZoneKey);
    if (srcZC && tgtZC) {
      const zdx = tgtZC.cx - srcZC.cx;
      const zdy = tgtZC.cy - srcZC.cy;
      const azx = Math.abs(zdx);
      const azy = Math.abs(zdy);

      // When one zone axis clearly dominates (e.g. zones side-by-side)
      // use a very strong zone bias so edges don't exit from the wrong side.
      const ratio = azx > 0 && azy > 0 ? Math.max(azx, azy) / Math.min(azx, azy) : 10;
      const zoneWeight = ratio > 1.8 ? 0.9 : 0.7;
      const nodeWeight = 1 - zoneWeight;

      dx = zdx * zoneWeight + dx * nodeWeight;
      dy = zdy * zoneWeight + dy * nodeWeight;
    }
  }

  // Slight horizontal bias — diagrams are typically wider than tall,
  // so horizontal routing is more natural / readable.
  const HORIZONTAL_BIAS = 1.15;
  if (Math.abs(dx) * HORIZONTAL_BIAS >= Math.abs(dy)) {
    return dx > 0
      ? { sourceHandle: 'source-right', targetHandle: 'left' }
      : { sourceHandle: 'source-left', targetHandle: 'right' };
  }
  return dy > 0
    ? { sourceHandle: 'source-bottom', targetHandle: 'top' }
    : { sourceHandle: 'source-top', targetHandle: 'bottom' };
}

export function useServiceMapLayout(params: UseServiceMapLayoutParams): UseServiceMapLayoutReturn {
  const {
    serviceNodes, rawEdges, focusedNodeId, getDomain, mainServiceId,
    zoneConfigs, layoutPreset, editMode, zonePositionOverrides, zoneSizeOverrides,
    nodePositionOverrides,
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
      nodePositionOverrides,
    });
  }, [sortedServiceNodes, getDomain, zoneConfigs, layoutPreset, editMode, zonePositionOverrides, zoneSizeOverrides, nodePositionOverrides]);

  // Build node lookup from layout result (includes positions)
  const nodeMap = useMemo(() => {
    const map = new Map<string, Node>();
    for (const n of zoneResult.nodes) map.set(n.id, n);
    return map;
  }, [zoneResult.nodes]);

  // Build zone center map for zone-aware edge routing
  const zoneCenters = useMemo(() => {
    const map = new Map<string, ZoneCenter>();
    for (const n of zoneResult.nodes) {
      if (n.type !== 'zone') continue;
      const w = (n.style?.width as number) || 0;
      const h = (n.style?.height as number) || 0;
      const key = n.id.replace('zone-', '');
      map.set(key, { cx: n.position.x + w / 2, cy: n.position.y + h / 2 });
    }
    return map;
  }, [zoneResult.nodes]);

  // Build nodeId → zoneKey map for edge routing
  const nodeZoneMap = useMemo(() => {
    const map = new Map<string, string>();
    const zones = zoneConfigs && zoneConfigs.length > 0 ? zoneConfigs : undefined;
    for (const n of zoneResult.nodes) {
      if (n.type === 'zone') continue;
      const domain = getDomain(n.id);
      if (domain) map.set(n.id, domainToZone(domain, zones));
    }
    return map;
  }, [zoneResult.nodes, getDomain, zoneConfigs]);

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

  // Apply handles + focus dimming to edges (zone-aware for inter-zone edges)
  const layoutedEdges = useMemo<Edge[]>(() => {
    return rawEdges.map((edge) => {
      const srcNode = nodeMap.get(edge.source);
      const tgtNode = nodeMap.get(edge.target);

      // Compute optimal handles — zone-aware for inter-zone edges
      let handles: { sourceHandle?: string; targetHandle?: string } = {};
      if (srcNode && tgtNode) {
        const srcZone = nodeZoneMap.get(edge.source);
        const tgtZone = nodeZoneMap.get(edge.target);
        handles = computeEdgeHandles(srcNode, tgtNode, zoneCenters, srcZone, tgtZone);
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
  }, [rawEdges, nodeMap, focusedNodeId, neighborSet, zoneCenters, nodeZoneMap]);

  return { layoutedNodes, layoutedEdges, neighborSet };
}
