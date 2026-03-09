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
} from './shared-template-files';

const packageJson = makePackageJson('small-biz');

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
          background: 'linear-gradient(160deg, #1a1a1a 0%, #2a2520 35%, #3a302a 70%, #c8a97e 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 400,
            color: '#ffffff',
            letterSpacing: '-0.01em',
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.75)',
            marginTop: 16,
            maxWidth: 640,
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          {siteConfig.description}
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

/* ─── CSS 변수 ─────────────────────────────── */
:root {
  --brand-primary:   #c8a97e;
  --brand-secondary: #e8d5b0;
  --accent:          #a88b5e;
  --bg-page:         #1a1a1a;
  --bg-card:         #242424;
  --bg-card-border:  #333333;
  --text-dark:       #f5f0e8;
  --text-mid:        #d4c8b0;
  --text-muted:      rgba(200, 169, 126, 0.53);
  --text-light:      #c8a97e;

  --font-display: 'Nanum Myeongjo', 'Georgia', 'Times New Roman', serif;
  --font-body: 'Nanum Myeongjo', 'Pretendard Variable', system-ui, -apple-system, 'Segoe UI', sans-serif;

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;

  --section-gap: 5rem;
  --content-max: 900px;

  /* Primary color override via config */
  --color-primary: #c8a97e;
  --color-secondary: #e8d5b0;
}

/* ─── Reset & Base ─────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

body {
  background: var(--bg-page);
  color: var(--text-dark);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }

*:focus-visible {
  outline: 2px solid var(--brand-secondary);
  outline-offset: 2px;
}

/* ─── Nav ──────────────────────────────────── */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 56px;
  background: rgba(26, 26, 26, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--bg-card-border);
  transition: background 0.3s;
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--brand-primary);
  letter-spacing: 0.02em;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  font-size: 0.875rem;
  color: var(--text-mid);
}

.nav-links a {
  position: relative;
  padding-bottom: 2px;
  transition: color 0.2s;
}
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 0; height: 1px;
  background: var(--brand-secondary);
  transition: width 0.25s ease;
}
.nav-links a:hover { color: var(--brand-primary); }
.nav-links a:hover::after { width: 100%; }

.nav-cta {
  font-size: 0.8125rem;
  padding: 6px 18px;
  background: var(--brand-primary);
  color: #fff;
  border-radius: 999px;
  transition: background 0.2s, transform 0.1s;
  white-space: nowrap;
}
.nav-cta:hover { background: var(--text-dark); transform: translateY(-1px); }

/* ─── Hero ─────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 5rem 2rem 4rem;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, #1a1a1a 0%, #2a2520 35%, #3a302a 70%, #4a3f35 100%);
}

.hero-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  pointer-events: none;
}
.hero-circle-1 {
  width: 600px; height: 600px;
  top: -200px; right: -150px;
  background: radial-gradient(circle, #fde68a, transparent 70%);
}
.hero-circle-2 {
  width: 400px; height: 400px;
  bottom: -100px; left: -80px;
  background: radial-gradient(circle, #fef3c7, transparent 70%);
  opacity: 0.12;
}
.hero-circle-3 {
  width: 200px; height: 200px;
  top: 30%; left: 10%;
  background: radial-gradient(circle, #fffbeb, transparent 70%);
  opacity: 0.08;
}

.hero-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 680px;
  color: #fff;
}

.hero-category {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.75);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: fadeUp 0.6s ease 0.2s forwards;
}
.hero-category-dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: rgba(255,255,255,0.6);
}

.hero-name {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin-bottom: 0.5rem;
  opacity: 0;
  animation: fadeUp 0.7s ease 0.4s forwards;
}

.hero-name-en {
  font-family: var(--font-display);
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  font-weight: 400;
  letter-spacing: 0.25em;
  color: rgba(255,255,255,0.65);
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeUp 0.7s ease 0.5s forwards;
}

.hero-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  color: rgba(255,255,255,0.5);
  opacity: 0;
  animation: fadeUp 0.6s ease 0.65s forwards;
}
.hero-divider-line {
  width: 48px;
  height: 1px;
  background: rgba(255,255,255,0.4);
}

.hero-slogan {
  font-family: var(--font-display);
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-style: italic;
  color: rgba(255,255,255,0.9);
  font-weight: 400;
  margin-bottom: 3rem;
  line-height: 1.6;
  opacity: 0;
  animation: fadeUp 0.7s ease 0.8s forwards;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  animation: fadeUp 0.7s ease 1s forwards;
}

.hero-scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.5);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: 0;
  animation: fadeIn 1s ease 1.5s forwards;
}
.hero-scroll-arrow {
  width: 20px; height: 20px;
  border-right: 1.5px solid rgba(255,255,255,0.4);
  border-bottom: 1.5px solid rgba(255,255,255,0.4);
  transform: rotate(45deg);
  animation: scrollBounce 1.4s ease-in-out infinite;
}

/* ─── Buttons ──────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
  border: none;
}
.btn:hover { transform: translateY(-2px); }

.btn-primary {
  background: #fff;
  color: var(--brand-primary);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.btn-primary:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

.btn-outline {
  background: rgba(255,255,255,0.12);
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.4);
  backdrop-filter: blur(8px);
}
.btn-outline:hover { background: rgba(255,255,255,0.2); }

/* ─── Quick Actions ─────────────────────────── */
.quick-actions {
  background: var(--bg-card);
  border-bottom: 1px solid var(--bg-card-border);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-mid);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  transition: background 0.2s, color 0.2s;
}
.quick-action:hover {
  background: rgba(146, 64, 14, 0.08);
  color: var(--brand-primary);
}
.quick-action-icon { font-size: 1.1rem; }

