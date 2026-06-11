import type { HomepageTemplateContent } from './homepage-template-content';
import {
  sharedGitignore as gitignore,
  sharedDeployYml as deployYml,
  sharedTsconfigJson as tsconfigJson,
  sharedPostcssConfig as postcssConfig,
  sharedNextConfig as nextConfig,
  sharedAnimatedReveal as animatedReveal,
  makePackageJson,
  makePackageLock,
} from './shared-template-files';

const packageJson = makePackageJson('invitation');
const packageLock = makePackageLock('invitation');

// ──────────────────────────────────────────────
// src/app/layout.tsx
// ──────────────────────────────────────────────
const layoutTsx = `import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import './globals.css';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.subtitle,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.subtitle,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: siteConfig.title,
    description: siteConfig.subtitle,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content={siteConfig.gradientFrom} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
`;

// ──────────────────────────────────────────────
// src/app/globals.css
// ──────────────────────────────────────────────
const globalsCss = `@import 'tailwindcss';

/* ══ Design Tokens ════════════════════════════ */
:root {
  /* Brand */
  --inv-bg: #fffdf7;
  --inv-bg-alt: #fef9ee;
  --inv-text-primary: #1a1a1a;
  --inv-text-secondary: #6b5c3e;
  --inv-accent: #b8860b;
  --inv-accent-glow: rgba(184, 134, 11, 0.15);
  --inv-accent-soft: rgba(184, 134, 11, 0.06);
  --inv-card-bg: #ffffff;
  --inv-card-border: #e8dcc8;
  --inv-gradient-from: #b8860b;
  --inv-gradient-to: #d4a853;

  /* Shadows (4-level) */
  --inv-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
  --inv-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
  --inv-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
  --inv-shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);

  /* Responsive Typography */
  --inv-text-hero: clamp(1.75rem, 5vw, 2.75rem);
  --inv-text-section: clamp(1.25rem, 3vw, 1.5rem);
  --inv-text-body: clamp(0.875rem, 1vw, 1rem);

  /* Radius */
  --inv-radius-sm: 8px;
  --inv-radius-md: 12px;
  --inv-radius-lg: 16px;
  --inv-radius-xl: 24px;

  /* Spacing */
  --inv-section-py: clamp(3rem, 7vw, 4.5rem);
  --inv-section-px: clamp(1.25rem, 5vw, 2rem);

  /* Transition */
  --inv-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --inv-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

/* ══ Global Reset & Base ═════════════════════ */
* { -webkit-tap-highlight-color: transparent; }
html { scroll-behavior: smooth; }
body {
  background: var(--inv-bg);
  color: var(--inv-text-primary);
  font-family: 'Nanum Myeongjo', 'Pretendard Variable', serif;
  font-size: var(--inv-text-body);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100svh;
}

/* ══ Reveal Animations (AnimatedReveal) ══════ */
.reveal-fade {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s var(--inv-ease-out), transform 0.7s var(--inv-ease-out);
}
.reveal-fade.revealed { opacity: 1; transform: translateY(0); }

.reveal-slide-left { opacity: 0; transform: translateX(-32px); transition: opacity 0.7s var(--inv-ease-out), transform 0.7s var(--inv-ease-out); }
.reveal-slide-left.revealed { opacity: 1; transform: translateX(0); }
.reveal-slide-right { opacity: 0; transform: translateX(32px); transition: opacity 0.7s var(--inv-ease-out), transform 0.7s var(--inv-ease-out); }
.reveal-slide-right.revealed { opacity: 1; transform: translateX(0); }
.reveal-scale { opacity: 0; transform: scale(0.92); transition: opacity 0.7s var(--inv-ease-out), transform 0.7s var(--inv-ease-out); }
.reveal-scale.revealed { opacity: 1; transform: scale(1); }

@media (prefers-reduced-motion: reduce) {
  .reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-scale {
    opacity: 1; transform: none; transition: none;
  }
}

/* ══ Keyframe Animations ═════════════════════ */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slide-in-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes float-slow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(10px, -10px) scale(1.02); }
  66% { transform: translate(-5px, 5px) scale(0.98); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 var(--inv-accent-glow); }
  70% { box-shadow: 0 0 0 16px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@keyframes celebrate-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(16px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes toast-out {
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to { opacity: 0; transform: translateX(-50%) translateY(16px); }
}
@keyframes rotate-slow {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* ══ Stagger Animation Classes ═══════════════ */
.animate-fade-up { animation: fade-up 0.7s var(--inv-ease-out) both; }
.animate-fade-up-d1 { animation: fade-up 0.7s var(--inv-ease-out) 0.15s both; }
.animate-fade-up-d2 { animation: fade-up 0.7s var(--inv-ease-out) 0.3s both; }
.animate-fade-up-d3 { animation: fade-up 0.7s var(--inv-ease-out) 0.45s both; }
.animate-fade-up-d4 { animation: fade-up 0.7s var(--inv-ease-out) 0.6s both; }
.animate-slide-in-up { animation: slide-in-up 0.8s var(--inv-ease-out) both; }
.animate-float { animation: float 3s ease-in-out infinite; }
.animate-shimmer { background-size: 200% auto; animation: shimmer 3s linear infinite; }
.animate-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }

/* ══ Tabular Nums ════════════════════════════ */
.tabular-nums { font-variant-numeric: tabular-nums; }

/* ══ Decorative Section Backgrounds ══════════ */
.inv-section-decorated {
  position: relative;
  overflow: hidden;
}
.inv-section-decorated::before {
  content: '';
  position: absolute;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--inv-accent-soft) 0%, transparent 70%);
  pointer-events: none;
  animation: float-slow 12s ease-in-out infinite;
}
.inv-section-decorated:nth-of-type(odd)::before {
  top: -80px; right: -100px;
}
.inv-section-decorated:nth-of-type(even)::before {
  bottom: -80px; left: -100px;
  animation-delay: -4s;
}

/* ══ Section Title with Ornament ═════════════ */
.inv-section-title {
  position: relative;
  display: inline-block;
  font-size: var(--inv-text-section);
  font-weight: 600;
  color: var(--inv-text-primary);
  padding-bottom: 0.75rem;
}
.inv-section-title::after {
  content: '';
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 2rem; height: 2px;
  background: linear-gradient(90deg, var(--inv-gradient-from), var(--inv-gradient-to));
  border-radius: 1px;
}

/* ══ Section Divider (wave ornament) ═════════ */
section + section { position: relative; }
section + section > div:first-child::before {
  content: '';
  display: block;
  height: 1px;
  max-width: 200px;
  margin: 0 auto 2rem;
  background: linear-gradient(90deg, transparent, var(--inv-card-border), var(--inv-accent-glow), var(--inv-card-border), transparent);
}

/* ══ Card System ═════════════════════════════ */
.inv-card {
  position: relative;
  background: var(--inv-card-bg);
  background-image: radial-gradient(ellipse at top right, var(--inv-accent-soft) 0%, transparent 50%);
  border: 1px solid var(--inv-card-border);
  border-radius: var(--inv-radius-lg);
  box-shadow: var(--inv-shadow-card);
  transition: transform var(--inv-transition), box-shadow var(--inv-transition), border-color var(--inv-transition);
  overflow: hidden;
}
.inv-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--inv-gradient-from), var(--inv-gradient-to));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s var(--inv-ease-out);
}
.inv-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--inv-shadow-lg);
  border-color: color-mix(in oklch, var(--inv-accent) 30%, var(--inv-card-border));
}
.inv-card:hover::before { transform: scaleX(1); }

/* Card with accent left border */
.inv-card-accent {
  position: relative;
  background: var(--inv-card-bg);
  background-image: linear-gradient(135deg, var(--inv-accent-soft) 0%, transparent 40%);
  border: 1px solid var(--inv-card-border);
  border-left: 3px solid var(--inv-accent);
  border-radius: var(--inv-radius-lg);
  box-shadow: var(--inv-shadow-card);
  transition: transform var(--inv-transition), box-shadow var(--inv-transition);
}
.inv-card-accent:hover {
  transform: translateY(-2px);
  box-shadow: var(--inv-shadow-md);
}

/* ══ Button System ═══════════════════════════ */
.inv-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 999px;
  min-height: 44px;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  transition: all var(--inv-transition);
  cursor: pointer;
  text-decoration: none;
  border: none;
}
.inv-btn:active { transform: scale(0.96); }

.inv-btn-primary {
  background: var(--inv-accent);
  color: #fff;
  box-shadow: 0 2px 8px color-mix(in oklch, var(--inv-accent) 30%, transparent);
}
.inv-btn-primary:hover {
  box-shadow: 0 4px 20px color-mix(in oklch, var(--inv-accent) 40%, transparent);
  filter: brightness(1.1);
}
.inv-btn-secondary {
  background: var(--inv-accent-glow);
  color: var(--inv-accent);
}
.inv-btn-secondary:hover {
  background: color-mix(in oklch, var(--inv-accent) 20%, transparent);
}

/* Brand buttons */
.inv-btn-kakao {
  background: #FEE500; color: #191919;
  box-shadow: 0 2px 8px rgba(254, 229, 0, 0.25);
}
.inv-btn-kakao:hover { filter: brightness(0.95); box-shadow: 0 4px 16px rgba(254, 229, 0, 0.35); }
.inv-btn-naver {
  background: #03C75A; color: #fff;
  box-shadow: 0 2px 8px rgba(3, 199, 90, 0.25);
}
.inv-btn-naver:hover { filter: brightness(0.95); box-shadow: 0 4px 16px rgba(3, 199, 90, 0.35); }

/* Legacy press */
.btn-press { transition: transform 0.15s ease; }
.btn-press:active { transform: scale(0.95); }

/* ══ Toast Notification ══════════════════════ */
.inv-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  background: rgba(26, 26, 26, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: toast-in 0.3s var(--inv-ease-out) both;
}
.inv-toast[data-closing='true'] {
  animation: toast-out 0.3s ease both;
}

/* ══ Scrollbar Hide (Gallery) ════════════════ */
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

/* ══ Gallery Dot Indicators ══════════════════ */
.inv-dots { display: flex; justify-content: center; gap: 6px; padding-top: 0.75rem; }
.inv-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--inv-card-border);
  transition: all 0.3s ease;
}
.inv-dot-active {
  width: 20px;
  border-radius: 3px;
  background: var(--inv-accent);
}

/* ══ Mobile Optimization ═════════════════════ */
@media (max-width: 640px) {
  h1 { font-size: var(--inv-text-hero) !important; }
  h2 { font-size: var(--inv-text-section) !important; }
}

/* ══ Accessibility: Reduced Motion ═══════════ */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .animate-fade-up, .animate-fade-up-d1, .animate-fade-up-d2, .animate-fade-up-d3, .animate-fade-up-d4,
  .animate-slide-in-up {
    animation: none !important; opacity: 1 !important; transform: none !important;
  }
  .animate-float, .animate-pulse-ring { animation: none !important; }
  .inv-card:hover, .inv-card-accent:hover { transform: none; }
  .inv-btn:active { transform: none; }
}

/* ══ Focus Visible ═══════════════════════════ */
*:focus-visible {
  outline: 2px solid var(--inv-accent);
  outline-offset: 2px;
}
`;

