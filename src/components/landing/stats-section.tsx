'use client';

import { Shield, CheckCircle2, Layers, Globe } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { AnimatedCounter } from './animated-counter';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export function StatsSection() {
  const { locale } = useLocaleStore();

  const stats = [
    { value: 20, suffix: '+', label: t(locale, 'landing.statServices'), icon: Globe },
    { value: 116, suffix: '+', label: t(locale, 'landing.statChecklist'), icon: CheckCircle2 },
    { value: 5, suffix: '', label: t(locale, 'landing.statTemplates'), icon: Layers },
    { value: 256, suffix: '-bit', label: t(locale, 'landing.statEncryption'), icon: Shield },
  ];

  return (
    <section className="border-y border-[#dde0e7] bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <p className="text-center text-sm text-[#63738a] pt-8 pb-2 font-medium">
            {t(locale, 'landing.socialProofTagline')}
          </p>
          <div className="grid grid-cols-2 gap-6 py-6 md:grid-cols-4 md:gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="group flex items-center justify-center gap-4 md:justify-start rounded-xl px-4 py-3 transition-colors hover:bg-[#f4f5f8]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(220,60%,92%)] text-[hsl(220,60%,35%)] transition-transform group-hover:scale-110">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono bg-gradient-to-r from-[hsl(220,60%,35%)] to-[#2bee79] bg-clip-text text-transparent">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-[#63738a]">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
