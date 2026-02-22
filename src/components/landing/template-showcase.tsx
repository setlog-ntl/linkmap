'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { homepageTemplateSeedData } from '@/data/oneclick/homepage-templates';

const GRADIENT_MAP: Record<string, string> = {
  'link-in-bio-pro': 'from-purple-500 to-pink-500',
  'personal-brand': 'from-blue-500 to-cyan-500',
  'digital-namecard': 'from-emerald-500 to-teal-500',
  'dev-showcase': 'from-orange-500 to-amber-500',
  'freelancer-page': 'from-indigo-500 to-violet-500',
  'small-biz': 'from-rose-500 to-red-500',
};

const EMOJI_MAP: Record<string, string> = {
  'link-in-bio-pro': '\u{1F517}',
  'personal-brand': '\u{1F3E0}',
  'digital-namecard': '\u{1F4B3}',
  'dev-showcase': '\u{1F4BB}',
  'freelancer-page': '\u{1F4BC}',
  'small-biz': '\u{1F3EA}',
};

const POPULAR_SLUGS = new Set(['dev-showcase', 'personal-brand']);

const activeTemplates = homepageTemplateSeedData
  .filter((tpl) => tpl.is_active)
  .sort((a, b) => a.display_order - b.display_order);

export function TemplateShowcase() {
  const { locale } = useLocaleStore();

  return (
    <section className="py-24 bg-white dark:bg-[#0f172a]" id="templates">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#2bee79] mb-3 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#2bee79]" />
              TEMPLATES
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-[#1a2740] dark:text-[#e2e8f0]">
              {t(locale, 'landing.templateShowcaseTitle')}
            </h2>
            <p className="mt-4 text-lg text-[#63738a] dark:text-[#94a3b8]">
              {t(locale, 'landing.templateShowcaseDesc')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {activeTemplates.map((tpl, i) => {
            const gradient = GRADIENT_MAP[tpl.slug] ?? 'from-gray-500 to-gray-600';
            const emoji = EMOJI_MAP[tpl.slug] ?? '\u{1F4C4}';
            const isPopular = POPULAR_SLUGS.has(tpl.slug);

            return (
              <ScrollReveal key={tpl.slug} delay={i * 0.1}>
                <Link
                  href="/sites"
                  className="group flex flex-col rounded-xl border border-[#dde0e7] bg-white dark:border-white/10 dark:bg-[#111827] overflow-hidden transition-all hover:-translate-y-2 hover:shadow-lg"
                >
                  {/* Gradient header */}
                  <div className={`relative h-[140px] bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <span className="text-5xl">{emoji}</span>
                    {/* Badge */}
                    <div className="absolute top-3 right-3">
                      {isPopular ? (
                        <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white">
                          {t(locale, 'landing.templateTagPopular')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white">
                          {t(locale, 'landing.templateTagFree')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-[#1a2740] dark:text-[#e2e8f0] mb-1">
                      {locale === 'ko' ? tpl.name_ko : tpl.name}
                    </h3>
                    <p className="text-xs text-[#63738a] dark:text-[#94a3b8] line-clamp-2 mb-4 flex-1">
                      {locale === 'ko' ? tpl.description_ko : tpl.description}
                    </p>
                    <div className="flex items-center text-sm font-semibold text-[#2bee79] group-hover:gap-2 transition-all">
                      {t(locale, 'landing.templateShowcaseCta')}
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
