'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Maximize2, Download, X } from 'lucide-react';
import ServiceNode from '@/components/service-map/service-node';
import ProjectNode from '@/components/service-map/project-node';
import RadialEdge from '@/components/service-map/radial-edge';
import { useRadialMapNodes } from '@/components/service-map/hooks/useRadialMapNodes';
import { useLocaleStore } from '@/stores/locale-store';
import { useServiceDetailStore } from '@/stores/service-detail-store';
import { useServiceMapStore } from '@/stores/service-map-store';
import { t } from '@/lib/i18n';
import type { ServiceMapData } from '@/components/service-map/hooks/useServiceMapData';

const nodeTypes = {
  service: ServiceNode,
  project: ProjectNode,
};

const edgeTypes = {
  radial: RadialEdge,
};

interface MapViewProps {
  data: ServiceMapData;
  projectId: string;
  isReadOnly?: boolean;
}

function MapViewInner({ data, projectId, isReadOnly = false }: MapViewProps) {
  const { locale } = useLocaleStore();
  const { fitView } = useReactFlow();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const openSheet = useServiceDetailStore((s) => s.openSheet);
  const focusedNodeId = useServiceMapStore((s) => s.focusedNodeId);
  const setFocusedNodeId = useServiceMapStore((s) => s.setFocusedNodeId);
  const [searchQuery, setSearchQuery] = useState('');

  const { nodes: layoutNodes, edges: layoutEdges } = useRadialMapNodes({
    services: data.services,
    userConnections: data.userConnections,
    projectName: data.projectName,
    searchQuery,
    focusedNodeId,
  });

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges]);

  const onNodesChange = useCallback((changes: NodeChange<Node>[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === 'project') {
      // Click hub: clear focus
      if (focusedNodeId) setFocusedNodeId(null);
      return;
    }

    // Toggle focus on the clicked service node
    setFocusedNodeId(node.id);

    // If in read-only mode, don't open detail sheet
    if (isReadOnly) return;
  }, [focusedNodeId, setFocusedNodeId, isReadOnly]);

  const handleNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (isReadOnly) return;
    if (node.type === 'project') return;
    const svc = data.services.find((s) => s.id === node.id);
    if (!svc) return;
    const serviceNames: Record<string, string> = {};
    for (const s of data.services) serviceNames[s.service_id] = s.service?.name || 'Unknown';
    const deps = data.dependencies.filter((d) => d.service_id === svc.service_id);
    openSheet({ service: svc, dependencies: deps, serviceNames, projectId, envVars: data.envVars });
  }, [data, projectId, openSheet, isReadOnly]);

  const handlePaneClick = useCallback(() => {
    if (focusedNodeId) setFocusedNodeId(null);
  }, [focusedNodeId, setFocusedNodeId]);

  const handleExportPng = useCallback(() => {
    const svgEl = document.querySelector('.react-flow__viewport');
    if (!svgEl) return;
    const canvas = document.createElement('canvas');
    const rect = svgEl.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const img = new Image();
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.download = `${data.projectName}-service-map.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = url;
  }, [data.projectName]);

  // Find focused service info for panel
  const focusedService = focusedNodeId
    ? data.services.find((s) => s.id === focusedNodeId)
    : null;

  return (
    <div className="flex-1 w-full relative min-h-0">
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-background/80 backdrop-blur-md rounded-full border shadow-sm p-1">
        <div className="relative flex-1 w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t(locale, 'serviceMap.actions.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm border-0 bg-transparent focus-visible:ring-0 shadow-none"
          />
        </div>
        <div className="w-px h-5 bg-border/50" />
        {focusedNodeId && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
            onClick={() => setFocusedNodeId(null)}
            title="포커스 해제"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full" onClick={() => { setFocusedNodeId(null); fitView({ padding: 0.3 }); }} title={t(locale, 'serviceMap.actions.fitView')}>
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground rounded-full" onClick={handleExportPng}>
          <Download className="mr-1.5 h-4 w-4" />
          PNG
        </Button>
      </div>

      {/* Focus info panel */}
      {focusedService && (
        <div className="absolute top-4 right-4 z-10 w-64 bg-background/92 backdrop-blur-md border rounded-2xl p-4 shadow-lg animate-node-enter">
          <button
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setFocusedNodeId(null)}
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-lg">{focusedService.service?.icon_url ? '🔗' : '⚙️'}</div>
            <div>
              <div className="text-sm font-bold">{focusedService.service?.name}</div>
              <div className="text-[10px] text-muted-foreground">{focusedService.service?.category}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            더블클릭하여 상세 정보 보기
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="absolute inset-0 z-0 bg-background/50 service-map-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            maskColor={isDark ? 'rgba(15, 29, 47, 0.85)' : undefined}
            style={isDark ? { backgroundColor: 'var(--card)' } : undefined}
          />
          {isDark ? (
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="oklch(0.35 0.02 250)" style={{ opacity: 0.25 }} />
          ) : (
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--border)" style={{ opacity: 0.5 }} />
          )}
          <svg>
            <defs>
              {['connected', 'in_progress', 'error', 'not_started', 'default'].map((status) => {
                const colors: Record<string, string> = {
                  connected: '#22c55e', in_progress: '#f59e0b', error: '#ef4444', not_started: '#9ca3af', default: '#9ca3af',
                };
                return (
                  <marker key={status} id={`radial-arrow-${status}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={colors[status]} opacity="0.7" />
                  </marker>
                );
              })}
            </defs>
          </svg>
        </ReactFlow>
      </div>
    </div>
  );
}

export function MapView(props: MapViewProps) {
  return <MapViewInner {...props} isReadOnly={props.isReadOnly} />;
}
