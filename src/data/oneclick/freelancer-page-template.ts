import type { HomepageTemplateContent } from './homepage-template-content';
import {
  sharedGitignore as gitignore,
  sharedDeployYml as deployYml,
  sharedTsconfigJson as tsconfigJson,
  sharedPostcssConfig as postcssConfig,
  sharedNextConfig as nextConfig,
  sharedAnimatedReveal as animatedReveal,
  sharedSectionWrapper as sectionWrapper,
  sharedThemeToggle as themeToggle,
  sharedLanguageToggle as languageToggle,
  sharedRotatingText as rotatingText,
  makePackageJson,
  makePackageLock,
} from './shared-template-files';

const packageJson = makePackageJson('freelancer-page');
const packageLock = makePackageLock('freelancer-page');

// ──────────────────────────────────────────────
// src/app/api/og/route.tsx
// ──────────────────────────────────────────────
const ogRoute = `import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-static';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #5b13ec, #06b6d4)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#9ca3af',
            marginTop: 12,
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          {siteConfig.tagline}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
`;

// ──────────────────────────────────────────────
// src/app/globals.css
// ──────────────────────────────────────────────
const globalsCss = `@import "tailwindcss";

@theme {
  --font-sans: 'Pretendard Variable', 'Inter', ui-sans-serif, system-ui, sans-serif;
  --color-primary: #5b13ec;
  --color-accent: #06b6d4;
}

:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-surface: rgba(0, 0, 0, 0.02);
  --text-primary: #18181b;
  --text-secondary: #52525b;
  --text-muted: #a1a1aa;
  --border-color: rgba(0, 0, 0, 0.08);

  /* Spacing */
  --section-gap: clamp(4rem, 8vw, 7rem);
  --section-padding-x: clamp(1rem, 4vw, 3rem);

  /* Surface */
  --surface-elevated: #ffffff;
  --surface-sunken: #f8f9fa;
  --surface-border: rgba(0, 0, 0, 0.06);
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.04);

  /* Unified Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}

.dark {
  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --bg-surface: rgba(255, 255, 255, 0.02);
  --text-primary: #f4f4f5;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --border-color: rgba(255, 255, 255, 0.05);

  --surface-elevated: #1a1a1a;
  --surface-sunken: #141414;
  --surface-border: rgba(255, 255, 255, 0.06);
  --shadow-card: 0 1px 3px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.15);
  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.2);
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

*:focus-visible {
  outline: 2px solid var(--color-primary, #3b82f6);
  outline-offset: 2px;
}

/* Reveal animation */
.reveal-fade {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-fade.revealed {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .reveal-fade { opacity: 1; transform: none; transition: none; }
}

/* Reveal variants */
.reveal-slide-left { opacity: 0; transform: translateX(-32px); transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal-slide-left.revealed { opacity: 1; transform: translateX(0); }
.reveal-slide-right { opacity: 0; transform: translateX(32px); transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal-slide-right.revealed { opacity: 1; transform: translateX(0); }
.reveal-scale { opacity: 0; transform: scale(0.95); transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal-scale.revealed { opacity: 1; transform: scale(1); }
@media (prefers-reduced-motion: reduce) {
  .reveal-slide-left, .reveal-slide-right, .reveal-scale { opacity: 1; transform: none; transition: none; }
}

/* Card lift */
.card-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; box-shadow: var(--shadow-card); }
.card-lift:hover { transform: translateY(-4px); box-shadow: var(--shadow-card-hover); }

/* Button press */
.btn-press { transition: transform 0.15s ease; }
.btn-press:active { transform: scale(0.97); }

/* Section gap */
.section-gap { padding-top: var(--section-gap, 4rem); padding-bottom: var(--section-gap, 4rem); }

/* Bento grid */
.bento-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
@media (min-width: 768px) {
  .bento-grid { grid-template-columns: repeat(3, 1fr); }
  .bento-grid > *:first-child { grid-row: span 2; grid-column: span 2; }
}
.bento-grid > * { position: relative; overflow: hidden; border-radius: var(--radius-lg, 16px); background: rgba(127, 127, 127, 0.08); }
.bento-grid > * img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.5s ease; }
.bento-grid > *:hover img { transform: scale(1.05); }

/* Timeline (horizontal on desktop) */
.process-timeline { display: flex; flex-direction: column; gap: 2rem; }
@media (min-width: 768px) {
  .process-timeline { flex-direction: row; position: relative; }
  .process-timeline::before { content: ''; position: absolute; top: 24px; left: 24px; right: 24px; height: 2px; background: var(--surface-border); }
  .process-timeline > * { flex: 1; text-align: center; position: relative; padding-top: 3rem; }
  .process-timeline > *::before { content: ''; position: absolute; top: 17px; left: 50%; transform: translateX(-50%); width: 16px; height: 16px; border-radius: 50%; border: 3px solid var(--color-primary, #10b981); background: var(--surface-elevated); z-index: 1; }
}

/* Card hover (legacy) */
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

/* Scroll progress */
.scroll-progress {
  position: fixed;
  top: 56px;
  left: 0;
  height: 2px;
  background: var(--color-primary, #6366f1);
  z-index: 100;
  transition: width 0.1s linear;
  pointer-events: none;
}

/* Lightbox dialog */
dialog.lightbox {
  max-width: 90vw;
  max-height: 90vh;
  border: none;
  border-radius: 1rem;
  background: transparent;
  padding: 0;
  overflow: visible;
}
dialog.lightbox::backdrop {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
}
dialog.lightbox img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 0.75rem;
}

/* Hero load animation */
@keyframes fade-up { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
.animate-fade-up { animation: fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
.animate-fade-up-d1 { animation: fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay:150ms; opacity:0; }
.animate-fade-up-d2 { animation: fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay:300ms; opacity:0; }
@media (prefers-reduced-motion:reduce) {
  .animate-fade-up, .animate-fade-up-d1, .animate-fade-up-d2 { animation:none; opacity:1; transform:none; }
}

/* Scroll indicator float */
@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

@media (prefers-reduced-motion: reduce) {
  .card-lift:hover { transform: none; }
  .btn-press:active { transform: none; }
}

/* ── Rotating Text ── */
.rotating-text-wrapper {
  height: 2em;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Service Table ── */
.service-table {
  width: 100%;
}
.service-row {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 1.5rem;
  padding: 2rem 0;
  border-bottom: 1px solid var(--surface-border);
  align-items: start;
  transition: background 0.2s ease;
}
.service-row:first-child {
  border-top: 1px solid var(--surface-border);
}
.service-row:last-child {
  border-bottom: none;
}
.service-number {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-muted, #a1a1aa);
  padding-top: 0.25rem;
}
.service-price {
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
  padding-top: 0.25rem;
  background: linear-gradient(135deg, var(--color-primary, #5b13ec), var(--color-accent, #06b6d4));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@media (max-width: 640px) {
  .service-row {
    grid-template-columns: 40px 1fr;
    gap: 0.75rem;
  }
  .service-price {
    grid-column: 2;
    padding-top: 0;
  }
}

/* ── Portfolio Card ── */
.portfolio-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  cursor: pointer;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  background: rgba(127, 127, 127, 0.08);
}
.portfolio-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 60px color-mix(in oklch, var(--color-primary, #5b13ec) 20%, transparent);
}
.portfolio-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.6s ease;
  display: block;
}
.portfolio-card:hover img {
  transform: scale(1.08);
}
.portfolio-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.82) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.portfolio-card:hover .portfolio-overlay {
  opacity: 1;
}
.portfolio-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  margin-bottom: 8px;
  width: fit-content;
}
.portfolio-overlay h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

/* ── Testimonial Pull-Quote ── */
.testimonial-card {
  position: relative;
  background: var(--surface-elevated);
  border-radius: 20px;
  padding: 3rem 2.25rem 2.25rem;
  border: 1px solid var(--surface-border);
  box-shadow: var(--shadow-card);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}
.testimonial-card::before {
  content: '\\201C';
  position: absolute;
  top: -8px;
  left: 28px;
  font-size: 6rem;
  line-height: 1;
  font-family: Georgia, 'Times New Roman', serif;
  color: var(--color-primary, #5b13ec);
  opacity: 0.15;
  pointer-events: none;
}
.testimonial-body {
  font-size: 1.0625rem;
  font-style: italic;
  line-height: 1.8;
  color: var(--text-secondary, #52525b);
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}
.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}
.testimonial-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary, #5b13ec), var(--color-accent, #06b6d4));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

/* ── Process Steps ── */
.process-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  position: relative;
}
.process-grid::before {
  content: '';
  position: absolute;
  top: 28px;
  left: calc(12.5% + 12px);
  right: calc(12.5% + 12px);
  height: 2px;
  background: var(--surface-border);
}
.process-step {
  text-align: center;
  position: relative;
}
.process-num {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--surface-elevated);
  border: 2px solid var(--surface-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-primary, #5b13ec);
  margin: 0 auto 1.25rem;
  position: relative;
  z-index: 1;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.process-step:hover .process-num {
  border-color: var(--color-primary, #5b13ec);
  box-shadow: 0 0 20px color-mix(in oklch, var(--color-primary, #5b13ec) 25%, transparent);
  transform: scale(1.1);
}
@media (max-width: 768px) {
  .process-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  .process-grid::before { display: none; }
}
@media (max-width: 480px) {
  .process-grid { grid-template-columns: 1fr; }
}

/* ── Contact Social Links ── */
.social-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 999px;
  border: 1px solid var(--surface-border);
  font-size: 0.9375rem;
  font-weight: 500;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  color: inherit;
}
.social-link:hover {
  border-color: var(--color-primary, #5b13ec);
  box-shadow: 0 0 20px color-mix(in oklch, var(--color-primary, #5b13ec) 20%, transparent);
  transform: translateY(-2px);
}

/* Premium hover */
.hover-glow { transition: box-shadow 0.3s ease; }
.hover-glow:hover {
  box-shadow: 0 0 20px color-mix(in oklch, var(--color-primary, #5b13ec) 30%, transparent),
              0 0 40px color-mix(in oklch, var(--color-primary, #5b13ec) 10%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .hover-glow:hover { box-shadow: none; }
  .portfolio-card:hover { transform: none; }
  .testimonial-card:hover { transform: none; }
  .process-step:hover .process-num { transform: none; }
  .social-link:hover { transform: none; }
}
`;

