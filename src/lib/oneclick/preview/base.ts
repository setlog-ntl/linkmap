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

/**
 * 섹션 HTML의 최상위 여는 태그에 `data-lm-section` 앵커 속성을 주입합니다.
 * 에디터에서 모듈(섹션)을 선택하면 이 앵커로 프리뷰가 스크롤됩니다.
 * @param html 섹션 빌더가 반환한 HTML (비어있으면 그대로 반환)
 * @param moduleId 모듈 식별자 (슬러그)
 */
export function withSectionId(html: string, moduleId: string): string {
  if (!html || !html.trim()) return html;
  // 첫 번째 여는 태그(<section, <div, <footer 등)에만 속성 주입 — HTML 주석(<!--)은 자동 스킵
  return html.replace(/<([a-zA-Z][\w-]*)/, `<$1 data-lm-section="${moduleId}"`);
}

// ─── 소셜 플랫폼 아이콘 (Simple Icons SVG path) ───

/** 소셜 플랫폼별 SVG path + 브랜드 색상 */
export const SOCIAL_ICON_MAP: Record<string, { path: string; color: string }> = {
  instagram: {
    path: 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8504.6151 19.0872.32 18.2143.1197 16.9366.0633 15.6588.0069 15.2479-.0067 11.9999 0 8.7522.0067 8.3413.0206 7.0301.084m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.8981-1.3783-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.8988.4227-.1651 1.0573-.3631 2.2271-.4182 1.2655-.0595 1.6447-.072 4.8479-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.8988 1.3783.1651.4236.3631 1.0567.4182 2.2274.0595 1.2652.0726 1.6446.079 4.848.0064 3.2037-.0051 3.5834-.0607 4.848-.0508 1.17-.2456 1.8054-.408 2.2288-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.8988-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
    color: '#E4405F',
  },
  youtube: {
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    color: '#FF0000',
  },
  twitter: {
    path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
    color: '#000000',
  },
  github: {
    path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
    color: '#181717',
  },
  linkedin: {
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    color: '#0A66C2',
  },
  tiktok: {
    path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
    color: '#000000',
  },
  facebook: {
    path: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.044 1.613.115v3.146c-.427-.044-.784-.065-.97-.065-1.378 0-1.92.521-1.92 1.877v2.486h2.76l-.474 3.666H13.68v8.238C19.425 22.901 24 17.973 24 12 24 5.373 18.627 0 12 0S0 5.373 0 12c0 5.628 3.874 10.35 9.101 11.691Z',
    color: '#0866FF',
  },
  threads: {
    path: 'M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.26 1.33-3.017.88-.724 2.088-1.139 3.59-1.237 1.092-.071 2.095.008 3.003.169-.135-.91-.464-1.597-.99-2.044-.59-.5-1.467-.773-2.607-.813l-.009-.001c-.965 0-1.79.282-2.375.813-.362.326-.648.751-.848 1.25l-1.878-.813c.282-.687.68-1.278 1.183-1.752.97-.916 2.308-1.397 3.87-1.397l.015.001c1.555.055 2.775.488 3.627 1.288.77.72 1.245 1.717 1.42 2.975.597.148 1.138.36 1.618.639 1.14.66 1.96 1.594 2.438 2.776.77 1.905.696 4.592-1.328 6.57-1.8 1.762-4.058 2.57-7.202 2.592z',
    color: '#000000',
  },
  'naver-blog': {
    path: 'M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z',
    color: '#03C75A',
  },
};

/** 소셜 아이콘 인라인 SVG 생성 (24x24 viewBox 기준) */
export function getSocialIconSvg(platform: string, size: number = 18, color?: string): string {
  const icon = SOCIAL_ICON_MAP[platform];
  if (!icon) return '';
  const fill = color ?? icon.color;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${esc(fill)}"><path d="${icon.path}"/></svg>`;
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
<script>
(function(){
  window.addEventListener('message', function(e){
    var d = e && e.data;
    if(!d || d.type !== 'linkmap:scroll-to-section') return;
    var el = document.querySelector('[data-lm-section="' + d.moduleId + '"]') || document.getElementById(d.moduleId);
    if(!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.style.transition = 'outline-color .4s ease';
    el.style.outlineOffset = '-3px';
    el.style.outline = '2px solid var(--brand-primary, #6366f1)';
    setTimeout(function(){ el.style.outline = '2px solid transparent'; }, 1100);
  });
})();
</script>
</body>
</html>`;
}
