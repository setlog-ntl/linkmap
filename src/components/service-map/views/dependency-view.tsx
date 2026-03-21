'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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
  type Connection,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { GradientMeshDefs } from '@/components/service-map/gradient-mesh-defs';
import ServiceNode from '@/components/service-map/service-node';
import ZoneNode from '@/components/service-map/zone-node';
import ConnectionEdge from '@/components/service-map/connection-edge';
import { MapToolbar } from '@/components/service-map/map-toolbar';
import { CatalogSidebar } from '@/components/service-map/catalog-sidebar';
import { NodeContextMenu } from '@/components/service-map/node-context-menu';
import { ConnectionTypeDialog } from '@/components/service-map/connection-type-dialog';
import { EditSaveBar } from '@/components/service-map/edit-save-bar';
import { MapLegend } from '@/components/service-map/map-legend';
import { MapNarratorPanel } from '@/components/ai/map-narrator-panel';
import { useServiceMapStore } from '@/stores/service-map-store';
import { EdgeEditPopover } from '@/components/service-map/edge-edit-popover';
import { NodeEditToolbar } from '@/components/service-map/node-edit-toolbar';
import { ZoneEditToolbar } from '@/components/service-map/zone-edit-toolbar';
import { useUpsertLayerOverride } from '@/lib/queries/layer-overrides';
import { useUpdateConnection } from '@/lib/queries/connections';
import { useUpdateProject } from '@/lib/queries/projects';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/keys';
import { domainToZone, type ZoneKey } from '@/lib/layout/zone-layout';
import { useServiceMapNodes } from '@/components/service-map/hooks/useServiceMapNodes';
import { useServiceMapLayout } from '@/components/service-map/hooks/useServiceMapLayout';
import { useServiceMapInteractions } from '@/components/service-map/hooks/useServiceMapInteractions';
import type { ServiceMapData } from '@/components/service-map/hooks/useServiceMapData';
import type { UserConnectionType, ServiceDomain } from '@/types';
import type { Edge as ReactFlowEdge } from '@xyflow/react';

const nodeTypes = { service: ServiceNode, zone: ZoneNode };
const edgeTypes = { connection: ConnectionEdge };

interface DependencyViewProps {
  data: ServiceMapData;
  projectId: string;
  isReadOnly?: boolean;
}

