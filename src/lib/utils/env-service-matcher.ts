import type { Service } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';

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

  // 0차: 서비스 slug/name 자체를 prefix로 등록 (required_env_vars 유무와 무관)
  // → DB에 서비스가 있으면 slug/name만으로도 NEXT_PUBLIC_POLAR_* 등을 매칭 가능
  for (const svc of services) {
    const svcSlug = svc.slug?.toUpperCase();
    const svcName = svc.name?.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const entry = { serviceId: svc.id, serviceName: svc.name };
    if (svcSlug && svcSlug.length >= 2 && !map.has(svcSlug)) {
      map.set(svcSlug, entry);
      ownedPrefixes.add(svcSlug);
    }
    if (svcName && svcName.length >= 2 && svcName !== svcSlug && !map.has(svcName)) {
      map.set(svcName, entry);
      ownedPrefixes.add(svcName);
    }
  }

  // 1차: 서비스 slug/name과 일치하는 env var prefix 등록 (발급처 우선)
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
      // prefix가 서비스 자체 slug/name과 일치하면 즉시 등록 (이미 0차에서 등록된 경우 덮어쓰기)
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

/**
 * 카탈로그 서비스를 조회하여 매칭맵을 생성하는 헬퍼.
 * 단일/벌크 생성·수정 API에서 공용으로 사용.
 */
export async function buildServiceMapsFromDB(supabase: SupabaseClient) {
  const { data: catalogServices = [] } = await supabase
    .from('services')
    .select('id, name, slug, required_env_vars');

  const exactMap = buildEnvKeyServiceMap(catalogServices as Service[]);
  const prefixMap = buildEnvPrefixServiceMap(catalogServices as Service[]);
  return { exactMap, prefixMap };
}

/**
 * service_id가 명시되지 않은 경우 key_name으로 자동 매칭.
 * 명시적 service_id가 있으면 그대로 반환 (사용자 선택 우선).
 */
export function resolveServiceId(
  keyName: string,
  explicitServiceId: string | null | undefined,
  exactMap: Map<string, { serviceId: string; serviceName: string }>,
  prefixMap: Map<string, { serviceId: string; serviceName: string }>
): string | null {
  // 사용자가 명시적으로 service_id를 지정했으면 그대로 사용
  if (explicitServiceId) return explicitServiceId;

  const match = matchEnvKeyToServiceFuzzy(keyName, exactMap, prefixMap);
  return match?.serviceId ?? null;
}
