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
import type { ModuleConfigState } from '@/lib/module-schema';

// ── Types ────────────────────────────────────────

interface ServiceItem {
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  price: string;
  priceEn: string;
  icon: string;
}

interface PortfolioItem {
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  desc: string;
  descEn: string;
  imageUrl: string;
  tags: string;
}

interface TestimonialItem {
  author: string;
  authorEn: string;
  role: string;
  roleEn: string;
  company: string;
  companyEn: string;
  content: string;
  contentEn: string;
  rating: string;
}

interface ProcessItem {
  number: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
}

interface ContactSocialItem {
  platform: string;
  url: string;
}

// ── Icon Map (lucide-style SVG paths) ────────────

const SERVICE_ICONS: Record<string, string> = {
  palette:
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
  package:
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16.5 9.4-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>',
  image:
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  layout:
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
  'pen-tool':
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
  monitor:
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
};

function getServiceIcon(icon: string): string {
  return SERVICE_ICONS[icon] ?? SERVICE_ICONS['palette'] ?? '';
}

// ── Section Renderers ────────────────────────────

function renderHeroSection(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
  gradientFrom: string,
  gradientTo: string,
): string {
  const name = getVal(state, 'hero', 'name', '');
  const title = getVal(state, 'hero', 'title', '');
  const tagline = getVal(state, 'hero', 'tagline', '');
  const avatarUrl = getVal(state, 'hero', 'avatarUrl', '');
  const rotatingWords = getVal(state, 'hero', 'rotatingWords', '');

  const avatarSrc = resolveImageSrc(avatarUrl, liveUrl, imageMap);

  const avatarHtml = avatarSrc
    ? `<div class="fp-hero-image">
        <img src="${esc(avatarSrc)}" alt="${esc(name)}" />
      </div>`
    : '';

  const wordBadges = rotatingWords
    ? rotatingWords
        .split(',')
        .map((w: string) => w.trim())
        .filter(Boolean)
        .map((w: string) => `<span class="fp-keyword">${esc(w)}</span>`)
        .join('')
    : '';

  return `
    <section class="fp-hero" style="background:linear-gradient(135deg, ${esc(gradientFrom)}, ${esc(gradientTo)})">
      <div class="fp-hero-inner">
        <div class="fp-hero-text">
          <p class="fp-hero-title-label">${esc(title)}</p>
          <h1 class="fp-hero-name">${esc(name)}</h1>
          <p class="fp-hero-tagline">${esc(tagline)}</p>
          ${wordBadges ? `<div class="fp-keywords">${wordBadges}</div>` : ''}
        </div>
        ${avatarHtml}
      </div>
    </section>`;
}

function renderServicesSection(state: ModuleConfigState, gradientFrom: string): string {
  const items = getArr(state, 'services', 'items') as ServiceItem[];
  if (items.length === 0) return '';

  const cards = items
    .map(
      (item) => `
      <div class="fp-service-card">
        <div class="fp-service-icon" style="color:${esc(gradientFrom)}">${getServiceIcon(item.icon)}</div>
        <h3 class="fp-service-title">${esc(item.title)}</h3>
        <p class="fp-service-desc">${esc(item.desc)}</p>
        ${item.price ? `<p class="fp-service-price" style="color:${esc(gradientFrom)}">${esc(item.price)}</p>` : ''}
      </div>`,
    )
    .join('');

  return `
    <section class="fp-section">
      <h2 class="fp-section-heading">Services</h2>
      <div class="fp-service-grid">${cards}</div>
    </section>`;
}

function renderPortfolioSection(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
): string {
  const items = getArr(state, 'portfolio', 'items') as PortfolioItem[];
  if (items.length === 0) return '';
  const columns = getVal(state, 'portfolio', 'columns', '3');

  const cards = items
    .map((item) => {
      const imgSrc = resolveImageSrc(item.imageUrl, liveUrl, imageMap);
      const tagsHtml = item.tags
        ? item.tags
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean)
            .map((t: string) => `<span class="fp-tag">${esc(t)}</span>`)
            .join('')
        : '';

      return `
      <div class="fp-portfolio-card">
        ${imgSrc ? `<div class="fp-portfolio-img"><img src="${esc(imgSrc)}" alt="${esc(item.title)}" /></div>` : ''}
        <div class="fp-portfolio-body">
          <span class="fp-portfolio-cat">${esc(item.category)}</span>
          <h3 class="fp-portfolio-title">${esc(item.title)}</h3>
          ${item.desc ? `<p class="fp-portfolio-desc">${esc(item.desc)}</p>` : ''}
          ${tagsHtml ? `<div class="fp-tags">${tagsHtml}</div>` : ''}
        </div>
      </div>`;
    })
    .join('');

  return `
    <section class="fp-section">
      <h2 class="fp-section-heading">Portfolio</h2>
      <div class="fp-portfolio-grid fp-cols-${esc(columns)}">${cards}</div>
    </section>`;
}

