/**
 * 카테고리별 UI 스타일의 단일 소스
 *
 * 이전에 4개 파일에 분산되어 있던 카테고리 색상을 통합:
 * - service-node.tsx (categoryColors)
 * - flow-service-node.tsx (categoryColors)
 * - service-bento-card.tsx (accentGradients)
 * - project-card.tsx (categoryColors hex)
 * - services-grid.tsx (categoryColorMap)
 */
import type { ServiceCategory } from '@/types';

export interface CategoryStyle {
  /** service-node, flow-service-node용 Tailwind 클래스 */
  nodeClasses: string;
  /** services-grid 카드 border용 Tailwind 클래스 */
  gridBorderClasses: string;
  /** bento-card 상단 accent gradient 클래스 */
  accentGradient: string;
  /** project-card 미니맵 hex 색상 */
  hexColor: string;
}

export const CATEGORY_STYLES: Record<ServiceCategory, CategoryStyle> = {
  auth: {
    nodeClasses: 'bg-purple-50 border-purple-200 dark:bg-purple-950/50 dark:border-purple-800',
    gridBorderClasses: 'border-purple-300 dark:border-purple-700',
    accentGradient: 'from-purple-400 to-purple-600',
    hexColor: '#6366f1',
  },
  social_login: {
    nodeClasses: 'bg-purple-50 border-purple-300 dark:bg-purple-950/50 dark:border-purple-700',
    gridBorderClasses: 'border-purple-300 dark:border-purple-700',
    accentGradient: 'from-purple-400 to-purple-600',
    hexColor: '#8b5cf6',
  },
  database: {
    nodeClasses: 'bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800',
    gridBorderClasses: 'border-blue-300 dark:border-blue-700',
    accentGradient: 'from-blue-400 to-blue-600',
    hexColor: '#3b82f6',
  },
  deploy: {
    nodeClasses: 'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800',
    gridBorderClasses: 'border-green-300 dark:border-green-700',
    accentGradient: 'from-green-400 to-green-600',
    hexColor: '#22c55e',
  },
  email: {
    nodeClasses: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/50 dark:border-yellow-800',
    gridBorderClasses: 'border-yellow-300 dark:border-yellow-700',
    accentGradient: 'from-yellow-400 to-yellow-600',
    hexColor: '#f59e0b',
  },
  payment: {
    nodeClasses: 'bg-orange-50 border-orange-200 dark:bg-orange-950/50 dark:border-orange-800',
    gridBorderClasses: 'border-orange-300 dark:border-orange-700',
    accentGradient: 'from-orange-400 to-orange-600',
    hexColor: '#ef4444',
  },
  storage: {
    nodeClasses: 'bg-cyan-50 border-cyan-200 dark:bg-cyan-950/50 dark:border-cyan-800',
    gridBorderClasses: 'border-cyan-300 dark:border-cyan-700',
    accentGradient: 'from-cyan-400 to-cyan-600',
    hexColor: '#06b6d4',
  },
  monitoring: {
    nodeClasses: 'bg-pink-50 border-pink-200 dark:bg-pink-950/50 dark:border-pink-800',
    gridBorderClasses: 'border-pink-300 dark:border-pink-700',
    accentGradient: 'from-pink-400 to-pink-600',
    hexColor: '#f97316',
  },
  ai: {
    nodeClasses: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-800',
    gridBorderClasses: 'border-indigo-300 dark:border-indigo-700',
    accentGradient: 'from-indigo-400 to-indigo-600',
    hexColor: '#a855f7',
  },
  other: {
    nodeClasses: 'bg-gray-50 border-gray-200 dark:bg-gray-950/50 dark:border-gray-800',
    gridBorderClasses: 'border-gray-300 dark:border-gray-700',
    accentGradient: 'from-gray-400 to-gray-600',
    hexColor: '#6b7280',
  },
  cdn: {
    nodeClasses: 'bg-teal-50 border-teal-200 dark:bg-teal-950/50 dark:border-teal-800',
    gridBorderClasses: 'border-teal-300 dark:border-teal-700',
    accentGradient: 'from-teal-400 to-teal-600',
    hexColor: '#14b8a6',
  },
  cicd: {
    nodeClasses: 'bg-slate-50 border-slate-200 dark:bg-slate-950/50 dark:border-slate-700',
    gridBorderClasses: 'border-slate-300 dark:border-slate-700',
    accentGradient: 'from-slate-400 to-slate-600',
    hexColor: '#64748b',
  },
  testing: {
    nodeClasses: 'bg-lime-50 border-lime-200 dark:bg-lime-950/50 dark:border-lime-800',
    gridBorderClasses: 'border-lime-300 dark:border-lime-700',
    accentGradient: 'from-lime-400 to-lime-600',
    hexColor: '#84cc16',
  },
  sms: {
    nodeClasses: 'bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800',
    gridBorderClasses: 'border-amber-300 dark:border-amber-700',
    accentGradient: 'from-amber-400 to-amber-600',
    hexColor: '#f59e0b',
  },
  push: {
    nodeClasses: 'bg-rose-50 border-rose-200 dark:bg-rose-950/50 dark:border-rose-800',
    gridBorderClasses: 'border-rose-300 dark:border-rose-700',
    accentGradient: 'from-rose-400 to-rose-600',
    hexColor: '#f43f5e',
  },
  chat: {
    nodeClasses: 'bg-violet-50 border-violet-200 dark:bg-violet-950/50 dark:border-violet-800',
    gridBorderClasses: 'border-violet-300 dark:border-violet-700',
    accentGradient: 'from-violet-400 to-violet-600',
    hexColor: '#8b5cf6',
  },
  search: {
    nodeClasses: 'bg-sky-50 border-sky-200 dark:bg-sky-950/50 dark:border-sky-800',
    gridBorderClasses: 'border-sky-300 dark:border-sky-700',
    accentGradient: 'from-sky-400 to-sky-600',
    hexColor: '#0ea5e9',
  },
  cms: {
    nodeClasses: 'bg-fuchsia-50 border-fuchsia-200 dark:bg-fuchsia-950/50 dark:border-fuchsia-800',
    gridBorderClasses: 'border-fuchsia-300 dark:border-fuchsia-700',
    accentGradient: 'from-fuchsia-400 to-fuchsia-600',
    hexColor: '#d946ef',
  },
  analytics: {
    nodeClasses: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800',
    gridBorderClasses: 'border-emerald-300 dark:border-emerald-700',
    accentGradient: 'from-emerald-400 to-emerald-600',
    hexColor: '#ec4899',
  },
  media: {
    nodeClasses: 'bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800',
    gridBorderClasses: 'border-red-300 dark:border-red-700',
    accentGradient: 'from-red-400 to-red-600',
    hexColor: '#ef4444',
  },
  queue: {
    nodeClasses: 'bg-orange-50 border-orange-200 dark:bg-orange-950/50 dark:border-orange-800',
    gridBorderClasses: 'border-orange-300 dark:border-orange-700',
    accentGradient: 'from-orange-400 to-orange-600',
    hexColor: '#f97316',
  },
  cache: {
    nodeClasses: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/50 dark:border-yellow-800',
    gridBorderClasses: 'border-yellow-300 dark:border-yellow-700',
    accentGradient: 'from-yellow-400 to-yellow-600',
    hexColor: '#eab308',
  },
  logging: {
    nodeClasses: 'bg-stone-50 border-stone-200 dark:bg-stone-950/50 dark:border-stone-700',
    gridBorderClasses: 'border-stone-300 dark:border-stone-700',
    accentGradient: 'from-stone-400 to-stone-600',
    hexColor: '#78716c',
  },
  feature_flags: {
    nodeClasses: 'bg-zinc-50 border-zinc-200 dark:bg-zinc-950/50 dark:border-zinc-700',
    gridBorderClasses: 'border-zinc-300 dark:border-zinc-700',
    accentGradient: 'from-zinc-400 to-zinc-600',
    hexColor: '#71717a',
  },
  scheduling: {
    nodeClasses: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-800',
    gridBorderClasses: 'border-indigo-300 dark:border-indigo-700',
    accentGradient: 'from-indigo-400 to-indigo-600',
    hexColor: '#6366f1',
  },
  ecommerce: {
    nodeClasses: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800',
    gridBorderClasses: 'border-emerald-300 dark:border-emerald-700',
    accentGradient: 'from-emerald-400 to-emerald-600',
    hexColor: '#10b981',
  },
  serverless: {
    nodeClasses: 'bg-sky-50 border-sky-200 dark:bg-sky-950/50 dark:border-sky-800',
    gridBorderClasses: 'border-sky-300 dark:border-sky-700',
    accentGradient: 'from-sky-400 to-sky-600',
    hexColor: '#0ea5e9',
  },
  code_quality: {
    nodeClasses: 'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800',
    gridBorderClasses: 'border-green-300 dark:border-green-700',
    accentGradient: 'from-green-400 to-green-600',
    hexColor: '#22c55e',
  },
  automation: {
    nodeClasses: 'bg-violet-50 border-violet-200 dark:bg-violet-950/50 dark:border-violet-800',
    gridBorderClasses: 'border-violet-300 dark:border-violet-700',
    accentGradient: 'from-violet-400 to-violet-600',
    hexColor: '#8b5cf6',
  },
};

/** 카테고리 스타일 조회 (없으면 'other' 반환) */
export function getCategoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category as ServiceCategory] ?? CATEGORY_STYLES.other;
}
