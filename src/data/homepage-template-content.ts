/**
 * Homepage template content for one-click deploy.
 * Each template contains the files to be pushed to a new GitHub repo.
 * The setup-templates admin endpoint uses this data to create template repos.
 */

import { devShowcaseTemplate } from './dev-showcase-template';

export interface TemplateFile {
  path: string;
  content: string;
}

export interface HomepageTemplateContent {
  slug: string;
  repoName: string;
  description: string;
  files: TemplateFile[];
}

// ──────────────────────────────────────────────
// GitHub Actions Workflow (shared by MVP templates)
// ──────────────────────────────────────────────
const deployWorkflow = `name: Deploy to GitHub Pages
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
// Shared config files for MVP templates
// ──────────────────────────────────────────────
const sharedTsConfig = `{
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
}`;

const sharedPostcssConfig = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;`;

const sharedNextConfig = `import type { NextConfig } from 'next';

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

export default nextConfig;`;

// ──────────────────────────────────────────────
// 6. Link-in-Bio Pro (MVP)
// ──────────────────────────────────────────────
const linkInBioPackageJson = `{
  "name": "link-in-bio-pro",
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
    "lucide-react": "^0.468.0"
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
}`;

const linkInBioOgRoute = `import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config';
import { getTheme } from '@/lib/themes';

export const dynamic = 'force-static';

export async function GET() {
  const theme = getTheme(siteConfig.theme);

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
          background: \`linear-gradient(135deg, \${theme.backgroundFrom}, \${theme.primary}, \${theme.backgroundTo})\`,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: theme.primary,
            color: '#fff',
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          {siteConfig.siteName.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ fontSize: 48, fontWeight: 700, color: theme.text }}>
          {siteConfig.siteName}
        </div>
        <div
          style={{
            fontSize: 24,
            color: theme.textMuted,
            marginTop: 12,
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          {siteConfig.bio}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}`;

const linkInBioGlobalsCss = `@import "tailwindcss";

@theme {
  --font-sans: 'Pretendard Variable', 'Inter', ui-sans-serif, system-ui, sans-serif;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 15s ease infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-gradient {
    animation: none;
  }
}`;

const linkInBioLayout = `import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { siteConfig } from '@/lib/config';
import { LocaleProvider } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: siteConfig.siteName,
  description: siteConfig.bio,
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.bio,
    type: 'website',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.siteName,
    description: siteConfig.bio,
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
              name: siteConfig.siteName,
              description: siteConfig.bio,
              ...(siteConfig.avatarUrl ? { image: siteConfig.avatarUrl } : {}),
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LocaleProvider>
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}`;

const linkInBioPage = `import { siteConfig } from '@/lib/config';
import { getTheme } from '@/lib/themes';
import { ProfileSection } from '@/components/profile-section';
import { LinkList } from '@/components/link-list';
import { SocialBar } from '@/components/social-bar';
import { ContentEmbed } from '@/components/content-embed';
import { Footer } from '@/components/footer';

export default function Home() {
  const theme = getTheme(siteConfig.theme);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 animate-gradient"
      style={{
        background: \`linear-gradient(135deg, \${theme.backgroundFrom}, \${theme.primary}, \${theme.backgroundTo})\`,
        backgroundSize: '200% 200%',
      }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 py-12">
        <ProfileSection config={siteConfig} theme={theme} />
        <LinkList links={siteConfig.links} theme={theme} />
        {siteConfig.socials.length > 0 && (
          <SocialBar socials={siteConfig.socials} theme={theme} />
        )}
        {siteConfig.youtubeUrl && (
          <ContentEmbed youtubeUrl={siteConfig.youtubeUrl} />
        )}
        <Footer theme={theme} />
      </div>
    </main>
  );
}`;

const linkInBioContentEmbed = `'use client';

interface Props {
  youtubeUrl: string;
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\\.be\\/|youtube\\.com\\/(?:embed\\/|v\\/|watch\\?v=|watch\\?.+&v=))([^&?\\s]+)/
  );
  return match ? match[1] : null;
}

export function ContentEmbed({ youtubeUrl }: Props) {
  const videoId = extractYoutubeId(youtubeUrl);
  if (!videoId) return null;

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
        <iframe
          src={\`https://www.youtube-nocookie.com/embed/\${videoId}\`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-xl"
        />
      </div>
    </div>
  );
}`;