.quick-action-tel {
  position: relative;
}
.quick-action-tel::after {
  content: '';
  position: absolute;
  bottom: 0; left: 1rem; right: 1rem;
  height: 1px;
  background: var(--brand-secondary);
  transform: scaleX(0);
  transition: transform 0.25s ease;
}
.quick-action-tel:hover::after { transform: scaleX(1); }

/* ─── Section Common ────────────────────────── */
.section {
  padding: 5rem 2rem;
}
.section-inner {
  max-width: var(--content-max);
  margin: 0 auto;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-secondary);
  margin-bottom: 0.5rem;
}
.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 400;
  color: var(--text-dark);
  margin-bottom: 0.75rem;
  line-height: 1.25;
}
.section-desc {
  font-size: 0.9375rem;
  color: var(--text-light);
  margin-bottom: 2.5rem;
}

/* ─── Menu ─────────────────────────────────── */
.menu-section {
  background: var(--bg-page);
}

.menu-category + .menu-category { margin-top: 3rem; }

.menu-category-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.menu-category-emoji { font-size: 1.5rem; }
.menu-category-name {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 400;
  color: var(--text-dark);
}

.menu-divider {
  height: 1px;
  background: linear-gradient(to right, var(--bg-card-border), transparent);
  margin-bottom: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid rgba(240, 228, 208, 0.6);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s ease, transform 0.4s ease, background 0.15s;
}
.menu-item:last-child { border-bottom: none; }
.menu-thumb {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  background: var(--bg-card);
}
.menu-thumb-emoji {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  flex-shrink: 0;
}
.menu-item-info {
  flex: 1;
  min-width: 0;
}
.menu-item:hover { background: rgba(146, 64, 14, 0.025); }
.menu-item.visible {
  opacity: 1;
  transform: none;
}

.menu-item-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.menu-item-name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-dark);
}
.menu-item-name-en {
  font-size: 0.8125rem;
  color: var(--text-light);
  font-style: italic;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  line-height: 1.4;
}
.badge-new {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
  animation: badgePulse 2s ease-in-out infinite;
}
.badge-popular {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.menu-item-desc {
  font-size: 0.8125rem;
  color: var(--text-light);
  margin-top: 0.2rem;
}

.menu-item-price {
  font-size: 1rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--brand-primary);
  white-space: nowrap;
  flex-shrink: 0;
  padding-top: 2px;
}

/* ─── Info (2열) ────────────────────────────── */
.info-section {
  background: var(--bg-card);
  border-top: 1px solid var(--bg-card-border);
  border-bottom: 1px solid var(--bg-card-border);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 640px) {
  .info-grid { grid-template-columns: 1fr; }
}

.info-card {
  background: var(--bg-page);
  border: 1px solid var(--bg-card-border);
  border-radius: var(--radius-md);
  padding: 2rem;
}

.info-card-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--text-dark);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--bg-card-border);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 영업시간 */
.hours-list { list-style: none; }
.hours-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  border-bottom: 1px dashed rgba(240, 228, 208, 0.8);
  transition: background 0.15s;
}
.hours-item:last-child { border-bottom: none; }
.hours-item.today {
  font-weight: 700;
  color: var(--brand-primary);
}
.hours-item.holiday .hours-time {
  color: #dc2626;
  font-size: 0.8125rem;
}
.hours-day { min-width: 4.5rem; }
.hours-time { text-align: right; }

.open-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 1.25rem;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
}
.open-badge.open {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}
.open-badge.closed {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}
.open-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
}
.open-badge.open .open-dot {
  background: #065f46;
  animation: blink 1.4s ease-in-out infinite;
}
.open-badge.closed .open-dot { background: #dc2626; }

.phone-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--brand-primary);
  position: relative;
  padding-bottom: 1px;
}
.phone-link::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 0; height: 1.5px;
  background: var(--brand-secondary);
  transition: width 0.3s ease;
}
.phone-link:hover::after { width: 100%; }

/* 위치 */
.address-text {
  font-size: 0.9375rem;
  color: var(--text-mid);
  line-height: 1.6;
  margin-bottom: 1rem;
}
.address-text-en {
  font-size: 0.8125rem;
  color: var(--text-light);
  margin-top: 0.25rem;
}

.map-placeholder {
  width: 100%;
  aspect-ratio: 16/10;
  background: linear-gradient(135deg, #fef3c7, #fde68a, #fcd34d);
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--brand-primary);
  font-size: 0.8125rem;
  margin-bottom: 1rem;
  border: 1px solid #fcd34d;
  position: relative;
  overflow: hidden;
}
.map-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 20px,
    rgba(146, 64, 14, 0.04) 20px,
    rgba(146, 64, 14, 0.04) 40px
  );
}
.map-icon { font-size: 2rem; position: relative; z-index: 1; }
.map-label { font-weight: 600; position: relative; z-index: 1; }
.map-sub { color: var(--text-light); font-size: 0.75rem; position: relative; z-index: 1; }

.kakao-map-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  color: var(--brand-primary);
  font-weight: 600;
  margin-top: 0.5rem;
  transition: color 0.2s;
}
.kakao-map-link:hover { color: var(--brand-secondary); }

/* ─── Gallery ────────────────────────────────── */
.gallery-section {
  background: var(--bg-page);
  padding-bottom: 3rem;
}

.gallery-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0 1.5rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--bg-card-border) transparent;
}
.gallery-scroll::-webkit-scrollbar { height: 4px; }
.gallery-scroll::-webkit-scrollbar-track { background: transparent; }
.gallery-scroll::-webkit-scrollbar-thumb {
  background: var(--bg-card-border);
  border-radius: 999px;
}

.gallery-item {
  flex: 0 0 280px;
  aspect-ratio: 4/3;
  border-radius: var(--radius-md);
  overflow: hidden;
  scroll-snap-align: start;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.gallery-item:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 32px rgba(146, 64, 14, 0.15);
}
.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-caption {
  font-size: 0.8125rem;
  color: var(--text-light);
  text-align: center;
  margin-top: 0.5rem;
}

