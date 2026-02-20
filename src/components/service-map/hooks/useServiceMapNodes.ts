'use client';

import { useMemo, useCallback, useRef } from 'react';
import { type Edge, type Node, MarkerType } from '@xyflow/react';
import { allCategoryLabels, allCategoryEmojis, domainLabels, domainIcons } from '@/lib/constants/service-filters';
import { getCategoryStyle } from '@/lib/constants/category-styles';
import { easyCategoryLabels, easyCategoryEmojis, serviceCategoryToEasy } from '@/lib/constants/easy-categories';
import type { GroupMode, StatusFilter } from '@/components/service-map/map-toolbar';
import type { ViewMode } from '@/stores/service-map-store';
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
  UserConnectionType,
} from '@/types';

export interface UseServiceMapNodesParams {
  // Data
  services: (ProjectService & { service: Service })[];
  dependencies: ServiceDependency[];
  healthChecks: Record<string, HealthCheck>;
  serviceAccounts: ServiceAccount[];
  envVars: EnvironmentVariable[];
  userConnections: UserConnection[];

  // UI state
  projectName: string;
  groupMode: GroupMode;
  searchQuery: string;
  statusFilter: StatusFilter;
  expandedNodeId: string | null;
  viewMode: ViewMode;
  collapsedGroups: Set<string>;
  connectMode: boolean;
  toggleGroupCollapsed: (groupKey: string) => void;

  // Handlers
  handleDeleteUserConnection: (edgeId: string) => void;
}

export interface UseServiceMapNodesReturn {
  rawNodes: Node[];
  rawEdges: Edge[];
  serviceNames: Record<string, string>;
  filteredServices: (ProjectService & { service: Service })[];
  currentServiceIds: Set<string>;
  relevantDependencies: ServiceDependency[];
  selectedServiceDeps: (serviceId: string | undefined) => ServiceDependency[];
  serviceIdToNodeId: Map<string, string>;
}

