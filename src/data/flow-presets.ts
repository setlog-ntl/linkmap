import { getServiceEmoji } from '@/lib/constants/service-brands';

export type ConnectionStatus = 'connected' | 'in_progress' | 'not_started';

export interface FlowNodeDef {
  id: string;
  label: string;
  category: string;
  emoji: string;
  iconSlug?: string;
  x: number;
  y: number;
  status: ConnectionStatus;
  envVars: { configured: number; total: number };
}

export interface FlowEdgeDef {
  source: string;
  target: string;
  label?: string;
}

export interface FlowPreset {
  id: string;
  name: string;
  description: string;
  nodes: FlowNodeDef[];
  edges: FlowEdgeDef[];
  stats: { services: number; envVars: number; setupTime: string };
}

// ---------------------------------------------------------------------------
// Simple Flow: Blog / Portfolio
// ---------------------------------------------------------------------------
export const SIMPLE_FLOW: FlowPreset = {
  id: 'simple',
  name: '간단한 흐름 (블로그)',
  description: '블로그, 포트폴리오 등 간단한 프로젝트의 서비스 연결 구조',
  nodes: [
    { id: 'github', label: 'GitHub', category: 'cicd', emoji: getServiceEmoji('github'), iconSlug: 'github', x: 50, y: 120, status: 'connected', envVars: { configured: 1, total: 1 } },
    { id: 'nextjs', label: 'Next.js', category: 'deploy', emoji: getServiceEmoji('nextjs'), iconSlug: 'nextjs', x: 250, y: 120, status: 'connected', envVars: { configured: 0, total: 0 } },
    { id: 'vercel', label: 'Vercel', category: 'deploy', emoji: getServiceEmoji('vercel'), iconSlug: 'vercel', x: 450, y: 60, status: 'connected', envVars: { configured: 2, total: 2 } },
    { id: 'cloudinary', label: 'Cloudinary', category: 'storage', emoji: getServiceEmoji('cloudinary'), iconSlug: 'cloudinary', x: 450, y: 180, status: 'in_progress', envVars: { configured: 1, total: 2 } },
  ],
  edges: [
    { source: 'github', target: 'nextjs', label: 'CI/CD' },
    { source: 'nextjs', target: 'vercel', label: 'Deploy' },
    { source: 'nextjs', target: 'cloudinary', label: 'Images' },
  ],
  stats: { services: 3, envVars: 5, setupTime: '30분' },
};

// ---------------------------------------------------------------------------
// Complex Flow: SaaS Application
// ---------------------------------------------------------------------------
export const COMPLEX_FLOW: FlowPreset = {
  id: 'complex',
  name: '복잡한 흐름 (SaaS)',
  description: 'SaaS 애플리케이션의 복잡한 서비스 연결 구조',
  nodes: [
    { id: 'github', label: 'GitHub', category: 'cicd', emoji: getServiceEmoji('github'), iconSlug: 'github', x: 50, y: 180, status: 'connected', envVars: { configured: 1, total: 1 } },
    { id: 'nextjs', label: 'Next.js', category: 'deploy', emoji: getServiceEmoji('nextjs'), iconSlug: 'nextjs', x: 250, y: 120, status: 'connected', envVars: { configured: 0, total: 0 } },
    { id: 'vercel', label: 'Vercel', category: 'deploy', emoji: getServiceEmoji('vercel'), iconSlug: 'vercel', x: 250, y: 240, status: 'connected', envVars: { configured: 2, total: 2 } },
    { id: 'sentry', label: 'Sentry', category: 'monitoring', emoji: getServiceEmoji('sentry'), iconSlug: 'sentry', x: 250, y: 340, status: 'connected', envVars: { configured: 1, total: 1 } },
    { id: 'posthog', label: 'PostHog', category: 'monitoring', emoji: getServiceEmoji('posthog'), iconSlug: 'posthog', x: 250, y: 430, status: 'in_progress', envVars: { configured: 1, total: 2 } },
    { id: 'backend', label: 'Backend API', category: 'other', emoji: getServiceEmoji('backend'), iconSlug: 'backend', x: 470, y: 180, status: 'connected', envVars: { configured: 0, total: 0 } },
    { id: 'supabase', label: 'Supabase', category: 'database', emoji: getServiceEmoji('supabase'), iconSlug: 'supabase', x: 690, y: 60, status: 'connected', envVars: { configured: 3, total: 3 } },
    { id: 'clerk', label: 'Clerk', category: 'auth', emoji: getServiceEmoji('clerk'), iconSlug: 'clerk', x: 690, y: 160, status: 'in_progress', envVars: { configured: 2, total: 4 } },
    { id: 's3', label: 'S3', category: 'storage', emoji: getServiceEmoji('s3'), iconSlug: 's3', x: 690, y: 260, status: 'not_started', envVars: { configured: 0, total: 3 } },
    { id: 'stripe', label: 'Stripe', category: 'payment', emoji: getServiceEmoji('stripe'), iconSlug: 'stripe', x: 690, y: 360, status: 'not_started', envVars: { configured: 0, total: 3 } },
    { id: 'openai', label: 'OpenAI', category: 'ai', emoji: getServiceEmoji('openai'), iconSlug: 'openai', x: 900, y: 110, status: 'not_started', envVars: { configured: 0, total: 1 } },
    { id: 'resend', label: 'Resend', category: 'email', emoji: getServiceEmoji('resend'), iconSlug: 'resend', x: 900, y: 260, status: 'in_progress', envVars: { configured: 1, total: 2 } },
  ],
  edges: [
    { source: 'github', target: 'nextjs', label: 'CI/CD' },
    { source: 'nextjs', target: 'vercel', label: 'Deploy' },
    { source: 'nextjs', target: 'backend', label: 'API' },
    { source: 'nextjs', target: 'sentry', label: 'Errors' },
    { source: 'nextjs', target: 'posthog', label: 'Analytics' },
    { source: 'backend', target: 'supabase', label: 'Database' },
    { source: 'backend', target: 'clerk', label: 'Auth' },
    { source: 'backend', target: 's3', label: 'Storage' },
    { source: 'backend', target: 'stripe', label: 'Payments' },
    { source: 'backend', target: 'openai', label: 'AI' },
    { source: 'backend', target: 'resend', label: 'Email' },
  ],
  stats: { services: 10, envVars: 24, setupTime: '2-3시간' },
};

