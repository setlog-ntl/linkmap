// ──────────────────────────────────────────────
// Dev Showcase Generator
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';
import type { TemplateGenerator, ComponentMapping } from './base-generator';
import {
  esc,
  percentToLevel,
  levelToPercent,
  createExtractors,
  extractSiteBlock,
  parseArrayConstant,
  buildInitialState,
} from './base-generator';

// ─── 프리셋 CSS 생성 ────────────────────────

interface DevPresetThemeVars {
  bg?: string;
  bgAlt?: string;
  textPrimary?: string;
  textSecondary?: string;
  surfaceElevated?: string;
  surfaceBorder?: string;
  brandPrimary: string;
  brandSecondary: string;
}

const DEV_PRESET_THEME: Record<string, DevPresetThemeVars> = {
  'github-dark': {
    brandPrimary: '#58a6ff', brandSecondary: '#79c0ff',
    bg: '#0d1117', bgAlt: '#161b22',
    textPrimary: '#c9d1d9', textSecondary: '#8b949e',
    surfaceElevated: '#161b22', surfaceBorder: '#30363d',
  },
  vscode: {
    brandPrimary: '#007acc', brandSecondary: '#3794ff',
    bg: '#1e1e1e', bgAlt: '#252526',
    textPrimary: '#d4d4d4', textSecondary: '#808080',
    surfaceElevated: '#252526', surfaceBorder: '#3c3c3c',
  },
  dracula: {
    brandPrimary: '#bd93f9', brandSecondary: '#ff79c6',
    bg: '#282a36', bgAlt: '#2d2f3d',
    textPrimary: '#f8f8f2', textSecondary: '#6272a4',
    surfaceElevated: '#44475a', surfaceBorder: '#6272a4',
  },
  terminal: {
    brandPrimary: '#10b981', brandSecondary: '#34d399',
    bg: '#0a0a0a', bgAlt: '#111111',
    textPrimary: '#e2e8f0', textSecondary: '#94a3b8',
    surfaceElevated: '#1a1a1a', surfaceBorder: '#1e293b',
  },
  'warm-earth': {
    brandPrimary: '#92400e', brandSecondary: '#b45309',
    bg: '#fefce8', bgAlt: '#fef3c7',
    surfaceBorder: '#fde68a',
  },
  midnight: {
    brandPrimary: '#818cf8', brandSecondary: '#c084fc',
    bg: '#0f0f0f', bgAlt: '#171717',
    textPrimary: '#f0f0f0', textSecondary: '#a0a0a0',
    surfaceElevated: '#1a1a1a', surfaceBorder: '#2a2a2a',
  },
};

