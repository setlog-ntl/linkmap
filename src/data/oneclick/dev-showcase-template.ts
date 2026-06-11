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
  makePackageLock,
} from './shared-template-files';

const packageJson = makePackageJson('dev-showcase');
const packageLock = makePackageLock('dev-showcase');

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
          background: '#0d1117',
          fontFamily: 'monospace, sans-serif',
        }}
      >
        <div style={{ fontSize: 20, color: '#7ee787', marginBottom: 16 }}>
          $ whoami
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #58a6ff, #d2a8ff)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#7d8590',
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
  --font-mono: 'JetBrains Mono', 'Consolas', 'Monaco', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
  --color-primary: #58a6ff;
}

/* ── Base Design Tokens ── */
:root {
  /* Semantic color tokens (GitHub Dark default) */
  --brand-primary: #58a6ff;
  --brand-secondary: #d2a8ff;
  --accent: #7ee787;
  --bg: #0d1117;
  --bg-card: #161b22;
  --bg-card-hover: #1c2128;
  --border: #30363d;
  --border-light: #21262d;
  --text: #e6edf3;
  --text-muted: #7d8590;
  --text-dim: #6e7681;
  --syntax-keyword: #ff7b72;
  --syntax-string: #a5d6ff;
  --syntax-number: #ffa657;
  --syntax-type: #79c0ff;
  --syntax-comment: #8b949e;
  --syntax-prop: #7ee787;

  /* Layout */
  --section-gap: clamp(4rem, 8vw, 7rem);
  --radius: 8px;
  --radius-lg: 12px;
  --transition: 0.22s cubic-bezier(0.4, 0, 0.2, 1);

  /* Legacy compat */
  --gh-bg: #0d1117;
  --gh-surface: #161b22;
  --gh-border: #30363d;
  --gh-blue: #58a6ff;
  --gh-green: #7ee787;
  --gh-purple: #d2a8ff;
  --gh-orange: #d29922;
  --gh-text: #e6edf3;
  --gh-muted: #7d8590;
  --surface-elevated: #161b22;
  --surface-sunken: #0d1117;
  --surface-border: #30363d;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.25);
  --shadow-card-hover: 0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}

/* ── Preset: VS Code Dark ── */
[data-preset="vscode"] {
  --brand-primary: #569cd6;
  --brand-secondary: #c586c0;
  --accent: #6a9955;
  --bg: #1e1e1e;
  --bg-card: #252526;
  --bg-card-hover: #2d2d2d;
  --border: #3c3c3c;
  --border-light: #333333;
  --text: #d4d4d4;
  --text-muted: #808080;
  --text-dim: #6a6a6a;
  --syntax-keyword: #569cd6;
  --syntax-string: #ce9178;
  --syntax-number: #b5cea8;
  --syntax-type: #4ec9b0;
  --syntax-comment: #6a9955;
  --syntax-prop: #9cdcfe;
  --gh-bg: #1e1e1e;
  --gh-surface: #252526;
  --gh-border: #3c3c3c;
  --gh-blue: #569cd6;
  --gh-green: #6a9955;
  --gh-purple: #c586c0;
  --gh-orange: #ce9178;
  --gh-text: #d4d4d4;
  --gh-muted: #808080;
  --surface-elevated: #252526;
  --surface-sunken: #1e1e1e;
  --surface-border: #3c3c3c;
}

/* ── Preset: Dracula ── */
[data-preset="dracula"] {
  --brand-primary: #8be9fd;
  --brand-secondary: #ff79c6;
  --accent: #50fa7b;
  --bg: #282a36;
  --bg-card: #343746;
  --bg-card-hover: #3d4059;
  --border: #44475a;
  --border-light: #373a4d;
  --text: #f8f8f2;
  --text-muted: #6272a4;
  --text-dim: #4d5368;
  --syntax-keyword: #ff79c6;
  --syntax-string: #f1fa8c;
  --syntax-number: #bd93f9;
  --syntax-type: #8be9fd;
  --syntax-comment: #6272a4;
  --syntax-prop: #50fa7b;
  --gh-bg: #282a36;
  --gh-surface: #343746;
  --gh-border: #44475a;
  --gh-blue: #8be9fd;
  --gh-green: #50fa7b;
  --gh-purple: #ff79c6;
  --gh-orange: #ffb86c;
  --gh-text: #f8f8f2;
  --gh-muted: #6272a4;
  --surface-elevated: #343746;
  --surface-sunken: #282a36;
  --surface-border: #44475a;
}

