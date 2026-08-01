/**
 * 내 파일 업로드(트랙 A) — 브라우저측 해제·정규화.
 *
 * ZIP 해제를 서버가 아니라 브라우저에서 하는 이유:
 *  - Workers CPU 예산(cpu_ms)을 배포 파이프라인이 온전히 쓰게 한다
 *  - zip bomb이 터져도 사용자 본인 탭에서 끝난다 (서버는 아카이브를 수신조차 하지 않음)
 *  - "업로드 원본을 보관하지 않는다"는 원칙이 구조적으로 보장된다
 *
 * 단일 HTML·ZIP·폴더 어떤 입력이든 결과는 같은 `PreparedFile[]`로 수렴하므로
 * 서버 검증(upload-sanitizer)은 한 가지 형태만 다루면 된다.
 * 여기서 거르는 것은 UX용 사전 필터일 뿐, 최종 판단은 항상 서버가 다시 한다.
 */

export interface PreparedFile {
  path: string;
  content: string;
  encoding: 'utf-8' | 'base64';
  /** 원본 바이트 수 (요약 카드 표시용) */
  bytes: number;
}

export interface PreparedUpload {
  files: PreparedFile[];
  skipped: { path: string; reason: string }[];
  /** index.html이 없어 사용자가 첫 화면을 골라야 하는 경우의 후보 */
  htmlCandidates: string[];
  /** 첫 화면(index.html)이 확정됐는지 — false면 배포할 수 없다 */
  hasIndex: boolean;
  totalBytes: number;
}

/** 해제 도중 누적 크기가 이 값을 넘으면 즉시 중단한다 (zip bomb 방어) */
export const CLIENT_MAX_TOTAL_BYTES = 25 * 1024 * 1024;
export const CLIENT_MAX_FILES = 60;
/**
 * 개별 파일 상한 — 서버(upload-sanitizer)와 같은 값으로 유지한다.
 * 여기서 미리 걸러야 "다 올린 뒤에 거절당하는" 경험을 피할 수 있다.
 */
export const CLIENT_MAX_TEXT_BYTES = 2 * 1024 * 1024;
export const CLIENT_MAX_BINARY_BYTES = 5 * 1024 * 1024;

/** 텍스트로 다룰 확장자 — 나머지는 base64로 전송한다 */
const TEXT_EXTENSIONS = new Set([
  'html', 'htm', 'css', 'js', 'mjs', 'json', 'txt', 'md', 'xml', 'svg', 'webmanifest', 'map', 'csv',
]);

/** 아카이브·OS가 끼워 넣는 부산물 — 조용히 버린다 */
const JUNK_PATTERNS = [
  /^__MACOSX\//,
  /(^|\/)\.DS_Store$/,
  /(^|\/)Thumbs\.db$/i,
  /(^|\/)desktop\.ini$/i,
  /(^|\/)\.git\//,
];

/**
 * 배포에 포함되는 확장자 — 서버(upload-sanitizer)의 허용 목록과 같은 값으로 유지한다.
 * 여기서 걸러야 요약 카드가 "실제로 배포될 파일"과 일치한다. 서버만 걸러내면
 * 사용자는 목록에서 본 파일이 조용히 사라지는 경험을 하게 된다.
 */
const ALLOWED_EXTENSIONS = new Set([
  'html', 'htm', 'css', 'js', 'mjs', 'json', 'txt', 'md', 'xml', 'webmanifest', 'map', 'csv',
  'svg', 'ico', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'bmp',
  'woff', 'woff2', 'ttf', 'otf', 'eot',
  'mp4', 'webm', 'mp3', 'wav', 'ogg',
  'pdf',
]);

/**
 * 서버가 드랍할 파일을 미리 걸러 사유를 돌려준다 (null이면 포함).
 * 규칙은 upload-sanitizer의 pathRejectionReason·확장자 정책과 대응된다.
 */
