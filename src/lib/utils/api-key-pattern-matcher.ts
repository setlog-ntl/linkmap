/**
 * API Key Value-based Pattern Matcher
 * 키 값의 접두사/패턴으로 서비스를 자동 감지
 */

import { matchEnvKeyToServiceFuzzy } from './env-service-matcher';

export type MatchConfidence = 'high' | 'medium' | 'low';

export interface ApiKeyPattern {
  serviceId: string;
  serviceName: string;
  /** 접두사 문자열 (우선) */
  prefix?: string;
  /** 정규식 패턴 (prefix 없을 때) */
  regex?: RegExp;
  /** 충돌 제거 함수: true면 매칭 제외 */
  disambiguator?: (value: string) => boolean;
  confidence: MatchConfidence;
  /** 자동 추천 key 이름 */
  suggestedKeyName?: string;
}

export interface ApiKeyAnalysisResult {
  serviceId: string;
  serviceName: string;
  confidence: MatchConfidence;
  matchedPattern: string;
  suggestedKeyName?: string;
}

// SERVICE_IDS from src/data/seed/services.ts
const SID = {
  openai: '10000000-0000-4000-a000-000000000010',
  anthropic: '10000000-0000-4000-a000-000000000011',
  stripe: '10000000-0000-4000-a000-000000000005',
  clerk: '10000000-0000-4000-a000-000000000006',
  github: '10000000-0000-4000-a000-000000000051',
  github_actions: '10000000-0000-4000-a000-000000000021',
  resend: '10000000-0000-4000-a000-000000000008',
  sendgrid: '10000000-0000-4000-a000-000000000009',
  supabase: '10000000-0000-4000-a000-000000000001',
  firebase: '10000000-0000-4000-a000-000000000002',
  vercel: '10000000-0000-4000-a000-000000000003',
  cloudinary: '10000000-0000-4000-a000-000000000012',
  sentry: '10000000-0000-4000-a000-000000000013',
  posthog: '10000000-0000-4000-a000-000000000019',
  awss3: '10000000-0000-4000-a000-000000000020',
  twilio: '10000000-0000-4000-a000-000000000022',
  algolia: '10000000-0000-4000-a000-000000000024',
  cloudflare: '10000000-0000-4000-a000-000000000028',
  datadog: '10000000-0000-4000-a000-000000000030',
  mixpanel: '10000000-0000-4000-a000-000000000031',
  pusher: '10000000-0000-4000-a000-000000000034',
  launchdarkly: '10000000-0000-4000-a000-000000000036',
  groq: '10000000-0000-4000-a000-000000000037',
  slack_api: '10000000-0000-4000-a000-000000000041',
  discord_api: '10000000-0000-4000-a000-000000000042',
  mapbox: '10000000-0000-4000-a000-000000000043',
  elevenlabs: '10000000-0000-4000-a000-000000000044',
  pinecone: '10000000-0000-4000-a000-000000000066',
  replicate: '10000000-0000-4000-a000-000000000068',
  huggingface: '10000000-0000-4000-a000-000000000069',
  stability_ai: '10000000-0000-4000-a000-000000000070',
  notion_api: '10000000-0000-4000-a000-000000000071',
  linear_api: '10000000-0000-4000-a000-000000000072',
  toss_payments: '10000000-0000-4000-a000-000000000073',
  uploadthing: '10000000-0000-4000-a000-000000000018',
  upstash_redis: '10000000-0000-4000-a000-000000000027',
  contentful: '10000000-0000-4000-a000-000000000032',
  meilisearch: '10000000-0000-4000-a000-000000000033',
  google_gemini: '10000000-0000-4000-a000-000000000053',
  aws_ses: '10000000-0000-4000-a000-000000000075',
  r2: '10000000-0000-4000-a000-000000000078',
  auth0: '10000000-0000-4000-a000-000000000059',
  convex: '10000000-0000-4000-a000-000000000060',
  turso: '10000000-0000-4000-a000-000000000063',
  shopify_api: '10000000-0000-4000-a000-000000000050',
  polar: '10000000-0000-4000-a000-000000000134',
} as const;

