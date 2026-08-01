/**
 * 사용자 업로드 파일 검증·정규화 (트랙 A 서버측).
 *
 * 클라이언트가 ZIP 해제·필터링을 수행하지만 그 결과를 신뢰하지 않는다 — 여기서 전량 재검증한다.
 *
 * 책임 분계: 이 기능의 본질은 "사용자가 만든 임의 HTML/JS를 사용자 본인 GitHub 계정·도메인에
 * 게시"하는 것이라 콘텐츠 자체(스크립트 내용)는 검사하지 않는다. 방어 경계는
 *   ① 워크플로우 인젝션 차단(.github/ 전량 드랍 후 서버 상수만 주입)
 *   ② 경로 무결성(traversal·절대경로·제어문자)
 *   ③ tree 모드 고정(100644)으로 symlink·실행 파일 생성 자체를 불가능하게
 * 세 가지이며, 콘텐츠 적법성은 ToS + GitHub AUP로 사용자 책임이다.
 */

/** 파일 개수 상한 — GitHub 콘텐츠 생성 secondary rate limit(≈80 req/min) 대비 안전 마진 */
export const MAX_UPLOAD_FILES = 60;
/** 텍스트 파일 개별 상한 (기존 이미지 업로드 2MB 선례와 통일) */
export const MAX_TEXT_FILE_BYTES = 2 * 1024 * 1024;
/** 바이너리 파일 개별 상한 (base64 인코딩 후 약 6.8MB) */
export const MAX_BINARY_FILE_BYTES = 5 * 1024 * 1024;
/** 요청 총량 상한 (base64 인코딩 후 기준) */
export const MAX_UPLOAD_TOTAL_BYTES = 25 * 1024 * 1024;
/** 개별 경로 길이 상한 */
export const MAX_PATH_LENGTH = 256;

/**
 * 업로드 허용 확장자 — 정적 사이트 자산 전반.
 * 편집기용 EDITABLE_EXTENSIONS보다 넓다(폰트·미디어·pdf 포함). exe/sh/php 등은 드랍한다:
 * GitHub Pages에서 실행되지 않아 실질 위험은 낮지만, 남용 인상과 스캐너 오탐을 줄인다.
 */
const ALLOWED_EXTENSIONS = new Set([
  'html', 'htm', 'css', 'js', 'mjs', 'json', 'txt', 'md', 'xml', 'webmanifest', 'map', 'csv',
  'svg', 'ico', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'bmp',
  'woff', 'woff2', 'ttf', 'otf', 'eot',
  'mp4', 'webm', 'mp3', 'wav', 'ogg',
  'pdf',
]);

/** 이미지 매직바이트 — 확장자 위조 탐지 (이미지 계열만 검사) */
const IMAGE_MAGIC_BYTES: Record<string, number[][]> = {
  png: [[0x89, 0x50, 0x4e, 0x47]],
  jpg: [[0xff, 0xd8, 0xff]],
  jpeg: [[0xff, 0xd8, 0xff]],
  gif: [[0x47, 0x49, 0x46, 0x38]],
  webp: [[0x52, 0x49, 0x46, 0x46]], // RIFF — 오프셋 8의 'WEBP'는 아래에서 추가 확인
};

export type UploadEncoding = 'utf-8' | 'base64';

export interface UploadFileInput {
  path: string;
  content: string;
  encoding?: UploadEncoding;
}

export interface SanitizedFile {
  path: string;
  content: string;
  encoding: UploadEncoding;
}

export interface SanitizeResult {
  files: SanitizedFile[];
  /** 정책상 제외된 파일과 사유 — 사용자에게 그대로 보고한다 */
  skipped: { path: string; reason: string }[];
}

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadValidationError';
  }
}

function getExtension(path: string): string {
  const base = path.slice(path.lastIndexOf('/') + 1);
  const dot = base.lastIndexOf('.');
  return dot > 0 ? base.slice(dot + 1).toLowerCase() : '';
}

/** base64 문자열의 디코딩 후 바이트 수 (실제 디코딩 없이 계산) */
function base64ByteLength(value: string): number {
  const clean = value.replace(/[\r\n]/g, '');
  const padding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((clean.length * 3) / 4) - padding);
}

function decodeBase64Prefix(value: string, byteCount: number): number[] {
  const clean = value.replace(/[\r\n]/g, '').slice(0, Math.ceil((byteCount * 4) / 3) + 4);
  try {
    const binary = atob(clean);
    const out: number[] = [];
    for (let i = 0; i < Math.min(byteCount, binary.length); i++) out.push(binary.charCodeAt(i));
    return out;
  } catch {
    return [];
  }
}

function hasControlChar(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return true;
  }
  return false;
}

/**
 * 경로를 검증하고 거부 사유를 반환한다. null이면 통과.
 */
