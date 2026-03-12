import type { ServiceCategory, ViewGroup } from '@/types';

const CATEGORY_TO_GROUP: Record<ServiceCategory, ViewGroup> = {
  database: 'core', auth: 'core', social_login: 'core', cache: 'core', search: 'core',
  deploy: 'runtime', serverless: 'runtime', cdn: 'runtime',
  email: 'growth', sms: 'growth', push: 'growth', payment: 'growth', analytics: 'growth', ecommerce: 'growth', chat: 'growth', cms: 'growth',
  ai: 'intelligence',
  storage: 'infra', monitoring: 'infra', logging: 'infra', cicd: 'infra', testing: 'infra', code_quality: 'infra', media: 'infra', queue: 'infra', feature_flags: 'infra', scheduling: 'infra', automation: 'infra', other: 'infra', domain: 'runtime', advertising: 'growth',
};

export interface ViewGroupMeta {
  key: ViewGroup;
  label: string;
  labelEn: string;
  icon: string;
  color: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientId: string;
}

export const VIEW_GROUP_META: Record<ViewGroup, ViewGroupMeta> = {
  core: { key: 'core', label: '핵심', labelEn: 'Core', icon: 'Database', color: 'border-blue-500/30', bgColor: 'bg-blue-500/5', gradientFrom: '#2563eb', gradientTo: '#7c3aed', gradientId: 'gm-core' },
  runtime: { key: 'runtime', label: '런타임', labelEn: 'Runtime', icon: 'Rocket', color: 'border-green-500/30', bgColor: 'bg-green-500/5', gradientFrom: '#059669', gradientTo: '#0891b2', gradientId: 'gm-runtime' },
  growth: { key: 'growth', label: '그로스', labelEn: 'Growth', icon: 'TrendingUp', color: 'border-purple-500/30', bgColor: 'bg-purple-500/5', gradientFrom: '#7c3aed', gradientTo: '#db2777', gradientId: 'gm-growth' },
  intelligence: { key: 'intelligence', label: '인텔리전스', labelEn: 'Intelligence', icon: 'Brain', color: 'border-amber-500/30', bgColor: 'bg-amber-500/5', gradientFrom: '#8b5cf6', gradientTo: '#ec4899', gradientId: 'gm-intel' },
  infra: { key: 'infra', label: '인프라', labelEn: 'Infra', icon: 'Server', color: 'border-gray-500/30', bgColor: 'bg-gray-500/5', gradientFrom: '#475569', gradientTo: '#64748b', gradientId: 'gm-infra' },
};

export const VIEW_GROUP_ORDER: ViewGroup[] = ['core', 'runtime', 'growth', 'intelligence', 'infra'];

export function categoryToViewGroup(category: ServiceCategory): ViewGroup {
  return CATEGORY_TO_GROUP[category] ?? 'infra';
}