// ---------------------------------------------------------------------------
// Hero diagram preset (main architecture flow)
// ---------------------------------------------------------------------------
export const HERO_FLOW: FlowPreset = {
  id: 'hero',
  name: 'SaaS 아키텍처',
  description: '전형적인 SaaS 아키텍처 흐름',
  nodes: [
    // Source
    { id: 'github', label: 'GitHub', category: 'cicd', emoji: getServiceEmoji('github'), iconSlug: 'github', x: 50, y: 200, status: 'connected', envVars: { configured: 1, total: 1 } },
    // Frontend
    { id: 'nextjs', label: 'Next.js', category: 'deploy', emoji: getServiceEmoji('nextjs'), iconSlug: 'nextjs', x: 280, y: 130, status: 'connected', envVars: { configured: 2, total: 2 } },
    { id: 'vercel', label: 'Vercel', category: 'deploy', emoji: getServiceEmoji('vercel'), iconSlug: 'vercel', x: 280, y: 250, status: 'connected', envVars: { configured: 2, total: 2 } },
    { id: 'sentry', label: 'Sentry', category: 'monitoring', emoji: getServiceEmoji('sentry'), iconSlug: 'sentry', x: 280, y: 350, status: 'connected', envVars: { configured: 1, total: 1 } },
    { id: 'posthog', label: 'PostHog', category: 'monitoring', emoji: getServiceEmoji('posthog'), iconSlug: 'posthog', x: 280, y: 440, status: 'in_progress', envVars: { configured: 1, total: 2 } },
    // Backend
    { id: 'backend', label: 'Backend API', category: 'other', emoji: getServiceEmoji('backend'), iconSlug: 'backend', x: 510, y: 200, status: 'connected', envVars: { configured: 0, total: 0 } },
    // Database / Auth / Storage
    { id: 'supabase', label: 'Supabase', category: 'database', emoji: getServiceEmoji('supabase'), iconSlug: 'supabase', x: 740, y: 100, status: 'connected', envVars: { configured: 3, total: 3 } },
    { id: 'clerk', label: 'Clerk', category: 'auth', emoji: getServiceEmoji('clerk'), iconSlug: 'clerk', x: 740, y: 220, status: 'in_progress', envVars: { configured: 2, total: 4 } },
    { id: 's3', label: 'S3', category: 'storage', emoji: getServiceEmoji('s3'), iconSlug: 's3', x: 740, y: 330, status: 'not_started', envVars: { configured: 0, total: 3 } },
    // External Services
    { id: 'stripe', label: 'Stripe', category: 'payment', emoji: getServiceEmoji('stripe'), iconSlug: 'stripe', x: 970, y: 100, status: 'not_started', envVars: { configured: 0, total: 3 } },
    { id: 'openai', label: 'OpenAI', category: 'ai', emoji: getServiceEmoji('openai'), iconSlug: 'openai', x: 970, y: 220, status: 'not_started', envVars: { configured: 0, total: 1 } },
    { id: 'resend', label: 'Resend', category: 'email', emoji: getServiceEmoji('resend'), iconSlug: 'resend', x: 970, y: 330, status: 'in_progress', envVars: { configured: 1, total: 2 } },
  ],
  edges: [
    { source: 'github', target: 'nextjs', label: 'CI/CD' },
    { source: 'nextjs', target: 'vercel', label: 'Deploy' },
    { source: 'nextjs', target: 'backend', label: 'API Calls' },
    { source: 'nextjs', target: 'sentry', label: 'Errors' },
    { source: 'nextjs', target: 'posthog', label: 'Analytics' },
    { source: 'backend', target: 'supabase', label: 'Database' },
    { source: 'backend', target: 'clerk', label: 'Auth' },
    { source: 'backend', target: 's3', label: 'Storage' },
    { source: 'backend', target: 'stripe', label: 'Payments' },
    { source: 'backend', target: 'openai', label: 'AI' },
    { source: 'backend', target: 'resend', label: 'Email' },
  ],
  stats: { services: 11, envVars: 22, setupTime: '2-3시간' },
};
