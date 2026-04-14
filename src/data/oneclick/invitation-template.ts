import type { HomepageTemplateContent } from './homepage-template-content';
import {
  sharedGitignore as gitignore,
  sharedDeployYml as deployYml,
  sharedTsconfigJson as tsconfigJson,
  sharedPostcssConfig as postcssConfig,
  sharedNextConfig as nextConfig,
  sharedAnimatedReveal as animatedReveal,
  sharedSectionWrapper as sectionWrapper,
  sharedLanguageToggle as languageToggle,
  makePackageJson,
} from './shared-template-files';

const packageJson = makePackageJson('invitation');

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
          background: \`linear-gradient(160deg, \${siteConfig.gradientFrom} 0%, \${siteConfig.gradientTo} 100%)\`,
          fontFamily: 'sans-serif',
          padding: '48px',
        }}
      >
        <div style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', textAlign: 'center' }}>
          {siteConfig.title}
        </div>
        <div style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.85)', marginTop: '16px', textAlign: 'center' }}>
          {siteConfig.subtitle}
        </div>
        <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.65)', marginTop: '24px' }}>
          {siteConfig.eventDateLabel}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
`;

// ──────────────────────────────────────────────
// src/app/layout.tsx
// ──────────────────────────────────────────────
const layoutTsx = `import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import './globals.css';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.subtitle,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.subtitle,
    images: [\`\${basePath}/api/og\`],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
`;

// ──────────────────────────────────────────────
// src/app/globals.css
// ──────────────────────────────────────────────
const globalsCss = `@import 'tailwindcss';

:root {
  --inv-bg: #fffdf7;
  --inv-bg-alt: #fef9ee;
  --inv-text-primary: #1a1a1a;
  --inv-text-secondary: #6b5c3e;
  --inv-accent: #b8860b;
  --inv-accent-glow: rgba(184,134,11,0.15);
  --inv-card-bg: #ffffff;
  --inv-card-border: #e8dcc8;
  --inv-gradient-from: #b8860b;
  --inv-gradient-to: #d4a853;
}

* { -webkit-tap-highlight-color: transparent; }

html { scroll-behavior: smooth; }

body {
  background: var(--inv-bg);
  color: var(--inv-text-primary);
  font-family: 'Nanum Myeongjo', 'Pretendard Variable', serif;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 카운트다운 숫자 폰트 */
.tabular-nums { font-variant-numeric: tabular-nums; }

/* 부드러운 섹션 구분선 */
section + section { border-top: 1px solid var(--inv-card-border); }

/* 모바일 최적화 */
@media (max-width: 640px) {
  h1 { font-size: 1.75rem !important; }
  h2 { font-size: 1.25rem !important; }
}

/* 접근성: 모션 감소 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

// ──────────────────────────────────────────────
// src/components/hero-section.tsx
// ──────────────────────────────────────────────
const heroSection = `'use client';

import { AnimatedReveal } from './AnimatedReveal';

interface Props { config: { title: string; titleEn?: string; subtitle: string; subtitleEn?: string; heroImageUrl: string; gradientFrom: string; gradientTo: string; eventType: string; } }

const EVENT_EMOJI: Record<string, string> = {
  gathering: '\\u{1F389}',
  birthday: '\\u{1F382}',
  wedding: '\\u{1F48D}',
  baby: '\\u{1F476}',
  celebration: '\\u{1F389}',
  corporate: '\\u{1F3E2}',
  custom: '\\u{2728}',
};

