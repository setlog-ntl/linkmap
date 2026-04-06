import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateMcpConfigSchema } from '@/lib/validations/mcp';
import { unauthorizedError, validationError, apiError, notFoundError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data, error } = await supabase
    .from('project_mcp_configs')
    .select('*, mcp_server:mcp_servers(*), mcp_service_links(*)')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error || !data) return notFoundError('MCP 설정');
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = updateMcpConfigSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // Verify ownership via project
  const { data: existing } = await supabase
    .from('project_mcp_configs')
    .select('id, project_id, projects!inner(user_id)')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (!existing) return notFoundError('MCP 설정');

  const { data, error } = await supabase
    .from('project_mcp_configs')
    .update(parsed.data)
    .eq('id', id)
    .select('*, mcp_server:mcp_servers(*)')
    .single();

  if (error) return apiError(error.message, 400);

  await logAudit(user.id, {
    action: 'mcp_config.update',
    resourceType: 'project_mcp_config',
    resourceId: id,
    details: parsed.data,
  });

  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // Soft delete
  const { data, error } = await supabase
    .from('project_mcp_configs')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .select('id')
    .single();

  if (error || !data) return notFoundError('MCP 설정');

  await logAudit(user.id, {
    action: 'mcp_config.delete',
    resourceType: 'project_mcp_config',
    resourceId: id,
  });

  return NextResponse.json({ success: true });
}
