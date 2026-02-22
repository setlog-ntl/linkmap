'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, Check } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { TypewriterHeadline } from './typewriter-headline';

const TEMPLATE_PREVIEW_CARDS = [
  { emoji: '\u{1F3E0}', nameKo: '\uB098\uB9CC\uC758 \uD648\uD398\uC774\uC9C0', nameEn: 'Personal Brand', gradient: 'from-blue-500 to-cyan-500' },
  { emoji: '\u{1F4BC}', nameKo: '\uD3EC\uD2B8\uD3F4\uB9AC\uC624', nameEn: 'Portfolio', gradient: 'from-indigo-500 to-violet-500' },
  { emoji: '\u{1F517}', nameKo: 'SNS \uB9C1\uD06C\uD5C8\uBE0C', nameEn: 'Link Hub', gradient: 'from-purple-500 to-pink-500' },
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { locale } = useLocaleStore();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={containerRef} className="relative min-h-screen pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden flex flex-col justify-center">
      {/* Light dot grid background */}
      <div className="absolute inset-0 -z-10 bg-[#f4f5f8] dark:bg-[#0b1120]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(var(--dot-color,#c8cdd6)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(0,0,0,1)_40%,rgba(0,0,0,0)_100%)] opacity-40" />
      {/* Blue + green radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(37,74,135,0.06)_0%,transparent_70%)]" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[400px] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(43,238,121,0.04)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dde0e7] bg-white dark:border-white/10 dark:bg-white/5 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-[hsl(220,60%,35%)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(220,60%,35%)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(220,60%,35%)]" />
              </span>
              {t(locale, 'landing.badge')}
            </div>
          </div>

          {/* Headline with typewriter effect */}
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 leading-[1.1] text-[#1a2740] dark:text-[#e2e8f0]">
            <TypewriterHeadline />
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-[#63738a] dark:text-[#94a3b8] mb-10 leading-relaxed">
            {t(locale, 'landing.heroSubtitle')}
          </p>

          {/* CTA Buttons — Primary: oneclick, Secondary: signup */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button className="bg-[#2bee79] text-black hover:bg-[#25d96d] px-8 py-3.5 h-auto rounded-lg text-base font-bold transition-all hover:scale-105 hover:shadow-lg" asChild>
              <Link href="/sites">
                <Rocket className="mr-2 h-4 w-4" />
                {t(locale, 'landing.ctaOneclickHero')}
              </Link>
            </Button>
            <Button variant="outline" className="bg-white border-[#dde0e7] text-[#1a2740] hover:border-[hsl(220,60%,35%)]/40 hover:bg-[#f4f5f8] dark:bg-white/5 dark:border-white/10 dark:text-[#e2e8f0] dark:hover:bg-white/10 px-8 py-3.5 h-auto rounded-lg text-base font-bold transition-all" asChild>
              <Link href="/signup">
                {t(locale, 'landing.heroCtaDemo')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#63738a] dark:text-[#94a3b8]">
            {[
              t(locale, 'landing.trustFree'),
              t(locale, 'landing.trustNoCard'),
              t(locale, 'landing.trustEncryption'),
            ].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2bee79]" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Template Preview Cards */}
        <motion.div style={{ y }} className="relative mx-auto max-w-5xl mt-16">
          {/* Glow effect behind card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[hsl(220,60%,35%)]/5 via-transparent to-[#2bee79]/5 rounded-2xl blur-xl -z-10" />

          <div className="rounded-2xl border border-[#dde0e7] bg-white shadow-2xl shadow-black/5 dark:border-white/10 dark:bg-[#111827] dark:shadow-black/30 overflow-hidden">
            {/* MacOS Window Header */}
            <div className="flex items-center gap-2 border-b border-[#dde0e7] bg-[#f4f5f8] dark:border-white/10 dark:bg-[#0f172a] px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
              <div className="ml-4 flex h-6 w-full max-w-[400px] items-center rounded-md bg-white px-3 text-xs text-[#63738a] dark:bg-white/10 dark:text-[#94a3b8] font-mono">
                linkmap.site/templates
              </div>
            </div>

            {/* Template Preview Area */}
            <div className="p-8 md:p-12 bg-[#fafbfc] dark:bg-[#0f172a]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {TEMPLATE_PREVIEW_CARDS.map((card, i) => (
                  <Link
                    key={i}
                    href="/sites"
                    className="group flex flex-col rounded-xl border border-[#dde0e7] bg-white dark:border-white/10 dark:bg-[#111827] overflow-hidden transition-all hover:-translate-y-2 hover:shadow-lg"
                  >
                    <div className={`h-[140px] bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                      <span className="text-5xl">{card.emoji}</span>
                    </div>
                    <div className="p-4 text-center">
                      <p className="font-bold text-[#1a2740] dark:text-[#e2e8f0]">
                        {locale === 'ko' ? card.nameKo : card.nameEn}
                      </p>
                      <p className="text-xs text-[#2bee79] font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {t(locale, 'landing.templateShowcaseCta')} &rarr;
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
