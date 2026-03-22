import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncEnvServicesSchema } from '@/lib/validations/env';
import { unauthorizedError, notFoundError, validationError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { suggestAutoConnections } from '@/lib/connections/auto-connect';
import { buildEnvKeyServiceMap, buildEnvPrefixServiceMap, matchEnvKeyToServiceFuzzy } from '@/lib/utils/env-service-matcher';
import type { Service } from '@/types';

export async function POST(request: NextRequest) {
  try {
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
    const matchedDetails: { key_name: string; service_name: string; confidence: 'exact' | 'prefix' }[] = [];
    for (const ev of allEnvVars || []) {
      if (ev.service_id) continue; // already assigned
      const match = matchEnvKeyToServiceFuzzy(ev.key_name, exactMap, prefixMap);
      if (match) {
        toUpdate.push({ id: ev.id, service_id: match.serviceId });
        matchedDetails.push({ key_name: ev.key_name, service_name: match.serviceName, confidence: match.confidence });
      }
    }

    // Batch update service_id on matched env vars (grouped by service_id)
    let updatedVars = 0;
    if (toUpdate.length > 0) {
      const grouped = new Map<string, string[]>();
      for (const item of toUpdate) {
        const ids = grouped.get(item.service_id) ?? [];
        ids.push(item.id);
        grouped.set(item.service_id, ids);
      }
      const results = await Promise.all(
        [...grouped.entries()].map(([serviceId, ids]) =>
          supabase
            .from('environment_variables')
            .update({ service_id: serviceId })
            .in('id', ids)
            .eq('project_id', project_id)
        )
      );
      updatedVars = toUpdate.length - results.filter((r) => r.error).length;
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
    const addedServiceNames: string[] = [];
    if (missingServiceIds.length > 0) {
      // 추가할 서비스 이름 조회
      const { data: serviceNames = [] } = await supabase
        .from('services')
        .select('id, name')
        .in('id', missingServiceIds);
      const svcNameMap = new Map((serviceNames || []).map((s) => [s.id, s.name]));

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
      for (const sid of missingServiceIds) {
        const name = svcNameMap.get(sid);
        if (name) addedServiceNames.push(name);
      }
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

    // Batch status updates: group service IDs by target status
    const connectedIds: string[] = [];
    const inProgressIds: string[] = [];
    for (const svc of matchedServices || []) {
      const requiredKeys = (svc.required_env_vars as { name: string }[] | null)?.map(
        (v) => v.name
      ) ?? [];
      if (requiredKeys.length === 0) continue;

      const existingKeys = envKeysByService.get(svc.id) ?? new Set();
      const allFulfilled = requiredKeys.every((k) => existingKeys.has(k));
      if (allFulfilled) connectedIds.push(svc.id);
      else inProgressIds.push(svc.id);
    }

    let updatedStatuses = 0;
    const statusUpdates = await Promise.all([
      connectedIds.length > 0
        ? supabase
            .from('project_services')
            .update({ status: 'connected' })
            .eq('project_id', project_id)
            .in('service_id', connectedIds)
            .neq('status', 'connected')
            .select()
        : Promise.resolve({ data: [] }),
      inProgressIds.length > 0
        ? supabase
            .from('project_services')
            .update({ status: 'in_progress' })
            .eq('project_id', project_id)
            .in('service_id', inProgressIds)
            .neq('status', 'in_progress')
            .select()
        : Promise.resolve({ data: [] }),
    ]);
    updatedStatuses = (statusUpdates[0].data?.length ?? 0) + (statusUpdates[1].data?.length ?? 0);

    // Suggest auto connections (3 queries in parallel)
    const [psResult, depsResult, connResult] = await Promise.all([
      supabase.from('project_services').select('service_id, id').eq('project_id', project_id),
      supabase.from('service_dependencies').select('*'),
      supabase.from('user_connections').select('*').eq('project_id', project_id),
    ]);

    const suggestions = suggestAutoConnections(
      (psResult.data || []).map((ps) => ({ serviceId: ps.service_id, slug: '' })),
      depsResult.data || [],
      connResult.data || []
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
      // Batch insert (UNIQUE constraint handles duplicates gracefully)
      const { data: inserted } = await supabase
        .from('user_connections')
        .insert(toInsert)
        .select('id');
      autoConnections = inserted?.length ?? 0;
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
      matched_details: matchedDetails,
      added_service_names: addedServiceNames,
    });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Unknown error');
  }
}
