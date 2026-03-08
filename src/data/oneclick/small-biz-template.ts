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
  makePackageJson,
} from './shared-template-files';

const packageJson = makePackageJson('small-biz');

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
          background: 'linear-gradient(135deg, #fdf4e7, #fff7ed)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#d47311',
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#78716c',
            marginTop: 12,
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          {siteConfig.description}
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
  --color-primary: #d47311;
  --color-secondary: #e8934a;
  --color-warm: #fdf4e7;
}

:root {
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

/* ── Serif Typography Option ── */
.font-serif h1, .font-serif h2, .font-serif h3 {
  font-family: 'Nanum Myeongjo', 'Georgia', serif;
  letter-spacing: -0.02em;
}

/* ── Table Menu Style ── */
.menu-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.menu-table tr {
  border-bottom: 1px solid var(--surface-border);
}
.menu-table tr:last-child {
  border-bottom: none;
}
.menu-table td {
  padding: 1rem 0;
  vertical-align: top;
}
.menu-table .menu-name {
  font-weight: 600;
  font-size: 1rem;
}
.menu-table .menu-desc {
  font-size: 0.85rem;
  color: var(--text-muted, #a1a1aa);
  margin-top: 0.25rem;
}
.menu-table .menu-price {
  text-align: right;
  white-space: nowrap;
  font-weight: 600;
  color: var(--color-primary);
}

/* ── Business Status Indicator ── */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.status-open {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
  animation: pulse-dot 2s ease-in-out infinite;
}
.status-closed {
  background: #ef4444;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@media (prefers-reduced-motion: reduce) {
  .status-open { animation: none; }
}

/* ── Category Divider ── */
.category-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0 1rem;
}
.category-divider::before,
.category-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--surface-border);
}
.category-divider span {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary);
}

