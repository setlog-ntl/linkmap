import type { Node } from '@xyflow/react';
import type { ServiceDomain } from '@/types';

// ── Zone Configuration ─────────────────────────────────────────

export interface ZoneConfig {
  key: string;
  label: string;
  emoji: string;
  color: string;       // rgba background
  subtitle?: string;
}

export type LayoutPreset = 'horizontal' | 'vertical' | 'grid';

/** Backwards-compatible alias — now any string (custom zones supported) */
export type ZoneKey = string;

/** 3 default zones */
export const DEFAULT_ZONES: ZoneConfig[] = [
  { key: 'frontend', label: 'FRONTEND', emoji: '🖥️', color: 'rgba(59, 130, 246, 0.04)', subtitle: 'UI & Client' },
  { key: 'backend',  label: 'BACKEND',  emoji: '⚙️', color: 'rgba(139, 92, 246, 0.04)', subtitle: 'Server & API' },
  { key: 'devtools', label: 'DEVTOOLS', emoji: '🛠️', color: 'rgba(234, 179, 8, 0.04)',  subtitle: 'Build & Test' },
];

/** Color palette for custom zones */
export const ZONE_COLOR_PALETTE: { name: string; color: string; hex: string }[] = [
  { name: '블루',     color: 'rgba(59, 130, 246, 0.04)',  hex: '#3b82f6' },
  { name: '바이올렛', color: 'rgba(139, 92, 246, 0.04)',  hex: '#8b5cf6' },
  { name: '옐로',     color: 'rgba(234, 179, 8, 0.04)',   hex: '#eab308' },
  { name: '그린',     color: 'rgba(34, 197, 94, 0.04)',   hex: '#22c55e' },
  { name: '레드',     color: 'rgba(239, 68, 68, 0.04)',   hex: '#ef4444' },
  { name: '오렌지',   color: 'rgba(249, 115, 22, 0.04)',  hex: '#f97316' },
  { name: '핑크',     color: 'rgba(236, 72, 153, 0.04)',  hex: '#ec4899' },
  { name: '시안',     color: 'rgba(6, 182, 212, 0.04)',   hex: '#06b6d4' },
];

// ── Domain → Zone mapping ──────────────────────────────────────

const DOMAIN_TO_ZONE: Record<ServiceDomain, string> = {
  infrastructure: 'frontend',
  backend: 'backend',
  devtools: 'devtools',
  communication: 'backend',
  business: 'backend',
  ai_ml: 'backend',
  observability: 'devtools',
  integration: 'backend',
  sns: 'frontend',
};

export function domainToZone(domain: ServiceDomain | string | null, zones?: ZoneConfig[]): string {
  if (!domain) return 'backend';
  // If domain is already a valid zone key (e.g. from pendingOverrides/layerOverrides), return directly
  const activeZones = zones ?? DEFAULT_ZONES;
  if (activeZones.some((z) => z.key === domain)) return domain;
  // Otherwise map ServiceDomain → ZoneKey
  const key = DOMAIN_TO_ZONE[domain as ServiceDomain] ?? 'backend';
  if (activeZones.length > 0 && !activeZones.some((z) => z.key === key)) {
    return activeZones[0].key;
  }
  return key;
}

// ── Layout Constants ───────────────────────────────────────────

const ZONE_GAP = 64;
const ZONE_PADDING = 40;
const ZONE_HEADER_HEIGHT = 44;
const NODE_WIDTH = 180;
const NODE_HEIGHT = 72;
const NODE_GAP_X = 40;
const NODE_GAP_Y = 32;
const INNER_COLS = 3;
const MIN_ZONE_WIDTH = INNER_COLS * NODE_WIDTH + (INNER_COLS - 1) * NODE_GAP_X + 2 * ZONE_PADDING;
const MIN_ZONE_HEIGHT = ZONE_HEADER_HEIGHT + NODE_HEIGHT + 2 * ZONE_PADDING;

// ── Layout Result ──────────────────────────────────────────────

export interface ZoneLayoutResult {
  nodes: Node[];
}

export interface ZoneLayoutOptions {
  zones?: ZoneConfig[];
  preset?: LayoutPreset;
  editMode?: boolean;
  positionOverrides?: Record<string, { x: number; y: number }>;
  sizeOverrides?: Record<string, { width: number; height: number }>;
}

// ── Main layout function ───────────────────────────────────────