export function DependencyView({ data, projectId, isReadOnly = false }: DependencyViewProps) {
  const {
    focusedNodeId, setFocusedNodeId, setContextMenu,
    connectingFrom, setConnectingFrom,
    editMode, pendingOverrides, pendingMainServiceId,
    setPendingMainServiceId, clearPendingChanges, setEditMode,
    setHoveredNodeId, setDragTargetZoneKey,
    zoneConfigs, layoutPreset, zonePositionOverrides, zoneSizeOverrides,
    setZonePositionOverride, getActiveZones, setPendingOverride,
    pendingNodePositions, setPendingNodePosition,
    zoneConnections, addZoneConnection, removeZoneConnection,
  } = useServiceMapStore();

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [saving, setSaving] = useState(false);
  const [connectionDialog, setConnectionDialog] = useState<{ sourceId: string; targetId: string } | null>(null);
  const [edgePopover, setEdgePopover] = useState<{
    edgeId: string;
    connectionId: string;
    currentType: UserConnectionType;
    x: number;
    y: number;
  } | null>(null);

  // Selected node for floating toolbar
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const rfInstance = useRef<ReactFlowInstance | null>(null);

  const queryClient = useQueryClient();
  const upsertLayerOverride = useUpsertLayerOverride(projectId);
  const updateProject = useUpdateProject();
  const updateConnection = useUpdateConnection(projectId);
  const effectiveMainServiceId = pendingMainServiceId !== undefined ? pendingMainServiceId : data.mainServiceId;

  const deleteConnectionRef = data.deleteConnectionRef;
  const handleDeleteUserConnection = useCallback((edgeId: string) => {
    const connectionId = edgeId.replace('uc-', '');
    deleteConnectionRef.current.mutate(connectionId, {
      onSuccess: () => { toast.success('연결이 삭제되었습니다'); },
      onError: (error: Error) => { toast.error(error.message || '연결 삭제에 실패했습니다'); },
    });
  }, [deleteConnectionRef]);

  const nodesResult = useServiceMapNodes({
    services: data.services, dependencies: data.dependencies,
    healthChecks: data.healthChecks, serviceAccounts: data.serviceAccounts,
    envVars: data.envVars, userConnections: data.userConnections,
    searchQuery, handleDeleteUserConnection,
    mainServiceId: effectiveMainServiceId,
    layerOverrides: data.layerOverrides, pendingOverrides,
  });

  const onShowConnectionDialog = useCallback((sourceId: string, targetId: string) => {
    setConnectionDialog({ sourceId, targetId });
  }, []);

  const interactions = useServiceMapInteractions({
    projectId, projectName: data.projectName,
    services: data.services, filteredServices: nodesResult.filteredServices,
    dependencies: data.dependencies, envVars: data.envVars,
    createConnectionRef: data.createConnectionRef, deleteConnectionRef: data.deleteConnectionRef,
    runHealthCheck: data.runHealthCheck, removeService: data.removeService,
    setFocusedNodeId, setContextMenu, focusedNodeId,
    setConnectingFrom, connectingFrom,
    onShowConnectionDialog, editMode,
  });

  const activeZones = getActiveZones();

  // Merge saved positions (service_id keyed) + pending positions (nodeId keyed)
  const mergedNodePositions = useMemo(() => {
    const result: Record<string, { x: number; y: number }> = {};
    // Saved from DB (service_id → pos) → convert to nodeId
    for (const [serviceId, pos] of Object.entries(data.savedNodePositions)) {
      const nodeId = nodesResult.serviceIdToNodeId.get(serviceId);
      if (nodeId) result[nodeId] = pos;
    }
    // Pending overrides take priority (nodeId → pos)
    for (const [nodeId, pos] of Object.entries(pendingNodePositions)) {
      result[nodeId] = pos;
    }
    return result;
  }, [data.savedNodePositions, pendingNodePositions, nodesResult.serviceIdToNodeId]);

  const { layoutedNodes, layoutedEdges } = useServiceMapLayout({
    serviceNodes: nodesResult.serviceNodes, rawEdges: nodesResult.rawEdges,
    focusedNodeId, getDomain: nodesResult.getDomain, mainServiceId: effectiveMainServiceId,
    zoneConfigs: activeZones, layoutPreset, editMode,
    zonePositionOverrides, zoneSizeOverrides,
    nodePositionOverrides: mergedNodePositions,
  });

  // Compute optimal handle pair based on relative node positions
  const computeHandles = useCallback((srcId: string, tgtId: string) => {
    const srcNode = nodesRef.current.find((n) => n.id === srcId);
    const tgtNode = nodesRef.current.find((n) => n.id === tgtId);
    if (!srcNode || !tgtNode) return { sourceHandle: 'zs-right', targetHandle: 'zt-left' };

    const srcCx = srcNode.position.x + ((srcNode.style?.width as number) || 160) / 2;
    const srcCy = srcNode.position.y + ((srcNode.style?.height as number) || 72) / 2;
    const tgtCx = tgtNode.position.x + ((tgtNode.style?.width as number) || 160) / 2;
    const tgtCy = tgtNode.position.y + ((tgtNode.style?.height as number) || 72) / 2;

    const dx = tgtCx - srcCx;
    const dy = tgtCy - srcCy;
    const isZoneSrc = srcId.startsWith('zone-');
    const isZoneTgt = tgtId.startsWith('zone-');
    const sp = isZoneSrc ? 'zs' : 'source';
    const tp = isZoneTgt ? 'zt' : '';

    // Pick direction based on dominant axis
    if (Math.abs(dx) >= Math.abs(dy)) {
      return dx > 0
        ? { sourceHandle: `${sp}-right`, targetHandle: tp ? `${tp}-left` : 'left' }
        : { sourceHandle: `${sp}-left`, targetHandle: tp ? `${tp}-right` : 'right' };
    }
    return dy > 0
      ? { sourceHandle: `${sp}-bottom`, targetHandle: tp ? `${tp}-top` : 'top' }
      : { sourceHandle: `${sp}-top`, targetHandle: tp ? `${tp}-bottom` : 'bottom' };
  }, []);

  // Build zone-level visual edges with optimized handle directions
  const zoneEdges = useMemo<Edge[]>(() => {
    return zoneConnections.map((zc) => {
      const handles = computeHandles(zc.source, zc.target);
      return {
        id: `zc-${zc.id}`,
        source: zc.source,
        target: zc.target,
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
        type: 'connection',
        zIndex: 5,
        data: {
          connectionType: zc.connectionType,
          onDelete: (edgeId: string) => removeZoneConnection(edgeId.replace('zc-', '')),
        },
      };
    });
  }, [zoneConnections, removeZoneConnection, computeHandles]);

  const allEdges = useMemo(() => [...layoutedEdges, ...zoneEdges], [layoutedEdges, zoneEdges]);

  const [nodes, setNodes] = useState<Node[]>(layoutedNodes);
  const [edges, setEdges] = useState<Edge[]>(allEdges);
  const initialFitDone = useRef(false);
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  // Find which zone contains a given point (for drag-to-zone)
  const findZoneAtPoint = useCallback((x: number, y: number): string | null => {
    const zoneNodes = nodesRef.current.filter((n) => n.id.startsWith('zone-'));
    for (const zone of zoneNodes) {
      const zw = (zone.style?.width as number) || 0;
      const zh = (zone.style?.height as number) || 0;
      if (x >= zone.position.x && x <= zone.position.x + zw &&
          y >= zone.position.y && y <= zone.position.y + zh) {
        return zone.id.replace('zone-', '');
      }
    }
    return null;
  }, []);

  const onNodesChange = useCallback((changes: NodeChange<Node>[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    if (!editMode) return;

    for (const change of changes) {
      // Zone drag end → save position override
      if (change.type === 'position' && change.dragging === false && change.id.startsWith('zone-') && change.position) {
        setZonePositionOverride(change.id, change.position);
      }

      // Service node dragging → highlight target zone + save position
      if (change.type === 'position' && !change.id.startsWith('zone-') && change.position) {
        const cx = change.position.x + 80;
        const cy = change.position.y + 36;
        if (change.dragging) {
          setDragTargetZoneKey(findZoneAtPoint(cx, cy));
        } else {
          // Drop complete: save position + detect zone change
          setPendingNodePosition(change.id, change.position);
          const targetZone = findZoneAtPoint(cx, cy);
          setDragTargetZoneKey(null);
          if (targetZone) {
            const currentDomain = nodesResult.getDomain(change.id);
            const currentZone = currentDomain ? domainToZone(currentDomain as ServiceDomain, activeZones) : null;
            if (targetZone !== currentZone) {
              setPendingOverride(change.id, targetZone);
            }
          }
        }
      }
    }
  }, [editMode, setZonePositionOverride, setDragTargetZoneKey, findZoneAtPoint, nodesResult, activeZones, setPendingOverride]);
  const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => { setEdges((eds) => applyEdgeChanges(changes, eds)); }, []);

  useEffect(() => { setNodes(layoutedNodes); setEdges([...layoutedEdges, ...zoneEdges]); }, [layoutedNodes, layoutedEdges, zoneEdges]);

  const handleInit = useCallback((instance: ReactFlowInstance) => {
    rfInstance.current = instance;
    setTimeout(() => { instance.fitView({ padding: 0.4 }); initialFitDone.current = true; }, 100);
  }, []);

  // Undo/Redo keyboard shortcuts
  const { undo, redo, canUndo, canRedo } = useServiceMapStore();
  useEffect(() => {
    if (isReadOnly) return;
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
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
      // ESC to cancel connecting mode
      if (e.key === 'Escape' && connectingFrom) {
        setConnectingFrom(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReadOnly, undo, redo, canUndo, canRedo, connectingFrom, setConnectingFrom]);

  const handleNativeConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target || connection.source === connection.target) return;
    onShowConnectionDialog(connection.source, connection.target);
  }, [onShowConnectionDialog]);

  const handleNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === 'zone') return;
    setHoveredNodeId(node.id);
  }, [setHoveredNodeId]);

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, [setHoveredNodeId]);

  const handleEdgeClick = useCallback((_: React.MouseEvent, edge: ReactFlowEdge) => {
    if (isReadOnly) return;
    // Only user connections (uc- prefix) are editable
    if (!edge.id.startsWith('uc-')) return;
    const connectionId = edge.id.replace('uc-', '');
    const edgeData = edge.data as Record<string, unknown> | undefined;
    const currentType = (edgeData?.connectionType as UserConnectionType) || 'uses';
    // Use mouse event coordinates for popover position
    const rect = (_.target as HTMLElement).closest('.service-map-canvas')?.getBoundingClientRect();
    const x = _.clientX - (rect?.left ?? 0);
    const y = _.clientY - (rect?.top ?? 0);
    setEdgePopover({ edgeId: edge.id, connectionId, currentType, x, y });
  }, [isReadOnly, edges]);

  const handleConnectionConfirm = useCallback((type: UserConnectionType) => {
    if (!connectionDialog) return;
    const { sourceId, targetId } = connectionDialog;
    const isSourceZone = sourceId.startsWith('zone-');
    const isTargetZone = targetId.startsWith('zone-');

    if (!isSourceZone && !isTargetZone) {
      // Service-to-Service (existing)
      const sourceSvc = data.services.find((s) => s.id === sourceId);
      const targetSvc = data.services.find((s) => s.id === targetId);
      if (sourceSvc && targetSvc) interactions.createConnection(sourceSvc.service_id, targetSvc.service_id, type);
    } else {
      // Zone involved: create zone-level visual edge ONLY (no service expansion)
      addZoneConnection({
        id: `${Date.now()}`,
        source: sourceId,
        target: targetId,
        connectionType: type,
      });
      const srcLabel = isSourceZone
        ? activeZones.find((z) => z.key === sourceId.replace('zone-', ''))?.label || sourceId
        : '서비스';
      const tgtLabel = isTargetZone
        ? activeZones.find((z) => z.key === targetId.replace('zone-', ''))?.label || targetId
        : '서비스';
      toast.success(`${srcLabel} → ${tgtLabel} Zone 연결 생성`);
    }
  }, [connectionDialog, data.services, interactions, addZoneConnection, activeZones]);

  // Dialog labels — handle zone IDs
  const resolveDialogInfo = useCallback((id: string) => {
    if (id.startsWith('zone-')) {
      const zoneKey = id.replace('zone-', '');
      const zone = activeZones.find((z) => z.key === zoneKey);
      return { label: zone?.label || zoneKey.toUpperCase(), category: undefined };
    }
    const svc = data.services.find((s) => s.id === id);
    return { label: svc?.service?.name, category: svc?.service?.category };
  }, [data.services, activeZones]);

  const dialogSource = connectionDialog ? resolveDialogInfo(connectionDialog.sourceId) : null;
  const dialogTarget = connectionDialog ? resolveDialogInfo(connectionDialog.targetId) : null;
  const dialogSourceLabel = dialogSource?.label;
  const dialogTargetLabel = dialogTarget?.label;
  const dialogSourceCategory = dialogSource?.category;
  const dialogTargetCategory = dialogTarget?.category;

  const getCurrentZone = useCallback((nodeId: string): ZoneKey | null => {
    const domain = nodesResult.getDomain(nodeId);
    return domain ? domainToZone(domain as ServiceDomain, activeZones) : null;
  }, [nodesResult, activeZones]);

  const handleSaveChanges = useCallback(async () => {
    setSaving(true);
    try {
      // Collect all nodes that need saving (zone changes and/or position changes)
      const allNodeIds = new Set([
        ...Object.keys(pendingOverrides),
        ...Object.keys(pendingNodePositions),
      ]);

      for (const nodeId of allNodeIds) {
        const svc = data.services.find((s) => s.id === nodeId);
        if (!svc) continue;
        const zone = pendingOverrides[nodeId];
        const pos = pendingNodePositions[nodeId];
        await upsertLayerOverride.mutateAsync({
          service_id: svc.service_id,
          ...(zone ? { dashboard_layer: zone } : {}),
          position_x: pos?.x ?? null,
          position_y: pos?.y ?? null,
        });
      }

      if (pendingMainServiceId !== undefined) {
        await updateProject.mutateAsync({ id: projectId, main_service_id: pendingMainServiceId });
      }

      await queryClient.refetchQueries({ queryKey: queryKeys.layerOverrides.byProject(projectId) });
      toast.success('변경사항이 저장되었습니다');
      clearPendingChanges();
      setEditMode(false);
    } catch {
      toast.error('저장에 실패했습니다');
    } finally {
      setSaving(false);
    }
  }, [pendingOverrides, pendingNodePositions, pendingMainServiceId, data.services, projectId, upsertLayerOverride, updateProject, clearPendingChanges, setEditMode, queryClient]);

  return (
    <div className="flex-1 w-full relative min-h-0 border-none bg-background overflow-hidden flex flex-col">
      <MapToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onExportPng={interactions.handleExportPng} onAiAnalyze={() => setShowAiPanel(!showAiPanel)} onToggleLegend={() => setShowLegend(!showLegend)} />
      <div className="flex-1 flex overflow-hidden">
        {!isReadOnly && (
          <CatalogSidebar projectId={projectId} catalogServices={data.catalogServices} projectServices={data.services} isLoading={data.catalogLoading} />
        )}
        <div className="flex-1 relative service-map-canvas" style={{ width: '100%', height: '100%' }}>
          {!isReadOnly && connectingFrom && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-primary text-primary-foreground text-xs px-4 py-2 rounded-full shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground" />
              </span>
              대상 서비스를 클릭하세요
              <kbd className="ml-1 px-1.5 py-0.5 rounded bg-primary-foreground/20 text-[10px] font-mono">ESC</kbd>
            </div>
          )}
          <GradientMeshDefs isDark={isDark} />
          <ReactFlow
            style={{ width: '100%', height: '100%' }}
            nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={isReadOnly ? undefined : handleNativeConnect}
            onNodeClick={isReadOnly ? undefined : (e, node) => {
              interactions.handleNodeClick(e, node);
              if (editMode && (node.type === 'service' || node.type === 'zone')) setSelectedNodeId(node.id);
              else setSelectedNodeId(null);
            }}
            onPaneClick={isReadOnly ? undefined : () => {
              interactions.handlePaneClick();
              setSelectedNodeId(null);
            }}
            onNodeContextMenu={isReadOnly ? undefined : interactions.handleNodeContextMenu}
            onPaneContextMenu={isReadOnly ? undefined : interactions.handlePaneContextMenu}
            onNodeMouseEnter={handleNodeMouseEnter}
            onNodeMouseLeave={handleNodeMouseLeave}
            onEdgeClick={handleEdgeClick}
            nodeTypes={nodeTypes} edgeTypes={edgeTypes} onInit={handleInit}
            nodesDraggable={!isReadOnly}
            nodesConnectable={!isReadOnly}
          >
            <Controls />
            <MiniMap
              nodeStrokeWidth={3}
              nodeColor={interactions.getNodeColor}
              zoomable
              pannable
              maskColor={isDark ? 'rgba(15, 29, 47, 0.85)' : undefined}
              style={isDark ? { backgroundColor: 'var(--card)' } : undefined}
            />
            {/* PCB 스타일 도트 그리드 배경 (의존성 뷰 전용) */}
            {isDark ? (
              <Background variant={BackgroundVariant.Dots} gap={32} size={0.8} color="#34d39940" style={{ opacity: 0.3 }} />
            ) : (
              <Background variant={BackgroundVariant.Dots} gap={32} size={0.8} color="#3b6cf030" style={{ opacity: 0.7 }} />
            )}
          </ReactFlow>
          {!isReadOnly && <EditSaveBar onSave={handleSaveChanges} saving={saving} />}
          {/* Floating edit toolbar above selected node/zone */}
          {editMode && selectedNodeId && (() => {
            const selectedNode = nodes.find((n) => n.id === selectedNodeId);
            if (!selectedNode || !rfInstance.current) return null;
            const screenPos = rfInstance.current.flowToScreenPosition(selectedNode.position);
            const canvasRect = document.querySelector('.service-map-canvas')?.getBoundingClientRect();
            if (!canvasRect) return null;
            const relX = screenPos.x - canvasRect.left;
            const relY = screenPos.y - canvasRect.top;
            const nodeW = (selectedNode.style?.width as number) || 160;

            if (selectedNode.type === 'zone') {
              const zoneData = selectedNode.data as Record<string, unknown>;
              return (
                <ZoneEditToolbar
                  zoneId={selectedNode.id}
                  zoneLabel={(zoneData.label as string) || 'ZONE'}
                  position={{ x: relX + nodeW / 2, y: relY }}
                  onStartConnect={(nid) => { interactions.handleContextStartConnect(nid); setSelectedNodeId(null); }}
                />
              );
            }

            const currentZone = getCurrentZone(selectedNodeId);
            return (
              <NodeEditToolbar
                nodeId={selectedNodeId}
                currentZoneKey={currentZone}
                position={{ x: relX + 80, y: relY }}
                onStartConnect={(nid) => { interactions.handleContextStartConnect(nid); setSelectedNodeId(null); }}
                onViewDetail={(nid) => { interactions.handleContextViewDetail(nid); setSelectedNodeId(null); }}
                onRemoveService={(nid) => { interactions.handleContextRemoveService(nid); setSelectedNodeId(null); }}
              />
            );
          })()}
          {showLegend && <MapLegend onClose={() => setShowLegend(false)} />}
          {edgePopover && (
            <EdgeEditPopover
              edgeId={edgePopover.edgeId}
              connectionId={edgePopover.connectionId}
              currentType={edgePopover.currentType}
              position={{ x: edgePopover.x, y: edgePopover.y }}
              onChangeType={(type) => {
                updateConnection.mutate(
                  { id: edgePopover.connectionId, connection_type: type },
                  { onSuccess: () => toast.success('연결 타입이 변경되었습니다') },
                );
                setEdgePopover(null);
              }}
              onDelete={() => {
                handleDeleteUserConnection(edgePopover.edgeId);
                setEdgePopover(null);
              }}
              onClose={() => setEdgePopover(null)}
            />
          )}
        </div>
        <NodeContextMenu
          onViewDetail={interactions.handleContextViewDetail} onStartConnect={interactions.handleContextStartConnect}
          onRunHealthCheck={interactions.handleContextRunHealthCheck} onRemoveService={interactions.handleContextRemoveService}
          onSetMainService={(nodeId) => setPendingMainServiceId(nodeId)} onUnsetMainService={() => setPendingMainServiceId(null)}
          mainServiceId={effectiveMainServiceId} currentZone={getCurrentZone}
        />
      </div>
      {showAiPanel && (
        <MapNarratorPanel
          projectId={projectId}
          nodes={data.services.map((ps) => ({ slug: ps.service?.slug, name: ps.service?.name, category: ps.service?.category }))}
          edges={data.userConnections.map((c) => ({ source: c.source_service_id, target: c.target_service_id, type: c.connection_type }))}
          health={Object.entries(data.healthChecks).map(([psId, hc]) => ({ service_name: psId, status: (hc as { status?: string })?.status || 'unknown' }))}
        />
      )}
      <ConnectionTypeDialog open={connectionDialog !== null} onOpenChange={(open) => { if (!open) setConnectionDialog(null); }} onConfirm={handleConnectionConfirm} sourceLabel={dialogSourceLabel} targetLabel={dialogTargetLabel} sourceCategory={dialogSourceCategory} targetCategory={dialogTargetCategory} />
    </div>
  );
}
