import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFoundError, serverError } from '@/lib/api/errors';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const admin = createAdminClient();

    // 공유 활성화된 프로젝트만 조회
    const { data: project } = await admin
      .from('projects')
      .select('id, name, description, main_service_id, icon_type, icon_value, link_url, is_showcase, showcase_description, showcase_category')
      .eq('share_token', token)
      .eq('is_map_shared', true)
      .is('deleted_at', null)
      .single();

    if (!project) return notFoundError('공유된 서비스맵');

    const projectId = project.id;

    const [servicesResult, depsResult, connectionsResult, layerOverridesResult] = await Promise.all([
      // account_identifier 제외 — 보안
      admin
        .from('project_services')
        .select('id, project_id, service_id, status, notes, cost_tier_id, billing_cycle, created_at, updated_at, service:services(id, name, slug, category, icon_url, icon_emoji, domain)')
        .eq('project_id', projectId),
      admin
        .from('service_dependencies')
        .select('*'),
      // 최소한의 연결 정보만
      admin
        .from('user_connections')
        .select('id, source_service_id, target_service_id, connection_type, connection_status, label')
        .eq('project_id', projectId),
      admin
        .from('project_service_overrides')
        .select('service_id, dashboard_layer')
        .eq('project_id', projectId),
    ]);

    // 환경변수 쿼리 자체를 하지 않음 — 보안
    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        main_service_id: project.main_service_id,
        icon_type: project.icon_type,
        icon_value: project.icon_value,
        link_url: project.link_url,
        is_showcase: project.is_showcase,
        showcase_description: project.showcase_description,
        showcase_category: project.showcase_category,
      },
      services: servicesResult.data ?? [],
      dependencies: depsResult.data ?? [],
      userConnections: connectionsResult.data ?? [],
      envVars: [],
      layerOverrides: layerOverridesResult.data ?? [],
    });
  } catch {
    return serverError('공유 맵 데이터를 불러오는 중 오류가 발생했습니다');
  }
}
