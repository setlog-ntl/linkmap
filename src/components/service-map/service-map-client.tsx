'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ReactFlow,
  ReactFlowProvider,
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from 'sonner';
import ServiceNode from '@/components/service-map/service-node';
import ZoneNode from '@/components/service-map/zone-node';
import ConnectionEdge from '@/components/service-map/connection-edge';
import { MapToolbar } from '@/components/service-map/map-toolbar';
import { ServiceDetailSheet } from '@/components/service-map/service-detail-sheet';
import { CatalogSidebar } from '@/components/service-map/catalog-sidebar';
import { EmptyMapState } from '@/components/service-map/empty-map-state';
import { NodeContextMenu } from '@/components/service-map/node-context-menu';
import { ConnectionTypeDialog } from '@/components/service-map/connection-type-dialog';
import { EditSaveBar } from '@/components/service-map/edit-save-bar';
import { MapLegend } from '@/components/service-map/map-legend';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MapNarratorPanel } from '@/components/ai/map-narrator-panel';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useUpsertLayerOverride } from '@/lib/queries/layer-overrides';
import { useUpdateProject } from '@/lib/queries/projects';
import { domainToZone, type ZoneKey } from '@/lib/layout/zone-layout';
import { useServiceMapData } from './hooks/useServiceMapData';
import { useServiceMapNodes } from './hooks/useServiceMapNodes';
import { useServiceMapLayout } from './hooks/useServiceMapLayout';
import { useServiceMapInteractions } from './hooks/useServiceMapInteractions';
import type { ProjectService, Service, UserConnectionType, ServiceDomain } from '@/types';

const nodeTypes = {
  service: ServiceNode,
  zone: ZoneNode,
};

const edgeTypes = {
  connection: ConnectionEdge,
};

