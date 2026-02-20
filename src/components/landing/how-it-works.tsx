'use client';

import { ScrollReveal } from './scroll-reveal';
import { FolderPlus, Puzzle, Download, Sparkles } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export function HowItWorks() {
  const { locale } = useLocaleStore();

  const steps = [
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
      icon: Download,
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

  return (
    <section className="py-24 bg-[#f4f5f8] border-y border-[#dde0e7]" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(220,60%,35%)] mb-3 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[hsl(220,60%,35%)]" />
              HOW IT WORKS
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-[#1a2740]">{t(locale, 'landing.howTitle')}</h2>
          </div>
        </ScrollReveal>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px z-0">
            <div className="h-full bg-gradient-to-r from-[#dde0e7] via-[hsl(220,60%,35%)]/40 to-[#dde0e7]" />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Number circle */}
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-[#dde0e7] shadow-md mb-6 transition-transform hover:scale-105">
                    <span className="text-2xl font-bold text-[hsl(220,60%,35%)]">{step.number}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-[hsl(220,60%,35%)]" />
                    <h3 className="text-xl font-bold text-[#1a2740]">{step.title}</h3>
                  </div>
                  <p className="text-sm text-[#63738a] max-w-xs leading-relaxed">{step.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