export function computeZoneLayout(
  serviceNodes: Node[],
  getDomain: (nodeId: string) => ServiceDomain | null,
  options?: ZoneLayoutOptions,
): ZoneLayoutResult {
  const zones = options?.zones && options.zones.length > 0 ? options.zones : DEFAULT_ZONES;
  const preset = options?.preset ?? 'horizontal';
  const editMode = options?.editMode ?? false;
  const posOverrides = options?.positionOverrides ?? {};
  const sizeOverrides = options?.sizeOverrides ?? {};

  // Group service nodes into zones
  const zoneGroups = zones.map((z) => ({ config: z, serviceNodeIds: [] as string[] }));
  const zoneKeyToIndex = new Map(zones.map((z, i) => [z.key, i]));

  for (const node of serviceNodes) {
    const domain = getDomain(node.id);
    const zoneKey = domainToZone(domain, zones);
    const idx = zoneKeyToIndex.get(zoneKey) ?? 0;
    zoneGroups[idx].serviceNodeIds.push(node.id);
  }

  // Compute auto-fit size per zone
  const autoSizes = zoneGroups.map((zg) => {
    const count = zg.serviceNodeIds.length;
    const rows = Math.max(1, Math.ceil(count / INNER_COLS));
    const cols = Math.min(count || 1, INNER_COLS);
    const w = Math.max(MIN_ZONE_WIDTH, cols * NODE_WIDTH + (cols - 1) * NODE_GAP_X + 2 * ZONE_PADDING);
    const h = Math.max(MIN_ZONE_HEIGHT, ZONE_HEADER_HEIGHT + rows * NODE_HEIGHT + (rows - 1) * NODE_GAP_Y + 2 * ZONE_PADDING);
    return { w, h };
  });

  // Apply size overrides
  const finalSizes = autoSizes.map((auto, i) => {
    const zoneId = `zone-${zoneGroups[i].config.key}`;
    const ov = sizeOverrides[zoneId];
    return ov ? { w: ov.width, h: ov.height } : auto;
  });

  // Compute zone positions based on preset
  const autoPositions = computePresetPositions(finalSizes, preset);

  // Build output
  const resultNodes: Node[] = [];
  const nodeMap = new Map(serviceNodes.map((n) => [n.id, n]));

  for (let i = 0; i < zoneGroups.length; i++) {
    const zg = zoneGroups[i];
    const size = finalSizes[i];
    const zoneNodeId = `zone-${zg.config.key}`;
    const pos = posOverrides[zoneNodeId] ?? autoPositions[i];
    const isCustom = !DEFAULT_ZONES.some((d) => d.key === zg.config.key);

    // Edit mode: boost zone background visibility for clear boundaries
    const editBgColor = editMode
      ? zg.config.color.replace(/[\d.]+\)$/, '0.08)')  // 4% → 8%
      : zg.config.color;

    resultNodes.push({
      id: zoneNodeId,
      type: 'zone',
      position: pos,
      // Edit mode: selectable for NodeResizer, draggable for repositioning,
      // connectable for zone↔zone and zone↔node connections
      // Service nodes have zIndex: 10 so they receive events first
      selectable: editMode,
      draggable: editMode,
      connectable: editMode,
      zIndex: -1,
      data: {
        domain: zg.config.key,
        label: zg.config.label,
        emoji: zg.config.emoji,
        count: zg.serviceNodeIds.length,
        color: zg.config.color,
        subtitle: zg.config.subtitle,
        isCustom,
        editMode,
      },
      style: {
        width: size.w,
        height: size.h,
        backgroundColor: editBgColor,
        // View mode: pointerEvents none so zones don't block service nodes
        // Edit mode: RF wrapper needs events for drag/resize (service nodes at zIndex 10 get priority)
        ...(editMode ? {} : { pointerEvents: 'none' as const }),
      },
    });

    // Place service nodes with absolute coordinates
    zg.serviceNodeIds.forEach((nodeId, idx) => {
      const original = nodeMap.get(nodeId);
      if (!original) return;
      const localRow = Math.floor(idx / INNER_COLS);
      const localCol = idx % INNER_COLS;
      const absX = pos.x + ZONE_PADDING + localCol * (NODE_WIDTH + NODE_GAP_X);
      const absY = pos.y + ZONE_HEADER_HEIGHT + ZONE_PADDING + localRow * (NODE_HEIGHT + NODE_GAP_Y);

      resultNodes.push({
        ...original,
        position: { x: absX, y: absY },
        zIndex: 10,  // Service nodes always above zone backgrounds (-1)
      });
    });
  }

  return { nodes: resultNodes };
}

// ── Preset position calculators ────────────────────────────────

function computePresetPositions(
  sizes: { w: number; h: number }[],
  preset: LayoutPreset,
): { x: number; y: number }[] {
  switch (preset) {
    case 'horizontal': {
      const maxH = Math.max(...sizes.map((s) => s.h));
      let x = 0;
      return sizes.map((s) => {
        const p = { x, y: (maxH - s.h) / 2 };
        x += s.w + ZONE_GAP;
        return p;
      });
    }
    case 'vertical': {
      const maxW = Math.max(...sizes.map((s) => s.w));
      let y = 0;
      return sizes.map((s) => {
        const p = { x: (maxW - s.w) / 2, y };
        y += s.h + ZONE_GAP;
        return p;
      });
    }
    case 'grid': {
      const cols = Math.ceil(Math.sqrt(sizes.length));
      let x = 0;
      let y = 0;
      let rowMaxH = 0;
      let col = 0;
      return sizes.map((s) => {
        if (col >= cols) {
          col = 0;
          x = 0;
          y += rowMaxH + ZONE_GAP;
          rowMaxH = 0;
        }
        const p = { x, y };
        x += s.w + ZONE_GAP;
        rowMaxH = Math.max(rowMaxH, s.h);
        col++;
        return p;
      });
    }
  }
}

// ── Auto-fit: compute optimal size for a zone's services ──────

export function computeAutoFitSize(serviceCount: number): { width: number; height: number } {
  const count = Math.max(0, serviceCount);
  const rows = Math.max(1, Math.ceil(count / INNER_COLS));
  const cols = Math.min(count || 1, INNER_COLS);
  return {
    width: Math.max(MIN_ZONE_WIDTH, cols * NODE_WIDTH + (cols - 1) * NODE_GAP_X + 2 * ZONE_PADDING),
    height: Math.max(MIN_ZONE_HEIGHT, ZONE_HEADER_HEIGHT + rows * NODE_HEIGHT + (rows - 1) * NODE_GAP_Y + 2 * ZONE_PADDING),
  };
}

// ── Exports ────────────────────────────────────────────────────

export { NODE_WIDTH, NODE_HEIGHT, ZONE_PADDING, ZONE_HEADER_HEIGHT };
