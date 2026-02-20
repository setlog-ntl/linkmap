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
    <section className="py-24 bg-[#f4f5f8] border-y border-[#dde0e7]" id="oneclick-deploy">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(220,60%,35%)] mb-3 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[hsl(220,60%,35%)]" />
              ONE-CLICK DEPLOY
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-[#1a2740]">
              {t(locale, 'landing.deployTitle')}
            </h2>
            <p className="mt-4 text-lg text-[#63738a] max-w-2xl mx-auto">
              {t(locale, 'landing.deployDesc')}
            </p>
          </div>
        </ScrollReveal>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px z-0">
            <div className="h-full bg-gradient-to-r from-[#dde0e7] via-[hsl(220,60%,35%)]/40 to-[#dde0e7]" />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.titleKey} delay={i * 0.12}>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-[#dde0e7] shadow-md mb-6 transition-transform hover:scale-105">
                    <Icon className="w-8 h-8 text-[hsl(220,60%,35%)]" />
                  </div>
                  <div className="mb-1 text-xs font-mono text-[hsl(220,60%,35%)]/60">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#1a2740]">
                    {t(locale, step.titleKey)}
                  </h3>
                  <p className="text-sm text-[#63738a] max-w-[200px] leading-relaxed">
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
