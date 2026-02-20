// ──────────────────────────────────────────────
// Code Generator — 모듈 설정 → 코드 생성 순수 함수
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';

/** 문자열 내 작은따옴표 이스케이프 */
function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** JSON.stringify with 2-space indent */
function jsonBlock(val: unknown): string {
  return JSON.stringify(val, null, 2);
}

/** 퍼센트 문자열을 skill level로 변환 */
function percentToLevel(pct: string): 'beginner' | 'intermediate' | 'advanced' {
  const n = parseInt(pct, 10);
  if (isNaN(n) || n <= 33) return 'beginner';
  if (n <= 66) return 'intermediate';
  return 'advanced';
}

/** skill level을 퍼센트 문자열로 변환 */
function levelToPercent(level: string): string {
  if (level === 'advanced') return '90';
  if (level === 'intermediate') return '60';
  return '30';
}

// ──────────────────────────────────────────────
// config.ts 생성
// ──────────────────────────────────────────────

interface ConfigGenInput {
  hero: Record<string, unknown>;
  about: Record<string, unknown>;
  values: Record<string, unknown>;
  highlights: Record<string, unknown>;
  gallery: Record<string, unknown>;
  contact: Record<string, unknown>;
  enabled: string[];
}

function buildValuesArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    return `  {
    emoji: '${esc(v.emoji || '✦')}',
    title: '${esc(v.title || '')}',
    ${v.titleEn ? `titleEn: '${esc(v.titleEn)}',` : ''}
    desc: '${esc(v.desc || '')}',
    ${v.descEn ? `descEn: '${esc(v.descEn)}',` : ''}
  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildHighlightsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    return `  { label: '${esc(v.label || '')}', ${v.labelEn ? `labelEn: '${esc(v.labelEn)}', ` : ''}value: '${esc(v.value || '')}', ${v.valueEn ? `valueEn: '${esc(v.valueEn)}', ` : ''}}`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildSocialsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    return `  { platform: '${esc(v.platform || '')}', url: '${esc(v.url || '')}' }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildGalleryArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const urls = items.map((item) => {
    const v = item as Record<string, string>;
    return `  '${esc(v.url || v as unknown as string)}'`;
  });
  return `[\n${urls.join(',\n')}\n]`;
}

