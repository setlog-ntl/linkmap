/**
 * Homepage template content for one-click deploy.
 * Each template contains the files to be pushed to a new GitHub repo.
 * The setup-templates admin endpoint uses this data to create template repos.
 */

import { devShowcaseTemplate } from './dev-showcase-template';
import { personalBrandTemplate } from './personal-brand-template';
import { freelancerPageTemplate } from './freelancer-page-template';
import { smallBizTemplate } from './small-biz-template';
import {
  sharedDeployYml as deployWorkflow,
  sharedTsconfigJson as sharedTsConfig,
  sharedPostcssConfig,
  sharedNextConfig,
  sharedGitignore,
  sharedAnimatedReveal,
  makePackageJson,
} from './shared-template-files';

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
// 6. My Link Page (MVP)
// ──────────────────────────────────────────────
const linkInBioPackageJson = makePackageJson('link-in-bio-pro');

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
}

*:focus-visible {
  outline: 2px solid currentColor;
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
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

/* Card lift */
.card-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
.card-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }

/* Button press */
.btn-press { transition: transform 0.15s ease; }
.btn-press:active { transform: scale(0.97); }

/* Avatar ring */
.avatar-ring {
  position: relative;
}
.avatar-ring::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--color-primary, #818cf8), var(--color-secondary, #c084fc), var(--color-primary, #818cf8));
  z-index: -1;
  opacity: 0.7;
}

