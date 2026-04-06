import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError } from '@/lib/api/errors';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const projectId = request.nextUrl.searchParams.get('project_id');
  if (!projectId) return apiError('project_id가 필요합니다', 400);

  // Get project's services
  const { data: projectServices } = await supabase
    .from('project_services')
    .select('service_id')
    .eq('project_id', projectId);

  const serviceIds = (projectServices ?? []).map((ps) => ps.service_id);

  if (serviceIds.length === 0) {
    return NextResponse.json([]);
  }

  // Get all MCP servers
  const { data: mcpServers } = await supabase
    .from('mcp_servers')
    .select('*')
    .order('popularity_score', { ascending: false });

  // Get already-configured MCP servers for this project
  const { data: existingConfigs } = await supabase
    .from('project_mcp_configs')
    .select('mcp_server_id')
    .eq('project_id', projectId)
    .is('deleted_at', null);

  const configuredIds = new Set((existingConfigs ?? []).map((c) => c.mcp_server_id).filter(Boolean));

  // Score and filter recommendations
  const recommendations = (mcpServers ?? [])
    .filter((mcp) => !configuredIds.has(mcp.id))
    .map((mcp) => {
      const relatedIds: string[] = mcp.related_service_ids ?? [];
      const matchedServices = relatedIds.filter((id: string) => serviceIds.includes(id));

      if (matchedServices.length === 0) return null;

      const score =
        matchedServices.length * 30 +
        (mcp.is_official ? 20 : 0) +
        (mcp.popularity_score ?? 0) / 5 +
        (mcp.difficulty_level === 'beginner' ? 10 : mcp.difficulty_level === 'intermediate' ? 5 : 0);

      return {
        mcp_server: mcp,
        matched_service_ids: matchedServices,
        score,
        reason_ko: `프로젝트에서 사용 중인 서비스와 연결하여 AI 도구에서 직접 관리할 수 있습니다`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0))
    .slice(0, 10);

  return NextResponse.json(recommendations);
}
