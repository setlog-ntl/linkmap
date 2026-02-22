import type { HomepageTemplateContent, TemplateFile } from './homepage-template-content';
import {
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

const packageJson = makePackageJson('dev-showcase');

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
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  --color-primary: #58a6ff;
}

/* ── Preset: GitHub Dark (default) ── */
:root, [data-preset="github-dark"] {
  --gh-bg: #0d1117;
  --gh-surface: #161b22;
  --gh-border: #30363d;
  --gh-blue: #58a6ff;
  --gh-green: #7ee787;
  --gh-purple: #d2a8ff;
  --gh-orange: #d29922;
  --gh-text: #e6edf3;
  --gh-muted: #7d8590;
}

/* ── Preset: VS Code Dark ── */
[data-preset="vscode"] {
  --gh-bg: #1e1e1e;
  --gh-surface: #252526;
  --gh-border: #3c3c3c;
  --gh-blue: #569cd6;
  --gh-green: #6a9955;
  --gh-purple: #c586c0;
  --gh-orange: #ce9178;
  --gh-text: #d4d4d4;
  --gh-muted: #808080;
}

/* ── Preset: Dracula ── */
[data-preset="dracula"] {
  --gh-bg: #282a36;
  --gh-surface: #343746;
  --gh-border: #44475a;
  --gh-blue: #8be9fd;
  --gh-green: #50fa7b;
  --gh-purple: #ff79c6;
  --gh-orange: #ffb86c;
  --gh-text: #f8f8f2;
  --gh-muted: #6272a4;
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .cursor-blink { animation: none !important; opacity: 1; }
}

/* Terminal cursor blink */
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.cursor-blink {
  animation: blink-cursor 1s step-end infinite;
}

/* Terminal window frame */
.terminal-frame {
  background: var(--gh-surface);
  border: 1px solid var(--gh-border);
  border-radius: 12px;
  overflow: hidden;
}
.terminal-titlebar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--gh-border);
}
.terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* Language color line for project cards */
.lang-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 0 0 12px 12px;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.group:hover .lang-line {
  opacity: 1;
}

