import type { DependencyType } from '@/types';

export interface DependencySeed {
  service_id: string;
  depends_on_service_id: string;
  dependency_type: DependencyType;
  description: string;
  description_ko: string;
}

const S = {
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
  namecheap: '10000000-0000-4000-a000-000000000051',
  cloudflare_registrar: '10000000-0000-4000-a000-000000000052',
  godaddy: '10000000-0000-4000-a000-000000000053',
  gabia: '10000000-0000-4000-a000-000000000054',
  hosting_kr: '10000000-0000-4000-a000-000000000055',
  dotname: '10000000-0000-4000-a000-000000000056',
  github: '10000000-0000-4000-a000-000000000057',
  claude_code: '10000000-0000-4000-a000-000000000058',
  google_gemini: '10000000-0000-4000-a000-000000000059',
  // AI Phase 5
  pinecone: '10000000-0000-4000-a000-000000000066',
  langchain: '10000000-0000-4000-a000-000000000067',
  replicate: '10000000-0000-4000-a000-000000000068',
  huggingface: '10000000-0000-4000-a000-000000000069',
  stability_ai: '10000000-0000-4000-a000-000000000070',
  github_copilot: '10000000-0000-4000-a000-000000000081',
  cursor: '10000000-0000-4000-a000-000000000082',
  grok: '10000000-0000-4000-a000-000000000103',
  mistral: '10000000-0000-4000-a000-000000000104',
  cohere: '10000000-0000-4000-a000-000000000105',
  deepseek: '10000000-0000-4000-a000-000000000106',
  perplexity: '10000000-0000-4000-a000-000000000107',
  midjourney: '10000000-0000-4000-a000-000000000109',
  runway_ml: '10000000-0000-4000-a000-000000000110',
  sora: '10000000-0000-4000-a000-000000000111',
  leonardo_ai: '10000000-0000-4000-a000-000000000112',
  deepgram: '10000000-0000-4000-a000-000000000113',
  assemblyai: '10000000-0000-4000-a000-000000000114',
  windsurf: '10000000-0000-4000-a000-000000000116',
  tabnine: '10000000-0000-4000-a000-000000000117',
  weaviate: '10000000-0000-4000-a000-000000000119',
  qdrant: '10000000-0000-4000-a000-000000000120',
  chroma: '10000000-0000-4000-a000-000000000121',
  crewai: '10000000-0000-4000-a000-000000000122',
  dify: '10000000-0000-4000-a000-000000000123',
  together_ai: '10000000-0000-4000-a000-000000000124',
  fireworks_ai: '10000000-0000-4000-a000-000000000125',
  polar: '10000000-0000-4000-a000-000000000134',
} as const;

