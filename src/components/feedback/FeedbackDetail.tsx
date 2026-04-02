'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronUp, ShieldAlert, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useFeedbackDetail, useToggleFeedbackVote, useDeleteFeedback } from '@/lib/queries/feedback';
import { FeedbackCommentList } from './FeedbackCommentList';
import { FeedbackAdminPanel } from './FeedbackAdminPanel';
import { CATEGORY_BADGE, STATUS_BADGE } from './FeedbackCard';

interface FeedbackDetailProps {
  id: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
  currentUserId?: string | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function FeedbackDetail({ id, isLoggedIn, isAdmin, currentUserId }: FeedbackDetailProps) {
  const { data: item, isLoading, isError } = useFeedbackDetail(id);
  const { mutate: toggleVote, isPending: isVoting } = useToggleFeedbackVote();
  const { mutate: deleteFeedback, isPending: isDeleting } = useDeleteFeedback();

  const handleVote = () => {
    if (!isLoggedIn) {
      toast.info('로그인 후 이용 가능합니다', {
        action: { label: '로그인', onClick: () => { window.location.href = '/login'; } },
      });
      return;
    }
    if (!item) return;
    toggleVote({ id, hasVoted: item.has_voted });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        요청을 찾을 수 없습니다.{' '}
        <Link prefetch={false} href="/feedback" className="text-brand-blue hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const catBadge = CATEGORY_BADGE[item.category];
  const stsBadge = STATUS_BADGE[item.status];
  const isOwner = currentUserId ? item.user_id === currentUserId : false;
  const canDelete = isAdmin || isOwner;

  const handleDelete = () => {
    if (!canDelete) return;
    if (
      !window.confirm(
        '이 기능 요청을 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.',
      )
    ) {
      return;
    }
    deleteFeedback(id);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* 뒤로가기 */}
      <Link
        href="/feedback"
        prefetch={false}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        목록으로
      </Link>

      {/* 메인 카드 */}
      <div className="bg-card border rounded-lg p-6 shadow-sm space-y-4">
        {/* 배지 */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${catBadge.className}`}>
            {catBadge.label}
          </span>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stsBadge.className}`}>
            {stsBadge.label}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold mb-2">{item.title}</h1>
          {canDelete && (
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label="요청 삭제"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* 작성자 & 날짜 */}
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-6 w-6">
            {!item.is_anonymous && <AvatarImage src={item.author.avatar_url ?? undefined} />}
            <AvatarFallback className="text-xs">
              {item.is_anonymous ? '?' : (item.author.name?.charAt(0) ?? '?')}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {item.is_anonymous ? '익명' : (item.author.name ?? '익명')}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{formatDate(item.created_at)}</span>
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap">{item.description}</p>

        {/* 투표 버튼 */}
        <div className="mt-6 pt-4 border-t flex items-center gap-3">
          <Button
            variant={item.has_voted ? 'default' : 'outline'}
            size="sm"
            onClick={handleVote}
            disabled={isVoting}
            className="flex items-center gap-2"
          >
            <ChevronUp className="h-4 w-4" />
            {item.has_voted ? '투표 취소' : '투표하기'}
            <span className="font-bold">{item.vote_count}</span>
          </Button>
        </div>
      </div>

      {/* 관리자 노트 */}
      {item.admin_note && (
        <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-brand-blue/30 rounded-lg">
          <ShieldAlert className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-brand-blue mb-1">관리자 노트</p>
            <p className="text-sm whitespace-pre-wrap">{item.admin_note}</p>
          </div>
        </div>
      )}

      {/* 관리자 패널 */}
      {isAdmin && <FeedbackAdminPanel id={id} currentStatus={item.status} currentAdminNote={item.admin_note} />}

      {/* 댓글 */}
      <FeedbackCommentList feedbackId={id} isLoggedIn={isLoggedIn} />
    </div>
  );
}
