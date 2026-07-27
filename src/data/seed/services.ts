import type { ServiceCategory, ServiceDomain, DifficultyLevel, FreeTierQuality, VendorLockInRisk, EnvVarTemplate, DashboardLayer, DashboardSubcategory } from '@/types';

// ---------------------------------------------------------------------------
// Seed-specific types: omit auto-generated fields (created_at, updated_at)
// ---------------------------------------------------------------------------

export interface ServiceSeed {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  description: string;
  description_ko: string;
  icon_url: string | null;
  website_url: string;
  docs_url: string;
  pricing_info: Record<string, unknown>;
  required_env_vars: EnvVarTemplate[];
  // V2 extended fields
  domain?: ServiceDomain;
  subcategory?: string;
  popularity_score?: number;
  difficulty_level?: DifficultyLevel;
  tags?: string[];
  alternatives?: string[];
  compatibility?: { framework?: string[]; language?: string[] };
  official_sdks?: Record<string, string>;
  free_tier_quality?: FreeTierQuality;
  vendor_lock_in_risk?: VendorLockInRisk;
  setup_time_minutes?: number;
  monthly_cost_estimate?: Record<string, string>;
  github_stars?: number | null;
  // Dashboard fields
  dashboard_layer?: DashboardLayer;
  dashboard_subcategory?: DashboardSubcategory | string;
}

export interface ChecklistItemSeed {
  id: string;
  service_id: string;
  order_index: number;
  title: string;
  title_ko: string;
  description: string;
  description_ko: string;
  guide_url: string | null;
}

// ---------------------------------------------------------------------------
// Fixed UUIDs – deterministic so seed operations are idempotent
// ---------------------------------------------------------------------------

const SERVICE_IDS = {
  supabase: '10000000-0000-4000-a000-000000000001',
  firebase: '10000000-0000-4000-a000-000000000002',
  vercel: '10000000-0000-4000-a000-000000000003',
  netlify: '10000000-0000-4000-a000-000000000004',
  stripe: '10000000-0000-4000-a000-000000000005',
  clerk: '10000000-0000-4000-a000-000000000006',
  nextauth: '10000000-0000-4000-a000-000000000007',
  resend: '10000000-0000-4000-a000-000000000008',
  sendgrid: '10000000-0000-4000-a000-000000000009',
  openai: '10000000-0000-4000-a000-000000000010',
  anthropic: '10000000-0000-4000-a000-000000000011',
  cloudinary: '10000000-0000-4000-a000-000000000012',
  sentry: '10000000-0000-4000-a000-000000000013',
  planetscale: '10000000-0000-4000-a000-000000000014',
  neon: '10000000-0000-4000-a000-000000000015',
  railway: '10000000-0000-4000-a000-000000000016',
  lemonsqueezy: '10000000-0000-4000-a000-000000000017',
  uploadthing: '10000000-0000-4000-a000-000000000018',
  posthog: '10000000-0000-4000-a000-000000000019',
  awss3: '10000000-0000-4000-a000-000000000020',
  github_actions: '10000000-0000-4000-a000-000000000021',
  twilio: '10000000-0000-4000-a000-000000000022',
  onesignal: '10000000-0000-4000-a000-000000000023',
  algolia: '10000000-0000-4000-a000-000000000024',
  sanity: '10000000-0000-4000-a000-000000000025',
  ga4: '10000000-0000-4000-a000-000000000026',
  upstash_redis: '10000000-0000-4000-a000-000000000027',
  cloudflare: '10000000-0000-4000-a000-000000000028',
  fly_io: '10000000-0000-4000-a000-000000000029',
  datadog: '10000000-0000-4000-a000-000000000030',
  mixpanel: '10000000-0000-4000-a000-000000000031',
  contentful: '10000000-0000-4000-a000-000000000032',
  meilisearch: '10000000-0000-4000-a000-000000000033',
  pusher: '10000000-0000-4000-a000-000000000034',
  trigger_dev: '10000000-0000-4000-a000-000000000035',
  launchdarkly: '10000000-0000-4000-a000-000000000036',
  groq: '10000000-0000-4000-a000-000000000037',
  render: '10000000-0000-4000-a000-000000000038',
  logrocket: '10000000-0000-4000-a000-000000000039',
  playwright: '10000000-0000-4000-a000-000000000040',
  slack_api: '10000000-0000-4000-a000-000000000041',
  discord_api: '10000000-0000-4000-a000-000000000042',
  mapbox: '10000000-0000-4000-a000-000000000043',
  elevenlabs: '10000000-0000-4000-a000-000000000044',
  inngest: '10000000-0000-4000-a000-000000000045',
  strapi: '10000000-0000-4000-a000-000000000046',
  plausible: '10000000-0000-4000-a000-000000000047',
  cypress: '10000000-0000-4000-a000-000000000048',
  bullmq: '10000000-0000-4000-a000-000000000049',
  shopify_api: '10000000-0000-4000-a000-000000000050',
  github: '10000000-0000-4000-a000-000000000051',
  claude_code: '10000000-0000-4000-a000-000000000052',
  google_gemini: '10000000-0000-4000-a000-000000000053',
  kakao_login: '10000000-0000-4000-a000-000000000054',
  google_oauth: '10000000-0000-4000-a000-000000000055',
  naver_login: '10000000-0000-4000-a000-000000000056',
  apple_login: '10000000-0000-4000-a000-000000000057',
  github_oauth: '10000000-0000-4000-a000-000000000058',

  // New Phase 4 services
  auth0: '10000000-0000-4000-a000-000000000059',
  convex: '10000000-0000-4000-a000-000000000060',
  drizzle: '10000000-0000-4000-a000-000000000061',
  prisma: '10000000-0000-4000-a000-000000000062',
  turso: '10000000-0000-4000-a000-000000000063',
  redis_cloud: '10000000-0000-4000-a000-000000000064',
  vercel_kv: '10000000-0000-4000-a000-000000000065',
  pinecone: '10000000-0000-4000-a000-000000000066',
  langchain: '10000000-0000-4000-a000-000000000067',
  replicate: '10000000-0000-4000-a000-000000000068',
  huggingface: '10000000-0000-4000-a000-000000000069',
  stability_ai: '10000000-0000-4000-a000-000000000070',
  notion_api: '10000000-0000-4000-a000-000000000071',
  linear_api: '10000000-0000-4000-a000-000000000072',
  toss_payments: '10000000-0000-4000-a000-000000000073',
  paypal: '10000000-0000-4000-a000-000000000074',
  aws_ses: '10000000-0000-4000-a000-000000000075',
  mailchimp: '10000000-0000-4000-a000-000000000076',
  imagekit: '10000000-0000-4000-a000-000000000077',
  r2: '10000000-0000-4000-a000-000000000078',
  grafana: '10000000-0000-4000-a000-000000000079',
  new_relic: '10000000-0000-4000-a000-000000000080',
  github_copilot: '10000000-0000-4000-a000-000000000081',
  cursor: '10000000-0000-4000-a000-000000000082',
  vitest: '10000000-0000-4000-a000-000000000083',
  storybook: '10000000-0000-4000-a000-000000000084',
  docker: '10000000-0000-4000-a000-000000000085',

  // Domain registrar services
  gabia: '10000000-0000-4000-a000-000000000086',
  whois: '10000000-0000-4000-a000-000000000087',
  cafe24: '10000000-0000-4000-a000-000000000088',
  inames: '10000000-0000-4000-a000-000000000089',
  namecheap: '10000000-0000-4000-a000-000000000090',
} as const;

// ---------------------------------------------------------------------------
// 20 Services
// ---------------------------------------------------------------------------

