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
  "name": "personal-brand",
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
          background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #ee5b2b, #f59e0b)',
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
  --color-primary: #ee5b2b;
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: siteConfig.name,
              description: siteConfig.tagline,
              ...(siteConfig.email ? { email: siteConfig.email } : {}),
            }),
          }}
        />
      </head>
      <body className="antialiased bg-[#0f0f0f] text-gray-50 dark:bg-[#0f0f0f] dark:text-gray-50">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
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
import { AboutSection } from '@/components/about-section';
import { ValuesSection } from '@/components/values-section';
import { HighlightsSection } from '@/components/highlights-section';
import { GallerySection } from '@/components/gallery-section';
import { ContactSection } from '@/components/contact-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <NavHeader />
      <main>
        <HeroSection config={siteConfig} />
        <AboutSection config={siteConfig} />
        <ValuesSection values={siteConfig.values} />
        <HighlightsSection highlights={siteConfig.highlights} />
        {siteConfig.galleryImages.length > 0 && (
          <GallerySection images={siteConfig.galleryImages} />
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

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

export function HeroSection({ config }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { locale, t } = useLocale();
  const name = locale === 'en' && config.nameEn ? config.nameEn : config.name;
  const tagline = locale === 'en' && config.taglineEn ? config.taglineEn : config.tagline;

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {config.heroImageUrl && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y }}
        >
          <img
            src={config.heroImageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>
      )}

      {!config.heroImageUrl && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#ee5b2b]/10 to-transparent" />
      )}

      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 max-w-3xl"
        style={{ opacity }}
      >
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#ee5b2b] to-[#f59e0b] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {name}
        </motion.h1>
        <motion.p
          className="text-xl sm:text-2xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {tagline}
        </motion.p>
        <motion.a
          href="#about"
          className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#ee5b2b] to-[#f59e0b] text-white font-medium hover:opacity-90 transition-opacity"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {t('hero.cta')}
        </motion.a>
      </motion.div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/about-section.tsx
// ──────────────────────────────────────────────
const aboutSection = `'use client';

import { motion } from 'framer-motion';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

export function AboutSection({ config }: Props) {
  const { locale, t } = useLocale();
  const story = locale === 'en' && config.storyEn ? config.storyEn : config.story;

  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#ee5b2b] to-[#f59e0b] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('about.title')}
        </motion.h2>

        <motion.p
          className="text-lg text-gray-400 leading-relaxed whitespace-pre-line"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {story}
        </motion.p>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/values-section.tsx
// ──────────────────────────────────────────────
const valuesSection = `'use client';

import { motion } from 'framer-motion';
import type { ValueItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  values: ValueItem[];
}