/* ── Light theme override ── */
[data-theme="light"] {
  --bg: #f6f8fa;
  --bg-card: #ffffff;
  --bg-card-hover: #f0f3f6;
  --border: #d0d7de;
  --border-light: #e8ecf0;
  --text: #1f2328;
  --text-muted: #57606a;
  --text-dim: #6e7781;
  --syntax-keyword: #cf222e;
  --syntax-string: #0a3069;
  --syntax-number: #953800;
  --syntax-type: #0550ae;
  --syntax-comment: #6e7781;
  --syntax-prop: #116329;
  --gh-bg: #f6f8fa;
  --gh-surface: #ffffff;
  --gh-border: #d0d7de;
  --gh-text: #1f2328;
  --gh-muted: #57606a;
  --surface-elevated: #ffffff;
  --surface-sunken: #f6f8fa;
  --surface-border: #d0d7de;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  background: var(--bg);
  color: var(--text);
  line-height: 1.7;
  min-height: 100vh;
  transition: background var(--transition), color var(--transition);
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .cursor-blink { animation: none !important; opacity: 1; }
}

/* ── Section title — code comment style ── */
.section-heading {
  font-family: var(--font-mono), 'Consolas', 'Monaco', monospace;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  letter-spacing: 0.04em;
}
.section-heading::before {
  content: '//';
  color: var(--syntax-comment);
  font-style: italic;
}
.section-heading::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-light);
  margin-left: 0.5rem;
}

/* ── Editor window (Hero) ── */
.editor-window {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card-hover);
}

.editor-tab-bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1rem;
  background: color-mix(in srgb, var(--bg-card) 60%, var(--bg));
  border-bottom: 1px solid var(--border-light);
}

.traffic-lights {
  display: flex;
  gap: 6px;
  margin-right: 0.75rem;
}
.tl { width: 12px; height: 12px; border-radius: 50%; }
.tl-red    { background: #ff5f57; }
.tl-yellow { background: #febc2e; }
.tl-green  { background: #28c840; }

.editor-tab {
  font-family: var(--font-mono), monospace;
  font-size: 0.75rem;
  padding: 0.2rem 0.75rem;
  border-radius: 4px;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid transparent;
}
.editor-tab.active {
  color: var(--text);
  background: var(--bg);
  border-color: var(--border-light);
}

.editor-body {
  padding: 1.25rem 0;
  font-family: var(--font-mono), 'Consolas', 'Monaco', monospace;
  font-size: 0.92rem;
  line-height: 1.75rem;
}

.code-line {
  display: flex;
  align-items: baseline;
  padding: 0 1.25rem;
}

.ln {
  user-select: none;
  min-width: 2rem;
  color: var(--syntax-comment);
  font-size: 0.78rem;
  text-align: right;
  padding-right: 1.25rem;
  flex-shrink: 0;
  border-right: 1px solid var(--border-light);
  margin-right: 1.25rem;
  line-height: inherit;
}

.code-content { flex: 1; }

/* Syntax tokens */
.t-kw  { color: var(--syntax-keyword); }
.t-str { color: var(--syntax-string); }
.t-num { color: var(--syntax-number); }
.t-typ { color: var(--syntax-type); }
.t-prp { color: var(--syntax-prop); }
.t-cmt { color: var(--syntax-comment); font-style: italic; }
.t-pun { color: var(--text-dim); }
.t-acc { color: var(--accent); }

/* Cursor blink */
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.cursor-blink {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: var(--brand-primary);
  vertical-align: text-bottom;
  animation: blink-cursor 1s step-end infinite;
}
.typing-cursor::after {
  content: '|';
  animation: blink-cursor 1s step-end infinite;
  color: var(--accent);
}

/* Terminal prompt line */
.terminal-line {
  display: flex;
  align-items: baseline;
  padding: 0.35rem 1.25rem;
  border-top: 1px solid var(--border-light);
  margin-top: 0.5rem;
  font-family: var(--font-mono), monospace;
  font-size: 0.88rem;
  gap: 0.5rem;
}
.terminal-prompt { color: var(--accent); }
.terminal-text   { color: var(--text); }

/* Hero CTA buttons */
.hero-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1.25rem 1.25rem 1.25rem;
  border-top: 1px solid var(--border-light);
}

.ds-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  border-radius: 6px;
  font-family: system-ui, sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--transition);
}
.ds-btn-primary {
  background: var(--brand-primary);
  color: #fff;
  border-color: var(--brand-primary);
}
.ds-btn-primary:hover {
  background: color-mix(in srgb, var(--brand-primary) 85%, white);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 25%, transparent);
}
.ds-btn-secondary {
  background: transparent;
  color: var(--text);
  border-color: var(--border);
}
.ds-btn-secondary:hover {
  background: var(--bg-card-hover);
  border-color: var(--brand-secondary);
  color: var(--brand-secondary);
}

