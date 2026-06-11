// ──────────────────────────────────────────────
// 원클릭 템플릿 의존성 세트 — 단일 진실 소스
//
// gen-template-lockfiles.mjs(생성)와 verify-template-lockfiles.mjs(검증)가 공유.
// ⚠️ 여기 버전은 src/data/oneclick/shared-template-files.ts의 makePackageJson과
//    정확히 일치해야 한다. 불일치는 template-deps.test.ts가 잡아낸다.
// ──────────────────────────────────────────────

export const STANDARD_DEPS = {
  next: '15.1.0',
  react: '19.0.0',
  'react-dom': '19.0.0',
  'lucide-react': '0.468.0',
};

export const STANDARD_DEV_DEPS = {
  '@types/node': '22.0.0',
  '@types/react': '19.0.0',
  '@types/react-dom': '19.0.0',
  typescript: '5.7.2',
  tailwindcss: '4.0.17',
  '@tailwindcss/postcss': '4.0.17',
  postcss: '8.5.0',
};

// 의존성 세트 — placeholder name으로 생성, 런타임(makePackageLock)에 name 주입
export const VARIANTS = {
  standard: {
    dependencies: { ...STANDARD_DEPS },
    devDependencies: { ...STANDARD_DEV_DEPS },
  },
  namecard: {
    dependencies: { ...STANDARD_DEPS, 'qrcode.react': '4.2.0' },
    devDependencies: { ...STANDARD_DEV_DEPS },
  },
};

/** lockfile 생성/검증에 쓰는 정규 package.json (name은 'linkmap-template' 고정) */
export function buildPackageJson(variant) {
  return {
    name: 'linkmap-template',
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: VARIANTS[variant].dependencies,
    devDependencies: VARIANTS[variant].devDependencies,
  };
}
