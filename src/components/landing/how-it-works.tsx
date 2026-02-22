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
      className="py-24 bg-[#f4f5f8] border-y border-[#dde0e7] dark:bg-[#0b1120] dark:border-white/10"
      id="how-it-works"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(220,60%,35%)] mb-3 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[hsl(220,60%,35%)]" />
              HOW IT WORKS
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-[#1a2740] dark:text-[#e2e8f0]">
              {t(locale, 'landing.howTitle')}
            </h2>
            <p className="mt-2 text-base text-[#63738a] dark:text-[#94a3b8]">
              {t(locale, 'landing.howDesc')}
            </p>
          </div>
        </ScrollReveal>

        {/* Persona Tabs */}
        <div className="flex justify-center gap-3 mb-14">
          <button
            onClick={() => setPersona('beginner')}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
              persona === 'beginner'
                ? 'bg-[#2bee79] text-black shadow-md'
                : 'bg-white border border-[#dde0e7] text-[#63738a] hover:border-[hsl(220,60%,35%)]/40 dark:bg-white/5 dark:border-white/10 dark:text-[#94a3b8] dark:hover:border-white/20'
            }`}
          >
            <Rocket className="w-4 h-4" />
            {t(locale, 'landing.howTabBeginner')}
          </button>
          <button
            onClick={() => setPersona('developer')}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
              persona === 'developer'
                ? 'bg-[hsl(220,60%,35%)] text-white shadow-md'
                : 'bg-white border border-[#dde0e7] text-[#63738a] hover:border-[hsl(220,60%,35%)]/40 dark:bg-white/5 dark:border-white/10 dark:text-[#94a3b8] dark:hover:border-white/20'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {t(locale, 'landing.howTabDeveloper')}
          </button>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-px z-0">
            <div className="h-full bg-gradient-to-r from-[#dde0e7] via-[hsl(220,60%,35%)]/40 to-[#dde0e7] dark:from-[#475569] dark:via-[hsl(220,60%,50%)]/40 dark:to-[#475569]" />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={`${persona}-${i}`} delay={i * 0.15}>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-[#dde0e7] shadow-md dark:bg-[#111827] dark:border-white/10 mb-6 transition-transform hover:scale-105">
                    <span className="text-2xl font-bold text-[hsl(220,60%,35%)]">
                      {step.number}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-[hsl(220,60%,35%)]" />
                    <h3 className="text-xl font-bold text-[#1a2740] dark:text-[#e2e8f0]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#63738a] dark:text-[#94a3b8] max-w-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button
            className={
              persona === 'beginner'
                ? 'bg-[#2bee79] text-black hover:bg-[#25d96d] px-6 py-2.5 h-auto rounded-lg font-bold'
                : 'bg-[hsl(220,60%,35%)] text-white hover:bg-[hsl(220,60%,30%)] px-6 py-2.5 h-auto rounded-lg font-bold'
            }
            asChild
          >
            <Link href={ctaHref}>
              {persona === 'beginner' && (
                <Rocket className="mr-2 h-4 w-4" />
              )}
              {ctaText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
