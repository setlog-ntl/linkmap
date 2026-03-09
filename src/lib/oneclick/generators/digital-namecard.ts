// ──────────────────────────────────────────────
// Digital Namecard Generator
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
  parseSocialsFromConfig,
  buildInitialState,
} from './base-generator';

// ─── 모듈 컴포넌트 매핑 ─────────────────────

const MODULE_COMPONENTS: Record<string, ComponentMapping> = {
  profile: {
    importName: 'ProfileCard',
    importPath: '@/components/profile-card',
    render: '            <ProfileCard config={siteConfig} />',
  },
  contact: {
    importName: 'ContactInfo',
    importPath: '@/components/contact-info',
    render: '            <ContactInfo config={siteConfig} />',
  },
  socials: {
    importName: 'SocialLinks',
    importPath: '@/components/social-links',
    render: '            {siteConfig.socials.length > 0 && <SocialLinks socials={siteConfig.socials} accentColor={siteConfig.accentColor} />}',
  },
};

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
  const website = (contact.website as string) || '';
  const accentColor = (theme.accentColor as string) || '#3b82f6';
  const socialItems = (socials.items as unknown[]) || [];

  return `export interface SocialItem { platform: string; url: string; }

${genBasePathConst()}

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
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
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || ${avatarUrl ? imagePathExpr(avatarUrl) : 'null'},
  accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || '${esc(accentColor)}',
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
  ];
  const renders: string[] = [];

  // contact 활성화 시 QrCode + SaveContactButton 자동 포함
  let needsQr = false;

  for (const id of activeModules) {
    const comp = MODULE_COMPONENTS[id];
    if (!comp) continue; // theme 등 컴포넌트 없는 모듈 스킵
    imports.push(`import { ${comp.importName} } from '${comp.importPath}';`);
    renders.push(comp.render);
    if (id === 'contact') needsQr = true;
  }

  if (needsQr) {
    imports.push("import { QrCode } from '@/components/qr-code';");
    imports.push("import { SaveContactButton } from '@/components/save-contact-button';");
    renders.push('            <QrCode config={siteConfig} />');
    renders.push('            <SaveContactButton config={siteConfig} />');
  }

  imports.push("import { Footer } from '@/components/footer';");

  return `${imports.join('\n')}

export default function Home() {
  return (
    <main id="main" className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="print-card rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-800">
          <div className="h-2" style={{ background: \`linear-gradient(90deg, \${siteConfig.accentColor}, \${siteConfig.accentColor}dd)\` }} />
          <div className="p-6 space-y-5">
${renders.join('\n')}
          </div>
        </div>
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
  // extractNullable은 null 리터럴과 키 미존재 둘 다 null 반환.
  // phone은 defaultValue가 비어있지 않으므로, null 리터럴(빈 값 의도) 여부를
  // 직접 확인해 빈 문자열로 복원한다.
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

  // Socials
  try {
    const items = parseSocialsFromConfig(configContent);
    if (items.length > 0) state.values.socials.items = items;
  } catch { /* 기본값 유지 */ }

  // Theme
  const accentColor = extractString('accentColor');
  if (accentColor !== null) state.values.theme.accentColor = accentColor;

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
    ProfileCard: 'profile',
    ContactInfo: 'contact',
    SocialLinks: 'socials',
  },
};
