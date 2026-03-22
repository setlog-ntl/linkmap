'use client';

import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { computeZoneLayout, domainToZone, type ZoneConfig, type LayoutPreset, NODE_WIDTH, NODE_HEIGHT } from '@/lib/layout/zone-layout';
import { getNeighborhood, isNodeHighlighted, isEdgeHighlighted } from '@/lib/layout/graph-utils';
import type { ServiceDomain } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get the center point of a node. */
function nodeCenter(node: Node): { cx: number; cy: number } {
  const w = (node.style?.width as number) || NODE_WIDTH;
  const h = (node.style?.height as number) || NODE_HEIGHT;
  return { cx: node.position.x + w / 2, cy: node.position.y + h / 2 };
}

/**
 * Convert a direction vector (dx, dy) → the best source/target handle pair.
 *
 * Uses `atan2` for precise angle-based 4-quadrant selection.
 * The quadrant boundaries are at ±48° (slightly wider horizontal sectors
 * because diagrams are typically wider than tall).
 *
 *       -132°   -48°
 *          ╲  top  ╱
 *   left    ╲    ╱    right
 *          ╱      ╲
 *         ╱ bottom ╲
 *       132°    48°
 */
const H_HALF = (48 * Math.PI) / 180; // 48° in radians

function directionToHandles(
  dx: number,
  dy: number,
): { sourceHandle: string; targetHandle: string } {
  const angle = Math.atan2(dy, dx); // -π..π  (0 = right)

  // right sector:  -48° .. +48°
  if (angle >= -H_HALF && angle <= H_HALF) {
    return { sourceHandle: 'source-right', targetHandle: 'left' };
  }
  // bottom sector: +48° .. +132°
  if (angle > H_HALF && angle < Math.PI - H_HALF) {
    return { sourceHandle: 'source-bottom', targetHandle: 'top' };
  }
  // top sector:    -132° .. -48°
  if (angle < -H_HALF && angle > -(Math.PI - H_HALF)) {
    return { sourceHandle: 'source-top', targetHandle: 'bottom' };
  }
  // left sector:   ±132° .. ±180°
  return { sourceHandle: 'source-left', targetHandle: 'right' };
}

// ---------------------------------------------------------------------------
// Handle selection — angle-based, zone-independent
// ---------------------------------------------------------------------------

/**
 * Select the best handle pair for an edge between two nodes.
 *
 * **Strategy**: pure node-to-node `atan2` angle decides the handle.
 * Zone information is used **only** as a tie-breaker when the angle is
 * within ±8° of a quadrant boundary.  This prevents zone blending from
 * collapsing distinct target directions into a single handle.
 */
function computeEdgeHandles(
  srcNode: Node,
  tgtNode: Node,
  zoneCenters?: Map<string, ZoneCenter>,
  srcZoneKey?: string,
  tgtZoneKey?: string,
): { sourceHandle: string; targetHandle: string } {
  const { cx: srcCx, cy: srcCy } = nodeCenter(srcNode);
  const { cx: tgtCx, cy: tgtCy } = nodeCenter(tgtNode);

  const dx = tgtCx - srcCx;
  const dy = tgtCy - srcCy;

  // For inter-zone edges near a quadrant boundary, nudge by zone direction
  if (zoneCenters && srcZoneKey && tgtZoneKey && srcZoneKey !== tgtZoneKey) {
    const angle = Math.atan2(dy, dx);
    const BOUNDARY_ZONE = (8 * Math.PI) / 180; // ±8°

    // Check if angle is near any boundary (±48°, ±132°)
    const boundaries = [H_HALF, Math.PI - H_HALF, -H_HALF, -(Math.PI - H_HALF)];
    const nearBoundary = boundaries.some((b) => Math.abs(angle - b) < BOUNDARY_ZONE);

    if (nearBoundary) {
      const srcZC = zoneCenters.get(srcZoneKey);
      const tgtZC = zoneCenters.get(tgtZoneKey);
      if (srcZC && tgtZC) {
        // Light nudge (20%) toward zone direction to break the tie
        const zdx = tgtZC.cx - srcZC.cx;
        const zdy = tgtZC.cy - srcZC.cy;
        return directionToHandles(dx + zdx * 0.2, dy + zdy * 0.2);
      }
    }
  }

  return directionToHandles(dx, dy);
}

