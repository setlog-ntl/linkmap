// ──────────────────────────────────────────────
// Code Generator — 모듈 설정 → 코드 생성 순수 함수
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';

/** 문자열 내 작은따옴표 이스케이프 */
function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** JSON.stringify with 2-space indent, 작은따옴표 없음 */
function jsonBlock(val: unknown): string {
  return JSON.stringify(val, null, 2);
}

// ──────────────────────────────────────────────
// config.ts 생성
// ──────────────────────────────────────────────

interface ConfigGenInput {
  hero: Record<string, unknown>;
  about: Record<string, unknown>;
  values: Record<string, unknown>;
  highlights: Record<string, unknown>;
  gallery: Record<string, unknown>;
  contact: Record<string, unknown>;
  enabled: string[];
}

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

function buildSocialsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    return `  { platform: '${esc(v.platform || '')}', url: '${esc(v.url || '')}' }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildGalleryArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const urls = items.map((item) => {
    const v = item as Record<string, string>;
    return `  '${esc(v.url || v as unknown as string)}'`;
  });
  return `[\n${urls.join(',\n')}\n]`;
}

export function generateConfigTs(state: ModuleConfigState): string {
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
  const story = (about.story as string) || '';
  const storyEn = (about.storyEn as string) || '';
  const email = (contact.email as string) || 'hello@example.com';

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
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;
}

// ──────────────────────────────────────────────
// page.tsx 생성
// ──────────────────────────────────────────────

/** 모듈 ID → import/렌더 매핑 */
const MODULE_COMPONENTS: Record<
  string,
  { importName: string; importPath: string; render: string }
> = {
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

export function generatePageTsx(state: ModuleConfigState): string {
  const activeModules = state.order.filter((id) => state.enabled.includes(id));

  const imports: string[] = [
    "import { siteConfig } from '@/lib/config';",
    "import { NavHeader } from '@/components/nav-header';",
  ];
  const renders: string[] = [];

  for (const id of activeModules) {
    const comp = MODULE_COMPONENTS[id];
    if (!comp) continue;
    imports.push(
      `import { ${comp.importName} } from '${comp.importPath}';`
    );
    renders.push(comp.render);
  }

  imports.push("import { Footer } from '@/components/footer';");

  return `${imports.join('\n')}

