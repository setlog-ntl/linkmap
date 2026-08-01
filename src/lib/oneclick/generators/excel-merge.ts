// ──────────────────────────────────────────────
// Excel Merge Generator (도구형 템플릿)
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';
import type { TemplateGenerator, ComponentMapping } from './base-generator';
import {
  esc,
  createExtractors,
  extractSiteBlock,
  buildInitialState,
} from './base-generator';

// ─── 프리셋 CSS 생성 ────────────────────────

export function generateExcelMergePresetCss(accent: string): string {
  return `/* ── Excel Merge Theme Override (auto-generated) ── */
:root {
  --em-accent: ${accent};
}
`;
}

// ─── 모듈 컴포넌트 매핑 ─────────────────────

const MODULE_COMPONENTS: Record<string, ComponentMapping> = {
  hero: {
    importName: 'HeroSection',
    importPath: '@/components/hero-section',
    render: `      <HeroSection
        badge={siteConfig.badge}
        title={siteConfig.title}
        subtitle={siteConfig.subtitle}
        accent={siteConfig.accent}
      />`,
  },
  tool: {
    importName: 'MergeTool',
    importPath: '@/components/merge-tool',
    render: `      <MergeTool
        headerRow={siteConfig.headerRow}
        autoHeader={siteConfig.autoHeader}
        fileNameColumn={siteConfig.fileNameColumn}
        allSheets={siteConfig.allSheets}
        mergeSimilar={siteConfig.mergeSimilar}
        coerceNumbers={siteConfig.coerceNumbers}
        downloadName={siteConfig.downloadName}
        accent={siteConfig.accent}
      />`,
  },
  guide: {
    importName: 'GuideSection',
    importPath: '@/components/guide-section',
    render: `      <GuideSection
        heading={siteConfig.guideHeading}
        stepOne={siteConfig.stepOne}
        stepTwo={siteConfig.stepTwo}
        stepThree={siteConfig.stepThree}
        accent={siteConfig.accent}
      />`,
  },
  footer: {
    importName: 'FooterSection',
    importPath: '@/components/footer-section',
    render: `      <FooterSection note={siteConfig.footerNote} />`,
  },
  // theme 모듈은 config + preset-override.css 에만 영향 — 컴포넌트 없음
};

// ─── Config 생성 ─────────────────────────────

function generateConfigTs(state: ModuleConfigState): string {
  const hero = state.values.hero || {};
  const tool = state.values.tool || {};
  const guide = state.values.guide || {};
  const footer = state.values.footer || {};
  const theme = state.values.theme || {};

  const badge = (hero.badge as string) ?? '업로드 없이 브라우저에서';
  const title = (hero.title as string) || '엑셀 취합기';
  const subtitle =
    (hero.subtitle as string) ??
    '매달 부서별로 받는 엑셀 파일, 하나로 합쳐서 바로 내려받으세요.';

  const fileNameColumn = (tool.fileNameColumn as string) ?? '출처파일';
  const downloadName = (tool.downloadName as string) || '취합결과';
  const headerRowRaw = Number(tool.headerRow);
  const headerRow =
    Number.isFinite(headerRowRaw) && headerRowRaw >= 1 ? Math.floor(headerRowRaw) : 1;
  const allSheets = tool.allSheets === true;
  const autoHeader = tool.autoHeader !== false;
  const mergeSimilar = tool.mergeSimilar !== false;
  const coerceNumbers = tool.coerceNumbers !== false;

  const guideHeading = (guide.heading as string) ?? '쓰는 방법';
  const stepOne = (guide.stepOne as string) ?? '받은 엑셀 파일을 전부 끌어다 놓습니다.';
  const stepTwo = (guide.stepTwo as string) ?? '행 수와 열이 맞는지 미리보기로 확인합니다.';
  const stepThree = (guide.stepThree as string) ?? '엑셀로 내려받아 그대로 보고에 씁니다.';

  const footerNote =
    (footer.note as string) ??
    '이 도구는 파일을 서버로 보내지 않습니다. 모든 처리는 이 브라우저 안에서 끝납니다.';

  const accent = (theme.accent as string) || '#0f766e';
  const bgStyle = (theme.bgStyle as string) || 'light';

  return `/** 배경 스타일: light | dark */
export type BgStyle = 'light' | 'dark';

export const siteConfig = {
  title: process.env.NEXT_PUBLIC_TITLE || '${esc(title)}',
  subtitle: process.env.NEXT_PUBLIC_SUBTITLE || '${esc(subtitle)}',
  badge: process.env.NEXT_PUBLIC_BADGE || '${esc(badge)}',
  guideHeading: process.env.NEXT_PUBLIC_GUIDE_HEADING || '${esc(guideHeading)}',
  stepOne: process.env.NEXT_PUBLIC_STEP_ONE || '${esc(stepOne)}',
  stepTwo: process.env.NEXT_PUBLIC_STEP_TWO || '${esc(stepTwo)}',
  stepThree: process.env.NEXT_PUBLIC_STEP_THREE || '${esc(stepThree)}',
  footerNote: process.env.NEXT_PUBLIC_FOOTER_NOTE || '${esc(footerNote)}',
  accent: process.env.NEXT_PUBLIC_ACCENT || '${esc(accent)}',
  bgStyle: (process.env.NEXT_PUBLIC_BG_STYLE || '${esc(bgStyle)}') as BgStyle,
  fileNameColumn: process.env.NEXT_PUBLIC_FILENAME_COLUMN || '${esc(fileNameColumn)}',
  downloadName: process.env.NEXT_PUBLIC_DOWNLOAD_NAME || '${esc(downloadName)}',
  headerRow: ${headerRow},
  autoHeader: ${autoHeader},
  allSheets: ${allSheets},
  mergeSimilar: ${mergeSimilar},
  coerceNumbers: ${coerceNumbers},
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
`;
}

