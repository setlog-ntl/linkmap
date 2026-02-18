'use client';

import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategoryStyle } from '@/lib/constants/category-styles';
import { ServiceIcon } from '@/components/landing/service-icon';
import type { ServiceCardData } from '@/types';

interface CompactCardProps {
  card: ServiceCardData;
}

const STATUS_DOT: Record<string, string> = {
  connected: 'bg-green-500',
  error: 'bg-red-500',
  in_progress: 'bg-yellow-500',
  not_started: 'bg-yellow-500',
};

const STATUS_BORDER: Record<string, string> = {
  connected: 'border-border',
  error: 'border-red-400 dark:border-red-600',
  in_progress: 'border-dashed border-border',
  not_started: 'border-dashed border-border',
};

export function CompactCard({ card }: CompactCardProps) {
  const style = getCategoryStyle(card.category);
  const dotClass = STATUS_DOT[card.status] ?? 'bg-yellow-500';
  const borderClass = STATUS_BORDER[card.status] ?? 'border-border';

  return (
    <div
      className={cn(
        'group relative flex items-center gap-2.5 rounded-lg border p-2.5 transition-all hover:shadow-sm hover:scale-[1.02]',
        borderClass
      )}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
        style={{ backgroundColor: style.hexColor }}
      />

      {/* Status dot */}
      <span className={cn('ml-1.5 h-2 w-2 shrink-0 rounded-full', dotClass)} />

      {/* Service icon */}
      <ServiceIcon serviceId={card.slug} size={18} />

      {/* Name + env progress */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-tight">{card.name}</p>
        {card.envTotal > 0 && (
          <p className="text-[11px] text-muted-foreground">
            env: {card.envFilled}/{card.envTotal}
          </p>
        )}
      </div>

      {/* External link */}
      {card.websiteUrl && (
        <a
          href={card.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
        </a>
      )}
    </div>
  );
}
