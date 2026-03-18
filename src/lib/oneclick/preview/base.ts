// ──────────────────────────────────────────────
// Preview HTML Generation — Shared Utilities & HTML Shell
// ──────────────────────────────────────────────

import type { ModuleConfigState } from '@/lib/module-schema';

// ─── 유틸리티 ──────────────────────────────────

/** HTML 이스케이프 */
export function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 이미지 src 결정: 외부URL -> imageMap(base64) -> liveUrl+path */
export function resolveImageSrc(
  value: string,
  liveUrl: string,
  imageMap: Record<string, string>,
): string {
  if (!value) return '';
  if (value.startsWith('http')) return value;
  if (imageMap[value]) return imageMap[value];
  if (liveUrl) return `${liveUrl}${value}`;
  return value;
}

/** moduleState에서 값 추출 헬퍼 */
export function getVal(
  state: ModuleConfigState,
  moduleId: string,
  key: string,
  defaultValue: string = '',
): string {
  const mod = state.values[moduleId];
  if (!mod) return defaultValue;
  const v = mod[key];
  if (v === undefined || v === null) return defaultValue;
  return String(v);
}

export function getArr(
  state: ModuleConfigState,
  moduleId: string,
  key: string,
): unknown[] {
  const mod = state.values[moduleId];
  if (!mod) return [];
  const v = mod[key];
  if (!Array.isArray(v)) return [];
  return v;
}

export function isEnabled(
  state: ModuleConfigState,
  moduleId: string,
): boolean {
  return state.enabled.includes(moduleId);
}

/** 활성 모듈을 order 순서대로 반환 */
export function getActiveModules(state: ModuleConfigState): string[] {
  return state.order.filter((id) => state.enabled.includes(id));
}

// ─── Google Fonts 매핑 ─────────────────────────

const GOOGLE_FONT_FAMILIES: Record<string, string> = {
  'Noto Sans KR': 'Noto+Sans+KR:wght@400;500;700',
  'IBM Plex Sans KR': 'IBM+Plex+Sans+KR:wght@400;500;700',
  'Nanum Gothic': 'Nanum+Gothic:wght@400;700',
  'Nanum Myeongjo': 'Nanum+Myeongjo:wght@400;700',
  Inter: 'Inter:wght@400;500;600;700',
  Poppins: 'Poppins:wght@400;500;600;700',
  'Gmarket Sans': 'Gmarket+Sans:wght@400;500;700',
};

// ─── 공통 CSS 빌더 ────────────────────────────

