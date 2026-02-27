import type { ServiceGuideSeed } from './service-guides';

const S = {
  github_actions: '10000000-0000-4000-a000-000000000021',
  cloudinary:     '10000000-0000-4000-a000-000000000012',
  uploadthing:    '10000000-0000-4000-a000-000000000018',
  imagekit:       '10000000-0000-4000-a000-000000000077',
  algolia:        '10000000-0000-4000-a000-000000000024',
  meilisearch:    '10000000-0000-4000-a000-000000000033',
  sanity:         '10000000-0000-4000-a000-000000000025',
  contentful:     '10000000-0000-4000-a000-000000000032',
  strapi:         '10000000-0000-4000-a000-000000000046',
  datadog:        '10000000-0000-4000-a000-000000000030',
  grafana:        '10000000-0000-4000-a000-000000000079',
  new_relic:      '10000000-0000-4000-a000-000000000080',
};

export const serviceGuidesBatch5a: ServiceGuideSeed[] = [
  // ---------------------------------------------------------------------------
  // 1. GitHub Actions
  // ---------------------------------------------------------------------------
  {
    service_id: S.github_actions,
    quick_start: 'GitHub 리포지토리에 .github/workflows/*.yml 파일을 추가하면 즉시 CI/CD 파이프라인을 구축할 수 있습니다.',
    quick_start_en: 'Add a .github/workflows/*.yml file to your repository to instantly set up a CI/CD pipeline.',
    setup_steps: [
      {
        step: 1,
        title: 'Create workflow file',
        title_ko: '워크플로우 파일 생성',
        description: 'Create .github/workflows/ci.yml in your repository',
        description_ko: '리포지토리에 .github/workflows/ci.yml 생성',
        code_snippet: `mkdir -p .github/workflows
touch .github/workflows/ci.yml`,
      },
      {
        step: 2,
        title: 'Define workflow',
        title_ko: '워크플로우 정의',
        description: 'Add trigger, jobs, and steps to the YAML file',
        description_ko: 'YAML 파일에 트리거, 잡, 스텝 정의',
        code_snippet: `name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test`,
      },
      {
        step: 3,
        title: 'Add secrets',
        title_ko: '시크릿 등록',
        description: 'Add API keys in Settings → Secrets and variables → Actions',
        description_ko: 'Settings → Secrets and variables → Actions에서 API 키 등록',
        code_snippet: `# workflow에서 시크릿 참조
env:
  VERCEL_TOKEN: \${{ secrets.VERCEL_TOKEN }}
  DATABASE_URL: \${{ secrets.DATABASE_URL }}`,
      },
    ],
    code_examples: {
      typescript: `# Next.js 빌드 + Vercel 배포 워크플로우
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        run: npx vercel --token=\${{ secrets.VERCEL_TOKEN }} --prod`,
    },
    common_pitfalls: [
      {
        title: 'Secrets exposed in logs',
        title_ko: '로그에 시크릿 노출',
        problem: 'Accidentally printing secret values with echo or run commands',
        solution: 'Never echo secrets. GitHub masks known secrets but custom concatenation may bypass masking.',
      },
      {
        title: 'Cache invalidation issues',
        title_ko: '캐시 무효화 문제',
        problem: 'npm install runs every time because cache key is wrong',
        solution: 'Use package-lock.json hash as cache key: hashFiles("**/package-lock.json")',
        code: `- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Use the official Vercel GitHub integration for automatic preview deployments, or use vercel CLI with VERCEL_TOKEN secret for custom workflows',
        tip_ko: 'Vercel GitHub 공식 통합으로 프리뷰 자동 배포, 또는 VERCEL_TOKEN 시크릿으로 커스텀 워크플로우 구성',
      },
      {
        with_service_slug: 'datadog',
        tip: 'Send GitHub Actions metrics to Datadog using the Datadog CI action to track build duration and flaky tests',
        tip_ko: 'Datadog CI 액션으로 빌드 시간과 불안정 테스트를 Datadog에 전송해 분석',
        code: `- name: Report to Datadog
  uses: datadog/datadog-ci-github-actions@v1
  with:
    api-key: \${{ secrets.DD_API_KEY }}`,
      },
    ],
    pros: [
      { text: 'Built into GitHub — no separate CI service needed', text_ko: 'GitHub에 내장 — 별도 CI 서비스 불필요' },
      { text: 'Huge marketplace of reusable actions', text_ko: '재사용 가능한 액션 마켓플레이스 풍부' },
      { text: 'Free for public repositories', text_ko: '퍼블릭 리포는 무제한 무료' },
    ],
    cons: [
      { text: 'Private repo free tier limited to 2,000 min/month', text_ko: '프라이빗 리포 무료 티어 월 2,000분 제한' },
      { text: 'YAML syntax errors can be hard to debug locally', text_ko: 'YAML 문법 오류 로컬 디버깅 어려움' },
    ],
    api_key_url: 'https://github.com/settings/tokens',
    api_key_url_label: 'GitHub Personal Access Tokens',
  },

  // ---------------------------------------------------------------------------
  // 2. Cloudinary
  // ---------------------------------------------------------------------------
  {
    service_id: S.cloudinary,
    quick_start: 'Cloudinary SDK를 설치하고 환경변수를 설정하면 이미지 업로드, 변환, CDN 전송을 즉시 시작할 수 있습니다.',
    quick_start_en: 'Install the Cloudinary SDK and configure environment variables to instantly upload, transform, and deliver images via CDN.',
    setup_steps: [
      {
        step: 1,
        title: 'Install SDK',
        title_ko: 'SDK 설치',
        description: 'Install the Cloudinary Next.js SDK',
        description_ko: 'Cloudinary Next.js SDK 설치',
        code_snippet: 'npm install next-cloudinary cloudinary',
      },
      {
        step: 2,
        title: 'Configure environment variables',
        title_ko: '환경변수 설정',
        description: 'Add Cloudinary credentials to .env.local',
        description_ko: '.env.local에 Cloudinary 자격 증명 추가',
        code_snippet: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret`,
      },
      {
        step: 3,
        title: 'Use CldImage component',
        title_ko: 'CldImage 컴포넌트 사용',
        description: 'Replace Next.js Image with CldImage for automatic optimization',
        description_ko: 'Next.js Image를 CldImage로 교체하여 자동 최적화 적용',
        code_snippet: `import { CldImage } from 'next-cloudinary'

<CldImage
  src="sample/cloudinary-icon"
  width={400}
  height={300}
  alt="Example"
/>`,
      },
    ],
    code_examples: {
      typescript: `import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// 서버사이드 업로드
export async function uploadImage(filePath: string) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'my-app',
    transformation: [{ width: 800, crop: 'limit' }, { quality: 'auto' }],
  })
  return result.secure_url
}

// URL 변환 (클라이언트)
const url = cloudinary.url('sample/cloudinary-icon', {
  width: 400,
  height: 300,
  crop: 'fill',
  format: 'webp',
  quality: 'auto',
})`,
    },
    common_pitfalls: [
      {
        title: 'API secret exposed on client',
        title_ko: 'API 시크릿 클라이언트 노출',
        problem: 'Using CLOUDINARY_API_SECRET in client-side code or NEXT_PUBLIC_ prefix',
        solution: 'Keep API_SECRET server-only. Use unsigned upload presets for direct client uploads.',
        code: `// 클라이언트 직접 업로드 시 unsigned preset 사용
const formData = new FormData()
formData.append('file', file)
formData.append('upload_preset', 'my_unsigned_preset')
await fetch(\`https://api.cloudinary.com/v1_1/\${cloudName}/image/upload\`, {
  method: 'POST',
  body: formData,
})`,
      },
      {
        title: 'Transformation credits exhausted',
        title_ko: '변환 크레딧 소진',
        problem: 'Each unique transformation URL counts against monthly credits',
        solution: 'Use named transformations and cache aggressively. Enable auto format/quality.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'uploadthing',
        tip: 'UploadThing handles the upload flow while Cloudinary handles transformation. Use UploadThing for user uploads then move assets to Cloudinary for CDN delivery.',
        tip_ko: 'UploadThing으로 업로드 처리 후 Cloudinary로 에셋 이동해 CDN 전송 최적화',
      },
      {
        with_service_slug: 'supabase',
        tip: 'Store Cloudinary public_id in Supabase instead of full URLs, so you can generate optimized URLs on-the-fly with different transformations',
        tip_ko: 'Supabase에 전체 URL 대신 Cloudinary public_id를 저장하여 동적 변환 URL 생성',
      },
    ],
    pros: [
      { text: 'Powerful URL-based image transformation (resize, crop, format, quality)', text_ko: 'URL 기반 강력한 이미지 변환 (리사이즈, 크롭, 포맷, 품질)' },
      { text: 'Built-in global CDN delivery', text_ko: '글로벌 CDN 전송 내장' },
      { text: 'Video optimization and streaming support', text_ko: '비디오 최적화 및 스트리밍 지원' },
    ],
    cons: [
      { text: 'Credit-based pricing can be unpredictable at scale', text_ko: '크레딧 기반 가격으로 대규모 시 비용 예측 어려움' },
      { text: 'Free tier (25 credits/month) runs out quickly with heavy usage', text_ko: '무료 티어 25크레딧으로 많은 사용 시 빠르게 소진' },
    ],
    api_key_url: 'https://cloudinary.com/console',
    api_key_url_label: 'Cloudinary Console',
  },

  // ---------------------------------------------------------------------------
  // 3. UploadThing
  // ---------------------------------------------------------------------------
  {
    service_id: S.uploadthing,
    quick_start: 'UploadThing을 Next.js에 설치하면 타입 안전한 파일 업로드 API와 빌트인 UI 컴포넌트를 5분 안에 사용할 수 있습니다.',
    quick_start_en: 'Install UploadThing in your Next.js app to get type-safe file upload API and built-in UI components in 5 minutes.',
    setup_steps: [
      {
        step: 1,
        title: 'Install packages',
        title_ko: '패키지 설치',
        description: 'Install uploadthing and its React components',
        description_ko: 'uploadthing과 React 컴포넌트 설치',
        code_snippet: 'npm install uploadthing @uploadthing/react',
      },
      {
        step: 2,
        title: 'Create file router',
        title_ko: '파일 라우터 생성',
        description: 'Define upload routes with file type and size restrictions',
        description_ko: '파일 타입과 크기 제한을 포함한 업로드 라우트 정의',
        code_snippet: `// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { auth } from '@/lib/auth'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      const user = await auth(req)
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // DB에 저장
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter`,
      },
      {
        step: 3,
        title: 'Add route handler and UI',
        title_ko: '라우트 핸들러 및 UI 추가',
        description: 'Register the API route and use the upload button component',
        description_ko: 'API 라우트 등록 후 업로드 버튼 컴포넌트 사용',
        code_snippet: `// src/app/api/uploadthing/route.ts
import { createRouteHandler } from 'uploadthing/next'
import { ourFileRouter } from './core'
export const { GET, POST } = createRouteHandler({ router: ourFileRouter })

// 컴포넌트에서 사용
import { UploadButton } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

<UploadButton<OurFileRouter>
  endpoint="imageUploader"
  onClientUploadComplete={(res) => console.log(res)}
  onUploadError={(err) => console.error(err)}
/>`,
      },
    ],
    code_examples: {
      typescript: `import { generateUploadButton } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

// 타입 안전 컴포넌트 생성
export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()

// 서버사이드 직접 업로드 (API route 등)
import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()

export async function deleteFile(fileKey: string) {
  await utapi.deleteFiles(fileKey)
}`,
    },
    common_pitfalls: [
      {
        title: 'Missing UPLOADTHING_SECRET env var',
        title_ko: 'UPLOADTHING_SECRET 환경변수 누락',
        problem: 'Server starts but upload requests fail with 401',
        solution: 'Set UPLOADTHING_SECRET from the UploadThing dashboard in both local .env.local and production environment',
      },
      {
        title: 'File size limit not enforced on client',
        title_ko: '클라이언트 파일 크기 미검증',
        problem: 'Users can attempt uploads exceeding limits, causing poor UX',
        solution: 'UploadThing enforces limits server-side, but add client-side validation for better UX',
        code: `// 클라이언트 사전 검증
if (file.size > 4 * 1024 * 1024) {
  toast.error('4MB 이하 파일만 업로드 가능합니다')
  return
}`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'After UploadThing upload completes, save the returned file URL to Supabase in the onUploadComplete callback',
        tip_ko: 'onUploadComplete 콜백에서 반환된 URL을 Supabase에 저장',
        code: `onUploadComplete: async ({ metadata, file }) => {
  await supabase.from('files').insert({
    user_id: metadata.userId,
    url: file.url,
    name: file.name,
  })
}`,
      },
    ],
    pros: [
      { text: 'Type-safe file router with end-to-end TypeScript inference', text_ko: 'TypeScript 추론이 가능한 타입 안전 파일 라우터' },
      { text: 'Built-in UI components (UploadButton, UploadDropzone)', text_ko: '빌트인 UI 컴포넌트 제공 (UploadButton, UploadDropzone)' },
      { text: 'Authentication middleware support in file router', text_ko: '파일 라우터에서 인증 미들웨어 지원' },
    ],
    cons: [
      { text: 'Free tier limited to 2 GB storage', text_ko: '무료 티어 2 GB 스토리지 제한' },
      { text: 'Less media transformation capability compared to Cloudinary', text_ko: 'Cloudinary 대비 미디어 변환 기능 부족' },
    ],
    api_key_url: 'https://uploadthing.com/dashboard',
    api_key_url_label: 'UploadThing Dashboard',
  },

  // ---------------------------------------------------------------------------
  // 4. ImageKit
  // ---------------------------------------------------------------------------
  {
    service_id: S.imagekit,
    quick_start: 'ImageKit SDK를 설치하고 URL 엔드포인트를 설정하면 URL 파라미터로 이미지를 실시간 변환하고 CDN으로 전송할 수 있습니다.',
    quick_start_en: 'Install the ImageKit SDK and configure your URL endpoint to transform images in real-time via URL parameters and deliver them over CDN.',
    setup_steps: [
      {
        step: 1,
        title: 'Install ImageKit SDK',
        title_ko: 'ImageKit SDK 설치',
        description: 'Install the ImageKit JavaScript SDK',
        description_ko: 'ImageKit JS SDK 설치',
        code_snippet: 'npm install imagekit imagekit-javascript',
      },
      {
        step: 2,
        title: 'Initialize and configure',
        title_ko: '초기화 및 설정',
        description: 'Configure ImageKit with your credentials',
        description_ko: '자격 증명으로 ImageKit 초기화',
        code_snippet: `import ImageKit from 'imagekit'

// 서버사이드 (비공개 키 포함)
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})`,
      },
      {
        step: 3,
        title: 'Generate optimized URLs',
        title_ko: '최적화 URL 생성',
        description: 'Build transformed image URLs using the SDK',
        description_ko: 'SDK로 변환된 이미지 URL 생성',
        code_snippet: `const url = imagekit.url({
  path: '/default-image.jpg',
  transformation: [
    { height: '300', width: '400' },
    { quality: '80' },
    { format: 'webp' },
  ],
})`,
      },
    ],
    code_examples: {
      typescript: `import ImageKit from 'imagekit'

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

// 파일 업로드
export async function uploadToImageKit(base64: string, fileName: string) {
  const result = await imagekit.upload({
    file: base64,
    fileName,
    folder: '/uploads',
    useUniqueFileName: true,
  })
  return { url: result.url, fileId: result.fileId }
}

// 인증 토큰 생성 (클라이언트 업로드용)
export async function getAuthToken() {
  return imagekit.getAuthenticationParameters()
}`,
    },
    common_pitfalls: [
      {
        title: 'Private key on client side',
        title_ko: '클라이언트에 비공개 키 노출',
        problem: 'Using IMAGEKIT_PRIVATE_KEY in browser code causes security breach',
        solution: 'Generate auth tokens server-side and pass to client for direct uploads',
      },
      {
        title: 'Missing transformation chaining',
        title_ko: '변환 체이닝 누락',
        problem: 'Multiple transformations applied incorrectly, causing unexpected results',
        solution: 'Each object in the transformation array is chained. Use separate objects for sequential transforms.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'cloudinary',
        tip: 'ImageKit is a cost-effective alternative to Cloudinary. Both support URL-based transformations — ImageKit has a more generous free tier (20 GB bandwidth vs Cloudinary 25 credits)',
        tip_ko: 'ImageKit은 Cloudinary의 비용 효율적 대안. 무료 티어 20 GB 대역폭으로 Cloudinary(25크레딧) 대비 유리',
      },
    ],
    pros: [
      { text: 'Generous free tier: 20 GB storage + 20 GB bandwidth', text_ko: '넉넉한 무료 티어: 20 GB 스토리지 + 20 GB 대역폭' },
      { text: 'Real-time URL-based image transformation', text_ko: 'URL 기반 실시간 이미지 변환' },
      { text: 'Built-in media library and folder management', text_ko: '미디어 라이브러리 및 폴더 관리 내장' },
    ],
    cons: [
      { text: 'Smaller ecosystem and community compared to Cloudinary', text_ko: 'Cloudinary 대비 생태계와 커뮤니티 규모 작음' },
      { text: 'Limited video processing features on lower plans', text_ko: '낮은 플랜에서 비디오 처리 기능 제한' },
    ],
    api_key_url: 'https://imagekit.io/dashboard/developer/api-keys',
    api_key_url_label: 'ImageKit Developer API Keys',
  },

  // ---------------------------------------------------------------------------
  // 5. Algolia
  // ---------------------------------------------------------------------------
  {
    service_id: S.algolia,
    quick_start: 'Algolia에 데이터를 인덱싱하고 React InstantSearch를 설치하면 밀리초 단위의 검색을 즉시 구현할 수 있습니다.',
    quick_start_en: 'Index your data to Algolia and install React InstantSearch to implement millisecond-speed search instantly.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Algolia packages',
        title_ko: 'Algolia 패키지 설치',
        description: 'Install algoliasearch client and React InstantSearch',
        description_ko: 'algoliasearch 클라이언트와 React InstantSearch 설치',
        code_snippet: 'npm install algoliasearch react-instantsearch',
      },
      {
        step: 2,
        title: 'Index your data',
        title_ko: '데이터 인덱싱',
        description: 'Push records to Algolia index using the Admin API key (server-side only)',
        description_ko: 'Admin API 키로 레코드를 Algolia 인덱스에 서버사이드 업로드',
        code_snippet: `import algoliasearch from 'algoliasearch'

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!  // 서버사이드 전용
)
const index = client.initIndex('products')

await index.saveObjects([
  { objectID: '1', name: 'iPhone 15', category: 'phones' },
  { objectID: '2', name: 'MacBook Pro', category: 'laptops' },
])`,
      },
      {
        step: 3,
        title: 'Add search UI',
        title_ko: '검색 UI 추가',
        description: 'Use React InstantSearch components for the search interface',
        description_ko: 'React InstantSearch 컴포넌트로 검색 인터페이스 구성',
        code_snippet: `import { InstantSearch, SearchBox, Hits } from 'react-instantsearch'
import algoliasearch from 'algoliasearch/lite'

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!  // 프론트엔드용
)

export function Search() {
  return (
    <InstantSearch searchClient={searchClient} indexName="products">
      <SearchBox />
      <Hits hitComponent={({ hit }) => <div>{hit.name}</div>} />
    </InstantSearch>
  )
}`,
      },
    ],
    code_examples: {
      typescript: `// 서버사이드 인덱싱 (API route)
import algoliasearch from 'algoliasearch'

const adminClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!
)

export async function syncProductsToAlgolia(products: Product[]) {
  const index = adminClient.initIndex('products')
  const records = products.map((p) => ({ ...p, objectID: p.id }))
  await index.saveObjects(records)
}

export async function deleteFromAlgolia(productId: string) {
  const index = adminClient.initIndex('products')
  await index.deleteObject(productId)
}`,
    },
    common_pitfalls: [
      {
        title: 'Admin API key exposed on client',
        title_ko: 'Admin API 키 클라이언트 노출',
        problem: 'Using ALGOLIA_ADMIN_API_KEY in client-side code grants full index write access to anyone',
        solution: 'Use the Search-only API key (NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY) for frontend; Admin key only in server-side code',
      },
      {
        title: 'Missing objectID field',
        title_ko: 'objectID 필드 누락',
        problem: 'saveObjects call fails or creates duplicate records without objectID',
        solution: 'Always map your primary key to objectID when indexing records',
        code: `const records = items.map((item) => ({ ...item, objectID: item.id }))`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Use Supabase DB webhooks or pg_net to sync records to Algolia on INSERT/UPDATE/DELETE, keeping search index in sync automatically',
        tip_ko: 'Supabase DB 웹훅 또는 pg_net으로 INSERT/UPDATE/DELETE 시 Algolia 인덱스 자동 동기화',
      },
      {
        with_service_slug: 'meilisearch',
        tip: 'Algolia suits teams needing managed infrastructure; Meilisearch is a self-hostable alternative with no record limits on free tier',
        tip_ko: '관리형 인프라 필요 시 Algolia, 셀프 호스팅과 레코드 무제한이 필요하면 Meilisearch 고려',
      },
    ],
    pros: [
      { text: 'Sub-10ms search response with global CDN infrastructure', text_ko: '글로벌 CDN 인프라로 10ms 미만 검색 응답' },
      { text: 'Rich InstantSearch UI components for React, Vue, Angular', text_ko: 'React/Vue/Angular용 InstantSearch UI 컴포넌트 풍부' },
      { text: 'Built-in analytics, A/B testing, and AI recommendations', text_ko: '분석, A/B 테스트, AI 추천 내장' },
    ],
    cons: [
      { text: 'Vendor lock-in due to proprietary query language and pricing model', text_ko: '독점 쿼리 언어와 가격 모델로 벤더 종속성 높음' },
      { text: 'Free tier limited to 10K records and 10K searches/month', text_ko: '무료 티어 레코드 10K, 검색 10K/월 제한' },
    ],
    api_key_url: 'https://dashboard.algolia.com/account/api-keys',
    api_key_url_label: 'Algolia API Keys',
  },

  // ---------------------------------------------------------------------------
  // 6. Meilisearch
  // ---------------------------------------------------------------------------
  {
    service_id: S.meilisearch,
    quick_start: 'Meilisearch 클라우드 또는 Docker로 인스턴스를 실행하고 SDK로 문서를 인덱싱하면 타이포 허용 즉시 검색을 구현할 수 있습니다.',
    quick_start_en: 'Run a Meilisearch instance via cloud or Docker, then index documents with the SDK to implement typo-tolerant instant search.',
    setup_steps: [
      {
        step: 1,
        title: 'Start Meilisearch',
        title_ko: 'Meilisearch 시작',
        description: 'Run Meilisearch locally with Docker or create a Meilisearch Cloud instance',
        description_ko: 'Docker로 로컬 실행 또는 Meilisearch Cloud 인스턴스 생성',
        code_snippet: `# Docker로 로컬 실행
docker run -d -p 7700:7700 \\
  -e MEILI_MASTER_KEY=your_master_key \\
  getmeili/meilisearch:latest

# 또는 Meilisearch Cloud: https://cloud.meilisearch.com`,
      },
      {
        step: 2,
        title: 'Install and index',
        title_ko: '설치 및 인덱싱',
        description: 'Install the JS client and index your documents',
        description_ko: 'JS 클라이언트 설치 후 문서 인덱싱',
        code_snippet: `npm install meilisearch

// 서버사이드 인덱싱
import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST!,
  apiKey: process.env.MEILISEARCH_ADMIN_API_KEY!,
})

const index = client.index('products')
await index.addDocuments([
  { id: 1, name: 'iPhone 15', category: 'phones' },
])`,
      },
      {
        step: 3,
        title: 'Search with scoped key',
        title_ko: '범위 키로 검색',
        description: 'Use a search-only scoped API key for frontend queries',
        description_ko: '검색 전용 범위 키로 프론트엔드 쿼리 실행',
        code_snippet: `import { MeiliSearch } from 'meilisearch'

const searchClient = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST!,
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_API_KEY!,
})

const results = await searchClient.index('products').search('iphone', {
  limit: 10,
  attributesToHighlight: ['name'],
})`,
      },
    ],
    code_examples: {
      typescript: `import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST!,
  apiKey: process.env.MEILISEARCH_ADMIN_API_KEY!,
})

// 인덱스 설정 (검색 가능 속성, 필터 등)
const index = client.index('products')
await index.updateSettings({
  searchableAttributes: ['name', 'description'],
  filterableAttributes: ['category', 'price'],
  sortableAttributes: ['price', 'createdAt'],
})

// 검색 with 필터
const results = await index.search('laptop', {
  filter: 'category = "electronics" AND price < 2000',
  sort: ['price:asc'],
  limit: 20,
})`,
    },
    common_pitfalls: [
      {
        title: 'Master key used as search key',
        title_ko: '마스터 키를 검색 키로 사용',
        problem: 'Using MEILI_MASTER_KEY on the client gives full admin access including deletion',
        solution: 'Create scoped API keys with search-only permissions for frontend use',
        code: `// 범위 키 생성 (서버사이드)
const searchKey = await client.generateTenantToken(
  'search-key-uid',
  [{ indexesPattern: 'products', searchRules: {} }],
  { expiresAt: new Date(Date.now() + 86400000) }
)`,
      },
      {
        title: 'Documents missing primary key',
        title_ko: '문서에 기본 키 필드 누락',
        problem: 'addDocuments fails if documents lack an "id" field or configured primary key',
        solution: 'Ensure each document has an "id" field, or configure primaryKey when creating index',
        code: `await client.index('products').addDocuments(docs, { primaryKey: 'productId' })`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'algolia',
        tip: 'Meilisearch is self-hostable and open-source with no record limits; Algolia offers managed cloud with richer analytics. Migrate between them using the same InstantSearch adapter.',
        tip_ko: 'Meilisearch는 오픈소스 셀프 호스팅으로 레코드 무제한, Algolia는 관리형 클라우드로 풍부한 분석 제공',
      },
    ],
    pros: [
      { text: 'Open-source and self-hostable — no vendor lock-in', text_ko: '오픈소스 셀프 호스팅 가능 — 벤더 종속성 없음' },
      { text: 'Typo-tolerant search out of the box', text_ko: '타이포 허용 검색 기본 제공' },
      { text: 'Simple REST API, no complex configuration needed', text_ko: '단순한 REST API, 복잡한 설정 불필요' },
    ],
    cons: [
      { text: 'Self-hosting requires infrastructure management', text_ko: '셀프 호스팅 시 인프라 관리 필요' },
      { text: 'Less mature ecosystem than Algolia (fewer plugins/integrations)', text_ko: 'Algolia 대비 생태계 미성숙 (플러그인/통합 부족)' },
    ],
    api_key_url: 'https://cloud.meilisearch.com',
    api_key_url_label: 'Meilisearch Cloud',
  },

  // ---------------------------------------------------------------------------
  // 7. Sanity
  // ---------------------------------------------------------------------------
  {
    service_id: S.sanity,
    quick_start: 'Sanity CLI로 프로젝트를 생성하고 Next.js와 연결하면 커스터마이징 가능한 CMS와 GROQ 쿼리로 콘텐츠를 즉시 관리할 수 있습니다.',
    quick_start_en: 'Create a Sanity project with the CLI and connect it to Next.js to instantly manage content with a customizable CMS and GROQ queries.',
    setup_steps: [
      {
        step: 1,
        title: 'Create Sanity project',
        title_ko: 'Sanity 프로젝트 생성',
        description: 'Initialize a new Sanity project with the CLI',
        description_ko: 'CLI로 새 Sanity 프로젝트 초기화',
        code_snippet: `npm create sanity@latest
# 또는 기존 Next.js 프로젝트에 추가
npm install next-sanity @sanity/image-url`,
      },
      {
        step: 2,
        title: 'Configure Sanity client',
        title_ko: 'Sanity 클라이언트 설정',
        description: 'Create a Sanity client with your project credentials',
        description_ko: '프로젝트 자격 증명으로 Sanity 클라이언트 생성',
        code_snippet: `// src/lib/sanity.ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})`,
      },
      {
        step: 3,
        title: 'Query with GROQ',
        title_ko: 'GROQ로 쿼리',
        description: 'Fetch content using GROQ query language',
        description_ko: 'GROQ 쿼리 언어로 콘텐츠 패치',
        code_snippet: `import { client } from '@/lib/sanity'

// 모든 게시글 조회
const posts = await client.fetch(\`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    "author": author->name,
    mainImage
  }
\`)`,
      },
    ],
    code_examples: {
      typescript: `import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN, // 쓰기 작업 시 필요
})

const builder = imageUrlBuilder(client)

export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max')
}

// 콘텐츠 생성 (서버사이드)
export async function createPost(title: string, body: unknown[]) {
  return client.create({ _type: 'post', title, body })
}`,
    },
    common_pitfalls: [
      {
        title: 'CORS not configured for Studio',
        title_ko: 'Studio CORS 미설정',
        problem: 'Sanity Studio shows CORS error when deployed to a custom domain',
        solution: 'Add your deployment URL to CORS origins in Sanity project settings (manage.sanity.io)',
      },
      {
        title: 'useCdn: true for mutations',
        title_ko: '뮤테이션 시 useCdn: true 사용',
        problem: 'Fresh content not returned after create/update when useCdn is enabled',
        solution: 'Use useCdn: false for write operations, or use two clients (one for read with CDN, one for writes)',
        code: `const writeClient = createClient({ ...config, useCdn: false, token: process.env.SANITY_API_TOKEN })`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Use Sanity webhook + Vercel Deploy Hook to trigger revalidation when content changes in Sanity Studio',
        tip_ko: 'Sanity 웹훅 + Vercel Deploy Hook으로 Studio 콘텐츠 변경 시 자동 재빌드',
        code: `// pages/api/revalidate.ts
export default async function handler(req, res) {
  await res.revalidate('/blog')
  return res.json({ revalidated: true })
}`,
      },
      {
        with_service_slug: 'contentful',
        tip: 'Both are headless CMS options. Sanity excels at custom schemas and real-time collaboration; Contentful suits larger teams needing enterprise support.',
        tip_ko: 'Sanity는 커스텀 스키마와 실시간 협업에 강점, Contentful은 엔터프라이즈 지원이 필요한 대형 팀에 적합',
      },
    ],
    pros: [
      { text: 'Fully customizable Studio (CMS UI built in React)', text_ko: '완전 커스터마이징 가능한 Studio (React 기반 CMS UI)' },
      { text: 'Real-time collaborative editing', text_ko: '실시간 공동 편집 지원' },
      { text: 'Powerful GROQ query language for flexible data fetching', text_ko: '유연한 데이터 패칭을 위한 강력한 GROQ 쿼리 언어' },
    ],
    cons: [
      { text: 'GROQ learning curve for developers unfamiliar with it', text_ko: 'GROQ 쿼리 언어 학습 곡선' },
      { text: 'Studio customization requires React knowledge', text_ko: 'Studio 커스터마이징에 React 지식 필요' },
    ],
    api_key_url: 'https://www.sanity.io/manage',
    api_key_url_label: 'Sanity Manage',
  },

  // ---------------------------------------------------------------------------
  // 8. Contentful
  // ---------------------------------------------------------------------------
  {
    service_id: S.contentful,
    quick_start: 'Contentful SDK를 설치하고 Space ID와 Access Token을 설정하면 REST/GraphQL API로 콘텐츠를 즉시 패치할 수 있습니다.',
    quick_start_en: 'Install the Contentful SDK and configure Space ID and Access Token to instantly fetch content via REST or GraphQL API.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Contentful SDK',
        title_ko: 'Contentful SDK 설치',
        description: 'Install the Contentful JavaScript delivery client',
        description_ko: 'Contentful JS 전송 클라이언트 설치',
        code_snippet: 'npm install contentful',
      },
      {
        step: 2,
        title: 'Initialize client',
        title_ko: '클라이언트 초기화',
        description: 'Create a Contentful client with Space ID and Access Token',
        description_ko: 'Space ID와 Access Token으로 Contentful 클라이언트 생성',
        code_snippet: `import { createClient } from 'contentful'

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

// 미리보기용 클라이언트
export const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
  host: 'preview.contentful.com',
})`,
      },
      {
        step: 3,
        title: 'Fetch entries',
        title_ko: '엔트리 패치',
        description: 'Query content entries by content type',
        description_ko: '콘텐츠 타입으로 엔트리 쿼리',
        code_snippet: `const entries = await contentfulClient.getEntries({
  content_type: 'blogPost',
  order: ['-sys.createdAt'],
  limit: 10,
})

entries.items.forEach((entry) => {
  console.log(entry.fields.title)
})`,
      },
    ],
    code_examples: {
      typescript: `import { createClient, type EntrySkeletonType } from 'contentful'

interface BlogPostFields {
  title: string;
  slug: string;
  body: unknown;
  publishedAt: string;
}

type BlogPostSkeleton = EntrySkeletonType<BlogPostFields, 'blogPost'>

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export async function getBlogPosts() {
  const entries = await client.getEntries<BlogPostSkeleton>({
    content_type: 'blogPost',
    order: ['-fields.publishedAt'],
  })
  return entries.items
}

export async function getBlogPostBySlug(slug: string) {
  const entries = await client.getEntries<BlogPostSkeleton>({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  })
  return entries.items[0] ?? null
}`,
    },
    common_pitfalls: [
      {
        title: 'Preview token vs delivery token confusion',
        title_ko: '미리보기 토큰과 전송 토큰 혼동',
        problem: 'Using Delivery token for preview pages shows only published content',
        solution: 'Use Preview Access Token with host: "preview.contentful.com" for draft content',
      },
      {
        title: 'Rich text rendering requires renderer',
        title_ko: '리치 텍스트 렌더링에 렌더러 필요',
        problem: 'Body field returns a Rich Text object, not HTML — rendering as-is shows raw JSON',
        solution: 'Use @contentful/rich-text-react-renderer to convert Rich Text to React components',
        code: `import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
const rendered = documentToReactComponents(entry.fields.body)`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Set up a Contentful webhook to call a Vercel Deploy Hook URL on content publish, triggering automatic redeployment',
        tip_ko: 'Contentful 웹훅으로 콘텐츠 게시 시 Vercel Deploy Hook 호출해 자동 재배포',
      },
      {
        with_service_slug: 'sanity',
        tip: 'Contentful suits enterprise teams with structured workflows; Sanity offers more flexibility for custom content models. Both support Next.js equally well.',
        tip_ko: 'Contentful은 구조화된 워크플로우가 있는 엔터프라이즈 팀에 적합, Sanity는 커스텀 콘텐츠 모델에 더 유연',
      },
    ],
    pros: [
      { text: 'Enterprise-grade reliability and SLA guarantees', text_ko: '엔터프라이즈급 안정성과 SLA 보증' },
      { text: 'Intuitive content editor UI for non-technical teams', text_ko: '비기술 팀을 위한 직관적인 콘텐츠 편집기 UI' },
      { text: 'GraphQL and REST APIs out of the box', text_ko: 'GraphQL과 REST API 기본 제공' },
    ],
    cons: [
      { text: 'Team plan ($300/month) is a steep jump from the free tier', text_ko: '팀 플랜 $300/월로 무료 티어에서 큰 가격 격차' },
      { text: 'Limited customization of the editing UI compared to Sanity', text_ko: 'Sanity 대비 편집 UI 커스터마이징 제한' },
    ],
    api_key_url: 'https://app.contentful.com/account/profile/cma_tokens',
    api_key_url_label: 'Contentful API Keys',
  },

  // ---------------------------------------------------------------------------
  // 9. Strapi
  // ---------------------------------------------------------------------------
  {
    service_id: S.strapi,
    quick_start: 'Strapi CLI로 새 프로젝트를 생성하면 자동 생성된 REST/GraphQL API와 Admin 패널을 갖춘 헤드리스 CMS를 즉시 실행할 수 있습니다.',
    quick_start_en: 'Create a new Strapi project with the CLI to instantly run a headless CMS with auto-generated REST/GraphQL APIs and an Admin panel.',
    setup_steps: [
      {
        step: 1,
        title: 'Create Strapi project',
        title_ko: 'Strapi 프로젝트 생성',
        description: 'Bootstrap a new Strapi project with the interactive CLI',
        description_ko: 'CLI로 새 Strapi 프로젝트 생성',
        code_snippet: `npx create-strapi-app@latest my-cms --quickstart
# 또는 커스텀 설정
npx create-strapi-app@latest my-cms`,
      },
      {
        step: 2,
        title: 'Create content type and API token',
        title_ko: '콘텐츠 타입 및 API 토큰 생성',
        description: 'Create a content type via Admin UI, then generate an API token',
        description_ko: 'Admin UI에서 콘텐츠 타입 생성 후 API 토큰 발급',
        code_snippet: `# Admin panel: http://localhost:1337/admin
# Settings → API Tokens → Create new API Token
# 토큰 타입: Read-only (프론트엔드), Full-access (관리용)`,
      },
      {
        step: 3,
        title: 'Fetch from Next.js',
        title_ko: 'Next.js에서 패치',
        description: 'Call the Strapi REST API from your Next.js app',
        description_ko: 'Next.js 앱에서 Strapi REST API 호출',
        code_snippet: `const res = await fetch(\`\${process.env.STRAPI_URL}/api/articles?populate=*\`, {
  headers: {
    Authorization: \`Bearer \${process.env.STRAPI_API_TOKEN}\`,
  },
  next: { revalidate: 60 },
})
const { data } = await res.json()`,
      },
    ],
    code_examples: {
      typescript: `// lib/strapi.ts
const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN!

async function strapiRequest<T>(path: string): Promise<T> {
  const res = await fetch(\`\${STRAPI_URL}/api\${path}\`, {
    headers: { Authorization: \`Bearer \${STRAPI_TOKEN}\` },
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(\`Strapi error: \${res.status}\`)
  const json = await res.json()
  return json.data as T
}

// 사용 예
interface Article {
  id: number
  attributes: { title: string; content: string; publishedAt: string }
}

export const getArticles = () => strapiRequest<Article[]>('/articles?populate=*')
export const getArticle = (id: number) => strapiRequest<Article>(\`/articles/\${id}?populate=*\`)`,
    },
    common_pitfalls: [
      {
        title: 'Public API without token',
        title_ko: 'API 토큰 없는 공개 API',
        problem: 'Strapi endpoints are public by default; unauthenticated requests can read all data',
        solution: 'Set content type permissions to require authentication in Settings → Roles → Public',
      },
      {
        title: 'Strapi v4 vs v5 API differences',
        title_ko: 'Strapi v4와 v5 API 차이',
        problem: 'Response structure changed in Strapi v5 — data wrapped differently than v4',
        solution: 'Check Strapi version and use matching response structure. v5 uses flat response format.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Deploy Strapi on Railway or Render and use Strapi webhook to trigger Vercel revalidation on content publish',
        tip_ko: 'Strapi를 Railway/Render에 배포하고, 콘텐츠 게시 시 Strapi 웹훅으로 Vercel 재검증 트리거',
      },
    ],
    pros: [
      { text: 'Fully open-source, self-hostable with no license cost', text_ko: '완전 오픈소스, 셀프 호스팅으로 라이선스 비용 없음' },
      { text: 'Auto-generated REST and GraphQL APIs from content types', text_ko: '콘텐츠 타입에서 REST/GraphQL API 자동 생성' },
    ],
    cons: [
      { text: 'Requires managing your own server/database for self-hosting', text_ko: '셀프 호스팅 시 서버/DB 직접 관리 필요' },
      { text: 'Plugin ecosystem smaller than WordPress', text_ko: 'WordPress 대비 플러그인 생태계 소규모' },
    ],
    api_key_url: 'https://cloud.strapi.io',
    api_key_url_label: 'Strapi Cloud',
  },

  // ---------------------------------------------------------------------------
  // 10. Datadog
  // ---------------------------------------------------------------------------
  {
    service_id: S.datadog,
    quick_start: 'Datadog Agent를 설치하거나 dd-trace SDK를 추가하면 인프라 메트릭, APM 트레이싱, 로그를 즉시 수집할 수 있습니다.',
    quick_start_en: 'Install the Datadog Agent or add the dd-trace SDK to instantly collect infrastructure metrics, APM traces, and logs.',
    setup_steps: [
      {
        step: 1,
        title: 'Install dd-trace',
        title_ko: 'dd-trace 설치',
        description: 'Install the Datadog APM tracing library for Node.js',
        description_ko: 'Node.js용 Datadog APM 트레이싱 라이브러리 설치',
        code_snippet: 'npm install dd-trace',
      },
      {
        step: 2,
        title: 'Initialize tracer',
        title_ko: '트레이서 초기화',
        description: 'Initialize dd-trace at the top of your application entry point',
        description_ko: '애플리케이션 진입점 최상단에서 dd-trace 초기화',
        code_snippet: `// Must be the very first import/require
import tracer from 'dd-trace'

tracer.init({
  service: 'my-nextjs-app',
  env: process.env.NODE_ENV,
  version: process.env.npm_package_version,
  logInjection: true,
})`,
      },
      {
        step: 3,
        title: 'Send logs to Datadog',
        title_ko: 'Datadog에 로그 전송',
        description: 'Configure logging to send structured logs to Datadog',
        description_ko: '구조화된 로그를 Datadog에 전송하도록 로깅 설정',
        code_snippet: `# GitHub Actions / CI에서 DD_API_KEY 환경변수로 설정
DD_API_KEY=your_api_key
DD_SITE=datadoghq.com
DD_SERVICE=my-app
DD_ENV=production`,
      },
    ],
    code_examples: {
      typescript: `import tracer from 'dd-trace'
import StatsD from 'hot-shots'

// APM 트레이서 초기화 (진입점에서)
tracer.init({ service: 'api', env: 'production' })

// 커스텀 메트릭 전송
const dogstatsd = new StatsD({ host: 'localhost', port: 8125 })

export function trackEvent(name: string, tags: string[] = []) {
  dogstatsd.increment(\`app.\${name}\`, 1, tags)
}

export function trackTiming(name: string, durationMs: number) {
  dogstatsd.timing(\`app.\${name}.duration\`, durationMs)
}

// 커스텀 스팬 생성
export async function withSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const span = tracer.startSpan(name)
  try {
    const result = await fn()
    span.finish()
    return result
  } catch (err) {
    span.setTag('error', err)
    span.finish()
    throw err
  }
}`,
    },
    common_pitfalls: [
      {
        title: 'Tracer not initialized before other imports',
        title_ko: '트레이서를 다른 import보다 먼저 초기화하지 않음',
        problem: 'dd-trace must be initialized before any other module to patch them correctly',
        solution: 'Import and call tracer.init() as the absolute first line in your entry file',
        code: `// instrumentation.ts (Next.js)
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const tracer = (await import('dd-trace')).default
    tracer.init({ service: 'my-app' })
  }
}`,
      },
      {
        title: 'High cardinality tags causing cost explosion',
        title_ko: '높은 카디널리티 태그로 비용 폭증',
        problem: 'Using user IDs or request IDs as metric tags creates millions of unique timeseries',
        solution: 'Only use low-cardinality tags (env, service, endpoint) for metrics. Use traces for high-cardinality data.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'github-actions',
        tip: 'Use the Datadog CI GitHub Action to send test results, build time, and coverage metrics from GitHub Actions to Datadog',
        tip_ko: 'Datadog CI GitHub Action으로 테스트 결과, 빌드 시간, 커버리지를 Datadog에 전송',
      },
      {
        with_service_slug: 'grafana',
        tip: 'Datadog can export metrics to Grafana via the Datadog data source plugin, or use both independently for different audiences',
        tip_ko: 'Datadog 데이터 소스 플러그인으로 Grafana에 메트릭 내보내기 가능, 또는 용도에 따라 독립 운용',
      },
    ],
    pros: [
      { text: 'Unified platform: APM, logs, metrics, infrastructure in one UI', text_ko: '통합 플랫폼: APM, 로그, 메트릭, 인프라를 하나의 UI로' },
      { text: 'Automatic instrumentation for 200+ frameworks and libraries', text_ko: '200개 이상 프레임워크/라이브러리 자동 계측' },
      { text: 'Powerful alerting and anomaly detection', text_ko: '강력한 알림 및 이상 감지' },
    ],
    cons: [
      { text: 'Cost scales quickly — easy to incur unexpectedly high bills', text_ko: '비용이 빠르게 증가 — 예상치 못한 높은 청구 발생 용이' },
      { text: 'Steep learning curve for full platform adoption', text_ko: '플랫폼 전체 활용에 높은 학습 곡선' },
    ],
    api_key_url: 'https://app.datadoghq.com/organization-settings/api-keys',
    api_key_url_label: 'Datadog API Keys',
  },

  // ---------------------------------------------------------------------------
  // 11. Grafana
  // ---------------------------------------------------------------------------
  {
    service_id: S.grafana,
    quick_start: 'Grafana Cloud에 가입하거나 Docker로 Grafana를 실행하면 Prometheus, Loki 등 다양한 데이터 소스를 연결해 즉시 대시보드를 구축할 수 있습니다.',
    quick_start_en: 'Sign up for Grafana Cloud or run Grafana with Docker to instantly build dashboards by connecting Prometheus, Loki, and other data sources.',
    setup_steps: [
      {
        step: 1,
        title: 'Start Grafana',
        title_ko: 'Grafana 실행',
        description: 'Run Grafana locally with Docker or sign up for Grafana Cloud',
        description_ko: 'Docker로 로컬 실행 또는 Grafana Cloud 가입',
        code_snippet: `docker run -d -p 3000:3000 --name=grafana \\
  -e GF_SECURITY_ADMIN_PASSWORD=secret \\
  grafana/grafana-oss:latest
# 접속: http://localhost:3000 (admin/secret)`,
      },
      {
        step: 2,
        title: 'Add data source',
        title_ko: '데이터 소스 추가',
        description: 'Connect Prometheus, Loki, or other data sources via the UI',
        description_ko: 'UI에서 Prometheus, Loki 등 데이터 소스 연결',
        code_snippet: `# Grafana UI → Connections → Add new data source
# 또는 provisioning/datasources/prometheus.yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090
    isDefault: true`,
      },
      {
        step: 3,
        title: 'Push metrics via Grafana Foundation SDK',
        title_ko: 'Foundation SDK로 메트릭 전송',
        description: 'Send custom metrics from Node.js using Prometheus client',
        description_ko: 'Prometheus 클라이언트로 Node.js 커스텀 메트릭 전송',
        code_snippet: `npm install prom-client

import { Counter, Histogram, register } from 'prom-client'

export const httpRequests = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
})

// /metrics 엔드포인트 노출
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.send(await register.metrics())
})`,
      },
    ],
    code_examples: {
      typescript: `import { Counter, Histogram, register } from 'prom-client'

// 커스텀 메트릭 정의
const requestCounter = new Counter({
  name: 'app_requests_total',
  help: 'Total number of requests',
  labelNames: ['method', 'path', 'status'] as const,
})

const requestDuration = new Histogram({
  name: 'app_request_duration_ms',
  help: 'Request duration in milliseconds',
  labelNames: ['method', 'path'] as const,
  buckets: [10, 50, 100, 200, 500, 1000],
})

// Next.js middleware에서 사용
export function trackRequest(method: string, path: string, status: number, durationMs: number) {
  requestCounter.inc({ method, path, status: String(status) })
  requestDuration.observe({ method, path }, durationMs)
}

// /api/metrics route
export async function GET() {
  return new Response(await register.metrics(), {
    headers: { 'Content-Type': register.contentType },
  })
}`,
    },
    common_pitfalls: [
      {
        title: 'Exposing /metrics endpoint publicly',
        title_ko: '/metrics 엔드포인트 공개 노출',
        problem: 'Prometheus /metrics endpoint exposes internal application details publicly',
        solution: 'Protect /metrics with IP allowlist, basic auth, or serve on a separate internal port',
      },
      {
        title: 'High cardinality label values',
        title_ko: '높은 카디널리티 레이블 값',
        problem: 'Using user IDs or UUIDs as label values causes Prometheus memory explosion',
        solution: 'Only use low-cardinality labels (status codes, HTTP methods, route patterns)',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'datadog',
        tip: 'Grafana is open-source and self-hostable with full flexibility; Datadog is a managed SaaS with tighter integrations. Use Grafana when you need cost control and data sovereignty.',
        tip_ko: 'Grafana는 오픈소스 셀프 호스팅으로 비용 제어와 데이터 주권 필요 시 유리, Datadog은 관리형 SaaS로 빠른 통합에 유리',
      },
      {
        with_service_slug: 'new-relic',
        tip: 'Export Grafana dashboards to New Relic using the New Relic data source plugin, enabling unified visibility across both platforms',
        tip_ko: 'New Relic 데이터 소스 플러그인으로 Grafana 대시보드를 New Relic으로 내보내 통합 가시성 확보',
      },
    ],
    pros: [
      { text: 'Open-source with massive plugin and dashboard ecosystem', text_ko: '오픈소스로 방대한 플러그인 및 대시보드 생태계' },
      { text: 'Connects to 80+ data sources (Prometheus, Loki, InfluxDB, etc.)', text_ko: '80개 이상 데이터 소스 연결 (Prometheus, Loki, InfluxDB 등)' },
      { text: 'Grafana Cloud free tier includes 10K metrics and 50 GB logs', text_ko: 'Grafana Cloud 무료 티어에 10K 메트릭, 50 GB 로그 포함' },
    ],
    cons: [
      { text: 'Self-hosting requires Prometheus/Loki setup and maintenance', text_ko: '셀프 호스팅 시 Prometheus/Loki 설정 및 유지 관리 필요' },
      { text: 'Alert configuration less intuitive than Datadog or New Relic', text_ko: 'Datadog/New Relic 대비 알림 설정이 덜 직관적' },
    ],
    api_key_url: 'https://grafana.com/orgs/me',
    api_key_url_label: 'Grafana Cloud API Keys',
  },

  // ---------------------------------------------------------------------------
  // 12. New Relic
  // ---------------------------------------------------------------------------
  {
    service_id: S.new_relic,
    quick_start: 'New Relic APM 에이전트를 설치하면 애플리케이션 성능, 에러, 인프라 메트릭을 자동으로 수집하고 대시보드에서 확인할 수 있습니다.',
    quick_start_en: 'Install the New Relic APM agent to automatically collect application performance, errors, and infrastructure metrics visible in the dashboard.',
    setup_steps: [
      {
        step: 1,
        title: 'Install New Relic agent',
        title_ko: 'New Relic 에이전트 설치',
        description: 'Install the newrelic Node.js APM agent',
        description_ko: 'newrelic Node.js APM 에이전트 설치',
        code_snippet: 'npm install newrelic',
      },
      {
        step: 2,
        title: 'Configure the agent',
        title_ko: '에이전트 설정',
        description: 'Set license key and app name via environment variables',
        description_ko: '환경변수로 라이선스 키와 앱 이름 설정',
        code_snippet: `NEW_RELIC_LICENSE_KEY=your_license_key
NEW_RELIC_APP_NAME=my-nextjs-app
NEW_RELIC_LOG_LEVEL=info`,
      },
      {
        step: 3,
        title: 'Initialize before app startup',
        title_ko: '앱 시작 전 초기화',
        description: 'Require newrelic at the very start of your application',
        description_ko: '애플리케이션 최상단에서 newrelic require',
        code_snippet: `// Next.js instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('newrelic')
  }
}`,
      },
    ],
    code_examples: {
      typescript: `import newrelic from 'newrelic'

// 커스텀 이벤트 기록
export function trackCustomEvent(eventName: string, attributes: Record<string, string | number>) {
  newrelic.recordCustomEvent(eventName, attributes)
}

// 커스텀 메트릭
export function recordMetric(name: string, value: number) {
  newrelic.recordMetric(\`Custom/\${name}\`, value)
}

// 에러 수동 보고
export function reportError(error: Error, attributes?: Record<string, string>) {
  newrelic.noticeError(error, attributes)
}

// 트랜잭션 이름 설정
export function setTransactionName(name: string) {
  newrelic.setTransactionName(name)
}`,
    },
    common_pitfalls: [
      {
        title: 'Agent not initialized before first require',
        title_ko: '에이전트가 첫 require 전에 초기화되지 않음',
        problem: 'New Relic must be the first require/import to correctly instrument other modules',
        solution: 'Use Next.js instrumentation.ts to load newrelic before the app initializes',
      },
      {
        title: 'License key vs API key confusion',
        title_ko: '라이선스 키와 API 키 혼동',
        problem: 'Using the user API key (NEW_RELIC_API_KEY) for agent instead of license key',
        solution: 'NEW_RELIC_LICENSE_KEY is for the agent. NEW_RELIC_API_KEY (Ingest or User) is for the NerdGraph/REST API.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'grafana',
        tip: 'Connect New Relic as a Grafana data source to display New Relic metrics alongside other data sources in unified Grafana dashboards',
        tip_ko: 'Grafana에 New Relic 데이터 소스를 추가해 다른 데이터 소스와 함께 통합 대시보드 구성',
      },
      {
        with_service_slug: 'datadog',
        tip: 'New Relic offers 100 GB free data ingest per month vs Datadog\'s limited free tier — evaluate based on data volume and feature needs',
        tip_ko: 'New Relic은 월 100 GB 무료 데이터 수집 제공, Datadog 대비 대용량 데이터 환경에서 비용 유리',
      },
    ],
    pros: [
      { text: 'Generous free tier: 100 GB/month data ingest, 1 full-platform user', text_ko: '넉넉한 무료 티어: 월 100 GB 데이터 수집, 1명 전체 플랫폼 사용자' },
      { text: 'Full-stack observability: APM, browser, mobile, infrastructure', text_ko: '풀스택 관찰 가능성: APM, 브라우저, 모바일, 인프라' },
      { text: 'NRQL query language for powerful custom analysis', text_ko: 'NRQL 쿼리 언어로 강력한 커스텀 분석' },
    ],
    cons: [
      { text: 'Standard plan ($99/user/month) is expensive for teams', text_ko: '스탠다드 플랜 $99/사용자/월로 팀 규모에 비용 부담' },
      { text: 'NRQL learning curve for developers unfamiliar with it', text_ko: 'NRQL 쿼리 언어 학습 곡선' },
    ],
    api_key_url: 'https://one.newrelic.com/api-keys',
    api_key_url_label: 'New Relic API Keys',
  },
];
