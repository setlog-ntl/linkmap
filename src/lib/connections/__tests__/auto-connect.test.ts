import { describe, it, expect } from 'vitest';
import { suggestAutoConnections } from '../auto-connect';
import type { ServiceDependency, UserConnection } from '@/types';

// ---------------------------------------------------------------------------
// Helpers — thin factories
// ---------------------------------------------------------------------------
function makeDep(
  serviceId: string,
  dependsOn: string,
  type: string,
  opts?: { description?: string; description_ko?: string },
): ServiceDependency {
  return {
    id: `dep-${serviceId}-${dependsOn}`,
    service_id: serviceId,
    depends_on_service_id: dependsOn,
    dependency_type: type as ServiceDependency['dependency_type'],
    description: opts?.description ?? null,
    description_ko: opts?.description_ko ?? null,
  };
}

function makeConn(source: string, target: string): UserConnection {
  return {
    id: `conn-${source}-${target}`,
    project_id: 'p1',
    source_service_id: source,
    target_service_id: target,
    connection_type: 'uses',
    connection_status: 'active',
    label: null,
    description: null,
    last_verified_at: null,
    metadata: {},
    created_by: 'u1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  };
}

const svc = (id: string, slug: string) => ({ serviceId: id, slug });

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('suggestAutoConnections', () => {
  it('excludes services not in the project', () => {
    const deps = [makeDep('s1', 's2', 'required')];
    // Only s1 is in project, s2 is not
    const result = suggestAutoConnections([svc('s1', 'nextjs')], deps, []);
    expect(result).toEqual([]);
  });

  it('excludes alternative dependencies', () => {
    const deps = [makeDep('s1', 's2', 'alternative')];
    const result = suggestAutoConnections(
      [svc('s1', 'nextjs'), svc('s2', 'supabase')],
      deps,
      [],
    );
    expect(result).toEqual([]);
  });

  it('excludes already connected pairs (forward direction)', () => {
    const deps = [makeDep('s1', 's2', 'required')];
    const existing = [makeConn('s1', 's2')];
    const result = suggestAutoConnections(
      [svc('s1', 'nextjs'), svc('s2', 'supabase')],
      deps,
      existing,
    );
    expect(result).toEqual([]);
  });

  it('excludes already connected pairs (reverse direction)', () => {
    const deps = [makeDep('s1', 's2', 'required')];
    const existing = [makeConn('s2', 's1')]; // reverse
    const result = suggestAutoConnections(
      [svc('s1', 'nextjs'), svc('s2', 'supabase')],
      deps,
      existing,
    );
    expect(result).toEqual([]);
  });

  it('maps required → uses', () => {
    const deps = [makeDep('s1', 's2', 'required')];
    const result = suggestAutoConnections(
      [svc('s1', 'nextjs'), svc('s2', 'supabase')],
      deps,
      [],
    );
    expect(result).toHaveLength(1);
    expect(result[0].connection_type).toBe('uses');
  });

  it('maps recommended → integrates', () => {
    const deps = [makeDep('s1', 's2', 'recommended')];
    const result = suggestAutoConnections(
      [svc('s1', 'nextjs'), svc('s2', 'supabase')],
      deps,
      [],
    );
    expect(result).toHaveLength(1);
    expect(result[0].connection_type).toBe('integrates');
  });

  it('sorts: required > recommended > optional', () => {
    const deps = [
      makeDep('s1', 's2', 'optional'),
      makeDep('s1', 's3', 'required'),
      makeDep('s1', 's4', 'recommended'),
    ];
    const result = suggestAutoConnections(
      [svc('s1', 'a'), svc('s2', 'b'), svc('s3', 'c'), svc('s4', 'd')],
      deps,
      [],
    );
    expect(result.map((s) => s.dependency_type)).toEqual([
      'required',
      'recommended',
      'optional',
    ]);
  });

  it('uses description_ko > description > dependency_type for reason', () => {
    const deps = [
      makeDep('s1', 's2', 'required', { description_ko: '한국어 설명', description: 'English desc' }),
      makeDep('s1', 's3', 'required', { description: 'English only' }),
      makeDep('s1', 's4', 'required'),
    ];
    const result = suggestAutoConnections(
      [svc('s1', 'a'), svc('s2', 'b'), svc('s3', 'c'), svc('s4', 'd')],
      deps,
      [],
    );
    expect(result[0].reason).toBe('한국어 설명');
    expect(result[1].reason).toBe('English only');
    expect(result[2].reason).toBe('required');
  });

  it('returns empty array for empty inputs', () => {
    expect(suggestAutoConnections([], [], [])).toEqual([]);
  });
});