export function generateConfigTs(state: ModuleConfigState): string {
  const hero = state.values.hero || {};
  const about = state.values.about || {};
  const values = state.values.values || {};
  const highlights = state.values.highlights || {};
  const gallery = state.values.gallery || {};
  const contact = state.values.contact || {};

  const name = (hero.name as string) || '이지원';
  const nameEn = (hero.nameEn as string) || 'Jiwon Lee';
  const tagline = (hero.tagline as string) || '콘텐츠로 세상을 연결하는 크리에이터';
  const taglineEn = (hero.taglineEn as string) || 'Creator who connects the world through content';
  const heroImageUrl = (hero.heroImageUrl as string) || '';
  const gradientFrom = (hero.gradientFrom as string) || '#ee5b2b';
  const gradientTo = (hero.gradientTo as string) || '#f59e0b';
  const parallaxEnabled = hero.parallaxEnabled !== undefined ? !!hero.parallaxEnabled : false;
  const fontFamily = (hero.fontFamily as string) || 'Noto Sans KR';
  const story = (about.story as string) || '';
  const storyEn = (about.storyEn as string) || '';
  const email = (contact.email as string) || 'hello@example.com';
  const galleryColumns = (gallery.columns as string) || '3';

  const valuesItems = (values.items as unknown[]) || [];
  const highlightsItems = (highlights.items as unknown[]) || [];
  const galleryImages = (gallery.images as unknown[]) || [];
  const socials = (contact.socials as unknown[]) || [];

  return `export interface ValueItem {
  emoji: string;
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
}

export interface HighlightItem {
  label: string;
  labelEn?: string;
  value: string;
  valueEn?: string;
}

export interface SocialItem {
  platform: string;
  url: string;
}

const DEMO_VALUES: ValueItem[] = ${buildValuesArray(valuesItems)};

const DEMO_HIGHLIGHTS: HighlightItem[] = ${buildHighlightsArray(highlightsItems)};

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || '${esc(name)}',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || '${esc(nameEn)}',
  tagline: process.env.NEXT_PUBLIC_TAGLINE || '${esc(tagline)}',
  taglineEn: process.env.NEXT_PUBLIC_TAGLINE_EN || '${esc(taglineEn)}',
  heroImageUrl: process.env.NEXT_PUBLIC_HERO_IMAGE_URL || ${heroImageUrl ? `'${esc(heroImageUrl)}'` : 'null'},
  story:
    process.env.NEXT_PUBLIC_STORY ||
    '${esc(story)}',
  storyEn:
    process.env.NEXT_PUBLIC_STORY_EN ||
    '${esc(storyEn)}',
  values: parseJSON<ValueItem[]>(process.env.NEXT_PUBLIC_VALUES, DEMO_VALUES),
  highlights: parseJSON<HighlightItem[]>(process.env.NEXT_PUBLIC_HIGHLIGHTS, DEMO_HIGHLIGHTS),
  galleryImages: parseJSON<string[]>(process.env.NEXT_PUBLIC_GALLERY_IMAGES, ${buildGalleryArray(galleryImages)}),
  email: process.env.NEXT_PUBLIC_EMAIL || '${esc(email)}',
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, ${buildSocialsArray(socials)}),
  gradientFrom: '${esc(gradientFrom)}',
  gradientTo: '${esc(gradientTo)}',
  parallaxEnabled: ${parallaxEnabled},
  fontFamily: '${esc(fontFamily)}',
  galleryColumns: '${esc(galleryColumns)}',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;
}

// ──────────────────────────────────────────────
// dev-showcase config.ts 생성
// ──────────────────────────────────────────────

function buildSkillsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const level = percentToLevel(v.level || '50');
    return `  { name: '${esc(v.name || '')}', level: '${level}' }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildExperienceArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    title: '${esc(v.title || '')}',`,
    ];
    if (v.titleEn) lines.push(`    titleEn: '${esc(v.titleEn)}',`);
    lines.push(`    company: '${esc(v.company || '')}',`);
    if (v.companyEn) lines.push(`    companyEn: '${esc(v.companyEn)}',`);
    lines.push(`    period: '${esc(v.period || '')}',`);
    if (v.periodEn) lines.push(`    periodEn: '${esc(v.periodEn)}',`);
    lines.push(`    description: '${esc(v.description || '')}',`);
    if (v.descriptionEn) lines.push(`    descriptionEn: '${esc(v.descriptionEn)}',`);
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildBlogPostsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return 'null';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    return `  { title: '${esc(v.title || '')}', url: '${esc(v.url || '')}', date: '${esc(v.date || '')}' }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

export function generateDevShowcaseConfigTs(state: ModuleConfigState): string {
  const hero = state.values.hero || {};
  const about = state.values.about || {};
  const projects = state.values.projects || {};
  const experience = state.values.experience || {};
  const blog = state.values.blog || {};
  const contact = state.values.contact || {};

  const name = (hero.name as string) || '김개발';
  const nameEn = (hero.nameEn as string) || 'Gaebal Kim';
  const tagline = (hero.tagline as string) || '풀스택 개발자 | 오픈소스 기여자';
  const taglineEn = (hero.taglineEn as string) || 'Full-Stack Developer | Open Source Contributor';
  const aboutText = (about.story as string) || '';
  const aboutEn = (about.storyEn as string) || '';
  const githubUsername = (projects.githubUsername as string) || '';
  const typingWords = (hero.typingWords as string) || '';
  const maxRepos = (projects.maxRepos as number) ?? 6;
  const email = (contact.email as string) || '';
  const githubUrl = (contact.github as string) || '';
  const linkedinUrl = (contact.linkedin as string) || '';

  const skillItems = (about.skills as unknown[]) || [];
  const experienceItems = (experience.items as unknown[]) || [];
  const blogItems = (blog.items as unknown[]) || [];

  return `export interface SkillItem {
  name: string;
  icon?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface ExperienceItem {
  title: string;
  titleEn?: string;
  company: string;
  companyEn?: string;
  period: string;
  periodEn?: string;
  description: string;
  descriptionEn?: string;
}

export interface BlogPost {
  title: string;
  titleEn?: string;
  url: string;
  date: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  descriptionEn?: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
}

const DEMO_SKILLS: SkillItem[] = ${buildSkillsArray(skillItems)};

const DEMO_EXPERIENCE: ExperienceItem[] = ${buildExperienceArray(experienceItems)};

const DEMO_PROJECTS: ProjectItem[] = [
  {
    name: 'awesome-react-hooks',
    description: '실무에서 자주 사용하는 커스텀 React 훅 모음',
    descriptionEn: 'Collection of custom React hooks for production use',
    url: 'https://github.com',
    language: 'TypeScript',
    stars: 142,
    forks: 23,
  },
  {
    name: 'nextjs-blog-starter',
    description: 'MDX 기반 블로그 스타터 템플릿 (다크모드, SEO)',
    descriptionEn: 'MDX-based blog starter template (dark mode, SEO)',
    url: 'https://github.com',
    language: 'TypeScript',
    stars: 89,
    forks: 15,
  },
  {
    name: 'python-ml-toolkit',
    description: '머신러닝 전처리 유틸리티 라이브러리',
    descriptionEn: 'Machine learning preprocessing utility library',
    url: 'https://github.com',
    language: 'Python',
    stars: 56,
    forks: 8,
  },
  {
    name: 'docker-dev-env',
    description: '개발 환경 Docker Compose 템플릿 모음',
    descriptionEn: 'Collection of Docker Compose templates for dev environments',
    url: 'https://github.com',
    language: 'Dockerfile',
    stars: 34,
    forks: 12,
  },
  {
    name: 'cli-todo-app',
    description: 'Rust로 만든 터미널 할일 관리 앱',
    descriptionEn: 'Terminal todo app built with Rust',
    url: 'https://github.com',
    language: 'Rust',
    stars: 28,
    forks: 5,
  },
  {
    name: 'api-rate-limiter',
    description: 'Express.js 미들웨어 기반 API 속도 제한기',
    descriptionEn: 'Express.js middleware-based API rate limiter',
    url: 'https://github.com',
    language: 'JavaScript',
    stars: 21,
    forks: 3,
  },
];

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || '${esc(name)}',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || '${esc(nameEn)}',
  githubUsername: process.env.NEXT_PUBLIC_GITHUB_USERNAME || ${githubUsername ? `'${esc(githubUsername)}'` : 'null'},
  tagline: process.env.NEXT_PUBLIC_TAGLINE || '${esc(tagline)}',
  taglineEn: process.env.NEXT_PUBLIC_TAGLINE_EN || '${esc(taglineEn)}',
  about:
    process.env.NEXT_PUBLIC_ABOUT ||
    '${esc(aboutText)}',
  aboutEn:
    process.env.NEXT_PUBLIC_ABOUT_EN ||
    '${esc(aboutEn)}',
  skills: parseJSON<SkillItem[]>(process.env.NEXT_PUBLIC_SKILLS, DEMO_SKILLS),
  experience: parseJSON<ExperienceItem[]>(process.env.NEXT_PUBLIC_EXPERIENCE, DEMO_EXPERIENCE),
  projects: DEMO_PROJECTS,
  blogPosts: parseJSON<BlogPost[] | null>(process.env.NEXT_PUBLIC_BLOG_POSTS, ${buildBlogPostsArray(blogItems)}),
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL || null,
  email: process.env.NEXT_PUBLIC_EMAIL || ${email ? `'${esc(email)}'` : 'null'},
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || ${linkedinUrl ? `'${esc(linkedinUrl)}'` : 'null'},
  typingWords: ${typingWords ? `'${esc(typingWords)}'` : 'null'},
  maxRepos: ${maxRepos},
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;
}

// ──────────────────────────────────────────────
// link-in-bio-pro config.ts 생성
// ──────────────────────────────────────────────

function buildLinksArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    title: '${esc(v.title || '')}',`,
    ];
    if (v.titleEn) lines.push(`    titleEn: '${esc(v.titleEn)}',`);
    lines.push(`    url: '${esc(v.url || '')}',`);
    lines.push(`    icon: '${esc(v.emoji || v.icon || '')}',`);
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

export function generateLinkInBioProConfigTs(state: ModuleConfigState): string {
  const profile = state.values.profile || {};
  const links = state.values.links || {};
  const socials = state.values.socials || {};
  const theme = state.values.theme || {};

  const siteName = (profile.name as string) || '내 링크 페이지';
  const siteNameEn = (profile.nameEn as string) || 'My Link Page';
  const bio = (profile.bio as string) || '안녕하세요! 여기서 저의 모든 링크를 확인하세요.';
  const bioEn = (profile.bioEn as string) || 'Hello! Check out all my links here.';
  const avatarUrl = (profile.avatarUrl as string) || '';
  const bgStyle = (theme.bgStyle as string) || 'gradient';
  const primaryColor = (theme.primaryColor as string) || '#8b5cf6';
  const cardStyle = (theme.cardStyle as string) || 'rounded';
  const linkItems = (links.items as unknown[]) || [];
  const socialItems = (socials.items as unknown[]) || [];

  return `export interface LinkItem {
  title: string;
  titleEn?: string;
  url: string;
  icon?: string;
}

export interface SocialItem {
  platform: string;
  url: string;
}

const DEMO_LINKS: LinkItem[] = ${buildLinksArray(linkItems)};

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || '${esc(siteName)}',
  siteNameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || '${esc(siteNameEn)}',
  bio: process.env.NEXT_PUBLIC_BIO || '${esc(bio)}',
  bioEn: process.env.NEXT_PUBLIC_BIO_EN || '${esc(bioEn)}',
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || ${avatarUrl ? `'${esc(avatarUrl)}'` : 'null'},
  theme: process.env.NEXT_PUBLIC_THEME || '${esc(bgStyle)}',
  primaryColor: '${esc(primaryColor)}',
  cardStyle: '${esc(cardStyle)}',
  links: parseJSON<LinkItem[]>(process.env.NEXT_PUBLIC_LINKS, DEMO_LINKS),
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, ${buildSocialsArray(socialItems)}),
  youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || null,
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;
}

// ──────────────────────────────────────────────
// digital-namecard config.ts 생성
// ──────────────────────────────────────────────

export function generateDigitalNamecardConfigTs(state: ModuleConfigState): string {
  const profile = state.values.profile || {};
  const contact = state.values.contact || {};
  const socials = state.values.socials || {};
  const theme = state.values.theme || {};

  const name = (profile.name as string) || '홍길동';
  const nameEn = (profile.nameEn as string) || 'Gildong Hong';
  const title = (profile.title as string) || '프리랜서 개발자';
  const titleEn = (profile.titleEn as string) || 'Freelance Developer';
  const company = (profile.company as string) || '';
  const companyEn = (profile.companyEn as string) || '';
  const avatarUrl = (profile.avatarUrl as string) || '';
  const email = (contact.email as string) || 'hello@example.com';
  const phone = (contact.phone as string) || '010-1234-5678';
  const address = (contact.address as string) || '';
  const addressEn = (contact.addressEn as string) || '';
  const website = (contact.website as string) || '';
  const accentColor = (theme.accentColor as string) || '#3b82f6';
  const socialItems = (socials.items as unknown[]) || [];

  return `export interface SocialItem { platform: string; url: string; }

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || '${esc(name)}',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || '${esc(nameEn)}',
  title: process.env.NEXT_PUBLIC_TITLE || '${esc(title)}',
  titleEn: process.env.NEXT_PUBLIC_TITLE_EN || '${esc(titleEn)}',
  company: process.env.NEXT_PUBLIC_COMPANY || ${company ? `'${esc(company)}'` : 'null'},
  companyEn: process.env.NEXT_PUBLIC_COMPANY_EN || ${companyEn ? `'${esc(companyEn)}'` : 'null'},
  email: process.env.NEXT_PUBLIC_EMAIL || '${esc(email)}',
  phone: process.env.NEXT_PUBLIC_PHONE || ${phone ? `'${esc(phone)}'` : 'null'},
  address: process.env.NEXT_PUBLIC_ADDRESS || ${address ? `'${esc(address)}'` : 'null'},
  addressEn: process.env.NEXT_PUBLIC_ADDRESS_EN || ${addressEn ? `'${esc(addressEn)}'` : 'null'},
  website: process.env.NEXT_PUBLIC_WEBSITE || ${website ? `'${esc(website)}'` : 'null'},
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, ${buildSocialsArray(socialItems)}),
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || ${avatarUrl ? `'${esc(avatarUrl)}'` : 'null'},
  accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || '${esc(accentColor)}',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;
}

// ──────────────────────────────────────────────
// small-biz config.ts 생성
// ──────────────────────────────────────────────

function buildMenuItemsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    name: '${esc(v.name || '')}',`,
    ];
    if (v.nameEn) lines.push(`    nameEn: '${esc(v.nameEn)}',`);
    lines.push(`    desc: '${esc(v.desc || '')}',`);
    if (v.descEn) lines.push(`    descEn: '${esc(v.descEn)}',`);
    lines.push(`    price: '${esc(v.price || '')}',`);
    lines.push(`    category: '${esc(v.category || '')}',`);
    lines.push(`    emoji: '${esc(v.emoji || '🍽️')}',`);
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildBusinessHoursArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    day: '${esc(v.day || '')}',`,
    ];
    if (v.dayEn) lines.push(`    dayEn: '${esc(v.dayEn)}',`);
    lines.push(`    hours: '${esc(v.hours || '')}',`);
    if (v.hoursEn) lines.push(`    hoursEn: '${esc(v.hoursEn)}',`);
    if ((item as Record<string, unknown>).isHoliday) lines.push('    isHoliday: true,');
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

