/**
 * Homepage template content for one-click deploy.
 * Each template contains the files to be pushed to a new GitHub repo.
 * The setup-templates admin endpoint uses this data to create template repos.
 */

import { devShowcaseTemplate } from './dev-showcase-template';
import { personalBrandTemplate } from './personal-brand-template';
import { freelancerPageTemplate } from './freelancer-page-template';
import { smallBizTemplate } from './small-biz-template';
import { smallBizCafeTemplate } from './small-biz-cafe-template';
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
// 6. Link Card (MVP)
// ──────────────────────────────────────────────
const linkCardPackageJson = makePackageJson('link-card');

const linkCardOgRoute = `import { ImageResponse } from 'next/og';
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

const linkCardGlobalsCss = `@import "tailwindcss";

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
}

/* Hover glow */
.hover-glow { transition: box-shadow 0.3s ease; }
.hover-glow:hover {
  box-shadow: 0 0 20px color-mix(in oklch, var(--color-primary, #6366f1) 30%, transparent),
              0 0 40px color-mix(in oklch, var(--color-primary, #6366f1) 10%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .hover-glow:hover { box-shadow: none; }
}

/* Arrow icon — hover slide right */
.arrow-slide {
  transition: transform 0.2s ease;
}
.group:hover .arrow-slide {
  transform: translateX(3px);
}

/* ── Preset-specific theming ── */

[data-theme="aurora"] {
  --card-bg: rgba(255,255,255,0.08);
  --card-border: rgba(255,255,255,0.12);
  --card-shadow: 0 8px 32px rgba(129,140,248,0.15);
}
[data-theme="aurora"] .link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(129,140,248,0.25);
}
[data-theme="aurora"]::before {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, rgba(129,140,248,0.15), transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(192,132,252,0.1), transparent 50%);
  pointer-events: none;
  z-index: 0;
}

[data-theme="neon"] .link-card {
  border: 1px solid var(--color-primary);
  box-shadow: 0 0 8px color-mix(in oklch, var(--color-primary) 30%, transparent),
              inset 0 0 8px color-mix(in oklch, var(--color-primary) 5%, transparent);
}
[data-theme="neon"] .link-card:hover {
  box-shadow: 0 0 16px color-mix(in oklch, var(--color-primary) 50%, transparent),
              0 0 32px color-mix(in oklch, var(--color-primary) 20%, transparent);
  transform: translateY(-2px);
}

[data-theme="brutalist"] .link-card {
  border: 3px solid currentColor;
  border-radius: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
[data-theme="brutalist"] .link-card:hover {
  transform: translate(-3px, -3px);
  box-shadow: 3px 3px 0 currentColor;
}`;

const linkCardLayout = `import type { Metadata } from 'next';
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

const linkCardPage = `import { siteConfig } from '@/lib/config';
import { getTheme, getBackground } from '@/lib/themes';
import { ProfileSection } from '@/components/profile-section';
import { LinkList } from '@/components/link-list';
import { SocialBar } from '@/components/social-bar';
import { ContentEmbed } from '@/components/content-embed';
import { Footer } from '@/components/footer';

export default function Home() {
  const theme = getTheme(siteConfig.theme);
  const bgStyle = siteConfig.bgStyle || 'light';

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

const linkCardContentEmbed = `'use client';

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

const linkCardFooter = `import { ThemeToggle } from './theme-toggle';
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
        href="https://www.linkmap.biz/sites?utm_source=badge&utm_medium=referral&utm_campaign=link-card"
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

const linkCardLanguageToggle = `'use client';

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

const linkCardLinkList = `'use client';

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
            className={\`link-card card-lift btn-press flex items-center gap-3 px-5 py-3.5 backdrop-blur-sm shadow-sm group transition-all duration-200\${(siteConfig.cardStyle === 'glass' || siteConfig.cardStyle === 'neon') ? ' hover-glow' : ''}\`}
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
            <ExternalLink className="w-4 h-4 opacity-40 shrink-0 arrow-slide" />
          </a>
        );
      })}
    </div>
  );
}`;

const linkCardProfileSection = `'use client';

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
        <div className="avatar-ring" style={{ ['--color-primary' as string]: theme.primary, ['--color-secondary' as string]: theme.primary }}>
          <img
            src={config.avatarUrl}
            alt={name}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover ring-2 ring-[var(--color-primary)]/20 transition-transform duration-200 hover:scale-105"
            style={{ ['--color-primary' as string]: theme.primary, boxShadow: \`0 0 30px \${theme.primary}66\` }}
          />
        </div>
      ) : (
        <div
          className="avatar-ring w-24 h-24"
          style={{ ['--color-primary' as string]: theme.primary, ['--color-secondary' as string]: theme.primary }}
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold ring-2 ring-[var(--color-primary)]/20 transition-transform duration-200 hover:scale-105"
            style={{ ['--color-primary' as string]: theme.primary, backgroundColor: theme.primary, color: '#fff', boxShadow: \`0 0 30px \${theme.primary}66\` }}
            aria-label={name}
          >
            {initials}
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold" style={{ color: theme.text }}>
        {name}
      </h1>
      <p className="text-base max-w-xs text-balance" style={{ color: theme.textMuted }}>
        {bio}
      </p>
    </div>
  );
}`;

const linkCardSocialBar = `'use client';

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

const linkCardThemeToggle = `'use client';

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

const linkCardConfig = `export interface LinkItem {
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
  { title: '내 블로그', titleEn: 'My Blog', url: 'https://blog.example.com', icon: 'pen-line' },
  { title: 'YouTube 채널', titleEn: 'YouTube Channel', url: 'https://youtube.com', icon: 'youtube' },
  { title: '인스타그램', titleEn: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
  { title: '포트폴리오', titleEn: 'Portfolio', url: 'https://portfolio.example.com', icon: 'briefcase' },
  { title: '커피챗 예약', titleEn: 'Book a Coffee Chat', url: 'https://calendly.com', icon: 'coffee' },
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
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || '민지 (Minji)',
  siteNameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || 'Minji',
  bio: process.env.NEXT_PUBLIC_BIO || '일상을 기록하는 콘텐츠 크리에이터',
  bioEn: process.env.NEXT_PUBLIC_BIO_EN || 'Content creator documenting everyday life',
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || 'https://plus.unsplash.com/premium_photo-1664475228198-ffce9c2b6a41?w=200&q=85&auto=format&fit=crop&crop=faces&facepad=2',
  theme: process.env.NEXT_PUBLIC_THEME || 'minimal',
  bgStyle: process.env.NEXT_PUBLIC_BG_STYLE || 'light',
  cardStyle: process.env.NEXT_PUBLIC_CARD_STYLE || 'rounded',
  primaryColor: '#6366f1',
  links: parseJSON<LinkItem[]>(process.env.NEXT_PUBLIC_LINKS, DEMO_LINKS),
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, []),
  youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || null,
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;`;

const linkCardI18n = `'use client';

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

const linkCardThemes = `export interface ThemePreset {
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
    case 'light':
      return { background: \`linear-gradient(180deg, \${theme.backgroundFrom}, \${theme.backgroundTo})\` };
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
    case 'dark':
      return { background: \`linear-gradient(135deg, #0f172a, #1e1b4b)\` };
    case 'glass':
      return {
        background: \`linear-gradient(135deg, \${theme.backgroundFrom}ee, \${theme.backgroundTo}ee)\`,
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
    case 'outline': return '0px';
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
    "tailwindcss": "4.0.17",
    "@tailwindcss/postcss": "4.0.17",
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

  /* Card design tokens */
  --card-bg: #ffffff;
  --card-text: #1a1a1a;
  --card-sub: #555555;
  --card-border: rgba(0, 0, 0, 0.06);
  --card-radius: 16px;
  --card-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
  --page-bg: #f0f2f5;
  --page-text: #1a1a1a;
  --flip-duration: 0.7s;

  /* Surface */
  --surface-elevated: #ffffff;
  --surface-sunken: #f8f9fa;
  --surface-border: rgba(0, 0, 0, 0.06);
  --shadow-card: 0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04);
  --shadow-card-hover: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);

  /* Unified Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 16px;
}

/* ── Design Preset overrides ── */
[data-preset="pro"] {
  --accent: #3b82f6;
  --accent-end: #60a5fa;
}
[data-preset="corporate"] {
  --accent: #1e3a5f;
  --accent-end: #2d5a8e;
}
[data-preset="creative"] {
  --accent: #8b5cf6;
  --accent-end: #a78bfa;
}
[data-preset="minimal-dark"] {
  --accent: #888888;
  --accent-end: #aaaaaa;
  --card-bg: #1a1a1a;
  --card-text: #f0f0f0;
  --card-sub: #999999;
  --card-border: rgba(255,255,255,0.1);
  --card-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3);
  --page-bg: #111111;
  --page-text: #e0e0e0;
  --surface-elevated: #1a1a1a;
  --surface-sunken: #141414;
  --surface-border: rgba(255, 255, 255, 0.06);
  --shadow-card: 0 2px 8px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2);
  --shadow-card-hover: 0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3);
}

.dark {
  --card-bg: #1a1a1a;
  --card-text: #f0f0f0;
  --card-sub: #999999;
  --card-border: rgba(255,255,255,0.1);
  --card-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3);
  --page-bg: #111111;
  --page-text: #e0e0e0;
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

@media (prefers-reduced-motion: reduce) {
  .reveal-fade { opacity: 1; transform: none; transition: none; }
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

/* ── 3D Card Flip ── */
.card-flip-container {
  perspective: 1200px;
  cursor: pointer;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
.card-flip-inner {
  position: relative;
  width: 100%;
  transform-style: preserve-3d;
  transition: transform var(--flip-duration) cubic-bezier(0.4, 0.2, 0.2, 1);
  border-radius: var(--card-radius);
}
.card-flip-container.flipped .card-flip-inner {
  transform: rotateY(180deg);
}
.card-flip-front,
.card-flip-back {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: var(--card-radius);
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: background 0.4s, color 0.4s;
}
.card-flip-front {
  position: relative;
}
.card-flip-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  transform: rotateY(180deg);
}

/* Namecard premium hover (앞면 비플립 상태에서만) */
.card-flip-container:hover .card-flip-inner:not(.flipping) {
  transform: translateY(-4px) rotateX(3deg);
}
.card-flip-container.flipped:hover .card-flip-inner {
  transform: rotateY(180deg) translateY(-4px) rotateX(3deg);
}

/* Paper texture overlay */
.card-flip-front::after,
.card-flip-back::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--card-radius);
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
  opacity: 0.5;
}

/* Shimmer accent bar */
@keyframes shimmer-bar {
  0% { background-position: 100% 0; }
  50% { background-position: 0 0; }
  100% { background-position: 100% 0; }
}
.accent-shimmer {
  height: 6px;
  background-size: 200% 100%;
  animation: shimmer-bar 2.5s ease-in-out infinite;
  border-radius: var(--card-radius) var(--card-radius) 0 0;
}

/* Social chip style */
.social-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 999px;
  border: 1.5px solid var(--accent, #3b82f6);
  color: var(--accent, #3b82f6);
  background: transparent;
  transition: all 0.25s;
  text-decoration: none;
}
.social-chip:hover {
  background: var(--accent, #3b82f6);
  color: #fff;
}

/* QR wrapper */
.qr-box {
  background: #ffffff;
  padding: 8px;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  display: inline-flex;
}

@media (prefers-reduced-motion: reduce) {
  .card-flip-inner { transition: none !important; }
  .card-flip-front, .card-flip-back {
    backface-visibility: visible !important;
    -webkit-backface-visibility: visible !important;
    transform: none !important;
    transition: opacity 0.3s;
  }
  .card-flip-container.flipped .card-flip-front { opacity: 0; position: absolute; pointer-events: none; }
  .card-flip-container.flipped .card-flip-back { opacity: 1; position: relative; }
  .card-flip-container:not(.flipped) .card-flip-front { opacity: 1; position: relative; }
  .card-flip-container:not(.flipped) .card-flip-back { opacity: 0; position: absolute; pointer-events: none; }
  .accent-shimmer { animation: none !important; }
  .card-lift:hover { transform: none; }
}

@media (max-width: 460px) {
  .card-front-body { padding: 24px 20px 20px !important; }
  .card-back-body { padding: 20px 16px 16px !important; }
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
        {/* Dark mode init — run before first paint */}
        <script dangerouslySetInnerHTML={{ __html: "(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}})()" }} />
        {/* Hint pulse keyframe */}
        <style dangerouslySetInnerHTML={{ __html: "@keyframes pulse-hint{0%,100%{opacity:.6}50%{opacity:1}}" }} />
        {/* Google Analytics */}
        {siteConfig.gaId && (
          <>
            <script async src={\`https://www.googletagmanager.com/gtag/js?id=\${siteConfig.gaId}\`} />
            <script dangerouslySetInnerHTML={{ __html: \`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','\${siteConfig.gaId}')\` }} />
          </>
        )}
        {/* Structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: siteConfig.name, jobTitle: siteConfig.title, ...(siteConfig.company ? { worksFor: { '@type': 'Organization', name: siteConfig.company } } : {}), ...(siteConfig.email || siteConfig.phone ? { contactPoint: { '@type': 'ContactPoint', ...(siteConfig.email ? { email: siteConfig.email } : {}), ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}) } } : {}), ...(siteConfig.website ? { url: siteConfig.website } : {}), ...(siteConfig.socials?.length ? { sameAs: siteConfig.socials.map((s: { url: string }) => s.url) } : {}) }) }} />
      </head>
      <body className="antialiased" style={{ fontFamily: \`'\${siteConfig.fontFamily}', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif\` }}>
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
    <main
      id="main"
      data-preset={siteConfig.designPreset}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: 'var(--page-bg)', color: 'var(--page-text)', transition: 'background 0.4s, color 0.4s' }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
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
    config.email ? { icon: Mail, label: config.email, href: \`mailto:\${config.email}\`, isExternal: false, ariaLabel: t('contact.email') } : null,
    config.phone ? { icon: Phone, label: config.phone, href: \`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`, isExternal: false, ariaLabel: t('contact.call') } : null,
    address ? { icon: MapPin, label: address, href: \`https://maps.google.com/?q=\${encodeURIComponent(address)}\`, isExternal: true, ariaLabel: t('contact.map') } : null,
    config.website ? { icon: Globe, label: config.website.replace(/^https?:\\/\\//, ''), href: config.website, isExternal: true, ariaLabel: t('contact.website') } : null,
  ].filter(Boolean) as Array<{ icon: typeof Phone; label: string; href: string; isExternal: boolean; ariaLabel: string }>;
  if (items.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, i) => (
        <a
          key={i}
          href={item.href}
          target={item.isExternal ? '_blank' : undefined}
          rel={item.isExternal ? 'noopener noreferrer' : undefined}
          aria-label={item.ariaLabel}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5, color: 'var(--card-text)', textDecoration: 'none' }}
        >
          <item.icon
            size={18}
            style={{ flexShrink: 0, color: accent, marginTop: 2 }}
            aria-hidden="true"
          />
          <span style={{ wordBreak: 'break-all', fontSize: '0.85rem' }}>{item.label}</span>
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

function AvatarSvg({ accentColor }: { accentColor: string }) {
  const accentEnd = accentColor + 'aa';
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="avatarGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="100%" stopColor={accentEnd} />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="60" fill="url(#avatarGrad)" />
      {/* Body */}
      <ellipse cx="60" cy="108" rx="32" ry="18" fill="#4a5568" />
      {/* Neck */}
      <rect x="52" y="78" width="16" height="10" rx="4" fill="#fcd5b4" />
      {/* Shirt */}
      <path d="M34 108 C34 90 46 82 60 82 C74 82 86 90 86 108" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
      {/* Collar */}
      <path d="M50 82 L60 94 L70 82" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="60" cy="52" rx="26" ry="30" fill="#fcd5b4" />
      {/* Hair */}
      <path d="M34 46 C34 28 46 16 60 16 C74 16 86 28 86 46 C86 38 80 24 60 24 C40 24 34 38 34 46Z" fill="#2d3748" />
      <path d="M34 46 C32 52 32 42 34 36" fill="#2d3748" />
      <path d="M86 46 C88 52 88 42 86 36" fill="#2d3748" />
      {/* Eyes */}
      <ellipse cx="48" cy="52" rx="3.5" ry="4" fill="#2d3748" />
      <ellipse cx="72" cy="52" rx="3.5" ry="4" fill="#2d3748" />
      <circle cx="49.5" cy="50.5" r="1.2" fill="#fff" />
      <circle cx="73.5" cy="50.5" r="1.2" fill="#fff" />
      {/* Eyebrows */}
      <path d="M42 44 Q48 40 54 44" fill="none" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" />
      <path d="M66 44 Q72 40 78 44" fill="none" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" />
      {/* Nose */}
      <path d="M58 58 Q60 62 62 58" fill="none" stroke="#e8b796" strokeWidth="1.5" strokeLinecap="round" />
      {/* Smile */}
      <path d="M50 66 Q60 74 70 66" fill="none" stroke="#c5705d" strokeWidth="2" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="42" cy="62" r="5" fill="#fdb4b4" opacity="0.35" />
      <circle cx="78" cy="62" r="5" fill="#fdb4b4" opacity="0.35" />
      {/* Glasses */}
      <rect x="38" y="46" width="18" height="14" rx="5" fill="none" stroke={accentColor} strokeWidth="2" />
      <rect x="64" y="46" width="18" height="14" rx="5" fill="none" stroke={accentColor} strokeWidth="2" />
      <path d="M56 52 L64 52" stroke={accentColor} strokeWidth="2" />
    </svg>
  );
}

export function ProfileCard({ config }: Props) {
  const { locale } = useLocale();
  const name = locale === 'en' && config.nameEn ? config.nameEn : config.name;
  const nameSecondary = locale === 'ko' && config.nameEn ? config.nameEn : (locale === 'en' && config.name !== name ? config.name : null);
  const title = locale === 'en' && config.titleEn ? config.titleEn : config.title;
  const company = locale === 'en' && config.companyEn ? config.companyEn : config.company;
  return (
    <div className="flex flex-col items-center text-center gap-1 py-8 px-6">
      {/* Avatar */}
      <div
        className="w-22 h-22 rounded-full overflow-hidden mb-3 shadow-md"
        style={{ width: 88, height: 88, flexShrink: 0 }}
        aria-label={name}
      >
        {config.avatarUrl
          ? (<img src={config.avatarUrl} alt={name} width={88} height={88} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />)
          : (<AvatarSvg accentColor={config.accentColor} />)
        }
      </div>
      {/* Name */}
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--card-text)' }}>{name}</h1>
      {nameSecondary && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--card-sub)', marginBottom: 4 }}>{nameSecondary}</p>
      )}
      {/* Title */}
      <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: config.accentColor }}>{title}</p>
      {/* Company */}
      {company && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--card-sub)', marginTop: 2 }}>{company}</p>
      )}
    </div>
  );
}`;

const namecardQrCode = `'use client';

import { QRCodeSVG } from 'qrcode.react';
import { generateVCard } from '@/lib/vcard';
import type { SiteConfig } from '@/lib/config';

interface Props { config: SiteConfig; }

export function QrCode({ config }: Props) {
  const vcard = generateVCard({
    name: config.name,
    title: config.title,
    company: config.company,
    email: config.email,
    phone: config.phone,
    address: config.address,
    website: config.website,
  });
  return (
    <QRCodeSVG
      value={vcard}
      size={88}
      level="M"
      bgColor="#ffffff"
      fgColor="#111827"
    />
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
      style={{
        width: '100%',
        padding: '12px 0',
        borderRadius: 12,
        border: 'none',
        background: config.accentColor,
        color: '#ffffff',
        fontFamily: 'inherit',
        fontSize: '0.875rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: 'pointer',
        transition: 'opacity 0.2s, transform 0.15s',
        boxShadow: \`0 4px 14px \${config.accentColor}40\`,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
      onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)'; }}
      onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
    >
      <Download size={16} aria-hidden="true" />
      {t('save.contact')}
    </button>
  );
}`;

const namecardSocialLinks = `'use client';

import { Linkedin, Instagram, Github, Facebook, Youtube, Globe, type LucideIcon } from 'lucide-react';
import type { SocialItem } from '@/lib/config';

/* X (formerly Twitter) inline SVG icon */
function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.856L1.548 2.25h6.89l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.24 8.24 0 0 0 4.82 1.55V6.79a4.85 4.85 0 0 1-1.05-.1z" />
    </svg>
  );
}

function ThreadsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.34-.776-.94-1.41-1.738-1.854a7.025 7.025 0 0 1-.345 2.994c-.442 1.237-1.2 2.202-2.233 2.835-1.008.618-2.22.908-3.6.862-1.658-.055-3.005-.646-3.895-1.71-.82-.98-1.263-2.264-1.248-3.614.03-2.514 1.89-4.336 4.636-4.544l.091-.004c1.478-.042 2.794.34 3.803 1.105.473.358.857.794 1.145 1.293.553-.14 1.06-.227 1.512-.247h.029c.576 0 1.11.15 1.59.447.94.582 1.524 1.59 1.736 2.998.136.895.094 1.97-.123 3.095-.68 3.512-2.834 5.638-6.44 6.34-.592.116-1.22.175-1.87.181zm-.036-9.894c-1.73.135-2.683 1.133-2.7 2.818-.01.845.27 1.556.788 2.003.538.464 1.328.71 2.288.743.898.03 1.685-.163 2.342-.574.672-.42 1.168-1.055 1.472-1.886.33-.9.382-1.87.152-2.804-.424-.254-.93-.387-1.504-.397-.168 0-.35.01-.546.032a8.545 8.545 0 0 0-2.292.065z" />
    </svg>
  );
}

const socialIcons: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  instagram: Instagram,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
};

const socialLabels: Record<string, string> = {
  linkedin: 'LinkedIn',
  twitter: 'X',
  x: 'X',
  instagram: 'Instagram',
  github: 'GitHub',
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  threads: 'Threads',
};

interface Props { socials: SocialItem[]; accentColor: string; }

export function SocialLinks({ socials, accentColor }: Props) {
  if (!socials.length) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
      {socials.map((social, i) => {
        const platform = social.platform.toLowerCase();
        const label = socialLabels[platform] ?? social.platform;
        const isX = platform === 'twitter' || platform === 'x';
        const isTikTok = platform === 'tiktok';
        const isThreads = platform === 'threads';
        const Icon = (isX || isTikTok || isThreads) ? null : (socialIcons[platform] ?? Globe);
        return (
          <a
            key={i}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="social-chip"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            {isX && <XIcon size={14} />}
            {isTikTok && <TikTokIcon size={14} />}
            {isThreads && <ThreadsIcon size={14} />}
            {Icon && <Icon size={14} />}
            {label}
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

export type DesignPreset = 'pro' | 'corporate' | 'creative' | 'minimal-dark';

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function parsePreset(raw: string | undefined): DesignPreset {
  const valid: DesignPreset[] = ['pro', 'corporate', 'creative', 'minimal-dark'];
  return valid.includes(raw as DesignPreset) ? (raw as DesignPreset) : 'pro';
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
  designPreset: parsePreset(process.env.NEXT_PUBLIC_DESIGN_PRESET),
  fontFamily: process.env.NEXT_PUBLIC_FONT_FAMILY || 'Pretendard Variable',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;`;

const namecardI18n = `'use client';

import { useSyncExternalStore } from 'react';

export type Locale = 'ko' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  ko: { 'contact.call': '전화하기', 'contact.email': '이메일 보내기', 'contact.map': '지도에서 보기', 'contact.website': '웹사이트 방문', 'qr.hint': '명함 공유 QR', 'save.contact': '연락처에 저장', 'theme.light': '라이트 모드로 전환', 'theme.dark': '다크 모드로 전환', 'footer.powered': 'Powered by', 'lang.switchLabel': 'Switch to English', 'lang.toggle': 'EN', 'card.showProfile': '탭하여 앞면 보기', 'card.tapToFlip': '카드를 클릭하여 뒤집기' },
  en: { 'contact.call': 'Call', 'contact.email': 'Send email', 'contact.map': 'View on map', 'contact.website': 'Visit website', 'qr.hint': 'Share QR', 'save.contact': 'Save Contact', 'theme.light': 'Switch to light mode', 'theme.dark': 'Switch to dark mode', 'footer.powered': 'Powered by', 'lang.switchLabel': '한국어로 전환', 'lang.toggle': '한국어', 'card.showProfile': 'Tap to see front', 'card.tapToFlip': 'Click to flip card' },
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

import { useState, useEffect, useRef } from 'react';
import type { SiteConfig } from '@/lib/config';
import { ProfileCard } from '@/components/profile-card';
import { ContactInfo } from '@/components/contact-info';
import { SocialLinks } from '@/components/social-links';
import { QrCode } from '@/components/qr-code';
import { SaveContactButton } from '@/components/save-contact-button';
import { useLocale } from '@/lib/i18n';

interface Props { config: SiteConfig; }

export function FlippableCard({ config }: Props) {
  const [flipped, setFlipped] = useState(false);
  const { t } = useLocale();
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  /* Sync back face min-height to front face height */
  useEffect(() => {
    function sync() {
      if (frontRef.current && backRef.current) {
        backRef.current.style.minHeight = frontRef.current.offsetHeight + 'px';
      }
    }
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  const accentGradient = \`linear-gradient(90deg, \${config.accentColor}, \${config.accentColor}aa, \${config.accentColor})\`;

  return (
    <div style={{ width: '100%' }}>
      {/* Flip hint */}
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--card-sub)', marginBottom: 12, userSelect: 'none', animation: 'pulse-hint 2s ease-in-out infinite' }}>
        {flipped ? t('card.showProfile') : t('card.tapToFlip')}
      </p>

      <div
        className={\`card-flip-container\${flipped ? ' flipped' : ''}\`}
        onClick={() => setFlipped((v) => !v)}
        role="button"
        tabIndex={0}
        aria-label={flipped ? t('card.showProfile') : t('card.tapToFlip')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped((v) => !v); } }}
        data-preset={config.designPreset}
      >
        <div className="card-flip-inner">

          {/* ── FRONT: Profile ── */}
          <div className="card-flip-front print-card" ref={frontRef}>
            {/* Shimmer accent bar */}
            <div
              className="accent-shimmer"
              style={{ background: accentGradient }}
            />
            {/* Profile section */}
            <ProfileCard config={config} />
          </div>

          {/* ── BACK: Contact + Social + QR ── */}
          <div className="card-flip-back" ref={backRef}>
            {/* Shimmer accent bar */}
            <div
              className="accent-shimmer"
              style={{ background: accentGradient }}
            />
            <div className="card-back-body" style={{ padding: '28px 24px 24px', display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.85rem', color: 'var(--card-text)' }}>
              {/* Contact section */}
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: config.accentColor, marginBottom: 2 }}>Contact</p>
              <ContactInfo config={config} accentColor={config.accentColor} />

              {/* Social section */}
              {config.socials.length > 0 && (
                <>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: config.accentColor, marginTop: 4, marginBottom: 2 }}>Social</p>
                  <SocialLinks socials={config.socials} accentColor={config.accentColor} />
                </>
              )}

              {/* QR Code */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <div className="qr-box">
                  <QrCode config={config} />
                </div>
                <span style={{ fontSize: '0.625rem', color: 'var(--card-sub)', letterSpacing: '0.04em' }}>{t('qr.hint')}</span>
              </div>

              {/* Save Contact */}
              <div onClick={(e) => e.stopPropagation()}>
                <SaveContactButton config={config} />
              </div>
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
    slug: 'link-card',
    repoName: 'link-card',
    description: '내 링크 카드 - Linkmap으로 생성',
    files: [
      { path: '.gitignore', content: sharedGitignore },
      { path: '.github/workflows/deploy.yml', content: deployWorkflow },
      { path: 'package.json', content: linkCardPackageJson },
      { path: 'tsconfig.json', content: sharedTsConfig },
      { path: 'postcss.config.mjs', content: sharedPostcssConfig },
      { path: 'next.config.ts', content: sharedNextConfig },
      { path: 'src/app/api/og/route.tsx', content: linkCardOgRoute },
      { path: 'src/app/globals.css', content: linkCardGlobalsCss },
      { path: 'src/app/layout.tsx', content: linkCardLayout },
      { path: 'src/app/page.tsx', content: linkCardPage },
      { path: 'src/components/animated-reveal.tsx', content: sharedAnimatedReveal },
      { path: 'src/components/content-embed.tsx', content: linkCardContentEmbed },
      { path: 'src/components/footer.tsx', content: linkCardFooter },
      { path: 'src/components/language-toggle.tsx', content: linkCardLanguageToggle },
      { path: 'src/components/link-list.tsx', content: linkCardLinkList },
      { path: 'src/components/profile-section.tsx', content: linkCardProfileSection },
      { path: 'src/components/social-bar.tsx', content: linkCardSocialBar },
      { path: 'src/components/theme-toggle.tsx', content: linkCardThemeToggle },
      { path: 'src/lib/config.ts', content: linkCardConfig },
      { path: 'src/lib/i18n.tsx', content: linkCardI18n },
      { path: 'src/lib/themes.ts', content: linkCardThemes },
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
  smallBizCafeTemplate,
];
