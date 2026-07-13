// ──────────────────────────────────────────────
// Preview HTML Generation — Small Business (소상공인 가게 홍보)
// ──────────────────────────────────────────────

import {
  esc,
  resolveImageSrc,
  getVal,
  getArr,
  getActiveModules,
  buildBaseCSS,
  wrapInHtml,
} from './base';
import type { ModuleConfigState } from '@/lib/module-schema';

// ── Types ────────────────────────────────────────

interface MenuItem {
  category: string;
  name: string;
  nameEn: string;
  desc: string;
  descEn: string;
  price: string;
  emoji: string;
  imageUrl: string;
  isNew: boolean;
  isPopular: boolean;
}

interface HoursItem {
  day: string;
  dayEn: string;
  hours: string;
  hoursEn: string;
  isHoliday: boolean;
}

interface GalleryImage {
  url: string;
}

// ── Shared Section Renderers (small-biz-cafe에서 재사용) ──

export function renderSmallBizHeroSection(
  state: ModuleConfigState,
  _liveUrl: string,
  _imageMap: Record<string, string>,
  primaryColor: string,
): string {
  const name = getVal(state, 'hero', 'name', '가게 이름');
  const nameEn = getVal(state, 'hero', 'nameEn', '');
  const description = getVal(state, 'hero', 'description', '');
  const descriptionEn = getVal(state, 'hero', 'descriptionEn', '');
  const phone = getVal(state, 'hero', 'phone', '');

  return `
  <section class="sb-hero">
    <div class="sb-hero-bg"></div>
    <div class="sb-hero-circle sb-hero-circle-1"></div>
    <div class="sb-hero-circle sb-hero-circle-2"></div>
    <div class="sb-hero-circle sb-hero-circle-3"></div>
    <div class="sb-hero-noise"></div>
    <div class="sb-hero-content">
      <p class="sb-hero-category">소상공인<span class="sb-hero-category-dot"></span>${esc(name)}</p>
      <h1 class="sb-hero-name" style="color:${esc(primaryColor)}">${esc(name)}</h1>
      ${nameEn ? `<p class="sb-hero-name-en">${esc(nameEn)}</p>` : ''}
      <div class="sb-hero-divider"><span class="sb-hero-divider-line"></span><span style="font-size:0.625rem;">&#10022;</span><span class="sb-hero-divider-line"></span></div>
      ${description ? `<p class="sb-hero-slogan">&ldquo;${esc(description)}&rdquo;</p>` : ''}
      ${descriptionEn ? `<p class="sb-hero-desc-en">${esc(descriptionEn)}</p>` : ''}
      <div class="sb-hero-actions">
        <a href="#menu" class="sb-btn sb-btn-primary" style="background:${esc(primaryColor)}">메뉴 보기</a>
        ${phone ? `<a class="sb-btn sb-btn-outline" href="tel:${esc(phone)}">&#9742; 전화하기</a>` : ''}
      </div>
    </div>
  </section>`;
}

export function renderSmallBizMenuSection(
  state: ModuleConfigState,
  primaryColor: string,
  liveUrl: string = '',
  imageMap: Record<string, string> = {},
): string {
  const items = getArr(state, 'menu', 'items') as unknown as MenuItem[];
  if (items.length === 0) return '';

  // 카테고리별 그룹핑
  const grouped = new Map<string, MenuItem[]>();
  for (const item of items) {
    const cat = item.category || '기타';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(item);
  }

  let html = `<section class="sb-menu section-gap"><div class="section-inner">`;
  html += `<span class="section-label" style="color:${esc(primaryColor)}">MENU</span>`;
  html += `<h2 class="sb-section-title">메뉴</h2>`;

  for (const [category, menuItems] of grouped) {
    html += `<div class="sb-menu-category">`;
    html += `<h3 class="sb-menu-category-name">${esc(category)}</h3>`;
    html += `<div class="sb-menu-list">`;
    for (const item of menuItems) {
      const badges: string[] = [];
      if (item.isPopular) badges.push('<span class="sb-badge sb-badge--popular">인기</span>');
      if (item.isNew) badges.push('<span class="sb-badge sb-badge--new">NEW</span>');

      const menuImgSrc = item.imageUrl ? resolveImageSrc(item.imageUrl, liveUrl, imageMap) : '';
      html += `
      <div class="sb-menu-item">
        ${menuImgSrc ? `<img class="sb-menu-item-img" src="${esc(menuImgSrc)}" alt="${esc(item.name)}" />` : ''}
        <div class="sb-menu-item-left">
          ${item.emoji ? `<span class="sb-menu-emoji">${esc(item.emoji)}</span>` : ''}
          <div class="sb-menu-item-info">
            <div class="sb-menu-item-header">
              <span class="sb-menu-item-name">${esc(item.name)}</span>
              ${badges.join('')}
            </div>
            ${item.nameEn ? `<span class="sb-menu-item-name-en">${esc(item.nameEn)}</span>` : ''}
            ${item.desc ? `<p class="sb-menu-item-desc">${esc(item.desc)}</p>` : ''}
            ${item.descEn ? `<p class="sb-menu-item-desc" style="font-size:11px;color:#aaa;">${esc(item.descEn)}</p>` : ''}
          </div>
        </div>
        <span class="sb-menu-item-price" style="color:${esc(primaryColor)}">${esc(item.price)}</span>
      </div>`;
    }
    html += `</div></div>`;
  }

  html += `</div></section>`;
  return html;
}

export function renderSmallBizHoursSection(
  state: ModuleConfigState,
  primaryColor: string,
): string {
  const items = getArr(state, 'hours', 'items') as unknown as HoursItem[];
  if (items.length === 0) return '';

  let html = `<section class="sb-hours section-gap section-alt"><div class="section-inner">`;
  html += `<span class="section-label" style="color:${esc(primaryColor)}">HOURS</span>`;
  html += `<h2 class="sb-section-title">영업시간</h2>`;
  html += `<div class="sb-hours-table">`;

  for (const item of items) {
    const holidayClass = item.isHoliday ? ' sb-hours-row--holiday' : '';
    html += `
    <div class="sb-hours-row${holidayClass}">
      <span class="sb-hours-day">${esc(item.day)}${item.dayEn ? ` <span style="font-size:11px;color:#aaa;">${esc(item.dayEn)}</span>` : ''}</span>
      <span class="sb-hours-time">${esc(item.hours)}${item.hoursEn ? ` <span style="font-size:11px;color:#aaa;">${esc(item.hoursEn)}</span>` : ''}</span>
    </div>`;
  }

  html += `</div></div></section>`;
  return html;
}

export function renderSmallBizLocationSection(
  state: ModuleConfigState,
  primaryColor: string,
): string {
  const address = getVal(state, 'location', 'address', '');
  const addressEn = getVal(state, 'location', 'addressEn', '');
  const phone = getVal(state, 'hero', 'phone', '');

  if (!address) return '';

  return `
  <section class="sb-location section-gap"><div class="section-inner">
    <span class="section-label" style="color:${esc(primaryColor)}">LOCATION</span>
    <h2 class="sb-section-title">위치</h2>
    <div class="sb-location-card">
      <div class="sb-location-map-placeholder">
        <span class="sb-location-map-icon">&#128205;</span>
        <span>지도 영역</span>
      </div>
      <div class="sb-location-info">
        <p class="sb-location-address">&#128205; ${esc(address)}</p>
        ${addressEn ? `<p class="sb-location-address-en">${esc(addressEn)}</p>` : ''}
        ${phone ? `<p class="sb-location-phone">&#9742; ${esc(phone)}</p>` : ''}
      </div>
    </div>
  </div></section>`;
}

export function renderSmallBizGallerySection(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
  primaryColor: string,
): string {
  const images = getArr(state, 'gallery', 'images') as unknown as GalleryImage[];
  if (images.length === 0) return '';

  let html = `<section class="sb-gallery section-gap section-alt"><div class="section-inner">`;
  html += `<span class="section-label" style="color:${esc(primaryColor)}">GALLERY</span>`;
  html += `<h2 class="sb-section-title">갤러리</h2>`;
  html += `<div class="sb-gallery-grid">`;

  for (const img of images) {
    const src = resolveImageSrc(img.url, liveUrl, imageMap);
    if (src) {
      html += `
      <div class="sb-gallery-item">
        <img src="${esc(src)}" alt="갤러리 이미지" loading="lazy" />
      </div>`;
    }
  }

  html += `</div></div></section>`;
  return html;
}

export function renderSmallBizSnsSection(
  state: ModuleConfigState,
  primaryColor: string,
): string {
  const instagram = getVal(state, 'sns', 'instagramUrl', '');
  const naverBlog = getVal(state, 'sns', 'naverBlogUrl', '');
  const youtube = getVal(state, 'sns', 'youtubeUrl', '');
  const kakaoChannel = getVal(state, 'sns', 'kakaoChannelUrl', '');

  // 배포 산출물과 동일한 공식 브랜드 로고(인라인 SVG) — 신뢰성 있는 링크 표현
  const instagramIco = `<span class="sb-sns-ico" style="background:linear-gradient(135deg,#405de6,#5851db,#833ab4,#c13584,#e1306c,#fd1d1d)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="4" stroke="white" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/></svg></span>`;
  const naverIco = `<span class="sb-sns-ico" style="background:#03c75a"><svg width="11" height="11" viewBox="0 0 22 22" fill="none"><path d="M3 3h6.5l5.5 8V3H19v16h-6.5L7 11v8H3V3z" fill="white"/></svg></span>`;
  const youtubeIco = `<span class="sb-sns-ico" style="background:#ff0000"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81z" fill="white"/><path d="M9.55 15.57V8.43L15.82 12l-6.27 3.57z" fill="#ff0000"/></svg></span>`;
  const kakaoIco = `<span class="sb-sns-ico" style="background:#fee500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 3C7.03 3 3 6.36 3 10.5c0 2.65 1.6 4.97 4.01 6.33L6 21l4.5-2.5c.49.07.99.1 1.5.1 4.97 0 9-3.36 9-7.5S16.97 3 12 3z" fill="#3c1e1e"/></svg></span>`;

  const links: string[] = [];
  if (instagram) {
    links.push(`<a class="sb-sns-link" href="${esc(instagram)}" target="_blank" rel="noopener noreferrer" style="border-color:#e1306c">${instagramIco} 인스타그램</a>`);
  }
  if (naverBlog) {
    links.push(`<a class="sb-sns-link" href="${esc(naverBlog)}" target="_blank" rel="noopener noreferrer" style="border-color:#03c75a">${naverIco} 네이버 블로그</a>`);
  }
  if (youtube) {
    links.push(`<a class="sb-sns-link" href="${esc(youtube)}" target="_blank" rel="noopener noreferrer" style="border-color:#ff0000">${youtubeIco} 유튜브</a>`);
  }
  if (kakaoChannel) {
    links.push(`<a class="sb-sns-link" href="${esc(kakaoChannel)}" target="_blank" rel="noopener noreferrer" style="border-color:#fee500">${kakaoIco} 카카오톡 채널</a>`);
  }

  if (links.length === 0) return '';

  return `
  <section class="sb-sns section-gap"><div class="section-inner">
    <span class="section-label" style="color:${esc(primaryColor)}">SOCIAL</span>
    <h2 class="sb-section-title">SNS</h2>
    <div class="sb-sns-list">${links.join('')}</div>
  </div></section>`;
}

