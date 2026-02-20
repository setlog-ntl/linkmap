'use client';

import { useCallback } from 'react';
import type { Node } from '@xyflow/react';
import { toast } from 'sonner';
import { getCategoryStyle } from '@/lib/constants/category-styles';
import type { useCreateConnection, useDeleteConnection } from '@/lib/queries/connections';
import type { useRunHealthCheck } from '@/lib/queries/health-checks';
import type { useRemoveProjectService } from '@/lib/queries/services';
import type { ProjectService, Service, UserConnectionType } from '@/types';

export interface UseServiceMapInteractionsParams {
  projectId: string;
  projectName: string;
  services: (ProjectService & { service: Service })[];
  filteredServices: (ProjectService & { service: Service })[];
  createConnectionRef: React.RefObject<ReturnType<typeof useCreateConnection>>;
  deleteConnectionRef: React.RefObject<ReturnType<typeof useDeleteConnection>>;
  runHealthCheck: ReturnType<typeof useRunHealthCheck>;
  removeService: ReturnType<typeof useRemoveProjectService>;
  setFocusedNodeId: (id: string | null) => void;
  setContextMenu: (menu: { x: number; y: number; nodeId: string | null } | null) => void;
  focusedNodeId: string | null;
  setSelectedService: (svc: (ProjectService & { service: Service }) | null) => void;
  setSheetOpen: (open: boolean) => void;
  setConnectingFrom: (id: string | null) => void;
  connectingFrom: string | null;
  onShowConnectionDialog: (sourceId: string, targetId: string) => void;
}

export interface UseServiceMapInteractionsReturn {
  handleNodeClick: (event: React.MouseEvent, node: Node) => void;
  handlePaneClick: () => void;
  handleNodeContextMenu: (event: React.MouseEvent, node: Node) => void;
  handlePaneContextMenu: (event: React.MouseEvent | MouseEvent) => void;
  handleContextViewDetail: (nodeId: string) => void;
  handleContextStartConnect: (nodeId: string) => void;
  handleContextRunHealthCheck: (nodeId: string) => void;
  handleContextRemoveService: (nodeId: string) => void;
  handleExportPng: () => void;
  getNodeColor: (node: Node) => string;
  handleDeleteUserConnection: (edgeId: string) => void;
  createConnection: (sourceServiceId: string, targetServiceId: string, connectionType: UserConnectionType) => void;
}

export function useServiceMapInteractions(params: UseServiceMapInteractionsParams): UseServiceMapInteractionsReturn {
  const {
    projectId,
    projectName,
    services,
    filteredServices,
    createConnectionRef,
    deleteConnectionRef,
    runHealthCheck,
    removeService,
    setFocusedNodeId,
    setContextMenu,
    focusedNodeId,
    setSelectedService,
    setSheetOpen,
    setConnectingFrom,
    connectingFrom,
    onShowConnectionDialog,
  } = params;

  const handleDeleteUserConnection = useCallback((edgeId: string) => {
    const connectionId = edgeId.replace('uc-', '');
    deleteConnectionRef.current.mutate(connectionId, {
      onSuccess: () => { toast.success('연결이 삭제되었습니다'); },
      onError: (error) => { toast.error(error.message || '연결 삭제에 실패했습니다'); },
    });
  }, [deleteConnectionRef]);

  const createConnection = useCallback(
    (sourceServiceId: string, targetServiceId: string, connectionType: UserConnectionType) => {
      createConnectionRef.current.mutate(
        {
          project_id: projectId,
          source_service_id: sourceServiceId,
          target_service_id: targetServiceId,
          connection_type: connectionType,
        },
        {
          onSuccess: () => { toast.success('연결이 생성되었습니다'); },
          onError: (error) => { toast.error(error.message || '연결 생성에 실패했습니다'); },
        },
      );
    },
    [projectId, createConnectionRef]
  );

  // Node click: focus + detail OR complete connection
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === 'zone') return;

    // If connecting: show dialog to pick type
    if (connectingFrom && connectingFrom !== node.id) {
      onShowConnectionDialog(connectingFrom, node.id);
      setConnectingFrom(null);
      return;
    }
    if (connectingFrom === node.id) {
      setConnectingFrom(null);
      return;
    }

    // Normal click: toggle focus + open detail sheet
    setFocusedNodeId(node.id);
    const svc = services.find((s) => s.id === node.id);
    if (svc) {
      setSelectedService(svc);
      setSheetOpen(true);
    }
  }, [services, setFocusedNodeId, setSelectedService, setSheetOpen, connectingFrom, setConnectingFrom, onShowConnectionDialog]);

  const handlePaneClick = useCallback(() => {
    if (connectingFrom) {
      setConnectingFrom(null);
      return;
    }
    if (focusedNodeId) setFocusedNodeId(null);
  }, [focusedNodeId, setFocusedNodeId, connectingFrom, setConnectingFrom]);

  const handleNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'zone') return;
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
  }, [setContextMenu]);

  const handlePaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, nodeId: null });
  }, [setContextMenu]);

  const handleContextViewDetail = useCallback((nodeId: string) => {
    const svc = services.find((s) => s.id === nodeId);
    if (svc) {
      setSelectedService(svc);
      setSheetOpen(true);
    }
  }, [services, setSelectedService, setSheetOpen]);

  const handleContextStartConnect = useCallback((nodeId: string) => {
    setConnectingFrom(nodeId);
    toast.info('대상 서비스를 클릭하세요');
  }, [setConnectingFrom]);

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

  const getNodeColor = useCallback((node: Node) => {
    if (node.type === 'zone') return 'var(--muted)';
    const d = node.data as Record<string, unknown>;
    const cat = d.category as string;
    return getCategoryStyle(cat).hexColor;
  }, []);

  return {
    handleNodeClick,
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
    createConnection,
  };
}
