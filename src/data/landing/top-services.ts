import type { ServiceDomain } from '@/types';

export interface TopService {
  slug: string;
  name: string;
  domain: ServiceDomain;
}

/**
 * Pre-computed top 20 services by popularity_score for the landing page.
 * Extracted from src/data/seed/services.ts to avoid bundling 220KB into the Worker.
 * Update this list when services.ts popularity_score values change significantly.
 */
export const TOP_SERVICES: TopService[] = [
  { slug: 'openai', name: 'OpenAI', domain: 'ai_ml' },
  { slug: 'github', name: 'GitHub', domain: 'devtools' },
  { slug: 'stripe', name: 'Stripe', domain: 'business' },
  { slug: 'vercel', name: 'Vercel', domain: 'infrastructure' },
  { slug: 'aws-s3', name: 'AWS S3', domain: 'infrastructure' },
  { slug: 'google-oauth', name: 'Google OAuth', domain: 'backend' },
  { slug: 'docker', name: 'Docker', domain: 'devtools' },
  { slug: 'supabase', name: 'Supabase', domain: 'backend' },
  { slug: 'kakao-login', name: 'Kakao Login', domain: 'backend' },
  { slug: 'github-copilot', name: 'GitHub Copilot', domain: 'devtools' },
  { slug: 'firebase', name: 'Firebase', domain: 'backend' },
  { slug: 'sentry', name: 'Sentry', domain: 'observability' },
  { slug: 'prisma', name: 'Prisma', domain: 'backend' },
  { slug: 'huggingface', name: 'Hugging Face', domain: 'backend' },
  { slug: 'anthropic', name: 'Anthropic', domain: 'ai_ml' },
  { slug: 'claude-code', name: 'Claude Code', domain: 'ai_ml' },
  { slug: 'naver-login', name: 'Naver Login', domain: 'backend' },
  { slug: 'auth0', name: 'Auth0', domain: 'backend' },
  { slug: 'langchain', name: 'LangChain', domain: 'backend' },
  { slug: 'paypal', name: 'PayPal', domain: 'business' },
];
