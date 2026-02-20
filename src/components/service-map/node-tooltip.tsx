'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { domainLabels } from '@/lib/constants/service-filters';
import type { ServiceDomain } from '@/types';

interface NodeTooltipProps {
  children: React.ReactNode;
  label: string;
  status: string;
  domain?: string;
}

const statusLabels: Record<string, string> = {
  connected: '연결됨',
  in_progress: '진행 중',
  not_started: '시작 전',
  error: '오류',
};

export function NodeTooltip({ children, label, status, domain }: NodeTooltipProps) {
  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[180px] space-y-1 p-2.5">
        <div className="font-medium text-sm">{label}</div>
        <div className="flex flex-col gap-0.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">상태</span>
            <span>{statusLabels[status] || status}</span>
          </div>
          {domain && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">도메인</span>
              <span>{domainLabels[domain as ServiceDomain] || domain}</span>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
