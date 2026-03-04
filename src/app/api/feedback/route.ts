import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, serverError, apiError } from '@/lib/api/errors';
import { createFeedbackSchema, feedbackListQuerySchema } from '@/lib/validations/feedback';
import { logAudit } from '@/lib/audit';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { searchParams } = new URL(request.url);
  const raw = {
    category: searchParams.get('category') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  };

  const parsed = feedbackListQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0].message, 400);
  }

  const { category, status, sort, page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  // 기본 쿼리
  let query = supabase
    .from('feature_requests')
    .select(
      `
      *,
      author:profiles!feature_requests_user_id_fkey(name, avatar_url),
      comment_count:feature_request_comments(count)
      `,
      { count: 'exact' }
    );

  if (category) query = query.eq('category', category);
  if (status) query = query.eq('status', status);

  if (sort === 'votes') {
    query = query.order('vote_count', { ascending: false }).order('created_at', { ascending: false });
  } else if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: true });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) return serverError(error.message);

  // has_voted: 로그인 사용자만
  let votedSet = new Set<string>();
  if (user && data && data.length > 0) {
    const ids = data.map((r) => r.id as string);
    const { data: votes } = await supabase
      .from('feature_request_votes')
      .select('feature_request_id')
      .eq('user_id', user.id)
      .in('feature_request_id', ids);
    if (votes) {
      votedSet = new Set(votes.map((v) => v.feature_request_id as string));
    }
  }

  const items = (data ?? []).map((row) => {
    const { author, comment_count, ...rest } = row as Record<string, unknown>;
    const authorData = author as { name?: string | null; avatar_url?: string | null } | null;
    const commentArr = comment_count as { count: number }[] | null;
    const isAnon = rest.is_anonymous as boolean;
    return {
      ...rest,
      author: isAnon
        ? { name: '익명', avatar_url: null }
        : { name: authorData?.name ?? null, avatar_url: authorData?.avatar_url ?? null },
      has_voted: votedSet.has(rest.id as string),
      comment_count: commentArr?.[0]?.count ?? 0,
    };
  });

  return NextResponse.json({
    items,
    total: count ?? 0,
    page,
    limit,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = createFeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0].message, 400);
  }

  const { title, description, category, is_anonymous } = parsed.data;

  const { data, error } = await supabase
    .from('feature_requests')
    .insert({ user_id: user.id, title, description, category, is_anonymous })
    .select()
    .single();

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'feedback.create',
    resourceType: 'feature_request',
    resourceId: data.id as string,
    details: { title, category },
  });

  return NextResponse.json({ item: data }, { status: 201 });
}
