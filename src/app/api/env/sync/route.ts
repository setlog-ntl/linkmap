import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncEnvServicesSchema } from '@/lib/validations/env';
import { unauthorizedError, notFoundError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { suggestAutoConnections } from '@/lib/connections/auto-connect';
import { buildEnvKeyServiceMap, buildEnvPrefixServiceMap, matchEnvKeyToServiceFuzzy } from '@/lib/utils/env-service-matcher';
import type { Service } from '@/types';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = syncEnvServicesSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { project_id } = parsed.data;

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  // Get all catalog services with required_env_vars for matching
  const { data: catalogServices = [] } = await supabase
    .from('services')
    .select('id, name, required_env_vars');

  // Build matching maps
  const exactMap = buildEnvKeyServiceMap(catalogServices as Service[]);
  const prefixMap = buildEnvPrefixServiceMap(catalogServices as Service[]);

  // Get ALL env vars for this project (including those without service_id)
  const { data: allEnvVars = [] } = await supabase
    .from('environment_variables')
    .select('id, key_name, service_id')
    .eq('project_id', project_id)
    .is('deleted_at', null);

  // Auto-detect service_id for env vars that don't have one yet
  const toUpdate: { id: string; service_id: string }[] = [];
  for (const ev of allEnvVars || []) {
    if (ev.service_id) continue; // already assigned
    const match = matchEnvKeyToServiceFuzzy(ev.key_name, exactMap, prefixMap);
    if (match) {
      toUpdate.push({ id: ev.id, service_id: match.serviceId });
    }
  }

  // Batch update service_id on matched env vars
  let updatedVars = 0;
  if (toUpdate.length > 0) {
    for (const item of toUpdate) {
      const { error } = await supabase
        .from('environment_variables')
        .update({ service_id: item.service_id })
        .eq('id', item.id)
        .eq('project_id', project_id);
      if (!error) updatedVars++;
    }
  }

  // Re-fetch env vars to get updated service_id assignments
  const { data: envVarsWithService = [] } = await supabase
    .from('environment_variables')
    .select('service_id, key_name')
    .eq('project_id', project_id)
    .is('deleted_at', null)
    .not('service_id', 'is', null);

  const envServiceIds = new Set(
    (envVarsWithService || []).filter((v) => v.service_id).map((v) => v.service_id as string)
  );

  // Get existing project_services
  const { data: existingServices = [] } = await supabase
    .from('project_services')
    .select('service_id, id, status')
    .eq('project_id', project_id);

  const existingServiceIds = new Set(
    (existingServices || []).map((s) => s.service_id)
  );

  // Insert missing services
  const missingServiceIds = [...envServiceIds].filter(
    (sid) => !existingServiceIds.has(sid)
  );

  let addedServices = 0;
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
      .select();
    addedServices = inserted?.length ?? 0;
  }

  // Update existing service statuses based on required env vars completeness
  const { data: matchedServices = [] } = await supabase
    .from('services')
    .select('id, required_env_vars')
    .in('id', [...envServiceIds]);

  const { data: latestEnvVars = [] } = await supabase
    .from('environment_variables')
    .select('key_name, service_id')
    .eq('project_id', project_id)
    .is('deleted_at', null);

  const envKeysByService = new Map<string, Set<string>>();
  for (const ev of latestEnvVars || []) {
    if (!ev.service_id) continue;
    if (!envKeysByService.has(ev.service_id)) {
      envKeysByService.set(ev.service_id, new Set());
    }
    envKeysByService.get(ev.service_id)!.add(ev.key_name);
  }

  let updatedStatuses = 0;
  for (const svc of matchedServices || []) {
    const requiredKeys = (svc.required_env_vars as { name: string }[] | null)?.map(
      (v) => v.name
    ) ?? [];
    if (requiredKeys.length === 0) continue;

    const existingKeys = envKeysByService.get(svc.id) ?? new Set();
    const allFulfilled = requiredKeys.every((k) => existingKeys.has(k));
    const newStatus = allFulfilled ? 'connected' : 'in_progress';

    const { data: updated } = await supabase
      .from('project_services')
      .update({ status: newStatus })
      .eq('project_id', project_id)
      .eq('service_id', svc.id)
      .neq('status', newStatus)
      .select();

    if (updated && updated.length > 0) updatedStatuses++;
  }

  // Suggest auto connections
  const { data: projectServices = [] } = await supabase
    .from('project_services')
    .select('service_id, id')
    .eq('project_id', project_id);

  const { data: dependencies = [] } = await supabase
    .from('service_dependencies')
    .select('*');

  const { data: existingConnections = [] } = await supabase
    .from('user_connections')
    .select('*')
    .eq('project_id', project_id);

  const suggestions = suggestAutoConnections(
    (projectServices || []).map((ps) => ({ serviceId: ps.service_id, slug: '' })),
    dependencies || [],
    existingConnections || []
  );

  let autoConnections = 0;
  for (const suggestion of suggestions.slice(0, 10)) {
    const { error } = await supabase.from('user_connections').insert({
      project_id,
      source_service_id: suggestion.source_service_id,
      target_service_id: suggestion.target_service_id,
      connection_type: suggestion.connection_type,
      label: suggestion.reason,
    });
    if (!error) autoConnections++;
  }

  await logAudit(user.id, {
    action: 'env_var.sync_services',
    resourceType: 'project',
    resourceId: project_id,
    details: {
      updated_vars: updatedVars,
      added_services: addedServices,
      updated_statuses: updatedStatuses,
      auto_connections: autoConnections,
    },
  });

  return NextResponse.json({
    updated_vars: updatedVars,
    added_services: addedServices,
    updated_statuses: updatedStatuses,
    auto_connections: autoConnections,
  });
}