@media (prefers-reduced-motion: reduce) {
  .card-lift:hover { transform: none; }
  .btn-press:active { transform: none; }
}`;

const linkInBioLayout = `import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
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
        <script dangerouslySetInnerHTML={{ __html: "(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}})()" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfilePage',
              mainEntity: {
                '@type': 'Person',
                name: siteConfig.siteName,
                description: siteConfig.bio,
                ...(siteConfig.avatarUrl ? { image: siteConfig.avatarUrl } : {}),
                ...(siteConfig.links?.length ? { sameAs: siteConfig.links.map((l: { url: string }) => l.url) } : {}),
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:shadow-lg focus:text-sm">본문으로 바로가기</a>
        {children}
      </body>
    </html>
  );
}`;

const linkInBioPage = `import { siteConfig } from '@/lib/config';
import { getTheme, getBackground } from '@/lib/themes';
import { ProfileSection } from '@/components/profile-section';
import { LinkList } from '@/components/link-list';
import { SocialBar } from '@/components/social-bar';
import { ContentEmbed } from '@/components/content-embed';
import { Footer } from '@/components/footer';

export default function Home() {
  const theme = getTheme(siteConfig.theme);
  const bgStyle = siteConfig.bgStyle || 'gradient';

  return (
    <main id="main"
      className={\`min-h-screen flex flex-col items-center justify-center p-4\${bgStyle === 'gradient' ? ' animate-gradient' : ''}\`}
      style={getBackground(theme, bgStyle)}
    >
      <div className="w-full max-w-md sm:max-w-lg mx-auto flex flex-col items-center gap-6 py-12">
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
      <a
        href="https://www.linkmap.biz/sites?utm_source=badge&utm_medium=referral&utm_campaign=link-in-bio-pro"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-[11px] font-medium hover:opacity-80"
        style={{ borderWidth: 1, borderStyle: 'solid', borderColor: theme.textMuted + '33', color: theme.textMuted }}
        aria-label="Made with Linkmap"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        Made with Linkmap
      </a>
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
  const { locale, setLocale, t } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80"
      style={{ color: theme.textMuted }}
      aria-label={t('lang.switchLabel')}
    >
      <Globe className="w-3.5 h-3.5" />
      {t('lang.toggle')}
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
import { siteConfig, type LinkItem } from '@/lib/config';
import { getCardRadius, type ThemePreset } from '@/lib/themes';
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
            className="card-lift btn-press flex items-center gap-3 px-5 py-3.5 backdrop-blur-sm shadow-sm group"
            style={{
              backgroundColor: theme.cardBg,
              border: \`1px solid \${theme.cardBorder}\`,
              color: theme.text,
              borderRadius: getCardRadius(siteConfig.cardStyle || 'rounded'),
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.primary + '66'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.cardBorder; }}
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
        <div className="avatar-ring" style={{ ['--color-primary' as string]: theme.primary, ['--color-secondary' as string]: theme.secondary ?? theme.primary }}>
          <img
            src={config.avatarUrl}
            alt={name}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover"
            style={{ boxShadow: \`0 0 30px \${theme.primary}66\` }}
          />
        </div>
      ) : (
        <div
          className="avatar-ring w-24 h-24"
          style={{ ['--color-primary' as string]: theme.primary, ['--color-secondary' as string]: theme.secondary ?? theme.primary }}
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: theme.primary, color: '#fff', boxShadow: \`0 0 30px \${theme.primary}66\` }}
            aria-label={name}
          >
            {initials}
          </div>
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
      className="p-1.5 rounded-full transition-colors duration-200 hover:bg-white/10"
      aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
  bgStyle: process.env.NEXT_PUBLIC_BG_STYLE || 'gradient',
  cardStyle: process.env.NEXT_PUBLIC_CARD_STYLE || 'rounded',
  primaryColor: '#6366f1',
  links: parseJSON<LinkItem[]>(process.env.NEXT_PUBLIC_LINKS, DEMO_LINKS),
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, []),
  youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || null,
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;`;

const linkInBioI18n = `'use client';

import { useSyncExternalStore } from 'react';

export type Locale = 'ko' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  ko: {
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
    'footer.powered': 'Powered by',
    'lang.switchLabel': 'Switch to English',
    'lang.toggle': 'EN',
  },
  en: {
    'theme.light': 'Switch to light mode',
    'theme.dark': 'Switch to dark mode',
    'footer.powered': 'Powered by',
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
  gradient: { name: 'gradient', label: 'Gradient', backgroundFrom: '#6366f1', backgroundTo: '#7c3aed', primary: '#a78bfa', text: '#ffffff', textMuted: 'rgba(255,255,255,0.85)', cardBg: 'rgba(255,255,255,0.15)', cardBorder: 'rgba(255,255,255,0.28)' },
  neon: { name: 'neon', label: 'Neon', backgroundFrom: '#0f172a', backgroundTo: '#1e293b', primary: '#22d3ee', text: '#f0f9ff', textMuted: 'rgba(240,249,255,0.7)', cardBg: 'rgba(34,211,238,0.08)', cardBorder: 'rgba(34,211,238,0.25)' },
  minimal: { name: 'minimal', label: 'Minimal', backgroundFrom: '#ffffff', backgroundTo: '#f3f4f6', primary: '#1f2937', text: '#111827', textMuted: '#6b7280', cardBg: 'rgba(0,0,0,0.04)', cardBorder: 'rgba(0,0,0,0.08)' },
  pastel: { name: 'pastel', label: 'Pastel', backgroundFrom: '#ede9fe', backgroundTo: '#bfdbfe', primary: '#8b5cf6', text: '#1f2937', textMuted: '#6b7280', cardBg: 'rgba(255,255,255,0.65)', cardBorder: 'rgba(139,92,246,0.2)' },
  dark: { name: 'dark', label: 'Dark', backgroundFrom: '#0f172a', backgroundTo: '#1e1b4b', primary: '#a78bfa', text: '#f5f3ff', textMuted: 'rgba(245,243,255,0.7)', cardBg: 'rgba(167,139,250,0.08)', cardBorder: 'rgba(167,139,250,0.2)' },
  ocean: { name: 'ocean', label: 'Ocean', backgroundFrom: '#164e63', backgroundTo: '#0c4a6e', primary: '#06b6d4', text: '#ecfeff', textMuted: 'rgba(236,254,255,0.7)', cardBg: 'rgba(6,182,212,0.1)', cardBorder: 'rgba(6,182,212,0.25)' },
  sunset: { name: 'sunset', label: 'Sunset', backgroundFrom: '#7c2d12', backgroundTo: '#78350f', primary: '#f59e0b', text: '#fffbeb', textMuted: 'rgba(255,251,235,0.7)', cardBg: 'rgba(245,158,11,0.1)', cardBorder: 'rgba(245,158,11,0.25)' },
  forest: { name: 'forest', label: 'Forest', backgroundFrom: '#14532d', backgroundTo: '#1a2e05', primary: '#22c55e', text: '#f0fdf4', textMuted: 'rgba(240,253,244,0.7)', cardBg: 'rgba(34,197,94,0.1)', cardBorder: 'rgba(34,197,94,0.25)' },
  candy: { name: 'candy', label: 'Candy', backgroundFrom: '#ff9a9e', backgroundTo: '#fad0c4', primary: '#f43f5e', text: '#ffffff', textMuted: 'rgba(255,255,255,0.85)', cardBg: 'rgba(255,255,255,0.22)', cardBorder: 'rgba(255,255,255,0.38)' },
  monochrome: { name: 'monochrome', label: 'Monochrome', backgroundFrom: '#111827', backgroundTo: '#1f2937', primary: '#6b7280', text: '#f9fafb', textMuted: 'rgba(249,250,251,0.6)', cardBg: 'rgba(107,114,128,0.1)', cardBorder: 'rgba(107,114,128,0.2)' },
};

export function getTheme(name: string): ThemePreset {
  return themes[name] || themes.gradient;
}

export function getBackground(theme: ThemePreset, bgStyle: string): Record<string, string> {
  switch (bgStyle) {
    case 'solid':
      return { background: theme.primary };
    case 'mesh':
      return {
        background: \`radial-gradient(at 40% 20%, \${theme.backgroundFrom} 0px, transparent 50%), radial-gradient(at 80% 0%, \${theme.primary} 0px, transparent 50%), radial-gradient(at 0% 50%, \${theme.backgroundTo} 0px, transparent 50%), radial-gradient(at 80% 50%, \${theme.primary}44 0px, transparent 50%), radial-gradient(at 0% 100%, \${theme.backgroundFrom} 0px, transparent 50%), \${theme.backgroundTo}\`,
      };
    case 'aurora':
      return {
        background: \`radial-gradient(ellipse at top left, \${theme.backgroundFrom}cc 0%, transparent 60%), radial-gradient(ellipse at top right, \${theme.primary}99 0%, transparent 60%), radial-gradient(ellipse at bottom center, \${theme.backgroundTo}bb 0%, transparent 65%), #090d18\`,
      };
    default:
      return {
        background: \`linear-gradient(135deg, \${theme.backgroundFrom}, \${theme.primary}, \${theme.backgroundTo})\`,
        backgroundSize: '200% 200%',
      };
  }
}

export function getCardRadius(cardStyle: string): string {
  switch (cardStyle) {
    case 'pill': return '9999px';
    case 'square': return '0px';
    default: return '12px';
  }
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
    "next": "15.1.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "lucide-react": "0.468.0",
    "qrcode.react": "4.2.0"
  },
  "devDependencies": {
    "@types/node": "22.0.0",
    "@types/react": "19.0.0",
    "@types/react-dom": "19.0.0",
    "typescript": "5.7.2",
    "tailwindcss": "4.0.0",
    "@tailwindcss/postcss": "4.0.0",
    "postcss": "8.5.0"
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

  /* Spacing */
  --section-gap: clamp(4rem, 8vw, 7rem);
  --section-padding-x: clamp(1rem, 4vw, 3rem);

  /* Surface */
  --surface-elevated: #ffffff;
  --surface-sunken: #f8f9fa;
  --surface-border: rgba(0, 0, 0, 0.06);
  --shadow-card: 0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04);
  --shadow-card-hover: 0 8px 32px rgba(0,0,0,0.1), 0 16px 48px rgba(0,0,0,0.06);

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
  --shadow-card: 0 2px 8px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2);
  --shadow-card-hover: 0 8px 32px rgba(0,0,0,0.4), 0 16px 48px rgba(0,0,0,0.3);
}

@media print {
  body { background: white !important; margin: 0; padding: 0; }
  .print-card { width: 90mm; height: 55mm; box-shadow: none !important; border-radius: 0 !important; margin: 0 auto; overflow: hidden; }
  .print-hide { display: none !important; }
}

*:focus-visible {
  outline: 2px solid currentColor;
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

/* Reveal variants */
.reveal-slide-left {
  opacity: 0;
  transform: translateX(-32px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-slide-left.revealed {
  opacity: 1;
  transform: translateX(0);
}
.reveal-scale {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-scale.revealed {
  opacity: 1;
  transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .reveal-fade,
  .reveal-slide-left,
  .reveal-scale { opacity: 1; transform: none; transition: none; }
}

/* Card lift */
.card-lift {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: var(--shadow-card);
}
.card-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

/* Card flip */
.card-flip-container { perspective: 1000px; cursor: pointer; }
.card-flip-inner {
  position: relative;
  width: 100%;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}
.card-flip-container.flipped .card-flip-inner { transform: rotateY(180deg); }
.card-flip-front,
.card-flip-back { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.card-flip-back {
  position: absolute;
  inset: 0;
  transform: rotateY(180deg);
}

/* Section gap */
.section-gap {
  padding-top: var(--section-gap, 4rem);
  padding-bottom: var(--section-gap, 4rem);
}

@media (prefers-reduced-motion: reduce) {
  .card-lift:hover { transform: none; }
  .card-flip-inner { transition: none; }
}`;

const namecardLayout = `import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
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
        <script dangerouslySetInnerHTML={{ __html: "(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}})()" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: siteConfig.name, jobTitle: siteConfig.title, ...(siteConfig.company ? { worksFor: { '@type': 'Organization', name: siteConfig.company } } : {}), ...(siteConfig.email || siteConfig.phone ? { contactPoint: { '@type': 'ContactPoint', ...(siteConfig.email ? { email: siteConfig.email } : {}), ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}) } } : {}), ...(siteConfig.website ? { url: siteConfig.website } : {}), ...(siteConfig.socials?.length ? { sameAs: siteConfig.socials.map((s: { url: string }) => s.url) } : {}) }) }} />
      </head>
      <body className="antialiased bg-gray-50 dark:bg-gray-900">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:shadow-lg focus:text-sm">본문으로 바로가기</a>
        {children}
      </body>
    </html>
  );
}`;

const namecardPage = `import { siteConfig } from '@/lib/config';
import { FlippableCard } from '@/components/flippable-card';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main id="main" className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--surface-sunken)] dark:bg-gray-950">
      <div className="w-full max-w-sm mx-auto">
        <FlippableCard config={siteConfig} />
        <Footer />
      </div>
    </main>
  );
}`;

const namecardContactInfo = `'use client';

import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props { config: SiteConfig; accentColor?: string; }

export function ContactInfo({ config, accentColor }: Props) {
  const { t, locale } = useLocale();
  const address = locale === 'en' && config.addressEn ? config.addressEn : config.address;
  const accent = accentColor || config.accentColor;
  const items = [
    config.phone ? { icon: Phone, label: config.phone, href: \`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`, ariaLabel: t('contact.call') } : null,
    config.email ? { icon: Mail, label: config.email, href: \`mailto:\${config.email}\`, ariaLabel: t('contact.email') } : null,
    address ? { icon: MapPin, label: address, href: \`https://maps.google.com/?q=\${encodeURIComponent(address)}\`, ariaLabel: t('contact.map') } : null,
    config.website ? { icon: Globe, label: config.website.replace(/^https?:\\/\\//, ''), href: config.website, ariaLabel: t('contact.website') } : null,
  ].filter(Boolean) as Array<{ icon: typeof Phone; label: string; href: string; ariaLabel: string }>;
  if (items.length === 0) return null;
  return (
    <div className="divide-y divide-[var(--surface-border)]">
      {items.map((item, i) => (
        <a
          key={i}
          href={item.href}
          target={item.icon === Globe || item.icon === MapPin ? '_blank' : undefined}
          rel={item.icon === Globe || item.icon === MapPin ? 'noopener noreferrer' : undefined}
          aria-label={item.ariaLabel}
          className="group flex items-center gap-3 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <span className="flex-shrink-0 w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center transition-colors" style={{ backgroundColor: \`\${accent}18\` }}>
            <item.icon className="w-4 h-4" style={{ color: accent }} />
          </span>
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
      <a href="https://www.linkmap.biz/sites?utm_source=badge&utm_medium=referral&utm_campaign=digital-namecard" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all text-[11px] font-medium" aria-label="Made with Linkmap"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>Made with Linkmap</a>
      <LanguageToggle />
      <ThemeToggle />
    </footer>
  );
}`;

const namecardLanguageToggle = `'use client';

import { useLocale } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();
  return (
    <button onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" aria-label={t('lang.switchLabel')}>
      <Globe className="w-3.5 h-3.5" />{t('lang.toggle')}
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
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="flex flex-col items-center text-center gap-2 pt-2">
      {config.avatarUrl
        ? (<img src={config.avatarUrl} alt={name} width={96} height={96} className="w-24 h-24 rounded-full object-cover -mt-16 ring-4 ring-[var(--surface-elevated)] shadow-md" />)
        : (<div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white -mt-16 ring-4 ring-[var(--surface-elevated)] shadow-md shrink-0" style={{ backgroundColor: config.accentColor }} aria-label={name}>{initials}</div>)
      }
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{name}</h1>
      <p className="text-base font-medium text-gray-600 dark:text-gray-400">{title}</p>
      {company && (
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
          {company}
        </span>
      )}
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
    <div className="flex flex-col items-center gap-3">
      <div className="p-4 bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]">
        <QRCodeSVG value={vcard} size={152} level="M" bgColor="#ffffff" fgColor="#111827" />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed">{t('qr.hint')}</p>
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
    a.href = url;
    a.download = \`\${config.name}.vcf\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={handleSave}
      className="w-full py-3 rounded-[var(--radius-md)] text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-md"
      style={{ backgroundColor: config.accentColor, boxShadow: \`0 4px 14px \${config.accentColor}40\` }}
    >
      <Download className="w-4 h-4" />
      {t('save.contact')}
    </button>
  );
}`;

const namecardSocialLinks = `'use client';

import { Linkedin, Twitter, Instagram, Github, Facebook, Youtube, Globe, type LucideIcon } from 'lucide-react';
import type { SocialItem } from '@/lib/config';

const socialIcons: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
};

interface Props { socials: SocialItem[]; accentColor: string; }

export function SocialLinks({ socials, accentColor }: Props) {
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {socials.map((social, i) => {
        const Icon = socialIcons[social.platform] ?? Globe;
        return (
          <a
            key={i}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-md"
            style={{ backgroundColor: \`\${accentColor}15\`, color: accentColor }}
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}`;

const namecardThemeToggle = `'use client';

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
      className="p-1.5 rounded-full transition-colors duration-200 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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

import { useSyncExternalStore } from 'react';

export type Locale = 'ko' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  ko: { 'contact.call': '전화하기', 'contact.email': '이메일 보내기', 'contact.map': '지도에서 보기', 'contact.website': '웹사이트 방문', 'qr.hint': 'QR 코드를 스캔하면 연락처가 저장됩니다', 'save.contact': '연락처에 저장', 'theme.light': '라이트 모드로 전환', 'theme.dark': '다크 모드로 전환', 'footer.powered': 'Powered by', 'lang.switchLabel': 'Switch to English', 'lang.toggle': 'EN', 'card.showQr': '탭하면 QR 코드가 표시됩니다', 'card.showProfile': '탭하면 프로필로 돌아갑니다', 'card.tapToFlip': '탭하여 뒤집기' },
  en: { 'contact.call': 'Call', 'contact.email': 'Send email', 'contact.map': 'View on map', 'contact.website': 'Visit website', 'qr.hint': 'Scan QR code to save contact', 'save.contact': 'Save Contact', 'theme.light': 'Switch to light mode', 'theme.dark': 'Switch to dark mode', 'footer.powered': 'Powered by', 'lang.switchLabel': '한국어로 전환', 'lang.toggle': '한국어', 'card.showQr': 'Tap to show QR code', 'card.showProfile': 'Tap to return to profile', 'card.tapToFlip': 'Tap to flip' },
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
}`;

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

const namecardFlippableCard = `'use client';

import { useState } from 'react';
import type { SiteConfig } from '@/lib/config';
import { ProfileCard } from '@/components/profile-card';
import { ContactInfo } from '@/components/contact-info';
import { SocialLinks } from '@/components/social-links';
import { QrCode } from '@/components/qr-code';
import { SaveContactButton } from '@/components/save-contact-button';
import { useLocale } from '@/lib/i18n';
import { ScanLine, User } from 'lucide-react';

interface Props { config: SiteConfig; }

export function FlippableCard({ config }: Props) {
  const [flipped, setFlipped] = useState(false);
  const { t } = useLocale();

  return (
    <div className="w-full">
      {/* Flip hint */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-3 select-none">
        {flipped ? t('card.showProfile') : t('card.showQr')}
      </p>

      <div
        className={\`card-flip-container \${flipped ? 'flipped' : ''}\`}
        onClick={() => setFlipped((v) => !v)}
        role="button"
        tabIndex={0}
        aria-label={flipped ? t('card.showProfile') : t('card.showQr')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped((v) => !v); } }}
      >
        <div className="card-flip-inner" style={{ minHeight: '480px' }}>
          {/* ── FRONT ── */}
          <div className="card-flip-front print-card rounded-[var(--radius-xl)] overflow-hidden bg-[var(--surface-elevated)] shadow-[var(--shadow-card-hover)]">
            {/* Accent bar */}
            <div
              className="h-1 w-full"
              style={{ background: \`linear-gradient(90deg, \${config.accentColor}, \${config.accentColor}cc)\` }}
            />
            {/* Hero gradient header */}
            <div
              className="h-24 w-full"
              style={{ background: \`linear-gradient(160deg, \${config.accentColor}22 0%, \${config.accentColor}08 100%)\` }}
            />
            <div className="px-6 pb-6 space-y-5">
              <ProfileCard config={config} />
              <div className="border-t border-[var(--surface-border)]" />
              <ContactInfo config={config} accentColor={config.accentColor} />
              {config.socials.length > 0 && (
                <>
                  <div className="border-t border-[var(--surface-border)]" />
                  <SocialLinks socials={config.socials} accentColor={config.accentColor} />
                </>
              )}
            </div>
            {/* Flip indicator */}
            <div className="flex items-center justify-center gap-1.5 py-3 border-t border-[var(--surface-border)]">
              <ScanLine className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
              <span className="text-[10px] text-gray-300 dark:text-gray-600 select-none">{t('card.tapToFlip')}</span>
            </div>
          </div>

          {/* ── BACK ── */}
          <div className="card-flip-back rounded-[var(--radius-xl)] overflow-hidden bg-[var(--surface-elevated)] shadow-[var(--shadow-card-hover)]">
            {/* Accent bar */}
            <div
              className="h-1 w-full"
              style={{ background: \`linear-gradient(90deg, \${config.accentColor}, \${config.accentColor}cc)\` }}
            />
            <div className="p-6 flex flex-col items-center gap-5">
              <div className="text-center space-y-1 pt-2">
                <p className="text-base font-bold text-gray-900 dark:text-gray-50">{config.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{config.title}</p>
              </div>
              <QrCode config={config} />
              <div className="w-full" onClick={(e) => e.stopPropagation()}>
                <SaveContactButton config={config} />
              </div>
            </div>
            {/* Flip indicator */}
            <div className="flex items-center justify-center gap-1.5 py-3 border-t border-[var(--surface-border)]">
              <User className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
              <span className="text-[10px] text-gray-300 dark:text-gray-600 select-none">{t('card.tapToFlip')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

// ──────────────────────────────────────────────
// Template lookup helper (for future dynamic loading)
// ──────────────────────────────────────────────
const templateMap = new Map<string, HomepageTemplateContent>();

/**
 * Find a template by slug. O(1) lookup.
 * Preferred over homepageTemplates.find() for deploy-pages API.
 */
export function getTemplateBySlug(slug: string): HomepageTemplateContent | undefined {
  // Lazy-init the map on first access
  if (templateMap.size === 0) {
    for (const tpl of homepageTemplates) {
      templateMap.set(tpl.slug, tpl);
    }
  }
  return templateMap.get(slug);
}

/**
 * Get the set of template slugs that have code bundles available.
 * Used by the templates API to filter out stale DB entries.
 */
export function getAvailableSlugs(): Set<string> {
  if (templateMap.size === 0) {
    for (const tpl of homepageTemplates) {
      templateMap.set(tpl.slug, tpl);
    }
  }
  return new Set(templateMap.keys());
}

/**
 * Get deploy workflow YAML (shared across all MVP templates).
 * Useful for admin/setup-templates and custom template creation.
 */
export function getDeployWorkflow(): string {
  return deployWorkflow;
}

// ──────────────────────────────────────────────
// Export all templates
// ──────────────────────────────────────────────
export const homepageTemplates: HomepageTemplateContent[] = [
  {
    slug: 'link-in-bio-pro',
    repoName: 'link-in-bio-pro',
    description: '내링크모음 - Linkmap으로 생성',
    files: [
      { path: '.gitignore', content: sharedGitignore },
      { path: '.github/workflows/deploy.yml', content: deployWorkflow },
      { path: 'package.json', content: linkInBioPackageJson },
      { path: 'tsconfig.json', content: sharedTsConfig },
      { path: 'postcss.config.mjs', content: sharedPostcssConfig },
      { path: 'next.config.ts', content: sharedNextConfig },
      { path: 'src/app/api/og/route.tsx', content: linkInBioOgRoute },
      { path: 'src/app/globals.css', content: linkInBioGlobalsCss },
      { path: 'src/app/layout.tsx', content: linkInBioLayout },
      { path: 'src/app/page.tsx', content: linkInBioPage },
      { path: 'src/components/animated-reveal.tsx', content: sharedAnimatedReveal },
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
      { path: '.gitignore', content: sharedGitignore },
      { path: '.github/workflows/deploy.yml', content: deployWorkflow },
      { path: 'package.json', content: namecardPackageJson },
      { path: 'tsconfig.json', content: sharedTsConfig },
      { path: 'postcss.config.mjs', content: sharedPostcssConfig },
      { path: 'next.config.ts', content: sharedNextConfig },
      { path: 'src/app/api/og/route.tsx', content: namecardOgRoute },
      { path: 'src/app/globals.css', content: namecardGlobalsCss },
      { path: 'src/app/layout.tsx', content: namecardLayout },
      { path: 'src/app/page.tsx', content: namecardPage },
      { path: 'src/components/animated-reveal.tsx', content: sharedAnimatedReveal },
      { path: 'src/components/contact-info.tsx', content: namecardContactInfo },
      { path: 'src/components/flippable-card.tsx', content: namecardFlippableCard },
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
  personalBrandTemplate,
  freelancerPageTemplate,
  smallBizTemplate,
];
