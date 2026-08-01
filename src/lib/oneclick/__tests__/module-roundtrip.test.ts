import { describe, it, expect } from 'vitest';
import { getGenerator } from '../generators';
import { buildInitialState } from '../generators/base-generator';
import {
  generateFiles,
  parseConfigToState,
  parsePageToEnabledModules,
} from '../code-generator';
import { esc, unescapeString } from '../generators/base-generator';
import { getModuleSchema } from '@/data/oneclick/module-schemas';
import { getTemplateBySlug } from '@/data/oneclick/homepage-template-content';
import type {
  ModuleConfigState,
  TemplateModuleSchema,
  ModuleFieldDef,
} from '@/lib/module-schema';

/**
 * 모듈 편집 → 적용 → 재편집 라운드트립 검증
 *
 * 배경(에디터 실제 흐름, site-editor-client.tsx):
 *   1. 사용자가 모듈 패널에서 값 편집 → moduleState 변경
 *   2. "적용" → generateFiles(state) → config.ts / page.tsx / preset-override.css 커밋
 *   3. 에디터 재진입 → parseConfigToState(config.ts) + parsePageToEnabledModules(page.tsx)
 *      → moduleState 복원
 *
 * 따라서 "편집한 값이 배포 코드에서 다시 state로 복원되는가"가 핵심 정합성이다.
 * config.ts/CSS에 emit되지만 parse에서 복원 안 되는 필드가 있으면
 * → 적용 후 재진입 시 그 값이 기본값으로 되돌아가 "수정이 반영 안 됨"으로 나타난다.
 *
 * 검증 방법: 편집된 state로 파일 생성(A) → config/page 파싱으로 state 복원 → 재생성(B).
 * A와 B가 동일하면 손실 없는 라운드트립. 다르면 손실 지점이 diff로 드러난다.
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
  'excel-merge',
] as const;

const EDIT_MARKER = ' ✎E9137';

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

/** 활성 모듈의 스칼라 필드에 구별 가능한 편집값을 주입 (배열/불리언/숫자 제외) */
function mutateScalarFields(
  schema: TemplateModuleSchema,
  state: ModuleConfigState
): ModuleConfigState {
  const next = clone(state);
  for (const mod of schema.modules) {
    if (!state.enabled.includes(mod.id)) continue;
    const vals = (next.values[mod.id] ??= {});
    for (const field of mod.fields) {
      mutateField(field, vals);
    }
  }
  return next;
}

function mutateField(field: ModuleFieldDef, vals: Record<string, unknown>) {
  const cur = vals[field.key];
  const isEmail = field.validation?.inputType === 'email';
  switch (field.type) {
    case 'text':
    case 'textarea': {
      if (isEmail) {
        vals[field.key] = 'edited9137@example.com';
      } else {
        const base = typeof cur === 'string' && cur ? cur : 'x';
        vals[field.key] = base + EDIT_MARKER;
      }
      break;
    }
    case 'url':
    case 'image': {
      vals[field.key] = 'https://edited-9137.example.com/path';
      break;
    }
    case 'color': {
      vals[field.key] = '#1a2b3c';
      break;
    }
    case 'select': {
      const opts = field.options ?? [];
      const alt = opts.find((o) => o.value !== cur);
      if (alt) vals[field.key] = alt.value;
      break;
    }
    // array / number / boolean 은 기본값 라운드트립 테스트에서 커버
  }
}

/** 생성 파일 배열 → path:content 맵 */
function filesToMap(files: { path: string; content: string }[]): Record<string, string> {
  const m: Record<string, string> = {};
  for (const f of files) m[f.path] = f.content;
  return m;
}

