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
    <div class="sb-hero-overlay"></div>
    <div class="sb-hero-content">
      <h1 class="sb-hero-name" style="color:${esc(primaryColor)}">${esc(name)}</h1>
      ${nameEn ? `<p class="sb-hero-name-en">${esc(nameEn)}</p>` : ''}
      <p class="sb-hero-desc">${esc(description)}</p>
      ${descriptionEn ? `<p class="sb-hero-desc-en">${esc(descriptionEn)}</p>` : ''}
      ${phone ? `<a class="sb-hero-phone" href="tel:${esc(phone)}">&#9742; ${esc(phone)}</a>` : ''}
    </div>
  </section>`;
}

export function renderSmallBizMenuSection(
  state: ModuleConfigState,
  primaryColor: string,
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

      html += `
      <div class="sb-menu-item">
        <div class="sb-menu-item-left">
          ${item.emoji ? `<span class="sb-menu-emoji">${esc(item.emoji)}</span>` : ''}
          <div class="sb-menu-item-info">
            <div class="sb-menu-item-header">
              <span class="sb-menu-item-name">${esc(item.name)}</span>
              ${badges.join('')}
            </div>
            ${item.nameEn ? `<span class="sb-menu-item-name-en">${esc(item.nameEn)}</span>` : ''}
            ${item.desc ? `<p class="sb-menu-item-desc">${esc(item.desc)}</p>` : ''}
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
      <span class="sb-hours-day">${esc(item.day)}</span>
      <span class="sb-hours-time">${esc(item.hours)}</span>
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
  const kakaoChannel = getVal(state, 'sns', 'kakaoChannelUrl', '');

  const links: string[] = [];
  if (instagram) {
    links.push(`<a class="sb-sns-link" href="${esc(instagram)}" target="_blank" rel="noopener noreferrer" style="border-color:${esc(primaryColor)}">&#128247; Instagram</a>`);
  }
  if (naverBlog) {
    links.push(`<a class="sb-sns-link" href="${esc(naverBlog)}" target="_blank" rel="noopener noreferrer" style="border-color:${esc(primaryColor)}">&#128221; 네이버 블로그</a>`);
  }
  if (kakaoChannel) {
    links.push(`<a class="sb-sns-link" href="${esc(kakaoChannel)}" target="_blank" rel="noopener noreferrer" style="border-color:${esc(primaryColor)}">&#128172; 카카오톡 채널</a>`);
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

/* Hero */
.sb-hero {
  position: relative;
  min-height: 360px;
  display: flex;
  align-items: flex-end;
  background: var(--bg-alt, #f5f5f5);
  overflow: hidden;
}
.sb-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.45));
  pointer-events: none;
}
.sb-hero-content {
  position: relative;
  z-index: 1;
  padding: 3rem var(--section-padding-x, 1.5rem);
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
}
.sb-hero-name {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin: 0 0 4px;
  line-height: 1.2;
}
.sb-hero-name-en {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 12px;
  font-weight: 400;
}
.sb-hero-desc {
  font-size: 1.125rem;
  color: var(--text-primary);
  margin: 0 0 4px;
  font-weight: 500;
}
.sb-hero-desc-en {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 16px;
}
.sb-hero-phone {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  background: ${primaryColor};
  color: #fff;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity .2s;
}
.sb-hero-phone:hover { opacity: 0.85; }

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
    menu: () => renderSmallBizMenuSection(state, primaryColor),
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
