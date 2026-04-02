// ──────────────────────────────────────────────
// Digital Namecard Generator
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';
import type { TemplateGenerator, ComponentMapping } from './base-generator';
import {
  esc,
  sanitizeUrl,
  buildSocialsArray,
  normalizeImagePath,
  genBasePathConst,
  imagePathExpr,
  createExtractors,
  extractSiteBlock,
  parseSocialsFromConfig,
  buildInitialState,
} from './base-generator';

// ─── 모듈 컴포넌트 매핑 ─────────────────────
// FlippableCard가 내부에서 ProfileCard/ContactInfo/SocialLinks를 조합
// page.tsx에는 FlippableCard만 import되므로 개별 모듈 컴포넌트 렌더링 불필요

const MODULE_COMPONENTS: Record<string, ComponentMapping> = {
  profile: {
    importName: 'ProfileCard',
    importPath: '@/components/profile-card',
    render: '',
  },
  contact: {
    importName: 'ContactInfo',
    importPath: '@/components/contact-info',
    render: '',
  },
  socials: {
    importName: 'SocialLinks',
    importPath: '@/components/social-links',
    render: '',
  },
};

// ─── 추가 연락처 배열 빌더 ──────────────────────

function buildExtraContactsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    return `  { type: '${esc(v.type || 'text')}', label: '${esc(v.label || '')}', value: '${esc(sanitizeUrl(v.value || ''))}' }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

// ─── Config 생성 ─────────────────────────────

function generateConfigTs(state: ModuleConfigState): string {
  const profile = state.values.profile || {};
  const contact = state.values.contact || {};
  const socials = state.values.socials || {};
  const theme = state.values.theme || {};

  const name = (profile.name as string) || '홍길동';
  const nameEn = (profile.nameEn as string) || 'Gildong Hong';
  const title = (profile.title as string) || '프리랜서 개발자';
  const titleEn = (profile.titleEn as string) || 'Freelance Developer';
  const company = (profile.company as string) || '';
  const companyEn = (profile.companyEn as string) || '';
  const avatarUrl = normalizeImagePath((profile.avatarUrl as string) || '');
  const email = (contact.email as string) || 'hello@example.com';
  const phone = contact.phone != null ? (contact.phone as string) : '';
  const address = (contact.address as string) || '';
  const addressEn = (contact.addressEn as string) || '';
  const website = sanitizeUrl((contact.website as string) || '');
  const extraItems = (contact.extraItems as unknown[]) || [];
  const rawAccent = (theme.accentColor as string) || '';
  const accentColor = /^#[0-9a-fA-F]{6}$/.test(rawAccent) ? rawAccent : '#3b82f6';
  const socialItems = (socials.items as unknown[]) || [];

  // designPreset, fontFamily (번들 config와 동기화)
  const validPresets = ['pro', 'corporate', 'creative', 'minimal-dark'];
  const rawPreset = (theme.designPreset as string) || 'pro';
  const designPreset = validPresets.includes(rawPreset) ? rawPreset : 'pro';
  const fontFamily = (theme.fontFamily as string) || 'Pretendard Variable';

  const extraContactsArr = buildExtraContactsArray(extraItems);

  return `export interface SocialItem { platform: string; url: string; label?: string; }
export interface ExtraContactItem { type: 'email' | 'phone' | 'link' | 'text'; label: string; value: string; }

export type DesignPreset = 'pro' | 'corporate' | 'creative' | 'minimal-dark';

${genBasePathConst()}

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function parsePreset(raw: string | undefined): DesignPreset {
  const valid: DesignPreset[] = ['pro', 'corporate', 'creative', 'minimal-dark'];
  return valid.includes(raw as DesignPreset) ? (raw as DesignPreset) : 'pro';
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || '${esc(name)}',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || '${esc(nameEn)}',
  title: process.env.NEXT_PUBLIC_TITLE || '${esc(title)}',
  titleEn: process.env.NEXT_PUBLIC_TITLE_EN || '${esc(titleEn)}',
  company: process.env.NEXT_PUBLIC_COMPANY || ${company ? `'${esc(company)}'` : 'null'},
  companyEn: process.env.NEXT_PUBLIC_COMPANY_EN || ${companyEn ? `'${esc(companyEn)}'` : 'null'},
  email: process.env.NEXT_PUBLIC_EMAIL || '${esc(email)}',
  phone: process.env.NEXT_PUBLIC_PHONE || ${phone ? `'${esc(phone)}'` : 'null'},
  address: process.env.NEXT_PUBLIC_ADDRESS || ${address ? `'${esc(address)}'` : 'null'},
  addressEn: process.env.NEXT_PUBLIC_ADDRESS_EN || ${addressEn ? `'${esc(addressEn)}'` : 'null'},
  website: process.env.NEXT_PUBLIC_WEBSITE || ${website ? `'${esc(website)}'` : 'null'},
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, ${buildSocialsArray(socialItems)}),
  extraContacts: parseJSON<ExtraContactItem[]>(process.env.NEXT_PUBLIC_EXTRA_CONTACTS, ${extraContactsArr}),
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || ${avatarUrl ? imagePathExpr(avatarUrl) : 'null'},
  accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || '${esc(accentColor)}',
  designPreset: parsePreset(process.env.NEXT_PUBLIC_DESIGN_PRESET || '${esc(designPreset)}'),
  fontFamily: process.env.NEXT_PUBLIC_FONT_FAMILY || '${esc(fontFamily)}',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;
}

