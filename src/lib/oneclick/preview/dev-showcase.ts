// ──────────────────────────────────────────────
// Preview HTML Generation — Dev Showcase Template
// ──────────────────────────────────────────────

import type { ModuleConfigState } from '@/lib/module-schema';
import {
  esc,
  getVal,
  getArr,
  isEnabled,
  getActiveModules,
  buildBaseCSS,
  wrapInHtml,
  withSectionId,
} from './base';

// ─── 섹션 빌더 ────────────────────────────────

function buildHeroSection(
  state: ModuleConfigState,
  preset: string,
): string {
  const name = esc(getVal(state, 'hero', 'name', ''));
  const nameEn = esc(getVal(state, 'hero', 'nameEn'));
  const tagline = esc(getVal(state, 'hero', 'tagline', ''));
  const taglineEn = esc(getVal(state, 'hero', 'taglineEn'));
  const typingWordsRaw = getVal(state, 'hero', 'typingWords', '');
  const typingWords = typingWordsRaw
    .split('\n')
    .map((w) => w.trim())
    .filter(Boolean);

  // 스킬 (about 모듈에서 가져옴)
  const skills = getArr(state, 'about', 'skills');
  const skillPills = skills
    .map((s) => {
      const v = s as Record<string, string>;
      return `<span class="skill-pill">${esc(v.name || '')}</span>`;
    })
    .join(' ');

  const nameDisplay = nameEn
    ? `${name} <span style="font-weight:400;font-size:0.5em;color:var(--text-secondary);">${nameEn}</span>`
    : name;

  const taglineDisplay = taglineEn
    ? `${tagline}<br/><span style="font-size:0.85em;color:var(--text-secondary);">${taglineEn}</span>`
    : tagline;

  // 타이핑 워드 표시 (정적 미리보기이므로 첫 번째 단어만 표시)
  const typingDisplay = typingWords.length > 0
    ? `<div style="font-size:1.25rem;font-family:'Geist Mono',monospace;color:var(--brand-primary);margin-bottom:1.5rem;">
        <span style="opacity:0.5;">&gt; </span>${esc(typingWords[0])}<span style="border-right:2px solid var(--brand-primary);margin-left:2px;animation:blink 1s infinite;">&nbsp;</span>
      </div>`
    : '';

  const isDark = ['github-dark', 'vscode', 'dracula', 'terminal', 'midnight'].includes(preset);

  return `
<section class="section-gap" style="${isDark ? '' : ''}">
  <div class="section-inner" style="text-align:center;">
    <span class="section-label">DEV SHOWCASE</span>
    ${typingDisplay}
    <h1 style="font-size:var(--text-hero);font-weight:800;line-height:1.1;margin:0 0 1rem;">
      <span class="hero-name-gradient">${nameDisplay}</span>
    </h1>
    <p style="font-size:1.25rem;color:var(--text-secondary);margin:0 0 2rem;max-width:600px;margin-left:auto;margin-right:auto;">
      ${taglineDisplay}
    </p>
    ${skillPills ? `<div style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;margin-bottom:1.5rem;">${skillPills}</div>` : ''}
    <a href="#contact" class="cta-btn">Contact Me</a>
  </div>
</section>
<style>@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }</style>`;
}

function buildAboutSection(state: ModuleConfigState): string {
  if (!isEnabled(state, 'about')) return '';
  const story = esc(getVal(state, 'about', 'story', ''));
  const storyEn = esc(getVal(state, 'about', 'storyEn'));
  const titleOverride = esc(getVal(state, 'about', 'title', ''));
  const title = titleOverride || '소개';
  const skills = getArr(state, 'about', 'skills');

  const skillBars = skills
    .map((s) => {
      const v = s as Record<string, string>;
      const name = esc(v.name || '');
      const level = parseInt(v.level || '50', 10);
      const clampedLevel = Math.max(0, Math.min(100, level));
      return `
      <div style="margin-bottom:1rem;">
        <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem;">
          <span style="font-weight:500;font-size:.9rem;">${name}</span>
          <span style="font-size:.85rem;color:var(--text-secondary);">${clampedLevel}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width:${clampedLevel}%;"></div>
        </div>
      </div>`;
    })
    .join('');

  return `
