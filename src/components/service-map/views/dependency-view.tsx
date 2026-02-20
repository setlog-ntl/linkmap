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
  type Connection,
  BackgroundVariant,
} from '@xyflow/react';
import { toast } from 'sonner';
import ServiceNode from '@/components/service-map/service-node';
import ZoneNode from '@/components/service-map/zone-node';
import ConnectionEdge from '@/components/service-map/connection-edge';
import { MapToolbar } from '@/components/service-map/map-toolbar';
import { ServiceDetailSheet } from '@/components/service-map/service-detail-sheet';
import { CatalogSidebar } from '@/components/service-map/catalog-sidebar';
import { NodeContextMenu } from '@/components/service-map/node-context-menu';
import { ConnectionTypeDialog } from '@/components/service-map/connection-type-dialog';
import { EditSaveBar } from '@/components/service-map/edit-save-bar';
import { MapLegend } from '@/components/service-map/map-legend';
import { MapNarratorPanel } from '@/components/ai/map-narrator-panel';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useUpsertLayerOverride } from '@/lib/queries/layer-overrides';
import { useUpdateProject } from '@/lib/queries/projects';
import { domainToZone, type ZoneKey } from '@/lib/layout/zone-layout';
import { useServiceMapNodes } from '@/components/service-map/hooks/useServiceMapNodes';
import { useServiceMapLayout } from '@/components/service-map/hooks/useServiceMapLayout';
import { useServiceMapInteractions } from '@/components/service-map/hooks/useServiceMapInteractions';
import type { ServiceMapData } from '@/components/service-map/hooks/useServiceMapData';
import type { ProjectService, Service, UserConnectionType, ServiceDomain } from '@/types';

const nodeTypes = { service: ServiceNode, zone: ZoneNode };
const edgeTypes = { connection: ConnectionEdge };

interface DependencyViewProps {
  data: ServiceMapData;
  projectId: string;
}

