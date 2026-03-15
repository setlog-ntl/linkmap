'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShowcaseLikeStatus, useToggleShowcaseLike } from '@/lib/queries/showcase';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ShowcaseLikeButtonProps {
  showcaseId: string;
  source: 'deploy' | 'project';
  initialCount?: number;
  size?: 'sm' | 'default';
}

export function ShowcaseLikeButton({
  showcaseId,
  source,
  initialCount = 0,
  size = 'default',
}: ShowcaseLikeButtonProps) {
  const { data: likeStatus } = useShowcaseLikeStatus(showcaseId);
  const toggleLike = useToggleShowcaseLike();

  const liked = likeStatus?.liked ?? false;
  const count = likeStatus?.like_count ?? initialCount;

  const handleClick = () => {
    toggleLike.mutate(
      { showcaseId, source },
      {
        onError: (error) => {
          if (error.message.includes('인증')) {
            toast.error('로그인이 필요합니다');
          } else {
            toast.error(error.message);
          }
        },
      }
    );
  };

  return (
    <Button
      variant={liked ? 'default' : 'outline'}
      size={size}
      onClick={handleClick}
      disabled={toggleLike.isPending}
      className={cn(
        'gap-1.5 transition-all',
        liked && 'bg-red-500 hover:bg-red-600 border-red-500 text-white',
        size === 'sm' && 'h-8 text-xs px-2.5'
      )}
    >
      <Heart
        className={cn(
          size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
          liked && 'fill-current'
        )}
      />
      <span>{count}</span>
    </Button>
  );
}
