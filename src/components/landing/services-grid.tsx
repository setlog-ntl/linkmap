'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ScrollReveal } from './scroll-reveal';
import { ServiceIcon } from './service-icon';
import { services } from '@/data/services';
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
    <section className="py-24 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-white mb-8">{t(locale, 'landing.servicesTitle')}</h2>
        </ScrollReveal>

        {/* Filter tabs — active tab is white bg (Stitch style) */}
        <ScrollReveal>
          <div className="flex flex-wrap gap-2 mb-10">
            {domainFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.value
                    ? 'bg-white text-black font-bold'
                    : 'bg-[#111] border border-zinc-800 text-gray-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* 6-column Grid (Stitch style) */}
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
                className="flex flex-col items-center justify-center p-6 rounded bg-[#111] border border-zinc-800 hover:border-gray-500 transition-colors aspect-square cursor-default"
              >
                <div className="mb-3">
                  <ServiceIcon serviceId={svc.slug} size={36} />
                </div>
                <span className="text-xs text-gray-400">{svc.name}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
