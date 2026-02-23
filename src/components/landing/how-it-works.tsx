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
  const activeColor = persona === 'beginner' ? 'brand-green' : 'brand-blue';

  const ctaHref = persona === 'beginner' ? '/sites' : '/signup';
  const ctaText =
    persona === 'beginner'
      ? t(locale, 'landing.ctaOneclickHero')
      : t(locale, 'landing.ctaStart');

  return (
    <section
      className="py-24 relative overflow-hidden bg-background"
      id="how-it-works"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_100%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className={`text-xs font-bold uppercase tracking-widest text-${activeColor} mb-4 flex items-center justify-center gap-2 drop-shadow-[0_0_8px_rgba(var(--${activeColor}-rgb),0.4)]`}>
              <span className={`inline-block w-2 h-2 rounded-full bg-${activeColor} animate-pulse`} />
              HOW TO START
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground drop-shadow-sm">
              {t(locale, 'landing.howTitle')}
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t(locale, 'landing.howDesc')}
            </p>
          </div>
        </ScrollReveal>

        {/* Persona Tabs */}
        <div className="flex justify-center gap-4 mb-20 relative z-20">
          <button
            onClick={() => setPersona('beginner')}
            className={`group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition-all duration-300 ${persona === 'beginner'
                ? 'bg-brand-green/10 text-brand-green border border-brand-green/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-card/40 backdrop-blur-md border border-border/40 text-muted-foreground hover:border-brand-green/30 hover:bg-card/80'
              }`}
          >
            <Rocket className={`w-5 h-5 transition-transform ${persona === 'beginner' ? 'scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'group-hover:-translate-y-0.5'}`} />
            {t(locale, 'landing.howTabBeginner')}
          </button>

          <button
            onClick={() => setPersona('developer')}
            className={`group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition-all duration-300 ${persona === 'developer'
                ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                : 'bg-card/40 backdrop-blur-md border border-border/40 text-muted-foreground hover:border-brand-blue/30 hover:bg-card/80'
              }`}
          >
            <Sparkles className={`w-5 h-5 transition-transform ${persona === 'developer' ? 'scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'group-hover:rotate-12'}`} />
            {t(locale, 'landing.howTabDeveloper')}
          </button>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] z-0 overflow-hidden rounded-full bg-border/40">
            <div className={`h-full bg-gradient-to-r from-transparent via-${activeColor} to-transparent w-full -translate-x-full animate-[shimmer_3s_infinite] opacity-70`} />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={`${persona}-${i}`} delay={i * 0.15}>
                <div className="relative z-10 flex flex-col items-center text-center group">
                  <div className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg mb-8 transition-all duration-500 group-hover:-translate-y-2 group-hover:border-${activeColor}/50 group-hover:shadow-[0_10px_30px_rgba(var(--${activeColor}-rgb),0.15)] relative overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-b from-${activeColor}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <span className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground/30 absolute -top-4 -right-2 opacity-20 user-select-none`}>
                      {step.number}
                    </span>
                    <Icon className={`w-10 h-10 text-${activeColor} drop-shadow-[0_0_10px_rgba(var(--${activeColor}-rgb),0.5)] transition-transform duration-500 group-hover:scale-110`} />
                  </div>

                  <h3 className="text-xl font-bold text-foreground tracking-tight mb-3">
                    {step.title}
                  </h3>
                  <p className="text-base text-muted-foreground/80 max-w-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Button
            className={
              persona === 'beginner'
                ? 'bg-brand-green text-black hover:bg-brand-green/85 px-10 py-4 h-auto rounded-xl text-base font-bold transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                : 'bg-brand-blue text-white hover:bg-brand-blue/85 px-10 py-4 h-auto rounded-xl text-base font-bold transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(59,130,246,0.35)]'
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

      {/* Global shimmer animation definition for the connecting line */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}

