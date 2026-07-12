import type { HomepageTemplateContent } from './homepage-template-content';
import {
  sharedGitignore as gitignore,
  sharedDeployYml as deployYml,
  sharedTsconfigJson as tsconfigJson,
  sharedPostcssConfig as postcssConfig,
  sharedNextConfig as nextConfig,
  makePackageJson,
  makePackageLock,
} from './shared-template-files';

const packageJson = makePackageJson('invitation');
const packageLock = makePackageLock('invitation');

// ──────────────────────────────────────────────
// src/app/layout.tsx
// ──────────────────────────────────────────────
const layoutTsx = `import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import './globals.css';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.subtitle,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.subtitle,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: siteConfig.title,
    description: siteConfig.subtitle,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* 폰트 2종 고정: Pretendard Variable(본문/UI/숫자) + Nanum Myeongjo(디스플레이 세리프) */}
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
        <meta name="theme-color" content={siteConfig.gradientFrom} />
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

/* ══ Design Tokens ════════════════════════════
   기본값은 elegant-gold 프리셋과 동일 — generator(INVITATION_PRESET_THEME) /
   preview(PRESET_VARS)와 3중 동기화되어야 함 */
:root {
  /* Brand */
  --inv-bg: #FBF7F0;
  --inv-bg-alt: #F5EEDF;
  --inv-text-primary: #211A12;
  --inv-text-secondary: #6B5A3E;
  /* accent: 테두리·아이콘·대형 비텍스트 전용 */
  --inv-accent: #B8860B;
  /* accentSolid: 흰 글자 버튼/배지용 고대비 (AA 4.5:1) */
  --inv-accent-solid: #8B6B1F;
  --inv-accent-glow: rgba(184, 134, 11, 0.15);
  --inv-accent-soft: rgba(184, 134, 11, 0.07);
  --inv-card-bg: #FFFFFF;
  --inv-card-border: #E8DCC8;
  --inv-gradient-from: #B8860B;
  --inv-gradient-to: #8B6B1F;

  /* 폰트 2종 이내: 본문/UI/숫자 = Pretendard Variable, 디스플레이 = 선택에 따라 Nanum Myeongjo */
  --inv-font-body: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif;
  --inv-font-display: 'Nanum Myeongjo', 'Pretendard Variable', serif;

  /* Shadows */
  --inv-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
  --inv-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
  --inv-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
  --inv-shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);

  /* Typography scale (375px 기준) */
  --inv-text-eyebrow: 11px;
  --inv-text-hero: clamp(26px, 7vw, 34px);
  --inv-text-section: 20px;
  --inv-text-body: 15px;
  --inv-text-small: 13px;

  /* Radius */
  --inv-radius-sm: 8px;
  --inv-radius-md: 12px;
  --inv-radius-lg: 16px;
  --inv-radius-xl: 24px;

  /* Spacing */
  --inv-section-py: clamp(2.75rem, 7vw, 4rem);
  --inv-section-px: clamp(1.25rem, 5vw, 2rem);

  /* Transition */
  --inv-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --inv-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

/* ══ Global Reset & Base ═════════════════════ */
* { -webkit-tap-highlight-color: transparent; }
html { scroll-behavior: smooth; }
body {
  background: var(--inv-bg);
  color: var(--inv-text-primary);
  font-family: var(--inv-font-body);
  font-size: var(--inv-text-body);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100svh;
}
h1, h2 { font-family: var(--inv-font-display); }

/* ══ Reveal Animations (AnimatedReveal) ══════
   기본 상태는 항상 보임(opacity:1) — JS가 정상 마운트된 뒤에만 reveal-pending으로 전환되어
   숨었다가 스크롤 진입 시 나타난다. 카톡 인앱 웹뷰 등에서 JS가 실패해도 콘텐츠는 항상 노출됨. */
.reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-scale {
  opacity: 1;
  transform: none;
}
.reveal-fade.reveal-pending { opacity: 0; transform: translateY(8px); }
.reveal-slide-left.reveal-pending { opacity: 0; transform: translateX(-16px); }
.reveal-slide-right.reveal-pending { opacity: 0; transform: translateX(16px); }
.reveal-scale.reveal-pending { opacity: 0; transform: scale(0.96); }
.reveal-fade.reveal-pending, .reveal-slide-left.reveal-pending, .reveal-slide-right.reveal-pending, .reveal-scale.reveal-pending,
.reveal-fade.revealed, .reveal-slide-left.revealed, .reveal-slide-right.revealed, .reveal-scale.revealed {
  transition: opacity 0.6s var(--inv-ease-out), transform 0.6s var(--inv-ease-out);
}
.reveal-fade.revealed, .reveal-slide-left.revealed, .reveal-slide-right.revealed, .reveal-scale.revealed {
  opacity: 1; transform: none;
}

/* ══ Keyframe Animations ═════════════════════ */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes float-slow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(10px, -10px) scale(1.02); }
  66% { transform: translate(-5px, 5px) scale(0.98); }
}
@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 var(--inv-accent-glow); }
  70% { box-shadow: 0 0 0 16px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@keyframes celebrate-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(16px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes toast-out {
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to { opacity: 0; transform: translateX(-50%) translateY(16px); }
}
@keyframes scroll-cue-bob {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 6px); }
}

/* ══ Stagger — 최대 2단계(즉시/딜레이) ═══════ */
.animate-fade-up { animation: fade-up 0.6s var(--inv-ease-out) both; }
.animate-fade-up-d1 { animation: fade-up 0.6s var(--inv-ease-out) 0.15s both; }
.animate-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }

/* ══ Tabular Nums (D-day / 계좌번호) ═════════ */
.tabular-nums { font-variant-numeric: tabular-nums; }

/* ══ Decorative Section Backgrounds ══════════ */
.inv-section-decorated {
  position: relative;
  overflow: hidden;
  padding: var(--inv-section-py) var(--inv-section-px);
  text-align: center;
}
.inv-section-decorated::before {
  content: '';
  position: absolute;
  width: 240px; height: 240px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--inv-accent-soft) 0%, transparent 70%);
  pointer-events: none;
  animation: float-slow 14s ease-in-out infinite;
}
.inv-section-decorated:nth-of-type(odd)::before { top: -70px; right: -90px; }
.inv-section-decorated:nth-of-type(even)::before { bottom: -70px; left: -90px; animation-delay: -4s; }

/* ══ Eyebrow Label ═══════════════════════════ */
.inv-eyebrow {
  display: block;
  font-size: var(--inv-text-eyebrow);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 600;
  font-family: var(--inv-font-body);
  color: var(--inv-accent-solid);
  margin-bottom: 0.5rem;
}
.inv-eyebrow--onphoto { color: rgba(255,255,255,0.85); }

/* ══ Section Title with Ornament ═════════════ */
.inv-section-title {
  position: relative;
  display: inline-block;
  font-size: var(--inv-text-section);
  font-weight: 600;
  font-family: var(--inv-font-display);
  color: var(--inv-text-primary);
  letter-spacing: -0.01em;
  padding-bottom: 0.75rem;
}
.inv-section-title::after {
  content: '';
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 2rem; height: 2px;
  background: linear-gradient(90deg, var(--inv-gradient-from), var(--inv-gradient-to));
  border-radius: 1px;
}

/* ══ Headline Divider (헤어라인 + 중앙 마크) ═ */
.inv-headline-divider {
  display: flex; align-items: center; gap: 0.75rem;
  max-width: 200px; margin: 1.5rem auto; color: var(--inv-card-border);
}
.inv-headline-divider::before, .inv-headline-divider::after {
  content: ''; flex: 1; height: 1px; background: currentColor; opacity: 0.6;
}
.inv-headline-divider--onphoto { color: rgba(255,255,255,0.4); }
.inv-headline-divider-mark { font-size: 0.7rem; color: var(--inv-accent); opacity: 0.7; }

/* ══ Monogram (히어로 56~64px / 푸터 28~32px 북엔드) ═ */
.inv-monogram {
  width: 60px; height: 60px;
  border-radius: 50%;
  border: 1px solid var(--inv-accent);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--inv-font-display);
  font-size: 1.35rem;
  color: var(--inv-text-primary);
  margin: 0 auto 1.25rem;
}
.inv-monogram--onphoto { border-color: rgba(255,255,255,0.55); color: #fff; }
.inv-monogram-sm { width: 30px; height: 30px; font-size: 0.8rem; color: var(--inv-text-secondary); border-color: var(--inv-card-border); margin: 0 auto 0.75rem; }

/* ══ Card System ═════════════════════════════
   글래스모피즘은 minimal-glass 프리셋에서 .inv-hero-emoji-ring / .inv-dday-card
   2곳에만 preset CSS로 주입됨 — 일반 카드는 항상 솔리드 */
.inv-card {
  position: relative;
  background: var(--inv-card-bg);
  background-image: radial-gradient(ellipse at top right, var(--inv-accent-soft) 0%, transparent 50%);
  border: 1px solid var(--inv-card-border);
  border-radius: var(--inv-radius-lg);
  box-shadow: var(--inv-shadow-card);
  transition: transform var(--inv-transition), box-shadow var(--inv-transition), border-color var(--inv-transition);
  overflow: hidden;
}
.inv-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--inv-gradient-from), var(--inv-gradient-to));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s var(--inv-ease-out);
}
.inv-card:hover { transform: translateY(-4px); box-shadow: var(--inv-shadow-lg); }
.inv-card:hover::before { transform: scaleX(1); }

.inv-card-accent {
  position: relative;
  background: var(--inv-card-bg);
  background-image: linear-gradient(135deg, var(--inv-accent-soft) 0%, transparent 40%);
  border: 1px solid var(--inv-card-border);
  border-left: 3px solid var(--inv-accent);
  border-radius: var(--inv-radius-lg);
  box-shadow: var(--inv-shadow-card);
  transition: transform var(--inv-transition), box-shadow var(--inv-transition);
}
.inv-card-accent:hover { transform: translateY(-2px); box-shadow: var(--inv-shadow-md); }

/* ══ Button System (터치 타깃 44px+) ═════════ */
.inv-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 999px;
  min-height: 44px;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  transition: all var(--inv-transition);
  cursor: pointer;
  text-decoration: none;
  border: none;
}
.inv-btn:active { transform: scale(0.96); }
.inv-btn-sm { min-height: 44px; padding: 0.5rem 1rem; font-size: 0.8125rem; }

/* accentSolid = 흰 글자 버튼 고대비 (RSVP CTA, 전화 버튼 등) */
.inv-btn-primary {
  background: var(--inv-accent-solid);
  color: #fff;
  box-shadow: 0 2px 8px color-mix(in oklch, var(--inv-accent-solid) 30%, transparent);
}
.inv-btn-primary:hover { filter: brightness(1.08); }
.inv-btn-secondary { background: var(--inv-accent-glow); color: var(--inv-accent-solid); }
.inv-btn-secondary:hover { filter: brightness(0.98); }

/* Brand buttons */
.inv-btn-kakao { background: #FEE500; color: #191919; box-shadow: 0 2px 8px rgba(254, 229, 0, 0.25); }
.inv-btn-kakao:hover { filter: brightness(0.96); }
.inv-btn-naver { background: #03C75A; color: #fff; box-shadow: 0 2px 8px rgba(3, 199, 90, 0.25); }
.inv-btn-naver:hover { filter: brightness(0.96); }

/* 48px 원형 아이콘 버튼 (share) */
.inv-btn-icon {
  width: 48px; height: 48px;
  border-radius: 50%;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem;
  transition: transform var(--inv-transition);
}
.inv-btn-icon:active { transform: scale(0.94); }
.inv-btn-icon-kakao { background: #FEE500; color: #191919; }
.inv-btn-icon-secondary { background: var(--inv-accent-glow); color: var(--inv-accent-solid); }

/* 소형 원형 아이콘(주소 복사 등) — 44px 미만은 보조 액션 한정 */
.inv-btn-icon-sm {
  width: 36px; height: 36px; flex-shrink: 0;
  border-radius: 50%; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  background: var(--inv-accent-glow); color: var(--inv-accent-solid);
  font-size: 0.875rem;
}

/* ══ Toast Notification ══════════════════════ */
.inv-toast {
  position: fixed; bottom: 2rem; left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  background: rgba(26, 26, 26, 0.88);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: toast-in 0.25s var(--inv-ease-out) both;
}
.inv-toast[data-closing='true'] { animation: toast-out 0.25s ease both; }

/* ══ Hero ═════════════════════════════════════ */
.inv-hero {
  position: relative;
  min-height: 88vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center;
  padding: 5rem 1.5rem;
  overflow: hidden;
}
.inv-hero--framed { min-height: auto; background: var(--inv-bg); padding: 4rem 1.5rem 3rem; }
.inv-hero-noise {
  position: absolute; inset: 0; opacity: 0.05; mix-blend-mode: overlay; pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
.inv-hero-vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.28) 100%); pointer-events: none; }
.inv-hero-content { position: relative; z-index: 1; max-width: 24rem; margin: 0 auto; }
.inv-hero-emoji-ring {
  width: 60px; height: 60px; margin: 0 auto 1.25rem;
  border-radius: 50%;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.24);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--inv-font-display);
  font-size: 1.35rem;
  color: #fff;
}
.inv-hero-title {
  font-family: var(--inv-font-display);
  font-size: var(--inv-text-hero);
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.01em;
  white-space: pre-line;
  margin: 0;
}
.inv-hero-title--onphoto { color: #fff; text-shadow: 0 2px 16px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.08); }
.inv-hero-title--onbg { color: var(--inv-text-primary); }
.inv-hero-subtitle { margin: 1rem 0 0; font-size: 1rem; line-height: 1.6; }
.inv-hero-subtitle--onphoto { color: rgba(255,255,255,0.82); }
.inv-hero-subtitle--onbg { color: var(--inv-text-secondary); }
.inv-hero-date { margin-top: 0.75rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; }
.inv-hero-date--onphoto { color: rgba(255,255,255,0.75); }
.inv-hero-date--onbg { color: var(--inv-text-secondary); }
.inv-hero-arch {
  width: min(66vw, 260px);
  aspect-ratio: 3 / 4;
  margin: 0 auto 1.5rem;
  overflow: hidden;
  border-top-left-radius: 100% clamp(48px, 16vw, 72px);
  border-top-right-radius: 100% clamp(48px, 16vw, 72px);
  box-shadow: var(--inv-shadow-lg);
}
.inv-hero-arch img { width: 100%; height: 100%; object-fit: cover; }
.inv-hero-scroll-cue {
  position: absolute; bottom: 1.5rem; left: 50%;
  animation: scroll-cue-bob 2.4s ease-in-out infinite;
  opacity: 0.7;
}

/* Floating ambient orbs (배경 위치 애니메이션이 아닌 순수 transform 루프 — 패럴랙스 아님) */
.inv-hero-orb { position: absolute; border-radius: 50%; pointer-events: none; animation: float-slow 12s ease-in-out infinite; }

/* ══ D-day / Mini Calendar ═══════════════════ */
.inv-cal { max-width: 220px; margin: 0 auto 1.5rem; }
.inv-cal-head { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.06em; color: var(--inv-text-secondary); margin: 0 0 0.5rem; }
.inv-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.inv-cal-dow { font-size: 0.625rem; color: var(--inv-text-secondary); opacity: 0.6; padding: 2px 0; }
.inv-cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 0.6875rem; color: var(--inv-text-secondary); border-radius: 50%; font-variant-numeric: tabular-nums; }
.inv-cal-cell--active { background: var(--inv-accent-solid); color: #fff; font-weight: 700; }

.inv-countdown { display: flex; justify-content: center; align-items: flex-end; gap: 0.5rem; margin-bottom: 1rem; }
.inv-dday-card { width: 56px; height: 70px; display: flex; align-items: center; justify-content: center; }
.inv-counter-label { font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; color: var(--inv-text-secondary); }
.inv-colon-sep { font-size: 1.125rem; font-weight: 300; color: var(--inv-text-secondary); padding-bottom: 1.25rem; }
.inv-date-label { font-size: 0.9375rem; font-weight: 500; color: var(--inv-text-primary); }

/* ══ Hosts ════════════════════════════════════ */
.inv-hosts { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1.25rem; max-width: 28rem; margin: 0 auto; }
.inv-host { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 1.5rem 1rem; }
.inv-host-avatar { width: 4.5rem; height: 4.5rem; border-radius: 50%; object-fit: cover; margin-bottom: 0.75rem; }
.inv-host-avatar--initial { display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
.inv-host-role { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--inv-text-secondary); margin: 0; }
.inv-host-name { font-family: var(--inv-font-display); font-weight: 600; font-size: 1.0625rem; color: var(--inv-text-primary); margin: 0.25rem 0 0.75rem; }

/* ══ Location ═════════════════════════════════ */
.inv-venue-name { font-size: 1.0625rem; font-weight: 600; margin: 0; color: var(--inv-text-primary); }
.inv-venue-addr-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-top: 0.25rem; }
.inv-venue-addr { font-size: 0.875rem; margin: 0; color: var(--inv-text-secondary); }
.inv-map-buttons { display: flex; gap: 0.75rem; margin-top: 1.25rem; }
.inv-map-buttons .inv-btn { flex: 1; }
.inv-info-line { font-size: 0.875rem; margin: 0.375rem 0; text-align: left; color: var(--inv-text-secondary); }

/* ══ Native Details/Summary (아코디언 · 접기) ═ */
.inv-details { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--inv-card-border); text-align: left; }
.inv-details summary {
  cursor: pointer; list-style: none;
  display: flex; align-items: center; justify-content: space-between; gap: 0.375rem;
  font-size: 0.875rem; color: var(--inv-text-secondary); font-weight: 500;
}
.inv-details summary::-webkit-details-marker { display: none; }
.inv-details summary::after { content: '+'; font-weight: 400; }
.inv-details[open] summary::after { content: '\\2212'; }
.inv-details-body { margin-top: 0.75rem; }

/* ══ Gallery (편집적 비대칭 레이아웃) ════════ */
.inv-gallery-bento { max-width: 28rem; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
.inv-gallery-item { overflow: hidden; border-radius: 0.75rem; aspect-ratio: 1; }
.inv-gallery-item--lg { grid-column: span 2; grid-row: span 2; }
.inv-gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.inv-gallery-item:hover img { transform: scale(1.05); }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.inv-dots { display: flex; justify-content: center; gap: 6px; padding-top: 0.75rem; }
.inv-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--inv-card-border); transition: all 0.3s ease; }
.inv-dot-active { width: 20px; border-radius: 3px; background: var(--inv-accent-solid); }

/* ══ Account ══════════════════════════════════ */
.inv-account-item summary { border: none; padding: 0; }
.inv-account-item { border: 1px solid var(--inv-card-border); border-radius: var(--inv-radius-lg); padding: 1.25rem; background: var(--inv-card-bg); }
.inv-account-badge { font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 999px; background: var(--inv-accent-glow); color: var(--inv-accent-solid); }
.inv-account-holder { font-size: 0.8125rem; color: var(--inv-text-secondary); }
.inv-account-row { display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem; }
.inv-account-num { color: var(--inv-text-primary); font-weight: 500; margin: 0; }
.inv-account-bank { font-size: 0.875rem; color: var(--inv-text-secondary); }
.inv-copy-check { display: inline-flex; align-items: center; gap: 0.25rem; color: var(--inv-accent-solid); animation: fade-up 0.3s var(--inv-ease-out) both; }

/* ══ Contact ══════════════════════════════════ */
.inv-contact-row { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; gap: 0.75rem; flex-wrap: wrap; }
.inv-contact-role { font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.625rem; border-radius: 999px; background: var(--inv-accent-glow); color: var(--inv-accent-solid); }
.inv-contact-name { font-weight: 600; color: var(--inv-text-primary); }

/* ══ Message / RSVP ═══════════════════════════ */
.inv-message-body { white-space: pre-line; font-size: 1rem; line-height: 1.9; color: var(--inv-text-primary); max-width: 26rem; margin: 0 auto; }
.inv-rsvp-desc { font-size: 0.9375rem; color: var(--inv-text-secondary); line-height: 1.7; margin-bottom: 1.25rem; white-space: pre-line; }

/* ══ Footer ═══════════════════════════════════ */
.inv-footer {
  position: relative;
  padding: 2.5rem 1.5rem;
  padding-bottom: calc(2.5rem + env(safe-area-inset-bottom));
  text-align: center;
  font-size: 0.75rem;
  background: linear-gradient(180deg, var(--inv-bg-alt) 0%, var(--inv-bg) 100%);
  color: var(--inv-text-secondary);
}
.inv-footer a { opacity: 0.6; text-decoration: none; color: inherit; }
.inv-closing {
  font-family: var(--inv-font-display);
  font-style: italic;
  white-space: pre-line;
  font-size: 0.9375rem;
  line-height: 1.8;
  color: var(--inv-text-secondary);
  max-width: 22rem;
  margin: 0 auto 1.25rem;
}

/* ══ Mobile Optimization ═════════════════════ */
@media (max-width: 640px) {
  .inv-hero-title { font-size: 1.5rem; }
  .inv-section-title { font-size: 1.125rem; }
}

/* ══ Accessibility: Reduced Motion ═══════════ */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .reveal-pending { opacity: 1 !important; transform: none !important; }
  .inv-card:hover, .inv-card-accent:hover { transform: none; }
  .inv-btn:active, .inv-btn-icon:active { transform: none; }
}

/* ══ Focus Visible ═══════════════════════════ */
*:focus-visible {
  outline: 2px solid var(--inv-accent-solid);
  outline-offset: 2px;
}
`;

