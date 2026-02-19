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
    <section ref={containerRef} className="relative min-h-screen pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden flex flex-col justify-center">
      {/* Dot grid background */}
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(0,0,0,1)_40%,rgba(0,0,0,0)_100%)] opacity-40" />
      {/* Green radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(43,238,121,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-[#2bee79]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2bee79] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2bee79]" />
              </span>
              {t(locale, 'landing.badge')}
            </div>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 leading-[1.1]">
            {t(locale, 'landing.heroHeadline')} <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#2bee79] to-emerald-400 bg-clip-text text-transparent">{t(locale, 'landing.heroHeadlineHighlight')}</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10 leading-relaxed">
            {t(locale, 'landing.heroSubtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button className="bg-[#2bee79] text-black hover:bg-emerald-400 px-8 py-3.5 h-auto rounded-lg text-base font-bold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(43,238,121,0.3)]" asChild>
              <Link href="/signup">
                {t(locale, 'landing.ctaStart')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700 text-white hover:border-zinc-500 hover:bg-zinc-800/80 px-8 py-3.5 h-auto rounded-lg text-base font-bold transition-all" asChild>
              <Link href="/oneclick">
                <Play className="mr-2 h-4 w-4 fill-current" />
                {t(locale, 'landing.heroCtaDemo')}
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Visualization Card */}
        <motion.div style={{ y }} className="relative mx-auto max-w-5xl">
          {/* Glow effect behind card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#2bee79]/10 via-transparent to-[#2bee79]/10 rounded-2xl blur-xl -z-10" />

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-2xl shadow-black/50 overflow-hidden">
            {/* MacOS Window Header */}
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
              <div className="ml-4 flex h-6 w-full max-w-[400px] items-center rounded-md bg-zinc-950 px-3 text-xs text-gray-500 font-mono">
                linkmap-infrastructure-map
              </div>
            </div>

            {/* Diagram Area */}
            <div className="relative h-[400px] md:h-[480px] lg:h-[520px] w-full bg-zinc-950 overflow-hidden" style={{ backgroundImage: 'radial-gradient(#1f1f1f 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
              {/* Floating Badges inside diagram */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                <div className="flex items-center gap-2 rounded-lg bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 px-3 py-2 text-xs text-[#2bee79] shadow-lg">
                  <Lock className="w-3.5 h-3.5" />
                  {t(locale, 'landing.trustEncryption')}
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 px-3 py-2 text-xs text-green-400 shadow-lg">
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
