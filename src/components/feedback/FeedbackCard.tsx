'use client';

import Link from 'next/link';
import { MessageSquare, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useToggleFeedbackVote } from '@/lib/queries/feedback';
import type { FeatureRequestWithMeta, FeatureRequestCategory, FeatureRequestStatus } from '@/types/feedback';

interface FeedbackCardProps {
  item: FeatureRequestWithMeta;
  isLoggedIn: boolean;
}

const CATEGORY_BADGE: Record<FeatureRequestCategory, { label: string; className: string }> = {
  feature: { label: '기능 추가', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  bug: { label: '버그 신고', className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  improvement: { label: '개선 요청', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
};

const STATUS_BADGE: Record<FeatureRequestStatus, { label: string; className: string }> = {
  pending: { label: '검토 대기', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  in_review: { label: '검토 중', className: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' },
  planned: { label: '계획됨', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  in_progress: { label: '진행 중', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  completed: { label: '완료', className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  rejected: { label: '거절됨', className: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300' },
};

export function FeedbackCard({ item, isLoggedIn }: FeedbackCardProps) {
  const { mutate: toggleVote, isPending } = useToggleFeedbackVote();

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.info('로그인 후 이용 가능합니다', {
        description: '투표하려면 로그인이 필요합니다.',
        action: { label: '로그인', onClick: () => { window.location.href = '/signin'; } },
      });
      return;
    }
    toggleVote({ id: item.id, hasVoted: item.has_voted });
  };

  const catBadge = CATEGORY_BADGE[item.category];
  const stsBadge = STATUS_BADGE[item.status];

  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex gap-4">
      {/* 투표 버튼 */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <Button
          variant={item.has_voted ? 'default' : 'outline'}
          size="sm"
          className="flex flex-col items-center h-auto px-2 py-1.5 min-w-[42px]"
          onClick={handleVote}
          disabled={isPending}
          aria-label="투표"
        >
          <ChevronUp className="h-4 w-4" />
          <span className="text-xs font-semibold">{item.vote_count}</span>
        </Button>
      </div>

      {/* 본문 */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${catBadge.className}`}>
            {catBadge.label}
          </span>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stsBadge.className}`}>
            {stsBadge.label}
          </span>
        </div>

        <Link href={`/feedback/${item.id}`} className="group">
          <h3 className="font-semibold text-sm leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
            {item.title}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>

        {/* 하단 */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              {!item.is_anonymous && <AvatarImage src={item.author.avatar_url ?? undefined} />}
              <AvatarFallback className="text-[10px]">
                {item.is_anonymous ? '?' : (item.author.name?.charAt(0) ?? '?')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {item.is_anonymous ? '익명' : (item.author.name ?? '익명')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{item.comment_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CATEGORY_BADGE, STATUS_BADGE };
