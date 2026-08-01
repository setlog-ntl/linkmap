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
