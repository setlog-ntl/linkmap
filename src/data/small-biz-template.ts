import type { HomepageTemplateContent } from './homepage-template-content';

// ──────────────────────────────────────────────
// Deploy workflow
// ──────────────────────────────────────────────
const deployYml = `name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_REPO_NAME: \${{ github.event.repository.name }}
          NEXT_PUBLIC_BASE_URL: https://\${{ github.repository_owner }}.github.io/\${{ github.event.repository.name }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
      - id: deployment
        uses: actions/deploy-pages@v4
`;

// ──────────────────────────────────────────────
// package.json
// ──────────────────────────────────────────────
const packageJson = `{
  "name": "small-biz",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-themes": "^0.4.4",
    "lucide-react": "^0.468.0",
    "framer-motion": "^12.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.5.0"
  }
}
`;

// ──────────────────────────────────────────────
// tsconfig.json
// ──────────────────────────────────────────────
const tsconfigJson = `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`;

// ──────────────────────────────────────────────
// postcss.config.mjs
// ──────────────────────────────────────────────
const postcssConfig = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
`;

// ──────────────────────────────────────────────
// next.config.ts
// ──────────────────────────────────────────────
const nextConfig = `import type { NextConfig } from 'next';

const repoName = process.env.NEXT_PUBLIC_REPO_NAME || '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: repoName ? \`/\${repoName}\` : '',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
`;

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
  --color-warm: #fdf4e7;
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
`;

// ──────────────────────────────────────────────
// src/app/layout.tsx
// ──────────────────────────────────────────────
const layoutTsx = `import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { siteConfig } from '@/lib/config';
import { LocaleProvider } from '@/lib/i18n';
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: siteConfig.name,
              description: siteConfig.description,
              ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
              ...(siteConfig.address ? { address: siteConfig.address } : {}),
            }),
          }}
        />
      </head>
      <body className="antialiased bg-[#fdf4e7] text-gray-900 dark:bg-gray-950 dark:text-gray-50">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LocaleProvider>
            {children}
          </LocaleProvider>
        </ThemeProvider>
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
    </>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/hero-section.tsx
// ──────────────────────────────────────────────
const heroSection = `'use client';

import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

