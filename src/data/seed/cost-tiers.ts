export interface CostTierSeed {
  service_id: string;
  tier_name: string;
  tier_name_ko: string;
  price_monthly: string;
  price_yearly: string;
  features: { feature: string; feature_ko: string; included: boolean }[];
  limits: Record<string, string>;
  recommended_for: string;
  order_index: number;
}

// Service ID mapping
const S: Record<string, string> = {
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
  namecheap: '10000000-0000-4000-a000-000000000051',
  cloudflare_registrar: '10000000-0000-4000-a000-000000000052',
  godaddy: '10000000-0000-4000-a000-000000000053',
  gabia: '10000000-0000-4000-a000-000000000054',
  hosting_kr: '10000000-0000-4000-a000-000000000055',
  dotname: '10000000-0000-4000-a000-000000000056',
  polar: '10000000-0000-4000-a000-000000000134',
  // AI Phase 5
  grok: '10000000-0000-4000-a000-000000000103',
  mistral: '10000000-0000-4000-a000-000000000104',
  cohere: '10000000-0000-4000-a000-000000000105',
  deepseek: '10000000-0000-4000-a000-000000000106',
  perplexity: '10000000-0000-4000-a000-000000000107',
  midjourney: '10000000-0000-4000-a000-000000000109',
  runway_ml: '10000000-0000-4000-a000-000000000110',
  deepgram: '10000000-0000-4000-a000-000000000113',
  assemblyai: '10000000-0000-4000-a000-000000000114',
  windsurf: '10000000-0000-4000-a000-000000000116',
  weaviate: '10000000-0000-4000-a000-000000000119',
  qdrant: '10000000-0000-4000-a000-000000000120',
  dify: '10000000-0000-4000-a000-000000000123',
  together_ai: '10000000-0000-4000-a000-000000000124',
  modal: '10000000-0000-4000-a000-000000000126',
  wandb: '10000000-0000-4000-a000-000000000127',

  // --- 2026-07 신규 서비스 ---
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
};

// Helper function to create tier
const t = (
  serviceId: string,
  name: string,
  nameKo: string,
  priceM: string,
  priceY: string,
  features: [string, string, boolean][],
  limits: Record<string, string>,
  recFor: string,
  order: number
): CostTierSeed => ({
  service_id: serviceId,
  tier_name: name,
  tier_name_ko: nameKo,
  price_monthly: priceM,
  price_yearly: priceY,
  features: features.map(([f, fk, i]) => ({ feature: f, feature_ko: fk, included: i })),
  limits,
  recommended_for: recFor,
  order_index: order,
});