export const services: ServiceSeed[] = [
  // -----------------------------------------------------------------------
  // 1. Supabase
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.supabase,
    name: 'Supabase',
    slug: 'supabase',
    category: 'database',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'database',
    description:
      'Postgres 기반 오픈소스 Firebase 대안으로, 인증·스토리지·엣지 함수·리얼타임을 통합 제공하는 백엔드 플랫폼입니다. Free 플랜은 비활성 1주일 경과 시 프로젝트가 일시정지되는 정책이 있습니다.',
    description_ko:
      'Postgres 기반 오픈소스 Firebase 대안으로, 인증·스토리지·엣지 함수·리얼타임을 통합 제공하는 백엔드 플랫폼입니다. Free 플랜은 비활성 1주일 경과 시 프로젝트가 일시정지되는 정책이 있습니다.',
    icon_url: null,
    website_url: 'https://supabase.com',
    docs_url: 'https://supabase.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'DB 500MB, 파일 저장 1GB, Egress 5GB, MAU 50,000명, Edge Function 호출 500,000회, 동시 Realtime 연결 200개, 활성 프로젝트 최대 2개. 비활성 1주 경과 시 자동 일시정지.',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$25/월~ (DB 8GB, MAU 10만 포함, 초과 종량)' },
        { name: 'Team', price: '$599/월~ (Pro 사양 + SOC2/ISO27001, 백업 14일)' },
        { name: 'Enterprise', price: '맞춤 견적' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_SUPABASE_URL',
        public: true,
        description: 'Supabase 프로젝트 URL',
        description_ko: 'Supabase 프로젝트 URL',
      },
      {
        name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        public: true,
        description: 'Supabase 익명(공개) 키',
        description_ko: 'Supabase 익명(공개) 키',
      },
      {
        name: 'SUPABASE_SERVICE_ROLE_KEY',
        public: false,
        optional: true,
        description: 'Supabase 서비스 역할 키 (서버 전용)',
        description_ko: 'Supabase 서비스 역할 키 (서버 전용)',
      },
    ],
    // V2 extended fields
    domain: 'backend',
    subcategory: 'postgres',
    popularity_score: 92,
    difficulty_level: 'beginner',
    tags: ['postgres', 'realtime', 'auth', 'storage', 'open-source', 'baas', '수파베이스', '데이터베이스'],
    alternatives: ['firebase', 'neon', 'convex', 'planetscale'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'svelte', 'flutter'],
      language: ['typescript', 'javascript', 'python', 'dart'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@supabase/supabase-js' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$25-599', enterprise: '맞춤 견적' },
  },

  // -----------------------------------------------------------------------
  // 2. Firebase
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.firebase,
    name: 'Firebase',
    slug: 'firebase',
    category: 'database',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'database',
    description:
      'Google의 모바일/웹 앱 개발 플랫폼으로, Firestore·Auth·Hosting·Cloud Functions 등을 Spark(무료)/Blaze(종량제) 2단 체계로 제공합니다. 2026년 2월부터 Cloud Storage 사용 시 결제 계정(Blaze) 연결이 필수로 변경되었습니다.',
    description_ko:
      'Google의 모바일/웹 앱 개발 플랫폼으로, Firestore·Auth·Hosting·Cloud Functions 등을 Spark(무료)/Blaze(종량제) 2단 체계로 제공합니다. 2026년 2월부터 Cloud Storage 사용 시 결제 계정(Blaze) 연결이 필수로 변경되었습니다.',
    icon_url: null,
    website_url: 'https://firebase.google.com',
    docs_url: 'https://firebase.google.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Spark 플랜: Firestore 읽기 5만/일·쓰기 2만/일·삭제 2만/일, 저장 1GiB; Realtime DB 동시연결 100·저장 1GB; Cloud Functions 2M 호출/월; Cloud Storage 저장 5GB. 단, 2026-02-03부터 Cloud Storage는 Blaze(결제계정 연결) 필수.',
      plans: [
        { name: 'Spark (무료)', price: '$0' },
        { name: 'Blaze (종량제)', price: '사용량 기반 (Firestore 10만 읽기당 $0.06 등)' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_FIREBASE_API_KEY',
        public: true,
        description: 'Firebase API 키',
        description_ko: 'Firebase API 키',
      },
      {
        name: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        public: true,
        description: 'Firebase 인증 도메인',
        description_ko: 'Firebase 인증 도메인',
      },
      {
        name: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        public: true,
        description: 'Firebase 프로젝트 ID',
        description_ko: 'Firebase 프로젝트 ID',
      },
      {
        name: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        public: true,
        optional: true,
        description: 'Firebase 스토리지 버킷',
        description_ko: 'Firebase 스토리지 버킷',
      },
      {
        name: 'FIREBASE_ADMIN_PRIVATE_KEY',
        public: false,
        optional: true,
        description: 'Firebase Admin SDK 비공개 키 (서버 전용)',
        description_ko: 'Firebase Admin SDK 비공개 키 (서버 전용)',
      },
      {
        name: 'FIREBASE_ADMIN_CLIENT_EMAIL',
        public: false,
        optional: true,
        description: 'Firebase Admin SDK 클라이언트 이메일',
        description_ko: 'Firebase Admin SDK 클라이언트 이메일',
      },
    ],
    // V2 extended fields
    domain: 'backend',
    subcategory: 'nosql',
    popularity_score: 90,
    difficulty_level: 'beginner',
    tags: ['nosql', 'firestore', 'realtime', 'auth', 'google', 'baas', 'mobile', '파이어베이스', '데이터베이스'],
    alternatives: ['supabase', 'convex'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'flutter'],
      language: ['typescript', 'javascript', 'python', 'java', 'swift', 'kotlin'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/firebase' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$25-100', enterprise: '$200+' },
  },

  // -----------------------------------------------------------------------
  // 3. Vercel
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.vercel,
    name: 'Vercel',
    slug: 'vercel',
    category: 'deploy',
    dashboard_layer: 'frontend',
    dashboard_subcategory: 'deploy',
    description:
      'Next.js 개발사가 운영하는 프론트엔드/풀스택 배포 플랫폼. Fluid Compute 기반 Active CPU 과금(코드가 실제로 실행되는 시간에만 CPU 과금, I/O 대기 시간은 과금 제외)이 Hobby/Pro/신규 Enterprise 팀에 기본 적용되며, Blob 스토리지는 자체 상품으로 유지되나 Postgres/KV는 종료되어 Marketplace(Neon, Upstash 등) 통합으로 대체됨.',
    description_ko:
      'Next.js 개발사가 운영하는 프론트엔드/풀스택 배포 플랫폼. Fluid Compute 기반 Active CPU 과금(코드가 실제로 실행되는 시간에만 CPU 과금, I/O 대기 시간은 과금 제외)이 Hobby/Pro/신규 Enterprise 팀에 기본 적용되며, Blob 스토리지는 자체 상품으로 유지되나 Postgres/KV는 종료되어 Marketplace(Neon, Upstash 등) 통합으로 대체됨.',
    icon_url: null,
    website_url: 'https://vercel.com',
    docs_url: 'https://vercel.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Hobby 플랜: Active CPU 4시간, Provisioned Memory 360 GB-hr, Function 호출 100만 건/월 포함. 상업적 사용은 약관상 금지.',
      plans: [
        { name: 'Hobby', price: '$0' },
        { name: 'Pro', price: '$20/사용자/월 (월 $20 사용 크레딧 포함, 초과분 종량제)' },
        { name: 'Enterprise', price: '맞춤형(협의)' },
      ],
    },
    required_env_vars: [
      {
        name: 'VERCEL_TOKEN',
        public: false,
        description: 'CLI 및 자동화를 위한 Vercel API 토큰',
        description_ko: 'CLI 및 자동화를 위한 Vercel API 토큰',
      },
      {
        name: 'VERCEL_ORG_ID',
        public: false,
        optional: true,
        description: 'Vercel 조직 ID (팀 프로젝트에만 필요)',
        description_ko: 'Vercel 조직 ID (팀 프로젝트에만 필요)',
      },
      {
        name: 'VERCEL_PROJECT_ID',
        public: false,
        description: 'Vercel 프로젝트 ID',
        description_ko: 'Vercel 프로젝트 ID',
      },
    ],
    // V2 extended fields
    domain: 'infrastructure',
    subcategory: 'jamstack',
    popularity_score: 95,
    difficulty_level: 'beginner',
    tags: ['nextjs', 'hosting', 'serverless', 'edge', 'preview-deploys', 'cdn', '버셀', '배포'],
    alternatives: ['netlify', 'railway', 'render', 'flyio'],
    compatibility: {
      framework: ['nextjs', 'react', 'svelte', 'nuxt', 'astro'],
      language: ['typescript', 'javascript', 'python', 'go', 'ruby'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/vercel' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0', growth: '$20/seat + 종량제', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // 4. Netlify
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.netlify,
    name: 'Netlify',
    slug: 'netlify',
    category: 'deploy',
    dashboard_layer: 'frontend',
    dashboard_subcategory: 'deploy',
    description:
      '정적 사이트/Jamstack 및 AI 빌드 도구를 지원하는 배포 플랫폼. 2026년 4월 요금 개편으로 좌석(seat) 기반 과금을 폐지하고 크레딧 기반 정액제로 전환됨.',
    description_ko:
      '정적 사이트/Jamstack 및 AI 빌드 도구를 지원하는 배포 플랫폼. 2026년 4월 요금 개편으로 좌석(seat) 기반 과금을 폐지하고 크레딧 기반 정액제로 전환됨.',
    icon_url: null,
    website_url: 'https://www.netlify.com',
    docs_url: 'https://docs.netlify.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free 플랜: 월 300 크레딧 포함, Git/AI/API 배포, 무제한 배포 프리뷰, 커스텀 도메인+SSL, Functions 포함.',
      plans: [
        { name: 'Free', price: '$0 (월 300 크레딧)' },
        { name: 'Personal', price: '$9/월 (월 1,000 크레딧)' },
        { name: 'Pro', price: '$20/월, 팀원 무제한 (월 3,000 크레딧)' },
        { name: 'Enterprise', price: '맞춤형 (무제한 크레딧, SLA 99.99%)' },
      ],
    },
    required_env_vars: [
      {
        name: 'NETLIFY_AUTH_TOKEN',
        public: false,
        description: 'Netlify 개인 액세스 토큰',
        description_ko: 'Netlify 개인 액세스 토큰',
      },
      {
        name: 'NETLIFY_SITE_ID',
        public: false,
        description: 'Netlify 사이트 ID',
        description_ko: 'Netlify 사이트 ID',
      },
    ],
    // V2 extended fields
    domain: 'infrastructure',
    subcategory: 'jamstack',
    popularity_score: 82,
    difficulty_level: 'beginner',
    tags: ['jamstack', 'static', 'hosting', 'serverless', 'forms', 'edge', '넷리파이', '배포'],
    alternatives: ['vercel', 'railway', 'render'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'gatsby', 'hugo', 'astro'],
      language: ['typescript', 'javascript'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/netlify' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0-9', growth: '$20+ (크레딧 소진 시 종량제)', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // 5. Stripe
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.stripe,
    name: 'Stripe',
    slug: 'stripe',
    category: 'payment',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'payment',
    description: '카드결제·구독 청구·마켓플레이스(Connect)·사기 방지까지 지원하는 글로벌 결제 처리 플랫폼입니다. API 중심 설계로 개발자 경험이 뛰어납니다.',
    description_ko: '카드결제·구독 청구·마켓플레이스(Connect)·사기 방지까지 지원하는 글로벌 결제 처리 플랫폼입니다. API 중심 설계로 개발자 경험이 뛰어납니다.',
    icon_url: null,
    website_url: 'https://stripe.com',
    docs_url: 'https://docs.stripe.com/',
    pricing_info: {
      free_tier: false,
      free_tier_details: '가입비·월 사용료 없음. 거래 성사 시에만 수수료 부과.',
      plans: [
        { name: '온라인 카드결제(국내 카드)', price: '2.9% + $0.30/건' },
        { name: '국제 카드 추가수수료', price: '+1.5%' },
        { name: '통화 변환 추가수수료', price: '+1%' },
        { name: 'Stripe Billing(구독 관리)', price: '종량제 0.7%(빌링 볼륨) 또는 $620~/월(연 계약)' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        public: true,
        description: 'Stripe 공개 키 (클라이언트 측)',
        description_ko: 'Stripe 공개 키 (클라이언트 측)',
      },
      {
        name: 'STRIPE_SECRET_KEY',
        public: false,
        description: 'Stripe 비밀 키 (서버 전용)',
        description_ko: 'Stripe 비밀 키 (서버 전용)',
      },
      {
        name: 'STRIPE_WEBHOOK_SECRET',
        public: false,
        optional: true,
        description: 'Stripe 웹훅 서명 시크릿',
        description_ko: 'Stripe 웹훅 서명 시크릿',
      },
    ],
    // V2 extended fields
    domain: 'business',
    subcategory: 'payment_gateway',
    popularity_score: 96,
    difficulty_level: 'intermediate',
    tags: ['payment', 'subscription', 'billing', 'invoicing', 'marketplace', '스트라이프', '결제'],
    alternatives: ['lemon-squeezy', 'polar', 'paddle'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'ruby-on-rails'],
      language: ['typescript', 'javascript', 'python', 'ruby', 'go', 'java', 'php'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/stripe' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 30,
    monthly_cost_estimate: { starter: '$0(거래별 수수료만)', growth: '거래액 × 2.9%+$0.30', enterprise: '협의(Billing 등 옵션 별도)' },
  },

  // -----------------------------------------------------------------------
  // 6. Clerk
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.clerk,
    name: 'Clerk',
    slug: 'clerk',
    category: 'auth',
    dashboard_layer: 'frontend',
    dashboard_subcategory: 'auth',
    description:
      'React/Next.js 친화적인 사용자 관리·인증 플랫폼으로, 로그인 UI 컴포넌트와 세션 관리를 함께 제공합니다. 2026년부터 MAU 대신 MRU(월간 유지 사용자) 기준으로 과금합니다.',
    description_ko:
      'React/Next.js 친화적인 사용자 관리·인증 플랫폼으로, 로그인 UI 컴포넌트와 세션 관리를 함께 제공합니다. 2026년부터 MAU 대신 MRU(월간 유지 사용자) 기준으로 과금합니다.',
    icon_url: null,
    website_url: 'https://clerk.com',
    docs_url: 'https://clerk.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Hobby 플랜: 최대 50,000 MRU/앱, 신용카드 불필요, 무제한 애플리케이션 수.',
      plans: [
        { name: 'Hobby (무료)', price: '$0' },
        { name: 'Pro', price: '$25/월 (연간 결제 시 $20/월), 50,000 MRU 포함' },
        { name: 'Business', price: '$300/월 (연간 결제 시 $250/월)' },
        { name: 'Enterprise', price: '맞춤 견적 (연간 계약만)' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        public: true,
        description: 'Clerk 공개 키',
        description_ko: 'Clerk 공개 키',
      },
      {
        name: 'CLERK_SECRET_KEY',
        public: false,
        description: 'Clerk 비밀 키 (서버 전용)',
        description_ko: 'Clerk 비밀 키 (서버 전용)',
      },
      {
        name: 'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
        public: true,
        optional: true,
        description: '로그인 페이지 URL (기본값: /sign-in)',
        description_ko: '로그인 페이지 URL (기본값: /sign-in)',
      },
      {
        name: 'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
        public: true,
        optional: true,
        description: '회원가입 페이지 URL (기본값: /sign-up)',
        description_ko: '회원가입 페이지 URL (기본값: /sign-up)',
      },
    ],
    // V2 extended fields
    domain: 'backend',
    subcategory: 'auth_platform',
    popularity_score: 85,
    difficulty_level: 'beginner',
    tags: ['auth', 'oauth', 'social-login', 'user-management', 'mfa', 'pre-built-ui', '클럭', '인증'],
    alternatives: ['auth0', 'nextauth'],
    compatibility: {
      framework: ['nextjs', 'react', 'remix', 'gatsby'],
      language: ['typescript', 'javascript'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@clerk/nextjs' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$20-25', enterprise: '$250-300' },
  },

  // -----------------------------------------------------------------------
  // 7. NextAuth / Auth.js
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.nextauth,
    name: 'NextAuth / Auth.js',
    slug: 'nextauth',
    category: 'auth',
    dashboard_layer: 'frontend',
    dashboard_subcategory: 'auth',
    description:
      'Next.js 등 프레임워크용 무료 오픈소스 인증 라이브러리입니다. 2025년 9월부터 Better Auth 팀이 유지보수를 맡아 보안 패치 위주로 관리되며, 공식적으로 신규 프로젝트에는 Better Auth 사용을 권장하고 있습니다.',
    description_ko:
      'Next.js 등 프레임워크용 무료 오픈소스 인증 라이브러리입니다. 2025년 9월부터 Better Auth 팀이 유지보수를 맡아 보안 패치 위주로 관리되며, 공식적으로 신규 프로젝트에는 Better Auth 사용을 권장하고 있습니다.',
    icon_url: null,
    website_url: 'https://authjs.dev',
    docs_url: 'https://authjs.dev/getting-started',
    pricing_info: {
      free_tier: true,
      free_tier_details: '완전 무료 오픈소스 라이브러리 (유료 플랜 없음).',
      plans: [
        { name: '오픈소스', price: '$0' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXTAUTH_URL',
        public: false,
        description: '사이트의 정규 URL (프로덕션에서 사용)',
        description_ko: '사이트의 정규 URL (프로덕션에서 사용)',
      },
      {
        name: 'NEXTAUTH_SECRET',
        public: false,
        description: '토큰 암호화 및 쿠키 서명에 사용되는 시크릿',
        description_ko: '토큰 암호화 및 쿠키 서명에 사용되는 시크릿',
      },
      {
        name: 'GITHUB_CLIENT_ID',
        public: false,
        optional: true,
        description: 'GitHub OAuth 앱 클라이언트 ID (GitHub 프로바이더 사용 시)',
        description_ko: 'GitHub OAuth 앱 클라이언트 ID (GitHub 프로바이더 사용 시)',
      },
      {
        name: 'GITHUB_CLIENT_SECRET',
        public: false,
        optional: true,
        description: 'GitHub OAuth 앱 클라이언트 시크릿',
        description_ko: 'GitHub OAuth 앱 클라이언트 시크릿',
      },
      {
        name: 'GOOGLE_CLIENT_ID',
        public: false,
        optional: true,
        description: 'Google OAuth 클라이언트 ID (Google 프로바이더 사용 시)',
        description_ko: 'Google OAuth 클라이언트 ID (Google 프로바이더 사용 시)',
      },
      {
        name: 'GOOGLE_CLIENT_SECRET',
        public: false,
        optional: true,
        description: 'Google OAuth 클라이언트 시크릿 (Google 프로바이더 사용 시)',
        description_ko: 'Google OAuth 클라이언트 시크릿 (Google 프로바이더 사용 시)',
      },
    ],
    // V2 extended fields
    domain: 'backend',
    subcategory: 'auth_platform',
    popularity_score: 80,
    difficulty_level: 'intermediate',
    tags: ['auth', 'oauth', 'open-source', 'self-hosted', 'nextjs', '넥스트오스', '인증'],
    alternatives: ['clerk', 'auth0'],
    compatibility: {
      framework: ['nextjs', 'sveltekit'],
      language: ['typescript', 'javascript'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/next-auth' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 20,
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '$0' },
  },

  // -----------------------------------------------------------------------
  // 8. Resend
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.resend,
    name: 'Resend',
    slug: 'resend',
    category: 'email',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'email',
    description:
      '개발자 친화적인 트랜잭셔널 이메일 API로, React Email 컴포넌트 기반 템플릿 작성과 SMTP/API 발송을 지원합니다. Free/Pro/Scale/Enterprise 요금제로 운영되며 발송량 기준으로 과금됩니다.',
    description_ko:
      '개발자 친화적인 트랜잭셔널 이메일 API로, React Email 컴포넌트 기반 템플릿 작성과 SMTP/API 발송을 지원합니다. Free/Pro/Scale/Enterprise 요금제로 운영되며 발송량 기준으로 과금됩니다.',
    icon_url: null,
    website_url: 'https://resend.com',
    docs_url: 'https://resend.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 3,000건, 일일 100건 발송 제한. 1개 도메인, 30일 데이터 보관, AI 크레딧 월 5건 포함.',
      plans: [
        { name: 'Pro', price: '$20/월(5만 건)~$35/월(10만 건)' },
        { name: 'Scale', price: '$90/월(10만 건)~$1,150/월(250만 건)' },
        { name: 'Enterprise', price: '맞춤 견적(월 300만 건 이상)' },
      ],
    },
    required_env_vars: [
      {
        name: 'RESEND_API_KEY',
        public: false,
        description: 'Resend API 키',
        description_ko: 'Resend API 키',
      },
    ],
    // V2 extended fields
    domain: 'communication',
    subcategory: 'transactional_email',
    popularity_score: 78,
    difficulty_level: 'beginner',
    tags: ['email', 'transactional', 'react-email', 'developer-friendly', '리센드', '이메일'],
    alternatives: ['sendgrid'],
    compatibility: {
      framework: ['nextjs', 'react', 'express'],
      language: ['typescript', 'javascript', 'python', 'ruby', 'go', 'php'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/resend' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$20-90', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // 9. SendGrid
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.sendgrid,
    name: 'SendGrid (Twilio SendGrid)',
    slug: 'sendgrid',
    category: 'email',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'email',
    description:
      'Twilio가 운영하는 트랜잭셔널·마케팅 이메일 플랫폼으로, 2026년 2월 sendgrid.com 도메인이 twilio.com으로 통합되었습니다. Essentials/Pro/Premier 요금제로 월 발송량 기준 과금되며, 영구 무료 플랜은 폐지되고 60일 무료 체험(일 100건)만 제공됩니다.',
    description_ko:
      'Twilio가 운영하는 트랜잭셔널·마케팅 이메일 플랫폼으로, 2026년 2월 sendgrid.com 도메인이 twilio.com으로 통합되었습니다. Essentials/Pro/Premier 요금제로 월 발송량 기준 과금되며, 영구 무료 플랜은 폐지되고 60일 무료 체험(일 100건)만 제공됩니다.',
    icon_url: null,
    website_url: 'https://www.twilio.com/en-us/sendgrid',
    docs_url: 'https://www.twilio.com/docs/sendgrid/',
    pricing_info: {
      free_tier: false,
      free_tier_details: '영구 무료 플랜 없음. 신용카드 없이 60일 무료 체험 가능(일일 100건 발송 한도).',
      plans: [
        { name: 'Essentials', price: '$19.95/월부터 (월 5만~10만 건)' },
        { name: 'Pro', price: '$89.95/월부터 (월 10만~250만 건)' },
        { name: 'Premier', price: '맞춤 견적 (월 250만~500만 건 이상)' },
      ],
    },
    required_env_vars: [
      {
        name: 'SENDGRID_API_KEY',
        public: false,
        description: 'SendGrid API 키',
        description_ko: 'SendGrid API 키',
      },
      {
        name: 'SENDGRID_FROM_EMAIL',
        public: false,
        description: '인증된 발신자 이메일 주소',
        description_ko: '인증된 발신자 이메일 주소',
      },
    ],
    // V2 extended fields
    domain: 'communication',
    subcategory: 'transactional_email',
    popularity_score: 75,
    difficulty_level: 'intermediate',
    tags: ['email', 'transactional', 'marketing', 'smtp', 'twilio', '센드그리드', '이메일'],
    alternatives: ['resend'],
    compatibility: {
      framework: ['nextjs', 'react', 'express', 'django', 'rails'],
      language: ['typescript', 'javascript', 'python', 'ruby', 'go', 'java', 'php', 'c#'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@sendgrid/mail' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '60일 무료 체험', growth: '$19.95-89.95', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // 10. OpenAI
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.openai,
    name: 'OpenAI',
    slug: 'openai',
    category: 'ai',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'ai',
    description:
      'GPT 계열 LLM(GPT-5.6/5.5/5.4 등)과 ChatGPT, Sora 비디오 생성 모델을 API·구독형 제품으로 제공하는 AI 연구/제품 기업입니다.',
    description_ko:
      'GPT 계열 LLM(GPT-5.6/5.5/5.4 등)과 ChatGPT, Sora 비디오 생성 모델을 API·구독형 제품으로 제공하는 AI 연구/제품 기업입니다.',
    icon_url: null,
    website_url: 'https://openai.com',
    docs_url: 'https://platform.openai.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'ChatGPT Free 플랜 제공(제한된 GPT 모델 접근). API 자체에는 상시 무료 티어가 없으며 신규 가입 시 소액 크레딧만 제공.',
      plans: [
        { name: 'ChatGPT Free', price: '$0/월' },
        { name: 'ChatGPT Go', price: '$8/월 (미국 기준)' },
        { name: 'ChatGPT Plus', price: '$20/월' },
        { name: 'ChatGPT Pro (Codex)', price: '$100/월' },
        { name: 'ChatGPT Pro (Max)', price: '$200/월' },
        { name: 'ChatGPT Business', price: '$20/좌석/월(연간) 또는 $25/월' },
        { name: 'ChatGPT Enterprise', price: '맞춤 견적' },
        { name: 'API GPT-5.6 Sol', price: '입력 $5.00 / 출력 $30.00 (1M 토큰)' },
        { name: 'API GPT-5.6 Terra', price: '입력 $2.50 / 출력 $15.00 (1M 토큰)' },
        { name: 'API GPT-5.6 Luna', price: '입력 $1.00 / 출력 $6.00 (1M 토큰)' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        description: 'OpenAI API 키',
        description_ko: 'OpenAI API 키',
      },
      {
        name: 'OPENAI_ORG_ID',
        public: false,
        optional: true,
        description: 'OpenAI 조직 ID (선택사항)',
        description_ko: 'OpenAI 조직 ID (선택사항)',
      },
    ],
    // V2 extended fields
    domain: 'ai_ml',
    subcategory: 'llm',
    popularity_score: 98,
    difficulty_level: 'beginner',
    tags: ['llm', 'gpt', 'chatgpt', 'dall-e', 'whisper', 'embeddings', 'ai', '오픈에이아이'],
    alternatives: ['anthropic', 'google-gemini', 'mistral-ai', 'deepseek', 'grok'],
    compatibility: {
      framework: ['nextjs', 'react', 'express', 'fastapi'],
      language: ['typescript', 'javascript', 'python', 'go', 'ruby', 'java', 'c#'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/openai' },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0-20', growth: '$20-200', enterprise: '맞춤 견적 (Business $20~/좌석)' },
  },

  // -----------------------------------------------------------------------
  // 11. Anthropic
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.anthropic,
    name: 'Anthropic (Claude)',
    slug: 'anthropic',
    category: 'ai',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'ai',
    description: 'Claude Opus/Sonnet/Haiku 및 신규 Fable 5 라인업을 API와 Claude.ai로 제공하는 AI 안전성 중심 기업입니다.',
    description_ko: 'Claude Opus/Sonnet/Haiku 및 신규 Fable 5 라인업을 API와 Claude.ai로 제공하는 AI 안전성 중심 기업입니다.',
    icon_url: null,
    website_url: 'https://www.anthropic.com',
    docs_url: 'https://platform.claude.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Claude.ai Free 플랜 제공(기본 기능, Claude Code 미포함). API는 신규 가입 시 소액 무료 크레딧만 제공.',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$17/월(연간) 또는 $20/월' },
        { name: 'Max', price: '$100~$200/월' },
        { name: 'Team (Standard 좌석)', price: '$20/좌석/월(연간)' },
        { name: 'Team (Premium 좌석, Claude Code 포함)', price: '$100~$125/좌석/월' },
        { name: 'Enterprise', price: '$20/좌석 + API 사용료' },
        { name: 'API Claude Opus 4.8', price: '입력 $5 / 출력 $25 (1M 토큰)' },
        { name: 'API Claude Sonnet 5 (~2026-08-31까지 도입가)', price: '입력 $2 / 출력 $10 (1M 토큰), 이후 $3/$15' },
        { name: 'API Claude Haiku 4.5', price: '입력 $1 / 출력 $5 (1M 토큰)' },
        { name: 'API Claude Fable 5', price: '입력 $10 / 출력 $50 (1M 토큰)' },
      ],
    },
    required_env_vars: [
      {
        name: 'ANTHROPIC_API_KEY',
        public: false,
        description: 'Anthropic API 키',
        description_ko: 'Anthropic API 키',
      },
    ],
    // V2 extended fields
    domain: 'ai_ml',
    subcategory: 'llm',
    popularity_score: 95,
    difficulty_level: 'beginner',
    tags: ['llm', 'claude', 'ai', 'safety', 'long-context', '앤트로픽', '클로드'],
    alternatives: ['openai', 'google-gemini', 'mistral-ai'],
    compatibility: {
      framework: ['nextjs', 'react', 'express', 'fastapi'],
      language: ['typescript', 'javascript', 'python'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@anthropic-ai/sdk' },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0-20', growth: '$20-200', enterprise: '$20/좌석~ + API 종량제' },
  },

  // -----------------------------------------------------------------------
  // 12. Cloudinary
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.cloudinary,
    name: 'Cloudinary',
    slug: 'cloudinary',
    category: 'storage',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'storage',
    description: '이미지·비디오의 업로드, 변환, 최적화, CDN 전송을 API/SDK로 제공하는 미디어 관리 플랫폼입니다.',
    description_ko: '이미지·비디오의 업로드, 변환, 최적화, CDN 전송을 API/SDK로 제공하는 미디어 관리 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://cloudinary.com',
    docs_url: 'https://cloudinary.com/documentation',
    pricing_info: {
      free_tier: true,
      free_tier_details: '영구 무료: 월 25 크레딧, 사용자 3명, 계정 1개.',
      plans: [
        { name: 'Plus', price: '$99/월(연간 $89/월), 월 225 크레딧, 사용자 3명' },
        { name: 'Advanced', price: '$249/월(연간 $224/월), 월 600 크레딧, 사용자 5명' },
        { name: 'Enterprise', price: '맞춤 견적' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
        public: true,
        description: 'Cloudinary 클라우드 이름',
        description_ko: 'Cloudinary 클라우드 이름',
      },
      {
        name: 'CLOUDINARY_API_KEY',
        public: false,
        description: 'Cloudinary API 키',
        description_ko: 'Cloudinary API 키',
      },
      {
        name: 'CLOUDINARY_API_SECRET',
        public: false,
        description: 'Cloudinary API 시크릿',
        description_ko: 'Cloudinary API 시크릿',
      },
    ],
    // V2 extended fields
    domain: 'business',
    subcategory: 'image_video',
    popularity_score: 80,
    difficulty_level: 'intermediate',
    tags: ['image', 'video', 'media', 'cdn', 'optimization', 'transformation', '클라우디너리', '이미지'],
    alternatives: ['uploadthing', 'aws-s3'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular'],
      language: ['typescript', 'javascript', 'python', 'ruby', 'php', 'java'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/cloudinary' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$99~249/월', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // 13. Sentry
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.sentry,
    name: 'Sentry',
    slug: 'sentry',
    category: 'monitoring',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'monitoring',
    description:
      '에러 트래킹, 성능 모니터링(트레이싱), 세션 리플레이, 로그를 통합 제공하는 개발자 옵저버빌리티 플랫폼입니다. Developer(무료)/Team/Business/Enterprise 요금제로 운영되며 에러 이벤트 수를 중심으로 과금됩니다.',
    description_ko:
      '에러 트래킹, 성능 모니터링(트레이싱), 세션 리플레이, 로그를 통합 제공하는 개발자 옵저버빌리티 플랫폼입니다. Developer(무료)/Team/Business/Enterprise 요금제로 운영되며 에러 이벤트 수를 중심으로 과금됩니다.',
    icon_url: null,
    website_url: 'https://sentry.io',
    docs_url: 'https://docs.sentry.io',
    pricing_info: {
      free_tier: true,
      free_tier_details: '1인 사용자 한정, 에러 5,000건, 로그 5GB, 애플리케이션 메트릭 5GB, 트레이싱 500만 span, 세션 리플레이 50건, 대시보드 10개.',
      plans: [
        { name: 'Team', price: '$26/월 (에러 5만 건, 무제한 사용자, 대시보드 20개)' },
        { name: 'Business', price: '$80/월 (에러 5만 건 + 고급 기능, 초과 로그/메트릭 GB당 $0.50)' },
        { name: 'Enterprise', price: '맞춤 견적' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_SENTRY_DSN',
        public: true,
        description: 'Sentry DSN (데이터 소스 이름)',
        description_ko: 'Sentry DSN (데이터 소스 이름)',
      },
      {
        name: 'SENTRY_AUTH_TOKEN',
        public: false,
        optional: true,
        description: '소스맵 업로드를 위한 Sentry 인증 토큰',
        description_ko: '소스맵 업로드를 위한 Sentry 인증 토큰',
      },
      {
        name: 'SENTRY_ORG',
        public: false,
        optional: true,
        description: 'Sentry 조직 슬러그 (소스맵 업로드 시 필요)',
        description_ko: 'Sentry 조직 슬러그 (소스맵 업로드 시 필요)',
      },
      {
        name: 'SENTRY_PROJECT',
        public: false,
        optional: true,
        description: 'Sentry 프로젝트 슬러그 (소스맵 업로드 시 필요)',
        description_ko: 'Sentry 프로젝트 슬러그 (소스맵 업로드 시 필요)',
      },
    ],
    // V2 extended fields
    domain: 'observability',
    subcategory: 'error_tracking',
    popularity_score: 90,
    difficulty_level: 'beginner',
    tags: ['error-tracking', 'monitoring', 'performance', 'debugging', 'open-source', '센트리', '모니터링'],
    alternatives: ['logrocket', 'betterstack'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'svelte', 'django', 'rails', 'flask'],
      language: ['typescript', 'javascript', 'python', 'ruby', 'go', 'java', 'php', 'c#', 'rust'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@sentry/nextjs' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$26-80', enterprise: '협의(연 중앙값 약 $23,301, Vendr 추정)' },
  },

  // -----------------------------------------------------------------------
  // 14. PlanetScale
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.planetscale,
    name: 'PlanetScale',
    slug: 'planetscale',
    category: 'database',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'database',
    description:
      'Vitess 기반 MySQL 호환 서버리스 데이터베이스로 시작했으며, 현재는 PlanetScale Postgres도 함께 제공하는 관계형 DB 플랫폼입니다. 2024년 무료 플랜이 폐지되어 모든 요금제가 유료입니다.',
    description_ko:
      'Vitess 기반 MySQL 호환 서버리스 데이터베이스로 시작했으며, 현재는 PlanetScale Postgres도 함께 제공하는 관계형 DB 플랫폼입니다. 2024년 무료 플랜이 폐지되어 모든 요금제가 유료입니다.',
    icon_url: null,
    website_url: 'https://planetscale.com',
    docs_url: 'https://planetscale.com/docs',
    pricing_info: {
      free_tier: false,
      free_tier_details: '무료 티어 없음 (2024-04-08 Hobby 플랜 폐지).',
      plans: [
        { name: 'Postgres PS-5 (최소)', price: '$5/월 (1/16 vCPU, 512MiB RAM, 단일 노드)' },
        { name: 'Postgres HA / Vitess 등', price: '$15/월~ (구성별 상이)' },
      ],
    },
    required_env_vars: [
      {
        name: 'DATABASE_URL',
        public: false,
        description: 'PlanetScale 데이터베이스 연결 문자열',
        description_ko: 'PlanetScale 데이터베이스 연결 문자열',
      },
    ],
    // V2 extended fields
    domain: 'backend',
    subcategory: 'mysql',
    popularity_score: 78,
    difficulty_level: 'intermediate',
    tags: ['mysql', 'vitess', 'branching', 'serverless', 'horizontal-scaling', '플래닛스케일', '데이터베이스'],
    alternatives: ['neon', 'supabase'],
    compatibility: {
      framework: ['nextjs', 'react', 'express', 'django', 'rails'],
      language: ['typescript', 'javascript', 'python', 'ruby', 'go', 'java', 'php'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@planetscale/database' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$29', enterprise: '$Custom' },
  },

  // -----------------------------------------------------------------------
  // 15. Neon
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.neon,
    name: 'Neon',
    slug: 'neon',
    category: 'database',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'database',
    description:
      '서버리스 Postgres로, 컴퓨트 자동 스케일-투-제로와 브랜칭 기능이 특징입니다. Databricks 인수(2025) 이후 무료 티어가 월 50 CU-hour에서 100 CU-hour로 2배 확대되었고 스토리지 단가도 인하되었습니다.',
    description_ko:
      '서버리스 Postgres로, 컴퓨트 자동 스케일-투-제로와 브랜칭 기능이 특징입니다. Databricks 인수(2025) 이후 무료 티어가 월 50 CU-hour에서 100 CU-hour로 2배 확대되었고 스토리지 단가도 인하되었습니다.',
    icon_url: null,
    website_url: 'https://neon.tech',
    docs_url: 'https://neon.tech/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '프로젝트당 100 CU-hours/월, 0.5GB 스토리지, 5GB 공개 네트워크 전송, 최대 60,000 MAU.',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Launch', price: '종량제 (Compute $0.106/CU-hour, Storage $0.35/GB-월)' },
        { name: 'Scale', price: '종량제 (Compute $0.222/CU-hour)' },
      ],
    },
    required_env_vars: [
      {
        name: 'DATABASE_URL',
        public: false,
        description: 'Neon Postgres 연결 문자열 (풀링)',
        description_ko: 'Neon Postgres 연결 문자열 (풀링)',
      },
      {
        name: 'DATABASE_URL_UNPOOLED',
        public: false,
        optional: true,
        description: 'Neon Postgres 직접 연결 문자열 (마이그레이션용)',
        description_ko: 'Neon Postgres 직접 연결 문자열 (마이그레이션용)',
      },
    ],
    // V2 extended fields
    domain: 'backend',
    subcategory: 'postgres',
    popularity_score: 82,
    difficulty_level: 'beginner',
    tags: ['postgres', 'serverless', 'branching', 'auto-scaling', 'open-source', '니온', '데이터베이스'],
    alternatives: ['planetscale', 'supabase'],
    compatibility: {
      framework: ['nextjs', 'react', 'express', 'django', 'rails'],
      language: ['typescript', 'javascript', 'python', 'ruby', 'go', 'java'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@neondatabase/serverless' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0', growth: '종량제 ($0.106/CU-hr~)', enterprise: '종량제 ($0.222/CU-hr~)' },
  },

  // -----------------------------------------------------------------------
  // 16. Railway
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.railway,
    name: 'Railway',
    slug: 'railway',
    category: 'deploy',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'hosting',
    description:
      '사용량 기반 종량제 PaaS. 상시 무료 플랜은 없고 신규 가입 시 1회성 $5 체험 크레딧(Free Trial)만 제공되며, 지속 이용을 위해서는 Hobby($5/월) 또는 Pro($20/월, 시트당) 구독이 필요함.',
    description_ko:
      '사용량 기반 종량제 PaaS. 상시 무료 플랜은 없고 신규 가입 시 1회성 $5 체험 크레딧(Free Trial)만 제공되며, 지속 이용을 위해서는 Hobby($5/월) 또는 Pro($20/월, 시트당) 구독이 필요함.',
    icon_url: null,
    website_url: 'https://railway.com',
    docs_url: 'https://docs.railway.com',
    pricing_info: {
      free_tier: false,
      free_tier_details: '상시 무료 플랜 없음. 신규 가입 시 카드 등록 없이 $5 1회성 크레딧(Free Trial)만 제공, 소진 후 Hobby로 업그레이드 필요.',
      plans: [
        { name: 'Free Trial', price: '$5 1회성 크레딧' },
        { name: 'Hobby', price: '$5/월 (월 $5 사용량 포함)' },
        { name: 'Pro', price: '$20/월/시트 (월 $20 사용량 포함)' },
        { name: 'Enterprise', price: '맞춤형' },
      ],
    },
    required_env_vars: [
      {
        name: 'RAILWAY_TOKEN',
        public: false,
        description: 'CLI 배포를 위한 Railway API 토큰',
        description_ko: 'CLI 배포를 위한 Railway API 토큰',
      },
    ],
    // V2 extended fields
    domain: 'infrastructure',
    subcategory: 'paas',
    popularity_score: 80,
    difficulty_level: 'beginner',
    tags: ['hosting', 'docker', 'databases', 'paas', 'deploy', 'full-stack', '레일웨이', '배포'],
    alternatives: ['render', 'flyio', 'vercel', 'netlify'],
    compatibility: {
      framework: ['nextjs', 'react', 'express', 'django', 'rails', 'flask'],
      language: ['typescript', 'javascript', 'python', 'ruby', 'go', 'java', 'rust', 'elixir'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$5', growth: '$20+/seat + 종량제', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // 17. Lemon Squeezy
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.lemonsqueezy,
    name: 'Lemon Squeezy',
    slug: 'lemon-squeezy',
    category: 'payment',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'payment',
    description: '글로벌 세금 신고·정산까지 대행하는 Merchant of Record형 결제 플랫폼으로, 단일 거래 수수료 구조가 특징입니다.',
    description_ko: '글로벌 세금 신고·정산까지 대행하는 Merchant of Record형 결제 플랫폼으로, 단일 거래 수수료 구조가 특징입니다.',
    icon_url: null,
    website_url: 'https://www.lemonsqueezy.com',
    docs_url: 'https://docs.lemonsqueezy.com',
    pricing_info: {
      free_tier: false,
      free_tier_details: '월 요금 없음, 거래 시에만 수수료 부과(무료 플랜 개념 자체가 없는 종량제 단일 요금).',
      plans: [
        { name: '기본 거래 수수료', price: '5% + $0.50/건' },
        { name: '국제 거래 추가', price: '+1.5%' },
        { name: 'PayPal 결제 추가', price: '+1.5%' },
        { name: '구독 결제 추가', price: '+0.5%' },
      ],
    },
    required_env_vars: [
      {
        name: 'LEMONSQUEEZY_API_KEY',
        public: false,
        description: 'Lemon Squeezy API 키',
        description_ko: 'Lemon Squeezy API 키',
      },
      {
        name: 'LEMONSQUEEZY_STORE_ID',
        public: false,
        description: 'Lemon Squeezy 스토어 ID',
        description_ko: 'Lemon Squeezy 스토어 ID',
      },
      {
        name: 'LEMONSQUEEZY_WEBHOOK_SECRET',
        public: false,
        optional: true,
        description: 'Lemon Squeezy 웹훅 서명 시크릿 (웹훅 사용 시 필요)',
        description_ko: 'Lemon Squeezy 웹훅 서명 시크릿 (웹훅 사용 시 필요)',
      },
    ],
    // V2 extended fields
    domain: 'business',
    subcategory: 'payment_gateway',
    popularity_score: 70,
    difficulty_level: 'beginner',
    tags: ['payment', 'subscription', 'digital-products', 'merchant-of-record', 'tax', '레몬스퀴지', '결제'],
    alternatives: ['stripe', 'polar', 'paddle'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue'],
      language: ['typescript', 'javascript', 'python', 'ruby', 'php'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@lemonsqueezy/lemonsqueezy.js' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0(거래별 수수료만)', growth: '거래액 × 5%+$0.50', enterprise: '동일 구조(별도 엔터프라이즈 등급 없음)' },
  },

  // -----------------------------------------------------------------------
  // 18. UploadThing
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.uploadthing,
    name: 'UploadThing',
    slug: 'uploadthing',
    category: 'storage',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'storage',
    description: 'TypeScript 풀스택 앱을 위한 파일 업로드 서비스로, 프레임워크별 백엔드 어댑터와 React 컴포넌트를 제공합니다.',
    description_ko: 'TypeScript 풀스택 앱을 위한 파일 업로드 서비스로, 프레임워크별 백엔드 어댑터와 React 컴포넌트를 제공합니다.',
    icon_url: null,
    website_url: 'https://uploadthing.com',
    docs_url: 'https://docs.uploadthing.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '2GB 저장용량(전체 앱 공유), 업로드/다운로드 무제한, 감사 로그 7일 보관.',
      plans: [
        { name: '2GB App (무료)', price: '$0' },
        { name: '100GB App', price: '$10/월' },
        { name: 'Usage Based', price: '$25/월~ (250GB 포함, 초과 GB당 $0.08)' },
      ],
    },
    required_env_vars: [
      {
        name: 'UPLOADTHING_SECRET',
        public: false,
        description: 'UploadThing 비밀 키',
        description_ko: 'UploadThing 비밀 키',
      },
      {
        name: 'UPLOADTHING_APP_ID',
        public: false,
        description: 'UploadThing 앱 ID',
        description_ko: 'UploadThing 앱 ID',
      },
    ],
    // V2 extended fields
    domain: 'backend',
    subcategory: 'file_upload',
    popularity_score: 72,
    difficulty_level: 'beginner',
    tags: ['file-upload', 'storage', 'nextjs', 'react', 'typesafe', '업로드씽', '파일업로드'],
    alternatives: ['imagekit', 'r2'],
    compatibility: {
      framework: ['nextjs', 'react', 'solid', 'svelte', 'vue', 'express'],
      language: ['typescript', 'javascript'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/uploadthing' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$10', enterprise: '$Custom' },
  },

  // -----------------------------------------------------------------------
  // 19. PostHog
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.posthog,
    name: 'PostHog',
    slug: 'posthog',
    category: 'monitoring',
    dashboard_layer: 'frontend',
    dashboard_subcategory: 'analytics',
    description:
      '제품 분석, 세션 리플레이, 피처 플래그, 설문, 오류 추적을 하나로 묶은 올인원 제품 분석 플랫폼입니다. 넉넉한 월 무료 한도 이후에는 제품별 사용량(이벤트·녹화·요청 수 등) 기준의 종량제로 전환됩니다.',
    description_ko:
      '제품 분석, 세션 리플레이, 피처 플래그, 설문, 오류 추적을 하나로 묶은 올인원 제품 분석 플랫폼입니다. 넉넉한 월 무료 한도 이후에는 제품별 사용량(이벤트·녹화·요청 수 등) 기준의 종량제로 전환됩니다.',
    icon_url: null,
    website_url: 'https://posthog.com',
    docs_url: 'https://posthog.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 Product Analytics 100만 이벤트, Session Replay 5,000건(모바일 2,500건), Feature Flags 100만 요청, Surveys 1,500 응답, Error Tracking 10만 예외, Managed Warehouse 100만 행, PostHog AI 500 크레딧.',
      plans: [
        { name: 'Pay-as-you-go (Product Analytics)', price: '$0.00005/이벤트부터 (구간별 체감, 250M+ 시 $0.000009)' },
        { name: 'Pay-as-you-go (Session Replay)', price: '$0.005/녹화부터 (구간별 체감, 500K+ 시 $0.0015)' },
        { name: 'Pay-as-you-go (Feature Flags)', price: '$0.0001/요청부터 (구간별 체감, 50M+ 시 $0.00001)' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_POSTHOG_KEY',
        public: true,
        description: 'PostHog 프로젝트 API 키',
        description_ko: 'PostHog 프로젝트 API 키',
      },
      {
        name: 'NEXT_PUBLIC_POSTHOG_HOST',
        public: true,
        description: 'PostHog 인스턴스 호스트 URL',
        description_ko: 'PostHog 인스턴스 호스트 URL',
      },
    ],
    // V2 extended fields
    domain: 'observability',
    subcategory: 'product_analytics',
    popularity_score: 82,
    difficulty_level: 'beginner',
    tags: ['analytics', 'session-replay', 'feature-flags', 'open-source', 'a-b-testing', 'product-analytics', '포스트호그', '분석'],
    alternatives: ['logrocket', 'launchdarkly'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'svelte', 'django', 'rails', 'flask'],
      language: ['typescript', 'javascript', 'python', 'ruby', 'go', 'java', 'php'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/posthog-js' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0', growth: '사용량 기반(수십~수백 달러)', enterprise: '사용량 기반(협의 가능)' },
  },

  // -----------------------------------------------------------------------
  // 20. AWS S3
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.awss3,
    name: 'AWS S3',
    slug: 'aws-s3',
    category: 'storage',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'storage',
    description:
      'Amazon의 객체 스토리지 서비스. 스토리지 클래스별 계층 가격 체계를 유지하며, 2025년 7월 AWS 전체 프리티어 정책이 신규 계정 대상 크레딧 지급 방식(최대 $200, 6개월)으로 개편됨에 따라 S3의 무료 이용 조건도 함께 변경됨.',
    description_ko:
      'Amazon의 객체 스토리지 서비스. 스토리지 클래스별 계층 가격 체계를 유지하며, 2025년 7월 AWS 전체 프리티어 정책이 신규 계정 대상 크레딧 지급 방식(최대 $200, 6개월)으로 개편됨에 따라 S3의 무료 이용 조건도 함께 변경됨.',
    icon_url: null,
    website_url: 'https://aws.amazon.com/s3',
    docs_url: 'https://docs.aws.amazon.com/s3',
    pricing_info: {
      free_tier: true,
      free_tier_details: '2025-07-15 이후 신규 계정: Free Plan(최대 $200 크레딧, 6개월) 또는 Paid Plan 중 선택. 이와 별개로 \'Always Free\' 30여개 서비스 한도가 있으나 S3 전용 수치는 공식 페이지의 동적 렌더링 테이블에서 자동조회로 확인하지 못함(2025-07-15 이전 개설된 레거시 계정은 기존 12개월 무료 티어 유지).',
      plans: [
        { name: 'S3 Standard', price: 'GB당 $0.023/월 (첫 50 TB)' },
        { name: 'S3 Intelligent-Tiering', price: '자동 계층화' },
      ],
    },
    required_env_vars: [
      {
        name: 'AWS_ACCESS_KEY_ID',
        public: false,
        description: 'AWS IAM 액세스 키 ID',
        description_ko: 'AWS IAM 액세스 키 ID',
      },
      {
        name: 'AWS_SECRET_ACCESS_KEY',
        public: false,
        description: 'AWS IAM 비밀 액세스 키',
        description_ko: 'AWS IAM 비밀 액세스 키',
      },
      {
        name: 'AWS_REGION',
        public: false,
        optional: true,
        description: 'AWS 리전 (예: ap-northeast-2, 기본값: us-east-1)',
        description_ko: 'AWS 리전 (예: ap-northeast-2, 기본값: us-east-1)',
      },
      {
        name: 'AWS_S3_BUCKET_NAME',
        public: false,
        optional: true,
        description: 'S3 버킷 이름 (S3 사용 시 필요)',
        description_ko: 'S3 버킷 이름 (S3 사용 시 필요)',
      },
    ],
    // V2 extended fields
    domain: 'infrastructure',
    subcategory: 'object_storage',
    popularity_score: 95,
    difficulty_level: 'intermediate',
    tags: ['storage', 'object-storage', 'static-hosting', 'cdn', 'aws', 'enterprise', '아마존', '스토리지'],
    alternatives: ['cloudinary', 'uploadthing'],
    compatibility: {
      framework: ['nextjs', 'react', 'express', 'django', 'rails', 'flask', 'spring'],
      language: ['typescript', 'javascript', 'python', 'ruby', 'go', 'java', 'c#', 'php', 'rust'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@aws-sdk/client-s3' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 20,
    monthly_cost_estimate: { starter: '$0-5', growth: '$20-100', enterprise: '$500+' },
  },

  // -----------------------------------------------------------------------
  // 21. GitHub
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.github,
    name: 'GitHub',
    slug: 'github',
    category: 'cicd',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'cicd',
    description:
      'Git-based source code hosting with pull requests, Actions CI/CD, issue tracking, and the world\'s largest developer community.',
    description_ko:
      '세계 최대 규모의 소스 코드 호스팅·협업 플랫폼으로, Git 저장소 관리와 이슈 트래킹, 코드 리뷰, GitHub Actions CI/CD를 하나로 통합 제공합니다.',
    icon_url: null,
    website_url: 'https://github.com',
    docs_url: 'https://docs.github.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무제한 공개/비공개 저장소, 월 2,000분 Actions, 500MB 패키지 저장소 무료 제공',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Team', price: '$4/user/월 (최초 12개월 기준, 공식 페이지 표기)' },
        { name: 'Enterprise', price: '$21/user/월 (최초 12개월 기준, 공식 페이지 표기)' },
      ],
    },
    required_env_vars: [
      {
        name: 'GITHUB_TOKEN',
        public: false,
        optional: true,
        description: 'GitHub Personal Access Token (OAuth 연결 시 자동 관리)',
        description_ko: 'GitHub 개인 액세스 토큰 (OAuth 연결 시 자동 관리)',
      },
      {
        name: 'GITHUB_CLIENT_ID',
        public: false,
        optional: true,
        description: 'GitHub OAuth App Client ID (OAuth 앱 사용 시 필요)',
        description_ko: 'GitHub OAuth 앱 클라이언트 ID (OAuth 앱 사용 시 필요)',
      },
      {
        name: 'GITHUB_CLIENT_SECRET',
        public: false,
        optional: true,
        description: 'GitHub OAuth App Client Secret (OAuth 앱 사용 시 필요)',
        description_ko: 'GitHub OAuth 앱 클라이언트 시크릿 (OAuth 앱 사용 시 필요)',
      },
    ],
    domain: 'devtools',
    subcategory: 'version_control',
    popularity_score: 98,
    difficulty_level: 'beginner',
    tags: ['git', 'ci/cd', 'version-control', 'actions', 'open-source', 'devtools', '깃허브', '깃허브 액션'],
    alternatives: ['gitlab', 'bitbucket'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'svelte', 'angular', 'express'],
      language: ['typescript', 'javascript', 'python', 'go', 'rust', 'java', 'ruby'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@octokit/rest' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0', growth: '$4/user', enterprise: '$21/user' },
  },

  // -----------------------------------------------------------------------
  // 22. Claude Code
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.claude_code,
    name: 'Claude Code',
    slug: 'claude-code',
    category: 'ai',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'ai',
    description:
      'Anthropic\'s agentic coding tool for CLI. Understands codebases, edits files, runs commands, and assists with complex software engineering tasks.',
    description_ko:
      'Anthropic이 제공하는 터미널/IDE 기반 에이전틱 코딩 도구로, Claude Pro/Max/Team(Premium)/Enterprise 구독에 포함되어 제공됩니다.',
    icon_url: null,
    website_url: 'https://claude.ai/claude-code',
    docs_url: 'https://platform.claude.com/docs/en/docs/claude-code',
    pricing_info: {
      free_tier: false,
      free_tier_details: '별도 무료 플랜 없음 — Claude Pro($17~20/월) 이상 구독 또는 API 종량제 필요.',
      plans: [
        { name: 'Pro 구독 포함', price: '$17/월(연간) 또는 $20/월' },
        { name: 'Max 구독 포함', price: '$100~$200/월' },
        { name: 'Team Premium 좌석', price: '$100/좌석/월(연간) 또는 $125/월, 최소 5석' },
        { name: 'Enterprise', price: '좌석당 $20 + API 사용료' },
      ],
    },
    required_env_vars: [
      {
        name: 'ANTHROPIC_API_KEY',
        public: false,
        description: 'Anthropic API Key for Claude',
        description_ko: 'Claude용 Anthropic API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 88,
    difficulty_level: 'beginner',
    tags: ['ai', 'coding-assistant', 'cli', 'agent', 'anthropic', 'claude', '클로드 코드'],
    alternatives: ['github-copilot', 'cursor', 'windsurf', 'cline'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'svelte', 'express', 'django', 'rails'],
      language: ['typescript', 'javascript', 'python', 'go', 'rust', 'java', 'ruby', 'c#'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@anthropic-ai/sdk' },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$17-20', growth: '$100-200', enterprise: '$20/좌석~ + API 종량제' },
  },

  // -----------------------------------------------------------------------
  // 23. Google Gemini
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.google_gemini,
    name: 'Google Gemini',
    slug: 'google-gemini',
    category: 'ai',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'ai',
    description:
      'Google\'s multimodal AI platform supporting text, image, audio, video understanding and generation (Imagen 4, Veo 3.1, TTS) with generous free tier, grounding, and competitive pricing.',
    description_ko:
      'Google의 멀티모달 LLM 패밀리로, Gemini API(개발자용)와 Gemini 앱/Google AI Plus·Pro·Ultra 구독(소비자용)으로 제공됩니다.',
    icon_url: null,
    website_url: 'https://ai.google.dev',
    docs_url: 'https://ai.google.dev/gemini-api/docs/pricing',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Gemini 2.5/3.x Flash-Lite 등 일부 모델은 무료 티어로 제한된 접근 가능. Google Search 그라운딩 월 5,000 프롬프트 무료.',
      plans: [
        { name: 'Free (Gemini 앱)', price: '$0/월' },
        { name: 'Google AI Plus', price: '$4.99/월(추정, 서드파티 교차검증)' },
        { name: 'Google AI Pro', price: '$19.99/월' },
        { name: 'Google AI Ultra (5x)', price: '$99.99/월' },
        { name: 'Google AI Ultra (20x)', price: '$199.99/월' },
        { name: 'API Gemini 2.5 Flash-Lite', price: '입력 $0.10 / 출력 $0.40 (1M 토큰)' },
        { name: 'API Gemini 3.6 Flash', price: '입력 $1.50 / 출력 $7.50 (1M 토큰)' },
      ],
    },
    required_env_vars: [
      {
        name: 'GOOGLE_GEMINI_API_KEY',
        public: false,
        description: 'Google Gemini API Key',
        description_ko: 'Google Gemini API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'multimodal_ai',
    popularity_score: 85,
    difficulty_level: 'beginner',
    tags: ['ai', 'multimodal', 'google', 'llm', 'vision', 'gemini', '제미나이', 'image-gen', 'video-gen', 'tts', 'grounding'],
    alternatives: ['openai', 'anthropic', 'mistral-ai'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'express', 'flask', 'django'],
      language: ['typescript', 'javascript', 'python', 'go', 'java', 'kotlin', 'swift'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@google/genai' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0-20', growth: '$20-100', enterprise: '$200+ (Ultra) / 맞춤 API 볼륨' },
  },

  // -----------------------------------------------------------------------
  // Kakao Login (카카오 로그인)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.kakao_login,
    name: 'Kakao Login',
    slug: 'kakao-login',
    category: 'social_login',
    dashboard_layer: 'frontend',
    dashboard_subcategory: 'social_login',
    description:
      'Kakao social login SDK for integrating KakaoTalk-based authentication into web and mobile applications.',
    description_ko:
      '카카오계정으로 로그인하는 국내 대표 소셜 로그인 서비스입니다. 로그인 API 자체는 무료이며, 카카오 오픈API 전체 계정 기준 월 3,000,000회 호출 한도를 공유합니다.',
    icon_url: null,
    website_url: 'https://developers.kakao.com',
    docs_url: 'https://developers.kakao.com/docs/latest/ko/kakaologin/common',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Kakao Login은 유료 API 목록에 포함되지 않는 무료 API. 계정 전체 Open API 월 300만 호출 한도 공유. Access Token 발급은 10분당 20회, Refresh Token은 60분당 30회로 속도 제한.',
      plans: [
        { name: '무료', price: '$0' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_KAKAO_CLIENT_ID',
        public: true,
        description: 'Kakao REST API Key (앱 키)',
        description_ko: '카카오 REST API 키 (앱 키)',
      },
      {
        name: 'KAKAO_CLIENT_SECRET',
        public: false,
        description: 'Kakao Client Secret for server-side auth',
        description_ko: '카카오 클라이언트 시크릿 (서버 인증용)',
      },
      {
        name: 'NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY',
        public: true,
        description: 'Kakao JavaScript Key for frontend SDK',
        description_ko: '카카오 JavaScript 키 (프론트엔드 SDK용)',
      },
      {
        name: 'KAKAO_REDIRECT_URI',
        public: false,
        description: 'OAuth redirect URI registered in Kakao Developers',
        description_ko: 'Kakao Developers에 등록한 OAuth 리다이렉트 URI',
      },
    ],
    domain: 'backend',
    popularity_score: 92,
    difficulty_level: 'beginner',
    tags: ['social-login', 'kakao', 'kakaotalk', 'oauth', 'korea', '한국', '소셜로그인', '카카오 로그인'],
    alternatives: ['google-oauth', 'naver-login', 'apple-login', 'github-oauth'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'flutter', 'react-native'],
      language: ['typescript', 'javascript', 'kotlin', 'swift', 'java'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/kakao-js-sdk' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '$0' },
  },

  // -----------------------------------------------------------------------
  // Google OAuth (구글 로그인)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.google_oauth,
    name: 'Google OAuth',
    slug: 'google-oauth',
    category: 'social_login',
    dashboard_layer: 'frontend',
    dashboard_subcategory: 'social_login',
    description:
      'Google Identity Services for integrating Google Sign-In with OAuth 2.0 and OpenID Connect.',
    description_ko:
      'Google 계정으로 로그인하는 OAuth 2.0 기반 소셜 로그인으로, Google Cloud Console에서 클라이언트 ID/시크릿을 발급받아 사용합니다. 기본 OAuth 2.0 사용 자체는 무료입니다 (유료 Identity Platform과는 별개 제품).',
    icon_url: null,
    website_url: 'https://console.cloud.google.com',
    docs_url: 'https://developers.google.com/identity/protocols/oauth2',
    pricing_info: {
      free_tier: true,
      free_tier_details: '표준 OAuth 2.0 로그인 연동 자체는 무료. 공식 문서에 별도 비용 언급 없음.',
      plans: [
        { name: '무료', price: '$0' },
      ],
    },
    required_env_vars: [
      {
        name: 'GOOGLE_CLIENT_ID',
        public: false,
        description: 'Google OAuth Client ID from Cloud Console',
        description_ko: 'Google Cloud Console에서 발급받은 OAuth 클라이언트 ID',
      },
      {
        name: 'GOOGLE_CLIENT_SECRET',
        public: false,
        description: 'Google OAuth Client Secret',
        description_ko: 'Google OAuth 클라이언트 시크릿',
      },
      {
        name: 'GOOGLE_REDIRECT_URI',
        public: false,
        description: 'OAuth redirect URI registered in Google Cloud Console',
        description_ko: 'Google Cloud Console에 등록한 OAuth 리다이렉트 URI',
      },
    ],
    domain: 'backend',
    popularity_score: 95,
    difficulty_level: 'beginner',
    tags: ['social-login', 'google', 'oauth', 'openid-connect', 'gmail', '소셜로그인', '구글 로그인'],
    alternatives: ['kakao-login', 'naver-login', 'apple-login', 'github-oauth'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'flutter', 'react-native'],
      language: ['typescript', 'javascript', 'python', 'java', 'kotlin', 'swift', 'go'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/google-auth-library' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '$0' },
  },

  // -----------------------------------------------------------------------
  // Naver Login (네이버 로그인)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.naver_login,
    name: 'Naver Login',
    slug: 'naver-login',
    category: 'social_login',
    dashboard_layer: 'frontend',
    dashboard_subcategory: 'social_login',
    description:
      'Naver social login SDK for integrating Naver account-based authentication into web and mobile apps.',
    description_ko: '네이버 계정으로 로그인하는 국내 소셜 로그인 서비스입니다. 별도 이용 요금 없이 무료로 제공되는 것으로 파악됩니다.',
    icon_url: null,
    website_url: 'https://developers.naver.com',
    docs_url: 'https://developers.naver.com/docs/login/overview/overview.md',
    pricing_info: {
      free_tier: true,
      free_tier_details: '확인된 공식 가격 정책 없음 — 국내 소셜 로그인 API 관행상 무료로 판단되나 이번 세션에서 developers.naver.com 페이지를 직접 열람하지 못해 확정 불가.',
      plans: [{ name: 'Free', price: '무료' }],
    },
    required_env_vars: [
      {
        name: 'NAVER_CLIENT_ID',
        public: false,
        description: 'Naver Application Client ID',
        description_ko: '네이버 애플리케이션 클라이언트 ID',
      },
      {
        name: 'NAVER_CLIENT_SECRET',
        public: false,
        description: 'Naver Application Client Secret',
        description_ko: '네이버 애플리케이션 클라이언트 시크릿',
      },
      {
        name: 'NAVER_REDIRECT_URI',
        public: false,
        description: 'OAuth callback URL registered in Naver Developers',
        description_ko: '네이버 개발자 센터에 등록한 OAuth 콜백 URL',
      },
    ],
    domain: 'backend',
    popularity_score: 88,
    difficulty_level: 'beginner',
    tags: ['social-login', 'naver', 'oauth', 'korea', '한국', '소셜로그인', '네이버', '네이버 로그인'],
    alternatives: ['kakao-login', 'google-oauth', 'apple-login', 'github-oauth'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'flutter', 'react-native'],
      language: ['typescript', 'javascript', 'java', 'kotlin', 'swift'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/passport-naver-v2' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '$0' },
  },

  // -----------------------------------------------------------------------
  // Apple Login (애플 로그인)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.apple_login,
    name: 'Apple Login',
    slug: 'apple-login',
    category: 'social_login',
    dashboard_layer: 'frontend',
    dashboard_subcategory: 'social_login',
    description:
      'Sign in with Apple for secure, privacy-focused authentication using Apple ID across web and mobile apps.',
    description_ko:
      'Apple ID로 로그인하는 Sign in with Apple 기능입니다. 기능 자체 추가 요금은 없으나, 사용하려면 연 $99의 Apple Developer Program 유료 가입이 필수입니다.',
    icon_url: null,
    website_url: 'https://developer.apple.com',
    docs_url: 'https://developer.apple.com/sign-in-with-apple/',
    pricing_info: {
      free_tier: false,
      free_tier_details: '무료 Apple ID만으로는 Sign in with Apple 활성화 불가 — Apple Developer Program($99/년) 가입이 전제조건.',
      plans: [
        { name: 'Apple Developer Program', price: '$99/년' },
      ],
    },
    required_env_vars: [
      {
        name: 'APPLE_CLIENT_ID',
        public: false,
        description: 'Apple Services ID (Client ID)',
        description_ko: 'Apple Services ID (클라이언트 ID)',
      },
      {
        name: 'APPLE_TEAM_ID',
        public: false,
        description: 'Apple Developer Team ID',
        description_ko: 'Apple Developer 팀 ID',
      },
      {
        name: 'APPLE_KEY_ID',
        public: false,
        description: 'Apple Sign In private key ID',
        description_ko: 'Apple Sign In 비공개 키 ID',
      },
      {
        name: 'APPLE_PRIVATE_KEY',
        public: false,
        description: 'Apple Sign In private key (PEM format)',
        description_ko: 'Apple Sign In 비공개 키 (PEM 형식)',
      },
      {
        name: 'APPLE_REDIRECT_URI',
        public: false,
        description: 'OAuth redirect URI for Sign in with Apple',
        description_ko: 'Apple 로그인 OAuth 리다이렉트 URI',
      },
    ],
    domain: 'backend',
    popularity_score: 82,
    difficulty_level: 'intermediate',
    tags: ['social-login', 'apple', 'oauth', 'ios', 'privacy', '소셜로그인', '애플 로그인'],
    alternatives: ['kakao-login', 'google-oauth', 'naver-login', 'github-oauth'],
    compatibility: {
      framework: ['nextjs', 'react', 'flutter', 'react-native', 'swift-ui'],
      language: ['typescript', 'javascript', 'swift', 'kotlin', 'java'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/apple-signin-auth' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 30,
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '$0' },
  },

  // -----------------------------------------------------------------------
  // GitHub OAuth (깃허브 로그인)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.github_oauth,
    name: 'GitHub OAuth',
    slug: 'github-oauth',
    category: 'social_login',
    dashboard_layer: 'frontend',
    dashboard_subcategory: 'social_login',
    description:
      'GitHub OAuth Apps for developer-focused authentication using GitHub accounts.',
    description_ko:
      'GitHub 계정으로 로그인하는 OAuth App 연동 기능입니다. 계정당 최대 100개의 OAuth App을 등록할 수 있으며, 사용 자체는 무료입니다. GitHub는 세분화된 권한 제어를 위해 OAuth App 대신 GitHub App 사용을 권장하는 추세입니다.',
    icon_url: null,
    website_url: 'https://github.com/settings/developers',
    docs_url: 'https://docs.github.com/en/apps/oauth-apps',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'GitHub OAuth App 등록/사용은 무료. 계정/조직당 최대 100개 OAuth App 등록 가능.',
      plans: [
        { name: '무료', price: '$0' },
      ],
    },
    required_env_vars: [
      {
        name: 'GITHUB_CLIENT_ID',
        public: false,
        description: 'GitHub OAuth App Client ID',
        description_ko: 'GitHub OAuth App 클라이언트 ID',
      },
      {
        name: 'GITHUB_CLIENT_SECRET',
        public: false,
        description: 'GitHub OAuth App Client Secret',
        description_ko: 'GitHub OAuth App 클라이언트 시크릿',
      },
      {
        name: 'GITHUB_REDIRECT_URI',
        public: false,
        description: 'Authorization callback URL registered in GitHub',
        description_ko: 'GitHub에 등록한 Authorization callback URL',
      },
    ],
    domain: 'backend',
    popularity_score: 85,
    difficulty_level: 'beginner',
    tags: ['social-login', 'github', 'oauth', 'developer', '소셜로그인', '개발자', '깃허브 로그인'],
    alternatives: ['kakao-login', 'google-oauth', 'naver-login', 'apple-login'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'express', 'fastify'],
      language: ['typescript', 'javascript', 'python', 'go', 'ruby'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/octokit' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '$0' },
  },

  // -----------------------------------------------------------------------
  // Phase 4 — New Services (59–85)
  // -----------------------------------------------------------------------

  // 59. Auth0
  {
    id: SERVICE_IDS.auth0,
    name: 'Auth0',
    slug: 'auth0',
    category: 'auth',
    dashboard_layer: 'frontend',
    dashboard_subcategory: 'auth',
    description:
      'Enterprise-grade identity platform with SSO, MFA, and social login support.',
    description_ko:
      'Okta 산하의 엔터프라이즈급 인증·아이덴티티 플랫폼입니다. 무료 플랜은 최대 25,000 MAU까지 이용 가능하며, 2026년부터 B2C/B2B 요금제가 분리되었습니다.',
    icon_url: null,
    website_url: 'https://auth0.com',
    docs_url: 'https://auth0.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '최대 25,000 MAU까지 무료(신용카드 불필요). MFA·RBAC·프리미엄 지원 등 고급 기능은 미포함.',
      plans: [
        { name: 'Free', price: '$0 (~25,000 MAU)' },
        { name: 'Essentials (B2C)', price: '$35/월 (500 MAU 기준)' },
        { name: 'Essentials (B2B)', price: '$150/월 (500 MAU 기준)' },
        { name: 'Professional (B2C)', price: '$240/월 (500 MAU 기준)' },
        { name: 'Professional (B2B)', price: '$800/월 (500 MAU 기준)' },
        { name: 'Enterprise', price: '맞춤 견적' },
      ],
    },
    required_env_vars: [
      {
        name: 'AUTH0_SECRET',
        public: false,
        description: 'Auth0 secret for session encryption',
        description_ko: 'Auth0 세션 암호화 시크릿',
      },
      {
        name: 'AUTH0_BASE_URL',
        public: true,
        description: 'Application base URL',
        description_ko: '앱 기본 URL',
      },
      {
        name: 'AUTH0_ISSUER_BASE_URL',
        public: true,
        description: 'Auth0 issuer URL',
        description_ko: 'Auth0 발급자 URL',
      },
      {
        name: 'AUTH0_CLIENT_ID',
        public: true,
        description: 'Auth0 client ID',
        description_ko: 'Auth0 클라이언트 ID',
      },
      {
        name: 'AUTH0_CLIENT_SECRET',
        public: false,
        description: 'Auth0 client secret',
        description_ko: 'Auth0 클라이언트 시크릿',
      },
    ],
    domain: 'backend',
    popularity_score: 88,
    difficulty_level: 'intermediate',
    tags: ['auth', 'sso', 'mfa', 'oauth', 'identity', '오스제로', '인증'],
    alternatives: ['clerk', 'nextauth'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'express'],
      language: ['typescript', 'javascript', 'python', 'java', 'go'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@auth0/nextjs-auth0' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 25,
    monthly_cost_estimate: { starter: '$0', growth: '$35-240', enterprise: '$150-800+' },
  },

  // 60. Convex
  {
    id: SERVICE_IDS.convex,
    name: 'Convex',
    slug: 'convex',
    category: 'database',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'database',
    description:
      'Reactive backend-as-a-service with real-time sync, serverless functions, and built-in database.',
    description_ko: 'TypeScript 함수와 리액티브 쿼리를 결합한 백엔드 플랫폼으로, DB·파일 저장·벡터 검색·인증을 하나의 런타임에서 제공합니다.',
    icon_url: null,
    website_url: 'https://convex.dev',
    docs_url: 'https://docs.convex.dev',
    pricing_info: {
      free_tier: true,
      free_tier_details: '함수 호출 월 100만 회, DB 저장 0.5GB, 파일 저장 1GB 포함.',
      plans: [
        { name: 'Free & Starter', price: '$0' },
        { name: 'Professional', price: '$25/개발자/월 (25M 함수 호출 포함, 1~20명)' },
        { name: 'Business & Enterprise', price: '$2,500/월~ (최소 요금, 50명+)' },
      ],
    },
    required_env_vars: [
      {
        name: 'CONVEX_DEPLOYMENT',
        public: true,
        description: 'Convex deployment URL',
        description_ko: 'Convex 배포 URL',
      },
      {
        name: 'NEXT_PUBLIC_CONVEX_URL',
        public: true,
        description: 'Convex public URL for client',
        description_ko: 'Convex 클라이언트 공개 URL',
      },
      {
        name: 'CONVEX_DEPLOY_KEY',
        public: false,
        description: 'Convex deploy key for CI/CD',
        description_ko: 'Convex CI/CD 배포 키',
      },
    ],
    domain: 'backend',
    popularity_score: 75,
    difficulty_level: 'beginner',
    tags: ['database', 'realtime', 'serverless', 'baas', 'reactive', '컨벡스', '데이터베이스'],
    alternatives: ['supabase', 'firebase'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'svelte'],
      language: ['typescript', 'javascript'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/convex' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$25/개발자', enterprise: '$2,500+' },
  },

  // 61. Drizzle ORM
  {
    id: SERVICE_IDS.drizzle,
    name: 'Drizzle ORM',
    slug: 'drizzle',
    category: 'database',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'database',
    description:
      'Lightweight TypeScript ORM with SQL-like syntax and zero dependencies.',
    description_ko:
      'SQL에 가까운 문법을 가진 헤드리스 TypeScript ORM으로, PostgreSQL·MySQL·SQLite·MSSQL 등을 지원합니다. 핵심 라이브러리는 Apache 2.0 라이선스의 완전 무료 오픈소스입니다.',
    icon_url: null,
    website_url: 'https://orm.drizzle.team',
    docs_url: 'https://orm.drizzle.team/docs/overview',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'ORM 코어는 완전 무료 오픈소스. 부가 유료 서비스로 Drizzle Studio, OneDollarStats($1/월) 등 별도 제품이 존재.',
      plans: [
        { name: '오픈소스 코어', price: '$0' },
      ],
    },
    required_env_vars: [
      {
        name: 'DATABASE_URL',
        public: false,
        description: 'Database connection string',
        description_ko: '데이터베이스 연결 문자열',
      },
      {
        name: 'DATABASE_AUTH_TOKEN',
        public: false,
        description: 'Database auth token (for Turso/LibSQL)',
        description_ko: '데이터베이스 인증 토큰 (Turso/LibSQL용)',
      },
    ],
    domain: 'backend',
    popularity_score: 85,
    difficulty_level: 'intermediate',
    tags: ['orm', 'typescript', 'sql', 'postgres', 'mysql', 'sqlite', '드리즐', 'ORM'],
    alternatives: ['prisma'],
    compatibility: {
      framework: ['nextjs', 'react', 'express', 'fastify', 'hono'],
      language: ['typescript', 'javascript'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/drizzle-orm' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '$0' },
  },

  // 62. Prisma
  {
    id: SERVICE_IDS.prisma,
    name: 'Prisma',
    slug: 'prisma',
    category: 'database',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'database',
    description:
      'Next-generation TypeScript ORM with auto-generated client, migrations, and a visual database browser.',
    description_ko:
      '타입 세이프 쿼리를 지원하는 오픈소스 ORM(Prisma ORM)과, 이를 기반으로 한 관리형 서버리스 Postgres(Prisma Postgres)를 함께 제공합니다.',
    icon_url: null,
    website_url: 'https://www.prisma.io',
    docs_url: 'https://www.prisma.io/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Prisma ORM은 항상 무료. Prisma Postgres 무료 플랜: 오퍼레이션 10만/월, 저장 500MB, DB 50개, 카드 등록 불필요.',
      plans: [
        { name: 'Prisma ORM (오픈소스)', price: '$0' },
        { name: 'Prisma Postgres Free', price: '$0' },
        { name: 'Starter', price: '$10/월 (100만 오퍼레이션, 10GB)' },
        { name: 'Pro', price: '$49/월 (1000만 오퍼레이션, 50GB)' },
        { name: 'Business', price: '$129/월 (5000만 오퍼레이션, 100GB)' },
      ],
    },
    required_env_vars: [
      {
        name: 'DATABASE_URL',
        public: false,
        description: 'Database connection string',
        description_ko: '데이터베이스 연결 문자열',
      },
      {
        name: 'DIRECT_URL',
        public: false,
        description: 'Direct DB URL for migrations (bypasses pooler)',
        description_ko: '마이그레이션용 직접 DB URL (풀러 우회)',
      },
      {
        name: 'PRISMA_ACCELERATE_URL',
        public: false,
        description: 'Prisma Accelerate connection URL',
        description_ko: 'Prisma Accelerate 연결 URL',
      },
    ],
    domain: 'backend',
    popularity_score: 90,
    difficulty_level: 'beginner',
    tags: ['orm', 'typescript', 'postgres', 'mysql', 'sqlite', 'migrations', '프리즈마', 'ORM'],
    alternatives: ['drizzle'],
    compatibility: {
      framework: ['nextjs', 'react', 'express', 'fastify', 'nestjs'],
      language: ['typescript', 'javascript'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@prisma/client' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0', growth: '$10-49', enterprise: '$129+' },
  },

  // 63. Turso
  {
    id: SERVICE_IDS.turso,
    name: 'Turso',
    slug: 'turso',
    category: 'database',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'database',
    description:
      'Edge-hosted SQLite database built on libSQL with global replication and embedded replicas.',
    description_ko:
      'SQLite 기반 libSQL 엔진을 사용하는 엣지 데이터베이스 서비스로, 전 세계에 분산 복제되는 서버리스 DB를 제공합니다. Free/Developer/Scaler/Pro/Enterprise 5단계 요금제를 운영합니다.',
    icon_url: null,
    website_url: 'https://turso.tech',
    docs_url: 'https://docs.turso.tech/',
    pricing_info: {
      free_tier: true,
      free_tier_details: '5GB 스토리지, 데이터베이스 100개, 월간 행 읽기 5억, 월간 행 쓰기 1,000만, 월간 동기화 3GB, PITR 1일',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Developer', price: '$4.99/월' },
        { name: 'Scaler', price: '$24.92/월' },
        { name: 'Pro', price: '$416.58/월' },
        { name: 'Enterprise', price: '맞춤형(문의)' },
      ],
    },
    required_env_vars: [
      {
        name: 'TURSO_DATABASE_URL',
        public: false,
        description: 'Turso database URL (libsql://)',
        description_ko: 'Turso 데이터베이스 URL (libsql://)',
      },
      {
        name: 'TURSO_AUTH_TOKEN',
        public: false,
        description: 'Turso authentication token',
        description_ko: 'Turso 인증 토큰',
      },
    ],
    domain: 'backend',
    popularity_score: 76,
    difficulty_level: 'beginner',
    tags: ['sqlite', 'edge', 'database', 'libsql', 'replication', '투르소', '데이터베이스'],
    alternatives: ['neon', 'planetscale'],
    compatibility: {
      framework: ['nextjs', 'react', 'svelte', 'astro', 'hono'],
      language: ['typescript', 'javascript', 'rust', 'python', 'go'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@libsql/client' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$4.99-24.92', enterprise: '$416.58+' },
  },

  // 64. Redis Cloud
  {
    id: SERVICE_IDS.redis_cloud,
    name: 'Redis Cloud',
    slug: 'redis-cloud',
    category: 'cache',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'database',
    description:
      'Fully managed Redis service with auto-scaling, multi-zone replication, and enterprise security.',
    description_ko:
      'Redis Inc가 제공하는 완전관리형 Redis 클라우드 서비스로, 무료 Free 플랜(30MB)과 Essentials·Pro 구독 플랜, 연간 계약 기반 Enterprise 플랜을 운영합니다.',
    icon_url: null,
    website_url: 'https://redis.io/cloud',
    docs_url: 'https://redis.io/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '항상 무료(Free Plan), 최대 30MB, 단일 데이터베이스, Best-effort SLA, 커뮤니티 지원만 제공',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Essentials', price: '$0.007/시간(월 최소 $5)' },
        { name: 'Pro', price: '$0.014/시간(월 최소 $200, 첫 $200 무료)' },
        { name: 'Enterprise', price: '연간 계약, 맞춤형(문의)' },
      ],
    },
    required_env_vars: [
      {
        name: 'REDIS_URL',
        public: false,
        description: 'Redis connection URL',
        description_ko: 'Redis 연결 URL',
      },
      {
        name: 'REDIS_TOKEN',
        public: false,
        description: 'Redis authentication token',
        description_ko: 'Redis 인증 토큰',
      },
    ],
    domain: 'backend',
    popularity_score: 86,
    difficulty_level: 'intermediate',
    tags: ['cache', 'redis', 'key-value', 'session', 'pub-sub', '레디스', '캐시'],
    alternatives: ['upstash-redis'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify', 'nestjs', 'django'],
      language: ['typescript', 'javascript', 'python', 'go', 'java'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/redis' },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0(30MB)', growth: '$5-200+', enterprise: '맞춤형(연간 계약)' },
  },

  // 65. Vercel KV
  {
    id: SERVICE_IDS.vercel_kv,
    name: 'Vercel KV',
    slug: 'vercel-kv',
    category: 'cache',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'database',
    description:
      'Serverless Redis-compatible key-value store by Vercel, powered by Upstash.',
    description_ko:
      'Vercel의 자체 KV(Key-Value) 스토리지 제품은 단종되었으며, 현재는 Vercel Marketplace를 통해 Upstash Redis 등 서드파티 Redis 공급자를 연결하는 방식으로 완전히 대체되었습니다.',
    icon_url: null,
    website_url: 'https://vercel.com/storage/kv',
    docs_url: 'https://vercel.com/docs/redis',
    pricing_info: {
      free_tier: false,
      free_tier_details: '제품 단종 — Vercel 자체 요금제 없음. 요금은 Marketplace에서 선택한 Redis 공급자(Upstash 등) 정책을 따른다.',
      plans: [
        { name: '단종 (2024-12 Upstash 이관)', price: '해당 없음' },
      ],
    },
    required_env_vars: [
      {
        name: 'KV_URL',
        public: false,
        description: 'Vercel KV connection URL',
        description_ko: 'Vercel KV 연결 URL',
      },
      {
        name: 'KV_REST_API_URL',
        public: false,
        description: 'Vercel KV REST API URL',
        description_ko: 'Vercel KV REST API URL',
      },
      {
        name: 'KV_REST_API_TOKEN',
        public: false,
        description: 'Vercel KV REST API token',
        description_ko: 'Vercel KV REST API 토큰',
      },
      {
        name: 'KV_REST_API_READ_ONLY_TOKEN',
        public: false,
        description: 'Vercel KV read-only token',
        description_ko: 'Vercel KV 읽기 전용 토큰',
      },
    ],
    domain: 'backend',
    popularity_score: 72,
    difficulty_level: 'beginner',
    tags: ['cache', 'redis', 'key-value', 'serverless', 'vercel', '버셀 KV', '캐시'],
    alternatives: ['upstash-redis', 'redis-cloud'],
    compatibility: {
      framework: ['nextjs', 'react', 'svelte'],
      language: ['typescript', 'javascript'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@vercel/kv' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0', growth: '$10', enterprise: '문의' },
  },

  // 66. Pinecone
  {
    id: SERVICE_IDS.pinecone,
    name: 'Pinecone',
    slug: 'pinecone',
    category: 'ai',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'ai',
    description:
      'Managed vector database for building high-performance AI applications with similarity search.',
    description_ko:
      '완전관리형 벡터 데이터베이스로 RAG·시맨틱 검색 등 AI 애플리케이션에 사용됩니다. 무료 Starter, 신설된 Builder($20/월), 종량제 기반 Standard(최소 $50/월)·Enterprise(최소 $500/월) 플랜을 제공합니다.',
    icon_url: null,
    website_url: 'https://www.pinecone.io',
    docs_url: 'https://docs.pinecone.io',
    pricing_info: {
      free_tier: true,
      free_tier_details: '스토리지 2GB, 쓰기 월 200만 유닛, 읽기 월 100만 유닛, 이그레스 월 1GB, 최대 인덱스 5개',
      plans: [
        { name: 'Starter', price: '$0' },
        { name: 'Builder', price: '$20/월' },
        { name: 'Standard', price: '최소 $50/월 + 종량제' },
        { name: 'Enterprise', price: '최소 $500/월 + 종량제' },
      ],
    },
    required_env_vars: [
      {
        name: 'PINECONE_API_KEY',
        public: false,
        description: 'Pinecone API key',
        description_ko: 'Pinecone API 키',
      },
      {
        name: 'PINECONE_ENVIRONMENT',
        public: true,
        description: 'Pinecone environment (e.g., us-east-1)',
        description_ko: 'Pinecone 환경 (예: us-east-1)',
      },
      {
        name: 'PINECONE_INDEX_NAME',
        public: true,
        description: 'Pinecone index name',
        description_ko: 'Pinecone 인덱스 이름',
      },
    ],
    domain: 'backend',
    popularity_score: 82,
    difficulty_level: 'intermediate',
    tags: ['vector-db', 'ai', 'embeddings', 'similarity-search', 'rag', '파인콘', '벡터DB'],
    alternatives: ['weaviate', 'qdrant', 'chroma'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify', 'django', 'flask'],
      language: ['typescript', 'javascript', 'python', 'go', 'java'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@pinecone-database/pinecone' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0', growth: '$20-50+', enterprise: '$500+' },
  },

  // 67. LangChain
  {
    id: SERVICE_IDS.langchain,
    name: 'LangChain',
    slug: 'langchain',
    category: 'ai',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'ai',
    description:
      'Framework for building LLM-powered applications with chains, agents, and retrieval-augmented generation.',
    description_ko:
      '오픈소스 LLM 애플리케이션 개발 프레임워크로 그 자체는 무료입니다. 관측성·평가·배포 플랫폼인 LangSmith는 Developer(무료)·Plus($39/좌석/월)·Enterprise(맞춤형) 플랜으로 별도 과금됩니다.',
    icon_url: null,
    website_url: 'https://www.langchain.com',
    docs_url: 'https://docs.langchain.com/oss/javascript/langchain/overview',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'LangChain 프레임워크 자체는 완전 무료(오픈소스). LangSmith Developer 플랜: 월 5,000 트레이스, 14일 보관, 1인 사용자',
      plans: [
        { name: 'LangChain(오픈소스)', price: '$0' },
        { name: 'LangSmith Developer', price: '$0/월(종량제 오버리지)' },
        { name: 'LangSmith Plus', price: '$39/좌석/월(10,000 트레이스 포함, 초과 1,000건당 $2.50)' },
        { name: 'LangSmith Enterprise', price: '맞춤형(문의)' },
      ],
    },
    required_env_vars: [
      {
        name: 'LANGCHAIN_API_KEY',
        public: false,
        description: 'LangSmith API key for tracing',
        description_ko: 'LangSmith 추적용 API 키',
      },
      {
        name: 'LANGCHAIN_TRACING_V2',
        public: true,
        description: 'Enable LangSmith tracing (true/false)',
        description_ko: 'LangSmith 추적 활성화 (true/false)',
      },
      {
        name: 'LANGCHAIN_PROJECT',
        public: true,
        description: 'LangSmith project name',
        description_ko: 'LangSmith 프로젝트 이름',
      },
    ],
    domain: 'backend',
    popularity_score: 88,
    difficulty_level: 'advanced',
    tags: ['llm', 'ai', 'rag', 'agents', 'orchestration', 'langsmith', '랭체인'],
    alternatives: ['llamaindex', 'semantic-kernel', 'haystack'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify', 'django', 'flask'],
      language: ['typescript', 'javascript', 'python'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/langchain' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 20,
    monthly_cost_estimate: { starter: '$0(오픈소스)', growth: '$39/seat', enterprise: '맞춤형' },
  },

  // 68. Replicate
  {
    id: SERVICE_IDS.replicate,
    name: 'Replicate',
    slug: 'replicate',
    category: 'ai',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'ai',
    description:
      'Cloud platform for running open-source AI models with a simple API.',
    description_ko:
      '다양한 오픈소스/커스텀 AI 모델을 API로 배포·실행할 수 있는 모델 호스팅 플랫폼으로, 2025년 11월 Cloudflare에 인수되었으나 독립 브랜드로 운영 중입니다.',
    icon_url: null,
    website_url: 'https://replicate.com',
    docs_url: 'https://replicate.com/docs',
    pricing_info: {
      free_tier: false,
      free_tier_details: '상시 무료 티어 없음. 신규 계정은 선불 크레딧 구매(1년 유효) 방식이며, 퍼블릭 모델은 실제 처리 시간만 과금(콜드스타트 무료).',
      plans: [
        { name: 'CPU 예측', price: '$0.000025/초' },
        { name: 'Nvidia T4', price: '$0.000225/초' },
        { name: 'Nvidia A100 (80GB)', price: '$0.001400/초 ($5.04/시간)' },
        { name: 'Nvidia H100', price: '$0.001525/초' },
      ],
    },
    required_env_vars: [
      {
        name: 'REPLICATE_API_TOKEN',
        public: false,
        description: 'Replicate API token',
        description_ko: 'Replicate API 토큰',
      },
    ],
    domain: 'backend',
    popularity_score: 80,
    difficulty_level: 'beginner',
    tags: ['ai', 'ml', 'model-hosting', 'inference', 'open-source', '레플리케이트'],
    alternatives: ['huggingface', 'modal', 'together-ai', 'fireworks-ai'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify', 'django', 'flask'],
      language: ['typescript', 'javascript', 'python', 'go', 'swift'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/replicate' },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$5-50 (종량제)', growth: '$50-500', enterprise: '맞춤 견적' },
  },

  // 69. Hugging Face
  {
    id: SERVICE_IDS.huggingface,
    name: 'Hugging Face',
    slug: 'huggingface',
    category: 'ai',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'ai',
    description:
      'Open-source AI model hub with Inference API, Spaces, and thousands of pre-trained models.',
    description_ko: '200만 개 이상의 공개 모델·데이터셋을 호스팅하는 ML 커뮤니티 허브로, Spaces·Inference·추론 크레딧 등 개발자용 유료 플랜을 제공합니다.',
    icon_url: null,
    website_url: 'https://huggingface.co',
    docs_url: 'https://huggingface.co/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '공개 모델/데이터셋 무제한 열람, 100GB 프라이빗 스토리지, 소량 ZeroGPU 쿼터 무료 제공.',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'PRO', price: '$9/월' },
        { name: 'Team', price: '$20/사용자/월' },
        { name: 'Enterprise', price: '$50/사용자/월~' },
      ],
    },
    required_env_vars: [
      {
        name: 'HUGGINGFACE_API_KEY',
        public: false,
        description: 'Hugging Face API token',
        description_ko: 'Hugging Face API 토큰',
      },
      {
        name: 'HUGGINGFACE_MODEL_ID',
        public: true,
        description: 'Model ID (e.g., meta-llama/Llama-2-7b)',
        description_ko: '모델 ID (예: meta-llama/Llama-2-7b)',
      },
    ],
    domain: 'backend',
    popularity_score: 92,
    difficulty_level: 'intermediate',
    tags: ['ai', 'ml', 'models', 'inference', 'nlp', 'open-source', '허깅페이스'],
    alternatives: ['replicate', 'modal', 'wandb'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify', 'django', 'flask'],
      language: ['typescript', 'javascript', 'python', 'rust'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@huggingface/inference' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0-9', growth: '$20-50/사용자', enterprise: '$50+/사용자' },
  },

  // 70. Stability AI
  {
    id: SERVICE_IDS.stability_ai,
    name: 'Stability AI',
    slug: 'stability-ai',
    category: 'ai',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'ai',
    description:
      'AI image generation platform powering Stable Diffusion and SDXL models via REST API.',
    description_ko:
      'Stable Diffusion 등 생성형 이미지·오디오·3D AI 모델을 API로 제공하며, 크레딧 기반 종량제(1크레딧=$0.01)로 과금됩니다. 별도로 자체 호스팅 모델 사용을 위한 Professional 멤버십($20/월) 라이선스도 운영합니다.',
    icon_url: null,
    website_url: 'https://stability.ai',
    docs_url: 'https://platform.stability.ai/docs',
    pricing_info: {
      free_tier: false,
      free_tier_details: '신규 가입 시 25 크레딧을 1회성으로 제공, 이후 지속되는 월간 무료 한도는 없음',
      plans: [
        { name: 'API 종량제(Pay-as-you-go)', price: '크레딧 기반, 1크레딧=$0.01' },
        { name: 'Professional Membership(자체 호스팅 라이선스)', price: '$20/월' },
        { name: 'Enterprise', price: '맞춤형(문의)' },
      ],
    },
    required_env_vars: [
      {
        name: 'STABILITY_API_KEY',
        public: false,
        description: 'Stability AI API key',
        description_ko: 'Stability AI API 키',
      },
    ],
    domain: 'backend',
    popularity_score: 78,
    difficulty_level: 'beginner',
    tags: ['ai', 'image-generation', 'stable-diffusion', 'sdxl', 'generative', '스태빌리티', '이미지생성'],
    alternatives: ['openai', 'midjourney', 'replicate'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify', 'django'],
      language: ['typescript', 'javascript', 'python', 'go'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@stability-ai/sdk' },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0(가입 크레딧 소진 후 종량제)', growth: '$20/월~', enterprise: '맞춤형' },
  },

  // 71. Notion API
  {
    id: SERVICE_IDS.notion_api,
    name: 'Notion API',
    slug: 'notion-api',
    category: 'automation',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'ide',
    description:
      'Official Notion API for building integrations, managing databases, and automating workflows.',
    description_ko:
      'Notion 워크스페이스와 연동하는 공식 REST API로, 내부/공개 통합과 웹훅을 지원합니다. Notion 자체는 Free/Plus/Business/Enterprise 요금제로 운영됩니다.',
    icon_url: null,
    website_url: 'https://www.notion.com',
    docs_url: 'https://developers.notion.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '공식 가격 페이지(notion.com/pricing)와 개발자 문서 간 설명이 상충됨 — 아래 notes 참조',
      plans: [
        { name: 'Free', price: '₩0/월' },
        { name: 'Plus', price: '₩14,000/월(인당)' },
        { name: 'Business', price: '₩30,000/월(인당)' },
        { name: 'Enterprise', price: '맞춤형(문의)' },
      ],
    },
    required_env_vars: [
      {
        name: 'NOTION_API_KEY',
        public: false,
        description: 'Notion internal integration token',
        description_ko: 'Notion 내부 통합 토큰',
      },
      {
        name: 'NOTION_DATABASE_ID',
        public: false,
        description: 'Target Notion database ID',
        description_ko: '대상 Notion 데이터베이스 ID',
      },
    ],
    domain: 'backend',
    popularity_score: 82,
    difficulty_level: 'beginner',
    tags: ['automation', 'notion', 'api', 'cms', 'productivity', '노션', '자동화'],
    alternatives: ['airtable', 'coda', 'google-sheets-api'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify', 'django'],
      language: ['typescript', 'javascript', 'python', 'go'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@notionhq/client' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '₩0', growth: '₩14,000-30,000/인', enterprise: '맞춤형' },
  },

  // 72. Linear API
  {
    id: SERVICE_IDS.linear_api,
    name: 'Linear',
    slug: 'linear-api',
    category: 'automation',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'cicd',
    description:
      'Issue tracking and project management tool with a powerful GraphQL API for developer workflows.',
    description_ko: '이슈 트래킹·프로젝트 관리 툴 Linear의 GraphQL API로, Free 플랜을 포함한 모든 요금제에서 API 및 웹훅 접근이 제공됩니다.',
    icon_url: null,
    website_url: 'https://linear.app',
    docs_url: 'https://linear.app/developers',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무제한 인원, 최대 250개 미보관 이슈, 2개 팀, 파일 업로드 10MB 제한. 모든 플랜에서 API/웹훅 접근 가능',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Basic', price: '$10/user/월(연간 결제)' },
        { name: 'Business', price: '$16/user/월(연간 결제)' },
        { name: 'Enterprise', price: '맞춤형(문의)' },
      ],
    },
    required_env_vars: [
      {
        name: 'LINEAR_API_KEY',
        public: false,
        description: 'Linear personal API key',
        description_ko: 'Linear 개인 API 키',
      },
      {
        name: 'LINEAR_WEBHOOK_SECRET',
        public: false,
        description: 'Linear webhook signing secret',
        description_ko: 'Linear 웹훅 서명 시크릿',
      },
    ],
    domain: 'backend',
    popularity_score: 80,
    difficulty_level: 'beginner',
    tags: ['project-management', 'issue-tracker', 'graphql', 'devtools', 'automation', '리니어', '프로젝트관리'],
    alternatives: ['jira', 'github-issues', 'shortcut'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify'],
      language: ['typescript', 'javascript', 'python', 'go'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@linear/sdk' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$10-16/user', enterprise: '맞춤형' },
  },

  // 73. Toss Payments (토스페이먼츠)
  {
    id: SERVICE_IDS.toss_payments,
    name: '토스페이먼츠',
    slug: 'toss-payments',
    category: 'payment',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'payment',
    description:
      'Korean payment gateway by Toss supporting card, bank transfer, virtual account, and mobile payments.',
    description_ko: '국내 대표 PG(결제대행)사로 카드·간편결제·가상계좌 등 다양한 결제수단을 지원하며, 가맹점 등급(영세~일반)에 따라 차등 수수료율을 적용합니다.',
    icon_url: null,
    website_url: 'https://www.tosspayments.com',
    docs_url: 'https://docs.tosspayments.com',
    pricing_info: {
      free_tier: false,
      free_tier_details: '결제대행 서비스 특성상 \'무료 티어\' 개념이 아닌 거래건당 수수료 구조. 연회비·가입비는 무료',
      plans: [
        { name: '일반 가맹점(온라인)', price: '3.00%(부가세 별도)' },
        { name: '중소3', price: '2.40%' },
        { name: '중소2', price: '2.15%' },
        { name: '중소1', price: '1.90%' },
        { name: '영세', price: '1.60%' },
      ],
    },
    required_env_vars: [
      {
        name: 'TOSS_CLIENT_KEY',
        public: true,
        description: 'Toss Payments client key',
        description_ko: '토스페이먼츠 클라이언트 키',
      },
      {
        name: 'TOSS_SECRET_KEY',
        public: false,
        description: 'Toss Payments secret key',
        description_ko: '토스페이먼츠 시크릿 키',
      },
      {
        name: 'TOSS_WEBHOOK_SECRET',
        public: false,
        description: 'Toss Payments webhook secret',
        description_ko: '토스페이먼츠 웹훅 시크릿',
      },
    ],
    domain: 'backend',
    popularity_score: 85,
    difficulty_level: 'intermediate',
    tags: ['payment', 'korean', 'toss', 'pg', 'fintech', '결제', '토스페이먼츠', '토스'],
    alternatives: ['paypal'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'express'],
      language: ['typescript', 'javascript', 'java', 'python', 'php'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@tosspayments/payment-sdk' },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 30,
    monthly_cost_estimate: { starter: '수수료', growth: '수수료', enterprise: '수수료' },
  },

  // 74. PayPal
  {
    id: SERVICE_IDS.paypal,
    name: 'PayPal',
    slug: 'paypal',
    category: 'payment',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'payment',
    description:
      'Global payment platform supporting checkout, subscriptions, and payouts in 200+ countries.',
    description_ko:
      '글로벌 결제 플랫폼으로 PayPal Checkout, 카드결제, Venmo, Pay Later 등을 지원하며, 거래 유형·국내외 여부에 따라 수수료율이 다르게 적용됩니다.',
    icon_url: null,
    website_url: 'https://www.paypal.com',
    docs_url: 'https://developer.paypal.com/docs',
    pricing_info: {
      free_tier: false,
      free_tier_details: '결제대행 서비스 특성상 \'무료 티어\' 개념이 아닌 거래건당 수수료 구조',
      plans: [
        { name: 'PayPal Checkout(국내)', price: '3.49% + $0.49' },
        { name: '카드결제(Standard)', price: '2.99% + $0.49' },
        { name: 'QR코드(Zettle 등 대면결제)', price: '2.29% + $0.49' },
        { name: 'PayPal Pay Later', price: '4.99% + $0.49' },
        { name: '해외거래 추가수수료', price: '국내 수수료 + 1.50%' },
      ],
    },
    required_env_vars: [
      {
        name: 'PAYPAL_CLIENT_ID',
        public: true,
        description: 'PayPal client ID',
        description_ko: 'PayPal 클라이언트 ID',
      },
      {
        name: 'PAYPAL_CLIENT_SECRET',
        public: false,
        description: 'PayPal client secret',
        description_ko: 'PayPal 클라이언트 시크릿',
      },
      {
        name: 'PAYPAL_WEBHOOK_ID',
        public: false,
        description: 'PayPal webhook ID',
        description_ko: 'PayPal 웹훅 ID',
      },
    ],
    domain: 'backend',
    popularity_score: 88,
    difficulty_level: 'intermediate',
    tags: ['payment', 'global', 'checkout', 'subscriptions', 'payouts', '페이팔', '결제'],
    alternatives: ['toss-payments'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'express'],
      language: ['typescript', 'javascript', 'python', 'java', 'php'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@paypal/checkout-server-sdk' },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 25,
    monthly_cost_estimate: { starter: '수수료', growth: '수수료', enterprise: '수수료' },
  },

  // 75. AWS SES
  {
    id: SERVICE_IDS.aws_ses,
    name: 'AWS SES',
    slug: 'aws-ses',
    category: 'email',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'email',
    description:
      'Scalable email sending service by AWS for transactional and marketing emails.',
    description_ko:
      'AWS의 대량 이메일 발송 서비스(SMTP/API)로, 발신 이메일 1,000건당 과금되며 Essentials/Pro/Enterprise 3단계 요금제로 구분됩니다.',
    icon_url: null,
    website_url: 'https://aws.amazon.com/ses',
    docs_url: 'https://docs.aws.amazon.com/ses',
    pricing_info: {
      free_tier: true,
      free_tier_details: '신규 AWS 계정 대상 가입 후 6개월간 이용 가능한 프리티어 및 최대 $200 크레딧 제공(AWS 계정 전체 공통 혜택, SES 전용 영구 무료 한도와는 별개일 수 있어 재검증 필요)',
      plans: [
        { name: 'Essentials', price: '1,000건당 $0.11-$0.16(구간별)' },
        { name: 'Pro', price: '기본료 $105/월 + 1,000건당 $0.12-$0.22(구간별)' },
        { name: 'Enterprise', price: '기본료 $500/월 + 1,000건당 $0.13-$0.23(구간별)' },
      ],
    },
    required_env_vars: [
      {
        name: 'AWS_ACCESS_KEY_ID',
        public: false,
        description: 'AWS access key ID',
        description_ko: 'AWS 접근 키 ID',
      },
      {
        name: 'AWS_SECRET_ACCESS_KEY',
        public: false,
        description: 'AWS secret access key',
        description_ko: 'AWS 시크릿 접근 키',
      },
      {
        name: 'AWS_SES_REGION',
        public: true,
        description: 'AWS SES region (e.g., us-east-1)',
        description_ko: 'AWS SES 리전 (예: us-east-1)',
      },
      {
        name: 'AWS_SES_FROM_EMAIL',
        public: true,
        description: 'Verified sender email address',
        description_ko: '인증된 발신 이메일 주소',
      },
    ],
    domain: 'backend',
    popularity_score: 82,
    difficulty_level: 'intermediate',
    tags: ['email', 'aws', 'transactional', 'marketing', 'smtp', '아마존', '이메일'],
    alternatives: ['mailchimp'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify', 'nestjs', 'django'],
      language: ['typescript', 'javascript', 'python', 'go', 'java'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@aws-sdk/client-ses' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 30,
    monthly_cost_estimate: { starter: '종량제($0.11-0.16/1000건)', growth: '$105/월~', enterprise: '$500/월~' },
  },

  // 76. Mailchimp
  {
    id: SERVICE_IDS.mailchimp,
    name: 'Mailchimp',
    slug: 'mailchimp',
    category: 'email',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'email',
    description:
      'All-in-one email marketing platform with automation, templates, and audience management.',
    description_ko:
      '이메일 마케팅·마케팅 자동화 플랫폼으로 Free/Essentials/Standard/Premium 4단계 요금제를 운영하며, 연락처 수와 발송량에 따라 가격이 스케일링됩니다.',
    icon_url: null,
    website_url: 'https://mailchimp.com',
    docs_url: 'https://mailchimp.com/developer',
    pricing_info: {
      free_tier: true,
      free_tier_details: '연락처 최대 250개, 월 발송 최대 500건(일 250건), 사용자 1명',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Essentials', price: '$13/월~(14일 무료체험)' },
        { name: 'Standard', price: '$20/월~(월 최대 6,000건 발송, 14일 무료체험)' },
        { name: 'Premium', price: '$350/월~(월 최대 150,000건 발송)' },
      ],
    },
    required_env_vars: [
      {
        name: 'MAILCHIMP_API_KEY',
        public: false,
        description: 'Mailchimp API key',
        description_ko: 'Mailchimp API 키',
      },
      {
        name: 'MAILCHIMP_SERVER_PREFIX',
        public: true,
        description: 'Mailchimp data center prefix (e.g., us21)',
        description_ko: 'Mailchimp 데이터 센터 접두사 (예: us21)',
      },
      {
        name: 'MAILCHIMP_LIST_ID',
        public: false,
        description: 'Default audience/list ID',
        description_ko: '기본 오디언스/리스트 ID',
      },
    ],
    domain: 'backend',
    popularity_score: 84,
    difficulty_level: 'beginner',
    tags: ['email', 'marketing', 'automation', 'newsletter', 'crm', '메일침프', '이메일마케팅'],
    alternatives: ['aws-ses'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify', 'django'],
      language: ['typescript', 'javascript', 'python', 'php', 'ruby'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@mailchimp/mailchimp_marketing' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0', growth: '$13-20', enterprise: '$350+' },
  },

  // 77. ImageKit
  {
    id: SERVICE_IDS.imagekit,
    name: 'ImageKit',
    slug: 'imagekit',
    category: 'storage',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'storage',
    description:
      'Real-time image and video optimization, transformation, and CDN delivery platform.',
    description_ko:
      '이미지·비디오 실시간 최적화 및 CDN 전송에 특화된 미디어 관리 플랫폼으로, 미디어처리+DAM 통합 플랜과 DAM(디지털 자산관리) 전용 플랜을 별도로 제공합니다.',
    icon_url: null,
    website_url: 'https://imagekit.io',
    docs_url: 'https://imagekit.io/docs/',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 20GB 대역폭, 3GB DAM 스토리지, 비디오 유닛 500/확장 유닛 650, 최대 사용자 2명',
      plans: [
        { name: 'Forever Free', price: '$0/월' },
        { name: 'Lite', price: '$9/월~(대역폭 초과 $0.5/GB)' },
        { name: 'Pro', price: '$89/월~(대역폭 초과 $0.45/GB)' },
        { name: 'Enterprise', price: '맞춤형(문의)' },
      ],
    },
    required_env_vars: [
      {
        name: 'IMAGEKIT_PUBLIC_KEY',
        public: true,
        description: 'ImageKit public key',
        description_ko: 'ImageKit 공개 키',
      },
      {
        name: 'IMAGEKIT_PRIVATE_KEY',
        public: false,
        description: 'ImageKit private key',
        description_ko: 'ImageKit 비공개 키',
      },
      {
        name: 'IMAGEKIT_URL_ENDPOINT',
        public: true,
        description: 'ImageKit URL endpoint',
        description_ko: 'ImageKit URL 엔드포인트',
      },
    ],
    domain: 'backend',
    popularity_score: 74,
    difficulty_level: 'beginner',
    tags: ['image', 'cdn', 'optimization', 'video', 'media', 'storage', '이미지킷', '이미지'],
    alternatives: ['r2'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'svelte'],
      language: ['typescript', 'javascript', 'python', 'go', 'java'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/imagekit' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$9-89', enterprise: '맞춤형' },
  },

  // 78. Cloudflare R2
  {
    id: SERVICE_IDS.r2,
    name: 'Cloudflare R2',
    slug: 'r2',
    category: 'storage',
    dashboard_layer: 'backend',
    dashboard_subcategory: 'storage',
    description:
      'S3-compatible object storage by Cloudflare with zero egress fees and global distribution.',
    description_ko: 'S3 호환 오브젝트 스토리지로 이그레스(데이터 전송) 비용이 없는 것이 핵심 특징이며, 스토리지 용량 및 Class A/B 작업 단위로 과금됩니다.',
    icon_url: null,
    website_url: 'https://www.cloudflare.com/r2',
    docs_url: 'https://developers.cloudflare.com/r2',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Standard 스토리지 기준 월 10GB 무료, Class A(쓰기) 월 100만 요청 무료, Class B(읽기) 월 1,000만 요청 무료',
      plans: [
        { name: 'Standard 스토리지', price: '$0.015/GB/월' },
        { name: 'Infrequent Access 스토리지', price: '$0.01/GB/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'R2_ACCESS_KEY_ID',
        public: false,
        description: 'R2 access key ID',
        description_ko: 'R2 접근 키 ID',
      },
      {
        name: 'R2_SECRET_ACCESS_KEY',
        public: false,
        description: 'R2 secret access key',
        description_ko: 'R2 시크릿 접근 키',
      },
      {
        name: 'R2_BUCKET_NAME',
        public: true,
        description: 'R2 bucket name',
        description_ko: 'R2 버킷 이름',
      },
      {
        name: 'R2_ACCOUNT_ID',
        public: false,
        description: 'Cloudflare account ID',
        description_ko: 'Cloudflare 계정 ID',
      },
    ],
    domain: 'backend',
    popularity_score: 80,
    difficulty_level: 'intermediate',
    tags: ['storage', 's3-compatible', 'cloudflare', 'object-storage', 'cdn', '클라우드플레어', '스토리지'],
    alternatives: ['imagekit'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify', 'hono', 'django'],
      language: ['typescript', 'javascript', 'python', 'go', 'rust'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@aws-sdk/client-s3' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0(10GB 무료)', growth: '사용량 기반($0.015/GB~)', enterprise: '사용량 기반(대량 할인 문의)' },
  },

  // 79. Grafana
  {
    id: SERVICE_IDS.grafana,
    name: 'Grafana',
    slug: 'grafana',
    category: 'monitoring',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'monitoring',
    description:
      'Open-source observability platform for metrics, logs, and traces visualization with dashboards.',
    description_ko:
      '메트릭·로그·트레이스를 하나의 대시보드에서 시각화하는 오픈소스 관측성(Observability) 플랫폼이며, 매니지드 서비스인 Grafana Cloud도 함께 제공합니다.',
    icon_url: null,
    website_url: 'https://grafana.com',
    docs_url: 'https://grafana.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '영구 무료(신용카드 불필요) — 메트릭 1만 시리즈/월, 로그 50GB/월, 14일 보관',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro', price: '$19/월 기본료 + 종량제 (메트릭 1,000시리즈당 $6.50 등)' },
        { name: 'Enterprise', price: '연 최소 $25,000 커밋' },
      ],
    },
    required_env_vars: [
      {
        name: 'GRAFANA_URL',
        public: true,
        description: 'Grafana instance URL',
        description_ko: 'Grafana 인스턴스 URL',
      },
      {
        name: 'GRAFANA_API_KEY',
        public: false,
        description: 'Grafana API key or service account token',
        description_ko: 'Grafana API 키 또는 서비스 계정 토큰',
      },
      {
        name: 'GRAFANA_ORG_ID',
        public: true,
        description: 'Grafana organization ID',
        description_ko: 'Grafana 조직 ID',
      },
    ],
    domain: 'devtools',
    popularity_score: 82,
    difficulty_level: 'intermediate',
    tags: ['monitoring', 'observability', 'metrics', 'logs', 'dashboards', 'open-source', '그라파나', '모니터링'],
    alternatives: ['new-relic'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify', 'nestjs', 'django'],
      language: ['typescript', 'javascript', 'python', 'go', 'java'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/@grafana/grafana-foundation-sdk' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 20,
    monthly_cost_estimate: { starter: '$0', growth: '$19+ (종량제)', enterprise: '$25,000/year~' },
  },

  // 80. New Relic
  {
    id: SERVICE_IDS.new_relic,
    name: 'New Relic',
    slug: 'new-relic',
    category: 'monitoring',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'monitoring',
    description:
      'Full-stack observability platform with APM, infrastructure monitoring, and real user monitoring.',
    description_ko: 'APM, 인프라 모니터링, 로그, 브라우저/모바일 모니터링을 통합 제공하는 풀스택 관측성 SaaS 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://newrelic.com',
    docs_url: 'https://docs.newrelic.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '매월 데이터 인제스트 100GB 무료 + Basic 유저 무제한 무료 + Full Platform 유저 1명 무료 포함',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Standard', price: 'Full Platform 첫 유저 $10, 추가 유저 $99(최대 5명), Core 유저 $49' },
        { name: 'Pro', price: 'Full Platform 유저 연 $349(무제한 유저), Core 유저 $49' },
        { name: 'Enterprise', price: '맞춤 견적 (영업 문의)' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEW_RELIC_LICENSE_KEY',
        public: false,
        description: 'New Relic license key',
        description_ko: 'New Relic 라이선스 키',
      },
      {
        name: 'NEW_RELIC_APP_NAME',
        public: true,
        description: 'Application name in New Relic',
        description_ko: 'New Relic 애플리케이션 이름',
      },
      {
        name: 'NEW_RELIC_API_KEY',
        public: false,
        description: 'New Relic user API key',
        description_ko: 'New Relic 사용자 API 키',
      },
    ],
    domain: 'devtools',
    popularity_score: 84,
    difficulty_level: 'intermediate',
    tags: ['monitoring', 'apm', 'observability', 'rum', 'infrastructure', '뉴렐릭', '모니터링'],
    alternatives: ['grafana'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify', 'nestjs', 'django'],
      language: ['typescript', 'javascript', 'python', 'go', 'java', '.net'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/newrelic' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 20,
    monthly_cost_estimate: { starter: '$0', growth: '$10~$99/user', enterprise: '맞춤 견적' },
  },

  // 81. GitHub Copilot
  {
    id: SERVICE_IDS.github_copilot,
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    category: 'ai',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'ide',
    description:
      'AI pair programmer by GitHub that suggests code completions and generates functions from comments.',
    description_ko: 'GitHub의 AI 코딩 어시스턴트로, 2026년 6월부터 프리미엄 요청 대신 \'GitHub AI Credits\' 기반 사용량제 청구로 전환되었습니다.',
    icon_url: null,
    website_url: 'https://github.com/features/copilot',
    docs_url: 'https://docs.github.com/en/copilot',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free 플랜: 월 2,000회 코드 완성 + 50회 채팅 요청, 기본 모델 접근.',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro', price: '$10/월 (AI 크레딧 $15/월 포함)' },
        { name: 'Pro+', price: '$39/월 (AI 크레딧 $70/월 포함, Opus 등 프리미엄 모델)' },
        { name: 'Max (개인)', price: '$100/월 (AI 크레딧 $200/월 포함)' },
        { name: 'Business', price: '$19/사용자/월' },
        { name: 'Enterprise', price: '$39/사용자/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'GITHUB_COPILOT_TOKEN',
        public: false,
        description: 'GitHub Copilot auth token',
        description_ko: 'GitHub Copilot 인증 토큰',
      },
    ],
    domain: 'devtools',
    popularity_score: 97,
    difficulty_level: 'beginner',
    tags: ['ai', 'code-completion', 'github', 'ide', 'pair-programming', '깃허브 코파일럿'],
    alternatives: ['cursor', 'windsurf', 'tabnine', 'cline'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'svelte'],
      language: ['typescript', 'javascript', 'python', 'go', 'java', 'rust', 'c++'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0-10', growth: '$19-39/사용자', enterprise: '$39+/사용자' },
  },

  // 82. Cursor
  {
    id: SERVICE_IDS.cursor,
    name: 'Cursor',
    slug: 'cursor',
    category: 'ai',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'ide',
    description:
      'AI-first code editor built on VS Code with inline editing, chat, and multi-file generation.',
    description_ko: 'AI 네이티브 코드 에디터로, 크레딧 기반 사용량제(월 정액 크레딧 풀)로 운영되며 Hobby(무료)부터 Enterprise까지 제공합니다.',
    icon_url: null,
    website_url: 'https://cursor.com',
    docs_url: 'https://docs.cursor.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Hobby 플랜: 신용카드 불필요, 제한된 Agent 요청 및 탭 완성.',
      plans: [
        { name: 'Hobby', price: '$0' },
        { name: 'Pro/Pro+/Ultra 통합 Individual', price: '$16~$20/월(연간 $16, 월간 $20), Ultra는 $200/월까지' },
        { name: 'Teams', price: '$32~$40/사용자/월' },
        { name: 'Enterprise', price: '맞춤 견적' },
      ],
    },
    required_env_vars: [
      {
        name: 'CURSOR_API_KEY',
        public: false,
        optional: true,
        description: 'Cursor API key for extensions',
        description_ko: 'Cursor 확장 프로그램용 API 키 (확장 사용 시 필요)',
      },
    ],
    domain: 'devtools',
    popularity_score: 95,
    difficulty_level: 'beginner',
    tags: ['ai', 'ide', 'code-editor', 'vscode', 'pair-programming', '커서'],
    alternatives: ['github-copilot', 'windsurf', 'cline', 'devin'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'svelte'],
      language: ['typescript', 'javascript', 'python', 'go', 'java', 'rust'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0-20', growth: '$32-40/사용자', enterprise: '맞춤 견적' },
  },

  // 83. Vitest
  {
    id: SERVICE_IDS.vitest,
    name: 'Vitest',
    slug: 'vitest',
    category: 'testing',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'cicd',
    description:
      'Blazing fast Vite-native unit test framework with Jest-compatible API and built-in code coverage.',
    description_ko: 'Vite 기반의 차세대 자바스크립트/타입스크립트 테스트 프레임워크로, Jest 호환 API와 빠른 HMR 워치 모드를 제공하는 오픈소스 프로젝트입니다.',
    icon_url: null,
    website_url: 'https://vitest.dev',
    docs_url: 'https://vitest.dev/guide',
    pricing_info: {
      free_tier: true,
      free_tier_details: '완전 오픈소스 무료 (MIT 라이선스)',
      plans: [
        { name: '오픈소스', price: '$0' },
      ],
    },
    required_env_vars: [
      {
        name: 'CI',
        public: true,
        description: 'CI environment flag (true in CI pipelines)',
        description_ko: 'CI 환경 플래그 (CI 파이프라인에서 true)',
      },
      {
        name: 'VITEST_COVERAGE',
        public: true,
        description: 'Enable coverage reporting',
        description_ko: '커버리지 리포트 활성화',
      },
    ],
    domain: 'devtools',
    popularity_score: 68,
    difficulty_level: 'beginner',
    tags: ['testing', 'unit-test', 'vite', 'jest', 'coverage', 'open-source', '바이테스트', '테스트'],
    alternatives: ['jest', 'mocha', 'ava'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'svelte', 'astro'],
      language: ['typescript', 'javascript'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/vitest' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '$0' },
  },

  // 84. Storybook
  {
    id: SERVICE_IDS.storybook,
    name: 'Storybook',
    slug: 'storybook',
    category: 'testing',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'cicd',
    description:
      'UI component workshop for building, testing, and documenting components in isolation.',
    description_ko:
      'UI 컴포넌트를 독립된 환경에서 개발·문서화·테스트할 수 있는 프론트엔드 워크숍 도구로, React/Vue/Angular/Svelte 등 주요 프레임워크를 지원하는 오픈소스 프로젝트입니다.',
    icon_url: null,
    website_url: 'https://storybook.js.org',
    docs_url: 'https://storybook.js.org/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 무료(MIT 라이선스). 비주얼 테스트 SaaS인 Chromatic은 별도 유료 상품',
      plans: [
        { name: '오픈소스', price: '$0' },
      ],
    },
    required_env_vars: [
      {
        name: 'CHROMATIC_PROJECT_TOKEN',
        public: false,
        description: 'Chromatic project token for visual testing',
        description_ko: 'Chromatic 비주얼 테스팅 프로젝트 토큰',
      },
      {
        name: 'STORYBOOK_PORT',
        public: true,
        description: 'Storybook dev server port (default: 6006)',
        description_ko: 'Storybook 개발 서버 포트 (기본: 6006)',
      },
    ],
    domain: 'devtools',
    popularity_score: 84,
    difficulty_level: 'beginner',
    tags: ['testing', 'ui', 'components', 'documentation', 'visual-testing', 'open-source', '스토리북'],
    alternatives: ['ladle', 'histoire', 'playroom'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'svelte', 'web-components'],
      language: ['typescript', 'javascript'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/storybook' },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '$0' },
  },

  // 85. Docker
  {
    id: SERVICE_IDS.docker,
    name: 'Docker',
    slug: 'docker',
    category: 'deploy',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'cicd',
    description:
      'Container platform for building, shipping, and running applications in isolated environments.',
    description_ko:
      '애플리케이션을 컨테이너로 패키징·배포하는 표준 컨테이너 플랫폼으로, Docker Engine은 오픈소스이며 Docker Desktop·Hub·Build Cloud 등 부가 기능은 유료 구독 상품입니다.',
    icon_url: null,
    website_url: 'https://www.docker.com',
    docs_url: 'https://docs.docker.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Docker Personal 무료 — 개인/비영리/소규모기업(250인 미만, 매출 $1,000만 미만) 대상',
      plans: [
        { name: 'Personal', price: '$0' },
        { name: 'Pro', price: '$9/월(연간) · $11/월(월간)' },
        { name: 'Team', price: '$15/user/월(연간) · $16/user/월(월간)' },
        { name: 'Business', price: '$24/user/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'DOCKER_REGISTRY_URL',
        public: true,
        description: 'Docker registry URL',
        description_ko: 'Docker 레지스트리 URL',
      },
      {
        name: 'DOCKER_USERNAME',
        public: false,
        description: 'Docker Hub username',
        description_ko: 'Docker Hub 사용자명',
      },
      {
        name: 'DOCKER_PASSWORD',
        public: false,
        description: 'Docker Hub password or access token',
        description_ko: 'Docker Hub 비밀번호 또는 접근 토큰',
      },
    ],
    domain: 'devtools',
    popularity_score: 90,
    difficulty_level: 'intermediate',
    tags: ['container', 'devops', 'deploy', 'docker', 'cicd', 'infrastructure', '도커', '컨테이너'],
    alternatives: ['podman', 'containerd', 'lxc'],
    compatibility: {
      framework: ['nextjs', 'react', 'express', 'fastify', 'django', 'rails'],
      language: ['typescript', 'javascript', 'python', 'go', 'java', 'rust', 'c++'],
    },
    official_sdks: { npm: 'https://www.npmjs.com/package/dockerode' },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 20,
    monthly_cost_estimate: { starter: '$0', growth: '$9~$15/user', enterprise: '$24/user' },
  },

  // -----------------------------------------------------------------------
  // 86. 가비아 (Gabia)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.gabia,
    name: 'Gabia',
    slug: 'gabia',
    category: 'domain',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'hosting',
    description:
      'Gabia is South Korea\'s largest domain registrar and web hosting provider offering domain registration, DNS management, SSL certificates, and cloud hosting.',
    description_ko:
      '국내 점유율 1위 도메인/호스팅 등록대행업체. 도메인 검색, 신규등록, 연장, 관리 기능을 제공하며 이벤트성 할인가로 첫 해 등록비를 낮게 책정하는 방식을 사용.',
    icon_url: null,
    website_url: 'https://domain.gabia.com',
    docs_url: 'https://customer.gabia.com/?tab=manual',
    pricing_info: {
      free_tier: false,
      plans: [
        { name: '.com 신규등록 (이벤트가)', price: '19,800원/년' },
        { name: '.com 정상가', price: '26,400원/년' },
      ],
    },
    required_env_vars: [
      {
        name: 'GABIA_API_ID',
        public: false,
        description: 'Gabia API ID (가비아 API 아이디)',
        description_ko: '가비아 API 아이디',
      },
      {
        name: 'GABIA_API_KEY',
        public: false,
        description: 'Gabia HMAC API key for authentication',
        description_ko: '가비아 HMAC 인증용 API 키',
      },
    ],
    domain: 'infrastructure',
    subcategory: 'domain_hosting',
    popularity_score: 88,
    difficulty_level: 'beginner',
    tags: ['domain', 'dns', 'hosting', 'ssl', 'korea', 'registrar', '가비아', '도메인'],
    alternatives: ['whois', 'cafe24', 'inames', 'namecheap', 'cloudflare-registrar', 'godaddy', 'hosting-kr', 'dotname'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'wordpress'],
      language: ['php', 'javascript', 'python'],
    },
    official_sdks: { docs: 'https://api.gabia.com/docs' },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '₩2,200', growth: '₩10,000', enterprise: '문의' },
  },

  // -----------------------------------------------------------------------
  // 87. 후이즈 (Whois)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.whois,
    name: '후이즈',
    slug: 'whois',
    category: 'domain',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'hosting',
    description:
      'Whois is one of Korea\'s leading domain registrars specializing in domain registration, WHOIS lookup, DNS hosting, and domain transfer services.',
    description_ko:
      '국내 도메인·호스팅·비즈니스 솔루션 기업(후이즈). 도메인 신규등록, 연장, 기관이전 서비스를 제공하나, 실제 가격 조회/구매 페이지는 로그인 후 장바구니 방식으로만 노출됨.',
    icon_url: null,
    website_url: 'https://www.whois.co.kr',
    docs_url: 'https://www.whois.co.kr/api',
    pricing_info: {
      free_tier: false,
      plans: [
        { name: '.com 도메인', price: '연 14,300원~' },
        { name: '.co.kr 도메인', price: '연 22,000원~' },
        { name: 'DNS 호스팅', price: '무료 제공' },
        { name: 'SSL 인증서', price: '연 15,000원~' },
      ],
    },
    required_env_vars: [
      {
        name: 'WHOIS_API_KEY',
        public: false,
        description: 'Whois API key',
        description_ko: '후이즈 API 키',
      },
      {
        name: 'WHOIS_API_SECRET',
        public: false,
        description: 'Whois API secret key',
        description_ko: '후이즈 API 시크릿 키',
      },
    ],
    domain: 'infrastructure',
    subcategory: 'domain_registrar',
    popularity_score: 78,
    difficulty_level: 'beginner',
    tags: ['domain', 'dns', 'whois', 'ssl', 'korea', 'registrar', '후이즈', '도메인'],
    alternatives: ['gabia', 'cafe24', 'inames', 'hosting-kr', 'dotname', 'namecheap', 'godaddy', 'cloudflare-registrar'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'wordpress'],
      language: ['php', 'javascript', 'python'],
    },
    official_sdks: { docs: 'https://www.whois.co.kr/api' },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '₩1,200', growth: '₩8,000', enterprise: '문의' },
  },

  // -----------------------------------------------------------------------
  // 88. 카페24 (Cafe24)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.cafe24,
    name: '카페24',
    slug: 'cafe24',
    category: 'domain',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'hosting',
    description:
      'Cafe24 is a major Korean web hosting and domain service provider offering domain registration, web hosting, shopping mall solutions, and cloud services.',
    description_ko:
      '국내 이커머스 호스팅 점유율 1위 플랫폼. 웹호스팅·서버호스팅·코로케이션과 함께 최근 AI 코드 배포(ChatGPT/Claude/Cursor 생성 코드 10~30초 배포), 오픈소스 AI 에이전트 프레임워크 탑재 VPS 등 신규 서비스를 확장 중.',
    icon_url: null,
    website_url: 'https://www.cafe24.com',
    docs_url: 'https://developers.cafe24.com',
    pricing_info: {
      free_tier: false,
      plans: [
        { name: '.com 도메인', price: '연 14,300원~' },
        { name: '웹호스팅', price: '월 1,100원~' },
        { name: '쇼핑몰 Basic', price: '무료 (거래 수수료)' },
        { name: '클라우드', price: '월 11,000원~' },
      ],
    },
    required_env_vars: [
      {
        name: 'CAFE24_CLIENT_ID',
        public: false,
        description: 'Cafe24 OAuth client ID',
        description_ko: '카페24 OAuth 클라이언트 ID',
      },
      {
        name: 'CAFE24_CLIENT_SECRET',
        public: false,
        description: 'Cafe24 OAuth client secret',
        description_ko: '카페24 OAuth 클라이언트 시크릿',
      },
      {
        name: 'CAFE24_MALL_ID',
        public: false,
        description: 'Cafe24 mall ID',
        description_ko: '카페24 쇼핑몰 ID',
      },
    ],
    domain: 'infrastructure',
    subcategory: 'domain_hosting',
    popularity_score: 83,
    difficulty_level: 'beginner',
    tags: ['domain', 'hosting', 'ecommerce', 'korea', 'shopping-mall', 'cloud', '카페24', '도메인', '쇼핑몰'],
    alternatives: ['gabia', 'whois', 'inames', 'hosting-kr', 'dotname'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'wordpress', 'php'],
      language: ['php', 'javascript', 'python'],
    },
    official_sdks: { docs: 'https://developers.cafe24.com' },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 20,
    monthly_cost_estimate: { starter: '₩1,100', growth: '₩11,000', enterprise: '문의' },
  },

  // -----------------------------------------------------------------------
  // 89. 아이네임즈 (iNames)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.inames,
    name: '아이네임즈',
    slug: 'inames',
    category: 'domain',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'hosting',
    description:
      'iNames is a Korean domain registrar offering domain registration, DNS management, and domain transfer services at competitive pricing.',
    description_ko: '국내 도메인 등록대행업체. 도메인 신규등록/연장/이전 서비스를 제공하며, 실시간 가격은 장바구니 담기 시에만 노출되는 방식.',
    icon_url: null,
    website_url: 'https://www.inames.co.kr',
    docs_url: 'https://dom.inames.co.kr/regists',
    pricing_info: {
      free_tier: false,
      plans: [
        { name: '.com 도메인', price: '연 12,100원~' },
        { name: '.co.kr 도메인', price: '연 20,900원~' },
        { name: '.kr 도메인', price: '연 20,900원~' },
        { name: 'DNS 서비스', price: '무료 제공' },
      ],
    },
    required_env_vars: [
      {
        name: 'INAMES_API_KEY',
        public: false,
        description: 'iNames API key',
        description_ko: '아이네임즈 API 키',
      },
      {
        name: 'INAMES_API_PASSWORD',
        public: false,
        description: 'iNames API password',
        description_ko: '아이네임즈 API 패스워드',
      },
    ],
    domain: 'infrastructure',
    subcategory: 'domain_registrar',
    popularity_score: 68,
    difficulty_level: 'beginner',
    tags: ['domain', 'dns', 'korea', 'registrar', 'affordable', '아이네임즈', '도메인'],
    alternatives: ['gabia', 'whois', 'cafe24', 'hosting-kr', 'dotname'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'wordpress'],
      language: ['php', 'javascript', 'python'],
    },
    official_sdks: { docs: 'https://www.inames.co.kr/domain/api' },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '₩1,008', growth: '₩5,000', enterprise: '문의' },
  },

  // -----------------------------------------------------------------------
  // 90. Namecheap
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS.namecheap,
    name: 'Namecheap',
    slug: 'namecheap',
    category: 'domain',
    dashboard_layer: 'devtools',
    dashboard_subcategory: 'hosting',
    description:
      'Namecheap is a leading global domain registrar offering affordable domain registration, free WHOIS privacy, SSL certificates, shared hosting, and VPS.',
    description_ko:
      '미국 기반 도메인 등록대행업체. 도메인 등록/이전, EasyWP 호스팅, PremiumDNS, SSL 등을 제공하나, 자동화된 조회 도구에 대한 봇 차단이 강하게 적용되어 있어 가격 페이지를 직접 확인하지 못함.',
    icon_url: null,
    website_url: 'https://www.namecheap.com',
    docs_url: 'https://www.namecheap.com/support/knowledgebase',
    pricing_info: {
      free_tier: false,
      plans: [
        { name: '.com 도메인', price: '$6.99/년~' },
        { name: 'WHOIS 개인정보 보호', price: '무료 제공' },
        { name: '공유 호스팅', price: '$1.98/월~' },
        { name: 'VPS', price: '$4.99/월~' },
      ],
    },
    required_env_vars: [
      {
        name: 'NAMECHEAP_API_KEY',
        public: false,
        description: 'Namecheap API key (Profile > Tools > API Access)',
        description_ko: '네임칩 API 키 (Profile > Tools > API Access에서 발급)',
      },
      {
        name: 'NAMECHEAP_API_USER',
        public: false,
        description: 'Namecheap account username',
        description_ko: '네임칩 계정 사용자명',
      },
      {
        name: 'NAMECHEAP_CLIENT_IP',
        public: false,
        description: 'Whitelisted client IP address for Namecheap API',
        description_ko: 'Namecheap API 허용 목록에 등록된 클라이언트 IP',
      },
    ],
    domain: 'infrastructure',
    subcategory: 'domain_registrar',
    popularity_score: 82,
    difficulty_level: 'beginner',
    tags: ['domain', 'dns', 'ssl', 'hosting', 'whois-privacy', 'global', 'registrar', '네임칩', '도메인'],
    alternatives: ['godaddy', 'cloudflare-registrar', 'gabia'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'wordpress', 'php'],
      language: ['php', 'javascript', 'python', 'go'],
    },
    official_sdks: { docs: 'https://www.namecheap.com/support/api/intro/' },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0.58', growth: '$1.98', enterprise: '$24.99+' },
  },
];

