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
  sharedCountUp as countUp,
  sharedPremiumAnimations,
  makePackageJson,
} from './shared-template-files';

const packageJson = makePackageJson('personal-brand');

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
          background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #ee5b2b, #f59e0b)',
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
  --color-primary: #ee5b2b;
  --color-secondary: #f59e0b;
}

/* ── Design Tokens (Light) ── */
:root {
  /* Brand */
  --brand-primary: #ee5b2b;
  --brand-secondary: #f59e0b;
  --brand-glow: rgba(238, 91, 43, 0.15);
  --brand-gradient: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));

  /* Backgrounds */
  --bg: #ffffff;
  --bg-alt: #faf9f7;
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-surface: rgba(0, 0, 0, 0.02);

  /* Text */
  --text-primary: #1a1a1a;
  --text-secondary: #5c5c5c;
  --text-tertiary: #8a8a8a;
  --text-muted: #a1a1aa;
  --border-color: rgba(0, 0, 0, 0.08);

  /* Surface */
  --surface-elevated: #ffffff;
  --surface-sunken: #f8f9fa;
  --surface-border: #e8e5e1;
  --surface-hover: #f5f3f0;

  /* Shadow */
  --shadow-sm: 0 1px 3px rgba(0,0,0,.06);
  --shadow-md: 0 4px 16px rgba(0,0,0,.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,.1);
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.04);

  /* Radius */
  --radius-sm: 10px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Spacing */
  --section-gap: clamp(4rem, 8vw, 7rem);
  --section-padding-x: clamp(1rem, 4vw, 3rem);

  /* Fluid Typography */
  --text-hero: clamp(2.5rem, 6vw, 5rem);
  --text-section: clamp(1.75rem, 3vw, 2.5rem);
  --text-body: clamp(0.9375rem, 1vw, 1.0625rem);

  /* Transition */
  --transition: .3s cubic-bezier(.4,0,.2,1);

  /* Computed */
  --brand-primary-hover: color-mix(in oklch, var(--brand-primary) 85%, white);
  --brand-primary-subtle: color-mix(in oklch, var(--brand-primary) 8%, transparent);
  --color-primary: #ee5b2b;
  --color-secondary: #f59e0b;
}

/* ── Dark Mode ── */
.dark {
  --bg: #0f0f0f;
  --bg-alt: #171717;
  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --bg-surface: rgba(255, 255, 255, 0.02);
  --text-primary: #f0f0f0;
  --text-secondary: #a0a0a0;
  --text-tertiary: #666666;
  --text-muted: #71717a;
  --border-color: rgba(255, 255, 255, 0.05);
  --surface-elevated: #1a1a1a;
  --surface-sunken: #141414;
  --surface-border: #2a2a2a;
  --surface-hover: #222222;
  --shadow-sm: 0 1px 3px rgba(0,0,0,.3);
  --shadow-md: 0 4px 16px rgba(0,0,0,.4);
  --shadow-lg: 0 12px 40px rgba(0,0,0,.5);
  --shadow-card: 0 1px 3px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.15);
  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.2);
}

