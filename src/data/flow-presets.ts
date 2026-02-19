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
// Complex Flow: ReadingTree (독서트리)
// ---------------------------------------------------------------------------
export const COMPLEX_FLOW: FlowPreset = {
  id: 'complex',
  name: '복잡한 흐름 (ReadingTree)',
  description: 'ReadingTree(독서트리) 서비스의 실제 연동 구조',
  nodes: [
    // Source
    { id: 'github', label: 'GitHub', category: 'cicd', emoji: getServiceEmoji('github'), iconSlug: 'github', x: 50, y: 200, status: 'connected', envVars: { configured: 1, total: 1 } },
    // Frontend layer
    { id: 'nextjs', label: 'Next.js', category: 'deploy', emoji: getServiceEmoji('nextjs'), iconSlug: 'nextjs', x: 280, y: 130, status: 'connected', envVars: { configured: 0, total: 0 } },
    { id: 'vercel', label: 'Vercel', category: 'deploy', emoji: getServiceEmoji('vercel'), iconSlug: 'vercel', x: 280, y: 250, status: 'connected', envVars: { configured: 2, total: 2 } },
    { id: 'ga4', label: 'GA4', category: 'monitoring', emoji: getServiceEmoji('ga4'), iconSlug: 'ga4', x: 280, y: 350, status: 'connected', envVars: { configured: 1, total: 1 } },
    { id: 'kakao-login', label: 'Kakao Login', category: 'auth', emoji: getServiceEmoji('kakao-login'), iconSlug: 'kakao-login', x: 280, y: 440, status: 'connected', envVars: { configured: 1, total: 1 } },
    // Backend
    { id: 'backend', label: 'Backend API', category: 'other', emoji: getServiceEmoji('backend'), iconSlug: 'backend', x: 510, y: 200, status: 'connected', envVars: { configured: 0, total: 0 } },
    // Database / External APIs
    { id: 'supabase', label: 'Supabase', category: 'database', emoji: getServiceEmoji('supabase'), iconSlug: 'supabase', x: 740, y: 100, status: 'connected', envVars: { configured: 3, total: 3 } },
    { id: 'naver-api', label: 'Naver API', category: 'other', emoji: getServiceEmoji('naver-api'), iconSlug: 'naver-api', x: 740, y: 220, status: 'connected', envVars: { configured: 2, total: 2 } },
    { id: 'cloud-run', label: 'Cloud Run OCR', category: 'other', emoji: getServiceEmoji('cloud-run'), iconSlug: 'cloud-run', x: 740, y: 330, status: 'in_progress', envVars: { configured: 1, total: 2 } },
    // AI / Metadata
    { id: 'openai', label: 'OpenAI', category: 'ai', emoji: getServiceEmoji('openai'), iconSlug: 'openai', x: 970, y: 100, status: 'connected', envVars: { configured: 1, total: 1 } },
    { id: 'google-gemini', label: 'Google Gemini', category: 'ai', emoji: getServiceEmoji('google-gemini'), iconSlug: 'google-gemini', x: 970, y: 220, status: 'connected', envVars: { configured: 1, total: 1 } },
    { id: 'aladin', label: 'Aladin', category: 'other', emoji: getServiceEmoji('aladin'), iconSlug: 'aladin', x: 970, y: 330, status: 'connected', envVars: { configured: 1, total: 1 } },
  ],
  edges: [
    { source: 'github', target: 'nextjs', label: 'CI/CD' },
    { source: 'nextjs', target: 'vercel', label: 'Deploy' },
    { source: 'nextjs', target: 'ga4', label: 'Analytics' },
    { source: 'nextjs', target: 'kakao-login', label: 'OAuth' },
    { source: 'nextjs', target: 'backend', label: 'API Calls' },
    { source: 'backend', target: 'supabase', label: 'DB/Auth' },
    { source: 'backend', target: 'naver-api', label: '도서 검색' },
    { source: 'backend', target: 'cloud-run', label: 'OCR' },
    { source: 'backend', target: 'openai', label: 'AI' },
    { source: 'backend', target: 'google-gemini', label: 'AI' },
    { source: 'backend', target: 'aladin', label: '메타데이터' },
  ],
  stats: { services: 10, envVars: 15, setupTime: '1-2시간' },
};