export function HeroSection({ config }: Props) {
  const emoji = EVENT_EMOJI[config.eventType] || EVENT_EMOJI.custom;
  const bgStyle = config.heroImageUrl
    ? { backgroundImage: \`url(\${config.heroImageUrl})\`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: \`linear-gradient(160deg, \${config.gradientFrom}, \${config.gradientTo})\` };

  return (
    <section className="relative min-h-[65vh] flex flex-col items-center justify-center text-center px-6 py-24" style={bgStyle}>
      {config.heroImageUrl && <div className="absolute inset-0 bg-black/30" />}
      <AnimatedReveal>
        <div className="relative z-10 max-w-md mx-auto">
          <div className="text-4xl mb-6 animate-bounce" style={{ animationDuration: '2s' }}>{emoji}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-snug whitespace-pre-line drop-shadow-sm">
            {config.title}
          </h1>
          {config.subtitle && (
            <p className="mt-5 text-base md:text-lg text-white/80 leading-relaxed">{config.subtitle}</p>
          )}
          <div className="mt-8 w-12 h-px mx-auto bg-white/40" />
        </div>
      </AnimatedReveal>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/countdown-section.tsx
// ──────────────────────────────────────────────
const countdownSection = `'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatedReveal } from './AnimatedReveal';

interface Props { config: { eventDate: string; eventTime: string; eventDateLabel: string; eventDateLabelEn?: string; showCountdown: boolean; countdownStyle: 'flip' | 'simple'; } }

function getTimeLeft(targetDate: Date) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

function FlipCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden shadow-md" style={{ background: 'var(--inv-card-bg)', border: '1px solid var(--inv-card-border)' }}>
        <div className="flex items-center justify-center h-full text-2xl md:text-3xl font-bold tabular-nums" style={{ color: 'var(--inv-accent)' }}>
          {String(value).padStart(2, '0')}
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--inv-text-secondary)' }}>{label}</span>
    </div>
  );
}

function SimpleCounter({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-3">
      <div className="text-3xl md:text-4xl font-bold tabular-nums" style={{ color: 'var(--inv-accent)' }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--inv-text-secondary)' }}>{label}</div>
    </div>
  );
}

