import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { updateGuardrailsSchema } from '@/lib/validations/ai-config';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(supabase, user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase
    .from('ai_guardrails')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    return serverError('가드레일 조회에 실패했습니다');
  }

  return NextResponse.json({ guardrails: data || null });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(supabase, user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const body = await request.json();
  const parsed = updateGuardrailsSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const adminSupabase = createAdminClient();

  const { data: existing } = await adminSupabase
    .from('ai_guardrails')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let result;
  if (existing) {
    result = await adminSupabase
      .from('ai_guardrails')
      .update({ ...parsed.data, updated_by: user.id })
      .eq('id', existing.id)
      .select()
      .single();
  } else {
    result = await adminSupabase
      .from('ai_guardrails')
      .insert({ ...parsed.data, updated_by: user.id })
      .select()
      .single();
  }

  if (result.error) {
    console.error('Guardrails save error:', result.error);
    return serverError('가드레일 저장에 실패했습니다');
  }

  await logAudit(user.id, {
    action: 'admin.ai_guardrails_update',
    resourceType: 'ai_guardrails',
    resourceId: result.data.id,
    details: parsed.data,
  });

  return NextResponse.json({ guardrails: result.data });
}
