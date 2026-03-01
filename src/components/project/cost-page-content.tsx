'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useProjectCostSummary } from '@/lib/queries/costs';
import { CostBudgetCard } from './cost-budget-card';
import { CostSummaryMetrics } from './cost-summary-metrics';
import { CostServiceList } from './cost-service-list';

interface CostPageContentProps {
  projectId: string;
}

export function CostPageContent({ projectId }: CostPageContentProps) {
  const { data: costSummary, isLoading, error } = useProjectCostSummary(projectId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 rounded-lg" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-sm text-destructive">비용 정보를 불러오지 못했습니다.</p>
        <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
      </div>
    );
  }

  if (!costSummary) return null;

  return (
    <div className="space-y-6">
      <CostBudgetCard
        projectId={projectId}
        monthlyBudget={costSummary.monthlyBudget}
        budgetCurrency={costSummary.budgetCurrency}
        totalMonthlyCost={costSummary.totalMonthlyCost}
        budgetUsagePercent={costSummary.budgetUsagePercent}
        isOverBudget={costSummary.isOverBudget}
      />

      <CostSummaryMetrics
        totalMonthlyCost={costSummary.totalMonthlyCost}
        totalYearlyCost={costSummary.totalYearlyCost}
        pricedServices={
          costSummary.services.filter((s) => s.monthlyCost > 0 || s.costTierId || s.isCustomCost).length
        }
        totalServices={costSummary.services.length}
        budgetCurrency={costSummary.budgetCurrency}
      />

      <CostServiceList
        projectId={projectId}
        services={costSummary.services}
        budgetCurrency={costSummary.budgetCurrency}
      />
    </div>
  );
}
