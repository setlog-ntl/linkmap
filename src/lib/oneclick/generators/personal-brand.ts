// ──────────────────────────────────────────────
// Personal Brand Generator
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';
import type { TemplateGenerator, ComponentMapping } from './base-generator';
import {
  esc,
  buildSocialsArray,
  buildGalleryArray,
  normalizeImagePath,
  genBasePathConst,
  imagePathExpr,
  createExtractors,
  extractSiteBlock,
  parseArrayConstant,
  parseSocialsFromConfig,
  parseGalleryFromConfig,
  buildInitialState,
} from './base-generator';

// ─── 배열 빌더 ──────────────────────────────

function buildValuesArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines = [
      `    emoji: '${esc(v.emoji || '✦')}',`,
      `    title: '${esc(v.title || '')}',`,
      ...(v.titleEn ? [`    titleEn: '${esc(v.titleEn)}',`] : []),
      `    desc: '${esc(v.desc || '')}',`,
      ...(v.descEn ? [`    descEn: '${esc(v.descEn)}',`] : []),
    ];
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildHighlightsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const fields = [
      `label: '${esc(v.label || '')}'`,
      ...(v.labelEn ? [`labelEn: '${esc(v.labelEn)}'`] : []),
      `value: '${esc(v.value || '')}'`,
      ...(v.valueEn ? [`valueEn: '${esc(v.valueEn)}'`] : []),
    ];
    return `  { ${fields.join(', ')} }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

// ─── 프리셋 CSS 생성 ────────────────────────

interface PresetThemeVars {
  bg?: string;
  bgAlt?: string;
  textPrimary?: string;
  textSecondary?: string;
  surfaceElevated?: string;
  surfaceBorder?: string;
  brandGlow?: string;
}

const PRESET_THEME: Record<string, PresetThemeVars> = {
  midnight: {
    bg: '#0f0f0f', bgAlt: '#171717',
    textPrimary: '#f0f0f0', textSecondary: '#a0a0a0',
    surfaceElevated: '#1a1a1a', surfaceBorder: '#2a2a2a',
  },
  terminal: {
    bg: '#0a0a0a', bgAlt: '#111111',
    textPrimary: '#e2e8f0', textSecondary: '#94a3b8',
    surfaceElevated: '#1a1a1a', surfaceBorder: '#1e293b',
  },
  'warm-earth': {
    bg: '#fefce8', bgAlt: '#fef3c7',
    surfaceBorder: '#fde68a',
  },
};

function hexToRgbStr(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function generatePresetCss(
  designPreset: string,
  gradientFrom: string,
  gradientTo: string,
): string {
  const theme = PRESET_THEME[designPreset];
  const isDark = designPreset === 'midnight' || designPreset === 'terminal';

  // html[data-preset] 셀렉터: specificity (0,0,1,1) → globals.css의 :root (0,0,1,0)
  // 및 [data-preset="x"] (0,0,1,0) 보다 높아 항상 우선 적용
  let css = `/* ── Preset Override (auto-generated) ── */
