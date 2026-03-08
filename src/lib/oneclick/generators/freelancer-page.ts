// ──────────────────────────────────────────────
// Freelancer Page Generator
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
  unescapeString,
} from './base-generator';

// ─── 배열 빌더 ──────────────────────────────

function buildServicesArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    title: '${esc(v.title || '')}',`,
    ];
    if (v.titleEn) lines.push(`    titleEn: '${esc(v.titleEn)}',`);
    lines.push(`    desc: '${esc(v.desc || '')}',`);
    if (v.descEn) lines.push(`    descEn: '${esc(v.descEn)}',`);
    lines.push(`    price: '${esc(v.price || '')}',`);
    if (v.priceEn) lines.push(`    priceEn: '${esc(v.priceEn)}',`);
    lines.push(`    icon: '${esc(v.icon || 'palette')}',`);
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildPortfolioArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    title: '${esc(v.title || '')}',`,
    ];
    if (v.titleEn) lines.push(`    titleEn: '${esc(v.titleEn)}',`);
    lines.push(`    category: '${esc(v.category || '')}',`);
    if (v.categoryEn) lines.push(`    categoryEn: '${esc(v.categoryEn)}',`);
    lines.push(`    desc: '${esc(v.desc || '')}',`);
    if (v.descEn) lines.push(`    descEn: '${esc(v.descEn)}',`);
    lines.push(`    imageUrl: \`\${_basePath}${esc(normalizeImagePath(v.imageUrl || ''))}\`,`);
    const tagsStr = v.tags || '';
    const tagsArr = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    lines.push(`    tags: [${tagsArr.map((t) => `'${esc(t)}'`).join(', ')}],`);
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildTestimonialsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    author: '${esc(v.author || '')}',`,
    ];
    if (v.authorEn) lines.push(`    authorEn: '${esc(v.authorEn)}',`);
    lines.push(`    role: '${esc(v.role || '')}',`);
    if (v.roleEn) lines.push(`    roleEn: '${esc(v.roleEn)}',`);
    lines.push(`    company: '${esc(v.company || '')}',`);
    if (v.companyEn) lines.push(`    companyEn: '${esc(v.companyEn)}',`);
    lines.push(`    content: '${esc(v.content || '')}',`);
    if (v.contentEn) lines.push(`    contentEn: '${esc(v.contentEn)}',`);
    lines.push(`    rating: ${parseInt(v.rating || '5', 10)},`);
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildProcessArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    number: '${esc(v.number || '01')}',`,
      `    title: '${esc(v.title || '')}',`,
    ];
    if (v.titleEn) lines.push(`    titleEn: '${esc(v.titleEn)}',`);
    lines.push(`    desc: '${esc(v.desc || '')}',`);
    if (v.descEn) lines.push(`    descEn: '${esc(v.descEn)}',`);
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildRotatingWordsLiteral(raw: string): string {
  const words = raw.split(',').map((w) => w.trim()).filter(Boolean);
  if (words.length > 0) return `[${words.map((w) => `'${esc(w)}'`).join(', ')}]`;
  return `['Brand Identity', 'Packaging', 'Social Media', 'Web Design']`;
}

// ─── 모듈 컴포넌트 매핑 ─────────────────────

