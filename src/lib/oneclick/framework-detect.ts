/**
 * 빌드가 필요한 프로젝트 감지 (Phase 2).
 *
 * 저장소 파일 목록과 package.json만으로 "무엇으로 만들었고, 빌드하면 어디에 나오는지"를
 * 추정한다. 설정 파일을 열어 파싱하지는 않는다 — 사용자 저장소를 읽는 범위를 최소로 두고,
 * 확신이 낮으면 후보를 여러 개 제시해 사용자가 고르게 하는 편이 안전하다.
 *
 * 중요한 한계(basePath): GitHub Pages는 사이트를 `/<저장소이름>/` 하위 경로로 서비스한다.
 * 대부분의 번들러는 자산 경로를 `/`부터 쓰도록 기본 설정돼 있어, 그대로 빌드하면
 * 화면은 뜨는데 CSS·JS가 404가 된다. 우리는 사용자 설정 파일을 고치지 않는다는 원칙이
 * 있으므로, 고칠 수 없는 경우에는 숨기지 않고 배포 전에 경고한다.
 */

export type FrameworkId =
  | 'vite'
  | 'next'
  | 'astro'
  | 'sveltekit'
  | 'nuxt'
  | 'gatsby'
  | 'cra'
  | 'generic';

export type BasePathRisk = 'none' | 'likely' | 'certain';

