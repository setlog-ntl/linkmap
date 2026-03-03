import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, notFoundError, serverError, apiError } from '@/lib/api/errors';
import { updateFeedbackSchema } from '@/lib/validations/feedback';
import { logAudit } from '@/lib/audit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('feature_requests')
    .select(
      `
      *,
      author:profiles!feature_requests_user_id_fkey(name, avatar_url),
      comment_count:feature_request_comments(count)
      `
    )
    .eq('id', id)
    .single();

  if (error || !data) return notFoundError('기능 요청');

  let hasVoted = false;
  if (user) {
    const { data: vote } = await supabase
      .from('feature_request_votes')
      .select('id')
      .eq('feature_request_id', id)
      .eq('user_id', user.id)
      .maybeSingle();
    hasVoted = !!vote;
  }

  const { author, comment_count, ...rest } = data as Record<string, unknown>;
  const authorData = author as { name?: string | null; avatar_url?: string | null } | null;
  const commentArr = comment_count as { count: number }[] | null;

  return NextResponse.json({
    item: {
      ...rest,
      author: {
        name: authorData?.name ?? null,
        avatar_url: authorData?.avatar_url ?? null,
      },
      has_voted: hasVoted,
      comment_count: commentArr?.[0]?.count ?? 0,
    },
  });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = updateFeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0].message, 400);
  }

  // 기존 항목 조회
  const { data: existing, error: fetchError } = await supabase
    .from('feature_requests')
    .select('id, user_id, status')
    .eq('id', id)
    .single();

  if (fetchError || !existing) return notFoundError('기능 요청');

  const admin = await isAdmin(user.id);
  const isOwner = (existing.user_id as string) === user.id;

  if (!admin && !isOwner) {
    return apiError('수정 권한이 없습니다', 403);
  }

  const { title, description, category, status, admin_note } = parsed.data;

  // 일반 사용자: status/admin_note 수정 불가
  if (!admin && (status !== undefined || admin_note !== undefined)) {
    return apiError('관리자만 상태와 관리자 노트를 수정할 수 있습니다', 403);
  }

  const updatePayload: Record<string, unknown> = {};
  if (title !== undefined) updatePayload.title = title;
  if (description !== undefined) updatePayload.description = description;
  if (category !== undefined) updatePayload.category = category;
  if (admin && status !== undefined) updatePayload.status = status;
  if (admin && admin_note !== undefined) updatePayload.admin_note = admin_note;

  if (Object.keys(updatePayload).length === 0) {
    return apiError('변경할 내용이 없습니다', 400);
  }

  // 관리자는 admin client로 RLS 우회
  const client = admin ? createAdminClient() : supabase;
  const { data, error } = await client
    .from('feature_requests')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) return serverError(error.message);

  const auditAction = admin ? 'feedback.admin_update' : 'feedback.update';
  await logAudit(user.id, {
    action: auditAction,
    resourceType: 'feature_request',
    resourceId: id,
    details: updatePayload,
  });

  return NextResponse.json({ item: data });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: existing, error: fetchError } = await supabase
    .from('feature_requests')
    .select('id, user_id')
    .eq('id', id)
    .single();

  if (fetchError || !existing) return notFoundError('기능 요청');

  const admin = await isAdmin(user.id);
  const isOwner = (existing.user_id as string) === user.id;

  if (!admin && !isOwner) {
    return apiError('삭제 권한이 없습니다', 403);
  }

  const client = admin ? createAdminClient() : supabase;
  const { error } = await client
    .from('feature_requests')
    .delete()
    .eq('id', id);

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'feedback.delete',
    resourceType: 'feature_request',
    resourceId: id,
  });

  return new NextResponse(null, { status: 204 });
}