export default function Home() {
  return (
    <>
      <NavHeader />
      <main>
${renders.join('\n')}
      </main>
      <Footer />
    </>
  );
}
`;
}

// ──────────────────────────────────────────────
// Phase 2: 컴포넌트 수준 코드 생성기
// ──────────────────────────────────────────────

/** Hero 컴포넌트의 그래디언트 색상 치환 */
export function generateHeroSection(
  state: ModuleConfigState,
  baseCode: string
): string {
  const hero = state.values.hero || {};
  const from = (hero.gradientFrom as string) || '#ee5b2b';
  const to = (hero.gradientTo as string) || '#f59e0b';

  let code = baseCode;
  // Tailwind 클래스 내 색상 치환: from-[#xxxxxx] → from-[#newColor]
  code = code.replace(/from-\[#[a-fA-F0-9]{6}\]/g, `from-[${from}]`);
  code = code.replace(/to-\[#[a-fA-F0-9]{6}\]/g, `to-[${to}]`);
  // inline gradient 치환: linear-gradient(..., #old1, #old2)
  code = code.replace(
    /linear-gradient\(90deg,\s*#[a-fA-F0-9]{6},\s*#[a-fA-F0-9]{6}\)/g,
    `linear-gradient(90deg, ${from}, ${to})`
  );
  // from-[#xxx]/10 패턴 (반투명 배경)
  code = code.replace(
    /from-\[#[a-fA-F0-9]{6}\]\/10/g,
    `from-[${from}]/10`
  );
  return code;
}

/** Values 컴포넌트의 컬럼 수 치환 */
export function generateValuesSection(
  state: ModuleConfigState,
  baseCode: string
): string {
  const values = state.values.values || {};
  const cols = (values.columns as string) || '3';

  let code = baseCode;
  // md:grid-cols-X 치환
  code = code.replace(/md:grid-cols-\d/g, `md:grid-cols-${cols}`);
  return code;
}

/** Gallery 컴포넌트의 컬럼 수 치환 */
export function generateGallerySection(
  state: ModuleConfigState,
  baseCode: string
): string {
  const gallery = state.values.gallery || {};
  const cols = (gallery.columns as string) || '3';

  let code = baseCode;
  // lg:grid-cols-X 치환
  code = code.replace(/lg:grid-cols-\d/g, `lg:grid-cols-${cols}`);
  return code;
}

/** globals.css 내 primary 색상 변수 치환 */
export function generateGlobalsCss(
  state: ModuleConfigState,
  baseCode: string
): string {
  const hero = state.values.hero || {};
  const from = (hero.gradientFrom as string) || '#ee5b2b';

  return baseCode.replace(
    /--color-primary:\s*#[a-fA-F0-9]{6}/g,
    `--color-primary: ${from}`
  );
}

/** layout.tsx 내 Google Fonts CDN 링크와 font-family 치환 */
export function generateLayoutTsx(
  state: ModuleConfigState,
  baseCode: string
): string {
  const hero = state.values.hero || {};
  const font = (hero.fontFamily as string) || 'Pretendard';
  if (font === 'Pretendard') return baseCode; // 기본값이면 변경 불필요

  let code = baseCode;

  // Google Fonts CDN 링크 교체/추가
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
  const linkTag = `<link rel="stylesheet" href="${googleFontUrl}" />`;

  // 기존 google fonts link 교체
  const existingFontLink = /(<link[^>]*fonts\.googleapis\.com[^>]*\/>)/;
  if (existingFontLink.test(code)) {
    code = code.replace(existingFontLink, linkTag);
  } else if (code.includes('</head>')) {
    code = code.replace('</head>', `    ${linkTag}\n  </head>`);
  }

  // font-family CSS 또는 Tailwind 변수 치환
  code = code.replace(
    /fontFamily:\s*['"][^'"]+['"]/g,
    `fontFamily: '${font}'`
  );
  code = code.replace(
    /font-family:\s*[^;]+;/g,
    `font-family: '${font}', sans-serif;`
  );

  return code;
}

// ──────────────────────────────────────────────
// 종합: 변경된 파일 목록 생성
// ──────────────────────────────────────────────

export interface GeneratedFile {
  path: string;
  content: string;
}

/**
 * 모듈 설정에서 변경된 파일 목록을 생성합니다.
 * @param state 현재 모듈 설정 상태
 * @param currentFiles 기존 파일 내용 캐시 (Phase 2 컴포넌트 수준 편집용)
 */
export function generateFiles(
  state: ModuleConfigState,
  currentFiles?: Record<string, string>
): GeneratedFile[] {
  const files: GeneratedFile[] = [
    { path: 'src/lib/config.ts', content: generateConfigTs(state) },
    { path: 'src/app/page.tsx', content: generatePageTsx(state) },
  ];

  // Phase 2: 컴포넌트 파일 변경
  if (currentFiles) {
    const hero = state.values.hero || {};
    const values = state.values.values || {};
    const gallery = state.values.gallery || {};

    // Hero: 그래디언트 색상이 기본값과 다르면 생성
    if (hero.gradientFrom && hero.gradientFrom !== '#ee5b2b' ||
        hero.gradientTo && hero.gradientTo !== '#f59e0b') {
      const heroBase = currentFiles['src/components/hero-section.tsx'];
      if (heroBase) {
        files.push({
          path: 'src/components/hero-section.tsx',
          content: generateHeroSection(state, heroBase),
        });
      }

      // globals.css도 primary 색상 변경
      const cssBase = currentFiles['src/app/globals.css'];
      if (cssBase) {
        files.push({
          path: 'src/app/globals.css',
          content: generateGlobalsCss(state, cssBase),
        });
      }
    }

    // Values: 컬럼 수가 기본값(3)과 다르면 생성
    if (values.columns && values.columns !== '3') {
      const valuesBase = currentFiles['src/components/values-section.tsx'];
      if (valuesBase) {
        files.push({
          path: 'src/components/values-section.tsx',
          content: generateValuesSection(state, valuesBase),
        });
      }
    }

    // Gallery: 컬럼 수가 기본값(3)과 다르면 생성
    if (gallery.columns && gallery.columns !== '3') {
      const galleryBase = currentFiles['src/components/gallery-section.tsx'];
      if (galleryBase) {
        files.push({
          path: 'src/components/gallery-section.tsx',
          content: generateGallerySection(state, galleryBase),
        });
      }
    }

    // Layout: 폰트가 기본값(Pretendard)과 다르면 생성
    const fontFamily = (hero.fontFamily as string) || 'Pretendard';
    if (fontFamily !== 'Pretendard') {
      const layoutBase = currentFiles['src/app/layout.tsx'];
      if (layoutBase) {
        files.push({
          path: 'src/app/layout.tsx',
          content: generateLayoutTsx(state, layoutBase),
        });
      }
    }
  }

  return files;
}

// ──────────────────────────────────────────────
// 스키마에서 초기 상태 추출
// ──────────────────────────────────────────────

export function buildInitialState(
  schema: TemplateModuleSchema
): ModuleConfigState {
  const values: Record<string, Record<string, unknown>> = {};
  const enabled: string[] = [];

  for (const mod of schema.modules) {
    const modValues: Record<string, unknown> = {};
    for (const field of mod.fields) {
      modValues[field.key] = field.defaultValue;
    }
    values[mod.id] = modValues;
    if (mod.defaultEnabled) {
      enabled.push(mod.id);
    }
  }

  return {
    values,
    enabled,
    order: [...schema.defaultOrder],
  };
}

/**
 * 배포된 config.ts 파일에서 현재 값을 파싱하여 ModuleConfigState 구축.
 * 정규식 기반으로 간단히 추출 (정확한 AST 파싱 대신 실용적 접근).
 */
export function parseConfigToState(
  configContent: string,
  schema: TemplateModuleSchema
): ModuleConfigState {
  const state = buildInitialState(schema);

  // siteConfig 블록에서 값 추출
  const extractString = (key: string): string | null => {
    // pattern: key: process.env.XXX || 'value',  OR  key: 'value',
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?'([^']*)'`
    );
    const m = configContent.match(re);
    return m ? m[1] : null;
  };

  const extractNullable = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?(?:'([^']*)'|null)`
    );
    const m = configContent.match(re);
    return m ? m[1] ?? '' : null;
  };

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

  // About
  const story = extractString('story');
  if (story !== null) state.values.about.story = story;
  const storyEn = extractString('storyEn');
  if (storyEn !== null) state.values.about.storyEn = storyEn;

  // Contact
  const email = extractString('email');
  if (email !== null) state.values.contact.email = email;

  // Values — DEMO_VALUES 배열에서 파싱
  try {
    const valuesMatch = configContent.match(
      /const DEMO_VALUES:.*?=\s*(\[[\s\S]*?\n\]);/
    );
    if (valuesMatch) {
      // 간이 파싱: 각 객체 블록 추출
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(valuesMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.title) items.push(obj);
      }
      if (items.length > 0) state.values.values.items = items;
    }
  } catch {
    // 파싱 실패 시 기본값 유지
  }

  // Highlights
  try {
    const hlMatch = configContent.match(
      /const DEMO_HIGHLIGHTS:.*?=\s*(\[[\s\S]*?\n\]);/
    );
    if (hlMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(hlMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.value) items.push(obj);
      }
      if (items.length > 0) state.values.highlights.items = items;
    }
  } catch {
    // 파싱 실패 시 기본값 유지
  }

  // Socials
  try {
    const socialsMatch = configContent.match(
      /socials:\s*parseJSON<SocialItem\[\]>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/
    );
    if (socialsMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(socialsMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.platform) items.push(obj);
      }
      if (items.length > 0) state.values.contact.socials = items;
    }
  } catch {
    // 파싱 실패 시 기본값 유지
  }

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
  } catch {
    // 기본값 유지
  }

  return state;
}

/**
 * 배포된 page.tsx에서 활성 모듈과 순서를 파싱.
 */
export function parsePageToEnabledModules(
  pageContent: string
): { enabled: string[]; order: string[] } {
  const enabled: string[] = [];
  const importToModule: Record<string, string> = {
    HeroSection: 'hero',
    AboutSection: 'about',
    ValuesSection: 'values',
    HighlightsSection: 'highlights',
    GallerySection: 'gallery',
    ContactSection: 'contact',
  };

  // import 문에서 컴포넌트 이름 추출
  const importRe = /import\s*\{\s*(\w+)\s*\}/g;
  let m;
  while ((m = importRe.exec(pageContent)) !== null) {
    const modId = importToModule[m[1]];
    if (modId && !enabled.includes(modId)) {
      enabled.push(modId);
    }
  }

  return { enabled, order: enabled };
}