function hexToRgbStr(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function generateDevShowcasePresetCss(designPreset: string): string {
  const theme = DEV_PRESET_THEME[designPreset] || DEV_PRESET_THEME['github-dark'];
  const isDark = !['warm-earth'].includes(designPreset);

  let css = `/* ── Preset Override (auto-generated) ── */
html[data-preset] {
  --brand-primary: ${theme.brandPrimary};
  --brand-secondary: ${theme.brandSecondary};
  --brand-glow: rgba(${hexToRgbStr(theme.brandPrimary)}, 0.15);
  --brand-gradient: linear-gradient(135deg, ${theme.brandPrimary}, ${theme.brandSecondary});
  --color-primary: ${theme.brandPrimary};
  --color-secondary: ${theme.brandSecondary};`;

  if (theme.bg) css += `\n  --bg: ${theme.bg};`;
  if (theme.bgAlt) css += `\n  --bg-alt: ${theme.bgAlt};`;
  if (theme.textPrimary) css += `\n  --text-primary: ${theme.textPrimary};`;
  if (theme.textSecondary) css += `\n  --text-secondary: ${theme.textSecondary};`;
  if (theme.surfaceElevated) css += `\n  --surface-elevated: ${theme.surfaceElevated};`;
  if (theme.surfaceBorder) css += `\n  --surface-border: ${theme.surfaceBorder};`;

  if (isDark) {
    css += `\n  --shadow-card: 0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2);`;
    css += `\n  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3);`;
    css += `\n  --shadow-lg: 0 12px 40px rgba(0,0,0,.5);`;
  }

  css += `\n}\n`;
  return css;
}

// ─── 배열 빌더 ──────────────────────────────

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

// ─── 모듈 컴포넌트 매핑 ─────────────────────

const MODULE_COMPONENTS: Record<string, ComponentMapping> = {
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

// ─── Config 생성 ─────────────────────────────

function generateConfigTs(state: ModuleConfigState): string {
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
  const aboutTitle = (about.title as string) || '';
  const aboutTitleEn = (about.titleEn as string) || '';
  const githubUsername = (projects.githubUsername as string) || '';
  const typingWords = (hero.typingWords as string) || '';
  const maxReposRaw = (projects.maxRepos as string | number | undefined);
  const maxRepos = maxReposRaw !== undefined && maxReposRaw !== '' ? parseInt(String(maxReposRaw), 10) : 6;
  const email = (contact.email as string) || '';
  const githubUrl = (contact.github as string) || '';
  const linkedinUrl = (contact.linkedin as string) || '';
  const designPreset = (hero.designPreset as string) || 'github-dark';

  const skillItems = (about.skills as unknown[]) || [];
  const experienceItems = (experience.items as unknown[]) || [];
  const blogItems = (blog.items as unknown[]) || [];

  return `export interface SkillItem {
  name: string;
  icon?: string;
  /** numeric 0-100 OR legacy string level */
  level: number | 'beginner' | 'intermediate' | 'advanced';
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
  aboutTitle: process.env.NEXT_PUBLIC_ABOUT_TITLE || '${esc(aboutTitle)}',
  aboutTitleEn: process.env.NEXT_PUBLIC_ABOUT_TITLE_EN || '${esc(aboutTitleEn)}',
  skills: parseJSON<SkillItem[]>(process.env.NEXT_PUBLIC_SKILLS, DEMO_SKILLS),
  experience: parseJSON<ExperienceItem[]>(process.env.NEXT_PUBLIC_EXPERIENCE, DEMO_EXPERIENCE),
  projects: DEMO_PROJECTS,
  blogPosts: parseJSON<BlogPost[] | null>(process.env.NEXT_PUBLIC_BLOG_POSTS, ${buildBlogPostsArray(blogItems)}),
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL || null,
  email: process.env.NEXT_PUBLIC_EMAIL || ${email ? `'${esc(email)}'` : 'null'},
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || ${githubUrl ? `'${esc(githubUrl)}'` : 'null'},
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || ${linkedinUrl ? `'${esc(linkedinUrl)}'` : 'null'},
  typingWords: ${typingWords.trim() ? `'${esc(typingWords)}'` : 'null'},
  maxRepos: ${maxRepos},
  designPreset: '${esc(designPreset)}',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;
}

// ─── Page 생성 ───────────────────────────────

function generatePageTsx(state: ModuleConfigState): string {
  const hero = state.values.hero || {};
  const designPreset = (hero.designPreset as string) || 'github-dark';

  const activeModules = state.order.filter((id) => state.enabled.includes(id));
  const imports: string[] = [
    "import { siteConfig } from '@/lib/config';",
    "import '@/app/preset-override.css';",
    "import { NavHeader } from '@/components/nav-header';",
  ];
  const renders: string[] = [];
  let needsGithubGraph = false;

  for (const id of activeModules) {
    const comp = MODULE_COMPONENTS[id];
    if (!comp) continue;
    imports.push(`import { ${comp.importName} } from '${comp.importPath}';`);
    if (id === 'about') needsGithubGraph = true;
    renders.push(comp.render);
  }

  if (needsGithubGraph) {
    imports.push("import { GithubGraph } from '@/components/github-graph';");
  }
  imports.push("import { Footer } from '@/components/footer';");

  const presetSync = `
function PresetSync() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: "document.documentElement.setAttribute('data-preset','" + (siteConfig.designPreset || '${esc(designPreset)}') + "')"
      }}
    />
  );
}`;

  return `${imports.join('\n')}