export function useServiceMapNodes(params: UseServiceMapNodesParams): UseServiceMapNodesReturn {
  const {
    services,
    dependencies,
    healthChecks,
    serviceAccounts,
    envVars,
    userConnections,
    projectName,
    groupMode,
    searchQuery,
    statusFilter,
    expandedNodeId,
    viewMode,
    collapsedGroups,
    connectMode,
    toggleGroupCollapsed,
    handleDeleteUserConnection,
  } = params;

  // Stable ref for toggleGroupCollapsed to avoid infinite re-render loop
  const toggleGroupCollapsedRef = useRef(toggleGroupCollapsed);
  toggleGroupCollapsedRef.current = toggleGroupCollapsed;

  // Service name lookup
  const serviceNames = useMemo(() => {
    const map: Record<string, string> = {};
    services.forEach((ps) => {
      if (ps.service) map[ps.service.id] = ps.service.name;
    });
    return map;
  }, [services]);

  // Filter services by status
  const filteredServices = useMemo(() => {
    if (statusFilter === 'all') return services;
    return services.filter((ps) => ps.status === statusFilter);
  }, [services, statusFilter]);

  // Current service IDs
  const currentServiceIds = useMemo(() => {
    return new Set(filteredServices.map((ps) => ps.service_id));
  }, [filteredServices]);

  // Relevant dependencies
  const relevantDependencies = useMemo(() => {
    return dependencies.filter(
      (dep) => currentServiceIds.has(dep.service_id) && currentServiceIds.has(dep.depends_on_service_id)
    );
  }, [dependencies, currentServiceIds]);

  // Selected service deps (returned as a function to avoid needing selectedService in params)
  const selectedServiceDeps = useCallback(
    (serviceId: string | undefined) => {
      if (!serviceId) return [];
      return dependencies.filter((dep) => dep.service_id === serviceId);
    },
    [dependencies]
  );

  // Map service_id to project_service node id
  const serviceIdToNodeId = useMemo(() => {
    const map = new Map<string, string>();
    filteredServices.forEach((ps) => {
      map.set(ps.service_id, ps.id);
    });
    return map;
  }, [filteredServices]);

  // Build nodes
  const rawNodes = useMemo<Node[]>(() => {
    const nodes: Node[] = [
      {
        id: 'app',
        type: 'app',
        position: { x: 0, y: 0 },
        data: { label: projectName },
      },
    ];

    const groups = new Map<string, { label: string; emoji: string; childCount: number }>();

    filteredServices.forEach((ps) => {
      const category = (ps.service?.category as ServiceCategory) || 'other';
      const domain = ps.service?.domain as ServiceDomain | undefined;
      const isMatch = searchQuery === '' || ps.service?.name.toLowerCase().includes(searchQuery.toLowerCase());

      let groupKey: string;
      if (groupMode === 'easy') {
        const easyKey = serviceCategoryToEasy[category] || 'analytics_other';
        groupKey = easyKey;
        if (!groups.has(groupKey)) {
          groups.set(groupKey, {
            label: easyCategoryLabels[easyKey],
            emoji: easyCategoryEmojis[easyKey],
            childCount: 0,
          });
        }
      } else if (groupMode === 'domain' && domain) {
        groupKey = domain;
        if (!groups.has(groupKey)) {
          groups.set(groupKey, { label: domainLabels[domain], emoji: domainIcons[domain], childCount: 0 });
        }
      } else {
        groupKey = category;
        if (!groups.has(groupKey)) {
          groups.set(groupKey, {
            label: allCategoryLabels[category] || category,
            emoji: allCategoryEmojis[category] || '',
            childCount: 0,
          });
        }
      }

      // Increment child count
      const g = groups.get(groupKey)!;
      g.childCount++;

      // Skip nodes in collapsed groups
      if (collapsedGroups.has(groupKey)) return;

      // Cost estimate
      const estimate = ps.service?.monthly_cost_estimate;
      let costEstimate: string | undefined;
      if (estimate && typeof estimate === 'object') {
        const vals = Object.values(estimate);
        if (vals.length > 0) costEstimate = vals[0] as string;
      }

      const iconSlug = ps.service?.slug;
      const hc = healthChecks[ps.id];
      const isExpanded = expandedNodeId === ps.id;

      // Connection count for this service
      const connectionCount = userConnections.filter(
        (c) => c.source_service_id === ps.service_id || c.target_service_id === ps.service_id
      ).length;

      // Service account status
      const serviceAccount = serviceAccounts.find((sa) => sa.service_id === ps.service_id);
      const accountStatus = serviceAccount?.status;
      // GitHub login for identity display
      const githubLogin = serviceAccount?.oauth_metadata
        ? (serviceAccount.oauth_metadata as Record<string, string>).login || null
        : null;

      nodes.push({
        id: ps.id,
        type: 'service',
        position: { x: 0, y: 0 },
        data: {
          label: ps.service?.name || 'Unknown',
          category,
          status: ps.status,
          costEstimate,
          freeTierQuality: ps.service?.free_tier_quality,
          iconSlug,
          highlighted: isMatch,
          // Phase 2A: health data
          healthStatus: hc?.status,
          healthCheck: hc,
          envVarCount: envVars.filter((ev) => ev.service_id === ps.service_id).length,
          requiredEnvVarCount: ps.service?.required_env_vars?.length || 0,
          // Phase 2A: expanded mode
          expanded: isExpanded,
          // Phase 2B: view mode
          viewMode,
          // Phase 3A: connection count
          connectionCount,
          // Service account status + identity
          accountStatus,
          githubLogin,
        },
      });
    });

    // Add group background nodes
    groups.forEach((value, key) => {
      const isCollapsed = collapsedGroups.has(key);
      nodes.push({
        id: `group-${key}`,
        type: 'group',
        position: { x: 0, y: 0 },
        data: {
          label: value.label,
          emoji: value.emoji,
          collapsed: isCollapsed,
          childCount: value.childCount,
          groupKey: key,
          onToggleCollapse: () => toggleGroupCollapsedRef.current(key),
        },
        style: { zIndex: -1 },
      });
    });

    return nodes;
  }, [filteredServices, projectName, groupMode, searchQuery, healthChecks, expandedNodeId, viewMode, collapsedGroups, userConnections, serviceAccounts, envVars]);

  // Build edges
  const rawEdges = useMemo<Edge[]>(() => {
    const edges: Edge[] = [];

    // App -> service edges
    filteredServices.forEach((ps) => {
      // Skip edges to nodes in collapsed groups
      const category = (ps.service?.category as ServiceCategory) || 'other';
      let groupKey: string;
      if (groupMode === 'easy') {
        groupKey = serviceCategoryToEasy[category] || 'analytics_other';
      } else if (groupMode === 'domain' && ps.service?.domain) {
        groupKey = ps.service.domain;
      } else {
        groupKey = category;
      }
      if (collapsedGroups.has(groupKey)) return;

      // Use gradient stroke for connected services with known category
      const gradientId = `url(#edge-gradient-${category})`;
      const hasGradient = ps.status === 'connected' && [
        'auth', 'database', 'deploy', 'payment', 'ai', 'monitoring', 'storage',
      ].includes(category);

      edges.push({
        id: `app-${ps.id}`,
        source: 'app',
        target: ps.id,
        type: 'smoothstep',
        animated: ps.status === 'connected',
        style: {
          stroke: hasGradient
            ? gradientId
            : ps.status === 'connected'
              ? 'var(--chart-2)'
              : ps.status === 'error'
                ? 'var(--destructive)'
                : 'var(--border)',
          strokeWidth: ps.status === 'connected' ? 2.5 : 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: ps.status === 'connected'
            ? (getCategoryStyle(category).hexColor || 'var(--chart-2)')
            : ps.status === 'error'
              ? 'var(--destructive)'
              : 'var(--border)',
        },
        label: ps.status === 'connected' ? '연결됨' : ps.status === 'error' ? '오류' : undefined,
        labelStyle: { fontSize: 10, fill: 'var(--muted-foreground)' },
        labelBgStyle: { fill: 'var(--background)', fillOpacity: 0.8 },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 4,
      });
    });

    // Dependency edges
    relevantDependencies.forEach((dep) => {
      const sourceNodeId = serviceIdToNodeId.get(dep.service_id);
      const targetNodeId = serviceIdToNodeId.get(dep.depends_on_service_id);
      if (sourceNodeId && targetNodeId) {
        edges.push({
          id: `dep-${dep.id}`,
          source: sourceNodeId,
          target: targetNodeId,
          type: 'dependency',
          data: { dependencyType: dep.dependency_type as DependencyType },
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
          type: 'userConnection',
          data: {
            connectionType: conn.connection_type,
            connectMode,
            onDelete: handleDeleteUserConnection,
          },
        });
      }
    });

    return edges;
  }, [filteredServices, relevantDependencies, userConnections, serviceIdToNodeId, connectMode, handleDeleteUserConnection, collapsedGroups, groupMode]);

  return {
    rawNodes,
    rawEdges,
    serviceNames,
    filteredServices,
    currentServiceIds,
    relevantDependencies,
    selectedServiceDeps,
    serviceIdToNodeId,
  };
}
