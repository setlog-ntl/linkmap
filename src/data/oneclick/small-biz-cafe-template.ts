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

/* ─── CSS 변수 — 라이트 모드 ──────────────── */
:root,
[data-theme="light"] {
  --brand-primary:   #8b6914;
  --brand-secondary: #a0784c;
  --brand-accent:    #c9a96e;
  --accent-green:    #2d6a4f;

  --bg-page:         #faf8f5;
  --bg-card:         #ffffff;
  --bg-card-hover:   #f5f0e8;
  --bg-card-border:  #e8ddd0;
  --bg-subtle:       #f2ede6;

  --text-dark:       #1c1410;
  --text-mid:        #4a3728;
  --text-muted:      #8b7060;
  --text-light:      #a08060;

  --nav-bg:          rgba(250, 248, 245, 0.88);
  --hero-overlay:    rgba(28, 20, 16, 0.45);
  --shadow-sm:       0 1px 4px rgba(28,20,16,0.08);
  --shadow-md:       0 4px 16px rgba(28,20,16,0.10);
  --shadow-lg:       0 12px 40px rgba(28,20,16,0.14);

  --font-display: 'Nanum Myeongjo', 'Georgia', serif;
  --font-body:    'Pretendard Variable', 'Pretendard', system-ui, -apple-system, sans-serif;

  --radius-sm:  6px;
  --radius-md:  14px;
  --radius-lg:  22px;
  --radius-xl:  32px;

  --content-max: 920px;
}

/* ─── 다크 모드 ──────────────────────────── */
[data-theme="dark"] {
  --brand-primary:   #c9a96e;
  --brand-secondary: #a0784c;
  --brand-accent:    #8b6914;
  --accent-green:    #52b788;

  --bg-page:         #1a1612;
  --bg-card:         #231e18;
  --bg-card-hover:   #2c2520;
  --bg-card-border:  #3d342a;
  --bg-subtle:       #1f1a15;

  --text-dark:       #f2ede6;
  --text-mid:        #c8b8a8;
  --text-muted:      #8b7868;
  --text-light:      #9a8878;

  --nav-bg:          rgba(26, 22, 18, 0.90);
  --hero-overlay:    rgba(10, 8, 6, 0.55);
  --shadow-sm:       0 1px 4px rgba(0,0,0,0.30);
  --shadow-md:       0 4px 16px rgba(0,0,0,0.40);
  --shadow-lg:       0 12px 40px rgba(0,0,0,0.55);
}

/* ─── prefers-reduced-motion ──────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ─── Reset & Base ────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg-page);
  color: var(--text-dark);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  transition: background 0.3s ease, color 0.3s ease;
}

a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }

*:focus-visible {
  outline: 2px solid var(--brand-secondary);
  outline-offset: 2px;
}

/* ─── Nav ─────────────────────────────────── */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 58px;
  background: var(--nav-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--bg-card-border);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--brand-primary);
  letter-spacing: 0.01em;
}

.nav-logo-sub {
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  display: block;
  line-height: 1;
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
  width: 0; height: 1.5px;
  background: var(--brand-primary);
  transition: width 0.25s ease;
}
.nav-links a:hover { color: var(--brand-primary); }
.nav-links a:hover::after { width: 100%; }

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* 다크 모드 토글 */
.theme-toggle {
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 1px solid var(--bg-card-border);
  background: var(--bg-card);
  color: var(--text-mid);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
  flex-shrink: 0;
}
.theme-toggle:hover {
  background: var(--bg-subtle);
  transform: rotate(20deg);
}

.nav-cta {
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 7px 20px;
  background: var(--brand-primary);
  color: #fff;
  border-radius: 999px;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  white-space: nowrap;
}
.nav-cta:hover {
  background: var(--text-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* ─── Hero ────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 6rem 2rem 5rem;
}

.hero-bg-img {
  position: absolute;
  inset: 0;
  background:
    url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80&auto=format&fit=crop')
    center center / cover no-repeat;
  transform: scale(1.05);
  transition: transform 8s ease;
}
.hero:hover .hero-bg-img { transform: scale(1); }

.hero-overlay {
  position: absolute;
  inset: 0;
  background: var(--hero-overlay);
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(28, 20, 16, 0.10) 0%,
    rgba(28, 20, 16, 0.30) 50%,
    rgba(28, 20, 16, 0.65) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 680px;
  color: #fff;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.80);
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.22);
  padding: 6px 16px;
  border-radius: 999px;
  margin-bottom: 1.75rem;
  opacity: 0;
  animation: fadeUp 0.6s ease 0.2s forwards;
}
.hero-badge-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--brand-accent);
}

.hero-name {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 8vw, 5rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.01em;
  margin-bottom: 0.4rem;
  text-shadow: 0 2px 24px rgba(0,0,0,0.35);
  opacity: 0;
  animation: fadeUp 0.7s ease 0.4s forwards;
}

.hero-name-en {
  font-family: var(--font-display);
  font-size: clamp(0.9rem, 2vw, 1.25rem);
  font-weight: 400;
  letter-spacing: 0.3em;
  color: rgba(255,255,255,0.60);
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeUp 0.7s ease 0.55s forwards;
}

.hero-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
  opacity: 0;
  animation: fadeUp 0.6s ease 0.7s forwards;
}
.hero-divider-line {
  width: 52px; height: 1px;
  background: rgba(255,255,255,0.35);
}
.hero-divider-bean { font-size: 0.75rem; }

.hero-slogan {
  font-family: var(--font-display);
  font-size: clamp(1rem, 2.5vw, 1.3rem);
  font-style: italic;
  color: rgba(255,255,255,0.88);
  font-weight: 400;
  margin-bottom: 2.5rem;
  line-height: 1.65;
  opacity: 0;
  animation: fadeUp 0.7s ease 0.85s forwards;
}