/* Premium hover glow */
.hover-glow {
  transition: box-shadow 0.3s ease;
}
.hover-glow:hover {
  box-shadow: 0 0 20px color-mix(in oklch, var(--color-primary, #d47311) 30%, transparent),
              0 0 40px color-mix(in oklch, var(--color-primary, #d47311) 10%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .hover-glow:hover { box-shadow: none; }
}

/* Card hover (legacy) */
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

/* Card lift */
.card-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; box-shadow: var(--shadow-card); }
.card-lift:hover { transform: translateY(-4px); box-shadow: var(--shadow-card-hover); }

/* Button press */
.btn-press { transition: transform 0.15s ease; }
.btn-press:active { transform: scale(0.97); }

/* Section gap */
.section-gap { padding-top: var(--section-gap, 4rem); padding-bottom: var(--section-gap, 4rem); }

/* Mobile sticky CTA */
.mobile-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: var(--surface-elevated, #ffffff);
  border-top: 1px solid var(--surface-border, rgba(0,0,0,0.06));
  z-index: 40;
  display: flex;
  gap: 8px;
}
@media (min-width: 640px) {
  .mobile-cta { display: none; }
}
.dark .mobile-cta {
  background: var(--surface-elevated, #1a1a1a);
  border-top-color: var(--surface-border, rgba(255,255,255,0.06));
}

/* Scroll progress */
.scroll-progress {
  position: fixed;
  top: 56px;
  left: 0;
  height: 2px;
  background: var(--color-primary, #f97316);
  z-index: 100;
  transition: width 0.1s linear;
  pointer-events: none;
}

/* Hero load animation */
@keyframes fade-up { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
.animate-fade-up { animation: fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
.animate-fade-up-d1 { animation-delay:150ms; opacity:0; }
.animate-fade-up-d2 { animation-delay:300ms; opacity:0; }
@media (prefers-reduced-motion:reduce) {
  .animate-fade-up { animation:none; opacity:1; transform:none; }
}

@media (prefers-reduced-motion: reduce) {
  .card-lift:hover { transform: none; }
  .btn-press:active { transform: none; }
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
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: 'website',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
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
        {siteConfig.fontFamily === 'Nanum Myeongjo' && (
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap"
          />
        )}
        <script dangerouslySetInnerHTML={{ __html: "(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}})()" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: siteConfig.name,
              description: siteConfig.description,
              ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
              ...(siteConfig.address ? { address: { '@type': 'PostalAddress', streetAddress: siteConfig.address } } : {}),
              ...(siteConfig.businessHours?.length ? {
                openingHoursSpecification: siteConfig.businessHours.map((h: { day: string; hours: string }) => ({
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: h.day,
                  description: h.hours,
                })),
              } : {}),
            }),
          }}
        />
      </head>
      <body className="antialiased bg-[#fdf4e7] text-gray-900 dark:bg-gray-950 dark:text-gray-50">
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
import { QuickActions } from '@/components/quick-actions';
import { MenuSection } from '@/components/menu-section';
import { HoursSection } from '@/components/hours-section';
import { LocationSection } from '@/components/location-section';
import { GallerySection } from '@/components/gallery-section';
import { SnsSection } from '@/components/sns-section';
import { Footer } from '@/components/footer';
import { MobileBottomBar } from '@/components/mobile-bottom-bar';

export default function Home() {
  return (
    <>
      <NavHeader />
      <main>
        <HeroSection config={siteConfig} />
        <QuickActions config={siteConfig} />
        <MenuSection items={siteConfig.menuItems} />
        <HoursSection hours={siteConfig.businessHours} />
        <LocationSection config={siteConfig} />
        {siteConfig.galleryImages.length > 0 && (
          <GallerySection images={siteConfig.galleryImages} />
        )}
        <SnsSection config={siteConfig} />
      </main>
      <Footer />
      <MobileBottomBar config={siteConfig} />
    </>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/hero-section.tsx
// ──────────────────────────────────────────────
const heroSection = `'use client';

import { Phone, MapPin } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

const DAY_EN_ORDER = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_MAP: Record<string, number> = Object.fromEntries(DAY_EN_ORDER.map((d, i) => [d, i]));

function getBusinessStatus(hours: SiteConfig['businessHours']): { isOpen: boolean; closeTime: string } {
  const now = new Date();
  const todayIndex = now.getDay();
  const todayHour = hours.find((h) => DAY_MAP[h.dayEn ?? ''] === todayIndex);
  if (!todayHour || todayHour.isHoliday) return { isOpen: false, closeTime: '' };

  const timeStr = todayHour.hoursEn || todayHour.hours;
  const match = timeStr.match(/(\\d{1,2}):(\\d{2})\\s*-\\s*(\\d{1,2}):(\\d{2})/);
  if (!match) return { isOpen: false, closeTime: '' };

  const [, sh, sm, eh, em] = match;
  const start = parseInt(sh) * 60 + parseInt(sm);
  const end = parseInt(eh) * 60 + parseInt(em);
  const current = now.getHours() * 60 + now.getMinutes();
  return { isOpen: current >= start && current < end, closeTime: \`\${eh}:\${em}\` };
}

export function HeroSection({ config }: Props) {
  const { locale, t } = useLocale();
  const name = locale === 'en' && config.nameEn ? config.nameEn : config.name;
  const desc = locale === 'en' && config.descriptionEn ? config.descriptionEn : config.description;
  const address = locale === 'en' && config.addressEn ? config.addressEn : config.address;
  const isSerif = config.fontFamily === 'Nanum Myeongjo';

  const { isOpen, closeTime } = config.businessHours?.length
    ? getBusinessStatus(config.businessHours)
    : { isOpen: false, closeTime: '' };

  return (
    <section
      id="hero"
      className={\`pt-20 pb-12 px-4 sm:px-6\${isSerif ? ' font-serif' : ''}\`}
    >
      <div className="max-w-lg mx-auto text-center animate-fade-up">
        {/* Business status badge */}
        {config.businessHours?.length > 0 && (
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border text-xs font-medium"
            style={{
              borderColor: isOpen ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
              background: isOpen ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
              color: isOpen ? '#16a34a' : '#dc2626',
            }}
          >
            <span className={\`status-dot \${isOpen ? 'status-open' : 'status-closed'}\`} />
            {isOpen
              ? (locale === 'en' ? \`Open · Closes \${closeTime}\` : \`영업 중 · \${closeTime} 마감\`)
              : (locale === 'en' ? 'Closed now' : '영업 종료')
            }
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary,#d47311)] mb-3">
          {name}
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
          {desc}
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {config.phone && (
            <a
              href={\`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`}
              className="btn-press inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-sm min-h-[48px] shadow-md hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, var(--color-primary,#d47311), var(--color-secondary,#e8934a))' }}
            >
              <Phone className="w-4 h-4" />
              {t('hero.call')}
            </a>
          )}
          {address && (
            <a
              href={config.kakaoMapId ? \`https://place.map.kakao.com/\${config.kakaoMapId}\` : \`https://maps.google.com/?q=\${encodeURIComponent(address)}\`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press inline-flex items-center gap-2 px-7 py-3.5 rounded-full border font-semibold text-sm min-h-[48px] text-gray-700 dark:text-gray-200 hover:border-[var(--color-primary,#d47311)] transition-colors"
              style={{ borderColor: 'var(--surface-border, rgba(0,0,0,0.12))', background: 'var(--surface-elevated, #ffffff)' }}
            >
              <MapPin className="w-4 h-4 text-[var(--color-primary,#d47311)]" />
              {t('quick.directions')}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/quick-actions.tsx
// ──────────────────────────────────────────────
const quickActions = `'use client';

import { Phone, MapPin, Calendar } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

export function QuickActions({ config }: Props) {
  const { locale, t } = useLocale();
  const address = locale === 'en' && config.addressEn ? config.addressEn : config.address;

  const actions = [
    config.phone ? {
      icon: Phone,
      label: t('quick.call'),
      href: \`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`,
    } : null,
    address ? {
      icon: MapPin,
      label: t('quick.directions'),
      href: \`https://maps.google.com/?q=\${encodeURIComponent(address)}\`,
    } : null,
    {
      icon: Calendar,
      label: t('quick.hours'),
      href: '#hours',
    },
  ].filter(Boolean) as Array<{ icon: typeof Phone; label: string; href: string }>;

  return (
    <div className="px-4 sm:px-6 pb-8">
      <div className="max-w-lg mx-auto flex gap-3 justify-center">
        {actions.map((action, i) => (
          <a
            key={i}
            href={action.href}
            target={action.href.startsWith('http') ? '_blank' : undefined}
            rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="card-lift btn-press flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[var(--radius-md,12px)] border min-h-[44px] transition-colors hover:opacity-80"
            style={{ borderColor: 'color-mix(in srgb, var(--color-primary,#d47311) 20%, transparent)', background: 'var(--surface-elevated,#ffffff)', color: 'var(--color-primary,#d47311)' }}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/menu-section.tsx
// ──────────────────────────────────────────────
const menuSection = `'use client';

import { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import type { MenuItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  items: MenuItem[];
}

export function MenuSection({ items }: Props) {
  const { locale, t } = useLocale();
  const categories = [...new Set(items.map((item) => item.category))];
  const grouped = categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat] = items.filter((item) => item.category === cat);
    return acc;
  }, {});

  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(categories));

  const toggleAccordion = useCallback((cat: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const renderTableRows = (catItems: MenuItem[]) =>
    catItems.map((item, i) => {
      const name = locale === 'en' && item.nameEn ? item.nameEn : item.name;
      const desc = locale === 'en' && item.descEn ? item.descEn : item.desc;
      return (
        <tr key={i}>
          <td style={{ width: '100%' }}>
            <div className="flex items-start gap-2">
              <span className="text-xl shrink-0 leading-none mt-0.5">{item.emoji || '\\uD83C\\uDF7D\\uFE0F'}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="menu-name text-gray-900 dark:text-gray-100">{name}</span>
                  {item.isNew && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-500 text-white leading-none">NEW</span>
                  )}
                  {item.isPopular && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded text-white leading-none" style={{ background: 'var(--color-primary,#d47311)' }}>
                      {t('menu.popular')}
                    </span>
                  )}
                </div>
                {desc && <p className="menu-desc dark:text-gray-400">{desc}</p>}
              </div>
            </div>
          </td>
          <td style={{ paddingLeft: '1rem', verticalAlign: 'middle' }}>
            <span className="menu-price" style={{ color: 'var(--color-primary,#d47311)' }}>{item.price}</span>
          </td>
        </tr>
      );
    });

  return (
    <section id="menu" className="py-12 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-50 mb-6">
          {t('menu.title')}
        </h2>

        <div className="rounded-[var(--radius-lg,16px)] border overflow-hidden"
          style={{ borderColor: 'var(--surface-border,rgba(0,0,0,0.06))', background: 'var(--surface-elevated,#ffffff)' }}
        >
          {categories.map((cat, catIdx) => {
            const isOpen = openCategories.has(cat);
            const catItems = grouped[cat] || [];
            return (
              <div key={cat}>
                {/* Category header — acts as accordion toggle on mobile */}
                <button
                  onClick={() => toggleAccordion(cat)}
                  className="w-full flex items-center justify-between px-5 py-3 text-left hover:opacity-80 transition-opacity min-h-[44px]"
                  style={{
                    borderTop: catIdx > 0 ? '1px solid var(--surface-border,rgba(0,0,0,0.06))' : undefined,
                    background: 'color-mix(in srgb, var(--color-primary,#d47311) 5%, transparent)',
                  }}
                >
                  <span className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--color-primary,#d47311)' }}>
                    {cat}
                    <span className="ml-2 text-xs font-normal text-gray-500 normal-case tracking-normal">({catItems.length})</span>
                  </span>
                  <ChevronDown className={\`w-4 h-4 text-gray-400 transition-transform duration-200 \${isOpen ? 'rotate-180' : ''}\`} />
                </button>

                {/* Table rows */}
                <div className={\`grid transition-[grid-template-rows] duration-250 ease-in-out overflow-hidden \${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}\`}>
                  <div className="min-h-0">
                    <div className="px-5">
                      <table className="menu-table">
                        <tbody>{renderTableRows(catItems)}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/hours-section.tsx
// ──────────────────────────────────────────────
const hoursSection = `'use client';

import type { BusinessHour } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  hours: BusinessHour[];
}

const DAY_MAP: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
};

function getTodayIndex(): number {
  return new Date().getDay();
}

function getIsOpenNow(hour: BusinessHour): boolean {
  if (hour.isHoliday) return false;
  const timeStr = hour.hoursEn || hour.hours;
  const match = timeStr.match(/(\\d{1,2}):(\\d{2})\\s*-\\s*(\\d{1,2}):(\\d{2})/);
  if (!match) return false;
  const [, sh, sm, eh, em] = match;
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const start = parseInt(sh) * 60 + parseInt(sm);
  const end = parseInt(eh) * 60 + parseInt(em);
  return current >= start && current < end;
}

export function HoursSection({ hours }: Props) {
  const { locale, t } = useLocale();
  const todayIndex = getTodayIndex();
  const todayHour = hours.find((h) => (DAY_MAP[h.dayEn ?? ''] ?? -1) === todayIndex);
  const isOpenNow = todayHour ? getIsOpenNow(todayHour) : false;

  return (
    <section id="hours" className="py-12 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {t('hours.title')}
          </h2>
          {todayHour && (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                background: isOpenNow ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                color: isOpenNow ? '#16a34a' : '#dc2626',
              }}
            >
              <span className={\`status-dot \${isOpenNow ? 'status-open' : 'status-closed'}\`} />
              {isOpenNow
                ? (locale === 'en' ? 'Open Now' : '영업 중')
                : (locale === 'en' ? 'Closed' : '영업 종료')
              }
            </span>
          )}
        </div>

        <div className="card-lift rounded-[var(--radius-lg,16px)] border overflow-hidden" style={{ borderColor: 'var(--surface-border,rgba(0,0,0,0.06))', background: 'var(--surface-elevated,#ffffff)' }}>
          {hours.map((hour, i) => {
            const day = locale === 'en' && hour.dayEn ? hour.dayEn : hour.day;
            const time = locale === 'en' && hour.hoursEn ? hour.hoursEn : hour.hours;
            const dayNumber = DAY_MAP[hour.dayEn || ''] ?? -1;
            const isToday = dayNumber === todayIndex;

            return (
              <div
                key={i}
                className={\`flex items-center justify-between px-5 py-3.5 \${
                  i < hours.length - 1 ? 'border-b' : ''
                }\`}
                style={{
                  borderBottomColor: 'var(--surface-border,rgba(0,0,0,0.06))',
                  background: isToday ? 'color-mix(in srgb, var(--color-primary,#d47311) 6%, transparent)' : undefined,
                }}
              >
                <span className={\`text-sm \${isToday ? 'font-bold' : 'text-gray-700 dark:text-gray-300'}\`} style={isToday ? { color: 'var(--color-primary,#d47311)' } : undefined}>
                  {day}
                  {isToday && <span className="ml-1.5 text-xs font-normal opacity-70">({t('hours.today')})</span>}
                </span>
                <span className={\`text-sm \${
                  hour.isHoliday
                    ? 'text-red-500 font-medium'
                    : isToday
                      ? 'font-bold'
                      : 'text-gray-600 dark:text-gray-400'
                }\`} style={isToday && !hour.isHoliday ? { color: 'var(--color-primary,#d47311)' } : undefined}>
                  {time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/location-section.tsx
// ──────────────────────────────────────────────
const locationSection = `'use client';

import { MapPin } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

export function LocationSection({ config }: Props) {
  const { locale, t } = useLocale();
  const address = locale === 'en' && config.addressEn ? config.addressEn : config.address;
  if (!address) return null;

  return (
    <section id="location" className="py-12 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-50 mb-6">
          {t('location.title')}
        </h2>

        {config.kakaoMapId && (
          <div className="card-lift rounded-[var(--radius-lg,16px)] overflow-hidden mb-4 aspect-[4/3]">
            <iframe
              src={\`https://map.kakao.com/?map_type=TYPE_MAP&itemId=\${config.kakaoMapId}\`}
              title="Map"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        )}

        <a
          href={config.kakaoMapId ? \`https://place.map.kakao.com/\${config.kakaoMapId}\` : \`https://maps.google.com/?q=\${encodeURIComponent(address)}\`}
          target="_blank"
          rel="noopener noreferrer"
          className="card-lift btn-press flex items-center gap-3 p-4 rounded-[var(--radius-md,12px)] border transition-colors"
          style={{ background: 'var(--surface-elevated,#ffffff)', borderColor: 'var(--surface-border,rgba(0,0,0,0.06))' }}
        >
          <MapPin className="w-5 h-5 shrink-0" style={{ color: 'var(--color-primary,#d47311)' }} />
          <span className="text-sm text-gray-700 dark:text-gray-300">{address}</span>
        </a>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/gallery-section.tsx
// ──────────────────────────────────────────────
const gallerySection = `'use client';

import { AnimatedReveal } from './animated-reveal';
import { useLocale } from '@/lib/i18n';

interface Props {
  images: string[];
}

export function GallerySection({ images }: Props) {
  const { t } = useLocale();

  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-50 mb-6">
          {t('gallery.title')}
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-1 px-1">
          {images.map((src, i) => (
            <AnimatedReveal key={i} delay={i * 60} variant="scale">
              <div className="card-lift shrink-0 w-64 h-64 rounded-[var(--radius-lg,16px)] overflow-hidden snap-center">
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/sns-section.tsx
// ──────────────────────────────────────────────
const snsSection = `'use client';

import { Instagram, Globe } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

export function SnsSection({ config }: Props) {
  const { t } = useLocale();

  const links = [
    config.instagramUrl ? { icon: Instagram, label: 'Instagram', url: config.instagramUrl } : null,
    config.naverBlogUrl ? { icon: Globe, label: t('sns.naver'), url: config.naverBlogUrl } : null,
    config.kakaoChannelUrl ? { icon: Globe, label: t('sns.kakao'), url: config.kakaoChannelUrl } : null,
  ].filter(Boolean) as Array<{ icon: typeof Instagram; label: string; url: string }>;

  if (links.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-50 mb-6">
          {t('sns.title')}
        </h2>

        <div className="flex flex-col gap-3">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-lift btn-press flex items-center gap-3 p-4 rounded-[var(--radius-md,12px)] border min-h-[44px] transition-colors"
              style={{ background: 'var(--surface-elevated,#ffffff)', borderColor: 'var(--surface-border,rgba(0,0,0,0.06))' }}
            >
              <link.icon className="w-5 h-5 shrink-0" style={{ color: 'var(--color-primary,#d47311)' }} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/footer.tsx
// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
// src/components/mobile-bottom-bar.tsx
// ──────────────────────────────────────────────
const mobileBottomBar = `'use client';

import { Phone, MapPin, MessageCircle } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

export function MobileBottomBar({ config }: Props) {
  const { locale, t } = useLocale();
  if (!config.phone && !config.kakaoChannelUrl) return null;

  const address = locale === 'en' && config.addressEn ? config.addressEn : config.address;

  return (
    <div className="mobile-cta">
      {config.phone && (
        <a
          href={\`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`}
          className="btn-press flex-1 flex items-center justify-center gap-2 py-3 rounded-[var(--radius-md,12px)] text-white font-semibold text-sm"
          style={{ background: 'linear-gradient(135deg, var(--color-primary,#d47311), var(--color-secondary,#e8934a))' }}
        >
          <Phone className="w-4 h-4" />
          {t('bottom.call')}
        </a>
      )}
      {config.kakaoChannelUrl ? (
        <a
          href={config.kakaoChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-press flex-1 flex items-center justify-center gap-2 py-3 rounded-[var(--radius-md,12px)] text-[#391b1b] font-semibold text-sm bg-[#fee500] active:bg-[#e6cf00]"
        >
          <MessageCircle className="w-4 h-4" />
          {t('bottom.kakao')}
        </a>
      ) : address ? (
        <a
          href={config.kakaoMapId ? \`https://place.map.kakao.com/\${config.kakaoMapId}\` : \`https://maps.google.com/?q=\${encodeURIComponent(address)}\`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-press flex-1 flex items-center justify-center gap-2 py-3 rounded-[var(--radius-md,12px)] border font-semibold text-sm text-gray-700 dark:text-gray-200"
          style={{ borderColor: 'var(--surface-border,rgba(0,0,0,0.12))', background: 'var(--surface-sunken,#f8f9fa)' }}
        >
          <MapPin className="w-4 h-4" style={{ color: 'var(--color-primary,#d47311)' }} />
          {t('quick.directions')}
        </a>
      ) : null}
    </div>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/footer.tsx
// ──────────────────────────────────────────────
const footerComponent = `import { ThemeToggle } from './theme-toggle';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-4 sm:px-6">
      <div className="max-w-lg mx-auto flex items-center justify-center gap-2 text-gray-400 text-xs">
        <a
          href="https://www.linkmap.biz/sites?utm_source=badge&utm_medium=referral&utm_campaign=small-biz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-[11px] font-medium"
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

const sectionIds = ['hero', 'menu', 'hours', 'location'];

const sectionKeys: Record<string, string> = {
  hero: 'nav.home',
  menu: 'nav.menu',
  hours: 'nav.hours',
  location: 'nav.location',
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
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#fdf4e7]/80 dark:bg-gray-950/80 border-b border-gray-200/50 dark:border-gray-800/50">
      <nav className="max-w-lg mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-1">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={\`#\${id}\`}
              className={\`px-3 py-1.5 rounded-full text-sm transition-colors \${
                active === id
                  ? 'text-[#d47311] bg-[#d47311]/10 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }\`}
            >
              {t(sectionKeys[id])}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            className="sm:hidden p-2 text-gray-600 dark:text-gray-400"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-[#fdf4e7]/95 dark:bg-gray-950/95 backdrop-blur-md">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={\`#\${id}\`}
              onClick={() => setMobileOpen(false)}
              className={\`block px-6 py-3 text-sm \${
                active === id ? 'text-[#d47311] font-medium' : 'text-gray-600 dark:text-gray-400'
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
const libConfig = `export interface MenuItem {
  name: string;
  nameEn?: string;
  desc: string;
  descEn?: string;
  price: string;
  category: string;
  emoji: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface BusinessHour {
  day: string;
  dayEn?: string;
  hours: string;
  hoursEn?: string;
  isHoliday?: boolean;
}

const DEMO_MENU: MenuItem[] = [
  {
    name: '\\uB974\\uBC29 \\uAE50\\uBE60\\uB274',
    nameEn: 'Levain Campagne',
    desc: '72\\uC2DC\\uAC04 \\uBC1C\\uD6A8 \\uCC9C\\uC5F0 \\uB974\\uBC29 \\uC2DD\\uBE75. \\uCD09\\uCD09\\uD558\\uACE0 \\uC945\\uC945\\uD55C \\uC2DD\\uAC10.',
    descEn: '72-hour fermented sourdough. Moist, chewy texture.',
    price: '\\u20A97,500',
    category: '\\uBE75',
    emoji: '\\uD83C\\uDF5E',
  },
  {
    name: '\\uD06C\\uB8E8\\uC544\\uC0C1',
    nameEn: 'Croissant',
    desc: '\\uBC84\\uD130 48\\uACA9 \\uC218\\uC81C \\uD06C\\uB8E8\\uC544\\uC0C1. \\uBC14\\uC0AD\\uD558\\uACE0 \\uD48D\\uBD80\\uD55C \\uBC84\\uD130\\uD5A5.',
    descEn: '48-layer handmade croissant. Crispy with rich butter aroma.',
    price: '\\u20A94,800',
    category: '\\uBE75',
    emoji: '\\uD83E\\uDD50',
  },
  {
    name: '\\uBD09\\uBD09 \\uC1FC\\uCF5C\\uB77C',
    nameEn: 'Bonbon Chocolat',
    desc: '\\uBC1C\\uB85C\\uB098 \\uCD08\\uCF5C\\uB9BF\\uC744 \\uB123\\uC740 \\uBC18\\uC219 \\uB9C8\\uB4E4\\uB80C. 1\\uC778 2\\uAC1C \\uD55C\\uC815.',
    descEn: 'Molten madeleine with Valrhona chocolate. Limited to 2 per person.',
    price: '\\u20A93,500',
    category: '\\uACFC\\uC790',
    emoji: '\\uD83C\\uDF6B',
  },
  {
    name: '\\uD50C\\uB7AB \\uD654\\uC774\\uD2B8',
    nameEn: 'Flat White',
    desc: '\\uC2F1\\uAE00 \\uC624\\uB9AC\\uC9C4 \\uC6D0\\uB450, \\uB9C8\\uC774\\uD06C\\uB85C\\uD3FC \\uBC00\\uD06C\\uB85C \\uB9CC\\uB4E0 \\uC9C4\\uD55C \\uCEE4\\uD53C.',
    descEn: 'Single-origin espresso with microfoam milk.',
    price: '\\u20A96,000',
    category: '\\uC74C\\uB8CC',
    emoji: '\\u2615',
  },
  {
    name: '\\uC5BC \\uADF8\\uB808\\uC774 \\uB77C\\uB760',
    nameEn: 'Earl Grey Latte',
    desc: '\\uBCA0\\uB974\\uAC00\\uBABB \\uD5A5\\uC774 \\uC0B4\\uC544\\uC788\\uB294 \\uB530\\uB73B\\uD55C \\uC5BC \\uADF8\\uB808\\uC774 \\uBC00\\uD06C\\uD2F0.',
    descEn: 'Warm Earl Grey milk tea with vibrant bergamot aroma.',
    price: '\\u20A95,500',
    category: '\\uC74C\\uB8CC',
    emoji: '\\uD83E\\uDED6',
  },
  {
    name: '\\uACC4\\uC808 \\uACFC\\uC77C \\uD0C0\\uB974\\uD2B8',
    nameEn: 'Seasonal Fruit Tart',
    desc: '\\uB9E4\\uC8FC \\uBC14\\uB00C\\uB294 \\uC81C\\uCCA0 \\uACFC\\uC77C \\uD0C0\\uB974\\uD2B8.',
    descEn: 'Weekly seasonal fruit tart.',
    price: '\\u20A99,000',
    category: '\\uCF00\\uC774\\uD06C',
    emoji: '\\uD83C\\uDF53',
  },
];

const DEMO_HOURS: BusinessHour[] = [
  { day: '\\uC6D4\\uC694\\uC77C', dayEn: 'Monday', hours: '08:00 - 19:00', hoursEn: '08:00 - 19:00' },
  { day: '\\uD654\\uC694\\uC77C', dayEn: 'Tuesday', hours: '08:00 - 19:00', hoursEn: '08:00 - 19:00' },
  { day: '\\uC218\\uC694\\uC77C', dayEn: 'Wednesday', hours: '08:00 - 19:00', hoursEn: '08:00 - 19:00' },
  { day: '\\uBAA9\\uC694\\uC77C', dayEn: 'Thursday', hours: '08:00 - 19:00', hoursEn: '08:00 - 19:00' },
  { day: '\\uAE08\\uC694\\uC77C', dayEn: 'Friday', hours: '08:00 - 20:00', hoursEn: '08:00 - 20:00' },
  { day: '\\uD1A0\\uC694\\uC77C', dayEn: 'Saturday', hours: '09:00 - 20:00', hoursEn: '09:00 - 20:00' },
  { day: '\\uC77C\\uC694\\uC77C', dayEn: 'Sunday', hours: '09:00 - 17:00', hoursEn: '09:00 - 17:00' },
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
  name: process.env.NEXT_PUBLIC_SITE_NAME || '\\uC628\\uAE30 \\uBCA0\\uC774\\uCEE4\\uB9AC',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || 'Ongi Bakery',
  description:
    process.env.NEXT_PUBLIC_DESCRIPTION ||
    '\\uB9E4\\uC77C \\uC544\\uCE68 \\uC9C1\\uC811 \\uAD6C\\uC6B4 \\uBE75 \\uD55C \\uC870\\uAC01\\uC73C\\uB85C \\uD558\\uB8E8\\uB97C \\uC2DC\\uC791\\uD558\\uC138\\uC694.',
  descriptionEn:
    process.env.NEXT_PUBLIC_DESCRIPTION_EN ||
    'Start your day with a freshly baked loaf every morning.',
  phone: process.env.NEXT_PUBLIC_PHONE || '02-334-5870',
  address: process.env.NEXT_PUBLIC_ADDRESS || '\\uC11C\\uC6B8 \\uB9C8\\uD3EC\\uAD6C \\uC5F0\\uB0A8\\uB3D9 239-10',
  addressEn: process.env.NEXT_PUBLIC_ADDRESS_EN || '239-10, Yeonnam-dong, Mapo-gu, Seoul',
  kakaoMapId: process.env.NEXT_PUBLIC_KAKAO_MAP_ID || '',
  menuItems: parseJSON<MenuItem[]>(process.env.NEXT_PUBLIC_MENU_ITEMS, DEMO_MENU),
  businessHours: parseJSON<BusinessHour[]>(process.env.NEXT_PUBLIC_BUSINESS_HOURS, DEMO_HOURS),
  galleryImages: parseJSON<string[]>(process.env.NEXT_PUBLIC_GALLERY_IMAGES, []),
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/ongi_bakery',
  naverBlogUrl: process.env.NEXT_PUBLIC_NAVER_BLOG_URL || '',
  kakaoChannelUrl: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || '',
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#d47311',
  fontFamily: process.env.NEXT_PUBLIC_FONT_FAMILY || 'Pretendard',
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
    'nav.menu': '메뉴',
    'nav.hours': '영업시간',
    'nav.location': '오시는 길',
    'hero.call': '전화하기',
    'quick.call': '전화',
    'quick.directions': '길찾기',
    'quick.hours': '영업시간',
    'menu.title': '메뉴',
    'menu.popular': '인기',
    'bottom.call': '전화하기',
    'bottom.kakao': '카카오 상담',
    'hours.title': '영업시간',
    'hours.today': '오늘',
    'location.title': '오시는 길',
    'gallery.title': '갤러리',
    'sns.title': 'SNS',
    'sns.naver': '네이버 블로그',
    'sns.kakao': '카카오톡 채널',
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
    'lang.switchLabel': 'Switch to English',
    'lang.toggle': 'EN',
  },
  en: {
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.hours': 'Hours',
    'nav.location': 'Location',
    'hero.call': 'Call Now',
    'quick.call': 'Call',
    'quick.directions': 'Directions',
    'quick.hours': 'Hours',
    'menu.title': 'Menu',
    'menu.popular': 'Popular',
    'bottom.call': 'Call Now',
    'bottom.kakao': 'KakaoTalk',
    'hours.title': 'Business Hours',
    'hours.today': 'Today',
    'location.title': 'Location',
    'gallery.title': 'Gallery',
    'sns.title': 'Follow Us',
    'sns.naver': 'Naver Blog',
    'sns.kakao': 'KakaoTalk Channel',
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
export const smallBizTemplate: HomepageTemplateContent = {
  slug: 'small-biz',
  repoName: 'small-biz',
  description: '우리가게 홍보 페이지 - Linkmap으로 생성',
  files: [
    { path: '.gitignore', content: gitignore },
    { path: '.github/workflows/deploy.yml', content: deployYml },
    { path: 'package.json', content: packageJson },
    { path: 'tsconfig.json', content: tsconfigJson },
    { path: 'postcss.config.mjs', content: postcssConfig },
    { path: 'next.config.ts', content: nextConfig },
    { path: 'src/app/api/og/route.tsx', content: ogRoute },
    { path: 'src/app/globals.css', content: globalsCss },
    { path: 'src/app/layout.tsx', content: layoutTsx },
    { path: 'src/app/page.tsx', content: pageTsx },
    { path: 'src/components/animated-reveal.tsx', content: animatedReveal },
    { path: 'src/components/section-wrapper.tsx', content: sectionWrapper },
    { path: 'src/components/hero-section.tsx', content: heroSection },
    { path: 'src/components/quick-actions.tsx', content: quickActions },
    { path: 'src/components/menu-section.tsx', content: menuSection },
    { path: 'src/components/hours-section.tsx', content: hoursSection },
    { path: 'src/components/location-section.tsx', content: locationSection },
    { path: 'src/components/gallery-section.tsx', content: gallerySection },
    { path: 'src/components/sns-section.tsx', content: snsSection },
    { path: 'src/components/mobile-bottom-bar.tsx', content: mobileBottomBar },
    { path: 'src/components/footer.tsx', content: footerComponent },
    { path: 'src/components/nav-header.tsx', content: navHeader },
    { path: 'src/components/theme-toggle.tsx', content: themeToggle },
    { path: 'src/components/language-toggle.tsx', content: languageToggle },
    { path: 'src/lib/config.ts', content: libConfig },
    { path: 'src/lib/i18n.tsx', content: libI18n },
  ],
};
