'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ScrollReveal } from './scroll-reveal';
import { ServiceIcon } from './service-icon';
import { services } from '@/data/seed/services';
import { SERVICE_BRANDS, type ServiceBrand } from '@/lib/constants/service-brands';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { ServiceDomain } from '@/types';

/** Brand color based card background tint */
function getBrandTintBg(brand: ServiceBrand | undefined, isDark: boolean): string | undefined {
  if (!brand) return undefined;
  const color = isDark ? brand.darkColor : brand.color;
  return isDark ? `${color}15` : `${color}08`;
}

/** Top 20 popular services by popularity_score */
const TOP_SERVICES = services
  .filter((s) => s.domain)
  .sort((a, b) => (b.popularity_score ?? 0) - (a.popularity_score ?? 0))
  .slice(0, 20);

export function ServicesGrid() {
  const [filter, setFilter] = useState<ServiceDomain | 'all'>('all');
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const { locale } = useLocaleStore();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => setMounted(true), []);

  const domainFilters: { label: string; value: ServiceDomain | 'all' }[] = [
    { label: t(locale, 'landing.filterAll'), value: 'all' },
    { label: t(locale, 'landing.filterInfra'), value: 'infrastructure' },
    { label: t(locale, 'landing.filterBackend'), value: 'backend' },
    { label: t(locale, 'landing.filterDevtools'), value: 'devtools' },
    { label: t(locale, 'landing.filterComm'), value: 'communication' },
    { label: t(locale, 'landing.filterBiz'), value: 'business' },
    { label: t(locale, 'landing.filterAI'), value: 'ai_ml' },
  ];

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? TOP_SERVICES
        : TOP_SERVICES.filter((s) => s.domain === filter),
    [filter],
  );

  return (
    <section className="py-24 bg-card/50 dark:bg-card/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-4 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-blue" />
              INTEGRATIONS
            </p>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground tracking-tight">{t(locale, 'landing.servicesTitle')}</h2>
          </div>
        </ScrollReveal>

        {/* Filter tabs - pill container style matching how-it-works */}
        <ScrollReveal>
          <div className="flex justify-center mb-10">
            <div className="inline-flex flex-wrap justify-center gap-1.5 rounded-xl bg-muted/70 dark:bg-secondary/70 p-1.5 border border-border">
              {domainFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    filter === f.value
                      ? 'bg-card text-brand-blue font-bold shadow-sm border border-brand-blue/20'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 6-column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((svc) => {
              const brand = SERVICE_BRANDS[svc.slug];
              const tintBg = mounted ? getBrandTintBg(brand, isDark) : undefined;
              return (
              <motion.div
                key={svc.slug}
                layout={!prefersReducedMotion}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col items-center justify-center p-5 rounded-xl bg-card border border-border hover:border-brand-blue/25 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 aspect-square cursor-default"
                style={tintBg ? { backgroundColor: tintBg } : undefined}
              >
                <div className="mb-3 transition-transform duration-200 group-hover:scale-110">
                  <ServiceIcon serviceId={svc.slug} size={36} />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">{svc.name}</span>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
