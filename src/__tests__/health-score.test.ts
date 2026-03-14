import { describe, it, expect } from 'vitest';
import { computeHealthScore, getHealthGrade } from '@/lib/utils/health-score';
import type { ProjectService, Service, HealthCheck, EnvironmentVariable } from '@/types';

type MockPS = ProjectService & { service: Service };

const mockService = (status: 'not_started' | 'in_progress' | 'connected' | 'error'): MockPS => ({
  id: `ps-${Math.random()}`,
  project_id: 'proj-1',
  service_id: `svc-${Math.random()}`,
  status,
  notes: null,
  cost_tier_id: null,
  custom_cost_monthly: null,
  custom_cost_yearly: null,
  cost_notes: null,
  billing_cycle: 'monthly',
  created_at: '',
  updated_at: '',
  service: {
    id: `svc-${Math.random()}`,
    name: 'Test Service',
    slug: 'test',
    category: 'database',
    description: null,
    description_ko: null,
    website_url: null,
    docs_url: null,
    icon_url: null,
    pricing_info: {},
    required_env_vars: [],
    created_at: '',
  },
});

const mockHealthCheck = (status: 'healthy' | 'unhealthy'): HealthCheck => ({
  id: `hc-${Math.random()}`,
  project_service_id: `ps-${Math.random()}`,
  environment: 'production',
  status,
  message: null,
  response_time_ms: 100,
  details: {},
  checked_at: new Date().toISOString(),
});

const mockEnvVar = (filled: boolean): EnvironmentVariable => ({
  id: `ev-${Math.random()}`,
  project_id: 'p1',
  service_id: 's1',
  key_name: `KEY_${Math.random()}`,
  encrypted_value: filled ? 'encrypted-val' : '',
  environment: 'production',
  is_secret: false,
  description: null,
  created_at: '',
  updated_at: '',
});

describe('computeHealthScore', () => {
  it('returns 0 for empty services', () => {
    const result = computeHealthScore([], {}, []);
    expect(result.overall).toBe(0);
    expect(result.breakdown.connected).toBe(0);
  });

  it('returns 100 for all connected, all healthy, all env filled', () => {
    const s1 = mockService('connected');
    const s2 = mockService('connected');
    const services = [s1, s2];
    // healthChecks 키를 서비스 id와 매칭해야 함
    const healthChecks: Record<string, HealthCheck> = {
      [s1.id]: mockHealthCheck('healthy'),
      [s2.id]: mockHealthCheck('healthy'),
    };
    const envVars = [mockEnvVar(true)];

    const result = computeHealthScore(services, healthChecks, envVars);
    expect(result.overall).toBe(100);
    expect(result.breakdown.connected).toBe(100);
    expect(result.breakdown.healthy).toBe(100);
    expect(result.breakdown.envComplete).toBe(100);
  });

  it('returns partial score for mixed states', () => {
    const s1 = mockService('connected');
    const s2 = mockService('not_started');
    const services = [s1, s2];
    const healthChecks: Record<string, HealthCheck> = {
      [s1.id]: mockHealthCheck('unhealthy'),
    };
    const envVars = [mockEnvVar(true), mockEnvVar(false)];

    const result = computeHealthScore(services, healthChecks, envVars);
    // connected: 1/2 = 50% → 50*0.4 = 20
    // healthy: 0 healthy / 2 services = 0% → 0*0.3 = 0
    // env: 1/2 = 50% → 50*0.3 = 15
    // total = 35
    expect(result.overall).toBe(35);
    expect(result.breakdown.connected).toBe(50);
    expect(result.breakdown.healthy).toBe(0);
    expect(result.breakdown.envComplete).toBe(50);
  });

  it('handles no health checks as 0% healthy (미검증)', () => {
    const services = [mockService('connected')];
    const result = computeHealthScore(services, {}, []);
    // connected: 100% → 40, healthy: 0% (미검증) → 0, env: 100% (no vars) → 30
    expect(result.overall).toBe(70);
    expect(result.breakdown.healthy).toBe(0);
  });
});

describe('getHealthGrade', () => {
  it('returns good for score >= 70', () => {
    expect(getHealthGrade(70)).toBe('good');
    expect(getHealthGrade(100)).toBe('good');
  });

  it('returns warning for score 40-69', () => {
    expect(getHealthGrade(40)).toBe('warning');
    expect(getHealthGrade(69)).toBe('warning');
  });

  it('returns critical for score < 40', () => {
    expect(getHealthGrade(0)).toBe('critical');
    expect(getHealthGrade(39)).toBe('critical');
  });
});
