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

interface Plan {
  nameKey: string;
  price: string;
  featureKeys: string[];
  isFree: boolean;
  popular: boolean;
  planKey: SubscriptionPlan;
  productEnvKey: string;
}

const plans: Plan[] = [
  {
    nameKey: 'pricing.planFree',
    price: '$0',
    featureKeys: ['pricing.freeF1', 'pricing.freeF2', 'pricing.freeF3', 'pricing.freeF4', 'pricing.freeF5', 'pricing.freeF6', 'pricing.freeF7'],
    isFree: true,
    popular: false,
    planKey: 'free',
    productEnvKey: '',
  },
  {
    nameKey: 'pricing.planPro',
    price: '$9.9',
    featureKeys: ['pricing.proF1', 'pricing.proF2', 'pricing.proF3', 'pricing.proF4', 'pricing.proF5'],
    isFree: false,
    popular: true,
    planKey: 'pro',
    productEnvKey: 'NEXT_PUBLIC_POLAR_PRODUCT_PRO',
  },
  {
    nameKey: 'pricing.planTeam',
    price: '$29',
    featureKeys: ['pricing.teamF1', 'pricing.teamF2', 'pricing.teamF3', 'pricing.teamF4', 'pricing.teamF5', 'pricing.teamF6', 'pricing.teamF7'],
    isFree: false,
    popular: false,
    planKey: 'team',
    productEnvKey: 'NEXT_PUBLIC_POLAR_PRODUCT_TEAM',
  },
];

const productIdMap: Record<string, string | undefined> = {
  NEXT_PUBLIC_POLAR_PRODUCT_PRO: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO,
  NEXT_PUBLIC_POLAR_PRODUCT_TEAM: process.env.NEXT_PUBLIC_POLAR_PRODUCT_TEAM,
};

export function PricingContent() {
  const { locale } = useLocaleStore();
  const router = useRouter();
  const { data: subscription } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlan | null>(null);

  const currentPlan: SubscriptionPlan = subscription?.plan ?? 'free';

  async function handleUpgrade(plan: Plan) {
    if (plan.isFree) return;

    const productId = productIdMap[plan.productEnvKey];
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
                <span className="text-4xl font-bold">{plan.price}</span>
                {!plan.isFree && <span className="text-muted-foreground">{t(locale, 'pricing.perMonth')}</span>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
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
