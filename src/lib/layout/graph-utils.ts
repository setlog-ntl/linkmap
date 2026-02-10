import type { Edge } from '@xyflow/react';

/**
 * 주어진 노드의 1-hop 이웃 노드 ID Set을 반환한다.
 * 방향성 무시 (source/target 모두 포함).
 */
export function getNeighborhood(nodeId: string, edges: Edge[]): Set<string> {
  const neighbors = new Set<string>();
  neighbors.add(nodeId);

  for (const edge of edges) {
    if (edge.source === nodeId) {
      neighbors.add(edge.target);
    } else if (edge.target === nodeId) {
      neighbors.add(edge.source);
    }
  }

  return neighbors;
}

/**
 * 포커스 모드에서 노드가 하이라이트 되어야 하는지 판단.
 * focusedNodeId가 null이면 모든 노드가 하이라이트 됨.
 */
export function isNodeHighlighted(
  nodeId: string,
  focusedNodeId: string | null,
  neighborSet: Set<string> | null
): boolean {
  if (!focusedNodeId || !neighborSet) return true;
  return neighborSet.has(nodeId);
}

/**
 * 포커스 모드에서 엣지가 하이라이트 되어야 하는지 판단.
 */
export function isEdgeHighlighted(
  edge: Edge,
  focusedNodeId: string | null,
  neighborSet: Set<string> | null
): boolean {
  if (!focusedNodeId || !neighborSet) return true;
  return edge.source === focusedNodeId || edge.target === focusedNodeId;
}
