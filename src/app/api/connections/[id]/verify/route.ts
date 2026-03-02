import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import type { ConnectionStatus } from '@/types';

function healthToConnectionStatus(statuses: string[]): ConnectionStatus {
  if (statuses.length === 0) return 'pending';
  if (statuses.some((s) => s === 'unhealthy' || s === 'degraded')) return 'error';
  if (statuses.every((s) => s === 'healthy')) return 'active';
  return 'pending';
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { id } = await params;

  // 소유권 확인
  const { data: connection } = await supabase
    .from('user_connections')
    .select('*, project:projects!inner(user_id)')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (!connection || (connection.project as { user_id: string }).user_id !== user.id) {
    return apiError('연결을 찾을 수 없습니다', 404);
  }

  const { project_id, source_service_id, target_service_id } = connection;
  const now = new Date().toISOString();

  // 연결된 서비스의 project_services 조회
  const { data: projectServices } = await supabase
    .from('project_services')
    .select('id, service_id')
    .eq('project_id', project_id)
    .in('service_id', [source_service_id, target_service_id]);

  if (!projectServices || projectServices.length === 0) {
    // 헬스체크 기록 없음 → last_verified_at만 갱신
    const { data, error } = await supabase
      .from('user_connections')
      .update({ last_verified_at: now, updated_at: now })
      .eq('id', id)
      .select()
      .single();

    if (error) return apiError(error.message, 400);
    return NextResponse.json(data);
  }

  const projectServiceIds = projectServices.map((ps) => ps.id);

  // 최신 헬스체크 결과 조회 (project_service당 최대 20건으로 제한)
  const { data: latestChecks } = await supabase
    .from('health_checks')
    .select('project_service_id, status')
    .in('project_service_id', projectServiceIds)
    .order('checked_at', { ascending: false })
    .limit(projectServiceIds.length * 20);

  // project_service 당 가장 최신 status만 유지
  const latestByService = new Map<string, string>();
  for (const check of latestChecks ?? []) {
    if (!latestByService.has(check.project_service_id)) {
      latestByService.set(check.project_service_id, check.status as string);
    }
  }

  const newConnectionStatus = healthToConnectionStatus([...latestByService.values()]);

  const { data, error } = await supabase
    .from('user_connections')
    .update({
      connection_status: newConnectionStatus,
      last_verified_at: now,
      updated_at: now,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return apiError(error.message, 400);

  await logAudit(user.id, {
    action: 'connection.verify',
    resourceType: 'user_connection',
    resourceId: id,
    details: { new_status: newConnectionStatus, project_id },
  });

  return NextResponse.json(data);
}
