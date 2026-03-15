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

/**
 * Builds a prefix-based map from env var key prefixes to service info.
 * Extracts the common prefix from each service's required_env_vars names.
 * e.g. NEXT_PUBLIC_SUPABASE_URL → prefix "SUPABASE" → supabase service
 */
export function buildEnvPrefixServiceMap(
  services: Service[]
): Map<string, { serviceId: string; serviceName: string }> {
  const map = new Map<string, { serviceId: string; serviceName: string }>();
  // 서비스 자체 이름/slug와 일치하는 prefix를 추적하여 우선권 부여
  const ownedPrefixes = new Set<string>();

  // 1차: 서비스 slug/name과 일치하는 prefix만 먼저 등록 (발급처 우선)
  for (const svc of services) {
    if (!svc.required_env_vars?.length) continue;
    const svcSlug = svc.slug?.toUpperCase();
    const svcName = svc.name?.toUpperCase().replace(/[^A-Z0-9]/g, '');
    for (const envTemplate of svc.required_env_vars) {
      if (!envTemplate.name) continue;
      const stripped = envTemplate.name
        .replace(/^(NEXT_PUBLIC_|REACT_APP_|VITE_|NUXT_PUBLIC_)/, '');
      const firstSegment = stripped.split('_')[0];
      if (!firstSegment || firstSegment.length < 2) continue;
      // prefix가 서비스 자체 slug/name과 일치하면 즉시 등록
      if (firstSegment === svcSlug || firstSegment === svcName) {
        map.set(firstSegment, { serviceId: svc.id, serviceName: svc.name });
        ownedPrefixes.add(firstSegment);
      }
    }
  }

  // 2차: 나머지 prefix 등록 (이미 소유된 prefix는 덮어쓰지 않음)
  for (const svc of services) {
    if (!svc.required_env_vars?.length) continue;
    for (const envTemplate of svc.required_env_vars) {
      if (!envTemplate.name) continue;
      const stripped = envTemplate.name
        .replace(/^(NEXT_PUBLIC_|REACT_APP_|VITE_|NUXT_PUBLIC_)/, '');
      const firstSegment = stripped.split('_')[0];
      if (!firstSegment || firstSegment.length < 2) continue;
      if (!map.has(firstSegment)) {
        map.set(firstSegment, { serviceId: svc.id, serviceName: svc.name });
      }
    }
  }
  return map;
}

export type EnvServiceMatch = {
  serviceId: string;
  serviceName: string;
  confidence: 'exact' | 'prefix';
};

/**
 * Matches an env var key to a service using exact match first, then prefix match.
 */
export function matchEnvKeyToServiceFuzzy(
  keyName: string,
  exactMap: Map<string, { serviceId: string; serviceName: string }>,
  prefixMap: Map<string, { serviceId: string; serviceName: string }>
): EnvServiceMatch | null {
  const exact = exactMap.get(keyName);
  if (exact) return { ...exact, confidence: 'exact' };

  // Strip common framework prefixes and check first segment
  const stripped = keyName.replace(/^(NEXT_PUBLIC_|REACT_APP_|VITE_|NUXT_PUBLIC_)/, '');
  const firstSegment = stripped.split('_')[0];
  if (firstSegment && firstSegment.length >= 2) {
    const prefix = prefixMap.get(firstSegment);
    if (prefix) return { ...prefix, confidence: 'prefix' };
  }

  return null;
}
