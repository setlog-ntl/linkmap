'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useFeedbackComments, useCreateFeedbackComment } from '@/lib/queries/feedback';

interface FeedbackCommentListProps {
  feedbackId: string;
  isLoggedIn: boolean;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function FeedbackCommentList({ feedbackId, isLoggedIn }: FeedbackCommentListProps) {
  const [content, setContent] = useState('');
  const { data: comments, isLoading } = useFeedbackComments(feedbackId);
  const { mutate: createComment, isPending } = useCreateFeedbackComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('댓글을 입력해주세요');
      return;
    }
    createComment(
      { id: feedbackId, content: content.trim() },
      {
        onSuccess: () => {
          setContent('');
          toast.success('댓글이 등록되었습니다');
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : '댓글 등록 실패');
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">댓글 {comments ? `(${comments.length})` : ''}</h3>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : comments?.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">아직 댓글이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {comments?.map((comment) => (
            <div
              key={comment.id}
              className={`flex gap-3 p-3 rounded-lg border ${
                comment.is_admin_comment
                  ? 'border-brand-blue/40 bg-brand-blue/5'
                  : 'border-border bg-muted/30'
              }`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={comment.author.avatar_url ?? undefined} />
                <AvatarFallback className="text-xs">
                  {comment.author.name?.charAt(0) ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{comment.author.name ?? '익명'}</span>
                  {comment.is_admin_comment && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-brand-blue font-medium">
                      <ShieldCheck className="h-3 w-3" />
                      관리자
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 댓글 작성 */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요 (최대 1000자)"
            rows={3}
            maxLength={1000}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{content.length}/1000</span>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? '등록 중...' : '댓글 등록'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 text-sm text-muted-foreground border rounded-lg">
          댓글을 작성하려면{' '}
          <a href="/signin" className="text-brand-blue hover:underline font-medium">
            로그인
          </a>
          이 필요합니다.
        </div>
      )}
    </div>
  );
}