export function generateSmallBizConfigTs(state: ModuleConfigState): string {
  const hero = state.values.hero || {};
  const menu = state.values.menu || {};
  const hours = state.values.hours || {};
  const location = state.values.location || {};
  const gallery = state.values.gallery || {};
  const sns = state.values.sns || {};

  const name = (hero.name as string) || '온기 베이커리';
  const nameEn = (hero.nameEn as string) || 'Ongi Bakery';
  const description = (hero.description as string) || '매일 아침 직접 구운 빵 한 조각으로 하루를 시작하세요.';
  const descriptionEn = (hero.descriptionEn as string) || 'Start your day with a freshly baked loaf every morning.';
  const phone = (hero.phone as string) || '02-334-5870';
  const primaryColor = (hero.primaryColor as string) || '#d47311';
  const fontFamily = (hero.fontFamily as string) || 'Noto Sans KR';

  const address = (location.address as string) || '서울 마포구 연남동 239-10';
  const addressEn = (location.addressEn as string) || '239-10, Yeonnam-dong, Mapo-gu, Seoul';
  const kakaoMapId = (location.kakaoMapId as string) || '';

  const menuItems = (menu.items as unknown[]) || [];
  const hoursItems = (hours.items as unknown[]) || [];
  const galleryImages = (gallery.images as { url: string }[]) || [];

  const instagramUrl = (sns.instagramUrl as string) || '';
  const naverBlogUrl = (sns.naverBlogUrl as string) || '';
  const kakaoChannelUrl = (sns.kakaoChannelUrl as string) || '';

  const galleryArr = buildGalleryArray(galleryImages);

  return `export interface MenuItem {
  name: string;
  nameEn?: string;
  desc: string;
  descEn?: string;
  price: string;
  category: string;
  emoji: string;
}

export interface BusinessHour {
  day: string;
  dayEn?: string;
  hours: string;
  hoursEn?: string;
  isHoliday?: boolean;
}

const DEMO_MENU: MenuItem[] = ${buildMenuItemsArray(menuItems)};

const DEMO_HOURS: BusinessHour[] = ${buildBusinessHoursArray(hoursItems)};

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || '${esc(name)}',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || '${esc(nameEn)}',
  description: process.env.NEXT_PUBLIC_DESCRIPTION || '${esc(description)}',
  descriptionEn: process.env.NEXT_PUBLIC_DESCRIPTION_EN || '${esc(descriptionEn)}',
  phone: process.env.NEXT_PUBLIC_PHONE || ${phone ? `'${esc(phone)}'` : 'null'},
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '${esc(primaryColor)}',
  address: process.env.NEXT_PUBLIC_ADDRESS || '${esc(address)}',
  addressEn: process.env.NEXT_PUBLIC_ADDRESS_EN || '${esc(addressEn)}',
  kakaoMapId: process.env.NEXT_PUBLIC_KAKAO_MAP_ID || ${kakaoMapId ? `'${esc(kakaoMapId)}'` : `''`},
  menuItems: parseJSON<MenuItem[]>(process.env.NEXT_PUBLIC_MENU_ITEMS, DEMO_MENU),
  businessHours: parseJSON<BusinessHour[]>(process.env.NEXT_PUBLIC_BUSINESS_HOURS, DEMO_HOURS),
  galleryImages: parseJSON<string[]>(process.env.NEXT_PUBLIC_GALLERY_IMAGES, ${galleryArr}),
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || ${instagramUrl ? `'${esc(instagramUrl)}'` : `''`},
  naverBlogUrl: process.env.NEXT_PUBLIC_NAVER_BLOG_URL || ${naverBlogUrl ? `'${esc(naverBlogUrl)}'` : `''`},
  kakaoChannelUrl: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || ${kakaoChannelUrl ? `'${esc(kakaoChannelUrl)}'` : `''`},
  fontFamily: '${esc(fontFamily)}',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;
}

// ──────────────────────────────────────────────
// freelancer-page config.ts 생성
// ──────────────────────────────────────────────

function buildServicesArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    title: '${esc(v.title || '')}',`,
    ];
    if (v.titleEn) lines.push(`    titleEn: '${esc(v.titleEn)}',`);
    lines.push(`    desc: '${esc(v.desc || '')}',`);
    if (v.descEn) lines.push(`    descEn: '${esc(v.descEn)}',`);
    lines.push(`    price: '${esc(v.price || '')}',`);
    if (v.priceEn) lines.push(`    priceEn: '${esc(v.priceEn)}',`);
    lines.push(`    icon: '${esc(v.icon || 'palette')}',`);
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildPortfolioArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    title: '${esc(v.title || '')}',`,
    ];
    if (v.titleEn) lines.push(`    titleEn: '${esc(v.titleEn)}',`);
    lines.push(`    category: '${esc(v.category || '')}',`);
    if (v.categoryEn) lines.push(`    categoryEn: '${esc(v.categoryEn)}',`);
    lines.push(`    desc: '${esc(v.desc || '')}',`);
    if (v.descEn) lines.push(`    descEn: '${esc(v.descEn)}',`);
    lines.push(`    imageUrl: '${esc(v.imageUrl || '')}',`);
    const tagsStr = v.tags || '';
    const tagsArr = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    lines.push(`    tags: [${tagsArr.map((t) => `'${esc(t)}'`).join(', ')}],`);
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildTestimonialsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    author: '${esc(v.author || '')}',`,
    ];
    if (v.authorEn) lines.push(`    authorEn: '${esc(v.authorEn)}',`);
    lines.push(`    role: '${esc(v.role || '')}',`);
    if (v.roleEn) lines.push(`    roleEn: '${esc(v.roleEn)}',`);
    lines.push(`    company: '${esc(v.company || '')}',`);
    if (v.companyEn) lines.push(`    companyEn: '${esc(v.companyEn)}',`);
    lines.push(`    content: '${esc(v.content || '')}',`);
    if (v.contentEn) lines.push(`    contentEn: '${esc(v.contentEn)}',`);
    lines.push(`    rating: ${parseInt(v.rating || '5', 10)},`);
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

function buildProcessArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    const lines: string[] = [
      `    number: '${esc(v.number || '01')}',`,
      `    title: '${esc(v.title || '')}',`,
    ];
    if (v.titleEn) lines.push(`    titleEn: '${esc(v.titleEn)}',`);
    lines.push(`    desc: '${esc(v.desc || '')}',`);
    if (v.descEn) lines.push(`    descEn: '${esc(v.descEn)}',`);
    return `  {\n${lines.join('\n')}\n  }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

export function generateFreelancerConfigTs(state: ModuleConfigState): string {
  const hero = state.values.hero || {};
  const services = state.values.services || {};
  const portfolio = state.values.portfolio || {};
  const testimonials = state.values.testimonials || {};
  const processVals = state.values.process || {};
  const contact = state.values.contact || {};

  const name = (hero.name as string) || '정하은';
  const nameEn = (hero.nameEn as string) || 'Haeun Jung';
  const title = (hero.title as string) || '그래픽 디자이너';
  const titleEn = (hero.titleEn as string) || 'Graphic Designer';
  const tagline = (hero.tagline as string) || '브랜드의 이야기를 시각으로 풀어내는 그래픽 디자이너';
  const taglineEn = (hero.taglineEn as string) || 'Graphic designer who tells brand stories through visuals';
  const avatarUrl = (hero.avatarUrl as string) || '';
  const gradientFrom = (hero.gradientFrom as string) || '#5b13ec';
  const gradientTo = (hero.gradientTo as string) || '#06b6d4';
  const fontFamily = (hero.fontFamily as string) || 'Noto Sans KR';
  const email = (contact.email as string) || 'haeun@jung-design.kr';
  const portfolioColumns = (portfolio.columns as string) || '3';

  const serviceItems = (services.items as unknown[]) || [];
  const portfolioItems = (portfolio.items as unknown[]) || [];
  const testimonialItems = (testimonials.items as unknown[]) || [];
  const processItems = (processVals.items as unknown[]) || [];
  const socials = (contact.socials as unknown[]) || [];

  return `export interface ServiceItem {
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
  price: string;
  priceEn?: string;
  icon: string;
}

export interface PortfolioItem {
  title: string;
  titleEn?: string;
  category: string;
  categoryEn?: string;
  desc: string;
  descEn?: string;
  imageUrl: string;
  tags: string[];
}

export interface TestimonialItem {
  author: string;
  authorEn?: string;
  role: string;
  roleEn?: string;
  company: string;
  companyEn?: string;
  content: string;
  contentEn?: string;
  rating: number;
}

export interface ProcessStep {
  number: string;
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
}

export interface SocialItem {
  platform: string;
  url: string;
}

const DEMO_SERVICES: ServiceItem[] = ${buildServicesArray(serviceItems)};

const DEMO_PORTFOLIO: PortfolioItem[] = ${buildPortfolioArray(portfolioItems)};

const DEMO_TESTIMONIALS: TestimonialItem[] = ${buildTestimonialsArray(testimonialItems)};

const DEMO_PROCESS: ProcessStep[] = ${buildProcessArray(processItems)};

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || '${esc(name)}',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || '${esc(nameEn)}',
  title: process.env.NEXT_PUBLIC_TITLE || '${esc(title)}',
  titleEn: process.env.NEXT_PUBLIC_TITLE_EN || '${esc(titleEn)}',
  tagline: process.env.NEXT_PUBLIC_TAGLINE || '${esc(tagline)}',
  taglineEn: process.env.NEXT_PUBLIC_TAGLINE_EN || '${esc(taglineEn)}',
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || ${avatarUrl ? `'${esc(avatarUrl)}'` : 'null'},
  services: parseJSON<ServiceItem[]>(process.env.NEXT_PUBLIC_SERVICES, DEMO_SERVICES),
  portfolio: parseJSON<PortfolioItem[]>(process.env.NEXT_PUBLIC_PORTFOLIO, DEMO_PORTFOLIO),
  testimonials: parseJSON<TestimonialItem[]>(process.env.NEXT_PUBLIC_TESTIMONIALS, DEMO_TESTIMONIALS),
  process: parseJSON<ProcessStep[]>(process.env.NEXT_PUBLIC_PROCESS, DEMO_PROCESS),
  email: process.env.NEXT_PUBLIC_EMAIL || '${esc(email)}',
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, ${buildSocialsArray(socials)}),
  gradientFrom: '${esc(gradientFrom)}',
  gradientTo: '${esc(gradientTo)}',
  fontFamily: '${esc(fontFamily)}',
  portfolioColumns: '${esc(portfolioColumns)}',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;
}

