import type { ServiceGuideSeed } from './service-guides';

// Service ID constants for Batch 5B
const S = {
  launchdarkly: '10000000-0000-4000-a000-000000000036',
  notion_api:   '10000000-0000-4000-a000-000000000071',
  linear_api:   '10000000-0000-4000-a000-000000000072',
  mapbox:       '10000000-0000-4000-a000-000000000043',
  playwright:   '10000000-0000-4000-a000-000000000040',
  cypress:      '10000000-0000-4000-a000-000000000048',
  vitest:       '10000000-0000-4000-a000-000000000083',
  storybook:    '10000000-0000-4000-a000-000000000084',
  trigger_dev:  '10000000-0000-4000-a000-000000000035',
  inngest:      '10000000-0000-4000-a000-000000000045',
  bullmq:       '10000000-0000-4000-a000-000000000049',
  shopify_api:  '10000000-0000-4000-a000-000000000050',
  github:       '10000000-0000-4000-a000-000000000051',
};

export const serviceGuidesBatch5b: ServiceGuideSeed[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. LaunchDarkly
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.launchdarkly,
    quick_start: 'LaunchDarkly SDK를 설치하고 SDK 키를 설정하면 코드 배포 없이 기능 플래그로 기능을 점진적으로 출시할 수 있습니다.',
    quick_start_en: 'Install the LaunchDarkly SDK and configure your SDK key to gradually roll out features using feature flags without redeployment.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Node.js server SDK',
        title_ko: 'Node.js 서버 SDK 설치',
        description: 'Install the LaunchDarkly server-side SDK for Node.js',
        description_ko: 'LaunchDarkly Node.js 서버 사이드 SDK 설치',
        code_snippet: 'npm install @launchdarkly/node-server-sdk',
      },
      {
        step: 2,
        title: 'Initialize LDClient',
        title_ko: 'LDClient 초기화',
        description: 'Initialize the client with your SDK key and wait for it to be ready',
        description_ko: 'SDK 키로 클라이언트를 초기화하고 준비 상태를 대기',
        code_snippet: `import { init } from '@launchdarkly/node-server-sdk'

const client = init(process.env.LAUNCHDARKLY_SDK_KEY!)
await client.waitForInitialization()`,
      },
      {
        step: 3,
        title: 'Evaluate a feature flag',
        title_ko: '기능 플래그 평가',
        description: 'Evaluate a flag for a specific user context',
        description_ko: '사용자 컨텍스트에 대한 플래그 평가',
        code_snippet: `const context = { kind: 'user', key: user.id, email: user.email }
const showNewFeature = await client.variation('new-feature-flag', context, false)

if (showNewFeature) {
  // 새 기능 코드
}`,
      },
    ],
    code_examples: {
      typescript: `import { init } from '@launchdarkly/node-server-sdk'

const client = init(process.env.LAUNCHDARKLY_SDK_KEY!)
await client.waitForInitialization()

const context = { kind: 'user', key: 'user-123', email: 'user@example.com' }

// Boolean flag
const enabled = await client.variation('my-feature', context, false)

// String flag (A/B test variant)
const variant = await client.variation('button-color', context, 'blue')

// Number flag (rollout percentage)
const limit = await client.variation('api-rate-limit', context, 100)

// Cleanup on shutdown
await client.close()`,
    },
    common_pitfalls: [
      {
        title: 'Client not initialized before use',
        title_ko: '클라이언트 미초기화 사용',
        problem: 'Calling variation() before waitForInitialization() resolves returns the default value',
        solution: 'Always await waitForInitialization() at app startup, or use the ready event',
        code: `// Wrong
const client = init(sdkKey)
const flag = await client.variation('flag', ctx, false) // 기본값 반환 가능

// Correct
const client = init(sdkKey)
await client.waitForInitialization()
const flag = await client.variation('flag', ctx, false)`,
      },
      {
        title: 'Creating a new client per request',
        title_ko: '요청마다 새 클라이언트 생성',
        problem: 'Instantiating LDClient on every request causes excessive connections and slow flag evaluation',
        solution: 'Initialize LDClient once at app startup and reuse the singleton instance',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Store LAUNCHDARKLY_SDK_KEY in Vercel environment variables. Use Edge Config for even faster flag reads on Vercel Edge.',
        tip_ko: 'LAUNCHDARKLY_SDK_KEY를 Vercel 환경변수에 저장하세요. Vercel Edge에서는 Edge Config로 더 빠른 플래그 읽기가 가능합니다.',
      },
      {
        with_service_slug: 'github-actions',
        tip: 'Use LaunchDarkly GitHub Actions integration to automatically disable feature flags when a deployment fails in CI/CD.',
        tip_ko: 'LaunchDarkly GitHub Actions 통합으로 CI/CD 배포 실패 시 기능 플래그를 자동으로 비활성화할 수 있습니다.',
      },
    ],
    pros: [
      { text: 'Instant rollback without redeployment via flag toggle', text_ko: '플래그 토글만으로 재배포 없는 즉시 롤백' },
      { text: 'Granular targeting rules (user segment, percentage rollout)', text_ko: '사용자 세그먼트·비율 출시 등 세밀한 타겟팅' },
      { text: 'SDKs for 20+ languages and client/server environments', text_ko: '20개 이상 언어, 클라이언트/서버 환경 SDK 지원' },
    ],
    cons: [
      { text: 'Paid plans required for advanced targeting and experimentation', text_ko: '고급 타겟팅·실험 기능은 유료 플랜 필요' },
      { text: 'External dependency in critical code paths if not cached', text_ko: '캐시 없으면 핵심 코드 경로에 외부 의존성 추가' },
    ],
    api_key_url: 'https://app.launchdarkly.com/settings/projects',
    api_key_url_label: 'LaunchDarkly Project Settings',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Notion API
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.notion_api,
    quick_start: 'Notion 통합을 생성하고 @notionhq/client SDK로 데이터베이스를 읽고 쓰며 Notion을 CMS나 지식 베이스로 활용할 수 있습니다.',
    quick_start_en: 'Create a Notion integration and use the @notionhq/client SDK to read and write databases, turning Notion into a CMS or knowledge base.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Notion SDK',
        title_ko: 'Notion SDK 설치',
        description: 'Install the official Notion JavaScript client',
        description_ko: '공식 Notion JS 클라이언트 설치',
        code_snippet: 'npm install @notionhq/client',
      },
      {
        step: 2,
        title: 'Create integration and get token',
        title_ko: '통합 생성 및 토큰 발급',
        description: 'Create an internal integration at notion.so/my-integrations and copy the secret token',
        description_ko: 'notion.so/my-integrations에서 내부 통합 생성 후 시크릿 토큰 복사',
        code_snippet: 'NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      },
      {
        step: 3,
        title: 'Query a database',
        title_ko: '데이터베이스 조회',
        description: 'Initialize the client and query a Notion database (share the DB with your integration first)',
        description_ko: '클라이언트 초기화 후 Notion 데이터베이스 조회 (먼저 통합에 DB 공유 필요)',
        code_snippet: `import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID!,
})`,
      },
    ],
    code_examples: {
      typescript: `import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

// 데이터베이스 조회
const pages = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID!,
  filter: { property: 'Status', select: { equals: 'Published' } },
  sorts: [{ property: 'Created', direction: 'descending' }],
})

// 페이지 생성
await notion.pages.create({
  parent: { database_id: process.env.NOTION_DATABASE_ID! },
  properties: {
    Name: { title: [{ text: { content: 'New Page' } }] },
    Status: { select: { name: 'Draft' } },
  },
})

// 블록 콘텐츠 읽기
const blocks = await notion.blocks.children.list({ block_id: 'PAGE_ID' })`,
    },
    common_pitfalls: [
      {
        title: 'Integration not shared with database',
        title_ko: '통합이 데이터베이스에 공유되지 않음',
        problem: 'API returns "Could not find database" even with correct DB ID',
        solution: 'Open the database in Notion → "..." menu → Connections → add your integration',
      },
      {
        title: 'Rich text property structure',
        title_ko: '리치 텍스트 속성 구조 오류',
        problem: 'Title and rich text properties require nested array structure, not plain strings',
        solution: 'Always wrap text content in the rich_text array format',
        code: `// Wrong
properties: { Name: 'My Title' }

// Correct
properties: {
  Name: { title: [{ text: { content: 'My Title' } }] }
}`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Use Notion as a headless CMS: query pages at build time with Next.js ISR and revalidate on Notion page updates via webhooks.',
        tip_ko: 'Notion을 헤드리스 CMS로 활용하세요: Next.js ISR로 빌드 시 페이지를 조회하고, Notion 업데이트 시 웹훅으로 재검증합니다.',
      },
    ],
    pros: [
      { text: 'Non-technical team members can manage content without code changes', text_ko: '비기술 팀원도 코드 변경 없이 콘텐츠 관리 가능' },
      { text: 'Structured database with filters, sorts, and relations', text_ko: '필터·정렬·관계형 구조의 데이터베이스' },
      { text: 'Official SDK with TypeScript support', text_ko: 'TypeScript 지원 공식 SDK 제공' },
    ],
    cons: [
      { text: 'API rate limit: 3 requests/second per integration', text_ko: 'API 속도 제한: 통합당 초당 3회' },
      { text: 'No real-time webhooks for database changes (polling required)', text_ko: 'DB 변경 실시간 웹훅 없음 (폴링 필요)' },
    ],
    api_key_url: 'https://www.notion.so/my-integrations',
    api_key_url_label: 'Notion Integrations',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Linear API
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.linear_api,
    quick_start: 'Linear API 키를 발급받고 @linear/sdk로 이슈·프로젝트를 프로그래밍 방식으로 생성·조회·업데이트할 수 있습니다.',
    quick_start_en: 'Get a Linear API key and use @linear/sdk to programmatically create, read, and update issues and projects.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Linear SDK',
        title_ko: 'Linear SDK 설치',
        description: 'Install the official Linear TypeScript SDK',
        description_ko: '공식 Linear TypeScript SDK 설치',
        code_snippet: 'npm install @linear/sdk',
      },
      {
        step: 2,
        title: 'Initialize LinearClient',
        title_ko: 'LinearClient 초기화',
        description: 'Create a client with your personal API key from Linear Settings → API',
        description_ko: 'Linear 설정 → API에서 개인 API 키로 클라이언트 생성',
        code_snippet: `import { LinearClient } from '@linear/sdk'

const linear = new LinearClient({ apiKey: process.env.LINEAR_API_KEY })`,
      },
      {
        step: 3,
        title: 'Fetch issues',
        title_ko: '이슈 조회',
        description: 'Fetch your assigned issues or search across the team',
        description_ko: '담당 이슈 또는 팀 이슈 검색',
        code_snippet: `const me = await linear.viewer
const issues = await me.assignedIssues({ first: 20 })
issues.nodes.forEach(issue => console.log(issue.title, issue.state))`,
      },
    ],
    code_examples: {
      typescript: `import { LinearClient } from '@linear/sdk'

const linear = new LinearClient({ apiKey: process.env.LINEAR_API_KEY })

// 이슈 생성
const { issue } = await linear.createIssue({
  teamId: 'TEAM_ID',
  title: 'Fix login bug',
  description: 'Users cannot log in with Google OAuth',
  priority: 1, // 0=None, 1=Urgent, 2=High, 3=Medium, 4=Low
})

// 이슈 상태 업데이트
await linear.updateIssue(issue!.id, { stateId: 'IN_PROGRESS_STATE_ID' })

// 팀 이슈 검색
const results = await linear.issues({
  filter: { team: { key: { eq: 'ENG' } }, priority: { gte: 2 } },
})`,
    },
    common_pitfalls: [
      {
        title: 'Team ID vs Team Key confusion',
        title_ko: 'Team ID와 Team Key 혼동',
        problem: 'createIssue requires teamId (UUID), not the short team key like "ENG"',
        solution: 'Fetch team.id first: const teams = await linear.teams(); use teams.nodes[0].id',
      },
      {
        title: 'Webhook signature not verified',
        title_ko: '웹훅 서명 미검증',
        problem: 'Processing Linear webhook events without verifying the signature exposes security risk',
        solution: 'Verify LINEAR_WEBHOOK_SECRET against the X-Linear-Signature header on every webhook request',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'github',
        tip: 'Use Linear-GitHub sync to automatically link pull requests to issues and update issue status when PRs are merged.',
        tip_ko: 'Linear-GitHub 동기화로 PR을 이슈에 자동 연결하고 PR 병합 시 이슈 상태를 자동 업데이트합니다.',
      },
    ],
    pros: [
      { text: 'Fully typed GraphQL SDK with autocomplete', text_ko: '자동완성 지원 완전 타입 GraphQL SDK' },
      { text: 'Fast and keyboard-driven issue management', text_ko: '빠르고 키보드 중심의 이슈 관리' },
      { text: 'Native GitHub, Slack, Figma integrations', text_ko: 'GitHub, Slack, Figma 네이티브 통합' },
    ],
    cons: [
      { text: 'No free plan for teams above 1 member', text_ko: '1인 초과 팀에는 무료 플랜 없음' },
      { text: 'GraphQL API requires learning query structure', text_ko: 'GraphQL API 쿼리 구조 학습 필요' },
    ],
    api_key_url: 'https://linear.app/settings/api',
    api_key_url_label: 'Linear API Settings',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Mapbox
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.mapbox,
    quick_start: 'Mapbox 액세스 토큰을 발급받고 mapbox-gl npm 패키지로 인터랙티브 3D 지도를 웹앱에 5분 내에 임베드할 수 있습니다.',
    quick_start_en: 'Get a Mapbox access token and embed an interactive 3D map in your web app within 5 minutes using the mapbox-gl npm package.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Mapbox GL JS',
        title_ko: 'Mapbox GL JS 설치',
        description: 'Install the Mapbox GL JS library (WebGL 2 required)',
        description_ko: 'Mapbox GL JS 라이브러리 설치 (WebGL 2 필요)',
        code_snippet: 'npm install mapbox-gl',
      },
      {
        step: 2,
        title: 'Set access token',
        title_ko: '액세스 토큰 설정',
        description: 'Add your public Mapbox token to environment variables',
        description_ko: '공개 Mapbox 토큰을 환경변수에 추가',
        code_snippet: 'NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoixxxxxx',
      },
      {
        step: 3,
        title: 'Render a map',
        title_ko: '지도 렌더링',
        description: 'Initialize a map in a container element (Next.js: use dynamic import with ssr:false)',
        description_ko: '컨테이너 요소에 지도 초기화 (Next.js: ssr:false로 dynamic import 사용)',
        code_snippet: `import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

const map = new mapboxgl.Map({
  container: 'map',   // DOM element id
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [127.0, 37.5], // [lng, lat]
  zoom: 10,
})`,
      },
    ],
    code_examples: {
      typescript: `import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef } from 'react'

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [127.0276, 37.4979],
      zoom: 12,
    })

    // 마커 추가
    new mapboxgl.Marker().setLngLat([127.0276, 37.4979]).addTo(map)

    return () => map.remove()
  }, [])

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
}`,
    },
    common_pitfalls: [
      {
        title: 'CSS not imported — blank map container',
        title_ko: 'CSS 미임포트로 빈 지도 컨테이너',
        problem: 'Map renders as blank or controls appear unstyled without the CSS import',
        solution: "Always import 'mapbox-gl/dist/mapbox-gl.css' alongside the JS module",
      },
      {
        title: 'SSR error in Next.js',
        title_ko: 'Next.js SSR 오류',
        problem: 'mapbox-gl references window/document and crashes during server-side rendering',
        solution: "Use next/dynamic with ssr: false to load the Map component only on the client",
        code: `const Map = dynamic(() => import('@/components/Map'), { ssr: false })`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Store geospatial data with PostGIS in Supabase and use Mapbox to visualize points, polygons, and routes from your database.',
        tip_ko: 'Supabase PostGIS에 지리 데이터를 저장하고 Mapbox로 데이터베이스의 포인트·폴리곤·경로를 시각화합니다.',
      },
    ],
    pros: [
      { text: 'Fully customizable vector map styles and 3D terrain', text_ko: '완전 커스터마이징 가능한 벡터 스타일과 3D 지형' },
      { text: '50,000 free map loads per month', text_ko: '월 5만 회 무료 지도 로드' },
      { text: 'Directions, Geocoding, and Isochrone APIs included', text_ko: '길찾기·지오코딩·등시선 API 포함' },
    ],
    cons: [
      { text: 'Costs scale with map loads, geocoding, and direction requests', text_ko: '지도 로드·지오코딩·길찾기 요청에 따라 비용 증가' },
      { text: 'Larger bundle size than simpler alternatives like Leaflet', text_ko: 'Leaflet 등 간단한 대안보다 큰 번들 사이즈' },
    ],
    api_key_url: 'https://account.mapbox.com/access-tokens/',
    api_key_url_label: 'Mapbox Access Tokens',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 5. Playwright
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.playwright,
    quick_start: 'npm init playwright@latest 한 줄로 E2E 테스트 환경을 구성하고 Chromium·Firefox·WebKit에서 동시에 테스트를 실행할 수 있습니다.',
    quick_start_en: 'Set up an E2E test environment with a single command npm init playwright@latest and run tests simultaneously across Chromium, Firefox, and WebKit.',
    setup_steps: [
      {
        step: 1,
        title: 'Init Playwright project',
        title_ko: 'Playwright 프로젝트 초기화',
        description: 'Scaffold a Playwright project with TypeScript config and sample tests',
        description_ko: 'TypeScript 설정과 샘플 테스트로 Playwright 프로젝트 스캐폴드',
        code_snippet: 'npm init playwright@latest',
      },
      {
        step: 2,
        title: 'Write your first test',
        title_ko: '첫 번째 테스트 작성',
        description: 'Create a test file in the tests/ directory',
        description_ko: 'tests/ 디렉토리에 테스트 파일 생성',
        code_snippet: `import { test, expect } from '@playwright/test'

test('homepage has title', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await expect(page).toHaveTitle(/My App/)
})`,
      },
      {
        step: 3,
        title: 'Run tests',
        title_ko: '테스트 실행',
        description: 'Run all tests headlessly or open the interactive UI mode',
        description_ko: '헤드리스 모드로 전체 실행하거나 인터랙티브 UI 모드 사용',
        code_snippet: `npx playwright test          # 헤드리스 실행
npx playwright test --ui    # UI 모드
npx playwright codegen      # 테스트 코드 자동 생성`,
      },
    ],
    code_examples: {
      typescript: `import { test, expect } from '@playwright/test'

test.describe('Auth flow', () => {
  test('user can sign in', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign in' }).click()

    // 로그인 후 대시보드 이동 확인
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Welcome')).toBeVisible()
  })

  test('API response mocking', async ({ page }) => {
    await page.route('/api/users', route =>
      route.fulfill({ json: [{ id: 1, name: 'Mock User' }] })
    )
    await page.goto('/users')
    await expect(page.getByText('Mock User')).toBeVisible()
  })
})`,
    },
    common_pitfalls: [
      {
        title: 'Hardcoded waits instead of auto-wait',
        title_ko: '자동 대기 대신 하드코딩된 대기',
        problem: 'Using page.waitForTimeout(2000) creates flaky tests that are slow and unreliable',
        solution: 'Use Playwright built-in auto-wait: expect(locator).toBeVisible() or waitForURL()',
        code: `// Wrong (flaky)
await page.waitForTimeout(2000)

// Correct (reliable)
await expect(page.getByRole('button')).toBeEnabled()`,
      },
      {
        title: 'Missing webServer config in CI',
        title_ko: 'CI에서 webServer 설정 누락',
        problem: 'Tests fail in CI because the dev server is not running',
        solution: 'Add webServer config to playwright.config.ts to auto-start the server',
        code: `// playwright.config.ts
export default defineConfig({
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'github-actions',
        tip: 'Use the official Playwright GitHub Action to run tests in CI. The action automatically installs browsers and uploads test reports as artifacts.',
        tip_ko: '공식 Playwright GitHub Action으로 CI에서 테스트를 실행하세요. 브라우저 자동 설치 및 테스트 리포트 아티팩트 업로드를 지원합니다.',
        code: `# .github/workflows/playwright.yml
- uses: microsoft/playwright-github-action@v1
- run: npx playwright test`,
      },
    ],
    pros: [
      { text: 'Cross-browser testing (Chromium, Firefox, WebKit) with one API', text_ko: '단일 API로 크로스 브라우저 테스트 (Chromium, Firefox, WebKit)' },
      { text: 'Built-in auto-wait, trace viewer, and codegen tools', text_ko: '내장 자동 대기, 트레이스 뷰어, 코드 생성 도구' },
      { text: 'Parallel test execution and sharding out of the box', text_ko: '기본 제공 병렬 실행 및 샤딩' },
    ],
    cons: [
      { text: 'Larger setup overhead than Cypress for simple projects', text_ko: '간단한 프로젝트에는 Cypress보다 설정 부담 큼' },
      { text: 'Browser binaries add ~200MB to CI cache', text_ko: '브라우저 바이너리가 CI 캐시에 ~200MB 추가' },
    ],
    api_key_url: 'https://playwright.dev/docs/intro',
    api_key_url_label: 'Playwright Docs',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 6. Cypress
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.cypress,
    quick_start: 'Cypress를 설치하고 실시간 브라우저 미리보기 환경에서 E2E 테스트를 작성하며 즉각적인 피드백을 받을 수 있습니다.',
    quick_start_en: 'Install Cypress and write E2E tests with live browser preview and instant feedback during development.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Cypress',
        title_ko: 'Cypress 설치',
        description: 'Install Cypress as a dev dependency',
        description_ko: 'Cypress를 개발 의존성으로 설치',
        code_snippet: 'npm install --save-dev cypress',
      },
      {
        step: 2,
        title: 'Open Cypress',
        title_ko: 'Cypress 실행',
        description: 'Launch the Cypress App to scaffold config and example tests',
        description_ko: 'Cypress 앱 실행으로 설정 파일과 예시 테스트 자동 생성',
        code_snippet: 'npx cypress open',
      },
      {
        step: 3,
        title: 'Write a spec file',
        title_ko: '스펙 파일 작성',
        description: 'Create a spec file in cypress/e2e/',
        description_ko: 'cypress/e2e/에 스펙 파일 생성',
        code_snippet: `// cypress/e2e/login.cy.ts
describe('Login', () => {
  it('navigates to dashboard', () => {
    cy.visit('/login')
    cy.get('[data-cy=email]').type('user@example.com')
    cy.get('[data-cy=password]').type('password123')
    cy.get('[data-cy=submit]').click()
    cy.url().should('include', '/dashboard')
  })
})`,
      },
    ],
    code_examples: {
      typescript: `// cypress/e2e/checkout.cy.ts
describe('Checkout flow', () => {
  beforeEach(() => {
    cy.session('logged-in', () => {
      cy.visit('/login')
      cy.get('[data-cy=email]').type('user@example.com')
      cy.get('[data-cy=password]').type('password')
      cy.get('[data-cy=submit]').click()
    })
  })

  it('completes purchase', () => {
    cy.visit('/products')
    cy.contains('Add to Cart').first().click()
    cy.visit('/cart')
    cy.get('[data-cy=checkout]').click()
    cy.get('[data-cy=order-confirmation]').should('be.visible')
  })

  // API intercept
  it('handles payment error', () => {
    cy.intercept('POST', '/api/checkout', { statusCode: 500 }).as('checkout')
    cy.get('[data-cy=checkout]').click()
    cy.wait('@checkout')
    cy.contains('Payment failed').should('be.visible')
  })
})`,
    },
    common_pitfalls: [
      {
        title: 'Using cy.wait() with fixed timeout',
        title_ko: '고정 타임아웃 cy.wait() 사용',
        problem: 'cy.wait(2000) is unreliable and slows down the test suite',
        solution: 'Use cy.intercept() aliases and cy.wait(@aliasName) to wait for specific network requests',
        code: `// Wrong
cy.wait(2000)

// Correct
cy.intercept('GET', '/api/data').as('getData')
cy.visit('/page')
cy.wait('@getData')`,
      },
      {
        title: 'Missing data-cy attributes',
        title_ko: 'data-cy 속성 누락',
        problem: 'Selecting elements by CSS class or text makes tests fragile to UI changes',
        solution: 'Add data-cy="element-name" attributes to interactive elements and use cy.get("[data-cy=...]")',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'github-actions',
        tip: 'Use cypress-io/github-action to run headless Cypress tests in CI with automatic parallelization across machines.',
        tip_ko: 'cypress-io/github-action으로 CI에서 헤드리스 Cypress 테스트를 실행하고 여러 머신에서 병렬화합니다.',
        code: `- uses: cypress-io/github-action@v6
  with:
    start: npm run dev
    wait-on: 'http://localhost:3000'`,
      },
    ],
    pros: [
      { text: 'Interactive test runner with real-time browser preview', text_ko: '실시간 브라우저 미리보기가 있는 인터랙티브 테스트 러너' },
      { text: 'Excellent debugging with time-travel and screenshots', text_ko: '시간 이동과 스크린샷으로 뛰어난 디버깅 경험' },
      { text: 'Built-in network request interception and mocking', text_ko: '네트워크 요청 인터셉트·목킹 내장' },
    ],
    cons: [
      { text: 'Only Chromium-based browsers in default local setup', text_ko: '기본 로컬 설정에서 크로미엄 기반 브라우저만 지원' },
      { text: 'Cross-origin iframes and multiple tabs have limited support', text_ko: '크로스 오리진 iframe과 다중 탭 지원 제한' },
    ],
    api_key_url: 'https://cloud.cypress.io',
    api_key_url_label: 'Cypress Cloud',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 7. Vitest
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.vitest,
    quick_start: 'npm install vitest로 설치하면 Vite 설정을 재사용하는 초고속 유닛 테스트 환경이 구성됩니다. Jest와 100% 호환 API를 제공합니다.',
    quick_start_en: 'Install vitest to get a blazing-fast unit testing environment that reuses your Vite config. Fully compatible with Jest API.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Vitest',
        title_ko: 'Vitest 설치',
        description: 'Install Vitest as a dev dependency (Vite >= 5.0 recommended)',
        description_ko: 'Vitest를 개발 의존성으로 설치 (Vite >= 5.0 권장)',
        code_snippet: 'npm install --save-dev vitest @vitest/coverage-v8',
      },
      {
        step: 2,
        title: 'Configure vitest.config.ts',
        title_ko: 'vitest.config.ts 설정',
        description: 'Add test configuration (or extend from vite.config.ts)',
        description_ko: '테스트 설정 추가 (vite.config.ts에서 확장 가능)',
        code_snippet: `// vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: { provider: 'v8', reporter: ['text', 'lcov'] },
  },
})`,
      },
      {
        step: 3,
        title: 'Write and run tests',
        title_ko: '테스트 작성 및 실행',
        description: 'Add test scripts to package.json and run',
        description_ko: 'package.json에 테스트 스크립트 추가 후 실행',
        code_snippet: `// package.json
{ "scripts": { "test": "vitest", "test:coverage": "vitest run --coverage" } }