/**
 * 접두사 충돌 시 긴 접두사 우선 매칭을 위해 prefix 길이 내림차순 정렬
 */
export const API_KEY_PATTERNS: ApiKeyPattern[] = [
  // === OpenAI ===
  { serviceId: SID.openai, serviceName: 'OpenAI', prefix: 'sk-proj-', confidence: 'high' as const, suggestedKeyName: 'OPENAI_API_KEY' },
  {
    serviceId: SID.openai, serviceName: 'OpenAI', prefix: 'sk-',
    disambiguator: (v: string) => v.startsWith('sk-ant-') || v.startsWith('sk-proj-') || v.startsWith('sk_live_') || v.startsWith('sk_test_'),
    confidence: 'low' as const, suggestedKeyName: 'OPENAI_API_KEY',
  },

  // === Anthropic ===
  { serviceId: SID.anthropic, serviceName: 'Anthropic', prefix: 'sk-ant-', confidence: 'high' as const, suggestedKeyName: 'ANTHROPIC_API_KEY' },

  // === Stripe ===
  {
    serviceId: SID.stripe, serviceName: 'Stripe', prefix: 'sk_live_',
    disambiguator: (v: string) => v.length < 80, // Stripe keys are 100+
    confidence: 'high' as const, suggestedKeyName: 'STRIPE_SECRET_KEY',
  },
  {
    serviceId: SID.stripe, serviceName: 'Stripe', prefix: 'sk_test_',
    disambiguator: (v: string) => v.length < 80,
    confidence: 'high' as const, suggestedKeyName: 'STRIPE_SECRET_KEY',
  },
  {
    serviceId: SID.stripe, serviceName: 'Stripe', prefix: 'pk_live_',
    disambiguator: (v: string) => v.length < 80,
    confidence: 'high' as const, suggestedKeyName: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  },
  {
    serviceId: SID.stripe, serviceName: 'Stripe', prefix: 'pk_test_',
    disambiguator: (v: string) => v.length < 80,
    confidence: 'high' as const, suggestedKeyName: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  },
  { serviceId: SID.stripe, serviceName: 'Stripe', prefix: 'whsec_', confidence: 'high' as const, suggestedKeyName: 'STRIPE_WEBHOOK_SECRET' },

  // === Clerk (sk_live/sk_test but shorter keys ~50 chars) ===
  {
    serviceId: SID.clerk, serviceName: 'Clerk', prefix: 'sk_live_',
    disambiguator: (v: string) => v.length >= 80, // Stripe is longer
    confidence: 'medium' as const, suggestedKeyName: 'CLERK_SECRET_KEY',
  },
  {
    serviceId: SID.clerk, serviceName: 'Clerk', prefix: 'sk_test_',
    disambiguator: (v: string) => v.length >= 80,
    confidence: 'medium' as const, suggestedKeyName: 'CLERK_SECRET_KEY',
  },
  {
    serviceId: SID.clerk, serviceName: 'Clerk', prefix: 'pk_live_',
    disambiguator: (v: string) => v.length >= 80,
    confidence: 'medium' as const, suggestedKeyName: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  },
  {
    serviceId: SID.clerk, serviceName: 'Clerk', prefix: 'pk_test_',
    disambiguator: (v: string) => v.length >= 80,
    confidence: 'medium' as const, suggestedKeyName: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  },

  // === GitHub ===
  { serviceId: SID.github, serviceName: 'GitHub', prefix: 'ghp_', confidence: 'high' as const, suggestedKeyName: 'GITHUB_TOKEN' },
  { serviceId: SID.github, serviceName: 'GitHub', prefix: 'gho_', confidence: 'high' as const, suggestedKeyName: 'GITHUB_OAUTH_TOKEN' },
  { serviceId: SID.github, serviceName: 'GitHub', prefix: 'ghu_', confidence: 'high' as const, suggestedKeyName: 'GITHUB_USER_TOKEN' },
  { serviceId: SID.github, serviceName: 'GitHub', prefix: 'ghs_', confidence: 'high' as const, suggestedKeyName: 'GITHUB_SERVER_TOKEN' },
  { serviceId: SID.github, serviceName: 'GitHub', prefix: 'ghr_', confidence: 'high' as const, suggestedKeyName: 'GITHUB_REFRESH_TOKEN' },

  // === Resend ===
  { serviceId: SID.resend, serviceName: 'Resend', prefix: 're_', confidence: 'high' as const, suggestedKeyName: 'RESEND_API_KEY' },

  // === SendGrid ===
  { serviceId: SID.sendgrid, serviceName: 'SendGrid', prefix: 'SG.', confidence: 'high' as const, suggestedKeyName: 'SENDGRID_API_KEY' },

  // === AWS ===
  { serviceId: SID.awss3, serviceName: 'AWS S3', prefix: 'AKIA', confidence: 'high' as const, suggestedKeyName: 'AWS_ACCESS_KEY_ID' },
  { serviceId: SID.awss3, serviceName: 'AWS S3', prefix: 'ASIA', confidence: 'high' as const, suggestedKeyName: 'AWS_ACCESS_KEY_ID' },

  // === Supabase (URL pattern) ===
  { serviceId: SID.supabase, serviceName: 'Supabase', regex: /^https:\/\/[a-z0-9]+\.supabase\.co\b/, confidence: 'high' as const, suggestedKeyName: 'NEXT_PUBLIC_SUPABASE_URL' },
  {
    serviceId: SID.supabase, serviceName: 'Supabase', prefix: 'eyJ',
    disambiguator: () => false, // JWT alone is low confidence
    confidence: 'low' as const, suggestedKeyName: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  },

  // === Vercel ===
  { serviceId: SID.vercel, serviceName: 'Vercel', regex: /^https:\/\/[a-z0-9-]+\.vercel\.app\b/, confidence: 'high' as const, suggestedKeyName: 'NEXT_PUBLIC_VERCEL_URL' },

  // === Cloudinary ===
  { serviceId: SID.cloudinary, serviceName: 'Cloudinary', regex: /^cloudinary:\/\//, confidence: 'high' as const, suggestedKeyName: 'CLOUDINARY_URL' },

  // === Sentry ===
  { serviceId: SID.sentry, serviceName: 'Sentry', regex: /^https:\/\/[a-f0-9]+@[a-z0-9]+\.ingest\.sentry\.io\//, confidence: 'high' as const, suggestedKeyName: 'SENTRY_DSN' },

  // === PostHog ===
  { serviceId: SID.posthog, serviceName: 'PostHog', prefix: 'phc_', confidence: 'high' as const, suggestedKeyName: 'NEXT_PUBLIC_POSTHOG_KEY' },

  // === Twilio ===
  { serviceId: SID.twilio, serviceName: 'Twilio', prefix: 'AC', confidence: 'medium' as const, suggestedKeyName: 'TWILIO_ACCOUNT_SID',
    disambiguator: (v: string) => !/^AC[a-f0-9]{32}$/.test(v),
  },

  // === Algolia ===
  { serviceId: SID.algolia, serviceName: 'Algolia', regex: /^[a-f0-9]{32}$/, confidence: 'low' as const, suggestedKeyName: 'ALGOLIA_API_KEY' },

  // === Cloudflare ===
  { serviceId: SID.cloudflare, serviceName: 'Cloudflare', regex: /^[a-f0-9]{37}$/, confidence: 'low' as const, suggestedKeyName: 'CLOUDFLARE_API_TOKEN' },

  // === DataDog ===
  { serviceId: SID.datadog, serviceName: 'Datadog', regex: /^[a-f0-9]{32}$/, confidence: 'low' as const, suggestedKeyName: 'DD_API_KEY' },

  // === Mixpanel ===
  { serviceId: SID.mixpanel, serviceName: 'Mixpanel', regex: /^[a-f0-9]{32}$/, confidence: 'low' as const, suggestedKeyName: 'MIXPANEL_TOKEN' },

  // === Pusher ===
  { serviceId: SID.pusher, serviceName: 'Pusher', regex: /^[a-f0-9]{20}$/, confidence: 'low' as const, suggestedKeyName: 'PUSHER_APP_KEY' },

  // === LaunchDarkly ===
  { serviceId: SID.launchdarkly, serviceName: 'LaunchDarkly', prefix: 'sdk-', confidence: 'medium' as const, suggestedKeyName: 'LAUNCHDARKLY_SDK_KEY' },

  // === Groq ===
  { serviceId: SID.groq, serviceName: 'Groq', prefix: 'gsk_', confidence: 'high' as const, suggestedKeyName: 'GROQ_API_KEY' },

  // === Slack ===
  { serviceId: SID.slack_api, serviceName: 'Slack', prefix: 'xoxb-', confidence: 'high' as const, suggestedKeyName: 'SLACK_BOT_TOKEN' },
  { serviceId: SID.slack_api, serviceName: 'Slack', prefix: 'xoxp-', confidence: 'high' as const, suggestedKeyName: 'SLACK_USER_TOKEN' },
  { serviceId: SID.slack_api, serviceName: 'Slack', prefix: 'xapp-', confidence: 'high' as const, suggestedKeyName: 'SLACK_APP_TOKEN' },

  // === Discord ===
  { serviceId: SID.discord_api, serviceName: 'Discord', regex: /^[A-Za-z0-9]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{38}$/, confidence: 'medium' as const, suggestedKeyName: 'DISCORD_BOT_TOKEN' },

  // === Mapbox ===
  { serviceId: SID.mapbox, serviceName: 'Mapbox', prefix: 'pk.eyJ', confidence: 'high' as const, suggestedKeyName: 'NEXT_PUBLIC_MAPBOX_TOKEN' },
  { serviceId: SID.mapbox, serviceName: 'Mapbox', prefix: 'sk.eyJ', confidence: 'high' as const, suggestedKeyName: 'MAPBOX_SECRET_TOKEN' },

  // === ElevenLabs ===
  { serviceId: SID.elevenlabs, serviceName: 'ElevenLabs', regex: /^[a-f0-9]{32}$/, confidence: 'low' as const, suggestedKeyName: 'ELEVENLABS_API_KEY' },

  // === Pinecone ===
  { serviceId: SID.pinecone, serviceName: 'Pinecone', regex: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, confidence: 'low' as const, suggestedKeyName: 'PINECONE_API_KEY' },

  // === Replicate ===
  { serviceId: SID.replicate, serviceName: 'Replicate', prefix: 'r8_', confidence: 'high' as const, suggestedKeyName: 'REPLICATE_API_TOKEN' },

  // === HuggingFace ===
  { serviceId: SID.huggingface, serviceName: 'Hugging Face', prefix: 'hf_', confidence: 'high' as const, suggestedKeyName: 'HUGGINGFACE_API_KEY' },

  // === Notion ===
  { serviceId: SID.notion_api, serviceName: 'Notion', prefix: 'ntn_', confidence: 'high' as const, suggestedKeyName: 'NOTION_API_KEY' },
  { serviceId: SID.notion_api, serviceName: 'Notion', prefix: 'secret_', confidence: 'low' as const, suggestedKeyName: 'NOTION_API_KEY' },

  // === Linear ===
  { serviceId: SID.linear_api, serviceName: 'Linear', prefix: 'lin_api_', confidence: 'high' as const, suggestedKeyName: 'LINEAR_API_KEY' },

  // === Toss Payments ===
  { serviceId: SID.toss_payments, serviceName: 'Toss Payments', prefix: 'test_ck_', confidence: 'high' as const, suggestedKeyName: 'TOSS_CLIENT_KEY' },
  { serviceId: SID.toss_payments, serviceName: 'Toss Payments', prefix: 'live_ck_', confidence: 'high' as const, suggestedKeyName: 'TOSS_CLIENT_KEY' },
  { serviceId: SID.toss_payments, serviceName: 'Toss Payments', prefix: 'test_sk_', confidence: 'high' as const, suggestedKeyName: 'TOSS_SECRET_KEY' },
  { serviceId: SID.toss_payments, serviceName: 'Toss Payments', prefix: 'live_sk_', confidence: 'high' as const, suggestedKeyName: 'TOSS_SECRET_KEY' },

  // === UploadThing ===
  { serviceId: SID.uploadthing, serviceName: 'UploadThing', prefix: 'sk_live_ut_', confidence: 'high' as const, suggestedKeyName: 'UPLOADTHING_SECRET' },

  // === Upstash ===
  { serviceId: SID.upstash_redis, serviceName: 'Upstash Redis', regex: /^https:\/\/[a-z0-9-]+\.upstash\.io\b/, confidence: 'high' as const, suggestedKeyName: 'UPSTASH_REDIS_REST_URL' },

  // === Contentful ===
  { serviceId: SID.contentful, serviceName: 'Contentful', prefix: 'CFPAT-', confidence: 'high' as const, suggestedKeyName: 'CONTENTFUL_ACCESS_TOKEN' },

  // === MeiliSearch ===
  { serviceId: SID.meilisearch, serviceName: 'Meilisearch', regex: /^[a-f0-9]{40}$/, confidence: 'low' as const, suggestedKeyName: 'MEILISEARCH_API_KEY' },

  // === Google Gemini ===
  { serviceId: SID.google_gemini, serviceName: 'Google Gemini', prefix: 'AIzaSy', confidence: 'high' as const, suggestedKeyName: 'GOOGLE_GEMINI_API_KEY' },

  // === Auth0 ===
  { serviceId: SID.auth0, serviceName: 'Auth0', regex: /^https:\/\/[a-z0-9-]+\.auth0\.com\b/, confidence: 'high' as const, suggestedKeyName: 'AUTH0_ISSUER_BASE_URL' },

  // === Convex ===
  { serviceId: SID.convex, serviceName: 'Convex', regex: /^https:\/\/[a-z0-9-]+\.convex\.cloud\b/, confidence: 'high' as const, suggestedKeyName: 'NEXT_PUBLIC_CONVEX_URL' },

  // === Turso ===
  { serviceId: SID.turso, serviceName: 'Turso', regex: /^libsql:\/\//, confidence: 'high' as const, suggestedKeyName: 'TURSO_DATABASE_URL' },

  // === Shopify ===
  { serviceId: SID.shopify_api, serviceName: 'Shopify', prefix: 'shpat_', confidence: 'high' as const, suggestedKeyName: 'SHOPIFY_ACCESS_TOKEN' },
  { serviceId: SID.shopify_api, serviceName: 'Shopify', prefix: 'shpca_', confidence: 'high' as const, suggestedKeyName: 'SHOPIFY_API_KEY' },
  { serviceId: SID.shopify_api, serviceName: 'Shopify', prefix: 'shpss_', confidence: 'high' as const, suggestedKeyName: 'SHOPIFY_API_SECRET' },

  // === Stability AI ===
  { serviceId: SID.stability_ai, serviceName: 'Stability AI', prefix: 'sk-', confidence: 'low' as const, suggestedKeyName: 'STABILITY_API_KEY',
    disambiguator: (v: string) => !v.startsWith('sk-StabilityAI'),
  },

  // === Firebase ===
  { serviceId: SID.firebase, serviceName: 'Firebase', regex: /^https:\/\/[a-z0-9-]+\.firebaseio\.com\b/, confidence: 'high' as const, suggestedKeyName: 'FIREBASE_DATABASE_URL' },
  { serviceId: SID.firebase, serviceName: 'Firebase', regex: /^[a-z0-9-]+\.firebaseapp\.com$/, confidence: 'high' as const, suggestedKeyName: 'FIREBASE_AUTH_DOMAIN' },

  // === Polar ===
  { serviceId: SID.polar, serviceName: 'Polar', prefix: 'polar_at_', confidence: 'high' as const, suggestedKeyName: 'POLAR_ACCESS_TOKEN' },
].sort((a, b) => {
  // 긴 접두사 우선
  const aLen = a.prefix?.length ?? 0;
  const bLen = b.prefix?.length ?? 0;
  return bLen - aLen;
});

/**
 * 단일 API 키 값을 분석하여 매칭되는 서비스 목록 반환
 */
export function analyzeApiKeyValue(value: string): ApiKeyAnalysisResult[] {
  const trimmed = value.trim();
  if (!trimmed) return [];

  const results: ApiKeyAnalysisResult[] = [];
  const matchedServiceIds = new Set<string>();

  for (const pattern of API_KEY_PATTERNS) {
    // 이미 같은 서비스가 더 높은 confidence로 매칭되었으면 스킵
    if (matchedServiceIds.has(pattern.serviceId)) continue;

    let matched = false;
    let matchedPatternDesc = '';

    if (pattern.prefix) {
      if (trimmed.startsWith(pattern.prefix)) {
        // disambiguator가 true를 반환하면 이 패턴은 제외
        if (pattern.disambiguator && pattern.disambiguator(trimmed)) continue;
        matched = true;
        matchedPatternDesc = `prefix: ${pattern.prefix}`;
      }
    } else if (pattern.regex) {
      if (pattern.regex.test(trimmed)) {
        if (pattern.disambiguator && pattern.disambiguator(trimmed)) continue;
        matched = true;
        matchedPatternDesc = `regex: ${pattern.regex.source}`;
      }
    }

    if (matched) {
      matchedServiceIds.add(pattern.serviceId);
      results.push({
        serviceId: pattern.serviceId,
        serviceName: pattern.serviceName,
        confidence: pattern.confidence,
        matchedPattern: matchedPatternDesc,
        suggestedKeyName: pattern.suggestedKeyName,
      });
    }
  }

  // 다중 결과 시 confidence 낮추기
  if (results.length > 1) {
    for (const r of results) {
      if (r.confidence === 'high') r.confidence = 'medium';
    }
  }

  return results;
}

export interface EnvAnalysisEntry {
  keyName: string;
  value: string;
  /** 이름 기반 매칭 결과 */
  nameMatch: { serviceId: string; serviceName: string } | null;
  /** 값 기반 매칭 결과 */
  valueMatches: ApiKeyAnalysisResult[];
  /** 최종 추천 서비스 (이름 매칭 우선) */
  bestMatch: ApiKeyAnalysisResult | null;
}

/**
 * .env 대량 분석: 이름 + 값 이중 매칭
 */
export function analyzeEnvContent(
  entries: { key: string; value: string }[],
  exactMap: Map<string, { serviceId: string; serviceName: string }>,
  prefixMap: Map<string, { serviceId: string; serviceName: string }>,
): EnvAnalysisEntry[] {
  return entries.map((entry) => {
    const nameMatch = matchEnvKeyToServiceFuzzy(entry.key, exactMap, prefixMap);
    const valueMatches = analyzeApiKeyValue(entry.value);

    // 이름 매칭 우선 → 값 매칭 폴백
    let bestMatch: ApiKeyAnalysisResult | null = null;
    if (nameMatch) {
      bestMatch = {
        serviceId: nameMatch.serviceId,
        serviceName: nameMatch.serviceName,
        confidence: nameMatch.confidence === 'exact' ? 'high' : 'medium',
        matchedPattern: `key-name: ${entry.key}`,
        suggestedKeyName: entry.key,
      };
    } else if (valueMatches.length === 1) {
      bestMatch = valueMatches[0];
    } else if (valueMatches.length > 1) {
      // 다중 매칭 시 가장 높은 confidence
      const sorted = [...valueMatches].sort((a, b) => {
        const order: Record<MatchConfidence, number> = { high: 0, medium: 1, low: 2 };
        return order[a.confidence] - order[b.confidence];
      });
      bestMatch = sorted[0];
    }

    return {
      keyName: entry.key,
      value: entry.value,
      nameMatch: nameMatch ? { serviceId: nameMatch.serviceId, serviceName: nameMatch.serviceName } : null,
      valueMatches,
      bestMatch,
    };
  });
}
