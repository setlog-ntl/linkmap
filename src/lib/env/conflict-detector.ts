import type { Environment } from '@/types';

export type ConflictType = 'critical_mismatch' | 'missing_value' | 'config_mismatch';
export type ConflictSeverity = 'critical' | 'warning' | 'info';

export interface EnvConflictEntry {
  var_id: string;
  value_hash: string;
  service_id: string | null;
  service_name: string | null;
  updated_at: string;
}

export interface EnvConflict {
  id: string;
  key_name: string;
  type: ConflictType;
  severity: ConflictSeverity;
  description: string;
  environments: Record<Environment, EnvConflictEntry | null>;
  affected_services: string[];
}

interface EnvVarForConflict {
  id: string;
  key_name: string;
  environment: Environment;
  decrypted_value: string;
  service_id: string | null;
  service_name: string | null;
  updated_at: string;
}

function hashValue(value: string): string {
  // Simple hash for comparison - not crypto, just for equality checks
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

const ALL_ENVS: Environment[] = ['development', 'staging', 'production'];

export function detectConflicts(vars: EnvVarForConflict[]): EnvConflict[] {
  const conflicts: EnvConflict[] = [];
  const keyMap = new Map<string, EnvVarForConflict[]>();

  for (const v of vars) {
    const existing = keyMap.get(v.key_name) || [];
    existing.push(v);
    keyMap.set(v.key_name, existing);
  }

  for (const [keyName, entries] of keyMap) {
    const envEntries = new Map<Environment, EnvVarForConflict>();
    for (const entry of entries) {
      envEntries.set(entry.environment, entry);
    }

    const presentEnvs = Array.from(envEntries.keys());
    const missingEnvs = ALL_ENVS.filter((e) => !envEntries.has(e));

    // Missing Value: key exists in some environments but not all
    if (missingEnvs.length > 0 && presentEnvs.length > 0) {
      const environments: Record<Environment, EnvConflictEntry | null> = {
        development: null,
        staging: null,
        production: null,
      };
      const affectedServices: string[] = [];

      for (const [env, entry] of envEntries) {
        environments[env] = {
          var_id: entry.id,
          value_hash: hashValue(entry.decrypted_value),
          service_id: entry.service_id,
          service_name: entry.service_name,
          updated_at: entry.updated_at,
        };
        if (entry.service_name && !affectedServices.includes(entry.service_name)) {
          affectedServices.push(entry.service_name);
        }
      }

      conflicts.push({
        id: `missing-${keyName}`,
        key_name: keyName,
        type: 'missing_value',
        severity: missingEnvs.includes('production') ? 'critical' : 'warning',
        description: `${keyName}이(가) ${missingEnvs.join(', ')} 환경에 없습니다`,
        environments,
        affected_services: affectedServices,
      });
    }

    // Critical Mismatch: same key has different values across environments (check prod vs others)
    if (presentEnvs.length >= 2) {
      const values = new Map<string, Environment[]>();
      for (const [env, entry] of envEntries) {
        const h = hashValue(entry.decrypted_value);
        const envs = values.get(h) || [];
        envs.push(env);
        values.set(h, envs);
      }

      // Values that differ (more than one unique value group)
      if (values.size > 1) {
        // This is expected — different envs usually have different values
        // Only flag as critical if the value looks like a placeholder or empty
        const environments: Record<Environment, EnvConflictEntry | null> = {
          development: null,
          staging: null,
          production: null,
        };
        const affectedServices: string[] = [];

        for (const [env, entry] of envEntries) {
          environments[env] = {
            var_id: entry.id,
            value_hash: hashValue(entry.decrypted_value),
            service_id: entry.service_id,
            service_name: entry.service_name,
            updated_at: entry.updated_at,
          };
          if (entry.service_name && !affectedServices.includes(entry.service_name)) {
            affectedServices.push(entry.service_name);
          }
        }

        // Check for service_id mismatch across environments
        const serviceIds = new Set(
          entries.filter((e) => e.service_id).map((e) => e.service_id)
        );
        if (serviceIds.size > 1) {
          conflicts.push({
            id: `config-${keyName}`,
            key_name: keyName,
            type: 'config_mismatch',
            severity: 'info',
            description: `${keyName}이(가) 환경별로 다른 서비스에 연결되어 있습니다`,
            environments,
            affected_services: affectedServices,
          });
        }
      }
    }
  }

  // Sort by severity: critical first, then warning, then info
  const severityOrder: Record<ConflictSeverity, number> = { critical: 0, warning: 1, info: 2 };
  conflicts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return conflicts;
}