// Run
npm test`,
      },
    ],
    code_examples: {
      typescript: `import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from './MyComponent'

// 모듈 목킹
vi.mock('@/lib/api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
}))

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays user name after fetch', async () => {
    render(<MyComponent userId="1" />)
    expect(await screen.findByText('Test User')).toBeInTheDocument()
  })

  it('handles click event', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<MyComponent onSubmit={onSubmit} />)
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })
})`,
    },
    common_pitfalls: [
      {
        title: 'Using mockResolvedValueOnce causes flaky re-renders',
        title_ko: 'mockResolvedValueOnce 사용 시 리렌더링 불안정',
        problem: 'mockResolvedValueOnce exhausts after one call, causing subsequent renders to return undefined',
        solution: 'Use mockResolvedValue (without Once) so all calls return the mocked value consistently',
        code: `// Risky with re-renders
vi.fn().mockResolvedValueOnce(data)

// Safe
vi.fn().mockResolvedValue(data)`,
      },
      {
        title: 'globals: true not set — describe/expect not found',
        title_ko: 'globals: true 미설정으로 describe/expect 미인식',
        problem: 'describe, it, expect are undefined without globals: true in config',
        solution: "Set globals: true in vitest.config.ts and add 'vitest/globals' to tsconfig types",
        code: `// tsconfig.json
{ "compilerOptions": { "types": ["vitest/globals"] } }`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'github-actions',
        tip: 'Run vitest with --reporter=github-actions flag in CI for native GitHub PR annotations on test failures.',
        tip_ko: 'CI에서 --reporter=github-actions 플래그를 사용하면 테스트 실패 시 GitHub PR에 네이티브 어노테이션이 표시됩니다.',
        code: `- run: npx vitest run --reporter=github-actions --coverage`,
      },
    ],
    pros: [
      { text: 'Reuses Vite config — zero extra config for Vite projects', text_ko: 'Vite 설정 재사용으로 Vite 프로젝트에서 추가 설정 불필요' },
      { text: 'Jest-compatible API — easy migration from Jest', text_ko: 'Jest 호환 API로 Jest에서 쉽게 마이그레이션' },
      { text: 'HMR-based watch mode is significantly faster than Jest', text_ko: 'HMR 기반 워치 모드가 Jest보다 현저히 빠름' },
    ],
    cons: [
      { text: 'Ecosystem slightly smaller than Jest (fewer plugins)', text_ko: 'Jest보다 약간 작은 생태계 (플러그인 수 적음)' },
      { text: 'jsdom environment has limitations for browser-specific APIs', text_ko: 'jsdom 환경은 브라우저 특정 API에 제한 있음' },
    ],
    api_key_url: 'https://vitest.dev',
    api_key_url_label: 'Vitest Docs',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 8. Storybook
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.storybook,
    quick_start: 'npx storybook@latest init 한 줄로 컴포넌트 주도 개발 환경을 구성하고 UI 컴포넌트를 독립적으로 개발·문서화할 수 있습니다.',
    quick_start_en: 'Set up component-driven development with a single command npx storybook@latest init and develop or document UI components in isolation.',
    setup_steps: [
      {
        step: 1,
        title: 'Initialize Storybook',
        title_ko: 'Storybook 초기화',
        description: 'Auto-detect your framework and scaffold Storybook configuration',
        description_ko: '프레임워크 자동 감지 후 Storybook 설정 스캐폴드',
        code_snippet: 'npx storybook@latest init',
      },
      {
        step: 2,
        title: 'Run Storybook dev server',
        title_ko: 'Storybook 개발 서버 실행',
        description: 'Start the local Storybook server (default port 6006)',
        description_ko: '로컬 Storybook 서버 시작 (기본 포트 6006)',
        code_snippet: 'npm run storybook',
      },
      {
        step: 3,
        title: 'Write a story',
        title_ko: '스토리 작성',
        description: 'Create a .stories.tsx file alongside your component',
        description_ko: '컴포넌트 파일 옆에 .stories.tsx 파일 생성',
        code_snippet: `// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  args: { label: 'Click me' },
}
export default meta

