import {
  esc,
  resolveImageSrc,
  getVal,
  getArr,
  getActiveModules,
  wrapInHtml,
} from './base';
import type { ModuleConfigState } from '@/lib/module-schema';

// ── Preset CSS ───────────────────────────────────

interface InvPresetVars {
  bg: string; bgAlt: string; textPrimary: string; textSecondary: string;
  accent: string; accentGlow: string; cardBg: string; cardBorder: string;
}

const PRESET_VARS: Record<string, InvPresetVars> = {
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

const EVENT_EMOJI: Record<string, string> = {
  gathering: '&#127881;', birthday: '&#127874;', wedding: '&#128141;',
  baby: '&#128118;', celebration: '&#127881;', corporate: '&#127970;', custom: '&#10024;',
};

// ── Section Renderers ────────────────────────────

function renderHero(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
  v: InvPresetVars,
): string {
  const title = getVal(state, 'hero', 'title', '');
  const subtitle = getVal(state, 'hero', 'subtitle', '');
  const eventType = getVal(state, 'hero', 'eventType', 'gathering');
  const heroImageUrl = getVal(state, 'hero', 'heroImageUrl', '');
  const gradientFrom = getVal(state, 'hero', 'gradientFrom', v.accent);
  const gradientTo = getVal(state, 'hero', 'gradientTo', v.accent);
  const emoji = EVENT_EMOJI[eventType] || EVENT_EMOJI.custom;

  const imgSrc = resolveImageSrc(heroImageUrl, liveUrl, imageMap);
  const bgStyle = imgSrc
    ? `background-image:url('${esc(imgSrc)}');background-size:cover;background-position:center;`
    : `background:linear-gradient(160deg,${esc(gradientFrom)},${esc(gradientTo)});`;

  return `
    <section class="inv-hero" style="${bgStyle}">
      ${imgSrc ? '<div class="inv-hero-overlay"></div>' : ''}
      <div class="inv-hero-vignette"></div>
      <div class="inv-hero-content">
        <div class="inv-hero-emoji-ring"><span class="inv-hero-emoji">${emoji}</span></div>
        <h1 class="inv-hero-title">${esc(title)}</h1>
        ${subtitle ? `<p class="inv-hero-subtitle">${esc(subtitle)}</p>` : ''}
        <div class="inv-hero-divider"></div>
      </div>
    </section>`;
}

function renderDday(state: ModuleConfigState, v: InvPresetVars): string {
  const dateLabel = getVal(state, 'dday', 'eventDateLabel', '');
  const showCountdown = getVal(state, 'dday', 'showCountdown', 'true') !== 'false';

  return `
    <section class="inv-section" style="background:${esc(v.bgAlt)};">
      ${showCountdown ? `
        <div class="inv-countdown">
          <div class="inv-countdown-card" style="background:${esc(v.cardBg)};border:1px solid ${esc(v.cardBorder)};">
            <span class="inv-countdown-num" style="color:${esc(v.accent)};">D-Day</span>
          </div>
        </div>` : ''}
      ${dateLabel ? `<p class="inv-date-label" style="color:${esc(v.textPrimary)};">${esc(dateLabel)}</p>` : ''}
    </section>`;
}

function renderHosts(state: ModuleConfigState, v: InvPresetVars, liveUrl: string, imageMap: Record<string, string>): string {
  const hostsTitle = getVal(state, 'hosts', 'hostsTitle', '초대하는 사람');
  const items = getArr(state, 'hosts', 'items');
  if (!items.length) return '';

  const hostsHtml = items.map((item) => {
    const h = item as Record<string, string>;
    const avatarSrc = resolveImageSrc(h.avatarUrl || '', liveUrl, imageMap);
    const avatar = avatarSrc
      ? `<img class="inv-host-avatar" src="${esc(avatarSrc)}" alt="${esc(h.name || '')}" />`
      : `<div class="inv-host-avatar inv-host-avatar--initial" style="background:linear-gradient(135deg,${esc(v.accent)},${esc(v.cardBorder)});color:#fff;">${esc((h.name || '?').charAt(0))}</div>`;
    return `
      <div class="inv-host">
        ${avatar}
        <p class="inv-host-role" style="color:${esc(v.textSecondary)};">${esc(h.role || '')}</p>
        <p class="inv-host-name" style="color:${esc(v.textPrimary)};">${esc(h.name || '')}</p>
        ${h.phone ? `<a href="tel:${esc(h.phone)}" class="inv-host-phone" style="color:${esc(v.accent)};">${esc(h.phone)}</a>` : ''}
      </div>`;
  }).join('');

  return `
    <section class="inv-section">
      <h2 class="inv-section-title" style="color:${esc(v.textPrimary)};">${esc(hostsTitle)}</h2>
      <div class="inv-hosts">${hostsHtml}</div>
    </section>`;
}

function renderLocation(state: ModuleConfigState, v: InvPresetVars): string {
  const venueName = getVal(state, 'location', 'venueName', '');
  const venueAddress = getVal(state, 'location', 'venueAddress', '');
  const kakaoMapUrl = getVal(state, 'location', 'kakaoMapUrl', '');
  const naverMapUrl = getVal(state, 'location', 'naverMapUrl', '');
  const parkingInfo = getVal(state, 'location', 'parkingInfo', '');
  const transitInfo = getVal(state, 'location', 'transitInfo', '');

  if (!venueName && !venueAddress) return '';

  const mapButtons = [
    kakaoMapUrl ? `<a href="${esc(kakaoMapUrl)}" target="_blank" rel="noopener noreferrer" class="inv-map-btn" style="background:#FEE500;color:#191919;">카카오맵</a>` : '',
    naverMapUrl ? `<a href="${esc(naverMapUrl)}" target="_blank" rel="noopener noreferrer" class="inv-map-btn" style="background:#03C75A;color:#fff;">네이버맵</a>` : '',
  ].filter(Boolean).join('');

  const infoLines = [
    parkingInfo ? `<p class="inv-info-line" style="color:${esc(v.textSecondary)};">&#128663; ${esc(parkingInfo)}</p>` : '',
    transitInfo ? `<p class="inv-info-line" style="color:${esc(v.textSecondary)};">&#128651; ${esc(transitInfo)}</p>` : '',
  ].filter(Boolean).join('');

  return `
    <section class="inv-section">
      <h2 class="inv-section-title" style="color:${esc(v.textPrimary)};">장소 안내</h2>
      <div class="inv-card" style="background:${esc(v.cardBg)};border:1px solid ${esc(v.cardBorder)};">
        ${venueName ? `<p class="inv-venue-name" style="color:${esc(v.textPrimary)};">${esc(venueName)}</p>` : ''}
        ${venueAddress ? `<p class="inv-venue-addr" style="color:${esc(v.textSecondary)};">${esc(venueAddress)}</p>` : ''}
        ${mapButtons ? `<div class="inv-map-buttons">${mapButtons}</div>` : ''}
        ${infoLines ? `<div class="inv-info-block" style="border-top:1px solid ${esc(v.cardBorder)};">${infoLines}</div>` : ''}
      </div>
    </section>`;
}

function renderGallery(state: ModuleConfigState, v: InvPresetVars, liveUrl: string, imageMap: Record<string, string>): string {
  const images = getArr(state, 'gallery', 'images');
  const columns = getVal(state, 'gallery', 'columns', '3');
  if (!images.length) return '';

  const imagesHtml = images.map((img) => {
    const src = resolveImageSrc((img as Record<string, string>).url || '', liveUrl, imageMap);
    return src ? `<div class="inv-gallery-item"><img src="${esc(src)}" loading="lazy" /></div>` : '';
  }).filter(Boolean).join('');

  return `
    <section class="inv-section">
      <h2 class="inv-section-title" style="color:${esc(v.textPrimary)};">갤러리</h2>
      <div class="inv-gallery" style="grid-template-columns:repeat(${esc(columns)},1fr);">${imagesHtml}</div>
    </section>`;
}

function renderAccount(state: ModuleConfigState, v: InvPresetVars): string {
  const accountTitle = getVal(state, 'account', 'accountTitle', '마음 전하기');
  const kakaoPayUrl = getVal(state, 'account', 'kakaoPayUrl', '');
  const items = getArr(state, 'account', 'items');

  if (!items.length && !kakaoPayUrl) return '';

  const accountsHtml = items.map((item) => {
    const a = item as Record<string, string>;
    return `
      <div class="inv-account-item" style="background:${esc(v.cardBg)};border:1px solid ${esc(v.cardBorder)};border-left:3px solid ${esc(v.accent)};">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.375rem;">
          <span class="inv-account-badge" style="background:${esc(v.accentGlow)};color:${esc(v.accent)};">${esc(a.label || '')}</span>
          <span style="font-size:0.8125rem;color:${esc(v.textSecondary)};">${esc(a.holder || '')}</span>
        </div>
        <p style="color:${esc(v.textPrimary)};font-weight:500;"><span style="color:${esc(v.textSecondary)};font-size:0.875rem;">${esc(a.bankName || '')}</span> ${esc(a.accountNumber || '')}</p>
      </div>`;
  }).join('');

  const kakaoBtn = kakaoPayUrl
    ? `<a href="${esc(kakaoPayUrl)}" target="_blank" rel="noopener noreferrer" class="inv-kakaopay-btn">카카오페이로 송금하기</a>`
    : '';

  return `
    <section class="inv-section" style="background:${esc(v.bgAlt)};">
      <h2 class="inv-section-title" style="color:${esc(v.textPrimary)};">${esc(accountTitle)}</h2>
      <div class="inv-accounts">${accountsHtml}</div>
      ${kakaoBtn}
    </section>`;
}

function renderContact(state: ModuleConfigState, v: InvPresetVars): string {
  const items = getArr(state, 'contact', 'items');
  if (!items.length) return '';

  const contactsHtml = items.map((item) => {
    const c = item as Record<string, string>;
    return `
      <div class="inv-contact-row" style="background:${esc(v.cardBg)};border:1px solid ${esc(v.cardBorder)};border-left:3px solid ${esc(v.accent)};">
        <div style="display:flex;align-items:center;gap:0.5rem;">
          ${c.role ? `<span class="inv-contact-role" style="background:${esc(v.accentGlow)};color:${esc(v.accent)};border:1px solid ${esc(v.accentGlow)};">${esc(c.role)}</span>` : ''}
          <span style="color:${esc(v.textPrimary)};font-weight:600;">${esc(c.name || '')}</span>
        </div>
        ${c.phone ? `<div style="display:flex;gap:0.5rem;">
          <a href="tel:${esc(c.phone)}" class="inv-btn-preview" style="background:${esc(v.accent)};color:#fff;">&#9742; 전화</a>
          <a href="sms:${esc(c.phone)}" class="inv-btn-preview" style="background:${esc(v.accentGlow)};color:${esc(v.accent)};">&#9993; 문자</a>
        </div>` : ''}
      </div>`;
  }).join('');

  return `
    <section class="inv-section">
      <h2 class="inv-section-title" style="color:${esc(v.textPrimary)};">연락처</h2>
      <div class="inv-contacts">${contactsHtml}</div>
    </section>`;
}

// ── CSS ──────────────────────────────────────────

function buildInvitationCSS(v: InvPresetVars): string {
  return `
    body { background: ${v.bg}; color: ${v.textPrimary}; margin: 0; font-family: 'Nanum Myeongjo', 'Pretendard Variable', serif; line-height: 1.7; -webkit-font-smoothing: antialiased; }
    * { box-sizing: border-box; }

    .inv-hero { position: relative; min-height: 65vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 6rem 1.5rem; }
    .inv-hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); }
    .inv-hero-vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%); }
    .inv-hero-content { position: relative; z-index: 1; max-width: 24rem; margin: 0 auto; }
    .inv-hero-emoji-ring { display: flex; align-items: center; justify-content: center; width: 96px; height: 96px; margin: 0 auto 2rem; border-radius: 50%; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); }
    .inv-hero-emoji { font-size: 3rem; line-height: 1; }
    .inv-hero-title { font-size: 1.875rem; font-weight: 700; color: #fff; line-height: 1.4; white-space: pre-line; text-shadow: 0 2px 16px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.08); letter-spacing: -0.01em; }
    .inv-hero-subtitle { margin-top: 1.25rem; font-size: 1rem; color: rgba(255,255,255,0.8); line-height: 1.6; letter-spacing: 0.04em; }
    .inv-hero-divider { margin: 2rem auto 0; width: 4rem; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); }

    .inv-section { padding: clamp(2.5rem, 6vw, 3.5rem) clamp(1.25rem, 5vw, 2rem); text-align: center; }
    .inv-section + .inv-section::before { content: ''; display: block; width: 60px; height: 1px; margin: 0 auto 0; background: linear-gradient(90deg, transparent, ${v.accent}, transparent); opacity: 0.3; }
    .inv-section-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; }

    .inv-countdown { display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 1.5rem; }
    .inv-countdown-card { width: 4rem; height: 5rem; display: flex; align-items: center; justify-content: center; border-radius: 0.75rem; text-align: center; background: ${v.cardBg}; border: 1px solid ${v.cardBorder}; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .inv-countdown-num { font-size: 1.75rem; font-weight: 700; }
    .inv-date-label { font-size: 1rem; font-weight: 500; }

    .inv-hosts { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1.25rem; max-width: 28rem; margin: 0 auto; }
    .inv-host { display: flex; flex-direction: column; align-items: center; text-align: center; background: ${v.cardBg}; border: 1px solid ${v.cardBorder}; border-radius: 1rem; padding: 1.5rem 1rem; position: relative; overflow: hidden; }
    .inv-host::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, ${v.accent}, ${v.cardBorder}); }
    .inv-host-avatar { width: 4.5rem; height: 4.5rem; border-radius: 50%; object-fit: cover; margin-bottom: 0.75rem; }
    .inv-host-avatar--initial { display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .inv-host-role { font-size: 0.8125rem; margin: 0; }
    .inv-host-name { font-weight: 600; font-size: 1rem; margin: 0.125rem 0 0; }
    .inv-host-phone { font-size: 0.8125rem; margin-top: 0.75rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1rem; border-radius: 999px; background: ${v.accentGlow}; color: ${v.accent}; }

    .inv-card { max-width: 28rem; margin: 0 auto; border-radius: 1rem; padding: 1.5rem; position: relative; overflow: hidden; background: ${v.cardBg}; border: 1px solid ${v.cardBorder}; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .inv-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, ${v.accent}, ${v.cardBorder}); }
    .inv-venue-name { font-size: 1.0625rem; font-weight: 600; margin: 0; }
    .inv-venue-addr { font-size: 0.875rem; margin: 0.125rem 0 0; }
    .inv-map-buttons { display: flex; gap: 0.75rem; margin-top: 1.25rem; }
    .inv-map-btn { flex: 1; text-align: center; padding: 0.75rem; border-radius: 999px; font-size: 0.875rem; font-weight: 500; text-decoration: none; min-height: 44px; display: flex; align-items: center; justify-content: center; }
    .inv-info-block { margin-top: 1.25rem; padding-top: 1.25rem; padding-left: 0.75rem; border-left: 3px solid ${v.accentGlow}; }
    .inv-info-line { font-size: 0.875rem; margin: 0.375rem 0; text-align: left; }

    .inv-gallery { display: grid; gap: 0.5rem; max-width: 28rem; margin: 0 auto; }
    .inv-gallery-item { aspect-ratio: 1; overflow: hidden; border-radius: 0.75rem; }
    .inv-gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }

    .inv-accounts { max-width: 28rem; margin: 0 auto; display: flex; flex-direction: column; gap: 0.75rem; }
    .inv-account-item { border-radius: 1rem; padding: 1.25rem; text-align: left; }
    .inv-account-badge { font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 999px; }
    .inv-kakaopay-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; max-width: 28rem; margin: 0.75rem auto 0; text-align: center; padding: 0.75rem; border-radius: 999px; background: #FEE500; color: #191919; font-weight: 500; font-size: 0.875rem; text-decoration: none; min-height: 44px; }

    .inv-contacts { max-width: 28rem; margin: 0 auto; display: flex; flex-direction: column; gap: 0.75rem; }
    .inv-contact-row { display: flex; align-items: center; justify-content: space-between; border-radius: 1rem; padding: 1rem 1.25rem; }
    .inv-contact-role { font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.625rem; border-radius: 999px; }
    .inv-btn-preview { font-size: 0.8125rem; font-weight: 500; text-decoration: none; padding: 0.5rem 1rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.375rem; min-height: 40px; }

    .inv-footer { padding: 1.5rem; text-align: center; font-size: 0.75rem; background: ${v.bgAlt}; color: ${v.textSecondary}; }
    .inv-footer a { opacity: 0.6; text-decoration: none; color: inherit; }

    @media (max-width: 640px) {
      .inv-hero-title { font-size: 1.5rem; }
      .inv-section-title { font-size: 1.125rem; }
    }
  `;
}

// ── Main Export ──────────────────────────────────

export function generateInvitationPreview(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
): string {
  const designPreset = getVal(state, 'hero', 'designPreset', 'elegant-gold');
  const fontFamily = getVal(state, 'hero', 'fontFamily', 'Nanum Myeongjo');
  const v = PRESET_VARS[designPreset] ?? PRESET_VARS['elegant-gold'];

  const activeModules = getActiveModules(state);

  const sectionRenderers: Record<string, () => string> = {
    hero: () => renderHero(state, liveUrl, imageMap, v),
    dday: () => renderDday(state, v),
    hosts: () => renderHosts(state, v, liveUrl, imageMap),
    location: () => renderLocation(state, v),
    gallery: () => renderGallery(state, v, liveUrl, imageMap),
    account: () => renderAccount(state, v),
    contact: () => renderContact(state, v),
  };

  const sections = activeModules
    .map((id) => {
      const render = sectionRenderers[id];
      return render ? render() : '';
    })
    .filter(Boolean)
    .join('');

  const bodyContent = `${sections}<div class="inv-footer"><a href="https://linkmap.pages.dev" target="_blank" rel="noopener noreferrer">Powered by Linkmap</a></div>`;
  const css = buildInvitationCSS(v);
  const font = fontFamily !== 'Pretendard Variable' ? fontFamily : undefined;

  return wrapInHtml(css, bodyContent, designPreset, font);
}