// ──────────────────────────────────────────────
// page.tsx 생성
// ──────────────────────────────────────────────

/** 모듈 ID → import/렌더 매핑 */
const MODULE_COMPONENTS: Record<
  string,
  { importName: string; importPath: string; render: string }
> = {
  hero: {
    importName: 'HeroSection',
    importPath: '@/components/hero-section',
    render: '        <HeroSection config={siteConfig} />',
  },
  about: {
    importName: 'AboutSection',
    importPath: '@/components/about-section',
    render: '        <AboutSection config={siteConfig} />',
  },
  values: {
    importName: 'ValuesSection',
    importPath: '@/components/values-section',
    render: '        <ValuesSection values={siteConfig.values} />',
  },
  highlights: {
    importName: 'HighlightsSection',
    importPath: '@/components/highlights-section',
    render: '        <HighlightsSection highlights={siteConfig.highlights} />',
  },
  gallery: {
    importName: 'GallerySection',
    importPath: '@/components/gallery-section',
    render: `        {siteConfig.galleryImages.length > 0 && (
          <GallerySection images={siteConfig.galleryImages} />
        )}`,
  },
  contact: {
    importName: 'ContactSection',
    importPath: '@/components/contact-section',
    render: '        <ContactSection config={siteConfig} />',
  },
};

/** dev-showcase 모듈 ID → import/렌더 매핑 */
const DEV_SHOWCASE_MODULE_COMPONENTS: Record<
  string,
  { importName: string; importPath: string; render: string }
> = {
  hero: {
    importName: 'HeroSection',
    importPath: '@/components/hero-section',
    render: '        <HeroSection config={siteConfig} />',
  },
  about: {
    importName: 'AboutSection',
    importPath: '@/components/about-section',
    render: `        <AboutSection config={siteConfig} />
        {siteConfig.githubUsername && (
          <GithubGraph username={siteConfig.githubUsername} />
        )}`,
  },
  projects: {
    importName: 'ProjectsSection',
    importPath: '@/components/projects-section',
    render: '        <ProjectsSection projects={siteConfig.projects} />',
  },
  experience: {
    importName: 'ExperienceTimeline',
    importPath: '@/components/experience-timeline',
    render: '        <ExperienceTimeline experience={siteConfig.experience} />',
  },
  blog: {
    importName: 'BlogSection',
    importPath: '@/components/blog-section',
    render: `        {siteConfig.blogPosts && siteConfig.blogPosts.length > 0 && (
          <BlogSection posts={siteConfig.blogPosts} />
        )}`,
  },
  contact: {
    importName: 'ContactSection',
    importPath: '@/components/contact-section',
    render: '        <ContactSection config={siteConfig} />',
  },
};

/** link-in-bio-pro 모듈 ID → import/렌더 매핑 */
const LINK_IN_BIO_PRO_MODULE_COMPONENTS: Record<
  string,
  { importName: string; importPath: string; render: string }
> = {
  profile: {
    importName: 'ProfileSection',
    importPath: '@/components/profile-section',
    render: '        <ProfileSection config={siteConfig} theme={theme} />',
  },
  links: {
    importName: 'LinkList',
    importPath: '@/components/link-list',
    render: '        <LinkList links={siteConfig.links} theme={theme} />',
  },
  socials: {
    importName: 'SocialBar',
    importPath: '@/components/social-bar',
    render: `        {siteConfig.socials.length > 0 && (
          <SocialBar socials={siteConfig.socials} theme={theme} />
        )}`,
  },
  // theme 모듈은 config + getTheme()에만 영향 — 컴포넌트 없음
};

function generateLinkInBioProPageTsx(state: ModuleConfigState): string {
  const activeModules = state.order.filter((id) => state.enabled.includes(id));

  const imports: string[] = [
    "import { siteConfig } from '@/lib/config';",
    "import { getTheme } from '@/lib/themes';",
  ];
  const renders: string[] = [];

  for (const id of activeModules) {
    const comp = LINK_IN_BIO_PRO_MODULE_COMPONENTS[id];
    if (!comp) continue; // theme 등 컴포넌트 없는 모듈 스킵
    imports.push(
      `import { ${comp.importName} } from '${comp.importPath}';`
    );
    renders.push(comp.render);
  }

  // youtubeUrl 임베드는 항상 포함 (config에 값이 있을 때만 렌더)
  imports.push("import { ContentEmbed } from '@/components/content-embed';");
  renders.push(`        {siteConfig.youtubeUrl && (
          <ContentEmbed youtubeUrl={siteConfig.youtubeUrl} />
        )}`);

  imports.push("import { Footer } from '@/components/footer';");

  return `${imports.join('\n')}

export default function Home() {
  const theme = getTheme(siteConfig.theme);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 animate-gradient"
      style={{
        background: \`linear-gradient(135deg, \${theme.backgroundFrom}, \${theme.primary}, \${theme.backgroundTo})\`,
        backgroundSize: '200% 200%',
      }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 py-12">
${renders.join('\n')}
        <Footer theme={theme} />
      </div>
    </main>
  );
}
`;
}

/** digital-namecard 모듈 ID → import/렌더 매핑 */
const DIGITAL_NAMECARD_MODULE_COMPONENTS: Record<
  string,
  { importName: string; importPath: string; render: string }
> = {
  profile: {
    importName: 'ProfileCard',
    importPath: '@/components/profile-card',
    render: '            <ProfileCard config={siteConfig} />',
  },
  contact: {
    importName: 'ContactInfo',
    importPath: '@/components/contact-info',
    render: `            <ContactInfo config={siteConfig} />`,
  },
  socials: {
    importName: 'SocialLinks',
    importPath: '@/components/social-links',
    render: `            {siteConfig.socials.length > 0 && <SocialLinks socials={siteConfig.socials} accentColor={siteConfig.accentColor} />}`,
  },
  // theme 모듈은 config만 영향 — 컴포넌트 없음
};

/** freelancer-page 모듈 ID → import/렌더 매핑 */
const FREELANCER_MODULE_COMPONENTS: Record<
  string,
  { importName: string; importPath: string; render: string }
> = {
  hero: {
    importName: 'HeroSection',
    importPath: '@/components/hero-section',
    render: '        <HeroSection config={siteConfig} />',
  },
  services: {
    importName: 'ServicesSection',
    importPath: '@/components/services-section',
    render: '        <ServicesSection services={siteConfig.services} />',
  },
  portfolio: {
    importName: 'PortfolioSection',
    importPath: '@/components/portfolio-section',
    render: '        <PortfolioSection portfolio={siteConfig.portfolio} />',
  },
  testimonials: {
    importName: 'TestimonialsSection',
    importPath: '@/components/testimonials-section',
    render: '        <TestimonialsSection testimonials={siteConfig.testimonials} />',
  },
  process: {
    importName: 'ProcessSection',
    importPath: '@/components/process-section',
    render: '        <ProcessSection process={siteConfig.process} />',
  },
  contact: {
    importName: 'ContactSection',
    importPath: '@/components/contact-section',
    render: '        <ContactSection config={siteConfig} />',
  },
};

/** small-biz 모듈 ID → import/렌더 매핑 */
const SMALL_BIZ_MODULE_COMPONENTS: Record<
  string,
  { importName: string; importPath: string; render: string }
> = {
  hero: {
    importName: 'HeroSection',
    importPath: '@/components/hero-section',
    render: '        <HeroSection config={siteConfig} />',
  },
  menu: {
    importName: 'MenuSection',
    importPath: '@/components/menu-section',
    render: '        <MenuSection items={siteConfig.menuItems} />',
  },
  hours: {
    importName: 'HoursSection',
    importPath: '@/components/hours-section',
    render: '        <HoursSection hours={siteConfig.businessHours} />',
  },
  location: {
    importName: 'LocationSection',
    importPath: '@/components/location-section',
    render: '        <LocationSection config={siteConfig} />',
  },
  gallery: {
    importName: 'GallerySection',
    importPath: '@/components/gallery-section',
    render: `        {siteConfig.galleryImages.length > 0 && (
          <GallerySection images={siteConfig.galleryImages} />
        )}`,
  },
  sns: {
    importName: 'SnsSection',
    importPath: '@/components/sns-section',
    render: '        <SnsSection config={siteConfig} />',
  },
};

function generateDigitalNamecardPageTsx(state: ModuleConfigState): string {
  const activeModules = state.order.filter((id) => state.enabled.includes(id));

  const imports: string[] = [
    "import { siteConfig } from '@/lib/config';",
  ];
  const renders: string[] = [];

  // contact 활성화 시 QrCode + SaveContactButton 자동 포함
  let needsQr = false;

  for (const id of activeModules) {
    const comp = DIGITAL_NAMECARD_MODULE_COMPONENTS[id];
    if (!comp) continue; // theme 등 컴포넌트 없는 모듈 스킵
    imports.push(
      `import { ${comp.importName} } from '${comp.importPath}';`
    );
    renders.push(comp.render);
    if (id === 'contact') needsQr = true;
  }

  if (needsQr) {
    imports.push("import { QrCode } from '@/components/qr-code';");
    imports.push("import { SaveContactButton } from '@/components/save-contact-button';");
    renders.push('            <QrCode config={siteConfig} />');
    renders.push('            <SaveContactButton config={siteConfig} />');
  }

  imports.push("import { Footer } from '@/components/footer';");

  return `${imports.join('\n')}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="print-card rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-800">
          <div className="h-2" style={{ background: \`linear-gradient(90deg, \${siteConfig.accentColor}, \${siteConfig.accentColor}dd)\` }} />
          <div className="p-6 space-y-5">
${renders.join('\n')}
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
`;
}

