import {
  esc,
  resolveImageSrc,
  getVal,
  getArr,
  getActiveModules,
  buildBaseCSS,
  wrapInHtml,
  getSocialIconSvg,
} from './base';
import type { ModuleConfigState } from '@/lib/module-schema';

// ── Types ────────────────────────────────────────

interface LinkItem {
  title: string;
  url: string;
  emoji: string;
}

interface SocialItem {
  platform: string;
  url: string;
  label?: string;
}

type BgStyle = 'light' | 'dark' | 'gradient' | 'solid' | 'mesh' | 'aurora' | 'glass';
type CardStyle = 'rounded' | 'pill' | 'square' | 'glass' | 'neon' | 'outline';
type FontFamily = 'system' | 'serif' | 'mono' | 'display';

// ── Theme — 실제 배포 themes.ts와 동일 ──────────

interface ThemePreset {
  backgroundFrom: string;
  backgroundTo: string;
  primary: string;
  text: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
}

/** primaryColor 기반으로 실제 배포 테마와 동일한 ThemePreset 생성 */
function buildThemeFromPrimary(primaryColor: string, bgStyle: BgStyle): ThemePreset {
  const isDark = ['dark', 'aurora', 'neon', 'ocean', 'sunset', 'forest', 'monochrome'].includes(bgStyle);
  const isLight = ['light', 'minimal', 'candy'].includes(bgStyle);

  if (isDark) {
    return {
      backgroundFrom: '#0f172a',
      backgroundTo: '#1e1b4b',
      primary: primaryColor,
      text: '#f5f3ff',
      textMuted: 'rgba(245,243,255,0.7)',
      cardBg: `${primaryColor}14`,
      cardBorder: `${primaryColor}33`,
    };
  }
  if (isLight || bgStyle === 'glass') {
    return {
      backgroundFrom: '#ffffff',
      backgroundTo: '#f3f4f6',
      primary: primaryColor,
      text: '#111827',
      textMuted: '#6b7280',
      cardBg: 'rgba(0,0,0,0.04)',
      cardBorder: 'rgba(0,0,0,0.08)',
    };
  }
  // gradient, solid, mesh, pastel
  return {
    backgroundFrom: primaryColor,
    backgroundTo: shiftHue(primaryColor, 40),
    primary: primaryColor,
    text: '#ffffff',
    textMuted: 'rgba(255,255,255,0.85)',
    cardBg: 'rgba(255,255,255,0.15)',
    cardBorder: 'rgba(255,255,255,0.28)',
  };
}

// ── Section Renderers — 실제 배포 컴포넌트 기준 ──

function renderProfileSection(
  state: ModuleConfigState,
  theme: ThemePreset,
  liveUrl: string,
  imageMap: Record<string, string>,
): string {
  const name = getVal(state, 'profile', 'name', '');
  const nameEn = getVal(state, 'profile', 'nameEn', '');
  const bio = getVal(state, 'profile', 'bio', '');
  const bioEn = getVal(state, 'profile', 'bioEn', '');
  const avatarUrl = getVal(state, 'profile', 'avatarUrl', '');
  const avatarSrc = resolveImageSrc(avatarUrl, liveUrl, imageMap);

  const initials = name.split(' ').map((w: string) => w[0] || '').join('').slice(0, 2).toUpperCase();

  const avatarHtml = avatarSrc
    ? `<img class="lc-avatar" src="${esc(avatarSrc)}" alt="${esc(name)}"
           style="box-shadow: 0 0 30px ${theme.primary}66; border-color: ${theme.primary}33;" />`
    : `<div class="lc-avatar lc-avatar--placeholder"
           style="background-color: ${theme.primary}; box-shadow: 0 0 30px ${theme.primary}66;">${esc(initials || '?')}</div>`;

  return `
    <section class="lc-profile">
      ${avatarHtml}
      <h1 class="lc-name" style="color:${theme.text}">${esc(name)}</h1>
      ${nameEn ? `<p class="lc-name-en" style="color:${theme.textMuted};font-size:0.85rem;margin:0 0 0.25rem;">${esc(nameEn)}</p>` : ''}
      ${bio ? `<p class="lc-bio" style="color:${theme.textMuted}">${esc(bio)}</p>` : ''}
      ${bioEn ? `<p class="lc-bio-en" style="color:${theme.textMuted};font-size:0.8rem;margin:0.25rem 0 0;opacity:0.8;">${esc(bioEn)}</p>` : ''}
    </section>`;
}

