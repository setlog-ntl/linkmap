import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, notFoundError, serverError, apiError } from '@/lib/api/errors';
import { createFeedbackCommentSchema } from '@/lib/validations/feedback';
import { logAudit } from '@/lib/audit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  // 기능 요청 존재 확인
  const { data: existing, error: fetchError } = await supabase
    .from('feature_requests')
    .select('id')
    .eq('id', id)
    .single();

  if (fetchError || !existing) return notFoundError('기능 요청');

  const { data, error } = await supabase
    .from('feature_request_comments')
    .select(
      `
      *,
      author:profiles!feature_request_comments_user_id_fkey(full_name, avatar_url)
      `
    )
    .eq('feature_request_id', id)
    .order('created_at', { ascending: true });

  if (error) return serverError(error.message);

  const comments = (data ?? []).map((row) => {
    const { author, ...rest } = row as Record<string, unknown>;
    const authorData = author as { full_name?: string | null; avatar_url?: string | null } | null;
    return {
      ...rest,
      author: {
        name: authorData?.full_name ?? null,
        avatar_url: authorData?.avatar_url ?? null,
      },
    };
  });

  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = createFeedbackCommentSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0].message, 400);
  }

  // 기능 요청 존재 확인
  const { data: existing, error: fetchError } = await supabase
    .from('feature_requests')
    .select('id')
    .eq('id', id)
    .single();

  if (fetchError || !existing) return notFoundError('기능 요청');

  const admin = await isAdmin(user.id);

  const { data, error } = await supabase
    .from('feature_request_comments')
    .insert({
      feature_request_id: id,
      user_id: user.id,
      content: parsed.data.content,
      is_admin_comment: admin,
    })
    .select()
    .single();

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'feedback.comment_create',
    resourceType: 'feature_request_comment',
    resourceId: data.id as string,
    details: { feature_request_id: id, is_admin_comment: admin },
  });

  return NextResponse.json({ comment: data }, { status: 201 });
}
