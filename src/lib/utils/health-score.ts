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

  // 서비스 단위로 헬스 체크를 매칭하여 계산
  // 체크가 있는 서비스만 대상으로 healthy 비율 산출 (없으면 미검증으로 0% 처리)
  let checkedCount = 0;
  let healthyCount = 0;
  for (const svc of services) {
    const check = healthChecks[svc.id];
    if (check) {
      checkedCount++;
      if (check.status === 'healthy') healthyCount++;
    }
  }
  const healthyRatio = checkedCount > 0
    ? healthyCount / services.length
    : 0;

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
