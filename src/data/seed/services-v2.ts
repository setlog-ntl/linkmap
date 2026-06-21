import type {
  ServiceCategory,
  ServiceDomain,
  DifficultyLevel,
  FreeTierQuality,
  VendorLockInRisk,
  EnvVarTemplate,
} from '@/types';

// tags 규칙: 영문 기술 태그 + 한글 음역 + 한글 키워드
// 예: tags: ['payment', 'subscription', '폴라', '결제', '구독']

// ---------------------------------------------------------------------------
// Seed-specific types: V2 extended service data
// ---------------------------------------------------------------------------

export interface ServiceSeedV2 {
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
  domain: ServiceDomain;
  subcategory: string;
  popularity_score: number;
  difficulty_level: DifficultyLevel;
  tags: string[];
  alternatives: string[];
  compatibility: { framework?: string[]; language?: string[] };
  official_sdks: Record<string, string>;
  free_tier_quality: FreeTierQuality;
  vendor_lock_in_risk: VendorLockInRisk;
  setup_time_minutes: number;
  monthly_cost_estimate: Record<string, string>;
  github_stars?: number | null;
}

// ---------------------------------------------------------------------------
// Fixed UUIDs – deterministic so seed operations are idempotent
// ---------------------------------------------------------------------------

export const SERVICE_IDS_V2 = {
  github_actions: '10000000-0000-4000-a000-000000000021',
  twilio: '10000000-0000-4000-a000-000000000022',
  onesignal: '10000000-0000-4000-a000-000000000023',
  algolia: '10000000-0000-4000-a000-000000000024',
  sanity: '10000000-0000-4000-a000-000000000025',
  ga4: '10000000-0000-4000-a000-000000000026',
  upstash_redis: '10000000-0000-4000-a000-000000000027',
  cloudflare: '10000000-0000-4000-a000-000000000028',
  flyio: '10000000-0000-4000-a000-000000000029',
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
  namecheap: '10000000-0000-4000-a000-000000000091',
  cloudflare_registrar: '10000000-0000-4000-a000-000000000092',
  godaddy: '10000000-0000-4000-a000-000000000093',
  gabia: '10000000-0000-4000-a000-000000000094',
  hosting_kr: '10000000-0000-4000-a000-000000000095',
  dotname: '10000000-0000-4000-a000-000000000096',
  // Advertising network services
  google_adsense: '10000000-0000-4000-a000-000000000097',
  kakao_adfit: '10000000-0000-4000-a000-000000000098',
  criteo: '10000000-0000-4000-a000-000000000099',
  taboola: '10000000-0000-4000-a000-000000000100',
  amazon_aps: '10000000-0000-4000-a000-000000000101',
  google_ad_manager: '10000000-0000-4000-a000-000000000102',
  // AI services - Phase 5
  grok: '10000000-0000-4000-a000-000000000103',
  mistral: '10000000-0000-4000-a000-000000000104',
  cohere: '10000000-0000-4000-a000-000000000105',
  deepseek: '10000000-0000-4000-a000-000000000106',
  perplexity: '10000000-0000-4000-a000-000000000107',
  ai21_labs: '10000000-0000-4000-a000-000000000108',
  midjourney: '10000000-0000-4000-a000-000000000109',
  runway_ml: '10000000-0000-4000-a000-000000000110',
  sora: '10000000-0000-4000-a000-000000000111',
  leonardo_ai: '10000000-0000-4000-a000-000000000112',
  deepgram: '10000000-0000-4000-a000-000000000113',
  assemblyai: '10000000-0000-4000-a000-000000000114',
  playht: '10000000-0000-4000-a000-000000000115',
  windsurf: '10000000-0000-4000-a000-000000000116',
  tabnine: '10000000-0000-4000-a000-000000000117',
  amazon_q: '10000000-0000-4000-a000-000000000118',
  weaviate: '10000000-0000-4000-a000-000000000119',
  qdrant: '10000000-0000-4000-a000-000000000120',
  chroma: '10000000-0000-4000-a000-000000000121',
  crewai: '10000000-0000-4000-a000-000000000122',
  dify: '10000000-0000-4000-a000-000000000123',
  together_ai: '10000000-0000-4000-a000-000000000124',
  fireworks_ai: '10000000-0000-4000-a000-000000000125',
  modal: '10000000-0000-4000-a000-000000000126',
  wandb: '10000000-0000-4000-a000-000000000127',
  // SNS platform services
  instagram_api: '10000000-0000-4000-a000-000000000128',
  youtube_api: '10000000-0000-4000-a000-000000000129',
  x_api: '10000000-0000-4000-a000-000000000130',
  tiktok_api: '10000000-0000-4000-a000-000000000131',
  linkedin_api: '10000000-0000-4000-a000-000000000132',
  threads_api: '10000000-0000-4000-a000-000000000133',
  polar: '10000000-0000-4000-a000-000000000134',
  // AI creative ad generation
  gwanggo: '10000000-0000-4000-a000-000000000135',
  // Platform self-reference
  linkmap: '10000000-0000-4000-a000-000000000136',
  // Analytics
  clarity: '10000000-0000-4000-a000-000000000137',
  // AI IDE / Agentic Development
  google_antigravity: '10000000-0000-4000-a000-000000000138',
  // Workflow Automation
  n8n: '10000000-0000-4000-a000-000000000139',
  // AI UI Design
  google_stitch: '10000000-0000-4000-a000-000000000140',
  // ── Batch 1: 트렌딩 서비스 2024-2026 ──
  cursor: '10000000-0000-4000-a000-000000000141',
  github_copilot: '10000000-0000-4000-a000-000000000142',
  bolt_new: '10000000-0000-4000-a000-000000000143',
  lovable: '10000000-0000-4000-a000-000000000144',
  v0: '10000000-0000-4000-a000-000000000145',
  replit: '10000000-0000-4000-a000-000000000146',
  cline: '10000000-0000-4000-a000-000000000147',
  openrouter: '10000000-0000-4000-a000-000000000148',
  huggingface: '10000000-0000-4000-a000-000000000149',
  replicate: '10000000-0000-4000-a000-000000000150',
  convex: '10000000-0000-4000-a000-000000000151',
  turso: '10000000-0000-4000-a000-000000000152',
  prisma: '10000000-0000-4000-a000-000000000153',
  paddle: '10000000-0000-4000-a000-000000000154',
  payload_cms: '10000000-0000-4000-a000-000000000155',
  axiom: '10000000-0000-4000-a000-000000000156',
  betterstack: '10000000-0000-4000-a000-000000000157',
  novu: '10000000-0000-4000-a000-000000000158',
  // Vibe Coding / App Builder - Batch 2
  manus: '10000000-0000-4000-a000-000000000159',
  devin: '10000000-0000-4000-a000-000000000160',
  base44: '10000000-0000-4000-a000-000000000161',
  rork: '10000000-0000-4000-a000-000000000162',
  a0_dev: '10000000-0000-4000-a000-000000000163',
  tempo_labs: '10000000-0000-4000-a000-000000000164',
} as const;

// ---------------------------------------------------------------------------
// 30 Services (V2)
// ---------------------------------------------------------------------------

