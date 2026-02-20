'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ScrollReveal } from './scroll-reveal';
import { ServiceIcon } from './service-icon';
import { services } from '@/data/seed/services';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { ServiceDomain } from '@/types';

/** 상위 20개 인기 서비스를 popularity_score 기준으로 선별 */
const TOP_SERVICES = services
  .filter((s) => s.domain)
  .sort((a, b) => (b.popularity_score ?? 0) - (a.popularity_score ?? 0))
  .slice(0, 20);

export function ServicesGrid() {
  const [filter, setFilter] = useState<ServiceDomain | 'all'>('all');
  const prefersReducedMotion = useReducedMotion();
  const { locale } = useLocaleStore();

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
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(220,60%,35%)] mb-3 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[hsl(220,60%,35%)]" />
              INTEGRATIONS
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl text-[#1a2740]">{t(locale, 'landing.servicesTitle')}</h2>
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
                    ? 'bg-[hsl(220,60%,35%)] text-white font-bold shadow-md'
                    : 'bg-[#f4f5f8] border border-[#dde0e7] text-[#63738a] hover:text-[#1a2740] hover:border-[hsl(220,60%,35%)]/30'
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
            {filtered.map((svc) => (
              <motion.div
                key={svc.slug}
                layout={!prefersReducedMotion}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col items-center justify-center p-6 rounded-xl bg-white border border-[#dde0e7] hover:border-[hsl(220,60%,35%)]/30 hover:bg-[#fafbfc] transition-all hover:shadow-md hover:-translate-y-0.5 aspect-square cursor-default"
              >
                <div className="mb-3 transition-transform group-hover:scale-110">
                  <ServiceIcon serviceId={svc.slug} size={36} />
                </div>
                <span className="text-xs text-[#63738a] group-hover:text-[#1a2740] transition-colors">{svc.name}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
