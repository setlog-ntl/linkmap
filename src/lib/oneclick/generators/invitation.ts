// ──────────────────────────────────────────────
// Invitation Generator — 범용 모바일 초대장
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';
import type { TemplateGenerator, ComponentMapping } from './base-generator';
import {
  esc,
  buildGalleryArray,
  normalizeImagePath,
  genBasePathConst,
  imagePathExpr,
  createExtractors,
  extractSiteBlock,
  parseArrayConstant,
  parseGalleryFromConfig,
  buildInitialState,
} from './base-generator';

// ─── 배열 빌더 ──────────────────────────────

function buildHostsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines = [
      `    name: '${esc(v.name || '')}',`,
      ...(v.nameEn ? [`    nameEn: '${esc(v.nameEn)}',`] : []),
      `    role: '${esc(v.role || '')}',`,
      ...(v.roleEn ? [`    roleEn: '${esc(v.roleEn)}',`] : []),
      ...(v.phone ? [`    phone: '${esc(v.phone)}',`] : []),
      ...(v.avatarUrl ? [`    avatarUrl: '${esc(v.avatarUrl)}',`] : []),
    ];
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildAccountsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const fields = [
      `label: '${esc(v.label || '')}'`,
      `bankName: '${esc(v.bankName || '')}'`,
      `accountNumber: '${esc(v.accountNumber || '')}'`,
      `holder: '${esc(v.holder || '')}'`,
    ];
    return `  { ${fields.join(', ')} }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildContactsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const fields = [
      `name: '${esc(v.name || '')}'`,
      `phone: '${esc(v.phone || '')}'`,
      ...(v.role ? [`role: '${esc(v.role)}'`] : []),
    ];
    return `  { ${fields.join(', ')} }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

// ─── 프리셋 CSS ─────────────────────────────

interface InvitationPresetVars {
  bg: string;
  bgAlt: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentGlow: string;
  cardBg: string;
  cardBorder: string;
  isDark?: boolean;
}

const INVITATION_PRESET_THEME: Record<string, InvitationPresetVars> = {
  'elegant-gold': {
    bg: '#fffdf7', bgAlt: '#fef9ee', textPrimary: '#1a1a1a', textSecondary: '#6b5c3e',
    accent: '#b8860b', accentGlow: 'rgba(184,134,11,0.15)', cardBg: '#ffffff', cardBorder: '#e8dcc8',
  },
  'romantic-pink': {
    bg: '#fff8fa', bgAlt: '#fef0f5', textPrimary: '#2d1f2b', textSecondary: '#8b6075',
    accent: '#d4729a', accentGlow: 'rgba(212,114,154,0.15)', cardBg: '#ffffff', cardBorder: '#f0d4e0',
  },
  'modern-minimal': {
    bg: '#fafafa', bgAlt: '#f5f5f5', textPrimary: '#111111', textSecondary: '#6b7280',
    accent: '#333333', accentGlow: 'rgba(0,0,0,0.06)', cardBg: '#ffffff', cardBorder: '#e5e7eb',
  },
  'festive': {
    bg: '#fffbf0', bgAlt: '#fff5e6', textPrimary: '#1a1a1a', textSecondary: '#7c5e2d',
    accent: '#ff6b6b', accentGlow: 'rgba(255,107,107,0.15)', cardBg: '#ffffff', cardBorder: '#ffe0b2',
  },
  'natural-garden': {
    bg: '#f8fdf6', bgAlt: '#f0f8ec', textPrimary: '#1a2e1a', textSecondary: '#4a6741',
    accent: '#5c8a4d', accentGlow: 'rgba(92,138,77,0.15)', cardBg: '#ffffff', cardBorder: '#d4e8cb',
  },
};

function generateInvitationPresetCss(
  designPreset: string,
  gradientFrom: string,
  gradientTo: string,
): string {
  const vars = INVITATION_PRESET_THEME[designPreset] ?? INVITATION_PRESET_THEME['elegant-gold'];
  return `/* invitation preset: ${designPreset} — auto-generated */
:root {
  --inv-bg: ${vars.bg};
  --inv-bg-alt: ${vars.bgAlt};
  --inv-text-primary: ${vars.textPrimary};
  --inv-text-secondary: ${vars.textSecondary};
  --inv-accent: ${vars.accent};
  --inv-accent-glow: ${vars.accentGlow};
  --inv-card-bg: ${vars.cardBg};
  --inv-card-border: ${vars.cardBorder};
  --inv-gradient-from: ${gradientFrom};
  --inv-gradient-to: ${gradientTo};
}`;
}

