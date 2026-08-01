/**
 * 사용자 자료 배포(트랙 A)용 GitHub Pages 워크플로우.
 *
 * 템플릿 배포의 `sharedDeployYml`은 npm ci + next build 전제라 정적 파일 배포에 쓸 수 없다.
 * 이 워크플로우는 빌드 없이 레포 루트를 그대로 Pages 아티팩트로 업로드한다.
 * (upload-pages-artifact 방식은 Jekyll 처리를 거치지 않으므로 `.nojekyll` 주입이 불필요)
 *
 * 보안: 사용자 입력이 이 YAML에 보간되는 지점이 하나도 없다 — 전체가 서버 상수다.
 * 업로드된 파일 중 `.github/` 하위는 upload-sanitizer가 전량 드랍하고 이 파일만 주입한다.
 *
 * 파일명을 템플릿과 동일한 `deploy.yml`로 유지해야 기존 redeploy 라우트
 * (`triggerWorkflowDispatch` 기본값)와 상태 추적이 수정 없이 동작한다.
 */
export const STATIC_WORKFLOW_PATH = '.github/workflows/deploy.yml';

/**
 * 트랙 B(내 GitHub repo 연결) 전용 워크플로우 파일명.
 *
 * 사용자 저장소에는 이미 `deploy.yml`이 있을 수 있으므로 이름을 분리해 충돌을 원천 차단한다.
 * "Linkmap이 넣은 파일"이라는 소유권이 파일명으로 자명해져, 롤백·연결 해제 시
 * 무엇을 지워야 하는지도 명확해진다. 실제 파일명은 config_data.workflow_file에 기록한다.
 */
export const IMPORT_WORKFLOW_PATH = '.github/workflows/linkmap-pages.yml';
export const IMPORT_WORKFLOW_FILE = 'linkmap-pages.yml';

/**
 * 가져온 저장소용 워크플로우.
 *
 * publish_dir과 branch는 분석 결과에서 오지만 사용자가 자유 입력하는 값이 아니다 —
 * 저장소에 실제로 존재하는 디렉토리·브랜치 중에서만 고를 수 있고, 아래에서 한 번 더
 * 화이트리스트로 검증한 뒤에만 YAML에 들어간다 (임의 문자열 보간 금지).
 */
/**
 * 우리가 만든 워크플로우임을 식별하는 표식.
 * 같은 경로에 사용자가 직접 만든 파일이 있을 수 있으므로, 덮어쓰거나 지우기 전에 이걸로 확인한다.
 */
export const IMPORT_WORKFLOW_MARKER = 'Deploy to GitHub Pages (Linkmap)';

export function isLinkmapWorkflow(content: string): boolean {
  return content.includes(IMPORT_WORKFLOW_MARKER);
}

export function buildImportWorkflowYml(publishDir: string, branch: string): string {
  if (!isSafeWorkflowValue(publishDir) || !isSafeWorkflowValue(branch)) {
    throw new Error('워크플로우에 사용할 수 없는 경로·브랜치입니다');
  }
  return `name: Deploy to GitHub Pages (Linkmap)
on:
  push:
    branches: [${branch}]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ${publishDir}
      - id: deployment
        uses: actions/deploy-pages@v4
`;
}

/**
 * YAML에 들어갈 수 있는 값인지 검사한다.
 * 따옴표·개행·YAML 메타문자를 전부 배제해 문자열 이스케이프 문제 자체를 없앤다.
 */
export function isSafeWorkflowValue(value: string): boolean {
  if (!value || value.length > 100) return false;
  return /^[A-Za-z0-9._\-/]+$/.test(value) && !value.includes('..');
}

/**
 * 워크플로우에 넣을 수 있는 명령인지 검사한다.
 *
 * 명령은 우리가 만든 값(framework-detect)만 오지만, 저장소 이름이 `--base=/name/`처럼
 * 섞여 들어오므로 한 번 더 확인한다. 셸 메타문자를 배제해 명령 연결·치환을 원천 차단한다.
 */
export function isSafeWorkflowCommand(value: string): boolean {
  if (!value || value.length > 200) return false;
  return /^[A-Za-z0-9 ._\-/=]+$/.test(value) && !value.includes('..');
}

/** Actions 러너의 Node 버전 — 최신 LTS 계열로 고정 */
const BUILD_NODE_VERSION = '20';

/**
 * 빌드가 필요한 프로젝트용 워크플로우 (Phase 2).
 *
 * 정적 워크플로우와의 차이는 install·build 두 단계뿐이다. 사용자의 설정 파일은 읽지도
 * 고치지도 않고, 저장소에 이미 있는 스크립트를 그대로 실행한다.
 *
 * 하위 경로(`/<repo>/`) 문제를 위해 널리 통용되는 환경변수를 함께 넘긴다.
 * 존중 여부는 프레임워크마다 다르므로(CRA의 PUBLIC_URL 등) 이것만으로 해결됐다고
 * 보지 않고, 위험도는 동의 화면에서 따로 알린다.
 */
export function buildBuildWorkflowYml(opts: {
  outDir: string;
  branch: string;
  installCommand: string;
  buildCommand: string;
  repoName: string;
}): string {
  const { outDir, branch, installCommand, buildCommand, repoName } = opts;
  if (!isSafeWorkflowValue(outDir) || !isSafeWorkflowValue(branch) || !isSafeWorkflowValue(repoName)) {
    throw new Error('워크플로우에 사용할 수 없는 경로·브랜치입니다');
  }
  if (!isSafeWorkflowCommand(installCommand) || !isSafeWorkflowCommand(buildCommand)) {
    throw new Error('워크플로우에 사용할 수 없는 명령입니다');
  }

  return `name: Deploy to GitHub Pages (Linkmap)
on:
  push:
    branches: [${branch}]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '${BUILD_NODE_VERSION}'
      - run: ${installCommand}
      - run: ${buildCommand}
        env:
          PUBLIC_URL: /${repoName}
          BASE_PATH: /${repoName}
          BASE_URL: /${repoName}
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ${outDir}
      - id: deployment
        uses: actions/deploy-pages@v4
`;
}

export const staticDeployYml = `name: Deploy static site to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
`;
