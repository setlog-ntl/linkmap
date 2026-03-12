import type { Node } from '@xyflow/react';
import type { ServiceCategory, ViewGroup } from '@/types';
import { categoryToViewGroup, VIEW_GROUP_ORDER } from '@/lib/layout/view-group';

const CENTER_X = 600;
const CENTER_Y = 400;
const PROJECT_NODE_ID = 'project-center';
const NODE_WIDTH = 150;
const NODE_HEIGHT = 120;
const HUB_WIDTH = 160;
const HUB_HEIGHT = 130;

/** Sector-based layout constants */
const SECTOR_START_ANGLES = VIEW_GROUP_ORDER.reduce<Record<ViewGroup, number>>((acc, group, i) => {
  acc[group] = -90 + i * 72;
  return acc;
}, {} as Record<ViewGroup, number>);
const SECTOR_SPAN = 72;
const SECTOR_PADDING = 8;

/** Adaptive radius based on node count */
function getRadii(totalNodes: number): { inner: number; outer: number } {
  if (totalNodes <= 3) return { inner: 180, outer: 180 };
  if (totalNodes <= 6) return { inner: 220, outer: 220 };
  if (totalNodes <= 10) return { inner: 240, outer: 380 };
  return { inner: 260, outer: 420 };
}

interface RadialLayoutInput {
  serviceNodes: Node[];
  getCategory: (nodeId: string) => ServiceCategory;
  projectName: string;
  projectIconUrl?: string | null;
}

export interface RadialLayoutResult { nodes: Node[]; }

function degToRad(deg: number): number { return (deg * Math.PI) / 180; }

/**
 * Determine the best handle direction based on the angle from center to node.
 * Returns the handle id for source (hub) and target (service).
 */
export function getHandleFromAngle(angleDeg: number): { sourceHandle: string; targetHandle: string } {
  // Normalize to 0-360
  const a = ((angleDeg % 360) + 360) % 360;
  // Source handle = direction FROM hub TO node
  // Target handle = direction FROM node TO hub (opposite)
  if (a >= 315 || a < 45) {
    return { sourceHandle: 'right', targetHandle: 'left' };
  } else if (a >= 45 && a < 135) {
    return { sourceHandle: 'bottom', targetHandle: 'top' };
  } else if (a >= 135 && a < 225) {
    return { sourceHandle: 'left', targetHandle: 'right' };
  } else {
    return { sourceHandle: 'top', targetHandle: 'bottom' };
  }
}

export function computeRadialLayout(input: RadialLayoutInput): RadialLayoutResult {
  const { serviceNodes, getCategory, projectName, projectIconUrl } = input;
  const resultNodes: Node[] = [];
  const totalNodes = serviceNodes.length;
  const { inner: INNER_RADIUS, outer: OUTER_RADIUS } = getRadii(totalNodes);

  resultNodes.push({
    id: PROJECT_NODE_ID, type: 'project',
    position: { x: CENTER_X - HUB_WIDTH / 2, y: CENTER_Y - HUB_HEIGHT / 2 },
    data: { label: projectName, iconUrl: projectIconUrl ?? null },
  });

  // For few nodes (≤6), use even circular distribution instead of sector-based
  if (totalNodes <= 6 && totalNodes > 0) {
    const angleStep = 360 / totalNodes;
    serviceNodes.forEach((node, i) => {
      const angle = -90 + i * angleStep; // Start from top
      const x = CENTER_X + INNER_RADIUS * Math.cos(degToRad(angle)) - NODE_WIDTH / 2;
      const y = CENTER_Y + INNER_RADIUS * Math.sin(degToRad(angle)) - NODE_HEIGHT / 2;
      const handles = getHandleFromAngle(angle);
      resultNodes.push({
        ...node,
        position: { x, y },
        data: { ...(node.data as Record<string, unknown>), _angleDeg: angle, ...handles },
      });
    });
    return { nodes: resultNodes };
  }

  // Sector-based layout for 7+ nodes
  const groups = new Map<ViewGroup, Node[]>();
  for (const g of VIEW_GROUP_ORDER) groups.set(g, []);
  for (const node of serviceNodes) {
    const cat = (node.data as Record<string, unknown>).category as ServiceCategory;
    const group = categoryToViewGroup(cat);
    groups.get(group)!.push(node);
  }

  for (const group of VIEW_GROUP_ORDER) {
    const nodes = groups.get(group)!;
    if (nodes.length === 0) continue;
    const startAngle = SECTOR_START_ANGLES[group] + SECTOR_PADDING;
    const endAngle = SECTOR_START_ANGLES[group] + SECTOR_SPAN - SECTOR_PADDING;
    const angleRange = endAngle - startAngle;

    nodes.forEach((node, i) => {
      const angleStep = nodes.length === 1 ? 0 : angleRange / (nodes.length - 1);
      const angle = nodes.length === 1 ? startAngle + angleRange / 2 : startAngle + i * angleStep;
      const radius = nodes.length <= 3 ? INNER_RADIUS : i % 2 === 0 ? INNER_RADIUS : OUTER_RADIUS;
      const x = CENTER_X + radius * Math.cos(degToRad(angle)) - NODE_WIDTH / 2;
      const y = CENTER_Y + radius * Math.sin(degToRad(angle)) - NODE_HEIGHT / 2;
      const handles = getHandleFromAngle(angle);
      resultNodes.push({
        ...node,
        position: { x, y },
        data: { ...(node.data as Record<string, unknown>), _angleDeg: angle, ...handles },
      });
    });
  }

  return { nodes: resultNodes };
}

export { PROJECT_NODE_ID };