*:focus-visible {
  outline: 2px solid var(--color-primary, #58a6ff);
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

/* Card hover */
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
  background: var(--color-primary, #58a6ff);
  z-index: 100;
  transition: width 0.1s linear;
  pointer-events: none;
}
`;

// ──────────────────────────────────────────────
// src/app/layout.tsx
// ──────────────────────────────────────────────
const layoutTsx = `import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { JetBrains_Mono } from 'next/font/google';
import { siteConfig } from '@/lib/config';
import { LocaleProvider } from '@/lib/i18n';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
});

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
    <html lang="ko" data-preset={siteConfig.designPreset || 'github-dark'} suppressHydrationWarning>
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
              '@type': 'ProfilePage',
              mainEntity: {
                '@type': 'Person',
                name: siteConfig.name,
                description: siteConfig.tagline,
                ...(siteConfig.email ? { email: siteConfig.email } : {}),
                ...(siteConfig.githubUsername
                  ? { sameAs: [\`https://github.com/\${siteConfig.githubUsername}\`] }
                  : {}),
                ...(siteConfig.skills?.length ? { knowsAbout: siteConfig.skills.map((s: { name: string }) => s.name) } : {}),
              },
            }),
          }}
        />
      </head>
      <body className={\`antialiased bg-gray-950 text-gray-50 dark:bg-gray-950 dark:text-gray-50 \${jetbrainsMono.variable}\`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:shadow-lg focus:text-sm">본문으로 바로가기</a>
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
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--gh-border)' }}>
                  <div
                    className={\`h-full rounded-full \${levelWidth[skill.level]}\`}
                    style={{ background: 'linear-gradient(90deg, var(--gh-blue), var(--gh-purple))' }}
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
          <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: 'var(--gh-blue)', opacity: 0.3 }} />

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
                  <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full -translate-x-[5px] ring-4" style={{ background: 'var(--gh-blue)', '--tw-ring-color': 'var(--gh-bg)' } as Record<string, string>} />

                  <div className="p-4 rounded-xl" style={{ border: '1px solid var(--gh-border)', background: 'var(--gh-surface)' }}>
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
        <a
          href="https://www.linkmap.biz/sites?utm_source=badge&utm_medium=referral&utm_campaign=dev-showcase"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10 transition-all text-[11px] font-medium"
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
          className="rounded-xl p-4 overflow-x-auto"
          style={{ border: '1px solid var(--gh-border)', background: 'var(--gh-surface)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={\`https://ghchart.rshah.org/58a6ff/\${username}\`}
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
        background: 'var(--gh-bg)',
        backgroundImage:
          'radial-gradient(circle at 1px 1px, var(--gh-border) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}
    >
      <motion.div
        className="w-full max-w-2xl terminal-frame"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="terminal-titlebar">
          <div className="terminal-dot" style={{ background: '#ff5f57' }} />
          <div className="terminal-dot" style={{ background: '#febc2e' }} />
          <div className="terminal-dot" style={{ background: '#28c840' }} />
          <span className="font-mono text-xs ml-2" style={{ color: 'var(--gh-muted)' }}>~/{name.toLowerCase().replace(/\\s+/g, '-')}</span>
        </div>
        <div className="p-6 sm:p-8 text-center">
          <p className="font-mono text-sm mb-4" style={{ color: 'var(--gh-green)' }}>
            <span style={{ color: 'var(--gh-blue)' }}>~$</span> whoami
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" style={{ background: 'linear-gradient(135deg, var(--gh-blue), var(--gh-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {name}
          </h1>
          <p className="font-mono text-lg mb-2 h-8" style={{ color: 'var(--gh-muted)' }}>
            {typed}
            <span className="cursor-blink ml-0.5" style={{ color: 'var(--gh-green)' }}>▌</span>
          </p>
        </div>
      </motion.div>

      <motion.div
        className="flex items-center gap-3 mt-8"
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
            className="p-2.5 rounded-lg border transition-all duration-200 hover:scale-105"
            style={{ borderColor: 'var(--gh-border)', color: 'var(--gh-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gh-blue)'; e.currentTarget.style.color = 'var(--gh-blue)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--gh-border)'; e.currentTarget.style.color = 'var(--gh-muted)'; }}
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
            className="p-2.5 rounded-lg border transition-all duration-200 hover:scale-105"
            style={{ borderColor: 'var(--gh-border)', color: 'var(--gh-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gh-blue)'; e.currentTarget.style.color = 'var(--gh-blue)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--gh-border)'; e.currentTarget.style.color = 'var(--gh-muted)'; }}
          >
            <Linkedin className="w-5 h-5" />
          </a>
        )}
        {config.email && (
          <a
            href={\`mailto:\${config.email}\`}
            aria-label="Email"
            className="p-2.5 rounded-lg border transition-all duration-200 hover:scale-105"
            style={{ borderColor: 'var(--gh-border)', color: 'var(--gh-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gh-green)'; e.currentTarget.style.color = 'var(--gh-green)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--gh-border)'; e.currentTarget.style.color = 'var(--gh-muted)'; }}
          >
            <Mail className="w-5 h-5" />
          </a>
        )}
        {config.resumeUrl && (
          <a
            href={config.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--gh-blue), var(--gh-purple))', color: '#fff' }}
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
    <div className="scroll-progress" style={{ width: \`\${progress}%\` }} />
    </>
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
                className="relative block p-4 rounded-xl border transition-all duration-200 group hover:scale-[1.02]"
                style={{ borderColor: 'var(--gh-border)', background: 'var(--gh-surface)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="lang-line" style={{ background: languageColors[project.language] || '#6b7280' }} />
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-mono text-sm font-semibold truncate" style={{ color: 'var(--gh-blue)' }}>
                    {project.name}
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" style={{ color: 'var(--gh-muted)' }} />
                </div>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--gh-muted)' }}>
                  {desc}
                </p>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--gh-muted)' }}>
                  <span className="flex items-center gap-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          languageColors[project.language] || '#6b7280',
                      }}
                    />
                    <span className="font-mono">{project.language}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" style={{ color: 'var(--gh-orange)' }} />
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
    { path: 'src/components/animated-reveal.tsx', content: animatedReveal },
    { path: 'src/components/section-wrapper.tsx', content: sectionWrapper },
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
