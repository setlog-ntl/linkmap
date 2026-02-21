'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Monitor, Server, Wrench, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ServiceIcon } from '@/components/ui/service-icon';
import { groupConnectionsByLayer } from './utils/dashboard-transforms';
import type { ServiceCardData, UserConnection } from '@/types';

interface ConnectionFlowMapProps {
  allCards: ServiceCardData[];
  connections: UserConnection[];
  projectId: string;
  onServiceClick?: (projectServiceId: string, serviceId: string) => void;
}

const STATUS_DOT: Record<string, string> = {
  connected: 'bg-emerald-500',
  error: 'bg-red-500',
  in_progress: 'bg-amber-500',
  not_started: 'bg-zinc-400 dark:bg-zinc-600',
};

const LAYER_CFG = {
  frontend: {
    icon: Monitor,
    label: 'Frontend',
    textCls: 'text-emerald-600 dark:text-emerald-400',
    badgeCls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  backend: {
    icon: Server,
    label: 'Backend',
    textCls: 'text-blue-600 dark:text-blue-400',
    badgeCls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  devtools: {
    icon: Wrench,
    label: 'DevTools',
    textCls: 'text-orange-600 dark:text-orange-400',
    badgeCls: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  },
} as const;

type LayerKey = keyof typeof LAYER_CFG;

/* ---- Sub-components ---- */

function FlowPill({ svc, onClick }: { svc: ServiceCardData; onClick?: () => void }) {
  const dotCls = STATUS_DOT[svc.status] ?? 'bg-zinc-400';
  const envPct = svc.envTotal > 0 ? Math.round((svc.envFilled / svc.envTotal) * 100) : null;

  return (
    <div className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-accent/50 dark:hover:bg-white/[0.04] ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <ServiceIcon serviceId={svc.slug} size={16} className="shrink-0 opacity-80" />
      <span className="text-[13px] font-medium truncate flex-1">{svc.name}</span>
      {envPct !== null && (
        <div className="w-8 h-1 rounded-full bg-muted overflow-hidden shrink-0">
          <div
            className="h-full rounded-full bg-primary/60 transition-all"
            style={{ width: `${envPct}%` }}
          />
        </div>
      )}
      <span className={cn('h-2 w-2 rounded-full shrink-0', dotCls)} />
    </div>
  );
}

function LayerSection({
  services,
  layerKey,
  onServiceClick,
}: {
  services: ServiceCardData[];
  layerKey: LayerKey;
  onServiceClick?: (projectServiceId: string, serviceId: string) => void;
}) {
  const cfg = LAYER_CFG[layerKey];
  const Icon = cfg.icon;
  const visible = services.slice(0, 8);
  const overflow = services.length - visible.length;

  return (
    <div className="flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <Icon className={cn('h-3.5 w-3.5 shrink-0', cfg.textCls)} />
        <span className={cn('text-[11px] font-semibold uppercase tracking-wider', cfg.textCls)}>
          {cfg.label}
        </span>
        {services.length > 0 && (
          <span className={cn('text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ml-auto', cfg.badgeCls)}>
            {services.length}
          </span>
        )}
      </div>

      {/* Services */}
      {services.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-muted-foreground/15 py-8">
          <span className="text-[11px] text-muted-foreground/50">서비스 없음</span>
        </div>
      ) : (
        <div className="space-y-0.5 rounded-xl bg-muted/30 dark:bg-white/[0.02] p-1.5 border border-border/40">
          {visible.map((svc) => (
            <FlowPill key={svc.projectServiceId} svc={svc} onClick={onServiceClick ? () => onServiceClick(svc.projectServiceId, svc.serviceId) : undefined} />
          ))}
          {overflow > 0 && (
            <p className="text-[11px] text-muted-foreground/50 text-center py-1">
              +{overflow} more
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function FlowArrow({ direction = 'right' }: { direction?: 'right' | 'down' }) {
  if (direction === 'down') {
    return (
      <div className="flex flex-col items-center py-1">
        <div className="w-px h-4 bg-gradient-to-b from-border/40 to-border/20" />
        <ChevronRight className="h-3 w-3 text-muted-foreground/30 rotate-90" />
      </div>
    );
  }

  return (
    <div className="flex items-center px-1 self-center mt-8">
      <div className="h-px w-3 bg-border/40" />
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30" />
    </div>
  );
}

/* ---- Main ---- */

export function ConnectionFlowMap({
  allCards,
  connections,
  projectId,
  onServiceClick,
}: ConnectionFlowMapProps) {
  const layers = useMemo(() => groupConnectionsByLayer(allCards), [allCards]);

  if (allCards.length === 0) return null;

  const fe = layers.find((l) => l.layer === 'frontend')?.services ?? [];
  const be = layers.find((l) => l.layer === 'backend')?.services ?? [];
  const dt = layers.find((l) => l.layer === 'devtools')?.services ?? [];

  const connectedCount = useMemo(() => {
    const ids = new Set<string>();
    for (const c of connections) {
      ids.add(c.source_service_id);
      ids.add(c.target_service_id);
    }
    return ids.size;
  }, [connections]);

  return (
    <div className="rounded-2xl border bg-card/60 dark:bg-zinc-900/40 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/40">
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
          Architecture Flow
        </h3>
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          {[
            { label: '연결됨', cls: 'bg-emerald-500' },
            { label: '대기중', cls: 'bg-amber-500' },
            { label: '오류', cls: 'bg-red-500' },
            { label: '미연결', cls: 'bg-zinc-500' },
          ].map((s) => (
            <span key={s.label} className="flex items-center gap-1.5">
              <span className={cn('h-1.5 w-1.5 rounded-full', s.cls)} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Flow body */}
      <div className="p-5">
        {/* Desktop: 5-column pipeline grid */}
        <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_1fr] gap-0">
          <LayerSection services={fe} layerKey="frontend" onServiceClick={onServiceClick} />
          <FlowArrow />

          {/* Hub center */}
          <div className="flex flex-col items-center self-center px-3 min-w-[120px]">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-primary/8 blur-xl scale-150" />
              <div className="relative rounded-2xl border-2 border-primary/15 bg-card dark:bg-zinc-800/80 px-5 py-3.5 text-center shadow-sm">
                <p className="text-[13px] font-bold">Project</p>
                <p className="text-[10px] text-muted-foreground">Hub</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono tabular-nums">
                  {connectedCount}/{allCards.length}
                </p>
              </div>
            </div>
          </div>

          <FlowArrow />
          <LayerSection services={be} layerKey="backend" onServiceClick={onServiceClick} />
        </div>

        {/* DevTools below hub (desktop) */}
        {dt.length > 0 && (
          <div className="hidden md:flex flex-col items-center mt-1">
            <FlowArrow direction="down" />
            <div className="w-full max-w-xs">
              <LayerSection services={dt} layerKey="devtools" onServiceClick={onServiceClick} />
            </div>
          </div>
        )}

        {/* Mobile: stacked vertically */}
        <div className="md:hidden space-y-3">
          <LayerSection services={fe} layerKey="frontend" onServiceClick={onServiceClick} />
          {fe.length > 0 && (be.length > 0 || dt.length > 0) && (
            <FlowArrow direction="down" />
          )}
          {be.length > 0 && <LayerSection services={be} layerKey="backend" onServiceClick={onServiceClick} />}
          {be.length > 0 && dt.length > 0 && <FlowArrow direction="down" />}
          {dt.length > 0 && <LayerSection services={dt} layerKey="devtools" onServiceClick={onServiceClick} />}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex justify-center pb-4">
        <Link
          href={`/project/${projectId}/integrations`}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          서비스 추가
        </Link>
      </div>
    </div>
  );
}
