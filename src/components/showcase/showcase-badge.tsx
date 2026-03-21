'use client';

import {
  Crown,
  Medal,
  Star,
  Heart,
  Layers,
  MessageSquare,
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShowcaseBadgeType } from '@/types/core';

const BADGE_CONFIG: Record<
  ShowcaseBadgeType,
  { icon: typeof Crown; color: string; bg: string; label: string }
> = {
  monthly_winner: {
    icon: Crown,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    label: '이달의 페이지 대상',
  },
  monthly_runner_up: {
    icon: Medal,
    color: 'text-gray-400',
    bg: 'bg-gray-400/10',
    label: '이달의 페이지 수상',
  },
  editors_choice: {
    icon: Star,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: '에디터 추천',
  },
  popular_creator: {
    icon: Heart,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    label: '인기 크리에이터',
  },
  prolific_creator: {
    icon: Layers,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    label: '다작 크리에이터',
  },
  community_star: {
    icon: MessageSquare,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    label: '커뮤니티 스타',
  },
  first_showcase: {
    icon: Rocket,
    color: 'text-gray-500',
    bg: 'bg-gray-500/10',
    label: '첫 쇼케이스',
  },
};

interface ShowcaseBadgeProps {
  type: ShowcaseBadgeType;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function ShowcaseBadgeIcon({ type, size = 'sm', showLabel = false, className }: ShowcaseBadgeProps) {
  const config = BADGE_CONFIG[type];
  if (!config) return null;

  const Icon = config.icon;
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full',
        size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-1',
        config.bg,
        className
      )}
      title={config.label}
    >
      <Icon className={cn(iconSize, config.color)} />
      {showLabel && (
        <span className={cn('text-[10px] font-medium', config.color)}>
          {config.label}
        </span>
      )}
    </span>
  );
}
