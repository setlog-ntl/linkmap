// ──────────────────────────────────────────────
// Shared template files — 모든 원클릭 템플릿에서 공통 사용
// deploy.yml, tsconfig, postcss, next.config, 공통 컴포넌트
// ──────────────────────────────────────────────

// ──────────────────────────────────────────────
// Build / Config Files
// ──────────────────────────────────────────────

export const sharedDeployYml = `name: Deploy to GitHub Pages
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
          cache: npm
      - run: npm ci
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_REPO_NAME: \${{ github.event.repository.name }}
          NEXT_PUBLIC_BASE_URL: https://\${{ github.repository_owner }}.github.io/\${{ github.event.repository.name }}
      - run: touch out/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
      - id: deployment
        uses: actions/deploy-pages@v4
`;

export const sharedTsconfigJson = `{
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

export const sharedPostcssConfig = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
`;

export const sharedNextConfig = `import type { NextConfig } from 'next';

const repoName = process.env.NEXT_PUBLIC_REPO_NAME || '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: repoName ? \`/\\\${repoName}\` : '',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
`;

/** 템플릿별 name만 바꿔서 package.json 생성 */
export function makePackageJson(
  name: string,
  opts?: { withFramerMotion?: boolean }
): string {
  const deps: Record<string, string> = {
    next: '^15.1.0',
    react: '^19.0.0',
    'react-dom': '^19.0.0',
    'next-themes': '^0.4.4',
    'lucide-react': '^0.468.0',
  };
  if (opts?.withFramerMotion !== false) {
    deps['framer-motion'] = '^12.0.0';
  }

  return JSON.stringify(
    {
      name,
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: deps,
      devDependencies: {
        '@types/node': '^22.0.0',
        '@types/react': '^19.0.0',
        '@types/react-dom': '^19.0.0',
        typescript: '^5.7.0',
        tailwindcss: '^4.0.0',
        '@tailwindcss/postcss': '^4.0.0',
        postcss: '^8.5.0',
      },
    },
    null,
    2
  ) + '\n';
}

// ──────────────────────────────────────────────
// Shared Components
// ──────────────────────────────────────────────

export const sharedAnimatedReveal = `'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedReveal({ children, className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setVisible(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) { setTimeout(() => setVisible(true), delay); }
          else { setVisible(true); }
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={\`reveal-fade \${visible ? 'revealed' : ''} \${className}\`}>
      {children}
    </div>
  );
}
`;

export const sharedSectionWrapper = `import type { ReactNode } from 'react';
import { AnimatedReveal } from './animated-reveal';

interface Props {
  id?: string;
  ariaLabel?: string;
  className?: string;
  animate?: boolean;
  delay?: number;
  children: ReactNode;
}

export function SectionWrapper({
  id,
  ariaLabel,
  className = '',
  animate = true,
  delay = 0,
  children,
}: Props) {
  const section = (
    <section id={id} aria-label={ariaLabel} className={\`py-16 md:py-24 px-4 sm:px-6 \${className}\`}>
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  );

  if (!animate) return section;
  return <AnimatedReveal delay={delay}>{section}</AnimatedReveal>;
}
`;

export const sharedThemeToggle = `'use client';

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

export const sharedLanguageToggle = `'use client';

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

export const sharedSocialIcon = `import { Github, Twitter, Linkedin, Instagram, Youtube, Globe, Mail, type LucideIcon } from 'lucide-react';

const platformIcons: Record<string, LucideIcon> = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
  email: Mail,
};

interface Props {
  platform: string;
  url: string;
  className?: string;
  size?: number;
}

export function SocialIcon({ platform, url, className = '', size = 20 }: Props) {
  const Icon = platformIcons[platform.toLowerCase()] || Globe;
  const href = platform.toLowerCase() === 'email' ? \\\`mailto:\\\${url}\\\` : url;
  const label = platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <a
      href={href}
      target={platform.toLowerCase() === 'email' ? undefined : '_blank'}
      rel="noopener noreferrer"
      className={\\\`inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-white transition-colors \\\${className}\\\`}
      aria-label={\\\`\\\${label} 방문\\\`}
    >
      <Icon style={{ width: size, height: size }} />
    </a>
  );
}
`;

export const sharedSectionHeading = `'use client';

import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n';

interface Props {
  titleKey: string;
  subtitleKey?: string;
  gradient?: string;
  className?: string;
}

export function SectionHeading({
  titleKey,
  subtitleKey,
  gradient = 'from-white to-gray-400',
  className = '',
}: Props) {
  const { t } = useLocale();

  return (
    <div className={\\\`text-center mb-12 \\\${className}\\\`}>
      <motion.h2
        className={\\\`text-3xl sm:text-4xl font-bold bg-gradient-to-r \\\${gradient} bg-clip-text text-transparent\\\`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        {t(titleKey)}
      </motion.h2>
      {subtitleKey && (
        <motion.p
          className="mt-3 text-gray-400 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t(subtitleKey)}
        </motion.p>
      )}
    </div>
  );
}
`;
