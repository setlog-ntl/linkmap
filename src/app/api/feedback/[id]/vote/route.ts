import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, serverError, apiError } from '@/lib/api/errors';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 기능 요청 존재 확인
  const { data: existing, error: fetchError } = await supabase
    .from('feature_requests')
    .select('id')
    .eq('id', id)
    .single();

  if (fetchError || !existing) return notFoundError('기능 요청');

  const { error } = await supabase
    .from('feature_request_votes')
    .insert({ feature_request_id: id, user_id: user.id });

  if (error) {
    // UNIQUE 제약 위반: 이미 투표한 경우
    if (error.code === '23505') {
      return apiError('이미 투표한 요청입니다', 409);
    }
    return serverError(error.message);
  }

  return NextResponse.json({ voted: true }, { status: 201 });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { error } = await supabase
    .from('feature_request_votes')
    .delete()
    .eq('feature_request_id', id)
    .eq('user_id', user.id);

  if (error) return serverError(error.message);

  return new NextResponse(null, { status: 204 });
}
