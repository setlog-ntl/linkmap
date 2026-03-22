/**
 * Auto-Arrange Algorithm v4 — Connection-Aligned Layout
 *
 * Key improvements over v3:
 * 1. Flow-based zone ordering (sources left, targets right)
 * 2. Barycenter pre-pass (4 iterations L-R-L-R) for optimal node ordering
 * 3. Cross-zone Y-alignment (connected nodes share matching Y positions)
 * 4. Smart column assignment (nodes face their connections)
 * 5. Unconnected nodes fill gaps naturally in balanced columns
 * 6. Bottom-row zones X-centered under their connections
 * 7. Adaptive zone sizing from actual node placement
 * 8. No stagger offset — Y-alignment handles visual separation
 */
import type { Node, Edge } from '@xyflow/react';

// ── Constants ────────────────────────────────────────────────────────
const NODE_W = 180;
const NODE_H = 72;
const GAP_X = 50;            // horizontal gap between columns
const GAP_Y = 56;            // vertical gap between rows
const PAD = 50;              // zone inner padding
const HEADER = 48;           // zone header height
const BASE_GAP = 140;        // base gap between zones
const EDGE_BONUS = 25;       // extra gap per cross-zone edge
const MAX_GAP = 320;         // maximum zone-to-zone gap
const MIN_W = 2 * NODE_W + GAP_X + 2 * PAD;
const MIN_H = HEADER + NODE_H + 2 * PAD;

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
  externalNodeCount: number;
}

