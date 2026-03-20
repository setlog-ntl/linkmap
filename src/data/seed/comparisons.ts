import type { ServiceCategory } from '@/types';

export interface ComparisonSeed {
  category: ServiceCategory;
  title: string;
  title_ko: string;
  services: string[]; // service UUIDs
  comparison_data: {
    criteria: {
      name: string;
      name_ko: string;
      values: Record<string, string>; // slug -> value
    }[];
  };
  recommendation: Record<string, { need: string; choose: string; because: string }>;
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
  planetscale: '10000000-0000-4000-a000-000000000014',
  neon: '10000000-0000-4000-a000-000000000015',
  railway: '10000000-0000-4000-a000-000000000016',
  algolia: '10000000-0000-4000-a000-000000000024',
  sanity: '10000000-0000-4000-a000-000000000025',
  ga4: '10000000-0000-4000-a000-000000000026',
  cloudflare: '10000000-0000-4000-a000-000000000028',
  fly_io: '10000000-0000-4000-a000-000000000029',
  mixpanel: '10000000-0000-4000-a000-000000000031',
  contentful: '10000000-0000-4000-a000-000000000032',
  meilisearch: '10000000-0000-4000-a000-000000000033',
  render: '10000000-0000-4000-a000-000000000038',
  plausible: '10000000-0000-4000-a000-000000000047',
  strapi: '10000000-0000-4000-a000-000000000046',
  posthog: '10000000-0000-4000-a000-000000000019',
  playwright: '10000000-0000-4000-a000-000000000040',
  cypress: '10000000-0000-4000-a000-000000000048',
  groq: '10000000-0000-4000-a000-000000000037',
  elevenlabs: '10000000-0000-4000-a000-000000000044',
  pinecone: '10000000-0000-4000-a000-000000000066',
  huggingface: '10000000-0000-4000-a000-000000000069',
  stability_ai: '10000000-0000-4000-a000-000000000070',
  github_copilot: '10000000-0000-4000-a000-000000000081',
  cursor: '10000000-0000-4000-a000-000000000082',
  grok: '10000000-0000-4000-a000-000000000103',
  mistral: '10000000-0000-4000-a000-000000000104',
  cohere: '10000000-0000-4000-a000-000000000105',
  deepseek: '10000000-0000-4000-a000-000000000106',
  midjourney: '10000000-0000-4000-a000-000000000109',
  runway_ml: '10000000-0000-4000-a000-000000000110',
  sora: '10000000-0000-4000-a000-000000000111',
  leonardo_ai: '10000000-0000-4000-a000-000000000112',
  deepgram: '10000000-0000-4000-a000-000000000113',
  assemblyai: '10000000-0000-4000-a000-000000000114',
  windsurf: '10000000-0000-4000-a000-000000000116',
  weaviate: '10000000-0000-4000-a000-000000000119',
  qdrant: '10000000-0000-4000-a000-000000000120',
  chroma: '10000000-0000-4000-a000-000000000121',
  together_ai: '10000000-0000-4000-a000-000000000124',
  namecheap: '10000000-0000-4000-a000-000000000051',
  cloudflare_registrar: '10000000-0000-4000-a000-000000000052',
  godaddy: '10000000-0000-4000-a000-000000000053',
  gabia: '10000000-0000-4000-a000-000000000054',
  hosting_kr: '10000000-0000-4000-a000-000000000055',
  dotname: '10000000-0000-4000-a000-000000000056',
  lemonsqueezy: '10000000-0000-4000-a000-000000000017',
  polar: '10000000-0000-4000-a000-000000000134',
} as const;

