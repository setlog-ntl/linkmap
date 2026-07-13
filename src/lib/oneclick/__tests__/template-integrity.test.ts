import { describe, it, expect } from 'vitest';
import ts from 'typescript';
import { getGenerator } from '../generators';
import { buildInitialState } from '../generators/base-generator';
import { validateModuleState } from '../validate-module-state';
import { getModuleSchema } from '@/data/oneclick/module-schemas';
import { getTemplateBySlug } from '@/data/oneclick/homepage-template-content';

/** TypeScript transpileModule로 구문 오류만 검출 (타입 체크 없음). 구문 에러 진단 배열 반환. */
function syntaxErrors(code: string, fileName: string): string[] {
  const result = ts.transpileModule(code, {
    fileName,
    reportDiagnostics: true,
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
    },
  });
  return (result.diagnostics ?? [])
    .filter((d) => d.category === ts.DiagnosticCategory.Error)
    .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'));
}

/**
 * 템플릿 무결성 검증 — 제너레이터 ↔ 템플릿 파일 ↔ 스키마 일관성
 *
 * 빌드 실패의 근본 원인: 제너레이터의 MODULE_COMPONENTS가
 * 템플릿에 실제 존재하지 않는 컴포넌트를 참조하여
 * page.tsx에서 없는 파일을 import하는 코드가 생성됨.
 */

const TEMPLATE_SLUGS = [
  'personal-brand',
  'dev-showcase',
  'freelancer-page',
  'small-biz',
  'small-biz-cafe',
  'digital-namecard',
  'link-card',
  'invitation',
] as const;

// 템플릿 파일 번들이 있는 슬러그 (digital-namecard, link-card는 템플릿 없음)
const SLUGS_WITH_TEMPLATE_FILES = [
  'personal-brand',
  'dev-showcase',
  'freelancer-page',
  'small-biz',
  'small-biz-cafe',
  'invitation',
] as const;

