'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceIcon } from '@/components/ui/service-icon';
import { CostTierSelector } from './cost-tier-selector';
import { useUpdateServiceCost } from '@/lib/queries/costs';
import { cn } from '@/lib/utils';
import { formatCurrency } from './cost-budget-card';
import type { ServiceCostEntry } from '@/types';

interface CostServiceListProps {
  projectId: string;
  services: ServiceCostEntry[];
  budgetCurrency: 'USD' | 'KRW';
}

const BILLING_CYCLE_LABELS: Record<string, string> = {
  monthly: '월',
  yearly: '연',
  one_time: '일회성',
  usage_based: '사용량 기반',
};

export function CostServiceList({ projectId, services, budgetCurrency }: CostServiceListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const updateCost = useUpdateServiceCost(projectId);

  const handleSave = (entry: ServiceCostEntry, data: {
    cost_tier_id?: string | null;
    custom_cost_monthly?: number | null;
    custom_cost_yearly?: number | null;
    cost_notes?: string | null;
    billing_cycle?: 'monthly' | 'yearly' | 'one_time' | 'usage_based';
  }) => {
    updateCost.mutate(
      { projectServiceId: entry.projectServiceId, ...data },
      {
        onSuccess: () => {
          setExpandedId(null);
          toast.success(`${entry.serviceName} 비용이 저장되었습니다`);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          프로젝트에 추가된 서비스가 없습니다.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">서비스별 비용</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 divide-y">
        {services.map((entry) => {
          const isExpanded = expandedId === entry.projectServiceId;
          const hasCost = entry.monthlyCost > 0 || entry.costTierId || entry.isCustomCost;

          return (
            <div key={entry.projectServiceId} className="py-3 first:pt-0 last:pb-0">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setExpandedId(isExpanded ? null : entry.projectServiceId)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}

                <ServiceIcon serviceId={entry.serviceSlug} size={20} />

                <span className="flex-1 text-sm font-medium min-w-0 truncate">
                  {entry.serviceName}
                </span>

                {hasCost ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {entry.isCustomCost ? '커스텀' : entry.tierName ?? ''}
                    </Badge>
                    <span className="text-sm font-mono font-medium">
                      {formatCurrency(entry.monthlyCost, budgetCurrency)}
                      <span className="text-muted-foreground text-xs">
                        /{BILLING_CYCLE_LABELS[entry.billingCycle] ?? entry.billingCycle}
                      </span>
                    </span>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'h-7 text-xs text-muted-foreground',
                      'opacity-0 group-hover:opacity-100 transition-opacity'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(entry.projectServiceId);
                    }}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    요금 선택
                  </Button>
                )}
              </div>

              {isExpanded && (
                <div className="mt-3 ml-7 pl-3 border-l-2 border-muted">
                  <CostTierSelector
                    serviceId={entry.serviceId}
                    currentTierId={entry.costTierId}
                    currentCustomMonthly={entry.isCustomCost ? entry.monthlyCost : null}
                    currentCostNotes={entry.costNotes}
                    currentBillingCycle={entry.billingCycle}
                    isPending={updateCost.isPending}
                    budgetCurrency={budgetCurrency}
                    onSave={(data) => handleSave(entry, data)}
                    onCancel={() => setExpandedId(null)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
