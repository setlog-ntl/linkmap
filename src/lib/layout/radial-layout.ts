import type { Node } from '@xyflow/react';
import type { ServiceCategory, ViewGroup } from '@/types';
import { categoryToViewGroup, VIEW_GROUP_ORDER } from '@/lib/layout/view-group';

const CENTER_X = 600;
const CENTER_Y = 400;
const PROJECT_NODE_ID = 'project-center';
const INNER_RADIUS = 220;
const OUTER_RADIUS = 380;
const NODE_WIDTH = 160;
const NODE_HEIGHT = 64;

const SECTOR_START_ANGLES = VIEW_GROUP_ORDER.reduce<Record<ViewGroup, number>>((acc, group, i) => {
  acc[group] = -90 + i * 72;
  return acc;
}, {} as Record<ViewGroup, number>);

const SECTOR_SPAN = 72;
const SECTOR_PADDING = 8;

interface RadialLayoutInput {
  serviceNodes: Node[];
  getCategory: (nodeId: string) => ServiceCategory;
  projectName: string;
  projectIconUrl?: string | null;
}

export interface RadialLayoutResult { nodes: Node[]; }

function degToRad(deg: number): number { return (deg * Math.PI) / 180; }

export function computeRadialLayout(input: RadialLayoutInput): RadialLayoutResult {
  const { serviceNodes, getCategory, projectName, projectIconUrl } = input;
  const resultNodes: Node[] = [];

  resultNodes.push({
    id: PROJECT_NODE_ID, type: 'project',
    position: { x: CENTER_X - 100, y: CENTER_Y - 40 },
    data: { label: projectName, iconUrl: projectIconUrl ?? null },
  });

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
      resultNodes.push({ ...node, position: { x, y } });
    });
  }

  return { nodes: resultNodes };
}

export { PROJECT_NODE_ID };
