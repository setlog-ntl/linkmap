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
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from 'sonner';
import ServiceNode from '@/components/service-map/service-node';
import AppNode from '@/components/service-map/app-node';
import GroupNode from '@/components/service-map/group-node';
import DependencyEdge from '@/components/service-map/dependency-edge';
import UserConnectionEdge from '@/components/service-map/user-connection-edge';
import { MapToolbar, type GroupMode, type LayoutDirection, type StatusFilter } from '@/components/service-map/map-toolbar';
import { ServiceDetailSheet } from '@/components/service-map/service-detail-sheet';
import { CatalogSidebar } from '@/components/service-map/catalog-sidebar';
import { EmptyMapState } from '@/components/service-map/empty-map-state';
import { NodeContextMenu } from '@/components/service-map/node-context-menu';
import { StatusOverviewBar } from '@/components/service-map/status-overview-bar';
import { ServiceBentoGrid } from '@/components/service-map/service-bento-grid';
import { DependencyChainPanel } from '@/components/service-map/dependency-chain-panel';
import { HealthStatsPanel } from '@/components/service-map/health-stats-panel';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DollarSign, ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon } from 'lucide-react';
import { MapNarratorPanel } from '@/components/ai/map-narrator-panel';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useServiceMapData } from './hooks/useServiceMapData';
import { useServiceMapNodes } from './hooks/useServiceMapNodes';
import { useServiceMapLayout } from './hooks/useServiceMapLayout';
import { useServiceMapInteractions } from './hooks/useServiceMapInteractions';
import type { ProjectService, Service, UserConnectionType } from '@/types';

const nodeTypes = {
  service: ServiceNode,
  app: AppNode,
  group: GroupNode,
};

const edgeTypes = {
  dependency: DependencyEdge,
  userConnection: UserConnectionEdge,
};

