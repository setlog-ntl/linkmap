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
// INVITATION_PRESET_THEME(generator/invitation.ts)과 3중 동기화된 팔레트.
// accentGlow/accentSoft는 accent 하나에서 파생시켜 프리셋별 오버라이드 누락(하드코딩 누수)을 원천 차단.

interface InvPresetVars {
  bg: string; bgAlt: string; textPrimary: string; textSecondary: string;
  /** 테두리·아이콘·대형 비텍스트 전용 */
  accent: string;
  /** 흰 글자 버튼/배지용 고대비 (AA 4.5:1 검증 완료) */
  accentSolid: string;
  cardBg: string; cardBorder: string;
  isGlass?: boolean;
  bgGrad?: string;
  glassBg?: string;
  glassBorder?: string;
  glassShadow?: string;
}

// 2차 개편("라이트 & 에어리 럭셔리"): bgAlt를 bg에 더 가깝게(섹션 배경 교차를 은은하게).
// generator(INVITATION_PRESET_THEME)와 3중 동기화 유지.
const PRESET_VARS: Record<string, InvPresetVars> = {
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
    accent: '#A78BFA', accentSolid: '#6D4FC9', cardBg: '#FFFFFF', cardBorder: 'rgba(167,139,250,0.35)',
    isGlass: true,
    bgGrad: 'linear-gradient(160deg,#F5F3FF,#FDF2F8,#EEF2FF)',
    glassBg: 'rgba(255,255,255,0.55)',
    glassBorder: 'rgba(255,255,255,0.7)',
    glassShadow: '0 8px 32px rgba(31,38,135,0.12)',
  },
};

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** 폰트 2종(Pretendard Variable / Nanum Myeongjo) 이내 — 본문은 항상 Pretendard 고정 */
function resolveFontVars(fontFamily: string): { display: string; body: string } {
  const body = `'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif`;
  const display = fontFamily === 'Nanum Myeongjo' ? `'Nanum Myeongjo', 'Pretendard Variable', serif` : body;
  return { display, body };
}

const EVENT_EYEBROW: Record<string, string> = {
  gathering: 'GATHERING', birthday: 'BIRTHDAY', wedding: 'WEDDING',
  baby: 'FIRST BIRTHDAY', celebration: 'CELEBRATION', corporate: 'COMPANY EVENT', custom: 'INVITATION',
};

// ── 파생 헬퍼 (신규 필드 없이 기존 필드에서 파생) ──

/** 호스트 이름 이니셜(최대 2인) → 없으면 타이틀 첫 글자로 폴백 */
function deriveInitials(hostsItems: unknown[], title: string): string {
  const names = hostsItems
    .map((h) => String((h as Record<string, string>).name || '').trim())
    .filter(Boolean)
    .slice(0, 2);
  if (names.length > 0) return names.map((n) => esc(n.charAt(0))).join(' &amp; ');
  return esc(title.trim().charAt(0) || '✦');
}

