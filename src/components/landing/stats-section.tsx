'use client';

import { ScrollReveal } from './scroll-reveal';
import { AnimatedCounter } from './animated-counter';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export function StatsSection() {
  const { locale } = useLocaleStore();

  const stats = [
    { value: 20, suffix: '+', label: t(locale, 'landing.statServices') },
    { value: 116, suffix: '+', label: t(locale, 'landing.statChecklist') },
    { value: 5, suffix: '', label: t(locale, 'landing.statTemplates') },
    { value: 256, suffix: '', label: t(locale, 'landing.statEncryption') },
  ];

  return (
    <section className="bg-muted/50 py-10">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono mb-2">
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
