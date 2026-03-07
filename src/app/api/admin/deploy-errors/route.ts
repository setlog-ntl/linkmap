import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, validationError } from '@/lib/api/errors';
import { z } from 'zod';

const patchSchema = z.object({
  pattern_id: z.string().uuid(),
  is_resolved: z.boolean().optional(),
  resolution_note: z.string().max(2000).optional(),
  cause: z.string().max(2000).optional(),
  solution: z.string().max(2000).optional(),
});

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const searchParams = request.nextUrl.searchParams;
  const view = searchParams.get('view') || 'patterns'; // 'patterns' | 'logs'
  const category = searchParams.get('category');
  const resolved = searchParams.get('resolved');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
  const offset = (page - 1) * limit;

  const adminClient = createAdminClient();

  if (view === 'patterns') {
    let query = adminClient
      .from('deploy_error_patterns')
      .select('*', { count: 'exact' })
      .order('last_seen_at', { ascending: false });

    if (category) query = query.eq('error_category', category);
    if (resolved === 'true') query = query.eq('is_resolved', true);
    if (resolved === 'false') query = query.eq('is_resolved', false);

    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) return apiError(error.message, 500);

    // 카테고리별 요약 통계
    const { data: stats } = await adminClient
      .from('deploy_error_patterns')
      .select('error_category, occurrence_count, is_resolved');

    const categoryStats: Record<string, { total: number; resolved: number; occurrences: number }> = {};
    for (const s of stats || []) {
      const cat = s.error_category;
      if (!categoryStats[cat]) categoryStats[cat] = { total: 0, resolved: 0, occurrences: 0 };
      categoryStats[cat].total += 1;
      categoryStats[cat].occurrences += s.occurrence_count;
      if (s.is_resolved) categoryStats[cat].resolved += 1;
    }

    return NextResponse.json({
      patterns: data,
      total: count,
      page,
      limit,
      categoryStats,
    });
  }

  // view === 'logs'
  let query = adminClient
    .from('deploy_error_logs')
    .select('*, deploy_error_patterns(error_category, is_resolved)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (category) query = query.eq('error_category', category);

  const patternId = searchParams.get('pattern_id');
  if (patternId) query = query.eq('pattern_id', patternId);

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) return apiError(error.message, 500);

  return NextResponse.json({
    logs: data,
    total: count,
    page,
    limit,
  });
}

// PATCH: 패턴 해결 상태 업데이트
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const raw = await request.json();
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) return validationError(parsed.error);

  const body = parsed.data;

  const adminClient = createAdminClient();
  const updateData: Record<string, unknown> = {};

  if (body.is_resolved !== undefined) updateData.is_resolved = body.is_resolved;
  if (body.resolution_note !== undefined) updateData.resolution_note = body.resolution_note;
  if (body.cause !== undefined) updateData.cause = body.cause;
  if (body.solution !== undefined) updateData.solution = body.solution;

  const { error } = await adminClient
    .from('deploy_error_patterns')
    .update(updateData)
    .eq('id', body.pattern_id);

  if (error) return apiError(error.message, 500);

  return NextResponse.json({ success: true });
}