<section class="section-gap section-alt" id="about">
  <div class="section-inner">
    <span class="section-label">ABOUT</span>
    <h2 style="font-size:var(--text-section);font-weight:700;margin:0 0 1.5rem;">${title}</h2>
    <p style="font-size:var(--text-body);line-height:1.8;color:var(--text-secondary);max-width:680px;margin-bottom:2rem;">
      ${story}
    </p>
    ${storyEn ? `<p style="font-size:var(--text-body);line-height:1.8;color:var(--text-secondary);max-width:680px;margin-bottom:2rem;font-style:italic;">${storyEn}</p>` : ''}
    ${skills.length > 0 ? `<div style="max-width:500px;"><h3 style="font-size:1.1rem;font-weight:600;margin:0 0 1rem;">기술 스택</h3>${skillBars}</div>` : ''}
  </div>
</section>`;
}

function buildProjectsSection(state: ModuleConfigState): string {
  if (!isEnabled(state, 'projects')) return '';
  const githubUsername = esc(getVal(state, 'projects', 'githubUsername', ''));
  const maxRepos = getVal(state, 'projects', 'maxRepos', '6');

  // 정적 미리보기이므로 플레이스홀더 카드 표시
  const count = Math.min(parseInt(maxRepos, 10) || 6, 9);
  const placeholders = Array.from({ length: count }, (_, i) => `
    <div class="blog-card">
      <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;">
        <span style="font-size:1.25rem;">&#128193;</span>
        <span style="font-weight:600;">project-${i + 1}</span>
      </div>
      <p style="font-size:.85rem;color:var(--text-secondary);margin:0 0 0.75rem;line-height:1.5;">
        프로젝트 설명이 여기에 표시됩니다.
      </p>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <span class="skill-pill" style="font-size:.75rem;">TypeScript</span>
        <span class="skill-pill" style="font-size:.75rem;">React</span>
      </div>
    </div>`).join('');

  return `
<section class="section-gap" id="projects">
  <div class="section-inner">
    <span class="section-label">PROJECTS</span>
    <h2 style="font-size:var(--text-section);font-weight:700;margin:0 0 0.5rem;">프로젝트</h2>
    ${githubUsername ? `<p style="color:var(--text-secondary);margin:0 0 2rem;">github.com/${githubUsername}</p>` : '<p style="color:var(--text-secondary);margin:0 0 2rem;">GitHub 리포지토리 기반 프로젝트</p>'}
    <div class="grid-3">
      ${placeholders}
    </div>
  </div>
</section>`;
}

function buildExperienceSection(state: ModuleConfigState): string {
  if (!isEnabled(state, 'experience')) return '';
  const items = getArr(state, 'experience', 'items');
  if (items.length === 0) return '';

  const timeline = items
    .map((item) => {
      const v = item as Record<string, string>;
      const title = esc(v.title || '');
      const titleEn = esc(v.titleEn || '');
      const company = esc(v.company || '');
      const companyEn = esc(v.companyEn || '');
      const period = esc(v.period || '');
      const periodEn = esc(v.periodEn || '');
      const description = esc(v.description || '');
      const descriptionEn = esc(v.descriptionEn || '');
      return `
      <div class="timeline-item">
        <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.25rem;">
          <h3 style="font-size:1.1rem;font-weight:600;margin:0;">${title}${titleEn ? ` <span style="font-size:.85rem;color:var(--text-secondary);font-weight:400;">${titleEn}</span>` : ''}</h3>
          <span style="font-size:.85rem;color:var(--text-secondary);white-space:nowrap;">${period}${periodEn ? ` (${periodEn})` : ''}</span>
        </div>
        <p style="font-size:.95rem;color:var(--brand-primary);font-weight:500;margin:0 0 0.5rem;">${company}${companyEn ? ` <span style="font-size:.85rem;color:var(--text-secondary);font-weight:400;">${companyEn}</span>` : ''}</p>
        ${description ? `<p style="font-size:.9rem;color:var(--text-secondary);margin:0;line-height:1.6;">${description}</p>` : ''}
        ${descriptionEn ? `<p style="font-size:.85rem;color:var(--text-secondary);margin:0;line-height:1.5;opacity:.7;">${descriptionEn}</p>` : ''}
      </div>`;
    })
    .join('');

  return `
