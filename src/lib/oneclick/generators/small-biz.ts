// ──────────────────────────────────────────────
// Small Biz Generator
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';
import type { TemplateGenerator, ComponentMapping } from './base-generator';
import {
  esc,
  buildGalleryArray,
  createExtractors,
  extractSiteBlock,
  parseArrayConstant,
  buildInitialState,
} from './base-generator';

// ─── 배열 빌더 ──────────────────────────────

function buildMenuItemsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    name: '${esc(v.name || '')}',`,
    ];
    if (v.nameEn) lines.push(`    nameEn: '${esc(v.nameEn)}',`);
    lines.push(`    desc: '${esc(v.desc || '')}',`);
    if (v.descEn) lines.push(`    descEn: '${esc(v.descEn)}',`);
    lines.push(`    price: '${esc(v.price || '')}',`);
    lines.push(`    category: '${esc(v.category || '')}',`);
    lines.push(`    emoji: '${esc(v.emoji || '🍽️')}',`);
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildBusinessHoursArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    day: '${esc(v.day || '')}',`,
    ];
    if (v.dayEn) lines.push(`    dayEn: '${esc(v.dayEn)}',`);
    lines.push(`    hours: '${esc(v.hours || '')}',`);
    if (v.hoursEn) lines.push(`    hoursEn: '${esc(v.hoursEn)}',`);
    if ((item as Record<string, unknown>).isHoliday) lines.push('    isHoliday: true,');
    return `  {\n${lines.join('\n')}\n  }`;
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
  menu: {
    importName: 'MenuSection',
    importPath: '@/components/menu-section',
    render: '        <MenuSection items={siteConfig.menuItems} />',
  },
  hours: {
    importName: 'HoursSection',
    importPath: '@/components/hours-section',
    render: '        <HoursSection hours={siteConfig.businessHours} />',
  },
  location: {
    importName: 'LocationSection',
    importPath: '@/components/location-section',
    render: '        <LocationSection config={siteConfig} />',
  },
  gallery: {
    importName: 'GallerySection',
    importPath: '@/components/gallery-section',
    render: `        {siteConfig.galleryImages.length > 0 && (
          <GallerySection images={siteConfig.galleryImages} />
        )}`,
  },
  sns: {
    importName: 'SnsSection',
    importPath: '@/components/sns-section',
    render: '        <SnsSection config={siteConfig} />',
  },
};

// ─── Config 생성 ─────────────────────────────