/* ── Preset: Minimal ── */
[data-preset="minimal"] {
  --brand-primary: #18181b;
  --brand-secondary: #52525b;
  --brand-glow: rgba(24, 24, 27, 0.1);
  --color-primary: #18181b;
  --color-secondary: #52525b;
  --brand-gradient: linear-gradient(135deg, #18181b, #52525b);
}

/* ── Preset: Creator (default — inherits :root) ── */
[data-preset="creator"] {
  --brand-primary: #ee5b2b;
  --brand-secondary: #f59e0b;
  --brand-gradient: linear-gradient(135deg, #ee5b2b, #f59e0b);
}

/* ── Preset: Storyteller ── */
[data-preset="storyteller"] {
  --brand-primary: #6366f1;
  --brand-secondary: #8b5cf6;
  --brand-glow: rgba(99, 102, 241, 0.15);
  --color-primary: #6366f1;
  --color-secondary: #8b5cf6;
  --brand-gradient: linear-gradient(135deg, #6366f1, #8b5cf6);
}

/* ── Preset: Editorial ── */
[data-preset="editorial"] {
  --brand-primary: #1c1c1e;
  --brand-secondary: #3a3a3c;
  --brand-glow: rgba(28, 28, 30, 0.12);
  --color-primary: #1c1c1e;
  --color-secondary: #3a3a3c;
  --brand-gradient: linear-gradient(135deg, #1c1c1e, #3a3a3c);
}

/* ── Preset: Magazine ── */
[data-preset="magazine"] {
  --brand-primary: #d4163c;
  --brand-secondary: #ff6b35;
  --brand-glow: rgba(212, 22, 60, 0.15);
  --color-primary: #d4163c;
  --color-secondary: #ff6b35;
  --brand-gradient: linear-gradient(135deg, #d4163c, #ff6b35);
}

/* ── Preset: Warm Earth ── */
[data-preset="warm-earth"] {
  --brand-primary: #92400e;
  --brand-secondary: #b45309;
  --brand-glow: rgba(146, 64, 14, 0.12);
  --color-primary: #92400e;
  --color-secondary: #b45309;
  --brand-gradient: linear-gradient(135deg, #92400e, #b45309);
  --bg: #fefce8;
  --bg-alt: #fef3c7;
  --surface-border: #fde68a;
}

/* ── Preset: Midnight ── */
[data-preset="midnight"] {
  --brand-primary: #818cf8;
  --brand-secondary: #c084fc;
  --brand-glow: rgba(129, 140, 248, 0.2);
  --color-primary: #818cf8;
  --color-secondary: #c084fc;
  --brand-gradient: linear-gradient(135deg, #818cf8, #c084fc);
  --bg: #0f0f0f;
  --bg-alt: #171717;
  --text-primary: #f0f0f0;
  --text-secondary: #a0a0a0;
  --surface-elevated: #1a1a1a;
  --surface-border: #2a2a2a;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2);
  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3);
  --shadow-lg: 0 12px 40px rgba(0,0,0,.5);
}

/* ── Preset: Terminal ── */
[data-preset="terminal"] {
  --brand-primary: #10b981;
  --brand-secondary: #34d399;
  --brand-glow: rgba(16, 185, 129, 0.15);
  --color-primary: #10b981;
  --color-secondary: #34d399;
  --brand-gradient: linear-gradient(135deg, #10b981, #34d399);
  --bg: #0a0a0a;
  --bg-alt: #111111;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --surface-elevated: #1a1a1a;
  --surface-border: #1e293b;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2);
  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3);
  --shadow-lg: 0 12px 40px rgba(0,0,0,.5);
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

/* Section alternating backgrounds */
.section-alt {
  background: var(--bg-alt);
}

/* Mesh gradient background */
.mesh-gradient-bg {
  background:
    radial-gradient(ellipse at 20% 30%, var(--brand-primary-subtle, rgba(238,91,43,0.08)), transparent 50%),
    radial-gradient(ellipse at 80% 70%, color-mix(in oklch, var(--brand-secondary, #f59e0b) 6%, transparent), transparent 50%);
}

*:focus-visible {
  outline: 2px solid var(--color-primary, #3b82f6);
  outline-offset: 2px;
}

/* ── Reveal animations ── */
.reveal-fade {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-fade.revealed {
  opacity: 1;
  transform: translateY(0);
}
.reveal-slide-left { opacity: 0; transform: translateX(-32px); transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal-slide-left.revealed { opacity: 1; transform: translateX(0); }
.reveal-slide-right { opacity: 0; transform: translateX(32px); transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal-slide-right.revealed { opacity: 1; transform: translateX(0); }
.reveal-scale { opacity: 0; transform: scale(0.95); transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal-scale.revealed { opacity: 1; transform: scale(1); }
@media (prefers-reduced-motion: reduce) {
  .reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-scale { opacity: 1; transform: none; transition: none; }
}

/* ── Card interactions ── */
.card-hover {
  transition: transform 0.25s var(--transition), box-shadow 0.25s var(--transition), border-color 0.25s var(--transition);
}
.card-hover:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.card-lift {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: var(--shadow-card);
}
.card-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

/* Value card with gradient top bar */
.value-card {
  background: var(--surface-elevated);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  padding: 2rem 1.75rem;
  position: relative;
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
}
.value-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--brand-gradient);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .4s cubic-bezier(.4,0,.2,1);
}
.value-card:hover::before { transform: scaleX(1); }
.value-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--brand-primary);
}

.value-icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(238,91,43,.1), rgba(245,158,11,.1));
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  margin-bottom: 1.25rem;
}
.dark .value-icon {
  background: linear-gradient(135deg, rgba(238,91,43,.15), rgba(245,158,11,.15));
}

/* Highlight item */
.highlight-item {
  padding: 2.5rem 1.5rem;
  background: var(--surface-elevated);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: transform var(--transition), box-shadow var(--transition);
}
.highlight-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.highlight-number {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
}
.highlight-label {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  font-weight: 500;
}

/* Button press */
.btn-press { transition: transform 0.15s ease; }
.btn-press:active { transform: scale(0.97); }

/* Hover glow */
.hover-glow { position: relative; }
.hover-glow::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: calc(var(--radius-lg) + 2px);
  background: var(--brand-gradient);
  opacity: 0;
  z-index: -1;
  filter: blur(16px);
  transition: opacity .4s ease;
}
.hover-glow:hover::after { opacity: .2; }

/* Stagger children */
.stagger-children > *:nth-child(1) { transition-delay: 0ms; }
.stagger-children > *:nth-child(2) { transition-delay: 80ms; }
.stagger-children > *:nth-child(3) { transition-delay: 160ms; }
.stagger-children > *:nth-child(4) { transition-delay: 240ms; }
.stagger-children > *:nth-child(5) { transition-delay: 320ms; }
.stagger-children > *:nth-child(6) { transition-delay: 400ms; }

/* Section gap utility */
.section-gap { padding-top: var(--section-gap, 4rem); padding-bottom: var(--section-gap, 4rem); }

@media (prefers-reduced-motion: reduce) {
  .card-lift:hover, .card-hover:hover, .value-card:hover, .highlight-item:hover { transform: none; }
  .btn-press:active { transform: none; }
  .value-card::before { transition: none; }
}

/* ── Section label ── */
.section-label {
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--brand-primary);
  margin-bottom: 0.75rem;
  display: block;
}

/* ── Bento grid ── */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
@media (min-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .bento-grid > *:first-child {
    grid-row: span 2;
    grid-column: span 2;
  }
}
.bento-grid > * {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg, 16px);
}
.bento-grid > * img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.bento-grid > *:hover img {
  transform: scale(1.05);
}

/* ── Masonry gallery ── */
.masonry-gallery {
  columns: 2;
  column-gap: 1rem;
}
@media (min-width: 768px) {
  .masonry-gallery {
    columns: 3;
    column-gap: 1.25rem;
  }
}
.masonry-gallery > * {
  break-inside: avoid;
  margin-bottom: 1rem;
}
@media (min-width: 768px) {
  .masonry-gallery > * {
    margin-bottom: 1.25rem;
  }
}

/* Masonry item hover overlay */
.masonry-item {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: transform var(--transition);
}
.masonry-item:hover { transform: scale(1.02); }
.masonry-item img {
  width: 100%; height: auto; display: block;
  transition: transform .6s cubic-bezier(.4,0,.2,1);
}
.masonry-item:hover img { transform: scale(1.05); }
.masonry-item .masonry-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,.25));
  opacity: 0;
  transition: opacity var(--transition);
  pointer-events: none;
}
.masonry-item:hover .masonry-overlay { opacity: 1; }

/* ── Contact links ── */
.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: var(--surface-elevated);
  border: 1px solid var(--surface-border);
  border-radius: 50px;
  color: var(--text-primary);
  font-size: .95rem;
  font-weight: 500;
  text-decoration: none;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
}
.contact-link:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--brand-primary);
}

