import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { unauthorizedError, validationError, serverError } from '@/lib/api/errors';

const likeSchema = z.object({
  source: z.enum(['deploy', 'project']),
});

// GET: 추천 상태 조회
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // 전체 추천수
  const { count } = await supabase
    .from('showcase_likes')
    .select('*', { count: 'exact', head: true })
    .eq('showcase_id', id);

  // 로그인한 사용자의 추천 여부
  let liked = false;
  if (user) {
    const { data: myLike } = await supabase
      .from('showcase_likes')
      .select('id')
      .eq('showcase_id', id)
      .eq('user_id', user.id)
      .maybeSingle();
    liked = !!myLike;
  }

  return NextResponse.json({ liked, like_count: count ?? 0 });
}

// POST: 추천 토글
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
  const parsed = likeSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { source } = parsed.data;

  // 3. 이미 추천했는지 확인
  const { data: existing } = await supabase
    .from('showcase_likes')
    .select('id')
    .eq('showcase_id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    // 추천 취소
    const { error: deleteError } = await supabase
      .from('showcase_likes')
      .delete()
      .eq('id', existing.id);
    if (deleteError) return serverError('추천 취소 실패');

    // 카운트 감소
    await updateLikeCount(supabase, id, source, -1);

    const { count } = await supabase
      .from('showcase_likes')
      .select('*', { count: 'exact', head: true })
      .eq('showcase_id', id);

    return NextResponse.json({ liked: false, like_count: count ?? 0 });
  } else {
    // 추천
    const { error: insertError } = await supabase
      .from('showcase_likes')
      .insert({
        showcase_id: id,
        showcase_source: source,
        user_id: user.id,
      });
    if (insertError) return serverError('추천 처리 실패');

    // 카운트 증가
    await updateLikeCount(supabase, id, source, 1);

    const { count } = await supabase
      .from('showcase_likes')
      .select('*', { count: 'exact', head: true })
      .eq('showcase_id', id);

    return NextResponse.json({ liked: true, like_count: count ?? 0 });
  }
}

async function updateLikeCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  showcaseId: string,
  source: 'deploy' | 'project',
  delta: number
) {
  const table = source === 'deploy' ? 'homepage_deploys' : 'projects';

  // RPC로 RLS 우회하여 카운트 업데이트
  await supabase.rpc('increment_showcase_counter', {
    p_table: table,
    p_id: showcaseId,
    p_column: 'like_count',
    p_delta: delta,
  });
}