type Story = StoryObj<typeof Button>
export const Primary: Story = { args: { variant: 'primary' } }
export const Disabled: Story = { args: { disabled: true } }`,
      },
    ],
    code_examples: {
      typescript: `// Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  component: Card,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: { title: 'Hello', description: 'World' },
}

// 인터랙션 테스트
export const WithInteraction: Story = {
  args: { title: 'Click Test' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await expect(canvas.getByText('Clicked!')).toBeInTheDocument()
  },
}`,
    },
    common_pitfalls: [
      {
        title: 'Missing decorators for context providers',
        title_ko: '컨텍스트 프로바이더용 데코레이터 누락',
        problem: 'Components using ThemeProvider, Router, or i18n context crash in Storybook',
        solution: 'Add global decorators in .storybook/preview.ts to wrap all stories with required providers',
        code: `// .storybook/preview.ts
export const decorators = [
  (Story) => <ThemeProvider><Story /></ThemeProvider>,
]`,
      },
      {
        title: 'Static assets not resolving',
        title_ko: '정적 에셋 미해결',
        problem: 'Images and fonts referenced with absolute paths are not found in Storybook',
        solution: 'Set staticDirs in .storybook/main.ts to include your public directory',
        code: `// .storybook/main.ts
export default { staticDirs: ['../public'] }`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vitest',
        tip: 'Use Storybook\'s Vitest plugin (storybook/experimental-addon-test) to run story interaction tests with vitest --watch for instant feedback.',
        tip_ko: 'Storybook Vitest 플러그인(storybook/experimental-addon-test)으로 스토리 인터랙션 테스트를 vitest --watch로 즉각 실행합니다.',
      },
    ],
    pros: [
      { text: 'Develop components in isolation without running the full app', text_ko: '전체 앱 실행 없이 컴포넌트 독립 개발 가능' },
      { text: 'Auto-generated documentation from TypeScript props and JSDoc', text_ko: 'TypeScript props와 JSDoc에서 자동 문서 생성' },
      { text: 'Interaction testing with play() functions', text_ko: 'play() 함수를 이용한 인터랙션 테스트 지원' },
    ],
    cons: [
      { text: 'Initial setup and addon configuration can be time-consuming', text_ko: '초기 설정과 애드온 구성에 시간 소요될 수 있음' },
      { text: 'Bundle size increases with many addons enabled', text_ko: '많은 애드온 활성화 시 번들 크기 증가' },
    ],
    api_key_url: 'https://storybook.js.org/docs/get-started/install',
    api_key_url_label: 'Storybook Docs',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 9. Trigger.dev
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.trigger_dev,
    quick_start: 'Trigger.dev v3 SDK를 설치하면 타임아웃 없는 장시간 백그라운드 작업을 TypeScript 함수 형태로 정의하고 안정적으로 실행할 수 있습니다.',
    quick_start_en: 'Install the Trigger.dev v3 SDK to define long-running background jobs as TypeScript functions with no timeouts and reliable execution.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Trigger.dev SDK',
        title_ko: 'Trigger.dev SDK 설치',
        description: 'Install the v3 SDK package',
        description_ko: 'v3 SDK 패키지 설치',
        code_snippet: 'npm install @trigger.dev/sdk@v3',
      },
      {
        step: 2,
        title: 'Define a task',
        title_ko: '태스크 정의',
        description: 'Create a task file in trigger/ directory',
        description_ko: 'trigger/ 디렉토리에 태스크 파일 생성',
        code_snippet: `// trigger/send-welcome-email.ts
