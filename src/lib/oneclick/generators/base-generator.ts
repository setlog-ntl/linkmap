// ──────────────────────────────────────────────
// Base Generator — 공통 유틸리티 함수
// ──────────────────────────────────────────────

import type { ModuleConfigState, TemplateModuleSchema } from '@/lib/module-schema';

// ─── 문자열 유틸 ─────────────────────────────

/** 문자열 리터럴에 안전한 이스케이프 (빌드 파괴 방지) */
export function esc(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
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

// ─── 이미지 경로 정규화 ─────────────────────
// 업로드 API가 과거에 /public/images/... 형태로 반환했던 경로를
// Next.js의 정적 파일 서빙 경로 /images/... 로 보정
export function normalizeImagePath(path: string): string {
  if (path.startsWith('/public/')) {
    return path.slice('/public'.length); // /public/images/x → /images/x
  }
  return path;
}

// ─── basePath 지원 ──────────────────────────
// GitHub Pages 배포 시 /<repo-name>/ 하위에 서빙되므로
// <img src="/images/..."> 같은 절대 경로에 basePath 접두사 필요

/** config.ts 상단에 삽입할 _basePath 상수 코드 */
export function genBasePathConst(): string {
  return `const _basePath = process.env.NEXT_PUBLIC_REPO_NAME ? \`/\${process.env.NEXT_PUBLIC_REPO_NAME}\` : '';`;
}

/** 로컬 이미지 경로 → basePath 포함 template literal 표현식 생성 */
export function imagePathExpr(path: string): string {
  if (!path) return 'null';
  // 절대 URL(http/https)은 basePath 없이 그대로 사용
  if (/^https?:\/\//.test(path)) return `'${esc(path)}'`;
  return `\`\${_basePath}${esc(path)}\``;
}

/** 파싱된 이미지 경로에서 basePath 접두사 제거 (에디터 상태 복원용) */
export function stripBasePath(path: string): string {
  // ${_basePath}/images/... 형태의 빌드 결과물에서 basePath를 제거
  // 런타임에 이미 resolve된 경로: /repo-name/images/... → /images/...
  const m = path.match(/^\/[^/]+(\/(images|icons)\/.+)$/);
  if (m) return m[1];
  return path;
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
    const raw = v.url || (v as unknown as string);
    const normalized = normalizeImagePath(raw);
    return `  \`\${_basePath}${esc(normalized)}\``;
  });
  return `[\n${urls.join(',\n')}\n]`;
}

// ─── 공통 config 파서 헬퍼 ───────────────────

/** siteConfig 블록에서 문자열 값 추출 */
export function createExtractors(siteBlock: string) {
  // (?<!\w) : 단어 문자 바로 뒤가 아닌 위치에서만 매칭 (서브스트링 오매칭 방지)
  // 예: 'name:' 정규식이 'siteName:' 에 매칭되지 않도록 함
  const extractString = (key: string): string | null => {
    // 작은따옴표 문자열 매칭
    const reSingle = new RegExp(
      `(?<!\\w)${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?'((?:[^'\\\\]|\\\\.)*)'`
    );
    const m = siteBlock.match(reSingle);
    if (m) return unescapeString(m[1]);
    // 큰따옴표 문자열 매칭 (storyEn 등 아포스트로피 포함 문자열)
    const reDouble = new RegExp(
      `(?<!\\w)${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?"((?:[^"\\\\]|\\\\.)*)"`
    );
    const md = siteBlock.match(reDouble);
    return md ? unescapeString(md[1]) : null;
  };

  const extractNullable = (key: string): string | null => {
    // template literal 형태: `${_basePath}/images/...` 매칭
    const reTpl = new RegExp(
      `(?<!\\w)${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?` +
      '`\\$\\{_basePath\\}([^`]*)`'
    );
    const mt = siteBlock.match(reTpl);
    if (mt) return mt[1]; // basePath 없이 /images/... 부분만 반환

    const re = new RegExp(
      `(?<!\\w)${key}:\\s*(?:process\\.env\\.[\\w]+\\s*\\|\\|\\s*)?(?:'((?:[^'\\\\]|\\\\.)*)'|null)`
    );
    const m = siteBlock.match(re);
    if (!m) return null;
    // null 대안에 매칭된 경우 m[1]은 undefined → null 반환
    if (m[1] === undefined) return null;
    return unescapeString(m[1]);
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
    const fieldRe = /(\w+):\s*'((?:[^'\\]|\\.)*)'/g;
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
