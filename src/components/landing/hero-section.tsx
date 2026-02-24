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
        {/* Dot-grid background for text area only */}
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: 'radial-gradient(circle, var(--dot-color, #334155) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center text-center max-w-7xl mx-auto"
        >
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 dark:bg-accent/60 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-brand-green shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green" />
              </span>
              {t(locale, 'landing.badge')}
            </div>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 leading-[1.1] text-foreground">
            <span className="block text-3xl sm:text-5xl font-bold mb-2">
              {t(locale, 'landing.heroHeadlineStatic')}
            </span>
            <TypewriterHeadline />
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 leading-relaxed">
            {t(locale, 'landing.heroSubtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button className="bg-brand-green text-black hover:bg-brand-green/85 px-8 py-3.5 h-auto rounded-lg text-base font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]" asChild>
              <Link href="/sites">
                <Rocket className="mr-2 h-4 w-4" />
                {t(locale, 'landing.ctaOneclickHero')}
              </Link>
            </Button>
            {isLoggedIn ? (
              <Button variant="outline" className="bg-card/80 backdrop-blur-md border-border text-foreground hover:border-brand-green/40 hover:bg-muted dark:bg-accent/80 dark:hover:bg-accent px-8 py-3.5 h-auto rounded-lg text-base font-bold transition-all shadow-lg" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t(locale, 'common.dashboard')}
                </Link>
              </Button>
            ) : (
              <Button variant="outline" className="bg-card/80 backdrop-blur-md border-border text-foreground hover:border-brand-green/40 hover:bg-muted dark:bg-accent/80 dark:hover:bg-accent px-8 py-3.5 h-auto rounded-lg text-base font-bold transition-all shadow-lg" asChild>
                <Link href="/signup">
                  {t(locale, 'landing.ctaStart')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {[
              t(locale, 'landing.trustFree'),
              t(locale, 'landing.trustNoCard'),
              t(locale, 'landing.trustEncryption'),
            ].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-brand-green" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Area 2: Interactive Flow showcase (dedicated space below text) ── */}
      <div className="relative h-[340px] lg:h-[400px] -mt-8">
        {/* Top fade: blend into text area */}
        <div className="absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        <InteractiveHeroFlow />
        {/* Bottom fade: blend into next section */}
        <div className="absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