// ══════════════════════════════════════════════════════════════════════
// Main
// ══════════════════════════════════════════════════════════════════════
export function autoArrange(
  nodes: Node[],
  edges: Edge[],
  getZoneKey: (nodeId: string) => string | null,
): ArrangeResult {
  /* ── 1. Parse zones and service nodes ──────────────────────────── */
  const zoneMap = new Map<string, ZoneInfo>();
  for (const n of nodes) {
    if (n.type === 'zone') {
      const k = n.id.replace('zone-', '');
      zoneMap.set(k, { id: n.id, key: k, nodeIds: [], connections: 0, externalNodeCount: 0 });
    }
  }
  for (const n of nodes) {
    if (n.type !== 'zone') {
      const z = getZoneKey(n.id);
      if (z && zoneMap.has(z)) zoneMap.get(z)!.nodeIds.push(n.id);
    }
  }

  /* ── 2. Build cross-zone adjacency ─────────────────────────────── */
  const adj = new Map<string, { nid: string; zone: string }[]>();
  const pairCount = new Map<string, number>();
  const flowDir = new Map<string, number>();

  for (const e of edges) {
    const sz = getZoneKey(e.source ?? '');
    const tz = getZoneKey(e.target ?? '');
    if (!sz || !tz || sz === tz || !e.source || !e.target) continue;

    pushAdj(adj, e.source, e.target, tz);
    pushAdj(adj, e.target, e.source, sz);

    const pk = [sz, tz].sort().join('::');
    pairCount.set(pk, (pairCount.get(pk) || 0) + 1);
    flowDir.set(`${sz}::${tz}`, (flowDir.get(`${sz}::${tz}`) || 0) + 1);

    zoneMap.get(sz)!.connections++;
    zoneMap.get(tz)!.connections++;
  }

  for (const z of zoneMap.values())
    z.externalNodeCount = z.nodeIds.filter(n => adj.has(n)).length;

  const zones = [...zoneMap.values()];
  if (!zones.length) return { zonePositions: {}, zoneSizes: {}, nodePositions: {} };

  /* ── 3. Flow-based zone ordering ───────────────────────────────── */
  // Flow score: positive = more outgoing (source-like → goes left)
  const fScore = new Map<string, number>();
  for (const z of zones) {
    let s = 0;
    for (const o of zones) {
      if (o.key === z.key) continue;
      s += (flowDir.get(`${z.key}::${o.key}`) || 0)
        - (flowDir.get(`${o.key}::${z.key}`) || 0);
    }
    fScore.set(z.key, s);
  }

  const isBot = (k: string) => k === 'devtools';
  const topZones = zones.filter(z => !isBot(z.key))
    .sort((a, b) => (fScore.get(b.key) || 0) - (fScore.get(a.key) || 0)
      || b.connections - a.connections);
  const botZones = zones.filter(z => isBot(z.key));

  const hIdx = new Map<string, number>();
  topZones.forEach((z, i) => hIdx.set(z.key, i));

  const allOrdered = [...topZones, ...botZones];

  /* ── 4. Column count per zone ──────────────────────────────────── */
  const colCnt = new Map<string, number>();
  for (const z of zones) {
    const n = z.nodeIds.length;
    const hi = z.externalNodeCount >= 3 || z.connections >= 6;
    colCnt.set(z.id, (n <= 4 || hi) ? Math.min(n || 1, 2) : Math.min(n || 1, 3));
  }

  /* ── 5. Column assignment per node ─────────────────────────────── */
  const nodeCol = new Map<string, number>();

  for (const zone of allOrdered) {
    const cols = colCnt.get(zone.id) || 1;
    const myI = hIdx.get(zone.key) ?? 0;

    // Connected nodes: column based on connection direction
    for (const nid of zone.nodeIds) {
      if (cols < 2 || !adj.has(nid)) {
        nodeCol.set(nid, 0);
        continue;
      }

      if (isBot(zone.key)) {
        // Bottom zones: use X position of connections for column
        nodeCol.set(nid, 0);
      } else {
        const nbs = adj.get(nid)!;
        let leftN = 0, rightN = 0;
        for (const nb of nbs) {
          const oi = hIdx.get(nb.zone);
          if (oi === undefined) continue;
          if (oi < myI) leftN++;
          else if (oi > myI) rightN++;
        }
        nodeCol.set(nid, rightN > leftN ? cols - 1 : 0);
      }
    }

    // Balance: assign unconnected nodes to least-filled column
    const buckets: number[] = Array(cols).fill(0);
    for (const nid of zone.nodeIds) {
      if (adj.has(nid)) buckets[nodeCol.get(nid) || 0]++;
    }
    for (const nid of zone.nodeIds) {
      if (!adj.has(nid)) {
        const minC = buckets.indexOf(Math.min(...buckets));
        nodeCol.set(nid, minC);
        buckets[minC]++;
      }
    }
  }

  /* ── 6. Barycenter pre-pass (4 iterations) ─────────────────────── */
  // Computes optimal node ordering within each zone to minimize crossings
  const slot = new Map<string, number>();

  // Initialize: connected nodes first (by connection count), unconnected last
  for (const zone of allOrdered) {
    const cols = colCnt.get(zone.id) || 1;
    const colBuckets = makeBuckets(zone.nodeIds, cols, nodeCol);

    for (const col of colBuckets) {
      col.sort((a, b) => (adj.get(b)?.length || 0) - (adj.get(a)?.length || 0));
    }

    let s = 0;
    const maxRows = Math.max(...colBuckets.map(c => c.length), 1);
    for (let r = 0; r < maxRows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r < colBuckets[c].length) slot.set(colBuckets[c][r], s++);
      }
    }
  }

  // Iterative barycenter refinement
  for (let iter = 0; iter < 4; iter++) {
    const order = iter % 2 === 0 ? allOrdered : [...allOrdered].reverse();

    for (const zone of order) {
      const cols = colCnt.get(zone.id) || 1;
      const colBuckets = makeBuckets(zone.nodeIds, cols, nodeCol);

      // Compute barycenters from cross-zone neighbors
      const bary = new Map<string, number>();
      for (const nid of zone.nodeIds) {
        const nbs = adj.get(nid) || [];
        const vals: number[] = [];
        for (const nb of nbs) {
          if (nb.zone === zone.key) continue;
          const s = slot.get(nb.nid);
          if (s !== undefined) vals.push(s);
        }
        if (vals.length) bary.set(nid, avg(vals));
      }

      // Sort each column by barycenter (connected first, then unconnected by slot)
      for (const col of colBuckets) {
        col.sort((a, b) => {
          const ba = bary.get(a), bb = bary.get(b);
          if (ba !== undefined && bb !== undefined) return ba - bb;
          if (ba !== undefined) return -1;
          if (bb !== undefined) return 1;
          return (adj.get(b)?.length || 0) - (adj.get(a)?.length || 0);
        });
      }

      // Reassign slots
      let s = 0;
      const maxRows = Math.max(...colBuckets.map(c => c.length), 1);
      for (let r = 0; r < maxRows; r++) {
        for (let c = 0; c < cols; c++) {
          if (r < colBuckets[c].length) slot.set(colBuckets[c][r], s++);
        }
      }
    }
  }

  /* ── 7. Sequential placement with Y-alignment ──────────────────── */
  const zPos: Record<string, { x: number; y: number }> = {};
  const zSiz: Record<string, { width: number; height: number }> = {};
  const nPos: Record<string, { x: number; y: number }> = {};

  const gapOf = (a: string, b: string) => {
    const pk = [a, b].sort().join('::');
    return Math.min(MAX_GAP, BASE_GAP + (pairCount.get(pk) || 0) * EDGE_BONUS);
  };

  // ── Top row (left → right) ──
  let topX = 0;
  let topMaxH = 0;

  for (let i = 0; i < topZones.length; i++) {
    const zone = topZones[i];
    const cols = colCnt.get(zone.id) || 1;

    const { rel, w, h } = placeZone(zone, cols, adj, slot, nodeCol, nPos);

    zPos[zone.id] = { x: topX, y: 0 };
    zSiz[zone.id] = { width: w, height: h };
    for (const [nid, r] of Object.entries(rel))
      nPos[nid] = { x: topX + r.x, y: r.y };

    topMaxH = Math.max(topMaxH, h);
    topX += w + (i < topZones.length - 1 ? gapOf(zone.key, topZones[i + 1].key) : 0);
  }

  // ── Bottom row (centered under connections) ──
  if (botZones.length) {
    let vGap = BASE_GAP;
    for (const t of topZones)
      for (const b of botZones)
        vGap = Math.max(vGap, gapOf(t.key, b.key));
    const botY = topMaxH + vGap;

    // Compute layouts
    const botLayouts = botZones.map(zone => ({
      zone,
      ...placeZone(zone, colCnt.get(zone.id) || 1, adj, slot, nodeCol, nPos),
    }));

    const totalBotW = botLayouts.reduce((s, l) => s + l.w, 0)
      + Math.max(0, botZones.length - 1) * BASE_GAP;

    // Center: use average X of connected top-row nodes
    let startX = (topX - totalBotW) / 2;
    const connXs: number[] = [];
    for (const bl of botLayouts)
      for (const nid of bl.zone.nodeIds)
        for (const nb of adj.get(nid) || [])
          if (nPos[nb.nid]) connXs.push(nPos[nb.nid].x + NODE_W / 2);

    if (connXs.length)
      startX = avg(connXs) - totalBotW / 2;

    let bx = startX;
    for (let i = 0; i < botLayouts.length; i++) {
      const { zone, rel, w, h } = botLayouts[i];
      zPos[zone.id] = { x: bx, y: botY };
      zSiz[zone.id] = { width: w, height: h };
      for (const [nid, r] of Object.entries(rel))
        nPos[nid] = { x: bx + r.x, y: botY + r.y };
      bx += w + BASE_GAP;
    }
  }

  /* ── 8. Post-refinement: nudge same-row nodes for better alignment */
  refineSameRowAlignment(topZones, adj, nPos, zPos, zSiz);

  return { zonePositions: zPos, zoneSizes: zSiz, nodePositions: nPos };
}

