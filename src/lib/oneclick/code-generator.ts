// ──────────────────────────────────────────────
// Code Generator — 모듈 설정 → 코드 생성 라우터
// generators/ 에 분리된 템플릿별 로직을 조합하는 엔트리포인트
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';
import { getGenerator } from './generators';
import { generatePresetCss } from './generators/personal-brand';
import { generateDevShowcasePresetCss } from './generators/dev-showcase';
import { generateNamecardPresetCss } from './generators/digital-namecard';
import { generateLinkCardPresetCss } from './generators/link-card';
import { generateFreelancerPresetCss } from './generators/freelancer-page';
import { generateExcelMergePresetCss } from './generators/excel-merge';
import { generateSmallBizPresetCss } from './generators/base-generator';

// ─── 공개 API: 개별 config 생성 (하위 호환) ──

export { buildInitialState } from './generators';

export function generateConfigTs(state: ModuleConfigState): string {
  return getGenerator('personal-brand').generateConfigTs(state);
}

export function generateDevShowcaseConfigTs(state: ModuleConfigState): string {
  return getGenerator('dev-showcase').generateConfigTs(state);
}

export function generateLinkCardConfigTs(state: ModuleConfigState): string {
  return getGenerator('link-card').generateConfigTs(state);
}

export function generateDigitalNamecardConfigTs(state: ModuleConfigState): string {
  return getGenerator('digital-namecard').generateConfigTs(state);
}

export function generateSmallBizConfigTs(state: ModuleConfigState): string {
  return getGenerator('small-biz').generateConfigTs(state);
}

export function generateFreelancerConfigTs(state: ModuleConfigState): string {
  return getGenerator('freelancer-page').generateConfigTs(state);
}

// ─── 공개 API: page.tsx 생성 ─────────────────

export function generatePageTsx(state: ModuleConfigState, templateSlug?: string): string {
  return getGenerator(templateSlug).generatePageTsx(state);
}

// ─── Phase 2: 컴포넌트 수준 코드 생성기 ──────

