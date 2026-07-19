// ──────────────────────────────────────────────
// Base Generator — 공통 유틸리티 함수
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';

// ─── 문자열 유틸 ─────────────────────────────

/** 위험한 URL 프로토콜 제거 (XSS 방지) */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return '';
  return trimmed;
}

/** 문자열 리터럴에 안전한 이스케이프 (빌드 파괴 방지) */
export function esc(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

/** JS 문자열의 이스케이프 시퀀스를 실제 문자로 디코딩 */
export function unescapeString(s: string): string {
  // \uXXXX 유니코드 이스케이프 → 실제 문자
  let result = s.replace(/\\u([0-9A-Fa-f]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  // \' → ', \\ → \, etc.
  result = result.replace(/\\(.)/g, '$1');
  return result;
}

/** JSON.stringify with 2-space indent */
export function jsonBlock(val: unknown): string {
  return JSON.stringify(val, null, 2);
}

/** 퍼센트 문자열을 skill level로 변환 */
export function percentToLevel(pct: string): 'beginner' | 'intermediate' | 'advanced' {
  const n = parseInt(pct, 10);
  if (isNaN(n) || n <= 33) return 'beginner';
  if (n <= 66) return 'intermediate';
  return 'advanced';
}

/** skill level을 퍼센트 문자열로 변환 */
export function levelToPercent(level: string): string {
  if (level === 'advanced') return '90';
  if (level === 'intermediate') return '60';
  return '30';
}

// ─── 이미지 경로 정규화 ─────────────────────
// 업로드 API가 과거에 /public/images/... 형태로 반환했던 경로를
// Next.js의 정적 파일 서빙 경로 /images/... 로 보정
export function normalizeImagePath(path: string): string {
  if (path.startsWith('/public/')) {
    return path.slice('/public'.length); // /public/images/x → /images/x
  }
  return path;
}

// ─── basePath 지원 ──────────────────────────
// GitHub Pages 배포 시 /<repo-name>/ 하위에 서빙되므로
// <img src="/images/..."> 같은 절대 경로에 basePath 접두사 필요

/** config.ts 상단에 삽입할 _basePath 상수 코드 */
export function genBasePathConst(): string {
  return `const _basePath = process.env.NEXT_PUBLIC_REPO_NAME ? \`/\${process.env.NEXT_PUBLIC_REPO_NAME}\` : '';`;
}

/** 로컬 이미지 경로 → basePath 포함 template literal 표현식 생성 */
export function imagePathExpr(path: string): string {
  if (!path) return 'null';
  // 절대 URL(http/https)은 basePath 없이 그대로 사용
  if (/^https?:\/\//.test(path)) return `'${esc(path)}'`;
  return `\`\${_basePath}${esc(path)}\``;
}

/** 파싱된 이미지 경로에서 basePath 접두사 제거 (에디터 상태 복원용) */
export function stripBasePath(path: string): string {
  // ${_basePath}/images/... 형태의 빌드 결과물에서 basePath를 제거
  // 런타임에 이미 resolve된 경로: /repo-name/images/... → /images/...
  const m = path.match(/^\/[^/]+(\/(images|icons)\/.+)$/);
  if (m) return m[1];
  return path;
}

// ─── 공통 배열 빌더 ──────────────────────────

export function buildSocialsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const labelPart = v.label ? `, label: '${esc(v.label)}'` : '';
    return `  { platform: '${esc(v.platform || '')}', url: '${esc(sanitizeUrl(v.url || ''))}'${labelPart} }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

export function buildGalleryArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const urls = items.map((item) => {
    const v = item as Record<string, string>;
    const raw = v.url || (v as unknown as string);
    const normalized = normalizeImagePath(raw);
    // 절대 URL(http/https)은 basePath 없이 그대로 사용
    if (/^https?:\/\//.test(normalized)) {
      return `  '${esc(normalized)}'`;
    }
    return `  \`\${_basePath}${esc(normalized)}\``;
  });
  return `[\n${urls.join(',\n')}\n]`;
}

// ─── 공통 config 파서 헬퍼 ───────────────────

/** siteConfig 블록에서 문자열 값 추출 */
export function createExtractors(siteBlock: string) {
  // (?<!\w) : 단어 문자 바로 뒤가 아닌 위치에서만 매칭 (서브스트링 오매칭 방지)
  // 예: 'name:' 정규식이 'siteName:' 에 매칭되지 않도록 함
  const extractString = (key: string): string | null => {
    // 작은따옴표 문자열 매칭
    const reSingle = new RegExp(
      `(?<!\\w)${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?'((?:[^'\\\\]|\\\\.)*)'`
    );
    const m = siteBlock.match(reSingle);
    if (m) return unescapeString(m[1]);
    // 큰따옴표 문자열 매칭 (storyEn 등 아포스트로피 포함 문자열)
    const reDouble = new RegExp(
      `(?<!\\w)${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?"((?:[^"\\\\]|\\\\.)*)"`
    );
    const md = siteBlock.match(reDouble);
    return md ? unescapeString(md[1]) : null;
  };

  const extractNullable = (key: string): string | null => {
    // template literal 형태: `${_basePath}/images/...` 매칭
    const reTpl = new RegExp(
      `(?<!\\w)${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?` +
      '`\\$\\{_basePath\\}([^`]*)`'
    );
    const mt = siteBlock.match(reTpl);
    if (mt) return mt[1]; // basePath 없이 /images/... 부분만 반환

    const re = new RegExp(
      `(?<!\\w)${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?(?:'((?:[^'\\\\]|\\\\.)*)'|null)`
    );
    const m = siteBlock.match(re);
    if (!m) return null;
    // null 대안에 매칭된 경우 m[1]은 undefined → null 반환
    if (m[1] === undefined) return null;
    return unescapeString(m[1]);
  };

  return { extractString, extractNullable };
}

/** configContent에서 siteConfig 블록 추출 */
export function extractSiteBlock(configContent: string): string {
  return configContent.match(/export const siteConfig\s*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? configContent;
}

/**
 * `parseJSON<...>(process.env.ENV_KEY, [ ... ])` 형태에서 2번째 인자 배열 리터럴을 추출해 파싱합니다.
 * JSON 형식(제너레이터가 emit한 더블쿼트)만 파싱되며, 정적 번들의 싱글쿼트 리터럴은 파싱 실패 → null(기본값 유지, graceful).
 */
export function parseJsonArrayArg(configContent: string, envKey: string): unknown[] | null {
  // 배열 안에 중첩 배열이 없다고 가정(non-greedy로 첫 닫는 대괄호까지)
  const re = new RegExp(`process\\.env\\.${envKey}\\s*,\\s*(\\[[\\s\\S]*?\\])\\s*\\)`);
  const m = configContent.match(re);
  if (!m) return null;
  try {
    const parsed = JSON.parse(m[1]);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** 배열 상수에서 오브젝트 배열 파싱 (정규식 기반) */
export function parseArrayConstant(
  configContent: string,
  constantPattern: string | RegExp,
  requiredField: string,
  extraParser?: (match: string, obj: Record<string, string>) => void
): Record<string, string>[] {
  const re = typeof constantPattern === 'string'
    ? new RegExp(constantPattern)
    : constantPattern;
  const match = configContent.match(re);
  if (!match?.[1]) return [];

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
    if (extraParser) extraParser(m[1], obj);
    if (obj[requiredField]) items.push(obj);
  }
  return items;
}

/** socials parseJSON 패턴에서 소셜 배열 파싱 */
export function parseSocialsFromConfig(configContent: string): Record<string, string>[] {
  return parseArrayConstant(
    configContent,
    /socials:\s*parseJSON<SocialItem\[\]>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/,
    'platform'
  );
}

// ─── 스키마에서 초기 상태 추출 ────────────────

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

// ─── 컴포넌트 매핑 타입 ──────────────────────

export interface ComponentMapping {
  importName: string;
  importPath: string;
  render: string;
}

// ─── Small-Biz 공통 빌더/파서 ────────────────

export function buildMenuItemsArray(items: unknown[], defaultEmoji = '🍽️'): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, unknown>;
    const lines: string[] = [
      `    name: '${esc(String(v.name || ''))}',`,
    ];
    if (v.nameEn) lines.push(`    nameEn: '${esc(String(v.nameEn))}',`);
    lines.push(`    desc: '${esc(String(v.desc || ''))}',`);
    if (v.descEn) lines.push(`    descEn: '${esc(String(v.descEn))}',`);
    lines.push(`    price: '${esc(String(v.price || ''))}',`);
    lines.push(`    category: '${esc(String(v.category || ''))}',`);
    lines.push(`    emoji: '${esc(String(v.emoji || defaultEmoji))}',`);
    if (v.priceSub) lines.push(`    priceSub: '${esc(String(v.priceSub))}',`);
    if (v.imageUrl) lines.push(`    imageUrl: '${esc(String(v.imageUrl))}',`);
    if (v.isNew === true || v.isNew === 'true') lines.push('    isNew: true,');
    if (v.isPopular === true || v.isPopular === 'true') lines.push('    isPopular: true,');
    if (v.isSeason === true || v.isSeason === 'true') lines.push('    isSeason: true,');
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

export function buildBusinessHoursArray(items: unknown[]): string {
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

/** Menu items 파싱 (DEMO_MENU 상수에서) */
export function parseMenuFromConfig(configContent: string): Record<string, unknown>[] {
  return parseArrayConstant(
    configContent,
    /const DEMO_MENU:.*?=\s*(\[[\s\S]*?\n\]);/,
    'name',
    (match, obj) => {
      if (/isNew:\s*true/.test(match)) (obj as Record<string, unknown>).isNew = true;
      if (/isPopular:\s*true/.test(match)) (obj as Record<string, unknown>).isPopular = true;
      if (/isSeason:\s*true/.test(match)) (obj as Record<string, unknown>).isSeason = true;
    }
  ) as Record<string, unknown>[];
}

/** Business hours 파싱 (DEMO_HOURS 상수에서) */
export function parseHoursFromConfig(configContent: string): Record<string, unknown>[] {
  return parseArrayConstant(
    configContent,
    /const DEMO_HOURS:.*?=\s*(\[[\s\S]*?\n\]);/,
    'day',
    (match, obj) => {
      if (/isHoliday:\s*true/.test(match)) (obj as Record<string, unknown>).isHoliday = true;
    }
  ) as Record<string, unknown>[];
}

/** Gallery images 파싱 (parseJSON 패턴) */
export function parseGalleryFromConfig(configContent: string): Record<string, string>[] {
  const galMatch = configContent.match(
    /galleryImages:\s*parseJSON<string\[\]>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/
  );
  if (!galMatch) return [];
  const items: Record<string, string>[] = [];
  const urlRe = /(?:'([^']+)'|`\$\{_basePath\}([^`]+)`)/g;
  let m;
  while ((m = urlRe.exec(galMatch[1])) !== null) {
    items.push({ url: m[1] || m[2] });
  }
  return items;
}

// ─── Small-Biz 프리셋 CSS 생성 ────────────────

interface SmallBizPresetVars {
  bg?: string;
  bgAlt?: string;
  textPrimary?: string;
  textSecondary?: string;
  surfaceBorder?: string;
}

const SMALL_BIZ_PRESET_THEME: Record<string, SmallBizPresetVars> = {
  'warm-serif': {
    bg: '#faf7f2', bgAlt: '#f5f0e8',
    surfaceBorder: '#e8e0d0',
  },
  'modern-minimal': {
    bg: '#fafafa', bgAlt: '#f5f5f5',
    surfaceBorder: '#e5e5e5',
  },
  'warm-earth': {
    bg: '#fefce8', bgAlt: '#fef3c7',
    surfaceBorder: '#fde68a',
  },
  midnight: {
    bg: '#0f0f0f', bgAlt: '#171717',
    textPrimary: '#f0f0f0', textSecondary: '#a0a0a0',
    surfaceBorder: '#2a2a2a',
  },
};

function hexToRgbStrSb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function generateSmallBizPresetCss(
  designPreset: string,
  primaryColor: string,
): string {
  const theme = SMALL_BIZ_PRESET_THEME[designPreset];
  const isDark = designPreset === 'midnight';

  let css = `/* ── Preset Override (auto-generated) ── */
:root {
  --color-primary: ${primaryColor};
  --brand-primary: ${primaryColor};
  --brand-glow: rgba(${hexToRgbStrSb(primaryColor)}, 0.15);`;

  if (theme) {
    if (theme.bg) css += `\n  --bg: ${theme.bg};`;
    if (theme.bgAlt) css += `\n  --bg-alt: ${theme.bgAlt};`;
    if (theme.textPrimary) css += `\n  --text-primary: ${theme.textPrimary};`;
    if (theme.textSecondary) css += `\n  --text-secondary: ${theme.textSecondary};`;
    if (theme.surfaceBorder) css += `\n  --surface-border: ${theme.surfaceBorder};`;
  }

  if (isDark) {
    css += `\n  color-scheme: dark;`;
    css += `\n  --shadow-card: 0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2);`;
  }

  css += `\n}\n`;
  return css;
}

/** Small-Biz 계열 MODULE_COMPONENTS (small-biz, small-biz-cafe 공통)
 * hours와 location은 실제 템플릿에서 InfoSection으로 통합되어 있음 */
export const SMALL_BIZ_MODULE_COMPONENTS: Record<string, ComponentMapping> = {
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
    importName: 'InfoSection',
    importPath: '@/components/info-section',
    render: '        <InfoSection config={siteConfig} />',
  },
  location: {
    importName: 'InfoSection',
    importPath: '@/components/info-section',
    render: '        <InfoSection config={siteConfig} />',
  },
  gallery: {
    importName: 'GallerySection',
    importPath: '@/components/gallery-section',
    render: `        {siteConfig.galleryImages.length > 0 && (\n          <GallerySection images={siteConfig.galleryImages} />\n        )}`,
  },
  sns: {
    importName: 'SnsSection',
    importPath: '@/components/sns-section',
    render: '        <SnsSection config={siteConfig} />',
  },
};

/** import 이름 → 모듈 ID 매핑 (다대일: InfoSection → hours+location) */
export const SMALL_BIZ_IMPORT_TO_MODULE_MAP: Record<string, string | string[]> = {
  HeroSection: 'hero',
  MenuSection: 'menu',
  InfoSection: ['hours', 'location'],
  GallerySection: 'gallery',
  SnsSection: 'sns',
};

interface SmallBizDefaults {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  phone: string;
  primaryColor: string;
  address: string;
  addressEn: string;
  defaultEmoji: string;
}

interface SmallBizGeneratorOptions {
  extraModuleComponents?: Record<string, ComponentMapping>;
  extraImportMap?: Record<string, string | string[]>;
  /** base가 다루지 않는 모듈(예: cafe about)의 config emit·parse 훅 */
  extraConfig?: {
    /** siteConfig 앞에 삽입할 추가 타입 선언 (선택) */
    types?: () => string;
    /** siteConfig 객체 내부에 삽입할 추가 필드 라인 (각 줄 2칸 들여쓰기 + 끝 콤마 포함) */
    fields: (state: ModuleConfigState) => string;
    /** 배포 config.ts → 에디터 state 역파싱 */
    parse: (configContent: string, state: ModuleConfigState) => void;
  };
}

/** Small-Biz 계열 제너레이터 팩토리 */
export function createSmallBizGenerator(
  slug: string,
  defaults: SmallBizDefaults,
  options?: SmallBizGeneratorOptions
): TemplateGenerator {
  const mergedModuleComponents: Record<string, ComponentMapping> = {
    ...SMALL_BIZ_MODULE_COMPONENTS,
    ...options?.extraModuleComponents,
  };
  const mergedImportToModuleMap: Record<string, string | string[]> = {
    ...SMALL_BIZ_IMPORT_TO_MODULE_MAP,
    ...options?.extraImportMap,
  };
  function generateConfigTs(state: ModuleConfigState): string {
    const hero = state.values.hero || {};
    const menu = state.values.menu || {};
    const hours = state.values.hours || {};
    const location = state.values.location || {};
    const gallery = state.values.gallery || {};
    const sns = state.values.sns || {};

    const name = (hero.name as string) || defaults.name;
    const nameEn = (hero.nameEn as string) || defaults.nameEn;
    const description = (hero.description as string) || defaults.description;
    const descriptionEn = (hero.descriptionEn as string) || defaults.descriptionEn;
    const phone = (hero.phone as string) || defaults.phone;
    const primaryColor = (hero.primaryColor as string) || defaults.primaryColor;
    const fontFamily = (hero.fontFamily as string) || 'Pretendard';
    const designPreset = (hero.designPreset as string) || 'default';

    const address = (location.address as string) || defaults.address;
    const addressEn = (location.addressEn as string) || defaults.addressEn;
    const kakaoMapId = (location.kakaoMapId as string) || '';
    const naverPlaceUrl = sanitizeUrl((location.naverPlaceUrl as string) || '');

    const menuItems = (menu.items as unknown[]) || [];
    const hoursItems = (hours.items as unknown[]) || [];
    const galleryImages = (gallery.images as { url: string }[]) || [];

    const instagramUrl = (sns.instagramUrl as string) || '';
    const naverBlogUrl = (sns.naverBlogUrl as string) || '';
    const youtubeUrl = (sns.youtubeUrl as string) || '';
    const kakaoChannelUrl = (sns.kakaoChannelUrl as string) || '';

    const galleryArr = buildGalleryArray(galleryImages);

    const extraTypes = options?.extraConfig?.types?.() ?? '';
    const extraFields = options?.extraConfig?.fields?.(state) ?? '';

    return `export interface MenuItem {
  name: string;
  nameEn?: string;
  desc: string;
  descEn?: string;
  price: string;
  priceSub?: string;
  category: string;
  emoji: string;
  imageUrl?: string;
  isNew?: boolean;
  isPopular?: boolean;
  isSeason?: boolean;
}

export interface BusinessHour {
  day: string;
  dayEn?: string;
  hours: string;
  hoursEn?: string;
  isHoliday?: boolean;
}
${extraTypes ? `\n${extraTypes}\n` : ''}
const DEMO_MENU: MenuItem[] = ${buildMenuItemsArray(menuItems, defaults.defaultEmoji)};

const DEMO_HOURS: BusinessHour[] = ${buildBusinessHoursArray(hoursItems)};

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
  description: process.env.NEXT_PUBLIC_DESCRIPTION || '${esc(description)}',
  descriptionEn: process.env.NEXT_PUBLIC_DESCRIPTION_EN || '${esc(descriptionEn)}',
  phone: process.env.NEXT_PUBLIC_PHONE || ${phone ? `'${esc(phone)}'` : 'null'},
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '${esc(primaryColor)}',
  address: process.env.NEXT_PUBLIC_ADDRESS || '${esc(address)}',
  addressEn: process.env.NEXT_PUBLIC_ADDRESS_EN || '${esc(addressEn)}',
  kakaoMapId: process.env.NEXT_PUBLIC_KAKAO_MAP_ID || ${kakaoMapId ? `'${esc(kakaoMapId)}'` : `''`},
  naverPlaceUrl: process.env.NEXT_PUBLIC_NAVER_PLACE_URL || ${naverPlaceUrl ? `'${esc(naverPlaceUrl)}'` : `''`},
  menuItems: parseJSON<MenuItem[]>(process.env.NEXT_PUBLIC_MENU_ITEMS, DEMO_MENU),
  businessHours: parseJSON<BusinessHour[]>(process.env.NEXT_PUBLIC_BUSINESS_HOURS, DEMO_HOURS),
  galleryImages: parseJSON<string[]>(process.env.NEXT_PUBLIC_GALLERY_IMAGES, ${galleryArr}),
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || ${instagramUrl ? `'${esc(instagramUrl)}'` : `''`},
  naverBlogUrl: process.env.NEXT_PUBLIC_NAVER_BLOG_URL || ${naverBlogUrl ? `'${esc(naverBlogUrl)}'` : `''`},
  youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || ${youtubeUrl ? `'${esc(youtubeUrl)}'` : `''`},
  kakaoChannelUrl: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || ${kakaoChannelUrl ? `'${esc(kakaoChannelUrl)}'` : `''`},
${extraFields ? `${extraFields}\n` : ''}  fontFamily: '${esc(fontFamily)}',
  designPreset: '${esc(designPreset)}',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;
  }

  function generatePageTsx(state: ModuleConfigState): string {
    const hero = state.values.hero || {};
    const designPreset = (hero.designPreset as string) || 'default';

    const activeModules = state.order.filter((id) => state.enabled.includes(id));
    const imports: string[] = [
      "import { siteConfig } from '@/lib/config';",
      "import '@/app/preset-override.css';",
      "import { NavHeader } from '@/components/nav-header';",
    ];
    const renders: string[] = [];

    // 중복 import/render 방지 (hours+location → InfoSection 통합)
    const importedComponents = new Set<string>();
    for (const id of activeModules) {
      const comp = mergedModuleComponents[id];
      if (!comp) continue;
      if (importedComponents.has(comp.importName)) continue;
      importedComponents.add(comp.importName);
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
    const designPreset = extractString('designPreset');
    if (designPreset !== null) state.values.hero.designPreset = designPreset;

    // Location
    const address = extractString('address');
    if (address !== null) state.values.location.address = address;
    const addressEn = extractString('addressEn');
    if (addressEn !== null) state.values.location.addressEn = addressEn;
    const kakaoMapId = extractString('kakaoMapId');
    if (kakaoMapId !== null) state.values.location.kakaoMapId = kakaoMapId;
    const naverPlaceUrl = extractString('naverPlaceUrl');
    if (naverPlaceUrl !== null) state.values.location.naverPlaceUrl = naverPlaceUrl;

    // Menu items
    try {
      const items = parseMenuFromConfig(configContent);
      if (items.length > 0) state.values.menu.items = items;
    } catch { /* 기본값 유지 */ }

    // Business hours
    try {
      const items = parseHoursFromConfig(configContent);
      if (items.length > 0) state.values.hours.items = items;
    } catch { /* 기본값 유지 */ }

    // Gallery images
    try {
      const items = parseGalleryFromConfig(configContent);
      if (items.length > 0) state.values.gallery.images = items;
    } catch { /* 기본값 유지 */ }

    // SNS
    const instagramUrl = extractString('instagramUrl');
    if (instagramUrl !== null) state.values.sns.instagramUrl = instagramUrl;
    const naverBlogUrl = extractString('naverBlogUrl');
    if (naverBlogUrl !== null) state.values.sns.naverBlogUrl = naverBlogUrl;
    const youtubeUrl = extractString('youtubeUrl');
    if (youtubeUrl !== null) state.values.sns.youtubeUrl = youtubeUrl;
    const kakaoChannelUrl = extractString('kakaoChannelUrl');
    if (kakaoChannelUrl !== null) state.values.sns.kakaoChannelUrl = kakaoChannelUrl;

    // 추가 모듈(about 등) 역파싱
    options?.extraConfig?.parse?.(configContent, state);

    return state;
  }

  return {
    slug,
    generateConfigTs,
    generatePageTsx,
    parseConfigToState,
    moduleComponents: mergedModuleComponents,
    importToModuleMap: mergedImportToModuleMap,
  };
}

// ─── TemplateGenerator 인터페이스 ─────────────

export interface TemplateGenerator {
  slug: string;
  generateConfigTs(state: ModuleConfigState): string;
  generatePageTsx(state: ModuleConfigState): string;
  parseConfigToState(configContent: string, schema: TemplateModuleSchema): ModuleConfigState;
  moduleComponents: Record<string, ComponentMapping>;
  /** import 이름 → 모듈 ID 매핑 (parsePageToEnabledModules 용, 다대일 지원) */
  importToModuleMap: Record<string, string | string[]>;
}