/* ── Project card ── */
.project-card-ds {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-top: 3px solid transparent;
  border-radius: var(--radius);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  text-decoration: none;
  color: inherit;
  transition: border-top-color var(--transition), box-shadow var(--transition), background var(--transition);
}
.project-card-ds:hover {
  border-top-color: var(--brand-primary);
  background: var(--bg-card-hover);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}

/* ── Timeline ── */
.ds-timeline {
  position: relative;
  padding-left: 1.75rem;
}
.ds-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.4rem;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--brand-primary), var(--brand-secondary) 60%, transparent);
  border-radius: 1px;
}
.ds-timeline-item {
  position: relative;
  padding-bottom: 2.5rem;
}
.ds-timeline-item:last-child { padding-bottom: 0; }
.ds-timeline-dot {
  position: absolute;
  left: -2rem;
  top: 0.35rem;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--brand-primary);
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 2px var(--brand-primary);
  transition: transform var(--transition);
}
.ds-timeline-item:hover .ds-timeline-dot {
  transform: scale(1.35);
  background: var(--brand-secondary);
  box-shadow: 0 0 0 2px var(--brand-secondary);
}
.ds-period-badge {
  display: inline-block;
  font-family: var(--font-mono), monospace;
  font-size: 0.75rem;
  color: var(--text-dim);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 0.15rem 0.55rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

/* ── Blog card ── */
.blog-card-ds {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-decoration: none;
  color: inherit;
  transition: border-color var(--transition), background var(--transition);
}
.blog-card-ds:hover {
  border-color: var(--brand-secondary);
  background: var(--bg-card-hover);
}

/* ── Contact link ── */
.contact-link-ds {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-decoration: none;
  color: var(--text);
  font-size: 0.9rem;
  transition: all var(--transition);
}
.contact-link-ds:hover {
  border-color: var(--brand-primary);
  background: var(--bg-card-hover);
  color: var(--brand-primary);
  transform: translateX(4px);
}

/* ── Skill bar ── */
.skill-bar-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--brand-primary), var(--brand-secondary));
  width: 0%;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.skill-bar-fill.animate {
  /* width is set via JS/style prop */
}
@media (prefers-reduced-motion: reduce) {
  .skill-bar-fill { transition: none; }
}

/* ── Lang dot (project card) ── */
.repo-lang-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* ── Reveal animation ── */
.reveal-fade {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.reveal-fade.revealed {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .reveal-fade { opacity: 1; transform: none; transition: none; }
}

/* ── Scroll progress bar ── */
.scroll-progress {
  position: fixed;
  top: 52px;
  left: 0;
  height: 2px;
  background: var(--brand-primary);
  z-index: 100;
  transition: width 0.1s linear;
  pointer-events: none;
}

/* ── Card lift ── */
.card-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
.card-lift:hover { transform: translateY(-2px); box-shadow: var(--shadow-card-hover); }
@media (prefers-reduced-motion: reduce) {
  .card-lift:hover { transform: none; }
}

/* ── Hover glow ── */
.hover-glow { transition: box-shadow 0.3s ease; }
.hover-glow:hover {
  box-shadow: 0 0 20px color-mix(in srgb, var(--brand-primary) 25%, transparent),
              0 0 40px color-mix(in srgb, var(--brand-primary) 8%, transparent);
}

/* ── GitHub contribution graph wrapper ── */
.github-graph-wrap {
  border-radius: var(--radius-lg);
  padding: 1rem;
  overflow-x: auto;
  border: 1px solid var(--border);
  background: var(--bg-card);
}

*:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}

