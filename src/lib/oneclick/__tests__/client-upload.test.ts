import { describe, it, expect } from 'vitest';
import { zipSync, strToU8 } from 'fflate';
import {
  prepareUpload,
  prepareFileList,
  UploadPrepareError,
  CLIENT_MAX_FILES,
} from '../client-upload';

/**
 * jsdom의 File은 arrayBuffer()/text()를 구현하지 않는다 (브라우저에는 존재).
 * 테스트에서는 알고 있는 바이트로 두 메서드를 채워 넣는다.
 */
function makeFile(name: string, bytes: Uint8Array, relPath?: string): File {
  // 본문은 아래에서 arrayBuffer/text/size를 직접 정의하므로 빈 Blob으로 만든다
  const file = new File([], name);
  Object.defineProperty(file, 'arrayBuffer', {
    value: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  });
  Object.defineProperty(file, 'text', { value: async () => new TextDecoder().decode(bytes) });
  Object.defineProperty(file, 'size', { value: bytes.length });
  if (relPath) Object.defineProperty(file, 'webkitRelativePath', { value: relPath });
  return file;
}

function fileOf(name: string, content: string, relPath?: string): File {
  return makeFile(name, strToU8(content), relPath);
}

function zipFile(entries: Record<string, string>, name = 'site.zip'): File {
  const data = zipSync(
    Object.fromEntries(Object.entries(entries).map(([k, v]) => [k, strToU8(v)])),
  );
  return makeFile(name, data);
}

function paths(result: { files: { path: string }[] }) {
  return result.files.map((f) => f.path).sort();
}

describe('prepareUpload — 단일 HTML', () => {
  it('publishes any single html file as index.html', async () => {
    const result = await prepareUpload([fileOf('about.html', '<h1>about</h1>')]);
    expect(paths(result)).toEqual(['index.html']);
    expect(result.files[0].content).toBe('<h1>about</h1>');
    expect(result.files[0].encoding).toBe('utf-8');
  });
});

