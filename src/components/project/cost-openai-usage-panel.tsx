'use client';

import { useState } from 'react';
import { RefreshCw, Key, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useOpenAIUsage, useSyncOpenAIUsage } from '@/lib/queries/costs';
import { cn } from '@/lib/utils';
import type { ClientUsageData } from '@/lib/validations/cost';

// ────────────────────────────────────────────────────────────
// 브라우저에서 직접 OpenAI Organization Costs API 호출
// - 엔드포인트: /v1/organization/costs (Admin Key 전용)
// - /dashboard/billing/usage 는 세션키 전용으로 변경되어 사용 불가
// - Cloudflare Workers 지역 제한 우회를 위해 브라우저에서 직접 호출
// ────────────────────────────────────────────────────────────
type CostsResponse = {
  data?: Array<{
    results?: Array<{
      amount?: { value?: number; currency?: string };
      line_item?: string;
    }>;
  }>;
  has_more?: boolean;
};

async function fetchOpenAICostsFromBrowser(
  apiKey: string
): Promise<ClientUsageData> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startTime = Math.floor(startOfMonth.getTime() / 1000);
  const endTime = Math.floor(now.getTime() / 1000);

  const url = new URL('https://api.openai.com/v1/organization/costs');
  url.searchParams.set('start_time', String(startTime));
  url.searchParams.set('end_time', String(endTime));
  url.searchParams.set('bucket_width', '1d');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const errorObj = (body as { error?: { message?: string } | string }).error;
    const msg = errorObj
      ? typeof errorObj === 'string'
        ? errorObj
        : (errorObj.message ?? `OpenAI API 오류 (${res.status})`)
      : `OpenAI API 오류 (${res.status})`;
    throw new Error(msg);
  }

  const data = (await res.json()) as CostsResponse;

  let totalCost = 0;
  const byLineItemMap = new Map<string, number>();

  for (const bucket of data.data ?? []) {
    for (const result of bucket.results ?? []) {
      const value = result.amount?.value ?? 0;
      totalCost += value;
      const key = result.line_item ?? 'Other';
      byLineItemMap.set(key, (byLineItemMap.get(key) ?? 0) + value);
    }
  }

  return {
    total_cost: Math.round(totalCost * 10000) / 10000,
    period_start: startOfMonth.toISOString(),
    period_end: now.toISOString(),
    by_model: Array.from(byLineItemMap.entries()).map(([modelId, cost]) => ({
      modelId,
      cost: Math.round(cost * 10000) / 10000,
      inputTokens: 0,
      outputTokens: 0,
    })),
  };
}

interface CostOpenAIUsagePanelProps {
  projectId: string;
  projectServiceId: string;
}

function formatCost(amount: number) {
  return `$${amount.toFixed(4)}`;
}

function formatTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatSyncedAt(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}시간 전`;
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export function CostOpenAIUsagePanel({
  projectId,
  projectServiceId,
}: CostOpenAIUsagePanelProps) {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { data: usage, isLoading } = useOpenAIUsage(
    projectId,
    projectServiceId
  );
  const syncMutation = useSyncOpenAIUsage(projectId);

  const [isBrowserFetching, setIsBrowserFetching] = useState(false);

  const handleSync = async () => {
    // 입력된 키가 없으면 → 입력 필드 노출 (재입력 요청)
    if (!apiKeyInput) {
      setShowApiKeyInput(true);
      if (usage?.hasApiKey) {
        toast.info('재동기화하려면 API Key를 다시 입력해주세요.', {
          description: '브라우저에서 직접 조회하여 지역 제한을 우회합니다.',
        });
      }
      return;
    }

    // 항상 브라우저에서 직접 OpenAI 호출 (서버 측 지역 제한 우회)
    setIsBrowserFetching(true);
    try {
      const usageData = await fetchOpenAICostsFromBrowser(apiKeyInput);
      syncMutation.mutate(
        { projectServiceId, apiKey: apiKeyInput, usageData },
        {
          onSuccess: (result) => {
            toast.success(
              `동기화 완료: ${result.totalCost != null ? formatCost(result.totalCost) : '$0'}`
            );
            setShowApiKeyInput(false);
            setApiKeyInput('');
            setShowBreakdown(true);
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'OpenAI API 호출 실패';
      // 403 / 지역 제한 시 수동 입력 안내
      toast.error('OpenAI 사용량을 가져올 수 없습니다.', {
        description: msg,
        duration: 8000,
      });
    } finally {
      setIsBrowserFetching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2 py-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  // maskedKey는 API 응답에 포함되어 있음 (OpenAIUsageSummary 확장)
  const maskedKey = (usage as (typeof usage & { maskedKey?: string | null }))
    ?.maskedKey;

  return (
    <div className="space-y-3 py-2">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          실제 사용량 (당월)
        </span>
        {usage?.syncedAt && (
          <span className="text-xs text-muted-foreground">
            동기화: {formatSyncedAt(usage.syncedAt)}
          </span>
        )}
      </div>

      {/* API Key 상태 */}
      <div className="flex items-center gap-2">
        {usage?.hasApiKey ? (
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="font-mono">{maskedKey ?? '연결됨'}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>API Key 미연결</span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-7 text-xs gap-1.5"
          onClick={handleSync}
          disabled={syncMutation.isPending || isBrowserFetching}
        >
          <RefreshCw
            className={cn('h-3.5 w-3.5', (syncMutation.isPending || isBrowserFetching) && 'animate-spin')}
          />
          {syncMutation.isPending || isBrowserFetching ? '동기화 중...' : '동기화'}
        </Button>
      </div>

      {/* API Key 입력 (미연결 시 또는 변경 시) */}
      {(showApiKeyInput || (!usage?.hasApiKey)) && (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="sk-admin-..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="h-8 pl-8 text-xs font-mono"
                autoComplete="off"
              />
            </div>
            {showApiKeyInput && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setShowApiKeyInput(false);
                  setApiKeyInput('');
                }}
              >
                취소
              </Button>
            )}
          </div>
          <a
            href="https://platform.openai.com/settings/organization/admin-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            OpenAI Admin Key 발급 · 확인
          </a>
        </div>
      )}

      {/* API Key 연결 시 변경 버튼 */}
      {usage?.hasApiKey && !showApiKeyInput && (
        <button
          type="button"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => setShowApiKeyInput(true)}
        >
          API Key 변경
        </button>
      )}

      {/* 동기화된 비용 표시 */}
      {usage?.totalCost != null && (
        <div className="rounded-md bg-muted/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">이번 달 합계</span>
            <span className="text-sm font-mono font-semibold">
              {formatCost(usage.totalCost)}
            </span>
          </div>

          {/* 모델별 브레이크다운 */}
          {usage.byModel && usage.byModel.length > 0 && (
            <>
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowBreakdown((v) => !v)}
              >
                {showBreakdown ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                항목별 상세
              </button>

              {showBreakdown && (
                <div className="space-y-1.5 pt-1 border-t border-muted">
                  {usage.byModel.map((m) => (
                    <div
                      key={m.modelId}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 font-mono truncate max-w-[160px]"
                        >
                          {m.modelId}
                        </Badge>
                        <span className="text-muted-foreground shrink-0">
                          {formatTokens(m.inputTokens + m.outputTokens)} tokens
                        </span>
                      </div>
                      <span className="font-mono shrink-0">
                        {formatCost(m.cost)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 미동기화 안내 */}
      {usage?.totalCost == null && !syncMutation.isPending && (
        <p className="text-xs text-muted-foreground">
          동기화 버튼을 클릭하면 당월 실제 사용 비용을 가져옵니다.
        </p>
      )}
    </div>
  );
}