// ──────────────────────────────────────────────
// src/components/animated-reveal.tsx
// (invitation 전용 로컬 버전 — shared-template-files의 공용 컴포넌트와 별개로
//  "기본 항상 노출 → JS 마운트 후에만 펜딩" 동작을 위해 이 템플릿에서만 오버라이드)
// ──────────────────────────────────────────────
const animatedReveal = `'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealVariant = 'fade' | 'slide-left' | 'slide-right' | 'scale';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}

/**
 * 스크롤 진입 시 살짝 떠오르며 나타나는 리빌 컴포넌트.
 * 기본 상태는 항상 visible(opacity:1) — JS가 정상 마운트되고 reduced-motion이 아닐 때만
 * "reveal-pending"(숨김) 상태로 전환한다. 카카오톡 인앱 웹뷰 등에서 JS 하이드레이션이
 * 실패하거나 지연되더라도 초대장 내용이 영구히 가려지는 사고를 방지하기 위한 안전장치.
 */
export function AnimatedReveal({ children, className = '', delay = 0, variant = 'fade' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setVisible(true); return; }

    setReady(true);
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

  const stateClass = ready ? (visible ? 'revealed' : 'reveal-pending') : '';

  return (
    <div ref={ref} className={\`\${variantClass} \${stateClass} \${className}\`}>
      {children}
    </div>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/hero-section.tsx
// ──────────────────────────────────────────────
const heroSection = `interface Props {
  config: {
    title: string; titleEn?: string; subtitle: string; subtitleEn?: string;
    heroImageUrl: string; gradientFrom: string; gradientTo: string; eventType: string;
    eventDateLabel?: string;
    hosts?: { name: string }[];
  };
}

