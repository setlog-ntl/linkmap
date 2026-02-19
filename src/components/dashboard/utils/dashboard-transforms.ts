import type { ServiceCardData, HealthCheckStatus } from '@/types';

export interface HealthDistribution {
  healthy: number;
  degraded: number;
  unhealthy: number;
  unknown: number;
  total: number;
}

export function computeHealthDistribution(
  allCards: ServiceCardData[],
  healthChecks: Record<string, { status: HealthCheckStatus }>,
): HealthDistribution {
  const dist: HealthDistribution = { healthy: 0, degraded: 0, unhealthy: 0, unknown: 0, total: allCards.length };

  for (const card of allCards) {
    const check = healthChecks[card.projectServiceId];
    if (!check) {
      dist.unknown++;
    } else {
      dist[check.status]++;
    }
  }
  return dist;
}

export interface LayerGroup {
  layer: string;
  color: string;
  services: ServiceCardData[];
}

export function groupConnectionsByLayer(allCards: ServiceCardData[]): LayerGroup[] {
  const layers: Record<string, ServiceCardData[]> = {};
  for (const card of allCards) {
    const key = card.dashboardLayer;
    if (!layers[key]) layers[key] = [];
    layers[key].push(card);
  }

  const LAYER_META: Record<string, string> = {
    frontend: '#4ade80',
    backend: '#60a5fa',
    devtools: '#fb923c',
  };

  return Object.entries(layers).map(([layer, services]) => ({
    layer,
    color: LAYER_META[layer] ?? '#a1a1aa',
    services,
  }));
}
