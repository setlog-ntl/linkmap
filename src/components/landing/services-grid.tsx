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

/** 브랜드 색상 기반 카드 배경 틴트 계산 */
function getBrandTintBg(brand: ServiceBrand | undefined, isDark: boolean): string | undefined {
  if (!brand) return undefined;
  const color = isDark ? brand.darkColor : brand.color;
  // 라이트: 3% 투명도, 다크: 8% 투명도
  return isDark ? `${color}15` : `${color}08`;
}

/** 상위 20개 인기 서비스를 popularity_score 기준으로 선별 */
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
    <section className="py-24 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-3 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-blue" />
              INTEGRATIONS
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl text-foreground">{t(locale, 'landing.servicesTitle')}</h2>
          </div>
        </ScrollReveal>

        {/* Filter tabs */}
        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {domainFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  filter === f.value
                    ? 'bg-brand-blue text-white font-bold shadow-md'
                    : 'bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-brand-blue/30 dark:bg-accent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* 6-column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                className="group flex flex-col items-center justify-center p-6 rounded-xl bg-card border border-border hover:border-brand-blue/30 hover:bg-muted transition-all hover:shadow-md hover:-translate-y-0.5 aspect-square cursor-default"
                style={tintBg ? { backgroundColor: tintBg } : undefined}
              >
                <div className="mb-3 transition-transform group-hover:scale-110">
                  <ServiceIcon serviceId={svc.slug} size={36} />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{svc.name}</span>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