const linkInBioFooter = `import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from './language-toggle';
import type { ThemePreset } from '@/lib/themes';

interface Props {
  theme: ThemePreset;
}

export function Footer({ theme }: Props) {
  return (
    <footer
      className="flex items-center gap-2 pt-8 text-xs"
      style={{ color: theme.textMuted }}
    >
      <span>
        Powered by{' '}
        <a
          href="https://linkmap.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
        >
          Linkmap
        </a>
      </span>
      <LanguageToggle theme={theme} />
      <ThemeToggle />
    </footer>
  );
}`;

const linkInBioLanguageToggle = `'use client';

import { useLocale } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import type { ThemePreset } from '@/lib/themes';

interface Props {
  theme: ThemePreset;
}

export function LanguageToggle({ theme }: Props) {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80"
      style={{ color: theme.textMuted }}
      aria-label={locale === 'ko' ? 'Switch to English' : '한국어로 전환'}
    >
      <Globe className="w-3.5 h-3.5" />
      {locale === 'ko' ? 'EN' : '한국어'}
    </button>
  );
}`;

const linkInBioLinkList = `'use client';

import {
  Youtube,
  PenLine,
  Briefcase,
  ShoppingBag,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import type { LinkItem } from '@/lib/config';
import type { ThemePreset } from '@/lib/themes';
import { useLocale } from '@/lib/i18n';

const iconMap: Record<string, LucideIcon> = {
  youtube: Youtube,
  'pen-line': PenLine,
  briefcase: Briefcase,
  'shopping-bag': ShoppingBag,
};

interface Props {
  links: LinkItem[];
  theme: ThemePreset;
}

export function LinkList({ links, theme }: Props) {
  const { locale } = useLocale();

  return (
    <div className="w-full flex flex-col gap-3">
      {links.map((link, i) => {
        const Icon = iconMap[link.icon || ''] || ExternalLink;
        const title = locale === 'en' && link.titleEn ? link.titleEn : link.title;
        return (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3.5 rounded-xl backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: theme.cardBg,
              border: \`1px solid \${theme.cardBorder}\`,
              color: theme.text,
            }}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-sm sm:text-base font-medium flex-1">
              {title}
            </span>
            <ExternalLink className="w-4 h-4 opacity-40 shrink-0" />
          </a>
        );
      })}
    </div>
  );
}`;

const linkInBioProfileSection = `'use client';

import type { SiteConfig } from '@/lib/config';
import type { ThemePreset } from '@/lib/themes';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
  theme: ThemePreset;
}

export function ProfileSection({ config, theme }: Props) {
  const { locale } = useLocale();
  const name = locale === 'en' && config.siteNameEn ? config.siteNameEn : config.siteName;
  const bio = locale === 'en' && config.bioEn ? config.bioEn : config.bio;

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {config.avatarUrl ? (
        <img
          src={config.avatarUrl}
          alt={name}
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover ring-2 ring-white/30"
        />
      ) : (
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold ring-2 ring-white/30"
          style={{ backgroundColor: theme.primary, color: '#fff' }}
          aria-label={name}
        >
          {initials}
        </div>
      )}
      <h1 className="text-2xl font-bold" style={{ color: theme.text }}>
        {name}
      </h1>
      <p className="text-base max-w-xs" style={{ color: theme.textMuted }}>
        {bio}
      </p>
    </div>
  );
}`;

const linkInBioSocialBar = `'use client';

import {
  Instagram,
  Youtube,
  Twitter,
  Github,
  Linkedin,
  Facebook,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import type { SocialItem } from '@/lib/config';
import type { ThemePreset } from '@/lib/themes';

const socialIcons: Record<string, LucideIcon> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
};

interface Props {
  socials: SocialItem[];
  theme: ThemePreset;
}

export function SocialBar({ socials, theme }: Props) {
  return (
    <div className="flex items-center gap-4">
      {socials.map((social, i) => {
        const Icon = socialIcons[social.platform] || Globe;
        return (
          <a
            key={i}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            className="transition-colors duration-200 hover:opacity-100 opacity-70"
            style={{ color: theme.text }}
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}`;

