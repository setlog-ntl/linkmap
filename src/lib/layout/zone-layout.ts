import type { Node } from '@xyflow/react';
import type { ServiceDomain } from '@/types';

/** Simplified 3-zone layout: FRONTEND / BACKEND / DEVTOOLS */
export type ZoneKey = 'frontend' | 'backend' | 'devtools';

const ZONE_ORDER: ZoneKey[] = ['frontend', 'backend', 'devtools'];

const ZONE_LABELS: Record<ZoneKey, string> = {
  frontend: 'FRONTEND',
  backend: 'BACKEND',
  devtools: 'DEVTOOLS',
};

const ZONE_EMOJIS: Record<ZoneKey, string> = {
  frontend: '🖥️',
  backend: '⚙️',
  devtools: '🛠️',
};

const ZONE_COLORS: Record<ZoneKey, string> = {
  frontend: 'rgba(59, 130, 246, 0.04)',  // blue
  backend: 'rgba(139, 92, 246, 0.04)',   // violet
  devtools: 'rgba(234, 179, 8, 0.04)',   // yellow
};

/** Map 8 ServiceDomains → 3 zones */
const DOMAIN_TO_ZONE: Record<ServiceDomain, ZoneKey> = {
  infrastructure: 'frontend',
  backend: 'backend',
  devtools: 'devtools',
  communication: 'backend',
  business: 'backend',
  ai_ml: 'backend',
  observability: 'devtools',
  integration: 'backend',
};

const GRID_COLS = 3;
const ZONE_GAP = 32;
const ZONE_PADDING = 24;
const ZONE_HEADER_HEIGHT = 44;
const NODE_WIDTH = 160;
const NODE_HEIGHT = 48;
const NODE_GAP_X = 16;
const NODE_GAP_Y = 12;
const INNER_COLS = 3;
const MIN_ZONE_WIDTH = INNER_COLS * NODE_WIDTH + (INNER_COLS - 1) * NODE_GAP_X + 2 * ZONE_PADDING;
const MIN_ZONE_HEIGHT = ZONE_HEADER_HEIGHT + NODE_HEIGHT + 2 * ZONE_PADDING;

interface ZoneInfo {
  key: ZoneKey;
  serviceNodeIds: string[];
}

export interface ZoneLayoutResult {
  nodes: Node[];
}

export function domainToZone(domain: ServiceDomain | null): ZoneKey {
  if (!domain) return 'backend';
  return DOMAIN_TO_ZONE[domain] ?? 'backend';
}

/**
 * 3-zone horizontal layout:
 * [FRONTEND] [BACKEND] [DEVTOOLS]
 */
export function computeZoneLayout(
  serviceNodes: Node[],
  getDomain: (nodeId: string) => ServiceDomain | null,
): ZoneLayoutResult {
  // Group service nodes into 3 zones
  const zones: ZoneInfo[] = ZONE_ORDER.map((key) => ({ key, serviceNodeIds: [] }));
  const zoneIndex = new Map(ZONE_ORDER.map((k, i) => [k, i]));

  for (const node of serviceNodes) {
    const domain = getDomain(node.id);
    const zone = domainToZone(domain);
    const idx = zoneIndex.get(zone) ?? 1;
    zones[idx].serviceNodeIds.push(node.id);
  }

  // Compute each zone's size
  const zoneSizes = zones.map((z) => {
    const count = z.serviceNodeIds.length;
    const rows = Math.max(1, Math.ceil(count / INNER_COLS));
    const cols = Math.min(count || 1, INNER_COLS);
    const w = Math.max(MIN_ZONE_WIDTH, cols * NODE_WIDTH + (cols - 1) * NODE_GAP_X + 2 * ZONE_PADDING);
    const h = Math.max(MIN_ZONE_HEIGHT, ZONE_HEADER_HEIGHT + rows * NODE_HEIGHT + (rows - 1) * NODE_GAP_Y + 2 * ZONE_PADDING);
    return { w, h };
  });

  // All zones same height (max)
  const maxHeight = Math.max(...zoneSizes.map((s) => s.h));

  // Build output
  const resultNodes: Node[] = [];
  const nodeMap = new Map(serviceNodes.map((n) => [n.id, n]));
  let xOffset = 0;

  for (let i = 0; i < zones.length; i++) {
    const zone = zones[i];
    const size = zoneSizes[i];
    const zoneNodeId = `zone-${zone.key}`;

    resultNodes.push({
      id: zoneNodeId,
      type: 'zone',
      position: { x: xOffset, y: 0 },
      data: {
        domain: zone.key,
        label: ZONE_LABELS[zone.key],
        emoji: ZONE_EMOJIS[zone.key],
        count: zone.serviceNodeIds.length,
      },
      style: {
        width: size.w,
        height: maxHeight,
        backgroundColor: ZONE_COLORS[zone.key],
      },
    });

    // Place service nodes inside zone
    zone.serviceNodeIds.forEach((nodeId, idx) => {
      const original = nodeMap.get(nodeId);
      if (!original) return;
      const localRow = Math.floor(idx / INNER_COLS);
      const localCol = idx % INNER_COLS;
      const localX = ZONE_PADDING + localCol * (NODE_WIDTH + NODE_GAP_X);
      const localY = ZONE_HEADER_HEIGHT + ZONE_PADDING + localRow * (NODE_HEIGHT + NODE_GAP_Y);

      resultNodes.push({
        ...original,
        position: { x: localX, y: localY },
        parentId: zoneNodeId,
        extent: 'parent' as const,
      });
    });

    xOffset += size.w + ZONE_GAP;
  }

  return { nodes: resultNodes };
}

export { ZONE_ORDER, NODE_WIDTH, NODE_HEIGHT };
