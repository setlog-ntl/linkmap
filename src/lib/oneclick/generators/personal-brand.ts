// ──────────────────────────────────────────────
// Personal Brand Generator
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';
import type { TemplateGenerator, ComponentMapping } from './base-generator';
import {
  esc,
  buildSocialsArray,
  buildGalleryArray,
  createExtractors,
  extractSiteBlock,
  parseArrayConstant,
  parseSocialsFromConfig,
  buildInitialState,
} from './base-generator';

// ─── 배열 빌더 ──────────────────────────────

function buildValuesArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    return `  {
    emoji: '${esc(v.emoji || '✦')}',
    title: '${esc(v.title || '')}',
    ${v.titleEn ? `titleEn: '${esc(v.titleEn)}',` : ''}
    desc: '${esc(v.desc || '')}',
    ${v.descEn ? `descEn: '${esc(v.descEn)}',` : ''}
  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildHighlightsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    return `  { label: '${esc(v.label || '')}', ${v.labelEn ? `labelEn: '${esc(v.labelEn)}', ` : ''}value: '${esc(v.value || '')}', ${v.valueEn ? `valueEn: '${esc(v.valueEn)}', ` : ''}}`;
  });
  return `[\n${entries.join(',\n')}\n]`;
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
  const heroImageUrl = (hero.heroImageUrl as string) || '';
  const gradientFrom = (hero.gradientFrom as string) || '#ee5b2b';
  const gradientTo = (hero.gradientTo as string) || '#f59e0b';
  const parallaxEnabled = hero.parallaxEnabled !== undefined ? !!hero.parallaxEnabled : false;
  const fontFamily = (hero.fontFamily as string) || 'Noto Sans KR';
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
}

const DEMO_VALUES: ValueItem[] = ${buildValuesArray(valuesItems)};

const DEMO_HIGHLIGHTS: HighlightItem[] = ${buildHighlightsArray(highlightsItems)};

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
  heroImageUrl: process.env.NEXT_PUBLIC_HERO_IMAGE_URL || ${heroImageUrl ? `'${esc(heroImageUrl)}'` : 'null'},
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
  const activeModules = state.order.filter((id) => state.enabled.includes(id));
  const imports: string[] = [
    "import { siteConfig } from '@/lib/config';",
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

  return `${imports.join('\n')}

export default function Home() {
  return (
    <>
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
    const galMatch = configContent.match(
      /galleryImages:\s*parseJSON<string\[\]>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/
    );
    if (galMatch) {
      const items: Record<string, string>[] = [];
      const urlRe = /'([^']+)'/g;
      let m;
      while ((m = urlRe.exec(galMatch[1])) !== null) {
        items.push({ url: m[1] });
      }
      if (items.length > 0) state.values.gallery.images = items;
    }
  } catch { /* 기본값 유지 */ }
  const galleryColumns = extractString('galleryColumns');
  if (galleryColumns !== null) state.values.gallery.columns = galleryColumns;

  return state;
}

// ─── Export ──────────────────────────────────

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
