'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export function CtaSection() {
  const { locale } = useLocaleStore();

  const plans = [
    {
      name: 'Free',
      price: '₩0',
      period: '',
      description: t(locale, 'landing.planFreeDesc'),
      features: [
        t(locale, 'landing.planFreeF1'),
        t(locale, 'landing.planFreeF2'),
        t(locale, 'landing.planFreeF3'),
        t(locale, 'landing.planFreeF4'),
      ],
      highlighted: false,
      cta: t(locale, 'landing.planCtaButton'),
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
      cta: t(locale, 'landing.planCtaButton'),
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
      cta: t(locale, 'landing.planCtaButton'),
    },
  ];

  return (
    <>
      {/* Pricing */}
      <section className="py-24 bg-[#111] border-t border-zinc-800" id="pricing">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t(locale, 'landing.pricingTitle')}</h2>
              <p className="mt-4 text-lg text-gray-400">{t(locale, 'landing.pricingDesc')}</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <ScrollReveal key={plan.name} delay={i * 0.1}>
                <div
                  className={`rounded-xl p-8 flex flex-col h-full ${
                    plan.highlighted
                      ? 'bg-[#0a0a0a] border-2 border-[#2bee79] relative transform md:scale-105 shadow-[0_0_20px_rgba(43,238,121,0.1)]'
                      : 'bg-[#0a0a0a] border border-zinc-800'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2bee79] px-3 py-1 text-xs font-bold text-black uppercase">
                      {t(locale, 'landing.planPopular')}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-4xl font-bold text-white mt-4">
                    {plan.price}
                    {plan.period && <span className="text-lg font-normal text-gray-400">{plan.period}</span>}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">{plan.description}</p>
                  <ul className="mt-8 space-y-4 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className={`flex items-center text-sm ${plan.highlighted ? 'text-white' : 'text-gray-300'}`}>
                        <Check className="w-4 h-4 text-[#2bee79] mr-2 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-8 w-full rounded-md py-2.5 h-auto text-sm font-bold transition-colors ${
                      plan.highlighted
                        ? 'bg-[#2bee79] text-black hover:bg-green-400'
                        : 'bg-transparent border border-zinc-800 text-white hover:bg-[#111]'
                    }`}
                    asChild
                  >
                    <Link href="/signup">{plan.cta}</Link>
                  </Button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#0a0a0a]">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-6">{t(locale, 'landing.finalCtaTitle')}</h2>
            <p className="text-lg text-gray-400 mb-10">{t(locale, 'landing.finalCtaDesc')}</p>
            <Button className="bg-[#2bee79] text-black hover:bg-green-400 px-8 py-3.5 h-auto rounded-md text-base font-bold transition-all hover:scale-105" asChild>
              <Link href="/signup">{t(locale, 'landing.ctaStart')}</Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
