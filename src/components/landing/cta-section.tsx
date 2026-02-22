'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Users } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { createClient } from '@/lib/supabase/client';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

function useSignupHref() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);
  return isLoggedIn ? '/dashboard' : '/signup';
}

export function PricingSection() {
  const { locale } = useLocaleStore();
  const signupHref = useSignupHref();

  const plans = [
    {
      name: 'Free',
      price: '$0',
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
      price: '$9.9',
      period: t(locale, 'landing.planPeriod'),
      description: t(locale, 'landing.planProDesc'),
      features: [
        t(locale, 'landing.planProF1'),
        t(locale, 'landing.planProF2'),
        t(locale, 'landing.planProF3'),
        t(locale, 'landing.planProF4'),
        t(locale, 'landing.planProF5'),
        t(locale, 'landing.planProF6'),
        t(locale, 'landing.planProF7'),
      ],
      highlighted: true,
      cta: t(locale, 'landing.planCtaButton'),
    },
    {
      name: 'Team',
      price: '$29',
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
    <section className="py-24 bg-[#f4f5f8] border-t border-[#dde0e7] dark:bg-[#0b1120] dark:border-white/10" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(220,60%,35%)] mb-3 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[hsl(220,60%,35%)]" />
              PRICING
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-[#1a2740] dark:text-[#e2e8f0]">{t(locale, 'landing.pricingTitle')}</h2>
            <p className="mt-4 text-lg text-[#63738a] dark:text-[#94a3b8] max-w-2xl mx-auto">{t(locale, 'landing.pricingDesc')}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <div
                className={`rounded-2xl p-8 flex flex-col h-full transition-all ${
                  plan.highlighted
                    ? 'bg-white border-2 border-[hsl(220,60%,35%)] relative transform md:scale-105 shadow-lg dark:bg-[#111827]'
                    : 'bg-white border border-[#dde0e7] hover:shadow-md hover:-translate-y-0.5 dark:bg-[#111827] dark:border-white/10'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[hsl(220,60%,35%)] px-4 py-1 text-xs font-bold text-white uppercase tracking-wide">
                    {t(locale, 'landing.planPopular')}
                  </div>
                )}
                <h3 className="text-lg font-bold text-[#1a2740] dark:text-[#e2e8f0]">{plan.name}</h3>
                <p className="text-4xl font-bold mt-4 text-[#1a2740] dark:text-[#e2e8f0]">
                  {plan.price}
                  {plan.period && <span className="text-lg font-normal text-[#63738a] dark:text-[#94a3b8]">{plan.period}</span>}
                </p>
                <p className="text-sm text-[#63738a] dark:text-[#94a3b8] mt-2">{plan.description}</p>
                <ul className="mt-8 space-y-4 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className={`flex items-center text-sm ${plan.highlighted ? 'text-[#1a2740] dark:text-[#e2e8f0]' : 'text-[#1a2740]/80 dark:text-[#e2e8f0]/80'}`}>
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[hsl(220,60%,92%)] dark:bg-[hsl(220,60%,20%)] mr-3">
                        <Check className="w-3 h-3 text-[hsl(220,60%,35%)]" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-8 w-full rounded-lg py-3 h-auto text-sm font-bold transition-all ${
                    plan.highlighted
                      ? 'bg-[hsl(220,60%,35%)] text-white hover:bg-[hsl(220,60%,30%)] hover:shadow-lg'
                      : 'bg-[#f4f5f8] border border-[#dde0e7] text-[#1a2740] hover:bg-[#ebedf2] dark:bg-white/5 dark:border-white/10 dark:text-[#e2e8f0] dark:hover:bg-white/10'
                  }`}
                  asChild
                >
                  <Link href={signupHref}>{plan.cta}</Link>
                </Button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  const { locale } = useLocaleStore();
  const signupHref = useSignupHref();

  return (
    <section className="py-24 bg-[hsl(220,60%,35%)] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <ScrollReveal>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          {/* Social proof */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white/90">
            <Users className="w-4 h-4" />
            {t(locale, 'landing.finalCtaSocialProof')}
          </div>

          <h2 className="text-4xl font-bold tracking-tight mb-6 sm:text-5xl text-white">{t(locale, 'landing.finalCtaTitle')}</h2>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">{t(locale, 'landing.finalCtaDesc')}</p>
          <Button className="bg-[#2bee79] text-black hover:bg-emerald-400 px-10 py-4 h-auto rounded-lg text-base font-bold transition-all hover:scale-105 hover:shadow-lg" asChild>
            <Link href={signupHref}>
              {t(locale, 'landing.ctaStart')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
}

/** @deprecated Use PricingSection and FinalCtaSection separately */
export function CtaSection() {
  return (
    <>
      <PricingSection />
      <FinalCtaSection />
    </>
  );
}