export const costTiers: CostTierSeed[] = [
  // Supabase (3 tiers)
  t(S.supabase, 'free', '무료', '$0', '$0', [
    ['500MB database', '500MB 데이터베이스', true],
    ['50K monthly users', '월 5만 사용자', true],
    ['Community support', '커뮤니티 지원', true],
  ], { storage: '1GB', bandwidth: '2GB/mo', db: '500MB' }, '개인 프로젝트', 0),

  t(S.supabase, 'pro', '프로', '$25', '$240', [
    ['8GB database', '8GB 데이터베이스', true],
    ['100K monthly users', '월 10만 사용자', true],
    ['Email support', '이메일 지원', true],
  ], { storage: '100GB', bandwidth: '250GB/mo', db: '8GB' }, '스타트업', 1),

  t(S.supabase, 'enterprise', '엔터프라이즈', 'Contact', 'Contact', [
    ['Unlimited resources', '무제한 리소스', true],
    ['99.99% SLA', '99.99% SLA', true],
    ['Dedicated support', '전담 지원', true],
  ], { storage: 'Unlimited', bandwidth: 'Unlimited', db: 'Custom' }, '대기업', 2),

  // Firebase (3 tiers)
  t(S.firebase, 'spark', '스파크', '$0', '$0', [
    ['1GB storage', '1GB 스토리지', true],
    ['10GB bandwidth', '10GB 전송량', true],
    ['Basic features', '기본 기능', true],
  ], { storage: '1GB', bandwidth: '10GB/mo', auth: '10K/mo' }, '개인 프로젝트', 0),

  t(S.firebase, 'blaze', '블레이즈', 'Pay as you go', 'Pay as you go', [
    ['Unlimited storage', '무제한 스토리지', true],
    ['Auto-scaling', '자동 확장', true],
    ['Priority support', '우선 지원', true],
  ], { storage: 'Pay per use', bandwidth: 'Pay per use', auth: 'Unlimited' }, '성장 중인 앱', 1),

  t(S.firebase, 'enterprise', '엔터프라이즈', 'Contact', 'Contact', [
    ['Custom SLA', '맞춤 SLA', true],
    ['Dedicated support', '전담 지원', true],
    ['Advanced security', '고급 보안', true],
  ], { storage: 'Custom', bandwidth: 'Custom', auth: 'Custom' }, '대기업', 2),

  // Vercel (3 tiers)
  t(S.vercel, 'hobby', '취미', '$0', '$0', [
    ['100GB bandwidth', '100GB 전송량', true],
    ['Basic analytics', '기본 분석', true],
    ['Community support', '커뮤니티 지원', true],
  ], { bandwidth: '100GB/mo', builds: '6000 min/mo', team: '1' }, '개인 프로젝트', 0),

  t(S.vercel, 'pro', '프로', '$20', '$240', [
    ['1TB bandwidth', '1TB 전송량', true],
    ['Advanced analytics', '고급 분석', true],
    ['Email support', '이메일 지원', true],
  ], { bandwidth: '1TB/mo', builds: 'Unlimited', team: 'Unlimited' }, '전문가/팀', 1),

  t(S.vercel, 'enterprise', '엔터프라이즈', 'Contact', 'Contact', [
    ['Custom bandwidth', '맞춤 전송량', true],
    ['99.99% SLA', '99.99% SLA', true],
    ['Dedicated support', '전담 지원', true],
  ], { bandwidth: 'Custom', builds: 'Unlimited', team: 'Custom' }, '대기업', 2),

  // Netlify (2 tiers)
  t(S.netlify, 'starter', '스타터', '$0', '$0', [
    ['100GB bandwidth', '100GB 전송량', true],
    ['300 build minutes', '300분 빌드', true],
    ['Community support', '커뮤니티 지원', true],
  ], { bandwidth: '100GB/mo', builds: '300 min/mo', forms: '100/mo' }, '개인 프로젝트', 0),

  t(S.netlify, 'pro', '프로', '$20', '$240', [
    ['1TB bandwidth', '1TB 전송량', true],
    ['25K build minutes', '25000분 빌드', true],
    ['Email support', '이메일 지원', true],
  ], { bandwidth: '1TB/mo', builds: '25K min/mo', forms: 'Unlimited' }, '전문가/팀', 1),

  // Stripe (3 tiers)
  t(S.stripe, 'free', '무료', '$0', '$0', [
    ['2.9% + 30¢ per charge', '거래당 2.9% + 30¢', true],
    ['Basic features', '기본 기능', true],
    ['Email support', '이메일 지원', true],
  ], { fee: '2.9% + 30¢', volume: 'Unlimited', disputes: 'Standard' }, '모든 규모', 0),

  t(S.stripe, 'plus', '플러스', '$2', '$24', [
    ['Lower fees', '낮은 수수료', true],
    ['Advanced features', '고급 기능', true],
    ['Priority support', '우선 지원', true],
  ], { fee: 'Custom', volume: 'Unlimited', disputes: 'Priority' }, '성장 기업', 1),

  t(S.stripe, 'enterprise', '엔터프라이즈', 'Contact', 'Contact', [
    ['Custom pricing', '맞춤 가격', true],
    ['Dedicated support', '전담 지원', true],
    ['SLA guarantee', 'SLA 보장', true],
  ], { fee: 'Negotiable', volume: 'Unlimited', disputes: 'Dedicated' }, '대기업', 2),

  // Clerk (3 tiers)
  t(S.clerk, 'free', '무료', '$0', '$0', [
    ['10K monthly users', '월 1만 사용자', true],
    ['Social logins', '소셜 로그인', true],
    ['Community support', '커뮤니티 지원', true],
  ], { users: '10K/mo', mau: '5K', orgs: 'Unlimited' }, '개인 프로젝트', 0),

  t(S.clerk, 'pro', '프로', '$25', '$300', [
    ['100K monthly users', '월 10만 사용자', true],
    ['Advanced security', '고급 보안', true],
    ['Email support', '이메일 지원', true],
  ], { users: '100K/mo', mau: '50K', orgs: 'Unlimited' }, '스타트업', 1),

  t(S.clerk, 'enterprise', '엔터프라이즈', 'Contact', 'Contact', [
    ['Unlimited users', '무제한 사용자', true],
    ['SAML SSO', 'SAML SSO', true],
    ['Dedicated support', '전담 지원', true],
  ], { users: 'Unlimited', mau: 'Unlimited', orgs: 'Unlimited' }, '대기업', 2),

  // NextAuth (1 tier - OSS)
  t(S.nextauth, 'free', '무료', '$0', '$0', [
    ['Self-hosted', '셀프 호스팅', true],
    ['Open source', '오픈 소스', true],
    ['Community support', '커뮤니티 지원', true],
  ], { users: 'Unlimited', providers: 'Unlimited', cost: 'Infrastructure only' }, '모든 규모', 0),

  // Resend (2 tiers)
  t(S.resend, 'free', '무료', '$0', '$0', [
    ['100 emails/day', '일 100통', true],
    ['1 domain', '1개 도메인', true],
    ['Basic analytics', '기본 분석', true],
  ], { emails: '3K/mo', domains: '1', api: 'Unlimited' }, '개인 프로젝트', 0),

  t(S.resend, 'pro', '프로', '$20', '$240', [
    ['50K emails/month', '월 5만통', true],
    ['Unlimited domains', '무제한 도메인', true],
    ['Advanced analytics', '고급 분석', true],
  ], { emails: '50K/mo', domains: 'Unlimited', api: 'Unlimited' }, '스타트업', 1),

  // SendGrid (2 tiers)
  // 영구 무료(일 100통)는 폐지되고 60일 체험으로 대체됨. 기존 선택 이력 보존을 위해 행은 유지한다.
  t(S.sendgrid, 'free', '무료 체험 (60일)', '$0', '$0', [
    ['100 emails/day (60-day trial)', '일 100통 (60일 체험)', true],
    ['Basic features', '기본 기능', true],
    ['Email support', '이메일 지원', true],
  ], { emails: '100/day', contacts: '2K', api: 'Standard' }, '체험용 — 이후 유료 전환 필요', 0),

  t(S.sendgrid, 'essentials', '에센셜', '$19.95', '$239.40', [
    ['50K emails/month', '월 5만통', true],
    ['Advanced features', '고급 기능', true],
    ['Priority support', '우선 지원', true],
  ], { emails: '50K/mo', contacts: '50K', api: 'Advanced' }, '스타트업', 1),

  // OpenAI (3 tiers)
  t(S.openai, 'free', '무료', '$0', '$0', [
    ['$5 initial credit', '$5 초기 크레딧', true],
    ['Rate limited', '속도 제한', true],
    ['Community support', '커뮤니티 지원', true],
  ], { credit: '$5', rate: 'Limited', models: 'Standard' }, '테스트용', 0),

  t(S.openai, 'pay_as_you_go', '사용량 기반', 'Pay per use', 'Pay per use', [
    ['All models', '모든 모델', true],
    ['Higher rate limits', '높은 속도 제한', true],
    ['Email support', '이메일 지원', true],
  ], { credit: 'Pay per use', rate: 'Higher', models: 'All' }, '모든 규모', 1),

  t(S.openai, 'enterprise', '엔터프라이즈', 'Contact', 'Contact', [
    ['Custom pricing', '맞춤 가격', true],
    ['Priority access', '우선 액세스', true],
    ['Dedicated support', '전담 지원', true],
  ], { credit: 'Custom', rate: 'Highest', models: 'All + Fine-tuned' }, '대기업', 2),

  // Anthropic (2 tiers)
  t(S.anthropic, 'pay_as_you_go', '사용량 기반', 'Pay per use', 'Pay per use', [
    ['All Claude models', '모든 Claude 모델', true],
    ['API access', 'API 액세스', true],
    ['Email support', '이메일 지원', true],
  ], { credit: 'Pay per use', rate: 'Standard', models: 'All' }, '모든 규모', 0),

  t(S.anthropic, 'enterprise', '엔터프라이즈', 'Contact', 'Contact', [
    ['Volume discounts', '볼륨 할인', true],
    ['Priority support', '우선 지원', true],
    ['Custom terms', '맞춤 조건', true],
  ], { credit: 'Custom', rate: 'Higher', models: 'All + Beta' }, '대기업', 1),

  // Cloudinary (2 tiers)
  t(S.cloudinary, 'free', '무료', '$0', '$0', [
    ['25GB storage', '25GB 스토리지', true],
    ['25GB bandwidth', '25GB 전송량', true],
    ['Community support', '커뮤니티 지원', true],
  ], { storage: '25GB', bandwidth: '25GB/mo', transforms: '25K/mo' }, '개인 프로젝트', 0),

  t(S.cloudinary, 'plus', '플러스', '$99', '$1188', [
    ['104GB storage', '104GB 스토리지', true],
    ['166GB bandwidth', '166GB 전송량', true],
    ['Email support', '이메일 지원', true],
  ], { storage: '104GB', bandwidth: '166GB/mo', transforms: '100K/mo' }, '스타트업', 1),

  // Sentry (2 tiers)
  t(S.sentry, 'developer', '개발자', '$0', '$0', [
    ['5K events/month', '월 5천 이벤트', true],
    ['1 project', '1개 프로젝트', true],
    ['Community support', '커뮤니티 지원', true],
  ], { events: '5K/mo', projects: '1', retention: '30 days' }, '개인 프로젝트', 0),

  t(S.sentry, 'team', '팀', '$26', '$312', [
    ['50K events/month', '월 5만 이벤트', true],
    ['Unlimited projects', '무제한 프로젝트', true],
    ['Email support', '이메일 지원', true],
  ], { events: '50K/mo', projects: 'Unlimited', retention: '90 days' }, '팀', 1),

  // PlanetScale (2 tiers)
  // Hobby(무료)는 2024-04-08 폐지 — 신규 가입 불가. 기존 선택 이력 보존을 위해 행은 유지한다.
  t(S.planetscale, 'hobby', '취미 (2024년 폐지)', 'Discontinued', 'Discontinued', [
    ['5GB storage', '5GB 스토리지', false],
    ['1B rows read/mo', '월 10억 행 읽기', false],
    ['Community support', '커뮤니티 지원', false],
  ], { storage: '-', reads: '-', writes: '-' }, '신규 가입 불가 — PS-5 이상으로 이전 필요', 0),

  t(S.planetscale, 'scaler', '스케일러', '$29', '$348', [
    ['10GB storage', '10GB 스토리지', true],
    ['100B rows read/mo', '월 1000억 행 읽기', true],
    ['Email support', '이메일 지원', true],
  ], { storage: '10GB', reads: '100B/mo', writes: '50M/mo' }, '스타트업', 1),

  // Neon (2 tiers)
  t(S.neon, 'free', '무료', '$0', '$0', [
    ['3GB storage', '3GB 스토리지', true],
    ['1 project', '1개 프로젝트', true],
    ['Community support', '커뮤니티 지원', true],
  ], { storage: '3GB', compute: '100h/mo', projects: '1' }, '개인 프로젝트', 0),

  t(S.neon, 'pro', '프로', '$19', '$228', [
    ['Unlimited storage', '무제한 스토리지', true],
    ['Unlimited projects', '무제한 프로젝트', true],
    ['Email support', '이메일 지원', true],
  ], { storage: 'Unlimited', compute: 'Unlimited', projects: 'Unlimited' }, '스타트업', 1),

  // Railway (2 tiers)
  t(S.railway, 'trial', '트라이얼', '$0', '$0', [
    ['$5 credit', '$5 크레딧', true],
    ['512MB RAM', '512MB RAM', true],
    ['Community support', '커뮤니티 지원', true],
  ], { credit: '$5', memory: '512MB', cpu: 'Shared' }, '테스트용', 0),

  t(S.railway, 'pay_as_you_go', '사용량 기반', 'Pay per use', 'Pay per use', [
    ['Custom resources', '맞춤 리소스', true],
    ['Auto-scaling', '자동 확장', true],
    ['Email support', '이메일 지원', true],
  ], { credit: 'Pay per use', memory: 'Up to 32GB', cpu: 'Up to 32 vCPU' }, '모든 규모', 1),

  // Lemon Squeezy (2 tiers)
  t(S.lemonsqueezy, 'free', '무료', '$0', '$0', [
    ['5% + 50¢ per sale', '판매당 5% + 50¢', true],
    ['Basic features', '기본 기능', true],
    ['Email support', '이메일 지원', true],
  ], { fee: '5% + 50¢', products: 'Unlimited', subscriptions: 'Unlimited' }, '모든 규모', 0),

  t(S.lemonsqueezy, 'volume', '볼륨', 'Contact', 'Contact', [
    ['Lower fees', '낮은 수수료', true],
    ['Priority support', '우선 지원', true],
    ['Custom terms', '맞춤 조건', true],
  ], { fee: 'Custom', products: 'Unlimited', subscriptions: 'Unlimited' }, '대기업', 1),

  // Polar (2 tiers)
  t(S.polar, 'standard', '표준', '$0', '$0', [
    ['4% + 40¢ per transaction', '거래당 4% + 40¢', true],
    ['Digital products & subscriptions', '디지털 상품 및 구독', true],
    ['Global tax compliance (VAT/GST)', '글로벌 세금 준수 (VAT/GST)', true],
    ['License keys & file downloads', '라이선스 키 및 파일 다운로드', true],
    ['GitHub / Discord access grants', 'GitHub / Discord 접근 권한 부여', true],
  ], { fee: '4% + 40¢', products: 'Unlimited', subscriptions: 'Unlimited' }, '인디 개발자·오픈소스 프로젝트', 0),

  t(S.polar, 'volume', '볼륨', 'Contact', 'Contact', [
    ['Custom transaction fees', '맞춤 거래 수수료', true],
    ['Dedicated support', '전담 지원', true],
    ['Custom terms', '맞춤 조건', true],
  ], { fee: 'Custom', products: 'Unlimited', subscriptions: 'Unlimited' }, '대규모 비즈니스', 1),

  // UploadThing (2 tiers)
  t(S.uploadthing, 'free', '무료', '$0', '$0', [
    ['2GB storage', '2GB 스토리지', true],
    ['100 uploads/day', '일 100회 업로드', true],
    ['Community support', '커뮤니티 지원', true],
  ], { storage: '2GB', uploads: '100/day', bandwidth: '10GB/mo' }, '개인 프로젝트', 0),

  t(S.uploadthing, 'pro', '프로', '$10', '$120', [
    ['100GB storage', '100GB 스토리지', true],
    ['Unlimited uploads', '무제한 업로드', true],
    ['Email support', '이메일 지원', true],
  ], { storage: '100GB', uploads: 'Unlimited', bandwidth: '1TB/mo' }, '스타트업', 1),

  // PostHog (2 tiers)
  t(S.posthog, 'free', '무료', '$0', '$0', [
    ['1M events/month', '월 100만 이벤트', true],
    ['All features', '모든 기능', true],
    ['Community support', '커뮤니티 지원', true],
  ], { events: '1M/mo', retention: '7 days', sessions: 'Unlimited' }, '개인 프로젝트', 0),

  t(S.posthog, 'paid', '유료', 'Pay per use', 'Pay per use', [
    ['Unlimited events', '무제한 이벤트', true],
    ['Longer retention', '긴 보관 기간', true],
    ['Email support', '이메일 지원', true],
  ], { events: 'Pay per use', retention: '1 year', sessions: 'Unlimited' }, '스타트업', 1),

  // AWS S3 (2 tiers)
  t(S.awss3, 'free_tier', '프리 티어', '$0', '$0', [
    ['5GB storage', '5GB 스토리지', true],
    ['20K GET requests', '2만 GET 요청', true],
    ['12 months free', '12개월 무료', true],
  ], { storage: '5GB', gets: '20K/mo', puts: '2K/mo' }, '신규 사용자', 0),

  t(S.awss3, 'standard', '스탠다드', 'Pay per use', 'Pay per use', [
    ['Unlimited storage', '무제한 스토리지', true],
    ['Pay as you go', '사용량 기반', true],
    ['AWS support plans', 'AWS 지원 플랜', true],
  ], { storage: '$0.023/GB', gets: '$0.0004/1K', puts: '$0.005/1K' }, '모든 규모', 1),

  // GitHub Actions (2 tiers)
  t(S.github_actions, 'free', '무료', '$0', '$0', [
    ['2K minutes/month', '월 2천분', true],
    ['500MB storage', '500MB 스토리지', true],
    ['Public repos', '퍼블릭 저장소', true],
  ], { minutes: '2K/mo', storage: '500MB', concurrent: '20 jobs' }, '개인 프로젝트', 0),

  t(S.github_actions, 'pro', '프로', '$4', '$48', [
    ['3K minutes/month', '월 3천분', true],
    ['2GB storage', '2GB 스토리지', true],
    ['Private repos', '프라이빗 저장소', true],
  ], { minutes: '3K/mo', storage: '2GB', concurrent: '20 jobs' }, '전문가', 1),

  // Twilio (2 tiers)
  t(S.twilio, 'trial', '트라이얼', '$0', '$0', [
    ['$15 credit', '$15 크레딧', true],
    ['Test numbers', '테스트 번호', true],
    ['Basic features', '기본 기능', true],
  ], { credit: '$15', messages: 'Limited', calls: 'Limited' }, '테스트용', 0),

  t(S.twilio, 'pay_as_you_go', '사용량 기반', 'Pay per use', 'Pay per use', [
    ['All features', '모든 기능', true],
    ['Global coverage', '글로벌 커버리지', true],
    ['Email support', '이메일 지원', true],
  ], { credit: 'Pay per use', messages: '$0.0079/SMS', calls: '$0.0085/min' }, '모든 규모', 1),

  // OneSignal (2 tiers)
  t(S.onesignal, 'free', '무료', '$0', '$0', [
    ['Unlimited users', '무제한 사용자', true],
    ['Basic features', '기본 기능', true],
    ['Email support', '이메일 지원', true],
  ], { users: 'Unlimited', notifications: 'Unlimited', channels: 'All' }, '모든 규모', 0),

  t(S.onesignal, 'growth', '그로스', '$9', '$108', [
    ['Advanced features', '고급 기능', true],
    ['A/B testing', 'A/B 테스트', true],
    ['Priority support', '우선 지원', true],
  ], { users: 'Unlimited', notifications: 'Unlimited', channels: 'All + Advanced' }, '성장 기업', 1),

  // Algolia (2 tiers)
  t(S.algolia, 'free', '무료', '$0', '$0', [
    ['10K searches/month', '월 1만 검색', true],
    ['1M records', '100만 레코드', true],
    ['Community support', '커뮤니티 지원', true],
  ], { searches: '10K/mo', records: '1M', requests: '100K/mo' }, '개인 프로젝트', 0),

  t(S.algolia, 'grow', '그로우', '$0.50', 'Pay per use', [
    ['Pay per use', '사용량 기반', true],
    ['Unlimited records', '무제한 레코드', true],
    ['Email support', '이메일 지원', true],
  ], { searches: '$0.50/1K', records: 'Unlimited', requests: 'Unlimited' }, '스타트업', 1),

  // Sanity (2 tiers)
  t(S.sanity, 'free', '무료', '$0', '$0', [
    ['3 users', '3명 사용자', true],
    ['2 datasets', '2개 데이터셋', true],
    ['Community support', '커뮤니티 지원', true],
  ], { users: '3', datasets: '2', docs: '10K' }, '개인 프로젝트', 0),

  t(S.sanity, 'team', '팀', '$99', '$1188', [
    ['Unlimited users', '무제한 사용자', true],
    ['Unlimited datasets', '무제한 데이터셋', true],
    ['Email support', '이메일 지원', true],
  ], { users: 'Unlimited', datasets: 'Unlimited', docs: '1M' }, '팀', 1),

  // Google Analytics 4 (1 tier - free)
  t(S.ga4, 'free', '무료', '$0', '$0', [
    ['Unlimited events', '무제한 이벤트', true],
    ['All features', '모든 기능', true],
    ['Community support', '커뮤니티 지원', true],
  ], { events: 'Unlimited', properties: 'Unlimited', retention: '14 months' }, '모든 규모', 0),

  // Upstash Redis (2 tiers)
  t(S.upstash_redis, 'free', '무료', '$0', '$0', [
    ['10K commands/day', '일 1만 커맨드', true],
    ['256MB storage', '256MB 스토리지', true],
    ['Email support', '이메일 지원', true],
  ], { commands: '10K/day', storage: '256MB', databases: '1' }, '개인 프로젝트', 0),

  t(S.upstash_redis, 'pay_as_you_go', '사용량 기반', 'Pay per use', 'Pay per use', [
    ['Unlimited commands', '무제한 커맨드', true],
    ['Pay per use', '사용량 기반', true],
    ['Priority support', '우선 지원', true],
  ], { commands: '$0.2/100K', storage: '$0.25/GB', databases: 'Unlimited' }, '스타트업', 1),

  // Cloudflare (2 tiers)
  t(S.cloudflare, 'free', '무료', '$0', '$0', [
    ['Unlimited bandwidth', '무제한 전송량', true],
    ['Basic DDoS', '기본 DDoS', true],
    ['Community support', '커뮤니티 지원', true],
  ], { bandwidth: 'Unlimited', requests: 'Unlimited', ssl: 'Universal' }, '모든 규모', 0),

  t(S.cloudflare, 'pro', '프로', '$20', '$240', [
    ['Advanced DDoS', '고급 DDoS', true],
    ['WAF', 'WAF', true],
    ['Email support', '이메일 지원', true],
  ], { bandwidth: 'Unlimited', requests: 'Unlimited', ssl: 'Advanced' }, '비즈니스', 1),

  // Fly.io (2 tiers)
  t(S.flyio, 'free', '무료', '$0', '$0', [
    ['3 VMs', '3개 VM', true],
    ['160GB bandwidth', '160GB 전송량', true],
    ['Community support', '커뮤니티 지원', true],
  ], { vms: '3', bandwidth: '160GB/mo', storage: '3GB' }, '개인 프로젝트', 0),

  t(S.flyio, 'pay_as_you_go', '사용량 기반', 'Pay per use', 'Pay per use', [
    ['Unlimited VMs', '무제한 VM', true],
    ['Auto-scaling', '자동 확장', true],
    ['Email support', '이메일 지원', true],
  ], { vms: 'Pay per use', bandwidth: 'Pay per use', storage: 'Pay per use' }, '스타트업', 1),

  // Datadog (2 tiers)
  t(S.datadog, 'free', '무료', '$0', '$0', [
    ['5 hosts', '5개 호스트', true],
    ['1-day retention', '1일 보관', true],
    ['Community support', '커뮤니티 지원', true],
  ], { hosts: '5', retention: '1 day', metrics: 'Basic' }, '개인 프로젝트', 0),

  t(S.datadog, 'pro', '프로', '$15', '$180', [
    ['Unlimited hosts', '무제한 호스트', true],
    ['15-month retention', '15개월 보관', true],
    ['Email support', '이메일 지원', true],
  ], { hosts: 'Unlimited', retention: '15 months', metrics: 'Advanced' }, '팀', 1),

  // Mixpanel (2 tiers)
  t(S.mixpanel, 'free', '무료', '$0', '$0', [
    ['100K events/month', '월 10만 이벤트', true],
    ['90-day retention', '90일 보관', true],
    ['Email support', '이메일 지원', true],
  ], { events: '100K/mo', retention: '90 days', users: 'Unlimited' }, '개인 프로젝트', 0),

  t(S.mixpanel, 'growth', '그로스', '$25', '$300', [
    ['1M events/month', '월 100만 이벤트', true],
    ['1-year retention', '1년 보관', true],
    ['Priority support', '우선 지원', true],
  ], { events: '1M/mo', retention: '1 year', users: 'Unlimited' }, '스타트업', 1),

  // Contentful (2 tiers)
  t(S.contentful, 'free', '무료', '$0', '$0', [
    ['2 users', '2명 사용자', true],
    ['25K records', '2.5만 레코드', true],
    ['Community support', '커뮤니티 지원', true],
  ], { users: '2', records: '25K', locales: '2' }, '개인 프로젝트', 0),

  t(S.contentful, 'team', '팀', '$489', '$5868', [
    ['5 users', '5명 사용자', true],
    ['75K records', '7.5만 레코드', true],
    ['Email support', '이메일 지원', true],
  ], { users: '5', records: '75K', locales: 'Unlimited' }, '팀', 1),

  // Meilisearch (1 tier - OSS)
  t(S.meilisearch, 'free', '무료', '$0', '$0', [
    ['Self-hosted', '셀프 호스팅', true],
    ['Open source', '오픈 소스', true],
    ['Community support', '커뮤니티 지원', true],
  ], { docs: 'Unlimited', searches: 'Unlimited', cost: 'Infrastructure only' }, '모든 규모', 0),

  // Pusher (2 tiers)
  t(S.pusher, 'free', '무료', '$0', '$0', [
    ['100 connections', '100 연결', true],
    ['200K messages/day', '일 20만 메시지', true],
    ['Community support', '커뮤니티 지원', true],
  ], { connections: '100', messages: '200K/day', channels: 'Unlimited' }, '개인 프로젝트', 0),

  t(S.pusher, 'startup', '스타트업', '$49', '$588', [
    ['500 connections', '500 연결', true],
    ['Unlimited messages', '무제한 메시지', true],
    ['Email support', '이메일 지원', true],
  ], { connections: '500', messages: 'Unlimited', channels: 'Unlimited' }, '스타트업', 1),

  // Trigger.dev (2 tiers)
  t(S.trigger_dev, 'free', '무료', '$0', '$0', [
    ['100K runs/month', '월 10만 실행', true],
    ['Community support', '커뮤니티 지원', true],
    ['Basic features', '기본 기능', true],
  ], { runs: '100K/mo', concurrency: '10', retention: '30 days' }, '개인 프로젝트', 0),

  t(S.trigger_dev, 'pro', '프로', '$50', '$600', [
    ['1M runs/month', '월 100만 실행', true],
    ['Email support', '이메일 지원', true],
    ['Advanced features', '고급 기능', true],
  ], { runs: '1M/mo', concurrency: '100', retention: '90 days' }, '스타트업', 1),

  // LaunchDarkly (2 tiers)
  t(S.launchdarkly, 'starter', '스타터', '$10', '$120', [
    ['1K MAU', '월 1천 사용자', true],
    ['10 projects', '10개 프로젝트', true],
    ['Email support', '이메일 지원', true],
  ], { mau: '1K', projects: '10', flags: 'Unlimited' }, '스타트업', 0),

  t(S.launchdarkly, 'pro', '프로', '$20', '$240', [
    ['10K MAU', '월 1만 사용자', true],
    ['Unlimited projects', '무제한 프로젝트', true],
    ['Priority support', '우선 지원', true],
  ], { mau: '10K', projects: 'Unlimited', flags: 'Unlimited' }, '성장 기업', 1),

  // Groq (2 tiers)
  t(S.groq, 'free', '무료', '$0', '$0', [
    ['14.4K requests/day', '일 1.44만 요청', true],
    ['All models', '모든 모델', true],
    ['Community support', '커뮤니티 지원', true],
  ], { requests: '14.4K/day', tokens: '400M/mo', rate: 'Standard' }, '개인 프로젝트', 0),

  t(S.groq, 'pay_as_you_go', '사용량 기반', 'Pay per use', 'Pay per use', [
    ['Unlimited requests', '무제한 요청', true],
    ['Higher rate limits', '높은 속도 제한', true],
    ['Email support', '이메일 지원', true],
  ], { requests: 'Unlimited', tokens: 'Pay per use', rate: 'Higher' }, '스타트업', 1),

  // Render (2 tiers)
  t(S.render, 'free', '무료', '$0', '$0', [
    ['750h compute/month', '월 750시간', true],
    ['Basic features', '기본 기능', true],
    ['Community support', '커뮤니티 지원', true],
  ], { compute: '750h/mo', bandwidth: '100GB', services: 'Unlimited' }, '개인 프로젝트', 0),

  t(S.render, 'starter', '스타터', '$7', '$84', [
    ['Always-on', '상시 가동', true],
    ['Unlimited bandwidth', '무제한 전송량', true],
    ['Email support', '이메일 지원', true],
  ], { compute: 'Always-on', bandwidth: 'Unlimited', services: 'Unlimited' }, '스타트업', 1),

  // LogRocket (2 tiers)
  t(S.logrocket, 'free', '무료', '$0', '$0', [
    ['1K sessions/month', '월 1천 세션', true],
    ['30-day retention', '30일 보관', true],
    ['Community support', '커뮤니티 지원', true],
  ], { sessions: '1K/mo', retention: '30 days', seats: '3' }, '개인 프로젝트', 0),

  t(S.logrocket, 'team', '팀', '$99', '$1188', [
    ['10K sessions/month', '월 1만 세션', true],
    ['1-year retention', '1년 보관', true],
    ['Email support', '이메일 지원', true],
  ], { sessions: '10K/mo', retention: '1 year', seats: '10' }, '팀', 1),

  // Playwright (1 tier - OSS)
  t(S.playwright, 'free', '무료', '$0', '$0', [
    ['Self-hosted', '셀프 호스팅', true],
    ['Open source', '오픈 소스', true],
    ['Community support', '커뮤니티 지원', true],
  ], { tests: 'Unlimited', browsers: 'All', cost: 'Free' }, '모든 규모', 0),

  // Slack API (2 tiers)
  t(S.slack_api, 'free', '무료', '$0', '$0', [
    ['10K messages', '1만 메시지', true],
    ['10 integrations', '10개 통합', true],
    ['Community support', '커뮤니티 지원', true],
  ], { messages: '10K history', integrations: '10', storage: '5GB' }, '개인 프로젝트', 0),

  t(S.slack_api, 'pro', '프로', '$7.25', '$87', [
    ['Unlimited messages', '무제한 메시지', true],
    ['Unlimited integrations', '무제한 통합', true],
    ['Priority support', '우선 지원', true],
  ], { messages: 'Unlimited', integrations: 'Unlimited', storage: 'Unlimited' }, '팀', 1),

  // Discord API (1 tier - free)
  t(S.discord_api, 'free', '무료', '$0', '$0', [
    ['Free API access', '무료 API', true],
    ['Rate limits', '속도 제한', true],
    ['Community support', '커뮤니티 지원', true],
  ], { requests: 'Rate limited', webhooks: 'Unlimited', bots: 'Unlimited' }, '모든 규모', 0),

  // Mapbox (2 tiers)
  t(S.mapbox, 'free', '무료', '$0', '$0', [
    ['50K loads/month', '월 5만 로드', true],
    ['Basic maps', '기본 지도', true],
    ['Community support', '커뮤니티 지원', true],
  ], { loads: '50K/mo', requests: '100K/mo', storage: '50MB' }, '개인 프로젝트', 0),

  t(S.mapbox, 'pay_as_you_go', '사용량 기반', 'Pay per use', 'Pay per use', [
    ['Unlimited loads', '무제한 로드', true],
    ['All features', '모든 기능', true],
    ['Email support', '이메일 지원', true],
  ], { loads: '$5/1K', requests: 'Pay per use', storage: 'Pay per use' }, '스타트업', 1),

  // ElevenLabs (2 tiers)
  t(S.elevenlabs, 'free', '무료', '$0', '$0', [
    ['10K characters/month', '월 1만 글자', true],
    ['3 voices', '3개 음성', true],
    ['Community support', '커뮤니티 지원', true],
  ], { characters: '10K/mo', voices: '3', quality: 'Standard' }, '개인 프로젝트', 0),

  t(S.elevenlabs, 'starter', '스타터', '$6', '$72', [
    ['30K characters/month', '월 3만 글자', true],
    ['10 voices', '10개 음성', true],
    ['Email support', '이메일 지원', true],
  ], { characters: '30K/mo', voices: '10', quality: 'High' }, '크리에이터', 1),

  // Inngest (2 tiers)
  t(S.inngest, 'free', '무료', '$0', '$0', [
    ['25K runs/month', '월 2.5만 실행', true],
    ['Community support', '커뮤니티 지원', true],
    ['Basic features', '기본 기능', true],
  ], { runs: '25K/mo', concurrency: '10', retention: '7 days' }, '개인 프로젝트', 0),

  t(S.inngest, 'pro', '프로', '$99', '$1188', [
    ['500K runs/month', '월 50만 실행', true],
    ['Email support', '이메일 지원', true],
    ['Advanced features', '고급 기능', true],
  ], { runs: '500K/mo', concurrency: '50', retention: '30 days' }, '스타트업', 1),

  // Strapi (1 tier - OSS)
  t(S.strapi, 'free', '무료', '$0', '$0', [
    ['Self-hosted', '셀프 호스팅', true],
    ['Open source', '오픈 소스', true],
    ['Community support', '커뮤니티 지원', true],
  ], { users: 'Unlimited', content: 'Unlimited', cost: 'Infrastructure only' }, '모든 규모', 0),

  // Plausible (2 tiers)
  t(S.plausible, 'growth', '그로스', '$14', '$168', [
    ['10K pageviews/month', '월 1만 페이지뷰', true],
    ['Privacy-focused', '프라이버시 중심', true],
    ['Email support', '이메일 지원', true],
  ], { pageviews: '10K/mo', sites: '50', retention: 'Forever' }, '개인 프로젝트', 0),

  t(S.plausible, 'business', '비즈니스', '$19', '$228', [
    ['100K pageviews/month', '월 10만 페이지뷰', true],
    ['Priority support', '우선 지원', true],
    ['All features', '모든 기능', true],
  ], { pageviews: '100K/mo', sites: 'Unlimited', retention: 'Forever' }, '비즈니스', 1),

  // Cypress (1 tier - OSS)
  t(S.cypress, 'free', '무료', '$0', '$0', [
    ['Self-hosted', '셀프 호스팅', true],
    ['Open source', '오픈 소스', true],
    ['Community support', '커뮤니티 지원', true],
  ], { tests: 'Unlimited', browsers: 'All', cost: 'Free' }, '모든 규모', 0),

  // BullMQ (1 tier - OSS)
  t(S.bullmq, 'free', '무료', '$0', '$0', [
    ['Self-hosted', '셀프 호스팅', true],
    ['Open source', '오픈 소스', true],
    ['Community support', '커뮤니티 지원', true],
  ], { jobs: 'Unlimited', queues: 'Unlimited', cost: 'Redis hosting only' }, '모든 규모', 0),

  // Shopify API (2 tiers)
  t(S.shopify_api, 'basic', '베이직', '$25', '$228', [
    ['API access', 'API 액세스', true],
    ['2 staff accounts', '2명 직원', true],
    ['Email support', '이메일 지원', true],
  ], { requests: 'Rate limited', apps: 'Unlimited', orders: 'Unlimited' }, '소규모 상점', 0),

  t(S.shopify_api, 'shopify', '쇼피파이', '$105', '$1260', [
    ['Higher rate limits', '높은 속도 제한', true],
    ['5 staff accounts', '5명 직원', true],
    ['Priority support', '우선 지원', true],
  ], { requests: 'Higher limits', apps: 'Unlimited', orders: 'Unlimited' }, '성장 상점', 1),

  // Namecheap (1 tier - Basic Registration)
  t(S.namecheap, 'standard', '표준', '$0.54', '$6.49', [
    ['Domain registration', '도메인 등록', true],
    ['Free WHOIS privacy', '무료 WHOIS 프라이버시', true],
    ['Free DNS management', '무료 DNS 관리', true],
    ['Domain transfer', '도메인 이전', true],
  ], { domains: 'Unlimited', subdomains: 'Unlimited', nameservers: 'Unlimited' }, '모든 규모', 0),

  // Cloudflare Registrar (1 tier - No Markup)
  t(S.cloudflare_registrar, 'standard', '표준', '$0.87', '$10.46', [
    ['No markup pricing', '마크업 없는 가격', true],
    ['Integrated DNS', '통합 DNS', true],
    ['Free DNSSEC', '무료 DNSSEC', true],
    ['Auto-renewal', '자동 갱신', true],
  ], { domains: 'Unlimited', api: 'Available', uptime: '99.99%' }, '모든 규모', 0),

  // GoDaddy (3 tiers - Based on renewal rates)
  t(S.godaddy, 'promo', '프로모션', '$0.01', '$0.01', [
    ['Domain registration (1st year)', '도메인 등록(첫해)', true],
    ['WHOIS privacy (optional)', 'WHOIS 프라이버시(선택)', false],
    ['Email forwarding', '이메일 포워딩', true],
  ], { domains: 'Unlimited', nameservers: '5', renewal: 'Higher rate' }, '신규 등록', 0),

  t(S.godaddy, 'standard', '표준', '$1.58', '$18.99', [
    ['Domain renewal', '도메인 갱신', true],
    ['WHOIS privacy', 'WHOIS 프라이버시', false],
    ['Full DNS control', '전체 DNS 제어', true],
  ], { domains: 'Unlimited', nameservers: '5', autorenew: 'Optional' }, '갱신 시', 1),

  t(S.godaddy, 'premium', '프리미엄', '$5', '$60', [
    ['Premium domain', '프리미엄 도메인', true],
    ['Priority support', '우선 지원', true],
    ['Brand protection', '브랜드 보호', true],
  ], { domains: 'Premium only', bidding: 'Available', auction: 'Eligible' }, '프리미엄', 2),

  // Gabia (1 tier - Standard Registration)
  t(S.gabia, 'standard', '표준', '$1', '$12', [
    ['Domain registration', '도메인 등록', true],
    ['Free DNS management', '무료 DNS 관리', true],
    ['WHOIS privacy', 'WHOIS 프라이버시', true],
    ['Free email forwarding', '무료 이메일 포워딩', true],
  ], { domains: 'Unlimited', subdomains: 'Unlimited', nameservers: 'Unlimited' }, '모든 규모', 0),

  // HostingKR (1 tier - Standard Registration)
  t(S.hosting_kr, 'standard', '표준', '$0.83', '$10', [
    ['Domain registration', '도메인 등록', true],
    ['Free DNS management', '무료 DNS 관리', true],
    ['WHOIS privacy', 'WHOIS 프라이버시', true],
    ['Email service', '이메일 서비스', true],
  ], { domains: 'Unlimited', subdomains: 'Unlimited', nameservers: 'Unlimited' }, '모든 규모', 0),

  // DotName (1 tier - Free Hosting Included)
  t(S.dotname, 'free_hosting', '무료 호스팅 포함', '$0.83', '$10', [
    ['Domain registration', '도메인 등록', true],
    ['Free web hosting', '무료 웹 호스팅', true],
    ['Free DNS management', '무료 DNS 관리', true],
    ['Free SSL certificate', '무료 SSL 인증서', true],
  ], { domains: 'Unlimited', bandwidth: '100GB', storage: '10GB' }, '모든 규모', 0),

  // =======================================================================
  // AI Services - Phase 5
  // =======================================================================

  // Grok (2 tiers)
  t(S.grok, 'free', '무료', '$0', '$0', [
    ['$25 free credit', '$25 무료 크레딧', true],
    ['Rate limited', '속도 제한', true],
    ['Community support', '커뮤니티 지원', true],
  ], { credit: '$25', rate_limit: 'Standard' }, '개인 개발자', 0),
  t(S.grok, 'pay_as_you_go', '종량제', 'Pay as you go', 'Pay as you go', [
    ['All Grok models', '모든 Grok 모델', true],
    ['Web/X search tools', '웹/X 검색 도구', true],
    ['Higher rate limits', '높은 속도 제한', true],
  ], { input: '$0.20/1M tokens', output: '$0.50/1M tokens' }, '스타트업', 1),

  // Mistral AI (2 tiers)
  t(S.mistral, 'pay_as_you_go', '종량제', 'Pay as you go', 'Pay as you go', [
    ['All models (Nemo~Large)', '모든 모델 (Nemo~Large)', true],
    ['API access', 'API 접근', true],
    ['Email support', '이메일 지원', true],
  ], { nemo: '$0.02/1M', large: '$0.50/$1.50/1M' }, '개인/스타트업', 0),
  t(S.mistral, 'enterprise', '엔터프라이즈', 'Contact', 'Contact', [
    ['Custom deployment', '맞춤 배포', true],
    ['On-premises option', '온프레미스 옵션', true],
    ['Dedicated support', '전담 지원', true],
  ], { models: 'Custom', support: 'Dedicated' }, '대기업', 1),

  // Cohere (3 tiers)
  t(S.cohere, 'trial', '체험', '$0', '$0', [
    ['Rate-limited API access', '속도 제한 API 접근', true],
    ['All models', '모든 모델', true],
    ['Community support', '커뮤니티 지원', true],
  ], { rate_limit: 'Trial limits' }, '개인 개발자', 0),
  t(S.cohere, 'production', '프로덕션', 'Pay as you go', 'Pay as you go', [
    ['Full API access', '전체 API 접근', true],
    ['Higher rate limits', '높은 속도 제한', true],
    ['Email support', '이메일 지원', true],
  ], { command_r_plus: '$2.50/$10/1M', embed: '$0.10/1M' }, '스타트업', 1),
  t(S.cohere, 'enterprise', '엔터프라이즈', 'Contact', 'Contact', [
    ['On-premises deployment', '온프레미스 배포', true],
    ['Fine-tuning', '파인튜닝', true],
    ['Dedicated support', '전담 지원', true],
  ], { deployment: 'Custom', support: 'Dedicated' }, '대기업', 2),

  // DeepSeek (2 tiers)
  t(S.deepseek, 'standard', '표준', 'Pay as you go', 'Pay as you go', [
    ['V3 model access', 'V3 모델 접근', true],
    ['R1 reasoning model', 'R1 추론 모델', true],
    ['Standard rate limits', '표준 속도 제한', true],
  ], { v3_input: '$0.14/1M', r1_input: '$0.55/1M' }, '개인/스타트업', 0),
  t(S.deepseek, 'off_peak', '오프피크', 'Pay as you go', 'Pay as you go', [
    ['Up to 75% discount', '최대 75% 할인', true],
    ['Off-peak hours', '오프피크 시간대', true],
    ['Same models', '동일 모델', true],
  ], { discount: 'Up to 75%' }, '비용 최적화', 1),

  // Perplexity (2 tiers)
  t(S.perplexity, 'sonar', 'Sonar', 'Pay as you go', 'Pay as you go', [
    ['Web search integration', '웹 검색 통합', true],
    ['Citation-based answers', '인용 기반 답변', true],
    ['Standard model', '표준 모델', true],
  ], { input: '$1/1M', output: '$1/1M' }, '개인 개발자', 0),
  t(S.perplexity, 'sonar_pro', 'Sonar Pro', 'Pay as you go', 'Pay as you go', [
    ['Advanced web search', '고급 웹 검색', true],
    ['Higher accuracy', '높은 정확도', true],
    ['Pro model', 'Pro 모델', true],
  ], { input: '$3/1M', output: '$15/1M' }, '프로덕션', 1),

  // Midjourney (4 tiers)
  t(S.midjourney, 'basic', '베이직', '$10', '$96', [
    ['~200 images/month', '월 ~200 이미지', true],
    ['Standard queue', '표준 큐', true],
    ['Community gallery', '커뮤니티 갤러리', true],
  ], { images: '~200/month', fast_hours: '3.3h/month' }, '개인', 0),
  t(S.midjourney, 'standard', '스탠다드', '$30', '$288', [
    ['Unlimited relaxed', '무제한 리팩스', true],
    ['15h fast generation', '15시간 빠른 생성', true],
    ['Stealth mode', '스텔스 모드', false],
  ], { fast_hours: '15h/month', relax: 'Unlimited' }, '크리에이터', 1),
  t(S.midjourney, 'pro', '프로', '$60', '$576', [
    ['30h fast generation', '30시간 빠른 생성', true],
    ['Stealth mode', '스텔스 모드', true],
    ['12x concurrent jobs', '12배 동시 작업', true],
  ], { fast_hours: '30h/month', concurrent: '12 jobs' }, '전문가', 2),
  t(S.midjourney, 'mega', '메가', '$120', '$1152', [
    ['60h fast generation', '60시간 빠른 생성', true],
    ['Stealth mode', '스텔스 모드', true],
    ['12x concurrent jobs', '12배 동시 작업', true],
  ], { fast_hours: '60h/month', concurrent: '12 jobs' }, '팀/에이전시', 3),

  // Runway ML (3 tiers)
  t(S.runway_ml, 'free', '무료', '$0', '$0', [
    ['Trial credits', '체험 크레딧', true],
    ['Basic models', '기본 모델', true],
    ['Watermark', '워터마크', true],
  ], { credits: 'Trial' }, '체험', 0),
  t(S.runway_ml, 'standard', '스탠다드', '$15', '$144', [
    ['625 credits/month', '월 625 크레딧', true],
    ['Gen-4 access', 'Gen-4 접근', true],
    ['No watermark', '워터마크 없음', true],
  ], { credits: '625/month' }, '크리에이터', 1),
  t(S.runway_ml, 'pro', '프로', '$35', '$336', [
    ['2250 credits/month', '월 2250 크레딧', true],
    ['All models', '모든 모델', true],
    ['Priority queue', '우선 큐', true],
  ], { credits: '2250/month' }, '전문가', 2),

  // Deepgram (2 tiers)
  t(S.deepgram, 'free', '무료', '$0', '$0', [
    ['$200 free credit', '$200 무료 크레딧', true],
    ['All models', '모든 모델', true],
    ['Community support', '커뮤니티 지원', true],
  ], { credit: '$200' }, '개인 개발자', 0),
  t(S.deepgram, 'pay_as_you_go', '종량제', 'Pay as you go', 'Pay as you go', [
    ['Nova-3 model', 'Nova-3 모델', true],
    ['Per-second billing', '초 단위 과금', true],
    ['Email support', '이메일 지원', true],
  ], { price: '$0.0043/min', billing: 'Per-second' }, '스타트업', 1),

  // AssemblyAI (2 tiers)
  t(S.assemblyai, 'free', '무료', '$0', '$0', [
    ['Trial credits', '체험 크레딧', true],
    ['All features', '모든 기능', true],
    ['Community support', '커뮤니티 지원', true],
  ], { credit: 'Trial' }, '개인 개발자', 0),
  t(S.assemblyai, 'pay_as_you_go', '종량제', 'Pay as you go', 'Pay as you go', [
    ['Universal-2 model', 'Universal-2 모델', true],
    ['Streaming STT', '스트리밍 STT', true],
    ['Domain specialization', '도메인 특화', true],
  ], { price: '$0.15/hour', streaming: '$0.40/hour' }, '스타트업', 1),

  // Windsurf/Codeium (2 tiers)
  t(S.windsurf, 'free', '무료', '$0', '$0', [
    ['Unlimited autocomplete', '무제한 자동 완성', true],
    ['Basic chat', '기본 채팅', true],
    ['Community support', '커뮤니티 지원', true],
  ], { autocomplete: 'Unlimited' }, '개인 개발자', 0),
  t(S.windsurf, 'pro', '프로', '$20', '$240', [
    ['Advanced agent mode', '고급 에이전트 모드', true],
    ['All features', '모든 기능', true],
    ['Priority support', '우선 지원', true],
  ], { features: 'All' }, '전문가', 1),

  // Weaviate (3 tiers)
  t(S.weaviate, 'open_source', '오픈소스', '$0', '$0', [
    ['Self-hosted', '자체 호스팅', true],
    ['All features', '모든 기능', true],
    ['Community support', '커뮤니티 지원', true],
  ], { hosting: 'Self-managed' }, '개인/팀', 0),
  t(S.weaviate, 'cloud', '클라우드', '$25', '$240', [
    ['Managed hosting', '관리형 호스팅', true],
    ['Auto-scaling', '자동 스케일링', true],
    ['Email support', '이메일 지원', true],
  ], { hosting: 'Managed' }, '스타트업', 1),
  t(S.weaviate, 'enterprise', '엔터프라이즈', 'Contact', 'Contact', [
    ['Dedicated cluster', '전용 클러스터', true],
    ['SLA', 'SLA', true],
    ['Dedicated support', '전담 지원', true],
  ], { hosting: 'Dedicated' }, '대기업', 2),

  // Qdrant (3 tiers)
  t(S.qdrant, 'free', '무료', '$0', '$0', [
    ['1GB free cluster', '1GB 무료 클러스터', true],
    ['All features', '모든 기능', true],
    ['Community support', '커뮤니티 지원', true],
  ], { storage: '1GB' }, '프로토타이핑', 0),
  t(S.qdrant, 'cloud', '클라우드', '$25', '$240', [
    ['Managed cluster', '관리형 클러스터', true],
    ['Auto-scaling', '자동 스케일링', true],
    ['Email support', '이메일 지원', true],
  ], { storage: 'Pay per use' }, '스타트업', 1),
  t(S.qdrant, 'enterprise', '엔터프라이즈', 'Contact', 'Contact', [
    ['Dedicated infrastructure', '전용 인프라', true],
    ['SLA', 'SLA', true],
    ['Dedicated support', '전담 지원', true],
  ], { storage: 'Custom' }, '대기업', 2),

  // Dify (3 tiers)
  t(S.dify, 'sandbox', '샌드박스', '$0', '$0', [
    ['200 messages', '200 메시지', true],
    ['Basic models', '기본 모델', true],
    ['Community support', '커뮤니티 지원', true],
  ], { messages: '200' }, '체험', 0),
  t(S.dify, 'professional', '프로페셔널', '$59', '$564', [
    ['5,000 messages/month', '월 5,000 메시지', true],
    ['All models', '모든 모델', true],
    ['Email support', '이메일 지원', true],
  ], { messages: '5,000/month' }, '스타트업', 1),
  t(S.dify, 'team', '팀', '$159', '$1524', [
    ['Unlimited messages', '무제한 메시지', true],
    ['Team collaboration', '팀 협업', true],
    ['Priority support', '우선 지원', true],
  ], { messages: 'Unlimited', team: 'Unlimited' }, '팀', 2),

  // Together AI (2 tiers)
  t(S.together_ai, 'free', '무료', '$0', '$0', [
    ['$5 free credit', '$5 무료 크레딧', true],
    ['200+ models', '200개 이상 모델', true],
    ['Community support', '커뮤니티 지원', true],
  ], { credit: '$5' }, '개인 개발자', 0),
  t(S.together_ai, 'pay_as_you_go', '종량제', 'Pay as you go', 'Pay as you go', [
    ['All models', '모든 모델', true],
    ['Sub-100ms latency', '100ms 미만 지연', true],
    ['Email support', '이메일 지원', true],
  ], { pricing: 'Per token (model-based)' }, '스타트업', 1),

  // Modal (2 tiers)
  t(S.modal, 'free', '무료', '$0', '$0', [
    ['$30/month free compute', '월 $30 무료 컴퓨트', true],
    ['GPU access', 'GPU 접근', true],
    ['Community support', '커뮤니티 지원', true],
  ], { credit: '$30/month' }, '개인 개발자', 0),
  t(S.modal, 'pay_as_you_go', '종량제', 'Pay as you go', 'Pay as you go', [
    ['Per-second GPU billing', '초 단위 GPU 과금', true],
    ['All GPU types', '모든 GPU 타입', true],
    ['Email support', '이메일 지원', true],
  ], { billing: 'Per-second', gpu: 'All types' }, '팀/기업', 1),

  // Weights & Biases (3 tiers)
  t(S.wandb, 'free', '무료', '$0', '$0', [
    ['100GB storage', '100GB 스토리지', true],
    ['Personal projects', '개인 프로젝트', true],
    ['Community support', '커뮤니티 지원', true],
  ], { storage: '100GB', team: '1' }, '개인 개발자', 0),
  t(S.wandb, 'pro', '프로', '$60', '$576', [
    ['Advanced features', '고급 기능', true],
    ['Team collaboration', '팀 협업', true],
    ['Email support', '이메일 지원', true],
  ], { storage: '1TB', team: 'Unlimited' }, '팀', 1),
  t(S.wandb, 'enterprise', '엔터프라이즈', 'Contact', 'Contact', [
    ['Custom storage', '맞춤 스토리지', true],
    ['SSO/SAML', 'SSO/SAML', true],
    ['Dedicated support', '전담 지원', true],
  ], { storage: 'Custom', support: 'Dedicated' }, '대기업', 2),

  // ---------------------------------------------------------------------------
  // 2026-07 신규 등록 서비스 요금제 (공식 가격 페이지 기준)
  // ---------------------------------------------------------------------------
  // Zed (3 tiers)
  t(S.zed, 'personal', 'Personal', '$0', '$0', [['Personal: $0/월', 'Personal: $0/월', true]], {}, '무료 시작', 0),
  t(S.zed, 'pro', 'Pro', '$10', '$120', [['Pro: $10/월', 'Pro: $10/월', true]], {}, '', 1),
  t(S.zed, 'business', 'Business', '$30', '$360', [['Business: $30/좌석/월', 'Business: $30/좌석/월', true]], {}, '', 2),

  // Kiro (5 tiers)
  t(S.kiro, 'free', 'Free', '$0', '$0', [['Free: $0', 'Free: $0', true]], {}, '무료 시작', 0),
  t(S.kiro, 'pro', 'Pro', '$20', '$240', [['Pro: $20/월 (1,000 크레딧)', 'Pro: $20/월 (1,000 크레딧)', true]], {}, '', 1),
  t(S.kiro, 'pro_plus', 'Pro+', '$40', '$480', [['Pro+: $40/월 (2,000 크레딧)', 'Pro+: $40/월 (2,000 크레딧)', true]], {}, '', 2),
  t(S.kiro, 'pro_max', 'Pro Max', '$100', '$1,200', [['Pro Max: $100/월 (5,000 크레딧)', 'Pro Max: $100/월 (5,000 크레딧)', true]], {}, '', 3),
  t(S.kiro, 'power', 'Power', '$200', '$2,400', [['Power: $200/월 (10,000 크레딧)', 'Power: $200/월 (10,000 크레딧)', true]], {}, '', 4),

  // Google Jules (3 tiers)
  t(S.google_jules, 'free', 'Free', '$0', '$0', [['Free: $0', 'Free: $0', true]], {}, '무료 시작', 0),
  t(S.google_jules, 'google_ai_pro', 'Google AI Pro', '$19.99', '$239.88', [['Google AI Pro: $19.99/월 (5배 한도)', 'Google AI Pro: $19.99/월 (5배 한도)', true]], {}, '', 1),
  t(S.google_jules, 'google_ai_ultra', 'Google AI Ultra', '$124.99', '$1,499.88', [['Google AI Ultra: $124.99/월 (20배 한도)', 'Google AI Ultra: $124.99/월 (20배 한도)', true]], {}, '', 2),

  // Trae (5 tiers)
  t(S.trae, 'free', 'Free', '$0', '$0', [['Free: $0', 'Free: $0', true]], {}, '무료 시작', 0),
  t(S.trae, 'lite', 'Lite', '$3', '$36', [['Lite: $3/월', 'Lite: $3/월', true]], {}, '', 1),
  t(S.trae, 'pro', 'Pro', '$10', '$120', [['Pro: $10/월', 'Pro: $10/월', true]], {}, '', 2),
  t(S.trae, 'pro_plus', 'Pro+', '$30', '$360', [['Pro+: $30/월', 'Pro+: $30/월', true]], {}, '', 3),
  t(S.trae, 'ultra', 'Ultra', '$100', '$1,200', [['Ultra: $100/월', 'Ultra: $100/월', true]], {}, '', 4),

  // Warp (4 tiers)
  t(S.warp, 'free', 'Free', '$0', '$0', [['Free: $0', 'Free: $0', true]], {}, '무료 시작', 0),
  t(S.warp, 'build', 'Build', '$20', '$240', [['Build: $20/월', 'Build: $20/월', true]], {}, '', 1),
  t(S.warp, 'max', 'Max', '$200', '$2,400', [['Max: $200/월', 'Max: $200/월', true]], {}, '', 2),
  t(S.warp, 'business', 'Business', '$50', '$600', [['Business: $50/사용자/월', 'Business: $50/사용자/월', true]], {}, '', 3),

  // Aider (1 tiers)
  t(S.aider, 'open_source', 'Open Source', '$0', '$0', [['Open Source: $0', 'Open Source: $0', true]], {}, '무료 시작', 0),

  // OpenAI Codex (4 tiers)
  t(S.openai_codex, 'go', 'Go', '$8', '$96', [['Go: $8/월', 'Go: $8/월', true]], {}, '', 0),
  t(S.openai_codex, 'plus', 'Plus', '$20', '$240', [['Plus: $20/월', 'Plus: $20/월', true]], {}, '', 1),
  t(S.openai_codex, 'pro', 'Pro', '$100', '$1,200', [['Pro: $100-200/월', 'Pro: $100-200/월', true]], {}, '', 2),
  t(S.openai_codex, 'business', 'Business', '$20', '$240', [['Business: $20-25/사용자/월', 'Business: $20-25/사용자/월', true]], {}, '', 3),

  // Cerebras Inference (4 tiers)
  t(S.cerebras, 'free', 'Free', '$0', '$0', [['Free: $0', 'Free: $0', true]], {}, '무료 시작', 0),
  t(S.cerebras, 'pay_as_you_go', 'Pay-as-you-go', '$0.50', '$6', [['Pay-as-you-go: $0.50-1.50/백만 토큰', 'Pay-as-you-go: $0.50-1.50/백만 토큰', true]], {}, '', 1),
  t(S.cerebras, 'code_pro', 'Code Pro', '$50', '$600', [['Code Pro: $50/월', 'Code Pro: $50/월', true]], {}, '', 2),
  t(S.cerebras, 'code_max', 'Code Max', '$200', '$2,400', [['Code Max: $200/월', 'Code Max: $200/월', true]], {}, '', 3),

  // SambaNova Cloud (2 tiers)
  t(S.sambanova, 'free_developer', 'Free/Developer', '$0', '$0', [['Free/Developer: $0', 'Free/Developer: $0', true]], {}, '무료 시작', 0),
  t(S.sambanova, 'pay_as_you_go', 'Pay-as-you-go', '모델별 백만 토큰당 $0.10~', '모델별 백만 토큰당 $0.10~', [['Pay-as-you-go: 모델별 백만 토큰당 $0.10~', 'Pay-as-you-go: 모델별 백만 토큰당 $0.10~', true]], {}, '공식 문의', 1),

  // Vercel AI SDK (1 tiers)
  t(S.vercel_ai_sdk, 'open_source', 'Open Source', '$0', '$0', [['Open Source: $0', 'Open Source: $0', true]], {}, '무료 시작', 0),

  // LangGraph (3 tiers)
  t(S.langgraph, 'developer', 'Developer', '$0', '$0', [['Developer: $0', 'Developer: $0', true]], {}, '무료 시작', 0),
  t(S.langgraph, 'plus', 'Plus', '$39', '$468', [['Plus: $39/월~', 'Plus: $39/월~', true]], {}, '', 1),
  t(S.langgraph, 'enterprise', 'Enterprise', '협의', '협의', [['Enterprise: 협의', 'Enterprise: 협의', true]], {}, '공식 문의', 2),

  // LlamaIndex (4 tiers)
  t(S.llamaindex, 'free', 'Free', '$0', '$0', [['Free: $0', 'Free: $0', true]], {}, '무료 시작', 0),
  t(S.llamaindex, 'starter', 'Starter', '$50', '$600', [['Starter: $50/월', 'Starter: $50/월', true]], {}, '', 1),
  t(S.llamaindex, 'pro', 'Pro', '$500', '$6,000', [['Pro: $500/월', 'Pro: $500/월', true]], {}, '', 2),
  t(S.llamaindex, 'enterprise', 'Enterprise', '협의', '협의', [['Enterprise: 협의', 'Enterprise: 협의', true]], {}, '공식 문의', 3),

  // Mastra (3 tiers)
  t(S.mastra, 'starter_platform', 'Starter Platform', '$0', '$0', [['Starter Platform: $0', 'Starter Platform: $0', true]], {}, '무료 시작', 0),
  t(S.mastra, 'teams_platform', 'Teams Platform', '$250', '$3,000', [['Teams Platform: $250/월', 'Teams Platform: $250/월', true]], {}, '', 1),
  t(S.mastra, 'enterprise', 'Enterprise', '협의', '협의', [['Enterprise: 협의', 'Enterprise: 협의', true]], {}, '공식 문의', 2),

  // Composio (4 tiers)
  t(S.composio, 'free', 'Free', '$0', '$0', [['Free: $0', 'Free: $0', true]], {}, '무료 시작', 0),
  t(S.composio, 'starter', 'Starter', '$29', '$348', [['Starter: $29/월', 'Starter: $29/월', true]], {}, '', 1),
  t(S.composio, 'growth', 'Growth', '$229', '$2,748', [['Growth: $229/월', 'Growth: $229/월', true]], {}, '', 2),
  t(S.composio, 'enterprise', 'Enterprise', '협의', '협의', [['Enterprise: 협의', 'Enterprise: 협의', true]], {}, '공식 문의', 3),

  // Same.new (4 tiers)
  t(S.same_new, 'basic', 'Basic', '$10', '$120', [['Basic: $10/월 (200만 토큰)', 'Basic: $10/월 (200만 토큰)', true]], {}, '', 0),
  t(S.same_new, 'pro', 'Pro', '$25', '$300', [['Pro: $25/월 (500만 토큰)', 'Pro: $25/월 (500만 토큰)', true]], {}, '', 1),
  t(S.same_new, 'max', 'Max', '$50', '$600', [['Max: $50/월 (1,000만 토큰)', 'Max: $50/월 (1,000만 토큰)', true]], {}, '', 2),
  t(S.same_new, 'ultra', 'Ultra', '$100', '$1,200', [['Ultra: $100/월 (2,000만 토큰)', 'Ultra: $100/월 (2,000만 토큰)', true]], {}, '', 3),

  // Zilliz Cloud (3 tiers)
  t(S.zilliz_cloud, 'serverless', 'Serverless', '$4', '$48', [['Serverless: $4/백만 vCU', 'Serverless: $4/백만 vCU', true]], {}, '', 0),
  t(S.zilliz_cloud, 'dedicated', 'Dedicated', '$99', '$1,188', [['Dedicated: $99/월~', 'Dedicated: $99/월~', true]], {}, '', 1),
  t(S.zilliz_cloud, 'enterprise', 'Enterprise', '협의', '협의', [['Enterprise: 협의', 'Enterprise: 협의', true]], {}, '공식 문의', 2),

  // Langfuse (3 tiers)
  t(S.langfuse, 'free', 'Free', '$0', '$0', [['Free: $0', 'Free: $0', true]], {}, '무료 시작', 0),
  t(S.langfuse, 'pro', 'Pro', '사용량 기반($8/10만 유닛)', '사용량 기반($8/10만 유닛)', [['Pro: 사용량 기반($8/10만 유닛)', 'Pro: 사용량 기반($8/10만 유닛)', true]], {}, '공식 문의', 1),
  t(S.langfuse, 'enterprise', 'Enterprise', '협의', '협의', [['Enterprise: 협의', 'Enterprise: 협의', true]], {}, '공식 문의', 2),

  // Helicone (4 tiers)
  t(S.helicone, 'hobby', 'Hobby', '$0', '$0', [['Hobby: $0', 'Hobby: $0', true]], {}, '무료 시작', 0),
  t(S.helicone, 'pro', 'Pro', '$79', '$948', [['Pro: $79/월', 'Pro: $79/월', true]], {}, '', 1),
  t(S.helicone, 'team', 'Team', '$799', '$9,588', [['Team: $799/월', 'Team: $799/월', true]], {}, '', 2),
  t(S.helicone, 'enterprise', 'Enterprise', '협의', '협의', [['Enterprise: 협의', 'Enterprise: 협의', true]], {}, '공식 문의', 3),

  // Portkey (4 tiers)
  t(S.portkey, 'open_source', 'Open Source', '$0', '$0', [['Open Source: $0', 'Open Source: $0', true]], {}, '무료 시작', 0),
  t(S.portkey, 'developer', 'Developer', '$0', '$0', [['Developer: $0', 'Developer: $0', true]], {}, '무료 시작', 1),
  t(S.portkey, 'production', 'Production', '$49', '$588', [['Production: $49/월', 'Production: $49/월', true]], {}, '', 2),
  t(S.portkey, 'enterprise', 'Enterprise', '협의', '협의', [['Enterprise: 협의', 'Enterprise: 협의', true]], {}, '공식 문의', 3),

  // LiteLLM (2 tiers)
  t(S.litellm, 'open_source', 'Open Source', '$0', '$0', [['Open Source: $0', 'Open Source: $0', true]], {}, '무료 시작', 0),
  t(S.litellm, 'enterprise', 'Enterprise', '$250', '$3,000', [['Enterprise: $250/월~', 'Enterprise: $250/월~', true]], {}, '', 1),
];