html[data-preset] {
  --brand-primary: ${gradientFrom};
  --brand-secondary: ${gradientTo};
  --brand-glow: rgba(${hexToRgbStr(gradientFrom)}, 0.15);
  --brand-gradient: linear-gradient(135deg, ${gradientFrom}, ${gradientTo});
  --color-primary: ${gradientFrom};
  --color-secondary: ${gradientTo};`;

  if (theme) {
    if (theme.bg) css += `\n  --bg: ${theme.bg};`;
    if (theme.bgAlt) css += `\n  --bg-alt: ${theme.bgAlt};`;
    if (theme.textPrimary) css += `\n  --text-primary: ${theme.textPrimary};`;
    if (theme.textSecondary) css += `\n  --text-secondary: ${theme.textSecondary};`;
    if (theme.surfaceElevated) css += `\n  --surface-elevated: ${theme.surfaceElevated};`;
    if (theme.surfaceBorder) css += `\n  --surface-border: ${theme.surfaceBorder};`;
  }

  if (isDark) {
    css += `\n  --shadow-card: 0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2);`;
    css += `\n  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3);`;
    css += `\n  --shadow-lg: 0 12px 40px rgba(0,0,0,.5);`;
  }

  css += `\n}\n`;
  return css;
}

// ─── 모듈 컴포넌트 매핑 ─────────────────────

const MODULE_COMPONENTS: Record<string, ComponentMapping> = {
  hero: {
    importName: 'HeroSection',
    importPath: '@/components/hero-section',
    render: '        <HeroSection config={siteConfig} />',
  },
  about: {
    importName: 'AboutSection',
    importPath: '@/components/about-section',
    render: '        <AboutSection config={siteConfig} />',
  },
  values: {
    importName: 'ValuesSection',
    importPath: '@/components/values-section',
    render: '        <ValuesSection values={siteConfig.values} />',
  },
  highlights: {
    importName: 'HighlightsSection',
    importPath: '@/components/highlights-section',
    render: '        <HighlightsSection highlights={siteConfig.highlights} />',
  },
  gallery: {
    importName: 'GallerySection',
    importPath: '@/components/gallery-section',
    render: `        {siteConfig.galleryImages.length > 0 && (
          <GallerySection images={siteConfig.galleryImages} />
        )}`,
  },
  contact: {
    importName: 'ContactSection',
    importPath: '@/components/contact-section',
    render: '        <ContactSection config={siteConfig} />',
  },
};

// ─── Config 생성 ─────────────────────────────

function generateConfigTs(state: ModuleConfigState): string {
  const hero = state.values.hero || {};
  const about = state.values.about || {};
  const values = state.values.values || {};
  const highlights = state.values.highlights || {};
  const gallery = state.values.gallery || {};
  const contact = state.values.contact || {};

  const name = (hero.name as string) || '이지원';
  const nameEn = (hero.nameEn as string) || 'Jiwon Lee';
  const tagline = (hero.tagline as string) || '콘텐츠로 세상을 연결하는 크리에이터';
  const taglineEn = (hero.taglineEn as string) || 'Creator who connects the world through content';
  const heroImageUrl = normalizeImagePath((hero.heroImageUrl as string) || '');
  const gradientFrom = (hero.gradientFrom as string) || '#ee5b2b';
  const gradientTo = (hero.gradientTo as string) || '#f59e0b';
  const parallaxEnabled = hero.parallaxEnabled !== undefined ? !!hero.parallaxEnabled : true;
  const fontFamily = (hero.fontFamily as string) || 'Pretendard';
  const designPreset = (hero.designPreset as string) || 'creator';
  const story = (about.story as string) || '';
  const storyEn = (about.storyEn as string) || '';
  const email = (contact.email as string) || 'hello@example.com';
  const galleryColumns = (gallery.columns as string) || '3';

  const valuesItems = (values.items as unknown[]) || [];
  const highlightsItems = (highlights.items as unknown[]) || [];
  const galleryImages = (gallery.images as unknown[]) || [];
  const socials = (contact.socials as unknown[]) || [];

  return `export interface ValueItem {
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

const DEMO_VALUES: ValueItem[] = ${buildValuesArray(valuesItems)};

const DEMO_HIGHLIGHTS: HighlightItem[] = ${buildHighlightsArray(highlightsItems)};

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
  name: process.env.NEXT_PUBLIC_SITE_NAME || '${esc(name)}',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || '${esc(nameEn)}',
  tagline: process.env.NEXT_PUBLIC_TAGLINE || '${esc(tagline)}',
  taglineEn: process.env.NEXT_PUBLIC_TAGLINE_EN || '${esc(taglineEn)}',
  heroImageUrl: process.env.NEXT_PUBLIC_HERO_IMAGE_URL || ${heroImageUrl ? imagePathExpr(heroImageUrl) : 'null'},
  story:
    process.env.NEXT_PUBLIC_STORY ||
    '${esc(story)}',
  storyEn:
    process.env.NEXT_PUBLIC_STORY_EN ||
    '${esc(storyEn)}',
  values: parseJSON<ValueItem[]>(process.env.NEXT_PUBLIC_VALUES, DEMO_VALUES),
  highlights: parseJSON<HighlightItem[]>(process.env.NEXT_PUBLIC_HIGHLIGHTS, DEMO_HIGHLIGHTS),
  galleryImages: parseJSON<string[]>(process.env.NEXT_PUBLIC_GALLERY_IMAGES, ${buildGalleryArray(galleryImages)}),
  email: process.env.NEXT_PUBLIC_EMAIL || '${esc(email)}',
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, ${buildSocialsArray(socials)}),
  gradientFrom: '${esc(gradientFrom)}',
  gradientTo: '${esc(gradientTo)}',
  parallaxEnabled: ${parallaxEnabled},
  fontFamily: '${esc(fontFamily)}',
  galleryColumns: '${esc(galleryColumns)}',
  designPreset: '${esc(designPreset)}',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;
}

// ─── Page 생성 ───────────────────────────────