/** eventDate(YYYY-MM-DD)로 해당 월 미니 캘린더 그리드 생성 */
function buildMonthGridHtml(eventDate: string): string {
  const d = new Date(`${eventDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = d.getMonth();
  const eventDay = d.getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dows = ['일', '월', '화', '수', '목', '금', '토'];
  const dowRow = dows.map((dw) => `<div class="inv-cal-dow">${dw}</div>`).join('');
  const cells: string[] = [];
  for (let i = 0; i < firstDow; i++) cells.push('<div class="inv-cal-cell"></div>');
  for (let day = 1; day <= daysInMonth; day++) {
    const active = day === eventDay;
    cells.push(`<div class="inv-cal-cell${active ? ' inv-cal-cell--active' : ''}">${day}</div>`);
  }
  return `
    <div class="inv-cal">
      <p class="inv-cal-head">${year}.${String(month + 1).padStart(2, '0')}</p>
      <div class="inv-cal-grid">${dowRow}${cells.join('')}</div>
    </div>`;
}

// ── Section Renderers ────────────────────────────

function renderHero(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
): string {
  const title = getVal(state, 'hero', 'title', '');
  const subtitle = getVal(state, 'hero', 'subtitle', '');
  const eventType = getVal(state, 'hero', 'eventType', 'wedding');
  const heroImageUrl = getVal(state, 'hero', 'heroImageUrl', '');
  const dateLabel = getVal(state, 'dday', 'eventDateLabel', '');
  const hostsItems = getArr(state, 'hosts', 'items');
  const eyebrow = EVENT_EYEBROW[eventType] || EVENT_EYEBROW.custom;
  const initials = deriveInitials(hostsItems, title);

  const imgSrc = resolveImageSrc(heroImageUrl, liveUrl, imageMap);

  if (imgSrc) {
    // 이미지가 있으면 상단 아치형 프레임 + 솔리드 배경(다크 텍스트)
    return `
    <section class="inv-hero inv-hero--framed">
      <div class="inv-hero-content">
        <p class="inv-eyebrow">${esc(eyebrow)}</p>
        <div class="inv-hero-arch"><img src="${esc(imgSrc)}" loading="eager" alt="" /></div>
        <h1 class="inv-hero-title">${esc(title)}</h1>
        ${subtitle ? `<p class="inv-hero-subtitle">${esc(subtitle)}</p>` : ''}
        ${dateLabel ? `<p class="inv-hero-date">${esc(dateLabel)}</p>` : ''}
        <div class="inv-headline-divider"><span class="inv-headline-divider-mark">&#10022;</span></div>
      </div>
    </section>`;
  }

  // "라이트 & 에어리 럭셔리": 다크 풀블리드 그라디언트 대신 라이트 캔버스 위에
  // 저투명도 포인트 글로우(.inv-hero:not(.inv-hero--framed) 배경 규칙)만 얹는다 — 배포와 동일 구조
  return `
    <section class="inv-hero">
      <div class="inv-hero-noise"></div>
      <div class="inv-hero-orb inv-hero-orb-a"></div>
      <div class="inv-hero-orb inv-hero-orb-b"></div>
      <div class="inv-hero-content">
        <p class="inv-eyebrow">${esc(eyebrow)}</p>
        <div class="inv-monogram inv-hero-emoji-ring">${initials}</div>
        <h1 class="inv-hero-title">${esc(title)}</h1>
        ${subtitle ? `<p class="inv-hero-subtitle">${esc(subtitle)}</p>` : ''}
        ${dateLabel ? `<p class="inv-hero-date">${esc(dateLabel)}</p>` : ''}
        <div class="inv-headline-divider"><span class="inv-headline-divider-mark">&#10022;</span></div>
      </div>
      <div class="inv-hero-scroll-cue" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="color:var(--inv-text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
      </div>
    </section>`;
}

function renderDday(state: ModuleConfigState): string {
  const eventDate = getVal(state, 'dday', 'eventDate', '');
  const dateLabel = getVal(state, 'dday', 'eventDateLabel', '');
  const showCountdown = getVal(state, 'dday', 'showCountdown', 'true') !== 'false';
  const countdownStyle = getVal(state, 'dday', 'countdownStyle', 'flip');
  const calHtml = eventDate ? buildMonthGridHtml(eventDate) : '';

  const counters = ['DAYS', 'HOURS', 'MIN', 'SEC'].map((label, i) => {
    const val = i === 0 ? '00' : '00';
    return countdownStyle === 'simple'
      ? `<div class="inv-simple-counter"><span class="inv-simple-counter-num tabular-nums">${val}</span><span class="inv-counter-label">${label}</span></div>`
      : `<div class="inv-flip-wrap"><div class="inv-card inv-dday-card"><span class="tabular-nums inv-flip-num">${val}</span></div><span class="inv-counter-label">${label}</span></div>`;
  }).join('<div class="inv-colon-sep">:</div>');

  return `
    <section class="inv-section-decorated" style="background:var(--inv-bg-alt);">
      <p class="inv-eyebrow">COUNTDOWN</p>
      ${calHtml}
      ${showCountdown ? `<div class="inv-countdown">${counters}</div>` : ''}
      ${dateLabel ? `<p class="inv-date-label">${esc(dateLabel)}</p>` : ''}
    </section>`;
}

function renderHosts(state: ModuleConfigState, liveUrl: string, imageMap: Record<string, string>): string {
  const hostsTitle = getVal(state, 'hosts', 'hostsTitle', '초대하는 사람');
  const items = getArr(state, 'hosts', 'items');
  if (!items.length) return '';

  const hostsHtml = items.map((item) => {
    const h = item as Record<string, string>;
    const avatarSrc = resolveImageSrc(h.avatarUrl || '', liveUrl, imageMap);
    const avatar = avatarSrc
      ? `<img class="inv-host-avatar" src="${esc(avatarSrc)}" alt="${esc(h.name || '')}" loading="lazy" />`
      : `<div class="inv-host-avatar inv-host-avatar--initial">${esc((h.name || '?').charAt(0))}</div>`;
    return `
      <div class="inv-host">
        ${avatar}
        <p class="inv-host-role">${esc(h.role || '')}</p>
        <p class="inv-host-name">${esc(h.name || '')}</p>
        ${h.phone ? `<a href="tel:${esc(h.phone)}" class="inv-btn inv-btn-secondary inv-btn-sm"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>${esc(h.phone)}</a>` : ''}
      </div>`;
  }).join('');

  return `
    <section class="inv-section-decorated">
      <p class="inv-eyebrow">HOSTS</p>
      <h2 class="inv-section-title">${esc(hostsTitle)}</h2>
      <div class="inv-hosts">${hostsHtml}</div>
    </section>`;
}

function renderLocation(state: ModuleConfigState): string {
  const venueName = getVal(state, 'location', 'venueName', '');
  const venueAddress = getVal(state, 'location', 'venueAddress', '');
  const kakaoMapUrl = getVal(state, 'location', 'kakaoMapUrl', '');
  const naverMapUrl = getVal(state, 'location', 'naverMapUrl', '');
  const parkingInfo = getVal(state, 'location', 'parkingInfo', '');
  const transitInfo = getVal(state, 'location', 'transitInfo', '');

  if (!venueName && !venueAddress) return '';

  const mapButtons = [
    kakaoMapUrl ? `<a href="${esc(kakaoMapUrl)}" target="_blank" rel="noopener noreferrer" class="inv-btn inv-btn-kakao">카카오맵</a>` : '',
    naverMapUrl ? `<a href="${esc(naverMapUrl)}" target="_blank" rel="noopener noreferrer" class="inv-btn inv-btn-naver">네이버맵</a>` : '',
  ].filter(Boolean).join('');

  const detailsBlock = (parkingInfo || transitInfo)
    ? `<details class="inv-details">
        <summary>이용 안내</summary>
        <div class="inv-details-body">
        ${parkingInfo ? `<p class="inv-info-line"><strong>주차</strong> ${esc(parkingInfo)}</p>` : ''}
        ${transitInfo ? `<p class="inv-info-line"><strong>교통</strong> ${esc(transitInfo)}</p>` : ''}
        </div>
      </details>`
    : '';

  return `
    <section class="inv-section-decorated">
      <p class="inv-eyebrow">LOCATION</p>
      <h2 class="inv-section-title">장소 안내</h2>
      <div class="inv-card" style="max-width:28rem;margin:0 auto;padding:1.5rem;">
        ${venueName ? `<p class="inv-venue-name">${esc(venueName)}</p>` : ''}
        ${venueAddress ? `<div class="inv-venue-addr-row"><p class="inv-venue-addr">${esc(venueAddress)}</p><button class="inv-btn-icon-sm" type="button" aria-label="주소 복사"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>` : ''}
        ${mapButtons ? `<div class="inv-map-buttons">${mapButtons}</div>` : ''}
        ${detailsBlock}
      </div>
    </section>`;
}

function renderGallery(state: ModuleConfigState, liveUrl: string, imageMap: Record<string, string>): string {
  const images = getArr(state, 'gallery', 'images');
  if (!images.length) return '';

  const resolved = images
    .map((img) => resolveImageSrc((img as Record<string, string>).url || '', liveUrl, imageMap))
    .filter(Boolean);
  if (!resolved.length) return '';

  const itemsHtml = resolved.map((src, i) => {
    const big = i === 0 ? ' inv-gallery-item--lg' : '';
    return `<div class="inv-gallery-item${big}"><img src="${esc(src)}" loading="lazy" alt="" /></div>`;
  }).join('');

  return `
    <section class="inv-section-decorated">
      <p class="inv-eyebrow">GALLERY</p>
      <h2 class="inv-section-title">갤러리</h2>
      <div class="inv-gallery">${itemsHtml}</div>
    </section>`;
}

function renderAccount(state: ModuleConfigState): string {
  const accountTitle = getVal(state, 'account', 'accountTitle', '마음 전하기');
  const kakaoPayUrl = getVal(state, 'account', 'kakaoPayUrl', '');
  const items = getArr(state, 'account', 'items');

  if (!items.length && !kakaoPayUrl) return '';

  const accountsHtml = items.map((item) => {
    const a = item as Record<string, string>;
    return `
      <details class="inv-details inv-account-item">
        <summary>
          <span class="inv-account-badge">${esc(a.label || '')}</span>
          <span class="inv-account-holder">${esc(a.holder || '')}</span>
        </summary>
        <div class="inv-account-row">
          <p class="inv-account-num"><span class="inv-account-bank">${esc(a.bankName || '')}</span> <span class="tabular-nums">${esc(a.accountNumber || '')}</span></p>
          <button class="inv-btn inv-btn-secondary inv-btn-sm" type="button">복사</button>
        </div>
      </details>`;
  }).join('');

  const kakaoBtn = kakaoPayUrl
    ? `<a href="${esc(kakaoPayUrl)}" target="_blank" rel="noopener noreferrer" class="inv-btn inv-btn-kakao" style="width:100%;margin-top:0.5rem;">카카오페이로 송금하기</a>`
    : '';

  return `
    <section class="inv-section-decorated" style="background:var(--inv-bg-alt);">
      <p class="inv-eyebrow">GIFT</p>
      <h2 class="inv-section-title">${esc(accountTitle)}</h2>
      <div class="inv-accounts">${accountsHtml}</div>
      ${kakaoBtn}
    </section>`;
}

function renderContact(state: ModuleConfigState): string {
  const items = getArr(state, 'contact', 'items');
  if (!items.length) return '';

  const contactsHtml = items.map((item) => {
    const c = item as Record<string, string>;
    return `
      <div class="inv-card-accent inv-contact-row">
        <div class="inv-contact-name-row">
          ${c.role ? `<span class="inv-contact-role">${esc(c.role)}</span>` : ''}
          <span class="inv-contact-name">${esc(c.name || '')}</span>
        </div>
        ${c.phone ? `<div class="inv-contact-actions">
          <a href="tel:${esc(c.phone)}" class="inv-btn inv-btn-secondary inv-btn-sm"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>전화</a>
          <a href="sms:${esc(c.phone)}" class="inv-btn inv-btn-secondary inv-btn-sm"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>문자</a>
        </div>` : ''}
      </div>`;
  }).join('');

  return `
    <section class="inv-section-decorated">
      <p class="inv-eyebrow">CONTACT</p>
      <h2 class="inv-section-title">연락처</h2>
      <div class="inv-contacts">${contactsHtml}</div>
    </section>`;
}

function renderMessage(state: ModuleConfigState): string {
  const messageTitle = getVal(state, 'message', 'messageTitle', '인사말');
  const messageBody = getVal(state, 'message', 'messageBody', '');
  const align = getVal(state, 'message', 'align', 'center');
  if (!messageBody) return '';
  return `
    <section class="inv-section-decorated">
      <p class="inv-eyebrow">GREETING</p>
      <h2 class="inv-section-title">${esc(messageTitle)}</h2>
      <div class="inv-headline-divider"><span class="inv-headline-divider-mark">&#10022;</span></div>
      <p class="inv-message-body" style="text-align:${esc(align)};">${esc(messageBody)}</p>
      <div class="inv-headline-divider"><span class="inv-headline-divider-mark">&#10022;</span></div>
    </section>`;
}

function renderShare(state: ModuleConfigState): string {
  const shareTitle = getVal(state, 'share', 'shareTitle', '초대장 공유하기');
  const enableKakao = getVal(state, 'share', 'enableKakao', 'true') !== 'false';
  const enableCopy = getVal(state, 'share', 'enableCopy', 'true') !== 'false';
  const enableQr = getVal(state, 'share', 'enableQr', 'false') === 'true';
  if (!enableKakao && !enableCopy && !enableQr) return '';
  const kakaoBtn = enableKakao
    ? `<button class="inv-btn-icon inv-btn-icon-kakao" type="button" aria-label="카카오톡 공유"><svg width="20" height="20" viewBox="0 0 24 24" fill="#191919"><path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.8 5.22 4.5 6.6-.2.73-.72 2.65-.82 3.06-.13.5.18.49.38.36.16-.11 2.5-1.7 3.51-2.39.47.07.95.1 1.43.1 5.52 0 10-3.58 10-7.73C22 6.58 17.52 3 12 3z"/></svg></button>`
    : '';
  const copyBtn = enableCopy
    ? `<button class="inv-btn-icon inv-btn-icon-secondary" type="button" aria-label="링크 복사"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></button>`
    : '';
  const qrBlock = enableQr
    ? `<details class="inv-details" style="text-align:center;"><summary style="justify-content:center;">QR 코드 보기</summary><div class="inv-qr-placeholder">QR</div></details>`
    : '';
  return `
    <section class="inv-section-decorated" style="background:var(--inv-bg-alt);text-align:center;">
      <p class="inv-eyebrow">SHARE</p>
      <h2 class="inv-section-title">${esc(shareTitle)}</h2>
      <div class="inv-share-row">${kakaoBtn}${copyBtn}</div>
      ${qrBlock}
    </section>`;
}

function renderRsvp(state: ModuleConfigState): string {
  const rsvpTitle = getVal(state, 'rsvp', 'rsvpTitle', '참석 여부 회신');
  const rsvpDescription = getVal(state, 'rsvp', 'rsvpDescription', '');
  const rsvpUrl = getVal(state, 'rsvp', 'rsvpUrl', '');
  const rsvpButtonLabel = getVal(state, 'rsvp', 'rsvpButtonLabel', '참석 여부 알리기');
  if (!rsvpUrl) return '';
  return `
    <section class="inv-section-decorated" style="text-align:center;">
      <p class="inv-eyebrow">RSVP</p>
      <h2 class="inv-section-title">${esc(rsvpTitle)}</h2>
      <div class="inv-card" style="max-width:28rem;margin:0 auto;padding:1.75rem 2rem;">
        ${rsvpDescription ? `<p class="inv-rsvp-desc">${esc(rsvpDescription)}</p>` : ''}
        <a href="${esc(rsvpUrl)}" target="_blank" rel="noopener noreferrer" class="inv-btn inv-btn-primary" style="width:100%;">${esc(rsvpButtonLabel)}</a>
      </div>
    </section>`;
}

function renderFooter(state: ModuleConfigState): string {
  const closingMessage = getVal(state, 'footer', 'closingMessage', '');
  const showPoweredBy = getVal(state, 'footer', 'showPoweredBy', 'true') !== 'false';
  const title = getVal(state, 'hero', 'title', '');
  const hostsItems = getArr(state, 'hosts', 'items');
  const initials = deriveInitials(hostsItems, title);
  const poweredBy = showPoweredBy
    ? `<a href="https://linkmap.pages.dev" target="_blank" rel="noopener noreferrer">Powered by Linkmap</a>`
    : '';
  return `
    <div class="inv-footer">
      <div class="inv-monogram inv-monogram-sm">${initials}</div>
      ${closingMessage ? `<p class="inv-closing">${esc(closingMessage)}</p>` : ''}
      ${poweredBy}
    </div>`;
}

// ── CSS ──────────────────────────────────────────

function buildInvitationCSS(v: InvPresetVars, fontFamily: string, gradientFrom: string, gradientTo: string): string {
  const accentGlow = hexToRgba(v.accent, 0.15);
  const accentSoft = hexToRgba(v.accent, 0.07);
  const { display, body } = resolveFontVars(fontFamily);
  const bodyBg = v.isGlass ? (v.bgGrad ?? v.bg) : v.bg;

  const glassCss = v.isGlass
    ? `
    .inv-hero-emoji-ring, .inv-dday-card {
      background: ${v.glassBg}; border-color: ${v.glassBorder}; box-shadow: ${v.glassShadow};
      backdrop-filter: blur(16px) saturate(140%); -webkit-backdrop-filter: blur(16px) saturate(140%);
    }
    @supports not (backdrop-filter: blur(1px)) {
      .inv-hero-emoji-ring, .inv-dday-card { background: rgba(255,255,255,0.92); }
    }`
    : '';

  return `
    :root {
      --inv-bg: ${v.bg}; --inv-bg-alt: ${v.bgAlt};
      --inv-text-primary: ${v.textPrimary}; --inv-text-secondary: ${v.textSecondary};
      --inv-accent: ${v.accent}; --inv-accent-solid: ${v.accentSolid};
      --inv-accent-glow: ${accentGlow}; --inv-accent-soft: ${accentSoft};
      --inv-gradient-from: ${gradientFrom}; --inv-gradient-to: ${gradientTo};
      --inv-card-bg: ${v.cardBg}; --inv-card-border: ${v.cardBorder};
      --inv-font-display: ${display}; --inv-font-body: ${body};
      --inv-shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
      --inv-shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
      --inv-radius-lg: 16px;
      --inv-section-py: clamp(3.5rem, 9vw, 5.5rem); --inv-section-px: clamp(1.25rem, 5vw, 2rem);
    }
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { background: ${bodyBg}; color: var(--inv-text-primary); margin: 0; font-family: var(--inv-font-body); font-size: 15px; line-height: 1.7; -webkit-font-smoothing: antialiased; }

    .tabular-nums { font-variant-numeric: tabular-nums; }

    /* ── Eyebrow / Section title / Divider / Monogram ── */
    .inv-eyebrow { display:block; font-size:11px; text-transform:uppercase; letter-spacing:.16em; font-weight:600; color:var(--inv-accent-solid); margin-bottom:.5rem; text-align:center; }
    .inv-section-title { position:relative; display:inline-block; font-family:var(--inv-font-display); font-size:1.25rem; font-weight:600; color:var(--inv-text-primary); padding-bottom:.75rem; margin:0 0 1.5rem; }
    .inv-section-title::after { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:2rem; height:2px; background:linear-gradient(90deg,var(--inv-accent),var(--inv-accent-solid)); }
    .inv-headline-divider { display:flex; align-items:center; gap:.75rem; max-width:200px; margin:1.5rem auto; color:var(--inv-card-border); }
    .inv-headline-divider::before, .inv-headline-divider::after { content:''; flex:1; height:1px; background:currentColor; opacity:.28; }
    .inv-headline-divider-mark { font-size:.7rem; color:var(--inv-accent); opacity:.7; }
    .inv-monogram { width:60px; height:60px; border-radius:50%; border:1px solid var(--inv-accent); display:flex; align-items:center; justify-content:center; font-family:var(--inv-font-display); font-size:1.35rem; color:var(--inv-text-primary); margin:0 auto 1.25rem; }
    .inv-monogram-sm { width:30px; height:30px; font-size:.8rem; color:var(--inv-text-secondary); border-color:var(--inv-card-border); margin-bottom:.75rem; }

    /* ── Section layout ── */
    .inv-section-decorated { padding:var(--inv-section-py) var(--inv-section-px); text-align:center; }

    /* ── Hero ── */
    .inv-hero { position:relative; min-height:88vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:5rem 1.5rem; overflow:hidden; background-color:var(--inv-bg); }
    /* 사진이 없을 때만 상단/모서리에 은은한 포인트 글로우(저투명도 틴트) — 풀블리드 금지 */
    .inv-hero:not(.inv-hero--framed) {
      background-image:
        radial-gradient(120% 60% at 50% 0%, color-mix(in srgb, var(--inv-gradient-from) 16%, transparent) 0%, transparent 60%),
        radial-gradient(90% 55% at 88% 100%, color-mix(in srgb, var(--inv-gradient-to) 10%, transparent) 0%, transparent 65%);
    }
    .inv-hero-noise { position:absolute; inset:0; opacity:.025; mix-blend-mode:overlay; pointer-events:none; background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"); }
    /* Floating ambient orbs — 저채도 accent-soft 글로우(패럴랙스 아닌 순수 transform 루프) */
    .inv-hero-orb { position:absolute; border-radius:50%; pointer-events:none; background:radial-gradient(circle, var(--inv-accent-soft) 0%, transparent 70%); animation:float-slow 12s ease-in-out infinite; }
    .inv-hero-orb-a { top:12%; left:6%; width:200px; height:200px; }
    .inv-hero-orb-b { bottom:16%; right:4%; width:160px; height:160px; animation-delay:-6s; }
    .inv-hero-content { position:relative; z-index:1; max-width:24rem; margin:0 auto; }
    .inv-hero-title { font-family:var(--inv-font-display); font-size:clamp(26px,7vw,34px); font-weight:700; line-height:1.4; letter-spacing:-0.01em; white-space:pre-line; color:var(--inv-text-primary); margin:0; }
    .inv-hero-subtitle { margin:1rem 0 0; font-size:1rem; color:var(--inv-text-secondary); line-height:1.6; }
    .inv-hero-date { margin-top:.75rem; font-size:.75rem; text-transform:uppercase; letter-spacing:.12em; font-weight:600; color:var(--inv-text-secondary); }
    .inv-hero-arch { width:min(66vw,260px); aspect-ratio:3/4; margin:0 auto 1.5rem; overflow:hidden; border-top-left-radius:100% clamp(48px,16vw,72px); border-top-right-radius:100% clamp(48px,16vw,72px); box-shadow:var(--inv-shadow-lg); }
    .inv-hero-arch img { width:100%; height:100%; object-fit:cover; }
    .inv-hero--framed { background:var(--inv-bg); min-height:auto; padding:4rem 1.5rem 3rem; }
    .inv-hero-scroll-cue { position:absolute; bottom:1.5rem; left:50%; transform:translateX(-50%); opacity:.7; }
    @keyframes float-slow { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(10px, -10px) scale(1.02); } 66% { transform: translate(-5px, 5px) scale(0.98); } }

    /* ── D-day / Calendar ── */
    .inv-cal { max-width:220px; margin:0 auto 1.5rem; }
    .inv-cal-head { font-size:.75rem; font-weight:600; letter-spacing:.06em; color:var(--inv-text-secondary); margin:0 0 .5rem; }
    .inv-cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
    .inv-cal-dow { font-size:.625rem; letter-spacing:0.05em; color:var(--inv-text-secondary); opacity:.6; padding:2px 0; }
    .inv-cal-cell { aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:.6875rem; color:var(--inv-text-secondary); border-radius:50%; font-variant-numeric:tabular-nums; }
    .inv-cal-cell--active { background:var(--inv-accent-solid); color:#fff; font-weight:700; }
    .inv-countdown { display:flex; justify-content:center; align-items:flex-end; gap:.5rem; margin:0 0 1rem; }
    .inv-flip-wrap, .inv-simple-counter { display:flex; flex-direction:column; align-items:center; gap:.375rem; }
    .inv-dday-card { width:56px; height:70px; display:flex; align-items:center; justify-content:center; }
    .inv-flip-num { font-size:1.5rem; font-weight:700; color:var(--inv-accent-solid); }
    .inv-simple-counter-num { font-size:1.75rem; font-weight:700; color:var(--inv-accent-solid); line-height:1.2; }
    .inv-counter-label { font-size:.625rem; text-transform:lowercase; letter-spacing:.1em; font-weight:600; color:var(--inv-text-secondary); }
    .inv-colon-sep { font-size:1.125rem; font-weight:300; color:var(--inv-text-secondary); padding-bottom:1.25rem; }
    .inv-date-label { font-size:.9375rem; font-weight:500; color:var(--inv-text-primary); }

    /* ── Card system ── */
    .inv-card { position:relative; background:var(--inv-card-bg); border:1px solid var(--inv-card-border); border-radius:var(--inv-radius-lg); box-shadow:var(--inv-shadow-card); overflow:hidden; }
    .inv-card-accent { background:var(--inv-card-bg); border:1px solid var(--inv-card-border); border-left:3px solid var(--inv-accent); border-radius:var(--inv-radius-lg); box-shadow:var(--inv-shadow-card); }

    /* ── Button system ── */
    .inv-btn { display:inline-flex; align-items:center; justify-content:center; gap:.5rem; font-weight:500; border-radius:999px; min-height:44px; padding:.625rem 1.25rem; font-size:.875rem; text-decoration:none; border:none; cursor:pointer; }
    .inv-btn-sm { min-height:44px; padding:.5rem 1rem; font-size:.8125rem; }
    .inv-btn-primary { background:var(--inv-accent-solid); color:#fff; }
    .inv-btn-secondary { background:var(--inv-accent-glow); color:var(--inv-accent-solid); }
    .inv-btn-kakao { background:#FEE500; color:#191919; }
    .inv-btn-naver { background:#03C75A; color:#fff; }
    .inv-btn-icon, .inv-btn-icon-sm { border:none; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; border-radius:50%; }
    .inv-btn-icon { width:48px; height:48px; font-size:1.25rem; }
    .inv-btn-icon-kakao { background:#FEE500; color:#191919; }
    .inv-btn-icon-secondary { background:var(--inv-accent-glow); color:var(--inv-accent-solid); }
    .inv-btn-icon-sm { width:36px; height:36px; background:var(--inv-accent-glow); color:var(--inv-accent-solid); font-size:.875rem; flex-shrink:0; }
    .inv-share-row { display:flex; gap:.75rem; justify-content:center; margin-bottom:1rem; }

    /* ── Hosts ── */
    .inv-hosts { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:1.25rem; max-width:28rem; margin:0 auto; }
    .inv-host { display:flex; flex-direction:column; align-items:center; text-align:center; background:var(--inv-card-bg); border:1px solid var(--inv-card-border); border-radius:var(--inv-radius-lg); padding:1.5rem 1rem; }
    .inv-host-avatar { width:4.5rem; height:4.5rem; border-radius:50%; object-fit:cover; margin-bottom:.75rem; }
    .inv-host-avatar--initial { display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:700; background:var(--inv-accent-soft); border:1px solid var(--inv-accent); color:var(--inv-accent-solid); }
    .inv-host-role { font-size:.75rem; text-transform:uppercase; letter-spacing:.08em; color:var(--inv-text-secondary); margin:0; }
    .inv-host-name { font-family:var(--inv-font-display); font-weight:600; font-size:1.0625rem; color:var(--inv-text-primary); margin:.25rem 0 .75rem; }

    /* ── Location ── */
    .inv-venue-name { font-size:1.0625rem; font-weight:600; color:var(--inv-text-primary); margin:0; }
    .inv-venue-addr-row { display:flex; align-items:center; justify-content:space-between; gap:.5rem; margin-top:.25rem; }
    .inv-venue-addr { font-size:.875rem; color:var(--inv-text-secondary); margin:0; }
    .inv-map-buttons { display:flex; gap:.75rem; margin-top:1.25rem; }
    .inv-map-buttons .inv-btn { flex:1; }
    .inv-info-line { font-size:.875rem; color:var(--inv-text-secondary); margin:.375rem 0; text-align:left; }

    /* ── Details/Summary (native accordion) ── */
    .inv-details { margin-top:1rem; padding-top:.75rem; border-top:1px solid var(--inv-card-border); text-align:left; }
    .inv-details summary { cursor:pointer; list-style:none; display:flex; align-items:center; justify-content:space-between; gap:.375rem; font-size:.875rem; color:var(--inv-text-secondary); font-weight:500; }
    .inv-details summary::-webkit-details-marker { display:none; }
    .inv-details summary::after { content:'+'; font-weight:400; }
    .inv-details[open] summary::after { content:'\\2212'; }

    /* ── Gallery ── */
    .inv-gallery { display:grid; grid-template-columns:repeat(3,1fr); gap:.5rem; max-width:28rem; margin:0 auto; }
    .inv-gallery-item { aspect-ratio:1; overflow:hidden; border-radius:.75rem; }
    .inv-gallery-item--lg { grid-column:span 2; grid-row:span 2; }
    .inv-gallery-item img { width:100%; height:100%; object-fit:cover; }

    /* ── Account ── */
    .inv-accounts { max-width:28rem; margin:0 auto; display:flex; flex-direction:column; gap:.75rem; }
    .inv-account-item summary { padding-bottom:0; border:none; }
    .inv-account-badge { font-size:.75rem; font-weight:600; color:var(--inv-accent-solid); background:var(--inv-accent-glow); padding:.25rem .75rem; border-radius:999px; }
    .inv-account-holder { font-size:.8125rem; color:var(--inv-text-secondary); }
    .inv-account-row { display:flex; align-items:center; justify-content:space-between; margin-top:.75rem; }
    .inv-account-num { color:var(--inv-text-primary); font-weight:500; margin:0; }
    .inv-account-bank { font-size:.875rem; color:var(--inv-text-secondary); }

    /* ── Contact ── */
    .inv-contacts { max-width:28rem; margin:0 auto; display:flex; flex-direction:column; gap:.75rem; }
    .inv-contact-row { display:flex; align-items:center; justify-content:space-between; padding:1rem 1.25rem; }
    .inv-contact-name-row { display:flex; align-items:center; gap:.5rem; }
    .inv-contact-role { font-size:.75rem; font-weight:600; padding:.25rem .625rem; border-radius:999px; background:var(--inv-accent-glow); color:var(--inv-accent-solid); }
    .inv-contact-name { font-weight:600; color:var(--inv-text-primary); }
    .inv-contact-actions { display:flex; gap:.5rem; }

    /* ── Message / RSVP ── */
    .inv-message-body { white-space:pre-line; font-size:1rem; line-height:1.9; color:var(--inv-text-primary); max-width:26rem; margin:0 auto; }
    .inv-rsvp-desc { font-size:.9375rem; color:var(--inv-text-secondary); line-height:1.7; margin:0 0 1.25rem; white-space:pre-line; }
    .inv-qr-placeholder { width:120px; height:120px; margin:.75rem auto 0; background:var(--inv-card-bg); border:1px solid var(--inv-card-border); border-radius:.75rem; display:flex; align-items:center; justify-content:center; font-size:.75rem; color:var(--inv-text-secondary); }

    /* ── Footer ── */
    .inv-footer { padding:2.5rem 1.5rem; text-align:center; font-size:.75rem; background:var(--inv-bg-alt); color:var(--inv-text-secondary); padding-bottom:calc(2.5rem + env(safe-area-inset-bottom)); }
    .inv-footer a { opacity:.6; text-decoration:none; color:inherit; }
    .inv-closing { font-family:var(--inv-font-display); font-style:italic; white-space:pre-line; font-size:.9375rem; line-height:1.8; color:var(--inv-text-secondary); max-width:22rem; margin:0 auto 1.25rem; }

    ${glassCss}

    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; } }
    *:focus-visible { outline:2px solid var(--inv-accent-solid); outline-offset:2px; }
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
  const gradientFrom = getVal(state, 'hero', 'gradientFrom', v.accent);
  const gradientTo = getVal(state, 'hero', 'gradientTo', v.accentSolid);

  const activeModules = getActiveModules(state);

  const sectionRenderers: Record<string, () => string> = {
    hero: () => renderHero(state, liveUrl, imageMap),
    dday: () => renderDday(state),
    hosts: () => renderHosts(state, liveUrl, imageMap),
    location: () => renderLocation(state),
    gallery: () => renderGallery(state, liveUrl, imageMap),
    account: () => renderAccount(state),
    contact: () => renderContact(state),
    message: () => renderMessage(state),
    share: () => renderShare(state),
    rsvp: () => renderRsvp(state),
    footer: () => renderFooter(state),
  };

  const sections = activeModules
    .map((id) => {
      const render = sectionRenderers[id];
      return render ? render() : '';
    })
    .filter(Boolean)
    .join('');

  // If footer module is not active, fall back to a minimal powered-by footer
  const hasFooterModule = activeModules.includes('footer');
  const fallbackFooter = hasFooterModule
    ? ''
    : `<div class="inv-footer"><a href="https://linkmap.pages.dev" target="_blank" rel="noopener noreferrer">Powered by Linkmap</a></div>`;
  const bodyContent = `${sections}${fallbackFooter}`;

  // fontFamily는 CSS 변수(--inv-font-display/body)로만 제어 — wrapInHtml의 body 전역 오버라이드는
  // 본문까지 세리프로 바꿔버리므로(폰트 2종 제약 위반) 사용하지 않음. Nanum Myeongjo 웹폰트만 CSS @import로 보강.
  const fontImport = fontFamily === 'Nanum Myeongjo'
    ? `@import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');\n`
    : '';
  const css = fontImport + buildInvitationCSS(v, fontFamily, gradientFrom, gradientTo);

  return wrapInHtml(css, bodyContent, designPreset);
}
