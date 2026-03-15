'use client';

import { useShowcaseLeaderboard } from '@/lib/queries/showcase';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, MessageSquare, Crown, Medal } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const RANK_STYLES: Record<number, { icon: typeof Crown; color: string; bg: string }> = {
  1: { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  2: { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-400/10' },
  3: { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/10' },
};

export function ShowcaseLeaderboard() {
  const { data: showcases, isLoading } = useShowcaseLeaderboard();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!showcases || showcases.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        아직 추천된 쇼케이스가 없습니다
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {showcases.map((item, index) => {
        const rank = index + 1;
        const rankStyle = RANK_STYLES[rank];
        const authorName = item.profiles?.name || '익명';
        const authorInitial = authorName.charAt(0).toUpperCase();

        return (
          <Link
            key={item.id}
            href={`/showcase/${item.id}`}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors',
              rankStyle?.bg
            )}
          >
            {/* 순위 */}
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              {rankStyle ? (
                <rankStyle.icon className={cn('h-5 w-5', rankStyle.color)} />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">{rank}</span>
              )}
            </div>

            {/* 프로필 */}
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={item.profiles?.avatar_url || undefined} alt={authorName} />
              <AvatarFallback className="text-xs">{authorInitial}</AvatarFallback>
            </Avatar>

            {/* 정보 */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate">{item.site_name}</h4>
              <p className="text-xs text-muted-foreground truncate">{authorName}</p>
            </div>

            {/* 카테고리 */}
            {item.showcase_category && (
              <Badge variant="secondary" className="text-[10px] shrink-0 hidden sm:inline-flex">
                {item.showcase_category}
              </Badge>
            )}

            {/* 통계 */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Heart className="h-3.5 w-3.5 text-red-400" />
                {item.like_count ?? 0}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                {item.comment_count ?? 0}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
