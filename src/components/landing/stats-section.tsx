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
    { value: 256, suffix: '', label: t(locale, 'landing.statEncryption'), icon: Shield },
  ];

  return (
    <section className="border-y border-white/[0.06] bg-black/20 backdrop-blur-sm">
      <div className="container py-6">
        <ScrollReveal>
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-0 max-w-4xl mx-auto">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center gap-6">
                  {i > 0 && (
                    <div className="hidden md:block w-px h-8 bg-white/[0.08]" />
                  )}
                  <div className="flex items-center gap-3 px-4">
                    <Icon className="w-5 h-5 text-emerald-500/60" />
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold font-mono text-foreground">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </span>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {stat.label}
                      </span>
                    </div>
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