export function ValuesSection({ values }: Props) {
  const { locale, t } = useLocale();

  return (
    <section id="values" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#ee5b2b] to-[#f59e0b] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('values.title')}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value, i) => {
            const title = locale === 'en' && value.titleEn ? value.titleEn : value.title;
            const desc = locale === 'en' && value.descEn ? value.descEn : value.desc;
            return (
              <motion.div
                key={i}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <span className="text-2xl mb-3 block">{value.emoji}</span>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/highlights-section.tsx
// ──────────────────────────────────────────────
const highlightsSection = `'use client';

import { motion } from 'framer-motion';
import type { HighlightItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  highlights: HighlightItem[];
}

export function HighlightsSection({ highlights }: Props) {
  const { locale, t } = useLocale();

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#ee5b2b] to-[#f59e0b] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('highlights.title')}
        </motion.h2>

        <div className="grid sm:grid-cols-3 gap-6">
          {highlights.map((item, i) => {
            const label = locale === 'en' && item.labelEn ? item.labelEn : item.label;
            const value = locale === 'en' && item.valueEn ? item.valueEn : item.value;
            return (
              <motion.div
                key={i}
                className="text-center p-8 rounded-2xl border border-white/5 bg-white/[0.02]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#ee5b2b] to-[#f59e0b] bg-clip-text text-transparent mb-2">
                  {value}
                </p>
                <p className="text-sm text-gray-400">{label}</p>
              </motion.div>
            );
          })}
        </div>
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
    <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#ee5b2b] to-[#f59e0b] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('gallery.title')}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((src, i) => (
            <motion.div
              key={i}
              className="aspect-square rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
// src/components/contact-section.tsx
// ──────────────────────────────────────────────
const contactSection = `'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

export function ContactSection({ config }: Props) {
  const { t } = useLocale();

  return (
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#ee5b2b] to-[#f59e0b] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('contact.title')}
        </motion.h2>

        <motion.p
          className="text-gray-400 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t('contact.desc')}
        </motion.p>

        {config.email && (
          <motion.a
            href={\`mailto:\${config.email}\`}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#ee5b2b] to-[#f59e0b] text-white font-medium hover:opacity-90 transition-opacity"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Mail className="w-4 h-4" />
            {t('contact.email')}
          </motion.a>
        )}

        {config.socials.length > 0 && (
          <motion.div
            className="flex items-center justify-center gap-4 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {config.socials.map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/30 transition-colors capitalize"
              >
                {social.platform}
              </a>
            ))}
          </motion.div>
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
    <footer className="border-t border-white/5 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-gray-500 text-xs">
        <span>
          Powered by{' '}
          <a
            href="https://www.linkmap.biz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-gray-300"
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

const sectionIds = ['hero', 'about', 'values', 'gallery', 'contact'];

const sectionKeys: Record<string, string> = {
  hero: 'nav.home',
  about: 'nav.about',
  values: 'nav.values',
  gallery: 'nav.gallery',
  contact: 'nav.contact',
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
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#0f0f0f]/80 border-b border-white/5">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-1">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={\`#\${id}\`}
              className={\`px-3 py-1.5 rounded-full text-sm transition-colors \${
                active === id
                  ? 'text-white bg-white/10'
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
        <div className="sm:hidden border-t border-white/5 bg-[#0f0f0f]/95 backdrop-blur-md">
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
      className="p-1.5 rounded-full transition-colors duration-200 text-gray-500 hover:text-gray-300"
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
      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-gray-400 hover:text-white transition-colors"
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
const libConfig = `export interface ValueItem {
  emoji: string;
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
}

export interface HighlightItem {
  label: string;
  labelEn?: string;
  value: string;
  valueEn?: string;
}

export interface SocialItem {
  platform: string;
  url: string;
}

const DEMO_VALUES: ValueItem[] = [
  {
    emoji: '\\u2726',
    title: '\\uC9C4\\uC815\\uC131',
    titleEn: 'Authenticity',
    desc: '\\uAD11\\uACE0\\uCC98\\uB7FC \\uB290\\uAEF4\\uC9C0\\uC9C0 \\uC54A\\uB294 \\uCF58\\uD150\\uCE20. \\uB0B4\\uAC00 \\uC9C1\\uC811 \\uC368\\uBD24\\uAC70\\uB098 \\uBFFF\\uB294 \\uAC83\\uB9CC \\uC774\\uC57C\\uAE30\\uD569\\uB2C8\\uB2E4.',
    descEn: "Content that never feels like an ad \\u2014 I only talk about things I've personally used or believe in.",
  },
  {
    emoji: '\\u2726',
    title: '\\uC77C\\uAD00\\uC131',
    titleEn: 'Consistency',
    desc: '2019\\uB144\\uBD80\\uD130 \\uD55C \\uC8FC\\uB3C4 \\uAC70\\uB974\\uC9C0 \\uC54A\\uC740 \\uB274\\uC2A4\\uB808\\uD130. \\uAFB8\\uC900\\uD568\\uC774 \\uC2E0\\uB8B0\\uB97C \\uB9CC\\uB4E0\\uB2E4\\uACE0 \\uC0DD\\uAC01\\uD574\\uC694.',
    descEn: 'A newsletter published every single week since 2019. I believe consistency builds trust.',
  },
  {
    emoji: '\\u2726',
    title: '\\uD638\\uAE30\\uC2EC',
    titleEn: 'Curiosity',
    desc: '\\uC0C8\\uB85C\\uC6B4 \\uD50C\\uB7AB\\uD3FC, \\uC0C8\\uB85C\\uC6B4 \\uD3EC\\uB9F7, \\uC0C8\\uB85C\\uC6B4 \\uC0AC\\uB78C. \\uBC30\\uC6C0\\uC744 \\uBA48\\uCD94\\uC9C0 \\uC54A\\uB294 \\uAC83\\uC774 \\uC81C \\uC6D0\\uB3D9\\uB825\\uC785\\uB2C8\\uB2E4.',
    descEn: 'New platforms, new formats, new people \\u2014 never stopping learning is what keeps me going.',
  },
];

const DEMO_HIGHLIGHTS: HighlightItem[] = [
  { label: '\\uAD6C\\uB3C5\\uC790 \\uD569\\uC0B0', labelEn: 'Total Subscribers', value: '84,000+', valueEn: '84,000+' },
  { label: '\\uD611\\uC5C5 \\uBE0C\\uB79C\\uB4DC', labelEn: 'Brand Collabs', value: '120+', valueEn: '120+' },
  { label: '\\uB274\\uC2A4\\uB808\\uD130 \\uC5F0\\uC18D \\uBC1C\\uD589', labelEn: 'Newsletter Streak', value: '312\\uC8FC', valueEn: '312 Weeks' },
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
  name: process.env.NEXT_PUBLIC_SITE_NAME || '\\uC774\\uC9C0\\uC6D0',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || 'Jiwon Lee',
  tagline: process.env.NEXT_PUBLIC_TAGLINE || '\\uCF58\\uD150\\uCE20\\uB85C \\uC138\\uC0C1\\uC744 \\uC5F0\\uACB0\\uD558\\uB294 \\uD06C\\uB9AC\\uC5D0\\uC774\\uD130',
  taglineEn: process.env.NEXT_PUBLIC_TAGLINE_EN || 'Creator who connects the world through content',
  heroImageUrl: process.env.NEXT_PUBLIC_HERO_IMAGE_URL || null,
  story:
    process.env.NEXT_PUBLIC_STORY ||
    '\\uC548\\uB155\\uD558\\uC138\\uC694, \\uC800\\uB294 \\uC774\\uC9C0\\uC6D0\\uC785\\uB2C8\\uB2E4. 5\\uB144\\uC0B4 \\uB514\\uC9C0\\uD138 \\uCF58\\uD150\\uCE20\\uB97C \\uB9CC\\uB4E4\\uBA70 \\uBE0C\\uB79C\\uB4DC\\uC640 \\uC0AC\\uB78C \\uC0AC\\uC774\\uC758 \\uB2E4\\uB9AC\\uB97C \\uB193\\uACE0 \\uC788\\uC5B4\\uC694.',
  storyEn:
    process.env.NEXT_PUBLIC_STORY_EN ||
    "Hi, I'm Jiwon Lee. For the past five years I've been building bridges between brands and people through digital content.",
  values: parseJSON<ValueItem[]>(process.env.NEXT_PUBLIC_VALUES, DEMO_VALUES),
  highlights: parseJSON<HighlightItem[]>(process.env.NEXT_PUBLIC_HIGHLIGHTS, DEMO_HIGHLIGHTS),
  galleryImages: parseJSON<string[]>(process.env.NEXT_PUBLIC_GALLERY_IMAGES, []),
  email: process.env.NEXT_PUBLIC_EMAIL || 'hello@jiwonlee.kr',
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, [
    { platform: 'youtube', url: 'https://youtube.com' },
    { platform: 'instagram', url: 'https://instagram.com' },
  ]),
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
    'nav.about': '소개',
    'nav.values': '가치관',
    'nav.gallery': '갤러리',
    'nav.contact': '연락처',
    'hero.cta': '더 알아보기',
    'about.title': '나의 이야기',
    'values.title': '가치관',
    'highlights.title': '하이라이트',
    'gallery.title': '갤러리',
    'contact.title': '함께 이야기 나눠요',
    'contact.desc': '협업, 강연, 브랜드 캠페인 — 무엇이든 편하게 연락 주세요.',
    'contact.email': '이메일 보내기',
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.values': 'Values',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'hero.cta': 'Learn More',
    'about.title': 'My Story',
    'values.title': 'Values',
    'highlights.title': 'Highlights',
    'gallery.title': 'Gallery',
    'contact.title': "Let's Talk",
    'contact.desc': 'Collaboration, speaking, brand campaigns — feel free to reach out.',
    'contact.email': 'Send Email',
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
export const personalBrandTemplate: HomepageTemplateContent = {
  slug: 'personal-brand',
  repoName: 'personal-brand',
  description: '나만의 홈페이지 - Linkmap으로 생성',
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
    { path: 'src/components/about-section.tsx', content: aboutSection },
    { path: 'src/components/values-section.tsx', content: valuesSection },
    { path: 'src/components/highlights-section.tsx', content: highlightsSection },
    { path: 'src/components/gallery-section.tsx', content: gallerySection },
    { path: 'src/components/contact-section.tsx', content: contactSection },
    { path: 'src/components/footer.tsx', content: footerComponent },
    { path: 'src/components/nav-header.tsx', content: navHeader },
    { path: 'src/components/theme-toggle.tsx', content: themeToggle },
    { path: 'src/components/language-toggle.tsx', content: languageToggle },
    { path: 'src/lib/config.ts', content: libConfig },
    { path: 'src/lib/i18n.tsx', content: libI18n },
  ],
};
