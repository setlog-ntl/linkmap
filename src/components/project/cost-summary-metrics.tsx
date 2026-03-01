'use client';

import { DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { MetricPill } from '@/components/dashboard/metric-pill';

interface CostSummaryMetricsProps {
  totalMonthlyCost: number;
  totalYearlyCost: number;
  pricedServices: number;
  totalServices: number;
  budgetCurrency: 'USD' | 'KRW';
}

function shortCurrency(amount: number, currency: 'USD' | 'KRW'): string {
  if (currency === 'KRW') {
    return `₩${amount.toLocaleString('ko-KR')}`;
  }
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CostSummaryMetrics({
  totalMonthlyCost,
  totalYearlyCost,
  pricedServices,
  totalServices,
  budgetCurrency,
}: CostSummaryMetricsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <MetricPill
        icon={DollarSign}
        value={shortCurrency(totalMonthlyCost, budgetCurrency)}
        label="월 비용"
      />
      <MetricPill
        icon={Calendar}
        value={shortCurrency(totalYearlyCost, budgetCurrency)}
        label="연 비용"
      />
      <MetricPill
        icon={BarChart3}
        value={`${pricedServices}/${totalServices}`}
        label="비용 설정됨"
      />
    </div>
  );
}
