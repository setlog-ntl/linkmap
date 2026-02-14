'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ScrollReveal } from './scroll-reveal';
import { ServiceIcon } from './service-icon';
import { services } from '@/data/services';
import { getCategoryStyle } from '@/lib/constants/category-styles';
import type { ServiceDomain } from '@/types';

const DOMAIN_FILTERS: { label: string; value: ServiceDomain | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '인프라', value: 'infrastructure' },
  { label: '백엔드', value: 'backend' },
  { label: '개발도구', value: 'devtools' },
  { label: '커뮤니케이션', value: 'communication' },
  { label: '비즈니스', value: 'business' },
  { label: 'AI', value: 'ai_ml' },
];

/** 상위 20개 인기 서비스를 popularity_score 기준으로 선별 */
const TOP_SERVICES = services
  .filter((s) => s.domain)
  .sort((a, b) => (b.popularity_score ?? 0) - (a.popularity_score ?? 0))
  .slice(0, 20);

export function ServicesGrid() {
  const [filter, setFilter] = useState<ServiceDomain | 'all'>('all');
  const prefersReducedMotion = useReducedMotion();

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? TOP_SERVICES
        : TOP_SERVICES.filter((s) => s.domain === filter),
    [filter],
  );

  return (
    <section className="container py-20">
      <ScrollReveal>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">지원 서비스</h2>
          <p className="text-muted-foreground text-lg">
            인기 있는 {TOP_SERVICES.length}개 서비스를 모두 지원합니다
          </p>
        </div>
      </ScrollReveal>

      {/* Filter tabs */}
      <ScrollReveal>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {DOMAIN_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === f.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filtered.map((svc) => (
            <motion.div
              key={svc.slug}
              layout={!prefersReducedMotion}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`aspect-square rounded-xl border-2 bg-card p-3 flex flex-col items-center justify-center gap-2 cursor-default hover:-translate-y-1 hover:shadow-md transition-all ${
                getCategoryStyle(svc.category).gridBorderClasses
              }`}
            >
              <ServiceIcon serviceId={svc.slug} size={28} />
              <span className="font-medium text-sm text-center">{svc.name}</span>
              <div className="flex gap-1">
                {svc.free_tier_quality && svc.free_tier_quality !== 'none' && (
                  <span className="text-[9px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full">
                    Free
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