// ─── MODULE_COMPONENTS ──────────────────────

const MODULE_COMPONENTS: Record<string, ComponentMapping> = {
  hero: {
    importName: 'HeroSection',
    importPath: '@/components/hero-section',
    render: '<HeroSection config={siteConfig} />',
  },
  dday: {
    importName: 'CountdownSection',
    importPath: '@/components/countdown-section',
    render: '<CountdownSection config={siteConfig} />',
  },
  hosts: {
    importName: 'HostsSection',
    importPath: '@/components/hosts-section',
    render: '<HostsSection config={siteConfig} />',
  },
  location: {
    importName: 'LocationSection',
    importPath: '@/components/location-section',
    render: '<LocationSection config={siteConfig} />',
  },
  gallery: {
    importName: 'GallerySection',
    importPath: '@/components/gallery-section',
    render: '<GallerySection config={siteConfig} />',
  },
  account: {
    importName: 'AccountSection',
    importPath: '@/components/account-section',
    render: '<AccountSection config={siteConfig} />',
  },
  contact: {
    importName: 'ContactSection',
    importPath: '@/components/contact-section',
    render: '<ContactSection config={siteConfig} />',
  },
};

// ─── IMPORT→MODULE MAP ──────────────────────

const importToModuleMap: Record<string, string | string[]> = {
  HeroSection: 'hero',
  CountdownSection: 'dday',
  HostsSection: 'hosts',
  LocationSection: 'location',
  GallerySection: 'gallery',
  AccountSection: 'account',
  ContactSection: 'contact',
};

// ─── generateConfigTs ───────────────────────

