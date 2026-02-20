'use client';

import { Database, Rocket, TrendingUp, Brain, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceIcon } from '@/components/landing/service-icon';
import type { ViewGroup, ServiceCategory, ServiceStatus } from '@/types';
import type { ViewGroupMeta } from '@/lib/layout/view-group';

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  status: ServiceStatus;
}

interface GroupSummaryCardProps {
  meta: ViewGroupMeta;
  services: ServiceItem[];
  onClick?: (group: ViewGroup) => void;
}

const GROUP_ICONS: Record<ViewGroup, typeof Database> = {
  core: Database,
  runtime: Rocket,
  growth: TrendingUp,
  intelligence: Brain,
  infra: Server,
};

const STATUS_BADGE: Record<ServiceStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
  connected: { label: '정상', variant: 'default', className: 'bg-green-600 hover:bg-green-600/80 text-white' },
  in_progress: { label: '진행중', variant: 'secondary' },
  error: { label: '오류', variant: 'destructive' },
  not_started: { label: '미설정', variant: 'outline' },
};

export function GroupSummaryCard({ meta, services, onClick }: GroupSummaryCardProps) {
  const Icon = GROUP_ICONS[meta.key];

  return (
    <Card
      className={`${meta.bgColor} border ${meta.color} cursor-pointer hover:shadow-md transition-all rounded-2xl`}
      onClick={() => onClick?.(meta.key)}
    >
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="flex items-center gap-2 text-[13px] font-semibold">
          <Icon className="h-4 w-4 opacity-70" />
          {meta.label}
          <Badge variant="secondary" className="ml-auto text-[10px] font-mono">
            {services.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        {services.length === 0 ? (
          <p className="text-[11px] text-muted-foreground/60">서비스 없음</p>
        ) : (
          <div className="space-y-1">
            {services.map((svc) => {
              const badge = STATUS_BADGE[svc.status] ?? STATUS_BADGE.not_started;
              return (
                <div key={svc.id} className="flex items-center gap-2">
                  <ServiceIcon serviceId={svc.slug} size={14} />
                  <span className="text-[13px] truncate flex-1 min-w-0">{svc.name}</span>
                  <Badge variant={badge.variant} className={`text-[10px] h-5 px-1.5 ${badge.className ?? ''}`}>
                    {badge.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
