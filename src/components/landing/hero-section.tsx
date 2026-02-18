'use client';

import { useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Shield, Zap } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

function DiagramLoader() {
  const { locale } = useLocaleStore();
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <span className="text-sm text-muted-foreground font-medium">{t(locale, 'landing.loadingArchitecture')}</span>
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

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-12 overflow-hidden">
      {/* Background: Dot grid pattern */}
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      {/* Green ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-sm text-emerald-400"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t(locale, 'landing.badge')}
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              {t(locale, 'landing.heroHeadline')} <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                {t(locale, 'landing.heroHeadlineHighlight')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
              {t(locale, 'landing.heroSubtitle')}
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4"
          >
            <Button size="lg" className="h-12 px-8 text-base rounded-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-[0_0_24px_rgba(43,238,121,0.3)] transition-all hover:shadow-[0_0_32px_rgba(43,238,121,0.4)] hover:scale-105" asChild>
              <Link href="/signup">
                {t(locale, 'landing.ctaStart')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full bg-background/50 backdrop-blur-sm border-white/10 hover:bg-white/5 hover:text-white transition-all" asChild>
              <Link href="/demo">
                <Play className="mr-2 h-4 w-4 fill-current" />
                {t(locale, 'landing.heroCtaDemo')}
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Hero Diagram Container */}
        <motion.div
          style={{ y, opacity, scale }}
          className="mt-12 md:mt-16 relative w-full max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Window Bar */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-white/[0.03] border-b border-white/[0.06] flex items-center px-4 gap-2 z-20">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
              <div className="ml-4 px-3 py-0.5 rounded-full bg-white/[0.05] text-[10px] text-muted-foreground font-mono">
                linkmap-infrastructure-map
              </div>
            </div>

            {/* Content Area */}
            <div className="relative pt-10 h-[400px] md:h-[500px] lg:h-[600px] p-4 md:p-8">
              <div className="w-full h-full rounded-xl overflow-hidden border border-white/[0.06] bg-background/50 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:24px_24px]" />
                <FlowArchitectureDiagram />
              </div>

              {/* Floating Badge: AES-256 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -right-4 top-1/4 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-emerald-500/20 shadow-xl hidden lg:flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">{t(locale, 'landing.trustEncryption')}</div>
                  <div className="text-xs font-semibold text-emerald-400">AES-256-GCM</div>
                </div>
              </motion.div>

              {/* Floating Badge: Real-time Sync */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1 }}
                className="absolute -left-4 top-2/3 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-emerald-500/20 shadow-xl hidden lg:flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">{t(locale, 'landing.statusLabel')}</div>
                  <div className="text-xs font-semibold text-emerald-400">{t(locale, 'landing.allSystemsOperational')}</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Glow */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-emerald-500/15 blur-[100px] rounded-full -z-10 pointer-events-none" />
        </motion.div>

        {/* Trusted By / Tech Stack */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-muted-foreground mb-6">{t(locale, 'landing.poweredBy')}</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 hover:opacity-60 transition-all duration-500">
            {['GitHub', 'Vercel', 'Supabase', 'Next.js', 'React'].map((tech) => (
              <span key={tech} className="text-lg font-semibold text-foreground/60 hover:text-foreground cursor-default transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
