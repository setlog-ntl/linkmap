// ──────────────────────────────────────────────
// Preview HTML Generation — Personal Brand Template
// ──────────────────────────────────────────────

import type { ModuleConfigState } from '@/lib/module-schema';
import {
  esc,
  resolveImageSrc,
  getVal,
  getArr,
  isEnabled,
  getActiveModules,
  buildBaseCSS,
  wrapInHtml,
} from './base';

// ─── 섹션 빌더 ────────────────────────────────

function buildHeroSection(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
  preset: string,
): string {
  const name = esc(getVal(state, 'hero', 'name', '이름'));
  const nameEn = esc(getVal(state, 'hero', 'nameEn'));
  const tagline = esc(getVal(state, 'hero', 'tagline', '한줄 소개'));
  const taglineEn = esc(getVal(state, 'hero', 'taglineEn'));
  const heroImageUrl = getVal(state, 'hero', 'heroImageUrl');
  const imgSrc = resolveImageSrc(heroImageUrl, liveUrl, imageMap);

  const nameDisplay = nameEn ? `${name} <span style="font-weight:400;font-size:0.5em;color:var(--text-secondary);">${nameEn}</span>` : name;
  const taglineDisplay = taglineEn
    ? `${tagline}<br/><span style="font-size:0.85em;color:var(--text-secondary);">${taglineEn}</span>`
    : tagline;

  const imageHtml = imgSrc
    ? `<div class="hero-image-wrapper"><img src="${esc(imgSrc)}" alt="${name}" loading="eager" /></div>`
    : '';

  // minimal 프리셋: centered 1열 레이아웃
  if (preset === 'minimal') {
    return `
<section class="section-gap" style="text-align:center;">
  <div class="section-inner">
    <span class="section-label">PERSONAL BRAND</span>
    <h1 style="font-size:var(--text-hero);font-weight:800;line-height:1.1;margin:0 0 1rem;">
      <span class="hero-name-gradient">${nameDisplay}</span>
    </h1>
    <p style="font-size:1.25rem;color:var(--text-secondary);margin:0 0 2rem;max-width:600px;margin-left:auto;margin-right:auto;">
      ${taglineDisplay}
    </p>
    <a href="#contact" class="cta-btn">Contact Me</a>
    ${imgSrc ? `<div style="margin-top:3rem;max-width:480px;margin-left:auto;margin-right:auto;">${imageHtml}</div>` : ''}
  </div>
</section>`;
  }

  // 기본: editorial 2-column 레이아웃
  return `
<section class="section-gap">
  <div class="section-inner">
    <div class="hero-editorial">
      <div class="hero-text-col">
        <span class="section-label">PERSONAL BRAND</span>
        <h1 style="font-size:var(--text-hero);font-weight:800;line-height:1.1;margin:0 0 1rem;">
          <span class="hero-name-gradient">${nameDisplay}</span>
        </h1>
        <p style="font-size:1.25rem;color:var(--text-secondary);margin:0 0 2rem;">
          ${taglineDisplay}
        </p>
        <a href="#contact" class="cta-btn">Contact Me</a>
      </div>
      <div class="hero-img-col">
        ${imageHtml}
      </div>
    </div>
  </div>
</section>`;
}

function buildAboutSection(state: ModuleConfigState): string {
  if (!isEnabled(state, 'about')) return '';
  const name = esc(getVal(state, 'hero', 'name', ''));
  const story = esc(getVal(state, 'about', 'story', ''));
  const storyEn = esc(getVal(state, 'about', 'storyEn'));

  return `
<section class="section-gap section-alt" id="about">
  <div class="section-inner">
    <span class="section-label">ABOUT</span>
    <h2 style="font-size:var(--text-section);font-weight:700;margin:0 0 1.5rem;">
      안녕하세요, ${name}입니다.
    </h2>
    <p style="font-size:var(--text-body);line-height:1.8;color:var(--text-secondary);max-width:680px;">
      ${story}
    </p>
    ${storyEn ? `<p style="font-size:var(--text-body);line-height:1.8;color:var(--text-secondary);max-width:680px;margin-top:1rem;font-style:italic;">${storyEn}</p>` : ''}
  </div>
</section>`;
}

function buildValuesSection(state: ModuleConfigState): string {
  if (!isEnabled(state, 'values')) return '';
  const items = getArr(state, 'values', 'items');
  if (items.length === 0) return '';

  const cards = items
    .map((item) => {
      const v = item as Record<string, string>;
      const emoji = esc(v.emoji || '');
      const title = esc(v.title || '');
      const desc = esc(v.desc || '');
      return `
      <div class="value-card">
        <div class="value-icon">${emoji}</div>
        <h3 style="font-size:1.15rem;font-weight:600;margin:0 0 0.5rem;">${title}</h3>
        <p style="font-size:.9rem;color:var(--text-secondary);margin:0;line-height:1.6;">${desc}</p>
      </div>`;
    })
    .join('');

  return `
<section class="section-gap" id="values">
  <div class="section-inner">
    <span class="section-label">VALUES</span>
    <h2 style="font-size:var(--text-section);font-weight:700;margin:0 0 2rem;">제가 믿는 것들</h2>
    <div class="grid-3">
      ${cards}
    </div>
  </div>
</section>`;
}

