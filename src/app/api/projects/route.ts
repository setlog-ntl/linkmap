import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createProjectSchema } from '@/lib/validations/project';
import { unauthorizedError, validationError, serverError, apiError } from '@/lib/api/errors';
import { rateLimit } from '@/lib/rate-limit';
import { logAudit } from '@/lib/audit';
import { checkProjectQuota } from '@/lib/quota';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return serverError(error.message);

  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { success } = rateLimit(`project:${user.id}`, 20);
  if (!success) return NextResponse.json({ error: '요청이 너무 많습니다.' }, { status: 429 });

  const quotaCheck = await checkProjectQuota(user.id);
  if (!quotaCheck.allowed) {
    return apiError(`프로젝트 한도에 도달했습니다 (${quotaCheck.current}/${quotaCheck.max}). 플랜을 업그레이드해주세요.`, 403);
  }

  const body = await request.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'project.create',
    resourceType: 'project',
    resourceId: data.id,
    details: { name: parsed.data.name },
  });

  return NextResponse.json(data, { status: 201 });
}
