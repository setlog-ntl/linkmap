import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeApplySchema } from '@/lib/validations/analyze';
import { unauthorizedError, notFoundError, validationError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { encrypt } from '@/lib/crypto';
import { suggestAutoConnections } from '@/lib/connections/auto-connect';
import type { Service } from '@/types';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = analyzeApplySchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { project_id, entries } = parsed.data;

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  // Get existing env vars for dedup
  const { data: existingVars = [] } = await supabase
    .from('environment_variables')
    .select('id, key_name, environment')
    .eq('project_id', project_id)
    .is('deleted_at', null);

  const existingKeyMap = new Map(
    (existingVars ?? []).map((v) => [`${v.key_name}:${v.environment}`, v.id])
  );

  // Separate new vs update
  const toCreate: typeof entries = [];
  const toUpdate: { id: string; value: string; service_id: string | null }[] = [];

  for (const entry of entries) {
    const key = `${entry.key_name}:${entry.environment}`;
    const existingId = existingKeyMap.get(key);
    if (existingId) {
      toUpdate.push({
        id: existingId,
        value: entry.value,
        service_id: entry.service_id,
      });
    } else {
      toCreate.push(entry);
    }
  }

  // Bulk create
  let created = 0;
  if (toCreate.length > 0) {
    const rows = toCreate.map((entry) => ({
      project_id,
      key_name: entry.key_name,
      encrypted_value: encrypt(entry.value),
      environment: entry.environment,
      is_secret: entry.is_secret,
      service_id: entry.service_id,
    }));

    const { data: inserted, error } = await supabase
      .from('environment_variables')
      .insert(rows)
      .select('id');

    if (error) return serverError(`환경변수 생성 실패: ${error.message}`);
    created = inserted?.length ?? 0;
  }

  // Bulk update existing
  let updated = 0;
  if (toUpdate.length > 0) {
    const results = await Promise.all(
      toUpdate.map((item) =>
        supabase
          .from('environment_variables')
          .update({
            encrypted_value: encrypt(item.value),
            service_id: item.service_id,
          })
          .eq('id', item.id)
          .eq('project_id', project_id)
      )
    );
    updated = results.filter((r) => !r.error).length;
  }

  // Auto-register services (from env/sync logic)
  const serviceIds = new Set(
    entries.filter((e) => e.service_id).map((e) => e.service_id as string)
  );

  const { data: existingProjectServices = [] } = await supabase
    .from('project_services')
    .select('service_id')
    .eq('project_id', project_id);

  const existingServiceIds = new Set((existingProjectServices ?? []).map((s) => s.service_id));
  const missingServiceIds = [...serviceIds].filter((sid) => !existingServiceIds.has(sid));

  let servicesAdded = 0;
  if (missingServiceIds.length > 0) {
    const { data: inserted } = await supabase
      .from('project_services')
      .insert(
        missingServiceIds.map((service_id) => ({
          project_id,
          service_id,
          status: 'in_progress',
        }))
      )
      .select('id');
    servicesAdded = inserted?.length ?? 0;
  }

  // Update service statuses based on required env var completeness
  if (serviceIds.size > 0) {
    const { data: matchedServices = [] } = await supabase
      .from('services')
      .select('id, required_env_vars')
      .in('id', [...serviceIds]);

    // Re-fetch all env vars for the project
    const { data: allEnvVars = [] } = await supabase
      .from('environment_variables')
      .select('key_name, service_id')
      .eq('project_id', project_id)
      .is('deleted_at', null);

    const envKeysByService = new Map<string, Set<string>>();
    for (const ev of allEnvVars ?? []) {
      if (!ev.service_id) continue;
      if (!envKeysByService.has(ev.service_id)) {
        envKeysByService.set(ev.service_id, new Set());
      }
      envKeysByService.get(ev.service_id)!.add(ev.key_name);
    }

    const connectedIds: string[] = [];
    for (const svc of matchedServices ?? []) {
      const requiredKeys = (svc.required_env_vars as { name: string }[] | null)?.map(
        (v) => v.name
      ) ?? [];
      if (requiredKeys.length === 0) continue;
      const existingKeys = envKeysByService.get(svc.id) ?? new Set();
      if (requiredKeys.every((k) => existingKeys.has(k))) {
        connectedIds.push(svc.id);
      }
    }

    if (connectedIds.length > 0) {
      await supabase
        .from('project_services')
        .update({ status: 'connected' })
        .eq('project_id', project_id)
        .in('service_id', connectedIds)
        .neq('status', 'connected');
    }
  }

  // Auto connections
  const [psResult, depsResult, connResult] = await Promise.all([
    supabase.from('project_services').select('service_id, id').eq('project_id', project_id),
    supabase.from('service_dependencies').select('*'),
    supabase.from('user_connections').select('*').eq('project_id', project_id),
  ]);

  const suggestions = suggestAutoConnections(
    (psResult.data || []).map((ps) => ({ serviceId: ps.service_id, slug: '' })),
    depsResult.data || [],
    connResult.data || [],
  );

  let autoConnections = 0;
  const toInsert = suggestions.slice(0, 10).map((s) => ({
    project_id,
    source_service_id: s.source_service_id,
    target_service_id: s.target_service_id,
    connection_type: s.connection_type,
    label: s.reason,
  }));
  if (toInsert.length > 0) {
    const { data: inserted } = await supabase
      .from('user_connections')
      .insert(toInsert)
      .select('id');
    autoConnections = inserted?.length ?? 0;
  }

  await logAudit(user.id, {
    action: 'env_var.bulk_create',
    resourceType: 'project',
    resourceId: project_id,
    details: {
      created,
      updated,
      services_added: servicesAdded,
      auto_connections: autoConnections,
      key_count: entries.length,
    },
  });

  return NextResponse.json({
    created,
    updated,
    services_added: servicesAdded,
    auto_connections: autoConnections,
    details: entries.map((e) => e.key_name),
  });
}