/** SVG marker definitions for dependency arrows + category gradient strokes */
const depMarkerDefs = (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      <marker id="dep-arrow-required" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--destructive)" />
      </marker>
      <marker id="dep-arrow-recommended" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary)" />
      </marker>
      <marker id="dep-arrow-optional" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
      </marker>
      <marker id="dep-arrow-alternative" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--chart-4)" />
      </marker>
      <linearGradient id="edge-gradient-auth" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <linearGradient id="edge-gradient-database" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="edge-gradient-deploy" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>
      <linearGradient id="edge-gradient-payment" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
      <linearGradient id="edge-gradient-ai" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <linearGradient id="edge-gradient-monitoring" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
      <linearGradient id="edge-gradient-storage" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  </svg>
);

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
    viewMode,
    focusedNodeId,
    setFocusedNodeId,
    collapsedGroups,
    toggleGroupCollapsed,
    setContextMenu,
    expandedNodeId,
    setExpandedNodeId,
    bottomPanelOpen,
    toggleBottomPanel,
  } = useServiceMapStore();

  // Local UI state
  const [groupMode, setGroupMode] = useState<GroupMode>('category');
  const [layoutDirection, setLayoutDirection] = useState<LayoutDirection>('TB');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedService, setSelectedService] = useState<(ProjectService & { service: Service }) | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [connectMode, setConnectMode] = useState(false);
  const [connectionType, setConnectionType] = useState<UserConnectionType>('uses');
  const [showAiPanel, setShowAiPanel] = useState(false);

  // --- Hook 1: Data fetching ---
  const data = useServiceMapData(projectId);

  // Standalone delete handler (needed by useServiceMapNodes before interactions hook)
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
    projectName: data.projectName,
    groupMode,
    searchQuery,
    statusFilter,
    expandedNodeId,
    viewMode,
    collapsedGroups,
    connectMode,
    toggleGroupCollapsed,
    handleDeleteUserConnection,
  });

  // --- Hook 3: Interactions ---
  const interactions = useServiceMapInteractions({
    projectId,
    projectName: data.projectName,
    services: data.services,
    filteredServices: nodesResult.filteredServices,
    connectMode,
    connectionType,
    createConnectionRef: data.createConnectionRef,
    deleteConnectionRef: data.deleteConnectionRef,
    runHealthCheck: data.runHealthCheck,
    removeService: data.removeService,
    setFocusedNodeId,
    setContextMenu,
    setExpandedNodeId,
    focusedNodeId,
    setSelectedService,
    setSheetOpen,
    setConnectMode,
  });

  // --- Hook 4: Layout ---
  const { layoutedNodes, layoutedEdges } = useServiceMapLayout({
    rawNodes: nodesResult.rawNodes,
    rawEdges: nodesResult.rawEdges,
    focusedNodeId,
    viewMode,
    layoutDirection,
    expandedNodeId,
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

  const hasBottomPanel = viewMode === 'bento' || viewMode === 'dependency' || viewMode === 'health';
  const mapMaxHeight = hasBottomPanel && bottomPanelOpen ? 'max-h-[500px]' : 'max-h-[900px]';

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold shrink-0">서비스 맵</h2>
          <MapToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            groupMode={groupMode}
            onGroupModeChange={setGroupMode}
            layoutDirection={layoutDirection}
            onLayoutDirectionChange={setLayoutDirection}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onExportPng={interactions.handleExportPng}
            connectMode={connectMode}
            onConnectModeChange={setConnectMode}
            connectionType={connectionType}
            onConnectionTypeChange={setConnectionType}
            onAiAnalyze={() => setShowAiPanel(!showAiPanel)}
          />
        </div>

        <StatusOverviewBar
          services={data.services}
          serviceAccounts={data.serviceAccounts}
          onServiceClick={(psId) => setFocusedNodeId(psId)}
        />

        <div className={`h-[calc(100vh-16rem)] min-h-[400px] ${mapMaxHeight} rounded-lg border bg-background relative flex overflow-hidden transition-all duration-300`}>
          <CatalogSidebar
            projectId={projectId}
            catalogServices={data.catalogServices}
            projectServices={data.services}
            isLoading={data.catalogLoading}
          />

          <div className="flex-1 relative">
            {depMarkerDefs}
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={interactions.onConnect}
              onNodeClick={interactions.handleNodeClick}
              onNodeDoubleClick={interactions.handleNodeDoubleClick}
              onPaneClick={interactions.handlePaneClick}
              onNodeContextMenu={interactions.handleNodeContextMenu}
              onPaneContextMenu={interactions.handlePaneContextMenu}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              connectionLineStyle={connectMode ? { stroke: '#3b82f6', strokeWidth: 2 } : undefined}
            >
              <Controls />
              <MiniMap
                nodeStrokeWidth={3}
                nodeColor={interactions.getNodeColor}
                zoomable
                pannable
              />
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} />

              {/* Legend */}
              <Panel position="top-right">
                <div className="flex flex-col gap-2 text-xs bg-background/80 backdrop-blur rounded-lg p-2 border">
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> 연결됨</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" /> 진행 중</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400 inline-block" /> 시작 전</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> 오류</span>
                  </div>
                  {data.userConnections.length > 0 && (
                    <div className="flex gap-2 border-t pt-1.5">
                      <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block" /> 사용</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-green-500 inline-block" /> 연동</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-500 inline-block border-dashed" style={{ borderTop: '2px dashed #f97316', height: 0 }} /> 데이터</span>
                    </div>
                  )}
                  {viewMode !== 'default' && (
                    <div className="border-t pt-1.5 text-muted-foreground">
                      모드: {viewMode === 'cost' ? '비용' : viewMode === 'health' ? '상태' : viewMode === 'bento' ? '카드' : '의존성'}
                    </div>
                  )}
                </div>
              </Panel>

              {/* Cost summary */}
              <Panel position="bottom-left">
                <Card className="w-[220px]">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      월간 비용 요약
                    </div>
                    <div className="space-y-1">
                      {data.services.filter((ps) => ps.service?.monthly_cost_estimate && Object.keys(ps.service.monthly_cost_estimate).length > 0).length > 0 ? (
                        data.services
                          .filter((ps) => ps.service?.monthly_cost_estimate && Object.keys(ps.service.monthly_cost_estimate).length > 0)
                          .map((ps) => {
                            const estimate = ps.service?.monthly_cost_estimate;
                            const firstVal = estimate ? Object.values(estimate)[0] : null;
                            return (
                              <div key={ps.id} className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground truncate mr-2">{ps.service?.name}</span>
                                <span className="font-medium shrink-0">{firstVal as string}</span>
                              </div>
                            );
                          })
                      ) : (
                        <p className="text-xs text-muted-foreground">비용 정보 없음</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Panel>
            </ReactFlow>
          </div>

          <NodeContextMenu
            onViewDetail={interactions.handleContextViewDetail}
            onStartConnect={interactions.handleContextStartConnect}
            onRunHealthCheck={interactions.handleContextRunHealthCheck}
            onRemoveService={interactions.handleContextRemoveService}
          />
        </div>

        {/* Bottom panel toggle + panels */}
        {hasBottomPanel && (
          <div className="space-y-2">
            <button
              onClick={toggleBottomPanel}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {bottomPanelOpen ? (
                <><ChevronUpIcon className="h-3 w-3" /> 패널 접기</>
              ) : (
                <><ChevronDownIcon className="h-3 w-3" /> 패널 펼치기</>
              )}
            </button>

            {bottomPanelOpen && (
              <>
                {viewMode === 'bento' && (
                  <ServiceBentoGrid
                    services={data.services}
                    healthChecks={data.healthChecks}
                    dependencies={data.dependencies}
                    serviceNames={nodesResult.serviceNames}
                    userConnections={data.userConnections}
                  />
                )}

                {viewMode === 'dependency' && (
                  <DependencyChainPanel
                    services={data.services}
                    dependencies={data.dependencies}
                    serviceNames={nodesResult.serviceNames}
                  />
                )}

                {viewMode === 'health' && (
                  <HealthStatsPanel
                    services={data.services}
                    healthChecks={data.healthChecks}
                    userConnections={data.userConnections}
                  />
                )}
              </>
            )}
          </div>
        )}

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