// ══════════════════════════════════════════════════════════════════════
// Place nodes inside a single zone
// ══════════════════════════════════════════════════════════════════════
function placeZone(
  zone: ZoneInfo,
  cols: number,
  adj: Map<string, { nid: string; zone: string }[]>,
  slot: Map<string, number>,
  nodeCol: Map<string, number>,
  placed: Record<string, { x: number; y: number }>,
): { rel: Record<string, { x: number; y: number }>; w: number; h: number } {
  const N = zone.nodeIds.length;
  if (!N) return { rel: {}, w: MIN_W, h: MIN_H };

  // ── Compute target Y from already-placed neighbors ──
  const tgtY = new Map<string, number>();
  for (const nid of zone.nodeIds) {
    const nbs = adj.get(nid) || [];
    const ys: number[] = [];
    for (const nb of nbs) {
      if (nb.zone === zone.key) continue;
      const p = placed[nb.nid];
      if (p) ys.push(p.y);
    }
    if (ys.length) tgtY.set(nid, avg(ys));
  }

  // ── Group into columns ──
  const colBuckets = makeBuckets(zone.nodeIds, cols, nodeCol);

  // ── Sort: by targetY first (for alignment), slot as tiebreaker ──
  for (const col of colBuckets) {
    col.sort((a, b) => {
      const ta = tgtY.get(a), tb = tgtY.get(b);
      // Both have targets → sort by target Y (key for alignment)
      if (ta !== undefined && tb !== undefined) return ta - tb;
      // Connected nodes with targets go first
      if (ta !== undefined) return -1;
      if (tb !== undefined) return 1;
      // Fallback: barycenter-optimized slot order
      return (slot.get(a) ?? 999) - (slot.get(b) ?? 999);
    });
  }

  // ── Place with Y-alignment ──
  const rel: Record<string, { x: number; y: number }> = {};
  let maxY = 0;

  // Phase A: place connected nodes with targetY alignment
  for (let c = 0; c < cols; c++) {
    const x = PAD + c * (NODE_W + GAP_X);
    let curY = HEADER + PAD;

    for (const nid of colBuckets[c]) {
      if (!adj.has(nid)) continue; // skip unconnected for now
      const target = tgtY.get(nid);
      const y = target !== undefined ? Math.max(curY, target) : curY;
      rel[nid] = { x, y };
      curY = y + NODE_H + GAP_Y;
      maxY = Math.max(maxY, y + NODE_H);
    }
  }

  // Phase B: place unconnected nodes — align with adjacent column rows
  for (let c = 0; c < cols; c++) {
    const x = PAD + c * (NODE_W + GAP_X);

    // Get existing Y positions from this column (connected nodes)
    const thisColYs = colBuckets[c]
      .filter(nid => rel[nid])
      .map(nid => rel[nid].y);

    // Get Y positions from adjacent column for row alignment
    const otherC = c === 0 ? Math.min(1, cols - 1) : 0;
    const otherYs = otherC !== c
      ? colBuckets[otherC].filter(nid => rel[nid]).map(nid => rel[nid].y)
      : [];

    // Start after last connected node in this column
    let curY = thisColYs.length
      ? Math.max(...thisColYs) + NODE_H + GAP_Y
      : HEADER + PAD;

    let otherIdx = 0;
    for (const nid of colBuckets[c]) {
      if (adj.has(nid)) continue; // already placed

      // Try to align with an adjacent column row
      while (otherIdx < otherYs.length && otherYs[otherIdx] < curY - GAP_Y) otherIdx++;
      const alignTarget = otherIdx < otherYs.length ? otherYs[otherIdx] : undefined;

      let y = curY;
      if (alignTarget !== undefined && alignTarget >= curY && alignTarget - curY < NODE_H + GAP_Y * 2) {
        // Snap to adjacent column row if close enough
        y = alignTarget;
        otherIdx++;
      }

      rel[nid] = { x, y };
      curY = y + NODE_H + GAP_Y;
      maxY = Math.max(maxY, y + NODE_H);
    }
  }

  // ── Zone size ──
  const w = Math.max(MIN_W, cols * NODE_W + Math.max(0, cols - 1) * GAP_X + 2 * PAD);
  const h = Math.max(MIN_H, maxY + PAD);

  return { rel, w, h };
}

