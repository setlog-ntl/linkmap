import type { Environment, HealthCheckStatus } from './core';

export interface EnvironmentVariable {
  id: string;
  project_id: string;
  service_id: string | null;
  key_name: string;
  encrypted_value: string;
  environment: Environment;
  is_secret: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthCheck {
  id: string;
  project_service_id: string;
  environment: Environment;
  status: HealthCheckStatus;
  message: string | null;
  response_time_ms: number | null;
  details: Record<string, unknown>;
  checked_at: string;
}

// Re-exported from lib
export type { ConflictType, ConflictSeverity, EnvConflict, EnvConflictEntry } from '@/lib/env/conflict-detector';