describe('모듈 라운드트립 정합성 (편집 → 적용 → 재편집)', () => {
  // ── 1. esc/unescape 대칭성 ──
  describe('문자열 이스케이프 대칭성', () => {
    const tricky = [
      "아포스트로피'포함",
      'backslash\\here',
      'template ${literal}',
      'quote"double',
      '이모지✎와 한글',
      "복합: it's a \\ ${x} \"test\"",
      // 다행 텍스트 — esc가 \n/\r로 이스케이프하므로 역변환도 제어문자로 복원되어야 함
      'first line\nsecond line\nthird',
      'CRLF\r\n다음줄',
      "타이핑 문구\n한 줄에 하나\n've got it",
    ];
    for (const s of tricky) {
      it(`esc→unescape 왕복: ${JSON.stringify(s)}`, () => {
        // 제너레이터는 esc()로 문자열을 emit하고, 파서는 unescapeString()으로 복원한다.
        expect(unescapeString(esc(s))).toBe(s);
      });
    }
  });

  // ── 2. 생성 결정성 (같은 state → 같은 출력) ──
  // applyModuleChanges의 "변경된 파일만 커밋" diff 필터가 안정적으로 동작하려면
  // 동일 state가 항상 동일 바이트를 내야 한다 (불필요한 커밋/무한 diff 방지).
  describe('generateFiles 결정성', () => {
    for (const slug of TEMPLATE_SLUGS) {
      it(`[${slug}] 동일 state → 동일 출력`, () => {
        const schema = getModuleSchema(slug);
        if (!schema) return;
        const state = buildInitialState(schema);
        const a = filesToMap(generateFiles(state, undefined, slug));
        const b = filesToMap(generateFiles(state, undefined, slug));
        expect(a).toEqual(b);
      });
    }
  });

  // ── 3. 기본 상태 전체 파일 라운드트립 ──
  describe('기본 상태 라운드트립 (config + preset-override.css)', () => {
    for (const slug of TEMPLATE_SLUGS) {
      it(`[${slug}] gen → parse → gen 이 config·CSS를 보존`, () => {
        const schema = getModuleSchema(slug);
        if (!schema) return;
        const state = buildInitialState(schema);
        assertConfigAndCssRoundtrip(slug, schema, state);
      });
    }
  });

  // ── 4. 편집 상태 라운드트립 (핵심) ──
  // 스칼라 필드를 실제로 편집했을 때, 그 편집이 config/CSS를 거쳐 다시 복원되는지.
  // 여기서 실패하면 "값을 바꾸고 적용했는데 재진입하면 되돌아간다" 버그가 있다는 뜻.
  describe('편집 상태 라운드트립 (스칼라 필드 수정 후)', () => {
    for (const slug of TEMPLATE_SLUGS) {
      it(`[${slug}] 편집값이 config·CSS 라운드트립에서 보존`, () => {
        const schema = getModuleSchema(slug);
        if (!schema) return;
        const edited = mutateScalarFields(schema, buildInitialState(schema));
        assertConfigAndCssRoundtrip(slug, schema, edited);
      });
    }
  });

  // ── 4.5 실제 배포 번들 config.ts 라운드트립 안정성 ──
  // 신규 배포 사이트의 최초 편집 시 파서가 읽는 것은 정적 번들 config.ts다.
  // 번들 config → parse → gen(A) → parse → gen(B) 가 A==B(고정점)여야
  // "배포 → 편집 → 재진입"이 안정적. 번들에만 있는 필드 포맷 불일치를 잡는다.
  const SLUGS_WITH_BUNDLE = [
    'personal-brand',
    'dev-showcase',
    'freelancer-page',
    'small-biz',
    'small-biz-cafe',
    'invitation',
    'excel-merge',
  ] as const;
  describe('배포 번들 config.ts 라운드트립 안정성', () => {
    for (const slug of SLUGS_WITH_BUNDLE) {
      it(`[${slug}] 정적 번들 config → parse → gen 고정점 도달`, () => {
        const schema = getModuleSchema(slug);
        const template = getTemplateBySlug(slug);
        if (!schema || !template) return;
        const bundleConfig = template.files.find(
          (f) => f.path === 'src/lib/config.ts'
        )?.content;
        if (!bundleConfig) return;

        // 번들 → state → 생성(A)
        const state1 = parseConfigToState(bundleConfig, schema);
        const genA = filesToMap(generateFiles(state1, undefined, slug))['src/lib/config.ts'];
        // 생성(A) → state → 생성(B) : 파서가 자기 출력에서 안정적이어야 함
        const state2 = parseConfigToState(genA, schema);
        const genB = filesToMap(generateFiles(state2, undefined, slug))['src/lib/config.ts'];

        expect(
          genB,
          `[${slug}] 번들 config 라운드트립이 고정점에 도달하지 못함 — 배포된 값이 재진입 시 유실될 수 있음`
        ).toBe(genA);
      });
    }
  });

  // ── 4.6 자유 텍스트 속 설정 토큰 오염 방지 ──
  // extractBoolean/extractNumber가 줄 앵커 없이 첫 매칭을 취하면, 사용자 문구 속
  // "allSheets: true" 같은 토큰이 실제 설정 라인보다 먼저 매칭되어 도구 설정이 변조된다.
  describe('텍스트 필드 내 설정 토큰 오염 방지', () => {
    it('[excel-merge] subtitle에 "allSheets: true"·"headerRow: 7"이 있어도 설정 보존', () => {
      const slug = 'excel-merge';
      const schema = getModuleSchema(slug);
      if (!schema) return;
      const generator = getGenerator(slug);
      const state = buildInitialState(schema);
      const attack = '팁: allSheets: true, headerRow: 7 처럼 적힌 문서도 그대로 합쳐집니다.';
      state.values.hero.subtitle = attack;
      const config = generator.generateConfigTs(state);
      const parsed = parseConfigToState(config, schema);
      expect(parsed.values.hero.subtitle).toBe(attack);
      expect(parsed.values.tool.allSheets, 'subtitle 문구가 allSheets 설정을 오염').toBe(false);
      expect(parsed.values.tool.headerRow, 'subtitle 문구가 headerRow 설정을 오염').toBe(1);
    });
  });

  // ── 5. page.tsx 활성 모듈 라운드트립 ──
  // 모듈 on/off, 순서 변경이 page.tsx를 거쳐 복원되는지.
  describe('활성 모듈(enabled) 라운드트립', () => {
    for (const slug of TEMPLATE_SLUGS) {
      it(`[${slug}] 기본 활성 모듈이 page.tsx 파싱으로 복원됨`, () => {
        const schema = getModuleSchema(slug);
        if (!schema) return;
        const generator = getGenerator(slug);
        const state = buildInitialState(schema);
        const page = generator.generatePageTsx(state);
        const { enabled } = parsePageToEnabledModules(page, slug);

        // 컴포넌트를 가진(=page에 렌더되는) 기본 활성 모듈은 전부 복원되어야 함.
        // theme 모듈은 컴포넌트가 없어 page에 안 나오지만 파서가 강제 추가(namecard/link-card).
        const componentBackedEnabled = state.enabled.filter(
          (id) => generator.moduleComponents[id]
        );
        for (const id of componentBackedEnabled) {
          expect(
            enabled.includes(id),
            `모듈 "${id}"가 page.tsx 라운드트립에서 복원되지 않음`
          ).toBe(true);
        }
        // 파서가 스키마에 없는 모듈을 만들어내지 않아야 함
        const moduleIds = new Set(schema.modules.map((m) => m.id));
        for (const id of enabled) {
          expect(moduleIds.has(id), `파서가 미지의 모듈 "${id}" 생성`).toBe(true);
        }
      });
    }
  });
});