function generateConfigTs(state: ModuleConfigState): string {
  const hero = (state.values['hero'] ?? {}) as Record<string, unknown>;
  const dday = (state.values['dday'] ?? {}) as Record<string, unknown>;
  const hosts = (state.values['hosts'] ?? {}) as Record<string, unknown>;
  const location = (state.values['location'] ?? {}) as Record<string, unknown>;
  const gallery = (state.values['gallery'] ?? {}) as Record<string, unknown>;
  const account = (state.values['account'] ?? {}) as Record<string, unknown>;
  const contact = (state.values['contact'] ?? {}) as Record<string, unknown>;

  const hostsArr = buildHostsArray((hosts.items as unknown[]) ?? []);
  const accountsArr = buildAccountsArray((account.items as unknown[]) ?? []);
  const contactsArr = buildContactsArray((contact.items as unknown[]) ?? []);
  const galleryArr = buildGalleryArray((gallery.images as unknown[]) ?? []);

  const heroImage = normalizeImagePath(String(hero.heroImageUrl ?? ''));

  return `// ──────────────────────────────────────
// Invitation Config — auto-generated
// ──────────────────────────────────────

${genBasePathConst()}

// ── 타입 ────────────────────────────

interface HostItem {
  name: string; nameEn?: string;
  role: string; roleEn?: string;
  phone?: string; avatarUrl?: string;
}

interface AccountItem {
  label: string; bankName: string;
  accountNumber: string; holder: string;
}

interface ContactItem {
  name: string; phone: string; role?: string;
}

// ── 헬퍼 ────────────────────────────

function parseJSON<T>(env: string | undefined, fallback: T): T {
  if (!env) return fallback;
  try { return JSON.parse(env) as T; } catch { return fallback; }
}

// ── 데모 데이터 ─────────────────────

const DEMO_HOSTS: HostItem[] = ${hostsArr};

const DEMO_ACCOUNTS: AccountItem[] = ${accountsArr};

const DEMO_CONTACTS: ContactItem[] = ${contactsArr};

// ── config ──────────────────────────

export const siteConfig = {
  // hero
  eventType: process.env.NEXT_PUBLIC_EVENT_TYPE || '${esc(String(hero.eventType ?? 'gathering'))}',
  designPreset: '${esc(String(hero.designPreset ?? 'elegant-gold'))}',
  title: process.env.NEXT_PUBLIC_TITLE || '${esc(String(hero.title ?? ''))}',
  titleEn: '${esc(String(hero.titleEn ?? ''))}',
  subtitle: process.env.NEXT_PUBLIC_SUBTITLE || '${esc(String(hero.subtitle ?? ''))}',
  subtitleEn: '${esc(String(hero.subtitleEn ?? ''))}',
  heroImageUrl: ${heroImage ? imagePathExpr(heroImage) : "''"},
  gradientFrom: '${esc(String(hero.gradientFrom ?? '#b8860b'))}',
  gradientTo: '${esc(String(hero.gradientTo ?? '#d4a853'))}',

  // dday
  eventDate: '${esc(String(dday.eventDate ?? ''))}',
  eventTime: '${esc(String(dday.eventTime ?? ''))}',
  eventDateLabel: '${esc(String(dday.eventDateLabel ?? ''))}',
  eventDateLabelEn: '${esc(String(dday.eventDateLabelEn ?? ''))}',
  showCountdown: ${dday.showCountdown !== false},
  countdownStyle: '${esc(String(dday.countdownStyle ?? 'flip'))}' as 'flip' | 'simple',

  // hosts
  hostsTitle: '${esc(String(hosts.hostsTitle ?? '초대하는 사람'))}',
  hostsTitleEn: '${esc(String(hosts.hostsTitleEn ?? 'Hosted by'))}',
  hosts: parseJSON<HostItem[]>(process.env.NEXT_PUBLIC_HOSTS, DEMO_HOSTS),

  // location
  venueName: '${esc(String(location.venueName ?? ''))}',
  venueNameEn: '${esc(String(location.venueNameEn ?? ''))}',
  venueAddress: '${esc(String(location.venueAddress ?? ''))}',
  venueAddressEn: '${esc(String(location.venueAddressEn ?? ''))}',
  kakaoMapUrl: '${esc(String(location.kakaoMapUrl ?? ''))}',
  naverMapUrl: '${esc(String(location.naverMapUrl ?? ''))}',
  parkingInfo: '${esc(String(location.parkingInfo ?? ''))}',
  transitInfo: '${esc(String(location.transitInfo ?? ''))}',

  // gallery
  galleryImages: parseJSON<string[]>(process.env.NEXT_PUBLIC_GALLERY, ${galleryArr}),
  galleryColumns: ${Number(gallery.columns) || 3},

  // account
  accountTitle: '${esc(String(account.accountTitle ?? '마음 전하기'))}',
  accountTitleEn: '${esc(String(account.accountTitleEn ?? 'Send Your Wishes'))}',
  accounts: parseJSON<AccountItem[]>(process.env.NEXT_PUBLIC_ACCOUNTS, DEMO_ACCOUNTS),
  kakaoPayUrl: '${esc(String(account.kakaoPayUrl ?? ''))}',

  // contact
  contacts: parseJSON<ContactItem[]>(process.env.NEXT_PUBLIC_CONTACTS, DEMO_CONTACTS),
};
`;
}

// ─── generatePageTsx ────────────────────────

function generatePageTsx(state: ModuleConfigState): string {
  const enabledModules = (state.order ?? []).filter((id) =>
    state.enabled.includes(id),
  );

  const imports: string[] = [];
  const sections: string[] = [];

  for (const moduleId of enabledModules) {
    const comp = MODULE_COMPONENTS[moduleId];
    if (!comp) continue;
    imports.push(
      `import { ${comp.importName} } from '${comp.importPath}';`,
    );
    sections.push(`        ${comp.render}`);
  }

  const hero = (state.values['hero'] ?? {}) as Record<string, unknown>;
  const designPreset = String(hero.designPreset ?? 'elegant-gold');
  const gradientFrom = String(hero.gradientFrom ?? '#b8860b');
  const gradientTo = String(hero.gradientTo ?? '#d4a853');
  const presetCss = generateInvitationPresetCss(designPreset, gradientFrom, gradientTo);

  return `import { siteConfig } from '@/lib/config';
${imports.join('\n')}

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`${presetCss}\` }} />
      <main className="min-h-screen" style={{ background: 'var(--inv-bg)' }}>
${sections.join('\n')}
      </main>
      <footer className="py-6 text-center text-xs" style={{ color: 'var(--inv-text-secondary)', background: 'var(--inv-bg-alt)' }}>
        <a href="https://linkmap.pages.dev" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
          Powered by Linkmap
        </a>
      </footer>
    </>
  );
}
`;
}

