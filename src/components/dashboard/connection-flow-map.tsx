'use client';

import { useMemo } from 'react';
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

export function ConnectionFlowMap({ allCards, connections }: ConnectionFlowMapProps) {
  const layers = useMemo(() => groupConnectionsByLayer(allCards), [allCards]);

  if (allCards.length === 0) return null;

  // Layout: Frontend (left) → Project (center) → Backend (right), DevTools below
  const frontendServices = layers.find((l) => l.layer === 'frontend')?.services ?? [];
  const backendServices = layers.find((l) => l.layer === 'backend')?.services ?? [];
  const devtoolsServices = layers.find((l) => l.layer === 'devtools')?.services ?? [];

  // Calculate SVG dimensions
  const width = 900;
  const height = 160;
  const centerX = width / 2;
  const centerY = height / 2;

  const frontendX = 100;
  const backendX = width - 100;
  const devtoolsY = height - 20;

  return (
    <div className="rounded-2xl border bg-card/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm p-4 overflow-x-auto">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">연결 플로우</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[140px]" preserveAspectRatio="xMidYMid meet">
        {/* Central project node */}
        <rect x={centerX - 40} y={centerY - 18} width={80} height={36} rx={10} className="fill-primary/10 stroke-primary/40" strokeWidth={1.5} />
        <text x={centerX} y={centerY + 4} textAnchor="middle" className="text-[11px] font-semibold fill-foreground">Project</text>

        {/* Frontend services */}
        {frontendServices.slice(0, 5).map((svc, i) => {
          const count = Math.min(frontendServices.length, 5);
          const spacing = Math.min(28, (height - 40) / count);
          const y = centerY - ((count - 1) * spacing) / 2 + i * spacing;
          const conn = connections.find(
            (c) => c.source_service_id === svc.serviceId || c.target_service_id === svc.serviceId
          );
          const color = conn ? STATUS_COLORS[conn.connection_status] ?? '#71717a' : '#71717a';

          return (
            <g key={svc.projectServiceId}>
              {/* Connection line */}
              <path
                d={`M${frontendX + 40},${y} C${frontendX + 80},${y} ${centerX - 80},${centerY} ${centerX - 40},${centerY}`}
                fill="none" stroke={color} strokeWidth={1.2} strokeDasharray={conn ? '' : '4 3'} opacity={0.5}
              />
              {/* Service pill */}
              <rect x={frontendX - 40} y={y - 12} width={80} height={24} rx={6}
                fill="currentColor" className="text-green-500/8 dark:text-green-500/10"
                stroke={color} strokeWidth={1}
              />
              <circle cx={frontendX - 26} cy={y} r={3} fill={svc.status === 'connected' ? '#22c55e' : svc.status === 'error' ? '#ef4444' : '#71717a'} />
              <text x={frontendX + 2} y={y + 3.5} textAnchor="middle" className="text-[9px] fill-foreground">{svc.name.slice(0, 10)}</text>
            </g>
          );
        })}

        {/* Backend services */}
        {backendServices.slice(0, 5).map((svc, i) => {
          const count = Math.min(backendServices.length, 5);
          const spacing = Math.min(28, (height - 40) / count);
          const y = centerY - ((count - 1) * spacing) / 2 + i * spacing;
          const conn = connections.find(
            (c) => c.source_service_id === svc.serviceId || c.target_service_id === svc.serviceId
          );
          const color = conn ? STATUS_COLORS[conn.connection_status] ?? '#71717a' : '#71717a';

          return (
            <g key={svc.projectServiceId}>
              <path
                d={`M${centerX + 40},${centerY} C${centerX + 80},${centerY} ${backendX - 80},${y} ${backendX - 40},${y}`}
                fill="none" stroke={color} strokeWidth={1.2} strokeDasharray={conn ? '' : '4 3'} opacity={0.5}
              />
              <rect x={backendX - 40} y={y - 12} width={80} height={24} rx={6}
                fill="currentColor" className="text-blue-500/8 dark:text-blue-500/10"
                stroke={color} strokeWidth={1}
              />
              <circle cx={backendX - 26} cy={y} r={3} fill={svc.status === 'connected' ? '#22c55e' : svc.status === 'error' ? '#ef4444' : '#71717a'} />
              <text x={backendX + 2} y={y + 3.5} textAnchor="middle" className="text-[9px] fill-foreground">{svc.name.slice(0, 10)}</text>
            </g>
          );
        })}

        {/* DevTools services (bottom) */}
        {devtoolsServices.slice(0, 4).map((svc, i) => {
          const count = Math.min(devtoolsServices.length, 4);
          const spacing = 120;
          const x = centerX - ((count - 1) * spacing) / 2 + i * spacing;
          return (
            <g key={svc.projectServiceId}>
              <path
                d={`M${centerX},${centerY + 18} L${x},${devtoolsY - 12}`}
                fill="none" stroke="#71717a" strokeWidth={1} strokeDasharray="4 3" opacity={0.3}
              />
              <rect x={x - 35} y={devtoolsY - 12} width={70} height={22} rx={5}
                fill="currentColor" className="text-orange-500/8 dark:text-orange-500/10"
                stroke="#fb923c" strokeWidth={0.8} opacity={0.6}
              />
              <text x={x} y={devtoolsY + 2} textAnchor="middle" className="text-[9px] fill-muted-foreground">{svc.name.slice(0, 9)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