export function HeroSection({ config }: Props) {
  const { locale, t } = useLocale();
  const name = locale === 'en' && config.nameEn ? config.nameEn : config.name;
  const desc = locale === 'en' && config.descriptionEn ? config.descriptionEn : config.description;

  return (
    <section
      id="hero"
      className="pt-20 pb-12 px-4 sm:px-6"
    >
      <motion.div
        className="max-w-lg mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-[#d47311] mb-3">
          {name}
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          {desc}
        </p>
        {config.phone && (
          <a
            href={\`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d47311] text-white font-medium hover:opacity-90 transition-opacity min-h-[44px]"
          >
            <Phone className="w-4 h-4" />
            {t('hero.call')}
          </a>
        )}
      </motion.div>
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
            className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border border-[#d47311]/20 bg-white dark:bg-gray-900 text-[#d47311] hover:bg-[#d47311]/5 transition-colors min-h-[44px]"
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

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MenuItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  items: MenuItem[];
}

export function MenuSection({ items }: Props) {
  const { locale, t } = useLocale();
  const categories = [...new Set(items.map((item) => item.category))];
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');

  const filtered = items.filter((item) => item.category === activeCategory);

  return (
    <section id="menu" className="py-12 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-50 mb-6">
          {t('menu.title')}
        </h2>

        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={\`px-4 py-1.5 rounded-full text-sm transition-colors min-h-[44px] \${
                activeCategory === cat
                  ? 'bg-[#d47311] text-white'
                  : 'text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:border-[#d47311]'
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.map((item, i) => {
              const name = locale === 'en' && item.nameEn ? item.nameEn : item.name;
              const desc = locale === 'en' && item.descEn ? item.descEn : item.desc;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                >
                  <span className="text-2xl shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{name}</h3>
                      <span className="text-sm font-medium text-[#d47311] shrink-0">{item.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
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

export function HoursSection({ hours }: Props) {
  const { locale, t } = useLocale();
  const todayIndex = getTodayIndex();

  return (
    <section id="hours" className="py-12 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-50 mb-6">
          {t('hours.title')}
        </h2>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          {hours.map((hour, i) => {
            const day = locale === 'en' && hour.dayEn ? hour.dayEn : hour.day;
            const time = locale === 'en' && hour.hoursEn ? hour.hoursEn : hour.hours;
            const dayNumber = DAY_MAP[hour.dayEn || ''] ?? -1;
            const isToday = dayNumber === todayIndex;

            return (
              <div
                key={i}
                className={\`flex items-center justify-between px-4 py-3 \${
                  i < hours.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
                } \${isToday ? 'bg-[#d47311]/5' : ''}\`}
              >
                <span className={\`text-sm \${isToday ? 'font-bold text-[#d47311]' : 'text-gray-700 dark:text-gray-300'}\`}>
                  {day}
                  {isToday && <span className="ml-1.5 text-xs">({t('hours.today')})</span>}
                </span>
                <span className={\`text-sm \${
                  hour.isHoliday
                    ? 'text-red-500 font-medium'
                    : isToday
                      ? 'font-bold text-[#d47311]'
                      : 'text-gray-600 dark:text-gray-400'
                }\`}>
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
          <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3]">
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
          href={\`https://maps.google.com/?q=\${encodeURIComponent(address)}\`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#d47311]/50 transition-colors"
        >
          <MapPin className="w-5 h-5 text-[#d47311] shrink-0" />
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

import { motion } from 'framer-motion';
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

        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {images.map((src, i) => (
            <motion.div
              key={i}
              className="shrink-0 w-64 h-64 rounded-xl overflow-hidden snap-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
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
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#d47311]/50 transition-colors min-h-[44px]"
            >
              <link.icon className="w-5 h-5 text-[#d47311]" />
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
const footerComponent = `import { ThemeToggle } from './theme-toggle';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-4 sm:px-6">
      <div className="max-w-lg mx-auto flex items-center justify-center gap-2 text-gray-400 text-xs">
        <span>
          Powered by{' '}
          <a
            href="https://www.linkmap.biz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Linkmap
          </a>
        </span>
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

    return () => observer.disconnect();
  }, []);

  return (
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
  );
}
`;

// ──────────────────────────────────────────────
// src/components/theme-toggle.tsx
// ──────────────────────────────────────────────
const themeToggle = `'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { useLocale } from '@/lib/i18n';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-1.5 rounded-full transition-colors duration-200 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/language-toggle.tsx
// ──────────────────────────────────────────────
const languageToggle = `'use client';

import { useLocale } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
      aria-label={locale === 'ko' ? 'Switch to English' : '한국어로 전환'}
    >
      <Globe className="w-3.5 h-3.5" />
      {locale === 'ko' ? 'EN' : '한국어'}
    </button>
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
  kakaoChannelUrl: process.env.NEXT_PUBLIC_KAKAO_CHANNEL || '',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;

// ──────────────────────────────────────────────
// src/lib/i18n.tsx
// ──────────────────────────────────────────────
const libI18n = `'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

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
    'hours.title': '영업시간',
    'hours.today': '오늘',
    'location.title': '오시는 길',
    'gallery.title': '갤러리',
    'sns.title': 'SNS',
    'sns.naver': '네이버 블로그',
    'sns.kakao': '카카오톡 채널',
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
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
    'hours.title': 'Business Hours',
    'hours.today': 'Today',
    'location.title': 'Location',
    'gallery.title': 'Gallery',
    'sns.title': 'Follow Us',
    'sns.naver': 'Naver Blog',
    'sns.kakao': 'KakaoTalk Channel',
    'theme.light': 'Switch to light mode',
    'theme.dark': 'Switch to dark mode',
  },
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'ko',
  setLocale: () => {},
  t: (k) => k,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ko');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved === 'ko' || saved === 'en') {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('locale', l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: string) => translations[locale]?.[key] ?? key,
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
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
    { path: '.github/workflows/deploy.yml', content: deployYml },
    { path: 'package.json', content: packageJson },
    { path: 'tsconfig.json', content: tsconfigJson },
    { path: 'postcss.config.mjs', content: postcssConfig },
    { path: 'next.config.ts', content: nextConfig },
    { path: 'src/app/api/og/route.tsx', content: ogRoute },
    { path: 'src/app/globals.css', content: globalsCss },
    { path: 'src/app/layout.tsx', content: layoutTsx },
    { path: 'src/app/page.tsx', content: pageTsx },
    { path: 'src/components/hero-section.tsx', content: heroSection },
    { path: 'src/components/quick-actions.tsx', content: quickActions },
    { path: 'src/components/menu-section.tsx', content: menuSection },
    { path: 'src/components/hours-section.tsx', content: hoursSection },
    { path: 'src/components/location-section.tsx', content: locationSection },
    { path: 'src/components/gallery-section.tsx', content: gallerySection },
    { path: 'src/components/sns-section.tsx', content: snsSection },
    { path: 'src/components/footer.tsx', content: footerComponent },
    { path: 'src/components/nav-header.tsx', content: navHeader },
    { path: 'src/components/theme-toggle.tsx', content: themeToggle },
    { path: 'src/components/language-toggle.tsx', content: languageToggle },
    { path: 'src/lib/config.ts', content: libConfig },
    { path: 'src/lib/i18n.tsx', content: libI18n },
  ],
};
