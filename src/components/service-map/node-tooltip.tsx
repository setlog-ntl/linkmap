'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { HealthCheck, ServiceCategory, HealthCheckStatus } from '@/types';
import { allCategoryLabels } from '@/lib/constants/service-filters';

interface NodeTooltipProps {
  children: React.ReactNode;
  label: string;
  category: ServiceCategory;
  status: string;
  costEstimate?: string;
  healthCheck?: HealthCheck;
  envVarCount?: number;
  requiredEnvVarCount?: number;
}

const statusLabels: Record<string, string> = {
  connected: '연결됨',
  in_progress: '진행 중',
  not_started: '시작 전',
  error: '오류',
};

const healthLabels: Record<HealthCheckStatus, string> = {
  healthy: '정상',
  degraded: '저하',
  unhealthy: '비정상',
  unknown: '미확인',
};

const healthDots: Record<HealthCheckStatus, string> = {
  healthy: 'bg-green-500',
  degraded: 'bg-yellow-500',
  unhealthy: 'bg-red-500',
  unknown: 'bg-gray-400',
};

export function NodeTooltip({
  children,
  label,
  category,
  status,
  costEstimate,
  healthCheck,
  envVarCount,
  requiredEnvVarCount,
}: NodeTooltipProps) {
  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[220px] space-y-1.5 p-3">
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">
          {allCategoryLabels[category] || category}
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">설정 상태</span>
            <span>{statusLabels[status] || status}</span>
          </div>
          {healthCheck && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">헬스</span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${healthDots[healthCheck.status]}`} />
                {healthLabels[healthCheck.status]}
                {healthCheck.response_time_ms != null && (
                  <span className="text-muted-foreground ml-1">
                    {healthCheck.response_time_ms}ms
                  </span>
                )}
              </span>
            </div>
          )}
          {costEstimate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">예상 비용</span>
              <span>{costEstimate}</span>
            </div>
          )}
          {(envVarCount != null && envVarCount > 0 || requiredEnvVarCount != null && requiredEnvVarCount > 0) && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">환경변수</span>
              <span>
                {envVarCount || 0}{requiredEnvVarCount ? `/${requiredEnvVarCount}` : ''}개 설정됨
              </span>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
