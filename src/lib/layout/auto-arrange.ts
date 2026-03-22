/**
 * Auto-Arrange Algorithm v3
 *
 * Produces a clean layout where edges don't cross or overlap.
 *
 * Key design decisions:
 * - Zones with many external connections use **2 columns** (not 3)
 *   to give vertical space for edge routing
 * - Node gaps are wide (64px vertical) so Bezier curves don't overlap
 * - Nodes are placed on the side of their zone that faces
 *   the **specific nodes** they connect to (not just the zone center)
 * - Zone size automatically expands based on connection density
 */
import type { Node, Edge } from '@xyflow/react';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 72;
const NODE_GAP_X = 50;
const NODE_GAP_Y = 64;        // wide vertical gap for line routing
const STAGGER_OFFSET = Math.round(NODE_HEIGHT * 0.5); // 36px — odd columns shifted down
const ZONE_PADDING = 50;      // generous padding inside zone
const ZONE_HEADER = 48;
const BASE_ZONE_GAP = 140;
const EDGE_GAP_BONUS = 25;
const MAX_ZONE_GAP = 320;

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
  externalNodeCount: number;  // how many nodes have external connections
}

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
      zoneMap.set(key, { id: node.id, key, nodeIds: [], connections: 0, externalNodeCount: 0 });
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

  // ── 2. Build connection graph ─────────────────────────────────
  const zoneEdgePairs = new Map<string, number>();
  const nodeExternalZones = new Map<string, Set<string>>();
  // Track specific node-to-node connections across zones
  const crossZoneEdges: { src: string; tgt: string; srcZone: string; tgtZone: string }[] = [];

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

      if (edge.source) {
        if (!nodeExternalZones.has(edge.source)) nodeExternalZones.set(edge.source, new Set());
        nodeExternalZones.get(edge.source)!.add(tgtZone);
      }
      if (edge.target) {
        if (!nodeExternalZones.has(edge.target)) nodeExternalZones.set(edge.target, new Set());
        nodeExternalZones.get(edge.target)!.add(srcZone);
      }

      if (edge.source && edge.target) {
        crossZoneEdges.push({ src: edge.source, tgt: edge.target, srcZone, tgtZone });
      }
    }
  }

  // Count how many nodes in each zone have external connections
  for (const zone of zoneMap.values()) {
    for (const nid of zone.nodeIds) {
      if (nodeExternalZones.has(nid)) zone.externalNodeCount++;
    }
  }

  // ── 3. Sort zones ─────────────────────────────────────────────
  const sortedZones = [...zoneMap.values()].sort((a, b) => b.connections - a.connections);
  if (sortedZones.length === 0) return { zonePositions: {}, zoneSizes: {}, nodePositions: {} };

  // ── 4. Compute zone sizes with dynamic column count ───────────
  const zoneSizes: Record<string, { width: number; height: number }> = {};
  const zoneCols: Record<string, number> = {};

  for (const zone of sortedZones) {
    const count = zone.nodeIds.length;
    // Use 2 columns when zone has many external connections or ≤4 nodes
    // This gives more vertical space for edge routing
    const hasHighConnectivity = zone.externalNodeCount >= 3 || zone.connections >= 6;
    const cols = (count <= 4 || hasHighConnectivity) ? Math.min(count || 1, 2) : Math.min(count || 1, 3);
    zoneCols[zone.id] = cols;

    const rows = Math.max(1, Math.ceil(count / cols));
    // Add extra padding for zones with many external connections
    const extraPad = zone.externalNodeCount >= 3 ? 20 : 0;
    const pad = ZONE_PADDING + extraPad;

    const minCols = cols;
    const stagger = cols > 1 ? STAGGER_OFFSET : 0;
    zoneSizes[zone.id] = {
      width: Math.max(
        minCols * NODE_WIDTH + (minCols - 1) * NODE_GAP_X + 2 * pad,
        2 * NODE_WIDTH + NODE_GAP_X + 2 * pad,  // minimum 2-col width
      ),
      height: Math.max(
        ZONE_HEADER + NODE_HEIGHT + stagger + 2 * pad,
        ZONE_HEADER + rows * NODE_HEIGHT + (rows - 1) * NODE_GAP_Y + stagger + 2 * pad,
      ),
    };
  }

  // ── 5. Place zones ────────────────────────────────────────────
  const zonePositions: Record<string, { x: number; y: number }> = {};

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
        x += zoneSizes[zone.id].width + gapBetween(zone.key, sortedZones[i + 1].key);
      }
    }
  } else {
    // 3+ zones: row1 = top, row2 = bottom
    // Decide which zones go on row1:
    // The two zones with most MUTUAL connections go side by side
    let bestPair: [number, number] = [0, 1];
    let bestPairScore = 0;
    for (let i = 0; i < sortedZones.length; i++) {
      for (let j = i + 1; j < sortedZones.length; j++) {
        const pk = [sortedZones[i].key, sortedZones[j].key].sort().join('::');
        const score = zoneEdgePairs.get(pk) || 0;
        if (score > bestPairScore) {
          bestPairScore = score;
          bestPair = [i, j];
        }
      }
    }

    // If no mutual connections, fall back to most-connected zones
    const row1Indices = bestPairScore > 0 ? bestPair : [0, 1];
    const row1 = row1Indices.map((i) => sortedZones[i]);
    const row2 = sortedZones.filter((_, i) => !row1Indices.includes(i));

    // Place row 1 — order: smaller node count first (less visual weight on left)
    if (row1[0].nodeIds.length > row1[1].nodeIds.length) row1.reverse();
    const row1Gap = gapBetween(row1[0].key, row1[1].key);
    zonePositions[row1[0].id] = { x: 0, y: 0 };
    zonePositions[row1[1].id] = { x: zoneSizes[row1[0].id].width + row1Gap, y: 0 };
    const row1Height = Math.max(...row1.map((z) => zoneSizes[z.id].height));
    const row1TotalWidth = zoneSizes[row1[0].id].width + row1Gap + zoneSizes[row1[1].id].width;

    // Row 2 vertical gap
    let maxVerticalGap = BASE_ZONE_GAP;
    for (const r1 of row1) {
      for (const r2 of row2) {
        maxVerticalGap = Math.max(maxVerticalGap, gapBetween(r1.key, r2.key));
      }
    }
    const row2Y = row1Height + maxVerticalGap;

    if (row2.length === 1) {
      const r2Zone = row2[0];
      const r2Size = zoneSizes[r2Zone.id];
      // Center under the entire row1 span
      zonePositions[r2Zone.id] = {
        x: (row1TotalWidth - r2Size.width) / 2,
        y: row2Y,
      };
    } else {
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

  // ── 6. Place nodes — connection-target aware ──────────────────
  const nodePositions: Record<string, { x: number; y: number }> = {};

  for (const zone of sortedZones) {
    const pos = zonePositions[zone.id];
    if (!pos) continue;

    const count = zone.nodeIds.length;
    if (count === 0) continue;

    const cols = zoneCols[zone.id] || Math.min(count, 3);
    const extraPad = zone.externalNodeCount >= 3 ? 20 : 0;
    const pad = ZONE_PADDING + extraPad;

    // For each node, compute WHERE its connected nodes actually are.
    // This uses the positions of the connected nodes' ZONES (since we don't
    // know individual node positions yet — chicken-and-egg).
    // xScore > 0 means "my connections are to the right" → place me on the right.
    // yScore > 0 means "my connections are below" → place me at the bottom.
    const nodeScores = new Map<string, { xScore: number; yScore: number; extCount: number }>();
    const zoneCx = pos.x + zoneSizes[zone.id].width / 2;
    const zoneCy = pos.y + zoneSizes[zone.id].height / 2;

    for (const nid of zone.nodeIds) {
      let xScore = 0;
      let yScore = 0;
      let extCount = 0;

      // Check all cross-zone edges involving this node
      for (const ce of crossZoneEdges) {
        const isMe = ce.src === nid || ce.tgt === nid;
        if (!isMe) continue;

        const otherZoneKey = ce.src === nid ? ce.tgtZone : ce.srcZone;
        const otherZoneInfo = zoneMap.get(otherZoneKey);
        if (!otherZoneInfo) continue;

        const otherPos = zonePositions[otherZoneInfo.id];
        const otherSize = zoneSizes[otherZoneInfo.id];
        if (!otherPos || !otherSize) continue;

        // Direction vector from THIS zone center to OTHER zone center
        xScore += (otherPos.x + otherSize.width / 2) - zoneCx;
        yScore += (otherPos.y + otherSize.height / 2) - zoneCy;
        extCount++;
      }

      nodeScores.set(nid, { xScore, yScore, extCount });
    }

    // Sort nodes for grid placement:
    // 1. External nodes first, internal nodes last
    // 2. Among external nodes, sort by X score (left-connecting → left column)
    // 3. Within same column, sort by Y score
    const sortedNodeIds = [...zone.nodeIds].sort((a, b) => {
      const sa = nodeScores.get(a) || { xScore: 0, yScore: 0, extCount: 0 };
      const sb = nodeScores.get(b) || { xScore: 0, yScore: 0, extCount: 0 };

      // External nodes first
      if (sa.extCount > 0 && sb.extCount === 0) return -1;
      if (sa.extCount === 0 && sb.extCount > 0) return 1;

      // Among external nodes: sort by X so left-connecting → col 0, right-connecting → col 1
      const xDiff = sa.xScore - sb.xScore;
      if (Math.abs(xDiff) > 20) return xDiff;

      // Tie-break: by Y score
      return sa.yScore - sb.yScore;
    });

    // Assign grid positions
    sortedNodeIds.forEach((nodeId, idx) => {
      const localRow = Math.floor(idx / cols);
      const localCol = idx % cols;
      const baseY = pos.y + ZONE_HEADER + pad + localRow * (NODE_HEIGHT + NODE_GAP_Y);
      nodePositions[nodeId] = {
        x: pos.x + pad + localCol * (NODE_WIDTH + NODE_GAP_X),
        y: baseY + (localCol % 2 === 1 ? STAGGER_OFFSET : 0),
      };
    });
  }

  return { zonePositions, zoneSizes, nodePositions };
}
