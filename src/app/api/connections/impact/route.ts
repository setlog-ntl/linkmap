import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, apiError } from '@/lib/api/errors';
import { analyzeImpact } from '@/lib/connections/impact-analysis';

const querySchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  service_id: z.string().uuid('유효하지 않은 서비스 ID'),
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = querySchema.safeParse(params);
  if (!parsed.success) return validationError(parsed.error);

  const { project_id, service_id } = parsed.data;

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return apiError('프로젝트를 찾을 수 없습니다', 404);

  // Fetch all active connections
  const { data: connections, error: connError } = await supabase
    .from('user_connections')
    .select('source_service_id, target_service_id, connection_type')
    .eq('project_id', project_id)
    .is('deleted_at', null);

  if (connError) return apiError(connError.message, 400);

  // Fetch project services with names
  const { data: projectServices, error: svcError } = await supabase
    .from('project_services')
    .select('service_id, service:services(id, name)')
    .eq('project_id', project_id);

  if (svcError) return apiError(svcError.message, 400);

  // Build service name map (catalog service_id → name)
  const serviceNames = new Map<string, string>();
  for (const ps of projectServices ?? []) {
    const svc = ps.service as unknown as { id: string; name: string } | null;
    if (svc) serviceNames.set(svc.id, svc.name);
  }

  const result = analyzeImpact(connections ?? [], serviceNames, service_id);
  return NextResponse.json(result);
}
