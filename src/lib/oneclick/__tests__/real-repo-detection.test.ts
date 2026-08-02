import { describe, it, expect } from 'vitest';
import { detectFramework } from '../framework-detect';
import { decideDeployMode } from '../repo-analyzer';
import { buildBuildWorkflowYml } from '../static-workflow';

/**
 * 실제 저장소에서 그대로 가져온 데이터로 감지·판정을 확인한다.
 * 손으로 만든 픽스처는 내가 상상한 모양만 검증하게 되므로, 진짜 Vite 프로젝트의
 * 파일 목록과 package.json을 그대로 넣어 둔다.
 * (출처: setlog-ntl/vite-test-0802 — 2026-08-02 라이브 검증용으로 만든 저장소)
 */
const REAL_VITE_REPO = {
  name: 'vite-test-0802',
  files: ['README.md', 'index.html', 'package.json', 'src/main.js', 'src/style.css'],
  pkg: {
    scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
    devDependencies: { vite: '8.2.0' },
  },
};

describe('실제 Vite 저장소 감지', () => {
  const paths = new Set(REAL_VITE_REPO.files);
  // 루트 index.html이 있으므로 findPublishDirs는 ['']를 돌려준다
  const publishDirs = [''];

  it('recognizes it as Vite from the dependency alone (no vite.config committed)', () => {
    const d = detectFramework(paths, REAL_VITE_REPO.pkg, REAL_VITE_REPO.name);
    expect(d.framework).toBe('vite');
    expect(d.outDir).toBe('dist');
  });

  // 이 저장소의 index.html은 완성된 페이지가 아니라 /src/main.js를 참조하는 빌드 입력이다.
  // 정적으로 판정하면 원본이 그대로 배포되어 화면이 빈다.
  it('builds instead of publishing the source index.html as-is', () => {
    const d = detectFramework(paths, REAL_VITE_REPO.pkg, REAL_VITE_REPO.name);
    expect(decideDeployMode(publishDirs, paths, d.framework)).toEqual({ mode: 'build' });
  });

  it('installs without a lockfile and injects the sub-path base', () => {
    const d = detectFramework(paths, REAL_VITE_REPO.pkg, REAL_VITE_REPO.name);
    // package-lock.json이 없으므로 npm ci는 실패한다
    expect(d.installCommand).toBe('npm install');
    // 빌드 스크립트가 순수 `vite build`라 --base를 안전하게 붙일 수 있다
    expect(d.buildCommand).toBe('npx vite build --base=/vite-test-0802/');
  });

  it('produces a workflow that installs, builds and uploads dist', () => {
    const d = detectFramework(paths, REAL_VITE_REPO.pkg, REAL_VITE_REPO.name);
    const yml = buildBuildWorkflowYml({
      outDir: d.outDir,
      branch: 'main',
      installCommand: d.installCommand,
      buildCommand: d.buildCommand,
      repoName: REAL_VITE_REPO.name,
    });
    expect(yml).toContain('- run: npm install');
    expect(yml).toContain('- run: npx vite build --base=/vite-test-0802/');
    expect(yml).toContain('path: dist');
  });
});
