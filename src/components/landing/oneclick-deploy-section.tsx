'use client';

import { Github, Layout, Loader, Globe } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

const steps = [
  { icon: Github, titleKey: 'landing.deployStep1', descKey: 'landing.deployStep1Desc' },
  { icon: Layout, titleKey: 'landing.deployStep2', descKey: 'landing.deployStep2Desc' },
  { icon: Loader, titleKey: 'landing.deployStep3', descKey: 'landing.deployStep3Desc' },
  { icon: Globe, titleKey: 'landing.deployStep4', descKey: 'landing.deployStep4Desc' },
];

export function OneclickDeploySection() {
  const { locale } = useLocaleStore();

  return (
    <section className="py-24 bg-[#f1f5f3] dark:bg-zinc-900/50 border-y border-[#e7efe9] dark:border-zinc-800/60" id="oneclick-deploy">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t(locale, 'landing.deployTitle')}
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t(locale, 'landing.deployDesc')}
            </p>
          </div>
        </ScrollReveal>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px z-0">
            <div className="h-full bg-gradient-to-r from-gray-300 dark:from-zinc-800 via-[#2bee79]/40 to-gray-300 dark:to-zinc-800" />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.titleKey} delay={i * 0.12}>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-[#e7efe9] dark:border-zinc-800 shadow-md dark:shadow-[0_0_20px_rgba(43,238,121,0.15)] mb-6 transition-transform hover:scale-105">
                    <Icon className="w-8 h-8 text-[#2bee79]" />
                  </div>
                  <div className="mb-1 text-xs font-mono text-[#2bee79]/60">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    {t(locale, step.titleKey)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px] leading-relaxed">
                    {t(locale, step.descKey)}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
