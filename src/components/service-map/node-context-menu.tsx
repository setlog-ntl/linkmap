'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, Link2, Activity, Trash2, Plus, Maximize2, FolderOpen, Star, StarOff, Check, ChevronRight } from 'lucide-react';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useReactFlow } from '@xyflow/react';

interface NodeContextMenuProps {
  onViewDetail: (nodeId: string) => void;
  onStartConnect: (nodeId: string) => void;
  onRunHealthCheck: (nodeId: string) => void;
  onRemoveService: (nodeId: string) => void;
  onSetMainService?: (nodeId: string) => void;
  onUnsetMainService?: () => void;
  mainServiceId?: string | null;
  currentZone?: (nodeId: string) => string | null;
}

export function NodeContextMenu({
  onViewDetail,
  onStartConnect,
  onRunHealthCheck,
  onRemoveService,
  onSetMainService,
  onUnsetMainService,
  mainServiceId,
  currentZone,
}: NodeContextMenuProps) {
  const {
    contextMenu, setContextMenu, setCatalogSidebarOpen,
    editMode, setPendingOverride, getActiveZones,
  } = useServiceMapStore();
  const { fitView } = useReactFlow();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showZoneSubmenu, setShowZoneSubmenu] = useState(false);

  useEffect(() => {
    const handleClick = () => { setContextMenu(null); setShowZoneSubmenu(false); };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setContextMenu(null); setShowZoneSubmenu(false); }
    };
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [setContextMenu]);

  if (!contextMenu) return null;

  const isNodeMenu = contextMenu.nodeId !== null;
  const nodeId = contextMenu.nodeId;
  const isMainService = nodeId === mainServiceId;
  const nodeCurrentZone = nodeId && currentZone ? currentZone(nodeId) : null;
  const zones = getActiveZones();

  const paneMenuItems = [
    { icon: Plus, label: '서비스 추가', action: () => setCatalogSidebarOpen(true) },
    { icon: Maximize2, label: '전체 보기', action: () => fitView({ padding: 0.3 }) },
  ];

  if (!isNodeMenu) {
    return (
      <div
        ref={menuRef}
        className="fixed z-50 min-w-[160px] rounded-md border bg-popover p-1 shadow-md"
        style={{ left: contextMenu.x, top: contextMenu.y }}
        onClick={(e) => e.stopPropagation()}
      >
        {paneMenuItems.map((item) => (
          <button
            key={item.label}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() => { item.action(); setContextMenu(null); }}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[180px] rounded-md border bg-popover p-1 shadow-md"
      style={{ left: contextMenu.x, top: contextMenu.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        onClick={() => { onViewDetail(nodeId!); setContextMenu(null); }}
      >
        <Eye className="h-4 w-4" /> 상세 보기
      </button>

      <button
        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        onClick={() => { onStartConnect(nodeId!); setContextMenu(null); }}
      >
        <Link2 className="h-4 w-4" /> 연결 시작
      </button>

      {/* Edit mode: Zone move + main service */}
      {editMode && (
        <>
          <div className="my-1 border-t border-border" />

          {/* Zone move submenu — dynamic zone list */}
          <div
            className="relative"
            onMouseEnter={() => setShowZoneSubmenu(true)}
            onMouseLeave={() => setShowZoneSubmenu(false)}
          >
            <button className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">
              <FolderOpen className="h-4 w-4" />
              <span className="flex-1 text-left">Zone 이동</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {showZoneSubmenu && (
              <div className="absolute left-full top-0 ml-1 min-w-[160px] rounded-md border bg-popover p-1 shadow-md">
                {zones.map((z) => (
                  <button
                    key={z.key}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setPendingOverride(nodeId!, z.key);
                      setContextMenu(null);
                      setShowZoneSubmenu(false);
                    }}
                  >
                    {nodeCurrentZone === z.key ? <Check className="h-3.5 w-3.5" /> : <span className="w-3.5" />}
                    <span className="flex-1">{z.label}</span>
                    {z.subtitle && <span className="text-[9px] text-muted-foreground">{z.subtitle}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main service toggle */}
          <button
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              if (isMainService) {
                onUnsetMainService?.();
              } else {
                onSetMainService?.(nodeId!);
              }
              setContextMenu(null);
            }}
          >
            {isMainService ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
            {isMainService ? '메인 서비스 해제' : '메인 서비스로 설정'}
          </button>
        </>
      )}

      <div className="my-1 border-t border-border" />

      <button
        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        onClick={() => { onRunHealthCheck(nodeId!); setContextMenu(null); }}
      >
        <Activity className="h-4 w-4" /> 헬스체크 실행
      </button>

      <button
        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent hover:text-destructive"
        onClick={() => { onRemoveService(nodeId!); setContextMenu(null); }}
      >
        <Trash2 className="h-4 w-4" /> 서비스 제거
      </button>
    </div>
  );
}
