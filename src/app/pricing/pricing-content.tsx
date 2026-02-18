'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

interface Plan {
  nameKey: string;
  price: string;
  featureKeys: string[];
  isFree: boolean;
  popular: boolean;
}

const plans: Plan[] = [
  {
    nameKey: 'pricing.planFree',
    price: '0',
    featureKeys: ['pricing.freeF1', 'pricing.freeF2', 'pricing.freeF3', 'pricing.freeF4', 'pricing.freeF5'],
    isFree: true,
    popular: false,
  },
  {
    nameKey: 'pricing.planPro',
    price: '9,900',
    featureKeys: ['pricing.proF1', 'pricing.proF2', 'pricing.proF3', 'pricing.proF4', 'pricing.proF5', 'pricing.proF6'],
    isFree: false,
    popular: true,
  },
  {
    nameKey: 'pricing.planTeam',
    price: '29,900',
    featureKeys: ['pricing.teamF1', 'pricing.teamF2', 'pricing.teamF3', 'pricing.teamF4', 'pricing.teamF5', 'pricing.teamF6', 'pricing.teamF7'],
    isFree: false,
    popular: false,
  },
];

export function PricingContent() {
  const { locale } = useLocaleStore();

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
          <Card key={plan.nameKey} className={plan.popular ? 'border-primary shadow-lg relative' : ''}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t(locale, 'pricing.recommended')}</Badge>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">{t(locale, plan.nameKey)}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}{t(locale, 'pricing.currency')}</span>
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
                disabled={plan.isFree}
              >
                {plan.isFree ? t(locale, 'pricing.currentPlan') : t(locale, 'pricing.upgrade')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
