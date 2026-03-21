'use client';

import { memo, useCallback } from 'react';
import { Link2, Eye, Trash2 } from 'lucide-react';
import { useServiceMapStore } from '@/stores/service-map-store';
import { DEFAULT_ZONES, ZONE_COLOR_PALETTE } from '@/lib/layout/zone-layout';
import type { ZoneConfig } from '@/lib/layout/zone-layout';

const ZONE_HEX: Record<string, string> = {
  frontend: '#3b82f6',
  backend: '#8b5cf6',
  devtools: '#eab308',
};

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
  currentZoneKey,
  position,
  onStartConnect,
  onViewDetail,
  onRemoveService,
}: NodeEditToolbarProps) {
  const setPendingOverride = useServiceMapStore((s) => s.setPendingOverride);
  const getActiveZones = useServiceMapStore((s) => s.getActiveZones);
  const zones = getActiveZones();

  const handleZoneClick = useCallback((zoneKey: string) => {
    if (zoneKey !== currentZoneKey) {
      setPendingOverride(nodeId, zoneKey);
    }
  }, [nodeId, currentZoneKey, setPendingOverride]);

  const getZoneHex = (z: ZoneConfig) => {
    return ZONE_HEX[z.key] || ZONE_COLOR_PALETTE.find((c) => c.color === z.color)?.hex || '#94a3b8';
  };

  return (
    <div
      className="absolute z-30 flex items-center gap-1 bg-card/95 backdrop-blur-sm border rounded-lg shadow-lg px-1.5 py-1 pointer-events-auto"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-12px)',
      }}
    >
      {/* Zone quick-switch buttons */}
      {zones.map((z) => {
        const hex = getZoneHex(z);
        const isActive = currentZoneKey === z.key;
        return (
          <button
            key={z.key}
            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${
              isActive ? 'ring-1 ring-offset-1 scale-105' : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              backgroundColor: `${hex}20`,
              color: hex,
              boxShadow: isActive ? `0 0 0 2px ${hex}40` : undefined,
            }}
            onClick={() => handleZoneClick(z.key)}
            title={`${z.label}(으)로 이동`}
          >
            {z.label.slice(0, 3)}
          </button>
        );
      })}

      <div className="w-px h-4 bg-border mx-0.5" />

      {/* Quick actions */}
      <button
        className="p-1 rounded hover:bg-accent transition-colors"
        onClick={() => onStartConnect(nodeId)}
        title="연결 시작"
      >
        <Link2 className="h-3.5 w-3.5 text-primary" />
      </button>
      <button
        className="p-1 rounded hover:bg-accent transition-colors"
        onClick={() => onViewDetail(nodeId)}
        title="상세 보기"
      >
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      <button
        className="p-1 rounded hover:bg-destructive/10 transition-colors"
        onClick={() => onRemoveService(nodeId)}
        title="서비스 제거"
      >
        <Trash2 className="h-3.5 w-3.5 text-destructive" />
      </button>
    </div>
  );
}

export const NodeEditToolbar = memo(NodeEditToolbarInner);