function pathRejectionReason(path: string): string | null {
  if (!path) return '빈 경로';
  if (path.length > MAX_PATH_LENGTH) return '경로가 너무 깁니다';
  if (path.startsWith('/')) return '절대 경로는 사용할 수 없습니다';
  if (path.includes('\\')) return '역슬래시 경로는 사용할 수 없습니다';
  if (hasControlChar(path)) return '제어 문자가 포함된 경로입니다';

  const segments = path.split('/');
  if (segments.some((s) => s === '' || s === '.' || s === '..')) {
    return '상위 경로 참조는 사용할 수 없습니다';
  }
  // 숨김 파일·디렉토리 전량 드랍 (.github/ 워크플로우 인젝션 포함)
  if (segments.some((s) => s.startsWith('.'))) {
    return '숨김 파일·디렉토리는 배포에 포함되지 않습니다';
  }
  return null;
}

/**
 * 업로드 파일 배열을 검증·정규화한다.
 *
 * 개별 파일 문제는 드랍 후 보고(skipped)하고, 배포 자체가 불가능한 조건
 * (파일 수·총량 초과, 남은 파일 없음, index.html 부재)만 예외로 중단한다.
 */
export function sanitizeUploadFiles(input: UploadFileInput[]): SanitizeResult {
  if (input.length > MAX_UPLOAD_FILES) {
    throw new UploadValidationError(
      `파일이 너무 많습니다 (${input.length}개). 최대 ${MAX_UPLOAD_FILES}개까지 업로드할 수 있습니다.`,
    );
  }

  const files: SanitizedFile[] = [];
  const skipped: { path: string; reason: string }[] = [];
  // 중복 판정은 대소문자 무시(같은 파일로 취급), index 판정은 대소문자 구분:
  // GitHub Pages는 경로를 대소문자 구분해 서비스하므로 `Index.html`은 첫 화면이 되지 못한다.
  const seenLower = new Set<string>();
  const exactPaths = new Set<string>();
  let totalBytes = 0;

  for (const raw of input) {
    const path = raw.path.trim();
    const encoding: UploadEncoding = raw.encoding === 'base64' ? 'base64' : 'utf-8';

    const pathReason = pathRejectionReason(path);
    if (pathReason) {
      skipped.push({ path: raw.path, reason: pathReason });
      continue;
    }

    const ext = getExtension(path);
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      skipped.push({ path, reason: `지원하지 않는 파일 형식입니다 (.${ext || '확장자 없음'})` });
      continue;
    }

    if (seenLower.has(path.toLowerCase())) {
      skipped.push({ path, reason: '중복된 경로입니다' });
      continue;
    }

    const byteLength =
      encoding === 'base64'
        ? base64ByteLength(raw.content)
        : new TextEncoder().encode(raw.content).length;
    const limit = encoding === 'base64' ? MAX_BINARY_FILE_BYTES : MAX_TEXT_FILE_BYTES;
    if (byteLength > limit) {
      skipped.push({
        path,
        reason: `파일이 너무 큽니다 (${Math.round(byteLength / 1024)}KB, 최대 ${Math.round(limit / 1024)}KB)`,
      });
      continue;
    }

    // 이미지 확장자는 매직바이트로 실제 형식을 확인한다 (확장자 위조 차단)
    if (encoding === 'base64' && IMAGE_MAGIC_BYTES[ext]) {
      const head = decodeBase64Prefix(raw.content, 12);
      const matches = IMAGE_MAGIC_BYTES[ext].some((sig) => sig.every((byte, i) => head[i] === byte));
      const webpOk =
        ext !== 'webp' ||
        (head[8] === 0x57 && head[9] === 0x45 && head[10] === 0x42 && head[11] === 0x50);
      if (!matches || !webpOk) {
        skipped.push({ path, reason: '이미지 파일 형식이 확장자와 일치하지 않습니다' });
        continue;
      }
    }

    totalBytes += byteLength;
    if (totalBytes > MAX_UPLOAD_TOTAL_BYTES) {
      throw new UploadValidationError(
        `전체 용량이 너무 큽니다. 최대 ${Math.round(MAX_UPLOAD_TOTAL_BYTES / 1024 / 1024)}MB까지 업로드할 수 있습니다.`,
      );
    }

    seenLower.add(path.toLowerCase());
    exactPaths.add(path);
    files.push({ path, content: raw.content, encoding });
  }

  if (files.length === 0) {
    throw new UploadValidationError(
      '배포할 수 있는 파일이 없습니다. 웹페이지 파일(html)을 포함해 다시 시도해주세요.',
    );
  }

  if (!exactPaths.has('index.html')) {
    throw new UploadValidationError(
      '첫 화면이 될 index.html이 없습니다. 파일 이름을 index.html로 바꾸거나 index.html을 포함해주세요.',
    );
  }

  return { files, skipped };
}

/** 업로드 통계 — homepage_deploys.config_data에 기록해 my-sites에서 표시한다 */
export function summarizeUpload(result: SanitizeResult): {
  file_count: number;
  total_bytes: number;
  skipped_files: { path: string; reason: string }[];
} {
  const total_bytes = result.files.reduce(
    (sum, f) =>
      sum +
      (f.encoding === 'base64'
        ? base64ByteLength(f.content)
        : new TextEncoder().encode(f.content).length),
    0,
  );
  return { file_count: result.files.length, total_bytes, skipped_files: result.skipped };
}
