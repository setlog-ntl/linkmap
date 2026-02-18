import type { HomepageTemplateContent, TemplateFile } from './homepage-template-content';

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
  "name": "dev-showcase",
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
          background: '#030712',
          fontFamily: 'monospace, sans-serif',
        }}
      >
        <div style={{ fontSize: 20, color: '#4ade80', marginBottom: 16 }}>
          $ whoami
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #60a5fa, #a855f7)',
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
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
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
  title: \`\${siteConfig.name} - 개발자 포트폴리오\`,
  description: siteConfig.tagline,
  openGraph: {
    title: \`\${siteConfig.name} - 개발자 포트폴리오\`,
    description: siteConfig.tagline,
    type: 'website',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
    title: \`\${siteConfig.name} - 개발자 포트폴리오\`,
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
              ...(siteConfig.githubUsername
                ? { sameAs: [\`https://github.com/\${siteConfig.githubUsername}\`] }
                : {}),
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
import { AboutSection } from '@/components/about-section';
import { ProjectsSection } from '@/components/projects-section';
import { ExperienceTimeline } from '@/components/experience-timeline';
import { BlogSection } from '@/components/blog-section';
import { ContactSection } from '@/components/contact-section';
import { GithubGraph } from '@/components/github-graph';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <NavHeader />
      <main>
        <HeroSection config={siteConfig} />
        <AboutSection config={siteConfig} />
        {siteConfig.githubUsername && (
          <GithubGraph username={siteConfig.githubUsername} />
        )}
        <ProjectsSection projects={siteConfig.projects} />
        <ExperienceTimeline experience={siteConfig.experience} />
        {siteConfig.blogPosts && siteConfig.blogPosts.length > 0 && (
          <BlogSection posts={siteConfig.blogPosts} />
        )}
        <ContactSection config={siteConfig} />
      </main>
      <Footer />
    </>
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

const levelWidth: Record<string, string> = {
  beginner: 'w-1/3',
  intermediate: 'w-2/3',
  advanced: 'w-full',
};

interface Props {
  config: SiteConfig;
}

export function AboutSection({ config }: Props) {
  const { locale, t } = useLocale();
  const about = locale === 'en' && config.aboutEn ? config.aboutEn : config.about;

  return (
    <section id="about" className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('about.title')}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-400 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {about}
            </p>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4">{t('about.skills')}</h3>
            {config.skills.map((skill, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm">{skill.name}</span>
                  <span className="text-xs text-gray-500">
                    {t(\`level.\${skill.level}\`)}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={\`h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full \${levelWidth[skill.level]}\`}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/blog-section.tsx
// ──────────────────────────────────────────────
const blogSection = `'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { BlogPost } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  posts: BlogPost[];
}

