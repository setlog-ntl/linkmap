import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createProjectSchema } from '@/lib/validations/project';
import { unauthorizedError, validationError, serverError, quotaExceededError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { checkProjectQuota } from '@/lib/quota';
import { SERVICE_IDS_V2 } from '@/data/seed/services-v2';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) return serverError(error.message);

  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 쿼터 체크
  const quota = await checkProjectQuota(user.id);
  if (!quota.allowed) return quotaExceededError('프로젝트', quota.current, quota.max);

  const body = await request.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) return serverError(error.message);

  // 기본 서비스 자동 추가: Linkmap
  await supabase
    .from('project_services')
    .insert({
      project_id: data.id,
      service_id: SERVICE_IDS_V2.linkmap,
      status: 'connected',
    })
    .single();

  await logAudit(user.id, {
    action: 'project.create',
    resourceType: 'project',
    resourceId: data.id,
    details: { name: parsed.data.name },
  });

  return NextResponse.json(data, { status: 201 });
}