export function generatePageTsx(state: ModuleConfigState, templateSlug?: string): string {
  if (templateSlug === 'link-in-bio-pro') {
    return generateLinkInBioProPageTsx(state);
  }
  if (templateSlug === 'digital-namecard') {
    return generateDigitalNamecardPageTsx(state);
  }
  const isDevShowcase = templateSlug === 'dev-showcase';
  const isFreelancer = templateSlug === 'freelancer-page';
  const isSmallBiz = templateSlug === 'small-biz';
  const componentMap = isSmallBiz
    ? SMALL_BIZ_MODULE_COMPONENTS
    : isFreelancer
      ? FREELANCER_MODULE_COMPONENTS
      : isDevShowcase
        ? DEV_SHOWCASE_MODULE_COMPONENTS
        : MODULE_COMPONENTS;
  const activeModules = state.order.filter((id) => state.enabled.includes(id));

  const imports: string[] = [
    "import { siteConfig } from '@/lib/config';",
    "import { NavHeader } from '@/components/nav-header';",
  ];
  const renders: string[] = [];

  // dev-showcase: about 모듈이 활성화되면 GithubGraph도 import
  let needsGithubGraph = false;

  for (const id of activeModules) {
    const comp = componentMap[id];
    if (!comp) continue;
    imports.push(
      `import { ${comp.importName} } from '${comp.importPath}';`
    );
    if (isDevShowcase && id === 'about') {
      needsGithubGraph = true;
    }
    renders.push(comp.render);
  }

  if (needsGithubGraph) {
    imports.push("import { GithubGraph } from '@/components/github-graph';");
  }

  // small-biz: QuickActions 자동 포함
  if (isSmallBiz && state.enabled.includes('hero')) {
    imports.push("import { QuickActions } from '@/components/quick-actions';");
    // QuickActions를 hero 바로 뒤에 삽입
    const heroIdx = renders.findIndex(r => r.includes('HeroSection'));
    if (heroIdx >= 0) {
      renders.splice(heroIdx + 1, 0, '        <QuickActions config={siteConfig} />');
    }
  }

  imports.push("import { Footer } from '@/components/footer';");

  return `${imports.join('\n')}

export default function Home() {
  return (
    <>
      <NavHeader />
      <main>
${renders.join('\n')}
      </main>
      <Footer />
    </>
  );
}
`;
}

// ──────────────────────────────────────────────
// Phase 2: 컴포넌트 수준 코드 생성기
// ──────────────────────────────────────────────