export function BlogSection({ posts }: Props) {
  const { locale, t } = useLocale();

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('blog.title')}
        </motion.h2>

        <div className="space-y-3">
          {posts.map((post, i) => {
            const title = locale === 'en' && post.titleEn ? post.titleEn : post.title;
            return (
              <motion.a
                key={i}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-800 dark:border-gray-800 hover:bg-gray-800/50 transition-colors group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-200 group-hover:text-white truncate">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-600 shrink-0 ml-4" />
              </motion.a>
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
import { Mail, Github, Linkedin } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

export function ContactSection({ config }: Props) {
  const { t } = useLocale();

  return (
    <section id="contact" className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('contact.title')}
        </motion.h2>

        <motion.p
          className="text-gray-400 dark:text-gray-400 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t('contact.desc')}
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {config.email && (
            <a
              href={\`mailto:\${config.email}\`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              {t('contact.email')}
            </a>
          )}
          {config.githubUsername && (
            <a
              href={\`https://github.com/\${config.githubUsername}\`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-3 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {config.linkedinUrl && (
            <a
              href={config.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-3 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/experience-timeline.tsx
// ──────────────────────────────────────────────
const experienceTimeline = `'use client';

import { motion } from 'framer-motion';
import type { ExperienceItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  experience: ExperienceItem[];
}

export function ExperienceTimeline({ experience }: Props) {
  const { locale, t } = useLocale();

  return (
    <section id="experience" className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('experience.title')}
        </motion.h2>

        <div className="relative ml-4 sm:ml-8">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500/30" />

          <div className="space-y-8">
            {experience.map((item, i) => {
              const title = locale === 'en' && item.titleEn ? item.titleEn : item.title;
              const company = locale === 'en' && item.companyEn ? item.companyEn : item.company;
              const period = locale === 'en' && item.periodEn ? item.periodEn : item.period;
              const description = locale === 'en' && item.descriptionEn ? item.descriptionEn : item.description;

              return (
                <motion.div
                  key={i}
                  className="relative pl-8"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  {/* Node dot */}
                  <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-blue-500 -translate-x-[5px] ring-4 ring-gray-950 dark:ring-gray-950" />

                  <div className="p-4 rounded-xl border border-gray-800 dark:border-gray-800 bg-gray-900/50 dark:bg-gray-900/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                      <h3 className="font-semibold text-gray-100">
                        {title}
                      </h3>
                      <span className="font-mono text-xs text-gray-500">
                        {period}
                      </span>
                    </div>
                    <p className="text-sm text-blue-400/80 mb-2">
                      {company}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-400">
                      {description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
// src/components/github-graph.tsx
// ──────────────────────────────────────────────
const githubGraph = `'use client';

import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n';

interface Props {
  username: string;
}

export function GithubGraph({ username }: Props) {
  const { t } = useLocale();

  return (
    <section className="py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="rounded-xl border border-gray-800 dark:border-gray-800 p-4 bg-gray-900/50 overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={\`https://ghchart.rshah.org/3b82f6/\${username}\`}
            alt={\`\${username} \${t('github.alt')}\`}
            className="w-full max-w-full"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/hero-section.tsx
// ──────────────────────────────────────────────
const heroSection = `'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

function useTypingAnimation(texts: string[], speed = 80, pause = 2000) {
  const stateRef = useRef({
    displayed: '',
    textIndex: 0,
    charIndex: 0,
    deleting: false,
  });
  const listenersRef = useRef(new Set<() => void>());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  const subscribe = useCallback((cb: () => void) => {
    listenersRef.current.add(cb);
    return () => { listenersRef.current.delete(cb); };
  }, []);

  const notify = useCallback(() => {
    listenersRef.current.forEach((cb) => cb());
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    const current = texts[s.textIndex];

    if (!s.deleting && s.charIndex <= current.length) {
      s.displayed = current.slice(0, s.charIndex);
      s.charIndex++;
      notify();
      timerRef.current = setTimeout(tick, speed);
    } else if (!s.deleting && s.charIndex > current.length) {
      s.deleting = true;
      timerRef.current = setTimeout(tick, pause);
    } else if (s.deleting && s.charIndex > 0) {
      s.charIndex--;
      s.displayed = current.slice(0, s.charIndex);
      notify();
      timerRef.current = setTimeout(tick, speed / 2);
    } else if (s.deleting && s.charIndex === 0) {
      s.deleting = false;
      s.textIndex = (s.textIndex + 1) % texts.length;
      timerRef.current = setTimeout(tick, speed);
    }
  }, [texts, speed, pause, notify]);

  // Start animation on first subscribe (client only)
  if (typeof window !== 'undefined' && !startedRef.current) {
    startedRef.current = true;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      stateRef.current.displayed = texts[0];
    } else {
      setTimeout(tick, speed);
    }
  }

  const getSnapshot = useCallback(() => stateRef.current.displayed, []);
  const getServerSnapshot = useCallback(() => '', []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function HeroSection({ config }: Props) {
  const { locale, t } = useLocale();
  const name = locale === 'en' && config.nameEn ? config.nameEn : config.name;
  const taglineRaw = locale === 'en' && config.taglineEn ? config.taglineEn : config.tagline;

  const taglines = taglineRaw.includes('|')
    ? taglineRaw.split('|').map((s) => s.trim())
    : [taglineRaw];
  const typed = useTypingAnimation(taglines);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(75,85,99,0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}
    >
      <motion.div
        className="text-center max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-green-400 dark:text-green-400 text-sm mb-4">
          $ whoami
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {name}
        </h1>
        <p className="text-xl text-gray-400 dark:text-gray-400 mb-2 h-8">
          {typed}
          <span className="animate-pulse ml-0.5">|</span>
        </p>
      </motion.div>

      <motion.div
        className="flex items-center gap-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {config.githubUsername && (
          <a
            href={\`https://github.com/\${config.githubUsername}\`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        )}
        {config.linkedinUrl && (
          <a
            href={config.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        )}
        {config.email && (
          <a
            href={\`mailto:\${config.email}\`}
            aria-label="Email"
            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <Mail className="w-5 h-5" />
          </a>
        )}
        {config.resumeUrl && (
          <a
            href={config.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            {t('hero.resume')}
          </a>
        )}
      </motion.div>
    </section>
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
// src/components/nav-header.tsx
// ──────────────────────────────────────────────
const navHeader = `'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/lib/i18n';
import { LanguageToggle } from './language-toggle';

const sectionIds = ['hero', 'about', 'projects', 'experience', 'contact'];

const sectionKeys: Record<string, string> = {
  hero: 'nav.home',
  about: 'nav.about',
  projects: 'nav.projects',
  experience: 'nav.experience',
  contact: 'nav.contact',
};

export function NavHeader() {
  const [active, setActive] = useState('hero');
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
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-gray-950/80 dark:bg-gray-950/80 border-b border-gray-800/50">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-center gap-1">
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
        <LanguageToggle />
      </nav>
    </header>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/projects-section.tsx
// ──────────────────────────────────────────────
const projectsSection = `'use client';

import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import type { ProjectItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  Dockerfile: '#384d54',
  HTML: '#e34c26',
  CSS: '#563d7c',
};

interface Props {
  projects: ProjectItem[];
}

export function ProjectsSection({ projects }: Props) {
  const { locale, t } = useLocale();

  return (
    <section id="projects" className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {t('projects.title')}
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => {
            const desc = locale === 'en' && project.descriptionEn ? project.descriptionEn : project.description;
            return (
              <motion.a
                key={i}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl border border-gray-800 dark:border-gray-800 bg-gray-900 dark:bg-gray-900 hover:border-blue-500/50 transition-colors group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-mono text-sm font-semibold text-blue-400 group-hover:text-blue-300 truncate">
                    {project.name}
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-600 shrink-0 ml-2" />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-400 mb-3 line-clamp-2">
                  {desc}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          languageColors[project.language] || '#6b7280',
                      }}
                    />
                    {project.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {project.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" />
                    {project.forks}
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
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
// src/lib/config.ts
// ──────────────────────────────────────────────
const libConfig = `export interface SkillItem {
  name: string;
  icon?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface ExperienceItem {
  title: string;
  titleEn?: string;
  company: string;
  companyEn?: string;
  period: string;
  periodEn?: string;
  description: string;
  descriptionEn?: string;
}

export interface BlogPost {
  title: string;
  titleEn?: string;
  url: string;
  date: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  descriptionEn?: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
}

const DEMO_SKILLS: SkillItem[] = [
  { name: 'TypeScript', level: 'advanced' },
  { name: 'React', level: 'advanced' },
  { name: 'Next.js', level: 'advanced' },
  { name: 'Node.js', level: 'intermediate' },
  { name: 'Python', level: 'intermediate' },
  { name: 'Docker', level: 'intermediate' },
  { name: 'PostgreSQL', level: 'intermediate' },
  { name: 'AWS', level: 'beginner' },
];

const DEMO_EXPERIENCE: ExperienceItem[] = [
  {
    title: '프론트엔드 개발자',
    titleEn: 'Frontend Developer',
    company: 'ABC 테크',
    companyEn: 'ABC Tech',
    period: '2024 - 현재',
    periodEn: '2024 - Present',
    description: 'React, Next.js 기반 웹 애플리케이션 개발. 디자인 시스템 구축 및 성능 최적화.',
    descriptionEn: 'Web application development with React & Next.js. Built design system and optimized performance.',
  },
  {
    title: '웹 개발 인턴',
    titleEn: 'Web Development Intern',
    company: 'XYZ 스타트업',
    companyEn: 'XYZ Startup',
    period: '2023 - 2024',
    periodEn: '2023 - 2024',
    description: 'Full-stack 웹 개발. REST API 설계 및 프론트엔드 UI 구현.',
    descriptionEn: 'Full-stack web development. Designed REST APIs and implemented frontend UI.',
  },
  {
    title: '컴퓨터공학 전공',
    titleEn: 'Computer Science Major',
    company: '한국대학교',
    companyEn: 'Korea University',
    period: '2019 - 2023',
    periodEn: '2019 - 2023',
    description: '컴퓨터공학 학사. 졸업 프로젝트: AI 기반 코드 리뷰 도구 개발.',
    descriptionEn: 'B.S. in Computer Science. Capstone: AI-powered code review tool.',
  },
];

const DEMO_PROJECTS: ProjectItem[] = [
  {
    name: 'awesome-react-hooks',
    description: '실무에서 자주 사용하는 커스텀 React 훅 모음',
    descriptionEn: 'Collection of custom React hooks for production use',
    url: 'https://github.com',
    language: 'TypeScript',
    stars: 142,
    forks: 23,
  },
  {
    name: 'nextjs-blog-starter',
    description: 'MDX 기반 블로그 스타터 템플릿 (다크모드, SEO)',
    descriptionEn: 'MDX-based blog starter template (dark mode, SEO)',
    url: 'https://github.com',
    language: 'TypeScript',
    stars: 89,
    forks: 15,
  },
  {
    name: 'python-ml-toolkit',
    description: '머신러닝 전처리 유틸리티 라이브러리',
    descriptionEn: 'Machine learning preprocessing utility library',
    url: 'https://github.com',
    language: 'Python',
    stars: 56,
    forks: 8,
  },
  {
    name: 'docker-dev-env',
    description: '개발 환경 Docker Compose 템플릿 모음',
    descriptionEn: 'Collection of Docker Compose templates for dev environments',
    url: 'https://github.com',
    language: 'Dockerfile',
    stars: 34,
    forks: 12,
  },
  {
    name: 'cli-todo-app',
    description: 'Rust로 만든 터미널 할일 관리 앱',
    descriptionEn: 'Terminal todo app built with Rust',
    url: 'https://github.com',
    language: 'Rust',
    stars: 28,
    forks: 5,
  },
  {
    name: 'api-rate-limiter',
    description: 'Express.js 미들웨어 기반 API 속도 제한기',
    descriptionEn: 'Express.js middleware-based API rate limiter',
    url: 'https://github.com',
    language: 'JavaScript',
    stars: 21,
    forks: 3,
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
  name: process.env.NEXT_PUBLIC_SITE_NAME || '김개발',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || 'Gaebal Kim',
  githubUsername: process.env.NEXT_PUBLIC_GITHUB_USERNAME || null,
  tagline: process.env.NEXT_PUBLIC_TAGLINE || '풀스택 개발자 | 오픈소스 기여자',
  taglineEn: process.env.NEXT_PUBLIC_TAGLINE_EN || 'Full-Stack Developer | Open Source Contributor',
  about:
    process.env.NEXT_PUBLIC_ABOUT ||
    '안녕하세요! 웹 기술에 열정을 가진 풀스택 개발자입니다. React와 Next.js를 주로 사용하며, 오픈소스 프로젝트에 기여하는 것을 좋아합니다. 사용자 경험을 개선하고 깔끔한 코드를 작성하는 데 집중합니다.',
  aboutEn:
    process.env.NEXT_PUBLIC_ABOUT_EN ||
    "Hi! I'm a full-stack developer passionate about web technologies. I primarily work with React and Next.js, and love contributing to open source projects. I focus on improving user experience and writing clean code.",
  skills: parseJSON<SkillItem[]>(process.env.NEXT_PUBLIC_SKILLS, DEMO_SKILLS),
  experience: parseJSON<ExperienceItem[]>(process.env.NEXT_PUBLIC_EXPERIENCE, DEMO_EXPERIENCE),
  projects: DEMO_PROJECTS,
  blogPosts: parseJSON<BlogPost[] | null>(process.env.NEXT_PUBLIC_BLOG_POSTS, null),
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL || null,
  email: process.env.NEXT_PUBLIC_EMAIL || null,
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || null,
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;

// ──────────────────────────────────────────────
// src/lib/github.ts
// ──────────────────────────────────────────────
const libGithub = `import type { ProjectItem } from './config';

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

export async function fetchGitHubRepos(
  username: string
): Promise<ProjectItem[]> {
  try {
    const res = await fetch(
      \`https://api.github.com/users/\${username}/repos?sort=stars&per_page=6\`,
      { cache: 'force-cache' }
    );
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();
    return repos.map((repo) => ({
      name: repo.name,
      description: repo.description || '',
      url: repo.html_url,
      language: repo.language || 'Unknown',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }));
  } catch {
    return [];
  }
}
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
    'nav.projects': '프로젝트',
    'nav.experience': '경력',
    'nav.contact': '연락처',
    'hero.resume': '이력서 다운로드',
    'about.title': '소개',
    'about.skills': '기술 스택',
    'level.beginner': '입문',
    'level.intermediate': '중급',
    'level.advanced': '고급',
    'projects.title': '프로젝트',
    'experience.title': '경력',
    'blog.title': '블로그',
    'contact.title': '함께 일하고 싶다면',
    'contact.desc': '새로운 프로젝트나 협업 제안은 언제든 환영합니다.',
    'contact.email': '이메일 보내기',
    'github.alt': 'GitHub 기여 그래프',
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
    'footer.powered': 'Powered by',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.contact': 'Contact',
    'hero.resume': 'Download Resume',
    'about.title': 'About',
    'about.skills': 'Tech Stack',
    'level.beginner': 'Beginner',
    'level.intermediate': 'Intermediate',
    'level.advanced': 'Advanced',
    'projects.title': 'Projects',
    'experience.title': 'Experience',
    'blog.title': 'Blog',
    'contact.title': "Let's Work Together",
    'contact.desc': 'Open to new projects and collaboration opportunities.',
    'contact.email': 'Send Email',
    'github.alt': 'GitHub Contribution Graph',
    'theme.light': 'Switch to light mode',
    'theme.dark': 'Switch to dark mode',
    'footer.powered': 'Powered by',
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
export const devShowcaseTemplate: HomepageTemplateContent = {
  slug: 'dev-showcase',
  repoName: 'dev-showcase',
  description: '개발자 포트폴리오 - Linkmap으로 생성',
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
    { path: 'src/components/about-section.tsx', content: aboutSection },
    { path: 'src/components/blog-section.tsx', content: blogSection },
    { path: 'src/components/contact-section.tsx', content: contactSection },
    { path: 'src/components/experience-timeline.tsx', content: experienceTimeline },
    { path: 'src/components/footer.tsx', content: footerComponent },
    { path: 'src/components/github-graph.tsx', content: githubGraph },
    { path: 'src/components/hero-section.tsx', content: heroSection },
    { path: 'src/components/language-toggle.tsx', content: languageToggle },
    { path: 'src/components/nav-header.tsx', content: navHeader },
    { path: 'src/components/projects-section.tsx', content: projectsSection },
    { path: 'src/components/theme-toggle.tsx', content: themeToggle },
    { path: 'src/lib/config.ts', content: libConfig },
    { path: 'src/lib/github.ts', content: libGithub },
    { path: 'src/lib/i18n.tsx', content: libI18n },
  ],
};
