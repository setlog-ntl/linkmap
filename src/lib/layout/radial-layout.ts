import type { Node } from '@xyflow/react';

const CENTER_X = 600;
const CENTER_Y = 400;
const PROJECT_NODE_ID = 'project-center';
const NODE_WIDTH = 160;
const NODE_HEIGHT = 72;
const HUB_WIDTH = 200;
const HUB_HEIGHT = 170;

/** Adaptive radius based on node count — compact nodes allow tighter radii */
function getRadii(totalNodes: number): { inner: number; outer: number } {
  if (totalNodes <= 3) return { inner: 200, outer: 200 };
  if (totalNodes <= 6) return { inner: 240, outer: 240 };
  if (totalNodes <= 10) return { inner: 260, outer: 380 };
  return { inner: 280, outer: 420 };
}

interface RadialLayoutInput {
  serviceNodes: Node[];
  getStatus: (nodeId: string) => string;
  projectName: string;
  projectIconUrl?: string | null;
}

export interface RadialLayoutResult { nodes: Node[]; }

function degToRad(deg: number): number { return (deg * Math.PI) / 180; }

/**
 * 8-direction hub source handle for project node (hexagon boundary).
 * Maps angle to one of 8 handles positioned on the rounded hexagon edge.
 */
export function getHubSourceHandle(angleDeg: number): string {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a >= 337.5 || a < 22.5) return 'h-right';
  if (a < 67.5) return 'h-br';
  if (a < 112.5) return 'h-bottom';
  if (a < 157.5) return 'h-bl';
  if (a < 202.5) return 'h-left';
  if (a < 247.5) return 'h-tl';
  if (a < 292.5) return 'h-top';
  return 'h-tr';
}

/**
 * 4-direction handle for service nodes.
 * sourceHandle = direction on source service node (for S2S edges).
 * targetHandle = which side of target node faces the source.
 */
export function getHandleFromAngle(angleDeg: number): { sourceHandle: string; targetHandle: string } {
  const a = ((angleDeg % 360) + 360) % 360;
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

/**
 * Get target handle on service node for hub→service edges (4 directions).
 */
export function getTargetHandleFromAngle(angleDeg: number): string {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a >= 315 || a < 45) return 'left';
  if (a < 135) return 'top';
  if (a < 225) return 'right';
  return 'bottom';
}

/**
 * Sort nodes by status zone for directional consistency:
 * top(connected) → right(in_progress half) → bottom(error+not_started) → left(in_progress half)
 * This ensures the health ring segments align with node positions.
 */
function sortByStatusZone(nodes: Node[], getStatus: (id: string) => string): Node[] {
  const connected: Node[] = [];
  const inProgress: Node[] = [];
  const bottom: Node[] = []; // error + not_started

  for (const node of nodes) {
    const s = getStatus(node.id);
    if (s === 'connected') connected.push(node);
    else if (s === 'in_progress') inProgress.push(node);
    else bottom.push(node);
  }

  // Split in_progress symmetrically: first half → right side, second half → left side (reversed)
  const ipRight = inProgress.slice(0, Math.ceil(inProgress.length / 2));
  const ipLeft = inProgress.slice(Math.ceil(inProgress.length / 2)).reverse();

  // Clockwise from top: connected → ipRight → bottom → ipLeft
  return [...connected, ...ipRight, ...bottom, ...ipLeft];
}

export function computeRadialLayout(input: RadialLayoutInput): RadialLayoutResult {
  const { serviceNodes, getStatus, projectName, projectIconUrl } = input;
  const resultNodes: Node[] = [];
  const totalNodes = serviceNodes.length;
  const { inner: INNER_RADIUS, outer: OUTER_RADIUS } = getRadii(totalNodes);

  resultNodes.push({
    id: PROJECT_NODE_ID, type: 'project',
    position: { x: CENTER_X - HUB_WIDTH / 2, y: CENTER_Y - HUB_HEIGHT / 2 },
    data: { label: projectName, iconUrl: projectIconUrl ?? null },
  });

  if (totalNodes === 0) return { nodes: resultNodes };

  // Sort by status zone: connected(top) → in_progress(sides) → error+not_started(bottom)
  const orderedNodes = sortByStatusZone(serviceNodes, getStatus);
  const angleStep = 360 / totalNodes;

  orderedNodes.forEach((node, i) => {
    const angle = -90 + i * angleStep; // Start from top
    const radius = totalNodes <= 6
      ? INNER_RADIUS
      : (i % 2 === 0 ? INNER_RADIUS : OUTER_RADIUS);
    const x = CENTER_X + radius * Math.cos(degToRad(angle)) - NODE_WIDTH / 2;
    const y = CENTER_Y + radius * Math.sin(degToRad(angle)) - NODE_HEIGHT / 2;
    const handles = getHandleFromAngle(angle);
    resultNodes.push({
      ...node,
      position: { x, y },
      data: { ...(node.data as Record<string, unknown>), _angleDeg: angle, ...handles },
    });
  });

  return { nodes: resultNodes };
}

export { PROJECT_NODE_ID };
