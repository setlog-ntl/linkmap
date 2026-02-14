import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { createTemplateSchema } from '@/lib/validations/ai-config';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(supabase, user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const { data, error } = await supabase
    .from('ai_prompt_templates')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return serverError('템플릿 조회에 실패했습니다');
  return NextResponse.json({ templates: data || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(supabase, user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const body = await request.json();
  const parsed = createTemplateSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase
    .from('ai_prompt_templates')
    .insert({ ...parsed.data, created_by: user.id })
    .select()
    .single();

  if (error) {
    console.error('Template create error:', error);
    return serverError('템플릿 생성에 실패했습니다');
  }

  await logAudit(user.id, {
    action: 'admin.ai_template_create',
    resourceType: 'ai_prompt_templates',
    resourceId: data.id,
    details: { name: parsed.data.name },
  });

  return NextResponse.json({ template: data }, { status: 201 });
}