describe('prepareUpload — ZIP', () => {
  it('extracts entries and keeps index.html at the root', async () => {
    const result = await prepareUpload([
      zipFile({ 'index.html': '<h1>hi</h1>', 'style.css': 'body{}' }),
    ]);
    expect(paths(result)).toEqual(['index.html', 'style.css']);
  });

  it('unwraps a single wrapper folder so index.html lands at the root', async () => {
    const result = await prepareUpload([
      zipFile({ 'my-site/index.html': '<h1>hi</h1>', 'my-site/app.js': 'x' }),
    ]);
    expect(paths(result)).toEqual(['app.js', 'index.html']);
  });

  // 요약 카드가 "실제로 배포될 파일"을 보여줘야 한다.
  // 서버만 걸러내면 사용자는 목록에서 본 파일이 조용히 사라지는 경험을 하게 된다.
  it('drops what the server would reject and reports why', async () => {
    const result = await prepareUpload([
      zipFile({
        'index.html': '<h1>hi</h1>',
        'style.css': 'body{}',
        '.github/workflows/evil.yml': 'run: pwned',
        '.env': 'SECRET=1',
        'run.sh': '#!/bin/sh',
      }),
    ]);

    expect(paths(result)).toEqual(['index.html', 'style.css']);
    const dropped = Object.fromEntries(result.skipped.map((s) => [s.path, s.reason]));
    expect(dropped['.github/workflows/evil.yml']).toContain('Linkmap이 직접');
    expect(dropped['.env']).toContain('숨김 파일');
    expect(dropped['run.sh']).toContain('지원하지 않는');
  });

  it('drops archive junk entries', async () => {
    const result = await prepareUpload([
      zipFile({
        'index.html': '<h1>hi</h1>',
        '__MACOSX/._index.html': 'junk',
        '.DS_Store': 'junk',
      }),
    ]);
    expect(paths(result)).toEqual(['index.html']);
  });

  it('copies the sole html file to index.html instead of renaming it', async () => {
    const result = await prepareUpload([
      zipFile({ 'home.html': '<h1>home</h1>', 'style.css': 'body{}' }),
    ]);
    // 원본을 남겨야 다른 파일의 상대경로 참조가 깨지지 않는다
    expect(paths(result)).toEqual(['home.html', 'index.html', 'style.css']);
  });

  it('asks the user to choose when several html files exist and none is index', async () => {
    const result = await prepareUpload([
      zipFile({ 'a.html': '<p>a</p>', 'b.html': '<p>b</p>' }),
    ]);
    expect(result.files.some((f) => f.path === 'index.html')).toBe(false);
    expect(result.hasIndex).toBe(false);
    expect(result.htmlCandidates.sort()).toEqual(['a.html', 'b.html']);
  });

  // hasIndex=false로 표시되어야 UI가 배포 버튼을 막는다.
  // htmlCandidates만 보면 "후보 0개 = 정상"으로 오독되어 서버에서야 거절된다.
  it('reports hasIndex=false when the archive contains no html at all', async () => {
    const result = await prepareUpload([zipFile({ 'style.css': 'body{}', 'app.js': 'x' })]);
    expect(result.hasIndex).toBe(false);
    expect(result.htmlCandidates).toEqual([]);
  });

  it('unwraps nested wrapper folders, not just one level', async () => {
    const result = await prepareUpload([
      zipFile({ 'out/my-site/index.html': '<h1>hi</h1>', 'out/my-site/app.js': 'x' }),
    ]);
    expect(paths(result)).toEqual(['app.js', 'index.html']);
    expect(result.hasIndex).toBe(true);
  });

  it('does not treat Index.html as the entry point', async () => {
    const result = await prepareUpload([zipFile({ 'Index.html': '<p>x</p>', 'a.css': 'body{}' })]);
    // 유일한 html이므로 index.html 복제본이 생겨야 한다 (원본은 유지)
    expect(paths(result)).toEqual(['Index.html', 'a.css', 'index.html']);
    expect(result.hasIndex).toBe(true);
  });

  it('uses the chosen file as index.html on the second pass', async () => {
    const result = await prepareUpload(
      [zipFile({ 'a.html': '<p>a</p>', 'b.html': '<p>b</p>' })],
      'b.html',
    );
    expect(paths(result)).toEqual(['a.html', 'b.html', 'index.html']);
    expect(result.files.find((f) => f.path === 'index.html')?.content).toBe('<p>b</p>');
  });

  it('rejects a corrupted archive with a readable message', async () => {
    const notAZip = makeFile('broken.zip', new Uint8Array([1, 2, 3, 4]));
    await expect(prepareUpload([notAZip])).rejects.toThrow(UploadPrepareError);
  });

  it('rejects an archive with too many files', async () => {
    const entries: Record<string, string> = { 'index.html': 'x' };
    for (let i = 0; i < CLIENT_MAX_FILES; i++) entries[`f${i}.html`] = 'x';
    await expect(prepareUpload([zipFile(entries)])).rejects.toThrow(/너무 많습니다/);
  });
});

describe('prepareFileList — 폴더 선택', () => {
  it('uses webkitRelativePath and unwraps the folder root', async () => {
    const result = await prepareFileList([
      fileOf('index.html', '<h1>hi</h1>', 'my-site/index.html'),
      fileOf('app.js', 'x', 'my-site/app.js'),
    ]);
    expect(paths(result)).toEqual(['app.js', 'index.html']);
  });

  it('encodes non-text assets as base64', async () => {
    const result = await prepareFileList([
      fileOf('index.html', '<h1>hi</h1>', 'site/index.html'),
      makeFile('logo.png', new Uint8Array([0x89, 0x50, 0x4e, 0x47]), 'site/logo.png'),
    ]);
    const logo = result.files.find((f) => f.path === 'logo.png');
    expect(logo?.encoding).toBe('base64');
    expect(logo?.content).toBe('iVBORw=='); // 0x89 'P' 'N' 'G'
  });
});
