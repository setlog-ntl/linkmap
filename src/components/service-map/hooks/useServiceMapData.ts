'use client';

import { useRef, useState, useEffect } from 'react';
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

export function useServiceMapData(projectId: string): ServiceMapData {
  const supabaseRef = useRef(createClient());

  // Project name + main_service_id
  const [projectName, setProjectName] = useState('내 앱');
  const [mainServiceId, setMainServiceId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseRef.current;
    const fetchProject = async () => {
      const { data: project } = await supabase
        .from('projects')
        .select('name, main_service_id')
        .eq('id', projectId)
        .single();
      if (project) {
        setProjectName(project.name);
        setMainServiceId(project.main_service_id ?? null);
      }
    };
    fetchProject();
  }, [projectId]);

  // TanStack Query hooks
  const { data: services = [], isLoading: servicesLoading } = useProjectServices(projectId);
  const { data: catalogServices = [], isLoading: catalogLoading } = useCatalogServices();
  const { data: healthChecks = {} } = useLatestHealthChecks(projectId);
  const runHealthCheck = useRunHealthCheck();
  const removeService = useRemoveProjectService(projectId);

  // Dependencies via TanStack Query
  const { data: dependencies = [], isLoading: depsLoading } = useServiceDependencies();

  // Service accounts
  const { data: serviceAccounts = [] } = useServiceAccounts(projectId);

  // Environment variables
  const { data: envVars = [] } = useEnvVars(projectId);

  // Fetch user connections
  const { data: userConnections = EMPTY_CONNECTIONS, isLoading: connectionsLoading } = useProjectConnections(projectId);
  const createConnectionMutation = useCreateConnection(projectId);
  const deleteConnectionMutation = useDeleteConnection(projectId);

  // Layer overrides
  const { data: layerOverridesRaw = [] } = useLayerOverrides(projectId);
  const layerOverrides: Record<string, string> = {};
  for (const o of layerOverridesRaw) {
    if (o.dashboard_layer) layerOverrides[o.service_id] = o.dashboard_layer;
  }

  // Stable refs for mutations
  const createConnectionRef = useRef(createConnectionMutation);
  createConnectionRef.current = createConnectionMutation;
  const deleteConnectionRef = useRef(deleteConnectionMutation);
  deleteConnectionRef.current = deleteConnectionMutation;

  return {
    projectName,
    mainServiceId,
    services,
    servicesLoading,
    catalogServices,
    catalogLoading,
    removeService,
    healthChecks,
    runHealthCheck,
    dependencies,
    depsLoading,
    serviceAccounts,
    envVars,
    userConnections,
    connectionsLoading,
    createConnectionRef,
    deleteConnectionRef,
    layerOverrides,
  };
}