// ──────────────────────────────────────────────
// src/app/layout.tsx
// ──────────────────────────────────────────────
const layoutTsx = `import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: \`\${siteConfig.name} - \${siteConfig.tagline}\`,
  description: siteConfig.tagline,
  openGraph: {
    title: \`\${siteConfig.name} - \${siteConfig.tagline}\`,
    description: siteConfig.tagline,
    type: 'website',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
    title: \`\${siteConfig.name} - \${siteConfig.tagline}\`,
    description: siteConfig.tagline,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script dangerouslySetInnerHTML={{ __html: "(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}})()" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: siteConfig.name,
              description: siteConfig.tagline,
              ...(siteConfig.email ? { email: siteConfig.email } : {}),
              ...(siteConfig.socials?.length ? { sameAs: siteConfig.socials.map((s: { url: string }) => s.url) } : {}),
              ...(siteConfig.services?.length ? {
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  itemListElement: siteConfig.services.map((s) => ({
                    '@type': 'Offer',
                    name: s.title,
                    description: s.desc,
                  })),
                },
              } : {}),
            }),
          }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900 dark:bg-[#0f0f0f] dark:text-gray-50">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:shadow-lg focus:text-sm">본문으로 바로가기</a>
        {children}
      </body>
    </html>
  );
}
`;