import { task } from '@trigger.dev/sdk/v3'

export const sendWelcomeEmail = task({
  id: 'send-welcome-email',
  run: async (payload: { userId: string; email: string }) => {
    // 타임아웃 없이 실행되는 코드
    await sendEmail(payload.email, 'Welcome!')
    return { sent: true }
  },
})`,
      },
      {
        step: 3,
        title: 'Trigger the task',
        title_ko: '태스크 트리거',
        description: 'Trigger the task from your API route or server action',
        description_ko: 'API 라우트 또는 서버 액션에서 태스크 트리거',
        code_snippet: `import { sendWelcomeEmail } from '@/trigger/send-welcome-email'

// Next.js API route
const handle = await sendWelcomeEmail.trigger({
  userId: user.id,
  email: user.email,
})`,
      },
    ],
    code_examples: {
      typescript: `// trigger/process-video.ts
import { task, logger, wait } from '@trigger.dev/sdk/v3'

export const processVideo = task({
  id: 'process-video',
  // 재시도 정책
  retry: { maxAttempts: 3, factor: 2, minTimeoutInMs: 1000 },
  run: async (payload: { videoId: string; url: string }) => {
    logger.info('Processing video', { videoId: payload.videoId })

    // 단계별 실행 (체크포인트)
    const downloaded = await downloadVideo(payload.url)
    logger.info('Downloaded', { size: downloaded.size })

    // 장시간 대기 (서버리스 한계 없음)
    await wait.for({ seconds: 30 })

    const transcoded = await transcodeVideo(downloaded.path)
    return { transcoded, videoId: payload.videoId }
  },
})`,
    },
    common_pitfalls: [
      {
        title: 'Task file not in trigger/ directory',
        title_ko: '태스크 파일이 trigger/ 디렉토리 밖에 위치',
        problem: 'Trigger.dev CLI only scans the trigger/ directory by default; tasks elsewhere are not registered',
        solution: "Place all task files in the trigger/ directory or configure triggerDirectories in trigger.config.ts",
      },
      {
        title: 'Using environment variables without TRIGGER_SECRET_KEY',
        title_ko: 'TRIGGER_SECRET_KEY 없는 환경변수 사용',
        problem: 'Tasks cannot authenticate with Trigger.dev cloud without the secret key',
        solution: 'Set TRIGGER_SECRET_KEY in .env from your Trigger.dev project settings',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Trigger background tasks from Supabase database webhooks (pg_net) when rows are inserted, enabling event-driven workflows.',
        tip_ko: 'Supabase 데이터베이스 웹훅(pg_net)의 행 삽입 이벤트로 백그라운드 태스크를 트리거하여 이벤트 기반 워크플로우를 구성합니다.',
      },
      {
        with_service_slug: 'vercel',
        tip: 'Trigger.dev offloads long-running jobs from Vercel serverless functions, bypassing the 10-second timeout limit on Hobby plans.',
        tip_ko: 'Trigger.dev로 장시간 작업을 Vercel 서버리스 함수에서 분리하여 Hobby 플랜의 10초 타임아웃 제한을 우회합니다.',
      },
    ],
    pros: [
      { text: 'No timeout limits on background tasks', text_ko: '백그라운드 태스크에 타임아웃 제한 없음' },
      { text: 'TypeScript-native with full type inference for task payloads', text_ko: '태스크 페이로드 완전 타입 추론을 지원하는 TypeScript 네이티브' },
      { text: 'Built-in retry, logging, and real-time run monitoring', text_ko: '내장 재시도, 로깅, 실시간 실행 모니터링' },
    ],
    cons: [
      { text: 'Requires separate Trigger.dev account and project setup', text_ko: '별도 Trigger.dev 계정 및 프로젝트 설정 필요' },
      { text: 'Self-hosting is complex compared to cloud option', text_ko: '클라우드 옵션 대비 셀프 호스팅이 복잡' },
    ],
    api_key_url: 'https://cloud.trigger.dev/orgs',
    api_key_url_label: 'Trigger.dev Dashboard',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 10. Inngest
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.inngest,
    quick_start: 'Inngest SDK를 설치하고 /api/inngest 엔드포인트를 노출하면 이벤트 기반 워크플로우와 지연 실행 함수를 타임아웃 없이 사용할 수 있습니다.',
    quick_start_en: 'Install the Inngest SDK and expose an /api/inngest endpoint to run event-driven workflows and delayed functions without timeouts.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Inngest SDK',
        title_ko: 'Inngest SDK 설치',
        description: 'Install the Inngest JavaScript/TypeScript SDK',
        description_ko: 'Inngest JS/TS SDK 설치',
        code_snippet: 'npm install inngest',
      },
      {
        step: 2,
        title: 'Create Inngest client and function',
        title_ko: 'Inngest 클라이언트 및 함수 생성',
        description: 'Initialize the client and define an event-driven function',
        description_ko: '클라이언트 초기화 및 이벤트 기반 함수 정의',
        code_snippet: `// inngest/client.ts