describe('템플릿 무결성 검증', () => {
  for (const slug of TEMPLATE_SLUGS) {
    describe(`[${slug}]`, () => {
      const generator = getGenerator(slug);
      const schema = getModuleSchema(slug);

      it('스키마가 존재해야 함', () => {
        expect(schema).not.toBeNull();
      });

      it('스키마의 각 모듈 ID → generator.moduleComponents에 매핑 존재', () => {
        if (!schema) return;
        for (const mod of schema.modules) {
          // theme 등 컴포넌트가 없는 모듈은 제외
          if (mod.id === 'theme') continue;
          expect(
            generator.moduleComponents[mod.id],
            `모듈 "${mod.id}"에 대한 컴포넌트 매핑이 없음`
          ).toBeDefined();
        }
      });

      it('importToModuleMap ↔ moduleComponents 일관성', () => {
        // importToModuleMap의 모든 모듈 ID가 moduleComponents에 존재해야 함
        for (const [importName, modId] of Object.entries(generator.importToModuleMap)) {
          const ids = Array.isArray(modId) ? modId : [modId];
          for (const id of ids) {
            expect(
              generator.moduleComponents[id],
              `importToModuleMap["${importName}"] → "${id}"가 moduleComponents에 없음`
            ).toBeDefined();
          }
        }

        // moduleComponents의 모든 importName이 importToModuleMap에 역매핑 존재해야 함
        for (const [modId, comp] of Object.entries(generator.moduleComponents)) {
          const found = Object.entries(generator.importToModuleMap).some(([importName, ids]) => {
            const idList = Array.isArray(ids) ? ids : [ids];
            return importName === comp.importName && idList.includes(modId);
          });
          expect(found, `moduleComponents["${modId}"].importName="${comp.importName}"의 역매핑이 importToModuleMap에 없음`).toBe(true);
        }
      });
    });
  }

  for (const slug of SLUGS_WITH_TEMPLATE_FILES) {
    describe(`[${slug}] 템플릿 파일 검증`, () => {
      const generator = getGenerator(slug);
      const template = getTemplateBySlug(slug);

      it('템플릿 번들이 존재해야 함', () => {
        expect(template).toBeDefined();
      });

      it('moduleComponents의 각 컴포넌트 → template.files에 파일 존재', () => {
        if (!template) return;
        const filePaths = new Set(template.files.map((f) => f.path));

        for (const [modId, comp] of Object.entries(generator.moduleComponents)) {
          // importPath: '@/components/xxx' → 'src/components/xxx.tsx'
          const relativePath = comp.importPath.replace('@/', 'src/') + '.tsx';
          expect(
            filePaths.has(relativePath),
            `모듈 "${modId}"의 컴포넌트 "${comp.importName}" 파일 "${relativePath}"가 템플릿에 없음`
          ).toBe(true);
        }
      });
    });
  }

  describe('생성 코드 구문 검증', () => {
    // 제너레이터가 default 상태로 만든 config.ts/page.tsx가 구문상 유효한지 검증.
    // 제너레이터 버그(따옴표 누락, 깨진 보간 등)가 배포 빌드 실패로 이어지기 전에 차단.
    for (const slug of TEMPLATE_SLUGS) {
      it(`[${slug}] default 상태 생성 코드가 구문상 유효`, () => {
        const schema = getModuleSchema(slug);
        if (!schema) return;
        const generator = getGenerator(slug);
        const state = buildInitialState(schema);

        const configCode = generator.generateConfigTs(state);
        const configErrors = syntaxErrors(configCode, 'config.ts');
        expect(configErrors, `config.ts 구문 오류:\n${configErrors.join('\n')}`).toEqual([]);

        const pageCode = generator.generatePageTsx(state);
        const pageErrors = syntaxErrors(pageCode, 'page.tsx');
        expect(pageErrors, `page.tsx 구문 오류:\n${pageErrors.join('\n')}`).toEqual([]);
      });
    }
  });

  describe('default 상태 검증 안전성', () => {
    // 새 형식/범위 검증(min/max/url/email/maxItems)이 실제 배포되는 default 값을
    // 잘못 막지 않는지 보장. default에서 발생 가능한 건 '필수(빈 값)' 오류뿐이어야 함.
    for (const slug of TEMPLATE_SLUGS) {
      it(`[${slug}] default 상태에 형식/범위 오류 없음`, () => {
        const schema = getModuleSchema(slug);
        if (!schema) return;
        const state = buildInitialState(schema);
        const { errors } = validateModuleState(state, schema);
        const nonRequired = errors.filter((e) => !e.message.includes('필수'));
        expect(nonRequired, JSON.stringify(nonRequired, null, 2)).toEqual([]);
      });
    }
  });

  describe('SNS 링크 무결성 (small-biz-cafe · 카페 라이츠)', () => {
    // 실측 링크: docs/onelink/naver-cafe/04-cafe-wrights-dataset.md (2026-07-12 네이버 플레이스 재검증)
    const CAFE_SNS = {
      instagram: 'https://www.instagram.com/kafe.wrights',
      naverBlog: 'https://blog.naver.com/kafewrights_',
      youtube: 'https://www.youtube.com/@kafe.wrights',
    };

    it('default 상태 config.ts에 인스타그램·네이버 블로그·유튜브 실링크가 반영됨', () => {
      const schema = getModuleSchema('small-biz-cafe');
      expect(schema).not.toBeNull();
      if (!schema) return;
      const generator = getGenerator('small-biz-cafe');
      const config = generator.generateConfigTs(buildInitialState(schema));
      expect(config).toContain(CAFE_SNS.instagram);
      expect(config).toContain(CAFE_SNS.naverBlog);
      expect(config).toContain(CAFE_SNS.youtube);
    });

    it('sns-section.tsx가 유튜브 카드와 브랜드 로고 아이콘을 포함', () => {
      const template = getTemplateBySlug('small-biz-cafe');
      expect(template).toBeDefined();
      if (!template) return;
      const sns = template.files.find((f) => f.path === 'src/components/sns-section.tsx');
      expect(sns).toBeDefined();
      if (!sns) return;
      expect(sns.content).toContain('YouTubeIcon');
      expect(sns.content).toContain('config.youtubeUrl');
      expect(sns.content).toContain('네이버 블로그');
      // 블로그 링크 카드가 '네이버 플레이스'로 잘못 표기되던 회귀 방지
      expect(sns.content).not.toContain('네이버 플레이스');
    });
  });

  describe('프리셋 검증', () => {
    for (const slug of TEMPLATE_SLUGS) {
      it(`[${slug}] 프리셋의 enabled/order → 스키마 모듈 ID 부분집합`, async () => {
        const schema = getModuleSchema(slug);
        if (!schema) return;

        const moduleIds = new Set(schema.modules.map((m) => m.id));

        // 동적 import로 프리셋 로드
        let presets: Array<{ id: string; state: { enabled: string[]; order: string[] } }> = [];
        try {
          const mod = await import(`@/data/oneclick/module-presets/${slug}.ts`);
          const key = Object.keys(mod).find((k) => k.endsWith('Presets'));
          if (key) presets = mod[key];
        } catch {
          // 프리셋이 없는 템플릿은 스킵
          return;
        }

        for (const preset of presets) {
          for (const id of preset.state.enabled ?? []) {
            expect(
              moduleIds.has(id),
              `프리셋 "${preset.id}"의 enabled에 스키마에 없는 모듈 "${id}"가 포함됨`
            ).toBe(true);
          }
          for (const id of preset.state.order ?? []) {
            expect(
              moduleIds.has(id),
              `프리셋 "${preset.id}"의 order에 스키마에 없는 모듈 "${id}"가 포함됨`
            ).toBe(true);
          }
        }
      });
    }
  });
});
