/**
 * npm 패키지명 → Linkmap 서비스 slug 매핑 테이블
 *
 * 시드 데이터(services.ts, services-v2.ts)의 slug와 1:1 대응.
 * official_sdks 필드 기반 + 추가 알려진 패키지 보강.
 */
export const NPM_TO_SLUG: Record<string, string> = {
  // ── Database ──
  '@supabase/supabase-js': 'supabase',
  '@supabase/ssr': 'supabase',
  'firebase': 'firebase',
  'firebase-admin': 'firebase',
  '@firebase/app': 'firebase',
  '@prisma/client': 'prisma',
  'drizzle-orm': 'drizzle',
  '@planetscale/database': 'planetscale',
  '@neondatabase/serverless': 'neon',
  '@libsql/client': 'turso',
  'mongoose': 'mongodb',
  'mongodb': 'mongodb',
  'ioredis': 'redis-cloud',
  'redis': 'redis-cloud',
  '@upstash/redis': 'upstash-redis',
  '@upstash/ratelimit': 'upstash-redis',
  'convex': 'convex',
  '@vercel/kv': 'vercel-kv',

  // ── Auth ──
  '@clerk/nextjs': 'clerk',
  '@clerk/backend': 'clerk',
  '@clerk/themes': 'clerk',
  '@auth0/nextjs-auth0': 'auth0',
  '@auth0/auth0-react': 'auth0',
  'next-auth': 'nextauth',
  '@auth/core': 'nextauth',

  // ── Payment ──
  'stripe': 'stripe',
  '@paypal/checkout-server-sdk': 'paypal',
  '@paypal/react-paypal-js': 'paypal',
  '@lemonsqueezy/lemonsqueezy.js': 'lemon-squeezy',
  '@polar-sh/sdk': 'polar',
  '@paddle/paddle-node-sdk': 'paddle',
  '@tosspayments/payment-sdk': 'toss-payments',

  // ── AI / LLM ──
  'openai': 'openai',
  '@anthropic-ai/sdk': 'anthropic',
  'groq-sdk': 'groq',
  '@google/generative-ai': 'google-gemini',
  'replicate': 'replicate',
  '@huggingface/inference': 'huggingface',
  'langchain': 'langchain',
  '@langchain/core': 'langchain',
  '@pinecone-database/pinecone': 'pinecone',
  'cohere-ai': 'cohere',
  '@mistralai/mistralai': 'mistral-ai',
  'deepseek-ai': 'deepseek',
  '@fireworks-ai/sdk': 'fireworks-ai',
  'together-ai': 'together-ai',
  '@weaviate-client': 'weaviate',
  'weaviate-ts-client': 'weaviate',
  '@qdrant/js-client-rest': 'qdrant',
  'chromadb': 'chroma',
  'crewai': 'crewai',
  '@wandb/sdk': 'wandb',

  // ── Email ──
  'resend': 'resend',
  '@sendgrid/mail': 'sendgrid',
  'postmark': 'postmark',
  '@aws-sdk/client-ses': 'aws-ses',
  '@mailchimp/mailchimp_marketing': 'mailchimp',

  // ── Communication / Push ──
  'twilio': 'twilio',
  'pusher': 'pusher',
  'pusher-js': 'pusher',
  '@onesignal/node-onesignal': 'onesignal',

  // ── Monitoring / Analytics ──
  '@sentry/nextjs': 'sentry',
  '@sentry/node': 'sentry',
  '@sentry/react': 'sentry',
  'posthog-js': 'posthog',
  'posthog-node': 'posthog',
  '@datadog/browser-rum': 'datadog',
  'dd-trace': 'datadog',
  'mixpanel': 'mixpanel',
  'mixpanel-browser': 'mixpanel',
  '@logrocket/react': 'logrocket',
  'logrocket': 'logrocket',
  '@axiomhq/js': 'axiom',
  '@optelemetry/api': 'betterstack',
  'plausible-tracker': 'plausible',

  // ── Search ──
  'algoliasearch': 'algolia',
  'meilisearch': 'meilisearch',

  // ── CMS ──
  '@sanity/client': 'sanity',
  '@notionhq/client': 'notion-api',
  'contentful': 'contentful',
  '@payloadcms/richtext-slate': 'payload-cms',
  'payload': 'payload-cms',

  // ── Deploy / Infra ──
  '@vercel/analytics': 'vercel',
  '@vercel/speed-insights': 'vercel',
  '@aws-sdk/client-s3': 'aws-s3',
  '@cloudflare/workers-types': 'cloudflare',
  'cloudinary': 'cloudinary',
  'uploadthing': 'uploadthing',
  '@uploadthing/react': 'uploadthing',
  'imagekit': 'imagekit',

  // ── CI/CD / Testing ──
  '@playwright/test': 'playwright',
  'cypress': 'cypress',
  'vitest': 'vitest',

  // ── Task Queue / Scheduling ──
  'bullmq': 'bullmq',
  '@trigger.dev/sdk': 'trigger-dev',
  'inngest': 'inngest',

  // ── Feature Flags ──
  'launchdarkly-node-server-sdk': 'launchdarkly',
  '@launchdarkly/node-server-sdk': 'launchdarkly',

  // ── Chat / Social API ──
  'discord.js': 'discord-api',
  '@slack/web-api': 'slack-api',
  '@slack/bolt': 'slack-api',
  '@linear/sdk': 'linear-api',
  'shopify-api-node': 'shopify-api',
  '@shopify/shopify-api': 'shopify-api',

  // ── Media / Voice / Speech ──
  'elevenlabs': 'elevenlabs',
  '@deepgram/sdk': 'deepgram',
  'assemblyai': 'assemblyai',
  'playht': 'playht',

  // ── Map ──
  'mapbox-gl': 'mapbox',

  // ── SNS API ──
  'instagram-private-api': 'instagram-api',

  // ── Notification ──
  '@novu/node': 'novu',

  // ── Automation ──
  'n8n': 'n8n',

  // ── AI Coding ──
  '@anthropic-ai/claude-code': 'claude-code',

  // ── E-commerce ──
  '@google-analytics/data': 'ga4',

  // ── Observability ──
  'newrelic': 'new-relic',
  '@newrelic/next': 'new-relic',

  // ── AI Router ──
  'openrouter': 'openrouter',

  // ── Strapi (Headless CMS) ──
  '@strapi/strapi': 'strapi',
};
