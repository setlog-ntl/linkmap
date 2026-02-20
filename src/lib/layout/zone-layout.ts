import type { Node } from '@xyflow/react';
import type { ServiceDomain } from '@/types';
import { domainLabels, domainIcons } from '@/lib/constants/service-filters';

/** Domain order for 4x2 grid layout */
const DOMAIN_ORDER: ServiceDomain[] = [
  'infrastructure', 'backend', 'devtools', 'communication',
  'business', 'ai_ml', 'observability', 'integration',
];

/** Subtle background colors per domain (6% opacity feel via Tailwind) */
const ZONE_COLORS: Record<ServiceDomain, string> = {
  infrastructure: 'rgba(59, 130, 246, 0.05)',   // blue
  backend: 'rgba(139, 92, 246, 0.05)',           // violet
  devtools: 'rgba(234, 179, 8, 0.05)',           // yellow
  communication: 'rgba(6, 182, 212, 0.05)',      // cyan
  business: 'rgba(249, 115, 22, 0.05)',          // orange
  ai_ml: 'rgba(99, 102, 241, 0.05)',             // indigo
  observability: 'rgba(236, 72, 153, 0.05)',     // pink
  integration: 'rgba(34, 197, 94, 0.05)',        // green
};

const GRID_COLS = 4;
const ZONE_GAP = 32;
const ZONE_PADDING = 24;
const ZONE_HEADER_HEIGHT = 44;
const NODE_WIDTH = 160;
const NODE_HEIGHT = 48;
const NODE_GAP_X = 16;
const NODE_GAP_Y = 12;
const INNER_COLS = 2;
const MIN_ZONE_WIDTH = 2 * NODE_WIDTH + NODE_GAP_X + 2 * ZONE_PADDING;
const MIN_ZONE_HEIGHT = ZONE_HEADER_HEIGHT + NODE_HEIGHT + 2 * ZONE_PADDING;

interface ZoneInfo {
  domain: ServiceDomain;
  serviceNodeIds: string[];
}

export interface ZoneLayoutResult {
  nodes: Node[];
}

/**
 * Two-pass zone grid layout:
 * Pass 1: Compute zone sizes from child count
 * Pass 2: Place service nodes inside each zone using local grid
 */
export function computeZoneLayout(
  serviceNodes: Node[],
  getDomain: (nodeId: string) => ServiceDomain | null,
): ZoneLayoutResult {
  // Group service nodes by domain
  const zones: ZoneInfo[] = DOMAIN_ORDER.map((domain) => ({
    domain,
    serviceNodeIds: [],
  }));
  const domainIndex = new Map(DOMAIN_ORDER.map((d, i) => [d, i]));

  for (const node of serviceNodes) {
    const domain = getDomain(node.id) ?? 'integration';
    const idx = domainIndex.get(domain) ?? 7; // fallback to integration
    zones[idx].serviceNodeIds.push(node.id);
  }

  // Pass 1: Compute each zone's size
  const zoneSizes: { w: number; h: number }[] = zones.map((z) => {
    const count = z.serviceNodeIds.length;
    const rows = Math.max(1, Math.ceil(count / INNER_COLS));
    const cols = Math.min(count, INNER_COLS);
    const w = Math.max(MIN_ZONE_WIDTH, cols * NODE_WIDTH + (cols - 1) * NODE_GAP_X + 2 * ZONE_PADDING);
    const h = Math.max(MIN_ZONE_HEIGHT, ZONE_HEADER_HEIGHT + rows * NODE_HEIGHT + (rows - 1) * NODE_GAP_Y + 2 * ZONE_PADDING);
    return { w, h };
  });

  // Compute row heights (max of each row's zones)
  const row0Height = Math.max(...zoneSizes.slice(0, GRID_COLS).map((s) => s.h));
  const row1Height = Math.max(...zoneSizes.slice(GRID_COLS).map((s) => s.h));

  // Compute column widths (max of each column across rows)
  const colWidths: number[] = [];
  for (let col = 0; col < GRID_COLS; col++) {
    colWidths.push(Math.max(zoneSizes[col].w, zoneSizes[col + GRID_COLS]?.w ?? 0));
  }

  // Compute zone positions
  const zonePositions: { x: number; y: number }[] = [];
  for (let i = 0; i < zones.length; i++) {
    const row = Math.floor(i / GRID_COLS);
    const col = i % GRID_COLS;
    const x = colWidths.slice(0, col).reduce((a, b) => a + b, 0) + col * ZONE_GAP;
    const y = (row === 0 ? 0 : row0Height + ZONE_GAP);
    zonePositions.push({ x, y });
  }

  // Build output nodes
  const resultNodes: Node[] = [];
  const nodeMap = new Map(serviceNodes.map((n) => [n.id, n]));

  for (let i = 0; i < zones.length; i++) {
    const zone = zones[i];
    const pos = zonePositions[i];
    const size = { w: colWidths[i % GRID_COLS], h: i < GRID_COLS ? row0Height : row1Height };

    // Zone background node
    const zoneNodeId = `zone-${zone.domain}`;
    resultNodes.push({
      id: zoneNodeId,
      type: 'zone',
      position: { x: pos.x, y: pos.y },
      data: {
        domain: zone.domain,
        label: domainLabels[zone.domain],
        emoji: domainIcons[zone.domain],
        count: zone.serviceNodeIds.length,
      },
      style: {
        width: size.w,
        height: size.h,
        backgroundColor: ZONE_COLORS[zone.domain],
      },
    });

    // Place service nodes inside zone using local grid
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
  }

  return { nodes: resultNodes };
}

export { DOMAIN_ORDER, NODE_WIDTH, NODE_HEIGHT };
