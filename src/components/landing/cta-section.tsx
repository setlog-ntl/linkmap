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
    <section className="container py-20">
      {/* Pricing cards */}
      <ScrollReveal>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t(locale, 'landing.pricingTitle')}</h2>
          <p className="text-muted-foreground text-lg">
            {t(locale, 'landing.pricingDesc')}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
        {plans.map((plan, i) => (
          <ScrollReveal key={plan.name} delay={i * 0.1}>
            <div
              className={`rounded-2xl border p-6 flex flex-col h-full transition-all duration-300 ${
                plan.highlighted
                  ? 'border-emerald-500/40 bg-emerald-500/[0.03] shadow-[0_0_40px_rgba(43,238,121,0.08)] scale-[1.02] relative'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.12]'
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black font-semibold hover:bg-emerald-600">
                  {t(locale, 'landing.planPopular')}
                </Badge>
              )}
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm">
                    <Check className={`w-4 h-4 shrink-0 ${plan.highlighted ? 'text-emerald-400' : 'text-emerald-500/60'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlighted ? 'default' : 'outline'}
                className={`w-full ${
                  plan.highlighted
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-[0_0_20px_rgba(43,238,121,0.2)]'
                    : 'border-white/[0.1] hover:bg-white/[0.05]'
                }`}
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
        <div className="relative max-w-2xl mx-auto text-center py-16 px-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.05] to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t(locale, 'landing.finalCtaTitle')}</h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t(locale, 'landing.finalCtaDesc')}
            </p>
            <Button size="lg" className="h-12 px-8 text-base rounded-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-[0_0_24px_rgba(43,238,121,0.3)] transition-all hover:shadow-[0_0_32px_rgba(43,238,121,0.4)]" asChild>
              <Link href="/signup">
                {t(locale, 'landing.ctaStart')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
