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

  // profiles 조인 시도
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

  if (!error) {
    const formatted = (comments || []).map((c) => {
      const prof = Array.isArray(c.profiles) ? c.profiles[0] ?? null : c.profiles ?? null;
      return { ...c, profiles: prof };
    });
    return NextResponse.json({ comments: formatted });
  }

  // profiles 조인 실패 시 별도 조회 fallback
  const { data: rawComments, error: rawError } = await supabase
    .from('showcase_comments')
    .select('id, showcase_id, showcase_source, user_id, content, created_at, updated_at')
    .eq('showcase_id', id)
    .order('created_at', { ascending: true })
    .limit(100);

  if (rawError) return serverError('댓글 조회 실패');

  // user_id 목록으로 profiles 일괄 조회
  const userIds = [...new Set((rawComments || []).map((c) => c.user_id))];
  const profileMap = new Map<string, { name: string | null; avatar_url: string | null }>();

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', userIds);

    for (const p of profiles || []) {
      profileMap.set(p.id, { name: p.name, avatar_url: p.avatar_url });
    }
  }

  const formatted = (rawComments || []).map((c) => ({
    ...c,
    profiles: profileMap.get(c.user_id) ?? null,
  }));

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
    .select('id, showcase_id, showcase_source, user_id, content, created_at, updated_at')
    .single();

  if (error) return serverError('댓글 작성 실패');

  // 프로필 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  // 4. 댓글 수 증가 (RPC로 RLS 우회)
  const table = source === 'deploy' ? 'homepage_deploys' : 'projects';
  await supabase.rpc('increment_showcase_counter', {
    p_table: table,
    p_id: id,
    p_column: 'comment_count',
    p_delta: 1,
  });

  return NextResponse.json({ ...comment, profiles: profile ?? null }, { status: 201 });
}