/* ── Scroll progress ── */
.scroll-progress {
  position: fixed;
  top: 56px;
  left: 0;
  height: 2px;
  background: var(--brand-gradient);
  z-index: 100;
  transition: width 0.1s linear;
  pointer-events: none;
}

/* ── Hero editorial (2-column) ── */
.hero-editorial {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
  width: 100%;
}
@media (min-width: 768px) {
  .hero-editorial {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}
.hero-editorial .hero-text-col { order: 1; }
@media (min-width: 768px) {
  .hero-editorial .hero-text-col { order: 1; }
}
.hero-editorial .hero-img-col { order: 2; }
@media (min-width: 768px) {
  .hero-editorial .hero-img-col { order: 2; }
}

/* ── Hero image wrapper ── */
.hero-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16/10;
  max-height: 320px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}
@media (min-width: 768px) {
  .hero-image-wrapper {
    aspect-ratio: 4/5;
    max-height: none;
  }
}
.hero-image-wrapper img {
  width: 100%; height: 100%; object-fit: cover;
}
.hero-image-wrapper::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(0,0,0,.12));
  pointer-events: none;
}

/* ── Hero name gradient ── */
.hero-name-gradient {
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Hero load animation ── */
@keyframes fade-up { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
.animate-fade-up { animation: fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
.animate-fade-up-d1 { animation-delay:150ms; opacity:0; }
.animate-fade-up-d2 { animation-delay:300ms; opacity:0; }
@media (prefers-reduced-motion:reduce) {
  .animate-fade-up { animation:none; opacity:1; transform:none; }
}
`;

// premium animations are appended at runtime via template literal
const globalsCssWithPremium = globalsCss + sharedPremiumAnimations;

// ──────────────────────────────────────────────
// src/app/layout.tsx
// ──────────────────────────────────────────────
const layoutTsx = `import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: \`\${siteConfig.name} — \${siteConfig.tagline}\`,
  description: siteConfig.tagline,
  openGraph: {
    title: \`\${siteConfig.name} — \${siteConfig.tagline}\`,
    description: siteConfig.tagline,
    type: 'profile',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
    title: \`\${siteConfig.name} — \${siteConfig.tagline}\`,
    description: siteConfig.tagline,
  },
  robots: { index: true, follow: true },
};

/** Map fontFamily setting to a CDN href. Returns null for system fonts. */
function getFontHref(font: string): string | null {
  const map: Record<string, string> = {
    Pretendard: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
    'Noto Sans KR': 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
    'IBM Plex Sans KR': 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&display=swap',
    '나눔고딕': 'https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap',
    '나눔명조': 'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap',
    'Gmarket Sans': 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
    Inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
    Poppins: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap',
  };
  return map[font] ?? map['Pretendard'];
}

/** CSS font-family stack per setting */
function getFontStack(font: string): string {
  const stacks: Record<string, string> = {
    Pretendard: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    'Noto Sans KR': "'Noto Sans KR', sans-serif",
    'IBM Plex Sans KR': "'IBM Plex Sans KR', sans-serif",
    '나눔고딕': "'Nanum Gothic', sans-serif",
    '나눔명조': "'Nanum Myeongjo', serif",
    'Gmarket Sans': "'GmarketSans', 'Pretendard Variable', sans-serif",
    Inter: "Inter, system-ui, sans-serif",
    Poppins: "Poppins, system-ui, sans-serif",
  };
  return stacks[font] ?? stacks['Pretendard'];
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontHref = getFontHref(siteConfig.fontFamily);
  const fontStack = getFontStack(siteConfig.fontFamily);

  return (
    <html lang="ko" data-preset={siteConfig.designPreset || 'creator'} suppressHydrationWarning>
      <head>
        {fontHref && (
          <link
            rel="stylesheet"
            crossOrigin="anonymous"
            href={fontHref}
          />
        )}
        {/* Inline critical font-family override */}
        <style dangerouslySetInnerHTML={{ __html: \`body { font-family: \${fontStack}; }\` }} />
        {/* Theme init — runs before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: \`(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()\`,
          }}
        />
        {/* Google Analytics */}
        {siteConfig.gaId && (
          <>
            <script async src={\`https://www.googletagmanager.com/gtag/js?id=\${siteConfig.gaId}\`} />
            <script
              dangerouslySetInnerHTML={{
                __html: \`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','\${siteConfig.gaId}');\`,
              }}
            />
          </>
        )}
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: siteConfig.name,
              description: siteConfig.tagline,
              ...(siteConfig.email ? { email: siteConfig.email } : {}),
              ...(siteConfig.socials?.length ? { sameAs: siteConfig.socials.map((s: { url: string }) => s.url) } : {}),
            }),
          }}
        />
      </head>
      <body className="antialiased" style={{ background: 'var(--bg, #ffffff)', color: 'var(--text-primary, #1a1a1a)' }}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:shadow-lg focus:text-sm">본문으로 바로가기</a>
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
import { ValuesSection } from '@/components/values-section';
import { HighlightsSection } from '@/components/highlights-section';
import { GallerySection } from '@/components/gallery-section';
import { ContactSection } from '@/components/contact-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <NavHeader />
      <main id="main">
        <HeroSection config={siteConfig} />
        <AboutSection config={siteConfig} />
        <ValuesSection values={siteConfig.values} />
        <HighlightsSection highlights={siteConfig.highlights} />
        {siteConfig.galleryImages.length > 0 && (
          <GallerySection images={siteConfig.galleryImages} />
        )}
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

import { useRef, useState, useEffect } from 'react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

/**
 * 2-column editorial hero (used when heroImageUrl is set OR preset is editorial/magazine/storyteller).
 * Left: text + CTA, Right: hero image or decorative placeholder.
 */
function HeroEditorial({ config, name, tagline, parallaxY, fadeOpacity, t }: {
  config: SiteConfig;
  name: string;
  tagline: string;
  parallaxY: string;
  fadeOpacity: number;
  t: (key: string) => string;
}) {
  return (
    <>
      <div className="absolute inset-0 z-0 mesh-gradient-bg" />
      <div
        className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 hero-editorial"
        style={{ opacity: fadeOpacity }}
      >
        {/* Left col: text */}
        <div className="hero-text-col flex flex-col justify-center">
          <span className="section-label animate-fade-up">Personal Brand</span>
          <h1
            className="hero-name-gradient text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[1.05] tracking-[-0.03em] mb-4 animate-fade-up"
          >
            {name}
          </h1>
          <p className="text-[clamp(1.1rem,2.5vw,1.375rem)] mb-10 max-w-sm leading-relaxed animate-fade-up animate-fade-up-d1"
            style={{ color: 'var(--text-secondary)' }}>
            {tagline}
          </p>
          <a
            href="#contact"
            className="self-start inline-flex items-center gap-2 px-9 py-4 rounded-full text-white font-semibold text-base shadow-lg hover:scale-105 transition-all duration-300 animate-fade-up animate-fade-up-d2 btn-press"
            style={{ background: 'var(--brand-gradient)', boxShadow: '0 4px 20px color-mix(in srgb, var(--brand-primary) 30%, transparent)' }}
          >
            {t('hero.cta')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>

        {/* Right col: hero image or decorative block */}
        <div
          className="hero-img-col animate-fade-up animate-fade-up-d1"
          style={{ transform: \`translateY(\${parallaxY})\` }}
        >
          <div className="hero-image-wrapper">
            {config.heroImageUrl ? (
              <img
                src={config.heroImageUrl}
                alt={name}
                loading="eager"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary-subtle, rgba(238,91,43,0.08)) 0%, color-mix(in oklch, var(--brand-secondary, #f59e0b) 12%, transparent) 100%)',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Centered hero — used for "minimal" preset or when no image is set.
 */
function HeroCentered({ config, name, tagline, parallaxY, fadeOpacity, t }: {
  config: SiteConfig;
  name: string;
  tagline: string;
  parallaxY: string;
  fadeOpacity: number;
  t: (key: string) => string;
}) {
  return (
    <>
      {config.heroImageUrl && (
        <div
          className="absolute inset-0 z-0"
          style={{ transform: config.parallaxEnabled ? \`translateY(\${parallaxY})\` : undefined }}
        >
          <img src={config.heroImageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
        </div>
      )}
      {!config.heroImageUrl && (
        <div className="absolute inset-0 z-0 mesh-gradient-bg" />
      )}
      <div
        className="relative z-10 text-center px-4 sm:px-6 max-w-4xl"
        style={{ opacity: fadeOpacity }}
      >
        <span className="section-label animate-fade-up" style={{ color: config.heroImageUrl ? 'rgba(255,255,255,0.7)' : undefined }}>
          Personal Brand
        </span>
        <h1
          className={\`text-[clamp(3rem,8vw,6.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] mb-5 animate-fade-up \${config.heroImageUrl ? 'text-white' : 'hero-name-gradient'}\`}
        >
          {name}
        </h1>
        <p className={\`text-[clamp(1.1rem,2.5vw,1.5rem)] mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up animate-fade-up-d1 \${config.heroImageUrl ? 'text-white/80' : ''}\`}
          style={!config.heroImageUrl ? { color: 'var(--text-secondary)' } : undefined}>
          {tagline}
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-semibold text-lg shadow-lg hover:scale-105 transition-all duration-300 animate-fade-up animate-fade-up-d2 btn-press"
          style={{ background: 'var(--brand-gradient)', boxShadow: '0 4px 20px color-mix(in srgb, var(--brand-primary) 30%, transparent)' }}
        >
          {t('hero.cta')}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
      {!config.heroImageUrl && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[60px] sm:h-[80px]" fill="currentColor" style={{ color: 'var(--bg, #ffffff)' }}>
            <path d="M0,0 C300,100 900,20 1200,80 L1200,120 L0,120 Z" className="dark:fill-[#0f0f0f]" />
          </svg>
        </div>
      )}
    </>
  );
}

export function HeroSection({ config }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const { locale, t } = useLocale();
  const name = locale === 'en' && config.nameEn ? config.nameEn : config.name;
  const tagline = locale === 'en' && config.taglineEn ? config.taglineEn : config.tagline;

  useEffect(() => {
    if (!config.parallaxEnabled) return;
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const h = el.offsetHeight;
      if (h > 0) setScrollY(Math.max(0, Math.min(1, -rect.top / h)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [config.parallaxEnabled]);

  const parallaxY = \`\${scrollY * 30}%\`;
  const fadeOpacity = Math.max(0, 1 - scrollY * 1.25);

  // Use editorial 2-col layout when: has image AND not minimal, OR explicit editorial/magazine/storyteller
  const useEditorial =
    config.designPreset === 'editorial' ||
    config.designPreset === 'magazine' ||
    config.designPreset === 'storyteller' ||
    (!!config.heroImageUrl && config.designPreset !== 'minimal');

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[auto] md:min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: '5rem', paddingBottom: '3rem' }}
    >
      {useEditorial ? (
        <HeroEditorial
          config={config}
          name={name}
          tagline={tagline}
          parallaxY={parallaxY}
          fadeOpacity={fadeOpacity}
          t={t}
        />
      ) : (
        <HeroCentered
          config={config}
          name={name}
          tagline={tagline}
          parallaxY={parallaxY}
          fadeOpacity={fadeOpacity}
          t={t}
        />
      )}
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/about-section.tsx
// ──────────────────────────────────────────────
const aboutSection = `'use client';

import { AnimatedReveal } from './animated-reveal';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
}

export function AboutSection({ config }: Props) {
  const { locale, t } = useLocale();
  const name = locale === 'en' && config.nameEn ? config.nameEn : config.name;
  const story = locale === 'en' && config.storyEn ? config.storyEn : config.story;

  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 section-alt">
      <div className="max-w-4xl mx-auto">
        <AnimatedReveal variant="slide-left">
          <span className="section-label">{t('about.title')}</span>
          <h2
            className="text-[clamp(1.8rem,4vw,2.75rem)] font-bold tracking-[-0.02em] mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            {locale === 'en' ? \`Hello, I'm \${name}.\` : \`안녕하세요, \${name}입니다.\`}
          </h2>
          <p
            className="text-[1.125rem] leading-[1.85] whitespace-pre-line max-w-2xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            {story}
          </p>
        </AnimatedReveal>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/values-section.tsx
// ──────────────────────────────────────────────
const valuesSection = `'use client';

import { AnimatedReveal } from './animated-reveal';
import type { ValueItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  values: ValueItem[];
}

export function ValuesSection({ values }: Props) {
  const { locale, t } = useLocale();

  return (
    <section id="values" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedReveal>
          <div className="text-center mb-12">
            <span className="section-label">{t('values.title')}</span>
            <h2
              className="text-[clamp(1.8rem,4vw,2.75rem)] font-bold tracking-[-0.02em]"
              style={{ color: 'var(--text-primary)' }}
            >
              {locale === 'en' ? 'What I Stand For' : '제가 믿는 것들'}
            </h2>
          </div>
        </AnimatedReveal>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 stagger-children">
          {values.map((value, i) => {
            const title = locale === 'en' && value.titleEn ? value.titleEn : value.title;
            const desc = locale === 'en' && value.descEn ? value.descEn : value.desc;
            return (
              <AnimatedReveal key={i} delay={i * 100} variant="scale">
                <div className="value-card hover-glow">
                  <div className="value-icon">
                    <span>{value.emoji}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
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
// src/components/highlights-section.tsx
// ──────────────────────────────────────────────
const highlightsSection = `'use client';

import { AnimatedReveal } from './animated-reveal';
import { CountUp } from './count-up';
import type { HighlightItem } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props {
  highlights: HighlightItem[];
}

/** "84,000+" → { num: 84000, suffix: "+" } / "312주" → { num: 312, suffix: "주" } */
function parseNumericValue(raw: string): { num: number; suffix: string } | null {
  const match = raw.match(/^([\\d,]+)(.*)$/);
  if (!match) return null;
  const num = parseInt(match[1].replace(/,/g, ''), 10);
  if (isNaN(num)) return null;
  return { num, suffix: match[2] ?? '' };
}

export function HighlightsSection({ highlights }: Props) {
  const { locale, t } = useLocale();

  return (
    <section id="highlights" className="py-20 sm:py-28 px-4 sm:px-6 section-alt">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatedReveal>
          <span className="section-label">{t('highlights.title')}</span>
          <h2
            className="text-[clamp(1.8rem,4vw,2.75rem)] font-bold tracking-[-0.02em] mb-12"
            style={{ color: 'var(--text-primary)' }}
          >
            {locale === 'en' ? 'By the Numbers' : '숫자로 보는 여정'}
          </h2>
        </AnimatedReveal>

        <div className="grid sm:grid-cols-3 gap-6">
          {highlights.map((item, i) => {
            const label = locale === 'en' && item.labelEn ? item.labelEn : item.label;
            const rawValue = locale === 'en' && item.valueEn ? item.valueEn : item.value;
            const parsed = parseNumericValue(rawValue);
            return (
              <AnimatedReveal key={i} delay={i * 100}>
                <div className="highlight-item hover-glow">
                  <div className="highlight-number">
                    {parsed ? (
                      <CountUp end={parsed.num} suffix={parsed.suffix} />
                    ) : (
                      <span>{rawValue}</span>
                    )}
                  </div>
                  <div className="highlight-label">{label}</div>
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
// src/components/gallery-section.tsx
// ──────────────────────────────────────────────
const gallerySection = `'use client';

import { AnimatedReveal } from './animated-reveal';
import { useLocale } from '@/lib/i18n';

interface Props {
  images: string[];
}

export function GallerySection({ images }: Props) {
  const { locale, t } = useLocale();

  return (
    <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedReveal>
          <div className="text-center mb-12">
            <span className="section-label">{t('gallery.title')}</span>
            <h2
              className="text-[clamp(1.8rem,4vw,2.75rem)] font-bold tracking-[-0.02em]"
              style={{ color: 'var(--text-primary)' }}
            >
              {locale === 'en' ? 'Moments' : '순간들'}
            </h2>
          </div>
        </AnimatedReveal>

        <div className="masonry-gallery">
          {images.map((src, i) => (
            <AnimatedReveal key={i} delay={i * 60}>
              <div className="masonry-item">
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                />
                <div className="masonry-overlay" />
              </div>
            </AnimatedReveal>
          ))}
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

interface Props {
  config: SiteConfig;
}

/** Inline SVG icons per platform (no icon-font dependency) */
function PlatformIcon({ platform }: { platform: string }) {
  switch (platform.toLowerCase()) {
    case 'youtube':
      return (
        <svg viewBox="0 0 28.57 20" width="22" height="16" style={{ flexShrink: 0 }}>
          <path fill="#FF0000" d="M27.97 3.12A3.58 3.58 0 0 0 25.45.6C23.21 0 14.28 0 14.28 0S5.36 0 3.12.6A3.58 3.58 0 0 0 .6 3.12 37.6 37.6 0 0 0 0 10a37.6 37.6 0 0 0 .6 6.88A3.58 3.58 0 0 0 3.12 19.4c2.24.6 11.16.6 11.16.6s8.93 0 11.17-.6a3.58 3.58 0 0 0 2.52-2.52A37.6 37.6 0 0 0 28.57 10a37.6 37.6 0 0 0-.6-6.88z"/>
          <path fill="#FFF" d="M11.43 14.29 18.86 10l-7.43-4.29v8.58z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" style={{ flexShrink: 0 }}>
          <defs><radialGradient id="ig-grad" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497"/><stop offset="5%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fd5949"/><stop offset="60%" stopColor="#d6249f"/><stop offset="90%" stopColor="#285AEB"/></radialGradient></defs>
          <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-grad)"/>
          <rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="none" stroke="#fff" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="4" fill="none" stroke="#fff" strokeWidth="1.5"/>
          <circle cx="17.5" cy="6.5" r="1.2" fill="#fff"/>
        </svg>
      );
    case 'twitter':
    case 'x':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ flexShrink: 0 }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'github':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ flexShrink: 0 }}>
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#0A66C2" style={{ flexShrink: 0 }}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ flexShrink: 0 }}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.06a8.27 8.27 0 0 0 4.84 1.55V7.17a4.85 4.85 0 0 1-1.07-.48z"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      );
  }
}

/** Label for each platform */
function platformLabel(platform: string): string {
  const labels: Record<string, string> = {
    youtube: 'YouTube', instagram: 'Instagram', twitter: 'Twitter',
    x: 'X (Twitter)', github: 'GitHub', linkedin: 'LinkedIn', tiktok: 'TikTok',
  };
  return labels[platform.toLowerCase()] ?? platform.charAt(0).toUpperCase() + platform.slice(1);
}

export function ContactSection({ config }: Props) {
  const { t } = useLocale();

  return (
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedReveal>
          <span className="section-label">Contact</span>
          <h2
            className="text-[clamp(1.8rem,4vw,2.75rem)] font-bold tracking-[-0.02em] mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('contact.title')}
          </h2>
        </AnimatedReveal>

        <AnimatedReveal delay={100}>
          <p className="text-[1.05rem] leading-relaxed mb-10 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            {t('contact.desc')}
          </p>
        </AnimatedReveal>

        <AnimatedReveal delay={200}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {config.email && (
              <a
                href={\`mailto:\${config.email}\`}
                className="contact-link"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {config.email}
              </a>
            )}
            {config.socials.map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <PlatformIcon platform={social.platform} />
                {platformLabel(social.platform)}
              </a>
            ))}
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/footer.tsx
// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
// src/components/footer.tsx
// ──────────────────────────────────────────────
const footerComponent = `import { ThemeToggle } from './theme-toggle';

export function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/5 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-xs">
        <a
          href="https://www.linkmap.biz/sites?utm_source=badge&utm_medium=referral&utm_campaign=personal-brand"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-[11px] font-medium"
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
// src/components/nav-header.tsx
// ──────────────────────────────────────────────
const navHeader = `'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { LanguageToggle } from './language-toggle';

const sectionIds = ['hero', 'about', 'values', 'highlights', 'gallery', 'contact'];

const sectionKeys: Record<string, string> = {
  hero: 'nav.home',
  about: 'nav.about',
  values: 'nav.values',
  highlights: 'nav.highlights',
  gallery: 'nav.gallery',
  contact: 'nav.contact',
};

export function NavHeader() {
  const [active, setActive] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-[#0f0f0f]/80 border-b border-black/5 dark:border-white/5">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-1">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={\`#\${id}\`}
              className={\`px-3 py-1.5 rounded-full text-sm transition-colors \${
                active === id
                  ? 'text-gray-900 dark:text-white bg-black/5 dark:bg-white/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }\`}
            >
              {t(sectionKeys[id])}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            className="sm:hidden p-2 text-gray-600 dark:text-gray-400"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="sm:hidden border-t border-black/5 dark:border-white/5 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-md">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={\`#\${id}\`}
              onClick={() => setMobileOpen(false)}
              className={\`block px-6 py-3 text-sm \${
                active === id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              }\`}
            >
              {t(sectionKeys[id])}
            </a>
          ))}
        </div>
      )}
    </header>
    <div className="scroll-progress" style={{ width: \`\${progress}%\` }} />
    </>
  );
}
`;

// ──────────────────────────────────────────────
// src/lib/config.ts
// ──────────────────────────────────────────────
const libConfig = `export interface ValueItem {
  emoji: string;
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
}

export interface HighlightItem {
  label: string;
  labelEn?: string;
  value: string;
  valueEn?: string;
}

export interface SocialItem {
  platform: string;
  url: string;
  label?: string;
}

const DEMO_VALUES: ValueItem[] = [
  {
    emoji: '\\u2726',
    title: '\\uC9C4\\uC815\\uC131',
    titleEn: 'Authenticity',
    desc: '\\uAD11\\uACE0\\uCC98\\uB7FC \\uB290\\uAEF4\\uC9C0\\uC9C0 \\uC54A\\uB294 \\uCF58\\uD150\\uCE20. \\uB0B4\\uAC00 \\uC9C1\\uC811 \\uC368\\uBD24\\uAC70\\uB098 \\uBFFF\\uB294 \\uAC83\\uB9CC \\uC774\\uC57C\\uAE30\\uD569\\uB2C8\\uB2E4.',
    descEn: "Content that never feels like an ad \\u2014 I only talk about things I've personally used or believe in.",
  },
  {
    emoji: '\\u2726',
    title: '\\uC77C\\uAD00\\uC131',
    titleEn: 'Consistency',
    desc: '2019\\uB144\\uBD80\\uD130 \\uD55C \\uC8FC\\uB3C4 \\uAC70\\uB974\\uC9C0 \\uC54A\\uC740 \\uB274\\uC2A4\\uB808\\uD130. \\uAFB8\\uC900\\uD568\\uC774 \\uC2E0\\uB8B0\\uB97C \\uB9CC\\uB4E0\\uB2E4\\uACE0 \\uC0DD\\uAC01\\uD574\\uC694.',
    descEn: 'A newsletter published every single week since 2019. I believe consistency builds trust.',
  },
  {
    emoji: '\\u2726',
    title: '\\uD638\\uAE30\\uC2EC',
    titleEn: 'Curiosity',
    desc: '\\uC0C8\\uB85C\\uC6B4 \\uD50C\\uB7AB\\uD3FC, \\uC0C8\\uB85C\\uC6B4 \\uD3EC\\uB9F7, \\uC0C8\\uB85C\\uC6B4 \\uC0AC\\uB78C. \\uBC30\\uC6C0\\uC744 \\uBA48\\uCD94\\uC9C0 \\uC54A\\uB294 \\uAC83\\uC774 \\uC81C \\uC6D0\\uB3D9\\uB825\\uC785\\uB2C8\\uB2E4.',
    descEn: 'New platforms, new formats, new people \\u2014 never stopping learning is what keeps me going.',
  },
];

const DEMO_HIGHLIGHTS: HighlightItem[] = [
  { label: '\\uAD6C\\uB3C5\\uC790 \\uD569\\uC0B0', labelEn: 'Total Subscribers', value: '84,000+', valueEn: '84,000+' },
  { label: '\\uD611\\uC5C5 \\uBE0C\\uB79C\\uB4DC', labelEn: 'Brand Collabs', value: '120+', valueEn: '120+' },
  { label: '\\uB274\\uC2A4\\uB808\\uD130 \\uC5F0\\uC18D \\uBC1C\\uD589', labelEn: 'Newsletter Streak', value: '312\\uC8FC', valueEn: '312 Weeks' },
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
  name: process.env.NEXT_PUBLIC_SITE_NAME || '\\uC774\\uC9C0\\uC6D0',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || 'Jiwon Lee',
  tagline: process.env.NEXT_PUBLIC_TAGLINE || '\\uCF58\\uD150\\uCE20\\uB85C \\uC138\\uC0C1\\uC744 \\uC5F0\\uACB0\\uD558\\uB294 \\uD06C\\uB9AC\\uC5D0\\uC774\\uD130',
  taglineEn: process.env.NEXT_PUBLIC_TAGLINE_EN || 'Creator who connects the world through content',
  heroImageUrl: process.env.NEXT_PUBLIC_HERO_IMAGE_URL || 'https://linkmap.biz/img/templates/personal-brand-hero.png',
  story:
    process.env.NEXT_PUBLIC_STORY ||
    '\\uC548\\uB155\\uD558\\uC138\\uC694, \\uC800\\uB294 \\uC774\\uC9C0\\uC6D0\\uC785\\uB2C8\\uB2E4. 5\\uB144\\uC0B4 \\uB514\\uC9C0\\uD138 \\uCF58\\uD150\\uCE20\\uB97C \\uB9CC\\uB4E4\\uBA70 \\uBE0C\\uB79C\\uB4DC\\uC640 \\uC0AC\\uB78C \\uC0AC\\uC774\\uC758 \\uB2E4\\uB9AC\\uB97C \\uB193\\uACE0 \\uC788\\uC5B4\\uC694.',
  storyEn:
    process.env.NEXT_PUBLIC_STORY_EN ||
    "Hi, I'm Jiwon Lee. For the past five years I've been building bridges between brands and people through digital content.",
  values: parseJSON<ValueItem[]>(process.env.NEXT_PUBLIC_VALUES, DEMO_VALUES),
  highlights: parseJSON<HighlightItem[]>(process.env.NEXT_PUBLIC_HIGHLIGHTS, DEMO_HIGHLIGHTS),
  galleryImages: parseJSON<string[]>(process.env.NEXT_PUBLIC_GALLERY_IMAGES, [
    'https://plus.unsplash.com/premium_photo-1679079456083-9f288e224e96?w=600&q=85&auto=format&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1541823709867-1b206113eafd?w=600&h=900&q=85&auto=format&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1602492665157-639323eadd31?w=600&q=85&auto=format&fit=crop',
    'https://plus.unsplash.com/premium_photo-1661407583811-f39558a8e0cd?w=600&h=400&q=85&auto=format&fit=crop',
    'https://plus.unsplash.com/premium_photo-1661412988741-45fcf3074878?w=600&h=800&q=85&auto=format&fit=crop',
    'https://plus.unsplash.com/premium_photo-1664476946415-19cdad721c53?w=600&q=85&auto=format&fit=crop&crop=faces',
  ]),
  email: process.env.NEXT_PUBLIC_EMAIL || 'hello@jiwonlee.kr',
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, [
    { platform: 'youtube', url: 'https://youtube.com' },
    { platform: 'instagram', url: 'https://instagram.com' },
  ]),
  gradientFrom: '#ee5b2b',
  gradientTo: '#f59e0b',
  parallaxEnabled: true,
  fontFamily: 'Pretendard',
  galleryColumns: '3',
  designPreset: 'creator',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;

// ──────────────────────────────────────────────
// src/lib/i18n.tsx
// ──────────────────────────────────────────────
const libI18n = `'use client';

import { useSyncExternalStore, useCallback } from 'react';

export type Locale = 'ko' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  ko: {
    'nav.home': '홈',
    'nav.about': '소개',
    'nav.values': '가치관',
    'nav.highlights': '하이라이트',
    'nav.gallery': '갤러리',
    'nav.contact': '연락처',
    'hero.cta': '더 알아보기',
    'about.title': '나의 이야기',
    'values.title': '가치관',
    'highlights.title': '하이라이트',
    'gallery.title': '갤러리',
    'contact.title': '함께 이야기 나눠요',
    'contact.desc': '협업, 강연, 브랜드 캠페인 — 무엇이든 편하게 연락 주세요.',
    'contact.email': '이메일 보내기',
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
    'lang.switchLabel': 'Switch to English',
    'lang.toggle': 'EN',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.values': 'Values',
    'nav.highlights': 'Highlights',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'hero.cta': 'Learn More',
    'about.title': 'My Story',
    'values.title': 'Values',
    'highlights.title': 'Highlights',
    'gallery.title': 'Gallery',
    'contact.title': "Let's Talk",
    'contact.desc': 'Collaboration, speaking, brand campaigns — feel free to reach out.',
    'contact.email': 'Send Email',
    'theme.light': 'Switch to light mode',
    'theme.dark': 'Switch to dark mode',
    'lang.switchLabel': '한국어로 전환',
    'lang.toggle': '한국어',
  },
};

/* ── module-level state ── */
let currentLocale: Locale = 'ko';
const listeners = new Set<() => void>();

function getLocale() {
  return currentLocale;
}
function getServerLocale() {
  return 'ko' as Locale;
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

export function setLocale(l: Locale) {
  if (l === currentLocale) return;
  currentLocale = l;
  try {
    localStorage.setItem('locale', l);
    document.documentElement.lang = l;
  } catch {}
  listeners.forEach((cb) => cb());
}

/* hydrate from localStorage once */
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('locale');
    if (saved === 'ko' || saved === 'en') {
      currentLocale = saved;
      document.documentElement.lang = saved;
    }
  } catch {}
}

export function useLocale() {
  const locale = useSyncExternalStore(subscribe, getLocale, getServerLocale);
  const t = useCallback(
    (key: string) => translations[locale]?.[key] ?? key,
    [locale],
  );
  return { locale, setLocale, t };
}
`;

// ──────────────────────────────────────────────
// Assemble template
// ──────────────────────────────────────────────
export const personalBrandTemplate: HomepageTemplateContent = {
  slug: 'personal-brand',
  repoName: 'personal-brand',
  description: '나만의 홈페이지 - Linkmap으로 생성',
  files: [
    { path: '.gitignore', content: gitignore },
    { path: '.github/workflows/deploy.yml', content: deployYml },
    { path: 'package.json', content: packageJson },
    { path: 'tsconfig.json', content: tsconfigJson },
    { path: 'postcss.config.mjs', content: postcssConfig },
    { path: 'next.config.ts', content: nextConfig },
    { path: 'src/app/api/og/route.tsx', content: ogRoute },
    { path: 'src/app/globals.css', content: globalsCssWithPremium },
    { path: 'src/app/layout.tsx', content: layoutTsx },
    { path: 'src/app/page.tsx', content: pageTsx },
    { path: 'src/components/animated-reveal.tsx', content: animatedReveal },
    { path: 'src/components/section-wrapper.tsx', content: sectionWrapper },
    { path: 'src/components/count-up.tsx', content: countUp },
    { path: 'src/components/hero-section.tsx', content: heroSection },
    { path: 'src/components/about-section.tsx', content: aboutSection },
    { path: 'src/components/values-section.tsx', content: valuesSection },
    { path: 'src/components/highlights-section.tsx', content: highlightsSection },
    { path: 'src/components/gallery-section.tsx', content: gallerySection },
    { path: 'src/components/contact-section.tsx', content: contactSection },
    { path: 'src/components/footer.tsx', content: footerComponent },
    { path: 'src/components/nav-header.tsx', content: navHeader },
    { path: 'src/components/theme-toggle.tsx', content: themeToggle },
    { path: 'src/components/language-toggle.tsx', content: languageToggle },
    { path: 'src/lib/config.ts', content: libConfig },
    { path: 'src/lib/i18n.tsx', content: libI18n },
  ],
};
