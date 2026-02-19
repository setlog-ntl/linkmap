'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
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
      <section className="py-24 bg-zinc-900/50 border-t border-zinc-800/60" id="pricing">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t(locale, 'landing.pricingTitle')}</h2>
              <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">{t(locale, 'landing.pricingDesc')}</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <ScrollReveal key={plan.name} delay={i * 0.1}>
                <div
                  className={`rounded-2xl p-8 flex flex-col h-full transition-all ${
                    plan.highlighted
                      ? 'bg-zinc-900/80 backdrop-blur-sm border-2 border-[#2bee79] relative transform md:scale-105 shadow-[0_0_30px_rgba(43,238,121,0.15)]'
                      : 'bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2bee79] px-4 py-1 text-xs font-bold text-black uppercase tracking-wide">
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
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2bee79]/10 mr-3">
                          <Check className="w-3 h-3 text-[#2bee79]" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-8 w-full rounded-lg py-3 h-auto text-sm font-bold transition-all ${
                      plan.highlighted
                        ? 'bg-[#2bee79] text-black hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(43,238,121,0.3)]'
                        : 'bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700'
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
      <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(43,238,121,0.08)_0%,transparent_70%)]" />
        <ScrollReveal>
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-6 sm:text-5xl">{t(locale, 'landing.finalCtaTitle')}</h2>
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">{t(locale, 'landing.finalCtaDesc')}</p>
            <Button className="bg-[#2bee79] text-black hover:bg-emerald-400 px-10 py-4 h-auto rounded-lg text-base font-bold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(43,238,121,0.3)]" asChild>
              <Link href="/signup">
                {t(locale, 'landing.ctaStart')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