function renderLinksSection(
  state: ModuleConfigState,
  theme: ThemePreset,
  cardStyle: CardStyle,
): string {
  const items = getArr(state, 'links', 'items') as LinkItem[];
  if (items.length === 0) return '';

  const radius = cardStyle === 'pill' ? '9999px' : cardStyle === 'square' || cardStyle === 'outline' ? '0' : '12px';

  const buttons = items
    .map((item) => {
      const emojiHtml = item.emoji ? `<span class="lc-link-emoji">${esc(item.emoji)}</span>` : '';
      const extraStyle = cardStyle === 'neon'
        ? `box-shadow: 0 0 8px ${theme.primary}66, 0 0 20px ${theme.primary}33; border-color: ${theme.primary};`
        : cardStyle === 'outline'
          ? `border: 2px solid ${theme.primary}; background: transparent;`
          : '';
      return `
      <a class="lc-link-btn"
         href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"
         style="background:${theme.cardBg}; border: 1px solid ${theme.cardBorder}; color:${theme.text}; border-radius:${radius}; ${extraStyle}"
         onmouseenter="this.style.borderColor='${theme.primary}66'"
         onmouseleave="this.style.borderColor='${theme.cardBorder}'">
        ${emojiHtml}
        <span class="lc-link-title">${esc(item.title)}</span>
        <svg class="lc-link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>`;
    })
    .join('');

  return `<section class="lc-links">${buttons}</section>`;
}

function renderSocialsSection(
  state: ModuleConfigState,
  theme: ThemePreset,
): string {
  const items = getArr(state, 'socials', 'items') as SocialItem[];
  if (items.length === 0) return '';

  const icons = items
    .map((item) => {
      const svg = getSocialIconSvg(item.platform, 20, theme.text);
      const fallback = svg || esc(item.label || item.platform);
      return `
      <a class="lc-social-icon"
         href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"
         title="${esc(item.label || item.platform)}"
         style="color:${theme.text}">
        ${fallback}
      </a>`;
    })
    .join('');

  return `<section class="lc-socials">${icons}</section>`;
}

// ── Background — 실제 배포 getBackground()와 동일 ──

function buildBgStyle(theme: ThemePreset, bgStyle: BgStyle): string {
  switch (bgStyle) {
    case 'light':
      return `background: linear-gradient(180deg, ${theme.backgroundFrom}, ${theme.backgroundTo});`;
    case 'dark':
      return 'background: linear-gradient(135deg, #0f172a, #1e1b4b);';
    case 'solid':
      return `background: ${theme.primary};`;
    case 'mesh':
      return `background: radial-gradient(at 40% 20%, ${theme.backgroundFrom} 0px, transparent 50%), radial-gradient(at 80% 0%, ${theme.primary} 0px, transparent 50%), radial-gradient(at 0% 50%, ${theme.backgroundTo} 0px, transparent 50%), radial-gradient(at 80% 50%, ${theme.primary}44 0px, transparent 50%), radial-gradient(at 0% 100%, ${theme.backgroundFrom} 0px, transparent 50%), ${theme.backgroundTo};`;
    case 'aurora':
      return `background: radial-gradient(ellipse at top left, ${theme.backgroundFrom}cc 0%, transparent 60%), radial-gradient(ellipse at top right, ${theme.primary}99 0%, transparent 60%), radial-gradient(ellipse at bottom center, ${theme.backgroundTo}bb 0%, transparent 65%), #090d18;`;
    case 'glass':
      return `background: linear-gradient(135deg, ${theme.backgroundFrom}ee, ${theme.backgroundTo}ee);`;
    case 'gradient':
    default:
      return `background: linear-gradient(135deg, ${theme.backgroundFrom}, ${theme.primary}, ${theme.backgroundTo}); background-size: 200% 200%;`;
  }
}