/* 영업 상태 뱃지 */
.hero-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeUp 0.6s ease 1.0s forwards;
}
.hero-status.open {
  background: rgba(82, 183, 136, 0.2);
  color: #a7f3c0;
  border: 1px solid rgba(82, 183, 136, 0.4);
}
.hero-status.closed {
  background: rgba(220, 38, 38, 0.15);
  color: #fca5a5;
  border: 1px solid rgba(220, 38, 38, 0.3);
}
.hero-status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
}
.hero-status.open .hero-status-dot {
  background: #52b788;
  animation: blink 1.4s ease-in-out infinite;
}
.hero-status.closed .hero-status-dot { background: #dc2626; }

.hero-actions {
  display: flex;
  gap: 0.875rem;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  animation: fadeUp 0.7s ease 1.1s forwards;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8125rem 2rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
  border: none;
}
.btn:hover { transform: translateY(-2px); }

.btn-primary {
  background: #fff;
  color: var(--brand-primary);
  box-shadow: 0 4px 20px rgba(0,0,0,0.18);
}
.btn-primary:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.24); }

.btn-outline {
  background: rgba(255,255,255,0.10);
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.38);
  backdrop-filter: blur(8px);
}
.btn-outline:hover { background: rgba(255,255,255,0.18); }

.hero-scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.45);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0;
  animation: fadeIn 1s ease 1.8s forwards;
}
.hero-scroll-arrow {
  width: 18px; height: 18px;
  border-right: 1.5px solid rgba(255,255,255,0.35);
  border-bottom: 1.5px solid rgba(255,255,255,0.35);
  transform: rotate(45deg);
  animation: scrollBounce 1.4s ease-in-out infinite;
}

/* ─── Quick Actions ───────────────────────── */
.quick-actions {
  background: var(--bg-card);
  border-bottom: 1px solid var(--bg-card-border);
  padding: 0.875rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem 1.75rem;
  flex-wrap: wrap;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.875rem;
  color: var(--text-mid);
  padding: 0.45rem 0.875rem;
  border-radius: var(--radius-sm);
  transition: background 0.2s, color 0.2s;
}
.quick-action:hover {
  background: var(--bg-subtle);
  color: var(--brand-primary);
}
.quick-action-icon { font-size: 1.05rem; }

.quick-action-tel {
  font-weight: 600;
  color: var(--brand-primary);
}

.quick-sep {
  width: 1px; height: 18px;
  background: var(--bg-card-border);
  flex-shrink: 0;
}

/* ─── Section Common ──────────────────────── */
.section {
  padding: 5.5rem 2rem;
}
.section-inner {
  max-width: var(--content-max);
  margin: 0 auto;
}

.section-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--brand-primary);
  margin-bottom: 0.4rem;
}
.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 0.6rem;
  line-height: 1.2;
}
.section-desc {
  font-size: 0.9375rem;
  color: var(--text-light);
  margin-bottom: 3rem;
  line-height: 1.75;
}

/* ─── About (소개) ────────────────────────── */
.about-section {
  background: var(--bg-card);
  border-bottom: 1px solid var(--bg-card-border);
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

@media (max-width: 700px) {
  .about-grid { grid-template-columns: 1fr; gap: 2rem; }
}

.about-story {
  font-size: 0.9375rem;
  color: var(--text-mid);
  line-height: 1.85;
}
.about-story + .about-story { margin-top: 1rem; }

.about-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.about-tag {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--brand-secondary);
  background: var(--bg-subtle);
  border: 1px solid var(--bg-card-border);
  padding: 4px 14px;
  border-radius: 999px;
}

.about-values {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.about-value-card {
  background: var(--bg-subtle);
  border: 1px solid var(--bg-card-border);
  border-radius: var(--radius-md);
  padding: 1.25rem 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: box-shadow 0.2s, transform 0.2s;
}
.about-value-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.about-value-icon { font-size: 1.5rem; flex-shrink: 0; }

.about-value-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.2rem;
}
.about-value-desc {
  font-size: 0.8125rem;
  color: var(--text-light);
  line-height: 1.6;
}

/* ─── Menu (탭) ───────────────────────────── */
.menu-section {
  background: var(--bg-page);
}

/* 탭 네비게이션 */
.menu-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 2.5rem;
  background: var(--bg-subtle);
  border: 1px solid var(--bg-card-border);
  border-radius: var(--radius-lg);
  padding: 5px;
  overflow-x: auto;
  scrollbar-width: none;
}
.menu-tabs::-webkit-scrollbar { display: none; }

.menu-tab-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.25rem;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}
.menu-tab-btn.active {
  background: var(--bg-card);
  color: var(--brand-primary);
  box-shadow: var(--shadow-sm);
  font-weight: 600;
}
.menu-tab-btn:hover:not(.active) {
  background: var(--bg-card-hover);
  color: var(--text-mid);
}

/* 탭 패널 */
.menu-panel {
  display: none;
}
.menu-panel.active { display: block; }

/* 메뉴 아이템 — CSS Grid 3열 */
.menu-item {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  grid-template-rows: auto auto;
  column-gap: 1.25rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--bg-card-border);
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease, transform 0.4s ease, background 0.15s;
  border-radius: var(--radius-sm);
}
.menu-item:last-child { border-bottom: none; }
.menu-item:hover { background: var(--bg-subtle); }
.menu-item.visible { opacity: 1; transform: none; }

.menu-item-thumb {
  grid-column: 1;
  grid-row: 1 / 3;
  width: 60px; height: 60px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background: var(--bg-subtle);
  flex-shrink: 0;
  align-self: center;
}
.menu-item-thumb-placeholder {
  width: 60px; height: 60px;
  border-radius: var(--radius-sm);
  background: var(--bg-subtle);
  border: 1px solid var(--bg-card-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  grid-column: 1;
  grid-row: 1 / 3;
  align-self: center;
}

.menu-item-name-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
  grid-column: 2;
  grid-row: 1;
}
.menu-item-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-dark);
}
.menu-item-name-en {
  font-size: 0.8rem;
  color: var(--text-light);
  font-style: italic;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.5;
}
.badge-new {
  background: #fef9ee;
  color: #92400e;
  border: 1px solid #f6d78c;
  animation: badgePulse 2.2s ease-in-out infinite;
}
.badge-popular {
  background: #ecfdf5;
  color: var(--accent-green);
  border: 1px solid #6ee7b7;
}
.badge-season {
  background: #fdf4ff;
  color: #7e22ce;
  border: 1px solid #d8b4fe;
}

