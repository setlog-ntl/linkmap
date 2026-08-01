import { describe, it, expect } from 'vitest';
import { getTemplateBySlug } from '@/data/oneclick/homepage-template-content';

/**
 * 번들 의존성 정합성 검증 — package.json ↔ package-lock.json
 *
 * deploy.yml이 `npm ci`를 실행하므로, lockfile은 package.json과 정확히 일치해야 한다.
 * 불일치 시 신규 배포가 전부 빌드 실패하므로, 다음을 오프라인으로 강제한다:
 *   1. 모든 템플릿 번들에 package.json + package-lock.json 동시 존재
 *   2. lockfile root(packages[''])의 deps/devDeps가 package.json과 정확히 일치
 *   3. 각 직접 의존성의 해석 버전이 lockfile의 node_modules 엔트리에 존재
 *   4. name 필드 일치 (package.json.name === lock.name === lock.packages[''].name)
 *
 * 버전을 바꾸고 lockfile 재생성(scripts/gen-template-lockfiles.mjs)을 잊으면 여기서 실패.
 */

const ALL_SLUGS = [
  'personal-brand',
  'dev-showcase',
  'freelancer-page',
  'small-biz',
  'small-biz-cafe',
  'invitation',
  'digital-namecard',
  'link-card',
  'excel-merge',
] as const;

interface PackageJson {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface Lockfile {
  name?: string;
  lockfileVersion?: number;
  packages?: Record<string, { name?: string; version?: string; dependencies?: Record<string, string>; devDependencies?: Record<string, string> }>;
}

function getFile(slug: string, path: string): string | undefined {
  const template = getTemplateBySlug(slug);
  return template?.files.find((f) => f.path === path)?.content;
}

describe('번들 의존성 정합성 (npm ci 호환)', () => {
  for (const slug of ALL_SLUGS) {
    describe(`[${slug}]`, () => {
      it('package.json + package-lock.json 동시 존재', () => {
        expect(getFile(slug, 'package.json'), 'package.json 없음').toBeDefined();
        expect(getFile(slug, 'package-lock.json'), 'package-lock.json 없음').toBeDefined();
      });

      it('lockfile이 package.json과 정확히 일치 (npm ci 정합성)', () => {
        const pkgRaw = getFile(slug, 'package.json');
        const lockRaw = getFile(slug, 'package-lock.json');
        if (!pkgRaw || !lockRaw) throw new Error('번들 파일 누락');

        const pkg = JSON.parse(pkgRaw) as PackageJson;
        const lock = JSON.parse(lockRaw) as Lockfile;
        const root = lock.packages?.[''];
        expect(root, 'lockfile에 root 패키지(packages[""]) 없음').toBeDefined();
        if (!root) return;

        // lockfileVersion 3 (npm 7+, GitHub Actions node 20)
        expect(lock.lockfileVersion).toBe(3);

        // name 일치 — npm ci 정합성 + 산출물 일관성
        expect(lock.name).toBe(pkg.name);
        expect(root.name).toBe(pkg.name);

        // root deps/devDeps 정확 일치
        expect(root.dependencies ?? {}).toEqual(pkg.dependencies ?? {});
        expect(root.devDependencies ?? {}).toEqual(pkg.devDependencies ?? {});

        // 각 직접 의존성의 해석 버전이 lockfile node_modules 엔트리에 존재
        const allDeps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
        for (const [name, version] of Object.entries(allDeps)) {
          const entry = lock.packages?.[`node_modules/${name}`];
          expect(entry, `lockfile에 node_modules/${name} 엔트리 없음 — lockfile 재생성 필요`).toBeDefined();
          expect(
            entry?.version,
            `${name} 버전 불일치: package.json=${version}, lockfile=${entry?.version} — lockfile 재생성 필요`,
          ).toBe(version);
        }
      });
    });
  }
});
