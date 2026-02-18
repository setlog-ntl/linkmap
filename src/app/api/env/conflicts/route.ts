import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { decrypt } from '@/lib/crypto';
import { unauthorizedError, notFoundError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { detectConflicts } from '@/lib/env/conflict-detector';
import type { Environment } from '@/types';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');
  if (!projectId) {
    return NextResponse.json({ error: 'project_id가 필요합니다' }, { status: 400 });
  }

  // Verify ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  // Fetch all env vars for the project
  const { data: envVars, error } = await supabase
    .from('environment_variables')
    .select('id, key_name, encrypted_value, environment, service_id, updated_at')
    .eq('project_id', projectId)
    .order('key_name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch service names
  const serviceIds = [...new Set((envVars || []).filter((v) => v.service_id).map((v) => v.service_id))];
  let serviceNameMap = new Map<string, string>();
  if (serviceIds.length > 0) {
    const { data: services } = await supabase
      .from('services')
      .select('id, name')
      .in('id', serviceIds);
    if (services) {
      serviceNameMap = new Map(services.map((s) => [s.id, s.name]));
    }
  }

  // Decrypt values for comparison (values are NOT returned to client)
  const decryptedVars = (envVars || []).map((v) => {
    let decryptedValue = '';
    try {
      decryptedValue = decrypt(v.encrypted_value);
    } catch {
      decryptedValue = '';
    }
    return {
      id: v.id,
      key_name: v.key_name,
      environment: v.environment as Environment,
      decrypted_value: decryptedValue,
      service_id: v.service_id,
      service_name: v.service_id ? serviceNameMap.get(v.service_id) || null : null,
      updated_at: v.updated_at,
    };
  });

  const conflicts = detectConflicts(decryptedVars);

  await logAudit(user.id, {
    action: 'env_var.conflict_scan',
    resourceType: 'project',
    resourceId: projectId,
    details: { conflict_count: conflicts.length },
  });

  return NextResponse.json({ conflicts, scanned_at: new Date().toISOString() });
}
