'use client';

import { ExternalLink, Copy, FileText, Settings, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getCategoryStyle } from '@/lib/constants/category-styles';
import { ServiceIcon } from '@/components/landing/service-icon';
import { useDashboardStore } from '@/stores/dashboard-store';
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

const STATUS_LABEL: Record<string, string> = {
  connected: '연결됨',
  error: '오류',
  in_progress: '진행 중',
  not_started: '미시작',
};

export function CompactCard({ card }: CompactCardProps) {
  const style = getCategoryStyle(card.category);
  const dotClass = STATUS_DOT[card.status] ?? 'bg-yellow-500';
  const borderClass = STATUS_BORDER[card.status] ?? 'border-border';

  const expandedCardId = useDashboardStore((s) => s.expandedCardId);
  const toggleCard = useDashboardStore((s) => s.toggleCard);
  const isExpanded = expandedCardId === card.projectServiceId;

  return (
    <div
      data-service-id={card.serviceId}
      className={cn(
        'group relative rounded-lg border transition-all',
        borderClass,
        isExpanded ? 'shadow-md' : 'hover:shadow-sm hover:scale-[1.02]'
      )}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
        style={{ backgroundColor: style.hexColor }}
      />

      {/* Header row (clickable) */}
      <button
        type="button"
        onClick={() => toggleCard(card.projectServiceId)}
        className="flex w-full items-center gap-2.5 p-2.5 text-left"
      >
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

        {/* Expand indicator */}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* External link (hover) */}
      {card.websiteUrl && !isExpanded && (
        <a
          href={card.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-8 top-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
        </a>
      )}

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t px-3 pb-3 pt-2 space-y-2.5">
              {/* Status + category */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">상태</span>
                <span className={cn('flex items-center gap-1.5 font-medium', dotClass.replace('bg-', 'text-'))}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} />
                  {STATUS_LABEL[card.status] ?? card.status}
                </span>
              </div>

              {/* Env progress bar */}
              {card.envTotal > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">환경변수</span>
                    <span className="font-medium">{card.envFilled}/{card.envTotal}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.round((card.envFilled / card.envTotal) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div className="flex gap-1.5 pt-1">
                {card.websiteUrl && (
                  <a
                    href={card.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FileText className="h-3 w-3" />
                    문서
                  </a>
                )}
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(card.slug);
                  }}
                >
                  <Copy className="h-3 w-3" />
                  복사
                </button>
                <a
                  href={`/project/${card.projectServiceId.split('-')[0]}/../env?service=${card.serviceId}`}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Settings className="h-3 w-3" />
                  설정
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