// ── CSS ──────────────────────────────────────────

export function buildSmallBizCSS(primaryColor: string): string {
  return `
/* ── Small Biz Template ── */

/* Hero — 배포 템플릿과 동일한 다크 그래디언트 + 장식 */
.sb-hero {
  position: relative;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 5rem 2rem 4rem;
}
.sb-hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, #1a1a1a 0%, #2a2520 35%, #3a302a 70%, #4a3f35 100%);
}
.sb-hero-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  pointer-events: none;
}
.sb-hero-circle-1 {
  width: 600px; height: 600px;
  top: -200px; right: -150px;
  background: radial-gradient(circle, #fde68a, transparent 70%);
}
.sb-hero-circle-2 {
  width: 400px; height: 400px;
  bottom: -100px; left: -80px;
  background: radial-gradient(circle, #fef3c7, transparent 70%);
  opacity: 0.12;
}
.sb-hero-circle-3 {
  width: 200px; height: 200px;
  top: 30%; left: 10%;
  background: radial-gradient(circle, #fffbeb, transparent 70%);
  opacity: 0.08;
}
.sb-hero-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.3;
}
.sb-hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 680px;
  color: #fff;
}
.sb-hero-category {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.75);
  margin-bottom: 1.5rem;
}
.sb-hero-category-dot {
  display: inline-block;
  width: 4px; height: 4px;
  border-radius: 50%;
  background: rgba(255,255,255,0.6);
  margin: 0 0.25rem;
}
.sb-hero-name {
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 0.5rem;
}
.sb-hero-name-en {
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  font-weight: 400;
  letter-spacing: 0.25em;
  color: rgba(255,255,255,0.65);
  margin: 0 0 2rem;
}
.sb-hero-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  color: rgba(255,255,255,0.5);
}
.sb-hero-divider-line {
  width: 48px;
  height: 1px;
  background: rgba(255,255,255,0.4);
}
.sb-hero-slogan {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-style: italic;
  color: rgba(255,255,255,0.9);
  font-weight: 400;
  margin: 0 0 1rem;
}
.sb-hero-desc-en {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.65);
  margin: 0 0 2.5rem;
}
.sb-hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.sb-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 28px;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity .2s, transform .2s;
  cursor: pointer;
  border: none;
}
.sb-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.sb-btn-primary { color: #fff; }
.sb-btn-outline {
  background: transparent;
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.4);
}

/* Section titles */
.sb-section-title {
  font-size: var(--text-section, 1.75rem);
  font-weight: 700;
  margin: 0 0 2rem;
  color: var(--text-primary);
}

/* Menu */
.sb-menu-category { margin-bottom: 2rem; }
.sb-menu-category:last-child { margin-bottom: 0; }
.sb-menu-category-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: ${primaryColor};
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${primaryColor}20;
}
.sb-menu-list { display: flex; flex-direction: column; gap: 0; }
.sb-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid var(--surface-border, #e5e7eb);
  gap: 1rem;
}
.sb-menu-item:last-child { border-bottom: none; }
.sb-menu-item-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  min-width: 0;
}
.sb-menu-emoji { font-size: 1.5rem; flex-shrink: 0; line-height: 1; margin-top: 2px; }
.sb-menu-item-info { flex: 1; min-width: 0; }
.sb-menu-item-header {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.sb-menu-item-name { font-size: 1rem; font-weight: 600; color: var(--text-primary); }
.sb-menu-item-name-en { font-size: 0.8rem; color: var(--text-secondary); display: block; margin-top: 1px; }
.sb-menu-item-desc { font-size: 0.85rem; color: var(--text-secondary); margin: 4px 0 0; line-height: 1.5; }
.sb-menu-item-img { width: 56px; height: 56px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.sb-menu-item-price {
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Badges */
.sb-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1.4;
}
.sb-badge--popular { background: #fef3c7; color: #92400e; }
.sb-badge--new { background: #dcfce7; color: #166534; }

/* Hours */
.sb-hours-table {
  background: var(--surface-elevated, #fff);
  border: 1px solid var(--surface-border, #e5e7eb);
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
}
.sb-hours-row {
  display: flex;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--surface-border, #e5e7eb);
  font-size: 0.95rem;
  transition: background .15s;
}
.sb-hours-row:last-child { border-bottom: none; }
.sb-hours-row:hover { background: var(--bg-alt, #f9fafb); }
.sb-hours-day { font-weight: 600; color: var(--text-primary); }
.sb-hours-time { color: var(--text-secondary); }
.sb-hours-row--holiday .sb-hours-day { color: #dc2626; }
.sb-hours-row--holiday .sb-hours-time { color: #dc2626; font-weight: 600; }

/* Location */
.sb-location-card {
  background: var(--surface-elevated, #fff);
  border: 1px solid var(--surface-border, #e5e7eb);
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
}
.sb-location-map-placeholder {
  height: 200px;
  background: var(--bg-alt, #f0f0f0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.95rem;
}
.sb-location-map-icon { font-size: 2rem; }
.sb-location-info { padding: 20px; }
.sb-location-address {
  font-size: 0.95rem;
  color: var(--text-primary);
  margin: 0 0 4px;
  font-weight: 500;
}
.sb-location-address-en {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0 0 8px;
}
.sb-location-phone {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Gallery */
.sb-gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
@media (min-width: 640px) {
  .sb-gallery-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
}
.sb-gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-sm, 10px);
  overflow: hidden;
}
.sb-gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .4s cubic-bezier(.4,0,.2,1);
}
.sb-gallery-item:hover img { transform: scale(1.05); }

/* SNS */
.sb-sns-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}
.sb-sns-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--surface-elevated, #fff);
  border: 1.5px solid;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
  transition: transform .2s, box-shadow .2s;
}
.sb-sns-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,.08);
}
.sb-sns-ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px; height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Footer */
.sb-footer {
  text-align: center;
  padding: 2rem 1.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  border-top: 1px solid var(--surface-border, #e5e7eb);
}
`;
}

