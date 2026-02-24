'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, Check, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { TypewriterHeadline } from './typewriter-headline';

const InteractiveHeroFlow = dynamic(
  () => import('./interactive-hero-flow').then((mod) => ({ default: mod.InteractiveHeroFlow })),
  { ssr: false }
);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { locale } = useLocaleStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  return (
    <section ref={containerRef} className="relative flex flex-col bg-background">
      {/* ── Area 1: Text + CTA (vertically centered, full-screen) ── */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center pt-32 pb-10 lg:pt-40 lg:pb-14 px-6 lg:px-8">
        {/* Subtle dot-grid background */}
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--dot-color, #334155) 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Soft radial glow behind the content */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-blue/[0.04] dark:bg-brand-blue/[0.06] rounded-full blur-[120px] -z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center text-center max-w-7xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/25 bg-brand-green-light dark:bg-brand-green/10 px-4 py-1.5 text-xs font-semibold text-brand-green shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green" />
              </span>
              {t(locale, 'landing.badge')}
            </div>
          </motion.div>

          {/* Headline - stronger visual hierarchy */}
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 leading-[1.08] text-foreground">
            <span className="block text-2xl sm:text-4xl font-semibold mb-3 text-muted-foreground">
              {t(locale, 'landing.heroHeadlineStatic')}
            </span>
            <TypewriterHeadline />
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-12 leading-relaxed">
            {t(locale, 'landing.heroSubtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              className="bg-brand-green text-black hover:bg-brand-green/90 px-8 py-3.5 h-auto rounded-xl text-base font-bold transition-all duration-200 hover:shadow-[0_4px_24px_rgba(16,185,129,0.25)] active:scale-[0.98]"
              asChild
            >
              <Link href="/sites">
                <Rocket className="mr-2 h-4 w-4" />
                {t(locale, 'landing.ctaOneclickHero')}
              </Link>
            </Button>
            {isLoggedIn ? (
              <Button
                variant="outline"
                className="bg-card border-border text-foreground hover:border-brand-green/40 hover:bg-muted px-8 py-3.5 h-auto rounded-xl text-base font-bold transition-all duration-200 shadow-sm"
                asChild
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t(locale, 'common.dashboard')}
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="bg-card border-border text-foreground hover:border-brand-green/40 hover:bg-muted px-8 py-3.5 h-auto rounded-xl text-base font-bold transition-all duration-200 shadow-sm"
                asChild
              >
                <Link href="/signup">
                  {t(locale, 'landing.ctaStart')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          {/* Trust Badges - more refined spacing and style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
          >
            {[
              t(locale, 'landing.trustFree'),
              t(locale, 'landing.trustNoCard'),
              t(locale, 'landing.trustEncryption'),
            ].map((badge, idx) => (
              <div key={badge} className="flex items-center gap-2 font-medium">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-green/10">
                  <Check className="w-3 h-3 text-brand-green" />
                </div>
                <span>{badge}</span>
                {idx < 2 && (
                  <span className="hidden sm:inline-block ml-6 w-px h-4 bg-border" />
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Area 2: Interactive Flow showcase (dedicated space below text) ── */}
      <div className="relative h-[460px] lg:h-[520px] -mt-8">
        {/* Top fade: blend into text area */}
        <div className="absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        <InteractiveHeroFlow />
        {/* Bottom fade: blend into next section */}
        <div className="absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
