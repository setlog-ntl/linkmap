// ──────────────────────────────────────────────
// Link Card Generator
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';
import type { TemplateGenerator, ComponentMapping } from './base-generator';
import {
  esc,
  buildSocialsArray,
  normalizeImagePath,
  genBasePathConst,
  imagePathExpr,
  createExtractors,
  extractSiteBlock,
  parseArrayConstant,
  parseSocialsFromConfig,
  buildInitialState,
} from './base-generator';

// ─── 프리셋 CSS 생성 ────────────────────────

function hexToRgbStr(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

/** hue를 약간 이동시켜 보조 색상 생성 (프리뷰의 shiftHue와 동일) */
function shiftHue(hex: string, deg: number): string {
  const h = hex.replace('#', '');
  let r = parseInt(h.substring(0, 2), 16) / 255;
  let g = parseInt(h.substring(2, 4), 16) / 255;
  let b = parseInt(h.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let hue = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) hue = ((b - r) / d + 2) / 6;
    else hue = ((r - g) / d + 4) / 6;
  }
  hue = ((hue * 360 + deg) % 360) / 360;
  function hue2rgb(p: number, q: number, t: number) {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }
  if (s === 0) { r = g = b = l; } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, hue + 1/3);
    g = hue2rgb(p, q, hue);
    b = hue2rgb(p, q, hue - 1/3);
  }
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateLinkCardPresetCss(
  primaryColor: string,
  bgStyle: string,
): string {
  const isDark = ['dark', 'aurora', 'neon'].includes(bgStyle);
  const secondaryColor = shiftHue(primaryColor, 40);

  let css = `/* ── Link Card Theme Override (auto-generated) ── */
:root {
  --lc-primary: ${primaryColor};
  --lc-secondary: ${secondaryColor};
  --lc-primary-rgb: ${hexToRgbStr(primaryColor)};
  --color-primary: ${primaryColor};`;

  if (isDark) {
    css += `
  --lc-bg-from: #0f172a;
  --lc-bg-to: #1e1b4b;
  --lc-text: #f5f3ff;
  --lc-text-muted: rgba(245,243,255,0.7);
  --lc-card-bg: ${primaryColor}14;
  --lc-card-border: ${primaryColor}33;`;
  } else {
    css += `
  --lc-text: #111827;
  --lc-text-muted: #6b7280;
  --lc-card-bg: rgba(0,0,0,0.04);
  --lc-card-border: rgba(0,0,0,0.08);`;
  }

  css += `\n}\n`;
  return css;
}

// ─── 배열 빌더 ──────────────────────────────

function buildLinksArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    title: '${esc(v.title || '')}',`,
    ];
    if (v.titleEn) lines.push(`    titleEn: '${esc(v.titleEn)}',`);
    lines.push(`    url: '${esc(v.url || '')}',`);
    lines.push(`    icon: '${esc(v.emoji || v.icon || '')}',`);
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

// ─── 모듈 컴포넌트 매핑 ─────────────────────

const MODULE_COMPONENTS: Record<string, ComponentMapping> = {
  profile: {
    importName: 'ProfileSection',
    importPath: '@/components/profile-section',
    render: '        <ProfileSection config={siteConfig} theme={theme} />',
  },
  links: {
    importName: 'LinkList',
    importPath: '@/components/link-list',
    render: '        <LinkList links={siteConfig.links} theme={theme} />',
  },
  socials: {
    importName: 'SocialBar',
    importPath: '@/components/social-bar',
    render: `        {siteConfig.socials.length > 0 && (
          <SocialBar socials={siteConfig.socials} theme={theme} />
        )}`,
  },
  // theme 모듈은 config + getTheme()에만 영향 — 컴포넌트 없음
};

// ─── Config 생성 ─────────────────────────────

function generateConfigTs(state: ModuleConfigState): string {
  const profile = state.values.profile || {};
  const links = state.values.links || {};
  const socials = state.values.socials || {};
  const theme = state.values.theme || {};

  const siteName = (profile.name as string) || '민지 (Minji)';
  const siteNameEn = (profile.nameEn as string) || 'Minji';
  const bio = (profile.bio as string) || '일상을 기록하는 콘텐츠 크리에이터';
  const bioEn = (profile.bioEn as string) || 'Content creator documenting everyday life';
  const avatarUrl = normalizeImagePath((profile.avatarUrl as string) || '');
  const bgStyle = (theme.bgStyle as string) || 'light';
  const primaryColor = (theme.primaryColor as string) || '#6366f1';
  const cardStyle = (theme.cardStyle as string) || 'rounded';
  const fontFamily = (theme.fontFamily as string) || 'system';
  const linkItems = (links.items as unknown[]) || [];
  const socialItems = (socials.items as unknown[]) || [];

  return `export interface LinkItem {
  title: string;
  titleEn?: string;
  url: string;
  icon?: string;
}

export interface SocialItem {
  platform: string;
  url: string;
  label?: string;
}

/** 배경 스타일: light | gradient | solid | mesh | aurora | glass | dark */
export type BgStyle = 'light' | 'gradient' | 'solid' | 'mesh' | 'aurora' | 'glass' | 'dark';
/** 카드 스타일: rounded | pill | square | glass | neon | outline */
export type CardStyle = 'rounded' | 'pill' | 'square' | 'glass' | 'neon' | 'outline';
/** 폰트 패밀리: system | serif | mono | display */
export type FontFamily = 'system' | 'serif' | 'mono' | 'display';

const DEMO_LINKS: LinkItem[] = ${buildLinksArray(linkItems)};

