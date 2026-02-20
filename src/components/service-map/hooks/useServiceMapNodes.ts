'use client';

import { useMemo, useCallback } from 'react';
import { type Edge, type Node } from '@xyflow/react';
import { domainToZone, type ZoneKey } from '@/lib/layout/zone-layout';
import type {
  ProjectService,
  Service,
  ServiceCategory,
  ServiceDomain,
  ServiceDependency,
  DependencyType,
  HealthCheck,
  ServiceAccount,
  EnvironmentVariable,
  UserConnection,
} from '@/types';

export interface UseServiceMapNodesParams {
  services: (ProjectService & { service: Service })[];
  dependencies: ServiceDependency[];
  healthChecks: Record<string, HealthCheck>;
  serviceAccounts: ServiceAccount[];
  envVars: EnvironmentVariable[];
  userConnections: UserConnection[];
  searchQuery: string;
  handleDeleteUserConnection: (edgeId: string) => void;
  mainServiceId: string | null;
  layerOverrides: Record<string, string>;
  pendingOverrides: Record<string, ZoneKey>;
}

export interface UseServiceMapNodesReturn {
  serviceNodes: Node[];
  rawEdges: Edge[];
  serviceNames: Record<string, string>;
  filteredServices: (ProjectService & { service: Service })[];
  currentServiceIds: Set<string>;
  relevantDependencies: ServiceDependency[];
  selectedServiceDeps: (serviceId: string | undefined) => ServiceDependency[];
  serviceIdToNodeId: Map<string, string>;
  getDomain: (nodeId: string) => ServiceDomain | null;
}

export function useServiceMapNodes(params: UseServiceMapNodesParams): UseServiceMapNodesReturn {
  const {
    services,
    dependencies,
    healthChecks,
    serviceAccounts,
    envVars,
    userConnections,
    searchQuery,
    handleDeleteUserConnection,
    mainServiceId,
    layerOverrides,
    pendingOverrides,
  } = params;

  const serviceNames = useMemo(() => {
    const map: Record<string, string> = {};
    services.forEach((ps) => {
      if (ps.service) map[ps.service.id] = ps.service.name;
    });
    return map;
  }, [services]);

  const filteredServices = services;

  const currentServiceIds = useMemo(() => {
    return new Set(filteredServices.map((ps) => ps.service_id));
  }, [filteredServices]);

  const relevantDependencies = useMemo(() => {
    return dependencies.filter(
      (dep) => currentServiceIds.has(dep.service_id) && currentServiceIds.has(dep.depends_on_service_id)
    );
  }, [dependencies, currentServiceIds]);

  const selectedServiceDeps = useCallback(
    (serviceId: string | undefined) => {
      if (!serviceId) return [];
      return dependencies.filter((dep) => dep.service_id === serviceId);
    },
    [dependencies]
  );

  const serviceIdToNodeId = useMemo(() => {
    const map = new Map<string, string>();
    filteredServices.forEach((ps) => {
      map.set(ps.service_id, ps.id);
    });
    return map;
  }, [filteredServices]);

  // nodeId → service_id lookup
  const nodeIdToServiceId = useMemo(() => {
    const map = new Map<string, string>();
    filteredServices.forEach((ps) => {
      map.set(ps.id, ps.service_id);
    });
    return map;
  }, [filteredServices]);

  // Map nodeId -> domain, respecting pendingOverrides → layerOverrides → service.domain
  const nodeDomainMap = useMemo(() => {
    const map = new Map<string, ServiceDomain>();
    filteredServices.forEach((ps) => {
      // Check pending override first (nodeId-keyed)
      const pendingZone = pendingOverrides[ps.id];
      if (pendingZone) {
        map.set(ps.id, pendingZone as unknown as ServiceDomain);
        return;
      }
      // Check layer override (service_id-keyed)
      const overrideLayer = layerOverrides[ps.service_id];
      if (overrideLayer) {
        map.set(ps.id, overrideLayer as unknown as ServiceDomain);
        return;
      }
      // Default: service domain
      const domain = ps.service?.domain as ServiceDomain | undefined;
      if (domain) map.set(ps.id, domain);
    });
    return map;
  }, [filteredServices, pendingOverrides, layerOverrides]);

  const getDomain = useCallback(
    (nodeId: string): ServiceDomain | null => nodeDomainMap.get(nodeId) ?? null,
    [nodeDomainMap]
  );

  // Build service nodes (no zone/group nodes - zone layout will add those)
  const serviceNodes = useMemo<Node[]>(() => {
    return filteredServices.map((ps) => {
      const category = (ps.service?.category as ServiceCategory) || 'other';
      const domain = nodeDomainMap.get(ps.id) || (ps.service?.domain as ServiceDomain | undefined);
      const isMatch = searchQuery === '' || ps.service?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const iconSlug = ps.service?.slug;
      const isMainService = mainServiceId === ps.id;

      return {
        id: ps.id,
        type: 'service',
        position: { x: 0, y: 0 },
        data: {
          label: ps.service?.name || 'Unknown',
          category,
          status: ps.status,
          iconSlug,
          highlighted: isMatch,
          domain: domain || 'integration',
          isMainService,
        },
      };
    });
  }, [filteredServices, searchQuery, mainServiceId, nodeDomainMap]);

  // Build edges
  const rawEdges = useMemo<Edge[]>(() => {
    const edges: Edge[] = [];

    // Dependency edges
    relevantDependencies.forEach((dep) => {
      const sourceNodeId = serviceIdToNodeId.get(dep.service_id);
      const targetNodeId = serviceIdToNodeId.get(dep.depends_on_service_id);
      if (sourceNodeId && targetNodeId) {
        edges.push({
          id: `dep-${dep.id}`,
          source: sourceNodeId,
          target: targetNodeId,
          type: 'connection',
          data: { connectionType: dep.dependency_type as DependencyType },
        });
      }
    });

    // User connection edges
    userConnections.forEach((conn) => {
      const sourceNodeId = serviceIdToNodeId.get(conn.source_service_id);
      const targetNodeId = serviceIdToNodeId.get(conn.target_service_id);
      if (sourceNodeId && targetNodeId) {
        edges.push({
          id: `uc-${conn.id}`,
          source: sourceNodeId,
          target: targetNodeId,
          type: 'connection',
          data: {
            connectionType: conn.connection_type,
            onDelete: handleDeleteUserConnection,
          },
        });
      }
    });

    return edges;
  }, [relevantDependencies, userConnections, serviceIdToNodeId, handleDeleteUserConnection]);

  return {
    serviceNodes,
    rawEdges,
    serviceNames,
    filteredServices,
    currentServiceIds,
    relevantDependencies,
    selectedServiceDeps,
    serviceIdToNodeId,
    getDomain,
  };
}