export function CountdownSection({ config }: Props) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  const targetMs = useMemo(
    () => new Date(\`\${config.eventDate}T\${config.eventTime || '00:00'}:00\`).getTime(),
    [config.eventDate, config.eventTime],
  );

  useEffect(() => {
    const target = new Date(targetMs);
    setTimeLeft(getTimeLeft(target));
    const timer = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(timer);
  }, [targetMs]);

  const CounterCard = config.countdownStyle === 'simple' ? SimpleCounter : FlipCard;

  return (
    <AnimatedReveal>
      <section className="py-14 px-6 text-center" style={{ background: 'var(--inv-bg-alt)' }}>
        {config.showCountdown && timeLeft && !timeLeft.expired && (
          <div className="flex justify-center gap-3 md:gap-5 mb-8">
            <CounterCard value={timeLeft.days} label="DAYS" />
            <div className="flex items-center text-xl font-light pt-[-8px]" style={{ color: 'var(--inv-text-secondary)' }}>:</div>
            <CounterCard value={timeLeft.hours} label="HOURS" />
            <div className="flex items-center text-xl font-light" style={{ color: 'var(--inv-text-secondary)' }}>:</div>
            <CounterCard value={timeLeft.minutes} label="MIN" />
            <div className="flex items-center text-xl font-light" style={{ color: 'var(--inv-text-secondary)' }}>:</div>
            <CounterCard value={timeLeft.seconds} label="SEC" />
          </div>
        )}
        {timeLeft?.expired && (
          <p className="text-lg font-semibold mb-4" style={{ color: 'var(--inv-accent)' }}>
            행사가 시작되었습니다!
          </p>
        )}
        <p className="text-base font-medium" style={{ color: 'var(--inv-text-primary)' }}>
          {config.eventDateLabel}
        </p>
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/hosts-section.tsx
// ──────────────────────────────────────────────
const hostsSection = `'use client';

import { AnimatedReveal } from './AnimatedReveal';

interface HostItem { name: string; nameEn?: string; role: string; roleEn?: string; phone?: string; avatarUrl?: string; }
interface Props { config: { hostsTitle: string; hostsTitleEn?: string; hosts: HostItem[]; } }

export function HostsSection({ config }: Props) {
  if (!config.hosts?.length) return null;

  return (
    <AnimatedReveal>
      <section className="py-12 px-6">
        <h2 className="text-xl font-semibold text-center mb-8" style={{ color: 'var(--inv-text-primary)' }}>
          {config.hostsTitle}
        </h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-lg mx-auto">
          {config.hosts.map((host, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              {host.avatarUrl ? (
                <img src={host.avatarUrl} alt={host.name} className="w-20 h-20 rounded-full object-cover mb-3 shadow-sm" />
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl mb-3" style={{ background: 'var(--inv-accent-glow)', color: 'var(--inv-accent)' }}>
                  {host.name.charAt(0)}
                </div>
              )}
              <p className="text-sm" style={{ color: 'var(--inv-text-secondary)' }}>{host.role}</p>
              <p className="font-semibold" style={{ color: 'var(--inv-text-primary)' }}>{host.name}</p>
              {host.phone && (
                <a href={\`tel:\${host.phone}\`} className="mt-1 text-sm underline" style={{ color: 'var(--inv-accent)' }}>
                  {host.phone}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/location-section.tsx
// ──────────────────────────────────────────────
const locationSection = `'use client';

import { AnimatedReveal } from './AnimatedReveal';

interface Props { config: { venueName: string; venueAddress: string; kakaoMapUrl: string; naverMapUrl: string; parkingInfo: string; transitInfo: string; } }

export function LocationSection({ config }: Props) {
  if (!config.venueName && !config.venueAddress) return null;

  return (
    <AnimatedReveal>
      <section className="py-12 px-6">
        <h2 className="text-xl font-semibold text-center mb-6" style={{ color: 'var(--inv-text-primary)' }}>
          장소 안내
        </h2>
        <div className="max-w-md mx-auto rounded-xl p-6 shadow-sm" style={{ background: 'var(--inv-card-bg)', border: '1px solid var(--inv-card-border)' }}>
          {config.venueName && <p className="font-semibold text-lg" style={{ color: 'var(--inv-text-primary)' }}>{config.venueName}</p>}
          {config.venueAddress && <p className="mt-1 text-sm" style={{ color: 'var(--inv-text-secondary)' }}>{config.venueAddress}</p>}

          <div className="flex gap-3 mt-4">
            {config.kakaoMapUrl && (
              <a href={config.kakaoMapUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center py-2.5 rounded-lg text-sm font-medium text-white"
                style={{ background: '#FEE500', color: '#191919' }}>
                카카오맵
              </a>
            )}
            {config.naverMapUrl && (
              <a href={config.naverMapUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center py-2.5 rounded-lg text-sm font-medium text-white"
                style={{ background: '#03C75A' }}>
                네이버맵
              </a>
            )}
          </div>

          {(config.parkingInfo || config.transitInfo) && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--inv-card-border)' }}>
              {config.parkingInfo && <p className="text-sm" style={{ color: 'var(--inv-text-secondary)' }}>{config.parkingInfo}</p>}
              {config.transitInfo && <p className="text-sm mt-1" style={{ color: 'var(--inv-text-secondary)' }}>{config.transitInfo}</p>}
            </div>
          )}
        </div>
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/gallery-section.tsx
// ──────────────────────────────────────────────
const gallerySection = `'use client';

import { AnimatedReveal } from './AnimatedReveal';

interface Props { config: { galleryImages: string[]; galleryColumns: number; } }

export function GallerySection({ config }: Props) {
  if (!config.galleryImages?.length) return null;

  return (
    <AnimatedReveal>
      <section className="py-12 px-6">
        <h2 className="text-xl font-semibold text-center mb-6" style={{ color: 'var(--inv-text-primary)' }}>
          갤러리
        </h2>
        <div className="max-w-lg mx-auto grid gap-2" style={{ gridTemplateColumns: \`repeat(\${config.galleryColumns}, 1fr)\` }}>
          {config.galleryImages.map((url, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-lg">
              <img src={url} alt={\`Photo \${i + 1}\`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/account-section.tsx
// ──────────────────────────────────────────────
const accountSection = `'use client';

import { useState } from 'react';
import { AnimatedReveal } from './AnimatedReveal';

interface AccountItem { label: string; bankName: string; accountNumber: string; holder: string; }
interface Props { config: { accountTitle: string; accounts: AccountItem[]; kakaoPayUrl: string; } }

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };
  return (
    <button onClick={handleCopy} className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
      style={{ background: copied ? 'var(--inv-accent)' : 'var(--inv-accent-glow)', color: copied ? '#fff' : 'var(--inv-accent)' }}>
      {copied ? '복사됨!' : '복사'}
    </button>
  );
}

export function AccountSection({ config }: Props) {
  if (!config.accounts?.length && !config.kakaoPayUrl) return null;

  return (
    <AnimatedReveal>
      <section className="py-12 px-6" style={{ background: 'var(--inv-bg-alt)' }}>
        <h2 className="text-xl font-semibold text-center mb-6" style={{ color: 'var(--inv-text-primary)' }}>
          {config.accountTitle}
        </h2>
        <div className="max-w-md mx-auto space-y-3">
          {config.accounts.map((acc, i) => (
            <div key={i} className="rounded-xl p-4 shadow-sm" style={{ background: 'var(--inv-card-bg)', border: '1px solid var(--inv-card-border)' }}>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--inv-text-secondary)' }}>{acc.label}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--inv-text-primary)' }}>{acc.bankName} {acc.accountNumber}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--inv-text-secondary)' }}>{acc.holder}</p>
                </div>
                <CopyButton text={acc.accountNumber} />
              </div>
            </div>
          ))}
          {config.kakaoPayUrl && (
            <a href={config.kakaoPayUrl} target="_blank" rel="noopener noreferrer"
              className="block text-center py-3 rounded-xl font-medium text-sm"
              style={{ background: '#FEE500', color: '#191919' }}>
              카카오페이로 송금하기
            </a>
          )}
        </div>
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/contact-section.tsx
// ──────────────────────────────────────────────
const contactSection = `'use client';

import { AnimatedReveal } from './AnimatedReveal';

interface ContactItem { name: string; phone: string; role?: string; }
interface Props { config: { contacts: ContactItem[]; } }

export function ContactSection({ config }: Props) {
  if (!config.contacts?.length) return null;

  return (
    <AnimatedReveal>
      <section className="py-12 px-6">
        <h2 className="text-xl font-semibold text-center mb-6" style={{ color: 'var(--inv-text-primary)' }}>
          연락처
        </h2>
        <div className="max-w-md mx-auto space-y-2">
          {config.contacts.map((c, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl px-5 py-3.5" style={{ background: 'var(--inv-card-bg)', border: '1px solid var(--inv-card-border)' }}>
              <div>
                {c.role && <span className="text-xs" style={{ color: 'var(--inv-text-secondary)' }}>{c.role} </span>}
                <span className="font-medium" style={{ color: 'var(--inv-text-primary)' }}>{c.name}</span>
              </div>
              <a href={\`tel:\${c.phone}\`} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--inv-accent)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                전화
              </a>
            </div>
          ))}
        </div>
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/lib/config.ts (placeholder — 제너레이터가 실제 생성)
// ──────────────────────────────────────────────
const configTs = `// placeholder — overwritten by generator
export const siteConfig = {
  eventType: 'gathering',
  designPreset: 'elegant-gold',
  title: '함께해 주세요',
  titleEn: "You're Invited",
  subtitle: '소중한 자리에 초대합니다',
  subtitleEn: 'We warmly invite you to join us',
  heroImageUrl: '',
  gradientFrom: '#b8860b',
  gradientTo: '#d4a853',
  eventDate: '2026-06-15',
  eventTime: '14:00',
  eventDateLabel: '2026년 6월 15일 토요일 오후 2시',
  eventDateLabelEn: 'Saturday, June 15, 2026 at 2:00 PM',
  showCountdown: true,
  countdownStyle: 'flip' as 'flip' | 'simple',
  hostsTitle: '초대하는 사람',
  hostsTitleEn: 'Hosted by',
  hosts: [{ name: '홍길동', role: '주최', phone: '', avatarUrl: '' }],
  venueName: '',
  venueNameEn: '',
  venueAddress: '',
  venueAddressEn: '',
  kakaoMapUrl: '',
  naverMapUrl: '',
  parkingInfo: '',
  transitInfo: '',
  galleryImages: [] as string[],
  galleryColumns: 3,
  accountTitle: '마음 전하기',
  accountTitleEn: 'Send Your Wishes',
  accounts: [] as { label: string; bankName: string; accountNumber: string; holder: string; }[],
  kakaoPayUrl: '',
  contacts: [{ name: '홍길동', phone: '010-1234-5678', role: '주최자' }],
};
`;

// ──────────────────────────────────────────────
// src/app/page.tsx (placeholder — 제너레이터가 실제 생성)
// ──────────────────────────────────────────────
const pageTsx = `import { siteConfig } from '@/lib/config';
import { HeroSection } from '@/components/hero-section';
import { CountdownSection } from '@/components/countdown-section';
import { HostsSection } from '@/components/hosts-section';
import { LocationSection } from '@/components/location-section';
import { GallerySection } from '@/components/gallery-section';
import { AccountSection } from '@/components/account-section';
import { ContactSection } from '@/components/contact-section';

export default function Home() {
  return (
    <>
      <main className="min-h-screen" style={{ background: 'var(--inv-bg)' }}>
        <HeroSection config={siteConfig} />
        <CountdownSection config={siteConfig} />
        <HostsSection config={siteConfig} />
        <LocationSection config={siteConfig} />
        <GallerySection config={siteConfig} />
        <AccountSection config={siteConfig} />
        <ContactSection config={siteConfig} />
      </main>
      <footer className="py-6 text-center text-xs" style={{ color: 'var(--inv-text-secondary)', background: 'var(--inv-bg-alt)' }}>
        <a href="https://linkmap.pages.dev" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
          Powered by Linkmap
        </a>
      </footer>
    </>
  );
}
`;

// ──────────────────────────────────────────────
// export
// ──────────────────────────────────────────────
export const invitationTemplate: HomepageTemplateContent = {
  slug: 'invitation',
  repoName: 'invitation',
  description: '모바일 초대장 - Linkmap으로 생성',
  files: [
    { path: '.gitignore', content: gitignore },
    { path: '.github/workflows/deploy.yml', content: deployYml },
    { path: 'package.json', content: packageJson },
    { path: 'tsconfig.json', content: tsconfigJson },
    { path: 'postcss.config.mjs', content: postcssConfig },
    { path: 'next.config.ts', content: nextConfig },
    { path: 'src/app/layout.tsx', content: layoutTsx },
    { path: 'src/app/page.tsx', content: pageTsx },
    { path: 'src/app/globals.css', content: globalsCss },
    { path: 'src/app/api/og/route.tsx', content: ogRoute },
    { path: 'src/lib/config.ts', content: configTs },
    { path: 'src/components/AnimatedReveal.tsx', content: animatedReveal },
    { path: 'src/components/SectionWrapper.tsx', content: sectionWrapper },
    { path: 'src/components/LanguageToggle.tsx', content: languageToggle },
    { path: 'src/components/hero-section.tsx', content: heroSection },
    { path: 'src/components/countdown-section.tsx', content: countdownSection },
    { path: 'src/components/hosts-section.tsx', content: hostsSection },
    { path: 'src/components/location-section.tsx', content: locationSection },
    { path: 'src/components/gallery-section.tsx', content: gallerySection },
    { path: 'src/components/account-section.tsx', content: accountSection },
    { path: 'src/components/contact-section.tsx', content: contactSection },
  ],
};