// ──────────────────────────────────────────────
// src/components/hero-section.tsx
// ──────────────────────────────────────────────
const heroSection = `'use client';

import { useEffect, useState } from 'react';

interface Props { config: { title: string; titleEn?: string; subtitle: string; subtitleEn?: string; heroImageUrl: string; gradientFrom: string; gradientTo: string; eventType: string; } }

const EVENT_EMOJI: Record<string, string> = {
  gathering: '\\u{1F389}',
  birthday: '\\u{1F382}',
  wedding: '\\u{1F48D}',
  baby: '\\u{1F476}',
  celebration: '\\u{1F389}',
  corporate: '\\u{1F3E2}',
  custom: '\\u{2728}',
};

export function HeroSection({ config }: Props) {
  const emoji = EVENT_EMOJI[config.eventType] || EVENT_EMOJI.custom;
  const [scrollFade, setScrollFade] = useState({ opacity: 1, translateY: 0 });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const maxScroll = window.innerHeight * 0.6;
        const progress = Math.min(y / maxScroll, 1);
        setScrollFade({ opacity: 1 - progress * 0.8, translateY: y * 0.3 });
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bgStyle = config.heroImageUrl
    ? { backgroundImage: \`url(\${config.heroImageUrl})\`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: \`linear-gradient(160deg, \${config.gradientFrom}, \${config.gradientTo})\` };

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden" style={{ ...bgStyle, minHeight: '100svh' }}>
      {/* Layered overlays for depth */}
      {config.heroImageUrl && <div className="absolute inset-0 bg-black/30" />}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 100%)' }} />

      {/* Floating orbs for visual richness */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', animation: 'float-slow 10s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '5%', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)', animation: 'float-slow 14s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)', transform: 'translate(-50%, -50%)', animation: 'rotate-slow 30s linear infinite' }} />
      </div>

      {/* Decorative corner lines */}
      <div className="absolute top-6 left-6 pointer-events-none" style={{ width: '40px', height: '40px', borderTop: '1px solid rgba(255,255,255,0.2)', borderLeft: '1px solid rgba(255,255,255,0.2)' }} />
      <div className="absolute top-6 right-6 pointer-events-none" style={{ width: '40px', height: '40px', borderTop: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)' }} />
      <div className="absolute bottom-20 left-6 pointer-events-none" style={{ width: '40px', height: '40px', borderBottom: '1px solid rgba(255,255,255,0.15)', borderLeft: '1px solid rgba(255,255,255,0.15)' }} />
      <div className="absolute bottom-20 right-6 pointer-events-none" style={{ width: '40px', height: '40px', borderBottom: '1px solid rgba(255,255,255,0.15)', borderRight: '1px solid rgba(255,255,255,0.15)' }} />

      <div
        className="relative z-10 max-w-md mx-auto"
        style={{ opacity: scrollFade.opacity, transform: \`translateY(\${scrollFade.translateY}px)\`, willChange: 'transform, opacity' }}
      >
        {/* Emoji with glow ring */}
        <div className="animate-fade-up flex items-center justify-center mx-auto mb-8" style={{ animationDuration: '1.2s' }}>
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{ width: '110px', height: '110px', top: '-7px', left: '-7px' }} />
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: '96px', height: '96px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)' }}
            >
              <span style={{ fontSize: '3rem', lineHeight: 1 }}>{emoji}</span>
            </div>
          </div>
        </div>

        <h1
          className="animate-fade-up-d1 font-bold text-white leading-snug whitespace-pre-line"
          style={{ fontSize: 'var(--inv-text-hero)', textShadow: '0 2px 16px rgba(0,0,0,0.3), 0 0 60px rgba(255,255,255,0.1)', letterSpacing: '-0.01em' }}
        >
          {config.title}
        </h1>

        {config.subtitle && (
          <p className="animate-fade-up-d2 mt-5 text-base md:text-lg text-white/80 leading-relaxed" style={{ letterSpacing: '0.04em' }}>
            {config.subtitle}
          </p>
        )}

        {/* Shimmer ornament divider */}
        <div className="animate-fade-up-d3 mt-8 flex items-center justify-center gap-3">
          <div style={{ width: '2rem', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4))' }} />
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
          <div className="animate-shimmer" style={{ width: '3rem', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', backgroundSize: '200% auto' }} />
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
          <div style={{ width: '2rem', height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.4), transparent)' }} />
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float" style={{ opacity: scrollFade.opacity }}>
        <div
          className="flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
          <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'Pretendard Variable, sans-serif' }}>scroll</span>
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/countdown-section.tsx
// ──────────────────────────────────────────────
const countdownSection = `'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { AnimatedReveal } from './animated-reveal';

