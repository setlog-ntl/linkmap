'use client';

import { useMemo, useCallback, useState } from 'react';
import { Monitor, Server, Wrench, Box, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ServiceIcon } from '@/components/ui/service-icon';
import { HealthScoreRing } from '@/components/service-map/views/health-score-ring';
import { AlertsList } from '@/components/service-map/views/alerts-list';
import { computeHealthScore } from '@/lib/utils/health-score';
import { useServiceDetailStore } from '@/stores/service-detail-store';
import type { ServiceMapData } from '@/components/service-map/hooks/useServiceMapData';
import type { ServiceCategory, ServiceStatus, ServiceDomain } from '@/types';

// ── Zone grouping for status view ──────────────────────────

interface ZoneGroup {
  key: string;
  label: string;
  icon: typeof Monitor;
  color: string;
  bgColor: string;
  borderColor: string;
  domains: ServiceDomain[];
}

const ZONE_GROUPS: ZoneGroup[] = [
  {
    key: 'frontend',
    label: 'FRONTEND',
    icon: Monitor,
    color: '#3b82f6',
    bgColor: 'bg-blue-500/5 dark:bg-blue-950/20',
    borderColor: 'border-blue-500/20',
    domains: ['infrastructure', 'sns'],
  },
  {
    key: 'backend',
    label: 'BACKEND',
    icon: Server,
    color: '#8b5cf6',
    bgColor: 'bg-violet-500/5 dark:bg-violet-950/20',
    borderColor: 'border-violet-500/20',
    domains: ['backend'],
  },
  {
    key: 'devtools',
    label: 'DEVTOOLS',
    icon: Wrench,
    color: '#eab308',
    bgColor: 'bg-yellow-500/5 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-500/20',
    domains: ['devtools', 'observability'],
  },
  {
    key: 'etc',
    label: 'ETC',
    icon: Box,
    color: '#64748b',
    bgColor: 'bg-slate-500/5 dark:bg-slate-950/20',
    borderColor: 'border-slate-500/20',
    domains: ['communication', 'business', 'ai_ml', 'integration'],
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; className: string }> = {
  connected:   { label: '연결됨',  color: '#22c55e', className: 'bg-green-600 text-white' },
  in_progress: { label: '진행 중', color: '#f59e0b', className: 'bg-yellow-500 text-white' },
  error:       { label: '오류',    color: '#f97316', className: 'bg-orange-500 text-white' },
  not_started: { label: '시작 전', color: '#64748b', className: 'bg-muted text-muted-foreground' },
};

const CATEGORY_LABELS: Partial<Record<ServiceCategory, string>> = {
  auth: '인증', social_login: '소셜 로그인', database: '데이터베이스',
  deploy: '배포', email: '이메일', payment: '결제', storage: '스토리지',
  monitoring: '모니터링', ai: 'AI/ML', cdn: 'CDN', cicd: 'CI/CD',
  testing: '테스트', sms: 'SMS', push: '푸시', chat: '채팅',
  search: '검색', cms: 'CMS', analytics: '분석', media: '미디어',
  queue: '큐', cache: '캐시', logging: '로깅', feature_flags: '피처 플래그',
  scheduling: '스케줄링', ecommerce: '이커머스', serverless: '서버리스',
  code_quality: '코드 품질', automation: '자동화', domain: '도메인',
  advertising: '광고', other: '기타', sns: 'SNS',
};

interface ServiceItem {
  id: string;
  serviceId: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  status: ServiceStatus;
  domain: ServiceDomain | null;
}

interface StatusViewProps {
  data: ServiceMapData;
  projectId: string;
}

export function StatusView({ data, projectId }: StatusViewProps) {
  const openSheet = useServiceDetailStore((s) => s.openSheet);

  const handleServiceClick = useCallback((projectServiceId: string) => {
    const svc = data.services.find((s) => s.id === projectServiceId);
    if (!svc) return;
    const serviceNames: Record<string, string> = {};
    for (const s of data.services) serviceNames[s.service_id] = s.service?.name || 'Unknown';
    const deps = data.dependencies?.filter((d) => d.service_id === svc.service_id) ?? [];
    openSheet({ service: svc, dependencies: deps, serviceNames, projectId, envVars: data.envVars });
  }, [data.services, data.dependencies, data.envVars, projectId, openSheet]);

  const healthScore = useMemo(
    () => computeHealthScore(data.services, data.healthChecks, data.envVars),
    [data.services, data.healthChecks, data.envVars]
  );

  // Group services by zone
  const groupedServices = useMemo(() => {
    const allServices: ServiceItem[] = data.services.map((ps) => ({
      id: ps.id,
      serviceId: ps.service_id,
      name: ps.service?.name || 'Unknown',
      slug: ps.service?.slug || '',
      category: (ps.service?.category as ServiceCategory) || 'other',
      status: ps.status,
      domain: (ps.service?.domain as ServiceDomain) || null,
    }));

    const groups = new Map<string, ServiceItem[]>();
    for (const zone of ZONE_GROUPS) {
      groups.set(zone.key, []);
    }

    for (const svc of allServices) {
      let placed = false;
      for (const zone of ZONE_GROUPS) {
        if (svc.domain && zone.domains.includes(svc.domain)) {
          groups.get(zone.key)!.push(svc);
          placed = true;
          break;
        }
      }
      // Fallback: services with null domain or unmatched domain go to ETC
      if (!placed) {
        groups.get('etc')!.push(svc);
      }
    }

    return groups;
  }, [data.services]);

  // Status summary counts
  const statusCounts = useMemo(() => {
    const counts = { connected: 0, in_progress: 0, error: 0, not_started: 0 };
    for (const ps of data.services) {
      const status = ps.status as keyof typeof counts;
      if (status in counts) counts[status]++;
    }
    return counts;
  }, [data.services]);

  return (
    <div className="flex-1 w-full relative min-h-0 overflow-auto p-6 space-y-5">
      {/* Header — health score + status summary + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Health Score */}
        <div className="rounded-2xl border bg-card shadow-sm p-5">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            전체 건강도
          </h3>
          <HealthScoreRing score={healthScore} />
        </div>

        {/* Status Summary */}
        <div className="rounded-2xl border bg-card shadow-sm p-5">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            서비스 현황
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const count = statusCounts[key as keyof typeof statusCounts] ?? 0;
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="text-sm text-muted-foreground">{cfg.label}</span>
                  <span className="text-sm font-semibold ml-auto">{count}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">전체 서비스</span>
              <span className="font-bold text-lg">{data.services.length}</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="rounded-2xl border bg-card shadow-sm p-5">
          <AlertsList services={data.services} healthChecks={data.healthChecks} envVars={data.envVars} />
          {statusCounts.error === 0 && statusCounts.not_started === 0 && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">모든 서비스가 정상입니다</p>
          )}
        </div>
      </div>

      {/* Zone groups — 4 sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ZONE_GROUPS.map((zone) => {
          const services = groupedServices.get(zone.key) || [];
          return (
            <ZoneSection
              key={zone.key}
              zone={zone}
              services={services}
              onServiceClick={handleServiceClick}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Zone Section Component ──────────────────────────────────

interface ZoneSectionProps {
  zone: ZoneGroup;
  services: ServiceItem[];
  onServiceClick: (id: string) => void;
}

function ZoneSection({ zone, services, onServiceClick }: ZoneSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const Icon = zone.icon;

  const connectedCount = services.filter((s) => s.status === 'connected').length;
  const errorCount = services.filter((s) => s.status === 'error').length;

  return (
    <div className={`rounded-2xl border ${zone.borderColor} ${zone.bgColor} shadow-sm overflow-hidden`}>
      {/* Section header */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${zone.color}18` }}
        >
          <Icon className="h-4 w-4" style={{ color: zone.color }} />
        </div>
        <span className="text-sm font-bold tracking-wide" style={{ color: zone.color }}>
          {zone.label}
        </span>
        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-mono">
          {services.length}
        </Badge>

        {/* Status dots summary */}
        {services.length > 0 && (
          <div className="flex items-center gap-1.5 ml-auto mr-2">
            {connectedCount > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-green-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {connectedCount}
              </span>
            )}
            {errorCount > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-orange-500">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                {errorCount}
              </span>
            )}
          </div>
        )}

        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Service list */}
      {expanded && (
        <div className="px-2 pb-2">
          {services.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground/50">
              이 영역에 속한 서비스가 없습니다
            </div>
          ) : (
            <div className="space-y-0.5">
              {services.map((svc) => {
                const statusCfg = STATUS_CONFIG[svc.status] ?? STATUS_CONFIG.not_started;
                return (
                  <button
                    key={svc.id}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-accent/50 transition-colors text-left group"
                    onClick={() => onServiceClick(svc.id)}
                  >
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-lg bg-card border flex items-center justify-center flex-shrink-0">
                      <ServiceIcon serviceId={svc.slug} size={18} />
                    </div>

                    {/* Name + Category */}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{svc.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {CATEGORY_LABELS[svc.category] || svc.category}
                      </div>
                    </div>

                    {/* Status badge */}
                    <Badge
                      variant="secondary"
                      className={`text-[10px] h-5 px-1.5 flex-shrink-0 ${statusCfg.className}`}
                    >
                      {statusCfg.label}
                    </Badge>

                    {/* Detail arrow on hover */}
                    <ExternalLink className="h-3 w-3 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-colors flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
