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

  // --- 2026-07 신규: 바이브코딩·AI 서비스 20종 ---
  zed: '10000000-0000-4000-a000-000000000165',
  kiro: '10000000-0000-4000-a000-000000000166',
  google_jules: '10000000-0000-4000-a000-000000000167',
  trae: '10000000-0000-4000-a000-000000000168',
  warp: '10000000-0000-4000-a000-000000000169',
  aider: '10000000-0000-4000-a000-000000000170',
  openai_codex: '10000000-0000-4000-a000-000000000171',
  cerebras: '10000000-0000-4000-a000-000000000172',
  sambanova: '10000000-0000-4000-a000-000000000173',
  vercel_ai_sdk: '10000000-0000-4000-a000-000000000174',
  langgraph: '10000000-0000-4000-a000-000000000175',
  llamaindex: '10000000-0000-4000-a000-000000000176',
  mastra: '10000000-0000-4000-a000-000000000177',
  composio: '10000000-0000-4000-a000-000000000178',
  same_new: '10000000-0000-4000-a000-000000000179',
  zilliz_cloud: '10000000-0000-4000-a000-000000000180',
  langfuse: '10000000-0000-4000-a000-000000000181',
  helicone: '10000000-0000-4000-a000-000000000182',
  portkey: '10000000-0000-4000-a000-000000000183',
  litellm: '10000000-0000-4000-a000-000000000184',
  // Google Workspace / Cloud services
  google_drive: '10000000-0000-4000-a000-000000000185',
  google_sheets_api: '10000000-0000-4000-a000-000000000186',
  google_calendar_api: '10000000-0000-4000-a000-000000000187',
  google_cloud_storage: '10000000-0000-4000-a000-000000000188',
  google_maps_platform: '10000000-0000-4000-a000-000000000189',
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
    description: 'GitHub 저장소에 내장된 CI/CD 자동화 플랫폼으로, 워크플로우 YAML 정의만으로 빌드·테스트·배포 파이프라인을 구성할 수 있습니다.',
    description_ko: 'GitHub 저장소에 내장된 CI/CD 자동화 플랫폼으로, 워크플로우 YAML 정의만으로 빌드·테스트·배포 파이프라인을 구성할 수 있습니다.',
    icon_url: null,
    website_url: 'https://github.com/features/actions',
    docs_url: 'https://docs.github.com/en/actions',
    pricing_info: {
      free_tier: true,
      free_tier_details: '공개 저장소는 완전 무료·무제한. 비공개 저장소는 플랜별 무료 분(Free 2,000분/Pro 3,000분/Team 3,000분/Enterprise 50,000분) 제공 후 종량제',
      plans: [
        { name: '종량제 (Linux 2-core)', price: '$0.006/분' },
        { name: '종량제 (Windows)', price: '$0.010/분' },
        { name: '종량제 (macOS)', price: '$0.062/분' },
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
    monthly_cost_estimate: { starter: '$0 (2,000분 포함)', growth: '종량제 $0.006/분~', enterprise: '$0 (50,000분 포함)' },
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
      'SMS, 음성통화, WhatsApp 등 클라우드 커뮤니케이션 API를 제공하는 플랫폼으로, 최소 약정 없는 사용량 기반(pay-as-you-go) 과금 모델을 사용합니다. 미국 기준 SMS 단가는 발신/수신 각 $0.0083이며, 통신사(carrier) 추가 수수료가 별도로 부과될 수 있습니다.',
    description_ko:
      'SMS, 음성통화, WhatsApp 등 클라우드 커뮤니케이션 API를 제공하는 플랫폼으로, 최소 약정 없는 사용량 기반(pay-as-you-go) 과금 모델을 사용합니다. 미국 기준 SMS 단가는 발신/수신 각 $0.0083이며, 통신사(carrier) 추가 수수료가 별도로 부과될 수 있습니다.',
    icon_url: null,
    website_url: 'https://www.twilio.com',
    docs_url: 'https://www.twilio.com/docs',
    pricing_info: {
      free_tier: false,
      free_tier_details: '신용카드 없이 가입 가능한 무료 체험판(trial) 제공. 구체적 무료 크레딧 금액은 공식 가격 페이지에 명시되어 있지 않음.',
      plans: [
        { name: 'SMS (미국, 롱코드)', price: '발신/수신 각 $0.0083/건 + 통신사 수수료 별도' },
        { name: '전화번호(롱코드)', price: '$1.15/월' },
        { name: '전화번호(수신자부담/Toll-free)', price: '$2.15/월' },
        { name: 'MMS', price: '발신 $0.022/건, 수신 $0.0165/건' },
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
    monthly_cost_estimate: { starter: '사용량 기반 (약정 없음)', growth: '사용량 기반', enterprise: '볼륨 계약 협의' },
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
      '푸시 알림·이메일·SMS·인앱 메시지를 아우르는 고객 참여(engagement) 플랫폼입니다. Free/Growth/Professional/Enterprise 요금제로 운영되며 구독자 수와 채널별 발송량을 기준으로 과금됩니다.',
    description_ko:
      '푸시 알림·이메일·SMS·인앱 메시지를 아우르는 고객 참여(engagement) 플랫폼입니다. Free/Growth/Professional/Enterprise 요금제로 운영되며 구독자 수와 채널별 발송량을 기준으로 과금됩니다.',
    icon_url: null,
    website_url: 'https://onesignal.com',
    docs_url: 'https://documentation.onesignal.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무제한 모바일 푸시, 웹푸시 최대 10,000 구독자, 월 이메일 10,000건, 기본 분석·자동화 포함.',
      plans: [
        { name: 'Growth', price: '$19/월부터 + 채널별 사용량 과금(예: 이메일 무료 2만 건 초과 시 1,000건당 $1.50)' },
        { name: 'Professional', price: '맞춤 견적 (채널별 가격, 볼륨 할인 가능, 연 단위)' },
        { name: 'Enterprise', price: '맞춤 견적 (연 단위 계약)' },
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
    alternatives: ['novu', 'pusher'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$19~ (사용량 추가)', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // 4. Algolia
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.algolia,
    name: 'Algolia',
    slug: 'algolia',
    category: 'search',
    description: 'AI 기반 하이브리드 검색·추천 경험을 API로 구축할 수 있는 검색 인프라 플랫폼입니다.',
    description_ko: 'AI 기반 하이브리드 검색·추천 경험을 API로 구축할 수 있는 검색 인프라 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://www.algolia.com',
    docs_url: 'https://www.algolia.com/doc',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Build 플랜: 월 10,000 검색 요청 + 레코드 100만 개 포함(개발/테스트용).',
      plans: [
        { name: 'Grow', price: '10K 검색 포함 후 1K당 $0.50, 레코드 100K 포함 후 1K당 $0.40' },
        { name: 'Grow Plus(AI)', price: '10K 검색 포함 후 1K당 $1.75' },
        { name: 'Elevate', price: '볼륨 기반 맞춤 할인, 연 계약' },
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
    monthly_cost_estimate: { starter: '$0(월 1만 요청까지)', growth: '사용량 종량제', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // 5. Sanity
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.sanity,
    name: 'Sanity',
    slug: 'sanity',
    category: 'cms',
    description: '구조화된 콘텐츠를 실시간으로 편집·협업할 수 있는 헤드리스 CMS 플랫폼(Sanity Studio + Content Lake)입니다.',
    description_ko: '구조화된 콘텐츠를 실시간으로 편집·협업할 수 있는 헤드리스 CMS 플랫폼(Sanity Studio + Content Lake)입니다.',
    icon_url: null,
    website_url: 'https://www.sanity.io',
    docs_url: 'https://www.sanity.io/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '영구 무료: 사용자 20명, 데이터셋 2개(공개만), 문서 1만 개.',
      plans: [
        { name: 'Growth', price: '$15/사용자/월, 최대 50명, 데이터셋 2개(공개/비공개), 문서 2.5만 개 + 초과 종량제' },
        { name: 'Enterprise', price: '맞춤 견적(SSO, 감사 로그 등)' },
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
    alternatives: ['contentful', 'strapi', 'payload-cms'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$15/사용자~', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // 6. GA4 (Google Analytics)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.ga4,
    name: 'GA4 (Google Analytics)',
    slug: 'ga4',
    category: 'analytics',
    description: '웹·앱 사용자 행동을 무료로 분석할 수 있는 구글의 표준 분석 플랫폼이며, 엔터프라이즈용 유료 버전인 Analytics 360도 별도 제공합니다.',
    description_ko: '웹·앱 사용자 행동을 무료로 분석할 수 있는 구글의 표준 분석 플랫폼이며, 엔터프라이즈용 유료 버전인 Analytics 360도 별도 제공합니다.',
    icon_url: null,
    website_url: 'https://analytics.google.com',
    docs_url: 'https://developers.google.com/analytics',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'GA4 표준 버전은 대부분의 사용 사례에서 무료. 정확한 이벤트/히트 처리 한도는 공식 페이지에서 구체적 수치로 공개되지 않음(확인 안 됨).',
      plans: [
        { name: 'GA4 표준', price: '무료' },
        { name: 'Analytics 360', price: '맞춤 견적(비공개, 영업팀 문의)' },
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
    alternatives: ['mixpanel', 'plausible', 'clarity'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '협의(360)' },
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
      '서버리스 Redis 서비스로 요청 단위 종량제(Pay as You Go)와 고정 요금제(Fixed) 두 가지 모델을 제공하며, Vercel KV 단종 이후 Vercel Marketplace의 공식 Redis 대체 제공자로 지정되었습니다.',
    description_ko:
      '서버리스 Redis 서비스로 요청 단위 종량제(Pay as You Go)와 고정 요금제(Fixed) 두 가지 모델을 제공하며, Vercel KV 단종 이후 Vercel Marketplace의 공식 Redis 대체 제공자로 지정되었습니다.',
    icon_url: null,
    website_url: 'https://upstash.com',
    docs_url: 'https://upstash.com/docs/redis',
    pricing_info: {
      free_tier: true,
      free_tier_details: '데이터 256MB, 월 대역폭 10GB, 월 명령어 50만 건',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pay as You Go', price: '10만 명령어당 $0.2(스토리지 100GB, 대역폭 무제한 한도 내)' },
        { name: 'Fixed 250MB', price: '$10/월(+읽기 리전당 $5)' },
        { name: 'Fixed 1GB', price: '$20/월' },
        { name: 'Fixed 5GB', price: '$100/월' },
        { name: 'Fixed 10GB', price: '$200/월' },
        { name: 'Fixed 50GB', price: '$400/월' },
        { name: 'Fixed 100GB', price: '$800/월' },
        { name: 'Fixed 500GB', price: '$1,500/월' },
        { name: 'Enterprise', price: '맞춤형(문의: sales@upstash.com)' },
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
    alternatives: ['redis-cloud', 'vercel-kv'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$10-800(Fixed)', enterprise: '맞춤형 / Prod Pack +$200' },
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
      'CDN·DDoS 방어·WAF·DNS를 통합 제공하는 글로벌 엣지 네트워크 플랫폼. 모든 플랜에 기본 CDN, 무제한 DDoS 방어, Universal SSL, WAF가 포함되며, Workers/R2/D1 등은 별도 종량제 상품으로 운영.',
    description_ko:
      'CDN·DDoS 방어·WAF·DNS를 통합 제공하는 글로벌 엣지 네트워크 플랫폼. 모든 플랜에 기본 CDN, 무제한 DDoS 방어, Universal SSL, WAF가 포함되며, Workers/R2/D1 등은 별도 종량제 상품으로 운영.',
    icon_url: null,
    website_url: 'https://www.cloudflare.com',
    docs_url: 'https://developers.cloudflare.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free 플랜: CDN, 무제한 DDoS 방어, Universal SSL, WAF 등 핵심 기능 포함 (개인/취미 프로젝트용).',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Pro', price: '$20/월(연 청구) 또는 $25/월' },
        { name: 'Business', price: '$200/월(연 청구) 또는 $250/월' },
        { name: 'Enterprise', price: '맞춤형' },
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
    monthly_cost_estimate: { starter: '$0', growth: '$20-250', enterprise: '협의' },
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
      '컨테이너(Firecracker VM) 기반 글로벌 배포 플랫폼. 상시 무료 티어 없이 순수 종량제(Pay-as-you-go) 모델로 운영되며, 컴퓨트·볼륨·네트워크 egress를 개별 단가로 청구.',
    description_ko:
      '컨테이너(Firecracker VM) 기반 글로벌 배포 플랫폼. 상시 무료 티어 없이 순수 종량제(Pay-as-you-go) 모델로 운영되며, 컴퓨트·볼륨·네트워크 egress를 개별 단가로 청구.',
    icon_url: null,
    website_url: 'https://fly.io',
    docs_url: 'https://fly.io/docs',
    pricing_info: {
      free_tier: false,
      free_tier_details: '공식 가격 문서에 별도의 상시 무료 크레딧/티어 언급 없음 — 순수 종량제.',
      plans: [
        { name: 'Pay-as-you-go', price: '리소스별 종량제' },
        { name: 'Standard Support', price: '$29/월' },
        { name: 'Premium Support / HIPAA', price: '$199/월 (HIPAA 컴플라이언스는 $99/월 별도 언급)' },
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
    alternatives: ['railway', 'render', 'vercel', 'netlify'],
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
    monthly_cost_estimate: { starter: '종량제(예: shared-cpu-1x 256MB 약 $2/월)', growth: '종량제', enterprise: '협의' },
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
      '인프라 모니터링, APM, 로그 관리, 보안을 아우르는 종합 옵저버빌리티 플랫폼입니다. 호스트당(인프라·APM)/GB당(로그 수집)/백만 이벤트당(로그 인덱싱) 등 제품별로 상이한 과금 단위를 사용하며 연간 약정 시 더 저렴합니다.',
    description_ko:
      '인프라 모니터링, APM, 로그 관리, 보안을 아우르는 종합 옵저버빌리티 플랫폼입니다. 호스트당(인프라·APM)/GB당(로그 수집)/백만 이벤트당(로그 인덱싱) 등 제품별로 상이한 과금 단위를 사용하며 연간 약정 시 더 저렴합니다.',
    icon_url: null,
    website_url: 'https://www.datadoghq.com',
    docs_url: 'https://docs.datadoghq.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Infrastructure Monitoring Free: 호스트 최대 5개, 메트릭 보관 1일.',
      plans: [
        { name: 'Infra Monitoring Pro', price: '$15/호스트/월(연간) 또는 $18(온디맨드)' },
        { name: 'Infra Monitoring Enterprise', price: '$23/호스트/월(연간) 또는 $27(온디맨드)' },
        { name: 'APM (기본, 인프라 포함)', price: '$31/호스트/월(연간)' },
        { name: 'APM Pro', price: '$35/호스트/월(연간)' },
        { name: 'APM Enterprise', price: '$40/호스트/월(연간)' },
        { name: 'Log Management (수집)', price: '$0.10/GB/월' },
        { name: 'Log Management (인덱싱, Standard)', price: '$1.70/백만 이벤트/월(연간) 또는 $2.55(온디맨드)' },
        { name: 'Log Management (Flex Storage)', price: '$0.05/백만 이벤트/월(연간) 또는 $0.075(온디맨드)' },
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
    alternatives: ['betterstack', 'axiom'],
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
    monthly_cost_estimate: { starter: '$0(호스트 5개 이하)', growth: '$15-40/호스트 + 로그 종량', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // 11. Mixpanel
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.mixpanel,
    name: 'Mixpanel',
    slug: 'mixpanel',
    category: 'analytics',
    description: '이벤트 기반 사용자 행동을 분석하는 제품 분석(Product Analytics) 플랫폼으로, 코호트·퍼널·세션 리플레이를 제공합니다.',
    description_ko: '이벤트 기반 사용자 행동을 분석하는 제품 분석(Product Analytics) 플랫폼으로, 코호트·퍼널·세션 리플레이를 제공합니다.',
    icon_url: null,
    website_url: 'https://mixpanel.com',
    docs_url: 'https://docs.mixpanel.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 100만 이벤트, 저장 보고서 5개, 세션 리플레이 월 1만 건까지 무료(신용카드 불필요).',
      plans: [
        { name: 'Growth', price: '첫 100만 이벤트 무료 이후 1K당 $0.28, 최대 2천만 이벤트' },
        { name: 'Enterprise', price: '이벤트 무제한, 맞춤 견적' },
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
    alternatives: ['ga4', 'plausible', 'clarity'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$0.28/1K 이벤트~', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // 12. Contentful
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.contentful,
    name: 'Contentful',
    slug: 'contentful',
    category: 'cms',
    description: 'API 기반으로 콘텐츠를 관리·배포하는 헤드리스 CMS로, 다국어·개인화·AI Actions 등 엔터프라이즈 기능을 제공합니다.',
    description_ko: 'API 기반으로 콘텐츠를 관리·배포하는 헤드리스 CMS로, 다국어·개인화·AI Actions 등 엔터프라이즈 기능을 제공합니다.',
    icon_url: null,
    website_url: 'https://www.contentful.com',
    docs_url: 'https://www.contentful.com/developers/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '영구 무료: 사용자 10명, 역할 2개, 로케일 2개, 월 API 호출 10만 회, CDN 대역폭 월 50GB.',
      plans: [
        { name: 'Platform Lite', price: '$300/월, 사용자 20명, API 호출 100만/월, 대역폭 100GB' },
        { name: 'Enterprise', price: '맞춤 견적, API/대역폭 무제한' },
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
    alternatives: ['sanity', 'strapi', 'payload-cms'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$300/월~', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // 13. Meilisearch
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.meilisearch,
    name: 'Meilisearch',
    slug: 'meilisearch',
    category: 'search',
    description: '빠른 응답 속도의 오픈소스 검색 엔진으로, 자체 호스팅은 무료이며 관리형 클라우드도 제공합니다.',
    description_ko: '빠른 응답 속도의 오픈소스 검색 엔진으로, 자체 호스팅은 무료이며 관리형 클라우드도 제공합니다.',
    icon_url: null,
    website_url: 'https://www.meilisearch.com',
    docs_url: 'https://www.meilisearch.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 자체 호스팅은 완전 무료. Cloud는 14일 무료체험(신용카드 불필요).',
      plans: [
        { name: 'Cloud', price: '월 $20부터(사용량 또는 리소스 기반 과금)' },
        { name: 'Enterprise', price: '맞춤 견적(SOC2, SAML SSO, 최대 99.999% SLA)' },
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
    monthly_cost_estimate: { starter: '$0(자체 호스팅)', growth: '$20~30/월(Cloud)', enterprise: '협의' },
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
      '웹소켓 기반 실시간 메시징(Channels)과 푸시 알림(Beams) 제품을 제공하는 플랫폼입니다. Sandbox 무료 플랜부터 Enterprise까지 동시 연결 수와 일일 메시지량 기준의 계단식 유료 플랜을 운영합니다.',
    description_ko:
      '웹소켓 기반 실시간 메시징(Channels)과 푸시 알림(Beams) 제품을 제공하는 플랫폼입니다. Sandbox 무료 플랜부터 Enterprise까지 동시 연결 수와 일일 메시지량 기준의 계단식 유료 플랜을 운영합니다.',
    icon_url: null,
    website_url: 'https://pusher.com',
    docs_url: 'https://pusher.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Sandbox 플랜: 일 20만 메시지, 동시 연결 100개, Standard 지원.',
      plans: [
        { name: 'Startup', price: '$49/월 (일 100만 메시지, 동시 연결 500)' },
        { name: 'Pro', price: '$99/월 (일 400만 메시지, 동시 연결 2,000)' },
        { name: 'Business', price: '$299/월 (일 1,000만 메시지, 동시 연결 5,000)' },
        { name: 'Premium', price: '$499/월 (일 2,000만 메시지, 동시 연결 10,000)' },
        { name: 'Growth', price: '$699/월 (일 4,000만 메시지, 동시 연결 15,000)' },
        { name: 'Plus', price: '$899/월 (일 6,000만 메시지, 동시 연결 20,000)' },
        { name: 'Growth Plus', price: '$1,199/월 (일 9,000만 메시지, 동시 연결 30,000)' },
        { name: 'Enterprise', price: '맞춤 견적' },
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
    alternatives: ['onesignal'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$49-899', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // 15. Trigger.dev
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.trigger_dev,
    name: 'Trigger.dev',
    slug: 'trigger-dev',
    category: 'scheduling',
    description: 'TypeScript 기반 백그라운드 작업·워크플로우 오케스트레이션 플랫폼으로, 오픈소스 셀프호스팅과 매니지드 클라우드를 함께 제공합니다.',
    description_ko: 'TypeScript 기반 백그라운드 작업·워크플로우 오케스트레이션 플랫폼으로, 오픈소스 셀프호스팅과 매니지드 클라우드를 함께 제공합니다.',
    icon_url: null,
    website_url: 'https://trigger.dev',
    docs_url: 'https://trigger.dev/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free 플랜은 월 $5 상당 크레딧 포함, 동시 실행 20개, 팀원 5명까지',
      plans: [
        { name: 'Free', price: '$0 (월 $5 크레딧 포함)' },
        { name: 'Hobby', price: '$10/월' },
        { name: 'Pro', price: '$50/월' },
        { name: 'Enterprise', price: '맞춤 견적' },
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
    popularity_score: 64,
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
    monthly_cost_estimate: { starter: '$0', growth: '$10~$50/월', enterprise: '맞춤 견적' },
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
      '기능 플래그(CodeControl)와 AI 에이전트 거버넌스(AgentControl)를 제공하는 런타임 제어 플랫폼으로, 2026년 들어 AI 시대에 맞춰 제품·플랜 체계가 Developer/Foundation/Enterprise/Guardian으로 개편되었습니다. Foundation부터는 서비스 연결 수 및 클라이언트 측 MAU 기준 사용량 과금이 적용됩니다.',
    description_ko:
      '기능 플래그(CodeControl)와 AI 에이전트 거버넌스(AgentControl)를 제공하는 런타임 제어 플랫폼으로, 2026년 들어 AI 시대에 맞춰 제품·플랜 체계가 Developer/Foundation/Enterprise/Guardian으로 개편되었습니다. Foundation부터는 서비스 연결 수 및 클라이언트 측 MAU 기준 사용량 과금이 적용됩니다.',
    icon_url: null,
    website_url: 'https://launchdarkly.com',
    docs_url: 'https://docs.launchdarkly.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Developer 플랜: 무제한 시트·무제한 기능 플래그, 30개 SDK, 로그·트레이스 1,000만 건, 세션 리플레이·에러 5,000건, AI 실행 월 5,000회, 데이터 보관 14일. 단, 서비스 연결 월 5회, 클라이언트 측 MAU 1,000명, 프로젝트 1개, 환경 3개로 하드 캡 존재.',
      plans: [
        { name: 'Foundation (CodeControl)', price: '서비스 연결당 월 $10 또는 클라이언트 MAU 1,000명당 월 $8.33' },
        { name: 'Foundation (AgentControl)', price: '무료 한도(5,000회) 초과 AI 실행 1,000회당 월 $5' },
        { name: 'Enterprise / Guardian', price: '맞춤 견적' },
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
    monthly_cost_estimate: { starter: '$0', growth: '사용량 기반(서비스 연결·MAU)', enterprise: '협의' },
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
      '자체 LPU(Language Processing Unit) 하드웨어 기반 초고속 LLM 추론 API 제공업체로, Llama·GPT-OSS 등 오픈소스 모델을 저렴한 종량제로 서빙합니다.',
    description_ko:
      '자체 LPU(Language Processing Unit) 하드웨어 기반 초고속 LLM 추론 API 제공업체로, Llama·GPT-OSS 등 오픈소스 모델을 저렴한 종량제로 서빙합니다.',
    icon_url: null,
    website_url: 'https://groq.com',
    docs_url: 'https://console.groq.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료로 API 키 발급 및 테스트 가능(신용카드 불필요), 요청/토큰 한도 있음.',
      plans: [
        { name: 'Llama 3.1 8B Instant', price: '입력 $0.05 / 출력 $0.08 (1M 토큰)' },
        { name: 'GPT OSS 20B', price: '입력 $0.075 / 출력 $0.30 (1M 토큰)' },
        { name: 'Llama 3.3 70B Versatile', price: '입력 $0.59 / 출력 $0.79 (1M 토큰)' },
        { name: 'Whisper (음성 인식)', price: '시간당 $0.04~$0.111' },
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
    alternatives: ['together-ai', 'fireworks-ai', 'openrouter'],
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
    monthly_cost_estimate: { starter: '$0-20 (종량제)', growth: '$20-500', enterprise: '맞춤 견적' },
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
      '웹서비스·정적사이트·백그라운드워커·PostgreSQL 등을 지원하는 클라우드 호스팅 PaaS. 무료 웹서비스는 15분 무요청 시 자동 슬립되며, 무료 PostgreSQL은 생성 후 30일 뒤 만료됨.',
    description_ko:
      '웹서비스·정적사이트·백그라운드워커·PostgreSQL 등을 지원하는 클라우드 호스팅 PaaS. 무료 웹서비스는 15분 무요청 시 자동 슬립되며, 무료 PostgreSQL은 생성 후 30일 뒤 만료됨.',
    icon_url: null,
    website_url: 'https://render.com',
    docs_url: 'https://render.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '워크스페이스당 무료 인스턴스 750시간/월 포함(초과 시 다음달까지 모든 무료 웹서비스 일시중단). 무료 웹서비스는 15분 무트래픽 시 자동 슬립(재기동 약 1분 소요, 로컬 파일시스템 변경분 손실). 무료 PostgreSQL 1GB(생성 후 30일 만료), 워크스페이스당 Key-Value 인스턴스 1개 무료. 상시 디스크·SSH·다중 인스턴스 스케일링은 무료 티어 미지원.',
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
    alternatives: ['railway', 'flyio', 'vercel', 'netlify'],
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
      '세션 리플레이, 프로덕트 분석, 프론트엔드 오류·성능 모니터링을 결합한 UX 관측 플랫폼입니다. 캡처 세션 수 기준으로 과금되며, 공식 페이지 확인 결과 상시 무료 플랜 대신 14일 무료 체험 형태로 안내되고 있습니다.',
    description_ko:
      '세션 리플레이, 프로덕트 분석, 프론트엔드 오류·성능 모니터링을 결합한 UX 관측 플랫폼입니다. 캡처 세션 수 기준으로 과금되며, 공식 페이지 확인 결과 상시 무료 플랜 대신 14일 무료 체험 형태로 안내되고 있습니다.',
    icon_url: null,
    website_url: 'https://logrocket.com',
    docs_url: 'https://docs.logrocket.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '공식 페이지에서 14일 무료 체험만 명시적으로 확인됨(신용카드 불필요). 상시 무료 플랜의 정확한 세션 한도는 확인 불가 — null 처리.',
      plans: [
        { name: 'Pro', price: '$176/월부터 (트래픽의 약 25% 캡처 기준, 세션량에 따라 최대 약 $765/월 수준 — 서드파티 추정 포함)' },
        { name: 'Enterprise', price: '맞춤 견적' },
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
    alternatives: ['sentry', 'posthog'],
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
    monthly_cost_estimate: { starter: '14일 무료 체험', growth: '$176~', enterprise: '협의' },
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
      'Microsoft가 개발한 오픈소스 엔드투엔드 테스트 프레임워크로, Chromium/Firefox/WebKit 크로스브라우저 자동화를 하나의 API로 제공합니다.',
    description_ko:
      'Microsoft가 개발한 오픈소스 엔드투엔드 테스트 프레임워크로, Chromium/Firefox/WebKit 크로스브라우저 자동화를 하나의 API로 제공합니다.',
    icon_url: null,
    website_url: 'https://playwright.dev',
    docs_url: 'https://playwright.dev/docs/intro',
    pricing_info: {
      free_tier: true,
      free_tier_details: '완전 오픈소스 무료 (Apache 2.0 라이선스), Microsoft가 유지보수',
      plans: [
        { name: '오픈소스', price: '$0' },
      ],
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
    popularity_score: 88,
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
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '$0' },
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
      'Slack 워크스페이스와 연동되는 앱·봇을 개발하기 위한 공식 Web API/이벤트 API입니다. API 호출 자체는 무료이나 메서드별로 요청 속도 제한(rate limit)이 적용되며, 2025년 이후 비마켓플레이스 앱에 더 엄격한 제한이 단계적으로 적용되고 있습니다.',
    description_ko:
      'Slack 워크스페이스와 연동되는 앱·봇을 개발하기 위한 공식 Web API/이벤트 API입니다. API 호출 자체는 무료이나 메서드별로 요청 속도 제한(rate limit)이 적용되며, 2025년 이후 비마켓플레이스 앱에 더 엄격한 제한이 단계적으로 적용되고 있습니다.',
    icon_url: null,
    website_url: 'https://api.slack.com',
    docs_url: 'https://docs.slack.dev',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'API 사용 자체는 별도 요금 없이 무료. 단, 메서드별/앱별/워크스페이스별 rate limit 적용. Slack Marketplace 미승인 비상업용 앱은 2026-03-03부터 conversations.history/replies 등에 분당 1요청·15개 메시지의 더 엄격한 제한 적용.',
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
    monthly_cost_estimate: { starter: '$0 (API 자체)', growth: '$0 (API 자체)', enterprise: '$0 (API 자체, Slack 워크스페이스 구독료는 별도)' },
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
      'Discord 봇과 앱을 개발하기 위한 공식 REST/게이트웨이 API로, 서버 규모와 무관하게 API 및 봇 계정 사용 자체는 무료입니다. 유료화는 개발자가 자체적으로 도입하는 Premium Apps(인앱 구매) 기능을 통해서만 발생합니다.',
    description_ko:
      'Discord 봇과 앱을 개발하기 위한 공식 REST/게이트웨이 API로, 서버 규모와 무관하게 API 및 봇 계정 사용 자체는 무료입니다. 유료화는 개발자가 자체적으로 도입하는 Premium Apps(인앱 구매) 기능을 통해서만 발생합니다.',
    icon_url: null,
    website_url: 'https://discord.com/developers',
    docs_url: 'https://docs.discord.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '봇 계정 생성 및 API 호출은 전면 무료. 글로벌 rate limit: 봇 기준 초당 50 요청.',
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
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '$0 (Premium Apps 통한 인앱 결제는 개발자가 선택적으로 구성)' },
  },

  // -----------------------------------------------------------------------
  // 23. Mapbox
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.mapbox,
    name: 'Mapbox',
    slug: 'mapbox',
    category: 'other',
    description: '지도 렌더링, 지오코딩, 내비게이션 API를 종량제로 제공하는 위치 데이터 플랫폼입니다.',
    description_ko: '지도 렌더링, 지오코딩, 내비게이션 API를 종량제로 제공하는 위치 데이터 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://www.mapbox.com',
    docs_url: 'https://docs.mapbox.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '제품별 무료 한도: 지도 로드 월 5만 회, 모바일 SDK 월 활성사용자 2.5만 명, Geocoding 월 10만 요청, Vector Tiles 월 20만 요청, Static Images 월 5만 요청.',
      plans: [
        { name: '지도 로드(GL JS)', price: '1,000회당 $5.00부터(볼륨 증가 시 최저 $2.50)' },
        { name: 'Geocoding', price: '1,000회당 $0.75부터' },
        { name: 'Directions', price: '1,000회당 $2.00부터' },
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
    monthly_cost_estimate: { starter: '$0(무료 한도 내)', growth: '종량제(1K당 $0.75~$5)', enterprise: '연간 약정 할인 협의' },
  },

  // -----------------------------------------------------------------------
  // 24. ElevenLabs
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.elevenlabs,
    name: 'ElevenLabs',
    slug: 'elevenlabs',
    category: 'ai',
    description: 'AI 음성 합성(TTS)·음성 클로닝·더빙을 제공하는 플랫폼으로, 크레딧(문자수) 기반 6단계 구독 플랜을 운영합니다.',
    description_ko: 'AI 음성 합성(TTS)·음성 클로닝·더빙을 제공하는 플랫폼으로, 크레딧(문자수) 기반 6단계 구독 플랜을 운영합니다.',
    icon_url: null,
    website_url: 'https://elevenlabs.io',
    docs_url: 'https://elevenlabs.io/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 10,000 크레딧(약 10분 분량 음성) 무료 제공.',
      plans: [
        { name: 'Free', price: '$0 (월 10,000 크레딧)' },
        { name: 'Starter', price: '$6/월 (월 30,000 크레딧)' },
        { name: 'Creator', price: '$22/월 (월 121,000 크레딧)' },
        { name: 'Pro', price: '$99/월 (월 600,000 크레딧)' },
        { name: 'Scale', price: '$299/월 (월 1,800,000 크레딧)' },
        { name: 'Business', price: '$990/월 (월 6,000,000 크레딧)' },
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
    alternatives: ['playht'],
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
    monthly_cost_estimate: { starter: '$0-22', growth: '$99-299', enterprise: '$990+' },
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
      '이벤트 기반 서버리스 함수·워크플로우 실행을 위한 내구성 실행(durable execution) 플랫폼으로, 서버리스/서버/엣지 환경에서 스테이트풀 스텝 함수를 실행합니다.',
    description_ko:
      '이벤트 기반 서버리스 함수·워크플로우 실행을 위한 내구성 실행(durable execution) 플랫폼으로, 서버리스/서버/엣지 환경에서 스테이트풀 스텝 함수를 실행합니다.',
    icon_url: null,
    website_url: 'https://www.inngest.com',
    docs_url: 'https://www.inngest.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Hobby 플랜 무료 — 월 5만 실행(executions), 동시 실행 5개, 이벤트 수신 50만건',
      plans: [
        { name: 'Hobby', price: '$0' },
        { name: 'Pro', price: '$99/월~' },
        { name: 'Enterprise', price: '맞춤 견적' },
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
    popularity_score: 55,
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
    monthly_cost_estimate: { starter: '$0', growth: '$99/월~', enterprise: '맞춤 견적' },
  },

  // -----------------------------------------------------------------------
  // 26. Strapi
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.strapi,
    name: 'Strapi',
    slug: 'strapi',
    category: 'cms',
    description: '100% JavaScript/TypeScript 기반의 오픈소스 헤드리스 CMS로, 커스터마이징 자유도가 높고 관리형 Cloud도 제공합니다.',
    description_ko: '100% JavaScript/TypeScript 기반의 오픈소스 헤드리스 CMS로, 커스터마이징 자유도가 높고 관리형 Cloud도 제공합니다.',
    icon_url: null,
    website_url: 'https://strapi.io',
    docs_url: 'https://docs.strapi.io',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Community(오픈소스, MIT 라이선스) 자체 호스팅은 완전 무료.',
      plans: [
        { name: 'Cloud Starter', price: '$35/프로젝트/월, API 10만 회, 스토리지 50GB' },
        { name: 'Cloud Pro', price: '$90/프로젝트/월, API 100만 회, 스토리지 250GB, 주간 백업' },
        { name: 'Cloud Business', price: '$450/프로젝트/월, API 1천만 회, 스토리지 1TB, 일일 백업, 99.9% SLA' },
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
    alternatives: ['sanity', 'contentful', 'payload-cms'],
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
    monthly_cost_estimate: { starter: '$0(자체 호스팅)', growth: '$35~90/월(Cloud)', enterprise: '$450/월~ 또는 협의' },
  },

  // -----------------------------------------------------------------------
  // 27. Plausible
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.plausible,
    name: 'Plausible',
    slug: 'plausible',
    category: 'analytics',
    description: '쿠키 없이 동작하는 프라이버시 중심 오픈소스 웹 분석 도구로, 트래픽(페이지뷰) 기준 종량 요금제를 사용합니다.',
    description_ko: '쿠키 없이 동작하는 프라이버시 중심 오픈소스 웹 분석 도구로, 트래픽(페이지뷰) 기준 종량 요금제를 사용합니다.',
    icon_url: null,
    website_url: 'https://plausible.io',
    docs_url: 'https://plausible.io/docs',
    pricing_info: {
      free_tier: false,
      free_tier_details: '무료 플랜은 없으나 전 플랜 30일 무료 체험(신용카드 불필요) 제공. 오픈소스라 자체 호스팅 시 비용 없음.',
      plans: [
        { name: 'Starter', price: '$9/월, 월 페이지뷰 1만 건까지, 사이트 1개' },
        { name: 'Growth', price: '$14/월, 사이트 최대 3개, 팀원 최대 3명' },
        { name: 'Business', price: '$19/월, 사이트 최대 10개, 팀원 최대 10명' },
        { name: 'Enterprise', price: '맞춤 견적(사이트 10개 초과)' },
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
    alternatives: ['ga4', 'mixpanel', 'clarity'],
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
    monthly_cost_estimate: { starter: '$9/월', growth: '$14~19/월', enterprise: '협의' },
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
      '브라우저 기반 E2E·컴포넌트·접근성 테스트를 지원하는 프레임워크로, 오픈소스 테스트 러너(Cypress App)와 유료 SaaS인 Cypress Cloud로 구성됩니다.',
    description_ko:
      '브라우저 기반 E2E·컴포넌트·접근성 테스트를 지원하는 프레임워크로, 오픈소스 테스트 러너(Cypress App)와 유료 SaaS인 Cypress Cloud로 구성됩니다.',
    icon_url: null,
    website_url: 'https://www.cypress.io',
    docs_url: 'https://docs.cypress.io',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Cypress 테스트 러너(App) 자체는 완전 무료. Cypress Cloud Starter 플랜은 월 500개 테스트 결과·50유저까지 무료',
      plans: [
        { name: 'Starter', price: '$0 (월 500 테스트 결과)' },
        { name: 'Team', price: '$67/월 (연 $799, 연 12만 테스트 결과)' },
        { name: 'Business', price: '$267/월 (연 $3,199, 연 12만 테스트 결과)' },
        { name: 'Enterprise', price: '맞춤 견적 (연 180만 테스트 결과)' },
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
    popularity_score: 78,
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
    monthly_cost_estimate: { starter: '$0', growth: '$67~$267/월', enterprise: '맞춤 견적' },
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
      'Redis 기반 오픈소스 메시지 큐·백그라운드 작업 라이브러리로, Node.js/Python/Rust/Elixir 등을 지원하며 상용 확장판인 BullMQ Pro도 제공합니다.',
    description_ko:
      'Redis 기반 오픈소스 메시지 큐·백그라운드 작업 라이브러리로, Node.js/Python/Rust/Elixir 등을 지원하며 상용 확장판인 BullMQ Pro도 제공합니다.',
    icon_url: null,
    website_url: 'https://bullmq.io',
    docs_url: 'https://docs.bullmq.io',
    pricing_info: {
      free_tier: true,
      free_tier_details: '코어 라이브러리(BullMQ)는 MIT 라이선스로 완전 무료',
      plans: [
        { name: '오픈소스 (BullMQ)', price: '$0' },
        { name: 'BullMQ Pro', price: '$95/월 또는 $995/년 (조직 단위 라이선스, 공식 블로그 \'introductory price\' 표기)' },
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
    popularity_score: 52,
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
    monthly_cost_estimate: { starter: '$0', growth: '$95/월 (Pro)', enterprise: '$95/월 (조직 단위, 프로젝트 수 무관)' },
  },

  // -----------------------------------------------------------------------
  // 30. Shopify API
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.shopify_api,
    name: 'Shopify API',
    slug: 'shopify-api',
    category: 'ecommerce',
    description: '이커머스 스토어 구축·운영 플랫폼 Shopify의 개발자 API/CLI로, Admin API·Storefront API·앱 개발 도구를 제공합니다.',
    description_ko: '이커머스 스토어 구축·운영 플랫폼 Shopify의 개발자 API/CLI로, Admin API·Storefront API·앱 개발 도구를 제공합니다.',
    icon_url: null,
    website_url: 'https://shopify.dev',
    docs_url: 'https://shopify.dev/docs/api',
    pricing_info: {
      free_tier: false,
      free_tier_details: '3일 무료 체험 후 첫 3개월 $1/월 프로모션.',
      plans: [
        { name: 'Basic', price: '$19/월(연간)·$25/월(월간)' },
        { name: 'Grow(중간 플랜)', price: '$49/월(연간)·$65/월(월간)' },
        { name: 'Advanced', price: '$299/월(연간)·$399/월(월간)' },
        { name: 'Plus', price: '$2,300/월부터' },
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
    alternatives: ['stripe', 'lemon-squeezy'],
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
    monthly_cost_estimate: { starter: '$19~25/월', growth: '$49~399/월', enterprise: '$2,300/월~(Plus)' },
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
      '미국 기반 도메인 등록대행업체. 도메인 등록/이전, EasyWP 호스팅, PremiumDNS, SSL 등을 제공하나, 자동화된 조회 도구에 대한 봇 차단이 강하게 적용되어 있어 가격 페이지를 직접 확인하지 못함.',
    description_ko:
      '미국 기반 도메인 등록대행업체. 도메인 등록/이전, EasyWP 호스팅, PremiumDNS, SSL 등을 제공하나, 자동화된 조회 도구에 대한 봇 차단이 강하게 적용되어 있어 가격 페이지를 직접 확인하지 못함.',
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
      'Cloudflare가 운영하는 도메인 등록대행 서비스로, 레지스트리·ICANN이 부과하는 도매가 그대로(마진 없이) 제공하는 것이 핵심 특징. 390개 이상의 TLD를 지원하며 무료 WHOIS 프라이버시, DNSSEC을 기본 제공.',
    description_ko:
      'Cloudflare가 운영하는 도메인 등록대행 서비스로, 레지스트리·ICANN이 부과하는 도매가 그대로(마진 없이) 제공하는 것이 핵심 특징. 390개 이상의 TLD를 지원하며 무료 WHOIS 프라이버시, DNSSEC을 기본 제공.',
    icon_url: null,
    website_url: 'https://www.cloudflare.com/products/registrar/',
    docs_url: 'https://developers.cloudflare.com/registrar/',
    pricing_info: {
      free_tier: false,
      free_tier_details: '무료 등급 없음 (마크업 없는 레지스트리 가격 청구)',
      plans: [
        { name: '도메인 등록/갱신(At-cost)', price: '레지스트리+ICANN 부과 원가만 청구(가격 인상 없음, TLD별 상이)' },
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
    alternatives: ['namecheap', 'godaddy', 'gabia', 'whois', 'cafe24', 'inames', 'hosting-kr', 'dotname'],
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
      '세계 최대 도메인 등록대행업체 중 하나. 도메인 등록/DNS 관리 API를 제공하며, 최근 LLM/AI 에이전트 친화적 문서(OpenAPI, /llms-full.txt)와 CLI 도구(gddy)를 추가함.',
    description_ko:
      '세계 최대 도메인 등록대행업체 중 하나. 도메인 등록/DNS 관리 API를 제공하며, 최근 LLM/AI 에이전트 친화적 문서(OpenAPI, /llms-full.txt)와 CLI 도구(gddy)를 추가함.',
    icon_url: null,
    website_url: 'https://www.godaddy.com',
    docs_url: 'https://developer.godaddy.com',
    pricing_info: {
      free_tier: false,
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
    alternatives: ['namecheap', 'cloudflare-registrar', 'gabia'],
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
      '국내 점유율 1위 도메인/호스팅 등록대행업체. 도메인 검색, 신규등록, 연장, 관리 기능을 제공하며 이벤트성 할인가로 첫 해 등록비를 낮게 책정하는 방식을 사용.',
    description_ko:
      '국내 점유율 1위 도메인/호스팅 등록대행업체. 도메인 검색, 신규등록, 연장, 관리 기능을 제공하며 이벤트성 할인가로 첫 해 등록비를 낮게 책정하는 방식을 사용.',
    icon_url: null,
    website_url: 'https://domain.gabia.com',
    docs_url: 'https://customer.gabia.com/?tab=manual',
    pricing_info: {
      free_tier: false,
      free_tier_details: '무료 등급 없음 (.kr 기본: $12/년, .com 기본: $8.5/년)',
      plans: [
        { name: '.com 신규등록 (이벤트가)', price: '19,800원/년' },
        { name: '.com 정상가', price: '26,400원/년' },
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
    alternatives: ['whois', 'cafe24', 'inames', 'namecheap', 'cloudflare-registrar', 'godaddy', 'hosting-kr', 'dotname'],
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
      '국내 도메인·웹호스팅·서버/IDC·오피스(Google Workspace 등)·보안 서비스를 종합 제공하는 업체. 도메인 가격은 시즌 이벤트가로 노출되며 상시 고정가는 페이지에 표기되지 않음.',
    description_ko:
      '국내 도메인·웹호스팅·서버/IDC·오피스(Google Workspace 등)·보안 서비스를 종합 제공하는 업체. 도메인 가격은 시즌 이벤트가로 노출되며 상시 고정가는 페이지에 표기되지 않음.',
    icon_url: null,
    website_url: 'https://www.hosting.kr',
    docs_url: 'https://help.hosting.kr/hc',
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
    alternatives: ['gabia', 'whois', 'cafe24', 'inames', 'dotname'],
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
      '닷네임코리아. 도메인 등록/이전/연장, 웹호스팅(리눅스·워드프레스·코드프리), VPS/전용서버, SSL·DDoS 방어, 이메일/SMS/팩스 등 종합 인터넷 인프라 서비스를 제공. 회원 등급(Standard/Diamond/Gold 등)에 따라 도메인 가격이 차등 적용됨.',
    description_ko:
      '닷네임코리아. 도메인 등록/이전/연장, 웹호스팅(리눅스·워드프레스·코드프리), VPS/전용서버, SSL·DDoS 방어, 이메일/SMS/팩스 등 종합 인터넷 인프라 서비스를 제공. 회원 등급(Standard/Diamond/Gold 등)에 따라 도메인 가격이 차등 적용됨.',
    icon_url: null,
    website_url: 'https://www.dotname.co.kr',
    docs_url: 'https://www.dotname.co.kr/support',
    pricing_info: {
      free_tier: false,
      free_tier_details: '도메인 등록 시 무료 웹호스팅 제공',
      plans: [
        { name: '.com (Standard/Vip 등급)', price: '16,500원/년' },
        { name: '.com (Diamond 등급)', price: '16,600원/년' },
        { name: '.com (Gold 등급)', price: '17,190원/년' },
        { name: '.com (기타 등급)', price: '16,500원~18,700원/년' },
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
    alternatives: ['gabia', 'whois', 'cafe24', 'inames', 'hosting-kr'],
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
    description_ko: '웹사이트에 광고를 게재해 수익을 얻는 구글의 퍼블리셔 광고 네트워크입니다.',
    icon_url: null,
    website_url: 'https://adsense.google.com',
    docs_url: 'https://support.google.com/adsense',
    pricing_info: {
      free_tier: true,
      free_tier_details: '가입 무료, 수익 배분 모델. AdSense for Content 기준 광고 플랫폼 수수료 차감 후 퍼블리셔가 80% 수령. Google Ads 경유 구매 시 실질적으로 퍼블리셔는 약 68% 수준 유지.',
      plans: [
        { name: '수익 배분(전 지역 동일)', price: '80%(Google Ads 경유 시 실질 ~68%)' },
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
    monthly_cost_estimate: { starter: '$0(가입 무료)', growth: '수익 배분형(고정비 없음)', enterprise: '해당 없음' },
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
    description_ko: '카카오가 운영하는 국내 퍼블리셔 대상 광고 네트워크로, 배너/네이티브/앱 팝업 광고를 지원합니다.',
    icon_url: null,
    website_url: 'https://adfit.kakao.com',
    docs_url: 'https://adfit.kakao.com/info/guide',
    pricing_info: {
      free_tier: true,
      free_tier_details: '가입 무료, 수익 배분 모델. 정확한 배분율(%)은 공식 운영정책 문서에 수치로 명시되어 있지 않음(회사 정책에 따라 변경 가능하다고만 기재).',
      plans: [
        { name: '최소 지급액', price: '50,000원/회(확정 적립금 5만원 미만 시 지급 신청 불가)' },
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
    alternatives: ['google-adsense'],
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
    monthly_cost_estimate: { starter: '$0(가입 무료)', growth: '수익 배분형(고정비 없음)', enterprise: '해당 없음' },
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
    description_ko: '리테일 미디어·다이내믹 리타겟팅 광고를 제공하는 커머스 미디어 플랫폼입니다.',
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
    alternatives: ['taboola'],
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
    monthly_cost_estimate: { starter: '협의', growth: '협의', enterprise: '협의' },
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
    description_ko: '네이티브 광고·콘텐츠 추천을 통해 퍼블리셔 수익화와 광고주 트래픽 확보를 지원하는 퍼포먼스 광고 플랫폼입니다.',
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
    alternatives: ['criteo'],
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
    monthly_cost_estimate: { starter: '협의', growth: '협의', enterprise: '협의' },
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
    description_ko: '웹·모바일·스트리밍TV 퍼블리셔를 위한 헤더 비딩·통합 광고 마켓플레이스 솔루션입니다.',
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
    alternatives: ['google-ad-manager'],
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
    monthly_cost_estimate: { starter: '협의', growth: '협의', enterprise: '협의' },
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
    description_ko: '퍼블리셔를 위한 광고 서버·수익화 플랫폼으로, 소규모용 무료 버전과 엔터프라이즈용 Ad Manager 360으로 나뉩니다.',
    icon_url: null,
    website_url: 'https://admanager.google.com',
    docs_url: 'https://developers.google.com/ad-manager',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Google Ad Manager(구 Small Business)는 무료 등급이 존재하나, 정확한 임계값(예: 월 노출 수 한도)을 공식 페이지에서 이번 세션 중 직접 확인하지 못함. Ad Manager 360은 공식적으로 비공개 협의 가격.',
      plans: [
        { name: 'Google Ad Manager', price: '무료(정확한 사용량 한도 미확인)' },
        { name: 'Ad Manager 360', price: '맞춤 견적(비공개)' },
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
    alternatives: ['amazon-aps', 'google-adsense'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$0(한도 내)', enterprise: '협의(360)' },
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
    description_ko: 'xAI가 개발한 LLM으로, X(트위터) 및 grok.com 앱의 SuperGrok 구독과 별도 과금되는 API(x.ai)로 제공됩니다.',
    icon_url: null,
    website_url: 'https://x.ai',
    docs_url: 'https://docs.x.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'X/grok.com에서 제한적 무료 사용 가능. API는 데이터 공유 프로그램 참여 시 월 최대 $175 크레딧 무료 제공(서드파티 교차검증, 공식 1차 소스 미확인).',
      plans: [
        { name: 'Free (X/grok.com)', price: '$0' },
        { name: 'SuperGrok Lite', price: '$10/월' },
        { name: 'SuperGrok', price: '$30/월 또는 $300/년' },
        { name: 'SuperGrok Heavy', price: '약 $300/월' },
        { name: 'API Grok 4.5', price: '입력 $2.00(캐시 $0.50) / 출력 $6.00 (1M 토큰)' },
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
    monthly_cost_estimate: { starter: '$0-30', growth: '$30-300', enterprise: '맞춤 API 볼륨' },
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
    description_ko: '프랑스 기반 오픈소스 지향 LLM 기업으로, La Plateforme API와 Le Chat 소비자 앱을 EU 데이터센터 기반으로 제공합니다.',
    icon_url: null,
    website_url: 'https://mistral.ai',
    docs_url: 'https://docs.mistral.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'La Plateforme 무료 티어(일일 토큰 한도, 신용카드 불필요). Le Chat Free 플랜은 제한된 메시지/웹검색/이미지 생성 제공.',
      plans: [
        { name: 'Mistral Large', price: '입력 $2 / 출력 $6 (1M 토큰)' },
        { name: 'Mistral Small 3', price: '입력 $0.10 / 출력 $0.30 (1M 토큰)' },
        { name: 'Codestral', price: '입력 $0.30 / 출력 $0.90 (1M 토큰)' },
        { name: 'Ministral 3B', price: '$0.04~ (1M 토큰)' },
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
    alternatives: ['openai', 'anthropic', 'google-gemini', 'cohere'],
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
    monthly_cost_estimate: { starter: '$0-20', growth: '$20-200', enterprise: '맞춤 견적' },
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
    description_ko: '기업용 LLM·임베딩·리랭크 API를 제공하는 캐나다 기반 AI 기업으로, Command 시리즈 모델과 North(에이전트 워크스페이스)를 운영합니다.',
    icon_url: null,
    website_url: 'https://cohere.com',
    docs_url: 'https://docs.cohere.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '체험용(trial) API 키는 월 1,000회 호출까지 무료(프로덕션 사용 불가, 속도 제한 있음).',
      plans: [
        { name: 'Command R+ (08-2024)', price: '입력 $2.50 / 출력 $10.00 (1M 토큰)' },
        { name: 'Command R', price: '입력 $0.15 / 출력 $0.60 (1M 토큰)' },
        { name: 'Embed 4 (Model Vault)', price: '시간당 $4~5 또는 월 $2,500~3,250' },
        { name: 'Rerank v3', price: '$2.00/1M 토큰' },
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
    alternatives: ['openai', 'mistral-ai', 'ai21-labs'],
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
    monthly_cost_estimate: { starter: '$0-50 (종량제)', growth: '$50-1000', enterprise: '맞춤 견적' },
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
    description_ko: '중국 기반 오픈소스 지향 LLM 기업으로, deepseek-v4-flash/pro 모델을 OpenAI/Anthropic 호환 API로 저렴하게 제공합니다.',
    icon_url: null,
    website_url: 'https://www.deepseek.com',
    docs_url: 'https://api-docs.deepseek.com',
    pricing_info: {
      free_tier: false,
      free_tier_details: '상시 무료 티어 확인 안 됨. 종량제 기반 저가 API로 운영.',
      plans: [
        { name: 'deepseek-v4-flash', price: '입력(캐시 미스) $0.14 / 캐시 히트 $0.0028 / 출력 $0.28 (1M 토큰)' },
        { name: 'deepseek-v4-pro', price: '입력(캐시 미스) $0.435 / 캐시 히트 $0.003625 / 출력 $0.87 (1M 토큰)' },
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
    alternatives: ['openai', 'anthropic', 'mistral-ai'],
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
    monthly_cost_estimate: { starter: '$0-10 (종량제)', growth: '$10-100', enterprise: '맞춤 견적' },
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
    description_ko: '인용 기반 답변을 제공하는 AI 검색 엔진으로, Free/Pro/Max 소비자 플랜과 Sonar API를 개발자에게 제공합니다.',
    icon_url: null,
    website_url: 'https://www.perplexity.ai',
    docs_url: 'https://docs.perplexity.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무제한 기본 검색 + 일일 약 5회 Pro Search 제공(서드파티 교차검증).',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro', price: '$20/월 또는 $200/년' },
        { name: 'Max', price: '$200/월 또는 $2,000/년' },
        { name: 'Enterprise Pro', price: '$40/좌석/월' },
        { name: 'Enterprise Max', price: '$325/좌석/월' },
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
    monthly_cost_estimate: { starter: '$0-20', growth: '$40-200', enterprise: '$325+/좌석' },
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
    description_ko: '이스라엘 기반 AI 기업으로, SSM-Transformer 하이브리드 구조의 Jamba 모델 시리즈를 API로 제공합니다.',
    icon_url: null,
    website_url: 'https://www.ai21.com',
    docs_url: 'https://docs.ai21.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '신용카드 없이 7일간 $10 API 크레딧 무료 제공.',
      plans: [
        { name: 'Jamba Mini', price: '입력 $0.2 / 출력 $0.4 (1M 토큰)' },
        { name: 'Jamba Large', price: '입력 $2 / 출력 $8 (1M 토큰)' },
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
    alternatives: ['cohere', 'mistral-ai'],
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
    monthly_cost_estimate: { starter: '$0-20', growth: '$20-200', enterprise: '맞춤 견적 (볼륨 할인)' },
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
    description_ko: 'Discord 및 자체 웹사이트 기반 AI 이미지 생성 서비스로, GPU 시간 기반 4단계 구독 플랜(Basic~Mega)을 운영합니다.',
    icon_url: null,
    website_url: 'https://www.midjourney.com',
    docs_url: 'https://docs.midjourney.com',
    pricing_info: {
      free_tier: false,
      free_tier_details: '무료 체험 없음 — 최소 Basic($10/월) 구독 필요.',
      plans: [
        { name: 'Basic', price: '$10/월 (약 3.3 GPU시간)' },
        { name: 'Standard', price: '$30/월 (약 15 GPU시간)' },
        { name: 'Pro', price: '$60/월 (약 30 GPU시간)' },
        { name: 'Mega', price: '$120/월 (약 60 GPU시간)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'image_generation',
    popularity_score: 90,
    difficulty_level: 'beginner',
    tags: ['ai', 'image-generation', 'art', 'creative', 'design', 'visual', '미드저니', 'AI', '이미지'],
    alternatives: ['leonardo-ai', 'runway-ml'],
    compatibility: {
      framework: [],
      language: [],
    },
    official_sdks: {},
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$10-30', growth: '$60-120', enterprise: '해당 없음 (개인 구독제)' },
  },

  // -----------------------------------------------------------------------
  // 50. Runway ML
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.runway_ml,
    name: 'Runway',
    slug: 'runway-ml',
    category: 'ai',
    description:
      'AI video generation and editing platform with Gen-4 models for text-to-video, image-to-video, and Act-Two lip-sync.',
    description_ko: 'Gen-4/4.5 등 AI 비디오 생성 모델을 제공하는 크리에이티브 AI 플랫폼으로, 크레딧 기반 Free~Enterprise 플랜을 운영합니다.',
    icon_url: null,
    website_url: 'https://runway.com',
    docs_url: 'https://learn.runwayml.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '가입 시 125 크레딧 1회성 무료 제공.',
      plans: [
        { name: 'Free', price: '$0 (125 크레딧 1회)' },
        { name: 'Standard', price: '$12/월(연간) 또는 $15/월 (월 625 크레딧)' },
        { name: 'Pro', price: '$28/월(연간) 또는 $35/월 (월 2,250 크레딧)' },
        { name: 'Max', price: '$76/월(연간) 또는 $95/월 (월 9,500 크레딧)' },
        { name: 'Enterprise', price: '맞춤 견적' },
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
    alternatives: ['sora', 'leonardo-ai'],
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
    monthly_cost_estimate: { starter: '$0-15', growth: '$28-95', enterprise: '맞춤 견적' },
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
      'OpenAI의 텍스트-비디오 생성 모델(sora-2/sora-2-pro)로, 앱과 API로 제공되었으나 2026년 9월 24일 API 종료가 공지되었습니다.',
    icon_url: null,
    website_url: 'https://openai.com/sora',
    docs_url: 'https://platform.openai.com/docs',
    pricing_info: {
      free_tier: false,
      free_tier_details: '상시 무료 티어 확인 안 됨. ChatGPT Plus/Pro 구독을 통한 앱 내 제한적 사용 가능성 있으나 공식 확인 못함.',
      plans: [
        { name: 'sora-2 (720p)', price: '$0.10/초 (배치 $0.05/초)' },
        { name: 'sora-2-pro (720p)', price: '$0.30/초 (배치 $0.15/초)' },
        { name: 'sora-2-pro (1024p)', price: '$0.50/초' },
        { name: 'sora-2-pro (1080p)', price: '$0.70/초 (배치 $0.35/초)' },
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
    alternatives: ['runway-ml'],
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
    monthly_cost_estimate: { starter: '$5-50 (종량제)', growth: '$50-500', enterprise: '해당 종료 예정(2026-09-24)' },
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
    description_ko: '게임·크리에이티브 자산 제작에 특화된 AI 이미지·비디오 생성 플랫폼으로, 토큰 기반 Free~Team 구독 및 별도 API 크레딧을 운영합니다.',
    icon_url: null,
    website_url: 'https://leonardo.ai',
    docs_url: 'https://docs.leonardo.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: '매일 150 토큰 무료 제공(서드파티 교차검증).',
      plans: [
        { name: 'Free', price: '$0 (일 150 토큰)' },
        { name: 'Apprentice', price: '$10~12/월 (월 8,500 토큰)' },
        { name: 'Artisan', price: '$24~30/월' },
        { name: 'Maestro', price: '$48~60/월 (월 60,000 토큰)' },
        { name: 'Team', price: '$72~144/좌석' },
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
    alternatives: ['midjourney'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0-30', growth: '$48-144', enterprise: '맞춤 견적' },
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
    description_ko: '음성 인식(STT)·음성 합성(TTS)·음성 에이전트 API를 제공하는 음성 AI 플랫폼으로, 신규 가입 시 $200 무료 크레딧을 제공합니다.',
    icon_url: null,
    website_url: 'https://deepgram.com',
    docs_url: 'https://developers.deepgram.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '신규 가입 시 $200 무료 크레딧(신용카드 불필요).',
      plans: [
        { name: 'Nova-3 Monolingual (사전녹음)', price: '$0.0048/분' },
        { name: 'Nova-3 Multilingual (사전녹음)', price: '$0.0058/분' },
        { name: 'Aura-2 TTS', price: '$0.030/1,000자' },
        { name: 'Voice Agent API (Standard)', price: '$0.075/분' },
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
    alternatives: ['assemblyai'],
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
    monthly_cost_estimate: { starter: '$0-100 (종량제)', growth: '$100-4000', enterprise: '맞춤 견적' },
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
    description_ko: '음성 인식(STT)·음성 에이전트 API를 제공하는 음성 AI 플랫폼으로, 구독/좌석 없이 순수 종량제로 과금합니다.',
    icon_url: null,
    website_url: 'https://www.assemblyai.com',
    docs_url: 'https://www.assemblyai.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '가입 시 $50 무료 크레딧 제공(신용카드 불필요), 무료 계정은 동시 스트리밍 5개로 제한.',
      plans: [
        { name: 'Universal-2 (사전녹음)', price: '$0.15/시간' },
        { name: 'Universal-3.5 Pro (사전녹음)', price: '$0.21/시간' },
        { name: 'Universal-3.5 Pro Realtime (스트리밍)', price: '$0.45/시간' },
        { name: 'Voice Agent API', price: '$4.50/시간' },
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
    alternatives: ['deepgram'],
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
    monthly_cost_estimate: { starter: '$0-50 (종량제)', growth: '$50-1000', enterprise: '맞춤 견적' },
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
    description_ko: 'AI 음성 합성(TTS)·음성 클로닝 API를 제공하는 플랫폼으로, 크레딧(문자수) 기반 Free~Enterprise 플랜을 운영합니다.',
    icon_url: null,
    website_url: 'https://play.ht',
    docs_url: 'https://docs.play.ht',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 12,500자 무료, 1개 인스턴트 음성 클로닝 제공(상업적 이용 불가, PlayHT 크레딧 표기 필요) — 서드파티 교차검증.',
      plans: [
        { name: 'Free', price: '$0 (월 12,500자)' },
        { name: 'Creator', price: '$19~31.20/월' },
        { name: 'Unlimited', price: '$49~99/월' },
        { name: 'Enterprise', price: '맞춤 견적' },
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
    alternatives: ['elevenlabs'],
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
    monthly_cost_estimate: { starter: '$0-31', growth: '$49-99', enterprise: '맞춤 견적' },
  },

  // -----------------------------------------------------------------------
  // 56. Windsurf (Codeium)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.windsurf,
    name: 'Devin Desktop (구 Windsurf)',
    slug: 'windsurf',
    category: 'ai',
    description:
      'Agentic IDE by Codeium where autonomous coding agents understand complex requirements and implement solutions across multiple files.',
    description_ko:
      '구 Windsurf/Codeium이 2026년 6월 \'Devin Desktop\'으로 리브랜딩된 AI 코드 에디터로, Cognition의 Devin 에이전트 제품군에 통합되었습니다.',
    icon_url: null,
    website_url: 'https://devin.ai/desktop',
    docs_url: 'https://docs.windsurf.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free 플랜: 무제한 Tab 자동완성 + 제한적 에이전트(Cascade) 사용량 쿼터.',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro', price: '$20/월' },
        { name: 'Max', price: '$200/월' },
        { name: 'Teams', price: '$80/월 + 사용자당 $40/월' },
        { name: 'Enterprise', price: '맞춤 견적' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 75,
    difficulty_level: 'beginner',
    tags: ['ai', 'coding-assistant', 'ide', 'agentic', 'codeium', 'autocomplete', '윈드서프', '코딩어시스턴트'],
    alternatives: ['cursor', 'github-copilot', 'cline', 'tabnine'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'svelte', 'express', 'django'],
      language: ['typescript', 'javascript', 'python', 'go', 'rust', 'java', 'c#'],
    },
    official_sdks: {},
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0-20', growth: '$80-200', enterprise: '맞춤 견적' },
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
      '온프레미스/VPC 배포를 지원하는 프라이버시 중심 AI 코드 어시스턴트로, Code Assistant·Agentic Platform 2개 유료 플랜을 운영합니다.',
    icon_url: null,
    website_url: 'https://www.tabnine.com',
    docs_url: 'https://docs.tabnine.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '공식 페이지 기준 무료 플랜 미노출(2026-07 확인). 다만 일부 서드파티 소스는 무료 Basic 플랜 존재를 언급 — 상충되어 null 처리.',
      plans: [
        { name: 'Code Assistant Platform', price: '$39/월(연간 구독 기준)' },
        { name: 'Agentic Platform', price: '$59/월(연간 구독 기준)' },
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
    monthly_cost_estimate: { starter: '$39', growth: '$59', enterprise: '맞춤 견적 (VPC/온프레미스/에어갭)' },
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
      'AWS의 AI 코딩 어시스턴트로, IDE 플러그인·CLI·콘솔에서 코드 생성과 Java/.NET 마이그레이션을 지원했으나, AWS가 후속 에이전틱 IDE인 Kiro로 전환을 발표하며 2027-04-30 단계적 종료 예정이다.',
    icon_url: null,
    website_url: 'https://aws.amazon.com/q/developer',
    docs_url: 'https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 50회 에이전틱 요청, Java 업그레이드 월 1,000라인, IDE/CLI/콘솔 접근 포함 (2026-05-15 이후 신규 가입 불가)',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro', price: '$19/월/사용자 (오버리지 라인당 $0.003)' },
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
    alternatives: ['github-copilot', 'cursor', 'cline', 'devin'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask', 'spring'],
      language: ['typescript', 'javascript', 'python', 'java', 'go', 'c#', 'rust'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$19/사용자', enterprise: '문의 필요' },
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
      '오픈소스 벡터 데이터베이스로, 하이브리드 검색·멀티테넌시를 지원하며 Weaviate Cloud는 2025년 10월 가격 체계 개편 이후 Free/Flex/Premium 3단계 요금제로 운영된다.',
    icon_url: null,
    website_url: 'https://weaviate.io',
    docs_url: 'https://docs.weaviate.io/weaviate',
    pricing_info: {
      free_tier: true,
      free_tier_details: '영구 무료: 10만 오브젝트, 1GB 메모리, 10GB 디스크, 컬렉션 1개, 기본 이메일 지원',
      plans: [
        { name: 'Free', price: '$0/월' },
        { name: 'Flex', price: '$45/월~ (종량제, 공유 클라우드, SLA 99.5%)' },
        { name: 'Premium', price: '$400/월~ (선결제 계약, SLA 99.95%)' },
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
    alternatives: ['qdrant', 'chroma'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$45-280', enterprise: '$400+' },
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
      '오픈소스 벡터 검색 엔진으로, Qdrant Cloud는 무료 영구 클러스터(0.5 vCPU/1GB RAM/4GB 디스크)와 사용량 기반 Standard/Premium 티어, Hybrid/Private Cloud 배포 옵션을 제공한다.',
    icon_url: null,
    website_url: 'https://qdrant.tech',
    docs_url: 'https://qdrant.tech/documentation/',
    pricing_info: {
      free_tier: true,
      free_tier_details: '영구 무료 클러스터: 1노드, 0.5 vCPU, 1GB RAM, 4GB 디스크, 무료 클라우드 추론 일부 모델 포함',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Standard', price: '종량제 (vCPU/메모리/스토리지 시간당 과금, 예: 5M 벡터 768차원 기준 $65-130/월)' },
        { name: 'Premium', price: '최소 스펜드 필요 + SSO/전용 VPC' },
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
    alternatives: ['weaviate', 'chroma'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$30-200', enterprise: '문의 필요' },
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
      '오픈소스 임베딩 데이터베이스로 셀프호스팅은 완전 무료이며, 2026년 1분기 출시된 Chroma Cloud는 Starter($5 무료 크레딧)·Team($250/월)·Enterprise 요금제로 사용량 기반 과금(쓰기·스토리지·쿼리·네트워크)을 적용한다.',
    icon_url: null,
    website_url: 'https://www.trychroma.com',
    docs_url: 'https://docs.trychroma.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Starter 플랜에 $5 무료 크레딧 제공, DB 10개/팀원 10명까지, 이후 종량제(쓰기 $2.50/GiB, 스토리지 $0.33/GiB/월 등)',
      plans: [
        { name: 'Starter', price: '$0 + 사용량' },
        { name: 'Team', price: '$250/월 + 사용량 ($100 무료 크레딧 포함)' },
        { name: 'Enterprise', price: '맞춤 견적' },
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
    alternatives: ['weaviate', 'qdrant'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$5-250', enterprise: '맞춤 견적' },
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
      '멀티 에이전트 오케스트레이션 프레임워크로, 오픈소스 코어는 무료이며 관리형 플랫폼 CrewAI AMP는 Basic(무료, 월 50회 실행)과 Enterprise(맞춤 견적) 요금제로 운영된다.',
    icon_url: null,
    website_url: 'https://www.crewai.com',
    docs_url: 'https://docs.crewai.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Basic 플랜: 월 50회 워크플로우 실행, 비주얼 에디터+AI 코파일럿, GitHub 연동 포함',
      plans: [
        { name: 'Basic', price: '$0' },
        { name: 'Enterprise', price: '맞춤 견적 (전용 인프라, SSO, FedRAMP High 등)' },
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
    alternatives: ['dify'],
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
    monthly_cost_estimate: { starter: '$0', growth: 'LLM API 비용 별도', enterprise: '맞춤 견적' },
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
      'AI 에이전트·워크플로우·챗봇을 구축하는 오픈소스 플랫폼으로, Dify Cloud는 Sandbox(무료)·Professional($590/년)·Team($1,590/년) 요금제를, 셀프호스팅은 커뮤니티 에디션(무료)과 Enterprise(맞춤 견적)를 제공한다.',
    icon_url: null,
    website_url: 'https://dify.ai',
    docs_url: 'https://docs.dify.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Sandbox: 메시지 크레딧 200개, 워크스페이스 1개, 팀원 1명, 앱 5개, 지식 문서 50개/50MB',
      plans: [
        { name: 'Sandbox', price: '$0' },
        { name: 'Professional', price: '$590/워크스페이스/년' },
        { name: 'Team', price: '$1,590/워크스페이스/년' },
        { name: 'Enterprise', price: '맞춤 견적' },
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
    alternatives: ['crewai'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$49-133/월(연환산)', enterprise: '맞춤 견적' },
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
      '오픈소스 모델 서빙·파인튜닝·GPU 클러스터를 제공하는 추론 플랫폼으로, 서버리스는 모델별 토큰당 종량제, 전용 GPU는 시간당 과금(H100 온디맨드 $5.49/시간)으로 운영되며 무료 체험 크레딧은 더 이상 제공하지 않는다.',
    icon_url: null,
    website_url: 'https://together.ai',
    docs_url: 'https://docs.together.ai',
    pricing_info: {
      free_tier: false,
      free_tier_details: '무료 체험 크레딧 없음 — 최소 $5 선결제 필요',
      plans: [
        { name: 'Serverless Inference', price: '$0.05~$9.00 /1M 토큰 (모델별 상이)' },
        { name: 'Dedicated (H100)', price: '$5.49/시간 (온디맨드)' },
        { name: 'Dedicated (B200)', price: '$8.99/시간 (온디맨드)' },
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
    alternatives: ['fireworks-ai', 'groq'],
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
    monthly_cost_estimate: { starter: '$5~', growth: '사용량 기반', enterprise: '맞춤 견적' },
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
      '오픈소스 모델 서빙 플랫폼으로, 서버리스 추론은 파라미터 규모별 토큰당 과금, 온디맨드 GPU는 시간당 과금(H100/H200 $7/시간)이며 신규 계정에 $1 무료 크레딧을 제공한다.',
    icon_url: null,
    website_url: 'https://fireworks.ai',
    docs_url: 'https://docs.fireworks.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: '신규 계정 $1 무료 크레딧 (영구 무료 모델 티어는 없음)',
      plans: [
        { name: 'Serverless (input, <4B params)', price: '$0.10/1M 토큰' },
        { name: 'Serverless (input, >16B params)', price: '$0.90/1M 토큰' },
        { name: 'On-demand H100/H200', price: '$7.00/시간' },
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
    alternatives: ['together-ai', 'groq'],
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
    monthly_cost_estimate: { starter: '$1 크레딧', growth: '사용량 기반', enterprise: '맞춤 견적' },
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
      '서버리스 GPU/CPU 컴퓨트 플랫폼으로, 초당 과금(H100 $0.001097/초)과 Starter($30 무료 크레딧)·Team($250/월, $100 크레딧 포함)·Enterprise 요금제를 제공한다.',
    icon_url: null,
    website_url: 'https://modal.com',
    docs_url: 'https://modal.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Starter 플랜: 월 $30 무료 크레딧, 워크스페이스 시트 3개, 컨테이너 100개',
      plans: [
        { name: 'Starter', price: '$0 + 사용량 ($30 크레딧 포함)' },
        { name: 'Team', price: '$250/월 + 사용량 ($100 크레딧 포함)' },
        { name: 'Enterprise', price: '맞춤 견적' },
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
    alternatives: ['replicate'],
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
    monthly_cost_estimate: { starter: '$0-30', growth: '$250+', enterprise: '맞춤 견적' },
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
      'ML 실험 추적·평가·관측성 플랫폼으로, 개인/학술 연구는 무료이며 Pro($60/사용자/월)·Enterprise(맞춤 견적) 요금제를 제공하고 W&B Weave(LLM 앱 관측) 등 사용량 기반 부가 서비스도 운영한다.',
    icon_url: null,
    website_url: 'https://wandb.ai',
    docs_url: 'https://docs.wandb.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Free 플랜: 시트 5개, 스토리지 5GB/월, Weave 데이터 수집 1GB/월 (개인 용도, 기업 사용 불가)',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro', price: '$60/사용자/월 (30일 무료 체험)' },
        { name: 'Enterprise', price: '맞춤 견적' },
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
    monthly_cost_estimate: { starter: '$0', growth: '$60/사용자', enterprise: '맞춤 견적' },
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
      'Meta의 Instagram 플랫폼 API. 비즈니스/크리에이터 계정에서 콘텐츠 게시, 댓글·다이렉트 메시지 관리, 인사이트 조회를 지원하며 Graph API(2026-02-18 기준 최신 v25.0) 위에서 동작한다. 일반 개인 계정은 지원하지 않으며 Instagram Login 또는 Facebook Login for Business 두 가지 인증 방식 중 선택해야 한다.',
    description_ko:
      'Meta의 Instagram 플랫폼 API. 비즈니스/크리에이터 계정에서 콘텐츠 게시, 댓글·다이렉트 메시지 관리, 인사이트 조회를 지원하며 Graph API(2026-02-18 기준 최신 v25.0) 위에서 동작한다. 일반 개인 계정은 지원하지 않으며 Instagram Login 또는 Facebook Login for Business 두 가지 인증 방식 중 선택해야 한다.',
    icon_url: null,
    website_url: 'https://developers.facebook.com/docs/instagram-api',
    docs_url: 'https://developers.facebook.com/docs/instagram-platform',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Meta는 API 호출 자체에 과금하지 않는다. 콘텐츠 게시/조회 계열 엔드포인트는 Business Use Case(BUC) 기준 24시간 호출 한도 = 4,800 × 노출수(impressions)로 계산되며, 메시징 API는 별도로 초당 요청 수 제한(예: 대화 조회 초당 2회, 텍스트 메시지 발송 초당 100회)이 적용된다.',
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
    alternatives: ['threads-api', 'tiktok-api'],
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
    monthly_cost_estimate: { starter: '무료', growth: '무료', enterprise: '무료' },
  },

  // -----------------------------------------------------------------------
  // YouTube Data API v3
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.youtube_api,
    name: 'YouTube Data API v3',
    slug: 'youtube-api',
    category: 'sns',
    description:
      'YouTube 채널·동영상·재생목록·댓글 데이터를 조회/관리하는 Google 공식 API. 현재도 v3가 최신이며 별도의 v4는 존재하지 않는다. 기본 무료 일일 할당량(대부분 프로젝트 10,000 유닛)을 제공하고, 유료 요금제는 없으며 할당량 증액은 컴플라이언스 감사 통과를 전제로 무료 신청한다.',
    description_ko:
      'YouTube 채널·동영상·재생목록·댓글 데이터를 조회/관리하는 Google 공식 API. 현재도 v3가 최신이며 별도의 v4는 존재하지 않는다. 기본 무료 일일 할당량(대부분 프로젝트 10,000 유닛)을 제공하고, 유료 요금제는 없으며 할당량 증액은 컴플라이언스 감사 통과를 전제로 무료 신청한다.',
    icon_url: null,
    website_url: 'https://developers.google.com/youtube/v3',
    docs_url: 'https://developers.google.com/youtube/v3/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '기본 할당량은 프로젝트당 하루 10,000 유닛(모든 엔드포인트 합산) + search.list 100회/일, videos.insert 100회/일 별도 상한. 읽기 오퍼레이션은 대체로 1유닛, 쓰기/검색은 훨씬 높은 비용이 부과되며, 유효하지 않은 요청도 최소 1유닛을 소모한다. 기본 할당량을 초과하려면 YouTube API Services 약관 준수 여부를 확인하는 \'할당량 확장 신청(오디트)\'을 통과해야 한다.',
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
    monthly_cost_estimate: { starter: '무료(일 10,000 유닛)', growth: '무료(할당량 확장 신청)', enterprise: '무료(공식 유료 플랜 없음)' },
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
      'X(구 Twitter)의 게시물·사용자·타임라인 데이터를 다루는 API. 2026년 2월부터 신규 개발자는 구독형 요금제 대신 사용량만큼 과금되는 pay-per-use 방식이 기본이며(게시물 작성 $0.015/건, 조회 $0.005/건 등), 무료 티어는 더 이상 신규 발급되지 않는다. 기존 Basic/Pro 구독자는 레거시 요금제를 유지할 수 있다.',
    description_ko:
      'X(구 Twitter)의 게시물·사용자·타임라인 데이터를 다루는 API. 2026년 2월부터 신규 개발자는 구독형 요금제 대신 사용량만큼 과금되는 pay-per-use 방식이 기본이며(게시물 작성 $0.015/건, 조회 $0.005/건 등), 무료 티어는 더 이상 신규 발급되지 않는다. 기존 Basic/Pro 구독자는 레거시 요금제를 유지할 수 있다.',
    icon_url: null,
    website_url: 'https://developer.x.com',
    docs_url: 'https://developer.x.com/en/docs/x-api',
    pricing_info: {
      free_tier: false,
      free_tier_details: '신규 가입자 대상 무료 티어는 폐지됨(2026년 2월 기준). 기존 레거시 가입자에 한해 예전 무료/저가 등급이 남아있을 수 있으나 신규 발급은 불가.',
      plans: [
        { name: 'Pay-per-use (신규 기본 요금제)', price: '게시물 작성 $0.015/건(링크 포함 시 $0.20/건), 게시물 조회 $0.005/건(월 최대 200만 건 caps), 사용자 정보 조회 $0.010/건, 좋아요 조회 $0.001/건, 본인 데이터 조회(Owned Reads) $0.001/건' },
        { name: 'Legacy Basic (기존 가입자 한정, 신규 가입 불가)', price: '$200/월' },
        { name: 'Legacy Pro (기존 가입자 한정, 신규 가입 불가)', price: '$5,000/월' },
        { name: 'Enterprise', price: '약 $42,000/월~ (협의)' },
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
    alternatives: ['threads-api', 'linkedin-api'],
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
    monthly_cost_estimate: { starter: '종량제(사용량 비례, 최소 사용 시 $0에 근접)', growth: '레거시 $200~$5,000 또는 종량제', enterprise: '$42,000+' },
  },

  // -----------------------------------------------------------------------
  // TikTok API
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.tiktok_api,
    name: 'TikTok API for Developers',
    slug: 'tiktok-api',
    category: 'sns',
    description:
      'TikTok for Developers 플랫폼. Content Posting API(Direct Post/Upload), Display API, Login Kit, Share Kit, Research API, Data Portability API 등을 제공하며 공식적으로는 무료다. 다만 프로덕션 환경에서 공개 게시를 하려면 앱 심사(App Review) 통과가 필수이며, 심사 전에는 게시물이 강제로 비공개 처리된다. Research API는 미국·EEA·영국·스위스 소재 학술기관 소속 비영리 연구자에게만 제공되며 상업적 이용은 금지된다.',
    description_ko:
      'TikTok for Developers 플랫폼. Content Posting API(Direct Post/Upload), Display API, Login Kit, Share Kit, Research API, Data Portability API 등을 제공하며 공식적으로는 무료다. 다만 프로덕션 환경에서 공개 게시를 하려면 앱 심사(App Review) 통과가 필수이며, 심사 전에는 게시물이 강제로 비공개 처리된다. Research API는 미국·EEA·영국·스위스 소재 학술기관 소속 비영리 연구자에게만 제공되며 상업적 이용은 금지된다.',
    icon_url: null,
    website_url: 'https://developers.tiktok.com',
    docs_url: 'https://developers.tiktok.com/doc/overview',
    pricing_info: {
      free_tier: true,
      free_tier_details: '공식 유료 티어나 호출당 과금이 명시되어 있지 않음 — Content Posting, Display, Login Kit 등 주요 제품은 무료로 등록·이용 가능. 단, 프로덕션 공개 게시 전에는 앱 심사 통과가 필요하며, 1인당 게시물 게시는 분당 6회로 제한된다(Content Posting API 기준).',
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
    alternatives: ['instagram-api', 'youtube-api'],
    compatibility: {
      framework: ['next', 'express', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'java'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 25,
    monthly_cost_estimate: { starter: '무료', growth: '무료(앱 심사 통과 필요)', enterprise: '무료(공식 유료 플랜 없음)' },
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
      'LinkedIn API는 용도별로 나뉜다: Consumer(로그인/기본 프로필, 무료), Share on LinkedIn(게시, 무료), Marketing Developer Platform(광고·분석, 파트너 승인 필요), Talent/Learning(엔터프라이즈 파트너십 전용), Sales Navigator API(신규 파트너 접수 중단). 이 중 Marketing(광고) API는 Development(테스트 계정 1개, 최대 5개 계정 수정)와 Standard(계정 수 무제한) 두 접근 티어로 나뉘며 모두 LinkedIn의 개별 심사를 통과해야 한다.',
    description_ko:
      'LinkedIn API는 용도별로 나뉜다: Consumer(로그인/기본 프로필, 무료), Share on LinkedIn(게시, 무료), Marketing Developer Platform(광고·분석, 파트너 승인 필요), Talent/Learning(엔터프라이즈 파트너십 전용), Sales Navigator API(신규 파트너 접수 중단). 이 중 Marketing(광고) API는 Development(테스트 계정 1개, 최대 5개 계정 수정)와 Standard(계정 수 무제한) 두 접근 티어로 나뉘며 모두 LinkedIn의 개별 심사를 통과해야 한다.',
    icon_url: null,
    website_url: 'https://developer.linkedin.com',
    docs_url: 'https://learn.microsoft.com/en-us/linkedin/',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Consumer API(로그인, 기본 프로필)와 Share on LinkedIn(게시)은 무료로 제공된다. Marketing Developer Platform(광고 API)은 공식 가격을 공개하지 않으며 파트너 승인이 필요하고, Advertising API 자체는 무료이나 Development 티어(광고 계정 생성 API 접근 1개 제한, 수정 최대 5개 계정)와 Standard 티어(무제한) 중 심사를 거쳐 배정된다.',
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
    monthly_cost_estimate: { starter: '무료 (Consumer/Share)', growth: '비공개 (Marketing Developer Platform, 파트너 승인 필요)', enterprise: '비공개 (Talent/Learning, 엔터프라이즈 파트너십 전용)' },
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
      'Meta의 Threads API. 사용자를 대신해 게시물 작성(단일/캐러셀), 미디어 첨부, 답글·멘션 관리, 인사이트 조회, 키워드 검색을 지원하며 graph.threads.net/graph.threads.com 엔드포인트를 사용한다. 공식 가격 정책 없이 무료로 제공되나 24시간 롤링 윈도우 기준 게시/답글/삭제/위치검색 횟수 제한이 있다.',
    description_ko:
      'Meta의 Threads API. 사용자를 대신해 게시물 작성(단일/캐러셀), 미디어 첨부, 답글·멘션 관리, 인사이트 조회, 키워드 검색을 지원하며 graph.threads.net/graph.threads.com 엔드포인트를 사용한다. 공식 가격 정책 없이 무료로 제공되나 24시간 롤링 윈도우 기준 게시/답글/삭제/위치검색 횟수 제한이 있다.',
    icon_url: null,
    website_url: 'https://developers.facebook.com/docs/threads',
    docs_url: 'https://developers.facebook.com/docs/threads/overview',
    pricing_info: {
      free_tier: true,
      free_tier_details: '요금 없음. 24시간 롤링 윈도우 기준 게시물 250건(캐러셀은 1건으로 계산), 답글 1,000건, 삭제 100건, 위치 검색 500건 한도. GET /{threads-user-id}/threads_publishing_limit 엔드포인트로 실시간 사용량(quota_usage 등) 확인 가능.',
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
    monthly_cost_estimate: { starter: '무료', growth: '무료', enterprise: '무료' },
  },

  // -----------------------------------------------------------------------
  // Polar
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.polar,
    name: 'Polar',
    slug: 'polar',
    category: 'payment',
    description: '개발자·AI 스타트업을 위한 Merchant of Record 결제/구독 빌링 플랫폼으로, 2026년 5월 티어형 요금제로 개편되었습니다.',
    description_ko: '개발자·AI 스타트업을 위한 Merchant of Record 결제/구독 빌링 플랫폼으로, 2026년 5월 티어형 요금제로 개편되었습니다.',
    icon_url: null,
    website_url: 'https://polar.sh',
    docs_url: 'https://polar.sh/docs/merchant-of-record/fees',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Starter(무료) 플랜: 5% + $0.50/건.',
      plans: [
        { name: 'Starter', price: '무료, 5% + $0.50/건' },
        { name: 'Pro', price: '$20/월, 3.8% + $0.40/건' },
        { name: 'Growth', price: '$100/월, 3.6% + $0.35/건' },
        { name: 'Scale', price: '$400/월, 3.4% + $0.30/건' },
      ],
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
    alternatives: ['stripe', 'lemon-squeezy', 'paddle'],
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
    monthly_cost_estimate: { starter: '$0(5%+$0.50)', growth: '$20~100/월', enterprise: '$400/월(Scale)' },
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
      'AI로 광고 이미지·영상을 생성하는 한국 마케팅 도구로, 조코딩(jocoding) 브랜드에서 제공하던 서비스가 gwanggo.ai 독립 도메인으로 이전되었다. 공식 페이지에서 구체적인 요금제 정보를 확인하지 못했다.',
    icon_url: null,
    website_url: 'https://gwanggo.ai',
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
    description_ko: '외부 서비스 연결을 시각화하고 API 키·환경변수를 관리하는 원클릭 배포 플랫폼(Linkmap 자체 제품)입니다.',
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
    description_ko: '세션 리플레이, 히트맵, AI 요약을 제공하는 마이크로소프트의 무료 사용자 행동 분석 도구입니다.',
    icon_url: null,
    website_url: 'https://clarity.microsoft.com',
    docs_url: 'https://learn.microsoft.com/en-us/clarity/',
    pricing_info: {
      free_tier: true,
      free_tier_details: '완전 무료(트래픽 한도 없음). 전 세계 200만 개 이상 사이트/앱에서 사용 중.',
      plans: [
        { name: 'Free', price: '$0(무제한)' },
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
    alternatives: ['ga4', 'mixpanel', 'plausible'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '이메일 문의(clarityms@microsoft.com)' },
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
      '구글의 에이전틱 개발 플랫폼(IDE/CLI/SDK)으로, 2026년 5월 Antigravity 2.0에서 데스크톱 앱·CLI·SDK가 추가되었으며 Free/AI Pro($20/월)/AI Ultra 중간 티어($100/월, 신설)/AI Ultra 프리미엄($200/월, 기존 $250에서 인하) 요금제로 운영된다.',
    icon_url: null,
    website_url: 'https://antigravity.google',
    docs_url: 'https://antigravity.google/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 티어 제공 (요청 한도 있음), 신용카드 불필요',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Google AI Pro', price: '$20/월' },
        { name: 'Google AI Ultra (중간)', price: '$100/월 (Pro 대비 5배 한도, 신설)' },
        { name: 'Google AI Ultra (프리미엄)', price: '$200/월 (Pro 대비 20배 한도, 기존 $250에서 인하)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'ai_agent',
    popularity_score: 82,
    difficulty_level: 'beginner',
    tags: ['ai', 'ide', 'agentic', 'google', 'gemini', 'vibe-coding', 'code-generation', 'autonomous', '바이브코딩', '구글 안티그래비티', '코딩어시스턴트'],
    alternatives: ['cursor', 'github-copilot'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'svelte', 'angular', 'express', 'django', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust', 'java'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$20-100', enterprise: '$200+' },
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
      '비주얼 워크플로우 빌더와 커스텀 코드를 결합한 워크플로우 자동화 플랫폼으로, 1,500개 이상의 통합 노드를 제공하며 Fair-code(Sustainable Use License) 방식의 셀프호스팅 Community Edition과 유료 Cloud 플랜을 함께 제공합니다.',
    icon_url: null,
    website_url: 'https://n8n.io',
    docs_url: 'https://docs.n8n.io',
    pricing_info: {
      free_tier: false,
      free_tier_details: 'n8n Cloud는 2026년 기준 상시 무료 플랜을 폐지하고 14일 무료 체험만 제공. 단, 셀프호스팅 Community Edition(오픈소스, Sustainable Use License)은 무료',
      plans: [
        { name: 'Starter', price: '€24/월(월간) · 연간 결제 시 약 $20/월, 월 2,500 실행' },
        { name: 'Pro', price: '€60/월(월간) · 연간 결제 시 약 $50/월, 월 1만 실행' },
        { name: 'Business', price: '€800/월(월간) · 연간 결제 시 약 $667/월, 월 4만 실행' },
        { name: 'Enterprise', price: '맞춤 견적' },
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
    popularity_score: 92,
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
    monthly_cost_estimate: { starter: '€24/월(~$20)', growth: '€60/월(~$50)', enterprise: '€800/월(~$667)~맞춤' },
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
      '자연어 설명으로 UI 디자인을 생성하는 구글의 AI 디자인 도구로, 현재 Google Labs 실험 단계라 무료이며(일일 400 디자인 크레딧/15 리디자인 크레딧), 2026년 5월 실시간 협업·멀티플레이어 편집 기능이 추가되었다.',
    description_ko:
      '자연어 설명으로 UI 디자인을 생성하는 구글의 AI 디자인 도구로, 현재 Google Labs 실험 단계라 무료이며(일일 400 디자인 크레딧/15 리디자인 크레딧), 2026년 5월 실시간 협업·멀티플레이어 편집 기능이 추가되었다.',
    icon_url: null,
    website_url: 'https://stitch.withgoogle.com',
    docs_url: 'https://github.com/google-labs-code/stitch-sdk',
    pricing_info: {
      free_tier: true,
      free_tier_details: '일일 400 디자인 크레딧, 15 리디자인 크레딧 (Google 계정만 필요, 신용카드 불필요)',
      plans: [
        { name: 'Free (Labs)', price: '$0' },
      ],
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
    alternatives: ['v0'],
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
    monthly_cost_estimate: { starter: '$0', growth: '미정', enterprise: '미정' },
  },

  // -----------------------------------------------------------------------
  // Cursor
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.cursor,
    name: 'Cursor',
    slug: 'cursor',
    category: 'ai',
    description: 'AI 네이티브 코드 에디터로, 크레딧 기반 사용량제(월 정액 크레딧 풀)로 운영되며 Hobby(무료)부터 Enterprise까지 제공합니다.',
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
    alternatives: ['github-copilot', 'windsurf', 'cline', 'devin'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'svelte', 'nuxt', 'express', 'fastify', 'django', 'rails', 'flask'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust', 'java', 'ruby', 'php', 'csharp'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0-20', growth: '$32-40/사용자', enterprise: '맞춤 견적' },
  },

  // -----------------------------------------------------------------------
  // GitHub Copilot
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.github_copilot,
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    category: 'ai',
    description: 'GitHub의 AI 코딩 어시스턴트로, 2026년 6월부터 프리미엄 요청 대신 \'GitHub AI Credits\' 기반 사용량제 청구로 전환되었습니다.',
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
    alternatives: ['cursor', 'windsurf', 'tabnine', 'cline'],
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
    monthly_cost_estimate: { starter: '$0-10', growth: '$19-39/사용자', enterprise: '$39+/사용자' },
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
      'StackBlitz가 만든 브라우저 기반 AI 풀스택 앱 빌더로, Free(일 30만/월 100만 토큰)·Pro($25/월, 월 1,000만 토큰~)·Teams($30/월/멤버)·Enterprise(맞춤) 요금제로 운영된다.',
    description_ko:
      'StackBlitz가 만든 브라우저 기반 AI 풀스택 앱 빌더로, Free(일 30만/월 100만 토큰)·Pro($25/월, 월 1,000만 토큰~)·Teams($30/월/멤버)·Enterprise(맞춤) 요금제로 운영된다.',
    icon_url: null,
    website_url: 'https://bolt.new',
    docs_url: 'https://support.bolt.new/home',
    pricing_info: {
      free_tier: true,
      free_tier_details: '일일 30만 토큰, 월 100만 토큰, Bolt 브랜딩 노출, 파일 업로드 10MB',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro', price: '$25/월' },
        { name: 'Teams', price: '$30/월/멤버' },
        { name: 'Enterprise', price: '맞춤 견적' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 88,
    difficulty_level: 'beginner',
    tags: ['bolt', 'stackblitz', 'vibe-coding', 'app-builder', 'fullstack', 'no-code', '볼트', '바이브코딩', '앱빌더'],
    alternatives: ['lovable', 'v0', 'replit'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'svelte'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 1,
    monthly_cost_estimate: { starter: '$0', growth: '$25-30', enterprise: '맞춤 견적' },
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
      '자연어로 풀스택 웹앱을 만드는 AI 빌더로, Free(일 5크레딧)·Pro($25/월, 연간 $21)·Business($50/월, 연간 $42)·Enterprise(맞춤) 요금제이며 좌석 수 제한 없이 크레딧 기반으로 과금한다.',
    description_ko:
      '자연어로 풀스택 웹앱을 만드는 AI 빌더로, Free(일 5크레딧)·Pro($25/월, 연간 $21)·Business($50/월, 연간 $42)·Enterprise(맞춤) 요금제이며 좌석 수 제한 없이 크레딧 기반으로 과금한다.',
    icon_url: null,
    website_url: 'https://lovable.dev',
    docs_url: 'https://docs.lovable.dev',
    pricing_info: {
      free_tier: true,
      free_tier_details: '일일 5 빌드 크레딧(월 최대 30개), 월 20 Cloud 크레딧',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro', price: '$25/월 (연간 $21/월)' },
        { name: 'Business', price: '$50/월 (연간 $42/월)' },
        { name: 'Enterprise', price: '맞춤 견적' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 85,
    difficulty_level: 'beginner',
    tags: ['lovable', 'gpt-engineer', 'vibe-coding', 'app-builder', 'supabase', 'fullstack', '러블리', '바이브코딩', '앱빌더'],
    alternatives: ['bolt-new', 'v0', 'replit', 'base44'],
    compatibility: {
      framework: ['next', 'react'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 1,
    monthly_cost_estimate: { starter: '$0', growth: '$25-50', enterprise: '맞춤 견적' },
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
      'Vercel의 AI UI/풀스택 생성 도구로, 도메인이 v0.app으로 통합되었으며 Free($5 크레딧)·Plus($30/사용자/월)·Business($100/사용자/월)·Enterprise(맞춤) 요금제와 모델별 토큰 단가(v0 Mini~v0 Max Fast)를 운영한다.',
    description_ko:
      'Vercel의 AI UI/풀스택 생성 도구로, 도메인이 v0.app으로 통합되었으며 Free($5 크레딧)·Plus($30/사용자/월)·Business($100/사용자/월)·Enterprise(맞춤) 요금제와 모델별 토큰 단가(v0 Mini~v0 Max Fast)를 운영한다.',
    icon_url: null,
    website_url: 'https://v0.app',
    docs_url: 'https://v0.app/docs/',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 $5 크레딧, 일 7메시지 제한, Vercel 배포·GitHub 동기화 포함',
      plans: [
        { name: 'Free', price: '$0 ($5 크레딧)' },
        { name: 'Plus', price: '$30/사용자/월' },
        { name: 'Business', price: '$100/사용자/월' },
        { name: 'Enterprise', price: '맞춤 견적' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 87,
    difficulty_level: 'beginner',
    tags: ['v0', 'vercel', 'ui-generation', 'shadcn', 'react', 'next', 'component', '브이제로', 'UI생성', '바이브코딩'],
    alternatives: ['bolt-new', 'lovable', 'google-stitch'],
    compatibility: {
      framework: ['next', 'react'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 1,
    monthly_cost_estimate: { starter: '$0', growth: '$30-100', enterprise: '맞춤 견적' },
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
      '브라우저 기반 AI 코딩·배포 플랫폼으로, Starter(무료)·Core($20/월, 연간 청구)·Pro($95/월, 2026년 2월 신설, 기존 Teams 대체)·Enterprise(맞춤) 요금제로 운영된다.',
    description_ko:
      '브라우저 기반 AI 코딩·배포 플랫폼으로, Starter(무료)·Core($20/월, 연간 청구)·Pro($95/월, 2026년 2월 신설, 기존 Teams 대체)·Enterprise(맞춤) 요금제로 운영된다.',
    icon_url: null,
    website_url: 'https://replit.com',
    docs_url: 'https://docs.replit.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '제한적 Agent 기능, 일일 AI 크레딧, 앱 1개 게시 가능',
      plans: [
        { name: 'Starter', price: '$0' },
        { name: 'Core', price: '$20/월 (연간 청구, 월별 청구 시 $25)' },
        { name: 'Pro', price: '$95/월 (연간 청구, 월별 청구 시 $100)' },
        { name: 'Enterprise', price: '맞춤 견적' },
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
    alternatives: ['bolt-new', 'lovable', 'v0'],
    compatibility: {
      framework: ['next', 'react', 'express', 'flask', 'django', 'rails'],
      language: ['javascript', 'typescript', 'python', 'go', 'ruby'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 2,
    monthly_cost_estimate: { starter: '$0', growth: '$20-100', enterprise: '맞춤 견적' },
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
      'VS Code/JetBrains용 오픈소스 AI 코딩 에이전트로, 확장 프로그램 자체는 무료이며 사용자가 Anthropic/OpenAI/OpenRouter 등 자체 API 키를 연결해(BYOK) 모델 사용료를 직접 지불하는 구조이고, Enterprise 티어(맞춤 견적)에서 SSO·SLA를 제공한다.',
    description_ko:
      'VS Code/JetBrains용 오픈소스 AI 코딩 에이전트로, 확장 프로그램 자체는 무료이며 사용자가 Anthropic/OpenAI/OpenRouter 등 자체 API 키를 연결해(BYOK) 모델 사용료를 직접 지불하는 구조이고, Enterprise 티어(맞춤 견적)에서 SSO·SLA를 제공한다.',
    icon_url: null,
    website_url: 'https://cline.bot',
    docs_url: 'https://github.com/cline/cline',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 확장 프로그램 완전 무료 — AI 추론 비용만 사용자 부담(BYOK) 또는 Cline 호스팅 종량제 크레딧',
      plans: [
        { name: 'Open Source', price: '$0 (+ AI 추론 비용 별도)' },
        { name: 'Enterprise', price: '맞춤 견적' },
      ],
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
    alternatives: ['github-copilot', 'cursor'],
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
    monthly_cost_estimate: { starter: '$0 + API 비용', growth: '$15-120(API 비용 기준)', enterprise: '맞춤 견적' },
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
      '300개 이상의 AI 모델을 단일 API로 라우팅하는 서비스로, 모델 자체 요금은 제공사 원가 그대로 통과시키고 크레딧 구매 시 5.5%(카드) 또는 5%(크립토) 수수료를, BYOK 사용 시 월 100만 요청 초과분에 5% 수수료를 부과한다.',
    description_ko:
      '300개 이상의 AI 모델을 단일 API로 라우팅하는 서비스로, 모델 자체 요금은 제공사 원가 그대로 통과시키고 크레딧 구매 시 5.5%(카드) 또는 5%(크립토) 수수료를, BYOK 사용 시 월 100만 요청 초과분에 5% 수수료를 부과한다.',
    icon_url: null,
    website_url: 'https://openrouter.ai',
    docs_url: 'https://openrouter.ai/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 모델 다수 제공(일 50회 제한, $10 이상 크레딧 구매 시 일 1,000회로 상향)',
      plans: [
        { name: 'Pay-as-you-go', price: '크레딧 구매 시 5.5%(카드)/5%(크립토) 수수료' },
        { name: 'BYOK', price: '월 100만 요청 무료, 초과분 5% 수수료' },
        { name: 'Enterprise', price: '맞춤 견적 (SSO/SAML, SLA)' },
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
    alternatives: ['together-ai', 'fireworks-ai'],
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
    monthly_cost_estimate: { starter: '$0', growth: '모델 원가 + 5.5% 수수료', enterprise: '맞춤 견적' },
  },

  // -----------------------------------------------------------------------
  // Hugging Face
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.huggingface,
    name: 'Hugging Face',
    slug: 'huggingface',
    category: 'ai',
    description: '200만 개 이상의 공개 모델·데이터셋을 호스팅하는 ML 커뮤니티 허브로, Spaces·Inference·추론 크레딧 등 개발자용 유료 플랜을 제공합니다.',
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
    alternatives: ['replicate', 'modal', 'wandb'],
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
    monthly_cost_estimate: { starter: '$0-9', growth: '$20-50/사용자', enterprise: '$50+/사용자' },
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
      '다양한 오픈소스/커스텀 AI 모델을 API로 배포·실행할 수 있는 모델 호스팅 플랫폼으로, 2025년 11월 Cloudflare에 인수되었으나 독립 브랜드로 운영 중입니다.',
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
        description: 'Replicate API token for running ML models via API',
        description_ko: 'Replicate API 토큰 (ML 모델 API 실행용)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'model_hub',
    popularity_score: 80,
    difficulty_level: 'beginner',
    tags: ['replicate', 'ml-serving', 'model-api', 'gpu', 'stable-diffusion', 'image-generation', '레플리케이트', '모델서빙', 'AI'],
    alternatives: ['huggingface', 'modal', 'together-ai', 'fireworks-ai'],
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
    monthly_cost_estimate: { starter: '$5-50 (종량제)', growth: '$50-500', enterprise: '맞춤 견적' },
  },

  // -----------------------------------------------------------------------
  // Convex
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.convex,
    name: 'Convex',
    slug: 'convex',
    category: 'database',
    description: 'TypeScript 함수와 리액티브 쿼리를 결합한 백엔드 플랫폼으로, DB·파일 저장·벡터 검색·인증을 하나의 런타임에서 제공합니다.',
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
    monthly_cost_estimate: { starter: '$0', growth: '$25/개발자', enterprise: '$2,500+' },
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
      'SQLite 기반 libSQL 엔진을 사용하는 엣지 데이터베이스 서비스로, 전 세계에 분산 복제되는 서버리스 DB를 제공합니다. Free/Developer/Scaler/Pro/Enterprise 5단계 요금제를 운영합니다.',
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
    alternatives: ['neon', 'planetscale'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$4.99-24.92', enterprise: '$416.58+' },
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
      '타입 세이프 쿼리를 지원하는 오픈소스 ORM(Prisma ORM)과, 이를 기반으로 한 관리형 서버리스 Postgres(Prisma Postgres)를 함께 제공합니다.',
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
        description: 'Database connection string for Prisma (PostgreSQL, MySQL, SQLite, etc.)',
        description_ko: 'Prisma DB 연결 문자열 (PostgreSQL, MySQL, SQLite 등)',
      },
    ],
    domain: 'backend',
    subcategory: 'orm',
    popularity_score: 90,
    difficulty_level: 'beginner',
    tags: ['prisma', 'orm', 'typescript', 'database', 'migration', 'type-safe', 'postgresql', '프리즈마', 'ORM', '데이터베이스'],
    alternatives: ['drizzle'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$10-49', enterprise: '$129+' },
  },

  // -----------------------------------------------------------------------
  // Paddle
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.paddle,
    name: 'Paddle',
    slug: 'paddle',
    category: 'payment',
    description: '세금 규정 준수·구독 청구·사기 방지를 통합 제공하는 Merchant of Record형 결제 플랫폼입니다.',
    description_ko: '세금 규정 준수·구독 청구·사기 방지를 통합 제공하는 Merchant of Record형 결제 플랫폼입니다.',
    icon_url: null,
    website_url: 'https://www.paddle.com',
    docs_url: 'https://developer.paddle.com',
    pricing_info: {
      free_tier: false,
      free_tier_details: '월 구독료·숨겨진 수수료 없음. 거래 시에만 단일 수수료 부과.',
      plans: [
        { name: '전 기능 포함 단일 요금', price: '5% + $0.50/건(세금 처리·청구·사기방지·지원 포함)' },
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
    monthly_cost_estimate: { starter: '$0(거래별 수수료만)', growth: '거래액 × 5%+$0.50', enterprise: '협의($10 이하 상품/인보이스 등 특수 케이스)' },
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
      'Next.js 풀스택 프레임워크로서 관리자 대시보드, DB, REST/GraphQL API, 인증을 단일 TypeScript 코드베이스로 제공하는 오픈소스 헤드리스 CMS입니다.',
    description_ko:
      'Next.js 풀스택 프레임워크로서 관리자 대시보드, DB, REST/GraphQL API, 인증을 단일 TypeScript 코드베이스로 제공하는 오픈소스 헤드리스 CMS입니다.',
    icon_url: null,
    website_url: 'https://payloadcms.com',
    docs_url: 'https://payloadcms.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 자체 호스팅 무료(npx create-payload-app). Payload Cloud의 구체적 플랜/가격은 공식 페이지에서 확인하지 못함(로그인 필요 페이지로만 연결).',
      plans: [
        { name: 'Enterprise', price: '맞춤 견적(Talk to Us / Schedule a Demo)' },
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
    monthly_cost_estimate: { starter: '$0(자체 호스팅)', growth: '확인 안 됨(Payload Cloud)', enterprise: '협의' },
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
      '샘플링 없이 대용량 로그·이벤트·메트릭을 저비용으로 수집·저장·질의하는 매니지드 데이터 플랫폼입니다. 무료 Personal 플랜 이후에는 데이터 로딩량(GB)과 쿼리 컴퓨트(GB-시간) 기준의 사용량 과금이 적용됩니다.',
    description_ko:
      '샘플링 없이 대용량 로그·이벤트·메트릭을 저비용으로 수집·저장·질의하는 매니지드 데이터 플랫폼입니다. 무료 Personal 플랜 이후에는 데이터 로딩량(GB)과 쿼리 컴퓨트(GB-시간) 기준의 사용량 과금이 적용됩니다.',
    icon_url: null,
    website_url: 'https://axiom.co',
    docs_url: 'https://axiom.co/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Personal 플랜: 월 데이터 로딩 500GB, 쿼리 컴퓨트 10 GB-시간, 저장소 25GB, 보관 기간 30일. 신용카드 불필요.',
      plans: [
        { name: 'Axiom Cloud', price: '$25/월 플랫폼 기본료 + 사용량 (월 데이터 로딩 1TB, 쿼리 컴퓨트 100 GB-시간, 저장소 100GB 포함)' },
        { name: 'Enterprise 애드온', price: 'SSO(SAML) $100/월, RBAC $50/월, Audit Logs $50/월, Directory Sync $100/월' },
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
    alternatives: ['datadog', 'betterstack'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$25 + 사용량', enterprise: '협의 + 애드온' },
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
      '가동시간 모니터링, 로그·트레이스 관리, 인시던트 대응을 통합 제공하며 Datadog 대비 저렴한 가격을 내세우는 옵저버빌리티 플랫폼입니다. 무료 플랜 이후에는 제품별(모니터 수·GB·응답자 수·토큰 등)로 상이한 단위의 종량제 요금이 적용됩니다.',
    description_ko:
      '가동시간 모니터링, 로그·트레이스 관리, 인시던트 대응을 통합 제공하며 Datadog 대비 저렴한 가격을 내세우는 옵저버빌리티 플랫폼입니다. 무료 플랜 이후에는 제품별(모니터 수·GB·응답자 수·토큰 등)로 상이한 단위의 종량제 요금이 적용됩니다.',
    icon_url: null,
    website_url: 'https://betterstack.com',
    docs_url: 'https://betterstack.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '모니터·하트비트 10개, 상태 페이지 1개, 월 예외 추적 10만 건, 세션 리플레이 5,000건, 로그 3GB(3일 보관), 메트릭 30GB.',
      plans: [
        { name: 'Uptime (모니터 추가 50개)', price: '월 $25 / 연 $21' },
        { name: 'Logs & Traces (수집)', price: 'GB당 $0.10~$0.35 (지역별 상이)' },
        { name: 'Logs & Traces (보관)', price: 'GB당 월 $0.05~$0.18' },
        { name: 'Incident Management (Slack 연동)', price: '응답자당 월 $9' },
        { name: 'Session Replay (추가)', price: '건당 $0.0015~$0.0053' },
        { name: 'Telemetry Bundles', price: 'Nano $30-105 / Micro $120-420 / Mega $250-875 / Tera $500-1,750 (월)' },
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
    alternatives: ['sentry', 'datadog', 'axiom'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$25~수백 달러(사용량 기반)', enterprise: '협의' },
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
      '오픈소스 기반의 다채널 알림 인프라로, 이메일·SMS·푸시·인앱·채팅 알림을 단일 워크플로우로 오케스트레이션합니다. 이벤트(워크플로우 실행) 기준으로 과금되며 Free/Pro/Team/Enterprise 요금제를 제공합니다.',
    description_ko:
      '오픈소스 기반의 다채널 알림 인프라로, 이메일·SMS·푸시·인앱·채팅 알림을 단일 워크플로우로 오케스트레이션합니다. 이벤트(워크플로우 실행) 기준으로 과금되며 Free/Pro/Team/Enterprise 요금제를 제공합니다.',
    icon_url: null,
    website_url: 'https://novu.co',
    docs_url: 'https://docs.novu.co',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 워크플로우 실행 10,000회, 전 채널 지원, 워크플로우 최대 20개, 환경 2개(개발+프로덕션), 팀원 최대 3명, 활동 피드 24시간 보관.',
      plans: [
        { name: 'Pro', price: '$30/월부터 (월 3만 회 이상, 초과 시 1,000회당 $1.20)' },
        { name: 'Team', price: '$250/월부터 (월 25만 회 이상, 환경 10개, 90일 보관, RBAC, 600 RPS)' },
        { name: 'Enterprise', price: '맞춤 견적 (월 1,000만 회 이상, HIPAA BAA, SSO/SCIM, 온프레미스)' },
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
    alternatives: ['onesignal'],
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
    monthly_cost_estimate: { starter: '$0', growth: '$30-250', enterprise: '협의' },
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
      '범용 자율 AI 에이전트로 크레딧 기반 과금 체계(Free/Pro $20/월/Pro $40/월/Team $20/시트/월)를 운영하며, 각 플랜에 채팅 모드와 다양한 버전의 Agent 모드(1.6 Max/1.6/1.6 Lite)를 제공한다.',
    description_ko:
      '범용 자율 AI 에이전트로 크레딧 기반 과금 체계(Free/Pro $20/월/Pro $40/월/Team $20/시트/월)를 운영하며, 각 플랜에 채팅 모드와 다양한 버전의 Agent 모드(1.6 Max/1.6/1.6 Lite)를 제공한다.',
    icon_url: null,
    website_url: 'https://manus.im',
    docs_url: 'https://manus.im/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '일일 300 갱신 크레딧, 채팅 모드 및 Manus 1.6 Lite 에이전트 모드 사용 가능',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro (기본)', price: '$20/월~ (연간 17% 할인, 월 4,000크레딧~)' },
        { name: 'Pro (상위)', price: '$40/월~ (7일 무료체험, 월 8,000크레딧~)' },
        { name: 'Team', price: '$20/시트/월~ (연간 17% 할인)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 88,
    difficulty_level: 'beginner',
    tags: ['manus', 'ai-agent', 'autonomous', 'vibe-coding', 'app-builder', 'research', 'web-browsing', '마누스', '자율에이전트', '바이브코딩'],
    alternatives: ['devin', 'bolt-new', 'replit'],
    compatibility: {
      framework: ['next', 'react', 'vue', 'express', 'fastapi'],
      language: ['javascript', 'typescript', 'python'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 1,
    monthly_cost_estimate: { starter: '$0', growth: '$20-40', enterprise: '$200+(Extended)' },
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
      'Cognition Labs의 자율 AI 소프트웨어 엔지니어로, 2025년 Devin 2.0부터 요금이 $500/월에서 대폭 인하되어 현재 Free/Pro($20/월)/Max($200/월, 신설)/Teams($80/월+시트당 $40) 요금제로 운영된다.',
    description_ko:
      'Cognition Labs의 자율 AI 소프트웨어 엔지니어로, 2025년 Devin 2.0부터 요금이 $500/월에서 대폭 인하되어 현재 Free/Pro($20/월)/Max($200/월, 신설)/Teams($80/월+시트당 $40) 요금제로 운영된다.',
    icon_url: null,
    website_url: 'https://devin.ai',
    docs_url: 'https://docs.devin.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: '제한된 사용량으로 에이전트 코딩 가능, 무제한 인라인 편집·탭 완성 포함',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro', price: '$20/월' },
        { name: 'Max', price: '$200/월' },
        { name: 'Teams', price: '$80/월 기본 + $40/월/개발자 시트' },
        { name: 'Enterprise', price: '맞춤 견적' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 85,
    difficulty_level: 'intermediate',
    tags: ['devin', 'cognition', 'ai-engineer', 'autonomous', 'agentic', 'software-engineering', 'devops', '데빈', '자율엔지니어', 'AI에이전트'],
    alternatives: ['github-copilot', 'cursor', 'manus', 'amazon-q-developer'],
    compatibility: {
      framework: ['next', 'react', 'express', 'fastapi', 'django', 'rails', 'spring'],
      language: ['javascript', 'typescript', 'python', 'go', 'java', 'ruby', 'rust'],
    },
    official_sdks: {},
    free_tier_quality: 'none',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0', growth: '$20-200', enterprise: '맞춤 견적' },
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
      '노코드 AI 앱 빌더로, Free(월 25 메시지 크레딧)부터 Starter($16)·Builder($40)·Pro($80)·Elite($160, 모두 연간 청구 기준) 요금제까지 메시지·통합 크레딧 기반으로 과금한다.',
    description_ko:
      '노코드 AI 앱 빌더로, Free(월 25 메시지 크레딧)부터 Starter($16)·Builder($40)·Pro($80)·Elite($160, 모두 연간 청구 기준) 요금제까지 메시지·통합 크레딧 기반으로 과금한다.',
    icon_url: null,
    website_url: 'https://base44.com',
    docs_url: 'https://base44.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 메시지 크레딧 25개, 통합 크레딧 100개',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Starter', price: '$16/월 (연간), $20/월(월별)' },
        { name: 'Builder', price: '$40/월 (연간), $50/월(월별)' },
        { name: 'Pro', price: '$80/월 (연간), $100/월(월별)' },
        { name: 'Elite', price: '$160/월 (연간), $200/월(월별)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 80,
    difficulty_level: 'beginner',
    tags: ['base44', 'wix', 'app-builder', 'vibe-coding', 'fullstack', 'no-code', 'stripe', 'openai', '베이스44', '바이브코딩', '앱빌더'],
    alternatives: ['lovable', 'bolt-new', 'v0', 'replit'],
    compatibility: {
      framework: ['react'],
      language: ['javascript'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 2,
    monthly_cost_estimate: { starter: '$0', growth: '$16-160', enterprise: '$160+' },
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
      '프롬프트만으로 iOS/Android 네이티브 및 크로스플랫폼 모바일 앱을 만드는 빌더로, Free(일 5크레딧)·Rork Pro($20/월~)·Rork Max($200/월~, 네이티브 iOS/SwiftUI 지원) 요금제를 크레딧 티어별로 세분화해 제공한다.',
    description_ko:
      '프롬프트만으로 iOS/Android 네이티브 및 크로스플랫폼 모바일 앱을 만드는 빌더로, Free(일 5크레딧)·Rork Pro($20/월~)·Rork Max($200/월~, 네이티브 iOS/SwiftUI 지원) 요금제를 크레딧 티어별로 세분화해 제공한다.',
    icon_url: null,
    website_url: 'https://rork.com',
    docs_url: 'https://docs.rork.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '일 5크레딧(미국/영국/한국 등 주요 시장 월 최대 35크레딧, 그 외 지역 월 5크레딧), 웹앱·퍼블릭 프로젝트만 가능',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Rork Pro', price: '$20/월(100크레딧)~$100/월(500크레딧)' },
        { name: 'Rork Max', price: '$200/월(1,000크레딧)~$1,800/월(10,000크레딧)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 72,
    difficulty_level: 'beginner',
    tags: ['rork', 'mobile', 'ios', 'android', 'react-native', 'swift', 'app-builder', 'vibe-coding', '로크', '모바일앱', '바이브코딩'],
    alternatives: ['a0-dev', 'base44'],
    compatibility: {
      framework: ['react-native', 'expo'],
      language: ['javascript', 'typescript', 'swift'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 2,
    monthly_cost_estimate: { starter: '$0', growth: '$20-100', enterprise: '$200-1,800' },
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
      '프롬프트로 React Native 네이티브 모바일 앱을 생성·앱스토어 제출까지 지원하는 Y Combinator 출신 빌더로, Free 플랜과 Pro($20/월, 일 100메시지) 플랜을 운영한다.',
    description_ko:
      '프롬프트로 React Native 네이티브 모바일 앱을 생성·앱스토어 제출까지 지원하는 Y Combinator 출신 빌더로, Free 플랜과 Pro($20/월, 일 100메시지) 플랜을 운영한다.',
    icon_url: null,
    website_url: 'https://a0.dev',
    docs_url: 'https://docs.a0.dev/',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 제한적 빌드 가능 (구체적 수치는 공식 페이지에서 직접 확인하지 못함)',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro', price: '$20/월 (일 100메시지)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 68,
    difficulty_level: 'beginner',
    tags: ['a0dev', 'mobile', 'ios', 'android', 'app-store', 'google-play', 'vibe-coding', 'app-builder', 'yc', 'a0.dev', '모바일앱', '바이브코딩'],
    alternatives: ['rork'],
    compatibility: {
      framework: ['react-native', 'expo'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 2,
    monthly_cost_estimate: { starter: '$0', growth: '$20', enterprise: '미정' },
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
      '명세서 기반 협업 개발 워크스페이스(Docs·Canvas·Issues·Chat)로, 사명이 \'Tempo Labs\'에서 \'Tempo\'로 축약되었으며 Free(월 30크레딧)·Pro($30/월, 150크레딧)·Agent+($4,500/월, 사람 검수 포함) 요금제로 운영된다.',
    description_ko:
      '명세서 기반 협업 개발 워크스페이스(Docs·Canvas·Issues·Chat)로, 사명이 \'Tempo Labs\'에서 \'Tempo\'로 축약되었으며 Free(월 30크레딧)·Pro($30/월, 150크레딧)·Agent+($4,500/월, 사람 검수 포함) 요금제로 운영된다.',
    icon_url: null,
    website_url: 'https://tempo.new',
    docs_url: 'https://docs.tempo.new',
    pricing_info: {
      free_tier: true,
      free_tier_details: '월 30크레딧(일 최대 5개), 신용카드 불필요, 기본 프로토타입 제작 가능',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro', price: '$30/월 (150크레딧)' },
        { name: 'Agent+', price: '$4,500/월 (사람 디자인 리뷰·코드 감사 포함)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 65,
    difficulty_level: 'beginner',
    tags: ['tempo', 'tempo-labs', 'react', 'vibe-coding', 'app-builder', 'multi-agent', 'ui-generation', '템포', 'React빌더', '바이브코딩'],
    alternatives: ['v0', 'lovable', 'bolt-new'],
    compatibility: {
      framework: ['react', 'next'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 3,
    monthly_cost_estimate: { starter: '$0', growth: '$30', enterprise: '$4,500' },
  },

  // -----------------------------------------------------------------------
  // 2026-07 신규 등록: 바이브코딩·AI 생태계 20종
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.zed,
    name: 'Zed',
    slug: 'zed',
    category: 'ai',
    description:
      'Zed는 Rust 기반의 고성능 코드 에디터로, 편집 예측(edit prediction)과 다양한 LLM 제공사를 연결한 AI 에이전트 채팅 기능을 제공합니다. Personal 플랜은 완전 무료로 시작할 수 있습니다.',
    description_ko:
      'Zed는 Rust 기반의 고성능 코드 에디터로, 편집 예측(edit prediction)과 다양한 LLM 제공사를 연결한 AI 에이전트 채팅 기능을 제공합니다. Personal 플랜은 완전 무료로 시작할 수 있습니다.',
    icon_url: null,
    website_url: 'https://zed.dev',
    docs_url: 'https://zed.dev/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Personal 플랜 무료 — 월 2,000회 편집 예측 포함, 자체 API 키/외부 에이전트 연결 가능',
      plans: [
        { name: 'Personal', price: '$0/월' },
        { name: 'Pro', price: '$10/월' },
        { name: 'Business', price: '$30/좌석/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        optional: true,
        description: 'OpenAI API 키 (선택, 자체 키 사용 시)',
        description_ko: 'OpenAI API 키 (선택, 자체 키 사용 시)',
      },
      {
        name: 'ANTHROPIC_API_KEY',
        public: false,
        optional: true,
        description: 'Anthropic API 키 (선택, 자체 키 사용 시)',
        description_ko: 'Anthropic API 키 (선택, 자체 키 사용 시)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 78,
    difficulty_level: 'beginner',
    tags: ['zed', 'editor', 'ai-ide', 'code-editor', 'rust', '제드', '코드에디터', '바이브코딩'],
    alternatives: ['cursor', 'windsurf', 'github-copilot'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'svelte', 'express', 'django'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0', growth: '$10-30/월', enterprise: '25석 이상 협의' },
  },

  {
    id: SERVICE_IDS_V2.kiro,
    name: 'Kiro',
    slug: 'kiro',
    category: 'ai',
    description:
      'Kiro는 AWS가 만든 에이전틱 IDE로, 자연어 스펙을 기반으로 AI가 계획(Spec)-실행(Hook)-작업(Agent)을 자동화합니다. 크레딧 기반 요금제이며 무료 플랜부터 시작할 수 있습니다.',
    description_ko:
      'Kiro는 AWS가 만든 에이전틱 IDE로, 자연어 스펙을 기반으로 AI가 계획(Spec)-실행(Hook)-작업(Agent)을 자동화합니다. 크레딧 기반 요금제이며 무료 플랜부터 시작할 수 있습니다.',
    icon_url: null,
    website_url: 'https://kiro.dev',
    docs_url: 'https://kiro.dev/docs/',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 플랜 월 50 크레딧 제공(오픈웨이트 모델·Claude Sonnet 4.5 접근 가능)',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro', price: '$20/월 (1,000 크레딧)' },
        { name: 'Pro+', price: '$40/월 (2,000 크레딧)' },
        { name: 'Pro Max', price: '$100/월 (5,000 크레딧)' },
        { name: 'Power', price: '$200/월 (10,000 크레딧)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 70,
    difficulty_level: 'beginner',
    tags: ['kiro', 'aws', 'agentic-ide', 'spec-driven', 'ai-agent', '키로', '에이전틱아이디이', '스펙기반개발'],
    alternatives: ['cursor', 'windsurf', 'devin', 'claude-code'],
    compatibility: {
      framework: ['nextjs', 'react', 'express'],
      language: ['javascript', 'typescript', 'python', 'java'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$20-100/월', enterprise: '$200/월~ (팀 플랜 별도)' },
  },

  {
    id: SERVICE_IDS_V2.google_jules,
    name: 'Google Jules',
    slug: 'google-jules',
    category: 'ai',
    description:
      'Jules는 Google의 비동기 자율 코딩 에이전트로, GitHub 저장소를 클론해 클라우드 VM에서 계획을 세우고 멀티파일 수정을 수행한 뒤 Pull Request를 생성합니다.',
    description_ko:
      'Jules는 Google의 비동기 자율 코딩 에이전트로, GitHub 저장소를 클론해 클라우드 VM에서 계획을 세우고 멀티파일 수정을 수행한 뒤 Pull Request를 생성합니다.',
    icon_url: null,
    website_url: 'https://jules.google',
    docs_url: 'https://jules.google/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 플랜 일일 15개 작업, 동시 3개 작업 가능',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Google AI Pro', price: '$19.99/월 (5배 한도)' },
        { name: 'Google AI Ultra', price: '$124.99/월 (20배 한도)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 75,
    difficulty_level: 'beginner',
    tags: ['jules', 'google', 'async-agent', 'github', 'coding-agent', '줄스', '비동기에이전트', '코딩에이전트'],
    alternatives: ['devin', 'claude-code', 'openai-codex'],
    compatibility: {
      framework: ['nextjs', 'react', 'express'],
      language: ['javascript', 'typescript', 'python', 'java'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0', growth: '$19.99/월', enterprise: '$124.99/월' },
  },

  {
    id: SERVICE_IDS_V2.trae,
    name: 'Trae',
    slug: 'trae',
    category: 'ai',
    description:
      'Trae는 ByteDance의 VS Code 기반 AI IDE로, SOLO 모드를 통해 자연어만으로 전체 프로젝트를 스캐폴딩할 수 있으며 무료 플랜도 상당한 사용량을 제공합니다.',
    description_ko:
      'Trae는 ByteDance의 VS Code 기반 AI IDE로, SOLO 모드를 통해 자연어만으로 전체 프로젝트를 스캐폴딩할 수 있으며 무료 플랜도 상당한 사용량을 제공합니다.',
    icon_url: null,
    website_url: 'https://www.trae.ai',
    docs_url: 'https://docs.trae.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 플랜 월 5,000회 자동완성 + 동시 클라우드 작업 2개',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Lite', price: '$3/월' },
        { name: 'Pro', price: '$10/월' },
        { name: 'Pro+', price: '$30/월' },
        { name: 'Ultra', price: '$100/월' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 65,
    difficulty_level: 'beginner',
    tags: ['trae', 'bytedance', 'ai-ide', 'solo-mode', 'free', '트레이', '바이트댄스', '무료아이디이'],
    alternatives: ['cursor', 'windsurf', 'cline'],
    compatibility: {
      framework: ['nextjs', 'react', 'express'],
      language: ['javascript', 'typescript', 'python'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 5,
    monthly_cost_estimate: { starter: '$0-3', growth: '$10-30/월', enterprise: '$100/월' },
  },

  {
    id: SERVICE_IDS_V2.warp,
    name: 'Warp',
    slug: 'warp',
    category: 'ai',
    description: 'Warp는 AI 에이전트가 내장된 차세대 터미널로, 자연어로 명령어를 생성·실행하고 여러 에이전트를 병렬로 구동해 코드 작업을 자동화할 수 있습니다.',
    description_ko: 'Warp는 AI 에이전트가 내장된 차세대 터미널로, 자연어로 명령어를 생성·실행하고 여러 에이전트를 병렬로 구동해 코드 작업을 자동화할 수 있습니다.',
    icon_url: null,
    website_url: 'https://www.warp.dev',
    docs_url: 'https://docs.warp.dev',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 플랜에 기본 터미널 기능 및 제한된 클라우드 에이전트 접근 포함',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Build', price: '$20/월' },
        { name: 'Max', price: '$200/월' },
        { name: 'Business', price: '$50/사용자/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        optional: true,
        description: 'OpenAI API 키 (선택)',
        description_ko: 'OpenAI API 키 (선택)',
      },
      {
        name: 'ANTHROPIC_API_KEY',
        public: false,
        optional: true,
        description: 'Anthropic API 키 (선택)',
        description_ko: 'Anthropic API 키 (선택)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 68,
    difficulty_level: 'intermediate',
    tags: ['warp', 'terminal', 'ai-agent', 'cli', '워프', '터미널', '에이전트'],
    alternatives: ['cursor', 'claude-code'],
    compatibility: {
      framework: ['nextjs', 'express', 'django'],
      language: ['javascript', 'typescript', 'python', 'go', 'rust'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$20/월', enterprise: '$50/사용자/월~' },
  },

  {
    id: SERVICE_IDS_V2.aider,
    name: 'Aider',
    slug: 'aider',
    category: 'ai',
    description:
      'Aider는 터미널에서 동작하는 오픈소스 AI 페어 프로그래밍 도구로, Git 저장소 전체를 이해하고 변경사항을 자동 커밋까지 수행합니다. 도구 자체는 무료이며 연결한 LLM 제공사 비용만 발생합니다.',
    description_ko:
      'Aider는 터미널에서 동작하는 오픈소스 AI 페어 프로그래밍 도구로, Git 저장소 전체를 이해하고 변경사항을 자동 커밋까지 수행합니다. 도구 자체는 무료이며 연결한 LLM 제공사 비용만 발생합니다.',
    icon_url: null,
    website_url: 'https://aider.chat',
    docs_url: 'https://aider.chat/docs/',
    pricing_info: {
      free_tier: true,
      free_tier_details: '도구 자체 완전 무료(오픈소스), 연결한 LLM 제공사 API 비용만 별도 발생',
      plans: [
        { name: 'Open Source', price: '$0' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        optional: true,
        description: 'OpenAI API 키 (선택)',
        description_ko: 'OpenAI API 키 (선택)',
      },
      {
        name: 'ANTHROPIC_API_KEY',
        public: false,
        optional: true,
        description: 'Anthropic API 키 (선택)',
        description_ko: 'Anthropic API 키 (선택)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 72,
    difficulty_level: 'intermediate',
    tags: ['aider', 'open-source', 'cli', 'pair-programming', 'terminal', '에이더', '오픈소스', '페어프로그래밍'],
    alternatives: ['cline', 'continue-dev'],
    compatibility: {
      framework: ['nextjs', 'express', 'django', 'flask'],
      language: ['python', 'javascript', 'typescript', 'php'],
    },
    official_sdks: {
      pip: 'https://pypi.org/project/aider-chat/',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0 + LLM 종량과금', growth: '사용량에 따라 변동', enterprise: '해당 없음(셀프호스팅)' },
  },

  {
    id: SERVICE_IDS_V2.openai_codex,
    name: 'OpenAI Codex',
    slug: 'openai-codex',
    category: 'ai',
    description:
      'OpenAI Codex는 ChatGPT에 내장된 클라우드/CLI/IDE 코딩 에이전트로, 목표나 작업을 주면 컨텍스트를 수집하고 여러 파일을 수정한 뒤 결과물을 제시합니다. ChatGPT 구독 등급에 포함되어 제공됩니다.',
    description_ko:
      'OpenAI Codex는 ChatGPT에 내장된 클라우드/CLI/IDE 코딩 에이전트로, 목표나 작업을 주면 컨텍스트를 수집하고 여러 파일을 수정한 뒤 결과물을 제시합니다. ChatGPT 구독 등급에 포함되어 제공됩니다.',
    icon_url: null,
    website_url: 'https://openai.com/codex/',
    docs_url: 'https://developers.openai.com/codex/',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'ChatGPT Free 플랜에 제한된 사용량 포함, 본격 사용은 유료 구독 필요',
      plans: [
        { name: 'Go', price: '$8/월' },
        { name: 'Plus', price: '$20/월' },
        { name: 'Pro', price: '$100-200/월' },
        { name: 'Business', price: '$20-25/사용자/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        optional: true,
        description: 'OpenAI API 키 (CLI/프로그래매틱 사용 시)',
        description_ko: 'OpenAI API 키 (CLI/프로그래매틱 사용 시)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'code_assistant',
    popularity_score: 85,
    difficulty_level: 'beginner',
    tags: ['codex', 'openai', 'coding-agent', 'cli', 'chatgpt', '코덱스', '코딩에이전트', '자율에이전트'],
    alternatives: ['claude-code', 'cursor', 'github-copilot', 'google-jules'],
    compatibility: {
      framework: ['nextjs', 'react', 'express'],
      language: ['javascript', 'typescript', 'python'],
    },
    official_sdks: {},
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'high',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0-8', growth: '$20-100/월', enterprise: '협의' },
  },

  {
    id: SERVICE_IDS_V2.cerebras,
    name: 'Cerebras Inference',
    slug: 'cerebras',
    category: 'ai',
    description:
      'Cerebras Inference는 자체 개발한 웨이퍼 스케일 엔진(WSE)으로 Llama, Qwen 등 오픈 모델을 매우 빠른 속도로 서빙하는 추론 API입니다. 토큰당 과금이며 무료 크레딧으로 시작할 수 있습니다.',
    description_ko:
      'Cerebras Inference는 자체 개발한 웨이퍼 스케일 엔진(WSE)으로 Llama, Qwen 등 오픈 모델을 매우 빠른 속도로 서빙하는 추론 API입니다. 토큰당 과금이며 무료 크레딧으로 시작할 수 있습니다.',
    icon_url: null,
    website_url: 'https://www.cerebras.ai',
    docs_url: 'https://inference-docs.cerebras.ai/introduction',
    pricing_info: {
      free_tier: true,
      free_tier_details: '가입 시 $5 무료 크레딧 제공, Free 티어는 낮은 rate limit로 이용 가능',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pay-as-you-go', price: '$0.50-1.50/백만 토큰' },
        { name: 'Code Pro', price: '$50/월' },
        { name: 'Code Max', price: '$200/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'CEREBRAS_API_KEY',
        public: false,
        description: 'Cerebras Cloud API 키',
        description_ko: 'Cerebras Cloud API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'llm-inference',
    popularity_score: 65,
    difficulty_level: 'intermediate',
    tags: ['cerebras', 'llm-inference', 'fast-inference', 'open-models', '세레브라스', '고속추론', '추론API'],
    alternatives: ['groq', 'together-ai', 'fireworks-ai'],
    compatibility: {
      framework: ['nextjs', 'express'],
      language: ['python', 'javascript', 'typescript'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/@cerebras/cerebras_cloud_sdk',
      pip: 'https://pypi.org/project/cerebras_cloud_sdk/',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0-5', growth: '$50-200/월', enterprise: '협의(고정 월정액)' },
  },

  {
    id: SERVICE_IDS_V2.sambanova,
    name: 'SambaNova Cloud',
    slug: 'sambanova',
    category: 'ai',
    description:
      'SambaNova Cloud는 자체 RDU(재구성 가능 데이터플로우 유닛) 하드웨어로 Llama, DeepSeek 등 오픈 모델을 토큰당 매우 저렴하게 제공하는 추론 API입니다.',
    description_ko:
      'SambaNova Cloud는 자체 RDU(재구성 가능 데이터플로우 유닛) 하드웨어로 Llama, DeepSeek 등 오픈 모델을 토큰당 매우 저렴하게 제공하는 추론 API입니다.',
    icon_url: null,
    website_url: 'https://cloud.sambanova.ai',
    docs_url: 'https://docs.sambanova.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: '신규 가입 시 3개월 유효 $5 크레딧 제공, Developer 무료 티어 존재',
      plans: [
        { name: 'Free/Developer', price: '$0' },
        { name: 'Pay-as-you-go', price: '모델별 백만 토큰당 $0.10~' },
      ],
    },
    required_env_vars: [
      {
        name: 'SAMBANOVA_API_KEY',
        public: false,
        description: 'SambaNova Cloud API 키',
        description_ko: 'SambaNova Cloud API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'llm-inference',
    popularity_score: 58,
    difficulty_level: 'intermediate',
    tags: ['sambanova', 'llm-inference', 'rdu', 'open-models', '삼바노바', '추론API', '오픈모델'],
    alternatives: ['groq', 'together-ai', 'cerebras'],
    compatibility: {
      framework: ['nextjs', 'express'],
      language: ['python', 'javascript', 'typescript'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0-5', growth: '사용량 기반', enterprise: '협의' },
  },

  {
    id: SERVICE_IDS_V2.vercel_ai_sdk,
    name: 'Vercel AI SDK',
    slug: 'vercel-ai-sdk',
    category: 'ai',
    description:
      'Vercel AI SDK(`ai` 패키지)는 TypeScript 기반의 무료 오픈소스 라이브러리로, 다양한 LLM 제공사를 통일된 API로 연결하고 스트리밍 UI·함수 호출 등을 손쉽게 구현할 수 있게 해줍니다.',
    description_ko:
      'Vercel AI SDK(`ai` 패키지)는 TypeScript 기반의 무료 오픈소스 라이브러리로, 다양한 LLM 제공사를 통일된 API로 연결하고 스트리밍 UI·함수 호출 등을 손쉽게 구현할 수 있게 해줍니다.',
    icon_url: null,
    website_url: 'https://ai-sdk.dev',
    docs_url: 'https://ai-sdk.dev/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '라이브러리 자체는 완전 무료 오픈소스, 연결한 모델 제공사 비용만 별도 발생',
      plans: [
        { name: 'Open Source', price: '$0' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        optional: true,
        description: 'OpenAI API 키 (선택)',
        description_ko: 'OpenAI API 키 (선택)',
      },
      {
        name: 'ANTHROPIC_API_KEY',
        public: false,
        optional: true,
        description: 'Anthropic API 키 (선택)',
        description_ko: 'Anthropic API 키 (선택)',
      },
      {
        name: 'GOOGLE_GENERATIVE_AI_API_KEY',
        public: false,
        optional: true,
        description: 'Google Gemini API 키 (선택)',
        description_ko: 'Google Gemini API 키 (선택)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'ai_framework',
    popularity_score: 88,
    difficulty_level: 'intermediate',
    tags: ['vercel-ai-sdk', 'typescript', 'llm', 'streaming', 'open-source', '버셀에이아이에스디케이', '스트리밍', '오픈소스'],
    alternatives: ['langchain'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'svelte', 'nuxt'],
      language: ['typescript', 'javascript'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/ai',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '모델 비용에 따라 변동', enterprise: '해당 없음' },
  },

  {
    id: SERVICE_IDS_V2.langgraph,
    name: 'LangGraph',
    slug: 'langgraph',
    category: 'ai',
    description:
      'LangGraph는 LangChain 팀이 만든 상태 기반(Stateful) 에이전트 오케스트레이션 프레임워크로, MIT 라이선스 오픈소스 라이브러리와 별도 과금되는 호스팅 배포 플랫폼(LangGraph Platform)을 함께 제공합니다.',
    description_ko:
      'LangGraph는 LangChain 팀이 만든 상태 기반(Stateful) 에이전트 오케스트레이션 프레임워크로, MIT 라이선스 오픈소스 라이브러리와 별도 과금되는 호스팅 배포 플랫폼(LangGraph Platform)을 함께 제공합니다.',
    icon_url: null,
    website_url: 'https://www.langchain.com/langgraph',
    docs_url: 'https://docs.langchain.com/oss/python/langgraph/overview',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 라이브러리 무료, Developer 플랜은 월 10만 노드 실행 무료 포함',
      plans: [
        { name: 'Developer', price: '$0' },
        { name: 'Plus', price: '$39/월~' },
        { name: 'Enterprise', price: '협의' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        optional: true,
        description: 'OpenAI API 키 (선택)',
        description_ko: 'OpenAI API 키 (선택)',
      },
      {
        name: 'ANTHROPIC_API_KEY',
        public: false,
        optional: true,
        description: 'Anthropic API 키 (선택)',
        description_ko: 'Anthropic API 키 (선택)',
      },
      {
        name: 'LANGCHAIN_API_KEY',
        public: false,
        optional: true,
        description: 'LangGraph Platform/LangSmith 연동 시 필요',
        description_ko: 'LangGraph Platform/LangSmith 연동 시 필요',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'ai_agent',
    popularity_score: 80,
    difficulty_level: 'advanced',
    tags: ['langgraph', 'agent-orchestration', 'stateful-agent', 'langchain', '랭그래프', '에이전트오케스트레이션', '멀티에이전트'],
    alternatives: ['langchain', 'crewai', 'dify', 'mastra'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastify'],
      language: ['python', 'javascript', 'typescript'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/@langchain/langgraph',
      pip: 'https://pypi.org/project/langgraph/',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 20,
    monthly_cost_estimate: { starter: '$0', growth: '$39/월~', enterprise: '협의' },
  },

  {
    id: SERVICE_IDS_V2.llamaindex,
    name: 'LlamaIndex',
    slug: 'llamaindex',
    category: 'ai',
    description:
      'LlamaIndex는 RAG 파이프라인을 위한 오픈소스 데이터 프레임워크로, 무료로 시작할 수 있으며 LlamaParse 같은 문서 파싱 클라우드 서비스는 크레딧 기반으로 과금됩니다.',
    description_ko:
      'LlamaIndex는 RAG 파이프라인을 위한 오픈소스 데이터 프레임워크로, 무료로 시작할 수 있으며 LlamaParse 같은 문서 파싱 클라우드 서비스는 크레딧 기반으로 과금됩니다.',
    icon_url: null,
    website_url: 'https://www.llamaindex.ai',
    docs_url: 'https://docs.llamaindex.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 프레임워크 무료, LlamaCloud/LlamaParse는 월 10,000크레딧 무료 제공',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Starter', price: '$50/월' },
        { name: 'Pro', price: '$500/월' },
        { name: 'Enterprise', price: '협의' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        optional: true,
        description: 'OpenAI API 키 (선택)',
        description_ko: 'OpenAI API 키 (선택)',
      },
      {
        name: 'LLAMA_CLOUD_API_KEY',
        public: false,
        optional: true,
        description: 'LlamaCloud/LlamaParse 사용 시 필요',
        description_ko: 'LlamaCloud/LlamaParse 사용 시 필요',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'ai_framework',
    popularity_score: 78,
    difficulty_level: 'advanced',
    tags: ['llamaindex', 'rag', 'document-parsing', 'vector-search', '라마인덱스', '문서파싱', 'RAG프레임워크'],
    alternatives: ['langchain', 'pinecone'],
    compatibility: {
      framework: ['nextjs', 'express'],
      language: ['python', 'javascript', 'typescript'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/llamaindex',
      pip: 'https://pypi.org/project/llama-index/',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 20,
    monthly_cost_estimate: { starter: '$0', growth: '$50-500/월', enterprise: '협의' },
  },

  {
    id: SERVICE_IDS_V2.mastra,
    name: 'Mastra',
    slug: 'mastra',
    category: 'ai',
    description:
      'Mastra는 TypeScript로 에이전트, 워크플로우, 메모리, 평가를 구축하는 오픈소스 프레임워크로, React/Next.js/Node와 통합되며 관측성이 포함된 호스팅 플랫폼도 제공합니다.',
    description_ko:
      'Mastra는 TypeScript로 에이전트, 워크플로우, 메모리, 평가를 구축하는 오픈소스 프레임워크로, React/Next.js/Node와 통합되며 관측성이 포함된 호스팅 플랫폼도 제공합니다.',
    icon_url: null,
    website_url: 'https://mastra.ai',
    docs_url: 'https://mastra.ai/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 프레임워크 무료, Starter Platform은 월 10만 관측 이벤트·24 CPU시간 무료 포함',
      plans: [
        { name: 'Starter Platform', price: '$0' },
        { name: 'Teams Platform', price: '$250/월' },
        { name: 'Enterprise', price: '협의' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        optional: true,
        description: 'OpenAI API 키 (선택)',
        description_ko: 'OpenAI API 키 (선택)',
      },
      {
        name: 'ANTHROPIC_API_KEY',
        public: false,
        optional: true,
        description: 'Anthropic API 키 (선택)',
        description_ko: 'Anthropic API 키 (선택)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'ai_agent',
    popularity_score: 66,
    difficulty_level: 'intermediate',
    tags: ['mastra', 'typescript', 'ai-agent', 'workflow', 'nextjs', '마스트라', '타입스크립트에이전트', '워크플로우'],
    alternatives: ['langgraph', 'vercel-ai-sdk', 'crewai'],
    compatibility: {
      framework: ['nextjs', 'react', 'express'],
      language: ['typescript', 'javascript'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/mastra',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0', growth: '$250/월', enterprise: '협의' },
  },

  {
    id: SERVICE_IDS_V2.composio,
    name: 'Composio',
    slug: 'composio',
    category: 'ai',
    description:
      'Composio는 AI 에이전트와 LLM이 다양한 SaaS·API 도구(250개 이상)에 안전하게 인증하고 연결하도록 지원하는 통합 플랫폼으로, 관리형 OAuth와 툴 호출 로그를 제공합니다.',
    description_ko:
      'Composio는 AI 에이전트와 LLM이 다양한 SaaS·API 도구(250개 이상)에 안전하게 인증하고 연결하도록 지원하는 통합 플랫폼으로, 관리형 OAuth와 툴 호출 로그를 제공합니다.',
    icon_url: null,
    website_url: 'https://composio.dev',
    docs_url: 'https://docs.composio.dev',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 플랜 월 20,000 tool calls 포함',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Starter', price: '$29/월' },
        { name: 'Growth', price: '$229/월' },
        { name: 'Enterprise', price: '협의' },
      ],
    },
    required_env_vars: [
      {
        name: 'COMPOSIO_API_KEY',
        public: false,
        description: 'Composio API 키',
        description_ko: 'Composio API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'ai_agent',
    popularity_score: 62,
    difficulty_level: 'intermediate',
    tags: ['composio', 'tool-integration', 'ai-agent', 'oauth', 'mcp', '컴포지오', '툴통합', '에이전트연동'],
    alternatives: ['n8n'],
    compatibility: {
      framework: ['nextjs', 'express'],
      language: ['python', 'javascript', 'typescript'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/composio-core',
      pip: 'https://pypi.org/project/composio-core/',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0', growth: '$29-229/월', enterprise: '협의' },
  },

  {
    id: SERVICE_IDS_V2.same_new,
    name: 'Same.new',
    slug: 'same-new',
    category: 'ai',
    description: 'Same.new는 URL이나 디자인을 입력하면 유사한 웹사이트를 코드로 재현해주는 AI 앱빌더로, 토큰 기반 요금제이며 무료 플랜으로도 체험이 가능합니다.',
    description_ko: 'Same.new는 URL이나 디자인을 입력하면 유사한 웹사이트를 코드로 재현해주는 AI 앱빌더로, 토큰 기반 요금제이며 무료 플랜으로도 체험이 가능합니다.',
    icon_url: null,
    website_url: 'https://same.new',
    docs_url: 'https://docs.same.new',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 플랜 월 50만 토큰 제공',
      plans: [
        { name: 'Basic', price: '$10/월 (200만 토큰)' },
        { name: 'Pro', price: '$25/월 (500만 토큰)' },
        { name: 'Max', price: '$50/월 (1,000만 토큰)' },
        { name: 'Ultra', price: '$100/월 (2,000만 토큰)' },
      ],
    },
    required_env_vars: [],
    domain: 'ai_ml',
    subcategory: 'vibe_coding',
    popularity_score: 55,
    difficulty_level: 'beginner',
    tags: ['same-new', 'website-clone', 'ai-app-builder', 'vibe-coding', '세임뉴', '웹사이트복제', 'AI앱빌더'],
    alternatives: ['bolt-new', 'v0', 'lovable'],
    compatibility: {
      framework: ['react', 'nextjs'],
      language: ['javascript', 'typescript'],
    },
    official_sdks: {},
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$10-50/월', enterprise: '$100/월' },
  },

  {
    id: SERVICE_IDS_V2.zilliz_cloud,
    name: 'Zilliz Cloud',
    slug: 'zilliz-cloud',
    category: 'ai',
    description:
      'Zilliz Cloud는 오픈소스 벡터DB Milvus를 기반으로 한 완전관리형 클라우드 서비스로, 서버리스·전용 인스턴스 요금제를 제공하며 대규모 임베딩 검색에 최적화되어 있습니다.',
    description_ko:
      'Zilliz Cloud는 오픈소스 벡터DB Milvus를 기반으로 한 완전관리형 클라우드 서비스로, 서버리스·전용 인스턴스 요금제를 제공하며 대규모 임베딩 검색에 최적화되어 있습니다.',
    icon_url: null,
    website_url: 'https://zilliz.com/cloud',
    docs_url: 'https://docs.zilliz.com',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 티어로 학습·개인 프로젝트 시작 가능, 서버리스는 vCU당 종량 과금',
      plans: [
        { name: 'Serverless', price: '$4/백만 vCU' },
        { name: 'Dedicated', price: '$99/월~' },
        { name: 'Enterprise', price: '협의' },
      ],
    },
    required_env_vars: [
      {
        name: 'ZILLIZ_CLOUD_URI',
        public: false,
        description: 'Zilliz Cloud 클러스터 엔드포인트',
        description_ko: 'Zilliz Cloud 클러스터 엔드포인트',
      },
      {
        name: 'ZILLIZ_CLOUD_TOKEN',
        public: false,
        description: 'Zilliz Cloud API 토큰',
        description_ko: 'Zilliz Cloud API 토큰',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'vector_db',
    popularity_score: 64,
    difficulty_level: 'intermediate',
    tags: ['zilliz', 'milvus', 'vector-db', 'rag', 'embedding', '질리즈', '벡터DB', '임베딩검색'],
    alternatives: ['pinecone', 'weaviate', 'qdrant', 'turbopuffer'],
    compatibility: {
      framework: ['nextjs', 'express'],
      language: ['python', 'javascript', 'typescript'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/@zilliz/milvus2-sdk-node',
      pip: 'https://pypi.org/project/pymilvus/',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0', growth: '$99-500/월', enterprise: '협의' },
  },

  {
    id: SERVICE_IDS_V2.langfuse,
    name: 'Langfuse',
    slug: 'langfuse',
    category: 'monitoring',
    description:
      'Langfuse는 LLM 애플리케이션의 트레이싱·평가·프롬프트 관리·비용 분석을 제공하는 오픈소스 AI 엔지니어링 플랫폼으로, OpenAI SDK·LangChain·LiteLLM 등과 즉시 연동됩니다.',
    description_ko:
      'Langfuse는 LLM 애플리케이션의 트레이싱·평가·프롬프트 관리·비용 분석을 제공하는 오픈소스 AI 엔지니어링 플랫폼으로, OpenAI SDK·LangChain·LiteLLM 등과 즉시 연동됩니다.',
    icon_url: null,
    website_url: 'https://langfuse.com',
    docs_url: 'https://langfuse.com/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: '무료 티어 월 5만 유닛 제공, 카드 등록 불필요',
      plans: [
        { name: 'Free', price: '$0' },
        { name: 'Pro', price: '사용량 기반($8/10만 유닛)' },
        { name: 'Enterprise', price: '협의' },
      ],
    },
    required_env_vars: [
      {
        name: 'LANGFUSE_PUBLIC_KEY',
        public: true,
        description: 'Langfuse 퍼블릭 키',
        description_ko: 'Langfuse 퍼블릭 키',
      },
      {
        name: 'LANGFUSE_SECRET_KEY',
        public: false,
        description: 'Langfuse 시크릿 키',
        description_ko: 'Langfuse 시크릿 키',
      },
    ],
    domain: 'observability',
    subcategory: 'mlops',
    popularity_score: 74,
    difficulty_level: 'intermediate',
    tags: ['langfuse', 'llm-observability', 'tracing', 'open-source', 'prompt-management', '랑퓨즈', 'LLM관측', '트레이싱'],
    alternatives: ['helicone', 'langsmith'],
    compatibility: {
      framework: ['nextjs', 'express'],
      language: ['python', 'javascript', 'typescript'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/langfuse',
      pip: 'https://pypi.org/project/langfuse/',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 15,
    monthly_cost_estimate: { starter: '$0', growth: '$50-300/월', enterprise: '협의' },
  },

  {
    id: SERVICE_IDS_V2.helicone,
    name: 'Helicone',
    slug: 'helicone',
    category: 'monitoring',
    description:
      'Helicone은 AI 게이트웨이와 LLM 관측을 함께 제공하는 오픈소스 플랫폼으로, 요청을 자동으로 로깅·캐싱하고 여러 제공사 중 가장 저렴한 경로로 라우팅합니다.',
    description_ko:
      'Helicone은 AI 게이트웨이와 LLM 관측을 함께 제공하는 오픈소스 플랫폼으로, 요청을 자동으로 로깅·캐싱하고 여러 제공사 중 가장 저렴한 경로로 라우팅합니다.',
    icon_url: null,
    website_url: 'https://www.helicone.ai',
    docs_url: 'https://docs.helicone.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Hobby 플랜 무료 제공',
      plans: [
        { name: 'Hobby', price: '$0' },
        { name: 'Pro', price: '$79/월' },
        { name: 'Team', price: '$799/월' },
        { name: 'Enterprise', price: '협의' },
      ],
    },
    required_env_vars: [
      {
        name: 'HELICONE_API_KEY',
        public: false,
        description: 'Helicone API 키',
        description_ko: 'Helicone API 키',
      },
    ],
    domain: 'observability',
    subcategory: 'mlops',
    popularity_score: 66,
    difficulty_level: 'beginner',
    tags: ['helicone', 'ai-gateway', 'llm-observability', 'caching', 'routing', '헬리콘', 'AI게이트웨이', 'LLM관측'],
    alternatives: ['langfuse', 'portkey'],
    compatibility: {
      framework: ['nextjs', 'express'],
      language: ['python', 'javascript', 'typescript'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/@helicone/helicone',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$79/월', enterprise: '$799/월~' },
  },

  {
    id: SERVICE_IDS_V2.portkey,
    name: 'Portkey',
    slug: 'portkey',
    category: 'ai',
    description:
      'Portkey는 1,600개 이상의 LLM을 하나의 통합 API로 라우팅하는 AI 게이트웨이로, 자동 폴백·가드레일·비용 추적 기능을 제공하며 오픈소스 게이트웨이도 별도로 공개하고 있습니다.',
    description_ko:
      'Portkey는 1,600개 이상의 LLM을 하나의 통합 API로 라우팅하는 AI 게이트웨이로, 자동 폴백·가드레일·비용 추적 기능을 제공하며 오픈소스 게이트웨이도 별도로 공개하고 있습니다.',
    icon_url: null,
    website_url: 'https://portkey.ai',
    docs_url: 'https://portkey.ai/docs',
    pricing_info: {
      free_tier: true,
      free_tier_details: 'Developer 플랜 무료(월 1만 로그, 3일 보관)',
      plans: [
        { name: 'Open Source', price: '$0' },
        { name: 'Developer', price: '$0' },
        { name: 'Production', price: '$49/월' },
        { name: 'Enterprise', price: '협의' },
      ],
    },
    required_env_vars: [
      {
        name: 'PORTKEY_API_KEY',
        public: false,
        description: 'Portkey API 키',
        description_ko: 'Portkey API 키',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'llm_router',
    popularity_score: 64,
    difficulty_level: 'intermediate',
    tags: ['portkey', 'ai-gateway', 'llm-routing', 'fallback', 'guardrails', '포트키', 'AI게이트웨이', '라우팅'],
    alternatives: ['litellm', 'helicone'],
    compatibility: {
      framework: ['nextjs', 'express'],
      language: ['python', 'javascript', 'typescript'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/portkey-ai',
      pip: 'https://pypi.org/project/portkey-ai/',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 10,
    monthly_cost_estimate: { starter: '$0', growth: '$49/월', enterprise: '협의' },
  },

  {
    id: SERVICE_IDS_V2.litellm,
    name: 'LiteLLM',
    slug: 'litellm',
    category: 'ai',
    description:
      'LiteLLM은 OpenAI 형식의 API 하나로 Anthropic, Gemini, Bedrock 등 100개 이상의 LLM 제공사를 호출할 수 있게 해주는 오픈소스 프록시/SDK로, 제공사 요금에 마크업 없이 그대로 과금됩니다.',
    description_ko:
      'LiteLLM은 OpenAI 형식의 API 하나로 Anthropic, Gemini, Bedrock 등 100개 이상의 LLM 제공사를 호출할 수 있게 해주는 오픈소스 프록시/SDK로, 제공사 요금에 마크업 없이 그대로 과금됩니다.',
    icon_url: null,
    website_url: 'https://www.litellm.ai',
    docs_url: 'https://docs.litellm.ai',
    pricing_info: {
      free_tier: true,
      free_tier_details: '오픈소스 프록시 완전 무료(셀프호스팅), 인프라 비용만 별도 발생',
      plans: [
        { name: 'Open Source', price: '$0' },
        { name: 'Enterprise', price: '$250/월~' },
      ],
    },
    required_env_vars: [
      {
        name: 'OPENAI_API_KEY',
        public: false,
        optional: true,
        description: 'OpenAI API 키 (선택)',
        description_ko: 'OpenAI API 키 (선택)',
      },
      {
        name: 'ANTHROPIC_API_KEY',
        public: false,
        optional: true,
        description: 'Anthropic API 키 (선택)',
        description_ko: 'Anthropic API 키 (선택)',
      },
    ],
    domain: 'ai_ml',
    subcategory: 'llm_router',
    popularity_score: 76,
    difficulty_level: 'advanced',
    tags: ['litellm', 'llm-proxy', 'gateway', 'open-source', 'multi-provider', '라이트엘엘엠', '프록시', '오픈소스게이트웨이'],
    alternatives: ['portkey', 'openrouter'],
    compatibility: {
      framework: ['nextjs', 'express'],
      language: ['python', 'javascript', 'typescript'],
    },
    official_sdks: {
      pip: 'https://pypi.org/project/litellm/',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 20,
    monthly_cost_estimate: { starter: '$0', growth: '$20-500/월(인프라)', enterprise: '$250/월~' },
  },

  // -----------------------------------------------------------------------
  // Google Drive (Workspace 파일 스토리지 + Drive API)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.google_drive,
    name: 'Google Drive',
    slug: 'google-drive',
    category: 'storage',
    description:
      'Google의 클라우드 드라이브로, Drive API를 통해 파일 업로드·조회·공유 권한 관리를 앱에서 처리할 수 있습니다. API 호출 자체는 무료이며 비용은 저장 용량(개인 Google One / 조직 Workspace)에서 발생합니다.',
    description_ko:
      'Google의 클라우드 드라이브로, Drive API를 통해 파일 업로드·조회·공유 권한 관리를 앱에서 처리할 수 있습니다. API 호출 자체는 무료이며 비용은 저장 용량(개인 Google One / 조직 Workspace)에서 발생합니다. 2026년 5월부터 신규 프로젝트는 요청 수 대신 쿼터 유닛 풀(프로젝트 100만 유닛/분, 사용자 32.5만 유닛/분) 방식으로 전환되었습니다.',
    icon_url: null,
    website_url: 'https://workspace.google.com/products/drive/',
    docs_url: 'https://developers.google.com/workspace/drive/api/guides/about-sdk',
    pricing_info: {
      free_tier: true,
      free_tier_details:
        'Drive API 사용은 전액 무료(쿼터 초과 시에도 추가 과금 없음). 개인 Google 계정은 Gmail·Photos 합산 15GB 무료.',
      plans: [
        { name: '개인 무료', price: '$0 (15GB 공유 용량)' },
        { name: 'Workspace Business Starter', price: '$7/사용자/월(연간 약정) — 사용자당 30GB 풀 용량' },
        { name: 'Workspace Business Standard', price: '$14/사용자/월(연간 약정) — 사용자당 2TB 풀 용량' },
      ],
    },
    required_env_vars: [
      {
        name: 'GOOGLE_CLIENT_ID',
        public: false,
        description: 'Google Cloud Console OAuth client ID for Drive scopes',
        description_ko: 'Drive 스코프용 OAuth 클라이언트 ID (Google Cloud Console 발급)',
      },
      {
        name: 'GOOGLE_CLIENT_SECRET',
        public: false,
        description: 'Google OAuth client secret',
        description_ko: 'Google OAuth 클라이언트 시크릿',
      },
      {
        name: 'GOOGLE_SERVICE_ACCOUNT_KEY',
        public: false,
        optional: true,
        description: 'Service account JSON key for server-to-server Drive access',
        description_ko: '서버 간 Drive 접근용 서비스 계정 JSON 키 (선택)',
      },
    ],
    domain: 'backend',
    subcategory: 'cloud_drive',
    popularity_score: 90,
    difficulty_level: 'beginner',
    tags: ['storage', 'file', 'drive', 'google', 'workspace', 'oauth', 'file-sync', 'sharing', '구글 드라이브', '파일 저장', '클라우드 드라이브'],
    alternatives: ['aws-s3', 'google-cloud-storage', 'uploadthing', 'cloudinary'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'flutter', 'react-native'],
      language: ['typescript', 'javascript', 'python', 'java', 'go', 'php'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/googleapis',
      python: 'https://pypi.org/project/google-api-python-client/',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 20,
    monthly_cost_estimate: { starter: '$0(15GB 내)', growth: '$7-14/사용자/월(Workspace)', enterprise: '협의' },
  },

  // -----------------------------------------------------------------------
  // Google Sheets API
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.google_sheets_api,
    name: 'Google Sheets API',
    slug: 'google-sheets-api',
    category: 'other',
    description:
      '스프레드시트를 읽고 쓰는 REST API로, 노코드 백오피스·간이 DB·리포트 자동화에 자주 쓰입니다. 표준 사용은 무료이며 프로젝트당 읽기 300요청/분, 사용자당 60요청/분 쿼터가 적용됩니다.',
    description_ko:
      '스프레드시트를 읽고 쓰는 REST API로, 노코드 백오피스·간이 DB·리포트 자동화에 자주 쓰입니다. 표준 사용은 무료이며 프로젝트당 읽기 300요청/분, 사용자당 60요청/분 쿼터가 적용됩니다. 2026년 하반기부터 쿼터 초과분에 대한 과금이 예고되어 있습니다.',
    icon_url: null,
    website_url: 'https://developers.google.com/workspace/sheets',
    docs_url: 'https://developers.google.com/workspace/sheets/api/limits',
    pricing_info: {
      free_tier: true,
      free_tier_details:
        '표준 사용 전액 무료. 읽기 300요청/분/프로젝트, 60요청/분/사용자. 쿼터 초과 시 429 반환(현재 과금 없음).',
      plans: [{ name: 'Standard', price: '$0' }],
    },
    required_env_vars: [
      {
        name: 'GOOGLE_SERVICE_ACCOUNT_EMAIL',
        public: false,
        description: 'Service account email granted access to the spreadsheet',
        description_ko: '스프레드시트 공유 권한을 부여한 서비스 계정 이메일',
      },
      {
        name: 'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
        public: false,
        description: 'Service account private key (PEM)',
        description_ko: '서비스 계정 비공개 키 (PEM)',
      },
      {
        name: 'GOOGLE_SHEET_ID',
        public: false,
        description: 'Target spreadsheet ID from the sheet URL',
        description_ko: '대상 스프레드시트 ID (시트 URL에서 확인)',
      },
    ],
    domain: 'business',
    subcategory: 'productivity_api',
    popularity_score: 82,
    difficulty_level: 'beginner',
    tags: ['spreadsheet', 'sheets', 'google', 'workspace', 'no-code', 'backoffice', 'automation', '구글 시트', '스프레드시트', '엑셀'],
    alternatives: ['airtable', 'notion-api'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastapi'],
      language: ['typescript', 'javascript', 'python', 'go', 'java'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/googleapis',
      python: 'https://pypi.org/project/google-api-python-client/',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 20,
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '$0' },
  },

  // -----------------------------------------------------------------------
  // Google Calendar API
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.google_calendar_api,
    name: 'Google Calendar API',
    slug: 'google-calendar-api',
    category: 'other',
    description:
      '일정 조회·생성·초대·알림을 처리하는 캘린더 REST API로, 예약 시스템이나 초대장 서비스의 일정 연동에 사용됩니다. 표준 사용은 무료입니다.',
    description_ko:
      '일정 조회·생성·초대·알림을 처리하는 캘린더 REST API로, 예약 시스템이나 초대장 서비스의 일정 연동에 사용됩니다. 표준 사용은 무료이며, 2026년 5월 이후 생성된 프로젝트는 프로젝트당 10,000요청/분, 사용자당 600요청/분 쿼터와 하루 100만 요청의 과금 임계값이 적용됩니다(현재 임계값 이하 무료).',
    icon_url: null,
    website_url: 'https://developers.google.com/workspace/calendar',
    docs_url: 'https://developers.google.com/workspace/calendar/api/guides/quota',
    pricing_info: {
      free_tier: true,
      free_tier_details:
        '표준 사용 무료. 프로젝트당 10,000요청/분, 사용자당 600요청/분(2026-05-01 이후 생성 프로젝트 기준). 일 100만 요청 과금 임계값 이하 무료.',
      plans: [{ name: 'Standard', price: '$0' }],
    },
    required_env_vars: [
      {
        name: 'GOOGLE_CLIENT_ID',
        public: false,
        description: 'OAuth client ID with calendar scopes',
        description_ko: 'Calendar 스코프가 포함된 OAuth 클라이언트 ID',
      },
      {
        name: 'GOOGLE_CLIENT_SECRET',
        public: false,
        description: 'OAuth client secret',
        description_ko: 'OAuth 클라이언트 시크릿',
      },
      {
        name: 'GOOGLE_CALENDAR_ID',
        public: false,
        optional: true,
        description: 'Target calendar ID (defaults to primary)',
        description_ko: '대상 캘린더 ID (미지정 시 primary)',
      },
    ],
    domain: 'business',
    subcategory: 'productivity_api',
    popularity_score: 78,
    difficulty_level: 'beginner',
    tags: ['calendar', 'schedule', 'booking', 'google', 'workspace', 'event', 'reminder', '구글 캘린더', '일정', '예약'],
    alternatives: ['cal-com', 'nylas'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastapi'],
      language: ['typescript', 'javascript', 'python', 'go', 'java'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/googleapis',
      python: 'https://pypi.org/project/google-api-python-client/',
    },
    free_tier_quality: 'excellent',
    vendor_lock_in_risk: 'low',
    setup_time_minutes: 25,
    monthly_cost_estimate: { starter: '$0', growth: '$0', enterprise: '$0' },
  },

  // -----------------------------------------------------------------------
  // Google Cloud Storage (GCS)
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.google_cloud_storage,
    name: 'Google Cloud Storage',
    slug: 'google-cloud-storage',
    category: 'storage',
    description:
      'GCP의 오브젝트 스토리지로, Standard·Nearline·Coldline·Archive 4단 스토리지 클래스와 종량제 과금을 제공합니다. AWS S3의 GCP 대응 서비스입니다.',
    description_ko:
      'GCP의 오브젝트 스토리지로, Standard·Nearline·Coldline·Archive 4단 스토리지 클래스와 종량제 과금을 제공합니다. AWS S3의 GCP 대응 서비스이며, US 리전 Standard 기준 $0.020/GB·월(2026-07 확인)입니다. 스토리지 요금 외에 오퍼레이션·이그레스가 별도 과금되는 점에 주의해야 합니다.',
    icon_url: null,
    website_url: 'https://cloud.google.com/storage',
    docs_url: 'https://cloud.google.com/storage/pricing',
    pricing_info: {
      free_tier: true,
      free_tier_details:
        'Always Free: 미국 리전 5GB·월 저장, Class A 5,000회/월, Class B 50,000회/월, 북미 이그레스 100GB/월.',
      plans: [
        { name: 'Standard (US 리전)', price: '$0.020/GB·월' },
        { name: 'Nearline / Coldline / Archive', price: '접근 빈도가 낮을수록 저렴(대신 최소 보관기간·검색 요금 발생)' },
        { name: '인터넷 이그레스', price: '종량제(리전·목적지별 상이)' },
      ],
    },
    required_env_vars: [
      {
        name: 'GOOGLE_CLOUD_PROJECT',
        public: false,
        description: 'GCP project ID',
        description_ko: 'GCP 프로젝트 ID',
      },
      {
        name: 'GCS_BUCKET_NAME',
        public: false,
        description: 'Target Cloud Storage bucket name',
        description_ko: '대상 Cloud Storage 버킷 이름',
      },
      {
        name: 'GOOGLE_APPLICATION_CREDENTIALS',
        public: false,
        description: 'Path or JSON of the service account key',
        description_ko: '서비스 계정 키 경로 또는 JSON 문자열',
      },
    ],
    domain: 'infrastructure',
    subcategory: 'object_storage',
    popularity_score: 86,
    difficulty_level: 'intermediate',
    tags: ['object-storage', 'gcs', 'gcp', 'google', 'bucket', 'cdn-origin', 'backup', '구글 클라우드 스토리지', '오브젝트 스토리지', '버킷'],
    alternatives: ['aws-s3', 'cloudflare-r2', 'google-drive'],
    compatibility: {
      framework: ['nextjs', 'express', 'fastapi', 'django'],
      language: ['typescript', 'javascript', 'python', 'go', 'java', 'php'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/@google-cloud/storage',
      python: 'https://pypi.org/project/google-cloud-storage/',
    },
    free_tier_quality: 'good',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 30,
    monthly_cost_estimate: { starter: '$0(무료 한도 내)', growth: '$5-50/월', enterprise: '약정 할인 협의' },
  },

  // -----------------------------------------------------------------------
  // Google Maps Platform
  // -----------------------------------------------------------------------
  {
    id: SERVICE_IDS_V2.google_maps_platform,
    name: 'Google Maps Platform',
    slug: 'google-maps-platform',
    category: 'other',
    description:
      '지도·장소 검색·지오코딩·경로 안내 API 묶음입니다. 2025년 3월 1일부로 월 $200 크레딧이 폐지되고 SKU 등급별 무료 한도(Essentials 10,000 / Pro 5,000 / Enterprise 1,000 호출·월)로 전환되었습니다.',
    description_ko:
      '지도·장소 검색·지오코딩·경로 안내 API 묶음입니다. 2025년 3월 1일부로 월 $200 크레딧이 폐지되고 SKU 등급별 무료 한도(Essentials 10,000 / Pro 5,000 / Enterprise 1,000 호출·월, Map Tiles는 100,000)로 전환되었습니다. 무료 한도가 SKU별로 분리되어 합산되지 않는 점에 주의해야 합니다(2026-07 확인).',
    icon_url: null,
    website_url: 'https://mapsplatform.google.com',
    docs_url: 'https://developers.google.com/maps/billing-and-pricing/overview',
    pricing_info: {
      free_tier: true,
      free_tier_details:
        'SKU 등급별 월 무료 호출: Essentials 10,000 / Pro 5,000 / Enterprise 1,000. Map Tiles API는 100,000 이벤트. 한도는 SKU별 개별 적용(풀링 없음).',
      plans: [
        { name: '종량제(Pay as you go)', price: 'SKU별 단가 — 무료 한도 초과분만 과금' },
        { name: '구독 Starter', price: '$100/월' },
        { name: '구독 Essentials', price: '$275/월' },
      ],
    },
    required_env_vars: [
      {
        name: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
        public: true,
        description: 'Browser-restricted Maps JavaScript API key',
        description_ko: '브라우저용 Maps JavaScript API 키 (HTTP 리퍼러 제한 필수)',
      },
      {
        name: 'GOOGLE_MAPS_SERVER_API_KEY',
        public: false,
        optional: true,
        description: 'Server-side key for Geocoding/Places (IP restricted)',
        description_ko: '서버용 Geocoding·Places API 키 (IP 제한, 선택)',
      },
    ],
    domain: 'business',
    subcategory: 'maps-location',
    popularity_score: 88,
    difficulty_level: 'intermediate',
    tags: ['maps', 'geocoding', 'places', 'directions', 'location', 'google', 'street-view', '구글 지도', '지도', '길찾기', '위치'],
    alternatives: ['mapbox', 'naver-maps', 'kakao-maps'],
    compatibility: {
      framework: ['nextjs', 'react', 'vue', 'angular', 'flutter', 'react-native'],
      language: ['typescript', 'javascript', 'python', 'java', 'kotlin', 'swift', 'go'],
    },
    official_sdks: {
      npm: 'https://www.npmjs.com/package/@googlemaps/js-api-loader',
      python: 'https://pypi.org/project/googlemaps/',
    },
    free_tier_quality: 'limited',
    vendor_lock_in_risk: 'medium',
    setup_time_minutes: 25,
    monthly_cost_estimate: { starter: '$0(SKU 무료 한도 내)', growth: '종량제(SKU별 단가)', enterprise: '$100-275/월 구독 또는 협의' },
  },
];