export const servicesV2: ServiceSeedV2[] = [
  // -----------------------------------------------------------------------
  // 1. GitHub Actions
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.github_actions,
    name: 'GitHub Actions',
    slug: 'github-actions',
    category: 'cicd',
    description:
      'GitHub에 내장된 CI/CD 플랫폼으로, 코드 빌드·테스트·배포를 워크플로우 YAML 파일로 자동화할 수 있습니다.',
    description_ko:
      'GitHub에 내장된 CI/CD 플랫폼으로, 코드 빌드·테스트·배포를 워크플로우 YAML 파일로 자동화할 수 있습니다.',
    icon_url: null,
    website_url: 'https://github.com/features/actions',
    docs_url: 'https://docs.github.com/en/actions',
    pricing_info: {
      free_tier: true,
      free_tier_details: '퍼블릭 리포: 무제한, 프라이빗 리포: 월 2,000분 무료',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Team', price: '$4/유저/월' },
        { name: 'Enterprise', price: '$21/유저/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'GITHUB_TOKEN',
        public: false,
        optional: true,
        description: 'GitHub 개인 액세스 토큰 (워크플로우에서 자동 생성됨)',
        description_ko: 'GitHub 개인 액세스 토큰 (워크플로우에서 자동 생성됨)',
      },
    ],
    domain: 'devtools',
    subcategory: 'ci-cd',
    popularity_score: 95,
    difficulty_level: 'intermediate',
    tags: ['ci', 'cd', 'automation', 'github', 'workflow', 'yaml', 'devops', '깃허브 액션', 'CI/CD', '자동화'],
    alternatives: ['vercel', 'netlify', 'railway'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'angular', 'svelte', 'nuxt', 'express', 'django', 'rails'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust', 'java', 'ruby'],
    },
    official_sdks: {
      javascript: 'https://github.com/actions/toolkit',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$4/유저',
      enterprise: '$21/유저',
    },
  },

  // -----------------------------------------------------------------------
  // 2. Twilio
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.twilio,
    name: 'Twilio',
    slug: 'twilio',
    category: 'sms',
    description:
      'SMS, 음성 통화, 영상 통화, WhatsApp 메시징 등 다양한 커뮤니케이션 API를 제공하는 클라우드 플랫폼입니다.',
    description_ko:
      'SMS, 음성 통화, 영상 통화, WhatsApp 메시징 등 다양한 커뮤니케이션 API를 제공하는 클라우드 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://www.twilio.com',
    docs_url: 'https://www.twilio.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '트라이얼 계정: $15.50 크레딧 제공, 인증된 번호로만 발송 가능',
      plans: [
        { name: 'Pay-as-you-go', price: 'SMS 건당 $0.0079~' },
        { name: 'Volume Discounts', price: '문의' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'TWILIO_ACCOUNT_SID',
        public: false,
        description: 'Twilio 계정 SID',
        description_ko: 'Twilio 계정 SID',
      },
      {
        name: 'TWILIO_AUTH_TOKEN',
        public: false,
        description: 'Twilio 인증 토큰',
        description_ko: 'Twilio 인증 토큰',
        optional: true,
      },
      {
        name: 'TWILIO_PHONE_NUMBER',
        public: false,
        description: 'Twilio 발신 전화번호',
        description_ko: 'Twilio 발신 전화번호',
        optional: true,
      },
    ],
    domain: 'communication',
    subcategory: 'sms-voice',
    popularity_score: 88,
    difficulty_level: 'intermediate',
    tags: ['sms', 'voice', 'messaging', 'whatsapp', 'communication', 'api', 'verification', '트윌리오', '문자', '인증'],
    alternatives: ['onesignal', 'pusher'],
    compatibility: {
      framework: ['next', 'express', 'django', 'rails', 'flask', 'spring'],
      language: ['javascript', 'typescript', 'python', 'java', 'csharp', 'ruby', 'php', 'go'],
    },
    official_sdks: {
      javascript: 'https://github.com/twilio/twilio-node',
      python: 'https://github.com/twilio/twilio-python',
      java: 'https://github.com/twilio/twilio-java',
      ruby: 'https://github.com/twilio/twilio-ruby',
      php: 'https://github.com/twilio/twilio-php',
      go: 'https://github.com/twilio/twilio-go',
    },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 20,
    monthly_cost_estimate: {
      starter: '$5~$20',
      growth: '$50~$200',
      enterprise: '$500+',
    },
  },

  // -----------------------------------------------------------------------
  // 3. OneSignal
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.onesignal,
    name: 'OneSignal',
    slug: 'onesignal',
    category: 'push',
    description:
      '웹·모바일 푸시 알림, 인앱 메시징, 이메일, SMS를 통합 관리할 수 있는 고객 참여 플랫폼입니다.',
    description_ko:
      '웹·모바일 푸시 알림, 인앱 메시징, 이메일, SMS를 통합 관리할 수 있는 고객 참여 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://onesignal.com',
    docs_url: 'https://documentation.onesignal.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무제한 모바일 푸시, 웹 푸시 10,000명, 이메일 100건/일',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Growth', price: '$9/월~' },
        { name: 'Professional', price: '$99/월~' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'ONESIGNAL_APP_ID',
        public: true,
        description: 'OneSignal 앱 ID',
        description_ko: 'OneSignal 앱 ID',
      },
      {
        name: 'ONESIGNAL_REST_API_KEY',
        public: false,
        description: 'OneSignal REST API 키',
        description_ko: 'OneSignal REST API 키',
        optional: true,
      },
    ],
    domain: 'communication',
    subcategory: 'push-notification',
    popularity_score: 75,
    difficulty_level: 'beginner',
    tags: ['push', 'notification', 'mobile', 'web', 'engagement', 'messaging', '원시그널', '푸시알림'],
    alternatives: ['pusher', 'twilio'],
    compatibility: {
      framework: ['next', 'react', 'react-native', 'flutter', 'angular', 'vue'],
      language: ['javascript', 'typescript', 'swift', 'kotlin', 'java', 'python', 'ruby', 'php'],
    },
    official_sdks: {
      javascript: 'https://github.com/OneSignal/onesignal-node-api',
      react: 'https://github.com/nickmarca/react-onesignal',
      'react-native': 'https://github.com/OneSignal/react-native-onesignal',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$9~$50',
      enterprise: '$99+',
    },
  },

  // -----------------------------------------------------------------------
  // 4. Algolia
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.algolia,
    name: 'Algolia',
    slug: 'algolia',
    category: 'search',
    description:
      '밀리초 단위의 초고속 전문 검색과 검색 분석, AI 기반 추천 기능을 제공하는 검색 API 플랫폼입니다.',
    description_ko:
      '밀리초 단위의 초고속 전문 검색과 검색 분석, AI 기반 추천 기능을 제공하는 검색 API 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://www.algolia.com',
    docs_url: 'https://www.algolia.com/doc',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 10,000건 검색 요청, 10,000건 레코드',
      plans: [
        { name: 'Build (Free)', price: '$0/월' },
        { name: 'Grow', price: '$0.50/1,000건 요청~' },
        { name: 'Premium', price: '문의' },
        { name: 'Elevate', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_ALGOLIA_APP_ID',
        public: true,
        description: 'Algolia 애플리케이션 ID',
        description_ko: 'Algolia 애플리케이션 ID',
      },
      {
        name: 'NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY',
        public: true,
        description: 'Algolia 검색 전용 API 키 (프론트엔드용)',
        description_ko: 'Algolia 검색 전용 API 키 (프론트엔드용)',
        optional: true,
      },
      {
        name: 'ALGOLIA_ADMIN_API_KEY',
        public: false,
        description: 'Algolia 관리자 API 키 (인덱싱·설정 변경용)',
        description_ko: 'Algolia 관리자 API 키 (인덱싱·설정 변경용)',
        optional: true,
      },
    ],
    domain: 'business',
    subcategory: 'search-discovery',
    popularity_score: 82,
    difficulty_level: 'intermediate',
    tags: ['search', 'full-text', 'instant-search', 'autocomplete', 'analytics', 'ai', 'recommendation', '알골리아', '검색'],
    alternatives: ['meilisearch'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'angular', 'svelte', 'nuxt', 'gatsby'],
      language: ['javascript', 'typescript', 'python', 'ruby', 'php', 'java', 'go', 'csharp', 'swift', 'kotlin'],
    },
    official_sdks: {
      javascript: 'https://github.com/algolia/algoliasearch-client-javascript',
      react: 'https://github.com/algolia/react-instantsearch',
      python: 'https://github.com/algolia/algoliasearch-client-python',
      php: 'https://github.com/algolia/algoliasearch-client-php',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 25,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$50~$200',
      enterprise: '$500+',
    },
  },

  // -----------------------------------------------------------------------
  // 5. Sanity
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.sanity,
    name: 'Sanity',
    slug: 'sanity',
    category: 'cms',
    description:
      '구조화된 콘텐츠를 실시간으로 관리할 수 있는 헤드리스 CMS로, 커스터마이징 가능한 Sanity Studio와 GROQ 쿼리 언어를 제공합니다.',
    description_ko:
      '구조화된 콘텐츠를 실시간으로 관리할 수 있는 헤드리스 CMS로, 커스터마이징 가능한 Sanity Studio와 GROQ 쿼리 언어를 제공합니다.',
    icon_url: null,
    website_url: 'https://www.sanity.io',
    docs_url: 'https://www.sanity.io/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '3명 유저, 10GB 대역폭, 500K API CDN 요청/월',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Growth', price: '$15/유저/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_SANITY_PROJECT_ID',
        public: true,
        description: 'Sanity 프로젝트 ID',
        description_ko: 'Sanity 프로젝트 ID',
      },
      {
        name: 'NEXT_PUBLIC_SANITY_DATASET',
        public: true,
        description: 'Sanity 데이터셋 이름 (기본: production)',
        description_ko: 'Sanity 데이터셋 이름 (기본: production)',
        optional: true,
      },
      {
        name: 'SANITY_API_TOKEN',
        public: false,
        description: 'Sanity API 읽기/쓰기 토큰',
        description_ko: 'Sanity API 읽기/쓰기 토큰',
        optional: true,
      },
    ],
    domain: 'business',
    subcategory: 'headless-cms',
    popularity_score: 78,
    difficulty_level: 'intermediate',
    tags: ['cms', 'headless', 'content', 'groq', 'studio', 'structured-content', 'real-time', '새니티', 'CMS'],
    alternatives: ['contentful', 'strapi'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'nuxt', 'gatsby', 'svelte', 'astro', 'remix'],
      language: ['javascript', 'typescript', 'python', 'ruby', 'php', 'go'],
    },
    official_sdks: {
      javascript: 'https://github.com/sanity-io/client',
      next: 'https://github.com/sanity-io/next-sanity',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 30,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$15~$75',
      enterprise: '$200+',
    },
  },

  // -----------------------------------------------------------------------
  // 6. GA4 (Google Analytics)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.ga4,
    name: 'GA4 (Google Analytics)',
    slug: 'ga4',
    category: 'analytics',
    description:
      'Google이 제공하는 무료 웹·앱 분석 도구로, 이벤트 기반 데이터 수집과 머신러닝 기반 인사이트를 제공합니다.',
    description_ko:
      'Google이 제공하는 무료 웹·앱 분석 도구로, 이벤트 기반 데이터 수집과 머신러닝 기반 인사이트를 제공합니다.',
    icon_url: null,
    website_url: 'https://analytics.google.com',
    docs_url: 'https://developers.google.com/analytics',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 (대부분의 기능 포함), BigQuery 연동 무료',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Analytics 360', price: '$50,000+/년' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
        public: true,
        description: 'GA4 측정 ID (G-XXXXXXXXXX 형식)',
        description_ko: 'GA4 측정 ID (G-XXXXXXXXXX 형식)',
      },
    ],
    domain: 'business',
    subcategory: 'web-analytics',
    popularity_score: 97,
    difficulty_level: 'beginner',
    tags: ['analytics', 'web', 'app', 'google', 'tracking', 'event', 'conversion', 'report', '구글 애널리틱스', '분석'],
    alternatives: ['posthog', 'mixpanel', 'plausible'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'angular', 'svelte', 'nuxt', 'gatsby', 'astro'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      javascript: 'https://github.com/analytics-next/gtag.js',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$0',
      enterprise: '$50,000+/년',
    },
  },

  // -----------------------------------------------------------------------
  // 7. Upstash Redis
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.upstash_redis,
    name: 'Upstash Redis',
    slug: 'upstash-redis',
    category: 'cache',
    description:
      'REST API 기반의 서버리스 Redis로, 엣지 환경과 서버리스 함수에서 최적화된 글로벌 캐시·세션·레이트리밋 기능을 제공합니다.',
    description_ko:
      'REST API 기반의 서버리스 Redis로, 엣지 환경과 서버리스 함수에서 최적화된 글로벌 캐시·세션·레이트리밋 기능을 제공합니다.',
    icon_url: null,
    website_url: 'https://upstash.com',
    docs_url: 'https://upstash.com/docs/redis',
    pricing_info: {
      free_tier: true,
      free_tier_details: '일 10,000 커맨드, 256MB 스토리지',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pay-as-you-go', price: '$0.2/100K 커맨드' },
        { name: 'Pro 2K', price: '$280/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'UPSTASH_REDIS_REST_URL',
        public: false,
        description: 'Upstash Redis REST API URL',
        description_ko: 'Upstash Redis REST API URL',
      },
      {
        name: 'UPSTASH_REDIS_REST_TOKEN',
        public: false,
        description: 'Upstash Redis REST API 토큰',
        description_ko: 'Upstash Redis REST API 토큰',
        optional: true,
      },
    ],
    domain: 'backend',
    subcategory: 'cache-store',
    popularity_score: 76,
    difficulty_level: 'beginner',
    tags: ['redis', 'cache', 'serverless', 'edge', 'rate-limit', 'session', 'rest-api', '업스태시', '레디스', '캐시'],
    alternatives: ['vercel', 'cloudflare'],
    compatibility: {
      framework: ['next', 'nuxt', 'remix', 'express', 'fastify', 'hono'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust'],
    },
    official_sdks: {
      javascript: 'https://github.com/upstash/upstash-redis',
      python: 'https://github.com/upstash/redis-py',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$10~$50',
      enterprise: '$280+',
    },
  },

  // -----------------------------------------------------------------------
  // 8. Cloudflare
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.cloudflare,
    name: 'Cloudflare',
    slug: 'cloudflare',
    category: 'cdn',
    description:
      '글로벌 CDN, DNS, DDoS 보호, WAF, Workers(엣지 컴퓨팅), R2 스토리지 등 종합 인프라 서비스를 제공하는 플랫폼입니다.',
    description_ko:
      '글로벌 CDN, DNS, DDoS 보호, WAF, Workers(엣지 컴퓨팅), R2 스토리지 등 종합 인프라 서비스를 제공하는 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://www.cloudflare.com',
    docs_url: 'https://developers.cloudflare.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무제한 CDN 대역폭, Workers 일 100,000건 요청, R2 10GB 스토리지',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$20/월' },
        { name: 'Business', price: '$200/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'CLOUDFLARE_API_TOKEN',
        public: false,
        description: 'Cloudflare API 토큰',
        description_ko: 'Cloudflare API 토큰',
      },
      {
        name: 'CLOUDFLARE_ACCOUNT_ID',
        public: false,
        description: 'Cloudflare 계정 ID',
        description_ko: 'Cloudflare 계정 ID',
        optional: true,
      },
    ],
    domain: 'infrastructure',
    subcategory: 'cdn-security',
    popularity_score: 93,
    difficulty_level: 'intermediate',
    tags: ['cdn', 'dns', 'security', 'edge', 'workers', 'r2', 'ddos', 'waf', 'ssl', '클라우드플레어', 'CDN'],
    alternatives: ['vercel', 'flyio', 'render'],
    compatibility: {
      framework: ['next', 'nuxt', 'remix', 'astro', 'hono', 'express'],
      language: ['javascript', 'typescript', 'rust', 'python', 'go'],
    },
    official_sdks: {
      javascript: 'https://github.com/cloudflare/workers-sdk',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$20~$50',
      enterprise: '$200+',
    },
  },

  // -----------------------------------------------------------------------
  // 9. Fly.io
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.flyio,
    name: 'Fly.io',
    slug: 'flyio',
    category: 'deploy',
    description:
      'Docker 컨테이너를 전 세계 엣지 리전에 빠르게 배포할 수 있는 클라우드 플랫폼으로, Postgres·Redis 등 매니지드 서비스도 제공합니다.',
    description_ko:
      'Docker 컨테이너를 전 세계 엣지 리전에 빠르게 배포할 수 있는 클라우드 플랫폼으로, Postgres·Redis 등 매니지드 서비스도 제공합니다.',
    icon_url: null,
    website_url: 'https://fly.io',
    docs_url: 'https://fly.io/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '3개 공유 CPU VM, 256MB RAM, 3GB 볼륨 스토리지',
      plans: [
        { name: 'Hobby (Free)', price: '$0/월' },
        { name: 'Launch', price: '종량제 (VM 시간 기준)' },
        { name: 'Scale', price: '볼륨 + 전용 VM 기준' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'FLY_API_TOKEN',
        public: false,
        description: 'Fly.io API 토큰',
        description_ko: 'Fly.io API 토큰',
      },
    ],
    domain: 'infrastructure',
    subcategory: 'container-hosting',
    popularity_score: 72,
    difficulty_level: 'intermediate',
    tags: ['deploy', 'container', 'docker', 'edge', 'global', 'postgres', 'redis', 'vm', '플라이', '배포'],
    alternatives: ['render', 'railway', 'vercel'],
    compatibility: {
      framework: ['next', 'remix', 'express', 'fastify', 'django', 'rails', 'phoenix'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust', 'ruby', 'elixir'],
    },
    official_sdks: {
      cli: 'https://github.com/superfly/flyctl',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 20,
    monthly_cost_estimate: {
      starter: '$0~$5',
      growth: '$20~$100',
      enterprise: '$200+',
    },
  },

  // -----------------------------------------------------------------------
  // 10. Datadog
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.datadog,
    name: 'Datadog',
    slug: 'datadog',
    category: 'logging',
    description:
      '인프라 모니터링, APM, 로그 관리, 실시간 대시보드, 알림을 통합 제공하는 클라우드 관측 플랫폼입니다.',
    description_ko:
      '인프라 모니터링, APM, 로그 관리, 실시간 대시보드, 알림을 통합 제공하는 클라우드 관측 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://www.datadoghq.com',
    docs_url: 'https://docs.datadoghq.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '5개 호스트 인프라 모니터링, 1일 로그 보관',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$15/호스트/월' },
        { name: 'Enterprise', price: '$23/호스트/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'DD_API_KEY',
        public: false,
        description: 'Datadog API 키',
        description_ko: 'Datadog API 키',
      },
      {
        name: 'DD_APP_KEY',
        public: false,
        description: 'Datadog 애플리케이션 키',
        description_ko: 'Datadog 애플리케이션 키',
        optional: true,
      },
      {
        name: 'DD_SITE',
        public: false,
        description: 'Datadog 사이트 (예: datadoghq.com)',
        description_ko: 'Datadog 사이트 (예: datadoghq.com)',
        optional: true,
      },
    ],
    domain: 'observability',
    subcategory: 'monitoring-apm',
    popularity_score: 90,
    difficulty_level: 'advanced',
    tags: ['monitoring', 'apm', 'logging', 'metrics', 'dashboard', 'alerting', 'tracing', 'infrastructure', '데이터독', '모니터링'],
    alternatives: ['sentry', 'logrocket', 'posthog'],
    compatibility: {
      framework: ['next', 'express', 'django', 'rails', 'spring', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go', 'java', 'ruby', 'csharp', 'php'],
    },
    official_sdks: {
      javascript: 'https://github.com/DataDog/dd-trace-js',
      python: 'https://github.com/DataDog/dd-trace-py',
      go: 'https://github.com/DataDog/dd-trace-go',
      java: 'https://github.com/DataDog/dd-trace-java',
    },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 30,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$50~$300',
      enterprise: '$500+',
    },
  },

  // -----------------------------------------------------------------------
  // 11. Mixpanel
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.mixpanel,
    name: 'Mixpanel',
    slug: 'mixpanel',
    category: 'analytics',
    description:
      '이벤트 기반 제품 분석 플랫폼으로, 유저 행동 추적·퍼널 분석·리텐션 분석·A/B 테스트 기능을 제공합니다.',
    description_ko:
      '이벤트 기반 제품 분석 플랫폼으로, 유저 행동 추적·퍼널 분석·리텐션 분석·A/B 테스트 기능을 제공합니다.',
    icon_url: null,
    website_url: 'https://mixpanel.com',
    docs_url: 'https://docs.mixpanel.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 20M 이벤트 무료, 무제한 데이터 보관',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Growth', price: '$20/월~' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_MIXPANEL_TOKEN',
        public: true,
        description: 'Mixpanel 프로젝트 토큰',
        description_ko: 'Mixpanel 프로젝트 토큰',
      },
    ],
    domain: 'business',
    subcategory: 'product-analytics',
    popularity_score: 80,
    difficulty_level: 'beginner',
    tags: ['analytics', 'product', 'funnel', 'retention', 'cohort', 'ab-test', 'event-tracking', '믹스패널', '분석'],
    alternatives: ['posthog', 'ga4', 'plausible'],
    compatibility: {
      framework: ['next', 'react', 'react-native', 'vue', 'angular', 'svelte', 'flutter'],
      language: ['javascript', 'typescript', 'python', 'ruby', 'java', 'swift', 'kotlin'],
    },
    official_sdks: {
      javascript: 'https://github.com/mixpanel/mixpanel-js',
      'react-native': 'https://github.com/mixpanel/mixpanel-react-native',
      python: 'https://github.com/mixpanel/mixpanel-python',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$20~$100',
      enterprise: '$500+',
    },
  },

  // -----------------------------------------------------------------------
  // 12. Contentful
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.contentful,
    name: 'Contentful',
    slug: 'contentful',
    category: 'cms',
    description:
      '디지털 콘텐츠를 API 우선으로 관리하는 엔터프라이즈급 헤드리스 CMS로, 다양한 채널에 콘텐츠를 전달할 수 있습니다.',
    description_ko:
      '디지털 콘텐츠를 API 우선으로 관리하는 엔터프라이즈급 헤드리스 CMS로, 다양한 채널에 콘텐츠를 전달할 수 있습니다.',
    icon_url: null,
    website_url: 'https://www.contentful.com',
    docs_url: 'https://www.contentful.com/developers/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '5명 유저, 1 스페이스, 25K 레코드, 2M API 호출/월',
      plans: [
        { name: 'Community (Free)', price: '$0/월' },
        { name: 'Team', price: '$300/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'CONTENTFUL_SPACE_ID',
        public: false,
        description: 'Contentful 스페이스 ID',
        description_ko: 'Contentful 스페이스 ID',
      },
      {
        name: 'CONTENTFUL_ACCESS_TOKEN',
        public: false,
        description: 'Contentful Content Delivery API 토큰',
        description_ko: 'Contentful Content Delivery API 토큰',
        optional: true,
      },
      {
        name: 'CONTENTFUL_PREVIEW_TOKEN',
        public: false,
        description: 'Contentful Content Preview API 토큰',
        description_ko: 'Contentful Content Preview API 토큰',
        optional: true,
      },
    ],
    domain: 'business',
    subcategory: 'headless-cms',
    popularity_score: 80,
    difficulty_level: 'intermediate',
    tags: ['cms', 'headless', 'content', 'api-first', 'enterprise', 'graphql', 'rest', '컨텐트풀', 'CMS'],
    alternatives: ['sanity', 'strapi'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'nuxt', 'gatsby', 'angular', 'svelte', 'astro'],
      language: ['javascript', 'typescript', 'python', 'ruby', 'java', 'php', 'csharp'],
    },
    official_sdks: {
      javascript: 'https://github.com/contentful/contentful.js',
      'rich-text': 'https://github.com/contentful/rich-text',
      python: 'https://github.com/contentful/contentful.py',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 25,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$300',
      enterprise: '$1,000+',
    },
  },

  // -----------------------------------------------------------------------
  // 13. Meilisearch
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.meilisearch,
    name: 'Meilisearch',
    slug: 'meilisearch',
    category: 'search',
    description:
      '빠르고 직관적인 오픈소스 검색 엔진으로, 타이포 허용(typo-tolerance)과 즉시 검색 결과를 제공하며 셀프 호스팅이 가능합니다.',
    description_ko:
      '빠르고 직관적인 오픈소스 검색 엔진으로, 타이포 허용(typo-tolerance)과 즉시 검색 결과를 제공하며 셀프 호스팅이 가능합니다.',
    icon_url: null,
    website_url: 'https://www.meilisearch.com',
    docs_url: 'https://www.meilisearch.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Meilisearch Cloud: 100K 문서, 10K 검색/월 무료',
      plans: [
        { name: 'Build (Free)', price: '$0/월' },
        { name: 'Pro', price: '$30/월~' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'MEILISEARCH_HOST',
        public: false,
        description: 'Meilisearch 호스트 URL',
        description_ko: 'Meilisearch 호스트 URL',
      },
      {
        name: 'MEILISEARCH_ADMIN_API_KEY',
        public: false,
        description: 'Meilisearch 관리자 API 키',
        description_ko: 'Meilisearch 관리자 API 키',
        optional: true,
      },
      {
        name: 'NEXT_PUBLIC_MEILISEARCH_SEARCH_API_KEY',
        public: true,
        description: 'Meilisearch 검색 전용 API 키 (프론트엔드용)',
        description_ko: 'Meilisearch 검색 전용 API 키 (프론트엔드용)',
        optional: true,
      },
    ],
    domain: 'business',
    subcategory: 'search-engine',
    popularity_score: 68,
    difficulty_level: 'beginner',
    tags: ['search', 'open-source', 'typo-tolerance', 'instant-search', 'self-hosted', 'full-text', '메일리서치', '검색'],
    alternatives: ['algolia'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'angular', 'svelte', 'nuxt', 'rails'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust', 'ruby', 'php', 'java', 'swift'],
    },
    official_sdks: {
      javascript: 'https://github.com/meilisearch/meilisearch-js',
      react: 'https://github.com/meilisearch/meilisearch-react',
      python: 'https://github.com/meilisearch/meilisearch-python',
      go: 'https://github.com/meilisearch/meilisearch-go',
      rust: 'https://github.com/meilisearch/meilisearch-rust',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$30~$100',
      enterprise: '$300+',
    },
  },

  // -----------------------------------------------------------------------
  // 14. Pusher
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.pusher,
    name: 'Pusher',
    slug: 'pusher',
    category: 'push',
    description:
      '실시간 WebSocket 메시징과 푸시 알림을 손쉽게 구현할 수 있는 플랫폼으로, Channels와 Beams 서비스를 제공합니다.',
    description_ko:
      '실시간 WebSocket 메시징과 푸시 알림을 손쉽게 구현할 수 있는 플랫폼으로, Channels와 Beams 서비스를 제공합니다.',
    icon_url: null,
    website_url: 'https://pusher.com',
    docs_url: 'https://pusher.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '200 동시 접속, 200K 메시지/일, 무제한 채널',
      plans: [
        { name: 'Sandbox (Free)', price: '$0/월' },
        { name: 'Startup', price: '$49/월' },
        { name: 'Pro', price: '$99/월' },
        { name: 'Business', price: '$299/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'PUSHER_APP_ID',
        public: false,
        description: 'Pusher 앱 ID',
        description_ko: 'Pusher 앱 ID',
      },
      {
        name: 'NEXT_PUBLIC_PUSHER_APP_KEY',
        public: true,
        description: 'Pusher 앱 키 (프론트엔드용)',
        description_ko: 'Pusher 앱 키 (프론트엔드용)',
        optional: true,
      },
      {
        name: 'PUSHER_APP_SECRET',
        public: false,
        description: 'Pusher 앱 시크릿',
        description_ko: 'Pusher 앱 시크릿',
        optional: true,
      },
      {
        name: 'NEXT_PUBLIC_PUSHER_CLUSTER',
        public: true,
        description: 'Pusher 클러스터 (예: ap3)',
        description_ko: 'Pusher 클러스터 (예: ap3)',
        optional: true,
      },
    ],
    domain: 'communication',
    subcategory: 'realtime-messaging',
    popularity_score: 70,
    difficulty_level: 'beginner',
    tags: ['realtime', 'websocket', 'push', 'channels', 'messaging', 'presence', 'pub-sub', '푸셔', '실시간'],
    alternatives: ['onesignal', 'twilio'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'angular', 'svelte', 'express', 'laravel', 'rails'],
      language: ['javascript', 'typescript', 'python', 'ruby', 'php', 'java', 'go', 'csharp'],
    },
    official_sdks: {
      javascript: 'https://github.com/pusher/pusher-js',
      'node-server': 'https://github.com/pusher/pusher-http-node',
      python: 'https://github.com/pusher/pusher-http-python',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$49~$99',
      enterprise: '$299+',
    },
  },

  // -----------------------------------------------------------------------
  // 15. Trigger.dev
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.trigger_dev,
    name: 'Trigger.dev',
    slug: 'trigger-dev',
    category: 'scheduling',
    description:
      'TypeScript 기반 백그라운드 작업 프레임워크로, 장기 실행 태스크·스케줄링·이벤트 기반 워크플로우를 서버리스 환경에서 실행합니다.',
    description_ko:
      'TypeScript 기반 백그라운드 작업 프레임워크로, 장기 실행 태스크·스케줄링·이벤트 기반 워크플로우를 서버리스 환경에서 실행합니다.',
    icon_url: null,
    website_url: 'https://trigger.dev',
    docs_url: 'https://trigger.dev/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 50,000 실행, 동시 실행 5개',
      plans: [
        { name: 'Hobby (Free)', price: '$0/월' },
        { name: 'Pro', price: '$30/월~' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'TRIGGER_API_KEY',
        public: false,
        description: 'Trigger.dev API 키',
        description_ko: 'Trigger.dev API 키',
      },
      {
        name: 'TRIGGER_API_URL',
        public: false,
        description: 'Trigger.dev API URL (셀프 호스팅 시)',
        description_ko: 'Trigger.dev API URL (셀프 호스팅 시)',
        optional: true,
      },
    ],
    domain: 'integration',
    subcategory: 'background-jobs',
    popularity_score: 62,
    difficulty_level: 'intermediate',
    tags: ['background-jobs', 'scheduling', 'cron', 'queue', 'serverless', 'typescript', 'workflow', 'event-driven', '트리거', '백그라운드'],
    alternatives: ['inngest', 'bullmq'],
    compatibility: {
      framework: ['next', 'remix', 'express', 'fastify', 'hono'],
      language: ['typescript', 'javascript'],
    },
    official_sdks: {
      typescript: 'https://github.com/triggerdotdev/trigger.dev',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$30~$100',
      enterprise: '$300+',
    },
  },

  // -----------------------------------------------------------------------
  // 16. LaunchDarkly
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.launchdarkly,
    name: 'LaunchDarkly',
    slug: 'launchdarkly',
    category: 'feature_flags',
    description:
      '피처 플래그 관리 플랫폼으로, 안전한 점진적 배포·A/B 테스트·타게팅·실험을 코드 변경 없이 수행할 수 있습니다.',
    description_ko:
      '피처 플래그 관리 플랫폼으로, 안전한 점진적 배포·A/B 테스트·타게팅·실험을 코드 변경 없이 수행할 수 있습니다.',
    icon_url: null,
    website_url: 'https://launchdarkly.com',
    docs_url: 'https://docs.launchdarkly.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '14일 무료 체험, Starter 플랜 제한적 무료',
      plans: [
        { name: 'Developer', price: '$0/월 (1인)' },
        { name: 'Foundation', price: '$8.33/시트/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'LAUNCHDARKLY_SDK_KEY',
        public: false,
        description: 'LaunchDarkly 서버사이드 SDK 키',
        description_ko: 'LaunchDarkly 서버사이드 SDK 키',
      },
      {
        name: 'NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID',
        public: true,
        description: 'LaunchDarkly 클라이언트사이드 ID',
        description_ko: 'LaunchDarkly 클라이언트사이드 ID',
        optional: true,
      },
    ],
    domain: 'observability',
    subcategory: 'feature-management',
    popularity_score: 74,
    difficulty_level: 'intermediate',
    tags: ['feature-flag', 'ab-test', 'progressive-delivery', 'targeting', 'experiment', 'rollout', '런치다클리', '피처플래그'],
    alternatives: ['posthog'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'angular', 'svelte', 'express', 'django', 'rails', 'spring'],
      language: ['javascript', 'typescript', 'python', 'go', 'java', 'ruby', 'csharp', 'php', 'rust'],
    },
    official_sdks: {
      javascript: 'https://github.com/launchdarkly/js-core',
      react: 'https://github.com/launchdarkly/react-client-sdk',
      node: 'https://github.com/launchdarkly/node-server-sdk',
      python: 'https://github.com/launchdarkly/python-server-sdk',
      go: 'https://github.com/launchdarkly/go-server-sdk',
    },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 20,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$50~$200',
      enterprise: '$500+',
    },
  },

  // -----------------------------------------------------------------------
  // 17. Groq
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.groq,
    name: 'Groq',
    slug: 'groq',
    category: 'ai',
    description:
      'LPU(Language Processing Unit) 기반의 초고속 LLM 추론 API로, Llama·Mixtral 등 오픈소스 모델을 매우 빠른 속도로 실행합니다.',
    description_ko:
      'LPU(Language Processing Unit) 기반의 초고속 LLM 추론 API로, Llama·Mixtral 등 오픈소스 모델을 매우 빠른 속도로 실행합니다.',
    icon_url: null,
    website_url: 'https://groq.com',
    docs_url: 'https://console.groq.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '분당 30 요청, 일 14,400 요청 (모델별 상이)',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pay-as-you-go', price: '토큰당 과금 (모델별 상이)' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'GROQ_API_KEY',
        public: false,
        description: 'Groq API 키',
        description_ko: 'Groq API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'llm-inference',
    popularity_score: 70,
    difficulty_level: 'beginner',
    tags: ['ai', 'llm', 'inference', 'fast', 'open-source-model', 'llama', 'mixtral', 'lpu', '그로크', 'AI', '추론'],
    alternatives: ['openai', 'anthropic'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go'],
    },
    official_sdks: {
      javascript: 'https://github.com/groq/groq-typescript',
      python: 'https://github.com/groq/groq-python',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$10~$50',
      enterprise: '$200+',
    },
  },

  // -----------------------------------------------------------------------
  // 18. Render
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.render,
    name: 'Render',
    slug: 'render',
    category: 'deploy',
    description:
      '웹 서비스, 정적 사이트, 크론 작업, Postgres/Redis를 손쉽게 배포할 수 있는 클라우드 호스팅 플랫폼입니다.',
    description_ko:
      '웹 서비스, 정적 사이트, 크론 작업, Postgres/Redis를 손쉽게 배포할 수 있는 클라우드 호스팅 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://render.com',
    docs_url: 'https://docs.render.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '정적 사이트 무제한, 웹 서비스 750시간/월 무료',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Individual', price: '$7/서비스/월~' },
        { name: 'Team', price: '$19/월~' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'RENDER_API_KEY',
        public: false,
        description: 'Render API 키',
        description_ko: 'Render API 키',
      },
    ],
    domain: 'infrastructure',
    subcategory: 'cloud-hosting',
    popularity_score: 73,
    difficulty_level: 'beginner',
    tags: ['deploy', 'hosting', 'cloud', 'postgres', 'redis', 'static-site', 'docker', 'cron', '렌더', '배포'],
    alternatives: ['flyio', 'railway', 'vercel'],
    compatibility: {
      framework: ['next', 'express', 'django', 'rails', 'flask', 'fastify', 'spring'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust', 'ruby', 'java', 'elixir'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$7~$50',
      enterprise: '$100+',
    },
  },

  // -----------------------------------------------------------------------
  // 19. LogRocket
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.logrocket,
    name: 'LogRocket',
    slug: 'logrocket',
    category: 'logging',
    description:
      '세션 리플레이, 에러 추적, 프론트엔드 성능 모니터링을 통합 제공하는 사용자 경험 분석 플랫폼입니다.',
    description_ko:
      '세션 리플레이, 에러 추적, 프론트엔드 성능 모니터링을 통합 제공하는 사용자 경험 분석 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://logrocket.com',
    docs_url: 'https://docs.logrocket.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 1,000 세션, 1개월 데이터 보관',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Team', price: '$69/월~' },
        { name: 'Professional', price: '$295/월~' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_LOGROCKET_APP_ID',
        public: true,
        description: 'LogRocket 앱 ID (프로젝트slug/앱ID 형식)',
        description_ko: 'LogRocket 앱 ID (프로젝트slug/앱ID 형식)',
      },
    ],
    domain: 'observability',
    subcategory: 'session-replay',
    popularity_score: 65,
    difficulty_level: 'beginner',
    tags: ['session-replay', 'error-tracking', 'frontend', 'performance', 'ux', 'logging', 'monitoring', '로그로켓', '모니터링'],
    alternatives: ['sentry', 'datadog', 'posthog'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'angular', 'svelte', 'remix'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      javascript: 'https://github.com/LogRocket/logrocket',
      react: 'https://github.com/LogRocket/logrocket-react',
    },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$69~$150',
      enterprise: '$295+',
    },
  },

  // -----------------------------------------------------------------------
  // 20. Playwright
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.playwright,
    name: 'Playwright',
    slug: 'playwright',
    category: 'testing',
    description:
      'Microsoft가 개발한 크로스 브라우저 E2E 테스트 프레임워크로, Chromium·Firefox·WebKit을 단일 API로 자동화합니다.',
    description_ko:
      'Microsoft가 개발한 크로스 브라우저 E2E 테스트 프레임워크로, Chromium·Firefox·WebKit을 단일 API로 자동화합니다.',
    icon_url: null,
    website_url: 'https://playwright.dev',
    docs_url: 'https://playwright.dev/docs/intro',
    pricing_info: {
      free_tier: true,
      free_tier_details: '완전 무료 오픈소스',
      plans: [{ name: 'Open Source', price: '$0 (무료)' }],
    },
    required_env_vars: [
      {
        name: 'PLAYWRIGHT_BASE_URL',
        public: false,
        description: '테스트 대상 기본 URL',
        description_ko: '테스트 대상 기본 URL',
      },
    ],
    domain: 'devtools',
    subcategory: 'e2e-testing',
    popularity_score: 85,
    difficulty_level: 'intermediate',
    tags: ['testing', 'e2e', 'browser', 'automation', 'cross-browser', 'ci', 'microsoft', 'open-source', '플레이라이트', '테스트'],
    alternatives: ['cypress'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'angular', 'svelte', 'nuxt', 'remix', 'astro'],
      language: ['javascript', 'typescript', 'python', 'java', 'csharp'],
    },
    official_sdks: {
      javascript: 'https://github.com/microsoft/playwright',
      python: 'https://github.com/microsoft/playwright-python',
      java: 'https://github.com/microsoft/playwright-java',
      csharp: 'https://github.com/microsoft/playwright-dotnet',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$0',
      enterprise: '$0',
    },
  },

  // -----------------------------------------------------------------------
  // 21. Slack API
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.slack_api,
    name: 'Slack API',
    slug: 'slack-api',
    category: 'chat',
    description:
      'Slack 워크스페이스와 연동하는 봇·앱을 만들 수 있는 API로, 메시지 전송·이벤트 수신·슬래시 커맨드 등을 지원합니다.',
    description_ko:
      'Slack 워크스페이스와 연동하는 봇·앱을 만들 수 있는 API로, 메시지 전송·이벤트 수신·슬래시 커맨드 등을 지원합니다.',
    icon_url: null,
    website_url: 'https://api.slack.com',
    docs_url: 'https://api.slack.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'API 사용 자체는 무료, Slack 워크스페이스 플랜에 따라 기능 제한',
      plans: [
        { name: 'Free (Slack)', price: '$0/월' },
        { name: 'Pro (Slack)', price: '$8.75/유저/월' },
        { name: 'Business+ (Slack)', price: '$12.50/유저/월' },
        { name: 'Enterprise Grid', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'SLACK_BOT_TOKEN',
        public: false,
        description: 'Slack 봇 OAuth 토큰 (xoxb-로 시작)',
        description_ko: 'Slack 봇 OAuth 토큰 (xoxb-로 시작)',
      },
      {
        name: 'SLACK_SIGNING_SECRET',
        public: false,
        description: 'Slack 앱 서명 시크릿 (요청 검증용)',
        description_ko: 'Slack 앱 서명 시크릿 (요청 검증용)',
        optional: true,
      },
      {
        name: 'SLACK_APP_TOKEN',
        public: false,
        description: 'Slack 앱 레벨 토큰 (Socket Mode용, xapp-로 시작)',
        description_ko: 'Slack 앱 레벨 토큰 (Socket Mode용, xapp-로 시작)',
        optional: true,
      },
    ],
    domain: 'communication',
    subcategory: 'team-messaging',
    popularity_score: 88,
    difficulty_level: 'intermediate',
    tags: ['chat', 'bot', 'messaging', 'slack', 'webhook', 'notification', 'automation', 'slash-command', '슬랙', '메시지'],
    alternatives: ['discord-api'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask', 'rails'],
      language: ['javascript', 'typescript', 'python', 'java', 'go', 'ruby'],
    },
    official_sdks: {
      javascript: 'https://github.com/slackapi/bolt-js',
      python: 'https://github.com/slackapi/bolt-python',
      java: 'https://github.com/slackapi/java-slack-sdk',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 20,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$8.75/유저',
      enterprise: '$12.50+/유저',
    },
  },

  // -----------------------------------------------------------------------
  // 22. Discord API
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.discord_api,
    name: 'Discord API',
    slug: 'discord-api',
    category: 'chat',
    description:
      'Discord 서버와 연동하는 봇·앱을 만들 수 있는 API로, 메시지·음성·이벤트·슬래시 커맨드·임베드 등을 지원합니다.',
    description_ko:
      'Discord 서버와 연동하는 봇·앱을 만들 수 있는 API로, 메시지·음성·이벤트·슬래시 커맨드·임베드 등을 지원합니다.',
    icon_url: null,
    website_url: 'https://discord.com/developers',
    docs_url: 'https://discord.com/developers/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'API 완전 무료, 봇 생성·운영 무료',
      plans: [{ name: 'Free', price: '$0/월' }],
    },
    required_env_vars: [
      {
        name: 'DISCORD_BOT_TOKEN',
        public: false,
        description: 'Discord 봇 토큰',
        description_ko: 'Discord 봇 토큰',
      },
      {
        name: 'DISCORD_CLIENT_ID',
        public: false,
        description: 'Discord 애플리케이션 클라이언트 ID',
        description_ko: 'Discord 애플리케이션 클라이언트 ID',
        optional: true,
      },
      {
        name: 'DISCORD_CLIENT_SECRET',
        public: false,
        description: 'Discord 애플리케이션 클라이언트 시크릿',
        description_ko: 'Discord 애플리케이션 클라이언트 시크릿',
        optional: true,
      },
      {
        name: 'DISCORD_PUBLIC_KEY',
        public: false,
        description: 'Discord 상호작용 검증용 퍼블릭 키',
        description_ko: 'Discord 상호작용 검증용 퍼블릭 키',
        optional: true,
      },
    ],
    domain: 'communication',
    subcategory: 'community-platform',
    popularity_score: 84,
    difficulty_level: 'intermediate',
    tags: ['chat', 'bot', 'community', 'discord', 'webhook', 'slash-command', 'voice', 'gaming', '디스코드', '메시지'],
    alternatives: ['slack-api'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'java', 'go', 'rust', 'csharp'],
    },
    official_sdks: {
      javascript: 'https://github.com/discordjs/discord.js',
      python: 'https://github.com/Rapptz/discord.py',
      java: 'https://github.com/discord-jda/JDA',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$0',
      enterprise: '$0 (호스팅 비용 별도)',
    },
  },

  // -----------------------------------------------------------------------
  // 23. Mapbox
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.mapbox,
    name: 'Mapbox',
    slug: 'mapbox',
    category: 'other',
    description:
      '커스텀 지도, 지오코딩, 경로 탐색, 위치 검색 등 위치 기반 서비스를 제공하는 지도·내비게이션 플랫폼입니다.',
    description_ko:
      '커스텀 지도, 지오코딩, 경로 탐색, 위치 검색 등 위치 기반 서비스를 제공하는 지도·내비게이션 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://www.mapbox.com',
    docs_url: 'https://docs.mapbox.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 50,000 지도 로드, 100,000 지오코딩 요청 무료',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pay-as-you-go', price: '지도 로드당 $0.002~' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN',
        public: true,
        description: 'Mapbox 퍼블릭 액세스 토큰',
        description_ko: 'Mapbox 퍼블릭 액세스 토큰',
      },
      {
        name: 'MAPBOX_SECRET_TOKEN',
        public: false,
        description: 'Mapbox 시크릿 토큰 (서버사이드 API용)',
        description_ko: 'Mapbox 시크릿 토큰 (서버사이드 API용)',
        optional: true,
      },
    ],
    domain: 'business',
    subcategory: 'maps-location',
    popularity_score: 78,
    difficulty_level: 'intermediate',
    tags: ['maps', 'geocoding', 'navigation', 'location', 'gis', 'directions', 'custom-map', '맵박스', '지도'],
    alternatives: [],
    compatibility: {
      framework: ['next', 'react', 'react-native', 'vue', 'angular', 'svelte', 'flutter'],
      language: ['javascript', 'typescript', 'python', 'java', 'swift', 'kotlin', 'csharp'],
    },
    official_sdks: {
      javascript: 'https://github.com/mapbox/mapbox-gl-js',
      'react-native': 'https://github.com/rnmapbox/maps',
      python: 'https://github.com/mapbox/mapbox-sdk-py',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$50~$200',
      enterprise: '$500+',
    },
  },

  // -----------------------------------------------------------------------
  // 24. ElevenLabs
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.elevenlabs,
    name: 'ElevenLabs',
    slug: 'elevenlabs',
    category: 'ai',
    description:
      'AI 기반 음성 합성·음성 클론 플랫폼으로, 자연스러운 텍스트-투-스피치, 음성 변환, 더빙 API를 제공합니다.',
    description_ko:
      'AI 기반 음성 합성·음성 클론 플랫폼으로, 자연스러운 텍스트-투-스피치, 음성 변환, 더빙 API를 제공합니다.',
    icon_url: null,
    website_url: 'https://elevenlabs.io',
    docs_url: 'https://elevenlabs.io/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 10,000자 무료, 3개 커스텀 음성',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Starter', price: '$5/월' },
        { name: 'Creator', price: '$22/월' },
        { name: 'Pro', price: '$99/월' },
        { name: 'Scale', price: '$330/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'ELEVENLABS_API_KEY',
        public: false,
        description: 'ElevenLabs API 키',
        description_ko: 'ElevenLabs API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'voice-synthesis',
    popularity_score: 72,
    difficulty_level: 'beginner',
    tags: ['ai', 'tts', 'voice', 'speech', 'clone', 'dubbing', 'text-to-speech', 'audio', '일레븐랩스', '음성'],
    alternatives: ['openai'],
    compatibility: {
      framework: ['next', 'react', 'express', 'fastify', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go'],
    },
    official_sdks: {
      javascript: 'https://github.com/elevenlabs/elevenlabs-js',
      python: 'https://github.com/elevenlabs/elevenlabs-python',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0~$5',
      growth: '$22~$99',
      enterprise: '$330+',
    },
  },

  // -----------------------------------------------------------------------
  // 25. Inngest
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.inngest,
    name: 'Inngest',
    slug: 'inngest',
    category: 'scheduling',
    description:
      '이벤트 기반 백그라운드 함수 플랫폼으로, 스텝 함수·재시도·스케줄링·팬아웃을 기존 코드에 쉽게 추가할 수 있습니다.',
    description_ko:
      '이벤트 기반 백그라운드 함수 플랫폼으로, 스텝 함수·재시도·스케줄링·팬아웃을 기존 코드에 쉽게 추가할 수 있습니다.',
    icon_url: null,
    website_url: 'https://www.inngest.com',
    docs_url: 'https://www.inngest.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 25,000 함수 실행, 동시 실행 5개',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Team', price: '$50/월~' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'INNGEST_EVENT_KEY',
        public: false,
        description: 'Inngest 이벤트 전송 키',
        description_ko: 'Inngest 이벤트 전송 키',
      },
      {
        name: 'INNGEST_SIGNING_KEY',
        public: false,
        description: 'Inngest 서명 키 (함수 실행 검증용)',
        description_ko: 'Inngest 서명 키 (함수 실행 검증용)',
        optional: true,
      },
    ],
    domain: 'integration',
    subcategory: 'event-driven-functions',
    popularity_score: 60,
    difficulty_level: 'intermediate',
    tags: ['background-jobs', 'event-driven', 'step-functions', 'scheduling', 'retry', 'workflow', 'serverless', '인게스트', '백그라운드'],
    alternatives: ['trigger-dev', 'bullmq'],
    compatibility: {
      framework: ['next', 'remix', 'express', 'fastify', 'hono', 'nuxt', 'sveltekit'],
      language: ['typescript', 'javascript', 'python', 'go'],
    },
    official_sdks: {
      typescript: 'https://github.com/inngest/inngest-js',
      python: 'https://github.com/inngest/inngest-py',
      go: 'https://github.com/inngest/inngestgo',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$50~$150',
      enterprise: '$300+',
    },
  },

  // -----------------------------------------------------------------------
  // 26. Strapi
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.strapi,
    name: 'Strapi',
    slug: 'strapi',
    category: 'cms',
    description:
      '오픈소스 헤드리스 CMS로, 관리자 패널을 커스터마이징하고 REST/GraphQL API를 자동 생성하며 셀프 호스팅이 가능합니다.',
    description_ko:
      '오픈소스 헤드리스 CMS로, 관리자 패널을 커스터마이징하고 REST/GraphQL API를 자동 생성하며 셀프 호스팅이 가능합니다.',
    icon_url: null,
    website_url: 'https://strapi.io',
    docs_url: 'https://docs.strapi.io',
    pricing_info: {
      free_tier: true,
      free_tier_details: '셀프 호스팅 완전 무료, Strapi Cloud: 14일 체험',
      plans: [
        { name: 'Community (Self-hosted)', price: '$0/월' },
        { name: 'Cloud Pro', price: '$29/월~' },
        { name: 'Cloud Team', price: '$99/월~' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'STRAPI_URL',
        public: true,
        description: 'Strapi 서버 URL',
        description_ko: 'Strapi 서버 URL',
      },
      {
        name: 'STRAPI_API_TOKEN',
        public: false,
        description: 'Strapi API 토큰',
        description_ko: 'Strapi API 토큰',
        optional: true,
      },
    ],
    domain: 'business',
    subcategory: 'headless-cms',
    popularity_score: 77,
    difficulty_level: 'intermediate',
    tags: ['cms', 'headless', 'open-source', 'self-hosted', 'rest', 'graphql', 'admin-panel', 'content', '스트라피', 'CMS'],
    alternatives: ['sanity', 'contentful'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'nuxt', 'gatsby', 'angular', 'svelte', 'astro'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      javascript: 'https://github.com/strapi/strapi',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 20,
    monthly_cost_estimate: {
      starter: '$0 (셀프 호스팅)',
      growth: '$29~$99',
      enterprise: '$200+',
    },
  },

  // -----------------------------------------------------------------------
  // 27. Plausible
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.plausible,
    name: 'Plausible',
    slug: 'plausible',
    category: 'analytics',
    description:
      '프라이버시 친화적인 경량 웹 분석 도구로, 쿠키 없이 방문자 통계를 수집하며 GDPR 규정을 준수합니다.',
    description_ko:
      '프라이버시 친화적인 경량 웹 분석 도구로, 쿠키 없이 방문자 통계를 수집하며 GDPR 규정을 준수합니다.',
    icon_url: null,
    website_url: 'https://plausible.io',
    docs_url: 'https://plausible.io/docs',
    pricing_info: {
      free_tier: false,
      free_tier_details: '30일 무료 체험, 셀프 호스팅 시 무료',
      plans: [
        { name: 'Growth', price: '$9/월~ (10K 페이지뷰)' },
        { name: 'Business', price: '$19/월~ (10K 페이지뷰)' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
        public: true,
        description: 'Plausible에 등록한 사이트 도메인',
        description_ko: 'Plausible에 등록한 사이트 도메인',
      },
      {
        name: 'PLAUSIBLE_API_KEY',
        public: false,
        description: 'Plausible API 키 (Stats API용)',
        description_ko: 'Plausible API 키 (Stats API용)',
        optional: true,
      },
    ],
    domain: 'business',
    subcategory: 'privacy-analytics',
    popularity_score: 58,
    difficulty_level: 'beginner',
    tags: ['analytics', 'privacy', 'gdpr', 'cookie-free', 'open-source', 'lightweight', 'self-hosted', '플로저블', '분석'],
    alternatives: ['ga4', 'posthog', 'mixpanel'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'nuxt', 'gatsby', 'astro', 'svelte', 'remix'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      'next-plugin': 'https://github.com/4lejandrito/next-plausible',
    },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$9',
      growth: '$19~$69',
      enterprise: '$150+',
    },
  },

  // -----------------------------------------------------------------------
  // 28. Cypress
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.cypress,
    name: 'Cypress',
    slug: 'cypress',
    category: 'testing',
    description:
      '프론트엔드 E2E·컴포넌트 테스트 프레임워크로, 실시간 리로드·타임트래블 디버깅·자동 대기 기능을 제공합니다.',
    description_ko:
      '프론트엔드 E2E·컴포넌트 테스트 프레임워크로, 실시간 리로드·타임트래블 디버깅·자동 대기 기능을 제공합니다.',
    icon_url: null,
    website_url: 'https://www.cypress.io',
    docs_url: 'https://docs.cypress.io',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 테스트 러너 무료, Cypress Cloud: 월 500 테스트 결과',
      plans: [
        { name: 'Open Source', price: '$0 (무료)' },
        { name: 'Starter (Cloud)', price: '$0/월 (500 결과)' },
        { name: 'Team (Cloud)', price: '$67/월' },
        { name: 'Business (Cloud)', price: '$250/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'CYPRESS_BASE_URL',
        public: false,
        description: '테스트 대상 기본 URL',
        description_ko: '테스트 대상 기본 URL',
      },
      {
        name: 'CYPRESS_RECORD_KEY',
        public: false,
        description: 'Cypress Cloud 녹화 키 (CI에서 결과 기록용)',
        description_ko: 'Cypress Cloud 녹화 키 (CI에서 결과 기록용)',
        optional: true,
      },
    ],
    domain: 'devtools',
    subcategory: 'e2e-testing',
    popularity_score: 82,
    difficulty_level: 'beginner',
    tags: ['testing', 'e2e', 'component', 'browser', 'automation', 'debug', 'ci', 'open-source', '사이프레스', '테스트'],
    alternatives: ['playwright'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'angular', 'svelte', 'nuxt'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      javascript: 'https://github.com/cypress-io/cypress',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$67',
      enterprise: '$250+',
    },
  },

  // -----------------------------------------------------------------------
  // 29. BullMQ
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.bullmq,
    name: 'BullMQ',
    slug: 'bullmq',
    category: 'queue',
    description:
      'Redis 기반의 Node.js용 고성능 작업 큐 라이브러리로, 지연 작업·반복 작업·우선순위 큐·플로우 등을 지원합니다.',
    description_ko:
      'Redis 기반의 Node.js용 고성능 작업 큐 라이브러리로, 지연 작업·반복 작업·우선순위 큐·플로우 등을 지원합니다.',
    icon_url: null,
    website_url: 'https://bullmq.io',
    docs_url: 'https://docs.bullmq.io',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 완전 무료 (Redis 인프라 비용 별도)',
      plans: [
        { name: 'Open Source', price: '$0 (무료)' },
        { name: 'BullMQ Pro', price: '$299/월~ (고급 기능)' },
      ],
    },
    required_env_vars: [
      {
        name: 'REDIS_URL',
        public: false,
        description: 'Redis 연결 URL (BullMQ 백엔드)',
        description_ko: 'Redis 연결 URL (BullMQ 백엔드)',
      },
    ],
    domain: 'integration',
    subcategory: 'job-queue',
    popularity_score: 65,
    difficulty_level: 'intermediate',
    tags: ['queue', 'redis', 'job', 'background', 'worker', 'delayed', 'repeatable', 'priority', 'open-source', '불엠큐', '큐'],
    alternatives: ['trigger-dev', 'inngest'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'nestjs', 'hono'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      javascript: 'https://github.com/taskforcesh/bullmq',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0 (+ Redis 비용)',
      growth: '$10~$50 (Redis)',
      enterprise: '$299+ (Pro 라이선스)',
    },
  },

  // -----------------------------------------------------------------------
  // 30. Shopify API
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.shopify_api,
    name: 'Shopify API',
    slug: 'shopify-api',
    category: 'ecommerce',
    description:
      'Shopify 스토어와 연동하는 앱·커스텀 스토어프론트를 구축할 수 있는 API로, Storefront·Admin·Checkout API를 제공합니다.',
    description_ko:
      'Shopify 스토어와 연동하는 앱·커스텀 스토어프론트를 구축할 수 있는 API로, Storefront·Admin·Checkout API를 제공합니다.',
    icon_url: null,
    website_url: 'https://shopify.dev',
    docs_url: 'https://shopify.dev/docs/api',
    pricing_info: {
      free_tier: true,
      free_tier_details: '개발 스토어 무료, Shopify Partners 프로그램 무료',
      plans: [
        { name: 'Basic Shopify', price: '$39/월' },
        { name: 'Shopify', price: '$105/월' },
        { name: 'Advanced', price: '$399/월' },
        { name: 'Shopify Plus', price: '$2,300/월~' },
      ],
    },
    required_env_vars: [
      {
        name: 'SHOPIFY_STORE_DOMAIN',
        public: true,
        description: 'Shopify 스토어 도메인 (예: mystore.myshopify.com)',
        description_ko: 'Shopify 스토어 도메인 (예: mystore.myshopify.com)',
      },
      {
        name: 'SHOPIFY_STOREFRONT_ACCESS_TOKEN',
        public: true,
        description: 'Shopify Storefront API 액세스 토큰',
        description_ko: 'Shopify Storefront API 액세스 토큰',
        optional: true,
      },
      {
        name: 'SHOPIFY_ADMIN_ACCESS_TOKEN',
        public: false,
        description: 'Shopify Admin API 액세스 토큰',
        description_ko: 'Shopify Admin API 액세스 토큰',
        optional: true,
      },
      {
        name: 'SHOPIFY_API_SECRET',
        public: false,
        description: 'Shopify 앱 API 시크릿 키',
        description_ko: 'Shopify 앱 API 시크릿 키',
        optional: true,
      },
    ],
    domain: 'business',
    subcategory: 'ecommerce-platform',
    popularity_score: 90,
    difficulty_level: 'intermediate',
    tags: ['ecommerce', 'shop', 'storefront', 'payment', 'cart', 'graphql', 'headless-commerce', 'shopify', '쇼피파이', '이커머스'],
    alternatives: ['stripe', 'lemonsqueezy'],
    compatibility: {
      framework: ['next', 'react', 'remix', 'hydrogen', 'vue', 'nuxt', 'angular'],
      language: ['javascript', 'typescript', 'ruby', 'python', 'php', 'java', 'go'],
    },
    official_sdks: {
      javascript: 'https://github.com/Shopify/shopify-api-js',
      hydrogen: 'https://github.com/Shopify/hydrogen',
      ruby: 'https://github.com/Shopify/shopify-api-ruby',
      python: 'https://github.com/Shopify/shopify-python-api',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 30,
    monthly_cost_estimate: {
      starter: '$39',
      growth: '$105~$399',
      enterprise: '$2,300+',
    },
  },

  // -----------------------------------------------------------------------
  // 31. Namecheap
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.namecheap,
    name: 'Namecheap',
    slug: 'namecheap',
    category: 'domain',
    description:
      '저가 도메인 등록 및 DNS 관리 서비스로, 무료 WHOIS 프라이버시 보호·도메인 이전·DNS 관리 기능을 제공합니다.',
    description_ko:
      '저가 도메인 등록 및 DNS 관리 서비스로, 무료 WHOIS 프라이버시 보호·도메인 이전·DNS 관리 기능을 제공합니다.',
    icon_url: null,
    website_url: 'https://www.namecheap.com',
    docs_url: 'https://www.namecheap.com/support/knowledgebase',
    pricing_info: {
      free_tier: false,
      free_tier_details: '무료 등급 없음 (기본 도메인 가격: .com $6.49/첫해, $14.98/연장)',
      plans: [
        { name: 'Domain Registration', price: '.com $6.49~$14.98/년' },
        { name: 'Domain Hosting Bundle', price: '$1.98~$4.98/월' },
        { name: 'Premium DNS', price: '무료' },
        { name: 'SSL Certificate', price: '$8.88/년~' },
      ],
    },
    required_env_vars: [
      {
        name: 'NAMECHEAP_API_KEY',
        public: false,
        description: 'Namecheap API 키',
        description_ko: 'Namecheap API 키',
      },
      {
        name: 'NAMECHEAP_USERNAME',
        public: false,
        description: 'Namecheap 계정 사용자명',
        description_ko: 'Namecheap 계정 사용자명',
        optional: true,
      },
    ],
    domain: 'infrastructure',
    subcategory: 'domain_registrar',
    popularity_score: 82,
    difficulty_level: 'beginner',
    tags: ['domain', 'registrar', 'dns', 'whois', 'cheap', 'transfer', 'privacy', 'bulk-registration', '네임칩', '도메인'],
    alternatives: ['godaddy', 'cloudflare-registrar', 'gabia'],
    compatibility: {
      framework: ['next', 'express', 'django', 'rails'],
      language: ['javascript', 'typescript', 'python', 'ruby', 'php'],
    },
    official_sdks: {
      javascript: 'https://github.com/Namecheap/namecheap-api-sdk-js',
      php: 'https://github.com/Namecheap/namecheap-api',
    },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0.54/월 (.com)',
      growth: '$1.25~$4.98/월',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // 32. Cloudflare Registrar
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.cloudflare_registrar,
    name: 'Cloudflare Registrar',
    slug: 'cloudflare-registrar',
    category: 'domain',
    description:
      'Cloudflare의 도메인 등록 서비스로, 마크업 없는 투명한 가격·DNS 통합·DNSSEC 자동화를 제공합니다.',
    description_ko:
      'Cloudflare의 도메인 등록 서비스로, 마크업 없는 투명한 가격·DNS 통합·DNSSEC 자동화를 제공합니다.',
    icon_url: null,
    website_url: 'https://www.cloudflare.com/products/registrar/',
    docs_url: 'https://developers.cloudflare.com/registrar/',
    pricing_info: {
      free_tier: false,
      free_tier_details: '무료 등급 없음 (마크업 없는 레지스트리 가격 청구)',
      plans: [
        { name: 'Domain Registration', price: '.com $10.46/년 (마크업 없음)' },
        { name: 'Enterprise Transfer', price: '무료 이전' },
        { name: 'DNS Management', price: '포함 (무료)' },
        { name: 'DNSSEC', price: '자동 활성화 (무료)' },
      ],
    },
    required_env_vars: [
      {
        name: 'CLOUDFLARE_API_TOKEN',
        public: false,
        description: 'Cloudflare API 토큰 (도메인 관리 권한)',
        description_ko: 'Cloudflare API 토큰 (도메인 관리 권한)',
      },
      {
        name: 'CLOUDFLARE_ZONE_ID',
        public: false,
        description: 'Cloudflare Zone ID',
        description_ko: 'Cloudflare Zone ID',
        optional: true,
      },
    ],
    domain: 'infrastructure',
    subcategory: 'domain_registrar',
    popularity_score: 75,
    difficulty_level: 'intermediate',
    tags: ['domain', 'registrar', 'dns', 'dnssec', 'cloudflare', 'transparent-pricing', 'api', 'cdn-integration', '클라우드플레어', '도메인'],
    alternatives: ['namecheap', 'godaddy'],
    compatibility: {
      framework: ['next', 'express', 'django', 'rails', 'remix'],
      language: ['javascript', 'typescript', 'python', 'ruby', 'go'],
    },
    official_sdks: {
      javascript: 'https://github.com/cloudflare/cloudflare-typescript',
      python: 'https://github.com/cloudflare/python-cloudflare',
      go: 'https://github.com/cloudflare/cloudflare-go',
    },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0.87/월 (.com)',
      growth: '$5~$20/월 (멀티 도메인)',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // 33. GoDaddy
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.godaddy,
    name: 'GoDaddy',
    slug: 'godaddy',
    category: 'domain',
    description:
      '세계 최대 도메인 등록업체로, 도메인 등록·호스팅·이메일·웹사이트 빌더·SSL 인증서를 통합 제공합니다.',
    description_ko:
      '세계 최대 도메인 등록업체로, 도메인 등록·호스팅·이메일·웹사이트 빌더·SSL 인증서를 통합 제공합니다.',
    icon_url: null,
    website_url: 'https://www.godaddy.com',
    docs_url: 'https://developer.godaddy.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '프로모션: .com 첫해 $0.01 (연장 시 $18.99)',
      plans: [
        { name: 'Domain Only', price: '.com $0.01~$18.99/년 (프로모션)' },
        { name: 'Starter Hosting', price: '$2.99~$5.99/월' },
        { name: 'Business Hosting', price: '$5.99~$9.99/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'GODADDY_API_KEY',
        public: false,
        description: 'GoDaddy API 키',
        description_ko: 'GoDaddy API 키',
      },
      {
        name: 'GODADDY_API_SECRET',
        public: false,
        description: 'GoDaddy API 시크릿 키',
        description_ko: 'GoDaddy API 시크릿 키',
        optional: true,
      },
    ],
    domain: 'infrastructure',
    subcategory: 'domain_registrar',
    popularity_score: 90,
    difficulty_level: 'beginner',
    tags: ['domain', 'registrar', 'hosting', 'builder', 'email', 'ssl', 'popular', 'all-in-one', '고대디', '도메인'],
    alternatives: ['namecheap', 'cloudflare-registrar'],
    compatibility: {
      framework: ['next', 'express', 'django', 'rails', 'wordpress'],
      language: ['javascript', 'typescript', 'python', 'ruby', 'php', 'java'],
    },
    official_sdks: {
      php: 'https://github.com/godaddy/godaddy-api-php',
      python: 'https://github.com/godaddy/godaddy-python',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0.01~$1.58/월 (프로모션)',
      growth: '$5.99~$9.99/월 (호스팅)',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // 34. Gabia (가비아)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.gabia,
    name: 'Gabia',
    slug: 'gabia',
    category: 'domain',
    description:
      '한국 도메인 등록 1위 업체로, 한국 도메인(.kr)·국제 도메인(.com 등)을 제공하며 AI 도메인 추천·웹호스팅·SSL을 지원합니다.',
    description_ko:
      '한국 도메인 등록 1위 업체로, 한국 도메인(.kr)·국제 도메인(.com 등)을 제공하며 AI 도메인 추천·웹호스팅·SSL을 지원합니다.',
    icon_url: null,
    website_url: 'https://domain.gabia.com',
    docs_url: 'https://www.gabia.com/support/documentation',
    pricing_info: {
      free_tier: false,
      free_tier_details: '무료 등급 없음 (.kr 기본: $12/년, .com 기본: $8.5/년)',
      plans: [
        { name: '.KR Domain', price: '$12/년' },
        { name: '.COM Domain', price: '$8.5/년' },
        { name: 'Web Hosting', price: '$2.5~$5/월' },
        { name: 'SSL Certificate', price: '$40~$200/년' },
      ],
    },
    required_env_vars: [
      {
        name: 'GABIA_API_KEY',
        public: false,
        description: '가비아 API 키',
        description_ko: '가비아 API 키',
      },
      {
        name: 'GABIA_ACCOUNT_ID',
        public: false,
        description: '가비아 계정 ID',
        description_ko: '가비아 계정 ID',
        optional: true,
      },
    ],
    domain: 'infrastructure',
    subcategory: 'domain_registrar',
    popularity_score: 88,
    difficulty_level: 'beginner',
    tags: ['domain', 'registrar', '.kr', 'korea', 'local', 'ai-recommendation', 'hosting', 'ssl', '가비아', '도메인'],
    alternatives: ['hosting-kr', 'dotname'],
    compatibility: {
      framework: ['next', 'express', 'django', 'rails'],
      language: ['javascript', 'typescript', 'python', 'ruby', 'php'],
    },
    official_sdks: {
      javascript: 'https://github.com/gabia/gabia-api-sdk',
      python: 'https://github.com/gabia/gabia-python-sdk',
    },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$1/월 (.kr)',
      growth: '$2.5~$5/월 (호스팅)',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // 35. HostingKR (호스팅케이알)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.hosting_kr,
    name: 'HostingKR',
    slug: 'hosting-kr',
    category: 'domain',
    description:
      '한국의 신뢰할 수 있는 도메인 등록·호스팅 서비스로, 500개 이상의 도메인 확장자·DNS 관리·웹호스팅·이메일 서비스를 제공합니다.',
    description_ko:
      '한국의 신뢰할 수 있는 도메인 등록·호스팅 서비스로, 500개 이상의 도메인 확장자·DNS 관리·웹호스팅·이메일 서비스를 제공합니다.',
    icon_url: null,
    website_url: 'https://www.hosting.kr',
    docs_url: 'https://www.hosting.kr/support',
    pricing_info: {
      free_tier: false,
      free_tier_details: '무료 등급 없음 (.kr 기본: $10~$12/년, .com 기본: $8/년)',
      plans: [
        { name: '.KR Domain', price: '$10~$12/년' },
        { name: '.COM Domain', price: '$8/년' },
        { name: 'Basic Hosting', price: '$2.5/월' },
        { name: 'Premium Hosting', price: '$5~$10/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'HOSTING_KR_API_KEY',
        public: false,
        description: '호스팅케이알 API 키',
        description_ko: '호스팅케이알 API 키',
      },
      {
        name: 'HOSTING_KR_ACCOUNT_ID',
        public: false,
        description: '호스팅케이알 계정 ID',
        description_ko: '호스팅케이알 계정 ID',
        optional: true,
      },
    ],
    domain: 'infrastructure',
    subcategory: 'domain_registrar',
    popularity_score: 78,
    difficulty_level: 'beginner',
    tags: ['domain', 'registrar', '.kr', 'korea', 'hosting', 'email', 'dns', 'local', '호스팅케이알', '도메인'],
    alternatives: ['gabia', 'dotname'],
    compatibility: {
      framework: ['next', 'express', 'django', 'rails'],
      language: ['javascript', 'typescript', 'python', 'ruby', 'php'],
    },
    official_sdks: {
      javascript: 'https://github.com/hosting-kr/hosting-kr-api',
    },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0.8~$1/월 (.kr)',
      growth: '$2.5~$5/월 (호스팅)',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // 36. DotName (닷네임)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.dotname,
    name: 'DotName',
    slug: 'dotname',
    category: 'domain',
    description:
      '국내 도메인 등록 전문 기업으로, 한국 도메인(.kr)·국제 도메인 등록·DNS 관리·무료 웹호스팅을 제공합니다.',
    description_ko:
      '국내 도메인 등록 전문 기업으로, 한국 도메인(.kr)·국제 도메인 등록·DNS 관리·무료 웹호스팅을 제공합니다.',
    icon_url: null,
    website_url: 'https://www.dotname.co.kr',
    docs_url: 'https://www.dotname.co.kr/support',
    pricing_info: {
      free_tier: true,
      free_tier_details: '도메인 등록 시 무료 웹호스팅 제공',
      plans: [
        { name: '.KR Domain', price: '$10~$12/년 + 무료 호스팅' },
        { name: '.COM Domain', price: '$8~$9/년 + 무료 호스팅' },
        { name: 'Free Hosting', price: '$0/월 (도메인 등록 포함)' },
        { name: 'Premium Add-ons', price: '$2~$10/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'DOTNAME_API_KEY',
        public: false,
        description: '닷네임 API 키',
        description_ko: '닷네임 API 키',
      },
      {
        name: 'DOTNAME_ACCOUNT_ID',
        public: false,
        description: '닷네임 계정 ID',
        description_ko: '닷네임 계정 ID',
        optional: true,
      },
    ],
    domain: 'infrastructure',
    subcategory: 'domain_registrar',
    popularity_score: 72,
    difficulty_level: 'beginner',
    tags: ['domain', 'registrar', '.kr', 'korea', 'free-hosting', 'dns', 'local', 'affordable', '닷네임', '도메인'],
    alternatives: ['gabia', 'hosting-kr'],
    compatibility: {
      framework: ['next', 'express', 'django', 'rails'],
      language: ['javascript', 'typescript', 'python', 'ruby', 'php'],
    },
    official_sdks: {
      javascript: 'https://github.com/dotname/dotname-api-js',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0/월 (무료 호스팅 포함)',
      growth: '$0.8~$1/월 (.kr 도메인)',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // 37. Google AdSense
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.google_adsense,
    name: 'Google AdSense',
    slug: 'google-adsense',
    category: 'advertising',
    description:
      'Google\'s publisher monetization platform that displays contextual banner, native, and auto ads (CPC/CPM) on websites and apps.',
    description_ko:
      '구글이 제공하는 퍼블리셔 수익화 플랫폼으로, 웹사이트·앱에 문맥형 배너·네이티브·자동 광고(CPC/CPM)를 게재할 수 있습니다.',
    icon_url: null,
    website_url: 'https://adsense.google.com',
    docs_url: 'https://support.google.com/adsense',
    pricing_info: {
      free_tier: true,
      free_tier_details: '가입 무료, 광고 수익에서 수수료 공제 (게시자에게 광고 수익의 68% 지급)',
      plans: [
        { name: 'Standard', price: '무료 (수익의 68% 지급)' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_ADSENSE_PUBLISHER_ID',
        public: true,
        description: 'AdSense Publisher ID (ca-pub-XXXXXXXXXXXXXXXX 형식)',
        description_ko: 'AdSense 게시자 ID (ca-pub-XXXXXXXXXXXXXXXX 형식)',
      },
      {
        name: 'NEXT_PUBLIC_ADSENSE_SLOT_ID',
        public: true,
        description: 'AdSense Ad Slot ID (광고 단위 ID)',
        description_ko: 'AdSense 광고 슬롯 ID (광고 단위 ID)',
        optional: true,
      },
    ],
    domain: 'business',
    subcategory: 'display_ads',
    popularity_score: 90,
    difficulty_level: 'beginner',
    tags: ['advertising', 'monetization', 'banner', 'native', 'cpc', 'cpm', 'google', 'display', '구글 애드센스', '광고', '수익화'],
    alternatives: ['kakao-adfit', 'google-ad-manager'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'nuxt', 'gatsby', 'astro', 'angular', 'svelte'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      javascript: 'https://developers.google.com/adsense/management/libraries',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 30,
    monthly_cost_estimate: {
      starter: '$0 (수익 공유)',
      growth: '$0 (수익 공유)',
      enterprise: '$0 (수익 공유)',
    },
    github_stars: null,
  },

  // -----------------------------------------------------------------------
  // 38. Kakao AdFit
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.kakao_adfit,
    name: 'Kakao AdFit',
    slug: 'kakao-adfit',
    category: 'advertising',
    description:
      'Kakao\'s Korean-exclusive ad network offering banner and native ads (CPC/CPM) with high fill rates for Korean-language content publishers.',
    description_ko:
      '카카오가 운영하는 한국 전용 광고 네트워크로, 한국어 콘텐츠 퍼블리셔를 위한 배너·네이티브 광고(CPC/CPM)를 높은 광고 충전율로 제공합니다.',
    icon_url: null,
    website_url: 'https://adfit.kakao.com',
    docs_url: 'https://adfit.kakao.com/info/guide',
    pricing_info: {
      free_tier: true,
      free_tier_details: '가입 무료, 수익 공유 방식 (광고 클릭·노출 기반 수익 지급)',
      plans: [
        { name: 'Standard', price: '무료 (수익 공유)' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_ADFIT_AD_UNIT_ID',
        public: true,
        description: 'Kakao AdFit 광고 단위 ID (DAN-XXXXXXXXXXXXXXXX 형식)',
        description_ko: 'Kakao AdFit 광고 단위 ID (DAN-XXXXXXXXXXXXXXXX 형식)',
      },
    ],
    domain: 'business',
    subcategory: 'display_ads',
    popularity_score: 72,
    difficulty_level: 'beginner',
    tags: ['advertising', 'monetization', 'banner', 'native', 'cpc', 'cpm', 'kakao', 'korea', 'display', '카카오 애드핏', '광고', '수익화'],
    alternatives: ['google-adsense', 'google-ad-manager'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'nuxt', 'gatsby', 'angular'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      javascript: 'https://adfit.kakao.com/info/guide',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 20,
    monthly_cost_estimate: {
      starter: '$0 (수익 공유)',
      growth: '$0 (수익 공유)',
      enterprise: '$0 (수익 공유)',
    },
    github_stars: null,
  },

  // -----------------------------------------------------------------------
  // 39. Criteo
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.criteo,
    name: 'Criteo',
    slug: 'criteo',
    category: 'advertising',
    description:
      'AI-powered retargeting and performance advertising platform offering banner, native, and header bidding (CPM) for e-commerce and direct-to-consumer brands.',
    description_ko:
      'AI 기반 리타겟팅 및 퍼포먼스 광고 플랫폼으로, 이커머스·DTC 브랜드를 위한 배너·네이티브·헤더 비딩(CPM) 광고를 제공합니다. 한국 법인 운영 중.',
    icon_url: null,
    website_url: 'https://www.criteo.com',
    docs_url: 'https://developers.criteo.com',
    pricing_info: {
      free_tier: false,
      free_tier_details: '최소 예산 요건 있음, 성과 기반 CPM/CPC 과금',
      plans: [
        { name: 'Self-Service', price: 'CPM 기반 (최소 예산 문의)' },
        { name: 'Managed Service', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'CRITEO_PARTNER_ID',
        public: false,
        description: 'Criteo Partner ID (광고 계정 식별자)',
        description_ko: 'Criteo 파트너 ID (광고 계정 식별자)',
      },
      {
        name: 'CRITEO_NETWORK_ID',
        public: false,
        description: 'Criteo Network ID (광고 네트워크 ID)',
        description_ko: 'Criteo 네트워크 ID (광고 네트워크 ID)',
        optional: true,
      },
    ],
    domain: 'business',
    subcategory: 'retargeting',
    popularity_score: 68,
    difficulty_level: 'intermediate',
    tags: ['advertising', 'retargeting', 'performance', 'cpm', 'header-bidding', 'ecommerce', 'programmatic', 'ai', '크리테오', '리타겟팅', '광고'],
    alternatives: ['taboola', 'amazon-aps'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'nuxt', 'angular'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      javascript: 'https://developers.criteo.com/marketing-solutions/docs/javascript-tag',
    },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 45,
    monthly_cost_estimate: {
      starter: '예산 문의',
      growth: '$500~$5,000',
      enterprise: '$5,000+',
    },
    github_stars: null,
  },

  // -----------------------------------------------------------------------
  // 40. Taboola
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.taboola,
    name: 'Taboola',
    slug: 'taboola',
    category: 'advertising',
    description:
      'Native content recommendation and sponsored content ad network (CPC) for publishers, offering widget-based discovery placements on article pages.',
    description_ko:
      '퍼블리셔를 위한 네이티브 콘텐츠 추천·스폰서드 광고 네트워크(CPC)로, 기사 페이지에 위젯 기반 디스커버리 지면을 제공합니다. 한국 진출 서비스.',
    icon_url: null,
    website_url: 'https://www.taboola.com',
    docs_url: 'https://developers.taboola.com',
    pricing_info: {
      free_tier: false,
      free_tier_details: '최소 트래픽 요건 있음 (월간 방문자 수 기준), 퍼블리셔는 수익 공유',
      plans: [
        { name: 'Publisher (수익화)', price: '수익 공유 (무료 가입)' },
        { name: 'Advertiser (광고주)', price: 'CPC 기반 (최소 예산 문의)' },
      ],
    },
    required_env_vars: [
      {
        name: 'TABOOLA_PUBLISHER_ID',
        public: true,
        description: 'Taboola Publisher ID (퍼블리셔 계정 식별자)',
        description_ko: 'Taboola 퍼블리셔 ID',
      },
      {
        name: 'TABOOLA_WIDGET_ID',
        public: true,
        description: 'Taboola Widget ID (광고 위젯 ID)',
        description_ko: 'Taboola 위젯 ID',
        optional: true,
      },
    ],
    domain: 'business',
    subcategory: 'native_ads',
    popularity_score: 62,
    difficulty_level: 'beginner',
    tags: ['advertising', 'native', 'content-recommendation', 'sponsored', 'cpc', 'widget', 'discovery', 'publisher', '타불라', '광고', '콘텐츠추천'],
    alternatives: ['criteo', 'amazon-aps'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'nuxt', 'angular', 'gatsby'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      javascript: 'https://developers.taboola.com/web-integrations/docs',
    },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 30,
    monthly_cost_estimate: {
      starter: '$0 (수익 공유)',
      growth: '$0 (수익 공유)',
      enterprise: '문의',
    },
    github_stars: null,
  },

  // -----------------------------------------------------------------------
  // 41. Amazon Publisher Services (APS)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.amazon_aps,
    name: 'Amazon Publisher Services',
    slug: 'amazon-aps',
    category: 'advertising',
    description:
      'Amazon\'s publisher monetization suite offering header bidding, display, and video ads (CPM) with access to Amazon\'s first-party demand and DSP.',
    description_ko:
      'Amazon의 퍼블리셔 수익화 솔루션으로, 헤더 비딩·디스플레이·동영상 광고(CPM)와 Amazon 퍼스트파티 수요 및 DSP 연동을 제공합니다.',
    icon_url: null,
    website_url: 'https://aps.amazon.com',
    docs_url: 'https://aps.amazon.com/aps/resources/',
    pricing_info: {
      free_tier: false,
      free_tier_details: '최소 트래픽 요건 있음, 수익 공유 방식 (Amazon이 일부 수수료 공제)',
      plans: [
        { name: 'Transparent Ad Marketplace', price: '수익 공유 (무료 가입)' },
        { name: 'Unified Ad Marketplace', price: '수익 공유' },
      ],
    },
    required_env_vars: [
      {
        name: 'APS_PUBLISHER_ID',
        public: false,
        description: 'Amazon Publisher Services Publisher ID',
        description_ko: 'Amazon Publisher Services 퍼블리셔 ID',
      },
      {
        name: 'APS_APP_ID',
        public: false,
        description: 'Amazon Publisher Services App ID (앱 식별자)',
        description_ko: 'Amazon Publisher Services 앱 ID',
        optional: true,
      },
      {
        name: 'APS_SLOT_UUID',
        public: true,
        description: 'Amazon Publisher Services Slot UUID (광고 슬롯 식별자)',
        description_ko: 'Amazon Publisher Services 슬롯 UUID',
        optional: true,
      },
    ],
    domain: 'business',
    subcategory: 'header_bidding',
    popularity_score: 58,
    difficulty_level: 'advanced',
    tags: ['advertising', 'header-bidding', 'display', 'video', 'cpm', 'amazon', 'programmatic', 'dsp', '아마존', '헤더비딩', '광고'],
    alternatives: ['criteo', 'taboola', 'google-ad-manager'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'nuxt', 'angular'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      javascript: 'https://aps.amazon.com/aps/resources/apt-integration/',
    },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 60,
    monthly_cost_estimate: {
      starter: '$0 (수익 공유)',
      growth: '$0 (수익 공유)',
      enterprise: '$0 (수익 공유)',
    },
    github_stars: null,
  },

  // -----------------------------------------------------------------------
  // 42. Google Ad Manager
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.google_ad_manager,
    name: 'Google Ad Manager',
    slug: 'google-ad-manager',
    category: 'advertising',
    description:
      'Enterprise-grade ad server and SSP (formerly DFP) for large publishers, supporting header bidding, programmatic CPM, direct deals, and video monetization.',
    description_ko:
      '대형 퍼블리셔를 위한 엔터프라이즈 광고 서버·SSP(구 DFP)로, 헤더 비딩·프로그래매틱 CPM·다이렉트 딜·동영상 수익화를 지원합니다.',
    icon_url: null,
    website_url: 'https://admanager.google.com',
    docs_url: 'https://developers.google.com/ad-manager',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Google Ad Manager 360(Small Business): 무료 (월 90M 노출 미만). 대형 퍼블리셔는 Ad Manager 360 유료',
      plans: [
        { name: 'Ad Manager (Small Business)', price: '$0/월 (월 90M 노출 이하)' },
        { name: 'Ad Manager 360', price: '문의 (대형 퍼블리셔)' },
      ],
    },
    required_env_vars: [
      {
        name: 'GAM_NETWORK_CODE',
        public: true,
        description: 'Google Ad Manager 네트워크 코드 (숫자 형식)',
        description_ko: 'Google Ad Manager 네트워크 코드 (숫자 형식)',
      },
      {
        name: 'GAM_AD_UNIT_PATH',
        public: true,
        description: 'Google Ad Manager 광고 단위 경로 (/네트워크코드/광고단위 형식)',
        description_ko: 'Google Ad Manager 광고 단위 경로 (/네트워크코드/광고단위 형식)',
        optional: true,
      },
    ],
    domain: 'business',
    subcategory: 'header_bidding',
    popularity_score: 75,
    difficulty_level: 'advanced',
    tags: ['advertising', 'ad-server', 'header-bidding', 'programmatic', 'cpm', 'google', 'dfp', 'ssp', 'video', '구글 애드매니저', '광고서버'],
    alternatives: ['google-adsense', 'amazon-aps'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'nuxt', 'angular', 'gatsby'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      javascript: 'https://developers.google.com/publisher-tag/guides/get-started',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 60,
    monthly_cost_estimate: {
      starter: '$0 (수익 공유)',
      growth: '$0 (수익 공유)',
      enterprise: '문의 (Ad Manager 360)',
    },
    github_stars: null,
  },

  // =======================================================================
  // AI Services - Phase 5 (25 services)
  // =======================================================================

  // -----------------------------------------------------------------------
  // 43. Grok (xAI)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.grok,
    name: 'Grok',
    slug: 'grok',
    category: 'ai',
    description:
      'xAI\'s high-performance LLM with 2M token context window, built-in web/X search, and code execution tools.',
    description_ko:
      'xAI의 고성능 LLM으로, 2M 토큰 컨텍스트 윈도우와 웹/X(트위터) 검색, 코드 실행 내장 도구를 제공합니다.',
    icon_url: null,
    website_url: 'https://x.ai',
    docs_url: 'https://docs.x.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: '신규 $25 무료 크레딧',
      plans: [
        { name: 'Free', price: '$25 크레딧' },
        { name: 'Pay-as-you-go', price: '토큰당 과금' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'XAI_API_KEY',
        public: false,
        description: 'xAI API key for Grok models',
        description_ko: 'xAI Grok 모델 API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'llm',
    popularity_score: 75,
    difficulty_level: 'beginner',
    tags: ['ai', 'llm', 'grok', 'xai', 'elon-musk', 'web-search', 'long-context', '그록', 'AI'],
    alternatives: ['openai', 'anthropic', 'google-gemini'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go'],
    },
    official_sdks: {
      python: 'https://github.com/xai-org/grok',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$20~$100',
      enterprise: '$500+',
    },
  },

  // -----------------------------------------------------------------------
  // 44. Mistral AI
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.mistral,
    name: 'Mistral AI',
    slug: 'mistral-ai',
    category: 'ai',
    description:
      'European open-source oriented LLM provider offering models from Nemo (lightweight) to Large (high-performance) with competitive pricing.',
    description_ko:
      '유럽 기반 오픈소스 지향 LLM 제공자로, Nemo(경량)부터 Large(고성능)까지 다양한 크기의 모델을 경쟁력 있는 가격에 제공합니다.',
    icon_url: null,
    website_url: 'https://mistral.ai',
    docs_url: 'https://docs.mistral.ai',
    pricing_info: {
      free_tier: false,
      free_tier_details: '종량제 과금',
      plans: [
        { name: 'Pay-as-you-go', price: '토큰당 과금 (Nemo $0.02/1M)' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'MISTRAL_API_KEY',
        public: false,
        description: 'Mistral AI API key',
        description_ko: 'Mistral AI API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'llm',
    popularity_score: 78,
    difficulty_level: 'beginner',
    tags: ['ai', 'llm', 'mistral', 'open-source', 'european', 'nemo', 'mixtral', '미스트랄', 'AI'],
    alternatives: ['openai', 'anthropic', 'deepseek'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go', 'java'],
    },
    official_sdks: {
      javascript: 'https://www.npmjs.com/package/@mistralai/mistralai',
      python: 'https://github.com/mistralai/client-python',
    },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$5',
      growth: '$20~$100',
      enterprise: '$500+',
    },
  },

  // -----------------------------------------------------------------------
  // 45. Cohere
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.cohere,
    name: 'Cohere',
    slug: 'cohere',
    category: 'ai',
    description:
      'Enterprise LLM optimized for RAG with 256K context window, on-premises deployment support, and fine-tuning capabilities.',
    description_ko:
      '256K 컨텍스트 윈도우와 RAG 최적화에 특화된 엔터프라이즈 LLM으로, 온프레미스 배포와 파인튜닝을 지원합니다.',
    icon_url: null,
    website_url: 'https://cohere.com',
    docs_url: 'https://docs.cohere.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 체험판 제공 (rate-limited)',
      plans: [
        { name: 'Free Trial', price: '$0/월' },
        { name: 'Production', price: '토큰당 과금' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'COHERE_API_KEY',
        public: false,
        description: 'Cohere API key',
        description_ko: 'Cohere API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'llm',
    popularity_score: 72,
    difficulty_level: 'beginner',
    tags: ['ai', 'llm', 'rag', 'enterprise', 'embeddings', 'reranking', 'fine-tuning', '코히어', 'AI'],
    alternatives: ['openai', 'anthropic', 'mistral-ai'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask', 'fastify'],
      language: ['javascript', 'typescript', 'python', 'go', 'java'],
    },
    official_sdks: {
      javascript: 'https://www.npmjs.com/package/cohere-ai',
      python: 'https://github.com/cohere-ai/cohere-python',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$50~$200',
      enterprise: '$500+',
    },
  },

  // -----------------------------------------------------------------------
  // 46. DeepSeek
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.deepseek,
    name: 'DeepSeek',
    slug: 'deepseek',
    category: 'ai',
    description:
      'Ultra-low-cost LLM API with V3 (general) and R1 (reasoning) models, up to 75% off-peak discount.',
    description_ko:
      '업계 최저가 수준의 LLM API로, V3(범용)와 R1(추론) 모델을 제공하며 오프피크 시간 최대 75% 할인됩니다.',
    icon_url: null,
    website_url: 'https://www.deepseek.com',
    docs_url: 'https://api-docs.deepseek.com',
    pricing_info: {
      free_tier: false,
      free_tier_details: '종량제 (업계 최저가)',
      plans: [
        { name: 'Pay-as-you-go', price: 'V3: $0.14/1M입력, R1: $0.55/1M입력' },
        { name: 'Off-peak', price: '최대 75% 할인' },
      ],
    },
    required_env_vars: [
      {
        name: 'DEEPSEEK_API_KEY',
        public: false,
        description: 'DeepSeek API key',
        description_ko: 'DeepSeek API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'llm',
    popularity_score: 82,
    difficulty_level: 'beginner',
    tags: ['ai', 'llm', 'deepseek', 'low-cost', 'reasoning', 'chinese', 'open-source', '딥시크', 'AI'],
    alternatives: ['openai', 'mistral-ai', 'groq'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go'],
    },
    official_sdks: {
      python: 'https://github.com/deepseek-ai/DeepSeek-V3',
    },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$1~$5',
      growth: '$10~$50',
      enterprise: '$100+',
    },
  },

  // -----------------------------------------------------------------------
  // 47. Perplexity AI
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.perplexity,
    name: 'Perplexity AI',
    slug: 'perplexity',
    category: 'ai',
    description:
      'AI-powered answer engine with real-time web search integration and citation-based accurate responses via Sonar API.',
    description_ko:
      '실시간 웹 검색과 인용 기반 정확한 답변을 제공하는 AI 검색 엔진으로, Sonar API를 통해 접근 가능합니다.',
    icon_url: null,
    website_url: 'https://www.perplexity.ai',
    docs_url: 'https://docs.perplexity.ai',
    pricing_info: {
      free_tier: false,
      free_tier_details: 'Pro 구독 시 월 $5 API 크레딧',
      plans: [
        { name: 'Sonar', price: '$1/1M 토큰' },
        { name: 'Sonar Pro', price: '$3/$15/1M 토큰' },
      ],
    },
    required_env_vars: [
      {
        name: 'PERPLEXITY_API_KEY',
        public: false,
        description: 'Perplexity Sonar API key',
        description_ko: 'Perplexity Sonar API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'ai_search',
    popularity_score: 80,
    difficulty_level: 'beginner',
    tags: ['ai', 'search', 'rag', 'web-search', 'citations', 'sonar', 'answer-engine', '퍼플렉시티', 'AI', '검색'],
    alternatives: ['openai', 'google-gemini', 'cohere'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go'],
    },
    official_sdks: {},
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$5',
      growth: '$20~$100',
      enterprise: '$200+',
    },
  },

  // -----------------------------------------------------------------------
  // 48. AI21 Labs
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.ai21_labs,
    name: 'AI21 Labs',
    slug: 'ai21-labs',
    category: 'ai',
    description:
      'Jamba model series using SSM-Transformer hybrid architecture, 2.5x faster processing at 256K context.',
    description_ko:
      'SSM-Transformer 하이브리드 아키텍처의 Jamba 모델로, 256K 컨텍스트에서 2.5배 빠른 처리 속도를 제공합니다.',
    icon_url: null,
    website_url: 'https://www.ai21.com',
    docs_url: 'https://docs.ai21.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '신규 $10 무료 크레딧',
      plans: [
        { name: 'Free', price: '$10 크레딧' },
        { name: 'Pay-as-you-go', price: 'Jamba Mini: $0.2/1M 토큰' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'AI21_API_KEY',
        public: false,
        description: 'AI21 Labs API key',
        description_ko: 'AI21 Labs API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'llm',
    popularity_score: 60,
    difficulty_level: 'beginner',
    tags: ['ai', 'llm', 'jamba', 'ssm', 'hybrid', 'long-context', 'fast', 'AI21', 'AI'],
    alternatives: ['openai', 'mistral-ai', 'cohere'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python'],
    },
    official_sdks: {
      python: 'https://github.com/AI21Labs/ai21-python',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$20~$80',
      enterprise: '$200+',
    },
  },

  // -----------------------------------------------------------------------
  // 49. Midjourney
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.midjourney,
    name: 'Midjourney',
    slug: 'midjourney',
    category: 'ai',
    description:
      'Leading AI image generation service excelling in artistic quality, color harmony, and visual consistency.',
    description_ko:
      '예술적 품질, 색상 조화, 시각적 일관성에서 최고 수준의 AI 이미지 생성 서비스입니다.',
    icon_url: null,
    website_url: 'https://www.midjourney.com',
    docs_url: 'https://docs.midjourney.com',
    pricing_info: {
      free_tier: false,
      free_tier_details: '유료 구독만 제공',
      plans: [
        { name: 'Basic', price: '$10/월' },
        { name: 'Standard', price: '$30/월' },
        { name: 'Pro', price: '$60/월' },
        { name: 'Mega', price: '$120/월' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'image_generation',
    popularity_score: 90,
    difficulty_level: 'beginner',
    tags: ['ai', 'image-generation', 'art', 'creative', 'design', 'visual', '미드저니', 'AI', '이미지'],
    alternatives: ['stability-ai', 'leonardo-ai', 'ideogram', 'gwanggo'],
    compatibility: {
      framework: [],
      language: [],
    },
    official_sdks: {},
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$10',
      growth: '$30~$60',
      enterprise: '$120',
    },
  },

  // -----------------------------------------------------------------------
  // 50. Runway ML
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.runway_ml,
    name: 'Runway ML',
    slug: 'runway-ml',
    category: 'ai',
    description:
      'AI video generation and editing platform with Gen-4 models for text-to-video, image-to-video, and Act-Two lip-sync.',
    description_ko:
      'Gen-4 모델 기반 AI 비디오 생성·편집 플랫폼으로, 텍스트→비디오, 이미지→비디오, 립싱크 등을 지원합니다.',
    icon_url: null,
    website_url: 'https://runwayml.com',
    docs_url: 'https://docs.runwayml.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 체험 크레딧 제공',
      plans: [
        { name: 'Free', price: '체험 크레딧' },
        { name: 'Standard', price: '$15/월' },
        { name: 'Pro', price: '$35/월' },
        { name: 'Unlimited', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'RUNWAY_API_KEY',
        public: false,
        description: 'Runway ML API key',
        description_ko: 'Runway ML API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'video_generation',
    popularity_score: 78,
    difficulty_level: 'beginner',
    tags: ['ai', 'video-generation', 'gen-4', 'creative', 'editing', 'lip-sync', '런웨이', 'AI', '비디오'],
    alternatives: ['sora', 'pika', 'leonardo-ai', 'gwanggo'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python'],
    },
    official_sdks: {
      python: 'https://github.com/runwayml/sdk-python',
    },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$15',
      growth: '$35',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // 51. Sora (OpenAI)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.sora,
    name: 'Sora',
    slug: 'sora',
    category: 'ai',
    description:
      'OpenAI\'s text-to-video generation model supporting 720p~1080p resolution with cinematic quality.',
    description_ko:
      'OpenAI의 텍스트→비디오 생성 모델로, 720p~1080p 해상도의 시네마틱 품질 비디오를 생성합니다.',
    icon_url: null,
    website_url: 'https://openai.com/sora',
    docs_url: 'https://platform.openai.com/docs',
    pricing_info: {
      free_tier: false,
      free_tier_details: 'ChatGPT Plus/Pro 구독 필요',
      plans: [
        { name: 'Plus (포함)', price: '$20/월' },
        { name: 'Pro (포함)', price: '$200/월' },
        { name: 'API', price: '$0.10~$0.50/초' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        description: 'OpenAI API key (Sora access)',
        description_ko: 'OpenAI API 키 (Sora 접근용)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'video_generation',
    popularity_score: 85,
    difficulty_level: 'beginner',
    tags: ['ai', 'video-generation', 'text-to-video', 'openai', 'cinematic', '소라', 'AI', '비디오'],
    alternatives: ['runway-ml', 'pika', 'leonardo-ai'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/openai',
    },
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$20',
      growth: '$200',
      enterprise: '$500+',
    },
  },

  // -----------------------------------------------------------------------
  // 52. Leonardo AI
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.leonardo_ai,
    name: 'Leonardo AI',
    slug: 'leonardo-ai',
    category: 'ai',
    description:
      'AI image generation platform specialized for game and art asset creation with Flux model integration.',
    description_ko:
      '게임·예술 자산 생성에 특화된 AI 이미지 생성 플랫폼으로, Flux 모델 통합을 지원합니다.',
    icon_url: null,
    website_url: 'https://leonardo.ai',
    docs_url: 'https://docs.leonardo.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: '일일 무료 크레딧 제공',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Starter', price: '$15/월' },
        { name: 'Creator', price: '$35/월' },
        { name: 'Pro', price: '$70/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'LEONARDO_API_KEY',
        public: false,
        description: 'Leonardo AI API key',
        description_ko: 'Leonardo AI API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'image_generation',
    popularity_score: 72,
    difficulty_level: 'beginner',
    tags: ['ai', 'image-generation', 'game-art', 'flux', 'creative', 'assets', '레오나르도', 'AI', '이미지'],
    alternatives: ['midjourney', 'stability-ai', 'ideogram', 'gwanggo'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$15~$35',
      enterprise: '$70+',
    },
  },

  // -----------------------------------------------------------------------
  // 53. Deepgram
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.deepgram,
    name: 'Deepgram',
    slug: 'deepgram',
    category: 'ai',
    description:
      'Ultra-low latency (<300ms) speech-to-text engine optimized for conversational AI with per-second billing.',
    description_ko:
      '초저지연(300ms 미만) 음성 인식 엔진으로, 대화형 AI에 최적화되어 있으며 초 단위 과금됩니다.',
    icon_url: null,
    website_url: 'https://deepgram.com',
    docs_url: 'https://developers.deepgram.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '$200 무료 크레딧',
      plans: [
        { name: 'Free', price: '$200 크레딧' },
        { name: 'Pay-as-you-go', price: '$0.0043/분' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'DEEPGRAM_API_KEY',
        public: false,
        description: 'Deepgram API key',
        description_ko: 'Deepgram API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'speech_to_text',
    popularity_score: 75,
    difficulty_level: 'beginner',
    tags: ['ai', 'stt', 'speech', 'voice', 'transcription', 'real-time', 'low-latency', '딥그램', '음성인식'],
    alternatives: ['assemblyai', 'openai'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust'],
    },
    official_sdks: {
      javascript: 'https://www.npmjs.com/package/@deepgram/sdk',
      python: 'https://github.com/deepgram/deepgram-python-sdk',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$20~$100',
      enterprise: '$500+',
    },
  },

  // -----------------------------------------------------------------------
  // 54. AssemblyAI
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.assemblyai,
    name: 'AssemblyAI',
    slug: 'assemblyai',
    category: 'ai',
    description:
      'Highest accuracy streaming STT with medical/sales domain specialization and Slam-1 speech-language model.',
    description_ko:
      '최고 정확도 스트리밍 음성 인식(STT)으로, 의료·세일즈 도메인 특화 및 Slam-1 음성-언어 모델을 제공합니다.',
    icon_url: null,
    website_url: 'https://www.assemblyai.com',
    docs_url: 'https://www.assemblyai.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 체험 크레딧 제공',
      plans: [
        { name: 'Free', price: '체험 크레딧' },
        { name: 'Pay-as-you-go', price: '$0.15/시간' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'ASSEMBLYAI_API_KEY',
        public: false,
        description: 'AssemblyAI API key',
        description_ko: 'AssemblyAI API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'speech_to_text',
    popularity_score: 73,
    difficulty_level: 'beginner',
    tags: ['ai', 'stt', 'speech', 'transcription', 'medical', 'accuracy', 'slam-1', '어셈블리AI', '음성인식'],
    alternatives: ['deepgram', 'openai'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go', 'java', 'ruby'],
    },
    official_sdks: {
      javascript: 'https://www.npmjs.com/package/assemblyai',
      python: 'https://github.com/AssemblyAI/assemblyai-python-sdk',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$15~$75',
      enterprise: '$300+',
    },
  },

  // -----------------------------------------------------------------------
  // 55. PlayHT
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.playht,
    name: 'PlayHT',
    slug: 'playht',
    category: 'ai',
    description:
      'AI TTS platform with 600+ voices and voice cloning at affordable prices with ~300ms latency.',
    description_ko:
      '600개 이상 AI 음성과 보이스 클로닝을 합리적 가격에 제공하는 TTS 플랫폼입니다 (~300ms 지연).',
    icon_url: null,
    website_url: 'https://play.ht',
    docs_url: 'https://docs.play.ht',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 체험 제공',
      plans: [
        { name: 'Free', price: '체험' },
        { name: 'Creator', price: '$39/월' },
        { name: 'Pro', price: '$99/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'PLAYHT_API_KEY',
        public: false,
        description: 'PlayHT API key',
        description_ko: 'PlayHT API 키',
      },
      {
        name: 'PLAYHT_USER_ID',
        public: false,
        description: 'PlayHT User ID',
        description_ko: 'PlayHT 사용자 ID',
        optional: true,
      },
    ],
    domain: 'ai_ml',
    subcategory: 'voice-synthesis',
    popularity_score: 65,
    difficulty_level: 'beginner',
    tags: ['ai', 'tts', 'voice', 'speech', 'clone', 'text-to-speech', 'audio', '플레이에이치티', '음성합성'],
    alternatives: ['elevenlabs', 'openai'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python'],
    },
    official_sdks: {
      javascript: 'https://www.npmjs.com/package/playht',
    },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$39~$99',
      enterprise: '$200+',
    },
  },

  // -----------------------------------------------------------------------
  // 56. Windsurf (Codeium)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.windsurf,
    name: 'Windsurf',
    slug: 'windsurf',
    category: 'ai',
    description:
      'Agentic IDE by Codeium where autonomous coding agents understand complex requirements and implement solutions across multiple files.',
    description_ko:
      'Codeium의 에이전틱 IDE로, 자율적 코딩 에이전트가 복잡한 요구사항을 이해하고 다중 파일에 걸쳐 솔루션을 구현합니다.',
    icon_url: null,
    website_url: 'https://codeium.com',
    docs_url: 'https://docs.codeium.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 무제한 코드 완성',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$15/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 75,
    difficulty_level: 'beginner',
    tags: ['ai', 'coding-assistant', 'ide', 'agentic', 'codeium', 'autocomplete', '윈드서프', '코딩어시스턴트'],
    alternatives: ['cursor', 'github-copilot', 'claude-code'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'svelte', 'express', 'django'],
      language: ['typescript', 'javascript', 'python', 'go', 'rust', 'java', 'c#'],
    },
    official_sdks: {},
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$15',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // 57. Tabnine
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.tabnine,
    name: 'Tabnine',
    slug: 'tabnine',
    category: 'ai',
    description:
      'Privacy-first AI coding assistant with 100% on-premises deployment. SOC 2, GDPR, HIPAA compliant.',
    description_ko:
      '100% 온프레미스 배포 가능한 프라이버시 중심 AI 코딩 어시스턴트로, SOC 2/GDPR/HIPAA를 준수합니다.',
    icon_url: null,
    website_url: 'https://www.tabnine.com',
    docs_url: 'https://docs.tabnine.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '기본 코드 완성 무료',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$12/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 68,
    difficulty_level: 'beginner',
    tags: ['ai', 'coding-assistant', 'privacy', 'on-premises', 'compliance', 'soc2', '탭나인', '코딩어시스턴트'],
    alternatives: ['github-copilot', 'cursor', 'windsurf'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'angular', 'express', 'django'],
      language: ['typescript', 'javascript', 'python', 'go', 'java', 'rust', 'c++', 'ruby'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$12',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // 58. Amazon Q Developer
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.amazon_q,
    name: 'Amazon Q Developer',
    slug: 'amazon-q-developer',
    category: 'ai',
    description:
      'AWS integrated AI coding assistant with inline suggestions, chat, code transformation, and autonomous agents.',
    description_ko:
      'AWS 통합 AI 코딩 어시스턴트로, 인라인 코드 제안, 채팅, 코드 변환, 자율 에이전트를 포함합니다.',
    icon_url: null,
    website_url: 'https://aws.amazon.com/q/developer',
    docs_url: 'https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug',
    pricing_info: {
      free_tier: true,
      free_tier_details: '개인 개발자 무료 티어',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$19/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'AWS_ACCESS_KEY_ID',
        public: false,
        description: 'AWS access key for Q Developer',
        description_ko: 'Q Developer용 AWS 액세스 키',
      },
      {
        name: 'AWS_SECRET_ACCESS_KEY',
        public: false,
        description: 'AWS secret key for Q Developer',
        description_ko: 'Q Developer용 AWS 시크릿 키',
        optional: true,
      },
    ],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 70,
    difficulty_level: 'beginner',
    tags: ['ai', 'coding-assistant', 'aws', 'amazon', 'code-transformation', 'agent', '아마존 큐', '코딩어시스턴트'],
    alternatives: ['github-copilot', 'cursor', 'claude-code'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask', 'spring'],
      language: ['typescript', 'javascript', 'python', 'java', 'go', 'c#', 'rust'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$19',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // 59. Weaviate
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.weaviate,
    name: 'Weaviate',
    slug: 'weaviate',
    category: 'ai',
    description:
      'Open-source vector database combining vector search, knowledge graphs, and structured data relationships with hybrid search.',
    description_ko:
      '벡터 검색 + 지식 그래프 + 구조화 데이터 관계를 결합한 오픈소스 벡터 DB로, 하이브리드 검색에 강합니다.',
    icon_url: null,
    website_url: 'https://weaviate.io',
    docs_url: 'https://weaviate.io/developers/weaviate',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 무료, 클라우드 14일 무료 체험',
      plans: [
        { name: 'Open Source', price: '$0/월' },
        { name: 'Cloud', price: '$25/월~' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'WEAVIATE_URL',
        public: true,
        description: 'Weaviate instance URL',
        description_ko: 'Weaviate 인스턴스 URL',
      },
      {
        name: 'WEAVIATE_API_KEY',
        public: false,
        description: 'Weaviate API key',
        description_ko: 'Weaviate API 키',
        optional: true,
      },
    ],
    domain: 'ai_ml',
    subcategory: 'vector_db',
    popularity_score: 76,
    difficulty_level: 'intermediate',
    tags: ['ai', 'vector-db', 'embeddings', 'hybrid-search', 'knowledge-graph', 'open-source', '위비에이트', '벡터DB'],
    alternatives: ['pinecone', 'qdrant', 'chroma'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask'],
      language: ['typescript', 'javascript', 'python', 'go', 'java'],
    },
    official_sdks: {
      javascript: 'https://www.npmjs.com/package/weaviate-client',
      python: 'https://github.com/weaviate/weaviate-python-client',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$25~$100',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // 60. Qdrant
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.qdrant,
    name: 'Qdrant',
    slug: 'qdrant',
    category: 'ai',
    description:
      'High-performance vector search engine written in Rust with metadata filtering, distributed deployment, and ACID transactions.',
    description_ko:
      'Rust로 작성된 고성능 벡터 검색 엔진으로, 메타데이터 필터링, 분산 배포, ACID 트랜잭션을 지원합니다.',
    icon_url: null,
    website_url: 'https://qdrant.tech',
    docs_url: 'https://qdrant.tech/documentation',
    pricing_info: {
      free_tier: true,
      free_tier_details: '1GB 영구 무료 클러스터',
      plans: [
        { name: 'Free', price: '$0 (1GB)' },
        { name: 'Cloud', price: '$25/월~' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'QDRANT_URL',
        public: true,
        description: 'Qdrant instance URL',
        description_ko: 'Qdrant 인스턴스 URL',
      },
      {
        name: 'QDRANT_API_KEY',
        public: false,
        description: 'Qdrant API key',
        description_ko: 'Qdrant API 키',
        optional: true,
      },
    ],
    domain: 'ai_ml',
    subcategory: 'vector_db',
    popularity_score: 74,
    difficulty_level: 'intermediate',
    tags: ['ai', 'vector-db', 'rust', 'high-performance', 'distributed', 'open-source', '큐드란트', '벡터DB'],
    alternatives: ['pinecone', 'weaviate', 'chroma'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask'],
      language: ['typescript', 'javascript', 'python', 'go', 'rust', 'java'],
    },
    official_sdks: {
      javascript: 'https://www.npmjs.com/package/@qdrant/js-client-rest',
      python: 'https://github.com/qdrant/qdrant-client',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$25~$100',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // 61. Chroma
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.chroma,
    name: 'Chroma',
    slug: 'chroma',
    category: 'ai',
    description:
      'Developer-friendly lightweight vector database ideal for prototyping and small-to-medium AI apps with simple setup.',
    description_ko:
      '프로토타이핑과 소중규모 AI 앱에 적합한 개발자 친화적 경량 벡터 데이터베이스입니다.',
    icon_url: null,
    website_url: 'https://www.trychroma.com',
    docs_url: 'https://docs.trychroma.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 무료',
      plans: [
        { name: 'Open Source', price: '$0/월' },
        { name: 'Cloud', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'CHROMA_HOST',
        public: true,
        description: 'Chroma server host',
        description_ko: 'Chroma 서버 호스트',
      },
      {
        name: 'CHROMA_API_KEY',
        public: false,
        description: 'Chroma API key (cloud only)',
        description_ko: 'Chroma API 키 (클라우드 전용)',
        optional: true,
      },
    ],
    domain: 'ai_ml',
    subcategory: 'vector_db',
    popularity_score: 72,
    difficulty_level: 'beginner',
    tags: ['ai', 'vector-db', 'lightweight', 'prototyping', 'embeddings', 'open-source', '크로마', '벡터DB'],
    alternatives: ['pinecone', 'weaviate', 'qdrant'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask'],
      language: ['typescript', 'javascript', 'python'],
    },
    official_sdks: {
      javascript: 'https://www.npmjs.com/package/chromadb',
      python: 'https://github.com/chroma-core/chroma',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$0~$50',
      enterprise: '문의',
    },
    github_stars: 17000,
  },

  // -----------------------------------------------------------------------
  // 62. CrewAI
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.crewai,
    name: 'CrewAI',
    slug: 'crewai',
    category: 'ai',
    description:
      'Role-based multi-agent collaboration framework for automated research, content pipelines, and business intelligence.',
    description_ko:
      '역할 기반 멀티 에이전트 협업 프레임워크로, 자동화된 리서치, 콘텐츠 파이프라인, BI에 활용됩니다.',
    icon_url: null,
    website_url: 'https://www.crewai.com',
    docs_url: 'https://docs.crewai.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 무료',
      plans: [
        { name: 'Open Source', price: '$0/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        description: 'LLM provider API key (OpenAI default)',
        description_ko: 'LLM 제공자 API 키 (기본: OpenAI)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'ai_agent',
    popularity_score: 76,
    difficulty_level: 'intermediate',
    tags: ['ai', 'agents', 'multi-agent', 'automation', 'orchestration', 'open-source', '크루AI', '에이전트'],
    alternatives: ['langchain', 'dify', 'autogen'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask'],
      language: ['python'],
    },
    official_sdks: {
      python: 'https://github.com/crewAIInc/crewAI',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$0 (+ LLM 비용)',
      enterprise: '문의',
    },
    github_stars: 25000,
  },

  // -----------------------------------------------------------------------
  // 63. Dify
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.dify,
    name: 'Dify',
    slug: 'dify',
    category: 'ai',
    description:
      'No-code/low-code LLM app builder with visual workflows, RAG pipelines, agent framework, and model management.',
    description_ko:
      '노코드/로우코드 LLM 앱 빌더로, 비주얼 워크플로우, RAG 파이프라인, 에이전트 프레임워크, 모델 관리를 통합합니다.',
    icon_url: null,
    website_url: 'https://dify.ai',
    docs_url: 'https://docs.dify.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Sandbox: 무료 200 메시지',
      plans: [
        { name: 'Sandbox', price: '$0/월' },
        { name: 'Professional', price: '$59/월' },
        { name: 'Team', price: '$159/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'DIFY_API_KEY',
        public: false,
        description: 'Dify app API key',
        description_ko: 'Dify 앱 API 키',
      },
      {
        name: 'DIFY_BASE_URL',
        public: true,
        description: 'Dify instance base URL',
        description_ko: 'Dify 인스턴스 기본 URL',
        optional: true,
      },
    ],
    domain: 'ai_ml',
    subcategory: 'ai_agent',
    popularity_score: 78,
    difficulty_level: 'beginner',
    tags: ['ai', 'no-code', 'low-code', 'rag', 'workflow', 'agents', 'llm-app', 'open-source', '디파이', '노코드', 'AI'],
    alternatives: ['langchain', 'crewai', 'flowise'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python'],
    },
    official_sdks: {
      python: 'https://github.com/langgenius/dify',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$59',
      enterprise: '문의',
    },
    github_stars: 55000,
  },

  // -----------------------------------------------------------------------
  // 64. Together AI
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.together_ai,
    name: 'Together AI',
    slug: 'together-ai',
    category: 'ai',
    description:
      'High-performance inference platform serving 200+ open-source LLMs with sub-100ms latency.',
    description_ko:
      '200개 이상 오픈소스 LLM을 100ms 미만 지연으로 서빙하는 고성능 추론 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://together.ai',
    docs_url: 'https://docs.together.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: '$5 무료 크레딧',
      plans: [
        { name: 'Free', price: '$5 크레딧' },
        { name: 'Pay-as-you-go', price: '토큰당 과금 (모델별 상이)' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'TOGETHER_API_KEY',
        public: false,
        description: 'Together AI API key',
        description_ko: 'Together AI API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'llm-inference',
    popularity_score: 74,
    difficulty_level: 'beginner',
    tags: ['ai', 'llm', 'inference', 'open-source', 'fast', 'hosting', '투게더', 'AI'],
    alternatives: ['groq', 'fireworks-ai', 'replicate'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go'],
    },
    official_sdks: {
      javascript: 'https://www.npmjs.com/package/together-ai',
      python: 'https://github.com/togethercomputer/together-python',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$20~$100',
      enterprise: '$500+',
    },
  },

  // -----------------------------------------------------------------------
  // 65. Fireworks AI
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.fireworks_ai,
    name: 'Fireworks AI',
    slug: 'fireworks-ai',
    category: 'ai',
    description:
      'FireAttention engine-based text/image/audio inference platform with HIPAA/SOC2 compliance.',
    description_ko:
      'FireAttention 엔진 기반 텍스트/이미지/오디오 추론 플랫폼으로, HIPAA/SOC2 컴플라이언스를 충족합니다.',
    icon_url: null,
    website_url: 'https://fireworks.ai',
    docs_url: 'https://docs.fireworks.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: '$1 무료 크레딧',
      plans: [
        { name: 'Free', price: '$1 크레딧' },
        { name: 'Pay-as-you-go', price: '토큰당 과금' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'FIREWORKS_API_KEY',
        public: false,
        description: 'Fireworks AI API key',
        description_ko: 'Fireworks AI API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'llm-inference',
    popularity_score: 70,
    difficulty_level: 'beginner',
    tags: ['ai', 'llm', 'inference', 'fireattention', 'compliance', 'hipaa', 'multimodal', '파이어웍스', 'AI'],
    alternatives: ['groq', 'together-ai', 'replicate'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go'],
    },
    official_sdks: {
      python: 'https://github.com/fw-ai/fireworks-python',
    },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$20~$100',
      enterprise: '$500+',
    },
  },

  // -----------------------------------------------------------------------
  // 66. Modal
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.modal,
    name: 'Modal',
    slug: 'modal',
    category: 'ai',
    description:
      'Serverless GPU computing platform for ML training, inference, and batch processing without infrastructure setup.',
    description_ko:
      '인프라 설정 없이 ML 학습·추론·배치 처리를 위한 서버리스 GPU 컴퓨팅 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://modal.com',
    docs_url: 'https://modal.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '$30/월 무료 컴퓨트 크레딧',
      plans: [
        { name: 'Free', price: '$30/월 크레딧' },
        { name: 'Pay-as-you-go', price: '초 단위 GPU 과금' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'MODAL_TOKEN_ID',
        public: false,
        description: 'Modal token ID',
        description_ko: 'Modal 토큰 ID',
      },
      {
        name: 'MODAL_TOKEN_SECRET',
        public: false,
        description: 'Modal token secret',
        description_ko: 'Modal 토큰 시크릿',
        optional: true,
      },
    ],
    domain: 'ai_ml',
    subcategory: 'mlops',
    popularity_score: 72,
    difficulty_level: 'intermediate',
    tags: ['ai', 'gpu', 'serverless', 'ml', 'training', 'inference', 'batch', '모달', 'GPU', '서버리스'],
    alternatives: ['replicate', 'together-ai', 'anyscale'],
    compatibility: {
      framework: ['django', 'flask', 'fastapi'],
      language: ['python'],
    },
    official_sdks: {
      python: 'https://github.com/modal-labs/modal-client',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$50~$200',
      enterprise: '$1000+',
    },
  },

  // -----------------------------------------------------------------------
  // 67. Weights & Biases
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.wandb,
    name: 'Weights & Biases',
    slug: 'wandb',
    category: 'ai',
    description:
      'Integrated MLOps platform for experiment tracking, model evaluation, and app observability.',
    description_ko:
      '실험 추적, 모델 평가, 앱 관찰성(Observability)을 통합한 MLOps 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://wandb.ai',
    docs_url: 'https://docs.wandb.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: '개인 무료, 100GB 스토리지',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$60/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'WANDB_API_KEY',
        public: false,
        description: 'Weights & Biases API key',
        description_ko: 'Weights & Biases API 키',
      },
      {
        name: 'WANDB_PROJECT',
        public: true,
        description: 'W&B project name',
        description_ko: 'W&B 프로젝트 이름',
        optional: true,
      },
    ],
    domain: 'ai_ml',
    subcategory: 'mlops',
    popularity_score: 80,
    difficulty_level: 'intermediate',
    tags: ['ai', 'mlops', 'experiment-tracking', 'model-eval', 'observability', 'dashboard', '웨이츠앤바이어시스', 'MLOps'],
    alternatives: ['mlflow', 'neptune-ai', 'comet-ml'],
    compatibility: {
      framework: ['pytorch', 'tensorflow', 'jax', 'fastai'],
      language: ['python'],
    },
    official_sdks: {
      python: 'https://github.com/wandb/wandb',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$60',
      enterprise: '$315+/시트',
    },
  },

  // -----------------------------------------------------------------------
  // SNS Platform Services
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // Instagram API (Meta Graph API)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.instagram_api,
    name: 'Instagram API',
    slug: 'instagram-api',
    category: 'sns',
    description:
      'Instagram Graph API를 통해 비즈니스/크리에이터 계정의 게시물 발행, 댓글 관리, 인사이트 조회, 해시태그 검색 등을 자동화할 수 있습니다.',
    description_ko:
      'Instagram Graph API를 통해 비즈니스/크리에이터 계정의 게시물 발행, 댓글 관리, 인사이트 조회, 해시태그 검색 등을 자동화할 수 있습니다.',
    icon_url: null,
    website_url: 'https://developers.facebook.com/docs/instagram-api',
    docs_url: 'https://developers.facebook.com/docs/instagram-platform',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 (앱 리뷰 및 권한 승인 필요, 비즈니스/크리에이터 계정 필수)',
      plans: [
        { name: 'Standard', price: '$0/월 (API 사용 자체 무료)' },
      ],
    },
    required_env_vars: [
      {
        name: 'INSTAGRAM_APP_ID',
        public: false,
        description: 'Meta App ID for Instagram API',
        description_ko: 'Instagram API용 Meta 앱 ID',
      },
      {
        name: 'INSTAGRAM_APP_SECRET',
        public: false,
        description: 'Meta App Secret for Instagram API',
        description_ko: 'Instagram API용 Meta 앱 시크릿',
        optional: true,
      },
      {
        name: 'INSTAGRAM_ACCESS_TOKEN',
        public: false,
        description: 'Long-lived user access token for Instagram Graph API',
        description_ko: 'Instagram Graph API용 장기 사용자 액세스 토큰',
        optional: true,
      },
    ],
    domain: 'sns',
    subcategory: 'social-media',
    popularity_score: 95,
    difficulty_level: 'intermediate',
    tags: ['sns', 'social-media', 'instagram', 'meta', 'graph-api', 'reels', 'stories', 'marketing', 'influencer', '인스타그램', 'SNS'],
    alternatives: ['threads-api', 'tiktok-api', 'x-api'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask', 'rails'],
      language: ['javascript', 'typescript', 'python', 'php', 'ruby'],
    },
    official_sdks: {
      javascript: 'https://github.com/fbsamples/instagram-node',
      python: 'https://github.com/facebook/facebook-python-business-sdk',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 30,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$0',
      enterprise: '$0 (API 무료, 광고 API 별도)',
    },
  },

  // -----------------------------------------------------------------------
  // YouTube Data API v3
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.youtube_api,
    name: 'YouTube Data API',
    slug: 'youtube-api',
    category: 'sns',
    description:
      'YouTube Data API v3를 통해 채널·영상·재생목록 관리, 검색, 댓글, 라이브 스트리밍, 분석 등을 프로그래밍 방식으로 제어할 수 있습니다.',
    description_ko:
      'YouTube Data API v3를 통해 채널·영상·재생목록 관리, 검색, 댓글, 라이브 스트리밍, 분석 등을 프로그래밍 방식으로 제어할 수 있습니다.',
    icon_url: null,
    website_url: 'https://developers.google.com/youtube/v3',
    docs_url: 'https://developers.google.com/youtube/v3/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '일일 10,000 유닛 무료 (검색=100유닛, 읽기=1유닛, 업로드=1,600유닛)',
      plans: [
        { name: 'Free', price: '$0/월 (10,000유닛/일)' },
        { name: 'Extended', price: '감사 후 할당량 확장 가능' },
      ],
    },
    required_env_vars: [
      {
        name: 'YOUTUBE_API_KEY',
        public: false,
        description: 'Google Cloud API key for YouTube Data API',
        description_ko: 'YouTube Data API용 Google Cloud API 키',
      },
      {
        name: 'YOUTUBE_CLIENT_ID',
        public: false,
        description: 'OAuth 2.0 Client ID for YouTube API',
        description_ko: 'YouTube API용 OAuth 2.0 클라이언트 ID',
        optional: true,
      },
      {
        name: 'YOUTUBE_CLIENT_SECRET',
        public: false,
        description: 'OAuth 2.0 Client Secret for YouTube API',
        description_ko: 'YouTube API용 OAuth 2.0 클라이언트 시크릿',
        optional: true,
      },
    ],
    domain: 'sns',
    subcategory: 'video-platform',
    popularity_score: 93,
    difficulty_level: 'intermediate',
    tags: ['sns', 'video', 'youtube', 'google', 'streaming', 'live', 'analytics', 'creator', 'playlist', '유튜브', '동영상'],
    alternatives: ['tiktok-api'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask', 'rails', 'spring'],
      language: ['javascript', 'typescript', 'python', 'java', 'go', 'php', 'ruby', 'dotnet'],
    },
    official_sdks: {
      javascript: 'https://github.com/googleapis/google-api-nodejs-client',
      python: 'https://github.com/googleapis/google-api-python-client',
      java: 'https://github.com/googleapis/google-api-java-client',
      go: 'https://github.com/googleapis/google-api-go-client',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 20,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$0',
      enterprise: '$0 (할당량 확장 시 감사 필요)',
    },
  },

  // -----------------------------------------------------------------------
  // X (Twitter) API v2
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.x_api,
    name: 'X API',
    slug: 'x-api',
    category: 'sns',
    description:
      'X(구 Twitter) API v2를 통해 트윗 작성·읽기, 타임라인, 검색, 스페이스, DM, 분석 등을 자동화할 수 있습니다.',
    description_ko:
      'X(구 Twitter) API v2를 통해 트윗 작성·읽기, 타임라인, 검색, 스페이스, DM, 분석 등을 자동화할 수 있습니다.',
    icon_url: null,
    website_url: 'https://developer.x.com',
    docs_url: 'https://developer.x.com/en/docs/x-api',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: 쓰기 전용 (1,500트윗/월), 읽기 불가',
      plans: [
        { name: 'Free', price: '$0/월 (쓰기 전용)' },
        { name: 'Basic', price: '$200/월 (15K 읽기 + 50K 쓰기)' },
        { name: 'Pro', price: '$5,000/월' },
        { name: 'Enterprise', price: '$42,000+/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'X_API_KEY',
        public: false,
        description: 'X API Key (Consumer Key)',
        description_ko: 'X API 키 (Consumer Key)',
      },
      {
        name: 'X_API_SECRET',
        public: false,
        description: 'X API Secret (Consumer Secret)',
        description_ko: 'X API 시크릿 (Consumer Secret)',
        optional: true,
      },
      {
        name: 'X_ACCESS_TOKEN',
        public: false,
        description: 'X OAuth 2.0 Access Token',
        description_ko: 'X OAuth 2.0 액세스 토큰',
        optional: true,
      },
      {
        name: 'X_BEARER_TOKEN',
        public: false,
        description: 'X Bearer Token for app-only authentication',
        description_ko: 'X 앱 전용 인증 Bearer 토큰',
        optional: true,
      },
    ],
    domain: 'sns',
    subcategory: 'social-media',
    popularity_score: 88,
    difficulty_level: 'intermediate',
    tags: ['sns', 'social-media', 'twitter', 'x', 'tweet', 'realtime', 'marketing', 'analytics', 'spaces', '트위터', '엑스', 'SNS'],
    alternatives: ['threads-api', 'instagram-api'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask', 'rails'],
      language: ['javascript', 'typescript', 'python', 'java', 'ruby', 'go'],
    },
    official_sdks: {
      python: 'https://github.com/xdevplatform/twitter-python-sdk',
      javascript: 'https://github.com/xdevplatform/twitter-api-typescript-sdk',
    },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0 (쓰기만)',
      growth: '$200',
      enterprise: '$5,000+',
    },
  },

  // -----------------------------------------------------------------------
  // TikTok API
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.tiktok_api,
    name: 'TikTok API',
    slug: 'tiktok-api',
    category: 'sns',
    description:
      'TikTok for Developers API를 통해 로그인 연동, 비디오 게시, 콘텐츠 분석, 댓글 관리 등을 자동화할 수 있습니다.',
    description_ko:
      'TikTok for Developers API를 통해 로그인 연동, 비디오 게시, 콘텐츠 분석, 댓글 관리 등을 자동화할 수 있습니다.',
    icon_url: null,
    website_url: 'https://developers.tiktok.com',
    docs_url: 'https://developers.tiktok.com/doc/overview',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 (앱 승인 필요, 동영상 게시 20개/일)',
      plans: [
        { name: 'Standard', price: '$0/월 (승인 후 사용)' },
      ],
    },
    required_env_vars: [
      {
        name: 'TIKTOK_CLIENT_KEY',
        public: false,
        description: 'TikTok App Client Key',
        description_ko: 'TikTok 앱 클라이언트 키',
      },
      {
        name: 'TIKTOK_CLIENT_SECRET',
        public: false,
        description: 'TikTok App Client Secret',
        description_ko: 'TikTok 앱 클라이언트 시크릿',
        optional: true,
      },
    ],
    domain: 'sns',
    subcategory: 'social-media',
    popularity_score: 90,
    difficulty_level: 'intermediate',
    tags: ['sns', 'social-media', 'tiktok', 'short-video', 'creator', 'marketing', 'viral', 'duet', 'stitch', '틱톡', '숏폼'],
    alternatives: ['youtube-api', 'instagram-api'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'java'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 25,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$0',
      enterprise: '$0 (API 무료)',
    },
  },

  // -----------------------------------------------------------------------
  // LinkedIn API
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.linkedin_api,
    name: 'LinkedIn API',
    slug: 'linkedin-api',
    category: 'sns',
    description:
      'LinkedIn API를 통해 프로필 조회, 게시물 작성, 회사 페이지 관리, 채용 공고, 분석 등을 프로그래밍 방식으로 연동할 수 있습니다.',
    description_ko:
      'LinkedIn API를 통해 프로필 조회, 게시물 작성, 회사 페이지 관리, 채용 공고, 분석 등을 프로그래밍 방식으로 연동할 수 있습니다.',
    icon_url: null,
    website_url: 'https://developer.linkedin.com',
    docs_url: 'https://learn.microsoft.com/en-us/linkedin/',
    pricing_info: {
      free_tier: true,
      free_tier_details: '기본 프로필 API 무료, Marketing/Sales API는 파트너십 필요',
      plans: [
        { name: 'Community', price: '$0/월 (기본 API)' },
        { name: 'Marketing', price: '파트너십 모델 (문의)' },
        { name: 'Sales Navigator', price: '$99+/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'LINKEDIN_CLIENT_ID',
        public: false,
        description: 'LinkedIn App Client ID',
        description_ko: 'LinkedIn 앱 클라이언트 ID',
      },
      {
        name: 'LINKEDIN_CLIENT_SECRET',
        public: false,
        description: 'LinkedIn App Client Secret',
        description_ko: 'LinkedIn 앱 클라이언트 시크릿',
        optional: true,
      },
    ],
    domain: 'sns',
    subcategory: 'professional-sns',
    popularity_score: 82,
    difficulty_level: 'intermediate',
    tags: ['sns', 'professional', 'linkedin', 'b2b', 'recruiting', 'networking', 'career', 'marketing', 'microsoft', '링크드인', '채용'],
    alternatives: ['x-api'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask', 'spring'],
      language: ['javascript', 'typescript', 'python', 'java', 'dotnet'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 30,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$0 (기본)',
      enterprise: '문의 (Marketing/Sales API)',
    },
  },

  // -----------------------------------------------------------------------
  // Threads API (Meta)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.threads_api,
    name: 'Threads API',
    slug: 'threads-api',
    category: 'sns',
    description:
      'Meta Threads API를 통해 텍스트 게시물 작성, 미디어 업로드, 폴, 인사이트 조회 등을 자동화할 수 있습니다. Instagram 계정 기반으로 동작합니다.',
    description_ko:
      'Meta Threads API를 통해 텍스트 게시물 작성, 미디어 업로드, 폴, 인사이트 조회 등을 자동화할 수 있습니다. Instagram 계정 기반으로 동작합니다.',
    icon_url: null,
    website_url: 'https://developers.facebook.com/docs/threads',
    docs_url: 'https://developers.facebook.com/docs/threads/overview',
    pricing_info: {
      free_tier: true,
      free_tier_details: '완전 무료 (Meta Graph API 기반)',
      plans: [
        { name: 'Standard', price: '$0/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'THREADS_APP_ID',
        public: false,
        description: 'Meta App ID for Threads API',
        description_ko: 'Threads API용 Meta 앱 ID',
      },
      {
        name: 'THREADS_APP_SECRET',
        public: false,
        description: 'Meta App Secret for Threads API',
        description_ko: 'Threads API용 Meta 앱 시크릿',
        optional: true,
      },
      {
        name: 'THREADS_ACCESS_TOKEN',
        public: false,
        description: 'Long-lived access token for Threads API',
        description_ko: 'Threads API용 장기 액세스 토큰',
        optional: true,
      },
    ],
    domain: 'sns',
    subcategory: 'social-media',
    popularity_score: 78,
    difficulty_level: 'beginner',
    tags: ['sns', 'social-media', 'threads', 'meta', 'text', 'microblog', 'instagram', 'poll', '쓰레드', 'SNS'],
    alternatives: ['x-api', 'instagram-api'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'php'],
    },
    official_sdks: {
      python: 'https://github.com/facebook/facebook-python-business-sdk',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 20,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$0',
      enterprise: '$0',
    },
  },

  // -----------------------------------------------------------------------
  // Polar
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.polar,
    name: 'Polar',
    slug: 'polar',
    category: 'payment',
    description:
      '오픈소스 프로젝트와 인디 개발자를 위한 결제·수익화 플랫폼입니다. 디지털 상품 판매, 구독, 후원을 단일 API로 처리하며 글로벌 세금(VAT/GST) 준수를 자동화합니다.',
    description_ko:
      '오픈소스 프로젝트와 인디 개발자를 위한 결제·수익화 플랫폼입니다. 디지털 상품 판매, 구독, 후원을 단일 API로 처리하며 글로벌 세금(VAT/GST) 준수를 자동화합니다.',
    icon_url: null,
    website_url: 'https://polar.sh',
    docs_url: 'https://docs.polar.sh',
    pricing_info: {
      free_tier: true,
      free_tier_details: '플랫폼 무료, 거래 수수료: 4% + 40¢',
      plans: [{ name: 'Standard', price: '거래당 4% + 40¢ (월정액 없음)' }],
    },
    required_env_vars: [
      {
        name: 'POLAR_ACCESS_TOKEN',
        public: false,
        description: 'Polar API access token',
        description_ko: 'Polar API 액세스 토큰',
      },
      {
        name: 'POLAR_WEBHOOK_SECRET',
        public: false,
        optional: true,
        description: 'Polar webhook signing secret (required when using webhooks)',
        description_ko: 'Polar 웹훅 서명 시크릿 (웹훅 사용 시 필요)',
      },
      {
        name: 'NEXT_PUBLIC_POLAR_PRODUCT_PRO',
        public: true,
        optional: true,
        description: 'Polar product ID for Pro plan',
        description_ko: 'Polar Pro 플랜 상품 ID',
      },
      {
        name: 'NEXT_PUBLIC_POLAR_PRODUCT_PRO_YEARLY',
        public: true,
        optional: true,
        description: 'Polar product ID for Pro yearly plan',
        description_ko: 'Polar Pro 연간 플랜 상품 ID',
      },
    ],
    domain: 'business',
    subcategory: 'payment_gateway',
    popularity_score: 62,
    difficulty_level: 'beginner',
    tags: ['payment', 'subscription', 'digital-products', 'merchant-of-record', 'open-source', 'indie', 'saas', 'tax', '폴라', '결제', '구독'],
    alternatives: ['stripe', 'lemon-squeezy'],
    compatibility: {
      framework: ['next', 'nuxt', 'remix', 'sveltekit', 'astro', 'express', 'fastify', 'laravel'],
      language: ['javascript', 'typescript', 'python', 'go', 'php'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/@polar-sh/sdk',
      python: 'https://pypi.org/project/polar-sdk/',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '4%+40¢/tx',
      growth: '4%+40¢/tx',
      enterprise: 'Custom',
    },
  },

  // -----------------------------------------------------------------------
  // gwanggo — AI 광고 이미지·영상 자동 생성 플랫폼
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.gwanggo,
    name: 'gwanggo',
    slug: 'gwanggo',
    category: 'media',
    description:
      'AI-powered advertising content generation platform for Korean marketers. Automatically creates product ad images and videos using Seedream, FLUX, and Grok Imagine models. Upload a product photo and select a style to generate professional ad creatives in minutes.',
    description_ko:
      'AI 기반 광고 콘텐츠 자동 생성 플랫폼입니다. Seedream, FLUX, Grok Imagine 등 다양한 AI 모델로 제품 광고 이미지와 영상을 자동 제작합니다. 제품 사진을 업로드하고 스타일을 선택하면 전문 광고 소재를 몇 분 안에 완성할 수 있습니다.',
    icon_url: null,
    website_url: 'https://gwanggo.jocoding.io',
    docs_url: 'https://gwanggo.jocoding.io',
    pricing_info: {
      free_tier: true,
      free_tier_details: '회원가입 시 20크레딧 무료 제공',
      plans: [
        { name: 'Free', price: '20크레딧 (회원가입)' },
        { name: 'Starter', price: '크레딧 구매' },
        { name: 'Pro', price: '크레딧 구매' },
        { name: 'Business', price: '크레딧 구매' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'ai_creative',
    popularity_score: 60,
    difficulty_level: 'beginner',
    tags: ['ai', 'advertising', 'image-generation', 'video-generation', 'marketing', 'creative', 'ecommerce', 'korean', '조코딩', '광고', 'AI', '이미지'],
    alternatives: ['midjourney', 'leonardo-ai', 'runway-ml'],
    compatibility: {
      framework: [],
      language: [],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '크레딧 구매',
      growth: '크레딧 구매',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // Linkmap — 서비스 시각화 + 원클릭 배포 플랫폼 (자사 서비스)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.linkmap,
    name: 'Linkmap',
    slug: 'linkmap',
    category: 'deploy',
    description:
      'Service visualization and one-click deployment platform. Visualize your service architecture with interactive maps, manage environment variables securely with AES-256 encryption, and deploy websites in 3 minutes with one click.',
    description_ko:
      '서비스 시각화 및 원클릭 배포 플랫폼입니다. 인터랙티브 서비스 맵으로 아키텍처를 시각화하고, AES-256 암호화로 환경변수를 안전하게 관리하며, 3분 만에 원클릭으로 웹사이트를 배포할 수 있습니다.',
    icon_url: null,
    website_url: 'https://www.linkmap.biz',
    docs_url: 'https://www.linkmap.biz/guides',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료로 시작 — 프로젝트 3개, 원클릭 배포 3개',
      plans: [
        { name: 'Free', price: '₩0' },
        { name: 'Pro', price: '₩9,900/월' },
        { name: 'Team', price: '₩29,900/월' },
      ],
    },
    required_env_vars: [],
    domain: 'devtools',
    subcategory: 'platform',
    popularity_score: 88,
    difficulty_level: 'beginner',
    tags: ['서비스맵', '원클릭배포', '환경변수', '시각화', 'devtools', 'deploy', 'platform', 'korean', '바이브코딩', '링크맵'],
    alternatives: ['vercel', 'netlify', 'railway'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'svelte'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 3,
    monthly_cost_estimate: {
      starter: '₩0',
      growth: '₩9,900',
      enterprise: '₩29,900',
    },
  },

  // -----------------------------------------------------------------------
  // Microsoft Clarity — 무료 히트맵·세션 녹화 분석 도구
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.clarity,
    name: 'Microsoft Clarity',
    slug: 'clarity',
    category: 'analytics',
    description:
      'Free behavioral analytics tool by Microsoft. Provides heatmaps, session recordings, and scroll-depth insights to understand how users interact with your website. No traffic limits, GDPR-ready, integrates with Google Analytics.',
    description_ko:
      'Microsoft의 무료 행동 분석 도구입니다. 히트맵, 세션 녹화, 스크롤 깊이 분석으로 사용자가 웹사이트에서 어떻게 행동하는지 파악할 수 있습니다. 트래픽 제한 없이 무료이며, GDPR 준수, Google Analytics와 연동됩니다.',
    icon_url: null,
    website_url: 'https://clarity.microsoft.com',
    docs_url: 'https://learn.microsoft.com/en-us/clarity/',
    pricing_info: {
      free_tier: true,
      free_tier_details: '완전 무료 — 트래픽 제한 없음',
      plans: [
        { name: 'Free', price: '$0 (완전 무료)' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_CLARITY_ID',
        public: true,
        description: 'Microsoft Clarity project ID',
        description_ko: 'Microsoft Clarity 프로젝트 ID',
      },
    ],
    domain: 'business',
    subcategory: 'behavior-analytics',
    popularity_score: 75,
    difficulty_level: 'beginner',
    tags: ['analytics', 'heatmap', 'session-recording', 'microsoft', 'free', 'ux', 'behavior', 'scroll-depth', '마이크로소프트 클래리티', '히트맵', '분석'],
    alternatives: ['ga4', 'posthog', 'mixpanel', 'plausible'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'svelte', 'angular'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/clarity-js',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$0',
      enterprise: '$0',
    },
  },

  // -----------------------------------------------------------------------
  // Google Antigravity — AI 에이전트 기반 개발 플랫폼 (IDE)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.google_antigravity,
    name: 'Google Antigravity',
    slug: 'google-antigravity',
    category: 'ai',
    description:
      'AI-powered agentic development platform by Google. Built on a modified VS Code fork, it enables developers to delegate complex coding tasks to autonomous AI agents powered by Gemini models. Agents can plan, execute, and verify tasks across editor, terminal, and browser.',
    description_ko:
      'Google의 AI 에이전트 기반 개발 플랫폼입니다. VS Code 포크에 기반하여 Gemini 모델로 구동되는 자율 AI 에이전트에게 복잡한 코딩 작업을 위임할 수 있습니다. 에이전트가 에디터, 터미널, 브라우저에서 작업을 계획·실행·검증합니다.',
    icon_url: null,
    website_url: 'https://antigravity.google',
    docs_url: 'https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/',
    pricing_info: {
      free_tier: true,
      free_tier_details: '개인 개발자 무료 퍼블릭 프리뷰 (AI 크레딧 시스템)',
      plans: [
        { name: 'Free', price: '$0 (프리뷰)' },
        { name: 'Pro', price: '크레딧 기반' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'ai_agent',
    popularity_score: 82,
    difficulty_level: 'beginner',
    tags: ['ai', 'ide', 'agentic', 'google', 'gemini', 'vibe-coding', 'code-generation', 'autonomous', '바이브코딩', '구글 안티그래비티', '코딩어시스턴트'],
    alternatives: ['cursor', 'github-copilot', 'windsurf'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'svelte', 'angular', 'express', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust', 'java'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '크레딧 기반',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // n8n — 오픈소스 워크플로우 자동화 플랫폼
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.n8n,
    name: 'n8n',
    slug: 'n8n',
    category: 'automation',
    description:
      'Open-source workflow automation platform with 400+ integrations. Build complex automations with a visual node-based editor, self-host for free, or use the managed cloud. Fair-code licensed, extensible with custom nodes and JavaScript/Python code.',
    description_ko:
      '400개 이상의 통합을 지원하는 오픈소스 워크플로우 자동화 플랫폼입니다. 비주얼 노드 에디터로 복잡한 자동화를 구축하고, 무료로 셀프호스팅하거나 관리형 클라우드를 사용할 수 있습니다. Fair-code 라이선스, 커스텀 노드와 JavaScript/Python 코드로 확장 가능합니다.',
    icon_url: null,
    website_url: 'https://n8n.io',
    docs_url: 'https://docs.n8n.io',
    pricing_info: {
      free_tier: true,
      free_tier_details: '셀프호스팅 무료 (Community Edition), 클라우드는 14일 무료 체험',
      plans: [
        { name: 'Community (Self-hosted)', price: '$0' },
        { name: 'Starter (Cloud)', price: '€20/월' },
        { name: 'Pro (Cloud)', price: '€50/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'N8N_WEBHOOK_URL',
        public: false,
        description: 'n8n instance webhook base URL',
        description_ko: 'n8n 인스턴스 웹훅 기본 URL',
      },
    ],
    domain: 'integration',
    subcategory: 'workflow_automation',
    popularity_score: 85,
    difficulty_level: 'beginner',
    tags: ['automation', 'workflow', 'no-code', 'open-source', 'integration', 'webhook', 'api', 'self-hosted', 'ai-agent', '엔에이트엔', '자동화', '워크플로우'],
    alternatives: ['zapier', 'make', 'trigger-dev'],
    compatibility: {
      framework: ['next', 'react', 'express', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/n8n',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$0 (셀프호스팅)',
      growth: '€50',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // Google Stitch
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.google_stitch,
    name: 'Google Stitch',
    slug: 'google-stitch',
    category: 'ai',
    description:
      'Google Labs의 AI UI 디자인 도구입니다. 텍스트·이미지 프롬프트로 모바일·웹 UI를 생성하고, 프론트엔드 코드로 내보낼 수 있습니다. Voice Canvas, Vibe Design 등 AI 네이티브 디자인 기능을 제공합니다.',
    description_ko:
      'Google Labs의 AI UI 디자인 도구입니다. 텍스트·이미지 프롬프트로 모바일·웹 UI를 생성하고, 프론트엔드 코드로 내보낼 수 있습니다. Voice Canvas, Vibe Design 등 AI 네이티브 디자인 기능을 제공합니다.',
    icon_url: null,
    website_url: 'https://stitch.withgoogle.com',
    docs_url: 'https://github.com/google-labs-code/stitch-sdk',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 사용 가능 (Google Labs 실험 단계)',
      plans: [{ name: 'Free', price: '$0' }],
    },
    required_env_vars: [
      {
        name: 'GOOGLE_STITCH_API_KEY',
        public: false,
        description: 'Google Stitch API key for programmatic UI generation',
        description_ko: 'Google Stitch API 키 (프로그래매틱 UI 생성용)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'ai_creative',
    popularity_score: 70,
    difficulty_level: 'beginner',
    tags: ['ai', 'ui-design', 'code-generation', 'prototyping', 'google-labs', 'vibe-design', 'frontend', '구글 스티치', '통합', 'AI'],
    alternatives: ['google-antigravity'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'angular', 'svelte'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      npm: 'https://github.com/google-labs-code/stitch-sdk',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$0',
      enterprise: 'N/A',
    },
  },

  // -----------------------------------------------------------------------
  // Cursor
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.cursor,
    name: 'Cursor',
    slug: 'cursor',
    category: 'ai',
    description:
      'VS Code 포크 기반 AI 코드 에디터입니다. GPT-4, Claude 등 최신 LLM을 내장해 코드 자동완성·채팅·에이전트 기능을 제공하며, 바이브코딩의 대표 도구로 자리잡고 있습니다.',
    description_ko:
      'VS Code 포크 기반 AI 코드 에디터입니다. GPT-4, Claude 등 최신 LLM을 내장해 코드 자동완성·채팅·에이전트 기능을 제공하며, 바이브코딩의 대표 도구로 자리잡고 있습니다.',
    icon_url: null,
    website_url: 'https://cursor.com',
    docs_url: 'https://docs.cursor.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Hobby 플랜 무료 (월 2,000 완성, 50 slow 요청)',
      plans: [
        { name: 'Hobby', price: '$0/월' },
        { name: 'Pro', price: '$20/월' },
        { name: 'Business', price: '$40/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        optional: true,
        description: 'OpenAI API key (optional, only needed when using your own API key in Cursor settings)',
        description_ko: 'OpenAI API 키 (선택, Cursor 설정에서 자체 키 사용 시)',
      },
      {
        name: 'ANTHROPIC_API_KEY',
        public: false,
        optional: true,
        description: 'Anthropic API key (optional, only needed when using your own API key in Cursor settings)',
        description_ko: 'Anthropic API 키 (선택, Cursor 설정에서 자체 키 사용 시)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 95,
    difficulty_level: 'beginner',
    tags: ['cursor', 'ai-ide', 'vibe-coding', 'code-editor', 'llm', '커서', 'AI코딩', '바이브코딩'],
    alternatives: ['windsurf', 'claude-code', 'github-copilot'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'svelte', 'nuxt', 'express', 'fastify', 'django', 'rails', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust', 'java', 'ruby', 'php', 'csharp'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$20/월',
      enterprise: '$40/월',
    },
  },

  // -----------------------------------------------------------------------
  // GitHub Copilot
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.github_copilot,
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    category: 'ai',
    description:
      'GitHub의 AI 페어 프로그래머입니다. IDE 내 코드 자동완성부터 Agent 모드까지 지원하며, 코드베이스 컨텍스트를 이해하고 PR 리뷰·이슈 해결을 자동화합니다.',
    description_ko:
      'GitHub의 AI 페어 프로그래머입니다. IDE 내 코드 자동완성부터 Agent 모드까지 지원하며, 코드베이스 컨텍스트를 이해하고 PR 리뷰·이슈 해결을 자동화합니다.',
    icon_url: null,
    website_url: 'https://github.com/features/copilot',
    docs_url: 'https://docs.github.com/en/copilot',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free 티어: 월 2,000 완성, 50 채팅 메시지',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Individual', price: '$10/월' },
        { name: 'Business', price: '$19/유저/월' },
        { name: 'Enterprise', price: '$39/유저/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'GITHUB_COPILOT_TOKEN',
        public: false,
        optional: true,
        description: 'GitHub Copilot token (auto-managed by IDE extension)',
        description_ko: 'GitHub Copilot 토큰 (IDE 확장이 자동 관리)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 97,
    difficulty_level: 'beginner',
    tags: ['copilot', 'github', 'ai-coding', 'pair-programming', 'llm', '코파일럿', '깃허브', 'AI코딩'],
    alternatives: ['cursor', 'windsurf', 'claude-code'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'svelte', 'nuxt', 'express', 'fastify', 'django', 'rails', 'flask', 'spring'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust', 'java', 'ruby', 'php', 'csharp', 'cpp', 'c'],
    },
    official_sdks: {
      vscode: 'https://marketplace.visualstudio.com/items?itemName=GitHub.copilot',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$10/월',
      enterprise: '$19/유저/월',
    },
  },

  // -----------------------------------------------------------------------
  // Bolt.new
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.bolt_new,
    name: 'Bolt.new',
    slug: 'bolt-new',
    category: 'ai',
    description:
      'StackBlitz 기반 AI 풀스택 앱 생성 플랫폼입니다. 프롬프트 한 줄로 브라우저 안에서 즉시 실행 가능한 풀스택 앱을 생성·편집·배포할 수 있습니다.',
    description_ko:
      'StackBlitz 기반 AI 풀스택 앱 생성 플랫폼입니다. 프롬프트 한 줄로 브라우저 안에서 즉시 실행 가능한 풀스택 앱을 생성·편집·배포할 수 있습니다.',
    icon_url: null,
    website_url: 'https://bolt.new',
    docs_url: 'https://docs.bolt.new',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: 일 토큰 한도, Pro $20/월, Unlimited $100/월',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$20/월' },
        { name: 'Unlimited', price: '$100/월' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 88,
    difficulty_level: 'beginner',
    tags: ['bolt', 'stackblitz', 'vibe-coding', 'app-builder', 'fullstack', 'no-code', '볼트', '바이브코딩', '앱빌더'],
    alternatives: ['lovable', 'replit', 'v0', 'manus', 'base44'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'svelte'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 1,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$20/월',
      enterprise: '$100/월',
    },
  },

  // -----------------------------------------------------------------------
  // Lovable
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.lovable,
    name: 'Lovable',
    slug: 'lovable',
    category: 'ai',
    description:
      'AI 기반 풀스택 앱 빌더(구 GPT Engineer)입니다. 프롬프트로 앱을 생성하고 Supabase 통합 및 배포까지 원스톱으로 처리합니다.',
    description_ko:
      'AI 기반 풀스택 앱 빌더(구 GPT Engineer)입니다. 프롬프트로 앱을 생성하고 Supabase 통합 및 배포까지 원스톱으로 처리합니다.',
    icon_url: null,
    website_url: 'https://lovable.dev',
    docs_url: 'https://docs.lovable.dev',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: 5 생성 포함, 이후 유료 전환',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Starter', price: '$20/월' },
        { name: 'Launch', price: '$50/월' },
        { name: 'Scale', price: '$100/월' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 85,
    difficulty_level: 'beginner',
    tags: ['lovable', 'gpt-engineer', 'vibe-coding', 'app-builder', 'supabase', 'fullstack', '러블리', '바이브코딩', '앱빌더'],
    alternatives: ['bolt-new', 'replit', 'v0', 'manus', 'base44'],
    compatibility: {
      framework: ['next', 'react'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 1,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$20/월',
      enterprise: '$100/월',
    },
  },

  // -----------------------------------------------------------------------
  // v0 by Vercel
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.v0,
    name: 'v0 by Vercel',
    slug: 'v0',
    category: 'ai',
    description:
      'Vercel의 AI UI 생성 도구입니다. 텍스트 프롬프트로 React/Next.js + shadcn/ui 컴포넌트를 즉시 생성하고, Vercel에 바로 배포할 수 있습니다.',
    description_ko:
      'Vercel의 AI UI 생성 도구입니다. 텍스트 프롬프트로 React/Next.js + shadcn/ui 컴포넌트를 즉시 생성하고, Vercel에 바로 배포할 수 있습니다.',
    icon_url: null,
    website_url: 'https://v0.dev',
    docs_url: 'https://v0.dev/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: 일 생성 크레딧 제한, Premium $20/월',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Premium', price: '$20/월' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 87,
    difficulty_level: 'beginner',
    tags: ['v0', 'vercel', 'ui-generation', 'shadcn', 'react', 'next', 'component', '브이제로', 'UI생성', '바이브코딩'],
    alternatives: ['bolt-new', 'lovable', 'google-stitch', 'tempo-labs'],
    compatibility: {
      framework: ['next', 'react'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 1,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$20/월',
      enterprise: '$20/월',
    },
  },

  // -----------------------------------------------------------------------
  // Replit
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.replit,
    name: 'Replit',
    slug: 'replit',
    category: 'ai',
    description:
      '클라우드 IDE + AI 에이전트 올인원 플랫폼입니다. 프롬프트로 풀스택 앱을 생성·실행·배포할 수 있으며, 협업 코딩 환경을 제공합니다.',
    description_ko:
      '클라우드 IDE + AI 에이전트 올인원 플랫폼입니다. 프롬프트로 풀스택 앱을 생성·실행·배포할 수 있으며, 협업 코딩 환경을 제공합니다.',
    icon_url: null,
    website_url: 'https://replit.com',
    docs_url: 'https://docs.replit.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: 기본 환경 제공, Core $25/월',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Core', price: '$25/월' },
        { name: 'Teams', price: '$15/시트/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'REPLIT_DB_URL',
        public: false,
        optional: true,
        description: 'Replit built-in key-value database URL (auto-provided inside Replit environment)',
        description_ko: 'Replit 내장 키-값 DB URL (Replit 환경 내에서 자동 제공)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 82,
    difficulty_level: 'beginner',
    tags: ['replit', 'cloud-ide', 'vibe-coding', 'deployment', 'collaboration', 'ai-agent', '리플릿', '클라우드IDE', '바이브코딩'],
    alternatives: ['bolt-new', 'lovable', 'manus', 'base44', 'rork', 'a0-dev'],
    compatibility: {
      framework: ['next', 'react', 'express', 'flask', 'django', 'rails'],
      language: ['javascript', 'typescript', 'python', 'go', 'ruby'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 2,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$25/월',
      enterprise: '$15/시트/월',
    },
  },

  // -----------------------------------------------------------------------
  // Cline
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.cline,
    name: 'Cline',
    slug: 'cline',
    category: 'ai',
    description:
      'VS Code용 오픈소스 AI 코딩 에이전트입니다. OpenAI, Anthropic, 로컬 모델 등 어떤 LLM이든 연결 가능하며, 파일 읽기·쓰기·터미널 실행까지 자율적으로 수행합니다.',
    description_ko:
      'VS Code용 오픈소스 AI 코딩 에이전트입니다. OpenAI, Anthropic, 로컬 모델 등 어떤 LLM이든 연결 가능하며, 파일 읽기·쓰기·터미널 실행까지 자율적으로 수행합니다.',
    icon_url: null,
    website_url: 'https://cline.bot',
    docs_url: 'https://github.com/cline/cline',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 무료 (LLM API 비용만 별도 부담)',
      plans: [{ name: 'Open Source', price: '$0 (API 비용 별도)' }],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        optional: true,
        description: 'OpenAI API key for use with Cline (model-dependent)',
        description_ko: 'Cline에서 OpenAI 모델 사용 시 필요한 API 키',
      },
      {
        name: 'ANTHROPIC_API_KEY',
        public: false,
        optional: true,
        description: 'Anthropic API key for use with Cline (model-dependent)',
        description_ko: 'Cline에서 Anthropic 모델 사용 시 필요한 API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 78,
    difficulty_level: 'intermediate',
    tags: ['cline', 'vscode', 'ai-agent', 'open-source', 'coding', 'llm', '클라인', 'AI에이전트', '코딩'],
    alternatives: ['cursor', 'claude-code', 'windsurf'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'svelte', 'nuxt', 'express', 'fastify', 'django', 'rails', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust', 'java', 'ruby', 'php', 'csharp'],
    },
    official_sdks: {
      vscode: 'https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    github_stars: 25000,
    monthly_cost_estimate: {
      starter: '$0 (OSS)',
      growth: 'API 사용량 기반',
      enterprise: 'API 사용량 기반',
    },
  },

  // -----------------------------------------------------------------------
  // OpenRouter
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.openrouter,
    name: 'OpenRouter',
    slug: 'openrouter',
    category: 'ai',
    description:
      '멀티 LLM API 라우터입니다. 단일 API 키로 OpenAI, Anthropic, Google, Meta 등 100개 이상의 모델에 접근할 수 있으며, 폴백·로드밸런싱·비용 최적화를 자동으로 처리합니다.',
    description_ko:
      '멀티 LLM API 라우터입니다. 단일 API 키로 OpenAI, Anthropic, Google, Meta 등 100개 이상의 모델에 접근할 수 있으며, 폴백·로드밸런싱·비용 최적화를 자동으로 처리합니다.',
    icon_url: null,
    website_url: 'https://openrouter.ai',
    docs_url: 'https://openrouter.ai/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '일부 무료 모델 제공, 유료 모델은 종량제',
      plans: [
        { name: 'Free Models', price: '$0' },
        { name: 'Pay-as-you-go', price: '모델별 토큰 단가 적용' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENROUTER_API_KEY',
        public: false,
        description: 'OpenRouter API key for accessing 100+ LLM models via unified API',
        description_ko: 'OpenRouter API 키 (100개 이상 LLM 모델 통합 접근용)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'llm_router',
    popularity_score: 80,
    difficulty_level: 'beginner',
    tags: ['openrouter', 'llm-router', 'multi-model', 'api-gateway', 'openai', 'anthropic', '오픈라우터', 'LLM라우터', '멀티모델'],
    alternatives: ['openai', 'anthropic', 'groq'],
    compatibility: {
      framework: ['next', 'react', 'express', 'fastify', 'hono', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python'],
    },
    official_sdks: {
      javascript: 'https://openrouter.ai/docs/community-libraries',
    },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '사용량 기반',
      enterprise: '사용량 기반',
    },
  },

  // -----------------------------------------------------------------------
  // Hugging Face
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.huggingface,
    name: 'Hugging Face',
    slug: 'huggingface',
    category: 'ai',
    description:
      '오픈소스 ML 모델 허브입니다. 100만 개 이상의 모델·데이터셋을 호스팅하며, Inference API, Spaces(무료 배포), AutoTrain 파인튜닝 기능을 제공합니다.',
    description_ko:
      '오픈소스 ML 모델 허브입니다. 100만 개 이상의 모델·데이터셋을 호스팅하며, Inference API, Spaces(무료 배포), AutoTrain 파인튜닝 기능을 제공합니다.',
    icon_url: null,
    website_url: 'https://huggingface.co',
    docs_url: 'https://huggingface.co/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: Inference API 제한적 사용, Spaces 무료 호스팅',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$9/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'HF_TOKEN',
        public: false,
        description: 'Hugging Face API token for Inference API and private model access',
        description_ko: 'Hugging Face API 토큰 (Inference API 및 비공개 모델 접근용)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'model_hub',
    popularity_score: 92,
    difficulty_level: 'intermediate',
    tags: ['huggingface', 'ml-models', 'transformers', 'inference', 'open-source', 'llm', '허깅페이스', '모델허브', 'AI'],
    alternatives: ['replicate', 'together-ai'],
    compatibility: {
      framework: ['next', 'react', 'express', 'fastify', 'django', 'flask'],
      language: ['python', 'javascript', 'typescript', 'rust'],
    },
    official_sdks: {
      python: 'https://github.com/huggingface/huggingface_hub',
      javascript: 'https://github.com/huggingface/huggingface.js',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$9/월',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // Replicate
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.replicate,
    name: 'Replicate',
    slug: 'replicate',
    category: 'ai',
    description:
      '클라우드 ML 모델 실행 API 플랫폼입니다. API 한 줄로 Stable Diffusion, Llama, Whisper 등 오픈소스 모델을 서버 없이 실행할 수 있으며, 커스텀 모델 배포도 지원합니다.',
    description_ko:
      '클라우드 ML 모델 실행 API 플랫폼입니다. API 한 줄로 Stable Diffusion, Llama, Whisper 등 오픈소스 모델을 서버 없이 실행할 수 있으며, 커스텀 모델 배포도 지원합니다.',
    icon_url: null,
    website_url: 'https://replicate.com',
    docs_url: 'https://replicate.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '신규 가입 시 무료 크레딧 제공, 이후 GPU 초당 과금',
      plans: [
        { name: 'Pay-as-you-go', price: 'GPU 초당 과금' },
        { name: 'Deployments', price: '전용 GPU 예약 비용' },
      ],
    },
    required_env_vars: [
      {
        name: 'REPLICATE_API_TOKEN',
        public: false,
        description: 'Replicate API token for running ML models via API',
        description_ko: 'Replicate API 토큰 (ML 모델 API 실행용)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'model_hub',
    popularity_score: 80,
    difficulty_level: 'beginner',
    tags: ['replicate', 'ml-serving', 'model-api', 'gpu', 'stable-diffusion', 'image-generation', '레플리케이트', '모델서빙', 'AI'],
    alternatives: ['huggingface', 'modal', 'together-ai'],
    compatibility: {
      framework: ['next', 'react', 'express'],
      language: ['javascript', 'typescript', 'python', 'go', 'swift'],
    },
    official_sdks: {
      javascript: 'https://github.com/replicate/replicate-javascript',
      python: 'https://github.com/replicate/replicate-python',
    },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: {
      starter: '$0 (크레딧)',
      growth: '사용량 기반',
      enterprise: '사용량 기반',
    },
  },

  // -----------------------------------------------------------------------
  // Convex
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.convex,
    name: 'Convex',
    slug: 'convex',
    category: 'database',
    description:
      '리액티브 서버리스 백엔드 플랫폼입니다. 실시간 데이터베이스, 서버 함수, 스케줄링, 파일 스토리지, 인증을 하나의 플랫폼에서 제공하며, 상태 변경을 클라이언트에 자동으로 푸시합니다.',
    description_ko:
      '리액티브 서버리스 백엔드 플랫폼입니다. 실시간 데이터베이스, 서버 함수, 스케줄링, 파일 스토리지, 인증을 하나의 플랫폼에서 제공하며, 상태 변경을 클라이언트에 자동으로 푸시합니다.',
    icon_url: null,
    website_url: 'https://convex.dev',
    docs_url: 'https://docs.convex.dev',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: 넉넉한 무료 한도 제공 (함수 호출 100만/월, DB 1GB)',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$25/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'CONVEX_DEPLOYMENT',
        public: false,
        description: 'Convex deployment name (e.g. dev:project-name-123)',
        description_ko: 'Convex 배포 이름 (예: dev:project-name-123)',
      },
      {
        name: 'NEXT_PUBLIC_CONVEX_URL',
        public: true,
        description: 'Convex deployment URL for client-side connection',
        description_ko: 'Convex 배포 URL (클라이언트 연결용 공개 키)',
      },
    ],
    domain: 'backend',
    subcategory: 'reactive_backend',
    popularity_score: 75,
    difficulty_level: 'beginner',
    tags: ['convex', 'reactive', 'realtime', 'serverless', 'backend', 'database', '컨벡스', '리액티브', '실시간DB'],
    alternatives: ['supabase', 'firebase'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'svelte'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      javascript: 'https://github.com/get-convex/convex-js',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$25/월',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // Turso
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.turso,
    name: 'Turso',
    slug: 'turso',
    category: 'database',
    description:
      'libSQL(SQLite 포크) 기반 에지 분산 데이터베이스입니다. 글로벌 복제로 초저지연을 달성하며, 수천 개의 멀티 테넌트 DB를 저비용으로 운영할 수 있습니다.',
    description_ko:
      'libSQL(SQLite 포크) 기반 에지 분산 데이터베이스입니다. 글로벌 복제로 초저지연을 달성하며, 수천 개의 멀티 테넌트 DB를 저비용으로 운영할 수 있습니다.',
    icon_url: null,
    website_url: 'https://turso.tech',
    docs_url: 'https://docs.turso.tech',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: DB 500개, 스토리지 9GB, 월 1억 행 읽기 포함',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Scaler', price: '$29/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'TURSO_DATABASE_URL',
        public: false,
        description: 'Turso database connection URL (libsql://...)',
        description_ko: 'Turso 데이터베이스 연결 URL (libsql://...)',
      },
      {
        name: 'TURSO_AUTH_TOKEN',
        public: false,
        description: 'Turso database authentication token',
        description_ko: 'Turso 데이터베이스 인증 토큰',
      },
    ],
    domain: 'backend',
    subcategory: 'edge_db',
    popularity_score: 72,
    difficulty_level: 'intermediate',
    tags: ['turso', 'libsql', 'sqlite', 'edge-database', 'distributed', 'multi-tenant', '터소', '에지DB', 'SQLite'],
    alternatives: ['neon', 'planetscale', 'supabase'],
    compatibility: {
      framework: ['next', 'react', 'express', 'hono'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust'],
    },
    official_sdks: {
      javascript: 'https://github.com/tursodatabase/libsql-client-ts',
      python: 'https://github.com/tursodatabase/libsql-client-py',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$29/월',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // Prisma
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.prisma,
    name: 'Prisma',
    slug: 'prisma',
    category: 'database',
    description:
      'TypeScript/Node.js 차세대 ORM입니다. 타입 안전 쿼리 빌더, 선언형 스키마 마이그레이션, Prisma Studio GUI를 제공하며 PostgreSQL, MySQL, SQLite, MongoDB 등을 지원합니다.',
    description_ko:
      'TypeScript/Node.js 차세대 ORM입니다. 타입 안전 쿼리 빌더, 선언형 스키마 마이그레이션, Prisma Studio GUI를 제공하며 PostgreSQL, MySQL, SQLite, MongoDB 등을 지원합니다.',
    icon_url: null,
    website_url: 'https://www.prisma.io',
    docs_url: 'https://www.prisma.io/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'ORM 자체는 오픈소스 무료, Prisma Accelerate/Pulse는 별도 유료',
      plans: [
        { name: 'ORM (OSS)', price: '$0' },
        { name: 'Accelerate', price: '$29/월~' },
        { name: 'Pulse', price: '$29/월~' },
      ],
    },
    required_env_vars: [
      {
        name: 'DATABASE_URL',
        public: false,
        description: 'Database connection string for Prisma (PostgreSQL, MySQL, SQLite, etc.)',
        description_ko: 'Prisma DB 연결 문자열 (PostgreSQL, MySQL, SQLite 등)',
      },
    ],
    domain: 'backend',
    subcategory: 'orm',
    popularity_score: 90,
    difficulty_level: 'beginner',
    tags: ['prisma', 'orm', 'typescript', 'database', 'migration', 'type-safe', 'postgresql', '프리즈마', 'ORM', '데이터베이스'],
    alternatives: ['supabase', 'neon'],
    compatibility: {
      framework: ['next', 'express', 'fastify', 'hono', 'nuxt'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/prisma',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    github_stars: 40000,
    monthly_cost_estimate: {
      starter: '$0 (OSS)',
      growth: '$29/월 (Accelerate)',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // Paddle
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.paddle,
    name: 'Paddle',
    slug: 'paddle',
    category: 'payment',
    description:
      'SaaS Merchant of Record(MoR) 결제 플랫폼입니다. 글로벌 세금·VAT·컴플라이언스를 Paddle이 대신 처리하며, 구독 관리·청구서·환불을 통합 제공합니다.',
    description_ko:
      'SaaS Merchant of Record(MoR) 결제 플랫폼입니다. 글로벌 세금·VAT·컴플라이언스를 Paddle이 대신 처리하며, 구독 관리·청구서·환불을 통합 제공합니다.',
    icon_url: null,
    website_url: 'https://www.paddle.com',
    docs_url: 'https://developer.paddle.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 샌드박스 환경 제공, 프로덕션은 거래금액의 5%+50¢',
      plans: [
        { name: 'Sandbox', price: '$0' },
        { name: 'Production', price: '5% + $0.50/건' },
        { name: 'Enterprise', price: '문의 (맞춤 요율)' },
      ],
    },
    required_env_vars: [
      {
        name: 'PADDLE_API_KEY',
        public: false,
        description: 'Paddle API key for server-side operations (billing, subscriptions)',
        description_ko: 'Paddle 서버 사이드 API 키 (결제·구독 처리용)',
      },
      {
        name: 'PADDLE_WEBHOOK_SECRET',
        public: false,
        description: 'Paddle webhook signing secret for verifying webhook payloads',
        description_ko: 'Paddle 웹훅 서명 시크릿 (페이로드 검증용)',
      },
      {
        name: 'NEXT_PUBLIC_PADDLE_CLIENT_TOKEN',
        public: true,
        description: 'Paddle client-side token for Paddle.js checkout integration',
        description_ko: 'Paddle.js 결제창 연동용 클라이언트 토큰 (공개 가능)',
      },
    ],
    domain: 'business',
    subcategory: 'subscription_mor',
    popularity_score: 72,
    difficulty_level: 'intermediate',
    tags: ['paddle', 'payment', 'mor', 'billing', 'subscription', 'tax', 'saas', '패들', '결제', '구독'],
    alternatives: ['stripe', 'lemon-squeezy', 'polar'],
    compatibility: {
      framework: ['next', 'react', 'express'],
      language: ['javascript', 'typescript', 'python', 'go', 'php'],
    },
    official_sdks: {
      javascript: 'https://github.com/PaddleHQ/paddle-js-wrapper',
      node: 'https://github.com/PaddleHQ/paddle-node-sdk',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 30,
    monthly_cost_estimate: {
      starter: '$0 (샌드박스)',
      growth: '5% + $0.50/건',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // Payload CMS
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.payload_cms,
    name: 'Payload CMS',
    slug: 'payload-cms',
    category: 'cms',
    description:
      'Next.js 네이티브 헤드리스 CMS입니다. 앱 안에 직접 내장 가능하며, 코드 퍼스트 스키마 정의, 자동 REST/GraphQL API, 내장 어드민 UI를 제공합니다.',
    description_ko:
      'Next.js 네이티브 헤드리스 CMS입니다. 앱 안에 직접 내장 가능하며, 코드 퍼스트 스키마 정의, 자동 REST/GraphQL API, 내장 어드민 UI를 제공합니다.',
    icon_url: null,
    website_url: 'https://payloadcms.com',
    docs_url: 'https://payloadcms.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 셀프호스팅 무료, Payload Cloud $35/월~',
      plans: [
        { name: 'Self-hosted (OSS)', price: '$0' },
        { name: 'Payload Cloud', price: '$35/월~' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'PAYLOAD_SECRET',
        public: false,
        description: 'Payload CMS secret key used for encryption and JWT signing',
        description_ko: 'Payload CMS 암호화 및 JWT 서명용 시크릿 키',
      },
      {
        name: 'DATABASE_URI',
        public: false,
        description: 'Database connection URI for Payload (MongoDB or PostgreSQL)',
        description_ko: 'Payload DB 연결 URI (MongoDB 또는 PostgreSQL)',
      },
      {
        name: 'PAYLOAD_PUBLIC_SERVER_URL',
        public: true,
        description: 'Public server URL for Payload CMS (used for media and redirects)',
        description_ko: 'Payload CMS 공개 서버 URL (미디어 및 리다이렉트용)',
      },
    ],
    domain: 'business',
    subcategory: 'headless-cms',
    popularity_score: 78,
    difficulty_level: 'intermediate',
    tags: ['payload', 'cms', 'headless', 'nextjs', 'open-source', 'graphql', '페이로드', 'CMS', '헤드리스'],
    alternatives: ['sanity', 'contentful', 'strapi'],
    compatibility: {
      framework: ['next', 'express'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/payload',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 20,
    github_stars: 30000,
    monthly_cost_estimate: {
      starter: '$0 (셀프호스팅)',
      growth: '$35/월',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // Axiom
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.axiom,
    name: 'Axiom',
    slug: 'axiom',
    category: 'logging',
    description:
      '서버리스 환경에 최적화된 로그 분석 플랫폼입니다. Vercel 네이티브 통합을 제공하며, 수집한 로그·이벤트를 실시간으로 쿼리·시각화하고 무제한 데이터 보존을 지원합니다.',
    description_ko:
      '서버리스 환경에 최적화된 로그 분석 플랫폼입니다. Vercel 네이티브 통합을 제공하며, 수집한 로그·이벤트를 실시간으로 쿼리·시각화하고 무제한 데이터 보존을 지원합니다.',
    icon_url: null,
    website_url: 'https://axiom.co',
    docs_url: 'https://axiom.co/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: 월 500GB 인제스트, 30일 보존',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$25/월~' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'AXIOM_TOKEN',
        public: false,
        description: 'Axiom API token for ingesting logs and events',
        description_ko: 'Axiom 로그·이벤트 수집용 API 토큰',
      },
      {
        name: 'AXIOM_ORG_ID',
        public: false,
        description: 'Axiom organization ID',
        description_ko: 'Axiom 조직 ID',
      },
      {
        name: 'AXIOM_DATASET',
        public: false,
        description: 'Axiom dataset name to ingest data into',
        description_ko: '데이터를 수집할 Axiom 데이터셋 이름',
      },
    ],
    domain: 'observability',
    subcategory: 'log_management',
    popularity_score: 73,
    difficulty_level: 'beginner',
    tags: ['axiom', 'logging', 'observability', 'vercel', 'serverless', 'analytics', '액시옴', '로그', '모니터링'],
    alternatives: ['datadog', 'logrocket', 'sentry'],
    compatibility: {
      framework: ['next', 'express', 'hono'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust'],
    },
    official_sdks: {
      javascript: 'https://github.com/axiomhq/axiom-js',
      python: 'https://github.com/axiomhq/axiom-py',
      go: 'https://github.com/axiomhq/axiom-go',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$25/월~',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // Better Stack
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.betterstack,
    name: 'Better Stack',
    slug: 'betterstack',
    category: 'monitoring',
    description:
      '올인원 관측성 플랫폼입니다. 업타임 모니터링, 로그 관리(Logtail), 상태 페이지, 온콜 인시던트 관리를 단일 대시보드에서 제공합니다.',
    description_ko:
      '올인원 관측성 플랫폼입니다. 업타임 모니터링, 로그 관리(Logtail), 상태 페이지, 온콜 인시던트 관리를 단일 대시보드에서 제공합니다.',
    icon_url: null,
    website_url: 'https://betterstack.com',
    docs_url: 'https://betterstack.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: 업타임 5개 모니터, 로그 1GB/월',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Plus', price: '$29/월' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'BETTERSTACK_API_TOKEN',
        public: false,
        description: 'Better Stack API token for uptime and incident management',
        description_ko: 'Better Stack API 토큰 (업타임·인시던트 관리용)',
      },
      {
        name: 'LOGTAIL_SOURCE_TOKEN',
        public: false,
        description: 'Logtail source token for log ingestion (Better Stack Logs)',
        description_ko: 'Logtail 소스 토큰 (Better Stack 로그 전송용)',
      },
    ],
    domain: 'observability',
    subcategory: 'monitoring-apm',
    popularity_score: 70,
    difficulty_level: 'beginner',
    tags: ['betterstack', 'uptime', 'logging', 'status-page', 'incident', 'logtail', '베터스택', '업타임', '모니터링', '상태페이지'],
    alternatives: ['sentry', 'datadog'],
    compatibility: {
      framework: ['next', 'express', 'hono'],
      language: ['javascript', 'typescript', 'python', 'go', 'ruby', 'php'],
    },
    official_sdks: {
      javascript: 'https://github.com/BetterStackHQ/logtail-js',
      python: 'https://github.com/BetterStackHQ/logtail-python',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$29/월',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // Novu
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.novu,
    name: 'Novu',
    slug: 'novu',
    category: 'push',
    description:
      '오픈소스 멀티채널 알림 인프라입니다. 이메일·SMS·푸시·인앱·채팅 알림을 단일 API로 오케스트레이션하며, 노코드 워크플로우 에디터와 사용자 선호 관리 기능을 내장합니다.',
    description_ko:
      '오픈소스 멀티채널 알림 인프라입니다. 이메일·SMS·푸시·인앱·채팅 알림을 단일 API로 오케스트레이션하며, 노코드 워크플로우 에디터와 사용자 선호 관리 기능을 내장합니다.',
    icon_url: null,
    website_url: 'https://novu.co',
    docs_url: 'https://docs.novu.co',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: 월 30,000 이벤트 포함, 이후 종량제',
      plans: [
        { name: 'Free', price: '$0/월 (30K 이벤트)' },
        { name: 'Business', price: '종량제' },
        { name: 'Enterprise', price: '문의' },
      ],
    },
    required_env_vars: [
      {
        name: 'NOVU_API_KEY',
        public: false,
        description: 'Novu API key for triggering notifications via server-side SDK',
        description_ko: 'Novu 서버 사이드 알림 트리거용 API 키',
      },
      {
        name: 'NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER',
        public: true,
        description: 'Novu application identifier for client-side in-app notification inbox',
        description_ko: 'Novu 인앱 알림 수신함 연동용 클라이언트 공개 식별자',
      },
    ],
    domain: 'communication',
    subcategory: 'notification_infra',
    popularity_score: 72,
    difficulty_level: 'intermediate',
    tags: ['novu', 'notifications', 'multi-channel', 'email', 'sms', 'push', 'in-app', 'open-source', '노부', '알림', '멀티채널'],
    alternatives: ['onesignal', 'twilio'],
    compatibility: {
      framework: ['next', 'react', 'express', 'nestjs'],
      language: ['javascript', 'typescript', 'python', 'go', 'ruby', 'php'],
    },
    official_sdks: {
      javascript: 'https://github.com/novuhq/novu/tree/main/packages/node',
      python: 'https://github.com/novuhq/novu-python',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    github_stars: 35000,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '종량제',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // Manus
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.manus,
    name: 'Manus',
    slug: 'manus',
    category: 'ai',
    description:
      '자율 AI 에이전트 플랫폼입니다. 웹 브라우징·코딩·파일 처리·데이터 분석을 AI가 스스로 계획·실행하며, 웹사이트·앱·리서치 보고서를 프롬프트 하나로 완성합니다.',
    description_ko:
      '자율 AI 에이전트 플랫폼입니다. 웹 브라우징·코딩·파일 처리·데이터 분석을 AI가 스스로 계획·실행하며, 웹사이트·앱·리서치 보고서를 프롬프트 하나로 완성합니다.',
    icon_url: null,
    website_url: 'https://manus.im',
    docs_url: 'https://manus.im/blog',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: 일 300 크레딧 제공 (매일 초기화), 최대 5개 동시 태스크',
      plans: [
        { name: 'Free', price: '$0/월 (일 300 크레딧)' },
        { name: 'Starter', price: '$20/월 (4,000 크레딧)' },
        { name: 'Pro', price: '$40/월 (8,000 크레딧)' },
        { name: 'Extended', price: '$200/월 (40,000 크레딧)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 88,
    difficulty_level: 'beginner',
    tags: ['manus', 'ai-agent', 'autonomous', 'vibe-coding', 'app-builder', 'research', 'web-browsing', '마누스', '자율에이전트', '바이브코딩'],
    alternatives: ['bolt-new', 'lovable', 'replit', 'devin'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'express', 'fastapi'],
      language: ['javascript', 'typescript', 'python'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 1,
    monthly_cost_estimate: {
      starter: '$0 (일 300 크레딧)',
      growth: '$20~$40/월',
      enterprise: '$200/월~',
    },
  },

  // -----------------------------------------------------------------------
  // Devin (Cognition)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.devin,
    name: 'Devin',
    slug: 'devin',
    category: 'ai',
    description:
      'Cognition이 개발한 자율 AI 소프트웨어 엔지니어입니다. 독립적인 가상 환경에서 코드 작성·테스트·PR 제출·배포까지 전 과정을 자율 수행하며, 팀 협업 워크플로우에 통합됩니다.',
    description_ko:
      'Cognition이 개발한 자율 AI 소프트웨어 엔지니어입니다. 독립적인 가상 환경에서 코드 작성·테스트·PR 제출·배포까지 전 과정을 자율 수행하며, 팀 협업 워크플로우에 통합됩니다.',
    icon_url: null,
    website_url: 'https://devin.ai',
    docs_url: 'https://docs.devin.ai',
    pricing_info: {
      free_tier: false,
      free_tier_details: '무료 플랜 없음. Core $20/월부터 시작 (ACU 종량제)',
      plans: [
        { name: 'Core', price: '$20/월 (ACU $2.25/개, 1 ACU ≈ 15분 작업)' },
        { name: 'Team', price: '$500/월 (250 ACU 포함, 추가 $2.00/ACU)' },
        { name: 'Enterprise', price: '문의 (VPC 배포, SAML SSO)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 85,
    difficulty_level: 'intermediate',
    tags: ['devin', 'cognition', 'ai-engineer', 'autonomous', 'agentic', 'software-engineering', 'devops', '데빈', '자율엔지니어', 'AI에이전트'],
    alternatives: ['cursor', 'cline', 'claude-code', 'manus'],
    compatibility: {
      framework: ['next', 'react', 'express', 'fastapi', 'django', 'rails', 'spring'],
      language: ['javascript', 'typescript', 'python', 'go', 'java', 'ruby', 'rust'],
    },
    official_sdks: {},
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 15,
    monthly_cost_estimate: {
      starter: '$20/월',
      growth: '$500/월',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // Base44 (Wix)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.base44,
    name: 'Base44',
    slug: 'base44',
    category: 'ai',
    description:
      'Wix가 인수한 AI 기반 풀스택 앱 빌더입니다. 이중 크레딧 시스템(빌딩용 메시지 크레딧 + 운영용 인테그레이션 크레딧)으로 Stripe·Slack·OpenAI 등 네이티브 통합을 지원합니다.',
    description_ko:
      'Wix가 인수한 AI 기반 풀스택 앱 빌더입니다. 이중 크레딧 시스템(빌딩용 메시지 크레딧 + 운영용 인테그레이션 크레딧)으로 Stripe·Slack·OpenAI 등 네이티브 통합을 지원합니다.',
    icon_url: null,
    website_url: 'https://base44.com',
    docs_url: 'https://base44.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Forever Free: 25 메시지 크레딧 + 100 인테그레이션 크레딧, 무제한 앱',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Starter', price: '$16/월 (연간)~' },
        { name: 'Pro', price: '$160/월 (연간, 최상위)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 80,
    difficulty_level: 'beginner',
    tags: ['base44', 'wix', 'app-builder', 'vibe-coding', 'fullstack', 'no-code', 'stripe', 'openai', '베이스44', '바이브코딩', '앱빌더'],
    alternatives: ['bolt-new', 'lovable', 'replit', 'manus'],
    compatibility: {
      framework: ['react'],
      language: ['javascript'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 2,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$16~$80/월',
      enterprise: '$160/월',
    },
  },

  // -----------------------------------------------------------------------
  // Rork
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.rork,
    name: 'Rork',
    slug: 'rork',
    category: 'ai',
    description:
      'AI 기반 모바일 앱 빌더입니다. React Native 기반 iOS·Android 앱을 프롬프트로 생성하며, 프리미엄 서비스인 Rork Max는 네이티브 Swift로 Apple 생태계 전용 앱을 빌드합니다.',
    description_ko:
      'AI 기반 모바일 앱 빌더입니다. React Native 기반 iOS·Android 앱을 프롬프트로 생성하며, 프리미엄 서비스인 Rork Max는 네이티브 Swift로 Apple 생태계 전용 앱을 빌드합니다.',
    icon_url: null,
    website_url: 'https://rork.com',
    docs_url: 'https://rork.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: 월 35 크레딧 (일 5 크레딧 한도)',
      plans: [
        { name: 'Free', price: '$0/월 (35 크레딧)' },
        { name: 'Junior', price: '$25/월 (100 크레딧)' },
        { name: 'Middle', price: '$50/월' },
        { name: 'Senior', price: '$100/월' },
        { name: 'Rork Max', price: '$200/월 (네이티브 Swift)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 72,
    difficulty_level: 'beginner',
    tags: ['rork', 'mobile', 'ios', 'android', 'react-native', 'swift', 'app-builder', 'vibe-coding', '로크', '모바일앱', '바이브코딩'],
    alternatives: ['a0-dev', 'bolt-new', 'replit'],
    compatibility: {
      framework: ['react-native', 'expo'],
      language: ['javascript', 'typescript', 'swift'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 2,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$25~$100/월',
      enterprise: '$200/월 (Rork Max)',
    },
  },

  // -----------------------------------------------------------------------
  // a0.dev
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.a0_dev,
    name: 'a0.dev',
    slug: 'a0-dev',
    category: 'ai',
    description:
      'AI 기반 모바일 앱 빌더로, 프롬프트에서 iOS·Android 앱을 생성해 App Store와 Google Play에 직접 제출합니다. YC 출신으로 스토어 제출까지 원클릭으로 처리합니다.',
    description_ko:
      'AI 기반 모바일 앱 빌더로, 프롬프트에서 iOS·Android 앱을 생성해 App Store와 Google Play에 직접 제출합니다. YC 출신으로 스토어 제출까지 원클릭으로 처리합니다.',
    icon_url: null,
    website_url: 'https://a0.dev',
    docs_url: 'https://a0.dev/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: 일 메시지 한도 제공',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$20/월 (일 100 메시지)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 68,
    difficulty_level: 'beginner',
    tags: ['a0dev', 'mobile', 'ios', 'android', 'app-store', 'google-play', 'vibe-coding', 'app-builder', 'yc', 'a0.dev', '모바일앱', '바이브코딩'],
    alternatives: ['rork', 'bolt-new', 'replit'],
    compatibility: {
      framework: ['react-native', 'expo'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 2,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$20/월',
      enterprise: '문의',
    },
  },

  // -----------------------------------------------------------------------
  // Tempo Labs
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.tempo_labs,
    name: 'Tempo',
    slug: 'tempo-labs',
    category: 'ai',
    description:
      'React 전용 AI 앱 빌더입니다. 멀티 에이전트 플래닝 시스템이 사용자 흐름도·아키텍처를 먼저 설계한 뒤 코드를 생성하며, 기존 React 코드베이스에 직접 통합할 수 있습니다.',
    description_ko:
      'React 전용 AI 앱 빌더입니다. 멀티 에이전트 플래닝 시스템이 사용자 흐름도·아키텍처를 먼저 설계한 뒤 코드를 생성하며, 기존 React 코드베이스에 직접 통합할 수 있습니다.',
    icon_url: null,
    website_url: 'https://tempo.new',
    docs_url: 'https://docs.tempo.new',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free: 월 30 크레딧 (일 5 크레딧 한도)',
      plans: [
        { name: 'Free', price: '$0/월 (30 크레딧)' },
        { name: 'Pro', price: '$30/월 (150 크레딧)' },
        { name: 'Agent+', price: '$4,500/월 (휴먼 어시스트 개발)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 65,
    difficulty_level: 'beginner',
    tags: ['tempo', 'tempo-labs', 'react', 'vibe-coding', 'app-builder', 'multi-agent', 'ui-generation', '템포', 'React빌더', '바이브코딩'],
    alternatives: ['v0', 'bolt-new', 'lovable'],
    compatibility: {
      framework: ['react', 'next'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 3,
    monthly_cost_estimate: {
      starter: '$0',
      growth: '$30/월',
      enterprise: '$4,500/월',
    },
  },
];
