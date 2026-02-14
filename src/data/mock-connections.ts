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
    id: 'clerk',
    name: 'Clerk',
    category: 'auth',
    emoji: getServiceEmoji('clerk'),
    iconSlug: 'clerk',
    status: 'in_progress',
    envVars: { configured: 2, total: 4 },
    checklist: { completed: 3, total: 5 },
    lastChecked: '15분 전',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'payment',
    emoji: getServiceEmoji('stripe'),
    iconSlug: 'stripe',
    status: 'not_started',
    envVars: { configured: 0, total: 3 },
    checklist: { completed: 0, total: 4 },
    lastChecked: '—',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'deploy',
    emoji: getServiceEmoji('vercel'),
    iconSlug: 'vercel',
    status: 'connected',
    envVars: { configured: 2, total: 2 },
    checklist: { completed: 4, total: 4 },
    lastChecked: '5분 전',
  },
  {
    id: 'resend',
    name: 'Resend',
    category: 'email',
    emoji: getServiceEmoji('resend'),
    iconSlug: 'resend',
    status: 'in_progress',
    envVars: { configured: 1, total: 2 },
    checklist: { completed: 2, total: 3 },
    lastChecked: '1시간 전',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    category: 'ai',
    emoji: getServiceEmoji('openai'),
    iconSlug: 'openai',
    status: 'not_started',
    envVars: { configured: 0, total: 1 },
    checklist: { completed: 0, total: 2 },
    lastChecked: '—',
  },
];
