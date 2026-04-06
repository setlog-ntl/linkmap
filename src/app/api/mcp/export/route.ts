import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError } from '@/lib/api/errors';

type ExportFormat = 'claude-desktop' | 'claude-code' | 'cursor';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const projectId = request.nextUrl.searchParams.get('project_id');
  if (!projectId) return apiError('project_id가 필요합니다', 400);

  const format = (request.nextUrl.searchParams.get('format') ?? 'claude-code') as ExportFormat;

  const { data: configs, error } = await supabase
    .from('project_mcp_configs')
    .select('*, mcp_server:mcp_servers(slug, name)')
    .eq('project_id', projectId)
    .eq('enabled', true)
    .is('deleted_at', null);

  if (error) return apiError(error.message, 400);

  // Build mcpServers object
  const mcpServers: Record<string, Record<string, unknown>> = {};

  for (const config of configs ?? []) {
    const name = config.mcp_server?.slug ?? config.custom_name ?? `mcp-${config.id.slice(0, 8)}`;

    const entry: Record<string, unknown> = {};

    if (config.transport === 'stdio') {
      if (config.command) entry.command = config.command;
      if (config.args?.length) entry.args = config.args;
    } else {
      if (config.url) entry.url = config.url;
    }

    // Env vars are NOT included by default (security)
    // The client can request them separately

    mcpServers[name] = entry;
  }

  const exportData = { mcpServers };

  return NextResponse.json(exportData, {
    headers: {
      'Content-Disposition': `attachment; filename="${getFilename(format)}"`,
    },
  });
}

function getFilename(format: ExportFormat): string {
  switch (format) {
    case 'claude-desktop': return 'claude_desktop_config.json';
    case 'cursor': return 'mcp.json';
    case 'claude-code':
    default: return '.mcp.json';
  }
}
