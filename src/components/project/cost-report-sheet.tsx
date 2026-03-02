'use client';

import { useEffect } from 'react';
import { Sparkles, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useStreaming } from '@/lib/hooks/use-streaming';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import type { ProjectCostSummary } from '@/types';

interface CostReportSheetProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  costSummary: ProjectCostSummary;
  budgetCurrency: 'USD' | 'KRW';
}

export function CostReportSheet({
  projectId,
  open,
  onOpenChange,
  costSummary,
}: CostReportSheetProps) {
  const { text, isStreaming, error, start, stop, reset } = useStreaming({
    onError: (msg) => {
      if (msg.includes('ai_key_not_configured') || msg.includes('API 키')) {
        toast.error('OpenAI API 키가 설정되지 않았습니다. AI 설정에서 등록하세요.');
      } else {
        toast.error(msg || 'AI 리포트 생성에 실패했습니다.');
      }
    },
  });

  const handleGenerate = () => {
    reset();
    start('/api/ai/cost-report', { project_id: projectId });
  };

  // Auto-generate when sheet opens
  useEffect(() => {
    if (open && text === '' && !isStreaming) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    if (isStreaming) stop();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[680px] sm:max-w-[680px] flex flex-col gap-0 p-0"
      >
        {/* Header */}
        <SheetHeader className="flex-shrink-0 flex flex-row items-center justify-between px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-brand-blue" />
            AI 비용 분석 리포트
          </SheetTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 h-8 text-xs"
              onClick={handleGenerate}
              disabled={isStreaming}
            >
              <RefreshCw className={`h-3 w-3 ${isStreaming ? 'animate-spin' : ''}`} />
              {isStreaming ? '생성 중...' : '다시 생성'}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Cost summary bar */}
        <div className="flex-shrink-0 flex items-center gap-4 px-6 py-3 bg-muted/40 border-b text-xs text-muted-foreground">
          <span>
            서비스 <strong className="text-foreground">{costSummary.services.length}개</strong>
          </span>
          <span>
            월 비용{' '}
            <strong className="text-foreground">
              ${costSummary.totalMonthlyCost.toFixed(2)}
            </strong>
          </span>
          {costSummary.monthlyBudget && (
            <span>
              예산 소진{' '}
              <strong className={costSummary.isOverBudget ? 'text-destructive' : 'text-foreground'}>
                {costSummary.budgetUsagePercent ?? 0}%
              </strong>
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Streaming skeleton */}
          {isStreaming && text === '' && (
            <div className="space-y-4">
              {[
                '📊 비용 현황 요약',
                '🔍 서비스별 비용 분석',
                '💰 비용 최적화 기회',
                '🔄 대안 서비스 제안',
                '📈 SaaS 시장 트렌드',
                '✅ 의사결정 가이드',
              ].map((section) => (
                <div key={section} className="space-y-2">
                  <Skeleton className="h-5 w-56 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-4/5 rounded" />
                  <Skeleton className="h-3 w-3/4 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && text === '' && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 gap-1.5"
                onClick={handleGenerate}
              >
                <RefreshCw className="h-3 w-3" />
                다시 시도
              </Button>
            </div>
          )}

          {/* Markdown content */}
          {text && (
            <div className="prose prose-sm dark:prose-invert max-w-none
              [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-1
              [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
              [&_li]:text-xs [&_li]:my-0.5
              [&_p]:text-xs [&_p]:my-1
              [&_strong]:font-semibold
              [&_hr]:my-4">
              <ReactMarkdown>{text}</ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-1.5 h-3.5 bg-brand-blue animate-pulse rounded-sm ml-0.5" />
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
