import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { unauthorizedError, validationError, serverError } from '@/lib/api/errors';

const commentSchema = z.object({
  source: z.enum(['deploy', 'project']),
  content: z.string().min(1, '댓글 내용을 입력해주세요').max(500, '댓글은 500자 이내로 작성해주세요'),
});

// GET: 댓글 목록 조회
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: comments, error } = await supabase
    .from('showcase_comments')
    .select(`
      id,
      showcase_id,
      showcase_source,
      user_id,
      content,
      created_at,
      updated_at,
      profiles:user_id (
        name,
        avatar_url
      )
    `)
    .eq('showcase_id', id)
    .order('created_at', { ascending: true })
    .limit(100);

  if (error) return serverError('댓글 조회 실패');

  const formatted = (comments || []).map((c) => {
    const prof = Array.isArray(c.profiles) ? c.profiles[0] ?? null : c.profiles ?? null;
    return { ...c, profiles: prof };
  });

  return NextResponse.json({ comments: formatted });
}

// POST: 댓글 작성
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. 인증
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Zod 검증
  const body = await req.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { source, content } = parsed.data;

  // 3. 댓글 삽입
  const { data: comment, error } = await supabase
    .from('showcase_comments')
    .insert({
      showcase_id: id,
      showcase_source: source,
      user_id: user.id,
      content,
    })
    .select(`
      id,
      showcase_id,
      showcase_source,
      user_id,
      content,
      created_at,
      updated_at,
      profiles:user_id (
        name,
        avatar_url
      )
    `)
    .single();

  if (error) return serverError('댓글 작성 실패');

  // 4. 댓글 수 증가
  const table = source === 'deploy' ? 'homepage_deploys' : 'projects';
  const { data: item } = await supabase
    .from(table)
    .select('comment_count')
    .eq('id', id)
    .maybeSingle();

  if (item) {
    await supabase
      .from(table)
      .update({ comment_count: (item.comment_count ?? 0) + 1 })
      .eq('id', id);
  }

  const prof = Array.isArray(comment.profiles) ? comment.profiles[0] ?? null : comment.profiles ?? null;
  return NextResponse.json({ ...comment, profiles: prof }, { status: 201 });
}