function generateConfigTs(state: ModuleConfigState): string {
  const hero = state.values.hero || {};
  const menu = state.values.menu || {};
  const hours = state.values.hours || {};
  const location = state.values.location || {};
  const gallery = state.values.gallery || {};
  const sns = state.values.sns || {};

  const name = (hero.name as string) || '온기 베이커리';
  const nameEn = (hero.nameEn as string) || 'Ongi Bakery';
  const description = (hero.description as string) || '매일 아침 직접 구운 빵 한 조각으로 하루를 시작하세요.';
  const descriptionEn = (hero.descriptionEn as string) || 'Start your day with a freshly baked loaf every morning.';
  const phone = (hero.phone as string) || '02-334-5870';
  const primaryColor = (hero.primaryColor as string) || '#d47311';
  const fontFamily = (hero.fontFamily as string) || 'Noto Sans KR';

  const address = (location.address as string) || '서울 마포구 연남동 239-10';
  const addressEn = (location.addressEn as string) || '239-10, Yeonnam-dong, Mapo-gu, Seoul';
  const kakaoMapId = (location.kakaoMapId as string) || '';

  const menuItems = (menu.items as unknown[]) || [];
  const hoursItems = (hours.items as unknown[]) || [];
  const galleryImages = (gallery.images as { url: string }[]) || [];

  const instagramUrl = (sns.instagramUrl as string) || '';
  const naverBlogUrl = (sns.naverBlogUrl as string) || '';
  const kakaoChannelUrl = (sns.kakaoChannelUrl as string) || '';

  const galleryArr = buildGalleryArray(galleryImages);

  return `export interface MenuItem {
  name: string;
  nameEn?: string;
  desc: string;
  descEn?: string;
  price: string;
  category: string;
  emoji: string;
}

export interface BusinessHour {
  day: string;
  dayEn?: string;
  hours: string;
  hoursEn?: string;
  isHoliday?: boolean;
}

const DEMO_MENU: MenuItem[] = ${buildMenuItemsArray(menuItems)};

const DEMO_HOURS: BusinessHour[] = ${buildBusinessHoursArray(hoursItems)};

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
  description: process.env.NEXT_PUBLIC_DESCRIPTION || '${esc(description)}',
  descriptionEn: process.env.NEXT_PUBLIC_DESCRIPTION_EN || '${esc(descriptionEn)}',
  phone: process.env.NEXT_PUBLIC_PHONE || ${phone ? `'${esc(phone)}'` : 'null'},
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '${esc(primaryColor)}',
  address: process.env.NEXT_PUBLIC_ADDRESS || '${esc(address)}',
  addressEn: process.env.NEXT_PUBLIC_ADDRESS_EN || '${esc(addressEn)}',
  kakaoMapId: process.env.NEXT_PUBLIC_KAKAO_MAP_ID || ${kakaoMapId ? `'${esc(kakaoMapId)}'` : `''`},
  menuItems: parseJSON<MenuItem[]>(process.env.NEXT_PUBLIC_MENU_ITEMS, DEMO_MENU),
  businessHours: parseJSON<BusinessHour[]>(process.env.NEXT_PUBLIC_BUSINESS_HOURS, DEMO_HOURS),
  galleryImages: parseJSON<string[]>(process.env.NEXT_PUBLIC_GALLERY_IMAGES, ${galleryArr}),
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || ${instagramUrl ? `'${esc(instagramUrl)}'` : `''`},
  naverBlogUrl: process.env.NEXT_PUBLIC_NAVER_BLOG_URL || ${naverBlogUrl ? `'${esc(naverBlogUrl)}'` : `''`},
  kakaoChannelUrl: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || ${kakaoChannelUrl ? `'${esc(kakaoChannelUrl)}'` : `''`},
  fontFamily: '${esc(fontFamily)}',
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

  // QuickActions: hero 활성화 시 hero 바로 뒤에 자동 삽입
  if (state.enabled.includes('hero')) {
    imports.push("import { QuickActions } from '@/components/quick-actions';");
    const heroIdx = renders.findIndex((r) => r.includes('HeroSection'));
    if (heroIdx >= 0) {
      renders.splice(heroIdx + 1, 0, '        <QuickActions config={siteConfig} />');
    }
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
  const description = extractString('description');
  if (description !== null) state.values.hero.description = description;
  const descriptionEn = extractString('descriptionEn');
  if (descriptionEn !== null) state.values.hero.descriptionEn = descriptionEn;
  const phone = extractNullable('phone');
  if (phone !== null) state.values.hero.phone = phone;
  const primaryColor = extractString('primaryColor');
  if (primaryColor !== null) state.values.hero.primaryColor = primaryColor;
  const fontFamily = extractString('fontFamily');
  if (fontFamily !== null) state.values.hero.fontFamily = fontFamily;

  // Location
  const address = extractString('address');
  if (address !== null) state.values.location.address = address;
  const addressEn = extractString('addressEn');
  if (addressEn !== null) state.values.location.addressEn = addressEn;
  const kakaoMapId = extractString('kakaoMapId');
  if (kakaoMapId !== null) state.values.location.kakaoMapId = kakaoMapId;

  // Menu items
  try {
    const items = parseArrayConstant(configContent, /const DEMO_MENU:.*?=\s*(\[[\s\S]*?\n\]);/, 'name');
    if (items.length > 0) state.values.menu.items = items;
  } catch { /* 기본값 유지 */ }

  // Business hours — isHoliday boolean 파싱
  try {
    const match = configContent.match(/const DEMO_HOURS:.*?=\s*(\[[\s\S]*?\n\]);/);
    if (match?.[1]) {
      const items: Record<string, unknown>[] = [];
      const objRe = /\{([\s\S]*?)\}/g;
      let m;
      while ((m = objRe.exec(match[1])) !== null) {
        const obj: Record<string, unknown> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        // isHoliday: true 파싱
        if (/isHoliday:\s*true/.test(m[1])) obj.isHoliday = true;
        if (obj.day) items.push(obj);
      }
      if (items.length > 0) state.values.hours.items = items;
    }
  } catch { /* 기본값 유지 */ }

  // Gallery images — parseJSON 패턴
  try {
    const galMatch = configContent.match(
      /galleryImages:\s*parseJSON<string\[\]>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/
    );
    if (galMatch) {
      const items: Record<string, string>[] = [];
      const urlRe = /'([^']+)'/g;
      let urlM;
      while ((urlM = urlRe.exec(galMatch[1])) !== null) {
        items.push({ url: urlM[1] });
      }
      if (items.length > 0) state.values.gallery.images = items;
    }
  } catch { /* 기본값 유지 */ }

  // SNS
  const instagramUrl = extractString('instagramUrl');
  if (instagramUrl !== null) state.values.sns.instagramUrl = instagramUrl;
  const naverBlogUrl = extractString('naverBlogUrl');
  if (naverBlogUrl !== null) state.values.sns.naverBlogUrl = naverBlogUrl;
  const kakaoChannelUrl = extractString('kakaoChannelUrl');
  if (kakaoChannelUrl !== null) state.values.sns.kakaoChannelUrl = kakaoChannelUrl;

  return state;
}

// ─── Export ──────────────────────────────────

export const smallBizGenerator: TemplateGenerator = {
  slug: 'small-biz',
  generateConfigTs,
  generatePageTsx,
  parseConfigToState,
  moduleComponents: MODULE_COMPONENTS,
  importToModuleMap: {
    HeroSection: 'hero',
    MenuSection: 'menu',
    HoursSection: 'hours',
    LocationSection: 'location',
    GallerySection: 'gallery',
    SnsSection: 'sns',
  },
};
