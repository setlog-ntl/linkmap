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

interface CostOpenAIUsagePanelProps {
  projectId: string;
  projectServiceId: string;
  usdToKrw?: number | null;
}

function formatCost(amount: number) {
  return `$${amount.toFixed(4)}`;
}

function formatCostKrw(amount: number, rate: number): string {
  return `≈ ₩${Math.round(amount * rate).toLocaleString('ko-KR')}`;
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
  usdToKrw,
}: CostOpenAIUsagePanelProps) {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { data: usage, isLoading } = useOpenAIUsage(
    projectId,
    projectServiceId
  );
  const syncMutation = useSyncOpenAIUsage(projectId);

  const showKrw = usdToKrw != null;

  const handleSync = () => {
    if (!apiKeyInput) {
      setShowApiKeyInput(true);
      if (usage?.hasApiKey) {
        toast.info('재동기화하려면 Admin Key를 다시 입력해주세요.');
      }
      return;
    }

    syncMutation.mutate(
      { projectServiceId, apiKey: apiKeyInput },
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
  };

  if (isLoading) {
    return (
      <div className="space-y-2 py-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

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
          disabled={syncMutation.isPending}
        >
          <RefreshCw
            className={cn('h-3.5 w-3.5', syncMutation.isPending && 'animate-spin')}
          />
          {syncMutation.isPending ? '동기화 중...' : '동기화'}
        </Button>
      </div>

      {/* API Key 입력 */}
      {(showApiKeyInput || (!usage?.hasApiKey)) && (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="sk-..."
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

      {/* API Key 변경 버튼 */}
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
            <div className="text-right">
              <span className="text-sm font-mono font-semibold">
                {formatCost(usage.totalCost)}
              </span>
              {showKrw && usage.totalCost > 0 && (
                <div className="text-xs text-muted-foreground font-mono">
                  {formatCostKrw(usage.totalCost, usdToKrw!)}
                </div>
              )}
            </div>
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
                      <div className="text-right shrink-0">
                        <span className="font-mono">{formatCost(m.cost)}</span>
                        {showKrw && m.cost > 0 && (
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {formatCostKrw(m.cost, usdToKrw!)}
                          </div>
                        )}
                      </div>
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