/** Hero 컴포넌트의 그래디언트 색상 치환 */
export function generateHeroSection(
  state: ModuleConfigState,
  baseCode: string
): string {
  const hero = state.values.hero || {};
  const from = (hero.gradientFrom as string) || '#ee5b2b';
  const to = (hero.gradientTo as string) || '#f59e0b';

  let code = baseCode;
  code = code.replace(/from-\[#[a-fA-F0-9]{6}\]/g, `from-[${from}]`);
  code = code.replace(/to-\[#[a-fA-F0-9]{6}\]/g, `to-[${to}]`);
  code = code.replace(
    /linear-gradient\(90deg,\s*#[a-fA-F0-9]{6},\s*#[a-fA-F0-9]{6}\)/g,
    `linear-gradient(90deg, ${from}, ${to})`
  );
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
  return baseCode.replace(/md:grid-cols-\d/g, `md:grid-cols-${cols}`);
}

/**
 * About 컴포넌트의 하드코딩된 인사말 제목을 config 구동 방식으로 치환합니다.
 * 사용자가 소개 제목을 입력한 경우에만 패치하며, 이미 패치된 코드는 매칭되지 않아 no-op입니다.
 * (기존 배포 사이트의 하드코딩 제목을 편집 가능하게 만들기 위함)
 */
export function generateAboutSection(
  state: ModuleConfigState,
  baseCode: string
): string {
  const about = state.values.about || {};
  const title = (about.title as string) || '';
  const titleEn = (about.titleEn as string) || '';
  if (!title && !titleEn) return baseCode;

  // 기존 하드코딩 표현식: {locale === 'en' ? `Hello, I'm ${name}.` : `안녕하세요, ${name}입니다.`}
  const hardcoded = /\{locale === 'en' \? `Hello, I'm \$\{name\}\.` : `안녕하세요, \$\{name\}입니다\.`\}/;
  // config 우선, 비어있으면 기존 기본 제목 폴백
  const replacement =
    "{(locale === 'en' ? config.storyTitleEn : config.storyTitle) || (locale === 'en' ? `Hello, I'm ${name}.` : `안녕하세요, ${name}입니다.`)}";
  // 함수형 replace로 replacement 내 `$` 특수 처리 회피
  return baseCode.replace(hardcoded, () => replacement);
}

/**
 * dev-showcase About 컴포넌트의 하드코딩된 i18n 제목을 config 구동 방식으로 치환합니다.
 * 사용자가 소개 제목을 입력한 경우에만 패치하며, 이미 패치됐으면 no-op입니다.
 */
export function generateDevShowcaseAboutSection(
  state: ModuleConfigState,
  baseCode: string
): string {
  const about = state.values.about || {};
  const title = (about.title as string) || '';
  const titleEn = (about.titleEn as string) || '';
  if (!title && !titleEn) return baseCode;

  // 기존 하드코딩: <div className="section-heading">{t('about.title')}</div>
  const hardcoded = /<div className="section-heading">\{t\('about\.title'\)\}<\/div>/;
  const replacement =
    `<div className="section-heading">{(locale === 'en' ? config.aboutTitleEn : config.aboutTitle) || t('about.title')}</div>`;
  return baseCode.replace(hardcoded, () => replacement);
}

/**
 * small-biz-cafe About 컴포넌트의 하드코딩된 h2 제목을 config 구동 방식으로 치환합니다.
 * 사용자가 소개 제목을 입력한 경우에만 패치하며, 이미 패치됐으면 no-op입니다.
 */
export function generateCafeAboutSection(
  state: ModuleConfigState,
  baseCode: string
): string {
  const about = state.values.about || {};
  const title = (about.title as string) || '';
  if (!title) return baseCode;

  // 기존 하드코딩: <h2 className="section-title reveal">커피 한 잔에 담긴 철학</h2>
  const hardcoded = /<h2 className="section-title reveal">커피 한 잔에 담긴 철학<\/h2>/;
  const replacement =
    `<h2 className="section-title reveal">{config.aboutTitle || '커피 한 잔에 담긴 철학'}</h2>`;
  return baseCode.replace(hardcoded, () => replacement);
}

/** Gallery 컴포넌트의 컬럼 수 치환 */
export function generateGallerySection(
  state: ModuleConfigState,
  baseCode: string
): string {
  const gallery = state.values.gallery || {};
  const cols = (gallery.columns as string) || '3';
  return baseCode.replace(/lg:grid-cols-\d/g, `lg:grid-cols-${cols}`);
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
  const font = (hero.fontFamily as string) || (state.values.theme?.fontFamily as string) || 'Pretendard';
  if (font === 'Pretendard') return baseCode;

  let code = baseCode;
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
  const linkTag = `<link rel="stylesheet" href="${googleFontUrl}" />`;

  const existingFontLink = /(<link[^>]*fonts\.googleapis\.com[^>]*\/>)/;
  if (existingFontLink.test(code)) {
    code = code.replace(existingFontLink, linkTag);
  } else if (code.includes('</head>')) {
    code = code.replace('</head>', `    ${linkTag}\n  </head>`);
  }

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

// ─── 종합: 변경된 파일 목록 생성 ─────────────

export interface GeneratedFile {
  path: string;
  content: string;
}

/**
 * 모듈 설정에서 변경된 파일 목록을 생성합니다.
 * @param state 현재 모듈 설정 상태
 * @param currentFiles 기존 파일 내용 캐시 (Phase 2 컴포넌트 수준 편집용)
 * @param templateSlug 템플릿 슬러그
 */
export function generateFiles(
  state: ModuleConfigState,
  currentFiles?: Record<string, string>,
  templateSlug?: string
): GeneratedFile[] {
  const generator = getGenerator(templateSlug);
  const isDevShowcase = templateSlug === 'dev-showcase';
  const isDigitalNamecard = templateSlug === 'digital-namecard';
  const isFreelancer = templateSlug === 'freelancer-page';
  const isLinkCard = templateSlug === 'link-card';
  const isSmallBiz = templateSlug === 'small-biz' || templateSlug === 'small-biz-cafe';
  const isExcelMerge = templateSlug === 'excel-merge';

  const files: GeneratedFile[] = [
    { path: 'src/lib/config.ts', content: generator.generateConfigTs(state) },
    { path: 'src/app/page.tsx', content: generator.generatePageTsx(state) },
  ];

  // 모든 템플릿: 항상 프리셋 CSS override 파일 생성
  // (미리보기는 동적으로 CSS를 생성하지만, 배포 코드에는 프리셋 CSS가 없거나 불완전할 수 있음)
  const isPersonalBrand =
    !isDevShowcase && !isDigitalNamecard && !isLinkCard && !isSmallBiz && !isFreelancer && !isExcelMerge;
  const hero = state.values.hero || {};

  if (isPersonalBrand) {
    const designPreset = (hero.designPreset as string) || 'creator';
    const gradientFrom = (hero.gradientFrom as string) || '#ee5b2b';
    const gradientTo = (hero.gradientTo as string) || '#f59e0b';
    files.push({
      path: 'src/app/preset-override.css',
      content: generatePresetCss(designPreset, gradientFrom, gradientTo),
    });
  } else if (isDevShowcase) {
    const designPreset = (hero.designPreset as string) || 'github-dark';
    files.push({
      path: 'src/app/preset-override.css',
      content: generateDevShowcasePresetCss(designPreset),
    });
  } else if (isDigitalNamecard) {
    const theme = state.values.theme || {};
    const designPreset = (theme.designPreset as string) || 'pro';
    const accentColor = (theme.accentColor as string) || '#3b82f6';
    files.push({
      path: 'src/app/preset-override.css',
      content: generateNamecardPresetCss(designPreset, accentColor),
    });
  } else if (isLinkCard) {
    const theme = state.values.theme || {};
    const primaryColor = (theme.primaryColor as string) || '#6366f1';
    const bgStyle = (theme.bgStyle as string) || 'light';
    files.push({
      path: 'src/app/preset-override.css',
      content: generateLinkCardPresetCss(primaryColor, bgStyle),
    });
  } else if (isSmallBiz) {
    const designPreset = (hero.designPreset as string) || 'default';
    const primaryColor = (hero.primaryColor as string) || '#c8a97e';
    files.push({
      path: 'src/app/preset-override.css',
      content: generateSmallBizPresetCss(designPreset, primaryColor),
    });
  } else if (isExcelMerge) {
    const theme = state.values.theme || {};
    const accent = (theme.accent as string) || '#0f766e';
    files.push({
      path: 'src/app/preset-override.css',
      content: generateExcelMergePresetCss(accent),
    });
  } else if (isFreelancer) {
    const designPreset = (hero.designPreset as string) || 'default';
    const gradientFrom = (hero.gradientFrom as string) || '#5b13ec';
    const gradientTo = (hero.gradientTo as string) || '#06b6d4';
    files.push({
      path: 'src/app/preset-override.css',
      content: generateFreelancerPresetCss(designPreset, gradientFrom, gradientTo),
    });
  }

  // Phase 2: 컴포넌트 파일 변경 (personal-brand + freelancer-page)
  if (currentFiles && !isDevShowcase && !isDigitalNamecard && !isLinkCard && !isSmallBiz && !isExcelMerge) {
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
      const cssBase = currentFiles['src/app/globals.css'];
      if (cssBase) {
        files.push({
          path: 'src/app/globals.css',
          content: generateGlobalsCss(state, cssBase),
        });
      }
    }

    if (!isFreelancer) {
      // About: 소개 제목을 입력한 경우 하드코딩 제목을 config 구동으로 패치
      const about = state.values.about || {};
      if (about.title || about.titleEn) {
        const aboutBase = currentFiles['src/components/about-section.tsx'];
        if (aboutBase) {
          const patched = generateAboutSection(state, aboutBase);
          if (patched !== aboutBase) {
            files.push({
              path: 'src/components/about-section.tsx',
              content: patched,
            });
          }
        }
      }

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

    if (isFreelancer) {
      const portfolio = state.values.portfolio || {};
      if (portfolio.columns && portfolio.columns !== '3') {
        const portfolioBase = currentFiles['src/components/portfolio-section.tsx'];
        if (portfolioBase) {
          let code = portfolioBase;
          code = code.replace(/lg:grid-cols-\d/g, `lg:grid-cols-${portfolio.columns}`);
          files.push({ path: 'src/components/portfolio-section.tsx', content: code });
        }
      }
    }

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

  // Phase 2: dev-showcase 컴포넌트 About 제목 패치 (기존 배포 사이트 하위호환)
  if (currentFiles && isDevShowcase) {
    const about = state.values.about || {};
    if (about.title || about.titleEn) {
      const aboutBase = currentFiles['src/components/about-section.tsx'];
      if (aboutBase) {
        const patched = generateDevShowcaseAboutSection(state, aboutBase);
        if (patched !== aboutBase) {
          files.push({
            path: 'src/components/about-section.tsx',
            content: patched,
          });
        }
      }
    }
  }

  // Phase 2: digital-namecard fontFamily 처리
  if (currentFiles && isDigitalNamecard) {
    const theme = state.values.theme || {};
    const fontFamily = (theme.fontFamily as string) || 'Pretendard Variable';
    if (fontFamily !== 'Pretendard Variable' && fontFamily !== 'Pretendard') {
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
    const primaryColor = (hero.primaryColor as string) || '#d47311';

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

    // cafe: 소개 제목을 입력한 경우 하드코딩 h2를 config 구동으로 패치 (기존 배포 사이트 하위호환)
    if (templateSlug === 'small-biz-cafe') {
      const about = state.values.about || {};
      if (about.title) {
        const aboutBase = currentFiles['src/components/about-section.tsx'];
        if (aboutBase) {
          const patched = generateCafeAboutSection(state, aboutBase);
          if (patched !== aboutBase) {
            files.push({
              path: 'src/components/about-section.tsx',
              content: patched,
            });
          }
        }
      }
    }
  }

  return files;
}

// ─── Config 파싱 라우터 ──────────────────────

export function parseConfigToState(
  configContent: string,
  schema: TemplateModuleSchema
): ModuleConfigState {
  return getGenerator(schema.templateSlug).parseConfigToState(configContent, schema);
}

// ─── Page 파싱: 활성 모듈 추출 ───────────────

export function parsePageToEnabledModules(
  pageContent: string,
  templateSlug?: string
): { enabled: string[]; order: string[] } {
  const generator = getGenerator(templateSlug);
  const enabled: string[] = [];

  const importRe = /import\s*\{\s*(\w+)\s*\}/g;
  let m;
  while ((m = importRe.exec(pageContent)) !== null) {
    const modId = generator.importToModuleMap[m[1]];
    if (!modId) continue;
    // 다대일 매핑 지원: InfoSection → ['hours', 'location']
    const ids = Array.isArray(modId) ? modId : [modId];
    for (const id of ids) {
      if (!enabled.includes(id)) enabled.push(id);
    }
  }

  // theme 모듈은 컴포넌트가 없으므로 항상 enabled
  if (
    (templateSlug === 'digital-namecard' ||
      templateSlug === 'link-card' ||
      templateSlug === 'excel-merge') &&
    !enabled.includes('theme')
  ) {
    enabled.push('theme');
  }

  return { enabled, order: enabled };
}