/* ─── SNS ────────────────────────────────────── */
.sns-section {
  background: var(--bg-card);
  border-top: 1px solid var(--bg-card-border);
}

.sns-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 560px) {
  .sns-grid { grid-template-columns: 1fr; }
}

.sns-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 1.5rem;
  border-radius: var(--radius-md);
  border: 1.5px solid transparent;
  background: var(--bg-page);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
}
.sns-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.sns-instagram:hover { border-color: #e1306c; }
.sns-naver:hover     { border-color: #03c75a; }
.sns-kakao:hover     { border-color: #fee500; }

.sns-icon-wrap {
  width: 56px; height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.sns-instagram .sns-icon-wrap {
  background: linear-gradient(135deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d);
  color: #fff;
}
.sns-naver .sns-icon-wrap {
  background: #03c75a;
  color: #fff;
}
.sns-kakao .sns-icon-wrap {
  background: #fee500;
  color: #3c1e1e;
}

.sns-name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--text-dark);
}
.sns-handle {
  font-size: 0.8125rem;
  color: var(--text-light);
  text-align: center;
}

/* ─── Footer ─────────────────────────────────── */
.site-footer {
  background: var(--text-dark);
  color: rgba(255,255,255,0.6);
  padding: 3rem 2rem 2rem;
  text-align: center;
}

.footer-name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  color: rgba(255,255,255,0.9);
  margin-bottom: 0.75rem;
}
.footer-info {
  font-size: 0.875rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}
.footer-divider {
  width: 40px;
  height: 1px;
  background: rgba(255,255,255,0.15);
  margin: 1.5rem auto;
}
.footer-copy {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.3);
  margin-bottom: 1rem;
}
.footer-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  color: rgba(255,255,255,0.3);
  transition: color 0.2s;
}
.footer-badge:hover { color: rgba(255,255,255,0.6); }

/* ─── Reveal 애니메이션 ──────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal, .menu-item { opacity: 1; transform: none; transition: none; animation: none; }
}

/* ─── Keyframes ──────────────────────────────── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.06); }
}
@keyframes scrollBounce {
  0%, 100% { transform: rotate(45deg) translateY(0); }
  50%       { transform: rotate(45deg) translateY(4px); }
}

/* ─── Mobile ─────────────────────────────────── */
@media (max-width: 480px) {
  .nav-links { display: none; }
  .section { padding: 3.5rem 1.25rem; }
  .info-card { padding: 1.5rem; }
  .hero-actions .btn { padding: 0.65rem 1.5rem; font-size: 0.875rem; }
}
`;

// ──────────────────────────────────────────────
// src/app/layout.tsx
// ──────────────────────────────────────────────
const layoutTsx = `import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: 'website',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
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
        {siteConfig.fontFamily === 'Nanum Myeongjo' && (
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap"
          />
        )}
        {siteConfig.gaId && (
          <>
            <script async src={\`https://www.googletagmanager.com/gtag/js?id=\${siteConfig.gaId}\`} />
            <script
              dangerouslySetInnerHTML={{
                __html: \`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','\${siteConfig.gaId}');\`,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: siteConfig.name,
              description: siteConfig.description,
              ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
              ...(siteConfig.address ? { address: { '@type': 'PostalAddress', streetAddress: siteConfig.address } } : {}),
              ...(siteConfig.businessHours?.length ? {
                openingHoursSpecification: siteConfig.businessHours.map((h: { day: string; hours: string }) => ({
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: h.day,
                  description: h.hours,
                })),
              } : {}),
            }),
          }}
        />
      </head>
      <body>
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
import { QuickActions } from '@/components/quick-actions';
import { MenuSection } from '@/components/menu-section';
import { InfoSection } from '@/components/info-section';
import { GallerySection } from '@/components/gallery-section';
import { SnsSection } from '@/components/sns-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <NavHeader config={siteConfig} />
      <main id="main">
        <HeroSection config={siteConfig} />
        <QuickActions config={siteConfig} />
        {siteConfig.menuItems.length > 0 && (
          <MenuSection items={siteConfig.menuItems} />
        )}
        <InfoSection config={siteConfig} />
        {siteConfig.galleryImages.length > 0 && (
          <GallerySection images={siteConfig.galleryImages} />
        )}
        <SnsSection config={siteConfig} />
      </main>
      <Footer config={siteConfig} />
    </>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/nav-header.tsx
// ──────────────────────────────────────────────
const navHeader = `'use client';

import { useState, useEffect } from 'react';
import type { SiteConfig } from '@/lib/config';

interface Props {
  config: SiteConfig;
}

export function NavHeader({ config }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const navLinks = [
    { href: '#menu', label: '메뉴' },
    { href: '#info', label: '영업시간' },
    { href: '#location', label: '위치' },
    { href: '#gallery', label: '갤러리' },
  ].filter((link) => {
    if (link.href === '#menu' && config.menuItems.length === 0) return false;
    if (link.href === '#gallery' && config.galleryImages.length === 0) return false;
    return true;
  });

  return (
    <nav className="nav" role="navigation" aria-label="주 메뉴">
      <a href="#hero" className="nav-logo">{config.name}</a>
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      {config.phone && (
        <a href={\`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`} className="nav-cta">
          전화하기
        </a>
      )}
    </nav>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/hero-section.tsx
// ──────────────────────────────────────────────
const heroSection = `'use client';

import type { SiteConfig } from '@/lib/config';

interface Props {
  config: SiteConfig;
}

export function HeroSection({ config }: Props) {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <div className="hero-circle hero-circle-1" />
      <div className="hero-circle hero-circle-2" />
      <div className="hero-circle hero-circle-3" />
      <div className="hero-noise" />

      <div className="hero-content">
        {config.description && (
          <p className="hero-category">
            소상공인
            <span className="hero-category-dot" />
            {config.name}
          </p>
        )}

        <h1 className="hero-name">{config.name}</h1>

        {config.nameEn && (
          <p className="hero-name-en">{config.nameEn}</p>
        )}

        <div className="hero-divider">
          <span className="hero-divider-line" />
          <span style={{ fontSize: '0.625rem' }}>✦</span>
          <span className="hero-divider-line" />
        </div>

        {config.description && (
          <p className="hero-slogan">"{config.description}"</p>
        )}

        <div className="hero-actions">
          {config.menuItems.length > 0 && (
            <a href="#menu" className="btn btn-primary">메뉴 보기</a>
          )}
          {config.address && (
            <a href="#location" className="btn btn-outline">오시는 길</a>
          )}
          {!config.menuItems.length && config.phone && (
            <a
              href={\`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`}
              className="btn btn-primary"
            >
              📞 전화하기
            </a>
          )}
        </div>
      </div>

      <div className="hero-scroll-hint" aria-hidden="true">
        <div className="hero-scroll-arrow" />
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/quick-actions.tsx
// ──────────────────────────────────────────────
const quickActions = `'use client';

import { useEffect, useState } from 'react';
import type { SiteConfig } from '@/lib/config';

interface Props {
  config: SiteConfig;
}

const DAY_MAP: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
};

function getStatusText(hours: SiteConfig['businessHours']): string {
  const now = new Date();
  const todayIdx = now.getDay();
  const todayHour = hours.find((h) => (DAY_MAP[h.dayEn ?? ''] ?? -1) === todayIdx);
  if (!todayHour) return '';
  if (todayHour.isHoliday) return '오늘 휴무';
  const timeStr = todayHour.hoursEn || todayHour.hours;
  const match = timeStr.match(/(\\d{1,2}):(\\d{2})\\s*-\\s*(\\d{1,2}):(\\d{2})/);
  if (!match) return '';
  const [, sh, sm, eh, em] = match;
  const cur = now.getHours() * 60 + now.getMinutes();
  const start = parseInt(sh) * 60 + parseInt(sm);
  const end = parseInt(eh) * 60 + parseInt(em);
  if (cur >= start && cur < end) return '현재 영업 중';
  return '영업 종료';
}

export function QuickActions({ config }: Props) {
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    if (config.businessHours?.length) {
      setStatusText(getStatusText(config.businessHours));
    }
  }, [config.businessHours]);

  const address = config.address;

  return (
    <div className="quick-actions">
      {config.phone && (
        <a
          href={\`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`}
          className="quick-action quick-action-tel"
        >
          <span className="quick-action-icon">📞</span>
          {config.phone}
        </a>
      )}
      {address && (
        <span className="quick-action">
          <span className="quick-action-icon">📍</span>
          {address}
        </span>
      )}
      {statusText && (
        <span className="quick-action">
          <span className="quick-action-icon">🕐</span>
          {statusText}
        </span>
      )}
    </div>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/menu-section.tsx
