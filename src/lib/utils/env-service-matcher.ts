import type { Service } from '@/types';

/**
 * Builds an exact-match map from env var key names to service info.
 * Uses each service's `required_env_vars[].name` for matching.
 */
export function buildEnvKeyServiceMap(
  services: Service[]
): Map<string, { serviceId: string; serviceName: string }> {
  const map = new Map<string, { serviceId: string; serviceName: string }>();
  for (const svc of services) {
    if (!svc.required_env_vars?.length) continue;
    for (const envTemplate of svc.required_env_vars) {
      if (envTemplate.name && !map.has(envTemplate.name)) {
        map.set(envTemplate.name, { serviceId: svc.id, serviceName: svc.name });
      }
    }
  }
  return map;
}

/**
 * Matches an env var key name to a service using exact match only.
 * Returns null if no match found.
 */
export function matchEnvKeyToService(
  keyName: string,
  exactMap: Map<string, { serviceId: string; serviceName: string }>
): { serviceId: string; serviceName: string } | null {
  return exactMap.get(keyName) ?? null;
}