const linkInBioThemeToggle = `'use client';

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
      className="p-1.5 rounded-full transition-colors duration-200 hover:bg-white/10"
      aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}`;

const linkInBioConfig = `export interface LinkItem {
  title: string;
  titleEn?: string;
  url: string;
  icon?: string;
}

export interface SocialItem {
  platform: string;
  url: string;
}

const DEMO_LINKS: LinkItem[] = [
  { title: '내 유튜브 채널', titleEn: 'My YouTube Channel', url: 'https://youtube.com', icon: 'youtube' },
  { title: '블로그 구경하기', titleEn: 'Visit My Blog', url: 'https://blog.example.com', icon: 'pen-line' },
  { title: '포트폴리오', titleEn: 'Portfolio', url: 'https://portfolio.example.com', icon: 'briefcase' },
  { title: '할인 이벤트 바로가기', titleEn: 'Special Offers', url: 'https://shop.example.com', icon: 'shopping-bag' },
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
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || '내 링크 페이지',
  siteNameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || 'My Link Page',
  bio: process.env.NEXT_PUBLIC_BIO || '안녕하세요! 여기서 저의 모든 링크를 확인하세요.',
  bioEn: process.env.NEXT_PUBLIC_BIO_EN || 'Hello! Check out all my links here.',
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || null,
  theme: process.env.NEXT_PUBLIC_THEME || 'gradient',
  links: parseJSON<LinkItem[]>(process.env.NEXT_PUBLIC_LINKS, DEMO_LINKS),
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, []),
  youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || null,
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;`;

const linkInBioI18n = `'use client';

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
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
    'footer.powered': 'Powered by',
  },
  en: {
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
}`;

const linkInBioThemes = `export interface ThemePreset {
  name: string;
  label: string;
  backgroundFrom: string;
  backgroundTo: string;
  primary: string;
  text: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
}

export const themes: Record<string, ThemePreset> = {
  gradient: { name: 'gradient', label: 'Gradient', backgroundFrom: '#8b5cf6', backgroundTo: '#f97316', primary: '#ec4899', text: '#ffffff', textMuted: 'rgba(255,255,255,0.8)', cardBg: 'rgba(255,255,255,0.15)', cardBorder: 'rgba(255,255,255,0.25)' },
  neon: { name: 'neon', label: 'Neon', backgroundFrom: '#0f172a', backgroundTo: '#1e293b', primary: '#22d3ee', text: '#f0f9ff', textMuted: 'rgba(240,249,255,0.7)', cardBg: 'rgba(34,211,238,0.08)', cardBorder: 'rgba(34,211,238,0.25)' },
  minimal: { name: 'minimal', label: 'Minimal', backgroundFrom: '#ffffff', backgroundTo: '#f3f4f6', primary: '#1f2937', text: '#111827', textMuted: '#6b7280', cardBg: 'rgba(0,0,0,0.04)', cardBorder: 'rgba(0,0,0,0.08)' },
  pastel: { name: 'pastel', label: 'Pastel', backgroundFrom: '#fce7f3', backgroundTo: '#dbeafe', primary: '#f472b6', text: '#1f2937', textMuted: '#6b7280', cardBg: 'rgba(255,255,255,0.6)', cardBorder: 'rgba(244,114,182,0.2)' },
  dark: { name: 'dark', label: 'Dark', backgroundFrom: '#0f172a', backgroundTo: '#1e1b4b', primary: '#a78bfa', text: '#f5f3ff', textMuted: 'rgba(245,243,255,0.7)', cardBg: 'rgba(167,139,250,0.08)', cardBorder: 'rgba(167,139,250,0.2)' },
  ocean: { name: 'ocean', label: 'Ocean', backgroundFrom: '#164e63', backgroundTo: '#0c4a6e', primary: '#06b6d4', text: '#ecfeff', textMuted: 'rgba(236,254,255,0.7)', cardBg: 'rgba(6,182,212,0.1)', cardBorder: 'rgba(6,182,212,0.25)' },
  sunset: { name: 'sunset', label: 'Sunset', backgroundFrom: '#7c2d12', backgroundTo: '#78350f', primary: '#f59e0b', text: '#fffbeb', textMuted: 'rgba(255,251,235,0.7)', cardBg: 'rgba(245,158,11,0.1)', cardBorder: 'rgba(245,158,11,0.25)' },
  forest: { name: 'forest', label: 'Forest', backgroundFrom: '#14532d', backgroundTo: '#1a2e05', primary: '#22c55e', text: '#f0fdf4', textMuted: 'rgba(240,253,244,0.7)', cardBg: 'rgba(34,197,94,0.1)', cardBorder: 'rgba(34,197,94,0.25)' },
  candy: { name: 'candy', label: 'Candy', backgroundFrom: '#fdf2f8', backgroundTo: '#fce7f3', primary: '#f472b6', text: '#831843', textMuted: '#9d174d', cardBg: 'rgba(244,114,182,0.08)', cardBorder: 'rgba(244,114,182,0.2)' },
  monochrome: { name: 'monochrome', label: 'Monochrome', backgroundFrom: '#111827', backgroundTo: '#1f2937', primary: '#6b7280', text: '#f9fafb', textMuted: 'rgba(249,250,251,0.6)', cardBg: 'rgba(107,114,128,0.1)', cardBorder: 'rgba(107,114,128,0.2)' },
};

export function getTheme(name: string): ThemePreset {
  return themes[name] || themes.gradient;
}`;

