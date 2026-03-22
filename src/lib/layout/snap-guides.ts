/**
 * Snap Guide System
 *
 * When dragging nodes/zones in edit mode, detects alignment with other
 * elements and returns guide lines + snapped position.
 */
import type { Node } from '@xyflow/react';

const SNAP_THRESHOLD = 8; // px — how close to snap

export interface GuideLine {
  orientation: 'horizontal' | 'vertical';
  position: number; // x for vertical, y for horizontal
}

export interface SnapResult {
  /** Snapped position (adjusted from raw drag position) */
  x: number;
  y: number;
  /** Active guide lines to render */
  guides: GuideLine[];
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function nodeToRect(node: Node): Rect {
  return {
    x: node.position.x,
    y: node.position.y,
    w: (node.style?.width as number) || 180,
    h: (node.style?.height as number) || 72,
  };
}

/**
 * Given a node being dragged and all other nodes, compute snap guides.
 */
export function computeSnapGuides(
  draggedId: string,
  dragX: number,
  dragY: number,
  dragW: number,
  dragH: number,
  allNodes: Node[],
): SnapResult {
  const guides: GuideLine[] = [];
  let snappedX = dragX;
  let snappedY = dragY;
  let xSnapped = false;
  let ySnapped = false;

  const dragCx = dragX + dragW / 2;
  const dragCy = dragY + dragH / 2;
  const dragRight = dragX + dragW;
  const dragBottom = dragY + dragH;

  for (const node of allNodes) {
    if (node.id === draggedId) continue;

    const r = nodeToRect(node);
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h / 2;
    const right = r.x + r.w;
    const bottom = r.y + r.h;

    // Vertical guides (snap X positions)
    if (!xSnapped) {
      // Left ↔ Left
      if (Math.abs(dragX - r.x) < SNAP_THRESHOLD) {
        snappedX = r.x;
        guides.push({ orientation: 'vertical', position: r.x });
        xSnapped = true;
      }
      // Right ↔ Right
      else if (Math.abs(dragRight - right) < SNAP_THRESHOLD) {
        snappedX = right - dragW;
        guides.push({ orientation: 'vertical', position: right });
        xSnapped = true;
      }
      // Center ↔ Center (X)
      else if (Math.abs(dragCx - cx) < SNAP_THRESHOLD) {
        snappedX = cx - dragW / 2;
        guides.push({ orientation: 'vertical', position: cx });
        xSnapped = true;
      }
      // Left ↔ Right
      else if (Math.abs(dragX - right) < SNAP_THRESHOLD) {
        snappedX = right;
        guides.push({ orientation: 'vertical', position: right });
        xSnapped = true;
      }
      // Right ↔ Left
      else if (Math.abs(dragRight - r.x) < SNAP_THRESHOLD) {
        snappedX = r.x - dragW;
        guides.push({ orientation: 'vertical', position: r.x });
        xSnapped = true;
      }
    }

    // Horizontal guides (snap Y positions)
    if (!ySnapped) {
      // Top ↔ Top
      if (Math.abs(dragY - r.y) < SNAP_THRESHOLD) {
        snappedY = r.y;
        guides.push({ orientation: 'horizontal', position: r.y });
        ySnapped = true;
      }
      // Bottom ↔ Bottom
      else if (Math.abs(dragBottom - bottom) < SNAP_THRESHOLD) {
        snappedY = bottom - dragH;
        guides.push({ orientation: 'horizontal', position: bottom });
        ySnapped = true;
      }
      // Center ↔ Center (Y)
      else if (Math.abs(dragCy - cy) < SNAP_THRESHOLD) {
        snappedY = cy - dragH / 2;
        guides.push({ orientation: 'horizontal', position: cy });
        ySnapped = true;
      }
      // Top ↔ Bottom
      else if (Math.abs(dragY - bottom) < SNAP_THRESHOLD) {
        snappedY = bottom;
        guides.push({ orientation: 'horizontal', position: bottom });
        ySnapped = true;
      }
      // Bottom ↔ Top
      else if (Math.abs(dragBottom - r.y) < SNAP_THRESHOLD) {
        snappedY = r.y - dragH;
        guides.push({ orientation: 'horizontal', position: r.y });
        ySnapped = true;
      }
    }

    if (xSnapped && ySnapped) break;
  }

  return { x: snappedX, y: snappedY, guides };
}
