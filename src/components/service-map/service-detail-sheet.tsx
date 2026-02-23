'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DifficultyBadge,
  FreeTierBadge,
  DxScoreBadge,
  CostEstimateBadge,
  VendorLockInBadge,
} from '@/components/service/service-badges';
import { HealthTimeline } from '@/components/project/health-timeline';
import { allCategoryLabels } from '@/lib/constants/service-filters';
import { domainLabels } from '@/lib/constants/service-filters';
import { useHealthChecks, useRunHealthCheck } from '@/lib/queries/health-checks';
import { ServiceAccountSection } from '@/components/service-map/service-account-section';
import { ServiceEnvVarsSection } from '@/components/service-map/service-env-vars-section';
import { ExternalLink, BookOpen, GitFork, Activity, Loader2, Settings, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { ProjectService, Service, ServiceDependency, ServiceCategory, ServiceDomain, EnvironmentVariable } from '@/types';

interface ServiceDetailSheetProps {
  service: (ProjectService & { service: Service }) | null;
  dependencies: ServiceDependency[];
  serviceNames: Record<string, string>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  envVars?: EnvironmentVariable[];
  loading?: boolean;
}

const statusLabels: Record<string, { label: string; className: string }> = {
  connected: { label: '연결됨', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  in_progress: { label: '진행 중', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
  not_started: { label: '시작 전', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300' },
  error: { label: '오류', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
};

const depTypeLabels: Record<string, string> = {
  required: '필수',
  recommended: '권장',
  optional: '선택',
  alternative: '대체',
};

export function ServiceDetailSheet({
  service,
  dependencies,
  serviceNames,
  open,
  onOpenChange,
  projectId,
  envVars = [],
  loading = false,
}: ServiceDetailSheetProps) {
  const [showAccountSection, setShowAccountSection] = useState(false);
  const psId = service?.id || '';
  const { data: healthChecks = [] } = useHealthChecks(psId);
  const runHealthCheck = useRunHealthCheck();

  const showLoading = loading || (open && !service);

  if (!open && !showLoading) {
    return null;
  }

  const containerClasses = cn(
    "fixed top-16 right-4 bottom-4 w-[380px] z-50 transition-transform duration-300 ease-in-out flex flex-col pointer-events-auto",
    "bg-background/80 dark:bg-zinc-950/80 backdrop-blur-xl border shadow-2xl rounded-xl overflow-hidden"
  );

  if (showLoading) {
    return (
      <div className={containerClasses}>
        <div className="p-4 flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4 px-4 pb-4">
          <div className="flex gap-2"><Skeleton className="h-5 w-16" /><Skeleton className="h-5 w-20" /></div>
          <Separator />
          <Skeleton className="h-24 w-full" />
          <Separator />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (!service) return null;

  const svc = service.service;
  const status = statusLabels[service.status] || statusLabels.not_started;
  const category = svc?.category as ServiceCategory;
  const domain = svc?.domain as ServiceDomain | undefined;

  const requiredEnvVars = svc?.required_env_vars || [];
  const recentChecks = healthChecks.slice(0, 5);

  const handleRunCheck = () => {
    runHealthCheck.mutate({ project_service_id: service.id });
  };

  return (
    <div className={containerClasses}>
      <div className="flex items-start justify-between p-4 pb-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{svc?.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {svc?.description_ko || svc?.description}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="-mt-1 -mr-1" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 w-full flex-col">
        <div className="space-y-5 p-4 pt-2">
          {/* Status & Category */}
          <div className="flex flex-wrap gap-2">
            <Badge className={cn("px-2.5 py-0.5", status.className)}>{status.label}</Badge>
            {category && (
              <Badge variant="outline" className="px-2.5 py-0.5">
                {allCategoryLabels[category] || category}
              </Badge>
            )}
            {domain && (
              <Badge variant="secondary" className="px-2.5 py-0.5">
                {domainLabels[domain]}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Health Check */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-blue-500" />
                연결 및 상태
              </h4>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRunCheck}
                  disabled={runHealthCheck.isPending}
                  className="h-8 text-xs"
                >
                  {runHealthCheck.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    '상태 업데이트'
                  )}
                </Button>
                <Button
                  variant={showAccountSection ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowAccountSection((v) => !v)}
                  className="h-8 text-xs"
                >
                  <Settings className="h-3.5 w-3.5 mr-1" />
                  계정 연결
                </Button>
              </div>
            </div>

            <div className="bg-muted/40 rounded-lg p-3">
              {requiredEnvVars.length > 0 && (
                <p className="text-xs text-muted-foreground mb-3">
                  필수 환경변수: {requiredEnvVars.length}개
                </p>
              )}
              {recentChecks.length > 0 ? (
                <HealthTimeline checks={recentChecks} />
              ) : (
                <p className="text-xs text-muted-foreground">이 서비스에 대한 연결 검증 이력이 없습니다.</p>
              )}
            </div>
          </div>

          {showAccountSection && projectId && svc?.slug && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-200">
              <ServiceAccountSection
                projectId={projectId}
                serviceId={service.service_id}
                serviceSlug={svc.slug}
                serviceName={svc.name}
              />
            </div>
          )}

          <Separator />

          {/* Environment Variables */}
          {projectId && (
            <div>
              <ServiceEnvVarsSection
                projectId={projectId}
                serviceId={service.service_id}
                requiredEnvVars={requiredEnvVars}
                envVars={envVars.filter((ev) => ev.service_id === service.service_id)}
              />
            </div>
          )}

          <Separator />

          {/* Badges */}
          <div>
            <h4 className="text-sm font-medium mb-3">서비스 정보</h4>
            <div className="space-y-2.5">
              <div className="flex flex-wrap gap-2 items-center">
                <DifficultyBadge level={svc?.difficulty_level} />
                <FreeTierBadge quality={svc?.free_tier_quality} />
                <VendorLockInBadge risk={svc?.vendor_lock_in_risk} />
              </div>
              <div className="flex items-center gap-3">
                <DxScoreBadge score={svc?.dx_score} />
                <CostEstimateBadge estimate={svc?.monthly_cost_estimate} />
              </div>
            </div>
          </div>

          {/* Dependencies */}
          {dependencies.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                  <GitFork className="h-4 w-4" />
                  의존성 관계
                </h4>
                <div className="space-y-2">
                  {dependencies.map((dep) => (
                    <div
                      key={dep.id}
                      className="flex items-center justify-between text-sm rounded-lg bg-muted/40 border border-muted px-3 py-2"
                    >
                      <span className="font-medium">{serviceNames[dep.depends_on_service_id] || '알 수 없는 서비스'}</span>
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                        {depTypeLabels[dep.dependency_type] || dep.dependency_type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Links */}
          <div className="flex grid grid-cols-2 gap-2 pb-4">
            {svc?.website_url && (
              <Button variant="outline" size="sm" asChild className="w-full justify-center">
                <a href={svc.website_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  공식 웹사이트
                </a>
              </Button>
            )}
            {svc?.docs_url && (
              <Button variant="outline" size="sm" asChild className="w-full justify-center">
                <a href={svc.docs_url} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="mr-2 h-3.5 w-3.5" />
                  개발자 문서
                </a>
              </Button>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
