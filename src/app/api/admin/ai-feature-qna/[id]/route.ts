import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, validationError, serverError } from '@/lib/api/errors';
import { isAdmin } from '@/lib/admin';
import { updateFeatureQnaSchema } from '@/lib/validations/ai-chat';
import { logAudit } from '@/lib/audit';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Admin check
  if (!(await isAdmin(user.id))) return unauthorizedError();

  const { id } = await context.params;

  // 3. Zod safeParse
  const body = await request.json().catch(() => null);
  if (!body) return validationError({ issues: [{ message: '잘못된 요청입니다' }] } as never);

  const parsed = updateFeatureQnaSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const adminSupabase = createAdminClient();

    const updateData: Record<string, unknown> = {
      ...parsed.data,
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error } = await adminSupabase
      .from('ai_feature_qna')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // 5. Audit log
    await logAudit(user.id, {
      action: 'admin.ai_feature_qna_update',
      resourceType: 'ai_feature_qna',
      resourceId: id,
      details: { updated_fields: Object.keys(parsed.data) },
    });

    return NextResponse.json({ qna: updated });
  } catch (err) {
    console.error('Feature QnA PUT error:', err);
    return serverError('Q&A 수정에 실패했습니다');
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Admin check
  if (!(await isAdmin(user.id))) return unauthorizedError();

  const { id } = await context.params;

  try {
    const adminSupabase = createAdminClient();

    const { error } = await adminSupabase
      .from('ai_feature_qna')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // 5. Audit log
    await logAudit(user.id, {
      action: 'admin.ai_feature_qna_delete',
      resourceType: 'ai_feature_qna',
      resourceId: id,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Feature QnA DELETE error:', err);
    return serverError('Q&A 삭제에 실패했습니다');
  }
}