// ─── Page 생성 ───────────────────────────────

function generatePageTsx(state: ModuleConfigState): string {
  const activeModules = state.order.filter((id) => state.enabled.includes(id));

  const imports: string[] = [
    "import { siteConfig } from '@/lib/config';",
    "import '@/app/preset-override.css';",
  ];
  const renders: string[] = [];

  for (const id of activeModules) {
    const comp = MODULE_COMPONENTS[id];
    if (!comp) continue; // theme 등 컴포넌트 없는 모듈 스킵
    imports.push(`import { ${comp.importName} } from '${comp.importPath}';`);
    renders.push(comp.render);
  }

  return `${imports.join('\n')}

export default function Home() {
  const isDark = siteConfig.bgStyle === 'dark';

  return (
    <main
      id="main"
      className={\`min-h-screen \${isDark ? 'dark bg-[#0b1220] text-slate-100' : 'bg-white text-slate-900'}\`}
    >
${renders.join('\n')}
    </main>
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
  const { extractString } = createExtractors(siteBlock);

  // 줄 앵커 필수: 사용자 문구에 "allSheets: true" 같은 토큰이 섞여도
  // 실제 설정 라인(2칸 들여쓰기 + 리터럴 + 쉼표)만 매칭되어야 한다.
  const extractNumber = (key: string): number | null => {
    const m = siteBlock.match(new RegExp(`^\\s{2}${key}: (-?\\d+),$`, 'm'));
    return m ? Number(m[1]) : null;
  };
  const extractBoolean = (key: string): boolean | null => {
    const m = siteBlock.match(new RegExp(`^\\s{2}${key}: (true|false),$`, 'm'));
    return m ? m[1] === 'true' : null;
  };

  const put = (mod: string, field: string, value: unknown) => {
    if (value !== null && value !== undefined) state.values[mod][field] = value;
  };

  // Hero
  put('hero', 'badge', extractString('badge'));
  put('hero', 'title', extractString('title'));
  put('hero', 'subtitle', extractString('subtitle'));

  // Tool
  put('tool', 'fileNameColumn', extractString('fileNameColumn'));
  put('tool', 'downloadName', extractString('downloadName'));
  put('tool', 'headerRow', extractNumber('headerRow'));
  put('tool', 'autoHeader', extractBoolean('autoHeader'));
  put('tool', 'allSheets', extractBoolean('allSheets'));
  put('tool', 'mergeSimilar', extractBoolean('mergeSimilar'));
  put('tool', 'coerceNumbers', extractBoolean('coerceNumbers'));

  // Guide
  put('guide', 'heading', extractString('guideHeading'));
  put('guide', 'stepOne', extractString('stepOne'));
  put('guide', 'stepTwo', extractString('stepTwo'));
  put('guide', 'stepThree', extractString('stepThree'));

  // Footer
  put('footer', 'note', extractString('footerNote'));

  // Theme
  put('theme', 'accent', extractString('accent'));
  put('theme', 'bgStyle', extractString('bgStyle'));

  return state;
}

// ─── Export ──────────────────────────────────

export const excelMergeGenerator: TemplateGenerator = {
  slug: 'excel-merge',
  generateConfigTs,
  generatePageTsx,
  parseConfigToState,
  moduleComponents: MODULE_COMPONENTS,
  importToModuleMap: {
    HeroSection: 'hero',
    MergeTool: 'tool',
    GuideSection: 'guide',
    FooterSection: 'footer',
  },
};