export const dependencies: DependencySeed[] = [
  // --- Alternatives (same category, interchangeable) ---
  { service_id: S.supabase, depends_on_service_id: S.firebase, dependency_type: 'alternative', description: 'Firebase is an alternative BaaS platform', description_ko: 'Firebase는 대안 BaaS 플랫폼입니다' },
  { service_id: S.supabase, depends_on_service_id: S.neon, dependency_type: 'alternative', description: 'Neon is an alternative Postgres provider', description_ko: 'Neon은 대안 Postgres 제공자입니다' },
  { service_id: S.supabase, depends_on_service_id: S.planetscale, dependency_type: 'alternative', description: 'PlanetScale is an alternative managed database', description_ko: 'PlanetScale은 대안 관리형 데이터베이스입니다' },

  { service_id: S.vercel, depends_on_service_id: S.netlify, dependency_type: 'alternative', description: 'Netlify is an alternative deployment platform', description_ko: 'Netlify는 대안 배포 플랫폼입니다' },
  { service_id: S.vercel, depends_on_service_id: S.fly_io, dependency_type: 'alternative', description: 'Fly.io is an alternative for container-based deployment', description_ko: 'Fly.io는 컨테이너 기반 배포의 대안입니다' },
  { service_id: S.vercel, depends_on_service_id: S.render, dependency_type: 'alternative', description: 'Render is an alternative cloud hosting platform', description_ko: 'Render는 대안 클라우드 호스팅 플랫폼입니다' },
  { service_id: S.vercel, depends_on_service_id: S.railway, dependency_type: 'alternative', description: 'Railway is an alternative deployment platform', description_ko: 'Railway는 대안 배포 플랫폼입니다' },

  { service_id: S.clerk, depends_on_service_id: S.nextauth, dependency_type: 'alternative', description: 'NextAuth is an alternative auth solution', description_ko: 'NextAuth는 대안 인증 솔루션입니다' },

  { service_id: S.resend, depends_on_service_id: S.sendgrid, dependency_type: 'alternative', description: 'SendGrid is an alternative email service', description_ko: 'SendGrid는 대안 이메일 서비스입니다' },

  { service_id: S.openai, depends_on_service_id: S.anthropic, dependency_type: 'alternative', description: 'Anthropic is an alternative LLM provider', description_ko: 'Anthropic은 대안 LLM 제공자입니다' },
  { service_id: S.openai, depends_on_service_id: S.groq, dependency_type: 'alternative', description: 'Groq offers fast LLM inference as an alternative', description_ko: 'Groq는 빠른 LLM 추론을 대안으로 제공합니다' },

  { service_id: S.stripe, depends_on_service_id: S.lemonsqueezy, dependency_type: 'alternative', description: 'Lemon Squeezy is an alternative payment platform', description_ko: 'Lemon Squeezy는 대안 결제 플랫폼입니다' },

  { service_id: S.algolia, depends_on_service_id: S.meilisearch, dependency_type: 'alternative', description: 'Meilisearch is an open-source alternative to Algolia', description_ko: 'Meilisearch는 Algolia의 오픈소스 대안입니다' },

  { service_id: S.sanity, depends_on_service_id: S.contentful, dependency_type: 'alternative', description: 'Contentful is an alternative headless CMS', description_ko: 'Contentful은 대안 헤드리스 CMS입니다' },
  { service_id: S.sanity, depends_on_service_id: S.strapi, dependency_type: 'alternative', description: 'Strapi is a self-hosted CMS alternative', description_ko: 'Strapi는 자체 호스팅 CMS 대안입니다' },

  { service_id: S.trigger_dev, depends_on_service_id: S.inngest, dependency_type: 'alternative', description: 'Inngest is an alternative for background jobs', description_ko: 'Inngest는 백그라운드 잡의 대안입니다' },

  { service_id: S.playwright, depends_on_service_id: S.cypress, dependency_type: 'alternative', description: 'Cypress is an alternative E2E testing framework', description_ko: 'Cypress는 대안 E2E 테스팅 프레임워크입니다' },

  { service_id: S.ga4, depends_on_service_id: S.mixpanel, dependency_type: 'alternative', description: 'Mixpanel is an alternative analytics platform', description_ko: 'Mixpanel은 대안 분석 플랫폼입니다' },
  { service_id: S.ga4, depends_on_service_id: S.plausible, dependency_type: 'alternative', description: 'Plausible is a privacy-friendly analytics alternative', description_ko: 'Plausible은 프라이버시 친화적 분석 대안입니다' },
  { service_id: S.ga4, depends_on_service_id: S.posthog, dependency_type: 'alternative', description: 'PostHog is an open-source analytics alternative', description_ko: 'PostHog는 오픈소스 분석 대안입니다' },

  { service_id: S.onesignal, depends_on_service_id: S.pusher, dependency_type: 'alternative', description: 'Pusher is an alternative for realtime messaging', description_ko: 'Pusher는 실시간 메시징의 대안입니다' },

  { service_id: S.uploadthing, depends_on_service_id: S.cloudinary, dependency_type: 'alternative', description: 'Cloudinary is an alternative for file/image management', description_ko: 'Cloudinary는 파일/이미지 관리의 대안입니다' },
  { service_id: S.uploadthing, depends_on_service_id: S.awss3, dependency_type: 'alternative', description: 'AWS S3 is an alternative for object storage', description_ko: 'AWS S3는 오브젝트 스토리지의 대안입니다' },

  // --- Recommended (commonly used together) ---
  { service_id: S.vercel, depends_on_service_id: S.supabase, dependency_type: 'recommended', description: 'Supabase is commonly used with Vercel for backend', description_ko: 'Supabase는 Vercel과 함께 백엔드로 자주 사용됩니다' },
  { service_id: S.vercel, depends_on_service_id: S.sentry, dependency_type: 'recommended', description: 'Sentry provides error tracking for Vercel deployments', description_ko: 'Sentry는 Vercel 배포에 에러 추적을 제공합니다' },
  { service_id: S.vercel, depends_on_service_id: S.clerk, dependency_type: 'recommended', description: 'Clerk provides authentication for Next.js on Vercel', description_ko: 'Clerk는 Vercel의 Next.js에 인증을 제공합니다' },

  { service_id: S.stripe, depends_on_service_id: S.supabase, dependency_type: 'recommended', description: 'Use Supabase to store Stripe customer data', description_ko: 'Supabase를 사용하여 Stripe 고객 데이터를 저장합니다' },
  { service_id: S.stripe, depends_on_service_id: S.resend, dependency_type: 'recommended', description: 'Use Resend to send payment receipts via email', description_ko: 'Resend를 사용하여 결제 영수증을 이메일로 전송합니다' },

  { service_id: S.nextauth, depends_on_service_id: S.supabase, dependency_type: 'recommended', description: 'Use Supabase as NextAuth database adapter', description_ko: 'Supabase를 NextAuth 데이터베이스 어댑터로 사용합니다' },

  { service_id: S.github_actions, depends_on_service_id: S.vercel, dependency_type: 'recommended', description: 'GitHub Actions can trigger Vercel deployments', description_ko: 'GitHub Actions로 Vercel 배포를 트리거할 수 있습니다' },
  { service_id: S.github_actions, depends_on_service_id: S.playwright, dependency_type: 'recommended', description: 'Run Playwright tests in GitHub Actions CI', description_ko: 'GitHub Actions CI에서 Playwright 테스트를 실행합니다' },
  { service_id: S.github_actions, depends_on_service_id: S.cypress, dependency_type: 'recommended', description: 'Run Cypress tests in GitHub Actions CI', description_ko: 'GitHub Actions CI에서 Cypress 테스트를 실행합니다' },

  { service_id: S.bullmq, depends_on_service_id: S.upstash_redis, dependency_type: 'required', description: 'BullMQ requires Redis as its backend', description_ko: 'BullMQ는 Redis를 백엔드로 필요합니다' },

  { service_id: S.trigger_dev, depends_on_service_id: S.vercel, dependency_type: 'recommended', description: 'Trigger.dev integrates well with Vercel deployments', description_ko: 'Trigger.dev는 Vercel 배포와 잘 통합됩니다' },

  { service_id: S.inngest, depends_on_service_id: S.vercel, dependency_type: 'recommended', description: 'Inngest works seamlessly with Vercel serverless functions', description_ko: 'Inngest는 Vercel 서버리스 함수와 원활하게 작동합니다' },

  { service_id: S.sentry, depends_on_service_id: S.vercel, dependency_type: 'recommended', description: 'Sentry has a first-party Vercel integration', description_ko: 'Sentry는 공식 Vercel 통합을 제공합니다' },

  { service_id: S.posthog, depends_on_service_id: S.vercel, dependency_type: 'recommended', description: 'PostHog integrates easily with Next.js on Vercel', description_ko: 'PostHog는 Vercel의 Next.js와 쉽게 통합됩니다' },

  { service_id: S.cloudflare, depends_on_service_id: S.vercel, dependency_type: 'optional', description: 'Use Cloudflare DNS/CDN in front of Vercel', description_ko: 'Vercel 앞에 Cloudflare DNS/CDN을 사용합니다' },

  { service_id: S.datadog, depends_on_service_id: S.sentry, dependency_type: 'optional', description: 'Use Datadog alongside Sentry for full observability', description_ko: '전체 관찰성을 위해 Sentry와 함께 Datadog를 사용합니다' },

  { service_id: S.logrocket, depends_on_service_id: S.sentry, dependency_type: 'recommended', description: 'Combine LogRocket session replay with Sentry errors', description_ko: 'LogRocket 세션 리플레이를 Sentry 에러와 결합합니다' },

  { service_id: S.launchdarkly, depends_on_service_id: S.posthog, dependency_type: 'optional', description: 'Combine feature flags with PostHog analytics', description_ko: '피처 플래그를 PostHog 분석과 결합합니다' },

  { service_id: S.shopify_api, depends_on_service_id: S.stripe, dependency_type: 'optional', description: 'Use Stripe for custom payment flows with Shopify', description_ko: 'Shopify에서 커스텀 결제 흐름을 위해 Stripe를 사용합니다' },

  { service_id: S.strapi, depends_on_service_id: S.cloudinary, dependency_type: 'recommended', description: 'Use Cloudinary for media management with Strapi', description_ko: 'Strapi에서 미디어 관리를 위해 Cloudinary를 사용합니다' },

  { service_id: S.slack_api, depends_on_service_id: S.sentry, dependency_type: 'optional', description: 'Send Sentry alerts to Slack channels', description_ko: 'Sentry 알림을 Slack 채널로 전송합니다' },

  // --- New services: Claude Code, Google Gemini, GitHub ---
  { service_id: S.claude_code, depends_on_service_id: S.openai, dependency_type: 'alternative', description: 'OpenAI is an alternative AI coding provider', description_ko: 'OpenAI는 대안 AI 코딩 제공자입니다' },
  { service_id: S.claude_code, depends_on_service_id: S.anthropic, dependency_type: 'alternative', description: 'Anthropic Claude API is an alternative to Claude Code', description_ko: 'Anthropic Claude API는 Claude Code의 대안입니다' },
  { service_id: S.claude_code, depends_on_service_id: S.groq, dependency_type: 'alternative', description: 'Groq offers fast LLM inference as an alternative', description_ko: 'Groq는 빠른 LLM 추론을 대안으로 제공합니다' },

  { service_id: S.google_gemini, depends_on_service_id: S.openai, dependency_type: 'alternative', description: 'OpenAI is an alternative LLM provider', description_ko: 'OpenAI는 대안 LLM 제공자입니다' },
  { service_id: S.google_gemini, depends_on_service_id: S.anthropic, dependency_type: 'alternative', description: 'Anthropic is an alternative LLM provider', description_ko: 'Anthropic은 대안 LLM 제공자입니다' },

  { service_id: S.github, depends_on_service_id: S.vercel, dependency_type: 'recommended', description: 'GitHub integrates with Vercel for automatic deployments', description_ko: 'GitHub는 Vercel과 자동 배포를 위해 연동됩니다' },

  // --- Domain Registrars: Alternatives (all interchangeable) ---
  { service_id: S.namecheap, depends_on_service_id: S.godaddy, dependency_type: 'alternative', description: 'GoDaddy is an alternative domain registrar', description_ko: 'GoDaddy는 대안 도메인 등록업체입니다' },
  { service_id: S.namecheap, depends_on_service_id: S.cloudflare_registrar, dependency_type: 'alternative', description: 'Cloudflare Registrar offers no-markup pricing', description_ko: 'Cloudflare Registrar는 마크업 없는 가격을 제공합니다' },
  { service_id: S.namecheap, depends_on_service_id: S.gabia, dependency_type: 'alternative', description: 'Gabia is an alternative for .kr domain registration', description_ko: 'Gabia는 .kr 도메인 등록의 대안입니다' },

  { service_id: S.cloudflare_registrar, depends_on_service_id: S.godaddy, dependency_type: 'alternative', description: 'GoDaddy is an alternative domain registrar', description_ko: 'GoDaddy는 대안 도메인 등록업체입니다' },
  { service_id: S.cloudflare_registrar, depends_on_service_id: S.namecheap, dependency_type: 'alternative', description: 'Namecheap is a budget-friendly alternative', description_ko: 'Namecheap는 저가 대안입니다' },

  { service_id: S.godaddy, depends_on_service_id: S.namecheap, dependency_type: 'alternative', description: 'Namecheap is a cheaper alternative to GoDaddy', description_ko: 'Namecheap는 GoDaddy보다 저렴한 대안입니다' },
  { service_id: S.godaddy, depends_on_service_id: S.cloudflare_registrar, dependency_type: 'alternative', description: 'Cloudflare offers no-markup domain pricing', description_ko: 'Cloudflare는 마크업 없는 도메인 가격을 제공합니다' },

  { service_id: S.gabia, depends_on_service_id: S.hosting_kr, dependency_type: 'alternative', description: 'HostingKR is an alternative for Korean domains', description_ko: 'HostingKR은 한국 도메인의 대안입니다' },
  { service_id: S.gabia, depends_on_service_id: S.dotname, dependency_type: 'alternative', description: 'DotName offers free hosting with domain', description_ko: 'DotName은 도메인과 함께 무료 호스팅을 제공합니다' },
  { service_id: S.gabia, depends_on_service_id: S.namecheap, dependency_type: 'alternative', description: 'Namecheap supports international domain registration', description_ko: 'Namecheap는 국제 도메인 등록을 지원합니다' },

  { service_id: S.hosting_kr, depends_on_service_id: S.gabia, dependency_type: 'alternative', description: 'Gabia is an alternative for Korean domains', description_ko: 'Gabia는 한국 도메인의 대안입니다' },
  { service_id: S.hosting_kr, depends_on_service_id: S.dotname, dependency_type: 'alternative', description: 'DotName is another Korean registrar option', description_ko: 'DotName은 또 다른 한국 등록업체 옵션입니다' },

  { service_id: S.dotname, depends_on_service_id: S.gabia, dependency_type: 'alternative', description: 'Gabia is an alternative with stronger market presence', description_ko: 'Gabia는 더 강한 시장 입지의 대안입니다' },
  { service_id: S.dotname, depends_on_service_id: S.hosting_kr, dependency_type: 'alternative', description: 'HostingKR is an alternative with more hosting features', description_ko: 'HostingKR은 더 많은 호스팅 기능의 대안입니다' },

  // --- Domain Registrars: Optional relationships with Cloudflare ---
  { service_id: S.cloudflare, depends_on_service_id: S.cloudflare_registrar, dependency_type: 'optional', description: 'Cloudflare Registrar integrates seamlessly with Cloudflare DNS', description_ko: 'Cloudflare Registrar는 Cloudflare DNS와 완벽하게 통합됩니다' },

  // --- AI Services: LLM Alternatives ---
  { service_id: S.grok, depends_on_service_id: S.openai, dependency_type: 'alternative', description: 'OpenAI is an alternative LLM provider', description_ko: 'OpenAI는 대안 LLM 제공자입니다' },
  { service_id: S.grok, depends_on_service_id: S.anthropic, dependency_type: 'alternative', description: 'Anthropic is an alternative LLM provider', description_ko: 'Anthropic은 대안 LLM 제공자입니다' },
  { service_id: S.mistral, depends_on_service_id: S.openai, dependency_type: 'alternative', description: 'OpenAI is an alternative LLM provider', description_ko: 'OpenAI는 대안 LLM 제공자입니다' },
  { service_id: S.mistral, depends_on_service_id: S.deepseek, dependency_type: 'alternative', description: 'DeepSeek offers low-cost LLM alternative', description_ko: 'DeepSeek는 저비용 LLM 대안입니다' },
  { service_id: S.cohere, depends_on_service_id: S.openai, dependency_type: 'alternative', description: 'OpenAI is an alternative LLM provider', description_ko: 'OpenAI는 대안 LLM 제공자입니다' },
  { service_id: S.deepseek, depends_on_service_id: S.openai, dependency_type: 'alternative', description: 'OpenAI is an alternative (more expensive) LLM', description_ko: 'OpenAI는 대안 (고가) LLM입니다' },
  { service_id: S.deepseek, depends_on_service_id: S.mistral, dependency_type: 'alternative', description: 'Mistral is an alternative open-source LLM', description_ko: 'Mistral은 대안 오픈소스 LLM입니다' },
  { service_id: S.perplexity, depends_on_service_id: S.openai, dependency_type: 'alternative', description: 'OpenAI is an alternative for AI-powered answers', description_ko: 'OpenAI는 AI 답변의 대안입니다' },

  // --- AI Services: LLM Inference Alternatives ---
  { service_id: S.together_ai, depends_on_service_id: S.groq, dependency_type: 'alternative', description: 'Groq is an alternative fast inference platform', description_ko: 'Groq는 대안 고속 추론 플랫폼입니다' },
  { service_id: S.together_ai, depends_on_service_id: S.fireworks_ai, dependency_type: 'alternative', description: 'Fireworks AI is an alternative inference platform', description_ko: 'Fireworks AI는 대안 추론 플랫폼입니다' },
  { service_id: S.fireworks_ai, depends_on_service_id: S.groq, dependency_type: 'alternative', description: 'Groq is an alternative fast inference platform', description_ko: 'Groq는 대안 고속 추론 플랫폼입니다' },
  { service_id: S.fireworks_ai, depends_on_service_id: S.together_ai, dependency_type: 'alternative', description: 'Together AI is an alternative inference platform', description_ko: 'Together AI는 대안 추론 플랫폼입니다' },

  // --- AI Services: Code Assistant Alternatives ---
  { service_id: S.windsurf, depends_on_service_id: S.cursor, dependency_type: 'alternative', description: 'Cursor is an alternative AI IDE', description_ko: 'Cursor는 대안 AI IDE입니다' },
  { service_id: S.windsurf, depends_on_service_id: S.github_copilot, dependency_type: 'alternative', description: 'GitHub Copilot is an alternative coding assistant', description_ko: 'GitHub Copilot은 대안 코딩 어시스턴트입니다' },
  { service_id: S.tabnine, depends_on_service_id: S.github_copilot, dependency_type: 'alternative', description: 'GitHub Copilot is an alternative coding assistant', description_ko: 'GitHub Copilot은 대안 코딩 어시스턴트입니다' },
  { service_id: S.tabnine, depends_on_service_id: S.cursor, dependency_type: 'alternative', description: 'Cursor is an alternative AI IDE', description_ko: 'Cursor는 대안 AI IDE입니다' },

  // --- AI Services: Image/Video Generation Alternatives ---
  { service_id: S.midjourney, depends_on_service_id: S.stability_ai, dependency_type: 'alternative', description: 'Stability AI is an open-source image generation alternative', description_ko: 'Stability AI는 오픈소스 이미지 생성 대안입니다' },
  { service_id: S.midjourney, depends_on_service_id: S.leonardo_ai, dependency_type: 'alternative', description: 'Leonardo AI is an alternative for image generation', description_ko: 'Leonardo AI는 이미지 생성의 대안입니다' },
  { service_id: S.runway_ml, depends_on_service_id: S.sora, dependency_type: 'alternative', description: 'Sora is an alternative video generation tool', description_ko: 'Sora는 대안 비디오 생성 도구입니다' },
  { service_id: S.sora, depends_on_service_id: S.runway_ml, dependency_type: 'alternative', description: 'Runway ML is an alternative video generation platform', description_ko: 'Runway ML은 대안 비디오 생성 플랫폼입니다' },

  // --- AI Services: Voice/Audio Alternatives ---
  { service_id: S.deepgram, depends_on_service_id: S.assemblyai, dependency_type: 'alternative', description: 'AssemblyAI is an alternative STT provider', description_ko: 'AssemblyAI는 대안 STT 제공자입니다' },
  { service_id: S.assemblyai, depends_on_service_id: S.deepgram, dependency_type: 'alternative', description: 'Deepgram is an alternative STT provider', description_ko: 'Deepgram은 대안 STT 제공자입니다' },

  // --- AI Services: Vector DB Alternatives ---
  { service_id: S.weaviate, depends_on_service_id: S.pinecone, dependency_type: 'alternative', description: 'Pinecone is an alternative managed vector DB', description_ko: 'Pinecone은 대안 관리형 벡터 DB입니다' },
  { service_id: S.weaviate, depends_on_service_id: S.qdrant, dependency_type: 'alternative', description: 'Qdrant is an alternative high-performance vector DB', description_ko: 'Qdrant는 대안 고성능 벡터 DB입니다' },
  { service_id: S.qdrant, depends_on_service_id: S.pinecone, dependency_type: 'alternative', description: 'Pinecone is an alternative managed vector DB', description_ko: 'Pinecone은 대안 관리형 벡터 DB입니다' },
  { service_id: S.qdrant, depends_on_service_id: S.chroma, dependency_type: 'alternative', description: 'Chroma is a lightweight vector DB alternative', description_ko: 'Chroma는 경량 벡터 DB 대안입니다' },
  { service_id: S.chroma, depends_on_service_id: S.pinecone, dependency_type: 'alternative', description: 'Pinecone is a managed alternative', description_ko: 'Pinecone은 관리형 대안입니다' },

  // --- AI Services: Agent Framework Alternatives ---
  { service_id: S.crewai, depends_on_service_id: S.langchain, dependency_type: 'alternative', description: 'LangChain is an alternative AI framework', description_ko: 'LangChain은 대안 AI 프레임워크입니다' },
  { service_id: S.crewai, depends_on_service_id: S.dify, dependency_type: 'alternative', description: 'Dify is a no-code alternative for AI apps', description_ko: 'Dify는 AI 앱의 노코드 대안입니다' },
  { service_id: S.dify, depends_on_service_id: S.langchain, dependency_type: 'alternative', description: 'LangChain is a code-first alternative', description_ko: 'LangChain은 코드 우선 대안입니다' },

  // --- AI Services: Recommended Combinations ---
  { service_id: S.langchain, depends_on_service_id: S.pinecone, dependency_type: 'recommended', description: 'Pinecone is commonly used with LangChain for RAG', description_ko: 'Pinecone은 RAG를 위해 LangChain과 자주 사용됩니다' },
  { service_id: S.langchain, depends_on_service_id: S.openai, dependency_type: 'recommended', description: 'OpenAI is the most common LLM used with LangChain', description_ko: 'OpenAI는 LangChain과 가장 많이 사용되는 LLM입니다' },
  { service_id: S.crewai, depends_on_service_id: S.openai, dependency_type: 'recommended', description: 'OpenAI is commonly used as the LLM backend for CrewAI', description_ko: 'OpenAI는 CrewAI의 LLM 백엔드로 자주 사용됩니다' },
  { service_id: S.dify, depends_on_service_id: S.openai, dependency_type: 'recommended', description: 'OpenAI is the default LLM provider for Dify', description_ko: 'OpenAI는 Dify의 기본 LLM 제공자입니다' },

  // --- Payment: Polar Alternatives ---
  { service_id: S.polar, depends_on_service_id: S.stripe, dependency_type: 'alternative', description: 'Stripe is a full-featured alternative payment platform', description_ko: 'Stripe는 완전한 기능의 대안 결제 플랫폼입니다' },
  { service_id: S.polar, depends_on_service_id: S.lemonsqueezy, dependency_type: 'alternative', description: 'Lemon Squeezy is an alternative MoR platform for digital products', description_ko: 'Lemon Squeezy는 디지털 상품을 위한 대안 MoR 플랫폼입니다' },
  { service_id: S.stripe, depends_on_service_id: S.polar, dependency_type: 'alternative', description: 'Polar is an open-source MoR alternative focused on indie developers', description_ko: 'Polar는 인디 개발자에게 특화된 오픈소스 MoR 대안입니다' },
  { service_id: S.lemonsqueezy, depends_on_service_id: S.polar, dependency_type: 'alternative', description: 'Polar is an open-source alternative for monetizing digital products', description_ko: 'Polar는 디지털 상품 수익화를 위한 오픈소스 대안입니다' },
  { service_id: S.polar, depends_on_service_id: S.supabase, dependency_type: 'recommended', description: 'Use Supabase to store Polar customer and subscription data', description_ko: 'Supabase를 사용하여 Polar 고객 및 구독 데이터를 저장합니다' },
  { service_id: S.polar, depends_on_service_id: S.resend, dependency_type: 'recommended', description: 'Use Resend to send payment receipts and order confirmations', description_ko: 'Resend를 사용하여 결제 영수증 및 주문 확인 이메일을 전송합니다' },
];