// ──────────────────────────────────────────────
// src/app/page.tsx
// ──────────────────────────────────────────────
const pageTsx = `import { siteConfig } from '@/lib/config';
import { NavHeader } from '@/components/nav-header';
import { HeroSection } from '@/components/hero-section';
import { ServicesSection } from '@/components/services-section';
import { PortfolioSection } from '@/components/portfolio-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { ProcessSection } from '@/components/process-section';
import { ContactSection } from '@/components/contact-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <NavHeader />
      <main id="main">
        <HeroSection config={siteConfig} />
        {siteConfig.services.length > 0 && (
          <ServicesSection services={siteConfig.services} />
        )}
        {siteConfig.portfolio.length > 0 && (
          <PortfolioSection
            portfolio={siteConfig.portfolio}
            columns={siteConfig.portfolioColumns as '2' | '3' | '4'}
          />
        )}
        {siteConfig.testimonials.length > 0 && (
          <TestimonialsSection testimonials={siteConfig.testimonials} />
        )}
        {siteConfig.process.length > 0 && (
          <ProcessSection process={siteConfig.process} />
        )}
        <ContactSection config={siteConfig} />
      </main>
      <Footer />
    </>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/hero-section.tsx
// ──────────────────────────────────────────────
const heroSection = `'use client';

import { ArrowDown } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';
import { RotatingText } from './rotating-text';

interface Props {
  config: SiteConfig;
}

