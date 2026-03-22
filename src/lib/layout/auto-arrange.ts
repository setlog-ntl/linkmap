/**
 * Auto-Arrange Algorithm
 *
 * Analyzes zone sizes, node counts, and edge connections to produce
 * an optimal layout for all zones and their service nodes.
 *
 * Strategy:
 * 1. Build a weighted graph of zone-to-zone connections
 * 2. Place the most-connected zone centrally
 * 3. Arrange remaining zones around it based on connection density
 * 4. Within each zone, arrange nodes in a grid optimized for inter-zone edges
 */
import type { Node, Edge } from '@xyflow/react';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 72;
const NODE_GAP_X = 40;
const NODE_GAP_Y = 32;
const ZONE_PADDING = 40;
const ZONE_HEADER = 44;
const ZONE_GAP = 80;
const INNER_COLS = 3;

export interface ArrangeResult {
  zonePositions: Record<string, { x: number; y: number }>;
  zoneSizes: Record<string, { width: number; height: number }>;
  nodePositions: Record<string, { x: number; y: number }>;
}

interface ZoneInfo {
  id: string;        // zone-frontend
  key: string;       // frontend
  nodeIds: string[]; // service node ids in this zone
  connections: number; // total inter-zone edge count
}

/**
 * Compute optimal positions for all zones and nodes.
 */