// ──────────────────────────────────────────────
const menuSection = `'use client';

import { useEffect, useRef } from 'react';
import type { MenuItem } from '@/lib/config';

interface Props {
  items: MenuItem[];
}

export function MenuSection({ items }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  const categories = [...new Set(items.map((item) => item.category))];
  const grouped = categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat] = items.filter((item) => item.category === cat);
    return acc;
  }, {});

  useEffect(() => {
    const revealEls = sectionRef.current?.querySelectorAll<HTMLElement>('.reveal');
    const menuItems = sectionRef.current?.querySelectorAll<HTMLElement>('.menu-item');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls?.forEach((el) => observer.observe(el));

    const menuObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = entry.target.parentElement?.querySelectorAll<HTMLElement>('.menu-item');
            siblings?.forEach((item, i) => {
              setTimeout(() => item.classList.add('visible'), i * 80);
            });
            menuObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    sectionRef.current?.querySelectorAll<HTMLElement>('.menu-category').forEach((cat) => {
      const first = cat.querySelector<HTMLElement>('.menu-item');
      if (first) menuObserver.observe(first);
    });

    return () => { observer.disconnect(); menuObserver.disconnect(); };
  }, []);

  return (
    <section className="section menu-section" id="menu" ref={sectionRef}>
      <div className="section-inner">
        <p className="section-label reveal">메뉴</p>
        <h2 className="section-title reveal">오늘의 메뉴</h2>

        {categories.map((cat) => {
          const catItems = grouped[cat] || [];
          const catEmoji = catItems[0]?.emoji || '🍽️';
          return (
            <div key={cat} className="menu-category reveal">
              <div className="menu-category-header">
                <span className="menu-category-emoji">{catEmoji}</span>
                <span className="menu-category-name">{cat}</span>
              </div>
              <div className="menu-divider" />

              {catItems.map((item, i) => (
                <div key={i} className="menu-item">
                  {item.imageUrl ? (
                    <img className="menu-thumb" src={item.imageUrl} alt={item.name} loading="lazy" />
                  ) : (
                    <span className="menu-thumb-emoji">{item.emoji}</span>
                  )}
                  <div className="menu-item-info">
                    <div className="menu-item-name-row">
                      <span className="menu-item-name">{item.name}</span>
                      {item.nameEn && (
                        <span className="menu-item-name-en">{item.nameEn}</span>
                      )}
                      {item.isNew && <span className="badge badge-new">NEW</span>}
                      {item.isPopular && <span className="badge badge-popular">인기</span>}
                    </div>
                    {item.desc && <div className="menu-item-desc">{item.desc}</div>}
                  </div>
                  <span className="menu-item-price">{item.price}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/info-section.tsx
// (영업시간 + 위치를 2열 카드로 통합)
// ──────────────────────────────────────────────
const infoSection = `'use client';