/** HSL 색상 공간에서 hue 회전 */
function shiftHue(hex: string, deg: number): string {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  h = ((h * 360 + deg) % 360) / 360;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  if (s === 0) { r = g = b = l; } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getFontFamilyValue(fontFamily: FontFamily): string {
  switch (fontFamily) {
    case 'serif':
      return "'Nanum Myeongjo', 'Georgia', serif";
    case 'mono':
      return "'Geist Mono', 'SF Mono', 'Fira Code', monospace";
    case 'display':
      return "'Gmarket Sans', 'Impact', sans-serif";
    case 'system':
    default:
      return "'Pretendard Variable', 'Inter', ui-sans-serif, system-ui, sans-serif";
  }
}

// ── CSS — 실제 배포 페이지와 동일한 값 ──────────

function buildLinkCardCSS(
  theme: ThemePreset,
  bgStyle: BgStyle,
): string {
  const isAnimated = bgStyle === 'gradient' || bgStyle === 'aurora';

  return `
    :root { --lc-primary: ${theme.primary}; }

    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    body {
      ${buildBgStyle(theme, bgStyle)}
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 16px;
      ${isAnimated ? 'animation: gradient-shift 15s ease infinite;' : ''}
    }

    .lc-container {
      max-width: 448px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 48px 0;
    }

    /* Profile — 실제: w-24 h-24, text-2xl, ring-2 */
    .lc-profile { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .lc-avatar {
      width: 96px; height: 96px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
      border: 2px solid ${theme.primary}33;
      transition: transform 0.2s;
    }
    .lc-avatar:hover { transform: scale(1.05); }
    .lc-avatar--placeholder {
      color: #fff;
      font-size: 24px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lc-name { font-size: 24px; font-weight: 700; margin: 0; }
    .lc-bio { font-size: 16px; margin: 0; max-width: 320px; text-wrap: balance; line-height: 1.5; }

    /* Links — 실제: gap-3, px-5 py-3.5, border 1px, hover:scale-[1.02] */
    .lc-links { display: flex; flex-direction: column; gap: 12px; width: 100%; }
    .lc-link-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 14px 20px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      backdrop-filter: blur(8px);
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      transition: transform 0.2s, border-color 0.2s;
    }
    .lc-link-btn:hover {
      transform: scale(1.02);
    }
    .lc-link-btn:active {
      transform: scale(0.98);
    }
    .lc-link-emoji { font-size: 18px; flex-shrink: 0; }
    .lc-link-title { flex: 1; }
    .lc-link-arrow { flex-shrink: 0; }

    /* Socials — 실제: gap-4, 아이콘만 w-5 h-5, opacity-70 → hover:opacity-100 */
    .lc-socials {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .lc-social-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .lc-social-icon:hover {
      opacity: 1;
    }

    /* Footer */
    .lc-footer {
      font-size: 12px;
      opacity: 0.5;
      margin-top: 8px;
    }
  `;
}

// ── Main Generator ───────────────────────────────

export function generateLinkCardPreview(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
): string {
  const primaryColor = getVal(state, 'theme', 'primaryColor', '#6366f1');
  const bgStyle = getVal(state, 'theme', 'bgStyle', 'light') as BgStyle;
  const cardStyle = getVal(state, 'theme', 'cardStyle', 'rounded') as CardStyle;
  const fontFamily = getVal(state, 'theme', 'fontFamily', 'system') as FontFamily;

  const theme = buildThemeFromPrimary(primaryColor, bgStyle);
  const activeModules = getActiveModules(state);

  const sectionRenderers: Record<string, () => string> = {
    profile: () => renderProfileSection(state, theme, liveUrl, imageMap),
    links: () => renderLinksSection(state, theme, cardStyle),
    socials: () => renderSocialsSection(state, theme),
    theme: () => '',
  };

  const sections = activeModules
    .map((id) => {
      const render = sectionRenderers[id];
      return render ? render() : '';
    })
    .filter(Boolean)
    .join('');

  const footer = `<div class="lc-footer" style="color:${theme.textMuted}">Powered by Linkmap</div>`;
  const bodyContent = `<div class="lc-container">${sections}${footer}</div>`;
  const baseCss = buildBaseCSS('default');
  const templateCss = buildLinkCardCSS(theme, bgStyle);
  const fullCss = `${baseCss}\n${templateCss}`;
  const fontFamilyValue = getFontFamilyValue(fontFamily);

  return wrapInHtml(fullCss, bodyContent, 'default', fontFamilyValue);
}
