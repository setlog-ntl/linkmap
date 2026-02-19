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
    <section className="py-24 bg-[#f1f5f3] dark:bg-zinc-900/50 border-y border-[#e7efe9] dark:border-zinc-800/60" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t(locale, 'landing.howTitle')}</h2>
          </div>
        </ScrollReveal>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px z-0">
            <div className="h-full bg-gradient-to-r from-gray-300 dark:from-zinc-800 via-[#2bee79]/40 to-gray-300 dark:to-zinc-800" />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Number circle */}
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-[#e7efe9] dark:border-zinc-800 shadow-md dark:shadow-[0_0_20px_rgba(43,238,121,0.15)] mb-6 transition-transform hover:scale-105">
                    <span className="text-2xl font-bold text-[#2bee79]">{step.number}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-[#2bee79]" />
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">{step.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
