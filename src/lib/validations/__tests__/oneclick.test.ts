import { describe, it, expect } from 'vitest';
import { fileUpdateSchema, deployUploadRequestSchema } from '../oneclick';

function pathAllowed(path: string): boolean {
  return fileUpdateSchema.safeParse({ path, content: 'x' }).success;
}

describe('fileUpdateSchema — 워크플로우 인젝션 차단', () => {
  it('rejects literal .github paths', () => {
    expect(pathAllowed('.github/workflows/deploy.yml')).toBe(false);
    expect(pathAllowed('src/.github/x.yml')).toBe(false);
  });

  // 편집 경로는 path를 Contents API URL에 보간하고 GitHub이 이를 디코딩하므로,
  // 인코딩된 형태를 통과시키면 서버에서 .github/로 복원되어 방어가 무력화된다.
  it('rejects percent-encoded .github paths', () => {
    expect(pathAllowed('%2Egithub/workflows/pwn.yml')).toBe(false);
    expect(pathAllowed('%2egithub/workflows/pwn.yml')).toBe(false);
    expect(pathAllowed('src/%2Egithub/pwn.yml')).toBe(false);
  });

  it('rejects double-encoded .github paths', () => {
    expect(pathAllowed('%252Egithub/workflows/pwn.yml')).toBe(false);
  });

  it('rejects percent-encoded traversal', () => {
    expect(pathAllowed('%2E%2E/secret.html')).toBe(false);
  });

  it('rejects hidden files and traversal in plain form', () => {
    expect(pathAllowed('.env')).toBe(false);
    expect(pathAllowed('../secret.html')).toBe(false);
  });

  it('rejects malformed percent sequences', () => {
    expect(pathAllowed('%E0%A4%A.html')).toBe(false);
  });

  it('keeps ordinary editable paths working', () => {
    expect(pathAllowed('src/app/page.tsx')).toBe(true);
    expect(pathAllowed('index.html')).toBe(true);
    expect(pathAllowed('public/images/logo.png')).toBe(true);
  });
});

describe('deployUploadRequestSchema', () => {
  const files = [{ path: 'index.html', content: '<h1>hi</h1>' }];

  it('accepts a minimal valid request', () => {
    const parsed = deployUploadRequestSchema.safeParse({ site_name: 'my-site', files });
    expect(parsed.success).toBe(true);
  });

  it('rejects an invalid site name', () => {
    expect(deployUploadRequestSchema.safeParse({ site_name: 'My_Site', files }).success).toBe(false);
    expect(deployUploadRequestSchema.safeParse({ site_name: 'a', files }).success).toBe(false);
  });

  it('rejects an empty file list', () => {
    expect(deployUploadRequestSchema.safeParse({ site_name: 'my-site', files: [] }).success).toBe(false);
  });

  it('rejects more than 60 files', () => {
    const many = Array.from({ length: 61 }, (_, i) => ({ path: `f${i}.html`, content: 'x' }));
    expect(deployUploadRequestSchema.safeParse({ site_name: 'my-site', files: many }).success).toBe(false);
  });

  it('rejects an unknown encoding', () => {
    const bad = [{ path: 'index.html', content: 'x', encoding: 'hex' }];
    expect(deployUploadRequestSchema.safeParse({ site_name: 'my-site', files: bad }).success).toBe(false);
  });
});
