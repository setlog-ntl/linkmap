/**
 * 내 GitHub repo 연결(트랙 B) — 저장소가 정적 배포 가능한지 판정한다.
 *
 * 판정 결과는 동의 화면이 "무엇이 일어나는지"를 정확히 보여주는 근거가 되고,
 * 배포 라우트가 서버에서 같은 판정을 다시 수행한다(클라이언트 결과를 신뢰하지 않는다).
 */
import { getRepo, getGitTreeRecursive, getGitHubPagesStatus, getFileContent, GitHubApiError } from '@/lib/github/api';
import { isSafeWorkflowValue, IMPORT_WORKFLOW_PATH } from './static-workflow';
import {
  detectFramework,
  looksLikeBuildProject,
  type BuildDetection,
  type FrameworkId,
  type PackageJsonLike,
} from './framework-detect';

/** index.html을 찾을 후보 디렉토리 — 앞쪽이 우선한다 */
const PUBLISH_DIR_CANDIDATES = ['', 'docs', 'dist', 'build', 'public', 'out'];

export type RepoBlockReason =
  | 'not_admin'
  | 'empty_repo'
  | 'no_html'
  | 'unsafe_path';

/** 배포 방식 — 완성된 정적 파일을 그대로 올릴지, 빌드해서 올릴지 */
export type DeployMode = 'static' | 'build';

export interface RepoAnalysis {
  owner: string;
  repo: string;
  full_name: string;
  default_branch: string;
  is_private: boolean;
  is_fork: boolean;
  /** KB 단위 — Pages 소프트 리밋(1GB) 경고 판단용 */
  size_kb: number;
  /** 배포 가능 여부. false면 block_reason이 채워진다 */
  deployable: boolean;
  block_reason: RepoBlockReason | null;
  /** upload-pages-artifact의 path — '.'는 저장소 루트 */
  publish_dir: string;
  /** 다른 후보가 더 있으면 사용자가 바꿀 수 있게 노출 */
  publish_dir_candidates: string[];
  /** 이미 Pages가 켜져 있는가 */
  pages_enabled: boolean;
  /** Actions 방식이 아니라 브랜치 빌드로 켜져 있으면 전환이 필요하다 */
  needs_build_type_switch: boolean;
  /** 이미 Linkmap 워크플로우가 있으면 커밋 없이 연결만 한다 */
  can_link_only: boolean;
  /** 완성된 파일을 그대로 올릴지, 빌드해서 올릴지 */
  deploy_mode: DeployMode;
  /** deploy_mode가 'build'일 때만 채워진다 */
  build: BuildDetection | null;
  warnings: string[];
}

/** 트리에서 index.html이 있는 첫 후보 디렉토리를 찾는다 */
function findPublishDirs(paths: Set<string>): string[] {
  return PUBLISH_DIR_CANDIDATES.filter((dir) =>
    paths.has(dir === '' ? 'index.html' : `${dir}/index.html`),
  );
}

/** upload-pages-artifact가 받는 형태로 변환 ('' → '.') */
export function toArtifactPath(dir: string): string {
  return dir === '' ? '.' : dir;
}

export type ModeDecision =
  | { mode: 'static'; publishDirs: string[] }
  | { mode: 'build' }
  | { mode: 'blocked'; reason: 'no_html' };

/**
 * 그대로 올릴지 빌드할지 정한다.
 *
 * 까다로운 지점: Vite·CRA 같은 프로젝트는 **저장소 루트에 index.html이 있다**. 그건 완성된
 * 페이지가 아니라 빌드 입력 템플릿이라(`/src/main.js`를 참조) 그대로 올리면 빈 화면이 된다.
 * 그래서 "루트에만 index.html이 있고 프레임워크가 감지되면" 빌드로 본다.
 *
 * 반대로 `docs/`·`dist/` 같은 게시 폴더에 index.html이 있으면 그건 사용자가 커밋해 둔
 * 빌드 결과물이므로 그대로 올린다 — 프레임워크가 감지되더라도 재빌드하지 않는다.
 */
export function decideDeployMode(
  publishDirs: string[],
  paths: Set<string>,
  framework: FrameworkId | null,
): ModeDecision {
  const hasOnlyRootIndex = publishDirs.length === 1 && publishDirs[0] === '';
  const buildable = looksLikeBuildProject(paths);

  // 게시 폴더에 이미 결과물이 있으면 그것을 쓴다
  if (publishDirs.length > 0 && !hasOnlyRootIndex) {
    return { mode: 'static', publishDirs };
  }

  // 루트 index.html뿐 — 프레임워크가 확실하면 그건 템플릿이다
  if (hasOnlyRootIndex) {
    const isRealFramework = framework !== null && framework !== 'generic';
    return isRealFramework ? { mode: 'build' } : { mode: 'static', publishDirs };
  }

  return buildable ? { mode: 'build' } : { mode: 'blocked', reason: 'no_html' };
}

