'use client';

import { memo, useCallback } from 'react';
import { Link2, Eye, Trash2 } from 'lucide-react';
import { useServiceMapStore } from '@/stores/service-map-store';
import { ZONE_COLOR_PALETTE } from '@/lib/layout/zone-layout';
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
      className="absolute z-30 flex items-center gap-1 bg-card/95 backdrop-blur-sm border rounded-xl shadow-lg px-2 py-1.5 pointer-events-auto"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-14px)',
      }}
    >
      {/* Zone quick-switch buttons */}
      <div className="flex items-center gap-0.5 bg-muted/50 rounded-lg p-0.5">
        {zones.map((z) => {
          const hex = getZoneHex(z);
          const isActive = currentZoneKey === z.key;
          return (
            <button
              key={z.key}
              className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'shadow-sm scale-105'
                  : 'opacity-50 hover:opacity-90'
              }`}
              style={{
                backgroundColor: isActive ? `${hex}30` : `${hex}10`,
                color: hex,
                boxShadow: isActive ? `0 0 0 1.5px ${hex}50` : undefined,
              }}
              onClick={() => handleZoneClick(z.key)}
              title={`${z.label}(으)로 이동`}
            >
              {z.label.slice(0, 3)}
            </button>
          );
        })}
      </div>

      <div className="w-px h-5 bg-border mx-0.5" />

      {/* Quick actions */}
      <button
        className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors group"
        onClick={() => onStartConnect(nodeId)}
        title="연결 시작"
      >
        <Link2 className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
      </button>
      <button
        className="p-1.5 rounded-lg hover:bg-accent transition-colors"
        onClick={() => onViewDetail(nodeId)}
        title="상세 보기"
      >
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      <button
        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
        onClick={() => onRemoveService(nodeId)}
        title="서비스 제거"
      >
        <Trash2 className="h-3.5 w-3.5 text-destructive" />
      </button>
    </div>
  );
}

export const NodeEditToolbar = memo(NodeEditToolbarInner);
