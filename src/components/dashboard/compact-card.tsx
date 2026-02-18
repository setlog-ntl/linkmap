'use client';

import { memo } from 'react';
import { ExternalLink, Copy, FileText, Settings, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/stores/dashboard-store';
import type { ServiceCardData } from '@/types';

interface CompactCardProps {
  card: ServiceCardData;
  projectId?: string;
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

export const CompactCard = memo(function CompactCard({ card, projectId }: CompactCardProps) {
  const dotClass = STATUS_DOT[card.status] ?? 'bg-yellow-500';
  const borderClass = STATUS_BORDER[card.status] ?? 'border-border';

  const expandedCardId = useDashboardStore((s) => s.expandedCardId);
  const toggleCard = useDashboardStore((s) => s.toggleCard);
  const isExpanded = expandedCardId === card.projectServiceId;

  return (
    <div
      data-service-id={card.serviceId}
      role="article"
      aria-label={`${card.name} - ${STATUS_LABEL[card.status] ?? card.status}`}
      className={cn(
        'group relative rounded-md border transition-all',
        card.status === 'connected' ? 'border-primary' : borderClass,
        isExpanded ? 'shadow-md' : 'hover:shadow-sm hover:scale-[1.02]'
      )}
    >
      {/* Header row (clickable) */}
      <button
        type="button"
        onClick={() => toggleCard(card.projectServiceId)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCard(card.projectServiceId);
          }
        }}
        aria-expanded={isExpanded}
        aria-label={`${card.name} ${isExpanded ? '접기' : '펼치기'}`}
        className="flex w-full items-center gap-2.5 p-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-md"
      >
        {/* Status dot */}
        <span
          className={cn('h-2.5 w-2.5 shrink-0 rounded-full', dotClass)}
          aria-label={STATUS_LABEL[card.status] ?? card.status}
        />

        {/* Name + env progress */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-mono font-bold leading-tight">{card.name}</p>
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
          aria-hidden="true"
        />
      </button>

      {/* External link (hover) */}
      {card.websiteUrl && !isExpanded && (
        <a
          href={card.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-8 top-2.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          onClick={(e) => e.stopPropagation()}
          aria-label={`${card.name} 외부 링크`}
          tabIndex={-1}
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
                  <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} aria-hidden="true" />
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
                  <div
                    className="h-1.5 w-full rounded-full bg-muted"
                    role="progressbar"
                    aria-valuenow={card.envFilled}
                    aria-valuemin={0}
                    aria-valuemax={card.envTotal}
                    aria-label="환경변수 진행률"
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.round((card.envFilled / card.envTotal) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div className="flex gap-1.5 pt-1" role="group" aria-label="빠른 작업">
                {card.websiteUrl && (
                  <a
                    href={card.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FileText className="h-3 w-3" aria-hidden="true" />
                    문서
                  </a>
                )}
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(card.slug);
                  }}
                  aria-label={`${card.slug} 복사`}
                >
                  <Copy className="h-3 w-3" aria-hidden="true" />
                  복사
                </button>
                {projectId && (
                  <a
                    href={`/project/${projectId}/env?service=${card.serviceId}`}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Settings className="h-3 w-3" aria-hidden="true" />
                    설정
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