const EVENT_EMOJI: Record<string, string> = {
  gathering: '\\u{1F389}',
  birthday: '\\u{1F382}',
  wedding: '\\u{1F48D}',
  baby: '\\u{1F476}',
  celebration: '\\u{1F389}',
  corporate: '\\u{1F3E2}',
  custom: '\\u{2728}',
};

const EVENT_EYEBROW: Record<string, string> = {
  gathering: 'GATHERING',
  birthday: 'BIRTHDAY',
  wedding: 'WEDDING',
  baby: 'FIRST BIRTHDAY',
  celebration: 'CELEBRATION',
  corporate: 'COMPANY EVENT',
  custom: 'INVITATION',
};

// 신규 필드 없이 기존 필드(호스트 이름 → 타이틀)에서 모노그램 이니셜을 파생
function getInitials(hosts: { name?: string }[] | undefined, title: string): string {
  const names = (hosts || []).map((h) => (h.name || '').trim()).filter(Boolean).slice(0, 2);
  if (names.length > 0) return names.map((n) => n.charAt(0)).join(' & ');
  return (title || '').trim().charAt(0) || '\\u2726';
}

export function HeroSection({ config }: Props) {
  const emoji = EVENT_EMOJI[config.eventType] || EVENT_EMOJI.custom;
  const eyebrow = EVENT_EYEBROW[config.eventType] || EVENT_EYEBROW.custom;
  const initials = getInitials(config.hosts, config.title);
  const framed = Boolean(config.heroImageUrl);

  return (
    <section
      className={\`inv-hero \${framed ? 'inv-hero--framed' : ''}\`}
      style={framed ? undefined : { background: \`radial-gradient(ellipse at 50% 20%, \${config.gradientTo} 0%, \${config.gradientFrom} 60%)\` }}
    >
      {!framed && (
        <>
          <div className="inv-hero-noise" aria-hidden="true" />
          <div className="inv-hero-vignette" aria-hidden="true" />
          <div className="inv-hero-orb" aria-hidden="true" style={{ top: '14%', left: '8%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }} />
          <div className="inv-hero-orb" aria-hidden="true" style={{ bottom: '18%', right: '6%', width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)', animationDelay: '-6s' }} />
        </>
      )}

      <div className="inv-hero-content animate-fade-up">
        <p className={\`inv-eyebrow \${framed ? '' : 'inv-eyebrow--onphoto'}\`}>
          <span aria-hidden="true">{emoji}</span> {eyebrow}
        </p>

        {framed ? (
          <div className="inv-hero-arch animate-fade-up-d1">
            <img src={config.heroImageUrl} alt="" loading="eager" />
          </div>
        ) : (
          <div className="inv-hero-emoji-ring animate-fade-up-d1" aria-hidden="true">{initials}</div>
        )}

        <h1 className={\`inv-hero-title animate-fade-up-d1 \${framed ? 'inv-hero-title--onbg' : 'inv-hero-title--onphoto'}\`}>
          {config.title}
        </h1>

        {config.subtitle && (
          <p className={\`inv-hero-subtitle animate-fade-up-d1 \${framed ? 'inv-hero-subtitle--onbg' : 'inv-hero-subtitle--onphoto'}\`}>
            {config.subtitle}
          </p>
        )}

        {config.eventDateLabel && (
          <p className={\`inv-hero-date animate-fade-up-d1 \${framed ? 'inv-hero-date--onbg' : 'inv-hero-date--onphoto'}\`}>
            {config.eventDateLabel}
          </p>
        )}

        <div className={\`inv-headline-divider animate-fade-up-d1 \${framed ? '' : 'inv-headline-divider--onphoto'}\`}>
          <span className="inv-headline-divider-mark" aria-hidden="true">&#10022;</span>
        </div>
      </div>

      {!framed && (
        <div className="inv-hero-scroll-cue" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      )}
    </section>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/countdown-section.tsx
// ──────────────────────────────────────────────
const countdownSection = `'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { AnimatedReveal } from './animated-reveal';

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

interface MonthGrid {
  year: number;
  month: number;
  eventDay: number;
  cells: (number | null)[];
}

function buildMonthGrid(dateStr: string): MonthGrid | null {
  const d = new Date(\`\${dateStr}T00:00:00\`);
  if (Number.isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = d.getMonth();
  const eventDay = d.getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  return { year, month, eventDay, cells };
}

const DOW = ['\\uC77C', '\\uC6D4', '\\uD654', '\\uC218', '\\uBAA9', '\\uAE08', '\\uD1A0'];

function MiniCalendar({ dateStr }: { dateStr: string }) {
  const grid = useMemo(() => buildMonthGrid(dateStr), [dateStr]);
  if (!grid) return null;
  return (
    <div className="inv-cal">
      <p className="inv-cal-head">{grid.year}.{String(grid.month + 1).padStart(2, '0')}</p>
      <div className="inv-cal-grid">
        {DOW.map((d) => (<div key={d} className="inv-cal-dow">{d}</div>))}
        {grid.cells.map((day, i) => (
          <div key={i} className={\`inv-cal-cell \${day === grid.eventDay ? 'inv-cal-cell--active' : ''}\`}>
            {day ?? ''}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlipCard({ value, label }: { value: number; label: string }) {
  const [display, setDisplay] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value !== prevRef.current) {
      setFlipping(true);
      const timer = setTimeout(() => {
        setDisplay(value);
        setFlipping(false);
        prevRef.current = value;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative overflow-hidden inv-card inv-dday-card" style={{ perspective: '600px' }}>
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: flipping ? 'rotateX(-15deg)' : 'rotateX(0deg)',
          }}
        >
          <span className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--inv-accent-solid)' }}>
            {String(display).padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="inv-counter-label">{label}</span>
    </div>
  );
}

function SimpleCounter({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-2">
      <div className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--inv-accent-solid)', lineHeight: 1.2 }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="inv-counter-label" style={{ marginTop: '0.375rem' }}>{label}</div>
    </div>
  );
}

function ColonSep() {
  return <div className="inv-colon-sep">:</div>;
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
      <section className="inv-section-decorated" style={{ background: 'var(--inv-bg-alt)' }}>
        <p className="inv-eyebrow">COUNTDOWN</p>
        {config.eventDate && <MiniCalendar dateStr={config.eventDate} />}
        {config.showCountdown && timeLeft && !timeLeft.expired && (
          <div className="inv-countdown">
            <CounterCard value={timeLeft.days} label="DAYS" />
            <ColonSep />
            <CounterCard value={timeLeft.hours} label="HOURS" />
            <ColonSep />
            <CounterCard value={timeLeft.minutes} label="MIN" />
            <ColonSep />
            <CounterCard value={timeLeft.seconds} label="SEC" />
          </div>
        )}
        {timeLeft?.expired && (
          <div className="mb-6" style={{ animation: 'celebrate-bounce 2s ease-in-out infinite' }}>
            <div className="mx-auto inv-card" style={{ maxWidth: '280px', padding: '1.5rem', borderTop: '3px solid var(--inv-accent)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>{'\\u{1F389}'}</span>
              <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--inv-accent-solid)' }}>
                {'\\u{2728}'} {'\\uD589\\uC0AC\\uAC00 \\uC2DC\\uC791\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4!'} {'\\u{2728}'}
              </p>
            </div>
          </div>
        )}
        <p className="inv-date-label">{config.eventDateLabel}</p>
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/hosts-section.tsx
// ──────────────────────────────────────────────
const hostsSection = `'use client';

import { AnimatedReveal } from './animated-reveal';

interface HostItem { name: string; nameEn?: string; role: string; roleEn?: string; phone?: string; avatarUrl?: string; }
interface Props { config: { hostsTitle: string; hostsTitleEn?: string; hosts: HostItem[]; } }

export function HostsSection({ config }: Props) {
  if (!config.hosts?.length) return null;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated">
        <p className="inv-eyebrow">HOSTS</p>
        <h2 className="inv-section-title mb-8">{config.hostsTitle}</h2>
        <div className="inv-hosts">
          {config.hosts.map((host, i) => (
            <div key={i} className="inv-host inv-card">
              {host.avatarUrl ? (
                <img
                  src={host.avatarUrl}
                  alt={host.name}
                  className="inv-host-avatar"
                  style={{ border: '3px solid var(--inv-card-bg)', boxShadow: '0 0 0 2px var(--inv-accent-glow)' }}
                />
              ) : (
                <div
                  className="inv-host-avatar inv-host-avatar--initial"
                  style={{ background: 'linear-gradient(135deg, var(--inv-gradient-from), var(--inv-gradient-to))', color: '#fff' }}
                >
                  {host.name.charAt(0)}
                </div>
              )}
              <p className="inv-host-role">{host.role}</p>
              <p className="inv-host-name">{host.name}</p>
              {host.phone && (
                <a href={\`tel:\${host.phone}\`} className="inv-btn inv-btn-secondary inv-btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
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

import { useCallback, useEffect, useState } from 'react';
import { AnimatedReveal } from './animated-reveal';

interface Props { config: { venueName: string; venueAddress: string; kakaoMapUrl: string; naverMapUrl: string; parkingInfo: string; transitInfo: string; } }

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => { setClosing(true); setTimeout(onClose, 250); }, 1800);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="inv-toast" data-closing={closing ? 'true' : undefined}>
      {'\\u2713'} {message}
    </div>
  );
}

export function LocationSection({ config }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const handleCopyAddress = useCallback(async () => {
    const text = config.venueAddress || config.venueName;
    if (!text) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setToast('\\uC8FC\\uC18C \\uBCF5\\uC0AC\\uB428');
      } else {
        window.prompt('\\uBCF5\\uC0AC\\uD574\\uC8FC\\uC138\\uC694:', text);
      }
    } catch {
      window.prompt('\\uBCF5\\uC0AC\\uD574\\uC8FC\\uC138\\uC694:', text);
    }
  }, [config.venueAddress, config.venueName]);

  if (!config.venueName && !config.venueAddress) return null;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated">
        <p className="inv-eyebrow">LOCATION</p>
        <h2 className="inv-section-title mb-6">{'\\uC7A5\\uC18C \\uC548\\uB0B4'}</h2>
        <div className="max-w-md mx-auto inv-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 flex items-center justify-center rounded-full" style={{ width: '44px', height: '44px', background: 'var(--inv-accent-glow)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--inv-accent-solid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              {config.venueName && <p className="inv-venue-name">{config.venueName}</p>}
              {config.venueAddress && (
                <div className="inv-venue-addr-row">
                  <p className="inv-venue-addr">{config.venueAddress}</p>
                  <button onClick={handleCopyAddress} className="inv-btn-icon-sm" type="button" aria-label="\\uC8FC\\uC18C \\uBCF5\\uC0AC">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="inv-map-buttons">
            {config.kakaoMapUrl && (
              <a href={config.kakaoMapUrl} target="_blank" rel="noopener noreferrer" className="inv-btn inv-btn-kakao">
                {'\\uCE74\\uCE74\\uC624\\uB9F5'}
              </a>
            )}
            {config.naverMapUrl && (
              <a href={config.naverMapUrl} target="_blank" rel="noopener noreferrer" className="inv-btn inv-btn-naver">
                {'\\uB124\\uC774\\uBC84\\uB9F5'}
              </a>
            )}
          </div>

          {(config.parkingInfo || config.transitInfo) && (
            <details className="inv-details">
              <summary>{'\\uC774\\uC6A9 \\uC548\\uB0B4'}</summary>
              <div className="inv-details-body">
                {config.parkingInfo && (
                  <p className="inv-info-line">{'\\u{1F17F}\\u{FE0F}'} {config.parkingInfo}</p>
                )}
                {config.transitInfo && (
                  <p className="inv-info-line">{'\\u{1F68C}'} {config.transitInfo}</p>
                )}
              </div>
            </details>
          )}
        </div>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/gallery-section.tsx
// ──────────────────────────────────────────────
const gallerySection = `'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatedReveal } from './animated-reveal';

interface Props { config: { galleryImages: string[]; galleryColumns: number; } }

export function GallerySection({ config }: Props) {
  if (!config.galleryImages?.length) return null;

  const useCarousel = config.galleryImages.length <= 3;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated">
        <p className="inv-eyebrow">GALLERY</p>
        <h2 className="inv-section-title mb-6">{'\\uAC24\\uB7EC\\uB9AC'}</h2>
        {useCarousel ? <Carousel images={config.galleryImages} /> : <EditorialGrid images={config.galleryImages} />}
      </section>
    </AnimatedReveal>
  );
}

function Carousel({ images }: { images: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = children.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveIdx(idx);
          }
        }
      },
      { root: el, threshold: 0.6 },
    );
    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [images.length]);

  return (
    <div className="max-w-lg mx-auto">
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-3 pb-2" style={{ scrollPaddingInline: '1.5rem' }}>
        {images.map((url, i) => (
          <div key={i} className="snap-center flex-shrink-0 overflow-hidden rounded-xl" style={{ width: 'min(75vw, 320px)', aspectRatio: '3/4' }}>
            <img src={url} alt={\`Photo \${i + 1}\`} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="inv-dots">
          {images.map((_, i) => (<div key={i} className={\`inv-dot \${i === activeIdx ? 'inv-dot-active' : ''}\`} />))}
        </div>
      )}
    </div>
  );
}

// 첫 장 대형 + 나머지 소형 그리드의 편집적 비대칭 레이아웃
function EditorialGrid({ images }: { images: string[] }) {
  return (
    <div className="inv-gallery-bento">
      {images.map((url, i) => (
        <div key={i} className={\`inv-gallery-item \${i === 0 ? 'inv-gallery-item--lg' : ''}\`}>
          <img src={url} alt={\`Photo \${i + 1}\`} loading="lazy" />
        </div>
      ))}
    </div>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/account-section.tsx
// ──────────────────────────────────────────────
const accountSection = `'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatedReveal } from './animated-reveal';

interface AccountItem { label: string; bankName: string; accountNumber: string; holder: string; }
interface Props { config: { accountTitle: string; accounts: AccountItem[]; kakaoPayUrl: string; } }

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClosing(true);
      setTimeout(onClose, 250);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="inv-toast" data-closing={closing ? 'true' : undefined}>
      {'\\u2713'} {message}
    </div>
  );
}

function AccountRow({ acc }: { acc: AccountItem }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(acc.accountNumber);
      } else {
        window.prompt('\\uBCF5\\uC0AC\\uD574\\uC8FC\\uC138\\uC694:', acc.accountNumber);
        return;
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt('\\uBCF5\\uC0AC\\uD574\\uC8FC\\uC138\\uC694:', acc.accountNumber);
    }
  }, [acc.accountNumber]);

  return (
    <details className="inv-details inv-account-item" open>
      <summary>
        <span className="inv-account-badge">{acc.label}</span>
        <span className="inv-account-holder">{acc.holder}</span>
      </summary>
      <div className="inv-account-row">
        <p className="inv-account-num">
          <span className="inv-account-bank">{acc.bankName}</span>{' '}
          <span className="tabular-nums">{acc.accountNumber}</span>
        </p>
        {copied ? (
          <span className="inv-copy-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {'\\uBCF5\\uC0AC\\uB428'}
          </span>
        ) : (
          <button onClick={handleCopy} className="inv-btn inv-btn-secondary inv-btn-sm" type="button">
            {'\\uBCF5\\uC0AC'}
          </button>
        )}
      </div>
    </details>
  );
}

export function AccountSection({ config }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  if (!config.accounts?.length && !config.kakaoPayUrl) return null;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated" style={{ background: 'var(--inv-bg-alt)' }}>
        <p className="inv-eyebrow">GIFT</p>
        <h2 className="inv-section-title mb-6">{config.accountTitle}</h2>
        <div className="max-w-md mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {config.accounts.map((acc, i) => (<AccountRow key={i} acc={acc} />))}
          {config.kakaoPayUrl && (
            <a href={config.kakaoPayUrl} target="_blank" rel="noopener noreferrer" className="inv-btn inv-btn-kakao" style={{ width: '100%', marginTop: '0.25rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919">
                <path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.8 5.22 4.5 6.6-.2.73-.72 2.65-.82 3.06-.13.5.18.49.38.36.16-.11 2.5-1.7 3.51-2.39.47.07.95.1 1.43.1 5.52 0 10-3.58 10-7.73C22 6.58 17.52 3 12 3z"/>
              </svg>
              {'\\uCE74\\uCE74\\uC624\\uD398\\uC774\\uB85C \\uC1A1\\uAE08\\uD558\\uAE30'}
            </a>
          )}
        </div>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/contact-section.tsx
// ──────────────────────────────────────────────
const contactSection = `'use client';

import { AnimatedReveal } from './animated-reveal';

interface ContactItem { name: string; phone: string; role?: string; }
interface Props { config: { contacts: ContactItem[]; } }

export function ContactSection({ config }: Props) {
  if (!config.contacts?.length) return null;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated">
        <p className="inv-eyebrow">CONTACT</p>
        <h2 className="inv-section-title mb-6">{'\\uC5F0\\uB77D\\uCC98'}</h2>
        <div className="max-w-md mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {config.contacts.map((c, i) => (
            <div key={i} className="inv-card-accent inv-contact-row">
              <div className="flex items-center gap-2">
                {c.role && <span className="inv-contact-role">{c.role}</span>}
                <span className="inv-contact-name">{c.name}</span>
              </div>
              {c.phone && (
                <div className="flex items-center gap-2">
                  <a href={\`tel:\${c.phone}\`} className="inv-btn inv-btn-primary inv-btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    {'\\uC804\\uD654'}
                  </a>
                  <a href={\`sms:\${c.phone}\`} className="inv-btn inv-btn-secondary inv-btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    {'\\uBB38\\uC790'}
                  </a>
                </div>
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
// src/components/message-section.tsx
// ──────────────────────────────────────────────
const messageSection = `import { AnimatedReveal } from './animated-reveal';

interface Props { config: { messageTitle: string; messageBody: string; messageAlign: 'center' | 'left'; } }

export function MessageSection({ config }: Props) {
  if (!config.messageBody) return null;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated">
        <p className="inv-eyebrow">GREETING</p>
        <h2 className="inv-section-title mb-2">{config.messageTitle}</h2>
        <div className="inv-headline-divider" aria-hidden="true">
          <span className="inv-headline-divider-mark">&#10022;</span>
        </div>
        <p className="inv-message-body" style={{ textAlign: config.messageAlign || 'center' }}>
          {config.messageBody}
        </p>
        <div className="inv-headline-divider" aria-hidden="true">
          <span className="inv-headline-divider-mark">&#10022;</span>
        </div>
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/share-section.tsx
// ──────────────────────────────────────────────
const shareSection = `'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatedReveal } from './animated-reveal';

interface Props {
  config: {
    shareTitle: string;
    enableKakao: boolean;
    enableCopy: boolean;
    enableQr: boolean;
    kakaoJsKey: string;
  };
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setClosing(true);
      setTimeout(onClose, 250);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="inv-toast" data-closing={closing ? 'true' : undefined}>
      {'\\u2713'} {message}
    </div>
  );
}

export function ShareSection({ config }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // window.location 기반이므로 클라이언트에서만 계산 (정적 baking 회피)
    if (config.enableQr) {
      const url = encodeURIComponent(window.location.href);
      setQrUrl(\`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=\${url}\`);
    }
  }, [config.enableQr]);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        window.prompt('\\uBCF5\\uC0AC\\uD574\\uC8FC\\uC138\\uC694:', window.location.href);
        return;
      }
      setToast('\\uB9C1\\uD06C \\uBCF5\\uC0AC\\uB428');
    } catch {
      window.prompt('\\uBCF5\\uC0AC\\uD574\\uC8FC\\uC138\\uC694:', window.location.href);
    }
  }, []);

  const handleKakao = useCallback(() => {
    if (config.kakaoJsKey && typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).Kakao) {
      const Kakao = (window as unknown as Record<string, { initialized?: boolean; init?: (key: string) => void; Share?: { sendDefault: (opts: unknown) => void } }>).Kakao;
      if (!Kakao.initialized) Kakao.init?.(config.kakaoJsKey);
      Kakao.Share?.sendDefault({ objectType: 'feed', content: { title: document.title, description: '', imageUrl: '', link: { mobileWebUrl: window.location.href, webUrl: window.location.href } } });
      return;
    }
    if (typeof navigator.share === 'function') {
      navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
      return;
    }
    handleCopy();
  }, [config.kakaoJsKey, handleCopy]);

  if (!config.enableKakao && !config.enableCopy && !config.enableQr) return null;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated" style={{ background: 'var(--inv-bg-alt)' }}>
        <p className="inv-eyebrow">SHARE</p>
        <h2 className="inv-section-title mb-6">{config.shareTitle}</h2>
        <div className="flex gap-3 justify-center mb-2">
          {config.enableKakao && (
            <button onClick={handleKakao} className="inv-btn-icon inv-btn-icon-kakao" aria-label="\\uCE74\\uCE74\\uC624\\uD1A1 \\uACF5\\uC720">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919"><path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.8 5.22 4.5 6.6-.2.73-.72 2.65-.82 3.06-.13.5.18.49.38.36.16-.11 2.5-1.7 3.51-2.39.47.07.95.1 1.43.1 5.52 0 10-3.58 10-7.73C22 6.58 17.52 3 12 3z"/></svg>
            </button>
          )}
          {config.enableCopy && (
            <button onClick={handleCopy} className="inv-btn-icon inv-btn-icon-secondary" aria-label="\\uB9C1\\uD06C \\uBCF5\\uC0AC">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </button>
          )}
        </div>
        {config.enableQr && (
          <details className="inv-details" style={{ display: 'inline-block', textAlign: 'center' }}>
            <summary style={{ justifyContent: 'center' }}>{'QR \\uCF54\\uB4DC \\uBCF4\\uAE30'}</summary>
            <div className="flex justify-center mt-3">
              {qrUrl && <img src={qrUrl} alt="QR Code" width={160} height={160} style={{ borderRadius: '0.75rem', border: '1px solid var(--inv-card-border)' }} loading="lazy" />}
            </div>
          </details>
        )}
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/rsvp-section.tsx
// ──────────────────────────────────────────────
const rsvpSection = `import { AnimatedReveal } from './animated-reveal';

interface Props { config: { rsvpTitle: string; rsvpDescription: string; rsvpUrl: string; rsvpButtonLabel: string; } }

export function RsvpSection({ config }: Props) {
  if (!config.rsvpUrl) return null;

  return (
    <AnimatedReveal>
      <section className="inv-section-decorated">
        <p className="inv-eyebrow">RSVP</p>
        <h2 className="inv-section-title mb-6">{config.rsvpTitle}</h2>
        <div className="max-w-md mx-auto inv-card" style={{ padding: '1.75rem 2rem' }}>
          {config.rsvpDescription && (
            <p className="inv-rsvp-desc">{config.rsvpDescription}</p>
          )}
          <a
            href={config.rsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inv-btn inv-btn-primary"
            style={{ width: '100%' }}
          >
            {config.rsvpButtonLabel}
          </a>
        </div>
      </section>
    </AnimatedReveal>
  );
}
`;

// ──────────────────────────────────────────────
// src/components/footer-section.tsx
// ──────────────────────────────────────────────
const footerSection = `import { AnimatedReveal } from './animated-reveal';

interface Props { config: { title: string; closingMessage: string; closingMessageEn?: string; showPoweredBy: boolean; hosts?: { name: string }[]; } }

function getInitials(hosts: { name?: string }[] | undefined, title: string): string {
  const names = (hosts || []).map((h) => (h.name || '').trim()).filter(Boolean).slice(0, 2);
  if (names.length > 0) return names.map((n) => n.charAt(0)).join(' & ');
  return (title || '').trim().charAt(0) || '\\u2726';
}

export function FooterSection({ config }: Props) {
  const initials = getInitials(config.hosts, config.title);

  return (
    <AnimatedReveal>
      <footer className="inv-footer">
        <div className="inv-monogram inv-monogram-sm" aria-hidden="true">{initials}</div>
        {config.closingMessage && (
          <p className="inv-closing">{config.closingMessage}</p>
        )}
        {config.showPoweredBy && (
          <a
            href="https://linkmap.pages.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            Powered by Linkmap
          </a>
        )}
      </footer>
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
  gradientFrom: '#B8860B',
  gradientTo: '#8B6B1F',
  fontFamily: 'Nanum Myeongjo',
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
  messageTitle: '인사말',
  messageTitleEn: 'Greeting',
  messageBody: '소중한 분들을 초대합니다.',
  messageAlign: 'center' as 'center' | 'left',
  shareTitle: '초대장 공유하기',
  shareTitleEn: 'Share',
  enableKakao: true,
  enableCopy: true,
  enableQr: false,
  kakaoJsKey: '',
  rsvpTitle: '참석 여부 회신',
  rsvpTitleEn: 'RSVP',
  rsvpDescription: '참석 여부를 알려주시면 감사하겠습니다.',
  rsvpUrl: '',
  rsvpButtonLabel: '참석 여부 알리기',
  closingMessage: '참석해 주셔서 감사합니다.',
  closingMessageEn: 'Thank you for joining us.',
  showPoweredBy: true,
};
`;

// ──────────────────────────────────────────────
// src/app/page.tsx (placeholder — 제너레이터가 실제 생성)
// ──────────────────────────────────────────────
const pageTsx = `import { siteConfig } from '@/lib/config';
import { HeroSection } from '@/components/hero-section';
import { MessageSection } from '@/components/message-section';
import { CountdownSection } from '@/components/countdown-section';
import { HostsSection } from '@/components/hosts-section';
import { LocationSection } from '@/components/location-section';
import { GallerySection } from '@/components/gallery-section';
import { RsvpSection } from '@/components/rsvp-section';
import { AccountSection } from '@/components/account-section';
import { ShareSection } from '@/components/share-section';
import { ContactSection } from '@/components/contact-section';
import { FooterSection } from '@/components/footer-section';

export default function Home() {
  return (
    <>
      <main className="min-h-screen" style={{ background: 'var(--inv-bg-grad, var(--inv-bg))' }}>
        <HeroSection config={siteConfig} />
        <MessageSection config={siteConfig} />
        <CountdownSection config={siteConfig} />
        <HostsSection config={siteConfig} />
        <LocationSection config={siteConfig} />
        <GallerySection config={siteConfig} />
        <RsvpSection config={siteConfig} />
        <AccountSection config={siteConfig} />
        <ShareSection config={siteConfig} />
        <ContactSection config={siteConfig} />
        <FooterSection config={siteConfig} />
      </main>
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
    { path: 'package-lock.json', content: packageLock },
    { path: 'tsconfig.json', content: tsconfigJson },
    { path: 'postcss.config.mjs', content: postcssConfig },
    { path: 'next.config.ts', content: nextConfig },
    { path: 'src/app/layout.tsx', content: layoutTsx },
    { path: 'src/app/page.tsx', content: pageTsx },
    { path: 'src/app/globals.css', content: globalsCss },
    { path: 'src/lib/config.ts', content: configTs },
    { path: 'src/components/animated-reveal.tsx', content: animatedReveal },
    { path: 'src/components/hero-section.tsx', content: heroSection },
    { path: 'src/components/countdown-section.tsx', content: countdownSection },
    { path: 'src/components/hosts-section.tsx', content: hostsSection },
    { path: 'src/components/location-section.tsx', content: locationSection },
    { path: 'src/components/gallery-section.tsx', content: gallerySection },
    { path: 'src/components/account-section.tsx', content: accountSection },
    { path: 'src/components/contact-section.tsx', content: contactSection },
    { path: 'src/components/message-section.tsx', content: messageSection },
    { path: 'src/components/share-section.tsx', content: shareSection },
    { path: 'src/components/rsvp-section.tsx', content: rsvpSection },
    { path: 'src/components/footer-section.tsx', content: footerSection },
  ],
};
