'use client';

import { memo, useMemo } from 'react';
import { Link2, Trash2, X } from 'lucide-react';
import { useServiceMapStore, type ZoneConnection } from '@/stores/service-map-store';

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

  const TYPE_LABELS: Record<string, string> = {
    uses: '사용',
    api_call: 'API 호출',
    data_transfer: '데이터 전달',
    integrates: '연동',
    auth_provider: '인증 제공',
    webhook: '웹훅',
    sdk: 'SDK',
  };

  return (
    <div
      className="absolute z-30 bg-card/95 backdrop-blur-sm border rounded-lg shadow-lg pointer-events-auto min-w-[200px]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-12px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b">
        <span className="text-xs font-bold text-primary">{zoneLabel}</span>
        <span className="text-[9px] text-muted-foreground">Zone 연결</span>
        <div className="flex-1" />
        <button
          className="p-1 rounded hover:bg-accent transition-colors"
          onClick={() => onStartConnect(zoneId)}
          title="연결 시작"
        >
          <Link2 className="h-3.5 w-3.5 text-primary" />
        </button>
      </div>

      {/* Connection list */}
      {relatedConnections.length > 0 ? (
        <div className="px-2 py-1 max-h-[160px] overflow-auto">
          {relatedConnections.map((conn) => {
            const isSource = conn.source === zoneId;
            const otherLabel = resolveLabel(isSource ? conn.target : conn.source);
            return (
              <div key={conn.id} className="flex items-center gap-1.5 py-1 text-[10px] group">
                <span className="text-muted-foreground">{isSource ? '→' : '←'}</span>
                <span className="font-medium truncate flex-1">{otherLabel}</span>
                <span className="text-muted-foreground text-[9px]">
                  {TYPE_LABELS[conn.connectionType] || conn.connectionType}
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
        <div className="px-3 py-2 text-[10px] text-muted-foreground">
          연결 없음 — 핸들을 드래그하여 연결하세요
        </div>
      )}
    </div>
  );
}

export const ZoneEditToolbar = memo(ZoneEditToolbarInner);
