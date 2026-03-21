'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Pencil, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceIcon } from '@/components/ui/service-icon';
import { CostTierSelector } from './cost-tier-selector';
import { CostOpenAIUsagePanel } from './cost-openai-usage-panel';
import { CostAttachmentsPanel } from './cost-attachments-panel';
import { useUpdateServiceCost } from '@/lib/queries/costs';
import { cn } from '@/lib/utils';
import { formatCurrency } from './cost-budget-card';
import type { ServiceCostEntry } from '@/types';

/** 서비스 slug → 공식 요금표 페이지 URL */
const SERVICE_PRICING_URLS: Record<string, string> = {
  openai: 'https://openai.com/pricing',
  anthropic: 'https://www.anthropic.com/pricing',
  vercel: 'https://vercel.com/pricing',
  supabase: 'https://supabase.com/pricing',
  github: 'https://github.com/pricing',
  aws: 'https://aws.amazon.com/pricing/',
  gcp: 'https://cloud.google.com/pricing',
  azure: 'https://azure.microsoft.com/pricing/',
  cloudflare: 'https://www.cloudflare.com/plans/',
  netlify: 'https://www.netlify.com/pricing/',
  mongodb: 'https://www.mongodb.com/pricing',
  stripe: 'https://stripe.com/pricing',
  sendgrid: 'https://sendgrid.com/pricing/',
  twilio: 'https://www.twilio.com/pricing',
  firebase: 'https://firebase.google.com/pricing',
  render: 'https://render.com/pricing',
  railway: 'https://railway.app/pricing',
  heroku: 'https://www.heroku.com/pricing',
  digitalocean: 'https://www.digitalocean.com/pricing/',
  datadog: 'https://www.datadoghq.com/pricing/',
  sentry: 'https://sentry.io/pricing/',
  algolia: 'https://www.algolia.com/pricing/',
  upstash: 'https://upstash.com/pricing',
  planetscale: 'https://planetscale.com/pricing',
  neon: 'https://neon.tech/pricing',
  resend: 'https://resend.com/pricing',
  postmark: 'https://postmarkapp.com/pricing',
  slack: 'https://slack.com/pricing',
  figma: 'https://www.figma.com/pricing/',
  linear: 'https://linear.app/pricing',
  groq: 'https://groq.com/pricing/',
  fly: 'https://fly.io/pricing',
  mixpanel: 'https://mixpanel.com/pricing/',
  contentful: 'https://www.contentful.com/pricing/',
  algolia_search: 'https://www.algolia.com/pricing/',
  trigger: 'https://trigger.dev/pricing',
  launchdarkly: 'https://launchdarkly.com/pricing/',
};

/** 서비스 slug → 비용/사용량 페이지 URL */
const SERVICE_COST_URLS: Record<string, string> = {
  openai: 'https://platform.openai.com/usage',
  anthropic: 'https://console.anthropic.com/settings/usage',
  vercel: 'https://vercel.com/account/usage',
  supabase: 'https://supabase.com/dashboard/org/_/billing',
  github: 'https://github.com/settings/billing/summary',
  aws: 'https://console.aws.amazon.com/billing/home',
  gcp: 'https://console.cloud.google.com/billing',
  azure: 'https://portal.azure.com/#blade/Microsoft_Azure_Billing/BillingMenuBlade/overview',
  cloudflare: 'https://dash.cloudflare.com/?to=/:account/billing',
  netlify: 'https://app.netlify.com/account/billing',
  mongodb: 'https://cloud.mongodb.com/v2#/billing/overview',
  stripe: 'https://dashboard.stripe.com/billing',
  sendgrid: 'https://app.sendgrid.com/account/billing',
  twilio: 'https://console.twilio.com/us1/billing/usage',
  firebase: 'https://console.firebase.google.com/project/_/usage',
  render: 'https://dashboard.render.com/billing',
  railway: 'https://railway.app/account/billing',
  heroku: 'https://dashboard.heroku.com/account/billing',
  digitalocean: 'https://cloud.digitalocean.com/account/billing',
  datadog: 'https://app.datadoghq.com/billing/usage',
  sentry: 'https://sentry.io/settings/billing/overview/',
  algolia: 'https://dashboard.algolia.com/account/billing',
  upstash: 'https://console.upstash.com/account/billing',
  planetscale: 'https://app.planetscale.com/account/billing',
  neon: 'https://console.neon.tech/app/billing',
  resend: 'https://resend.com/settings/billing',
  postmark: 'https://account.postmarkapp.com/subscription',
  slack: 'https://slack.com/account/billing',
  linear: 'https://linear.app/settings/billing',
};

interface CostServiceListProps {
  projectId: string;
  services: ServiceCostEntry[];
  budgetCurrency: 'USD' | 'KRW';
  usdToKrw?: number | null;
}