<section class="section-gap section-alt" id="experience">
  <div class="section-inner">
    <span class="section-label">EXPERIENCE</span>
    <h2 style="font-size:var(--text-section);font-weight:700;margin:0 0 2rem;">경력</h2>
    <div style="max-width:680px;">
      ${timeline}
    </div>
  </div>
</section>`;
}

function buildBlogSection(state: ModuleConfigState): string {
  if (!isEnabled(state, 'blog')) return '';
  const items = getArr(state, 'blog', 'items');
  if (items.length === 0) return '';

  const cards = items
    .map((item) => {
      const v = item as Record<string, string>;
      const title = esc(v.title || '');
      const url = esc(v.url || '#');
      const date = esc(v.date || '');
      return `
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="blog-card" style="display:block;text-decoration:none;color:inherit;">
        ${date ? `<span style="font-size:.8rem;color:var(--text-secondary);">${date}</span>` : ''}
        <h3 style="font-size:1.05rem;font-weight:600;margin:0.25rem 0 0;">${title}</h3>
      </a>`;
    })
    .join('');

  return `
<section class="section-gap" id="blog">
  <div class="section-inner">
    <span class="section-label">BLOG</span>
    <h2 style="font-size:var(--text-section);font-weight:700;margin:0 0 2rem;">블로그</h2>
    <div class="grid-2">
      ${cards}
    </div>
  </div>
</section>`;
}

function buildContactSection(state: ModuleConfigState): string {
  if (!isEnabled(state, 'contact')) return '';
  const email = esc(getVal(state, 'contact', 'email', ''));
  const github = esc(getVal(state, 'contact', 'github', ''));
  const linkedin = esc(getVal(state, 'contact', 'linkedin', ''));

  const links: string[] = [];
  if (github) {
    links.push(`<a href="${github}" target="_blank" rel="noopener noreferrer" class="contact-link">GitHub</a>`);
  }
  if (linkedin) {
    links.push(`<a href="${linkedin}" target="_blank" rel="noopener noreferrer" class="contact-link">LinkedIn</a>`);
  }

  return `
<section class="section-gap section-alt" id="contact">
  <div class="section-inner" style="text-align:center;">
    <span class="section-label">CONTACT</span>
    <h2 style="font-size:var(--text-section);font-weight:700;margin:0 0 1rem;">연락처</h2>
    ${email ? `<p style="font-size:1.1rem;color:var(--text-secondary);margin:0 0 2rem;"><a href="mailto:${email}" style="color:var(--brand-primary);text-decoration:underline;">${email}</a></p>` : ''}
    ${links.length > 0 ? `<div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;">${links.join('\n        ')}</div>` : ''}
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
  preset: string,
) => string;

const SECTION_MAP: Record<string, SectionBuilder> = {
  hero: (state, preset) => buildHeroSection(state, preset),
  about: (state) => buildAboutSection(state),
  projects: (state) => buildProjectsSection(state),
  experience: (state) => buildExperienceSection(state),
  blog: (state) => buildBlogSection(state),
  contact: (state) => buildContactSection(state),
};

// ─── 메인 함수 ─────────────────────────────────

export function generateDevShowcasePreview(
  state: ModuleConfigState,
  _liveUrl: string,
  _imageMap: Record<string, string>,
): string {
  const preset = getVal(state, 'hero', 'designPreset', 'github-dark');
  const fontFamily = 'Pretendard'; // dev-showcase는 기본 폰트 고정

  const css = buildBaseCSS(preset);

  const activeModules = getActiveModules(state);
  const sections = activeModules
    .map((id) => {
      const builder = SECTION_MAP[id];
      if (!builder) return '';
      return withSectionId(builder(state, preset), id);
    })
    .filter(Boolean)
    .join('\n');

  const bodyContent = sections + buildFooter(state);

  return wrapInHtml(css, bodyContent, preset, fontFamily || undefined);
}