/** Hero 컴포넌트의 그래디언트 색상 치환 */
export function generateHeroSection(
  state: ModuleConfigState,
  baseCode: string
): string {
  const hero = state.values.hero || {};
  const from = (hero.gradientFrom as string) || '#ee5b2b';
  const to = (hero.gradientTo as string) || '#f59e0b';

  let code = baseCode;
  // Tailwind 클래스 내 색상 치환: from-[#xxxxxx] → from-[#newColor]
  code = code.replace(/from-\[#[a-fA-F0-9]{6}\]/g, `from-[${from}]`);
  code = code.replace(/to-\[#[a-fA-F0-9]{6}\]/g, `to-[${to}]`);
  // inline gradient 치환: linear-gradient(..., #old1, #old2)
  code = code.replace(
    /linear-gradient\(90deg,\s*#[a-fA-F0-9]{6},\s*#[a-fA-F0-9]{6}\)/g,
    `linear-gradient(90deg, ${from}, ${to})`
  );
  // from-[#xxx]/10 패턴 (반투명 배경)
  code = code.replace(
    /from-\[#[a-fA-F0-9]{6}\]\/10/g,
    `from-[${from}]/10`
  );
  return code;
}

/** Values 컴포넌트의 컬럼 수 치환 */
export function generateValuesSection(
  state: ModuleConfigState,
  baseCode: string
): string {
  const values = state.values.values || {};
  const cols = (values.columns as string) || '3';

  let code = baseCode;
  // md:grid-cols-X 치환
  code = code.replace(/md:grid-cols-\d/g, `md:grid-cols-${cols}`);
  return code;
}

/** Gallery 컴포넌트의 컬럼 수 치환 */
export function generateGallerySection(
  state: ModuleConfigState,
  baseCode: string
): string {
  const gallery = state.values.gallery || {};
  const cols = (gallery.columns as string) || '3';

  let code = baseCode;
  // lg:grid-cols-X 치환
  code = code.replace(/lg:grid-cols-\d/g, `lg:grid-cols-${cols}`);
  return code;
}

/** globals.css 내 primary 색상 변수 치환 */
export function generateGlobalsCss(
  state: ModuleConfigState,
  baseCode: string
): string {
  const hero = state.values.hero || {};
  const from = (hero.gradientFrom as string) || '#ee5b2b';

  return baseCode.replace(
    /--color-primary:\s*#[a-fA-F0-9]{6}/g,
    `--color-primary: ${from}`
  );
}

/** layout.tsx 내 Google Fonts CDN 링크와 font-family 치환 */
export function generateLayoutTsx(
  state: ModuleConfigState,
  baseCode: string
): string {
  const hero = state.values.hero || {};
  const font = (hero.fontFamily as string) || 'Pretendard';
  if (font === 'Pretendard') return baseCode; // 기본값이면 변경 불필요

  let code = baseCode;

  // Google Fonts CDN 링크 교체/추가
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
  const linkTag = `<link rel="stylesheet" href="${googleFontUrl}" />`;

  // 기존 google fonts link 교체
  const existingFontLink = /(<link[^>]*fonts\.googleapis\.com[^>]*\/>)/;
  if (existingFontLink.test(code)) {
    code = code.replace(existingFontLink, linkTag);
  } else if (code.includes('</head>')) {
    code = code.replace('</head>', `    ${linkTag}\n  </head>`);
  }

  // font-family CSS 또는 Tailwind 변수 치환
  code = code.replace(
    /fontFamily:\s*['"][^'"]+['"]/g,
    `fontFamily: '${font}'`
  );
  code = code.replace(
    /font-family:\s*[^;]+;/g,
    `font-family: '${font}', sans-serif;`
  );

  return code;
}

// ──────────────────────────────────────────────
// 종합: 변경된 파일 목록 생성
// ──────────────────────────────────────────────

export interface GeneratedFile {
  path: string;
  content: string;
}

/**
 * 모듈 설정에서 변경된 파일 목록을 생성합니다.
 * @param state 현재 모듈 설정 상태
 * @param currentFiles 기존 파일 내용 캐시 (Phase 2 컴포넌트 수준 편집용)
 * @param templateSlug 템플릿 슬러그 (personal-brand, dev-showcase 등)
 */
export function generateFiles(
  state: ModuleConfigState,
  currentFiles?: Record<string, string>,
  templateSlug?: string
): GeneratedFile[] {
  const isDevShowcase = templateSlug === 'dev-showcase';
  const isDigitalNamecard = templateSlug === 'digital-namecard';
  const isFreelancer = templateSlug === 'freelancer-page';
  const isLinkInBio = templateSlug === 'link-in-bio-pro';

  const isSmallBiz = templateSlug === 'small-biz';

  const configContent = isSmallBiz
    ? generateSmallBizConfigTs(state)
    : isLinkInBio
      ? generateLinkInBioProConfigTs(state)
      : isFreelancer
        ? generateFreelancerConfigTs(state)
        : isDigitalNamecard
          ? generateDigitalNamecardConfigTs(state)
          : isDevShowcase
            ? generateDevShowcaseConfigTs(state)
            : generateConfigTs(state);

  const files: GeneratedFile[] = [
    { path: 'src/lib/config.ts', content: configContent },
    { path: 'src/app/page.tsx', content: generatePageTsx(state, templateSlug) },
  ];

  // Phase 2: 컴포넌트 파일 변경 (personal-brand + freelancer-page)
  if (currentFiles && !isDevShowcase && !isDigitalNamecard && !isLinkInBio && !isSmallBiz) {
    const hero = state.values.hero || {};

    // Hero: 그래디언트 색상이 기본값과 다르면 생성
    const defaultFrom = isFreelancer ? '#5b13ec' : '#ee5b2b';
    const defaultTo = isFreelancer ? '#06b6d4' : '#f59e0b';
    if (hero.gradientFrom && hero.gradientFrom !== defaultFrom ||
        hero.gradientTo && hero.gradientTo !== defaultTo) {
      const heroBase = currentFiles['src/components/hero-section.tsx'];
      if (heroBase) {
        files.push({
          path: 'src/components/hero-section.tsx',
          content: generateHeroSection(state, heroBase),
        });
      }

      // globals.css도 primary 색상 변경
      const cssBase = currentFiles['src/app/globals.css'];
      if (cssBase) {
        files.push({
          path: 'src/app/globals.css',
          content: generateGlobalsCss(state, cssBase),
        });
      }
    }

    // personal-brand: Values 컬럼 수
    if (!isFreelancer) {
      const values = state.values.values || {};
      if (values.columns && values.columns !== '3') {
        const valuesBase = currentFiles['src/components/values-section.tsx'];
        if (valuesBase) {
          files.push({
            path: 'src/components/values-section.tsx',
            content: generateValuesSection(state, valuesBase),
          });
        }
      }

      // Gallery: 컬럼 수가 기본값(3)과 다르면 생성
      const gallery = state.values.gallery || {};
      if (gallery.columns && gallery.columns !== '3') {
        const galleryBase = currentFiles['src/components/gallery-section.tsx'];
        if (galleryBase) {
          files.push({
            path: 'src/components/gallery-section.tsx',
            content: generateGallerySection(state, galleryBase),
          });
        }
      }
    }

    // freelancer-page: Portfolio 컬럼 수
    if (isFreelancer) {
      const portfolio = state.values.portfolio || {};
      if (portfolio.columns && portfolio.columns !== '3') {
        const portfolioBase = currentFiles['src/components/portfolio-section.tsx'];
        if (portfolioBase) {
          let code = portfolioBase;
          code = code.replace(/lg:grid-cols-\d/g, `lg:grid-cols-${portfolio.columns}`);
          files.push({
            path: 'src/components/portfolio-section.tsx',
            content: code,
          });
        }
      }
    }

    // Layout: 폰트가 기본값(Pretendard)과 다르면 생성
    const fontFamily = (hero.fontFamily as string) || 'Pretendard';
    if (fontFamily !== 'Pretendard') {
      const layoutBase = currentFiles['src/app/layout.tsx'];
      if (layoutBase) {
        files.push({
          path: 'src/app/layout.tsx',
          content: generateLayoutTsx(state, layoutBase),
        });
      }
    }
  }

  // Phase 2: small-biz 컴포넌트 파일 변경
  if (currentFiles && isSmallBiz) {
    const hero = state.values.hero || {};
    const primaryColor = (hero.primaryColor as string) || '#d47311';

    // primary 색상이 기본값과 다르면 globals.css 치환
    if (primaryColor !== '#d47311') {
      const cssBase = currentFiles['src/app/globals.css'];
      if (cssBase) {
        files.push({
          path: 'src/app/globals.css',
          content: cssBase.replace(
            /--color-primary:\s*#[a-fA-F0-9]{6}/g,
            `--color-primary: ${primaryColor}`
          ),
        });
      }
    }

    // Layout: 폰트 치환
    const fontFamily = (hero.fontFamily as string) || 'Pretendard';
    if (fontFamily !== 'Pretendard') {
      const layoutBase = currentFiles['src/app/layout.tsx'];
      if (layoutBase) {
        files.push({
          path: 'src/app/layout.tsx',
          content: generateLayoutTsx(state, layoutBase),
        });
      }
    }
  }

  return files;
}

// ──────────────────────────────────────────────
// 스키마에서 초기 상태 추출
// ──────────────────────────────────────────────

export function buildInitialState(
  schema: TemplateModuleSchema
): ModuleConfigState {
  const values: Record<string, Record<string, unknown>> = {};
  const enabled: string[] = [];

  for (const mod of schema.modules) {
    const modValues: Record<string, unknown> = {};
    for (const field of mod.fields) {
      modValues[field.key] = field.defaultValue;
    }
    values[mod.id] = modValues;
    if (mod.defaultEnabled) {
      enabled.push(mod.id);
    }
  }

  return {
    values,
    enabled,
    order: [...schema.defaultOrder],
  };
}

/**
 * 배포된 config.ts 파일에서 현재 값을 파싱하여 ModuleConfigState 구축.
 * 정규식 기반으로 간단히 추출 (정확한 AST 파싱 대신 실용적 접근).
 */
export function parseConfigToState(
  configContent: string,
  schema: TemplateModuleSchema
): ModuleConfigState {
  if (schema.templateSlug === 'dev-showcase') {
    return parseDevShowcaseConfigToState(configContent, schema);
  }
  if (schema.templateSlug === 'link-in-bio-pro') {
    return parseLinkInBioProConfigToState(configContent, schema);
  }
  if (schema.templateSlug === 'digital-namecard') {
    return parseDigitalNamecardConfigToState(configContent, schema);
  }
  if (schema.templateSlug === 'freelancer-page') {
    return parseFreelancerConfigToState(configContent, schema);
  }
  if (schema.templateSlug === 'small-biz') {
    return parseSmallBizConfigToState(configContent, schema);
  }
  return parsePersonalBrandConfigToState(configContent, schema);
}

/** personal-brand config.ts 파싱 */
function parsePersonalBrandConfigToState(
  configContent: string,
  schema: TemplateModuleSchema
): ModuleConfigState {
  const state = buildInitialState(schema);
  const siteBlock = configContent.match(/export const siteConfig\s*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? configContent;

  const extractString = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?'((?:[^'\\\\]|\\\\.)*)'`
    );
    const m = siteBlock.match(re);
    return m ? m[1].replace(/\\(.)/g, '$1') : null;
  };

  const extractNullable = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?(?:'((?:[^'\\\\]|\\\\.)*)'|null)`
    );
    const m = siteBlock.match(re);
    return m ? (m[1] ?? '').replace(/\\(.)/g, '$1') : null;
  };

  // Hero
  const name = extractString('name');
  if (name !== null) state.values.hero.name = name;
  const nameEn = extractString('nameEn');
  if (nameEn !== null) state.values.hero.nameEn = nameEn;
  const tagline = extractString('tagline');
  if (tagline !== null) state.values.hero.tagline = tagline;
  const taglineEn = extractString('taglineEn');
  if (taglineEn !== null) state.values.hero.taglineEn = taglineEn;
  const heroImg = extractNullable('heroImageUrl');
  if (heroImg !== null) state.values.hero.heroImageUrl = heroImg;
  const gradientFrom = extractString('gradientFrom');
  if (gradientFrom !== null) state.values.hero.gradientFrom = gradientFrom;
  const gradientTo = extractString('gradientTo');
  if (gradientTo !== null) state.values.hero.gradientTo = gradientTo;
  const parallaxMatch = configContent.match(/parallaxEnabled:\s*(true|false)/);
  if (parallaxMatch) state.values.hero.parallaxEnabled = parallaxMatch[1] === 'true';
  const fontFamily = extractString('fontFamily');
  if (fontFamily !== null) state.values.hero.fontFamily = fontFamily;

  // About
  const story = extractString('story');
  if (story !== null) state.values.about.story = story;
  const storyEn = extractString('storyEn');
  if (storyEn !== null) state.values.about.storyEn = storyEn;

  // Contact
  const email = extractString('email');
  if (email !== null) state.values.contact.email = email;

  // Values — DEMO_VALUES 배열에서 파싱
  try {
    const valuesMatch = configContent.match(
      /const DEMO_VALUES:.*?=\s*(\[[\s\S]*?\n\]);/
    );
    if (valuesMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(valuesMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.title) items.push(obj);
      }
      if (items.length > 0) state.values.values.items = items;
    }
  } catch {
    // 파싱 실패 시 기본값 유지
  }

  // Highlights
  try {
    const hlMatch = configContent.match(
      /const DEMO_HIGHLIGHTS:.*?=\s*(\[[\s\S]*?\n\]);/
    );
    if (hlMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(hlMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.value) items.push(obj);
      }
      if (items.length > 0) state.values.highlights.items = items;
    }
  } catch {
    // 파싱 실패 시 기본값 유지
  }

  // Socials
  try {
    const socialsMatch = configContent.match(
      /socials:\s*parseJSON<SocialItem\[\]>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/
    );
    if (socialsMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(socialsMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.platform) items.push(obj);
      }
      if (items.length > 0) state.values.contact.socials = items;
    }
  } catch {
    // 파싱 실패 시 기본값 유지
  }

  // Gallery images
  try {
    const galMatch = configContent.match(
      /galleryImages:\s*parseJSON<string\[\]>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/
    );
    if (galMatch) {
      const items: Record<string, string>[] = [];
      const urlRe = /'([^']+)'/g;
      let m;
      while ((m = urlRe.exec(galMatch[1])) !== null) {
        items.push({ url: m[1] });
      }
      if (items.length > 0) state.values.gallery.images = items;
    }
  } catch {
    // 기본값 유지
  }
  const galleryColumns = extractString('galleryColumns');
  if (galleryColumns !== null) state.values.gallery.columns = galleryColumns;

  return state;
}