export const comparisons: ComparisonSeed[] = [
  // --- 1. Database Comparison ---
  {
    category: 'database',
    title: 'Database Platform Comparison',
    title_ko: '데이터베이스 플랫폼 비교',
    services: [S.supabase, S.firebase, S.planetscale, S.neon],
    comparison_data: {
      criteria: [
        { name: 'Database Type', name_ko: '데이터베이스 타입', values: { supabase: 'PostgreSQL', firebase: 'NoSQL (Firestore)', planetscale: 'MySQL (Vitess)', neon: 'PostgreSQL' } },
        { name: 'Free Tier', name_ko: '무료 티어', values: { supabase: '500MB, 50K MAU', firebase: 'Spark plan (generous)', planetscale: '5GB, 1B reads', neon: '512MB, 3GB storage' } },
        { name: 'Realtime', name_ko: '실시간', values: { supabase: 'Built-in (WebSocket)', firebase: 'Built-in (native)', planetscale: 'Not built-in', neon: 'Not built-in' } },
        { name: 'Auth Included', name_ko: '인증 포함', values: { supabase: 'Yes', firebase: 'Yes', planetscale: 'No', neon: 'No' } },
        { name: 'Open Source', name_ko: '오픈소스', values: { supabase: 'Yes', firebase: 'No', planetscale: 'Vitess is OSS', neon: 'Yes' } },
        { name: 'Branching', name_ko: '브랜칭', values: { supabase: 'Preview branches', firebase: 'Emulator', planetscale: 'Yes (core feature)', neon: 'Yes (core feature)' } },
        { name: 'Scaling', name_ko: '확장성', values: { supabase: 'Vertical + Read replicas', firebase: 'Auto-scale', planetscale: 'Horizontal (Vitess)', neon: 'Auto-scale + branching' } },
        { name: 'DX Score', name_ko: 'DX 점수', values: { supabase: '9.2', firebase: '8.5', planetscale: '8.8', neon: '9.0' } },
      ],
    },
    recommendation: {
      full_stack: { need: '풀스택 BaaS가 필요할 때', choose: 'Supabase', because: 'DB + Auth + Storage + Realtime을 하나로 제공' },
      mobile_first: { need: '모바일 중심 앱을 만들 때', choose: 'Firebase', because: '모바일 SDK가 가장 성숙하고 오프라인 지원이 뛰어남' },
      high_scale_mysql: { need: 'MySQL 기반 대규모 서비스가 필요할 때', choose: 'PlanetScale', because: 'Vitess 기반 무한 수평 확장 지원' },
      serverless_postgres: { need: '서버리스 Postgres가 필요할 때', choose: 'Neon', because: '자동 스케일링과 브랜칭이 뛰어남' },
    },
  },

  // --- 2. Deployment Platform Comparison ---
  {
    category: 'deploy',
    title: 'Deployment Platform Comparison',
    title_ko: '배포 플랫폼 비교',
    services: [S.vercel, S.netlify, S.railway, S.fly_io, S.render],
    comparison_data: {
      criteria: [
        { name: 'Best For', name_ko: '최적 용도', values: { vercel: 'Next.js / React', netlify: 'JAMstack / Static', railway: 'Full-stack / Docker', fly_io: 'Edge / Containers', render: 'All-in-one hosting' } },
        { name: 'Free Tier', name_ko: '무료 티어', values: { vercel: 'Hobby (generous)', netlify: '100GB bandwidth', railway: '$5 credit/mo', fly_io: '3 shared VMs', render: 'Static sites free' } },
        { name: 'Edge Functions', name_ko: '엣지 함수', values: { vercel: 'Yes (Middleware)', netlify: 'Yes (Edge Functions)', railway: 'No', fly_io: 'Yes (core feature)', render: 'No' } },
        { name: 'Docker Support', name_ko: 'Docker 지원', values: { vercel: 'Limited', netlify: 'No', railway: 'Yes (native)', fly_io: 'Yes (native)', render: 'Yes' } },
        { name: 'Database Hosting', name_ko: 'DB 호스팅', values: { vercel: 'Postgres (add-on)', netlify: 'No', railway: 'Postgres, Redis, MySQL', fly_io: 'Postgres (Fly Postgres)', render: 'Postgres (managed)' } },
        { name: 'Preview Deploys', name_ko: '프리뷰 배포', values: { vercel: 'Yes (PR-based)', netlify: 'Yes (PR-based)', railway: 'Yes', fly_io: 'Yes (machines)', render: 'Yes' } },
        { name: 'DX Score', name_ko: 'DX 점수', values: { vercel: '9.5', netlify: '8.8', railway: '9.0', fly_io: '8.2', render: '8.5' } },
      ],
    },
    recommendation: {
      nextjs: { need: 'Next.js 앱을 배포할 때', choose: 'Vercel', because: 'Next.js 제작사로 최적의 통합과 성능 제공' },
      static_sites: { need: '정적 사이트 / JAMstack을 배포할 때', choose: 'Netlify', because: '정적 사이트에 최적화된 CDN과 빌드 파이프라인' },
      full_stack_docker: { need: 'Docker 기반 풀스택 앱을 배포할 때', choose: 'Railway', because: 'Docker + DB를 한 번에, 뛰어난 DX' },
      global_edge: { need: '전 세계 엣지 배포가 필요할 때', choose: 'Fly.io', because: '30+ 리전에 컨테이너를 자동 배포' },
    },
  },

  // --- 3. Auth Comparison ---
  {
    category: 'auth',
    title: 'Authentication Solution Comparison',
    title_ko: '인증 솔루션 비교',
    services: [S.clerk, S.nextauth, S.supabase, S.firebase],
    comparison_data: {
      criteria: [
        { name: 'Type', name_ko: '타입', values: { clerk: 'Managed SaaS', nextauth: 'Self-hosted library', supabase: 'BaaS (included)', firebase: 'BaaS (included)' } },
        { name: 'Free Tier', name_ko: '무료 티어', values: { clerk: '10K MAU', nextauth: 'Unlimited (OSS)', supabase: '50K MAU', firebase: 'Unlimited (Spark)' } },
        { name: 'UI Components', name_ko: 'UI 컴포넌트', values: { clerk: 'Pre-built (excellent)', nextauth: 'DIY', supabase: '@supabase/auth-ui', firebase: 'FirebaseUI' } },
        { name: 'Social Providers', name_ko: '소셜 로그인', values: { clerk: '20+', nextauth: '50+ (community)', supabase: '15+', firebase: '10+' } },
        { name: 'MFA', name_ko: 'MFA', values: { clerk: 'Yes (built-in)', nextauth: 'DIY', supabase: 'Yes (TOTP)', firebase: 'Yes (phone/TOTP)' } },
        { name: 'Vendor Lock-in', name_ko: '벤더 종속성', values: { clerk: 'High', nextauth: 'None', supabase: 'Low', firebase: 'High' } },
        { name: 'DX Score', name_ko: 'DX 점수', values: { clerk: '9.5', nextauth: '7.5', supabase: '8.5', firebase: '8.0' } },
      ],
    },
    recommendation: {
      fast_launch: { need: '빠르게 인증을 구현할 때', choose: 'Clerk', because: '프리빌트 UI + 뛰어난 DX로 5분 안에 인증 완성' },
      full_control: { need: '완전한 제어가 필요할 때', choose: 'NextAuth', because: '오픈소스로 자유로운 커스터마이징, 벤더 종속 없음' },
      with_db: { need: 'DB와 함께 인증이 필요할 때', choose: 'Supabase', because: 'DB + Auth + Storage 원스톱 솔루션' },
    },
  },

  // --- 4. CMS Comparison ---
  {
    category: 'cms',
    title: 'Headless CMS Comparison',
    title_ko: '헤드리스 CMS 비교',
    services: [S.sanity, S.contentful, S.strapi],
    comparison_data: {
      criteria: [
        { name: 'Hosting', name_ko: '호스팅', values: { sanity: 'Managed', contentful: 'Managed', strapi: 'Self-hosted' } },
        { name: 'Free Tier', name_ko: '무료 티어', values: { sanity: '100K API reqs/mo', contentful: '25K records', strapi: 'Free (self-hosted)' } },
        { name: 'Content Modeling', name_ko: '콘텐츠 모델링', values: { sanity: 'Schema-as-code', contentful: 'GUI-based', strapi: 'GUI + code' } },
        { name: 'Real-time Preview', name_ko: '실시간 프리뷰', values: { sanity: 'Excellent (GROQ)', contentful: 'Good (preview API)', strapi: 'Plugin required' } },
        { name: 'Open Source', name_ko: '오픈소스', values: { sanity: 'Studio is OSS', contentful: 'No', strapi: 'Yes (fully)' } },
        { name: 'Learning Curve', name_ko: '학습 곡선', values: { sanity: 'Medium (GROQ)', contentful: 'Low', strapi: 'Low-Medium' } },
        { name: 'DX Score', name_ko: 'DX 점수', values: { sanity: '9.0', contentful: '8.0', strapi: '7.5' } },
      ],
    },
    recommendation: {
      developer_first: { need: '개발자 중심 CMS가 필요할 때', choose: 'Sanity', because: 'Schema-as-code, 실시간 협업, GROQ 쿼리' },
      enterprise: { need: '엔터프라이즈 규모가 필요할 때', choose: 'Contentful', because: '검증된 엔터프라이즈 CMS, 풍부한 에코시스템' },
      self_hosted: { need: '완전한 제어 + 자체 호스팅이 필요할 때', choose: 'Strapi', because: '오픈소스 + 자체 호스팅으로 데이터 주권 확보' },
    },
  },

  // --- 5. Analytics Comparison ---
  {
    category: 'analytics',
    title: 'Analytics Platform Comparison',
    title_ko: '분석 플랫폼 비교',
    services: [S.ga4, S.mixpanel, S.posthog, S.plausible],
    comparison_data: {
      criteria: [
        { name: 'Type', name_ko: '타입', values: { ga4: 'Web Analytics', mixpanel: 'Product Analytics', posthog: 'Product Analytics', plausible: 'Web Analytics' } },
        { name: 'Privacy', name_ko: '프라이버시', values: { ga4: 'Cookie-based', mixpanel: 'GDPR compliant', posthog: 'Cookie-less option', plausible: 'No cookies (GDPR-free)' } },
        { name: 'Free Tier', name_ko: '무료 티어', values: { ga4: 'Unlimited', mixpanel: '20M events/mo', posthog: '1M events/mo', plausible: 'No (paid only)' } },
        { name: 'Session Replay', name_ko: '세션 리플레이', values: { ga4: 'No', mixpanel: 'No', posthog: 'Yes', plausible: 'No' } },
        { name: 'Feature Flags', name_ko: '피처 플래그', values: { ga4: 'No', mixpanel: 'No', posthog: 'Yes', plausible: 'No' } },
        { name: 'Self-host Option', name_ko: '자체 호스팅', values: { ga4: 'No', mixpanel: 'No', posthog: 'Yes', plausible: 'Yes' } },
        { name: 'DX Score', name_ko: 'DX 점수', values: { ga4: '7.0', mixpanel: '8.5', posthog: '9.0', plausible: '9.5' } },
      ],
    },
    recommendation: {
      traditional_web: { need: '전통적인 웹 분석이 필요할 때', choose: 'GA4', because: '무료 + Google Ads 통합 + 풍부한 에코시스템' },
      product_analytics: { need: '제품 분석 (퍼널, 코호트)이 필요할 때', choose: 'Mixpanel', because: '이벤트 기반 분석의 강자, 강력한 퍼널 분석' },
      all_in_one: { need: '분석 + 세션 리플레이 + 피처 플래그가 필요할 때', choose: 'PostHog', because: '올인원 제품 분석 스위트, 자체 호스팅 가능' },
      privacy_first: { need: '프라이버시 최우선이 필요할 때', choose: 'Plausible', because: '쿠키 없는 분석, GDPR 걱정 없음, 가벼움' },
    },
  },

  // --- 6. Domain Registrar Comparison (International) ---
  {
    category: 'domain',
    title: 'Domain Registrar Comparison (International)',
    title_ko: '도메인 등록 비교 (국제)',
    services: [S.namecheap, S.cloudflare_registrar, S.godaddy],
    comparison_data: {
      criteria: [
        { name: 'First Year .COM Price', name_ko: '.COM 첫해 가격', values: { namecheap: '$6.49', cloudflare_registrar: '$10.46', godaddy: '$0.01 (프로모션)' } },
        { name: 'Renewal .COM Price', name_ko: '.COM 갱신 가격', values: { namecheap: '$14.98', cloudflare_registrar: '$10.46', godaddy: '$18.99' } },
        { name: 'Free WHOIS Privacy', name_ko: '무료 WHOIS 프라이버시', values: { namecheap: '예', cloudflare_registrar: '예', godaddy: '아니오 (추가 요금)' } },
        { name: 'DNS Management', name_ko: 'DNS 관리', values: { namecheap: '무료', cloudflare_registrar: '무료 (Cloudflare 통합)', godaddy: '무료' } },
        { name: 'API Support', name_ko: 'API 지원', values: { namecheap: '예', cloudflare_registrar: '예', godaddy: '예' } },
        { name: 'DNSSEC', name_ko: 'DNSSEC', values: { namecheap: '유료 추가', cloudflare_registrar: '자동 활성화', godaddy: '유료 추가' } },
        { name: 'Domain Transfer', name_ko: '도메인 이전', values: { namecheap: '무료 + 1년 연장', cloudflare_registrar: '무료 이전', godaddy: '무료' } },
        { name: 'DX Score', name_ko: 'DX 점수', values: { namecheap: '8.0', cloudflare_registrar: '8.5', godaddy: '7.5' } },
      ],
    },
    recommendation: {
      budget: { need: '저가 도메인 등록이 필요할 때', choose: 'Namecheap', because: '첫해 저가 + 무료 WHOIS 프라이버시' },
      transparent_pricing: { need: '투명한 가격 + 마크업 없음이 필요할 때', choose: 'Cloudflare Registrar', because: '마크업 없는 레지스트리 가격, DNS 통합' },
      integrated_platform: { need: 'Cloudflare와 통합이 필요할 때', choose: 'Cloudflare Registrar', because: 'DNS + DNSSEC + 도메인 자동 관리' },
      full_service: { need: '도메인 + 호스팅 + 이메일 통합이 필요할 때', choose: 'GoDaddy', because: '올인원 웹 호스팅 플랫폼' },
    },
  },

  // --- 7. Domain Registrar Comparison (Korean) ---
  {
    category: 'domain',
    title: 'Domain Registrar Comparison (Korea)',
    title_ko: '도메인 등록 비교 (국내)',
    services: [S.gabia, S.hosting_kr, S.dotname],
    comparison_data: {
      criteria: [
        { name: '.KR Domain Price', name_ko: '.KR 도메인 가격', values: { gabia: '$12/년', hosting_kr: '$10~$12/년', dotname: '$10~$12/년' } },
        { name: '.COM Domain Price', name_ko: '.COM 도메인 가격', values: { gabia: '$8.50/년', hosting_kr: '$8/년', dotname: '$8~$9/년' } },
        { name: 'Free Web Hosting', name_ko: '무료 웹호스팅', values: { gabia: '선택 사항', hosting_kr: '선택 사항', dotname: '도메인 등록 시 포함' } },
        { name: 'AI Domain Recommendation', name_ko: 'AI 도메인 추천', values: { gabia: '예 (2024년 신규)', hosting_kr: '아니오', dotname: '아니오' } },
        { name: 'DNS Management', name_ko: 'DNS 관리', values: { gabia: '무료', hosting_kr: '무료', dotname: '무료' } },
        { name: 'WHOIS Privacy', name_ko: 'WHOIS 프라이버시', values: { gabia: '무료', hosting_kr: '무료', dotname: '무료' } },
        { name: 'Email Service', name_ko: '이메일 서비스', values: { gabia: '무료 포워딩', hosting_kr: '무료 포워딩', dotname: '무료 포워딩' } },
        { name: 'Market Share', name_ko: '시장 점유율', values: { gabia: '1위 (100만 도메인)', hosting_kr: '주요 업체', dotname: '45만 고객' } },
      ],
    },
    recommendation: {
      best_korean: { need: '최고의 한국 도메인 서비스가 필요할 때', choose: 'Gabia', because: '시장 점유율 1위, AI 도메인 추천, 신뢰성' },
      low_cost: { need: '저가 .KR 도메인이 필요할 때', choose: 'HostingKR', because: '합리적인 가격, KISA 우수 기업 인증' },
      free_hosting: { need: '도메인과 함께 무료 호스팅이 필요할 때', choose: 'DotName', because: '도메인 등록 시 무료 호스팅 + SSL 인증서' },
      established_player: { need: '성숙한 서비스가 필요할 때', choose: 'HostingKR', because: '국내 도메인 등록 대행 우수 기업' },
    },
  },

  // --- 8. LLM Provider Comparison ---
  {
    category: 'ai',
    title: 'LLM Provider Comparison',
    title_ko: 'LLM 제공자 비교',
    services: [S.openai, S.anthropic, S.grok, S.mistral, S.deepseek, S.groq],
    comparison_data: {
      criteria: [
        { name: 'Top Model', name_ko: '최상위 모델', values: { openai: 'GPT-5', anthropic: 'Claude Opus 4.6', grok: 'Grok 4.1', 'mistral-ai': 'Large 3', deepseek: 'V3 / R1', groq: 'Llama 4 (호스팅)' } },
        { name: 'Context Window', name_ko: '컨텍스트 윈도우', values: { openai: '400K', anthropic: '200K', grok: '2M', 'mistral-ai': '128K', deepseek: '128K', groq: '128K' } },
        { name: 'Free Tier', name_ko: '무료 티어', values: { openai: '$5 크레딧', anthropic: '체험 크레딧', grok: '$25 크레딧', 'mistral-ai': '없음', deepseek: '없음', groq: '일 14.4K 요청' } },
        { name: 'Input Price (1M)', name_ko: '입력 가격 (1M)', values: { openai: '$1.25~$2.50', anthropic: '$3~$5', grok: '$0.20', 'mistral-ai': '$0.02~$0.50', deepseek: '$0.14', groq: '무료~$0.10' } },
        { name: 'Open Source', name_ko: '오픈소스', values: { openai: '아니오', anthropic: '아니오', grok: '부분적', 'mistral-ai': '예', deepseek: '예', groq: '호스팅만' } },
        { name: 'Best For', name_ko: '최적 용도', values: { openai: '범용 최강', anthropic: '안전성·추론', grok: '웹 검색·장문맥', 'mistral-ai': '유럽·비용 효율', deepseek: '최저가', groq: '최고 속도' } },
        { name: 'DX Score', name_ko: 'DX 점수', values: { openai: '9.5', anthropic: '9.2', grok: '8.0', 'mistral-ai': '8.5', deepseek: '8.0', groq: '9.0' } },
      ],
    },
    recommendation: {
      best_overall: { need: '최고의 범용 LLM이 필요할 때', choose: 'OpenAI', because: 'GPT-5로 최대 모델 생태계와 SDK 지원' },
      safety_reasoning: { need: '안전성과 추론 능력이 중요할 때', choose: 'Anthropic', because: 'Claude는 안전성·장문맥·코딩에 강점' },
      lowest_cost: { need: '최저 비용이 필요할 때', choose: 'DeepSeek', because: '업계 최저가, 오프피크 75% 할인' },
      fastest_speed: { need: '최고 속도가 필요할 때', choose: 'Groq', because: 'LPU 기반 업계 최저 지연 시간' },
      long_context: { need: '대용량 컨텍스트가 필요할 때', choose: 'Grok', because: '2M 토큰 컨텍스트 + 웹 검색 내장' },
    },
  },

  // --- 9. AI Coding Assistant Comparison ---
  {
    category: 'ai',
    title: 'AI Coding Assistant Comparison',
    title_ko: 'AI 코딩 어시스턴트 비교',
    services: [S.github_copilot, S.cursor, S.windsurf],
    comparison_data: {
      criteria: [
        { name: 'Type', name_ko: '타입', values: { 'github-copilot': 'IDE 플러그인', cursor: 'AI 네이티브 IDE', windsurf: '에이전틱 IDE' } },
        { name: 'Free Tier', name_ko: '무료 티어', values: { 'github-copilot': '없음', cursor: '제한적 무료', windsurf: '무제한 무료 (기본)' } },
        { name: 'Price', name_ko: '가격', values: { 'github-copilot': '$10/월', cursor: '$20/월', windsurf: '$15/월' } },
        { name: 'Multi-Model', name_ko: '멀티 모델', values: { 'github-copilot': 'GPT-4o, Claude, Gemini', cursor: 'GPT-4, Claude', windsurf: '자체 모델' } },
        { name: 'Agent Mode', name_ko: '에이전트 모드', values: { 'github-copilot': 'Copilot Workspace', cursor: 'Composer', windsurf: 'Cascade' } },
        { name: 'IDE Support', name_ko: 'IDE 지원', values: { 'github-copilot': 'VS Code, JetBrains 등', cursor: 'Cursor (자체 IDE)', windsurf: 'Windsurf (자체 IDE)' } },
        { name: 'DX Score', name_ko: 'DX 점수', values: { 'github-copilot': '8.5', cursor: '9.2', windsurf: '8.8' } },
      ],
    },
    recommendation: {
      existing_ide: { need: '기존 IDE를 유지하고 싶을 때', choose: 'GitHub Copilot', because: 'VS Code, JetBrains 등 다양한 IDE에서 사용 가능' },
      best_dx: { need: '최고의 AI 코딩 경험이 필요할 때', choose: 'Cursor', because: '전체 코드베이스 인식 + Composer 에이전트' },
      free_option: { need: '무료로 시작하고 싶을 때', choose: 'Windsurf', because: '무제한 무료 코드 완성 제공' },
    },
  },

  // --- 10. Vector Database Comparison ---
  {
    category: 'ai',
    title: 'Vector Database Comparison',
    title_ko: '벡터 데이터베이스 비교',
    services: [S.pinecone, S.weaviate, S.qdrant, S.chroma],
    comparison_data: {
      criteria: [
        { name: 'Type', name_ko: '타입', values: { pinecone: '관리형 SaaS', weaviate: '오픈소스 + 클라우드', qdrant: '오픈소스 + 클라우드', chroma: '오픈소스 경량' } },
        { name: 'Free Tier', name_ko: '무료 티어', values: { pinecone: '1개 인덱스, 100K 벡터', weaviate: '오픈소스 무료', qdrant: '1GB 영구 무료', chroma: '오픈소스 무료' } },
        { name: 'Hybrid Search', name_ko: '하이브리드 검색', values: { pinecone: '예', weaviate: '예 (강점)', qdrant: '예', chroma: '제한적' } },
        { name: 'Self-host', name_ko: '자체 호스팅', values: { pinecone: '아니오', weaviate: '예', qdrant: '예', chroma: '예' } },
        { name: 'Scale', name_ko: '확장성', values: { pinecone: '자동 (서버리스)', weaviate: '분산 배포', qdrant: '분산 배포', chroma: '소규모' } },
        { name: 'Best For', name_ko: '최적 용도', values: { pinecone: '빠른 시작·관리형', weaviate: '하이브리드 검색', qdrant: '고성능·Rust', chroma: '프로토타이핑' } },
        { name: 'DX Score', name_ko: 'DX 점수', values: { pinecone: '9.0', weaviate: '8.5', qdrant: '8.5', chroma: '9.0' } },
      ],
    },
    recommendation: {
      managed: { need: '관리형 서비스가 필요할 때', choose: 'Pinecone', because: '서버리스, 자동 스케일링, 최소 운영 부담' },
      hybrid_search: { need: '하이브리드 검색이 중요할 때', choose: 'Weaviate', because: '벡터 + 키워드 + 지식 그래프 통합' },
      high_perf: { need: '최고 성능이 필요할 때', choose: 'Qdrant', because: 'Rust 기반, ACID 트랜잭션, 분산 배포' },
      prototype: { need: '빠른 프로토타이핑이 필요할 때', choose: 'Chroma', because: '경량, 간편 설정, 로컬 개발에 최적' },
    },
  },

  // --- 11. AI Image Generation Comparison ---
  {
    category: 'ai',
    title: 'AI Image Generation Comparison',
    title_ko: 'AI 이미지 생성 비교',
    services: [S.midjourney, S.stability_ai, S.leonardo_ai],
    comparison_data: {
      criteria: [
        { name: 'Quality', name_ko: '품질', values: { midjourney: '최고 (예술적)', 'stability-ai': '높음 (커스터마이징)', 'leonardo-ai': '높음 (게임 특화)' } },
        { name: 'Free Tier', name_ko: '무료 티어', values: { midjourney: '없음', 'stability-ai': '25 크레딧', 'leonardo-ai': '일일 무료 크레딧' } },
        { name: 'API Access', name_ko: 'API 접근', values: { midjourney: '제한적', 'stability-ai': '예 (REST API)', 'leonardo-ai': '예 (REST API)' } },
        { name: 'Open Source', name_ko: '오픈소스', values: { midjourney: '아니오', 'stability-ai': '예 (모델)', 'leonardo-ai': '아니오' } },
        { name: 'Starting Price', name_ko: '시작 가격', values: { midjourney: '$10/월', 'stability-ai': '$0 (OSS)', 'leonardo-ai': '$0 (무료 크레딧)' } },
        { name: 'DX Score', name_ko: 'DX 점수', values: { midjourney: '8.0', 'stability-ai': '8.5', 'leonardo-ai': '8.0' } },
      ],
    },
    recommendation: {
      best_quality: { need: '최고 품질 이미지가 필요할 때', choose: 'Midjourney', because: '예술적 품질, 색상 조화, 구도에서 압도적' },
      api_integration: { need: 'API 통합이 필요할 때', choose: 'Stability AI', because: '오픈소스 모델 + REST API + 커스터마이징' },
      game_assets: { need: '게임/앱 자산이 필요할 때', choose: 'Leonardo AI', because: '게임 아트 특화 + Flux 모델 통합' },
    },
  },

  // --- 12. AI Video Generation Comparison ---
  {
    category: 'ai',
    title: 'AI Video Generation Comparison',
    title_ko: 'AI 비디오 생성 비교',
    services: [S.sora, S.runway_ml],
    comparison_data: {
      criteria: [
        { name: 'Quality', name_ko: '품질', values: { sora: '최고 (시네마틱)', 'runway-ml': '높음 (다양한 모드)' } },
        { name: 'Models', name_ko: '모델', values: { sora: 'Sora 2', 'runway-ml': 'Gen-4 Aleph, Act-Two' } },
        { name: 'Features', name_ko: '기능', values: { sora: '텍스트→비디오', 'runway-ml': '텍스트→비디오, 이미지→비디오, 립싱크' } },
        { name: 'Starting Price', name_ko: '시작 가격', values: { sora: '$20/월 (Plus 포함)', 'runway-ml': '$15/월' } },
        { name: 'API Access', name_ko: 'API 접근', values: { sora: '예 (OpenAI API)', 'runway-ml': '예' } },
        { name: 'DX Score', name_ko: 'DX 점수', values: { sora: '8.5', 'runway-ml': '8.0' } },
      ],
    },
    recommendation: {
      cinematic: { need: '시네마틱 품질이 필요할 때', choose: 'Sora', because: 'OpenAI의 최고 품질 비디오 생성' },
      versatile: { need: '다양한 비디오 편집이 필요할 때', choose: 'Runway ML', because: '다양한 모드(Gen-4, 립싱크 등) 제공' },
    },
  },

  // --- 13. AI Speech-to-Text Comparison ---
  {
    category: 'ai',
    title: 'AI Speech-to-Text Comparison',
    title_ko: 'AI 음성 인식 비교',
    services: [S.deepgram, S.assemblyai],
    comparison_data: {
      criteria: [
        { name: 'Latency', name_ko: '지연 시간', values: { deepgram: '<300ms (초저지연)', assemblyai: '표준' } },
        { name: 'Accuracy', name_ko: '정확도', values: { deepgram: '높음', assemblyai: '최고 (14.5% WER)' } },
        { name: 'Free Tier', name_ko: '무료 티어', values: { deepgram: '$200 크레딧', assemblyai: '체험 크레딧' } },
        { name: 'Domain Specialization', name_ko: '도메인 특화', values: { deepgram: '대화형 AI', assemblyai: '의료·세일즈' } },
        { name: 'Billing', name_ko: '과금', values: { deepgram: '초 단위', assemblyai: '시간 단위' } },
        { name: 'DX Score', name_ko: 'DX 점수', values: { deepgram: '8.5', assemblyai: '8.5' } },
      ],
    },
    recommendation: {
      real_time: { need: '실시간 대화형 AI가 필요할 때', choose: 'Deepgram', because: '초저지연 + 초 단위 과금' },
      accuracy: { need: '최고 정확도가 필요할 때', choose: 'AssemblyAI', because: '업계 최고 정확도 + 의료 도메인 특화' },
    },
  },

  // --- 14. Payment Platform Comparison ---
  {
    category: 'payment',
    title: 'Payment Platform Comparison',
    title_ko: '결제 플랫폼 비교',
    services: [S.stripe, S.lemonsqueezy, S.polar],
    comparison_data: {
      criteria: [
        {
          name: 'Transaction Fee',
          name_ko: '거래 수수료',
          values: { stripe: '2.9% + 30¢', 'lemon-squeezy': '5% + 50¢', polar: '4% + 40¢' },
        },
        {
          name: 'Merchant of Record',
          name_ko: '판매 대행(MoR)',
          values: { stripe: '아니오 (직접 세금 처리)', 'lemon-squeezy': '예 (글로벌 세금 자동)', polar: '예 (글로벌 세금 자동)' },
        },
        {
          name: 'Digital Products',
          name_ko: '디지털 상품',
          values: { stripe: '직접 구현 필요', 'lemon-squeezy': '기본 지원', polar: '라이선스키·파일·GitHub 접근 등 네이티브 지원' },
        },
        {
          name: 'Open Source',
          name_ko: '오픈소스',
          values: { stripe: '아니오', 'lemon-squeezy': '아니오', polar: '예 (Apache 2.0)' },
        },
        {
          name: 'Free Tier',
          name_ko: '무료 티어',
          values: { stripe: '플랫폼 무료, 수수료만', 'lemon-squeezy': '플랫폼 무료, 수수료만', polar: '플랫폼 무료, 수수료만' },
        },
        {
          name: 'Setup Complexity',
          name_ko: '설정 복잡도',
          values: { stripe: '복잡 (웹훅·세금 직접 설정)', 'lemon-squeezy': '쉬움', polar: '쉬움' },
        },
        {
          name: 'Ecosystem',
          name_ko: '생태계',
          values: { stripe: '매우 풍부 (96점)', 'lemon-squeezy': '중간 (70점)', polar: '성장 중 (62점)' },
        },
        {
          name: 'DX Score',
          name_ko: 'DX 점수',
          values: { stripe: '8.5', 'lemon-squeezy': '7.5', polar: '7.5' },
        },
      ],
    },
    recommendation: {
      enterprise: { need: '기업급 결제 인프라가 필요할 때', choose: 'Stripe', because: '가장 풍부한 생태계, 낮은 수수료, 완전한 제어권' },
      indie: { need: '인디 개발자 또는 오픈소스 프로젝트 수익화 시', choose: 'Polar', because: '오픈소스, MoR 자동화, GitHub 접근 권한 부여 등 개발자 특화 기능' },
      digital_products: { need: '디지털 상품·SaaS 구독을 빠르게 시작할 때', choose: 'Lemon Squeezy', because: 'MoR + 세금 자동화 + 쉬운 설정' },
    },
  },
];