// ---------------------------------------------------------------------------
// Checklist items – each service has 4-8 setup steps
// ---------------------------------------------------------------------------

let _checklistId = 0;
function cid(_serviceSlug: string): string {
  _checklistId += 1;
  const padded = String(_checklistId).padStart(4, '0');
  return `20000000-0000-4000-b000-00000000${padded}`;
}

export const checklistItems: ChecklistItemSeed[] = [
  // =======================================================================
  // 1. Supabase
  // =======================================================================
  {
    id: cid('supabase'),
    service_id: SERVICE_IDS.supabase,
    order_index: 0,
    title: 'Supabase 프로젝트 생성',
    title_ko: 'Supabase 프로젝트 생성',
    description: 'supabase.com에서 새 프로젝트를 생성하세요. 사용자에게 가장 가까운 리전을 선택하세요.',
    description_ko: 'supabase.com에서 새 프로젝트를 생성하세요. 사용자에게 가장 가까운 리전을 선택하세요.',
    guide_url: 'https://supabase.com/docs/guides/getting-started',
  },
  {
    id: cid('supabase'),
    service_id: SERVICE_IDS.supabase,
    order_index: 1,
    title: 'API 키를 환경 변수에 복사',
    title_ko: 'API 키를 환경 변수에 복사',
    description: '설정 > API에서 프로젝트 URL, anon 키, 서비스 역할 키를 .env.local 파일에 복사하세요.',
    description_ko: '설정 > API에서 프로젝트 URL, anon 키, 서비스 역할 키를 .env.local 파일에 복사하세요.',
    guide_url: 'https://supabase.com/docs/guides/getting-started/quickstarts/nextjs',
  },
  {
    id: cid('supabase'),
    service_id: SERVICE_IDS.supabase,
    order_index: 2,
    title: 'Supabase 클라이언트 라이브러리 설치',
    title_ko: 'Supabase 클라이언트 라이브러리 설치',
    description: 'npm install @supabase/supabase-js @supabase/ssr 명령으로 필요한 패키지를 설치하세요.',
    description_ko: 'npm install @supabase/supabase-js @supabase/ssr 명령으로 필요한 패키지를 설치하세요.',
    guide_url: 'https://supabase.com/docs/reference/javascript/installing',
  },
  {
    id: cid('supabase'),
    service_id: SERVICE_IDS.supabase,
    order_index: 3,
    title: '데이터베이스 테이블 및 RLS 정책 생성',
    title_ko: '데이터베이스 테이블 및 RLS 정책 생성',
    description: '스키마를 설계하고 각 테이블에 행 수준 보안(RLS)을 활성화하여 데이터를 보호하세요.',
    description_ko: '스키마를 설계하고 각 테이블에 행 수준 보안(RLS)을 활성화하여 데이터를 보호하세요.',
    guide_url: 'https://supabase.com/docs/guides/auth/row-level-security',
  },
  {
    id: cid('supabase'),
    service_id: SERVICE_IDS.supabase,
    order_index: 4,
    title: '인증 프로바이더 설정',
    title_ko: '인증 프로바이더 설정',
    description: 'Supabase 대시보드에서 이메일/비밀번호, OAuth 또는 매직 링크 인증을 설정하세요.',
    description_ko: 'Supabase 대시보드에서 이메일/비밀번호, OAuth 또는 매직 링크 인증을 설정하세요.',
    guide_url: 'https://supabase.com/docs/guides/auth',
  },
  {
    id: cid('supabase'),
    service_id: SERVICE_IDS.supabase,
    order_index: 5,
    title: '연결 테스트',
    title_ko: '연결 테스트',
    description: 'Supabase 클라이언트가 애플리케이션에서 연결 및 CRUD 작업을 수행할 수 있는지 확인하세요.',
    description_ko: 'Supabase 클라이언트가 애플리케이션에서 연결 및 CRUD 작업을 수행할 수 있는지 확인하세요.',
    guide_url: null,
  },

  // =======================================================================
  // 2. Firebase
  // =======================================================================
  {
    id: cid('firebase'),
    service_id: SERVICE_IDS.firebase,
    order_index: 0,
    title: 'Firebase 프로젝트 생성',
    title_ko: 'Firebase 프로젝트 생성',
    description: 'Firebase 콘솔에서 새 프로젝트를 생성하세요. 필요한 경우 Google Analytics를 활성화하세요.',
    description_ko: 'Firebase 콘솔에서 새 프로젝트를 생성하세요. 필요한 경우 Google Analytics를 활성화하세요.',
    guide_url: 'https://firebase.google.com/docs/web/setup',
  },
  {
    id: cid('firebase'),
    service_id: SERVICE_IDS.firebase,
    order_index: 1,
    title: '웹 앱을 등록하고 설정 정보 가져오기',
    title_ko: '웹 앱을 등록하고 설정 정보 가져오기',
    description: '콘솔에서 웹 앱을 추가하여 API 키가 포함된 Firebase 설정 객체를 가져오세요.',
    description_ko: '콘솔에서 웹 앱을 추가하여 API 키가 포함된 Firebase 설정 객체를 가져오세요.',
    guide_url: 'https://firebase.google.com/docs/web/setup#register-app',
  },
  {
    id: cid('firebase'),
    service_id: SERVICE_IDS.firebase,
    order_index: 2,
    title: 'Firebase SDK 설치',
    title_ko: 'Firebase SDK 설치',
    description: 'npm install firebase 명령으로 Firebase JavaScript SDK를 프로젝트에 추가하세요.',
    description_ko: 'npm install firebase 명령으로 Firebase JavaScript SDK를 프로젝트에 추가하세요.',
    guide_url: 'https://firebase.google.com/docs/web/setup#add-sdks-initialize',
  },
  {
    id: cid('firebase'),
    service_id: SERVICE_IDS.firebase,
    order_index: 3,
    title: 'Firestore 데이터베이스 설정',
    title_ko: 'Firestore 데이터베이스 설정',
    description: 'Firestore 데이터베이스를 생성하고 데이터 모델에 맞는 보안 규칙을 설정하세요.',
    description_ko: 'Firestore 데이터베이스를 생성하고 데이터 모델에 맞는 보안 규칙을 설정하세요.',
    guide_url: 'https://firebase.google.com/docs/firestore/quickstart',
  },
  {
    id: cid('firebase'),
    service_id: SERVICE_IDS.firebase,
    order_index: 4,
    title: 'Firebase 인증 설정',
    title_ko: 'Firebase 인증 설정',
    description: '인증 섹션에서 원하는 로그인 프로바이더(Google, 이메일 등)를 활성화하세요.',
    description_ko: '인증 섹션에서 원하는 로그인 프로바이더(Google, 이메일 등)를 활성화하세요.',
    guide_url: 'https://firebase.google.com/docs/auth/web/start',
  },
  {
    id: cid('firebase'),
    service_id: SERVICE_IDS.firebase,
    order_index: 5,
    title: 'Firebase Admin SDK 설정 (서버 측)',
    title_ko: 'Firebase Admin SDK 설정 (서버 측)',
    description: '서비스 계정 키를 생성하고 서버 측 작업을 위해 Admin SDK를 설정하세요.',
    description_ko: '서비스 계정 키를 생성하고 서버 측 작업을 위해 Admin SDK를 설정하세요.',
    guide_url: 'https://firebase.google.com/docs/admin/setup',
  },

  // =======================================================================
  // 3. Vercel
  // =======================================================================
  {
    id: cid('vercel'),
    service_id: SERVICE_IDS.vercel,
    order_index: 0,
    title: 'Vercel 계정 생성',
    title_ko: 'Vercel 계정 생성',
    description: 'GitHub, GitLab 또는 Bitbucket 계정을 사용하여 vercel.com에서 가입하세요.',
    description_ko: 'GitHub, GitLab 또는 Bitbucket 계정을 사용하여 vercel.com에서 가입하세요.',
    guide_url: 'https://vercel.com/docs/getting-started-with-vercel',
  },
  {
    id: cid('vercel'),
    service_id: SERVICE_IDS.vercel,
    order_index: 1,
    title: 'Git 리포지토리 가져오기 및 연결',
    title_ko: 'Git 리포지토리 가져오기 및 연결',
    description: 'GitHub에서 프로젝트 리포지토리를 가져와 자동 배포를 활성화하세요.',
    description_ko: 'GitHub에서 프로젝트 리포지토리를 가져와 자동 배포를 활성화하세요.',
    guide_url: 'https://vercel.com/docs/deployments/git',
  },
  {
    id: cid('vercel'),
    service_id: SERVICE_IDS.vercel,
    order_index: 2,
    title: '환경 변수 설정',
    title_ko: '환경 변수 설정',
    description: '프로젝트 설정 > 환경 변수에서 필요한 모든 환경 변수를 추가하세요.',
    description_ko: '프로젝트 설정 > 환경 변수에서 필요한 모든 환경 변수를 추가하세요.',
    guide_url: 'https://vercel.com/docs/environment-variables',
  },
  {
    id: cid('vercel'),
    service_id: SERVICE_IDS.vercel,
    order_index: 3,
    title: '커스텀 도메인 설정',
    title_ko: '커스텀 도메인 설정',
    description: '커스텀 도메인을 추가하고 프로덕션 배포를 위한 DNS 설정을 구성하세요.',
    description_ko: '커스텀 도메인을 추가하고 프로덕션 배포를 위한 DNS 설정을 구성하세요.',
    guide_url: 'https://vercel.com/docs/custom-domains',
  },
  {
    id: cid('vercel'),
    service_id: SERVICE_IDS.vercel,
    order_index: 4,
    title: '배포 및 프리뷰 URL 확인',
    title_ko: '배포 및 프리뷰 URL 확인',
    description: '배포가 올바르게 작동하고 PR에 대한 프리뷰 URL이 생성되는지 확인하세요.',
    description_ko: '배포가 올바르게 작동하고 PR에 대한 프리뷰 URL이 생성되는지 확인하세요.',
    guide_url: 'https://vercel.com/docs/deployments/preview-deployments',
  },

  // =======================================================================
  // 4. Netlify
  // =======================================================================
  {
    id: cid('netlify'),
    service_id: SERVICE_IDS.netlify,
    order_index: 0,
    title: 'Netlify 계정 및 팀 생성',
    title_ko: 'Netlify 계정 및 팀 생성',
    description: 'netlify.com에서 가입하고 프로젝트를 위한 팀을 생성하세요.',
    description_ko: 'netlify.com에서 가입하고 프로젝트를 위한 팀을 생성하세요.',
    guide_url: 'https://docs.netlify.com/get-started',
  },
  {
    id: cid('netlify'),
    service_id: SERVICE_IDS.netlify,
    order_index: 1,
    title: 'Git 리포지토리 연결',
    title_ko: 'Git 리포지토리 연결',
    description: '지속적 배포를 위해 GitHub/GitLab/Bitbucket 리포지토리를 연결하세요.',
    description_ko: '지속적 배포를 위해 GitHub/GitLab/Bitbucket 리포지토리를 연결하세요.',
    guide_url: 'https://docs.netlify.com/git/overview',
  },
  {
    id: cid('netlify'),
    service_id: SERVICE_IDS.netlify,
    order_index: 2,
    title: '빌드 설정 구성',
    title_ko: '빌드 설정 구성',
    description: '빌드 명령어, 퍼블리시 디렉토리 및 필요한 빌드 플러그인을 설정하세요.',
    description_ko: '빌드 명령어, 퍼블리시 디렉토리 및 필요한 빌드 플러그인을 설정하세요.',
    guide_url: 'https://docs.netlify.com/configure-builds/overview',
  },
  {
    id: cid('netlify'),
    service_id: SERVICE_IDS.netlify,
    order_index: 3,
    title: '환경 변수 설정',
    title_ko: '환경 변수 설정',
    description: '사이트 설정 > 빌드 및 배포 > 환경에서 환경 변수를 추가하세요.',
    description_ko: '사이트 설정 > 빌드 및 배포 > 환경에서 환경 변수를 추가하세요.',
    guide_url: 'https://docs.netlify.com/environment-variables/overview',
  },
  {
    id: cid('netlify'),
    service_id: SERVICE_IDS.netlify,
    order_index: 4,
    title: '커스텀 도메인 및 HTTPS 설정',
    title_ko: '커스텀 도메인 및 HTTPS 설정',
    description: '커스텀 도메인을 추가하면 Netlify가 자동으로 SSL 인증서를 프로비저닝합니다.',
    description_ko: '커스텀 도메인을 추가하면 Netlify가 자동으로 SSL 인증서를 프로비저닝합니다.',
    guide_url: 'https://docs.netlify.com/domains-https/custom-domains',
  },
  {
    id: cid('netlify'),
    service_id: SERVICE_IDS.netlify,
    order_index: 5,
    title: '배포 프리뷰 테스트',
    title_ko: '배포 프리뷰 테스트',
    description: 'Pull Request에 대한 배포 프리뷰가 생성되고 올바르게 작동하는지 확인하세요.',
    description_ko: 'Pull Request에 대한 배포 프리뷰가 생성되고 올바르게 작동하는지 확인하세요.',
    guide_url: null,
  },

  // =======================================================================
  // 5. Stripe
  // =======================================================================
  {
    id: cid('stripe'),
    service_id: SERVICE_IDS.stripe,
    order_index: 0,
    title: 'Stripe 계정 생성',
    title_ko: 'Stripe 계정 생성',
    description: 'stripe.com에서 가입하고 실제 결제를 위해 사업자 인증을 완료하세요.',
    description_ko: 'stripe.com에서 가입하고 실제 결제를 위해 사업자 인증을 완료하세요.',
    guide_url: 'https://stripe.com/docs/development/quickstart',
  },
  {
    id: cid('stripe'),
    service_id: SERVICE_IDS.stripe,
    order_index: 1,
    title: 'API 키 복사 (먼저 테스트 모드)',
    title_ko: 'API 키 복사 (먼저 테스트 모드)',
    description: '개발자 > API 키에서 공개 키와 비밀 키를 가져오세요. 테스트 모드 키부터 시작하세요.',
    description_ko: '개발자 > API 키에서 공개 키와 비밀 키를 가져오세요. 테스트 모드 키부터 시작하세요.',
    guide_url: 'https://stripe.com/docs/keys',
  },
  {
    id: cid('stripe'),
    service_id: SERVICE_IDS.stripe,
    order_index: 2,
    title: 'Stripe SDK 설치',
    title_ko: 'Stripe SDK 설치',
    description: 'npm install stripe @stripe/stripe-js 명령으로 서버 및 클라이언트 라이브러리를 추가하세요.',
    description_ko: 'npm install stripe @stripe/stripe-js 명령으로 서버 및 클라이언트 라이브러리를 추가하세요.',
    guide_url: 'https://stripe.com/docs/payments/quickstart',
  },
  {
    id: cid('stripe'),
    service_id: SERVICE_IDS.stripe,
    order_index: 3,
    title: '상품 및 가격 생성',
    title_ko: '상품 및 가격 생성',
    description: 'Stripe 대시보드 또는 API를 통해 상품 및 가격 플랜을 설정하세요.',
    description_ko: 'Stripe 대시보드 또는 API를 통해 상품 및 가격 플랜을 설정하세요.',
    guide_url: 'https://stripe.com/docs/products-prices/overview',
  },
  {
    id: cid('stripe'),
    service_id: SERVICE_IDS.stripe,
    order_index: 4,
    title: '웹훅 엔드포인트 설정',
    title_ko: '웹훅 엔드포인트 설정',
    description: '결제 이벤트(checkout.session.completed 등)를 처리할 웹훅 엔드포인트를 생성하세요.',
    description_ko: '결제 이벤트(checkout.session.completed 등)를 처리할 웹훅 엔드포인트를 생성하세요.',
    guide_url: 'https://stripe.com/docs/webhooks',
  },
  {
    id: cid('stripe'),
    service_id: SERVICE_IDS.stripe,
    order_index: 5,
    title: 'Stripe CLI로 테스트',
    title_ko: 'Stripe CLI로 테스트',
    description: 'Stripe CLI를 사용하여 웹훅을 로컬로 전달하고 결제 흐름을 엔드투엔드로 테스트하세요.',
    description_ko: 'Stripe CLI를 사용하여 웹훅을 로컬로 전달하고 결제 흐름을 엔드투엔드로 테스트하세요.',
    guide_url: 'https://stripe.com/docs/stripe-cli',
  },
  {
    id: cid('stripe'),
    service_id: SERVICE_IDS.stripe,
    order_index: 6,
    title: 'Checkout 또는 Payment Elements 구현',
    title_ko: 'Checkout 또는 Payment Elements 구현',
    description: '결제 수집을 위해 Stripe Checkout(호스팅) 또는 Payment Elements(임베디드)를 통합하세요.',
    description_ko: '결제 수집을 위해 Stripe Checkout(호스팅) 또는 Payment Elements(임베디드)를 통합하세요.',
    guide_url: 'https://stripe.com/docs/payments/checkout',
  },

  // =======================================================================
  // 6. Clerk
  // =======================================================================
  {
    id: cid('clerk'),
    service_id: SERVICE_IDS.clerk,
    order_index: 0,
    title: 'Clerk 애플리케이션 생성',
    title_ko: 'Clerk 애플리케이션 생성',
    description: 'clerk.com에서 가입하고 원하는 인증 방식으로 새 애플리케이션을 생성하세요.',
    description_ko: 'clerk.com에서 가입하고 원하는 인증 방식으로 새 애플리케이션을 생성하세요.',
    guide_url: 'https://clerk.com/docs/quickstarts/nextjs',
  },
  {
    id: cid('clerk'),
    service_id: SERVICE_IDS.clerk,
    order_index: 1,
    title: 'Clerk SDK 설치',
    title_ko: 'Clerk SDK 설치',
    description: 'npm install @clerk/nextjs 명령으로 Clerk Next.js 통합을 추가하세요.',
    description_ko: 'npm install @clerk/nextjs 명령으로 Clerk Next.js 통합을 추가하세요.',
    guide_url: 'https://clerk.com/docs/references/nextjs/overview',
  },
  {
    id: cid('clerk'),
    service_id: SERVICE_IDS.clerk,
    order_index: 2,
    title: '환경 변수 추가',
    title_ko: '환경 변수 추가',
    description: 'Clerk 대시보드에서 공개 키와 비밀 키를 .env.local에 복사하세요.',
    description_ko: 'Clerk 대시보드에서 공개 키와 비밀 키를 .env.local에 복사하세요.',
    guide_url: 'https://clerk.com/docs/quickstarts/nextjs#set-environment-keys',
  },
  {
    id: cid('clerk'),
    service_id: SERVICE_IDS.clerk,
    order_index: 3,
    title: 'ClerkProvider로 앱 감싸기',
    title_ko: 'ClerkProvider로 앱 감싸기',
    description: '루트 레이아웃에 ClerkProvider를 추가하여 앱 전체에서 인증을 활성화하세요.',
    description_ko: '루트 레이아웃에 ClerkProvider를 추가하여 앱 전체에서 인증을 활성화하세요.',
    guide_url: 'https://clerk.com/docs/components/clerk-provider',
  },
  {
    id: cid('clerk'),
    service_id: SERVICE_IDS.clerk,
    order_index: 4,
    title: '라우트 보호를 위한 미들웨어 설정',
    title_ko: '라우트 보호를 위한 미들웨어 설정',
    description: 'middleware.ts를 생성하여 라우트를 보호하고 공개/비공개 페이지를 정의하세요.',
    description_ko: 'middleware.ts를 생성하여 라우트를 보호하고 공개/비공개 페이지를 정의하세요.',
    guide_url: 'https://clerk.com/docs/references/nextjs/clerk-middleware',
  },
  {
    id: cid('clerk'),
    service_id: SERVICE_IDS.clerk,
    order_index: 5,
    title: '로그인 및 회원가입 페이지 추가',
    title_ko: '로그인 및 회원가입 페이지 추가',
    description: 'Clerk 사전 구축 컴포넌트를 사용하여 로그인 및 회원가입 페이지를 생성하세요.',
    description_ko: 'Clerk 사전 구축 컴포넌트를 사용하여 로그인 및 회원가입 페이지를 생성하세요.',
    guide_url: 'https://clerk.com/docs/components/authentication/sign-in',
  },

  // =======================================================================
  // 7. NextAuth / Auth.js
  // =======================================================================
  {
    id: cid('nextauth'),
    service_id: SERVICE_IDS.nextauth,
    order_index: 0,
    title: 'NextAuth.js 설치',
    title_ko: 'NextAuth.js 설치',
    description: 'npm install next-auth 명령으로 인증 라이브러리를 추가하세요.',
    description_ko: 'npm install next-auth 명령으로 인증 라이브러리를 추가하세요.',
    guide_url: 'https://authjs.dev/getting-started/installation',
  },
  {
    id: cid('nextauth'),
    service_id: SERVICE_IDS.nextauth,
    order_index: 1,
    title: 'NEXTAUTH_SECRET 생성',
    title_ko: 'NEXTAUTH_SECRET 생성',
    description: 'openssl rand -base64 32 명령으로 토큰 암호화를 위한 랜덤 시크릿을 생성하세요.',
    description_ko: 'openssl rand -base64 32 명령으로 토큰 암호화를 위한 랜덤 시크릿을 생성하세요.',
    guide_url: 'https://authjs.dev/getting-started/deployment',
  },
  {
    id: cid('nextauth'),
    service_id: SERVICE_IDS.nextauth,
    order_index: 2,
    title: 'OAuth 프로바이더 설정',
    title_ko: 'OAuth 프로바이더 설정',
    description: '인증 설정 파일에서 GitHub, Google 또는 Discord 등의 프로바이더를 설정하세요.',
    description_ko: '인증 설정 파일에서 GitHub, Google 또는 Discord 등의 프로바이더를 설정하세요.',
    guide_url: 'https://authjs.dev/getting-started/providers',
  },
  {
    id: cid('nextauth'),
    service_id: SERVICE_IDS.nextauth,
    order_index: 3,
    title: '프로바이더 플랫폼에서 OAuth 앱 생성',
    title_ko: '프로바이더 플랫폼에서 OAuth 앱 생성',
    description: 'GitHub/Google 등에서 OAuth 애플리케이션을 등록하고 클라이언트 ID와 시크릿을 받으세요.',
    description_ko: 'GitHub/Google 등에서 OAuth 애플리케이션을 등록하고 클라이언트 ID와 시크릿을 받으세요.',
    guide_url: 'https://authjs.dev/getting-started/providers/github',
  },
  {
    id: cid('nextauth'),
    service_id: SERVICE_IDS.nextauth,
    order_index: 4,
    title: 'API 라우트 및 세션 프로바이더 설정',
    title_ko: 'API 라우트 및 세션 프로바이더 설정',
    description: '인증 API 라우트 핸들러를 생성하고 앱을 SessionProvider로 감싸세요.',
    description_ko: '인증 API 라우트 핸들러를 생성하고 앱을 SessionProvider로 감싸세요.',
    guide_url: 'https://authjs.dev/getting-started/session-management',
  },
  {
    id: cid('nextauth'),
    service_id: SERVICE_IDS.nextauth,
    order_index: 5,
    title: '데이터베이스 어댑터 연결 (선택사항)',
    title_ko: '데이터베이스 어댑터 연결 (선택사항)',
    description: '지속적인 세션 저장을 위해 데이터베이스 어댑터(Prisma, Drizzle 등)를 설치하세요.',
    description_ko: '지속적인 세션 저장을 위해 데이터베이스 어댑터(Prisma, Drizzle 등)를 설치하세요.',
    guide_url: 'https://authjs.dev/getting-started/adapters',
  },

  // =======================================================================
  // 8. Resend
  // =======================================================================
  {
    id: cid('resend'),
    service_id: SERVICE_IDS.resend,
    order_index: 0,
    title: 'Resend 계정 생성',
    title_ko: 'Resend 계정 생성',
    description: 'resend.com에서 가입하고 이메일 주소를 인증하세요.',
    description_ko: 'resend.com에서 가입하고 이메일 주소를 인증하세요.',
    guide_url: 'https://resend.com/docs/introduction',
  },
  {
    id: cid('resend'),
    service_id: SERVICE_IDS.resend,
    order_index: 1,
    title: 'API 키 생성',
    title_ko: 'API 키 생성',
    description: 'Resend 대시보드에서 API 키를 생성하고 환경 변수에 추가하세요.',
    description_ko: 'Resend 대시보드에서 API 키를 생성하고 환경 변수에 추가하세요.',
    guide_url: 'https://resend.com/docs/api-reference/api-keys/create-api-key',
  },
  {
    id: cid('resend'),
    service_id: SERVICE_IDS.resend,
    order_index: 2,
    title: '발신 도메인 인증',
    title_ko: '발신 도메인 인증',
    description: '이메일 발송을 위해 DNS 레코드를 추가하여 커스텀 도메인을 인증하세요.',
    description_ko: '이메일 발송을 위해 DNS 레코드를 추가하여 커스텀 도메인을 인증하세요.',
    guide_url: 'https://resend.com/docs/dashboard/domains/introduction',
  },
  {
    id: cid('resend'),
    service_id: SERVICE_IDS.resend,
    order_index: 3,
    title: 'Resend SDK 설치',
    title_ko: 'Resend SDK 설치',
    description: 'npm install resend 명령으로 Resend Node.js SDK를 추가하세요.',
    description_ko: 'npm install resend 명령으로 Resend Node.js SDK를 추가하세요.',
    guide_url: 'https://resend.com/docs/sdks/typescript',
  },
  {
    id: cid('resend'),
    service_id: SERVICE_IDS.resend,
    order_index: 4,
    title: '테스트 이메일 전송',
    title_ko: '테스트 이메일 전송',
    description: 'Resend API를 사용하여 테스트 이메일을 전송하고 설정이 올바르게 작동하는지 확인하세요.',
    description_ko: 'Resend API를 사용하여 테스트 이메일을 전송하고 설정이 올바르게 작동하는지 확인하세요.',
    guide_url: 'https://resend.com/docs/send-with-nextjs',
  },

  // =======================================================================
  // 9. SendGrid
  // =======================================================================
  {
    id: cid('sendgrid'),
    service_id: SERVICE_IDS.sendgrid,
    order_index: 0,
    title: 'SendGrid 계정 생성',
    title_ko: 'SendGrid 계정 생성',
    description: 'sendgrid.com에서 가입하고 발신자 ID 인증을 완료하세요.',
    description_ko: 'sendgrid.com에서 가입하고 발신자 ID 인증을 완료하세요.',
    guide_url: 'https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs',
  },
  {
    id: cid('sendgrid'),
    service_id: SERVICE_IDS.sendgrid,
    order_index: 1,
    title: 'API 키 생성',
    title_ko: 'API 키 생성',
    description: '설정 > API 키에서 Mail Send 권한이 있는 API 키를 생성하세요.',
    description_ko: '설정 > API 키에서 Mail Send 권한이 있는 API 키를 생성하세요.',
    guide_url: 'https://docs.sendgrid.com/ui/account-and-settings/api-keys',
  },
  {
    id: cid('sendgrid'),
    service_id: SERVICE_IDS.sendgrid,
    order_index: 2,
    title: '발신자 ID 인증',
    title_ko: '발신자 ID 인증',
    description: '단일 발신자를 인증하거나 이메일 발송을 위해 도메인을 인증하세요.',
    description_ko: '단일 발신자를 인증하거나 이메일 발송을 위해 도메인을 인증하세요.',
    guide_url: 'https://docs.sendgrid.com/ui/sending-email/sender-verification',
  },
  {
    id: cid('sendgrid'),
    service_id: SERVICE_IDS.sendgrid,
    order_index: 3,
    title: 'SendGrid SDK 설치',
    title_ko: 'SendGrid SDK 설치',
    description: 'npm install @sendgrid/mail 명령으로 SendGrid 이메일 클라이언트를 추가하세요.',
    description_ko: 'npm install @sendgrid/mail 명령으로 SendGrid 이메일 클라이언트를 추가하세요.',
    guide_url: 'https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs',
  },
  {
    id: cid('sendgrid'),
    service_id: SERVICE_IDS.sendgrid,
    order_index: 4,
    title: '테스트 이메일 전송',
    title_ko: '테스트 이메일 전송',
    description: 'SDK를 사용하여 테스트 이메일을 전송하고 SendGrid 활동 피드에서 전송을 확인하세요.',
    description_ko: 'SDK를 사용하여 테스트 이메일을 전송하고 SendGrid 활동 피드에서 전송을 확인하세요.',
    guide_url: null,
  },

  // =======================================================================
  // 10. OpenAI
  // =======================================================================
  {
    id: cid('openai'),
    service_id: SERVICE_IDS.openai,
    order_index: 0,
    title: 'OpenAI 계정 생성 및 API 키 받기',
    title_ko: 'OpenAI 계정 생성 및 API 키 받기',
    description: 'platform.openai.com에서 가입하고 설정에서 API 키를 생성하세요.',
    description_ko: 'platform.openai.com에서 가입하고 설정에서 API 키를 생성하세요.',
    guide_url: 'https://platform.openai.com/docs/quickstart',
  },
  {
    id: cid('openai'),
    service_id: SERVICE_IDS.openai,
    order_index: 1,
    title: '결제 및 사용량 제한 설정',
    title_ko: '결제 및 사용량 제한 설정',
    description: '결제 수단을 추가하고 예상치 못한 요금을 방지하기 위해 월간 지출 한도를 설정하세요.',
    description_ko: '결제 수단을 추가하고 예상치 못한 요금을 방지하기 위해 월간 지출 한도를 설정하세요.',
    guide_url: 'https://platform.openai.com/docs/guides/production-best-practices',
  },
  {
    id: cid('openai'),
    service_id: SERVICE_IDS.openai,
    order_index: 2,
    title: 'OpenAI SDK 설치',
    title_ko: 'OpenAI SDK 설치',
    description: 'npm install openai 명령으로 공식 OpenAI Node.js 라이브러리를 추가하세요.',
    description_ko: 'npm install openai 명령으로 공식 OpenAI Node.js 라이브러리를 추가하세요.',
    guide_url: 'https://platform.openai.com/docs/libraries/node-js-library',
  },
  {
    id: cid('openai'),
    service_id: SERVICE_IDS.openai,
    order_index: 3,
    title: '테스트 API 호출 수행',
    title_ko: '테스트 API 호출 수행',
    description: '테스트 채팅 완성 요청을 전송하여 API 키 및 SDK 설정을 확인하세요.',
    description_ko: '테스트 채팅 완성 요청을 전송하여 API 키 및 SDK 설정을 확인하세요.',
    guide_url: 'https://platform.openai.com/docs/api-reference/chat/create',
  },
  {
    id: cid('openai'),
    service_id: SERVICE_IDS.openai,
    order_index: 4,
    title: '에러 처리 및 속도 제한 구현',
    title_ko: '에러 처리 및 속도 제한 구현',
    description: 'API 호출에 적절한 에러 처리, 재시도 및 속도 제한 관리를 추가하세요.',
    description_ko: 'API 호출에 적절한 에러 처리, 재시도 및 속도 제한 관리를 추가하세요.',
    guide_url: 'https://platform.openai.com/docs/guides/rate-limits',
  },
  {
    id: cid('openai'),
    service_id: SERVICE_IDS.openai,
    order_index: 5,
    title: '스트리밍 응답 설정 (선택사항)',
    title_ko: '스트리밍 응답 설정 (선택사항)',
    description: 'Vercel AI SDK 또는 SSE를 사용하여 실시간 토큰 전달을 위한 스트리밍을 구현하세요.',
    description_ko: 'Vercel AI SDK 또는 SSE를 사용하여 실시간 토큰 전달을 위한 스트리밍을 구현하세요.',
    guide_url: 'https://platform.openai.com/docs/api-reference/streaming',
  },

  // =======================================================================
  // 11. Anthropic
  // =======================================================================
  {
    id: cid('anthropic'),
    service_id: SERVICE_IDS.anthropic,
    order_index: 0,
    title: 'Anthropic 계정 생성 및 API 키 받기',
    title_ko: 'Anthropic 계정 생성 및 API 키 받기',
    description: 'console.anthropic.com에서 가입하고 API 키를 생성하세요.',
    description_ko: 'console.anthropic.com에서 가입하고 API 키를 생성하세요.',
    guide_url: 'https://docs.anthropic.com/en/docs/initial-setup',
  },
  {
    id: cid('anthropic'),
    service_id: SERVICE_IDS.anthropic,
    order_index: 1,
    title: '결제 설정',
    title_ko: '결제 설정',
    description: '콘솔에서 결제 수단을 추가하고 지출 한도를 설정하세요.',
    description_ko: '콘솔에서 결제 수단을 추가하고 지출 한도를 설정하세요.',
    guide_url: 'https://docs.anthropic.com/en/docs/initial-setup#prerequisites',
  },
  {
    id: cid('anthropic'),
    service_id: SERVICE_IDS.anthropic,
    order_index: 2,
    title: 'Anthropic SDK 설치',
    title_ko: 'Anthropic SDK 설치',
    description: 'npm install @anthropic-ai/sdk 명령으로 공식 SDK를 추가하세요.',
    description_ko: 'npm install @anthropic-ai/sdk 명령으로 공식 SDK를 추가하세요.',
    guide_url: 'https://docs.anthropic.com/en/docs/quickstart',
  },
  {
    id: cid('anthropic'),
    service_id: SERVICE_IDS.anthropic,
    order_index: 3,
    title: '테스트 API 호출 수행',
    title_ko: '테스트 API 호출 수행',
    description: '테스트 메시지를 전송하여 API 키 및 SDK 통합을 확인하세요.',
    description_ko: '테스트 메시지를 전송하여 API 키 및 SDK 통합을 확인하세요.',
    guide_url: 'https://docs.anthropic.com/en/api/messages',
  },
  {
    id: cid('anthropic'),
    service_id: SERVICE_IDS.anthropic,
    order_index: 4,
    title: '스트리밍 구현 (선택사항)',
    title_ko: '스트리밍 구현 (선택사항)',
    description: 'SSE 또는 Vercel AI SDK를 사용하여 실시간 출력을 위한 스트리밍 응답을 설정하세요.',
    description_ko: 'SSE 또는 Vercel AI SDK를 사용하여 실시간 출력을 위한 스트리밍 응답을 설정하세요.',
    guide_url: 'https://docs.anthropic.com/en/api/messages-streaming',
  },

  // =======================================================================
  // 12. Cloudinary
  // =======================================================================
  {
    id: cid('cloudinary'),
    service_id: SERVICE_IDS.cloudinary,
    order_index: 0,
    title: 'Cloudinary 계정 생성',
    title_ko: 'Cloudinary 계정 생성',
    description: 'cloudinary.com에서 가입하고 클라우드 이름, API 키, API 시크릿을 받으세요.',
    description_ko: 'cloudinary.com에서 가입하고 클라우드 이름, API 키, API 시크릿을 받으세요.',
    guide_url: 'https://cloudinary.com/documentation/how_to_integrate_cloudinary',
  },
  {
    id: cid('cloudinary'),
    service_id: SERVICE_IDS.cloudinary,
    order_index: 1,
    title: 'Cloudinary SDK 설치',
    title_ko: 'Cloudinary SDK 설치',
    description: 'npm install cloudinary next-cloudinary 명령으로 서버 및 React 통합을 설치하세요.',
    description_ko: 'npm install cloudinary next-cloudinary 명령으로 서버 및 React 통합을 설치하세요.',
    guide_url: 'https://next.cloudinary.dev/installation',
  },
  {
    id: cid('cloudinary'),
    service_id: SERVICE_IDS.cloudinary,
    order_index: 2,
    title: '환경 변수 설정',
    title_ko: '환경 변수 설정',
    description: '.env.local 파일에 CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET을 추가하세요.',
    description_ko: '.env.local 파일에 CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET을 추가하세요.',
    guide_url: 'https://cloudinary.com/documentation/node_integration#setting_configuration_parameters',
  },
  {
    id: cid('cloudinary'),
    service_id: SERVICE_IDS.cloudinary,
    order_index: 3,
    title: '업로드 프리셋 설정',
    title_ko: '업로드 프리셋 설정',
    description: '다양한 사용 사례(프로필 이미지, 콘텐츠 미디어 등)에 맞는 업로드 프리셋을 생성하세요.',
    description_ko: '다양한 사용 사례(프로필 이미지, 콘텐츠 미디어 등)에 맞는 업로드 프리셋을 생성하세요.',
    guide_url: 'https://cloudinary.com/documentation/upload_presets',
  },
  {
    id: cid('cloudinary'),
    service_id: SERVICE_IDS.cloudinary,
    order_index: 4,
    title: '이미지 업로드 및 변환 테스트',
    title_ko: '이미지 업로드 및 변환 테스트',
    description: '테스트 이미지를 업로드하고 변환(크기 조정, 자르기, 형식)이 올바르게 작동하는지 확인하세요.',
    description_ko: '테스트 이미지를 업로드하고 변환(크기 조정, 자르기, 형식)이 올바르게 작동하는지 확인하세요.',
    guide_url: 'https://cloudinary.com/documentation/image_transformations',
  },

  // =======================================================================
  // 13. Sentry
  // =======================================================================
  {
    id: cid('sentry'),
    service_id: SERVICE_IDS.sentry,
    order_index: 0,
    title: 'Sentry 프로젝트 생성',
    title_ko: 'Sentry 프로젝트 생성',
    description: 'sentry.io에서 가입하고 Next.js 애플리케이션용 새 프로젝트를 생성하세요.',
    description_ko: 'sentry.io에서 가입하고 Next.js 애플리케이션용 새 프로젝트를 생성하세요.',
    guide_url: 'https://docs.sentry.io/platforms/javascript/guides/nextjs/',
  },
  {
    id: cid('sentry'),
    service_id: SERVICE_IDS.sentry,
    order_index: 1,
    title: '위저드로 Sentry SDK 설치',
    title_ko: '위저드로 Sentry SDK 설치',
    description: 'npx @sentry/wizard@latest -i nextjs 명령으로 Sentry를 자동 설정하세요.',
    description_ko: 'npx @sentry/wizard@latest -i nextjs 명령으로 Sentry를 자동 설정하세요.',
    guide_url: 'https://docs.sentry.io/platforms/javascript/guides/nextjs/#install',
  },
  {
    id: cid('sentry'),
    service_id: SERVICE_IDS.sentry,
    order_index: 2,
    title: 'DSN 및 인증 토큰 설정',
    title_ko: 'DSN 및 인증 토큰 설정',
    description: '환경 변수에 SENTRY_DSN, SENTRY_AUTH_TOKEN, 조직, 프로젝트를 추가하세요.',
    description_ko: '환경 변수에 SENTRY_DSN, SENTRY_AUTH_TOKEN, 조직, 프로젝트를 추가하세요.',
    guide_url: 'https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/',
  },
  {
    id: cid('sentry'),
    service_id: SERVICE_IDS.sentry,
    order_index: 3,
    title: '소스맵 업로드 설정',
    title_ko: '소스맵 업로드 설정',
    description: '빌드 프로세스 중 소스맵을 업로드하도록 Sentry 웹팩 플러그인을 설정하세요.',
    description_ko: '빌드 프로세스 중 소스맵을 업로드하도록 Sentry 웹팩 플러그인을 설정하세요.',
    guide_url: 'https://docs.sentry.io/platforms/javascript/guides/nextjs/sourcemaps/',
  },
  {
    id: cid('sentry'),
    service_id: SERVICE_IDS.sentry,
    order_index: 4,
    title: '에러 리포팅 테스트',
    title_ko: '에러 리포팅 테스트',
    description: '테스트 에러를 발생시키고 Sentry 대시보드에 표시되는지 확인하세요.',
    description_ko: '테스트 에러를 발생시키고 Sentry 대시보드에 표시되는지 확인하세요.',
    guide_url: 'https://docs.sentry.io/platforms/javascript/guides/nextjs/verify/',
  },
  {
    id: cid('sentry'),
    service_id: SERVICE_IDS.sentry,
    order_index: 5,
    title: '성능 모니터링 설정',
    title_ko: '성능 모니터링 설정',
    description: '트랜잭션 지속 시간 및 웹 바이탈을 추적하기 위한 성능 모니터링을 활성화하세요.',
    description_ko: '트랜잭션 지속 시간 및 웹 바이탈을 추적하기 위한 성능 모니터링을 활성화하세요.',
    guide_url: 'https://docs.sentry.io/platforms/javascript/guides/nextjs/performance/',
  },

  // =======================================================================
  // 14. PlanetScale
  // =======================================================================
  {
    id: cid('planetscale'),
    service_id: SERVICE_IDS.planetscale,
    order_index: 0,
    title: 'PlanetScale 데이터베이스 생성',
    title_ko: 'PlanetScale 데이터베이스 생성',
    description: 'planetscale.com에서 가입하고 새 데이터베이스를 생성하세요. 사용자에게 가까운 리전을 선택하세요.',
    description_ko: 'planetscale.com에서 가입하고 새 데이터베이스를 생성하세요. 사용자에게 가까운 리전을 선택하세요.',
    guide_url: 'https://planetscale.com/docs/tutorials/planetscale-quick-start-guide',
  },
  {
    id: cid('planetscale'),
    service_id: SERVICE_IDS.planetscale,
    order_index: 1,
    title: '연결 문자열 가져오기',
    title_ko: '연결 문자열 가져오기',
    description: '브랜치 탭에서 연결 문자열을 생성하고 DATABASE_URL에 추가하세요.',
    description_ko: '브랜치 탭에서 연결 문자열을 생성하고 DATABASE_URL에 추가하세요.',
    guide_url: 'https://planetscale.com/docs/concepts/connection-strings',
  },
  {
    id: cid('planetscale'),
    service_id: SERVICE_IDS.planetscale,
    order_index: 2,
    title: 'Prisma 또는 Drizzle로 스키마 설정',
    title_ko: 'Prisma 또는 Drizzle로 스키마 설정',
    description: 'ORM이 PlanetScale 드라이버를 사용하도록 설정하고 스키마를 푸시하세요.',
    description_ko: 'ORM이 PlanetScale 드라이버를 사용하도록 설정하고 스키마를 푸시하세요.',
    guide_url: 'https://planetscale.com/docs/prisma/prisma-quickstart',
  },
  {
    id: cid('planetscale'),
    service_id: SERVICE_IDS.planetscale,
    order_index: 3,
    title: '개발 브랜치 생성',
    title_ko: '개발 브랜치 생성',
    description: '스키마 변경을 안전하게 테스트하기 위해 개발용 별도 브랜치를 생성하세요.',
    description_ko: '스키마 변경을 안전하게 테스트하기 위해 개발용 별도 브랜치를 생성하세요.',
    guide_url: 'https://planetscale.com/docs/concepts/branching',
  },
  {
    id: cid('planetscale'),
    service_id: SERVICE_IDS.planetscale,
    order_index: 4,
    title: '데이터베이스 연결 테스트',
    title_ko: '데이터베이스 연결 테스트',
    description: '데이터베이스에 연결하고 기본 CRUD 작업을 수행할 수 있는지 확인하세요.',
    description_ko: '데이터베이스에 연결하고 기본 CRUD 작업을 수행할 수 있는지 확인하세요.',
    guide_url: null,
  },

  // =======================================================================
  // 15. Neon
  // =======================================================================
  {
    id: cid('neon'),
    service_id: SERVICE_IDS.neon,
    order_index: 0,
    title: 'Neon 프로젝트 생성',
    title_ko: 'Neon 프로젝트 생성',
    description: 'neon.tech에서 가입하고 Postgres 데이터베이스로 새 프로젝트를 생성하세요.',
    description_ko: 'neon.tech에서 가입하고 Postgres 데이터베이스로 새 프로젝트를 생성하세요.',
    guide_url: 'https://neon.tech/docs/get-started-with-neon/signing-up',
  },
  {
    id: cid('neon'),
    service_id: SERVICE_IDS.neon,
    order_index: 1,
    title: '연결 문자열 복사',
    title_ko: '연결 문자열 복사',
    description: '대시보드에서 풀링 및 직접 연결 문자열을 가져와 .env.local에 추가하세요.',
    description_ko: '대시보드에서 풀링 및 직접 연결 문자열을 가져와 .env.local에 추가하세요.',
    guide_url: 'https://neon.tech/docs/connect/connect-from-any-app',
  },
  {
    id: cid('neon'),
    service_id: SERVICE_IDS.neon,
    order_index: 2,
    title: 'Neon 서버리스 드라이버 설치',
    title_ko: 'Neon 서버리스 드라이버 설치',
    description: 'npm install @neondatabase/serverless 명령으로 엣지 호환 데이터베이스 액세스를 설치하세요.',
    description_ko: 'npm install @neondatabase/serverless 명령으로 엣지 호환 데이터베이스 액세스를 설치하세요.',
    guide_url: 'https://neon.tech/docs/serverless/serverless-driver',
  },
  {
    id: cid('neon'),
    service_id: SERVICE_IDS.neon,
    order_index: 3,
    title: '데이터베이스 스키마 설정',
    title_ko: '데이터베이스 스키마 설정',
    description: '직접 연결 문자열을 사용하여 SQL, Prisma 또는 Drizzle ORM으로 테이블을 생성하세요.',
    description_ko: '직접 연결 문자열을 사용하여 SQL, Prisma 또는 Drizzle ORM으로 테이블을 생성하세요.',
    guide_url: 'https://neon.tech/docs/guides/prisma',
  },
  {
    id: cid('neon'),
    service_id: SERVICE_IDS.neon,
    order_index: 4,
    title: '개발 브랜치 생성',
    title_ko: '개발 브랜치 생성',
    description: 'Neon 브랜칭을 사용하여 프로덕션 데이터로부터 격리된 개발 데이터베이스를 생성하세요.',
    description_ko: 'Neon 브랜칭을 사용하여 프로덕션 데이터로부터 격리된 개발 데이터베이스를 생성하세요.',
    guide_url: 'https://neon.tech/docs/introduction/branching',
  },
  {
    id: cid('neon'),
    service_id: SERVICE_IDS.neon,
    order_index: 5,
    title: '연결 및 쿼리 테스트',
    title_ko: '연결 및 쿼리 테스트',
    description: '데이터베이스 연결이 작동하는지 확인하고 샘플 쿼리를 실행하여 설정을 테스트하세요.',
    description_ko: '데이터베이스 연결이 작동하는지 확인하고 샘플 쿼리를 실행하여 설정을 테스트하세요.',
    guide_url: null,
  },

  // =======================================================================
  // 16. Railway
  // =======================================================================
  {
    id: cid('railway'),
    service_id: SERVICE_IDS.railway,
    order_index: 0,
    title: 'Railway 계정 생성',
    title_ko: 'Railway 계정 생성',
    description: '쉬운 리포지토리 연결을 위해 GitHub 계정으로 railway.app에서 가입하세요.',
    description_ko: '쉬운 리포지토리 연결을 위해 GitHub 계정으로 railway.app에서 가입하세요.',
    guide_url: 'https://docs.railway.app/getting-started',
  },
  {
    id: cid('railway'),
    service_id: SERVICE_IDS.railway,
    order_index: 1,
    title: '새 프로젝트 생성 및 리포지토리 연결',
    title_ko: '새 프로젝트 생성 및 리포지토리 연결',
    description: '프로젝트를 생성하고 자동 감지를 통해 GitHub 리포지토리에서 배포하세요.',
    description_ko: '프로젝트를 생성하고 자동 감지를 통해 GitHub 리포지토리에서 배포하세요.',
    guide_url: 'https://docs.railway.app/deploy/deployments',
  },
  {
    id: cid('railway'),
    service_id: SERVICE_IDS.railway,
    order_index: 2,
    title: '환경 변수 설정',
    title_ko: '환경 변수 설정',
    description: 'Railway 프로젝트 설정에서 필요한 모든 환경 변수를 추가하세요.',
    description_ko: 'Railway 프로젝트 설정에서 필요한 모든 환경 변수를 추가하세요.',
    guide_url: 'https://docs.railway.app/develop/variables',
  },
  {
    id: cid('railway'),
    service_id: SERVICE_IDS.railway,
    order_index: 3,
    title: '데이터베이스 서비스 추가 (필요한 경우)',
    title_ko: '데이터베이스 서비스 추가 (필요한 경우)',
    description: 'Railway 프로젝트에 직접 PostgreSQL, MySQL 또는 Redis 데이터베이스를 추가하세요.',
    description_ko: 'Railway 프로젝트에 직접 PostgreSQL, MySQL 또는 Redis 데이터베이스를 추가하세요.',
    guide_url: 'https://docs.railway.app/databases/overview',
  },
  {
    id: cid('railway'),
    service_id: SERVICE_IDS.railway,
    order_index: 4,
    title: '커스텀 도메인 설정',
    title_ko: '커스텀 도메인 설정',
    description: '설정 탭에서 배포된 서비스에 대한 커스텀 도메인을 설정하세요.',
    description_ko: '설정 탭에서 배포된 서비스에 대한 커스텀 도메인을 설정하세요.',
    guide_url: 'https://docs.railway.app/deploy/exposing-your-app',
  },

  // =======================================================================
  // 17. Lemon Squeezy
  // =======================================================================
  {
    id: cid('lemonsqueezy'),
    service_id: SERVICE_IDS.lemonsqueezy,
    order_index: 0,
    title: 'Lemon Squeezy 계정 생성',
    title_ko: 'Lemon Squeezy 계정 생성',
    description: 'lemonsqueezy.com에서 가입하고 디지털 제품 판매를 위한 스토어를 설정하세요.',
    description_ko: 'lemonsqueezy.com에서 가입하고 디지털 제품 판매를 위한 스토어를 설정하세요.',
    guide_url: 'https://docs.lemonsqueezy.com/guides/getting-started',
  },
  {
    id: cid('lemonsqueezy'),
    service_id: SERVICE_IDS.lemonsqueezy,
    order_index: 1,
    title: '상품 및 변형 생성',
    title_ko: '상품 및 변형 생성',
    description: '대시보드에서 가격, 변형 및 구독 플랜이 포함된 상품을 설정하세요.',
    description_ko: '대시보드에서 가격, 변형 및 구독 플랜이 포함된 상품을 설정하세요.',
    guide_url: 'https://docs.lemonsqueezy.com/guides/tutorials/saas-subscription',
  },
  {
    id: cid('lemonsqueezy'),
    service_id: SERVICE_IDS.lemonsqueezy,
    order_index: 2,
    title: 'API 키 생성',
    title_ko: 'API 키 생성',
    description: '설정 > API에서 API 키를 생성하고 환경 변수에 추가하세요.',
    description_ko: '설정 > API에서 API 키를 생성하고 환경 변수에 추가하세요.',
    guide_url: 'https://docs.lemonsqueezy.com/guides/developer-guide/getting-started#create-an-api-key',
  },
  {
    id: cid('lemonsqueezy'),
    service_id: SERVICE_IDS.lemonsqueezy,
    order_index: 3,
    title: '웹훅 엔드포인트 설정',
    title_ko: '웹훅 엔드포인트 설정',
    description: '결제 및 구독 이벤트를 수신하기 위한 웹훅을 스토어에 생성하세요.',
    description_ko: '결제 및 구독 이벤트를 수신하기 위한 웹훅을 스토어에 생성하세요.',
    guide_url: 'https://docs.lemonsqueezy.com/guides/developer-guide/webhooks',
  },
  {
    id: cid('lemonsqueezy'),
    service_id: SERVICE_IDS.lemonsqueezy,
    order_index: 4,
    title: '결제 흐름 구현',
    title_ko: '결제 흐름 구현',
    description: 'Lemon Squeezy 결제 오버레이 또는 호스팅 결제 페이지를 통합하세요.',
    description_ko: 'Lemon Squeezy 결제 오버레이 또는 호스팅 결제 페이지를 통합하세요.',
    guide_url: 'https://docs.lemonsqueezy.com/guides/developer-guide/taking-payments',
  },
  {
    id: cid('lemonsqueezy'),
    service_id: SERVICE_IDS.lemonsqueezy,
    order_index: 5,
    title: '샌드박스 모드에서 테스트',
    title_ko: '샌드박스 모드에서 테스트',
    description: '테스트 모드를 활성화하고 출시 전에 전체 구매 흐름을 확인하세요.',
    description_ko: '테스트 모드를 활성화하고 출시 전에 전체 구매 흐름을 확인하세요.',
    guide_url: 'https://docs.lemonsqueezy.com/guides/developer-guide/testing',
  },

  // =======================================================================
  // 18. UploadThing
  // =======================================================================
  {
    id: cid('uploadthing'),
    service_id: SERVICE_IDS.uploadthing,
    order_index: 0,
    title: 'UploadThing 계정 생성',
    title_ko: 'UploadThing 계정 생성',
    description: 'uploadthing.com에서 가입하고 새 앱을 생성하여 자격 증명을 받으세요.',
    description_ko: 'uploadthing.com에서 가입하고 새 앱을 생성하여 자격 증명을 받으세요.',
    guide_url: 'https://docs.uploadthing.com/getting-started/appdir',
  },
  {
    id: cid('uploadthing'),
    service_id: SERVICE_IDS.uploadthing,
    order_index: 1,
    title: 'UploadThing 패키지 설치',
    title_ko: 'UploadThing 패키지 설치',
    description: 'npm install uploadthing @uploadthing/react 명령으로 필요한 패키지를 설치하세요.',
    description_ko: 'npm install uploadthing @uploadthing/react 명령으로 필요한 패키지를 설치하세요.',
    guide_url: 'https://docs.uploadthing.com/getting-started/appdir#install-the-packages',
  },
  {
    id: cid('uploadthing'),
    service_id: SERVICE_IDS.uploadthing,
    order_index: 2,
    title: '환경 변수 설정',
    title_ko: '환경 변수 설정',
    description: '.env.local 파일에 UPLOADTHING_SECRET과 UPLOADTHING_APP_ID를 추가하세요.',
    description_ko: '.env.local 파일에 UPLOADTHING_SECRET과 UPLOADTHING_APP_ID를 추가하세요.',
    guide_url: 'https://docs.uploadthing.com/getting-started/appdir#add-env-variables',
  },
  {
    id: cid('uploadthing'),
    service_id: SERVICE_IDS.uploadthing,
    order_index: 3,
    title: '파일 라우터 정의',
    title_ko: '파일 라우터 정의',
    description: '파일 타입 및 크기 제한이 포함된 업로드 엔드포인트를 정의하는 파일 라우터를 생성하세요.',
    description_ko: '파일 타입 및 크기 제한이 포함된 업로드 엔드포인트를 정의하는 파일 라우터를 생성하세요.',
    guide_url: 'https://docs.uploadthing.com/getting-started/appdir#set-up-a-filerouter',
  },
  {
    id: cid('uploadthing'),
    service_id: SERVICE_IDS.uploadthing,
    order_index: 4,
    title: 'UI에 업로드 컴포넌트 추가',
    title_ko: 'UI에 업로드 컴포넌트 추가',
    description: 'React 페이지에 UploadButton 또는 UploadDropzone 컴포넌트를 사용하세요.',
    description_ko: 'React 페이지에 UploadButton 또는 UploadDropzone 컴포넌트를 사용하세요.',
    guide_url: 'https://docs.uploadthing.com/getting-started/appdir#create-the-upload-thing-components',
  },
  {
    id: cid('uploadthing'),
    service_id: SERVICE_IDS.uploadthing,
    order_index: 5,
    title: '파일 업로드 테스트',
    title_ko: '파일 업로드 테스트',
    description: '테스트 파일을 업로드하고 올바르게 저장되었으며 URL이 반환되는지 확인하세요.',
    description_ko: '테스트 파일을 업로드하고 올바르게 저장되었으며 URL이 반환되는지 확인하세요.',
    guide_url: null,
  },

  // =======================================================================
  // 19. PostHog
  // =======================================================================
  {
    id: cid('posthog'),
    service_id: SERVICE_IDS.posthog,
    order_index: 0,
    title: 'PostHog 계정 생성',
    title_ko: 'PostHog 계정 생성',
    description: 'posthog.com(클라우드)에서 가입하거나 오픈소스 버전을 자체 호스팅하세요.',
    description_ko: 'posthog.com(클라우드)에서 가입하거나 오픈소스 버전을 자체 호스팅하세요.',
    guide_url: 'https://posthog.com/docs/getting-started/cloud',
  },
  {
    id: cid('posthog'),
    service_id: SERVICE_IDS.posthog,
    order_index: 1,
    title: 'PostHog SDK 설치',
    title_ko: 'PostHog SDK 설치',
    description: 'npm install posthog-js posthog-node 명령으로 클라이언트 및 서버 라이브러리를 추가하세요.',
    description_ko: 'npm install posthog-js posthog-node 명령으로 클라이언트 및 서버 라이브러리를 추가하세요.',
    guide_url: 'https://posthog.com/docs/libraries/next-js',
  },
  {
    id: cid('posthog'),
    service_id: SERVICE_IDS.posthog,
    order_index: 2,
    title: '앱에 PostHog 프로바이더 추가',
    title_ko: '앱에 PostHog 프로바이더 추가',
    description: '프로젝트 API 키와 호스트로 앱 레이아웃에서 PostHog를 초기화하세요.',
    description_ko: '프로젝트 API 키와 호스트로 앱 레이아웃에서 PostHog를 초기화하세요.',
    guide_url: 'https://posthog.com/docs/libraries/next-js#client-side-setup',
  },
  {
    id: cid('posthog'),
    service_id: SERVICE_IDS.posthog,
    order_index: 3,
    title: '이벤트 추적 설정',
    title_ko: '이벤트 추적 설정',
    description: '애플리케이션에서 주요 사용자 액션에 대한 커스텀 이벤트 추적을 구현하세요.',
    description_ko: '애플리케이션에서 주요 사용자 액션에 대한 커스텀 이벤트 추적을 구현하세요.',
    guide_url: 'https://posthog.com/docs/product-analytics/capture-events',
  },
  {
    id: cid('posthog'),
    service_id: SERVICE_IDS.posthog,
    order_index: 4,
    title: '기능 플래그 설정 (선택사항)',
    title_ko: '기능 플래그 설정 (선택사항)',
    description: '점진적 배포 및 A/B 테스트를 위한 기능 플래그를 설정하세요.',
    description_ko: '점진적 배포 및 A/B 테스트를 위한 기능 플래그를 설정하세요.',
    guide_url: 'https://posthog.com/docs/feature-flags',
  },
  {
    id: cid('posthog'),
    service_id: SERVICE_IDS.posthog,
    order_index: 5,
    title: 'PostHog 대시보드에서 이벤트 확인',
    title_ko: 'PostHog 대시보드에서 이벤트 확인',
    description: 'PostHog 대시보드에서 이벤트가 올바르게 캡처되고 있는지 확인하세요.',
    description_ko: 'PostHog 대시보드에서 이벤트가 올바르게 캡처되고 있는지 확인하세요.',
    guide_url: null,
  },

  // =======================================================================
  // 20. AWS S3
  // =======================================================================
  {
    id: cid('awss3'),
    service_id: SERVICE_IDS.awss3,
    order_index: 0,
    title: 'AWS 계정 및 IAM 사용자 생성',
    title_ko: 'AWS 계정 및 IAM 사용자 생성',
    description: 'AWS에 가입하고 S3 권한이 있는 전용 IAM 사용자를 생성하세요.',
    description_ko: 'AWS에 가입하고 S3 권한이 있는 전용 IAM 사용자를 생성하세요.',
    guide_url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/setting-up-s3.html',
  },
  {
    id: cid('awss3'),
    service_id: SERVICE_IDS.awss3,
    order_index: 1,
    title: 'S3 버킷 생성',
    title_ko: 'S3 버킷 생성',
    description: '적절한 액세스 설정으로 원하는 리전에 새 S3 버킷을 생성하세요.',
    description_ko: '적절한 액세스 설정으로 원하는 리전에 새 S3 버킷을 생성하세요.',
    guide_url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-bucket.html',
  },
  {
    id: cid('awss3'),
    service_id: SERVICE_IDS.awss3,
    order_index: 2,
    title: '버킷 정책 및 CORS 설정',
    title_ko: '버킷 정책 및 CORS 설정',
    description: '액세스 제어를 위한 버킷 정책과 브라우저 업로드를 위한 CORS 설정을 구성하세요.',
    description_ko: '액세스 제어를 위한 버킷 정책과 브라우저 업로드를 위한 CORS 설정을 구성하세요.',
    guide_url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html',
  },
  {
    id: cid('awss3'),
    service_id: SERVICE_IDS.awss3,
    order_index: 3,
    title: 'AWS SDK 설치',
    title_ko: 'AWS SDK 설치',
    description: 'npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner 명령으로 S3 작업을 위한 SDK를 설치하세요.',
    description_ko: 'npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner 명령으로 S3 작업을 위한 SDK를 설치하세요.',
    guide_url: 'https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html',
  },
  {
    id: cid('awss3'),
    service_id: SERVICE_IDS.awss3,
    order_index: 4,
    title: '환경 변수 설정',
    title_ko: '환경 변수 설정',
    description: '.env.local에 AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION 및 버킷 이름을 추가하세요.',
    description_ko: '.env.local에 AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION 및 버킷 이름을 추가하세요.',
    guide_url: null,
  },
  {
    id: cid('awss3'),
    service_id: SERVICE_IDS.awss3,
    order_index: 5,
    title: '사전 서명된 URL 업로드 구현',
    title_ko: '사전 서명된 URL 업로드 구현',
    description: '안전한 직접 브라우저 업로드를 위해 사전 서명된 URL을 생성하는 API 엔드포인트를 만드세요.',
    description_ko: '안전한 직접 브라우저 업로드를 위해 사전 서명된 URL을 생성하는 API 엔드포인트를 만드세요.',
    guide_url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html',
  },
  {
    id: cid('awss3'),
    service_id: SERVICE_IDS.awss3,
    order_index: 6,
    title: '업로드 및 다운로드 테스트',
    title_ko: '업로드 및 다운로드 테스트',
    description: 'S3에 테스트 파일을 업로드하고 생성된 URL을 통해 검색할 수 있는지 확인하세요.',
    description_ko: 'S3에 테스트 파일을 업로드하고 생성된 URL을 통해 검색할 수 있는지 확인하세요.',
    guide_url: null,
  },
  {
    id: cid('awss3'),
    service_id: SERVICE_IDS.awss3,
    order_index: 7,
    title: 'CloudFront CDN 설정 (선택사항)',
    title_ko: 'CloudFront CDN 설정 (선택사항)',
    description: '더 빠른 글로벌 전송을 위해 S3 버킷 앞에 CloudFront 배포를 생성하세요.',
    description_ko: '더 빠른 글로벌 전송을 위해 S3 버킷 앞에 CloudFront 배포를 생성하세요.',
    guide_url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStartedCreateDistribution.html',
  },

  // =======================================================================
  // Kakao Login
  // =======================================================================
  {
    id: cid('kakao-login'),
    service_id: SERVICE_IDS.kakao_login,
    order_index: 0,
    title: 'Kakao Developers 앱 등록',
    title_ko: 'Kakao Developers 앱 등록',
    description: 'Kakao Developers(developers.kakao.com)에서 새 애플리케이션을 등록하세요.',
    description_ko: 'Kakao Developers(developers.kakao.com)에서 새 애플리케이션을 등록하세요.',
    guide_url: 'https://developers.kakao.com/docs/latest/ko/getting-started/app',
  },
  {
    id: cid('kakao-login'),
    service_id: SERVICE_IDS.kakao_login,
    order_index: 1,
    title: '카카오 로그인 활성화',
    title_ko: '카카오 로그인 활성화',
    description: '내 애플리케이션 > 제품 설정 > 카카오 로그인에서 활성화 설정을 ON으로 변경하세요.',
    description_ko: '내 애플리케이션 > 제품 설정 > 카카오 로그인에서 활성화 설정을 ON으로 변경하세요.',
    guide_url: 'https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite',
  },
  {
    id: cid('kakao-login'),
    service_id: SERVICE_IDS.kakao_login,
    order_index: 2,
    title: 'Redirect URI 등록',
    title_ko: 'Redirect URI 등록',
    description: '카카오 로그인 설정에서 웹 플랫폼 도메인과 Redirect URI를 등록하세요.',
    description_ko: '카카오 로그인 설정에서 웹 플랫폼 도메인과 Redirect URI를 등록하세요.',
    guide_url: 'https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#redirect-uri',
  },
  {
    id: cid('kakao-login'),
    service_id: SERVICE_IDS.kakao_login,
    order_index: 3,
    title: '환경 변수 설정',
    title_ko: '환경 변수 설정',
    description: 'REST API 키, JavaScript 키, Client Secret을 .env 파일에 설정하세요.',
    description_ko: 'REST API 키, JavaScript 키, Client Secret을 .env 파일에 설정하세요.',
    guide_url: null,
  },
  {
    id: cid('kakao-login'),
    service_id: SERVICE_IDS.kakao_login,
    order_index: 4,
    title: '동의 항목 설정',
    title_ko: '동의 항목 설정',
    description: '카카오 로그인 시 요청할 사용자 정보 동의 항목(닉네임, 이메일 등)을 설정하세요.',
    description_ko: '카카오 로그인 시 요청할 사용자 정보 동의 항목(닉네임, 이메일 등)을 설정하세요.',
    guide_url: 'https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#consent-item',
  },
  {
    id: cid('kakao-login'),
    service_id: SERVICE_IDS.kakao_login,
    order_index: 5,
    title: '로그인 버튼 및 콜백 구현',
    title_ko: '로그인 버튼 및 콜백 구현',
    description: '프론트엔드에 카카오 로그인 버튼을 추가하고, 콜백 처리 로직을 구현하세요.',
    description_ko: '프론트엔드에 카카오 로그인 버튼을 추가하고, 콜백 처리 로직을 구현하세요.',
    guide_url: 'https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api',
  },

  // =======================================================================
  // Google OAuth
  // =======================================================================
  {
    id: cid('google-oauth'),
    service_id: SERVICE_IDS.google_oauth,
    order_index: 0,
    title: 'Google Cloud Console 프로젝트 생성',
    title_ko: 'Google Cloud Console 프로젝트 생성',
    description: 'Google Cloud Console에서 새 프로젝트를 생성하거나 기존 프로젝트를 선택하세요.',
    description_ko: 'Google Cloud Console에서 새 프로젝트를 생성하거나 기존 프로젝트를 선택하세요.',
    guide_url: 'https://console.cloud.google.com/projectcreate',
  },
  {
    id: cid('google-oauth'),
    service_id: SERVICE_IDS.google_oauth,
    order_index: 1,
    title: 'OAuth 동의 화면 구성',
    title_ko: 'OAuth 동의 화면 구성',
    description: 'API 및 서비스 > OAuth 동의 화면에서 앱 이름, 로고, 범위 등을 설정하세요.',
    description_ko: 'API 및 서비스 > OAuth 동의 화면에서 앱 이름, 로고, 범위 등을 설정하세요.',
    guide_url: 'https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred',
  },
  {
    id: cid('google-oauth'),
    service_id: SERVICE_IDS.google_oauth,
    order_index: 2,
    title: 'OAuth 클라이언트 ID 생성',
    title_ko: 'OAuth 클라이언트 ID 생성',
    description: '사용자 인증 정보 > OAuth 2.0 클라이언트 ID를 생성하고, Redirect URI를 등록하세요.',
    description_ko: '사용자 인증 정보 > OAuth 2.0 클라이언트 ID를 생성하고, Redirect URI를 등록하세요.',
    guide_url: 'https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred',
  },
  {
    id: cid('google-oauth'),
    service_id: SERVICE_IDS.google_oauth,
    order_index: 3,
    title: '환경 변수 설정',
    title_ko: '환경 변수 설정',
    description: 'Client ID, Client Secret, Redirect URI를 .env 파일에 설정하세요.',
    description_ko: 'Client ID, Client Secret, Redirect URI를 .env 파일에 설정하세요.',
    guide_url: null,
  },
  {
    id: cid('google-oauth'),
    service_id: SERVICE_IDS.google_oauth,
    order_index: 4,
    title: '로그인 버튼 및 콜백 구현',
    title_ko: '로그인 버튼 및 콜백 구현',
    description: 'Google Sign-In 버튼을 추가하고, OAuth 콜백 처리 로직을 구현하세요.',
    description_ko: 'Google Sign-In 버튼을 추가하고, OAuth 콜백 처리 로직을 구현하세요.',
    guide_url: 'https://developers.google.com/identity/gsi/web/guides/display-button',
  },
  {
    id: cid('google-oauth'),
    service_id: SERVICE_IDS.google_oauth,
    order_index: 5,
    title: '프로덕션 검증 요청',
    title_ko: '프로덕션 검증 요청',
    description: '프로덕션 배포 전 Google의 OAuth 앱 검증 프로세스를 완료하세요.',
    description_ko: '프로덕션 배포 전 Google의 OAuth 앱 검증 프로세스를 완료하세요.',
    guide_url: 'https://support.google.com/cloud/answer/9110914',
  },

  // =======================================================================
  // Naver Login
  // =======================================================================
  {
    id: cid('naver-login'),
    service_id: SERVICE_IDS.naver_login,
    order_index: 0,
    title: '네이버 개발자 센터 앱 등록',
    title_ko: '네이버 개발자 센터 앱 등록',
    description: '네이버 개발자 센터(developers.naver.com)에서 새 애플리케이션을 등록하세요.',
    description_ko: '네이버 개발자 센터(developers.naver.com)에서 새 애플리케이션을 등록하세요.',
    guide_url: 'https://developers.naver.com/docs/login/api/api.md',
  },
  {
    id: cid('naver-login'),
    service_id: SERVICE_IDS.naver_login,
    order_index: 1,
    title: '네아로(네이버 아이디로 로그인) API 사용 신청',
    title_ko: '네아로(네이버 아이디로 로그인) API 사용 신청',
    description: '애플리케이션 설정에서 네이버 로그인 API를 사용 API로 추가하세요.',
    description_ko: '애플리케이션 설정에서 네이버 로그인 API를 사용 API로 추가하세요.',
    guide_url: 'https://developers.naver.com/docs/login/overview/overview.md',
  },
  {
    id: cid('naver-login'),
    service_id: SERVICE_IDS.naver_login,
    order_index: 2,
    title: '서비스 URL 및 Callback URL 등록',
    title_ko: '서비스 URL 및 Callback URL 등록',
    description: '애플리케이션 설정에서 서비스 URL과 Callback URL(로그인 콜백)을 등록하세요.',
    description_ko: '애플리케이션 설정에서 서비스 URL과 Callback URL(로그인 콜백)을 등록하세요.',
    guide_url: 'https://developers.naver.com/docs/login/api/api.md',
  },
  {
    id: cid('naver-login'),
    service_id: SERVICE_IDS.naver_login,
    order_index: 3,
    title: '환경 변수 설정',
    title_ko: '환경 변수 설정',
    description: 'Client ID, Client Secret, Redirect URI를 .env 파일에 설정하세요.',
    description_ko: 'Client ID, Client Secret, Redirect URI를 .env 파일에 설정하세요.',
    guide_url: null,
  },
  {
    id: cid('naver-login'),
    service_id: SERVICE_IDS.naver_login,
    order_index: 4,
    title: '로그인 버튼 및 콜백 구현',
    title_ko: '로그인 버튼 및 콜백 구현',
    description: '네이버 로그인 버튼을 추가하고, OAuth 콜백 처리 로직을 구현하세요.',
    description_ko: '네이버 로그인 버튼을 추가하고, OAuth 콜백 처리 로직을 구현하세요.',
    guide_url: 'https://developers.naver.com/docs/login/web/web.md',
  },
  {
    id: cid('naver-login'),
    service_id: SERVICE_IDS.naver_login,
    order_index: 5,
    title: '검수 요청 및 서비스 적용',
    title_ko: '검수 요청 및 서비스 적용',
    description: '로그인 오픈 API 이용 검수를 요청하고 승인 후 서비스에 적용하세요.',
    description_ko: '로그인 오픈 API 이용 검수를 요청하고 승인 후 서비스에 적용하세요.',
    guide_url: 'https://developers.naver.com/docs/login/verify/verify.md',
  },

  // =======================================================================
  // Apple Login
  // =======================================================================
  {
    id: cid('apple-login'),
    service_id: SERVICE_IDS.apple_login,
    order_index: 0,
    title: 'Apple Developer Program 가입',
    title_ko: 'Apple Developer Program 가입',
    description: 'Apple Developer Program($99/년)에 가입하고 개발자 계정을 활성화하세요.',
    description_ko: 'Apple Developer Program($99/년)에 가입하고 개발자 계정을 활성화하세요.',
    guide_url: 'https://developer.apple.com/programs/',
  },
  {
    id: cid('apple-login'),
    service_id: SERVICE_IDS.apple_login,
    order_index: 1,
    title: 'App ID 및 Services ID 생성',
    title_ko: 'App ID 및 Services ID 생성',
    description: 'Certificates, Identifiers & Profiles에서 App ID와 Services ID를 생성하고, Sign In with Apple을 활성화하세요.',
    description_ko: 'Certificates, Identifiers & Profiles에서 App ID와 Services ID를 생성하고, Sign In with Apple을 활성화하세요.',
    guide_url: 'https://developer.apple.com/help/account/configure-app-capabilities/configure-sign-in-with-apple-for-the-web/',
  },
  {
    id: cid('apple-login'),
    service_id: SERVICE_IDS.apple_login,
    order_index: 2,
    title: '키(Key) 생성',
    title_ko: '키(Key) 생성',
    description: 'Sign In with Apple용 Private Key를 생성하고 안전하게 보관하세요.',
    description_ko: 'Sign In with Apple용 Private Key를 생성하고 안전하게 보관하세요.',
    guide_url: 'https://developer.apple.com/help/account/configure-app-capabilities/configure-sign-in-with-apple-for-the-web/',
  },
  {
    id: cid('apple-login'),
    service_id: SERVICE_IDS.apple_login,
    order_index: 3,
    title: '환경 변수 설정',
    title_ko: '환경 변수 설정',
    description: 'Client ID, Team ID, Key ID, Private Key를 .env 파일에 설정하세요.',
    description_ko: 'Client ID, Team ID, Key ID, Private Key를 .env 파일에 설정하세요.',
    guide_url: null,
  },
  {
    id: cid('apple-login'),
    service_id: SERVICE_IDS.apple_login,
    order_index: 4,
    title: '로그인 버튼 및 콜백 구현',
    title_ko: '로그인 버튼 및 콜백 구현',
    description: 'Sign in with Apple 버튼을 추가하고, JWT 검증 및 콜백 처리 로직을 구현하세요.',
    description_ko: 'Sign in with Apple 버튼을 추가하고, JWT 검증 및 콜백 처리 로직을 구현하세요.',
    guide_url: 'https://developer.apple.com/sign-in-with-apple/get-started/',
  },
  {
    id: cid('apple-login'),
    service_id: SERVICE_IDS.apple_login,
    order_index: 5,
    title: '이메일 릴레이 서비스 설정',
    title_ko: '이메일 릴레이 서비스 설정',
    description: 'Apple Private Email Relay를 설정하여 사용자의 숨김 이메일로 알림을 보낼 수 있게 하세요.',
    description_ko: 'Apple Private Email Relay를 설정하여 사용자의 숨김 이메일로 알림을 보낼 수 있게 하세요.',
    guide_url: 'https://developer.apple.com/help/account/configure-app-capabilities/configure-private-email-relay-service/',
  },

  // =======================================================================
  // GitHub OAuth
  // =======================================================================
  {
    id: cid('github-oauth'),
    service_id: SERVICE_IDS.github_oauth,
    order_index: 0,
    title: 'GitHub OAuth App 생성',
    title_ko: 'GitHub OAuth App 생성',
    description: 'GitHub Settings > Developer settings > OAuth Apps에서 새 OAuth App을 등록하세요.',
    description_ko: 'GitHub Settings > Developer settings > OAuth Apps에서 새 OAuth App을 등록하세요.',
    guide_url: 'https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app',
  },
  {
    id: cid('github-oauth'),
    service_id: SERVICE_IDS.github_oauth,
    order_index: 1,
    title: 'Authorization callback URL 등록',
    title_ko: 'Authorization callback URL 등록',
    description: 'OAuth App 설정에서 Authorization callback URL을 등록하세요.',
    description_ko: 'OAuth App 설정에서 Authorization callback URL을 등록하세요.',
    guide_url: 'https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps',
  },
  {
    id: cid('github-oauth'),
    service_id: SERVICE_IDS.github_oauth,
    order_index: 2,
    title: '환경 변수 설정',
    title_ko: '환경 변수 설정',
    description: 'Client ID와 Client Secret을 .env 파일에 설정하세요.',
    description_ko: 'Client ID와 Client Secret을 .env 파일에 설정하세요.',
    guide_url: null,
  },
  {
    id: cid('github-oauth'),
    service_id: SERVICE_IDS.github_oauth,
    order_index: 3,
    title: '로그인 버튼 및 콜백 구현',
    title_ko: '로그인 버튼 및 콜백 구현',
    description: 'GitHub 로그인 버튼을 추가하고, OAuth 인증 흐름과 콜백 처리 로직을 구현하세요.',
    description_ko: 'GitHub 로그인 버튼을 추가하고, OAuth 인증 흐름과 콜백 처리 로직을 구현하세요.',
    guide_url: 'https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow',
  },
  {
    id: cid('github-oauth'),
    service_id: SERVICE_IDS.github_oauth,
    order_index: 4,
    title: 'Scope 설정 및 사용자 정보 가져오기',
    title_ko: 'Scope 설정 및 사용자 정보 가져오기',
    description: '필요한 권한 범위(scope)를 설정하고, 액세스 토큰으로 사용자 정보를 가져오세요.',
    description_ko: '필요한 권한 범위(scope)를 설정하고, 액세스 토큰으로 사용자 정보를 가져오세요.',
    guide_url: 'https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps',
  },

  // =======================================================================
  // 86. 가비아
  // =======================================================================
  {
    id: cid('gabia'),
    service_id: SERVICE_IDS.gabia,
    order_index: 0,
    title: '가비아 계정 생성 및 로그인',
    title_ko: '가비아 계정 생성 및 로그인',
    description: 'gabia.com에서 회원가입 후 로그인하세요.',
    description_ko: 'gabia.com에서 회원가입 후 로그인하세요.',
    guide_url: 'https://www.gabia.com',
  },
  {
    id: cid('gabia'),
    service_id: SERVICE_IDS.gabia,
    order_index: 1,
    title: '도메인 검색 및 등록',
    title_ko: '도메인 검색 및 등록',
    description: '원하는 도메인명을 검색하고 사용 가능한 도메인을 등록하세요.',
    description_ko: '원하는 도메인명을 검색하고 사용 가능한 도메인을 등록하세요.',
    guide_url: 'https://www.gabia.com/domain',
  },
  {
    id: cid('gabia'),
    service_id: SERVICE_IDS.gabia,
    order_index: 2,
    title: 'API 키 발급',
    title_ko: 'API 키 발급',
    description: '마이페이지 > API 관리에서 API ID와 HMAC 키를 발급받으세요.',
    description_ko: '마이페이지 > API 관리에서 API ID와 HMAC 키를 발급받으세요.',
    guide_url: 'https://api.gabia.com/docs',
  },
  {
    id: cid('gabia'),
    service_id: SERVICE_IDS.gabia,
    order_index: 3,
    title: 'DNS 레코드 설정',
    title_ko: 'DNS 레코드 설정',
    description: '도메인 관리 패널에서 A, CNAME, TXT 등 필요한 DNS 레코드를 설정하세요.',
    description_ko: '도메인 관리 패널에서 A, CNAME, TXT 등 필요한 DNS 레코드를 설정하세요.',
    guide_url: 'https://customer.gabia.com/manual/domain/dns',
  },

  // =======================================================================
  // 87. 후이즈
  // =======================================================================
  {
    id: cid('whois'),
    service_id: SERVICE_IDS.whois,
    order_index: 0,
    title: '후이즈 계정 생성 및 로그인',
    title_ko: '후이즈 계정 생성 및 로그인',
    description: 'whois.co.kr에서 회원가입 후 로그인하세요.',
    description_ko: 'whois.co.kr에서 회원가입 후 로그인하세요.',
    guide_url: 'https://www.whois.co.kr',
  },
  {
    id: cid('whois'),
    service_id: SERVICE_IDS.whois,
    order_index: 1,
    title: '도메인 검색 및 등록',
    title_ko: '도메인 검색 및 등록',
    description: '원하는 도메인명을 검색하고 사용 가능한 도메인을 등록하세요.',
    description_ko: '원하는 도메인명을 검색하고 사용 가능한 도메인을 등록하세요.',
    guide_url: 'https://www.whois.co.kr/domain',
  },
  {
    id: cid('whois'),
    service_id: SERVICE_IDS.whois,
    order_index: 2,
    title: 'API 키 발급',
    title_ko: 'API 키 발급',
    description: '마이페이지에서 API 키와 시크릿 키를 발급받아 환경 변수에 설정하세요.',
    description_ko: '마이페이지에서 API 키와 시크릿 키를 발급받아 환경 변수에 설정하세요.',
    guide_url: 'https://www.whois.co.kr/api',
  },
  {
    id: cid('whois'),
    service_id: SERVICE_IDS.whois,
    order_index: 3,
    title: 'DNS 레코드 설정',
    title_ko: 'DNS 레코드 설정',
    description: '도메인 관리에서 네임서버 변경 또는 DNS 레코드(A, CNAME, MX 등)를 설정하세요.',
    description_ko: '도메인 관리에서 네임서버 변경 또는 DNS 레코드(A, CNAME, MX 등)를 설정하세요.',
    guide_url: null,
  },

  // =======================================================================
  // 88. 카페24
  // =======================================================================
  {
    id: cid('cafe24'),
    service_id: SERVICE_IDS.cafe24,
    order_index: 0,
    title: '카페24 계정 생성 및 로그인',
    title_ko: '카페24 계정 생성 및 로그인',
    description: 'cafe24.com에서 회원가입 후 로그인하세요.',
    description_ko: 'cafe24.com에서 회원가입 후 로그인하세요.',
    guide_url: 'https://www.cafe24.com',
  },
  {
    id: cid('cafe24'),
    service_id: SERVICE_IDS.cafe24,
    order_index: 1,
    title: '도메인 등록 또는 쇼핑몰 개설',
    title_ko: '도메인 등록 또는 쇼핑몰 개설',
    description: '도메인을 등록하거나 쇼핑몰을 개설하고 Mall ID를 확인하세요.',
    description_ko: '도메인을 등록하거나 쇼핑몰을 개설하고 Mall ID를 확인하세요.',
    guide_url: 'https://developers.cafe24.com/docs/api/shop',
  },
  {
    id: cid('cafe24'),
    service_id: SERVICE_IDS.cafe24,
    order_index: 2,
    title: 'OAuth 앱 등록 및 Client ID 발급',
    title_ko: 'OAuth 앱 등록 및 Client ID 발급',
    description: 'developers.cafe24.com에서 앱을 등록하고 Client ID / Secret을 발급받으세요.',
    description_ko: 'developers.cafe24.com에서 앱을 등록하고 Client ID / Secret을 발급받으세요.',
    guide_url: 'https://developers.cafe24.com/docs/authentication',
  },
  {
    id: cid('cafe24'),
    service_id: SERVICE_IDS.cafe24,
    order_index: 3,
    title: '환경 변수 설정',
    title_ko: '환경 변수 설정',
    description: 'CAFE24_CLIENT_ID, CAFE24_CLIENT_SECRET, CAFE24_MALL_ID를 .env에 설정하세요.',
    description_ko: 'CAFE24_CLIENT_ID, CAFE24_CLIENT_SECRET, CAFE24_MALL_ID를 .env에 설정하세요.',
    guide_url: null,
  },

  // =======================================================================
  // 89. 아이네임즈
  // =======================================================================
  {
    id: cid('inames'),
    service_id: SERVICE_IDS.inames,
    order_index: 0,
    title: '아이네임즈 계정 생성 및 로그인',
    title_ko: '아이네임즈 계정 생성 및 로그인',
    description: 'inames.co.kr에서 회원가입 후 로그인하세요.',
    description_ko: 'inames.co.kr에서 회원가입 후 로그인하세요.',
    guide_url: 'https://www.inames.co.kr',
  },
  {
    id: cid('inames'),
    service_id: SERVICE_IDS.inames,
    order_index: 1,
    title: '도메인 검색 및 등록',
    title_ko: '도메인 검색 및 등록',
    description: '원하는 도메인명을 검색하고 사용 가능한 도메인을 등록하세요.',
    description_ko: '원하는 도메인명을 검색하고 사용 가능한 도메인을 등록하세요.',
    guide_url: 'https://www.inames.co.kr/domain',
  },
  {
    id: cid('inames'),
    service_id: SERVICE_IDS.inames,
    order_index: 2,
    title: 'API 키 발급',
    title_ko: 'API 키 발급',
    description: '마이페이지 > API 설정에서 API 키와 패스워드를 발급받으세요.',
    description_ko: '마이페이지 > API 설정에서 API 키와 패스워드를 발급받으세요.',
    guide_url: 'https://www.inames.co.kr/domain/api',
  },
  {
    id: cid('inames'),
    service_id: SERVICE_IDS.inames,
    order_index: 3,
    title: 'DNS 레코드 설정',
    title_ko: 'DNS 레코드 설정',
    description: '도메인 관리에서 네임서버 또는 DNS 레코드를 설정하세요.',
    description_ko: '도메인 관리에서 네임서버 또는 DNS 레코드를 설정하세요.',
    guide_url: null,
  },

  // =======================================================================
  // 90. Namecheap
  // =======================================================================
  {
    id: cid('namecheap'),
    service_id: SERVICE_IDS.namecheap,
    order_index: 0,
    title: 'Namecheap 계정 생성 및 로그인',
    title_ko: 'Namecheap 계정 생성 및 로그인',
    description: 'namecheap.com에서 계정을 생성하고 로그인하세요.',
    description_ko: 'namecheap.com에서 계정을 생성하고 로그인하세요.',
    guide_url: 'https://www.namecheap.com',
  },
  {
    id: cid('namecheap'),
    service_id: SERVICE_IDS.namecheap,
    order_index: 1,
    title: '도메인 검색 및 등록',
    title_ko: '도메인 검색 및 등록',
    description: '원하는 도메인명을 검색하고 등록하세요. 무료 WHOIS 개인정보 보호가 자동 적용됩니다.',
    description_ko: '원하는 도메인명을 검색하고 등록하세요. 무료 WHOIS 개인정보 보호가 자동 적용됩니다.',
    guide_url: 'https://www.namecheap.com/domains/',
  },
  {
    id: cid('namecheap'),
    service_id: SERVICE_IDS.namecheap,
    order_index: 2,
    title: 'API 활성화 및 IP 화이트리스트 등록',
    title_ko: 'API 활성화 및 IP 화이트리스트 등록',
    description: 'Profile > Tools > API Access에서 API를 활성화하고 서버 IP를 화이트리스트에 추가하세요.',
    description_ko: 'Profile > Tools > API Access에서 API를 활성화하고 서버 IP를 화이트리스트에 추가하세요.',
    guide_url: 'https://www.namecheap.com/support/api/intro/',
  },
  {
    id: cid('namecheap'),
    service_id: SERVICE_IDS.namecheap,
    order_index: 3,
    title: '환경 변수 설정 및 DNS 레코드 구성',
    title_ko: '환경 변수 설정 및 DNS 레코드 구성',
    description: 'NAMECHEAP_API_KEY, NAMECHEAP_API_USER, NAMECHEAP_CLIENT_IP를 .env에 설정하고, Advanced DNS에서 A/CNAME 레코드를 구성하세요.',
    description_ko: 'NAMECHEAP_API_KEY, NAMECHEAP_API_USER, NAMECHEAP_CLIENT_IP를 .env에 설정하고, Advanced DNS에서 A/CNAME 레코드를 구성하세요.',
    guide_url: 'https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/',
  },
];
