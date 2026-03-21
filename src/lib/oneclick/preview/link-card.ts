import {
  esc,
  resolveImageSrc,
  getVal,
  getArr,
  isEnabled,
  getActiveModules,
  buildBaseCSS,
  wrapInHtml,
  getSocialIconSvg,
  SOCIAL_ICON_MAP,
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
}

type BgStyle = 'light' | 'dark' | 'gradient' | 'solid' | 'mesh' | 'aurora' | 'glass';
type CardStyle = 'rounded' | 'pill' | 'square' | 'glass' | 'neon' | 'outline';
type FontFamily = 'system' | 'serif' | 'mono' | 'display';

// ── Section Renderers ────────────────────────────

function renderProfileSection(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
  isDark: boolean,
): string {
  const name = getVal(state, 'profile', 'name', '');
  const nameEn = getVal(state, 'profile', 'nameEn', '');
  const bio = getVal(state, 'profile', 'bio', '');
  const bioEn = getVal(state, 'profile', 'bioEn', '');
  const avatarUrl = getVal(state, 'profile', 'avatarUrl', '');

  const avatarSrc = resolveImageSrc(avatarUrl, liveUrl, imageMap);
  const avatarHtml = avatarSrc
    ? `<img class="lc-avatar" src="${esc(avatarSrc)}" alt="${esc(name)}" />`
    : `<div class="lc-avatar lc-avatar--placeholder">${esc(name.charAt(0) || '?')}</div>`;

  return `
    <section class="lc-profile">
      ${avatarHtml}
      <h1 class="lc-name${isDark ? ' lc-text-light' : ''}">${esc(name)}</h1>
      ${nameEn ? `<p style="font-size:13px;color:${isDark ? '#9ca3af' : '#999'};margin:0 0 6px;">${esc(nameEn)}</p>` : ''}
      ${bio ? `<p class="lc-bio${isDark ? ' lc-text-light-muted' : ''}">${esc(bio)}</p>` : ''}
      ${bioEn ? `<p class="lc-bio${isDark ? ' lc-text-light-muted' : ''}" style="font-size:12px;margin-top:2px;">${esc(bioEn)}</p>` : ''}
    </section>`;
}

function renderLinksSection(
  state: ModuleConfigState,
  primaryColor: string,
  cardStyle: CardStyle,
  isDark: boolean,
): string {
  const items = getArr(state, 'links', 'items') as LinkItem[];
  if (items.length === 0) return '';

  const buttons = items
    .map((item) => {
      const emojiHtml = item.emoji ? `<span class="lc-link-emoji">${esc(item.emoji)}</span>` : '';
      return `
      <a class="lc-link-btn lc-card--${esc(cardStyle)}${isDark ? ' lc-link-btn--dark' : ''}"
         href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"
         style="--btn-color:${esc(primaryColor)}">
        ${emojiHtml}
        <span class="lc-link-title">${esc(item.title)}</span>
      </a>`;
    })
    .join('');

  return `<section class="lc-links">${buttons}</section>`;
}

function renderSocialsSection(
  state: ModuleConfigState,
  primaryColor: string,
  isDark: boolean,
): string {
  const items = getArr(state, 'socials', 'items') as SocialItem[];
  if (items.length === 0) return '';

  const icons = items
    .map((item) => {
      const iconColor = isDark ? '#d1d5db' : (SOCIAL_ICON_MAP[item.platform]?.color ?? '#555');
      const svg = getSocialIconSvg(item.platform, 18, iconColor);
      const fallback = svg || esc(item.platform);
      return `
      <a class="lc-social-icon${isDark ? ' lc-social-icon--dark' : ''}${svg ? ' lc-social-icon--svg' : ''}"
         href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"
         title="${esc(item.platform)}"
         style="--icon-color:${esc(SOCIAL_ICON_MAP[item.platform]?.color ?? primaryColor)}">
        ${fallback}
      </a>`;
    })
    .join('');

  return `<section class="lc-socials">${icons}</section>`;
}

// ── CSS ──────────────────────────────────────────

function buildBgCSS(bgStyle: BgStyle, primaryColor: string): string {
  switch (bgStyle) {
    case 'dark':
      return 'background:#111827; color:#f9fafb;';
    case 'gradient':
      return `background:linear-gradient(135deg, ${primaryColor}, ${shiftHue(primaryColor, 40)}); color:#fff;`;
    case 'solid':
      return `background:${primaryColor}; color:#fff;`;
    case 'mesh':
      return `background:#f0f2f5;
        background-image:
          radial-gradient(at 20% 30%, ${primaryColor}33 0, transparent 50%),
          radial-gradient(at 80% 70%, ${shiftHue(primaryColor, 60)}33 0, transparent 50%);`;
    case 'aurora':
      return `background:linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, ${primaryColor}88 70%, #0f172a 100%);
        color:#f9fafb;`;
    case 'glass':
      return `background:rgba(255,255,255,.6); backdrop-filter:blur(20px);`;
    case 'light':
    default:
      return 'background:#f8fafc;';
  }
}

