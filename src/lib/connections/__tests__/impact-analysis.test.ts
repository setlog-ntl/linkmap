import { describe, it, expect } from 'vitest';
import { analyzeImpact } from '../impact-analysis';

const SVC_A = 'aaaaaaaa-0000-4000-8000-000000000001';
const SVC_B = 'bbbbbbbb-0000-4000-8000-000000000002';
const SVC_C = 'cccccccc-0000-4000-8000-000000000003';
const SVC_D = 'dddddddd-0000-4000-8000-000000000004';

const serviceNames = new Map([
  [SVC_A, 'Service A'],
  [SVC_B, 'Service B'],
  [SVC_C, 'Service C'],
  [SVC_D, 'Service D'],
]);

// Connections: A uses B, C uses B, D uses C
// Graph: A→B, C→B, D→C
// If B fails: A (depth 1, high), C (depth 1, high), D (depth 2, medium)
const connections = [
  { source_service_id: SVC_A, target_service_id: SVC_B, connection_type: 'uses' },
  { source_service_id: SVC_C, target_service_id: SVC_B, connection_type: 'integrates' },
  { source_service_id: SVC_D, target_service_id: SVC_C, connection_type: 'api_call' },
];

describe('analyzeImpact', () => {
  it('returns empty affected list when no dependents', () => {
    const result = analyzeImpact(connections, serviceNames, SVC_A);
    expect(result.affected).toHaveLength(0);
    expect(result.summary.total).toBe(0);
    expect(result.summary.risk_level).toBe('low');
  });

  it('finds direct dependents at depth 1', () => {
    const result = analyzeImpact(connections, serviceNames, SVC_B);
    const directIds = result.affected.filter((a) => a.depth === 1).map((a) => a.service_id);
    expect(directIds).toContain(SVC_A);
    expect(directIds).toContain(SVC_C);
  });

  it('finds transitive dependents at depth 2', () => {
    const result = analyzeImpact(connections, serviceNames, SVC_B);
    const depth2 = result.affected.filter((a) => a.depth === 2);
    expect(depth2).toHaveLength(1);
    expect(depth2[0].service_id).toBe(SVC_D);
  });

  it('assigns high risk to depth-1, medium to depth-2', () => {
    const result = analyzeImpact(connections, serviceNames, SVC_B);
    const aEntry = result.affected.find((a) => a.service_id === SVC_A);
    const dEntry = result.affected.find((a) => a.service_id === SVC_D);
    expect(aEntry?.risk).toBe('high');
    expect(dEntry?.risk).toBe('medium');
  });

  it('overall risk is "high" when any direct dependent exists', () => {
    const result = analyzeImpact(connections, serviceNames, SVC_B);
    expect(result.summary.risk_level).toBe('high');
  });

  it('overall risk is "medium" when only transitive dependents', () => {
    // Only C→B. If B goes down, C is depth 1 (high). But let's test C failing:
    // D uses C → depth 1 = high. So test B failing with only C as dependent:
    const subConns = [
      { source_service_id: SVC_D, target_service_id: SVC_C, connection_type: 'uses' },
    ];
    // C failing: D is depth 1 (high)
    const result = analyzeImpact(subConns, serviceNames, SVC_C);
    expect(result.summary.risk_level).toBe('high');
    expect(result.summary.direct_count).toBe(1);

    // Now test: A failing with no dependents → low
    const resultA = analyzeImpact(subConns, serviceNames, SVC_A);
    expect(resultA.summary.risk_level).toBe('low');
  });

  it('does not include the failing service itself in affected list', () => {
    const result = analyzeImpact(connections, serviceNames, SVC_B);
    expect(result.affected.every((a) => a.service_id !== SVC_B)).toBe(true);
  });

  it('uses fallback name when service not in names map', () => {
    const unknownId = 'ffffffff-0000-4000-8000-000000000099';
    const conns = [
      { source_service_id: unknownId, target_service_id: SVC_A, connection_type: 'uses' },
    ];
    const result = analyzeImpact(conns, serviceNames, SVC_A);
    expect(result.affected[0].name).toBe(unknownId.slice(0, 8));
  });

  it('handles empty connections gracefully', () => {
    const result = analyzeImpact([], serviceNames, SVC_A);
    expect(result.affected).toHaveLength(0);
    expect(result.summary.total).toBe(0);
  });

  it('includes correct connection_type in affected entry', () => {
    const result = analyzeImpact(connections, serviceNames, SVC_B);
    const aEntry = result.affected.find((a) => a.service_id === SVC_A);
    expect(aEntry?.via_connection_type).toBe('uses');
  });

  it('summary direct_count and transitive_count are correct', () => {
    const result = analyzeImpact(connections, serviceNames, SVC_B);
    expect(result.summary.direct_count).toBe(2);   // A, C
    expect(result.summary.transitive_count).toBe(1); // D
  });
});