function dropReason(path: string): string | null {
  const segments = path.split('/');
  // 숨김 파일·디렉토리 — .github/ 워크플로우 인젝션도 여기서 걸린다
  if (segments.some((s) => s.startsWith('.'))) {
    return path.startsWith('.github/') || path.includes('/.github/')
      ? '배포 설정은 Linkmap이 직접 넣어요'
      : '숨김 파일은 배포에 포함되지 않아요';
  }
  if (segments.some((s) => s === '..' || s === '')) return '잘못된 경로예요';
  const ext = extensionOf(path);
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return `지원하지 않는 형식이에요 (.${ext || '확장자 없음'})`;
  }
  return null;
}

export class UploadPrepareError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadPrepareError';
  }
}

function extensionOf(path: string): string {
  const base = path.slice(path.lastIndexOf('/') + 1);
  const dot = base.lastIndexOf('.');
  return dot > 0 ? base.slice(dot + 1).toLowerCase() : '';
}

function isJunk(path: string): boolean {
  return JUNK_PATTERNS.some((p) => p.test(path));
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const CHUNK = 0x8000; // 인자 개수 한계를 피하기 위한 청크 변환
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

function decodeEntry(path: string, bytes: Uint8Array): PreparedFile {
  const ext = extensionOf(path);
  if (TEXT_EXTENSIONS.has(ext)) {
    return {
      path,
      content: new TextDecoder().decode(bytes),
      encoding: 'utf-8',
      bytes: bytes.length,
    };
  }
  return { path, content: toBase64(bytes), encoding: 'base64', bytes: bytes.length };
}

/**
 * 최상위 폴더가 하나뿐이면 벗겨낸다.
 * AI 도구·압축 프로그램이 `my-site/` 폴더째 감싸는 것이 흔한데,
 * 그대로 두면 index.html이 루트에 없어 배포가 깨진다.
 * 이중 래핑(`out/my-site/...`)도 있으므로 더 벗길 게 없을 때까지 반복한다.
 */
function unwrapSingleRoot(entries: { path: string; bytes: Uint8Array }[]): typeof entries {
  let current = entries;
  // 경로 깊이보다 많이 돌 수 없으므로 상한을 둬 무한 루프를 원천 차단
  for (let depth = 0; depth < 16; depth++) {
    const roots = new Set(current.map((e) => e.path.split('/')[0]));
    if (roots.size !== 1) return current;
    const [root] = [...roots];
    if (!current.every((e) => e.path.startsWith(`${root}/`))) return current;
    current = current.map((e) => ({ ...e, path: e.path.slice(root.length + 1) }));
  }
  return current;
}

/**
 * 첫 화면을 index.html로 확정한다.
 *
 * 이름만 바꾸지 않고 **복제**하는 이유: 다른 파일이 원본 이름을 상대경로로 참조하고 있을 수
 * 있어 rename하면 링크가 깨진다. 파일 1개를 더 두는 편이 안전하다.
 * (단일 파일 업로드는 참조 대상이 없으므로 호출부에서 rename으로 처리한다)
 */
function ensureIndex(
  files: PreparedFile[],
  preferred?: string,
): { files: PreparedFile[]; htmlCandidates: string[]; hasIndex: boolean } {
  // GitHub Pages는 대소문자를 구분하므로 정확히 'index.html'이어야 첫 화면이 된다
  if (files.some((f) => f.path === 'index.html')) {
    return { files, htmlCandidates: [], hasIndex: true };
  }

  const rootHtml = files.filter((f) => !f.path.includes('/') && /\.html?$/i.test(f.path));
  const anyHtml = files.filter((f) => /\.html?$/i.test(f.path));
  const source =
    (preferred && files.find((f) => f.path === preferred)) ??
    (rootHtml.length === 1 ? rootHtml[0] : undefined) ??
    (anyHtml.length === 1 ? anyHtml[0] : undefined);

  if (source) {
    return { files: [...files, { ...source, path: 'index.html' }], htmlCandidates: [], hasIndex: true };
  }
  // 후보가 여럿이면 사용자가 골라야 하고, 0개면 애초에 배포할 수 없다.
  // 두 경우를 hasIndex=false로 함께 표시하되 후보 목록으로 구분한다.
  return { files, htmlCandidates: anyHtml.map((f) => f.path), hasIndex: false };
}

function finalize(
  entries: { path: string; bytes: Uint8Array }[],
  skipped: { path: string; reason: string }[],
  preferredIndex?: string,
): PreparedUpload {
  const withinLimit: typeof entries = [];
  for (const entry of entries) {
    const reason = dropReason(entry.path);
    if (reason) {
      skipped.push({ path: entry.path, reason });
      continue;
    }

    const isText = TEXT_EXTENSIONS.has(extensionOf(entry.path));
    const limit = isText ? CLIENT_MAX_TEXT_BYTES : CLIENT_MAX_BINARY_BYTES;
    if (entry.bytes.length > limit) {
      skipped.push({
        path: entry.path,
        reason: `파일이 너무 커서 제외했어요 (${Math.round(entry.bytes.length / 1024)}KB, 최대 ${Math.round(limit / 1024)}KB)`,
      });
      continue;
    }
    withinLimit.push(entry);
  }

  const prepared = withinLimit.map((e) => decodeEntry(e.path, e.bytes));
  const { files, htmlCandidates, hasIndex } = ensureIndex(prepared, preferredIndex);
  const totalBytes = files.reduce((sum, f) => sum + f.bytes, 0);
  return { files, skipped, htmlCandidates, hasIndex, totalBytes };
}

/** 단일 HTML 파일 — 이름이 무엇이든 첫 화면(index.html)으로 게시한다 */
export async function prepareSingleHtml(file: File): Promise<PreparedUpload> {
  const text = await file.text();
  const bytes = new TextEncoder().encode(text);
  if (bytes.length > CLIENT_MAX_TEXT_BYTES) {
    throw new UploadPrepareError(
      `파일이 너무 큽니다 (최대 ${Math.round(CLIENT_MAX_TEXT_BYTES / 1024 / 1024)}MB). 이미지를 파일로 분리하면 올릴 수 있어요.`,
    );
  }
  return {
    files: [{ path: 'index.html', content: text, encoding: 'utf-8', bytes: bytes.length }],
    skipped: [],
    htmlCandidates: [],
    hasIndex: true,
    totalBytes: bytes.length,
  };
}

/** 여러 파일(폴더 선택 결과 포함)을 정규화한다 */
export async function prepareFileList(
  fileList: File[],
  preferredIndex?: string,
): Promise<PreparedUpload> {
  const skipped: { path: string; reason: string }[] = [];
  const entries: { path: string; bytes: Uint8Array }[] = [];
  let total = 0;

  for (const file of fileList) {
    // webkitRelativePath는 폴더 선택 시에만 채워진다
    const rel = (file as File & { webkitRelativePath?: string }).webkitRelativePath;
    const path = (rel && rel.length > 0 ? rel : file.name).replace(/\\/g, '/');

    if (isJunk(path)) continue;

    total += file.size;
    if (total > CLIENT_MAX_TOTAL_BYTES) {
      throw new UploadPrepareError(
        `전체 용량이 너무 큽니다. 최대 ${Math.round(CLIENT_MAX_TOTAL_BYTES / 1024 / 1024)}MB까지 올릴 수 있습니다.`,
      );
    }
    entries.push({ path, bytes: new Uint8Array(await file.arrayBuffer()) });
  }

  const unwrapped = unwrapSingleRoot(entries);
  if (unwrapped.length > CLIENT_MAX_FILES) {
    throw new UploadPrepareError(
      `파일이 너무 많습니다 (${unwrapped.length}개). 최대 ${CLIENT_MAX_FILES}개까지 올릴 수 있습니다.`,
    );
  }
  return finalize(unwrapped, skipped, preferredIndex);
}

/**
 * ZIP을 브라우저에서 해제한다. fflate는 이 함수 안에서만 dynamic import하여
 * 서버 번들·초기 로드에 포함되지 않게 한다.
 */
export async function prepareZip(file: File, preferredIndex?: string): Promise<PreparedUpload> {
  const { unzipSync } = await import('fflate');
  const buffer = new Uint8Array(await file.arrayBuffer());

  // zip bomb 방어는 반드시 해제 "이전"에 이뤄져야 한다.
  // unzipSync는 동기 전량 해제라 결과를 받은 뒤 크기를 재면 이미 메모리에 다 올라온 뒤다.
  // filter는 각 엔트리를 풀기 전에 호출되고 originalSize(헤더 값)를 주므로 여기서 차단한다.
  let declaredTotal = 0;
  let tooBig = false;
  let unzipped: Record<string, Uint8Array>;
  try {
    unzipped = unzipSync(buffer, {
      filter: (entry) => {
        if (tooBig) return false;
        if (entry.name.endsWith('/') || isJunk(entry.name)) return false;
        declaredTotal += entry.originalSize ?? 0;
        if (declaredTotal > CLIENT_MAX_TOTAL_BYTES) {
          tooBig = true;
          return false;
        }
        return true;
      },
    });
  } catch {
    throw new UploadPrepareError('ZIP 파일을 열 수 없습니다. 파일이 손상되었는지 확인해주세요.');
  }

  if (tooBig) {
    throw new UploadPrepareError(
      `압축을 풀었을 때 용량이 너무 큽니다. 최대 ${Math.round(CLIENT_MAX_TOTAL_BYTES / 1024 / 1024)}MB까지 올릴 수 있습니다.`,
    );
  }

  const skipped: { path: string; reason: string }[] = [];
  const entries: { path: string; bytes: Uint8Array }[] = [];
  let total = 0;

  for (const [rawPath, bytes] of Object.entries(unzipped)) {
    const path = rawPath.replace(/\\/g, '/');
    if (path.endsWith('/') || bytes.length === 0) continue;
    if (isJunk(path)) continue;

    // 헤더가 실제 크기를 속일 수 있으므로 해제 결과로 한 번 더 확인한다
    total += bytes.length;
    if (total > CLIENT_MAX_TOTAL_BYTES) {
      throw new UploadPrepareError(
        `압축을 풀었을 때 용량이 너무 큽니다. 최대 ${Math.round(CLIENT_MAX_TOTAL_BYTES / 1024 / 1024)}MB까지 올릴 수 있습니다.`,
      );
    }
    entries.push({ path, bytes });
  }

  const unwrapped = unwrapSingleRoot(entries);
  if (unwrapped.length > CLIENT_MAX_FILES) {
    throw new UploadPrepareError(
      `파일이 너무 많습니다 (${unwrapped.length}개). 최대 ${CLIENT_MAX_FILES}개까지 올릴 수 있습니다.`,
    );
  }
  if (unwrapped.length === 0) {
    throw new UploadPrepareError('ZIP 안에 배포할 파일이 없습니다.');
  }
  return finalize(unwrapped, skipped, preferredIndex);
}

/** 드롭·선택된 입력을 형태에 맞는 준비 함수로 보낸다 */
export async function prepareUpload(files: File[], preferredIndex?: string): Promise<PreparedUpload> {
  if (files.length === 0) throw new UploadPrepareError('업로드할 파일을 선택해주세요.');

  if (files.length === 1) {
    const only = files[0];
    const ext = extensionOf(only.name);
    if (ext === 'zip') return prepareZip(only, preferredIndex);
    if (ext === 'html' || ext === 'htm') return prepareSingleHtml(only);
  }
  return prepareFileList(files, preferredIndex);
}