${genBasePathConst()}

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || '${esc(siteName)}',
  siteNameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || '${esc(siteNameEn)}',
  bio: process.env.NEXT_PUBLIC_BIO || '${esc(bio)}',
  bioEn: process.env.NEXT_PUBLIC_BIO_EN || '${esc(bioEn)}',
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || ${avatarUrl ? imagePathExpr(avatarUrl) : 'null'},
  theme: process.env.NEXT_PUBLIC_THEME || '${esc(bgStyle)}',
  bgStyle: (process.env.NEXT_PUBLIC_BG_STYLE || '${esc(bgStyle)}') as BgStyle,
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '${esc(primaryColor)}',
  cardStyle: (process.env.NEXT_PUBLIC_CARD_STYLE || '${esc(cardStyle)}') as CardStyle,
  fontFamily: (process.env.NEXT_PUBLIC_FONT_FAMILY || '${esc(fontFamily)}') as FontFamily,
  links: parseJSON<LinkItem[]>(process.env.NEXT_PUBLIC_LINKS, DEMO_LINKS),
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, ${buildSocialsArray(socialItems)}),
  youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || null,
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;
}

// ─── Page 생성 ───────────────────────────────

function generatePageTsx(state: ModuleConfigState): string {
  const activeModules = state.order.filter((id) => state.enabled.includes(id));

  const imports: string[] = [
    "import { siteConfig } from '@/lib/config';",
    "import '@/app/preset-override.css';",
    "import { getTheme, getBackground } from '@/lib/themes';",
  ];
  const renders: string[] = [];

  for (const id of activeModules) {
    const comp = MODULE_COMPONENTS[id];
    if (!comp) continue; // theme 등 컴포넌트 없는 모듈 스킵
    imports.push(`import { ${comp.importName} } from '${comp.importPath}';`);
    renders.push(comp.render);
  }

  // youtubeUrl 임베드는 항상 포함 (config에 값이 있을 때만 렌더)
  imports.push("import { ContentEmbed } from '@/components/content-embed';");
  renders.push(`        {siteConfig.youtubeUrl && (
          <ContentEmbed youtubeUrl={siteConfig.youtubeUrl} />
        )}`);

  imports.push("import { Footer } from '@/components/footer';");

  return `${imports.join('\n')}

function getFontClass(fontFamily: string): string {
  switch (fontFamily) {
    case 'serif': return 'font-serif';
    case 'mono': return 'font-mono';
    case 'display': return 'font-display';
    default: return 'font-sans';
  }
}

export default function Home() {
  const theme = getTheme(siteConfig.theme);
  const bgStyle = siteConfig.bgStyle || 'light';
  const fontClass = getFontClass(siteConfig.fontFamily || 'system');
  const isAnimated = bgStyle === 'gradient' || bgStyle === 'aurora';
  const isDark = bgStyle === 'dark';

  return (
    <main id="main"
      className={\`min-h-screen flex flex-col items-center justify-center p-4 \${fontClass}\${isAnimated ? ' animate-gradient' : ''}\${isDark ? ' dark' : ''}\`}
      style={getBackground(theme, bgStyle)}
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 py-12">
${renders.join('\n')}
        <Footer theme={theme} />
      </div>
    </main>
  );
}
`;
}

// ─── Config 파싱 ─────────────────────────────

function parseConfigToState(
  configContent: string,
  schema: TemplateModuleSchema
): ModuleConfigState {
  const state = buildInitialState(schema);
  const siteBlock = extractSiteBlock(configContent);
  const { extractString, extractNullable } = createExtractors(siteBlock);

  // Profile
  const siteName = extractString('siteName');
  if (siteName !== null) state.values.profile.name = siteName;
  const siteNameEn = extractString('siteNameEn');
  if (siteNameEn !== null) state.values.profile.nameEn = siteNameEn;
  const bio = extractString('bio');
  if (bio !== null) state.values.profile.bio = bio;
  const bioEn = extractString('bioEn');
  if (bioEn !== null) state.values.profile.bioEn = bioEn;
  const avatarUrl = extractNullable('avatarUrl');
  if (avatarUrl !== null) state.values.profile.avatarUrl = avatarUrl;

  // Links — DEMO_LINKS 배열에서 파싱
  try {
    const items = parseArrayConstant(
      configContent,
      /const DEMO_LINKS:.*?=\s*(\[[\s\S]*?\n\]);/,
      'title'
    );
    if (items.length > 0) {
      state.values.links.items = items.map((obj) => ({
        title: obj.title || '',
        titleEn: obj.titleEn || '',
        url: obj.url || '',
        emoji: obj.icon || '',
      }));
    }
  } catch { /* 기본값 유지 */ }

  // Socials
  try {
    const items = parseSocialsFromConfig(configContent);
    if (items.length > 0) state.values.socials.items = items;
  } catch { /* 기본값 유지 */ }

  // Theme
  const themeVal = extractString('theme');
  if (themeVal !== null) state.values.theme.bgStyle = themeVal;
  // bgStyle 환경변수 직접 저장 값 우선 복원
  const bgStyleVal = extractString('bgStyle');
  if (bgStyleVal !== null) state.values.theme.bgStyle = bgStyleVal;
  const primaryColor = extractString('primaryColor');
  if (primaryColor !== null) state.values.theme.primaryColor = primaryColor;
  const cardStyle = extractString('cardStyle');
  if (cardStyle !== null) state.values.theme.cardStyle = cardStyle;
  const fontFamily = extractString('fontFamily');
  if (fontFamily !== null) state.values.theme.fontFamily = fontFamily;

  return state;
}

// ─── Export ──────────────────────────────────

export const linkCardGenerator: TemplateGenerator = {
  slug: 'link-card',
  generateConfigTs,
  generatePageTsx,
  parseConfigToState,
  moduleComponents: MODULE_COMPONENTS,
  importToModuleMap: {
    ProfileSection: 'profile',
    LinkList: 'links',
    SocialBar: 'socials',
  },
};