export async function analyzeRepo(
  token: string,
  owner: string,
  repo: string,
): Promise<RepoAnalysis> {
  const repoInfo = await getRepo(token, owner, repo);
  const warnings: string[] = [];

  const base = {
    owner: repoInfo.owner.login,
    repo: repoInfo.name,
    full_name: repoInfo.full_name,
    default_branch: repoInfo.default_branch,
    is_private: repoInfo.private,
    is_fork: repoInfo.fork ?? false,
    size_kb: repoInfo.size ?? 0,
    publish_dir: '.',
    publish_dir_candidates: [] as string[],
    pages_enabled: false,
    needs_build_type_switch: false,
    can_link_only: false,
    deploy_mode: 'static' as DeployMode,
    build: null as BuildDetection | null,
    warnings,
  };

  // Pages 활성화에는 admin 권한이 필요하다 — 다른 검사보다 먼저 거른다
  if (!repoInfo.permissions?.admin) {
    return { ...base, deployable: false, block_reason: 'not_admin' };
  }

  // 브랜치명이 YAML에 들어가므로 안전한 형태인지 확인 (비정상 브랜치명 방어)
  if (!isSafeWorkflowValue(repoInfo.default_branch)) {
    return { ...base, deployable: false, block_reason: 'unsafe_path' };
  }

  const tree = await getGitTreeRecursive(token, owner, repo, repoInfo.default_branch);
  if (tree.length === 0) {
    return { ...base, deployable: false, block_reason: 'empty_repo' };
  }

  const paths = new Set(tree.map((t) => t.path));
  const publishDirs = findPublishDirs(paths);

  // 빌드가 필요한지 판정한다 (Phase 2). 빌드 산출물은 저장소에 없는 것이 정상이므로
  // "완성된 index.html이 없다"는 이유로 차단하면 대부분의 실제 프로젝트를 막게 된다.
  // package.json은 프레임워크 추정에 필요할 때만 읽는다.
  let candidate: BuildDetection | null = null;
  const needsFrameworkCheck =
    publishDirs.length === 0 || (publishDirs.length === 1 && publishDirs[0] === '');
  if (needsFrameworkCheck && looksLikeBuildProject(paths)) {
    const pkg = await readPackageJson(token, owner, repo);
    candidate = detectFramework(paths, pkg, repoInfo.name);
  }

  const decision = decideDeployMode(publishDirs, paths, candidate?.framework ?? null);
  if (decision.mode === 'blocked') {
    return { ...base, deployable: false, block_reason: decision.reason };
  }

  const buildDetection = decision.mode === 'build' ? candidate : null;
  if (decision.mode === 'build' && !buildDetection) {
    return { ...base, deployable: false, block_reason: 'no_html' };
  }
  if (buildDetection && !isSafeWorkflowValue(buildDetection.outDir)) {
    return { ...base, deployable: false, block_reason: 'unsafe_path' };
  }

  if (repoInfo.size && repoInfo.size > 1_000_000) {
    warnings.push('저장소가 1GB를 넘어 GitHub Pages 제한에 걸릴 수 있어요.');
  }
  if (repoInfo.private) {
    warnings.push('비공개 저장소는 GitHub 유료 플랜에서만 Pages를 쓸 수 있어요.');
  }
  if (repoInfo.fork) {
    warnings.push('포크한 저장소라 GitHub Actions를 함께 활성화합니다.');
  }

  // Pages 현재 상태 — 404는 "아직 안 켜짐"이라는 정상 응답이다
  let pagesEnabled = false;
  let needsSwitch = false;
  try {
    const pages = await getGitHubPagesStatus(token, owner, repo);
    pagesEnabled = true;
    // build_type이 응답에 없으면 브랜치 빌드(legacy)로 간주해 전환한다
    const buildType = (pages as unknown as { build_type?: string }).build_type;
    needsSwitch = buildType !== 'workflow';
  } catch (err) {
    if (!(err instanceof GitHubApiError && err.status === 404)) throw err;
  }

  // 우리가 넣을 워크플로우가 이미 있으면 커밋 없이 연결만 한다
  const canLinkOnly = pagesEnabled && !needsSwitch && paths.has(IMPORT_WORKFLOW_PATH);

  if (buildDetection) warnings.push(...buildDetection.warnings);

  return {
    ...base,
    deployable: true,
    block_reason: null,
    publish_dir: buildDetection
      ? buildDetection.outDir
      : toArtifactPath(decision.mode === 'static' ? decision.publishDirs[0] : ''),
    publish_dir_candidates: buildDetection
      ? buildDetection.outDirCandidates
      : (decision.mode === 'static' ? decision.publishDirs : []).map(toArtifactPath),
    pages_enabled: pagesEnabled,
    needs_build_type_switch: needsSwitch,
    can_link_only: canLinkOnly,
    deploy_mode: buildDetection ? 'build' : 'static',
    build: buildDetection,
    warnings,
  };
}

/** package.json을 읽어온다 — 없거나 깨져 있으면 null (감지는 파일 목록만으로도 동작한다) */
async function readPackageJson(
  token: string,
  owner: string,
  repo: string,
): Promise<PackageJsonLike | null> {
  try {
    const file = await getFileContent(token, owner, repo, 'package.json');
    const text = Buffer.from(file.content ?? '', 'base64').toString('utf-8');
    return JSON.parse(text) as PackageJsonLike;
  } catch {
    return null;
  }
}

/** 배포 불가 사유를 바이브코더 눈높이 안내로 바꾼다 */
export function blockReasonMessage(reason: RepoBlockReason): string {
  switch (reason) {
    case 'not_admin':
      return '이 저장소의 관리자 권한이 없어 GitHub Pages를 켤 수 없어요. 본인 소유 저장소를 선택해주세요.';
    case 'empty_repo':
      return '저장소가 비어 있어요. 파일을 먼저 올린 뒤에 다시 시도해주세요.';
    case 'no_html':
      return 'index.html을 찾지 못했어요. 저장소 루트나 docs·dist·build 폴더에 index.html이 있거나, 빌드로 만들어내는 프로젝트여야 해요.';
    case 'unsafe_path':
      return '저장소의 기본 브랜치 이름을 사용할 수 없어요.';
  }
}