import { useEffect, useRef, useState } from 'react';
import type { SiteConfig, BusinessHour } from '@/lib/config';

interface Props {
  config: SiteConfig;
}

const DAY_MAP: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
};

function getTodayIndex(): number {
  return new Date().getDay();
}

function getOpenStatus(hours: BusinessHour[]): { isOpen: boolean; isHoliday: boolean; closeTime: string } {
  const now = new Date();
  const todayIdx = now.getDay();
  const todayHour = hours.find((h) => (DAY_MAP[h.dayEn ?? ''] ?? -1) === todayIdx);
  if (!todayHour) return { isOpen: false, isHoliday: false, closeTime: '' };
  if (todayHour.isHoliday) return { isOpen: false, isHoliday: true, closeTime: '' };
  const timeStr = todayHour.hoursEn || todayHour.hours;
  const match = timeStr.match(/(\\d{1,2}):(\\d{2})\\s*-\\s*(\\d{1,2}):(\\d{2})/);
  if (!match) return { isOpen: false, isHoliday: false, closeTime: '' };
  const [, sh, sm, eh, em] = match;
  const cur = now.getHours() * 60 + now.getMinutes();
  const start = parseInt(sh) * 60 + parseInt(sm);
  const end = parseInt(eh) * 60 + parseInt(em);
  return { isOpen: cur >= start && cur < end, isHoliday: false, closeTime: \`\${eh}:\${em}\` };
}

function getDayDataIndex(dayEn: string | undefined): number {
  if (!dayEn) return -1;
  const jsDay = DAY_MAP[dayEn] ?? -1;
  // 월=0...일=6 순서로 표시 (data-day 속성용)
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function InfoSection({ config }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [openStatus, setOpenStatus] = useState<{ isOpen: boolean; isHoliday: boolean; closeTime: string } | null>(null);
  const todayIndex = getTodayIndex();

  useEffect(() => {
    if (config.businessHours?.length) {
      setOpenStatus(getOpenStatus(config.businessHours));
    }

    const revealEls = sectionRef.current?.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [config.businessHours]);

  const hasHours = config.businessHours?.length > 0;
  const hasLocation = !!config.address;
  if (!hasHours && !hasLocation) return null;

  const mapUrl = config.kakaoMapId
    ? \`https://place.map.kakao.com/\${config.kakaoMapId}\`
    : config.address
    ? \`https://maps.google.com/?q=\${encodeURIComponent(config.address)}\`
    : null;

  return (
    <section className="section info-section" id="info" ref={sectionRef}>
      <div className="section-inner">
        <p className="section-label reveal">정보</p>
        <h2 className="section-title reveal">영업시간 &amp; 오시는 길</h2>

        <div className="info-grid reveal">
          {/* 영업시간 카드 */}
          {hasHours && (
            <div className="info-card" id="hours">
              <h3 className="info-card-title">
                <span>🕐</span>
                영업시간
              </h3>
              <ul className="hours-list">
                {config.businessHours.map((hour, i) => {
                  const dayIdx = DAY_MAP[hour.dayEn ?? ''] ?? -1;
                  const isToday = dayIdx === todayIndex;
                  const dataIdx = getDayDataIndex(hour.dayEn);
                  return (
                    <li
                      key={i}
                      className={\`hours-item\${isToday ? ' today' : ''}\${hour.isHoliday ? ' holiday' : ''}\`}
                      data-day={dataIdx}
                    >
                      <span className="hours-day">{hour.day}</span>
                      <span className="hours-time">{hour.isHoliday ? '휴무' : hour.hours}</span>
                    </li>
                  );
                })}
              </ul>

              {openStatus !== null && (
                <div className={\`open-badge \${openStatus.isOpen ? 'open' : 'closed'}\`}>
                  <span className="open-dot" />
                  {openStatus.isOpen
                    ? '현재 영업 중'
                    : openStatus.isHoliday
                    ? '오늘은 휴무입니다'
                    : \`영업 종료 (\${openStatus.closeTime} 마감)\`}
                </div>
              )}

              {config.phone && (
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--bg-card-border)' }}>
                  <a
                    href={\`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`}
                    className="phone-link"
                  >
                    <span>📞</span>
                    {config.phone}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 위치 카드 */}
          {hasLocation && (
            <div className="info-card" id="location">
              <h3 className="info-card-title">
                <span>📍</span>
                오시는 길
              </h3>
              <p className="address-text">{config.address}</p>
              {config.addressEn && (
                <p className="address-text-en">{config.addressEn}</p>
              )}

              {config.kakaoMapId ? (
                <div style={{ marginBottom: '1rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden', aspectRatio: '16/10' }}>
                  <iframe
                    src={\`https://map.kakao.com/?map_type=TYPE_MAP&itemId=\${config.kakaoMapId}\`}
                    title="카카오맵"
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="map-placeholder">
                  <span className="map-icon">🗺️</span>
                  <span className="map-label">지도 보기</span>
                  <span className="map-sub">카카오맵 장소 ID 등록 시 지도가 표시됩니다</span>
                </div>
              )}

              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kakao-map-link"
                >
                  📍 지도 앱으로 열기
                </a>
              )}
            </div>
          )}
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

import { useEffect, useRef } from 'react';

interface Props {
  images: string[];
}

export function GallerySection({ images }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const revealEls = sectionRef.current?.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="section gallery-section" id="gallery" ref={sectionRef}>
      <div className="section-inner">
        <p className="section-label reveal">갤러리</p>
        <h2 className="section-title reveal">매장 &amp; 메뉴 사진</h2>
      </div>
      <div style={{ padding: '0 2rem' }}>
        <div className="gallery-scroll reveal">
          {images.map((src, i) => (
            <div key={i} className="gallery-item">
              <img src={src} alt={\`갤러리 이미지 \${i + 1}\`} loading="lazy" />
            </div>
          ))}
        </div>
        <p className="gallery-caption reveal">좌우로 스크롤하여 더 많은 사진을 확인하세요</p>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/sns-section.tsx
// ──────────────────────────────────────────────
const snsSection = `'use client';

import { useEffect, useRef } from 'react';
import type { SiteConfig } from '@/lib/config';

interface Props {
  config: SiteConfig;
}

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
  </svg>
);

const NaverIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3h6.5l5.5 8V3H19v16h-6.5L7 11v8H3V3z" fill="white"/>
  </svg>
);

const KakaoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3C7.03 3 3 6.36 3 10.5c0 2.65 1.6 4.97 4.01 6.33L6 21l4.5-2.5c.49.07.99.1 1.5.1 4.97 0 9-3.36 9-7.5S16.97 3 12 3z" fill="#3c1e1e"/>
  </svg>
);

export function SnsSection({ config }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const revealEls = sectionRef.current?.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const hasAnySns = config.instagramUrl || config.naverBlogUrl || config.kakaoChannelUrl;
  if (!hasAnySns) return null;

  const getHandle = (url: string): string => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split('/').filter(Boolean);
      return parts[parts.length - 1] ? \`@\${parts[parts.length - 1]}\` : u.hostname;
    } catch {
      return url;
    }
  };

  return (
    <section className="section sns-section" id="sns" ref={sectionRef}>
      <div className="section-inner">
        <p className="section-label reveal">소셜 미디어</p>
        <h2 className="section-title reveal">SNS &amp; 채널</h2>
        <p className="section-desc reveal">최신 소식과 이벤트를 팔로우하세요.</p>

        <div className="sns-grid reveal">
          {config.instagramUrl && (
            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sns-card sns-instagram"
            >
              <div className="sns-icon-wrap">
                <InstagramIcon />
              </div>
              <span className="sns-name">인스타그램</span>
              <span className="sns-handle">{getHandle(config.instagramUrl)}</span>
            </a>
          )}

          {config.naverBlogUrl && (
            <a
              href={config.naverBlogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sns-card sns-naver"
            >
              <div className="sns-icon-wrap">
                <NaverIcon />
              </div>
              <span className="sns-name">네이버 블로그</span>
              <span className="sns-handle">공식 블로그</span>
            </a>
          )}

          {config.kakaoChannelUrl && (
            <a
              href={config.kakaoChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sns-card sns-kakao"
            >
              <div className="sns-icon-wrap">
                <KakaoIcon />
              </div>
              <span className="sns-name">카카오톡 채널</span>
              <span className="sns-handle">채널 추가하기</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/footer.tsx
// ──────────────────────────────────────────────
const footerComponent = `import type { SiteConfig } from '@/lib/config';

interface Props {
  config: SiteConfig;
}

export function Footer({ config }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p className="footer-name">
        {config.name}{config.nameEn ? \` \${config.nameEn}\` : ''}
      </p>
      {(config.address || config.phone) && (
        <p className="footer-info">
          {config.address && <>{config.address}<br /></>}
          {config.phone && <>📞 {config.phone}</>}
        </p>
      )}
      <div className="footer-divider" />
      <p className="footer-copy">© {year} {config.name}. All rights reserved.</p>
      <a
        href="https://www.linkmap.biz/sites?utm_source=badge&utm_medium=referral&utm_campaign=small-biz"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-badge"
        aria-label="Made with Linkmap"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        Powered by Linkmap
      </a>
    </footer>
  );
}
`;

// ──────────────────────────────────────────────
// src/lib/config.ts
// ──────────────────────────────────────────────
const libConfig = `export interface MenuItem {
  name: string;
  nameEn?: string;
  desc: string;
  descEn?: string;
  price: string;
  category: string;
  emoji: string;
  imageUrl?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface BusinessHour {
  day: string;
  dayEn?: string;
  hours: string;
  hoursEn?: string;
  isHoliday?: boolean;
}

const DEMO_MENU: MenuItem[] = [
  {
    name: '\\uBAA8\\uB461\\uC0AC\\uC2DC\\uBBF8',
    nameEn: 'Assorted Sashimi',
    desc: '\\uC624\\uB298\\uC758 \\uC2E0\\uC120\\uD55C \\uC0DD\\uC120 5\\uC885, \\uC170\\uD504\\uAC00 \\uC9C1\\uC811 \\uC120\\uBCC4',
    descEn: 'Daily selection of 5 fresh fish by our chef',
    price: '\\u20A938,000',
    category: '\\uC0AC\\uC2DC\\uBBF8',
    emoji: '\\uD83D\\uDC1F',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&q=80&auto=format&fit=crop',
    isPopular: true,
  },
  {
    name: '\\uC5F0\\uC5B4 \\uC0AC\\uC2DC\\uBBF8',
    nameEn: 'Salmon Sashimi',
    desc: '\\uB178\\uB974\\uC6E8\\uC774\\uC0B0 \\uD504\\uB9AC\\uBBF8\\uC5C4 \\uC5F0\\uC5B4 12\\uC810',
    descEn: 'Premium Norwegian salmon, 12 slices',
    price: '\\u20A928,000',
    category: '\\uC0AC\\uC2DC\\uBBF8',
    emoji: '\\uD83C\\uDF63',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&q=80&auto=format&fit=crop',
  },
  {
    name: '\\uAD11\\uC5B4 \\uC6B0\\uC2A4\\uC988\\uCFE0\\uB9AC',
    nameEn: 'Hirame Usuzukuri',
    desc: '\\uC587\\uAC8C \\uC36C \\uAD11\\uC5B4\\uC5D0 \\uD3F0\\uC988 \\uC18C\\uC2A4\\uC640 \\uC720\\uC790 \\uD5A5',
    descEn: 'Thin-sliced flounder with ponzu and yuzu',
    price: '\\u20A932,000',
    category: '\\uC0AC\\uC2DC\\uBBF8',
    emoji: '\\uD83D\\uDC1F',
    imageUrl: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=200&h=200&q=80&auto=format&fit=crop',
    isNew: true,
  },
  {
    name: '\\uB2F7\\uC0AC\\uC774 23 \\uC900\\uB9C8\\uC774\\uB2E4\\uC774\\uAE34\\uC870',
    nameEn: 'Dassai 23 Junmai Daiginjo',
    desc: '\\uC57C\\uB9C8\\uAD6C\\uCE58\\uD604, \\uC815\\uBBF8\\uC728 23%. \\uB9D1\\uACE0 \\uACFC\\uC77C \\uD5A5\\uC774 \\uD48D\\uBD80',
    descEn: 'Yamaguchi, 23% polish. Clear, fruity aroma',
    price: '\\u20A945,000',
    category: '\\uC0AC\\uCF00',
    emoji: '\\uD83C\\uDF76',
    imageUrl: 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=200&h=200&q=80&auto=format&fit=crop',
    isPopular: true,
  },
  {
    name: '\\uAD6C\\uBCF4\\uD0C0 \\uB9CC\\uC8FC',
    nameEn: 'Kubota Manju',
    desc: '\\uB2C8\\uC774\\uAC00\\uD0C0\\uD604, \\uBD80\\uB4DC\\uB7FD\\uACE0 \\uAE4A\\uC740 \\uB9DB\\uC758 \\uC900\\uB9C8\\uC774\\uB2E4\\uC774\\uAE34\\uC870',
    descEn: 'Niigata, smooth and deep Junmai Daiginjo',
    price: '\\u20A938,000',
    category: '\\uC0AC\\uCF00',
    emoji: '\\uD83C\\uDF76',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&q=80&auto=format&fit=crop',
  },
  {
    name: '\\uD558\\uC774\\uBCFC',
    nameEn: 'Highball',
    desc: '\\uC0B0\\uD1A0\\uB9AC \\uC704\\uC2A4\\uD0A4 + \\uAC15\\uD0C4\\uC0B0, \\uB808\\uBAAC \\uD2B8\\uC704\\uC2A4\\uD2B8',
    descEn: 'Suntory whisky + strong soda, lemon twist',
    price: '\\u20A912,000',
    category: '\\uC74C\\uB8CC',
    emoji: '\\uD83E\\uDD43',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&q=80&auto=format&fit=crop',
  },
  {
    name: '\\uC2A4\\uD398\\uC15C \\uB864 \\uC138\\uD2B8',
    nameEn: 'Special Roll Set',
    desc: '\\uC170\\uD504 \\uCD94\\uCC9C \\uC2DC\\uADF8\\uB2C8\\uCC98 \\uB864 3\\uC885 \\uBAA8\\uC74C',
    descEn: "Chef's signature roll trio",
    price: '\\u20A935,000',
    category: '\\uC694\\uB9AC',
    emoji: '\\uD83C\\uDF71',
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200&h=200&q=80&auto=format&fit=crop',
    isNew: true,
  },
  {
    name: '\\uC640\\uADDC \\uD0C0\\uD0C0\\uD0A4',
    nameEn: 'Wagyu Tataki',
    desc: 'A5 \\uC640\\uADDC\\uB97C \\uC0B4\\uC9DD \\uAD6C\\uC6CC \\uD3F0\\uC988 \\uC18C\\uC2A4\\uC5D0 \\uACC1\\uB4E4\\uC784',
    descEn: 'Lightly seared A5 wagyu with ponzu sauce',
    price: '\\u20A942,000',
    category: '\\uC694\\uB9AC',
    emoji: '\\uD83E\\uDD69',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&q=80&auto=format&fit=crop',
    isPopular: true,
  },
  {
    name: '\\uC0C8\\uC6B0 \\uD150\\uD478\\uB77C',
    nameEn: 'Shrimp Tempura',
    desc: '\\uBC14\\uC0AD\\uD55C \\uC0C8\\uC6B0 \\uD150\\uD478\\uB77C 5\\uB9C8\\uB9AC, \\uD150\\uCE20\\uC720 \\uC18C\\uC2A4',
    descEn: 'Crispy shrimp tempura (5pcs) with tentsuyu',
    price: '\\u20A918,000',
    category: '\\uC694\\uB9AC',
    emoji: '\\uD83C\\uDF64',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&q=80&auto=format&fit=crop',
  },
  {
    name: '\\uC720\\uC790 \\uC154\\uBD07',
    nameEn: 'Yuzu Sorbet',
    desc: '\\uC2DD\\uD6C4 \\uC785\\uAC00\\uC2EC, \\uC0C1\\uD07C\\uD55C \\uC720\\uC790 \\uC154\\uBD07',
    descEn: 'Refreshing yuzu sorbet palate cleanser',
    price: '\\u20A98,000',
    category: '\\uB514\\uC800\\uD2B8',
    emoji: '\\uD83C\\uDF4B',
  },
];

const DEMO_HOURS: BusinessHour[] = [
  { day: '\\uC6D4\\uC694\\uC77C', dayEn: 'Monday', hours: '\\uC815\\uAE30\\uD734\\uBB34', isHoliday: true },
  { day: '\\uD654\\uC694\\uC77C', dayEn: 'Tuesday', hours: '17:00 - 24:00', hoursEn: '17:00 - 24:00' },
  { day: '\\uC218\\uC694\\uC77C', dayEn: 'Wednesday', hours: '17:00 - 24:00', hoursEn: '17:00 - 24:00' },
  { day: '\\uBAA9\\uC694\\uC77C', dayEn: 'Thursday', hours: '17:00 - 24:00', hoursEn: '17:00 - 24:00' },
  { day: '\\uAE08\\uC694\\uC77C', dayEn: 'Friday', hours: '17:00 - 01:00', hoursEn: '17:00 - 01:00' },
  { day: '\\uD1A0\\uC694\\uC77C', dayEn: 'Saturday', hours: '17:00 - 01:00', hoursEn: '17:00 - 01:00' },
  { day: '\\uC77C\\uC694\\uC77C', dayEn: 'Sunday', hours: '17:00 - 23:00', hoursEn: '17:00 - 23:00' },
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
  name: process.env.NEXT_PUBLIC_SITE_NAME || '\\uC5F0\\uB0A8 \\uC0AC\\uCF00\\uD558\\uC6B0\\uC2A4 \\u591C\\u5BB4',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || 'Yeonnam Sake House',
  description:
    process.env.NEXT_PUBLIC_DESCRIPTION ||
    '\\uD504\\uB9AC\\uBBF8\\uC5C4 \\uC0AC\\uC2DC\\uBBF8\\uC640 \\uC0AC\\uCF00\\uB97C \\uC990\\uAE30\\uB294 \\uBAA8\\uB358 \\uC694\\uB9AC\\uC8FC\\uC810',
  descriptionEn:
    process.env.NEXT_PUBLIC_DESCRIPTION_EN ||
    'Modern Japanese dining with premium sashimi and sake',
  phone: process.env.NEXT_PUBLIC_PHONE || '02-335-7890',
  address: process.env.NEXT_PUBLIC_ADDRESS || '\\uC11C\\uC6B8 \\uB9C8\\uD3EC\\uAD6C \\uC5F0\\uB0A8\\uB85C 23\\uAE38 12, 1\\uCE35',
  addressEn: process.env.NEXT_PUBLIC_ADDRESS_EN || '1F, 12, Yeonnam-ro 23-gil, Mapo-gu, Seoul',
  kakaoMapId: process.env.NEXT_PUBLIC_KAKAO_MAP_ID || '',
  menuItems: parseJSON<MenuItem[]>(process.env.NEXT_PUBLIC_MENU_ITEMS, DEMO_MENU),
  businessHours: parseJSON<BusinessHour[]>(process.env.NEXT_PUBLIC_BUSINESS_HOURS, DEMO_HOURS),
  galleryImages: parseJSON<string[]>(process.env.NEXT_PUBLIC_GALLERY_IMAGES, [
    'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=600&q=80&fit=crop',
    'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&q=80&fit=crop',
    'https://images.unsplash.com/photo-1607301405752-8e2a79fe4a84?w=400&q=80&fit=crop',
  ]),
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  naverBlogUrl: process.env.NEXT_PUBLIC_NAVER_BLOG_URL || '',
  kakaoChannelUrl: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || '',
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#c8a97e',
  fontFamily: process.env.NEXT_PUBLIC_FONT_FAMILY || 'Nanum Myeongjo',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
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
    'nav.menu': '메뉴',
    'nav.hours': '영업시간',
    'nav.location': '오시는 길',
    'hero.call': '전화하기',
    'quick.call': '전화',
    'quick.directions': '길찾기',
    'quick.hours': '영업시간',
    'menu.title': '메뉴',
    'menu.popular': '인기',
    'bottom.call': '전화하기',
    'bottom.kakao': '카카오 상담',
    'hours.title': '영업시간',
    'hours.today': '오늘',
    'location.title': '오시는 길',
    'gallery.title': '갤러리',
    'sns.title': 'SNS',
    'sns.naver': '네이버 블로그',
    'sns.kakao': '카카오톡 채널',
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
    'lang.switchLabel': 'Switch to English',
    'lang.toggle': 'EN',
  },
  en: {
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.hours': 'Hours',
    'nav.location': 'Location',
    'hero.call': 'Call Now',
    'quick.call': 'Call',
    'quick.directions': 'Directions',
    'quick.hours': 'Hours',
    'menu.title': 'Menu',
    'menu.popular': 'Popular',
    'bottom.call': 'Call Now',
    'bottom.kakao': 'KakaoTalk',
    'hours.title': 'Business Hours',
    'hours.today': 'Today',
    'location.title': 'Location',
    'gallery.title': 'Gallery',
    'sns.title': 'Follow Us',
    'sns.naver': 'Naver Blog',
    'sns.kakao': 'KakaoTalk Channel',
    'theme.light': 'Switch to light mode',
    'theme.dark': 'Switch to dark mode',
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
}
`;

// ──────────────────────────────────────────────
// Assemble template
// ──────────────────────────────────────────────
export const smallBizTemplate: HomepageTemplateContent = {
  slug: 'small-biz',
  repoName: 'small-biz',
  description: '우리가게 홍보 페이지 - Linkmap으로 생성',
  files: [
    { path: '.gitignore', content: gitignore },
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
    { path: 'src/components/nav-header.tsx', content: navHeader },
    { path: 'src/components/hero-section.tsx', content: heroSection },
    { path: 'src/components/quick-actions.tsx', content: quickActions },
    { path: 'src/components/menu-section.tsx', content: menuSection },
    { path: 'src/components/info-section.tsx', content: infoSection },
    { path: 'src/components/gallery-section.tsx', content: gallerySection },
    { path: 'src/components/sns-section.tsx', content: snsSection },
    { path: 'src/components/footer.tsx', content: footerComponent },
    { path: 'src/components/theme-toggle.tsx', content: themeToggle },
    { path: 'src/components/language-toggle.tsx', content: languageToggle },
    { path: 'src/lib/config.ts', content: libConfig },
    { path: 'src/lib/i18n.tsx', content: libI18n },
  ],
};