const BILLING_CYCLE_LABELS: Record<string, string> = {
  monthly: '월',
  yearly: '연',
  one_time: '일회성',
  usage_based: '사용량 기반',
};

export function CostServiceList({ projectId, services, budgetCurrency, usdToKrw }: CostServiceListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const updateCost = useUpdateServiceCost(projectId);

  const showKrw = budgetCurrency === 'USD' && usdToKrw != null;

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

  // 비용 높은순 정렬 (실사용량 > 월비용 > 미설정)
  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => {
      const costA = a.actualCostMonthly ?? a.monthlyCost;
      const costB = b.actualCostMonthly ?? b.monthlyCost;
      return costB - costA;
    });
  }, [services]);

  if (sortedServices.length === 0) {
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
        {sortedServices.map((entry) => {
          const isExpanded = expandedId === entry.projectServiceId;
          const isOpenAI = entry.serviceSlug === 'openai';
          const hasCost =
            entry.actualCostMonthly != null ||
            entry.monthlyCost > 0 ||
            entry.costTierId ||
            entry.isCustomCost;
          const displayCost = entry.actualCostMonthly ?? entry.monthlyCost;
          const costUrl = SERVICE_COST_URLS[entry.serviceSlug];
          const pricingUrl = SERVICE_PRICING_URLS[entry.serviceSlug];

          // 3단계 비용 상태: free / paid / unset
          const isFree =
            (entry.costTierId != null || entry.isCustomCost) &&
            entry.monthlyCost === 0 &&
            entry.actualCostMonthly == null;
          const isUnset = !entry.costTierId && !entry.isCustomCost && entry.actualCostMonthly == null;

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

                {/* 서비스명 + 사용량 대시보드 링크 */}
                <span className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">{entry.serviceName}</span>
                  {costUrl && (
                    <a
                      href={costUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-muted-foreground hover:text-brand-blue hover:bg-brand-blue/10 transition-colors"
                    >
                      <BarChart2 className="h-3 w-3" />
                      사용량 확인
                    </a>
                  )}
                </span>

                {isFree ? (
                  /* 무료 배지 */
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
                  >
                    무료
                  </Badge>
                ) : hasCost ? (
                  /* 유료: 금액 표시 */
                  <div className="flex flex-col items-end gap-0.5">
                    <div className="flex items-center gap-2">
                      {entry.actualCostMonthly != null ? (
                        <Badge
                          variant="secondary"
                          className="text-xs font-mono bg-brand-blue/10 text-brand-blue border-brand-blue/20"
                        >
                          실사용량
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs font-mono">
                          {entry.isCustomCost ? '커스텀' : (entry.tierName ?? '')}
                        </Badge>
                      )}
                      <span className="text-sm font-mono font-medium">
                        {formatCurrency(displayCost, budgetCurrency)}
                        <span className="text-muted-foreground text-xs">
                          /{BILLING_CYCLE_LABELS[entry.billingCycle] ?? entry.billingCycle}
                        </span>
                      </span>
                    </div>
                    {showKrw && displayCost > 0 && (
                      <span className="text-xs text-muted-foreground font-mono">
                        ≈ ₩{Math.round(displayCost * usdToKrw!).toLocaleString('ko-KR')}
                        /{BILLING_CYCLE_LABELS[entry.billingCycle] ?? entry.billingCycle}
                      </span>
                    )}
                  </div>
                ) : isUnset ? (
                  /* 미설정 배지 */
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs text-muted-foreground border-dashed"
                    >
                      비용 미설정
                    </Badge>
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
                <div className="mt-3 ml-7 pl-3 border-l-2 border-muted space-y-4">
                  {/* OpenAI: 실제 사용량 패널 먼저 표시 */}
                  {isOpenAI && (
                    <CostOpenAIUsagePanel
                      projectId={projectId}
                      projectServiceId={entry.projectServiceId}
                      usdToKrw={usdToKrw}
                    />
                  )}

                  {/* 요금제 / 커스텀 입력 (OpenAI 포함 모든 서비스) */}
                  <CostTierSelector
                    serviceId={entry.serviceId}
                    currentTierId={entry.costTierId}
                    currentCustomMonthly={entry.isCustomCost ? entry.monthlyCost : null}
                    currentCostNotes={entry.costNotes}
                    currentBillingCycle={entry.billingCycle}
                    isPending={updateCost.isPending}
                    budgetCurrency={budgetCurrency}
                    pricingUrl={pricingUrl}
                    onSave={(data) => handleSave(entry, data)}
                    onCancel={() => setExpandedId(null)}
                  />

                  {/* 인보이스·영수증 첨부 */}
                  <CostAttachmentsPanel
                    projectId={projectId}
                    projectServiceId={entry.projectServiceId}
                    serviceName={entry.serviceName}
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
