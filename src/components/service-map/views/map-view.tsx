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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Maximize2, Download } from 'lucide-react';
import ServiceNode from '@/components/service-map/service-node';
import ProjectNode from '@/components/service-map/project-node';
import RadialEdge from '@/components/service-map/radial-edge';
import { useRadialMapNodes } from '@/components/service-map/hooks/useRadialMapNodes';
import { useLocaleStore } from '@/stores/locale-store';
import { useServiceDetailStore } from '@/stores/service-detail-store';
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
}

function MapViewInner({ data, projectId }: MapViewProps) {
  const { locale } = useLocaleStore();
  const { fitView } = useReactFlow();
  const openSheet = useServiceDetailStore((s) => s.openSheet);
  const [searchQuery, setSearchQuery] = useState('');

  const { nodes: layoutNodes, edges: layoutEdges } = useRadialMapNodes({
    services: data.services,
    userConnections: data.userConnections,
    projectName: data.projectName,
    searchQuery,
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
    if (node.type === 'project') return;
    const svc = data.services.find((s) => s.id === node.id);
    if (!svc) return;
    const serviceNames: Record<string, string> = {};
    for (const s of data.services) serviceNames[s.service_id] = s.service?.name || 'Unknown';
    const deps = data.dependencies.filter((d) => d.service_id === svc.service_id);
    openSheet({ service: svc, dependencies: deps, serviceNames, projectId, envVars: data.envVars });
  }, [data, projectId, openSheet]);

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
      a.download = `${data.projectName}-radial-map.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = url;
  }, [data.projectName]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={t(locale, 'serviceMap.actions.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => fitView({ padding: 0.3 })} title={t(locale, 'serviceMap.actions.fitView')}>
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-muted-foreground" onClick={handleExportPng}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          PNG
        </Button>
      </div>

      <div className="h-[calc(100vh-20rem)] min-h-[400px] max-h-[800px] rounded-2xl border bg-card/40 dark:bg-zinc-900/30 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <svg>
            <defs>
              {['connected', 'in_progress', 'error', 'not_started', 'default'].map((status) => {
                const colors: Record<string, string> = {
                  connected: '#22c55e', in_progress: '#f59e0b', error: '#ef4444', not_started: '#9ca3af', default: '#9ca3af',
                };
                return (
                  <marker key={status} id={`radial-arrow-${status}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={colors[status]} />
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
  return <MapViewInner {...props} />;
}