export function HeroSection({ config }: Props) {
  const { locale, t } = useLocale();
  const name = locale === 'en' && config.nameEn ? config.nameEn : config.name;
  const title = locale === 'en' && config.titleEn ? config.titleEn : config.title;
  const tagline = locale === 'en' && config.taglineEn ? config.taglineEn : config.tagline;

  const rotatingWords = config.rotatingWords && config.rotatingWords.length > 0
    ? config.rotatingWords
    : ['Brand Identity', 'Packaging', 'Social Media', 'Web Design'];

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Glow background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, color-mix(in oklch, var(--color-primary, #5b13ec) 15%, transparent) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 text-center max-w-3xl animate-fade-up">
        {/* Avatar */}
        {config.avatarUrl && (
          <div className="relative inline-block mb-8">
            <img
              src={config.avatarUrl}
              alt={name}
              className="w-28 h-28 rounded-2xl object-cover ring-2 ring-[#5b13ec]/30 mx-auto"
            />
          </div>
        )}

        {/* Name — small uppercase label */}
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-4 animate-fade-up">
          {name}
        </p>

        {/* Title — large gradient headline */}
        <h1
          className="font-extrabold leading-[1.1] mb-6 bg-gradient-to-r from-[#5b13ec] to-[#06b6d4] bg-clip-text text-transparent animate-fade-up-d1"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
        >
          {title || name}
        </h1>

        {/* Tagline */}
        <p
          className="text-gray-500 dark:text-gray-400 mb-6 mx-auto animate-fade-up-d1"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', maxWidth: '560px', lineHeight: '1.7' }}
        >
          {tagline}
        </p>

        {/* Rotating words */}
        <div
          className="rotating-text-wrapper mb-10 animate-fade-up-d2"
          aria-live="polite"
        >
          <RotatingText
            words={rotatingWords}
            className="text-lg font-semibold text-[#06b6d4] whitespace-nowrap"
          />
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#5b13ec] to-[#06b6d4] text-white text-base font-semibold hover:opacity-90 transition-opacity animate-fade-up-d2 btn-press"
        >
          {t('hero.cta')}
          <ArrowDown className="w-4 h-4" />
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[0.75rem] tracking-[0.15em] text-gray-400"
        style={{ animation: 'float 2s ease-in-out infinite' }}
      >
        SCROLL
        <span className="block w-px h-8 bg-gray-300 dark:bg-gray-700" />
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/services-section.tsx
// ──────────────────────────────────────────────
const servicesSection = `'use client';

import type { ServiceItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';
import { AnimatedReveal } from './animated-reveal';

interface Props {
  services: ServiceItem[];
}

export function ServicesSection({ services }: Props) {
  const { locale, t } = useLocale();

  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="py-20 sm:py-28 px-4 sm:px-6 bg-gray-50/60 dark:bg-[#1a1a1a]/60">
      <div className="max-w-4xl mx-auto">
        <AnimatedReveal>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#5b13ec] mb-3">
            Services
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {t('services.title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-lg leading-relaxed">
            {t('services.desc')}
          </p>
        </AnimatedReveal>

        <div className="service-table">
          {services.map((service, i) => {
            const title = locale === 'en' && service.titleEn ? service.titleEn : service.title;
            const desc = locale === 'en' && service.descEn ? service.descEn : service.desc;
            const price = locale === 'en' && service.priceEn ? service.priceEn : service.price;
            return (
              <AnimatedReveal key={i} delay={i * 80}>
                <div className="service-row group hover-glow">
                  <span className="service-number">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#5b13ec] transition-colors duration-200 mb-1">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                  {price && <span className="service-price">{price}</span>}
                </div>
              </AnimatedReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/portfolio-section.tsx
// ──────────────────────────────────────────────
const portfolioSection = `'use client';

import { useState, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import type { PortfolioItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';
import { AnimatedReveal } from './animated-reveal';

interface Props {
  portfolio: PortfolioItem[];
  columns?: '2' | '3' | '4';
}

const colClass: Record<string, string> = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
};

export function PortfolioSection({ portfolio, columns = '3' }: Props) {
  const { locale, t } = useLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [lightboxItem, setLightboxItem] = useState<{ src: string; alt: string; desc: string } | null>(null);

  const allCats = ['all', ...Array.from(new Set(
    portfolio.map((p) => (locale === 'en' && p.categoryEn ? p.categoryEn : p.category))
  ))];
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? portfolio
    : portfolio.filter((p) => {
        const cat = locale === 'en' && p.categoryEn ? p.categoryEn : p.category;
        return cat === activeCategory;
      });

  const openLightbox = useCallback((src: string, alt: string, desc: string) => {
    setLightboxItem({ src, alt, desc });
    dialogRef.current?.showModal();
  }, []);

  const closeLightbox = useCallback(() => {
    dialogRef.current?.close();
    setLightboxItem(null);
  }, []);

  if (!portfolio || portfolio.length === 0) return null;

  const gridCols = colClass[columns] ?? colClass['3'];

  return (
    <section id="portfolio" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedReveal>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#5b13ec] mb-3">
            Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {t('portfolio.title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
            {t('portfolio.desc')}
          </p>
        </AnimatedReveal>

        {/* Category filter */}
        <div className="flex items-center gap-2 mb-10 flex-wrap">
          {allCats.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={\`px-4 py-1.5 rounded-full text-sm font-medium transition-colors \${
                activeCategory === cat
                  ? 'bg-[#5b13ec] text-white'
                  : 'text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 hover:border-[#5b13ec] hover:text-[#5b13ec]'
              }\`}
            >
              {cat === 'all' ? t('portfolio.all') : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div key={activeCategory} className={\`grid \${gridCols} gap-6\`}>
          {filtered.map((item, i) => {
            const title = locale === 'en' && item.titleEn ? item.titleEn : item.title;
            const desc = locale === 'en' && item.descEn ? item.descEn : (item.desc ?? '');
            const category = locale === 'en' && item.categoryEn ? item.categoryEn : item.category;
            return (
              <AnimatedReveal key={i} delay={i * 60} variant="scale">
                <div
                  className="portfolio-card"
                  onClick={() => openLightbox(item.imageUrl, title, desc)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(item.imageUrl, title, desc); }}
                  aria-label={\`\${title} 상세보기\`}
                >
                  <img
                    src={item.imageUrl}
                    alt={title}
                    loading="lazy"
                  />
                  <div className="portfolio-overlay">
                    <span className="portfolio-tag">{category}</span>
                    <h3>{title}</h3>
                  </div>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <dialog
        ref={dialogRef}
        className="lightbox"
        onClick={(e) => { if (e.target === dialogRef.current) closeLightbox(); }}
        onKeyDown={(e) => { if (e.key === 'Escape') closeLightbox(); }}
      >
        {lightboxItem && (
          <div className="relative">
            <button
              onClick={closeLightbox}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={lightboxItem.src}
              alt={lightboxItem.alt}
              className="rounded-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
              <h3 className="text-white font-semibold">{lightboxItem.alt}</h3>
              {lightboxItem.desc && (
                <p className="text-gray-300 text-sm mt-1">{lightboxItem.desc}</p>
              )}
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/testimonials-section.tsx
// ──────────────────────────────────────────────
const testimonialsSection = `'use client';

import type { TestimonialItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';
import { AnimatedReveal } from './animated-reveal';

interface Props {
  testimonials: TestimonialItem[];
}

export function TestimonialsSection({ testimonials }: Props) {
  const { locale, t } = useLocale();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 sm:py-28 px-4 sm:px-6 bg-gray-50/60 dark:bg-[#1a1a1a]/60">
      <div className="max-w-5xl mx-auto">
        <AnimatedReveal>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#5b13ec] mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {t('testimonials.title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-lg leading-relaxed">
            {t('testimonials.desc')}
          </p>
        </AnimatedReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item, i) => {
            const author = locale === 'en' && item.authorEn ? item.authorEn : item.author;
            const role = locale === 'en' && item.roleEn ? item.roleEn : item.role;
            const company = locale === 'en' && item.companyEn ? item.companyEn : item.company;
            const content = locale === 'en' && item.contentEn ? item.contentEn : item.content;
            const rating = Math.min(5, Math.max(1, item.rating));
            // 이름 첫 글자 (아바타 이니셜)
            const initial = author ? author.charAt(0) : '?';
            return (
              <AnimatedReveal key={i} delay={i * 120}>
                <div className="testimonial-card">
                  {/* 본문 */}
                  <p className="testimonial-body">{content}</p>

                  {/* 별점 */}
                  <div className="flex gap-0.5 mb-4" aria-label={\`별점 \${rating}점\`}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} className={\`text-base \${j < rating ? 'text-[#f59e0b]' : 'text-gray-300 dark:text-gray-600'}\`}>
                        ★
                      </span>
                    ))}
                  </div>

                  {/* 작성자 */}
                  <div className="testimonial-author">
                    <div className="testimonial-avatar" aria-hidden="true">{initial}</div>
                    <div>
                      <strong className="block text-[0.9375rem] font-bold text-gray-900 dark:text-gray-100">
                        {author}
                      </strong>
                      <span className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
                        {role}{role && company ? ' · ' : ''}{company}
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/process-section.tsx
// ──────────────────────────────────────────────
const processSection = `'use client';

import type { ProcessStep } from '@/lib/config';
import { useLocale } from '@/lib/i18n';
import { AnimatedReveal } from './animated-reveal';

interface Props {
  process: ProcessStep[];
}

export function ProcessSection({ process }: Props) {
  const { locale, t } = useLocale();

  if (!process || process.length === 0) return null;

  return (
    <section id="process" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedReveal>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#5b13ec] mb-3 text-center">
            Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
            {t('process.title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-14 text-center max-w-lg mx-auto leading-relaxed">
            {t('process.desc')}
          </p>
        </AnimatedReveal>

        <div className="process-grid">
          {process.map((step, i) => {
            const title = locale === 'en' && step.titleEn ? step.titleEn : step.title;
            const desc = locale === 'en' && step.descEn ? step.descEn : step.desc;
            return (
              <AnimatedReveal key={i} delay={i * 100}>
                <div className="process-step">
                  <div className="process-num">{step.number}</div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[180px] mx-auto">
                    {desc}
                  </p>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/contact-section.tsx
// ──────────────────────────────────────────────
const contactSection = `'use client';

import type { ReactNode } from 'react';
import { Mail, Instagram, Linkedin, Twitter, Youtube, Github } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';
import { AnimatedReveal } from './animated-reveal';

interface Props {
  config: SiteConfig;
}

const PLATFORM_ICONS: Record<string, ReactNode> = {
  instagram: <Instagram className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4" />,
  github: <Github className="w-4 h-4" />,
  // behance, dribbble: lucide-react에 없으므로 아이콘 없이 텍스트만
};

export function ContactSection({ config }: Props) {
  const { t } = useLocale();

  return (
    <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <AnimatedReveal>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#5b13ec] mb-3">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {t('contact.title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
            {t('contact.desc')}
          </p>
        </AnimatedReveal>

        {config.email && (
          <AnimatedReveal delay={150}>
            <a
              href={\`mailto:\${config.email}\`}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#5b13ec] to-[#06b6d4] text-white text-base font-semibold hover:opacity-90 transition-opacity btn-press mb-8"
            >
              <Mail className="w-5 h-5" />
              {config.email}
            </a>
          </AnimatedReveal>
        )}

        {config.socials && config.socials.length > 0 && (
          <AnimatedReveal delay={250}>
            <div className="flex items-center justify-center gap-3 flex-wrap mt-2">
              {config.socials.map((social, i) => {
                const icon = PLATFORM_ICONS[social.platform.toLowerCase()];
                const label = social.platform.charAt(0).toUpperCase() + social.platform.slice(1);
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={label}
                  >
                    {icon}
                    <span className="capitalize">{label}</span>
                  </a>
                );
              })}
            </div>
          </AnimatedReveal>
        )}
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/footer.tsx
// ──────────────────────────────────────────────
const footerComponent = `import { ThemeToggle } from './theme-toggle';

export function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/5 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-gray-500 text-xs">
        <a
          href="https://www.linkmap.biz/sites?utm_source=badge&utm_medium=referral&utm_campaign=freelancer-page"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-[11px] font-medium"
          aria-label="Made with Linkmap"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          Made with Linkmap
        </a>
        <ThemeToggle />
      </div>
    </footer>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/nav-header.tsx
// ──────────────────────────────────────────────
const navHeader = `'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { LanguageToggle } from './language-toggle';

const sectionIds = ['hero', 'services', 'portfolio', 'process', 'contact'];

const sectionKeys: Record<string, string> = {
  hero: 'nav.home',
  services: 'nav.services',
  portfolio: 'nav.portfolio',
  process: 'nav.process',
  contact: 'nav.contact',
};

export function NavHeader() {
  const [active, setActive] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { t } = useLocale();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0) setProgress((window.scrollY / h) * 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-[#0f0f0f]/80 border-b border-black/5 dark:border-white/5">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-1">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={\`#\${id}\`}
              className={\`px-3 py-1.5 rounded-full text-sm transition-colors \${
                active === id
                  ? 'text-white bg-gray-800'
                  : 'text-gray-400 hover:text-gray-200'
              }\`}
            >
              {t(sectionKeys[id])}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            className="sm:hidden p-2 text-gray-400"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="sm:hidden border-t border-black/5 dark:border-white/5 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-md">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={\`#\${id}\`}
              onClick={() => setMobileOpen(false)}
              className={\`block px-6 py-3 text-sm \${
                active === id ? 'text-white' : 'text-gray-400'
              }\`}
            >
              {t(sectionKeys[id])}
            </a>
          ))}
        </div>
      )}
    </header>
    <div className="scroll-progress" style={{ width: \`\${progress}%\` }} />
    </>
  );
}
`;

// ──────────────────────────────────────────────
// src/lib/config.ts
// ──────────────────────────────────────────────
const libConfig = `export interface ServiceItem {
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
  price: string;
  priceEn?: string;
  icon: string;
}

export interface PortfolioItem {
  title: string;
  titleEn?: string;
  category: string;
  categoryEn?: string;
  desc: string;
  descEn?: string;
  imageUrl: string;
  tags: string[];
}

export interface TestimonialItem {
  author: string;
  authorEn?: string;
  role: string;
  roleEn?: string;
  company: string;
  companyEn?: string;
  content: string;
  contentEn?: string;
  rating: number;
}

export interface ProcessStep {
  number: string;
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
}

export interface SocialItem {
  platform: string;
  url: string;
}

const DEMO_SERVICES: ServiceItem[] = [
  {
    title: '\\uBE0C\\uB79C\\uB4DC \\uC544\\uC774\\uB374\\uD2F0\\uD2F0',
    titleEn: 'Brand Identity',
    desc: '\\uB85C\\uACE0\\uBD80\\uD130 \\uCEEC\\uB7EC \\uD314\\uB808\\uD2B8, \\uD0C0\\uC774\\uD3EC\\uADF8\\uB798\\uD53C\\uAE4C\\uC9C0 \\u2014 \\uBE0C\\uB79C\\uB4DC\\uC758 \\uCCAB\\uC778\\uC0C1\\uC744 \\uC644\\uC131\\uD569\\uB2C8\\uB2E4.',
    descEn: "From logo to color palette and typography \\u2014 creating your brand's first impression.",
    price: '\\u20A9350\\uB9CC ~',
    priceEn: 'From $2,600',
    icon: 'palette',
  },
  {
    title: '\\uD328\\uD0A4\\uC9C0 \\uB514\\uC790\\uC778',
    titleEn: 'Packaging Design',
    desc: '\\uC18C\\uBE44\\uC790\\uC758 \\uC190\\uC5D0 \\uB2FF\\uB294 \\uC21C\\uAC04 \\uBE0C\\uB79C\\uB4DC\\uB97C \\uB290\\uAF3C\\uAC8C \\uB9CC\\uB4DC\\uB294 \\uD328\\uD0A4\\uC9C0 \\uB514\\uC790\\uC778.',
    descEn: 'Packaging that makes consumers feel the brand the moment they touch it.',
    price: '\\u20A9180\\uB9CC ~',
    priceEn: 'From $1,300',
    icon: 'package',
  },
  {
    title: '\\uC18C\\uC15C \\uBBF8\\uB514\\uC5B4 \\uD0A4\\uD2B8',
    titleEn: 'Social Media Kit',
    desc: '\\uC778\\uC2A4\\uD0C0, \\uC720\\uD29C\\uBE0C, \\uB9C1\\uD06C\\uB4DC\\uC778\\uC5D0 \\uBC14\\uB85C \\uC4F8 \\uC218 \\uC788\\uB294 \\uC77C\\uAD00\\uB41C \\uBE44\\uC8FC\\uC5BC \\uD0A4\\uD2B8.',
    descEn: 'Consistent visual kit ready to use on Instagram, YouTube, and LinkedIn.',
    price: '\\u20A980\\uB9CC ~',
    priceEn: 'From $600',
    icon: 'image',
  },
];

const DEMO_PORTFOLIO: PortfolioItem[] = [
  {
    title: '\\uD558\\uB8E8\\uB9C8 \\uCEE4\\uD53C \\uB9AC\\uBE0C\\uB79C\\uB529',
    titleEn: 'Haruma Coffee Rebranding',
    category: '\\uBE0C\\uB79C\\uB4DC \\uC544\\uC774\\uB374\\uD2F0\\uD2F0',
    categoryEn: 'Brand Identity',
    desc: '\\uC131\\uC218 \\uC2A4\\uD398\\uC15C\\uD2F0 \\uCE74\\uD398\\uC758 \\uBE0C\\uB79C\\uB4DC \\uC804\\uBA74 \\uAC1C\\uD3B8.',
    descEn: 'Complete brand overhaul for a Seongsu specialty cafe.',
    imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600',
    tags: ['\\uB85C\\uACE0', '\\uD328\\uD0A4\\uC9C0', '\\uBE0C\\uB79C\\uB529'],
  },
  {
    title: 'NILE \\uC2A4\\uD0A8\\uCF00\\uC5B4 \\uD328\\uD0A4\\uC9C0',
    titleEn: 'NILE Skincare Packaging',
    category: '\\uD328\\uD0A4\\uC9C0 \\uB514\\uC790\\uC778',
    categoryEn: 'Packaging Design',
    desc: '\\uBBF8\\uB2C8\\uBA40 \\uB7ED\\uC154\\uB9AC \\uCEE8\\uC149\\uC758 \\uC2A4\\uD0A8\\uCF00\\uC5B4 \\uB77C\\uC778 \\uD328\\uD0A4\\uC9C0 \\uB514\\uC790\\uC778.',
    descEn: 'Minimal-luxury skincare packaging that secured retail placement post-launch.',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600',
    tags: ['\\uD328\\uD0A4\\uC9C0', '\\uB7ED\\uC154\\uB9AC', '\\uBDF0\\uD2F0'],
  },
  {
    title: '\\uADF8\\uB9B0\\uC6E8\\uC774 \\uBE44\\uC601\\uB9AC \\uC18C\\uC15C \\uD0A4\\uD2B8',
    titleEn: 'Greenway NGO Social Kit',
    category: '\\uC18C\\uC15C \\uBBF8\\uB514\\uC5B4 \\uD0A4\\uD2B8',
    categoryEn: 'Social Media Kit',
    desc: '\\uD658\\uACBD \\uBE44\\uC601\\uB9AC \\uB2E8\\uCCB4\\uC758 \\uCEA0\\uD398\\uC778 \\uBE44\\uC8FC\\uC5BC \\uC81C\\uC791.',
    descEn: 'Campaign visuals for an environmental NGO.',
    imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600',
    tags: ['\\uC18C\\uC15C', 'NGO', '\\uD658\\uACBD'],
  },
];

const DEMO_TESTIMONIALS: TestimonialItem[] = [
  {
    author: '\\uAC15\\uBBFC\\uC900',
    authorEn: 'Minjun Kang',
    role: '\\uB300\\uD45C',
    roleEn: 'CEO',
    company: '\\uD558\\uB8E8\\uB9C8 \\uCEE4\\uD53C',
    companyEn: 'Haruma Coffee',
    content: '\\uBE0C\\uB79C\\uB4DC \\uBC29\\uD5A5\\uC744 \\uC81C\\uB300\\uB85C \\uC7A1\\uC544\\uC8FC\\uC168\\uC5B4\\uC694. \\uCC98\\uC74C \\uBBF8\\uD305\\uBD80\\uD130 \\uCD5C\\uC885 \\uC2DC\\uC548\\uAE4C\\uC9C0 \\uAD70\\uB354\\uB354\\uAE30 \\uC5C6\\uC774 \\uB531 \\uC6D0\\uD558\\uB294 \\uAC78 \\uBF51\\uC544\\uC8FC\\uC154\\uC11C \\uC815\\uB9D0 \\uB9CC\\uC871\\uD569\\uB2C8\\uB2E4.',
    contentEn: 'She nailed our brand direction exactly. From the first meeting to the final mockup, she delivered precisely what we wanted.',
    rating: 5,
  },
  {
    author: '\\uC774\\uC218\\uC9C4',
    authorEn: 'Sujin Lee',
    role: '\\uB9C8\\uCF00\\uD305 \\uB9E4\\uB2C8\\uC800',
    roleEn: 'Marketing Manager',
    company: 'NILE \\uC2A4\\uD0A8\\uCF00\\uC5B4',
    companyEn: 'NILE Skincare',
    content: '\\uD328\\uD0A4\\uC9C0 \\uD558\\uB098\\uB85C \\uBE0C\\uB79C\\uB4DC \\uAC00\\uCE58\\uAC00 \\uB2EC\\uB77C\\uC9C0\\uB294 \\uAC78 \\uC9C1\\uC811 \\uACBD\\uD5D8\\uD588\\uC5B4\\uC694.',
    contentEn: "We literally saw our brand perception change with one packaging redesign.",
    rating: 5,
  },
];

const DEMO_PROCESS: ProcessStep[] = [
  {
    number: '01',
    title: '\\uD0A5\\uC624\\uD504 \\uBBF8\\uD305',
    titleEn: 'Kickoff Meeting',
    desc: '\\uBE0C\\uB9AC\\uD504 \\uACF5\\uC720, \\uB808\\uD37C\\uB7F0\\uC2A4 \\uC218\\uC9D1, \\uBC29\\uD5A5\\uC131 \\uD569\\uC758.',
    descEn: 'Share brief, gather references, align on direction.',
  },
  {
    number: '02',
    title: '\\uCF58\\uC149\\uD2B8 \\uC81C\\uC548',
    titleEn: 'Concept Proposal',
    desc: '3\\uAC00\\uC9C0 \\uBC29\\uD5A5\\uC758 \\uBB34\\uB4DC\\uBCF4\\uB4DC\\uC640 \\uCD08\\uC548 \\uC81C\\uC2DC.',
    descEn: '3 moodboard directions + first draft.',
  },
  {
    number: '03',
    title: '\\uC2DC\\uC548 \\uD655\\uC815',
    titleEn: 'Design Finalization',
    desc: '\\uC120\\uD0DD\\uB41C \\uBC29\\uD5A5\\uC73C\\uB85C \\uC644\\uC131\\uB3C4\\uB97C \\uB192\\uC785\\uB2C8\\uB2E4.',
    descEn: 'Polish the chosen direction. Unlimited minor revisions.',
  },
  {
    number: '04',
    title: '\\uCD5C\\uC885 \\uB0A9\\uD488',
    titleEn: 'Final Delivery',
    desc: 'AI, PNG, PDF \\uB4F1 \\uD544\\uC694\\uD55C \\uBAA8\\uB4E0 \\uD3EC\\uB9F7\\uC73C\\uB85C \\uB0A9\\uD488.',
    descEn: 'Delivery in all needed formats + brand guideline document.',
  },
];

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || '\\uC815\\uD558\\uC740',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || 'Haeun Jung',
  title: process.env.NEXT_PUBLIC_TITLE || '\\uADF8\\uB798\\uD53D \\uB514\\uC790\\uC774\\uB108',
  titleEn: process.env.NEXT_PUBLIC_TITLE_EN || 'Graphic Designer',
  tagline: process.env.NEXT_PUBLIC_TAGLINE || '\\uBE0C\\uB79C\\uB4DC\\uC758 \\uC774\\uC57C\\uAE30\\uB97C \\uC2DC\\uAC01\\uC73C\\uB85C \\uD480\\uC5B4\\uB0B4\\uB294 \\uADF8\\uB798\\uD53D \\uB514\\uC790\\uC774\\uB108',
  taglineEn: process.env.NEXT_PUBLIC_TAGLINE_EN || 'Graphic designer who tells brand stories through visuals',
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || null,
  services: parseJSON<ServiceItem[]>(process.env.NEXT_PUBLIC_SERVICES, DEMO_SERVICES),
  portfolio: parseJSON<PortfolioItem[]>(process.env.NEXT_PUBLIC_PORTFOLIO, DEMO_PORTFOLIO),
  testimonials: parseJSON<TestimonialItem[]>(process.env.NEXT_PUBLIC_TESTIMONIALS, DEMO_TESTIMONIALS),
  process: parseJSON<ProcessStep[]>(process.env.NEXT_PUBLIC_PROCESS, DEMO_PROCESS),
  email: process.env.NEXT_PUBLIC_EMAIL || 'haeun@jung-design.kr',
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, [
    { platform: 'instagram', url: 'https://instagram.com' },
    { platform: 'linkedin', url: 'https://linkedin.com' },
  ]),
  gradientFrom: '#5b13ec',
  gradientTo: '#06b6d4',
  fontFamily: 'Pretendard',
  portfolioColumns: '3',
  designPreset: 'default',
  rotatingWords: parseJSON<string[]>(process.env.NEXT_PUBLIC_ROTATING_WORDS, ['Brand Identity', 'Packaging', 'Social Media', 'Web Design']),
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;

// ──────────────────────────────────────────────
// src/lib/i18n.tsx
// ──────────────────────────────────────────────
const libI18n = `'use client';

import { useSyncExternalStore } from 'react';

export type Locale = 'ko' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  ko: {
    'nav.home': '홈',
    'nav.services': '서비스',
    'nav.portfolio': '포트폴리오',
    'nav.process': '진행 방식',
    'nav.contact': '연락하기',
    'hero.cta': '프로젝트 의뢰하기',
    'services.title': '제공 서비스',
    'services.desc': '각 프로젝트의 맥락과 목표에 맞춰 최적의 솔루션을 설계합니다.',
    'portfolio.title': '선택된 작업들',
    'portfolio.desc': '브랜드의 본질을 시각 언어로 번역한 프로젝트 모음입니다.',
    'portfolio.all': '전체',
    'testimonials.title': '클라이언트 후기',
    'testimonials.desc': '함께 일한 분들이 남긴 이야기입니다.',
    'process.title': '작업 프로세스',
    'process.desc': '체계적인 프로세스로 최상의 결과물을 만들어냅니다.',
    'contact.title': '함께 만들어요',
    'contact.desc': '새로운 프로젝트나 협업 제안은 언제든 환영합니다.',
    'contact.email': '이메일 보내기',
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
    'lang.switchLabel': 'Switch to English',
    'lang.toggle': 'EN',
  },
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.process': 'Process',
    'nav.contact': 'Contact',
    'hero.cta': 'Start a Project',
    'services.title': 'Services',
    'services.desc': 'Tailored visual solutions designed to match your project context and goals.',
    'portfolio.title': 'Selected Works',
    'portfolio.desc': 'A collection of projects that translate brand essence into visual language.',
    'portfolio.all': 'All',
    'testimonials.title': 'Client Testimonials',
    'testimonials.desc': 'Stories from those I have had the pleasure of working with.',
    'process.title': 'How I Work',
    'process.desc': 'A systematic process to deliver the best results for every project.',
    'contact.title': "Let's Work Together",
    'contact.desc': 'Open to new projects and collaboration opportunities.',
    'contact.email': 'Send Email',
    'theme.light': 'Switch to light mode',
    'theme.dark': 'Switch to dark mode',
    'lang.switchLabel': '한국어로 전환',
    'lang.toggle': '한국어',
  },
};

let _locale: Locale = 'ko';
const _listeners = new Set<() => void>();
function subscribe(cb: () => void) { _listeners.add(cb); return () => { _listeners.delete(cb); }; }
function getSnapshot() { return _locale; }
function getServerSnapshot() { return 'ko' as Locale; }

if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('locale');
  if (saved === 'ko' || saved === 'en') { _locale = saved; document.documentElement.lang = saved; }
}

export function useLocale() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setLocale = (l: Locale) => {
    _locale = l;
    localStorage.setItem('locale', l);
    document.documentElement.lang = l;
    _listeners.forEach((cb) => cb());
  };
  const t = (key: string) => translations[locale]?.[key] ?? key;
  return { locale, setLocale, t };
}
`;

// ──────────────────────────────────────────────
// Assemble template
// ──────────────────────────────────────────────
export const freelancerPageTemplate: HomepageTemplateContent = {
  slug: 'freelancer-page',
  repoName: 'freelancer-page',
  description: '프리랜서 포트폴리오 - Linkmap으로 생성',
  files: [
    { path: '.gitignore', content: gitignore },
    { path: '.github/workflows/deploy.yml', content: deployYml },
    { path: 'package.json', content: packageJson },
    { path: 'package-lock.json', content: packageLock },
    { path: 'tsconfig.json', content: tsconfigJson },
    { path: 'postcss.config.mjs', content: postcssConfig },
    { path: 'next.config.ts', content: nextConfig },
    { path: 'src/app/api/og/route.tsx', content: ogRoute },
    { path: 'src/app/globals.css', content: globalsCss },
    { path: 'src/app/layout.tsx', content: layoutTsx },
    { path: 'src/app/page.tsx', content: pageTsx },
    { path: 'src/components/animated-reveal.tsx', content: animatedReveal },
    { path: 'src/components/section-wrapper.tsx', content: sectionWrapper },
    { path: 'src/components/rotating-text.tsx', content: rotatingText },
    { path: 'src/components/hero-section.tsx', content: heroSection },
    { path: 'src/components/services-section.tsx', content: servicesSection },
    { path: 'src/components/portfolio-section.tsx', content: portfolioSection },
    { path: 'src/components/testimonials-section.tsx', content: testimonialsSection },
    { path: 'src/components/process-section.tsx', content: processSection },
    { path: 'src/components/contact-section.tsx', content: contactSection },
    { path: 'src/components/footer.tsx', content: footerComponent },
    { path: 'src/components/nav-header.tsx', content: navHeader },
    { path: 'src/components/theme-toggle.tsx', content: themeToggle },
    { path: 'src/components/language-toggle.tsx', content: languageToggle },
    { path: 'src/lib/config.ts', content: libConfig },
    { path: 'src/lib/i18n.tsx', content: libI18n },
  ],
};
