// ──────────────────────────────────────────────
// Base Generator — 공통 유틸리티 함수
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';

// ─── 문자열 유틸 ─────────────────────────────

/** 문자열 내 작은따옴표 이스케이프 */
export function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** JS 문자열의 이스케이프 시퀀스를 실제 문자로 디코딩 */
export function unescapeString(s: string): string {
  // \uXXXX 유니코드 이스케이프 → 실제 문자
  let result = s.replace(/\\u([0-9A-Fa-f]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  // \' → ', \\ → \, etc.
  result = result.replace(/\\(.)/g, '$1');
  return result;
}

/** JSON.stringify with 2-space indent */
export function jsonBlock(val: unknown): string {
  return JSON.stringify(val, null, 2);
}

/** 퍼센트 문자열을 skill level로 변환 */
export function percentToLevel(pct: string): 'beginner' | 'intermediate' | 'advanced' {
  const n = parseInt(pct, 10);
  if (isNaN(n) || n <= 33) return 'beginner';
  if (n <= 66) return 'intermediate';
  return 'advanced';
}

/** skill level을 퍼센트 문자열로 변환 */
export function levelToPercent(level: string): string {
  if (level === 'advanced') return '90';
  if (level === 'intermediate') return '60';
  return '30';
}

// ─── 공통 배열 빌더 ──────────────────────────

export function buildSocialsArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const entries = items.map((item) => {
    const v = item as Record<string, string>;
    return `  { platform: '${esc(v.platform || '')}', url: '${esc(v.url || '')}' }`;
  });
  return `[\n${entries.join(',\n')}\n]`;
}

export function buildGalleryArray(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return '[]';
  const urls = items.map((item) => {
    const v = item as Record<string, string>;
    return `  '${esc(v.url || v as unknown as string)}'`;
  });
  return `[\n${urls.join(',\n')}\n]`;
}

// ─── 공통 config 파서 헬퍼 ───────────────────

/** siteConfig 블록에서 문자열 값 추출 */
export function createExtractors(siteBlock: string) {
  const extractString = (key: string): string | null => {
    // 작은따옴표 문자열 매칭
    const reSingle = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?'((?:[^'\\\\]|\\\\.)*)'`
    );
    const m = siteBlock.match(reSingle);
    if (m) return unescapeString(m[1]);
    // 큰따옴표 문자열 매칭 (storyEn 등 아포스트로피 포함 문자열)
    const reDouble = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?"((?:[^"\\\\]|\\\\.)*)"`
    );
    const md = siteBlock.match(reDouble);
    return md ? unescapeString(md[1]) : null;
  };

  const extractNullable = (key: string): string | null => {
    const re = new RegExp(
      `${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?(?:'((?:[^'\\\\]|\\\\.)*)'|null)`
    );
    const m = siteBlock.match(re);
    return m ? unescapeString(m[1] ?? '') : null;
  };

  return { extractString, extractNullable };
}

/** configContent에서 siteConfig 블록 추출 */
export function extractSiteBlock(configContent: string): string {
  return configContent.match(/export const siteConfig\s*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? configContent;
}

/** 배열 상수에서 오브젝트 배열 파싱 (정규식 기반) */
export function parseArrayConstant(
  configContent: string,
  constantPattern: string | RegExp,
  requiredField: string,
  extraParser?: (match: string, obj: Record<string, string>) => void
): Record<string, string>[] {
  const re = typeof constantPattern === 'string'
    ? new RegExp(constantPattern)
    : constantPattern;
  const match = configContent.match(re);
  if (!match?.[1]) return [];

  const items: Record<string, string>[] = [];
  const objRe = /\{([\s\S]*?)\}/g;
  let m;
  while ((m = objRe.exec(match[1])) !== null) {
    const obj: Record<string, string> = {};
    const fieldRe = /(\w+):\s*'([^']*)'/g;
    let fm;
    while ((fm = fieldRe.exec(m[1])) !== null) {
      obj[fm[1]] = unescapeString(fm[2]);
    }
    if (extraParser) extraParser(m[1], obj);
    if (obj[requiredField]) items.push(obj);
  }
  return items;
}

/** socials parseJSON 패턴에서 소셜 배열 파싱 */
export function parseSocialsFromConfig(configContent: string): Record<string, string>[] {
  return parseArrayConstant(
    configContent,
    /socials:\s*parseJSON<SocialItem\[\]>\([^,]+,\s*(\[[\s\S]*?\])\s*\)/,
    'platform'
  );
}

// ─── 스키마에서 초기 상태 추출 ────────────────

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

// ─── 컴포넌트 매핑 타입 ──────────────────────

export interface ComponentMapping {
  importName: string;
  importPath: string;
  render: string;
}

// ─── TemplateGenerator 인터페이스 ─────────────

export interface TemplateGenerator {
  slug: string;
  generateConfigTs(state: ModuleConfigState): string;
  generatePageTsx(state: ModuleConfigState): string;
  parseConfigToState(configContent: string, schema: TemplateModuleSchema): ModuleConfigState;
  moduleComponents: Record<string, ComponentMapping>;
  /** import 이름 → 모듈 ID 매핑 (parsePageToEnabledModules 용) */
  importToModuleMap: Record<string, string>;
}