export function autoArrange(
  nodes: Node[],
  edges: Edge[],
  getZoneKey: (nodeId: string) => string | null,
): ArrangeResult {
  // 1. Collect zone info
  const zoneMap = new Map<string, ZoneInfo>();
  const serviceNodes: Node[] = [];

  for (const node of nodes) {
    if (node.type === 'zone') {
      const key = node.id.replace('zone-', '');
      zoneMap.set(key, { id: node.id, key, nodeIds: [], connections: 0 });
    } else {
      serviceNodes.push(node);
    }
  }

  // Assign service nodes to zones
  for (const node of serviceNodes) {
    const zoneKey = getZoneKey(node.id);
    if (zoneKey && zoneMap.has(zoneKey)) {
      zoneMap.get(zoneKey)!.nodeIds.push(node.id);
    }
  }

  // 2. Count inter-zone connections per zone
  const zoneEdgePairs = new Map<string, number>(); // "zoneA::zoneB" → count
  for (const edge of edges) {
    const srcZone = getZoneKey(edge.source ?? '');
    const tgtZone = getZoneKey(edge.target ?? '');
    if (srcZone && tgtZone && srcZone !== tgtZone) {
      const pairKey = [srcZone, tgtZone].sort().join('::');
      zoneEdgePairs.set(pairKey, (zoneEdgePairs.get(pairKey) || 0) + 1);
      const srcInfo = zoneMap.get(srcZone);
      const tgtInfo = zoneMap.get(tgtZone);
      if (srcInfo) srcInfo.connections++;
      if (tgtInfo) tgtInfo.connections++;
    }
  }

  // 3. Sort zones: most connected first
  const sortedZones = [...zoneMap.values()].sort((a, b) => b.connections - a.connections);
  if (sortedZones.length === 0) return { zonePositions: {}, zoneSizes: {}, nodePositions: {} };

  // 4. Compute zone sizes
  const zoneSizes: Record<string, { width: number; height: number }> = {};
  for (const zone of sortedZones) {
    const count = zone.nodeIds.length;
    const rows = Math.max(1, Math.ceil(count / INNER_COLS));
    const cols = Math.min(count || 1, INNER_COLS);
    zoneSizes[zone.id] = {
      width: Math.max(
        INNER_COLS * NODE_WIDTH + (INNER_COLS - 1) * NODE_GAP_X + 2 * ZONE_PADDING,
        cols * NODE_WIDTH + (cols - 1) * NODE_GAP_X + 2 * ZONE_PADDING,
      ),
      height: Math.max(
        ZONE_HEADER + NODE_HEIGHT + 2 * ZONE_PADDING,
        ZONE_HEADER + rows * NODE_HEIGHT + (rows - 1) * NODE_GAP_Y + 2 * ZONE_PADDING,
      ),
    };
  }

  // 5. Place zones — use a flow-based layout
  //    Row 1: zones with most connections (frontend/backend typically)
  //    Row 2: zones with fewer connections (devtools, etc.)
  const zonePositions: Record<string, { x: number; y: number }> = {};

  if (sortedZones.length <= 2) {
    // 1-2 zones: horizontal
    let x = 0;
    for (const zone of sortedZones) {
      const size = zoneSizes[zone.id];
      zonePositions[zone.id] = { x, y: 0 };
      x += size.width + ZONE_GAP;
    }
  } else {
    // 3+ zones: place the two most connected side-by-side on row 1,
    // remaining below, centered
    const row1 = sortedZones.slice(0, 2);
    const row2 = sortedZones.slice(2);

    // Check if the two most connected zones have a strong connection between them
    const pairKey = [row1[0].key, row1[1].key].sort().join('::');
    const pairCount = zoneEdgePairs.get(pairKey) || 0;

    // If they're strongly connected, place them horizontally adjacent
    let x = 0;
    const row1Height = Math.max(...row1.map((z) => zoneSizes[z.id].height));
    for (const zone of row1) {
      const size = zoneSizes[zone.id];
      zonePositions[zone.id] = { x, y: 0 };
      x += size.width + ZONE_GAP;
    }

    // Row 2: center below row 1
    const row1TotalWidth = row1.reduce((sum, z) => sum + zoneSizes[z.id].width, 0) + (row1.length - 1) * ZONE_GAP;
    const row2TotalWidth = row2.reduce((sum, z) => sum + zoneSizes[z.id].width, 0) + Math.max(0, row2.length - 1) * ZONE_GAP;
    let row2X = (row1TotalWidth - row2TotalWidth) / 2;
    const row2Y = row1Height + ZONE_GAP;

    for (const zone of row2) {
      const size = zoneSizes[zone.id];
      zonePositions[zone.id] = { x: row2X, y: row2Y };
      row2X += size.width + ZONE_GAP;
    }
  }

  // 6. Place service nodes within each zone
  const nodePositions: Record<string, { x: number; y: number }> = {};

  for (const zone of sortedZones) {
    const pos = zonePositions[zone.id];
    if (!pos) continue;

    // Sort nodes: nodes with more inter-zone connections go to edges for shorter paths
    const nodeConnCounts = new Map<string, number>();
    for (const nid of zone.nodeIds) {
      let count = 0;
      for (const edge of edges) {
        const isSource = edge.source === nid;
        const isTarget = edge.target === nid;
        if (!isSource && !isTarget) continue;
        const otherNodeId = isSource ? (edge.target ?? '') : (edge.source ?? '');
        const otherZone = getZoneKey(otherNodeId);
        if (otherZone && otherZone !== zone.key) count++;
      }
      nodeConnCounts.set(nid, count);
    }

    // Sort: external-connected nodes first (placed at edges of grid),
    // internal-only nodes in center
    const sortedNodeIds = [...zone.nodeIds].sort((a, b) => {
      return (nodeConnCounts.get(b) || 0) - (nodeConnCounts.get(a) || 0);
    });

    sortedNodeIds.forEach((nodeId, idx) => {
      const localRow = Math.floor(idx / INNER_COLS);
      const localCol = idx % INNER_COLS;
      nodePositions[nodeId] = {
        x: pos.x + ZONE_PADDING + localCol * (NODE_WIDTH + NODE_GAP_X),
        y: pos.y + ZONE_HEADER + ZONE_PADDING + localRow * (NODE_HEIGHT + NODE_GAP_Y),
      };
    });
  }

  return { zonePositions, zoneSizes, nodePositions };
}