// ── Main Generator ───────────────────────────────

export function generateSmallBizPreview(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
): string {
  const preset = getVal(state, 'hero', 'designPreset', 'default');
  const primaryColor = getVal(state, 'hero', 'primaryColor', '#c8a97e');
  const fontFamily = getVal(state, 'hero', 'fontFamily', 'Pretendard');
  const activeModules = getActiveModules(state);

  const sectionRenderers: Record<string, () => string> = {
    hero: () => renderSmallBizHeroSection(state, liveUrl, imageMap, primaryColor),
    menu: () => renderSmallBizMenuSection(state, primaryColor, liveUrl, imageMap),
    hours: () => renderSmallBizHoursSection(state, primaryColor),
    location: () => renderSmallBizLocationSection(state, primaryColor),
    gallery: () => renderSmallBizGallerySection(state, liveUrl, imageMap, primaryColor),
    sns: () => renderSmallBizSnsSection(state, primaryColor),
  };

  const sections = activeModules
    .map((id) => {
      const render = sectionRenderers[id];
      return render ? render() : '';
    })
    .filter(Boolean)
    .join('');

  const name = getVal(state, 'hero', 'name', '');
  const footer = `<footer class="sb-footer">&copy; ${new Date().getFullYear()} ${esc(name)}</footer>`;
  const bodyContent = `<main>${sections}</main>${footer}`;

  const baseCss = buildBaseCSS(preset);
  const templateCss = buildSmallBizCSS(primaryColor);
  const fullCss = `${baseCss}\n${templateCss}`;

  return wrapInHtml(fullCss, bodyContent, preset, fontFamily);
}
