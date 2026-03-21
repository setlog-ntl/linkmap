'use client';

import { Crown, Medal, Eye, Heart, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { MonthlyPick } from '@/types/core';

const RANK_CONFIG: Record<number, { icon: typeof Crown; color: string; borderColor: string; label: string }> = {
  1: { icon: Crown, color: 'text-yellow-500', borderColor: 'border-yellow-400/50', label: '대상' },
  2: { icon: Medal, color: 'text-gray-400', borderColor: 'border-gray-300/50', label: '최우수' },
  3: { icon: Medal, color: 'text-amber-600', borderColor: 'border-amber-500/50', label: '우수' },
};

interface MonthlyPickCardProps {
  pick: MonthlyPick;
}

export function MonthlyPickCard({ pick }: MonthlyPickCardProps) {
  const rankConfig = RANK_CONFIG[pick.rank];
  const showcase = pick.showcase;
  if (!showcase) return null;

  const Icon = rankConfig?.icon ?? Medal;
  const isFirst = pick.rank === 1;

  return (
    <Link
      prefetch={false}
      href={`/showcase/${showcase.id}`}
      className={cn(
        'group relative block rounded-xl border-2 overflow-hidden bg-card transition-all hover:shadow-md',
        rankConfig?.borderColor ?? 'border-border',
        isFirst && 'md:col-span-2 lg:col-span-1'
      )}
    >
      {/* 썸네일 */}
      {showcase.showcase_image_url ? (
        <div className={cn('relative overflow-hidden', isFirst ? 'h-48' : 'h-32')}>
          <img
            src={showcase.showcase_image_url}
            alt={showcase.site_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      ) : (
        <div className={cn(
          'flex items-center justify-center bg-muted',
          isFirst ? 'h-48' : 'h-32'
        )}>
          <Icon className={cn('h-10 w-10', rankConfig?.color ?? 'text-muted-foreground')} />
        </div>
      )}

      {/* 순위 배지 */}
      <div className={cn(
        'absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold',
        'bg-background/90 backdrop-blur-sm shadow-sm',
        rankConfig?.color ?? 'text-muted-foreground'
      )}>
        <Icon className="h-3.5 w-3.5" />
        {rankConfig?.label ?? `${pick.rank}위`}
      </div>

      {/* 정보 */}
      <div className="p-3 space-y-1.5">
        <h4 className="text-sm font-semibold truncate">{showcase.site_name}</h4>
        <p className="text-xs text-muted-foreground truncate">
          {showcase.profiles?.name ?? '익명'}
        </p>

        {/* 통계 */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-red-400" />
            {showcase.like_count ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {showcase.comment_count ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {showcase.view_count ?? 0}
          </span>
          {pick.score_snapshot != null && (
            <span className="ml-auto text-[10px] font-mono text-brand-blue">
              {pick.score_snapshot}pt
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