import { Inngest } from 'inngest'
export const inngest = new Inngest({ id: 'my-app' })

// inngest/functions/welcome-email.ts
import { inngest } from '../client'
export const sendWelcomeEmail = inngest.createFunction(
  { id: 'send-welcome-email' },
  { event: 'app/user.created' },
  async ({ event, step }) => {
    await step.run('send-email', () =>
      sendEmail(event.data.email, 'Welcome!')
    )
  }
)`,
      },
      {
        step: 3,
        title: 'Expose the API route',
        title_ko: 'API 라우트 노출',
        description: 'Create the /api/inngest route handler for Next.js App Router',
        description_ko: 'Next.js App Router용 /api/inngest 라우트 핸들러 생성',
        code_snippet: `// app/api/inngest/route.ts
import { serve } from 'inngest/next'
import { inngest } from '@/inngest/client'
import { sendWelcomeEmail } from '@/inngest/functions/welcome-email'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendWelcomeEmail],
})`,
      },
    ],
    code_examples: {
      typescript: `// inngest/functions/onboarding.ts
import { inngest } from '../client'

export const onboardingFlow = inngest.createFunction(
  { id: 'user-onboarding', retries: 3 },
  { event: 'app/user.created' },
  async ({ event, step }) => {
    // step.run은 실패 시 자동 재시도, 성공 시 체크포인트 저장
    const user = await step.run('fetch-user', () =>
      db.users.findById(event.data.userId)
    )

    // 1시간 대기 (서버리스 슬립)
    await step.sleep('wait-1h', '1h')

    // 조건부 다음 단계
    if (!user.emailVerified) {
      await step.run('send-reminder', () =>
        sendEmail(user.email, 'Please verify your email')
      )
    }

    return { userId: user.id, completed: true }
  }
)`,
    },
    common_pitfalls: [
      {
        title: 'Step functions must be deterministic',
        title_ko: '스텝 함수는 결정적이어야 함',
        problem: 'Inngest replays function execution from checkpoints; non-deterministic code causes inconsistent behavior',
        solution: 'All side effects (DB calls, API calls) must be wrapped in step.run(). Never use Math.random() or Date.now() outside steps.',
      },
      {
        title: 'INNGEST_SIGNING_KEY not set in production',
        title_ko: '프로덕션에서 INNGEST_SIGNING_KEY 미설정',
        problem: 'Without the signing key, Inngest cannot verify webhook requests, causing all function executions to fail',
        solution: 'Set INNGEST_SIGNING_KEY and INNGEST_EVENT_KEY from your Inngest dashboard in production environment variables',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Inngest works perfectly with Vercel serverless functions. The step.sleep() feature bypasses Vercel\'s function timeout by suspending execution between steps.',
        tip_ko: 'Inngest는 Vercel 서버리스 함수와 완벽하게 동작합니다. step.sleep()으로 스텝 간 실행을 중단하여 Vercel 함수 타임아웃을 우회합니다.',
      },
      {
        with_service_slug: 'supabase',
        tip: 'Send Inngest events from Supabase Edge Functions or database triggers to kick off multi-step workflows on user data changes.',
        tip_ko: 'Supabase Edge Functions 또는 데이터베이스 트리거에서 Inngest 이벤트를 전송하여 사용자 데이터 변경 시 멀티 스텝 워크플로우를 시작합니다.',
      },
    ],
    pros: [
      { text: 'Step functions with automatic checkpointing and retries', text_ko: '자동 체크포인트와 재시도를 지원하는 스텝 함수' },
      { text: 'Local dev server (inngest dev) mirrors production behavior', text_ko: '로컬 dev 서버(inngest dev)가 프로덕션 동작을 미러링' },
      { text: 'No infrastructure to manage — fully serverless', text_ko: '관리할 인프라 없음 - 완전 서버리스' },
    ],
    cons: [
      { text: 'Functions must be deterministic which requires code discipline', text_ko: '함수의 결정적 실행 요건으로 코드 규율 필요' },
      { text: 'Paid plan required for high event volumes and team features', text_ko: '높은 이벤트 볼륨과 팀 기능에는 유료 플랜 필요' },
    ],
    api_key_url: 'https://app.inngest.com/settings/integrations',
    api_key_url_label: 'Inngest Dashboard',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 11. BullMQ
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.bullmq,
    quick_start: 'Redis 연결 정보만 있으면 BullMQ로 즉시 분산 작업 큐를 구성하고 재시도·지연·우선순위가 있는 백그라운드 잡을 처리할 수 있습니다.',
    quick_start_en: 'With just a Redis connection, set up a distributed job queue with BullMQ to process background jobs with retries, delays, and priorities.',
    setup_steps: [
      {
        step: 1,
        title: 'Install BullMQ',
        title_ko: 'BullMQ 설치',
        description: 'Install BullMQ (requires Redis 6.2.0 or higher)',
        description_ko: 'BullMQ 설치 (Redis 6.2.0 이상 필요)',
        code_snippet: 'npm install bullmq',
      },
      {
        step: 2,
        title: 'Create a Queue and add a job',
        title_ko: '큐 생성 및 잡 추가',
        description: 'Create a queue and add jobs with optional delay and priority',
        description_ko: '큐를 생성하고 선택적 지연·우선순위로 잡 추가',
        code_snippet: `import { Queue } from 'bullmq'

