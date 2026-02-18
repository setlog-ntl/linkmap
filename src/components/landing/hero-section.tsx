'use client';

import { useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Lock, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

function DiagramLoader() {
  const { locale } = useLocaleStore();
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-[#2bee79] border-t-transparent animate-spin" />
        <span className="text-sm text-gray-400 font-medium">{t(locale, 'landing.loadingArchitecture')}</span>
      </div>
    </div>
  );
}

const FlowArchitectureDiagram = dynamic(
  () => import('./flow-architecture-diagram').then((mod) => ({ default: mod.FlowArchitectureDiagram })),
  {
    ssr: false,
    loading: () => <DiagramLoader />,
  }
);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { locale } = useLocaleStore();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={containerRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_60%,rgba(0,0,0,0)_100%)] opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-[#111] px-3 py-1 text-xs font-medium text-[#2bee79]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2bee79] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2bee79]" />
              </span>
              {t(locale, 'landing.badge')}
            </div>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6">
            {t(locale, 'landing.heroHeadline')} <br className="hidden sm:block" />
            <span className="text-[#2bee79]">{t(locale, 'landing.heroHeadlineHighlight')}</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10">
            {t(locale, 'landing.heroSubtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <Button className="bg-[#2bee79] text-black hover:bg-green-400 px-8 py-3.5 h-auto rounded-md text-base font-bold transition-all hover:scale-105" asChild>
              <Link href="/signup">
                {t(locale, 'landing.ctaStart')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="bg-[#111] border-zinc-800 text-white hover:border-gray-500 px-8 py-3.5 h-auto rounded-md text-base font-bold transition-all" asChild>
              <Link href="/demo">
                <Play className="mr-2 h-4 w-4 fill-current" />
                {t(locale, 'landing.heroCtaDemo')}
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Visualization Card */}
        <motion.div style={{ y }} className="relative mx-auto max-w-5xl">
          <div className="rounded-xl border border-zinc-800 bg-[#111] shadow-2xl overflow-hidden">
            {/* MacOS Window Header */}
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-[#1a1a1a] px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
              <div className="ml-4 flex h-6 w-full max-w-[400px] items-center rounded bg-black px-3 text-xs text-gray-500 font-mono">
                linkmap-infrastructure-map
              </div>
            </div>

            {/* Diagram Area */}
            <div className="relative h-[400px] md:h-[480px] lg:h-[520px] w-full bg-[#0d0d0d] overflow-hidden" style={{ backgroundImage: 'radial-gradient(#1f1f1f 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
              {/* Floating Badges inside diagram */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                <div className="flex items-center gap-2 rounded bg-[#111] border border-zinc-800 px-3 py-1.5 text-xs text-[#2bee79] shadow-lg">
                  <Lock className="w-3.5 h-3.5" />
                  {t(locale, 'landing.trustEncryption')}
                </div>
                <div className="flex items-center gap-2 rounded bg-[#111] border border-zinc-800 px-3 py-1.5 text-xs text-green-400 shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t(locale, 'landing.allSystemsOperational')}
                </div>
              </div>

              <FlowArchitectureDiagram />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
