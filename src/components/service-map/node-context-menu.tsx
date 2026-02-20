'use client';

import { useEffect, useRef } from 'react';
import { Eye, Link2, Activity, Trash2, Plus, Maximize2 } from 'lucide-react';
import { useServiceMapStore } from '@/stores/service-map-store';
import { useReactFlow } from '@xyflow/react';

interface NodeContextMenuProps {
  onViewDetail: (nodeId: string) => void;
  onStartConnect: (nodeId: string) => void;
  onRunHealthCheck: (nodeId: string) => void;
  onRemoveService: (nodeId: string) => void;
}

export function NodeContextMenu({
  onViewDetail,
  onStartConnect,
  onRunHealthCheck,
  onRemoveService,
}: NodeContextMenuProps) {
  const { contextMenu, setContextMenu, setCatalogSidebarOpen } = useServiceMapStore();
  const { fitView } = useReactFlow();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenu(null);
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

  const nodeMenuItems = [
    { icon: Eye, label: '상세 보기', action: () => onViewDetail(contextMenu.nodeId!) },
    { icon: Link2, label: '연결 시작', action: () => onStartConnect(contextMenu.nodeId!) },
    { icon: Activity, label: '헬스체크 실행', action: () => onRunHealthCheck(contextMenu.nodeId!) },
    { icon: Trash2, label: '서비스 제거', action: () => onRemoveService(contextMenu.nodeId!), danger: true },
  ];

  const paneMenuItems = [
    { icon: Plus, label: '서비스 추가', action: () => setCatalogSidebarOpen(true) },
    { icon: Maximize2, label: '전체 보기', action: () => fitView({ padding: 0.3 }) },
  ];

  const items = isNodeMenu ? nodeMenuItems : paneMenuItems;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[160px] rounded-md border bg-popover p-1 shadow-md"
      style={{ left: contextMenu.x, top: contextMenu.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item) => (
        <button
          key={item.label}
          className={`
            flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm
            hover:bg-accent hover:text-accent-foreground
            ${'danger' in item && item.danger ? 'text-destructive hover:text-destructive' : ''}
          `}
          onClick={() => {
            item.action();
            setContextMenu(null);
          }}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </button>
      ))}
    </div>
  );
}
