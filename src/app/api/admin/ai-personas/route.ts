import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { createPersonaSchema } from '@/lib/validations/ai-config';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const { data, error } = await supabase
    .from('ai_personas')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return serverError('페르소나 조회에 실패했습니다');
  return NextResponse.json({ personas: data || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const body = await request.json();
  const parsed = createPersonaSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase
    .from('ai_personas')
    .insert({ ...parsed.data, created_by: user.id })
    .select()
    .single();

  if (error) {
    console.error('Persona create error:', error);
    return serverError('페르소나 생성에 실패했습니다');
  }

  await logAudit(user.id, {
    action: 'admin.ai_persona_create',
    resourceType: 'ai_personas',
    resourceId: data.id,
    details: { name: parsed.data.name },
  });

  return NextResponse.json({ persona: data }, { status: 201 });
}