.menu-item-desc {
  grid-column: 2;
  grid-row: 2;
  font-size: 0.8125rem;
  color: var(--text-light);
  margin-top: 0.2rem;
  line-height: 1.5;
}

.menu-item-price {
  grid-column: 3;
  grid-row: 1;
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--brand-primary);
  white-space: nowrap;
  align-self: start;
  padding-top: 2px;
}
.menu-item-price-sub {
  grid-column: 3;
  grid-row: 2;
  font-size: 0.75rem;
  color: var(--text-light);
  text-align: right;
  white-space: nowrap;
}

/* ─── Info (영업시간 + 위치) ──────────────── */
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
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 1.25rem;
  padding-bottom: 0.875rem;
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
  padding: 0.55rem 0;
  font-size: 0.9rem;
  border-bottom: 1px dashed var(--bg-card-border);
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
.hours-time { text-align: right; color: var(--text-mid); }
.hours-item.today .hours-time { color: var(--brand-primary); }

.hours-note {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--bg-card-border);
}

.open-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 1.25rem;
  padding: 7px 16px;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
}
.open-badge.open {
  background: #ecfdf5;
  color: var(--accent-green);
  border: 1px solid #6ee7b7;
}
.open-badge.closed {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}
[data-theme="dark"] .open-badge.open {
  background: rgba(82,183,136,0.15);
  border-color: rgba(82,183,136,0.35);
}
[data-theme="dark"] .open-badge.closed {
  background: rgba(220,38,38,0.15);
  border-color: rgba(220,38,38,0.35);
}
.open-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
}
.open-badge.open .open-dot {
  background: var(--accent-green);
  animation: blink 1.4s ease-in-out infinite;
}
.open-badge.closed .open-dot { background: #dc2626; }

.phone-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: 700;
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
  line-height: 1.65;
  margin-bottom: 0.4rem;
}
.address-text-en {
  font-size: 0.8125rem;
  color: var(--text-light);
  margin-bottom: 1.25rem;
}

.map-placeholder {
  width: 100%;
  aspect-ratio: 16/10;
  background: linear-gradient(135deg, #f5f0e6, #ede4d4);
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--brand-primary);
  font-size: 0.8125rem;
  margin-bottom: 1rem;
  border: 1px solid var(--bg-card-border);
  position: relative;
  overflow: hidden;
}
[data-theme="dark"] .map-placeholder {
  background: linear-gradient(135deg, #2c2520, #231e18);
}
.map-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 22px,
    rgba(139,105,20,0.04) 22px,
    rgba(139,105,20,0.04) 44px
  );
}
.map-icon-big { font-size: 2.25rem; position: relative; z-index: 1; }
.map-label { font-weight: 600; position: relative; z-index: 1; }
.map-sub { color: var(--text-light); font-size: 0.75rem; position: relative; z-index: 1; }

.map-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.map-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  transition: background 0.2s, transform 0.15s;
}
.map-btn:hover { transform: translateY(-1px); }
.map-btn-kakao {
  background: #fee500;
  color: #3c1e1e;
}
.map-btn-kakao:hover { background: #fdd800; }
.map-btn-naver {
  background: #03c75a;
  color: #fff;
}
.map-btn-naver:hover { background: #02b350; }

.transport-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1rem;
}

.transport-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--text-mid);
  background: var(--bg-subtle);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--bg-card-border);
}

/* ─── Gallery ─────────────────────────────── */
.gallery-section {
  background: var(--bg-page);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.gallery-item {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background: var(--bg-subtle);
}
.gallery-item img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.gallery-item:hover img { transform: scale(1.08); }

.gallery-item-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(28,20,16,0.65) 0%, transparent 55%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 0.875rem;
}
.gallery-item:hover .gallery-item-overlay { opacity: 1; }

.gallery-item-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0,0,0,0.4);
}

.gallery-item-placeholder {
  width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--bg-subtle);
}
.gallery-emoji { font-size: 2.75rem; }
.gallery-label-text {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-muted);
}

.gallery-caption {
  font-size: 0.8125rem;
  color: var(--text-light);
  text-align: center;
  margin-top: 1rem;
}