// ---------------------------------------------------------------------------
// Hero diagram preset: ReadingTree (독서트리) architecture
// ---------------------------------------------------------------------------
export const HERO_FLOW: FlowPreset = {
  id: 'hero',
  name: 'ReadingTree 아키텍처',
  description: 'ReadingTree(독서트리) 서비스의 실제 연동 구조',
  nodes: [
    // Source
    { id: 'github', label: 'GitHub', category: 'cicd', emoji: getServiceEmoji('github'), iconSlug: 'github', x: 50, y: 200, status: 'connected', envVars: { configured: 1, total: 1 } },
    // Frontend layer
    { id: 'nextjs', label: 'Next.js', category: 'deploy', emoji: getServiceEmoji('nextjs'), iconSlug: 'nextjs', x: 280, y: 130, status: 'connected', envVars: { configured: 0, total: 0 } },
    { id: 'vercel', label: 'Vercel', category: 'deploy', emoji: getServiceEmoji('vercel'), iconSlug: 'vercel', x: 280, y: 250, status: 'connected', envVars: { configured: 2, total: 2 } },
    { id: 'ga4', label: 'GA4', category: 'monitoring', emoji: getServiceEmoji('ga4'), iconSlug: 'ga4', x: 280, y: 350, status: 'connected', envVars: { configured: 1, total: 1 } },
    { id: 'kakao-login', label: 'Kakao Login', category: 'auth', emoji: getServiceEmoji('kakao-login'), iconSlug: 'kakao-login', x: 280, y: 440, status: 'connected', envVars: { configured: 1, total: 1 } },
    // Backend
    { id: 'backend', label: 'Backend API', category: 'other', emoji: getServiceEmoji('backend'), iconSlug: 'backend', x: 510, y: 200, status: 'connected', envVars: { configured: 0, total: 0 } },
    // Database / External APIs
    { id: 'supabase', label: 'Supabase', category: 'database', emoji: getServiceEmoji('supabase'), iconSlug: 'supabase', x: 740, y: 100, status: 'connected', envVars: { configured: 3, total: 3 } },
    { id: 'naver-api', label: 'Naver API', category: 'other', emoji: getServiceEmoji('naver-api'), iconSlug: 'naver-api', x: 740, y: 220, status: 'connected', envVars: { configured: 2, total: 2 } },
    { id: 'cloud-run', label: 'Cloud Run OCR', category: 'other', emoji: getServiceEmoji('cloud-run'), iconSlug: 'cloud-run', x: 740, y: 330, status: 'in_progress', envVars: { configured: 1, total: 2 } },
    // AI / Metadata
    { id: 'openai', label: 'OpenAI', category: 'ai', emoji: getServiceEmoji('openai'), iconSlug: 'openai', x: 970, y: 100, status: 'connected', envVars: { configured: 1, total: 1 } },
    { id: 'google-gemini', label: 'Google Gemini', category: 'ai', emoji: getServiceEmoji('google-gemini'), iconSlug: 'google-gemini', x: 970, y: 220, status: 'connected', envVars: { configured: 1, total: 1 } },
    { id: 'aladin', label: 'Aladin', category: 'other', emoji: getServiceEmoji('aladin'), iconSlug: 'aladin', x: 970, y: 330, status: 'connected', envVars: { configured: 1, total: 1 } },
  ],
  edges: [
    { source: 'github', target: 'nextjs', label: 'CI/CD' },
    { source: 'nextjs', target: 'vercel', label: 'Deploy' },
    { source: 'nextjs', target: 'ga4', label: 'Analytics' },
    { source: 'nextjs', target: 'kakao-login', label: 'OAuth' },
    { source: 'nextjs', target: 'backend', label: 'API Calls' },
    { source: 'backend', target: 'supabase', label: 'DB/Auth' },
    { source: 'backend', target: 'naver-api', label: '도서 검색' },
    { source: 'backend', target: 'cloud-run', label: 'OCR' },
    { source: 'backend', target: 'openai', label: 'AI' },
    { source: 'backend', target: 'google-gemini', label: 'AI' },
    { source: 'backend', target: 'aladin', label: '메타데이터' },
  ],
  stats: { services: 10, envVars: 15, setupTime: '1-2시간' },
};
