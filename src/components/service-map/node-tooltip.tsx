'use client';

import { Crown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { domainLabels, allCategoryLabels } from '@/lib/constants/service-filters';
import type { ServiceDomain, ServiceCategory } from '@/types';

interface NodeTooltipProps {
  children: React.ReactNode;
  label: string;
  status: string;
  domain?: string;
  category?: string;
  isMainService?: boolean;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  connected:   { label: '연결됨',  color: 'text-green-500' },
  in_progress: { label: '진행 중', color: 'text-yellow-500' },
  not_started: { label: '시작 전', color: 'text-muted-foreground' },
  error:       { label: '오류',    color: 'text-red-500' },
};

export function NodeTooltip({ children, label, status, domain, category, isMainService }: NodeTooltipProps) {
  const statusInfo = statusLabels[status] || statusLabels.not_started;
  const categoryLabel = category ? allCategoryLabels[category as ServiceCategory] : undefined;
  const domainLabel = domain ? domainLabels[domain as ServiceDomain] : undefined;

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[220px] space-y-1.5 p-3">
        {/* Header */}
        <div className="flex items-center gap-1.5 font-semibold text-sm">
          {label}
          {isMainService && (
            <Crown className="h-3 w-3 text-amber-500" />
          )}
        </div>

        {/* Info rows */}
        <div className="flex flex-col gap-1 text-xs">
          {isMainService && (
            <span className="text-amber-500 font-medium text-[10px]">메인 서비스</span>
          )}

          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">상태</span>
            <span className={`font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
          </div>

          {categoryLabel && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">카테고리</span>
              <span>{categoryLabel}</span>
            </div>
          )}

          {domainLabel && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">도메인</span>
              <span>{domainLabel}</span>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
