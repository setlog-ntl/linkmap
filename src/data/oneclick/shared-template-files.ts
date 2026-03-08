// ──────────────────────────────────────────────
// Shared template files — 모든 원클릭 템플릿에서 공통 사용
// deploy.yml, tsconfig, postcss, next.config, 공통 컴포넌트
// ──────────────────────────────────────────────

// ──────────────────────────────────────────────
// Build / Config Files
// ──────────────────────────────────────────────

export const sharedGitignore = `# dependencies
node_modules/
.pnp
.pnp.js

# next.js
.next/
out/

# production
build/
dist/

# misc
.DS_Store
*.pem
*.tsbuildinfo
next-env.d.ts

# env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
`;

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
      - run: npm install
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

/** 템플릿별 name만 바꿔서 package.json 생성 */
export function makePackageJson(name: string): string {
  const deps: Record<string, string> = {
    next: '15.1.0',
    react: '19.0.0',
    'react-dom': '19.0.0',
    'lucide-react': '0.468.0',
  };

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
        '@types/node': '22.0.0',
        '@types/react': '19.0.0',
        '@types/react-dom': '19.0.0',
        typescript: '5.7.2',
        tailwindcss: '4.0.17',
        '@tailwindcss/postcss': '4.0.17',
        postcss: '8.5.0',
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

type RevealVariant = 'fade' | 'slide-left' | 'slide-right' | 'scale';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}

export function AnimatedReveal({ children, className = '', delay = 0, variant = 'fade' }: Props) {
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

  const variantClass = variant === 'fade' ? 'reveal-fade'
    : variant === 'slide-left' ? 'reveal-slide-left'
    : variant === 'slide-right' ? 'reveal-slide-right'
    : 'reveal-scale';

  return (
    <div ref={ref} className={\`\${variantClass} \${visible ? 'revealed' : ''} \${className}\`}>
      {children}
    </div>
  );
}
`;

export const sharedSectionWrapper = `import type { ReactNode } from 'react';
import { AnimatedReveal } from './animated-reveal';

type RevealVariant = 'fade' | 'slide-left' | 'slide-right' | 'scale';

interface Props {
  id?: string;
  ariaLabel?: string;
  className?: string;
  animate?: boolean;
  delay?: number;
  variant?: RevealVariant;
  children: ReactNode;
}

export function SectionWrapper({
  id,
  ariaLabel,
  className = '',
  animate = true,
  delay = 0,
  variant = 'fade',
  children,
}: Props) {
  const section = (
    <section id={id} aria-label={ariaLabel} className={\`section-gap px-[var(--section-padding-x,1rem)] \${className}\`}>
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  );

  if (!animate) return section;
  return <AnimatedReveal delay={delay} variant={variant}>{section}</AnimatedReveal>;
}
`;

/** 인라인 테마 스크립트 — layout.tsx <head>에 dangerouslySetInnerHTML로 삽입 */
export const sharedThemeScript = `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}})()`;

export const sharedThemeToggle = `'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8" />;

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-full transition-colors duration-200 text-gray-500 hover:text-gray-300"
      aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {dark ? (
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
  const { locale, setLocale, t } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-gray-400 hover:text-white transition-colors"
      aria-label={t('lang.switchLabel')}
    >
      <Globe className="w-3.5 h-3.5" />
      {t('lang.toggle')}
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
  const href = platform.toLowerCase() === 'email' ? \`mailto:\${url}\` : url;
  const label = platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <a
      href={href}
      target={platform.toLowerCase() === 'email' ? undefined : '_blank'}
      rel="noopener noreferrer"
      className={\`inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-white transition-colors \${className}\`}
      aria-label={\`\${label} 방문\`}
    >
      <Icon style={{ width: size, height: size }} />
    </a>
  );
}
`;

export const sharedSectionHeading = `import { AnimatedReveal } from './animated-reveal';

interface Props {
  title: string;
  subtitle?: string;
  gradient?: string;
  useGradient?: boolean;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  gradient = 'from-white to-gray-400',
  useGradient = false,
  className = '',
}: Props) {
  return (
    <AnimatedReveal className={\`text-center mb-12 \${className}\`}>
      <h2
        className={\`text-3xl sm:text-4xl font-bold \${
          useGradient
            ? \`bg-gradient-to-r \${gradient} bg-clip-text text-transparent\`
            : 'text-gray-900 dark:text-gray-100'
        }\`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// Premium Components (2026 고도화)
// ──────────────────────────────────────────────

/** CountUp 애니메이션 — 숫자가 0에서 목표값까지 올라가는 효과 */
export const sharedCountUp = `'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({ end, suffix = '', prefix = '', duration = 2000, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setCount(end); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, started]);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
`;

/** RotatingText — 텍스트가 순환하며 바뀌는 Kinetic Typography 효과 */
export const sharedRotatingText = `'use client';

import { useState, useEffect } from 'react';

interface Props {
  words: string[];
  interval?: number;
  className?: string;
}

export function RotatingText({ words, interval = 3000, className = '' }: Props) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setFade(true);
      }, 400);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span
      className={\`inline-block transition-all duration-400 \${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} \${className}\`}
    >
      {words[index]}
    </span>
  );
}
`;

/** CardFlip3D — 앞뒤 전환 3D 카드 컴포넌트 */
export const sharedCardFlip3D = `'use client';

import { useState, type ReactNode } from 'react';

interface Props {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export function CardFlip3D({ front, back, className = '' }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={\`card-flip-container cursor-pointer \${className}\`}
      onClick={() => setFlipped(!flipped)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(!flipped); } }}
      tabIndex={0}
      role="button"
      aria-label={flipped ? '앞면 보기' : '뒷면 보기'}
    >
      <div className={\`card-flip-inner \${flipped ? 'card-flipped' : ''}\`}>
        <div className="card-flip-front">{front}</div>
        <div className="card-flip-back">{back}</div>
      </div>
    </div>
  );
}
`;

/** 공유 프리미엄 CSS 애니메이션 — 각 템플릿의 globals.css에 추가 */
export const sharedPremiumAnimations = `/* ── Premium Animations (2026) ── */

/* Card flip 3D */
.card-flip-container {
  perspective: 1200px;
}
.card-flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}
.card-flipped {
  transform: rotateY(180deg);
}
.card-flip-front, .card-flip-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
}
.card-flip-back {
  transform: rotateY(180deg);
}
@media (prefers-reduced-motion: reduce) {
  .card-flip-inner { transition: none; }
}

/* Typing cursor blink */
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.typing-cursor::after {
  content: '|';
  animation: blink-cursor 1s step-end infinite;
  color: var(--color-primary, #3b82f6);
}

/* Gradient text shimmer */
@keyframes shimmer {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
.text-shimmer {
  background-size: 200% auto;
  animation: shimmer 4s linear infinite;
}

/* Marquee scroll */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .animate-marquee { animation: none; }
  .text-shimmer { animation: none; }
  .typing-cursor::after { animation: none; }
}

/* Hover glow effect */
.hover-glow {
  transition: box-shadow 0.3s ease;
}
.hover-glow:hover {
  box-shadow: 0 0 20px color-mix(in oklch, var(--color-primary, #3b82f6) 30%, transparent),
              0 0 40px color-mix(in oklch, var(--color-primary, #3b82f6) 10%, transparent);
}

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .animate-float { animation: none; }
  .hover-glow:hover { box-shadow: none; }
}
`;