function buildHighlightsSection(state: ModuleConfigState): string {
  if (!isEnabled(state, 'highlights')) return '';
  const items = getArr(state, 'highlights', 'items');
  if (items.length === 0) return '';

  const cards = items
    .map((item) => {
      const v = item as Record<string, string>;
      const value = esc(v.value || '');
      const label = esc(v.label || '');
      return `
      <div class="highlight-item">
        <div class="highlight-number">${value}</div>
        <div class="highlight-label">${label}</div>
      </div>`;
    })
    .join('');

  return `
<section class="section-gap section-alt" id="highlights">
  <div class="section-inner">
    <span class="section-label">HIGHLIGHTS</span>
    <h2 style="font-size:var(--text-section);font-weight:700;margin:0 0 2rem;">숫자로 보는 여정</h2>
    <div class="grid-3">
      ${cards}
    </div>
  </div>
</section>`;
}

function buildGallerySection(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
): string {
  if (!isEnabled(state, 'gallery')) return '';
  const images = getArr(state, 'gallery', 'images');
  if (images.length === 0) return '';

  const columns = getVal(state, 'gallery', 'columns', '3');
  const colOverride = columns !== '3' ? `columns:${columns};` : '';

  const items = images
    .map((img) => {
      const v = img as Record<string, string>;
      const src = resolveImageSrc(v.url || '', liveUrl, imageMap);
      if (!src) return '';
      return `
      <div class="masonry-item">
        <img src="${esc(src)}" alt="" loading="lazy" />
      </div>`;
    })
    .filter(Boolean)
    .join('');

  return `
<section class="section-gap" id="gallery">
  <div class="section-inner">
    <span class="section-label">GALLERY</span>
    <h2 style="font-size:var(--text-section);font-weight:700;margin:0 0 2rem;">순간들</h2>
    <div class="masonry-gallery"${colOverride ? ` style="${colOverride}"` : ''}>
      ${items}
    </div>
  </div>
</section>`;
}

function buildContactSection(state: ModuleConfigState): string {
  if (!isEnabled(state, 'contact')) return '';
  const email = esc(getVal(state, 'contact', 'email', ''));
  const socials = getArr(state, 'contact', 'socials');

  const socialLinks = socials
    .map((s) => {
      const v = s as Record<string, string>;
      const platform = esc(v.platform || '');
      const url = esc(v.url || '');
      if (!url) return '';
      const label = platform.charAt(0).toUpperCase() + platform.slice(1);
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="contact-link">${label}</a>`;
    })
    .filter(Boolean)
    .join('\n        ');

  return `
<section class="section-gap section-alt" id="contact">
  <div class="section-inner" style="text-align:center;">
    <span class="section-label">CONTACT</span>
    <h2 style="font-size:var(--text-section);font-weight:700;margin:0 0 1rem;">함께 이야기해요</h2>
    ${email ? `<p style="font-size:1.1rem;color:var(--text-secondary);margin:0 0 2rem;"><a href="mailto:${email}" style="color:var(--brand-primary);text-decoration:underline;">${email}</a></p>` : ''}
    <div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;">
      ${socialLinks}
    </div>
  </div>
</section>`;
}

function buildFooter(state: ModuleConfigState): string {
  const name = esc(getVal(state, 'hero', 'name', ''));
  return `
<footer class="site-footer">
  &copy; 2025 ${name}. Powered by Linkmap
</footer>`;
}

// ─── 섹션 매핑 ─────────────────────────────────

type SectionBuilder = (
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
  preset: string,
) => string;

const SECTION_MAP: Record<string, SectionBuilder> = {
  hero: (state, liveUrl, imageMap, preset) =>
    buildHeroSection(state, liveUrl, imageMap, preset),
  about: (state) => buildAboutSection(state),
  values: (state) => buildValuesSection(state),
  highlights: (state) => buildHighlightsSection(state),
  gallery: (state, liveUrl, imageMap) =>
    buildGallerySection(state, liveUrl, imageMap),
  contact: (state) => buildContactSection(state),
};

// ─── 메인 함수 ─────────────────────────────────

export function generatePersonalBrandPreview(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
): string {
  const preset = getVal(state, 'hero', 'designPreset', 'creator');
  const gradientFrom = getVal(state, 'hero', 'gradientFrom');
  const gradientTo = getVal(state, 'hero', 'gradientTo');
  const fontFamily = getVal(state, 'hero', 'fontFamily');

  const css = buildBaseCSS(preset, gradientFrom || undefined, gradientTo || undefined);

  const activeModules = getActiveModules(state);
  const sections = activeModules
    .map((id) => {
      const builder = SECTION_MAP[id];
      if (!builder) return '';
      return builder(state, liveUrl, imageMap, preset);
    })
    .filter(Boolean)
    .join('\n');

  const bodyContent = sections + buildFooter(state);

  return wrapInHtml(css, bodyContent, preset, fontFamily || undefined);
}
