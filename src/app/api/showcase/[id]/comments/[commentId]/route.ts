import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, serverError, apiError } from '@/lib/api/errors';

// DELETE: 댓글 삭제
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const { id, commentId } = await params;
  const supabase = await createClient();

  // 1. 인증
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. 댓글 존재 + 소유권 확인
  const { data: comment } = await supabase
    .from('showcase_comments')
    .select('id, user_id, showcase_source')
    .eq('id', commentId)
    .eq('showcase_id', id)
    .maybeSingle();

  if (!comment) return notFoundError('댓글');
  if (comment.user_id !== user.id) return apiError('본인의 댓글만 삭제할 수 있습니다', 403);

  // 3. 삭제
  const { error } = await supabase
    .from('showcase_comments')
    .delete()
    .eq('id', commentId);

  if (error) return serverError('댓글 삭제 실패');

  // 4. 댓글 수 감소
  const table = comment.showcase_source === 'deploy' ? 'homepage_deploys' : 'projects';
  const { data: item } = await supabase
    .from(table)
    .select('comment_count')
    .eq('id', id)
    .maybeSingle();

  if (item) {
    await supabase
      .from(table)
      .update({ comment_count: Math.max(0, (item.comment_count ?? 0) - 1) })
      .eq('id', id);
  }

  return NextResponse.json({ success: true });
}
