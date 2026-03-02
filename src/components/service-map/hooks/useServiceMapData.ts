'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useProjectConnections, useCreateConnection, useDeleteConnection } from '@/lib/queries/connections';
import { useProjectServices, useCatalogServices, useRemoveProjectService } from '@/lib/queries/services';
import { useLatestHealthChecks, useRunHealthCheck } from '@/lib/queries/health-checks';
import { useServiceDependencies } from '@/lib/queries/dependencies';
import { useServiceAccounts } from '@/lib/queries/service-accounts';
import { useEnvVars } from '@/lib/queries/env-vars';
import { useLayerOverrides } from '@/lib/queries/layer-overrides';
import { createClient } from '@/lib/supabase/client';
import type {
  ProjectService,
  Service,
  ServiceDependency,
  ServiceAccount,
  EnvironmentVariable,
  HealthCheck,
  UserConnection,
} from '@/types';

const EMPTY_CONNECTIONS: UserConnection[] = [];

export interface ServiceMapData {
  // Project
  projectName: string;
  mainServiceId: string | null;

  // Services
  services: (ProjectService & { service: Service })[];
  servicesLoading: boolean;
  catalogServices: Service[];
  catalogLoading: boolean;
  removeService: ReturnType<typeof useRemoveProjectService>;

  // Health checks
  healthChecks: Record<string, HealthCheck>;
  runHealthCheck: ReturnType<typeof useRunHealthCheck>;

  // Dependencies
  dependencies: ServiceDependency[];
  depsLoading: boolean;

  // Service accounts
  serviceAccounts: ServiceAccount[];

  // Environment variables
  envVars: EnvironmentVariable[];

  // Connections
  userConnections: UserConnection[];
  connectionsLoading: boolean;
  createConnectionRef: React.RefObject<ReturnType<typeof useCreateConnection>>;
  deleteConnectionRef: React.RefObject<ReturnType<typeof useDeleteConnection>>;

  // Layer overrides
  layerOverrides: Record<string, string>; // service_id → dashboard_layer
}

// 데모 API 응답 타입
interface DemoApiResponse {
  project?: { name?: string; main_service_id?: string | null };
  services?: (ProjectService & { service: Service })[];
  dependencies?: ServiceDependency[];
  userConnections?: UserConnection[];
  envVars?: EnvironmentVariable[];
  layerOverrides?: { service_id: string; dashboard_layer: string | null }[];
}

export function useServiceMapData(projectId: string, isDemo = false): ServiceMapData {
  const supabaseRef = useRef(createClient());

  // Project name + main_service_id
  const [projectName, setProjectName] = useState('내 앱');
  const [mainServiceId, setMainServiceId] = useState<string | null>(null);

  // 데모 모드 전용 상태
  const [demoData, setDemoData] = useState<{
    services: (ProjectService & { service: Service })[];
    dependencies: ServiceDependency[];
    connections: UserConnection[];
    envVars: EnvironmentVariable[];
    layerOverrides: Record<string, string>;
  }>({
    services: [],
    dependencies: [],
    connections: [],
    envVars: [],
    layerOverrides: {},
  });
  const [demoLoading, setDemoLoading] = useState(isDemo);

  useEffect(() => {
    if (isDemo) {
      setDemoLoading(true);
      fetch(`/api/demo/project/${projectId}`)
        .then((r) => r.ok ? r.json() as Promise<DemoApiResponse> : null)
        .then((json) => {
          if (!json) return;
          if (json.project) {
            setProjectName(json.project.name ?? '내 앱');
            setMainServiceId(json.project.main_service_id ?? null);
          }
          const overridesMap: Record<string, string> = {};
          for (const o of json.layerOverrides ?? []) {
            if (o.dashboard_layer) overridesMap[o.service_id] = o.dashboard_layer;
          }
          setDemoData({
            services: json.services ?? [],
            dependencies: json.dependencies ?? [],
            connections: json.userConnections ?? [],
            envVars: json.envVars ?? [],
            layerOverrides: overridesMap,
          });
        })
        .catch(() => {})
        .finally(() => setDemoLoading(false));
      return;
    }

    const supabase = supabaseRef.current;
    const fetchProject = async () => {
      const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      if (project) {
        setProjectName(project.name);
        setMainServiceId((project as Record<string, unknown>).main_service_id as string | null ?? null);
      }
    };
    fetchProject();
  }, [projectId, isDemo]);

  // TanStack Query hooks — 데모 모드에서는 빈 projectId로 비활성화 (enabled: !!projectId)
  const queryProjectId = isDemo ? '' : projectId;
  const { data: services = [], isLoading: servicesLoading } = useProjectServices(queryProjectId);
  const { data: catalogServices = [], isLoading: catalogLoading } = useCatalogServices();
  const { data: healthChecks = {} } = useLatestHealthChecks(queryProjectId);
  const runHealthCheck = useRunHealthCheck();
  const removeService = useRemoveProjectService(queryProjectId);

  // Dependencies via TanStack Query
  const { data: dependencies = [], isLoading: depsLoading } = useServiceDependencies();

  // Service accounts
  const { data: serviceAccounts = [] } = useServiceAccounts(queryProjectId);

  // Environment variables
  const { data: envVars = [] } = useEnvVars(queryProjectId);

  // Fetch user connections
  const { data: userConnections = EMPTY_CONNECTIONS, isLoading: connectionsLoading } = useProjectConnections(queryProjectId);
  const createConnectionMutation = useCreateConnection(queryProjectId);
  const deleteConnectionMutation = useDeleteConnection(queryProjectId);

  // Layer overrides (memoized to prevent infinite re-render)
  const { data: layerOverridesRaw = [] } = useLayerOverrides(queryProjectId);
  const layerOverrides = useMemo(() => {
    if (isDemo) return demoData.layerOverrides;
    const map: Record<string, string> = {};
    for (const o of layerOverridesRaw) {
      if (o.dashboard_layer) map[o.service_id] = o.dashboard_layer;
    }
    return map;
  }, [isDemo, demoData.layerOverrides, layerOverridesRaw]);

  // Stable refs for mutations
  const createConnectionRef = useRef(createConnectionMutation);
  createConnectionRef.current = createConnectionMutation;
  const deleteConnectionRef = useRef(deleteConnectionMutation);
  deleteConnectionRef.current = deleteConnectionMutation;

  return {
    projectName,
    mainServiceId,
    services: isDemo ? demoData.services : services,
    servicesLoading: isDemo ? demoLoading : servicesLoading,
    catalogServices,
    catalogLoading,
    removeService,
    healthChecks,
    runHealthCheck,
    dependencies: isDemo ? demoData.dependencies : dependencies,
    depsLoading: isDemo ? demoLoading : depsLoading,
    serviceAccounts,
    envVars: isDemo ? demoData.envVars : envVars,
    userConnections: isDemo ? demoData.connections : userConnections,
    connectionsLoading: isDemo ? demoLoading : connectionsLoading,
    createConnectionRef,
    deleteConnectionRef,
    layerOverrides,
  };
}
