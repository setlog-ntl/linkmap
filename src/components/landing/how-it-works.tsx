'use client';

import { ScrollReveal } from './scroll-reveal';
import { FolderPlus, Puzzle, Download } from 'lucide-react';
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
  ];

  return (
    <section className="py-20 border-y border-white/[0.06]">
      <div className="container">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t(locale, 'landing.howTitle')}</h2>
            <p className="text-muted-foreground text-lg">{t(locale, 'landing.howDesc')}</p>
          </div>
        </ScrollReveal>

        <div className="relative max-w-4xl mx-auto">
          {/* Connection line (desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[16.67%] right-[16.67%] h-[2px]">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <ScrollReveal key={i} delay={i * 0.15}>
                  <div className="text-center relative">
                    {/* Number circle */}
                    <div className="relative mx-auto mb-6 w-[104px] h-[104px]">
                      <div className="absolute inset-0 rounded-full bg-emerald-500/[0.08]" />
                      <div className="absolute inset-3 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="text-2xl font-bold text-black">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Icon + Text */}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Icon className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