export interface PackageJsonLike {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface BuildDetection {
  framework: FrameworkId;
  /** 사용자에게 보여줄 이름 */
  label: string;
  /** 빌드 산출물이 나올 것으로 보이는 디렉토리 */
  outDir: string;
  /** 확신이 낮을 때의 대안들 (사용자가 고를 수 있게) */
  outDirCandidates: string[];
  /** package-lock.json 유무에 따라 결정 */
  installCommand: 'npm ci' | 'npm install';
  buildCommand: string;
  basePathRisk: BasePathRisk;
  warnings: string[];
}

const CONFIG_MARKERS: { files: string[]; framework: FrameworkId }[] = [
  { files: ['next.config.js', 'next.config.mjs', 'next.config.ts'], framework: 'next' },
  { files: ['astro.config.mjs', 'astro.config.js', 'astro.config.ts'], framework: 'astro' },
  { files: ['nuxt.config.js', 'nuxt.config.ts'], framework: 'nuxt' },
  { files: ['svelte.config.js', 'svelte.config.ts'], framework: 'sveltekit' },
  { files: ['gatsby-config.js', 'gatsby-config.ts'], framework: 'gatsby' },
  { files: ['vite.config.js', 'vite.config.ts', 'vite.config.mjs'], framework: 'vite' },
];

/** 프레임워크별 기본 산출물 위치 — 앞이 가장 유력한 후보 */
const OUT_DIRS: Record<FrameworkId, string[]> = {
  next: ['out'],
  astro: ['dist'],
  nuxt: ['.output/public', 'dist'],
  sveltekit: ['build'],
  gatsby: ['public'],
  vite: ['dist'],
  cra: ['build'],
  generic: ['dist', 'build', 'public', 'out'],
};

const LABELS: Record<FrameworkId, string> = {
  next: 'Next.js',
  astro: 'Astro',
  nuxt: 'Nuxt',
  sveltekit: 'SvelteKit',
  gatsby: 'Gatsby',
  vite: 'Vite',
  cra: 'Create React App',
  generic: 'Node 프로젝트',
};

/**
 * 하위 경로 배포에서 자산이 깨질 위험도.
 * - certain: 설정을 고치지 않으면 거의 확실히 깨진다
 * - likely: 설정에 따라 다르다
 * - none: 상대 경로로 나오거나 우리가 환경변수로 넘겨줄 수 있다
 */
const BASE_PATH_RISK: Record<FrameworkId, BasePathRisk> = {
  next: 'certain',   // basePath/assetPrefix는 next.config에만 설정 가능
  gatsby: 'certain', // pathPrefix + --prefix-paths 필요
  nuxt: 'certain',   // app.baseURL
  sveltekit: 'likely',
  astro: 'likely',   // config의 base
  vite: 'likely',    // config의 base (빌드 스크립트가 순수 vite면 우리가 넘길 수 있다)
  cra: 'none',       // PUBLIC_URL 환경변수를 존중한다
  generic: 'likely',
};

function has(paths: Set<string>, file: string): boolean {
  return paths.has(file);
}

function depNames(pkg: PackageJsonLike | null): Set<string> {
  return new Set([
    ...Object.keys(pkg?.dependencies ?? {}),
    ...Object.keys(pkg?.devDependencies ?? {}),
  ]);
}

/**
 * 빌드 스크립트가 순수 `vite build`인지 — 이때만 `--base`를 안전하게 덧붙일 수 있다.
 * 사용자가 직접 조립한 스크립트에 플래그를 끼워 넣으면 의도를 바꿀 수 있으므로 하지 않는다.
 */
export function canInjectViteBase(pkg: PackageJsonLike | null): boolean {
  const build = pkg?.scripts?.build?.trim();
  return build === 'vite build' || build === 'npx vite build';
}

/** 저장소에 빌드가 필요한 표식이 있는가 */
export function looksLikeBuildProject(paths: Set<string>): boolean {
  if (has(paths, 'package.json')) return true;
  return CONFIG_MARKERS.some((m) => m.files.some((f) => has(paths, f)));
}

export function detectFramework(
  paths: Set<string>,
  pkg: PackageJsonLike | null,
  repoName: string,
): BuildDetection {
  const deps = depNames(pkg);
  const warnings: string[] = [];

  // 설정 파일이 가장 확실한 신호다. 없으면 의존성으로 추정한다.
  const framework: FrameworkId =
    CONFIG_MARKERS.find((m) => m.files.some((f) => has(paths, f)))?.framework ??
    (deps.has('react-scripts')
      ? 'cra'
      : deps.has('next')
        ? 'next'
        : deps.has('vite')
          ? 'vite'
          : deps.has('astro')
            ? 'astro'
            : 'generic');

  // Next는 정적 배포가 되려면 output: 'export'가 있어야 하는데 설정 파일을 파싱하지 않는다.
  // 빌드가 성공해도 out/이 안 나올 수 있으므로 미리 알린다.
  if (framework === 'next') {
    warnings.push(
      "Next.js는 next.config에 output: 'export'가 있어야 정적 배포가 됩니다. 없으면 빌드는 되어도 게시할 파일이 만들어지지 않아요.",
    );
  }

  const buildScript = pkg?.scripts?.build;
  if (!buildScript) {
    warnings.push('package.json에 build 스크립트가 없어 기본 명령으로 시도합니다.');
  }

  const basePathRisk = BASE_PATH_RISK[framework];
  if (basePathRisk === 'certain') {
    warnings.push(
      `이 사이트는 주소 뒤에 /${repoName} 가 붙는 곳에 게시됩니다. ${LABELS[framework]}는 설정 파일에서 기준 경로를 지정해야 해서, 그대로 배포하면 화면은 떠도 디자인이 깨질 수 있어요.`,
    );
  } else if (basePathRisk === 'likely' && !(framework === 'vite' && canInjectViteBase(pkg))) {
    warnings.push(
      `주소 뒤에 /${repoName} 가 붙어서, 설정에 기준 경로가 없으면 디자인이 깨질 수 있어요.`,
    );
  }

  const candidates = OUT_DIRS[framework];

  return {
    framework,
    label: LABELS[framework],
    outDir: candidates[0],
    outDirCandidates: candidates,
    installCommand: has(paths, 'package-lock.json') ? 'npm ci' : 'npm install',
    buildCommand:
      framework === 'vite' && canInjectViteBase(pkg)
        ? `npx vite build --base=/${repoName}/`
        : 'npm run build',
    basePathRisk,
    warnings,
  };
}