/* ─── SNS ─────────────────────────────────── */
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
  border: 1.5px solid var(--bg-card-border);
  background: var(--bg-page);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
}
.sns-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.sns-instagram:hover { border-color: #e1306c; }
.sns-naver:hover     { border-color: #03c75a; }
.sns-kakao:hover     { border-color: #fee500; }

.sns-icon-wrap {
  width: 58px; height: 58px;
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
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--text-dark);
}
.sns-handle {
  font-size: 0.8125rem;
  color: var(--text-light);
  text-align: center;
}
.sns-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
  margin-top: -0.25rem;
}

/* ─── Footer ──────────────────────────────── */
footer {
  background: #16120e;
  color: rgba(255,255,255,0.55);
  padding: 3.5rem 2rem 2.5rem;
  text-align: center;
}

.footer-logo {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: rgba(255,255,255,0.88);
  margin-bottom: 0.2rem;
}
.footer-logo-sub {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 1.25rem;
}
.footer-info {
  font-size: 0.875rem;
  line-height: 1.9;
  margin-bottom: 1.5rem;
}
.footer-divider {
  width: 40px; height: 1px;
  background: rgba(255,255,255,0.12);
  margin: 1.5rem auto;
}
.footer-powered {
  font-size: 0.8125rem;
  color: rgba(255,255,255,0.35);
  margin-bottom: 0.75rem;
}
.footer-powered a {
  color: var(--brand-accent);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.footer-copy {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.22);
}

/* ─── Reveal 애니메이션 ───────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.reveal.visible {
  opacity: 1;
  transform: none;
}

/* ─── Keyframes ───────────────────────────── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: none; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.25; }
}
@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.07); }
}
@keyframes scrollBounce {
  0%, 100% { transform: rotate(45deg) translateY(0); }
  50%       { transform: rotate(45deg) translateY(5px); }
}

/* ─── Mobile ──────────────────────────────── */
@media (max-width: 480px) {
  .nav-links { display: none; }
  .section { padding: 3.5rem 1.25rem; }
  .info-card { padding: 1.5rem; }
  .menu-tab-btn { padding: 0.5rem 1rem; font-size: 0.8125rem; }
  .menu-item { grid-template-columns: 52px 1fr auto; }
  .menu-item-thumb,
  .menu-item-thumb-placeholder { width: 50px; height: 50px; }
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
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
import { AboutSection } from '@/components/about-section';
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
        <AboutSection config={siteConfig} />
        {siteConfig.menuItems.length > 0 && (
          <MenuSection items={siteConfig.menuItems} />
        )}
        <InfoSection config={siteConfig} />
        {siteConfig.galleryImages.length > 0 && (
          <GallerySection images={siteConfig.galleryImages} galleryLabels={siteConfig.galleryLabels} />
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('theme');
    const initial = (saved as 'light' | 'dark') || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const navLinks = [
    { href: '#about', label: '소개' },
    { href: '#menu', label: '메뉴' },
    { href: '#info', label: '영업정보' },
    { href: '#gallery', label: '갤러리' },
  ].filter((link) => {
    if (link.href === '#menu' && config.menuItems.length === 0) return false;
    if (link.href === '#gallery' && config.galleryImages.length === 0) return false;
    return true;
  });

  return (
    <nav className="nav" role="navigation" aria-label="주 메뉴">
      <div className="nav-left">
        <div>
          <a href="#top" className="nav-logo">{config.name}</a>
          {config.nameEn && (
            <span className="nav-logo-sub">{config.nameEn}</span>
          )}
        </div>
      </div>
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      <div className="nav-right">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="다크/라이트 모드 전환"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {config.phone && (
          <a href={\`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`} className="nav-cta">
            전화하기
          </a>
        )}
      </div>
    </nav>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/hero-section.tsx
// ──────────────────────────────────────────────
const heroSection = `'use client';

import { useEffect, useState } from 'react';
import type { SiteConfig } from '@/lib/config';

interface Props {
  config: SiteConfig;
}

const DAY_MAP: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
};

function getHeroStatus(hours: SiteConfig['businessHours']): { isOpen: boolean; isHoliday: boolean } {
  const now = new Date();
  const todayIdx = now.getDay();
  const todayHour = hours.find((h) => (DAY_MAP[h.dayEn ?? ''] ?? -1) === todayIdx);
  if (!todayHour) return { isOpen: false, isHoliday: false };
  if (todayHour.isHoliday) return { isOpen: false, isHoliday: true };
  const timeStr = todayHour.hoursEn || todayHour.hours;
  const match = timeStr.match(/(\\d{1,2}):(\\d{2})\\s*[-–]\\s*(\\d{1,2}):(\\d{2})/);
  if (!match) return { isOpen: false, isHoliday: false };
  const [, sh, sm, eh, em] = match;
  const cur = now.getHours() * 60 + now.getMinutes();
  const start = parseInt(sh) * 60 + parseInt(sm);
  const end = parseInt(eh) * 60 + parseInt(em);
  return { isOpen: cur >= start && cur < end, isHoliday: false };
}

export function HeroSection({ config }: Props) {
  const [status, setStatus] = useState<{ isOpen: boolean; isHoliday: boolean } | null>(null);

  useEffect(() => {
    if (config.businessHours?.length) {
      setStatus(getHeroStatus(config.businessHours));
    }
  }, [config.businessHours]);

  const statusText = status === null
    ? '확인 중…'
    : status.isOpen
    ? '현재 영업 중'
    : status.isHoliday
    ? '오늘 정기휴무'
    : '영업 종료';

  const statusClass = status?.isOpen ? 'open' : 'closed';

  return (
    <section className="hero" id="top">
      <div className="hero-bg-img" />
      <div className="hero-overlay" />
      <div className="hero-gradient" />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          {config.heroCategory || config.description || config.name}
        </div>

        <h1 className="hero-name">{config.name}</h1>

        {config.nameEn && (
          <p className="hero-name-en">{config.nameEn}</p>
        )}

        <div className="hero-divider">
          <span className="hero-divider-line" />
          <span className="hero-divider-bean">☕</span>
          <span className="hero-divider-line" />
        </div>

        {config.description && (
          <p className="hero-slogan">"{config.description}"</p>
        )}

        {config.businessHours?.length > 0 && (
          <div className={\`hero-status \${statusClass}\`}>
            <span className="hero-status-dot" />
            <span>{statusText}</span>
          </div>
        )}

        <div className="hero-actions">
          {config.menuItems.length > 0 && (
            <a href="#menu" className="btn btn-primary">메뉴 보기</a>
          )}
          {config.address && (
            <a href="#info" className="btn btn-outline">오시는 길</a>
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
  const match = timeStr.match(/(\\d{1,2}):(\\d{2})\\s*[-–]\\s*(\\d{1,2}):(\\d{2})/);
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
        <>
          <a
            href={\`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`}
            className="quick-action quick-action-tel"
          >
            <span className="quick-action-icon">📞</span>
            {config.phone}
          </a>
          <span className="quick-sep" />
        </>
      )}
      {address && (
        <>
          <span className="quick-action">
            <span className="quick-action-icon">📍</span>
            {address}
          </span>
          {statusText && <span className="quick-sep" />}
        </>
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
// src/components/about-section.tsx
// ──────────────────────────────────────────────
const aboutSection = `'use client';

import { useEffect, useRef } from 'react';
import type { SiteConfig } from '@/lib/config';

interface Props {
  config: SiteConfig;
}

export function AboutSection({ config }: Props) {
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
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stories = config.aboutStories ?? [
    '온기 로스터리는 2019년 연남동에서 시작한 스페셜티 커피 로스터리입니다. 직접 생두를 산지에서 선별·수입하고, 매일 아침 소량씩 로스팅해 그날 가장 신선한 커피를 제공합니다.',
    '에티오피아, 콜롬비아, 과테말라 등 다양한 산지의 원두를 직거래로 들여와 각 원두가 가진 고유한 풍미를 최대한 살린 로스팅 프로파일을 연구합니다.',
  ];

  const tags = config.aboutTags ?? ['#스페셜티', '#직접로스팅', '#연남동', '#산지직거래', '#싱글오리진'];

  const values = config.aboutValues ?? [
    { icon: '🌱', title: '산지 직거래', desc: '에티오피아·콜롬비아·과테말라 농장과 직접 계약, 공정한 거래를 지향합니다.' },
    { icon: '🔥', title: '매일 직접 로스팅', desc: '소량 배치 로스팅으로 항상 최고 신선도의 원두를 제공합니다.' },
    { icon: '☕', title: '커피 교육', desc: '주말 원두 테이스팅 클래스와 홈브루잉 워크숍을 정기 운영합니다.' },
  ];

  return (
    <section className="section about-section" id="about" ref={sectionRef}>
      <div className="section-inner">
        <p className="section-label reveal">우리 가게</p>
        <h2 className="section-title reveal">커피 한 잔에 담긴 철학</h2>

        <div className="about-grid">
          <div className="reveal">
            {stories.map((story, i) => (
              <p key={i} className="about-story">{story}</p>
            ))}
            <div className="about-tags">
              {tags.map((tag, i) => (
                <span key={i} className="about-tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="about-values reveal">
            {values.map((v, i) => (
              <div key={i} className="about-value-card">
                <span className="about-value-icon">{v.icon}</span>
                <div>
                  <p className="about-value-title">{v.title}</p>
                  <p className="about-value-desc">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/menu-section.tsx
// ──────────────────────────────────────────────
const menuSection = `'use client';

import { useEffect, useRef, useState } from 'react';
import type { MenuItem } from '@/lib/config';

interface Props {
  items: MenuItem[];
}

const TAB_EMOJIS: Record<string, string> = {
  '커피': '☕',
  '논커피': '🍵',
  '디저트': '🍰',
  '원두': '🫘',
};

export function MenuSection({ items }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const categories = [...new Set(items.map((item) => item.category))];
  const [activeTab, setActiveTab] = useState(categories[0] ?? '');

  const grouped = categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat] = items.filter((item) => item.category === cat);
    return acc;
  }, {});

  // reveal observer
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
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // 탭 전환 시 메뉴 아이템 stagger 애니메이션
  useEffect(() => {
    const panel = sectionRef.current?.querySelector<HTMLElement>('.menu-panel.active');
    if (!panel) return;
    const menuItems = panel.querySelectorAll<HTMLElement>('.menu-item');
    menuItems.forEach((item, i) => {
      item.classList.remove('visible');
      item.style.transitionDelay = \`\${i * 70}ms\`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          item.classList.add('visible');
        });
      });
    });
  }, [activeTab]);

  // 초기 메뉴 아이템 IntersectionObserver
  useEffect(() => {
    const menuObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const panel = entry.target.closest('.menu-panel');
            if (!panel) return;
            const panelItems = panel.querySelectorAll<HTMLElement>('.menu-item');
            panelItems.forEach((item, i) => {
              item.style.transitionDelay = \`\${i * 70}ms\`;
              setTimeout(() => item.classList.add('visible'), i * 70);
            });
            menuObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    sectionRef.current?.querySelectorAll<HTMLElement>('.menu-panel').forEach((panel) => {
      const first = panel.querySelector<HTMLElement>('.menu-item');
      if (first) menuObserver.observe(first);
    });
    return () => menuObserver.disconnect();
  }, []);

  return (
    <section className="section menu-section" id="menu" ref={sectionRef}>
      <div className="section-inner">
        <p className="section-label reveal">메뉴</p>
        <h2 className="section-title reveal">오늘의 메뉴</h2>
        <p className="section-desc reveal">매일 직접 로스팅한 원두로 추출합니다. 모든 음료는 핫/아이스 선택 가능합니다.</p>

        {/* 탭 버튼 */}
        <div className="menu-tabs reveal" role="tablist" aria-label="메뉴 카테고리">
          {categories.map((cat) => (
            <button
              key={cat}
              className={\`menu-tab-btn\${activeTab === cat ? ' active' : ''}\`}
              role="tab"
              aria-selected={activeTab === cat}
              onClick={() => setActiveTab(cat)}
            >
              {TAB_EMOJIS[cat] ?? '🍽️'} {cat}
            </button>
          ))}
        </div>

        {/* 탭 패널 */}
        {categories.map((cat) => (
          <div
            key={cat}
            id={\`panel-\${cat}\`}
            className={\`menu-panel\${activeTab === cat ? ' active' : ''}\`}
            role="tabpanel"
          >
            {(grouped[cat] ?? []).map((item, i) => (
              <div key={i} className="menu-item">
                {item.imageUrl ? (
                  <img
                    className="menu-item-thumb"
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="menu-item-thumb-placeholder">{item.emoji}</div>
                )}
                <div className="menu-item-name-row">
                  <span className="menu-item-name">{item.name}</span>
                  {item.nameEn && (
                    <span className="menu-item-name-en">{item.nameEn}</span>
                  )}
                  {item.isNew && <span className="badge badge-new">NEW</span>}
                  {item.isPopular && <span className="badge badge-popular">인기</span>}
                  {item.isSeason && <span className="badge badge-season">시즌</span>}
                </div>
                {item.desc && <div className="menu-item-desc">{item.desc}</div>}
                <span className="menu-item-price">{item.price}</span>
                {item.priceSub && (
                  <span className="menu-item-price-sub">{item.priceSub}</span>
                )}
              </div>
            ))}
          </div>
        ))}
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
  const match = timeStr.match(/(\\d{1,2}):(\\d{2})\\s*[-–]\\s*(\\d{1,2}):(\\d{2})/);
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

  const kakaoMapUrl = config.kakaoMapId
    ? \`https://place.map.kakao.com/\${config.kakaoMapId}\`
    : config.address
    ? \`https://map.kakao.com/link/search/\${encodeURIComponent(config.address)}\`
    : null;

  const naverMapUrl = config.address
    ? \`https://map.naver.com/v5/search/\${encodeURIComponent(config.address)}\`
    : null;

  const transportBadges = config.transportBadges ?? [];

  return (
    <section className="section info-section" id="info" ref={sectionRef}>
      <div className="section-inner">
        <p className="section-label reveal">영업 정보</p>
        <h2 className="section-title reveal">영업시간 &amp; 오시는 길</h2>

        <div className="info-grid reveal">
          {/* 영업시간 카드 */}
          {hasHours && (
            <div className="info-card">
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
                      <span className="hours-time">{hour.isHoliday ? '정기휴무' : hour.hours}</span>
                    </li>
                  );
                })}
              </ul>

              {config.hoursNote && (
                <p className="hours-note">{config.hoursNote}</p>
              )}

              {openStatus !== null && (
                <div className={\`open-badge \${openStatus.isOpen ? 'open' : 'closed'}\`}>
                  <span className="open-dot" />
                  {openStatus.isOpen
                    ? \`현재 영업 중 (\${openStatus.closeTime} 마감)\`
                    : openStatus.isHoliday
                    ? '오늘은 정기휴무입니다'
                    : '영업 종료'}
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
              <p className="address-text">
                {config.address}
                {config.addressDetail && <><br />{config.addressDetail}</>}
              </p>
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
                  <span className="map-icon-big">🗺️</span>
                  <span className="map-label">지도로 위치 확인</span>
                  <span className="map-sub">아래 버튼으로 길찾기</span>
                </div>
              )}

              <div className="map-buttons">
                {kakaoMapUrl && (
                  <a
                    href={kakaoMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-btn map-btn-kakao"
                  >
                    🗺️ 카카오맵
                  </a>
                )}
                {naverMapUrl && (
                  <a
                    href={naverMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-btn map-btn-naver"
                  >
                    📍 네이버지도
                  </a>
                )}
              </div>

              {transportBadges.length > 0 && (
                <div className="transport-badges">
                  {transportBadges.map((badge, i) => (
                    <span key={i} className="transport-badge">{badge}</span>
                  ))}
                </div>
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
  galleryLabels?: string[];
}

export function GallerySection({ images, galleryLabels }: Props) {
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

  const handleItemClick = (src: string) => {
    window.open(src, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="section gallery-section" id="gallery" ref={sectionRef}>
      <div className="section-inner">
        <p className="section-label reveal">갤러리</p>
        <h2 className="section-title reveal">매장 &amp; 메뉴 사진</h2>
        <p className="section-desc reveal">연남동 온기 로스터리의 공간과 음료를 소개합니다.</p>

        <div className="gallery-grid reveal">
          {images.map((src, i) => (
            <div
              key={i}
              className="gallery-item"
              onClick={() => handleItemClick(src)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handleItemClick(src); }}
              aria-label={\`갤러리 이미지 \${i + 1} 크게 보기\`}
            >
              <img src={src} alt={\`갤러리 이미지 \${i + 1}\`} loading="lazy" />
              <div className="gallery-item-overlay">
                {galleryLabels?.[i] && (
                  <span className="gallery-item-label">{galleryLabels[i]}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="gallery-caption reveal">이미지를 클릭하면 더 자세히 볼 수 있습니다</p>
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
        <p className="section-desc reveal">로스팅 일지, 신메뉴 소식, 이벤트를 팔로우하세요.</p>

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
              <span className="sns-desc">로스팅 일지 · 라떼아트 · 신메뉴</span>
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
              <span className="sns-name">네이버 플레이스</span>
              <span className="sns-handle">{getHandle(config.naverBlogUrl)}</span>
              <span className="sns-desc">리뷰 · 사진 · 예약</span>
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
              <span className="sns-handle">{getHandle(config.kakaoChannelUrl)}</span>
              <span className="sns-desc">이벤트 · 쿠폰 · 1:1 문의</span>
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
    <footer>
      <p className="footer-logo">{config.name}</p>
      {config.nameEn && (
        <p className="footer-logo-sub">{config.nameEn} · {config.footerTagline ?? 'Specialty Coffee'}</p>
      )}
      {(config.address || config.phone || config.businessNumber) && (
        <p className="footer-info">
          {config.address && <>{config.address}<br /></>}
          {config.phone && <>📞 {config.phone}</>}
          {config.phone && config.businessNumber && ' · '}
          {config.businessNumber && <>사업자등록번호 {config.businessNumber}</>}
          {(config.phone || config.businessNumber) && config.hoursNote && <><br />{config.hoursNote}</>}
        </p>
      )}
      <div className="footer-divider" />
      <p className="footer-powered">
        이 페이지는{' '}
        <a
          href="https://linkmap.biz/sites/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          Linkmap
        </a>
        으로 만들었습니다
      </p>
      <p className="footer-copy">&copy; {year} {config.name}. All rights reserved.</p>
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
  priceSub?: string;
  category: string;
  emoji: string;
  imageUrl?: string;
  isNew?: boolean;
  isPopular?: boolean;
  isSeason?: boolean;
}

export interface BusinessHour {
  day: string;
  dayEn?: string;
  hours: string;
  hoursEn?: string;
  isHoliday?: boolean;
}

export interface AboutValue {
  icon: string;
  title: string;
  desc: string;
}

const DEMO_MENU: MenuItem[] = [
  {
    name: '아메리카노',
    nameEn: 'Americano',
    desc: '에티오피아 예가체프 싱글 오리진, 화사한 과일 산미와 깔끔한 뒷맛',
    price: '₩5,000',
    category: '커피',
    emoji: '☕',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=120&h=120&q=80&auto=format&fit=crop',
  },
  {
    name: '카페라떼',
    nameEn: 'Cafe Latte',
    desc: '스팀 밀크와 에스프레소의 완벽한 균형, 부드러운 마이크로폼',
    price: '₩5,500',
    category: '커피',
    emoji: '☕',
    imageUrl: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=120&h=120&q=80&auto=format&fit=crop',
    isPopular: true,
  },
  {
    name: '바닐라라떼',
    nameEn: 'Vanilla Latte',
    desc: '마다가스카르 바닐라빈 직접 추출 시럽 사용, 자연스러운 달콤함',
    price: '₩6,000',
    category: '커피',
    emoji: '🍦',
  },
  {
    name: '콜드브루',
    nameEn: 'Cold Brew',
    desc: '12시간 저온 추출, 부드럽고 진한 커피 본연의 풍미',
    price: '₩5,500',
    category: '커피',
    emoji: '☕',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=120&h=120&q=80&auto=format&fit=crop',
  },
  {
    name: '플랫화이트',
    nameEn: 'Flat White',
    desc: '리스트레토 더블샷 + 마이크로폼, 농밀한 커피 풍미',
    price: '₩5,500',
    category: '커피',
    emoji: '☕',
  },
  {
    name: '아인슈페너',
    nameEn: 'Einspänner',
    desc: '진한 아메리카노 위에 무가당 생크림, 비엔나 스타일',
    price: '₩6,500',
    category: '커피',
    emoji: '☕',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=120&h=120&q=80&auto=format&fit=crop',
    isNew: true,
  },
  {
    name: '말차라떼',
    nameEn: 'Matcha Latte',
    desc: '교토 우지 말차 1등급, 부드러운 밀크폼과의 조화',
    price: '₩6,000',
    category: '논커피',
    emoji: '🍵',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=120&h=120&q=80&auto=format&fit=crop',
    isPopular: true,
  },
  {
    name: '얼그레이라떼',
    nameEn: 'Earl Grey Latte',
    desc: '베르가못 향 가득한 얼그레이 직접 우린 진한 밀크티',
    price: '₩5,500',
    category: '논커피',
    emoji: '🍵',
  },
  {
    name: '유자에이드',
    nameEn: 'Yuja Ade',
    desc: '국산 유자청으로 만든 상큼한 에이드, 탄산 선택 가능',
    price: '₩6,000',
    category: '논커피',
    emoji: '🍋',
  },
  {
    name: '자몽에이드',
    nameEn: 'Grapefruit Ade',
    desc: '생 자몽 착즙, 달콤하고 상큼한 자몽 에이드',
    price: '₩6,000',
    category: '논커피',
    emoji: '🍊',
  },
  {
    name: '딸기라떼',
    nameEn: 'Strawberry Latte',
    desc: '국내산 딸기 퓨레, 봄철 시즌 한정 메뉴',
    price: '₩6,500',
    category: '논커피',
    emoji: '🍓',
    isSeason: true,
  },
  {
    name: '초콜릿',
    nameEn: 'Hot Chocolate',
    desc: '발로나 55% 다크 초콜릿, 진하고 부드러운 핫초코',
    price: '₩5,500',
    category: '논커피',
    emoji: '🍫',
  },
  {
    name: '당근케이크',
    nameEn: 'Carrot Cake',
    desc: '크림치즈 프로스팅, 촉촉한 당근 케이크 1조각',
    price: '₩7,000',
    category: '디저트',
    emoji: '🍰',
    imageUrl: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=120&h=120&q=80&auto=format&fit=crop',
    isPopular: true,
  },
  {
    name: '크루아상',
    nameEn: 'Croissant',
    desc: '버터 48겹 수제 크루아상, 매일 아침 직접 제조',
    price: '₩4,500',
    category: '디저트',
    emoji: '🥐',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&h=120&q=80&auto=format&fit=crop',
  },
  {
    name: '티라미수',
    nameEn: 'Tiramisu',
    desc: '마스카포네 크림, 이탈리아 정통 레시피 티라미수',
    price: '₩7,500',
    category: '디저트',
    emoji: '🍮',
  },
  {
    name: '바스크치즈케이크',
    nameEn: 'Basque Cheesecake',
    desc: '진한 크림치즈와 바삭한 겉면, 산 세바스티안 스타일',
    price: '₩7,000',
    category: '디저트',
    emoji: '🍰',
    imageUrl: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=120&h=120&q=80&auto=format&fit=crop',
  },
  {
    name: '스콘세트',
    nameEn: 'Scone Set',
    desc: '플레인·블루베리 스콘 2종 + 클로티드 크림',
    price: '₩5,500',
    category: '디저트',
    emoji: '🫐',
  },
  {
    name: '마들렌',
    nameEn: 'Madeleine',
    desc: '레몬 제스트 수제 마들렌, 촉촉하고 달콤한 한 입',
    price: '₩3,500',
    category: '디저트',
    emoji: '🍪',
  },
  {
    name: '에티오피아 예가체프',
    nameEn: 'Ethiopia Yirgacheffe',
    desc: '플로럴·베리·라임 노트, 워시드 프로세싱, 밝은 산미',
    price: '₩18,000',
    priceSub: '200g',
    category: '원두',
    emoji: '🫘',
    imageUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=120&h=120&q=80&auto=format&fit=crop',
  },
  {
    name: '콜롬비아 수프레모',
    nameEn: 'Colombia Supremo',
    desc: '초콜릿·캐러멜·견과류 노트, 균형 잡힌 바디감',
    price: '₩16,000',
    priceSub: '200g',
    category: '원두',
    emoji: '🫘',
  },
  {
    name: '과테말라 안티구아',
    nameEn: 'Guatemala Antigua',
    desc: '스모키·다크초콜릿·스파이시 노트, 풍부한 바디감',
    price: '₩17,000',
    priceSub: '200g',
    category: '원두',
    emoji: '🫘',
  },
  {
    name: '브라질 산토스',
    nameEn: 'Brazil Santos',
    desc: '넛티·카카오·달콤한 여운, 입문용 스페셜티 추천',
    price: '₩15,000',
    priceSub: '200g',
    category: '원두',
    emoji: '🫘',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=120&h=120&q=80&auto=format&fit=crop',
  },
];

const DEMO_HOURS: BusinessHour[] = [
  { day: '월요일', dayEn: 'Monday', hours: '정기휴무', isHoliday: true },
  { day: '화요일', dayEn: 'Tuesday', hours: '09:00 – 22:00', hoursEn: '09:00 – 22:00' },
  { day: '수요일', dayEn: 'Wednesday', hours: '09:00 – 22:00', hoursEn: '09:00 – 22:00' },
  { day: '목요일', dayEn: 'Thursday', hours: '09:00 – 22:00', hoursEn: '09:00 – 22:00' },
  { day: '금요일', dayEn: 'Friday', hours: '09:00 – 22:00', hoursEn: '09:00 – 22:00' },
  { day: '토요일', dayEn: 'Saturday', hours: '09:00 – 22:00', hoursEn: '09:00 – 22:00' },
  { day: '일요일', dayEn: 'Sunday', hours: '09:00 – 22:00', hoursEn: '09:00 – 22:00' },
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
  heroCategory:
    process.env.NEXT_PUBLIC_HERO_CATEGORY ||
    '연남동 스페셜티 커피 로스터리',
  phone: process.env.NEXT_PUBLIC_PHONE || '02-338-1204',
  address: process.env.NEXT_PUBLIC_ADDRESS || '서울 마포구 연남로 23길 8',
  addressDetail: process.env.NEXT_PUBLIC_ADDRESS_DETAIL || '(연남동)',
  addressEn: process.env.NEXT_PUBLIC_ADDRESS_EN || '8, Yeonnam-ro 23-gil, Mapo-gu, Seoul',
  kakaoMapId: process.env.NEXT_PUBLIC_KAKAO_MAP_ID || '',
  hoursNote: process.env.NEXT_PUBLIC_HOURS_NOTE || '라스트오더 21:30 · 월요일 정기휴무',
  businessNumber: process.env.NEXT_PUBLIC_BUSINESS_NUMBER || '123-45-67890',
  footerTagline: process.env.NEXT_PUBLIC_FOOTER_TAGLINE || 'Specialty Coffee',
  menuItems: parseJSON<MenuItem[]>(process.env.NEXT_PUBLIC_MENU_ITEMS, DEMO_MENU),
  businessHours: parseJSON<BusinessHour[]>(process.env.NEXT_PUBLIC_BUSINESS_HOURS, DEMO_HOURS),
  galleryImages: parseJSON<string[]>(process.env.NEXT_PUBLIC_GALLERY_IMAGES, [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&h=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&h=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=600&h=600&q=80&auto=format&fit=crop',
  ]),
  galleryLabels: parseJSON<string[]>(process.env.NEXT_PUBLIC_GALLERY_LABELS, [
    '카페 인테리어',
    '라떼아트',
    '직접 로스팅',
    '시그니처 디저트',
  ]),
  aboutStories: parseJSON<string[]>(process.env.NEXT_PUBLIC_ABOUT_STORIES, [
    '온기 로스터리는 2019년 연남동에서 시작한 스페셜티 커피 로스터리입니다. 직접 생두를 산지에서 선별·수입하고, 매일 아침 소량씩 로스팅해 그날 가장 신선한 커피를 제공합니다.',
    '에티오피아, 콜롬비아, 과테말라 등 다양한 산지의 원두를 직거래로 들여와 각 원두가 가진 고유한 풍미를 최대한 살린 로스팅 프로파일을 연구합니다. 커피는 단순한 음료가 아니라, 농부의 땀과 로스터의 열정이 만나는 예술이라 믿습니다.',
  ]),
  aboutTags: parseJSON<string[]>(process.env.NEXT_PUBLIC_ABOUT_TAGS, [
    '#스페셜티', '#직접로스팅', '#연남동', '#산지직거래', '#싱글오리진',
  ]),
  aboutValues: parseJSON<AboutValue[]>(process.env.NEXT_PUBLIC_ABOUT_VALUES, [
    { icon: '🌱', title: '산지 직거래', desc: '에티오피아·콜롬비아·과테말라 농장과 직접 계약, 공정한 거래를 지향합니다.' },
    { icon: '🔥', title: '매일 직접 로스팅', desc: '소량 배치 로스팅으로 항상 최고 신선도의 원두를 제공합니다.' },
    { icon: '☕', title: '커피 교육', desc: '주말 원두 테이스팅 클래스와 홈브루잉 워크숍을 정기 운영합니다.' },
  ]),
  transportBadges: parseJSON<string[]>(process.env.NEXT_PUBLIC_TRANSPORT_BADGES, [
    '🚇 홍대입구역 3번 출구 도보 12분',
    '🚌 연남동 정류장 도보 3분',
    '🚲 따릉이 연남동 대여소 인근',
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
    'nav.about': '소개',
    'nav.hours': '영업정보',
    'nav.location': '오시는 길',
    'hero.call': '전화하기',
    'quick.call': '전화',
    'quick.directions': '길찾기',
    'quick.hours': '영업시간',
    'menu.title': '메뉴',
    'menu.popular': '인기',
    'hours.title': '영업시간',
    'hours.today': '오늘',
    'location.title': '오시는 길',
    'gallery.title': '갤러리',
    'sns.title': 'SNS',
    'sns.naver': '네이버 플레이스',
    'sns.kakao': '카카오톡 채널',
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
    'lang.switchLabel': 'Switch to English',
    'lang.toggle': 'EN',
  },
  en: {
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.about': 'About',
    'nav.hours': 'Hours',
    'nav.location': 'Location',
    'hero.call': 'Call Now',
    'quick.call': 'Call',
    'quick.directions': 'Directions',
    'quick.hours': 'Hours',
    'menu.title': 'Menu',
    'menu.popular': 'Popular',
    'hours.title': 'Business Hours',
    'hours.today': 'Today',
    'location.title': 'Location',
    'gallery.title': 'Gallery',
    'sns.title': 'Follow Us',
    'sns.naver': 'Naver Place',
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
    { path: 'src/components/about-section.tsx', content: aboutSection },
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
