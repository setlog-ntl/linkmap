'use client';

import { useEffect, useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useGenerateCostReport } from '@/lib/queries/costs';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { ProjectCostSummary } from '@/types';
import type { CostReportResult } from '@/lib/validations/ai-cost-report';

const CHART_COLORS = [
  '#4F7BE0', '#34C07A', '#F59E0B', '#EF4444',
  '#8B5CF6', '#06B6D4', '#EC4899', '#F97316',
];

const LOADING_STEPS = [
  '📊 프로젝트 비용 데이터 수집 중...',
  '🔍 서비스별 비용 분석 중...',
  '✨ 최적화 리포트 생성 중...',
];

interface CostReportDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  costSummary: ProjectCostSummary;
}

export function CostReportDialog({
  projectId,
  open,
  onOpenChange,
  costSummary,
}: CostReportDialogProps) {
  const [report, setReport] = useState<CostReportResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const mutation = useGenerateCostReport(projectId);

  const handleGenerate = () => {
    setReport(null);
    setLoadingStep(0);
    mutation.mutate(undefined, {
      onSuccess: (data) => {
        setReport(data);
      },
      onError: (err) => {
        const msg = err.message;
        if (msg === 'ai_key_not_configured') {
          toast.error('AI 설정에서 OpenAI API 키를 등록하세요.');
        } else {
          toast.error(msg || 'AI 리포트 생성에 실패했습니다.');
        }
      },
    });
  };

  // 로딩 단계 텍스트 순환
  useEffect(() => {
    if (!mutation.isPending) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [mutation.isPending]);

  // 다이얼로그 열릴 때 자동 생성
  useEffect(() => {
    if (open && !report && !mutation.isPending) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const maxSaving = report
    ? Math.max(
        ...report.optimizations.map((o) => o.estimatedMonthlySaving),
        0,
      )
    : 0;

  const priorityColor = {
    high: 'border-l-destructive bg-destructive/5',
    medium: 'border-l-orange-400 bg-orange-50 dark:bg-orange-950/20',
    low: 'border-l-green-500 bg-green-50 dark:bg-green-950/20',
  };

  const priorityBadge = {
    high: <Badge variant="destructive" className="text-xs">긴급</Badge>,
    medium: <Badge className="text-xs bg-orange-500 hover:bg-orange-600">중요</Badge>,
    low: <Badge variant="outline" className="text-xs text-green-600 border-green-500">권장</Badge>,
  };

  const effortLabel = {
    immediate: '즉시 적용',
    short_term: '단기 (1~3개월)',
    long_term: '장기 (3개월 이상)',
  };

  const timelineGroups: Record<'immediate' | '1_3_months' | '3_plus_months', { label: string; color: string }> = {
    immediate: { label: '즉시 실행', color: 'bg-red-500' },
    '1_3_months': { label: '1~3개월', color: 'bg-yellow-500' },
    '3_plus_months': { label: '3개월 이상', color: 'bg-green-500' },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[92vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between px-6 py-4 border-b space-y-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="h-4 w-4 text-brand-blue" />
            AI 비용 분석 리포트
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 h-8 text-xs"
              onClick={handleGenerate}
              disabled={mutation.isPending}
            >
              <RefreshCw className={`h-3 w-3 ${mutation.isPending ? 'animate-spin' : ''}`} />
              {mutation.isPending ? '생성 중...' : '다시 생성'}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="pb-8">

            {/* ① 로딩 상태 */}
            {mutation.isPending && (
              <div>
                {/* 로딩 헤더 */}
                <div className="px-8 py-6 bg-gradient-to-r from-brand-blue/10 to-brand-green/10 border-b">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-brand-blue animate-pulse" />
                    <p className="text-sm font-medium">{LOADING_STEPS[loadingStep]}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {[0, 1, 2].map((i) => (
                      <Skeleton key={i} className="h-14 rounded-lg" />
                    ))}
                  </div>
                </div>
                <div className="px-8 py-6 space-y-6">
                  {/* 섹션 스켈레톤 */}
                  {['비용 구성', '최적화 기회', '대안 서비스', '시장 트렌드', '실행 계획'].map((label) => (
                    <div key={label} className="space-y-2">
                      <Skeleton className="h-5 w-40 rounded" />
                      <Skeleton className="h-3 w-full rounded" />
                      <Skeleton className="h-3 w-4/5 rounded" />
                      <Skeleton className="h-3 w-3/4 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ② 에러 상태 */}
            {mutation.isError && !report && (
              <div className="px-8 py-10 flex flex-col items-center gap-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <p className="text-sm text-destructive text-center">
                  {mutation.error.message === 'ai_key_not_configured'
                    ? 'AI 설정에서 OpenAI API 키를 등록하세요.'
                    : mutation.error.message || '리포트 생성에 실패했습니다.'}
                </p>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={handleGenerate}>
                  <RefreshCw className="h-3.5 w-3.5" />
                  다시 시도
                </Button>
              </div>
            )}

            {/* ③ 리포트 렌더링 */}
            {report && (
              <>
                {/* Hero 요약 */}
                <div className="px-8 py-6 bg-gradient-to-r from-brand-blue/10 to-brand-green/10 border-b">
                  <h2 className="text-2xl font-bold text-foreground">{report.headline}</h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">{report.totalInsight}</p>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-background/70 px-4 py-3 border">
                      <p className="text-xs text-muted-foreground">월 총 비용</p>
                      <p className="text-xl font-bold mt-0.5">
                        ${costSummary.totalMonthlyCost.toFixed(2)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-background/70 px-4 py-3 border">
                      <p className="text-xs text-muted-foreground">연결 서비스</p>
                      <p className="text-xl font-bold mt-0.5">{report.services.length}개</p>
                    </div>
                    <div className="rounded-lg bg-background/70 px-4 py-3 border">
                      <p className="text-xs text-muted-foreground">최대 절감 가능</p>
                      <p className="text-xl font-bold mt-0.5 text-green-600">
                        ${maxSaving.toFixed(0)}/월
                      </p>
                    </div>
                  </div>
                </div>

                {/* ② 비용 구성 */}
                {report.services.length > 0 && (
                  <div className="px-8 py-6 border-b">
                    <h3 className="text-sm font-semibold mb-4">비용 구성</h3>
                    <div className="grid grid-cols-2 gap-6 items-center">
                      {/* 도넛 차트 */}
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={report.services}
                              dataKey="monthlyCost"
                              nameKey="name"
                              innerRadius={70}
                              outerRadius={110}
                              paddingAngle={2}
                            >
                              {report.services.map((_, i) => (
                                <Cell
                                  key={i}
                                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number | undefined) => [
                                value != null ? `$${value.toFixed(2)}` : '-',
                                '월 비용',
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* 서비스 목록 */}
                      <div className="space-y-3">
                        {report.services.map((svc, i) => (
                          <div key={svc.name} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium flex items-center gap-1.5">
                                <span
                                  className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                                />
                                {svc.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">${svc.monthlyCost.toFixed(2)}</span>
                                <Badge
                                  variant={svc.status === 'optimal' ? 'secondary' : 'outline'}
                                  className={`text-[10px] px-1.5 py-0 ${
                                    svc.status === 'optimal'
                                      ? 'text-green-600 border-green-500'
                                      : svc.status === 'review'
                                      ? 'text-yellow-600 border-yellow-500'
                                      : 'text-red-600 border-red-500'
                                  }`}
                                >
                                  {svc.status === 'optimal' ? '적정' : svc.status === 'review' ? '검토 필요' : '비용 높음'}
                                </Badge>
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(svc.percentage, 100)}%`,
                                  backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                                }}
                              />
                            </div>
                            <p className="text-[11px] text-muted-foreground">{svc.insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ③ 최적화 기회 */}
                {report.optimizations.length > 0 && (
                  <div className="px-8 py-6 border-b">
                    <h3 className="text-sm font-semibold mb-4">최적화 기회</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {report.optimizations.map((opt, i) => (
                        <div
                          key={i}
                          className={`rounded-lg border-l-4 p-4 ${priorityColor[opt.priority]}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium">{opt.title}</p>
                            {priorityBadge[opt.priority]}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{opt.description}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950/40">
                              절감 ${opt.estimatedMonthlySaving.toFixed(0)}/월
                            </Badge>
                            <span className="text-[11px] text-muted-foreground">{effortLabel[opt.effort]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ④ 대안 서비스 */}
                {report.alternatives.length > 0 && (
                  <div className="px-8 py-6 border-b">
                    <h3 className="text-sm font-semibold mb-4">대안 서비스</h3>
                    <div className="rounded-lg border overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/50 border-b">
                            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">현재 서비스</th>
                            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">대안</th>
                            <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">월 절감</th>
                            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">근거</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.alternatives.map((alt, i) => (
                            <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                              <td className="px-4 py-3 font-medium">{alt.currentServiceName}</td>
                              <td className="px-4 py-3 text-brand-blue">{alt.alternativeName}</td>
                              <td className="px-4 py-3 text-right text-green-600 font-medium">
                                ${alt.monthlySaving.toFixed(0)}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">{alt.rationale}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ⑤ 시장 트렌드 */}
                {report.trends.length > 0 && (
                  <div className="px-8 py-6 border-b">
                    <h3 className="text-sm font-semibold mb-4">시장 트렌드</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {report.trends.map((trend, i) => {
                        const Icon =
                          trend.impact === 'positive'
                            ? TrendingUp
                            : trend.impact === 'negative'
                            ? TrendingDown
                            : Minus;
                        const iconColor =
                          trend.impact === 'positive'
                            ? 'text-green-500'
                            : trend.impact === 'negative'
                            ? 'text-red-500'
                            : 'text-muted-foreground';
                        return (
                          <div key={i} className="rounded-lg border bg-card p-4">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Icon className={`h-4 w-4 ${iconColor}`} />
                              <p className="text-xs font-semibold">{trend.title}</p>
                            </div>
                            <p className="text-[11px] text-muted-foreground">{trend.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ⑥ 실행 계획 */}
                {report.actionItems.length > 0 && (
                  <div className="px-8 py-6 border-b">
                    <h3 className="text-sm font-semibold mb-4">실행 계획</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {(Object.entries(timelineGroups) as [keyof typeof timelineGroups, { label: string; color: string }][]).map(
                        ([timeline, { label, color }]) => {
                          const items = report.actionItems.filter((a) => a.timeline === timeline);
                          if (items.length === 0) return null;
                          return (
                            <div key={timeline}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                                <p className="text-xs font-semibold">{label}</p>
                              </div>
                              <div className="space-y-2">
                                {items.map((item, i) => (
                                  <div key={i} className="rounded-md border bg-card p-3">
                                    <p className="text-[11px] text-foreground">{item.action}</p>
                                    {item.expectedMonthlySaving != null && item.expectedMonthlySaving > 0 && (
                                      <p className="mt-1 text-[10px] text-green-600">
                                        예상 절감 ${item.expectedMonthlySaving.toFixed(0)}/월
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="px-8 py-4 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>생성일시: {new Date().toLocaleString('ko-KR')}</span>
                  <span>AI 분석 결과는 참고용이며 실제 비용과 다를 수 있습니다.</span>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