export function DependencyView({ data, projectId }: DependencyViewProps) {
  const {
    focusedNodeId, setFocusedNodeId, setContextMenu,
    connectingFrom, setConnectingFrom,
    editMode, pendingOverrides, pendingMainServiceId,
    setPendingMainServiceId, clearPendingChanges, setEditMode,
  } = useServiceMapStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<(ProjectService & { service: Service }) | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [saving, setSaving] = useState(false);
  const [connectionDialog, setConnectionDialog] = useState<{ sourceId: string; targetId: string } | null>(null);

  const upsertLayerOverride = useUpsertLayerOverride(projectId);
  const updateProject = useUpdateProject();
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
    createConnectionRef: data.createConnectionRef, deleteConnectionRef: data.deleteConnectionRef,
    runHealthCheck: data.runHealthCheck, removeService: data.removeService,
    setFocusedNodeId, setContextMenu, focusedNodeId,
    setSelectedService, setSheetOpen, setConnectingFrom, connectingFrom,
    onShowConnectionDialog,
  });

  const { layoutedNodes, layoutedEdges } = useServiceMapLayout({
    serviceNodes: nodesResult.serviceNodes, rawEdges: nodesResult.rawEdges,
    focusedNodeId, getDomain: nodesResult.getDomain, mainServiceId: effectiveMainServiceId,
  });

  const selectedServiceDeps = nodesResult.selectedServiceDeps(selectedService?.service_id);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback((changes: NodeChange<Node>[]) => { setNodes((nds) => applyNodeChanges(changes, nds)); }, []);
  const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => { setEdges((eds) => applyEdgeChanges(changes, eds)); }, []);

  useEffect(() => { setNodes(layoutedNodes); setEdges(layoutedEdges); }, [layoutedNodes, layoutedEdges]);

  const handleNativeConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target || connection.source === connection.target) return;
    const sourceSvc = data.services.find((s) => s.id === connection.source);
    const targetSvc = data.services.find((s) => s.id === connection.target);
    if (sourceSvc && targetSvc) interactions.createConnection(sourceSvc.service_id, targetSvc.service_id, 'uses');
  }, [data.services, interactions]);

  const handleConnectionConfirm = useCallback((type: UserConnectionType) => {
    if (!connectionDialog) return;
    const sourceSvc = data.services.find((s) => s.id === connectionDialog.sourceId);
    const targetSvc = data.services.find((s) => s.id === connectionDialog.targetId);
    if (sourceSvc && targetSvc) interactions.createConnection(sourceSvc.service_id, targetSvc.service_id, type);
  }, [connectionDialog, data.services, interactions]);

  const dialogSourceLabel = connectionDialog ? data.services.find((s) => s.id === connectionDialog.sourceId)?.service?.name : undefined;
  const dialogTargetLabel = connectionDialog ? data.services.find((s) => s.id === connectionDialog.targetId)?.service?.name : undefined;

  const getCurrentZone = useCallback((nodeId: string): ZoneKey | null => {
    const domain = nodesResult.getDomain(nodeId);
    return domain ? domainToZone(domain as ServiceDomain) : null;
  }, [nodesResult]);

  const handleSaveChanges = useCallback(async () => {
    setSaving(true);
    try {
      for (const [nodeId, zone] of Object.entries(pendingOverrides)) {
        const svc = data.services.find((s) => s.id === nodeId);
        if (svc) await upsertLayerOverride.mutateAsync({ service_id: svc.service_id, dashboard_layer: zone });
      }
      if (pendingMainServiceId !== undefined) {
        await updateProject.mutateAsync({ id: projectId, main_service_id: pendingMainServiceId });
      }
      toast.success('변경사항이 저장되었습니다');
      clearPendingChanges();
      setEditMode(false);
    } catch {
      toast.error('저장에 실패했습니다');
    } finally {
      setSaving(false);
    }
  }, [pendingOverrides, pendingMainServiceId, data.services, projectId, upsertLayerOverride, updateProject, clearPendingChanges, setEditMode]);

  return (
    <div className="space-y-3">
      <MapToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onExportPng={interactions.handleExportPng} onAiAnalyze={() => setShowAiPanel(!showAiPanel)} onToggleLegend={() => setShowLegend(!showLegend)} />
      <div className="h-[calc(100vh-20rem)] min-h-[400px] max-h-[900px] rounded-lg border bg-background relative flex overflow-hidden">
        <CatalogSidebar projectId={projectId} catalogServices={data.catalogServices} projectServices={data.services} isLoading={data.catalogLoading} />
        <div className="flex-1 relative">
          {connectingFrom && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
              대상 서비스를 클릭하세요 (ESC로 취소)
            </div>
          )}
          <ReactFlow
            nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={handleNativeConnect} onNodeClick={interactions.handleNodeClick}
            onPaneClick={interactions.handlePaneClick} onNodeContextMenu={interactions.handleNodeContextMenu}
            onPaneContextMenu={interactions.handlePaneContextMenu}
            nodeTypes={nodeTypes} edgeTypes={edgeTypes} fitView fitViewOptions={{ padding: 0.2 }}
          >
            <Controls />
            <MiniMap nodeStrokeWidth={3} nodeColor={interactions.getNodeColor} zoomable pannable />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          </ReactFlow>
          <EditSaveBar onSave={handleSaveChanges} saving={saving} />
          {showLegend && <MapLegend onClose={() => setShowLegend(false)} />}
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
      <ConnectionTypeDialog open={connectionDialog !== null} onOpenChange={(open) => { if (!open) setConnectionDialog(null); }} onConfirm={handleConnectionConfirm} sourceLabel={dialogSourceLabel} targetLabel={dialogTargetLabel} />
      <ServiceDetailSheet
        service={selectedService} dependencies={selectedServiceDeps} serviceNames={nodesResult.serviceNames}
        open={sheetOpen} onOpenChange={(open) => { setSheetOpen(open); if (!open) setSelectedService(null); }}
        projectId={projectId} envVars={data.envVars}
      />
    </div>
  );
}
