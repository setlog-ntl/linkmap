import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { updateGlobalConfigSchema } from '@/lib/validations/ai-config';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const { data, error } = await supabase
    .from('ai_assistant_config')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    return serverError('설정 조회에 실패했습니다');
  }

  return NextResponse.json({ config: data || null });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const body = await request.json();
  const parsed = updateGlobalConfigSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const input = parsed.data;
  const adminSupabase = createAdminClient();

  const { data: existing } = await adminSupabase
    .from('ai_assistant_config')
    .select('id')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  const updateData = {
    ...input,
    updated_by: user.id,
  };

  let result;
  if (existing) {
    result = await adminSupabase
      .from('ai_assistant_config')
      .update(updateData)
      .eq('id', existing.id)
      .select()
      .single();
  } else {
    result = await adminSupabase
      .from('ai_assistant_config')
      .insert({
        system_prompt: input.system_prompt || 'You are a helpful assistant.',
        model: input.model || 'gpt-4o-mini',
        temperature: input.temperature ?? 0.3,
        max_tokens: input.max_tokens ?? 4096,
        ...updateData,
      })
      .select()
      .single();
  }

  if (result.error) {
    console.error('AI config save error:', result.error);
    return serverError('설정 저장에 실패했습니다');
  }

  await logAudit(user.id, {
    action: 'admin.ai_config_update',
    resourceType: 'ai_assistant_config',
    resourceId: result.data.id,
    details: input,
  });

  return NextResponse.json({ config: result.data });
}
