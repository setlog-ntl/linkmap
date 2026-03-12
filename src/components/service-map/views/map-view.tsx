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
import { GradientMeshDefs } from '@/components/service-map/gradient-mesh-defs';
import { SectorArcLayer } from '@/components/service-map/sector-arc-layer';
import { useRadialMapNodes } from '@/components/service-map/hooks/useRadialMapNodes';
import { useLocaleStore } from '@/stores/locale-store';
import { useServiceDetailStore } from '@/stores/service-detail-store';
import { useServiceMapStore } from '@/stores/service-map-store';
import { VIEW_GROUP_META, VIEW_GROUP_ORDER } from '@/lib/layout/view-group';
import { t } from '@/lib/i18n';
import type { ServiceMapData } from '@/components/service-map/hooks/useServiceMapData';
import type { ViewGroup } from '@/types';

const nodeTypes = {
  service: ServiceNode,
  project: ProjectNode,
};

const edgeTypes = {
  radial: RadialEdge,
};

// ViewGroup gradient start colors for MiniMap
const VG_MINIMAP_COLORS: Record<string, string> = {
  core: '#2563eb', runtime: '#059669', growth: '#7c3aed',
  intelligence: '#8b5cf6', infra: '#475569',
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
  const filterGroups = useServiceMapStore((s) => s.filterGroups);
  const filterStatuses = useServiceMapStore((s) => s.filterStatuses);
  const toggleFilterGroup = useServiceMapStore((s) => s.toggleFilterGroup);
  const toggleFilterStatus = useServiceMapStore((s) => s.toggleFilterStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const { nodes: layoutNodes, edges: layoutEdges } = useRadialMapNodes({
    services: data.services,
    userConnections: data.userConnections,
    projectName: data.projectName,
    searchQuery,
    focusedNodeId,
    filterGroups: filterGroups.length > 0 ? filterGroups : undefined,
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

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        if (e.key === 'Escape') {
          (target as HTMLElement).blur();
        }
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
  }, [focusedNodeId, setFocusedNodeId, fitView, nodes, data, projectId, openSheet, isReadOnly]);

  // Find focused service info for panel
  const focusedService = focusedNodeId
    ? data.services.find((s) => s.id === focusedNodeId)
    : null;

  // MiniMap node color callback
  const miniMapNodeColor = useCallback((node: Node) => {
    if (node.type === 'project') return '#2563eb';
    const vg = (node.data as Record<string, unknown>)?.viewGroup as string | undefined;
    return VG_MINIMAP_COLORS[vg ?? 'infra'] ?? '#475569';
  }, []);

  const STATUS_FILTER_OPTIONS = [
    { key: 'connected', label: '연결됨', color: '#22c55e' },
    { key: 'in_progress', label: '진행 중', color: '#f59e0b' },
    { key: 'error', label: '오류', color: '#f97316' },
    { key: 'not_started', label: '시작 전', color: '#64748b' },
  ];

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

      {/* Filter chips — below toolbar */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 flex-wrap justify-center">
        {/* ViewGroup filter chips */}
        {VIEW_GROUP_ORDER.map((group) => {
          const meta = VIEW_GROUP_META[group];
          const isActive = filterGroups.includes(group);
          return (
            <button
              key={group}
              onClick={() => toggleFilterGroup(group)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all"
              style={{
                borderColor: isActive ? meta.gradientFrom : 'var(--border)',
                background: isActive ? `${meta.gradientFrom}15` : 'var(--background)',
                color: isActive ? meta.gradientFrom : 'var(--muted-foreground)',
                opacity: isActive ? 1 : 0.7,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: `linear-gradient(135deg, ${meta.gradientFrom}, ${meta.gradientTo})` }}
              />
              {meta.label}
            </button>
          );
        })}
        <div className="w-px h-4 bg-border/30 mx-0.5" />
        {/* Status filter chips */}
        {STATUS_FILTER_OPTIONS.map((opt) => {
          const isActive = filterStatuses.includes(opt.key);
          return (
            <button
              key={opt.key}
              onClick={() => toggleFilterStatus(opt.key)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all"
              style={{
                borderColor: isActive ? opt.color : 'var(--border)',
                background: isActive ? `${opt.color}15` : 'var(--background)',
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

      {/* Canvas — React Flow requires parent with explicit width+height */}
      <div className="absolute inset-0 z-0 bg-background/50 service-map-canvas" style={{ width: '100%', height: '100%' }}>
        {/* Gradient Mesh SVG Defs — shared across all nodes/edges */}
        <GradientMeshDefs isDark={isDark} />

        {/* Ambient mesh gradient (dark mode only) */}
        {isDark && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <radialGradient id="mesh-ambient-bl" cx="15%" cy="20%" r="50%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="mesh-ambient-br" cx="85%" cy="80%" r="50%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="mesh-ambient-ct" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#mesh-ambient-bl)" />
            <rect width="100%" height="100%" fill="url(#mesh-ambient-br)" />
            <rect width="100%" height="100%" fill="url(#mesh-ambient-ct)" />
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
          {isDark ? (
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="oklch(0.35 0.02 250)" style={{ opacity: 0.25 }} />
          ) : (
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--border)" style={{ opacity: 0.5 }} />
          )}

          {/* Sector arc layer */}
          <SectorArcLayer isDark={isDark} />

          {/* SVG defs for arrow markers + gradient mesh */}
          <svg>
            <defs>
              {['connected', 'in_progress', 'error', 'not_started', 'default'].map((status) => {
                const colors: Record<string, string> = {
                  connected: 'oklch(0.70 0.12 255)', in_progress: 'oklch(0.75 0.15 80)',
                  error: 'oklch(0.65 0.18 25)', not_started: 'oklch(0.45 0.02 250)', default: 'oklch(0.45 0.02 250)',
                };
                return (
                  <marker key={status} id={`radial-arrow-${status}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={colors[status]} opacity="0.5" />
                  </marker>
                );
              })}
              {/* ViewGroup gradients inside ReactFlow SVG context */}
              {VIEW_GROUP_ORDER.map((group) => {
                const meta = VIEW_GROUP_META[group];
                return (
                  <linearGradient key={`rf-${meta.gradientId}`} id={meta.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={meta.gradientFrom} />
                    <stop offset="100%" stopColor={meta.gradientTo} />
                  </linearGradient>
                );
              })}
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
