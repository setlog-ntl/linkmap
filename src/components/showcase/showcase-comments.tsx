'use client';

import { useState } from 'react';
import { useShowcaseComments, useCreateShowcaseComment, useDeleteShowcaseComment } from '@/lib/queries/showcase';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShowcaseCommentsProps {
  showcaseId: string;
  source: 'deploy' | 'project';
  currentUserId?: string;
}

export function ShowcaseComments({ showcaseId, source, currentUserId }: ShowcaseCommentsProps) {
  const { data: comments, isLoading } = useShowcaseComments(showcaseId);
  const createComment = useCreateShowcaseComment();
  const deleteComment = useDeleteShowcaseComment();
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) return;
    if (!currentUserId) {
      toast.error('로그인이 필요합니다');
      return;
    }

    createComment.mutate(
      { showcaseId, source, content: content.trim() },
      {
        onSuccess: () => {
          setContent('');
          toast.success('댓글이 등록되었습니다');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleDelete = (commentId: string) => {
    deleteComment.mutate(
      { showcaseId, commentId },
      {
        onSuccess: () => toast.success('댓글이 삭제되었습니다'),
        onError: (error) => toast.error(error.message),
      }
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        댓글 {comments && comments.length > 0 && `(${comments.length})`}
      </h3>

      {/* 댓글 입력 */}
      <div className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={currentUserId ? '댓글을 입력하세요 (최대 500자)' : '로그인 후 댓글을 작성할 수 있습니다'}
          disabled={!currentUserId || createComment.isPending}
          maxLength={500}
          rows={3}
          className="resize-none text-sm"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {content.length}/500
          </span>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim() || !currentUserId || createComment.isPending}
          >
            {createComment.isPending && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
            등록
          </Button>
        </div>
      </div>

      {/* 댓글 목록 */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => {
            const name = comment.profiles?.name || '익명';
            const initial = name.charAt(0).toUpperCase();
            const isOwner = currentUserId === comment.user_id;

            return (
              <div key={comment.id} className="flex gap-3 group">
                <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                  <AvatarImage src={comment.profiles?.avatar_url || undefined} alt={name} />
                  <AvatarFallback className="text-[10px]">{initial}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{name}</span>
                    <span className="text-[10px] text-muted-foreground">{formatDate(comment.created_at)}</span>
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.id)}
                        disabled={deleteComment.isPending}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-6">
          아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
        </p>
      )}
    </div>
  );
}