interface Props { config: { eventDate: string; eventTime: string; eventDateLabel: string; eventDateLabelEn?: string; showCountdown: boolean; countdownStyle: 'flip' | 'simple'; } }

function getTimeLeft(targetDate: Date) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

function FlipCard({ value, label }: { value: number; label: string }) {
  const [display, setDisplay] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value !== prevRef.current) {
      setFlipping(true);
      const timer = setTimeout(() => {
        setDisplay(value);
        setFlipping(false);
        prevRef.current = value;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative overflow-hidden inv-card" style={{ width: '64px', height: '80px', perspective: '600px' }}>
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: flipping ? 'rotateX(-15deg)' : 'rotateX(0deg)',
          }}
        >
          <span className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--inv-accent)' }}>
            {String(display).padStart(2, '0')}
          </span>
        </div>
      </div>
      <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, color: 'var(--inv-text-secondary)' }}>{label}</span>
    </div>
  );
}

function SimpleCounter({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-2">
      <div className="tabular-nums" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--inv-accent)', lineHeight: 1.2 }}>
        {String(value).padStart(2, '0')}
      </div>
      <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, color: 'var(--inv-text-secondary)', marginTop: '0.375rem' }}>{label}</div>
    </div>
  );
}

function ColonSep() {
  return (
    <div className="flex items-center" style={{ fontSize: '1.25rem', fontWeight: 300, color: 'var(--inv-text-secondary)', paddingBottom: '1.5rem' }}>:</div>
  );
}