/** dev-showcase config.ts 파싱 */
function parseDevShowcaseConfigToState(
  configContent: string,
  schema: TemplateModuleSchema
): ModuleConfigState {
  const state = buildInitialState(schema);
  const siteBlock = configContent.match(/export const siteConfig\s*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? configContent;

  const extractString = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?'((?:[^'\\\\]|\\\\.)*)'`
    );
    const m = siteBlock.match(re);
    return m ? m[1].replace(/\\(.)/g, '$1') : null;
  };

  const extractNullable = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?(?:'((?:[^'\\\\]|\\\\.)*)'|null)`
    );
    const m = siteBlock.match(re);
    return m ? (m[1] ?? '').replace(/\\(.)/g, '$1') : null;
  };

  // Hero
  const name = extractString('name');
  if (name !== null) state.values.hero.name = name;
  const nameEn = extractString('nameEn');
  if (nameEn !== null) state.values.hero.nameEn = nameEn;
  const tagline = extractString('tagline');
  if (tagline !== null) state.values.hero.tagline = tagline;
  const taglineEn = extractString('taglineEn');
  if (taglineEn !== null) state.values.hero.taglineEn = taglineEn;
  const typingWords = extractNullable('typingWords');
  if (typingWords !== null) state.values.hero.typingWords = typingWords;

  // About
  const about = extractString('about');
  if (about !== null) state.values.about.story = about;
  const aboutEn = extractString('aboutEn');
  if (aboutEn !== null) state.values.about.storyEn = aboutEn;

  // Skills — DEMO_SKILLS 배열에서 파싱
  try {
    const skillsMatch = configContent.match(
      /const DEMO_SKILLS:.*?=\s*(\[[\s\S]*?\n\]);/
    );
    if (skillsMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(skillsMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.name) {
          items.push({
            name: obj.name,
            level: levelToPercent(obj.level || 'intermediate'),
          });
        }
      }
      if (items.length > 0) state.values.about.skills = items;
    }
  } catch {
    // 기본값 유지
  }

  // Projects
  const githubUsername = extractNullable('githubUsername');
  if (githubUsername !== null) state.values.projects.githubUsername = githubUsername;
  const maxReposMatch = configContent.match(/maxRepos:\s*(\d+)/);
  if (maxReposMatch) state.values.projects.maxRepos = Number(maxReposMatch[1]);

  // Experience — DEMO_EXPERIENCE 배열에서 파싱
  try {
    const expMatch = configContent.match(
      /const DEMO_EXPERIENCE:.*?=\s*(\[[\s\S]*?\n\]);/
    );
    if (expMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(expMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.title) items.push(obj);
      }
      if (items.length > 0) state.values.experience.items = items;
    }
  } catch {
    // 기본값 유지
  }

  // Blog — blogPosts 파싱
  try {
    const blogMatch = configContent.match(
      /blogPosts:\s*parseJSON<BlogPost\[\][^>]*>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/
    );
    if (blogMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(blogMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.title) items.push(obj);
      }
      if (items.length > 0) state.values.blog.items = items;
    }
  } catch {
    // 기본값 유지
  }

  // Contact
  const email = extractNullable('email');
  if (email !== null) state.values.contact.email = email;
  const linkedinUrl = extractNullable('linkedinUrl');
  if (linkedinUrl !== null) state.values.contact.linkedin = linkedinUrl;
  // GitHub URL은 githubUsername에서 유추
  if (githubUsername) {
    state.values.contact.github = `https://github.com/${githubUsername}`;
  }

  return state;
}

/** link-in-bio-pro config.ts 파싱 */
function parseLinkInBioProConfigToState(
  configContent: string,
  schema: TemplateModuleSchema
): ModuleConfigState {
  const state = buildInitialState(schema);
  const siteBlock = configContent.match(/export const siteConfig\s*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? configContent;

  const extractString = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?'((?:[^'\\\\]|\\\\.)*)'`
    );
    const m = siteBlock.match(re);
    return m ? m[1].replace(/\\(.)/g, '$1') : null;
  };

  const extractNullable = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?(?:'((?:[^'\\\\]|\\\\.)*)'|null)`
    );
    const m = siteBlock.match(re);
    return m ? (m[1] ?? '').replace(/\\(.)/g, '$1') : null;
  };

  // Profile
  const siteName = extractString('siteName');
  if (siteName !== null) state.values.profile.name = siteName;
  const siteNameEn = extractString('siteNameEn');
  if (siteNameEn !== null) state.values.profile.nameEn = siteNameEn;
  const bio = extractString('bio');
  if (bio !== null) state.values.profile.bio = bio;
  const bioEn = extractString('bioEn');
  if (bioEn !== null) state.values.profile.bioEn = bioEn;
  const avatarUrl = extractNullable('avatarUrl');
  if (avatarUrl !== null) state.values.profile.avatarUrl = avatarUrl;

  // Links — DEMO_LINKS 배열에서 파싱
  try {
    const linksMatch = configContent.match(
      /const DEMO_LINKS:.*?=\s*(\[[\s\S]*?\n\]);/
    );
    if (linksMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(linksMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.title) {
          items.push({
            title: obj.title,
            titleEn: obj.titleEn || '',
            url: obj.url || '',
            emoji: obj.icon || '',
          });
        }
      }
      if (items.length > 0) state.values.links.items = items;
    }
  } catch {
    // 기본값 유지
  }

  // Socials
  try {
    const socialsMatch = configContent.match(
      /socials:\s*parseJSON<SocialItem\[\]>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/
    );
    if (socialsMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(socialsMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.platform) items.push(obj);
      }
      if (items.length > 0) state.values.socials.items = items;
    }
  } catch {
    // 기본값 유지
  }

  // Theme
  const themeVal = extractString('theme');
  if (themeVal !== null) state.values.theme.bgStyle = themeVal;
  const primaryColor = extractString('primaryColor');
  if (primaryColor !== null) state.values.theme.primaryColor = primaryColor;
  const cardStyle = extractString('cardStyle');
  if (cardStyle !== null) state.values.theme.cardStyle = cardStyle;

  return state;
}

/** digital-namecard config.ts 파싱 */
function parseDigitalNamecardConfigToState(
  configContent: string,
  schema: TemplateModuleSchema
): ModuleConfigState {
  const state = buildInitialState(schema);
  const siteBlock = configContent.match(/export const siteConfig\s*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? configContent;

  const extractString = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?'((?:[^'\\\\]|\\\\.)*)'`
    );
    const m = siteBlock.match(re);
    return m ? m[1].replace(/\\(.)/g, '$1') : null;
  };

  const extractNullable = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?(?:'((?:[^'\\\\]|\\\\.)*)'|null)`
    );
    const m = siteBlock.match(re);
    return m ? (m[1] ?? '').replace(/\\(.)/g, '$1') : null;
  };

  // Profile
  const name = extractString('name');
  if (name !== null) state.values.profile.name = name;
  const nameEn = extractString('nameEn');
  if (nameEn !== null) state.values.profile.nameEn = nameEn;
  const title = extractString('title');
  if (title !== null) state.values.profile.title = title;
  const titleEn = extractString('titleEn');
  if (titleEn !== null) state.values.profile.titleEn = titleEn;
  const company = extractNullable('company');
  if (company !== null) state.values.profile.company = company;
  const companyEn = extractNullable('companyEn');
  if (companyEn !== null) state.values.profile.companyEn = companyEn;
  const avatarUrl = extractNullable('avatarUrl');
  if (avatarUrl !== null) state.values.profile.avatarUrl = avatarUrl;

  // Contact
  const email = extractString('email');
  if (email !== null) state.values.contact.email = email;
  const phone = extractNullable('phone');
  if (phone !== null) state.values.contact.phone = phone;
  const address = extractNullable('address');
  if (address !== null) state.values.contact.address = address;
  const addressEn = extractNullable('addressEn');
  if (addressEn !== null) state.values.contact.addressEn = addressEn;
  const website = extractNullable('website');
  if (website !== null) state.values.contact.website = website;

  // Socials
  try {
    const socialsMatch = configContent.match(
      /socials:\s*parseJSON<SocialItem\[\]>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/
    );
    if (socialsMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(socialsMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.platform) items.push(obj);
      }
      if (items.length > 0) state.values.socials.items = items;
    }
  } catch {
    // 기본값 유지
  }

  // Theme
  const accentColor = extractString('accentColor');
  if (accentColor !== null) state.values.theme.accentColor = accentColor;

  return state;
}

/** freelancer-page config.ts 파싱 */
function parseFreelancerConfigToState(
  configContent: string,
  schema: TemplateModuleSchema
): ModuleConfigState {
  const state = buildInitialState(schema);
  const siteBlock = configContent.match(/export const siteConfig\s*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? configContent;

  const extractString = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?'((?:[^'\\\\]|\\\\.)*)'`
    );
    const m = siteBlock.match(re);
    return m ? m[1].replace(/\\(.)/g, '$1') : null;
  };

  const extractNullable = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?(?:'((?:[^'\\\\]|\\\\.)*)'|null)`
    );
    const m = siteBlock.match(re);
    return m ? (m[1] ?? '').replace(/\\(.)/g, '$1') : null;
  };

  // Hero
  const name = extractString('name');
  if (name !== null) state.values.hero.name = name;
  const nameEn = extractString('nameEn');
  if (nameEn !== null) state.values.hero.nameEn = nameEn;
  const title = extractString('title');
  if (title !== null) state.values.hero.title = title;
  const titleEn = extractString('titleEn');
  if (titleEn !== null) state.values.hero.titleEn = titleEn;
  const tagline = extractString('tagline');
  if (tagline !== null) state.values.hero.tagline = tagline;
  const taglineEn = extractString('taglineEn');
  if (taglineEn !== null) state.values.hero.taglineEn = taglineEn;
  const avatarUrl = extractNullable('avatarUrl');
  if (avatarUrl !== null) state.values.hero.avatarUrl = avatarUrl;
  const gradientFrom = extractString('gradientFrom');
  if (gradientFrom !== null) state.values.hero.gradientFrom = gradientFrom;
  const gradientTo = extractString('gradientTo');
  if (gradientTo !== null) state.values.hero.gradientTo = gradientTo;
  const fontFamily = extractString('fontFamily');
  if (fontFamily !== null) state.values.hero.fontFamily = fontFamily;

  // Contact
  const email = extractString('email');
  if (email !== null) state.values.contact.email = email;

  // Services — DEMO_SERVICES 배열에서 파싱
  try {
    const servicesMatch = configContent.match(
      /const DEMO_SERVICES:.*?=\s*(\[[\s\S]*?\n\]);/
    );
    if (servicesMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(servicesMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.title) items.push(obj);
      }
      if (items.length > 0) state.values.services.items = items;
    }
  } catch {
    // 기본값 유지
  }

  // Portfolio — DEMO_PORTFOLIO 배열에서 파싱
  try {
    const portfolioMatch = configContent.match(
      /const DEMO_PORTFOLIO:.*?=\s*(\[[\s\S]*?\n\]);/
    );
    if (portfolioMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([\s\S]*?)\}/g;
      let m;
      while ((m = objRe.exec(portfolioMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        // tags 배열 파싱: tags: ['a', 'b']
        const tagsMatch = m[1].match(/tags:\s*\[(.*?)\]/);
        if (tagsMatch) {
          const tags: string[] = [];
          const tagRe = /'([^']*)'/g;
          let tm;
          while ((tm = tagRe.exec(tagsMatch[1])) !== null) {
            tags.push(tm[1]);
          }
          obj.tags = tags.join(', ');
        }
        if (obj.title) items.push(obj);
      }
      if (items.length > 0) state.values.portfolio.items = items;
    }
  } catch {
    // 기본값 유지
  }

  // Testimonials — DEMO_TESTIMONIALS 배열에서 파싱
  try {
    const testimonialsMatch = configContent.match(
      /const DEMO_TESTIMONIALS:.*?=\s*(\[[\s\S]*?\n\]);/
    );
    if (testimonialsMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([\s\S]*?)\n  \}/g;
      let m;
      while ((m = objRe.exec(testimonialsMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        // rating 숫자 파싱
        const ratingMatch = m[1].match(/rating:\s*(\d+)/);
        if (ratingMatch) obj.rating = ratingMatch[1];
        if (obj.author) items.push(obj);
      }
      if (items.length > 0) state.values.testimonials.items = items;
    }
  } catch {
    // 기본값 유지
  }

  // Process — DEMO_PROCESS 배열에서 파싱
  try {
    const processMatch = configContent.match(
      /const DEMO_PROCESS:.*?=\s*(\[[\s\S]*?\n\]);/
    );
    if (processMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(processMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.title) items.push(obj);
      }
      if (items.length > 0) state.values.process.items = items;
    }
  } catch {
    // 기본값 유지
  }

  // Socials
  try {
    const socialsMatch = configContent.match(
      /socials:\s*parseJSON<SocialItem\[\]>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/
    );
    if (socialsMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([^}]+)\}/g;
      let m;
      while ((m = objRe.exec(socialsMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.platform) items.push(obj);
      }
      if (items.length > 0) state.values.contact.socials = items;
    }
  } catch {
    // 기본값 유지
  }
  const portfolioColumns = extractString('portfolioColumns');
  if (portfolioColumns !== null) state.values.portfolio.columns = portfolioColumns;

  return state;
}

