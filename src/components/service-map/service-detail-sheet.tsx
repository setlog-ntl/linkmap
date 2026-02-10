'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
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
import { allCategoryLabels } from '@/lib/constants/service-filters';
import { domainLabels } from '@/lib/constants/service-filters';
import { ExternalLink, BookOpen, GitFork } from 'lucide-react';
import type { ProjectService, Service, ServiceDependency, ServiceCategory, ServiceDomain } from '@/types';

interface ServiceDetailSheetProps {
  service: (ProjectService & { service: Service }) | null;
  dependencies: ServiceDependency[];
  serviceNames: Record<string, string>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
}: ServiceDetailSheetProps) {
  if (!service) return null;

  const svc = service.service;
  const status = statusLabels[service.status] || statusLabels.not_started;
  const category = svc?.category as ServiceCategory;
  const domain = svc?.domain as ServiceDomain | undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto w-[380px] sm:max-w-[380px]">
        <SheetHeader>
          <SheetTitle className="text-lg">{svc?.name}</SheetTitle>
          <SheetDescription>
            {svc?.description_ko || svc?.description}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-4">
          {/* Status & Category */}
          <div className="flex flex-wrap gap-2">
            <Badge className={status.className}>{status.label}</Badge>
            {category && (
              <Badge variant="outline">
                {allCategoryLabels[category] || category}
              </Badge>
            )}
            {domain && (
              <Badge variant="secondary">
                {domainLabels[domain]}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Badges */}
          <div className="space-y-2">
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

          {/* Dependencies */}
          {dependencies.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <GitFork className="h-3.5 w-3.5" />
                  의존성
                </h4>
                <div className="space-y-1.5">
                  {dependencies.map((dep) => (
                    <div
                      key={dep.id}
                      className="flex items-center justify-between text-sm rounded-md bg-muted/50 px-2.5 py-1.5"
                    >
                      <span>{serviceNames[dep.depends_on_service_id] || dep.depends_on_service_id}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
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
          <div className="flex gap-2">
            {svc?.website_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={svc.website_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  웹사이트
                </a>
              </Button>
            )}
            {svc?.docs_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={svc.docs_url} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                  문서
                </a>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
