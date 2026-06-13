'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';
import { useSubscription } from '@/lib/queries/subscription';
import type { SubscriptionPlan } from '@/types';

type BillingPeriod = 'monthly' | 'yearly';

interface Plan {
  nameKey: string;
  monthlyPrice: string;
  yearlyPrice: string;
  yearlyMonthlyEquiv: string;
  /** 원클릭(홈페이지) 배포 계정당 한도 — quota.ts/plan_quotas의 max_homepage_deploys와 동기화 */
  deployLimit: number;
  featureKeys: string[];
  isFree: boolean;
  popular: boolean;
  planKey: SubscriptionPlan;
  productEnvKey: string;
  productEnvKeyYearly: string;
}

const plans: Plan[] = [
  {
    nameKey: 'pricing.planFree',
    monthlyPrice: '$0',
    yearlyPrice: '$0',
    yearlyMonthlyEquiv: '$0',
    deployLimit: 3,
    featureKeys: ['pricing.freeF1', 'pricing.freeF2', 'pricing.freeF3', 'pricing.freeF4', 'pricing.freeF5', 'pricing.freeF6', 'pricing.freeF7'],
    isFree: true,
    popular: false,
    planKey: 'free',
    productEnvKey: '',
    productEnvKeyYearly: '',
  },
  {
    nameKey: 'pricing.planPro',
    monthlyPrice: '$9.9',
    yearlyPrice: '$99',
    yearlyMonthlyEquiv: '$8.25',
    deployLimit: 10,
    featureKeys: ['pricing.proF1', 'pricing.proF2', 'pricing.proF3', 'pricing.proF4', 'pricing.proF5', 'pricing.proF6', 'pricing.proF7'],
    isFree: false,
    popular: true,
    planKey: 'pro',
    productEnvKey: 'NEXT_PUBLIC_POLAR_PRODUCT_PRO',
    productEnvKeyYearly: 'NEXT_PUBLIC_POLAR_PRODUCT_PRO_YEARLY',
  },
  {
    nameKey: 'pricing.planTeam',
    monthlyPrice: '$29',
    yearlyPrice: '$290',
    yearlyMonthlyEquiv: '$24.17',
    deployLimit: 50,
    featureKeys: ['pricing.teamF1', 'pricing.teamF2', 'pricing.teamF3', 'pricing.teamF4', 'pricing.teamF5', 'pricing.teamF6', 'pricing.teamF7'],
    isFree: false,
    popular: false,
    planKey: 'team',
    productEnvKey: 'NEXT_PUBLIC_POLAR_PRODUCT_TEAM',
    productEnvKeyYearly: 'NEXT_PUBLIC_POLAR_PRODUCT_TEAM_YEARLY',
  },
];

const productIdMap: Record<string, string | undefined> = {
  NEXT_PUBLIC_POLAR_PRODUCT_PRO: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO,
  NEXT_PUBLIC_POLAR_PRODUCT_TEAM: process.env.NEXT_PUBLIC_POLAR_PRODUCT_TEAM,
  NEXT_PUBLIC_POLAR_PRODUCT_PRO_YEARLY: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO_YEARLY,
  NEXT_PUBLIC_POLAR_PRODUCT_TEAM_YEARLY: process.env.NEXT_PUBLIC_POLAR_PRODUCT_TEAM_YEARLY,
};

export function PricingContent() {
  const { locale } = useLocaleStore();
  const router = useRouter();
  const { data: subscription } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlan | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  const isYearly = billingPeriod === 'yearly';
  const currentPlan: SubscriptionPlan = subscription?.plan ?? 'free';

  async function handleUpgrade(plan: Plan) {
    if (plan.isFree) return;

    const envKey = isYearly ? plan.productEnvKeyYearly : plan.productEnvKey;
    const productId = productIdMap[envKey];
    if (!productId) {
      toast.info('서비스 안정화 후 결제가 연결될 예정입니다. 조금만 기다려 주세요!');
      return;
    }

    setLoadingPlan(plan.planKey);
    try {
      const res = await fetch('/api/polar/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.error || '결제 페이지 이동에 실패했습니다');
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error('네트워크 오류가 발생했습니다');
    } finally {
      setLoadingPlan(null);
    }
  }

  function getButtonLabel(plan: Plan): string {
    if (plan.planKey === 'team') return t(locale, 'pricing.comingSoon');
    if (plan.planKey === currentPlan) return t(locale, 'pricing.currentPlan');
    if (plan.isFree && currentPlan === 'free') return t(locale, 'pricing.currentPlan');
    if (plan.isFree) return '무료 플랜';
    return t(locale, 'pricing.upgrade');
  }

  function isButtonDisabled(plan: Plan): boolean {
    return plan.planKey === currentPlan || (plan.isFree && currentPlan !== 'free') || plan.planKey === 'team' || loadingPlan !== null;
  }

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t(locale, 'pricing.title')}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t(locale, 'pricing.subtitle')}
        </p>

        {/* 월간/연간 토글 */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            {t(locale, 'pricing.monthly')}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isYearly}
            onClick={() => setBillingPeriod(isYearly ? 'monthly' : 'yearly')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isYearly ? 'bg-primary' : 'bg-muted'}`}
          >
            <span className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${isYearly ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            {t(locale, 'pricing.yearly')}
          </span>
          {isYearly && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {t(locale, 'pricing.yearlyDiscount')}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.nameKey} className={`${plan.planKey === currentPlan ? 'border-primary shadow-lg ring-2 ring-primary/20' : plan.popular && currentPlan === 'free' ? 'border-primary shadow-lg' : ''} ${plan.planKey === 'team' && currentPlan !== 'team' ? 'opacity-60' : ''} relative`}>
            {plan.planKey === currentPlan && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 hover:bg-green-600">{t(locale, 'pricing.currentPlan')}</Badge>
            )}
            {plan.popular && plan.planKey !== currentPlan && currentPlan === 'free' && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t(locale, 'pricing.recommended')}</Badge>
            )}
            {plan.planKey === 'team' && plan.planKey !== currentPlan && (
              <Badge variant="secondary" className="absolute -top-3 left-1/2 -translate-x-1/2">{t(locale, 'pricing.comingSoon')}</Badge>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">{t(locale, plan.nameKey)}</CardTitle>
              <div className="mt-4">
                {isYearly && !plan.isFree ? (
                  <>
                    <span className="text-4xl font-bold">{plan.yearlyMonthlyEquiv}</span>
                    <span className="text-muted-foreground">{t(locale, 'pricing.perMonth')}</span>
                    <div className="mt-1">
                      <span className="text-sm text-muted-foreground line-through">{plan.monthlyPrice}{t(locale, 'pricing.perMonth')}</span>
                      <span className="text-sm text-muted-foreground ml-2">{plan.yearlyPrice}{t(locale, 'pricing.perYear')}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold">{plan.monthlyPrice}</span>
                    {!plan.isFree && <span className="text-muted-foreground">{t(locale, 'pricing.perMonth')}</span>}
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  {locale === 'ko'
                    ? `원클릭 배포 ${plan.deployLimit}개`
                    : `${plan.deployLimit} one-click deploys`}
                </li>
                {plan.featureKeys.map((key) => (
                  <li key={key} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    {t(locale, key)}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                disabled={isButtonDisabled(plan)}
                onClick={() => handleUpgrade(plan)}
              >
                {loadingPlan === plan.planKey ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  getButtonLabel(plan)
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
