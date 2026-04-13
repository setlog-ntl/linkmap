import type { HealthCheckAdapter, HealthCheckResult } from '../types';

export function createGenericAdapter(
  slug: string,
  requiredVars: string[],
  optionalVars: string[] = []
): HealthCheckAdapter {
  return {
    serviceSlug: slug,
    requiredEnvVars: requiredVars,
    optionalEnvVars: optionalVars,
    async check(envVars): Promise<HealthCheckResult> {
      const start = Date.now();
      const missingRequired = requiredVars.filter((v) => !envVars[v] || envVars[v].trim() === '');
      const missingOptional = optionalVars.filter((v) => !envVars[v] || envVars[v].trim() === '');
      const elapsed = Date.now() - start;

      // 필수 변수가 누락되면 unhealthy
      if (missingRequired.length > 0) {
        return {
          status: 'unhealthy',
          message: `누락된 환경변수: ${missingRequired.join(', ')}`,
          responseTimeMs: elapsed,
          checkedAt: new Date().toISOString(),
          details: { missingVars: missingRequired, missingOptionalVars: missingOptional },
        };
      }

      // 필수는 모두 있지만 선택 변수가 누락되면 healthy + 안내
      if (missingOptional.length > 0) {
        return {
          status: 'healthy',
          message: `필수 환경변수 설정 완료 (선택 항목 미설정: ${missingOptional.join(', ')})`,
          responseTimeMs: elapsed,
          checkedAt: new Date().toISOString(),
          details: {
            configuredVars: requiredVars.length,
            missingOptionalVars: missingOptional,
            validation: 'env_var_presence',
          },
        };
      }

      // 모두 설정됨
      return {
        status: 'healthy',
        message: '필수 환경변수가 모두 설정되어 있습니다',
        responseTimeMs: elapsed,
        checkedAt: new Date().toISOString(),
        details: {
          configuredVars: requiredVars.length + optionalVars.length,
          validation: 'env_var_presence',
        },
      };
    },
  };
}