/**
 * state로 파일 생성(A) → config.ts 파싱으로 values 복원 → 동일 enabled/order로 재생성(B).
 * config.ts와 preset-override.css가 A==B 여야 손실 없는 라운드트립.
 * (page.tsx는 다대일 매핑·순서 정규화 노이즈가 있어 별도 테스트에서 검증)
 */
function assertConfigAndCssRoundtrip(
  slug: string,
  schema: TemplateModuleSchema,
  state: ModuleConfigState
) {
  const filesA = filesToMap(generateFiles(state, undefined, slug));
  const configA = filesA['src/lib/config.ts'];
  expect(configA, 'config.ts가 생성되지 않음').toBeTruthy();

  // 배포 코드 → state 역파싱 (에디터 재진입 시뮬레이션)
  const reparsed = parseConfigToState(configA, schema);
  // 값 복원만 검증하므로 활성/순서는 원본 유지
  reparsed.enabled = clone(state.enabled);
  reparsed.order = clone(state.order);

  const filesB = filesToMap(generateFiles(reparsed, undefined, slug));

  // config.ts 손실 없는 복원
  expect(
    filesB['src/lib/config.ts'],
    `[${slug}] config.ts 라운드트립 불일치 — 파싱에서 복원 안 되는 필드 존재`
  ).toBe(configA);

  // preset-override.css (색상/디자인) 손실 없는 복원
  if (filesA['src/app/preset-override.css']) {
    expect(
      filesB['src/app/preset-override.css'],
      `[${slug}] preset-override.css 라운드트립 불일치 — 색상/디자인 필드가 config에 저장되지 않아 재진입 시 유실`
    ).toBe(filesA['src/app/preset-override.css']);
  }
}
