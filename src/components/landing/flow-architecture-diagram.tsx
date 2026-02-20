'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FlowLayerNode from './flow-layer-node';
import FlowServiceNode from './flow-service-node';
import { HERO_FLOW } from '@/data/ui/flow-presets';

const nodeTypes = {
  layer: FlowLayerNode,
  service: FlowServiceNode,
};

const LAYER_IDS = new Set(['nextjs', 'backend']);

const HIGHLIGHT_PATHS = [
  ['github', 'nextjs', 'backend', 'supabase'],
  ['github', 'nextjs', 'backend', 'naver-api'],
  ['github', 'nextjs', 'backend', 'cloud-run'],
  ['github', 'nextjs', 'vercel'],
  ['github', 'nextjs', 'ga4'],
  ['github', 'nextjs', 'backend', 'openai'],
  ['github', 'nextjs', 'backend', 'google-gemini'],
  ['github', 'nextjs', 'backend', 'aladin'],
  ['github', 'nextjs', 'kakao-login'],
];

function buildNodes(highlightedNodeIds: Set<string>): Node[] {
  return HERO_FLOW.nodes.map((n) => {
    const isLayer = LAYER_IDS.has(n.id);
    return {
      id: n.id,
      type: isLayer ? 'layer' : 'service',
      position: { x: n.x, y: n.y },
      data: isLayer
        ? {
            label: n.label,
            emoji: n.emoji,
            iconSlug: n.iconSlug,
            layer: n.id === 'nextjs' ? 'frontend' : n.id === 'backend' ? 'backend' : 'source',
            highlighted: highlightedNodeIds.has(n.id),
          }
        : {
            label: n.label,
            category: n.category,
            emoji: n.emoji,
            iconSlug: n.iconSlug,
            status: n.status,
            envConfigured: n.envVars.configured,
            envTotal: n.envVars.total,
            highlighted: highlightedNodeIds.has(n.id),
          },
      draggable: false,
      selectable: false,
    };
  });
}

function buildEdges(highlightedNodeIds: Set<string>): Edge[] {
  return HERO_FLOW.edges.map((e, i) => {
    const isHighlighted = highlightedNodeIds.has(e.source) && highlightedNodeIds.has(e.target);
    return {
      id: `e-${i}`,
      source: e.source,
      target: e.target,
      type: 'smoothstep',
      animated: isHighlighted,
      label: e.label,
      labelStyle: {
        fontSize: 10,
        fontWeight: 500,
        fill: '#888',
      },
      labelBgStyle: {
        fill: 'var(--flow-label-bg, #f1f5f3)',
        fillOpacity: 1,
      },
      labelBgPadding: [4, 2] as [number, number],
      style: {
        stroke: isHighlighted ? 'hsl(220,60%,35%)' : 'var(--flow-edge-color, #c8cdd6)',
        strokeWidth: isHighlighted ? 2.5 : 1.5,
        opacity: highlightedNodeIds.size > 0 && !isHighlighted ? 0.3 : 1,
      },
    };
  });
}

export function FlowArchitectureDiagram() {
  const [highlightedPath, setHighlightedPath] = useState<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const highlightedNodeIds = useMemo(() => {
    const path = HIGHLIGHT_PATHS[highlightedPath];
    return path ? new Set(path) : new Set<string>();
  }, [highlightedPath]);

  const currentNodes = useMemo(() => buildNodes(highlightedNodeIds), [highlightedNodeIds]);
  const currentEdges = useMemo(() => buildEdges(highlightedNodeIds), [highlightedNodeIds]);

  const [nodes, setNodes, onNodesChange] = useNodesState(currentNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentEdges);

  useEffect(() => {
    setNodes(currentNodes);
    setEdges(currentEdges);
  }, [currentNodes, currentEdges, setNodes, setEdges]);

  useEffect(() => {
    if (isHovering) return;
    intervalRef.current = setInterval(() => {
      setHighlightedPath((prev) => (prev + 1) % HIGHLIGHT_PATHS.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovering]);

  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    setIsHovering(true);
    const pathIdx = HIGHLIGHT_PATHS.findIndex((p) => p.includes(node.id));
    if (pathIdx >= 0) setHighlightedPath(pathIdx);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  return (
    <div className="w-full h-full overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
}
