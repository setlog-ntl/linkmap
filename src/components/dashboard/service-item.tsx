'use client';

import { memo } from 'react';
import { ExternalLink } from 'lucide-react';
import { IconTooltip } from '@/components/ui/icon-tooltip';
import { cn } from '@/lib/utils';
import { ServiceIcon } from '@/components/ui/service-icon';
import { ServiceTooltip } from '@/components/ui/service-tooltip';
import { getServiceDescription } from '@/lib/constants/service-descriptions';
import { allCategoryLabels } from '@/lib/constants/service-filters';
import type { ServiceCardData, ServiceCategory } from '@/types';

interface ServiceItemProps {
  card: ServiceCardData;
  projectId: string;
}

const STATUS_DOT: Record<string, string> = {
  connected: 'bg-green-500',
  error: 'bg-red-500',
  in_progress: 'bg-yellow-500',
  not_started: 'bg-muted-foreground/50',
};

export const ServiceItem = memo(function ServiceItem({ card }: ServiceItemProps) {
  const dotClass = STATUS_DOT[card.status] ?? 'bg-muted-foreground/50';
  const envPercent = card.envTotal > 0 ? Math.round((card.envFilled / card.envTotal) * 100) : 0;

  return (
    <div
      data-service-id={card.serviceId}
      className="group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-muted/50"
    >
      {/* Service brand icon */}
      <ServiceTooltip
        serviceName={card.name}
        category={allCategoryLabels[card.category as ServiceCategory]}
        description={getServiceDescription(card.slug)}
      >
        <ServiceIcon serviceId={card.slug} size={16} className="shrink-0" />
      </ServiceTooltip>

      {/* Status dot */}
      <span className={cn('h-2 w-2 shrink-0 rounded-full', dotClass)} />

      {/* Name */}
      <span className="flex-1 truncate text-xs font-medium">{card.name}</span>

      {/* Env progress */}
      {card.envTotal > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${envPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">{card.envFilled}/{card.envTotal}</span>
        </div>
      )}

      {/* External link */}
      {card.websiteUrl && (
        <IconTooltip label="외부 링크">
          <a
            href={card.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground" />
          </a>
        </IconTooltip>
      )}
    </div>
  );
});
