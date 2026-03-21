import {
  esc,
  resolveImageSrc,
  getVal,
  getArr,
  getActiveModules,
  buildBaseCSS,
  wrapInHtml,
  getSocialIconSvg,
  SOCIAL_ICON_MAP,
} from './base';
import type { ModuleConfigState } from '@/lib/module-schema';

// ── Section Renderers ────────────────────────────

interface SocialItem {
  platform: string;
  url: string;
}

function renderProfileSection(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
  accentColor: string,
): string {
  const name = getVal(state, 'profile', 'name', '');
  const nameEn = getVal(state, 'profile', 'nameEn', '');
  const title = getVal(state, 'profile', 'title', '');
  const titleEn = getVal(state, 'profile', 'titleEn', '');
  const company = getVal(state, 'profile', 'company', '');
  const companyEn = getVal(state, 'profile', 'companyEn', '');
  const avatarUrl = getVal(state, 'profile', 'avatarUrl', '');

  const avatarSrc = resolveImageSrc(avatarUrl, liveUrl, imageMap);
  const avatarHtml = avatarSrc
    ? `<img class="nc-avatar" src="${esc(avatarSrc)}" alt="${esc(name)}" />`
    : `<div class="nc-avatar nc-avatar--placeholder">${esc(name.charAt(0) || '?')}</div>`;

  const companyLine =
    company || companyEn
      ? `<p class="nc-company">${esc(company)}${companyEn ? ` <span class="nc-en">${esc(companyEn)}</span>` : ''}</p>`
      : '';

  return `
    <div class="nc-accent-bar" style="background:${esc(accentColor)}"></div>
    <section class="nc-profile">
      ${avatarHtml}
      <h1 class="nc-name">${esc(name)}</h1>
      ${nameEn ? `<p class="nc-name-en">${esc(nameEn)}</p>` : ''}
      <p class="nc-title">${esc(title)}${titleEn ? ` <span class="nc-en">${esc(titleEn)}</span>` : ''}</p>
      ${companyLine}
    </section>`;
}

function renderContactSection(state: ModuleConfigState): string {
  const email = getVal(state, 'contact', 'email', '');
  const phone = getVal(state, 'contact', 'phone', '');
  const address = getVal(state, 'contact', 'address', '');
  const addressEn = getVal(state, 'contact', 'addressEn', '');
  const website = getVal(state, 'contact', 'website', '');

  const rows: string[] = [];
  if (email) {
    rows.push(`
      <div class="nc-contact-row">
        <span class="nc-contact-icon">&#9993;</span>
        <a href="mailto:${esc(email)}">${esc(email)}</a>
      </div>`);
  }
  if (phone) {
    rows.push(`
      <div class="nc-contact-row">
        <span class="nc-contact-icon">&#9742;</span>
        <a href="tel:${esc(phone)}">${esc(phone)}</a>
      </div>`);
  }
  if (address) {
    rows.push(`
      <div class="nc-contact-row">
        <span class="nc-contact-icon">&#128205;</span>
        <span>${esc(address)}${addressEn ? ` <span class="nc-en">${esc(addressEn)}</span>` : ''}</span>
      </div>`);
  }
  if (website) {
    rows.push(`
      <div class="nc-contact-row">
        <span class="nc-contact-icon">&#127760;</span>
        <a href="${esc(website)}" target="_blank" rel="noopener noreferrer">${esc(website)}</a>
      </div>`);
  }

  if (rows.length === 0) return '';

  return `
    <section class="nc-contact">
      <div class="nc-divider"></div>
      ${rows.join('')}
    </section>`;
}

function renderSocialsSection(state: ModuleConfigState, accentColor: string): string {
  const items = getArr(state, 'socials', 'items') as SocialItem[];
  if (items.length === 0) return '';

  const pills = items
    .map((item) => {
      const brandColor = SOCIAL_ICON_MAP[item.platform]?.color ?? accentColor;
      const svg = getSocialIconSvg(item.platform, 14, brandColor);
      return `
      <a class="nc-social-pill" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"
         style="border-color:${esc(brandColor)}; color:${esc(brandColor)}">
        ${svg ? `<span class="nc-social-svg">${svg}</span>` : ''}
        ${esc(item.platform)}
      </a>`;
    })
    .join('');

  return `
    <section class="nc-socials">
      <div class="nc-divider"></div>
      <div class="nc-social-list">${pills}</div>
    </section>`;
}

// ── CSS ──────────────────────────────────────────

function buildNamecardCSS(accentColor: string): string {
  return `
    :root { --brand-primary: ${accentColor}; }

    body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f0f2f5;
    }

    .nc-card {
      max-width: 480px;
      width: 100%;
      margin: 24px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,.08);
      overflow: hidden;
    }

    .nc-accent-bar { height: 6px; }

    /* Profile */
    .nc-profile { text-align: center; padding: 32px 24px 16px; }
    .nc-avatar {
      width: 96px; height: 96px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 16px;
      display: block;
      border: 3px solid var(--brand-primary);
    }
    .nc-avatar--placeholder {
      background: var(--brand-primary);
      color: #fff;
      font-size: 36px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nc-name { font-size: 24px; font-weight: 700; margin: 0 0 2px; color: #111; }
    .nc-name-en { font-size: 14px; color: #888; margin: 0 0 8px; }
    .nc-title { font-size: 15px; color: #444; margin: 0 0 4px; }
    .nc-company { font-size: 14px; color: #666; margin: 0; }
    .nc-en { color: #999; font-size: 0.9em; }

    /* Contact */
    .nc-contact { padding: 0 24px 16px; }
    .nc-contact-row {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 0;
      font-size: 14px; color: #333;
    }
    .nc-contact-row a { color: var(--brand-primary); text-decoration: none; }
    .nc-contact-row a:hover { text-decoration: underline; }
    .nc-contact-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }

    /* Socials */
    .nc-socials { padding: 0 24px 24px; }
    .nc-social-list { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
    .nc-social-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      border: 1.5px solid;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      text-transform: capitalize;
      transition: background .15s, color .15s, transform .15s;
    }
    .nc-social-pill:hover {
      background: var(--brand-primary);
      color: #fff !important;
      transform: translateY(-1px);
    }
    .nc-social-pill:hover svg { fill: #fff; }
    .nc-social-svg {
      display: inline-flex;
      align-items: center;
      line-height: 0;
    }

    /* Divider */
    .nc-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 0 0 16px;
    }
  `;
}

// ── Main Generator ───────────────────────────────

export function generateDigitalNamecardPreview(
  state: ModuleConfigState,
  liveUrl: string,
  imageMap: Record<string, string>,
): string {
  const accentColor = getVal(state, 'theme', 'accentColor', '#3b82f6');
  const activeModules = getActiveModules(state);

  const sectionRenderers: Record<string, () => string> = {
    profile: () => renderProfileSection(state, liveUrl, imageMap, accentColor),
    contact: () => renderContactSection(state),
    socials: () => renderSocialsSection(state, accentColor),
    theme: () => '', // theme 모듈은 시각 섹션이 아님
  };

  const sections = activeModules
    .map((id) => {
      const render = sectionRenderers[id];
      return render ? render() : '';
    })
    .filter(Boolean)
    .join('');

  const bodyContent = `<div class="nc-card">${sections}</div>`;
  const baseCss = buildBaseCSS('default');
  const templateCss = buildNamecardCSS(accentColor);
  const fullCss = `${baseCss}\n${templateCss}`;

  return wrapInHtml(fullCss, bodyContent, 'default');
}
