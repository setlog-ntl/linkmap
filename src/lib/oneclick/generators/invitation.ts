// ──────────────────────────────────────────────
// Invitation Generator — 범용 모바일 초대장
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';
import type { TemplateGenerator, ComponentMapping } from './base-generator';
import {
  esc,
  sanitizeUrl,
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

// ─── 색상 유틸 ──────────────────────────────

/** #rrggbb → rgba(r,g,b,alpha) — accentGlow/accentSoft를 accent 하나에서 파생시켜
 *  프리셋별 오버라이드 누락(하드코딩 골드 누수 버그)을 구조적으로 방지 */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── 프리셋 CSS ─────────────────────────────

interface InvitationPresetVars {
  bg: string;
  bgAlt: string;
  textPrimary: string;
  textSecondary: string;
  /** 테두리·아이콘·대형 비텍스트 전용 (소형 본문/흰글자 버튼에는 accentSolid 사용) */
  accent: string;
  /** 흰 글자 버튼/배지용 고대비 색 (AA 4.5:1 검증 완료) */
  accentSolid: string;
  cardBg: string;
  cardBorder: string;
  isGlass?: boolean;
  bgGrad?: string;
  glassBg?: string;
  glassBorder?: string;
  glassShadow?: string;
}

// AA 대비 사전 검증 완료 팔레트 — 이 값 그대로 사용
// 2차 개편("라이트 & 에어리 럭셔리"): bgAlt를 bg에 더 가깝게 조정해 섹션 간 배경 교차를
// 은은하게 만듦(1차 대비 색차 절반 축소). accent/accentSolid는 "면"이 아닌 "선·점"
// 전용(헤어라인, 모노그램 링, 캘린더 하이라이트, 버튼 1개)으로만 사용.
const INVITATION_PRESET_THEME: Record<string, InvitationPresetVars> = {
  'elegant-gold': {
    bg: '#FBF7F0', bgAlt: '#F8F3E8', textPrimary: '#211A12', textSecondary: '#6B5A3E',
    accent: '#B8860B', accentSolid: '#8B6B1F', cardBg: '#FFFFFF', cardBorder: '#E8DCC8',
  },
  'romantic-pink': {
    bg: '#FBF4F3', bgAlt: '#F8EEED', textPrimary: '#2B1E22', textSecondary: '#7C5A61',
    accent: '#C08497', accentSolid: '#7C2036', cardBg: '#FFFFFF', cardBorder: '#EAD3D3',
  },
  'modern-minimal': {
    bg: '#FAFAF9', bgAlt: '#F6F6F4', textPrimary: '#16171A', textSecondary: '#6B6B68',
    accent: '#3A3A38', accentSolid: '#A8551F', cardBg: '#FFFFFF', cardBorder: '#E5E3DF',
  },
  festive: {
    bg: '#FBF6EF', bgAlt: '#F9F1E6', textPrimary: '#2A1E18', textSecondary: '#7A5D4E',
    accent: '#C8865C', accentSolid: '#8C3B2E', cardBg: '#FFFFFF', cardBorder: '#EAD9C6',
  },
  'natural-garden': {
    bg: '#F7FBF4', bgAlt: '#F3F9EE', textPrimary: '#1B2A1C', textSecondary: '#4A6741',
    accent: '#5C8A4D', accentSolid: '#2D4A38', cardBg: '#FFFFFF', cardBorder: '#D8E8CE',
  },
  'minimal-glass': {
    bg: '#F5F3FF', bgAlt: '#F9F3FC', textPrimary: '#23283A', textSecondary: '#5B6474',
    accent: '#A78BFA', accentSolid: '#6D4FC9',
    // 일반 카드(inv-card/inv-card-accent)는 항상 솔리드 — 글래스는 히어로 모노그램/D-day 카드 2곳 한정
    cardBg: '#FFFFFF', cardBorder: 'rgba(167,139,250,0.35)',
    isGlass: true,
    bgGrad: 'linear-gradient(160deg,#F5F3FF,#FDF2F8,#EEF2FF)',
    glassBg: 'rgba(255,255,255,0.55)',
    glassBorder: 'rgba(255,255,255,0.7)',
    glassShadow: '0 8px 32px rgba(31,38,135,0.12)',
  },
};

/** 폰트 2종(Pretendard Variable / Nanum Myeongjo) 이내로 제한 — 이미 layout.tsx에 로드된 CDN만 사용 */
function resolveFontVars(fontFamily: string): { display: string; body: string } {
  const body = `'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif`;
  const display =
    fontFamily === 'Nanum Myeongjo'
      ? `'Nanum Myeongjo', 'Pretendard Variable', serif`
      : body;
  return { display, body };
}

function generateInvitationPresetCss(
  designPreset: string,
  gradientFrom: string,
  gradientTo: string,
  fontFamily: string,
): string {
  const vars = INVITATION_PRESET_THEME[designPreset] ?? INVITATION_PRESET_THEME['elegant-gold'];
  const accentGlow = hexToRgba(vars.accent, 0.15);
  const accentSoft = hexToRgba(vars.accent, 0.07);
  const { display, body } = resolveFontVars(fontFamily);
  const safeGradFrom = esc(gradientFrom || vars.accent);
  const safeGradTo = esc(gradientTo || vars.accentSolid);

  let css = `/* invitation preset: ${esc(designPreset)} — auto-generated */
:root {
  --inv-bg: ${vars.bg};
  --inv-bg-alt: ${vars.bgAlt};
  --inv-text-primary: ${vars.textPrimary};
  --inv-text-secondary: ${vars.textSecondary};
  --inv-accent: ${vars.accent};
  --inv-accent-solid: ${vars.accentSolid};
  --inv-accent-glow: ${accentGlow};
  --inv-accent-soft: ${accentSoft};
  --inv-card-bg: ${vars.cardBg};
  --inv-card-border: ${vars.cardBorder};
  --inv-gradient-from: ${safeGradFrom};
  --inv-gradient-to: ${safeGradTo};
  --inv-font-display: ${display};
  --inv-font-body: ${body};`;

  if (vars.isGlass) {
    css += `
  --inv-bg-grad: ${vars.bgGrad ?? ''};
  --inv-glass-bg: ${vars.glassBg ?? ''};
  --inv-glass-border: ${vars.glassBorder ?? ''};
  --inv-glass-shadow: ${vars.glassShadow ?? ''};`;
  }

  css += `
}`;

  // 글래스모피즘은 minimal-glass 프리셋 한정, 히어로 모노그램 링 + D-day 카드 2곳에만 적용
  // (섹션당 유리 1개, 중첩 블러 금지 — inv-card/inv-card-accent 등 일반 카드는 항상 솔리드 유지)
  if (vars.isGlass) {
    css += `
.inv-hero-emoji-ring, .inv-dday-card {
  background: var(--inv-glass-bg);
  border-color: var(--inv-glass-border);
  box-shadow: var(--inv-glass-shadow);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
}
@supports not (backdrop-filter: blur(1px)) {
  .inv-hero-emoji-ring, .inv-dday-card {
    background: rgba(255,255,255,0.92);
  }
}`;
  }

  return css;
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
  message: {
    importName: 'MessageSection',
    importPath: '@/components/message-section',
    render: '<MessageSection config={siteConfig} />',
  },
  share: {
    importName: 'ShareSection',
    importPath: '@/components/share-section',
    render: '<ShareSection config={siteConfig} />',
  },
  rsvp: {
    importName: 'RsvpSection',
    importPath: '@/components/rsvp-section',
    render: '<RsvpSection config={siteConfig} />',
  },
  footer: {
    importName: 'FooterSection',
    importPath: '@/components/footer-section',
    render: '<FooterSection config={siteConfig} />',
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
  MessageSection: 'message',
  ShareSection: 'share',
  RsvpSection: 'rsvp',
  FooterSection: 'footer',
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
  const message = (state.values['message'] ?? {}) as Record<string, unknown>;
  const share = (state.values['share'] ?? {}) as Record<string, unknown>;
  const rsvp = (state.values['rsvp'] ?? {}) as Record<string, unknown>;
  const footer = (state.values['footer'] ?? {}) as Record<string, unknown>;

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
  eventType: process.env.NEXT_PUBLIC_EVENT_TYPE || '${esc(String(hero.eventType ?? 'wedding'))}',
  designPreset: '${esc(String(hero.designPreset ?? 'elegant-gold'))}',
  title: process.env.NEXT_PUBLIC_TITLE || '${esc(String(hero.title ?? ''))}',
  titleEn: '${esc(String(hero.titleEn ?? ''))}',
  subtitle: process.env.NEXT_PUBLIC_SUBTITLE || '${esc(String(hero.subtitle ?? ''))}',
  subtitleEn: '${esc(String(hero.subtitleEn ?? ''))}',
  heroImageUrl: ${heroImage ? imagePathExpr(heroImage) : "''"},
  gradientFrom: '${esc(String(hero.gradientFrom ?? '#F3E8CF'))}',
  gradientTo: '${esc(String(hero.gradientTo ?? '#FBF7F0'))}',
  fontFamily: '${esc(String(hero.fontFamily ?? 'Nanum Myeongjo'))}',

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

  // message
  messageTitle: '${esc(String(message.messageTitle ?? '인사말'))}',
  messageTitleEn: '${esc(String(message.messageTitleEn ?? 'Greeting'))}',
  messageBody: '${esc(String(message.messageBody ?? '차가운 계절에 만나\n서로의 온기가 된 두 사람이\n이제 하나의 이름으로 살아가려 합니다.\n\n귀한 걸음 하시어\n저희의 첫 시작을 축복해 주시면\n더없는 기쁨으로 간직하겠습니다.'))}',
  messageAlign: '${esc(String(message.align ?? 'center'))}' as 'center' | 'left',

  // share
  shareTitle: '${esc(String(share.shareTitle ?? '초대장 공유하기'))}',
  shareTitleEn: '${esc(String(share.shareTitleEn ?? 'Share'))}',
  enableKakao: ${share.enableKakao !== false},
  enableCopy: ${share.enableCopy !== false},
  enableQr: ${share.enableQr === true},
  kakaoJsKey: '${esc(String(share.kakaoJsKey ?? ''))}',

  // rsvp
  rsvpTitle: '${esc(String(rsvp.rsvpTitle ?? '참석 여부 회신'))}',
  rsvpTitleEn: '${esc(String(rsvp.rsvpTitleEn ?? 'RSVP'))}',
  rsvpDescription: '${esc(String(rsvp.rsvpDescription ?? '참석 여부를 미리 알려주시면 정성껏 준비하겠습니다'))}',
  rsvpUrl: '${esc(sanitizeUrl(String(rsvp.rsvpUrl ?? '')))}',
  rsvpButtonLabel: '${esc(String(rsvp.rsvpButtonLabel ?? '참석 여부 알리기'))}',

  // footer
  closingMessage: '${esc(String(footer.closingMessage ?? '저희 두 사람의 새로운 시작을 함께해 주셔서 감사합니다'))}',
  closingMessageEn: '${esc(String(footer.closingMessageEn ?? 'Thank you for celebrating the beginning of our new journey together.'))}',
  showPoweredBy: ${footer.showPoweredBy !== false},
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
  const gradientFrom = String(hero.gradientFrom ?? '#F3E8CF');
  const gradientTo = String(hero.gradientTo ?? '#FBF7F0');
  const fontFamily = String(hero.fontFamily ?? 'Nanum Myeongjo');
  const presetCss = generateInvitationPresetCss(designPreset, gradientFrom, gradientTo, fontFamily);

  return `import { siteConfig } from '@/lib/config';
${imports.join('\n')}

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`${presetCss}\` }} />
      <main className="min-h-screen" style={{ background: 'var(--inv-bg-grad, var(--inv-bg))' }}>
${sections.join('\n')}
      </main>
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
    heroVals.fontFamily = ext.extractString('fontFamily') ?? heroVals.fontFamily;

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
    const hostsArr = parseArrayConstant(configContent, /const DEMO_HOSTS[\s\S]*?\n\];/, 'name');
    if (hostsArr.length > 0) {
      (state.values['hosts'] as Record<string, unknown>).items = hostsArr;
    }

    // gallery
    const galleryArr = parseGalleryFromConfig(configContent);
    if (galleryArr.length > 0) {
      (state.values['gallery'] as Record<string, unknown>).images = galleryArr.map((url) => ({ url }));
    }

    // accounts
    const accountsArr = parseArrayConstant(configContent, /const DEMO_ACCOUNTS[\s\S]*?\n\];/, 'label');
    if (accountsArr.length > 0) {
      (state.values['account'] as Record<string, unknown>).items = accountsArr;
    }

    // contacts
    const contactsArr = parseArrayConstant(configContent, /const DEMO_CONTACTS[\s\S]*?\n\];/, 'name');
    if (contactsArr.length > 0) {
      (state.values['contact'] as Record<string, unknown>).items = contactsArr;
    }

    // message
    const msgVals = state.values['message'] as Record<string, unknown>;
    msgVals.messageTitle = ext.extractString('messageTitle') ?? msgVals.messageTitle;
    msgVals.messageTitleEn = ext.extractString('messageTitleEn') ?? msgVals.messageTitleEn;
    msgVals.messageBody = ext.extractString('messageBody') ?? msgVals.messageBody;
    msgVals.align = ext.extractString('messageAlign') ?? msgVals.align;

    // share
    const shareVals = state.values['share'] as Record<string, unknown>;
    shareVals.shareTitle = ext.extractString('shareTitle') ?? shareVals.shareTitle;
    shareVals.shareTitleEn = ext.extractString('shareTitleEn') ?? shareVals.shareTitleEn;
    shareVals.kakaoJsKey = ext.extractString('kakaoJsKey') ?? shareVals.kakaoJsKey;
    const enableKakaoMatch = /enableKakao:\s*(true|false)/.exec(siteBlock);
    if (enableKakaoMatch) shareVals.enableKakao = enableKakaoMatch[1] !== 'false';
    const enableCopyMatch = /enableCopy:\s*(true|false)/.exec(siteBlock);
    if (enableCopyMatch) shareVals.enableCopy = enableCopyMatch[1] !== 'false';
    const enableQrMatch = /enableQr:\s*(true|false)/.exec(siteBlock);
    if (enableQrMatch) shareVals.enableQr = enableQrMatch[1] === 'true';

    // rsvp
    const rsvpVals = state.values['rsvp'] as Record<string, unknown>;
    rsvpVals.rsvpTitle = ext.extractString('rsvpTitle') ?? rsvpVals.rsvpTitle;
    rsvpVals.rsvpTitleEn = ext.extractString('rsvpTitleEn') ?? rsvpVals.rsvpTitleEn;
    rsvpVals.rsvpDescription = ext.extractString('rsvpDescription') ?? rsvpVals.rsvpDescription;
    rsvpVals.rsvpUrl = ext.extractString('rsvpUrl') ?? rsvpVals.rsvpUrl;
    rsvpVals.rsvpButtonLabel = ext.extractString('rsvpButtonLabel') ?? rsvpVals.rsvpButtonLabel;

    // footer
    const footerVals = state.values['footer'] as Record<string, unknown>;
    footerVals.closingMessage = ext.extractString('closingMessage') ?? footerVals.closingMessage;
    footerVals.closingMessageEn = ext.extractString('closingMessageEn') ?? footerVals.closingMessageEn;
    const showPoweredByMatch = /showPoweredBy:\s*(true|false)/.exec(siteBlock);
    if (showPoweredByMatch) footerVals.showPoweredBy = showPoweredByMatch[1] !== 'false';
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
