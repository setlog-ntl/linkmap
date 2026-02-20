'use client';

import { useMemo } from 'react';
import { ServiceIcon } from '@/components/ui/service-icon';
import { groupConnectionsByLayer } from './utils/dashboard-transforms';
import type { ServiceCardData, UserConnection, ConnectionStatus } from '@/types';

interface ConnectionFlowMapProps {
  allCards: ServiceCardData[];
  connections: UserConnection[];
}

const STATUS_COLORS: Record<ConnectionStatus, string> = {
  active: '#22c55e',
  inactive: '#71717a',
  error: '#ef4444',
  pending: '#eab308',
};

const STATUS_DOT_COLOR: Record<string, string> = {
  connected: '#22c55e',
  error: '#ef4444',
  in_progress: '#eab308',
  not_started: '#52525b',
};

const LAYER_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  frontend: { label: 'Frontend', color: '#10b981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.18)' },
  backend:  { label: 'Backend',  color: '#3b82f6', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.18)' },
  devtools: { label: 'DevTools', color: '#f97316', bg: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.18)' },
};

/* ---------- Sub-components ---------- */

function ServicePill({ svc }: { svc: ServiceCardData }) {
  const dotColor = STATUS_DOT_COLOR[svc.status] ?? '#52525b';
  const meta = LAYER_META[svc.dashboardLayer];

  return (
    <div
      data-service-id={svc.serviceId}
      className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200 hover:brightness-110 hover:shadow-lg cursor-default select-none"
      style={{
        background: meta?.bg ?? 'rgba(39,39,42,0.5)',
        border: `1px solid ${meta?.border ?? 'rgba(255,255,255,0.06)'}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <ServiceIcon serviceId={svc.slug} size={18} className="shrink-0" />
      <span className="text-[12px] font-semibold truncate max-w-[90px] text-foreground/90">{svc.name}</span>
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-background"
        style={{ backgroundColor: dotColor }}
      />
    </div>
  );
}

function LayerColumn({ services, layer }: { services: ServiceCardData[]; layer: string }) {
  const meta = LAYER_META[layer];
  if (!meta || services.length === 0) return null;
  const visible = services.slice(0, 6);
  const overflow = services.length - visible.length;

  return (
    <div className="flex flex-col items-stretch gap-1.5">
      {/* Layer label */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: meta.color }}
        />
        <span
          className="text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: meta.color }}
        >
          {meta.label}
        </span>
        <span className="text-[10px] text-muted-foreground font-mono">{services.length}</span>
      </div>
      {/* Pills */}
      {visible.map((svc) => (
        <ServicePill key={svc.projectServiceId} svc={svc} />
      ))}
      {overflow > 0 && (
        <span className="text-[10px] text-muted-foreground text-center mt-0.5">+{overflow} more</span>
      )}
    </div>
  );
}

/* ---------- Main component ---------- */

export function ConnectionFlowMap({ allCards, connections }: ConnectionFlowMapProps) {
  const layers = useMemo(() => groupConnectionsByLayer(allCards), [allCards]);

  if (allCards.length === 0) return null;

  const frontendServices = layers.find((l) => l.layer === 'frontend')?.services ?? [];
  const backendServices = layers.find((l) => l.layer === 'backend')?.services ?? [];
  const devtoolsServices = layers.find((l) => l.layer === 'devtools')?.services ?? [];

  // Build quick lookup for connection color per service
  const serviceConnColor = useMemo(() => {
    const map = new Map<string, string>();
    for (const card of allCards) {
      const conn = connections.find(
        (c) => c.source_service_id === card.serviceId || c.target_service_id === card.serviceId,
      );
      map.set(card.serviceId, conn ? STATUS_COLORS[conn.connection_status] ?? '#52525b' : '#52525b');
    }
    return map;
  }, [allCards, connections]);

  const hasConnected = (svc: ServiceCardData) =>
    connections.some(
      (c) => c.source_service_id === svc.serviceId || c.target_service_id === svc.serviceId,
    );

  /* ---- SVG geometry ---- */
  const svgW = 800;
  const maxSide = Math.max(frontendServices.length, backendServices.length, 1);
  const rowH = 44;
  const svgH = Math.max(180, maxSide * rowH + 60 + (devtoolsServices.length > 0 ? 60 : 0));
  const cx = svgW / 2;
  const cy = (maxSide * rowH + 60) / 2;
  const leftX = 170;
  const rightX = svgW - 170;

  const nodeY = (i: number, total: number) => {
    const n = Math.min(total, 6);
    return cy - ((n - 1) * rowH) / 2 + i * rowH;
  };

  return (
    <div
      className="rounded-2xl overflow-hidden dark:glass-panel bg-card/80 dark:bg-transparent border dark:border-white/[0.05] shadow-sm"
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-5 pt-4 pb-1">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.12em]">
          Connection Flow
        </h3>
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          {[
            { label: '연결됨', color: '#22c55e' },
            { label: '대기중', color: '#eab308' },
            { label: '오류', color: '#ef4444' },
            { label: '미연결', color: '#52525b' },
          ].map((s) => (
            <span key={s.label} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Flow body: 3-column layout with SVG underlay */}
      <div className="relative px-5 pb-5">
        {/* SVG lines */}
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            {/* Hub glow */}
            <radialGradient id="hub-glow-g" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="70%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </radialGradient>
            {/* Arrow markers */}
            {Object.entries(STATUS_COLORS).map(([s, c]) => (
              <marker key={s} id={`fa-${s}`} markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                <polygon points="0 0,7 2.5,0 5" fill={c} opacity="0.8" />
              </marker>
            ))}
            <marker id="fa-default" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
              <polygon points="0 0,7 2.5,0 5" fill="#52525b" opacity="0.5" />
            </marker>
          </defs>

          {/* Hub glow circle */}
          <circle cx={cx} cy={cy} r={60} fill="url(#hub-glow-g)" className="animate-hub-glow" />

          {/* Hub node */}
          <rect x={cx - 44} y={cy - 24} width={88} height={48} rx={14}
            fill="hsl(var(--primary))" fillOpacity="0.08"
            stroke="hsl(var(--primary))" strokeOpacity="0.35" strokeWidth="1.5"
          />
          <text x={cx} y={cy - 2} textAnchor="middle" className="text-[11px] font-bold fill-foreground">
            Project
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" className="text-[9px] fill-muted-foreground">
            Hub
          </text>

          {/* Frontend → Hub lines */}
          {frontendServices.slice(0, 6).map((svc, i) => {
            const y = nodeY(i, frontendServices.length);
            const color = serviceConnColor.get(svc.serviceId) ?? '#52525b';
            const connected = hasConnected(svc);
            const connStatus = connections.find(
              (c) => c.source_service_id === svc.serviceId || c.target_service_id === svc.serviceId,
            )?.connection_status;
            return (
              <g key={svc.projectServiceId}>
                <path
                  d={`M${leftX},${y} C${leftX + 80},${y} ${cx - 90},${cy} ${cx - 44},${cy}`}
                  fill="none" stroke={color}
                  strokeWidth={connected ? 1.8 : 1}
                  strokeDasharray={connected ? '' : '5 4'}
                  className={connected ? 'animate-flow-pulse' : ''}
                  strokeOpacity={connected ? 0.55 : 0.2}
                  markerEnd={`url(#fa-${connStatus ?? 'default'})`}
                />
              </g>
            );
          })}

          {/* Hub → Backend lines */}
          {backendServices.slice(0, 6).map((svc, i) => {
            const y = nodeY(i, backendServices.length);
            const color = serviceConnColor.get(svc.serviceId) ?? '#52525b';
            const connected = hasConnected(svc);
            const connStatus = connections.find(
              (c) => c.source_service_id === svc.serviceId || c.target_service_id === svc.serviceId,
            )?.connection_status;
            return (
              <g key={svc.projectServiceId}>
                <path
                  d={`M${cx + 44},${cy} C${cx + 90},${cy} ${rightX - 80},${y} ${rightX},${y}`}
                  fill="none" stroke={color}
                  strokeWidth={connected ? 1.8 : 1}
                  strokeDasharray={connected ? '' : '5 4'}
                  className={connected ? 'animate-flow-pulse' : ''}
                  strokeOpacity={connected ? 0.55 : 0.2}
                  markerEnd={`url(#fa-${connStatus ?? 'default'})`}
                />
              </g>
            );
          })}

          {/* Hub → DevTools lines */}
          {devtoolsServices.slice(0, 5).map((svc, idx) => {
            const count = Math.min(devtoolsServices.length, 5);
            const devSpacing = Math.min(160, (svgW - 300) / Math.max(count, 1));
            const x = cx - ((count - 1) * devSpacing) / 2 + idx * devSpacing;
            const devY = svgH - 28;
            return (
              <g key={svc.projectServiceId}>
                <path
                  d={`M${cx},${cy + 24} C${cx},${cy + 60} ${x},${devY - 30} ${x},${devY}`}
                  fill="none" stroke="#52525b"
                  strokeWidth={1} strokeDasharray="5 4" strokeOpacity={0.2}
                />
              </g>
            );
          })}
        </svg>

        {/* HTML 3-column grid over SVG */}
        <div className="relative grid grid-cols-[1fr_auto_1fr] gap-4 items-start" style={{ minHeight: svgH * 0.8 }}>
          {/* Left: Frontend */}
          <div className="pt-2">
            <LayerColumn services={frontendServices} layer="frontend" />
          </div>

          {/* Center: spacer for hub */}
          <div style={{ width: 120 }} />

          {/* Right: Backend */}
          <div className="pt-2">
            <LayerColumn services={backendServices} layer="backend" />
          </div>
        </div>

        {/* DevTools row below */}
        {devtoolsServices.length > 0 && (
          <div className="relative mt-3 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#f97316' }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: '#f97316' }}>
                DevTools
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">{devtoolsServices.length}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {devtoolsServices.slice(0, 5).map((svc) => (
                <ServicePill key={svc.projectServiceId} svc={svc} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
