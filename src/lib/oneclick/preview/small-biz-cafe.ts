// ──────────────────────────────────────────────
// Preview HTML Generation — Small Business Cafe (카페 전용 홍보)
// small-biz의 공유 렌더러를 재사용하면서 카페 특화 섹션 추가
// ──────────────────────────────────────────────

import {
  esc,
  getVal,
  getArr,
  getActiveModules,
  buildBaseCSS,
  wrapInHtml,
} from './base';
import {
  renderSmallBizHoursSection,
  renderSmallBizLocationSection,
  renderSmallBizGallerySection,
  renderSmallBizSnsSection,
  renderSmallBizMenuSection,
  buildSmallBizCSS,
} from './small-biz';
import type { ModuleConfigState } from '@/lib/module-schema';

// ── Types ────────────────────────────────────────

interface StoryItem {
  text: string;
}

interface TagItem {
  tag: string;
}

interface ValueItem {
  icon: string;
  title: string;
  desc: string;
}

// ── Cafe-specific Section Renderers ──────────────

function renderCafeHeroSection(
  state: ModuleConfigState,
  primaryColor: string,
): string {
  const name = getVal(state, 'hero', 'name', '카페 이름');
  const nameEn = getVal(state, 'hero', 'nameEn', '');
  const description = getVal(state, 'hero', 'description', '');
  const descriptionEn = getVal(state, 'hero', 'descriptionEn', '');
  const phone = getVal(state, 'hero', 'phone', '');

  return `
  <section class="cafe-hero">
    <div class="cafe-hero-bg"></div>
    <div class="cafe-hero-content">
      <div class="cafe-hero-icon">&#9749;</div>
      <h1 class="cafe-hero-name">${esc(name)}</h1>
      ${nameEn ? `<p class="cafe-hero-name-en">${esc(nameEn)}</p>` : ''}
      <p class="cafe-hero-desc">${esc(description)}</p>
      ${descriptionEn ? `<p class="cafe-hero-desc-en">${esc(descriptionEn)}</p>` : ''}
      ${phone ? `<a class="cafe-hero-phone" href="tel:${esc(phone)}" style="background:${esc(primaryColor)}">&#9742; ${esc(phone)}</a>` : ''}
    </div>
  </section>`;
}

function renderCafeAboutSection(
  state: ModuleConfigState,
  primaryColor: string,
): string {
  const stories = getArr(state, 'about', 'stories') as unknown as StoryItem[];
  const tags = getArr(state, 'about', 'tags') as unknown as TagItem[];
  const values = getArr(state, 'about', 'values') as unknown as ValueItem[];

  if (stories.length === 0 && tags.length === 0 && values.length === 0) return '';

  let html = `<section class="cafe-about section-gap"><div class="section-inner">`;
  html += `<span class="section-label" style="color:${esc(primaryColor)}">ABOUT</span>`;
  html += `<h2 class="sb-section-title">소개</h2>`;

  // Stories
  if (stories.length > 0) {
    html += `<div class="cafe-about-stories">`;
    for (const story of stories) {
      html += `<p class="cafe-about-story">${esc(story.text)}</p>`;
    }
    html += `</div>`;
  }

  // Tags
  if (tags.length > 0) {
    html += `<div class="cafe-about-tags">`;
    for (const tag of tags) {
      html += `<span class="cafe-tag" style="color:${esc(primaryColor)};border-color:${esc(primaryColor)}30">${esc(tag.tag)}</span>`;
    }
    html += `</div>`;
  }

  // Values
  if (values.length > 0) {
    html += `<div class="cafe-values-grid">`;
    for (const val of values) {
      html += `
      <div class="cafe-value-card">
        <span class="cafe-value-icon">${esc(val.icon)}</span>
        <h3 class="cafe-value-title">${esc(val.title)}</h3>
        <p class="cafe-value-desc">${esc(val.desc)}</p>
      </div>`;
    }
    html += `</div>`;
  }

  html += `</div></section>`;
  return html;
}

function renderCafeMenuSection(
  state: ModuleConfigState,
  primaryColor: string,
): string {
  // 카페 메뉴는 small-biz 메뉴와 필드 구조 동일, 공유 렌더러 재사용
  return renderSmallBizMenuSection(state, primaryColor);
}

// ── Cafe CSS ─────────────────────────────────────

function buildCafeCSS(primaryColor: string): string {
  return `
/* ── Cafe Template Overrides ── */

/* Hero — 카페 특화 중앙 정렬 */
.cafe-hero {
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}
.cafe-hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, ${primaryColor}08 0%, ${primaryColor}15 100%);
}
.cafe-hero-content {
  position: relative;
  z-index: 1;
  padding: 4rem var(--section-padding-x, 1.5rem);
  max-width: 640px;
}
.cafe-hero-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  opacity: 0.8;
}
.cafe-hero-name {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 4px;
  line-height: 1.2;
}
.cafe-hero-name-en {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 16px;
  font-weight: 400;
  letter-spacing: 0.05em;
}
.cafe-hero-desc {
  font-size: 1.15rem;
  color: var(--text-primary);
  margin: 0 0 4px;
  font-weight: 500;
  line-height: 1.6;
}
.cafe-hero-desc-en {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 24px;
}
.cafe-hero-phone {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 28px;
  color: #fff;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity .2s;
}
.cafe-hero-phone:hover { opacity: 0.85; }

