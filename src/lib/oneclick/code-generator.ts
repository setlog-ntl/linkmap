// ──────────────────────────────────────────────
// Code Generator — 모듈 설정 → 코드 생성 라우터
// generators/ 에 분리된 템플릿별 로직을 조합하는 엔트리포인트
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';
import { getGenerator } from './generators';

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
  const font = (hero.fontFamily as string) || 'Pretendard';
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

  const files: GeneratedFile[] = [
    { path: 'src/lib/config.ts', content: generator.generateConfigTs(state) },
    { path: 'src/app/page.tsx', content: generator.generatePageTsx(state) },
  ];

  // Phase 2: 컴포넌트 파일 변경 (personal-brand + freelancer-page)
  if (currentFiles && !isDevShowcase && !isDigitalNamecard && !isLinkCard && !isSmallBiz) {
    const hero = state.values.hero || {};

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

  // Phase 2: small-biz 컴포넌트 파일 변경
  if (currentFiles && isSmallBiz) {
    const hero = state.values.hero || {};
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
  if ((templateSlug === 'digital-namecard' || templateSlug === 'link-card') && !enabled.includes('theme')) {
    enabled.push('theme');
  }

  return { enabled, order: enabled };
}