// ─── parseConfigToState ─────────────────────

function parseConfigToState(
  configContent: string,
  schema: TemplateModuleSchema,
): ModuleConfigState {
  const state = buildInitialState(schema);

  try {
    const siteBlock = extractSiteBlock(configContent);
    if (!siteBlock) return state;

    const ext = createExtractors(siteBlock);

    // hero
    const heroVals = state.values['hero'] as Record<string, unknown>;
    heroVals.designPreset = ext.extractString('designPreset') ?? heroVals.designPreset;
    heroVals.eventType = ext.extractString('eventType') ?? heroVals.eventType;
    heroVals.title = ext.extractString('title') ?? heroVals.title;
    heroVals.titleEn = ext.extractString('titleEn') ?? heroVals.titleEn;
    heroVals.subtitle = ext.extractString('subtitle') ?? heroVals.subtitle;
    heroVals.subtitleEn = ext.extractString('subtitleEn') ?? heroVals.subtitleEn;
    heroVals.gradientFrom = ext.extractString('gradientFrom') ?? heroVals.gradientFrom;
    heroVals.gradientTo = ext.extractString('gradientTo') ?? heroVals.gradientTo;

    // dday
    const ddayVals = state.values['dday'] as Record<string, unknown>;
    ddayVals.eventDate = ext.extractString('eventDate') ?? ddayVals.eventDate;
    ddayVals.eventTime = ext.extractString('eventTime') ?? ddayVals.eventTime;
    ddayVals.eventDateLabel = ext.extractString('eventDateLabel') ?? ddayVals.eventDateLabel;
    ddayVals.eventDateLabelEn = ext.extractString('eventDateLabelEn') ?? ddayVals.eventDateLabelEn;

    // location
    const locVals = state.values['location'] as Record<string, unknown>;
    locVals.venueName = ext.extractString('venueName') ?? locVals.venueName;
    locVals.venueAddress = ext.extractString('venueAddress') ?? locVals.venueAddress;
    locVals.kakaoMapUrl = ext.extractString('kakaoMapUrl') ?? locVals.kakaoMapUrl;
    locVals.naverMapUrl = ext.extractString('naverMapUrl') ?? locVals.naverMapUrl;

    // hosts
    const hostsArr = parseArrayConstant(configContent, /const DEMO_HOSTS.*?\n\];/s, 'name');
    if (hostsArr.length > 0) {
      (state.values['hosts'] as Record<string, unknown>).items = hostsArr;
    }

    // gallery
    const galleryArr = parseGalleryFromConfig(configContent);
    if (galleryArr.length > 0) {
      (state.values['gallery'] as Record<string, unknown>).images = galleryArr.map((url) => ({ url }));
    }

    // accounts
    const accountsArr = parseArrayConstant(configContent, /const DEMO_ACCOUNTS.*?\n\];/s, 'label');
    if (accountsArr.length > 0) {
      (state.values['account'] as Record<string, unknown>).items = accountsArr;
    }

    // contacts
    const contactsArr = parseArrayConstant(configContent, /const DEMO_CONTACTS.*?\n\];/s, 'name');
    if (contactsArr.length > 0) {
      (state.values['contact'] as Record<string, unknown>).items = contactsArr;
    }
  } catch {
    // 파싱 실패 시 초기 상태 반환
  }

  return state;
}

// ─── export ─────────────────────────────────

export const invitationGenerator: TemplateGenerator = {
  slug: 'invitation',
  generateConfigTs,
  generatePageTsx,
  parseConfigToState,
  moduleComponents: MODULE_COMPONENTS,
  importToModuleMap,
};
