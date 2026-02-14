import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(supabase, user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  // 관리자는 모든 설정 조회 (가장 최근 것)
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

  const admin = await isAdmin(supabase, user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const body = await request.json();
  const { system_prompt, model, temperature, max_tokens, is_active } = body;

  if (!system_prompt || typeof system_prompt !== 'string') {
    return apiError('시스템 프롬프트는 필수입니다', 400);
  }
  if (!model || typeof model !== 'string') {
    return apiError('모델은 필수입니다', 400);
  }
  if (typeof temperature !== 'number' || temperature < 0 || temperature > 2) {
    return apiError('온도는 0~2 사이의 숫자여야 합니다', 400);
  }
  if (typeof max_tokens !== 'number' || max_tokens < 1 || max_tokens > 128000) {
    return apiError('max_tokens는 1~128000 사이여야 합니다', 400);
  }

  const adminSupabase = createAdminClient();

  // 기존 active 설정이 있으면 업데이트, 없으면 새로 생성
  const { data: existing } = await adminSupabase
    .from('ai_assistant_config')
    .select('id')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  let result;
  if (existing) {
    result = await adminSupabase
      .from('ai_assistant_config')
      .update({
        system_prompt,
        model,
        temperature,
        max_tokens,
        is_active: is_active !== false,
        updated_by: user.id,
      })
      .eq('id', existing.id)
      .select()
      .single();
  } else {
    result = await adminSupabase
      .from('ai_assistant_config')
      .insert({
        system_prompt,
        model,
        temperature,
        max_tokens,
        is_active: is_active !== false,
        updated_by: user.id,
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
    details: { model, temperature, max_tokens, is_active: is_active !== false },
  });

  return NextResponse.json({ config: result.data });
}