export function CountdownSection({ config }: Props) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  const targetMs = useMemo(
    () => new Date(\`\${config.eventDate}T\${config.eventTime || '00:00'}:00\`).getTime(),
    [config.eventDate, config.eventTime],
  );

  useEffect(() => {
    const target = new Date(targetMs);
    setTimeLeft(getTimeLeft(target));
    const timer = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(timer);
  }, [targetMs]);

  const CounterCard = config.countdownStyle === 'simple' ? SimpleCounter : FlipCard;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated" style={{ padding: 'var(--inv-section-py) var(--inv-section-px)', background: 'var(--inv-bg-alt)', textAlign: 'center' }}>
        {config.showCountdown && timeLeft && !timeLeft.expired && (
          <div className="animate-fade-up flex justify-center gap-3 md:gap-5 mb-8">
            <CounterCard value={timeLeft.days} label="DAYS" />
            <ColonSep />
            <CounterCard value={timeLeft.hours} label="HOURS" />
            <ColonSep />
            <CounterCard value={timeLeft.minutes} label="MIN" />
            <ColonSep />
            <CounterCard value={timeLeft.seconds} label="SEC" />
          </div>
        )}
        {timeLeft?.expired && (
          <div className="animate-fade-up mb-6" style={{ animation: 'celebrate-bounce 2s ease-in-out infinite' }}>
            <div className="mx-auto inv-card" style={{ maxWidth: '280px', padding: '1.5rem', borderTop: '3px solid var(--inv-accent)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>{'\\u{1F389}'}</span>
              <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--inv-accent)' }}>
                {'\\u{2728}'} {'\\uD589\\uC0AC\\uAC00 \\uC2DC\\uC791\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4!'} {'\\u{2728}'}
              </p>
            </div>
          </div>
        )}
        <p style={{ fontSize: 'var(--inv-text-body)', fontWeight: 500, color: 'var(--inv-text-primary)' }}>
          {config.eventDateLabel}
        </p>
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/hosts-section.tsx
// ──────────────────────────────────────────────
const hostsSection = `'use client';

import { AnimatedReveal } from './animated-reveal';

interface HostItem { name: string; nameEn?: string; role: string; roleEn?: string; phone?: string; avatarUrl?: string; }
interface Props { config: { hostsTitle: string; hostsTitleEn?: string; hosts: HostItem[]; } }

export function HostsSection({ config }: Props) {
  if (!config.hosts?.length) return null;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated" style={{ padding: 'var(--inv-section-py) var(--inv-section-px)' }}>
        <div className="text-center mb-8">
          <h2 className="inv-section-title">{config.hostsTitle}</h2>
        </div>
        <div className="grid gap-5 max-w-lg mx-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          {config.hosts.map((host, i) => (
            <div
              key={i}
              className="animate-fade-up flex flex-col items-center text-center inv-card"
              style={{ padding: '1.5rem 1rem', animationDelay: \`\${i * 0.1}s\` }}
            >
              {host.avatarUrl ? (
                <img
                  src={host.avatarUrl}
                  alt={host.name}
                  className="rounded-full object-cover mb-3"
                  style={{ width: '72px', height: '72px', border: '3px solid var(--inv-card-bg)', boxShadow: '0 0 0 2px var(--inv-accent-glow)' }}
                />
              ) : (
                <div
                  className="rounded-full flex items-center justify-center mb-3"
                  style={{
                    width: '72px', height: '72px',
                    background: \`linear-gradient(135deg, var(--inv-gradient-from), var(--inv-gradient-to))\`,
                    color: '#fff', fontSize: '1.5rem', fontWeight: 700,
                    boxShadow: '0 4px 16px color-mix(in oklch, var(--inv-accent) 30%, transparent)',
                  }}
                >
                  {host.name.charAt(0)}
                </div>
              )}
              <p style={{ fontSize: '0.8125rem', color: 'var(--inv-text-secondary)', marginBottom: '2px' }}>{host.role}</p>
              <p style={{ fontWeight: 600, color: 'var(--inv-text-primary)', fontSize: '1rem' }}>{host.name}</p>
              {host.phone && (
                <a
                  href={\`tel:\${host.phone}\`}
                  className="inv-btn inv-btn-secondary mt-3"
                  style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', minHeight: '40px' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {host.phone}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/location-section.tsx
// ──────────────────────────────────────────────
const locationSection = `'use client';

import { AnimatedReveal } from './animated-reveal';

interface Props { config: { venueName: string; venueAddress: string; kakaoMapUrl: string; naverMapUrl: string; parkingInfo: string; transitInfo: string; } }

export function LocationSection({ config }: Props) {
  if (!config.venueName && !config.venueAddress) return null;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated" style={{ padding: 'var(--inv-section-py) var(--inv-section-px)' }}>
        <div className="text-center mb-6">
          <h2 className="inv-section-title">{'\\uC7A5\\uC18C \\uC548\\uB0B4'}</h2>
        </div>
        <div className="max-w-md mx-auto inv-card" style={{ padding: '1.5rem' }}>
          {/* Venue info */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 flex items-center justify-center rounded-full" style={{ width: '44px', height: '44px', background: 'var(--inv-accent-glow)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--inv-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              {config.venueName && <p style={{ fontWeight: 600, fontSize: '1.0625rem', color: 'var(--inv-text-primary)' }}>{config.venueName}</p>}
              {config.venueAddress && <p style={{ fontSize: '0.875rem', color: 'var(--inv-text-secondary)', marginTop: '2px' }}>{config.venueAddress}</p>}
            </div>
          </div>

          {/* Map buttons */}
          <div className="flex gap-3 mt-5">
            {config.kakaoMapUrl && (
              <a href={config.kakaoMapUrl} target="_blank" rel="noopener noreferrer" className="flex-1 inv-btn inv-btn-kakao" style={{ fontSize: '0.875rem' }}>
                {'\\uCE74\\uCE74\\uC624\\uB9F5'}
              </a>
            )}
            {config.naverMapUrl && (
              <a href={config.naverMapUrl} target="_blank" rel="noopener noreferrer" className="flex-1 inv-btn inv-btn-naver" style={{ fontSize: '0.875rem' }}>
                {'\\uB124\\uC774\\uBC84\\uB9F5'}
              </a>
            )}
          </div>

          {/* Parking / Transit info */}
          {(config.parkingInfo || config.transitInfo) && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--inv-card-border)', paddingLeft: '0.75rem', borderLeft: '3px solid var(--inv-accent-glow)' }}>
              {config.parkingInfo && (
                <p className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--inv-text-secondary)', marginBottom: '0.375rem' }}>
                  <span className="flex-shrink-0 flex items-center justify-center rounded-full" style={{ width: '24px', height: '24px', background: 'var(--inv-accent-glow)', fontSize: '0.75rem' }}>{'\\u{1F17F}\\u{FE0F}'}</span>
                  {config.parkingInfo}
                </p>
              )}
              {config.transitInfo && (
                <p className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--inv-text-secondary)' }}>
                  <span className="flex-shrink-0 flex items-center justify-center rounded-full" style={{ width: '24px', height: '24px', background: 'var(--inv-accent-glow)', fontSize: '0.75rem' }}>{'\\u{1F68C}'}</span>
                  {config.transitInfo}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/gallery-section.tsx
// ──────────────────────────────────────────────
const gallerySection = `'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatedReveal } from './animated-reveal';

interface Props { config: { galleryImages: string[]; galleryColumns: number; } }

export function GallerySection({ config }: Props) {
  if (!config.galleryImages?.length) return null;

  const useCarousel = config.galleryImages.length <= 4;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated" style={{ padding: 'var(--inv-section-py) var(--inv-section-px)' }}>
        <div className="text-center mb-6">
          <h2 className="inv-section-title">{'\\uAC24\\uB7EC\\uB9AC'}</h2>
        </div>
        {useCarousel ? <Carousel images={config.galleryImages} /> : <BentoGrid images={config.galleryImages} columns={config.galleryColumns} />}
      </section>
    </AnimatedReveal>
  );
}

function Carousel({ images }: { images: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = children.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveIdx(idx);
          }
        }
      },
      { root: el, threshold: 0.6 },
    );
    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [images.length]);

  return (
    <div className="max-w-lg mx-auto">
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-3 pb-2" style={{ scrollPaddingInline: '1.5rem' }}>
        {images.map((url, i) => (
          <div key={i} className="snap-center flex-shrink-0 overflow-hidden rounded-xl" style={{ width: 'min(75vw, 320px)', aspectRatio: '3/4' }}>
            <img src={url} alt={\`Photo \${i + 1}\`} className="w-full h-full object-cover" style={{ transition: 'transform 0.5s ease' }} loading="lazy"
              onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'scale(1.06)'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="inv-dots">
          {images.map((_, i) => (<div key={i} className={\`inv-dot \${i === activeIdx ? 'inv-dot-active' : ''}\`} />))}
        </div>
      )}
    </div>
  );
}

function BentoGrid({ images, columns }: { images: string[]; columns: number }) {
  return (
    <div className="max-w-lg mx-auto grid gap-2" style={{ gridTemplateColumns: \`repeat(\${Math.min(columns, 3)}, 1fr)\` }}>
      {images.map((url, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl group"
          style={{ aspectRatio: i === 0 && images.length >= 5 ? '1' : '1', gridRow: i === 0 && images.length >= 5 ? 'span 2' : undefined, gridColumn: i === 0 && images.length >= 5 ? 'span 2' : undefined }}
        >
          <div className="relative w-full h-full overflow-hidden">
            <img src={url} alt={\`Photo \${i + 1}\`} className="w-full h-full object-cover" style={{ transition: 'transform 0.6s ease' }} loading="lazy"
              onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'scale(1.08)'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/account-section.tsx
// ──────────────────────────────────────────────
const accountSection = `'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatedReveal } from './animated-reveal';

interface AccountItem { label: string; bankName: string; accountNumber: string; holder: string; }
interface Props { config: { accountTitle: string; accounts: AccountItem[]; kakaoPayUrl: string; } }

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClosing(true);
      setTimeout(onClose, 300);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="inv-toast" data-closing={closing ? 'true' : undefined}>
      {'\\u2713'} {message}
    </div>
  );
}

export function AccountSection({ config }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const handleCopy = useCallback(async (text: string, label: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        window.prompt('\\uBCF5\\uC0AC\\uD574\\uC8FC\\uC138\\uC694:', text);
        return;
      }
      setToast(\`\${label} \\uBCF5\\uC0AC\\uB428\`);
    } catch {
      window.prompt('\\uBCF5\\uC0AC\\uD574\\uC8FC\\uC138\\uC694:', text);
    }
  }, []);

  if (!config.accounts?.length && !config.kakaoPayUrl) return null;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated" style={{ padding: 'var(--inv-section-py) var(--inv-section-px)', background: 'var(--inv-bg-alt)' }}>
        <div className="text-center mb-6">
          <h2 className="inv-section-title">{config.accountTitle}</h2>
        </div>
        <div className="max-w-md mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {config.accounts.map((acc, i) => (
            <div key={i} className="inv-card-accent" style={{ padding: '1.25rem' }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--inv-accent)', background: 'var(--inv-accent-glow)', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                  {acc.label}
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--inv-text-secondary)' }}>{acc.holder}</span>
              </div>
              <div className="flex items-center justify-between">
                <p style={{ color: 'var(--inv-text-primary)', fontWeight: 500 }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--inv-text-secondary)' }}>{acc.bankName}</span>{' '}
                  <span style={{ fontFamily: "'Pretendard Variable', monospace", letterSpacing: '0.03em' }}>{acc.accountNumber}</span>
                </p>
                <button
                  onClick={() => handleCopy(acc.accountNumber, acc.bankName)}
                  className="inv-btn inv-btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem', minHeight: '32px' }}
                >
                  {'\\uBCF5\\uC0AC'}
                </button>
              </div>
            </div>
          ))}
          {config.kakaoPayUrl && (
            <a href={config.kakaoPayUrl} target="_blank" rel="noopener noreferrer" className="inv-btn inv-btn-kakao" style={{ width: '100%', marginTop: '0.25rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919">
                <path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.8 5.22 4.5 6.6-.2.73-.72 2.65-.82 3.06-.13.5.18.49.38.36.16-.11 2.5-1.7 3.51-2.39.47.07.95.1 1.43.1 5.52 0 10-3.58 10-7.73C22 6.58 17.52 3 12 3z"/>
              </svg>
              {'\\uCE74\\uCE74\\uC624\\uD398\\uC774\\uB85C \\uC1A1\\uAE08\\uD558\\uAE30'}
            </a>
          )}
        </div>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/contact-section.tsx
// ──────────────────────────────────────────────
const contactSection = `'use client';

import { AnimatedReveal } from './animated-reveal';

interface ContactItem { name: string; phone: string; role?: string; }
interface Props { config: { contacts: ContactItem[]; } }

export function ContactSection({ config }: Props) {
  if (!config.contacts?.length) return null;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated" style={{ padding: 'var(--inv-section-py) var(--inv-section-px)' }}>
        <div className="text-center mb-6">
          <h2 className="inv-section-title">{'\\uC5F0\\uB77D\\uCC98'}</h2>
        </div>
        <div className="max-w-md mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {config.contacts.map((c, i) => (
            <div key={i} className="inv-card-accent flex items-center justify-between" style={{ padding: '1rem 1.25rem' }}>
              <div className="flex items-center gap-2">
                {c.role && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: '999px', background: 'var(--inv-accent-glow)', color: 'var(--inv-accent)', border: '1px solid color-mix(in oklch, var(--inv-accent) 20%, transparent)' }}>
                    {c.role}
                  </span>
                )}
                <span style={{ fontWeight: 600, color: 'var(--inv-text-primary)' }}>{c.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <a href={\`tel:\${c.phone}\`} className="inv-btn inv-btn-primary" style={{ padding: '0.5rem 1rem', minHeight: '40px', fontSize: '0.8125rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {'\\uC804\\uD654'}
                </a>
                <a href={\`sms:\${c.phone}\`} className="inv-btn inv-btn-secondary" style={{ padding: '0.5rem 1rem', minHeight: '40px', fontSize: '0.8125rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  {'\\uBB38\\uC790'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/lib/config.ts (placeholder — 제너레이터가 실제 생성)
// ──────────────────────────────────────────────
const configTs = `// placeholder — overwritten by generator
export const siteConfig = {
  eventType: 'gathering',
  designPreset: 'elegant-gold',
  title: '함께해 주세요',
  titleEn: "You're Invited",
  subtitle: '소중한 자리에 초대합니다',
  subtitleEn: 'We warmly invite you to join us',
  heroImageUrl: '',
  gradientFrom: '#b8860b',
  gradientTo: '#d4a853',
  eventDate: '2026-06-15',
  eventTime: '14:00',
  eventDateLabel: '2026년 6월 15일 토요일 오후 2시',
  eventDateLabelEn: 'Saturday, June 15, 2026 at 2:00 PM',
  showCountdown: true,
  countdownStyle: 'flip' as 'flip' | 'simple',
  hostsTitle: '초대하는 사람',
  hostsTitleEn: 'Hosted by',
  hosts: [{ name: '홍길동', role: '주최', phone: '', avatarUrl: '' }],
  venueName: '',
  venueNameEn: '',
  venueAddress: '',
  venueAddressEn: '',
  kakaoMapUrl: '',
  naverMapUrl: '',
  parkingInfo: '',
  transitInfo: '',
  galleryImages: [] as string[],
  galleryColumns: 3,
  accountTitle: '마음 전하기',
  accountTitleEn: 'Send Your Wishes',
  accounts: [] as { label: string; bankName: string; accountNumber: string; holder: string; }[],
  kakaoPayUrl: '',
  contacts: [{ name: '홍길동', phone: '010-1234-5678', role: '주최자' }],
};
`;

// ──────────────────────────────────────────────
// src/app/page.tsx (placeholder — 제너레이터가 실제 생성)
// ──────────────────────────────────────────────
const pageTsx = `import { siteConfig } from '@/lib/config';
import { HeroSection } from '@/components/hero-section';
import { CountdownSection } from '@/components/countdown-section';
import { HostsSection } from '@/components/hosts-section';
import { LocationSection } from '@/components/location-section';
import { GallerySection } from '@/components/gallery-section';
import { AccountSection } from '@/components/account-section';
import { ContactSection } from '@/components/contact-section';

export default function Home() {
  return (
    <>
      <main className="min-h-screen" style={{ background: 'var(--inv-bg)' }}>
        <HeroSection config={siteConfig} />
        <CountdownSection config={siteConfig} />
        <HostsSection config={siteConfig} />
        <LocationSection config={siteConfig} />
        <GallerySection config={siteConfig} />
        <AccountSection config={siteConfig} />
        <ContactSection config={siteConfig} />
      </main>
      <footer className="relative overflow-hidden py-8 text-center text-xs" style={{ color: 'var(--inv-text-secondary)', background: 'linear-gradient(180deg, var(--inv-bg-alt) 0%, var(--inv-bg) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, var(--inv-accent-soft) 0%, transparent 60%)' }} />
        <div className="relative">
          <div style={{ width: '24px', height: '1px', margin: '0 auto 1rem', background: 'linear-gradient(90deg, transparent, var(--inv-card-border), transparent)' }} />
          <a href="https://linkmap.pages.dev" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
            Powered by Linkmap
          </a>
        </div>
      </footer>
    </>
  );
}
`;

// ──────────────────────────────────────────────
// export
// ──────────────────────────────────────────────
export const invitationTemplate: HomepageTemplateContent = {
  slug: 'invitation',
  repoName: 'invitation',
  description: '모바일 초대장 - Linkmap으로 생성',
  files: [
    { path: '.gitignore', content: gitignore },
    { path: '.github/workflows/deploy.yml', content: deployYml },
    { path: 'package.json', content: packageJson },
    { path: 'package-lock.json', content: packageLock },
    { path: 'tsconfig.json', content: tsconfigJson },
    { path: 'postcss.config.mjs', content: postcssConfig },
    { path: 'next.config.ts', content: nextConfig },
    { path: 'src/app/layout.tsx', content: layoutTsx },
    { path: 'src/app/page.tsx', content: pageTsx },
    { path: 'src/app/globals.css', content: globalsCss },
    { path: 'src/lib/config.ts', content: configTs },
    { path: 'src/components/animated-reveal.tsx', content: animatedReveal },
    { path: 'src/components/hero-section.tsx', content: heroSection },
    { path: 'src/components/countdown-section.tsx', content: countdownSection },
    { path: 'src/components/hosts-section.tsx', content: hostsSection },
    { path: 'src/components/location-section.tsx', content: locationSection },
    { path: 'src/components/gallery-section.tsx', content: gallerySection },
    { path: 'src/components/account-section.tsx', content: accountSection },
    { path: 'src/components/contact-section.tsx', content: contactSection },
  ],
};
