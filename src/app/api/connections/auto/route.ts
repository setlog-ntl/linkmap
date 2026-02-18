import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { suggestAutoConnections } from '@/lib/connections/auto-connect';
import type { ServiceDependency, UserConnection } from '@/types';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const projectId = request.nextUrl.searchParams.get('project_id');
  if (!projectId) return apiError('project_id가 필요합니다', 400);

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single();

  if (!project) return apiError('프로젝트를 찾을 수 없습니다', 404);

  const [servicesResult, depsResult, connectionsResult] = await Promise.all([
    supabase
      .from('project_services')
      .select('service_id, service:services(id, slug)')
      .eq('project_id', projectId),
    supabase.from('service_dependencies').select('*'),
    supabase.from('user_connections').select('*').eq('project_id', projectId),
  ]);

  interface PSRow { service_id: string; service: { id: string; slug: string } }
  const projectServices = ((servicesResult.data ?? []) as unknown as PSRow[]).map((ps) => ({
    serviceId: ps.service.id,
    slug: ps.service.slug,
  }));
  const dependencies = (depsResult.data ?? []) as unknown as ServiceDependency[];
  const existingConnections = (connectionsResult.data ?? []) as unknown as UserConnection[];

  const suggestions = suggestAutoConnections(projectServices, dependencies, existingConnections);

  return NextResponse.json({ suggestions });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const { project_id, suggestions } = body as {
    project_id: string;
    suggestions: Array<{
      source_service_id: string;
      target_service_id: string;
      connection_type: string;
    }>;
  };

  if (!project_id || !Array.isArray(suggestions) || suggestions.length === 0) {
    return apiError('project_id와 suggestions 배열이 필요합니다', 400);
  }

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return apiError('프로젝트를 찾을 수 없습니다', 404);

  const rows = suggestions.map((s) => ({
    project_id,
    source_service_id: s.source_service_id,
    target_service_id: s.target_service_id,
    connection_type: s.connection_type,
    connection_status: 'active',
    created_by: user.id,
  }));

  const { data, error } = await supabase
    .from('user_connections')
    .upsert(rows, { onConflict: 'project_id,source_service_id,target_service_id' })
    .select();

  if (error) return apiError(error.message, 400);

  await logAudit(user.id, {
    action: 'connection.auto_create',
    resourceType: 'user_connection',
    resourceId: project_id,
    details: { count: data?.length ?? 0 },
  });

  return NextResponse.json({ created: data }, { status: 201 });
}
