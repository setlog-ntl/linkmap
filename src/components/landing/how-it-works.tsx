'use client';

import { useState } from 'react';
import { ScrollReveal } from './scroll-reveal';
import {
  FolderPlus,
  Puzzle,
  Lock,
  Sparkles,
  ArrowRight,
  LogIn,
  Layout,
  Pencil,
  Globe,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

type Persona = 'beginner' | 'developer';

export function HowItWorks() {
  const { locale } = useLocaleStore();
  const [persona, setPersona] = useState<Persona>('beginner');

  const beginnerSteps = [
    {
      number: '1',
      icon: LogIn,
      title: t(locale, 'landing.oneclickStep1Title'),
      description: t(locale, 'landing.oneclickStep1Desc'),
    },
    {
      number: '2',
      icon: Layout,
      title: t(locale, 'landing.oneclickStep2Title'),
      description: t(locale, 'landing.oneclickStep2Desc'),
    },
    {
      number: '3',
      icon: Pencil,
      title: t(locale, 'landing.oneclickStep3Title'),
      description: t(locale, 'landing.oneclickStep3Desc'),
    },
    {
      number: '4',
      icon: Globe,
      title: t(locale, 'landing.oneclickStep4Title'),
      description: t(locale, 'landing.oneclickStep4Desc'),
    },
  ];

  const developerSteps = [
    {
      number: '1',
      icon: FolderPlus,
      title: t(locale, 'landing.step1Title'),
      description: t(locale, 'landing.step1Desc'),
    },
    {
      number: '2',
      icon: Puzzle,
      title: t(locale, 'landing.step2Title'),
      description: t(locale, 'landing.step2Desc'),
    },
    {
      number: '3',
      icon: Lock,
      title: t(locale, 'landing.step3Title'),
      description: t(locale, 'landing.step3Desc'),
    },
    {
      number: '4',
      icon: Sparkles,
      title: t(locale, 'landing.step4Title'),
      description: t(locale, 'landing.step4Desc'),
    },
  ];

  const steps = persona === 'beginner' ? beginnerSteps : developerSteps;

  const ctaHref = persona === 'beginner' ? '/sites' : '/signup';
  const ctaText =
    persona === 'beginner'
      ? t(locale, 'landing.ctaOneclickHero')
      : t(locale, 'landing.ctaStart');

  return (
    <section
      className="py-12 sm:py-16 lg:py-24 relative overflow-hidden bg-background"
      id="how-it-works"
    >
      {/* Subtle background radial */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-green mb-4 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              HOW TO START
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              {t(locale, 'landing.howTitle')}
            </h2>
            <p className="mt-3 sm:mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t(locale, 'landing.howDesc')}
            </p>
          </div>
        </ScrollReveal>

        {/* Persona Tabs - clean pill style */}
        <div className="flex justify-center mb-12 sm:mb-20 relative z-20">
          <div className="inline-flex gap-1 sm:gap-2 rounded-xl bg-muted/70 dark:bg-secondary/70 p-1.5 border border-border">
            <button
              onClick={() => setPersona('beginner')}
              className={`group inline-flex items-center gap-1.5 sm:gap-2 rounded-lg px-4 py-2 sm:px-6 sm:py-2.5 text-sm font-bold transition-all duration-200 ${persona === 'beginner'
                  ? 'bg-card text-brand-green shadow-sm border border-brand-green/20'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Rocket className={`w-4 h-4 transition-transform ${persona === 'beginner' ? 'text-brand-green' : 'group-hover:-translate-y-0.5'}`} />
              {t(locale, 'landing.howTabBeginner')}
            </button>

            <button
              onClick={() => setPersona('developer')}
              className={`group inline-flex items-center gap-1.5 sm:gap-2 rounded-lg px-4 py-2 sm:px-6 sm:py-2.5 text-sm font-bold transition-all duration-200 ${persona === 'developer'
                  ? 'bg-card text-brand-blue shadow-sm border border-brand-blue/20'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Sparkles className={`w-4 h-4 transition-transform ${persona === 'developer' ? 'text-brand-blue' : 'group-hover:rotate-12'}`} />
              {t(locale, 'landing.howTabDeveloper')}
            </button>
          </div>
        </div>

        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px z-0">
            <div className={`h-full ${persona === 'beginner' ? 'bg-brand-green/20' : 'bg-brand-blue/20'} transition-colors duration-300`} />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            const activeColor = persona === 'beginner' ? 'brand-green' : 'brand-blue';
            return (
              <ScrollReveal key={`${persona}-${i}`} delay={i * 0.12}>
                <div className="relative z-10 flex flex-col items-center text-center group">
                  {/* Step circle */}
                  <div className={`flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-xl sm:rounded-2xl bg-card border border-border shadow-sm mb-4 sm:mb-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-${activeColor}/40 relative`}>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {step.number}
                    </span>
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${activeColor} transition-transform duration-300 group-hover:scale-110`} />
                  </div>

                  <h3 className="text-sm sm:text-lg font-bold text-foreground tracking-tight mb-1 sm:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-xs leading-relaxed hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 sm:mt-20 text-center">
          <Button
            className={
              persona === 'beginner'
                ? 'bg-brand-green text-black hover:bg-brand-green/90 px-7 py-3 sm:px-10 sm:py-4 h-auto rounded-xl text-base font-bold transition-all duration-200 hover:shadow-[0_4px_24px_rgba(16,185,129,0.25)] active:scale-[0.98]'
                : 'bg-brand-blue text-white hover:bg-brand-blue/90 px-7 py-3 sm:px-10 sm:py-4 h-auto rounded-xl text-base font-bold transition-all duration-200 hover:shadow-[0_4px_24px_rgba(59,130,246,0.25)] active:scale-[0.98]'
            }
            asChild
          >
            <Link href={ctaHref}>
              {persona === 'beginner' && (
                <Rocket className="mr-2 h-5 w-5" />
              )}
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
