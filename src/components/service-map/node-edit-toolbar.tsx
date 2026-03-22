'use client';

import { memo } from 'react';
import { Link2, Trash2 } from 'lucide-react';
import { IconTooltip } from '@/components/ui/icon-tooltip';

interface NodeEditToolbarProps {
  nodeId: string;
  currentZoneKey: string | null;
  position: { x: number; y: number };
  onStartConnect: (nodeId: string) => void;
  onViewDetail: (nodeId: string) => void;
  onRemoveService: (nodeId: string) => void;
}

function NodeEditToolbarInner({
  nodeId,
  position,
  onStartConnect,
  onRemoveService,
}: NodeEditToolbarProps) {
  return (
    <div
      className="absolute z-30 flex items-center gap-1 bg-card/95 backdrop-blur-sm border rounded-xl shadow-lg px-2 py-1.5 pointer-events-auto"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-14px)',
      }}
    >
      <IconTooltip label="연결 시작">
        <button
          className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors group"
          onClick={() => onStartConnect(nodeId)}
        >
          <Link2 className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
        </button>
      </IconTooltip>
      <IconTooltip label="서비스 제거">
        <button
          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
          onClick={() => onRemoveService(nodeId)}
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </button>
      </IconTooltip>
    </div>
  );
}

export const NodeEditToolbar = memo(NodeEditToolbarInner);
