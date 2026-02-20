import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, validationError, serverError } from '@/lib/api/errors';
import { isAdmin } from '@/lib/admin';
import { createFeatureQnaSchema } from '@/lib/validations/ai-chat';
import { logAudit } from '@/lib/audit';

export async function GET(request: NextRequest) {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Admin check
  if (!(await isAdmin(user.id))) return unauthorizedError();

  // 3. Read feature_slug from query
  const featureSlug = request.nextUrl.searchParams.get('feature_slug');

  try {
    const adminSupabase = createAdminClient();

    let query = adminSupabase
      .from('ai_feature_qna')
      .select('*')
      .order('sort_order', { ascending: true });

    if (featureSlug) {
      query = query.eq('feature_slug', featureSlug);
    }

    const { data: qnaList, error } = await query;
    if (error) throw error;

    return NextResponse.json({ qna: qnaList || [] });
  } catch (err) {
    console.error('Feature QnA GET error:', err);
    return serverError('Q&A 목록을 불러올 수 없습니다');
  }
}

export async function POST(request: NextRequest) {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Admin check
  if (!(await isAdmin(user.id))) return unauthorizedError();

  // 3. Zod safeParse
  const body = await request.json().catch(() => null);
  if (!body) return validationError({ issues: [{ message: '잘못된 요청입니다' }] } as never);

  const parsed = createFeatureQnaSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { feature_slug, question, question_ko, answer_guide, sort_order, is_active } = parsed.data;

  try {
    const adminSupabase = createAdminClient();

    const { data: created, error } = await adminSupabase
      .from('ai_feature_qna')
      .insert({
        feature_slug,
        question,
        question_ko: question_ko ?? null,
        answer_guide,
        sort_order: sort_order ?? 0,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    // 5. Audit log
    await logAudit(user.id, {
      action: 'admin.ai_feature_qna_create',
      resourceType: 'ai_feature_qna',
      resourceId: created.id,
      details: { feature_slug, question },
    });

    return NextResponse.json({ qna: created }, { status: 201 });
  } catch (err) {
    console.error('Feature QnA POST error:', err);
    return serverError('Q&A 생성에 실패했습니다');
  }
}
