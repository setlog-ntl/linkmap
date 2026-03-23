'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, FileText, Clock, TrendingDown, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useProjectCostSummary, useExchangeRate } from '@/lib/queries/costs';
import { CostBudgetCard } from './cost-budget-card';
import { CostSummaryMetrics } from './cost-summary-metrics';
import { CostServiceList } from './cost-service-list';
import { formatCurrency } from './cost-budget-card';
import type { CostReportResult } from '@/lib/validations/ai-cost-report';
import type { ProjectCostSummary } from '@/types';

interface StoredReport { report: CostReportResult; generatedAt: string; }

function loadStoredReport(projectId: string): StoredReport | null {
  try {
    const raw = localStorage.getItem(`cost-report:${projectId}`);
    return raw ? (JSON.parse(raw) as StoredReport) : null;
  } catch { return null; }
}

function formatRelativeTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}시간 전`;
  const days = Math.floor(hrs / 24);
  return `${days}일 전`;
}

function buildCostSummaryLine(
  summary: ProjectCostSummary,
  budgetCurrency: 'USD' | 'KRW',
  usdToKrw: number | null,
): { text: string; variant: 'free' | 'paid' | 'info' } {
  const total = summary.services.length;
  const freeCount = summary.services.filter(
    (s) => s.monthlyCost === 0 && (s.costTierId != null || s.isCustomCost),
  ).length;
  const paidCount = summary.services.filter((s) => s.monthlyCost > 0).length;
  const cost = summary.totalMonthlyCost;

  if (total === 0) {
    return { text: '서비스를 추가하면 비용을 한눈에 볼 수 있어요', variant: 'info' };
  }

  if (cost === 0 && freeCount > 0) {
    return {
      text: `모든 서비스 무료 사용 중! 월 $0`,
      variant: 'free',
    };
  }

  const costStr = formatCurrency(cost, budgetCurrency);
  const krwStr =
    budgetCurrency === 'USD' && usdToKrw
      ? ` (약 ₩${Math.round(cost * usdToKrw).toLocaleString('ko-KR')})`
      : '';
  const budgetPart =
    summary.budgetUsagePercent != null
      ? `, 예산의 ${summary.budgetUsagePercent}%`
      : '';

  if (freeCount > 0) {
    return {
      text: `${total}개 서비스 중 ${freeCount}개가 무료, 총 ${costStr}/월${krwStr}${budgetPart}`,
      variant: 'paid',
    };
  }

  return {
    text: `${paidCount}개 서비스, 총 ${costStr}/월${krwStr}${budgetPart}`,
    variant: 'paid',
  };
}

interface CostPageContentProps {
  projectId: string;
  /** 데모 모드: AI 리포트 생성 비활성화 */
  isDemo?: boolean;
  /** 데모 모드: 리포트 보기 링크 (기본값: /project/${projectId}/costs/report) */
  reportHref?: string;
}

export function CostPageContent({ projectId, isDemo = false, reportHref }: CostPageContentProps) {
  const { data: costSummary, isLoading, error } = useProjectCostSummary(projectId);
  const { data: exchangeRate } = useExchangeRate();
  const [storedReport, setStoredReport] = useState<StoredReport | null>(null);
  const [reportChecked, setReportChecked] = useState(false);

  const usdToKrw = exchangeRate?.rate ?? null;
  const reportLink = reportHref ?? `/project/${projectId}/costs/report`;

  useEffect(() => {
    setStoredReport(loadStoredReport(projectId));
    setReportChecked(true);
  }, [projectId]);

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

  const hasReport = reportChecked && storedReport !== null;
  const summaryLine = buildCostSummaryLine(costSummary, costSummary.budgetCurrency, usdToKrw);

  return (
    <div className="space-y-6">
      {/* 한 줄 요약 배너 */}
      <div
        className={cn(
          'flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium',
          summaryLine.variant === 'free'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
            : summaryLine.variant === 'paid'
              ? 'bg-brand-blue/5 text-brand-blue dark:bg-brand-blue/10'
              : 'bg-muted text-muted-foreground',
        )}
      >
        {summaryLine.variant === 'free' ? (
          <Zap className="h-4 w-4 shrink-0" />
        ) : (
          <TrendingDown className="h-4 w-4 shrink-0" />
        )}
        {summaryLine.text}
      </div>

      {/* AI 리포트 바 */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1" />
        {reportChecked && hasReport ? (
          <>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(storedReport!.generatedAt)}
            </span>
            <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" asChild>
              <Link prefetch={false} href={reportLink}>
                <FileText className="h-3.5 w-3.5" />
                AI 리포트
              </Link>
            </Button>
            {!isDemo && (
              <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs text-muted-foreground" disabled={costSummary.services.length === 0} asChild>
                <Link prefetch={false} href={reportLink}>
                  <Sparkles className="h-3 w-3" />
                  재생성
                </Link>
              </Button>
            )}
          </>
        ) : isDemo ? (
          <>
            <Badge variant="secondary" className="text-[10px]">데모</Badge>
            <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" disabled>
              <Sparkles className="h-3.5 w-3.5" />
              AI 리포트
            </Button>
          </>
        ) : (
          <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" disabled={costSummary.services.length === 0} asChild>
            <Link prefetch={false} href={reportLink}>
              <Sparkles className="h-3.5 w-3.5" />
              AI 리포트
            </Link>
          </Button>
        )}
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