const MODULE_COMPONENTS: Record<string, ComponentMapping> = {
  hero: {
    importName: 'HeroSection',
    importPath: '@/components/hero-section',
    render: '        <HeroSection config={siteConfig} />',
  },
  services: {
    importName: 'ServicesSection',
    importPath: '@/components/services-section',
    render: '        <ServicesSection services={siteConfig.services} />',
  },
  portfolio: {
    importName: 'PortfolioSection',
    importPath: '@/components/portfolio-section',
    render: '        <PortfolioSection portfolio={siteConfig.portfolio} />',
  },
  testimonials: {
    importName: 'TestimonialsSection',
    importPath: '@/components/testimonials-section',
    render: '        <TestimonialsSection testimonials={siteConfig.testimonials} />',
  },
  process: {
    importName: 'ProcessSection',
    importPath: '@/components/process-section',
    render: '        <ProcessSection process={siteConfig.process} />',
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
  const services = state.values.services || {};
  const portfolio = state.values.portfolio || {};
  const testimonials = state.values.testimonials || {};
  const processVals = state.values.process || {};
  const contact = state.values.contact || {};

  const name = (hero.name as string) || '정하은';
  const nameEn = (hero.nameEn as string) || 'Haeun Jung';
  const title = (hero.title as string) || '그래픽 디자이너';
  const titleEn = (hero.titleEn as string) || 'Graphic Designer';
  const tagline = (hero.tagline as string) || '브랜드의 이야기를 시각으로 풀어내는 그래픽 디자이너';
  const taglineEn = (hero.taglineEn as string) || 'Graphic designer who tells brand stories through visuals';
  const avatarUrl = normalizeImagePath((hero.avatarUrl as string) || '');
  const gradientFrom = (hero.gradientFrom as string) || '#5b13ec';
  const gradientTo = (hero.gradientTo as string) || '#06b6d4';
  const fontFamily = (hero.fontFamily as string) || 'Pretendard';
  const designPreset = (hero.designPreset as string) || 'default';
  const rotatingWordsRaw = (hero.rotatingWords as string) || '';
  const email = (contact.email as string) || 'haeun@jung-design.kr';
  const portfolioColumns = (portfolio.columns as string) || '3';

  const serviceItems = (services.items as unknown[]) || [];
  const portfolioItems = (portfolio.items as unknown[]) || [];
  const testimonialItems = (testimonials.items as unknown[]) || [];
  const processItems = (processVals.items as unknown[]) || [];
  const socials = (contact.socials as unknown[]) || [];

  return `export interface ServiceItem {
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
  price: string;
  priceEn?: string;
  icon: string;
}

export interface PortfolioItem {
  title: string;
  titleEn?: string;
  category: string;
  categoryEn?: string;
  desc: string;
  descEn?: string;
  imageUrl: string;
  tags: string[];
}

export interface TestimonialItem {
  author: string;
  authorEn?: string;
  role: string;
  roleEn?: string;
  company: string;
  companyEn?: string;
  content: string;
  contentEn?: string;
  rating: number;
}

export interface ProcessStep {
  number: string;
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
}

export interface SocialItem {
  platform: string;
  url: string;
}

const DEMO_SERVICES: ServiceItem[] = ${buildServicesArray(serviceItems)};

const DEMO_PORTFOLIO: PortfolioItem[] = ${buildPortfolioArray(portfolioItems)};

const DEMO_TESTIMONIALS: TestimonialItem[] = ${buildTestimonialsArray(testimonialItems)};

const DEMO_PROCESS: ProcessStep[] = ${buildProcessArray(processItems)};

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
  title: process.env.NEXT_PUBLIC_TITLE || '${esc(title)}',
  titleEn: process.env.NEXT_PUBLIC_TITLE_EN || '${esc(titleEn)}',
  tagline: process.env.NEXT_PUBLIC_TAGLINE || '${esc(tagline)}',
  taglineEn: process.env.NEXT_PUBLIC_TAGLINE_EN || '${esc(taglineEn)}',
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || ${avatarUrl ? imagePathExpr(avatarUrl) : 'null'},
  services: parseJSON<ServiceItem[]>(process.env.NEXT_PUBLIC_SERVICES, DEMO_SERVICES),
  portfolio: parseJSON<PortfolioItem[]>(process.env.NEXT_PUBLIC_PORTFOLIO, DEMO_PORTFOLIO),
  testimonials: parseJSON<TestimonialItem[]>(process.env.NEXT_PUBLIC_TESTIMONIALS, DEMO_TESTIMONIALS),
  process: parseJSON<ProcessStep[]>(process.env.NEXT_PUBLIC_PROCESS, DEMO_PROCESS),
  email: process.env.NEXT_PUBLIC_EMAIL || '${esc(email)}',
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, ${buildSocialsArray(socials)}),
  gradientFrom: '${esc(gradientFrom)}',
  gradientTo: '${esc(gradientTo)}',
  fontFamily: '${esc(fontFamily)}',
  portfolioColumns: '${esc(portfolioColumns)}',
  designPreset: '${esc(designPreset)}',
  rotatingWords: parseJSON<string[]>(process.env.NEXT_PUBLIC_ROTATING_WORDS, ${buildRotatingWordsLiteral(rotatingWordsRaw)}),
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
  const title = extractString('title');
  if (title !== null) state.values.hero.title = title;
  const titleEn = extractString('titleEn');
  if (titleEn !== null) state.values.hero.titleEn = titleEn;
  const tagline = extractString('tagline');
  if (tagline !== null) state.values.hero.tagline = tagline;
  const taglineEn = extractString('taglineEn');
  if (taglineEn !== null) state.values.hero.taglineEn = taglineEn;
  const avatarUrl = extractNullable('avatarUrl');
  if (avatarUrl !== null) state.values.hero.avatarUrl = avatarUrl;
  const gradientFrom = extractString('gradientFrom');
  if (gradientFrom !== null) state.values.hero.gradientFrom = gradientFrom;
  const gradientTo = extractString('gradientTo');
  if (gradientTo !== null) state.values.hero.gradientTo = gradientTo;
  const fontFamily = extractString('fontFamily');
  if (fontFamily !== null) state.values.hero.fontFamily = fontFamily;
  const designPreset = extractString('designPreset');
  if (designPreset !== null) state.values.hero.designPreset = designPreset;

  // rotatingWords
  try {
    const rwMatch = configContent.match(/rotatingWords:\s*parseJSON<string\[\]>\([^,]+,\s*\[([\s\S]*?)\]\s*\)/);
    if (rwMatch?.[1]) {
      const words: string[] = [];
      const wordRe = /'([^']*)'/g;
      let wm;
      while ((wm = wordRe.exec(rwMatch[1])) !== null) {
        words.push(unescapeString(wm[1]));
      }
      if (words.length > 0) {
        state.values.hero.rotatingWords = words.join(', ');
      }
    }
  } catch { /* 기본값 유지 */ }

  // Services
  try {
    const items = parseArrayConstant(configContent, /const DEMO_SERVICES:.*?=\s*(\[[\s\S]*?\n\]);/, 'title');
    if (items.length > 0) state.values.services.items = items;
  } catch { /* 기본값 유지 */ }

  // Portfolio — tags 배열 특수 파싱
  try {
    const match = configContent.match(/const DEMO_PORTFOLIO:.*?=\s*(\[[\s\S]*?\n\]);/);
    if (match?.[1]) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([\s\S]*?)\}/g;
      let m;
      while ((m = objRe.exec(match[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'((?:[^'\\]|\\.)*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = unescapeString(fm[2]);
        }
        // imageUrl template literal 파싱: `${_basePath}/images/...`
        const imgTplMatch = m[1].match(/imageUrl:\s*`\$\{_basePath\}([^`]*)`/);
        if (imgTplMatch) {
          obj.imageUrl = imgTplMatch[1];
        }
        // tags: ['a', 'b'] 패턴 파싱
        const tagsMatch = m[1].match(/tags:\s*\[([\s\S]*?)\]/);
        if (tagsMatch) {
          const tagVals: string[] = [];
          const tagRe = /'([^']*)'/g;
          let tm;
          while ((tm = tagRe.exec(tagsMatch[1])) !== null) {
            tagVals.push(unescapeString(tm[1]));
          }
          obj.tags = tagVals.join(', ');
        }
        if (obj.title) items.push(obj);
      }
      if (items.length > 0) state.values.portfolio.items = items;
    }
  } catch { /* 기본값 유지 */ }

  // Portfolio columns
  const portfolioColumns = extractString('portfolioColumns');
  if (portfolioColumns !== null) state.values.portfolio.columns = portfolioColumns;

  // Testimonials — rating 숫자 파싱
  try {
    const match = configContent.match(/const DEMO_TESTIMONIALS:.*?=\s*(\[[\s\S]*?\n\]);/);
    if (match?.[1]) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([\s\S]*?)\}/g;
      let m;
      while ((m = objRe.exec(match[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'((?:[^'\\]|\\.)*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = unescapeString(fm[2]);
        }
        // rating: 숫자 파싱
        const ratingMatch = m[1].match(/rating:\s*(\d+)/);
        if (ratingMatch) obj.rating = ratingMatch[1];
        if (obj.author) items.push(obj);
      }
      if (items.length > 0) state.values.testimonials.items = items;
    }
  } catch { /* 기본값 유지 */ }

  // Process
  try {
    const items = parseArrayConstant(configContent, /const DEMO_PROCESS:.*?=\s*(\[[\s\S]*?\n\]);/, 'title');
    if (items.length > 0) state.values.process.items = items;
  } catch { /* 기본값 유지 */ }

  // Contact
  const email = extractString('email');
  if (email !== null) state.values.contact.email = email;

  // Socials
  try {
    const items = parseSocialsFromConfig(configContent);
    if (items.length > 0) state.values.contact.socials = items;
  } catch { /* 기본값 유지 */ }

  return state;
}

// ─── Export ──────────────────────────────────

export const freelancerPageGenerator: TemplateGenerator = {
  slug: 'freelancer-page',
  generateConfigTs,
  generatePageTsx,
  parseConfigToState,
  moduleComponents: MODULE_COMPONENTS,
  importToModuleMap: {
    HeroSection: 'hero',
    ServicesSection: 'services',
    PortfolioSection: 'portfolio',
    TestimonialsSection: 'testimonials',
    ProcessSection: 'process',
    ContactSection: 'contact',
  },
};