function renderTestimonialsSection(state: ModuleConfigState, gradientFrom: string): string {
  const items = getArr(state, 'testimonials', 'items') as TestimonialItem[];
  if (items.length === 0) return '';

  const cards = items
    .map((item) => {
      const rating = parseInt(item.rating, 10) || 5;
      const stars = Array.from({ length: 5 }, (_, i) =>
        i < rating ? '<span class="fp-star fp-star--filled">&#9733;</span>' : '<span class="fp-star">&#9734;</span>',
      ).join('');

      return `
      <div class="fp-testimonial-card">
        <div class="fp-testimonial-stars">${stars}</div>
        <p class="fp-testimonial-content">&ldquo;${esc(item.content)}&rdquo;</p>
        <div class="fp-testimonial-author">
          <strong>${esc(item.author)}</strong>
          ${item.role || item.company ? `<span class="fp-testimonial-role">${esc(item.role)}${item.company ? `, ${esc(item.company)}` : ''}</span>` : ''}
        </div>
      </div>`;
    })
    .join('');

  return `
    <section class="fp-section fp-section--tinted">
      <h2 class="fp-section-heading">Testimonials</h2>
      <div class="fp-testimonial-grid">${cards}</div>
    </section>`;
}

function renderProcessSection(state: ModuleConfigState, gradientFrom: string): string {
  const items = getArr(state, 'process', 'items') as ProcessItem[];
  if (items.length === 0) return '';

  const steps = items
    .map(
      (item) => `
      <div class="fp-process-step">
        <div class="fp-process-number" style="background:${esc(gradientFrom)}">${esc(item.number)}</div>
        <div class="fp-process-body">
          <h3 class="fp-process-title">${esc(item.title)}</h3>
          <p class="fp-process-desc">${esc(item.desc)}</p>
        </div>
      </div>`,
    )
    .join('');

  return `
    <section class="fp-section">
      <h2 class="fp-section-heading">Process</h2>
      <div class="fp-process-list">${steps}</div>
    </section>`;
}

function renderContactSection(state: ModuleConfigState, gradientFrom: string): string {
  const email = getVal(state, 'contact', 'email', '');
  const socials = getArr(state, 'contact', 'socials') as ContactSocialItem[];

  const socialLinks = socials
    .map(
      (s) => `
      <a class="fp-contact-social" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"
         style="border-color:${esc(gradientFrom)}; color:${esc(gradientFrom)}">
        ${esc(s.platform)}
      </a>`,
    )
    .join('');

  return `
    <section class="fp-section fp-contact">
      <h2 class="fp-section-heading">Contact</h2>
      ${email ? `<a class="fp-contact-email" href="mailto:${esc(email)}" style="background:${esc(gradientFrom)}">${esc(email)}</a>` : ''}
      ${socialLinks ? `<div class="fp-contact-socials">${socialLinks}</div>` : ''}
    </section>`;
}

// ── CSS ──────────────────────────────────────────

