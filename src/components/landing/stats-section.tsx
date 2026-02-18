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
    <section className="border-y border-zinc-800 bg-[#111]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center justify-center gap-3 md:justify-start">
                  <Icon className="w-8 h-8 text-[#2bee79]" />
                  <div>
                    <p className="text-2xl font-bold text-white font-mono">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-gray-400 font-mono">{stat.label}</p>
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