// ---------------------------------------------------------------------------
// Spread offsets — replaces the old "fanOut" perpendicular handle swap
// ---------------------------------------------------------------------------

/**
 * When multiple edges share the same handle on a node, instead of forcing
 * them onto perpendicular handles (which creates unnatural curves), we keep
 * the same handle direction and spread the exit/entry points along the
 * handle's edge.
 *
 * The spread data is written into `edge.data.srcSpreadIndex / srcSpreadTotal`
 * (and `tgtSpreadIndex / tgtSpreadTotal` for the target side).
 * `connection-edge.tsx` reads these to shift the Bezier endpoints.
 */
function assignSpreadOffsets(edges: Edge[], nodeMap: Map<string, Node>): void {
  assignSpreadOneSide(edges, nodeMap, 'source');
  assignSpreadOneSide(edges, nodeMap, 'target');
}

function assignSpreadOneSide(
  edges: Edge[],
  nodeMap: Map<string, Node>,
  side: 'source' | 'target',
): void {
  const handleProp: 'sourceHandle' | 'targetHandle' =
    side === 'source' ? 'sourceHandle' : 'targetHandle';
  const otherSide: 'source' | 'target' = side === 'source' ? 'target' : 'source';
  const spreadIdxKey = side === 'source' ? 'srcSpreadIndex' : 'tgtSpreadIndex';
  const spreadTotalKey = side === 'source' ? 'srcSpreadTotal' : 'tgtSpreadTotal';

  // Group edges by (nodeId, handle)
  const groups = new Map<string, number[]>();
  for (let i = 0; i < edges.length; i++) {
    const key = `${edges[i][side]}::${edges[i][handleProp] ?? ''}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(i);
  }

  for (const [key, indices] of groups) {
    if (indices.length < 2) continue;

    const sepIdx = key.indexOf('::');
    const nodeId = key.slice(0, sepIdx);
    const handle = key.slice(sepIdx + 2);
    const node = nodeMap.get(nodeId);
    if (!node || !handle) continue;

    const { cx: ncx, cy: ncy } = nodeCenter(node);
    const isVertical = handle.endsWith('top') || handle.endsWith('bottom');

    // Sort by the secondary-axis position of the other-side node
    const sorted = indices.map((idx) => {
      const otherNode = nodeMap.get(edges[idx][otherSide] ?? '');
      if (!otherNode) return { idx, offset: 0 };
      const { cx: ocx, cy: ocy } = nodeCenter(otherNode);
      return { idx, offset: isVertical ? ocx - ncx : ocy - ncy };
    });
    sorted.sort((a, b) => a.offset - b.offset);

    // Write spread index/total into edge data
    const total = sorted.length;
    for (let i = 0; i < total; i++) {
      const { idx } = sorted[i];
      const existingData = (edges[idx].data ?? {}) as Record<string, unknown>;
      edges[idx] = {
        ...edges[idx],
        data: { ...existingData, [spreadIdxKey]: i, [spreadTotalKey]: total },
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Main hook
// ---------------------------------------------------------------------------

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

  // Compute handles (angle-based) + spread offsets + focus dimming
  const layoutedEdges = useMemo<Edge[]>(() => {
    // Pass 1: angle-based handle selection per edge
    const result = rawEdges.map((edge) => {
      const srcNode = nodeMap.get(edge.source);
      const tgtNode = nodeMap.get(edge.target);

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

    // Pass 2: assign spread offsets for congested handles
    // (edges keep their handle direction, but exit/entry points are distributed)
    assignSpreadOffsets(result, nodeMap);

    return result;
  }, [rawEdges, nodeMap, focusedNodeId, neighborSet, zoneCenters, nodeZoneMap]);

  return { layoutedNodes, layoutedEdges, neighborSet };
}