// ─── Page 생성 ───────────────────────────────
// FlippableCard 기반 구조 (번들 namecardPage와 동일)
// FlippableCard 내부에서 ProfileCard/ContactInfo/SocialLinks를 조건 렌더링

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generatePageTsx(_state: ModuleConfigState): string {
  return `import { siteConfig } from '@/lib/config';
import { FlippableCard } from '@/components/flippable-card';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main
      id="main"
      data-preset={siteConfig.designPreset}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: 'var(--page-bg)', color: 'var(--page-text)', transition: 'background 0.4s, color 0.4s' }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <FlippableCard config={siteConfig} />
        <Footer />
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
  const name = extractString('name');
  if (name !== null) state.values.profile.name = name;
  const nameEn = extractString('nameEn');
  if (nameEn !== null) state.values.profile.nameEn = nameEn;
  const title = extractString('title');
  if (title !== null) state.values.profile.title = title;
  const titleEn = extractString('titleEn');
  if (titleEn !== null) state.values.profile.titleEn = titleEn;
  const company = extractNullable('company');
  if (company !== null) state.values.profile.company = company;
  const companyEn = extractNullable('companyEn');
  if (companyEn !== null) state.values.profile.companyEn = companyEn;
  const avatarUrl = extractNullable('avatarUrl');
  if (avatarUrl !== null) state.values.profile.avatarUrl = avatarUrl;

  // Contact
  const email = extractString('email');
  if (email !== null) state.values.contact.email = email;
  const phone = extractNullable('phone');
  if (phone !== null) {
    state.values.contact.phone = phone;
  } else if (/(?<!\w)phone:\s*(?:process\.env\.\w+\s*\|\|\s*)?null/.test(siteBlock)) {
    state.values.contact.phone = '';
  }
  const address = extractNullable('address');
  if (address !== null) state.values.contact.address = address;
  const addressEn = extractNullable('addressEn');
  if (addressEn !== null) state.values.contact.addressEn = addressEn;
  const website = extractNullable('website');
  if (website !== null) state.values.contact.website = website;

  // Extra Contacts
  try {
    const extraMatch = configContent.match(
      /extraContacts:\s*parseJSON<ExtraContactItem\[\]>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/
    );
    if (extraMatch?.[1]) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([\s\S]*?)\}/g;
      let m;
      while ((m = objRe.exec(extraMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'((?:[^'\\]|\\.)*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2].replace(/\\(.)/g, '$1');
        }
        if (obj.label) items.push(obj);
      }
      if (items.length > 0) state.values.contact.extraItems = items;
    }
  } catch { /* 기본값 유지 */ }

  // Socials
  try {
    const items = parseSocialsFromConfig(configContent);
    if (items.length > 0) state.values.socials.items = items;
  } catch { /* 기본값 유지 */ }

  // Theme
  const accentColor = extractString('accentColor');
  if (accentColor !== null) state.values.theme.accentColor = accentColor;
  const fontFamily = extractString('fontFamily');
  if (fontFamily !== null) state.values.theme.fontFamily = fontFamily;
  // designPreset: parsePreset(env || 'value') 형태에서 폴백 문자열 추출
  const presetFnMatch = siteBlock.match(
    /designPreset:\s*parsePreset\(\s*(?:process\.env\.\w+\s*\|\|\s*)?'([^']*)'/
  );
  if (presetFnMatch?.[1]) {
    state.values.theme.designPreset = presetFnMatch[1];
  } else {
    // fallback: 직접 문자열로 지정된 경우
    const dpStr = extractString('designPreset');
    if (dpStr !== null) state.values.theme.designPreset = dpStr;
  }

  return state;
}

// ─── Export ──────────────────────────────────

export const digitalNamecardGenerator: TemplateGenerator = {
  slug: 'digital-namecard',
  generateConfigTs,
  generatePageTsx,
  parseConfigToState,
  moduleComponents: MODULE_COMPONENTS,
  importToModuleMap: {
    // FlippableCard wraps all three content modules
    FlippableCard: ['profile', 'contact', 'socials'],
    // Backward compatibility: flat layout에서 편집한 사이트용
    ProfileCard: 'profile',
    ContactInfo: 'contact',
    SocialLinks: 'socials',
  },
};
