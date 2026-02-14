import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { updatePersonaSchema } from '@/lib/validations/ai-config';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(supabase, user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const body = await request.json();
  const parsed = updatePersonaSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase
    .from('ai_personas')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Persona update error:', error);
    return serverError('페르소나 수정에 실패했습니다');
  }

  await logAudit(user.id, {
    action: 'admin.ai_persona_update',
    resourceType: 'ai_personas',
    resourceId: id,
    details: parsed.data,
  });

  return NextResponse.json({ persona: data });
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
    .from('ai_personas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Persona delete error:', error);
    return serverError('페르소나 삭제에 실패했습니다');
  }

  await logAudit(user.id, {
    action: 'admin.ai_persona_delete',
    resourceType: 'ai_personas',
    resourceId: id,
  });

  return NextResponse.json({ success: true });
}