// ──────────────────────────────────────────────
// 7. Digital Namecard (MVP)
// ──────────────────────────────────────────────
const namecardPackageJson = `{
  "name": "digital-namecard",
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
    "qrcode.react": "^4.2.0"
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
}`;

const namecardOgRoute = `import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-static';

export async function GET() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff', fontFamily: 'sans-serif' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: siteConfig.accentColor }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 100, height: 100, borderRadius: '50%', backgroundColor: siteConfig.accentColor, color: '#fff', fontSize: 40, fontWeight: 700, marginBottom: 20 }}>
          {siteConfig.name.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#111827' }}>{siteConfig.name}</div>
        <div style={{ fontSize: 28, color: '#6b7280', marginTop: 8 }}>{siteConfig.title}</div>
        {siteConfig.company && (<div style={{ fontSize: 22, color: '#9ca3af', marginTop: 4 }}>{siteConfig.company}</div>)}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}`;

const namecardGlobalsCss = `@import "tailwindcss";

@theme {
  --font-sans: 'Pretendard Variable', 'Inter', ui-sans-serif, system-ui, sans-serif;
}

@media print {
  body { background: white !important; margin: 0; padding: 0; }
  .print-card { width: 90mm; height: 55mm; box-shadow: none !important; border-radius: 0 !important; margin: 0 auto; overflow: hidden; }
  .print-hide { display: none !important; }
}`;

const namecardLayout = `import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { siteConfig } from '@/lib/config';
import { LocaleProvider } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: \`\${siteConfig.name} - 디지털 명함\`,
  description: \`\${siteConfig.name} | \${siteConfig.title}\`,
  openGraph: { title: \`\${siteConfig.name} - 디지털 명함\`, description: \`\${siteConfig.name} | \${siteConfig.title}\`, type: 'website', images: ['/api/og'] },
  twitter: { card: 'summary_large_image', title: \`\${siteConfig.name} - 디지털 명함\`, description: \`\${siteConfig.name} | \${siteConfig.title}\` },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: siteConfig.name, jobTitle: siteConfig.title, ...(siteConfig.company ? { worksFor: { '@type': 'Organization', name: siteConfig.company } } : {}), ...(siteConfig.email ? { email: siteConfig.email } : {}), ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}), ...(siteConfig.website ? { url: siteConfig.website } : {}) }) }} />
      </head>
      <body className="antialiased bg-gray-50 dark:bg-gray-900">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}`;

const namecardPage = `import { siteConfig } from '@/lib/config';
import { ProfileCard } from '@/components/profile-card';
import { ContactInfo } from '@/components/contact-info';
import { SocialLinks } from '@/components/social-links';
import { QrCode } from '@/components/qr-code';
import { SaveContactButton } from '@/components/save-contact-button';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="print-card rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-800">
          <div className="h-2" style={{ background: \`linear-gradient(90deg, \${siteConfig.accentColor}, \${siteConfig.accentColor}dd)\` }} />
          <div className="p-6 space-y-5">
            <ProfileCard config={siteConfig} />
            <ContactInfo config={siteConfig} />
            {siteConfig.socials.length > 0 && <SocialLinks socials={siteConfig.socials} accentColor={siteConfig.accentColor} />}
            <QrCode config={siteConfig} />
            <SaveContactButton config={siteConfig} />
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}`;