function generatePageTsx(state: ModuleConfigState): string {
  const hero = state.values.hero || {};
  const designPreset = (hero.designPreset as string) || 'creator';

  const activeModules = state.order.filter((id) => state.enabled.includes(id));
  const imports: string[] = [
    "import { siteConfig } from '@/lib/config';",
    "import '@/app/preset-override.css';",
    "import { NavHeader } from '@/components/nav-header';",
  ];
  const renders: string[] = [];

  for (const id of activeModules) {
    const comp = MODULE_COMPONENTS[id];
    if (!comp) continue;
    imports.push(`import { ${comp.importName} } from '${comp.importPath}';`);
    renders.push(comp.render);
  }

  imports.push("import { Footer } from '@/components/footer';");

  // data-preset 동기화 스크립트: 구형 layout.tsx에 data-preset이 없는 경우 대비
  const presetSync = `
function PresetSync() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: "document.documentElement.setAttribute('data-preset','" + (siteConfig.designPreset || '${esc(designPreset)}') + "')"
      }}
    />
  );
}`;

  return `${imports.join('\n')}
${presetSync}

export default function Home() {
  return (
    <>
      <PresetSync />
      <NavHeader />
      <main id="main">
${renders.join('\n')}
      </main>
      <Footer />
    </>
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

  // Hero
  const name = extractString('name');
  if (name !== null) state.values.hero.name = name;
  const nameEn = extractString('nameEn');
  if (nameEn !== null) state.values.hero.nameEn = nameEn;
  const tagline = extractString('tagline');
  if (tagline !== null) state.values.hero.tagline = tagline;
  const taglineEn = extractString('taglineEn');
  if (taglineEn !== null) state.values.hero.taglineEn = taglineEn;
  const heroImg = extractNullable('heroImageUrl');
  if (heroImg !== null) state.values.hero.heroImageUrl = heroImg;
  const gradientFrom = extractString('gradientFrom');
  if (gradientFrom !== null) state.values.hero.gradientFrom = gradientFrom;
  const gradientTo = extractString('gradientTo');
  if (gradientTo !== null) state.values.hero.gradientTo = gradientTo;
  const parallaxMatch = configContent.match(/parallaxEnabled:\s*(true|false)/);
  if (parallaxMatch) state.values.hero.parallaxEnabled = parallaxMatch[1] === 'true';
  const fontFamily = extractString('fontFamily');
  if (fontFamily !== null) state.values.hero.fontFamily = fontFamily;
  const designPreset = extractString('designPreset');
  if (designPreset !== null) state.values.hero.designPreset = designPreset;

  // About
  const story = extractString('story');
  if (story !== null) state.values.about.story = story;
  const storyEn = extractString('storyEn');
  if (storyEn !== null) state.values.about.storyEn = storyEn;

  // Contact
  const email = extractString('email');
  if (email !== null) state.values.contact.email = email;

  // Values
  try {
    const items = parseArrayConstant(configContent, /const DEMO_VALUES:.*?=\s*(\[[\s\S]*?\n\]);/, 'title');
    if (items.length > 0) state.values.values.items = items;
  } catch { /* 기본값 유지 */ }

  // Highlights
  try {
    const items = parseArrayConstant(configContent, /const DEMO_HIGHLIGHTS:.*?=\s*(\[[\s\S]*?\n\]);/, 'value');
    if (items.length > 0) state.values.highlights.items = items;
  } catch { /* 기본값 유지 */ }

  // Socials
  try {
    const items = parseSocialsFromConfig(configContent);
    if (items.length > 0) state.values.contact.socials = items;
  } catch { /* 기본값 유지 */ }

  // Gallery images
  try {
    const galleryItems = parseGalleryFromConfig(configContent);
    if (galleryItems.length > 0) state.values.gallery.images = galleryItems;
  } catch { /* 기본값 유지 */ }
  const galleryColumns = extractString('galleryColumns');
  if (galleryColumns !== null) state.values.gallery.columns = galleryColumns;

  return state;
}

// ─── Export ──────────────────────────────────

export { generatePresetCss };

export const personalBrandGenerator: TemplateGenerator = {
  slug: 'personal-brand',
  generateConfigTs,
  generatePageTsx,
  parseConfigToState,
  moduleComponents: MODULE_COMPONENTS,
  importToModuleMap: {
    HeroSection: 'hero',
    AboutSection: 'about',
    ValuesSection: 'values',
    HighlightsSection: 'highlights',
    GallerySection: 'gallery',
    ContactSection: 'contact',
  },
};
