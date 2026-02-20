import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncEnvServicesSchema } from '@/lib/validations/env';
import { unauthorizedError, notFoundError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { suggestAutoConnections } from '@/lib/connections/auto-connect';

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

  // Get env vars that have a service_id assigned
  const { data: envVars = [] } = await supabase
    .from('environment_variables')
    .select('service_id, key_name')
    .eq('project_id', project_id)
    .not('service_id', 'is', null);

  const envServiceIds = new Set(
    (envVars || []).filter((v) => v.service_id).map((v) => v.service_id as string)
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
  const { data: allServices = [] } = await supabase
    .from('services')
    .select('id, required_env_vars')
    .in('id', [...envServiceIds]);

  const { data: allEnvVars = [] } = await supabase
    .from('environment_variables')
    .select('key_name, service_id')
    .eq('project_id', project_id);

  const envKeysByService = new Map<string, Set<string>>();
  for (const ev of allEnvVars || []) {
    if (!ev.service_id) continue;
    if (!envKeysByService.has(ev.service_id)) {
      envKeysByService.set(ev.service_id, new Set());
    }
    envKeysByService.get(ev.service_id)!.add(ev.key_name);
  }

  let updatedStatuses = 0;
  for (const svc of allServices || []) {
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
      added_services: addedServices,
      updated_statuses: updatedStatuses,
      auto_connections: autoConnections,
    },
  });

  return NextResponse.json({
    added_services: addedServices,
    updated_statuses: updatedStatuses,
    auto_connections: autoConnections,
  });
}