const namecardContactInfo = `'use client';

import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props { config: SiteConfig; }

export function ContactInfo({ config }: Props) {
  const { t, locale } = useLocale();
  const address = locale === 'en' && config.addressEn ? config.addressEn : config.address;
  const items = [
    config.phone ? { icon: Phone, label: config.phone, href: \`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`, ariaLabel: t('contact.call') } : null,
    config.email ? { icon: Mail, label: config.email, href: \`mailto:\${config.email}\`, ariaLabel: t('contact.email') } : null,
    address ? { icon: MapPin, label: address, href: \`https://maps.google.com/?q=\${encodeURIComponent(address)}\`, ariaLabel: t('contact.map') } : null,
    config.website ? { icon: Globe, label: config.website.replace(/^https?:\\/\\//, ''), href: config.website, ariaLabel: t('contact.website') } : null,
  ].filter(Boolean) as Array<{ icon: typeof Phone; label: string; href: string; ariaLabel: string }>;
  if (items.length === 0) return null;
  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <a key={i} href={item.href} target={item.icon === Globe || item.icon === MapPin ? '_blank' : undefined} rel={item.icon === Globe || item.icon === MapPin ? 'noopener noreferrer' : undefined} aria-label={item.ariaLabel} className="flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          <item.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
          <span className="text-sm truncate">{item.label}</span>
        </a>
      ))}
    </div>
  );
}`;

const namecardFooter = `import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from './language-toggle';

export function Footer() {
  return (
    <footer className="print-hide flex items-center justify-center gap-2 text-gray-400 text-xs mt-8 pb-4">
      <span>Powered by{' '}<a href="https://linkmap.vercel.app" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300">Linkmap</a></span>
      <LanguageToggle />
      <ThemeToggle />
    </footer>
  );
}`;

const namecardLanguageToggle = `'use client';

import { useLocale } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <button onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" aria-label={locale === 'ko' ? 'Switch to English' : '한국어로 전환'}>
      <Globe className="w-3.5 h-3.5" />{locale === 'ko' ? 'EN' : '한국어'}
    </button>
  );
}`;

const namecardProfileCard = `'use client';

import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props { config: SiteConfig; }

export function ProfileCard({ config }: Props) {
  const { locale } = useLocale();
  const name = locale === 'en' && config.nameEn ? config.nameEn : config.name;
  const title = locale === 'en' && config.titleEn ? config.titleEn : config.title;
  const company = locale === 'en' && config.companyEn ? config.companyEn : config.company;
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="flex flex-col items-center text-center gap-2">
      {config.avatarUrl ? (<img src={config.avatarUrl} alt={name} width={80} height={80} className="w-20 h-20 rounded-full object-cover" />) : (<div className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: config.accentColor }} aria-label={name}>{initials}</div>)}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{name}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">{title}</p>
      {company && <p className="text-base text-gray-500">{company}</p>}
    </div>
  );
}`;

const namecardQrCode = `'use client';

import { QRCodeSVG } from 'qrcode.react';
import { generateVCard } from '@/lib/vcard';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props { config: SiteConfig; }

export function QrCode({ config }: Props) {
  const { t } = useLocale();
  const vcard = generateVCard({ name: config.name, title: config.title, company: config.company, email: config.email, phone: config.phone, address: config.address, website: config.website });
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="p-3 bg-white rounded-xl"><QRCodeSVG value={vcard} size={160} level="M" bgColor="#ffffff" fgColor="#111827" /></div>
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">{t('qr.hint')}</p>
    </div>
  );
}`;

const namecardSaveContactButton = `'use client';

import { Download } from 'lucide-react';
import { generateVCard } from '@/lib/vcard';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props { config: SiteConfig; }

export function SaveContactButton({ config }: Props) {
  const { t } = useLocale();
  const handleSave = () => {
    const vcard = generateVCard({ name: config.name, title: config.title, company: config.company, email: config.email, phone: config.phone, address: config.address, website: config.website });
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = \`\${config.name}.vcf\`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={handleSave} className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-90 active:opacity-80" style={{ backgroundColor: config.accentColor }}>
      <Download className="w-4 h-4" />{t('save.contact')}
    </button>
  );
}`;

const namecardSocialLinks = `'use client';

import { Linkedin, Twitter, Instagram, Github, Facebook, Globe, type LucideIcon } from 'lucide-react';
import type { SocialItem } from '@/lib/config';

const socialIcons: Record<string, LucideIcon> = { linkedin: Linkedin, twitter: Twitter, instagram: Instagram, github: Github, facebook: Facebook };

interface Props { socials: SocialItem[]; accentColor: string; }

export function SocialLinks({ socials, accentColor }: Props) {
  return (
    <div className="flex items-center justify-center gap-4">
      {socials.map((social, i) => {
        const Icon = socialIcons[social.platform] || Globe;
        return (<a key={i} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform} className="p-2 rounded-full text-gray-500 dark:text-gray-400 transition-all duration-200 hover:scale-110" style={{ '--tw-ring-color': accentColor } as React.CSSProperties}><Icon className="w-5 h-5" /></a>);
      })}
    </div>
  );
}`;

const namecardThemeToggle = `'use client';

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
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-1.5 rounded-full transition-colors duration-200 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}>
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}`;

const namecardConfig = `export interface SocialItem { platform: string; url: string; }

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || '홍길동',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || 'Gildong Hong',
  title: process.env.NEXT_PUBLIC_TITLE || '프리랜서 개발자',
  titleEn: process.env.NEXT_PUBLIC_TITLE_EN || 'Freelance Developer',
  company: process.env.NEXT_PUBLIC_COMPANY || null,
  companyEn: process.env.NEXT_PUBLIC_COMPANY_EN || null,
  email: process.env.NEXT_PUBLIC_EMAIL || 'hello@example.com',
  phone: process.env.NEXT_PUBLIC_PHONE || '010-1234-5678',
  address: process.env.NEXT_PUBLIC_ADDRESS || null,
  addressEn: process.env.NEXT_PUBLIC_ADDRESS_EN || null,
  website: process.env.NEXT_PUBLIC_WEBSITE || null,
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, []),
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || null,
  accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || '#3b82f6',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;`;

const namecardI18n = `'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type Locale = 'ko' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  ko: { 'contact.call': '전화하기', 'contact.email': '이메일 보내기', 'contact.map': '지도에서 보기', 'contact.website': '웹사이트 방문', 'qr.hint': 'QR 코드를 스캔하면 연락처가 저장됩니다', 'save.contact': '연락처에 저장', 'theme.light': '라이트 모드로 전환', 'theme.dark': '다크 모드로 전환', 'footer.powered': 'Powered by' },
  en: { 'contact.call': 'Call', 'contact.email': 'Send email', 'contact.map': 'View on map', 'contact.website': 'Visit website', 'qr.hint': 'Scan QR code to save contact', 'save.contact': 'Save Contact', 'theme.light': 'Switch to light mode', 'theme.dark': 'Switch to dark mode', 'footer.powered': 'Powered by' },
};

interface LocaleContextValue { locale: Locale; setLocale: (l: Locale) => void; t: (key: string) => string; }

const LocaleContext = createContext<LocaleContextValue>({ locale: 'ko', setLocale: () => {}, t: (k) => k });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ko');
  useEffect(() => { const saved = localStorage.getItem('locale') as Locale | null; if (saved === 'ko' || saved === 'en') { setLocaleState(saved); document.documentElement.lang = saved; } }, []);
  const setLocale = useCallback((l: Locale) => { setLocaleState(l); localStorage.setItem('locale', l); document.documentElement.lang = l; }, []);
  const t = useCallback((key: string) => translations[locale]?.[key] ?? key, [locale]);
  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale() { return useContext(LocaleContext); }`;

const namecardVcard = `interface VCardData { name: string; title?: string | null; company?: string | null; email?: string | null; phone?: string | null; address?: string | null; website?: string | null; }

export function generateVCard(data: VCardData): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0', \`FN:\${data.name}\`, \`N:\${data.name};;;;\`];
  if (data.title) lines.push(\`TITLE:\${data.title}\`);
  if (data.company) lines.push(\`ORG:\${data.company}\`);
  if (data.email) lines.push(\`EMAIL;TYPE=INTERNET:\${data.email}\`);
  if (data.phone) lines.push(\`TEL;TYPE=CELL:\${data.phone}\`);
  if (data.address) lines.push(\`ADR;TYPE=WORK:;;\${data.address};;;;\`);
  if (data.website) lines.push(\`URL:\${data.website}\`);
  lines.push('END:VCARD');
  return lines.join('\\r\\n');
}

export function generateVCardDataUrl(data: VCardData): string { return generateVCard(data); }`;

// ──────────────────────────────────────────────
// Export all templates
// ──────────────────────────────────────────────
export const homepageTemplates: HomepageTemplateContent[] = [
  {
    slug: 'link-in-bio-pro',
    repoName: 'link-in-bio-pro',
    description: '링크인바이오 페이지 - Linkmap으로 생성',
    files: [
      { path: '.github/workflows/deploy.yml', content: deployWorkflow },
      { path: 'package.json', content: linkInBioPackageJson },
      { path: 'tsconfig.json', content: sharedTsConfig },
      { path: 'postcss.config.mjs', content: sharedPostcssConfig },
      { path: 'next.config.ts', content: sharedNextConfig },
      { path: 'src/app/api/og/route.tsx', content: linkInBioOgRoute },
      { path: 'src/app/globals.css', content: linkInBioGlobalsCss },
      { path: 'src/app/layout.tsx', content: linkInBioLayout },
      { path: 'src/app/page.tsx', content: linkInBioPage },
      { path: 'src/components/content-embed.tsx', content: linkInBioContentEmbed },
      { path: 'src/components/footer.tsx', content: linkInBioFooter },
      { path: 'src/components/language-toggle.tsx', content: linkInBioLanguageToggle },
      { path: 'src/components/link-list.tsx', content: linkInBioLinkList },
      { path: 'src/components/profile-section.tsx', content: linkInBioProfileSection },
      { path: 'src/components/social-bar.tsx', content: linkInBioSocialBar },
      { path: 'src/components/theme-toggle.tsx', content: linkInBioThemeToggle },
      { path: 'src/lib/config.ts', content: linkInBioConfig },
      { path: 'src/lib/i18n.tsx', content: linkInBioI18n },
      { path: 'src/lib/themes.ts', content: linkInBioThemes },
    ],
  },
  {
    slug: 'digital-namecard',
    repoName: 'digital-namecard',
    description: '디지털 명함 - Linkmap으로 생성',
    files: [
      { path: '.github/workflows/deploy.yml', content: deployWorkflow },
      { path: 'package.json', content: namecardPackageJson },
      { path: 'tsconfig.json', content: sharedTsConfig },
      { path: 'postcss.config.mjs', content: sharedPostcssConfig },
      { path: 'next.config.ts', content: sharedNextConfig },
      { path: 'src/app/api/og/route.tsx', content: namecardOgRoute },
      { path: 'src/app/globals.css', content: namecardGlobalsCss },
      { path: 'src/app/layout.tsx', content: namecardLayout },
      { path: 'src/app/page.tsx', content: namecardPage },
      { path: 'src/components/contact-info.tsx', content: namecardContactInfo },
      { path: 'src/components/footer.tsx', content: namecardFooter },
      { path: 'src/components/language-toggle.tsx', content: namecardLanguageToggle },
      { path: 'src/components/profile-card.tsx', content: namecardProfileCard },
      { path: 'src/components/qr-code.tsx', content: namecardQrCode },
      { path: 'src/components/save-contact-button.tsx', content: namecardSaveContactButton },
      { path: 'src/components/social-links.tsx', content: namecardSocialLinks },
      { path: 'src/components/theme-toggle.tsx', content: namecardThemeToggle },
      { path: 'src/lib/config.ts', content: namecardConfig },
      { path: 'src/lib/i18n.tsx', content: namecardI18n },
      { path: 'src/lib/vcard.ts', content: namecardVcard },
    ],
  },
  devShowcaseTemplate,
];