const queue = new Queue('email', {
  connection: { url: process.env.REDIS_URL },
})

await queue.add('send-welcome', { userId: '123', email: 'user@example.com' })`,
      },
      {
        step: 3,
        title: 'Create a Worker',
        title_ko: 'Worker 생성',
        description: 'Process jobs in a separate worker process',
        description_ko: '별도 워커 프로세스에서 잡 처리',
        code_snippet: `import { Worker } from 'bullmq'

const worker = new Worker('email', async (job) => {
  const { userId, email } = job.data
  await sendEmail(email, 'Welcome!')
  return { sent: true }
}, { connection: { url: process.env.REDIS_URL } })`,
      },
    ],
    code_examples: {
      typescript: `import { Queue, Worker, QueueEvents } from 'bullmq'

const connection = { url: process.env.REDIS_URL! }

// 큐 설정
const emailQueue = new Queue('email', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
})

// 잡 추가 (지연, 우선순위)
await emailQueue.add('send-promo', { userId: '1' }, {
  delay: 5 * 60 * 1000, // 5분 후 실행
  priority: 10,
})

// 반복 잡 (크론)
await emailQueue.add('daily-digest', {}, {
  repeat: { pattern: '0 9 * * *' }, // 매일 오전 9시
})

// Worker
const worker = new Worker('email', async (job) => {
  if (job.name === 'send-promo') {
    await sendPromoEmail(job.data.userId)
  }
  await job.updateProgress(100)
}, { connection, concurrency: 5 })