/** small-biz config.ts 파싱 */
function parseSmallBizConfigToState(
  configContent: string,
  schema: TemplateModuleSchema
): ModuleConfigState {
  const state = buildInitialState(schema);
  const siteBlock = configContent.match(/export const siteConfig\s*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? configContent;

  const extractString = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?'((?:[^'\\\\]|\\\\.)*)'`
    );
    const m = siteBlock.match(re);
    return m ? m[1].replace(/\\(.)/g, '$1') : null;
  };

  const extractNullable = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?(?:'((?:[^'\\\\]|\\\\.)*)'|null)`
    );
    const m = siteBlock.match(re);
    return m ? (m[1] ?? '').replace(/\\(.)/g, '$1') : null;
  };

  // Hero
  const name = extractString('name');
  if (name !== null) state.values.hero.name = name;
  const nameEn = extractString('nameEn');
  if (nameEn !== null) state.values.hero.nameEn = nameEn;
  const description = extractString('description');
  if (description !== null) state.values.hero.description = description;
  const descriptionEn = extractString('descriptionEn');
  if (descriptionEn !== null) state.values.hero.descriptionEn = descriptionEn;
  const phone = extractNullable('phone');
  if (phone !== null) state.values.hero.phone = phone;
  const primaryColor = extractString('primaryColor');
  if (primaryColor !== null) state.values.hero.primaryColor = primaryColor;
  const fontFamily = extractString('fontFamily');
  if (fontFamily !== null) state.values.hero.fontFamily = fontFamily;

  // Location
  const address = extractString('address');
  if (address !== null) state.values.location.address = address;
  const addressEn = extractString('addressEn');
  if (addressEn !== null) state.values.location.addressEn = addressEn;
  const kakaoMapId = extractNullable('kakaoMapId');
  if (kakaoMapId !== null) state.values.location.kakaoMapId = kakaoMapId;

  // Menu — DEMO_MENU 배열에서 파싱
  try {
    const menuMatch = configContent.match(
      /const DEMO_MENU:.*?=\s*(\[[\s\S]*?\n\]);/
    );
    if (menuMatch) {
      const items: Record<string, string>[] = [];
      const objRe = /\{([\s\S]*?)\n  \}/g;
      let m;
      while ((m = objRe.exec(menuMatch[1])) !== null) {
        const obj: Record<string, string> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        if (obj.name) items.push(obj);
      }
      if (items.length > 0) state.values.menu.items = items;
    }
  } catch {
    // 기본값 유지
  }

  // Hours — DEMO_HOURS 배열에서 파싱
  try {
    const hoursMatch = configContent.match(
      /const DEMO_HOURS:.*?=\s*(\[[\s\S]*?\n\]);/
    );
    if (hoursMatch) {
      const items: Record<string, unknown>[] = [];
      const objRe = /\{([\s\S]*?)\n  \}/g;
      let m;
      while ((m = objRe.exec(hoursMatch[1])) !== null) {
        const obj: Record<string, unknown> = {};
        const fieldRe = /(\w+):\s*'([^']*)'/g;
        let fm;
        while ((fm = fieldRe.exec(m[1])) !== null) {
          obj[fm[1]] = fm[2];
        }
        // isHoliday boolean 파싱
        if (m[1].includes('isHoliday: true')) obj.isHoliday = true;
        if (obj.day) items.push(obj);
      }
      if (items.length > 0) state.values.hours.items = items;
    }
  } catch {
    // 기본값 유지
  }

  // Gallery images
  try {
    const galMatch = configContent.match(
      /galleryImages:\s*parseJSON<string\[\]>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/
    );
    if (galMatch) {
      const items: Record<string, string>[] = [];
      const urlRe = /'([^']+)'/g;
      let m;
      while ((m = urlRe.exec(galMatch[1])) !== null) {
        items.push({ url: m[1] });
      }
      if (items.length > 0) state.values.gallery.images = items;
    }
  } catch {
    // 기본값 유지
  }

  // SNS
  const instagramUrl = extractNullable('instagramUrl');
  if (instagramUrl !== null) state.values.sns.instagramUrl = instagramUrl;
  const naverBlogUrl = extractNullable('naverBlogUrl');
  if (naverBlogUrl !== null) state.values.sns.naverBlogUrl = naverBlogUrl;
  const kakaoChannelUrl = extractNullable('kakaoChannelUrl');
  if (kakaoChannelUrl !== null) state.values.sns.kakaoChannelUrl = kakaoChannelUrl;

  return state;
}

/**
 * 배포된 page.tsx에서 활성 모듈과 순서를 파싱.
 */
export function parsePageToEnabledModules(
  pageContent: string,
  templateSlug?: string
): { enabled: string[]; order: string[] } {
  const enabled: string[] = [];

  // personal-brand 매핑
  const personalBrandMap: Record<string, string> = {
    HeroSection: 'hero',
    AboutSection: 'about',
    ValuesSection: 'values',
    HighlightsSection: 'highlights',
    GallerySection: 'gallery',
    ContactSection: 'contact',
  };

  // dev-showcase 매핑
  const devShowcaseMap: Record<string, string> = {
    HeroSection: 'hero',
    AboutSection: 'about',
    ProjectsSection: 'projects',
    ExperienceTimeline: 'experience',
    BlogSection: 'blog',
    ContactSection: 'contact',
  };

  // link-in-bio-pro 매핑
  const linkInBioProMap: Record<string, string> = {
    ProfileSection: 'profile',
    LinkList: 'links',
    SocialBar: 'socials',
  };

  // digital-namecard 매핑
  const digitalNamecardMap: Record<string, string> = {
    ProfileCard: 'profile',
    ContactInfo: 'contact',
    SocialLinks: 'socials',
  };

  // freelancer-page 매핑
  const freelancerPageMap: Record<string, string> = {
    HeroSection: 'hero',
    ServicesSection: 'services',
    PortfolioSection: 'portfolio',
    TestimonialsSection: 'testimonials',
    ProcessSection: 'process',
    ContactSection: 'contact',
  };

  // small-biz 매핑
  const smallBizMap: Record<string, string> = {
    HeroSection: 'hero',
    MenuSection: 'menu',
    HoursSection: 'hours',
    LocationSection: 'location',
    GallerySection: 'gallery',
    SnsSection: 'sns',
  };

  const importToModule = templateSlug === 'small-biz'
    ? smallBizMap
    : templateSlug === 'dev-showcase'
      ? devShowcaseMap
      : templateSlug === 'link-in-bio-pro'
        ? linkInBioProMap
        : templateSlug === 'digital-namecard'
          ? digitalNamecardMap
          : templateSlug === 'freelancer-page'
            ? freelancerPageMap
            : personalBrandMap;

  // import 문에서 컴포넌트 이름 추출
  const importRe = /import\s*\{\s*(\w+)\s*\}/g;
  let m;
  while ((m = importRe.exec(pageContent)) !== null) {
    const modId = importToModule[m[1]];
    if (modId && !enabled.includes(modId)) {
      enabled.push(modId);
    }
  }

  // theme 모듈은 컴포넌트가 없으므로 항상 enabled (digital-namecard, link-in-bio-pro)
  if ((templateSlug === 'digital-namecard' || templateSlug === 'link-in-bio-pro') && !enabled.includes('theme')) {
    enabled.push('theme');
  }

  return { enabled, order: enabled };
}
