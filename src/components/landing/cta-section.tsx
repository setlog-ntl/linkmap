'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Users, Sparkles } from 'lucide-react';
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
    <section className="py-12 sm:py-16 lg:py-24 bg-background" id="pricing">
      {/* Top divider */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-4 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-blue" />
              PRICING
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">{t(locale, 'landing.pricingTitle')}</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t(locale, 'landing.pricingDesc')}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto items-start">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <div
                className={`rounded-2xl p-5 sm:p-7 flex flex-col h-full transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-card border-2 border-brand-blue relative md:scale-[1.03] shadow-lg ring-1 ring-brand-blue/10'
                    : 'bg-card border border-border hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-blue px-4 py-1 text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    {t(locale, 'landing.planPopular')}
                  </div>
                )}
                <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{plan.description}</p>

                <div className="mt-6 mb-6 h-px bg-border" />

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm text-foreground/85">
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full mr-3 mt-0.5 ${plan.highlighted ? 'bg-brand-blue/10' : 'bg-brand-blue-light'}`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? 'text-brand-blue' : 'text-brand-blue'}`} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-8 w-full rounded-xl py-3 h-auto text-sm font-bold transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-brand-blue text-white hover:bg-brand-blue/90 hover:shadow-md active:scale-[0.98]'
                      : 'bg-muted border border-border text-foreground hover:bg-muted/80 dark:bg-secondary dark:hover:bg-secondary/80'
                  }`}
                  asChild
                >
                  <Link href={signupHref} prefetch={false}>{plan.cta}</Link>
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
    <section className="py-12 sm:py-20 lg:py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--circuit-950)' }}>
      {/* Dot pattern background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
      {/* Subtle gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-blue/[0.08] rounded-full blur-[100px] pointer-events-none" />

      <ScrollReveal>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          {/* Social proof pill */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 text-sm text-white/80 font-medium">
            <Users className="w-4 h-4" />
            {t(locale, 'landing.finalCtaSocialProof')}
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 sm:mb-6 text-white leading-tight">{t(locale, 'landing.finalCtaTitle')}</h2>
          <p className="text-base sm:text-lg text-white/60 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">{t(locale, 'landing.finalCtaDesc')}</p>
          <Button className="bg-brand-green text-black hover:bg-brand-green/90 px-7 py-3 sm:px-10 sm:py-4 h-auto rounded-xl text-base font-bold transition-all duration-200 hover:shadow-[0_4px_24px_rgba(16,185,129,0.3)] active:scale-[0.98]" asChild>
            <Link href={signupHref} prefetch={false}>
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
