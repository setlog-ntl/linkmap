import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { updateTemplateSchema } from '@/lib/validations/ai-config';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(supabase, user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const body = await request.json();
  const parsed = updateTemplateSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase
    .from('ai_prompt_templates')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Template update error:', error);
    return serverError('템플릿 수정에 실패했습니다');
  }

  await logAudit(user.id, {
    action: 'admin.ai_template_update',
    resourceType: 'ai_prompt_templates',
    resourceId: id,
    details: parsed.data,
  });

  return NextResponse.json({ template: data });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(supabase, user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase
    .from('ai_prompt_templates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Template delete error:', error);
    return serverError('템플릿 삭제에 실패했습니다');
  }

  await logAudit(user.id, {
    action: 'admin.ai_template_delete',
    resourceType: 'ai_prompt_templates',
    resourceId: id,
  });

  return NextResponse.json({ success: true });
}
