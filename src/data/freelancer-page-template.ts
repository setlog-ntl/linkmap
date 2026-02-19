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
  "name": "freelancer-page",
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
      <body className="antialiased bg-gray-950 text-gray-50 dark:bg-gray-950 dark:text-gray-50">
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
      <main>
        <HeroSection config={siteConfig} />
        <ServicesSection services={siteConfig.services} />
        <PortfolioSection portfolio={siteConfig.portfolio} />
        {siteConfig.testimonials.length > 0 && (
          <TestimonialsSection testimonials={siteConfig.testimonials} />
        )}
        <ProcessSection process={siteConfig.process} />
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

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

export function HeroSection({ config }: Props) {
  const { locale, t } = useLocale();
  const name = locale === 'en' && config.nameEn ? config.nameEn : config.name;
  const title = locale === 'en' && config.titleEn ? config.titleEn : config.title;
  const tagline = locale === 'en' && config.taglineEn ? config.taglineEn : config.tagline;

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5b13ec]/10 via-transparent to-[#06b6d4]/10" />

      <motion.div
        className="relative z-10 text-center max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {config.avatarUrl && (
          <img
            src={config.avatarUrl}
            alt={name}
            className="w-28 h-28 rounded-full object-cover mx-auto mb-6 ring-2 ring-[#5b13ec]/50"
          />
        )}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-[#5b13ec] to-[#06b6d4] bg-clip-text text-transparent">
          {name}
        </h1>
        {title && (
          <p className="text-lg text-[#06b6d4] mb-4 font-medium">{title}</p>
        )}
        <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
          {tagline}
        </p>
        <a
          href="#services"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#5b13ec] to-[#06b6d4] text-white font-medium hover:opacity-90 transition-opacity"
        >
          {t('hero.cta')}
          <ArrowDown className="w-4 h-4" />
        </a>
      </motion.div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/services-section.tsx
// ──────────────────────────────────────────────
const servicesSection = `'use client';

import { motion } from 'framer-motion';
import { Palette, Package, Image, Layout, Zap, Component, type LucideIcon } from 'lucide-react';
import type { ServiceItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

const iconMap: Record<string, LucideIcon> = {
  palette: Palette,
  package: Package,
  image: Image,
  layout: Layout,
  zap: Zap,
  component: Component,
};

interface Props {
  services: ServiceItem[];
}

export function ServicesSection({ services }: Props) {
  const { locale, t } = useLocale();

  return (
    <section id="services" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#5b13ec] to-[#06b6d4] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('services.title')}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Palette;
            const title = locale === 'en' && service.titleEn ? service.titleEn : service.title;
            const desc = locale === 'en' && service.descEn ? service.descEn : service.desc;
            const price = locale === 'en' && service.priceEn ? service.priceEn : service.price;
            return (
              <motion.div
                key={i}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-[#5b13ec]/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#5b13ec]/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#5b13ec]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{title}</h3>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">{desc}</p>
                <p className="text-sm font-medium text-[#06b6d4]">{price}</p>
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
// src/components/portfolio-section.tsx
// ──────────────────────────────────────────────
const portfolioSection = `'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PortfolioItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  portfolio: PortfolioItem[];
}

