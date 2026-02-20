import type { ServiceCategory, ViewGroup } from '@/types';

const CATEGORY_TO_GROUP: Record<ServiceCategory, ViewGroup> = {
  database: 'core', auth: 'core', social_login: 'core', cache: 'core', search: 'core',
  deploy: 'runtime', serverless: 'runtime', cdn: 'runtime',
  email: 'growth', sms: 'growth', push: 'growth', payment: 'growth', analytics: 'growth', ecommerce: 'growth', chat: 'growth', cms: 'growth',
  ai: 'intelligence',
  storage: 'infra', monitoring: 'infra', logging: 'infra', cicd: 'infra', testing: 'infra', code_quality: 'infra', media: 'infra', queue: 'infra', feature_flags: 'infra', scheduling: 'infra', automation: 'infra', other: 'infra',
};

export interface ViewGroupMeta {
  key: ViewGroup;
  label: string;
  labelEn: string;
  icon: string;
  color: string;
  bgColor: string;
}

export const VIEW_GROUP_META: Record<ViewGroup, ViewGroupMeta> = {
  core: { key: 'core', label: '핵심', labelEn: 'Core', icon: 'Database', color: 'border-blue-500/30', bgColor: 'bg-blue-500/5' },
  runtime: { key: 'runtime', label: '런타임', labelEn: 'Runtime', icon: 'Rocket', color: 'border-green-500/30', bgColor: 'bg-green-500/5' },
  growth: { key: 'growth', label: '그로스', labelEn: 'Growth', icon: 'TrendingUp', color: 'border-purple-500/30', bgColor: 'bg-purple-500/5' },
  intelligence: { key: 'intelligence', label: '인텔리전스', labelEn: 'Intelligence', icon: 'Brain', color: 'border-amber-500/30', bgColor: 'bg-amber-500/5' },
  infra: { key: 'infra', label: '인프라', labelEn: 'Infra', icon: 'Server', color: 'border-gray-500/30', bgColor: 'bg-gray-500/5' },
};

export const VIEW_GROUP_ORDER: ViewGroup[] = ['core', 'runtime', 'growth', 'intelligence', 'infra'];

export function categoryToViewGroup(category: ServiceCategory): ViewGroup {
  return CATEGORY_TO_GROUP[category] ?? 'infra';
}
