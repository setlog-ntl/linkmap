'use client';

import { DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { MetricPill } from '@/components/dashboard/metric-pill';

interface CostSummaryMetricsProps {
  totalMonthlyCost: number;
  totalYearlyCost: number;
  pricedServices: number;
  totalServices: number;
  budgetCurrency: 'USD' | 'KRW';
  usdToKrw?: number | null;
}

function shortCurrency(amount: number, currency: 'USD' | 'KRW'): string {
  if (currency === 'KRW') {
    return `₩${amount.toLocaleString('ko-KR')}`;
  }
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function krwEquiv(usdAmount: number, rate: number): string {
  return `≈ ₩${Math.round(usdAmount * rate).toLocaleString('ko-KR')}`;
}

export function CostSummaryMetrics({
  totalMonthlyCost,
  totalYearlyCost,
  pricedServices,
  totalServices,
  budgetCurrency,
  usdToKrw,
}: CostSummaryMetricsProps) {
  const showKrw = budgetCurrency === 'USD' && usdToKrw != null;

  return (
    <div className="flex flex-wrap gap-2">
      <MetricPill
        icon={DollarSign}
        value={shortCurrency(totalMonthlyCost, budgetCurrency)}
        label={showKrw ? `월 비용 · ${krwEquiv(totalMonthlyCost, usdToKrw!)}` : '월 비용'}
      />
      <MetricPill
        icon={Calendar}
        value={shortCurrency(totalYearlyCost, budgetCurrency)}
        label={showKrw ? `연 비용 · ${krwEquiv(totalYearlyCost, usdToKrw!)}` : '연 비용'}
      />
      <MetricPill
        icon={BarChart3}
        value={`${pricedServices}/${totalServices}`}
        label="비용 설정됨"
      />
    </div>
  );
}
