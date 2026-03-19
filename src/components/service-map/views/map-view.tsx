'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
  type ReactFlowInstance,
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

/** Status-based colors for MiniMap nodes */
const STATUS_MINIMAP_COLORS: Record<string, string> = {
  connected: '#4ade80',
  in_progress: '#facc15',
  error: '#fb923c',
  not_started: '#475569',
};

/** Status filter options (4 statuses only — simplified from 5 ViewGroups + 4 statuses) */
const STATUS_FILTER_OPTIONS = [
  { key: 'connected', label: '연결됨', color: '#4ade80' },
  { key: 'in_progress', label: '진행 중', color: '#facc15' },
  { key: 'error', label: '오류', color: '#fb923c' },
  { key: 'not_started', label: '시작 전', color: '#64748b' },
] as const;

/** Status-based arrow marker colors */
const MARKER_COLORS: Record<string, string> = {
  connected: '#4ade80',
  in_progress: '#facc15',
  error: '#fb923c',
  not_started: '#475569',
  default: '#475569',
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
  const filterStatuses = useServiceMapStore((s) => s.filterStatuses);
  const toggleFilterStatus = useServiceMapStore((s) => s.toggleFilterStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const { nodes: layoutNodes, edges: layoutEdges } = useRadialMapNodes({
    services: data.services,
    userConnections: data.userConnections,
    projectName: data.projectName,
    searchQuery,
    focusedNodeId,
    filterStatuses: filterStatuses.length > 0 ? filterStatuses : undefined,
  });

  const [nodes, setNodes] = useState<Node[]>(layoutNodes);
  const [edges, setEdges] = useState<Edge[]>(layoutEdges);
  const rfInstanceRef = useRef<ReactFlowInstance | null>(null);
  const initialFitDone = useRef(false);

  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges]);

  // Fit view when layout changes (search, focus) — skip initial (handled by onInit)
  useEffect(() => {
    if (!initialFitDone.current) return;
    const timer = setTimeout(() => fitView({ padding: 0.3 }), 50);
    return () => clearTimeout(timer);
  }, [layoutNodes, layoutEdges, fitView]);

  // onInit: called once when React Flow is ready and nodes are measured
  const handleInit = useCallback((instance: ReactFlowInstance) => {
    rfInstanceRef.current = instance;
    setTimeout(() => {
      instance.fitView({ padding: 0.3 });
      initialFitDone.current = true;
    }, 100);
  }, []);

  const onNodesChange = useCallback((changes: NodeChange<Node>[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === 'project') {
      if (focusedNodeId) setFocusedNodeId(null);
      return;
    }
    setFocusedNodeId(node.id);
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

  // Keyboard shortcuts (including Ctrl+Z/Y for undo/redo)
  const { undo, redo, canUndo, canRedo } = useServiceMapStore();
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        if (e.key === 'Escape') {
          (target as HTMLElement).blur();
        }
        return;
      }

      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo()) redo();
        return;
      }

      switch (e.key) {
        case 'Escape':
          if (focusedNodeId) setFocusedNodeId(null);
          break;
        case 'f':
        case '0':
          fitView({ padding: 0.3 });
          break;
        case '/':
          e.preventDefault();
          searchRef.current?.focus();
          break;
        case 'Tab': {
          e.preventDefault();
          const serviceNodes = nodes.filter((n) => n.type === 'service');
          if (serviceNodes.length === 0) break;
          const currentIdx = focusedNodeId ? serviceNodes.findIndex((n) => n.id === focusedNodeId) : -1;
          const nextIdx = e.shiftKey
            ? (currentIdx <= 0 ? serviceNodes.length - 1 : currentIdx - 1)
            : (currentIdx >= serviceNodes.length - 1 ? 0 : currentIdx + 1);
          setFocusedNodeId(serviceNodes[nextIdx].id);
          break;
        }
        case 'Enter':
          if (focusedNodeId && !isReadOnly) {
            const svc = data.services.find((s) => s.id === focusedNodeId);
            if (svc) {
              const serviceNames: Record<string, string> = {};
              for (const s of data.services) serviceNames[s.service_id] = s.service?.name || 'Unknown';
              const deps = data.dependencies.filter((d) => d.service_id === svc.service_id);
              openSheet({ service: svc, dependencies: deps, serviceNames, projectId, envVars: data.envVars });
            }
          }
          break;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedNodeId, setFocusedNodeId, fitView, nodes, data, projectId, openSheet, isReadOnly, undo, redo, canUndo, canRedo]);

  // Find focused service info for panel
  const focusedService = focusedNodeId
    ? data.services.find((s) => s.id === focusedNodeId)
    : null;

  // MiniMap node color: status-based
  const miniMapNodeColor = useCallback((node: Node) => {
    if (node.type === 'project') return '#00d4ff';
    const nodeStatus = (node.data as Record<string, unknown>)?.status as string | undefined;
    return STATUS_MINIMAP_COLORS[nodeStatus ?? 'not_started'] ?? '#475569';
  }, []);

  return (
    <div className="flex-1 w-full relative min-h-0">
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-background/80 backdrop-blur-md rounded-full border shadow-sm p-1">
        <div className="relative flex-1 w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchRef}
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

      {/* Status filter chips — simplified (4 statuses only, no ViewGroup) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
        {STATUS_FILTER_OPTIONS.map((opt) => {
          const isActive = filterStatuses.includes(opt.key);
          return (
            <button
              key={opt.key}
              onClick={() => toggleFilterStatus(opt.key)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all"
              style={{
                borderColor: isActive ? opt.color : 'var(--border)',
                background: isActive ? `${opt.color}18` : 'var(--background)',
                color: isActive ? opt.color : 'var(--muted-foreground)',
                opacity: isActive ? 1 : 0.7,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: opt.color }} />
              {opt.label}
            </button>
          );
        })}
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
      <div className="absolute inset-0 z-0 bg-background/50 service-map-canvas" style={{ width: '100%', height: '100%' }}>
        {/* Ambient glow (dark mode only) */}
        {isDark && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <radialGradient id="mesh-ambient-center" cx="50%" cy="48%" r="40%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#mesh-ambient-center)" />
          </svg>
        )}

        <ReactFlow
          style={{ width: '100%', height: '100%' }}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          onPaneClick={handlePaneClick}
          onInit={handleInit}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            nodeColor={miniMapNodeColor}
            maskColor={isDark ? 'rgba(15, 29, 47, 0.85)' : undefined}
            style={isDark ? { backgroundColor: 'var(--card)' } : undefined}
          />
          {/* PCB dot grid background */}
          {isDark ? (
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="oklch(0.35 0.08 160)" style={{ opacity: 0.25 }} />
          ) : (
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border)" style={{ opacity: 0.45 }} />
          )}

          {/* SVG defs for arrow markers + glow filters */}
          <svg>
            <defs>
              {Object.entries(MARKER_COLORS).map(([status, color]) => (
                <marker key={status} id={`radial-arrow-${status}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={color} opacity="0.65" />
                </marker>
              ))}
              {/* Glow filters */}
              {[
                { id: 'gm-glow-sm', std: 4, opacity: isDark ? 0.3 : 0.15 },
                { id: 'gm-glow-md', std: 8, opacity: isDark ? 0.4 : 0.2 },
                { id: 'gm-glow-lg', std: 12, opacity: isDark ? 0.5 : 0.25 },
              ].map(({ id, std, opacity }) => (
                <filter key={id} id={id} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation={std} result="blur" />
                  <feFlood floodOpacity={opacity} result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
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