export function PortfolioSection({ portfolio }: Props) {
  const { locale, t } = useLocale();
  const categories = ['all', ...new Set(portfolio.map((p) => locale === 'en' && p.categoryEn ? p.categoryEn : p.category))];
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? portfolio
    : portfolio.filter((p) => {
        const cat = locale === 'en' && p.categoryEn ? p.categoryEn : p.category;
        return cat === activeCategory;
      });

  return (
    <section id="portfolio" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#5b13ec] to-[#06b6d4] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('portfolio.title')}
        </motion.h2>

        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={\`px-4 py-1.5 rounded-full text-sm transition-colors \${
                activeCategory === cat
                  ? 'bg-[#5b13ec] text-white'
                  : 'text-gray-400 border border-white/10 hover:text-white'
              }\`}
            >
              {cat === 'all' ? t('portfolio.all') : cat}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {filtered.map((item, i) => {
              const title = locale === 'en' && item.titleEn ? item.titleEn : item.title;
              const desc = locale === 'en' && item.descEn ? item.descEn : item.desc;
              return (
                <motion.div
                  key={i}
                  className="group rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {item.tags.map((tag, j) => (
                          <span key={j} className="px-2 py-0.5 rounded-full text-xs bg-white/20 text-white">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-100 mb-1">{title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{desc}</p>
                  </div>
                </motion.div>
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
// src/components/testimonials-section.tsx
// ──────────────────────────────────────────────
const testimonialsSection = `'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { TestimonialItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  testimonials: TestimonialItem[];
}

export function TestimonialsSection({ testimonials }: Props) {
  const { locale, t } = useLocale();

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#5b13ec] to-[#06b6d4] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('testimonials.title')}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((item, i) => {
            const author = locale === 'en' && item.authorEn ? item.authorEn : item.author;
            const role = locale === 'en' && item.roleEn ? item.roleEn : item.role;
            const company = locale === 'en' && item.companyEn ? item.companyEn : item.company;
            const content = locale === 'en' && item.contentEn ? item.contentEn : item.content;
            return (
              <motion.div
                key={i}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed italic">
                  &ldquo;{content}&rdquo;
                </p>
                <div>
                  <p className="font-medium text-gray-100 text-sm">{author}</p>
                  <p className="text-xs text-gray-500">{role}, {company}</p>
                </div>
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
// src/components/process-section.tsx
// ──────────────────────────────────────────────
const processSection = `'use client';

import { motion } from 'framer-motion';
import type { ProcessStep } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  process: ProcessStep[];
}

export function ProcessSection({ process }: Props) {
  const { locale, t } = useLocale();

  return (
    <section id="process" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#5b13ec] to-[#06b6d4] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('process.title')}
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {process.map((step, i) => {
            const title = locale === 'en' && step.titleEn ? step.titleEn : step.title;
            const desc = locale === 'en' && step.descEn ? step.descEn : step.desc;
            return (
              <motion.div
                key={i}
                className="relative p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <span className="text-3xl font-bold text-[#5b13ec]/30 mb-3 block">
                  {step.number}
                </span>
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
          className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#5b13ec] to-[#06b6d4] bg-clip-text text-transparent"
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
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#5b13ec] to-[#06b6d4] text-white font-medium hover:opacity-90 transition-opacity"
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
    <footer className="border-t border-gray-800 py-8 px-4 sm:px-6">
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
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-gray-950/80 border-b border-gray-800/50">
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
        <div className="sm:hidden border-t border-gray-800/50 bg-gray-950/95 backdrop-blur-md">
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
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600',
    tags: ['\\uB85C\\uACE0', '\\uD328\\uD0A4\\uC9C0', '\\uBE0C\\uB79C\\uB529'],
  },
  {
    title: 'NILE \\uC2A4\\uD0A8\\uCF00\\uC5B4 \\uD328\\uD0A4\\uC9C0',
    titleEn: 'NILE Skincare Packaging',
    category: '\\uD328\\uD0A4\\uC9C0 \\uB514\\uC790\\uC778',
    categoryEn: 'Packaging Design',
    desc: '\\uBBF8\\uB2C8\\uBA40 \\uB7ED\\uC154\\uB9AC \\uCEE8\\uC149\\uC758 \\uC2A4\\uD0A8\\uCF00\\uC5B4 \\uB77C\\uC778 \\uD328\\uD0A4\\uC9C0 \\uB514\\uC790\\uC778.',
    descEn: 'Minimal-luxury skincare packaging that secured retail placement post-launch.',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
    tags: ['\\uD328\\uD0A4\\uC9C0', '\\uB7ED\\uC154\\uB9AC', '\\uBDF0\\uD2F0'],
  },
  {
    title: '\\uADF8\\uB9B0\\uC6E8\\uC774 \\uBE44\\uC601\\uB9AC \\uC18C\\uC15C \\uD0A4\\uD2B8',
    titleEn: 'Greenway NGO Social Kit',
    category: '\\uC18C\\uC15C \\uBBF8\\uB514\\uC5B4 \\uD0A4\\uD2B8',
    categoryEn: 'Social Media Kit',
    desc: '\\uD658\\uACBD \\uBE44\\uC601\\uB9AC \\uB2E8\\uCCB4\\uC758 \\uCEA0\\uD398\\uC778 \\uBE44\\uC8FC\\uC5BC \\uC81C\\uC791.',
    descEn: 'Campaign visuals for an environmental NGO.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
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
    'nav.services': '서비스',
    'nav.portfolio': '포트폴리오',
    'nav.process': '진행 방식',
    'nav.contact': '연락하기',
    'hero.cta': '서비스 보기',
    'services.title': '서비스',
    'portfolio.title': '포트폴리오',
    'portfolio.all': '전체',
    'testimonials.title': '고객 후기',
    'process.title': '진행 방식',
    'contact.title': '프로젝트 시작하기',
    'contact.desc': '새로운 프로젝트나 협업 제안은 언제든 환영합니다.',
    'contact.email': '이메일 보내기',
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
  },
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.process': 'Process',
    'nav.contact': 'Contact',
    'hero.cta': 'View Services',
    'services.title': 'Services',
    'portfolio.title': 'Portfolio',
    'portfolio.all': 'All',
    'testimonials.title': 'Testimonials',
    'process.title': 'How I Work',
    'contact.title': 'Start a Project',
    'contact.desc': 'Open to new projects and collaboration opportunities.',
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
export const freelancerPageTemplate: HomepageTemplateContent = {
  slug: 'freelancer-page',
  repoName: 'freelancer-page',
  description: '프리랜서 포트폴리오 - Linkmap으로 생성',
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
