/**
 * Auto-Arrange Algorithm v2
 *
 * Analyzes zone sizes, node counts, and edge connections to produce
 * an optimal layout where lines don't overlap or cross zones.
 *
 * Key improvements over v1:
 * - Zone gap scales with number of inter-zone edges (more edges → wider gap)
 * - Nodes within a zone are placed on the side facing their connected zone
 * - Connection-aware sorting prevents edge crossing
 */
import type { Node, Edge } from '@xyflow/react';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 72;
const NODE_GAP_X = 40;
const NODE_GAP_Y = 32;
const ZONE_PADDING = 40;
const ZONE_HEADER = 44;
const BASE_ZONE_GAP = 120;  // minimum gap between zones
const EDGE_GAP_BONUS = 20;  // extra gap per inter-zone edge
const MAX_ZONE_GAP = 280;   // cap
const INNER_COLS = 3;

export interface ArrangeResult {
  zonePositions: Record<string, { x: number; y: number }>;
  zoneSizes: Record<string, { width: number; height: number }>;
  nodePositions: Record<string, { x: number; y: number }>;
}

interface ZoneInfo {
  id: string;
  key: string;
  nodeIds: string[];
  connections: number;
}

/**
 * Compute optimal positions for all zones and nodes,
 * minimizing edge crossings and preventing line overlap.
 */