function buildFreelancerCSS(gradientFrom: string, gradientTo: string): string {
  return `
    :root {
      --fp-from: ${gradientFrom};
      --fp-to: ${gradientTo};
    }

    body { background: #fafafa; }

    /* Hero */
    .fp-hero {
      padding: 64px 24px;
      color: #fff;
    }
    .fp-hero-inner {
      max-width: 960px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }
    @media (max-width: 640px) {
      .fp-hero-inner { grid-template-columns: 1fr; text-align: center; }
    }
    .fp-hero-title-label {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: .8;
      margin: 0 0 8px;
    }
    .fp-hero-name {
      font-size: 42px;
      font-weight: 800;
      margin: 0 0 12px;
      line-height: 1.15;
    }
    .fp-hero-tagline {
      font-size: 17px;
      opacity: .9;
      margin: 0 0 20px;
      line-height: 1.6;
    }
    .fp-keywords { display: flex; flex-wrap: wrap; gap: 8px; }
    @media (max-width: 640px) { .fp-keywords { justify-content: center; } }
    .fp-keyword {
      display: inline-block;
      padding: 4px 14px;
      background: rgba(255,255,255,.18);
      border-radius: 999px;
      font-size: 13px;
      font-weight: 500;
    }
    .fp-hero-image { display: flex; justify-content: center; }
    .fp-hero-image img {
      width: 280px; height: 280px;
      border-radius: 20px;
      object-fit: cover;
      box-shadow: 0 8px 32px rgba(0,0,0,.2);
    }

    /* Sections */
    .fp-section {
      max-width: 960px;
      margin: 0 auto;
      padding: 56px 24px;
    }
    .fp-section--tinted { background: #f3f4f6; max-width: 100%; }
    .fp-section--tinted > * { max-width: 960px; margin-left: auto; margin-right: auto; }
    .fp-section-heading {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 32px;
      color: #111;
    }

    /* Services */
    .fp-service-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
    }
    .fp-service-card {
      background: #fff;
      border-radius: 12px;
      padding: 28px 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,.06);
      transition: transform .15s, box-shadow .15s;
    }
    .fp-service-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0,0,0,.1);
    }
    .fp-service-icon { margin-bottom: 14px; }
    .fp-service-title { font-size: 18px; font-weight: 700; margin: 0 0 8px; color: #111; }
    .fp-service-desc { font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 12px; }
    .fp-service-price { font-size: 15px; font-weight: 700; margin: 0; }

    /* Portfolio */
    .fp-portfolio-grid {
      display: grid;
      gap: 20px;
    }
    .fp-cols-2 { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
    .fp-cols-3 { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    .fp-cols-4 { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
    .fp-portfolio-card {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,.06);
      transition: transform .15s, box-shadow .15s;
    }
    .fp-portfolio-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0,0,0,.1);
    }
    .fp-portfolio-img img { width: 100%; height: 200px; object-fit: cover; display: block; }
    .fp-portfolio-body { padding: 16px 20px; }
    .fp-portfolio-cat {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--fp-from);
      margin-bottom: 6px;
    }
    .fp-portfolio-title { font-size: 16px; font-weight: 700; margin: 0 0 6px; color: #111; }
    .fp-portfolio-desc { font-size: 13px; color: #666; margin: 0 0 10px; line-height: 1.5; }
    .fp-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .fp-tag {
      display: inline-block;
      padding: 2px 10px;
      background: #f3f4f6;
      border-radius: 999px;
      font-size: 11px;
      color: #555;
    }

    /* Testimonials */
    .fp-testimonial-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .fp-testimonial-card {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,.06);
    }
    .fp-testimonial-stars { margin-bottom: 10px; font-size: 16px; }
    .fp-star { color: #d1d5db; }
    .fp-star--filled { color: #f59e0b; }
    .fp-testimonial-content {
      font-size: 14px;
      color: #444;
      line-height: 1.7;
      margin: 0 0 14px;
      font-style: italic;
    }
    .fp-testimonial-author { font-size: 14px; color: #111; }
    .fp-testimonial-role { display: block; font-size: 12px; color: #888; margin-top: 2px; }

    /* Process */
    .fp-process-list { display: flex; flex-direction: column; gap: 20px; }
    .fp-process-step {
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }
    .fp-process-number {
      flex-shrink: 0;
      width: 48px; height: 48px;
      border-radius: 50%;
      color: #fff;
      font-size: 18px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .fp-process-body { flex: 1; }
    .fp-process-title { font-size: 17px; font-weight: 700; margin: 0 0 4px; color: #111; }
    .fp-process-desc { font-size: 14px; color: #555; margin: 0; line-height: 1.6; }

    /* Contact */
    .fp-contact { text-align: center; padding-bottom: 72px; }
    .fp-contact-email {
      display: inline-block;
      padding: 14px 36px;
      color: #fff;
      border-radius: 999px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      margin-bottom: 20px;
      transition: opacity .15s;
    }
    .fp-contact-email:hover { opacity: .85; }
    .fp-contact-socials { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
    .fp-contact-social {
      display: inline-block;
      padding: 6px 18px;
      border: 1.5px solid;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      text-transform: capitalize;
      transition: background .15s, color .15s;
    }
    .fp-contact-social:hover {
      background: var(--fp-from);
      color: #fff !important;
      border-color: var(--fp-from) !important;
    }
  `;
}

// ── Main Generator ───────────────────────────────

export function generateFreelancerPagePreview(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
): string {
  const gradientFrom = getVal(state, 'hero', 'gradientFrom', '#5b13ec');
  const gradientTo = getVal(state, 'hero', 'gradientTo', '#06b6d4');
  const fontFamily = getVal(state, 'hero', 'fontFamily', 'Pretendard');
  const designPreset = getVal(state, 'hero', 'designPreset', 'default');

  const activeModules = getActiveModules(state);

  const sectionRenderers: Record<string, () => string> = {
    hero: () => renderHeroSection(state, liveUrl, imageMap, gradientFrom, gradientTo),
    services: () => renderServicesSection(state, gradientFrom),
    portfolio: () => renderPortfolioSection(state, liveUrl, imageMap),
    testimonials: () => renderTestimonialsSection(state, gradientFrom),
    process: () => renderProcessSection(state, gradientFrom),
    contact: () => renderContactSection(state, gradientFrom),
  };

  const sections = activeModules
    .map((id) => {
      const render = sectionRenderers[id];
      return render ? render() : '';
    })
    .filter(Boolean)
    .join('');

  const bodyContent = `<div class="fp-wrapper">${sections}</div>`;
  const baseCss = buildBaseCSS(designPreset, gradientFrom, gradientTo);
  const templateCss = buildFreelancerCSS(gradientFrom, gradientTo);
  const fullCss = `${baseCss}\n${templateCss}`;
  const fontFamilyValue = `'${fontFamily}', -apple-system, sans-serif`;

  return wrapInHtml(fullCss, bodyContent, designPreset, fontFamilyValue);
}