function ServiceMapInner() {
  const params = useParams();
  const projectId = params.id as string;

  // OAuth success redirect handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthSuccess = urlParams.get('oauth_success');
    const ALLOWED_PROVIDERS = ['github', 'google', 'vercel', 'gitlab', 'bitbucket', 'azure', 'aws'];
    if (oauthSuccess && ALLOWED_PROVIDERS.includes(oauthSuccess.toLowerCase())) {
      toast.success(`${oauthSuccess} 계정이 연결되었습니다`);
      const url = new URL(window.location.href);
      url.searchParams.delete('oauth_success');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Zustand store
  const {
    focusedNodeId,
    setFocusedNodeId,
    setContextMenu,
    connectingFrom,
    setConnectingFrom,
    editMode,
    pendingOverrides,
    pendingMainServiceId,
    setPendingMainServiceId,
    clearPendingChanges,
    setEditMode,
  } = useServiceMapStore();

  // Local UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<(ProjectService & { service: Service }) | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [saving, setSaving] = useState(false);
  // Connection dialog state
  const [connectionDialog, setConnectionDialog] = useState<{ sourceId: string; targetId: string } | null>(null);

  // --- Hook 1: Data fetching ---
  const data = useServiceMapData(projectId);

  // Mutations for saving
  const upsertLayerOverride = useUpsertLayerOverride(projectId);
  const updateProject = useUpdateProject();

  // Resolve effective main service id (pending > data)
  const effectiveMainServiceId = pendingMainServiceId !== undefined ? pendingMainServiceId : data.mainServiceId;

  // Standalone delete handler
  const deleteConnectionRef = data.deleteConnectionRef;
  const handleDeleteUserConnection = useCallback((edgeId: string) => {
    const connectionId = edgeId.replace('uc-', '');
    deleteConnectionRef.current.mutate(connectionId, {
      onSuccess: () => { toast.success('연결이 삭제되었습니다'); },
      onError: (error: Error) => { toast.error(error.message || '연결 삭제에 실패했습니다'); },
    });
  }, [deleteConnectionRef]);

  // --- Hook 2: Node/Edge building ---
  const nodesResult = useServiceMapNodes({
    services: data.services,
    dependencies: data.dependencies,
    healthChecks: data.healthChecks,
    serviceAccounts: data.serviceAccounts,
    envVars: data.envVars,
    userConnections: data.userConnections,
    searchQuery,
    handleDeleteUserConnection,
    mainServiceId: effectiveMainServiceId,
    layerOverrides: data.layerOverrides,
    pendingOverrides,
  });

  // --- Hook 3: Interactions ---
  const onShowConnectionDialog = useCallback((sourceId: string, targetId: string) => {
    setConnectionDialog({ sourceId, targetId });
  }, []);

  const interactions = useServiceMapInteractions({
    projectId,
    projectName: data.projectName,
    services: data.services,
    filteredServices: nodesResult.filteredServices,
    createConnectionRef: data.createConnectionRef,
    deleteConnectionRef: data.deleteConnectionRef,
    runHealthCheck: data.runHealthCheck,
    removeService: data.removeService,
    setFocusedNodeId,
    setContextMenu,
    focusedNodeId,
    setSelectedService,
    setSheetOpen,
    setConnectingFrom,
    connectingFrom,
    onShowConnectionDialog,
  });

  // --- Hook 4: Layout ---
  const { layoutedNodes, layoutedEdges } = useServiceMapLayout({
    serviceNodes: nodesResult.serviceNodes,
    rawEdges: nodesResult.rawEdges,
    focusedNodeId,
    getDomain: nodesResult.getDomain,
    mainServiceId: effectiveMainServiceId,
  });

  // Selected service deps
  const selectedServiceDeps = nodesResult.selectedServiceDeps(selectedService?.service_id);

  // React state for interactive nodes/edges
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback((changes: NodeChange<Node>[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges]);

  // Connection dialog handlers
  const handleConnectionConfirm = useCallback((type: UserConnectionType) => {
    if (!connectionDialog) return;
    // Resolve service_ids from node ids
    const sourceSvc = data.services.find((s) => s.id === connectionDialog.sourceId);
    const targetSvc = data.services.find((s) => s.id === connectionDialog.targetId);
    if (sourceSvc && targetSvc) {
      interactions.createConnection(sourceSvc.service_id, targetSvc.service_id, type);
    }
  }, [connectionDialog, data.services, interactions]);

  // Source/target labels for dialog
  const dialogSourceLabel = connectionDialog ? data.services.find((s) => s.id === connectionDialog.sourceId)?.service?.name : undefined;
  const dialogTargetLabel = connectionDialog ? data.services.find((s) => s.id === connectionDialog.targetId)?.service?.name : undefined;

  // Get current zone for a node id (for context menu)
  const getCurrentZone = useCallback((nodeId: string): ZoneKey | null => {
    const domain = nodesResult.getDomain(nodeId);
    if (!domain) return null;
    return domainToZone(domain as ServiceDomain);
  }, [nodesResult]);

  // Edit mode: set/unset main service via context menu
  const handleSetMainService = useCallback((nodeId: string) => {
    setPendingMainServiceId(nodeId);
  }, [setPendingMainServiceId]);

  const handleUnsetMainService = useCallback(() => {
    setPendingMainServiceId(null);
  }, [setPendingMainServiceId]);

  // Save all pending changes
  const handleSaveChanges = useCallback(async () => {
    setSaving(true);
    try {
      // Save zone overrides
      const overrideEntries = Object.entries(pendingOverrides);
      for (const [nodeId, zone] of overrideEntries) {
        const svc = data.services.find((s) => s.id === nodeId);
        if (svc) {
          await upsertLayerOverride.mutateAsync({
            service_id: svc.service_id,
            dashboard_layer: zone,
          });
        }
      }

      // Save main service
      if (pendingMainServiceId !== undefined) {
        await updateProject.mutateAsync({
          id: projectId,
          main_service_id: pendingMainServiceId,
        });
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

  // Loading state
  const isDataLoading = data.servicesLoading || data.depsLoading || data.connectionsLoading;
  if (isDataLoading) {
    return <div className="h-[calc(100vh-16rem)] min-h-[500px] max-h-[900px] rounded-lg bg-muted animate-pulse" />;
  }

  // Empty state
  if (data.services.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold shrink-0">서비스 맵</h2>
        </div>
        <div className="h-[calc(100vh-16rem)] min-h-[500px] max-h-[900px]">
          <EmptyMapState projectId={projectId} />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold shrink-0">서비스 맵</h2>
          <MapToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onExportPng={interactions.handleExportPng}
            onAiAnalyze={() => setShowAiPanel(!showAiPanel)}
            onToggleLegend={() => setShowLegend(!showLegend)}
          />
        </div>

        <div className="h-[calc(100vh-16rem)] min-h-[400px] max-h-[900px] rounded-lg border bg-background relative flex overflow-hidden">
          <CatalogSidebar
            projectId={projectId}
            catalogServices={data.catalogServices}
            projectServices={data.services}
            isLoading={data.catalogLoading}
          />

          <div className="flex-1 relative">
            {connectingFrom && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
                대상 서비스를 클릭하세요 (ESC로 취소)
              </div>
            )}
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={interactions.handleNodeClick}
              onPaneClick={interactions.handlePaneClick}
              onNodeContextMenu={interactions.handleNodeContextMenu}
              onPaneContextMenu={interactions.handlePaneContextMenu}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
            >
              <Controls />
              <MiniMap
                nodeStrokeWidth={3}
                nodeColor={interactions.getNodeColor}
                zoomable
                pannable
              />
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            </ReactFlow>

            {/* Edit save bar */}
            <EditSaveBar onSave={handleSaveChanges} saving={saving} />

            {/* Legend panel */}
            {showLegend && <MapLegend onClose={() => setShowLegend(false)} />}
          </div>

          <NodeContextMenu
            onViewDetail={interactions.handleContextViewDetail}
            onStartConnect={interactions.handleContextStartConnect}
            onRunHealthCheck={interactions.handleContextRunHealthCheck}
            onRemoveService={interactions.handleContextRemoveService}
            onSetMainService={handleSetMainService}
            onUnsetMainService={handleUnsetMainService}
            mainServiceId={effectiveMainServiceId}
            currentZone={getCurrentZone}
          />
        </div>

        {/* AI Narrator Panel */}
        {showAiPanel && (
          <MapNarratorPanel
            projectId={projectId}
            nodes={data.services.map((ps) => ({
              slug: ps.service?.slug,
              name: ps.service?.name,
              category: ps.service?.category,
            }))}
            edges={data.userConnections.map((c) => ({
              source: c.source_service_id,
              target: c.target_service_id,
              type: c.connection_type,
            }))}
            health={Object.entries(data.healthChecks).map(([psId, hc]) => ({
              service_name: psId,
              status: (hc as { status?: string })?.status || 'unknown',
            }))}
          />
        )}

        {/* Connection type dialog */}
        <ConnectionTypeDialog
          open={connectionDialog !== null}
          onOpenChange={(open) => { if (!open) setConnectionDialog(null); }}
          onConfirm={handleConnectionConfirm}
          sourceLabel={dialogSourceLabel}
          targetLabel={dialogTargetLabel}
        />

        <ServiceDetailSheet
          service={selectedService}
          dependencies={selectedServiceDeps}
          serviceNames={nodesResult.serviceNames}
          open={sheetOpen}
          onOpenChange={(open) => {
            setSheetOpen(open);
            if (!open) setSelectedService(null);
          }}
          projectId={projectId}
          envVars={data.envVars}
        />
      </div>
    </TooltipProvider>
  );
}

export default function ServiceMapClient() {
  return (
    <ReactFlowProvider>
      <ServiceMapInner />
    </ReactFlowProvider>
  );
}
