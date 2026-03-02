'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useProjectCostSummary, useExchangeRate } from '@/lib/queries/costs';
import { CostBudgetCard } from './cost-budget-card';
import { CostSummaryMetrics } from './cost-summary-metrics';
import { CostServiceList } from './cost-service-list';

interface CostPageContentProps {
  projectId: string;
}

export function CostPageContent({ projectId }: CostPageContentProps) {
  const { data: costSummary, isLoading, error } = useProjectCostSummary(projectId);
  const { data: exchangeRate } = useExchangeRate();

  const usdToKrw = exchangeRate?.rate ?? null;

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
      {/* Header row with AI report button */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">비용 관리</h2>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 h-8 text-xs"
          disabled={costSummary.services.length === 0}
          asChild
        >
          <Link href={`/project/${projectId}/costs/report`}>
            <Sparkles className="h-3.5 w-3.5" />
            AI 리포트
          </Link>
        </Button>
      </div>

      <CostBudgetCard
        projectId={projectId}
        monthlyBudget={costSummary.monthlyBudget}
        budgetCurrency={costSummary.budgetCurrency}
        totalMonthlyCost={costSummary.totalMonthlyCost}
        budgetUsagePercent={costSummary.budgetUsagePercent}
        isOverBudget={costSummary.isOverBudget}
        usdToKrw={usdToKrw}
      />

      <CostSummaryMetrics
        totalMonthlyCost={costSummary.totalMonthlyCost}
        totalYearlyCost={costSummary.totalYearlyCost}
        pricedServices={
          costSummary.services.filter((s) => s.monthlyCost > 0 || s.costTierId || s.isCustomCost).length
        }
        totalServices={costSummary.services.length}
        budgetCurrency={costSummary.budgetCurrency}
        usdToKrw={usdToKrw}
      />

      <CostServiceList
        projectId={projectId}
        services={costSummary.services}
        budgetCurrency={costSummary.budgetCurrency}
        usdToKrw={usdToKrw}
      />
    </div>
  );
}