worker.on('failed', (job, err) => {
  console.error(\`Job \${job?.id} failed:\`, err.message)
})`,
    },
    common_pitfalls: [
      {
        title: 'Worker and Queue sharing the same process in Next.js',
        title_ko: 'Next.js에서 Worker와 Queue를 같은 프로세스에서 실행',
        problem: 'Next.js serverless functions are not suited for long-running Workers; they get killed between requests',
        solution: 'Run Workers in a separate Node.js process (e.g., a Railway or Fly.io service), not in Next.js API routes',
      },
      {
        title: 'Not closing Queue/Worker connections',
        title_ko: 'Queue/Worker 연결 미종료',
        problem: 'Unclosed Redis connections cause memory leaks and prevent graceful shutdown',
        solution: 'Call worker.close() and queue.close() on SIGTERM signal',
        code: `process.on('SIGTERM', async () => {
  await worker.close()
  await queue.close()
})`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'upstash-redis',
        tip: 'Use Upstash Redis as the BullMQ backend for a serverless-compatible Redis instance with REST API fallback.',
        tip_ko: 'Upstash Redis를 BullMQ 백엔드로 사용하면 REST API 폴백이 있는 서버리스 호환 Redis를 활용할 수 있습니다.',
      },
      {
        with_service_slug: 'redis-cloud',
        tip: 'Redis Cloud provides a managed Redis instance ideal for BullMQ in production with persistence, replication, and monitoring.',
        tip_ko: 'Redis Cloud는 영속성·복제·모니터링을 갖춘 프로덕션용 BullMQ에 적합한 관리형 Redis 인스턴스를 제공합니다.',
      },
    ],
    pros: [
      { text: 'Battle-tested Redis-backed queue with high throughput', text_ko: '높은 처리량의 검증된 Redis 기반 큐' },
      { text: 'Rich job options: retry, delay, priority, cron repeatable', text_ko: '재시도·지연·우선순위·크론 반복 등 풍부한 잡 옵션' },
      { text: 'Open source with BullMQ Pro available for advanced features', text_ko: '오픈소스이며 고급 기능을 위한 BullMQ Pro 제공' },
    ],
    cons: [
      { text: 'Requires a running Redis instance (not serverless-native)', text_ko: '실행 중인 Redis 인스턴스 필요 (서버리스 네이티브 아님)' },
      { text: 'Workers need persistent processes, not suitable for ephemeral serverless', text_ko: '워커는 지속 프로세스 필요, 단명 서버리스에 부적합' },
    ],
    api_key_url: 'https://docs.bullmq.io',
    api_key_url_label: 'BullMQ Docs',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 12. Shopify API
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.shopify_api,
    quick_start: 'Shopify 파트너 계정에서 앱을 등록하고 Storefront API 또는 Admin API로 헤드리스 커머스 스토어프론트를 구축할 수 있습니다.',
    quick_start_en: 'Register an app in Shopify Partners and build a headless commerce storefront using the Storefront API or Admin API.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Shopify Storefront API client',
        title_ko: 'Shopify Storefront API 클라이언트 설치',
        description: 'Install the official lightweight Storefront API client (replaces deprecated JS Buy SDK)',
        description_ko: '공식 경량 Storefront API 클라이언트 설치 (deprecated JS Buy SDK 대체)',
        code_snippet: 'npm install @shopify/storefront-api-client',
      },
      {
        step: 2,
        title: 'Create Storefront API client',
        title_ko: 'Storefront API 클라이언트 생성',
        description: 'Initialize the client with your store domain and public access token',
        description_ko: '스토어 도메인과 공개 액세스 토큰으로 클라이언트 초기화',
        code_snippet: `import { createStorefrontApiClient } from '@shopify/storefront-api-client'

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2025-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
})`,
      },
      {
        step: 3,
        title: 'Fetch products',
        title_ko: '상품 조회',
        description: 'Query products using GraphQL',
        description_ko: 'GraphQL로 상품 조회',
        code_snippet: `const { data } = await client.request(\`
  query GetProducts {
    products(first: 10) {
      nodes {
        id title handle
        priceRange { minVariantPrice { amount currencyCode } }
        featuredImage { url altText }
      }
    }
  }
\`)`,
      },
    ],
    code_examples: {
      typescript: `import { createStorefrontApiClient } from '@shopify/storefront-api-client'

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2025-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
})

// 장바구니 생성
const { data: cartData } = await client.request(\`
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl totalQuantity }
    }
  }
\`, { variables: { input: { lines: [{ quantity: 1, merchandiseId: 'VARIANT_GID' }] } } })

// 결제 URL로 리디렉션
const checkoutUrl = cartData?.cartCreate?.cart?.checkoutUrl
window.location.href = checkoutUrl`,
    },
    common_pitfalls: [
      {
        title: 'JS Buy SDK is deprecated as of 2025',
        title_ko: 'JS Buy SDK가 2025년부터 deprecated',
        problem: 'Using the old shopify-buy package causes checkout flow failures due to removed Checkout API',
        solution: 'Migrate to @shopify/storefront-api-client which uses the Cart API for checkout',
      },
      {
        title: 'Admin API token exposed in frontend',
        title_ko: '프론트엔드에 Admin API 토큰 노출',
        problem: 'SHOPIFY_ADMIN_ACCESS_TOKEN has full store access and must never be in client-side code',
        solution: 'Use SHOPIFY_ADMIN_ACCESS_TOKEN only in server-side API routes; use Storefront token (public) for frontend',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'stripe',
        tip: 'Use Shopify Storefront API for product catalog and Stripe for payments in a fully custom headless storefront — bypassing Shopify\'s payment fees.',
        tip_ko: 'Shopify Storefront API로 상품 카탈로그를, Stripe로 결제를 처리하면 Shopify 결제 수수료 없는 완전 커스텀 헤드리스 스토어프론트를 구축할 수 있습니다.',
      },
      {
        with_service_slug: 'vercel',
        tip: 'Use Next.js Commerce (Vercel) as a starter template for a production-ready Shopify headless storefront with ISR.',
        tip_ko: 'Vercel의 Next.js Commerce를 스타터 템플릿으로 사용하면 ISR이 적용된 프로덕션 수준의 Shopify 헤드리스 스토어프론트를 빠르게 구성할 수 있습니다.',
      },
    ],
    pros: [
      { text: 'Mature ecosystem with 1M+ stores and proven reliability', text_ko: '100만+ 스토어의 성숙한 생태계와 검증된 안정성' },
      { text: 'Headless-ready Storefront API with GraphQL', text_ko: 'GraphQL 기반 헤드리스 지원 Storefront API' },
      { text: 'Built-in payment processing, inventory, and fulfillment', text_ko: '내장 결제 처리·재고·주문 이행 기능' },
    ],
    cons: [
      { text: 'Monthly Shopify plan required even for API-only usage', text_ko: 'API 전용 사용에도 월정액 Shopify 플랜 필요' },
      { text: 'Admin API is GraphQL-only with complex schema to learn', text_ko: 'Admin API는 GraphQL 전용으로 복잡한 스키마 학습 필요' },
    ],
    api_key_url: 'https://partners.shopify.com',
    api_key_url_label: 'Shopify Partners',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 13. GitHub
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.github,
    quick_start: 'GitHub 개인 액세스 토큰(PAT) 또는 GitHub App을 생성하고 Octokit SDK로 리포지토리·이슈·PR을 프로그래밍 방식으로 관리할 수 있습니다.',
    quick_start_en: 'Create a GitHub Personal Access Token or GitHub App and use the Octokit SDK to programmatically manage repositories, issues, and pull requests.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Octokit SDK',
        title_ko: 'Octokit SDK 설치',
        description: 'Install the official GitHub Octokit REST client',
        description_ko: '공식 GitHub Octokit REST 클라이언트 설치',
        code_snippet: 'npm install @octokit/rest',
      },
      {
        step: 2,
        title: 'Create a Personal Access Token',
        title_ko: '개인 액세스 토큰 생성',
        description: 'Generate a fine-grained PAT at GitHub Settings → Developer settings → Tokens',
        description_ko: 'GitHub 설정 → 개발자 설정 → 토큰에서 세분화된 PAT 생성',
        code_snippet: 'GITHUB_TOKEN=github_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      },
      {
        step: 3,
        title: 'Initialize and make API calls',
        title_ko: '초기화 및 API 호출',
        description: 'Create an Octokit instance and call GitHub REST APIs',
        description_ko: 'Octokit 인스턴스 생성 후 GitHub REST API 호출',
        code_snippet: `import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

const { data: repos } = await octokit.repos.listForAuthenticatedUser({
  sort: 'updated', per_page: 10,
})`,
      },
    ],
    code_examples: {
      typescript: `import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

// 이슈 생성
const { data: issue } = await octokit.issues.create({
  owner: 'my-org',
  repo: 'my-repo',
  title: 'Bug: login fails',
  body: 'Steps to reproduce...',
  labels: ['bug', 'priority:high'],
})

// PR 목록 조회
const { data: prs } = await octokit.pulls.list({
  owner: 'my-org',
  repo: 'my-repo',
  state: 'open',
})

// 파일 콘텐츠 조회
const { data: file } = await octokit.repos.getContent({
  owner: 'my-org',
  repo: 'my-repo',
  path: 'package.json',
})

// 웹훅 이벤트 처리 (Next.js API route)
import { createNodeMiddleware, createAppAuth } from '@octokit/app'`,
    },
    common_pitfalls: [
      {
        title: 'Classic PAT vs Fine-grained PAT scope confusion',
        title_ko: '클래식 PAT와 세분화된 PAT 스코프 혼동',
        problem: 'Classic PATs grant broad access; a compromised token can access all user repositories',
        solution: 'Use fine-grained PATs with minimum required permissions and repository-scoped access where possible',
      },
      {
        title: 'Rate limit not handled',
        title_ko: '속도 제한 미처리',
        problem: 'Unauthenticated API calls are limited to 60/hour; authenticated to 5,000/hour',
        solution: 'Check X-RateLimit-Remaining header and implement exponential backoff on 403/429 responses',
        code: `octokit.hook.after('request', async (response) => {
  const remaining = response.headers['x-ratelimit-remaining']
  if (Number(remaining) < 10) {
    console.warn('GitHub rate limit almost exhausted')
  }
})`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Connect your GitHub repo to Vercel for automatic CI/CD: every push triggers a deployment and PRs get preview URLs.',
        tip_ko: 'GitHub 리포지토리를 Vercel에 연결하면 모든 푸시에 자동 배포가 트리거되고 PR에 프리뷰 URL이 생성됩니다.',
      },
      {
        with_service_slug: 'linear-api',
        tip: 'Use Linear-GitHub integration to auto-link commits and PRs to Linear issues and update issue status on PR merge.',
        tip_ko: 'Linear-GitHub 통합으로 커밋과 PR을 Linear 이슈에 자동 연결하고 PR 병합 시 이슈 상태를 자동 업데이트합니다.',
      },
    ],
    pros: [
      { text: 'De-facto standard for version control and open source collaboration', text_ko: '버전 관리와 오픈소스 협업의 사실상 표준' },
      { text: 'Rich REST and GraphQL APIs with Octokit SDK', text_ko: 'Octokit SDK를 갖춘 풍부한 REST 및 GraphQL API' },
      { text: 'Native CI/CD via GitHub Actions with extensive marketplace', text_ko: '광범위한 마켓플레이스를 갖춘 GitHub Actions 네이티브 CI/CD' },
    ],
    cons: [
      { text: 'Fine-grained PAT management can be complex for large teams', text_ko: '대규모 팀에서 세분화된 PAT 관리가 복잡해질 수 있음' },
      { text: 'GitHub Apps require more setup but are recommended over PATs for production', text_ko: 'GitHub Apps는 PAT보다 설정이 복잡하지만 프로덕션에서 권장됨' },
    ],
    api_key_url: 'https://github.com/settings/tokens',
    api_key_url_label: 'GitHub Token Settings',
  },
];
