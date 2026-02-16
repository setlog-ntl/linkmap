'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export function CtaSection() {
  const { locale } = useLocaleStore();

  const plans = [
    {
      name: 'Free',
      price: '₩0',
      period: t(locale, 'landing.planPeriod'),
      description: t(locale, 'landing.planFreeDesc'),
      features: [
        t(locale, 'landing.planFreeF1'),
        t(locale, 'landing.planFreeF2'),
        t(locale, 'landing.planFreeF3'),
        t(locale, 'landing.planFreeF4'),
      ],
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '₩9,900',
      period: t(locale, 'landing.planPeriod'),
      description: t(locale, 'landing.planProDesc'),
      features: [
        t(locale, 'landing.planProF1'),
        t(locale, 'landing.planProF2'),
        t(locale, 'landing.planProF3'),
        t(locale, 'landing.planProF4'),
        t(locale, 'landing.planProF5'),
      ],
      highlighted: true,
    },
    {
      name: 'Team',
      price: '₩29,900',
      period: t(locale, 'landing.planPeriod'),
      description: t(locale, 'landing.planTeamDesc'),
      features: [
        t(locale, 'landing.planTeamF1'),
        t(locale, 'landing.planTeamF2'),
        t(locale, 'landing.planTeamF3'),
        t(locale, 'landing.planTeamF4'),
        t(locale, 'landing.planTeamF5'),
      ],
      highlighted: false,
    },
  ];

  return (
    <section className="container py-14">
      {/* Pricing cards */}
      <ScrollReveal>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">{t(locale, 'landing.pricingTitle')}</h2>
          <p className="text-muted-foreground text-lg">
            {t(locale, 'landing.pricingDesc')}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
        {plans.map((plan, i) => (
          <ScrollReveal key={plan.name} delay={i * 0.1}>
            <div
              className={`rounded-2xl border p-6 flex flex-col h-full ${
                plan.highlighted
                  ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02] relative'
                  : 'bg-card'
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {t(locale, 'landing.planPopular')}
                </Badge>
              )}
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlighted ? 'default' : 'outline'}
                className="w-full"
                asChild
              >
                <Link href="/signup">{t(locale, 'landing.planCtaButton')}</Link>
              </Button>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Final CTA */}
      <ScrollReveal>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t(locale, 'landing.finalCtaTitle')}</h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t(locale, 'landing.finalCtaDesc')}
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              {t(locale, 'landing.ctaStart')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
}