export function autoArrange(
  nodes: Node[],
  edges: Edge[],
  getZoneKey: (nodeId: string) => string | null,
): ArrangeResult {
  // ── 1. Collect zone info ──────────────────────────────────────
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

  for (const node of serviceNodes) {
    const zoneKey = getZoneKey(node.id);
    if (zoneKey && zoneMap.has(zoneKey)) {
      zoneMap.get(zoneKey)!.nodeIds.push(node.id);
    }
  }

  // ── 2. Build zone connection graph ────────────────────────────
  const zoneEdgePairs = new Map<string, number>();
  // Track per-node: which other zones it connects to
  const nodeExternalZones = new Map<string, Set<string>>();

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

      // Track which zones each node connects to externally
      if (edge.source) {
        if (!nodeExternalZones.has(edge.source)) nodeExternalZones.set(edge.source, new Set());
        nodeExternalZones.get(edge.source)!.add(tgtZone);
      }
      if (edge.target) {
        if (!nodeExternalZones.has(edge.target)) nodeExternalZones.set(edge.target, new Set());
        nodeExternalZones.get(edge.target)!.add(srcZone);
      }
    }
  }

  // ── 3. Sort zones: most connected first ───────────────────────
  const sortedZones = [...zoneMap.values()].sort((a, b) => b.connections - a.connections);
  if (sortedZones.length === 0) return { zonePositions: {}, zoneSizes: {}, nodePositions: {} };

  // ── 4. Compute zone sizes ─────────────────────────────────────
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

  // ── 5. Place zones with connection-aware gaps ─────────────────
  const zonePositions: Record<string, { x: number; y: number }> = {};

  // Compute dynamic gap between two zones
  const gapBetween = (z1Key: string, z2Key: string): number => {
    const pairKey = [z1Key, z2Key].sort().join('::');
    const edgeCount = zoneEdgePairs.get(pairKey) || 0;
    return Math.min(MAX_ZONE_GAP, BASE_ZONE_GAP + edgeCount * EDGE_GAP_BONUS);
  };

  if (sortedZones.length <= 2) {
    let x = 0;
    for (let i = 0; i < sortedZones.length; i++) {
      const zone = sortedZones[i];
      zonePositions[zone.id] = { x, y: 0 };
      if (i < sortedZones.length - 1) {
        const gap = gapBetween(zone.key, sortedZones[i + 1].key);
        x += zoneSizes[zone.id].width + gap;
      }
    }
  } else {
    // 3+ zones: top row = most connected pair, bottom row = rest
    const row1 = sortedZones.slice(0, 2);
    const row2 = sortedZones.slice(2);

    // Place row 1
    const row1Gap = gapBetween(row1[0].key, row1[1].key);
    zonePositions[row1[0].id] = { x: 0, y: 0 };
    zonePositions[row1[1].id] = { x: zoneSizes[row1[0].id].width + row1Gap, y: 0 };
    const row1Height = Math.max(...row1.map((z) => zoneSizes[z.id].height));
    const row1TotalWidth = zoneSizes[row1[0].id].width + row1Gap + zoneSizes[row1[1].id].width;

    // Row 2: center below row 1 with connection-aware vertical gap
    // Vertical gap = max gap between any row1↔row2 zone pair
    let maxVerticalGap = BASE_ZONE_GAP;
    for (const r1 of row1) {
      for (const r2 of row2) {
        maxVerticalGap = Math.max(maxVerticalGap, gapBetween(r1.key, r2.key));
      }
    }
    const row2Y = row1Height + maxVerticalGap;

    // Center row 2 under the zone it connects to most
    if (row2.length === 1) {
      // Single zone on row 2: center under whichever row1 zone it connects to more
      const r2Zone = row2[0];
      const conn0 = zoneEdgePairs.get([row1[0].key, r2Zone.key].sort().join('::')) || 0;
      const conn1 = zoneEdgePairs.get([row1[1].key, r2Zone.key].sort().join('::')) || 0;
      const r2Size = zoneSizes[r2Zone.id];

      if (conn0 > conn1) {
        // Center under row1[0]
        const r1Pos = zonePositions[row1[0].id];
        const r1Size = zoneSizes[row1[0].id];
        zonePositions[r2Zone.id] = {
          x: r1Pos.x + (r1Size.width - r2Size.width) / 2,
          y: row2Y,
        };
      } else if (conn1 > conn0) {
        // Center under row1[1]
        const r1Pos = zonePositions[row1[1].id];
        const r1Size = zoneSizes[row1[1].id];
        zonePositions[r2Zone.id] = {
          x: r1Pos.x + (r1Size.width - r2Size.width) / 2,
          y: row2Y,
        };
      } else {
        // Equal or no connections: center under both
        const r2X = (row1TotalWidth - r2Size.width) / 2;
        zonePositions[r2Zone.id] = { x: r2X, y: row2Y };
      }
    } else {
      // Multiple zones on row 2: center the group
      const row2TotalWidth = row2.reduce((sum, z) => sum + zoneSizes[z.id].width, 0)
        + Math.max(0, row2.length - 1) * BASE_ZONE_GAP;
      let row2X = (row1TotalWidth - row2TotalWidth) / 2;
      for (let i = 0; i < row2.length; i++) {
        const zone = row2[i];
        zonePositions[zone.id] = { x: row2X, y: row2Y };
        if (i < row2.length - 1) {
          row2X += zoneSizes[zone.id].width + gapBetween(zone.key, row2[i + 1].key);
        }
      }
    }
  }

  // ── 6. Place nodes within zones — connection-direction aware ──
  const nodePositions: Record<string, { x: number; y: number }> = {};

  for (const zone of sortedZones) {
    const pos = zonePositions[zone.id];
    if (!pos) continue;

    const count = zone.nodeIds.length;
    if (count === 0) continue;

    const rows = Math.max(1, Math.ceil(count / INNER_COLS));
    const cols = Math.min(count, INNER_COLS);

    // For each node, compute a "direction score" based on where its
    // connected zones are relative to this zone.
    // Positive X score = node should be on the right (connects to zones on the right).
    // Positive Y score = node should be at the bottom (connects to zones below).
    const nodeScores = new Map<string, { xScore: number; yScore: number; extCount: number }>();
    const zoneCx = pos.x + zoneSizes[zone.id].width / 2;
    const zoneCy = pos.y + zoneSizes[zone.id].height / 2;

    for (const nid of zone.nodeIds) {
      let xScore = 0;
      let yScore = 0;
      let extCount = 0;
      const externalZones = nodeExternalZones.get(nid);
      if (externalZones) {
        for (const extZoneKey of externalZones) {
          const extZoneInfo = zoneMap.get(extZoneKey);
          if (!extZoneInfo) continue;
          const extPos = zonePositions[extZoneInfo.id];
          const extSize = zoneSizes[extZoneInfo.id];
          if (!extPos || !extSize) continue;

          const extCx = extPos.x + extSize.width / 2;
          const extCy = extPos.y + extSize.height / 2;
          // Direction from this zone center to the external zone center
          xScore += extCx - zoneCx;
          yScore += extCy - zoneCy;
          extCount++;
        }
      }
      nodeScores.set(nid, { xScore, yScore, extCount });
    }

    // Sort nodes into grid positions:
    // Primary sort: by Y score (nodes connecting down go to bottom rows)
    // Secondary sort: by X score (nodes connecting right go to right columns)
    const sortedNodeIds = [...zone.nodeIds].sort((a, b) => {
      const sa = nodeScores.get(a) || { xScore: 0, yScore: 0, extCount: 0 };
      const sb = nodeScores.get(b) || { xScore: 0, yScore: 0, extCount: 0 };

      // Externally connected nodes come before internal-only nodes
      if (sa.extCount > 0 && sb.extCount === 0) return -1;
      if (sa.extCount === 0 && sb.extCount > 0) return 1;

      // Sort by dominant direction
      // For a horizontal layout, X direction matters more for column placement
      // For vertical, Y matters more for row placement
      if (rows > 1) {
        // Multi-row: primary sort by Y score (top vs bottom)
        const yDiff = sa.yScore - sb.yScore;
        if (Math.abs(yDiff) > 50) return yDiff;
      }
      // Secondary: by X score (left vs right)
      return sa.xScore - sb.xScore;
    });

    // Assign grid positions
    sortedNodeIds.forEach((nodeId, idx) => {
      const localRow = Math.floor(idx / cols);
      const localCol = idx % cols;
      nodePositions[nodeId] = {
        x: pos.x + ZONE_PADDING + localCol * (NODE_WIDTH + NODE_GAP_X),
        y: pos.y + ZONE_HEADER + ZONE_PADDING + localRow * (NODE_HEIGHT + NODE_GAP_Y),
      };
    });
  }

  return { zonePositions, zoneSizes, nodePositions };
}
