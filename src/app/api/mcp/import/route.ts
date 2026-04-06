import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { importMcpConfigSchema } from '@/lib/validations/mcp';
import { unauthorizedError, validationError, apiError } from '@/lib/api/errors';
import { parseMcpConfig } from '@/lib/mcp/parse-mcp-config';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = importMcpConfigSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', parsed.data.project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return apiError('프로젝트를 찾을 수 없습니다', 404);

  // Parse the config content
  const parseResult = parseMcpConfig(parsed.data.content);

  if (!parseResult.success) {
    return apiError(parseResult.error, 400);
  }

  // Match against MCP server catalog
  const slugs = parseResult.servers.map((s) => s.slug);
  const { data: catalogServers } = await supabase
    .from('mcp_servers')
    .select('id, slug, name, related_service_ids')
    .in('slug', slugs);

  const catalogMap = new Map((catalogServers ?? []).map((s) => [s.slug, s]));

  const result = parseResult.servers.map((server) => {
    const catalogMatch = catalogMap.get(server.slug);
    return {
      ...server,
      mcp_server_id: catalogMatch?.id ?? null,
      catalog_name: catalogMatch?.name ?? null,
      related_service_ids: catalogMatch?.related_service_ids ?? [],
      matched: !!catalogMatch,
    };
  });

  return NextResponse.json({
    format: parseResult.format,
    servers: result,
    total: result.length,
    matched: result.filter((r) => r.matched).length,
  });
}
