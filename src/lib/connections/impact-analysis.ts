export type RiskLevel = 'high' | 'medium' | 'low';

export interface AffectedService {
  service_id: string;
  name: string;
  depth: number;
  risk: RiskLevel;
  via_connection_type: string;
}

export interface ImpactAnalysisResult {
  failing_service_id: string;
  failing_service_name: string;
  affected: AffectedService[];
  summary: {
    total: number;
    risk_level: RiskLevel;
    direct_count: number;
    transitive_count: number;
  };
}

interface ConnectionEdge {
  source_service_id: string;
  target_service_id: string;
  connection_type: string;
}

function depthToRisk(depth: number): RiskLevel {
  if (depth === 1) return 'high';
  if (depth === 2) return 'medium';
  return 'low';
}

function overallRisk(affected: AffectedService[]): RiskLevel {
  if (affected.some((a) => a.risk === 'high')) return 'high';
  if (affected.some((a) => a.risk === 'medium')) return 'medium';
  return 'low';
}

/**
 * Analyzes the blast radius when a given service fails.
 *
 * Direction: source_service uses target_service (source → target).
 * If target goes down, all sources that use it are affected (and their upstreams).
 *
 * Uses BFS on the reverse graph (target → sources).
 */
export function analyzeImpact(
  connections: ConnectionEdge[],
  serviceNames: Map<string, string>,
  failingServiceId: string,
): ImpactAnalysisResult {
  // Build reverse graph: target_id → [{ source_id, connection_type }]
  const reverseGraph = new Map<string, Array<{ sourceId: string; type: string }>>();
  for (const conn of connections) {
    const deps = reverseGraph.get(conn.target_service_id) ?? [];
    deps.push({ sourceId: conn.source_service_id, type: conn.connection_type });
    reverseGraph.set(conn.target_service_id, deps);
  }

  // BFS: starting from failingServiceId, find all dependents
  const visited = new Map<string, { depth: number; type: string }>();
  visited.set(failingServiceId, { depth: 0, type: '' });

  const queue: Array<{ serviceId: string; depth: number }> = [
    { serviceId: failingServiceId, depth: 0 },
  ];

  while (queue.length > 0) {
    const { serviceId, depth } = queue.shift()!;
    const dependents = reverseGraph.get(serviceId) ?? [];
    for (const { sourceId, type } of dependents) {
      if (!visited.has(sourceId)) {
        visited.set(sourceId, { depth: depth + 1, type });
        queue.push({ serviceId: sourceId, depth: depth + 1 });
      }
    }
  }

  // Build result — exclude the failing service itself
  const affected: AffectedService[] = [];
  for (const [serviceId, { depth, type }] of visited.entries()) {
    if (serviceId === failingServiceId) continue;
    affected.push({
      service_id: serviceId,
      name: serviceNames.get(serviceId) ?? serviceId.slice(0, 8),
      depth,
      risk: depthToRisk(depth),
      via_connection_type: type,
    });
  }

  // Sort: depth asc, then name asc
  affected.sort((a, b) => a.depth - b.depth || a.name.localeCompare(b.name));

  const directCount = affected.filter((a) => a.depth === 1).length;
  const transitiveCount = affected.filter((a) => a.depth > 1).length;

  return {
    failing_service_id: failingServiceId,
    failing_service_name: serviceNames.get(failingServiceId) ?? failingServiceId.slice(0, 8),
    affected,
    summary: {
      total: affected.length,
      risk_level: affected.length === 0 ? 'low' : overallRisk(affected),
      direct_count: directCount,
      transitive_count: transitiveCount,
    },
  };
}
