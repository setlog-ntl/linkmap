'use client';

import { useCallback } from 'react';
import type { Connection, Node } from '@xyflow/react';
import { toast } from 'sonner';
import { getCategoryStyle } from '@/lib/constants/category-styles';
import type { useCreateConnection, useDeleteConnection } from '@/lib/queries/connections';
import type { useRunHealthCheck } from '@/lib/queries/health-checks';
import type { useRemoveProjectService } from '@/lib/queries/services';
import type { ProjectService, Service, UserConnectionType } from '@/types';

export interface UseServiceMapInteractionsParams {
  projectId: string;
  projectName: string;

  // Services
  services: (ProjectService & { service: Service })[];
  filteredServices: (ProjectService & { service: Service })[];

  // Connect mode
  connectMode: boolean;
  connectionType: UserConnectionType;

  // Mutation refs
  createConnectionRef: React.RefObject<ReturnType<typeof useCreateConnection>>;
  deleteConnectionRef: React.RefObject<ReturnType<typeof useDeleteConnection>>;
  runHealthCheck: ReturnType<typeof useRunHealthCheck>;
  removeService: ReturnType<typeof useRemoveProjectService>;

  // Store actions
  setFocusedNodeId: (id: string | null) => void;
  setContextMenu: (menu: { x: number; y: number; nodeId: string | null } | null) => void;
  setExpandedNodeId: (id: string | null) => void;
  focusedNodeId: string | null;

  // Local state setters
  setSelectedService: (svc: (ProjectService & { service: Service }) | null) => void;
  setSheetOpen: (open: boolean) => void;
  setConnectMode: (mode: boolean) => void;
}

export interface UseServiceMapInteractionsReturn {
  onConnect: (connection: Connection) => void;
  handleNodeClick: (event: React.MouseEvent, node: Node) => void;
  handleNodeDoubleClick: (event: React.MouseEvent, node: Node) => void;
  handlePaneClick: () => void;
  handleNodeContextMenu: (event: React.MouseEvent, node: Node) => void;
  handlePaneContextMenu: (event: React.MouseEvent | MouseEvent) => void;
  handleContextViewDetail: (nodeId: string) => void;
  handleContextStartConnect: () => void;
  handleContextRunHealthCheck: (nodeId: string) => void;
  handleContextRemoveService: (nodeId: string) => void;
  handleExportPng: () => void;
  getNodeColor: (node: Node) => string;
  handleDeleteUserConnection: (edgeId: string) => void;
}

export function useServiceMapInteractions(params: UseServiceMapInteractionsParams): UseServiceMapInteractionsReturn {
  const {
    projectId,
    projectName,
    services,
    filteredServices,
    connectMode,
    connectionType,
    createConnectionRef,
    deleteConnectionRef,
    runHealthCheck,
    removeService,
    setFocusedNodeId,
    setContextMenu,
    setExpandedNodeId,
    focusedNodeId,
    setSelectedService,
    setSheetOpen,
    setConnectMode,
  } = params;

  // Handle delete user connection
  const handleDeleteUserConnection = useCallback((edgeId: string) => {
    const connectionId = edgeId.replace('uc-', '');
    deleteConnectionRef.current.mutate(connectionId, {
      onSuccess: () => {
        toast.success('연결이 삭제되었습니다');
      },
      onError: (error) => {
        toast.error(error.message || '연결 삭제에 실패했습니다');
      },
    });
  }, [deleteConnectionRef]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connectMode) return;
      const sourcePS = filteredServices.find((s) => s.id === connection.source);
      const targetPS = filteredServices.find((s) => s.id === connection.target);

      if (sourcePS && targetPS && sourcePS.service_id !== targetPS.service_id) {
        createConnectionRef.current.mutate(
          {
            project_id: projectId,
            source_service_id: sourcePS.service_id,
            target_service_id: targetPS.service_id,
            connection_type: connectionType,
          },
          {
            onSuccess: () => {
              toast.success('연결이 생성되었습니다');
            },
            onError: (error) => {
              toast.error(error.message || '연결 생성에 실패했습니다');
            },
          },
        );
      }
    },
    [connectMode, connectionType, filteredServices, projectId, createConnectionRef]
  );

  // Node click -- focus mode + detail sheet
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === 'group') return;
    if (node.id === 'app') return;

    // Toggle focus
    setFocusedNodeId(node.id);

    // Open detail sheet
    const svc = services.find((s) => s.id === node.id);
    if (svc) {
      setSelectedService(svc);
      setSheetOpen(true);
    }
  }, [services, setFocusedNodeId, setSelectedService, setSheetOpen]);

  // Double-click -- expand/collapse node
  const handleNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === 'group' || node.id === 'app') return;
    setExpandedNodeId(node.id);
  }, [setExpandedNodeId]);

  // Pane click -- clear focus
  const handlePaneClick = useCallback(() => {
    if (focusedNodeId) setFocusedNodeId(null);
  }, [focusedNodeId, setFocusedNodeId]);

  // Context menu handlers
  const handleNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'group' || node.id === 'app') return;
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
  }, [setContextMenu]);

  const handlePaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, nodeId: null });
  }, [setContextMenu]);

  // Context menu action handlers
  const handleContextViewDetail = useCallback((nodeId: string) => {
    const svc = services.find((s) => s.id === nodeId);
    if (svc) {
      setSelectedService(svc);
      setSheetOpen(true);
    }
  }, [services, setSelectedService, setSheetOpen]);

  const handleContextStartConnect = useCallback(() => {
    setConnectMode(true);
  }, [setConnectMode]);

  const handleContextRunHealthCheck = useCallback((nodeId: string) => {
    runHealthCheck.mutate({ project_service_id: nodeId });
  }, [runHealthCheck]);

  const handleContextRemoveService = useCallback((nodeId: string) => {
    removeService.mutate(nodeId);
  }, [removeService]);

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
      a.download = `${projectName}-service-map.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = url;
  }, [projectName]);

  // MiniMap node color
  const getNodeColor = useCallback((node: Node) => {
    if (node.type === 'app') return 'var(--primary)';
    const d = node.data as Record<string, unknown>;
    const cat = d.category as string;
    return getCategoryStyle(cat).hexColor;
  }, []);

  return {
    onConnect,
    handleNodeClick,
    handleNodeDoubleClick,
    handlePaneClick,
    handleNodeContextMenu,
    handlePaneContextMenu,
    handleContextViewDetail,
    handleContextStartConnect,
    handleContextRunHealthCheck,
    handleContextRemoveService,
    handleExportPng,
    getNodeColor,
    handleDeleteUserConnection,
  };
}