/* About */
.cafe-about-stories { margin-bottom: 1.5rem; }
.cafe-about-story {
  font-size: var(--text-body, 1rem);
  color: var(--text-primary);
  line-height: 1.8;
  margin: 0 0 1rem;
}
.cafe-about-story:last-child { margin-bottom: 0; }

.cafe-about-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 1.5rem 0;
}
.cafe-tag {
  display: inline-block;
  padding: 6px 14px;
  border: 1.5px solid;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  background: transparent;
}

.cafe-values-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 2rem;
}
@media (min-width: 640px) {
  .cafe-values-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 768px) {
  .cafe-values-grid { grid-template-columns: repeat(3, 1fr); }
}
.cafe-value-card {
  background: var(--surface-elevated, #fff);
  border: 1px solid var(--surface-border, #e5e7eb);
  border-radius: var(--radius-lg, 16px);
  padding: 1.5rem;
  text-align: center;
  transition: transform .2s, box-shadow .2s;
}
.cafe-value-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,.06);
}
.cafe-value-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}
.cafe-value-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
}
.cafe-value-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* Cafe Footer */
.cafe-footer {
  text-align: center;
  padding: 2.5rem 1.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  border-top: 1px solid var(--surface-border, #e5e7eb);
}
.cafe-footer-icon { font-size: 1.2rem; margin-bottom: 0.5rem; display: block; }
`;
}

// ── Main Generator ───────────────────────────────

export function generateSmallBizCafePreview(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
): string {
  const preset = getVal(state, 'hero', 'designPreset', 'default');
  const primaryColor = getVal(state, 'hero', 'primaryColor', '#8b6914');
  const fontFamily = getVal(state, 'hero', 'fontFamily', 'Pretendard');
  const activeModules = getActiveModules(state);

  const sectionRenderers: Record<string, () => string> = {
    hero: () => renderCafeHeroSection(state, primaryColor),
    about: () => renderCafeAboutSection(state, primaryColor),
    menu: () => renderCafeMenuSection(state, primaryColor),
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
  const footer = `<footer class="cafe-footer"><span class="cafe-footer-icon">&#9749;</span>&copy; ${new Date().getFullYear()} ${esc(name)}</footer>`;
  const bodyContent = `<main>${sections}</main>${footer}`;

  const baseCss = buildBaseCSS(preset);
  const smallBizCss = buildSmallBizCSS(primaryColor);
  const cafeCss = buildCafeCSS(primaryColor);
  const fullCss = `${baseCss}\n${smallBizCss}\n${cafeCss}`;

  return wrapInHtml(fullCss, bodyContent, preset, fontFamily);
}