${presetSync}

export default function Home() {
  return (
    <>
      <PresetSync />
      <NavHeader />
      <main id="main">
${renders.join('\n')}
      </main>
      <Footer />
    </>
  );
}
`;
}

// ─── Config 파싱 ─────────────────────────────

function parseConfigToState(
  configContent: string,
  schema: TemplateModuleSchema
): ModuleConfigState {
  const state = buildInitialState(schema);
  const siteBlock = extractSiteBlock(configContent);
  const { extractString, extractNullable } = createExtractors(siteBlock);

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
  const designPreset = extractString('designPreset');
  if (designPreset !== null) state.values.hero.designPreset = designPreset;

  // About
  const about = extractString('about');
  if (about !== null) state.values.about.story = about;
  const aboutEn = extractString('aboutEn');
  if (aboutEn !== null) state.values.about.storyEn = aboutEn;
  const aboutTitle = extractString('aboutTitle');
  if (aboutTitle !== null) state.values.about.title = aboutTitle;
  const aboutTitleEn = extractString('aboutTitleEn');
  if (aboutTitleEn !== null) state.values.about.titleEn = aboutTitleEn;

  // Skills
  try {
    const items = parseArrayConstant(
      configContent,
      /const DEMO_SKILLS:.*?=\s*(\[[\s\S]*?\n\]);/,
      'name',
      (_match, obj) => {
        if (obj.level) obj.level = levelToPercent(obj.level);
      }
    );
    if (items.length > 0) state.values.about.skills = items;
  } catch { /* 기본값 유지 */ }

  // Projects
  const githubUsername = extractNullable('githubUsername');
  if (githubUsername !== null) state.values.projects.githubUsername = githubUsername;
  const maxReposMatch = configContent.match(/maxRepos:\s*(\d+)/);
  if (maxReposMatch) state.values.projects.maxRepos = maxReposMatch[1];

  // Experience
  try {
    const items = parseArrayConstant(configContent, /const DEMO_EXPERIENCE:.*?=\s*(\[[\s\S]*?\n\]);/, 'title');
    if (items.length > 0) state.values.experience.items = items;
  } catch { /* 기본값 유지 */ }

  // Blog
  try {
    const items = parseArrayConstant(
      configContent,
      /blogPosts:\s*parseJSON<BlogPost\[\][^>]*>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/,
      'title'
    );
    if (items.length > 0) state.values.blog.items = items;
  } catch { /* 기본값 유지 */ }

  // Contact
  const email = extractNullable('email');
  if (email !== null) state.values.contact.email = email;
  const githubUrl = extractNullable('githubUrl');
  if (githubUrl !== null) {
    state.values.contact.github = githubUrl;
  } else if (githubUsername) {
    state.values.contact.github = `https://github.com/${githubUsername}`;
  }
  const linkedinUrl = extractNullable('linkedinUrl');
  if (linkedinUrl !== null) state.values.contact.linkedin = linkedinUrl;

  return state;
}

// ─── Export ──────────────────────────────────

export const devShowcaseGenerator: TemplateGenerator = {
  slug: 'dev-showcase',
  generateConfigTs,
  generatePageTsx,
  parseConfigToState,
  moduleComponents: MODULE_COMPONENTS,
  importToModuleMap: {
    HeroSection: 'hero',
    AboutSection: 'about',
    ProjectsSection: 'projects',
    ExperienceTimeline: 'experience',
    BlogSection: 'blog',
    ContactSection: 'contact',
  },
};
