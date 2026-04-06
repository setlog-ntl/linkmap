import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createMcpConfigSchema } from '@/lib/validations/mcp';
import { unauthorizedError, validationError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { encrypt } from '@/lib/crypto';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const projectId = request.nextUrl.searchParams.get('project_id');
  if (!projectId) return apiError('project_id가 필요합니다', 400);

  const { data, error } = await supabase
    .from('project_mcp_configs')
    .select('*, mcp_server:mcp_servers(*)')
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .order('created_at');

  if (error) return apiError(error.message, 400);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = createMcpConfigSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { project_id, mcp_server_id, custom_name, transport, command, args, url, enabled, environment, metadata, notes, env_vars, service_links } = parsed.data;

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return apiError('프로젝트를 찾을 수 없습니다', 404);

  // Create the MCP config
  const { data: config, error } = await supabase
    .from('project_mcp_configs')
    .insert({
      project_id,
      mcp_server_id: mcp_server_id ?? null,
      custom_name: custom_name ?? null,
      transport,
      command: command ?? null,
      args: args ?? [],
      url: url ?? null,
      enabled,
      environment,
      metadata: metadata ?? {},
      notes: notes ?? null,
      created_by: user.id,
    })
    .select('*, mcp_server:mcp_servers(*)')
    .single();

  if (error) return apiError(error.message, 400);

  // Create env vars if provided
  if (env_vars.length > 0) {
    const envVarRows = env_vars.map((ev) => ({
      mcp_config_id: config.id,
      key_name: ev.key_name,
      encrypted_value: encrypt(ev.value),
      description: ev.description ?? null,
      is_secret: ev.is_secret ?? true,
      source_env_var_id: ev.source_env_var_id ?? null,
    }));

    await supabase.from('mcp_config_env_vars').insert(envVarRows);
  }

  // Create service links if provided
  if (service_links.length > 0) {
    const linkRows = service_links.map((sl) => ({
      mcp_config_id: config.id,
      service_id: sl.service_id,
      project_service_id: sl.project_service_id ?? null,
      link_type: sl.link_type ?? 'provides_access',
    }));

    await supabase.from('mcp_service_links').insert(linkRows);
  }

  await logAudit(user.id, {
    action: 'mcp_config.create',
    resourceType: 'project_mcp_config',
    resourceId: config.id,
    details: { project_id, mcp_server_id, transport },
  });

  return NextResponse.json(config, { status: 201 });
}
