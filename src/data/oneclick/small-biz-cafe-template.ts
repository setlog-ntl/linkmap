// ──────────────────────────────────────────────
// Small Biz Cafe Template — 온기 로스터리 (독립 파일)
// ──────────────────────────────────────────────

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

const packageJson = makePackageJson('small-biz-cafe');

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
          background: 'linear-gradient(160deg, #8b6914 0%, #a47f1c 35%, #c49a25 70%, #e8c84a 100%)',
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
  --brand-primary:   #8b6914;
  --brand-secondary: #d4a843;
  --accent:          #6b5210;
  --bg-page:         #faf6f0;
  --bg-card:         #fff8ee;
  --bg-card-border:  #e8dcc8;
  --text-dark:       #3d2e0a;
  --text-mid:        #5c4a1e;
  --text-muted:      rgba(139, 105, 20, 0.53);
  --text-light:      #8b6914;

  --font-display: 'Nanum Myeongjo', 'Georgia', 'Times New Roman', serif;
  --font-body: 'Nanum Myeongjo', 'Pretendard Variable', system-ui, -apple-system, 'Segoe UI', sans-serif;

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;

  --section-gap: 5rem;
  --content-max: 900px;

  /* Primary color override via config */
  --color-primary: #8b6914;
  --color-secondary: #d4a843;
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
  background: rgba(250, 246, 240, 0.85);
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
  background: linear-gradient(160deg, #8b6914 0%, #a47f1c 35%, #c49a25 70%, #e8c84a 100%);
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
  background: radial-gradient(circle, #f5e6a3, transparent 70%);
}
.hero-circle-2 {
  width: 400px; height: 400px;
  bottom: -100px; left: -80px;
  background: radial-gradient(circle, #f0dca0, transparent 70%);
  opacity: 0.12;
}
.hero-circle-3 {
  width: 200px; height: 200px;
  top: 30%; left: 10%;
  background: radial-gradient(circle, #faf0d4, transparent 70%);
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
  background: rgba(139, 105, 20, 0.08);
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
  gap: 0.75rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid rgba(232, 220, 200, 0.6);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s ease, transform 0.4s ease, background 0.15s;
}
.menu-item:last-child { border-bottom: none; }
.menu-item:hover { background: rgba(139, 105, 20, 0.025); }
.menu-item.visible {
  opacity: 1;
  transform: none;
}
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
  color: #8b6914;
  border: 1px solid #d4a843;
  animation: badgePulse 2s ease-in-out infinite;
}
.badge-popular {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.menu-item-desc {
  grid-column: 1;
  grid-row: 2;
  font-size: 0.8125rem;
  color: var(--text-light);
  margin-top: 0.2rem;
}

.menu-item-price {
  grid-column: 2;
  grid-row: 1;
  font-size: 1rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--brand-primary);
  white-space: nowrap;
  align-self: start;
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
  border-bottom: 1px dashed rgba(232, 220, 200, 0.8);
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
  background: linear-gradient(135deg, #f5e6a3, #e8c84a, #d4a843);
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--brand-primary);
  font-size: 0.8125rem;
  margin-bottom: 1rem;
  border: 1px solid #d4a843;
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
    rgba(139, 105, 20, 0.04) 20px,
    rgba(139, 105, 20, 0.04) 40px
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
  box-shadow: 0 12px 32px rgba(139, 105, 20, 0.15);
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
      <p className="footer-copy">&copy; {year} {config.name}. All rights reserved.</p>
      <a
        href="https://www.linkmap.biz/sites?utm_source=badge&utm_medium=referral&utm_campaign=small-biz-cafe"
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
    name: '아메리카노',
    nameEn: 'Americano',
    desc: '에티오피아 예가체프 싱글 오리진, 화사한 과일 산미',
    descEn: 'Ethiopia Yirgacheffe single origin, bright fruity acidity',
    price: '₩4,500',
    category: '커피',
    emoji: '☕',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=120&h=120&q=80&auto=format&fit=crop',
  },
  {
    name: '카페라떼',
    nameEn: 'Cafe Latte',
    desc: '스팀 밀크와 에스프레소의 완벽한 균형',
    descEn: 'Perfect balance of steamed milk and espresso',
    price: '₩5,000',
    category: '커피',
    emoji: '☕',
    imageUrl: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=120&h=120&q=80&auto=format&fit=crop',
  },
  {
    name: '바닐라라떼',
    nameEn: 'Vanilla Latte',
    desc: '마다가스카르 바닐라빈, 부드러운 단맛',
    descEn: 'Madagascar vanilla bean, smooth sweetness',
    price: '₩5,500',
    category: '커피',
    emoji: '☕',
  },
  {
    name: '콜드브루',
    nameEn: 'Cold Brew',
    desc: '18시간 저온 추출, 깔끔하고 깊은 풍미',
    descEn: '18-hour cold extraction, clean and deep flavor',
    price: '₩5,000',
    category: '커피',
    emoji: '☕',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=120&h=120&q=80&auto=format&fit=crop',
    isPopular: true,
  },
  {
    name: '플랫화이트',
    nameEn: 'Flat White',
    desc: '리스트레토 더블샷 + 마이크로폼, 진한 커피 풍미',
    descEn: 'Ristretto double shot + microfoam, intense coffee flavour',
    price: '₩5,800',
    category: '커피',
    emoji: '☕',
    isPopular: true,
  },
  {
    name: '아인슈페너',
    nameEn: 'Einspänner',
    desc: '비엔나 스타일, 생크림 위에 에스프레소',
    descEn: 'Vienna style, espresso over whipped cream',
    price: '₩6,000',
    category: '커피',
    emoji: '☕',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=120&h=120&q=80&auto=format&fit=crop',
    isNew: true,
  },
  {
    name: '말차라떼',
    nameEn: 'Matcha Latte',
    desc: '교토 우지 말차 1등급, 부드러운 밀크폼',
    descEn: 'Kyoto Uji matcha grade 1, smooth milk foam',
    price: '₩6,000',
    category: '논커피',
    emoji: '🍵',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=120&h=120&q=80&auto=format&fit=crop',
  },
  {
    name: '얼그레이라떼',
    nameEn: 'Earl Grey Latte',
    desc: '베르가못 향 가득한 밀크티 라떼',
    descEn: 'Bergamot-infused milk tea latte',
    price: '₩5,500',
    category: '논커피',
    emoji: '🍵',
  },
  {
    name: '유자에이드',
    nameEn: 'Yuzu Ade',
    desc: '고흥 유자청, 상큼한 시트러스 에이드',
    descEn: 'Goheung yuzu marmalade, refreshing citrus ade',
    price: '₩5,500',
    category: '논커피',
    emoji: '🍵',
    isNew: true,
  },
  {
    name: '자몽에이드',
    nameEn: 'Grapefruit Ade',
    desc: '플로리다 자몽, 탄산과 함께 청량하게',
    descEn: 'Florida grapefruit, refreshing with sparkling water',
    price: '₩5,500',
    category: '논커피',
    emoji: '🍵',
  },
  {
    name: '당근케이크',
    nameEn: 'Carrot Cake',
    desc: '크림치즈 프로스팅, 촉촉한 당근 케이크 1조각',
    descEn: 'Cream cheese frosting, moist carrot cake slice',
    price: '₩6,500',
    category: '디저트',
    emoji: '🍰',
    imageUrl: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=120&h=120&q=80&auto=format&fit=crop',
    isPopular: true,
  },
  {
    name: '크루아상',
    nameEn: 'Croissant',
    desc: '프랑스산 버터 100%, 바삭한 결이 살아있는',
    descEn: '100% French butter, flaky and crispy layers',
    price: '₩4,500',
    category: '디저트',
    emoji: '🍰',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&h=120&q=80&auto=format&fit=crop',
  },
  {
    name: '티라미수',
    nameEn: 'Tiramisu',
    desc: '마스카포네 크림, 이탈리아 레시피 정통 티라미수',
    descEn: 'Mascarpone cream, authentic Italian recipe tiramisu',
    price: '₩7,000',
    category: '디저트',
    emoji: '🍰',
    isNew: true,
  },
  {
    name: '바스크치즈케이크',
    nameEn: 'Basque Cheesecake',
    desc: '겉바속촉, 진한 치즈의 풍미가 가득한',
    descEn: 'Crispy outside, creamy inside, rich cheese flavor',
    price: '₩7,500',
    category: '디저트',
    emoji: '🍰',
    imageUrl: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=120&h=120&q=80&auto=format&fit=crop',
  },
  {
    name: '에티오피아 예가체프',
    nameEn: 'Ethiopia Yirgacheffe',
    desc: '워시드, 플로럴 & 시트러스 노트, 200g 원두',
    descEn: 'Washed, floral & citrus notes, 200g whole beans',
    price: '₩18,000',
    category: '원두',
    emoji: '🫘',
    imageUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=120&h=120&q=80&auto=format&fit=crop',
    isPopular: true,
  },
  {
    name: '콜롬비아 수프레모',
    nameEn: 'Colombia Supremo',
    desc: '내추럴, 초콜릿 & 견과류 노트, 200g 원두',
    descEn: 'Natural, chocolate & nutty notes, 200g whole beans',
    price: '₩16,000',
    category: '원두',
    emoji: '🫘',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=120&h=120&q=80&auto=format&fit=crop',
  },
];

const DEMO_HOURS: BusinessHour[] = [
  { day: '월요일', dayEn: 'Monday', hours: '정기휴무', isHoliday: true },
  { day: '화요일', dayEn: 'Tuesday', hours: '09:00 - 22:00', hoursEn: '09:00 - 22:00' },
  { day: '수요일', dayEn: 'Wednesday', hours: '09:00 - 22:00', hoursEn: '09:00 - 22:00' },
  { day: '목요일', dayEn: 'Thursday', hours: '09:00 - 22:00', hoursEn: '09:00 - 22:00' },
  { day: '금요일', dayEn: 'Friday', hours: '09:00 - 22:00', hoursEn: '09:00 - 22:00' },
  { day: '토요일', dayEn: 'Saturday', hours: '09:00 - 22:00', hoursEn: '09:00 - 22:00' },
  { day: '일요일', dayEn: 'Sunday', hours: '09:00 - 22:00', hoursEn: '09:00 - 22:00' },
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
  name: process.env.NEXT_PUBLIC_SITE_NAME || '온기 로스터리',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || 'Ongi Roastery',
  description:
    process.env.NEXT_PUBLIC_DESCRIPTION ||
    '매일 아침, 직접 로스팅한 한 잔의 커피',
  descriptionEn:
    process.env.NEXT_PUBLIC_DESCRIPTION_EN ||
    'A cup of freshly roasted coffee every morning',
  phone: process.env.NEXT_PUBLIC_PHONE || '02-338-1204',
  address: process.env.NEXT_PUBLIC_ADDRESS || '서울 마포구 연남로 23길 8, 1층',
  addressEn: process.env.NEXT_PUBLIC_ADDRESS_EN || '1F, 8, Yeonnam-ro 23-gil, Mapo-gu, Seoul',
  kakaoMapId: process.env.NEXT_PUBLIC_KAKAO_MAP_ID || '',
  menuItems: parseJSON<MenuItem[]>(process.env.NEXT_PUBLIC_MENU_ITEMS, DEMO_MENU),
  businessHours: parseJSON<BusinessHour[]>(process.env.NEXT_PUBLIC_BUSINESS_HOURS, DEMO_HOURS),
  galleryImages: parseJSON<string[]>(process.env.NEXT_PUBLIC_GALLERY_IMAGES, [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&h=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&h=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=600&h=600&q=80&auto=format&fit=crop',
  ]),
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  naverBlogUrl: process.env.NEXT_PUBLIC_NAVER_BLOG_URL || '',
  kakaoChannelUrl: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || '',
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#8b6914',
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
export const smallBizCafeTemplate: HomepageTemplateContent = {
  slug: 'small-biz-cafe',
  repoName: 'small-biz-cafe',
  description: '카페 홍보 원페이지 - Linkmap으로 생성',
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
