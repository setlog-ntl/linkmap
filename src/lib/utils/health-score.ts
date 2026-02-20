import type { HealthScore, ProjectService, Service, HealthCheck, EnvironmentVariable } from '@/types';

const WEIGHT_CONNECTED = 0.4;
const WEIGHT_HEALTHY = 0.3;
const WEIGHT_ENV = 0.3;

export function computeHealthScore(
  services: (ProjectService & { service: Service })[],
  healthChecks: Record<string, HealthCheck>,
  envVars: EnvironmentVariable[],
): HealthScore {
  if (services.length === 0) {
    return { overall: 0, breakdown: { connected: 0, healthy: 0, envComplete: 0 } };
  }

  const connectedCount = services.filter((s) => s.status === 'connected').length;
  const connectedRatio = connectedCount / services.length;

  const healthCheckEntries = Object.values(healthChecks);
  const healthyRatio = healthCheckEntries.length > 0
    ? healthCheckEntries.filter((hc) => hc.status === 'healthy').length / healthCheckEntries.length
    : 1;

  const totalEnv = envVars.length;
  const filledEnv = envVars.filter((e) => e.encrypted_value != null && e.encrypted_value !== '').length;
  const envRatio = totalEnv > 0 ? filledEnv / totalEnv : 1;

  const overall = Math.round(
    connectedRatio * WEIGHT_CONNECTED * 100 +
    healthyRatio * WEIGHT_HEALTHY * 100 +
    envRatio * WEIGHT_ENV * 100
  );

  return {
    overall: Math.min(100, Math.max(0, overall)),
    breakdown: {
      connected: Math.round(connectedRatio * 100),
      healthy: Math.round(healthyRatio * 100),
      envComplete: Math.round(envRatio * 100),
    },
  };
}

export function getHealthGrade(score: number): 'good' | 'warning' | 'critical' {
  if (score >= 70) return 'good';
  if (score >= 40) return 'warning';
  return 'critical';
}