/** 간이 hue shift (hex -> hsl 변환 없이 채널 회전) */
function shiftHue(hex: string, deg: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // 간단한 RGB 채널 회전
  const shift = Math.round((deg / 360) * 255);
  const nr = (r + shift) % 256;
  const ng = (g + shift * 2) % 256;
  const nb = (b + shift) % 256;
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

function getCardStyleCSS(cardStyle: CardStyle, primaryColor: string): string {
  const base = `
    .lc-card--rounded { border-radius: 12px; }
    .lc-card--pill { border-radius: 999px; }
    .lc-card--square { border-radius: 0; }
  `;
  const glass = `
    .lc-card--glass {
      border-radius: 12px;
      background: rgba(255,255,255,.15);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,.2);
    }
  `;
  const neon = `
    .lc-card--neon {
      border-radius: 12px;
      box-shadow: 0 0 8px ${primaryColor}66, 0 0 20px ${primaryColor}33;
      border: 1.5px solid ${primaryColor};
    }
  `;
  const outline = `
    .lc-card--outline {
      border-radius: 12px;
      border: 2.5px solid ${primaryColor};
      background: transparent;
    }
  `;
  return `${base}\n${glass}\n${neon}\n${outline}`;
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
      return "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif";
  }
}

function buildLinkCardCSS(
  primaryColor: string,
  bgStyle: BgStyle,
  cardStyle: CardStyle,
  fontFamily: FontFamily,
): string {
  const isDark = bgStyle === 'dark' || bgStyle === 'aurora';

  return `
    :root { --lc-primary: ${primaryColor}; }

    body {
      ${buildBgCSS(bgStyle, primaryColor)}
      display: flex;
      justify-content: center;
      min-height: 100vh;
      padding: 40px 16px;
    }

    .lc-container {
      max-width: 480px;
      width: 100%;
    }

    /* Profile */
    .lc-profile { text-align: center; margin-bottom: 28px; }
    .lc-avatar {
      width: 88px; height: 88px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 14px;
      display: block;
      border: 3px solid var(--lc-primary);
    }
    .lc-avatar--placeholder {
      background: var(--lc-primary);
      color: #fff;
      font-size: 32px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lc-name { font-size: 22px; font-weight: 700; margin: 0 0 6px; color: #111; }
    .lc-bio { font-size: 14px; color: #666; margin: 0; line-height: 1.5; }
    .lc-text-light { color: #f9fafb; }
    .lc-text-light-muted { color: #d1d5db; }

    /* Links */
    .lc-links { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
    .lc-link-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 14px 20px;
      background: #fff;
      color: #333;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      border: 1.5px solid #e5e7eb;
      transition: transform .15s, box-shadow .15s, border-color .15s;
    }
    .lc-link-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,.1);
      border-color: var(--btn-color);
    }
    .lc-link-btn--dark {
      background: rgba(255,255,255,.08);
      color: #f9fafb;
      border-color: rgba(255,255,255,.15);
    }
    .lc-link-btn--dark:hover {
      background: rgba(255,255,255,.15);
      border-color: var(--btn-color);
    }
    .lc-link-emoji { font-size: 18px; }
    .lc-link-title { flex: 1; text-align: center; }

    /* Socials */
    .lc-socials {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      padding-top: 8px;
    }
    .lc-social-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px; height: 40px;
      border-radius: 50%;
      background: #fff;
      color: #555;
      font-size: 11px;
      font-weight: 600;
      text-decoration: none;
      text-transform: capitalize;
      border: 1.5px solid #e5e7eb;
      transition: border-color .2s, transform .2s, box-shadow .2s;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .lc-social-icon--svg {
      font-size: 0;
    }
    .lc-social-icon:hover {
      border-color: var(--icon-color);
      color: var(--icon-color);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,.1);
    }
    .lc-social-icon--dark {
      background: rgba(255,255,255,.08);
      color: #d1d5db;
      border-color: rgba(255,255,255,.15);
    }
    .lc-social-icon--dark:hover {
      border-color: var(--icon-color);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,.3);
    }

    ${getCardStyleCSS(cardStyle, primaryColor)}
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
  const isDark = bgStyle === 'dark' || bgStyle === 'aurora';

  const activeModules = getActiveModules(state);

  const sectionRenderers: Record<string, () => string> = {
    profile: () => renderProfileSection(state, liveUrl, imageMap, isDark),
    links: () => renderLinksSection(state, primaryColor, cardStyle, isDark),
    socials: () => renderSocialsSection(state, primaryColor, isDark),
    theme: () => '', // theme 모듈은 시각 섹션이 아님
  };

  const sections = activeModules
    .map((id) => {
      const render = sectionRenderers[id];
      return render ? render() : '';
    })
    .filter(Boolean)
    .join('');

  const bodyContent = `<div class="lc-container">${sections}</div>`;
  const baseCss = buildBaseCSS('default');
  const templateCss = buildLinkCardCSS(primaryColor, bgStyle, cardStyle, fontFamily);
  const fullCss = `${baseCss}\n${templateCss}`;
  const fontFamilyValue = getFontFamilyValue(fontFamily);

  return wrapInHtml(fullCss, bodyContent, 'default', fontFamilyValue);
}
