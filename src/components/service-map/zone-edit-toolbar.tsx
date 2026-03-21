'use client';

import { memo, useMemo } from 'react';
import { Link2, X } from 'lucide-react';
import { useServiceMapStore } from '@/stores/service-map-store';

interface ZoneEditToolbarProps {
  zoneId: string;            // e.g. "zone-frontend"
  zoneLabel: string;
  position: { x: number; y: number };
  onStartConnect: (nodeId: string) => void;
}

function ZoneEditToolbarInner({
  zoneId,
  zoneLabel,
  position,
  onStartConnect,
}: ZoneEditToolbarProps) {
  const zoneConnections = useServiceMapStore((s) => s.zoneConnections);
  const removeZoneConnection = useServiceMapStore((s) => s.removeZoneConnection);
  const getActiveZones = useServiceMapStore((s) => s.getActiveZones);
  const zones = getActiveZones();

  // Connections related to this zone
  const relatedConnections = useMemo(() => {
    return zoneConnections.filter((c) => c.source === zoneId || c.target === zoneId);
  }, [zoneConnections, zoneId]);

  const resolveLabel = (id: string) => {
    if (id.startsWith('zone-')) {
      const key = id.replace('zone-', '');
      return zones.find((z) => z.key === key)?.label || key.toUpperCase();
    }
    return id.slice(0, 8) + '...';
  };

  const TYPE_LABELS: Record<string, { label: string; color: string }> = {
    uses:          { label: '사용',       color: '#3b82f6' },
    api_call:      { label: 'API 호출',   color: '#8b5cf6' },
    data_transfer: { label: '데이터 전달', color: '#f97316' },
    integrates:    { label: '연동',       color: '#22c55e' },
    auth_provider: { label: '인증 제공',   color: '#ec4899' },
    webhook:       { label: '웹훅',       color: '#14b8a6' },
    sdk:           { label: 'SDK',        color: '#6366f1' },
  };

  return (
    <div
      className="absolute z-30 bg-card/95 backdrop-blur-sm border rounded-xl shadow-lg pointer-events-auto min-w-[220px]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-14px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b">
        <span className="text-xs font-bold text-primary">{zoneLabel}</span>
        <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">Zone</span>
        <div className="flex-1" />
        <button
          className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors group"
          onClick={() => onStartConnect(zoneId)}
          title="연결 시작"
        >
          <Link2 className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Connection list */}
      {relatedConnections.length > 0 ? (
        <div className="px-2 py-1.5 max-h-[180px] overflow-auto space-y-0.5">
          {relatedConnections.map((conn) => {
            const isSource = conn.source === zoneId;
            const otherLabel = resolveLabel(isSource ? conn.target : conn.source);
            const typeInfo = TYPE_LABELS[conn.connectionType] || { label: conn.connectionType, color: '#94a3b8' };
            return (
              <div key={conn.id} className="flex items-center gap-1.5 py-1 px-1 rounded-lg hover:bg-muted/50 text-[10px] group transition-colors">
                <span
                  className="text-[9px] font-bold w-3 text-center"
                  style={{ color: typeInfo.color }}
                >
                  {isSource ? '\u2192' : '\u2190'}
                </span>
                <span className="font-medium truncate flex-1">{otherLabel}</span>
                <span
                  className="text-[9px] px-1 py-0.5 rounded-full"
                  style={{ backgroundColor: `${typeInfo.color}15`, color: typeInfo.color }}
                >
                  {typeInfo.label}
                </span>
                <button
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/10 transition-all"
                  onClick={() => removeZoneConnection(conn.id)}
                  title="삭제"
                >
                  <X className="h-2.5 w-2.5 text-destructive" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-3 py-3 text-[10px] text-muted-foreground text-center">
          <div className="flex flex-col items-center gap-1">
            <Link2 className="h-4 w-4 opacity-30" />
            <span>핸들을 드래그하여 연결하세요</span>
          </div>
        </div>
      )}
    </div>
  );
}

export const ZoneEditToolbar = memo(ZoneEditToolbarInner);
