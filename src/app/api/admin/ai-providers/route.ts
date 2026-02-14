import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { encrypt } from '@/lib/crypto';
import { updateProviderSchema } from '@/lib/validations/ai-config';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(supabase, user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase
    .from('ai_providers')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return serverError('제공자 조회에 실패했습니다');

  // Mask API keys — only show whether one is set
  const providers = (data || []).map((p: Record<string, unknown>) => ({
    ...p,
    encrypted_api_key: undefined,
    has_api_key: !!p.encrypted_api_key,
  }));

  return NextResponse.json({ providers });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(supabase, user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const body = await request.json();
  const { slug, ...rest } = body;
  if (!slug || typeof slug !== 'string') {
    return apiError('slug는 필수입니다', 400);
  }

  const parsed = updateProviderSchema.safeParse(rest);
  if (!parsed.success) return validationError(parsed.error);

  const updateData: Record<string, unknown> = {};
  if (parsed.data.is_enabled !== undefined) updateData.is_enabled = parsed.data.is_enabled;
  if (parsed.data.base_url !== undefined) updateData.base_url = parsed.data.base_url;
  if (parsed.data.api_key) {
    updateData.encrypted_api_key = encrypt(parsed.data.api_key);
  }

  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase
    .from('ai_providers')
    .update(updateData)
    .eq('slug', slug)
    .select()
    .single();

  if (error) {
    console.error('Provider update error:', error);
    return serverError('제공자 설정 저장에 실패했습니다');
  }

  await logAudit(user.id, {
    action: 'admin.ai_provider_update',
    resourceType: 'ai_providers',
    resourceId: slug,
    details: { is_enabled: parsed.data.is_enabled },
  });

  return NextResponse.json({
    provider: {
      ...data,
      encrypted_api_key: undefined,
      has_api_key: !!data.encrypted_api_key,
    },
  });
}