@media (max-width: 480px) {
  .hero-actions { flex-direction: column; }
  .ds-btn { width: 100%; justify-content: center; }
}
`;

// ──────────────────────────────────────────────
// src/app/layout.tsx
// ──────────────────────────────────────────────
const layoutTsx = `import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { siteConfig } from '@/lib/config';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: \`\${siteConfig.name} — 개발자 포트폴리오\`,
  description: siteConfig.tagline,
  openGraph: {
    title: \`\${siteConfig.name} — 개발자 포트폴리오\`,
    description: siteConfig.tagline,
    type: 'website',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
    title: \`\${siteConfig.name} — 개발자 포트폴리오\`,
    description: siteConfig.tagline,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const preset = siteConfig.designPreset || 'github-dark';
  return (
    <html
      lang="ko"
      data-preset={preset}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* Inline theme init — prevents FOUC */}
        <script dangerouslySetInnerHTML={{ __html: \`(function(){try{var t=localStorage.getItem('ds-theme');if(t){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})()\` }} />
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
      <body className={\`antialiased \${jetbrainsMono.variable}\`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:shadow-lg focus:text-sm"
        >
          본문으로 바로가기
        </a>
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
      <main id="main">
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
// src/components/nav-header.tsx
// ──────────────────────────────────────────────
const navHeader = `'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/lib/i18n';
import { LanguageToggle } from './language-toggle';
import { siteConfig } from '@/lib/config';

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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { t } = useLocale();

  useEffect(() => {
    // Read persisted theme
    try {
      const saved = localStorage.getItem('ds-theme');
      if (saved === 'light') setTheme('light');
    } catch (_) {}

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
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

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('ds-theme', next); } catch (_) {}
  };

  const slug = (siteConfig.nameEn || siteConfig.name).toLowerCase().replace(/\\s+/g, '-');

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-[52px]"
        style={{
          background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        {/* Logo */}
        <div
          className="font-mono text-sm"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.02em' }}
        >
          <span style={{ color: 'var(--brand-primary)' }}>~/</span>
          {slug}
        </div>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-0.5">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={\`#\${id}\`}
              className="text-xs px-3 py-1.5 rounded-md transition-colors"
              style={{
                color: active === id ? 'var(--text)' : 'var(--text-muted)',
                background: active === id ? 'var(--bg-card)' : 'transparent',
              }}
            >
              {t(sectionKeys[id])}
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
            className="text-sm px-2.5 py-1.5 rounded-md transition-all"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              background: 'none',
              cursor: 'pointer',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--brand-primary)';
              e.currentTarget.style.color = 'var(--brand-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </header>

      {/* Scroll progress */}
      <div className="scroll-progress" style={{ width: \`\${progress}%\` }} />
    </>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/hero-section.tsx
// ──────────────────────────────────────────────
const heroSection = `'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';
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
    const current = texts[s.textIndex] ?? '';

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

  if (typeof window !== 'undefined' && !startedRef.current) {
    startedRef.current = true;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      stateRef.current.displayed = texts[0] ?? '';
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
  const nameEn = config.nameEn || config.name;
  const taglineRaw = locale === 'en' && config.taglineEn ? config.taglineEn : config.tagline;

  const taglines = taglineRaw.includes('|')
    ? taglineRaw.split('|').map((s) => s.trim())
    : [taglineRaw];
  const typed = useTypingAnimation(taglines);

  const slug = nameEn.toLowerCase().replace(/\\s+/g, '-');

  // Build the stack array from skills names (up to 4)
  const stack = config.skills.slice(0, 4).map((s) => s.name);

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-[52px]"
      style={{ background: 'var(--bg)' }}
    >
      <div className="w-full max-w-2xl editor-window">
        {/* Tab bar */}
        <div className="editor-tab-bar">
          <div className="traffic-lights">
            <div className="tl tl-red" />
            <div className="tl tl-yellow" />
            <div className="tl tl-green" />
          </div>
          <div className="editor-tab active">developer.ts</div>
          <div className="editor-tab">README.md</div>
        </div>

        {/* Code body */}
        <div className="editor-body">
          <div className="code-line">
            <div className="ln">1</div>
            <div className="code-content">
              <span className="t-kw">const</span>
              <span> developer </span>
              <span className="t-pun">= &#123;</span>
            </div>
          </div>
          <div className="code-line">
            <div className="ln">2</div>
            <div className="code-content">
              &nbsp;&nbsp;<span className="t-prp">name</span><span className="t-pun">:</span>
              <span className="t-str"> &quot;{name}&quot;</span><span className="t-pun">,</span>
            </div>
          </div>
          {nameEn !== name && (
            <div className="code-line">
              <div className="ln">3</div>
              <div className="code-content">
                &nbsp;&nbsp;<span className="t-prp">nameEn</span><span className="t-pun">:</span>
                <span className="t-str"> &quot;{nameEn}&quot;</span><span className="t-pun">,</span>
              </div>
            </div>
          )}
          <div className="code-line">
            <div className="ln">{nameEn !== name ? '4' : '3'}</div>
            <div className="code-content">
              &nbsp;&nbsp;<span className="t-prp">role</span><span className="t-pun">:</span>
              <span className="t-str"> &quot;{taglines[0]}&quot;</span><span className="t-pun">,</span>
            </div>
          </div>
          {stack.length > 0 && (
            <div className="code-line">
              <div className="ln">{nameEn !== name ? '5' : '4'}</div>
              <div className="code-content">
                &nbsp;&nbsp;<span className="t-prp">stack</span><span className="t-pun">: [</span>
                {stack.map((s, i) => (
                  <span key={s}>
                    <span className="t-str">&quot;{s}&quot;</span>
                    {i < stack.length - 1 && <span className="t-pun">, </span>}
                  </span>
                ))}
                <span className="t-pun">],</span>
              </div>
            </div>
          )}
          <div className="code-line">
            <div className="ln">{nameEn !== name ? '6' : '5'}</div>
            <div className="code-content">
              &nbsp;&nbsp;<span className="t-prp">available</span><span className="t-pun">:</span>
              <span className="t-acc"> true</span>
              <span className="cursor-blink" aria-hidden="true" />
              <span className="t-pun">,</span>
            </div>
          </div>
          <div className="code-line">
            <div className="ln">{nameEn !== name ? '7' : '6'}</div>
            <div className="code-content">
              <span className="t-pun">&#125;</span>
            </div>
          </div>
        </div>

        {/* Terminal prompt */}
        <div className="terminal-line">
          <span className="terminal-prompt" aria-hidden="true">&#9655;</span>
          <span className="terminal-text font-mono text-sm">
            {typed}
            <span className="typing-cursor ml-0.5" aria-hidden="true" />
          </span>
        </div>

        {/* CTA */}
        <div className="hero-actions">
          {config.email && (
            <a href="#contact" className="ds-btn ds-btn-primary">
              {t('contact.cta')}
            </a>
          )}
          {config.githubUsername && (
            <a
              href={\`https://github.com/\${config.githubUsername}\`}
              target="_blank"
              rel="noopener noreferrer"
              className="ds-btn ds-btn-secondary"
            >
              GitHub
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          )}
          {config.resumeUrl && (
            <a
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ds-btn ds-btn-secondary"
            >
              {t('hero.resume')}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/about-section.tsx
// ──────────────────────────────────────────────
const aboutSection = `'use client';

import { useEffect, useRef } from 'react';
import { AnimatedReveal } from './animated-reveal';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

export function AboutSection({ config }: Props) {
  const { locale, t } = useLocale();
  const about = locale === 'en' && config.aboutEn ? config.aboutEn : config.about;
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.querySelectorAll<HTMLElement>('.skill-bar-fill').forEach((bar) => {
              const level = bar.getAttribute('data-level') ?? '0';
              bar.style.width = \`\${level}%\`;
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="px-4 sm:px-6" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)' }}>
      <div className="max-w-4xl mx-auto">
        <AnimatedReveal>
          <div className="section-heading">{t('about.title')}</div>
        </AnimatedReveal>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Bio */}
          <AnimatedReveal>
            <p
              className="text-sm leading-[1.8] whitespace-pre-line"
              style={{ color: 'var(--text-muted)' }}
            >
              {about}
            </p>
          </AnimatedReveal>

          {/* Skills */}
          <AnimatedReveal delay={100}>
            <div ref={skillsRef} className="flex flex-col gap-4">
              <h3
                className="font-mono text-sm font-semibold mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                {t('about.skills')}
              </h3>
              {config.skills.map((skill, i) => {
                const pct = typeof skill.level === 'number'
                  ? skill.level
                  : skill.level === 'advanced' ? 90 : skill.level === 'intermediate' ? 65 : 35;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-sm font-medium" style={{ color: 'var(--text)' }}>
                        {skill.name}
                      </span>
                      <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-light)' }}>
                      <div
                        className="skill-bar-fill"
                        data-level={pct}
                        style={{ animationDelay: \`\${i * 80}ms\` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/projects-section.tsx
// ──────────────────────────────────────────────
const projectsSection = `'use client';

import { AnimatedReveal } from './animated-reveal';
import { Star, GitFork } from 'lucide-react';
import type { ProjectItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Dart: '#00B4AB',
  Ruby: '#701516',
  PHP: '#4F5D95',
  'C++': '#f34b7d',
  'C#': '#178600',
  Dockerfile: '#384d54',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};

// GitHub-style repo book icon
const RepoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
  </svg>
);

interface Props {
  projects: ProjectItem[];
}

export function ProjectsSection({ projects }: Props) {
  const { locale, t } = useLocale();

  return (
    <section id="projects" className="px-4 sm:px-6" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)' }}>
      <div className="max-w-4xl mx-auto">
        <AnimatedReveal>
          <div className="section-heading">{t('projects.title')}</div>
        </AnimatedReveal>

        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((project, i) => {
            const desc = locale === 'en' && project.descriptionEn
              ? project.descriptionEn
              : project.description;
            const langColor = LANG_COLORS[project.language] ?? '#6b7280';
            return (
              <AnimatedReveal key={i} delay={i * 60}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-ds hover-glow"
                >
                  {/* Name */}
                  <div
                    className="flex items-center gap-2 font-mono text-sm font-semibold"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    <RepoIcon />
                    {project.name}
                  </div>

                  {/* Description */}
                  <p
                    className="text-xs leading-relaxed line-clamp-2 flex-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {desc}
                  </p>

                  {/* Meta */}
                  <div
                    className="flex items-center gap-3 text-xs font-mono"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className="repo-lang-dot"
                        style={{ backgroundColor: langColor }}
                      />
                      <span style={{ color: 'var(--text-muted)' }}>{project.language}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" style={{ color: 'var(--gh-orange)' }} />
                      {project.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5" />
                      {project.forks}
                    </span>
                  </div>
                </a>
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
// src/components/experience-timeline.tsx
// ──────────────────────────────────────────────
const experienceTimeline = `'use client';

import { AnimatedReveal } from './animated-reveal';
import type { ExperienceItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  experience: ExperienceItem[];
}

export function ExperienceTimeline({ experience }: Props) {
  const { locale, t } = useLocale();

  return (
    <section id="experience" className="px-4 sm:px-6" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)' }}>
      <div className="max-w-4xl mx-auto">
        <AnimatedReveal>
          <div className="section-heading">{t('experience.title')}</div>
        </AnimatedReveal>

        <div className="ds-timeline">
          {experience.map((item, i) => {
            const title = locale === 'en' && item.titleEn ? item.titleEn : item.title;
            const company = locale === 'en' && item.companyEn ? item.companyEn : item.company;
            const period = locale === 'en' && item.periodEn ? item.periodEn : item.period;
            const description = locale === 'en' && item.descriptionEn ? item.descriptionEn : item.description;

            return (
              <AnimatedReveal key={i} delay={i * 80}>
                <div className="ds-timeline-item">
                  <div className="ds-timeline-dot" />
                  <div className="ds-period-badge">{period}</div>
                  <h3 className="text-base font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
                    {title}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--brand-primary)' }}>
                    {company}
                  </p>
                  {description && (
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {description}
                    </p>
                  )}
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
// src/components/blog-section.tsx
// ──────────────────────────────────────────────
const blogSection = `'use client';

import { AnimatedReveal } from './animated-reveal';
import type { BlogPost } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  posts: BlogPost[];
}

export function BlogSection({ posts }: Props) {
  const { locale, t } = useLocale();

  return (
    <section id="blog" className="px-4 sm:px-6" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)' }}>
      <div className="max-w-4xl mx-auto">
        <AnimatedReveal>
          <div className="section-heading">{t('blog.title')}</div>
        </AnimatedReveal>

        <div className="flex flex-col gap-3">
          {posts.map((post, i) => {
            const title = locale === 'en' && post.titleEn ? post.titleEn : post.title;
            return (
              <AnimatedReveal key={i} delay={i * 50}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-card-ds group"
                >
                  <span
                    className="text-sm font-medium flex-1 min-w-0 truncate transition-colors group-hover:text-[var(--brand-secondary)]"
                    style={{ color: 'var(--text)' }}
                  >
                    {title}
                  </span>
                  <span
                    className="font-mono text-xs shrink-0"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    {post.date}
                  </span>
                  <span
                    className="text-sm shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: 'var(--text-dim)' }}
                    aria-hidden="true"
                  >
                    &#x2197;
                  </span>
                </a>
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

import { AnimatedReveal } from './animated-reveal';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

// GitHub SVG
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// LinkedIn SVG
const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// Email SVG
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

interface Props {
  config: SiteConfig;
}

export function ContactSection({ config }: Props) {
  const { t } = useLocale();

  const links: Array<{
    href: string;
    icon: React.ReactNode;
    label: string;
    value: string;
    external?: boolean;
  }> = [];

  if (config.email) {
    links.push({
      href: \`mailto:\${config.email}\`,
      icon: <MailIcon />,
      label: 'Email',
      value: config.email,
    });
  }
  if (config.githubUsername) {
    links.push({
      href: \`https://github.com/\${config.githubUsername}\`,
      icon: <GithubIcon />,
      label: 'GitHub',
      value: \`github.com/\${config.githubUsername}\`,
      external: true,
    });
  }
  if (config.linkedinUrl) {
    const linkedinValue = config.linkedinUrl.replace(/^https?:\\/\\//, '').replace(/\\/$/, '');
    links.push({
      href: config.linkedinUrl,
      icon: <LinkedinIcon />,
      label: 'LinkedIn',
      value: linkedinValue,
      external: true,
    });
  }

  return (
    <section
      id="contact"
      className="px-4 sm:px-6"
      style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'calc(var(--section-gap) * 1.5)' }}
    >
      <div className="max-w-4xl mx-auto">
        <AnimatedReveal>
          <div className="section-heading">{t('contact.title')}</div>
        </AnimatedReveal>

        <AnimatedReveal delay={60}>
          <p className="text-sm mb-8 max-w-[480px]" style={{ color: 'var(--text-muted)' }}>
            {t('contact.desc')}
          </p>
        </AnimatedReveal>

        <div className="flex flex-col gap-3 max-w-[420px]">
          {links.map((link, i) => (
            <AnimatedReveal key={link.label} delay={i * 70 + 120}>
              <a
                href={link.href}
                className="contact-link-ds"
                {...(link.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <span className="w-[1.5rem] text-center shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {link.icon}
                </span>
                <span className="font-medium">{link.label}</span>
                <span
                  className="font-mono text-xs ml-auto"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {link.value}
                </span>
              </a>
            </AnimatedReveal>
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
const footerComponent = `import { siteConfig } from '@/lib/config';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="px-4 py-6 text-center font-mono text-xs"
      style={{ borderTop: '1px solid var(--border-light)', color: 'var(--text-dim)' }}
    >
      built with{' '}
      <a
        href="https://www.linkmap.biz/sites?utm_source=badge&utm_medium=referral&utm_campaign=dev-showcase"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'var(--brand-primary)' }}
        className="hover:underline"
      >
        linkmap
      </a>
      {' \u00b7 '}
      &copy; {year} {siteConfig.name}
    </footer>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/github-graph.tsx
// ──────────────────────────────────────────────
const githubGraph = `'use client';

import { AnimatedReveal } from './animated-reveal';
import { useLocale } from '@/lib/i18n';

interface Props {
  username: string;
}

export function GithubGraph({ username }: Props) {
  const { t } = useLocale();

  return (
    <section className="px-4 sm:px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <AnimatedReveal>
          <div className="github-graph-wrap">
            <img
              src={\`https://ghchart.rshah.org/58a6ff/\${username}\`}
              alt={\`\${username} \${t('github.alt')}\`}
              className="w-full max-w-full"
              loading="lazy"
            />
          </div>
        </AnimatedReveal>
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
  /** numeric 0-100 OR legacy string level */
  level: number | 'beginner' | 'intermediate' | 'advanced';
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
  { name: 'TypeScript', level: 90 },
  { name: 'React',      level: 85 },
  { name: 'Next.js',    level: 80 },
  { name: 'Node.js',    level: 70 },
  { name: 'Python',     level: 65 },
  { name: 'Docker',     level: 60 },
  { name: 'PostgreSQL', level: 60 },
  { name: 'AWS',        level: 50 },
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
  email: process.env.NEXT_PUBLIC_EMAIL || 'dev@example.com',
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com',
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com',
  typingWords: process.env.NEXT_PUBLIC_TYPING_WORDS || 'Full-stack Developer\\nOpen Source Contributor\\nTypeScript Enthusiast',
  maxRepos: 6,
  designPreset: (process.env.NEXT_PUBLIC_DESIGN_PRESET || 'github-dark') as 'github-dark' | 'vscode' | 'dracula',
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
  fork: boolean;
  archived: boolean;
}

export async function fetchGitHubRepos(
  username: string,
  maxRepos = 6
): Promise<ProjectItem[]> {
  try {
    const res = await fetch(
      \`https://api.github.com/users/\${username}/repos?sort=stars&per_page=\${Math.min(maxRepos, 30)}&type=owner\`,
      {
        cache: 'force-cache',
        headers: { Accept: 'application/vnd.github.v3+json' },
      }
    );
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();
    return repos
      .filter((r) => !r.fork && !r.archived)
      .slice(0, maxRepos)
      .map((repo) => ({
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

import { useSyncExternalStore } from 'react';

export type Locale = 'ko' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  ko: {
    'nav.home': '홈',
    'nav.about': '소개',
    'nav.projects': '프로젝트',
    'nav.experience': '경력',
    'nav.blog': '블로그',
    'nav.contact': '연락처',
    'hero.resume': '이력서 보기',
    'contact.cta': '연락하기',
    'about.title': 'about',
    'about.skills': 'skills',
    'projects.title': 'projects',
    'experience.title': 'experience',
    'blog.title': 'blog',
    'contact.title': 'contact',
    'contact.desc': '새 프로젝트, 협업 제안, 또는 그냥 안녕 인사도 환영합니다.',
    'contact.email': '이메일 보내기',
    'github.alt': 'GitHub 기여 그래프',
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
    'lang.switchLabel': 'Switch to English',
    'lang.toggle': 'EN',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'hero.resume': 'View Resume',
    'contact.cta': 'Contact Me',
    'about.title': 'about',
    'about.skills': 'skills',
    'projects.title': 'projects',
    'experience.title': 'experience',
    'blog.title': 'blog',
    'contact.title': 'contact',
    'contact.desc': 'Open to new projects, collaborations, or just a friendly hello.',
    'contact.email': 'Send Email',
    'github.alt': 'GitHub Contribution Graph',
    'theme.light': 'Switch to light mode',
    'theme.dark': 'Switch to dark mode',
    'lang.switchLabel': '한국어로 전환',
    'lang.toggle': 'KO',
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
export const devShowcaseTemplate: HomepageTemplateContent = {
  slug: 'dev-showcase',
  repoName: 'dev-showcase',
  description: '개발자 포트폴리오 - Linkmap으로 생성',
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
