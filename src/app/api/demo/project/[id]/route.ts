import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiError, notFoundError, serverError } from '@/lib/api/errors';

function forbidden(message: string) {
  return apiError(message, 403);
}

const DEMO_USER_EMAIL = 'vcdemo@linkmap.site';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const admin = createAdminClient();

    const { data: demoProfile } = await admin
      .from('profiles')
      .select('id')
      .eq('email', DEMO_USER_EMAIL)
      .single();

    if (!demoProfile) {
      return notFoundError('데모 계정');
    }

    const { data: project } = await admin
      .from('projects')
      .select('id, name, main_service_id')
      .eq('id', id)
      .eq('user_id', demoProfile.id)
      .is('deleted_at', null)
      .single();

    if (!project) {
      return notFoundError('프로젝트');
    }

    const [servicesResult, depsResult, connectionsResult, envVarsResult, layerOverridesResult] = await Promise.all([
      admin
        .from('project_services')
        .select('*, service:services(*)')
        .eq('project_id', id),
      admin
        .from('service_dependencies')
        .select('*'),
      admin
        .from('user_connections')
        .select('id, source_service_id, target_service_id, connection_type, connection_status, environment, label')
        .eq('project_id', id),
      // encrypted_value 절대 포함하지 않음
      admin
        .from('environment_variables')
        .select('id, key_name, environment, is_secret, service_id')
        .eq('project_id', id),
      admin
        .from('project_service_overrides')
        .select('service_id, dashboard_layer')
        .eq('project_id', id),
    ]);

    return NextResponse.json({
      project,
      services: servicesResult.data ?? [],
      dependencies: depsResult.data ?? [],
      userConnections: connectionsResult.data ?? [],
      envVars: envVarsResult.data ?? [],
      layerOverrides: layerOverridesResult.data ?? [],
    });
  } catch {
    return serverError('데이터를 불러오는 중 오류가 발생했습니다');
  }
}

// 데모 API는 읽기 전용 — 모든 쓰기 요청 차단
export async function POST() {
  return forbidden('데모 모드에서는 수정할 수 없습니다');
}

export async function PUT() {
  return forbidden('데모 모드에서는 수정할 수 없습니다');
}

export async function PATCH() {
  return forbidden('데모 모드에서는 수정할 수 없습니다');
}

export async function DELETE() {
  return forbidden('데모 모드에서는 삭제할 수 없습니다');
}
