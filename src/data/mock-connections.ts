import type { ServiceCategory } from '@/types';
import { getServiceEmoji } from '@/lib/constants/service-brands';

export type ConnectionStatus = 'connected' | 'in_progress' | 'not_started';

export interface MockConnection {
  id: string;
  name: string;
  category: ServiceCategory;
  emoji: string;
  iconSlug?: string;
  status: ConnectionStatus;
  envVars: { configured: number; total: number };
  checklist: { completed: number; total: number };
  lastChecked: string;
}

export const MOCK_CONNECTIONS: MockConnection[] = [
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'database',
    emoji: getServiceEmoji('supabase'),
    iconSlug: 'supabase',
    status: 'connected',
    envVars: { configured: 3, total: 3 },
    checklist: { completed: 6, total: 6 },
    lastChecked: '2분 전',
  },
  {
    id: 'naver-api',
    name: 'Naver API',
    category: 'other',
    emoji: getServiceEmoji('naver-api'),
    iconSlug: 'naver-api',
    status: 'connected',
    envVars: { configured: 2, total: 2 },
    checklist: { completed: 4, total: 4 },
    lastChecked: '5분 전',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    category: 'ai',
    emoji: getServiceEmoji('openai'),
    iconSlug: 'openai',
    status: 'connected',
    envVars: { configured: 1, total: 1 },
    checklist: { completed: 3, total: 3 },
    lastChecked: '10분 전',
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    category: 'ai',
    emoji: getServiceEmoji('google-gemini'),
    iconSlug: 'google-gemini',
    status: 'connected',
    envVars: { configured: 1, total: 1 },
    checklist: { completed: 2, total: 3 },
    lastChecked: '15분 전',
  },
  {
    id: 'cloud-run',
    name: 'Cloud Run OCR',
    category: 'other',
    emoji: getServiceEmoji('cloud-run'),
    iconSlug: 'cloud-run',
    status: 'in_progress',
    envVars: { configured: 1, total: 2 },
    checklist: { completed: 2, total: 4 },
    lastChecked: '30분 전',
  },
  {
    id: 'aladin',
    name: 'Aladin API',
    category: 'other',
    emoji: getServiceEmoji('aladin'),
    iconSlug: 'aladin',
    status: 'connected',
    envVars: { configured: 1, total: 1 },
    checklist: { completed: 2, total: 2 },
    lastChecked: '1시간 전',
  },
];