export function buildBaseCSS(
  preset: string,
  gradientFrom?: string,
  gradientTo?: string,
): string {
  let css = `
/* ── Design Tokens (Light) ── */
:root {
  --brand-primary: #ee5b2b;
  --brand-secondary: #f59e0b;
  --brand-glow: rgba(238, 91, 43, 0.15);
  --brand-gradient: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  --bg: #ffffff;
  --bg-alt: #faf9f7;
  --text-primary: #1a1a1a;
  --text-secondary: #5c5c5c;
  --surface-elevated: #ffffff;
  --surface-border: #e8e5e1;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.04);
  --shadow-lg: 0 12px 40px rgba(0,0,0,.1);
  --radius-lg: 16px;
  --radius-sm: 10px;
  --transition: .3s cubic-bezier(.4,0,.2,1);
  --section-gap: clamp(4rem, 8vw, 7rem);
  --section-padding-x: clamp(1rem, 4vw, 3rem);
  --text-hero: clamp(2.5rem, 6vw, 5rem);
  --text-section: clamp(1.75rem, 3vw, 2.5rem);
  --text-body: clamp(0.9375rem, 1vw, 1.0625rem);
}

/* ── Preset: Creator ── */
[data-preset="creator"] {
  --brand-primary: #ee5b2b;
  --brand-secondary: #f59e0b;
  --brand-gradient: linear-gradient(135deg, #ee5b2b, #f59e0b);
}

/* ── Preset: Midnight ── */
[data-preset="midnight"] {
  --brand-primary: #818cf8;
  --brand-secondary: #c084fc;
  --brand-glow: rgba(129, 140, 248, 0.2);
  --brand-gradient: linear-gradient(135deg, #818cf8, #c084fc);
  --bg: #0f0f0f;
  --bg-alt: #171717;
  --text-primary: #f0f0f0;
  --text-secondary: #a0a0a0;
  --surface-elevated: #1a1a1a;
  --surface-border: #2a2a2a;
}

/* ── Preset: Warm Earth ── */
[data-preset="warm-earth"] {
  --brand-primary: #92400e;
  --brand-secondary: #b45309;
  --brand-glow: rgba(146, 64, 14, 0.12);
  --brand-gradient: linear-gradient(135deg, #92400e, #b45309);
  --bg: #fefce8;
  --bg-alt: #fef3c7;
  --surface-border: #fde68a;
}

/* ── Preset: Minimal ── */
[data-preset="minimal"] {
  --brand-primary: #18181b;
  --brand-secondary: #52525b;
  --brand-glow: rgba(24, 24, 27, 0.1);
  --brand-gradient: linear-gradient(135deg, #18181b, #52525b);
}

/* ── Preset: Storyteller ── */
[data-preset="storyteller"] {
  --brand-primary: #6366f1;
  --brand-secondary: #8b5cf6;
  --brand-glow: rgba(99, 102, 241, 0.15);
  --brand-gradient: linear-gradient(135deg, #6366f1, #8b5cf6);
}

/* ── Preset: Editorial ── */
[data-preset="editorial"] {
  --brand-primary: #1c1c1e;
  --brand-secondary: #3a3a3c;
  --brand-glow: rgba(28, 28, 30, 0.12);
  --brand-gradient: linear-gradient(135deg, #1c1c1e, #3a3a3c);
}

/* ── Preset: Magazine ── */
[data-preset="magazine"] {
  --brand-primary: #d4163c;
  --brand-secondary: #ff6b35;
  --brand-glow: rgba(212, 22, 60, 0.15);
  --brand-gradient: linear-gradient(135deg, #d4163c, #ff6b35);
}

/* ── Preset: Terminal ── */
[data-preset="terminal"] {
  --brand-primary: #10b981;
  --brand-secondary: #34d399;
  --brand-glow: rgba(16, 185, 129, 0.15);
  --brand-gradient: linear-gradient(135deg, #10b981, #34d399);
  --bg: #0a0a0a;
  --bg-alt: #111111;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --surface-elevated: #1a1a1a;
  --surface-border: #1e293b;
}

/* ── Preset: GitHub Dark ── */
[data-preset="github-dark"] {
  --brand-primary: #58a6ff;
  --brand-secondary: #79c0ff;
  --brand-glow: rgba(88, 166, 255, 0.15);
  --brand-gradient: linear-gradient(135deg, #58a6ff, #79c0ff);
  --bg: #0d1117;
  --bg-alt: #161b22;
  --text-primary: #c9d1d9;
  --text-secondary: #8b949e;
  --surface-elevated: #161b22;
  --surface-border: #30363d;
}

/* ── Preset: VS Code ── */
[data-preset="vscode"] {
  --brand-primary: #007acc;
  --brand-secondary: #3794ff;
  --brand-glow: rgba(0, 122, 204, 0.15);
  --brand-gradient: linear-gradient(135deg, #007acc, #3794ff);
  --bg: #1e1e1e;
  --bg-alt: #252526;
  --text-primary: #d4d4d4;
  --text-secondary: #808080;
  --surface-elevated: #252526;
  --surface-border: #3c3c3c;
}

/* ── Preset: Dracula ── */
[data-preset="dracula"] {
  --brand-primary: #bd93f9;
  --brand-secondary: #ff79c6;
  --brand-glow: rgba(189, 147, 249, 0.15);
  --brand-gradient: linear-gradient(135deg, #bd93f9, #ff79c6);
  --bg: #282a36;
  --bg-alt: #2d2f3d;
  --text-primary: #f8f8f2;
  --text-secondary: #6272a4;
  --surface-elevated: #44475a;
  --surface-border: #6272a4;
}`;

  // gradientFrom/gradientTo 오버라이드
  if (gradientFrom || gradientTo) {
    const from = gradientFrom || 'var(--brand-primary)';
    const to = gradientTo || 'var(--brand-secondary)';
    css += `
/* ── Custom Gradient Override ── */
[data-preset="${esc(preset)}"] {
  --brand-primary: ${esc(from)};
  --brand-secondary: ${esc(to)};
  --brand-gradient: linear-gradient(135deg, ${esc(from)}, ${esc(to)});
}`;
  }

  css += `

/* ── Base styles ── */
body {
  margin: 0;
  font-family: 'Pretendard Variable', 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: var(--bg);
  color: var(--text-primary);
  transition: background .4s, color .4s;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

*, *::before, *::after { box-sizing: border-box; }

a { color: inherit; text-decoration: none; }
img { max-width: 100%; height: auto; }

/* ── Section helpers ── */
.section-alt { background: var(--bg-alt); }
.section-gap { padding-top: var(--section-gap, 4rem); padding-bottom: var(--section-gap, 4rem); }
.section-label {
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--brand-primary);
  margin-bottom: 0.75rem;
  display: block;
}

.section-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 var(--section-padding-x, 1.5rem);
}

/* ── Value card ── */
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

/* ── Highlight item ── */
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

/* ── Masonry gallery ── */
.masonry-gallery {
  columns: 2;
  column-gap: 1rem;
}
@media (min-width: 768px) {
  .masonry-gallery { columns: 3; column-gap: 1.25rem; }
}
.masonry-gallery > * {
  break-inside: avoid;
  margin-bottom: 1rem;
}
@media (min-width: 768px) {
  .masonry-gallery > * { margin-bottom: 1.25rem; }
}
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

/* ── Contact link ── */
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
  box-shadow: 0 4px 16px rgba(0,0,0,.08);
  border-color: var(--brand-primary);
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
  .hero-editorial { grid-template-columns: 1fr 1fr; gap: 4rem; }
}
.hero-editorial .hero-text-col { order: 1; }
.hero-editorial .hero-img-col { order: 2; }

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
  .hero-image-wrapper { aspect-ratio: 4/5; max-height: none; }
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

/* ── Grid helpers ── */
.grid-2 { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
.grid-3 { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 640px) {
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 768px) {
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
}

/* ── CTA button ── */
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: var(--brand-gradient);
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: transform var(--transition), box-shadow var(--transition);
}
.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--brand-glow, rgba(0,0,0,.15));
}

/* ── Skill pill ── */
.skill-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  background: var(--surface-elevated);
  border: 1px solid var(--surface-border);
  border-radius: 50px;
  font-size: .85rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

/* ── Progress bar ── */
.progress-bar-container {
  width: 100%;
  height: 8px;
  background: var(--surface-border);
  border-radius: 4px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: var(--brand-gradient);
  border-radius: 4px;
  transition: width .6s cubic-bezier(.4,0,.2,1);
}

/* ── Timeline ── */
.timeline-item {
  position: relative;
  padding-left: 2rem;
  padding-bottom: 2rem;
  border-left: 2px solid var(--surface-border);
}
.timeline-item:last-child { border-left-color: transparent; }
.timeline-item::before {
  content: '';
  position: absolute;
  left: -6px; top: 4px;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--brand-gradient);
  border: 2px solid var(--bg);
}

/* ── Blog card ── */
.blog-card {
  background: var(--surface-elevated);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: transform var(--transition), box-shadow var(--transition);
}
.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* ── Footer ── */
.site-footer {
  text-align: center;
  padding: 2rem 1.5rem;
  font-size: .85rem;
  color: var(--text-secondary);
  border-top: 1px solid var(--surface-border);
}
`;

  return css;
}

// ─── HTML 쉘 ──────────────────────────────────

export function wrapInHtml(
  bodyCss: string,
  bodyContent: string,
  preset: string,
  fontFamily?: string,
): string {
  const fontLinks: string[] = [];

  // Pretendard CDN (항상 포함)
  fontLinks.push(
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />',
  );

  // Google Fonts (필요 시)
  if (fontFamily && GOOGLE_FONT_FAMILIES[fontFamily]) {
    fontLinks.push(
      `<link rel="preconnect" href="https://fonts.googleapis.com" />`,
      `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`,
      `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${GOOGLE_FONT_FAMILIES[fontFamily]}&display=swap" />`,
    );
  }

  const fontFamilyOverride = fontFamily
    ? `body { font-family: '${esc(fontFamily)}', 'Pretendard Variable', sans-serif; }`
    : '';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  ${fontLinks.join('\n  ')}
  <style>
${bodyCss}
${fontFamilyOverride}
  </style>
</head>
<body data-preset="${esc(preset)}">
${bodyContent}
</body>
</html>`;
}
