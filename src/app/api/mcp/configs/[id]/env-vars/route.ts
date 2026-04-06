import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createMcpEnvVarSchema } from '@/lib/validations/mcp';
import { unauthorizedError, validationError, apiError, notFoundError } from '@/lib/api/errors';
import { encrypt } from '@/lib/crypto';
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
    .from('mcp_config_env_vars')
    .select('id, mcp_config_id, key_name, description, is_secret, source_env_var_id, created_at, updated_at')
    .eq('mcp_config_id', id)
    .order('created_at');

  if (error) return apiError(error.message, 400);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = createMcpEnvVarSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // Verify config exists and user owns it
  const { data: config } = await supabase
    .from('project_mcp_configs')
    .select('id, project_id, projects!inner(user_id)')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (!config) return notFoundError('MCP 설정');

  const { data, error } = await supabase
    .from('mcp_config_env_vars')
    .insert({
      mcp_config_id: id,
      key_name: parsed.data.key_name,
      encrypted_value: encrypt(parsed.data.value),
      description: parsed.data.description ?? null,
      is_secret: parsed.data.is_secret ?? true,
      source_env_var_id: parsed.data.source_env_var_id ?? null,
    })
    .select('id, mcp_config_id, key_name, description, is_secret, source_env_var_id, created_at, updated_at')
    .single();

  if (error) return apiError(error.message, 400);

  await logAudit(user.id, {
    action: 'mcp_env_var.create',
    resourceType: 'mcp_config_env_var',
    resourceId: data.id,
    details: { mcp_config_id: id, key_name: parsed.data.key_name },
  });

  return NextResponse.json(data, { status: 201 });
}