// ══════════════════════════════════════════════════════════════════════
// Post-refinement: nudge first-zone nodes for better alignment
// ══════════════════════════════════════════════════════════════════════
function refineSameRowAlignment(
  topZones: ZoneInfo[],
  adj: Map<string, { nid: string; zone: string }[]>,
  nPos: Record<string, { x: number; y: number }>,
  zPos: Record<string, { x: number; y: number }>,
  zSiz: Record<string, { width: number; height: number }>,
): void {
  if (topZones.length < 2) return;

  // For the first (leftmost) zone: nodes had no left neighbors during placement
  // Now that right neighbors are placed, adjust Y to improve alignment
  const firstZone = topZones[0];
  const firstZonePos = zPos[firstZone.id];
  if (!firstZonePos) return;

  // Collect nodes that need adjustment: those in the first zone with right neighbors
  const adjustable: { nid: string; currentY: number; targetY: number }[] = [];

  for (const nid of firstZone.nodeIds) {
    const nbs = adj.get(nid) || [];
    const rightYs: number[] = [];
    for (const nb of nbs) {
      if (nb.zone === firstZone.key) continue;
      const p = nPos[nb.nid];
      if (p) rightYs.push(p.y);
    }
    if (rightYs.length && nPos[nid]) {
      adjustable.push({
        nid,
        currentY: nPos[nid].y,
        targetY: avg(rightYs),
      });
    }
  }

  if (!adjustable.length) return;

  // Sort by target Y to determine optimal order
  adjustable.sort((a, b) => a.targetY - b.targetY);

  // Check if reordering improves alignment
  const currentOrder = adjustable.map(a => a.currentY);
  const isAlreadyOrdered = currentOrder.every((y, i) => i === 0 || y >= currentOrder[i - 1]);

  if (!isAlreadyOrdered) return; // Don't adjust if current order is already disrupted

  // Compute new Y positions: try to match target Y while maintaining min gap
  let curY = HEADER + PAD; // relative to zone top
  const newPositions: { nid: string; y: number }[] = [];

  for (const item of adjustable) {
    const y = Math.max(curY, item.targetY);
    newPositions.push({ nid: item.nid, y });
    curY = y + NODE_H + GAP_Y;
  }

  // Check if new positions are better (lower total Y-distance to targets)
  const oldDist = adjustable.reduce(
    (sum, a) => sum + Math.abs(a.currentY - a.targetY), 0);
  const newDist = newPositions.reduce(
    (sum, np, i) => sum + Math.abs(np.y - adjustable[i].targetY), 0);

  if (newDist >= oldDist) return; // No improvement

  // Apply adjustments
  for (const np of newPositions) {
    nPos[np.nid] = { x: nPos[np.nid].x, y: np.y };
  }

  // Also adjust non-connected nodes in the first zone that follow
  const adjustedIds = new Set(adjustable.map(a => a.nid));
  const unadjusted = firstZone.nodeIds.filter(nid => !adjustedIds.has(nid) && nPos[nid]);

  if (unadjusted.length && newPositions.length) {
    const lastAdjustedY = Math.max(...newPositions.map(np => np.y));
    let nextY = lastAdjustedY + NODE_H + GAP_Y;

    // Re-sort unadjusted by their current column and Y
    unadjusted.sort((a, b) => {
      const pa = nPos[a], pb = nPos[b];
      if (pa.x !== pb.x) return pa.x - pb.x;
      return pa.y - pb.y;
    });

    // Group by column
    const colGroups = new Map<number, string[]>();
    for (const nid of unadjusted) {
      const x = nPos[nid].x;
      if (!colGroups.has(x)) colGroups.set(x, []);
      colGroups.get(x)!.push(nid);
    }

    for (const [_x, nids] of colGroups) {
      let cy = nextY;
      for (const nid of nids) {
        // Only push down if needed (don't pull up)
        if (nPos[nid].y < cy) {
          nPos[nid] = { x: nPos[nid].x, y: cy };
        }
        cy = nPos[nid].y + NODE_H + GAP_Y;
      }
    }
  }

  // Update zone height if nodes moved down
  const allYs = firstZone.nodeIds
    .filter(nid => nPos[nid])
    .map(nid => nPos[nid].y + NODE_H);
  if (allYs.length) {
    const newH = Math.max(zSiz[firstZone.id].height, Math.max(...allYs) + PAD);
    zSiz[firstZone.id] = { ...zSiz[firstZone.id], height: newH };
  }
}

// ══════════════════════════════════════════════════════════════════════
// Utilities
// ══════════════════════════════════════════════════════════════════════
function pushAdj(
  map: Map<string, { nid: string; zone: string }[]>,
  from: string, to: string, toZone: string,
): void {
  if (!map.has(from)) map.set(from, []);
  map.get(from)!.push({ nid: to, zone: toZone });
}

function avg(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function makeBuckets(
  nodeIds: string[],
  cols: number,
  nodeCol: Map<string, number>,
): string[][] {
  const buckets: string[][] = Array.from({ length: cols }, () => []);
  for (const nid of nodeIds) buckets[nodeCol.get(nid) || 0].push(nid);
  return buckets;
}
