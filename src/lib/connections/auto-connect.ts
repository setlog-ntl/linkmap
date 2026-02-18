import type { ServiceDependency, UserConnection, UserConnectionType } from '@/types';

interface ProjectServiceInfo {
  serviceId: string;
  slug: string;
}

interface AutoConnectSuggestion {
  source_service_id: string;
  target_service_id: string;
  connection_type: UserConnectionType;
  reason: string;
  dependency_type: string;
}

const DEP_TO_CONNECTION: Record<string, UserConnectionType> = {
  required: 'uses',
  recommended: 'integrates',
  optional: 'integrates',
  alternative: 'integrates',
};

/**
 * Given a project's services and the global dependency graph,
 * suggest connections that don't already exist.
 */
export function suggestAutoConnections(
  projectServices: ProjectServiceInfo[],
  dependencies: ServiceDependency[],
  existingConnections: UserConnection[]
): AutoConnectSuggestion[] {
  const serviceIds = new Set(projectServices.map((s) => s.serviceId));

  // Build a set of existing connections for dedup
  const existingSet = new Set(
    existingConnections.map((c) => `${c.source_service_id}:${c.target_service_id}`)
  );

  const suggestions: AutoConnectSuggestion[] = [];

  for (const dep of dependencies) {
    // Only suggest if both services are in the project
    if (!serviceIds.has(dep.service_id) || !serviceIds.has(dep.depends_on_service_id)) {
      continue;
    }

    // Skip alternatives (they don't represent actual connections)
    if (dep.dependency_type === 'alternative') continue;

    // Skip if already connected (either direction)
    const fwd = `${dep.service_id}:${dep.depends_on_service_id}`;
    const rev = `${dep.depends_on_service_id}:${dep.service_id}`;
    if (existingSet.has(fwd) || existingSet.has(rev)) continue;

    suggestions.push({
      source_service_id: dep.service_id,
      target_service_id: dep.depends_on_service_id,
      connection_type: DEP_TO_CONNECTION[dep.dependency_type] ?? 'uses',
      reason: dep.description_ko ?? dep.description ?? dep.dependency_type,
      dependency_type: dep.dependency_type,
    });
  }

  // Sort: required first, then recommended, then optional
  const priority: Record<string, number> = { required: 0, recommended: 1, optional: 2 };
  suggestions.sort((a, b) => (priority[a.dependency_type] ?? 9) - (priority[b.dependency_type] ?? 9));

  return suggestions;
}
